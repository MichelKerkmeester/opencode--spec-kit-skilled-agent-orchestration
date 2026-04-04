// ───────────────────────────────────────────────────────────────
// MODULE: Shared Payload Contract
// ───────────────────────────────────────────────────────────────
// Phase 030 / Phase 1: common payload and provenance envelope
// shared by startup, recovery, and compaction surfaces.

export type SharedPayloadKind =
  | 'startup'
  | 'resume'
  | 'health'
  | 'bootstrap'
  | 'compaction';

export type SharedPayloadTrustState =
  | 'live'
  | 'cached'
  | 'stale'
  | 'imported'
  | 'rebuilt'
  | 'rehomed';

export interface SharedPayloadSection {
  key: string;
  title: string;
  content: string;
  source: 'memory' | 'code-graph' | 'semantic' | 'session' | 'operational';
}

export interface SharedPayloadProvenance {
  producer:
    | 'startup_brief'
    | 'session_snapshot'
    | 'session_resume'
    | 'session_health'
    | 'session_bootstrap'
    | 'compact_merger'
    | 'hook_cache';
  sourceSurface: string;
  trustState: SharedPayloadTrustState;
  generatedAt: string;
  lastUpdated: string | null;
  sourceRefs: string[];
}

export interface PreMergeSelectionMetadata {
  strategy: 'pre-merge';
  selectedFrom: string[];
  fileCount: number;
  topicCount: number;
  attentionSignalCount: number;
  notes: string[];
  antiFeedbackGuards: string[];
}

export interface SharedPayloadEnvelope {
  kind: SharedPayloadKind;
  summary: string;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  selection?: PreMergeSelectionMetadata;
}

const SUMMARY_MAX_CHARS = 220;

function truncateInline(text: string, maxChars: number = SUMMARY_MAX_CHARS): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) {
    return normalized;
  }
  return `${normalized.slice(0, maxChars - 3).trimEnd()}...`;
}

export function summarizeUnknown(value: unknown, maxChars: number = SUMMARY_MAX_CHARS): string {
  if (value === null || value === undefined) {
    return 'None';
  }

  if (typeof value === 'string') {
    return truncateInline(value, maxChars);
  }

  try {
    return truncateInline(JSON.stringify(value), maxChars);
  } catch {
    return truncateInline(String(value), maxChars);
  }
}

export function createSharedPayloadEnvelope(input: {
  kind: SharedPayloadKind;
  sections: SharedPayloadSection[];
  provenance: SharedPayloadProvenance;
  summary?: string;
  selection?: PreMergeSelectionMetadata;
}): SharedPayloadEnvelope {
  const sections = input.sections.filter((section) => section.content.trim().length > 0);
  const summary = input.summary
    ? truncateInline(input.summary)
    : truncateInline(
      sections.length > 0
        ? sections
          .slice(0, 2)
          .map((section) => `${section.title}: ${section.content}`)
          .join(' | ')
        : `${input.kind} payload from ${input.provenance.producer}`,
    );

  return {
    kind: input.kind,
    summary,
    sections,
    provenance: input.provenance,
    ...(input.selection ? { selection: input.selection } : {}),
  };
}

export function trustStateFromGraphState(
  graphState: 'ready' | 'stale' | 'empty' | 'missing',
): SharedPayloadTrustState {
  return graphState === 'ready' ? 'live' : 'stale';
}

export function trustStateFromStructuralStatus(
  status: 'ready' | 'stale' | 'missing',
): SharedPayloadTrustState {
  return status === 'ready' ? 'live' : 'stale';
}

export function trustStateFromCache(
  cachedAt: string,
  maxAgeMs: number,
  nowMs: number = Date.now(),
): SharedPayloadTrustState {
  const cachedAtMs = new Date(cachedAt).getTime();
  if (Number.isNaN(cachedAtMs)) {
    return 'stale';
  }
  return nowMs - cachedAtMs >= maxAgeMs ? 'stale' : 'cached';
}

export function createPreMergeSelectionMetadata(input: {
  selectedFrom: string[];
  fileCount: number;
  topicCount: number;
  attentionSignalCount: number;
  notes?: string[];
  antiFeedbackGuards?: string[];
}): PreMergeSelectionMetadata {
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
