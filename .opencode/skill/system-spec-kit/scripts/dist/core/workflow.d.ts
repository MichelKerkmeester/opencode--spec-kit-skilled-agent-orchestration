import type { CollectedDataFull } from '../extractors/collect-session-data';
import { type WorkflowIndexingStatus } from './memory-indexer';
import type { SessionData } from '../types/session-types';
declare function filterTriggerPhrases(phrases: string[]): string[];
/** Configuration options for the memory generation workflow. */
export interface WorkflowOptions {
    /** Path to a JSON file containing pre-collected session data. */
    dataFile?: string;
    /** Explicit spec folder path or name to target (bypasses auto-detection). */
    specFolderArg?: string;
    /** Pre-loaded collected data object (skips file-based loading). */
    collectedData?: CollectedDataFull;
    /** Custom async loader function for collected data (alternative to dataFile). */
    loadDataFn?: () => Promise<CollectedDataFull>;
    /** Custom async function to collect live session data from the environment. */
    collectSessionDataFn?: (collectedData: CollectedDataFull | null, specFolderName?: string | null, explicitSessionId?: string) => Promise<SessionData>;
    /** When true, suppresses non-error console output during execution. */
    silent?: boolean;
    /** Optional session ID forwarded from CLI --session-id flag. */
    sessionId?: string;
}
/** Result object returned after a successful workflow execution. */
export interface WorkflowResult {
    /** Absolute path to the memory output directory. */
    contextDir: string;
    /** Relative path of the resolved spec folder. */
    specFolder: string;
    /** Basename of the spec folder (e.g., "015-outsourced-agent-handback"). */
    specFolderName: string;
    /** Filename of the primary context markdown file written. */
    contextFilename: string;
    /** List of absolute paths for all files written during this run. */
    writtenFiles: string[];
    /** Numeric memory ID from indexing, or null if indexing was skipped. */
    memoryId: number | null;
    /** Explicit indexing outcome for this workflow run. */
    indexingStatus: WorkflowIndexingStatus;
    /** Non-fatal warnings encountered while persisting workflow artifacts. */
    warnings: string[];
    /** Summary statistics for the generated memory. */
    stats: {
        /** Number of conversation messages processed. */
        messageCount: number;
        /** Number of decisions extracted. */
        decisionCount: number;
        /** Number of diagrams extracted. */
        diagramCount: number;
        /** Quality score (0-100) from the quality scorer. */
        qualityScore: number;
        /** Whether the data originated from a simulation rather than a live session. */
        isSimulation: boolean;
    };
}
declare function releaseFilesystemLock(): void;
/**
 * Main workflow orchestrator: coordinates data loading, extraction, rendering,
 * quality scoring, and atomic file output to produce a memory context file.
 *
 * @param options - Configuration controlling data source, spec folder, and output behavior.
 * @returns A WorkflowResult describing the output files, resolved spec folder, and stats.
 */
declare function runWorkflow(options?: WorkflowOptions): Promise<WorkflowResult>;
export { stripWorkflowHtmlOutsideCodeFences } from './content-cleaner';
export { filterTriggerPhrases, releaseFilesystemLock, runWorkflow, };
//# sourceMappingURL=workflow.d.ts.map