"use strict";
// ---------------------------------------------------------------
// MODULE: Anchor Generator
// ---------------------------------------------------------------
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnchorId = generateAnchorId;
exports.categorizeSection = categorizeSection;
exports.validateAnchorUniqueness = validateAnchorUniqueness;
exports.slugify = slugify;
exports.extractSpecNumber = extractSpecNumber;
exports.wrapSectionsWithAnchors = wrapSectionsWithAnchors;
// ───────────────────────────────────────────────────────────────
// 1. ANCHOR GENERATOR
// ───────────────────────────────────────────────────────────────
const crypto = __importStar(require("crypto"));
// ───────────────────────────────────────────────────────────────
// 3. WORD FILTER SETS
// ───────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that',
    'these', 'those', 'it', 'its', 'we', 'our', 'you', 'your', 'they', 'their',
]);
const ACTION_VERBS = new Set([
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
function generateSemanticSlug(title, maxWords = 4) {
    if (!title || typeof title !== 'string')
        return 'unnamed';
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !ACTION_VERBS.has(w))
        .slice(0, maxWords)
        .join('-') || 'unnamed';
}
/** 8-character MD5 hash for uniqueness */
function generateShortHash(content) {
    if (!content || typeof content !== 'string') {
        return crypto.randomBytes(4).toString('hex');
    }
    return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}
// ───────────────────────────────────────────────────────────────
// 5. ANCHOR ID GENERATION
// ───────────────────────────────────────────────────────────────
/** Format: {type}-{semantic-slug}-{8char-hash} */
function generateAnchorId(sectionTitle, category, specNumber = null, additionalContext = '') {
    const normalizedCategory = (category || 'summary').toLowerCase();
    // Remove redundant category prefix from title
    let cleanTitle = sectionTitle || 'Untitled';
    cleanTitle = cleanTitle
        .replace(new RegExp(`^${normalizedCategory}[:\\s-]+`, 'i'), '')
        .replace(/^implemented?\s+/i, '')
        .replace(/^discovered?\s+/i, '')
        .replace(/^researched?\s+/i, '')
        .trim();
    const slug = generateSemanticSlug(cleanTitle);
    const hash = generateShortHash(`${sectionTitle}|${additionalContext}|${specNumber ?? ''}`);
    return `${normalizedCategory}-${slug}-${hash}`;
}
// ───────────────────────────────────────────────────────────────
// 6. SECTION CATEGORIZATION
// ───────────────────────────────────────────────────────────────
/** Priority: decision > implementation > guide > architecture > files > discovery > integration */
function categorizeSection(sectionTitle, content = '') {
    const text = (sectionTitle + ' ' + content).toLowerCase();
    const title = sectionTitle.toLowerCase();
    if (/decision|choice|selected|approach|alternative|option/i.test(title))
        return 'decision';
    if (/implement|built|created|added|developed|wrote|coded/i.test(text))
        return 'implementation';
    if (/how to|extend|add new|guide|steps|instructions|tutorial/i.test(title))
        return 'guide';
    if (/architecture|design|system|structure|flow|model|schema/i.test(title))
        return 'architecture';
    if (/modified|updated|changed.*file|files?:/i.test(content))
        return 'files';
    if (/discovered|found|investigated|research|explored|analysis/i.test(text))
        return 'discovery';
    if (/integration|external|api|service|sdk|library|package/i.test(text))
        return 'integration';
    return 'implementation';
}
// ───────────────────────────────────────────────────────────────
// 7. ANCHOR VALIDATION
// ───────────────────────────────────────────────────────────────
/** Appends -2, -3, etc. on collision */
function validateAnchorUniqueness(anchorId, existingAnchors) {
    if (!existingAnchors.includes(anchorId))
        return anchorId;
    let counter = 2;
    let uniqueId = `${anchorId}-${counter}`;
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
function extractKeywords(text) {
    const words = text.match(/\b[a-z]{3,}\b|\b[A-Z][A-Z0-9]*\b|\bv?\d+\.?\d*\b/gi);
    if (!words)
        return [];
    const keywords = words
        .map((w) => w.toLowerCase())
        .filter((w) => !ACTION_VERBS.has(w) && !STOP_WORDS.has(w) && w.length > 2);
    return [...new Set(keywords)].slice(0, 5);
}
function slugify(keywords) {
    if (!keywords || keywords.length === 0)
        return 'unnamed';
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
function extractSpecNumber(specFolder) {
    const match = specFolder.match(/^(\d{3})-/);
    return match ? match[1] : '000';
}
function getCurrentDate() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
/**
 * Extract existing ANCHOR IDs from content
 */
function extractExistingAnchors(content) {
    const anchorPattern = /<!--\s*ANCHOR:\s*([a-z0-9-]+)\s*-->/gi;
    const matches = content.matchAll(anchorPattern);
    return Array.from(matches, (m) => m[1]);
}
/**
 * Check if a line is already wrapped with ANCHOR tags
 */
function isAlreadyWrapped(lines, index) {
    // Look backwards for opening ANCHOR tag (within 2 lines)
    for (let i = Math.max(0, index - 2); i < index; i++) {
        if (/<!--\s*ANCHOR:/i.test(lines[i]))
            return true;
    }
    return false;
}
/**
 * Find the end of a markdown section (next ## heading or end of file)
 */
function findSectionEnd(lines, startIndex) {
    for (let i = startIndex + 1; i < lines.length; i++) {
        if (/^##\s+/.test(lines[i]))
            return i - 1;
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
function wrapSectionsWithAnchors(content, specNumber = null) {
    const lines = content.split('\n');
    const existingAnchors = extractExistingAnchors(content);
    const usedAnchors = [...existingAnchors];
    const collisions = [];
    let anchorsAdded = 0;
    let anchorsPreserved = existingAnchors.length;
    const result = [];
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
        }
        else {
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
//# sourceMappingURL=anchor-generator.js.map