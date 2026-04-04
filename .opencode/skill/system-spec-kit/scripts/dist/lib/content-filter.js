"use strict";
// ---------------------------------------------------------------
// MODULE: Content Filter
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOISE_PATTERNS = void 0;
exports.createFilterPipeline = createFilterPipeline;
exports.isNoiseContent = isNoiseContent;
// ───────────────────────────────────────────────────────────────
// 1. CONTENT FILTER
// ───────────────────────────────────────────────────────────────
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonc_strip_1 = require("@spec-kit/shared/utils/jsonc-strip");
const logger_1 = require("../utils/logger");
function cloneRegExp(pattern) {
    return new RegExp(pattern.source, pattern.flags);
}
function describePattern(pattern) {
    return pattern.toString();
}
function compileNoisePatterns(patterns) {
    if (!Array.isArray(patterns)) {
        return [];
    }
    const tryCompilePattern = (source, flags = '') => {
        try {
            return new RegExp(source, flags);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            (0, logger_1.structuredLog)('warn', `Skipping invalid noise pattern: ${errMsg}`);
            return null;
        }
    };
    const compiled = [];
    for (const entry of patterns) {
        if (entry instanceof RegExp) {
            compiled.push(cloneRegExp(entry));
            continue;
        }
        if (typeof entry === 'string') {
            const literalMatch = entry.match(/^\/(.+)\/([a-z]*)$/i);
            const compiledPattern = literalMatch
                ? tryCompilePattern(literalMatch[1], literalMatch[2])
                : tryCompilePattern(entry);
            if (compiledPattern) {
                compiled.push(compiledPattern);
            }
            continue;
        }
        if (entry && typeof entry === 'object' && typeof entry.pattern === 'string') {
            const compiledPattern = tryCompilePattern(entry.pattern, typeof entry.flags === 'string' ? entry.flags : '');
            if (compiledPattern) {
                compiled.push(compiledPattern);
            }
        }
    }
    return compiled;
}
function collectMatchedPatternLabels(content, patterns) {
    const matches = [];
    for (const pattern of patterns) {
        if (cloneRegExp(pattern).test(content)) {
            matches.push(describePattern(pattern));
        }
    }
    return matches;
}
function summarizeMatchCounts(matchCounts) {
    return [...matchCounts.entries()].map(([label, count]) => `${label} x${count}`);
}
// ───────────────────────────────────────────────────────────────
// 3. CONFIGURATION
// ───────────────────────────────────────────────────────────────
function loadFilterConfig() {
    const defaultConfig = {
        pipeline: {
            enabled: true,
            stages: ['noise', 'dedupe', 'quality'],
        },
        noise: {
            enabled: true,
            minContentLength: 5,
            minUniqueWords: 2,
            patterns: [],
        },
        dedupe: {
            enabled: true,
            hashLength: 200,
            similarityThreshold: 0.85,
        },
        quality: {
            enabled: true,
            warnThreshold: 20,
            factors: {
                uniqueness: 0.30,
                density: 0.30,
                fileRefs: 0.20,
                decisions: 0.20,
            },
        },
    };
    const configPath = path_1.default.join(__dirname, '..', '..', '..', 'config', 'filters.jsonc');
    try {
        if (fs_1.default.existsSync(configPath)) {
            const configContent = fs_1.default.readFileSync(configPath, 'utf-8');
            // Strip JSONC comments using the shared string-aware utility
            const jsonContent = (0, jsonc_strip_1.stripJsoncComments)(configContent);
            const userConfig = JSON.parse(jsonContent);
            // Deep merge: per-section merge preserves default properties not in user config
            const merged = { ...defaultConfig };
            for (const key of Object.keys(merged)) {
                const userVal = userConfig[key];
                const typedKey = key;
                const defaultVal = defaultConfig[typedKey];
                if (userVal != null && typeof userVal === 'object' && !Array.isArray(userVal)) {
                    merged[key] = { ...defaultVal, ...userVal };
                    // One level deeper for nested objects (e.g., quality.factors)
                    const mergedSection = merged[key];
                    const defaultSection = defaultVal;
                    const userSection = userVal;
                    for (const sub of Object.keys(mergedSection)) {
                        if (defaultSection?.[sub] != null && typeof defaultSection[sub] === 'object'
                            && !Array.isArray(defaultSection[sub]) && typeof userSection?.[sub] === 'object') {
                            mergedSection[sub] = { ...defaultSection[sub], ...userSection[sub] };
                        }
                    }
                }
                else if (userVal !== undefined) {
                    merged[key] = userVal;
                }
            }
            // Merged config has been reconstructed with all FilterConfig keys.
            // Per-property casts from unknown → specific type are safe here because
            // The merge loop preserves defaultConfig's structure for every section.
            const mergedNoise = merged.noise;
            return {
                pipeline: merged.pipeline,
                noise: {
                    ...mergedNoise,
                    patterns: compileNoisePatterns(mergedNoise.patterns),
                },
                dedupe: merged.dedupe,
                quality: merged.quality,
            };
        }
    }
    catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        (0, logger_1.structuredLog)('warn', `Failed to load filters.jsonc: ${errMsg}. Using defaults.`);
    }
    return defaultConfig;
}
// ───────────────────────────────────────────────────────────────
// 4. NOISE PATTERNS
// ───────────────────────────────────────────────────────────────
const NOISE_PATTERNS = [
    // Placeholder text
    /^User message$/i,
    /^User prompt$/i,
    /^Assistant message$/i,
    /^Assistant response$/i,
    // CLI/Command noise (complete tags)
    /^<command-name>.*<\/command-name>$/s,
    /^<local-command-stdout>.*<\/local-command-stdout>$/s,
    /^<command-message>.*<\/command-message>$/s,
    /^<command-args>.*<\/command-args>$/s,
    // Multiline command blocks
    /Command:\s*\/\w+\s*\n\s*<command-message>.*<\/command-message>/is,
    /Command:\s*\/\w+\s*\n\s*<command-args>.*<\/command-args>/is,
    // CLI noise (partial/empty tags)
    /^<command-name>\/?\w*<\/command-name>$/,
    /^<local-command-stdout>\s*<\/local-command-stdout>$/,
    /^<command-args>\s*<\/command-args>$/,
    /^<command-message>\s*<\/command-message>$/,
    // System caveats and metadata
    /^Caveat:\s*The messages below/i,
    /^Caveat:\s*DO NOT respond/i,
    // Image-only references
    /^\[Image #\d+\]$/,
    // Minimal content
    /^\.{1,3}$/,
    /^[\s\u00A0]*$/,
    // System reminder blocks
    /^<system-reminder>/,
    // Hook output noise
    /^UserPromptSubmit hook/i,
    /^Hook \w+ (success|failed|running)/i,
    // CLI-agnostic: generic XML wrapper tags (single-line complete tags)
    /^<[a-z_-]+>\s*<\/[a-z_-]+>$/,
    // Copilot CLI lifecycle noise
    /^tool\.execution_start/i,
    /^tool\.execution_complete/i,
    // Codex CLI reasoning block markers
    /^reasoning$/i,
    /^<reasoning>.*<\/reasoning>$/s,
];
exports.NOISE_PATTERNS = NOISE_PATTERNS;
// Strip wrappers but preserve value
const STRIP_PATTERNS = [
    { pattern: /^Caveat:[^\n]+\n+/i, replacement: '' },
    { pattern: /<command-name>([^<]+)<\/command-name>/g, replacement: 'Command: $1' },
    { pattern: /<system-reminder>[\s\S]*?<\/system-reminder>/g, replacement: '' },
];
// ───────────────────────────────────────────────────────────────
// 5. FILTERING PIPELINE
// ───────────────────────────────────────────────────────────────
// P3-20: Factory function to create a fresh stats object per invocation
// (no longer a module-level mutable singleton)
function createFilterStats() {
    return {
        totalProcessed: 0,
        noiseFiltered: 0,
        duplicatesRemoved: 0,
        qualityScore: 100,
        contaminationAudit: [],
        filtered: { noise: 0, empty: 0, duplicate: 0, lowQuality: 0 },
    };
}
/** Compat wrapper — prefer createFilterStats(). */
function resetStats() {
    // No-op: stats are now per-pipeline, not global
}
/** Compat wrapper — prefer pipeline.getQualityScore(). */
function getFilterStats() {
    // Return empty stats for backward compatibility
    return createFilterStats();
}
function isNoiseContent(content, additionalPatterns = []) {
    if (!content || typeof content !== 'string')
        return true;
    const trimmed = content.trim();
    const cleaned = trimmed
        .replace(/^Command:\s*\/\w+\s*/i, '')
        .replace(/^\s+/, '')
        .trim();
    const patterns = [...NOISE_PATTERNS, ...additionalPatterns];
    if (collectMatchedPatternLabels(cleaned, patterns).length > 0)
        return true;
    if (cleaned !== trimmed) {
        if (collectMatchedPatternLabels(trimmed, patterns).length > 0)
            return true;
    }
    return false;
}
function stripNoiseWrappers(content) {
    if (!content || typeof content !== 'string')
        return '';
    let cleaned = content;
    for (const { pattern, replacement } of STRIP_PATTERNS) {
        cleaned = cleaned.replace(pattern, replacement);
    }
    return cleaned.trim();
}
function meetsMinimumRequirements(content, config) {
    if (!content)
        return false;
    const trimmed = content.trim();
    if (trimmed.length < (config.noise?.minContentLength || 5))
        return false;
    const words = trimmed.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
    return new Set(words).size >= (config.noise?.minUniqueWords || 2);
}
/** MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps) */
function normalizeContentForHash(content, length) {
    if (!content)
        return '';
    const normalized = content
        .toLowerCase()
        .replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    return typeof length === 'number' && length > 0 ? normalized.slice(0, length) : normalized;
}
/** MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps) */
function generateContentHash(content, length = 200) {
    const normalized = normalizeContentForHash(content, length);
    if (!normalized)
        return '';
    return crypto_1.default.createHash('md5').update(normalized).digest('hex');
}
function calculateSimilarity(a, b) {
    if (!a && !b)
        return 1;
    if (!a || !b)
        return 0;
    if (a === b)
        return 1;
    const shingleSize = 2;
    const getShingles = (value) => {
        const words = value.toLowerCase().split(/\s+/).filter((word) => word.length > 0);
        const shingles = new Set();
        for (let i = 0; i <= words.length - shingleSize; i++) {
            shingles.add(words.slice(i, i + shingleSize).join(' '));
        }
        return shingles;
    };
    const shinglesA = getShingles(a);
    const shinglesB = getShingles(b);
    if (shinglesA.size === 0 && shinglesB.size === 0)
        return 1;
    if (shinglesA.size === 0 || shinglesB.size === 0)
        return 0;
    let intersection = 0;
    for (const shingle of shinglesA) {
        if (shinglesB.has(shingle))
            intersection++;
    }
    const unionSize = shinglesA.size + shinglesB.size - intersection;
    return unionSize === 0 ? 1 : intersection / unionSize;
}
function calculateQualityScore(items, config) {
    if (!items || items.length === 0)
        return 0;
    const factors = config.quality?.factors || {
        uniqueness: 0.30, density: 0.30, fileRefs: 0.20, decisions: 0.20,
    };
    // Uniqueness score
    const hashes = new Set();
    let uniqueCount = 0;
    for (const item of items) {
        const content = typeof item === 'string' ? item : item.prompt || item.content || '';
        const hash = generateContentHash(content);
        if (!hashes.has(hash)) {
            hashes.add(hash);
            uniqueCount++;
        }
    }
    const uniquenessScore = (uniqueCount / items.length) * 100;
    // Information density (presence of concrete terms)
    const concreteTerms = /\b(implement|create|fix|update|add|remove|change|configure|test|verify|bug|error|feature|file|function|class|module)\b/gi;
    let densityTotal = 0;
    for (const item of items) {
        const content = typeof item === 'string' ? item : item.prompt || item.content || '';
        densityTotal += Math.min((content.match(concreteTerms) || []).length / 3, 1);
    }
    const densityScore = (densityTotal / items.length) * 100;
    // File reference score
    const filePatterns = /\b[\w\-\/]+\.(js|ts|md|json|sh|css|html|py)\b/g;
    let fileRefTotal = 0;
    for (const item of items) {
        const content = typeof item === 'string' ? item : item.prompt || item.content || '';
        fileRefTotal += Math.min((content.match(filePatterns) || []).length / 2, 1);
    }
    const fileRefScore = (fileRefTotal / items.length) * 100;
    // Decision clarity score
    const decisionTerms = /\b(decided|chose|selected|option|approach|because|rationale|reason)\b/gi;
    let decisionTotal = 0;
    for (const item of items) {
        const content = typeof item === 'string' ? item : item.prompt || item.content || '';
        decisionTotal += Math.min((content.match(decisionTerms) || []).length / 2, 1);
    }
    const decisionScore = (decisionTotal / items.length) * 100;
    return Math.round((uniquenessScore * factors.uniqueness) +
        (densityScore * factors.density) +
        (fileRefScore * factors.fileRefs) +
        (decisionScore * factors.decisions));
}
// ───────────────────────────────────────────────────────────────
// 6. MAIN FILTER FUNCTIONS
// ───────────────────────────────────────────────────────────────
function createFilterPipeline(customConfig = {}) {
    // F-23 — Deep merge to preserve nested defaults (e.g., pipeline.stages).
    // Shallow spread drops nested defaults when customConfig partially overrides pipeline.
    const defaults = loadFilterConfig();
    const config = {
        ...defaults,
        ...customConfig,
        pipeline: {
            ...defaults.pipeline,
            ...(customConfig.pipeline || {}),
            stages: customConfig.pipeline?.stages ?? defaults.pipeline?.stages ?? [],
        },
        noise: {
            ...defaults.noise,
            ...(customConfig.noise || {}),
            patterns: compileNoisePatterns(customConfig.noise?.patterns ?? defaults.noise.patterns),
        },
        dedupe: {
            ...defaults.dedupe,
            ...(customConfig.dedupe || {}),
        },
        quality: {
            ...defaults.quality,
            ...(customConfig.quality || {}),
            factors: {
                ...defaults.quality.factors,
                ...(customConfig.quality?.factors || {}),
            },
        },
    };
    // P3-20: Each pipeline gets its own stats (no shared mutable singleton)
    const filterStats = createFilterStats();
    return {
        config,
        filter(prompts) {
            if (!Array.isArray(prompts))
                return [];
            if (!config.pipeline?.enabled)
                return prompts;
            filterStats.totalProcessed = prompts.length;
            let filtered = [...prompts];
            // Stage 1: Noise filtering
            if (config.pipeline.stages.includes('noise') && config.noise?.enabled !== false) {
                filtered = this.filterNoise(filtered);
            }
            // Stage 2: Deduplication
            if (config.pipeline.stages.includes('dedupe') && config.dedupe?.enabled !== false) {
                filtered = this.deduplicate(filtered);
            }
            // Stage 3: Quality scoring
            if (config.pipeline.stages.includes('quality') && config.quality?.enabled !== false) {
                filterStats.qualityScore = calculateQualityScore(filtered, config);
            }
            return filtered;
        },
        filterNoise(prompts) {
            const configuredPatterns = compileNoisePatterns(config.noise?.patterns ?? []);
            const noisePatternLabels = [
                ...NOISE_PATTERNS.map((pattern) => describePattern(pattern)),
                ...configuredPatterns.map((pattern) => describePattern(pattern)),
            ];
            const matchCounts = new Map();
            let strippedWrapperCount = 0;
            // P3-21: Return new array with new objects — never mutate input
            const filtered = prompts
                .map((p) => ({ ...p }))
                .filter((p) => {
                const content = p.prompt || p.content || '';
                const matchedPatterns = collectMatchedPatternLabels(content, configuredPatterns);
                const hardcodedMatches = collectMatchedPatternLabels(content, NOISE_PATTERNS);
                const allMatches = [...hardcodedMatches, ...matchedPatterns];
                if (allMatches.length > 0 || isNoiseContent(content, configuredPatterns)) {
                    for (const label of allMatches) {
                        matchCounts.set(label, (matchCounts.get(label) ?? 0) + 1);
                    }
                    filterStats.filtered.noise++;
                    filterStats.noiseFiltered++;
                    return false;
                }
                const cleaned = stripNoiseWrappers(content);
                if (cleaned !== content) {
                    strippedWrapperCount++;
                    // P3-21: Modify the cloned object, not the original
                    p.prompt = cleaned;
                    p.content = cleaned;
                }
                if (!meetsMinimumRequirements(cleaned, config)) {
                    filterStats.filtered.empty++;
                    filterStats.noiseFiltered++;
                    return false;
                }
                return true;
            });
            const auditRecord = {
                stage: 'content-filter',
                timestamp: new Date().toISOString(),
                patternsChecked: [...new Set(noisePatternLabels)],
                matchesFound: summarizeMatchCounts(matchCounts),
                actionsTaken: [
                    `filtered_noise:${filterStats.filtered.noise}`,
                    `filtered_empty:${filterStats.filtered.empty}`,
                    `stripped_wrappers:${strippedWrapperCount}`,
                ],
                passedThrough: [
                    `input_items:${prompts.length}`,
                    `kept_items:${filtered.length}`,
                ],
            };
            filterStats.contaminationAudit.push(auditRecord);
            (0, logger_1.structuredLog)('info', 'contamination_audit', auditRecord);
            return filtered;
        },
        deduplicate(prompts) {
            const seenHashes = new Map();
            const seenContent = [];
            const result = [];
            for (let i = 0; i < prompts.length; i++) {
                const content = prompts[i].prompt || prompts[i].content || '';
                const normalizedContent = normalizeContentForHash(content);
                const hash = generateContentHash(content, config.dedupe?.hashLength || 200);
                const exactMatches = seenHashes.get(hash);
                if (exactMatches?.has(normalizedContent)) {
                    filterStats.filtered.duplicate++;
                    filterStats.duplicatesRemoved++;
                    continue;
                }
                let isDuplicate = false;
                for (const prevContent of seenContent) {
                    if (calculateSimilarity(content, prevContent) >= (config.dedupe?.similarityThreshold || 0.70)) {
                        isDuplicate = true;
                        filterStats.filtered.duplicate++;
                        filterStats.duplicatesRemoved++;
                        break;
                    }
                }
                if (!isDuplicate) {
                    if (!exactMatches) {
                        seenHashes.set(hash, new Set([normalizedContent]));
                    }
                    else {
                        exactMatches.add(normalizedContent);
                    }
                    seenContent.push(content);
                    result.push(prompts[i]);
                }
            }
            return result;
        },
        getQualityScore() {
            return filterStats.qualityScore;
        },
        isLowQuality() {
            return filterStats.qualityScore < (config.quality?.warnThreshold || 20);
        },
        getStats() {
            return {
                ...filterStats,
                contaminationAudit: [...filterStats.contaminationAudit],
                filtered: { ...filterStats.filtered },
            };
        },
    };
}
function filterContent(prompts, options = {}) {
    const pipeline = createFilterPipeline(options);
    return pipeline.filter(prompts);
}
//# sourceMappingURL=content-filter.js.map