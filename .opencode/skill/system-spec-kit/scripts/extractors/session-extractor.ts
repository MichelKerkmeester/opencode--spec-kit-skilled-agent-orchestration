// ───────────────────────────────────────────────────────────────
// MODULE: Session Extractor
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. SESSION EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts session metadata — ID, title, duration, key topics, and learning delta

// Node stdlib
import * as crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

// Internal modules
import { CONFIG } from '../config';
import { SemanticSignalExtractor } from '../lib/semantic-signal-extractor';
import type {
  FileEntry,
  FileProgressEntry,
  Observation,
  RecentContextEntry,
  SpecFileEntry,
  ToolCounts,
  UserPrompt,
} from '../types/session-types';

export type {
  FileEntry,
  FileProgressEntry,
  Observation,
  RecentContextEntry,
  SpecFileEntry,
  ToolCounts,
  UserPrompt,
};

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** High-level characteristics inferred from the session. */
export interface SessionCharacteristics {
  contextType: string;
  importanceTier: string;
  decisionCount: number;
  toolCounts: ToolCounts;
}

/** Snapshot of the project state captured for session output. */
export interface ProjectStateSnapshot {
  projectPhase: string;
  activeFile: string;
  lastAction: string;
  nextAction: string;
  blockers: string;
  fileProgress: FileProgressEntry[];
}

/** Related documentation entry referenced by the session. */
export interface RelatedDoc {
  FILE_NAME: string;
  FILE_PATH: string;
  DESCRIPTION: string;
}

/** Input parameters required to build a project state snapshot. */
export interface ProjectStateParams {
  toolCounts: ToolCounts;
  observations: Observation[];
  messageCount: number;
  FILES: FileEntry[];
  SPEC_FILES: SpecFileEntry[];
  specFolderPath: string | null;
  recentContext?: RecentContextEntry[];
  explicitProjectPhase?: string | null;
}

/* ───────────────────────────────────────────────────────────────
   2. SESSION ID & CHANNEL
------------------------------------------------------------------*/

/**
 * Generate a unique session identifier using CSPRNG.
 * @returns Session ID in the format `session-{timestamp}-{12-char-hex}` with 48 bits of entropy.
 */
function generateSessionId(): string {
  const randomPart = crypto.randomBytes(6).toString('hex'); // 6 bytes = 12 hex chars = 48 bits
  return `session-${Date.now()}-${randomPart}`;
}

/**
 * Detect the current git branch to use as the session channel.
 * @returns Branch name, a `detached:{short-sha}` string, or `'default'` on failure.
 */
function getChannel(): string {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe'], timeout: 5000
    }).trim();
    return branch === 'HEAD'
      ? `detached:${execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe'], timeout: 5000 }).trim()}`
      : branch;
  } catch (_error: unknown) {
    return 'default';
  }
}

/* ───────────────────────────────────────────────────────────────
   3. CONTEXT TYPE & IMPORTANCE
------------------------------------------------------------------*/

/**
 * Classify the session context type based on tool usage ratios and decision count.
 * @param toolCounts - Aggregated counts of each tool type used in the session.
 * @param decisionCount - Number of decision observations recorded.
 * @returns One of `'planning'`, `'research'`, `'implementation'`, or `'general'`.
 */
function detectContextType(toolCounts: ToolCounts, decisionCount: number): string {
  // RC5: Check decision count BEFORE total===0 early return.
  // In JSON mode tool counts are always 0, so decisions were never checked.
  if (decisionCount > 0) return 'planning';

  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'general';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0) + (toolCounts.View || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  const webTools = (toolCounts.WebSearch || 0) + (toolCounts.WebFetch || 0);
  if (webTools / total > 0.3) return 'research';
  if (readTools / total > 0.5 && writeTools / total < 0.1) return 'research';
  if (writeTools / total > 0.3) return 'implementation';
  return 'general';
}

/**
 * Determine the importance tier of a session based on modified file paths and context type.
 * @param filesModified - Array of file paths modified during the session.
 * @param contextType - The detected context type (e.g. `'decision'`).
 * @returns One of `'critical'`, `'important'`, or `'normal'`.
 */
function detectImportanceTier(filesModified: string[], contextType: string): string {
  const criticalSegments = ['architecture', 'core', 'schema', 'security', 'config'];
  if (filesModified.some((filePath) => {
    const resolvedPath = path.resolve(CONFIG.PROJECT_ROOT, filePath);
    const segments = resolvedPath.split(path.sep).filter(Boolean);
    return criticalSegments.some((segment) => segments.includes(segment));
  })) return 'critical';
  if (contextType === 'planning') return 'important';
  return 'normal';
}

const VALID_IMPORTANCE_TIERS = new Set([
  'constitutional',
  'critical',
  'important',
  'normal',
  'temporary',
  'deprecated',
]);

function resolveImportanceTier(
  filesModified: string[],
  contextType: string,
  explicitImportanceTier?: string | null
): string {
  if (typeof explicitImportanceTier === 'string') {
    const normalizedTier = explicitImportanceTier.trim().toLowerCase();
    if (VALID_IMPORTANCE_TIERS.has(normalizedTier)) {
      return normalizedTier;
    }
  }

  return detectImportanceTier(filesModified, contextType);
}

/* ───────────────────────────────────────────────────────────────
   4. PROJECT PHASE & STATE
------------------------------------------------------------------*/

/**
 * Infer the current project phase from tool ratios and observation types.
 * @param toolCounts - Aggregated counts of each tool type used in the session.
 * @param observations - Session observations containing type and fact data.
 * @param messageCount - Total number of messages in the conversation.
 * @returns One of `'RESEARCH'`, `'PLANNING'`, `'IMPLEMENTATION'`, `'DEBUGGING'`, or `'REVIEW'`.
 */
function detectProjectPhase(
  toolCounts: ToolCounts,
  observations: Observation[],
  messageCount: number
): string {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'RESEARCH';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0) + (toolCounts.View || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  const obsTypes = observations.map((o) => o.type || 'observation');
  const hasDecisions = obsTypes.includes('decision');
  const hasFeatures = obsTypes.some((t) => ['feature', 'implementation'].includes(t));

  if (writeTools / total > 0.4) return 'IMPLEMENTATION';
  if (hasDecisions && writeTools < readTools) return 'PLANNING';
  if (hasFeatures && writeTools > 0) return 'REVIEW';
  if (readTools / total > 0.6) return 'RESEARCH';
  return 'IMPLEMENTATION';
}

const VALID_PROJECT_PHASES = new Set([
  'RESEARCH',
  'PLANNING',
  'IMPLEMENTATION',
  'DEBUGGING',
  'REVIEW',
]);

/**
 * Resolve the project phase, honouring an explicit caller-provided override when valid.
 * Follows the same explicit-override pattern as `resolveImportanceTier`.
 * @param toolCounts - Aggregated counts of each tool type used in the session.
 * @param observations - Session observations containing type and fact data.
 * @param messageCount - Total number of messages in the conversation.
 * @param explicitProjectPhase - Optional caller-provided phase override from structured input.
 * @returns One of `'RESEARCH'`, `'PLANNING'`, `'IMPLEMENTATION'`, `'DEBUGGING'`, or `'REVIEW'`.
 */
export function resolveProjectPhase(
  toolCounts: ToolCounts,
  observations: Observation[],
  messageCount: number,
  explicitProjectPhase?: string | null
): string {
  if (typeof explicitProjectPhase === 'string') {
    const normalizedPhase = explicitProjectPhase.trim().toUpperCase();
    if (VALID_PROJECT_PHASES.has(normalizedPhase)) {
      return normalizedPhase;
    }
  }

  return detectProjectPhase(toolCounts, observations, messageCount);
}

/**
 * Identify the most recently active file from observations, preferring non-synthetic entries.
 * @param observations - Session observations that may reference files.
 * @param files - Fallback file entries if no observation references a file.
 * @returns The file path of the most recently active file, or `'N/A'`.
 */
function extractActiveFile(observations: Observation[], files: FileEntry[] | undefined): string {
  const prioritizedObservations = observations.some((observation) => !observation._synthetic)
    ? observations.filter((observation) => !observation._synthetic)
    : observations;

  for (let i = prioritizedObservations.length - 1; i >= 0; i--) {
    const obsFiles = prioritizedObservations[i].files;
    if (obsFiles && obsFiles.length > 0) return obsFiles[0];
  }
  return files?.[0]?.FILE_PATH || 'N/A';
}

function getBehavioralObservations(observations: Observation[]): Observation[] {
  const liveObservations = observations.filter((observation) => !observation._synthetic);
  return liveObservations.length > 0 ? liveObservations : observations;
}

function findFactByPattern(observations: Observation[], pattern: RegExp): string | null {
  for (let i = observations.length - 1; i >= 0; i--) {
    const obs = observations[i];
    if (obs.facts) {
      for (let j = obs.facts.length - 1; j >= 0; j--) {
        const fact = obs.facts[j];
        if (typeof fact === 'string') {
          const match = fact.match(pattern);
          if (match && match[1] != null) return match[1].trim();
        }
      }
    }
  }
  return null;
}

const INVALID_BLOCKER_PATTERNS: RegExp[] = [
  // Spec-defined (REQ-006): markdown headers, leading quotes/backtick/space, transition quotes
  /^##\s+/,
  /^['"` ]/,
  /'\s+to\s+'/i,
  // Additional guards: numbered section headings, ALLCAPS status lines, code fragments
  /^\d+(?:\.\d+)*\s+[A-Z][A-Z0-9 _-]*$/,
  /^[A-Z][A-Z0-9 _-]{2,}\s+blocked\b/,
  /(?:=>|{|\(|\)|;)\s*$/,
];

function isInvalidBlockerText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 8) {
    return true;
  }

  return INVALID_BLOCKER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function splitBlockerCandidates(narrative: string): string[] {
  return narrative
    .split(/\n+/)
    .flatMap((line) => line.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [])
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function extractFromRecentContext(recentContext?: RecentContextEntry[]): string | null {
  const learning = recentContext?.[0]?.learning;
  if (!learning) return null;
  const match = learning.match(/\b(?:next|then|afterwards?):\s*(.+)/i);
  return match?.[1]?.trim().substring(0, 100) ?? null;
}

/**
 * Extract the next planned action from observation facts or recent context learning entries.
 * @param observations - Session observations containing fact strings to search.
 * @param recentContext - Optional recent context entries with learning text.
 * @returns The next action string, or `'Continue implementation'` as default.
 */
function extractNextAction(
  observations: Observation[],
  recentContext?: RecentContextEntry[]
): string {
  return findFactByPattern(observations, /\bnext:\s*(.+)/i)
    ?? findFactByPattern(observations, /\b(?:todo|follow-?up):\s*(.+)/i)
    ?? extractFromRecentContext(recentContext)
    ?? 'Continue implementation';
}

/**
 * Scan observation narratives for blocker keywords and return the first valid blocker sentence.
 * @param observations - Session observations whose narratives are searched for blockers.
 * @returns A trimmed blocker sentence (max 100 chars), or `'None'` if no blockers found.
 */
function extractBlockers(observations: Observation[]): string {
  // Fix 3: Require blocker-specific sentence structure, not just keyword presence.
  // Broad keywords like "error", "problem", "failed" match normal technical discussion
  // (e.g., "error handling", "the problem was X", "this test failed").
  const blockerPatterns = [
    /\b(?:blocked|blocking)\s+(?:on|by)\b/i,         // "blocked on/by X"
    /\bcannot\s+(?:proceed|continue|progress)\b/i,    // "cannot proceed"
    /\bcan't\s+(?:proceed|continue|progress)\b/i,     // "can't proceed"
    /\bstuck\s+(?:on|at|with)\b/i,                    // "stuck on X"
    /\bwaiting\s+(?:on|for)\b/i,                      // "waiting for X"
    /\bblocker:\s/i,                                   // explicit "blocker:" prefix
    /\bblocking\s+issue\b/i,                           // "blocking issue"
  ];
  for (const obs of observations) {
    const narrative = obs.narrative || '';
    if (blockerPatterns.some(pattern => pattern.test(narrative))) {
      const sentences = splitBlockerCandidates(narrative);
      for (const sentence of sentences) {
        if (!blockerPatterns.some(pattern => pattern.test(sentence))) {
          continue;
        }

        if (isInvalidBlockerText(sentence)) {
          if (process.env.DEBUG) {
            console.debug(`[session-extractor] rejected blocker artifact: ${sentence.trim()}`);
          }
          continue;
        }

        return sentence.trim().substring(0, 100);
      }
    }
  }
  return 'None';
}

/**
 * Build a file progress list from spec files, marking each as `'EXISTS'`.
 * @param specFiles - Optional array of spec file entries to convert.
 * @returns Array of file progress entries, or empty array if no spec files provided.
 */
function buildFileProgress(specFiles: SpecFileEntry[] | undefined): FileProgressEntry[] {
  if (!specFiles?.length) return [];
  return specFiles.map((file) => ({ FILE_NAME: file.FILE_NAME, FILE_STATUS: 'EXISTS' }));
}

/* ───────────────────────────────────────────────────────────────
   5. TOOL COUNTING & DURATION
------------------------------------------------------------------*/

/**
 * Count tool invocations by type from observation facts.
 * @param observations - Session observations containing tool-usage facts.
 * @param userPrompts - User prompts (reserved for future use; not counted to avoid false positives).
 * @returns An object mapping each known tool name to its invocation count.
 */
function countToolsByType(observations: Observation[], userPrompts: UserPrompt[]): ToolCounts {
  const toolNames = ['Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob', 'Task', 'WebFetch', 'WebSearch', 'Skill', 'View', 'Agent', 'NotebookEdit', 'ToolSearch'];
  const counts: ToolCounts = Object.fromEntries(toolNames.map((t) => [t, 0])) as ToolCounts;

  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        const factText = typeof fact === 'string' ? fact : (fact as { text?: string }).text || '';
        const normalizedFactText = factText.toLowerCase();
        for (const tool of toolNames) {
          const normalizedTool = tool.toLowerCase();
          if (
            normalizedFactText.includes(`tool: ${normalizedTool}`) ||
            normalizedFactText.includes(`${normalizedTool}(`)
          ) {
            counts[tool]++;
          }
        }
      }
    }
  }
  // Note: userPrompts are intentionally NOT counted — regex matching on raw
  // User text produces false positives (e.g. "Read the docs" matching Read tool).
  // Tool usage evidence comes only from structured observation facts.
  return counts;
}

/**
 * Calculate the elapsed duration between the first and last user prompts.
 * @param userPrompts - Array of user prompts with optional timestamp strings.
 * @param now - Current date used as fallback when timestamps are missing or invalid.
 * @returns Human-readable duration string (e.g. `'2h 15m'` or `'45m'`), or `'N/A'` if empty.
 */
function calculateSessionDuration(userPrompts: UserPrompt[], now: Date): string {
  if (userPrompts.length === 0) return 'N/A';
  const safeParseDate = (dateStr: string | undefined, fallback: Date): Date => {
    if (!dateStr) return fallback;
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  };
  const firstTimestamp = safeParseDate(userPrompts[0]?.timestamp, now);
  const lastTimestamp = safeParseDate(userPrompts[userPrompts.length - 1]?.timestamp, now);
  const minutes = Math.max(0, Math.floor((lastTimestamp.getTime() - firstTimestamp.getTime()) / 60000));
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

/**
 * Compute the expiry epoch (in seconds) for a memory entry based on its importance tier.
 * @param importanceTier - The importance tier (e.g. `'critical'`, `'temporary'`, `'normal'`).
 * @param createdAtEpoch - Creation timestamp as a Unix epoch in seconds.
 * @returns Expiry epoch in seconds, or `0` for non-expiring tiers.
 */
function calculateExpiryEpoch(importanceTier: string, createdAtEpoch: number): number {
  if (['constitutional', 'critical', 'important'].includes(importanceTier)) return 0;
  if (importanceTier === 'temporary') return createdAtEpoch + (7 * 24 * 60 * 60);
  if (importanceTier === 'deprecated') return createdAtEpoch;
  return createdAtEpoch + (90 * 24 * 60 * 60); // 90 days default
}

/* ───────────────────────────────────────────────────────────────
   6. RELATED DOCS & KEY TOPICS
------------------------------------------------------------------*/

/**
 * Discover related documentation files in the spec folder and its parent.
 * @param specFolderPath - Absolute path to the spec folder to scan.
 * @returns Array of related doc entries with name, relative path, and description.
 */
async function detectRelatedDocs(specFolderPath: string): Promise<RelatedDoc[]> {
  const docFiles = [
    { name: 'spec.md', role: 'Requirements specification' },
    { name: 'plan.md', role: 'Implementation plan' },
    { name: 'tasks.md', role: 'Task breakdown' },
    { name: 'checklist.md', role: 'QA checklist' },
    { name: 'decision-record.md', role: 'Architecture decisions' },
    { name: 'research/research.md', role: 'Research findings' },
    { name: 'handover.md', role: 'Session handover notes' },
    { name: 'debug-delegation.md', role: 'Debug task delegation' }
  ];

  const found: RelatedDoc[] = [];

  const fileExists = async (filePath: string): Promise<boolean> => {
    try {
      await fs.access(filePath);
      return true;
    } catch (_error: unknown) {
      return false;
    }
  };

  for (const doc of docFiles) {
    const fullPath = path.join(specFolderPath, doc.name);
    if (await fileExists(fullPath)) {
      found.push({
        FILE_NAME: doc.name,
        FILE_PATH: `./${doc.name}`,
        DESCRIPTION: doc.role
      });
    }
  }

  const parentPath = path.dirname(specFolderPath);
  const parentName = path.basename(parentPath);

  if (/^\d{3}-/.test(parentName) && path.basename(path.dirname(parentPath)) === 'specs') {
    for (const doc of docFiles) {
      const parentDocPath = path.join(parentPath, doc.name);
      if (await fileExists(parentDocPath)) {
        found.push({
          FILE_NAME: doc.name,
          FILE_PATH: `../${doc.name}`,
          DESCRIPTION: `[Parent] ${doc.role}`
        });
      }
    }
  }

  return found;
}

interface DecisionForTopics {
  TITLE?: string;
  RATIONALE?: string;
  CHOSEN?: string;
}

/**
 * Extract up to 10 key topic terms from a session summary and decision records using semantic signal extraction.
 *
 * NOTE: Similar to core/topic-extractor.ts:extractKeyTopics but differs in:
 * - Accepts `string | undefined` (topic-extractor requires `string`)
 * - Broader placeholder detection (checks SIMULATION MODE, [response], placeholder, <20 chars)
 * - Processes TITLE, RATIONALE, and CHOSEN from decisions (topic-extractor only uses TITLE/RATIONALE)
 * - Both delegate to SemanticSignalExtractor with aggressive stopword profile
 *
 * @param summary - Optional session summary text; placeholders are filtered out.
 * @param decisions - Array of decision objects whose titles, rationales, and choices are weighted.
 * @returns Array of up to 10 extracted topic term strings.
 */
function extractKeyTopics(summary: string | undefined, decisions: DecisionForTopics[] = []): string[] {
  const isPlaceholderSummary: boolean = !summary ||
    summary.includes('SIMULATION MODE') ||
    summary.includes('[response]') ||
    summary.includes('placeholder') ||
    summary.length < 20;

  const weightedSegments: string[] = [];

  if (summary && !isPlaceholderSummary) {
    weightedSegments.push(summary);
  }

  if (Array.isArray(decisions)) {
    for (const dec of decisions) {
      const decisionText = `${dec.TITLE || ''} ${dec.RATIONALE || ''} ${dec.CHOSEN || ''}`.trim();
      if (decisionText.length > 0) {
        weightedSegments.push(decisionText, decisionText);
      }
    }
  }

  return SemanticSignalExtractor.extractTopicTerms(weightedSegments.join('\n\n'), {
    stopwordProfile: 'aggressive',
    ngramDepth: 2,
  }).slice(0, 10);
}

/* ───────────────────────────────────────────────────────────────
   7. COMPOSITE HELPERS
------------------------------------------------------------------*/

/**
 * Derive high-level session characteristics by combining tool counts, context type, and importance tier.
 * @param observations - Session observations used for tool counting and decision detection.
 * @param userPrompts - User prompts passed through to tool counting.
 * @param FILES - File entries whose paths determine the importance tier.
 * @param explicitImportanceTier - Optional caller-provided tier override from structured input.
 * @returns Composite characteristics including context type, importance tier, decision count, and tool counts.
 */
const VALID_CONTEXT_TYPES = new Set([
  'implementation',
  'research',
  'debugging',
  'review',
  'planning',
  'decision',
  'architecture',
  'configuration',
  'documentation',
  'general',
  'discovery',
]);

function detectSessionCharacteristics(
  observations: Observation[],
  userPrompts: UserPrompt[],
  FILES: FileEntry[],
  explicitImportanceTier?: string | null,
  explicitContextType?: string | null
): SessionCharacteristics {
  const toolCounts = countToolsByType(observations, userPrompts);
  const decisionCount = observations.filter((obs) =>
    obs.type === 'decision' || obs.title?.toLowerCase().includes('decision')
  ).length;
  // RC5: Honor explicit contextType from JSON payload when valid
  const contextType = (
    typeof explicitContextType === 'string' &&
    VALID_CONTEXT_TYPES.has(explicitContextType.trim().toLowerCase())
  )
    ? explicitContextType.trim().toLowerCase()
    : detectContextType(toolCounts, decisionCount);
  const importanceTier = resolveImportanceTier(
    FILES.map((f) => f.FILE_PATH),
    contextType,
    explicitImportanceTier
  );
  return { contextType, importanceTier, decisionCount, toolCounts };
}

/**
 * Assemble a complete project state snapshot from session parameters.
 * @param params - Composite input containing tool counts, observations, files, and recent context.
 * @returns Snapshot with project phase, active file, last/next actions, blockers, and file progress.
 */
function buildProjectStateSnapshot(params: ProjectStateParams): ProjectStateSnapshot {
  const { toolCounts, observations, messageCount, FILES, SPEC_FILES, recentContext, explicitProjectPhase } = params;
  const behavioralObservations = getBehavioralObservations(observations);
  return {
    projectPhase: resolveProjectPhase(toolCounts, observations, messageCount, explicitProjectPhase),
    activeFile: extractActiveFile(observations, FILES),
    lastAction: behavioralObservations.slice(-1)[0]?.title || 'Context save initiated',
    nextAction: extractNextAction(behavioralObservations, recentContext),
    blockers: extractBlockers(behavioralObservations),
    fileProgress: buildFileProgress(SPEC_FILES)
  };
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS
------------------------------------------------------------------*/

export {
  generateSessionId,
  getChannel,
  detectContextType,
  detectImportanceTier,
  detectProjectPhase,
  extractActiveFile,
  extractNextAction,
  extractBlockers,
  buildFileProgress,
  countToolsByType,
  calculateSessionDuration,
  calculateExpiryEpoch,
  detectRelatedDocs,
  extractKeyTopics,
  detectSessionCharacteristics,
  buildProjectStateSnapshot,
};
