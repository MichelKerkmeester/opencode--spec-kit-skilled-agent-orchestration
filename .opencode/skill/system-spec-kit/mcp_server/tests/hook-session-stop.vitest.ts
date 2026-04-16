import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ensureStateDir, updateState } from '../hooks/claude/hook-state.js';
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
    expect(result.touchedPaths).toEqual([]);
    expect(result.producerMetadataWritten).toBe(false);
  });
});
