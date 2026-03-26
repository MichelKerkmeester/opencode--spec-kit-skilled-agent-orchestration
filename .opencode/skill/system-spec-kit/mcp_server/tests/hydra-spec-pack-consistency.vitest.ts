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
  'mcp_server/lib/governance/scope-governance.ts',
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
    expect(specContent).toContain('describe shared memory as opt-in live access rather than universally enabled rollout');
    expect(specContent).toMatch(/`\d+` files, `\d+` tests, `\d+` skipped, and `\d+` todo/);
    expect(specContent).not.toContain('root-only normalization pass');
    expect(specContent).not.toContain('Editing any phase subfolder under `001-` through `006-`');

    expect(planContent).toContain('all six child phase packs as one coherent documentation set');
    expect(planContent).toContain('shared-space owner enforcement and retention-sweep database routing');
    expect(planContent).toMatch(/The scripts-side targeted multi-CLI closure suite passed `\d+` files and `\d+` tests\./);
    expect(planContent).toContain('Live prompt proof was captured for all five required CLIs');
    expect(planContent).not.toContain('without touching phase subfolders');
    expect(planContent).not.toContain('root-only scope was confirmed');
  });

  it('parent task and checklist references point to the shipped runtime surface', () => {
    const tasksContent = readDoc(parentDocs.tasks);
    const checklistContent = readDoc(parentDocs.checklist);

    for (const reference of runtimeReferences) {
      expect(tasksContent).toContain(reference);
      const runtimePath = path.resolve(__dirname, '..', reference.replace(/^mcp_server\//, ''));
      expect(fs.existsSync(runtimePath), `Runtime reference should exist: ${reference}`).toBe(true);
    }

    for (const reference of staleReferences) {
      expect(globPatternToRegex(reference).test(tasksContent)).toBe(false);

      if (!reference.includes('*')) {
        const stalePath = path.resolve(__dirname, '..', reference.replace(/^mcp_server\//, ''));
        expect(fs.existsSync(stalePath), `Stale reference should NOT exist: ${reference}`).toBe(false);
      }
    }

    expect(tasksContent).toContain('.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md');
    expect(tasksContent).toContain('.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md');
    expect(tasksContent).toContain('Fix retention sweeps so deletion uses the passed database handle');
    expect(checklistContent).toMatch(/\*\*Verification Date\*\*: \d{4}-\d{2}-\d{2}/);
    expect(checklistContent).toContain('Hydra follow-up verification passed across targeted governed-retrieval, shared-space admin, graph-ranking, and retention regressions');
    expect(checklistContent).toMatch(/`\d+` passed files, `\d+` passed tests, `\d+` skipped, and `\d+` todo/);
    expect(checklistContent).toContain('Live prompt proof was captured for all five CLIs with timestamps');
  });

  it('feature catalog and manual playbook links used by the Hydra phases resolve', () => {
    for (const docPath of featureCatalogDocs) {
      expect(fs.existsSync(docPath)).toBe(true);
    }

    const playbookPath = path.join(SKILL_ROOT, 'manual_testing_playbook', 'manual_testing_playbook.md');
    const playbookContent = readDoc(playbookPath);

    expect(playbookContent).toContain('### 121 | Adaptive shadow proposal and rollback (Phase 4)');
    expect(playbookContent).toContain('### 122 | Governed ingest and scope isolation (Phase 5)');
    expect(playbookContent).toContain('### 123 | Shared-space deny-by-default rollout (Phase 6)');
    expect(playbookContent).toContain('### 125 | Hydra roadmap capability flags');
    expect(playbookContent).toContain('### 129 | Lineage state active projection and asOf resolution');
    expect(playbookContent).toContain('### 130 | Lineage backfill rollback drill');
    expect(playbookContent).toContain('### 142 | Session transition trace contract');
    expect(playbookContent).toContain('### 143 | Bounded graph-walk rollout and diagnostics');
    expect(playbookContent).toContain('### 144 | Advisory ingest lifecycle forecast');
  });

  it('implementation summary records the closure verification set and corrected runtime boundaries', () => {
    const summaryContent = readDoc(parentDocs.implementationSummary);

    expect(summaryContent).toContain('Hydra closure pass now leaves the parent pack and all six phase packs');
    expect(summaryContent).toContain('owner-only shared-space operations now enforce explicit actor identity plus owner authorization');
    expect(summaryContent).toContain('The earlier retention sweep database-handle fix remains in place, so retention sweeps now delete through the passed database handle');
    expect(summaryContent).toContain('npm run test:hydra:phase1');
    expect(summaryContent).toContain('npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts');
    expect(summaryContent).toMatch(/PASS \(`\d+` tests\)/);
    expect(summaryContent).toMatch(/PASS \(`\d+` passed files, `\d+` passed tests, `\d+` skipped, `\d+` todo\)/);
    expect(summaryContent).toMatch(/PASS \(`\d+` files, `\d+` tests\)/);
    expect(summaryContent).toContain('Require live prompt proof for all five CLIs before closure sign-off.');
    expect(summaryContent).not.toContain('root-only normalization pass');
  });
});
