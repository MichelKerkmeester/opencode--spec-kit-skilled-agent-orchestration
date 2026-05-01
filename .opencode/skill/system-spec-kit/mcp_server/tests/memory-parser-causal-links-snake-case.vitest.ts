// ───────────────────────────────────────────────────────────────
// MODULE: memory-parser snake_case causal_links tests
// ───────────────────────────────────────────────────────────────
// F-008-B3-01: extractCausalLinks now matches both `causalLinks:` and
// `causal_links:` block headers. Behavior is identical for callers
// using camelCase; snake_case fixtures used elsewhere in the parser
// ecosystem now produce the same output.

import { describe, expect, it } from 'vitest';

import { extractCausalLinks } from '../lib/parsing/memory-parser.js';

const SNAKE_CASE_CONTENT = `
# Memory File

Some preamble.

causal_links:
  caused_by:
    - "memory-1"
    - "memory-2"
  supersedes:
    - "memory-3"
  derived_from: []
  blocks:
    - "memory-4"
  related_to:
    - "memory-5"

More content.
`;

const CAMEL_CASE_CONTENT = `
# Memory File

Some preamble.

causalLinks:
  caused_by:
    - "memory-1"
    - "memory-2"
  supersedes:
    - "memory-3"
  derived_from: []
  blocks:
    - "memory-4"
  related_to:
    - "memory-5"

More content.
`;

describe('extractCausalLinks snake_case parity (F-008-B3-01)', () => {
  it('extracts causal_links: block (snake_case)', () => {
    const result = extractCausalLinks(SNAKE_CASE_CONTENT);
    expect(result.caused_by).toEqual(['memory-1', 'memory-2']);
    expect(result.supersedes).toEqual(['memory-3']);
    expect(result.derived_from).toEqual([]);
    expect(result.blocks).toEqual(['memory-4']);
    expect(result.related_to).toEqual(['memory-5']);
  });

  it('extracts causalLinks: block (camelCase) — unchanged behavior', () => {
    const result = extractCausalLinks(CAMEL_CASE_CONTENT);
    expect(result.caused_by).toEqual(['memory-1', 'memory-2']);
    expect(result.supersedes).toEqual(['memory-3']);
    expect(result.blocks).toEqual(['memory-4']);
    expect(result.related_to).toEqual(['memory-5']);
  });

  it('returns identical structure for both casings', () => {
    const snake = extractCausalLinks(SNAKE_CASE_CONTENT);
    const camel = extractCausalLinks(CAMEL_CASE_CONTENT);
    expect(snake).toEqual(camel);
  });

  it('returns empty causal links when neither token is present', () => {
    const result = extractCausalLinks('# Just a memory file with no links\n');
    expect(result.caused_by).toEqual([]);
    expect(result.supersedes).toEqual([]);
  });

  it('handles inline array syntax with snake_case', () => {
    const inline = `
causal_links:
  caused_by: ["memory-1", "memory-2"]
  supersedes: ["memory-3"]
`;
    const result = extractCausalLinks(inline);
    expect(result.caused_by).toEqual(['memory-1', 'memory-2']);
    expect(result.supersedes).toEqual(['memory-3']);
  });
});
