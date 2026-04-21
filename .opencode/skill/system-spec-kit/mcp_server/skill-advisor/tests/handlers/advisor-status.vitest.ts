// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Status Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, utimesSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { describe, expect, it } from 'vitest';

import { handleAdvisorStatus, readAdvisorStatus } from '../../handlers/advisor-status.js';

function workspace(name: string): string {
  const root = mkdtempSync(join(tmpdir(), `advisor-status-${name}-`));
  mkdirSync(join(root, '.opencode', 'skill', '.advisor-state'), { recursive: true });
  mkdirSync(join(root, '.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database'), { recursive: true });
  mkdirSync(join(root, '.opencode', 'skill', 'alpha'), { recursive: true });
  writeFileSync(join(root, '.opencode', 'skill', 'alpha', 'graph-metadata.json'), '{"skill_id":"alpha"}\n', 'utf8');
  return root;
}

function writeGeneration(root: string, state: 'live' | 'stale' | 'absent' | 'unavailable', generation = 1): void {
  writeFileSync(join(root, '.opencode', 'skill', '.advisor-state', 'skill-graph-generation.json'), `${JSON.stringify({
    generation,
    updatedAt: '2026-04-20T00:00:00.000Z',
    sourceSignature: `sig-${state}`,
    reason: `${state.toUpperCase()}_FIXTURE`,
    state,
  })}\n`, 'utf8');
}

function writeDb(root: string): void {
  writeFileSync(join(root, '.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database', 'skill-graph.sqlite'), '', 'utf8');
}

describe('advisor_status handler', () => {
  it('reports live freshness', () => {
    const root = workspace('live');
    writeDb(root);
    writeGeneration(root, 'live', 3);

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('live');
    expect(status.generation).toBe(3);
    expect(status.trustState.lastLiveAt).toBe('2026-04-20T00:00:00.000Z');
    expect(status.lastScanAt).toBe('2026-04-20T00:00:00.000Z');
    expect(status.skillCount).toBe(1);
    expect(status.laneWeights.explicit_author).toBe(0.45);
  });

  it('marks live generations stale when nested graph metadata is newer than the database', () => {
    const root = workspace('nested-mtime');
    writeDb(root);
    writeGeneration(root, 'live', 6);
    const dbPath = join(root, '.opencode', 'skill', 'system-spec-kit', 'mcp_server', 'database', 'skill-graph.sqlite');
    const metadataPath = join(root, '.opencode', 'skill', 'alpha', 'graph-metadata.json');
    utimesSync(dbPath, new Date('2026-04-19T00:00:00.000Z'), new Date('2026-04-19T00:00:00.000Z'));
    utimesSync(metadataPath, new Date('2026-04-21T00:00:00.000Z'), new Date('2026-04-21T00:00:00.000Z'));

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('stale');
    expect(status.trustState.lastLiveAt).toBe('2026-04-20T00:00:00.000Z');
  });

  it('reports stale freshness', () => {
    const root = workspace('stale');
    writeDb(root);
    writeGeneration(root, 'stale', 4);

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('stale');
    expect(status.trustState.reason).toBe('STALE_FIXTURE');
  });

  it('reports absent freshness when no artifact exists', () => {
    const root = workspace('absent');
    writeGeneration(root, 'absent', 0);

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('absent');
  });

  it('reports unavailable for corrupt generation metadata', () => {
    const root = workspace('unavailable');
    writeFileSync(join(root, '.opencode', 'skill', '.advisor-state', 'skill-graph-generation.json'), '{', 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root });

    expect(status.freshness).toBe('unavailable');
    expect(status.errors?.length).toBeGreaterThan(0);
  });

  it('does not leak prompt content in status output', async () => {
    const root = workspace('privacy');
    writeDb(root);
    writeGeneration(root, 'live', 5);

    const raw = (await handleAdvisorStatus({ workspaceRoot: root })).content[0].text;

    expect(raw).not.toContain('prompt');
    expect(raw).not.toContain('secret@example.com');
  });

  it('caps metadata scanning when requested to avoid unbounded status walks', () => {
    const root = workspace('scan-cap');
    writeDb(root);
    writeGeneration(root, 'live', 7);
    mkdirSync(join(root, '.opencode', 'skill', 'beta'), { recursive: true });
    writeFileSync(join(root, '.opencode', 'skill', 'beta', 'graph-metadata.json'), '{"skill_id":"beta"}\n', 'utf8');

    const status = readAdvisorStatus({ workspaceRoot: root, maxMetadataFiles: 1 });

    expect(status.skillCount).toBe(1);
    expect(status.errors).toEqual([
      expect.stringContaining('metadata scan capped at 1 files'),
    ]);
  });
});
