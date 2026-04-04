import type { Observation, UserPrompt, RecentContext, FileEntry, DataSource } from '../utils/input-normalizer';
export type { DataSource };
/** Loaded data result, which may be normalized data or simulation marker */
export interface LoadedData {
    _isSimulation?: boolean;
    _source?: DataSource;
    userPrompts?: UserPrompt[];
    observations?: Observation[];
    recentContext?: RecentContext[];
    FILES?: FileEntry[];
    [key: string]: unknown;
}
interface LoadOptions {
    dataFile?: string | null;
    specFolderArg?: string | null;
}
declare function loadCollectedData(options?: LoadOptions): Promise<LoadedData>;
export { loadCollectedData, };
//# sourceMappingURL=data-loader.d.ts.map