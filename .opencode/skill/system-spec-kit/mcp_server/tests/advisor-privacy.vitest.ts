import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createAdvisorPromptCacheKey } from '../skill-advisor/lib/prompt-cache.js';
import {
  buildSkillAdvisorBrief,
  clearAdvisorBriefCacheForTests,
} from '../skill-advisor/lib/skill-advisor-brief.js';
import type { AdvisorFreshnessResult } from '../skill-advisor/lib/freshness.js';
import { getAdvisorFreshness } from '../skill-advisor/lib/freshness.js';
import { runAdvisorSubprocess } from '../skill-advisor/lib/subprocess.js';
import { renderAdvisorBrief } from '../skill-advisor/lib/render.js';
import {
  buildAdvisorHookHealthSection,
  createAdvisorHookDiagnosticRecord,
  getAdvisorHookMetricDefinitions,
  serializeAdvisorHookDiagnosticRecord,
} from '../skill-advisor/lib/metrics.js';

vi.mock('../skill-advisor/lib/freshness.js', () => ({
  getAdvisorFreshness: vi.fn(),
}));

vi.mock('../skill-advisor/lib/subprocess.js', () => ({
  runAdvisorSubprocess: vi.fn(),
}));

const workspaceRoot = '/tmp/advisor-privacy';
const sensitivePrompts = [
  'implement config handling for api_key=SECRET_ABC123 without leaking it',
  'write a validation test because my password is hunter2',
] as const;

function freshness(): AdvisorFreshnessResult {
  return {
    state: 'live',
    generation: 7,
    sourceSignature: 'privacy-source-signature',
    skillFingerprints: new Map([
      ['sk-code-opencode', { skillMdMtime: 1, skillMdSize: 10, graphMetaMtime: 1 }],
    ]),
    fallbackMode: 'sqlite',
    probedAt: '2026-04-19T10:00:00.000Z',
    diagnostics: null,
  };
}

function assertRawPromptAbsent(surfaceName: string, surface: unknown, prompt: string): void {
  const serialized = typeof surface === 'string' ? surface : JSON.stringify(surface);
  expect(serialized, `${surfaceName} leaked prompt`).not.toContain(prompt);
  for (const token of ['SECRET_ABC123', 'hunter2']) {
    expect(serialized, `${surfaceName} leaked ${token}`).not.toContain(token);
  }
}

beforeEach(() => {
  clearAdvisorBriefCacheForTests();
  vi.mocked(getAdvisorFreshness).mockReset();
  vi.mocked(runAdvisorSubprocess).mockReset();
  vi.mocked(getAdvisorFreshness).mockReturnValue(freshness());
  vi.mocked(runAdvisorSubprocess).mockResolvedValue({
    ok: true,
    recommendations: [{
      skill: 'sk-code-opencode',
      confidence: 0.91,
      uncertainty: 0.23,
      passes_threshold: true,
      reason: 'sensitive reason text is not rendered',
    }],
    errorCode: null,
    exitCode: 0,
    signal: null,
    stderr: null,
    durationMs: 5,
    retriesAttempted: 0,
  });
});

describe('advisor privacy audit', () => {
  it('keeps raw prompts out of envelope sources, metrics, stderr JSONL, health, and cache keys', async () => {
    for (const prompt of sensitivePrompts) {
      const result = await buildSkillAdvisorBrief(prompt, {
        workspaceRoot,
        runtime: 'codex',
      });
      const rendered = renderAdvisorBrief(result);
      const cacheKey = createAdvisorPromptCacheKey({
        canonicalPrompt: prompt,
        sourceSignature: 'privacy-source-signature',
        runtime: 'codex',
      }, Buffer.from('privacy-test-secret'));
      const diagnostic = createAdvisorHookDiagnosticRecord({
        timestamp: '2026-04-19T10:00:00.000Z',
        runtime: 'codex',
        status: result.status,
        freshness: result.freshness,
        durationMs: result.metrics.durationMs,
        cacheHit: result.metrics.cacheHit,
        skillLabel: result.recommendations[0]?.skill ?? null,
        generation: 7,
      });
      const stderrJsonl = serializeAdvisorHookDiagnosticRecord(diagnostic);
      const health = buildAdvisorHookHealthSection([diagnostic]);
      const metricDefinitions = getAdvisorHookMetricDefinitions();

      expect(cacheKey).toMatch(/^[a-f0-9]{64}$/);
      assertRawPromptAbsent('rendered brief', rendered, prompt);
      assertRawPromptAbsent('shared payload envelope', result.sharedPayload, prompt);
      assertRawPromptAbsent('envelope source refs', result.sharedPayload?.provenance.sourceRefs, prompt);
      assertRawPromptAbsent('metric labels', metricDefinitions, prompt);
      assertRawPromptAbsent('stderr diagnostic jsonl', stderrJsonl, prompt);
      assertRawPromptAbsent('advisor-hook-health', health, prompt);
      assertRawPromptAbsent('cache key', cacheKey, prompt);
    }
  });
});
