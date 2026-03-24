import { describe, expect, it } from 'vitest';

import { extractTriggerPhrases as sharedExtractTriggerPhrases } from '@spec-kit/shared/trigger-extractor';
import { extractKeyTopics as extractWorkflowTopics } from '../core/topic-extractor';
import { extractKeyTopics as extractSessionTopics } from '../extractors/session-extractor';
import { SemanticSignalExtractor } from '../lib/semantic-signal-extractor';
import {
  extractTriggerPhrases,
  extractTriggerPhrasesWithStats,
} from '../lib/trigger-extractor';
import { generateImplementationSummary } from '../lib/semantic-summarizer';

const GOLDEN_CASES = [
  {
    name: 'technical implementation',
    text: 'Implemented OAuth authentication with JWT tokens. Fixed authentication bug in login handler and updated auth middleware for refresh tokens.',
    // ngramDepth 4 baseline (shared trigger-extractor and explicit depth 4)
    expected: [
      'authentication bug',
      'implemented oauth authentication jwt',
      'oauth authentication jwt tokens',
      'fixed authentication login handler',
      'authentication login handler auth',
      'login handler auth middleware',
      'handler auth middleware refresh',
      'auth middleware refresh tokens.',
    ],
    // ngramDepth 2 baseline (SemanticSignalExtractor default after Fix 6)
    expectedDepth2: [
      'authentication bug',
      'implemented oauth',
      'oauth authentication',
      'authentication jwt',
      'jwt tokens',
      'fixed authentication',
      'authentication login',
      'login handler',
    ],
  },
  {
    name: 'debugging',
    text: 'Debugging failing Vitest suite. Grep output showed the error path, then fixed the null pointer bug in the memory parser and verified the patch with tests.',
    expected: [
      // Fix 5: "the error" was filtered — "the" is a generic stopword, not a meaningful trigger
      'pointer bug',
      'debugging failing vitest suite',
      'grep output showed error',
      'output showed error path',
      'showed error path fixed',
      'error path fixed null',
      'path fixed null pointer',
      'fixed null pointer memory',
    ],
    expectedDepth2: [
      'pointer bug',
      'debugging failing',
      'failing vitest',
      'vitest suite',
      'grep output',
      'output showed',
      'showed error',
      'path fixed',
    ],
  },
  {
    name: 'research and planning',
    text: 'Researched workspace identity alignment, compared Claude and Codex capture formats, planned the adapter migration, and documented the rollout approach.',
    expected: [
      'researched workspace identity alignment',
      'workspace identity alignment compared',
      'identity alignment compared claude',
      'alignment compared claude codex',
      'compared claude codex capture',
      'claude codex capture formats',
      'codex capture formats planned',
      'capture formats planned adapter',
    ],
    expectedDepth2: [
      'researched workspace',
      'workspace identity',
      'identity alignment',
      'alignment compared',
      'compared claude',
      'claude codex',
      'codex capture',
      'capture formats',
    ],
  },
] as const;

describe('semantic signal extractor golden coverage', () => {
  it('keeps trigger extraction locked to the shared baseline for frozen inputs', () => {
    for (const goldenCase of GOLDEN_CASES) {
      // Scripts-side extractTriggerPhrases now defaults to ngramDepth 2 (Fix 6)
      expect(extractTriggerPhrases(goldenCase.text).slice(0, 8)).toEqual(goldenCase.expectedDepth2);
      // Shared trigger-extractor still uses depth 4 internally
      expect(sharedExtractTriggerPhrases(goldenCase.text).slice(0, 8)).toEqual(goldenCase.expected);
      // Explicit depth 4 still matches the original baseline
      expect(
        SemanticSignalExtractor.extract({
          text: goldenCase.text,
          mode: 'triggers',
          stopwordProfile: 'balanced',
          ngramDepth: 4,
        }).phrases.slice(0, 8),
      ).toEqual(goldenCase.expected);
    }
  });

  it('returns trigger stats and preserves the baseline phrase order', () => {
    const result = extractTriggerPhrasesWithStats(GOLDEN_CASES[0].text);

    // extractTriggerPhrasesWithStats now defaults to ngramDepth 2 (Fix 6)
    expect(result.phrases.slice(0, 4)).toEqual(GOLDEN_CASES[0].expectedDepth2.slice(0, 4));
    expect(result.stats.tokenCount).toBeGreaterThan(0);
    expect(result.stats.filteredTokenCount).toBeGreaterThan(0);
    expect(result.breakdown.problemTerms).toBeGreaterThan(0);
  });

  it('applies balanced vs aggressive stopword profiles through one contract', () => {
    const text = 'Session context tool update message about oauth adapter migration and workspace identity alignment';

    const balanced = SemanticSignalExtractor.extract({
      text,
      mode: 'topics',
      stopwordProfile: 'balanced',
      ngramDepth: 2,
    });
    const aggressive = SemanticSignalExtractor.extract({
      text,
      mode: 'topics',
      stopwordProfile: 'aggressive',
      ngramDepth: 2,
    });

    expect(balanced.filteredTokens).toContain('session');
    expect(balanced.filteredTokens).toContain('tool');
    expect(aggressive.filteredTokens).not.toContain('session');
    expect(aggressive.filteredTokens).not.toContain('tool');
    expect(aggressive.topics.join(' ')).toContain('oauth');
  });

  it('supports ngram depth 1 through 4 without changing the public contract', () => {
    const text = 'Workspace identity adapter migration keeps trigger extraction deterministic';

    const depth1 = SemanticSignalExtractor.extract({
      text,
      mode: 'topics',
      stopwordProfile: 'aggressive',
      ngramDepth: 1,
    });
    const depth4 = SemanticSignalExtractor.extract({
      text,
      mode: 'topics',
      stopwordProfile: 'aggressive',
      ngramDepth: 4,
    });

    expect(depth1.topics.some((topic) => topic.includes(' '))).toBe(false);
    expect(depth4.topics.some((topic) => topic.includes('workspace identity'))).toBe(true);
    expect(depth4.topics.length).toBeGreaterThan(0);
  });

  it('keeps workflow topics, session topics, and summary trigger phrases aligned on the same dominant concepts', () => {
    const summaryText = 'Implemented unified signal extraction for workspace identity alignment and adapter migration with deterministic trigger generation.';
    const decisions = [
      {
        TITLE: 'Adopt unified signal extractor',
        RATIONALE: 'One stopword contract keeps workspace identity and trigger generation aligned',
        CHOSEN: 'Ship adapter migration first',
      },
    ];

    const workflowTopics = extractWorkflowTopics(summaryText, decisions, '008-signal-extraction');
    const sessionTopics = extractSessionTopics(summaryText, decisions);
    const implementationSummary = generateImplementationSummary(
      [
        { prompt: 'Implement unified signal extraction and keep trigger generation stable.' },
        { content: 'Created scripts/lib/semantic-signal-extractor.ts and updated the topic and session adapters.' },
        { content: 'Verified workspace identity alignment and adapter migration behavior with regression tests.' },
      ],
      [
        {
          narrative: 'Implemented unified signal extraction and preserved the trigger baseline.',
          files: ['scripts/lib/semantic-signal-extractor.ts'],
        },
      ],
    );

    // T09: specFolderName no longer injected into topics, so 'signal extraction' bigram
    // may not form. Accept either 'signal extractor' (from decision title) or 'signal extraction'.
    expect(workflowTopics.join(' ')).toMatch(/signal (extractor|extraction)/);
    expect(sessionTopics.join(' ')).toMatch(/signal (extractor|extraction)/);
    expect(implementationSummary.triggerPhrases.join(' ')).toMatch(/signal (extractor|extraction)/);
    expect(workflowTopics.join(' ')).toContain('workspace identity');
    expect(sessionTopics.join(' ')).toContain('workspace identity');
  });
});
