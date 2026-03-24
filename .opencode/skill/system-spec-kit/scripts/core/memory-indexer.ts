// ---------------------------------------------------------------
// MODULE: Memory Indexer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. MEMORY INDEXER
// ───────────────────────────────────────────────────────────────
// Handles persisting memory files to the vector index: embedding generation,
// Database storage, metadata updates, and DB-change notifications.

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

import { structuredLog } from '../utils';
import { generateDocumentEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import { vectorIndex } from '@spec-kit/mcp-server/api/search';
import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import type { CollectedDataFull } from '../extractors/collect-session-data';
import { extractQualityScore, extractQualityFlags } from '@spec-kit/shared/parsing/quality-extractors';
import { buildWeightedDocumentText, type WeightedDocumentSections } from '@spec-kit/shared/index';

type IndexingStatusValue =
  | 'indexed'
  | 'skipped_duplicate'
  | 'skipped_index_policy'
  | 'skipped_quality_gate'
  | 'skipped_embedding_unavailable'
  | 'failed_embedding';

interface WorkflowIndexingStatus {
  status: IndexingStatusValue;
  memoryId: number | null;
  reason?: string;
  errorMessage?: string;
}

function notifyDatabaseUpdated(): void {
  try {
    const dbDir = path.dirname(DB_UPDATED_FILE);
    if (!fsSync.existsSync(dbDir)) fsSync.mkdirSync(dbDir, { recursive: true });
    fsSync.writeFileSync(DB_UPDATED_FILE, Date.now().toString());
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('[workflow] Database notification error:', errMsg);
  }
}

// STD-014: Named constants for importance weighting formula
const IMPORTANCE_LENGTH_CAP = 10000;
const IMPORTANCE_LENGTH_WEIGHT = 0.3;
const IMPORTANCE_ANCHOR_CAP = 10;
const IMPORTANCE_ANCHOR_WEIGHT = 0.3;
const IMPORTANCE_RECENCY_WEIGHT = 0.2;
const IMPORTANCE_BASE_WEIGHT = 0.2;
const EMBEDDING_PERF_WARN_MS = 500;

/* ───────────────────────────────────────────────────────────────
   MEMORY INDEXING
------------------------------------------------------------------*/

async function indexMemory(
  contextDir: string,
  contextFilename: string,
  content: string,
  specFolderName: string,
  collectedData: CollectedDataFull | null = null,
  preExtractedTriggers: string[] = [],
  embeddingSections: WeightedDocumentSections | null = null,
): Promise<number | null> {
  const embeddingStart = Date.now();
  const weightedEmbeddingInput = buildWeightedDocumentText(
    embeddingSections ?? {
      title: contextFilename.replace('.md', ''),
      general: content,
    }
  );
  // ERR-001: Wrap embedding generation in try/catch
  let embedding: Float32Array | null;
  try {
    embedding = await generateDocumentEmbedding(weightedEmbeddingInput);
  } catch (embeddingError: unknown) {
    const errMsg = embeddingError instanceof Error ? embeddingError.message : String(embeddingError);
    structuredLog('error', 'Embedding generation threw', {
      error: errMsg,
      specFolder: specFolderName,
      file: contextFilename,
    });
    console.warn(`   Warning: Embedding generation failed: ${errMsg}`);
    return null;
  }

  if (!embedding) {
    console.warn('   Warning: Embedding generation returned null - skipping indexing');
    return null;
  }

  const embeddingTime = Date.now() - embeddingStart;

  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title: string = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');

  let triggerPhrases: string[] = [];
  try {
    // Start with pre-extracted triggers (from enriched sources), fall back to content extraction
    if (preExtractedTriggers.length > 0) {
      triggerPhrases = [...preExtractedTriggers];
      console.log(`   Using ${triggerPhrases.length} pre-extracted trigger phrases`);
    } else {
      triggerPhrases = extractTriggerPhrases(content);
      console.log(`   Extracted ${triggerPhrases.length} trigger phrases from content`);
    }

    // Merge manual phrases if available
    if (collectedData && collectedData._manualTriggerPhrases) {
      const manualPhrases = collectedData._manualTriggerPhrases;
      const existingLower = new Set(triggerPhrases.map((p) => p.toLowerCase()));
      for (const phrase of manualPhrases) {
        if (!existingLower.has(phrase.toLowerCase())) {
          triggerPhrases.push(phrase);
        }
      }
      console.log(`   Total: ${triggerPhrases.length} trigger phrases (${manualPhrases.length} manual)`);
    }
  } catch (triggerError: unknown) {
    const errMsg = triggerError instanceof Error ? triggerError.message : String(triggerError);
    structuredLog('warn', 'Trigger phrase extraction failed', {
      error: errMsg,
      contentLength: content.length
    });
    console.warn(`   Warning: Trigger extraction failed: ${errMsg}`);
    if (collectedData && collectedData._manualTriggerPhrases) {
      triggerPhrases = collectedData._manualTriggerPhrases;
      console.log(`   Using ${triggerPhrases.length} manual trigger phrases`);
    }
  }

  const contentLength = content.length;
  const anchorCount = (content.match(/<!-- (?:ANCHOR|anchor):/gi) || []).length;
  const lengthFactor = Math.min(contentLength / IMPORTANCE_LENGTH_CAP, 1) * IMPORTANCE_LENGTH_WEIGHT;
  const anchorFactor = Math.min(anchorCount / IMPORTANCE_ANCHOR_CAP, 1) * IMPORTANCE_ANCHOR_WEIGHT;
  const recencyFactor = IMPORTANCE_RECENCY_WEIGHT;
  const importanceWeight = Math.round((lengthFactor + anchorFactor + recencyFactor + IMPORTANCE_BASE_WEIGHT) * 100) / 100;
  const qualityScore = extractQualityScore(content);
  const qualityFlags = extractQualityFlags(content);

  // T11: Basic governance validation for script-side indexing
  if (!title || title.trim().length === 0) {
    console.warn('[memory-indexer] Skipping index: empty title');
    return null;
  }
  if (!content || content.trim().length === 0) {
    console.warn('[memory-indexer] Skipping index: empty content');
    return null;
  }
  console.warn(`[memory-indexer] Script-side index: ${specFolderName}/${contextFilename} (bypass MCP governance)`);

  // ERR-001: Wrap vector index write in try/catch
  let memoryId: number;
  try {
    memoryId = vectorIndex.indexMemory({
      specFolder: specFolderName,
      filePath: path.join(contextDir, contextFilename),
      anchorId: null,
      title: title,
      triggerPhrases: triggerPhrases,
      importanceWeight: importanceWeight,
      embedding: embedding,
      qualityScore,
      qualityFlags,
    });
  } catch (indexError: unknown) {
    const errMsg = indexError instanceof Error ? indexError.message : String(indexError);
    structuredLog('error', 'Vector index write failed', {
      error: errMsg,
      specFolder: specFolderName,
      file: contextFilename,
    });
    console.warn(`   Warning: Vector index write failed: ${errMsg}`);
    return null;
  }

  console.log(`   Embedding generated in ${embeddingTime}ms`);

  if (embeddingTime > EMBEDDING_PERF_WARN_MS) {
    console.warn(`   Warning: Embedding took ${embeddingTime}ms (target <${EMBEDDING_PERF_WARN_MS}ms)`);
  }

  notifyDatabaseUpdated();

  return memoryId;
}

async function updateMetadataEmbeddingStatus(
  contextDir: string,
  indexingStatus: WorkflowIndexingStatus
): Promise<boolean> {
  try {
    const metadataPath = path.join(contextDir, 'metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent) as Record<string, unknown>;
    const timestamp = new Date().toISOString();

    metadata.embedding = {
      status: indexingStatus.status,
      model: MODEL_NAME,
      dimensions: EMBEDDING_DIM,
      memoryId: indexingStatus.memoryId,
      updatedAt: timestamp,
      ...(indexingStatus.status === 'indexed'
        ? { generatedAt: timestamp }
        : { lastAttemptedAt: timestamp }),
      ...(indexingStatus.reason ? { reason: indexingStatus.reason } : {}),
      ...(indexingStatus.errorMessage ? { errorMessage: indexingStatus.errorMessage } : {}),
    };

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    return true;
  } catch (metaError: unknown) {
    const errMsg = metaError instanceof Error ? metaError.message : String(metaError);
    structuredLog('warn', 'Failed to update metadata.json', {
      metadataPath: path.join(contextDir, 'metadata.json'),
      indexingStatus,
      error: errMsg
    });
    console.warn(`   Warning: Could not update metadata.json: ${errMsg}`);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
------------------------------------------------------------------*/

export {
  indexMemory,
  updateMetadataEmbeddingStatus,
};

export type {
  IndexingStatusValue,
  WorkflowIndexingStatus,
};
