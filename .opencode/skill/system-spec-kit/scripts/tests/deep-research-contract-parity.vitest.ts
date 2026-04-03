import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const capabilityModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs',
)) as {
  listRuntimeCapabilityIds: () => string[];
  loadRuntimeCapabilities: () => { matrix: { runtimes: Array<{ id: string; mirrorPath: string; commandWrapperPath?: string }> } };
};

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('deep-research contract parity', () => {
  const primaryDocs = [
    '.opencode/skill/sk-deep-research/SKILL.md',
    '.opencode/skill/sk-deep-research/README.md',
    '.opencode/skill/sk-deep-research/references/state_format.md',
    '.opencode/skill/sk-deep-research/references/loop_protocol.md',
    '.opencode/skill/sk-deep-research/references/quick_reference.md',
    '.opencode/skill/sk-deep-research/references/capability_matrix.md',
    '.opencode/skill/sk-deep-research/assets/deep_research_config.json',
  ];

  const runtimeMirrors = [
    '.opencode/agent/deep-research.md',
    '.claude/agents/deep-research.md',
    '.gemini/agents/deep-research.md',
    '.codex/agents/deep-research.toml',
    '.agents/agents/deep-research.md',
  ];

  const commandAssets = [
    '.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml',
    '.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml',
  ];

  it('keeps primary docs aligned on canonical artifacts and the machine-readable capability source', () => {
    for (const docPath of primaryDocs) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should mention the canonical state log`).toContain('deep-research-state.jsonl');
      expect(content, `${docPath} should mention the findings registry`).toContain('findings-registry.json');
      expect(content, `${docPath} should mention the canonical pause sentinel`).toContain('.deep-research-pause');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should mention the runtime capability matrix`).toMatch(/runtime[_ -]?capabilit/i);
    }
  });

  it('keeps runtime mirrors aligned on reducer-owned boundaries', () => {
    for (const docPath of runtimeMirrors) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should read the canonical state log`).toContain('research/deep-research-state.jsonl');
      expect(content, `${docPath} should read the findings registry`).toContain('research/findings-registry.json');
      expect(content, `${docPath} should mention reducer ownership`).toContain('workflow reducer');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should not claim direct strategy writes in the completion report`).not.toContain(
        'research/deep-research-strategy.md (updated)',
      );
    }
  });

  it('keeps command assets aligned on reducer execution and lifecycle controls', () => {
    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should write the findings registry`).toContain('findings-registry.json');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should invoke the reducer script`).toContain(
        'node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs {spec_folder}',
      );
    }
  });

  it('exposes a machine-readable capability matrix for every supported runtime surface', () => {
    const runtimeIds = capabilityModule.listRuntimeCapabilityIds();
    expect(runtimeIds).toEqual(['opencode', 'claude', 'codex', 'gemini', 'agents']);

    const matrix = capabilityModule.loadRuntimeCapabilities().matrix;
    for (const runtime of matrix.runtimes) {
      expect(fs.existsSync(path.join(WORKSPACE_ROOT, runtime.mirrorPath)), `${runtime.id} mirror should exist`).toBe(true);
      if (runtime.commandWrapperPath) {
        expect(
          fs.existsSync(path.join(WORKSPACE_ROOT, runtime.commandWrapperPath)),
          `${runtime.id} command wrapper should exist`,
        ).toBe(true);
      }
    }
  });
});
