// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Scan Auth Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { handleSkillGraphScan } from '../../handlers/skill-graph/scan.js';
import { closeDb, getDb, initDb } from '../../lib/skill-graph/skill-graph-db.js';
import { runWithCallerContext } from '../../lib/context/caller-context.js';
import type { MCPCallerContext } from '../../lib/context/caller-context.js';

type HandlerResponse = { content: Array<{ type: string; text: string }> };
type AuthContext = MCPCallerContext & { readonly trusted: boolean };

function callerContext(trusted: boolean): AuthContext {
  return {
    sessionId: trusted ? 'trusted-session' : 'untrusted-session',
    transport: 'stdio',
    connectedAt: '2026-04-28T00:00:00.000Z',
    callerPid: 4242,
    trusted,
    metadata: {
      source: 'vitest',
      trusted,
    },
  };
}

function writeGraphMetadata(skillRoot: string, skillId: string): void {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify({
    schema_version: 1,
    skill_id: skillId,
    family: 'system',
    category: 'test',
    domains: ['test'],
    intent_signals: [skillId],
    derived: {},
    edges: {},
  }), 'utf8');
}

function parsePayload(response: HandlerResponse): Record<string, unknown> {
  return JSON.parse(response.content[0].text) as Record<string, unknown>;
}

describe('skill_graph_scan caller authority', () => {
  afterEach(() => {
    closeDb();
    vi.restoreAllMocks();
  });

  it('rejects untrusted callers before mutating the graph', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-scan-auth-'));
    const workspace = join(root, 'workspace');
    const skillRoot = join(workspace, '.opencode', 'skill');

    try {
      mkdirSync(skillRoot, { recursive: true });
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha');

      const response = await runWithCallerContext(
        callerContext(false),
        () => handleSkillGraphScan({}),
      );
      const payload = parsePayload(response);

      expect(payload).toEqual({
        status: 'error',
        error: 'skill_graph_scan requires trusted caller context',
        code: 'UNTRUSTED_CALLER',
      });
      expect(getDb().prepare('SELECT COUNT(*) AS count FROM skill_nodes').get()).toEqual({ count: 0 });
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('allows trusted callers to scan and publish graph data', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-scan-auth-'));
    const workspace = join(root, 'workspace');
    const skillRoot = join(workspace, '.opencode', 'skill');

    try {
      mkdirSync(skillRoot, { recursive: true });
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);
      initDb(join(root, 'db'));
      writeGraphMetadata(skillRoot, 'alpha');

      const response = await runWithCallerContext(
        callerContext(true),
        () => handleSkillGraphScan({}),
      );
      const payload = parsePayload(response);

      expect(payload.status).toBe('ok');
      expect(payload.data).toMatchObject({ indexedNodes: 1 });
      expect(getDb().prepare('SELECT id FROM skill_nodes').all()).toEqual([{ id: 'alpha' }]);
    } finally {
      closeDb();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
