// ───────────────────────────────────────────────────────────────
// TEST: Query Surrogates (D2 REQ-D2-005)
// ───────────────────────────────────────────────────────────────
// Covers: alias extraction, heading extraction, summary generation,
// surrogate question generation, full pipeline, storage round-trip,
// query-time matching, feature flag gating, and edge cases.

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';

import {
  extractAliases,
  extractHeadings,
  generateSummary,
  generateSurrogateQuestions,
  generateSurrogates,
  matchSurrogates,
  initSurrogateTable,
  storeSurrogates,
  loadSurrogates,
  loadSurrogatesBatch,
  isQuerySurrogatesEnabled,
  __testables,
  type SurrogateMetadata,
} from '../lib/search/query-surrogates';

/* ───────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────── */

const { tokenize, keywordOverlap, MAX_SURROGATE_QUESTIONS, MIN_SURROGATE_QUESTIONS, MAX_SUMMARY_LENGTH, MIN_MATCH_THRESHOLD } = __testables;

const FLAG_NAME = 'SPECKIT_QUERY_SURROGATES';
let originalFlagValue: string | undefined;

function enableFlag(): void {
  process.env[FLAG_NAME] = 'true';
}

function disableFlag(): void {
  process.env[FLAG_NAME] = 'false';
}

/**
 * Creates an in-memory SQLite database with the surrogate table.
 */
function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initSurrogateTable(db);
  return db;
}

/**
 * Build a SurrogateMetadata object for testing.
 */
function makeSurrogates(overrides?: Partial<SurrogateMetadata>): SurrogateMetadata {
  return {
    aliases: overrides?.aliases ?? ['RRF', 'Reciprocal Rank Fusion'],
    headings: overrides?.headings ?? ['Configuration', 'Usage'],
    summary: overrides?.summary ?? 'A module that fuses ranking signals from multiple search channels.',
    surrogateQuestions: overrides?.surrogateQuestions ?? [
      'What is Reciprocal Rank Fusion?',
      'How do I configure RRF?',
    ],
    generatedAt: overrides?.generatedAt ?? Date.now(),
  };
}

/* ═══════════════════════════════════════════════════════════════
   0. Setup / Teardown
   ═══════════════════════════════════════════════════════════════ */

beforeEach(() => {
  originalFlagValue = process.env[FLAG_NAME];
  enableFlag();
});

afterEach(() => {
  if (originalFlagValue === undefined) {
    delete process.env[FLAG_NAME];
  } else {
    process.env[FLAG_NAME] = originalFlagValue;
  }
});

/* ═══════════════════════════════════════════════════════════════
   1. Feature Flag
   ═══════════════════════════════════════════════════════════════ */

describe('isQuerySurrogatesEnabled', () => {
  it('returns true when SPECKIT_QUERY_SURROGATES=true', () => {
    process.env[FLAG_NAME] = 'true';
    expect(isQuerySurrogatesEnabled()).toBe(true);
  });

  it('returns true when SPECKIT_QUERY_SURROGATES=1', () => {
    process.env[FLAG_NAME] = '1';
    expect(isQuerySurrogatesEnabled()).toBe(true);
  });

  it('returns true with leading/trailing whitespace', () => {
    process.env[FLAG_NAME] = '  true  ';
    expect(isQuerySurrogatesEnabled()).toBe(true);
  });

  it('returns true when unset (graduated)', () => {
    delete process.env[FLAG_NAME];
    expect(isQuerySurrogatesEnabled()).toBe(true);
  });

  it('returns false when set to false', () => {
    process.env[FLAG_NAME] = 'false';
    expect(isQuerySurrogatesEnabled()).toBe(false);
  });

  it('returns true for arbitrary string (graduated — any non-false value is ON)', () => {
    process.env[FLAG_NAME] = 'yes';
    expect(isQuerySurrogatesEnabled()).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════
   2. Alias Extraction
   ═══════════════════════════════════════════════════════════════ */

describe('extractAliases', () => {
  it('extracts parenthetical abbreviations', () => {
    const content = 'Reciprocal Rank Fusion (RRF) is a fusion method.';
    const aliases = extractAliases(content);
    expect(aliases).toContain('RRF');
  });

  it('extracts multiple abbreviations', () => {
    const content = `
      Reciprocal Rank Fusion (RRF) and Term Frequency-Inverse Document Frequency (TF-IDF)
      are both important scoring mechanisms.
    `;
    const aliases = extractAliases(content);
    expect(aliases).toContain('RRF');
    expect(aliases).toContain('TF-IDF');
  });

  it('extracts definitions after abbreviations', () => {
    const content = 'RRF (Reciprocal Rank Fusion) combines scores from multiple channels.';
    const aliases = extractAliases(content);
    expect(aliases).toContain('Reciprocal Rank Fusion');
  });

  it('extracts "aka" patterns', () => {
    const content = 'The system aka "Memory Engine" provides search capabilities.';
    const aliases = extractAliases(content);
    expect(aliases).toContain('Memory Engine');
  });

  it('deduplicates aliases', () => {
    const content = `
      Reciprocal Rank Fusion (RRF) is important.
      Also see Reciprocal Rank Fusion (RRF) for details.
    `;
    const aliases = extractAliases(content);
    const rrfCount = aliases.filter((a) => a === 'RRF').length;
    expect(rrfCount).toBe(1);
  });

  it('returns empty array for empty content', () => {
    expect(extractAliases('')).toEqual([]);
    expect(extractAliases('   ')).toEqual([]);
  });

  it('returns empty array for content without abbreviations', () => {
    const content = 'This is a simple paragraph with no abbreviations or definitions.';
    const aliases = extractAliases(content);
    expect(aliases).toEqual([]);
  });

  it('ignores single-character abbreviations', () => {
    const content = 'Something (X) is not a valid abbreviation.';
    const aliases = extractAliases(content);
    // "X" is only 1 char, but the pattern requires 2+
    expect(aliases.some((a) => a === 'X')).toBe(false);
  });
});

/* ═══════════════════════════════════════════════════════════════
   3. Heading Extraction
   ═══════════════════════════════════════════════════════════════ */

describe('extractHeadings', () => {
  it('extracts ## and ### headings', () => {
    const content = `
# Title
## Introduction
### Getting Started
## Configuration
Some text here.
### Advanced Options
`;
    const headings = extractHeadings(content);
    expect(headings).toContain('Title');
    expect(headings).toContain('Introduction');
    expect(headings).toContain('Getting Started');
    expect(headings).toContain('Configuration');
    expect(headings).toContain('Advanced Options');
  });

  it('strips bold markdown formatting', () => {
    const content = '## **Bold Heading**\n### __Underscored Bold__';
    const headings = extractHeadings(content);
    expect(headings).toContain('Bold Heading');
    expect(headings).toContain('Underscored Bold');
  });

  it('strips italic markdown formatting', () => {
    const content = '## *Italic Heading*\n### _Underscored Italic_';
    const headings = extractHeadings(content);
    expect(headings).toContain('Italic Heading');
    expect(headings).toContain('Underscored Italic');
  });

  it('strips code spans', () => {
    const content = '## Using `generateSurrogates` function';
    const headings = extractHeadings(content);
    expect(headings).toContain('Using generateSurrogates function');
  });

  it('strips link markdown', () => {
    const content = '## See [Documentation](https://example.com)';
    const headings = extractHeadings(content);
    expect(headings).toContain('See Documentation');
  });

  it('returns empty array for content without headings', () => {
    const content = 'Just a plain paragraph.\nAnother line.';
    const headings = extractHeadings(content);
    expect(headings).toEqual([]);
  });

  it('returns empty array for empty content', () => {
    expect(extractHeadings('')).toEqual([]);
    expect(extractHeadings('   ')).toEqual([]);
  });

  it('skips lines that look like headings but are not', () => {
    const content = '#not-a-heading\n##also-not (no space)';
    const headings = extractHeadings(content);
    expect(headings).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════
   4. Summary Generation
   ═══════════════════════════════════════════════════════════════ */

describe('generateSummary', () => {
  it('extracts first paragraph as summary', () => {
    const content = `
# Title
This is the first paragraph with enough content to qualify as a valid extractive summary for testing.

## Section
More content here.
`;
    const summary = generateSummary(content);
    expect(summary).toContain('first paragraph');
    expect(summary.length).toBeGreaterThan(0);
    expect(summary.length).toBeLessThanOrEqual(MAX_SUMMARY_LENGTH);
  });

  it('falls back to truncation for long content without clear paragraphs', () => {
    const content = 'A'.repeat(300);
    const summary = generateSummary(content);
    expect(summary.length).toBeLessThanOrEqual(MAX_SUMMARY_LENGTH);
    expect(summary.length).toBeGreaterThan(0);
  });

  it('returns empty string for empty content', () => {
    expect(generateSummary('')).toBe('');
    expect(generateSummary('   ')).toBe('');
  });

  it('respects MAX_SUMMARY_LENGTH boundary', () => {
    const words = Array.from({ length: 100 }, (_, i) => `word${i}`);
    const content = words.join(' ');
    const summary = generateSummary(content);
    expect(summary.length).toBeLessThanOrEqual(MAX_SUMMARY_LENGTH);
  });

  it('skips headings when extracting summary', () => {
    const content = `
## Heading One
## Heading Two
The actual content starts here and provides useful information about the system architecture and design.
`;
    const summary = generateSummary(content);
    expect(summary).not.toMatch(/^##/);
    expect(summary).toContain('actual content');
  });

  it('skips YAML front-matter markers', () => {
    const content = `---
title: Test
---
The real content begins here with useful information about query surrogates.`;
    const summary = generateSummary(content);
    expect(summary).not.toContain('---');
    expect(summary).toContain('real content');
  });

  it('handles content that is all headings', () => {
    const content = '## Heading One\n## Heading Two\n### Heading Three';
    const summary = generateSummary(content);
    // Should return something (fallback to raw content)
    expect(typeof summary).toBe('string');
  });
});

/* ═══════════════════════════════════════════════════════════════
   5. Surrogate Question Generation
   ═══════════════════════════════════════════════════════════════ */

describe('generateSurrogateQuestions', () => {
  it('generates "What is [title]?" from document title', () => {
    const questions = generateSurrogateQuestions('Query Surrogates', [], '');
    expect(questions.some((q) => q.includes('What is Query Surrogates'))).toBe(true);
  });

  it('converts "How to X" headings to questions', () => {
    const questions = generateSurrogateQuestions(
      'Title',
      ['How to configure search'],
      '',
    );
    expect(questions.some((q) => q.includes('How do I configure search'))).toBe(true);
  });

  it('converts "Why X" headings to questions', () => {
    const questions = generateSurrogateQuestions(
      'Title',
      ['Why use surrogate questions'],
      '',
    );
    expect(questions.some((q) => q.includes('Why use surrogate questions'))).toBe(true);
  });

  it('converts "When X" headings to questions', () => {
    const questions = generateSurrogateQuestions(
      'Title',
      ['When to apply index-time surrogates'],
      '',
    );
    expect(questions.some((q) => q.includes('When should I'))).toBe(true);
  });

  it('generates questions for configuration-related headings', () => {
    const questions = generateSurrogateQuestions(
      'Title',
      ['Setup Instructions', 'Configuration Guide'],
      '',
    );
    expect(questions.some((q) => /how do i/i.test(q))).toBe(true);
  });

  it('caps at MAX_SURROGATE_QUESTIONS', () => {
    const headings = Array.from({ length: 20 }, (_, i) => `How to do thing ${i}`);
    const questions = generateSurrogateQuestions('Title', headings, '');
    expect(questions.length).toBeLessThanOrEqual(MAX_SURROGATE_QUESTIONS);
  });

  it('ensures minimum question count', () => {
    const questions = generateSurrogateQuestions('My Feature', [], '');
    expect(questions.length).toBeGreaterThanOrEqual(MIN_SURROGATE_QUESTIONS);
  });

  it('deduplicates questions', () => {
    const questions = generateSurrogateQuestions(
      'Title',
      ['How to configure X', 'How to configure X'],
      '',
    );
    const configQuestions = questions.filter((q) => q.includes('configure'));
    expect(configQuestions.length).toBe(1);
  });

  it('adds usage question for tutorial content', () => {
    const questions = generateSurrogateQuestions(
      'Memory System',
      [],
      'This step-by-step guide shows how to use the system.',
    );
    expect(questions.some((q) => q.includes('When should I use'))).toBe(true);
  });

  it('handles empty title gracefully', () => {
    const questions = generateSurrogateQuestions('', ['Some heading'], 'Some content');
    expect(Array.isArray(questions)).toBe(true);
    // Should not contain "What is ?" with empty title
    expect(questions.some((q) => q === 'What is ?')).toBe(false);
  });

  it('converts generic headings to "What about X?" questions', () => {
    const questions = generateSurrogateQuestions(
      'Title',
      ['Architecture Overview'],
      '',
    );
    expect(questions.some((q) => q.includes('What about architecture overview'))).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════
   6. Full Pipeline — generateSurrogates
   ═══════════════════════════════════════════════════════════════ */

describe('generateSurrogates', () => {
  it('returns SurrogateMetadata when flag is enabled', () => {
    const content = `
# Reciprocal Rank Fusion

Reciprocal Rank Fusion (RRF) is a method for combining ranked lists.

## How to configure RRF

Set the k parameter to control the fusion weight.

## Performance

RRF performs well on diverse query types.
`;
    const result = generateSurrogates(content, 'Reciprocal Rank Fusion');
    expect(result).not.toBeNull();

    const meta = result!;
    expect(meta.aliases).toContain('RRF');
    expect(meta.headings.length).toBeGreaterThan(0);
    expect(meta.summary.length).toBeGreaterThan(0);
    expect(meta.surrogateQuestions.length).toBeGreaterThanOrEqual(MIN_SURROGATE_QUESTIONS);
    expect(meta.surrogateQuestions.length).toBeLessThanOrEqual(MAX_SURROGATE_QUESTIONS);
    expect(typeof meta.generatedAt).toBe('number');
    expect(meta.generatedAt).toBeGreaterThan(0);
  });

  it('returns null when flag is disabled', () => {
    disableFlag();
    const result = generateSurrogates('Some content', 'Title');
    expect(result).toBeNull();
  });

  it('handles empty content', () => {
    const result = generateSurrogates('', 'Empty Document');
    expect(result).not.toBeNull();

    const meta = result!;
    expect(meta.aliases).toEqual([]);
    expect(meta.headings).toEqual([]);
    expect(meta.summary).toBe('');
    expect(meta.surrogateQuestions.length).toBeGreaterThanOrEqual(1);
  });

  it('generates valid metadata for minimal content', () => {
    const result = generateSurrogates('Just a single line.', 'Minimal');
    expect(result).not.toBeNull();

    const meta = result!;
    expect(meta.summary.length).toBeGreaterThan(0);
    expect(meta.surrogateQuestions.length).toBeGreaterThanOrEqual(MIN_SURROGATE_QUESTIONS);
  });
});

/* ═══════════════════════════════════════════════════════════════
   7. Query-Time Matching
   ═══════════════════════════════════════════════════════════════ */

describe('matchSurrogates', () => {
  it('returns high score for exact alias match', () => {
    const surrogates = makeSurrogates();
    const result = matchSurrogates('What is RRF?', surrogates);
    expect(result.score).toBeGreaterThan(0);
    expect(result.matchedSurrogates.some((m) => m.startsWith('alias:'))).toBe(true);
  });

  it('returns high score for question match', () => {
    const surrogates = makeSurrogates({
      surrogateQuestions: ['How do I configure search pipelines?'],
    });
    const result = matchSurrogates('configure search pipelines', surrogates);
    expect(result.score).toBeGreaterThan(0);
    expect(result.matchedSurrogates.some((m) => m.startsWith('question:'))).toBe(true);
  });

  it('returns positive score for summary keyword overlap', () => {
    const surrogates = makeSurrogates({
      summary: 'A comprehensive guide to vector embedding search techniques.',
    });
    const result = matchSurrogates('vector embedding search', surrogates);
    expect(result.score).toBeGreaterThan(0);
    expect(result.matchedSurrogates).toContain('summary');
  });

  it('returns positive score for heading match', () => {
    const surrogates = makeSurrogates({
      headings: ['Database Migration Strategy'],
    });
    const result = matchSurrogates('database migration', surrogates);
    expect(result.score).toBeGreaterThan(0);
    expect(result.matchedSurrogates.some((m) => m.startsWith('heading:'))).toBe(true);
  });

  it('returns zero score for completely unrelated query', () => {
    const surrogates = makeSurrogates({
      aliases: ['RRF'],
      headings: ['Fusion Algorithm'],
      summary: 'Combines ranked lists using reciprocal rank.',
      surrogateQuestions: ['What is Reciprocal Rank Fusion?'],
    });
    const result = matchSurrogates('chocolate cake recipe ingredients', surrogates);
    expect(result.score).toBe(0);
    expect(result.matchedSurrogates).toEqual([]);
  });

  it('normalizes score to [0, 1]', () => {
    const surrogates = makeSurrogates();
    const result = matchSurrogates('RRF Reciprocal Rank Fusion configuration usage', surrogates);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it('returns zero for empty query', () => {
    const surrogates = makeSurrogates();
    const result = matchSurrogates('', surrogates);
    expect(result.score).toBe(0);
    expect(result.matchedSurrogates).toEqual([]);
  });

  it('handles surrogates with empty fields', () => {
    const surrogates = makeSurrogates({
      aliases: [],
      headings: [],
      summary: '',
      surrogateQuestions: [],
    });
    const result = matchSurrogates('some query', surrogates);
    expect(result.score).toBe(0);
    expect(result.matchedSurrogates).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════
   8. Storage — Round-trip Write/Read
   ═══════════════════════════════════════════════════════════════ */

describe('Storage: storeSurrogates / loadSurrogates', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('stores and loads surrogates round-trip', () => {
    const surrogates = makeSurrogates();
    storeSurrogates(db, 42, surrogates);

    const loaded = loadSurrogates(db, 42);
    expect(loaded).not.toBeNull();
    expect(loaded!.aliases).toEqual(surrogates.aliases);
    expect(loaded!.headings).toEqual(surrogates.headings);
    expect(loaded!.summary).toBe(surrogates.summary);
    expect(loaded!.surrogateQuestions).toEqual(surrogates.surrogateQuestions);
    expect(loaded!.generatedAt).toBe(surrogates.generatedAt);
  });

  it('overwrites on re-store (INSERT OR REPLACE)', () => {
    const original = makeSurrogates({ summary: 'First version' });
    storeSurrogates(db, 1, original);

    const updated = makeSurrogates({ summary: 'Updated version' });
    storeSurrogates(db, 1, updated);

    const loaded = loadSurrogates(db, 1);
    expect(loaded).not.toBeNull();
    expect(loaded!.summary).toBe('Updated version');
  });

  it('returns null for non-existent memory ID', () => {
    const loaded = loadSurrogates(db, 999);
    expect(loaded).toBeNull();
  });

  it('skips store when flag is OFF', () => {
    disableFlag();
    const surrogates = makeSurrogates();
    storeSurrogates(db, 1, surrogates);

    // Re-enable to test load
    enableFlag();
    const loaded = loadSurrogates(db, 1);
    expect(loaded).toBeNull();
  });

  it('handles multiple memory IDs independently', () => {
    const s1 = makeSurrogates({ summary: 'Doc one' });
    const s2 = makeSurrogates({ summary: 'Doc two' });

    storeSurrogates(db, 1, s1);
    storeSurrogates(db, 2, s2);

    expect(loadSurrogates(db, 1)!.summary).toBe('Doc one');
    expect(loadSurrogates(db, 2)!.summary).toBe('Doc two');
  });
});

/* ═══════════════════════════════════════════════════════════════
   9. Storage — Batch Loading
   ═══════════════════════════════════════════════════════════════ */

describe('loadSurrogatesBatch', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('loads multiple surrogates in one call', () => {
    storeSurrogates(db, 1, makeSurrogates({ summary: 'First' }));
    storeSurrogates(db, 2, makeSurrogates({ summary: 'Second' }));
    storeSurrogates(db, 3, makeSurrogates({ summary: 'Third' }));

    const batch = loadSurrogatesBatch(db, [1, 2, 3]);
    expect(batch.size).toBe(3);
    expect(batch.get(1)!.summary).toBe('First');
    expect(batch.get(2)!.summary).toBe('Second');
    expect(batch.get(3)!.summary).toBe('Third');
  });

  it('returns partial results for missing IDs', () => {
    storeSurrogates(db, 1, makeSurrogates({ summary: 'Only one' }));

    const batch = loadSurrogatesBatch(db, [1, 2, 3]);
    expect(batch.size).toBe(1);
    expect(batch.has(1)).toBe(true);
    expect(batch.has(2)).toBe(false);
  });

  it('returns empty map for empty input', () => {
    const batch = loadSurrogatesBatch(db, []);
    expect(batch.size).toBe(0);
  });
});

/* ═══════════════════════════════════════════════════════════════
   10. Storage — Backward Compatibility
   ═══════════════════════════════════════════════════════════════ */

describe('Backward compatibility', () => {
  it('loadSurrogates returns null when table does not exist', () => {
    const db = new Database(':memory:');
    // Do NOT create memory_surrogates table
    const loaded = loadSurrogates(db, 1);
    expect(loaded).toBeNull();
  });

  it('loadSurrogatesBatch returns empty map when table does not exist', () => {
    const db = new Database(':memory:');
    const batch = loadSurrogatesBatch(db, [1, 2, 3]);
    expect(batch.size).toBe(0);
  });
});

/* ═══════════════════════════════════════════════════════════════
   11. Internal Helpers
   ═══════════════════════════════════════════════════════════════ */

describe('tokenize', () => {
  it('lowercases and splits text', () => {
    const tokens = tokenize('Hello World Test');
    expect(tokens).toEqual(['hello', 'world', 'test']);
  });

  it('strips punctuation', () => {
    const tokens = tokenize('Hello, world! How are you?');
    expect(tokens).toContain('hello');
    expect(tokens).toContain('world');
    expect(tokens).not.toContain(',');
  });

  it('filters short tokens', () => {
    const tokens = tokenize('I am a big test');
    expect(tokens).not.toContain('i');
    expect(tokens).not.toContain('a');
    expect(tokens).toContain('am');
    expect(tokens).toContain('big');
    expect(tokens).toContain('test');
  });

  it('returns empty array for empty string', () => {
    expect(tokenize('')).toEqual([]);
  });
});

describe('keywordOverlap', () => {
  it('returns 1.0 for perfect overlap', () => {
    const queryTokens = tokenize('hello world');
    expect(keywordOverlap(queryTokens, 'hello world')).toBe(1.0);
  });

  it('returns 0.5 for partial overlap', () => {
    const queryTokens = tokenize('hello world');
    expect(keywordOverlap(queryTokens, 'hello universe')).toBe(0.5);
  });

  it('returns 0 for no overlap', () => {
    const queryTokens = tokenize('hello world');
    expect(keywordOverlap(queryTokens, 'foo bar')).toBe(0);
  });

  it('returns 0 for empty query tokens', () => {
    expect(keywordOverlap([], 'hello world')).toBe(0);
  });

  it('returns 0 for empty target', () => {
    const queryTokens = tokenize('hello world');
    expect(keywordOverlap(queryTokens, '')).toBe(0);
  });
});

/* ═══════════════════════════════════════════════════════════════
   12. Edge Cases
   ═══════════════════════════════════════════════════════════════ */

describe('Edge cases', () => {
  it('handles very long document without errors', () => {
    const paragraphs: string[] = [];
    for (let i = 0; i < 100; i++) {
      paragraphs.push(`## Section ${i}\nThis is paragraph ${i} about topic ${i % 10} with unique term term${i}.`);
    }
    const content = paragraphs.join('\n\n');

    const result = generateSurrogates(content, 'Large Document');
    expect(result).not.toBeNull();
    expect(result!.headings.length).toBeGreaterThan(0);
    expect(result!.summary.length).toBeGreaterThan(0);
    expect(result!.summary.length).toBeLessThanOrEqual(MAX_SUMMARY_LENGTH);
  });

  it('handles document with no headings', () => {
    const content = 'Just plain text without any markdown headings or structure whatsoever.';
    const result = generateSurrogates(content, 'Plain Text');
    expect(result).not.toBeNull();
    expect(result!.headings).toEqual([]);
    expect(result!.surrogateQuestions.length).toBeGreaterThanOrEqual(MIN_SURROGATE_QUESTIONS);
  });

  it('handles Unicode content', () => {
    const content = `
## Konfiguration

Die Architektur des Systems definiert die Interaktion zwischen Komponenten.
El sistema utiliza Reciprocal Rank Fusion (RRF) para combinar resultados.
`;
    const result = generateSurrogates(content, 'Unicode Test');
    expect(result).not.toBeNull();
    expect(result!.aliases).toContain('RRF');
    expect(result!.headings).toContain('Konfiguration');
  });

  it('handles content with only YAML front-matter', () => {
    const content = '---\ntitle: Test\ndate: 2024-01-01\n---';
    const result = generateSurrogates(content, 'YAML Only');
    expect(result).not.toBeNull();
    // Summary might be empty or the raw content fallback
    expect(typeof result!.summary).toBe('string');
  });

  it('full round-trip: generate → store → load → match', () => {
    const content = `
# Search Pipeline Guide

The search pipeline uses Reciprocal Rank Fusion (RRF) to combine results.

## How to configure the pipeline

Set the k parameter and enable the appropriate feature flags.

## Performance tuning

Monitor query latency and adjust the candidate pool size.
`;
    const db = createTestDb();

    // Generate
    const surrogates = generateSurrogates(content, 'Search Pipeline Guide');
    expect(surrogates).not.toBeNull();

    // Store
    storeSurrogates(db, 100, surrogates!);

    // Load
    const loaded = loadSurrogates(db, 100);
    expect(loaded).not.toBeNull();

    // Match — should find relevance
    const matchResult = matchSurrogates('How do I configure RRF pipeline?', loaded!);
    expect(matchResult.score).toBeGreaterThan(0);
    expect(matchResult.matchedSurrogates.length).toBeGreaterThan(0);
  });

  it('initSurrogateTable is idempotent', () => {
    const db = new Database(':memory:');
    initSurrogateTable(db);
    initSurrogateTable(db); // Should not throw
    storeSurrogates(db, 1, makeSurrogates());
    expect(loadSurrogates(db, 1)).not.toBeNull();
  });
});

/* ═══════════════════════════════════════════════════════════════
   13. Feature Flag OFF — No Surrogates
   ═══════════════════════════════════════════════════════════════ */

describe('Feature flag OFF behavior', () => {
  beforeEach(() => {
    disableFlag();
  });

  afterEach(() => {
    enableFlag();
  });

  it('generateSurrogates returns null', () => {
    const result = generateSurrogates('Some content', 'Title');
    expect(result).toBeNull();
  });

  it('storeSurrogates is a no-op', () => {
    const db = createTestDb();
    const surrogates = makeSurrogates();
    storeSurrogates(db, 1, surrogates);

    // Re-enable flag to verify nothing was stored
    enableFlag();
    const loaded = loadSurrogates(db, 1);
    expect(loaded).toBeNull();
  });

  it('pure extraction functions still work (not gated)', () => {
    // These are lower-level functions that are not individually gated
    expect(extractAliases('Reciprocal Rank Fusion (RRF)')).toContain('RRF');
    expect(extractHeadings('## Heading')).toContain('Heading');
    expect(generateSummary('Some text content here.')).toBeTruthy();
  });
});
