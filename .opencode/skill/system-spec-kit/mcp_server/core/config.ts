// ────────────────────────────────────────────────────────────────
// MODULE: Config
// ────────────────────────────────────────────────────────────────

import path from 'path';
import fs from 'fs';
import os from 'os';
import { DB_PATH } from '@spec-kit/shared/paths';
import { loadCognitiveConfigFromEnv } from '../configs/cognitive.js';
import type { CognitiveConfig } from '../configs/cognitive.js';

// ────────────────────────────────────────────────────────────────
// 1. TYPES 

// ────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────
// 2. PATH CONSTANTS 

// ────────────────────────────────────────────────────────────────

export const SERVER_DIR: string = path.join(import.meta.dirname, '..');
export const NODE_MODULES: string = path.join(SERVER_DIR, 'node_modules');
export const LIB_DIR: string = path.join(import.meta.dirname, '..', 'lib');
export const SHARED_DIR: string = path.join(SERVER_DIR, '..', 'shared');

export interface DatabasePaths {
  databaseDir: string;
  databasePath: string;
  dbUpdatedFile: string;
}

function realpathAllowMissing(targetPath: string): string {
  const resolvedPath = path.resolve(targetPath);
  if (fs.existsSync(resolvedPath)) {
    return fs.realpathSync(resolvedPath);
  }

  const parentPath = path.dirname(resolvedPath);
  if (parentPath === resolvedPath) {
    return resolvedPath;
  }

  return path.join(realpathAllowMissing(parentPath), path.basename(resolvedPath));
}

function isPathInside(candidate: string, prefix: string): boolean {
  const relative = path.relative(prefix, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function computeDatabasePaths(): DatabasePaths {
  // H8 FIX: Re-check SPEC_KIT_DB_DIR at call time to support runtime overrides
  // (e.g. tests that set the env var after module import). Fall back to the
  // import-time DB_PATH when no runtime override is present.
  const runtimeDbDir = process.env.SPEC_KIT_DB_DIR?.trim() || process.env.SPECKIT_DB_DIR?.trim();
  const runtimeDbPath = process.env.MEMORY_DB_PATH?.trim();
  const databaseDir = runtimeDbDir
    ? path.resolve(process.cwd(), runtimeDbDir)
    : path.dirname(DB_PATH);

  // Resolve symlinks before the boundary check so repo-local links cannot
  // smuggle the database into an unrelated system path.
  const resolved = realpathAllowMissing(databaseDir);
  const allowedPrefixes = [process.cwd(), os.homedir()].map(realpathAllowMissing);
  try {
    const tmpDir = os.tmpdir();
    allowedPrefixes.push(realpathAllowMissing(tmpDir));
  } catch { /* os.tmpdir may be unavailable in test environments */ }
  if (!allowedPrefixes.some((prefix) => isPathInside(resolved, prefix))) {
    throw new Error(
      `Database directory "${resolved}" is outside the allowed project, home, and temporary directories. ` +
      `Set SPEC_KIT_DB_DIR to a path within one of those boundaries.`
    );
  }

  return {
    databaseDir: resolved,
    databasePath: runtimeDbPath
      ? path.join(resolved, path.basename(path.resolve(process.cwd(), runtimeDbPath)))
      : path.join(resolved, path.basename(DB_PATH)),
    dbUpdatedFile: path.join(resolved, '.db-updated')
  };
}

export let DATABASE_DIR: string;
export let DATABASE_PATH: string;
export let DB_UPDATED_FILE: string;

export function resolveDatabasePaths(): DatabasePaths {
  const resolvedDatabasePaths = computeDatabasePaths();
  DATABASE_DIR = resolvedDatabasePaths.databaseDir;
  DATABASE_PATH = resolvedDatabasePaths.databasePath;
  DB_UPDATED_FILE = resolvedDatabasePaths.dbUpdatedFile;
  return resolvedDatabasePaths;
}

resolveDatabasePaths();

// ────────────────────────────────────────────────────────────────
// 3. BATCH PROCESSING CONFIGURATION 

// ────────────────────────────────────────────────────────────────

const parsedBatchSize = parseInt(process.env.SPEC_KIT_BATCH_SIZE || '5', 10);
export const BATCH_SIZE: number = Number.isFinite(parsedBatchSize) && parsedBatchSize > 0 ? parsedBatchSize : 5;
const parsedBatchDelayMs = parseInt(process.env.SPEC_KIT_BATCH_DELAY_MS || '100', 10);
export const BATCH_DELAY_MS: number = Number.isFinite(parsedBatchDelayMs) && parsedBatchDelayMs > 0 ? parsedBatchDelayMs : 100;

// ────────────────────────────────────────────────────────────────
// 4. RATE LIMITING CONFIGURATION 

// ────────────────────────────────────────────────────────────────

export const INDEX_SCAN_COOLDOWN: number = 60000;

// ────────────────────────────────────────────────────────────────
// 5. QUERY VALIDATION LIMITS 

// ────────────────────────────────────────────────────────────────

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

// ────────────────────────────────────────────────────────────────
// 6. PATH VALIDATION 

// ────────────────────────────────────────────────────────────────

export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();

export const ALLOWED_BASE_PATHS: string[] = [
  path.join(os.homedir(), '.claude'),
  DEFAULT_BASE_PATH,
  process.cwd()
]
  .filter(Boolean)
  .map(base => path.resolve(base));

// ────────────────────────────────────────────────────────────────
// 7. CACHE CONFIGURATION 

// ────────────────────────────────────────────────────────────────

export const CONSTITUTIONAL_CACHE_TTL: number = 60000;

// ────────────────────────────────────────────────────────────────
// 8. COGNITIVE CONFIGURATION 

// ────────────────────────────────────────────────────────────────

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

/* ───────────────────────────────────────────────────────────────
   9. (ESM exports above — no CommonJS module.exports needed)
   ──────────────────────────────────────────────────────────────── */
