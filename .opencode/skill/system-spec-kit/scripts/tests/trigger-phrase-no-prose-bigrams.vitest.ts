import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';
import { filterTriggerPhrases } from '../core/workflow';

const workflowHarness = vi.hoisted(() => ({
  specFolderPath: '',
  contextDir: '',
}));

vi.mock('../spec-folder', () => ({
  detectSpecFolder: vi.fn(async () => workflowHarness.specFolderPath),
  ensureSpecFolderExists: vi.fn(async () => workflowHarness.specFolderPath),
}));

vi.mock('@spec-kit/mcp-server/api/providers', () => ({
  retryManager: {
    getRetryStats: () => ({ queue_size: 0 }),
    processRetryQueue: vi.fn(async () => ({ processed: 0, succeeded: 0, failed: 0 })),
  },
}));

describe('trigger phrase workflow fixes', () => {
  afterEach(() => {
    vi.clearAllMocks();
    workflowHarness.specFolderPath = '';
    workflowHarness.contextDir = '';
  });

  it('filters prose-derived bigram noise without exposing a legacy context filename', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-trigger-bigrams-'));

    try {
      const specFolderPath = path.join(
        tempRoot,
        '.opencode',
        'specs',
        'system-spec-kit',
        '026-graph-and-context-optimization',
        '003-memory-quality-issues',
        '009-trigger-bigram-fixture',
      );
      const memoryDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(memoryDir, { recursive: true });
      fs.writeFileSync(path.join(specFolderPath, 'spec.md'), '# Trigger Bigram Fixture\n', 'utf8');
      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = memoryDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        specFolderArg: specFolderPath,
        collectedData: {
          _source: 'file',
          sessionSummary: 'Implemented the detector provenance taxonomy with additive edge evidence and bounded metadata cleanup.',
          triggerPhrases: ['014 code graph upgrades runtime', 'render quality', 'canonical sources', 'memory save'],
          filesModified: [
            { path: 'scripts/core/workflow.ts', description: 'Stopped prose bigrams from entering trigger_phrases.' },
          ],
        } as unknown as CollectedDataFull,
        silent: true,
      });

      const triggerPhrases = filterTriggerPhrases([
        '014 code graph upgrades runtime',
        'render quality',
        'canonical sources',
        'memory save',
        'taxonomy additive',
        'additive edge',
        'edge evidence',
      ]);

      expect(result.contextDir).toBe(specFolderPath);
      expect(result).not.toHaveProperty('contextFilename');
      expect(result.writtenFiles).toEqual([]);
      expect(triggerPhrases).toEqual([
        'render quality',
        'canonical sources',
        'memory save',
        'taxonomy additive',
        'additive edge',
        'edge evidence',
      ]);
      expect(triggerPhrases).not.toContain('014 code graph upgrades runtime');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
