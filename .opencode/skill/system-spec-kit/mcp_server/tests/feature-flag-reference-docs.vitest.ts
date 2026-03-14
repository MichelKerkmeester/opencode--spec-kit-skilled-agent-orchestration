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
