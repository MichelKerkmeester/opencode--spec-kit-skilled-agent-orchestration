// ───────────────────────────────────────────────────────────────
// MODULE: parseTriggerPhrases shape tests
// ───────────────────────────────────────────────────────────────
// F-005-A5-04: typed validator for trigger_phrases column on raw search
// results. Replaces the prior `safeJsonParse<string[]>` cast.

import { describe, expect, it } from 'vitest';

import { parseTriggerPhrases } from '../formatters/search-results.js';

describe('parseTriggerPhrases (F-005-A5-04)', () => {
  it('returns the input array when already an array of strings', () => {
    expect(parseTriggerPhrases(['alpha', 'beta'])).toEqual(['alpha', 'beta']);
  });

  it('parses a JSON-encoded string of strings', () => {
    expect(parseTriggerPhrases(JSON.stringify(['alpha', 'beta']))).toEqual(['alpha', 'beta']);
  });

  it('drops non-string elements when the array is mixed', () => {
    // Previously safeJsonParse cast the array unchecked; now we filter.
    expect(parseTriggerPhrases(['alpha', 42, 'beta', null, { foo: 'bar' }]))
      .toEqual(['alpha', 'beta']);
  });

  it('drops non-string elements when the JSON string contains a mixed array', () => {
    expect(parseTriggerPhrases(JSON.stringify(['alpha', 42, 'beta'])))
      .toEqual(['alpha', 'beta']);
  });

  it('returns [] for null', () => {
    expect(parseTriggerPhrases(null)).toEqual([]);
  });

  it('returns [] for undefined', () => {
    expect(parseTriggerPhrases(undefined)).toEqual([]);
  });

  it('returns [] for malformed JSON', () => {
    expect(parseTriggerPhrases('{not-json')).toEqual([]);
  });

  it('returns [] when JSON parses to a non-array', () => {
    expect(parseTriggerPhrases(JSON.stringify({ skill: 'x' }))).toEqual([]);
    expect(parseTriggerPhrases(JSON.stringify('a string'))).toEqual([]);
  });

  it('returns [] for numeric / object input', () => {
    expect(parseTriggerPhrases(42)).toEqual([]);
    expect(parseTriggerPhrases({ phrases: ['x'] })).toEqual([]);
  });

  it('handles an empty array', () => {
    expect(parseTriggerPhrases([])).toEqual([]);
    expect(parseTriggerPhrases(JSON.stringify([]))).toEqual([]);
  });
});
