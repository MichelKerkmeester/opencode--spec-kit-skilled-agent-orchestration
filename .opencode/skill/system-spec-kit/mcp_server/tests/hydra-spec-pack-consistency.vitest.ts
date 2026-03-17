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
  'mcp_server/lib/storage/lineage-state.ts',
  'mcp_server/lib/cognitive/adaptive-ranking.ts',
  'mcp_server/lib/governance/scope-governance.ts',
  'mcp_server/lib/collab/shared-spaces.ts',
  'mcp_server/handlers/shared-memory.ts',
  'mcp_server/tests/memory-lineage-state.vitest.ts',
  'mcp_server/tests/memory-lineage-backfill.vitest.ts',
  'mcp_server/tests/shared-spaces.vitest.ts',
  'mcp_server/tests/memory-governance.vitest.ts',
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

describe('Hydra spec-pack truth sync', () => {
  it('parent spec and plan describe delivered runtime behavior without stale roadmap disclaimers', () => {
    const specContent = readDoc(parentDocs.spec);
    const planContent = readDoc(parentDocs.plan);

    expect(specContent).toContain('records the delivered Level 3 HydraDB-inspired memory-state implementation');
    expect(specContent).toContain('The six planned phases are shipped in the live runtime');
    expect(specContent).toContain('does not claim a standalone public `memory_query` MCP tool is shipped');
    expect(specContent).not.toContain('planning artifact for future implementation');
    expect(specContent).not.toContain('implementation-pending');

    expect(planContent).toContain('records the delivered HydraDB-inspired implementation');
    expect(planContent).toContain('Local re-verification was rerun on 2026-03-16');
    expect(planContent).not.toContain('future implementation phases');
    expect(planContent).not.toContain('This planning phase does not claim these tests have been executed.');
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
      expect(tasksContent).not.toContain(reference);
    }

    expect(tasksContent).toContain('no public `memory_query` MCP tool claim');
    expect(checklistContent).toContain('Verification Date: 2026-03-16');
    expect(checklistContent).toContain('Hydra spec-pack documentation consistency is now covered by a dedicated regression test');
    expect(checklistContent).toContain('tests/file-watcher.vitest.ts` 20/20 passed');
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

  it('implementation summary records the truth-sync verification set', () => {
    const summaryContent = readDoc(parentDocs.implementationSummary);

    expect(summaryContent).toContain('Parent spec-pack truth-sync plus re-verification');
    expect(summaryContent).toContain('tests/hydra-spec-pack-consistency.vitest.ts');
    expect(summaryContent).toContain('npm run test:hydra:phase1');
    expect(summaryContent).toContain('npx vitest run tests/feature-flag-reference-docs.vitest.ts tests/hydra-spec-pack-consistency.vitest.ts');
    expect(summaryContent).toContain('tests/file-watcher.vitest.ts` 20/20 passed');
    expect(summaryContent).toContain('roadmap metadata defaults all six capabilities on');
    expect(summaryContent).toContain('shared memory remains default-off until explicitly enabled');
    expect(summaryContent).not.toContain('shared memory remain default-on with explicit opt-out semantics');
  });
});
