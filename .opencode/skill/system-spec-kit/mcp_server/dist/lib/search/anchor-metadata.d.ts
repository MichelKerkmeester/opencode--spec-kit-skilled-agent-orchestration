import type { PipelineRow } from './pipeline/types.js';
/**
 * Metadata describing a single ANCHOR region found in a memory file.
 */
export interface AnchorMetadata {
    /** The raw anchor ID as written in the tag, e.g. "DECISION-pipeline-003". */
    id: string;
    /**
     * The semantic type extracted from the anchor ID.
     * For structured IDs (TYPE-keywords-NNN) this is the leading segment in
     * UPPERCASE, e.g. "DECISION". For simple IDs (e.g. "summary") the whole
     * ID is returned as-is.
     */
    type: string;
    /** 1-based line number of the opening <!-- ANCHOR:id --> tag. */
    startLine: number;
    /** 1-based line number of the closing <!-- /ANCHOR:id --> tag. */
    endLine: number;
}
/**
 * Parse ANCHOR tags from memory content and return metadata for each found region.
 *
 * The function walks the content line-by-line. When an opening tag is found,
 * it is pushed onto an open-anchors stack. When a matching closing tag is
 * found, the pair is resolved and an AnchorMetadata record is emitted.
 *
 * Unmatched opening or closing tags are silently ignored — malformed content
 * must not crash the retrieval pipeline.
 *
 * @param content - Raw text content of a memory file (may be empty or null).
 * @returns Array of AnchorMetadata, one per complete anchor pair found.
 *          Returns an empty array when content is empty, null, or has no anchors.
 */
export declare function extractAnchorMetadata(content: string): AnchorMetadata[];
/**
 * Annotate pipeline rows with anchor metadata extracted from their content.
 *
 * For each row that has a non-empty `content` field, the ANCHOR tags in that
 * content are parsed and the resulting metadata array is attached to the row
 * as `anchorMetadata`. Rows without content (or with no anchors) are returned
 * unchanged.
 *
 * This function does NOT mutate any score fields. It is safe to call after
 * all scoring signals have been applied.
 *
 * @param results - Pipeline rows to annotate (may be empty).
 * @returns New array — each row is either a new object (when anchors were
 *          found) or the original reference (when no anchors were found).
 */
export declare function enrichResultsWithAnchorMetadata(results: PipelineRow[]): PipelineRow[];
//# sourceMappingURL=anchor-metadata.d.ts.map