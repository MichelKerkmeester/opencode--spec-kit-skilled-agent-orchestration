import type { SharedPayloadEnvelope } from './shared-payload.js';
/** Hook names emitted by the OpenCode transport adapter. */
export type OpenCodeTransportHook = 'event' | 'experimental.chat.system.transform' | 'experimental.chat.messages.transform' | 'experimental.session.compacting';
/** One transport block delivered to an OpenCode runtime hook surface. */
export interface OpenCodeTransportBlock {
    hook: OpenCodeTransportHook;
    title: string;
    payloadKind: SharedPayloadEnvelope['kind'];
    dedupeKey: string;
    content: string;
}
/** Complete transport-only plan derived from shared startup/resume payloads. */
export interface OpenCodeTransportPlan {
    interfaceVersion: '1.0';
    transportOnly: true;
    retrievalPolicyOwner: 'runtime';
    event: {
        hook: 'event';
        trackedPayloadKinds: SharedPayloadEnvelope['kind'][];
        summary: string;
    };
    systemTransform?: OpenCodeTransportBlock;
    messagesTransform: OpenCodeTransportBlock[];
    compaction?: OpenCodeTransportBlock;
}
/** Narrow an unknown runtime payload to the shared transport envelope contract. */
export declare function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null;
/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
export declare function buildOpenCodeTransportPlan(args: {
    bootstrapPayload?: SharedPayloadEnvelope | null;
    startupPayload?: SharedPayloadEnvelope | null;
    resumePayload?: SharedPayloadEnvelope | null;
    healthPayload?: SharedPayloadEnvelope | null;
    compactionPayload?: SharedPayloadEnvelope | null;
    specFolder?: string | null;
}): OpenCodeTransportPlan;
//# sourceMappingURL=opencode-transport.d.ts.map