// ---------------------------------------------------------------
// MODULE: Memory Indexer
// ---------------------------------------------------------------
// Handles persisting memory files to the vector index: embedding generation,
// database storage, metadata updates, and DB-change notifications.

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

import { structuredLog } from '../utils';
import { generateEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import { vectorIndex } from '@spec-kit/mcp-server/api/search';
import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import type { CollectedDataFull } from '../extractors/collect-session-data';
import { extractQualityScore, extractQualityFlags } from '@spec-kit/shared/parsing/quality-extractors';

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

/* -----------------------------------------------------------------
   MEMORY INDEXING
------------------------------------------------------------------*/

async function indexMemory(
  contextDir: string,
  contextFilename: string,
  content: string,
  specFolderName: string,
  collectedData: CollectedDataFull | null = null,
  preExtractedTriggers: string[] = []
): Promise<number | null> {
  const embeddingStart = Date.now();
  const embedding = await generateEmbedding(content);

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
  const lengthFactor = Math.min(contentLength / 10000, 1) * 0.3;
  const anchorFactor = Math.min(anchorCount / 10, 1) * 0.3;
  const recencyFactor = 0.2;
  const importanceWeight = Math.round((lengthFactor + anchorFactor + recencyFactor + 0.2) * 100) / 100;
  const qualityScore = extractQualityScore(content);
  const qualityFlags = extractQualityFlags(content);

  const memoryId: number = vectorIndex.indexMemory({
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

  console.log(`   Embedding generated in ${embeddingTime}ms`);

  if (embeddingTime > 500) {
    console.warn(`   Warning: Embedding took ${embeddingTime}ms (target <500ms)`);
  }

  notifyDatabaseUpdated();

  return memoryId;
}

async function updateMetadataWithEmbedding(contextDir: string, memoryId: number): Promise<void> {
  try {
    const metadataPath = path.join(contextDir, 'metadata.json');
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent) as Record<string, unknown>;

    metadata.embedding = {
      status: 'indexed',
      model: MODEL_NAME,
      dimensions: EMBEDDING_DIM,
      memoryId: memoryId,
      generatedAt: new Date().toISOString()
    };

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
  } catch (metaError: unknown) {
    const errMsg = metaError instanceof Error ? metaError.message : String(metaError);
    structuredLog('warn', 'Failed to update metadata.json', {
      metadataPath: path.join(contextDir, 'metadata.json'),
      memoryId,
      error: errMsg
    });
    console.warn(`   Warning: Could not update metadata.json: ${errMsg}`);
  }
}

/* -----------------------------------------------------------------
   EXPORTS
------------------------------------------------------------------*/

export {
  indexMemory,
  updateMetadataWithEmbedding,
};
