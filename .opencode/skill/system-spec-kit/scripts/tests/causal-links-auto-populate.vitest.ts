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

afterEach(() => {
  vi.clearAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

describe('causal link auto-population', () => {
  it('adds derived_from and supersedes from the latest planning save in the same packet', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-causal-links-'));

    try {
      const specFolderPath = path.join(
        tempRoot,
        '.opencode',
        'specs',
        'system-spec-kit',
        '026-graph-and-context-optimization',
        '003-memory-quality-issues',
        '010-causal-link-fixture',
      );
      const memoryDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(memoryDir, { recursive: true });
      fs.writeFileSync(path.join(specFolderPath, 'spec.md'), '# Causal Link Fixture\n', 'utf8');
      fs.writeFileSync(path.join(memoryDir, '09-04-26_08-46__planning-save.md'), `---
session_id: "planning-save-1"
title: "Planning Save"
context_type: "planning"
---
# Planning Save
`, 'utf8');

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = memoryDir;

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        specFolderArg: specFolderPath,
        sessionId: 'implementation-save-2',
        collectedData: {
          _source: 'file',
          sessionSummary: 'Implemented the follow-on runtime after the planning save.',
          contextType: 'implementation',
          filesModified: [
            { path: 'scripts/core/memory-metadata.ts', description: 'Auto-populated causal links from prior saves.' },
          ],
          triggerPhrases: ['causal links', 'derived from'],
        } as unknown as CollectedDataFull,
        silent: true,
      });

      const rendered = fs.readFileSync(path.join(result.contextDir, result.contextFilename), 'utf8');

      expect(rendered).toContain('derived_from:');
      expect(rendered).toContain('    - "planning-save-1"');
      expect(rendered).toContain('supersedes:');
      expect(rendered).toContain('    - "planning-save-1"');
    } finally {
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
