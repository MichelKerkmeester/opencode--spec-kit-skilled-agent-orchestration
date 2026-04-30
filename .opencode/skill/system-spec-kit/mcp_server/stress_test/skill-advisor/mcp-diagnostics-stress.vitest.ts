// ───────────────────────────────────────────────────────────────
// MODULE: sa-027 / sa-028 — MCP Diagnostics Stress Test
// ───────────────────────────────────────────────────────────────

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { handleAdvisorStatus, readAdvisorStatus } from '../../skill_advisor/handlers/advisor-status.js';
import { handleAdvisorValidate } from '../../skill_advisor/handlers/advisor-validate.js';
import { AdvisorStatusOutputSchema, AdvisorValidateOutputSchema } from '../../skill_advisor/schemas/advisor-tool-schemas.js';

const BOGUS_DAEMON_PID = '999999999';

function writeFile(root: string, relativePath: string, content: string): void {
  const filePath = join(root, relativePath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function writeGeneration(root: string, state: 'live' | 'stale' | 'absent' | 'unavailable', generation: number): void {
  writeFile(root, '.opencode/skill/.advisor-state/skill-graph-generation.json', `${JSON.stringify({
    generation,
    updatedAt: '2026-04-20T00:00:00.000Z',
    sourceSignature: `stress-${state}`,
    reason: `STRESS_${state.toUpperCase()}`,
    state,
  })}\n`);
}

function createDegradedWorkspace(): string {
  const root = mkdtempSync(join(tmpdir(), 'sa-027-status-'));
  writeFile(root, '.opencode/skill/alpha/graph-metadata.json', '{"skill_id":"alpha"}\n');
  writeFile(root, '.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite', '');
  writeGeneration(root, 'live', 42);
  return root;
}

describe('sa-027 / sa-028 — MCP diagnostics under degraded daemon state', () => {
  let previousPid: string | undefined;

  beforeEach(() => {
    previousPid = process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID;
    process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID = BOGUS_DAEMON_PID;
  });

  afterEach(() => {
    if (previousPid === undefined) {
      delete process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID;
    } else {
      process.env.SPECKIT_SKILL_GRAPH_DAEMON_PID = previousPid;
    }
  });

  it('advisor_status returns a schema-valid diagnostic envelope when daemon evidence is stale', async () => {
    const root = createDegradedWorkspace();
    try {
      const response = await handleAdvisorStatus({ workspaceRoot: root });
      const parsed = JSON.parse(response.content[0]?.text ?? '{}') as { status: string; data: unknown };
      const data = AdvisorStatusOutputSchema.parse(parsed.data);

      expect(parsed.status).toBe('ok');
      expect(data.generation).toBe(42);
      expect(data.daemonPid).toBe(Number(BOGUS_DAEMON_PID));
      expect(data.errors).toEqual([
        expect.stringContaining('no live daemon PID/process evidence'),
      ]);
      expect(data.laneWeights).toEqual(expect.objectContaining({
        explicit_author: 0.45,
        lexical: 0.3,
        graph_causal: 0.15,
        derived_generated: 0.15,
        semantic_shadow: 0,
      }));
      expect(response.content[0]?.text).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('advisor_status downgrades physically stale artifacts without rebuilding them', () => {
    const root = createDegradedWorkspace();
    try {
      const dbPath = join(root, '.opencode/skill/system-spec-kit/mcp_server/database/skill-graph.sqlite');
      const metadataPath = join(root, '.opencode/skill/alpha/graph-metadata.json');
      utimesSync(dbPath, new Date('2026-04-19T00:00:00.000Z'), new Date('2026-04-19T00:00:00.000Z'));
      utimesSync(metadataPath, new Date('2026-04-21T00:00:00.000Z'), new Date('2026-04-21T00:00:00.000Z'));

      const status = readAdvisorStatus({ workspaceRoot: root });

      expect(status.freshness).toBe('stale');
      expect(status.generation).toBe(42);
      expect(status.errors?.join('\n')).toContain('no live daemon PID/process evidence');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('advisor_validate still publishes prompt-safe release slices while daemon evidence is degraded', async () => {
    const response = await handleAdvisorValidate({
      confirmHeavyRun: true,
      skillSlug: 'system-spec-kit',
    });
    const parsed = JSON.parse(response.content[0]?.text ?? '{}') as { status: string; data: unknown };
    const data = AdvisorValidateOutputSchema.parse(parsed.data);

    expect(parsed.status).toBe('ok');
    expect(data.skillSlug).toBe('system-spec-kit');
    expect(data.thresholdSemantics.runtimeRouting).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
    expect(data.slices).toEqual(expect.objectContaining({
      corpus: expect.any(Object),
      holdout: expect.any(Object),
      parity: expect.any(Object),
      safety: expect.any(Object),
      latency: expect.any(Object),
    }));
    expect(data.telemetry.diagnostics.recordsPath).not.toContain('private@example.com');
    expect(response.content[0]?.text).not.toContain('"prompt"');
  });
});
