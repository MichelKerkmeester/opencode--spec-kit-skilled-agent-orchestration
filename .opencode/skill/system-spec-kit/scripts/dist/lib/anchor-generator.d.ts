/** Anchor tag type representing the semantic category of a section */
export type AnchorTag = 'decision' | 'implementation' | 'guide' | 'architecture' | 'files' | 'discovery' | 'integration' | 'summary';
/** Format: {type}-{semantic-slug}-{8char-hash} */
declare function generateAnchorId(sectionTitle: string, category: string, specNumber?: string | null, additionalContext?: string): string;
/** Priority: decision > implementation > guide > architecture > files > discovery > integration */
declare function categorizeSection(sectionTitle: string, content?: string): AnchorTag;
/** Appends -2, -3, etc. on collision */
declare function validateAnchorUniqueness(anchorId: string, existingAnchors: string[]): string;
declare function slugify(keywords: string[]): string;
declare function extractSpecNumber(specFolder: string): string;
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
 * Auto-wrap template sections with ANCHOR tags
 *
 * @param content - Markdown content to process
 * @param specNumber - Spec folder number (e.g., "132")
 * @returns Result with wrapped content and statistics
 */
declare function wrapSectionsWithAnchors(content: string, specNumber?: string | null): AnchorWrapResult;
export { generateAnchorId, categorizeSection, validateAnchorUniqueness, slugify, extractSpecNumber, wrapSectionsWithAnchors, };
//# sourceMappingURL=anchor-generator.d.ts.map