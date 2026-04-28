// ───────────────────────────────────────────────────────────────
// MODULE: Skill Graph Diagnostic Redaction Tests
// ───────────────────────────────────────────────────────────────

import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SpecKitSkillAdvisorPlugin from '../../../../plugins/spec-kit-skill-advisor.js';
import { handleSkillGraphScan } from '../handlers/skill-graph/scan.js';
import { runWithCallerContext } from '../lib/context/caller-context.js';
import type { MCPCallerContext } from '../lib/context/caller-context.js';

function trustedCaller(): MCPCallerContext & { readonly trusted: true } {
  return {
    sessionId: 'trusted-session',
    transport: 'stdio',
    connectedAt: '2026-04-28T00:00:00.000Z',
    callerPid: 4242,
    trusted: true,
    metadata: { source: 'vitest', trusted: true },
  };
}

describe('skill graph diagnostic redaction', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('redacts absolute workspace paths from scan rejection envelopes', async () => {
    const root = mkdtempSync(join(tmpdir(), 'skill-graph-redaction-'));
    const workspace = join(root, 'workspace');

    try {
      mkdirSync(workspace, { recursive: true });
      vi.spyOn(process, 'cwd').mockReturnValue(workspace);

      const response = await runWithCallerContext(
        trustedCaller(),
        () => handleSkillGraphScan({ skillsRoot: '../outside-workspace' }),
      );
      const raw = response.content[0].text;

      expect(raw).toContain('"status":"error"');
      expect(raw).not.toContain(root);
      expect(raw).not.toMatch(/\/var\/|\/tmp\/|\/Users\//);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('redacts absolute bridge paths from plugin status output', async () => {
    const hooks = await SpecKitSkillAdvisorPlugin({ directory: process.cwd() }, {});
    const status = await hooks.tool?.spec_kit_skill_advisor_status.execute({});

    expect(status).toContain('bridge_path=');
    expect(status).not.toMatch(/bridge_path=\/|bridge_path=[A-Za-z]:\\/);
    expect(status).not.toMatch(/\/Users\/|\/var\/|\/tmp\//);
  });
});
