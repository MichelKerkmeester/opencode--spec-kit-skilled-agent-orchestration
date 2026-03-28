// TEST: Content Normalizer
// File: lib/parsing/content-normalizer.ts
import { describe, it, expect } from 'vitest';
import {
  normalizeContentForEmbedding,
  normalizeContentForBM25,
  stripYamlFrontmatter,
  stripAnchors,
  stripHtmlComments,
  stripCodeFences,
  normalizeMarkdownTables,
  normalizeMarkdownLists,
  normalizeHeadings,
} from '../lib/parsing/content-normalizer';

// StripYamlFrontmatter
describe('stripYamlFrontmatter', () => {
  it('S1-N-01: removes a standard YAML frontmatter block', () => {
    const input = '---\ntitle: test\nauthor: alice\n---\nBody text here.';
    const result = stripYamlFrontmatter(input);
    expect(result).not.toContain('title: test');
    expect(result).not.toContain('author: alice');
    expect(result).toContain('Body text here.');
  });

  it('S1-N-02: returns content unchanged when no frontmatter is present', () => {
    const input = 'Just plain content.\nNo frontmatter here.';
    expect(stripYamlFrontmatter(input)).toBe(input);
  });

  it('S1-N-03: returns empty string when given empty string', () => {
    expect(stripYamlFrontmatter('')).toBe('');
  });

  it('S1-N-04: only strips frontmatter when it starts at position 0', () => {
    // When the first line is NOT ---, no block is treated as frontmatter
    const input = 'Intro line.\n\nBody content.';
    const result = stripYamlFrontmatter(input);
    expect(result).toBe(input);
  });

  it('S1-N-05: handles frontmatter with no body following it', () => {
    const input = '---\ntitle: standalone\n---\n';
    const result = stripYamlFrontmatter(input);
    expect(result.trim()).toBe('');
  });

  it('S1-N-06: handles frontmatter containing nested colons and quoted values', () => {
    const input = '---\ntitle: "Key: Value"\ntags: [a, b, c]\n---\nContent.';
    const result = stripYamlFrontmatter(input);
    expect(result).not.toContain('tags:');
    expect(result).toContain('Content.');
  });
});

// StripAnchors
describe('stripAnchors', () => {
  it('S1-A-01: removes opening ANCHOR tags', () => {
    const input = '<!-- ANCHOR: state -->\nSome content.';
    expect(stripAnchors(input)).not.toContain('<!-- ANCHOR: state -->');
    expect(stripAnchors(input)).toContain('Some content.');
  });

  it('S1-A-02: removes closing /ANCHOR tags', () => {
    const input = '<!-- /ANCHOR: state -->\nMore content.';
    expect(stripAnchors(input)).not.toContain('<!-- /ANCHOR: state -->');
    expect(stripAnchors(input)).toContain('More content.');
  });

  it('S1-A-03: removes both opening and closing tags in a block', () => {
    const input = '<!-- ANCHOR:next-steps -->\nDo a thing.\n<!-- /ANCHOR:next-steps -->';
    const result = stripAnchors(input);
    expect(result).not.toContain('ANCHOR');
    expect(result).toContain('Do a thing.');
  });

  it('S1-A-04: handles ANCHOR without space after colon', () => {
    const input = '<!-- ANCHOR:no-space -->';
    expect(stripAnchors(input)).not.toContain('ANCHOR');
  });

  it('S1-A-05: is case-insensitive on ANCHOR keyword', () => {
    // The regex uses /gi — lowercase variants should also be stripped
    const input = '<!-- anchor: lower -->';
    expect(stripAnchors(input)).not.toContain('anchor');
  });

  it('S1-A-06: returns empty string for empty input', () => {
    expect(stripAnchors('')).toBe('');
  });

  it('S1-A-07: preserves non-anchor HTML comments', () => {
    // StripAnchors only targets ANCHOR tags; plain comments survive
    const input = '<!-- regular comment -->\n<!-- ANCHOR: foo -->';
    const result = stripAnchors(input);
    expect(result).toContain('<!-- regular comment -->');
    expect(result).not.toContain('ANCHOR');
  });
});

// StripHtmlComments
describe('stripHtmlComments', () => {
  it('S1-C-01: removes a simple inline HTML comment', () => {
    const input = 'Before <!-- comment --> after.';
    expect(stripHtmlComments(input)).not.toContain('comment');
    expect(stripHtmlComments(input)).toContain('Before');
    expect(stripHtmlComments(input)).toContain('after.');
  });

  it('S1-C-02: removes a multi-line HTML comment', () => {
    const input = '<!-- S1 gate: open\n  notes here\n-->End.';
    expect(stripHtmlComments(input)).not.toContain('S1 gate');
    expect(stripHtmlComments(input)).toContain('End.');
  });

  it('S1-C-03: removes multiple HTML comments in one string', () => {
    const input = '<!-- A -->Text<!-- B -->More<!-- C -->';
    const result = stripHtmlComments(input);
    expect(result).not.toContain('<!--');
    expect(result).toContain('Text');
    expect(result).toContain('More');
  });

  it('S1-C-04: also strips ANCHOR-style comments (they are HTML comments)', () => {
    const input = '<!-- ANCHOR: foo -->Body<!-- /ANCHOR: foo -->';
    expect(stripHtmlComments(input)).not.toContain('<!--');
    expect(stripHtmlComments(input)).toContain('Body');
  });

  it('S1-C-05: returns empty string for empty input', () => {
    expect(stripHtmlComments('')).toBe('');
  });

  it('S1-C-06: leaves non-comment content intact', () => {
    const input = '<div>Hello</div>';
    expect(stripHtmlComments(input)).toBe('<div>Hello</div>');
  });
});

// StripCodeFences
describe('stripCodeFences', () => {
  it('S1-F-01: removes opening and closing fence markers, keeps code body', () => {
    const input = '```ts\nconst x = 1;\n```';
    const result = stripCodeFences(input);
    expect(result).toContain('const x = 1;');
    expect(result).not.toContain('```');
  });

  it('S1-F-02: removes the language identifier on the opening fence', () => {
    const input = '```typescript\nlet y = 2;\n```';
    const result = stripCodeFences(input);
    expect(result).not.toContain('typescript');
    expect(result).toContain('let y = 2;');
  });

  it('S1-F-03: handles fences with no language identifier', () => {
    const input = '```\nraw code\n```';
    const result = stripCodeFences(input);
    expect(result).toContain('raw code');
    expect(result).not.toContain('```');
  });

  it('S1-F-04: handles multiple fence blocks in one document', () => {
    const input = 'Prose.\n```js\nfoo();\n```\nMore prose.\n```sh\necho hi\n```';
    const result = stripCodeFences(input);
    expect(result).toContain('foo();');
    expect(result).toContain('echo hi');
    expect(result).toContain('Prose.');
    expect(result).toContain('More prose.');
    expect(result).not.toContain('```');
  });

  it('S1-F-05: returns content unchanged when no fences are present', () => {
    const input = 'Plain prose only.';
    expect(stripCodeFences(input)).toBe(input);
  });

  it('S1-F-06: returns empty string for empty input', () => {
    expect(stripCodeFences('')).toBe('');
  });
});

// NormalizeMarkdownTables
describe('normalizeMarkdownTables', () => {
  it('S1-T-01: converts a pipe table header row to space-joined tokens', () => {
    const input = '| A | B | C |';
    const result = normalizeMarkdownTables(input);
    expect(result).toContain('A B C');
    expect(result).not.toContain('|');
  });

  it('S1-T-02: drops separator rows entirely', () => {
    const input = '| Header |\n|---|\n| Cell |';
    const result = normalizeMarkdownTables(input);
    expect(result).not.toContain('---');
    expect(result).toContain('Header');
    expect(result).toContain('Cell');
  });

  it('S1-T-03: handles a full three-column table', () => {
    const input = [
      '| Tool | Purpose | Status |',
      '| ---- | ------- | ------ |',
      '| Grep | search  | active |',
    ].join('\n');
    const result = normalizeMarkdownTables(input);
    expect(result).toContain('Tool Purpose Status');
    expect(result).toContain('Grep search active');
    expect(result).not.toContain('|');
    expect(result).not.toContain('----');
  });

  it('S1-T-04: leaves non-table lines unchanged', () => {
    const input = 'Intro.\n| A | B |\n| - | - |\n| 1 | 2 |\nOutro.';
    const result = normalizeMarkdownTables(input);
    expect(result).toContain('Intro.');
    expect(result).toContain('Outro.');
  });

  it('S1-T-05: returns empty string for empty input', () => {
    expect(normalizeMarkdownTables('')).toBe('');
  });

  it('S1-T-06: handles separator row with colons (alignment markers)', () => {
    const input = '| Left | Right |\n|:-----|------:|\n| a | b |';
    const result = normalizeMarkdownTables(input);
    expect(result).not.toContain(':');
    expect(result).toContain('Left Right');
    expect(result).toContain('a b');
  });
});

// NormalizeMarkdownLists
describe('normalizeMarkdownLists', () => {
  it('S1-L-01: strips unchecked task checkbox prefix', () => {
    const input = '- [ ] T001 Implement feature';
    expect(normalizeMarkdownLists(input)).toBe('[ ] T001 Implement feature');
  });

  it('S1-L-02: strips checked task checkbox prefix (lowercase x)', () => {
    const input = '- [x] Done item';
    expect(normalizeMarkdownLists(input)).toBe('[x] Done item');
  });

  it('S1-L-03: strips checked task checkbox prefix (uppercase X)', () => {
    const input = '- [X] Done item uppercase';
    expect(normalizeMarkdownLists(input)).toBe('[X] Done item uppercase');
  });

  it('S1-L-04: strips plain dash bullet prefix', () => {
    const input = '- plain item';
    expect(normalizeMarkdownLists(input)).toBe('plain item');
  });

  it('S1-L-05: strips plain asterisk bullet prefix', () => {
    const input = '* asterisk item';
    expect(normalizeMarkdownLists(input)).toBe('asterisk item');
  });

  it('S1-L-06: strips ordered list number prefix', () => {
    const input = '1. First item';
    expect(normalizeMarkdownLists(input)).toBe('First item');
  });

  it('S1-L-07: handles multi-line list', () => {
    const input = '- alpha\n- beta\n1. gamma\n* delta';
    const result = normalizeMarkdownLists(input);
    expect(result).toBe('alpha\nbeta\ngamma\ndelta');
  });

  it('S1-L-08: preserves leading indentation for nested list items', () => {
    const input = '- parent\n  - child\n    - grandchild';
    const result = normalizeMarkdownLists(input);
    expect(result).toContain('  child');
    expect(result).toContain('    grandchild');
  });

  it('S1-L-09: returns empty string for empty input', () => {
    expect(normalizeMarkdownLists('')).toBe('');
  });

  it('S1-L-10: does not strip content of non-list lines', () => {
    const input = 'Regular prose line.';
    expect(normalizeMarkdownLists(input)).toBe('Regular prose line.');
  });

  it('S1-L-11: preserves checklist state across mixed checked and unchecked items', () => {
    const input = '- [x] Done\n- [ ] Todo';
    expect(normalizeMarkdownLists(input)).toBe('[x] Done\n[ ] Todo');
  });
});

// NormalizeHeadings
describe('normalizeHeadings', () => {
  it('S1-H-01: strips h2 hashes and numeric section prefix', () => {
    expect(normalizeHeadings('## 3. SCOPE')).toBe('SCOPE');
  });

  it('S1-H-02: strips h1 hash', () => {
    expect(normalizeHeadings('# Introduction')).toBe('Introduction');
  });

  it('S1-H-03: strips h3 hashes', () => {
    expect(normalizeHeadings('### Sub-section')).toBe('Sub-section');
  });

  it('S1-H-04: strips h6 hashes', () => {
    expect(normalizeHeadings('###### Deep heading')).toBe('Deep heading');
  });

  it('S1-H-05: strips numeric prefix without section numbering', () => {
    expect(normalizeHeadings('## 1. OVERVIEW')).toBe('OVERVIEW');
  });

  it('S1-H-06: handles heading without numeric prefix', () => {
    expect(normalizeHeadings('## Context')).toBe('Context');
  });

  it('S1-H-07: handles multiple headings across lines', () => {
    const input = '# Title\n## 1. Section\n### Sub\nProse.';
    const result = normalizeHeadings(input);
    expect(result).toContain('Title');
    expect(result).toContain('Section');
    expect(result).toContain('Sub');
    expect(result).toContain('Prose.');
    expect(result).not.toContain('#');
  });

  it('S1-H-08: leaves non-heading lines unchanged', () => {
    const input = 'Not a heading.';
    expect(normalizeHeadings(input)).toBe('Not a heading.');
  });

  it('S1-H-09: returns empty string for empty input', () => {
    expect(normalizeHeadings('')).toBe('');
  });
});

// NormalizeContentForEmbedding — full pipeline
describe('normalizeContentForEmbedding', () => {
  it('S1-E-01: returns empty string for empty input', () => {
    expect(normalizeContentForEmbedding('')).toBe('');
  });

  it('S1-E-02: returns empty string for null-ish input', () => {
    // @ts-expect-error — testing runtime guard
    expect(normalizeContentForEmbedding(null)).toBe('');
    // @ts-expect-error — testing runtime guard
    expect(normalizeContentForEmbedding(undefined)).toBe('');
  });

  it('S1-E-03: strips frontmatter in the full pipeline', () => {
    const input = '---\ntitle: test\n---\nContent here.';
    expect(normalizeContentForEmbedding(input)).toContain('Content here.');
    expect(normalizeContentForEmbedding(input)).not.toContain('title:');
  });

  it('S1-E-04: strips ANCHOR markers in the full pipeline', () => {
    const input = '<!-- ANCHOR: state -->\nState content.\n<!-- /ANCHOR: state -->';
    const result = normalizeContentForEmbedding(input);
    expect(result).not.toContain('ANCHOR');
    expect(result).toContain('State content.');
  });

  it('S1-E-05: strips HTML comments in the full pipeline', () => {
    const input = '<!-- TODO: remove -->\nKeep this.';
    expect(normalizeContentForEmbedding(input)).not.toContain('TODO');
    expect(normalizeContentForEmbedding(input)).toContain('Keep this.');
  });

  it('S1-E-06: strips code fence markers but keeps code body', () => {
    const input = 'Prose.\n```ts\nconst n = 42;\n```\nMore.';
    const result = normalizeContentForEmbedding(input);
    expect(result).not.toContain('```');
    expect(result).toContain('const n = 42;');
    expect(result).toContain('Prose.');
  });

  it('S1-E-07: flattens pipe tables to prose', () => {
    const input = '| Col1 | Col2 |\n|------|------|\n| a | b |';
    const result = normalizeContentForEmbedding(input);
    expect(result).toContain('Col1 Col2');
    expect(result).toContain('a b');
    expect(result).not.toContain('|');
  });

  it('S1-E-08: strips list bullet notation', () => {
    const input = '- [ ] Task one\n- [x] Task two\n- Plain item';
    const result = normalizeContentForEmbedding(input);
    expect(result).toContain('Task one');
    expect(result).toContain('Task two');
    expect(result).toContain('Plain item');
    expect(result).not.toMatch(/^[-*]\s/m);
  });

  it('S1-E-09: strips heading hashes and numeric prefixes', () => {
    const input = '## 1. Overview\n### Details';
    const result = normalizeContentForEmbedding(input);
    expect(result).toContain('Overview');
    expect(result).toContain('Details');
    expect(result).not.toContain('#');
  });

  it('S1-E-10: collapses excess blank lines to a single blank line', () => {
    const input = 'Para one.\n\n\n\nPara two.';
    const result = normalizeContentForEmbedding(input);
    // Should have at most two consecutive newlines
    expect(result).not.toMatch(/\n{3,}/);
    expect(result).toContain('Para one.');
    expect(result).toContain('Para two.');
  });

  it('S1-E-11: trims leading and trailing whitespace from result', () => {
    const input = '\n\nSome content.\n\n';
    const result = normalizeContentForEmbedding(input);
    expect(result).toBe(result.trim());
  });

  it('S1-E-12: end-to-end pipeline with real memory-style markdown', () => {
    const input = [
      '---',
      'title: Authentication Flow Decision',
      'trigger_phrases: auth, login, oauth',
      'context_type: decision',
      '---',
      '',
      '<!-- ANCHOR: state -->',
      '## 1. CURRENT STATE',
      '',
      '<!-- TODO: update once OAuth is live -->',
      'The system uses JWT tokens for session management.',
      '',
      '<!-- /ANCHOR: state -->',
      '',
      '<!-- ANCHOR: decision -->',
      '## 2. DECISION',
      '',
      '- [x] Use refresh token rotation',
      '- [ ] Implement PKCE flow',
      '- Plain requirement item',
      '',
      '```ts',
      'function refreshToken(token: string): Promise<string> {',
      '  return fetch("/refresh", { method: "POST" });',
      '}',
      '```',
      '',
      '| Approach | Pros | Cons |',
      '| -------- | ---- | ---- |',
      '| JWT | stateless | no revoke |',
      '| Sessions | revocable | stateful |',
      '',
      '<!-- /ANCHOR: decision -->',
    ].join('\n');

    const result = normalizeContentForEmbedding(input);

    // Frontmatter removed
    expect(result).not.toContain('trigger_phrases');
    expect(result).not.toContain('context_type');

    // ANCHOR markers removed
    expect(result).not.toContain('ANCHOR');

    // HTML comments removed
    expect(result).not.toContain('TODO');

    // Headings normalized
    expect(result).toContain('CURRENT STATE');
    expect(result).toContain('DECISION');
    expect(result).not.toContain('##');

    // List notation stripped
    expect(result).toContain('Use refresh token rotation');
    expect(result).toContain('Implement PKCE flow');
    expect(result).toContain('Plain requirement item');
    expect(result).not.toMatch(/^[-*]\s/m);

    // Code body preserved, fence markers gone
    expect(result).toContain('refreshToken');
    expect(result).not.toContain('```');

    // Table flattened
    expect(result).toContain('Approach Pros Cons');
    expect(result).toContain('JWT stateless no revoke');
    expect(result).not.toContain('|');

    // No triple newlines
    expect(result).not.toMatch(/\n{3,}/);
  });

  it('S1-E-13: handles content that is only frontmatter', () => {
    const input = '---\ntitle: only-front\n---\n';
    const result = normalizeContentForEmbedding(input);
    expect(result).toBe('');
  });
});

// NormalizeContentForBM25
describe('normalizeContentForBM25', () => {
  it('S1-B-01: returns empty string for empty input', () => {
    expect(normalizeContentForBM25('')).toBe('');
  });

  it('S1-B-02: produces output for non-empty input', () => {
    const input = '# Title\nSome prose content.';
    const result = normalizeContentForBM25(input);
    expect(result.length).toBeGreaterThan(0);
  });

  it('S1-B-03: current implementation matches the embedding pipeline output', () => {
    // BM25 pipeline is explicitly identical to embedding at present (per source comments)
    const input = [
      '---\ntitle: BM25 test\n---',
      '## 1. SECTION',
      '- [ ] Task',
      '```sh\necho hello\n```',
    ].join('\n');
    expect(normalizeContentForBM25(input)).toBe(normalizeContentForEmbedding(input));
  });

  it('S1-B-04: strips YAML frontmatter', () => {
    const input = '---\ntitle: bm25\n---\nKeyword content.';
    expect(normalizeContentForBM25(input)).not.toContain('title:');
    expect(normalizeContentForBM25(input)).toContain('Keyword content.');
  });

  it('S1-B-05: keeps code body for identifier token search', () => {
    // Even though fence markers are stripped, code identifiers must survive
    const input = '```js\nfunction mySpecialFn() {}\n```';
    const result = normalizeContentForBM25(input);
    expect(result).toContain('mySpecialFn');
    expect(result).not.toContain('```');
  });

  it('S1-B-06: strips HTML comments', () => {
    const input = '<!-- prettier-ignore -->\nSearchable token.';
    expect(normalizeContentForBM25(input)).not.toContain('prettier-ignore');
    expect(normalizeContentForBM25(input)).toContain('Searchable token.');
  });
});

// Edge cases
describe('Edge cases', () => {
  it('S1-X-01: empty string through every primitive helper returns empty or unchanged', () => {
    expect(stripYamlFrontmatter('')).toBe('');
    expect(stripAnchors('')).toBe('');
    expect(stripHtmlComments('')).toBe('');
    expect(stripCodeFences('')).toBe('');
    expect(normalizeMarkdownTables('')).toBe('');
    expect(normalizeMarkdownLists('')).toBe('');
    expect(normalizeHeadings('')).toBe('');
  });

  it('S1-X-02: content with only frontmatter yields empty string after full pipeline', () => {
    const input = '---\ntitle: solo\nauthor: nobody\n---\n';
    expect(normalizeContentForEmbedding(input)).toBe('');
  });

  it('S1-X-03: deeply nested table (table inside list) does not crash', () => {
    const input = [
      '- Item with embedded table:',
      '  | K | V |',
      '  |---|---|',
      '  | a | 1 |',
    ].join('\n');
    // Must not throw; result should be a string
    const result = normalizeContentForEmbedding(input);
    expect(typeof result).toBe('string');
    expect(result).toContain('Item with embedded table');
  });

  it('S1-X-04: whitespace-only content yields empty string after full pipeline', () => {
    expect(normalizeContentForEmbedding('   \n\n  \n')).toBe('');
  });

  it('S1-X-05: pipeline is idempotent — running twice yields the same result', () => {
    const input = '## 1. HEADING\n- [ ] Task\n```ts\nconst x = 1;\n```';
    const once = normalizeContentForEmbedding(input);
    const twice = normalizeContentForEmbedding(once);
    expect(twice).toBe(once);
  });

  it('S1-X-06: string with only HTML comments yields empty string after full pipeline', () => {
    const input = '<!-- A -->\n<!-- B -->\n<!-- C -->';
    expect(normalizeContentForEmbedding(input)).toBe('');
  });

  it('S1-X-07: table with a single column normalizes correctly', () => {
    const input = '| Only |\n|------|\n| Row1 |\n| Row2 |';
    const result = normalizeMarkdownTables(input);
    expect(result).toContain('Only');
    expect(result).toContain('Row1');
    expect(result).toContain('Row2');
    expect(result).not.toContain('|');
  });
});
