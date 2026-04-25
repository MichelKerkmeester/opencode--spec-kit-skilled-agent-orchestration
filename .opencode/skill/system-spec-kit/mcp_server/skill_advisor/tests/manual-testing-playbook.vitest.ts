import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..', '..', '..', '..');
const playbookRoot = resolve(
  repoRoot,
  '.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook',
);
const rootPlaybook = resolve(playbookRoot, 'manual_testing_playbook.md');

interface ScenarioRow {
  id: string;
  relativePath: string;
}

function listedScenarioRows(markdown: string): ScenarioRow[] {
  return [...markdown.matchAll(/^\| ([A-Z]{2}-\d{3}) \| [^|]+ \| \[[^\]]+\]\(([^)]+)\) \|$/gm)]
    .map((match) => ({
      id: match[1],
      relativePath: match[2],
    }));
}

function actualScenarioFiles(): string[] {
  return readdirSync(playbookRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{2}--/.test(entry.name))
    .flatMap((directory) =>
      readdirSync(resolve(playbookRoot, directory.name), { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
        .map((entry) => `${directory.name}/${entry.name}`)
    )
    .sort();
}

describe('skill advisor manual testing playbook inventory', () => {
  it('keeps the root playbook aligned with the live 42-scenario corpus', () => {
    const markdown = readFileSync(rootPlaybook, 'utf8');
    const rows = listedScenarioRows(markdown);
    const files = actualScenarioFiles();

    expect(markdown).toContain('42 deterministic manual scenarios across nine groups');
    expect(markdown).toContain('Release readiness is `READY` only when all 42 scenarios');
    expect(markdown).not.toMatch(/\b24-scenario\b|\b24 scenarios\b/);
    expect(rows).toHaveLength(42);
    expect(new Set(rows.map((row) => row.id)).size).toBe(42);
    expect(files).toHaveLength(42);

    for (const row of rows) {
      expect(existsSync(resolve(playbookRoot, row.relativePath))).toBe(true);
    }

    expect(rows.map((row) => row.relativePath).sort()).toEqual(files);
  });
});
