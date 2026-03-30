// ────────────────────────────────────────────────────────────────
// MODULE: Providers
// ────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not lib/ internals.
// ARCH-1 re-exports provider functions through a stable surface.

export {
  generateEmbedding,
  generateQueryEmbedding,
  getEmbeddingProfile,
} from '../lib/providers/embeddings.js';

export * as retryManager from '../lib/providers/retry-manager.js';
