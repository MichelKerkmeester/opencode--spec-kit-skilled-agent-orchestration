import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const MCP_SERVER_ROOT = path.join(__dirname, '..');
const SKILL_ROOT = path.join(MCP_SERVER_ROOT, '..');
const WORKSPACE_ROOT = path.join(SKILL_ROOT, '..', '..', '..');
const HYDRA_SPEC_ROOT = path.join(
  WORKSPACE_ROOT,
  '.opencode',
  'specs',
  '02--system-spec-kit',
  '022-hybrid-rag-fusion',
  '008-hydra-db-based-features',
);

const parentDocs = {
  spec: path.join(HYDRA_SPEC_ROOT, 'spec.md'),
  plan: path.join(HYDRA_SPEC_ROOT, 'plan.md'),
  tasks: path.join(HYDRA_SPEC_ROOT, 'tasks.md'),
  checklist: path.join(HYDRA_SPEC_ROOT, 'checklist.md'),
  implementationSummary: path.join(HYDRA_SPEC_ROOT, 'implementation-summary.md'),
};

const runtimeReferences = [
  'mcp_server/lib/collab/shared-spaces.ts',
  'mcp_server/lib/governance/retention.ts',
  'mcp_server/lib/search/vector-index-mutations.ts',
  'mcp_server/tests/shared-spaces.vitest.ts',
  'mcp_server/tests/memory-governance.vitest.ts',
  'mcp_server/tests/hydra-spec-pack-consistency.vitest.ts',
];

const staleReferences = [
  'mcp_server/handlers/memory-query*.ts',
  'mcp_server/handlers/memory-share*.ts',
  'mcp_server/lib/search/adaptive-ranking.ts',
  'mcp_server/lib/governance/scope-policy.ts',
  'mcp_server/lib/governance/shared-policy.ts',
  'mcp_server/lib/collab/conflict-strategy.ts',
  'mcp_server/lib/search/graph-health.ts',
  'mcp_server/scripts/rollback/*',
  'mcp_server/test/lineage/*.test.ts',
  'mcp_server/test/search/graph-fusion.test.ts',
  'mcp_server/test/search/adaptive-ranking.test.ts',
  'mcp_server/test/security/scope-isolation.test.ts',
  'mcp_server/test/collab/shared-memory.test.ts',
];

const featureCatalogDocs = [
  path.join(SKILL_ROOT, 'feature_catalog', '14--pipeline-architecture', '22-lineage-state-active-projection-and-asof-resolution.md'),
  path.join(SKILL_ROOT, 'feature_catalog', '17--governance', '03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md'),
  path.join(SKILL_ROOT, 'feature_catalog', '17--governance', '04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md'),
  path.join(SKILL_ROOT, 'feature_catalog', '19--feature-flag-reference', '01-1-search-pipeline-features-speckit.md'),
];

function readDoc(docPath: string): string {
  return fs.readFileSync(docPath, 'utf8');
}

function globPatternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
  return new RegExp(escaped.replace(/\*/g, '.*'));
}

describe('Hydra spec-pack truth sync', () => {
  it('parent spec and plan describe the closure pass with current scope, evidence, and support boundaries', () => {
    const specContent = readDoc(parentDocs.spec);
    const planContent = readDoc(parentDocs.plan);

    expect(specContent).toContain('acts as the Level 3 coordination record for the delivered Hydra roadmap');
    expect(specContent).toContain('Live five-CLI proof capture plus CLI-proof wording alignment');
    expect(specContent).toContain('describe shared memory as opt-in live access');
    expect(specContent).toContain('283` files, `7790` tests, `11` skipped, and `28` todo');
    expect(specContent).not.toContain('root-only normalization pass');
    expect(specContent).not.toContain('Editing any phase subfolder under `001-` through `006-`');

    expect(planContent).toContain('all six child phase packs as one coherent documentation set');
    expect(planContent).toContain('shared-space owner enforcement and retention-sweep database routing');
    expect(planContent).toContain('The scripts-side targeted multi-CLI closure suite passed `7` files and `54` tests.');
    expect(planContent).toContain('Live prompt proof was captured for all five required CLIs');
    expect(planContent).not.toContain('without touching phase subfolders');
    expect(planContent).not.toContain('root-only scope was confirmed');
  });

  it('parent task and checklist references point to the shipped runtime surface', () => {
    const tasksContent = readDoc(parentDocs.tasks);
    const checklistContent = readDoc(parentDocs.checklist);

    for (const reference of runtimeReferences) {
      expect(tasksContent).toContain(reference);
      const runtimePath = path.join(MCP_SERVER_ROOT, reference.replace(/^mcp_server\//, ''));
      expect(fs.existsSync(runtimePath)).toBe(true);
    }

    for (const reference of staleReferences) {
      expect(globPatternToRegex(reference).test(tasksContent)).toBe(false);
    }

    expect(tasksContent).toContain('.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md');
    expect(tasksContent).toContain('.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md');
    expect(tasksContent).toContain('Fix retention sweeps so deletion uses the passed database handle');
    expect(checklistContent).toContain('**Verification Date**: 2026-03-17');
    expect(checklistContent).toContain('Hydra closure verification passed across parent and phase validation');
    expect(checklistContent).toContain('`283` passed files, `7790` passed tests, `11` skipped, and `28` todo');
    expect(checklistContent).toContain('Live prompt proof was captured for all five CLIs with timestamps');
  });

  it('feature catalog and manual playbook links used by the Hydra phases resolve', () => {
    for (const docPath of featureCatalogDocs) {
      expect(fs.existsSync(docPath)).toBe(true);
    }

    const playbookPath = path.join(SKILL_ROOT, 'manual_testing_playbook', 'manual_testing_playbook.md');
    const playbookContent = readDoc(playbookPath);

    expect(playbookContent).toContain('NEW-121');
    expect(playbookContent).toContain('NEW-122');
    expect(playbookContent).toContain('NEW-123');
    expect(playbookContent).toContain('NEW-125');
    expect(playbookContent).toContain('NEW-129');
    expect(playbookContent).toContain('NEW-130');
    expect(playbookContent).toContain('NEW-142');
    expect(playbookContent).toContain('NEW-143');
    expect(playbookContent).toContain('NEW-144');
  });

  it('implementation summary records the closure verification set and corrected runtime boundaries', () => {
    const summaryContent = readDoc(parentDocs.implementationSummary);

    expect(summaryContent).toContain('Hydra closure pass now leaves the parent pack and all six phase packs');
    expect(summaryContent).toContain('Owner-only shared-space operations now enforce the `owner` role correctly');
    expect(summaryContent).toContain('retention sweeps now delete through the database handle');
    expect(summaryContent).toContain('npm run test:hydra:phase1');
    expect(summaryContent).toContain('npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts');
    expect(summaryContent).toContain('PASS (`53` tests)');
    expect(summaryContent).toContain('PASS (`283` passed files, `7790` passed tests, `11` skipped, `28` todo)');
    expect(summaryContent).toContain('PASS (`7` files, `54` tests)');
    expect(summaryContent).toContain('Require live prompt proof for all five CLIs before closure sign-off.');
    expect(summaryContent).not.toContain('root-only normalization pass');
  });
});
