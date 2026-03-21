// ---------------------------------------------------------------
// MODULE: Content Filter
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CONTENT FILTER
// ───────────────────────────────────────────────────────────────
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
import { structuredLog } from '../utils/logger';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Content type classification labels */
export type ContentType = 'noise' | 'empty' | 'duplicate' | 'lowQuality' | 'valid';

export interface NoisePatternConfig {
  pattern: string;
  flags?: string;
}

export interface ContaminationAuditRecord extends Record<string, unknown> {
  stage: 'extractor-scrub' | 'content-filter' | 'post-render';
  timestamp: string;
  patternsChecked: string[];
  matchesFound: string[];
  actionsTaken: string[];
  passedThrough: string[];
}

/** Filter pipeline configuration */
export interface FilterConfig {
  pipeline: {
    enabled: boolean;
    stages: string[];
  };
  noise: {
    enabled: boolean;
    minContentLength: number;
    minUniqueWords: number;
    patterns: Array<RegExp | string | NoisePatternConfig>;
  };
  dedupe: {
    enabled: boolean;
    hashLength: number;
    similarityThreshold: number;
  };
  quality: {
    enabled: boolean;
    warnThreshold: number;
    factors: QualityFactors;
  };
}

/** Quality score factor weights */
export interface QualityFactors {
  uniqueness: number;
  density: number;
  fileRefs: number;
  decisions: number;
}

/** Statistics from filtering pipeline execution */
export interface FilterStats {
  totalProcessed: number;
  noiseFiltered: number;
  duplicatesRemoved: number;
  qualityScore: number;
  contaminationAudit: ContaminationAuditRecord[];
  filtered: {
    noise: number;
    empty: number;
    duplicate: number;
    lowQuality: number;
  };
}

/** Strip pattern with replacement */
interface StripPattern {
  pattern: RegExp;
  replacement: string;
}

/** Prompt-like item that flows through the filter pipeline */
export interface PromptItem {
  prompt?: string;
  content?: string;
  [key: string]: unknown;
}

/** Filter pipeline instance with methods */
export interface FilterPipeline {
  config: FilterConfig;
  filter(prompts: PromptItem[]): PromptItem[];
  filterNoise(prompts: PromptItem[]): PromptItem[];
  deduplicate(prompts: PromptItem[]): PromptItem[];
  getQualityScore(): number;
  isLowQuality(): boolean;
  getStats(): FilterStats;
}

function cloneRegExp(pattern: RegExp): RegExp {
  return new RegExp(pattern.source, pattern.flags);
}

function describePattern(pattern: RegExp): string {
  return pattern.toString();
}

function compileNoisePatterns(patterns: unknown): RegExp[] {
  if (!Array.isArray(patterns)) {
    return [];
  }

  const tryCompilePattern = (source: string, flags: string = ''): RegExp | null => {
    try {
      return new RegExp(source, flags);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      structuredLog('warn', `Skipping invalid noise pattern: ${errMsg}`);
      return null;
    }
  };

  const compiled: RegExp[] = [];
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

    if (entry && typeof entry === 'object' && typeof (entry as NoisePatternConfig).pattern === 'string') {
      const compiledPattern = tryCompilePattern(
        (entry as NoisePatternConfig).pattern,
        typeof (entry as NoisePatternConfig).flags === 'string' ? (entry as NoisePatternConfig).flags : ''
      );
      if (compiledPattern) {
        compiled.push(compiledPattern);
      }
    }
  }

  return compiled;
}

function collectMatchedPatternLabels(content: string, patterns: readonly RegExp[]): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    if (cloneRegExp(pattern).test(content)) {
      matches.push(describePattern(pattern));
    }
  }
  return matches;
}

function summarizeMatchCounts(matchCounts: Map<string, number>): string[] {
  return [...matchCounts.entries()].map(([label, count]) => `${label} x${count}`);
}

// ───────────────────────────────────────────────────────────────
// 3. CONFIGURATION
// ───────────────────────────────────────────────────────────────
function loadFilterConfig(): FilterConfig {
  const defaultConfig: FilterConfig = {
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

  const configPath: string = path.join(__dirname, '..', '..', '..', 'config', 'filters.jsonc');

  try {
    if (fs.existsSync(configPath)) {
      const configContent: string = fs.readFileSync(configPath, 'utf-8');
      // Strip JSONC comments using the shared string-aware utility
      const jsonContent: string = stripJsoncComments(configContent);
      const userConfig: Record<string, unknown> = JSON.parse(jsonContent);
      // Deep merge: per-section merge preserves default properties not in user config
      const merged: Record<string, unknown> = { ...defaultConfig };
      for (const key of Object.keys(merged)) {
        const userVal = userConfig[key];
        const typedKey = key as keyof FilterConfig;
        const defaultVal = defaultConfig[typedKey];
        if (userVal != null && typeof userVal === 'object' && !Array.isArray(userVal)) {
          merged[key] = { ...(defaultVal as Record<string, unknown>), ...(userVal as Record<string, unknown>) };
          // One level deeper for nested objects (e.g., quality.factors)
          const mergedSection = merged[key] as Record<string, unknown>;
          const defaultSection = defaultVal as Record<string, unknown>;
          const userSection = userVal as Record<string, unknown>;
          for (const sub of Object.keys(mergedSection)) {
            if (defaultSection?.[sub] != null && typeof defaultSection[sub] === 'object'
                && !Array.isArray(defaultSection[sub]) && typeof userSection?.[sub] === 'object') {
              mergedSection[sub] = { ...(defaultSection[sub] as Record<string, unknown>), ...(userSection[sub] as Record<string, unknown>) };
            }
          }
        } else if (userVal !== undefined) {
          merged[key] = userVal;
        }
      }
      // Merged config has been reconstructed with all FilterConfig keys.
      // Per-property casts from unknown → specific type are safe here because
      // The merge loop preserves defaultConfig's structure for every section.
      const mergedNoise = merged.noise as FilterConfig['noise'];
      return {
        pipeline: merged.pipeline as FilterConfig['pipeline'],
        noise: {
          ...mergedNoise,
          patterns: compileNoisePatterns(mergedNoise.patterns),
        },
        dedupe: merged.dedupe as FilterConfig['dedupe'],
        quality: merged.quality as FilterConfig['quality'],
      };
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    structuredLog('warn', `Failed to load filters.jsonc: ${errMsg}. Using defaults.`);
  }

  return defaultConfig;
}

// ───────────────────────────────────────────────────────────────
// 4. NOISE PATTERNS
// ───────────────────────────────────────────────────────────────
const NOISE_PATTERNS: readonly RegExp[] = [
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
] as const;

// Strip wrappers but preserve value
const STRIP_PATTERNS: readonly StripPattern[] = [
  { pattern: /^Caveat:[^\n]+\n+/i, replacement: '' },
  { pattern: /<command-name>([^<]+)<\/command-name>/g, replacement: 'Command: $1' },
  { pattern: /<system-reminder>[\s\S]*?<\/system-reminder>/g, replacement: '' },
] as const;

// ───────────────────────────────────────────────────────────────
// 5. FILTERING PIPELINE
// ───────────────────────────────────────────────────────────────
// P3-20: Factory function to create a fresh stats object per invocation
// (no longer a module-level mutable singleton)
function createFilterStats(): FilterStats {
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
function resetStats(): void {
  // No-op: stats are now per-pipeline, not global
}

/** Compat wrapper — prefer pipeline.getQualityScore(). */
function getFilterStats(): FilterStats {
  // Return empty stats for backward compatibility
  return createFilterStats();
}

function isNoiseContent(content: string, additionalPatterns: readonly RegExp[] = []): boolean {
  if (!content || typeof content !== 'string') return true;

  const trimmed: string = content.trim();
  const cleaned: string = trimmed
    .replace(/^Command:\s*\/\w+\s*/i, '')
    .replace(/^\s+/, '')
    .trim();

  const patterns = [...NOISE_PATTERNS, ...additionalPatterns];
  if (collectMatchedPatternLabels(cleaned, patterns).length > 0) return true;

  if (cleaned !== trimmed) {
    if (collectMatchedPatternLabels(trimmed, patterns).length > 0) return true;
  }

  return false;
}

function stripNoiseWrappers(content: string): string {
  if (!content || typeof content !== 'string') return '';
  let cleaned: string = content;
  for (const { pattern, replacement } of STRIP_PATTERNS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned.trim();
}

function meetsMinimumRequirements(content: string, config: FilterConfig): boolean {
  if (!content) return false;
  const trimmed: string = content.trim();
  if (trimmed.length < (config.noise?.minContentLength || 5)) return false;
  const words: string[] = trimmed.toLowerCase().split(/\s+/).filter((w: string) => w.length > 1);
  return new Set(words).size >= (config.noise?.minUniqueWords || 2);
}

/** MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps) */
function normalizeContentForHash(content: string, length?: number): string {
  if (!content) return '';
  const normalized: string = content
    .toLowerCase()
    .replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return typeof length === 'number' && length > 0 ? normalized.slice(0, length) : normalized;
}

/** MD5 hash for deduplication (normalized: lowercase, collapsed whitespace, no timestamps) */
function generateContentHash(content: string, length: number = 200): string {
  const normalized: string = normalizeContentForHash(content, length);
  if (!normalized) return '';
  return crypto.createHash('md5').update(normalized).digest('hex');
}

function calculateSimilarity(a: string, b: string): number {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  if (a === b) return 1;

  const shingleSize: number = 2;
  const getShingles = (value: string): Set<string> => {
    const words: string[] = value.toLowerCase().split(/\s+/).filter((word: string) => word.length > 0);
    const shingles: Set<string> = new Set();

    for (let i = 0; i <= words.length - shingleSize; i++) {
      shingles.add(words.slice(i, i + shingleSize).join(' '));
    }

    return shingles;
  };

  const shinglesA: Set<string> = getShingles(a);
  const shinglesB: Set<string> = getShingles(b);

  if (shinglesA.size === 0 && shinglesB.size === 0) return 1;
  if (shinglesA.size === 0 || shinglesB.size === 0) return 0;

  let intersection: number = 0;
  for (const shingle of shinglesA) {
    if (shinglesB.has(shingle)) intersection++;
  }

  const unionSize: number = shinglesA.size + shinglesB.size - intersection;
  return unionSize === 0 ? 1 : intersection / unionSize;
}

function calculateQualityScore(items: PromptItem[], config: FilterConfig): number {
  if (!items || items.length === 0) return 0;

  const factors: QualityFactors = config.quality?.factors || {
    uniqueness: 0.30, density: 0.30, fileRefs: 0.20, decisions: 0.20,
  };

  // Uniqueness score
  const hashes: Set<string> = new Set();
  let uniqueCount: number = 0;
  for (const item of items) {
    const content: string = typeof item === 'string' ? item : (item as PromptItem).prompt || (item as PromptItem).content || '';
    const hash: string = generateContentHash(content);
    if (!hashes.has(hash)) {
      hashes.add(hash);
      uniqueCount++;
    }
  }
  const uniquenessScore: number = (uniqueCount / items.length) * 100;

  // Information density (presence of concrete terms)
  const concreteTerms: RegExp = /\b(implement|create|fix|update|add|remove|change|configure|test|verify|bug|error|feature|file|function|class|module)\b/gi;
  let densityTotal: number = 0;
  for (const item of items) {
    const content: string = typeof item === 'string' ? item : (item as PromptItem).prompt || (item as PromptItem).content || '';
    densityTotal += Math.min((content.match(concreteTerms) || []).length / 3, 1);
  }
  const densityScore: number = (densityTotal / items.length) * 100;

  // File reference score
  const filePatterns: RegExp = /\b[\w\-\/]+\.(js|ts|md|json|sh|css|html|py)\b/g;
  let fileRefTotal: number = 0;
  for (const item of items) {
    const content: string = typeof item === 'string' ? item : (item as PromptItem).prompt || (item as PromptItem).content || '';
    fileRefTotal += Math.min((content.match(filePatterns) || []).length / 2, 1);
  }
  const fileRefScore: number = (fileRefTotal / items.length) * 100;

  // Decision clarity score
  const decisionTerms: RegExp = /\b(decided|chose|selected|option|approach|because|rationale|reason)\b/gi;
  let decisionTotal: number = 0;
  for (const item of items) {
    const content: string = typeof item === 'string' ? item : (item as PromptItem).prompt || (item as PromptItem).content || '';
    decisionTotal += Math.min((content.match(decisionTerms) || []).length / 2, 1);
  }
  const decisionScore: number = (decisionTotal / items.length) * 100;

  return Math.round(
    (uniquenessScore * factors.uniqueness) +
    (densityScore * factors.density) +
    (fileRefScore * factors.fileRefs) +
    (decisionScore * factors.decisions)
  );
}

// ───────────────────────────────────────────────────────────────
// 6. MAIN FILTER FUNCTIONS
// ───────────────────────────────────────────────────────────────
function createFilterPipeline(customConfig: Partial<FilterConfig> = {}): FilterPipeline {
  // F-23 — Deep merge to preserve nested defaults (e.g., pipeline.stages).
  // Shallow spread drops nested defaults when customConfig partially overrides pipeline.
  const defaults = loadFilterConfig();
  const config: FilterConfig = {
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

    filter(prompts: PromptItem[]): PromptItem[] {
      if (!Array.isArray(prompts)) return [];
      if (!config.pipeline?.enabled) return prompts;

      filterStats.totalProcessed = prompts.length;
      let filtered: PromptItem[] = [...prompts];

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

    filterNoise(prompts: PromptItem[]): PromptItem[] {
      const configuredPatterns = compileNoisePatterns(config.noise?.patterns ?? []);
      const noisePatternLabels = [
        ...NOISE_PATTERNS.map((pattern) => describePattern(pattern)),
        ...configuredPatterns.map((pattern) => describePattern(pattern)),
      ];
      const matchCounts = new Map<string, number>();
      let strippedWrapperCount = 0;

      // P3-21: Return new array with new objects — never mutate input
      const filtered = prompts
        .map((p: PromptItem) => ({ ...p }))
        .filter((p: PromptItem) => {
          const content: string = p.prompt || p.content || '';
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
          const cleaned: string = stripNoiseWrappers(content);
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

      const auditRecord: ContaminationAuditRecord = {
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
      structuredLog('info', 'contamination_audit', auditRecord);

      return filtered;
    },

    deduplicate(prompts: PromptItem[]): PromptItem[] {
      const seenHashes: Map<string, Set<string>> = new Map();
      const seenContent: string[] = [];
      const result: PromptItem[] = [];

      for (let i = 0; i < prompts.length; i++) {
        const content: string = prompts[i].prompt || prompts[i].content || '';
        const normalizedContent: string = normalizeContentForHash(content);
        const hash: string = generateContentHash(content, config.dedupe?.hashLength || 200);
        const exactMatches: Set<string> | undefined = seenHashes.get(hash);

        if (exactMatches?.has(normalizedContent)) {
          filterStats.filtered.duplicate++;
          filterStats.duplicatesRemoved++;
          continue;
        }

        let isDuplicate: boolean = false;
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
          } else {
            exactMatches.add(normalizedContent);
          }
          seenContent.push(content);
          result.push(prompts[i]);
        }
      }

      return result;
    },

    getQualityScore(): number {
      return filterStats.qualityScore;
    },

    isLowQuality(): boolean {
      return filterStats.qualityScore < (config.quality?.warnThreshold || 20);
    },

    getStats(): FilterStats {
      return {
        ...filterStats,
        contaminationAudit: [...filterStats.contaminationAudit],
        filtered: { ...filterStats.filtered },
      };
    },
  };
}

function filterContent(prompts: PromptItem[], options: Partial<FilterConfig> = {}): PromptItem[] {
  const pipeline: FilterPipeline = createFilterPipeline(options);
  return pipeline.filter(prompts);
}

// ───────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  createFilterPipeline,
  isNoiseContent,
  NOISE_PATTERNS,
};
