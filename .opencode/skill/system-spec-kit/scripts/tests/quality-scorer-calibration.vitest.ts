// TEST: Legacy Quality Scorer Calibration
// Ensures thin generic memories score materially lower than rich specific memories
import { describe, expect, it } from 'vitest';

import { scoreMemoryQuality } from '../core/quality-scorer';

function buildContent(title: string, bodyLines: string[]): string {
  return [
    '---',
    `title: "${title}"`,
    '---',
    '',
    `# ${title}`,
    '',
    ...bodyLines,
  ].join('\n');
}

describe('scoreMemoryQuality calibration', () => {
  it('scores rich specific memories higher than thin generic memories', () => {
    const richContent = buildContent(
      'Claude Capture Fallback Hardening',
      Array.from({ length: 80 }, (_, index) => (
        `Line ${index + 1}: Detailed fallback behavior, provenance checks, and transcript parsing evidence.`
      )),
    );
    const thinContent = buildContent(
      'Development session',
      ['Done.', 'Updated stuff.', 'More work later.'],
    );

    const richResult = scoreMemoryQuality(
      richContent,
      ['claude capture', 'stateless fallback', 'quality scoring', 'transcript parser', 'history matching', 'memory save', 'alignment blocking', 'provenance'],
      ['claude', 'capture', 'fallback', 'quality', 'alignment'],
      [
        { DESCRIPTION: 'Integrates Claude transcript fallback into the stateless data loader with exact session matching.', _provenance: 'git' as const },
        { DESCRIPTION: 'Calibrates numeric quality scoring so generic summaries and weak observations do not look healthy.', _provenance: 'git' as const },
      ],
      [
        { TITLE: 'Inspect scripts/loaders/data-loader.ts', NARRATIVE: 'Mapped the missing fallback seam in the loader.' },
        { TITLE: 'Implement scripts/extractors/claude-code-capture.ts', NARRATIVE: 'Added bounded transcript selection and tool parsing.' },
        { TITLE: 'Calibrate core quality scorer', NARRATIVE: 'Reduced false-positive scores for thin generic output.' },
      ],
    );

    const thinResult = scoreMemoryQuality(
      thinContent,
      ['session'],
      ['session'],
      [],
      [
        { TITLE: 'Tool: Read', NARRATIVE: 'Read a file.' },
        { TITLE: 'Tool: Read', NARRATIVE: 'Read another file.' },
        { TITLE: 'Tool: Read', NARRATIVE: 'Read one more file.' },
      ],
    );

    expect(richResult.score).toBeGreaterThan(thinResult.score);
    expect(richResult.score01).toBeCloseTo(richResult.score100 / 100, 5);
    expect(thinResult.score01).toBeCloseTo(thinResult.score100 / 100, 5);
    expect(richResult.score).toBeGreaterThanOrEqual(85);
    expect(thinResult.score).toBeLessThan(60);
    expect(thinResult.warnings).toEqual(expect.arrayContaining([
      expect.stringMatching(/generic/i),
      expect.stringMatching(/duplicate|diversity/i),
    ]));
  });

  it('treats generic file descriptions and generic observation titles as low semantic density', () => {
    const result = scoreMemoryQuality(
      buildContent(
        'Implementation and updates',
        Array.from({ length: 25 }, (_, index) => `Generic line ${index + 1}.`),
      ),
      ['memory save', 'quality'],
      ['memory', 'quality'],
      [
        { DESCRIPTION: 'Modified during session' },
        { DESCRIPTION: 'Tracked file history snapshot' },
      ],
      [
        { TITLE: 'Read src/index.ts', NARRATIVE: 'Looked at source.' },
        { TITLE: 'Read src/index.ts', NARRATIVE: 'Looked again.' },
      ],
    );

    expect(result.breakdown.fileDescriptions).toBe(0);
    expect(result.breakdown.observationDedup).toBeLessThanOrEqual(5);
    expect(result.warnings).toEqual(expect.arrayContaining([
      expect.stringMatching(/files missing descriptions/i),
      expect.stringMatching(/generic/i),
    ]));
  });

  it('applies high-severity contamination penalty by default (null severity)', () => {
    const clean = scoreMemoryQuality(
      buildContent(
        'Quality scorer unification seam',
        Array.from({ length: 30 }, (_, index) => `Evidence line ${index + 1} for contamination penalty coverage.`),
      ),
      ['quality scorer', 'contamination penalty', 'workflow threshold', 'canonical score'],
      ['quality', 'contamination', 'threshold'],
      [
        { DESCRIPTION: 'Captures the scorer contract change for the canonical 0.0-1.0 scale.' },
      ],
      [
        { TITLE: 'Implement score01 contract', NARRATIVE: 'Unified the scorer return shape and legacy aliases.' },
      ],
      undefined,
      false,
    );

    const contaminated = scoreMemoryQuality(
      buildContent(
        'Quality scorer unification seam',
        Array.from({ length: 30 }, (_, index) => `Evidence line ${index + 1} for contamination penalty coverage.`),
      ),
      ['quality scorer', 'contamination penalty', 'workflow threshold', 'canonical score'],
      ['quality', 'contamination', 'threshold'],
      [
        { DESCRIPTION: 'Captures the scorer contract change for the canonical 0.0-1.0 scale.' },
      ],
      [
        { TITLE: 'Implement score01 contract', NARRATIVE: 'Unified the scorer return shape and legacy aliases.' },
      ],
      undefined,
      true,
    );

    expect(contaminated.score01).toBeLessThanOrEqual(0.6);
    expect(contaminated.score01).toBeLessThan(clean.score01);
    expect(contaminated.score100).toBe(Math.round(contaminated.score01 * 100));
    expect(contaminated.qualityFlags).toContain('has_contamination');
  });

  describe('contamination severity tiers', () => {
    function buildRichContent(): string {
      return buildContent(
        'Contamination severity tier calibration',
        Array.from({ length: 80 }, (_, index) => (
          `Line ${index + 1}: Detailed evidence for severity tier testing with provenance checks.`
        )),
      );
    }

    const richTriggers = ['claude capture', 'stateless fallback', 'quality scoring', 'transcript parser', 'history matching', 'memory save', 'alignment blocking', 'provenance'];
    const richTopics = ['claude', 'capture', 'fallback', 'quality', 'alignment'];
    const richFiles = [{ DESCRIPTION: 'Integrates Claude transcript fallback into the stateless data loader.', _provenance: 'git' as const }];
    const richObservations = [
      { TITLE: 'Inspect scripts/core/workflow.ts', NARRATIVE: 'Mapped the contamination flow.' },
      { TITLE: 'Calibrate severity tiers', NARRATIVE: 'Validated tiered penalty behavior.' },
      { TITLE: 'Verify score boundaries', NARRATIVE: 'Checked cap enforcement per severity level.' },
    ];

    it('applies a small penalty for low severity contamination', () => {
      const result = scoreMemoryQuality(
        buildRichContent(), richTriggers, richTopics, richFiles, richObservations,
        undefined, true, 'low',
      );

      expect(result.score01).toBeGreaterThan(0.60);
      const contaminationDim = result.dimensions.find((d) => d.id === 'contamination');
      expect(contaminationDim?.score01).toBe(0.95);
    });

    it('caps medium severity contamination at 0.85', () => {
      const result = scoreMemoryQuality(
        buildRichContent(), richTriggers, richTopics, richFiles, richObservations,
        undefined, true, 'medium',
      );

      expect(result.score01).toBeLessThanOrEqual(0.85);
      const contaminationDim = result.dimensions.find((d) => d.id === 'contamination');
      expect(contaminationDim?.score01).toBe(0.85);
    });

    it('caps high severity contamination at 0.60', () => {
      const result = scoreMemoryQuality(
        buildRichContent(), richTriggers, richTopics, richFiles, richObservations,
        undefined, true, 'high',
      );

      expect(result.score01).toBeLessThanOrEqual(0.60);
      const contaminationDim = result.dimensions.find((d) => d.id === 'contamination');
      expect(contaminationDim?.score01).toBe(0.60);
    });

    it('treats null severity as high (default behavior)', () => {
      const withNull = scoreMemoryQuality(
        buildRichContent(), richTriggers, richTopics, richFiles, richObservations,
        undefined, true, null,
      );
      const withHigh = scoreMemoryQuality(
        buildRichContent(), richTriggers, richTopics, richFiles, richObservations,
        undefined, true, 'high',
      );

      expect(withNull.score01).toBe(withHigh.score01);
      expect(withNull.dimensions).toEqual(withHigh.dimensions);
    });
  });
});
