import { afterEach, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { createStopReplaySandbox, type StopReplaySandbox } from '../test/hooks/replay-harness.js';

describe.sequential('Claude session-stop replay harness', () => {
  const fixturePath = fileURLToPath(new URL('./fixtures/hooks/session-stop-replay.jsonl', import.meta.url));
  let sandbox: StopReplaySandbox | null = null;

  afterEach(() => {
    sandbox?.cleanup();
    sandbox = null;
  });

  it('isolates state writes inside the replay sandbox and persists producer metadata', async () => {
    sandbox = createStopReplaySandbox(fixturePath, 'producer-metadata-session');

    const run = await sandbox.run();

    expect(run.process.autosaveMode).toBe('disabled');
    expect(run.process.autosaveOutcome).toBe('skipped');
    expect(run.process.retargetReason).toBe('no_previous_packet');
    expect(run.process.parsedMessageCount).toBe(2);
    expect(run.process.producerMetadataWritten).toBe(true);
    expect(run.process.touchedPaths).toHaveLength(1);
    expect(run.process.touchedPaths[0].startsWith(sandbox.sandboxRoot)).toBe(true);
    expect(run.state).not.toBeNull();
    expect(run.state!.producerMetadata).not.toBeNull();
    expect(run.state!.producerMetadata!.lastClaudeTurnAt).toBeTruthy();
    expect(run.state!.producerMetadata!.transcript).toMatchObject({
      path: sandbox.transcriptPath,
      sizeBytes: expect.any(Number),
      modifiedAt: expect.any(String),
    });
    expect(run.state!.producerMetadata!.transcript!.fingerprint).toHaveLength(16);
    expect(run.state!.producerMetadata!.cacheTokens).toEqual({
      cacheCreationInputTokens: 40,
      cacheReadInputTokens: 20,
    });
    expect(run.state!.lastSpecFolder).toBe(
      'specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks',
    );
  });

  it('replaying the same transcript twice keeps totals stable and avoids duplicate producer markers', async () => {
    sandbox = createStopReplaySandbox(fixturePath, 'double-replay-session');

    const firstRun = await sandbox.run();
    const secondRun = await sandbox.run();

    expect(firstRun.process.parsedMessageCount).toBe(2);
    expect(firstRun.process.autosaveOutcome).toBe('skipped');
    expect(firstRun.process.retargetReason).toBe('no_previous_packet');
    expect(secondRun.process.parsedMessageCount).toBe(0);
    expect(secondRun.process.autosaveOutcome).toBe('skipped');
    expect(secondRun.process.retargetReason).toBeNull();
    expect(secondRun.stateFileCount).toBe(1);
    expect(secondRun.state).not.toBeNull();
    expect(secondRun.state!.metrics).toEqual(firstRun.state!.metrics);
    expect(secondRun.state!.producerMetadata).toEqual(firstRun.state!.producerMetadata);
    expect(secondRun.state!.claudeSessionId).toBe('double-replay-session');
    expect(secondRun.state!.speckitSessionId).toBeNull();
  });

  // T-SST-10 (R31-002/R32-002) replay: the first run parses the fixture,
  // triggers a first-time spec folder detection, and writes state. All
  // three dimensions (metrics+producer, retarget, summary) can land in a
  // single `touchedPaths` entry because the handler now collapses them
  // into one atomic `updateState()` call. The second run finds a state
  // that already reflects the prior transcript, so no patch accumulates
  // and `touchedPaths` is empty.
  it('produces exactly one touchedPaths entry per stop event even when retarget + transcript metrics land together (T-SST-10 replay)', async () => {
    sandbox = createStopReplaySandbox(fixturePath, 'atomic-replay-session');

    const firstRun = await sandbox.run();
    const secondRun = await sandbox.run();

    // First run: retarget (no_previous_packet) + metrics + producer
    // metadata must all coalesce into a single atomic write.
    expect(firstRun.process.retargetReason).toBe('no_previous_packet');
    expect(firstRun.process.producerMetadataWritten).toBe(true);
    expect(firstRun.process.touchedPaths).toHaveLength(1);

    // Second run: no new transcript bytes, state already has the target
    // packet, no summary input → no patch, no touched paths.
    expect(secondRun.process.retargetReason).toBeNull();
    expect(secondRun.process.producerMetadataWritten).toBe(false);
    expect(secondRun.process.touchedPaths).toHaveLength(0);
  });
});
