// ───────────────────────────────────────────────────────────────
// TEST SUITE: evidence-marker-audit
// ───────────────────────────────────────────────────────────────
// Bracket-depth parser for `[EVIDENCE:...]` markers. Tests cover:
//   - Simple OK markers
//   - Paren-in-content false-positive avoidance (closed with `]`)
//   - Malformed markers (closed with `)`)
//   - Backtick-span skip
//   - Fenced code block skip
//   - Nested brackets in content
//   - Multi-line unclosed markers (reported as MALFORMED or UNCLOSED)
//   - Rewrap safety (only terminating `)` is rewritten, content parens preserved)

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  auditFile,
  auditFolder,
  parseMarkers,
  type Marker,
} from '../validation/evidence-marker-audit';

const tempRoots = new Set<string>();

function makeTempDir(prefix: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(dir);
  return dir;
}

function writeFile(dir: string, name: string, content: string): string {
  const full = path.join(dir, name);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  return full;
}

afterEach(() => {
  for (const dir of tempRoots) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempRoots.clear();
});

/* ───────────────────────────────────────────────────────────────
   1. PARSER: SIMPLE CASES
------------------------------------------------------------------*/

describe('parseMarkers: simple cases', () => {
  it('classifies a simple closed marker as OK', () => {
    const content = '- [x] item — [EVIDENCE: simple text]\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('ok');
    expect(markers[0].contentHasParens).toBe(false);
    expect(markers[0].raw).toBe('[EVIDENCE: simple text]');
  });

  it('classifies a marker with parens in content closed with `]` as OK', () => {
    const content = '- [x] item — [EVIDENCE: see foo.ts:bar (baz pattern) for details]\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('ok');
    expect(markers[0].contentHasParens).toBe(true);
  });

  it('classifies a marker closed with `)` as malformed', () => {
    const content = '- [x] item — [EVIDENCE: see foo.ts:bar for details)\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('malformed');
    // closerOffset must point to the `)` character, not past it.
    expect(markers[0].closerOffset).toBeDefined();
    const offset = markers[0].closerOffset!;
    expect(content[offset]).toBe(')');
  });

  it('classifies the classic 016 pattern `[EVIDENCE: hash — description)` as malformed', () => {
    const content =
      '- [x] CHK [P0] X — verified by `y` [EVIDENCE: 6f5623a4c P0-A composite — HookState Zod schema validation)\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('malformed');
  });

  it('classifies a trailing `(verified)]` as OK false-positive-safe', () => {
    const content =
      '- [x] CHK [P0] X — [EVIDENCE: inspection of `foo.md`; (verified)]\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('ok');
    expect(markers[0].contentHasParens).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   2. PARSER: CODE CONTEXTS
------------------------------------------------------------------*/

describe('parseMarkers: code contexts', () => {
  it('skips markers inside inline backtick spans', () => {
    const content = 'Use the syntax `[EVIDENCE: inside backtick]` for references.\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(0);
  });

  it('skips markers inside fenced code blocks', () => {
    const content = [
      'Example:',
      '```',
      '[EVIDENCE: in code block with (parens)]',
      '[EVIDENCE: another one)',
      '```',
      'End example.',
      '',
    ].join('\n');
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(0);
  });

  it('still captures markers OUTSIDE a fenced block on the same file', () => {
    const content = [
      '- [x] real marker — [EVIDENCE: hash one]',
      '',
      '```',
      '[EVIDENCE: example in code)',
      '```',
      '',
      '- [x] another real marker — [EVIDENCE: hash two)',
      '',
    ].join('\n');
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(2);
    expect(markers[0].status).toBe('ok');
    expect(markers[1].status).toBe('malformed');
  });

  it('handles backtick spans that close at end-of-line', () => {
    // Unclosed inline backtick spans are implicitly closed at newline per CommonMark;
    // the parser must not get stuck in backtick state forever.
    const content = 'Some text `not-closed\nNext line [EVIDENCE: real marker]\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('ok');
  });
});

/* ───────────────────────────────────────────────────────────────
   3. PARSER: NESTED + MULTI-MARKER
------------------------------------------------------------------*/

describe('parseMarkers: nested and multi-marker', () => {
  it('handles nested `[brackets]` in marker content', () => {
    const content =
      '- [x] CHK — [EVIDENCE: see [ref1] and [ref2] for details]\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('ok');
  });

  it('handles multiple markers on the same line', () => {
    const content =
      '- [x] X — [EVIDENCE: a] and [EVIDENCE: b (with parens))\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(2);
    expect(markers[0].status).toBe('ok');
    expect(markers[1].status).toBe('malformed');
  });

  it('treats paren-in-content with trailing `)` closer as malformed, not OK', () => {
    // This is the adversarial case: content has legitimate parens AND the line ends in `)`.
    // The parser must NOT be fooled — if depth never reaches 0, it's malformed.
    const content =
      '- [x] X — [EVIDENCE: see (foo) and (bar) trailing close)\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('malformed');
    expect(markers[0].contentHasParens).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. PARSER: MULTI-LINE + UNCLOSED
------------------------------------------------------------------*/

describe('parseMarkers: multi-line', () => {
  it('marks a marker that crosses newline without closing as malformed when last char is `)`', () => {
    const content = '- [x] — [EVIDENCE: this trails off)\nNext line unrelated.\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('malformed');
  });

  it('marks a marker that trails off with no closer as unclosed', () => {
    const content = '- [x] — [EVIDENCE: this has no closer at all\nNext line.\n';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('unclosed');
    expect(markers[0].closerOffset).toBeUndefined();
  });

  it('handles EOF while inside marker', () => {
    const content = '- [x] — [EVIDENCE: truncated)';
    const markers = parseMarkers(content, '/tmp/test.md');
    expect(markers).toHaveLength(1);
    expect(markers[0].status).toBe('malformed');
  });
});

/* ───────────────────────────────────────────────────────────────
   5. FILE AUDIT + REWRAP
------------------------------------------------------------------*/

describe('auditFile + auditFolder rewrap', () => {
  it('rewraps only the malformed `)` closers, preserves content parens', async () => {
    const dir = makeTempDir('evidence-audit-');
    const content = [
      '- [x] A — [EVIDENCE: good marker with (parens) closed OK]',
      '- [x] B — [EVIDENCE: malformed marker)',
      '- [x] C — [EVIDENCE: another malformed with (content parens))',
      '- [x] D — [EVIDENCE: also good (verified)]',
      '',
    ].join('\n');
    writeFile(dir, 'checklist.md', content);

    // First pass: report only.
    const before = await auditFolder(dir, { rewrap: false });
    expect(before.totalMarkers).toBe(4);
    expect(before.ok).toBe(2);
    expect(before.malformed).toBe(2);
    expect(before.unclosed).toBe(0);
    expect(before.rewrapped).toBe(0);

    // Second pass: rewrap.
    const after = await auditFolder(dir, { rewrap: true });
    expect(after.rewrapped).toBe(2);

    // Re-audit in report mode to confirm all markers are now OK.
    const reaudit = await auditFolder(dir, { rewrap: false });
    expect(reaudit.malformed).toBe(0);
    expect(reaudit.ok).toBe(4);

    // Confirm content-paren `(parens)` in line A and `(content parens)` in line C survived
    // the rewrap — only the terminating closer changed.
    const mutated = fs.readFileSync(path.join(dir, 'checklist.md'), 'utf8');
    expect(mutated).toContain('with (parens) closed OK]');
    expect(mutated).toContain('another malformed with (content parens)]');
    expect(mutated).not.toContain('(content parens))');
  });

  it('does not rewrap `unclosed` markers (manual review required)', async () => {
    const dir = makeTempDir('evidence-audit-unclosed-');
    const content = '- [x] — [EVIDENCE: this never closes at all\nnext line\n';
    writeFile(dir, 'doc.md', content);

    const result = await auditFolder(dir, { rewrap: true });
    expect(result.unclosed).toBe(1);
    expect(result.rewrapped).toBe(0);

    // File should be byte-identical.
    const after = fs.readFileSync(path.join(dir, 'doc.md'), 'utf8');
    expect(after).toBe(content);
  });

  it('scans nested subfolders and collects all markers', async () => {
    const dir = makeTempDir('evidence-audit-nested-');
    writeFile(dir, 'root.md', '[EVIDENCE: a)\n');
    writeFile(dir, 'sub/child.md', '[EVIDENCE: b)\n');
    writeFile(dir, 'sub/sub/grand.md', '[EVIDENCE: c]\n');

    const result = await auditFolder(dir, { rewrap: false });
    expect(result.filesScanned).toBe(3);
    expect(result.totalMarkers).toBe(3);
    expect(result.malformed).toBe(2);
    expect(result.ok).toBe(1);
  });

  it('auditFile returns per-file marker list', async () => {
    const dir = makeTempDir('evidence-audit-file-');
    const file = writeFile(dir, 'x.md', '[EVIDENCE: one]\n[EVIDENCE: two)\n');
    const markers: Marker[] = await auditFile(file);
    expect(markers).toHaveLength(2);
    expect(markers[0].status).toBe('ok');
    expect(markers[1].status).toBe('malformed');
  });
});
