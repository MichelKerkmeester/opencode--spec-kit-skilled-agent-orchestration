// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.

import { handleSessionResume } from './session-resume.js';
import type { CachedSessionSummaryDecision } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  attachStructuralTrustFields,
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  StructuralTrustPayloadError,
  type StructuralTrust,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../code-graph/lib/ops-hardening.js';
import { handleSkillGraphStatus } from './skill-graph/status.js';
import { handleSkillGraphQuery } from './skill-graph/query.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionBootstrapArgs {
  specFolder?: string;
}

interface SkillGraphTopologyHub {
  skillId: string;
  family: string | null;
  category: string | null;
  inboundCount: number;
}

interface SkillGraphTopologySummary {
  status: 'ready' | 'empty' | 'unavailable';
  totalSkills: number;
  totalEdges: number;
  lastIndexedAt: string | null;
  familyDistribution: Array<{ name: string; count: number }>;
  hubSkills: SkillGraphTopologyHub[];
  staleness: Record<string, unknown> | null;
  validation: Record<string, unknown> | null;
  summary: string;
  error?: string;
}

type TextResponseLike = {
  content?: Array<{
    type?: string;
    text?: string;
  }>;
};

interface SessionBootstrapResult {
  resume: Record<string, unknown>;
  health: Record<string, unknown>;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract & StructuralTrust;
  structuralRoutingNudge?: {
    advisory: true;
    readiness: 'ready';
    preferredTool: 'code_graph_query';
    message: string;
    preservesAuthority: 'session_bootstrap';
  };
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  skillGraphTopology?: SkillGraphTopologySummary;
  hints: string[];
  nextActions: string[];
}

const RESUME_LADDER_SUMMARY =
  'Resume recovery follows `handover.md` -> `_memory.continuity` -> spec docs.';

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function extractData(response: TextResponseLike): Record<string, unknown> {
  try {
    const text = response?.content?.[0]?.text;
    if (typeof text !== 'string') {
      return { error: 'Child payload missing text content', _extractionFailed: true };
    }

    const parsed = JSON.parse(text);
    if (parsed?.data && typeof parsed.data === 'object') {
      return parsed.data as Record<string, unknown>;
    }

    if (parsed && typeof parsed === 'object') {
      return parsed as Record<string, unknown>;
    }

    return { error: 'Child payload parsed but contained no usable data', _extractionFailed: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Child payload parse failed: ${message}`, _extractionFailed: true };
  }
}

function extractHints(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.hints)) return data.hints as string[];
  return [];
}

function extractCachedSummary(
  data: Record<string, unknown>,
): CachedSessionSummaryDecision | null {
  const candidate = data.cachedSummary;
  if (candidate && typeof candidate === 'object') {
    return candidate as CachedSessionSummaryDecision;
  }
  return null;
}

function normalizeStructuralRecommendedAction(
  structuralContext: StructuralBootstrapContract,
): string | null {
  const action = structuralContext.recommendedAction?.trim();
  if (!action) {
    return null;
  }

  if (structuralContext.sourceSurface !== 'session_bootstrap' || !action.includes('session_bootstrap')) {
    return action;
  }

  if (structuralContext.status === 'missing') {
    return 'Run `code_graph_scan` to populate structural context, then re-run `session_bootstrap`.';
  }

  if (structuralContext.status === 'stale') {
    return 'Run `code_graph_scan` if the graph needs a broader refresh, then re-run `session_bootstrap`.';
  }

  return action;
}

function buildNextActions(
  resumeData: Record<string, unknown>,
  healthData: Record<string, unknown>,
  structuralContext: StructuralBootstrapContract,
): string[] {
  const nextActions = new Set<string>();

  if (resumeData.error) {
    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
  }

  if (healthData.error) {
    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
  }

  const normalizedStructuralAction = normalizeStructuralRecommendedAction(structuralContext);
  if (normalizedStructuralAction) {
    nextActions.add(normalizedStructuralAction);
  }

  nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
  nextActions.add(RESUME_LADDER_SUMMARY);

  return [...nextActions].slice(0, 3);
}

function extractStructuralTrustFromPayload(
  payload: SharedPayloadEnvelope | null,
): StructuralTrust | null {
  if (!payload) {
    return null;
  }

  const structuralSection = payload.sections.find((section) =>
    section.key === 'structural-context' && section.structuralTrust,
  );

  return structuralSection?.structuralTrust ?? null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function normalizeGroupCounts(value: unknown): Array<{ name: string; count: number }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);
    const name = asString(record?.name);
    if (!record || !name) {
      return [];
    }

    return [{
      name,
      count: asNumber(record.count),
    }];
  });
}

function normalizeHubSkills(value: unknown): SkillGraphTopologyHub[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const record = asRecord(item);
    const node = asRecord(record?.node);
    const skillId = asString(node?.id);
    if (!record || !node || !skillId) {
      return [];
    }

    return [{
      skillId,
      family: asString(node.family),
      category: asString(node.category),
      inboundCount: asNumber(record.inboundCount),
    }];
  });
}

function describeSkillGraphTopology(topology: Omit<SkillGraphTopologySummary, 'summary'>): string {
  if (topology.status === 'unavailable') {
    return `Skill graph topology unavailable: ${topology.error ?? 'unknown error'}`;
  }

  const families = topology.familyDistribution.length > 0
    ? topology.familyDistribution.map((family) => `${family.name}=${family.count}`).join(', ')
    : 'none';
  const hubs = topology.hubSkills.length > 0
    ? topology.hubSkills.map((hub) => `${hub.skillId}(${hub.inboundCount})`).join(', ')
    : 'none';
  const lastIndexedAt = topology.lastIndexedAt ?? 'unknown';

  return [
    `Skill graph: ${topology.totalSkills} skills, ${topology.totalEdges} edges`,
    `families: ${families}`,
    `hubs: ${hubs}`,
    `lastIndexedAt: ${lastIndexedAt}`,
  ].join(' | ');
}

async function buildSkillGraphTopologySummary(): Promise<SkillGraphTopologySummary> {
  try {
    const statusData = extractData(await handleSkillGraphStatus());
    if (statusData.error) {
      const unavailable = {
        status: 'unavailable' as const,
        totalSkills: 0,
        totalEdges: 0,
        lastIndexedAt: null,
        familyDistribution: [],
        hubSkills: [],
        staleness: null,
        validation: null,
        error: String(statusData.error),
      };
      return {
        ...unavailable,
        summary: describeSkillGraphTopology(unavailable),
      };
    }

    const hubData = extractData(await handleSkillGraphQuery({
      queryType: 'hub_skills',
      minInbound: 2,
      limit: 5,
    }));
    const totalSkills = asNumber(statusData.totalSkills);
    const topology = {
      status: (asString(statusData.dbStatus) === 'ready' ? 'ready' : 'empty') as 'ready' | 'empty',
      totalSkills,
      totalEdges: asNumber(statusData.totalEdges),
      lastIndexedAt: asString(statusData.lastIndexedAt),
      familyDistribution: normalizeGroupCounts(statusData.families),
      hubSkills: normalizeHubSkills(hubData.skills),
      staleness: asRecord(statusData.staleness),
      validation: asRecord(statusData.validation),
    };

    return {
      ...topology,
      summary: describeSkillGraphTopology(topology),
    };
  } catch (error: unknown) {
    const unavailable = {
      status: 'unavailable' as const,
      totalSkills: 0,
      totalEdges: 0,
      lastIndexedAt: null,
      familyDistribution: [],
      hubSkills: [],
      staleness: null,
      validation: null,
      error: error instanceof Error ? error.message : String(error),
    };
    return {
      ...unavailable,
      summary: describeSkillGraphTopology(unavailable),
    };
  }
}

function buildStructuralRoutingNudge(
  structuralContext: StructuralBootstrapContract,
): SessionBootstrapResult['structuralRoutingNudge'] | null {
  if (structuralContext.status !== 'ready') {
    return null;
  }

  return {
    advisory: true,
    readiness: 'ready',
    preferredTool: 'code_graph_query',
    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
    preservesAuthority: 'session_bootstrap',
  };
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
  const startMs = Date.now();
  const allHints: string[] = [];

  // Sub-call 1: session_resume with full resume payload
  let resumeData: Record<string, unknown> = {};
  try {
    const resumeResponse = await handleSessionResume({
      specFolder: args.specFolder,
    });
    resumeData = extractData(resumeResponse);
    allHints.push(...extractHints(resumeData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    resumeData = { error: message };
    allHints.push('session_resume failed. Try calling it manually.');
  }

  // Sub-call 2: session_health
  let healthData: Record<string, unknown> = {};
  try {
    const healthResponse = await handleSessionHealth();
    healthData = extractData(healthResponse);
    allHints.push(...extractHints(healthData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    healthData = { error: message };
    allHints.push('session_health failed. Try calling it manually.');
  }

  // Phase 027: Structural bootstrap contract
  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    allHints.push(
      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
    );
  }

  const cachedSummary = extractCachedSummary(resumeData);
  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
  const skillGraphTopology = await buildSkillGraphTopologySummary();
  if (structuralRoutingNudge) {
    allHints.push(structuralRoutingNudge.message);
  }
  if (skillGraphTopology.status === 'unavailable') {
    allHints.push('Skill graph topology summary is unavailable; call `skill_graph_status` for details.');
  }

  // Deduplicate hints
  const uniqueHints = [...new Set(allHints)];

  // Record bootstrap telemetry once for the composite call.
  const durationMs = Date.now() - startMs;
  const completeness = resumeData.error || healthData.error || resumeData._extractionFailed || healthData._extractionFailed ? 'partial' : 'full';
  recordBootstrapEvent('tool', durationMs, completeness);

  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
  const structuralCertainty: SharedPayloadCertainty = 'exact';
  const skillGraphCertainty: SharedPayloadCertainty = skillGraphTopology.status === 'unavailable' ? 'unknown' : 'estimated';
  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
  if (!resumeData.error && !resumeStructuralTrust) {
    throw new StructuralTrustPayloadError(
      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
    );
  }
  const structuralContextWithTrust = attachStructuralTrustFields(
    structuralContext,
    structuralSnapshotTrust,
    { label: 'session_bootstrap structural context payload' },
  );
  const resumeWithTrust = resumeData.error
    ? resumeData
    : attachStructuralTrustFields(
      resumeData,
      resumeStructuralTrust,
      { label: 'session_bootstrap resume payload' },
    );

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'resume-surface',
      title: 'Resume Surface',
      content: summarizeUnknown(resumeData),
      source: 'memory',
      certainty: resumeCertainty,
    },
  ];
  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummary.cachedSummary.continuityText,
        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
      ].join(' | '),
      source: 'session',
      certainty: cachedCertainty,
    });
  }
  payloadSections.push(
    {
      key: 'health-surface',
      title: 'Health Surface',
      content: summarizeUnknown(healthData),
      source: 'operational',
      certainty: healthCertainty,
    },
    {
      key: 'structural-context',
      title: 'Structural Context',
      // This section carries trust derived from the local structural snapshot,
      // which remains valid even when the remote resume surface fails closed.
      content: structuralContext.summary,
      source: 'code-graph',
      certainty: structuralCertainty,
      structuralTrust: structuralSnapshotTrust,
    },
    {
      key: 'skill-graph-topology',
      title: 'Skill Graph Topology',
      content: skillGraphTopology.summary,
      source: 'skill-graph',
      certainty: skillGraphCertainty,
    },
    {
      key: 'next-actions',
      title: 'Next Actions',
      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
      source: 'session',
      certainty: nextActionsCertainty,
    },
  );

  const payloadContract = createSharedPayloadEnvelope({
    kind: 'bootstrap',
    sections: payloadSections,
    summary: `Bootstrap payload: ${summarizeCertaintyContract([
      { label: 'resume', certainty: resumeCertainty },
      { label: 'health', certainty: healthCertainty },
      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
      { label: 'structural', certainty: structuralCertainty },
      { label: 'nextActions', certainty: nextActionsCertainty },
    ])}; structuralStatus=${structuralContext.status}`,
    provenance: {
      producer: 'session_bootstrap',
      sourceSurface: 'session_bootstrap',
      trustState: trustStateFromStructuralStatus(structuralContext.status),
      generatedAt: new Date().toISOString(),
      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
    },
  });
  const graphOps = buildCodeGraphOpsContract({
    graphFreshness: structuralContext.status === 'ready'
      ? 'fresh'
      : structuralContext.status === 'stale'
        ? 'stale'
        : 'empty',
    sourceSurface: 'session_bootstrap',
  });

  const result: SessionBootstrapResult = {
    resume: resumeWithTrust,
    health: healthData,
    ...(cachedSummary ? { cachedSummary } : {}),
    structuralContext: structuralContextWithTrust,
    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
    payloadContract,
    opencodeTransport: buildOpenCodeTransportPlan({
      bootstrapPayload: payloadContract,
      resumePayload,
      healthPayload,
      graphOps,
      specFolder: args.specFolder ?? null,
    }),
    graphOps,
    skillGraphTopology,
    hints: uniqueHints,
    // Keep advisory routing guidance out of nextActions so bootstrap and resume
    // remain the authoritative recovery owners for startup and deep resume flows.
    nextActions: buildNextActions(resumeData, healthData, structuralContext),
  };

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
    }],
    structuredContent: result,
  };
}
