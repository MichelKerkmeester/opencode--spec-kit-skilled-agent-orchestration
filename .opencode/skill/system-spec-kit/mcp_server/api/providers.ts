// ---------------------------------------------------------------
// MODULE: Stable Providers API
// ---------------------------------------------------------------
// @public — scripts should import from here, not lib/ internals.
// AI-WHY: ARCH-1 re-exports provider functions through a stable surface.

export { generateQueryEmbedding } from '../lib/providers/embeddings';
