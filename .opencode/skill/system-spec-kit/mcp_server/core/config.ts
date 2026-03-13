// --- 1. CONFIG ---

import path from 'path';
import os from 'os';
import { loadCognitiveConfigFromEnv } from '../configs/cognitive';
import type { CognitiveConfig } from '../configs/cognitive';

// --- 2. TYPES ---

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

// --- 3. PATH CONSTANTS ---

export const SERVER_DIR: string = path.join(__dirname, '..');
export const NODE_MODULES: string = path.join(SERVER_DIR, 'node_modules');
export const LIB_DIR: string = path.join(__dirname, '..', 'lib');
export const SHARED_DIR: string = path.join(SERVER_DIR, '..', 'shared');

export interface DatabasePaths {
  databaseDir: string;
  databasePath: string;
  dbUpdatedFile: string;
}

export function resolveDatabasePaths(): DatabasePaths {
  const databaseDir = process.env.SPEC_KIT_DB_DIR
    ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
    : path.join(SERVER_DIR, 'database');
  return {
    databaseDir,
    databasePath: path.join(databaseDir, 'context-index.sqlite'),
    dbUpdatedFile: path.join(databaseDir, '.db-updated')
  };
}

const resolvedDatabasePaths = resolveDatabasePaths();
export const DATABASE_DIR: string = resolvedDatabasePaths.databaseDir;
export const DATABASE_PATH: string = resolvedDatabasePaths.databasePath;
export const DB_UPDATED_FILE: string = resolvedDatabasePaths.dbUpdatedFile;

// --- 4. BATCH PROCESSING CONFIGURATION ---

const parsedBatchSize = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
export const BATCH_SIZE: number = Number.isFinite(parsedBatchSize) && parsedBatchSize > 0 ? parsedBatchSize : 5;
const parsedBatchDelayMs = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);
export const BATCH_DELAY_MS: number = Number.isFinite(parsedBatchDelayMs) && parsedBatchDelayMs > 0 ? parsedBatchDelayMs : 100;

// --- 5. RATE LIMITING CONFIGURATION ---

export const INDEX_SCAN_COOLDOWN: number = 60000;

// --- 6. QUERY VALIDATION LIMITS ---

export const MAX_QUERY_LENGTH: number = 10000;

export const INPUT_LIMITS: Readonly<InputLimitsConfig> = {
  query: 10000,
  title: 500,
  specFolder: 200,
  contextType: 100,
  name: 200,
  prompt: 10000,
  filePath: 500
} as const;

// --- 7. PATH VALIDATION ---

export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();

export const ALLOWED_BASE_PATHS: string[] = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

// --- 8. CACHE CONFIGURATION ---

export const CONSTITUTIONAL_CACHE_TTL: number = 60000;

// --- 9. COGNITIVE CONFIGURATION ---

function parseCognitiveConfig(): CognitiveConfig {
  return loadCognitiveConfigFromEnv(process.env);
}

let _cognitiveConfig: CognitiveConfig | null = null;

export function getCognitiveConfig(): CognitiveConfig {
  if (!_cognitiveConfig) {
    _cognitiveConfig = parseCognitiveConfig();
  }
  return _cognitiveConfig;
}

const COGNITIVE_CONFIG_LAZY: CognitiveConfig = {} as CognitiveConfig;
Object.defineProperties(COGNITIVE_CONFIG_LAZY, {
  coActivationPattern: {
    enumerable: true,
    get: () => getCognitiveConfig().coActivationPattern,
  },
  coActivationPatternSource: {
    enumerable: true,
    get: () => getCognitiveConfig().coActivationPatternSource,
  },
  coActivationPatternFlags: {
    enumerable: true,
    get: () => getCognitiveConfig().coActivationPatternFlags,
  },
});

/** Loaded cognitive configuration values (lazily parsed on first access). */
export const COGNITIVE_CONFIG: CognitiveConfig = COGNITIVE_CONFIG_LAZY;

/* ---------------------------------------------------------------
   9. (ESM exports above — no CommonJS module.exports needed)
   --------------------------------------------------------------- */
