// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scope Readiness Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  closeDb,
  getStoredCodeGraphScope,
  initDb,
  replaceNodes,
  setCodeGraphScope,
  setCodeGraphMetadata,
  upsertFile,
} from '../lib/code-graph-db.js';
import {
  CODE_GRAPH_INDEX_SKILLS_ENV,
  CODE_GRAPH_SCOPE_FINGERPRINT_KEY,
  CODE_GRAPH_SCOPE_LABEL_KEY,
  CODE_GRAPH_SCOPE_SOURCE_KEY,
  resolveIndexScopePolicy,
} from '../lib/index-scope-policy.js';
import {
  ensureCodeGraphReady,
  getGraphReadinessSnapshot,
} from '../lib/ensure-ready.js';
import { generateContentHash, type CodeNode } from '../lib/indexer-types.js';

let originalIndexSkillsEnv: string | undefined;

function writeTrackedNode(rootDir: string): string {
  const filePath = join(rootDir, 'src/app.ts');
  mkdirSync(join(rootDir, 'src'), { recursive: true });
  writeFileSync(filePath, 'export function app() { return 1; }\n');
  const fileId = upsertFile(
    filePath,
    'typescript',
    generateContentHash('export function app() { return 1; }\n'),
    1,
    0,
    'clean',
    1,
  );
  const node: CodeNode = {
    symbolId: 'app-symbol',
    filePath,
    fqName: 'app',
    kind: 'function',
    name: 'app',
    startLine: 1,
    endLine: 1,
    startColumn: 0,
    endColumn: 0,
    language: 'typescript',
    contentHash: 'hash',
  };
  replaceNodes(fileId, [node]);
  return filePath;
}

beforeEach(() => {
  originalIndexSkillsEnv = process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
  delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
});

afterEach(() => {
  if (originalIndexSkillsEnv === undefined) {
    delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
  } else {
    process.env[CODE_GRAPH_INDEX_SKILLS_ENV] = originalIndexSkillsEnv;
  }
  closeDb();
});

describe('code graph scope readiness', () => {
  it('round-trips the active scope fingerprint through code_graph_metadata', () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-db-'));
    try {
      initDb(tempDir);
      const policy = resolveIndexScopePolicy({ includeSkills: true, env: {} });

      setCodeGraphScope(policy);

      expect(getStoredCodeGraphScope()).toEqual({
        fingerprint: 'code-graph-scope:v2:skills=all:agents=none:commands=none:specs=none:plugins=none:mcp-coco-index=excluded',
        label: 'end-user code only; opted-in .opencode folders: skills; mcp-coco-index/mcp_server excluded',
        includeSkills: true,
        includedSkillsList: 'all',
        includeAgents: false,
        includeCommands: false,
        includeSpecs: false,
        includePlugins: false,
        source: 'scan-argument',
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('requires an explicit full scan when env drift makes stored and active scope fingerprints differ', async () => {
    // FIX-009-v3: env-drift gate fires only when the stored scope was itself
    // env-derived. Set up an env-source stored scope by passing env vars and
    // NO per-call args, then resolve again with different env to simulate
    // cross-session env change.
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-mismatch-'));
    try {
      initDb(tempDir);
      writeTrackedNode(tempDir);
      // Stored scope derived from env (source='env'): SKILLS=true env, no per-call.
      setCodeGraphScope(resolveIndexScopePolicy({ env: { SPECKIT_CODE_GRAPH_INDEX_SKILLS: 'true' } }));

      const snapshot = getGraphReadinessSnapshot(tempDir);
      expect(snapshot).toMatchObject({
        freshness: 'stale',
        action: 'full_scan',
      });
      expect(snapshot.reason).toContain('code graph scope changed');

      const readiness = await ensureCodeGraphReady(tempDir, {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });
      expect(readiness).toMatchObject({
        freshness: 'stale',
        action: 'full_scan',
        inlineIndexPerformed: false,
      });
      expect(readiness.reason).toContain('inline full scan skipped for read path');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('FIX-009-v3: per-call (scan-argument) stored scope is trusted regardless of env drift', async () => {
    // When a scan was run with explicit per-call args, the stored scope is the
    // user's deliberate choice for the index. Env mismatch must NOT block reads.
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-per-call-'));
    try {
      initDb(tempDir);
      writeTrackedNode(tempDir);
      // Stored scope from explicit per-call args (source='scan-argument'):
      // includeSkills:true with empty env. Then env drifts (env={} = nothing
      // included), but reads should still proceed against the stored scope.
      setCodeGraphScope(resolveIndexScopePolicy({ includeSkills: true, env: {} }));

      const snapshot = getGraphReadinessSnapshot(tempDir);
      // Gate must NOT fire: per-call stored scope wins over env drift.
      expect(snapshot.reason).not.toContain('code graph scope changed');
      // Snapshot is fresh because no other drift exists in the temp DB.
      expect(snapshot.freshness).toBe('fresh');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('treats stored v1 fingerprints as a scope migration requiring a blocked read', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-v1-migration-'));
    try {
      initDb(tempDir);
      writeTrackedNode(tempDir);
      setCodeGraphMetadata(
        CODE_GRAPH_SCOPE_FINGERPRINT_KEY,
        'code-graph-scope:v1:skills=excluded:mcp-coco-index=excluded',
      );
      setCodeGraphMetadata(
        CODE_GRAPH_SCOPE_LABEL_KEY,
        'end-user code only; .opencode/skill and mcp-coco-index/mcp_server excluded',
      );
      setCodeGraphMetadata(CODE_GRAPH_SCOPE_SOURCE_KEY, 'default');

      const snapshot = getGraphReadinessSnapshot(tempDir);
      expect(snapshot).toMatchObject({
        freshness: 'stale',
        action: 'full_scan',
      });
      expect(snapshot.reason).toContain('code graph scope changed');

      const readiness = await ensureCodeGraphReady(tempDir, {
        allowInlineIndex: true,
        allowInlineFullScan: false,
      });
      expect(readiness).toMatchObject({
        freshness: 'stale',
        action: 'full_scan',
        inlineIndexPerformed: false,
      });
      expect(readiness.reason).toContain('inline full scan skipped for read path');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
