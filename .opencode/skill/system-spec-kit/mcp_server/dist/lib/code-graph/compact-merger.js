// ───────────────────────────────────────────────────────────────
// MODULE: Compact Merger
// ───────────────────────────────────────────────────────────────
// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
// into a unified compact brief for compaction injection.
import { allocateBudget, createDefaultSources } from './budget-allocator.js';
import { createSharedPayloadEnvelope, } from '../context/shared-payload.js';
/** Estimate tokens from string (4 chars ≈ 1 token) */
function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}
/** Truncate text to fit within a token budget */
function truncateToTokens(text, maxTokens) {
    if (maxTokens <= 0)
        return '';
    if (estimateTokens(text) <= maxTokens)
        return text;
    const marker = '\n[...truncated]';
    const maxChars = maxTokens * 4;
    if (marker.length >= maxChars) {
        return text.slice(0, maxChars);
    }
    const contentChars = Math.max(0, maxChars - marker.length);
    return text.slice(0, contentChars) + marker;
}
/** Extract file paths from a text section for deduplication */
function extractFilePathsFromText(text) {
    const paths = new Set();
    const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
    const matches = text.match(pathRegex);
    if (matches)
        matches.forEach(m => paths.add(m));
    return paths;
}
/** Deduplicate file references across sections — higher priority sources keep their mentions */
function deduplicateFilePaths(sections) {
    const seenFiles = new Set();
    let removedCount = 0;
    for (const section of sections) {
        const filePaths = extractFilePathsFromText(section.content);
        const duplicates = [];
        for (const fp of filePaths) {
            if (seenFiles.has(fp)) {
                duplicates.push(fp);
                removedCount++;
            }
            else {
                seenFiles.add(fp);
            }
        }
        // Remove duplicate file path lines from lower-priority sections
        if (duplicates.length > 0) {
            let content = section.content;
            for (const dup of duplicates) {
                const lineRegex = new RegExp(`^.*${dup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$\n?`, 'gm');
                content = content.replace(lineRegex, '');
            }
            section.content = content.trim();
            section.tokenEstimate = estimateTokens(section.content);
        }
    }
    return removedCount;
}
/**
 * Merge context from multiple sources into a compact brief.
 *
 * Strategy:
 * 1. Allocate budget across sources (floor + overflow)
 * 2. Truncate each source to its granted budget
 * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
 * 4. Render sections in priority order with headers
 */
export function mergeCompactBrief(input, totalBudget = 4000, freshness, selection) {
    const startTime = performance.now();
    const constitutionalSize = estimateTokens(input.constitutional);
    const codeGraphSize = estimateTokens(input.codeGraph);
    const cocoIndexSize = estimateTokens(input.cocoIndex);
    const triggeredSize = estimateTokens(input.triggered);
    const sessionStateSize = estimateTokens(input.sessionState);
    const sources = createDefaultSources(constitutionalSize, codeGraphSize, cocoIndexSize, triggeredSize, sessionStateSize);
    const allocation = allocateBudget(sources, totalBudget);
    // Build sections with granted budgets
    const sections = [];
    const allocationMap = new Map(allocation.allocations.map(a => [a.name, a]));
    const pushSection = (inputText, allocationName, sectionName, source) => {
        if (!inputText.trim())
            return;
        const granted = allocationMap.get(allocationName)?.granted ?? 0;
        if (granted <= 0)
            return;
        const content = truncateToTokens(inputText, granted);
        if (!content.trim())
            return;
        sections.push({
            name: sectionName,
            content,
            tokenEstimate: estimateTokens(content),
            source,
        });
    };
    pushSection(input.constitutional, 'constitutional', 'Constitutional Rules', 'memory');
    pushSection(input.codeGraph, 'codeGraph', 'Active Files & Structural Context', 'code-graph');
    pushSection(input.cocoIndex, 'cocoIndex', 'Semantic Neighbors', 'cocoindex');
    pushSection(input.sessionState, 'sessionState', 'Session State / Next Steps', 'session');
    pushSection(input.triggered, 'triggered', 'Triggered Memories', 'memory');
    // File-level deduplication across sections
    const deduplicatedFiles = deduplicateFilePaths(sections);
    // Render final text
    const text = sections
        .map(s => `## ${s.name}\n${s.content}`)
        .join('\n\n');
    const totalTokenEstimate = sections.reduce((sum, s) => sum + s.tokenEstimate, 0);
    const mergeDurationMs = Math.round(performance.now() - startTime);
    return {
        text,
        sections,
        allocation,
        payloadContract: createSharedPayloadEnvelope({
            kind: 'compaction',
            sections: sections.map((section) => ({
                key: section.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                title: section.name,
                content: section.content,
                source: section.source === 'code-graph'
                    ? 'code-graph'
                    : section.source === 'cocoindex'
                        ? 'semantic'
                        : section.source === 'session'
                            ? 'session'
                            : 'memory',
            })),
            summary: `Compaction payload merged ${sections.length} sections within ${totalBudget} tokens`,
            provenance: {
                producer: 'compact_merger',
                sourceSurface: 'compaction',
                trustState: 'live',
                generatedAt: new Date().toISOString(),
                lastUpdated: null,
                sourceRefs: ['budget-allocator', 'compact-merger'],
            },
            ...(selection ? { selection } : {}),
        }),
        metadata: {
            totalTokenEstimate,
            sourceCount: sections.length,
            mergedAt: new Date().toISOString(),
            mergeDurationMs,
            deduplicatedFiles,
            freshness: freshness ?? [
                { source: 'constitutional', lastUpdated: null, staleness: 'unknown' },
                { source: 'codeGraph', lastUpdated: null, staleness: 'unknown' },
                { source: 'cocoIndex', lastUpdated: null, staleness: 'unknown' },
                { source: 'triggered', lastUpdated: null, staleness: 'unknown' },
            ],
            ...(selection ? { selection } : {}),
        },
    };
}
//# sourceMappingURL=compact-merger.js.map