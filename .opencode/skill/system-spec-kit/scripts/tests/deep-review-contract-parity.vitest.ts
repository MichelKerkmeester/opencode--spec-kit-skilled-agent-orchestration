import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('deep-review contract parity', () => {
  const primaryDocs = [
    '.opencode/skill/sk-deep-review/SKILL.md',
    '.opencode/skill/sk-deep-review/README.md',
    '.opencode/skill/sk-deep-review/references/state_format.md',
    '.opencode/skill/sk-deep-review/references/loop_protocol.md',
    '.opencode/skill/sk-deep-review/references/quick_reference.md',
    '.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml',
  ];

  const runtimeMirrors = [
    '.opencode/agent/deep-review.md',
    '.claude/agents/deep-review.md',
    '.gemini/agents/deep-review.md',
    '.codex/agents/deep-review.toml',
  ];

  const commandAssets = [
    '.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml',
    '.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml',
  ];

  it('keeps primary deep-review docs aligned on canonical artifacts and lifecycle terms', () => {
    for (const docPath of primaryDocs) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should mention the canonical config file`).toContain('deep-review-config.json');
      expect(content, `${docPath} should mention the canonical state log`).toContain('deep-review-state.jsonl');
      expect(content, `${docPath} should mention the findings registry`).toContain('deep-review-findings-registry.json');
      expect(content, `${docPath} should mention the pause sentinel`).toContain('.deep-review-pause');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should mention release readiness`).toContain('releaseReadinessState');
    }
  });

  it('keeps all runtime mirrors aligned on lifecycle and reducer boundaries', () => {
    for (const docPath of runtimeMirrors) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should read the canonical state log`).toContain('review/deep-review-state.jsonl');
      expect(content, `${docPath} should mention the reducer-owned registry`).toContain('review/deep-review-findings-registry.json');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should mention lineageMode`).toContain('lineageMode');
      expect(content, `${docPath} should mention releaseReadinessState`).toContain('releaseReadinessState');
      expect(content, `${docPath} should not reference review/deep-research config paths anymore`).not.toContain(
        'review/deep-research-config.json',
      );
      expect(content, `${docPath} should not reference review/deep-research state paths anymore`).not.toContain(
        'review/deep-research-state.jsonl',
      );
      expect(content, `${docPath} should not reference the old review pause sentinel anymore`).not.toContain(
        'review/.deep-research-pause',
      );
    }
  });

  it('keeps command assets aligned on lifecycle controls and dual-read single-write migration', () => {
    for (const docPath of commandAssets) {
      const content = readWorkspaceFile(docPath);

      expect(content, `${docPath} should expose lifecycle mode input`).toContain('lineage_mode');
      expect(content, `${docPath} should write the canonical config file`).toContain('review/deep-review-config.json');
      expect(content, `${docPath} should write the canonical state log`).toContain('review/deep-review-state.jsonl');
      expect(content, `${docPath} should write the findings registry`).toContain('review/deep-review-findings-registry.json');
      expect(content, `${docPath} should mention completed-continue`).toContain('completed-continue');
      expect(content, `${docPath} should carry release readiness state`).toContain('releaseReadinessState');
      expect(content, `${docPath} should keep legacy deep-research reads in scratch only`).toContain(
        'scratch/deep-research-config.json',
      );
      expect(content, `${docPath} should keep legacy deep-research reads in scratch only`).toContain(
        'scratch/deep-research-state.jsonl',
      );
      expect(content, `${docPath} should keep legacy pause migration in scratch only`).toContain(
        'scratch/.deep-research-pause',
      );
      expect(content, `${docPath} should not write review/deep-research config paths anymore`).not.toContain(
        'review/deep-research-config.json',
      );
      expect(content, `${docPath} should not write review/deep-research state paths anymore`).not.toContain(
        'review/deep-research-state.jsonl',
      );
      expect(content, `${docPath} should not write the old review pause sentinel anymore`).not.toContain(
        'review/.deep-research-pause',
      );
    }

    const autoContent = readWorkspaceFile(commandAssets[0]);
    expect(autoContent).toContain('on_restart:');
    expect(autoContent).toContain('on_fork:');

    const confirmContent = readWorkspaceFile(commandAssets[1]);
    expect(confirmContent).toContain('options: [resume, restart, fork, completed-continue]');
  });
});
