// TEST: Runtime Memory Inputs
// Covers explicit data-file failures and next-steps normalization
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { collectSessionData } from '../extractors/collect-session-data';
import { normalizeInputData } from '../utils/input-normalizer';

const captureConversation = vi.fn(async () => null);

vi.mock('../extractors/opencode-capture', () => ({
  captureConversation,
}));

describe('loadCollectedData explicit data-file handling', () => {
  beforeEach(() => {
    vi.resetModules();
    captureConversation.mockClear();
  });

  it('rejects a missing explicit dataFile instead of falling back to OpenCode capture', async () => {
    const missingFile = path.join(os.tmpdir(), `missing-${Date.now()}.json`);
    const { loadCollectedData } = await import('../loaders/data-loader');

    await expect(loadCollectedData({
      dataFile: missingFile,
      specFolderArg: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
    })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found/);

    expect(captureConversation).not.toHaveBeenCalled();
  });

  it('rejects invalid JSON from an explicit dataFile instead of falling back to OpenCode capture', async () => {
    const invalidFile = path.join(os.tmpdir(), `invalid-${Date.now()}.json`);
    await fs.writeFile(invalidFile, '{invalid json', 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');

      await expect(loadCollectedData({
        dataFile: invalidFile,
        specFolderArg: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file/);

      expect(captureConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(invalidFile, { force: true });
    }
  });

  it('rejects validation failures from an explicit dataFile instead of falling back to OpenCode capture', async () => {
    const invalidShapeFile = path.join(os.tmpdir(), `invalid-shape-${Date.now()}.json`);
    await fs.writeFile(invalidShapeFile, JSON.stringify({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      nextSteps: 'not-an-array',
    }), 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');

      await expect(loadCollectedData({
        dataFile: invalidShapeFile,
        specFolderArg: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file/);

      expect(captureConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(invalidShapeFile, { force: true });
    }
  });
});

describe('valid explicit dataFile happy path', () => {
  beforeEach(() => {
    vi.resetModules();
    captureConversation.mockClear();
  });

  it('loads and normalizes a valid explicit dataFile successfully', async () => {
    const validFile = path.join(os.tmpdir(), `valid-${Date.now()}.json`);
    await fs.writeFile(validFile, JSON.stringify({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      sessionSummary: 'Completed runtime hardening.',
      nextSteps: ['Update documentation.'],
    }), 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');
      const result = await loadCollectedData({
        dataFile: validFile,
        specFolderArg: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      });

      expect(result._source).toBe('file');
      expect(result.observations).toBeDefined();
      expect(Array.isArray(result.observations)).toBe(true);
      expect(captureConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(validFile, { force: true });
    }
  });
});

describe('path traversal security', () => {
  beforeEach(() => {
    vi.resetModules();
    captureConversation.mockClear();
  });

  it('rejects a dataFile path that attempts directory traversal', async () => {
    const { loadCollectedData } = await import('../loaders/data-loader');

    await expect(loadCollectedData({
      dataFile: '../../etc/passwd',
      specFolderArg: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
    })).rejects.toThrow(/Security|Path outside allowed directories/);

    expect(captureConversation).not.toHaveBeenCalled();
  });
});

describe('FILES field transformation', () => {
  it('transforms path/description fields to FILE_PATH/DESCRIPTION in structured payloads', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      observations: [{
        type: 'feature',
        title: 'Test payload',
        narrative: 'Testing FILES transformation',
        facts: [],
      }],
      userPrompts: [{
        prompt: 'Test structured save',
        timestamp: '2026-03-14T10:00:00.000Z',
      }],
      recentContext: [{
        request: 'Test FILES field',
        learning: 'Verifying field mapping.',
      }],
      FILES: [
        { path: 'src/index.ts', description: 'Entry point' } as unknown as import('../utils/input-normalizer').FileEntry,
        { FILE_PATH: 'src/utils.ts', DESCRIPTION: 'Utility functions' },
      ],
    });

    expect(normalized.FILES).toEqual([
      { FILE_PATH: 'src/index.ts', DESCRIPTION: 'Entry point' },
      { FILE_PATH: 'src/utils.ts', DESCRIPTION: 'Utility functions' },
    ]);
  });
});

describe('manual next-steps normalization', () => {
  it('preserves nextSteps through normalization into NEXT_ACTION without overwriting the summary', async () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion',
      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
      nextSteps: [
        'Add regression coverage for explicit dataFile failures.',
        'Align downstream docs with the persisted field mapping.',
      ],
    });

    expect(normalized).toMatchObject({
      recentContext: [{
        request: 'Stabilized delegated memory save runtime behavior.',
        learning: 'Stabilized delegated memory save runtime behavior.',
      }],
    });

    expect(normalized.observations.at(-1)).toMatchObject({
      title: 'Next Steps',
      facts: [
        'Next: Add regression coverage for explicit dataFile failures.',
        'Follow-up: Align downstream docs with the persisted field mapping.',
      ],
    });

    const sessionData = await collectSessionData(normalized, '022-hybrid-rag-fusion');

    expect(sessionData.SUMMARY).toBe('Stabilized delegated memory save runtime behavior.');
    expect(sessionData.NEXT_ACTION).toBe('Add regression coverage for explicit dataFile failures.');
  });

  it('preserves next_steps for already-structured payloads without duplicating existing next-action facts', async () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      observations: [{
        type: 'feature',
        title: 'Structured payload',
        narrative: 'Existing structured observation',
        facts: [],
      }],
      userPrompts: [{
        prompt: 'Use structured save path',
        timestamp: '2026-03-13T11:00:00.000Z',
      }],
      recentContext: [{
        request: 'Retain structured next steps',
        learning: 'Structured data came from a CLI handback.',
      }],
      next_steps: [
        'Promote the preserved structured next action.',
        'Update the related handback docs.',
      ],
    });

    expect(normalized.observations.at(-1)).toMatchObject({
      title: 'Next Steps',
      facts: [
        'Next: Promote the preserved structured next action.',
        'Follow-up: Update the related handback docs.',
      ],
    });

    const sessionData = await collectSessionData(
      normalized,
      '022-hybrid-rag-fusion/014-outsourced-agent-memory'
    );

    expect(sessionData.NEXT_ACTION).toBe('Promote the preserved structured next action.');

    const normalizedAgain = normalizeInputData({
      ...normalized,
      next_steps: ['This should not duplicate the existing next-step facts.'],
    });
    const nextStepObservations = normalizedAgain.observations.filter((observation) =>
      observation.title === 'Next Steps'
    );

    expect(nextStepObservations).toHaveLength(1);
  });

  it('produces no Next Steps observation when nextSteps is an empty array', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      sessionSummary: 'Session with no next steps.',
      nextSteps: [],
    });

    const nextStepObs = normalized.observations.filter((obs) => obs.title === 'Next Steps');
    expect(nextStepObs).toHaveLength(0);
  });

  it('prefers camelCase nextSteps when both nextSteps and next_steps are present', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      sessionSummary: 'Both fields present.',
      nextSteps: ['camelCase wins.'],
      next_steps: ['snake_case loses.'],
    });

    const lastObs = normalized.observations.at(-1);
    expect(lastObs).toMatchObject({
      title: 'Next Steps',
      facts: ['Next: camelCase wins.'],
    });
  });

  it('documents behavior when the first next step is an empty string', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/014-outsourced-agent-memory',
      sessionSummary: 'Edge case: empty first step.',
      nextSteps: ['', 'Second step is real.'],
    });

    const lastObs = normalized.observations.at(-1);
    expect(lastObs).toMatchObject({
      title: 'Next Steps',
      facts: ['Next: ', 'Follow-up: Second step is real.'],
    });
  });
});
