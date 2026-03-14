// ───────────────────────────────────────────────────────────────
// 1. SESSION EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts session metadata — ID, title, duration, key topics, and learning delta

// Node stdlib
import * as crypto from 'crypto';
import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

// Internal modules
import { CONFIG } from '../core';
import {
  createValidShortTerms,
  shouldIncludeTopicWord,
  tokenizeTopicWords,
} from '../lib/topic-keywords';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** Counts tool usage by category within a session. */
export interface ToolCounts {
  Read: number;
  Edit: number;
  Write: number;
  Bash: number;
  Grep: number;
  Glob: number;
  Task: number;
  WebFetch: number;
  WebSearch: number;
  Skill: number;
  [key: string]: number;
}

/** High-level characteristics inferred from the session. */
export interface SessionCharacteristics {
  contextType: string;
  importanceTier: string;
  decisionCount: number;
  toolCounts: ToolCounts;
}

/** Progress summary for an individual tracked file. */
export interface FileProgressEntry {
  FILE_NAME: string;
  FILE_STATUS: string;
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

/** Observation item consumed by the session extractor. */
export interface Observation {
  type?: string;
  narrative?: string;
  facts?: Array<string | { text?: string }>;
  title?: string;
  timestamp?: string;
  files?: string[];
  _provenance?: 'git' | 'spec-folder';
  _synthetic?: boolean;
}

/** User prompt metadata consumed by the session extractor. */
export interface UserPrompt {
  prompt: string;
  timestamp?: string;
}

/** File entry metadata consumed by the session extractor. */
export interface FileEntry {
  FILE_PATH: string;
  FILE_NAME?: string;
  DESCRIPTION?: string;
}

/** Spec file entry metadata consumed by the session extractor. */
export interface SpecFileEntry {
  FILE_NAME: string;
  FILE_PATH?: string;
  DESCRIPTION?: string;
}

/** Recent context entry used for session summarization. */
export interface RecentContextEntry {
  learning?: string;
  request?: string;
  continuationCount?: number;
  files?: string[];
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
}

/* ───────────────────────────────────────────────────────────────
   2. SESSION ID & CHANNEL
------------------------------------------------------------------*/

// Uses crypto.randomBytes (CSPRNG) for session ID generation.
// Output format: session-{timestamp}-{12-char-hex}  (48 bits entropy, [a-f0-9] only)
function generateSessionId(): string {
  const randomPart = crypto.randomBytes(6).toString('hex'); // 6 bytes = 12 hex chars = 48 bits
  return `session-${Date.now()}-${randomPart}`;
}

function getChannel(): string {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe'], timeout: 5000
    }).trim();
    return branch === 'HEAD'
      ? `detached:${execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe'], timeout: 5000 }).trim()}`
      : branch;
  } catch {
    return 'default';
  }
}

/* ───────────────────────────────────────────────────────────────
   3. CONTEXT TYPE & IMPORTANCE
------------------------------------------------------------------*/

function detectContextType(toolCounts: ToolCounts, decisionCount: number): string {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'general';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  const webTools = (toolCounts.WebSearch || 0) + (toolCounts.WebFetch || 0);

  if (decisionCount > 0) return 'decision';
  if (webTools / total > 0.3) return 'discovery';
  if (readTools / total > 0.5 && writeTools / total < 0.1) return 'research';
  if (writeTools / total > 0.3) return 'implementation';
  return 'general';
}

function detectImportanceTier(filesModified: string[], contextType: string): string {
  const criticalSegments = ['architecture', 'core', 'schema', 'security', 'config'];
  if (filesModified.some((filePath) => {
    const resolvedPath = path.resolve(CONFIG.PROJECT_ROOT, filePath);
    const segments = resolvedPath.split(path.sep).filter(Boolean);
    return criticalSegments.some((segment) => segments.includes(segment));
  })) return 'critical';
  if (contextType === 'decision') return 'important';
  return 'normal';
}

/* ───────────────────────────────────────────────────────────────
   4. PROJECT PHASE & STATE
------------------------------------------------------------------*/

function detectProjectPhase(
  toolCounts: ToolCounts,
  observations: Observation[],
  messageCount: number
): string {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'RESEARCH';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0);
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

function extractNextAction(
  observations: Observation[],
  recentContext?: RecentContextEntry[]
): string {
  const nextLabelPattern = /\bnext:\s*(.+)/i;
  const fallbackLabelPattern = /\b(?:todo|follow-?up):\s*(.+)/i;

  for (let i = observations.length - 1; i >= 0; i--) {
    const obs = observations[i];
    if (obs.facts) {
      for (let j = obs.facts.length - 1; j >= 0; j--) {
        const fact = obs.facts[j];
        if (typeof fact === 'string') {
          const nextMatch = fact.match(nextLabelPattern);
          if (nextMatch) return nextMatch[1].trim();
        }
      }
    }
  }
  for (let i = observations.length - 1; i >= 0; i--) {
    const obs = observations[i];
    if (obs.facts) {
      for (let j = obs.facts.length - 1; j >= 0; j--) {
        const fact = obs.facts[j];
        if (typeof fact === 'string') {
          const nextMatch = fact.match(fallbackLabelPattern);
          if (nextMatch) return nextMatch[1].trim();
        }
      }
    }
  }
  if (recentContext?.[0]?.learning) {
    const nextMatch = recentContext[0].learning.match(/\b(?:next|then|afterwards?):\s*(.+)/i);
    if (nextMatch) return nextMatch[1].trim().substring(0, 100);
  }
  return 'Continue implementation';
}

function extractBlockers(observations: Observation[]): string {
  const blockerKeywords = /\b(?:block(?:ed|er|ing)?|stuck|issue|problem|error|fail(?:ed|ing)?|cannot|can't)\b/i;
  for (const obs of observations) {
    const narrative = obs.narrative || '';
    if (blockerKeywords.test(narrative)) {
      const sentences = narrative.match(/[^.!?]+[.!?]+/g) || [narrative];
      for (const sentence of sentences) {
        if (blockerKeywords.test(sentence)) return sentence.trim().substring(0, 100);
      }
    }
  }
  return 'None';
}

function buildFileProgress(specFiles: SpecFileEntry[] | undefined): FileProgressEntry[] {
  if (!specFiles?.length) return [];
  return specFiles.map((file) => ({ FILE_NAME: file.FILE_NAME, FILE_STATUS: 'EXISTS' }));
}

/* ───────────────────────────────────────────────────────────────
   5. TOOL COUNTING & DURATION
------------------------------------------------------------------*/

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

function calculateExpiryEpoch(importanceTier: string, createdAtEpoch: number): number {
  if (['constitutional', 'critical', 'important'].includes(importanceTier)) return 0;
  if (importanceTier === 'temporary') return createdAtEpoch + (7 * 24 * 60 * 60);
  if (importanceTier === 'deprecated') return createdAtEpoch;
  return createdAtEpoch + (90 * 24 * 60 * 60); // 90 days default
}

/* ───────────────────────────────────────────────────────────────
   6. RELATED DOCS & KEY TOPICS
------------------------------------------------------------------*/

async function detectRelatedDocs(specFolderPath: string): Promise<RelatedDoc[]> {
  const docFiles = [
    { name: 'spec.md', role: 'Requirements specification' },
    { name: 'plan.md', role: 'Implementation plan' },
    { name: 'tasks.md', role: 'Task breakdown' },
    { name: 'checklist.md', role: 'QA checklist' },
    { name: 'decision-record.md', role: 'Architecture decisions' },
    { name: 'research.md', role: 'Research findings' },
    { name: 'handover.md', role: 'Session handover notes' },
    { name: 'debug-delegation.md', role: 'Debug task delegation' }
  ];

  const found: RelatedDoc[] = [];

  const fileExists = async (filePath: string): Promise<boolean> => {
    try {
      await fs.access(filePath);
      return true;
    } catch {
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

// NOTE: Similar to core/workflow.ts:extractKeyTopics but differs in:
// - Larger stopwords set (~3x more stopwords for thorough filtering)
// - Accepts `string | undefined` (workflow.ts requires `string`)
// - Broader placeholder detection (checks SIMULATION MODE, [response], placeholder, <20 chars)
// - Processes TITLE, RATIONALE, and CHOSEN from decisions (workflow.ts only uses TITLE/RATIONALE)
function extractKeyTopics(summary: string | undefined, decisions: DecisionForTopics[] = []): string[] {
  const topics = new Set<string>();

  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once',
    'file', 'files', 'code', 'update', 'updated', 'add', 'added', 'remove', 'removed',
    'change', 'changed', 'fix', 'fixed', 'new', 'session', 'using', 'used',
    'response', 'request', 'message', 'user', 'assistant', 'processed',
    'initiated', 'conversation', 'unknown', 'placeholder', 'simulation',
    'simulated', 'fallback', 'default', 'undefined', 'null', 'empty',
    'get', 'set', 'run', 'make', 'made', 'create', 'created', 'delete', 'deleted',
    'start', 'started', 'stop', 'stopped', 'done', 'complete', 'completed'
  ]);

  const validShortTerms = createValidShortTerms();

  const isPlaceholderSummary: boolean = !summary ||
    summary.includes('SIMULATION MODE') ||
    summary.includes('[response]') ||
    summary.includes('placeholder') ||
    summary.length < 20;

  const addTopics = (text: string): void => {
    const words = tokenizeTopicWords(text);
    words.forEach((word) => {
      if (shouldIncludeTopicWord(word, stopwords, validShortTerms)) {
        topics.add(word);
      }
    });
  };

  if (summary && !isPlaceholderSummary) {
    addTopics(summary);
  }

  if (Array.isArray(decisions)) {
    for (const dec of decisions) {
      addTopics(`${dec.TITLE || ''} ${dec.RATIONALE || ''} ${dec.CHOSEN || ''}`);
    }
  }

  return Array.from(topics)
    .sort((a, b) => b.length - a.length)
    .slice(0, 10);
}

/* ───────────────────────────────────────────────────────────────
   7. COMPOSITE HELPERS
------------------------------------------------------------------*/

function detectSessionCharacteristics(
  observations: Observation[],
  userPrompts: UserPrompt[],
  FILES: FileEntry[]
): SessionCharacteristics {
  const toolCounts = countToolsByType(observations, userPrompts);
  const decisionCount = observations.filter((obs) =>
    obs.type === 'decision' || obs.title?.toLowerCase().includes('decision')
  ).length;
  const contextType = detectContextType(toolCounts, decisionCount);
  const importanceTier = detectImportanceTier(FILES.map((f) => f.FILE_PATH), contextType);
  return { contextType, importanceTier, decisionCount, toolCounts };
}

function buildProjectStateSnapshot(params: ProjectStateParams): ProjectStateSnapshot {
  const { toolCounts, observations, messageCount, FILES, SPEC_FILES, recentContext } = params;
  const behavioralObservations = getBehavioralObservations(observations);
  return {
    projectPhase: detectProjectPhase(toolCounts, observations, messageCount),
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
