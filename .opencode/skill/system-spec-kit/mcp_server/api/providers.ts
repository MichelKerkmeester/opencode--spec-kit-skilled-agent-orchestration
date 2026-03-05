// ---------------------------------------------------------------
// MODULE: Stable Providers API
// ---------------------------------------------------------------
// @public — scripts should import from here, not lib/ internals.
// AI-WHY: ARCH-1 re-exports provider functions through a stable surface.

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
} from '../lib/providers/embeddings';

export * as retryManager from '../lib/providers/retry-manager';
