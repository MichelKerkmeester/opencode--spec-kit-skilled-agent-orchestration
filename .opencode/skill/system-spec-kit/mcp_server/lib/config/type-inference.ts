// ───────────────────────────────────────────────────────────────
// MODULE: Type Inference
// ───────────────────────────────────────────────────────────────
// Feature catalog: Content-aware memory filename generation
import {
  MEMORY_TYPES,
  PATH_TYPE_PATTERNS,
  KEYWORD_TYPE_MAP,
  getDefaultType,
  isValidType,
  resolveSpecDocumentType,
} from './memory-types.js';
import { isWorkingArtifactPath } from './spec-doc-paths.js';

import type { MemoryTypeName, MemoryTypeConfig } from './memory-types.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
interface InferMemoryTypeParams {
  filePath?: string;
  content?: string;
  title?: string;
  triggerPhrases?: string[] | string;
  importanceTier?: string | null;
}

interface InferenceResult {
  type: MemoryTypeName;
  source: 'frontmatter_explicit' | 'importance_tier' | 'file_path' | 'keywords' | 'default';
  confidence: number;
}

interface DetailedTypeSuggestion extends InferenceResult {
  explanation: string;
  typeConfig: MemoryTypeConfig;
}

interface TypeValidationResult {
  valid: boolean;
  warnings: string[];
}

interface MemoryForBatchInference {
  filePath?: string;
  file_path?: string;
  content?: string;
  title?: string;
  triggerPhrases?: string[] | string;
  importanceTier?: string | null;
  importance_tier?: string | null;
}

// ───────────────────────────────────────────────────────────────
// 2. IMPORTANCE TIER TO TYPE MAPPING

// ───────────────────────────────────────────────────────────────
const TIER_TO_TYPE_MAP: Readonly<Record<string, MemoryTypeName>> = {
  constitutional: 'meta-cognitive',  // Rules that never decay
  critical: 'semantic',              // Core concepts, high persistence
  important: 'declarative',          // Important facts
  normal: 'declarative',             // Standard content
  temporary: 'working',              // Session-scoped, fast decay
  deprecated: 'episodic',            // Historical, kept for reference
} as const;

// ───────────────────────────────────────────────────────────────
// 3. TYPE INFERENCE FROM FILE PATH

// ───────────────────────────────────────────────────────────────
/**
 * Provides the inferTypeFromPath helper.
 */
export function inferTypeFromPath(filePath: string | null | undefined): MemoryTypeName | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  const specDocumentType = resolveSpecDocumentType(filePath);
  if (specDocumentType) {
    return specDocumentType;
  }

  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();

  for (const { pattern, type } of PATH_TYPE_PATTERNS) {
    if (pattern.test(normalizedPath)) {
      return type;
    }
  }

  return null;
}

// ───────────────────────────────────────────────────────────────
// 4. TYPE INFERENCE FROM FRONTMATTER

// ───────────────────────────────────────────────────────────────
/**
 * Provides the extractExplicitType helper.
 */
export function extractExplicitType(content: string | null | undefined): MemoryTypeName | null {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Check YAML frontmatter for memory_type or memoryType
  const typeMatch = content.match(/(?:memory_type|memoryType):\s*["']?([a-z-]+)["']?/i);
  if (typeMatch) {
    const type = typeMatch[1].toLowerCase();
    if (isValidType(type)) {
      return type as MemoryTypeName;
    }
  }

  return null;
}

/**
 * Provides the inferTypeFromTier helper.
 */
export function inferTypeFromTier(content: string | null | undefined): MemoryTypeName | null {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Check for importance_tier in frontmatter
  const tierMatch = content.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
  if (tierMatch) {
    const tier = tierMatch[1].toLowerCase();
    return TIER_TO_TYPE_MAP[tier] || null;
  }

  // Check for tier markers in content
  if (content.includes('[CONSTITUTIONAL]') || content.includes('importance: constitutional')) {
    return 'meta-cognitive';
  }
  if (content.includes('[CRITICAL]') || content.includes('importance: critical')) {
    return 'semantic';
  }

  return null;
}

// ───────────────────────────────────────────────────────────────
// 5. TYPE INFERENCE FROM KEYWORDS

// ───────────────────────────────────────────────────────────────
/**
 * Provides the inferTypeFromKeywords helper.
 */
export function inferTypeFromKeywords(
  title: string | null | undefined,
  triggerPhrases: string[] | string | null | undefined,
  content: string | null | undefined
): MemoryTypeName | null {
  // Normalize trigger phrases to array
  let phrases: string[] = [];
  if (Array.isArray(triggerPhrases)) {
    phrases = triggerPhrases;
  } else if (typeof triggerPhrases === 'string') {
    try {
      phrases = JSON.parse(triggerPhrases) as string[];
    } catch {
      phrases = [triggerPhrases];
    }
  }

  // Build searchable text from title and triggers
  const searchableText = [
    title || '',
    ...phrases,
  ].join(' ').toLowerCase();

  // Also check context_type from content
  const contextMatch = content?.match(/(?:contextType|context_type):\s*["']?(\w+)["']?/i);
  const contextType = contextMatch ? contextMatch[1].toLowerCase() : '';

  // Combined text for searching
  const fullText = `${searchableText} ${contextType}`;

  // Score each type based on keyword matches
  const typeScores = new Map<string, number>();

  for (const [keyword, type] of Object.entries(KEYWORD_TYPE_MAP)) {
    if (fullText.includes(keyword.toLowerCase())) {
      const currentScore = typeScores.get(type) || 0;
      // Longer keywords get higher scores (more specific)
      typeScores.set(type, currentScore + keyword.length);
    }
  }

  // Return type with highest score
  let bestType: MemoryTypeName | null = null;
  let bestScore = 0;

  for (const [type, score] of typeScores) {
    if (score > bestScore) {
      bestScore = score;
      bestType = type as MemoryTypeName;
    }
  }

  return bestType;
}

// ───────────────────────────────────────────────────────────────
// 6. MAIN INFERENCE FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Provides the inferMemoryType helper.
 */
export function inferMemoryType(params: InferMemoryTypeParams): InferenceResult {
  const {
    filePath,
    content = '',
    title = '',
    triggerPhrases = [],
    importanceTier = null,
  } = params;

  // 1. Check explicit type in frontmatter (highest confidence)
  const explicitType = extractExplicitType(content);
  if (explicitType) {
    return {
      type: explicitType,
      source: 'frontmatter_explicit',
      confidence: 1.0,
    };
  }

  // 2. Check config-backed spec document routing before tier heuristics.
  // Spec docs commonly carry an "important" tier and must not be
  // over-captured by the generic important -> declarative mapping.
  const specDocumentType = resolveSpecDocumentType(filePath);
  if (specDocumentType) {
    return {
      type: specDocumentType,
      source: 'file_path',
      confidence: 0.95,
    };
  }

  // 3. Check importance tier mapping
  if (importanceTier && TIER_TO_TYPE_MAP[importanceTier]) {
    return {
      type: TIER_TO_TYPE_MAP[importanceTier],
      source: 'importance_tier',
      confidence: 0.9,
    };
  }

  const tierInferredType = inferTypeFromTier(content);
  if (tierInferredType) {
    return {
      type: tierInferredType,
      source: 'importance_tier',
      confidence: 0.9,
    };
  }

  // 4. Check file path patterns
  const pathType = inferTypeFromPath(filePath);
  if (pathType) {
    return {
      type: pathType,
      source: 'file_path',
      confidence: 0.8,
    };
  }

  // 5. Check keyword analysis
  const keywordType = inferTypeFromKeywords(title, triggerPhrases, content);
  if (keywordType) {
    return {
      type: keywordType,
      source: 'keywords',
      confidence: 0.7,
    };
  }

  // 6. Default type (lowest confidence)
  return {
    type: getDefaultType(),
    source: 'default',
    confidence: 0.5,
  };
}

export function inferMemoryTypesBatch(
  memories: MemoryForBatchInference[]
): Map<string, InferenceResult> {
  const results = new Map<string, InferenceResult>();

  for (const memory of memories) {
    const result = inferMemoryType({
      filePath: memory.filePath || memory.file_path,
      content: memory.content,
      title: memory.title,
      triggerPhrases: memory.triggerPhrases,
      importanceTier: memory.importanceTier || memory.importance_tier,
    });

    // L1 FIX: Use index-based fallback key to avoid collapsing pathless inputs
    const key = memory.filePath || memory.file_path || `__pathless_${results.size}`;
    results.set(key, result);
  }

  return results;
}

// ───────────────────────────────────────────────────────────────
// 7. UTILITY FUNCTIONS

// ───────────────────────────────────────────────────────────────
const SOURCE_EXPLANATIONS: Record<string, string> = {
  frontmatter_explicit: 'Explicit memory_type field in YAML frontmatter',
  importance_tier: 'Derived from importance_tier field mapping',
  file_path: 'Matched file path pattern',
  keywords: 'Matched keywords in title or trigger phrases',
  default: 'No patterns matched, using default type',
};

export function getTypeSuggestionDetailed(params: InferMemoryTypeParams): DetailedTypeSuggestion {
  const result = inferMemoryType(params);

  return {
    ...result,
    explanation: SOURCE_EXPLANATIONS[result.source],
    typeConfig: MEMORY_TYPES[result.type],
  };
}

export function validateInferredType(
  inferredType: string,
  filePath: string | null | undefined
): TypeValidationResult {
  const warnings: string[] = [];

  // Check if constitutional content has correct type
  if (filePath?.includes('constitutional') && inferredType !== 'meta-cognitive') {
    warnings.push(`Constitutional file "${filePath}" has type "${inferredType}" instead of "meta-cognitive"`);
  }

  // Check if scratch/temp content has fast-decay type
  if (isWorkingArtifactPath(filePath) &&
      !['working', 'episodic'].includes(inferredType)) {
    warnings.push(`Temporary file "${filePath}" has slow-decay type "${inferredType}"`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}
