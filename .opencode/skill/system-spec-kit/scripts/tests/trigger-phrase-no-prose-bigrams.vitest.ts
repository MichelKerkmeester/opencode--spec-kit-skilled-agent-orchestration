import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectedDataFull } from '../extractors/collect-session-data';

const workflowHarness = vi.hoisted(() => ({
  specFolderPath: '',
  contextDir: '',
}));

vi.mock('../spec-folder', () => ({
  detectSpecFolder: vi.fn(async () => workflowHarness.specFolderPath),
  setupContextDirectory: vi.fn(async () => workflowHarness.contextDir),
}));

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

function parseFrontmatterTriggerPhrases(content: string): string[] {
  const lines = content.split('\n');
  const triggerIndex = lines.findIndex((line) => line.trim() === 'trigger_phrases:');
  if (triggerIndex === -1) {
    return [];
  }

  const phrases: string[] = [];
  for (let index = triggerIndex + 1; index < lines.length; index++) {
    const line = lines[index];
    if (!line.startsWith('  - ')) {
      break;
    }
    phrases.push(line.replace(/^  - /, '').replace(/^"|"$/g, '').toLowerCase());
  }
  return phrases;
}

describe('trigger phrase render fixes', () => {
  afterEach(() => {
    vi.clearAllMocks();
    workflowHarness.specFolderPath = '';
    workflowHarness.contextDir = '';
  });

  it('keeps authored trigger phrases and drops prose-derived bigram noise', async () => {
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
          triggerPhrases: ['render quality', 'canonical sources', 'memory save'],
          filesModified: [
            { path: 'scripts/core/workflow.ts', description: 'Stopped prose bigrams from entering trigger_phrases.' },
          ],
        } as unknown as CollectedDataFull,
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf8');
      const triggerPhrases = parseFrontmatterTriggerPhrases(rendered);

      expect(triggerPhrases).toEqual(['render quality', 'canonical sources', 'memory save']);
      expect(triggerPhrases).not.toContain('taxonomy additive');
      expect(triggerPhrases).not.toContain('additive edge');
      expect(triggerPhrases).not.toContain('edge evidence');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
