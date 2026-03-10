// ---------------------------------------------------------------
// MODULE: Embedding Pipeline
// ---------------------------------------------------------------

import path from 'path';
import type Database from 'better-sqlite3';

import * as embeddings from '../../lib/providers/embeddings';
import { computeContentHash, lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache';
import { normalizeContentForEmbedding } from '../../lib/parsing/content-normalizer';
import type { ParsedMemory } from '../../lib/parsing/memory-parser';
import { toErrorMessage } from '../../utils';

export interface EmbeddingResult {
  embedding: Float32Array | null;
  status: 'success' | 'pending';
  failureReason: string | null;
}

function computeCacheKey(content: string, model: string): string {
  void model;
  return computeContentHash(normalizeContentForEmbedding(content));
}

export async function generateOrCacheEmbedding(
  database: Database.Database,
  parsed: ParsedMemory,
  filePath: string,
  asyncEmbedding: boolean,
): Promise<EmbeddingResult> {
  let embedding: Float32Array | null = null;
  let embeddingStatus: 'success' | 'pending' = 'pending';
  let embeddingFailureReason: string | null = null;
  const modelId = embeddings.getModelName();
  const cacheKey = computeCacheKey(parsed.content, modelId);

  if (asyncEmbedding) {
    const cachedBuf = lookupEmbedding(database, cacheKey, modelId);
    if (cachedBuf) {
      embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
      embeddingStatus = 'success';
      console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)} (async mode)`);
    } else {
      embeddingFailureReason = 'Deferred: async_embedding requested';
      console.error(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
    }
  } else {
    try {
      // Check persistent embedding cache before calling provider
      const cachedBuf = lookupEmbedding(database, cacheKey, modelId);
      if (cachedBuf) {
        // Cache hit: convert Buffer to Float32Array
        embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
        embeddingStatus = 'success';
        console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)}`);
      } else {
        // Cache miss: normalize content then generate embedding via provider
        // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
        const normalizedContent = normalizeContentForEmbedding(parsed.content);
        embedding = await embeddings.generateDocumentEmbedding(normalizedContent);
        if (embedding) {
          embeddingStatus = 'success';
          // Store in persistent cache for future re-index
          const embBuf = Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
          storeEmbedding(database, cacheKey, modelId, embBuf, embedding.length);
          console.error(`[memory-save] Embedding cache MISS+STORE for ${path.basename(filePath)}`);
        } else {
          embeddingFailureReason = 'Embedding generation returned null';
          console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
        }
      }
    } catch (embedding_error: unknown) {
      const message = toErrorMessage(embedding_error);
      embeddingFailureReason = message;
      console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
    }
  }

  return {
    embedding,
    status: embeddingStatus,
    failureReason: embeddingFailureReason,
  };
}
