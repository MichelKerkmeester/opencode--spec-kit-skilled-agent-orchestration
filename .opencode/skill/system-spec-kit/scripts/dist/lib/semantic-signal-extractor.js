"use strict";
// ---------------------------------------------------------------
// MODULE: Semantic Signal Extractor
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSignalExtractor = void 0;
// ───────────────────────────────────────────────────────────────
// 1. SEMANTIC SIGNAL EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Unifies script-side semantic preprocessing so topic, trigger,
// session, and summary extraction share one contract.
const trigger_extractor_1 = require("@spec-kit/shared/trigger-extractor");
const topic_keywords_1 = require("./topic-keywords");
const PLACEHOLDER_INDICATORS = [
    'simulation mode',
    '[response]',
    'placeholder data',
    'fallback data',
    'no real conversation data',
    'simulated user message',
    'simulated assistant response',
    'placeholder',
];
const TOPIC_ONLY_STOP_WORDS = [
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
const AGGRESSIVE_STOP_WORDS = new Set([
    ...trigger_extractor_1.STOP_WORDS_ENGLISH,
    ...trigger_extractor_1.STOP_WORDS_ARTIFACTS,
    ...trigger_extractor_1.STOP_WORDS_TECH,
    ...TOPIC_ONLY_STOP_WORDS,
]);
function clampNgramDepth(depth) {
    if (depth === 1 || depth === 2 || depth === 3 || depth === 4) {
        return depth;
    }
    return 2;
}
function getStopwordSet(profile) {
    if (profile === 'aggressive') {
        return AGGRESSIVE_STOP_WORDS;
    }
    return new Set([
        ...trigger_extractor_1.STOP_WORDS_ENGLISH,
        ...trigger_extractor_1.STOP_WORDS_ARTIFACTS,
    ]);
}
function isPlaceholderText(text) {
    const lowerText = text.toLowerCase();
    const placeholderHits = PLACEHOLDER_INDICATORS.filter((indicator) => lowerText.includes(indicator));
    return placeholderHits.length >= 2;
}
function filterStopWordsByProfile(tokens, profile) {
    const stopWords = getStopwordSet(profile);
    return tokens.filter((token) => token === '__break__' || !stopWords.has(token));
}
function buildBreakdown(text, cleanedText, phrases, tokens, filteredTokens) {
    const problemTerms = (0, trigger_extractor_1.extractProblemTerms)(cleanedText);
    const technicalTerms = (0, trigger_extractor_1.extractTechnicalTerms)(text);
    const decisionTerms = (0, trigger_extractor_1.extractDecisionTerms)(cleanedText);
    const actionTerms = (0, trigger_extractor_1.extractActionTerms)(cleanedText);
    const compoundNouns = (0, trigger_extractor_1.extractCompoundNouns)(cleanedText);
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
function buildRankedNgrams(filteredTokens, ngramDepth) {
    const totalTokens = filteredTokens.length;
    const scored = [];
    const bonuses = [
        trigger_extractor_1.CONFIG.LENGTH_BONUS.UNIGRAM,
        trigger_extractor_1.CONFIG.LENGTH_BONUS.BIGRAM,
        trigger_extractor_1.CONFIG.LENGTH_BONUS.TRIGRAM,
        trigger_extractor_1.CONFIG.LENGTH_BONUS.QUADGRAM,
    ];
    for (let n = 1; n <= ngramDepth; n++) {
        const ngrams = (0, trigger_extractor_1.countNgrams)(filteredTokens, n);
        const bonus = bonuses[n - 1] ?? bonuses[bonuses.length - 1];
        scored.push(...(0, trigger_extractor_1.scoreNgrams)(ngrams, bonus, totalTokens));
    }
    return scored;
}
function buildTriggerPhrases(text, cleanedText, filteredTokens, ngramDepth, maxPhrases, minPhraseCount) {
    if (filteredTokens.length < trigger_extractor_1.CONFIG.MIN_WORD_LENGTH) {
        return [];
    }
    const allCandidates = [
        ...(0, trigger_extractor_1.extractProblemTerms)(cleanedText),
        ...(0, trigger_extractor_1.extractTechnicalTerms)(text),
        ...(0, trigger_extractor_1.extractDecisionTerms)(cleanedText),
        ...(0, trigger_extractor_1.extractActionTerms)(cleanedText),
        ...(0, trigger_extractor_1.extractCompoundNouns)(cleanedText),
        ...buildRankedNgrams(filteredTokens, ngramDepth),
    ];
    const deduplicated = (0, trigger_extractor_1.deduplicateSubstrings)(allCandidates);
    const techFiltered = (0, trigger_extractor_1.filterTechStopWords)(deduplicated);
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
function buildTopicTerms(filteredTokens, ngramDepth) {
    if (filteredTokens.length === 0) {
        return [];
    }
    const validShortTerms = (0, topic_keywords_1.createValidShortTerms)();
    const stopwords = getStopwordSet('aggressive');
    const scoredCandidates = buildRankedNgrams(filteredTokens, ngramDepth);
    const deduplicated = (0, trigger_extractor_1.deduplicateSubstrings)(scoredCandidates);
    return deduplicated
        .filter((candidate) => {
        const words = candidate.phrase.split(' ');
        if (words.length === 1) {
            return (0, topic_keywords_1.shouldIncludeTopicWord)(words[0], stopwords, validShortTerms);
        }
        return words.every((word) => (0, topic_keywords_1.shouldIncludeTopicWord)(word, stopwords, validShortTerms));
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
class SemanticSignalExtractor {
    /** Extracts semantic signals from text based on the specified mode and stopword profile. */
    static extract(options) {
        const text = typeof options.text === 'string' ? options.text : '';
        const stopwordProfile = options.stopwordProfile ?? 'balanced';
        const ngramDepth = clampNgramDepth(options.ngramDepth);
        const maxPhrases = options.maxPhrases ?? trigger_extractor_1.CONFIG.MAX_PHRASE_COUNT;
        const minPhraseCount = options.minPhraseCount ?? trigger_extractor_1.CONFIG.MIN_PHRASE_COUNT;
        const start = Date.now();
        const minLength = options.mode === 'topics' ? 20 : trigger_extractor_1.CONFIG.MIN_CONTENT_LENGTH;
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
        const cleanedText = (0, trigger_extractor_1.removeMarkdown)(text);
        const tokens = (0, trigger_extractor_1.tokenize)(cleanedText);
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
    static extractTriggerPhrases(text, overrides = {}) {
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
    static extractTriggerPhrasesWithStats(text, overrides = {}) {
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
    static extractTopicTerms(text, overrides = {}) {
        return SemanticSignalExtractor.extract({
            text,
            mode: 'topics',
            stopwordProfile: overrides.stopwordProfile ?? 'aggressive',
            ngramDepth: overrides.ngramDepth ?? 2,
        }).topics;
    }
}
exports.SemanticSignalExtractor = SemanticSignalExtractor;
//# sourceMappingURL=semantic-signal-extractor.js.map