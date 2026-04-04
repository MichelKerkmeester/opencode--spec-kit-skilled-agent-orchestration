import { getCanonicalPathKey } from '../utils/canonical-path.js';
export { getCanonicalPathKey };
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
export type { ContextType } from '@spec-kit/shared/context-types';
import type { ContextType } from '@spec-kit/shared/context-types';
interface ExtractImportanceTierOptions {
    documentType?: string | null;
    fallbackTier?: string | null;
}
/**
 * Defines the MEMORY_FILE_PATTERN constant.
 */
export declare const MEMORY_FILE_PATTERN: RegExp;
export declare const MAX_CONTENT_LENGTH: number;
/**
 * Defines the CONTEXT_TYPE_MAP constant.
 */
export declare const CONTEXT_TYPE_MAP: Record<string, ContextType>;
/** Read file with BOM detection for UTF-16 support */
export declare function readFileWithEncoding(filePath: string): string;
/** Parse a memory file and extract all metadata */
export declare function parseMemoryFile(filePath: string): ParsedMemory;
/**
 * Parse in-memory content using the same metadata extraction path as parseMemoryFile().
 * This supports atomic-save flows that need to index content before promoting the
 * pending file to its final path.
 */
export declare function parseMemoryContent(filePath: string, content: string, options?: {
    lastModified?: string;
}): ParsedMemory;
/**
 * Extract document type from filename.
 * Maps well-known spec folder filenames to their document types.
 */
export declare function extractDocumentType(filePath: string): string;
/** Extract spec folder name from file path */
export declare function extractSpecFolder(filePath: string): string;
/** Extract title from frontmatter or descriptive headings/content. */
export declare function extractTitle(content: string): string | null;
/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
export declare function extractTriggerPhrases(content: string): string[];
/** Extract context type from metadata block */
export declare function extractContextType(content: string): ContextType;
/** Extract importance tier from content or metadata */
export declare function extractImportanceTier(content: string, options?: ExtractImportanceTierOptions): string;
/** Compute SHA-256 hash of content for change detection */
export declare function computeContentHash(content: string): string;
/**
 * Extract causal_links from memory content YAML metadata block (T126)
 */
export declare function extractCausalLinks(content: string): CausalLinks;
/**
 * Check if causalLinks has any non-empty arrays
 */
export declare function hasCausalLinks(causalLinks: CausalLinks | null | undefined): boolean;
/** Check if a file path is a valid memory file */
export declare function isMemoryFile(filePath: string): boolean;
/** Validate anchor tags in memory content */
export declare function validateAnchors(content: string): AnchorValidation;
/** Extract content from anchors */
export declare function extractAnchors(content: string): Record<string, string>;
/** Validate parsed memory data */
export declare function validateParsedMemory(parsed: ParsedMemory): ParsedMemoryValidation;
/** Options for findMemoryFiles */
export interface FindMemoryFilesOptions {
    specFolder?: string | null;
}
/** Find all memory files in a workspace */
export declare function findMemoryFiles(workspacePath: string, options?: FindMemoryFilesOptions): string[];
//# sourceMappingURL=memory-parser.d.ts.map