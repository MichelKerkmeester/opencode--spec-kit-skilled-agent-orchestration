import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import {
  applyCachedSummaryAdditively,
  CACHED_SESSION_SUMMARY_MAX_AGE_MS,
  CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
  evaluateCachedSessionSummaryCandidate,
  type CachedSessionSummaryCandidate,
} from '../../mcp_server/handlers/session-resume.js';

const NOW_MS = Date.parse('2026-04-08T12:00:00.000Z');
const VALID_SPEC_FOLDER = 'specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated';

function buildTranscriptFingerprint(
  transcriptPath: string,
  sizeBytes: number,
  modifiedAtMs: number,
): string {
  return createHash('sha256')
    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
    .digest('hex')
    .slice(0, 16);
}

function countPresentFields(
  value: Record<string, unknown>,
  requiredFields: readonly string[],
): number {
  return requiredFields.filter((field) => value[field] !== undefined && value[field] !== null).length;
}

describe('cached SessionStart consumer corpus', () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    while (tempRoots.length > 0) {
      const tempRoot = tempRoots.pop();
      if (tempRoot) {
        rmSync(tempRoot, { recursive: true, force: true });
      }
    }
  });

  function createCandidate(options: {
    specFolder?: string;
    summaryText?: string;
    extractedAt?: string;
    schemaVersion?: number;
    fingerprintOverride?: string;
  } = {}): CachedSessionSummaryCandidate {
    const tempRoot = mkdtempSync(join(tmpdir(), 'speckit-cached-consumer-'));
    tempRoots.push(tempRoot);

    const transcriptPath = join(tempRoot, 'transcript.jsonl');
    writeFileSync(
      transcriptPath,
      '{"type":"message","message":{"role":"assistant","content":[{"type":"text","text":"packet 012 continuity summary"}]}}\n',
      'utf-8',
    );

    const modifiedAt = new Date(NOW_MS - 2 * 60 * 1000);
    utimesSync(transcriptPath, modifiedAt, modifiedAt);
    const transcriptStat = statSync(transcriptPath);
    const fingerprint = options.fingerprintOverride
      ?? buildTranscriptFingerprint(transcriptPath, transcriptStat.size, transcriptStat.mtimeMs);

    return {
      schemaVersion: options.schemaVersion ?? CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
      lastSpecFolder: options.specFolder ?? VALID_SPEC_FOLDER,
      summaryText: options.summaryText ?? 'Guarded cached continuity summary from packet 012.',
      extractedAt: options.extractedAt ?? new Date(NOW_MS - 60 * 1000).toISOString(),
      stateUpdatedAt: new Date(NOW_MS - 30 * 1000).toISOString(),
      producerMetadata: {
        lastClaudeTurnAt: modifiedAt.toISOString(),
        transcript: {
          path: transcriptPath,
          fingerprint,
          sizeBytes: transcriptStat.size,
          modifiedAt: modifiedAt.toISOString(),
        },
        cacheTokens: {
          cacheCreationInputTokens: 120,
          cacheReadInputTokens: 60,
        },
      },
    };
  }

  it('matches the frozen corpus outcomes for stale, scope mismatch, fidelity failure, and valid reuse', () => {
    const corpus = [
      {
        name: 'stale',
        candidate: createCandidate({
          extractedAt: new Date(NOW_MS - CACHED_SESSION_SUMMARY_MAX_AGE_MS - 60 * 1000).toISOString(),
        }),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'rejected', category: 'freshness', reason: 'stale_summary' },
      },
      {
        name: 'scope mismatch',
        candidate: createCandidate({
          specFolder: 'specs/system-spec-kit/026-graph-and-context-optimization/010-fts-capability-cascade-floor',
        }),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'rejected', category: 'freshness', reason: 'scope_mismatch' },
      },
      {
        name: 'fidelity failure',
        candidate: createCandidate({
          schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION + 1,
        }),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'rejected', category: 'fidelity', reason: 'schema_version_mismatch' },
      },
      {
        name: 'valid',
        candidate: createCandidate(),
        specFolder: VALID_SPEC_FOLDER,
        expected: { status: 'accepted', category: 'accepted', reason: 'accepted' },
      },
    ] as const;

    for (const scenario of corpus) {
      const decision = evaluateCachedSessionSummaryCandidate(scenario.candidate, {
        specFolder: scenario.specFolder,
        nowMs: NOW_MS,
      });

      expect(decision.status, scenario.name).toBe(scenario.expected.status);
      expect(decision.category, scenario.name).toBe(scenario.expected.category);
      expect(decision.reason, scenario.name).toBe(scenario.expected.reason);
    }
  });

  it('keeps the valid additive path at or above the live baseline pass rate', () => {
    const decision = evaluateCachedSessionSummaryCandidate(createCandidate(), {
      specFolder: VALID_SPEC_FOLDER,
      nowMs: NOW_MS,
    });

    expect(decision.status).toBe('accepted');

    const liveBaseline = {
      memory: { resumed: true },
      codeGraph: { status: 'fresh' },
      cocoIndex: { available: true },
      structuralContext: { status: 'ready' },
    };
    const additiveResult = applyCachedSummaryAdditively(liveBaseline, decision);
    const requiredFields = ['memory', 'codeGraph', 'cocoIndex', 'structuralContext', 'cachedSummary'] as const;

    const baselineScore = countPresentFields(liveBaseline, requiredFields);
    const additiveScore = countPresentFields(additiveResult, requiredFields);

    expect(baselineScore).toBe(4);
    expect(additiveScore).toBeGreaterThanOrEqual(baselineScore);
    expect(additiveResult.cachedSummary?.continuityText).toContain('Last session worked on');
    expect(additiveResult.cachedSummary?.summaryText).toContain('packet 012');
  });
});
