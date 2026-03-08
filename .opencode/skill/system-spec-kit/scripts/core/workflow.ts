// ---------------------------------------------------------------
// MODULE: Workflow
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
    const highlights = childFiles
      .slice(0, 2)
      .map((f) => `${path.basename(f.FILE_PATH)}: ${f.DESCRIPTION}`)
      .join(' | ');

    const mergeNote = capText(
      `Tree-thinning merged ${childFiles.length} small files (${childNames.join(', ')}). ${highlights}`,
      420,
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
  } catch {
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
  const yamlBlockMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
  if (!yamlBlockMatch) {
    return content;
  }

  const yamlBlock = yamlBlockMatch[1];
  const qualityLines = [
    `quality_score: ${qualityScore.toFixed(2)}`,
    'quality_flags:',
    ...(qualityFlags.length > 0 ? qualityFlags.map((flag) => `  - "${flag}"`) : ['  []']),
  ].join('\n');

  const updatedYaml = `${yamlBlock}\n\n# Quality Signals\n${qualityLines}`;
  return content.replace(yamlBlock, updatedYaml);
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

    const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
    (async () => {
      log('   Collecting session data...');
      const result = await sessionDataFn(collectedData, specFolderName);
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
      const phases = extractPhasesFromData(collectedData as Parameters<typeof extractPhasesFromData>[0]);
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

  // Step 7.5: Generate semantic implementation summary
  log('Step 7.5: Generating semantic summary...');

  const rawUserPrompts = collectedData?.userPrompts || [];
  let hadContamination = false;
  const allMessages = rawUserPrompts.map((m) => {
    const filtered = filterContamination(m.prompt || '');
    if (filtered.hadContamination) {
      hadContamination = true;
    }
    return {
      prompt: filtered.cleanedText,
      content: filtered.cleanedText,
      timestamp: m.timestamp
    };
  });

  // Run content through filter pipeline for quality scoring
  const filterPipeline = createFilterPipeline();
  filterPipeline.filter(allMessages);
  const filterStats: FilterStats = filterPipeline.getStats();

  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
  if (filterPipeline.isLowQuality()) {
    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
  }

  const implSummary = generateImplementationSummary(
    allMessages,
    (collectedData?.observations || []) as Parameters<typeof generateImplementationSummary>[1]
  );

  const semanticFileChanges: Map<string, SemanticFileInfo> = extractFileChanges(
    allMessages,
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
      filtering: filterPipeline.getStats(),
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
  log('Step 8.5: Content cleaning...');
  const rawContent = files[ctxFilename];
  // Strip <summary> and </summary> tags that leak from conversation data
  let cleanedContent = rawContent
    .replace(/<\/?summary>/gi, '')
    .replace(/<\/?details>/gi, '');
  // AI: Fix F7 — strip all HTML tags, not just summary/details.
  cleanedContent = cleanedContent.replace(/<[^>]+>/g, '');
  // Only update if cleaning made changes
  if (cleanedContent !== rawContent) {
    files[ctxFilename] = cleanedContent;
    log('   Stripped leaked HTML tags from content');
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

  const qualityResult = scoreMemoryQuality(
    files[ctxFilename],
    preExtractedTriggers,
    keyTopics,
    enhancedFiles,
    sessionData.OBSERVATIONS || []
  );
  log(`   Memory quality score: ${qualityResult.score}/100 (legacy), ${qualityV2.qualityScore.toFixed(2)} (v2)`);
  if (qualityResult.warnings.length > 0) {
    for (const warning of qualityResult.warnings) {
      warn(`   Quality warning: ${warning}`);
    }
  }
  log(`   Breakdown: triggers=${qualityResult.breakdown.triggerPhrases}/20, topics=${qualityResult.breakdown.keyTopics}/15, fileDesc=${qualityResult.breakdown.fileDescriptions}/20, length=${qualityResult.breakdown.contentLength}/15, html=${qualityResult.breakdown.noLeakedTags}/15, dedup=${qualityResult.breakdown.observationDedup}/15`);

  // Step 9: Write files with atomic writes and rollback on failure
  log('Step 9: Writing files...');
  const writtenFiles: string[] = await writeFilesAtomically(contextDir, files);

  // Update per-folder description.json memory tracking
  try {
    const { loadPerFolderDescription: loadPFD, savePerFolderDescription: savePFD } = await import(
      '@spec-kit/mcp-server/lib/search/folder-discovery'
    );
    const specFolderAbsolute = path.resolve(specFolder);
    const existing = loadPFD(specFolderAbsolute);
    if (existing) {
      existing.memorySequence = (existing.memorySequence || 0) + 1;
      existing.memoryNameHistory = [
        ...(existing.memoryNameHistory || []).slice(-19),
        ctxFilename,
      ];
      savePFD(existing, specFolderAbsolute);
    }
  } catch { /* Non-fatal — description tracking is best-effort */ }
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
  try {
    if (qualityValidation.valid) {
      memoryId = await indexMemory(contextDir, ctxFilename, files[ctxFilename], specFolderName, collectedData, preExtractedTriggers);
      if (memoryId) {
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
