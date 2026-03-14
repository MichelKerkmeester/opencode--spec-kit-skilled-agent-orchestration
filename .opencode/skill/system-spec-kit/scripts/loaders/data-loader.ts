// ───────────────────────────────────────────────────────────────
// 1. DATA LOADER
// ───────────────────────────────────────────────────────────────
// Loads session data from file, OpenCode capture, or simulation fallback

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import { CONFIG } from '../core';
import { structuredLog, sanitizePath } from '../utils';

import {
  validateInputData,
  normalizeInputData,
  transformOpencodeCapture,
} from '../utils/input-normalizer';
import type { RawInputData, NormalizedData, OpencodeCapture, Observation, UserPrompt, RecentContext, FileEntry, DataSource } from '../utils/input-normalizer';

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

/** OpenCode capture module interface (lazy-loaded) */
interface OpencodeCaptureMod {
  captureConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
}

// ───────────────────────────────────────────────────────────────
// 4. LAZY-LOADED DEPENDENCIES
// ───────────────────────────────────────────────────────────────
// Lazy load via dynamic import() to handle missing dependencies
let _opencodeCapture: OpencodeCaptureMod | null | undefined;

async function getOpencodeCapture(): Promise<OpencodeCaptureMod | null> {
  if (_opencodeCapture === undefined) {
    try {
      _opencodeCapture = await import('../extractors/opencode-capture') as OpencodeCaptureMod;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      structuredLog('warn', 'opencode-capture library not available', {
        error: errMsg
      });
      _opencodeCapture = null;
    }
  }
  return _opencodeCapture;
}

// ───────────────────────────────────────────────────────────────
// 5. LOADER FUNCTIONS
// ───────────────────────────────────────────────────────────────
interface LoadOptions {
  dataFile?: string | null;
  specFolderArg?: string | null;
}

async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
  const dataFile = options?.dataFile !== undefined ? options.dataFile : CONFIG.DATA_FILE;
  const specFolderArg = options?.specFolderArg !== undefined ? options.specFolderArg : CONFIG.SPEC_FOLDER_ARG;

  // Priority 1: Data file provided via command line
  if (dataFile) {
    try {
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
      console.log('   \u2713 Loaded and validated conversation data from file');

      const data: NormalizedData | RawInputData = normalizeInputData(rawData);
      console.log(`   \u2713 Loaded data from data file`);
      return { ...data, _source: 'file' } as LoadedData;
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        structuredLog('error', 'Data file not found', {
          filePath: dataFile,
          error: error.message
        });
        throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: ${dataFile}`);
      } else if (error instanceof SyntaxError) {
        structuredLog('error', 'Invalid JSON in data file', {
          filePath: dataFile,
          error: error.message,
          position: error.message.match(/position (\d+)/)?.[1] || 'unknown'
        });
        throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file ${dataFile}: ${error.message}`);
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

  // Priority 2: OpenCode session capture
  console.log('   \uD83D\uDD0D Attempting OpenCode session capture...');

  const opencodeCapture = await getOpencodeCapture();
  if (!opencodeCapture) {
    structuredLog('debug', 'OpenCode capture not available', {
      projectRoot: CONFIG.PROJECT_ROOT
    });
    console.log('   \u26A0\uFE0F  OpenCode capture not available');
  } else {
    try {
      const conversation: OpencodeCapture | null = await opencodeCapture.captureConversation(
        20,
        CONFIG.PROJECT_ROOT
      );

      if (conversation && conversation.exchanges && conversation.exchanges.length > 0) {
        console.log(`   \u2713 Captured ${conversation.exchanges.length} exchanges from OpenCode`);
        console.log(`   \u2713 Session: ${conversation.sessionTitle || 'Unnamed'}`);

        const data = transformOpencodeCapture(conversation, specFolderArg);
        return data as LoadedData;
      } else {
        structuredLog('debug', 'OpenCode capture returned empty data', {
          projectRoot: CONFIG.PROJECT_ROOT
        });
        console.log('   \u26A0\uFE0F  OpenCode capture returned empty data');
      }
    } catch (captureError: unknown) {
      const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
      structuredLog('debug', 'OpenCode capture failed', {
        projectRoot: CONFIG.PROJECT_ROOT,
        error: captureErrMsg
      });
      console.log(`   \u26A0\uFE0F  OpenCode capture unavailable: ${captureErrMsg}`);
    }
  }

  // Priority 3: No data available — refuse to proceed
  throw new Error(
    'NO_DATA_AVAILABLE: No session data found. Neither JSON data file nor OpenCode session capture provided usable content. ' +
    'External CLI agents must provide data via JSON mode: ' +
    'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
  );
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  loadCollectedData,
};
