import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { lintEvidenceMarkers } from '../validation/evidence-marker-lint.js';

const createdRoots = new Set<string>();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
const LINT_SCRIPT = path.join(SCRIPTS_ROOT, 'validation', 'evidence-marker-lint.ts');
const TSX_BIN = path.join(SCRIPTS_ROOT, 'node_modules', '.bin', 'tsx');

function makeFixtureRoot(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  createdRoots.add(root);
  return root;
}

function writeMarkdown(root: string, relativePath: string, content: string): string {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

function runLintCli(folder: string): { exitCode: number; stdout: string; stderr: string } {
  const result = spawnSync(TSX_BIN, [LINT_SCRIPT, '--folder', folder, '--strict'], {
    encoding: 'utf8',
  });

  return {
    exitCode: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

afterEach(() => {
  for (const root of createdRoots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  createdRoots.clear();
});

describe('evidence-marker-lint', () => {
  it('reports pass for folders with clean evidence markers', async () => {
    const root = makeFixtureRoot('evidence-marker-lint-clean-');
    writeMarkdown(root, 'checklist.md', '- [x] Item — [EVIDENCE: clean marker]\n');

    const result = await lintEvidenceMarkers(root);

    expect(result.status).toBe('pass');
    expect(result.malformed).toBe(0);
    expect(result.unclosed).toBe(0);
  });

  it('exits 0 in strict CLI mode when all markers are clean', () => {
    const root = makeFixtureRoot('evidence-marker-lint-cli-clean-');
    writeMarkdown(root, 'tasks.md', '- [x] Task — [EVIDENCE: clean marker]\n');

    const result = runLintCli(root);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('EVIDENCE_MARKER_LINT');
    expect(result.stdout).toContain('all markers closed with balanced brackets');
  });

  it('exits 1 in strict CLI mode when malformed markers are present', () => {
    const root = makeFixtureRoot('evidence-marker-lint-cli-malformed-');
    writeMarkdown(root, 'tasks.md', '- [x] Task — [EVIDENCE: malformed marker)\n');

    const result = runLintCli(root);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('EVIDENCE_MARKER_LINT');
    expect(result.stdout).toContain('1 malformed and 0 unclosed');
    expect(result.stdout).toContain('tasks.md:1:14 malformed');
  });
});
