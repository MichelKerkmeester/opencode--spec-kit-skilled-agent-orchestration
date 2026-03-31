// ───────────────────────────────────────────────────────────────
// MODULE: Memory Save Handler
// ───────────────────────────────────────────────────────────────
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { randomUUID } from 'node:crypto';
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
import { isSaveQualityGateEnabled } from '../lib/search/search-flags.js';

import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import { findSimilarMemories } from './pe-gating.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator.js';
import { applyPostInsertMetadata } from './save/db-helpers.js';
import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
import {
  buildGovernancePostInsertFields,
  ensureGovernanceRuntime,
  recordGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance.js';
import {
  assertSharedSpaceAccess,
  recordSharedConflict,
} from '../lib/collab/shared-spaces.js';
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
  SaveArgs,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
} from './save/index.js';
import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
import { runPostInsertEnrichment } from './save/post-insert.js';
import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
import { createMCPErrorResponse } from '../lib/response/envelope.js';

// Extracted sub-modules
import { withSpecFolderLock } from './save/spec-folder-mutex.js';
import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
import {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
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

const STANDARD_MEMORY_TEMPLATE_MARKERS = [
  '## continue session',
  '## recovery hints',
  '<!-- memory metadata -->',
];

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
  });
  parsed.qualityScore = qualityLoopResult.score.total;
  parsed.qualityFlags = qualityLoopResult.score.issues;
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
  // parsed.specFolder is a relative key (e.g., "02--system-spec-kit/100-feature"),
  // so resolve the absolute spec folder by walking up from the memory file path.
  let specDocHealth: SpecDocHealthResult | null = null;
  if (parsed.specFolder && parsed.filePath) {
    try {
      const absFilePath = path.resolve(parsed.filePath);
      // Memory files live at .../NNN-name/memory/*.md — walk up to the spec folder
      const memoryDir = path.dirname(absFilePath);
      const parentDir = path.dirname(memoryDir);
      // Verify this is actually a spec folder (has spec.md)
      const specMdPath = path.join(parentDir, 'spec.md');
      if (fs.existsSync(specMdPath)) {
        specDocHealth = evaluateSpecDocHealth(parentDir);
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

async function processPreparedMemory(
  prepared: PreparedParsedMemory,
  filePath: string,
  options: {
    force?: boolean;
    asyncEmbedding?: boolean;
    persistQualityLoopContent?: boolean;
    refreshFromDiskAfterLock?: boolean;
    specFolderLockAlreadyHeld?: boolean;
    scope?: MemoryScopeMatch;
    qualityGateMode?: 'enforce' | 'warn-only';
  } = {},
): Promise<IndexResult> {
  const {
    force = false,
    asyncEmbedding = false,
    persistQualityLoopContent = true,
    refreshFromDiskAfterLock = false,
    specFolderLockAlreadyHeld = false,
    scope = {},
    qualityGateMode = 'enforce',
  } = options;

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
      ? prepareParsedMemoryForIndexing(memoryParser.parseMemoryFile(filePath), database)
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
    const canonicalFilePath = getCanonicalPathKey(filePath);
    const samePathExisting = findSamePathExistingMemory(
      database,
      parsed.specFolder,
      canonicalFilePath,
      filePath,
      scope,
    );
    const shouldChunkContent = needsChunking(parsed.content);
    const shouldPersistFinalizedFile = persistQualityLoopContent && typeof finalizedFileContent === 'string';
    let finalizeWarning: string | null = null;

    // DEDUP: Check existing row by file path
    const existingResult = checkExistingRow(
      database,
      parsed,
      canonicalFilePath,
      filePath,
      force,
      validation.warnings,
      scope,
    );
    if (existingResult) return existingResult;

    // NOTE: Content-hash dedup (C5-1) moved inside BEGIN IMMEDIATE transaction
    // to eliminate TOCTOU race between check and insert.

    // EMBEDDING GENERATION (with persistent SQLite cache — REQ-S2-001)
    const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
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
          title: parsed.title,
          content: parsed.content,
          specFolder: parsed.specFolder,
          triggerPhrases: parsed.triggerPhrases,
          contextType: parsed.contextType,
          embedding: embedding,
          findSimilar: embedding ? (emb, gateOptions) => {
            return findSimilarMemories(emb as Float32Array, {
              limit: gateOptions.limit,
              specFolder: gateOptions.specFolder,
              tenantId: scope.tenantId,
              userId: scope.userId,
              agentId: scope.agentId,
              sessionId: scope.sessionId,
              sharedSpaceId: scope.sharedSpaceId,
            }).map(m => ({
              id: m.id,
              file_path: m.file_path,
              similarity: m.similarity,
            }));
          } : null,
        });

        if (!qualityGateResult.pass && !qualityGateResult.warnOnly && qualityGateMode !== 'warn-only') {
          console.error(`[memory-save] TM-04: Quality gate REJECTED save for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
          return {
            status: 'rejected',
            id: 0,
            specFolder: parsed.specFolder,
            title: parsed.title ?? '',
            qualityScore: parsed.qualityScore,
            qualityFlags: parsed.qualityFlags,
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
          console.warn(`[memory-save] TM-04: Quality gate warn-only (spec doc) for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
        }

        if (qualityGateResult.wouldReject) {
          console.warn(`[memory-save] TM-04: Quality gate WARN-ONLY for ${path.basename(filePath)}: ${qualityGateResult.reasons.join('; ')}`);
        }
      } catch (qgErr: unknown) {
        const message = qgErr instanceof Error ? qgErr.message : String(qgErr);
        console.warn(`[memory-save] TM-04: Quality gate error (proceeding with save): ${message}`);
        // Quality gate errors must not block saves
      }
    }

    const duplicatePrecheck = checkContentHashDedup(database, parsed, force, validation.warnings, {
      canonicalFilePath,
      filePath,
    }, scope);
    if (duplicatePrecheck) {
      return duplicatePrecheck;
    }

    persistPendingEmbeddingCacheWrite(database, pendingCacheWrite, filePath);

    // PE GATING
    const peResult = evaluateAndApplyPeDecision(
      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath, scope,
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
      parsed,
      filePath,
      force,
      embedding,
      scope,
    );
    if (reconResult.earlyReturn) return reconResult.earlyReturn;

    if (shouldChunkContent) {
      console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
      const chunkedInsertTracker = createChunkedInsertTracker();
      const chunkedResult = await indexChunkedMemoryFile(filePath, parsed, {
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
          await finalizeMemoryFileContent(filePath, finalizedFileContent);
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
    const dupResult = checkContentHashDedup(database, parsed, force, validation.warnings, {
      canonicalFilePath,
      filePath,
    }, scope);
    if (dupResult) {
      return dupResult;
    }

    const writeTransaction = database.transaction((): number => {
      // CREATE NEW MEMORY
      existing = findSamePathExistingMemory(
        database,
        parsed.specFolder,
        canonicalFilePath,
        filePath,
        scope,
      ) as { id: number; content_hash: string } | undefined;

      const memoryId = existing && existing.content_hash !== parsed.contentHash
        ? createAppendOnlyMemoryRecord({
            database,
            parsed,
            filePath,
            embedding,
            embeddingFailureReason,
            predecessorMemoryId: existing.id,
            actor: 'mcp:memory_save',
          })
        : createMemoryRecord(
            database,
            parsed,
            filePath,
            embedding,
            embeddingFailureReason,
            peResult.decision,
            scope,
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
        predecessorMemoryId: existing && existing.content_hash !== parsed.contentHash
          ? existing.id
          : null,
        actor: 'mcp:memory_save',
        transitionEvent: existing && existing.content_hash !== parsed.contentHash
          ? 'SUPERSEDE'
          : 'CREATE',
      });

      return memoryId;
    });

    const id: number = writeTransaction.immediate();

    if (shouldPersistFinalizedFile && finalizedFileContent) {
      try {
        await finalizeMemoryFileContent(filePath, finalizedFileContent);
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
    const { causalLinksResult, enrichmentStatus } = await runPostInsertEnrichment(database, id, parsed);

    // BUILD RESULT
    return appendResultWarning(buildIndexResult({
      database,
      existing,
      embeddingStatus,
      id,
      parsed,
      validation,
      reconWarnings: reconResult.warnings,
      peDecision: peResult.decision,
      embeddingFailureReason,
      asyncEmbedding,
      causalLinksResult,
      enrichmentStatus,
      filePath,
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
    scope = {} as MemoryScopeMatch,
    qualityGateMode = 'enforce' as 'enforce' | 'warn-only',
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
    persistQualityLoopContent: true,
    refreshFromDiskAfterLock: parsedOverride !== null,
    scope,
    qualityGateMode,
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
    skipPreflight = false,
    asyncEmbedding = false,
    tenantId,
    userId,
    agentId,
    sessionId,
    sharedSpaceId,
    provenanceSource,
    provenanceActor,
    governedAt,
    retentionPolicy,
    deleteAfter,
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  await checkDatabaseUpdated();

  const validatedPath: string = validateFilePathLocal(file_path);
  const database = requireDb();

  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
  }

  if (typeof database.exec === 'function') {
    ensureGovernanceRuntime(database);
  }

  const governanceDecision = validateGovernedIngest({
    tenantId,
    userId,
    agentId,
    sessionId,
    sharedSpaceId,
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
      sharedSpaceId,
      reason: governanceDecision.reason ?? 'governance_rejected',
      metadata: { issues: governanceDecision.issues },
    });
    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  }

  if (sharedSpaceId) {
    const access = assertSharedSpaceAccess(database, {
      tenantId,
      userId,
      agentId,
      sessionId,
      sharedSpaceId,
    }, sharedSpaceId, 'editor');
    if (!access.allowed) {
      recordGovernanceAudit(database, {
        action: 'memory_save_shared_space',
        decision: 'deny',
        tenantId,
        userId,
        agentId,
        sessionId,
        sharedSpaceId,
        reason: access.reason ?? 'shared_space_denied',
      });
      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
    }
  }

  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  if (dryRun && skipPreflight) {
    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database, {
      emitEvalMetrics: false,
    });
    const templateContractPass = preparedDryRun.templateContract.valid
      || shouldBypassTemplateContract(
        preparedDryRun.sourceClassification,
        preparedDryRun.sufficiencyResult,
        preparedDryRun.templateContract,
      );
    const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
    const dryRunSummary = shouldBypassTemplateContract(
      preparedDryRun.sourceClassification,
      preparedDryRun.sufficiencyResult,
      preparedDryRun.templateContract,
    )
      ? 'Dry-run would pass in manual-fallback mode with deferred indexing.'
      : buildDryRunSummary(
          preparedDryRun.sufficiencyResult,
          preparedDryRun.qualityLoopResult,
          preparedDryRun.templateContract,
        );

    return createMCPSuccessResponse({
      tool: 'memory_save',
      summary: dryRunSummary,
      data: {
        status: 'dry_run',
        would_pass: preparedDryRun.validation.valid
          && preparedDryRun.qualityLoopResult.rejected !== true
          && templateContractPass
          && preparedDryRun.sufficiencyResult.pass,
        file_path: validatedPath,
        spec_folder: parsedForDryRun.specFolder,
        title: parsedForDryRun.title,
        validation: {
          skipped: true,
          errors: [],
          warnings: [],
          details: { skipped: true },
        },
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
      hints: templateContractPass && preparedDryRun.sufficiencyResult.pass
        ? [
            'Dry-run complete - no changes made',
            'Pre-flight checks were skipped because skipPreflight=true',
            ...(shouldBypassTemplateContract(
              preparedDryRun.sourceClassification,
              preparedDryRun.sufficiencyResult,
              preparedDryRun.templateContract,
            )
              ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
              : []),
          ]
        : [
            'Dry-run complete - no changes made',
            'Pre-flight checks were skipped because skipPreflight=true',
            ...(!preparedDryRun.templateContract.valid
              ? ['Rendered content must match the memory template contract before indexing']
              : []),
            'Not enough context was available to save a durable memory',
          ],
    });
  }

  const saveScope: MemoryScopeMatch = {
    tenantId: governanceDecision.normalized.tenantId,
    userId: governanceDecision.normalized.userId ?? null,
    agentId: governanceDecision.normalized.agentId ?? null,
    sessionId: governanceDecision.normalized.sessionId,
    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
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
        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
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
      const templateContractPass = preparedDryRun.templateContract.valid
        || shouldBypassTemplateContract(
          preparedDryRun.sourceClassification,
          preparedDryRun.sufficiencyResult,
          preparedDryRun.templateContract,
        );
      const { createMCPSuccessResponse } = await import('../lib/response/envelope.js');
      const dryRunSummary = !preflightResult.dry_run_would_pass
        ? `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`
        : shouldBypassTemplateContract(
            preparedDryRun.sourceClassification,
            preparedDryRun.sufficiencyResult,
            preparedDryRun.templateContract,
          )
          ? 'Dry-run would pass in manual-fallback mode with deferred indexing.'
          : buildDryRunSummary(
              preparedDryRun.sufficiencyResult,
              preparedDryRun.qualityLoopResult,
              preparedDryRun.templateContract,
            );

      return createMCPSuccessResponse({
        tool: 'memory_save',
        summary: dryRunSummary,
        data: {
          status: 'dry_run',
          would_pass: preflightResult.dry_run_would_pass
            && preparedDryRun.validation.valid
            && preparedDryRun.qualityLoopResult.rejected !== true
            && templateContractPass
            && preparedDryRun.sufficiencyResult.pass,
          file_path: validatedPath,
          spec_folder: parsedForPreflight.specFolder,
          title: parsedForPreflight.title,
          validation: {
            errors: preflightResult.errors,
            warnings: preflightResult.warnings,
            details: preflightResult.details,
          },
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
        hints: !preflightResult.dry_run_would_pass
          ? ['Fix validation errors before saving', 'Use skipPreflight: true to bypass validation']
          : templateContractPass && preparedDryRun.sufficiencyResult.pass
            ? [
                'Dry-run complete - no changes made',
                ...(shouldBypassTemplateContract(
                  preparedDryRun.sourceClassification,
                  preparedDryRun.sufficiencyResult,
                  preparedDryRun.templateContract,
                )
                  ? ['Manual-fallback mode would bypass the strict memory template contract for this save']
                  : []),
              ]
            : [
                'Dry-run complete - no changes made',
                ...(!preparedDryRun.templateContract.valid
                  ? ['Rendered content must match the memory template contract before indexing']
                  : []),
                'Not enough context was available to save a durable memory',
                'Add concrete file, tool, decision, blocker, next action, or outcome evidence and retry',
              ],
      });
    }

    if (!preflightResult.pass) {
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

  let result: IndexResult;
  try {
    result = await indexMemoryFile(validatedPath, {
      force,
      parsedOverride: parsedForPreflight,
      asyncEmbedding,
      scope: saveScope,
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
    // persisted rows without tenant/shared-space/retention metadata.
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
        sharedSpaceId,
        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
        metadata: { filePath: validatedPath, retentionPolicy: governanceDecision.normalized.retentionPolicy },
      });

      if (sharedSpaceId) {
        const existing = database.prepare(`
          SELECT id
          FROM memory_index
          WHERE shared_space_id = ?
            AND file_path = ?
            AND id != ?
          ORDER BY id DESC
          LIMIT 1
        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
        if (existing?.id) {
          recordSharedConflict(database, {
            spaceId: sharedSpaceId,
            logicalKey: `${result.specFolder || ''}::${validatedPath}`,
            existingMemoryId: existing.id,
            incomingMemoryId: result.id,
            actor: provenanceActor ?? 'mcp:memory_save',
            metadata: { filePath: validatedPath },
          });
        }
      }
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
  const { file_path, content } = params;
  const { force = false } = options;
  const database = requireDb();
  // Use unique suffix to prevent concurrent pending-file race (F01-003)
  const basePendingPath = transactionManager.getPendingPath(file_path);
  const pendingPath = `${basePendingPath}.${randomUUID().slice(0, 8)}`;
  const originalState = captureAtomicSaveOriginalState(file_path);

  let indexResult: IndexResult | null = null;
  let indexError: Error | null = null;
  let validationError: ReturnType<typeof memoryParser.validateParsedMemory> | null = null;
  let restoredOriginalAfterFailure = false;
  let errorMetadata: Record<string, string> | null = null;
  const mergeErrorMetadata = (entry: Record<string, string> | null): void => {
    if (!entry) {
      return;
    }
    errorMetadata = {
      ...(errorMetadata ?? {}),
      ...entry,
    };
  };
  const maxIndexAttempts = 2;
  for (let attempt = 1; attempt <= maxIndexAttempts; attempt++) {
    let promotedToFinalPath = false;
    let handledFailureWhileLocked = false;
    let rollbackSucceededAfterRejectedSave = false;
    try {
      const prepared = prepareParsedMemoryForIndexing(
        memoryParser.parseMemoryContent(file_path, content),
        database,
      );

      if (!prepared.validation.valid) {
        validationError = prepared.validation;
        indexError = null;
        break;
      }

      if (prepared.qualityLoopResult.fixes.length > 0 && prepared.qualityLoopResult.passed && prepared.qualityLoopResult.fixedContent) {
        console.error(`[memory-save] Quality loop applied ${prepared.qualityLoopResult.fixes.length} auto-fix(es) for ${path.basename(file_path)} before pending-file promotion`);
      }

      const persistedContent = prepared.qualityLoopResult.passed && prepared.qualityLoopResult.fixedContent
        ? prepared.qualityLoopResult.fixedContent
        : content;

      indexResult = await withSpecFolderLock(prepared.parsed.specFolder, async () => {
        try {
          fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
          fs.writeFileSync(pendingPath, persistedContent, 'utf-8');
          fs.renameSync(pendingPath, file_path);
          promotedToFinalPath = true;

          const lockedIndexResult = await processPreparedMemory(prepared, file_path, {
            force,
            asyncEmbedding: true,
            persistQualityLoopContent: false,
            specFolderLockAlreadyHeld: true,
          });

          if (lockedIndexResult.status === 'rejected') {
            handledFailureWhileLocked = true;
            const rollbackResult = restoreAtomicSaveOriginalState(file_path, originalState);
            rollbackSucceededAfterRejectedSave = rollbackResult.restored;
            if (!rollbackResult.restored && rollbackResult.error) {
              mergeErrorMetadata({ rollbackError: rollbackResult.error });
            }
          }

          return lockedIndexResult;
        } catch (lockedError: unknown) {
          handledFailureWhileLocked = true;
          const pendingCleanupResult = cleanupAtomicSavePendingFile(pendingPath);
          if (!pendingCleanupResult.cleaned && pendingCleanupResult.error) {
            mergeErrorMetadata({ pendingCleanupError: pendingCleanupResult.error });
          }
          if (promotedToFinalPath) {
            const rollbackResult = restoreAtomicSaveOriginalState(file_path, originalState);
            restoredOriginalAfterFailure = rollbackResult.restored;
            if (!rollbackResult.restored && rollbackResult.error) {
              mergeErrorMetadata({ rollbackError: rollbackResult.error });
            }
            if (!restoredOriginalAfterFailure) {
              const promoteMessage = lockedError instanceof Error ? lockedError.message : String(lockedError);
              throw new Error(`Original file rollback failed after promote-before-index path: ${promoteMessage}`);
            }
          }
          throw lockedError;
        }
      });
      if (indexResult.status === 'error') {
        throw new Error(indexResult.message ?? indexResult.error ?? 'indexMemoryFile returned status=error');
      }
      if (indexResult.status === 'rejected') {
        const rollbackSucceeded = rollbackSucceededAfterRejectedSave;
        return {
          success: false,
          filePath: file_path,
          status: 'rejected',
          id: indexResult.id,
          specFolder: indexResult.specFolder,
          title: indexResult.title,
          summary: rollbackSucceeded
            ? 'Atomic save rejected after file promotion rollback'
            : 'Atomic save rejected but original file rollback failed',
          message: indexResult.message ?? indexResult.rejectionReason ?? 'Memory save rejected',
          embeddingStatus: indexResult.embeddingStatus,
          hints: [
            rollbackSucceeded
              ? 'Original file content was restored because the save was rejected after promotion'
              : 'Original file rollback failed after rejection; manual recovery may be required',
          ],
          ...(rollbackSucceeded ? {} : { error: 'Original file rollback failed after rejected save' }),
          ...(rollbackSucceeded || !errorMetadata ? {} : { errorMetadata }),
        };
      }
      indexError = null;
      break;
    } catch (err: unknown) {
      if (!handledFailureWhileLocked) {
        const pendingCleanupResult = cleanupAtomicSavePendingFile(pendingPath);
        if (!pendingCleanupResult.cleaned && pendingCleanupResult.error) {
          mergeErrorMetadata({ pendingCleanupError: pendingCleanupResult.error });
        }
        if (promotedToFinalPath) {
          const rollbackResult = restoreAtomicSaveOriginalState(file_path, originalState);
          restoredOriginalAfterFailure = rollbackResult.restored;
          if (!rollbackResult.restored && rollbackResult.error) {
            mergeErrorMetadata({ rollbackError: rollbackResult.error });
          }
          if (!restoredOriginalAfterFailure) {
            const promoteMessage = err instanceof Error ? err.message : String(err);
            indexError = new Error(`Original file rollback failed after promote-before-index path: ${promoteMessage}`);
            break;
          }
        }
      }
      indexError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxIndexAttempts) {
        console.warn(`[memory-save] index attempt ${attempt} failed for ${file_path}, retrying once: ${indexError.message}`);
      }
    }
  }

  if (validationError) {
    return {
      success: false,
      filePath: file_path,
      status: 'error',
      summary: 'Atomic save preflight failed',
      message: 'Parsed content failed validation before atomic save',
      error: `Validation failed: ${validationError.errors.join(', ')}`,
    };
  }

  if (indexError || !indexResult) {
    const pendingCleanupResult = cleanupAtomicSavePendingFile(pendingPath);
    const rollbackSucceeded = restoredOriginalAfterFailure || pendingCleanupResult.cleaned;
    const rollbackError = rollbackSucceeded ? '' : ' (rollback failed)';
    const finalErrorMetadata = {
      ...(errorMetadata ?? {}),
      ...(!pendingCleanupResult.cleaned && pendingCleanupResult.error
        ? { pendingCleanupError: pendingCleanupResult.error }
        : {}),
    };

    return {
      success: false,
      filePath: file_path,
      status: 'error',
      summary: rollbackSucceeded
        ? 'Atomic save rolled back to the original file state'
        : 'Atomic save indexing failed and pending cleanup failed',
      message: rollbackSucceeded
        ? 'Indexing failed and the original file state was preserved or restored'
        : 'Indexing failed and pending cleanup could not be completed',
      hints: [
        rollbackSucceeded
          ? 'Original file content was preserved or restored because indexing failed before completion'
          : 'Pending file cleanup failed after indexing error; manual cleanup may be required',
        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
      ],
      error: `Indexing failed after retry${rollbackError}: ${indexError?.message ?? 'unknown'}`,
      ...(Object.keys(finalErrorMetadata).length > 0 ? { errorMetadata: finalErrorMetadata } : {}),
    };
  }

  if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
    applyPostInsertMetadata(database, indexResult.id, {});
  }

  const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
  if (shouldEmitPostMutationFeedback) {
    let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
    try {
      postMutationHooks = runPostMutationHooks('atomic-save', {
        filePath: file_path,
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
    filePath: file_path,
    status: indexResult.status,
    id: indexResult.id,
    specFolder: indexResult.specFolder,
    title: indexResult.title,
    summary: message,
    message,
    embeddingStatus: indexResult.embeddingStatus,
    ...(postMutationFeedback ? { postMutationHooks: postMutationFeedback.data } : {}),
    ...(hints.length > 0 ? { hints } : {}),
  };
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
