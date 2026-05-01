// ───────────────────────────────────────────────────────────────
// MODULE: Manual Testing Playbook Coverage Tests
// ───────────────────────────────────────────────────────────────

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
  // ID prefix length: SAD-NNN (3 letters) since 026/040 reclassification.
  return [...markdown.matchAll(/^\| ([A-Z]{2,4}-\d{3}) \| [^|]+ \| \[[^\]]+\]\(([^)]+)\) \|$/gm)]
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
  it('keeps the root playbook aligned with the live 4-scenario corpus', () => {
    const markdown = readFileSync(rootPlaybook, 'utf8');
    const rows = listedScenarioRows(markdown);
    const files = actualScenarioFiles();

    // Packet 026/040 (T-051) reclassified the prior 42/9 layout into 44 operator_runbook/
    // files plus a canonical 4-scenario / 3-category playbook (SAD-001..SAD-004).
    expect(markdown).toContain('4 deterministic scenarios across 3 categories');
    expect(markdown).toContain('all four `SAD-NNN` scenarios are `PASS`');
    expect(markdown).not.toMatch(/\b24-scenario\b|\b24 scenarios\b/);
    expect(markdown).not.toMatch(/\b42-scenario\b|\b42 scenarios\b/);
    expect(rows).toHaveLength(4);
    expect(new Set(rows.map((row) => row.id)).size).toBe(4);
    expect(files).toHaveLength(4);

    for (const row of rows) {
      expect(existsSync(resolve(playbookRoot, row.relativePath))).toBe(true);
    }

    expect(rows.map((row) => row.relativePath).sort()).toEqual(files);
  });
});
