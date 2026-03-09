// ---------------------------------------------------------------
// MODULE: Workflow
// ---------------------------------------------------------------
// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
// ---------------------------------------------------------------

// Node stdlib
import * as path from 'path';
import * as fsSync from 'fs';

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
import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
import type { SessionData, CollectedDataFull } from '../extractors/collect-session-data';
import type { FileChange, SemanticFileInfo } from '../extractors/file-extractor';
import { filterContamination } from '../extractors/contamination-filter';
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
import type { FilterStats } from '../lib/content-filter';
import {
  generateImplementationSummary,
  formatSummaryAsMarkdown,
  extractFileChanges,
} from '../lib/semantic-summarizer';
import { EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import { retryManager } from '@spec-kit/mcp-server/api/providers';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import { indexMemory, updateMetadataWithEmbedding } from './memory-indexer';
import * as simFactory from '../lib/simulation-factory';
import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';
import { applyTreeThinning } from './tree-thinning';
import type {
  FileEntry as ThinningFileEntry,
  ThinningResult,
} from './tree-thinning';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

/** Represents workflow options. */
export interface WorkflowOptions {
  dataFile?: string;
  specFolderArg?: string;
  collectedData?: CollectedDataFull;
  loadDataFn?: () => Promise<CollectedDataFull>;
  collectSessionDataFn?: (
    collectedData: CollectedDataFull | null,
    specFolderName?: string | null
  ) => Promise<SessionData>;
  silent?: boolean;
}

/** Represents workflow result. */
export interface WorkflowResult {
  contextDir: string;
  specFolder: string;
  specFolderName: string;
  contextFilename: string;
  writtenFiles: string[];
  memoryId: number | null;
  stats: {
    messageCount: number;
    decisionCount: number;
    diagramCount: number;
    qualityScore: number;
    isSimulation: boolean;
  };
}

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

  const fileTokens = enhancedFiles
    .flatMap((file) => path.basename(file.FILE_PATH).replace(/\.[^.]+$/, '').split(/[-_]/))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);

  const combined = [...new Set([...existing, ...fileTokens, ...folderTokens])];
  if (combined.length >= 2) {
    return combined;
  }

  if (combined.length === 1) {
    return [combined[0], topicFromFolder.replace(/-/g, ' ').toLowerCase() || 'session'];
  }

  return ['session', 'context'];
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

function buildMemoryTitle(implementationTask: string, specFolderName: string, date: string): string {
  const preferredTitle = pickBestContentName([implementationTask]);
  if (preferredTitle.length > 0) {
    return truncateMemoryTitle(normalizeMemoryTitleCandidate(preferredTitle));
  }

  const folderLeaf = specFolderName.split('/').filter(Boolean).pop() || specFolderName;
  const readableFolder = normalizeMemoryTitleCandidate(folderLeaf.replace(/^\d+-/, '').replace(/-/g, ' '));
  const fallback = readableFolder.length > 0 ? `${readableFolder} session ${date}` : `Session ${date}`;
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
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---/);
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
    }

    const narrativeObservations = (enriched.observations || []).filter(
      (observation) => observation?._synthetic !== true
    );
    // Synthetic observations provide file coverage but do not influence session narrative
    enriched._narrativeObservations = narrativeObservations;

  } catch (err) {
    // Enrichment failure is non-fatal — proceed with whatever data we have
    console.warn(`   Warning: Stateless enrichment failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  return enriched;
}

/* -----------------------------------------------------------------
   2. MAIN WORKFLOW
   Orchestrates the full generate-context pipeline: data loading,
   extraction, template rendering, file writing, and memory indexing.
------------------------------------------------------------------*/

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
      collectedData = await loadDataFn();
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
    // cross-spec contamination (e.g., session working on spec A saved to spec B).
    const isStatelessMode = !activeDataFile && !preloadedData;
    if (isStatelessMode && activeSpecFolderArg && (collectedData.observations || collectedData.FILES)) {
      const specFolderLeaf = path.basename(activeSpecFolderArg).replace(/^\d+--?/, '').toLowerCase();
      // RC-4 fix: Filter out overly broad short keywords (e.g., "ops", "app", "api")
      // that cause false-positive alignment matches. Keep the full leaf as a compound keyword.
      const BROAD_STOPWORDS = new Set(['ops', 'app', 'api', 'cli', 'lib', 'src', 'dev', 'hub', 'log', 'run']);
      const specKeywords = specFolderLeaf.split('-').filter((w: string) => w.length >= 3 && !BROAD_STOPWORDS.has(w));
      // Always include the full compound leaf for substring matching (e.g., "ai-ops")
      if (specFolderLeaf.length >= 2) {
        specKeywords.unshift(specFolderLeaf);
      }

      const allFilePaths = (collectedData.observations || [])
        .flatMap((obs: { files?: string[] }) => obs.files || [])
        .concat((collectedData.FILES || []).map((f: { FILE_PATH?: string; path?: string }) => f.FILE_PATH || f.path || ''));

      const totalPaths = allFilePaths.length;
      if (totalPaths > 0 && specKeywords.length > 0) {
        const relevantPaths = allFilePaths.filter((fp: string) => {
          const lower = fp.toLowerCase();
          return specKeywords.some((kw: string) => lower.includes(kw));
        });
        const overlapRatio = relevantPaths.length / totalPaths;
        // RC-4: Raised from 0.05 to 0.15 — 5% threshold let mostly-foreign content through
        if (overlapRatio < 0.15) {
          const alignMsg = `ALIGNMENT_BLOCK: Only ${(overlapRatio * 100).toFixed(0)}% of captured file paths relate to spec folder "${activeSpecFolderArg}". ` +
            `The active session appears to be working on a different task (spec keywords: [${specKeywords.join(', ')}], ` +
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

    // Step 3.5: Enrich stateless data with spec folder and git context
    if (isStatelessMode) {
      log('Step 3.5: Enriching stateless data...');
      collectedData = await enrichStatelessData(collectedData, specFolder, CONFIG.PROJECT_ROOT);
      log('   Enrichment complete');

      // RC-4: Post-enrichment alignment re-check — enrichment can introduce
      // new foreign content (e.g., git context from other spec folders).
      // Re-verify alignment at a lower threshold (10%) to catch this.
      // Uses resolved specFolder (not raw activeSpecFolderArg) for accurate keyword matching.
      if (specFolder && (collectedData.observations || collectedData.FILES)) {
        const specFolderLeafPost = path.basename(specFolder).replace(/^\d+--?/, '').toLowerCase();
        // RC-4 fix: Consistent keyword extraction with pre-enrichment block
        const BROAD_STOPWORDS_POST = new Set(['ops', 'app', 'api', 'cli', 'lib', 'src', 'dev', 'hub', 'log', 'run']);
        const specKeywordsPost = specFolderLeafPost.split('-').filter((w: string) => w.length >= 3 && !BROAD_STOPWORDS_POST.has(w));
        if (specFolderLeafPost.length >= 2) {
          specKeywordsPost.unshift(specFolderLeafPost);
        }

        const allFilePathsPost = (collectedData.observations || [])
          .flatMap((obs: { files?: string[] }) => obs.files || [])
          .concat((collectedData.FILES || []).map((f: { FILE_PATH?: string; path?: string }) => f.FILE_PATH || f.path || ''));

        const totalPathsPost = allFilePathsPost.length;
        if (totalPathsPost > 0 && specKeywordsPost.length > 0) {
          const relevantPathsPost = allFilePathsPost.filter((fp: string) => {
            const lower = fp.toLowerCase();
            return specKeywordsPost.some((kw: string) => lower.includes(kw));
          });
          const overlapRatioPost = relevantPathsPost.length / totalPathsPost;
          if (overlapRatioPost < 0.10) {
            const postAlignMsg = `POST_ENRICHMENT_ALIGNMENT_BLOCK: After enrichment, only ${(overlapRatioPost * 100).toFixed(0)}% of file paths relate to spec folder "${specFolder}". ` +
              `Enrichment may have introduced cross-spec contamination (spec keywords: [${specKeywordsPost.join(', ')}], ` +
              `total paths: ${totalPathsPost}, matching: ${relevantPathsPost.length}). Aborting.`;
            warn(`   ${postAlignMsg}`);
            throw new Error(postAlignMsg);
          }
        }
      }
      log();
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
    let hadContamination = false;
    const cleanContaminationText = (input: string): string => {
      const filtered = filterContamination(input);
      if (filtered.hadContamination) {
        hadContamination = true;
      }
      return filtered.cleanedText;
    };
    const cleanObservations = (
      observations: CollectedDataFull['observations'] | undefined
    ): CollectedDataFull['observations'] | undefined => {
      if (!observations) {
        return observations;
      }
      return observations.map((observation) => {
        if (!observation || !observation._provenance) {
          return observation;
        }
        return {
          ...observation,
          title: observation.title ? cleanContaminationText(observation.title) : observation.title,
          narrative: observation.narrative ? cleanContaminationText(observation.narrative) : observation.narrative,
          facts: observation.facts?.map((fact) => (
            typeof fact === 'string'
              ? cleanContaminationText(fact)
              : { ...fact, text: fact.text ? cleanContaminationText(fact.text) : fact.text }
          )),
        };
      });
    };
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
  // synthetic file paths as contradictory with zero tool usage.
  // RC-9 fix: Guard against NaN/undefined TOOL_COUNT before any comparison.
  if (!Number.isFinite(sessionData.TOOL_COUNT)) {
    sessionData.TOOL_COUNT = 0;
  }
  const enrichedFileCount = collectedData.FILES?.length ?? 0;
  if (isStatelessMode && sessionData.TOOL_COUNT === 0 && enrichedFileCount > 0) {
    sessionData.TOOL_COUNT = enrichedFileCount;
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
    content: f.DESCRIPTION || '',
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
  const contentSlug: string = generateContentSlug(preferredMemoryTask, folderBase);
  const rawCtxFilename: string = `${sessionData.DATE}_${sessionData.TIME}__${contentSlug}.md`;
  const ctxFilename: string = ensureUniqueMemoryFilename(contextDir, rawCtxFilename);

  const keyTopicsInitial: string[] = extractKeyTopics(sessionData.SUMMARY, decisions.DECISIONS, specFolderName);
  const keyTopics: string[] = ensureMinSemanticTopics(keyTopicsInitial, effectiveFiles, specFolderName);
  const keyFiles = effectiveFiles.map((f) => ({ FILE_PATH: f.FILE_PATH }));
  const memoryTitle = buildMemoryTitle(preferredMemoryTask, specFolderName, sessionData.DATE);
  const memoryDashboardTitle = buildMemoryDashboardTitle(memoryTitle, specFolderName, ctxFilename);

  // Pre-extract trigger phrases for template embedding AND later indexing
  let preExtractedTriggers: string[] = [];
  try {
    // Build enriched text for trigger extraction: summary + decisions + file paths
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
      if (f.FILE_PATH) triggerSourceParts.push(f.FILE_PATH);
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
    for (const token of folderTokens) {
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

  const files: Record<string, string> = {
    [ctxFilename]: await populateTemplate('context', {
      ...sessionData,
      ...conversations,
      ...workflowData,
      // RC-9: Re-assert TOOL_COUNT after spreading conversations ONLY in
      // stateless mode, because conversations object contains TOOL_COUNT: 0
      // which overwrites the patched value from stateless enrichment.
      // Non-stateless flows should keep conversations.TOOL_COUNT as-is.
      ...(isStatelessMode ? { TOOL_COUNT: sessionData.TOOL_COUNT } : {}),
      FILES: effectiveFiles,
      HAS_FILES: effectiveFiles.length > 0,
      MESSAGE_COUNT: conversations.MESSAGES.length,
      DECISION_COUNT: decisions.DECISIONS.length,
      DIAGRAM_COUNT: diagrams.DIAGRAMS.length,
      PHASE_COUNT: conversations.PHASE_COUNT,
      DECISIONS: decisions.DECISIONS,
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
      KEY_FILES: keyFiles,
      RELATED_SESSIONS: [],
      PARENT_SPEC: sessionData.SPEC_FOLDER || '',
      CHILD_SESSIONS: [],
      EMBEDDING_MODEL: MODEL_NAME || 'text-embedding-3-small',
      EMBEDDING_VERSION: '1.0',
      CHUNK_COUNT: 1,
      MEMORY_TITLE: memoryTitle,
      MEMORY_DASHBOARD_TITLE: memoryDashboardTitle,
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
        // metadata.json qualityScore is 0-100 (legacy scorer), while
        // frontmatter quality_score is 0.0-1.0 (v2 scorer). Different metrics.
        _note: 'qualityScore is 0-100 scale (legacy scorer); frontmatter quality_score is 0.0-1.0 (v2 scorer)',
      },
      semanticSummary: {
        task: implSummary.task.substring(0, 100),
        filesCreated: implSummary.filesCreated.length,
        filesModified: implSummary.filesModified.length,
        decisions: implSummary.decisions.length,
        messageStats: implSummary.messageStats
      },
      embedding: {
        status: 'pending',
        model: MODEL_NAME,
        dimensions: EMBEDDING_DIM
      }
    }, null, 2)
  };

  if (filterStats.qualityScore < 20) {
    const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
    files[ctxFilename] = warningHeader + files[ctxFilename];
    log(`   Warning: Low quality session (${filterStats.qualityScore}/100) - warning header added`);
  }

  const isSimulation: boolean = !collectedData || !!collectedData._isSimulation || simFactory.requiresSimulation(collectedData);
  if (isSimulation) {
    const simWarning = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
    files[ctxFilename] = simWarning + files[ctxFilename];
    log('   Warning: Simulation mode: placeholder content warning added');
  }

  log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);

  // Step 8.5: Content cleaning — strip leaked HTML tags from rendered content
  // Preserves HTML inside fenced code blocks (```...```) which is legitimate code.
  log('Step 8.5: Content cleaning...');
  const rawContent = files[ctxFilename];
  // Split on code fences, only strip HTML tags from non-code sections
  const codeFenceRe = /(```[\s\S]*?```)/g;
  const segments = rawContent.split(codeFenceRe);
  let cleanedContent = segments.map((segment) => {
    // Odd indices are code blocks (captured groups) — preserve them
    if (segment.startsWith('```')) return segment;
    // Strip leaked formatting tags from non-code content
    return segment.replace(/<\/?(?:div|span|p|br|hr)\b[^>]*\/?>/gi, '');
  }).join('');
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
  const qualitySignals: ValidationSignal[] = qualityValidation.ruleResults.map((rule) => ({
    ruleId: rule.ruleId,
    passed: rule.passed,
  }));
  const qualityV2 = scoreMemoryQualityV2({
    content: files[ctxFilename],
    validatorSignals: qualitySignals,
    hadContamination,
    messageCount: conversations.MESSAGES.length,
    toolCount: sessionData.TOOL_COUNT,
    decisionCount: decisions.DECISIONS.length,
  });
  files[ctxFilename] = injectQualityMetadata(files[ctxFilename], qualityV2.qualityScore, qualityV2.qualityFlags);

  if (!qualityValidation.valid) {
    warn(`QUALITY_GATE_FAIL: ${qualityValidation.failedRules.join(', ')}`);
  }
  if (collectedData._source !== 'file' && !qualityValidation.valid) {
    const statelessValidationAbortMsg = `QUALITY_GATE_ABORT: Stateless save blocked due to failed validation rules: ${qualityValidation.failedRules.join(', ')}`;
    warn(statelessValidationAbortMsg);
    throw new Error(statelessValidationAbortMsg);
  }

  const qualityResult = scoreMemoryQuality(
    files[ctxFilename],
    preExtractedTriggers,
    keyTopics,
    effectiveFiles,
    sessionData.OBSERVATIONS || []
  );
  log(`   Memory quality score: ${qualityResult.score}/100 (legacy), ${qualityV2.qualityScore.toFixed(2)} (v2)`);
  if (qualityResult.warnings.length > 0) {
    for (const warning of qualityResult.warnings) {
      warn(`   Quality warning: ${warning}`);
    }
  }
  log(`   Breakdown: triggers=${qualityResult.breakdown.triggerPhrases}/20, topics=${qualityResult.breakdown.keyTopics}/15, fileDesc=${qualityResult.breakdown.fileDescriptions}/20, length=${qualityResult.breakdown.contentLength}/15, html=${qualityResult.breakdown.noLeakedTags}/15, dedup=${qualityResult.breakdown.observationDedup}/15`);

  // Step 8.7: Quality gate — abort save if quality is too low
  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
  if (qualityResult.score < QUALITY_ABORT_THRESHOLD && !isSimulation) {
    const abortMsg = `QUALITY_GATE_ABORT: Memory quality score ${qualityResult.score}/100 is below minimum threshold (${QUALITY_ABORT_THRESHOLD}). ` +
      `This typically means the captured session data does not contain meaningful content for this spec folder. ` +
      `To force save, pass data via JSON file instead of stateless mode.`;
    warn(abortMsg);
    throw new Error(abortMsg);
  }

  // RC-5: V8/V9 contamination hard-block — prevent writing files when
  // critical contamination rules fail. Previously these produced warnings
  // but files were still written and sometimes indexed.
  if (!isSimulation && qualityValidation.ruleResults) {
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

  // Step 9: Write files with atomic writes and rollback on failure
  log('Step 9: Writing files...');
  const writtenFiles: string[] = await writeFilesAtomically(contextDir, files);

  // RC-6 fix: Check if the primary context file was actually written (it may
  // have been skipped as a duplicate). Guard downstream operations accordingly.
  const ctxFileWritten = writtenFiles.includes(ctxFilename);

  // Update per-folder description.json memory tracking (only if file was written)
  if (ctxFileWritten) {
    try {
      const { loadPerFolderDescription: loadPFD, savePerFolderDescription: savePFD } = await import(
        '@spec-kit/mcp-server/lib/search/folder-discovery'
      );
      const specFolderAbsolute = path.resolve(specFolder);
      const existing = loadPFD(specFolderAbsolute);
      if (existing) {
        // AI-WHY: Integration-tested via workflow-memory-tracking.vitest.ts (F3 coverage).
        const rawSeq = Number(existing.memorySequence) || 0;
        // AI-WHY: Defensive clamp handles Infinity/NaN/negative/overflow edge cases (F11 fix).
        existing.memorySequence = (Number.isSafeInteger(rawSeq) && rawSeq >= 0) ? rawSeq + 1 : 1;
        existing.memoryNameHistory = [
          ...(existing.memoryNameHistory || []).slice(-19),
          ctxFilename,
        ];
        savePFD(existing, specFolderAbsolute);
      }
    } catch { /* Non-fatal — description tracking is best-effort */ }
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
  // RC-6 fix: Only index if the context file was actually written (not a duplicate skip)
  if (!ctxFileWritten) {
    log('   Skipping indexing — context file was a duplicate');
  } else {
    try {
      if (qualityValidation.valid) {
        memoryId = await indexMemory(contextDir, ctxFilename, files[ctxFilename], specFolderName, collectedData, preExtractedTriggers);
        if (memoryId !== null) {
          log(`   Indexed as memory #${memoryId} (${EMBEDDING_DIM} dimensions)`);
          await updateMetadataWithEmbedding(contextDir, memoryId);
          log('   Updated metadata.json with embedding info');
        }
      } else {
        log('   QUALITY_GATE_FAIL: skipping production indexing for this file');
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
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

/* -----------------------------------------------------------------
   3. EXPORTS
------------------------------------------------------------------*/

export {
  runWorkflow,
};
