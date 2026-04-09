import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { findPredecessorMemory } from '../core/find-predecessor-memory';
import { reviewPostSaveQuality } from '../core/post-save-review';

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
const FIXTURE_ROOT = path.join(TEST_DIR, 'fixtures', 'memory-quality', 'F-AC5-lineage');
const TEMPLATE_DIR = path.resolve(TEST_DIR, '..', '..', 'templates');
const TEMP_ROOTS = new Set<string>();

async function createFixtureSpecFolder(caseName: 'hit' | 'ambiguity'): Promise<string> {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), `speckit-d5-${caseName}-`));
  TEMP_ROOTS.add(tempRoot);
  const specFolderPath = path.join(
    tempRoot,
    '.opencode',
    'specs',
    'system-spec-kit',
    '026-graph-and-context-optimization',
    '003-memory-quality-issues',
    caseName === 'hit' ? '005-f-ac5-hit' : '007-f-ac5-ambiguity',
  );

  await fs.mkdir(path.dirname(specFolderPath), { recursive: true });
  await fs.cp(path.join(FIXTURE_ROOT, caseName), specFolderPath, { recursive: true });
  return specFolderPath;
}

async function readLatestMemory(specFolderPath: string): Promise<{ path: string; content: string }> {
  const memoryDir = path.join(specFolderPath, 'memory');
  const memoryFiles = (await fs.readdir(memoryDir)).filter((entry) => entry.endsWith('.md')).sort();
  const latestPath = path.join(memoryDir, memoryFiles[memoryFiles.length - 1]);
  return {
    path: latestPath,
    content: await fs.readFile(latestPath, 'utf8'),
  };
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(async () => {
  await Promise.all(Array.from(TEMP_ROOTS, async (root) => {
    await fs.rm(root, { recursive: true, force: true });
    TEMP_ROOTS.delete(root);
  }));
  vi.restoreAllMocks();
});

describe('D5 continuation and causal links', () => {
  it('passes explicit causalLinks.supersedes through the save path and avoids D5 warnings', async () => {
    const specFolderPath = await createFixtureSpecFolder('hit');
    const projectRoot = specFolderPath.split(`${path.sep}.opencode${path.sep}specs${path.sep}`)[0];

    const { CONFIG } = await import('../core');
    const previousProjectRoot = CONFIG.PROJECT_ROOT;
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const previousDataFile = CONFIG.DATA_FILE;
    const previousSpecFolderArg = CONFIG.SPEC_FOLDER_ARG;

    try {
      CONFIG.PROJECT_ROOT = projectRoot;
      CONFIG.TEMPLATE_DIR = TEMPLATE_DIR;
      CONFIG.DATA_FILE = null;
      CONFIG.SPEC_FOLDER_ARG = null;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        specFolderArg: specFolderPath,
        silent: true,
        collectedData: {
          _source: 'file',
          saveMode: 'json',
          sessionSummary: 'Continuation verification for explicit causal links.',
          title: 'Continuation verification packet',
          description: 'Continuation verification that must preserve explicit lineage.',
          userPrompts: [{ prompt: 'Save the continuation packet', timestamp: '2026-04-09T20:00:00.000Z' }],
          observations: [{ type: 'implementation', title: 'Explicit lineage', narrative: 'Keep authored supersedes.', facts: [] }],
          causalLinks: { supersedes: ['explicit-predecessor-session'] },
          triggerPhrases: ['explicit lineage verification'],
        },
      });

      const rendered = await fs.readFile(path.join(result.contextDir, result.contextFilename), 'utf8');
      expect(rendered).toContain('supersedes:');
      expect(rendered).toContain('"explicit-predecessor-session"');

      const review = reviewPostSaveQuality({
        savedFilePath: path.join(result.contextDir, result.contextFilename),
        content: rendered,
        inputMode: 'file',
        collectedData: {
          _source: 'file',
          saveMode: 'json',
          sessionSummary: 'Continuation verification for explicit causal links.',
          title: 'Continuation verification packet',
          description: 'Continuation verification that must preserve explicit lineage.',
          causalLinks: { supersedes: ['explicit-predecessor-session'] },
        },
      });

      expect(review.issues.find((issue) => issue.checkId === 'D5')).toBeUndefined();
    } finally {
      CONFIG.PROJECT_ROOT = previousProjectRoot;
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      CONFIG.DATA_FILE = previousDataFile;
      CONFIG.SPEC_FOLDER_ARG = previousSpecFolderArg;
    }
  });

  it('auto-populates a predecessor for continuation titles when there is one clear candidate', async () => {
    const specFolderPath = await createFixtureSpecFolder('hit');

    const predecessor = await findPredecessorMemory(specFolderPath, {
      title: 'Extended Deep Research Phase 003',
      summary: 'Extended continuation run for the lineage fixture.',
      sessionId: 'hit-current-3',
      filename: '06-04-26_13-00__extended-deep-research-phase-003.md',
      sourceSessionId: 'hit-predecessor-1',
    });

    expect(predecessor).toBe('hit-predecessor-1');
  });

  it('uses description-aware continuation fallback when the title is generic', async () => {
    const specFolderPath = await createFixtureSpecFolder('hit');

    const predecessor = await findPredecessorMemory(specFolderPath, {
      title: 'Implementation session',
      description: 'Continuation run for the lineage fixture with a weak title.',
      summary: 'This save extends the prior implementation packet.',
      sessionId: 'hit-current-4',
      filename: '06-04-26_13-30__implementation-session.md',
      sourceSessionId: 'hit-predecessor-1',
    });

    expect(predecessor).toBe('hit-predecessor-1');
  });

  it('stays silent when there is no continuation signal anywhere', async () => {
    const filePath = path.join(os.tmpdir(), `speckit-d5-silent-${Date.now()}.md`);
    TEMP_ROOTS.add(filePath);
    await fs.writeFile(filePath, `---
title: Regular implementation session
description: Regular implementation summary with no lineage signal.
importance_tier: important
context_type: implementation
trigger_phrases:
  - implementation summary
---

# Regular implementation session

## MEMORY METADATA

\`\`\`yaml
decision_count: 1
supersedes: []
\`\`\`
`, 'utf8');

    const review = reviewPostSaveQuality({
      savedFilePath: filePath,
      inputMode: 'file',
      collectedData: {
        _source: 'file',
        saveMode: 'json',
        sessionSummary: 'Regular implementation summary with no lineage signal.',
      },
    });

    expect(review.issues.find((issue) => issue.checkId === 'D5')).toBeUndefined();
  });

  it('skips auto-population on ambiguity but reviewer still emits D5 guidance', async () => {
    const specFolderPath = await createFixtureSpecFolder('ambiguity');
    const projectRoot = specFolderPath.split(`${path.sep}.opencode${path.sep}specs${path.sep}`)[0];

    const { CONFIG } = await import('../core');
    const previousProjectRoot = CONFIG.PROJECT_ROOT;
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const previousDataFile = CONFIG.DATA_FILE;
    const previousSpecFolderArg = CONFIG.SPEC_FOLDER_ARG;

    try {
      CONFIG.PROJECT_ROOT = projectRoot;
      CONFIG.TEMPLATE_DIR = TEMPLATE_DIR;
      CONFIG.DATA_FILE = null;
      CONFIG.SPEC_FOLDER_ARG = null;

      const { runWorkflow } = await import('../core/workflow');
      await runWorkflow({
        specFolderArg: specFolderPath,
        silent: true,
        collectedData: {
          _source: 'file',
          saveMode: 'json',
          sessionSummary: 'Continuation request with two equally recent predecessors.',
          title: 'Continuation Deep Research Run',
          userPrompts: [{ prompt: 'Continue the deep research run', timestamp: '2026-04-06T10:00:00.000Z' }],
          observations: [{ type: 'implementation', title: 'Continuation proof', narrative: 'This save should warn when lineage is ambiguous.', facts: [] }],
          triggerPhrases: ['continuation deep research'],
        },
      });

      const latest = await readLatestMemory(specFolderPath);
      const review = reviewPostSaveQuality({
        savedFilePath: latest.path,
        content: latest.content,
        inputMode: 'file',
        collectedData: {
          _source: 'file',
          saveMode: 'json',
          sessionSummary: 'Continuation request with two equally recent predecessors.',
          title: 'Continuation Deep Research Run',
        },
      });

      expect(review.issues.find((issue) => issue.checkId === 'D5')?.message).toContain('continuation signal matched');
    } finally {
      CONFIG.PROJECT_ROOT = previousProjectRoot;
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      CONFIG.DATA_FILE = previousDataFile;
      CONFIG.SPEC_FOLDER_ARG = previousSpecFolderArg;
    }
  });
});
