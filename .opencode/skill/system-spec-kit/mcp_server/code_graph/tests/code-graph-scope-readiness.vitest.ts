// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Scope Readiness Tests
// ───────────────────────────────────────────────────────────────

import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  closeDb,
  getStoredCodeGraphScope,
  initDb,
  replaceNodes,
  setCodeGraphScope,
  upsertFile,
} from '../lib/code-graph-db.js';
import {
  CODE_GRAPH_INDEX_SKILLS_ENV,
  resolveIndexScopePolicy,
} from '../lib/index-scope-policy.js';
import {
  ensureCodeGraphReady,
  getGraphReadinessSnapshot,
} from '../lib/ensure-ready.js';
import { generateContentHash, type CodeNode } from '../lib/indexer-types.js';

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

afterEach(() => {
  delete process.env[CODE_GRAPH_INDEX_SKILLS_ENV];
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
        fingerprint: 'code-graph-scope:v1:skills=included:mcp-coco-index=excluded',
        label: 'end-user code plus .opencode/skill opt-in; mcp-coco-index/mcp_server excluded',
      });
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('requires an explicit full scan when stored and active scope fingerprints differ', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-scope-mismatch-'));
    try {
      initDb(tempDir);
      writeTrackedNode(tempDir);
      setCodeGraphScope(resolveIndexScopePolicy({ includeSkills: true, env: {} }));

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
