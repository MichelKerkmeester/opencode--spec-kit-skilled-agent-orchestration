import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SessionData } from '../types/session-types';

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

function createSessionData(specFolderName: string, sessionId: string): SessionData {
  return {
    TITLE: 'Workflow Session Id Regression',
    DATE: '02-04-26',
    TIME: '10-00',
    SPEC_FOLDER: specFolderName,
    DURATION: '2m',
    SUMMARY: 'Verifies runWorkflow forwards explicit session ids into collectSessionData.',
    FILES: [],
    HAS_FILES: false,
    FILE_COUNT: 0,
    CAPTURED_FILE_COUNT: 0,
    FILESYSTEM_FILE_COUNT: 0,
    GIT_CHANGED_FILE_COUNT: 0,
    OUTCOMES: [{ OUTCOME: 'Explicit session id should survive the workflow boundary.', TYPE: 'status' }],
    TOOL_COUNT: 1,
    MESSAGE_COUNT: 1,
    QUICK_SUMMARY: 'Workflow session id regression',
    SKILL_VERSION: '1.7.2',
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    SESSION_ID: sessionId,
    CHANNEL: 'test',
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'implementation',
    CREATED_AT_EPOCH: 1_775_129_200,
    LAST_ACCESSED_EPOCH: 1_775_129_200,
    EXPIRES_AT_EPOCH: 1_782_905_200,
    TOOL_COUNTS: { Read: 1, Edit: 0, Write: 0, Bash: 0, Grep: 0, Glob: 0, Task: 0, WebFetch: 0, WebSearch: 0, Skill: 0 },
    DECISION_COUNT: 0,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1,
    PROJECT_PHASE: 'IMPLEMENTATION',
    ACTIVE_FILE: 'scripts/core/workflow.ts',
    LAST_ACTION: 'Thread the explicit session id into session data collection.',
    NEXT_ACTION: 'Keep the explicit session id in the rendered memory output.',
    BLOCKERS: 'None',
    STATUS: 'active',
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  workflowHarness.specFolderPath = '';
  workflowHarness.contextDir = '';
});

describe('workflow explicit session id forwarding', () => {
  it('passes options.sessionId as the third collectSessionDataFn argument', async () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-workflow-session-id-'));
    const { CONFIG } = await import('../core');
    const previousTemplateDir = CONFIG.TEMPLATE_DIR;
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates');
    const collectSessionDataFn = vi.fn(async (_input: unknown, specFolderName?: string, explicitSessionId?: string) => {
      return createSessionData(specFolderName || '017-workflow-session-id', explicitSessionId || 'missing-session-id');
    });

    try {
      const specFolderPath = path.join(tempRoot, '017-workflow-session-id');
      const contextDir = path.join(specFolderPath, 'memory');
      fs.mkdirSync(contextDir, { recursive: true });
      fs.writeFileSync(
        path.join(specFolderPath, 'spec.md'),
        ['---', 'title: "Spec: Workflow Session Id Regression"', '---', '# Spec'].join('\n'),
        'utf-8',
      );

      workflowHarness.specFolderPath = specFolderPath;
      workflowHarness.contextDir = contextDir;
      CONFIG.TEMPLATE_DIR = templatesDir;

      const { runWorkflow } = await import('../core/workflow');
      const explicitSessionId = 'explicit-session-id-42';
      const result = await runWorkflow({
        collectedData: {
          _source: 'file',
          userPrompts: [{ prompt: 'Persist explicit session id through workflow', timestamp: '2026-04-02T10:00:00Z' }],
        },
        collectSessionDataFn,
        sessionId: explicitSessionId,
        silent: true,
      });

      expect(collectSessionDataFn).toHaveBeenCalledWith(
        expect.any(Object),
        '017-workflow-session-id',
        explicitSessionId,
      );
      expect(result.memoryId).toBe(42);
    } finally {
      CONFIG.TEMPLATE_DIR = previousTemplateDir;
      fs.rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
