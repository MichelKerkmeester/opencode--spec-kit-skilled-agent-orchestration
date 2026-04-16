import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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
});
