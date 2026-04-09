import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../core/memory-indexer', () => ({
  indexMemory: vi.fn(async () => 42),
  updateMetadataEmbeddingStatus: vi.fn(async () => true),
}));

vi.mock('@spec-kit/mcp-server/api/providers', () => ({
  retryManager: {
    getRetryStats: () => ({ queue_size: 0 }),
    processRetryQueue: vi.fn(async () => ({ processed: 0, succeeded: 0, failed: 0 })),
  },
}));

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '..', '..', '..', '..', '..');
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'post-save-render', 'test-packet');
const TEMP_DIRS: string[] = [];

function parseFrontmatter(content: string): string {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match?.[1] ?? '';
}

function parseTriggerPhrases(frontmatter: string): string[] {
  const lines = frontmatter.split('\n');
  const startIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
  if (startIndex === -1) {
    return [];
  }

  const phrases: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index++) {
    const line = lines[index];
    if (!line.startsWith('  - ')) {
      break;
    }
    phrases.push(line.replace(/^  - /, '').replace(/^"|"$/g, '').toLowerCase());
  }
  return phrases;
}

function extractSection(content: string, heading: string): string {
  const match = content.match(new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?:\\n<!-- \\/ANCHOR:|\\n## |$)`));
  return match?.[1]?.trim() ?? '';
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(async () => {
  await Promise.all(TEMP_DIRS.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('post-save render round trip', () => {
  it('writes a fresh memory save that satisfies the wrapper render contract', { timeout: 60000 }, async () => {
    const specFolderRelative = path.join(
      '.opencode',
      'specs',
      'system-spec-kit',
      '026-graph-and-context-optimization',
      '003-memory-quality-issues',
      '099-post-save-render-roundtrip-fixture',
    );
    const specFolderPath = path.join(REPO_ROOT, specFolderRelative);
    TEMP_DIRS.push(specFolderPath);
    await fs.rm(specFolderPath, { recursive: true, force: true });
    await fs.cp(FIXTURE_DIR, specFolderPath, { recursive: true });

    const payload = JSON.stringify({
      specFolder: specFolderRelative,
      sessionSummary: 'Implemented the render-layer fixes for canonical sources, trigger phrases, evidence bullets, phase capture, and score naming.',
      triggerPhrases: ['canonical sources', 'render quality', 'memory save'],
      keyDecisions: [
        {
          decision: 'Use authored trigger phrases as the canonical trigger surface.',
          rationale: 'Auto-extracted prose bigrams were adding noise to frontmatter.',
        },
      ],
      evidenceBullets: [
        'scripts/core/workflow.ts:1260 manual trigger phrases now outrank prose bigrams.',
        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
      ],
      filesModified: [
        { path: 'scripts/core/workflow.ts', description: 'Fixed trigger and metadata render bindings.' },
        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed canonical discovery and counts.' },
        { path: 'scripts/core/memory-metadata.ts', description: 'Fixed parent spec and lineage metadata.' },
      ],
      contextType: 'implementation',
      phase: 'IMPLEMENTATION',
      status: 'COMPLETED',
      completionPercent: 100,
      repositoryState: 'clean',
      headRef: 'main',
      commitRef: 'abc1234',
    });

    const { main } = await import('../memory/generate-context');
    await main(['--json', payload, specFolderRelative]);

    const memoryDir = path.join(specFolderPath, 'memory');
    const memoryFiles = (await fs.readdir(memoryDir)).filter((entry) => entry.endsWith('.md')).sort();
    expect(memoryFiles.length).toBeGreaterThan(0);

    const rendered = await fs.readFile(path.join(memoryDir, memoryFiles[memoryFiles.length - 1]), 'utf8');
    const metadata = JSON.parse(await fs.readFile(path.join(memoryDir, 'metadata.json'), 'utf8')) as Record<string, unknown>;
    const frontmatter = parseFrontmatter(rendered);
    const overview = extractSection(rendered, 'OVERVIEW');
    const evidence = extractSection(rendered, 'DISTINGUISHING EVIDENCE');

    expect(frontmatter).not.toMatch(/\[[^/\]]+\/[^\]]+\]/);
    expect(rendered).toContain('- **Review Report**: [review-report.md](./review/review-report.md)');
    expect(rendered).toContain('- **Decision Record**: [decision-record.md](./decision-record.md)');
    expect(rendered).toContain('- **Implementation Summary**: [implementation-summary.md](./implementation-summary.md)');
    expect(overview).toContain('Implemented the render-layer fixes for canonical sources');
    expect(evidence).toContain('scripts/core/workflow.ts:1260');
    expect(evidence).toContain('scripts/extractors/collect-session-data.ts:1176');
    expect((evidence.match(/scripts\/extractors\/collect-session-data\.ts:1176/g) ?? []).length).toBe(1);
    expect(parseTriggerPhrases(frontmatter)).toEqual(['canonical sources', 'render quality', 'memory save']);
    expect(rendered).toContain('| Session Status | COMPLETED |');
    expect(rendered).toContain('| Completion % | 100% |');
    expect(frontmatter).toContain('captured_file_count: 3');
    expect(frontmatter).toContain('filesystem_file_count: 3');
    expect(frontmatter).toContain('git_changed_file_count: 3');
    expect(rendered).toMatch(/derived_from:\s*\n(?:\s*\n)?\s*\[\]/);
    expect(rendered).not.toContain(`parent_spec: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/099-post-save-render-roundtrip-fixture"`);
    expect(rendered).toContain('parent_spec: "system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues"');
    expect(frontmatter).toContain('render_quality_score:');
    expect(metadata).toMatchObject({
      filtering: expect.objectContaining({
        input_completeness_score: expect.any(Number),
      }),
    });
  });
});
