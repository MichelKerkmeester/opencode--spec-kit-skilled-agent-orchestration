#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Reindex Embeddings
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. REINDEX EMBEDDINGS
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. MODULE SETUP
──────────────────────────────────────────────────────────────── */

import {
  closeIndexingRuntime,
  initializeIndexingRuntime,
  runMemoryIndexScan,
  warmEmbeddingModel,
} from '@spec-kit/mcp-server/api/indexing';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

import type { MCPResponse } from '@spec-kit/shared/types';

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

/* ───────────────────────────────────────────────────────────────
   3. REINDEX FUNCTION
──────────────────────────────────────────────────────────────── */

async function reindex(): Promise<void> {
  console.log('='.repeat(60));
  console.log('MEMORY DATABASE REINDEX');
  console.log('='.repeat(60));
  console.log('');

  try {
    console.log('[1/5] Initializing database...');
    initializeIndexingRuntime();

    console.log('[2/5] Initializing db-state module...');
    console.log('    Runtime bootstrap completed via public api/indexing');

    console.log('[3/5] Warming up embedding model...');
    try {
      const start = Date.now();
      const profile = await warmEmbeddingModel('warmup test');
      const elapsed = Date.now() - start;
      console.log(`    Embedding model ready (${elapsed}ms)`);
      console.log(`    Provider: ${profile?.provider}, Model: ${profile?.model}, Dim: ${profile?.dim}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('ERROR: Embedding warmup failed:', message);
      process.exit(1);
    }

    console.log('[4/5] Initializing search modules...');
    console.log('    Search/storage modules initialized during runtime bootstrap');

    console.log('[5/5] Force reindexing all memory files...');
    console.log('');

    const result: MCPResponse = await runMemoryIndexScan({
      force: true,
      includeConstitutional: true
    });

    if (result.content && result.content[0]) {
      const data: ScanData = JSON.parse(result.content[0].text);

      console.log('');
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
    } else {
      console.warn('WARNING: Memory index scan returned no content to summarize');
      process.exit(1);
    }
  } finally {
    closeIndexingRuntime();
  }
}

export { reindex };

/* ───────────────────────────────────────────────────────────────
   4. ENTRY POINT
──────────────────────────────────────────────────────────────── */

if (require.main === module) {
  reindex().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : '';
    console.error('FATAL:', message);
    if (stack) console.error(stack);
    process.exit(1);
  });
}
