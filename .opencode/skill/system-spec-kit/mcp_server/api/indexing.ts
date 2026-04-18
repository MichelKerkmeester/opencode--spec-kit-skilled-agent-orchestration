// ────────────────────────────────────────────────────────────────
// MODULE: Indexing
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not core/ or handlers/ internals.
// ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
// By reindex orchestration without widening the general public surface.

import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';
import fs from 'node:fs';
import path from 'node:path';

import { init as initDbState, setEmbeddingModelReady } from '../core/index.js';
import { handleMemoryIndexScan } from '../handlers/index.js';
import { findSpecDocuments } from '../handlers/memory-index-discovery.js';
import {
  refreshGraphMetadata as refreshGraphMetadataForResolvedFolder,
  type GraphMetadataRefreshOptions,
  type GraphMetadataRefreshResult,
} from '../lib/graph/graph-metadata-parser.js';

import { generateEmbedding, getEmbeddingProfile } from './providers.js';
import { initHybridSearch, vectorIndex } from './search.js';
import { initAccessTracker, initCheckpoints } from './storage.js';

/** Arguments for memory index scan requests. */
export interface MemoryIndexScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
}

/** Initializes indexing runtime dependencies. */
export function initializeIndexingRuntime(): void {
  vectorIndex.initializeDb();

  initDbState({
    vectorIndex,
    checkpoints: { init: initCheckpoints },
    accessTracker: { init: initAccessTracker },
    hybridSearch: { init: initHybridSearch },
  });

  const database = vectorIndex.getDb();
  if (!database) {
    throw new Error('Database not initialized after initializeDb(). Cannot proceed.');
  }

  initCheckpoints(database);
  initAccessTracker(database);
  initHybridSearch(database, vectorIndex.vectorSearch);
}

/** Warms the embedding model and marks it as ready. */
export async function warmEmbeddingModel(input: string = 'warmup test'): Promise<EmbeddingProfile | null> {
  await generateEmbedding(input);
  setEmbeddingModelReady(true);
  return getEmbeddingProfile() as EmbeddingProfile | null;
}

/** Runs a memory index scan with the provided arguments. */
export async function runMemoryIndexScan(args: MemoryIndexScanArgs): Promise<MCPResponse> {
  return handleMemoryIndexScan(args);
}

function resolveSpecFolderPath(specFolder: string): string {
  if (path.isAbsolute(specFolder) && fs.existsSync(specFolder)) {
    return specFolder;
  }

  const cwd = process.cwd();
  const directCandidate = path.resolve(cwd, specFolder);
  if (fs.existsSync(directCandidate)) {
    return directCandidate;
  }

  const discoveredDocs = findSpecDocuments(cwd, { specFolder });
  if (discoveredDocs.length > 0) {
    return path.dirname(discoveredDocs[0]!);
  }

  const canonicalCandidate = path.resolve(cwd, '.opencode', 'specs', specFolder);
  if (fs.existsSync(canonicalCandidate)) {
    return canonicalCandidate;
  }

  const legacyCandidate = path.resolve(cwd, 'specs', specFolder);
  if (fs.existsSync(legacyCandidate)) {
    return legacyCandidate;
  }

  throw new Error(`Unable to resolve spec folder path for ${specFolder}`);
}

/** Refreshes graph metadata for a spec folder using an explicit follow-up entry point. */
export function refreshGraphMetadata(
  specFolder: string,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadataRefreshResult {
  return refreshGraphMetadataForResolvedFolder(resolveSpecFolderPath(specFolder), options);
}

/** Reindexes canonical spec docs for a spec folder using the standard incremental scan. */
export async function reindexSpecDocs(specFolder: string): Promise<MCPResponse> {
  return runMemoryIndexScan({
    specFolder,
    includeSpecDocs: true,
    includeConstitutional: false,
    incremental: true,
    force: false,
  });
}

/** Re-runs save-time enrichment as an explicit follow-up without changing the default save path. */
export async function runEnrichmentBackfill(specFolder: string): Promise<MCPResponse> {
  const previous = process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED;
  process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED = 'true';
  try {
    return await runMemoryIndexScan({
      specFolder,
      includeSpecDocs: true,
      includeConstitutional: false,
      incremental: true,
      force: false,
    });
  } finally {
    if (previous === undefined) {
      delete process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED;
    } else {
      process.env.SPECKIT_POST_INSERT_ENRICHMENT_ENABLED = previous;
    }
  }
}

/** Closes indexing runtime database connections. */
export function closeIndexingRuntime(): void {
  vectorIndex.closeDb();
}
