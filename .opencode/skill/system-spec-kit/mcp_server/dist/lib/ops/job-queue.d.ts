/**
 * Defines the IngestJobState type.
 */
export type IngestJobState = 'queued' | 'parsing' | 'embedding' | 'indexing' | 'complete' | 'failed' | 'cancelled';
/**
 * Describes the IngestJobError shape.
 */
export interface IngestJobError {
    filePath: string;
    message: string;
    timestamp: string;
}
/**
 * Describes the IngestJob shape.
 */
export interface IngestJob {
    id: string;
    state: IngestJobState;
    specFolder: string | null;
    paths: string[];
    filesTotal: number;
    filesProcessed: number;
    errors: IngestJobError[];
    createdAt: string;
    updatedAt: string;
}
export interface IngestJobForecast {
    etaSeconds: number | null;
    etaConfidence: number | null;
    failureRisk: number | null;
    riskSignals: string[];
    caveat: string | null;
}
interface JobQueueConfig {
    processFile: (filePath: string) => Promise<unknown>;
}
declare function resetIncompleteJobsToQueued(): string[];
declare function createIngestJob(args: {
    id: string;
    paths: string[];
    specFolder?: string;
}): Promise<IngestJob>;
declare function getIngestJob(jobId: string): IngestJob | null;
declare function cancelIngestJob(jobId: string): Promise<IngestJob>;
/**
 * Provides the getIngestProgressPercent helper.
 */
export declare function getIngestProgressPercent(job: Pick<IngestJob, 'filesProcessed' | 'filesTotal'>): number;
export declare function getIngestForecast(job: Pick<IngestJob, 'state' | 'filesProcessed' | 'filesTotal' | 'errors' | 'createdAt' | 'updatedAt'>): IngestJobForecast;
declare function enqueueIngestJob(jobId: string): void;
declare function initIngestJobQueue(config: JobQueueConfig): {
    resetCount: number;
};
export { initIngestJobQueue, createIngestJob, getIngestJob, cancelIngestJob, enqueueIngestJob, resetIncompleteJobsToQueued, };
//# sourceMappingURL=job-queue.d.ts.map