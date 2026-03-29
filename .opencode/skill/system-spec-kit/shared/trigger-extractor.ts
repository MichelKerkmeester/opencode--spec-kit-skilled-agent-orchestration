// ---------------------------------------------------------------
// MODULE: Trigger Extractor
// ---------------------------------------------------------------
// Feature catalog: Trigger phrase matching (memory_match_triggers)

import type {
  TriggerConfig,
  TriggerPhrase,
  NgramCount,
  ScoredNgram,
  ExtractionStats,
  ExtractionBreakdown,
  ExtractionResult,
} from './types.js';

// ---------------------------------------------------------------
// 1. STOP WORD LISTS
// ---------------------------------------------------------------

/** Defines stop words english. */
export const STOP_WORDS_ENGLISH: Set<string> = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of',
  'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'also', 'now', 'this', 'that', 'these', 'those', 'what',
  'which', 'who', 'whom', 'whose', 'i', 'you', 'he', 'she', 'it', 'we',
  'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its',
  'our', 'their', 'and', 'but', 'or', 'if', 'because', 'about', 'any',
  'both', 'over', 'out', 'up', 'down', 'off', 'while', 'until', 'since',
]);

/** Defines stop words tech. */
export const STOP_WORDS_TECH: Set<string> = new Set([
  'function', 'variable', 'const', 'let', 'var', 'class', 'method',
  'file', 'folder', 'directory', 'code', 'line', 'object', 'array',
  'string', 'number', 'boolean', 'null', 'undefined', 'true', 'false',
  'return', 'import', 'export', 'require', 'module', 'default', 'async',
  'await', 'promise', 'callback', 'parameter', 'argument', 'value',
  'type', 'interface', 'enum', 'struct', 'void', 'static', 'public',
  'private', 'protected', 'extends', 'implements', 'super', 'this',
  'new', 'delete', 'typeof', 'instanceof', 'try', 'catch', 'throw',
  'finally', 'break', 'continue', 'switch', 'case', 'else', 'error',
  'data', 'result', 'response', 'request', 'input', 'output', 'path',
  'name', 'index', 'item', 'list', 'node', 'element', 'component',
  'placeholder', 'simulation', 'simulated', 'fallback', 'unknown',
  'message', 'user', 'assistant', 'processed', 'initiated', 'conversation',
]);

/** Defines stop words artifacts. */
export const STOP_WORDS_ARTIFACTS: Set<string> = new Set([
  'section', 'chapter', 'example', 'note', 'warning', 'info', 'tip',
  'todo', 'fixme', 'hack', 'bug', 'issue', 'feature', 'update',
  'created', 'modified', 'updated', 'version', 'date', 'author',
  'summary', 'overview', 'description', 'details', 'context',
  'related', 'reference', 'source', 'target', 'link', 'anchor',
]);

// ---------------------------------------------------------------
// 2. CONFIGURATION
// ---------------------------------------------------------------

/** Defines config. */
export const CONFIG: TriggerConfig = {
  MIN_PHRASE_COUNT: 8,
  MAX_PHRASE_COUNT: 25,
  MIN_WORD_LENGTH: 3,
  MIN_UNIGRAM_LENGTH: 6,
  MIN_CONTENT_LENGTH: 50,
  MIN_FREQUENCY: 1,
  LENGTH_BONUS: {
    UNIGRAM: 1.0,
    BIGRAM: 1.5,
    TRIGRAM: 1.8,
    QUADGRAM: 2.0,
  },
  PRIORITY_BONUS: {
    PROBLEM_TERM: 3.0,
    TECHNICAL_TERM: 2.5,
    DECISION_TERM: 2.0,
    ACTION_TERM: 1.5,
    COMPOUND_NOUN: 1.3,
  },
};

const GENERIC_STOPWORDS: Set<string> = new Set([
  'manual', 'testing', 'per', 'spec', 'phase',
  'the', 'for', 'with', 'from', 'into', 'about',
  'this', 'that', 'which', 'where', 'when', 'what',
]);

// ---------------------------------------------------------------
// 3. PREPROCESSING
// ---------------------------------------------------------------

/** Remove markdown formatting from text */
export function removeMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]+/g, ' ')
    .replace(/^>\s*/gm, '')
    .replace(/^[-*_]{3,}\s*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize text into words with sentence boundary markers */
export function tokenize(text: string): string[] {
  const withBreaks = text
    .replace(/[.!?]+\s+/g, ' __BREAK__ ')
    .replace(/\n+/g, ' __BREAK__ ');

  return withBreaks
    .toLowerCase()
    .split(/[\s,;:()\[\]{}"'<>]+/)
    .filter((token: string) =>
      token === '__break__' ||
      (token.length >= CONFIG.MIN_WORD_LENGTH &&
       !/^\d+$/.test(token) &&
        !/^[^a-z_]+$/.test(token))
    );
}

function isAllowedUnigram(phrase: string): boolean {
  const normalized = phrase.toLowerCase().trim();
  if (!normalized || normalized.includes(' ')) {
    return true;
  }

  return normalized.length >= CONFIG.MIN_UNIGRAM_LENGTH
    && !GENERIC_STOPWORDS.has(normalized);
}

/** Filter out stop words (preserves __break__ markers) */
export function filterStopWords(tokens: string[]): string[] {
  return tokens.filter((token: string) =>
    token === '__break__' ||
    (!STOP_WORDS_ENGLISH.has(token) &&
     !STOP_WORDS_ARTIFACTS.has(token))
  );
}

// ---------------------------------------------------------------
// 4. N-GRAM EXTRACTION
// ---------------------------------------------------------------

/** Extract n-grams respecting sentence boundaries */
export function extractNgrams(tokens: string[], n: number): Map<string, number> {
  const ngrams: Map<string, number> = new Map();

  if (tokens.length < n) {
    return ngrams;
  }

  for (let i = 0; i <= tokens.length - n; i++) {
    const slice = tokens.slice(i, i + n);
    if (slice.some(t => t === '__break__')) {
      continue;
    }
    const ngram = slice.join(' ');
    ngrams.set(ngram, (ngrams.get(ngram) || 0) + 1);
  }

  return ngrams;
}

/** Count n-grams and return sorted by frequency */
export function countNgrams(tokens: string[], n: number): NgramCount[] {
  const ngrams = extractNgrams(tokens, n);

  return Array.from(ngrams.entries())
    .map(([phrase, count]): NgramCount => ({ phrase, count }))
    .filter(item => item.count >= CONFIG.MIN_FREQUENCY)
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------
// 5. PROBLEM TERM EXTRACTION
// ---------------------------------------------------------------

/** Defines problem indicators. */
export const PROBLEM_INDICATORS: Set<string> = new Set([
  'short', 'missing', 'broken', 'failed', 'error', 'bug', 'issue',
  'wrong', 'incorrect', 'invalid', 'unexpected', 'crash', 'timeout',
  'slow', 'stuck', 'blocked', 'regression', 'corrupt', 'leak',
  'overflow', 'underflow', 'null', 'undefined', 'empty', 'truncated',
]);

/** Defines state keywords. */
export const STATE_KEYWORDS: Set<string> = new Set([
  'simulation', 'placeholder', 'fallback', 'mock', 'stub', 'fake',
  'debug', 'verbose', 'silent', 'readonly', 'disabled', 'enabled',
  'pending', 'stale', 'cached', 'expired', 'deprecated', 'legacy',
]);

/** Extract problem terms using pattern matching */
export function extractProblemTerms(text: string): TriggerPhrase[] {
  const results: TriggerPhrase[] = [];
  const seen: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  const problemPatterns: RegExp[] = [
    /\b(\w{3,})\s+(short|missing|broken|failed|error|bug|issue|wrong|incorrect|invalid|unexpected|crash|timeout|slow|stuck|blocked|empty|truncated)\b/gi,
    /\b(short|missing|broken|failed|error|bug|issue|wrong|incorrect|invalid|unexpected|crash|timeout|slow|stuck|blocked|empty|truncated)\s+(\w{3,})\b/gi,
    /\b(\w{3,})\s+not\s+working\b/gi,
    /\bnot\s+(\w{3,}ing?)\b/gi,
    /\b(\w{3,})\s+fail(?:s|ed|ing)?\b/gi,
  ];

  for (const pattern of problemPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lowerText)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      if (!seen.has(phrase) && phrase.length >= 5) {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.PROBLEM_TERM,
          type: 'problem',
        });
      }
    }
  }

  const statePatterns: RegExp[] = [
    /\b(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\s+(mode|data|value|state|behavior|response|output|result|content)\b/gi,
    /\b(mode|data|value|state|behavior|response|output|result|content)\s+(simulation|placeholder|fallback|mock|stub|fake|debug|verbose|silent|readonly|disabled|enabled|pending|stale|cached|expired|deprecated|legacy)\b/gi,
  ];

  for (const pattern of statePatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lowerText)) !== null) {
      const phrase = match[0].toLowerCase().trim();
      if (!seen.has(phrase) && phrase.length >= 5) {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.PROBLEM_TERM * 0.9,
          type: 'state',
        });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------
// 6. TECHNICAL TERM EXTRACTION
// ---------------------------------------------------------------

/** Extract technical terms: function names, camelCase, snake_case, file paths */
export function extractTechnicalTerms(text: string): TriggerPhrase[] {
  const results: TriggerPhrase[] = [];
  const seen: Set<string> = new Set();

  // camelCase and PascalCase
  const camelCasePattern = /\b([a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*)\b/g;
  let match: RegExpExecArray | null;
  while ((match = camelCasePattern.exec(text)) !== null) {
    const term = match[1];
    const spacedTerm = term.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    if (!seen.has(spacedTerm) && spacedTerm.length >= 5) {
      seen.add(spacedTerm);
      results.push({
        phrase: spacedTerm,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM,
        type: 'technical',
      });
      if (!seen.has(term.toLowerCase())) {
        seen.add(term.toLowerCase());
        results.push({
          phrase: term.toLowerCase(),
          score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.8,
          type: 'technical',
        });
      }
    }
  }

  // snake_case
  const snakeCasePattern = /\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b/gi;
  while ((match = snakeCasePattern.exec(text)) !== null) {
    const term = match[1].toLowerCase();
    const spacedTerm = term.replace(/_/g, ' ');
    if (!seen.has(spacedTerm) && spacedTerm.length >= 5) {
      seen.add(spacedTerm);
      results.push({
        phrase: spacedTerm,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM,
        type: 'technical',
      });
    }
  }

  // Function calls
  const functionPattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
  while ((match = functionPattern.exec(text)) !== null) {
    const funcName = match[1].toLowerCase();
    if (!seen.has(funcName) && funcName.length >= 4 && !STOP_WORDS_TECH.has(funcName)) {
      seen.add(funcName);
      results.push({
        phrase: funcName,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.9,
        type: 'function',
      });
    }
  }

  // File paths with hyphens
  const filePattern = /\b([a-z][a-z0-9]*(?:-[a-z0-9]+)+)(?:\.[a-z]+)?\b/gi;
  while ((match = filePattern.exec(text)) !== null) {
    const fileName = match[1].toLowerCase();
    const spacedName = fileName.replace(/-/g, ' ');
    if (!seen.has(spacedName) && spacedName.length >= 5) {
      seen.add(spacedName);
      results.push({
        phrase: spacedName,
        score: CONFIG.PRIORITY_BONUS.TECHNICAL_TERM * 0.85,
        type: 'filename',
      });
    }
  }

  return results;
}

// ---------------------------------------------------------------
// 7. DECISION PATTERN EXTRACTION
// ---------------------------------------------------------------

/** Extract decision patterns: "chose X", "selected Y", "implemented Z" */
export function extractDecisionTerms(text: string): TriggerPhrase[] {
  const results: TriggerPhrase[] = [];
  const seen: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  // BUG-010 FIX: Replaced lazy quantifiers {n,m}? with bounded greedy to prevent ReDoS
  // Original: [a-z0-9\s]{2,25}? causes catastrophic backtracking
  // Fixed: [a-z0-9][a-z0-9 ]{0,24} - greedy with explicit space, bounded
  const decisionPatterns: RegExp[] = [
    /\b(?:chose|selected|picked|decided\s+on|opted\s+for|went\s+with)\s+([a-z][a-z0-9 ]{1,24})(?:\s+(?:for|because|since|as|over|instead)|[.,;]|$)/gi,
    /\b(?:implemented|created|built|developed|added|introduced)\s+(?:a\s+|an\s+|the\s+)?([a-z][a-z0-9 ]{1,24})(?:\s+(?:for|to|that|which)|[.,;]|$)/gi,
    /\b(?:switched|changed|moved|migrated)\s+(?:to|from)\s+([a-z][a-z0-9 ]{1,19})(?:\s+(?:for|because|since)|[.,;]|$)/gi,
    /\busing\s+([a-z][a-z0-9 ]{1,19})\s+instead\s+of/gi,
    /\breplaced\s+([a-z][a-z0-9 ]{1,19})\s+with\s+([a-z][a-z0-9 ]{1,19})(?:[.,;]|$)/gi,
  ];

  for (const pattern of decisionPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lowerText)) !== null) {
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          const phrase = match[i].trim().replace(/\s+/g, ' ');
          if (!seen.has(phrase) && phrase.length >= 3 && phrase.split(' ').length <= 4) {
            seen.add(phrase);
            results.push({
              phrase,
              score: CONFIG.PRIORITY_BONUS.DECISION_TERM,
              type: 'decision',
            });
          }
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------
// 8. COMPOUND NOUN EXTRACTION
// ---------------------------------------------------------------

/** Extract meaningful compound nouns (2-4 word noun phrases) */
export function extractCompoundNouns(text: string): TriggerPhrase[] {
  const results: TriggerPhrase[] = [];
  const seen: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  const compoundPatterns: RegExp[] = [
    /\b([a-z]{3,})\s+(system|service|handler|manager|controller|processor|extractor|generator|validator|parser|builder|factory|provider|adapter|wrapper|helper|utility|config|configuration|settings|options|parameters)\b/gi,
    /\b([a-z]{3,})\s+(extraction|processing|handling|validation|generation|parsing|building|caching|logging|testing|debugging|monitoring)\b/gi,
    /\b(memory|context|trigger|session|spec|workflow|semantic|search|index)\s+([a-z]{3,})\b/gi,
    /\b([a-z]{3,})\s+([a-z]{3,})\s+(system|service|handler|extraction|processing|workflow)\b/gi,
  ];

  for (const pattern of compoundPatterns) {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(lowerText)) !== null) {
      const phrase = match[0].trim();
      if (!seen.has(phrase) && phrase.length >= 6) {
        const words = phrase.split(' ');
        const hasContent = words.some((w: string) =>
          !STOP_WORDS_ENGLISH.has(w) &&
          !STOP_WORDS_ARTIFACTS.has(w)
        );
        if (hasContent) {
          seen.add(phrase);
          results.push({
            phrase,
            score: CONFIG.PRIORITY_BONUS.COMPOUND_NOUN,
            type: 'compound',
          });
        }
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------
// 9. ACTION TERM EXTRACTION
// ---------------------------------------------------------------

/** Extract action verb + object patterns (e.g., "fix bug", "add feature") */
export function extractActionTerms(text: string): TriggerPhrase[] {
  const results: TriggerPhrase[] = [];
  const seen: Set<string> = new Set();
  const lowerText = text.toLowerCase();

  // BUG-010 FIX: Replaced lazy quantifier {2,20}? with bounded greedy to prevent ReDoS
  const actionPattern = /\b(fix|add|update|remove|delete|create|implement|refactor|optimize|debug|test|verify|check|validate|configure|setup|install|deploy|migrate|upgrade|downgrade|revert|rollback|merge|split|extract|inject|wrap|unwrap)\s+(?:the\s+|a\s+|an\s+)?([a-z][a-z0-9 ]{1,19})(?:\s+(?:for|to|from|in|on|with|by)|[.,;:!?]|$)/gi;

  let match: RegExpExecArray | null;
  while ((match = actionPattern.exec(lowerText)) !== null) {
    const action = match[1];
    const object = match[2].trim().replace(/\s+/g, ' ');
    const phrase = `${action} ${object}`;

    if (!seen.has(phrase) && object.length >= 3 && phrase.split(' ').length <= 4) {
      if (!STOP_WORDS_ARTIFACTS.has(object) && object !== 'it' && object !== 'this') {
        seen.add(phrase);
        results.push({
          phrase,
          score: CONFIG.PRIORITY_BONUS.ACTION_TERM,
          type: 'action',
        });
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------
// 10. TF-IDF SCORING
// ---------------------------------------------------------------

/** Calculate TF-IDF-like scores with length bonus */
export function scoreNgrams(ngrams: NgramCount[], lengthBonus: number, _totalTokens: number): ScoredNgram[] {
  if (ngrams.length === 0) return [];

  const maxCount = ngrams[0].count;

  return ngrams.map((item: NgramCount): ScoredNgram => {
    const tf = item.count / maxCount;
    const score = tf * lengthBonus;

    return {
      phrase: item.phrase,
      score: score,
      count: item.count,
    };
  });
}

// ---------------------------------------------------------------
// 11. DEDUPLICATION
// ---------------------------------------------------------------

/** Remove phrases that are substrings of higher-scoring phrases.
 *  BUG-001 FIX: Prefer longer, more specific phrases over shorter ones.
 *  When a longer phrase contains a shorter one, keep the longer phrase. */
export function deduplicateSubstrings(candidates: ScoredNgram[]): ScoredNgram[] {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const result: ScoredNgram[] = [];
  const seen: Set<string> = new Set();

  for (const candidate of sorted) {
    const phrase = candidate.phrase;

    // Skip if we've already seen this exact phrase
    if (seen.has(phrase)) {
      continue;
    }

    let dominated = false;
    const dominatesIndices: number[] = [];

    for (let i = 0; i < result.length; i++) {
      const existing = result[i];

      // Check if candidate is a substring of an existing longer phrase
      if (existing.phrase.includes(phrase) && existing.phrase.length > phrase.length) {
        // Existing is longer and contains candidate - candidate is dominated
        dominated = true;
        break;
      }

      // Check if candidate is longer and contains an existing shorter phrase
      if (phrase.includes(existing.phrase) && phrase.length > existing.phrase.length) {
        // Candidate is longer - it dominates the existing shorter phrase
        dominatesIndices.push(i);
      }
    }

    if (!dominated) {
      // Remove shorter phrases that are dominated by this longer candidate
      // Remove in reverse order to preserve indices
      for (let i = dominatesIndices.length - 1; i >= 0; i--) {
        const idx = dominatesIndices[i];
        seen.delete(result[idx].phrase);
        result.splice(idx, 1);
      }

      result.push(candidate);
      seen.add(phrase);
    }
  }

  return result;
}

// Fix 5: Known short technical terms that should NOT be filtered.
// Includes acronyms AND common 3-letter technical verbs/nouns.
const TECHNICAL_SHORT_WORDS: Set<string> = new Set([
  // Acronyms
  'api', 'sql', 'css', 'dom', 'rrf', 'bm25', 'mmr', 'trm', 'mcp', 'llm',
  'rag', 'jwt', 'url', 'cli', 'npm', 'git', 'jsx', 'tsx', 'rpc', 'sdk',
  'e2e', 'ci', 'cd', 'dns', 'tcp', 'tls', 'ssh', 'aws', 'gcp',
  // Common technical verbs/nouns
  'bug', 'fix', 'hot', 'new', 'key', 'log', 'add', 'run', 'set', 'get',
  'map', 'raw', 'dry', 'pub', 'sub', 'env', 'dev', 'ops', 'tab', 'tag',
  'row', 'col', 'ref', 'var', 'doc', 'app', 'err', 'req', 'res', 'cmd',
  'arg', 'opt', 'src', 'bin', 'lib', 'pkg', 'mod', 'cfg', 'tmp',
  // Programming keywords (prevent filtering "try catch", "for loop", etc.)
  'try', 'for', 'if', 'do', 'io', 'fs', 'os', 'db', 'id', 'ip',
]);

/** Filter out phrases composed entirely of tech stop words or too-short generic bigrams */
export function filterTechStopWords(candidates: ScoredNgram[]): ScoredNgram[] {
  return candidates.filter((candidate: ScoredNgram) => {
    const words = candidate.phrase.split(' ');
    // Existing: remove if ALL words are stopwords
    if (words.every((word: string) => STOP_WORDS_TECH.has(word))) return false;
    // Fix 5A: Remove 2-word phrases where any word is too short and generic
    if (words.length === 2) {
      const hasShortGeneric = words.some(
        (w: string) => w.length < 4 && !TECHNICAL_SHORT_WORDS.has(w)
      );
      if (hasShortGeneric) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------
// 12. MAIN EXTRACTION
// ---------------------------------------------------------------

/**
 * Extract trigger phrases from memory content using TF-IDF + N-gram hybrid
 * with problem, technical, and decision pattern extraction.
 * Implements FR-012. Performance: <100ms for typical content (<10KB).
 */
export function extractTriggerPhrases(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  if (text.length < CONFIG.MIN_CONTENT_LENGTH) {
    return [];
  }

  const lowerText = text.toLowerCase();
  const placeholderIndicators: string[] = [
    'simulation mode',
    '[response]',
    'placeholder data',
    'fallback data',
    'no real conversation data',
    'simulated user message',
    'simulated assistant response',
  ];

  const placeholderCount = placeholderIndicators.filter(p => lowerText.includes(p)).length;
  if (placeholderCount >= 2) {
    return [];
  }

  const cleaned = removeMarkdown(text);
  const tokens = tokenize(cleaned);
  const filtered = filterStopWords(tokens);

  if (filtered.length < CONFIG.MIN_WORD_LENGTH) {
    return [];
  }

  const unigrams = countNgrams(filtered, 1);
  const bigrams = countNgrams(filtered, 2);
  const trigrams = countNgrams(filtered, 3);
  const quadgrams = countNgrams(filtered, 4);

  const totalTokens = filtered.length;
  const scoredUnigrams = scoreNgrams(unigrams, CONFIG.LENGTH_BONUS.UNIGRAM, totalTokens)
    .filter((candidate) => isAllowedUnigram(candidate.phrase));
  const scoredBigrams = scoreNgrams(bigrams, CONFIG.LENGTH_BONUS.BIGRAM, totalTokens);
  const scoredTrigrams = scoreNgrams(trigrams, CONFIG.LENGTH_BONUS.TRIGRAM, totalTokens);
  const scoredQuadgrams = scoreNgrams(quadgrams, CONFIG.LENGTH_BONUS.QUADGRAM, totalTokens);

  const problemTerms = extractProblemTerms(cleaned);
  const technicalTerms = extractTechnicalTerms(text);
  const decisionTerms = extractDecisionTerms(cleaned);
  const actionTerms = extractActionTerms(cleaned);
  const compoundNouns = extractCompoundNouns(cleaned);

  const allCandidates: ScoredNgram[] = [
    ...problemTerms,
    ...technicalTerms,
    ...decisionTerms,
    ...actionTerms,
    ...compoundNouns,
    ...scoredUnigrams,
    ...scoredBigrams,
    ...scoredTrigrams,
    ...scoredQuadgrams,
  ];

  const deduplicated = deduplicateSubstrings(allCandidates);
  const techFiltered = filterTechStopWords(deduplicated);

  const topPhrases = techFiltered
    .sort((a, b) => b.score - a.score)
    .slice(0, CONFIG.MAX_PHRASE_COUNT)
    .map(item => item.phrase.toLowerCase().trim())
    .filter((phrase, index, arr) => arr.indexOf(phrase) === index);

  // Fix 5B: Still apply filterTechStopWords in relaxed mode (previously bypassed entirely)
  if (topPhrases.length < CONFIG.MIN_PHRASE_COUNT && deduplicated.length > 0) {
    const relaxed = filterTechStopWords(deduplicated)
      .sort((a, b) => b.score - a.score)
      .slice(0, CONFIG.MAX_PHRASE_COUNT)
      .map(item => item.phrase.toLowerCase().trim())
      .filter((phrase, index, arr) => arr.indexOf(phrase) === index);
    return relaxed;
  }

  return topPhrases;
}

/** Extract trigger phrases with metadata and breakdown by type */
export function extractTriggerPhrasesWithStats(text: string): ExtractionResult {
  const startTime = Date.now();

  const cleaned = removeMarkdown(text || '');
  const tokens = tokenize(cleaned);
  const filtered = filterStopWords(tokens);

  const problemTerms = extractProblemTerms(cleaned);
  const technicalTerms = extractTechnicalTerms(text || '');
  const decisionTerms = extractDecisionTerms(cleaned);
  const actionTerms = extractActionTerms(cleaned);
  const compoundNouns = extractCompoundNouns(cleaned);

  const phrases = extractTriggerPhrases(text);
  const elapsed = Date.now() - startTime;

  return {
    phrases,
    stats: {
      inputLength: (text || '').length,
      cleanedLength: cleaned.length,
      tokenCount: tokens.length,
      filteredTokenCount: filtered.length,
      phraseCount: phrases.length,
      extractionTimeMs: elapsed,
    },
    breakdown: {
      problemTerms: problemTerms.length,
      technicalTerms: technicalTerms.length,
      decisionTerms: decisionTerms.length,
      actionTerms: actionTerms.length,
      compoundNouns: compoundNouns.length,
      samples: {
        problem: problemTerms.slice(0, 3).map(t => t.phrase),
        technical: technicalTerms.slice(0, 3).map(t => t.phrase),
        decision: decisionTerms.slice(0, 3).map(t => t.phrase),
        action: actionTerms.slice(0, 3).map(t => t.phrase),
        compound: compoundNouns.slice(0, 3).map(t => t.phrase),
      },
    },
  };
}
