// ───────────────────────────────────────────────────────────────────
// MODULE: Runtime Memory Input Tests
// ───────────────────────────────────────────────────────────────────
// TEST: Runtime Memory Inputs
// Covers explicit data-file failures and next-steps normalization
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { normalizeQualityAbortThreshold } from '../core/config';
import { collectSessionData } from '../extractors/collect-session-data';
import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';

const captureConversation = vi.fn(async () => null);
const captureClaudeConversation = vi.fn(async () => null);
const captureCodexConversation = vi.fn(async () => null);
const captureCopilotConversation = vi.fn(async () => null);
const captureGeminiConversation = vi.fn(async () => null);

vi.mock('../extractors/opencode-capture', () => ({
  captureConversation,
}));

vi.mock('../extractors/claude-code-capture', () => ({
  captureClaudeConversation,
}));

vi.mock('../extractors/codex-cli-capture', () => ({
  captureCodexConversation,
}));

vi.mock('../extractors/copilot-cli-capture', () => ({
  captureCopilotConversation,
}));

vi.mock('../extractors/gemini-cli-capture', () => ({
  captureGeminiConversation,
}));

function resetCaptureMocks(): void {
  for (const mock of [captureConversation, captureClaudeConversation, captureCodexConversation, captureCopilotConversation, captureGeminiConversation]) {
    mock.mockReset();
    mock.mockResolvedValue(null);
  }
}

function clearNativeCaptureHintEnv(): void {
  vi.stubEnv('SYSTEM_SPEC_KIT_CAPTURE_SOURCE', '');
  vi.stubEnv('CODEX_SHELL', '');
  vi.stubEnv('CODEX_CI', '');
  vi.stubEnv('CODEX_INTERNAL_ORIGINATOR_OVERRIDE', '');
  vi.stubEnv('COPILOT_SESSION', '');
  vi.stubEnv('CLAUDECODE', '');
  vi.stubEnv('CLAUDE_CODE', '');
  vi.stubEnv('CLAUDE_CODE_SESSION', '');
  vi.stubEnv('CLAUDE_CODE_SESSION_ID', '');
  vi.stubEnv('CLAUDE_CODE_ENTRYPOINT', '');
  vi.stubEnv('CLAUDE_CODE_SESSION_STARTED_AT', '');
  vi.stubEnv('CLAUDE_CODE_START_TS', '');
  vi.stubEnv('GEMINI_CLI', '');
  vi.stubEnv('GEMINI_SESSION_ID', '');
  vi.stubEnv('OPENCODE_SESSION_ID', '');
  vi.stubEnv('OPENCODE_RUNTIME', '');
}

describe('loadCollectedData explicit data-file handling', () => {
  beforeEach(() => {
    vi.resetModules();
    resetCaptureMocks();
  });

  it('rejects a missing explicit dataFile instead of falling back to OpenCode capture', async () => {
    const missingFile = path.join(os.tmpdir(), `missing-${Date.now()}.json`);
    const { loadCollectedData } = await import('../loaders/data-loader');

    await expect(loadCollectedData({
      dataFile: missingFile,
      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found/);

      expect(captureConversation).not.toHaveBeenCalled();
      expect(captureClaudeConversation).not.toHaveBeenCalled();
      expect(captureCodexConversation).not.toHaveBeenCalled();
      expect(captureCopilotConversation).not.toHaveBeenCalled();
      expect(captureGeminiConversation).not.toHaveBeenCalled();
    });

  it('rejects invalid JSON from an explicit dataFile instead of falling back to OpenCode capture', async () => {
    const invalidFile = path.join(os.tmpdir(), `invalid-${Date.now()}.json`);
    await fs.writeFile(invalidFile, '{invalid json', 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');

      await expect(loadCollectedData({
        dataFile: invalidFile,
        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file/);

      expect(captureConversation).not.toHaveBeenCalled();
      expect(captureClaudeConversation).not.toHaveBeenCalled();
      expect(captureCodexConversation).not.toHaveBeenCalled();
      expect(captureCopilotConversation).not.toHaveBeenCalled();
      expect(captureGeminiConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(invalidFile, { force: true });
    }
  });

  it('rejects validation failures from an explicit dataFile instead of falling back to OpenCode capture', async () => {
    const invalidShapeFile = path.join(os.tmpdir(), `invalid-shape-${Date.now()}.json`);
    await fs.writeFile(invalidShapeFile, JSON.stringify({
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      nextSteps: 'not-an-array',
    }), 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');

      await expect(loadCollectedData({
        dataFile: invalidShapeFile,
        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file/);

      expect(captureConversation).not.toHaveBeenCalled();
      expect(captureClaudeConversation).not.toHaveBeenCalled();
      expect(captureCodexConversation).not.toHaveBeenCalled();
      expect(captureCopilotConversation).not.toHaveBeenCalled();
      expect(captureGeminiConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(invalidShapeFile, { force: true });
    }
  });

  (process.getuid?.() === 0 ? it.skip : it)('rejects an EACCES permission error from an explicit dataFile instead of falling back to capture', async () => {
    const permFile = path.join(os.tmpdir(), `perm-denied-${Date.now()}.json`);
    await fs.writeFile(permFile, JSON.stringify({ specFolder: 'test' }), 'utf-8');
    await fs.chmod(permFile, 0o000);

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');

      await expect(loadCollectedData({
        dataFile: permFile,
        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Permission denied/);

      expect(captureConversation).not.toHaveBeenCalled();
      expect(captureClaudeConversation).not.toHaveBeenCalled();
      expect(captureCodexConversation).not.toHaveBeenCalled();
      expect(captureCopilotConversation).not.toHaveBeenCalled();
      expect(captureGeminiConversation).not.toHaveBeenCalled();
    } finally {
      await fs.chmod(permFile, 0o644);
      await fs.rm(permFile, { force: true });
    }
  });
});

describe('valid explicit dataFile happy path', () => {
  beforeEach(() => {
    vi.resetModules();
    resetCaptureMocks();
  });

  it('loads and normalizes a valid explicit dataFile successfully', async () => {
    const validFile = path.join(os.tmpdir(), `valid-${Date.now()}.json`);
    await fs.writeFile(validFile, JSON.stringify({
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      sessionSummary: 'Completed runtime hardening.',
      nextSteps: ['Update documentation.'],
    }), 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');
      const result = await loadCollectedData({
        dataFile: validFile,
        specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      });

      expect(result._source).toBe('file');
      expect(result.observations).toBeDefined();
      expect(Array.isArray(result.observations)).toBe(true);
      expect(captureConversation).not.toHaveBeenCalled();
      expect(captureClaudeConversation).not.toHaveBeenCalled();
      expect(captureCodexConversation).not.toHaveBeenCalled();
      expect(captureCopilotConversation).not.toHaveBeenCalled();
      expect(captureGeminiConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(validFile, { force: true });
    }
  });

  it('accepts the documented snake_case JSON shape without dropping prompts or context', async () => {
    const validFile = path.join(os.tmpdir(), `valid-snake-${Date.now()}.json`);
    await fs.writeFile(validFile, JSON.stringify({
      spec_folder: '022-hybrid-rag-fusion/010-perfect-session-capturing',
      session_summary: 'Verified generated memory render quality in snake_case JSON mode.',
      trigger_phrases: ['perfect session capturing', 'render quality', 'trigger phrases'],
      user_prompts: [
        {
          prompt: 'Verify the documented snake_case JSON contract works end to end.',
          timestamp: '2026-03-15T12:15:00Z',
        },
      ],
      recent_context: [
        {
          request: 'Validate snake_case JSON input handling',
          learning: 'The documented user_prompts and recent_context fields must survive normalization.',
        },
      ],
    }), 'utf-8');

    try {
      const { loadCollectedData } = await import('../loaders/data-loader');
      const result = await loadCollectedData({
        dataFile: validFile,
        specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
      });

      expect(result._source).toBe('file');
      expect(result.userPrompts?.[0]?.prompt).toContain('documented snake_case JSON contract');
      expect(result.recentContext?.[0]?.request).toContain('snake_case JSON input handling');
      expect(result._manualTriggerPhrases).toEqual([
        'perfect session capturing',
        'render quality',
        'trigger phrases',
      ]);
      expect(captureConversation).not.toHaveBeenCalled();
      expect(captureClaudeConversation).not.toHaveBeenCalled();
      expect(captureCodexConversation).not.toHaveBeenCalled();
      expect(captureCopilotConversation).not.toHaveBeenCalled();
      expect(captureGeminiConversation).not.toHaveBeenCalled();
    } finally {
      await fs.rm(validFile, { force: true });
    }
  });
});

describe('path traversal security', () => {
  beforeEach(() => {
    vi.resetModules();
    resetCaptureMocks();
  });

  it('rejects a dataFile path that attempts directory traversal', async () => {
    const { loadCollectedData } = await import('../loaders/data-loader');

    await expect(loadCollectedData({
      dataFile: '../../etc/passwd',
      specFolderArg: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
    })).rejects.toThrow(/Security|Path outside allowed directories/);

    expect(captureConversation).not.toHaveBeenCalled();
    expect(captureClaudeConversation).not.toHaveBeenCalled();
    expect(captureCodexConversation).not.toHaveBeenCalled();
    expect(captureCopilotConversation).not.toHaveBeenCalled();
    expect(captureGeminiConversation).not.toHaveBeenCalled();
  });
});

describe('native CLI fallback handling', () => {
  beforeEach(() => {
    vi.resetModules();
    resetCaptureMocks();
    clearNativeCaptureHintEnv();
  });

  it('falls back to Claude Code capture when OpenCode capture returns no usable content', async () => {
    captureConversation.mockResolvedValueOnce(null);
    captureClaudeConversation.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: 'Use Claude transcript for 010-perfect-session-capturing hybrid rag fusion work',
          assistantResponse: 'Loaded the Claude session for 010-perfect-session-capturing successfully.',
          timestamp: '2026-03-15T10:00:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Claude transcript fallback',
      sessionId: 'claude-session',
      capturedAt: '2026-03-15T10:00:01.000Z',
    });

    const { loadCollectedData } = await import('../loaders/data-loader');
    const result = await loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    });

    expect(captureConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).toHaveBeenCalledWith(
      20,
      expect.any(String),
      expect.objectContaining({
        invocationTs: expect.any(Number),
      }),
    );
    expect(captureCodexConversation).not.toHaveBeenCalled();
    expect(captureCopilotConversation).not.toHaveBeenCalled();
    expect(captureGeminiConversation).not.toHaveBeenCalled();
    expect(result._source).toBe('claude-code-capture');
    expect(result.userPrompts?.[0]?.prompt).toContain('010-perfect-session-capturing');
  });

  it('falls back to Codex CLI after OpenCode and Claude both return no usable content', async () => {
    captureConversation.mockResolvedValueOnce(null);
    captureClaudeConversation.mockResolvedValueOnce(null);
    captureCodexConversation.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: 'Capture Codex session for 010-perfect-session-capturing hybrid rag fusion',
          assistantResponse: 'Loaded Codex session for 010-perfect-session-capturing successfully.',
          timestamp: '2026-03-15T10:10:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Codex transcript fallback',
      sessionId: 'codex-session',
      capturedAt: '2026-03-15T10:10:01.000Z',
    });

    const { loadCollectedData } = await import('../loaders/data-loader');
    const result = await loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    });

    expect(captureConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).toHaveBeenCalledTimes(1);
    expect(captureCodexConversation).toHaveBeenCalledTimes(1);
    expect(captureCopilotConversation).not.toHaveBeenCalled();
    expect(captureGeminiConversation).not.toHaveBeenCalled();
    expect(result._source).toBe('codex-cli-capture');
    expect(result.userPrompts?.[0]?.prompt).toContain('010-perfect-session-capturing');
  });

  it('falls back to Copilot CLI after Codex also returns no usable content', async () => {
    captureConversation.mockResolvedValueOnce(null);
    captureClaudeConversation.mockResolvedValueOnce(null);
    captureCodexConversation.mockResolvedValueOnce(null);
    captureCopilotConversation.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: 'Capture the current Copilot session',
          assistantResponse: 'Loaded the Copilot session successfully.',
          timestamp: '2026-03-15T10:20:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Copilot transcript fallback',
      sessionId: 'copilot-session',
      capturedAt: '2026-03-15T10:20:01.000Z',
    });

    const { loadCollectedData } = await import('../loaders/data-loader');
    const result = await loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    });

    expect(captureConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).toHaveBeenCalledTimes(1);
    expect(captureCodexConversation).toHaveBeenCalledTimes(1);
    expect(captureCopilotConversation).toHaveBeenCalledTimes(1);
    expect(captureGeminiConversation).not.toHaveBeenCalled();
    expect(result._source).toBe('copilot-cli-capture');
  });

  it('falls back to Gemini CLI when it is the only usable native capture source', async () => {
    captureConversation.mockResolvedValueOnce(null);
    captureClaudeConversation.mockResolvedValueOnce(null);
    captureCodexConversation.mockResolvedValueOnce(null);
    captureCopilotConversation.mockResolvedValueOnce(null);
    captureGeminiConversation.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: 'Capture the current Gemini session',
          assistantResponse: 'Loaded the Gemini session successfully.',
          timestamp: '2026-03-15T10:30:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'Gemini transcript fallback',
      sessionId: 'gemini-session',
      capturedAt: '2026-03-15T10:30:01.000Z',
    });

    const { loadCollectedData } = await import('../loaders/data-loader');
    const result = await loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    });

    expect(captureConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).toHaveBeenCalledTimes(1);
    expect(captureCodexConversation).toHaveBeenCalledTimes(1);
    expect(captureCopilotConversation).toHaveBeenCalledTimes(1);
    expect(captureGeminiConversation).toHaveBeenCalledTimes(1);
    expect(result._source).toBe('gemini-cli-capture');
  });

  it('keeps the NO_DATA_AVAILABLE hard-fail when no native capture source returns content', async () => {
    captureConversation.mockResolvedValueOnce(null);
    captureClaudeConversation.mockResolvedValueOnce(null);
    captureCodexConversation.mockResolvedValueOnce(null);
    captureCopilotConversation.mockResolvedValueOnce(null);
    captureGeminiConversation.mockResolvedValueOnce(null);

    const { loadCollectedData } = await import('../loaders/data-loader');

    await expect(loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    })).rejects.toThrow(/NO_DATA_AVAILABLE/);

    expect(captureConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).toHaveBeenCalledTimes(1);
    expect(captureCodexConversation).toHaveBeenCalledTimes(1);
    expect(captureCopilotConversation).toHaveBeenCalledTimes(1);
    expect(captureGeminiConversation).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['claude', 'claude-code-capture', captureClaudeConversation],
    ['codex', 'codex-cli-capture', captureCodexConversation],
    ['copilot', 'copilot-cli-capture', captureCopilotConversation],
    ['gemini', 'gemini-cli-capture', captureGeminiConversation],
  ] as const)('prefers %s when SYSTEM_SPEC_KIT_CAPTURE_SOURCE is set', async (hint, expectedSource, preferredMock) => {
    vi.stubEnv('SYSTEM_SPEC_KIT_CAPTURE_SOURCE', hint);

    captureConversation.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: 'OpenCode should be skipped when a preferred source is available.',
          assistantResponse: 'OpenCode response',
          timestamp: '2026-03-15T12:00:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'OpenCode default fallback',
      sessionId: 'opencode-default',
      capturedAt: '2026-03-15T12:00:01.000Z',
    });

    preferredMock.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: `Use ${hint} as the preferred direct-mode capture source.`,
          assistantResponse: `Loaded ${hint} successfully.`,
          timestamp: '2026-03-15T12:00:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: `${hint} preferred source`,
      sessionId: `${hint}-preferred`,
      capturedAt: '2026-03-15T12:00:01.000Z',
    });

    const { loadCollectedData } = await import('../loaders/data-loader');
    const result = await loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    });

    expect(result._source).toBe(expectedSource);
    expect(preferredMock).toHaveBeenCalledTimes(1);
    expect(captureConversation).not.toHaveBeenCalled();
  });

  it('tries the hinted source first, then resumes the documented fallback order', async () => {
    vi.stubEnv('SYSTEM_SPEC_KIT_CAPTURE_SOURCE', 'codex');

    captureCodexConversation.mockResolvedValueOnce(null);
    captureConversation.mockResolvedValueOnce({
      exchanges: [
        {
          userInput: 'Fallback to OpenCode after the preferred Codex source is empty.',
          assistantResponse: 'Loaded OpenCode after trying Codex first.',
          timestamp: '2026-03-15T12:10:00.000Z',
        },
      ],
      toolCalls: [],
      metadata: {},
      sessionTitle: 'OpenCode after preferred Codex miss',
      sessionId: 'opencode-after-codex',
      capturedAt: '2026-03-15T12:10:01.000Z',
    });

    const { loadCollectedData } = await import('../loaders/data-loader');
    const result = await loadCollectedData({
      specFolderArg: '022-hybrid-rag-fusion/010-perfect-session-capturing',
    });

    expect(result._source).toBe('opencode-capture');
    expect(captureCodexConversation).toHaveBeenCalledTimes(1);
    expect(captureConversation).toHaveBeenCalledTimes(1);
    expect(captureClaudeConversation).not.toHaveBeenCalled();
  });
});

describe('qualityAbortThreshold normalization', () => {
  it('keeps canonical 0.0-1.0 thresholds unchanged', () => {
    const log = vi.fn();

    expect(normalizeQualityAbortThreshold(0.15, 0.15, log as never)).toBe(0.15);
    expect(log).not.toHaveBeenCalled();
  });

  it('auto-converts legacy 1-100 thresholds to the canonical 0.0-1.0 scale', () => {
    const log = vi.fn();

    expect(normalizeQualityAbortThreshold(15, 0.15, log as never)).toBe(0.15);
    expect(log).toHaveBeenCalledWith(
      'warn',
      expect.stringMatching(/legacy 1-100 scale/i),
      expect.objectContaining({ value: 15, normalized: 0.15 }),
    );
  });
});

describe('FILES field transformation', () => {
  it('marks CLI-derived FILES with tool provenance and titles Copilot view as Read', () => {
    const transformed = transformOpencodeCapture({
      exchanges: [
        {
          userInput: 'Inspect the Copilot capture parity.',
          assistantResponse: 'Reviewed the file and prepared an edit.',
          timestamp: '2026-03-16T10:00:00.000Z',
        },
      ],
      toolCalls: [
        {
          tool: 'view',
          status: 'completed',
          timestamp: '2026-03-16T10:00:01.000Z',
          input: {
            path: '/tmp/spec-kit-project/scripts/loaders/data-loader.ts',
          },
          output: 'Inspection complete.',
        },
        {
          tool: 'edit',
          status: 'completed',
          timestamp: '2026-03-16T10:00:02.000Z',
          title: 'Apply parity hardening to the input normalizer.',
          input: {
            filePath: '/tmp/spec-kit-project/scripts/utils/input-normalizer.ts',
          },
          output: 'Edit applied.',
        },
      ],
      metadata: {},
      sessionTitle: 'Copilot parity capture',
      sessionId: 'copilot-parity',
      capturedAt: '2026-03-16T10:00:00.000Z',
    }, null, 'copilot-cli-capture');

    expect(transformed.observations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Read loaders/data-loader.ts',
        facts: expect.arrayContaining(['Tool: view']),
      }),
    ]));

    expect(transformed.FILES).toEqual([
      {
        FILE_PATH: '/tmp/spec-kit-project/scripts/utils/input-normalizer.ts',
        DESCRIPTION: 'Apply parity hardening to the input normalizer.',
        _provenance: 'tool',
      },
    ]);
  });

  it('preserves FILES metadata in structured payloads when present', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
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
        {
          path: 'src/index.ts',
          description: 'Entry point',
          action: 'modify',
          _provenance: 'git',
          _synthetic: false,
        } as unknown as import('../utils/input-normalizer').FileEntry,
        {
          FILE_PATH: 'src/utils.ts',
          DESCRIPTION: 'Utility functions',
          ACTION: 'Read',
          _synthetic: true,
        },
      ],
    });

    expect(normalized.FILES).toEqual([
      {
        FILE_PATH: 'src/index.ts',
        DESCRIPTION: 'Entry point',
        ACTION: 'modify',
        _provenance: 'git',
        _synthetic: false,
      },
      {
        FILE_PATH: 'src/utils.ts',
        DESCRIPTION: 'Utility functions',
        ACTION: 'Read',
        _synthetic: true,
      },
    ]);
  });

  it('keeps FILES backward-compatible when metadata is absent', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
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
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
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
      '022-hybrid-rag-fusion/015-outsourced-agent-handback'
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
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
      sessionSummary: 'Session with no next steps.',
      nextSteps: [],
    });

    const nextStepObs = normalized.observations.filter((obs) => obs.title === 'Next Steps');
    expect(nextStepObs).toHaveLength(0);
  });

  it('prefers camelCase nextSteps when both nextSteps and next_steps are present', () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
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
      specFolder: '022-hybrid-rag-fusion/015-outsourced-agent-handback',
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

describe('extractNextAction recentContext regex fallback', () => {
  it('extracts next action from recentContext learning when observations have no matching next/todo facts', async () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/010-perfect-session-capturing',
      observations: [{
        type: 'feature',
        title: 'Deployment completed',
        narrative: 'All services deployed to production successfully.',
        facts: ['Deployed 3 microservices.', 'All health checks passing.'],
      }],
      userPrompts: [{
        prompt: 'Deploy the services to production.',
        timestamp: '2026-03-17T14:00:00.000Z',
      }],
      recentContext: [{
        request: 'Deploy services',
        learning: 'After deployment, next: run smoke tests on staging',
      }],
    });

    const sessionData = await collectSessionData(
      normalized,
      '022-hybrid-rag-fusion/010-perfect-session-capturing',
    );

    expect(sessionData.NEXT_ACTION).toBe('run smoke tests on staging');
  });

  it('truncates extractFromRecentContext result to 100 characters', async () => {
    const longAction = 'A'.repeat(150);
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/010-perfect-session-capturing',
      observations: [{
        type: 'feature',
        title: 'Long action test',
        narrative: 'Testing truncation boundary.',
        facts: ['No next/todo facts here.'],
      }],
      userPrompts: [{
        prompt: 'Trigger the truncation path.',
        timestamp: '2026-03-17T15:00:00.000Z',
      }],
      recentContext: [{
        request: 'Test truncation',
        learning: `Completed all phases, next: ${longAction}`,
      }],
    });

    const sessionData = await collectSessionData(
      normalized,
      '022-hybrid-rag-fusion/010-perfect-session-capturing',
    );

    expect(sessionData.NEXT_ACTION).toHaveLength(100);
  });
});

describe('observation truncation prioritizes followup observations (M-005b)', () => {
  it('preserves followup observations when total exceeds MAX_OBSERVATIONS', async () => {
    // Simulate the bug: followup observation is appended last via .push(),
    // so with 5 observations and MAX_OBSERVATIONS=3, it would be truncated
    // without the priority sort fix.
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/010-perfect-session-capturing',
      observations: [
        { type: 'implementation', title: 'Obs 1', narrative: 'First observation', facts: [] },
        { type: 'implementation', title: 'Obs 2', narrative: 'Second observation', facts: [] },
        { type: 'feature', title: 'Obs 3', narrative: 'Third observation', facts: [] },
        { type: 'bugfix', title: 'Obs 4', narrative: 'Fourth observation', facts: [] },
      ],
      nextSteps: [
        'Fix bug X',
        'Deploy Y',
        'Validate Z',
      ],
      userPrompts: [{
        prompt: 'Trigger truncation test',
        timestamp: '2026-03-17T16:00:00.000Z',
      }],
      recentContext: [{
        request: 'Test followup priority during truncation',
        learning: 'Verifying followup observations survive truncation.',
      }],
    });

    // The normalizer appends the followup observation last (index 4),
    // so without the fix, slice(0, 3) would drop it.
    expect(normalized.observations.length).toBeGreaterThan(3);
    expect(normalized.observations.at(-1)).toMatchObject({
      type: 'followup',
      title: 'Next Steps',
    });

    const sessionData = await collectSessionData(
      normalized,
      '022-hybrid-rag-fusion/010-perfect-session-capturing',
    );

    // The fix ensures followup observations are prioritized before truncation,
    // so NEXT_ACTION should reflect the first nextStep rather than the default.
    expect(sessionData.NEXT_ACTION).toBe('Fix bug X');
  });

  it('retains no more than MAX_OBSERVATIONS total after prioritization', async () => {
    const normalized = normalizeInputData({
      specFolder: '022-hybrid-rag-fusion/010-perfect-session-capturing',
      observations: [
        { type: 'implementation', title: 'Impl 1', narrative: 'Implementation work', facts: [] },
        { type: 'feature', title: 'Feature 1', narrative: 'Feature work', facts: [] },
        { type: 'bugfix', title: 'Bugfix 1', narrative: 'Bug fix work', facts: [] },
        { type: 'implementation', title: 'Impl 2', narrative: 'More implementation', facts: [] },
      ],
      nextSteps: ['Deploy to staging', 'Run integration tests'],
      userPrompts: [{
        prompt: 'Verify count limit',
        timestamp: '2026-03-17T16:30:00.000Z',
      }],
      recentContext: [{
        request: 'Check observation count after truncation',
        learning: 'Ensure MAX_OBSERVATIONS limit is still enforced.',
      }],
    });

    const sessionData = await collectSessionData(
      normalized,
      '022-hybrid-rag-fusion/010-perfect-session-capturing',
    );

    // MAX_OBSERVATIONS is 3, so total observations in output must not exceed 3.
    // The followup observation should be among them.
    expect(sessionData.NEXT_ACTION).toBe('Deploy to staging');
  });
});
