// ---------------------------------------------------------------
// MODULE: Semantic Signal Extractor
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SEMANTIC SIGNAL EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Unifies script-side semantic preprocessing so topic, trigger,
// session, and summary extraction share one contract.

import {
  CONFIG as TRIGGER_CONFIG,
  STOP_WORDS_ARTIFACTS,
  STOP_WORDS_ENGLISH,
  STOP_WORDS_TECH,
  countNgrams,
  deduplicateSubstrings,
  extractActionTerms,
  extractCompoundNouns,
  extractDecisionTerms,
  extractProblemTerms,
  extractTechnicalTerms,
  filterTechStopWords,
  removeMarkdown,
  scoreNgrams,
  tokenize,
} from '@spec-kit/shared/trigger-extractor';
import type { ExtractionResult, ScoredNgram } from '@spec-kit/shared/types';
import {
  createValidShortTerms,
  shouldIncludeTopicWord,
} from './topic-keywords';

export type SemanticSignalMode = 'topics' | 'triggers' | 'summary' | 'all';
export type StopwordProfile = 'balanced' | 'aggressive';
export type NgramDepth = 1 | 2 | 3 | 4;

export interface SemanticSignalExtractOptions {
  text: string;
  mode: SemanticSignalMode;
  stopwordProfile?: StopwordProfile;
  ngramDepth?: NgramDepth;
  maxPhrases?: number;
  minPhraseCount?: number;
}

export interface SemanticSignalResult {
  mode: SemanticSignalMode;
  stopwordProfile: StopwordProfile;
  ngramDepth: NgramDepth;
  cleanedText: string;
  tokens: string[];
  filteredTokens: string[];
  phrases: string[];
  topics: string[];
  rankedTerms: string[];
  stats: ExtractionResult['stats'];
  breakdown: ExtractionResult['breakdown'];
}

const PLACEHOLDER_INDICATORS: readonly string[] = [
  'simulation mode',
  '[response]',
  'placeholder data',
  'fallback data',
  'no real conversation data',
  'simulated user message',
  'simulated assistant response',
  'placeholder',
];

const TOPIC_ONLY_STOP_WORDS: readonly string[] = [
  'file',
  'files',
  'code',
  'update',
  'updated',
  'response',
  'request',
  'message',
  'using',
  'used',
  'use',
  'set',
  'get',
  'new',
  'add',
  'added',
  'make',
  'made',
  'based',
  'work',
  'working',
  'works',
  'need',
  'needs',
  'needed',
  'like',
  'also',
  'well',
  'session',
  'context',
  'data',
  'tool',
  'tools',
  'run',
  'running',
  'started',
  'changes',
  'changed',
  'change',
  'check',
  'checked',
  'checking',
  'user',
  'assistant',
  'processed',
  'initiated',
  'conversation',
  'unknown',
  'simulation',
  'simulated',
  'fallback',
  'default',
  'undefined',
  'null',
  'empty',
  'create',
  'created',
  'delete',
  'deleted',
  'start',
  'stop',
  'stopped',
  'done',
  'complete',
  'completed',
  'placeholder',
];

const AGGRESSIVE_STOP_WORDS: Set<string> = new Set([
  ...STOP_WORDS_ENGLISH,
  ...STOP_WORDS_ARTIFACTS,
  ...STOP_WORDS_TECH,
  ...TOPIC_ONLY_STOP_WORDS,
]);

function clampNgramDepth(depth: number | undefined): NgramDepth {
  if (depth === 1 || depth === 2 || depth === 3 || depth === 4) {
    return depth;
  }
  return 2;
}

function getStopwordSet(profile: StopwordProfile): Set<string> {
  if (profile === 'aggressive') {
    return AGGRESSIVE_STOP_WORDS;
  }

  return new Set([
    ...STOP_WORDS_ENGLISH,
    ...STOP_WORDS_ARTIFACTS,
  ]);
}

function isPlaceholderText(text: string): boolean {
  const lowerText = text.toLowerCase();
  const placeholderHits = PLACEHOLDER_INDICATORS.filter((indicator) => lowerText.includes(indicator));
  return placeholderHits.length >= 2;
}

function filterStopWordsByProfile(tokens: string[], profile: StopwordProfile): string[] {
  const stopWords = getStopwordSet(profile);
  return tokens.filter((token) => token === '__break__' || !stopWords.has(token));
}

function buildBreakdown(text: string, cleanedText: string, phrases: string[], tokens: string[], filteredTokens: string[]): ExtractionResult['breakdown'] {
  const problemTerms = extractProblemTerms(cleanedText);
  const technicalTerms = extractTechnicalTerms(text);
  const decisionTerms = extractDecisionTerms(cleanedText);
  const actionTerms = extractActionTerms(cleanedText);
  const compoundNouns = extractCompoundNouns(cleanedText);

  return {
    problemTerms: problemTerms.length,
    technicalTerms: technicalTerms.length,
    decisionTerms: decisionTerms.length,
    actionTerms: actionTerms.length,
    compoundNouns: compoundNouns.length,
    samples: {
      problem: problemTerms.slice(0, 3).map((term) => term.phrase),
      technical: technicalTerms.slice(0, 3).map((term) => term.phrase),
      decision: decisionTerms.slice(0, 3).map((term) => term.phrase),
      action: actionTerms.slice(0, 3).map((term) => term.phrase),
      compound: compoundNouns.slice(0, 3).map((term) => term.phrase),
    },
  };
}

function buildRankedNgrams(filteredTokens: string[], ngramDepth: NgramDepth): ScoredNgram[] {
  const totalTokens = filteredTokens.length;
  const scored: ScoredNgram[] = [];
  const bonuses = [
    TRIGGER_CONFIG.LENGTH_BONUS.UNIGRAM,
    TRIGGER_CONFIG.LENGTH_BONUS.BIGRAM,
    TRIGGER_CONFIG.LENGTH_BONUS.TRIGRAM,
    TRIGGER_CONFIG.LENGTH_BONUS.QUADGRAM,
  ];

  for (let n = 1; n <= ngramDepth; n++) {
    const ngrams = countNgrams(filteredTokens, n);
    const bonus = bonuses[n - 1] ?? bonuses[bonuses.length - 1];
    scored.push(...scoreNgrams(ngrams, bonus, totalTokens));
  }

  return scored;
}

function buildTriggerPhrases(
  text: string,
  cleanedText: string,
  filteredTokens: string[],
  ngramDepth: NgramDepth,
  maxPhrases: number,
  minPhraseCount: number,
): string[] {
  if (filteredTokens.length < TRIGGER_CONFIG.MIN_WORD_LENGTH) {
    return [];
  }

  const allCandidates: ScoredNgram[] = [
    ...extractProblemTerms(cleanedText),
    ...extractTechnicalTerms(text),
    ...extractDecisionTerms(cleanedText),
    ...extractActionTerms(cleanedText),
    ...extractCompoundNouns(cleanedText),
    ...buildRankedNgrams(filteredTokens, ngramDepth),
  ];

  const deduplicated = deduplicateSubstrings(allCandidates);
  const techFiltered = filterTechStopWords(deduplicated);

  const topPhrases = techFiltered
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPhrases)
    .map((item) => item.phrase.toLowerCase().trim())
    .filter((phrase, index, arr) => arr.indexOf(phrase) === index);

  if (topPhrases.length < minPhraseCount && deduplicated.length > 0) {
    return deduplicated
      .sort((a, b) => b.score - a.score)
      .slice(0, maxPhrases)
      .map((item) => item.phrase.toLowerCase().trim())
      .filter((phrase, index, arr) => arr.indexOf(phrase) === index);
  }

  return topPhrases;
}

function buildTopicTerms(filteredTokens: string[], ngramDepth: NgramDepth): string[] {
  if (filteredTokens.length === 0) {
    return [];
  }

  const validShortTerms = createValidShortTerms();
  const stopwords = getStopwordSet('aggressive');
  const scoredCandidates = buildRankedNgrams(filteredTokens, ngramDepth);
  const deduplicated = deduplicateSubstrings(scoredCandidates);

  return deduplicated
    .filter((candidate) => {
      const words = candidate.phrase.split(' ');
      if (words.length === 1) {
        return shouldIncludeTopicWord(words[0], stopwords, validShortTerms);
      }
      return words.every((word) => shouldIncludeTopicWord(word, stopwords, validShortTerms));
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.phrase.length - a.phrase.length;
    })
    .map((candidate) => candidate.phrase.toLowerCase().trim())
    .filter((phrase, index, arr) => arr.indexOf(phrase) === index)
    .slice(0, 12);
}

/**
 * Unified semantic signal extraction engine.
 * Provides mode-aware extraction for topics, triggers, summaries, or all signals combined.
 * All script-side extractors (trigger, topic, session, summary) delegate to this class.
 */
export class SemanticSignalExtractor {
  /** Extracts semantic signals from text based on the specified mode and stopword profile. */
  static extract(options: SemanticSignalExtractOptions): SemanticSignalResult {
    const text = typeof options.text === 'string' ? options.text : '';
    const stopwordProfile = options.stopwordProfile ?? 'balanced';
    const ngramDepth = clampNgramDepth(options.ngramDepth);
    const maxPhrases = options.maxPhrases ?? TRIGGER_CONFIG.MAX_PHRASE_COUNT;
    const minPhraseCount = options.minPhraseCount ?? TRIGGER_CONFIG.MIN_PHRASE_COUNT;
    const start = Date.now();

    const minLength = options.mode === 'topics' ? 20 : TRIGGER_CONFIG.MIN_CONTENT_LENGTH;
    if (!text || text.length < minLength || isPlaceholderText(text)) {
      return {
        mode: options.mode,
        stopwordProfile,
        ngramDepth,
        cleanedText: '',
        tokens: [],
        filteredTokens: [],
        phrases: [],
        topics: [],
        rankedTerms: [],
        stats: {
          inputLength: text.length,
          cleanedLength: 0,
          tokenCount: 0,
          filteredTokenCount: 0,
          phraseCount: 0,
          extractionTimeMs: Date.now() - start,
        },
        breakdown: {
          problemTerms: 0,
          technicalTerms: 0,
          decisionTerms: 0,
          actionTerms: 0,
          compoundNouns: 0,
          samples: {
            problem: [],
            technical: [],
            decision: [],
            action: [],
            compound: [],
          },
        },
      };
    }

    const cleanedText = removeMarkdown(text);
    const tokens = tokenize(cleanedText);
    const filteredTokens = filterStopWordsByProfile(tokens, stopwordProfile);
    const phrases = buildTriggerPhrases(text, cleanedText, filteredTokens, ngramDepth, maxPhrases, minPhraseCount);
    const topics = buildTopicTerms(filteredTokens, ngramDepth);
    const rankedTerms = options.mode === 'topics'
      ? topics
      : options.mode === 'summary'
        ? phrases.slice(0, 12)
        : phrases;
    const breakdown = buildBreakdown(text, cleanedText, phrases, tokens, filteredTokens);

    return {
      mode: options.mode,
      stopwordProfile,
      ngramDepth,
      cleanedText,
      tokens,
      filteredTokens,
      phrases: options.mode === 'topics' ? topics : phrases,
      topics,
      rankedTerms,
      stats: {
        inputLength: text.length,
        cleanedLength: cleanedText.length,
        tokenCount: tokens.length,
        filteredTokenCount: filteredTokens.length,
        phraseCount: phrases.length,
        extractionTimeMs: Date.now() - start,
      },
      breakdown,
    };
  }

  /** Extracts trigger phrases from text using balanced stopwords and ngram depth 2 by default. */
  static extractTriggerPhrases(text: string, overrides: Omit<SemanticSignalExtractOptions, 'text' | 'mode'> = {}): string[] {
    return SemanticSignalExtractor.extract({
      text,
      mode: 'triggers',
      stopwordProfile: overrides.stopwordProfile ?? 'balanced',
      ngramDepth: overrides.ngramDepth ?? 2,
      maxPhrases: overrides.maxPhrases,
      minPhraseCount: overrides.minPhraseCount,
    }).phrases;
  }

  /** Extracts trigger phrases with extraction stats and breakdown metadata. */
  static extractTriggerPhrasesWithStats(text: string, overrides: Omit<SemanticSignalExtractOptions, 'text' | 'mode'> = {}): ExtractionResult {
    const result = SemanticSignalExtractor.extract({
      text,
      mode: 'triggers',
      stopwordProfile: overrides.stopwordProfile ?? 'balanced',
      ngramDepth: overrides.ngramDepth ?? 2,
      maxPhrases: overrides.maxPhrases,
      minPhraseCount: overrides.minPhraseCount,
    });

    return {
      phrases: result.phrases,
      stats: result.stats,
      breakdown: result.breakdown,
    };
  }

  /** Extracts topic terms from text using aggressive stopwords and ngram depth 2 by default. */
  static extractTopicTerms(text: string, overrides: Omit<SemanticSignalExtractOptions, 'text' | 'mode'> = {}): string[] {
    return SemanticSignalExtractor.extract({
      text,
      mode: 'topics',
      stopwordProfile: overrides.stopwordProfile ?? 'aggressive',
      ngramDepth: overrides.ngramDepth ?? 2,
    }).topics;
  }
}
