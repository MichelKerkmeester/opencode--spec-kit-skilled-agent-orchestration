import { describe, expect, it } from 'vitest';

import {
  sanitizeTriggerPhrase,
  sanitizeTriggerPhrases,
} from '../lib/trigger-phrase-sanitizer';

describe('manual trigger phrase preservation', () => {
  it('preserves manual DR finding ids verbatim through sanitization', () => {
    const manualDrPhrases = [
      'DR-002-I003-P1-001 blocked status drift',
      'DR-008-I001-P1-001 validator false positive',
      'DR-010-I001-P1-001 semantic indexing skip',
      'DR-013-I003-P1-001 continuation signal drift',
      'DR-014-I001-P1-001 title description rejection',
    ];

    const result = sanitizeTriggerPhrases(manualDrPhrases, { source: 'manual' });
    // All phrases are kept; order is by descending comparison-key length.
    expect(new Set(result)).toEqual(
      new Set(manualDrPhrases.map((phrase) => phrase.toLowerCase())),
    );
    expect(result).toHaveLength(manualDrPhrases.length);
  });

  it('keeps compact manual singleton anchors that extracted mode still filters', () => {
    const result = sanitizeTriggerPhrases(['graph', 'research', 'phases'], { source: 'manual' });
    // All three are kept; order is by descending comparison-key length.
    expect(new Set(result)).toEqual(new Set(['graph', 'research', 'phases']));
    expect(result).toHaveLength(3);

    expect(sanitizeTriggerPhrases(['graph', 'research', 'phases', 'with phases', 'with research'], { source: 'extracted' })).toEqual([]);
  });

  it('still rejects contamination in manual phrases', () => {
    expect(sanitizeTriggerPhrase('<div>tool state leak</div>', { source: 'manual' })).toEqual({
      keep: false,
      reason: 'contamination',
    });
  });

  it('still rejects manual phrases that contain file-path fragments', () => {
    expect(
      sanitizeTriggerPhrase('/Users/michel/Documents/file.ts', { source: 'manual' }),
    ).toEqual({
      keep: false,
      reason: 'path_fragment',
    });
  });
});
