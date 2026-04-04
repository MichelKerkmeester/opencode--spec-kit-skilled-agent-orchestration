import type { CognitiveConfig } from '../configs/cognitive.js';
/** Input validation limits configuration */
export interface InputLimitsConfig {
    query: number;
    title: number;
    specFolder: number;
    contextType: number;
    name: number;
    prompt: number;
    filePath: number;
}
export declare const SERVER_DIR: string;
export declare const NODE_MODULES: string;
export declare const LIB_DIR: string;
export declare const SHARED_DIR: string;
export interface DatabasePaths {
    databaseDir: string;
    databasePath: string;
    dbUpdatedFile: string;
}
export declare function resolveDatabasePaths(): DatabasePaths;
export declare const DATABASE_DIR: string;
export declare const DATABASE_PATH: string;
export declare const DB_UPDATED_FILE: string;
export declare const BATCH_SIZE: number;
export declare const BATCH_DELAY_MS: number;
export declare const INDEX_SCAN_COOLDOWN: number;
export declare const MAX_QUERY_LENGTH: number;
export declare const INPUT_LIMITS: Readonly<InputLimitsConfig>;
export declare const DEFAULT_BASE_PATH: string;
export declare const ALLOWED_BASE_PATHS: string[];
export declare const CONSTITUTIONAL_CACHE_TTL: number;
export declare function getCognitiveConfig(): CognitiveConfig;
/** Loaded cognitive configuration values (lazily parsed on first access). */
export declare const COGNITIVE_CONFIG: CognitiveConfig;
//# sourceMappingURL=config.d.ts.map