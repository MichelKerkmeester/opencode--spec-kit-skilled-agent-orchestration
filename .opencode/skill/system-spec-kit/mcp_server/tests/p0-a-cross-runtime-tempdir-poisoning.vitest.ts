import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ensureStateDir, getStatePath, loadState, saveState, type HookState } from '../hooks/claude/hook-state.js';
import { handleStartup as handleClaudeStartup } from '../hooks/claude/session-prime.js';
import { processStopHook } from '../hooks/claude/session-stop.js';
import { handleCompact as handleGeminiCompact } from '../hooks/gemini/session-prime.js';
import { getCachedSessionSummaryDecision } from '../handlers/session-resume.js';
import { buildStartupBrief } from '../lib/code-graph/startup-brief.js';

function buildTranscriptFingerprint(transcriptPath: string): {
  fingerprint: string;
  modifiedAt: string;
  sizeBytes: number;
} {
  const transcriptStat = statSync(transcriptPath);
  return {
    fingerprint: createHash('sha256')
      .update(`${transcriptPath}:${transcriptStat.size}:${transcriptStat.mtimeMs}`)
      .digest('hex')
      .slice(0, 16),
    modifiedAt: transcriptStat.mtime.toISOString(),
    sizeBytes: transcriptStat.size,
  };
}

describe.sequential('P0-A cross-runtime tempdir poisoning regression', () => {
  let sandboxRoot: string | null = null;
  let projectRoot: string | null = null;
  let tempRoot: string | null = null;
  let previousCwd: string;
  let previousTmpdir: string | undefined;

  beforeEach(() => {
    sandboxRoot = mkdtempSync(join(tmpdir(), 'speckit-p0-a-poisoning-'));
    projectRoot = join(sandboxRoot, 'project');
    tempRoot = join(sandboxRoot, 'tmp');
    mkdirSync(projectRoot, { recursive: true });
    mkdirSync(tempRoot, { recursive: true });

    previousCwd = process.cwd();
    previousTmpdir = process.env.TMPDIR;
    process.chdir(projectRoot);
    process.env.TMPDIR = tempRoot;
    ensureStateDir();
  });

  afterEach(() => {
    process.chdir(previousCwd);
    if (previousTmpdir === undefined) {
      delete process.env.TMPDIR;
    } else {
      process.env.TMPDIR = previousTmpdir;
    }
    if (sandboxRoot) {
      rmSync(sandboxRoot, { recursive: true, force: true });
    }
    sandboxRoot = null;
    projectRoot = null;
    tempRoot = null;
  });

  it('quarantines a poisoned hook-state file so Claude + Gemini consumers keep working', async () => {
    const poisonedSessionId = 'poisoned-session';
    const healthySessionId = 'healthy-session';
    const healthySpecFolder = 'specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review';
    const transcriptPath = join(sandboxRoot!, 'healthy-transcript.jsonl');
    writeFileSync(transcriptPath, '{"role":"assistant","content":"resume packet 016"}\n', 'utf-8');
    const transcriptIdentity = buildTranscriptFingerprint(transcriptPath);
    const now = new Date().toISOString();

    const healthyState: HookState = {
      claudeSessionId: healthySessionId,
      speckitSessionId: null,
      lastSpecFolder: healthySpecFolder,
      sessionSummary: {
        text: 'Continue the HookState hardening work for packet 016.',
        extractedAt: now,
      },
      pendingCompactPrime: {
        payload: '## Active Files\n- mcp_server/hooks/claude/hook-state.ts',
        cachedAt: now,
      },
      producerMetadata: {
        lastClaudeTurnAt: now,
        transcript: {
          path: transcriptPath,
          fingerprint: transcriptIdentity.fingerprint,
          sizeBytes: transcriptIdentity.sizeBytes,
          modifiedAt: transcriptIdentity.modifiedAt,
        },
        cacheTokens: {
          cacheCreationInputTokens: 12,
          cacheReadInputTokens: 6,
        },
      },
      metrics: {
        estimatedPromptTokens: 128,
        estimatedCompletionTokens: 64,
        lastTranscriptOffset: 0,
      },
      createdAt: now,
      updatedAt: now,
    };
    expect(saveState(healthySessionId, healthyState)).toBe(true);

    const poisonedStatePath = getStatePath(poisonedSessionId);
    const quarantinedStatePath = `${poisonedStatePath}.bad`;
    writeFileSync(poisonedStatePath, JSON.stringify({
      schemaVersion: 1,
      claudeSessionId: poisonedSessionId,
      speckitSessionId: null,
      lastSpecFolder: healthySpecFolder,
      sessionSummary: null,
      pendingCompactPrime: {
        payload: 42,
        cachedAt: now,
      },
      producerMetadata: null,
      metrics: {
        estimatedPromptTokens: 0,
        estimatedCompletionTokens: 0,
        lastTranscriptOffset: 0,
      },
      createdAt: now,
      updatedAt: now,
    }), 'utf-8');

    const poisonedStartupSections = handleClaudeStartup({ session_id: poisonedSessionId });

    expect(poisonedStartupSections[0]?.title).toBe('Session Context');
    expect(existsSync(poisonedStatePath)).toBe(false);
    expect(existsSync(quarantinedStatePath)).toBe(true);

    const healthyStopResult = await processStopHook(
      {
        session_id: healthySessionId,
        stop_hook_active: true,
      },
      { autosaveMode: 'disabled' },
    );
    expect(healthyStopResult.autosaveOutcome).toBe('skipped');
    expect(healthyStopResult.transcriptOutcome).toMatchObject({
      status: 'skipped',
      reason: 'no_transcript_path',
    });

    const geminiSections = handleGeminiCompact(healthySessionId);
    expect(geminiSections[0]?.title).toBe('Recovered Context (Post-Compression)');
    expect(geminiSections[0]?.content).toContain('mcp_server/hooks/claude/hook-state.ts');

    // OpenCode inherits the same schema-safe HookState reader path through the shared startup brief/session-resume surface.
    const startupBrief = buildStartupBrief(undefined, { claudeSessionId: healthySessionId });
    expect(startupBrief.sessionContinuity).toContain(healthySpecFolder);
    expect(startupBrief.sessionContinuity).toContain('Continue the HookState hardening work');

    const cachedSummaryDecision = getCachedSessionSummaryDecision({ claudeSessionId: healthySessionId });
    expect(cachedSummaryDecision).toMatchObject({
      status: 'accepted',
      reason: 'accepted',
    });
    expect(cachedSummaryDecision.cachedSummary?.lastSpecFolder).toBe(healthySpecFolder);

    const healthyStateResult = loadState(healthySessionId);
    expect(healthyStateResult.ok).toBe(true);
  });
});
