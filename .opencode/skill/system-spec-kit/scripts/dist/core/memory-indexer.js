"use strict";
// ---------------------------------------------------------------
// MODULE: Memory Indexer
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexMemory = indexMemory;
exports.updateMetadataEmbeddingStatus = updateMetadataEmbeddingStatus;
// ───────────────────────────────────────────────────────────────
// 1. MEMORY INDEXER
// ───────────────────────────────────────────────────────────────
// Handles persisting memory files to the vector index: embedding generation,
// Database storage, metadata updates, and DB-change notifications.
const fs = __importStar(require("fs/promises"));
const fsSync = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("../utils");
const embeddings_1 = require("../lib/embeddings");
const search_1 = require("@spec-kit/mcp-server/api/search");
const config_1 = require("@spec-kit/shared/config");
const trigger_extractor_1 = require("../lib/trigger-extractor");
const quality_extractors_1 = require("@spec-kit/shared/parsing/quality-extractors");
const index_1 = require("@spec-kit/shared/index");
function notifyDatabaseUpdated() {
    try {
        const dbDir = path.dirname(config_1.DB_UPDATED_FILE);
        if (!fsSync.existsSync(dbDir))
            fsSync.mkdirSync(dbDir, { recursive: true });
        fsSync.writeFileSync(config_1.DB_UPDATED_FILE, Date.now().toString());
    }
    catch (e) {
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
async function indexMemory(contextDir, contextFilename, content, specFolderName, collectedData = null, preExtractedTriggers = [], embeddingSections = null) {
    const embeddingStart = Date.now();
    const weightedEmbeddingInput = (0, index_1.buildWeightedDocumentText)(embeddingSections ?? {
        title: contextFilename.replace('.md', ''),
        general: content,
    });
    // ERR-001: Wrap embedding generation in try/catch
    let embedding;
    try {
        embedding = await (0, embeddings_1.generateDocumentEmbedding)(weightedEmbeddingInput);
    }
    catch (embeddingError) {
        const errMsg = embeddingError instanceof Error ? embeddingError.message : String(embeddingError);
        (0, utils_1.structuredLog)('error', 'Embedding generation threw', {
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
    const title = titleMatch ? titleMatch[1] : contextFilename.replace('.md', '');
    let triggerPhrases = [];
    try {
        // Start with pre-extracted triggers (from enriched sources), fall back to content extraction
        if (preExtractedTriggers.length > 0) {
            triggerPhrases = [...preExtractedTriggers];
            console.log(`   Using ${triggerPhrases.length} pre-extracted trigger phrases`);
        }
        else {
            triggerPhrases = (0, trigger_extractor_1.extractTriggerPhrases)(content);
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
    }
    catch (triggerError) {
        const errMsg = triggerError instanceof Error ? triggerError.message : String(triggerError);
        (0, utils_1.structuredLog)('warn', 'Trigger phrase extraction failed', {
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
    const qualityScore = (0, quality_extractors_1.extractQualityScore)(content);
    const qualityFlags = (0, quality_extractors_1.extractQualityFlags)(content);
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
    let memoryId;
    try {
        memoryId = search_1.vectorIndex.indexMemory({
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
    }
    catch (indexError) {
        const errMsg = indexError instanceof Error ? indexError.message : String(indexError);
        (0, utils_1.structuredLog)('error', 'Vector index write failed', {
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
async function updateMetadataEmbeddingStatus(contextDir, indexingStatus) {
    try {
        const metadataPath = path.join(contextDir, 'metadata.json');
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        const timestamp = new Date().toISOString();
        metadata.embedding = {
            status: indexingStatus.status,
            model: embeddings_1.MODEL_NAME,
            dimensions: embeddings_1.EMBEDDING_DIM,
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
    }
    catch (metaError) {
        const errMsg = metaError instanceof Error ? metaError.message : String(metaError);
        (0, utils_1.structuredLog)('warn', 'Failed to update metadata.json', {
            metadataPath: path.join(contextDir, 'metadata.json'),
            indexingStatus,
            error: errMsg
        });
        console.warn(`   Warning: Could not update metadata.json: ${errMsg}`);
        return false;
    }
}
//# sourceMappingURL=memory-indexer.js.map