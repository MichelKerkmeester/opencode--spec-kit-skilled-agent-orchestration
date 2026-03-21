import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SessionData } from '../types/session-types';
import { updateMetadataEmbeddingStatus } from '../core/memory-indexer';

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

function createSessionData(specFolderName: string): SessionData {
  return {
    TITLE: 'Workflow Warning Regression',
    DATE: '06-03-26',
    TIME: '09-30',
    SPEC_FOLDER: specFolderName,
    DURATION: '4m',
    SUMMARY: 'Verifies workflow warnings when metadata persistence fails.',
    FILES: [
      {
        FILE_PATH: 'scripts/core/workflow.ts',
        DESCRIPTION: 'Exercised metadata status persistence failure handling.',
        ACTION: 'Modified',
      },
    ],
    HAS_FILES: true,
    FILE_COUNT: 1,
    CAPTURED_FILE_COUNT: 1,
    FILESYSTEM_FILE_COUNT: 1,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [{ OUTCOME: 'Workflow should surface a warning without failing the save.', TYPE: 'status' }],
    TOOL_COUNT: 1,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'Workflow warning regression',
    SKILL_VERSION: '1.7.2',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: 'session-workflow-warning',
    CHANNEL: 'test',
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'implementation',
    CREATED_AT_EPOCH: 1_772_755_800,
    LAST_ACCESSED_EPOCH: 1_772_755_800,
    EXPIRES_AT_EPOCH: 1_780_531_800,
    TOOL_COUNTS: { Read: 1, Edit: 0, Write: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
    DECISION_COUNT: 0,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1,
    PROJECT_PHASE: 'IMPLEMENTATION',
    ACTIVE_FILE: 'scripts/core/workflow.ts',
    LAST_ACTION: 'Checked workflow warning propagation.',
    NEXT_ACTION: 'Keep the warning visible to callers.',
    BLOCKERS: 'None',
    STATUS: 'active',
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

describe('workflow metadata persistence warnings', () => {
  it('adds a warning to the workflow result when metadata persistence returns false', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-warning-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');

    try {
      const specFolderPath = path.join(tempRoot, '016-metadata-persistence-warning');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        ['---', 'title: "Spec: Metadata Persistence Warning"', '---', '# Spec'].join('\n'),
        'utf-8'
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      vi.mocked(updateMetadataEmbeddingStatus).mockResolvedValueOnce(false);

      const { runWorkflow } = await import('../core/workflow');
      const result = await runWorkflow({
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Persist metadata embedding status', timestamp: '2026-03-06T09:25:00Z' }],
        },
        collectSessionDataFn: async (_input, specFolderName) => createSessionData(specFolderName || '016-metadata-persistence-warning'),
        silent: true,
      });

      expect(result.memoryId).toBe(42);
      expect(result.indexingStatus.status).toBe('indexed');
      expect(result.warnings).toEqual([
        expect.stringContaining(path.join(result.contextDir, 'metadata.json')),
      ]);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
