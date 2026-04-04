/**
 * Calculate importance weight based on file path and document type.
 * Spec 126 applies document-type-aware weighting when available.
 *
 * @param filePath - Source file path used for fallback heuristics.
 * @param documentType - Parsed document classification when known.
 * @returns Importance weight used during indexing and lineage writes.
 */
export declare function calculateDocumentWeight(filePath: string, documentType?: string): number;
/**
 * Determine whether a parsed document type should receive spec-level detection.
 *
 * @param documentType - Parsed document classification when known.
 * @returns True when the document participates in spec-level semantics.
 */
export declare function isSpecDocumentType(documentType?: string): boolean;
//# sourceMappingURL=document-helpers.d.ts.map