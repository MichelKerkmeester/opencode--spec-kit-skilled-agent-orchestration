// ───────────────────────────────────────────────────────────────
// MODULE: detect_changes Handler Tests (012/002)
// ───────────────────────────────────────────────────────────────
// Covers:
//   - P1 safety invariant (RISK-03 / R-002-4): status='blocked' on
//     stale/empty/error readiness, NEVER empty `affectedSymbols`.
//   - Output contract shape (R-002-5).
//   - parse_error on malformed diff (R-002-6).
//   - Symbol attribution via line-range overlap on a fresh graph.
//   - Diff parser unit cases.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resolve } from 'node:path';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import {
  parseUnifiedDiff,
  rangesOverlap,
} from '../lib/diff-parser.js';

const mocks = vi.hoisted(() => ({
  ensureCodeGraphReady: vi.fn(),
  queryOutline: vi.fn(),
  resolveSubjectFilePath: vi.fn(),
}));

vi.mock('../lib/code-graph-db.js', () => ({
  queryOutline: mocks.queryOutline,
  resolveSubjectFilePath: mocks.resolveSubjectFilePath,
}));

vi.mock('../lib/ensure-ready.js', () => ({
  ensureCodeGraphReady: mocks.ensureCodeGraphReady,
}));

import { handleDetectChanges } from '../handlers/detect-changes.js';

let workspaceRoot: string;
let originalCwd: string;

beforeEach(() => {
  vi.clearAllMocks();
  // Realpath because the handler canonicalizes both rootDir and cwd
  // before comparing them; macOS tmpdirs symlink through /var → /private/var.
  workspaceRoot = realpathSync(mkdtempSync(resolve(tmpdir(), 'detect-changes-')));
  originalCwd = process.cwd();
  process.chdir(workspaceRoot);
  mocks.resolveSubjectFilePath.mockImplementation((s: string) => s);
});

afterEach(() => {
  process.chdir(originalCwd);
  rmSync(workspaceRoot, { recursive: true, force: true });
});

describe('detect_changes handler — P1 safety invariant', () => {
  it('returns status="blocked" on stale graph (NEVER empty affectedSymbols)', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'stale',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'tracked files have newer mtime than indexed_at',
    });

    const result = await handleDetectChanges({
      diff: 'diff --git a/x.ts b/x.ts\n--- a/x.ts\n+++ b/x.ts\n@@ -1,1 +1,1 @@\n-old\n+new\n',
      rootDir: workspaceRoot,
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('blocked');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(parsed.blockedReason).toMatch(/stale/);
    expect(parsed.readiness.freshness).toBe('stale');
    expect(parsed.timestamp).toMatch(/\d{4}-\d{2}-\d{2}T/);

    // R-002-4: NEVER queryOutline against a stale graph
    expect(mocks.queryOutline).not.toHaveBeenCalled();
  });

  it('returns status="blocked" on empty graph (NEVER empty affectedSymbols)', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'empty',
      action: 'full_scan',
      inlineIndexPerformed: false,
      reason: 'graph is empty (0 nodes)',
    });

    const result = await handleDetectChanges({
      diff: 'diff --git a/x.ts b/x.ts\n--- a/x.ts\n+++ b/x.ts\n@@ -1 +1 @@\n-old\n+new\n',
      rootDir: workspaceRoot,
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('blocked');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(mocks.queryOutline).not.toHaveBeenCalled();
  });

  it('returns status="blocked" when readiness probe crashed (error freshness)', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'error',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'readiness_check_crashed',
    });

    const result = await handleDetectChanges({
      diff: 'diff --git a/x.ts b/x.ts\n--- a/x.ts\n+++ b/x.ts\n@@ -1 +1 @@\n-old\n+new\n',
      rootDir: workspaceRoot,
    });

    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('blocked');
    expect(parsed.affectedSymbols).toEqual([]);
  });

  it('passes allowInlineIndex:false so the read-only path never silently scans', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    });

    await handleDetectChanges({ diff: '', rootDir: workspaceRoot });

    expect(mocks.ensureCodeGraphReady).toHaveBeenCalledWith(
      workspaceRoot,
      { allowInlineIndex: false, allowInlineFullScan: false },
    );
  });
});

describe('detect_changes handler — parse_error contract (R-002-6)', () => {
  beforeEach(() => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    });
  });

  it('rejects non-string diff with status="parse_error"', async () => {
    const result = await handleDetectChanges({
      diff: undefined as unknown as string,
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.affectedSymbols).toEqual([]);
  });

  it('returns parse_error on a malformed @@ header', async () => {
    const result = await handleDetectChanges({
      diff: '--- a/x.ts\n+++ b/x.ts\n@@ NOT-A-HEADER @@\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.blockedReason).toMatch(/malformed hunk header/);
  });

  it('returns parse_error if a hunk appears before any file header', async () => {
    const result = await handleDetectChanges({
      diff: '@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
  });
});

describe('detect_changes handler — affected-symbol attribution', () => {
  beforeEach(() => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    });
  });

  it('attributes hunks to symbols whose line range overlaps', async () => {
    const filePath = resolve(workspaceRoot, 'src/foo.ts');
    mocks.resolveSubjectFilePath.mockReturnValue(filePath);
    mocks.queryOutline.mockReturnValue([
      { symbolId: 'mod-foo', filePath, fqName: 'foo', name: 'foo', kind: 'module', startLine: 1, endLine: 30 },
      { symbolId: 'fn-a',   filePath, fqName: 'a',   name: 'a',   kind: 'function', startLine: 5,  endLine: 10 },
      { symbolId: 'fn-b',   filePath, fqName: 'b',   name: 'b',   kind: 'function', startLine: 15, endLine: 20 },
      { symbolId: 'fn-c',   filePath, fqName: 'c',   name: 'c',   kind: 'function', startLine: 25, endLine: 30 },
    ]);

    const diff = [
      'diff --git a/src/foo.ts b/src/foo.ts',
      '--- a/src/foo.ts',
      '+++ b/src/foo.ts',
      '@@ -7,2 +7,3 @@',
      ' context',
      '-old',
      '+new',
      '+extra',
      '',
    ].join('\n');

    const result = await handleDetectChanges({ diff, rootDir: workspaceRoot });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed.status).toBe('ok');
    const ids = parsed.affectedSymbols.map((s: { symbolId: string }) => s.symbolId);
    expect(ids).toContain('fn-a');
    expect(ids).not.toContain('fn-b');
    expect(ids).not.toContain('fn-c');
    // Synthetic 'module' nodes are deliberately excluded so file-
    // wide module rows don't drown the per-symbol signal.
    expect(ids).not.toContain('mod-foo');

    expect(parsed.affectedFiles).toEqual([filePath]);
    expect(parsed.readiness.freshness).toBe('fresh');
  });

  it('returns ok with empty affectedSymbols when diff touches an unindexed file (graph is fresh)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    mocks.resolveSubjectFilePath.mockImplementation((s: string) => s);

    const result = await handleDetectChanges({
      diff: 'diff --git a/new.ts b/new.ts\n--- a/new.ts\n+++ b/new.ts\n@@ -1 +1 @@\n-x\n+y\n',
      rootDir: workspaceRoot,
    });

    const parsed = JSON.parse(result.content[0].text);
    // Status MUST stay 'ok' here — the graph IS fresh; the file just
    // has no rows. R-002-4 only forbids empty results on stale state.
    expect(parsed.status).toBe('ok');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(parsed.affectedFiles.length).toBe(1);
  });

  it('returns ok with empty affectedSymbols on an empty diff', async () => {
    const result = await handleDetectChanges({ diff: '', rootDir: workspaceRoot });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(parsed.affectedFiles).toEqual([]);
  });
});

describe('detect_changes output contract shape (R-002-5)', () => {
  it('always carries { status, affectedSymbols[], affectedFiles[], timestamp, readiness }', async () => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    });

    const result = await handleDetectChanges({ diff: '', rootDir: workspaceRoot });
    const parsed = JSON.parse(result.content[0].text);

    expect(parsed).toMatchObject({
      status: expect.any(String),
      affectedSymbols: expect.any(Array),
      affectedFiles: expect.any(Array),
      timestamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}T/),
      readiness: expect.objectContaining({
        freshness: expect.any(String),
        canonicalReadiness: expect.any(String),
        trustState: expect.any(String),
      }),
    });
  });
});

// ───────────────────────────────────────────────────────────────
// Diff parser unit tests (R-002-6 standard unified diff coverage)
// ───────────────────────────────────────────────────────────────

describe('parseUnifiedDiff', () => {
  it('parses a minimal git-style diff', () => {
    const diff = [
      'diff --git a/x.ts b/x.ts',
      'index 1111111..2222222 100644',
      '--- a/x.ts',
      '+++ b/x.ts',
      '@@ -1,3 +1,3 @@',
      ' line1',
      '-line2',
      '+line2-modified',
      ' line3',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    expect(r.files).toHaveLength(1);
    expect(r.files[0].oldPath).toBe('x.ts');
    expect(r.files[0].newPath).toBe('x.ts');
    expect(r.files[0].hunks).toEqual([{ oldStart: 1, oldLines: 3, newStart: 1, newLines: 3 }]);
  });

  it('handles multi-file diffs', () => {
    const diff = [
      '--- a/foo.ts',
      '+++ b/foo.ts',
      '@@ -10,1 +10,2 @@',
      ' ctx',
      '+added',
      '--- a/bar.ts',
      '+++ b/bar.ts',
      '@@ -1,1 +1,1 @@',
      '-x',
      '+y',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    expect(r.files.map(f => f.newPath)).toEqual(['foo.ts', 'bar.ts']);
  });

  it('treats omitted ,N as the default count of 1', () => {
    const diff = '--- a/f.ts\n+++ b/f.ts\n@@ -42 +42 @@\n-x\n+y\n';
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    expect(r.files[0].hunks[0]).toEqual({ oldStart: 42, oldLines: 1, newStart: 42, newLines: 1 });
  });

  it('returns parse_error on malformed @@ header', () => {
    const r = parseUnifiedDiff('--- a/f.ts\n+++ b/f.ts\n@@ garbage @@\n');
    expect(r.status).toBe('parse_error');
  });

  it('returns parse_error when +++ appears before ---', () => {
    const r = parseUnifiedDiff('+++ b/f.ts\n');
    expect(r.status).toBe('parse_error');
  });

  it('returns ok with no files on empty input', () => {
    const r = parseUnifiedDiff('');
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    expect(r.files).toEqual([]);
  });
});

describe('rangesOverlap', () => {
  it('detects overlap on shared line', () => {
    expect(rangesOverlap(1, 5, 5, 1)).toBe(true);
  });
  it('returns false for disjoint ranges', () => {
    expect(rangesOverlap(1, 4, 10, 2)).toBe(false);
  });
  it('handles zero-length hunks (pure-add) as point-in-range', () => {
    expect(rangesOverlap(5, 0, 1, 10)).toBe(true);
    expect(rangesOverlap(50, 0, 1, 10)).toBe(false);
  });
});
