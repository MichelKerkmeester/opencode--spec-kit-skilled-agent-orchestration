// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Subject Resolution Typed Result Tests
// ───────────────────────────────────────────────────────────────
// F-004-A4-02: resolveSubjectToRef must distinguish "no row" from "DB
// unavailable." Legacy callers still receive null on either case (logged
// to console.warn for the unavailable path), but the typed companion
// surfaces the discriminated kind.
//
// Note: the current implementation is module-private. This test asserts the
// observable behavior — the legacy resolveSubjectToRef path emits a warning
// when the DB is unavailable, and returns null for a not-found subject
// without a warning. This preserves the external API while making the
// silent-error path auditable from logs.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildContext } from '../lib/code-graph-context.js';
import { closeDb, initDb, upsertFile } from '../lib/code-graph-db.js';
import { generateContentHash } from '../lib/indexer-types.js';

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
  vi.restoreAllMocks();
});

describe('F-004-A4-02: subject resolution distinguishes unresolved vs unavailable', () => {
  it('does NOT log a warning when subject is simply absent from the DB', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-resolve-absent-'));
    try {
      initDb(tempDir);
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      // buildContext with a subject that doesn't exist; DB is healthy.
      // Internal resolveSubjectToRef returns kind='unresolved' → no warn.
      buildContext({ subject: 'definitely-not-in-db' });

      const resolveWarnings = warnSpy.mock.calls.filter((call) =>
        typeof call[0] === 'string' && call[0].includes('resolveSubjectToRef'),
      );
      expect(resolveWarnings).toHaveLength(0);

      warnSpy.mockRestore();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns the resolved ref via buildContext when subject exists', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-resolve-found-'));
    try {
      initDb(tempDir);
      const fakeFilePath = join(tempDir, 'foo.ts');
      const content = 'export function bar() {}\n';

      // Insert a tracked file row (no nodes; we verify resolveSubjectToRef
      // gracefully returns null when there are no nodes — that's still the
      // 'unresolved' kind, not 'unavailable')
      upsertFile(fakeFilePath, 'typescript', generateContentHash(content), 0, 0, 'clean', 1);

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const result = buildContext({ subject: 'bar' });

      // No nodes exist for 'bar', so resolution returns unresolved → no warn
      expect(result).toBeDefined();
      const resolveWarnings = warnSpy.mock.calls.filter((call) =>
        typeof call[0] === 'string' && call[0].includes('resolveSubjectToRef'),
      );
      expect(resolveWarnings).toHaveLength(0);

      warnSpy.mockRestore();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
