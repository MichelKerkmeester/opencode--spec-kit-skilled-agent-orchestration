import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const mocks = vi.hoisted(() => ({
  readAdvisorStatus: vi.fn(),
}));

vi.mock('../../skill_advisor/handlers/advisor-status.js', () => ({
  readAdvisorStatus: mocks.readAdvisorStatus,
}));

import { advisorPromptCache } from '../../skill_advisor/lib/prompt-cache.js';
import { handleAdvisorRecommend } from '../../skill_advisor/handlers/advisor-recommend.js';

interface HandlerResponsePayload {
  readonly status: string;
  readonly data: {
    readonly workspaceRoot: string;
    readonly recommendations: Array<{
      readonly skillId: string;
      readonly dominantLane: string | null;
      readonly laneBreakdown?: unknown[];
    }>;
    readonly freshness: string;
    readonly warnings?: string[];
    readonly abstainReasons?: string[];
    readonly cache: {
      readonly hit: boolean;
    };
  };
}

describe('sa-025 — advisor_recommend MCP tool', () => {
  let tmpDir: string;
  let workspaceRoot: string;
  let shadowPath: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(process.cwd(), 'stress-sa-025-'));
    workspaceRoot = join(tmpDir, 'workspace');
    shadowPath = join(tmpDir, 'shadow-deltas.jsonl');
    mkdirSync(workspaceRoot, { recursive: true });
    process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH = shadowPath;
    advisorPromptCache.clear();
    mocks.readAdvisorStatus.mockReturnValue(status('live'));
  });

  afterEach(() => {
    advisorPromptCache.clear();
    vi.clearAllMocks();
    delete process.env.SPECKIT_ADVISOR_SHADOW_DELTA_PATH;
    rmSync(tmpDir, { recursive: true, force: true });
  });

  function status(freshness: 'live' | 'stale' | 'absent' | 'unavailable') {
    return {
      freshness,
      generation: freshness === 'absent' ? 0 : 11,
      trustState: {
        state: freshness,
        reason: freshness === 'stale' ? 'SOURCE_NEWER_THAN_SKILL_GRAPH' : null,
        generation: freshness === 'absent' ? 0 : 11,
        checkedAt: '2026-04-30T00:00:00.000Z',
        lastLiveAt: freshness === 'live' ? '2026-04-30T00:00:00.000Z' : null,
      },
      lastGenerationBump: freshness === 'absent' ? null : '2026-04-30T00:00:00.000Z',
      lastScanAt: freshness === 'absent' ? null : '2026-04-30T00:00:00.000Z',
      skillCount: freshness === 'absent' ? 0 : 25,
      laneWeights: {
        explicit_author: 0.45,
        lexical: 0.3,
        graph_causal: 0.15,
        derived_generated: 0.1,
        semantic_shadow: 0,
      },
    };
  }

  function parseResponse(response: { content: Array<{ type: string; text: string }> }): HandlerResponsePayload {
    return JSON.parse(response.content[0]?.text ?? '{}') as HandlerResponsePayload;
  }

  function writeSkill(index: number): void {
    const skillDir = join(workspaceRoot, '.opencode', 'skill', `recommend-${index}`);
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(
      join(skillDir, 'graph-metadata.json'),
      JSON.stringify({
        skill_id: `recommend-${index}`,
        family: 'stress',
        category: 'recommend',
        domains: ['advisor', `domain-${index % 5}`],
        intent_signals: [`recommend intent ${index}`, 'advisor recommend stress'],
        derived: {
          trigger_phrases: [`recommend trigger ${index}`],
          key_topics: ['advisor recommend'],
        },
      }, null, 2),
      'utf8',
    );
    writeFileSync(
      join(skillDir, 'SKILL.md'),
      [
        '---',
        `name: recommend-${index}`,
        `description: Advisor recommend stress skill ${index}`,
        '---',
        '',
        `<!-- Keywords: recommend-${index}, advisor recommend, route-${index} -->`,
      ].join('\n'),
      'utf8',
    );
  }

  function writeSkillCorpus(count: number): void {
    for (let index = 0; index < count; index += 1) {
      writeSkill(index);
    }
  }

  it('keeps concurrent recommend calls callable through the full handler envelope', async () => {
    writeSkillCorpus(25);

    const responses = await Promise.all(Array.from({ length: 40 }, (_, index) => (
      handleAdvisorRecommend({
        workspaceRoot,
        prompt: `implement advisor recommend stress route-${index % 25}`,
        options: {
          topK: 3,
          includeAttribution: true,
          confidenceThreshold: 0,
          uncertaintyThreshold: 1,
        },
      }).then(parseResponse)
    )));

    expect(responses.every((response) => response.status === 'ok')).toBe(true);
    expect(responses.every((response) => response.data.workspaceRoot === workspaceRoot)).toBe(true);
    expect(responses.some((response) => response.data.recommendations.length > 0)).toBe(true);
    expect(responses.every((response) => response.data.freshness === 'live')).toBe(true);
  });

  it('handles a near-limit prompt payload without echoing it into public output', async () => {
    writeSkillCorpus(5);
    const prompt = `implement advisor recommend stress route-1 ${'payload '.repeat(1_200)}`.slice(0, 9_950);

    const raw = (await handleAdvisorRecommend({
      workspaceRoot,
      prompt,
      options: {
        topK: 2,
        confidenceThreshold: 0,
        uncertaintyThreshold: 1,
      },
    })).content[0]?.text ?? '';
    const response = JSON.parse(raw) as HandlerResponsePayload;

    expect(response.status).toBe('ok');
    expect(response.data.recommendations.length).toBeGreaterThan(0);
    expect(raw).not.toContain('payload payload payload payload');
    expect(raw).not.toContain(prompt);
  });

  it('fails open with degraded skill graph freshness under handler load', async () => {
    mocks.readAdvisorStatus.mockReturnValue(status('absent'));
    writeSkillCorpus(10);

    const responses = await Promise.all(Array.from({ length: 20 }, () => (
      handleAdvisorRecommend({
        workspaceRoot,
        prompt: 'implement advisor recommend stress route-1',
        options: { includeAbstainReasons: true },
      }).then(parseResponse)
    )));

    expect(responses.every((response) => response.status === 'ok')).toBe(true);
    expect(responses.every((response) => response.data.freshness === 'absent')).toBe(true);
    expect(responses.every((response) => response.data.recommendations.length === 0)).toBe(true);
    expect(responses[0]?.data.abstainReasons).toEqual([
      'Skill advisor freshness is absent; returning fail-open empty recommendations.',
    ]);
  });
});
