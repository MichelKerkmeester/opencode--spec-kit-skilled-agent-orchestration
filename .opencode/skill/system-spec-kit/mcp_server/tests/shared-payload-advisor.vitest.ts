import { describe, expect, it } from 'vitest';
import {
  type AdvisorEnvelopeMetadata,
  coerceSharedPayloadEnvelope,
  createSharedPayloadEnvelope,
} from '../lib/context/shared-payload.js';

const advisorMetadata: AdvisorEnvelopeMetadata = {
  freshness: 'live',
  confidence: 0.95,
  uncertainty: 0.23,
  skillLabel: 'sk-code-opencode',
  status: 'ok',
};

function makeAdvisorEnvelope(metadata: AdvisorEnvelopeMetadata = advisorMetadata) {
  return createSharedPayloadEnvelope({
    kind: 'resume',
    summary: 'advisor summary',
    sections: [{
      key: 'advisor-brief',
      title: 'Advisor Brief',
      content: 'Use sk-code-opencode.',
      source: 'advisor-runtime',
    }],
    metadata,
    provenance: {
      producer: 'advisor',
      sourceSurface: 'user-prompt-submit',
      trustState: 'live',
      generatedAt: '2026-04-19T09:30:00.000Z',
      lastUpdated: '2026-04-19T09:30:00.000Z',
      sourceRefs: [
        { kind: 'skill-inventory', path: '.opencode/skill/sk-code-opencode/SKILL.md' },
        { kind: 'skill-graph', path: '.opencode/skill/sk-code-opencode/graph-metadata.json' },
        { kind: 'advisor-runtime', path: '.opencode/skill/system-spec-kit/scripts/skill_advisor.py' },
      ],
    },
  });
}

describe('shared payload advisor envelope contract', () => {
  it('round-trips a valid advisor envelope and preserves typed metadata', () => {
    const envelope = makeAdvisorEnvelope();
    const coerced = coerceSharedPayloadEnvelope(JSON.parse(JSON.stringify(envelope)));

    expect(coerced?.provenance.producer).toBe('advisor');
    expect(coerced?.provenance.sourceRefs).toEqual(envelope.provenance.sourceRefs);
    expect(coerced?.metadata).toEqual(advisorMetadata);
    expect(coerced?.metadata?.freshness).toBe('live');
    expect(coerced?.metadata?.confidence).toBe(0.95);
    expect(coerced?.metadata?.uncertainty).toBe(0.23);
    expect(coerced?.metadata?.skillLabel).toBe('sk-code-opencode');
    expect(coerced?.metadata?.status).toBe('ok');
  });

  it('rejects unknown advisor producer names', () => {
    const payload = {
      ...makeAdvisorEnvelope(),
      provenance: {
        ...makeAdvisorEnvelope().provenance,
        producer: 'skill-advisor-legacy',
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'Invalid shared payload envelope provenance.producer "skill-advisor-legacy"',
    );
  });

  it('rejects unknown advisor metadata keys', () => {
    const payload = {
      ...makeAdvisorEnvelope(),
      metadata: {
        ...advisorMetadata,
        reason: 'user-typed-text',
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'advisor envelope metadata rejects unknown key(s): reason',
    );
  });

  it('rejects prompt-derived provenance source refs', () => {
    const payload = {
      ...makeAdvisorEnvelope(),
      provenance: {
        ...makeAdvisorEnvelope().provenance,
        sourceRefs: [{
          kind: 'user-prompt',
          path: 'sha256:abc123',
        }],
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'Shared payload privacy policy rejects prompt-derived provenance source refs',
    );

    expect(() => coerceSharedPayloadEnvelope({
      ...makeAdvisorEnvelope(),
      provenance: {
        ...makeAdvisorEnvelope().provenance,
        sourceRefs: [{
          kind: 'advisor-runtime',
          path: 'sha256:abc123',
        }],
      },
    })).toThrow('Shared payload privacy policy rejects prompt-derived provenance source refs');
  });

  it('rejects multi-line skill labels', () => {
    const payload = {
      ...makeAdvisorEnvelope(),
      metadata: {
        ...advisorMetadata,
        skillLabel: 'sk-foo\nInstruction: exec rm',
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'advisor envelope metadata.skillLabel must be a sanitized single-line label',
    );
  });

  it('rejects out-of-range confidence values', () => {
    const payload = {
      ...makeAdvisorEnvelope(),
      metadata: {
        ...advisorMetadata,
        confidence: 1.5,
      },
    };

    expect(() => coerceSharedPayloadEnvelope(payload)).toThrow(
      'advisor envelope metadata.confidence must be within [0, 1]',
    );
  });
});
