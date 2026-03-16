import { describe, expect, it } from 'vitest';

import { scoreMemoryQuality } from '../core/quality-scorer';
import { extractFilesFromData } from '../extractors/file-extractor';
import { deriveModificationMagnitude } from '../extractors/git-context-extractor';
import { validateDescription } from '../utils/file-helpers';

function buildContent(title: string): string {
  return [
    '---',
    `title: "${title}"`,
    '---',
    '',
    `# ${title}`,
    '',
    ...Array.from({ length: 24 }, (_, index) => `Evidence line ${index + 1} for file-description quality scoring.`),
  ].join('\n');
}

describe('description enrichment', () => {
  it('classifies placeholder stub patterns through the shared validator', () => {
    expect(validateDescription('Recent commit: modify in repository history').tier).toBe('placeholder');
    expect(validateDescription('TBD').tier).toBe('placeholder');
    expect(validateDescription('todo').tier).toBe('placeholder');
    expect(validateDescription('pending').tier).toBe('placeholder');
    expect(validateDescription('n/a').tier).toBe('placeholder');
    expect(validateDescription('changed').tier).toBe('placeholder');
    expect(validateDescription('modified').tier).toBe('placeholder');
  });

  it('distinguishes activity-only, semantic, and high-confidence descriptions', () => {
    expect(validateDescription('Updated code').tier).toBe('activity-only');
    expect(validateDescription('Added provenance-aware file scoring to the quality scorer.').tier).toBe('semantic');
    expect(
      validateDescription('Derived MODIFICATION_MAGNITUDE from git diff stats and commit-touch counts in scripts/extractors/git-context-extractor.ts so downstream summaries can rank change significance.').tier
    ).toBe('high-confidence');
  });

  it('weights file description quality by provenance trust', () => {
    const highConfidenceDescription = 'Derived MODIFICATION_MAGNITUDE from git diff stats and commit-touch counts in scripts/extractors/git-context-extractor.ts so downstream summaries can rank change significance.';
    const args = [
      buildContent('Description trust weighting'),
      ['description weighting', 'provenance trust', 'quality scoring', 'git context'],
      ['description', 'provenance', 'quality'],
      [{ TITLE: 'Implement shared validator', NARRATIVE: 'Unified description validation across extractors and scoring.' }],
    ] as const;

    const gitResult = scoreMemoryQuality(args[0], args[1], args[2], [{ DESCRIPTION: highConfidenceDescription, _provenance: 'git' }], args[3]);
    const toolResult = scoreMemoryQuality(args[0], args[1], args[2], [{ DESCRIPTION: highConfidenceDescription, _provenance: 'tool' }], args[3]);
    const syntheticResult = scoreMemoryQuality(args[0], args[1], args[2], [{ DESCRIPTION: highConfidenceDescription, _provenance: 'tool', _synthetic: true }], args[3]);
    const unknownResult = scoreMemoryQuality(args[0], args[1], args[2], [{ DESCRIPTION: highConfidenceDescription }], args[3]);

    expect(gitResult.breakdown.fileDescriptions).toBe(20);
    expect(toolResult.breakdown.fileDescriptions).toBe(16);
    expect(syntheticResult.breakdown.fileDescriptions).toBe(10);
    expect(unknownResult.breakdown.fileDescriptions).toBe(6);
  });

  it('preserves git-derived modification magnitude and defaults non-git entries to unknown', () => {
    const files = extractFilesFromData(
      {
        FILES: [
          {
            FILE_PATH: 'scripts/core/workflow.ts',
            DESCRIPTION: 'Adds provenance-aware scoring to the memory quality pipeline.',
            ACTION: 'Modified',
            MODIFICATION_MAGNITUDE: 'medium',
            _provenance: 'git',
          },
        ],
        filesModified: [
          {
            path: 'scripts/core/config.ts',
            changes_summary: 'changed',
          },
        ],
      },
      [
        {
          title: 'Observed follow-up work',
          files: ['scripts/core/quality-scorer.ts'],
        },
      ],
    );

    expect(files).toEqual(expect.arrayContaining([
      expect.objectContaining({
        FILE_PATH: 'scripts/core/workflow.ts',
        MODIFICATION_MAGNITUDE: 'medium',
      }),
      expect.objectContaining({
        FILE_PATH: 'scripts/core/config.ts',
        MODIFICATION_MAGNITUDE: 'unknown',
      }),
      expect.objectContaining({
        FILE_PATH: 'scripts/core/quality-scorer.ts',
        MODIFICATION_MAGNITUDE: 'unknown',
      }),
    ]));
  });

  it('derives modification magnitude from change score, action, and commit-touch counts', () => {
    expect(deriveModificationMagnitude({ changeScore: 0.05, action: 'modify', commitTouches: 0 })).toBe('trivial');
    expect(deriveModificationMagnitude({ changeScore: 1, action: 'rename', commitTouches: 0 })).toBe('small');
    expect(deriveModificationMagnitude({ changeScore: 4, action: 'modify', commitTouches: 1 })).toBe('medium');
    expect(deriveModificationMagnitude({ changeScore: 3, action: 'modify', commitTouches: 3 })).toBe('large');
    expect(deriveModificationMagnitude({ action: 'modify', commitTouches: 0 })).toBe('unknown');
  });
});
