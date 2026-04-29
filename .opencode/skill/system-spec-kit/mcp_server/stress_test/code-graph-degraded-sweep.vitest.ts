// ---------------------------------------------------------------
// TEST: Code Graph Degraded Stress Cell (packet 013)
// ---------------------------------------------------------------
// Integration-style sweep that complements (but does not replace)
// the mocked unit tests in `code-graph-query-fallback-decision.vitest.ts`.
//
// Purpose
// -------
// Packet 010 v1.0.2 stress run produced a NEUTRAL verdict for packet 005
// (code-graph fast-fail) because the Q1 cells did not exercise
// `fallbackDecision` end-to-end - the live graph was healthy after pre-flight
// recovery. Per `011-post-stress-followup-research/research/research.md` Section 4
// the recommended remediation is one deterministic integration sweep that:
//
//   1. Forces the graph into a degraded state without mutating the live DB.
//   2. Calls `handleCodeGraphQuery` end-to-end (NOT mocked).
//   3. Asserts `fallbackDecision.nextTool` matches the expected branch.
//
// The test uses the existing isolation seam: `initDb(tempDir)` swaps the
// code_graph DB singleton onto a tmpdir, leaving the live
// `code-graph.sqlite` byte-equal across the run.
//
// Three buckets:
//   A. Empty graph state           -> fallbackDecision.nextTool === 'code_graph_scan'
//   A'. Broad-stale (>50 stale)    -> fallbackDecision.nextTool === 'code_graph_scan'
//   B. Readiness exception (spy)   -> fallbackDecision.nextTool === 'rg'
//   C. Fresh state                 -> no fallbackDecision
//
// Constraints
// -----------
//   - Test-only. ZERO production code mutated.
//   - The live `code-graph.sqlite` is hashed before/after; the assertion
//     refuses to pass unless the bytes are identical.
//   - We do NOT trigger `code_graph_scan` from inside the test - the entire
//     point is exercising the degraded path WITHOUT recovery.
//
// References
// ----------
//   - research.md Section 4 "Q-P1 - code-graph fast-fail not testable"
//   - mcp_server/code_graph/handlers/query.ts:791-828 (buildFallbackDecision +
//     blocked payload)
//   - mcp_server/code_graph/lib/ensure-ready.ts:151-217 (full-scan state
//     detection)
//   - mcp_server/tests/code-graph-query-fallback-decision.vitest.ts
//     (mocked unit-test counterpart)

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve as resolvePath, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import * as codeGraphDb from '../code_graph/lib/code-graph-db.js';
import {
  closeDb,
  initDb,
  upsertFile,
  replaceNodes,
} from '../code_graph/lib/code-graph-db.js';
import { generateContentHash } from '../code_graph/lib/indexer-types.js';
import type { CodeNode } from '../code_graph/lib/indexer-types.js';
import { handleCodeGraphQuery } from '../code_graph/handlers/query.js';
import { SELECTIVE_REINDEX_THRESHOLD } from '../code_graph/lib/ensure-ready.js';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const LIVE_DB_PATH = resolvePath(
  TEST_DIR,
  '..',
  'database',
  'code-graph.sqlite',
);

interface QueryResultPayload {
  status: string;
  message?: string;
  data?: Record<string, unknown> & {
    fallbackDecision?: {
      nextTool: string;
      reason: string;
      retryAfter?: string;
    };
  };
}

function parseQueryResponse(
  result: { content: Array<{ type: string; text: string }> },
): QueryResultPayload {
  const text = result.content[0]?.text ?? '{}';
  return JSON.parse(text) as QueryResultPayload;
}

function hashFile(filePath: string): string | null {
  if (!existsSync(filePath)) return null;
  const buf = readFileSync(filePath);
  return createHash('sha256').update(buf).digest('hex');
}

function makeNode(filePath: string, name: string): CodeNode {
  return {
    symbolId: createHash('sha256')
      .update(filePath + '::' + name + '::function')
      .digest('hex')
      .slice(0, 16),
    filePath,
    fqName: name,
    kind: 'function',
    name,
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 10,
    language: 'typescript',
    signature: `function ${name}()`,
    contentHash: `hash-${name}`,
  };
}

// ---------------------------------------------------------------
// Suite
// ---------------------------------------------------------------

describe('code_graph_query degraded stress sweep (packet 013)', () => {
  // Capture the live DB hash BEFORE this suite runs anything.  We assert
  // byte-equality at the end so the live code-graph.sqlite is provably
  // untouched by the integration sweep.
  let liveDbHashBefore: string | null = null;
  const tempDirs: string[] = [];

  beforeAll(() => {
    liveDbHashBefore = hashFile(LIVE_DB_PATH);
  });

  afterAll(() => {
    // Live DB must be byte-equal - proves the test never mutated the
    // production graph DB during any bucket.
    const liveDbHashAfter = hashFile(LIVE_DB_PATH);
    expect(liveDbHashAfter).toBe(liveDbHashBefore);

    // Best-effort cleanup of any tmpdirs that escaped per-test teardown.
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir && existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  beforeEach(() => {
    // Always start each bucket from a clean DB singleton so the previous
    // bucket's tmp DB cannot leak into the next bucket.
    closeDb();
  });

  afterEach(() => {
    // Drop the per-test DB handle and remove the tmpdir.
    closeDb();
    // Restore process.cwd() if a test mocked it for readiness-cache isolation.
    vi.restoreAllMocks();
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir && existsSync(dir)) {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  /**
   * Pin `process.cwd()` to the per-test tmpdir so the module-level readiness
   * debounce cache in ensure-ready.ts keys differently for each bucket.
   * Without this, the second test in the suite hits a stale cache entry from
   * the first test and skips the degraded-state detection that we are
   * specifically trying to exercise.  Tmpdirs are also not git repos, so
   * `getCurrentGitHead(rootDir)` returns null and the headChanged branch in
   * detectState() stays inert.
   */
  function pinCwd(dir: string): void {
    vi.spyOn(process, 'cwd').mockReturnValue(dir);
  }

  // -------------------------------------------------------------
  // Bucket A - Empty graph routes to code_graph_scan
  // -------------------------------------------------------------
  it('routes empty-graph reads to code_graph_scan via fallbackDecision', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'cgq-degraded-empty-'));
    tempDirs.push(tempDir);
    pinCwd(tempDir);

    // Empty isolated DB: initDb creates the schema but inserts zero rows.
    initDb(tempDir);

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: 'src/example.ts',
    });
    const parsed = parseQueryResponse(result);

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
      retryAfter: 'scan_complete',
    });
    expect(parsed.data?.blocked).toBe(true);
    expect(parsed.data?.requiredAction).toBe('code_graph_scan');
  });

  // -------------------------------------------------------------
  // Bucket A' - Broad-stale (> SELECTIVE_REINDEX_THRESHOLD stale tracked files)
  // routes to code_graph_scan
  //
  // Per ensure-ready.ts: when stale.length > SELECTIVE_REINDEX_THRESHOLD,
  // `detectState` returns `action: 'full_scan'`, which the read-path
  // translates into the same fallbackDecision as the empty bucket
  // (allowInlineFullScan:false on the query handler keeps the boundary
  // intact - see query.ts:1090-1092).
  // -------------------------------------------------------------
  it('routes broad-stale graphs to code_graph_scan via fallbackDecision', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'cgq-degraded-broad-stale-'));
    tempDirs.push(tempDir);
    pinCwd(tempDir);

    initDb(tempDir);

    // Seed (threshold + 10) tracked files with stale mtimes so we are firmly
    // above the boundary. +10 leaves slack so a future small bump in the
    // production threshold (e.g., 50 -> 55) still trips the full-scan branch
    // without rewriting the test.
    const STALE_FILE_COUNT = SELECTIVE_REINDEX_THRESHOLD + 10;
    for (let i = 0; i < STALE_FILE_COUNT; i++) {
      const filePath = join(tempDir, `tracked-${i}.ts`);
      const content = `export const sample${i} = ${i};\n`;
      writeFileSync(filePath, content, 'utf8');
      // Backdate stat AFTER write so disk mtime differs from the stored
      // file_mtime_ms below.
      const past = new Date(Date.now() - 86_400_000); // 24h ago on disk
      utimesSync(filePath, past, past);

      // Insert a code_files row whose stored file_mtime_ms is "now" - but the
      // disk file's mtime is 24h ago, so ensureFreshFiles() will mark it stale.
      const storedMtime = Date.now();
      const fileId = upsertFile(
        filePath,
        'typescript',
        generateContentHash(content),
        1, // node_count > 0 so empty-graph guard does not fire
        0,
        'clean',
        1,
        { fileMtimeMs: storedMtime },
      );
      // Add at least one node so the empty-graph branch is bypassed; we want
      // the path to flow through ensureFreshFiles -> stale.length >
      // SELECTIVE_REINDEX_THRESHOLD.
      replaceNodes(fileId, [makeNode(filePath, `sample${i}`)]);
    }

    const result = await handleCodeGraphQuery({
      operation: 'calls_from',
      subject: join(tempDir, 'tracked-0.ts'),
    });
    const parsed = parseQueryResponse(result);

    expect(parsed.status).toBe('blocked');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'code_graph_scan',
      reason: 'full_scan_required',
      retryAfter: 'scan_complete',
    });
  });

  // -------------------------------------------------------------
  // Bucket B - Readiness exception routes to rg
  //
  // Strategy: spy on the exported `getDb` of code-graph-db and throw.
  // ensureCodeGraphReady() is called by the query handler and (via
  // detectState() at ensure-ready.ts:149) calls `getDb()` as its very first
  // operation.  When the spy throws, the handler's try/catch
  // (query.ts:1093-1121) emits the readiness-error fallback path.
  //
  // We chose the spy over a corrupt-SQLite-file approach for two reasons:
  //   (1) better-sqlite3 sometimes accepts partially-corrupt files and
  //       surfaces failures inside `db.exec(SCHEMA_SQL)`, which writes to the
  //       file before erroring - that risks tainting bytes if the singleton
  //       ever falls through to DATABASE_DIR.
  //   (2) the spy is byte-clean: nothing on disk changes, satisfying the
  //       afterAll() byte-equality guard for the live code-graph.sqlite.
  // -------------------------------------------------------------
  it('routes readiness exceptions to rg via fallbackDecision', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'cgq-degraded-readiness-error-'));
    tempDirs.push(tempDir);
    pinCwd(tempDir);

    // Initialize the singleton on our tmpdir BEFORE spying so any future
    // unmocked getDb call lands on the tmp DB - never the live DB.
    initDb(tempDir);

    const getDbSpy = vi
      .spyOn(codeGraphDb, 'getDb')
      .mockImplementation(() => {
        throw new Error('readiness probe failed: simulated db locked');
      });

    const result = await handleCodeGraphQuery({
      operation: 'outline',
      subject: 'src/example.ts',
    });
    const parsed = parseQueryResponse(result);

    // Restore so cleanup hooks can close the singleton normally.
    getDbSpy.mockRestore();

    expect(parsed.status).toBe('error');
    expect(parsed.data?.fallbackDecision).toEqual({
      nextTool: 'rg',
      reason: 'scan_failed',
    });
    expect(parsed.message).toMatch(/code_graph_not_ready/);
  });

  // -------------------------------------------------------------
  // Bucket C - Fresh state emits no fallbackDecision
  //
  // Seed a real on-disk file, record matching mtime + content hash in
  // code_files, and add at least one code_nodes row so detectState()
  // returns `action: 'none'`.  Use `operation: 'outline'` to take the
  // simpler outline branch and avoid CALLS-edge resolution.
  // -------------------------------------------------------------
  it('emits no fallbackDecision when the graph is fresh', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'cgq-degraded-fresh-'));
    tempDirs.push(tempDir);
    pinCwd(tempDir);

    initDb(tempDir);

    const filePath = join(tempDir, 'fresh.ts');
    const content = 'export function fresh() { return 42; }\n';
    writeFileSync(filePath, content, 'utf8');
    const realMtime = Math.trunc(statSync(filePath).mtimeMs);
    const realContentHash = generateContentHash(content);

    const fileId = upsertFile(
      filePath,
      'typescript',
      realContentHash,
      1, // node_count > 0 so empty-graph guard does not fire
      0,
      'clean',
      1,
      { fileMtimeMs: realMtime },
    );
    replaceNodes(fileId, [makeNode(filePath, 'fresh')]);

    const result = await handleCodeGraphQuery({
      operation: 'outline',
      subject: filePath,
    });
    const parsed = parseQueryResponse(result);

    expect(parsed.status).toBe('ok');
    // Fresh graph state must not advertise fallbackDecision.  (The handler
    // omits the field rather than emitting null when no fallback is required;
    // see query.ts:807 + buildGraphQueryPayload caller.)
    expect(parsed.data).toBeDefined();
    expect(parsed.data).not.toHaveProperty('fallbackDecision');
  });

  // -------------------------------------------------------------
  // Live DB protection - sanity check the byte-equality guard
  // -------------------------------------------------------------
  it('does not mutate the live code-graph.sqlite during the sweep', () => {
    // The afterAll hook performs the final byte-equal assertion; here we
    // sanity-check that the path we hash actually exists so a missing live
    // DB cannot silently turn the protection check into a no-op.
    expect(existsSync(LIVE_DB_PATH)).toBe(true);
    expect(liveDbHashBefore).not.toBeNull();
  });
});
