import { describe, expect, it } from 'vitest';

import { extractDecisions } from '../extractors/decision-extractor';

describe('decision confidence calibration', () => {
  it('keeps choice confidence modest when only alternatives are present', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose database',
        narrative: 'We reviewed the database options.',
        timestamp: '2026-03-16T10:00:00Z',
        facts: [
          'Option A: PostgreSQL - Relational database',
          'Option B: SQLite - Embedded database',
        ],
      }],
    });

    expect(result.DECISIONS[0]?.CHOICE_CONFIDENCE).toBeCloseTo(0.8, 3);
    expect(result.DECISIONS[0]?.RATIONALE_CONFIDENCE).toBeCloseTo(0.7, 3);
    expect(result.DECISIONS[0]?.CONFIDENCE).toBeCloseTo(0.7, 3);
  });

  it('produces stronger choice confidence than rationale confidence when only the choice is explicit', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose database',
        narrative: 'Selected PostgreSQL.',
        timestamp: '2026-03-16T10:00:00Z',
        facts: [
          'Option A: PostgreSQL - Relational database',
          'Option B: SQLite - Embedded database',
        ],
      }],
    });

    expect(result.DECISION_COUNT).toBe(1);
    expect(result.DECISIONS[0]?.CHOICE_CONFIDENCE).toBeCloseTo(0.95, 3);
    expect(result.DECISIONS[0]?.RATIONALE_CONFIDENCE).toBeCloseTo(0.7, 3);
    expect(result.DECISIONS[0]?.CONFIDENCE).toBeCloseTo(0.7, 3);
  });

  it('produces stronger rationale confidence when the choice remains implicit', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose database',
        narrative: 'Because ACID guarantees matter, the production database should stay relational.',
        timestamp: '2026-03-16T10:03:00Z',
        files: ['src/db/config.ts'],
        facts: [
          'Advantage: Keeps transactional guarantees intact',
          'Caveat: Requires migration planning',
          'Evidence: src/db/config.ts',
        ],
      }],
    });

    expect(result.DECISIONS[0]?.CHOICE_CONFIDENCE).toBeCloseTo(0.7, 3);
    expect(result.DECISIONS[0]?.RATIONALE_CONFIDENCE).toBeCloseTo(0.95, 3);
    expect(result.DECISIONS[0]?.CONFIDENCE).toBeCloseTo(0.7, 3);
  });

  it('raises rationale confidence when rationale, tradeoffs, and evidence are present', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose database',
        narrative: 'Selected PostgreSQL because it keeps ACID guarantees in place.',
        timestamp: '2026-03-16T10:05:00Z',
        files: ['src/db/config.ts'],
        facts: [
          'Option A: PostgreSQL - Relational database',
          'Option B: SQLite - Embedded database',
          'Advantage: Better data integrity',
          'Caveat: Requires migration planning',
          'Evidence: src/db/config.ts',
        ],
      }],
    });

    expect(result.DECISIONS[0]?.CHOICE_CONFIDENCE).toBeCloseTo(0.95, 3);
    expect(result.DECISIONS[0]?.RATIONALE_CONFIDENCE).toBeCloseTo(0.95, 3);
    expect(result.DECISIONS[0]?.CONFIDENCE).toBeCloseTo(0.95, 3);
  });

  it('maps explicit single confidence overrides to both new fields', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose repair strategy',
        narrative: 'Use the batched repair path.',
        timestamp: '2026-03-16T10:10:00Z',
        _manualDecision: {
          fullText: 'Use the batched repair path.',
          chosenApproach: 'Batched repair path',
          confidence: 82,
        },
      }],
    });

    expect(result.DECISIONS[0]?.CHOICE_CONFIDENCE).toBeCloseTo(0.82, 3);
    expect(result.DECISIONS[0]?.RATIONALE_CONFIDENCE).toBeCloseTo(0.82, 3);
    expect(result.DECISIONS[0]?.CONFIDENCE).toBeCloseTo(0.82, 3);
  });

  it('clamps explicit confidence overrides into the normalized range', async () => {
    const result = await extractDecisions({
      SPEC_FOLDER: '005-confidence-calibration',
      observations: [{
        type: 'decision',
        title: 'Choose migration strategy',
        narrative: 'Selected staged rollout. Confidence: 150%',
        timestamp: '2026-03-16T10:15:00Z',
      }],
    });

    expect(result.DECISIONS[0]?.CHOICE_CONFIDENCE).toBe(1);
    expect(result.DECISIONS[0]?.RATIONALE_CONFIDENCE).toBe(1);
    expect(result.DECISIONS[0]?.CONFIDENCE).toBe(1);
  });
});
