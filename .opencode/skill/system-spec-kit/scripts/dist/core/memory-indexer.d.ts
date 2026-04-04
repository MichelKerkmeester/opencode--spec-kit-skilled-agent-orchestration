import type { CollectedDataFull } from '../extractors/collect-session-data';
import { type WeightedDocumentSections } from '@spec-kit/shared/index';
type IndexingStatusValue = 'indexed' | 'skipped_duplicate' | 'skipped_index_policy' | 'skipped_quality_gate' | 'skipped_embedding_unavailable' | 'failed_embedding';
interface WorkflowIndexingStatus {
    status: IndexingStatusValue;
    memoryId: number | null;
    reason?: string;
    errorMessage?: string;
}
declare function indexMemory(contextDir: string, contextFilename: string, content: string, specFolderName: string, collectedData?: CollectedDataFull | null, preExtractedTriggers?: string[], embeddingSections?: WeightedDocumentSections | null): Promise<number | null>;
declare function updateMetadataEmbeddingStatus(contextDir: string, indexingStatus: WorkflowIndexingStatus): Promise<boolean>;
export { indexMemory, updateMetadataEmbeddingStatus, };
export type { IndexingStatusValue, WorkflowIndexingStatus, };
//# sourceMappingURL=memory-indexer.d.ts.map