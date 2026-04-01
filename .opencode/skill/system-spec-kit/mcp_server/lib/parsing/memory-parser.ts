// ───────────────────────────────────────────────────────────────
// MODULE: Memory Parser
// ───────────────────────────────────────────────────────────────
// Feature catalog: Content-aware memory filename generation
// Node stdlib
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Internal modules
import { escapeRegex } from '../utils/path-security.js';
import { getCanonicalPathKey, canonicalizeForSpecFolderExtraction } from '../utils/canonical-path.js';
import { getDefaultTierForDocumentType, isValidTier, normalizeTier } from '../scoring/importance-tiers.js';
// Import type inference for memory_type classification
import { inferMemoryType } from '../config/type-inference.js';
import {
  canClassifyAsSpecDocument,
  extractSpecFolderFromSpecDocumentPath,
  isWorkingArtifactPath,
  matchesSpecDocumentPath,
  SPEC_DOCUMENT_FILENAMES,
} from '../config/spec-doc-paths.js';

export { getCanonicalPathKey };

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** Causal link relationship types between memories */
export interface CausalLinks {
  caused_by: string[];
  supersedes: string[];
  derived_from: string[];
  blocks: string[];
  related_to: string[];
}

/** Type inference result from inferMemoryType */
export interface TypeInferenceResult {
  type: string;
  source: string;
  confidence: number;
}

/** Parsed memory file data */
export interface ParsedMemory {
  filePath: string;
  specFolder: string;
  title: string | null;
  triggerPhrases: string[];
  contextType: string;
  importanceTier: string;
  contentHash: string;
  content: string;
  fileSize: number;
  lastModified: string;
  memoryType: string;
  memoryTypeSource: string;
  memoryTypeConfidence: number;
  causalLinks: CausalLinks;
  hasCausalLinks: boolean;
  /** Spec 126: Document structural type (spec, plan, tasks, memory, etc.) */
  documentType: string;
  qualityScore: number;
  qualityFlags: string[];
}

/** Anchor validation result */
export interface AnchorValidation {
  valid: boolean;
  warnings: string[];
  unclosedAnchors: string[];
}

/** Parsed memory validation result */
export interface ParsedMemoryValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/** Context type string value */
// P1-3: Import canonical context type definitions from shared source of truth.
// Re-export ContextType for consumers that import it from this module.
export type { ContextType } from '@spec-kit/shared/context-types';
import type { ContextType } from '@spec-kit/shared/context-types';
import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';

interface ExtractImportanceTierOptions {
  documentType?: string | null;
  fallbackTier?: string | null;
}

// ───────────────────────────────────────────────────────────────
// 2. CONFIGURATION

// ───────────────────────────────────────────────────────────────
/**
 * Defines the MEMORY_FILE_PATTERN constant.
 */
export const MEMORY_FILE_PATTERN: RegExp = /specs\/([^/]+)(?:\/[^/]+)*\/memory\/[^/]+\.(?:md|txt)$/i;
/**
 * Defines the MAX_CONTENT_LENGTH constant.
 */
const _parsedMaxLen = parseInt(process.env.MCP_MAX_CONTENT_LENGTH || '250000', 10);
export const MAX_CONTENT_LENGTH: number = Number.isFinite(_parsedMaxLen) && _parsedMaxLen > 0 ? _parsedMaxLen : 250000;

/**
 * Defines the CONTEXT_TYPE_MAP constant.
 */
export const CONTEXT_TYPE_MAP: Record<string, ContextType> = {
  // Canonical self-mappings
  'implementation': 'implementation',
  'research': 'research',
  'planning': 'planning',
  'general': 'general',
  // Legacy aliases (from shared source of truth)
  ...LEGACY_CONTEXT_TYPE_ALIASES,
  // Convenience aliases (parser-specific)
  'debug': 'implementation',
  'analysis': 'research',
  'bug': 'implementation',
  'fix': 'implementation',
  'refactor': 'implementation',
  'feature': 'implementation',
  'architecture': 'planning',
  'review': 'research',
  'test': 'implementation',
};

// ───────────────────────────────────────────────────────────────
// 3. CORE PARSING FUNCTIONS

// ───────────────────────────────────────────────────────────────
function decodeUtf16BeBuffer(buffer: Buffer): string {
  const contentBuffer = Buffer.from(buffer);
  for (let i = 0; i < contentBuffer.length - 1; i += 2) {
    const temp = contentBuffer[i];
    contentBuffer[i] = contentBuffer[i + 1];
    contentBuffer[i + 1] = temp;
  }
  return contentBuffer.toString('utf16le');
}

function detectBomlessUtf16Encoding(buffer: Buffer): 'utf16le' | 'utf16be' | null {
  if (buffer.length < 4 || buffer.length % 2 !== 0) {
    return null;
  }

  const sampleLength = Math.min(buffer.length, 256);
  const pairCount = sampleLength / 2;
  let evenNulls = 0;
  let oddNulls = 0;
  let evenPrintable = 0;
  let oddPrintable = 0;

  for (let i = 0; i < sampleLength; i += 1) {
    const byte = buffer[i];
    const isPrintableAscii = byte === 0x09 || byte === 0x0A || byte === 0x0D || (byte >= 0x20 && byte <= 0x7E);
    if (i % 2 === 0) {
      if (byte === 0x00) evenNulls += 1;
      if (isPrintableAscii) evenPrintable += 1;
    } else {
      if (byte === 0x00) oddNulls += 1;
      if (isPrintableAscii) oddPrintable += 1;
    }
  }

  const evenNullRatio = evenNulls / pairCount;
  const oddNullRatio = oddNulls / pairCount;
  const evenPrintableRatio = evenPrintable / pairCount;
  const oddPrintableRatio = oddPrintable / pairCount;

  if (oddNullRatio >= 0.6 && evenPrintableRatio >= 0.6 && evenNullRatio <= 0.2) {
    return 'utf16le';
  }

  if (evenNullRatio >= 0.6 && oddPrintableRatio >= 0.6 && oddNullRatio <= 0.2) {
    return 'utf16be';
  }

  return null;
}

/** Read file with BOM detection for UTF-16 support */
export function readFileWithEncoding(filePath: string): string {
  const buffer = fs.readFileSync(filePath);

  // Check for BOM (Byte Order Mark)
  // UTF-8 BOM: EF BB BF (must check first - 3 bytes)
  if (buffer.length >= 3 &&
      buffer[0] === 0xEF &&
      buffer[1] === 0xBB &&
      buffer[2] === 0xBF) {
    return buffer.slice(3).toString('utf-8'); // Skip 3-byte BOM
  }

  // UTF-16 LE BOM: FF FE
  if (buffer.length >= 2 &&
      buffer[0] === 0xFF &&
      buffer[1] === 0xFE) {
    return buffer.toString('utf16le').slice(1); // UTF-16 LE
  }

  // UTF-16 BE BOM: FE FF
  // BUG-020 FIX: Node.js Buffer doesn't support 'utf16be' encoding natively.
  // Convert UTF-16 BE to LE by swapping bytes, then decode as utf16le.
  if (buffer.length >= 2 &&
      buffer[0] === 0xFE &&
      buffer[1] === 0xFF) {
    return decodeUtf16BeBuffer(buffer.slice(2));
  }

  const bomlessUtf16Encoding = detectBomlessUtf16Encoding(buffer);
  if (bomlessUtf16Encoding === 'utf16le') {
    return buffer.toString('utf16le');
  }
  if (bomlessUtf16Encoding === 'utf16be') {
    return decodeUtf16BeBuffer(buffer);
  }

  // No BOM detected, assume UTF-8
  return buffer.toString('utf-8');
}

/** Parse a memory file and extract all metadata */
export function parseMemoryFile(filePath: string): ParsedMemory {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Memory file not found: ${filePath}`);
  }

  const content = readFileWithEncoding(filePath);
  const lastModified = fs.statSync(filePath).mtime.toISOString();
  return parseMemoryContent(filePath, content, { lastModified });
}

/**
 * Parse in-memory content using the same metadata extraction path as parseMemoryFile().
 * This supports atomic-save flows that need to index content before promoting the
 * pending file to its final path.
 */
export function parseMemoryContent(
  filePath: string,
  content: string,
  options: { lastModified?: string } = {},
): ParsedMemory {
  // Infer document type from file path.
  const documentType = extractDocumentType(filePath);

  const spec_folder = extractSpecFolder(filePath);
  const title = extractTitle(content);
  const triggerPhrases = extractTriggerPhrases(content);
  const contextType = extractContextType(content);
  const importance_tier = extractImportanceTier(content, { documentType });
  const content_hash = computeContentHash(content);
  const qualityScore = extractQualityScore(content);
  const qualityFlags = extractQualityFlags(content);

  // Infer memory_type for type-specific half-lives (CHK-230)
  const typeInference: TypeInferenceResult = inferMemoryType({
    filePath,
    content: content,
    title: title ?? undefined,
    triggerPhrases: triggerPhrases,
    importanceTier: importance_tier,
  });

  // Extract causal_links for relationship tracking (CHK-231)
  const causalLinks = extractCausalLinks(content);

  return {
    filePath,
    specFolder: spec_folder,
    title,
    triggerPhrases: triggerPhrases,
    contextType: contextType,
    importanceTier: importance_tier,
    contentHash: content_hash,
    content,
    fileSize: content.length,
    lastModified: options.lastModified ?? new Date().toISOString(),
    // Memory type classification for decay calculation
    memoryType: typeInference.type,
    memoryTypeSource: typeInference.source,
    memoryTypeConfidence: typeInference.confidence,
    // Causal links for memory graph relationships
    causalLinks: causalLinks,
    hasCausalLinks: hasCausalLinks(causalLinks),
    // Document structural type.
    documentType,
    qualityScore,
    qualityFlags,
  };
}

// Canonical shared implementations — imported from shared/parsing
import { extractQualityScore, extractQualityFlags } from '@spec-kit/shared/parsing/quality-extractors';

/**
 * Extract document type from filename.
 * Maps well-known spec folder filenames to their document types.
 */
export function extractDocumentType(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const basename = path.basename(filePath).toLowerCase();

  // Spec folder document types
  const FILENAME_TO_DOC_TYPE: Record<string, string> = {
    'spec.md': 'spec',
    'plan.md': 'plan',
    'tasks.md': 'tasks',
    'checklist.md': 'checklist',
    'decision-record.md': 'decision_record',
    'implementation-summary.md': 'implementation_summary',
    'research.md': 'research',
    'handover.md': 'handover',
  };

  if (canClassifyAsSpecDocument(filePath)) {
    const docType = FILENAME_TO_DOC_TYPE[basename];
    if (docType && matchesSpecDocumentPath(filePath, basename)) return docType;
  }

  // Constitutional files
  if (normalizedPath.includes('/constitutional/') && normalizedPath.endsWith('.md')) {
    return 'constitutional';
  }

  return 'memory';
}

/** Extract spec folder name from file path */
export function extractSpecFolder(filePath: string): string {
  // Canonicalize first so symlinked paths (e.g. .claude/specs → .opencode/specs)
  // produce the same spec_folder as the real path.
  let normalizedPath = canonicalizeForSpecFolderExtraction(filePath);
  if (normalizedPath.startsWith('\\\\') || normalizedPath.startsWith('//')) {
    // Remove UNC prefix for pattern matching
    normalizedPath = normalizedPath.replace(/^(\\\\|\/\/)[^/\\]+[/\\][^/\\]+/, '');
  }
  // Normalize path separators
  normalizedPath = normalizedPath.replace(/\\/g, '/');

  // Match specs/XXX-name/.../memory/ pattern
  const match = normalizedPath.match(/specs\/([^/]+(?:\/[^/]+)*?)\/memory\//);

  if (match) {
    return match[1];
  }

  const specDocumentFolder = extractSpecFolderFromSpecDocumentPath(normalizedPath);
  if (specDocumentFolder) {
    return specDocumentFolder;
  }

  // Fallback: try to extract from path segments
  const segments = normalizedPath.split('/');
  const specsIndex = segments.findIndex(s => s === 'specs');

  if (specsIndex >= 0 && specsIndex < segments.length - 2) {
    const memoryIndex = segments.indexOf('memory', specsIndex);
    if (memoryIndex > specsIndex + 1) {
      return segments.slice(specsIndex + 1, memoryIndex).join('/');
    }
    // If no memory/ dir exists, check for a spec document at the leaf.
    const _fileName = segments[segments.length - 1].toLowerCase();
    const specDocumentFolderFromLeaf = extractSpecFolderFromSpecDocumentPath(normalizedPath);
    if (specDocumentFolderFromLeaf) {
      return specDocumentFolderFromLeaf;
    }
  }

  // Last resort: use parent directory name (use normalizedPath, not raw filePath)
  const parentDir = path.dirname(path.dirname(normalizedPath));
  return path.basename(parentDir);
}

const MAX_MEMORY_TITLE_LENGTH = 120;

const GENERIC_MEMORY_TITLES = new Set([
  'session summary',
  'session context',
  'context summary',
  'memory summary',
  'conversation summary',
  'summary',
]);

function truncateTitle(title: string, maxLength: number = MAX_MEMORY_TITLE_LENGTH): string {
  if (title.length <= maxLength) {
    return title;
  }

  const truncated = title.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace >= Math.floor(maxLength * 0.6)) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}

function normalizeExtractedTitle(raw: string): string | null {
  if (typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw
    .replace(/`+/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-:;,]+$/, '');

  if (!cleaned) {
    return null;
  }

  return truncateTitle(cleaned);
}

function isGenericMemoryTitle(title: string): boolean {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return GENERIC_MEMORY_TITLES.has(normalized);
}

function getFirstMeaningfulLine(section: string): string | null {
  const lines = section.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    // Skip markdown structure/meta lines.
    if (/^(?:#|[-*]|>|\||```|<!--|\[|\{\{|\}\})/.test(line)) {
      continue;
    }

    const normalized = normalizeExtractedTitle(line);
    if (normalized) {
      return normalized;
    }
  }

  return null;
}

function extractFrontmatterBlock(content: string): string | null {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const frontmatterMatch = content.match(
    /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/,
  );
  return frontmatterMatch?.[1] ?? null;
}

function stripLeadingFrontmatter(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return content.replace(
    /^(?:\uFEFF)?(?:\s*<!--[\s\S]*?-->\s*)*---\s*\r?\n[\s\S]*?\r?\n---(?:\s*\r?\n|$)?/,
    '',
  );
}

/** Extract title from frontmatter or descriptive headings/content. */
export function extractTitle(content: string): string | null {
  if (!content || typeof content !== 'string') {
    return null;
  }

  // Check YAML frontmatter first (allow leading comments before frontmatter).
  const frontmatter = extractFrontmatterBlock(content);
  if (frontmatter) {
    const titleLineMatch = frontmatter.match(/^\s*title:\s*(.+)\s*$/mi);
    let rawFrontmatterTitle = titleLineMatch?.[1]?.trim() || '';

    if (
      (rawFrontmatterTitle.startsWith('"') && rawFrontmatterTitle.endsWith('"')) ||
      (rawFrontmatterTitle.startsWith("'") && rawFrontmatterTitle.endsWith("'"))
    ) {
      rawFrontmatterTitle = rawFrontmatterTitle.slice(1, -1);
    }

    rawFrontmatterTitle = rawFrontmatterTitle
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");

    const normalizedTitle = normalizeExtractedTitle(rawFrontmatterTitle);
    if (normalizedTitle) {
      return normalizedTitle;
    }
  }

  let body = content
    .replace(/^(?:\uFEFF)?\s*/, '')
    .replace(/^(?:<!--[\s\S]*?-->\s*)+/, '');

  body = stripLeadingFrontmatter(body);

  const h1Match = body.match(/^#\s+(.+)$/m);
  const h1Title = normalizeExtractedTitle(h1Match?.[1] || '');
  if (h1Title && !isGenericMemoryTitle(h1Title)) {
    return h1Title;
  }

  const contextualCandidates: Array<string | null> = [];

  const featureHeading = body.match(/^###\s+(?:FEATURE|BUGFIX|DECISION|IMPLEMENTATION|RESEARCH|OBSERVATION):\s+(.+)$/im);
  contextualCandidates.push(normalizeExtractedTitle(featureHeading?.[1] || ''));

  const summaryLine = body.match(/\*\*Summary:\*\*\s*(.+)$/im);
  contextualCandidates.push(normalizeExtractedTitle(summaryLine?.[1] || ''));

  const overviewSection = body.match(/##\s+\d+\.\s+OVERVIEW([\s\S]*?)(?:\n##\s+|\n<!--\s*\/ANCHOR:summary\s*-->|$)/i);
  contextualCandidates.push(getFirstMeaningfulLine(overviewSection?.[1] || ''));

  const h2Match = body.match(/^##\s+(.+)$/m);
  contextualCandidates.push(normalizeExtractedTitle(h2Match?.[1] || ''));

  for (const candidate of contextualCandidates) {
    if (candidate && !isGenericMemoryTitle(candidate)) {
      return candidate;
    }
  }

  return h1Title || null;
}

/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
export function extractTriggerPhrases(content: string): string[] {
  const triggers: string[] = [];
  const frontmatter = extractFrontmatterBlock(content) ?? '';

  // Method 1a: Check YAML frontmatter inline format
  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
  if (inlineMatch) {
    const arrayContent = inlineMatch[1];
    const phrases = arrayContent.match(/["']([^"']+)["']/g);
    if (phrases) {
      phrases.forEach((p: string) => {
        const cleaned = p.replace(/^["']|["']$/g, '').trim();
        if (cleaned.length > 0 && cleaned.length < 100) {
          triggers.push(cleaned);
        }
      });
    }
  }

  // Method 1b: Check YAML frontmatter multi-line format
  if (triggers.length === 0) {
    const lines = frontmatter.split('\n');
    let inTriggerBlock = false;

    for (const line of lines) {
      if (/^\s*(?:triggerPhrases|trigger_phrases):\s*$/i.test(line)) {
        inTriggerBlock = true;
        continue;
      }

      if (inTriggerBlock) {
        if (/^---\s*$/.test(line)) {
          break;
        }
        const itemMatch = line.match(/^\s*-\s*["']?([^"'\n#]+?)["']?\s*(?:#.*)?$/);
        if (itemMatch) {
          const phrase = itemMatch[1].trim();
          if (phrase.length > 0 && phrase.length < 100 && !/^-+$/.test(phrase) && !triggers.includes(phrase)) {
            triggers.push(phrase);
          }
        } else if (!/^\s*$/.test(line) && !/^\s*#/.test(line) && !/^\s+-/.test(line)) {
          break;
        }
      }
    }
  }

  // Method 2: Find ## Trigger Phrases section (fallback/additional)
  const sectionMatch = content.match(/##\s*Trigger\s*Phrases?\s*\n([\s\S]*?)(?=\n##|\n---|\n\n\n|$)/i);

  if (sectionMatch) {
    const sectionContent = sectionMatch[1];
    const bullets = sectionContent.match(/^[\s]*[-*]\s+(.+)$/gm);

    if (bullets) {
      bullets.forEach((line: string) => {
        const phrase = line.replace(/^[\s]*[-*]\s+/, '').trim();
        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
          triggers.push(phrase);
        }
      });
    }
  }

  return triggers;
}

/** Extract context type from metadata block */
export function extractContextType(content: string): ContextType {
  // Look for > Session type: or > Context type:
  const match = content.match(/>\s*(?:Session|Context)\s*type:\s*(\w+)/i);

  if (match) {
    const type = match[1].toLowerCase();
    return CONTEXT_TYPE_MAP[type] || 'general';
  }

  // Check YAML metadata block
  const frontmatter = extractFrontmatterBlock(content);
  const yamlMatch = frontmatter?.match(/(?:contextType|context_type):\s*["']?(\w+)["']?/i);
  if (yamlMatch) {
    return CONTEXT_TYPE_MAP[yamlMatch[1].toLowerCase()] || 'general';
  }

  return 'general';
}

/** Extract importance tier from content or metadata */
export function extractImportanceTier(content: string, options: ExtractImportanceTierOptions = {}): string {
  const { documentType = null, fallbackTier = null } = options;

  // Strip HTML comments to avoid matching instructional examples
  // (e.g., template comments containing "importanceTier: 'constitutional'" as documentation)
  const contentWithoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
  const frontmatter = extractFrontmatterBlock(contentWithoutComments);

  // Check YAML metadata block (only in non-comment content)
  const yamlMatch = frontmatter?.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
  if (yamlMatch) {
    const tier = yamlMatch[1].toLowerCase();
    if (isValidTier(tier)) {
      return normalizeTier(tier);
    }
  }

  // Check for tier markers in content (only in non-comment content)
  if (contentWithoutComments.includes('[CONSTITUTIONAL]') || contentWithoutComments.includes('importance: constitutional')) {
    return 'constitutional';
  }
  if (contentWithoutComments.includes('[CRITICAL]') || contentWithoutComments.includes('importance: critical')) {
    return 'critical';
  }
  if (contentWithoutComments.includes('[IMPORTANT]') || contentWithoutComments.includes('importance: important')) {
    return 'important';
  }

  if (fallbackTier && isValidTier(fallbackTier)) {
    return normalizeTier(fallbackTier);
  }

  if (documentType) {
    return getDefaultTierForDocumentType(documentType);
  }

  return 'normal';
}

/** Compute SHA-256 hash of content for change detection */
export function computeContentHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Extract causal_links from memory content YAML metadata block (T126)
 */
export function extractCausalLinks(content: string): CausalLinks {
  const causalLinks: CausalLinks = {
    caused_by: [],
    supersedes: [],
    derived_from: [],
    blocks: [],
    related_to: []
  };

  // Find the causal_links block in YAML metadata
  const causalBlockMatch = content.match(/(?:^|\n)\s*causalLinks:\s*\n((?:\s+[a-z_]+:[\s\S]*?)*)(?=\n[a-z_]+:|\n```|\n---|\n\n|\n#|$)/i);

  if (!causalBlockMatch) {
    return causalLinks;
  }

  const block = causalBlockMatch[1];
  const lines = block.split('\n');

  let currentKey: keyof CausalLinks | null = null;

  for (const line of lines) {
    // Check for sub-key (e.g., "  caused_by:")
    const keyMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*$/);
    if (keyMatch) {
      currentKey = keyMatch[1] as keyof CausalLinks;
      continue;
    }

    // Check for inline array format
    const inlineMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*\[(.*)\]\s*$/);
    if (inlineMatch) {
      currentKey = inlineMatch[1] as keyof CausalLinks;
      const arrayContent = inlineMatch[2].trim();
      if (arrayContent) {
        const values = arrayContent.match(/["']([^"']+)["']/g);
        if (values) {
          values.forEach((v: string) => {
            const cleaned = v.replace(/^["']|["']$/g, '').trim();
            if (cleaned && currentKey && !causalLinks[currentKey].includes(cleaned)) {
              causalLinks[currentKey].push(cleaned);
            }
          });
        }
      }
      currentKey = null;
      continue;
    }

    // Check for list item
    if (currentKey) {
      const itemMatch = line.match(/^\s+-\s*["']?([^"'\n]+?)["']?\s*$/);
      if (itemMatch) {
        const value = itemMatch[1].trim();
        if (value && value !== '[]' && !causalLinks[currentKey].includes(value)) {
          causalLinks[currentKey].push(value);
        }
      } else if (line.trim() && !line.match(/^\s*#/) && !line.match(/^\s+-/)) {
        currentKey = null;
      }
    }
  }

  return causalLinks;
}

/**
 * Check if causalLinks has any non-empty arrays
 */
export function hasCausalLinks(causalLinks: CausalLinks | null | undefined): boolean {
  if (!causalLinks) return false;
  return Object.values(causalLinks).some((arr: string[]) => Array.isArray(arr) && arr.length > 0);
}

// ───────────────────────────────────────────────────────────────
// 4. VALIDATION FUNCTIONS

// ───────────────────────────────────────────────────────────────
/** Constitutional markdown basenames intentionally excluded from indexing */
const EXCLUDED_CONSTITUTIONAL_BASENAMES = new Set(['readme.md', 'readme.txt']);

function isMarkdownOrTextFile(filePath: string): boolean {
  return /\.(md|txt)$/i.test(filePath);
}

/** Check if a file path is a valid memory file */
export function isMemoryFile(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');

  // Standard memory files in specs
  const isSpecsMemory = (
    isMarkdownOrTextFile(normalizedPath) &&
    normalizedPath.includes('/memory/') &&
    normalizedPath.includes('/specs/')
  );

  // Spec folder documents (spec.md, plan.md, tasks.md, etc.).
  const isSpecDocument = (
    normalizedPath.endsWith('.md') &&
    canClassifyAsSpecDocument(normalizedPath) &&
    !isWorkingArtifactPath(normalizedPath) &&
    SPEC_DOCUMENT_FILENAMES_SET.has(path.basename(normalizedPath).toLowerCase()) &&
    matchesSpecDocumentPath(normalizedPath, path.basename(normalizedPath).toLowerCase())
  );

  // Constitutional memories in skill folder
  const isConstitutional = (
    normalizedPath.endsWith('.md') &&
    normalizedPath.includes('/.opencode/skill/') &&
    normalizedPath.includes('/constitutional/') &&
    !EXCLUDED_CONSTITUTIONAL_BASENAMES.has(path.basename(normalizedPath).toLowerCase())
  );

  return isSpecsMemory || isSpecDocument || isConstitutional;
}

/** Set of recognized spec folder document filenames (lowercase) */
const SPEC_DOCUMENT_FILENAMES_SET = SPEC_DOCUMENT_FILENAMES;

/** Validate anchor tags in memory content */
export function validateAnchors(content: string): AnchorValidation {
  const warnings: string[] = [];
  const unclosedAnchors: string[] = [];
  const anchorStack: string[] = [];
  let hasStructuralErrors = false;
  const tokenPattern = /<!--\s*(\/)?(?:ANCHOR|anchor):\s*([^>\s]+)\s*-->/gi;
  const VALID_ANCHOR_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9-/]*$/;

  let match: RegExpExecArray | null;
  while ((match = tokenPattern.exec(content)) !== null) {
    const isClosingTag = Boolean(match[1]);
    const anchorId = match[2].trim();

    // Validate anchor ID format
    if (!VALID_ANCHOR_PATTERN.test(anchorId)) {
      warnings.push(`Invalid anchor ID "${anchorId}" - should contain only alphanumeric and hyphens, start with alphanumeric`);
      hasStructuralErrors = true;
      continue;
    }

    if (!isClosingTag) {
      anchorStack.push(anchorId);
      continue;
    }

    const expectedAnchorId = anchorStack[anchorStack.length - 1];
    if (!expectedAnchorId) {
      warnings.push(`Anchor "${anchorId}" closes without a matching opening tag`);
      hasStructuralErrors = true;
      continue;
    }

    if (expectedAnchorId !== anchorId) {
      warnings.push(`Anchor "${anchorId}" closes out of order; expected "${expectedAnchorId}" to close first`);
      hasStructuralErrors = true;
      continue;
    }

    anchorStack.pop();
  }

  for (const anchorId of anchorStack) {
    unclosedAnchors.push(anchorId);
    warnings.push(`Anchor "${anchorId}" is missing closing tag <!-- /ANCHOR:${anchorId} --> - anchor-based content extraction will fail`);
  }

  return {
    valid: unclosedAnchors.length === 0 && !hasStructuralErrors,
    warnings,
    unclosedAnchors: unclosedAnchors,
  };
}

/** Extract content from anchors */
export function extractAnchors(content: string): Record<string, string> {
  const anchorValidation = validateAnchors(content);
  if (!anchorValidation.valid) {
    return {};
  }

  const anchors: Record<string, string> = {};

  const anchorRegex = /<!--\s*(?:ANCHOR|anchor):\s*([a-zA-Z0-9][a-zA-Z0-9-/]*)\s*-->/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorRegex.exec(content)) !== null) {
    const id = match[1];
    const startIndex = match.index + match[0].length;

    const closingRegex = new RegExp(`<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(id)}\\s*-->`, 'i');

    const remainingContent = content.slice(startIndex);
    const closeMatch = remainingContent.match(closingRegex);

    if (closeMatch && closeMatch.index !== undefined) {
      const innerContent = remainingContent.slice(0, closeMatch.index);
      anchors[id] = innerContent.trim();
    }
  }

  return anchors;
}

/** Validate parsed memory data */
export function validateParsedMemory(parsed: ParsedMemory): ParsedMemoryValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const MIN_CONTENT_LENGTH = 5;

  if (!parsed.specFolder) {
    errors.push('Missing spec folder');
  }

  if (!parsed.content || parsed.content.length < MIN_CONTENT_LENGTH) {
    errors.push(`Content too short (min ${MIN_CONTENT_LENGTH} chars)`);
  }

  if (parsed.content && parsed.content.length > MAX_CONTENT_LENGTH) {
    errors.push(`Content too long (max ${Math.round(MAX_CONTENT_LENGTH / 1000)}KB)`);
  }

  // Validate anchors (warnings only - don't block indexing)
  if (parsed.content) {
    const anchorValidation = validateAnchors(parsed.content);
    if (!anchorValidation.valid) {
      warnings.push(...anchorValidation.warnings);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ───────────────────────────────────────────────────────────────
// 5. DIRECTORY SCANNING

// ───────────────────────────────────────────────────────────────
/** Options for findMemoryFiles */
export interface FindMemoryFilesOptions {
  specFolder?: string | null;
}

function normalizeSpecFolderFilter(value: string): string {
  return value.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function matchesSpecFolderFilter(extractedFolder: string, specFolderFilter: string): boolean {
  const normalizedExtracted = normalizeSpecFolderFilter(extractedFolder);
  const normalizedFilter = normalizeSpecFolderFilter(specFolderFilter);

  if (!normalizedFilter) {
    return true;
  }

  return normalizedExtracted === normalizedFilter || normalizedExtracted.startsWith(`${normalizedFilter}/`);
}

/** Find all memory files in a workspace */
export function findMemoryFiles(workspacePath: string, options: FindMemoryFilesOptions = {}): string[] {
  const { specFolder = null } = options;
  const results: string[] = [];
  const seenCanonicalRoots = new Set<string>();
  const seenCanonicalFiles = new Set<string>();

  // Check both possible specs locations
  const specsLocations: string[] = [
    path.join(workspacePath, 'specs'),
    path.join(workspacePath, '.opencode', 'specs')
  ];

  // Recursive directory walker
  // BUG-027 FIX: Skip symbolic links to prevent infinite loops
  function walkDir(dir: string, depth: number = 0): void {
    if (depth > 10) {
      return; // Prevent infinite recursion
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return; // Skip unreadable directories
    }

    for (const entry of entries) {
      // BUG-027 FIX: Skip symbolic links to prevent loops and duplicate scanning
      if (entry.isSymbolicLink()) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip hidden directories and node_modules
        if (entry.name.startsWith('.') || entry.name === 'node_modules') {
          continue;
        }
        walkDir(fullPath, depth + 1);
      } else if (entry.isFile() && /\.(md|txt)$/i.test(entry.name)) {
        // Check if it's in a memory folder
        if (fullPath.includes('/memory/') || fullPath.includes('\\memory\\')) {
          // Apply spec folder filter if specified
          if (specFolder) {
            const extractedFolder = extractSpecFolder(fullPath);
            if (!matchesSpecFolderFilter(extractedFolder, specFolder)) {
              continue;
            }
          }

          const fileKey = getCanonicalPathKey(fullPath);
          if (seenCanonicalFiles.has(fileKey)) {
            continue;
          }

          seenCanonicalFiles.add(fileKey);
          results.push(fullPath);
        }
      }
    }
  }

  // Scan all existing specs locations
  for (const specs_dir of specsLocations) {
    if (!fs.existsSync(specs_dir)) {
      continue;
    }

    const rootKey = getCanonicalPathKey(specs_dir);
    if (seenCanonicalRoots.has(rootKey)) {
      continue;
    }

    seenCanonicalRoots.add(rootKey);
    walkDir(specs_dir);
  }

  return results;
}
