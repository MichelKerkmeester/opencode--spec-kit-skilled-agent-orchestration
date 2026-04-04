import * as vectorIndex from '../search/vector-index.js';
import { escapeRegex } from '../utils/path-security.js';
/* --- 2. CONFIGURATION --- */
/**
 * Defines the CONFIG constant.
 */
export const CONFIG = {
    CACHE_TTL_MS: 60000,
    DEFAULT_LIMIT: 3,
    MIN_PHRASE_LENGTH: 3,
    MAX_PROMPT_LENGTH: 5000,
    WARN_THRESHOLD_MS: 30,
    LOG_EXECUTION_TIME: true,
    MAX_REGEX_CACHE_SIZE: 100,
};
/* --- 3. EXECUTION TIME LOGGING --- */
/** Log hook execution time for monitoring and debugging */
export function logExecutionTime(operation, durationMs, details = {}) {
    if (!CONFIG.LOG_EXECUTION_TIME) {
        return;
    }
    const logEntry = {
        timestamp: new Date().toISOString(),
        operation,
        durationMs: durationMs,
        target: durationMs < 50 ? 'PASS' : 'SLOW',
        ...details,
    };
    // Log to console for debugging
    if (durationMs >= CONFIG.WARN_THRESHOLD_MS) {
        console.warn(`[trigger-matcher] ${operation}: ${durationMs}ms (target <50ms)`, details);
    }
    else if (process.env.DEBUG_TRIGGER_MATCHER) {
        console.error(`[trigger-matcher] ${operation}: ${durationMs}ms`, details);
    }
    // Return the entry for test verification
    return logEntry;
}
/* --- 4. TRIGGER CACHE --- */
// In-memory cache of trigger phrases for fast matching
let triggerCache = null;
let triggerCandidateIndex = null;
let cacheTimestamp = 0;
let lastDegradedState = null;
const triggerCacheLoaderStatementByConnection = new WeakMap();
// LRU cache for regex objects to prevent memory leaks
const regexLruCache = new Map();
const UNICODE_WORD_CHAR_CLASS = '\\p{L}\\p{N}\\p{M}';
const UNICODE_TOKEN_PATTERN = /[\p{L}\p{N}\p{M}]+/gu;
const CJK_SCRIPT_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const MIN_INDEX_NGRAM_SIZE = 2;
const MAX_INDEX_NGRAM_SIZE = 3;
const COMMON_TRIGGER_STOPWORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but',
    'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
    'to', 'of', 'in', 'on', 'at', 'for', 'from', 'with', 'by',
]);
const TRIGGER_CACHE_LOADER_SQL = `
  SELECT id, spec_folder, file_path, title, trigger_phrases, importance_weight
  FROM memory_index
  WHERE embedding_status = 'success'
    AND trigger_phrases IS NOT NULL
    AND trigger_phrases != '[]'
    AND trigger_phrases != ''
  ORDER BY id ASC
`;
function getTriggerCacheLoaderStatement(database) {
    const cachedStatement = triggerCacheLoaderStatementByConnection.get(database);
    if (cachedStatement) {
        return cachedStatement;
    }
    const statement = database.prepare(TRIGGER_CACHE_LOADER_SQL);
    triggerCacheLoaderStatementByConnection.set(database, statement);
    return statement;
}
export function normalizeTriggerText(text) {
    return normalizeUnicode(text, false)
        .trim()
        .replace(/\s+/g, ' ');
}
function buildBoundaryRegex(phrase) {
    const normalizedPhrase = normalizeTriggerText(phrase);
    const escaped = escapeRegex(normalizedPhrase);
    // CJK text often appears in continuous sentence flow without whitespace-delimited
    // word breaks. For pure CJK trigger phrases, prefer substring matching so valid
    // phrases are not rejected by boundary checks on neighboring CJK characters.
    if (CJK_SCRIPT_PATTERN.test(normalizedPhrase) && !/\s/u.test(normalizedPhrase)) {
        return new RegExp(escaped, 'iu');
    }
    return new RegExp(`(?:^|[^${UNICODE_WORD_CHAR_CLASS}])${escaped}(?:[^${UNICODE_WORD_CHAR_CLASS}]|$)`, 'iu');
}
function getUnicodeTokens(text) {
    const normalized = normalizeTriggerText(text);
    if (!normalized) {
        return [];
    }
    return Array.from(normalized.matchAll(UNICODE_TOKEN_PATTERN), (match) => match[0]);
}
function isSignificantIndexToken(token) {
    if (!token) {
        return false;
    }
    return token.length >= CONFIG.MIN_PHRASE_LENGTH && !COMMON_TRIGGER_STOPWORDS.has(token);
}
function extractTriggerIndexKeys(text) {
    const normalized = normalizeTriggerText(text);
    if (!normalized) {
        return [];
    }
    const rawTokens = getUnicodeTokens(normalized);
    const tokens = rawTokens.filter(isSignificantIndexToken);
    const basis = tokens.length > 0 ? tokens : rawTokens;
    const keys = new Set();
    for (const token of basis) {
        if (token) {
            keys.add(token);
        }
    }
    for (let size = MIN_INDEX_NGRAM_SIZE; size <= MAX_INDEX_NGRAM_SIZE; size += 1) {
        if (basis.length < size) {
            continue;
        }
        for (let index = 0; index <= basis.length - size; index += 1) {
            keys.add(basis.slice(index, index + size).join(' '));
        }
    }
    if (keys.size === 0) {
        keys.add(normalized);
    }
    return [...keys];
}
function indexTriggerEntry(entry) {
    if (!triggerCandidateIndex) {
        triggerCandidateIndex = new Map();
    }
    const keys = extractTriggerIndexKeys(entry.phrase);
    for (const key of keys) {
        const indexedIds = triggerCandidateIndex.get(key);
        if (indexedIds) {
            indexedIds.add(entry.triggerId);
            continue;
        }
        triggerCandidateIndex.set(key, new Set([entry.triggerId]));
    }
}
function isSpecificTriggerPhrase(phrase) {
    const normalized = normalizeTriggerText(phrase);
    if (normalized.length < CONFIG.MIN_PHRASE_LENGTH) {
        return false;
    }
    const tokens = normalized.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
        return false;
    }
    if (tokens.length === 1) {
        return !COMMON_TRIGGER_STOPWORDS.has(tokens[0]);
    }
    return tokens.some((token) => token.length >= CONFIG.MIN_PHRASE_LENGTH);
}
/** Get or create a cached regex for a trigger phrase. @param phrase - The trigger phrase @returns Compiled RegExp */
export function getCachedRegex(phrase) {
    const normalizedPhrase = normalizeTriggerText(phrase);
    // Check if already in cache
    if (regexLruCache.has(normalizedPhrase)) {
        // Move to end (most recently used) by deleting and re-adding
        const regex = regexLruCache.get(normalizedPhrase);
        if (regex) {
            regexLruCache.delete(normalizedPhrase);
            regexLruCache.set(normalizedPhrase, regex);
            return regex;
        }
    }
    // Unicode-aware word boundary avoids false matches across non-Latin scripts.
    const regex = buildBoundaryRegex(normalizedPhrase);
    // Evict oldest entry if at capacity (T015: LRU eviction)
    if (regexLruCache.size >= CONFIG.MAX_REGEX_CACHE_SIZE) {
        const oldestKey = regexLruCache.keys().next().value;
        if (oldestKey !== undefined) {
            regexLruCache.delete(oldestKey);
        }
    }
    // Add to cache
    regexLruCache.set(normalizedPhrase, regex);
    return regex;
}
/** Load all trigger phrases from the index into memory */
export function loadTriggerCache() {
    const now = Date.now();
    // Return cached data if still valid
    if (triggerCache && (now - cacheTimestamp) < CONFIG.CACHE_TTL_MS) {
        return triggerCache;
    }
    try {
        lastDegradedState = null;
        // InitializeDb() is called on every cache-miss path (not just at startup)
        // Because trigger-matcher may be the first module to access the database in the
        // Process. The function is idempotent — repeated calls return immediately when the
        // DB singleton is already initialised — so the side-effect is safe.
        vectorIndex.initializeDb();
        const db = vectorIndex.getDb();
        // Null check for database
        if (!db) {
            console.warn('[trigger-matcher] Database not initialized. Server may still be starting up.');
            return [];
        }
        const rows = getTriggerCacheLoaderStatement(db).all();
        // Build flat cache for fast iteration
        triggerCache = [];
        triggerCandidateIndex = new Map();
        const failures = [];
        for (const row of rows) {
            let phrases;
            try {
                phrases = JSON.parse(row.trigger_phrases);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                console.warn(`[trigger-matcher] Failed to parse trigger phrases for memory ${row.id}: ${message}`);
                failures.push({
                    code: 'E_TRIGGER_SOURCE_PARSE',
                    message,
                    memoryId: row.id,
                    filePath: row.file_path,
                });
                continue;
            }
            if (!Array.isArray(phrases)) {
                continue;
            }
            for (const phrase of phrases) {
                if (typeof phrase !== 'string') {
                    continue;
                }
                const normalizedPhrase = normalizeTriggerText(phrase);
                if (!isSpecificTriggerPhrase(normalizedPhrase)) {
                    continue;
                }
                const entry = {
                    triggerId: triggerCache.length,
                    phrase: normalizedPhrase,
                    regex: getCachedRegex(normalizedPhrase),
                    memoryId: row.id,
                    specFolder: row.spec_folder,
                    filePath: row.file_path,
                    title: row.title,
                    importanceWeight: row.importance_weight || 0.5,
                };
                triggerCache.push(entry);
                indexTriggerEntry(entry);
            }
        }
        lastDegradedState = failures.length > 0
            ? {
                code: 'E_TRIGGER_SOURCE_PARSE',
                message: `Trigger cache loaded with ${failures.length} skipped source entries`,
                failedEntries: failures.length,
                failures,
            }
            : null;
        cacheTimestamp = now;
        return triggerCache;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[trigger-matcher] Cache load failed: ${message}`);
        lastDegradedState = {
            code: 'E_TRIGGER_CACHE_LOAD',
            message,
            failedEntries: 1,
            failures: [{ code: 'E_TRIGGER_CACHE_LOAD', message }],
        };
        return [];
    }
}
/** Clear the trigger cache (useful for testing or after updates) */
export function clearCache() {
    triggerCache = null;
    triggerCandidateIndex = null;
    cacheTimestamp = 0;
    lastDegradedState = null;
    regexLruCache.clear();
}
/** Get cache statistics */
export function getCacheStats() {
    return {
        size: triggerCache ? triggerCache.length : 0,
        timestamp: cacheTimestamp,
        ageMs: cacheTimestamp ? Date.now() - cacheTimestamp : null,
        regexCacheSize: regexLruCache.size,
        maxRegexCacheSize: CONFIG.MAX_REGEX_CACHE_SIZE,
    };
}
/* --- 5. STRING MATCHING --- */
/** Normalize string for Unicode-safe comparison */
export function normalizeUnicode(str, stripAccents = false) {
    if (!str) {
        return '';
    }
    // Step 1: NFC normalization (compose characters)
    let normalized = str.normalize('NFC');
    // Step 2: Optional accent stripping (NFKD + remove combining marks)
    if (stripAccents) {
        normalized = normalized
            .normalize('NFKD')
            .replace(/\p{M}/gu, '');
    }
    // Step 3: Case-fold (locale-independent lowercase)
    normalized = normalized.toLowerCase();
    return normalized;
}
/** Check if a phrase exists in text with word boundaries */
export function matchPhraseWithBoundary(text, phrase, precompiledRegex = null) {
    if (precompiledRegex) {
        return precompiledRegex.test(text);
    }
    // Fallback for direct calls without pre-compiled regex
    return buildBoundaryRegex(phrase).test(normalizeUnicode(text, false));
}
/* --- 6. SIGNAL VOCABULARY DETECTION (SPECKIT_SIGNAL_VOCAB) --- */
/** Keywords for CORRECTION signals — user is correcting a prior statement */
export const CORRECTION_KEYWORDS = [
    'actually',
    'wait',
    'i was wrong',
    'correction',
    'not quite',
    'let me rephrase',
    "that's not right",
];
/** Keywords for PREFERENCE signals — user is expressing a preference or intent */
export const PREFERENCE_KEYWORDS = [
    'prefer',
    'like',
    'want',
    'always use',
    'never use',
    'i want',
    'please use',
];
/** Keywords for REINFORCEMENT signals — user is confirming or praising a prior result */
export const REINFORCEMENT_KEYWORDS = [
    'that worked',
    'perfect',
    'exactly',
    'great',
    'yes',
    'keep doing that',
    'this is correct',
];
// Correction signals (0.2) weighted higher than preferences (0.1) and reinforcement (0.15) — corrections indicate stronger search intent
/** Boost values per signal category */
const SIGNAL_BOOSTS = {
    correction: 0.2,
    reinforcement: 0.15,
    preference: 0.1,
};
/**
 * Detect importance signals in a user prompt.
 * Returns an array of detected SignalDetection entries.
 * Only active when the SPECKIT_SIGNAL_VOCAB env var is set.
 */
export function detectSignals(prompt) {
    if (!prompt) {
        return [];
    }
    const normalized = normalizeUnicode(prompt, false);
    const detected = [];
    // Check CORRECTION keywords
    const correctionHits = [];
    for (const kw of CORRECTION_KEYWORDS) {
        if (matchPhraseWithBoundary(normalized, kw)) {
            correctionHits.push(kw);
        }
    }
    if (correctionHits.length > 0) {
        detected.push({
            category: 'correction',
            keywords: correctionHits,
            boost: SIGNAL_BOOSTS.correction,
        });
    }
    // Check PREFERENCE keywords
    const preferenceHits = [];
    for (const kw of PREFERENCE_KEYWORDS) {
        if (matchPhraseWithBoundary(normalized, kw)) {
            preferenceHits.push(kw);
        }
    }
    if (preferenceHits.length > 0) {
        detected.push({
            category: 'preference',
            keywords: preferenceHits,
            boost: SIGNAL_BOOSTS.preference,
        });
    }
    // Check REINFORCEMENT keywords
    const reinforcementHits = [];
    for (const kw of REINFORCEMENT_KEYWORDS) {
        if (matchPhraseWithBoundary(normalized, kw)) {
            reinforcementHits.push(kw);
        }
    }
    if (reinforcementHits.length > 0) {
        detected.push({
            category: 'reinforcement',
            keywords: reinforcementHits,
            boost: SIGNAL_BOOSTS.reinforcement,
        });
    }
    return detected;
}
/**
 * Apply signal boosts to matched results.
 * Boosts are additive; importanceWeight is capped at 1.0.
 * Only called when SPECKIT_SIGNAL_VOCAB is enabled.
 */
export function applySignalBoosts(matches, signals) {
    if (signals.length === 0) {
        return matches;
    }
    const totalBoost = signals.reduce((sum, s) => sum + s.boost, 0);
    return matches.map(m => ({
        ...m,
        importanceWeight: Math.min(1.0, m.importanceWeight + totalBoost),
    }));
}
/* --- 7. MAIN MATCHING FUNCTION --- */
/** Match user prompt against trigger phrases using exact string matching */
export function matchTriggerPhrases(userPrompt, limit = CONFIG.DEFAULT_LIMIT) {
    const startTime = Date.now();
    // Validation
    if (!userPrompt || typeof userPrompt !== 'string') {
        return [];
    }
    // Truncate very long prompts
    const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
        ? userPrompt.substring(0, CONFIG.MAX_PROMPT_LENGTH)
        : userPrompt;
    const promptNormalized = normalizeUnicode(prompt, false);
    // Load cache (fast if already loaded)
    const cache = loadTriggerCache();
    if (cache.length === 0) {
        return [];
    }
    const candidateEntries = getTriggerCandidates(promptNormalized, cache);
    // Match against all cached phrases
    const matchesByMemory = new Map();
    for (const entry of candidateEntries) {
        if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
            const key = entry.memoryId;
            let match = matchesByMemory.get(key);
            if (!match) {
                match = {
                    memoryId: entry.memoryId,
                    specFolder: entry.specFolder,
                    filePath: entry.filePath,
                    title: entry.title,
                    importanceWeight: entry.importanceWeight,
                    matchedPhrases: [],
                };
                matchesByMemory.set(key, match);
            }
            match.matchedPhrases.push(entry.phrase);
        }
    }
    // Sort by: 1) Number of matched phrases (desc), 2) Importance weight (desc)
    const results = Array.from(matchesByMemory.values())
        .sort((a, b) => {
        const phraseDiff = b.matchedPhrases.length - a.matchedPhrases.length;
        if (phraseDiff !== 0) {
            return phraseDiff;
        }
        return b.importanceWeight - a.importanceWeight;
    })
        .slice(0, limit);
    // Performance logging (CHK069)
    const elapsed = Date.now() - startTime;
    logExecutionTime('match_trigger_phrases', elapsed, {
        promptLength: prompt.length,
        cacheSize: cache.length,
        candidateCount: candidateEntries.length,
        matchCount: results.length,
        totalPhrases: results.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
    });
    return results;
}
/** Match trigger phrases with additional stats */
export function matchTriggerPhrasesWithStats(userPrompt, limit = CONFIG.DEFAULT_LIMIT) {
    const startTime = Date.now();
    const cache = loadTriggerCache();
    let matches = matchTriggerPhrases(userPrompt, limit);
    // Signal vocabulary detection — graduated: default-ON. Set SPECKIT_SIGNAL_VOCAB=false to disable.
    let signals;
    if (process.env.SPECKIT_SIGNAL_VOCAB?.toLowerCase() !== 'false') {
        signals = detectSignals(userPrompt || '');
        if (signals.length > 0) {
            matches = applySignalBoosts(matches, signals);
        }
    }
    const elapsed = Date.now() - startTime;
    return {
        matches,
        stats: {
            promptLength: (userPrompt || '').length,
            cacheSize: cache.length,
            matchCount: matches.length,
            totalMatchedPhrases: matches.reduce((sum, m) => sum + m.matchedPhrases.length, 0),
            matchTimeMs: elapsed,
            ...(signals !== undefined ? { signals } : {}),
            ...(lastDegradedState ? { degraded: lastDegradedState } : {}),
        },
    };
}
/** Get all unique trigger phrases in the cache */
export function getAllPhrases() {
    const cache = loadTriggerCache();
    return [...new Set(cache.map(e => e.phrase))];
}
export function getTriggerCandidates(userPrompt, cache = loadTriggerCache()) {
    if (cache.length === 0 || !triggerCandidateIndex || triggerCandidateIndex.size === 0) {
        return cache;
    }
    const promptKeys = extractTriggerIndexKeys(userPrompt);
    if (promptKeys.length === 0) {
        return cache;
    }
    const candidateIds = new Set();
    for (const key of promptKeys) {
        const indexedIds = triggerCandidateIndex.get(key);
        if (!indexedIds) {
            continue;
        }
        for (const triggerId of indexedIds) {
            candidateIds.add(triggerId);
        }
    }
    if (candidateIds.size === 0) {
        return cache;
    }
    return [...candidateIds]
        .sort((left, right) => left - right)
        .map((triggerId) => cache[triggerId])
        .filter((entry) => Boolean(entry));
}
/** Get memories by trigger phrase */
export function getMemoriesByPhrase(phrase) {
    const cache = loadTriggerCache();
    const normalizedPhrase = normalizeTriggerText(phrase);
    const memoryIds = new Set();
    const results = [];
    for (const entry of cache) {
        if (entry.phrase === normalizedPhrase && !memoryIds.has(entry.memoryId)) {
            memoryIds.add(entry.memoryId);
            results.push({
                memoryId: entry.memoryId,
                specFolder: entry.specFolder,
                filePath: entry.filePath,
                title: entry.title,
                importanceWeight: entry.importanceWeight,
            });
        }
    }
    return results;
}
/** Refresh trigger cache (forces reload on next access) */
export function refreshTriggerCache() {
    clearCache();
    return loadTriggerCache();
}
//# sourceMappingURL=trigger-matcher.js.map