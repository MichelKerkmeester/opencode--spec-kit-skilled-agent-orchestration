// ───────────────────────────────────────────────────────────────
// MODULE: sa-035 / sa-036 — Python Compatibility Stress Test
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { execSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PYTHON_AVAILABLE = (() => {
  try {
    execSync('python3 --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
})();

const REPO_ROOT = resolve(import.meta.dirname, '../../../../../../');
const SHIM_SCRIPT = resolve(
  REPO_ROOT,
  '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py',
);
const REGRESSION_SCRIPT = resolve(
  REPO_ROOT,
  '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py',
);
const REGRESSION_DATASET = resolve(
  REPO_ROOT,
  '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl',
);

function runPython(args: readonly string[], input = '') {
  return spawnSync('python3', args, {
    cwd: REPO_ROOT,
    input,
    encoding: 'utf8',
    timeout: 60_000,
    env: {
      ...process.env,
      SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    },
    maxBuffer: 1024 * 1024 * 10,
  });
}

function parseJson(stdout: string): unknown {
  return JSON.parse(stdout.trim() || 'null');
}

describe('sa-035 / sa-036 — Python compat', () => {
  if (!PYTHON_AVAILABLE) {
    it.skip('python3 not available on PATH; sa-035/sa-036 skipped', () => {
      // intentionally empty
    });
    return;
  }

  it('skill_advisor.py exposes the documented CLI shim controls', () => {
    const result = runPython([SHIM_SCRIPT, '--help']);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('--stdin');
    expect(result.stdout).toContain('--force-native');
    expect(result.stdout).toContain('--force-local');
    expect(result.stdout).toContain('--threshold');
    expect(result.stdout).toContain('--uncertainty');
  });

  it('preserves --stdin force-local JSON-array output without prompt leakage in metadata', () => {
    const prompt = 'save this private-address@example.com context';
    const result = runPython([
      SHIM_SCRIPT,
      '--force-local',
      '--stdin',
      '--threshold',
      '0',
      '--uncertainty',
      '1',
    ], prompt);
    const parsed = parseJson(result.stdout);

    expect(result.status).toBe(0);
    expect(Array.isArray(parsed)).toBe(true);
    expect(result.stdout).not.toContain('"prompt"');
    expect(result.stdout).not.toContain('private-address@example.com');
  });

  it('honors the shared disabled flag unless --force-native explicitly opts out', () => {
    const disabled = spawnSync('python3', [SHIM_SCRIPT, 'save this context'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
        SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      },
    });
    const forcedNative = spawnSync('python3', [SHIM_SCRIPT, '--force-native', 'save this context'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1',
        SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      },
    });

    expect(disabled.status).toBe(0);
    expect(parseJson(disabled.stdout)).toEqual([]);
    expect(forcedNative.status === 0 || forcedNative.status === 2).toBe(true);
    expect(forcedNative.stdout).not.toContain('save this context');
  });

  it('runs the regression harness against the checked-in 52-case dataset in subprocess mode', () => {
    expect(existsSync(REGRESSION_SCRIPT)).toBe(true);
    const datasetCaseCount = readFileSync(REGRESSION_DATASET, 'utf8').trim().split('\n').length;
    expect(datasetCaseCount).toBeGreaterThanOrEqual(50);

    const result = runPython([
      REGRESSION_SCRIPT,
      '--dataset',
      REGRESSION_DATASET,
      '--runner',
      'subprocess',
      '--mode',
      'both',
    ]);
    const report = parseJson(result.stdout) as {
      overall_pass: boolean;
      metrics: {
        total_cases: number;
        passed_cases: number;
        failed_cases: number;
        p0_pass_rate: number;
      };
      failures: unknown[];
    };

    expect(result.status).toBe(0);
    expect(report.overall_pass).toBe(true);
    expect(report.metrics.total_cases).toBe(datasetCaseCount);
    expect(report.metrics.passed_cases).toBe(datasetCaseCount);
    expect(report.metrics.failed_cases).toBe(0);
    expect(report.metrics.p0_pass_rate).toBe(1);
    expect(report.failures).toEqual([]);
  });
});
