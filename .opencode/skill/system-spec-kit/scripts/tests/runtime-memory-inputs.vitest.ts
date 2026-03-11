// ---------------------------------------------------------------
// TEST: Runtime Memory Inputs
// Covers explicit data-file failures and next-steps normalization
// ---------------------------------------------------------------

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
});
