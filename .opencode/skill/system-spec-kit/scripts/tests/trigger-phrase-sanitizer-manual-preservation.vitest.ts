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

    expect(sanitizeTriggerPhrases(manualDrPhrases, { source: 'manual' })).toEqual(
      manualDrPhrases.map((phrase) => phrase.toLowerCase()),
    );
  });

  it('keeps compact manual singleton anchors that extracted mode still filters', () => {
    expect(sanitizeTriggerPhrases(['graph', 'research', 'phases'], { source: 'manual' })).toEqual([
      'graph',
      'research',
      'phases',
    ]);

    expect(sanitizeTriggerPhrases(['graph', 'research', 'phases', 'with phases', 'with research'], { source: 'extracted' })).toEqual([]);
  });

  it('still rejects contamination in manual phrases', () => {
    expect(sanitizeTriggerPhrase('<div>tool state leak</div>', { source: 'manual' })).toEqual({
      keep: false,
      reason: 'contamination',
    });
  });
});
