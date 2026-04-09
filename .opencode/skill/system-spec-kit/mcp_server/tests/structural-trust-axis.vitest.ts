import { describe, expect, it } from 'vitest';
import {
  DETECTOR_PROVENANCE_VALUES,
  EVIDENCE_STATUS_VALUES,
  FRESHNESS_AUTHORITY_VALUES,
  PARSER_PROVENANCE_VALUES,
  createSharedPayloadEnvelope,
  detectorProvenanceToParserProvenance,
  isDetectorProvenance,
  isStructuralTrustComplete,
  makeStructuralTrust,
} from '../lib/context/shared-payload.js';
import { computeResultConfidence } from '../lib/search/confidence-scoring.js';

describe('structural trust axis contract', () => {
  it('exports the three structural trust axis vocabularies separately', () => {
    expect([...PARSER_PROVENANCE_VALUES]).toEqual(['ast', 'regex', 'heuristic', 'unknown']);
    expect([...DETECTOR_PROVENANCE_VALUES]).toEqual(['ast', 'structured', 'regex', 'heuristic']);
    expect([...EVIDENCE_STATUS_VALUES]).toEqual(['confirmed', 'probable', 'unverified', 'unknown']);
    expect([...FRESHNESS_AUTHORITY_VALUES]).toEqual(['live', 'cached', 'stale', 'unknown']);
  });

  it('keeps detector provenance separate from the parser trust-axis vocabulary', () => {
    expect(isDetectorProvenance('structured')).toBe(true);
    expect(isDetectorProvenance('marketing')).toBe(false);
    expect(detectorProvenanceToParserProvenance('structured')).toBe('regex');
  });

  it('keeps parser provenance, evidence status, and freshness authority as separate fields', () => {
    const structuralTrust = makeStructuralTrust({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });

    const payload = createSharedPayloadEnvelope({
      kind: 'bootstrap',
      summary: 'Structural context ready',
      sections: [{
        key: 'structural-context',
        title: 'Structural Context',
        content: 'Code graph ready',
        source: 'code-graph',
        structuralTrust,
      }],
      provenance: {
        producer: 'session_bootstrap',
        sourceSurface: 'session_bootstrap',
        trustState: 'live',
        generatedAt: '2026-04-08T12:00:00.000Z',
        lastUpdated: '2026-04-08T12:00:00.000Z',
        sourceRefs: ['session-snapshot'],
      },
    });

    expect(payload.sections[0]?.structuralTrust).toEqual({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
    });
    expect(isStructuralTrustComplete(payload.sections[0]?.structuralTrust)).toBe(true);
    expect(Object.keys(payload.sections[0]?.structuralTrust ?? {})).toEqual([
      'parserProvenance',
      'evidenceStatus',
      'freshnessAuthority',
    ]);
  });

  it('rejects collapsed scalar trust fields', () => {
    expect(() => makeStructuralTrust({
      parserProvenance: 'ast',
      evidenceStatus: 'confirmed',
      freshnessAuthority: 'live',
      trust: 'high',
    } as never)).toThrow('collapsed scalar fields');
  });

  it('keeps ranking confidence separate from structural trust axes', () => {
    const [firstConfidence] = computeResultConfidence([
      {
        id: 1,
        score: 0.92,
        sources: ['semantic', 'code-graph'],
        rerankerScore: 0.8,
        rerankerApplied: true,
        anchorMetadata: [{ key: 'summary' }, { key: 'next-steps' }],
      },
      {
        id: 2,
        score: 0.41,
        sources: ['semantic'],
        anchorMetadata: [{ key: 'summary' }],
      },
    ]);

    expect(firstConfidence?.confidence.value).toBeTypeOf('number');
    expect(firstConfidence?.confidence).not.toHaveProperty('structuralTrust');
    expect(firstConfidence?.confidence).not.toHaveProperty('parserProvenance');
    expect(firstConfidence?.confidence).not.toHaveProperty('evidenceStatus');
    expect(firstConfidence?.confidence).not.toHaveProperty('freshnessAuthority');
  });
});
