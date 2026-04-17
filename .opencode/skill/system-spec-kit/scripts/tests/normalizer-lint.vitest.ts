import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const VALIDATE_SCRIPT = path.join(SKILL_ROOT, 'scripts', 'spec', 'validate.sh');

const createdTempRoots = new Set<string>();

function makeTempWorkspace(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-normalizer-lint-'));
  createdTempRoots.add(root);
  return root;
}

function createSpecFolder(workspaceRoot: string): string {
  const specPath = path.join(workspaceRoot, 'specs', '001-normalizer-lint');
  fs.mkdirSync(specPath, { recursive: true });
  fs.writeFileSync(path.join(specPath, 'spec.md'), '# Test Packet\n\n| **Level** | 1 |\n', 'utf-8');
  fs.writeFileSync(path.join(specPath, 'plan.md'), '# Plan\n', 'utf-8');
  fs.writeFileSync(path.join(specPath, 'tasks.md'), '# Tasks\n', 'utf-8');
  return specPath;
}

function runValidate(specPath: string, targetDir: string, flags: string[] = []): { exitCode: number; stdout: string; stderr: string } {
  const workspaceRoot = path.resolve(specPath, '..', '..');
  const result = spawnSync('bash', [VALIDATE_SCRIPT, specPath, ...flags], {
    cwd: workspaceRoot,
    encoding: 'utf-8',
    env: {
      ...process.env,
      SPECKIT_RULES: 'NORMALIZER_LINT',
      SPECKIT_NORMALIZER_LINT_TARGET: targetDir,
    },
  });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

afterEach(() => {
  for (const root of createdTempRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdTempRoots.clear();
});

describe('validate.sh normalizer lint', () => {
  it('passes strict mode when the target tree has no local normalizer helpers', () => {
    const workspaceRoot = makeTempWorkspace();
    const specPath = createSpecFolder(workspaceRoot);
    const targetDir = path.join(workspaceRoot, 'fixture-mcp_server');

    fs.mkdirSync(path.join(targetDir, 'lib', 'governance'), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, 'lib', 'governance', 'scope-governance.ts'),
      'export function normalizeScopeValue(value: unknown): string | null { return typeof value === "string" ? value : null; }\n',
      'utf-8',
    );
    fs.writeFileSync(
      path.join(targetDir, 'handlers.ts'),
      'import { normalizeScopeValue } from "./lib/governance/scope-governance";\nexport const value = normalizeScopeValue("tenant");\n',
      'utf-8',
    );

    const result = runValidate(specPath, targetDir, ['--strict']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('NORMALIZER_LINT');
    expect(result.stdout).toContain('No local normalizeScope*/getOptionalString declarations found');
  });

  it('fails strict mode and lists violating files when local helper declarations are found', () => {
    const workspaceRoot = makeTempWorkspace();
    const specPath = createSpecFolder(workspaceRoot);
    const targetDir = path.join(workspaceRoot, 'fixture-mcp_server');

    fs.mkdirSync(path.join(targetDir, 'lib'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'tests'), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, 'lib', 'duplicate-normalize.ts'),
      'function normalizeScopeShadow(value: string): string { return value.trim(); }\n',
      'utf-8',
    );
    fs.writeFileSync(
      path.join(targetDir, 'lib', 'duplicate-string.ts'),
      'function getOptionalString(row: Record<string, unknown>, key: string): string | undefined { return typeof row[key] === "string" ? row[key] as string : undefined; }\n',
      'utf-8',
    );
    fs.writeFileSync(
      path.join(targetDir, 'tests', 'ignore.vitest.ts'),
      'function normalizeScopeTestOnly(value: string): string { return value; }\n',
      'utf-8',
    );

    const result = runValidate(specPath, targetDir, ['--strict']);

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toContain('duplicate-normalize.ts');
    expect(result.stdout).toContain('duplicate-string.ts');
    expect(result.stdout).not.toContain('ignore.vitest.ts');
  });

  it('skips the rule outside strict mode', () => {
    const workspaceRoot = makeTempWorkspace();
    const specPath = createSpecFolder(workspaceRoot);
    const targetDir = path.join(workspaceRoot, 'fixture-mcp_server');

    fs.mkdirSync(path.join(targetDir, 'lib'), { recursive: true });
    fs.writeFileSync(
      path.join(targetDir, 'lib', 'duplicate-normalize.ts'),
      'function normalizeScopeShadow(value: string): string { return value.trim(); }\n',
      'utf-8',
    );

    const result = runValidate(specPath, targetDir);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Normalizer lint skipped (strict mode only)');
  });
});
