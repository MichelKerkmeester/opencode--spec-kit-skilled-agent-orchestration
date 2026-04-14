// ---------------------------------------------------------------
// MODULE: Memory Indexer
// ---------------------------------------------------------------

// Legacy workflow-side indexing wrappers have been retired. Script workflows
// now rely on canonical spec-doc indexing instead of writing/indexing
// `[spec]/memory/*.md` artifacts directly.

type IndexingStatusValue =
  | 'indexed'
  | 'skipped_duplicate'
  | 'skipped_index_policy'
  | 'skipped_quality_gate'
  | 'skipped_embedding_unavailable'
  | 'failed_embedding';

interface WorkflowIndexingStatus {
  status: IndexingStatusValue;
  memoryId: number | null;
  reason?: string;
  errorMessage?: string;
}

export type {
  IndexingStatusValue,
  WorkflowIndexingStatus,
};
