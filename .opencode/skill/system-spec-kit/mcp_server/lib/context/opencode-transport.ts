// ───────────────────────────────────────────────────────────────
// MODULE: OpenCode Transport Adapter
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 2: transport-only mapping from shared payload
// contracts to OpenCode-oriented startup, message, and compaction blocks.

import {
  isSharedPayloadKind,
  isSharedPayloadProducer,
  SHARED_PAYLOAD_KIND_VALUES,
  SHARED_PAYLOAD_PRODUCER_VALUES,
} from './shared-payload.js';
import type { SharedPayloadEnvelope, SharedPayloadSection } from './shared-payload.js';

/** Hook names emitted by the OpenCode transport adapter. */
export type OpenCodeTransportHook =
  | 'event'
  | 'experimental.chat.system.transform'
  | 'experimental.chat.messages.transform'
  | 'experimental.session.compacting';

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

type SharedPayloadEnvelopeShape = {
  kind: string;
  summary: string;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadEnvelope['provenance'];
};

function isSharedPayloadEnvelopeShape(value: unknown): value is SharedPayloadEnvelopeShape {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.kind === 'string'
    && typeof record.summary === 'string'
    && Array.isArray(record.sections)
    && !!record.provenance
    && typeof record.provenance === 'object';
}

function formatAllowedValues(values: readonly string[]): string {
  return values.join(', ');
}

/** Narrow an unknown runtime payload to the shared transport envelope contract. */
export function coerceSharedPayloadEnvelope(value: unknown): SharedPayloadEnvelope | null {
  if (!isSharedPayloadEnvelopeShape(value)) {
    return null;
  }

  if (!isSharedPayloadKind(value.kind)) {
    throw new Error(
      `Invalid shared payload envelope kind "${String(value.kind)}"; expected one of ${formatAllowedValues(SHARED_PAYLOAD_KIND_VALUES)}.`,
    );
  }
  if (!isSharedPayloadProducer(value.provenance.producer)) {
    throw new Error(
      `Invalid shared payload envelope provenance.producer "${String(value.provenance.producer)}"; expected one of ${formatAllowedValues(SHARED_PAYLOAD_PRODUCER_VALUES)}.`,
    );
  }

  const kind = value.kind;
  const producer = value.provenance.producer;
  return {
    ...value,
    kind,
    provenance: {
      ...value.provenance,
      producer,
    },
  };
}

function renderSections(sections: SharedPayloadSection[], maxSections: number = 2): string {
  return sections
    .slice(0, maxSections)
    .map((section) => `### ${section.title}\n${section.content}`)
    .join('\n\n');
}

function renderBlockContent(payload: SharedPayloadEnvelope, prefix?: string): string {
  const parts = [
    prefix ? `${prefix}\n` : null,
    `Summary: ${payload.summary}`,
    renderSections(payload.sections),
    `Provenance: producer=${payload.provenance.producer}; trustState=${payload.provenance.trustState}; sourceSurface=${payload.provenance.sourceSurface}`,
  ].filter(Boolean);
  return parts.join('\n\n');
}

function appendStartupSnapshotNote(content: string): string {
  return [
    content,
    'Note: this is a startup snapshot; later structural reads may differ if the repo state changed.',
  ].join('\n\n');
}

/** Build the OpenCode runtime hook plan from the shared payload surfaces. */
export function buildOpenCodeTransportPlan(args: {
  bootstrapPayload?: SharedPayloadEnvelope | null;
  startupPayload?: SharedPayloadEnvelope | null;
  resumePayload?: SharedPayloadEnvelope | null;
  healthPayload?: SharedPayloadEnvelope | null;
  compactionPayload?: SharedPayloadEnvelope | null;
  specFolder?: string | null;
}): OpenCodeTransportPlan {
  const trackedPayloadKinds = [
    args.bootstrapPayload?.kind,
    args.startupPayload?.kind,
    args.resumePayload?.kind,
    args.healthPayload?.kind,
    args.compactionPayload?.kind,
  ].filter((kind): kind is SharedPayloadEnvelope['kind'] => !!kind);

  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
    (payload): payload is SharedPayloadEnvelope => !!payload,
  );
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
          content: appendStartupSnapshotNote(renderBlockContent(
            systemPayload,
            'Inject this as the startup digest for hookless OpenCode recovery. Keep it transport-only.',
          ),
          ),
        },
      }
      : {}),
    messagesTransform: messagePayloads.map((payload, index) => ({
      hook: 'experimental.chat.messages.transform' as const,
      title: index === 0 ? 'OpenCode Retrieved Context' : 'OpenCode Operational Context',
      payloadKind: payload.kind,
      dedupeKey: `messages:${payload.kind}:${index}`,
      content: renderBlockContent(
        payload,
        'Inject this as bounded current-turn context. Do not treat it as retrieval policy.',
      ),
    })),
    ...(compactionPayload
      ? {
        compaction: {
          hook: 'experimental.session.compacting',
          title: 'OpenCode Compaction Resume Note',
          payloadKind: compactionPayload.kind,
          dedupeKey: `compaction:${compactionPayload.kind}`,
          content: renderBlockContent(
            compactionPayload,
            'Inject this as the continuity note across compaction. Keep it separate from current-turn retrieval.',
          ),
        },
      }
      : {}),
  };
}
