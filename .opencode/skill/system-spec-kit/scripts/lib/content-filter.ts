// ---------------------------------------------------------------
// MODULE: Content Filter
// ---------------------------------------------------------------

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
import { structuredLog } from '../utils/logger';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/** Content type classification labels */
export type ContentType = 'noise' | 'empty' | 'duplicate' | 'lowQuality' | 'valid';

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
    patterns: RegExp[];
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

// ---------------------------------------------------------------
// 2. CONFIGURATION
// ---------------------------------------------------------------

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
      // the merge loop preserves defaultConfig's structure for every section.
      return {
        pipeline: merged.pipeline as FilterConfig['pipeline'],
        noise: merged.noise as FilterConfig['noise'],
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

// ---------------------------------------------------------------
// 3. NOISE PATTERNS
// ---------------------------------------------------------------

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
] as const;

// Strip wrappers but preserve value
const STRIP_PATTERNS: readonly StripPattern[] = [
  { pattern: /^Caveat:[^\n]+\n+/i, replacement: '' },
  { pattern: /<command-name>([^<]+)<\/command-name>/g, replacement: 'Command: $1' },
  { pattern: /<system-reminder>[\s\S]*?<\/system-reminder>/g, replacement: '' },
] as const;

// ---------------------------------------------------------------
// 4. FILTERING PIPELINE
// ---------------------------------------------------------------

// P3-20: Factory function to create a fresh stats object per invocation
// (no longer a module-level mutable singleton)
function createFilterStats(): FilterStats {
  return {
    totalProcessed: 0,
    noiseFiltered: 0,
    duplicatesRemoved: 0,
    qualityScore: 100,
    filtered: { noise: 0, empty: 0, duplicate: 0, lowQuality: 0 },
  };
}

/** @deprecated Use createFilterStats() — kept for backward compatibility */
function resetStats(): void {
  // No-op: stats are now per-pipeline, not global
}

/** @deprecated Stats are now per-pipeline. Use pipeline.getQualityScore() instead. */
function getFilterStats(): FilterStats {
  // Return empty stats for backward compatibility
  return createFilterStats();
}

function isNoiseContent(content: string): boolean {
  if (!content || typeof content !== 'string') return true;

  const trimmed: string = content.trim();
  const cleaned: string = trimmed
    .replace(/^Command:\s*\/\w+\s*/i, '')
    .replace(/^\s+/, '')
    .trim();

  for (const pattern of NOISE_PATTERNS) {
    if (pattern.test(cleaned)) return true;
  }

  if (cleaned !== trimmed) {
    for (const pattern of NOISE_PATTERNS) {
      if (pattern.test(trimmed)) return true;
    }
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
function generateContentHash(content: string, length: number = 200): string {
  if (!content) return '';
  const normalized: string = content
    .toLowerCase()
    .replace(/\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, length);
  return crypto.createHash('md5').update(normalized).digest('hex');
}

function calculateSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const hashA: string = generateContentHash(a, 100);
  const hashB: string = generateContentHash(b, 100);
  if (hashA === hashB) return 1;

  const maxLen: number = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  const aLower: string = a.toLowerCase().slice(0, 200);
  const bLower: string = b.toLowerCase().slice(0, 200);
  let matches: number = 0;
  const shorter: string = aLower.length < bLower.length ? aLower : bLower;
  const longer: string = aLower.length < bLower.length ? bLower : aLower;

  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }

  return matches / longer.length;
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

// ---------------------------------------------------------------
// 5. MAIN FILTER FUNCTIONS
// ---------------------------------------------------------------

function createFilterPipeline(customConfig: Partial<FilterConfig> = {}): FilterPipeline {
  const config: FilterConfig = { ...loadFilterConfig(), ...customConfig } as FilterConfig;
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
      // P3-21: Return new array with new objects — never mutate input
      return prompts
        .map((p: PromptItem) => ({ ...p }))
        .filter((p: PromptItem) => {
          const content: string = p.prompt || p.content || '';
          if (isNoiseContent(content)) {
            filterStats.filtered.noise++;
            filterStats.noiseFiltered++;
            return false;
          }
          const cleaned: string = stripNoiseWrappers(content);
          if (cleaned !== content) {
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
    },

    deduplicate(prompts: PromptItem[]): PromptItem[] {
      const seenHashes: Map<string, number> = new Map();
      const seenContent: string[] = [];
      const result: PromptItem[] = [];

      for (let i = 0; i < prompts.length; i++) {
        const content: string = prompts[i].prompt || prompts[i].content || '';
        const hash: string = generateContentHash(content, config.dedupe?.hashLength || 200);

        if (seenHashes.has(hash)) {
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
          seenHashes.set(hash, result.length);
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
      return { ...filterStats, filtered: { ...filterStats.filtered } };
    },
  };
}

function filterContent(prompts: PromptItem[], options: Partial<FilterConfig> = {}): PromptItem[] {
  const pipeline: FilterPipeline = createFilterPipeline(options);
  return pipeline.filter(prompts);
}

// ---------------------------------------------------------------
// 6. EXPORTS
// ---------------------------------------------------------------

export {
  createFilterPipeline,
  filterContent,
  getFilterStats,
  resetStats,
  isNoiseContent,
  stripNoiseWrappers,
  meetsMinimumRequirements,
  generateContentHash,
  calculateSimilarity,
  calculateQualityScore,
  NOISE_PATTERNS,
};
