#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Reindex Embeddings
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. MODULE SETUP
--------------------------------------------------------------- */

import path from 'path';
import fs from 'fs';

/* ---------------------------------------------------------------
   2. TYPES
--------------------------------------------------------------- */

import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';

type VectorIndexModule = typeof import('@spec-kit/mcp-server/lib/search/vector-index');
type EmbeddingsModule = typeof import('@spec-kit/mcp-server/lib/providers/embeddings');
type CheckpointsModule = typeof import('@spec-kit/mcp-server/lib/storage/checkpoints');
type AccessTrackerModule = typeof import('@spec-kit/mcp-server/lib/storage/access-tracker');
type HybridSearchModule = typeof import('@spec-kit/mcp-server/lib/search/hybrid-search');
type CoreModule = typeof import('@spec-kit/mcp-server/core');
type HandlersModule = typeof import('@spec-kit/mcp-server/handlers');

interface ScanData {
  status: string;
  scanned: number;
  indexed: number;
  updated: number;
  unchanged: number;
  failed: number;
  constitutional?: {
    found: number;
    indexed: number;
    alreadyIndexed: number;
  };
  files?: { status: string; file: string; isConstitutional?: boolean }[];
}

function resolveMcpServerDistRoot(): string {
  const candidates: string[] = [
    path.resolve(__dirname, '../../../mcp_server/dist'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'core', 'index.js'))) {
      return candidate;
    }
  }

  throw new Error(
    `Unable to locate mcp_server/dist from ${__dirname}. Tried:\n - ${candidates.join('\n - ')}`
  );
}

const MCP_SERVER_DIST_ROOT: string = resolveMcpServerDistRoot();

function requireFromMcpServerDist<T>(...segments: string[]): T {
  const modulePath = path.join(MCP_SERVER_DIST_ROOT, ...segments);
  return require(modulePath) as T;
}

const vectorIndex = requireFromMcpServerDist<VectorIndexModule>('lib', 'search', 'vector-index');
const embeddings = requireFromMcpServerDist<EmbeddingsModule>('lib', 'providers', 'embeddings');
const checkpointsLib = requireFromMcpServerDist<CheckpointsModule>('lib', 'storage', 'checkpoints');
const accessTracker = requireFromMcpServerDist<AccessTrackerModule>('lib', 'storage', 'access-tracker');
const hybridSearch = requireFromMcpServerDist<HybridSearchModule>('lib', 'search', 'hybrid-search');
const core = requireFromMcpServerDist<CoreModule>('core');
const handlers = requireFromMcpServerDist<HandlersModule>('handlers');

/* ---------------------------------------------------------------
   3. REINDEX FUNCTION
--------------------------------------------------------------- */

async function reindex(): Promise<void> {
  console.log('='.repeat(60));
  console.log('MEMORY DATABASE REINDEX');
  console.log('='.repeat(60));
  console.log('');

  console.log('[1/5] Initializing database...');
  vectorIndex.initializeDb();

  console.log('[2/5] Initializing db-state module...');
  core.init({ vectorIndex, checkpoints: checkpointsLib, accessTracker, hybridSearch });

  console.log('[3/5] Warming up embedding model...');
  try {
    const start = Date.now();
    await embeddings.generateEmbedding('warmup test');
    const elapsed = Date.now() - start;
    core.setEmbeddingModelReady(true);
    console.log(`    Embedding model ready (${elapsed}ms)`);

    const profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
    console.log(`    Provider: ${profile?.provider}, Model: ${profile?.model}, Dim: ${profile?.dim}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('ERROR: Embedding warmup failed:', message);
    process.exit(1);
  }

  console.log('[4/5] Initializing search modules...');
  const database = vectorIndex.getDb();
  if (!database) {
    console.error('ERROR: Database not initialized after initializeDb(). Cannot proceed.');
    process.exit(1);
  }
  checkpointsLib.init(database);  accessTracker.init(database);
  hybridSearch.init(database, vectorIndex.vectorSearch);

  console.log('[5/5] Force reindexing all memory files...');
  console.log('');

  const result: MCPResponse = await handlers.handleMemoryIndexScan({
    force: true,
    includeConstitutional: true
  });

  if (result.content && result.content[0]) {
    const data: ScanData = JSON.parse(result.content[0].text);

    console.log('-'.repeat(60));
    console.log('REINDEX COMPLETE');
    console.log('-'.repeat(60));
    console.log(`Status:     ${data.status}`);
    console.log(`Scanned:    ${data.scanned} files`);
    console.log(`Indexed:    ${data.indexed} (new embeddings generated)`);
    console.log(`Updated:    ${data.updated}`);
    console.log(`Unchanged:  ${data.unchanged}`);
    console.log(`Failed:     ${data.failed}`);

    if (data.constitutional) {
      console.log('');
      console.log('Constitutional memories:');
      console.log(`  Found:     ${data.constitutional.found}`);
      console.log(`  Indexed:   ${data.constitutional.indexed}`);
      console.log(`  Already:   ${data.constitutional.alreadyIndexed}`);
    }

    if (data.files && data.files.length > 0) {
      console.log('');
      console.log('Changed files:');
      for (const f of data.files.slice(0, 15)) {
        console.log(`  [${f.status}] ${f.file}${f.isConstitutional ? ' (constitutional)' : ''}`);
      }
      if (data.files.length > 15) {
        console.log(`  ... and ${data.files.length - 15} more`);
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('STATUS=OK');
  }

  vectorIndex.closeDb();
}

/* ---------------------------------------------------------------
   4. ENTRY POINT
--------------------------------------------------------------- */

reindex().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : '';
  console.error('FATAL:', message);
  if (stack) console.error(stack);
  process.exit(1);
});
