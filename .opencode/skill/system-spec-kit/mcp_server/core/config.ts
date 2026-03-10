// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------

import path from 'path';
import os from 'os';
import { COGNITIVE_CONFIG as LOADED_COGNITIVE_CONFIG } from '../configs/cognitive';
import { DB_UPDATED_FILE as SHARED_DB_UPDATED_FILE } from '@spec-kit/shared/config';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

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

/* ---------------------------------------------------------------
   2. PATH CONSTANTS
   --------------------------------------------------------------- */

export const SERVER_DIR: string = path.join(__dirname, '..');
export const NODE_MODULES: string = path.join(SERVER_DIR, 'node_modules');
export const LIB_DIR: string = path.join(__dirname, '..', 'lib');
export const SHARED_DIR: string = path.join(SERVER_DIR, '..', 'shared');
export const DATABASE_DIR: string = process.env.SPEC_KIT_DB_DIR
  ? path.resolve(process.cwd(), process.env.SPEC_KIT_DB_DIR)
  : path.join(SERVER_DIR, 'database');
export const DATABASE_PATH: string = path.join(DATABASE_DIR, 'context-index.sqlite');
export const DB_UPDATED_FILE: string = SHARED_DB_UPDATED_FILE;

/* ---------------------------------------------------------------
   3. BATCH PROCESSING CONFIGURATION
   --------------------------------------------------------------- */

const parsedBatchSize = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
export const BATCH_SIZE: number = Number.isFinite(parsedBatchSize) && parsedBatchSize > 0 ? parsedBatchSize : 5;
const parsedBatchDelayMs = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);
export const BATCH_DELAY_MS: number = Number.isFinite(parsedBatchDelayMs) && parsedBatchDelayMs > 0 ? parsedBatchDelayMs : 100;

/* ---------------------------------------------------------------
   4. RATE LIMITING CONFIGURATION
   --------------------------------------------------------------- */

export const INDEX_SCAN_COOLDOWN: number = 60000;

/* ---------------------------------------------------------------
   5. QUERY VALIDATION LIMITS
   --------------------------------------------------------------- */

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

/* ---------------------------------------------------------------
   6. PATH VALIDATION
   --------------------------------------------------------------- */

export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();

export const ALLOWED_BASE_PATHS: string[] = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

/* ---------------------------------------------------------------
   7. CACHE CONFIGURATION
   --------------------------------------------------------------- */

export const CONSTITUTIONAL_CACHE_TTL: number = 60000;

/* ---------------------------------------------------------------
   8. COGNITIVE CONFIGURATION
   --------------------------------------------------------------- */

/** Loaded cognitive configuration values. */
export const COGNITIVE_CONFIG = LOADED_COGNITIVE_CONFIG;

/* ---------------------------------------------------------------
   9. (ESM exports above — no CommonJS module.exports needed)
   --------------------------------------------------------------- */
