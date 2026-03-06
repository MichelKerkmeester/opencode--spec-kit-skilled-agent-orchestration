// ---------------------------------------------------------------
// MODULE: Stable Indexing API
// ---------------------------------------------------------------
// @public — scripts should import from here, not core/ or handlers/ internals.
// AI-WHY: ARCH-1 exposes only the runtime bootstrap and indexing hooks needed
// by reindex orchestration without widening the general public surface.

import type { EmbeddingProfile, MCPResponse } from '@spec-kit/shared/types';

import { init as initDbState, setEmbeddingModelReady } from '../core';
import { handleMemoryIndexScan } from '../handlers';

import { generateEmbedding, getEmbeddingProfile } from './providers';
import { initHybridSearch, vectorIndex } from './search';
import { initAccessTracker, initCheckpoints } from './storage';

export interface MemoryIndexScanArgs {
  specFolder?: string | null;
  force?: boolean;
  includeConstitutional?: boolean;
  includeSpecDocs?: boolean;
  incremental?: boolean;
}

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

export async function warmEmbeddingModel(input: string = 'warmup test'): Promise<EmbeddingProfile | null> {
  await generateEmbedding(input);
  setEmbeddingModelReady(true);
  return getEmbeddingProfile() as EmbeddingProfile | null;
}

export async function runMemoryIndexScan(args: MemoryIndexScanArgs): Promise<MCPResponse> {
  return handleMemoryIndexScan(args);
}

export function closeIndexingRuntime(): void {
  vectorIndex.closeDb();
}
