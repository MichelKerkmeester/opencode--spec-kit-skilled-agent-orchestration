// ---------------------------------------------------------------
// MODULE: Anchor Generator
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. ANCHOR GENERATOR
// ───────────────────────────────────────────────────────────────
import * as crypto from 'crypto';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Anchor tag type representing the semantic category of a section */
export type AnchorTag =
  | 'decision'
  | 'implementation'
  | 'guide'
  | 'architecture'
  | 'files'
  | 'discovery'
  | 'integration'
  | 'summary';

// ───────────────────────────────────────────────────────────────
// 3. WORD FILTER SETS
// ───────────────────────────────────────────────────────────────
const STOP_WORDS: Set<string> = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that',
  'these', 'those', 'it', 'its', 'we', 'our', 'you', 'your', 'they', 'their',
]);

const ACTION_VERBS: Set<string> = new Set([
  'implement', 'implemented', 'implementing', 'create', 'created', 'creating',
  'add', 'added', 'adding', 'build', 'built', 'building',
  'fix', 'fixed', 'fixing', 'update', 'updated', 'updating',
  'refactor', 'refactored', 'refactoring', 'modify', 'modified', 'modifying',
  'delete', 'deleted', 'deleting', 'remove', 'removed', 'removing',
  'change', 'changed', 'changing', 'improve', 'improved', 'improving',
  'optimize', 'optimized', 'optimizing', 'debug', 'debugged', 'debugging',
  'investigate', 'investigated', 'investigating', 'explore', 'explored', 'exploring',
  'discover', 'discovered', 'discovering', 'research', 'researched', 'researching',
  'use', 'using', 'used',
]);

// ───────────────────────────────────────────────────────────────
// 4. SLUG GENERATION
// ───────────────────────────────────────────────────────────────
/** Extracts 3-5 meaningful words, filtering stop words and action verbs */
function generateSemanticSlug(title: string, maxWords: number = 4): string {
  if (!title || typeof title !== 'string') return 'unnamed';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w: string) => w.length > 2 && !STOP_WORDS.has(w) && !ACTION_VERBS.has(w))
    .slice(0, maxWords)
    .join('-') || 'unnamed';
}

/** 8-character MD5 hash for uniqueness */
function generateShortHash(content: string): string {
  if (!content || typeof content !== 'string') {
    return crypto.randomBytes(4).toString('hex');
  }
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

// ───────────────────────────────────────────────────────────────
// 5. ANCHOR ID GENERATION
// ───────────────────────────────────────────────────────────────
/** Format: {type}-{semantic-slug}-{8char-hash} */
function generateAnchorId(
  sectionTitle: string,
  category: string,
  specNumber: string | null = null,
  additionalContext: string = ''
): string {
  const normalizedCategory: string = (category || 'summary').toLowerCase();

  // Remove redundant category prefix from title
  let cleanTitle: string = sectionTitle || 'Untitled';
  cleanTitle = cleanTitle
    .replace(new RegExp(`^${normalizedCategory}[:\\s-]+`, 'i'), '')
    .replace(/^implemented?\s+/i, '')
    .replace(/^discovered?\s+/i, '')
    .replace(/^researched?\s+/i, '')
    .trim();

  const slug: string = generateSemanticSlug(cleanTitle);
  const hash: string = generateShortHash(`${sectionTitle}|${additionalContext}|${specNumber ?? ''}`);
  return `${normalizedCategory}-${slug}-${hash}`;
}

// ───────────────────────────────────────────────────────────────
// 6. SECTION CATEGORIZATION
// ───────────────────────────────────────────────────────────────
/** Priority: decision > implementation > guide > architecture > files > discovery > integration */
function categorizeSection(sectionTitle: string, content: string = ''): AnchorTag {
  const text: string = (sectionTitle + ' ' + content).toLowerCase();
  const title: string = sectionTitle.toLowerCase();

  if (/decision|choice|selected|approach|alternative|option/i.test(title)) return 'decision';
  if (/implement|built|created|added|developed|wrote|coded/i.test(text)) return 'implementation';
  if (/how to|extend|add new|guide|steps|instructions|tutorial/i.test(title)) return 'guide';
  if (/architecture|design|system|structure|flow|model|schema/i.test(title)) return 'architecture';
  if (/modified|updated|changed.*file|files?:/i.test(content)) return 'files';
  if (/discovered|found|investigated|research|explored|analysis/i.test(text)) return 'discovery';
  if (/integration|external|api|service|sdk|library|package/i.test(text)) return 'integration';
  return 'implementation';
}

// ───────────────────────────────────────────────────────────────
// 7. ANCHOR VALIDATION
// ───────────────────────────────────────────────────────────────
/** Appends -2, -3, etc. on collision */
function validateAnchorUniqueness(anchorId: string, existingAnchors: string[]): string {
  if (!existingAnchors.includes(anchorId)) return anchorId;

  let counter: number = 2;
  let uniqueId: string = `${anchorId}-${counter}`;
  while (existingAnchors.includes(uniqueId)) {
    counter++;
    uniqueId = `${anchorId}-${counter}`;
  }
  return uniqueId;
}

// ───────────────────────────────────────────────────────────────
// 8. KEYWORD EXTRACTION
// ───────────────────────────────────────────────────────────────
/** Extracts nouns, proper nouns, technical terms (filters action verbs, stop words) */
function extractKeywords(text: string): string[] {
  const words: RegExpMatchArray | null = text.match(/\b[a-z]{3,}\b|\b[A-Z][A-Z0-9]*\b|\bv?\d+\.?\d*\b/gi);
  if (!words) return [];
  const keywords: string[] = words
    .map((w: string) => w.toLowerCase())
    .filter((w: string) => !ACTION_VERBS.has(w) && !STOP_WORDS.has(w) && w.length > 2);
  return [...new Set(keywords)].slice(0, 5);
}

function slugify(keywords: string[]): string {
  if (!keywords || keywords.length === 0) return 'unnamed';
  return keywords
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

// ───────────────────────────────────────────────────────────────
// 9. UTILITY FUNCTIONS
// ───────────────────────────────────────────────────────────────
function extractSpecNumber(specFolder: string): string {
  const match: RegExpMatchArray | null = specFolder.match(/^(\d{3})-/);
  return match ? match[1] : '000';
}

function getCurrentDate(): string {
  const now: Date = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// ───────────────────────────────────────────────────────────────
// 10. TEMPLATE ANCHOR WRAPPING (T011-T014)
// ───────────────────────────────────────────────────────────────
/**
 * Detects ## headings and wraps sections with ANCHOR tags
 * Preserves existing ANCHORs and detects collisions
 */
export interface AnchorWrapResult {
  content: string;
  anchorsAdded: number;
  anchorsPreserved: number;
  collisions: string[];
}

/**
 * Extract existing ANCHOR IDs from content
 */
function extractExistingAnchors(content: string): string[] {
  const anchorPattern = /<!--\s*ANCHOR:\s*([a-z0-9-]+)\s*-->/gi;
  const matches = content.matchAll(anchorPattern);
  return Array.from(matches, (m) => m[1]);
}

/**
 * Check if a line is already wrapped with ANCHOR tags
 */
function isAlreadyWrapped(lines: string[], index: number): boolean {
  // Look backwards for opening ANCHOR tag (within 2 lines)
  for (let i = Math.max(0, index - 2); i < index; i++) {
    if (/<!--\s*ANCHOR:/i.test(lines[i])) return true;
  }
  return false;
}

/**
 * Find the end of a markdown section (next ## heading or end of file)
 */
function findSectionEnd(lines: string[], startIndex: number): number {
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) return i - 1;
  }
  return lines.length - 1;
}

/**
 * Auto-wrap template sections with ANCHOR tags
 * 
 * @param content - Markdown content to process
 * @param specNumber - Spec folder number (e.g., "132")
 * @returns Result with wrapped content and statistics
 */
function wrapSectionsWithAnchors(
  content: string,
  specNumber: string | null = null
): AnchorWrapResult {
  const lines = content.split('\n');
  const existingAnchors = extractExistingAnchors(content);
  const usedAnchors: string[] = [...existingAnchors];
  const collisions: string[] = [];
  
  let anchorsAdded = 0;
  let anchorsPreserved = existingAnchors.length;
  
  const result: string[] = [];
  let i = 0;
  let sectionIndex = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    
    // Detect ## headings (not # or ### or more)
    const headingMatch = line.match(/^##\s+(.+)$/);
    
    if (headingMatch) {
      sectionIndex++;
    }

    if (headingMatch && !isAlreadyWrapped(lines, i)) {
      const headingText = headingMatch[1];
      const category = categorizeSection(headingText);
      
      // Generate anchor ID
      let anchorId = `${generateSemanticSlug(headingText)}-${sectionIndex}`;
      
      // Detect collision
      if (usedAnchors.includes(anchorId)) {
        const originalId = anchorId;
        anchorId = validateAnchorUniqueness(anchorId, usedAnchors);
        collisions.push(`${originalId} → ${anchorId}`);
      }
      
      usedAnchors.push(anchorId);
      
      // Find section end
      const sectionEnd = findSectionEnd(lines, i);
      
      // Add opening ANCHOR tag
      result.push(`<!-- ANCHOR:${anchorId} -->`);
      
      // Add heading + section content
      for (let j = i; j <= sectionEnd; j++) {
        result.push(lines[j]);
      }
      
      // Add closing ANCHOR tag
      result.push(`<!-- /ANCHOR:${anchorId} -->`);
      result.push(''); // Empty line for spacing
      
      anchorsAdded++;
      i = sectionEnd + 1;
    } else {
      result.push(line);
      i++;
    }
  }
  
  return {
    content: result.join('\n'),
    anchorsAdded,
    anchorsPreserved,
    collisions,
  };
}

// ───────────────────────────────────────────────────────────────
// 11. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  generateAnchorId,
  categorizeSection,
  validateAnchorUniqueness,
  slugify,
  extractSpecNumber,
  wrapSectionsWithAnchors,
};
