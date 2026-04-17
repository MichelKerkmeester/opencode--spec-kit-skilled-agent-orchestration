// ───────────────────────────────────────────────────────────────
// MODULE: Memory Save Handler
// ───────────────────────────────────────────────────────────────
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  evaluateMemorySufficiency,
  MEMORY_SUFFICIENCY_REJECTION_CODE,
  type MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import {
  validateMemoryTemplateContract,
  type MemoryTemplateContractResult,
} from '@spec-kit/shared/parsing/memory-template-contract';
import {
  evaluateSpecDocHealth,
  type SpecDocHealthResult,
} from '@spec-kit/shared/parsing/spec-doc-health';

// Internal modules
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { createFilePathValidator } from '../utils/validators.js';
import * as memoryParser from '../lib/parsing/memory-parser.js';
import * as transactionManager from '../lib/storage/transaction-manager.js';
import * as checkpoints from '../lib/storage/checkpoints.js';
import * as preflight from '../lib/validation/preflight.js';
import { requireDb } from '../utils/index.js';
import type { MCPResponse } from './types.js';
import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
import * as causalEdges from '../lib/storage/causal-edges.js';

import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
import {
  isPostInsertEnrichmentEnabled,
  isSaveQualityGateEnabled,
  isSaveReconsolidationEnabled,
  resolveSavePlannerMode,
} from '../lib/search/search-flags.js';

import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import { findSimilarMemories } from './pe-gating.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
import { indexChunkedMemoryFile, shouldUseChunkedIndexing } from './chunking-orchestrator.js';
import { applyPostInsertMetadata } from './save/db-helpers.js';
import {
  createMemoryRecord,
  findSamePathExistingMemory,
  type CreateRecordIdentityHints,
  type MemoryScopeMatch,
} from './save/create-record.js';
import {
  buildGovernancePostInsertFields,
  ensureGovernanceRuntime,
  recordGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance.js';
import { delete_memory_from_database } from '../lib/search/vector-index-mutations.js';
import {
  runQualityLoop,
} from './quality-loop.js';
import type {
  QualityLoopResult,
} from './quality-loop.js';

// O2-5/O2-12: V-rule validation (previously only in workflow path)
import {
  validateMemoryQualityContent,
  determineValidationDisposition,
} from './v-rule-bridge.js';

// Save pipeline modules (CR-P2-4 decomposition)
import type {
  IndexResult,
  RouteCategory,
  MergeModeHint,
  SaveArgs,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
  PlannerAdvisory,
  PlannerBlocker,
  PlannerFollowUpAction,
  PlannerRouteTarget,
} from './save/index.js';
import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
import { runPostInsertEnrichmentIfEnabled } from './save/post-insert.js';
import {
  buildIndexResult,
  buildPlannerResponse,
  buildSaveResponse,
  serializePlannerAdvisory,
  serializePlannerBlocker,
  serializePlannerFollowUpAction,
  serializePlannerProposedEdit,
  serializePlannerRouteTarget,
} from './save/response-builder.js';
import { atomicIndexMemory } from './save/atomic-index-memory.js';
import { createMCPErrorResponse } from '../lib/response/envelope.js';
import {
  buildTier3Prompt,
  createContentRouter,
  getTier3Contract,
  isTier3RoutingEnabled,
  InMemoryRouterCache,
  TIER2_FALLBACK_PENALTY,
  TIER3_THRESHOLD,
  type RoutingDecision,
  type Tier3ClassifierInput,
  type Tier3RawResponse,
} from '../lib/routing/content-router.js';
import { anchorMergeOperation } from '../lib/merge/anchor-merge-operation.js';
import {
  readThinContinuityRecord,
  upsertThinContinuityInMarkdown,
  type ThinContinuityRecord,
} from '../lib/continuity/thin-continuity-record.js';
import {
  runSpecDocStructureRule,
  type ContaminationPlan,
  type MergePlan,
  type PostSavePlan,
} from '../lib/validation/spec-doc-structure.js';
import { detectSpecLevelFromParsed } from './handler-utils.js';

// Extracted sub-modules
import { withSpecFolderLock } from './save/spec-folder-mutex.js';
import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
import {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
  buildPlannerAdvisory,
  buildPlannerBlocker,
} from './save/validation-responses.js';

import { markMemorySuperseded } from './pe-gating.js';
import { resolveMemoryReference } from './causal-links-processor.js';
import { refreshAutoEntitiesForMemory } from '../lib/extraction/entity-extractor.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Prediction-error save arbitration


// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
const MANUAL_FALLBACK_SOURCE_CLASSIFICATION = 'manual-fallback' as const;
const ROUTED_CONTINUITY_ANCHOR_ID = '_memory.continuity';
const tier3RoutingCache = new InMemoryRouterCache();

interface PreparedParsedMemory {
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
  qualityLoopResult: QualityLoopResult;
  sufficiencyResult: MemorySufficiencyResult;
  templateContract: MemoryTemplateContractResult;
  specDocHealth: SpecDocHealthResult | null;
  finalizedFileContent: string | null;
  sourceClassification: 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
}

type ParsedMemoryWithIndexHints = ReturnType<typeof memoryParser.parseMemoryFile> & {
  _skipIndex?: boolean;
  _vRuleIndexBlockIds?: string[];
};

interface RoutedSaveOptions extends CreateRecordIdentityHints {
  routeAs?: RouteCategory;
  mergeModeHint?: MergeModeHint;
}

interface RoutedRecordIdentity {
  targetDocPath: string;
  canonicalFilePath: string;
  targetAnchorId: string | null;
  routeAs: RouteCategory | null;
  continuitySourceKey: string | null;
}

type CanonicalPacketLevel = 'L1' | 'L2' | 'L3' | 'L3+';
type CanonicalPacketKind = 'feature' | 'phase' | 'remediation' | 'research' | 'unknown';

interface CanonicalAtomicValidatorPlan {
  folder: string;
  level: string;
  mergePlan: MergePlan | null;
  contaminationPlan: ContaminationPlan | null;
  postSavePlan: PostSavePlan | null;
}

interface CanonicalAtomicPrepared {
  preparedMemory: PreparedParsedMemory;
  routing: RoutedSaveOptions;
  validatorPlan: CanonicalAtomicValidatorPlan | null;
}

const STANDARD_MEMORY_TEMPLATE_MARKERS = [
  '## continue session',
  '## recovery hints',
  '<!-- memory metadata -->',
];
const ROUTE_CATEGORIES = new Set<RouteCategory>([
  'narrative_progress',
  'narrative_delivery',
  'decision',
  'handover_state',
  'research_finding',
  'task_update',
  'metadata_only',
  'drop',
]);

class VRuleUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VRuleUnavailableError';
  }
}

function isVRuleUnavailableResult(value: unknown): value is {
  passed: false;
  status: 'error' | 'warning';
  message: string;
  _unavailable: true;
} {
  return typeof value === 'object'
    && value !== null
    && 'passed' in value
    && (value as { passed?: unknown }).passed === false
    && 'status' in value
    && typeof (value as { status?: unknown }).status === 'string'
    && 'message' in value
    && typeof (value as { message?: unknown }).message === 'string';
}

function classifyMemorySaveSource(
  content: string,
): 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION {
  const normalizedContent = content.toLowerCase();
  const hasAnyStandardMarker = STANDARD_MEMORY_TEMPLATE_MARKERS.some((marker) => normalizedContent.includes(marker));
  return hasAnyStandardMarker ? 'template-generated' : MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
}

function shouldBypassTemplateContract(
  sourceClassification: PreparedParsedMemory['sourceClassification'],
  sufficiencyResult: MemorySufficiencyResult,
  templateContract: MemoryTemplateContractResult,
): boolean {
  return sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION
    && sufficiencyResult.pass
    && sufficiencyResult.evidenceCounts.primary === 0
    && sufficiencyResult.evidenceCounts.support >= 3
    && sufficiencyResult.evidenceCounts.anchors >= 1
    && !templateContract.valid;
}

function buildQualityLoopMetadata(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  database: ReturnType<typeof requireDb>,
): Record<string, unknown> {
  return {
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    specFolder: parsed.specFolder,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    causalLinks: parsed.causalLinks,
    filePath: parsed.filePath,
    lastModified: parsed.lastModified,
    resolveReference: (reference: string) => resolveMemoryReference(database, reference) !== null,
  };
}

function prepareParsedMemoryForIndexing(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  database: ReturnType<typeof requireDb>,
  options: {
    emitEvalMetrics?: boolean;
    qualityLoopMode?: 'advisory' | 'full-auto';
  } = {},
): PreparedParsedMemory {
  const validation = memoryParser.validateParsedMemory(parsed);
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
    validation.warnings.forEach((warning: string) => console.warn(`[memory]   - ${warning}`));
  }

  // O2-5/O2-12: Run V-rule validation (previously only in workflow path)
  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
  if (isVRuleUnavailableResult(vRuleResult) && vRuleResult.status === 'error') {
    throw new VRuleUnavailableError(vRuleResult.message);
  }
  if (vRuleResult && '_unavailable' in vRuleResult) {
    validation.warnings.push('V-rule validator module unavailable — quality gate bypassed. Save proceeds without V-rule enforcement.');
  }
  if (vRuleResult && !isVRuleUnavailableResult(vRuleResult) && !vRuleResult.valid) {
    const vRuleDisposition = determineValidationDisposition(
      vRuleResult.failedRules,
      parsed.memoryTypeSource || null,
    );
    if (vRuleDisposition && vRuleDisposition.disposition === 'abort_write') {
      const failedRuleIds = vRuleDisposition.blockingRuleIds;
      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
      // Return early with a rejected quality loop result so callers see the block
      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
      return {
        parsed,
        validation,
        qualityLoopResult: {
          passed: false,
          score: rejectScore,
          attempts: 0,
          fixes: [],
          rejected: true,
          rejectionReason: `V-rule hard block: ${failedRuleIds.join(', ')}`,
        },
        sufficiencyResult: {
          pass: false,
          rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
          score: 0,
          reasons: [`V-rule hard block: ${failedRuleIds.join(', ')}`],
          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
        },
        templateContract: { valid: false, violations: [], missingAnchors: [], unexpectedTemplateArtifacts: [] } as MemoryTemplateContractResult,
        specDocHealth: null,
        finalizedFileContent: null,
        sourceClassification: 'template-generated',
      };
    }
    if (vRuleDisposition && vRuleDisposition.disposition === 'write_skip_index') {
      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      validation.warnings.push(`V-rule index block: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      // F07-002: Flag to skip indexing for write_skip_index disposition
      const parsedWithIndexHints = parsed as ParsedMemoryWithIndexHints;
      parsedWithIndexHints._skipIndex = true;
      parsedWithIndexHints._vRuleIndexBlockIds = vRuleDisposition.indexBlockingRuleIds;
    }
  }

  const qualityLoopResult = runQualityLoop(parsed.content, buildQualityLoopMetadata(parsed, database), {
    emitEvalMetrics: options.emitEvalMetrics,
    mode: options.qualityLoopMode ?? 'advisory',
  });
  parsed.qualityScore = qualityLoopResult.score.total;
  parsed.qualityFlags = Array.from(new Set([
    ...parsed.qualityFlags,
    ...qualityLoopResult.score.issues,
  ]));
  if (qualityLoopResult.fixedTriggerPhrases) {
    parsed.triggerPhrases = qualityLoopResult.fixedTriggerPhrases;
  }
  const finalizedFileContent = qualityLoopResult.fixedContent
    && qualityLoopResult.passed
    ? qualityLoopResult.fixedContent
    : null;
  if (finalizedFileContent) {
    parsed.content = finalizedFileContent;
    parsed.contentHash = memoryParser.computeContentHash(parsed.content);
  }

  const sourceClassification = classifyMemorySaveSource(parsed.content);
  if (sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION) {
    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
    console.warn(`[memory-save] ${warning} ${path.basename(parsed.filePath)}`);
    validation.warnings.push(warning);
  }

  const sufficiencyResult = evaluateMemorySufficiency(
    {
      ...buildParsedMemoryEvidenceSnapshot(parsed),
      sourceClassification,
    },
  );
  applyInsufficiencyMetadata(parsed, sufficiencyResult);
  const templateContract = validateMemoryTemplateContract(parsed.content);

  // Non-blocking spec doc health annotation
  // Canonical saves land directly in the spec folder (e.g. .../NNN-name/decision-record.md),
  // so the immediate parent is usually the spec folder itself.
  let specDocHealth: SpecDocHealthResult | null = null;
  if (parsed.specFolder && parsed.filePath) {
    try {
      const absFilePath = path.resolve(parsed.filePath);
      const immediateParent = path.dirname(absFilePath);
      const candidates = [immediateParent, path.dirname(immediateParent)];
      for (const candidate of candidates) {
        if (fs.existsSync(path.join(candidate, 'spec.md'))) {
          specDocHealth = evaluateSpecDocHealth(candidate);
          break;
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `[memory-save] spec-doc-health annotation skipped for ${path.basename(parsed.filePath)}: ${message}`
      );
    }
  }

  return {
    parsed,
    validation,
    qualityLoopResult,
    sufficiencyResult,
    templateContract,
    specDocHealth,
    finalizedFileContent,
    sourceClassification,
  };
}

async function finalizeMemoryFileContent(
  filePath: string,
  content: string,
): Promise<void> {
  const backupPath = `${filePath}.${randomUUID().slice(0, 8)}.bak`;
  const tempPath = `${filePath}.${randomUUID().slice(0, 8)}.tmp`;
  let backupCreated = false;
  let tempCreated = false;

  try {
    try {
      await fs.promises.copyFile(filePath, backupPath);
      backupCreated = true;
    } catch (backupErr: unknown) {
      const errCode = typeof backupErr === 'object' && backupErr !== null && 'code' in backupErr
        ? String((backupErr as NodeJS.ErrnoException).code)
        : '';
      if (errCode !== 'ENOENT') {
        throw backupErr;
      }
    }

    await fs.promises.writeFile(tempPath, content, 'utf-8');
    tempCreated = true;
    await fs.promises.rename(tempPath, filePath);
    tempCreated = false;
  } catch (writeErr: unknown) {
    if (tempCreated) {
      try {
        await fs.promises.unlink(tempPath);
      } catch {
        // Best-effort cleanup only.
      }
    }
    if (backupCreated) {
      try {
        await fs.promises.copyFile(backupPath, filePath);
      } catch (restoreErr: unknown) {
        console.warn(
          '[memory-save] Auto-fix file restore failed after finalize error:',
          restoreErr instanceof Error ? restoreErr.message : String(restoreErr),
        );
      }
    }
    throw writeErr;
  } finally {
    if (tempCreated) {
      try {
        await fs.promises.unlink(tempPath);
      } catch {
        // Best-effort cleanup only.
      }
    }
    if (backupCreated) {
      try {
        await fs.promises.unlink(backupPath);
      } catch {
        // Best-effort cleanup only.
      }
    }
  }
}

function appendResultWarning<T extends Record<string, unknown>>(result: T, warning: string | null): T {
  if (!warning) {
    return result;
  }

  const r = result as Record<string, unknown>;
  const warnings = Array.isArray(r.warnings)
    ? [...(r.warnings as string[])]
    : [];
  warnings.push(warning);
  r.warnings = warnings;
  return result;
}

function recordCrossPathPeSupersedes(
  database: ReturnType<typeof requireDb>,
  memoryId: number,
  supersededMemoryId: number | null,
  samePathMemoryId: number | null,
  reason: string | null | undefined,
): void {
  if (supersededMemoryId == null || supersededMemoryId === samePathMemoryId) {
    return;
  }

  causalEdges.init(database);
  const evidence = reason && reason.trim().length > 0
    ? reason.trim()
    : 'Prediction-error contradiction across different file paths';
  causalEdges.insertEdge(
    String(memoryId),
    String(supersededMemoryId),
    causalEdges.RELATION_TYPES.SUPERSEDES,
    1.0,
    evidence,
    true,
    'auto',
  );
}

interface ChunkedInsertTracker {
  parentId: number | null;
  childIds: Set<number>;
}

function createChunkedInsertTracker(): ChunkedInsertTracker {
  return {
    parentId: null,
    childIds: new Set<number>(),
  };
}

function trackChunkedInsert(
  tracker: ChunkedInsertTracker,
  memoryId: number,
  fields: Record<string, unknown>,
): void {
  if (typeof fields.chunk_index === 'number') {
    tracker.childIds.add(memoryId);
    return;
  }

  if (tracker.parentId == null) {
    tracker.parentId = memoryId;
  }
}

function rollbackCreatedChunkTree(
  database: ReturnType<typeof requireDb>,
  tracker: ChunkedInsertTracker,
): { attempted: boolean; cleaned: boolean; error?: string } {
  if (tracker.parentId == null) {
    return { attempted: false, cleaned: false };
  }

  const childIds = new Set<number>(tracker.childIds);
  try {
    const persistedChildRows = database.prepare(`
      SELECT id
      FROM memory_index
      WHERE parent_id = ?
    `).all(tracker.parentId) as Array<{ id: number }>;
    for (const row of persistedChildRows) {
      childIds.add(row.id);
    }
  } catch {
    // Best-effort lookup only. Tracked IDs remain authoritative for cleanup.
  }

  const cleanupErrors: string[] = [];
  for (const childId of childIds) {
    try {
      if (!delete_memory_from_database(database, childId)) {
        cleanupErrors.push(`Chunk ${childId} was not deleted`);
      }
    } catch (error: unknown) {
      cleanupErrors.push(`Chunk ${childId} cleanup failed: ${getAtomicSaveErrorMessage(error)}`);
    }
  }

  try {
    if (!delete_memory_from_database(database, tracker.parentId)) {
      cleanupErrors.push(`Parent ${tracker.parentId} was not deleted`);
    }
  } catch (error: unknown) {
    cleanupErrors.push(`Parent ${tracker.parentId} cleanup failed: ${getAtomicSaveErrorMessage(error)}`);
  }

  if (cleanupErrors.length > 0) {
    return {
      attempted: true,
      cleaned: false,
      error: cleanupErrors.join('; '),
    };
  }

  return { attempted: true, cleaned: true };
}

function captureAtomicSaveOriginalState(filePath: string): { existed: boolean; content: string | null } {
  if (!fs.existsSync(filePath)) {
    return { existed: false, content: null };
  }

  return {
    existed: true,
    content: fs.readFileSync(filePath, 'utf-8'),
  };
}

function getAtomicSaveErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function deleteAtomicSaveFile(filePath: string): { deleted: boolean; existed: boolean; error?: string } {
  const existed = fs.existsSync(filePath);
  if (!existed) {
    return { deleted: false, existed: false };
  }

  try {
    fs.unlinkSync(filePath);
    return { deleted: true, existed: true };
  } catch (error: unknown) {
    return {
      deleted: false,
      existed: true,
      error: getAtomicSaveErrorMessage(error),
    };
  }
}

function restoreAtomicSaveOriginalState(
  filePath: string,
  originalState: { existed: boolean; content: string | null },
): { restored: boolean; error?: string } {
  try {
    if (!originalState.existed) {
      const deleteResult = deleteAtomicSaveFile(filePath);
      if (!deleteResult.existed || deleteResult.deleted) {
        return { restored: true };
      }
      return {
        restored: false,
        error: deleteResult.error ?? `Failed to remove promoted file at ${filePath}`,
      };
    }

    if (typeof originalState.content !== 'string') {
      return { restored: false, error: 'Original file content is unavailable for rollback' };
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, originalState.content, 'utf-8');
    return { restored: true };
  } catch (error: unknown) {
    return {
      restored: false,
      error: getAtomicSaveErrorMessage(error),
    };
  }
}

function cleanupAtomicSavePendingFile(
  pendingPath: string,
): { cleaned: boolean; existed: boolean; error?: string } {
  try {
    const deleteResult = deleteAtomicSaveFile(pendingPath);
    if (!deleteResult.existed || deleteResult.deleted) {
      return {
        cleaned: true,
        existed: deleteResult.existed,
      };
    }
    return {
      cleaned: false,
      existed: deleteResult.existed,
      error: deleteResult.error ?? `Failed to remove pending file at ${pendingPath}`,
    };
  } catch (error: unknown) {
    return {
      cleaned: false,
      existed: true,
      error: getAtomicSaveErrorMessage(error),
    };
  }
}

function applyRoutedSaveHints(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  routing: RoutedSaveOptions,
): ReturnType<typeof memoryParser.parseMemoryFile> {
  const parsedWithHints = parsed as ParsedMemoryWithIndexHints & Record<string, unknown>;
  if (routing.targetDocPath) {
    parsedWithHints.targetDocPath = routing.targetDocPath;
    parsedWithHints.target_doc_path = routing.targetDocPath;
  }
  if (routing.targetAnchorId) {
    parsedWithHints.targetAnchorId = routing.targetAnchorId;
    parsedWithHints.target_anchor_id = routing.targetAnchorId;
    parsedWithHints.anchorId = routing.targetAnchorId;
    parsedWithHints.anchor_id = routing.targetAnchorId;
  }
  if (routing.routeAs) {
    parsedWithHints.routeAs = routing.routeAs;
    parsedWithHints.route_as = routing.routeAs;
  }
  if (routing.continuitySourceKey) {
    parsedWithHints.continuitySourceKey = routing.continuitySourceKey;
    parsedWithHints.continuity_source_key = routing.continuitySourceKey;
  }
  return parsedWithHints;
}

function buildRoutedSaveOptions(
  filePath: string,
  routeAs?: RouteCategory,
  mergeModeHint?: MergeModeHint,
  targetAnchorId?: string,
): RoutedSaveOptions | undefined {
  if (!routeAs && !mergeModeHint && !targetAnchorId) {
    return undefined;
  }

  return {
    targetDocPath: filePath,
    ...(routeAs ? { routeAs } : {}),
    ...(mergeModeHint ? { mergeModeHint } : {}),
    ...(targetAnchorId ? { targetAnchorId } : {}),
  };
}

function shouldUseCanonicalRouting(_params: Pick<AtomicSaveParams, 'routeAs' | 'mergeModeHint' | 'targetAnchorId'>): boolean {
  return true; // Canonical routing is always enabled (Tier 3 LLM routing on by default)
}

function pickRoutedIdentityValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function pickRouteCategory(value: unknown): RouteCategory | null {
  const normalized = pickRoutedIdentityValue(value);
  if (!normalized || !ROUTE_CATEGORIES.has(normalized as RouteCategory)) {
    return null;
  }
  return normalized as RouteCategory;
}

function isMergeModeHint(value: unknown): value is MergeModeHint {
  return value === 'append-as-paragraph'
    || value === 'insert-new-adr'
    || value === 'append-table-row'
    || value === 'update-in-place'
    || value === 'append-section';
}

function resolveRoutedRecordIdentity(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  routedFilePath: string,
  routing: RoutedSaveOptions,
): RoutedRecordIdentity {
  const routedRecord = parsed as unknown as Record<string, unknown>;
  const routeAs = pickRouteCategory(routing.routeAs ?? routedRecord.routeAs ?? routedRecord.route_as);
  const continuitySourceKey = pickRoutedIdentityValue(
    routing.continuitySourceKey
    ?? routedRecord.continuitySourceKey
    ?? routedRecord.continuity_source_key
    ?? routedRecord.sourceKey
    ?? routedRecord.source_key,
  );
  const explicitTargetAnchorId = pickRoutedIdentityValue(
    routing.targetAnchorId
    ?? routedRecord.targetAnchorId
    ?? routedRecord.target_anchor_id
    ?? routedRecord.anchorId
    ?? routedRecord.anchor_id,
  );

  return {
    targetDocPath: routing.targetDocPath ?? routedFilePath,
    canonicalFilePath: routing.canonicalFilePath ?? getCanonicalPathKey(routing.targetDocPath ?? routedFilePath),
    targetAnchorId: explicitTargetAnchorId ?? ((routeAs === 'metadata_only' || continuitySourceKey !== null) ? ROUTED_CONTINUITY_ANCHOR_ID : null),
    routeAs,
    continuitySourceKey,
  };
}

function toCanonicalPacketLevel(level: number | null): CanonicalPacketLevel {
  if (level === 1) return 'L1';
  if (level === 2) return 'L2';
  if (level === 3) return 'L3';
  return 'L3+';
}

function toValidatorLevel(packetLevel: CanonicalPacketLevel): string {
  return packetLevel.replace(/^L/u, '');
}

function normalizeForFingerprint(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '');
}

function buildContinuityFingerprint(content: string): string {
  return `sha256:${createHash('sha256').update(normalizeForFingerprint(content), 'utf8').digest('hex')}`;
}

function normalizePhaseAnchor(value: string | null | undefined): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  const match = trimmed.match(/^phase(?:[\s_-]+)?(\d+)$/iu);
  return match ? `phase-${match[1]}` : null;
}

function inferPhaseAnchorFromText(text: string): string | null {
  const match = text.match(/\bphase(?:[\s_-]+)?(\d+)\b/iu);
  return match ? `phase-${match[1]}` : null;
}

function inferPhaseAnchorFromSpecFolder(specFolder: string): string | null {
  return inferPhaseAnchorFromText(specFolder.replace(/\//g, ' '));
}

function deriveLikelyPhaseAnchorForCanonicalRouting(params: {
  routingChunkText: string;
  specFolder: string;
  targetAnchorId?: string;
}): string | null {
  return normalizePhaseAnchor(params.targetAnchorId)
    ?? inferPhaseAnchorFromText(params.routingChunkText)
    ?? inferPhaseAnchorFromSpecFolder(params.specFolder);
}

function stripMarkdownFrontmatter(markdown: string): string {
  return markdown.replace(/^(?:\uFEFF)?---\r?\n[\s\S]*?\r?\n---(?:\r?\n)?/u, '');
}

function normalizeRoutingChunkText(markdown: string): string {
  return stripMarkdownFrontmatter(markdown)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractFrontmatterScalar(markdown: string, key: string): string | null {
  const frontmatterMatch = markdown.match(/^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)?/u);
  if (!frontmatterMatch?.[1]) {
    return null;
  }

  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const scalarMatch = frontmatterMatch[1].match(
    new RegExp(`^\\s*${escapedKey}:\\s*["']?([^"'\r\n]+)["']?\\s*$`, 'imu'),
  );
  return scalarMatch?.[1]?.trim() ?? null;
}

function hasNumericSpecFolderName(folderPath: string): boolean {
  return /^\d{3}(?:[-_].+)?$/u.test(path.basename(folderPath));
}

function hasChildSpecFolders(specFolderAbsolute: string): boolean {
  try {
    const entries = fs.readdirSync(specFolderAbsolute, { withFileTypes: true });
    return entries.some((entry) => {
      if (!entry.isDirectory() || !hasNumericSpecFolderName(entry.name)) {
        return false;
      }
      return fs.existsSync(path.join(specFolderAbsolute, entry.name, 'spec.md'));
    });
  } catch {
    return false;
  }
}

function deriveCanonicalPacketKind(
  specFolderAbsolute: string,
  specFolderKey: string,
): CanonicalPacketKind {
  const specMdPath = path.join(specFolderAbsolute, 'spec.md');
  let specContent = '';
  try {
    specContent = fs.readFileSync(specMdPath, 'utf8');
  } catch {
    specContent = '';
  }

  const packetType = extractFrontmatterScalar(specContent, 'type')?.toLowerCase() ?? '';
  const title = extractFrontmatterScalar(specContent, 'title')?.toLowerCase() ?? '';
  const description = extractFrontmatterScalar(specContent, 'description')?.toLowerCase() ?? '';
  const folderName = path.basename(specFolderAbsolute).toLowerCase();
  const semanticHint = `${folderName} ${title} ${description}`;

  if (packetType === 'research') {
    return 'research';
  }
  if (/\bremediation\b/u.test(semanticHint)) {
    return 'remediation';
  }

  const parentFolder = path.dirname(specFolderAbsolute);
  const hasNumericParentPacket = hasNumericSpecFolderName(parentFolder)
    && fs.existsSync(path.join(parentFolder, 'spec.md'));
  if (!hasChildSpecFolders(specFolderAbsolute) && hasNumericParentPacket) {
    return 'phase';
  }

  const normalizedSpecFolder = specFolderKey.replace(/^specs\//u, '');
  const depth = normalizedSpecFolder.split('/').filter(Boolean).length;
  if (depth <= 2) {
    return 'feature';
  }

  return hasNumericParentPacket ? 'phase' : 'feature';
}

function getTier3RoutingEndpoint(): string | null {
  const endpoint = process.env.LLM_REFORMULATION_ENDPOINT?.trim();
  return endpoint ? endpoint.replace(/\/+$/u, '') : null;
}

function extractTier3MessageText(content: unknown): string | null {
  if (typeof content === 'string') {
    const trimmed = content.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(content)) {
    const text = content
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return '';
        }
        const textValue = (entry as { text?: unknown }).text;
        return typeof textValue === 'string' ? textValue : '';
      })
      .join('')
      .trim();
    return text.length > 0 ? text : null;
  }
  return null;
}

function isTier3RawResponseShape(parsed: unknown): parsed is Tier3RawResponse {
  if (!parsed || typeof parsed !== 'object') {
    return false;
  }

  const record = parsed as Record<string, unknown>;
  return typeof record.category === 'string'
    && typeof record.confidence === 'number'
    && typeof record.target_doc === 'string'
    && typeof record.target_anchor === 'string'
    && typeof record.merge_mode === 'string'
    && typeof record.reasoning === 'string';
}

function parseTier3ClassifierResponse(rawText: string): Tier3RawResponse | null {
  try {
    const parsed = JSON.parse(rawText) as Record<string, unknown>;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    return isTier3RawResponseShape(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function classifyWithTier3Llm(input: Tier3ClassifierInput): Promise<Tier3RawResponse | null> {
  const endpoint = getTier3RoutingEndpoint();
  if (!endpoint) {
    return null;
  }

  const apiKey = process.env.LLM_REFORMULATION_API_KEY?.trim() ?? '';
  const contract = getTier3Contract();
  const prompt = buildTier3Prompt(input);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), contract.timeoutMs);

  try {
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: contract.model,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user },
        ],
        reasoning_effort: contract.reasoningEffort,
        temperature: contract.temperature,
        max_tokens: contract.maxOutputTokens,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };
    const rawText = extractTier3MessageText(data.choices?.[0]?.message?.content);
    return rawText ? parseTier3ClassifierResponse(rawText) : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

function buildCanonicalRouter(options: { tier3Enabled?: boolean } = {}) {
  return createContentRouter({
    classifyWithTier3: classifyWithTier3Llm,
    cache: tier3RoutingCache,
    tier3Enabled: options.tier3Enabled,
  });
}

function collapseInlineWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function clipInlineText(value: string, maxLength = 96): string {
  const normalized = collapseInlineWhitespace(value);
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function extractParagraphs(markdown: string): string[] {
  return normalizeRoutingChunkText(markdown)
    .split(/\n\s*\n/g)
    .map((entry) => collapseInlineWhitespace(entry))
    .filter(Boolean);
}

function extractListItems(markdown: string): string[] {
  return normalizeRoutingChunkText(markdown)
    .split(/\r?\n/g)
    .map((line) => line.match(/^\s*(?:[-*+]|\d+\.)\s+(.+)$/u)?.[1] ?? '')
    .map((line) => clipInlineText(line, 120))
    .filter(Boolean);
}

function resolveSpecFolderAbsoluteFromFilePath(filePath: string, specFolder: string): string {
  const normalizedFilePath = filePath.replace(/\\/g, '/');
  const normalizedSpecFolder = specFolder.replace(/^specs\//u, '');
  const markers = [
    `/specs/${normalizedSpecFolder}/`,
    `/specs/${specFolder}/`,
  ];

  for (const marker of markers) {
    const markerIndex = normalizedFilePath.lastIndexOf(marker);
    if (markerIndex >= 0) {
      return path.normalize(`${normalizedFilePath.slice(0, markerIndex)}${marker.slice(0, -1)}`);
    }
  }

  return path.resolve(path.dirname(filePath), '..');
}

function resolveMetadataHostDocPath(specFolderAbsolute: string): string {
  const implementationSummaryPath = path.join(specFolderAbsolute, 'implementation-summary.md');
  if (fs.existsSync(implementationSummaryPath)) {
    return implementationSummaryPath;
  }

  return path.join(specFolderAbsolute, 'spec.md');
}

function resolveCanonicalTargetDocPath(
  specFolderAbsolute: string,
  routedDocPath: string,
): string {
  if (routedDocPath === 'spec-frontmatter' || routedDocPath === 'implementation-summary.md') {
    return resolveMetadataHostDocPath(specFolderAbsolute);
  }
  return path.join(specFolderAbsolute, routedDocPath);
}

function clampRoutingConfidence(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function selectTier2FailOpenFallback(
  specFolderAbsolute: string,
  decision: RoutingDecision,
): {
  category: RouteCategory;
  confidence: number;
  targetDocPath: string;
  routedDocPath: string;
  targetAnchorId: string;
  mergeMode: RoutingDecision['target']['mergeMode'];
  warningMessage: string;
} | null {
  if (decision.tierUsed !== 3) {
    return null;
  }

  for (const hit of decision.tier2TopK) {
    if (hit.category === 'drop') {
      continue;
    }
    const fallbackConfidence = clampRoutingConfidence(hit.similarity - TIER2_FALLBACK_PENALTY);
    if (fallbackConfidence < TIER3_THRESHOLD) {
      continue;
    }

    const targetDocPath = resolveCanonicalTargetDocPath(specFolderAbsolute, hit.target_doc);
    if (!fs.existsSync(targetDocPath)) {
      continue;
    }

    return {
      category: hit.category as RouteCategory,
      confidence: fallbackConfidence,
      targetDocPath,
      routedDocPath: hit.target_doc,
      targetAnchorId: hit.target_anchor,
      mergeMode: hit.merge_intent,
      warningMessage: `Tier 3 routing was unusable; fell back to Tier 2 prototype match ${hit.category}.`,
    };
  }

  return null;
}

function buildFallbackContinuityRecord(params: {
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  routeCategory: RouteCategory;
  targetDocPath: string;
  specFolderAbsolute: string;
  currentContent: string;
}): ThinContinuityRecord {
  const { parsed, routeCategory, targetDocPath, specFolderAbsolute, currentContent } = params;
  const relativeTargetPath = path.relative(specFolderAbsolute, targetDocPath).replace(/\\/g, '/');
  const absoluteSpecFolder = specFolderAbsolute.replace(/\\/g, '/');
  const packetPointerFromPath = absoluteSpecFolder.includes('/specs/')
    ? absoluteSpecFolder.split('/specs/')[1]
    : parsed.specFolder.replace(/^specs\//u, '');
  const title = clipInlineText(parsed.title ?? (normalizeRoutingChunkText(currentContent) || 'Updated canonical continuity'));
  const nextActionByRoute: Record<RouteCategory, string> = {
    narrative_progress: 'Review routed update',
    narrative_delivery: 'Verify delivery route',
    decision: 'Review ADR follow-up',
    handover_state: 'Resume routed handover',
    research_finding: 'Review cited finding',
    task_update: 'Verify task alignment',
    metadata_only: 'Refresh continuity',
    drop: 'Inspect refused route',
  };

  return {
    packet_pointer: packetPointerFromPath,
    last_updated_at: new Date().toISOString().replace(/\.\d{3}Z$/u, 'Z'),
    last_updated_by: 'memory-save',
    recent_action: title,
    next_safe_action: nextActionByRoute[routeCategory],
    blockers: [],
    key_files: relativeTargetPath ? [relativeTargetPath] : [],
    session_dedup: {
      fingerprint: buildContinuityFingerprint(currentContent),
      session_id: 'memory-save',
      parent_session_id: null,
    },
    completion_pct: 0,
    open_questions: [],
    answered_questions: [],
  };
}

function buildCanonicalMergePayload(params: {
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  routeCategory: RouteCategory;
  mergeMode: MergeModeHint;
  content: string;
}): Record<string, unknown> {
  const { parsed, routeCategory, mergeMode, content } = params;
  const paragraphs = extractParagraphs(content);
  const firstParagraph = paragraphs[0] ?? clipInlineText(content, 160);
  const secondParagraph = paragraphs[1] ?? firstParagraph;
  const listItems = extractListItems(content);

  switch (mergeMode) {
    case 'append-as-paragraph':
      return { paragraph: firstParagraph };
    case 'append-section':
      return {
        title: clipInlineText(parsed.title ?? `${routeCategory.replace(/_/g, ' ')} update`, 72),
        body: normalizeRoutingChunkText(content) || firstParagraph,
      };
    case 'insert-new-adr':
      return {
        title: clipInlineText(parsed.title ?? 'Captured canonical decision', 80),
        context: firstParagraph,
        decision: secondParagraph,
        consequences: listItems.slice(0, 3),
      };
    case 'update-in-place': {
      const targetId = content.match(/\b(?:T\d{3}|CHK-\d{3})\b/u)?.[0];
      if (!targetId) {
        throw new Error(`Canonical task update could not find a target task/checklist id in routed content.`);
      }
      const checked = /\[[xX]\]/u.test(content)
        ? true
        : (/\[[ ]\]/u.test(content) ? false : undefined);
      return {
        targetId,
        ...(checked === undefined ? {} : { checked }),
        evidence: clipInlineText(parsed.title ?? firstParagraph, 96),
      };
    }
    case 'append-table-row':
      return {
        cells: [
          clipInlineText(parsed.title ?? routeCategory, 48),
          'Updated',
          clipInlineText(firstParagraph, 96),
        ],
        dedupeColumn: 0,
      };
    default:
      return { paragraph: firstParagraph };
  }
}

async function buildCanonicalAtomicPreparedSave(
  params: AtomicSaveParams,
  database: ReturnType<typeof requireDb>,
): Promise<{ status: 'ready'; prepared: CanonicalAtomicPrepared; persistedContent: string; persistedFilePath: string } | { status: 'abort'; result: AtomicSaveResult }> {
  const preparedMemory = prepareParsedMemoryForIndexing(
    memoryParser.parseMemoryContent(params.file_path, params.content),
    database,
    {
      qualityLoopMode: params.plannerMode === 'full-auto' ? 'full-auto' : 'advisory',
    },
  );
  if (!preparedMemory.validation.valid) {
    return {
      status: 'abort',
      result: {
        success: false,
        filePath: params.file_path,
        status: 'error',
        summary: 'Atomic save preflight failed',
        message: 'Parsed content failed validation before canonical atomic save',
        error: `Validation failed: ${preparedMemory.validation.errors.join(', ')}`,
      },
    };
  }

  if (preparedMemory.qualityLoopResult.fixes.length > 0 && preparedMemory.qualityLoopResult.passed && preparedMemory.qualityLoopResult.fixedContent) {
    console.error(`[memory-save] Quality loop applied ${preparedMemory.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(params.file_path)} before canonical pending-file promotion`);
  }

  const specFolderAbsolute = resolveSpecFolderAbsoluteFromFilePath(params.file_path, preparedMemory.parsed.specFolder);
  const packetLevel = toCanonicalPacketLevel(detectSpecLevelFromParsed(path.join(specFolderAbsolute, 'spec.md')));
  const packetKind = deriveCanonicalPacketKind(specFolderAbsolute, preparedMemory.parsed.specFolder);
  const saveMode = params.routeAs ? 'route-as' : 'natural';
  const tier3Enabled = params.plannerMode === 'full-auto' || isTier3RoutingEnabled();
  const router = buildCanonicalRouter({ tier3Enabled });
  const routingChunkText = normalizeRoutingChunkText(params.content);
  const likelyPhaseAnchor = deriveLikelyPhaseAnchorForCanonicalRouting({
    routingChunkText,
    specFolder: preparedMemory.parsed.specFolder,
    targetAnchorId: params.targetAnchorId,
  });
  const decision = await router.classifyContent(
    {
      id: path.basename(params.file_path),
      text: routingChunkText,
      sourceField: params.routeAs === 'metadata_only' ? 'preflight' : 'observations',
      routeAs: params.routeAs,
      metadata: params.targetAnchorId ? { targetAnchorId: params.targetAnchorId } : undefined,
    },
    {
      specFolder: preparedMemory.parsed.specFolder,
      packetLevel,
      sessionMeta: {
        spec_folder: preparedMemory.parsed.specFolder,
        packet_level: packetLevel,
        packet_kind: packetKind,
        save_mode: saveMode,
        recent_docs_touched: [],
        recent_anchors_touched: [],
        likely_phase_anchor: likelyPhaseAnchor,
      },
    },
  );

  let effectiveDecision = decision;
  const applyTier2FailOpenFallback = (): boolean => {
    const fallback = selectTier2FailOpenFallback(specFolderAbsolute, effectiveDecision);
    if (!fallback) {
      return false;
    }
    effectiveDecision = {
      ...effectiveDecision,
      category: fallback.category,
      confidence: fallback.confidence,
      target: {
        docPath: fallback.routedDocPath,
        anchorId: fallback.targetAnchorId,
        mergeMode: fallback.mergeMode,
      },
      tierUsed: 2,
      warningMessage: fallback.warningMessage,
      refusal: false,
    };
    return true;
  };

  if ((effectiveDecision.refusal || effectiveDecision.category === 'drop') && !applyTier2FailOpenFallback()) {
    return {
      status: 'abort',
      result: {
        success: false,
        filePath: params.file_path,
        status: 'rejected',
        summary: 'Canonical routed save refused to merge content',
        message: `${effectiveDecision.warningMessage ?? 'Router refused to route canonical content safely'} Nothing was written; "${effectiveDecision.target.docPath}" is only a manual-review suggestion.`,
        routeCategory: effectiveDecision.category,
        targetDocPath: effectiveDecision.target.docPath,
      },
    };
  }

  if (params.mergeModeHint && params.mergeModeHint !== effectiveDecision.target.mergeMode) {
    return {
      status: 'abort',
      result: {
        success: false,
        filePath: params.file_path,
        status: 'rejected',
        summary: 'Canonical routed save rejected conflicting merge-mode hint',
        message: `mergeModeHint "${params.mergeModeHint}" did not match routed mode "${effectiveDecision.target.mergeMode}"`,
        routeCategory: effectiveDecision.category,
        mergeMode: params.mergeModeHint,
        targetDocPath: effectiveDecision.target.docPath,
      },
    };
  }

  let targetDocPath = resolveCanonicalTargetDocPath(specFolderAbsolute, effectiveDecision.target.docPath);
  if (!fs.existsSync(targetDocPath) && !applyTier2FailOpenFallback()) {
    return {
      status: 'abort',
      result: {
        success: false,
        filePath: targetDocPath,
        status: 'error',
        summary: 'Canonical routed save target document is missing',
        message: `Target document "${targetDocPath}" does not exist`,
        routeCategory: effectiveDecision.category,
      },
    };
  }
  targetDocPath = resolveCanonicalTargetDocPath(specFolderAbsolute, effectiveDecision.target.docPath);

  const originalTargetContent = fs.readFileSync(targetDocPath, 'utf8');
  const routedMergeMode = params.mergeModeHint ?? effectiveDecision.target.mergeMode;
  if (!isMergeModeHint(routedMergeMode)) {
    return {
      status: 'abort',
      result: {
        success: false,
        filePath: targetDocPath,
        status: 'rejected',
        summary: 'Canonical routed save refused unsupported merge mode',
        message: `Routed merge mode "${effectiveDecision.target.mergeMode}" is not supported by atomic writer saves`,
        routeCategory: effectiveDecision.category,
        targetDocPath,
        targetAnchorId: effectiveDecision.target.anchorId ?? undefined,
      },
    };
  }
  const mergeMode: MergeModeHint = routedMergeMode;
  const relativeTargetFile = path.relative(specFolderAbsolute, targetDocPath).replace(/\\/g, '/');

  let persistedContent = originalTargetContent;
  let targetAnchorId = effectiveDecision.target.anchorId;

  if (effectiveDecision.category === 'metadata_only') {
    const readResult = readThinContinuityRecord(params.content);
    const continuityRecord = readResult.ok && readResult.record
      ? readResult.record
      : buildFallbackContinuityRecord({
          parsed: preparedMemory.parsed,
          routeCategory: effectiveDecision.category,
          targetDocPath,
          specFolderAbsolute,
          currentContent: params.content,
        });
    const writeResult = upsertThinContinuityInMarkdown(persistedContent, continuityRecord, {
      fallbackActor: 'memory-save',
      fallbackPacketPointer: preparedMemory.parsed.specFolder,
      fallbackTimestamp: new Date().toISOString(),
    });
    if (!writeResult.ok || !writeResult.markdown) {
      return {
        status: 'abort',
        result: {
          success: false,
          filePath: targetDocPath,
        status: 'rejected',
        summary: 'Canonical continuity update failed validation',
        message: writeResult.errors.map((error) => `${error.code}:${error.field}:${error.message}`).join('; '),
        routeCategory: effectiveDecision.category,
        mergeMode,
        targetDocPath,
        targetAnchorId: ROUTED_CONTINUITY_ANCHOR_ID,
        },
      };
    }
    persistedContent = writeResult.markdown;
    targetAnchorId = ROUTED_CONTINUITY_ANCHOR_ID;
  } else {
    let mergedDocument: string;
    try {
      const mergeResult = anchorMergeOperation({
        documentContent: originalTargetContent,
        docPath: relativeTargetFile,
        anchorId: targetAnchorId,
        mergeMode,
        payload: buildCanonicalMergePayload({
          parsed: preparedMemory.parsed,
          routeCategory: effectiveDecision.category,
          mergeMode,
          content: params.content,
        }) as never,
        dedupeFingerprint: buildContinuityFingerprint(params.content),
      });
      mergedDocument = mergeResult.updatedDocument;
    } catch (error: unknown) {
      return {
        status: 'abort',
        result: {
          success: false,
          filePath: targetDocPath,
          status: 'rejected',
          summary: 'Canonical anchor merge failed',
          message: error instanceof Error ? error.message : String(error),
          routeCategory: effectiveDecision.category,
          mergeMode,
          targetDocPath,
          targetAnchorId,
        },
      };
    }

    const continuityRecord = buildFallbackContinuityRecord({
      parsed: preparedMemory.parsed,
      routeCategory: effectiveDecision.category,
      targetDocPath,
      specFolderAbsolute,
      currentContent: params.content,
    });
    const writeResult = upsertThinContinuityInMarkdown(mergedDocument, continuityRecord, {
      fallbackActor: 'memory-save',
      fallbackPacketPointer: preparedMemory.parsed.specFolder,
      fallbackTimestamp: new Date().toISOString(),
    });
    if (!writeResult.ok || !writeResult.markdown) {
      return {
        status: 'abort',
        result: {
          success: false,
          filePath: targetDocPath,
        status: 'rejected',
        summary: 'Canonical continuity update failed after merge',
        message: writeResult.errors.map((error) => `${error.code}:${error.field}:${error.message}`).join('; '),
        routeCategory: effectiveDecision.category,
        mergeMode,
        targetDocPath,
        targetAnchorId,
        },
      };
    }
    persistedContent = writeResult.markdown;
  }

  const routing: RoutedSaveOptions = {
    targetDocPath,
    canonicalFilePath: getCanonicalPathKey(targetDocPath),
    targetAnchorId,
    routeAs: effectiveDecision.category,
    mergeModeHint: mergeMode,
    continuitySourceKey: 'frontmatter',
  };

  return {
    status: 'ready',
    persistedContent,
    persistedFilePath: targetDocPath,
    prepared: {
      preparedMemory,
      routing,
      validatorPlan: {
        folder: specFolderAbsolute,
        level: toValidatorLevel(packetLevel),
        mergePlan: effectiveDecision.category === 'metadata_only'
          ? null
          : {
              targetFile: relativeTargetFile,
              targetAnchor: targetAnchorId,
              mergeMode,
              chunkText: routingChunkText,
            },
        contaminationPlan: {
          routeCategory: effectiveDecision.category,
          chunkText: routingChunkText,
          routeOverrideAccepted: effectiveDecision.overrideApplied,
        },
        postSavePlan: params.plannerMode === 'full-auto'
          ? {
              file: relativeTargetFile,
              expectedFingerprint: buildContinuityFingerprint(persistedContent),
              snapshotContent: originalTargetContent,
              expectedSize: Buffer.byteLength(persistedContent, 'utf8'),
            }
          : null,
      },
    },
  };
}

function validateCanonicalPreparedSave(
  prepared: CanonicalAtomicPrepared,
): { ok: true; warnings: string[] } | { ok: false; rejection: IndexResult } {
  if (!prepared.validatorPlan) {
    return { ok: true, warnings: [] };
  }

  const warnings: string[] = [];
  const rules: Array<{
    rule: 'FRONTMATTER_MEMORY_BLOCK' | 'MERGE_LEGALITY' | 'SPEC_DOC_SUFFICIENCY' | 'CROSS_ANCHOR_CONTAMINATION' | 'POST_SAVE_FINGERPRINT';
    mergePlan?: MergePlan | null;
    contaminationPlan?: ContaminationPlan | null;
    postSavePlan?: PostSavePlan | null;
  }> = [
    { rule: 'FRONTMATTER_MEMORY_BLOCK' },
    { rule: 'MERGE_LEGALITY', mergePlan: prepared.validatorPlan.mergePlan },
    { rule: 'SPEC_DOC_SUFFICIENCY' },
    { rule: 'CROSS_ANCHOR_CONTAMINATION', contaminationPlan: prepared.validatorPlan.contaminationPlan },
  ];

  if (prepared.validatorPlan.postSavePlan) {
    rules.push({ rule: 'POST_SAVE_FINGERPRINT', postSavePlan: prepared.validatorPlan.postSavePlan });
  }

  for (const entry of rules) {
    const result = runSpecDocStructureRule({
      folder: prepared.validatorPlan.folder,
      level: prepared.validatorPlan.level,
      rule: entry.rule,
      mergePlan: entry.mergePlan ?? null,
      contaminationPlan: entry.contaminationPlan ?? null,
      postSavePlan: entry.postSavePlan ?? null,
    });
    if (result.status === 'warn') {
      warnings.push(...result.diagnostics.map((diagnostic) => `${entry.rule}:${diagnostic.code}:${diagnostic.detail}`));
    }
    if (result.status === 'fail') {
      return {
        ok: false,
        rejection: {
          status: 'rejected',
          id: 0,
          specFolder: prepared.preparedMemory.parsed.specFolder,
          title: prepared.preparedMemory.parsed.title ?? '',
          message: result.diagnostics.map((diagnostic) => `${diagnostic.code}: ${diagnostic.detail}`).join('; ') || result.message,
          rejectionReason: `${entry.rule} failed for canonical routed save`,
          routeCategory: prepared.routing.routeAs ?? undefined,
          mergeMode: prepared.routing.mergeModeHint ?? undefined,
          targetDocPath: prepared.routing.targetDocPath ?? undefined,
          targetAnchorId: prepared.routing.targetAnchorId ?? undefined,
          warnings,
        },
      };
    }
  }

  return { ok: true, warnings };
}

function buildAtomicPlannerRouteTarget(prepared: CanonicalAtomicPrepared): PlannerRouteTarget {
  return serializePlannerRouteTarget({
    routeCategory: prepared.routing.routeAs ?? 'drop',
    targetDocPath: prepared.routing.targetDocPath ?? prepared.preparedMemory.parsed.filePath,
    canonicalFilePath: prepared.routing.canonicalFilePath ?? undefined,
    targetAnchorId: prepared.routing.targetAnchorId ?? null,
    mergeMode: prepared.routing.mergeModeHint ?? undefined,
  });
}

function buildAtomicPlannerFollowUpActions(
  params: AtomicSaveParams,
  prepared: CanonicalAtomicPrepared,
): PlannerFollowUpAction[] {
  const specFolder = prepared.preparedMemory.parsed.specFolder;
  const applyArgs: Record<string, unknown> = {
    filePath: params.file_path,
    plannerMode: 'full-auto',
    ...(params.routeAs ? { routeAs: params.routeAs } : {}),
    ...(params.mergeModeHint ? { mergeModeHint: params.mergeModeHint } : {}),
    ...(params.targetAnchorId ? { targetAnchorId: params.targetAnchorId } : {}),
  };

  const followUpActions: PlannerFollowUpAction[] = [
    serializePlannerFollowUpAction({
      action: 'apply',
      title: 'Apply canonical save',
      description: 'Run the canonical atomic writer in explicit full-auto mode.',
      args: applyArgs,
    }),
    serializePlannerFollowUpAction({
      action: 'refresh-graph',
      title: 'Refresh graph metadata',
      description: 'Refresh the packet graph metadata after applying the save.',
      tool: 'refreshGraphMetadata',
      args: {
        specFolder,
      },
    }),
    serializePlannerFollowUpAction({
      action: 'reindex',
      title: 'Reindex touched spec docs',
      description: 'Run incremental spec-doc indexing so the save is immediately searchable.',
      tool: 'reindexSpecDocs',
      args: {
        specFolder,
      },
    }),
  ];

  if (!isSaveReconsolidationEnabled()) {
    followUpActions.push(serializePlannerFollowUpAction({
      action: 'reconsolidate',
      title: 'Run full-auto fallback with reconsolidation',
      description: 'Use the backward-compatible full-auto save path when you explicitly want reconsolidation-on-save.',
      tool: 'memory_save',
      args: applyArgs,
    }));
  }

  if (!isPostInsertEnrichmentEnabled()) {
    followUpActions.push(serializePlannerFollowUpAction({
      action: 'enrich',
      title: 'Run enrichment backfill',
      description: 'Backfill entity extraction, summaries, cross-doc linking, and graph lifecycle after the canonical save is applied.',
      tool: 'runEnrichmentBackfill',
      args: {
        specFolder,
      },
    }));
  }

  return followUpActions;
}

function buildAtomicPlannerAdvisories(
  prepared: CanonicalAtomicPrepared,
  warnings: string[],
): PlannerAdvisory[] {
  const advisories: PlannerAdvisory[] = [];
  const routeCategory = prepared.routing.routeAs ?? undefined;
  const targetDocPath = prepared.routing.targetDocPath ?? undefined;
  const targetAnchorId = prepared.routing.targetAnchorId ?? null;
  const templateContractBypassed = shouldBypassTemplateContract(
    prepared.preparedMemory.sourceClassification,
    prepared.preparedMemory.sufficiencyResult,
    prepared.preparedMemory.templateContract,
  );

  for (const warning of warnings) {
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'SPEC_DOC_WARNING',
      message: warning,
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  for (const warning of prepared.preparedMemory.validation.warnings) {
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'INPUT_WARNING',
      message: warning,
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  if (!prepared.preparedMemory.qualityLoopResult.passed || prepared.preparedMemory.qualityLoopResult.fixes.length > 0) {
    const qualityMessage = prepared.preparedMemory.qualityLoopResult.rejectionReason
      ?? (prepared.preparedMemory.qualityLoopResult.fixes.length > 0
        ? `Quality loop would apply ${prepared.preparedMemory.qualityLoopResult.fixes.length} fix(es) in full-auto mode.`
        : 'Quality loop reported advisory issues for this save.');
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'QUALITY_LOOP_ADVISORY',
      message: qualityMessage,
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  if (!prepared.preparedMemory.sufficiencyResult.pass) {
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'SUFFICIENCY_ADVISORY',
      message: prepared.preparedMemory.sufficiencyResult.reasons.join(' '),
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  if (!prepared.preparedMemory.templateContract.valid && templateContractBypassed) {
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'TEMPLATE_CONTRACT_ADVISORY',
      message: prepared.preparedMemory.templateContract.violations
        .map((violation) => violation.message || violation.code)
        .join('; '),
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  if (!isSaveReconsolidationEnabled()) {
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'RECONSOLIDATION_DEFERRED',
      message: 'Reconsolidation available as follow-up action. Planner-first saves do not run supersede, reinforce, or create-linked reconsolidation work by default.',
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  if (!isPostInsertEnrichmentEnabled()) {
    advisories.push(serializePlannerAdvisory(buildPlannerAdvisory({
      code: 'ENRICHMENT_DEFERRED',
      message: 'Post-insert enrichment is deferred by default. Run the enrichment backfill follow-up after applying the canonical save when immediate entities or graph links matter.',
      routeCategory,
      targetDocPath,
      targetAnchorId,
    })));
  }

  return advisories;
}

function buildAtomicPlannerReadyResult(
  params: AtomicSaveParams,
  prepared: CanonicalAtomicPrepared,
  validation: { ok: true; warnings: string[] } | { ok: false; rejection: IndexResult },
): AtomicSaveResult {
  const routeTarget = buildAtomicPlannerRouteTarget(prepared);
  const blockers: PlannerBlocker[] = [];
  const templateContractBypassed = shouldBypassTemplateContract(
    prepared.preparedMemory.sourceClassification,
    prepared.preparedMemory.sufficiencyResult,
    prepared.preparedMemory.templateContract,
  );
  if (!validation.ok) {
    blockers.push(serializePlannerBlocker(buildPlannerBlocker({
      code: 'SPEC_DOC_STRUCTURE_BLOCKER',
      message: validation.rejection.message ?? validation.rejection.rejectionReason ?? 'Planner blocked canonical save.',
      routeCategory: routeTarget.routeCategory,
      targetDocPath: routeTarget.targetDocPath,
      targetAnchorId: routeTarget.targetAnchorId ?? null,
    })));
  }
  if (!prepared.preparedMemory.templateContract.valid && !templateContractBypassed) {
    blockers.push(serializePlannerBlocker(buildPlannerBlocker({
      code: 'TEMPLATE_CONTRACT_BLOCKER',
      message: prepared.preparedMemory.templateContract.violations
        .map((violation) => violation.message || violation.code)
        .join('; '),
      routeCategory: routeTarget.routeCategory,
      targetDocPath: routeTarget.targetDocPath,
      targetAnchorId: routeTarget.targetAnchorId ?? null,
    })));
  }

  const advisories = buildAtomicPlannerAdvisories(
    prepared,
    validation.ok ? validation.warnings : (validation.rejection.warnings ?? []),
  );
  const status = blockers.length > 0 ? 'blocked' : 'planned';
  const contentPreview = prepared.preparedMemory.finalizedFileContent
    ?? prepared.preparedMemory.parsed.content
    ?? params.content;

  return {
    success: blockers.length === 0,
    filePath: routeTarget.targetDocPath,
    status,
    summary: blockers.length > 0
      ? 'Planner blocked canonical save'
      : 'Planner prepared canonical save plan',
    message: blockers.length > 0
      ? 'Planner found blocker(s) that must be resolved before the canonical save can run.'
      : 'Planner prepared a non-mutating canonical save plan.',
    plannerMode: 'plan-only',
    routeCategory: routeTarget.routeCategory,
    mergeMode: routeTarget.mergeMode,
    targetDocPath: routeTarget.targetDocPath,
    targetAnchorId: routeTarget.targetAnchorId ?? undefined,
    routeTarget,
    proposedEdits: [
      serializePlannerProposedEdit({
        targetDocPath: routeTarget.targetDocPath,
        targetAnchorId: routeTarget.targetAnchorId ?? null,
        mergeMode: routeTarget.mergeMode,
        routeCategory: routeTarget.routeCategory,
        summary: `Apply the canonical ${routeTarget.routeCategory.replace(/_/g, ' ')} update to the routed document.`,
        contentPreview: contentPreview.slice(0, 280),
      }),
    ],
    blockers,
    advisories,
    followUpActions: buildAtomicPlannerFollowUpActions(params, prepared),
  };
}

function buildAtomicPlannerAbortResult(
  params: AtomicSaveParams,
  result: AtomicSaveResult,
): AtomicSaveResult {
  const routeCategory = result.routeCategory ?? params.routeAs ?? 'drop';
  const routeTarget = serializePlannerRouteTarget({
    routeCategory,
    targetDocPath: result.targetDocPath ?? result.filePath,
    targetAnchorId: result.targetAnchorId ?? params.targetAnchorId ?? null,
    mergeMode: result.mergeMode ?? params.mergeModeHint,
  });

  return {
    success: false,
    filePath: routeTarget.targetDocPath,
    status: 'blocked',
    summary: result.summary ?? 'Planner blocked canonical save',
    message: result.message ?? result.error ?? 'Planner could not prepare a canonical save.',
    plannerMode: 'plan-only',
    routeCategory: routeTarget.routeCategory,
    mergeMode: routeTarget.mergeMode,
    targetDocPath: routeTarget.targetDocPath,
    targetAnchorId: routeTarget.targetAnchorId ?? undefined,
    routeTarget,
    proposedEdits: [],
    blockers: [
      serializePlannerBlocker(buildPlannerBlocker({
        code: result.status === 'error' ? 'PLANNER_ERROR' : 'PLANNER_BLOCKER',
        message: result.message ?? result.error ?? result.summary ?? 'Planner could not prepare a canonical save.',
        routeCategory: routeTarget.routeCategory,
        targetDocPath: routeTarget.targetDocPath,
        targetAnchorId: routeTarget.targetAnchorId ?? null,
      })),
    ],
    advisories: [],
    followUpActions: [
      serializePlannerFollowUpAction({
        action: 'apply',
        title: 'Retry in full-auto mode after resolving blockers',
        description: 'Request explicit full-auto mode once the blocking issue is fixed.',
        args: {
          filePath: params.file_path,
          plannerMode: 'full-auto',
          ...(params.routeAs ? { routeAs: params.routeAs } : {}),
          ...(params.mergeModeHint ? { mergeModeHint: params.mergeModeHint } : {}),
          ...(params.targetAnchorId ? { targetAnchorId: params.targetAnchorId } : {}),
        },
      }),
    ],
  };
}

function isCanonicalAtomicPrepared(value: unknown): value is CanonicalAtomicPrepared {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.preparedMemory === 'object'
    && candidate.preparedMemory !== null
    && typeof candidate.routing === 'object'
    && candidate.routing !== null;
}

async function processPreparedMemory(
  prepared: PreparedParsedMemory,
  filePath: string,
  options: {
    force?: boolean;
    asyncEmbedding?: boolean;
    plannerMode?: AtomicSaveParams['plannerMode'];
    persistQualityLoopContent?: boolean;
    refreshFromDiskAfterLock?: boolean;
    specFolderLockAlreadyHeld?: boolean;
    scope?: MemoryScopeMatch;
    qualityGateMode?: 'enforce' | 'warn-only';
    routing?: RoutedSaveOptions;
  } = {},
): Promise<IndexResult> {
  const {
    force = false,
    asyncEmbedding = false,
    plannerMode: requestedPlannerMode,
    persistQualityLoopContent = true,
    refreshFromDiskAfterLock = false,
    specFolderLockAlreadyHeld = false,
    scope = {},
    qualityGateMode = 'enforce',
    routing = {},
  } = options;
  const plannerMode = requestedPlannerMode ?? resolveSavePlannerMode();

  const evaluatePreparedMemory = (currentPrepared: PreparedParsedMemory): IndexResult | null => {
    const {
      parsed,
      validation,
      qualityLoopResult,
      sufficiencyResult,
      templateContract,
      sourceClassification,
    } = currentPrepared;
    const templateContractBypassed = shouldBypassTemplateContract(sourceClassification, sufficiencyResult, templateContract);

    if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
      if (qualityGateMode === 'warn-only') {
        console.warn(`[memory-save] V-rule warn-only (spec doc) for ${path.basename(filePath)}: ${qualityLoopResult.rejectionReason}`);
      } else {
        return {
          status: 'rejected',
          id: 0,
          specFolder: parsed.specFolder,
          title: parsed.title ?? '',
          triggerPhrases: parsed.triggerPhrases,
          contextType: parsed.contextType,
          importanceTier: parsed.importanceTier,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
          warnings: validation.warnings,
          rejectionReason: qualityLoopResult.rejectionReason,
          message: qualityLoopResult.rejectionReason,
        };
      }
    }

    if (!sufficiencyResult.pass) {
      if (qualityGateMode === 'warn-only') {
        console.warn(`[memory-save] Sufficiency warn-only (spec doc) for ${path.basename(filePath)}: ${sufficiencyResult.reasons.join('; ')}`);
      } else {
        return buildInsufficiencyRejectionResult(parsed, validation, sufficiencyResult);
      }
    }

    if (!templateContract.valid) {
      if (templateContractBypassed) {
        console.warn(
          `[memory-save] Template contract bypassed in ${MANUAL_FALLBACK_SOURCE_CLASSIFICATION} mode for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
        );
      } else if (qualityGateMode === 'warn-only') {
        console.warn(
          `[memory-save] Template contract warn-only (spec doc) for ${path.basename(filePath)}: ${templateContract.violations.map((v: { message?: string; rule?: string }) => v.message || v.rule).join('; ')}`,
        );
      } else {
        return buildTemplateContractRejectionResult(parsed, validation, templateContract);
      }
    }

    return null;
  };

  if (!refreshFromDiskAfterLock) {
    const earlyResult = evaluatePreparedMemory(prepared);
    if (earlyResult) {
      return earlyResult;
    }
  }

  const runWithinSpecFolderLock = async (): Promise<IndexResult> => {
    const database = requireDb();
    const activePrepared = refreshFromDiskAfterLock
      ? prepareParsedMemoryForIndexing(memoryParser.parseMemoryFile(filePath), database, {
          qualityLoopMode: 'full-auto',
        })
      : prepared;
    const lockedResult = evaluatePreparedMemory(activePrepared);
    if (lockedResult) {
      return lockedResult;
    }
    const {
      parsed,
      validation,
      finalizedFileContent,
    } = activePrepared;
    const routedFilePath = routing.targetDocPath ?? filePath;
    const routedParsed = Object.keys(routing).length > 0
      ? applyRoutedSaveHints(parsed, {
          ...routing,
          targetDocPath: routedFilePath,
        })
      : parsed;
    const recordIdentity = resolveRoutedRecordIdentity(routedParsed, routedFilePath, {
      ...routing,
      targetDocPath: routedFilePath,
    });
    const canonicalFilePath = recordIdentity.canonicalFilePath;
    const samePathDedupExclusion = {
      canonicalFilePath,
      filePath: routedFilePath,
      ...(recordIdentity.targetAnchorId != null ? { targetAnchorId: recordIdentity.targetAnchorId } : {}),
    };
    const samePathExisting = findSamePathExistingMemory(
      database,
      routedParsed.specFolder,
      canonicalFilePath,
      routedFilePath,
      scope,
      recordIdentity,
    );
    const shouldChunkContent = shouldUseChunkedIndexing(routedParsed.content, plannerMode);
    const shouldPersistFinalizedFile = persistQualityLoopContent && typeof finalizedFileContent === 'string';
    let finalizeWarning: string | null = null;

    // DEDUP: Check existing row by file path
    const existingResult = checkExistingRow(
      database,
      routedParsed,
      canonicalFilePath,
      routedFilePath,
      recordIdentity.targetAnchorId,
      force,
      validation.warnings,
      scope,
    );
    if (existingResult) return existingResult;

    // NOTE: Content-hash dedup (C5-1) moved inside BEGIN IMMEDIATE transaction
    // to eliminate TOCTOU race between check and insert.

    // EMBEDDING GENERATION (with persistent SQLite cache — REQ-S2-001)
    const embeddingResult = await generateOrCacheEmbedding(database, routedParsed, routedFilePath, asyncEmbedding);
    const {
      embedding,
      status: embeddingStatus,
      failureReason: embeddingFailureReason,
      pendingCacheWrite,
    } = embeddingResult;

    // -- the rollout: TM-04 Quality Gate (before PE gating, after embedding) --
    if (isSaveQualityGateEnabled() && isQualityGateEnabled()) {
      try {
        const qualityGateResult = runQualityGate({
          title: routedParsed.title,
          content: routedParsed.content,
          specFolder: routedParsed.specFolder,
          triggerPhrases: routedParsed.triggerPhrases,
          contextType: routedParsed.contextType,
          mode: 'legacy',
          embedding: embedding,
          findSimilar: embedding ? (emb, gateOptions) => {
            return findSimilarMemories(emb as Float32Array, {
              limit: gateOptions.limit,
              specFolder: gateOptions.specFolder,
              tenantId: scope.tenantId,
              userId: scope.userId,
              agentId: scope.agentId,
              sessionId: scope.sessionId,
            }).map(m => ({
              id: m.id,
              file_path: m.file_path,
              similarity: m.similarity,
            }));
          } : null,
        });

        if (!qualityGateResult.pass && !qualityGateResult.warnOnly && qualityGateMode !== 'warn-only') {
          console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(routedFilePath)}: ${qualityGateResult.reasons.join('; ')}`);
          return {
            status: 'rejected',
            id: 0,
            specFolder: routedParsed.specFolder,
            title: routedParsed.title ?? '',
            qualityScore: routedParsed.qualityScore,
            qualityFlags: routedParsed.qualityFlags,
            rejectionReason: `Quality gate rejected: ${qualityGateResult.reasons.join('; ')}`,
            message: `Quality gate rejected: ${qualityGateResult.reasons.join('; ')}`,
            qualityGate: {
              pass: false,
              reasons: qualityGateResult.reasons,
              layers: qualityGateResult.layers,
            },
          };
        }

        if (!qualityGateResult.pass && qualityGateMode === 'warn-only') {
          console.warn(`[memory-save] TM-04: Quality gate warn-only (spec doc) for ${path.basename(routedFilePath)}: ${qualityGateResult.reasons.join('; ')}`);
        }

        if (qualityGateResult.wouldReject) {
          console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(routedFilePath)}: ${qualityGateResult.reasons.join('; ')}`);
        }
      } catch (qgErr: unknown) {
        const message = qgErr instanceof Error ? qgErr.message : String(qgErr);
        console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
        // Quality gate errors must not block saves
      }
    }

    const duplicatePrecheck = checkContentHashDedup(
      database,
      routedParsed,
      force,
      validation.warnings,
      samePathDedupExclusion,
      scope,
    );
    if (duplicatePrecheck) {
      return duplicatePrecheck;
    }

    persistPendingEmbeddingCacheWrite(database, pendingCacheWrite, routedFilePath);

    // PE GATING
    const peResult = evaluateAndApplyPeDecision(
      database, routedParsed, embedding, force, validation.warnings, embeddingStatus, routedFilePath, scope,
    );
    if (peResult.earlyReturn) return peResult.earlyReturn;

    let reconResult: Awaited<ReturnType<typeof runReconsolidationIfEnabled>> = {
      earlyReturn: null,
      warnings: [],
    };

    // T028/T029: complete async reconsolidation planning before chunking or
    // taking the SQLite writer lock, so chunked saves do not bypass the gate
    // and BEGIN IMMEDIATE only covers synchronous DB mutation work.
    reconResult = await runReconsolidationIfEnabled(
      database,
      routedParsed,
      routedFilePath,
      force,
      embedding,
      scope,
      { plannerMode },
    );
    if (reconResult.earlyReturn) return reconResult.earlyReturn;

    if (shouldChunkContent) {
      console.error(`[memory-save] File exceeds chunking threshold (${routedParsed.content.length} chars), using chunked indexing`);
      const chunkedInsertTracker = createChunkedInsertTracker();
      const chunkedResult = await indexChunkedMemoryFile(routedFilePath, routedParsed, {
        force,
        applyPostInsertMetadata: (db, memoryId, fields) => {
          applyPostInsertMetadata(db, memoryId, fields);
          trackChunkedInsert(chunkedInsertTracker, memoryId, fields as Record<string, unknown>);
        },
      });

      if (
        peResult.supersededId != null
        && (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
      ) {
        try {
          const finalizeChunkedPeTx = database.transaction(() => {
            if (chunkedResult.id > 0) {
              recordCrossPathPeSupersedes(
                database,
                chunkedResult.id,
                peResult.supersededId,
                samePathExisting?.id ?? null,
                peResult.decision.reason,
              );
            }
            if (peResult.supersededId != null && !markMemorySuperseded(peResult.supersededId)) {
              throw new Error(`Failed to mark predecessor ${peResult.supersededId} as superseded`);
            }
          });
          finalizeChunkedPeTx.immediate();
        } catch (supersedeErr: unknown) {
          const cleanup = rollbackCreatedChunkTree(database, chunkedInsertTracker);
          const cleanupSuffix = cleanup.cleaned
            ? ' Rolled back the newly created chunk tree.'
            : cleanup.attempted && cleanup.error
              ? ` Cleanup failed: ${cleanup.error}`
              : '';
          return {
            ...chunkedResult,
            status: 'error',
            error: `Failed to mark predecessor ${peResult.supersededId} as superseded after chunked indexing: ${getAtomicSaveErrorMessage(supersedeErr)}`,
            message: `Chunked indexing succeeded, but predecessor ${peResult.supersededId} could not be superseded.${cleanupSuffix}`,
          };
        }
      }

      if (
        shouldPersistFinalizedFile
        && finalizedFileContent
        && (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
      ) {
        try {
          await finalizeMemoryFileContent(routedFilePath, finalizedFileContent);
        } catch (finalizeErr: unknown) {
          finalizeWarning = `Quality-loop file persistence failed after chunked indexing: ${finalizeErr instanceof Error ? finalizeErr.message : String(finalizeErr)}`;
          console.warn(`[memory-save] ${finalizeWarning}`);
        }
      }

      if (peResult.decision.action !== 'CREATE') {
        chunkedResult.pe_action = peResult.decision.action;
        chunkedResult.pe_reason = peResult.decision.reason;
      }
      if (peResult.supersededId != null) {
        chunkedResult.superseded_id = peResult.supersededId;
      }
      if (Array.isArray(reconResult.warnings) && reconResult.warnings.length > 0) {
        const existingWarnings = Array.isArray(chunkedResult.warnings)
          ? [...(chunkedResult.warnings as string[])]
          : [];
        chunkedResult.warnings = [...existingWarnings, ...reconResult.warnings];
      }

      return appendResultWarning(chunkedResult, finalizeWarning);
    }

    // A4 FIX: Wrap dedup-check + insert in a single transaction for DB-level
    // atomicity. Uses database.transaction() so inner transaction() calls in
    // createMemoryRecord / index_memory correctly nest via SAVEPOINTs instead
    // of failing with "cannot start a transaction within a transaction".
    // withSpecFolderLock handles in-process serialization; this transaction
    // provides defense-in-depth against multi-process races.
    let existing: { id: number; content_hash: string } | undefined;

    // C5-1: Content-hash dedup check BEFORE the write transaction — reads are
    // safe outside the transaction and this avoids an early-return inside the
    // transaction callback (which would COMMIT an empty tx unnecessarily).
    const dupResult = checkContentHashDedup(
      database,
      routedParsed,
      force,
      validation.warnings,
      samePathDedupExclusion,
      scope,
    );
    if (dupResult) {
      return dupResult;
    }

    const writeTransaction = database.transaction((): number => {
      // CREATE NEW MEMORY
      existing = findSamePathExistingMemory(
        database,
        routedParsed.specFolder,
        canonicalFilePath,
        routedFilePath,
        scope,
        recordIdentity,
      ) as { id: number; content_hash: string } | undefined;

      const memoryId = existing && existing.content_hash !== routedParsed.contentHash
        ? createAppendOnlyMemoryRecord({
            database,
            parsed: routedParsed,
            filePath: routedFilePath,
            embedding,
            embeddingFailureReason,
            predecessorMemoryId: existing.id,
            actor: 'mcp:memory_save',
          })
          : createMemoryRecord(
            database,
            routedParsed,
            routedFilePath,
            embedding,
            embeddingFailureReason,
            peResult.decision,
            scope,
            recordIdentity,
          );

      // F1.01 fix: Mark superseded memory AFTER new record creation, inside
      // the same transaction, so a creation failure rolls back both operations.
      if (peResult.supersededId != null) {
        const supersededOk = markMemorySuperseded(peResult.supersededId);
        // C5-3: Supersede failure should abort the transaction
        if (!supersededOk) {
          throw new Error(`Failed to mark predecessor ${peResult.supersededId} as superseded`);
        }
      }

      recordLineageVersion(database, {
        memoryId,
        predecessorMemoryId: existing && existing.content_hash !== routedParsed.contentHash
          ? existing.id
          : null,
        actor: 'mcp:memory_save',
        transitionEvent: existing && existing.content_hash !== routedParsed.contentHash
          ? 'SUPERSEDE'
          : 'CREATE',
      });

      return memoryId;
    });

    const id: number = writeTransaction.immediate();

    if (shouldPersistFinalizedFile && finalizedFileContent) {
      try {
        await finalizeMemoryFileContent(routedFilePath, finalizedFileContent);
      } catch (finalizeErr: unknown) {
        finalizeWarning = `[file-persistence-failed] Quality-loop file persistence failed after DB commit: ${finalizeErr instanceof Error ? finalizeErr.message : String(finalizeErr)}. DB row committed — manual file recovery may be needed.`;
        console.warn(`[memory-save] ${finalizeWarning}`);
      }
    }

    // Data integrity: clean stale auto-entities before re-extraction on update
    // When a memory is superseded or replaced in-place, purge the predecessor's
    // auto-entity rows so the entity catalog reflects only active content.
    if (existing && existing.id !== id) {
      try {
        refreshAutoEntitiesForMemory(database, existing.id, []);
        console.error(`[memory-save] Cleaned stale auto-entities for superseded memory #${existing.id}`);
      } catch (entityCleanupErr: unknown) {
        // Entity cleanup failure must not block save — log and continue
        console.warn(`[memory-save] Auto-entity cleanup for #${existing.id} failed:`, entityCleanupErr instanceof Error ? entityCleanupErr.message : String(entityCleanupErr));
      }
    }
    if (peResult.supersededId != null && peResult.supersededId !== existing?.id) {
      try {
        refreshAutoEntitiesForMemory(database, peResult.supersededId, []);
        console.error(`[memory-save] Cleaned stale auto-entities for PE-superseded memory #${peResult.supersededId}`);
      } catch (entityCleanupErr: unknown) {
        console.warn(`[memory-save] Auto-entity cleanup for PE #${peResult.supersededId} failed:`, entityCleanupErr instanceof Error ? entityCleanupErr.message : String(entityCleanupErr));
      }
    }

    // POST-INSERT ENRICHMENT: causal links, entities, summaries, entity linking
  const { causalLinksResult, enrichmentStatus, executionStatus } = await runPostInsertEnrichmentIfEnabled(
    database,
    id,
    routedParsed,
    { plannerMode },
  );

    // BUILD RESULT
    return appendResultWarning(buildIndexResult({
      database,
      existing,
      embeddingStatus,
      id,
      parsed: routedParsed,
      validation,
      reconWarnings: reconResult.warnings,
      peDecision: peResult.decision,
      embeddingFailureReason,
      asyncEmbedding,
      causalLinksResult,
      enrichmentStatus,
      enrichmentExecutionStatus: executionStatus,
      filePath: routedFilePath,
      routeCategory: routing.routeAs ?? recordIdentity.routeAs ?? undefined,
      mergeMode: routing.mergeModeHint,
      targetDocPath: routedFilePath,
      targetAnchorId: recordIdentity.targetAnchorId,
    }), finalizeWarning);
  };

  if (specFolderLockAlreadyHeld) {
    return runWithinSpecFolderLock();
  }

  return withSpecFolderLock(prepared.parsed.specFolder, runWithinSpecFolderLock);
}

/* --- 8. INDEX MEMORY FILE --- */

/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
async function indexMemoryFile(
  filePath: string,
  {
    force = false,
    parsedOverride = null as ReturnType<typeof memoryParser.parseMemoryFile> | null,
    asyncEmbedding = false,
    plannerMode,
    scope = {} as MemoryScopeMatch,
    qualityGateMode = 'enforce' as 'enforce' | 'warn-only',
    routing,
  }: {
    force?: boolean;
    parsedOverride?: ReturnType<typeof memoryParser.parseMemoryFile> | null;
    asyncEmbedding?: boolean;
    plannerMode?: AtomicSaveParams['plannerMode'];
    scope?: MemoryScopeMatch;
    qualityGateMode?: 'enforce' | 'warn-only';
    routing?: RoutedSaveOptions;
  } = {},
): Promise<IndexResult> {
  // Reuse parsed content when provided by caller to avoid a second parse.
  const parsed = parsedOverride || memoryParser.parseMemoryFile(filePath);
  const database = requireDb();
  const prepared = prepareParsedMemoryForIndexing(parsed, database);
  const validation = prepared.validation;
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  if (prepared.qualityLoopResult.fixes.length > 0 && prepared.qualityLoopResult.passed && prepared.qualityLoopResult.fixedContent) {
    console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(filePath)}`);
  }

  return processPreparedMemory(prepared, filePath, {
    force,
    asyncEmbedding,
    plannerMode,
    persistQualityLoopContent: true,
    refreshFromDiskAfterLock: parsedOverride !== null,
    scope,
    qualityGateMode,
    routing,
  });
}

/* --- 9. MEMORY SAVE HANDLER --- */

/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  const restoreBarrier = checkpoints.getRestoreBarrierStatus();

  if (restoreBarrier) {
    return createMCPErrorResponse({
      tool: 'memory_save',
      error: restoreBarrier.message,
      code: restoreBarrier.code,
      details: {
        requestId,
      },
      recovery: {
        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
        actions: ['Wait for the restore to finish', 'Retry the save request'],
        severity: 'warning',
      },
    });
  }

  const {
    filePath: file_path,
    force = false,
    dryRun = false,
    plannerMode: requestedPlannerMode,
    skipPreflight = false,
    asyncEmbedding = false,
    routeAs,
    mergeModeHint,
    targetAnchorId,
    tenantId,
    userId,
    agentId,
    sessionId,
    provenanceSource,
    provenanceActor,
    governedAt,
    retentionPolicy,
    deleteAfter,
  } = args;
  const plannerMode = requestedPlannerMode ?? resolveSavePlannerMode();
  const shouldPlanCanonicalSave = !dryRun && plannerMode !== 'full-auto' && Boolean(routeAs || mergeModeHint || targetAnchorId);

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  await checkDatabaseUpdated();

  const validatedPath: string = validateFilePathLocal(file_path);
  const database = requireDb();

  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be a canonical spec document under specs/**/ (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, research.md, description.json, graph-metadata.json) or a constitutional memory under .opencode/skill/*/constitutional/');
  }

  if (typeof database.exec === 'function') {
    ensureGovernanceRuntime(database);
  }

  const governanceDecision = validateGovernedIngest({
    tenantId,
    userId,
    agentId,
    sessionId,
    provenanceSource,
    provenanceActor,
    governedAt,
    retentionPolicy,
    deleteAfter,
  });

  if (!governanceDecision.allowed) {
    recordGovernanceAudit(database, {
      action: 'memory_save',
      decision: 'deny',
      tenantId,
      userId,
      agentId,
      sessionId,
      reason: governanceDecision.reason ?? 'governance_rejected',
      metadata: { issues: governanceDecision.issues },
    });
    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  }

  // Shared dry-run response builder — both the skipPreflight and post-preflight
  // dry-run branches delegate here to prevent near-duplicate envelope drift.
  async function buildDryRunResponse(
    preparedDryRun: PreparedParsedMemory,
    parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
    preflightValidation: {
      skipped: boolean;
      errors: preflight.PreflightIssue[];
      warnings: preflight.PreflightResult['warnings'];
      details: Record<string, unknown>;
      wouldPass: boolean;
    },
  ) {
    const templateContractPass = preparedDryRun.templateContract.valid
      || shouldBypassTemplateContract(
        preparedDryRun.sourceClassification,
        preparedDryRun.sufficiencyResult,
        preparedDryRun.templateContract,
      );
    const bypassMode = shouldBypassTemplateContract(
      preparedDryRun.sourceClassification,
      preparedDryRun.sufficiencyResult,
      preparedDryRun.templateContract,
    );
    const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
    const dryRunSummary = !preflightValidation.wouldPass
      ? `Pre-flight validation failed: ${preflightValidation.errors.length} error(s)`
      : bypassMode
        ? 'Dry-run would pass in manual-fallback mode with deferred indexing.'
        : buildDryRunSummary(
            preparedDryRun.sufficiencyResult,
            preparedDryRun.qualityLoopResult,
            preparedDryRun.templateContract,
          );

    const wouldPass = preflightValidation.wouldPass
      && preparedDryRun.validation.valid
      && preparedDryRun.qualityLoopResult.rejected !== true
      && templateContractPass
      && preparedDryRun.sufficiencyResult.pass;

    const hints: string[] = !preflightValidation.wouldPass
      ? ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation']
      : templateContractPass && preparedDryRun.sufficiencyResult.pass
        ? [
            'Dry-run complete - no changes made',
            ...(preflightValidation.skipped ? ['Pre-flight checks were skipped because skipPreflight=true'] : []),
            ...(bypassMode
              ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
              : []),
          ]
        : [
            'Dry-run complete - no changes made',
            ...(preflightValidation.skipped ? ['Pre-flight checks were skipped because skipPreflight=true'] : []),
            ...(!preparedDryRun.templateContract.valid
              ? ['Rendered content must match the memory template contract before indexing']
              : []),
            'Not enough context was available to save a durable memory',
            ...(!preflightValidation.skipped
              ? ['Add concrete file, tool, decision, blocker, next action, or outcome evidence and retry']
              : []),
          ];

    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: dryRunSummary,
      data: {
        status: 'dry_run',
        would_pass: wouldPass,
        file_path: validatedPath,
        spec_folder: parsed.specFolder,
        title: parsed.title,
        validation: preflightValidation.skipped
          ? { skipped: true, errors: [], warnings: [], details: { skipped: true } }
          : { errors: preflightValidation.errors, warnings: preflightValidation.warnings, details: preflightValidation.details },
        qualityLoop: {
          passed: preparedDryRun.qualityLoopResult.passed,
          rejected: preparedDryRun.qualityLoopResult.rejected,
          fixes: preparedDryRun.qualityLoopResult.fixes,
          rejectionReason: preparedDryRun.qualityLoopResult.rejectionReason,
        },
        templateContract: preparedDryRun.templateContract,
        sufficiency: preparedDryRun.sufficiencyResult,
        specDocHealth: preparedDryRun.specDocHealth,
        rejectionCode: preparedDryRun.sufficiencyResult.pass ? undefined : MEMORY_SUFFICIENCY_REJECTION_CODE,
        message: dryRunSummary,
      },
      hints,
    });
  }

  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  if (dryRun && skipPreflight) {
    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database, {
      emitEvalMetrics: false,
      qualityLoopMode: 'advisory',
    });
    return buildDryRunResponse(preparedDryRun, parsedForDryRun, {
      skipped: true, errors: [], warnings: [], details: {}, wouldPass: true,
    });
  }

  const saveScope: MemoryScopeMatch = {
    tenantId: governanceDecision.normalized.tenantId,
    userId: governanceDecision.normalized.userId ?? null,
    agentId: governanceDecision.normalized.agentId ?? null,
    sessionId: governanceDecision.normalized.sessionId,
  };

  // PRE-FLIGHT VALIDATION
  let parsedForPreflight: ReturnType<typeof memoryParser.parseMemoryFile> | null = null;
  if (!skipPreflight) {
    parsedForPreflight = memoryParser.parseMemoryFile(validatedPath);

    const preflightResult = preflight.runPreflight(
      {
        content: parsedForPreflight.content,
        file_path: validatedPath,
        spec_folder: parsedForPreflight.specFolder,
        database: database,
        find_similar: findSimilarMemories as Parameters<typeof preflight.runPreflight>[0]['find_similar'],
        tenantId: saveScope.tenantId ?? undefined,
        userId: saveScope.userId ?? undefined,
        agentId: saveScope.agentId ?? undefined,
      },
      {
        dry_run: dryRun,
        check_anchors: true,
        check_duplicates: !force,
        check_similar: false,
        check_tokens: true,
        check_size: true,
        strict_anchors: false,
      }
    );

    if (dryRun) {
      let preparedDryRun: PreparedParsedMemory;
      try {
        preparedDryRun = prepareParsedMemoryForIndexing(parsedForPreflight, database, {
          emitEvalMetrics: false,
          qualityLoopMode: 'advisory',
        });
      } catch (error: unknown) {
        if (error instanceof VRuleUnavailableError) {
          return createMCPErrorResponse({
            tool: 'memory_save',
            error: error.message,
            code: 'E_RUNTIME',
            details: { requestId },
            recovery: {
              hint: 'Build the Spec Kit scripts workspace and retry the save.',
              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
              severity: 'warning',
            },
          });
        }
        throw error;
      }
      return buildDryRunResponse(preparedDryRun, parsedForPreflight, {
        skipped: false,
        errors: preflightResult.errors,
        warnings: preflightResult.warnings,
        details: preflightResult.details,
        wouldPass: preflightResult.dry_run_would_pass ?? preflightResult.pass,
      });
    }

    if (!preflightResult.pass) {
      if (shouldPlanCanonicalSave) {
        return buildPlannerResponse({
          planner: {
            filePath: validatedPath,
            specFolder: parsedForPreflight.specFolder,
            title: parsedForPreflight.title ?? path.basename(validatedPath),
            status: 'blocked',
            message: 'Planner found blocker(s) during pre-flight validation.',
            plannerMode: 'plan-only',
            routeTarget: serializePlannerRouteTarget({
              routeCategory: routeAs ?? 'drop',
              targetDocPath: validatedPath,
              targetAnchorId: targetAnchorId ?? null,
              mergeMode: mergeModeHint,
            }),
            proposedEdits: [],
            blockers: preflightResult.errors.map((entry: string | { message: string; code?: string }) =>
              serializePlannerBlocker(buildPlannerBlocker({
                code: typeof entry === 'string' ? 'PREFLIGHT_BLOCKER' : (entry.code ?? 'PREFLIGHT_BLOCKER'),
                message: typeof entry === 'string' ? entry : entry.message,
                routeCategory: routeAs ?? undefined,
                targetDocPath: validatedPath,
                targetAnchorId: targetAnchorId ?? null,
              }))
            ),
            advisories: preflightResult.warnings.map((entry: string | { message: string }) =>
              serializePlannerAdvisory(buildPlannerAdvisory({
                code: 'PREFLIGHT_WARNING',
                message: typeof entry === 'string' ? entry : entry.message,
                routeCategory: routeAs ?? undefined,
                targetDocPath: validatedPath,
                targetAnchorId: targetAnchorId ?? null,
              }))
            ),
            followUpActions: [
              serializePlannerFollowUpAction({
                action: 'apply',
                title: 'Retry with full-auto after fixing pre-flight blockers',
                description: 'Fix the reported blockers, then request explicit full-auto mode.',
                args: {
                  filePath: validatedPath,
                  plannerMode: 'full-auto',
                  ...(routeAs ? { routeAs } : {}),
                  ...(mergeModeHint ? { mergeModeHint } : {}),
                  ...(targetAnchorId ? { targetAnchorId } : {}),
                },
              }),
            ],
          },
        });
      }

      const errorMessages = preflightResult.errors.map((e: string | { message: string }) =>
        typeof e === 'string' ? e : e.message
      ).join('; ');

      // Use the actual error code from the
      // First validation error instead of hardcoding ANCHOR_FORMAT_INVALID.
      const firstError = preflightResult.errors[0];
      const errorCode = (typeof firstError === 'object' && firstError?.code)
        ? firstError.code
        : preflight.PreflightErrorCodes.ANCHOR_FORMAT_INVALID;
      throw new preflight.PreflightError(
        errorCode,
        `Pre-flight validation failed: ${errorMessages}`,
        {
          errors: preflightResult.errors,
          warnings: preflightResult.warnings,
          recoverable: true,
          suggestion: 'Fix the validation errors and retry, or use skipPreflight=true to bypass',
        }
      );
    }

    if (preflightResult.warnings.length > 0) {
      console.warn(`[preflight] ${validatedPath}: ${preflightResult.warnings.length} warning(s)`);
      preflightResult.warnings.forEach((w: string | { message: string }) => {
        const msg = typeof w === 'string' ? w : w.message;
        console.warn(`[preflight]   - ${msg}`);
      });
    }
  }

  if (shouldPlanCanonicalSave) {
    const plannerResult = await atomicSaveMemory({
      file_path: validatedPath,
      content: fs.readFileSync(validatedPath, 'utf8'),
      plannerMode,
      ...(routeAs ? { routeAs } : {}),
      ...(mergeModeHint ? { mergeModeHint } : {}),
      ...(targetAnchorId ? { targetAnchorId } : {}),
    }, { force });

    return buildPlannerResponse({
      planner: {
        filePath: validatedPath,
        specFolder: (parsedForPreflight ?? memoryParser.parseMemoryFile(validatedPath)).specFolder,
        title: (parsedForPreflight ?? memoryParser.parseMemoryFile(validatedPath)).title ?? path.basename(validatedPath),
        status: plannerResult.status === 'blocked' ? 'blocked' : 'planned',
        message: plannerResult.message ?? 'Planner prepared a non-mutating canonical save plan.',
        plannerMode: 'plan-only',
        routeTarget: plannerResult.routeTarget ?? serializePlannerRouteTarget({
          routeCategory: routeAs ?? 'drop',
          targetDocPath: plannerResult.targetDocPath ?? validatedPath,
          targetAnchorId: plannerResult.targetAnchorId ?? targetAnchorId ?? null,
          mergeMode: plannerResult.mergeMode ?? mergeModeHint,
        }),
        proposedEdits: plannerResult.proposedEdits ?? [],
        blockers: plannerResult.blockers ?? [],
        advisories: plannerResult.advisories ?? [],
        followUpActions: plannerResult.followUpActions ?? [],
      },
    });
  }

  let result: IndexResult;
  try {
    result = await indexMemoryFile(validatedPath, {
      force,
      parsedOverride: parsedForPreflight,
      asyncEmbedding,
      plannerMode,
      scope: saveScope,
      routing: buildRoutedSaveOptions(validatedPath, routeAs, mergeModeHint, targetAnchorId),
    });
  } catch (error: unknown) {
    if (error instanceof VRuleUnavailableError) {
      return createMCPErrorResponse({
        tool: 'memory_save',
        error: error.message,
        code: 'E_RUNTIME',
        details: { requestId },
        recovery: {
          hint: 'Build the Spec Kit scripts workspace and retry the save.',
          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
          severity: 'warning',
        },
      });
    }
    throw error;
  }

  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
    // B13 + H5 FIX: Wrap governance metadata in a transaction with rollback on failure.
    // If governance application fails, delete the orphaned memory row to prevent
    // persisted rows without tenant/session/retention metadata.
    const applyGovernanceTx = database.transaction(() => {
      applyPostInsertMetadata(database, result.id, buildGovernancePostInsertFields(governanceDecision));
      recordGovernanceAudit(database, {
        action: 'memory_save',
        decision: 'allow',
        memoryId: result.id,
        tenantId,
        userId,
        agentId,
        sessionId,
        reason: 'governed_ingest',
        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
      });
    });
    try {
      applyGovernanceTx();
    } catch (govErr: unknown) {
      // C2 FIX: Use full delete helper to clean up ALL ancillary records
      // (vec_memories, BM25 index, causal edges, projections, etc.)
      // not just memory_index, to prevent orphaned search phantoms.
      console.error('[memory-save] Governance metadata failed, removing orphaned memory:', govErr instanceof Error ? govErr.message : String(govErr));
      try { delete_memory_from_database(database, result.id); } catch (_: unknown) { /* best-effort cleanup */ }
      throw govErr;
    }
  }

  return buildSaveResponse({ result, filePath: file_path, asyncEmbedding, requestId });
}

/* --- 10. ATOMIC MEMORY SAVE --- */

/**
 * Save memory content to disk with retry + rollback guarded indexing.
 *
 * The file write promotes a pending file while holding the per-spec-folder
 * mutex so concurrent saves cannot overwrite each other between disk
 * promotion and indexing. If indexing later fails, the original file content
 * is restored before the error is returned and before the lock is released.
 */
async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
  const { file_path, routeAs, mergeModeHint, targetAnchorId } = params;
  const database = requireDb();
  const routing = buildRoutedSaveOptions(file_path, routeAs, mergeModeHint, targetAnchorId);
  const plannerMode = params.plannerMode ?? resolveSavePlannerMode();

  if (shouldUseCanonicalRouting(params) && plannerMode !== 'full-auto') {
    const canonicalPrepared = await buildCanonicalAtomicPreparedSave(params, database);
    if (canonicalPrepared.status !== 'ready') {
      return buildAtomicPlannerAbortResult(params, canonicalPrepared.result);
    }

    return buildAtomicPlannerReadyResult(
      params,
      canonicalPrepared.prepared,
      validateCanonicalPreparedSave(canonicalPrepared.prepared),
    );
  }

  return atomicIndexMemory<PreparedParsedMemory | CanonicalAtomicPrepared>(params, options, {
    prepare: async (currentParams, _context) => {
      if (shouldUseCanonicalRouting(currentParams)) {
        const canonicalPrepared = await buildCanonicalAtomicPreparedSave(currentParams, database);
        if (canonicalPrepared.status !== 'ready') {
          return canonicalPrepared;
        }

        return {
          status: 'ready',
          prepared: canonicalPrepared.prepared,
          specFolder: canonicalPrepared.prepared.preparedMemory.parsed.specFolder,
          persistedContent: canonicalPrepared.persistedContent,
          persistedFilePath: canonicalPrepared.persistedFilePath,
        } as const;
      }

      const { file_path: currentFilePath, content: currentContent } = currentParams;
      const prepared = prepareParsedMemoryForIndexing(
        memoryParser.parseMemoryContent(currentFilePath, currentContent),
        database,
        {
          qualityLoopMode: currentParams.plannerMode === 'full-auto' ? 'full-auto' : 'advisory',
        },
      );

      if (!prepared.validation.valid) {
        return {
          status: 'abort',
          result: {
            success: false,
            filePath: currentFilePath,
            status: 'error',
            summary: 'Atomic save preflight failed',
            message: 'Parsed content failed validation before atomic save',
            error: `Validation failed: ${prepared.validation.errors.join(', ')}`,
          },
        } as const;
      }

      if (prepared.qualityLoopResult.fixes.length > 0 && prepared.qualityLoopResult.passed && prepared.qualityLoopResult.fixedContent) {
        console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(currentFilePath)} before pending-file promotion`);
      }

      return {
        status: 'ready',
        prepared,
        specFolder: prepared.parsed.specFolder,
        persistedContent: prepared.qualityLoopResult.passed && prepared.qualityLoopResult.fixedContent
          ? prepared.qualityLoopResult.fixedContent
          : currentContent,
      } as const;
    },
    indexPrepared: ({ ready, params: currentParams, force }) => {
      const effectiveFilePath = ready.persistedFilePath ?? currentParams.file_path;
      const routedPrepared = isCanonicalAtomicPrepared(ready.prepared)
        ? ready.prepared
        : null;

      if (routedPrepared) {
        const validationResult = validateCanonicalPreparedSave(routedPrepared);
        if (!validationResult.ok) {
          return validationResult.rejection;
        }

        return processPreparedMemory(routedPrepared.preparedMemory, effectiveFilePath, {
          force,
          asyncEmbedding: true,
          plannerMode: currentParams.plannerMode,
          persistQualityLoopContent: false,
          specFolderLockAlreadyHeld: true,
          qualityGateMode: 'warn-only',
          routing: routedPrepared.routing,
        }).then((result) => {
          for (const warning of validationResult.warnings) {
            appendResultWarning(result, warning);
          }
          return result;
        });
      }

      return processPreparedMemory(ready.prepared as PreparedParsedMemory, currentParams.file_path, {
        force,
        asyncEmbedding: true,
        plannerMode: currentParams.plannerMode,
        persistQualityLoopContent: false,
        specFolderLockAlreadyHeld: true,
        routing: buildRoutedSaveOptions(currentParams.file_path, currentParams.routeAs, currentParams.mergeModeHint, currentParams.targetAnchorId),
      });
    },
    getPendingPath: (currentFilePath) => `${transactionManager.getPendingPath(currentFilePath)}.${randomUUID().slice(0, 8)}`,
    withSpecFolderLock,
    captureOriginalState: captureAtomicSaveOriginalState,
    restoreOriginalState: restoreAtomicSaveOriginalState,
    cleanupPendingFile: cleanupAtomicSavePendingFile,
    writePendingAndPromote: (pendingPath, currentFilePath, persistedContent) => {
      fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
      fs.writeFileSync(pendingPath, persistedContent, 'utf-8');
      fs.renameSync(pendingPath, currentFilePath);
    },
    mapSuccessResult: (indexResult, context) => {
      const effectiveFilePath = context.ready.persistedFilePath ?? file_path;
      const routedRouteCategory = indexResult.routeCategory ?? routing?.routeAs;
      const routedMergeMode = indexResult.mergeMode ?? routing?.mergeModeHint;
      const routedTargetDocPath = indexResult.targetDocPath ?? effectiveFilePath;

      if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
        applyPostInsertMetadata(database, indexResult.id, {});
      }

      const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
      let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
      if (shouldEmitPostMutationFeedback) {
        let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
        try {
          postMutationHooks = runPostMutationHooks('atomic-save', {
            filePath: routedTargetDocPath,
            specFolder: indexResult.specFolder,
            memoryId: indexResult.id,
          });
        } catch (hookError: unknown) {
          const msg = hookError instanceof Error ? hookError.message : String(hookError);
          postMutationHooks = {
            latencyMs: 0, triggerCacheCleared: false,
            constitutionalCacheCleared: false, toolCacheInvalidated: 0,
            graphSignalsCacheCleared: false, coactivationCacheCleared: false,
            errors: [msg],
          };
        }
        postMutationFeedback = buildMutationHookFeedback('atomic-save', postMutationHooks);
      }

      const message = indexResult.message ?? (
        indexResult.status === 'duplicate'
          ? 'Memory skipped (duplicate content)'
          : `Memory ${indexResult.status} successfully`
      );
      const hints: string[] = [];

      if (indexResult.embeddingStatus === 'pending') {
        hints.push('Memory will be fully indexed when embedding provider becomes available');
      }
      if (indexResult.embeddingStatus === 'partial') {
        hints.push('Large file indexed via chunking: parent record + individual chunk records with embeddings');
      }
      if (postMutationFeedback) {
        hints.push(...postMutationFeedback.hints);
      } else if (indexResult.status === 'duplicate') {
        hints.push('Duplicate content matched an existing indexed memory, so caches were left unchanged');
      }

      return {
        success: true,
        filePath: routedTargetDocPath,
        status: indexResult.status,
        id: indexResult.id,
        specFolder: indexResult.specFolder,
        title: indexResult.title,
        summary: message,
        message,
        embeddingStatus: indexResult.embeddingStatus,
        ...(routedRouteCategory ? { routeCategory: routedRouteCategory } : {}),
        ...(routedMergeMode ? { mergeMode: routedMergeMode } : {}),
        ...(routedTargetDocPath ? { targetDocPath: routedTargetDocPath } : {}),
        ...(indexResult.targetAnchorId ? { targetAnchorId: indexResult.targetAnchorId } : {}),
        ...(postMutationFeedback ? { postMutationHooks: postMutationFeedback.data } : {}),
        ...(hints.length > 0 ? { hints } : {}),
      };
    },
  });
}

/** Return transaction manager metrics for atomicity monitoring */
function getAtomicityMetrics(): Record<string, unknown> {
  return transactionManager.getMetrics();
}

/* --- 12. EXPORTS --- */

export {
  // Primary exports (defined in this module)
  indexMemoryFile,
  indexChunkedMemoryFile,
  handleMemorySave,
  atomicSaveMemory,
  getAtomicityMetrics,
};

// Backward-compatible aliases (snake_case) — only for symbols defined in this module
const index_memory_file = indexMemoryFile;
const index_chunked_memory_file = indexChunkedMemoryFile;
const handle_memory_save = handleMemorySave;
const atomic_save_memory = atomicSaveMemory;
const get_atomicity_metrics = getAtomicityMetrics;

export {
  index_memory_file,
  index_chunked_memory_file,
  handle_memory_save,
  atomic_save_memory,
  get_atomicity_metrics,
};
