import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs, { appendFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { ensureStateDir, loadState, updateState, type PersistedHookState } from '../hooks/claude/hook-state.js';
import { detectSpecFolder, processStopHook } from '../hooks/claude/session-stop.js';

function loadPersistedState(sessionId: string): PersistedHookState | null {
  const result = loadState(sessionId);
  return result.ok ? result.state : null;
}

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

  it('rejects stop-hook payloads that omit session_id instead of collapsing into a shared bucket', async () => {
    await expect(processStopHook({ stop_hook_active: true }, { autosaveMode: 'disabled' })).rejects.toThrow(
      'session-stop hook payload missing required session_id',
    );
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
    expect(loadPersistedState('retarget-different-packet')?.lastSpecFolder).toBe(nextSpecFolder);
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
    expect(loadPersistedState('ambiguous-retarget')?.lastSpecFolder).toBe(currentSpecFolder);

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
    expect(loadPersistedState('io-failed-retarget')?.lastSpecFolder).toBe(currentSpecFolder);
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

    expect(state.merged.metrics.estimatedPromptTokens).toBe(20);
    expect(state.merged.metrics.lastTranscriptOffset).toBe(4096);
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

      const finalState = loadPersistedState('offset-sentinel-session');
      expect(result.parsedMessageCount).toBe(1);
      expect(result.producerMetadataWritten).toBe(true);
      expect(result.transcriptOutcome).toMatchObject({
        status: 'ran',
        value: {
          parsedMessageCount: 1,
          lastTranscriptOffset: Buffer.byteLength(transcriptText, 'utf-8'),
        },
      });
      expect(result.producerMetadataOutcome.status).toBe('ran');
      expect(persistedOffsets.length).toBeGreaterThan(0);
      expect(persistedOffsets).not.toContain(0);
      expect(finalState?.metrics.lastTranscriptOffset).toBe(Buffer.byteLength(transcriptText, 'utf-8'));
    } finally {
      writeSpy.mockRestore();
    }
  });

  // ────────────────────────────────────────────────────────────────
  // T-SST-10 (R31-002/R32-002): single atomic state write per stop event
  // ────────────────────────────────────────────────────────────────
  it('collapses all stop-hook state changes into a single atomic write (T-SST-10)', async () => {
    const transcriptPath = join(sandboxRoot!, 'atomic-patch-transcript.jsonl');
    const transcriptLine = JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        model: 'claude-sonnet-4-6',
        usage: {
          input_tokens: 50,
          output_tokens: 25,
          cache_creation_input_tokens: 5,
          cache_read_input_tokens: 2,
        },
      },
    });
    const transcriptText = [
      transcriptLine,
      'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/tasks.md',
    ].join('\n') + '\n';
    writeFileSync(transcriptPath, transcriptText, 'utf-8');

    // Seed prior state that forces all three dimensions to produce patch content:
    //   - lastSpecFolder differs from detected (triggers retarget)
    //   - metrics change (new transcript parse)
    //   - sessionSummary change (from last_assistant_message)
    updateState('atomic-write-session', {
      lastSpecFolder: 'specs/system-spec-kit/024-compact-code-graph/029-review-remediation',
      metrics: {
        estimatedPromptTokens: 1,
        estimatedCompletionTokens: 1,
        lastTranscriptOffset: 0,
      },
    });

    const tempWriteTargets: string[] = [];
    const originalWriteFileSync = fs.writeFileSync.bind(fs);
    const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((...args: Parameters<typeof fs.writeFileSync>) => {
      const [filePath] = args;
      if (typeof filePath === 'string' && filePath.includes('.tmp-') && filePath.endsWith('.json') === false) {
        // The atomic state write lands at `<hash>.json.tmp-<pid>-<ctr>-<rand>`,
        // so matching `.tmp-` is enough to distinguish state writes from
        // other filesystem writes in the sandbox.
        tempWriteTargets.push(filePath);
      }
      return originalWriteFileSync(...args);
    });

    try {
      const result = await processStopHook(
        {
          session_id: 'atomic-write-session',
          stop_hook_active: true,
          transcript_path: transcriptPath,
          last_assistant_message: 'Atomic write verification summary.',
        },
        { autosaveMode: 'disabled' },
      );

      expect(result.parsedMessageCount).toBe(1);
      expect(result.retargetReason).toBe('detected_different_packet');
      expect(result.producerMetadataWritten).toBe(true);
      expect(result.touchedPaths).toHaveLength(1);

      // Only ONE state file atomic rename cycle — previously the code
      // would perform three separate updateState() calls producing three
      // temp writes. The atomic patch keeps this at exactly one.
      expect(tempWriteTargets).toHaveLength(1);

      const finalState = loadPersistedState('atomic-write-session');
      expect(finalState?.lastSpecFolder).toBe(
        'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review',
      );
      expect(finalState?.sessionSummary?.text).toBe('Atomic write verification summary.');
      expect(finalState?.producerMetadata?.transcript?.sizeBytes).toBe(Buffer.byteLength(transcriptText, 'utf-8'));
      expect(finalState?.metrics.lastTranscriptOffset).toBe(Buffer.byteLength(transcriptText, 'utf-8'));
    } finally {
      writeSpy.mockRestore();
    }
  });

  // ────────────────────────────────────────────────────────────────
  // T-SST-09 (R20-001): stat snapshot frozen before producer metadata
  // ────────────────────────────────────────────────────────────────
  it('freezes transcript stat BEFORE parseTranscript so producer metadata matches the parsed generation (T-SST-09)', async () => {
    const transcriptPath = join(sandboxRoot!, 'preparse-stat-transcript.jsonl');
    const assistantTurn = JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        model: 'claude-sonnet-4-6',
        usage: {
          input_tokens: 10,
          output_tokens: 5,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        },
      },
    });
    const initialText = assistantTurn + '\n';
    writeFileSync(transcriptPath, initialText, 'utf-8');
    const preParseSize = Buffer.byteLength(initialText, 'utf-8');

    // Drive a mid-parse append by hooking fs.statSync: the first call
    // (the pre-parse snapshot in session-stop) sees the pristine file;
    // subsequent calls (including any internal parseTranscript stat) see
    // the same pristine size; but BEFORE parseTranscript finishes we
    // append bytes on disk. Once parseTranscript returns, any re-stat
    // inside buildProducerMetadata would report the larger on-disk size.
    // The correct implementation must have captured the stat before
    // parse and therefore reports `preParseSize`.
    const originalStatSync = fs.statSync.bind(fs);
    let transcriptStatCount = 0;
    const statSpy = vi.spyOn(fs, 'statSync').mockImplementation(((...args: Parameters<typeof fs.statSync>) => {
      const [candidate] = args;
      if (typeof candidate === 'string' && candidate === transcriptPath) {
        transcriptStatCount += 1;
      }
      return originalStatSync(...args);
    }) as typeof fs.statSync);

    // After parse, append more bytes to the transcript so that any
    // re-stat path in producer metadata would observe the larger size.
    const originalReadSync = fs.readSync.bind(fs);
    const readSpy = vi.spyOn(fs, 'readSync').mockImplementation(((...args: Parameters<typeof fs.readSync>) => {
      const bytesRead = originalReadSync(...args);
      return bytesRead;
    }) as typeof fs.readSync);

    try {
      // Schedule the append to happen synchronously after pre-parse stat
      // but before producer metadata build. The cleanest way is to
      // append before processStopHook resolves by racing on a microtask
      // after the parse completes. parseTranscript uses async streams,
      // so we append immediately after the first transcript stat (the
      // pre-parse capture in session-stop). From then on, any re-stat
      // path in buildProducerMetadata would see the appended size.
      const appendedLine = `${JSON.stringify({ type: 'assistant', message: { role: 'assistant', usage: { input_tokens: 1, output_tokens: 1 } } })}\n`;
      const originalStatSyncForHook = fs.statSync.bind(fs);
      statSpy.mockImplementation(((...args: Parameters<typeof fs.statSync>) => {
        const [candidate] = args;
        const stat = originalStatSyncForHook(...args);
        if (typeof candidate === 'string' && candidate === transcriptPath) {
          transcriptStatCount += 1;
          if (transcriptStatCount === 1) {
            // After the pre-parse stat, mutate the file on disk so any
            // subsequent stat path in buildProducerMetadata observes a
            // larger file. The correct implementation does not re-stat.
            appendFileSync(transcriptPath, appendedLine);
          }
        }
        return stat;
      }) as typeof fs.statSync);

      const result = await processStopHook(
        {
          session_id: 'preparse-stat-session',
          stop_hook_active: true,
          transcript_path: transcriptPath,
        },
        { autosaveMode: 'disabled' },
      );

      expect(result.producerMetadataOutcome.status).toBe('ran');
      const metadata = (result.producerMetadataOutcome as {
        value: { transcript: { sizeBytes: number; modifiedAt: string } };
      }).value;

      // Critical assertion: the stat snapshot used by buildProducerMetadata
      // MUST be the pre-parse one (`preParseSize`), NOT the post-parse
      // inflated size after our append.
      expect(metadata.transcript.sizeBytes).toBe(preParseSize);

      const finalState = loadPersistedState('preparse-stat-session');
      expect(finalState?.producerMetadata?.transcript?.sizeBytes).toBe(preParseSize);
    } finally {
      statSpy.mockRestore();
      readSpy.mockRestore();
    }
  });

  // ────────────────────────────────────────────────────────────────
  // T-SST-11 (R37-002): retarget uses refreshed lastSpecFolder, not the
  // stale snapshot taken at handler entry
  // ────────────────────────────────────────────────────────────────
  it('refreshes lastSpecFolder before detectSpecFolder so another writer cannot lock in a stale packet (T-SST-11)', async () => {
    const transcriptPath = join(sandboxRoot!, 'retarget-refresh-transcript.jsonl');
    const stalePacket = 'specs/system-spec-kit/024-compact-code-graph/029-review-remediation';
    const advancedPacket = 'specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity';

    // Transcript mentions BOTH packets. selectDetectedSpecFolder returns
    // the caller-supplied currentSpecFolder when it appears among
    // matches (otherwise null for ambiguity). The stale-snapshot bug
    // passes currentSpecFolder = stalePacket → detection validates the
    // old packet as current → no retarget surfaced AND on-disk state
    // stays pointed at stalePacket (wrong). The refresh path passes
    // currentSpecFolder = advancedPacket → detection validates the new
    // packet as current AND on-disk state is preserved at advancedPacket.
    // The observable difference is the FINAL on-disk lastSpecFolder.
    const assistantTurn = JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        model: 'claude-sonnet-4-6',
        usage: {
          input_tokens: 5,
          output_tokens: 3,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        },
      },
    });
    writeFileSync(
      transcriptPath,
      [
        assistantTurn,
        `${stalePacket}/tasks.md`,
        `${advancedPacket}/spec.md`,
        `${advancedPacket}/implementation-summary.md`,
      ].join('\n'),
      'utf-8',
    );

    // Seed pre-handler state pointing at the older packet.
    updateState('retarget-refresh-session', { lastSpecFolder: stalePacket });

    // Race-simulation via a parseTranscript spy. Transcript parsing is
    // the async work between handler-entry loadState (capturing
    // stateBeforeStop) and the detection refresh loadState. Advancing
    // on-disk state during parse simulates a concurrent writer. The
    // refresh path must then pick up the writer-advanced value instead
    // of the stale snapshot taken at handler entry.
    const transcriptModule = await import('../hooks/claude/claude-transcript.js');
    const originalParseTranscript = transcriptModule.parseTranscript.bind(transcriptModule);
    const parseSpy = vi.spyOn(transcriptModule, 'parseTranscript').mockImplementation(async (filePath, startOffset) => {
      const result = await originalParseTranscript(filePath, startOffset);
      // Concurrent writer advances packet target mid-parse.
      updateState('retarget-refresh-session', { lastSpecFolder: advancedPacket });
      return result;
    });

    try {
      const result = await processStopHook(
        {
          session_id: 'retarget-refresh-session',
          stop_hook_active: true,
          transcript_path: transcriptPath,
        },
        { autosaveMode: 'disabled' },
      );

      // Final on-disk state must be advancedPacket — the writer-advanced
      // generation — not the stale pre-handler snapshot. Under the bug,
      // session-stop's single atomic patch would rewrite lastSpecFolder
      // with the stale currentSpecFolder preference, clobbering the
      // concurrent writer. The refresh + atomic patch together preserve
      // the advanced value: detection sees advancedPacket as current,
      // emits no retarget patch, and the writer-advanced state persists.
      expect(loadPersistedState('retarget-refresh-session')?.lastSpecFolder).toBe(advancedPacket);
      expect(result.retargetReason).toBeNull();
    } finally {
      parseSpy.mockRestore();
    }
  });

  // ────────────────────────────────────────────────────────────────
  // T-SST-12 (R33-003): autosave aborts on persisted:false
  // ────────────────────────────────────────────────────────────────
  it('aborts autosave when the atomic state write fails to persist (T-SST-12)', async () => {
    const transcriptPath = join(sandboxRoot!, 'persist-fail-transcript.jsonl');
    const transcriptLine = JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        model: 'claude-sonnet-4-6',
        usage: {
          input_tokens: 30,
          output_tokens: 20,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 0,
        },
      },
    });
    writeFileSync(transcriptPath, `${transcriptLine}\n`, 'utf-8');

    // Seed a valid pre-existing state so the autosave WOULD run if the
    // persist-failure check were missing.
    updateState('persist-fail-session', {
      lastSpecFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review',
      sessionSummary: {
        text: 'Pre-existing summary',
        extractedAt: new Date().toISOString(),
      },
    });

    // Provide a generate-context script that would SUCCEED if invoked.
    // The test's assertion that it is NOT invoked therefore proves the
    // abort path in session-stop consumed persisted:false correctly.
    const autosaveScriptPath = join(projectRoot!, 'marker-autosave.js');
    const autosaveMarkerPath = join(projectRoot!, 'autosave-invoked.marker');
    writeFileSync(
      autosaveScriptPath,
      `require('node:fs').writeFileSync(${JSON.stringify(autosaveMarkerPath)}, 'invoked');\n`,
      'utf-8',
    );
    process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT = autosaveScriptPath;

    const originalWriteFileSync = fs.writeFileSync.bind(fs);
    let stateFileFailuresIssued = 0;
    const writeSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation((...args: Parameters<typeof fs.writeFileSync>) => {
      const [filePath] = args;
      // Fail ONLY the next atomic state temp write inside the handler's
      // single updateState() call. Seeding updateState above has already
      // written the pre-existing state so we do not break setup.
      if (
        typeof filePath === 'string'
        && filePath.includes('.tmp-')
        && !filePath.endsWith(autosaveMarkerPath)
        && stateFileFailuresIssued === 0
        && filePath.endsWith('.json') === false
      ) {
        stateFileFailuresIssued += 1;
        throw new Error('Simulated atomic state write failure');
      }
      return originalWriteFileSync(...args);
    });

    try {
      const result = await processStopHook(
        {
          session_id: 'persist-fail-session',
          stop_hook_active: true,
          transcript_path: transcriptPath,
          last_assistant_message: 'Summary that should never persist.',
        },
        { autosaveMode: 'enabled' },
      );

      // The state write failed, so autosave must report 'failed' and
      // the continuity script must NOT have been spawned.
      expect(result.autosaveOutcome).toBe('failed');
      expect(result.touchedPaths).toEqual([]);
      expect(stateFileFailuresIssued).toBe(1);
      expect(fs.existsSync(autosaveMarkerPath)).toBe(false);
    } finally {
      writeSpy.mockRestore();
    }
  });
});
