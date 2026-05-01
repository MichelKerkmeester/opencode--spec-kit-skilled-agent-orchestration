// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Graph Health Tests
// ───────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const compilerPath = resolve(
  repoRoot,
  '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py',
);
const advisorPath = resolve(
  repoRoot,
  '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py',
);

describe('advisor graph health', () => {
  it('validates graph metadata without orphan skills', () => {
    const result = spawnSync('python3', [compilerPath, '--validate-only'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).not.toContain('ZERO-EDGE WARNINGS');
    expect(result.stdout).toContain('VALIDATION PASSED');
  });

  it('keeps health ok when skill-advisor is the only graph-only node', () => {
    const result = spawnSync('python3', [advisorPath, '--health'], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      },
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    const jsonStart = result.stdout.indexOf('{');
    expect(jsonStart).toBeGreaterThanOrEqual(0);
    const payload = JSON.parse(result.stdout.slice(jsonStart)) as {
      status: string;
      inventory_parity: {
        in_sync: boolean;
        missing_in_discovery: string[];
        graph_only?: string[];
      };
    };

    expect(payload.status).toBe('ok');
    expect(payload.inventory_parity.in_sync).toBe(true);
    expect(payload.inventory_parity.missing_in_discovery).toEqual([]);
    // Folder + skill_id are both snake_case after commit 7dfd108. GRAPH_ONLY_SKILL_IDS
    // and the compiler's hardcoded injection were aligned to match in packet 047.
    expect(payload.inventory_parity.graph_only).toEqual(['skill_advisor']);
  });
});
