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
        { DESCRIPTION: 'Integrates Claude transcript fallback into the stateless data loader with exact session matching.' },
        { DESCRIPTION: 'Calibrates numeric quality scoring so generic summaries and weak observations do not look healthy.' },
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
});
