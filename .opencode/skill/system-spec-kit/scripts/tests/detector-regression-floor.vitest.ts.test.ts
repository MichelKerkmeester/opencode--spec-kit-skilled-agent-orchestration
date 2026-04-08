import { describe, expect, it } from 'vitest';

import {
  DETERMINISTIC_EXTRACTOR_PROVENANCE,
  extractAliases,
  extractCodeFenceTechnologies,
  extractHeadings,
  extractRelationPhrases,
} from '../../mcp_server/lib/search/deterministic-extractor.ts';
import {
  EVIDENCE_GAP_DETECTOR_PROVENANCE,
  detectEvidenceGap,
  predictGraphCoverage,
} from '../../mcp_server/lib/search/evidence-gap-detector.ts';

const FROZEN_DETERMINISTIC_SAMPLE = `
# OAuth Runtime Notes

## Setup
AdapterLoader depends on ConfigStore.

\`\`\`typescript
export const enabled = true;
\`\`\`
`.trim();

const FROZEN_ALIAS_SAMPLE = 'RRF aka Rank Fusion';
const FROZEN_RELATION_SAMPLE = 'AdapterLoader depends on ConfigStore';

describe('detector regression floor', () => {
  it('keeps deterministic extractor provenance honest and output-stable', () => {
    expect(DETERMINISTIC_EXTRACTOR_PROVENANCE.extractHeadings.parserProvenance).toBe('regex');
    expect(DETERMINISTIC_EXTRACTOR_PROVENANCE.extractAliases.parserProvenance).toBe('regex');
    expect(DETERMINISTIC_EXTRACTOR_PROVENANCE.extractRelationPhrases.parserProvenance).toBe('regex');
    expect(DETERMINISTIC_EXTRACTOR_PROVENANCE.extractCodeFenceTechnologies.parserProvenance).toBe('regex');

    expect(extractHeadings(FROZEN_DETERMINISTIC_SAMPLE)).toEqual(['Setup']);
    expect(extractAliases(FROZEN_ALIAS_SAMPLE)).toEqual([
      ['RRF', 'Rank Fusion'],
    ]);
    expect(extractRelationPhrases(FROZEN_RELATION_SAMPLE)).toEqual([
      ['AdapterLoader', 'ConfigStore'],
    ]);
    expect(extractCodeFenceTechnologies(FROZEN_DETERMINISTIC_SAMPLE)).toEqual(['typescript']);
  });

  it('keeps evidence-gap detector labelled as heuristic and preserves frozen outcomes', () => {
    expect(EVIDENCE_GAP_DETECTOR_PROVENANCE.predictGraphCoverage.parserProvenance).toBe('heuristic');
    expect(EVIDENCE_GAP_DETECTOR_PROVENANCE.detectEvidenceGap.parserProvenance).toBe('heuristic');

    const graphCoverage = predictGraphCoverage('oauth adapter', {
      nodes: new Map([
        ['node:oauth', { id: 'node:oauth', labels: ['OAuth Adapter'], properties: {} }],
        ['node:cache', { id: 'node:cache', labels: ['Cache Layer'], properties: {} }],
      ]),
      inbound: new Map([
        ['node:oauth', ['memory:001', 'memory:002']],
        ['node:cache', ['memory:003']],
      ]),
    });

    expect(graphCoverage).toEqual({
      earlyGap: true,
      connectedNodes: 2,
    });

    const trm = detectEvidenceGap([0.012, 0.011, 0.009]);
    expect(trm.gapDetected).toBe(true);
    expect(trm.mean).toBeCloseTo(0.010667, 5);
    expect(trm.stdDev).toBeCloseTo(0.001247, 5);
    expect(trm.zScore).toBeCloseTo(1.069045, 5);
  });
});
