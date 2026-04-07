import { describe, expect, it } from 'vitest';

import { truncateOnWordBoundary } from '../lib/truncate-on-word-boundary';

function buildExactLengthText(targetLength: number): string {
  const words = [
    'phase',
    'foundation',
    'overview',
    'anchor',
    'template',
    'memory',
    'quality',
    'remediation',
    'helper',
    'session',
    'summary',
    'fixture',
    'validation',
    'replay',
    'cleanup',
    'narrative',
    'boundary',
    'aligned',
    'testing',
    'context',
  ];
  const terminalWords = [
    'a',
    'an',
    'fix',
    'plan',
    'phase',
    'anchor',
    'render',
    'summary',
    'boundary',
    'narrative',
    'validation',
    'remediation',
    'foundational',
    'documentation',
  ];

  let text = '';
  let index = 0;

  while (text.length < targetLength) {
    const remaining = targetLength - text.length;
    const needsSpace = text.length > 0;
    const budget = remaining - (needsSpace ? 1 : 0);
    const exactWord = terminalWords.find((word) => word.length === budget);
    if (exactWord) {
      text += `${needsSpace ? ' ' : ''}${exactWord}`;
      break;
    }

    const nextWord = words[index % words.length];
    index += 1;

    if (nextWord.length > budget) {
      continue;
    }

    text += `${needsSpace ? ' ' : ''}${nextWord}`;
  }

  return text;
}

function expectCleanBoundary(original: string, truncated: string): void {
  expect(truncated.endsWith('…')).toBe(true);
  const keptText = truncated.slice(0, -1);
  expect(original.startsWith(keptText)).toBe(true);
  expect(/\s/.test(original.charAt(keptText.length))).toBe(true);
}

describe('truncateOnWordBoundary', () => {
  it('returns shorter text unchanged without appending an ellipsis', () => {
    const text = 'Phase 1 kept the overview narrative readable.';

    expect(truncateOnWordBoundary(text, 80)).toBe(text);
    expect(truncateOnWordBoundary(text, 80).endsWith('…')).toBe(false);
  });

  it('returns text exactly at the limit unchanged without appending an ellipsis', () => {
    const text = buildExactLengthText(120);

    expect(text.length).toBe(120);
    expect(truncateOnWordBoundary(text, 120)).toBe(text);
    expect(truncateOnWordBoundary(text, 120).endsWith('…')).toBe(false);
  });

  it('truncates longer text on a word boundary with the canonical ellipsis', () => {
    const text = 'Phase 1 foundation work aligned overview anchors and preserved narrative boundaries for later remediation steps.';
    const result = truncateOnWordBoundary(text, 64);

    expectCleanBoundary(text, result);
    expect(result.length).toBeLessThanOrEqual(65);
  });

  it('handles representative 450, 520, and 900 character inputs at a 500 character limit', () => {
    const text450 = buildExactLengthText(450);
    const text520 = buildExactLengthText(520);
    const text900 = buildExactLengthText(900);

    expect(text450.length).toBe(450);
    expect(text520.length).toBe(520);
    expect(text900.length).toBe(900);

    expect(truncateOnWordBoundary(text450, 500)).toBe(text450);

    const result520 = truncateOnWordBoundary(text520, 500);
    expectCleanBoundary(text520, result520);
    expect(result520.length).toBeLessThanOrEqual(501);

    const result900 = truncateOnWordBoundary(text900, 500);
    expectCleanBoundary(text900, result900);
    expect(result900.length).toBeLessThanOrEqual(501);
  });

  it('respects a custom ellipsis when provided', () => {
    const text = 'Phase 1 foundation work aligned overview anchors and preserved narrative boundaries for later remediation steps.';
    const result = truncateOnWordBoundary(text, 64, { ellipsis: '[cut]' });

    expect(result.endsWith('[cut]')).toBe(true);
    expect(result).not.toContain('…');
  });

  it('returns an empty string for empty input and zero or negative limits', () => {
    expect(truncateOnWordBoundary('', 100)).toBe('');
    expect(truncateOnWordBoundary('Phase 1', 0)).toBe('');
    expect(truncateOnWordBoundary('Phase 1', -5)).toBe('');
  });

  it('uses exactly the single-character Unicode ellipsis instead of three ASCII dots', () => {
    const text = 'Phase 1 foundation work aligned overview anchors and preserved narrative boundaries for later remediation steps.';
    const result = truncateOnWordBoundary(text, 64);
    const suffix = result.slice(-1);

    expect(suffix).toBe('…');
    expect(suffix).toHaveLength(1);
    expect(result.endsWith('...')).toBe(false);
  });
});
