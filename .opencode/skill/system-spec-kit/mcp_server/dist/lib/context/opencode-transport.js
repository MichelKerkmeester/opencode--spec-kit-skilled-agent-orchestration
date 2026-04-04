// ───────────────────────────────────────────────────────────────
// MODULE: OpenCode Transport Adapter
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 2: transport-only mapping from shared payload
// contracts to OpenCode-oriented startup, message, and compaction blocks.
function isSharedPayloadEnvelope(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const record = value;
    return typeof record.kind === 'string'
        && typeof record.summary === 'string'
        && Array.isArray(record.sections)
        && !!record.provenance
        && typeof record.provenance === 'object';
}
/** Narrow an unknown runtime payload to the shared transport envelope contract. */
export function coerceSharedPayloadEnvelope(value) {
    return isSharedPayloadEnvelope(value) ? value : null;
}
function renderSections(sections, maxSections = 2) {
    return sections
        .slice(0, maxSections)
        .map((section) => `### ${section.title}\n${section.content}`)
        .join('\n\n');
}
function renderBlockContent(payload, prefix) {
    const parts = [
        prefix ? `${prefix}\n` : null,
        `Summary: ${payload.summary}`,
        renderSections(payload.sections),
        `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
    ].filter(Boolean);
    return parts.join('\n\n');
}
function appendStartupSnapshotNote(content) {
    return [
        content,
        'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
    ].join('\n\n');
}
/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
export function buildOpenCodeTransportPlan(args) {
    const trackedPayloadKinds = [
        args.bootstrapPayload?.kind,
        args.startupPayload?.kind,
        args.resumePayload?.kind,
        args.healthPayload?.kind,
        args.compactionPayload?.kind,
    ].filter((kind) => !!kind);
    const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
    const messagePayloads = [args.resumePayload, args.healthPayload].filter((payload) => !!payload);
    const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
    return {
        interfaceVersion: '1.0',
        transportOnly: true,
        retrievalPolicyOwner: 'runtime',
        event: {
            hook: 'event',
            trackedPayloadKinds,
            summary: args.specFolder
                ? `Track OpenCode routing hints for ${args.specFolder}`
                : 'Track OpenCode routing hints for the current packet/runtime state',
        },
        ...(systemPayload
            ? {
                systemTransform: {
                    hook: 'experimental.chat.system.transform',
                    title: 'OpenCode Startup Digest',
                    payloadKind: systemPayload.kind,
                    dedupeKey: `system:${systemPayload.kind}`,
                    content: appendStartupSnapshotNote(renderBlockContent(systemPayload, 'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.')),
                },
            }
            : {}),
        messagesTransform: messagePayloads.map((payload, index) => ({
            hook: 'experimental.chat.messages.transform',
            title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
            payloadKind: payload.kind,
            dedupeKey: `messages:${payload.kind}:${index}`,
            content: renderBlockContent(payload, 'Inject this as bounded current-turn context. Do not treat it as retrieval policy.'),
        })),
        ...(compactionPayload
            ? {
                compaction: {
                    hook: 'experimental.session.compacting',
                    title: 'OpenCode Compaction Resume Note',
                    payloadKind: compactionPayload.kind,
                    dedupeKey: `compaction:${compactionPayload.kind}`,
                    content: renderBlockContent(compactionPayload, 'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.'),
                },
            }
            : {}),
    };
}
//# sourceMappingURL=opencode-transport.js.map