import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';
import { findPredecessorMemory } from '../core/find-predecessor-memory';

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
const TEMP_BASE_DIR = path.join(TEST_DIR, '.tmp-phase4-pr7');
const createdTempRoots = new Set<string>();

async function createFixtureSpecFolder(caseName: 'hit' | 'miss' | 'ambiguity'): Promise<string> {
  await fsp.mkdir(TEMP_BASE_DIR, { recursive: true });
  const tempRoot = await fsp.mkdtemp(path.join(TEMP_BASE_DIR, `speckit-phase4-pr7-${caseName}-`));
  const leafNameByCase = {
    hit: '005-f-ac5-hit',
    miss: '006-f-ac5-miss',
    ambiguity: '007-f-ac5-ambiguity',
  } as const;
  const specFolderPath = path.join(
    tempRoot,
    '.opencode',
    'specs',
    'system-spec-kit',
    '026-graph-and-context-optimization',
    '003-memory-quality-issues',
    leafNameByCase[caseName],
  );

  await fsp.mkdir(path.dirname(specFolderPath), { recursive: true });
  await fsp.cp(path.join(FIXTURE_ROOT, caseName), specFolderPath, { recursive: true });
  createdTempRoots.add(tempRoot);
  return specFolderPath;
}

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    Array.from(createdTempRoots, async (tempRoot) => {
      await fsp.rm(tempRoot, { recursive: true, force: true });
      createdTempRoots.delete(tempRoot);
    }),
  );
});

describe('Phase 4 PR-7 predecessor discovery', () => {
  it('returns the exact predecessor when continuation lineage supplies a matching source session id', async () => {
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

  it('returns null when a continuation save has no valid predecessor session id to attach', async () => {
    const specFolderPath = await createFixtureSpecFolder('miss');

    const predecessor = await findPredecessorMemory(specFolderPath, {
      title: 'Continuation Deep Research Run',
      summary: 'Continuation request with no usable predecessor header.',
      sessionId: 'miss-current-2',
      filename: '06-04-26_10-00__continuation-deep-research-run.md',
    });

    expect(predecessor).toBeNull();
  });

  it('returns null when two predecessor candidates tie as equally plausible', async () => {
    const specFolderPath = await createFixtureSpecFolder('ambiguity');

    const predecessor = await findPredecessorMemory(specFolderPath, {
      title: 'Continuation Deep Research Run',
      summary: 'Continuation request with two equally recent predecessors.',
      sessionId: 'ambiguity-current-3',
      filename: '06-04-26_10-00__continuation-deep-research-run.md',
    });

    expect(predecessor).toBeNull();
  });

  it('renders causal_links.supersedes into the saved memory on the hit path', async () => {
    const specFolderPath = await createFixtureSpecFolder('hit');
    const specRelativePath = 'system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/005-f-ac5-hit';
    const { CONFIG } = await import('../core');
    const previousProjectRoot = CONFIG.PROJECT_ROOT;
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const previousDataFile = CONFIG.DATA_FILE;
    const previousSpecFolderArg = CONFIG.SPEC_FOLDER_ARG;

    const projectRoot = specFolderPath.split(`${path.sep}.opencode${path.sep}specs${path.sep}`)[0];

    try {
      CONFIG.PROJECT_ROOT = projectRoot;
      CONFIG.TEMPLATE_DIR = TEMPLATE_DIR;
      CONFIG.DATA_FILE = null;
      CONFIG.SPEC_FOLDER_ARG = null;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        specFolderArg: specFolderPath,
        sessionId: 'hit-current-3',
        collectedData: {
          _source: 'file',
          _sourceSessionId: 'hit-predecessor-1',
          spec_folder: specRelativePath,
          sessionSummary: 'Extended continuation run for the lineage fixture.',
          userPrompts: [
            {
              prompt: 'Extend the deep research run and preserve lineage.',
              timestamp: '2026-04-06T13:00:00.000Z',
            },
          ],
          observations: [
            {
              type: 'implementation',
              title: 'Lineage continuation proof',
              narrative: 'The save should inherit the predecessor session id before render.',
              facts: ['Touched workflow.ts immediately before causal link render.'],
              files: ['.opencode/skill/system-spec-kit/scripts/core/workflow.ts'],
            },
          ],
          keyDecisions: [
            {
              decision: 'Use bounded header reads for predecessor discovery',
              rationale: 'The helper must stay inside the measured PR-7 envelope.',
            },
          ],
          filesModified: [
            {
              path: '.opencode/skill/system-spec-kit/scripts/core/workflow.ts',
              action: 'modified',
              description: 'Inject predecessor discovery before causal link render.',
            },
          ],
          triggerPhrases: ['phase 4 pr7', 'auto supersedes'],
        } as unknown as CollectedDataFull,
        silent: true,
      });

      const rendered = await fsp.readFile(path.join(result.contextDir, result.contextFilename), 'utf8');

      expect(rendered).toContain('causal_links:');
      expect(rendered).toContain('supersedes:');
      expect(rendered).toContain('    - "hit-predecessor-1"');
    } finally {
      CONFIG.PROJECT_ROOT = previousProjectRoot;
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      CONFIG.DATA_FILE = previousDataFile;
      CONFIG.SPEC_FOLDER_ARG = previousSpecFolderArg;
    }
  });
});
