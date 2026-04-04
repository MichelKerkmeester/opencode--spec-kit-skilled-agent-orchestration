// ───────────────────────────────────────────────────────────────
// MODULE: Embedding Pipeline
// ───────────────────────────────────────────────────────────────
import path from 'path';
import * as embeddings from '../../lib/providers/embeddings.js';
import { sanitizeAndLogEmbeddingFailure, sanitizeEmbeddingFailureMessage, } from '../../lib/providers/retry-manager.js';
import { computeContentHash, lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache.js';
import { normalizeContentForEmbedding } from '../../lib/parsing/content-normalizer.js';
function normalizeHeadingLabel(heading) {
    return heading
        .replace(/^\d+\.\s*/, '')
        .trim()
        .toLowerCase();
}
function extractMarkdownSection(markdown, headingNames) {
    const headingPattern = /^#{1,6}\s+(.+)$/gm;
    const headings = Array.from(markdown.matchAll(headingPattern));
    const normalizedHeadingNames = headingNames.map((heading) => heading.toLowerCase());
    for (let index = 0; index < headings.length; index++) {
        const match = headings[index];
        const label = normalizeHeadingLabel(match[1] || '');
        if (!normalizedHeadingNames.includes(label)) {
            continue;
        }
        const start = match.index ?? 0;
        const contentStart = start + match[0].length;
        const end = index + 1 < headings.length
            ? (headings[index + 1].index ?? markdown.length)
            : markdown.length;
        return {
            content: markdown.slice(contentStart, end).trim(),
            start,
            end,
        };
    }
    return null;
}
function extractSectionBullets(content) {
    return content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => /^[-*]\s+/.test(line))
        .map((line) => line.replace(/^[-*]\s+/, '').trim())
        .filter(Boolean);
}
function removeMarkdownSections(markdown, sections) {
    const matches = sections
        .filter((section) => Boolean(section))
        .sort((left, right) => right.start - left.start);
    let nextMarkdown = markdown;
    for (const match of matches) {
        nextMarkdown = `${nextMarkdown.slice(0, match.start)}\n\n${nextMarkdown.slice(match.end)}`;
    }
    return nextMarkdown
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}
function buildParsedMemoryWeightedSections(parsed) {
    const decisionSection = extractMarkdownSection(parsed.content, ['decisions']);
    const outcomeSection = extractMarkdownSection(parsed.content, ['key outcomes', 'outcomes']);
    const decisions = extractSectionBullets(decisionSection?.content || '');
    const outcomes = extractSectionBullets(outcomeSection?.content || '');
    const generalMarkdown = removeMarkdownSections(parsed.content, [decisionSection, outcomeSection]);
    return {
        title: parsed.title || path.basename(parsed.filePath, path.extname(parsed.filePath)),
        decisions,
        outcomes,
        general: normalizeContentForEmbedding(generalMarkdown),
    };
}
function computeCacheKey(content, model) {
    void model;
    return computeContentHash(normalizeContentForEmbedding(content));
}
export async function generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding) {
    let embedding = null;
    let embeddingStatus = 'pending';
    let embeddingFailureReason = null;
    const modelId = embeddings.getModelName();
    const embeddingDim = embeddings.getEmbeddingDimension();
    const cacheKey = computeCacheKey(parsed.content, modelId);
    if (asyncEmbedding) {
        const cachedBuf = lookupEmbedding(database, cacheKey, modelId, embeddingDim);
        if (cachedBuf) {
            embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
            embeddingStatus = 'success';
            console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)} (async mode)`);
        }
        else {
            embeddingFailureReason = sanitizeEmbeddingFailureMessage('Deferred: async_embedding requested');
            console.error(`[memory-save] T306: Async embedding mode - deferring embedding for ${path.basename(filePath)}`);
        }
    }
    else {
        try {
            // Check persistent embedding cache before calling provider
            const cachedBuf = lookupEmbedding(database, cacheKey, modelId, embeddingDim);
            if (cachedBuf) {
                // Cache hit: convert Buffer to Float32Array
                embedding = new Float32Array(new Uint8Array(cachedBuf).buffer);
                embeddingStatus = 'success';
                console.error(`[memory-save] Embedding cache HIT for ${path.basename(filePath)}`);
            }
            else {
                // Cache miss: normalize content then generate embedding via provider
                // S1: strip structural noise (frontmatter, anchors, HTML comments) before embedding
                const weightedInput = embeddings.buildWeightedDocumentText(buildParsedMemoryWeightedSections(parsed));
                embedding = await embeddings.generateDocumentEmbedding(weightedInput);
                if (embedding) {
                    embeddingStatus = 'success';
                    const embBuf = Buffer.from(embedding.buffer, embedding.byteOffset, embedding.byteLength);
                    console.error(`[memory-save] Embedding cache MISS+GENERATE for ${path.basename(filePath)}`);
                    return {
                        embedding,
                        status: embeddingStatus,
                        failureReason: embeddingFailureReason,
                        pendingCacheWrite: {
                            cacheKey,
                            modelId,
                            embeddingBuffer: embBuf,
                            dimensions: embedding.length,
                        },
                    };
                }
                else {
                    embeddingFailureReason = sanitizeEmbeddingFailureMessage('Embedding generation returned null');
                    console.warn(`[memory-save] Embedding failed for ${path.basename(filePath)}: ${embeddingFailureReason}`);
                }
            }
        }
        catch (embedding_error) {
            // Security: raw provider errors sanitized before persistence/response
            embeddingFailureReason = sanitizeAndLogEmbeddingFailure(`[memory-save] Embedding failed for ${path.basename(filePath)}`, embedding_error, { provider: modelId, force: true });
        }
    }
    return {
        embedding,
        status: embeddingStatus,
        failureReason: embeddingFailureReason,
    };
}
export function persistPendingEmbeddingCacheWrite(database, pendingCacheWrite, filePath) {
    if (!pendingCacheWrite) {
        return;
    }
    storeEmbedding(database, pendingCacheWrite.cacheKey, pendingCacheWrite.modelId, pendingCacheWrite.embeddingBuffer, pendingCacheWrite.dimensions);
    console.error(`[memory-save] Embedding cache STORE after quality gate for ${path.basename(filePath)}`);
}
//# sourceMappingURL=embedding-pipeline.js.map