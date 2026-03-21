import { describe, expect, it } from 'vitest';

import { CONFIG } from '../core/index.ts';
import { validateDataStructure } from '../utils/data-validator.ts';
import { transformKeyDecision } from '../utils/input-normalizer.ts';
import { formatTimestamp } from '../utils/message-utils.ts';
import { generateContentSlug } from '../utils/slug-utils.ts';

describe('utility regression coverage', () => {
  it('forces missing array-backed flags to false', () => {
    const validated = validateDataStructure({
      HAS_CODE_BLOCKS: true,
    });

    expect(validated.HAS_CODE_BLOCKS).toBe(false);
  });

  it('ignores non-array decision alternatives', () => {
    const observation = transformKeyDecision({
      decision: 'Use TypeScript',
      rationale: 'Type safety',
      alternatives: 'JavaScript' as unknown as Array<string>,
    });

    expect(observation).not.toBeNull();
    expect(observation?.facts).toEqual([
      'Option 1: Use TypeScript',
      'Chose: Use TypeScript',
      'Rationale: Type safety',
    ]);
  });

  it('switches generic fallback slugs to the hash fallback', () => {
    expect(generateContentSlug('Development session', 'session-summary')).toMatch(/^session-[0-9a-f]{8}$/);
  });

  it('keeps iso timestamps in UTC while offsetting human-readable output', () => {
    const timestamp = '2024-01-15T10:30:00Z';
    const expectedReadable = new Date(
      new Date(timestamp).getTime() + (CONFIG.TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000)
    ).toISOString().split('.')[0].replace('T', ' @ ');

    expect(formatTimestamp(timestamp, 'iso')).toBe('2024-01-15T10:30:00.000Z');
    expect(formatTimestamp(timestamp, 'readable')).toBe(expectedReadable);
  });
});
