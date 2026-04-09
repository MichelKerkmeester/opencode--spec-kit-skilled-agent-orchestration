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

function parseFrontmatterValue(content: string, key: string): string {
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const match = frontmatter.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return match?.[1] ?? '';
}

async function readLatestMemory(specFolderPath: string): Promise<string> {
  const memoryDir = path.join(specFolderPath, 'memory');
  const memoryFiles = (await fs.readdir(memoryDir)).filter((entry) => entry.endsWith('.md')).sort();
  return fs.readFile(path.join(memoryDir, memoryFiles[memoryFiles.length - 1]), 'utf8');
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(async () => {
  await Promise.all(TEMP_DIRS.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
  vi.restoreAllMocks();
});

describe('memory save title/description overrides', () => {
  it('renders explicit title and description verbatim with no unknown-field warnings', { timeout: 60000 }, async () => {
    const specFolderRelative = path.join(
      '.opencode',
      'specs',
      'system-spec-kit',
      '026-graph-and-context-optimization',
      '003-memory-quality-issues',
      '100-title-description-override-fixture',
    );
    const specFolderPath = path.join(REPO_ROOT, specFolderRelative);
    TEMP_DIRS.push(specFolderPath);
    await fs.rm(specFolderPath, { recursive: true, force: true });
    await fs.cp(FIXTURE_DIR, specFolderPath, { recursive: true });

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { main } = await import('../memory/generate-context');
    await main([
      '--json',
      JSON.stringify({
        specFolder: specFolderRelative,
        sessionSummary: 'Patched the structured memory-save schema so explicit authored metadata wins.',
        title: 'Authored Memory Save Title That Must Survive',
        description: 'Authored description that must survive the structured JSON contract without truncation or fallback rewriting.',
        triggerPhrases: ['authored metadata override', 'structured json save'],
      }),
      specFolderRelative,
    ]);

    const rendered = await readLatestMemory(specFolderPath);

    expect(parseFrontmatterValue(rendered, 'title')).toBe('Authored Memory Save Title That Must Survive');
    expect(parseFrontmatterValue(rendered, 'description')).toBe(
      'Authored description that must survive the structured JSON contract without truncation or fallback rewriting.',
    );
    expect(rendered).toContain('# Authored Memory Save Title That Must Survive');
    expect(rendered).toMatch(/## MEMORY METADATA[\s\S]*title:\s*"?Authored Memory Save Title That Must Survive"?/);
    expect(warnSpy.mock.calls.flat().join('\n')).not.toContain('Unknown field in input data: "title"');
    expect(warnSpy.mock.calls.flat().join('\n')).not.toContain('Unknown field in input data: "description"');
  });

  it('keeps auto-generated title behavior when no explicit title is provided', { timeout: 60000 }, async () => {
    const specFolderRelative = path.join(
      '.opencode',
      'specs',
      'system-spec-kit',
      '026-graph-and-context-optimization',
      '003-memory-quality-issues',
      '101-title-fallback-fixture',
    );
    const specFolderPath = path.join(REPO_ROOT, specFolderRelative);
    TEMP_DIRS.push(specFolderPath);
    await fs.rm(specFolderPath, { recursive: true, force: true });
    await fs.cp(FIXTURE_DIR, specFolderPath, { recursive: true });

    const { main } = await import('../memory/generate-context');
    await main([
      '--json',
      JSON.stringify({
        specFolder: specFolderRelative,
        sessionSummary: 'Implemented a fallback save path for the title builder when explicit title is absent.',
        description: 'Fallback description is still explicit here, but the title should be auto-generated.',
        triggerPhrases: ['title fallback verification'],
      }),
      specFolderRelative,
    ]);

    const rendered = await readLatestMemory(specFolderPath);
    const generatedTitle = parseFrontmatterValue(rendered, 'title');

    expect(generatedTitle.length).toBeGreaterThan(0);
    expect(generatedTitle).not.toBe('Authored Memory Save Title That Must Survive');
    expect(rendered).toContain(`# ${generatedTitle}`);
  });
});
