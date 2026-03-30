import { isWorkingArtifactPath } from '../config/spec-doc-paths.js';

// ───────────────────────────────────────────────────────────────
// MODULE: Document Helpers
// ───────────────────────────────────────────────────────────────
// Pure document analysis helpers extracted from handlers to break
// circular dependency between lib/storage and handlers/.

// ───────────────────────────────────────────────────────────────
// 1. DOCUMENT HELPERS
// ───────────────────────────────────────────────────────────────

/**
 * Calculate importance weight based on file path and document type.
 * Spec 126 applies document-type-aware weighting when available.
 *
 * @param filePath - Source file path used for fallback heuristics.
 * @param documentType - Parsed document classification when known.
 * @returns Importance weight used during indexing and lineage writes.
 */
export function calculateDocumentWeight(filePath: string, documentType?: string): number {
  if (documentType) {
    const DOC_TYPE_WEIGHTS: Record<string, number> = {
      spec: 0.8,
      decision_record: 0.8,
      plan: 0.7,
      tasks: 0.6,
      implementation_summary: 0.6,
      research: 0.6,
      checklist: 0.5,
      handover: 0.5,
      constitutional: 1.0,
      memory: 0.5,
      scratch: 0.25,
    };
    const weight = DOC_TYPE_WEIGHTS[documentType];
    if (weight !== undefined) return weight;
  }

  if (isWorkingArtifactPath(filePath)) return 0.25;
  return 0.5;
}

/**
 * Determine whether a parsed document type should receive spec-level detection.
 *
 * @param documentType - Parsed document classification when known.
 * @returns True when the document participates in spec-level semantics.
 */
export function isSpecDocumentType(documentType?: string): boolean {
  return !!documentType && documentType !== 'memory' && documentType !== 'constitutional';
}
