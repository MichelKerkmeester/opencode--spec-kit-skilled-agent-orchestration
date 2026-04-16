import { describe, expect, it } from 'vitest';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
} from '../lib/context/opencode-transport.js';
import type { SharedPayloadEnvelope } from '../lib/context/shared-payload.js';

function makePayload(kind: SharedPayloadEnvelope['kind'], summary: string): SharedPayloadEnvelope {
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
