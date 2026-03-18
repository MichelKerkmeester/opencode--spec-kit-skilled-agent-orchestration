// ───────────────────────────────────────────────────────────────
// MODULE: Workflow
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. WORKFLOW
// ───────────────────────────────────────────────────────────────
// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
// Node stdlib
import * as path from 'node:path';
import * as fsSync from 'node:fs';
import * as crypto from 'node:crypto';

// Internal modules
import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
import {
  extractConversations,
  extractDecisions,
  extractDiagrams,
  extractPhasesFromData,
  enhanceFilesWithSemanticDescriptions,
} from '../extractors';
import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
import { populateTemplate } from '../renderers';
import { scoreMemoryQuality } from './quality-scorer';
import { extractKeyTopics } from './topic-extractor';
import type { DecisionForTopics } from './topic-extractor';
import { writeFilesAtomically } from './file-writer';
import { generateContentSlug, pickBestContentName, ensureUniqueMemoryFilename } from '../utils/slug-utils';
import { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';
import {
  buildSpecAffinityTargets,
  evaluateCollectedDataSpecAffinity,
} from '../utils/spec-affinity';
import { deriveMemoryDescription } from '../utils/memory-frontmatter';
import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
import type { CollectedDataFull } from '../extractors/collect-session-data';
import type { SemanticFileInfo } from '../extractors/file-extractor';
import { filterContamination, getContaminationPatternLabels, SEVERITY_RANK, type ContaminationSeverity } from '../extractors/contamination-filter';
import {
  scoreMemoryQuality as scoreMemoryQualityV2,
  type ValidationSignal,
} from '../extractors/quality-scorer';
import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
import { extractSpecFolderContext } from '../extractors/spec-folder-extractor';
import { extractGitContext } from '../extractors/git-context-extractor';

// Static imports replacing lazy require()
import * as flowchartGen from '../lib/flowchart-generator';
import { createFilterPipeline } from '../lib/content-filter';
import type { FilterStats, ContaminationAuditRecord } from '../lib/content-filter';
import {
  generateImplementationSummary,
  buildWeightedEmbeddingSections,
  formatSummaryAsMarkdown,
  extractFileChanges,
} from '../lib/semantic-summarizer';
import { EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import { retryManager } from '@spec-kit/mcp-server/api/providers';
import {
  evaluateMemorySufficiency,
  MEMORY_SUFFICIENCY_REJECTION_CODE,
  type MemoryEvidenceSnapshot,
  type MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import { validateMemoryTemplateContract } from '@spec-kit/shared/parsing/memory-template-contract';
import { evaluateSpecDocHealth, type SpecDocHealthResult } from '@spec-kit/shared/parsing/spec-doc-health';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import {
  indexMemory,
  updateMetadataEmbeddingStatus,
  updateMetadataWithEmbedding,
  type IndexingStatusValue,
  type WorkflowIndexingStatus,
} from './memory-indexer';
import * as simFactory from '../lib/simulation-factory';
import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';
import { applyTreeThinning } from './tree-thinning';
import { structuredLog } from '../utils/logger';
import type { FileChange, SessionData } from '../types/session-types';
import type { FileEntry as ThinningFileEntry, ThinningResult } from './tree-thinning';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES
// ───────────────────────────────────────────────────────────────

/** Configuration options for the memory generation workflow. */
export interface WorkflowOptions {
  /** Path to a JSON file containing pre-collected session data. */
  dataFile?: string;
  /** Explicit spec folder path or name to target (bypasses auto-detection). */
  specFolderArg?: string;
  /** Pre-loaded collected data object (skips file-based loading). */
  collectedData?: CollectedDataFull;
  /** Custom async loader function for collected data (alternative to dataFile). */
  loadDataFn?: () => Promise<CollectedDataFull>;
  /** Custom async function to collect live session data from the environment. */
  collectSessionDataFn?: (
    collectedData: CollectedDataFull | null,
    specFolderName?: string | null
  ) => Promise<SessionData>;
  /** When true, suppresses non-error console output during execution. */
  silent?: boolean;
}

/** Result object returned after a successful workflow execution. */
export interface WorkflowResult {
  /** Absolute path to the memory output directory. */
  contextDir: string;
  /** Relative path of the resolved spec folder. */
  specFolder: string;
  /** Basename of the spec folder (e.g., "015-outsourced-agent-handback"). */
  specFolderName: string;
  /** Filename of the primary context markdown file written. */
  contextFilename: string;
  /** List of absolute paths for all files written during this run. */
  writtenFiles: string[];
  /** Numeric memory ID from indexing, or null if indexing was skipped. */
  memoryId: number | null;
  /** Explicit indexing outcome for this workflow run. */
  indexingStatus: WorkflowIndexingStatus;
  /** Summary statistics for the generated memory. */
  stats: {
    /** Number of conversation messages processed. */
    messageCount: number;
    /** Number of decisions extracted. */
    decisionCount: number;
    /** Number of diagrams extracted. */
    diagramCount: number;
    /** Quality score (0-100) from the quality scorer. */
    qualityScore: number;
    /** Whether the data originated from a simulation rather than a live session. */
    isSimulation: boolean;
  };
}

const CODE_FENCE_SEGMENT_RE = /(```[\s\S]*?```)/g;
const WORKFLOW_HTML_COMMENT_RE = /<!--(?!\s*\/?ANCHOR:)[\s\S]*?-->/g;
const WORKFLOW_DANGEROUS_HTML_BLOCK_RE = /<(?:iframe|math|noscript|object|script|style|svg|template)\b[^>]*>[\s\S]*?<\/(?:iframe|math|noscript|object|script|style|svg|template)>/gi;
const WORKFLOW_BLOCK_HTML_TAG_RE = /<\/?(?:article|aside|blockquote|body|br|dd|details|div|dl|dt|figcaption|figure|footer|h[1-6]|header|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|th|thead|tr|ul)\b[^>]*\/?>/gi;
const WORKFLOW_INLINE_HTML_TAG_RE = /<\/?(?:code|em|i|kbd|small|span|strong|sub|sup|u)\b[^>]*\/?>/gi;
const WORKFLOW_PRESERVED_ANCHOR_ID_RE = /<a id="[^"]+"><\/a>/gi;
const WORKFLOW_ANY_HTML_TAG_RE = /<\/?\s*[A-Za-z][\w:-]*(?:\s[^<>]*?)?\s*\/?>/g;

function ensureMinSemanticTopics(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
  if (existing.length >= 1) {
    return existing;
  }

  const topicFromFolder = specFolderName.replace(/^\d{1,3}-/, '');
  const folderTokens = topicFromFolder
    .split(/[-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);

  const fileTokens = enhancedFiles
    .flatMap((file) => path.basename(file.FILE_PATH).replace(/\.[^.]+$/, '').split(/[-_]/))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);

  const combined = [...new Set([...folderTokens, ...fileTokens])];
  return combined.length > 0 ? [combined[0]] : ['session'];
}

function ensureMinTriggerPhrases(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
  if (existing.length >= 2) {
    return existing;
  }

  const topicFromFolder = specFolderName.replace(/^\d{1,3}-/, '');
  const folderTokens = topicFromFolder
    .split(/[-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);
  const combined = [...new Set([...existing, ...folderTokens])];
  if (combined.length >= 2) {
    return combined;
  }

  if (combined.length === 1) {
    return [combined[0], topicFromFolder.replace(/-/g, ' ').toLowerCase() || 'session'];
  }

  return ['session', 'context'];
}

function renderTriggerPhrasesYaml(triggerPhrases: string[]): string {
  if (!Array.isArray(triggerPhrases) || triggerPhrases.length === 0) {
    return 'trigger_phrases: []';
  }

  const escapedPhrases = triggerPhrases.map((phrase) => {
    const normalized = String(phrase).trim();
    return `  - "${normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  });

  return ['trigger_phrases:', ...escapedPhrases].join('\n');
}

function stripWorkflowHtmlOutsideCodeFences(rawContent: string): string {
  const segments = rawContent.split(CODE_FENCE_SEGMENT_RE);

  return segments.map((segment) => {
    if (segment.startsWith('```')) {
      return segment;
    }

    const preservedAnchorIds: string[] = [];
    const protectedSegment = segment.replace(WORKFLOW_PRESERVED_ANCHOR_ID_RE, (match: string) => {
      const token = `__WORKFLOW_ANCHOR_ID_${preservedAnchorIds.length}__`;
      preservedAnchorIds.push(match);
      return token;
    });

    let cleaned = protectedSegment
      .replace(WORKFLOW_HTML_COMMENT_RE, '')
      .replace(WORKFLOW_DANGEROUS_HTML_BLOCK_RE, '\n')
      .replace(WORKFLOW_BLOCK_HTML_TAG_RE, '\n')
      .replace(WORKFLOW_INLINE_HTML_TAG_RE, '')
      .replace(WORKFLOW_ANY_HTML_TAG_RE, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');

    preservedAnchorIds.forEach((anchor, index) => {
      cleaned = cleaned.replace(`__WORKFLOW_ANCHOR_ID_${index}__`, anchor);
    });

    return cleaned;
  }).join('');
}

function escapeLiteralAnchorExamples(input: string): string {
  return input.replace(/<!--\s*(\/?ANCHOR:[^>]+?)\s*-->/g, (_match: string, anchor: string) => (
    `&lt;!-- ${anchor.trim()} --&gt;`
  ));
}

const PREFERRED_PARENT_FILES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'checklist.md',
  'readme.md',
]);

function normalizeFilePath(rawPath: string): string {
  return rawPath
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}

function getParentDirectory(filePath: string): string {
  const normalized = normalizeFilePath(filePath);
  const idx = normalized.lastIndexOf('/');
  return idx >= 0 ? normalized.slice(0, idx) : '';
}

function capText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  const truncated = value.slice(0, maxLength - 3).trim();
  return `${truncated}...`;
}

function summarizeAuditCounts(counts: Map<string, number>): string[] {
  return [...counts.entries()].map(([label, count]) => `${label} x${count}`);
}

function pickCarrierIndex(indices: number[], files: FileChange[]): number {
  for (const idx of indices) {
    const filename = path.basename(files[idx].FILE_PATH).toLowerCase();
    if (PREFERRED_PARENT_FILES.has(filename)) {
      return idx;
    }
  }
  return indices[0];
}

function compactMergedContent(value: string): string {
  return value
    .replace(/<!--\s*merged from:\s*([^>]+)\s*-->/gi, 'Merged from $1:')
    .replace(/\n\s*---\s*\n/g, ' | ')
    .replace(/\s+/g, ' ')
    .trim();
}

type AlignmentTargets = {
  fileTargets: string[];
  keywordTargets: string[];
};

const ALIGNMENT_STOPWORDS = new Set(['ops', 'app', 'api', 'cli', 'lib', 'src', 'dev', 'hub', 'log', 'run']);

function buildAlignmentKeywords(specFolderPath: string): string[] {
  const keywords = new Set<string>();
  const segments = specFolderPath
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.replace(/^\d+--?/, '').trim().toLowerCase())
    .filter(Boolean);

  for (const segment of segments) {
    if (segment.length >= 2) {
      keywords.add(segment);
    }

    for (const token of segment.split(/[-_]/)) {
      if (token.length >= 3 && !ALIGNMENT_STOPWORDS.has(token)) {
        keywords.add(token);
      }
    }
  }

  return Array.from(keywords);
}

async function resolveAlignmentTargets(specFolderPath: string): Promise<AlignmentTargets> {
  const keywordTargets = buildAlignmentKeywords(specFolderPath);
  const fileTargets = new Set<string>();

  try {
    const specContext = await extractSpecFolderContext(path.resolve(specFolderPath));
    for (const entry of specContext.FILES) {
      const normalized = normalizeFilePath(entry.FILE_PATH).toLowerCase();
      if (normalized) {
        fileTargets.add(normalized);
      }
    }
  } catch (_error: unknown) {
    // Fall back to keyword-only alignment when spec docs are unavailable.
  }

  return {
    fileTargets: Array.from(fileTargets),
    keywordTargets,
  };
}

function matchesAlignmentTarget(filePath: string, alignmentTargets: AlignmentTargets): boolean {
  const normalizedPath = normalizeFilePath(filePath).toLowerCase();

  if (alignmentTargets.fileTargets.some((target) => (
    normalizedPath === target
    || normalizedPath.endsWith(`/${target}`)
    || normalizedPath.includes(`/${target}/`)
  ))) {
    return true;
  }

  return alignmentTargets.keywordTargets.some((keyword) => normalizedPath.includes(keyword));
}

/**
 * Apply tree-thinning decisions to the semantic file-change list that feeds
 * context template rendering.
 *
 * Behavior:
 * - `keep` and `content-as-summary` rows remain as individual entries.
 * - `merged-into-parent` rows are removed as standalone entries.
 * - Each merged group contributes a compact merge note to a carrier file in the
 *   same parent directory (or to a synthetic merged entry when no carrier exists).
 *
 * This makes tree thinning effective in the generated context output (instead of
 * only being computed/logged), while preserving merge provenance for recoverability.
 */
function applyThinningToFileChanges(
  files: FileChange[],
  thinningResult: ThinningResult
): FileChange[] {
  if (!Array.isArray(files) || files.length === 0) {
    return files;
  }

  const actionByPath = new Map<string, string>(
    thinningResult.thinned.map((entry) => [normalizeFilePath(entry.path), entry.action])
  );

  const originalByPath = new Map<string, FileChange>();
  for (const file of files) {
    originalByPath.set(normalizeFilePath(file.FILE_PATH), file);
  }

  const reducedFiles: FileChange[] = files
    .filter((file) => {
      const action = actionByPath.get(normalizeFilePath(file.FILE_PATH)) ?? 'keep';
      return action !== 'merged-into-parent';
    })
    .map((file) => ({ ...file }));

  const indicesByParent = new Map<string, number[]>();
  for (let i = 0; i < reducedFiles.length; i++) {
    const parent = getParentDirectory(reducedFiles[i].FILE_PATH);
    const existing = indicesByParent.get(parent) ?? [];
    existing.push(i);
    indicesByParent.set(parent, existing);
  }

  for (const mergedGroup of thinningResult.merged) {
    const normalizedChildren = mergedGroup.childPaths.map(normalizeFilePath);
    const childFiles = normalizedChildren
      .map((childPath) => originalByPath.get(childPath))
      .filter((f): f is FileChange => !!f);

    if (childFiles.length === 0) {
      continue;
    }

    const childNames = childFiles.map((f) => path.basename(f.FILE_PATH));
    const mergedContent = compactMergedContent(mergedGroup.mergedSummary);

    const mergeNote = capText(
      `Tree-thinning merged ${childFiles.length} small files (${childNames.join(', ')}). ${mergedContent}`,
      900,
    );

    const parentDir = normalizeFilePath(mergedGroup.parentPath || '');
    const carrierIndices = indicesByParent.get(parentDir) ?? [];

    if (carrierIndices.length > 0) {
      const carrierIdx = pickCarrierIndex(carrierIndices, reducedFiles);
      const existingDescription = reducedFiles[carrierIdx].DESCRIPTION || '';
      const mergedDescription = existingDescription.includes(mergeNote)
        ? existingDescription
        : (existingDescription.length > 0 ? `${existingDescription} | ${mergeNote}` : mergeNote);
      reducedFiles[carrierIdx].DESCRIPTION = capText(
        mergedDescription,
        900,
      );
      continue;
    }

    const syntheticPath = parentDir.length > 0
      ? `${parentDir}/(merged-small-files)`
      : '(merged-small-files)';

    const syntheticEntry: FileChange = {
      FILE_PATH: syntheticPath,
      DESCRIPTION: mergeNote,
      ACTION: 'Merged',
      _synthetic: true,
    };

    const idx = reducedFiles.push(syntheticEntry) - 1;
    const updatedIndices = indicesByParent.get(parentDir) ?? [];
    updatedIndices.push(idx);
    indicesByParent.set(parentDir, updatedIndices);
  }

  return reducedFiles;
}

function normalizeMemoryTitleCandidate(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s\-:;,]+$/, '');
}

function truncateMemoryTitle(title: string, maxLength: number = 110): string {
  if (title.length <= maxLength) {
    return title;
  }

  const truncated = title.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace >= Math.floor(maxLength * 0.6)) {
    return `${truncated.slice(0, lastSpace)}...`;
  }

  return `${truncated}...`;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/(?<=\d)-(?=\d)/g, '\x00')   // protect digit-digit hyphens (dates like 2026-03-13)
    .replace(/-/g, ' ')
    .replace(/\x00/g, '-')                 // restore digit-digit hyphens
    .replace(/\s{2,}/g, ' ')              // collapse consecutive spaces
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function buildMemoryTitle(_implementationTask: string, _specFolderName: string, _date: string, contentSlug?: string): string {
  if (contentSlug && contentSlug.length > 0) {
    return truncateMemoryTitle(slugToTitle(contentSlug));
  }

  // Fallback (should not happen — contentSlug is always available at call site)
  const preferredTitle = pickBestContentName([_implementationTask]);
  if (preferredTitle.length > 0) {
    return truncateMemoryTitle(normalizeMemoryTitleCandidate(preferredTitle));
  }

  const folderLeaf = _specFolderName.split('/').filter(Boolean).pop() || _specFolderName;
  const readableFolder = normalizeMemoryTitleCandidate(folderLeaf.replace(/^\d+-/, '').replace(/-/g, ' '));
  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${_date}` : `Session ${_date}`;
  return truncateMemoryTitle(fallback);
}

function buildMemoryDashboardTitle(memoryTitle: string, specFolderName: string, contextFilename: string): string {
  const specLeaf = specFolderName.split('/').filter(Boolean).pop() || specFolderName;
  const fileStem = path.basename(contextFilename, path.extname(contextFilename));
  const suffix = `[${specLeaf}/${fileStem}]`;

  if (memoryTitle.endsWith(suffix)) {
    return memoryTitle;
  }

  const maxLength = 120;
  const maxBaseLength = Math.max(24, maxLength - suffix.length - 1);
  let base = memoryTitle.trim();

  if (base.length > maxBaseLength) {
    const hardCut = base.slice(0, maxBaseLength).trim();
    const lastSpace = hardCut.lastIndexOf(' ');
    if (lastSpace >= Math.floor(maxBaseLength * 0.6)) {
      base = hardCut.slice(0, lastSpace);
    } else {
      base = hardCut;
    }
  }

  return `${base} ${suffix}`;
}

function extractSpecTitle(specFolderPath: string): string {
  try {
    const specPath = path.join(specFolderPath, 'spec.md');
    const content = fsSync.readFileSync(specPath, 'utf-8');
    const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!fmMatch) return '';
    const titleMatch = fmMatch[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (!titleMatch || !titleMatch[1]) return '';
    return normalizeSpecTitleForMemory(titleMatch[1]);
  } catch (_error: unknown) {
    if (_error instanceof Error) {
      void _error.message;
    }
    return '';
  }
}

type MemoryClassificationContext = {
  MEMORY_TYPE: string;
  HALF_LIFE_DAYS: number;
  BASE_DECAY_RATE: number;
  ACCESS_BOOST_FACTOR: number;
  RECENCY_WEIGHT: number;
  IMPORTANCE_MULTIPLIER: number;
};

type SessionDedupContext = {
  MEMORIES_SURFACED_COUNT: number;
  DEDUP_SAVINGS_TOKENS: number;
  FINGERPRINT_HASH: string;
  SIMILAR_MEMORIES: Array<{ MEMORY_ID: string; SIMILARITY_SCORE: number }>;
};

type CausalLinksContext = {
  CAUSED_BY: string[];
  SUPERSEDES: string[];
  DERIVED_FROM: string[];
  BLOCKS: string[];
  RELATED_TO: string[];
};

function isWithinDirectory(parentDir: string, candidatePath: string): boolean {
  return validateFilePath(candidatePath, [parentDir]) !== null;
}

function resolveTreeThinningContent(file: FileChange, specFolderPath: string): string {
  const rawPath = typeof file.FILE_PATH === 'string' ? file.FILE_PATH.trim() : '';
  if (rawPath.length === 0) {
    return file.DESCRIPTION || '';
  }

  const candidatePath = path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(specFolderPath, rawPath);

  if (!isWithinDirectory(path.resolve(specFolderPath), path.resolve(candidatePath))) {
    return file.DESCRIPTION || '';
  }

  try {
    const stat = fsSync.statSync(candidatePath);
    if (!stat.isFile()) {
      return file.DESCRIPTION || '';
    }

    return fsSync.readFileSync(candidatePath, 'utf8').slice(0, 500) || file.DESCRIPTION || '';
  } catch (_error: unknown) {
    return file.DESCRIPTION || '';
  }
}

function listSpecFolderKeyFiles(specFolderPath: string): Array<{ FILE_PATH: string }> {
  const collected: string[] = [];
  const ignoredDirs = new Set(['memory', 'scratch', '.git', 'node_modules']);

  const visit = (currentDir: string, relativeDir: string): void => {
    const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) {
          continue;
        }

        visit(path.join(currentDir, entry.name), path.join(relativeDir, entry.name));
        continue;
      }

      if (!entry.isFile() || !/\.(?:md|json)$/i.test(entry.name)) {
        continue;
      }

      collected.push(normalizeFilePath(path.join(relativeDir, entry.name)));
    }
  };

  try {
    visit(specFolderPath, '');
  } catch (_error: unknown) {
    return [];
  }

  return collected
    .sort((a, b) => a.localeCompare(b))
    .map((filePath) => ({ FILE_PATH: filePath }));
}

function buildKeyFiles(effectiveFiles: FileChange[], specFolderPath: string): Array<{ FILE_PATH: string }> {
  const explicitKeyFiles = effectiveFiles
    .filter((file) => !file.FILE_PATH.includes('(merged-small-files)'))
    .map((file) => ({ FILE_PATH: file.FILE_PATH }));

  if (explicitKeyFiles.length > 0) {
    return explicitKeyFiles;
  }

  return listSpecFolderKeyFiles(specFolderPath);
}

function readNamedObject(source: Record<string, unknown> | null | undefined, ...keys: string[]): Record<string, unknown> | null {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }

  return null;
}

function readStringArray(source: Record<string, unknown> | null | undefined, ...keys: string[]): string[] {
  if (!source) {
    return [];
  }

  for (const key of keys) {
    const value = source[key];
    if (Array.isArray(value)) {
      return value
        .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
        .filter(Boolean);
    }
  }

  return [];
}

function readNumber(source: Record<string, unknown> | null | undefined, fallback: number, ...keys: string[]): number {
  if (!source) {
    return fallback;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return fallback;
}

function readString(source: Record<string, unknown> | null | undefined, fallback: string, ...keys: string[]): string {
  if (!source) {
    return fallback;
  }

  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return fallback;
}

function inferMemoryType(contextType: string, importanceTier: string): string {
  if (importanceTier === 'constitutional') {
    return 'constitutional';
  }
  if (contextType === 'implementation') {
    return 'procedural';
  }
  if (contextType === 'decision' || contextType === 'research' || contextType === 'discovery') {
    return 'semantic';
  }
  return 'episodic';
}

function defaultHalfLifeDays(memoryType: string): number {
  switch (memoryType) {
    case 'constitutional':
      return 0;
    case 'procedural':
      return 180;
    case 'semantic':
      return 365;
    case 'episodic':
    default:
      return 30;
  }
}

function baseDecayRateFromHalfLife(halfLifeDays: number): number {
  if (halfLifeDays <= 0) {
    return 0;
  }

  return Number(Math.pow(0.5, 1 / halfLifeDays).toFixed(4));
}

function importanceMultiplier(importanceTier: string): number {
  switch (importanceTier) {
    case 'constitutional':
      return 2;
    case 'critical':
      return 1.6;
    case 'important':
      return 1.3;
    case 'temporary':
      return 0.6;
    case 'deprecated':
      return 0.2;
    case 'normal':
    default:
      return 1;
  }
}

function buildMemoryClassificationContext(
  collectedData: CollectedDataFull,
  sessionData: { CONTEXT_TYPE: string; IMPORTANCE_TIER: string },
): MemoryClassificationContext {
  const rawClassification = readNamedObject(collectedData, 'memory_classification', 'memoryClassification');
  const rawDecayFactors = readNamedObject(rawClassification, 'decay_factors', 'decayFactors');
  const fallbackType = inferMemoryType(sessionData.CONTEXT_TYPE, sessionData.IMPORTANCE_TIER);
  const memoryType = readString(
    rawClassification,
    readString(collectedData, fallbackType, 'memory_type', 'memoryType'),
    'memory_type',
    'memoryType',
  );
  const halfLifeDays = readNumber(
    rawClassification,
    defaultHalfLifeDays(memoryType),
    'half_life_days',
    'halfLifeDays',
  );

  return {
    MEMORY_TYPE: memoryType,
    HALF_LIFE_DAYS: halfLifeDays,
    BASE_DECAY_RATE: readNumber(
      rawDecayFactors || rawClassification,
      baseDecayRateFromHalfLife(halfLifeDays),
      'base_decay_rate',
      'baseDecayRate',
    ),
    ACCESS_BOOST_FACTOR: readNumber(
      rawDecayFactors || rawClassification,
      0.1,
      'access_boost_factor',
      'accessBoostFactor',
    ),
    RECENCY_WEIGHT: readNumber(
      rawDecayFactors || rawClassification,
      0.5,
      'recency_weight',
      'recencyWeight',
    ),
    IMPORTANCE_MULTIPLIER: readNumber(
      rawDecayFactors || rawClassification,
      importanceMultiplier(sessionData.IMPORTANCE_TIER),
      'importance_multiplier',
      'importanceMultiplier',
    ),
  };
}

function buildSessionDedupContext(
  collectedData: CollectedDataFull,
  sessionData: { SESSION_ID: string; SUMMARY: string },
  memoryTitle: string,
): SessionDedupContext {
  const rawDedup = readNamedObject(collectedData, 'session_dedup', 'sessionDedup');
  const rawSimilarMemories = rawDedup?.['similar_memories'] ?? rawDedup?.['similarMemories'];
  const similarMemories = Array.isArray(rawSimilarMemories)
    ? rawSimilarMemories.flatMap((entry) => {
      if (typeof entry === 'string' && entry.trim().length > 0) {
        return [{ MEMORY_ID: entry.trim(), SIMILARITY_SCORE: 0 }];
      }
      if (entry && typeof entry === 'object') {
        const item = entry as Record<string, unknown>;
        const memoryId = readString(item, '', 'id', 'memory_id', 'memoryId');
        if (memoryId.length === 0) {
          return [];
        }
        return [{
          MEMORY_ID: memoryId,
          SIMILARITY_SCORE: readNumber(item, 0, 'similarity', 'similarity_score', 'similarityScore'),
        }];
      }
      return [];
    })
    : [];
  const fallbackFingerprint = crypto
    .createHash('sha1')
    .update(`${sessionData.SESSION_ID}\n${memoryTitle}\n${sessionData.SUMMARY}`)
    .digest('hex');

  return {
    MEMORIES_SURFACED_COUNT: readNumber(
      rawDedup,
      similarMemories.length,
      'memories_surfaced',
      'memoriesSurfaced',
      'memories_surfaced_count',
      'memoriesSurfacedCount',
    ),
    DEDUP_SAVINGS_TOKENS: readNumber(
      rawDedup,
      0,
      'dedup_savings_tokens',
      'dedupSavingsTokens',
    ),
    FINGERPRINT_HASH: readString(
      rawDedup,
      fallbackFingerprint,
      'fingerprint_hash',
      'fingerprintHash',
    ),
    SIMILAR_MEMORIES: similarMemories,
  };
}

function buildCausalLinksContext(collectedData: CollectedDataFull): CausalLinksContext {
  const rawCausalLinks = readNamedObject(collectedData, 'causal_links', 'causalLinks');

  return {
    CAUSED_BY: readStringArray(rawCausalLinks, 'caused_by', 'causedBy'),
    SUPERSEDES: readStringArray(rawCausalLinks, 'supersedes'),
    DERIVED_FROM: readStringArray(rawCausalLinks, 'derived_from', 'derivedFrom'),
    BLOCKS: readStringArray(rawCausalLinks, 'blocks'),
    RELATED_TO: readStringArray(rawCausalLinks, 'related_to', 'relatedTo'),
  };
}

let workflowRunQueue: Promise<void> = Promise.resolve();

async function withWorkflowRunLock<TResult>(operation: () => Promise<TResult>): Promise<TResult> {
  const priorRun = workflowRunQueue;
  let releaseCurrentRun: () => void = () => undefined;
  workflowRunQueue = new Promise<void>((resolve) => {
    releaseCurrentRun = resolve;
  });

  await priorRun;

  try {
    return await operation();
  } finally {
    releaseCurrentRun();
  }
}

function injectQualityMetadata(content: string, qualityScore: number, qualityFlags: string[]): string {
  // F-21: Require `---` at string start for strict frontmatter detection
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch || frontmatterMatch.index === undefined) {
    return content;
  }

  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const frontmatterLines = frontmatterMatch[1].split(/\r?\n/);
  const strippedLines: string[] = [];
  let skippingQualityFlags = false;

  for (const line of frontmatterLines) {
    const trimmed = line.trimStart();
    if (skippingQualityFlags) {
      if (/^\s*-\s+/.test(line) || line.trim() === '') {
        continue;
      }
      skippingQualityFlags = false;
    }

    if (/^quality_score\s*:/i.test(trimmed)) {
      continue;
    }

    if (/^quality_flags\s*:/i.test(trimmed)) {
      skippingQualityFlags = true;
      continue;
    }

    strippedLines.push(line);
  }

  const qualityLines = [
    `quality_score: ${qualityScore.toFixed(2)}`,
    ...(qualityFlags.length > 0
      ? ['quality_flags:', ...qualityFlags.map((flag) => `  - ${JSON.stringify(flag)}`)]
      : ['quality_flags: []']),
  ];
  const updatedFrontmatter = [
    '---',
    ...strippedLines,
    ...qualityLines,
    '---',
  ].join(newline);
  const prefix = content.slice(0, frontmatterMatch.index);
  const suffix = content.slice(frontmatterMatch.index + frontmatterMatch[0].length).replace(/^\r?\n/, '');
  return `${updatedFrontmatter}${newline}${prefix}${suffix}`;
}

function injectSpecDocHealthMetadata(content: string, health: SpecDocHealthResult): string {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch || frontmatterMatch.index === undefined) return content;

  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = frontmatterMatch[1].split(/\r?\n/);

  // Remove existing spec_folder_health lines
  const filtered = lines.filter(l => !l.trimStart().startsWith('spec_folder_health'));
  const healthLine = `spec_folder_health: ${JSON.stringify({ pass: health.pass, score: health.score, errors: health.errors, warnings: health.warnings })}`;
  filtered.push(healthLine);

  const updated = ['---', ...filtered, '---'].join(newline);
  const prefix = content.slice(0, frontmatterMatch.index);
  const suffix = content.slice(frontmatterMatch.index + frontmatterMatch[0].length).replace(/^\r?\n/, '');
  return `${updated}${newline}${prefix}${suffix}`;
}

function extractAnchorIds(content: string): string[] {
  const matches = content.matchAll(/<!--\s*(?:\/)?ANCHOR:\s*([a-zA-Z0-9][a-zA-Z0-9-]*)\s*-->/g);
  return Array.from(new Set(Array.from(matches, (match) => match[1])));
}

function normalizeEvidenceLine(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (value && typeof value === 'object' && typeof (value as { text?: unknown }).text === 'string') {
    return String((value as { text?: unknown }).text).trim();
  }

  return '';
}

type WorkflowObservationEvidence = {
  TITLE?: string;
  title?: string;
  NARRATIVE?: string;
  narrative?: string;
  FACTS?: unknown[];
  facts?: unknown[];
  _synthetic?: boolean;
  _provenance?: string;
  _specRelevant?: boolean;
};

type WorkflowDecisionEvidence = {
  TITLE?: string;
  CHOSEN?: string;
  RATIONALE?: string;
  CONTEXT?: string;
};

type WorkflowOutcomeEvidence = {
  OUTCOME?: string;
};

function buildWorkflowMemoryEvidenceSnapshot(params: {
  title: string;
  content: string;
  triggerPhrases: string[];
  files: FileChange[];
  observations: WorkflowObservationEvidence[];
  decisions: WorkflowDecisionEvidence[];
  outcomes: WorkflowOutcomeEvidence[];
  nextAction?: string;
  blockers?: string;
  recentContext?: Array<{ request?: string; learning?: string }>;
}): MemoryEvidenceSnapshot {
  const {
    title,
    content,
    triggerPhrases,
    files,
    observations,
    decisions,
    outcomes,
    nextAction,
    blockers,
    recentContext,
  } = params;

  const meaningfulBlockers = typeof blockers === 'string'
    && blockers.trim().length > 0
    && !/^none$/i.test(blockers.trim())
    ? [blockers.trim()]
    : [];

  return {
    title,
    content,
    triggerPhrases,
    files: files.map((file) => ({
      path: file.FILE_PATH,
      description: file.DESCRIPTION,
      specRelevant: true,
    })),
    observations: observations.map((observation) => ({
      title: typeof observation.TITLE === 'string'
        ? observation.TITLE
        : (typeof observation.title === 'string' ? observation.title : ''),
      narrative: typeof observation.NARRATIVE === 'string'
        ? observation.NARRATIVE
        : (typeof observation.narrative === 'string' ? observation.narrative : ''),
      facts: Array.isArray(observation.FACTS)
        ? observation.FACTS.map(normalizeEvidenceLine).filter(Boolean)
        : (Array.isArray(observation.facts) ? observation.facts.map(normalizeEvidenceLine).filter(Boolean) : []),
      synthetic: observation._synthetic === true,
      provenance: typeof observation._provenance === 'string' ? observation._provenance : undefined,
      specRelevant: observation._specRelevant !== false,
    })),
    decisions: decisions.map((decision) => (
      [
        typeof decision.TITLE === 'string' ? decision.TITLE : '',
        typeof decision.CHOSEN === 'string' ? decision.CHOSEN : '',
        typeof decision.RATIONALE === 'string' ? decision.RATIONALE : '',
        typeof decision.CONTEXT === 'string' ? decision.CONTEXT : '',
      ].filter(Boolean).join(' ')
    )).filter(Boolean),
    nextActions: typeof nextAction === 'string' && nextAction.trim().length > 0 ? [nextAction.trim()] : [],
    blockers: meaningfulBlockers,
    outcomes: outcomes
      .map((outcome) => (typeof outcome.OUTCOME === 'string' ? outcome.OUTCOME.trim() : ''))
      .filter(Boolean),
    recentContext: (recentContext || []).map((context) => ({
      request: context.request,
      learning: context.learning,
    })),
    anchors: extractAnchorIds(content),
  };
}

function formatSufficiencyAbort(result: MemorySufficiencyResult): string {
  return `${MEMORY_SUFFICIENCY_REJECTION_CODE}: Not enough context for a proper memory. `
    + `${result.reasons.join(' ')} `
    + `Evidence counts: primary=${result.evidenceCounts.primary}, `
    + `support=${result.evidenceCounts.support}, total=${result.evidenceCounts.total}, `
    + `semanticChars=${result.evidenceCounts.semanticChars}, uniqueWords=${result.evidenceCounts.uniqueWords}.`;
}

async function enrichStatelessData(
  collectedData: CollectedDataFull,
  specFolder: string,
  projectRoot: string
): Promise<CollectedDataFull> {
  // Only enrich stateless mode — file-backed JSON is authoritative
  if (collectedData._source === 'file') return collectedData;

  const enriched: CollectedDataFull = { ...collectedData };

  try {
    // Run spec-folder and git extraction in parallel
    const [specContext, gitContext] = await Promise.all([
      extractSpecFolderContext(specFolder).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[workflow] enrichment degraded: ${msg}`);
        return null;
      }),
      extractGitContext(projectRoot, specFolder).catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[workflow] enrichment degraded: ${msg}`);
        return null;
      }),
    ]);

    // Merge spec-folder observations (provenance-tagged, won't conflict with live data)
    if (specContext) {
      const existingObs = enriched.observations || [];
      enriched.observations = [
        ...existingObs,
        ...specContext.observations,
      ];

      // Merge FILES (deduplicate by path, prefer existing descriptions)
      const existingFiles = enriched.FILES || [];
      const existingPaths = new Set(
        existingFiles.map((f) => (f.FILE_PATH || f.path || '').toLowerCase())
      );
      const newFiles = specContext.FILES.filter(
        (f) => !existingPaths.has(f.FILE_PATH.toLowerCase())
      );
      enriched.FILES = [...existingFiles, ...newFiles];

      // Merge trigger phrases
      if (specContext.triggerPhrases.length > 0) {
        enriched._manualTriggerPhrases = [
          ...(enriched._manualTriggerPhrases || []),
          ...specContext.triggerPhrases,
        ];
      }

      // Merge decisions
      if (specContext.decisions.length > 0) {
        enriched._manualDecisions = [
          ...(enriched._manualDecisions || []),
          ...specContext.decisions,
        ];
      }

      // Use spec summary if collectedData summary is missing or generic
      if (specContext.summary && (!enriched.SUMMARY || enriched.SUMMARY === 'Development session')) {
        enriched.SUMMARY = specContext.summary;
      }

      // Merge recentContext
      if (specContext.recentContext.length > 0) {
        enriched.recentContext = [
          ...(enriched.recentContext || []),
          ...specContext.recentContext,
        ];
      }
    }

    // Merge git context
    if (gitContext) {
      const existingObs = enriched.observations || [];
      enriched.observations = [
        ...existingObs,
        ...gitContext.observations,
      ];

      // Merge FILES (deduplicate by path)
      const existingFiles = enriched.FILES || [];
      const existingPaths = new Set(
        existingFiles.map((f) => (f.FILE_PATH || f.path || '').toLowerCase())
      );
      const newFiles = gitContext.FILES.filter(
        (f) => !existingPaths.has(f.FILE_PATH.toLowerCase())
      );
      enriched.FILES = [...existingFiles, ...newFiles];

      // Append git summary to existing summary
      if (gitContext.summary) {
        const existing = enriched.SUMMARY || '';
        enriched.SUMMARY = existing
          ? `${existing}. Git: ${gitContext.summary}`
          : gitContext.summary;
      }

      // Propagate git provenance metadata for template rendering (M-007d)
      enriched.headRef = gitContext.headRef;
      enriched.commitRef = gitContext.commitRef;
      enriched.repositoryState = gitContext.repositoryState;
      enriched.isDetachedHead = gitContext.isDetachedHead;
    }

    const narrativeObservations = (enriched.observations || []).filter(
      (observation) => observation?._synthetic !== true
    );
    // Synthetic observations provide file coverage but do not influence session narrative
    enriched._narrativeObservations = narrativeObservations;

  } catch (err: unknown) {
    // Enrichment failure is non-fatal — proceed with whatever data we have
    console.warn(`   Warning: Stateless enrichment failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  return enriched;
}

// ───────────────────────────────────────────────────────────────
// 2. MAIN WORKFLOW
// ───────────────────────────────────────────────────────────────

/**
 * Main workflow orchestrator: coordinates data loading, extraction, rendering,
 * quality scoring, and atomic file output to produce a memory context file.
 *
 * @param options - Configuration controlling data source, spec folder, and output behavior.
 * @returns A WorkflowResult describing the output files, resolved spec folder, and stats.
 */
async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
  return withWorkflowRunLock(async () => {
    const {
      dataFile,
      specFolderArg,
      collectedData: preloadedData,
      loadDataFn,
      collectSessionDataFn,
      silent = false
    } = options;

    const hasDirectDataContext = (
      dataFile !== undefined ||
      preloadedData !== undefined ||
      loadDataFn !== undefined
    );
    const activeDataFile = dataFile ?? (hasDirectDataContext ? null : CONFIG.DATA_FILE);
    const activeSpecFolderArg = specFolderArg ?? (hasDirectDataContext ? null : CONFIG.SPEC_FOLDER_ARG);


    const log = silent ? (): void => {} : console.log.bind(console);
    const warn = silent ? (): void => {} : console.warn.bind(console);

    log('Starting memory skill workflow...\n');
    // Step 1: Load collected data
    log('Step 1: Loading collected data...');

    let collectedData: CollectedDataFull | null;
    if (preloadedData) {
      collectedData = preloadedData;
      log('   Using pre-loaded data');
    } else if (loadDataFn) {
      // F-22: Guard loadDataFn result with explicit null check
      collectedData = (await loadDataFn()) || null;
      log('   Loaded via custom function');
    } else {
      collectedData = await loadCollectedDataFromLoader({ dataFile: activeDataFile, specFolderArg: activeSpecFolderArg });
      log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
    }

    if (!collectedData) {
      throw new Error('No data available - provide dataFile, collectedData, or loadDataFn');
    }

    // Step 1.5: Stateless mode alignment check
    // When no JSON data file was provided, data comes from the active OpenCode session.
    // Verify the captured content relates to the target spec folder to prevent
    // Cross-spec contamination (e.g., session working on spec A saved to spec B).
    const isStatelessMode = !activeDataFile && !preloadedData;
    if (isStatelessMode && activeSpecFolderArg && (collectedData.observations || collectedData.FILES)) {
      const alignmentTargets = await resolveAlignmentTargets(activeSpecFolderArg);
      const specAffinityTargets = buildSpecAffinityTargets(activeSpecFolderArg);
      const specAffinity = evaluateCollectedDataSpecAffinity(collectedData, specAffinityTargets);

      if (!specAffinity.hasAnchor) {
        // Q1: Downgrade Block A from hard abort to warning when spec folder was explicitly
        // provided via CLI argument. The user's explicit intent overrides the anchor check.
        // Blocks B and C (file-path overlap) remain as hard blocks for safety.
        const alignMsg = `ALIGNMENT_WARNING: Captured stateless content matched the workspace but not the target spec folder "${activeSpecFolderArg}". ` +
          `No spec-specific anchors were found beyond workspace identity (matched files: ${specAffinity.matchedFileTargets.length}, ` +
          `matched phrases: ${specAffinity.matchedPhrases.length}, matched spec id: ${specAffinity.matchedSpecId ? 'yes' : 'no'}). ` +
          `Proceeding because spec folder was explicitly provided via CLI argument.`;
        warn(`   ${alignMsg}`);
      }

      const allFilePaths = (collectedData.observations || [])
        .flatMap((obs: { files?: string[] }) => obs.files || [])
        .concat((collectedData.FILES || []).map((f: { FILE_PATH?: string; path?: string }) => f.FILE_PATH || f.path || ''));

      const totalPaths = allFilePaths.length;
      if (totalPaths > 0 && (alignmentTargets.keywordTargets.length > 0 || alignmentTargets.fileTargets.length > 0)) {
        const relevantPaths = allFilePaths.filter((fp: string) => {
          return matchesAlignmentTarget(fp, alignmentTargets);
        });
        const overlapRatio = relevantPaths.length / totalPaths;
        // RC-4: Raised from 0.05 to 0.15 — 5% threshold let mostly-foreign content through
        if (overlapRatio < 0.15) {
          const alignMsg = `ALIGNMENT_BLOCK: Only ${(overlapRatio * 100).toFixed(0)}% of captured file paths relate to spec folder "${activeSpecFolderArg}". ` +
            `The active session appears to be working on a different task (alignment keywords: [${alignmentTargets.keywordTargets.join(', ')}], ` +
            `total paths: ${totalPaths}, matching: ${relevantPaths.length}). ` +
            `Aborting to prevent cross-spec contamination. To force, pass data via JSON file.`;
          warn(`   ${alignMsg}`);
          throw new Error(alignMsg);
        }
      }
    }
    log();

    // Step 2: Detect spec folder with context alignment
    log('Step 2: Detecting spec folder...');
    const specFolder: string = await detectSpecFolder(collectedData, {
      specFolderArg: activeSpecFolderArg,
    });
    const specsDir: string = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
    const normalizedSpecFolder = path.resolve(specFolder).replace(/\\/g, '/');
    const candidateSpecsDirs = Array.from(new Set([
      specsDir,
      ...getSpecsDirectories(),
      path.join(CONFIG.PROJECT_ROOT, 'specs'),
      path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
    ]));

    let specFolderName = '';
    for (const candidateRoot of candidateSpecsDirs) {
      const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
      const relative = path.relative(normalizedRoot, normalizedSpecFolder).replace(/\\/g, '/');
      if (
        relative &&
        relative !== '.' &&
        relative !== '..' &&
        !relative.startsWith('../') &&
        !path.isAbsolute(relative)
      ) {
        specFolderName = relative;
        break;
      }
    }

    if (!specFolderName) {
      const marker = '/specs/';
      const markerIndex = normalizedSpecFolder.lastIndexOf(marker);
      specFolderName = markerIndex >= 0
        ? normalizedSpecFolder.slice(markerIndex + marker.length)
        : path.basename(normalizedSpecFolder);
    }
    log(`   Using: ${specFolder}\n`);

    // Step 3: Setup context directory
    log('Step 3: Setting up context directory...');
    const contextDir: string = await setupContextDirectory(specFolder);
    log(`   Created: ${contextDir}\n`);

    // F-23: Define contamination cleaning functions before enrichment
    let hadContamination = false;
    let contaminationMaxSeverity: ContaminationSeverity | null = null;
    const contaminationAuditTrail: ContaminationAuditRecord[] = [];
    const extractorPatternCounts = new Map<string, number>();
    let extractorProcessedFieldCount = 0;
    let extractorCleanedFieldCount = 0;
    let extractorRemovedPhraseCount = 0;
    const cleanContaminationText = (input: string): string => {
      extractorProcessedFieldCount++;
      const filtered = filterContamination(input);
      if (filtered.hadContamination) {
        hadContamination = true;
        extractorCleanedFieldCount++;
        extractorRemovedPhraseCount += filtered.removedPhrases.length;
        if (filtered.maxSeverity !== null) {
          if (contaminationMaxSeverity === null || SEVERITY_RANK[filtered.maxSeverity] > SEVERITY_RANK[contaminationMaxSeverity]) {
            contaminationMaxSeverity = filtered.maxSeverity;
          }
        }
        for (const label of filtered.matchedPatterns) {
          extractorPatternCounts.set(label, (extractorPatternCounts.get(label) ?? 0) + 1);
        }
      }
      return escapeLiteralAnchorExamples(filtered.cleanedText);
    };
    const cleanObservations = (
      observations: CollectedDataFull['observations'] | undefined
    ): CollectedDataFull['observations'] | undefined => {
      if (!observations) {
        return observations;
      }
      // F-23: Clean ALL observations, not just provenanced ones
      return observations.map((observation) => {
        if (!observation) {
          return observation;
        }
        return {
          ...observation,
          title: observation.title ? cleanContaminationText(observation.title) : observation.title,
          narrative: observation.narrative ? cleanContaminationText(observation.narrative) : observation.narrative,
          facts: observation.facts?.map((fact) => (
            typeof fact === 'string'
              ? cleanContaminationText(fact)
              : {
                ...fact,
                text: typeof fact.text === 'string' ? cleanContaminationText(fact.text) : fact.text
              }
          )),
        };
      });
    };

    // F-23: Pre-enrichment contamination cleaning pass
    {
      const preCleanedObservations = cleanObservations(collectedData.observations);
      const preCleanedSummary = (typeof collectedData.SUMMARY === 'string' && collectedData.SUMMARY.length > 0)
        ? cleanContaminationText(collectedData.SUMMARY) : collectedData.SUMMARY;
      collectedData = { ...collectedData, observations: preCleanedObservations, SUMMARY: preCleanedSummary };
      const extractorAudit: ContaminationAuditRecord = {
        stage: 'extractor-scrub',
        timestamp: new Date().toISOString(),
        patternsChecked: getContaminationPatternLabels(),
        matchesFound: summarizeAuditCounts(extractorPatternCounts),
        actionsTaken: [
          `cleaned_fields:${extractorCleanedFieldCount}`,
          `removed_phrases:${extractorRemovedPhraseCount}`,
        ],
        passedThrough: [
          `processed_fields:${extractorProcessedFieldCount}`,
        ],
      };
      contaminationAuditTrail.push(extractorAudit);
      structuredLog('info', 'contamination_audit', extractorAudit);

      // Count-based severity escalation: mass low-severity matches indicate
      // pervasive contamination that warrants a higher penalty
      if (hadContamination && contaminationMaxSeverity === 'low' && extractorRemovedPhraseCount >= 10) {
        contaminationMaxSeverity = 'medium';
      }
    }

    // Step 3.5: Enrich stateless data with spec folder and git context
    if (isStatelessMode) {
      log('Step 3.5: Enriching stateless data...');
      collectedData = await enrichStatelessData(collectedData, specFolder, CONFIG.PROJECT_ROOT);
      log('   Enrichment complete');

      // RC-4: Post-enrichment alignment re-check — enrichment can introduce
      // New foreign content (e.g., git context from other spec folders).
      // Re-verify alignment at a lower threshold (10%) to catch this.
      // Uses resolved specFolder (not raw activeSpecFolderArg) for accurate keyword matching.
      if (specFolder && (collectedData.observations || collectedData.FILES)) {
        const alignmentTargetsPost = await resolveAlignmentTargets(specFolder);

        const allFilePathsPost = (collectedData.observations || [])
          .flatMap((obs: { files?: string[] }) => obs.files || [])
          .concat((collectedData.FILES || []).map((f: { FILE_PATH?: string; path?: string }) => f.FILE_PATH || f.path || ''));

        const totalPathsPost = allFilePathsPost.length;
        if (totalPathsPost > 0 && (alignmentTargetsPost.keywordTargets.length > 0 || alignmentTargetsPost.fileTargets.length > 0)) {
          const relevantPathsPost = allFilePathsPost.filter((fp: string) => {
            return matchesAlignmentTarget(fp, alignmentTargetsPost);
          });
          const overlapRatioPost = relevantPathsPost.length / totalPathsPost;
          if (overlapRatioPost < 0.10) {
            const postAlignMsg = `POST_ENRICHMENT_ALIGNMENT_BLOCK: After enrichment, only ${(overlapRatioPost * 100).toFixed(0)}% of file paths relate to spec folder "${specFolder}". ` +
              `Enrichment may have introduced cross-spec contamination (alignment keywords: [${alignmentTargetsPost.keywordTargets.join(', ')}], ` +
              `total paths: ${totalPathsPost}, matching: ${relevantPathsPost.length}). Aborting.`;
            warn(`   ${postAlignMsg}`);
            throw new Error(postAlignMsg);
          }
        }
      }
      log();
    }

    // Clean FILE descriptions that may contain contamination from git commit subjects
    if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
      const preFileCleanedCount = extractorCleanedFieldCount;
      const preFileRemovedCount = extractorRemovedPhraseCount;
      const filesList = collectedData.FILES;
      collectedData = {
        ...collectedData,
        FILES: filesList.map((file) => ({
          ...file,
          DESCRIPTION: file.DESCRIPTION ? cleanContaminationText(file.DESCRIPTION) : file.DESCRIPTION,
        })),
      };
      const fileDescCleanedCount = extractorCleanedFieldCount - preFileCleanedCount;
      const fileDescRemovedCount = extractorRemovedPhraseCount - preFileRemovedCount;
      if (fileDescCleanedCount > 0) {
        const fileDescAudit: ContaminationAuditRecord = {
          stage: 'extractor-scrub',
          timestamp: new Date().toISOString(),
          patternsChecked: getContaminationPatternLabels(),
          matchesFound: summarizeAuditCounts(extractorPatternCounts),
          actionsTaken: [
            `file_desc_cleaned:${fileDescCleanedCount}`,
            `file_desc_removed_phrases:${fileDescRemovedCount}`,
          ],
          passedThrough: [
            `total_files:${filesList.length}`,
          ],
        };
        contaminationAuditTrail.push(fileDescAudit);
        structuredLog('info', 'contamination_audit', fileDescAudit);
      }
    }

    // Steps 4-7: Parallel data extraction
    log('Steps 4-7: Extracting data (parallel execution)...\n');

    const sessionDataFn = collectSessionDataFn || collectSessionData;
    if (!sessionDataFn) {
      throw new Error(
        'Missing session data collector function.\n' +
        '  - If calling runWorkflow() directly, pass { collectSessionDataFn: yourFunction } in options\n' +
        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
      );
    }

    const rawUserPrompts = collectedData?.userPrompts || [];
    const collectedDataWithNarrative = collectedData as CollectedDataFull & {
      _narrativeObservations?: CollectedDataFull['observations'];
    };

    const filteredUserPrompts = rawUserPrompts.map((message) => {
      const cleanedPrompt = cleanContaminationText(message.prompt || '');
      return {
        ...message,
        prompt: cleanedPrompt,
      };
    });

    const filteredSummary = (
      typeof collectedData.SUMMARY === 'string' && collectedData.SUMMARY.length > 0
    )
      ? cleanContaminationText(collectedData.SUMMARY)
      : collectedData.SUMMARY;
    const filteredObservations = cleanObservations(collectedData.observations);
    const filteredNarrativeObservations = cleanObservations(
      collectedDataWithNarrative._narrativeObservations,
    );
    collectedData = {
      ...collectedData,
      userPrompts: filteredUserPrompts,
      SUMMARY: filteredSummary,
      observations: filteredObservations,
      // P0-1: Force CLI-resolved spec folder into collectedData so all parallel
      // extractors (decisions, diagrams, conversations) see the authoritative value
      SPEC_FOLDER: specFolderName || collectedData.SPEC_FOLDER,
    };
    collectedDataWithNarrative._narrativeObservations = filteredNarrativeObservations;

    const narrativeObservations = Array.isArray(
      filteredNarrativeObservations
    )
      ? filteredNarrativeObservations || []
      : (collectedData.observations || []);
    const narrativeCollectedData: CollectedDataFull = {
      ...collectedData,
      observations: narrativeObservations,
    };

    const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
    (async () => {
      log('   Collecting session data...');
      const result = await sessionDataFn(narrativeCollectedData, specFolderName);
      log('   Session data collected');
      return result;
    })(),
    (async () => {
      log('   Extracting conversations...');
      const result = await extractConversations(collectedData as Parameters<typeof extractConversations>[0]);
      log(`   Found ${result.MESSAGES.length} messages`);
      return result;
    })(),
    (async () => {
      log('   Extracting decisions...');
      const result = await extractDecisions(collectedData as Parameters<typeof extractDecisions>[0]);
      log(`   Found ${result.DECISIONS.length} decisions`);
      return result;
    })(),
    (async () => {
      log('   Extracting diagrams...');
      const result = await extractDiagrams(collectedData as Parameters<typeof extractDiagrams>[0]);
      log(`   Found ${result.DIAGRAMS.length} diagrams`);
      return result;
    })(),
    (async () => {
      log('   Generating workflow flowchart...');
      const phases = extractPhasesFromData(narrativeCollectedData as Parameters<typeof extractPhasesFromData>[0]);
      const patternType: string = flowchartGen.detectWorkflowPattern(phases);
      const phaseDetails = flowchartGen.buildPhaseDetails(phases);
      const features = flowchartGen.extractFlowchartFeatures(phases, patternType);
      const useCases = flowchartGen.getPatternUseCases(patternType);
      const useCaseTitle = specFolderName.replace(/^\d+-/, '').replace(/-/g, ' ');

      log(`   Workflow data generated (${patternType})`);
      return {
        WORKFLOW_FLOWCHART: flowchartGen.generateWorkflowFlowchart(phases),
        HAS_WORKFLOW_DIAGRAM: false,
        PATTERN_TYPE: patternType.charAt(0).toUpperCase() + patternType.slice(1),
        PATTERN_LINEAR: patternType === 'linear',
        PATTERN_PARALLEL: patternType === 'parallel',
        PHASES: phaseDetails,
        HAS_PHASES: phaseDetails.length > 0,
        USE_CASE_TITLE: useCaseTitle,
        FEATURES: features,
        USE_CASES: useCases
      };
    })()
  ]);
    log('\n   All extraction complete (parallel execution)\n');

  // Patch TOOL_COUNT for enriched stateless saves so V7 does not flag
  // Synthetic file paths as contradictory with zero tool usage.
  // RC-9 fix: Guard against NaN/undefined TOOL_COUNT before any comparison.
  if (!Number.isFinite(sessionData.TOOL_COUNT)) {
    sessionData.TOOL_COUNT = 0;
  }
  const enrichedFileCount = collectedData.FILES?.length ?? 0;
  const captureToolEvidenceCount = typeof collectedData._toolCallCount === 'number'
    && Number.isFinite(collectedData._toolCallCount)
    ? collectedData._toolCallCount
    : 0;
  const inferredToolCount = Math.max(enrichedFileCount, captureToolEvidenceCount);
  if (isStatelessMode && sessionData.TOOL_COUNT === 0 && inferredToolCount > 0) {
    sessionData.TOOL_COUNT = inferredToolCount;
  }

  // Step 7.5: Generate semantic implementation summary
  log('Step 7.5: Generating semantic summary...');

  const allMessages = (collectedData?.userPrompts || []).map((m) => {
    const cleanedPrompt = m.prompt || '';
    return {
      prompt: cleanedPrompt,
      content: cleanedPrompt,
      timestamp: m.timestamp
    };
  });

  // Run content through filter pipeline for quality scoring
  const filterPipeline = createFilterPipeline();
  const filteredMessages = filterPipeline.filter(allMessages);
  const normalizedMessages = filteredMessages.map((message) => {
    const prompt = typeof message.prompt === 'string'
      ? message.prompt
      : (typeof message.content === 'string' ? message.content : '');
    return {
      prompt,
      content: typeof message.content === 'string' ? message.content : prompt,
      timestamp: typeof message.timestamp === 'string' ? message.timestamp : undefined,
    };
  });
  const filterStats: FilterStats = filterPipeline.getStats();
  contaminationAuditTrail.push(...filterStats.contaminationAudit);

  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
  if (filterPipeline.isLowQuality()) {
    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
  }

  const implSummary = generateImplementationSummary(
    normalizedMessages,
    (collectedData?.observations || []) as Parameters<typeof generateImplementationSummary>[1]
  );

  const semanticFileChanges: Map<string, SemanticFileInfo> = extractFileChanges(
    normalizedMessages,
    (collectedData?.observations || []) as Parameters<typeof extractFileChanges>[1]
  );
  const enhancedFiles: FileChange[] = enhanceFilesWithSemanticDescriptions(
    sessionData.FILES || [],
    semanticFileChanges
  );

  const IMPL_SUMMARY_MD: string = formatSummaryAsMarkdown(implSummary);
  const HAS_IMPL: boolean = implSummary.filesCreated.length > 0 ||
                   implSummary.filesModified.length > 0 ||
                   implSummary.decisions.length > 0;

  log(`   Generated summary: ${implSummary.filesCreated.length} created, ${implSummary.filesModified.length} modified, ${implSummary.decisions.length} decisions\n`);

  // Step 7.6: Tree thinning — pre-pipeline token reduction
  // Operates on spec folder files BEFORE pipeline stages and scoring.
  // Bottom-up merging of small files reduces token overhead in the retrieval pipeline.
  log('Step 7.6: Applying tree thinning...');
  const thinFileInputs: ThinningFileEntry[] = enhancedFiles.map((f) => ({
    path: f.FILE_PATH,
    content: resolveTreeThinningContent(f, specFolder),
  }));
  const thinningResult = applyTreeThinning(thinFileInputs);
  const effectiveFiles = applyThinningToFileChanges(enhancedFiles, thinningResult);
  const fileRowsReduced = Math.max(0, enhancedFiles.length - effectiveFiles.length);
  log(`   Tree thinning: ${thinningResult.stats.totalFiles} files, ` +
      `${thinningResult.stats.thinnedCount} content-as-summary, ` +
      `${thinningResult.stats.mergedCount} merged-into-parent, ` +
      `~${thinningResult.stats.tokensSaved} tokens saved, ` +
      `${fileRowsReduced} rendered rows reduced\n`);

  // Step 8: Populate templates
  log('Step 8: Populating template...');

  const specFolderBasename: string = path.basename(sessionData.SPEC_FOLDER || specFolderName);
  const folderBase: string = specFolderBasename.replace(/^\d+-/, '');

    let enrichedTask = implSummary.task;
    const dataSource = typeof collectedData?._source === 'string' ? collectedData._source : null;
    const specTitle = extractSpecTitle(specFolder);
    const allowSpecTitleFallback = shouldEnrichTaskFromSpecTitle(
      enrichedTask,
      dataSource,
      activeDataFile
    );

    if (allowSpecTitleFallback) {
      if (specTitle.length >= 8) {
        enrichedTask = specTitle;
        log(`   Enriched task from spec.md: "${enrichedTask}"`);
      }
    }

  const preferredMemoryTask = pickPreferredMemoryTask(
    enrichedTask || '',
    specTitle,
    folderBase,
    [
      sessionData.QUICK_SUMMARY || '',
      sessionData.TITLE || '',
      sessionData.SUMMARY || '',
    ],
    allowSpecTitleFallback
  );
  // F-26: Load description.json to include memoryNameHistory in slug candidates
  let memoryNameHistoryForSlug: readonly string[] = [];
  try {
    const { loadPerFolderDescription: loadPFDForSlug } = await import(
      '@spec-kit/mcp-server/lib/search/folder-discovery'
    );
    const pfDesc = loadPFDForSlug(path.resolve(specFolder));
    if (pfDesc?.memoryNameHistory) {
      memoryNameHistoryForSlug = pfDesc.memoryNameHistory;
    }
  } catch (_error: unknown) { /* Expected: description.json may not exist yet, or mcp_server module unavailable */ }
  const contentSlug: string = generateContentSlug(preferredMemoryTask, folderBase, memoryNameHistoryForSlug);
  const rawCtxFilename: string = `${sessionData.DATE}_${sessionData.TIME}__${contentSlug}.md`;
  const ctxFilename: string = ensureUniqueMemoryFilename(contextDir, rawCtxFilename);

  const keyTopicsInitial: string[] = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS, specFolderName);
  const keyTopics: string[] = ensureMinSemanticTopics(keyTopicsInitial, effectiveFiles, specFolderName);
  const memoryTitle = buildMemoryTitle(preferredMemoryTask, specFolderName, sessionData.DATE, contentSlug);
  // Keep dashboard titles stable across duplicate-save retries so content dedup
  // compares the rendered memory itself, not a collision suffix.
  const memoryDashboardTitle = buildMemoryDashboardTitle(memoryTitle, specFolderName, rawCtxFilename);
  const memoryDescription = deriveMemoryDescription({
    summary: sessionData.SUMMARY,
    title: memoryTitle,
  });

  // Pre-extract trigger phrases for template embedding AND later indexing
  let preExtractedTriggers: string[] = [];
  try {
    // Build enriched text for trigger extraction from semantic session content only.
    const triggerSourceParts: string[] = [];
    if (sessionData.SUMMARY && sessionData.SUMMARY.length > 20) {
      triggerSourceParts.push(sessionData.SUMMARY);
    }
    decisions.DECISIONS.forEach((d: DecisionForTopics & { CONTEXT?: string; CHOSEN?: string }) => {
      if (d.TITLE) triggerSourceParts.push(d.TITLE);
      if (d.RATIONALE) triggerSourceParts.push(d.RATIONALE);
      if (d.CONTEXT) triggerSourceParts.push(d.CONTEXT);
      if (d.CHOSEN) triggerSourceParts.push(d.CHOSEN);
    });
    effectiveFiles.forEach(f => {
      if (f._synthetic) {
        return;
      }
      if (f.DESCRIPTION && !f.DESCRIPTION.includes('pending')) triggerSourceParts.push(f.DESCRIPTION);
    });
    // Add spec folder name tokens as trigger source
    const folderNameForTriggers = specFolderName.replace(/^\d{1,3}-/, '').replace(/-/g, ' ');
    triggerSourceParts.push(folderNameForTriggers);

    const triggerSource = triggerSourceParts.join('\n');
    preExtractedTriggers = extractTriggerPhrases(triggerSource);

    // Also add spec folder name-derived phrases if not already present
    const folderTokens = folderNameForTriggers.split(/\s+/).filter(t => t.length >= 3);
    const existingLower = new Set(preExtractedTriggers.map(p => p.toLowerCase()));
    if (folderNameForTriggers.length >= 5 && !existingLower.has(folderNameForTriggers.toLowerCase())) {
      preExtractedTriggers.unshift(folderNameForTriggers.toLowerCase());
    }
    // CG-04: Domain-specific stopwords for single-word trigger phrases from folder names
    const FOLDER_STOPWORDS = new Set([
      'system', 'spec', 'kit', 'hybrid', 'rag', 'fusion', 'agents', 'alignment',
      'opencode', 'config', 'setup', 'init', 'core', 'main', 'base', 'common',
      'shared', 'utils', 'helpers', 'tools', 'scripts', 'tests', 'docs', 'build',
      'deploy', 'release', 'version', 'update', 'fix', 'feature', 'enhancement',
      'refactor', 'cleanup', 'migration', 'integration', 'implementation',
      'based', 'features', 'perfect', 'session', 'capturing', 'pipeline',
      'quality', 'command', 'skill', 'memory', 'context', 'search', 'index',
    ]);
    for (const token of folderTokens) {
      // CG-04: Skip single words that are domain stopwords
      if (FOLDER_STOPWORDS.has(token.toLowerCase())) {
        continue;
      }
      if (!existingLower.has(token.toLowerCase())) {
        preExtractedTriggers.push(token.toLowerCase());
        existingLower.add(token.toLowerCase());
      }
    }

    preExtractedTriggers = ensureMinTriggerPhrases(preExtractedTriggers, effectiveFiles, specFolderName);
    log(`   Pre-extracted ${preExtractedTriggers.length} trigger phrases`);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    warn(`   Warning: Pre-extraction of trigger phrases failed: ${errMsg}`);
  }

  const keyFiles = buildKeyFiles(enhancedFiles, specFolder);
  const memoryClassification = buildMemoryClassificationContext(collectedData, sessionData);
  const sessionDedup = buildSessionDedupContext(collectedData, sessionData, memoryTitle);
  const causalLinks = buildCausalLinksContext(collectedData);

  const files: Record<string, string> = {
    [ctxFilename]: await populateTemplate('context', {
      ...sessionData,
      ...conversations,
      ...workflowData,
      // RC-9: Re-assert TOOL_COUNT after spreading conversations ONLY in
      // Stateless mode, because conversations object contains TOOL_COUNT: 0
      // Which overwrites the patched value from stateless enrichment.
      // Non-stateless flows should keep conversations.TOOL_COUNT as-is.
      ...(isStatelessMode ? { TOOL_COUNT: sessionData.TOOL_COUNT } : {}),
      FILES: effectiveFiles,
      HAS_FILES: effectiveFiles.length > 0,
      MESSAGE_COUNT: conversations.MESSAGES.length,
      DECISION_COUNT: decisions.DECISIONS.length,
      DIAGRAM_COUNT: diagrams.DIAGRAMS.length,
      PHASE_COUNT: conversations.PHASE_COUNT,
      // P1-4: Convert 0-1 confidence to 0-100 for template percentage rendering
      DECISIONS: decisions.DECISIONS.map((d) => ({
        ...d,
        ...(() => {
          const overallConfidence = d.CONFIDENCE <= 1 ? Math.round(d.CONFIDENCE * 100) : Math.round(d.CONFIDENCE);
          const choiceConfidence = d.CHOICE_CONFIDENCE <= 1 ? Math.round(d.CHOICE_CONFIDENCE * 100) : Math.round(d.CHOICE_CONFIDENCE);
          const rationaleConfidence = d.RATIONALE_CONFIDENCE <= 1 ? Math.round(d.RATIONALE_CONFIDENCE * 100) : Math.round(d.RATIONALE_CONFIDENCE);
          return {
            CHOICE_CONFIDENCE: choiceConfidence,
            RATIONALE_CONFIDENCE: rationaleConfidence,
            CONFIDENCE: overallConfidence,
            HAS_SPLIT_CONFIDENCE: Math.abs(choiceConfidence - rationaleConfidence) > 10,
          };
        })(),
      })),
      HIGH_CONFIDENCE_COUNT: decisions.HIGH_CONFIDENCE_COUNT,
      MEDIUM_CONFIDENCE_COUNT: decisions.MEDIUM_CONFIDENCE_COUNT,
      LOW_CONFIDENCE_COUNT: decisions.LOW_CONFIDENCE_COUNT,
      FOLLOWUP_COUNT: decisions.FOLLOWUP_COUNT,
      HAS_AUTO_GENERATED: diagrams.HAS_AUTO_GENERATED,
      FLOW_TYPE: diagrams.FLOW_TYPE,
      AUTO_CONVERSATION_FLOWCHART: diagrams.AUTO_CONVERSATION_FLOWCHART,
      AUTO_DECISION_TREES: diagrams.AUTO_DECISION_TREES,
      DIAGRAMS: diagrams.DIAGRAMS,
      IMPLEMENTATION_SUMMARY: IMPL_SUMMARY_MD,
      HAS_IMPLEMENTATION_SUMMARY: HAS_IMPL,
      IMPL_TASK: implSummary.task,
      IMPL_SOLUTION: implSummary.solution,
      IMPL_FILES_CREATED: implSummary.filesCreated,
      IMPL_FILES_MODIFIED: implSummary.filesModified,
      IMPL_DECISIONS: implSummary.decisions,
      IMPL_OUTCOMES: implSummary.outcomes,
      HAS_IMPL_FILES_CREATED: implSummary.filesCreated.length > 0,
      HAS_IMPL_FILES_MODIFIED: implSummary.filesModified.length > 0,
      HAS_IMPL_DECISIONS: implSummary.decisions.length > 0,
      HAS_IMPL_OUTCOMES: implSummary.outcomes.length > 0 && implSummary.outcomes[0] !== 'Session completed',
      TOPICS: keyTopics,
      HAS_KEY_TOPICS: keyTopics.length > 0,
      TRIGGER_PHRASES: preExtractedTriggers,
      TRIGGER_PHRASES_YAML: renderTriggerPhrasesYaml(preExtractedTriggers),
      KEY_FILES: keyFiles,
      ...memoryClassification,
      ...sessionDedup,
      ...causalLinks,
      RELATED_SESSIONS: [],
      PARENT_SPEC: sessionData.SPEC_FOLDER || '',
      CHILD_SESSIONS: [],
      EMBEDDING_MODEL: MODEL_NAME || 'text-embedding-3-small',
      EMBEDDING_VERSION: '1.0',
      CHUNK_COUNT: 1,
      MEMORY_TITLE: memoryTitle,
      MEMORY_DASHBOARD_TITLE: memoryDashboardTitle,
      MEMORY_DESCRIPTION: memoryDescription,
      GRAPH_CONTEXT: '',
      HAS_GRAPH_CONTEXT: false
    }),
    'metadata.json': JSON.stringify({
      timestamp: `${sessionData.DATE} ${sessionData.TIME}`,
      messageCount: sessionData.MESSAGE_COUNT,
      decisionCount: decisions.DECISIONS.length,
      diagramCount: diagrams.DIAGRAMS.length,
      skillVersion: CONFIG.SKILL_VERSION,
      autoTriggered: shouldAutoSave(sessionData.MESSAGE_COUNT),
      filtering: {
        ...filterPipeline.getStats(),
        // RC-7: Clarify the two scoring systems to prevent confusion.
        // Metadata.json qualityScore is 0-100 (legacy scorer), while
        // Frontmatter quality_score is 0.0-1.0 (v2 scorer). Different metrics.
        _note: 'qualityScore is 0-100 scale (legacy scorer); frontmatter quality_score is 0.0-1.0 (v2 scorer)',
      },
      contaminationAudit: contaminationAuditTrail,
      semanticSummary: {
        task: implSummary.task.substring(0, 100),
        filesCreated: implSummary.filesCreated.length,
        filesModified: implSummary.filesModified.length,
        decisions: implSummary.decisions.length,
        messageStats: implSummary.messageStats
      },
      fileCounts: {
        fileCount: sessionData.FILE_COUNT,
        capturedFileCount: sessionData.CAPTURED_FILE_COUNT,
        filesystemFileCount: sessionData.FILESYSTEM_FILE_COUNT,
        gitChangedFileCount: sessionData.GIT_CHANGED_FILE_COUNT,
      },
      sourceProvenance: {
        transcriptPath: sessionData.SOURCE_TRANSCRIPT_PATH,
        sessionId: sessionData.SOURCE_SESSION_ID,
        sessionCreated: sessionData.SOURCE_SESSION_CREATED,
        sessionUpdated: sessionData.SOURCE_SESSION_UPDATED,
      },
      embedding: {
        status: 'pending',
        model: MODEL_NAME,
        dimensions: EMBEDDING_DIM
      }
    }, null, 2)
  };

  const isSimulation: boolean = !collectedData || !!collectedData._isSimulation || simFactory.requiresSimulation(collectedData);
  log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);

  // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
  // Preserves HTML inside fenced code blocks (```...```) which is legitimate code.
  log('Step 8.5: Content cleaning...');
  const rawContent = files[ctxFilename];
  const cleanedContent = stripWorkflowHtmlOutsideCodeFences(rawContent);
  // Only update if cleaning made changes
  if (cleanedContent !== rawContent) {
    files[ctxFilename] = cleanedContent;
    log('   Stripped leaked HTML tags from content (code blocks preserved)');
  } else {
    log('   No HTML cleaning needed');
  }

  // Step 8.6: Quality validation + scoring
  log('Step 8.6: Quality scoring...');
  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
  contaminationAuditTrail.push(qualityValidation.contaminationAudit);
  const metadataJson = JSON.parse(files['metadata.json']) as Record<string, unknown>;
  metadataJson.contaminationAudit = contaminationAuditTrail;
  files['metadata.json'] = JSON.stringify(metadataJson, null, 2);
  const qualitySignals: ValidationSignal[] = qualityValidation.ruleResults.map((rule) => ({
    ruleId: rule.ruleId,
    passed: rule.passed,
  }));
  const sufficiencySnapshot = buildWorkflowMemoryEvidenceSnapshot({
    title: memoryTitle,
    content: files[ctxFilename],
    triggerPhrases: preExtractedTriggers,
    files: effectiveFiles,
    observations: sessionData.OBSERVATIONS || [],
    decisions: decisions.DECISIONS,
    outcomes: sessionData.OUTCOMES || [],
    nextAction: sessionData.NEXT_ACTION,
    blockers: sessionData.BLOCKERS,
    recentContext: collectedData.recentContext,
  });
  const sufficiencyResult = evaluateMemorySufficiency(sufficiencySnapshot);
  const qualityV2 = scoreMemoryQualityV2({
    content: files[ctxFilename],
    validatorSignals: qualitySignals,
    hadContamination,
    contaminationSeverity: contaminationMaxSeverity,
    messageCount: conversations.MESSAGES.length,
    toolCount: sessionData.TOOL_COUNT,
    decisionCount: decisions.DECISIONS.length,
    sufficiencyScore: sufficiencyResult.score,
    insufficientContext: !sufficiencyResult.pass,
  });
  files[ctxFilename] = injectQualityMetadata(files[ctxFilename], qualityV2.score01, qualityV2.qualityFlags);

  // Step 8.5b: Spec document health annotation (non-blocking)
  let specDocHealth: SpecDocHealthResult | null = null;
  try {
    const specFolderAbsForHealth = path.resolve(specFolder);
    specDocHealth = evaluateSpecDocHealth(specFolderAbsForHealth);
    if (!specDocHealth.pass) {
      log(`   Spec doc health: ${specDocHealth.errors} errors, ${specDocHealth.warnings} warnings (score: ${specDocHealth.score})`);
    }
    files[ctxFilename] = injectSpecDocHealthMetadata(files[ctxFilename], specDocHealth);
  } catch (e: unknown) {
    // Non-blocking — health annotation failure must not prevent memory save
    log(`   Spec doc health check skipped: ${e instanceof Error ? e.message : String(e)}`);
  }

  // CG-07b: Validate template contract BEFORE any banner/warning is prepended.
  // Banners prepended after this point (low-quality, simulation, medium-quality)
  // would shift the frontmatter away from position 0, causing false
  // missing_frontmatter violations when the contract is checked later.
  const templateContractEarly = validateMemoryTemplateContract(files[ctxFilename]);
  if (!templateContractEarly.valid) {
    const contractDetails = templateContractEarly.violations
      .map((violation: { code: string; sectionId?: string }) => violation.sectionId ? `${violation.code}:${violation.sectionId}` : violation.code)
      .join(', ');
    const contractAbortMsg = `QUALITY_GATE_ABORT: Rendered memory violated template contract: ${contractDetails}`;
    warn(contractAbortMsg);
    throw new Error(contractAbortMsg);
  }

  if (filterStats.qualityScore < 20) {
    const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
    files[ctxFilename] = warningHeader + files[ctxFilename];
    log(`   Warning: Low quality session (${filterStats.qualityScore}/100) - warning header added`);
  }

  if (isSimulation) {
    const simWarning = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
    files[ctxFilename] = simWarning + files[ctxFilename];
    log('   Warning: Simulation mode: placeholder content warning added');
  }

  if (!qualityValidation.valid) {
    warn(`QUALITY_GATE_FAIL: ${qualityValidation.failedRules.join(', ')}`);
  }
  const qualityResult = scoreMemoryQuality(
    files[ctxFilename],
    preExtractedTriggers,
    keyTopics,
    effectiveFiles,
    sessionData.OBSERVATIONS || [],
    sufficiencyResult,
    hadContamination,
    contaminationMaxSeverity,
  );
  log(
    `   Memory quality score: ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}) ` +
    `canonical, ${qualityV2.score100}/100 (${qualityV2.score01.toFixed(2)}) (v2)`
  );
  if (qualityResult.warnings.length > 0) {
    for (const warning of qualityResult.warnings) {
      warn(`   Quality warning: ${warning}`);
    }
  }
  if (qualityResult.breakdown) {
    const qualityBreakdown = qualityResult.breakdown;
    log(`   Breakdown: triggers=${qualityBreakdown.triggerPhrases}/20, topics=${qualityBreakdown.keyTopics}/15, fileDesc=${qualityBreakdown.fileDescriptions}/20, length=${qualityBreakdown.contentLength}/15, html=${qualityBreakdown.noLeakedTags}/15, dedup=${qualityBreakdown.observationDedup}/15`);
  }

  // Step 8.7: Hard blocks before write/index
  // RC-5: V8/V9 contamination hard-block — prevent writing files when
  // Critical contamination rules fail. Previously these produced warnings
  // But files were still written and sometimes indexed.
  if (qualityValidation.ruleResults) {
    const contaminationRuleIds = ['V8', 'V9'];
    // RC-5 fix: Case-insensitive ruleId comparison + null-safe filter
    const failedContaminationRules = qualityValidation.ruleResults
      .filter((r: { ruleId: string; passed: boolean }) =>
        r && typeof r.ruleId === 'string' &&
        contaminationRuleIds.includes(r.ruleId.toUpperCase()) && !r.passed
      );
    if (failedContaminationRules.length > 0) {
      const failedIds = failedContaminationRules.map((r: { ruleId: string }) => r.ruleId).join(', ');
      const contaminationAbortMsg = `CONTAMINATION_GATE_ABORT: Critical contamination rules failed: [${failedIds}]. ` +
        `Content contains cross-spec contamination that would corrupt the memory index. Aborting write.`;
      warn(contaminationAbortMsg);
      throw new Error(contaminationAbortMsg);
    }
  }

  if (!sufficiencyResult.pass) {
    const insufficiencyAbortMsg = formatSufficiencyAbort(sufficiencyResult);
    warn(insufficiencyAbortMsg);
    throw new Error(insufficiencyAbortMsg);
  }

  if (collectedData?._source !== 'file' && !qualityValidation.valid) {
    const statelessValidationAbortMsg = `QUALITY_GATE_ABORT: Stateless save blocked due to failed validation rules: ${qualityValidation.failedRules.join(', ')}`;
    warn(statelessValidationAbortMsg);
    throw new Error(statelessValidationAbortMsg);
  }

  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
  if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
    const abortMsg = `QUALITY_GATE_ABORT: Memory quality score ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}) ` +
      `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
      `This typically means the captured session data does not contain meaningful content for this spec folder. ` +
      `To force save, pass data via JSON file instead of stateless mode.`;
    warn(abortMsg);
    throw new Error(abortMsg);
  }

  // CG-07: Add warning banner for medium-quality scores (0.30-0.60 legacy 30-60)
  if (qualityResult.score01 < 0.6 && qualityResult.score01 >= QUALITY_ABORT_THRESHOLD) {
    const mediumQualityWarning = `> **Warning:** Memory quality score is ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}), which is below the recommended threshold of 0.60. Content may have issues with: ${qualityResult.warnings.slice(0, 3).join('; ')}.\n\n`;
    files[ctxFilename] = mediumQualityWarning + files[ctxFilename];
    log(`   Medium quality warning added (score: ${qualityResult.score100}/100)`);
  }

  // Step 9: Write files with atomic writes and rollback on failure
  log('Step 9: Writing files...');
  const writtenFiles: string[] = await writeFilesAtomically(contextDir, files);

  // RC-6 fix: Check if the primary context file was actually written (it may
  // Have been skipped as a duplicate). Guard downstream operations accordingly.
  const ctxFileWritten = writtenFiles.includes(ctxFilename);

  // Update per-folder description.json memory tracking (only if file was written)
  if (ctxFileWritten) {
    try {
      const { loadPerFolderDescription: loadPFD, savePerFolderDescription: savePFD, generatePerFolderDescription: genPFD } = await import(
        '@spec-kit/mcp-server/lib/search/folder-discovery'
      );
      const specFolderAbsolute = path.resolve(specFolder);
      let existing = loadPFD(specFolderAbsolute);

      // F-36: Regenerate missing/corrupt description.json from spec.md + path structure
      if (!existing) {
        const specsBaseDirs = Array.from(new Set([
          ...getSpecsDirectories(),
          path.join(CONFIG.PROJECT_ROOT, 'specs'),
          path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
        ]));
        for (const base of specsBaseDirs) {
          const regenerated = genPFD(specFolderAbsolute, path.resolve(base));
          if (regenerated) {
            savePFD(regenerated, specFolderAbsolute);
            existing = regenerated;
            log('   Regenerated missing description.json');
            break;
          }
        }
      }

      if (existing) {
        // Integration-tested via workflow-memory-tracking.vitest.ts (F3 coverage).
        const rawSeq = Number(existing.memorySequence) || 0;
        // Defensive clamp handles Infinity/NaN/negative/overflow edge cases (F11 fix).
        const expectedSeq = (Number.isSafeInteger(rawSeq) && rawSeq >= 0) ? rawSeq + 1 : 1;
        existing.memorySequence = expectedSeq;
        existing.memoryNameHistory = [
          ...(existing.memoryNameHistory || []).slice(-19),
          ctxFilename,
        ];
        savePFD(existing, specFolderAbsolute);

        // F-34: Verify memorySequence to detect lost-update race, retry once
        const verified = loadPFD(specFolderAbsolute);
        if (verified && verified.memorySequence !== expectedSeq) {
          console.warn('[workflow] memorySequence lost-update detected, retrying');
          const freshSeq = Number(verified.memorySequence) || 0;
          verified.memorySequence = (Number.isSafeInteger(freshSeq) && freshSeq >= 0) ? freshSeq + 1 : 1;
          verified.memoryNameHistory = [
            ...(verified.memoryNameHistory || []).slice(-19),
            ctxFilename,
          ];
          savePFD(verified, specFolderAbsolute);
        }
      }
    } catch (descErr: unknown) {
      // F-34: Log error instead of silently swallowing
      console.warn(`[workflow] description.json tracking error: ${descErr instanceof Error ? descErr.message : String(descErr)}`);
    }
  } else {
    log('   Context file was a duplicate — skipping description tracking');
  }
  log();

  // Step 9.5: State embedded in memory file
  log('Step 9.5: State embedded in memory file (V13.0)');

  // Step 10: Success confirmation
  log('Context saved successfully!\n');
  log(`Location: ${contextDir}\n`);
  log('Files created:');
  for (const [filename, content] of Object.entries(files)) {
    const lines = content.split('\n').length;
    log(`  - ${filename} (${lines} lines)`);
  }
  log();
  log('Summary:');
  log(`  - ${conversations.MESSAGES.length} messages captured`);
  log(`  - ${decisions.DECISIONS.length} key decisions documented`);
  log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
  log(`  - Session duration: ${sessionData.DURATION}\n`);

  // Step 11: Semantic memory indexing
  log('Step 11: Indexing semantic memory...');

  let memoryId: number | null = null;
  let indexingStatus: WorkflowIndexingStatus | null = null;
  const persistIndexingStatus = async (
    status: IndexingStatusValue,
    reason?: string,
    errorMessage?: string
  ): Promise<void> => {
    indexingStatus = {
      status,
      memoryId,
      ...(reason ? { reason } : {}),
      ...(errorMessage ? { errorMessage } : {}),
    };
    await updateMetadataEmbeddingStatus(contextDir, indexingStatus);
  };

  // RC-6 fix: Only index if the context file was actually written (not a duplicate skip)
  if (!ctxFileWritten) {
    log('   Skipping indexing — context file was a duplicate');
    await persistIndexingStatus(
      'skipped_duplicate',
      'Context file content matched an existing memory file, so semantic indexing was skipped.'
    );
  } else {
    try {
      if (qualityValidation.valid) {
        const embeddingSections = buildWeightedEmbeddingSections(implSummary, files[ctxFilename]);
        memoryId = await indexMemory(
          contextDir,
          ctxFilename,
          files[ctxFilename],
          specFolderName,
          collectedData,
          preExtractedTriggers,
          embeddingSections
        );
        if (memoryId !== null) {
          log(`   Indexed as memory #${memoryId} (${EMBEDDING_DIM} dimensions)`);
          await updateMetadataWithEmbedding(contextDir, memoryId);
          indexingStatus = {
            status: 'indexed',
            memoryId,
          };
          log('   Updated metadata.json with embedding info');
        } else {
          log('   Embedding unavailable — semantic indexing skipped');
          await persistIndexingStatus(
            'skipped_embedding_unavailable',
            'Embedding generation returned null, so semantic indexing was skipped for this saved memory.'
          );
        }
      } else {
        log('   QUALITY_GATE_FAIL: skipping production indexing for this file');
        await persistIndexingStatus(
          'skipped_quality_gate',
          'Rendered memory failed validation, so semantic indexing was skipped.'
        );
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      await persistIndexingStatus(
        'failed_embedding',
        'Embedding generation or semantic indexing failed after the memory file was written.',
        errMsg
      );
      warn(`   Warning: Embedding failed: ${errMsg}`);
      warn('   Context saved successfully without semantic indexing');
      warn('   Run "npm run rebuild" to retry indexing later');
    }
  }

  // Step 12: Opportunistic retry processing
  try {
    const retryStats = retryManager.getRetryStats();
    if (retryStats.queue_size > 0) {
      log('Step 12: Processing retry queue...');
      const results = await retryManager.processRetryQueue(3);
      if (results.processed > 0) {
        log(`   Processed ${results.processed} pending embeddings`);
        log(`   Succeeded: ${results.succeeded}, Failed: ${results.failed}`);
      }
    }
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    warn(`   Warning: Retry processing error: ${errMsg}`);
  }

  log();

      return {
        contextDir,
        specFolder,
        specFolderName,
        contextFilename: ctxFilename,
        writtenFiles,
        memoryId,
        indexingStatus: indexingStatus ?? {
          status: 'failed_embedding',
          memoryId,
          reason: 'Indexing status was not finalized before workflow completion.',
        },
        stats: {
          messageCount: conversations.MESSAGES.length,
          decisionCount: decisions.DECISIONS.length,
          diagramCount: diagrams.DIAGRAMS.length,
          qualityScore: qualityResult.score,
          isSimulation
        }
      };
  });
}

// ───────────────────────────────────────────────────────────────
// 3. EXPORTS
// ───────────────────────────────────────────────────────────────

export {
  runWorkflow,
  stripWorkflowHtmlOutsideCodeFences,
};
