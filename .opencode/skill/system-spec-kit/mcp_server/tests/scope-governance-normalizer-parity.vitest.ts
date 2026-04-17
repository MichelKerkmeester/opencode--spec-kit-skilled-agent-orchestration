// ───────────────────────────────────────────────────────────────
// TEST: Scope Governance Normalizer Parity
// ───────────────────────────────────────────────────────────────
// T-SCP-01 (R1-P1-001, R4-P1-001): verifies the canonical single-string
// `normalizeScopeValue` export from `lib/governance/scope-governance` behaves
// identically for every case the four previously-duplicated local copies
// handled (handlers/save/reconsolidation-bridge, handlers/save/types
// (`normalizeScopeMatchValue`), lib/storage/lineage-state,
// lib/validation/preflight inline lambda).
import { describe, expect, it } from 'vitest';

import { normalizeScopeValue } from '../lib/governance/scope-governance.js';
import { normalizeScopeMatchValue } from '../handlers/save/types.js';

describe('normalizeScopeValue (canonical single-string scope normalizer)', () => {
  it('returns null for undefined input', () => {
    expect(normalizeScopeValue(undefined)).toBeNull();
  });

  it('returns null for null input', () => {
    expect(normalizeScopeValue(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normalizeScopeValue('')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(normalizeScopeValue('   ')).toBeNull();
    expect(normalizeScopeValue('\t')).toBeNull();
    expect(normalizeScopeValue('\n\n  \t  ')).toBeNull();
  });

  it('returns null for non-string inputs (number, boolean, object, array)', () => {
    expect(normalizeScopeValue(123)).toBeNull();
    expect(normalizeScopeValue(0)).toBeNull();
    expect(normalizeScopeValue(true)).toBeNull();
    expect(normalizeScopeValue(false)).toBeNull();
    expect(normalizeScopeValue({})).toBeNull();
    expect(normalizeScopeValue({ id: 'foo' })).toBeNull();
    expect(normalizeScopeValue([])).toBeNull();
    expect(normalizeScopeValue(['foo'])).toBeNull();
  });

  it('returns trimmed string for valid input (no surrounding whitespace)', () => {
    expect(normalizeScopeValue('foo')).toBe('foo');
    expect(normalizeScopeValue('tenant-123')).toBe('tenant-123');
  });

  it('trims leading and trailing whitespace from valid string input', () => {
    expect(normalizeScopeValue('  bar  ')).toBe('bar');
    expect(normalizeScopeValue('\tbaz\n')).toBe('baz');
    expect(normalizeScopeValue('   user-42   ')).toBe('user-42');
  });

  it('preserves internal whitespace (only trims edges)', () => {
    expect(normalizeScopeValue('  a  b  ')).toBe('a  b');
  });
});

describe('normalizeScopeMatchValue (legacy wrapper in handlers/save/types.ts)', () => {
  // This wrapper delegates to the canonical helper. If the collapse regressed,
  // the parity matrix below would diverge from `normalizeScopeValue` and the
  // comparison test at the end would fail.
  it.each([
    ['undefined', undefined, null],
    ['null', null, null],
    ['empty string', '', null],
    ['whitespace-only', '   ', null],
    ['valid string', 'foo', 'foo'],
    ['padded string', '  bar  ', 'bar'],
  ])('maps %s → expected canonical value', (_label, input, expected) => {
    expect(normalizeScopeMatchValue(input as string | null | undefined)).toBe(expected);
  });

  it('produces identical output to canonical `normalizeScopeValue` for string-like inputs', () => {
    const cases: Array<string | null | undefined> = [
      undefined,
      null,
      '',
      '   ',
      'foo',
      '  bar  ',
      '\tbaz\n',
    ];
    for (const input of cases) {
      expect(normalizeScopeMatchValue(input)).toBe(normalizeScopeValue(input));
    }
  });
});
