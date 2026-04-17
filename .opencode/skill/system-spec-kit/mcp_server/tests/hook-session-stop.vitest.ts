import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs, { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ensureStateDir, loadState, updateState } from '../hooks/claude/hook-state.js';
import { detectSpecFolder, processStopHook } from '../hooks/claude/session-stop.js';

describe('Claude session-stop spec folder detection', () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir) {
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it('preserves the current spec folder when the transcript mentions multiple packets', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
      ].join('\n'),
      'utf-8',
    );

    expect(
      detectSpecFolder(
        transcriptPath,
        'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
      ),
    ).toBe('specs/system-spec-kit/024-compact-code-graph/029-review-remediation');
  });

  it('rejects ambiguous transcript-only detection when multiple spec folders are present', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
      ].join('\n'),
      'utf-8',
    );

    expect(detectSpecFolder(transcriptPath)).toBeNull();
  });

  it('still detects a single unambiguous spec folder', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/tasks.md',
        '.opencode/specs/system-spec-kit/024-compact-code-graph/029-review-remediation/checklist.md',
      ].join('\n'),
      'utf-8',
    );

    expect(detectSpecFolder(transcriptPath)).toBe(
      'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
    );
  });

  it('retargets to a new unambiguous spec folder when the current one is absent from the transcript tail', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      [
        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
        '.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md',
      ].join('\n'),
      'utf-8',
    );

    expect(
      detectSpecFolder(
        transcriptPath,
        'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
      ),
    ).toBe('specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity');
  });

  it('allows the transcript tail window to be configured for packet validation', () => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-'));
    const transcriptPath = join(tempDir, 'transcript.jsonl');
    const currentSpecFolder = 'specs/system-spec-kit/024-compact-code-graph/029-review-remediation';
    const nextSpecFolder = 'specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity';
    writeFileSync(
      transcriptPath,
      [
        `${currentSpecFolder}/tasks.md`,
        'x'.repeat(256),
        `${nextSpecFolder}/implementation-summary.md`,
      ].join('\n'),
      'utf-8',
    );

    expect(detectSpecFolder(transcriptPath, currentSpecFolder, { tailBytes: 192 })).toBe(nextSpecFolder);
    expect(detectSpecFolder(transcriptPath, currentSpecFolder, { tailBytes: 512 })).toBe(currentSpecFolder);
  });
});

describe.sequential('Claude session-stop autosave outcomes', () => {
  let sandboxRoot: string | null = null;
  let projectRoot: string | null = null;
  let tempRoot: string | null = null;
  let previousCwd: string;
  let previousTmpdir: string | undefined;
  let previousAutosaveScript: string | undefined;

  beforeEach(() => {
    sandboxRoot = mkdtempSync(join(tmpdir(), 'speckit-stop-hook-autosave-'));
    projectRoot = join(sandboxRoot, 'project');
    tempRoot = join(sandboxRoot, 'tmp');
    mkdirSync(projectRoot, { recursive: true });
    mkdirSync(tempRoot, { recursive: true });

    previousCwd = process.cwd();
    previousTmpdir = process.env.TMPDIR;
    previousAutosaveScript = process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT;
    process.chdir(projectRoot);
    process.env.TMPDIR = tempRoot;
    delete process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT;
    ensureStateDir();
  });

  afterEach(() => {
    process.chdir(previousCwd);
    if (previousTmpdir === undefined) {
      delete process.env.TMPDIR;
    } else {
      process.env.TMPDIR = previousTmpdir;
    }
    if (previousAutosaveScript === undefined) {
      delete process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT;
    } else {
      process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT = previousAutosaveScript;
    }
    if (sandboxRoot) {
      rmSync(sandboxRoot, { recursive: true, force: true });
    }
    sandboxRoot = null;
    projectRoot = null;
    tempRoot = null;
  });

  it('reports skipped autosave when enabled without saved context inputs', async () => {
    const result = await processStopHook(
      {
        session_id: 'autosave-skipped',
        stop_hook_active: true,
      },
      { autosaveMode: 'enabled' },
    );

    expect(result.autosaveMode).toBe('enabled');
    expect(result.autosaveOutcome).toBe('skipped');
    expect(result.retargetReason).toBeNull();
    expect(result.touchedPaths).toEqual([]);
    expect(result.producerMetadataWritten).toBe(false);
  });

  it('reports failed autosave when the continuity save process exits non-zero', async () => {
    const autosaveScriptPath = join(projectRoot!, 'fail-autosave.js');
    writeFileSync(
      autosaveScriptPath,
      "process.stderr.write('autosave failed'); process.exit(2);\n",
      'utf-8',
    );
    process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT = autosaveScriptPath;
    updateState('autosave-failed', {
      lastSpecFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review',
      sessionSummary: {
        text: 'Persist this summary',
        extractedAt: new Date(0).toISOString(),
      },
    });

    const result = await processStopHook(
      {
        session_id: 'autosave-failed',
        stop_hook_active: true,
      },
      { autosaveMode: 'enabled' },
    );

    expect(result.autosaveMode).toBe('enabled');
    expect(result.autosaveOutcome).toBe('failed');
    expect(result.retargetReason).toBeNull();
    expect(result.touchedPaths).toEqual([]);
    expect(result.producerMetadataWritten).toBe(false);
  });

  it('surfaces the retarget reason when transcript evidence points to a different packet', async () => {
    const transcriptPath = join(sandboxRoot!, 'retarget-transcript.jsonl');
    const previousSpecFolder = 'specs/system-spec-kit/024-compact-code-graph/029-review-remediation';
    const nextSpecFolder = 'specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity';
    writeFileSync(
      transcriptPath,
      [
        `${nextSpecFolder}/spec.md`,
        `${nextSpecFolder}/implementation-summary.md`,
      ].join('\n'),
      'utf-8',
    );
    updateState('retarget-different-packet', { lastSpecFolder: previousSpecFolder });

    const result = await processStopHook(
      {
        session_id: 'retarget-different-packet',
        stop_hook_active: true,
        transcript_path: transcriptPath,
      },
      { autosaveMode: 'disabled' },
    );

    expect(result.autosaveMode).toBe('disabled');
    expect(result.autosaveOutcome).toBe('skipped');
    expect(result.retargetReason).toBe('detected_different_packet');
    expect(loadState('retarget-different-packet')?.lastSpecFolder).toBe(nextSpecFolder);
  });

  it('distinguishes ambiguous transcript evidence from transcript I/O failures', async () => {
    const ambiguousTranscriptPath = join(sandboxRoot!, 'ambiguous-transcript.jsonl');
    const currentSpecFolder = 'specs/system-spec-kit/024-compact-code-graph/029-review-remediation';
    writeFileSync(
      ambiguousTranscriptPath,
      [
        'specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md',
        'specs/system-spec-kit/024-compact-code-graph/030-review-playbook/tasks.md',
      ].join('\n'),
      'utf-8',
    );

    updateState('ambiguous-retarget', { lastSpecFolder: currentSpecFolder });
    const ambiguousResult = await processStopHook(
      {
        session_id: 'ambiguous-retarget',
        stop_hook_active: true,
        transcript_path: ambiguousTranscriptPath,
      },
      { autosaveMode: 'disabled' },
    );

    expect(ambiguousResult.retargetReason).toBe('ambiguous_transcript');
    expect(loadState('ambiguous-retarget')?.lastSpecFolder).toBe(currentSpecFolder);

    updateState('io-failed-retarget', { lastSpecFolder: currentSpecFolder });
    const ioFailedResult = await processStopHook(
      {
        session_id: 'io-failed-retarget',
        stop_hook_active: true,
        transcript_path: join(sandboxRoot!, 'missing-transcript.jsonl'),
      },
      { autosaveMode: 'disabled' },
    );

    expect(ioFailedResult.retargetReason).toBe('transcript_io_failed');
    expect(loadState('io-failed-retarget')?.lastSpecFolder).toBe(currentSpecFolder);
  });

  it('keeps transcript offsets monotonic when later writes carry an older offset', () => {
    updateState('offset-monotonic-session', {
      metrics: {
        estimatedPromptTokens: 10,
        estimatedCompletionTokens: 5,
        lastTranscriptOffset: 4096,
      },
    });

    const state = updateState('offset-monotonic-session', {
      metrics: {
        estimatedPromptTokens: 20,
        estimatedCompletionTokens: 10,
        lastTranscriptOffset: 128,
      },
    });

    expect(state.metrics.estimatedPromptTokens).toBe(20);
    expect(state.metrics.lastTranscriptOffset).toBe(4096);
  });

  it('never persists a transient zero transcript offset during stop-hook token snapshot writes', async () => {
    const transcriptPath = join(sandboxRoot!, 'offset-sentinel-transcript.jsonl');
    const transcriptLine = JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        model: 'claude-sonnet',
        usage: {
          input_tokens: 120,
          output_tokens: 45,
          cache_creation_input_tokens: 10,
          cache_read_input_tokens: 5,
        },
      },
    });
    const transcriptText = `${transcriptLine}\n`;
    writeFileSync(transcriptPath, transcriptText, 'utf-8');
    updateState('offset-sentinel-session', {
      lastSpecFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review',
      metrics: {
        estimatedPromptTokens: 1,
        estimatedCompletionTokens: 1,
        lastTranscriptOffset: 0,
      },
    });

    const persistedOffsets: number[] = [];
    const originalWriteFileSync = fs.writeFileSync.bind(fs);

    const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((...args: Parameters<typeof fs.writeFileSync>) => {
      const [filePath, data] = args;
      if (typeof filePath === 'string' && filePath.includes('.tmp-') && typeof data === 'string') {
        const parsed = JSON.parse(data) as { metrics?: { lastTranscriptOffset?: number } };
        if (typeof parsed.metrics?.lastTranscriptOffset === 'number') {
          persistedOffsets.push(parsed.metrics.lastTranscriptOffset);
        }
      }
      return originalWriteFileSync(...args);
    });

    try {
      const result = await processStopHook(
        {
          session_id: 'offset-sentinel-session',
          stop_hook_active: true,
          transcript_path: transcriptPath,
        },
        { autosaveMode: 'disabled' },
      );

      const finalState = loadState('offset-sentinel-session');
      expect(result.parsedMessageCount).toBe(1);
      expect(result.producerMetadataWritten).toBe(true);
      expect(persistedOffsets.length).toBeGreaterThan(0);
      expect(persistedOffsets).not.toContain(0);
      expect(finalState?.metrics.lastTranscriptOffset).toBe(Buffer.byteLength(transcriptText, 'utf-8'));
    } finally {
      writeSpy.mockRestore();
    }
  });
});
