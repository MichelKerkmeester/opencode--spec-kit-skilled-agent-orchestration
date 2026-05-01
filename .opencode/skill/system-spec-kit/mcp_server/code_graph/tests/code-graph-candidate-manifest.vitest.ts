// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Candidate Manifest Tests
// ───────────────────────────────────────────────────────────────
// F-014-C4-03: a persisted candidate manifest tracks {count, digest} of
// known indexable file paths. On detectState, divergence (count or digest
// drift) flips freshness to stale + full_scan even if individual mtimes
// look fine.

import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  closeDb,
  getCodeGraphMetadata,
  initDb,
  setCodeGraphMetadata,
} from '../lib/code-graph-db.js';

afterEach(() => {
  try {
    closeDb();
  } catch {
    /* singleton cleanup */
  }
});

describe('F-014-C4-03: candidate manifest persistence', () => {
  it('round-trips a manifest record through code_graph_metadata', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-1-'));
    try {
      initDb(tempDir);
      const manifest = {
        count: 42,
        digest: 'abcdef0123456789',
        recordedAt: '2026-05-01T00:00:00.000Z',
      };
      setCodeGraphMetadata('candidate_manifest', JSON.stringify(manifest));

      const raw = getCodeGraphMetadata('candidate_manifest');
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw!);
      expect(parsed.count).toBe(42);
      expect(parsed.digest).toBe('abcdef0123456789');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('returns null for an absent manifest', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-2-'));
    try {
      initDb(tempDir);
      const raw = getCodeGraphMetadata('candidate_manifest');
      expect(raw).toBeNull();
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('overwrites an existing manifest on update', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-manifest-3-'));
    try {
      initDb(tempDir);
      setCodeGraphMetadata('candidate_manifest', JSON.stringify({ count: 10, digest: 'old', recordedAt: 'a' }));
      setCodeGraphMetadata('candidate_manifest', JSON.stringify({ count: 20, digest: 'new', recordedAt: 'b' }));

      const raw = getCodeGraphMetadata('candidate_manifest');
      const parsed = JSON.parse(raw!);
      expect(parsed.count).toBe(20);
      expect(parsed.digest).toBe('new');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
