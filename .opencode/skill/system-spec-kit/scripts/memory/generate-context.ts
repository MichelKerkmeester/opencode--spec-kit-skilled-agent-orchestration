// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow

// Node stdlib
import * as path from 'path';
import * as fsSync from 'fs';

// Internal modules
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  CONFIG,
  getSessionScopedSaveContextExample,
  findActiveSpecsDir,
  getSpecsDirectories,
  SPEC_FOLDER_PATTERN,
  SPEC_FOLDER_BASIC_PATTERN,
  CATEGORY_FOLDER_PATTERN,
  findChildFolderSync,
} from '../core/index.js';
import { runWorkflow, releaseFilesystemLock } from '../core/workflow.js';
import { loadCollectedData } from '../loaders/index.js';
import { collectSessionData } from '../extractors/collect-session-data.js';
import { isMainModule } from '../lib/esm-entry.js';
import { isPhaseParent } from '../spec/is-phase-parent.js';

type StructuredCollectedData = Record<string, unknown> & { _source: 'file' };

interface ParsedCliArguments {
  dataFile: string | null;
  specFolderArg: string | null;
  collectedData: StructuredCollectedData | null;
  sessionId: string | null;
  plannerMode: 'plan-only' | 'full-auto' | 'hybrid';
}

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES
// ───────────────────────────────────────────────────────────────
/** Result of validating a requested spec folder reference. */
export interface SpecFolderValidation {
  valid: boolean;
  reason?: string;
  warning?: string;
}

const SESSION_SCOPED_SAVE_CONTEXT_EXAMPLE = getSessionScopedSaveContextExample();
const GRAPH_METADATA_FILE = 'graph-metadata.json';

// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
  --planner-mode <mode>  Canonical save planner mode: plan-only (default), full-auto, or hybrid
  --full-auto       Shortcut for --planner-mode full-auto

Examples:
  node generate-context.js ${SESSION_SCOPED_SAVE_CONTEXT_EXAMPLE}
  node generate-context.js ${SESSION_SCOPED_SAVE_CONTEXT_EXAMPLE} specs/001-feature/
  node generate-context.js ${SESSION_SCOPED_SAVE_CONTEXT_EXAMPLE} .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates the saved context artifact for the active spec folder and indexes it
  into the Spec Kit Memory system. Canonical saves also refresh the packet's
  root-level graph-metadata.json file as part of the same workflow.
  Planner-first canonical saves are requested by default; use --full-auto for
  the legacy mutation-first fallback.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - If file mode is required, use a session-scoped temp path such as ${SESSION_SCOPED_SAVE_CONTEXT_EXAMPLE}.
  - The legacy shared path /tmp/save-context-data.json is rejected.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Structured JSON compatibility hints (JSON-mode only):
  - Top-level routeAs / mergeModeHint are accepted for compatibility with routed save workflows
  - Explicit CLI spec-folder targets remain authoritative over payload specFolder values

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;

// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal: string): void {
  if (shuttingDown) return; // prevent re-entrant handling
  shuttingDown = true;

  let lockReleaseFailed = false;
  try {
    releaseFilesystemLock();
  } catch (_err: unknown) {
    lockReleaseFailed = true;
  }

  console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
  process.exit(lockReleaseFailed ? 1 : 0);
}

function installSignalHandlers(): void {
  if (signalHandlersInstalled) {
    return;
  }

  process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
  process.on('SIGINT', () => handleSignalShutdown('SIGINT'));

  signalHandlersInstalled = true;
}

// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput: string): boolean {
  return validateFilePath(path.resolve(CONFIG.PROJECT_ROOT, normalizedInput), getSpecsDirectories()) !== null;
}

function isValidSpecFolder(folderPath: string): SpecFolderValidation {
  const folderName = path.basename(folderPath);

  // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
  const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
  // Extract the trailing portion that might be "parent/child"
  const trailingSegments = normalizedInput.split('/');
  // Check if the last two segments both match the spec folder pattern
  if (trailingSegments.length >= 2) {
    const lastTwo = trailingSegments.slice(-2);
    if (SPEC_FOLDER_PATTERN.test(lastTwo[0]) && SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
      // Both segments are valid spec folder names — valid nested spec folder
      const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

      if (!hasSpecsParent) {
        // Fallback: check if the path resolves to an existing directory under any specs root
        for (const specsDir of getSpecsDirectories()) {
          const candidate = path.join(specsDir, normalizedInput);
          if (
            !path.isAbsolute(normalizedInput) &&
            fsSync.existsSync(candidate) &&
            validateFilePath(candidate, getSpecsDirectories()) !== null
          ) {
            return { valid: true };
          }
        }
        return {
          valid: false,
          reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
      }
      return { valid: true };
    }
  }

  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
    if (/^\d{3}-/.test(folderName)) {
      if (/[A-Z]/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should be lowercase' };
      }
      if (/_/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
      }
      if (!/^[a-z]/.test(folderName.slice(4))) {
        return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
      }
    }
    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
  }

  const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

  if (!hasSpecsParent) {
    // Fallback: check if bare name can be resolved via recursive child search
    // (findChildFolderSync in validateArguments handles this, so just report the error here)
    return {
      valid: false,
      reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
    };
  }

  return { valid: true };
}

function resolveCliSpecFolderReference(rawArg: string): string | null {
  const folderName = path.basename(rawArg);
  const explicitProjectScopedPath = !rawArg.endsWith('.json') && (
    rawArg.startsWith('specs/') ||
    rawArg.startsWith('.opencode/specs/')
  )
    ? path.join(CONFIG.PROJECT_ROOT, rawArg)
    : null;

  let resolvedNestedPath: string | null = null;
  if (!rawArg.endsWith('.json')) {
    if (path.isAbsolute(rawArg)) {
      const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
      const lastSegment = absoluteSegments.at(-1);
      const parentSegment = absoluteSegments.at(-2);

      if (
        (lastSegment && SPEC_FOLDER_PATTERN.test(lastSegment)) ||
        (parentSegment && lastSegment && SPEC_FOLDER_PATTERN.test(parentSegment) && SPEC_FOLDER_PATTERN.test(lastSegment))
      ) {
        resolvedNestedPath = rawArg;
      }
    }

    let cleaned = rawArg;
    if (cleaned.startsWith('.opencode/specs/')) {
      cleaned = cleaned.slice('.opencode/specs/'.length);
    } else if (cleaned.startsWith('specs/')) {
      cleaned = cleaned.slice('specs/'.length);
    }
    cleaned = cleaned.replace(/\/+$/, '');

    if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
      resolvedNestedPath = explicitProjectScopedPath;
    }

    const segments = cleaned.split('/');
    if (!resolvedNestedPath && segments.length >= 2) {
      for (const specsDir of getSpecsDirectories()) {
        const candidate = path.join(specsDir, ...segments);
        if (fsSync.existsSync(candidate)) {
          resolvedNestedPath = candidate;
          break;
        }
      }
      if (!resolvedNestedPath && SPEC_FOLDER_PATTERN.test(segments[segments.length - 1])) {
        const activeDir = findActiveSpecsDir();
        if (activeDir) {
          resolvedNestedPath = path.join(activeDir, ...segments);
        }
      }
    }
  }

  if (resolvedNestedPath) {
    return resolvedNestedPath;
  }

  const isSpecFolderPath = (
    rawArg.startsWith('specs/') ||
    rawArg.startsWith('.opencode/specs/') ||
    SPEC_FOLDER_BASIC_PATTERN.test(folderName)
  ) && !rawArg.endsWith('.json');

  return isSpecFolderPath ? rawArg : null;
}

function extractPayloadSpecFolder(data: Record<string, unknown>): string | null {
  for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
    const value = data[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return null;
}

function resolveExistingSpecFolderPath(rawArg: string | null): string | null {
  if (!rawArg) return null;

  if (path.isAbsolute(rawArg)) {
    return fsSync.existsSync(rawArg) ? path.resolve(rawArg) : null;
  }

  const projectScoped = path.resolve(CONFIG.PROJECT_ROOT, rawArg);
  if (fsSync.existsSync(projectScoped)) {
    return projectScoped;
  }

  const cleaned = rawArg
    .replace(/^\.opencode\/specs\//, '')
    .replace(/^specs\//, '')
    .replace(/\/+$/, '');
  const segments = cleaned.split('/').filter(Boolean);
  if (segments.length === 0) return null;

  for (const specsDir of getSpecsDirectories()) {
    const candidate = path.join(specsDir, ...segments);
    if (fsSync.existsSync(candidate)) {
      return path.resolve(candidate);
    }
  }

  return null;
}

function readGraphMetadata(graphFile: string): Record<string, unknown> {
  if (!fsSync.existsSync(graphFile)) {
    return {};
  }

  const raw = fsSync.readFileSync(graphFile, 'utf8');
  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Expected object JSON in ${graphFile}`);
  }
  return parsed as Record<string, unknown>;
}

function atomicWriteJson(filePath: string, value: unknown): void {
  const dir = path.dirname(filePath);
  const tempPath = path.join(
    dir,
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  const data = `${JSON.stringify(value, null, 2)}\n`;
  fsSync.writeFileSync(tempPath, data, 'utf8');
  fsSync.renameSync(tempPath, filePath);
}

function getPacketIdFromGraphMetadata(specFolderPath: string): string {
  const graphFile = path.join(specFolderPath, GRAPH_METADATA_FILE);
  try {
    const metadata = readGraphMetadata(graphFile);
    if (typeof metadata.packet_id === 'string' && metadata.packet_id.trim().length > 0) {
      return metadata.packet_id;
    }
  } catch {
    // Fall through to path-derived packet id.
  }

  for (const specsDir of getSpecsDirectories()) {
    const relative = path.relative(path.resolve(specsDir), path.resolve(specFolderPath));
    if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
      return relative.replace(/\\/g, '/');
    }
  }

  return path.basename(specFolderPath);
}

export function updatePhaseParentPointer(
  phaseParentPath: string,
  activeChildId: string | null,
  timestamp: string,
): void {
  const graphFile = path.join(phaseParentPath, GRAPH_METADATA_FILE);
  const metadata = readGraphMetadata(graphFile);
  const derived = (
    typeof metadata.derived === 'object' &&
    metadata.derived !== null &&
    !Array.isArray(metadata.derived)
  )
    ? { ...(metadata.derived as Record<string, unknown>) }
    : {};

  metadata.derived = {
    ...derived,
    last_active_child_id: activeChildId,
    last_active_at: timestamp,
    // F-019-D4-01: bump parent's last_save_at when the bubble-up touches it,
    // so consumers reading derived metadata see a current save timestamp.
    last_save_at: timestamp,
  };

  // F-019-D4-01: ensure children_ids contains the saved child's packet id
  // (idempotent — only inserts when absent so concurrent saves stay safe).
  if (activeChildId) {
    const existingChildren = Array.isArray(metadata.children_ids)
      ? (metadata.children_ids as unknown[]).filter(
          (item): item is string => typeof item === 'string',
        )
      : [];
    if (!existingChildren.includes(activeChildId)) {
      metadata.children_ids = [...existingChildren, activeChildId];
    }
  }

  atomicWriteJson(graphFile, metadata);
}

export function updatePhaseParentPointersAfterSave(
  specFolderPath: string,
  timestamp: string = new Date().toISOString(),
): void {
  const resolvedSpecFolder = path.resolve(specFolderPath);

  if (isPhaseParent(resolvedSpecFolder)) {
    updatePhaseParentPointer(resolvedSpecFolder, null, timestamp);
    return;
  }

  const directParent = path.dirname(resolvedSpecFolder);
  if (directParent !== resolvedSpecFolder && isPhaseParent(directParent)) {
    updatePhaseParentPointer(
      directParent,
      getPacketIdFromGraphMetadata(resolvedSpecFolder),
      timestamp,
    );
  }
}

async function readAllStdin(stdin: NodeJS.ReadStream = process.stdin): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    let buffer = '';
    stdin.setEncoding('utf8');
    stdin.on('data', (chunk: string) => {
      buffer += chunk;
    });
    stdin.on('end', () => resolve(buffer));
    stdin.on('error', reject);
  });
}

function parseStructuredJson(rawJson: string, sourceLabel: '--stdin' | '--json'): Record<string, unknown> {
  if (rawJson.trim().length === 0) {
    throw new Error(`${sourceLabel} requires a non-empty JSON object`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid JSON provided via ${sourceLabel}: ${errMsg}`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${sourceLabel} requires a JSON object payload`);
  }

  return parsed as Record<string, unknown>;
}

async function parseStructuredModeArguments(
  mode: '--stdin' | '--json',
  args: string[],
  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string>,
): Promise<ParsedCliArguments> {
  if (mode === '--stdin' && process.stdin.isTTY) {
    console.error('--stdin requires piped input');
    process.exit(1);
  }

  const rawJson = mode === '--stdin'
    ? await stdinReader()
    : args[1];

  if (mode === '--json' && rawJson === undefined) {
    throw new Error('--json requires an inline JSON string argument');
  }

  // Validation: empty --json is a user error, not a crash
  if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
    console.log(JSON.stringify({ error: 'VALIDATION_ERROR', message: 'Empty --json input' }));
    process.exit(1);
  }

  const payload = parseStructuredJson(rawJson ?? '', mode);
  const explicitSpecFolderArg = args[mode === '--stdin' ? 1 : 2];
  const explicitTarget = explicitSpecFolderArg ? resolveCliSpecFolderReference(explicitSpecFolderArg) || explicitSpecFolderArg : null;
  const payloadTargetRaw = extractPayloadSpecFolder(payload);
  const payloadTarget = payloadTargetRaw ? (resolveCliSpecFolderReference(payloadTargetRaw) || payloadTargetRaw) : null;
  const specFolderArg = explicitTarget || payloadTarget;

  if (!specFolderArg) {
    throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
  }

  return {
    dataFile: null,
    specFolderArg,
    collectedData: {
      ...payload,
      _source: 'file',
    },
    sessionId: null,
    plannerMode: 'plan-only',
  };
}

// ───────────────────────────────────────────────────────────────
// 5. CLI ARGUMENT PARSING
// ───────────────────────────────────────────────────────────────
async function parseArguments(
  argv: string[] = process.argv.slice(2),
  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
): Promise<ParsedCliArguments> {
  // Extract --session-id <uuid> from argv before positional parsing
  let sessionId: string | null = null;
  let plannerMode: 'plan-only' | 'full-auto' | 'hybrid' = 'plan-only';
  const filteredArgv: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--session-id') {
      const candidate = argv[i + 1];
      if (!candidate || candidate.startsWith('--') || candidate.trim().length === 0) {
        throw new Error('--session-id requires a non-empty value');
      }
      sessionId = candidate.trim();
      i++; // skip the value
      continue;
    }
    if (argv[i] === '--planner-mode') {
      const candidate = argv[i + 1]?.trim().toLowerCase();
      if (!candidate || !['plan-only', 'full-auto', 'hybrid'].includes(candidate)) {
        throw new Error('--planner-mode requires one of: plan-only, full-auto, hybrid');
      }
      plannerMode = candidate as 'plan-only' | 'full-auto' | 'hybrid';
      i++;
      continue;
    }
    if (argv[i] === '--full-auto') {
      plannerMode = 'full-auto';
      continue;
    }
    filteredArgv.push(argv[i]);
  }

  const [primaryArg, secondaryArg] = filteredArgv;
  if (!primaryArg) {
    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId, plannerMode };
  }

  if (primaryArg === '--stdin' || primaryArg === '--json') {
    const structured = await parseStructuredModeArguments(primaryArg, filteredArgv, stdinReader);
    return { ...structured, sessionId, plannerMode };
  }

  const resolvedSpecFolder = resolveCliSpecFolderReference(primaryArg);
  if (resolvedSpecFolder) {
    throw new Error(
      'Direct spec folder mode is no longer supported. ' +
      'Use structured JSON via --json, --stdin, or a JSON temp file.'
    );
  }

  return {
    dataFile: primaryArg,
    specFolderArg: secondaryArg || null,
    collectedData: null,
    sessionId,
    plannerMode,
  };
}

function validateArguments(): void {
  const specFolderArg = CONFIG.SPEC_FOLDER_ARG;
  if (!specFolderArg) return;

  const validation = isValidSpecFolder(specFolderArg);

  if (validation.warning) {
    console.warn(`   Warning: ${validation.warning}`);
  }

  if (validation.valid) return;

  // --- Subfolder support: before failing, try to find the folder as a child ---
  // T114 FIX: Only use basename-based child resolution when the input is a single
  // segment (no '/' separators). Multi-segment paths like "003-parent/121-child"
  // must NOT be silently retargeted by basename alone, because stripping the parent
  // could resolve to a different parent's child with the same leaf name.
  const inputBaseName = path.basename(specFolderArg);
  const isMultiSegment = specFolderArg.includes('/');
  if (!isMultiSegment && SPEC_FOLDER_PATTERN.test(inputBaseName)) {
    // Input looks like a valid spec folder name but wasn't found at top level.
    // Try finding it as a child folder inside any parent.
    const resolved = findChildFolderSync(inputBaseName);
    if (resolved) {
      console.error(`   Resolved child folder "${inputBaseName}" → ${resolved}`);
      CONFIG.SPEC_FOLDER_ARG = resolved;
      return;
    }
    // FindChildFolder logs its own error for ambiguous matches
  }

  console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
  console.error(`   Reason: ${validation.reason}`);
  console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');

  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
  if (fsSync.existsSync(specsDir)) {
    try {
      const available = fsSync.readdirSync(specsDir);
      const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && SPEC_FOLDER_PATTERN.test(n));

      if (matches.length > 0) {
        console.error('Did you mean:');
        matches.forEach((m) => console.error(`  - ${m}`));
      } else {
        // --- Subfolder support: multi-level deep scan as fallback ---
        let deepMatches: string[] = [];
        const targetBase = path.basename(specFolderArg);

        for (const topEntry of available) {
          const isSpec = SPEC_FOLDER_PATTERN.test(topEntry);
          const isCategory = CATEGORY_FOLDER_PATTERN.test(topEntry);
          if (!isSpec && !isCategory) continue;
          const topPath = path.join(specsDir, topEntry);
          try {
            if (!fsSync.statSync(topPath).isDirectory()) continue;
            const topChildren = fsSync.readdirSync(topPath);
            // Search direct children of spec/category folders
            const childMatches = topChildren.filter(
              (c) => c.includes(targetBase) && SPEC_FOLDER_PATTERN.test(c)
            );
            for (const child of childMatches) {
              deepMatches.push(`${topEntry}/${child}`);
            }
            // For category folders, also search grandchildren (category/parent/child)
            if (isCategory) {
              for (const midEntry of topChildren) {
                if (!SPEC_FOLDER_PATTERN.test(midEntry)) continue;
                const midPath = path.join(topPath, midEntry);
                try {
                  if (!fsSync.statSync(midPath).isDirectory()) continue;
                  const grandChildren = fsSync.readdirSync(midPath);
                  const gcMatches = grandChildren.filter(
                    (c) => c.includes(targetBase) && SPEC_FOLDER_PATTERN.test(c)
                  );
                  for (const gc of gcMatches) {
                    deepMatches.push(`${topEntry}/${midEntry}/${gc}`);
                  }
                } catch (_error: unknown) {
                  if (_error instanceof Error) {
                    /* skip unreadable dirs */
                  }
                }
              }
            }
          } catch (_error: unknown) {
            if (_error instanceof Error) {
              /* skip unreadable dirs */
            }
          }
        }

        if (deepMatches.length > 0) {
          console.error('Did you mean (in subfolders):');
          deepMatches.forEach((m) => console.error(`  - ${m}`));
        } else {
          const allSpecs = available.filter((n) => SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
                                    .sort().reverse().slice(0, 5);
          if (allSpecs.length) {
            console.error('Available spec folders:');
            allSpecs.forEach((f) => console.error(`  - ${f}`));
          }
        }
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('[generate-context] Failed to list spec folders:', errMsg);
    }
  }
  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
  process.exit(1);
}

// ───────────────────────────────────────────────────────────────
// 6. MAIN ENTRY POINT
// ───────────────────────────────────────────────────────────────
async function main(
  argv: string[] = process.argv.slice(2),
  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
): Promise<void> {
  console.error('Starting memory skill...\n');

  try {
    const parsed = await parseArguments(argv, stdinReader);
    CONFIG.DATA_FILE = parsed.dataFile;
    CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
    validateArguments();

    await runWorkflow({
      dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE ?? undefined,
      specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
      collectedData: parsed.collectedData ?? undefined,
      loadDataFn: parsed.collectedData
        ? undefined
        : () => loadCollectedData({}),
      collectSessionDataFn: collectSessionData,
      sessionId: parsed.sessionId ?? undefined,
      plannerMode: parsed.plannerMode,
    });

    const savedSpecFolder = resolveExistingSpecFolderPath(CONFIG.SPEC_FOLDER_ARG);
    if (savedSpecFolder) {
      updatePhaseParentPointersAfterSave(savedSpecFolder);
    }
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);

    if (isExpected) {
      console.error(`\nError: ${errMsg}`);
    } else {
      console.error('Unexpected Error:', errMsg);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────
if (isMainModule(import.meta.url)) {
  installSignalHandlers();
  main().catch((error: unknown) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Fatal error: ${errMsg}`);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  });
}

export {
  main,
  readAllStdin,
  parseArguments,
  validateArguments,
  isValidSpecFolder,
  extractPayloadSpecFolder,
};
