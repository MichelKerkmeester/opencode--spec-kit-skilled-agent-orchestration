import { describe, expect, it } from 'vitest';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
} from '../lib/context/opencode-transport.js';
import type { CodeGraphOpsContract } from '../code-graph/lib/ops-hardening.js';
import type { SharedPayloadEnvelope } from '../lib/context/shared-payload.js';

function makePayload(
  kind: SharedPayloadEnvelope['kind'],
  summary: string,
  overrides: Partial<SharedPayloadEnvelope> = {},
): SharedPayloadEnvelope {
  return {
    kind,
    summary,
    sections: [{
      key: `${kind}-section`,
      title: `${kind} section`,
      content: `${kind} content`,
      source: 'session',
    }],
    provenance: {
      producer: kind === 'bootstrap'
        ? 'session_bootstrap'
        : kind === 'resume'
          ? 'session_resume'
          : 'session_health',
      sourceSurface: kind,
      trustState: 'live',
      generatedAt: new Date().toISOString(),
      lastUpdated: null,
      sourceRefs: [kind],
    },
    ...overrides,
  };
}

function makeGraphOps(graphFreshness: CodeGraphOpsContract['readiness']['graphFreshness']): CodeGraphOpsContract {
  return {
    readiness: {
      canonical: graphFreshness === 'fresh'
        ? 'ready'
        : graphFreshness === 'stale'
          ? 'stale'
          : 'missing',
      graphFreshness,
      sourceSurface: 'session_resume',
      summary: 'graph summary',
      recommendedAction: 'graph action',
    },
    doctor: {
      supported: true,
      surface: 'memory_health',
      checks: ['fts_consistency'],
      repairModes: ['confirmation-gated autoRepair'],
      recommendedAction: 'repair',
    },
    exportImport: {
      rawDbDumpAllowed: false,
      portableIdentityRequired: true,
      postImportRepairRequired: true,
      workspaceBoundRelativePaths: true,
      absolutePaths: 'allowed-for-import-only',
      recommendedAction: 'export',
    },
    previewPolicy: {
      mode: 'metadata-only',
      rawBinaryAllowed: false,
      recommendedFields: ['path'],
      recommendedAction: 'preview',
    },
  };
}

describe('opencode transport adapter', () => {
  it('builds a transport-only plan from shared payloads', () => {
    const bootstrap = makePayload('bootstrap', 'bootstrap summary');
    const resume = makePayload('resume', 'resume summary');
    const health = makePayload('health', 'health summary');

    const plan = buildOpenCodeTransportPlan({
      bootstrapPayload: bootstrap,
      resumePayload: resume,
      healthPayload: health,
      specFolder: 'specs/030-opencode',
    });

    expect(plan.transportOnly).toBe(true);
    expect(plan.retrievalPolicyOwner).toBe('runtime');
    expect(plan.event.summary).toContain('specs/030-opencode');
    expect(plan.systemTransform?.hook).toBe('experimental.chat.system.transform');
    expect(plan.systemTransform?.content).toContain('startup snapshot');
    expect(plan.systemTransform?.content).toContain('later structural reads may differ if the repo state changed');
    expect(plan.messagesTransform).toHaveLength(2);
    expect(plan.compaction?.hook).toBe('experimental.session.compacting');
  });

  it('renders structural context with absent/unavailable readiness instead of only envelope trust state', () => {
    const resume = makePayload('resume', 'resume summary', {
      sections: [
        {
          key: 'memory-resume',
          title: 'Memory Resume',
          content: 'memory summary',
          source: 'memory',
        },
        {
          key: 'code-graph-status',
          title: 'Code Graph Status',
          content: 'status=empty; files=0; nodes=0; edges=0; lastScan=unknown',
          source: 'code-graph',
        },
        {
          key: 'structural-context',
          title: 'Structural Context',
          content: 'No structural context available — code graph is empty or unavailable',
          source: 'code-graph',
          structuralTrust: {
            parserProvenance: 'unknown',
            evidenceStatus: 'unverified',
            freshnessAuthority: 'unknown',
          },
        },
      ],
      provenance: {
        ...makePayload('resume', 'resume summary').provenance,
        trustState: 'stale',
      },
    });

    const absentPlan = buildOpenCodeTransportPlan({
      resumePayload: resume,
      graphOps: makeGraphOps('empty'),
    });
    const unavailablePlan = buildOpenCodeTransportPlan({
      resumePayload: resume,
      graphOps: makeGraphOps('error'),
    });

    expect(absentPlan.messagesTransform[0]?.content).toContain('### Structural Context');
    expect(absentPlan.messagesTransform[0]?.content).toContain('Structural availability: absent; canonical=missing; graphFreshness=empty');
    expect(absentPlan.messagesTransform[0]?.content).toContain(
      'Structural trust axes: parserProvenance=unknown; evidenceStatus=unverified; freshnessAuthority=unknown',
    );
    expect(unavailablePlan.messagesTransform[0]?.content).toContain(
      'Structural availability: unavailable; canonical=missing; graphFreshness=error',
    );
  });

  it('coerces plain JSON payload objects safely', () => {
    const payload = makePayload('resume', 'resume summary');
    expect(coerceSharedPayloadEnvelope(payload)?.kind).toBe('resume');
    expect(coerceSharedPayloadEnvelope({ nope: true })).toBeNull();
  });

  it('rejects invalid shared payload kinds during coercion', () => {
    const payload = {
      ...makePayload('resume', 'resume summary'),
      kind: 'resume-ish',
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'Invalid shared payload envelope kind "resume-ish"',
    );
  });

  it('rejects invalid shared payload producers during coercion', () => {
    const payload = {
      ...makePayload('resume', 'resume summary'),
      provenance: {
        ...makePayload('resume', 'resume summary').provenance,
        producer: 'resume_cache',
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'Invalid shared payload envelope provenance.producer "resume_cache"',
    );
  });
});
