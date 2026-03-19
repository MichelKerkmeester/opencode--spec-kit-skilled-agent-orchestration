// ---------------------------------------------------------------
// MODULE: Data Loader
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. DATA LOADER
// ───────────────────────────────────────────────────────────────
// Loads session data from file, native CLI capture, or hard-fail

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import { CONFIG } from '../core';
import { structuredLog, sanitizePath } from '../utils';

import {
  validateInputData,
  normalizeInputData,
  transformOpencodeCapture,
} from '../utils/input-normalizer';
import type {
  RawInputData,
  NormalizedData,
  OpencodeCapture,
  Observation,
  UserPrompt,
  RecentContext,
  FileEntry,
  DataSource,
  CaptureDataSource,
} from '../utils/input-normalizer';

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

/** Claude Code capture module interface (lazy-loaded) */
interface ClaudeCodeCaptureMod {
  captureClaudeConversation(
    maxExchanges: number,
    projectRoot: string,
    sessionHints?: {
      expectedSessionId?: string | null;
      sessionStartTs?: number | null;
      invocationTs?: number | null;
    },
  ): Promise<OpencodeCapture | null>;
}

/** Codex CLI capture module interface (lazy-loaded) */
interface CodexCliCaptureMod {
  captureCodexConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
}

/** Copilot CLI capture module interface (lazy-loaded) */
interface CopilotCliCaptureMod {
  captureCopilotConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
}

/** Gemini CLI capture module interface (lazy-loaded) */
interface GeminiCliCaptureMod {
  captureGeminiConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
}

// ───────────────────────────────────────────────────────────────
// 4. LAZY-LOADED DEPENDENCIES
// ───────────────────────────────────────────────────────────────
// Lazy load via dynamic import() to handle missing dependencies
let _opencodeCapture: OpencodeCaptureMod | null | undefined;
let _claudeCodeCapture: ClaudeCodeCaptureMod | null | undefined;
let _codexCliCapture: CodexCliCaptureMod | null | undefined;
let _copilotCliCapture: CopilotCliCaptureMod | null | undefined;
let _geminiCliCapture: GeminiCliCaptureMod | null | undefined;

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

async function getClaudeCodeCapture(): Promise<ClaudeCodeCaptureMod | null> {
  if (_claudeCodeCapture === undefined) {
    try {
      _claudeCodeCapture = await import('../extractors/claude-code-capture') as ClaudeCodeCaptureMod;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      structuredLog('warn', 'claude-code-capture library not available', {
        error: errMsg
      });
      _claudeCodeCapture = null;
    }
  }
  return _claudeCodeCapture;
}

async function getCodexCliCapture(): Promise<CodexCliCaptureMod | null> {
  if (_codexCliCapture === undefined) {
    try {
      _codexCliCapture = await import('../extractors/codex-cli-capture') as CodexCliCaptureMod;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      structuredLog('warn', 'codex-cli-capture library not available', {
        error: errMsg
      });
      _codexCliCapture = null;
    }
  }
  return _codexCliCapture;
}

async function getCopilotCliCapture(): Promise<CopilotCliCaptureMod | null> {
  if (_copilotCliCapture === undefined) {
    try {
      _copilotCliCapture = await import('../extractors/copilot-cli-capture') as CopilotCliCaptureMod;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      structuredLog('warn', 'copilot-cli-capture library not available', {
        error: errMsg
      });
      _copilotCliCapture = null;
    }
  }
  return _copilotCliCapture;
}

async function getGeminiCliCapture(): Promise<GeminiCliCaptureMod | null> {
  if (_geminiCliCapture === undefined) {
    try {
      _geminiCliCapture = await import('../extractors/gemini-cli-capture') as GeminiCliCaptureMod;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      structuredLog('warn', 'gemini-cli-capture library not available', {
        error: errMsg
      });
      _geminiCliCapture = null;
    }
  }
  return _geminiCliCapture;
}

// ───────────────────────────────────────────────────────────────
// 5. LOADER FUNCTIONS
// ───────────────────────────────────────────────────────────────
interface LoadOptions {
  dataFile?: string | null;
  specFolderArg?: string | null;
  preferredCaptureSource?: CaptureDataSource | null;
  sessionId?: string | null;
}

function parseEpochMs(rawValue: string | undefined): number | null {
  if (!rawValue) {
    return null;
  }

  const numeric = Number(rawValue);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  }

  const parsed = new Date(rawValue).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function buildClaudeSessionHints(
  explicitSessionId?: string | null,
  env: NodeJS.ProcessEnv = process.env,
): {
  expectedSessionId?: string | null;
  sessionStartTs?: number | null;
  invocationTs: number;
} {
  // Priority: CLI flag → CLAUDE_CODE_SESSION env → CLAUDE_CODE_SESSION_ID env → null
  // Use `|| null` (not `??`) for each term — empty strings must be treated as "not set"
  const expectedSessionId = (explicitSessionId?.trim() || null)
    ?? (env.CLAUDE_CODE_SESSION?.trim() || null)
    ?? (env.CLAUDE_CODE_SESSION_ID?.trim() || null)
    ?? null;
  const sessionStartTs = parseEpochMs(env.CLAUDE_CODE_SESSION_STARTED_AT)
    ?? parseEpochMs(env.CLAUDE_CODE_START_TS)
    ?? null;

  return {
    expectedSessionId,
    sessionStartTs,
    invocationTs: Date.now(),
  };
}

function hasUsableCaptureContent(conversation: OpencodeCapture | null): conversation is OpencodeCapture {
  if (!conversation) {
    return false;
  }

  const exchangeCount = Array.isArray(conversation.exchanges) ? conversation.exchanges.length : 0;
  const toolCallCount = Array.isArray(conversation.toolCalls) ? conversation.toolCalls.length : 0;
  return exchangeCount > 0 || toolCallCount > 0;
}

const DEFAULT_NATIVE_CAPTURE_ORDER: readonly CaptureDataSource[] = [
  'opencode-capture',
  'claude-code-capture',
  'codex-cli-capture',
  'copilot-cli-capture',
  'gemini-cli-capture',
];

const NATIVE_CAPTURE_ENV_ALIASES: Readonly<Record<string, CaptureDataSource>> = {
  opencode: 'opencode-capture',
  'opencode-capture': 'opencode-capture',
  claude: 'claude-code-capture',
  'claude-code': 'claude-code-capture',
  'claude-code-capture': 'claude-code-capture',
  codex: 'codex-cli-capture',
  'codex-cli': 'codex-cli-capture',
  'codex-cli-capture': 'codex-cli-capture',
  copilot: 'copilot-cli-capture',
  'copilot-cli': 'copilot-cli-capture',
  'copilot-cli-capture': 'copilot-cli-capture',
  gemini: 'gemini-cli-capture',
  'gemini-cli': 'gemini-cli-capture',
  'gemini-cli-capture': 'gemini-cli-capture',
};

function normalizePreferredCaptureSource(rawValue: string | null | undefined): CaptureDataSource | null {
  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (normalized.length === 0) {
    return null;
  }

  const resolved = NATIVE_CAPTURE_ENV_ALIASES[normalized] || null;
  if (!resolved) {
    console.warn(
      `   Warning: SYSTEM_SPEC_KIT_CAPTURE_SOURCE="${rawValue}" is not a recognized capture source. ` +
      `Valid values: ${Object.keys(NATIVE_CAPTURE_ENV_ALIASES).join(', ')}. Ignoring override.`
    );
  }
  return resolved;
}

function hasTruthyEnvKey(env: NodeJS.ProcessEnv, keys: readonly string[]): boolean {
  return keys.some((key) => {
    const value = env[key];
    return typeof value === 'string' && value.trim().length > 0;
  });
}

function inferPreferredCaptureSourceFromEnv(env: NodeJS.ProcessEnv = process.env): CaptureDataSource | null {
  const explicit = normalizePreferredCaptureSource(env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE);
  if (explicit) {
    return explicit;
  }

  if (hasTruthyEnvKey(env, ['CODEX_SHELL', 'CODEX_CI', 'CODEX_INTERNAL_ORIGINATOR_OVERRIDE'])) {
    return 'codex-cli-capture';
  }

  if (hasTruthyEnvKey(env, ['COPILOT_SESSION'])) {
    return 'copilot-cli-capture';
  }

  if (hasTruthyEnvKey(env, ['CLAUDECODE', 'CLAUDE_CODE', 'CLAUDE_CODE_SESSION', 'CLAUDE_CODE_ENTRYPOINT'])) {
    return 'claude-code-capture';
  }

  if (hasTruthyEnvKey(env, ['GEMINI_CLI', 'GEMINI_SESSION_ID'])) {
    return 'gemini-cli-capture';
  }

  if (hasTruthyEnvKey(env, ['OPENCODE_SESSION_ID', 'OPENCODE_RUNTIME'])) {
    return 'opencode-capture';
  }

  return null;
}

function buildNativeCaptureOrder(preferredCaptureSource: CaptureDataSource | null): CaptureDataSource[] {
  if (!preferredCaptureSource) {
    return [...DEFAULT_NATIVE_CAPTURE_ORDER];
  }

  return [
    preferredCaptureSource,
    ...DEFAULT_NATIVE_CAPTURE_ORDER.filter((source) => source !== preferredCaptureSource),
  ];
}

async function attemptNativeCapture(
  source: CaptureDataSource,
  specFolderArg: string | null | undefined,
  sessionId?: string | null,
): Promise<LoadedData | null> {
  const projectRoot = CONFIG.PROJECT_ROOT;

  switch (source) {
    case 'opencode-capture': {
      console.log('   🔍 Attempting OpenCode session capture...');
      const opencodeCapture = await getOpencodeCapture();
      if (!opencodeCapture) {
        structuredLog('debug', 'OpenCode capture not available', { projectRoot });
        console.log('   ⚠️  OpenCode capture not available');
        return null;
      }

      try {
        const conversation = await opencodeCapture.captureConversation(20, projectRoot);
        if (hasUsableCaptureContent(conversation)) {
          console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from OpenCode`);
          console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
          return transformOpencodeCapture(conversation, specFolderArg, 'opencode-capture') as LoadedData;
        }

        structuredLog('debug', 'OpenCode capture returned empty data', { projectRoot });
        console.log('   ⚠️  OpenCode capture returned empty data');
        return null;
      } catch (captureError: unknown) {
        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
        structuredLog('debug', 'OpenCode capture failed', { projectRoot, error: captureErrMsg });
        console.log(`   ⚠️  OpenCode capture unavailable: ${captureErrMsg}`);
        return null;
      }
    }

    case 'claude-code-capture': {
      console.log('   🔍 Attempting Claude Code session capture...');
      const claudeCodeCapture = await getClaudeCodeCapture();
      if (!claudeCodeCapture) {
        structuredLog('debug', 'Claude Code capture not available', { projectRoot });
        console.log('   ⚠️  Claude Code capture not available');
        return null;
      }

      try {
        const conversation = await claudeCodeCapture.captureClaudeConversation(
          20,
          projectRoot,
          buildClaudeSessionHints(sessionId),
        );
        if (hasUsableCaptureContent(conversation)) {
          console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from Claude Code`);
          console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
          const data = transformOpencodeCapture(conversation, specFolderArg, 'claude-code-capture');
          return { ...data, _source: 'claude-code-capture' } as LoadedData;
        }

        structuredLog('debug', 'Claude Code capture returned empty data', { projectRoot });
        console.log('   ⚠️  Claude Code capture returned empty data');
        return null;
      } catch (captureError: unknown) {
        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
        structuredLog('debug', 'Claude Code capture failed', { projectRoot, error: captureErrMsg });
        console.log(`   ⚠️  Claude Code capture unavailable: ${captureErrMsg}`);
        return null;
      }
    }

    case 'codex-cli-capture': {
      console.log('   🔍 Attempting Codex CLI session capture...');
      const codexCliCapture = await getCodexCliCapture();
      if (!codexCliCapture) {
        structuredLog('debug', 'Codex CLI capture not available', { projectRoot });
        console.log('   ⚠️  Codex CLI capture not available');
        return null;
      }

      try {
        const conversation = await codexCliCapture.captureCodexConversation(20, projectRoot);
        if (hasUsableCaptureContent(conversation)) {
          console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from Codex CLI`);
          console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
          const data = transformOpencodeCapture(conversation, specFolderArg, 'codex-cli-capture');
          return { ...data, _source: 'codex-cli-capture' } as LoadedData;
        }

        structuredLog('debug', 'Codex CLI capture returned empty data', { projectRoot });
        console.log('   ⚠️  Codex CLI capture returned empty data');
        return null;
      } catch (captureError: unknown) {
        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
        structuredLog('debug', 'Codex CLI capture failed', { projectRoot, error: captureErrMsg });
        console.log(`   ⚠️  Codex CLI capture unavailable: ${captureErrMsg}`);
        return null;
      }
    }

    case 'copilot-cli-capture': {
      console.log('   🔍 Attempting Copilot CLI session capture...');
      const copilotCliCapture = await getCopilotCliCapture();
      if (!copilotCliCapture) {
        structuredLog('debug', 'Copilot CLI capture not available', { projectRoot });
        console.log('   ⚠️  Copilot CLI capture not available');
        return null;
      }

      try {
        const conversation = await copilotCliCapture.captureCopilotConversation(20, projectRoot);
        if (hasUsableCaptureContent(conversation)) {
          console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from Copilot CLI`);
          console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
          const data = transformOpencodeCapture(conversation, specFolderArg, 'copilot-cli-capture');
          return { ...data, _source: 'copilot-cli-capture' } as LoadedData;
        }

        structuredLog('debug', 'Copilot CLI capture returned empty data', { projectRoot });
        console.log('   ⚠️  Copilot CLI capture returned empty data');
        return null;
      } catch (captureError: unknown) {
        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
        structuredLog('debug', 'Copilot CLI capture failed', { projectRoot, error: captureErrMsg });
        console.log(`   ⚠️  Copilot CLI capture unavailable: ${captureErrMsg}`);
        return null;
      }
    }

    case 'gemini-cli-capture': {
      console.log('   🔍 Attempting Gemini CLI session capture...');
      const geminiCliCapture = await getGeminiCliCapture();
      if (!geminiCliCapture) {
        structuredLog('debug', 'Gemini CLI capture not available', { projectRoot });
        console.log('   ⚠️  Gemini CLI capture not available');
        return null;
      }

      try {
        const conversation = await geminiCliCapture.captureGeminiConversation(20, projectRoot);
        if (hasUsableCaptureContent(conversation)) {
          console.log(`   ✓ Captured ${conversation.exchanges.length} exchanges from Gemini CLI`);
          console.log(`   ✓ Session: ${conversation.sessionTitle || 'Unnamed'}`);
          const data = transformOpencodeCapture(conversation, specFolderArg, 'gemini-cli-capture');
          return { ...data, _source: 'gemini-cli-capture' } as LoadedData;
        }

        structuredLog('debug', 'Gemini CLI capture returned empty data', { projectRoot });
        console.log('   ⚠️  Gemini CLI capture returned empty data');
        return null;
      } catch (captureError: unknown) {
        const captureErrMsg = captureError instanceof Error ? captureError.message : String(captureError);
        structuredLog('debug', 'Gemini CLI capture failed', { projectRoot, error: captureErrMsg });
        console.log(`   ⚠️  Gemini CLI capture unavailable: ${captureErrMsg}`);
        return null;
      }
    }
  }
}

async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
  const dataFile = options?.dataFile !== undefined ? options.dataFile : CONFIG.DATA_FILE;
  const specFolderArg = options?.specFolderArg !== undefined ? options.specFolderArg : CONFIG.SPEC_FOLDER_ARG;
  const preferredCaptureSource = options?.preferredCaptureSource !== undefined
    ? options.preferredCaptureSource
    : inferPreferredCaptureSourceFromEnv();
  const sessionId = options?.sessionId ?? null;

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

  const nativeCaptureOrder = buildNativeCaptureOrder(preferredCaptureSource);
  if (preferredCaptureSource) {
    console.log(`   ℹ️  Preferred native capture source: ${preferredCaptureSource}`);
  }

  for (const source of nativeCaptureOrder) {
    const loaded = await attemptNativeCapture(source, specFolderArg, sessionId);
    if (loaded) {
      return loaded;
    }
  }

  // Priority 7: No data available — refuse to proceed
  throw new Error(
    'NO_DATA_AVAILABLE: No session data found. Neither JSON data file, OpenCode session capture, Claude Code session capture, Codex CLI session capture, Copilot CLI session capture, nor Gemini CLI session capture provided usable content. ' +
    'External CLI agents must provide data via JSON mode: ' +
    'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
  );
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  loadCollectedData,
  inferPreferredCaptureSourceFromEnv,
  buildNativeCaptureOrder,
};
