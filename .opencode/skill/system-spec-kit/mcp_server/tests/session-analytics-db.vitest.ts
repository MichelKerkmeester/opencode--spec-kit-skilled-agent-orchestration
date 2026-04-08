import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cpSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { HookState } from '../hooks/claude/hook-state.js';
import { parseTranscriptTurns } from '../hooks/claude/claude-transcript.js';
import {
  closeSessionAnalyticsDb,
  getSessionAnalyticsDb,
  getSessionAnalyticsDbPath,
  ingestSessionAnalytics,
  listModelPricing,
  listNormalizedCacheTiers,
  listSessionAnalyticsSessions,
  listSessionTurns,
  SESSION_ANALYTICS_DB_FILENAME,
} from '../lib/analytics/session-analytics-db.js';

function buildHookState(
  transcriptPath: string,
  overrides: Partial<HookState> = {},
): HookState {
  const transcriptStat = statSync(transcriptPath);
  const now = transcriptStat.mtime.toISOString();

  return {
    claudeSessionId: 'analytics-session',
    speckitSessionId: null,
    lastSpecFolder: 'specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader',
    sessionSummary: null,
    pendingCompactPrime: null,
    producerMetadata: {
      lastClaudeTurnAt: now,
      transcript: {
        path: transcriptPath,
        fingerprint: `${transcriptStat.size}-${Math.round(transcriptStat.mtimeMs)}`,
        sizeBytes: transcriptStat.size,
        modifiedAt: now,
      },
      cacheTokens: {
        cacheCreationInputTokens: 40,
        cacheReadInputTokens: 20,
      },
    },
    metrics: {
      estimatedPromptTokens: 0,
      estimatedCompletionTokens: 0,
      lastTranscriptOffset: 0,
    },
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe.sequential('session analytics DB', () => {
  const fixturePath = fileURLToPath(new URL('./fixtures/hooks/session-stop-replay.jsonl', import.meta.url));

  let tempDir: string;
  let transcriptPath: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'speckit-session-analytics-'));
    transcriptPath = join(tempDir, basename(fixturePath));
    cpSync(fixturePath, transcriptPath);
  });

  afterEach(() => {
    closeSessionAnalyticsDb();
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('parses transcript turns with stable byte offsets and absolute line numbers', async () => {
    const initial = await parseTranscriptTurns(transcriptPath);
    expect(initial.turns).toHaveLength(2);
    expect(initial.turns[0]).toMatchObject({
      lineNo: 2,
      byteStart: expect.any(Number),
      byteEnd: expect.any(Number),
      promptTokens: 120,
      completionTokens: 60,
      cacheCreationTokens: 40,
      cacheReadTokens: 20,
    });
    expect(initial.turns[1]).toMatchObject({
      lineNo: 3,
      promptTokens: 80,
      completionTokens: 40,
    });

    writeFileSync(
      transcriptPath,
      [
        '{"message":{"role":"user","content":"Work on .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md"}}',
        '{"message":{"role":"assistant","usage":{"input_tokens":120,"output_tokens":60,"cache_creation_input_tokens":40,"cache_read_input_tokens":20},"model":"claude-sonnet-4-6","content":"Updated the producer-side continuity packet."}}',
        '{"message":{"role":"assistant","usage":{"input_tokens":80,"output_tokens":40},"content":"Next I will wire replay isolation and idempotency coverage."}}',
        '{"message":{"role":"assistant","usage":{"input_tokens":30,"output_tokens":10},"model":"claude-sonnet-4-6","content":"Appended replay-ready metrics."}}',
      ].join('\n') + '\n',
      'utf-8',
    );

    const appended = await parseTranscriptTurns(transcriptPath, initial.newOffset);
    expect(appended.turns).toHaveLength(1);
    expect(appended.turns[0]).toMatchObject({
      lineNo: 4,
      promptTokens: 30,
      completionTokens: 10,
    });
    expect(appended.turns[0].byteStart).toBe(initial.newOffset);
  });

  it('creates normalized tables, seeds pricing metadata, and ingests the first replay', async () => {
    const state = buildHookState(transcriptPath);

    const result = await ingestSessionAnalytics(state, { dataDir: tempDir });

    expect(getSessionAnalyticsDbPath()).toBe(join(tempDir, SESSION_ANALYTICS_DB_FILENAME));
    expect(result.insertedTurns).toBe(2);
    expect(result.sessionUpserted).toBe(true);
    expect(result.session).toMatchObject({
      claude_session_id: 'analytics-session',
      speckit_session_id: null,
      transcript_path: transcriptPath,
      transcript_size_bytes: statSync(transcriptPath).size,
      prompt_tokens: 200,
      completion_tokens: 100,
      cache_creation_input_tokens: 40,
      cache_read_input_tokens: 20,
      total_tokens: 300,
      turn_count: 2,
      last_spec_folder: 'specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader',
    });
    expect(result.session.last_replay_offset).toBe(statSync(transcriptPath).size);
    expect(result.session.estimated_total_cost_usd).toBeCloseTo(0.0023, 4);

    const db = getSessionAnalyticsDb();
    const tables = (db.prepare(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
      ORDER BY name ASC
    `).all() as Array<{ name: string }>).map((row) => row.name);
    expect(tables).toContain('analytics_sessions');
    expect(tables).toContain('analytics_turns');
    expect(tables).toContain('model_pricing_versioned');
    expect(tables).toContain('cache_tier_normalized');

    const turns = listSessionTurns('analytics-session');
    expect(turns).toHaveLength(2);
    expect(turns[0]).toMatchObject({
      line_no: 2,
      pricing_key: 'claude-sonnet-family-default',
      prompt_tokens: 120,
      completion_tokens: 60,
      cache_creation_input_tokens: 40,
      cache_read_input_tokens: 20,
      estimated_total_cost_usd: 0.0015,
    });
    expect(turns[1]).toMatchObject({
      line_no: 3,
      pricing_key: 'claude-sonnet-family-default',
      prompt_tokens: 80,
      completion_tokens: 40,
      estimated_total_cost_usd: 0.0008,
    });

    expect(listSessionAnalyticsSessions()).toHaveLength(1);
    expect(listModelPricing().map((row) => row.pricing_key)).toEqual([
      'claude-haiku-family-default',
      'claude-opus-family-default',
      'claude-sonnet-family-default',
    ]);
    expect(listNormalizedCacheTiers()).toEqual([
      {
        cache_tier: 'cache_read',
        source_field: 'cache_read_input_tokens',
        description: 'Normalized cache-read tier sourced from Claude transcript cache read tokens.',
      },
      {
        cache_tier: 'cache_write',
        source_field: 'cache_creation_input_tokens',
        description: 'Normalized cache-write tier sourced from Claude transcript cache creation tokens.',
      },
    ]);
  });

  it('keeps session totals stable on replay and only appends newly grown transcript turns', async () => {
    const initialState = buildHookState(transcriptPath);
    const firstReplay = await ingestSessionAnalytics(initialState, { dataDir: tempDir });
    const secondReplay = await ingestSessionAnalytics(initialState, { dataDir: tempDir });

    expect(firstReplay.insertedTurns).toBe(2);
    expect(secondReplay.insertedTurns).toBe(0);
    expect(secondReplay.session.prompt_tokens).toBe(firstReplay.session.prompt_tokens);
    expect(secondReplay.session.completion_tokens).toBe(firstReplay.session.completion_tokens);
    expect(secondReplay.session.estimated_total_cost_usd).toBe(firstReplay.session.estimated_total_cost_usd);
    expect(listSessionTurns('analytics-session')).toHaveLength(2);

    writeFileSync(
      transcriptPath,
      [
        '{"message":{"role":"user","content":"Work on .opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/spec.md"}}',
        '{"message":{"role":"assistant","usage":{"input_tokens":120,"output_tokens":60,"cache_creation_input_tokens":40,"cache_read_input_tokens":20},"model":"claude-sonnet-4-6","content":"Updated the producer-side continuity packet."}}',
        '{"message":{"role":"assistant","usage":{"input_tokens":80,"output_tokens":40},"content":"Next I will wire replay isolation and idempotency coverage."}}',
        '{"message":{"role":"assistant","usage":{"input_tokens":30,"output_tokens":10},"model":"claude-sonnet-4-6","content":"Appended replay-ready metrics."}}',
      ].join('\n') + '\n',
      'utf-8',
    );

    const grownState = buildHookState(transcriptPath);
    const thirdReplay = await ingestSessionAnalytics(grownState, { dataDir: tempDir });

    expect(thirdReplay.insertedTurns).toBe(1);
    expect(thirdReplay.session.turn_count).toBe(3);
    expect(thirdReplay.session.prompt_tokens).toBe(230);
    expect(thirdReplay.session.completion_tokens).toBe(110);
    expect(thirdReplay.session.total_tokens).toBe(340);
    expect(thirdReplay.session.last_replay_offset).toBe(statSync(transcriptPath).size);
    expect(thirdReplay.session.transcript_size_bytes).toBe(statSync(transcriptPath).size);
    expect(thirdReplay.session.estimated_total_cost_usd).toBeCloseTo(0.0026, 4);

    const turns = listSessionTurns('analytics-session');
    expect(turns).toHaveLength(3);
    expect(turns[2]).toMatchObject({
      line_no: 4,
      prompt_tokens: 30,
      completion_tokens: 10,
      estimated_total_cost_usd: 0.0003,
    });
  });
});
