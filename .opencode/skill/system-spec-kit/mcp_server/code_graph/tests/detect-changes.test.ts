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

describe('detect_changes handler — adversarial path containment (010/007/T-D R-007-3)', () => {
  beforeEach(() => {
    mocks.ensureCodeGraphReady.mockResolvedValue({
      freshness: 'fresh',
      action: 'none',
      inlineIndexPerformed: false,
      reason: 'ok',
    });
  });

  it('rejects diff path that escapes canonicalRootDir via ../../', async () => {
    const result = await handleDetectChanges({
      diff: '--- a/../../etc/passwd\n+++ b/../../etc/passwd\n@@ -1,1 +1,1 @@\n+pwned\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.affectedSymbols).toEqual([]);
    // blockedReason should name the offending escape; we don't pin the exact
    // string but it should reference path containment / canonical-root.
    expect(parsed.blockedReason).toMatch(/path|outside|canonical|root/i);
  });

  it('rejects absolute path that resolves outside the workspace', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/etc/passwd\n+++ b/etc/passwd\n@@ -1,1 +1,1 @@\n+pwned\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    // Either parse_error (if absolute paths get explicitly rejected) OR ok with
    // empty affectedSymbols (if the path is canonicalized and yields no
    // overlap). The core invariant: the response NEVER claims to have
    // affected `etc/passwd` or any path outside the workspace.
    if (parsed.status === 'ok') {
      expect(parsed.affectedSymbols).toEqual([]);
      // affectedFiles should be empty OR contain only workspace-relative paths
      for (const f of parsed.affectedFiles ?? []) {
        expect(f.startsWith('/etc') || f.includes('../')).toBe(false);
      }
    } else {
      expect(parsed.status).toBe('parse_error');
    }
  });

  it('accepts a legitimate workspace-relative path (negative control)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/src/legitimate.ts\n+++ b/src/legitimate.ts\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    // Empty outline → ok status with empty affected symbols (no parse_error
    // because the path is legitimately inside the workspace).
    expect(parsed.status).toBe('ok');
  });

  // 008/D1 P1 regression: mixed-header bypass.
  // resolveCandidatePath previously validated only the chosen path.
  // An adversarial diff with an escaping pre-image header paired with an
  // in-root post-image (or vice versa) could smuggle an out-of-root path
  // past containment because the unused side was never checked.
  it('rejects escaping oldPath paired with in-root newPath (D1 mixed-header)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/../../etc/passwd\n+++ b/src/safe.ts\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(parsed.blockedReason).toMatch(/outside workspace root/);
  });

  it('rejects in-root oldPath paired with escaping newPath (D1 mixed-header)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/src/safe.ts\n+++ b/../../etc/passwd\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.affectedSymbols).toEqual([]);
    expect(parsed.blockedReason).toMatch(/outside workspace root/);
  });

  it('accepts /dev/null paired with in-root path (pure add/delete is legitimate)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    // Pure-add: oldPath = /dev/null, newPath in-root.
    const addResult = await handleDetectChanges({
      diff: '--- /dev/null\n+++ b/src/new.ts\n@@ -0,0 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const addParsed = JSON.parse(addResult.content[0].text);
    expect(addParsed.status).toBe('ok');

    // Pure-delete: oldPath in-root, newPath = /dev/null.
    const delResult = await handleDetectChanges({
      diff: '--- a/src/gone.ts\n+++ /dev/null\n@@ -1,1 +0,0 @@\n-x\n',
      rootDir: workspaceRoot,
    });
    const delParsed = JSON.parse(delResult.content[0].text);
    expect(delParsed.status).toBe('ok');
  });

  // 008/D2 byte-safety contract: reject diff paths containing control
  // characters or exceeding the reasonable path-length cap.
  it('D2: rejects diff path containing NUL byte', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/src/safe hidden.ts\n+++ b/src/safe.ts\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.blockedReason).toMatch(/control characters|byte-safety/i);
  });

  it('D2: rejects diff path with C0 control character (BEL)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/src/normalbell.ts\n+++ b/src/normalbell.ts\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
  });

  it('D2: rejects diff path with DEL (\\x7F)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/src/delpath.ts\n+++ b/src/delpath.ts\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
  });

  it('D2: rejects diff path exceeding 4096-byte cap', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const longSegment = 'a'.repeat(5000);
    const result = await handleDetectChanges({
      diff: `--- a/${longSegment}.ts\n+++ b/${longSegment}.ts\n@@ -1,1 +1,1 @@\n+x\n`,
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('parse_error');
    expect(parsed.blockedReason).toMatch(/exceeds.*4096|byte-safety/i);
  });

  it('D2: accepts unicode path characters above the control band (negative control)', async () => {
    mocks.queryOutline.mockReturnValue([]);
    const result = await handleDetectChanges({
      diff: '--- a/src/中文/файл.ts\n+++ b/src/中文/файл.ts\n@@ -1,1 +1,1 @@\n+x\n',
      rootDir: workspaceRoot,
    });
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.status).toBe('ok');
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

  // 008/D6: rename / copy / binary header handling. Per the documented
  // contract, these headers are tolerated as preamble lines and the
  // resulting file entries have `hunks: []`. Pin that contract with
  // regression tests so a future "tighter" parser doesn't accidentally
  // break rename-only patches.
  it('D6: tolerates rename-only diffs (no hunks)', () => {
    const diff = [
      'diff --git a/old.ts b/new.ts',
      'similarity index 100%',
      'rename from old.ts',
      'rename to new.ts',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    // Rename-only with no `--- a/` / `+++ b/` headers does NOT
    // produce a file entry — the parser only attributes touched
    // files when `--- ` and `+++ ` headers are both present.
    if (r.status !== 'ok') return;
  });

  it('D6: tolerates rename + minor edit (file entry produced)', () => {
    const diff = [
      'diff --git a/old.ts b/new.ts',
      'similarity index 95%',
      'rename from old.ts',
      'rename to new.ts',
      '--- a/old.ts',
      '+++ b/new.ts',
      '@@ -1,1 +1,1 @@',
      '-x',
      '+y',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    expect(r.files).toHaveLength(1);
    expect(r.files[0]).toMatchObject({ oldPath: 'old.ts', newPath: 'new.ts' });
    expect(r.files[0].hunks).toHaveLength(1);
  });

  it('D6: tolerates "Binary files differ" with no hunks', () => {
    const diff = [
      'diff --git a/image.png b/image.png',
      'Binary files a/image.png and b/image.png differ',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    // No `--- a/` / `+++ b/` headers — no file entry produced.
    expect(r.files).toEqual([]);
  });

  it('D6: tolerates declared-greater-than-delivered hunk count (parser stays in ok status)', () => {
    // Declares 5 lines but only 2 arrive. The parser does not error
    // on this (graceful tolerance) but should NOT consume subsequent
    // structural lines as hunk-body. Verify by including a follow-up
    // section that the parser MUST recognize.
    const diff = [
      '--- a/a.ts',
      '+++ b/a.ts',
      '@@ -1,5 +1,5 @@',
      '-x',
      '+y',
      // body short-arrived (only 2 lines instead of 5+5); next file
      // header should still parse:
      '--- a/b.ts',
      '+++ b/b.ts',
      '@@ -1,1 +1,1 @@',
      '-old',
      '+new',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    // Both files attributed even though the first hunk was under-budget.
    expect(r.files.map((f) => f.newPath)).toEqual(['a.ts', 'b.ts']);
  });

  it('D6: tolerates declared-less-than-delivered hunk count (graceful termination)', () => {
    // Declares 1 line but 3 arrive. Out-of-budget '-' / '+' triggers
    // re-process; final lines either start a new file header or fall
    // to the catchall.
    const diff = [
      '--- a/a.ts',
      '+++ b/a.ts',
      '@@ -1,1 +1,1 @@',
      '-x',
      '+y',
      '+extra1',
      '+extra2',
      '--- a/b.ts',
      '+++ b/b.ts',
      '@@ -1,1 +1,1 @@',
      '-z',
      '+w',
      '',
    ].join('\n');
    const r = parseUnifiedDiff(diff);
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    // Second file's headers must NOT be eaten as hunk-body lines.
    expect(r.files.map((f) => f.newPath)).toEqual(['a.ts', 'b.ts']);
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
