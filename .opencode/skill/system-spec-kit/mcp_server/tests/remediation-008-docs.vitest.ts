import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = resolve(THIS_DIR, '../../../../..');

function readWorkspaceFile(relativePath: string): string {
  return readFileSync(resolve(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('008 search fusion and reranker remediation docs', () => {
  it('keeps feature catalog acceptance counts aligned with live root catalogs', () => {
    const spec = readWorkspaceFile(
      '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/008-deep-skill-feature-catalogs/spec.md',
    );

    expect(spec).toContain('sk-deep-research/feature_catalog/` -- root catalog + 14 feature entries across 4 categories');
    expect(spec).toContain('sk-deep-review/feature_catalog/` -- root catalog + 19 feature entries across 4 categories');
    expect(spec).toContain('sk-improve-agent/feature_catalog/` -- root catalog + 13 feature entries across 3 categories');
  });

  it('documents the skill advisor plugin manifest and prompt hook contract', () => {
    const validation = readWorkspaceFile(
      '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/001-initial-research/research/research-validation.md',
    );

    expect(validation).toContain('.opencode/plugins/spec-kit-skill-advisor.manifest.json');
    expect(validation).toContain('`bridgeCommand`: `node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs`');
    expect(validation).toContain('`hooks`: `onSessionStart`, `onUserPromptSubmitted`, `onSessionEnd`');
    expect(validation).toContain('`tools`: `spec_kit_skill_advisor_status`');
    expect(validation).toContain('Register `onUserPromptSubmitted(input)` as the prompt hook.');
    expect(validation).toContain('Return `{ additionalContext: brief }` when the bridge status is `ok`');
    expect(validation).toContain('SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1');
  });
});
