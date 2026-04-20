// ---------------------------------------------------------------
// MODULE: Data Loader
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. DATA LOADER
// ───────────────────────────────────────────────────────────────
// Loads session data from JSON file (via file path, --stdin, or --json)

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { CONFIG } from '../core/index.js';
import { getSessionScopedSaveContextExample, isLegacySharedSaveContextPath } from '../core/index.js';
import { structuredLog, sanitizePath } from '../utils/index.js';

import {
  validateInputData,
  normalizeInputData,
} from '../utils/input-normalizer.js';
import type {
  RawInputData,
  NormalizedData,
  Observation,
  UserPrompt,
  RecentContext,
  FileEntry,
  DataSource,
} from '../utils/input-normalizer.js';

// ───────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────
// Re-export DataSource from input-normalizer for consumers importing from loaders
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

// ───────────────────────────────────────────────────────────────
// 4. LOADER FUNCTIONS
// ───────────────────────────────────────────────────────────────
interface LoadOptions {
  dataFile?: string | null;
  specFolderArg?: string | null;
}

async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
  const dataFile = options?.dataFile !== undefined ? options.dataFile : CONFIG.DATA_FILE;
  const specFolderArg = options?.specFolderArg !== undefined ? options.specFolderArg : CONFIG.SPEC_FOLDER_ARG;

  if (!dataFile) {
    throw new Error(
      'NO_DATA_FILE: Structured JSON input is required via --stdin, --json, or a JSON file path. ' +
      'External CLI agents must provide data via JSON mode with --stdin, --json, or a session-scoped JSON file path such as ' +
      `${getSessionScopedSaveContextExample()}.`
    );
  }

  try {
    if (isLegacySharedSaveContextPath(dataFile)) {
      throw new Error(
        `LEGACY_SHARED_DATA_FILE: ${dataFile} is a shared handoff path and is no longer supported. ` +
        `Use --stdin, --json, or a session-scoped JSON file such as ${getSessionScopedSaveContextExample()}.`
      );
    }

    // SEC-001: Path traversal mitigation (CWE-22)
    // Use os.tmpdir() for cross-platform temp directory support
    // Also include /tmp for macOS where /tmp symlinks to /private/tmp
    const tmpDir: string = os.tmpdir();
    const dataFileAllowedBases: string[] = [
      tmpDir,
      '/tmp',           // macOS: symlink to /private/tmp
      '/private/tmp',   // macOS: actual tmp location
      process.cwd(),
      path.join(process.cwd(), 'specs'),
      path.join(process.cwd(), '.opencode')
    ];

    let validatedDataFilePath: string;
    try {
      validatedDataFilePath = sanitizePath(dataFile, dataFileAllowedBases);
    } catch (pathError: unknown) {
      const pathErrMsg = pathError instanceof Error ? pathError.message : String(pathError);
      structuredLog('error', 'Invalid data file path - security validation failed', {
        filePath: dataFile,
        error: pathErrMsg
      });
      throw new Error(`Security: Invalid data file path: ${pathErrMsg}`);
    }

    const dataContent: string = await fs.readFile(validatedDataFilePath, 'utf-8');
    const rawData: RawInputData = JSON.parse(dataContent) as RawInputData;

    validateInputData(rawData, specFolderArg);
    structuredLog('info', 'Loaded and validated conversation data from file', {
      filePath: validatedDataFilePath,
      source: 'file',
    });

    const data: NormalizedData | RawInputData = normalizeInputData(rawData);
    structuredLog('info', 'Loaded data from file', {
      filePath: validatedDataFilePath,
      source: 'file',
    });
    return { ...data, _source: 'file' } as LoadedData;
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      structuredLog('error', 'Data file not found', {
        filePath: dataFile,
        error: error.message
      });
      throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: ${dataFile}`);
    } else if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'EACCES') {
      structuredLog('error', 'Permission denied reading data file', {
        filePath: dataFile,
        error: error.message
      });
      throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Permission denied: ${dataFile}`);
    } else if (error instanceof SyntaxError) {
      structuredLog('error', 'Invalid JSON in data file', {
        filePath: dataFile,
        error: error.message,
        position: error.message.match(/position (\d+)/)?.[1] || 'unknown'
      });
      throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file ${dataFile}: ${error.message}`);
    } else if (error instanceof Error && error.message.startsWith('LEGACY_SHARED_DATA_FILE:')) {
      structuredLog('error', 'Rejected legacy shared save-context path', {
        filePath: dataFile,
        error: error.message,
      });
      throw error;
    } else {
      const errMsg = error instanceof Error ? error.message : String(error);
      structuredLog('error', 'Failed to load data file', {
        filePath: dataFile,
        error: errMsg
      });
      throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file ${dataFile}: ${errMsg}`);
    }
  }
}

// ───────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  loadCollectedData,
};
