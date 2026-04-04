import type { MCPResponse } from './types.js';
interface MemoryIngestStartArgs {
    paths: string[];
    specFolder?: string;
}
interface MemoryIngestStatusArgs {
    jobId: string;
}
interface MemoryIngestCancelArgs {
    jobId: string;
}
/** Handle memory_ingest_start tool — begins batch ingestion of spec documents from disk.
 * @param args - Ingest arguments (paths, scope, options)
 * @returns MCP response with job ID and forecast
 */
declare function handleMemoryIngestStart(args: MemoryIngestStartArgs): Promise<MCPResponse>;
declare function handleMemoryIngestStatus(args: MemoryIngestStatusArgs): Promise<MCPResponse>;
declare function handleMemoryIngestCancel(args: MemoryIngestCancelArgs): Promise<MCPResponse>;
declare const handle_memory_ingest_start: typeof handleMemoryIngestStart;
declare const handle_memory_ingest_status: typeof handleMemoryIngestStatus;
declare const handle_memory_ingest_cancel: typeof handleMemoryIngestCancel;
export { handleMemoryIngestStart, handleMemoryIngestStatus, handleMemoryIngestCancel, handle_memory_ingest_start, handle_memory_ingest_status, handle_memory_ingest_cancel, };
//# sourceMappingURL=memory-ingest.d.ts.map