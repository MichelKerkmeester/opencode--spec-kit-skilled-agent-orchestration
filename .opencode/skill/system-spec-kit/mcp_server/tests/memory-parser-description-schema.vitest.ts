// ───────────────────────────────────────────────────────────────
// MODULE: memory-parser description.json schema reuse tests
// ───────────────────────────────────────────────────────────────
// F-005-A5-05: parseDescriptionMetadataContent now runs through
// perFolderDescriptionSchema. Failures emit a path-aware error message.

import { describe, expect, it } from 'vitest';

import { parseMemoryContent } from '../lib/parsing/memory-parser.js';

describe('description.json schema reuse (F-005-A5-05)', () => {
  it('emits a path-aware error message when description.json is structurally invalid', () => {
    // Wrong shape: keywords is a string, not a string[].
    const malformed = JSON.stringify({
      specFolder: '999-test',
      description: 'broken',
      keywords: 'this should be an array',
      lastUpdated: '2025-01-01',
    });

    expect(() => parseMemoryContent(
      'specs/999-test/description.json',
      malformed,
    )).toThrow(/Invalid description metadata in/);
  });

  it('includes the file path in the error message', () => {
    const malformed = JSON.stringify({
      specFolder: 'a',
      description: 'b',
      keywords: 42, // wrong type
      lastUpdated: '2025-01-01',
    });
    try {
      parseMemoryContent('specs/888-bad-keywords/description.json', malformed);
      expect.fail('expected parseMemoryContent to throw');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).toContain('specs/888-bad-keywords/description.json');
    }
  });

  it('accepts a well-formed description.json without throwing', () => {
    const valid = JSON.stringify({
      specFolder: '998-test',
      description: 'ok shape',
      keywords: ['k1', 'k2'],
      lastUpdated: '2025-01-01',
      specId: '998',
      folderSlug: 'test',
      parentChain: ['parent'],
      memorySequence: 0,
      memoryNameHistory: [],
    });

    expect(() => parseMemoryContent(
      'specs/998-test/description.json',
      valid,
    )).not.toThrow();
  });

  it('preserves the per-field trim/normalize semantics (specFolder is trimmed)', () => {
    const valid = JSON.stringify({
      specFolder: '997-test  ',
      description: '  trimmed description  ',
      keywords: ['  k1  ', '', 'k2'],
      lastUpdated: '2025-01-01',
    });

    const result = parseMemoryContent(
      'specs/997-test/description.json',
      valid,
    );
    // The trim semantics propagate from parseDescriptionMetadataContent
    // into the indexable-text and trigger-phrases that parseMemoryContent
    // surfaces.
    expect(result.specFolder).toBe('997-test');
    // Keyword normalization (drop empty, trim) is preserved.
    expect(result.triggerPhrases.some((phrase) => phrase === 'k1')).toBe(true);
    expect(result.triggerPhrases.some((phrase) => phrase === 'k2')).toBe(true);
    expect(result.triggerPhrases.some((phrase) => phrase === '')).toBe(false);
  });
});
