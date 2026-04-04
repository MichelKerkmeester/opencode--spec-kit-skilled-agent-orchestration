import type BetterSqlite3 from 'better-sqlite3';
import { needsChunking } from '../lib/chunking/anchor-chunker.js';
interface ParsedMemory {
    specFolder: string;
    filePath: string;
    title: string | null;
    triggerPhrases: string[];
    content: string;
    contentHash: string;
    contextType: string;
    importanceTier: string;
    memoryType?: string;
    memoryTypeSource?: string;
    documentType?: string;
    qualityScore?: number;
    qualityFlags?: string[];
}
interface IndexResult extends Record<string, unknown> {
    status: string;
    id: number;
    specFolder: string;
    title: string | null;
    triggerPhrases?: string[];
    contextType?: string;
    importanceTier?: string;
    embeddingStatus?: string;
    message?: string;
}
interface PostInsertMetadataFields {
    content_hash?: string;
    context_type?: string;
    importance_tier?: string;
    memory_type?: string;
    type_inference_source?: string;
    stability?: number;
    difficulty?: number;
    review_count?: number;
    file_mtime_ms?: number | null;
    embedding_status?: string;
    encoding_intent?: string | null;
    document_type?: string;
    spec_level?: number | null;
    quality_score?: number;
    quality_flags?: string;
    parent_id?: number;
    chunk_index?: number;
    chunk_label?: string;
}
interface ChunkingOptions {
    force?: boolean;
    applyPostInsertMetadata?: (db: BetterSqlite3.Database, memoryId: number, fields: PostInsertMetadataFields) => void;
}
/**
 * Index a large memory file by splitting it into chunks.
 * Creates a parent record (metadata only, no embedding) and child records
 * (each with its own embedding) for each chunk.
 *
 * Parent record: embedding_status='partial', content_text=summary
 * Child records: embedding_status='success'|'pending', parent_id=parent.id
 */
declare function indexChunkedMemoryFile(filePath: string, parsed: ParsedMemory, { force, applyPostInsertMetadata }?: ChunkingOptions): Promise<IndexResult>;
export { indexChunkedMemoryFile, needsChunking, };
//# sourceMappingURL=chunking-orchestrator.d.ts.map