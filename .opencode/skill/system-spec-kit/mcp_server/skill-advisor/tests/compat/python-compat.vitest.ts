import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..', '..');
const pythonCompatPath = resolve(
  repoRoot,
  '.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py',
);

describe('python compatibility suite', () => {
  it('runs the Python skill-advisor compatibility tests from vitest', () => {
    const result = spawnSync('python3', [pythonCompatPath], {
      cwd: repoRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
      },
    });

    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain('Summary: pass=');
    expect(result.stdout).toContain('fail=0');
  });
});
