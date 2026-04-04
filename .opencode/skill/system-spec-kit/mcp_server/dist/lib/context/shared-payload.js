// ───────────────────────────────────────────────────────────────
// MODULE: Shared Payload Contract
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 1: common payload and provenance envelope
// shared by startup, recovery, and compaction surfaces.
const SUMMARY_MAX_CHARS = 220;
function truncateInline(text, maxChars = SUMMARY_MAX_CHARS) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxChars) {
        return normalized;
    }
    return `${normalized.slice(0, maxChars - 3).trimEnd()}...`;
}
export function summarizeUnknown(value, maxChars = SUMMARY_MAX_CHARS) {
    if (value === null || value === undefined) {
        return 'None';
    }
    if (typeof value === 'string') {
        return truncateInline(value, maxChars);
    }
    try {
        return truncateInline(JSON.stringify(value), maxChars);
    }
    catch {
        return truncateInline(String(value), maxChars);
    }
}
export function createSharedPayloadEnvelope(input) {
    const sections = input.sections.filter((section) => section.content.trim().length > 0);
    const summary = input.summary
        ? truncateInline(input.summary)
        : truncateInline(sections.length > 0
            ? sections
                .slice(0, 2)
                .map((section) => `${section.title}: ${section.content}`)
                .join(' | ')
            : `${input.kind} payload from ${input.provenance.producer}`);
    return {
        kind: input.kind,
        summary,
        sections,
        provenance: input.provenance,
        ...(input.selection ? { selection: input.selection } : {}),
    };
}
export function trustStateFromGraphState(graphState) {
    return graphState === 'ready' ? 'live' : 'stale';
}
export function trustStateFromStructuralStatus(status) {
    return status === 'ready' ? 'live' : 'stale';
}
export function trustStateFromCache(cachedAt, maxAgeMs, nowMs = Date.now()) {
    const cachedAtMs = new Date(cachedAt).getTime();
    if (Number.isNaN(cachedAtMs)) {
        return 'stale';
    }
    return nowMs - cachedAtMs >= maxAgeMs ? 'stale' : 'cached';
}
export function createPreMergeSelectionMetadata(input) {
    return {
        strategy: 'pre-merge',
        selectedFrom: [...new Set(input.selectedFrom)],
        fileCount: input.fileCount,
        topicCount: input.topicCount,
        attentionSignalCount: input.attentionSignalCount,
        notes: input.notes ?? [],
        antiFeedbackGuards: input.antiFeedbackGuards ?? [],
    };
}
//# sourceMappingURL=shared-payload.js.map