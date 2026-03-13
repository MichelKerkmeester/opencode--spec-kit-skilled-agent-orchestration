// TEST: REDACTION GATE CALIBRATION (T027g-T027i)
import { describe, expect, it } from 'vitest';
import {
  applyRedactionGate,
  GENERIC_HIGH_ENTROPY_MIN_LENGTH,
} from '../lib/extraction/redaction-gate';

describe('Redaction Gate (T027g-T027i)', () => {
  it('redacts secret-like values', () => {
    const input = [
      'token=sk-1234567890abcdefghijklmnopqrstuv',
      'auth=Bearer abcdefghijklmnopqrstuvwxyz1234567890',
      'email=alice@example.com',
    ].join('\n');

    const result = applyRedactionGate(input);
    expect(result.redactionApplied).toBe(true);
    expect(result.matches.length).toBeGreaterThanOrEqual(3);
    expect(result.redactedText.includes('[REDACTED]')).toBe(true);
  });

  it('does not redact 40-char git SHA values', () => {
    const gitSha = '0123456789abcdef0123456789abcdef01234567';
    const result = applyRedactionGate(`commit ${gitSha}`);
    expect(result.redactionApplied).toBe(false);
    expect(result.redactedText).toContain(gitSha);
  });

  it('does not redact UUID values', () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174000';
    const result = applyRedactionGate(`id=${uuid}`);
    expect(result.redactionApplied).toBe(false);
    expect(result.redactedText).toContain(uuid);
  });

  it('uses tuned generic high-entropy threshold', () => {
    const almost = 'A'.repeat(GENERIC_HIGH_ENTROPY_MIN_LENGTH - 1);
    const atLeast = 'B'.repeat(GENERIC_HIGH_ENTROPY_MIN_LENGTH);

    const lowResult = applyRedactionGate(`value ${almost}`);
    expect(lowResult.redactionApplied).toBe(false);

    const highResult = applyRedactionGate(`value ${atLeast}`);
    expect(highResult.redactionApplied).toBe(true);
  });
});
