import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildSkillAdvisorBrief,
  clearAdvisorBriefCacheForTests,
} from '../lib/skill-advisor/skill-advisor-brief.js';
import type { AdvisorFreshnessResult } from '../lib/skill-advisor/freshness.js';
import { getAdvisorFreshness } from '../lib/skill-advisor/freshness.js';
import { runAdvisorSubprocess } from '../lib/skill-advisor/subprocess.js';

vi.mock('../lib/skill-advisor/freshness.js', () => ({
  getAdvisorFreshness: vi.fn(),
}));

vi.mock('../lib/skill-advisor/subprocess.js', () => ({
  runAdvisorSubprocess: vi.fn(),
}));

const workspaceRoot = '/tmp/advisor-brief-producer';
const options = {
  workspaceRoot,
  runtime: 'codex' as const,
};

function freshness(overrides: Partial<AdvisorFreshnessResult> = {}): AdvisorFreshnessResult {
  return {
    state: 'live',
    generation: 1,
    sourceSignature: 'sig-live',
    skillFingerprints: new Map([
      ['sk-code-opencode', { skillMdMtime: 1, skillMdSize: 10, graphMetaMtime: 1 }],
      ['sk-doc', { skillMdMtime: 1, skillMdSize: 10, graphMetaMtime: 1 }],
    ]),
    fallbackMode: 'sqlite',
    probedAt: '2026-04-19T09:30:00.000Z',
    diagnostics: null,
    ...overrides,
  };
}

function mockAdvisor(skill = 'sk-code-opencode') {
  vi.mocked(runAdvisorSubprocess).mockResolvedValue({
    ok: true,
    recommendations: [{
      skill,
      confidence: 0.91,
      uncertainty: 0.1,
      passes_threshold: true,
    }],
    errorCode: null,
    exitCode: 0,
    signal: null,
    stderr: null,
    durationMs: 5,
    retriesAttempted: 0,
  });
}

beforeEach(() => {
  clearAdvisorBriefCacheForTests();
  vi.mocked(getAdvisorFreshness).mockReset();
  vi.mocked(runAdvisorSubprocess).mockReset();
  vi.mocked(getAdvisorFreshness).mockReturnValue(freshness());
  mockAdvisor();
});

describe('buildSkillAdvisorBrief', () => {
  it('AS1 skips empty prompt', async () => {
    const result = await buildSkillAdvisorBrief('', options);

    expect(result.status).toBe('skipped');
    expect(result.brief).toBeNull();
    expect(runAdvisorSubprocess).not.toHaveBeenCalled();
  });

  it('AS2 skips /help', async () => {
    const result = await buildSkillAdvisorBrief('/help', options);

    expect(result.status).toBe('skipped');
    expect(result.brief).toBeNull();
    expect(runAdvisorSubprocess).not.toHaveBeenCalled();
  });

  it('AS3 fires on work-intent prompt and wraps advisor envelope', async () => {
    const result = await buildSkillAdvisorBrief('implement feature X', options);

    expect(result.status).toBe('ok');
    expect(result.brief).toContain('sk-code-opencode');
    expect(result.sharedPayload?.provenance.producer).toBe('advisor');
    expect(result.sharedPayload?.metadata?.status).toBe('ok');
    expect(runAdvisorSubprocess).toHaveBeenCalledTimes(1);
  });

  it('AS4 fail-opens on subprocess timeout', async () => {
    vi.mocked(runAdvisorSubprocess).mockResolvedValue({
      ok: false,
      recommendations: [],
      errorCode: 'SIGNAL_KILLED',
      exitCode: null,
      signal: 'SIGKILL',
      stderr: null,
      durationMs: 1000,
      retriesAttempted: 0,
    });

    const result = await buildSkillAdvisorBrief('implement feature X', options);

    expect(result.status).toBe('fail_open');
    expect(result.brief).toBeNull();
    expect(result.freshness).toBe('unavailable');
    expect(result.diagnostics?.errorCode).toBe('SIGNAL_KILLED');
  });

  it('AS5 treats JSON fallback freshness as stale ok output', async () => {
    vi.mocked(getAdvisorFreshness).mockReturnValue(freshness({
      state: 'stale',
      fallbackMode: 'json',
      diagnostics: { reason: 'JSON_FALLBACK_ONLY' },
    }));

    const result = await buildSkillAdvisorBrief('implement feature X', options);

    expect(result.status).toBe('ok');
    expect(result.freshness).toBe('stale');
    expect(result.brief).toContain('stale');
  });

  it('AS6 stale freshness returns ok with a stale badge', async () => {
    vi.mocked(getAdvisorFreshness).mockReturnValue(freshness({
      state: 'stale',
      diagnostics: { reason: 'SOURCE_NEWER_THAN_SKILL_GRAPH' },
    }));

    const result = await buildSkillAdvisorBrief('implement feature X', options);

    expect(result.status).toBe('ok');
    expect(result.freshness).toBe('stale');
    expect(result.brief).toMatch(/^Advisor: stale/);
  });

  it('AS7 absent freshness skips with null brief', async () => {
    vi.mocked(getAdvisorFreshness).mockReturnValue(freshness({
      state: 'absent',
      fallbackMode: 'none',
      diagnostics: { reason: 'SKILL_GRAPH_SQLITE_MISSING' },
    }));

    const result = await buildSkillAdvisorBrief('implement feature X', options);

    expect(result.status).toBe('skipped');
    expect(result.freshness).toBe('absent');
    expect(result.brief).toBeNull();
    expect(runAdvisorSubprocess).not.toHaveBeenCalled();
  });

  it('maps unavailable freshness to degraded with null brief', async () => {
    vi.mocked(getAdvisorFreshness).mockReturnValue(freshness({
      state: 'unavailable',
      diagnostics: { reason: 'ADVISOR_FRESHNESS_PROBE_FAILED' },
    }));

    const result = await buildSkillAdvisorBrief('implement feature X', options);

    expect(result.status).toBe('degraded');
    expect(result.freshness).toBe('unavailable');
    expect(result.brief).toBeNull();
  });

  it('AS8 exact HMAC cache hit returns identical brief without subprocess', async () => {
    const first = await buildSkillAdvisorBrief('implement feature X', options);
    vi.mocked(runAdvisorSubprocess).mockClear();
    const second = await buildSkillAdvisorBrief('implement feature X', options);

    expect(second.status).toBe('ok');
    expect(second.brief).toBe(first.brief);
    expect(second.metrics.cacheHit).toBe(true);
    expect(runAdvisorSubprocess).not.toHaveBeenCalled();
  });

  it('AS9 deleted-skill invalidates cached brief and re-runs advisor', async () => {
    mockAdvisor('sk-code-opencode');
    const first = await buildSkillAdvisorBrief('implement feature X', options);
    expect(first.brief).toContain('sk-code-opencode');

    vi.mocked(getAdvisorFreshness).mockReturnValue(freshness({
      skillFingerprints: new Map([
        ['sk-doc', { skillMdMtime: 1, skillMdSize: 10, graphMetaMtime: 1 }],
      ]),
    }));
    mockAdvisor('sk-doc');

    const second = await buildSkillAdvisorBrief('implement feature X', options);

    expect(second.status).toBe('ok');
    expect(second.brief).toContain('sk-doc');
    expect(runAdvisorSubprocess).toHaveBeenCalledTimes(2);
  });

  it('AS10 enforces the hard 120 token cap regardless of advisor output', async () => {
    vi.mocked(runAdvisorSubprocess).mockResolvedValue({
      ok: true,
      recommendations: [{
        skill: `sk-${'very-long-skill-name-'.repeat(50)}`,
        confidence: 0.91,
        uncertainty: 0.1,
        passes_threshold: true,
      }],
      errorCode: null,
      exitCode: 0,
      signal: null,
      stderr: null,
      durationMs: 5,
      retriesAttempted: 0,
    });

    const result = await buildSkillAdvisorBrief('implement feature X', {
      ...options,
      maxTokens: 999,
    });

    expect(result.metrics.tokenCap).toBe(120);
    expect(Math.ceil((result.brief?.length ?? 0) / 4)).toBeLessThanOrEqual(120);
  });

  it('records metalinguistic skill-name diagnostics without leaking prompt text', async () => {
    const result = await buildSkillAdvisorBrief('explain sk-git skill', options);

    expect(result.diagnostics?.metalinguisticMention).toEqual(['sk-git']);
    expect(JSON.stringify(result.diagnostics)).not.toContain('explain sk-git skill');
    expect(JSON.stringify(result.metrics)).not.toContain('explain sk-git skill');
    expect(JSON.stringify(result.sharedPayload)).not.toContain('explain sk-git skill');
  });
});
