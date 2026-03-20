import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

const MCP_SERVER_ROOT = path.join(__dirname, '..');
const SKILL_ROOT = path.join(MCP_SERVER_ROOT, '..');
const FEATURE_FLAG_DOCS = path.join(SKILL_ROOT, 'feature_catalog', '19--feature-flag-reference');

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolveSourcePath(relativePath: string): string {
  if (relativePath.startsWith('shared/')) {
    return path.join(SKILL_ROOT, relativePath);
  }
  return path.join(MCP_SERVER_ROOT, relativePath);
}

const mappingChecks = [
  {
    doc: '01-1-search-pipeline-features-speckit.md',
    env: 'SPECKIT_ABLATION',
    source: 'lib/eval/ablation-framework.ts',
  },
  {
    doc: '01-1-search-pipeline-features-speckit.md',
    env: 'SPECKIT_RRF',
    source: 'shared/algorithms/rrf-fusion.ts',
  },
  {
    doc: '01-1-search-pipeline-features-speckit.md',
    env: 'SPECKIT_LAZY_LOADING',
    source: 'shared/embeddings.ts',
  },
  {
    doc: '01-1-search-pipeline-features-speckit.md',
    env: 'SPECKIT_EAGER_WARMUP',
    source: 'shared/embeddings.ts',
  },
  {
    doc: '04-4-memory-and-storage.md',
    env: 'MEMORY_DB_DIR',
    source: 'lib/search/vector-index-store.ts',
  },
  {
    doc: '04-4-memory-and-storage.md',
    env: 'MEMORY_DB_PATH',
    source: 'lib/search/vector-index-store.ts',
  },
  {
    doc: '05-5-embedding-and-api.md',
    env: 'EMBEDDINGS_PROVIDER',
    source: 'shared/embeddings/factory.ts',
  },
  {
    doc: '05-5-embedding-and-api.md',
    env: 'EMBEDDING_DIM',
    source: 'lib/search/vector-index-store.ts',
  },
];

const hydraDefaultDocs = [
  '01-1-search-pipeline-features-speckit.md',
  '06-6-debug-and-telemetry.md',
] as const;

describe('Feature flag reference catalog mappings', () => {
  for (const check of mappingChecks) {
    it(`${check.env} maps to ${check.source} and the source reads the symbol`, () => {
      const docPath = path.join(FEATURE_FLAG_DOCS, check.doc);
      const docContent = fs.readFileSync(docPath, 'utf8');
      const rowPattern = new RegExp(
        `\\|\\s+\`${escapeRegExp(check.env)}\`\\s+\\|[^\\n]*\\|\\s+\`${escapeRegExp(check.source)}\`\\s+\\|`,
      );

      expect(docContent).toMatch(rowPattern);

      const sourcePath = resolveSourcePath(check.source);
      expect(fs.existsSync(sourcePath)).toBe(true);

      const sourceContent = fs.readFileSync(sourcePath, 'utf8');
      expect(sourceContent).toContain(check.env);
    });
  }
});

describe('Hydra roadmap flag documentation', () => {
  for (const doc of hydraDefaultDocs) {
    it(`${doc} reflects the delivered default-on Hydra roadmap behavior`, () => {
      const docPath = path.join(FEATURE_FLAG_DOCS, doc);
      const docContent = fs.readFileSync(docPath, 'utf8');

      expect(docContent).toContain('| `SPECKIT_HYDRA_PHASE` | `shared-rollout` |');
      expect(docContent).toMatch(/(?:unknown|Unsupported) values fall back to `shared-rollout`/);

      for (const env of [
        'SPECKIT_HYDRA_LINEAGE_STATE',
        'SPECKIT_HYDRA_GRAPH_UNIFIED',
        'SPECKIT_HYDRA_ADAPTIVE_RANKING',
        'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
        'SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS',
        'SPECKIT_HYDRA_SHARED_MEMORY',
      ]) {
        expect(docContent).toContain(`| \`${env}\` | \`true\` |`);
      }
    });
  }

  it('manual playbook NEW-125 matches the runtime default-on plus explicit opt-out contract', () => {
    const playbookPath = path.join(SKILL_ROOT, 'manual_testing_playbook', 'manual_testing_playbook.md');
    const featureFilePath = path.join(
      SKILL_ROOT,
      'manual_testing_playbook',
      '19--feature-flag-reference',
      '125-hydra-roadmap-capability-flags.md',
    );
    const playbookContent = fs.readFileSync(playbookPath, 'utf8');
    const featureFileContent = fs.readFileSync(featureFilePath, 'utf8');

    expect(playbookContent).toContain('NEW-125');
    expect(playbookContent).toContain('default-on unless explicitly opted out');
    expect(playbookContent).toContain('capabilities.graphUnified:true');

    expect(featureFileContent).toContain('phase:\\"shared-rollout\\"');
    expect(featureFileContent).toContain('capabilities.graphUnified:true');
    expect(featureFileContent).toContain('SPECKIT_HYDRA_GRAPH_UNIFIED=false');
    expect(featureFileContent).toContain('capabilities.graphUnified:false');
  });
});
