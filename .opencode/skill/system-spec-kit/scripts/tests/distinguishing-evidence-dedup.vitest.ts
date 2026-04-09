import { describe, expect, it } from 'vitest';

import { buildDistinctiveEvidence } from '../extractors/collect-session-data';

describe('distinguishing evidence deduplication', () => {
  it('deduplicates repeated bullets and prefers file-line anchored evidence', () => {
    const evidence = buildDistinctiveEvidence({
      observations: [],
      files: [],
      outcomes: [],
      nextAction: 'No pending tasks',
      blockers: 'None',
      limit: 5,
      explicitEvidence: [
        'scripts/core/workflow.ts:1401 derived_from now points to the latest sibling save.',
        'Packet 007 and packet 011 were re-verified before code changes.',
        'Packet 007 and packet 011 were re-verified before code changes.',
        'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
      ],
    });

    expect(evidence.map((item) => item.EVIDENCE_ITEM)).toEqual([
      'scripts/core/workflow.ts:1401 derived_from now points to the latest sibling save.',
      'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
      'Packet 007 and packet 011 were re-verified before code changes.',
    ]);
  });
});
