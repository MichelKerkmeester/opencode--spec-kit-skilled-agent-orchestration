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
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { createFilePathValidator } from '../utils/validators';
import * as memoryParser from '../lib/parsing/memory-parser';
import * as transactionManager from '../lib/storage/transaction-manager';
import * as preflight from '../lib/validation/preflight';
import { requireDb } from '../utils';
import type { MCPResponse } from './types';
import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state';

import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate';
import { isSaveQualityGateEnabled } from '../lib/search/search-flags';

import { getCanonicalPathKey } from '../lib/utils/canonical-path';
import { findSimilarMemories } from './pe-gating';
import { runPostMutationHooks } from './mutation-hooks';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback';
import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator';
import { applyPostInsertMetadata } from './save/db-helpers';
import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record';
import {
  buildGovernancePostInsertFields,
  ensureGovernanceRuntime,
  recordGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance';
import {
  assertSharedSpaceAccess,
  recordSharedConflict,
} from '../lib/collab/shared-spaces';
import {
  runQualityLoop,
} from './quality-loop';
import type {
  QualityLoopResult,
} from './quality-loop';

// O2-5/O2-12: V-rule validation (previously only in workflow path)
import {
  validateMemoryQualityContent,
  determineValidationDisposition,
} from './v-rule-bridge';

// Save pipeline modules (CR-P2-4 decomposition)
import type {
  IndexResult,
  SaveArgs,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
} from './save';
import { checkExistingRow, checkContentHashDedup } from './save/dedup';
import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline';
import { evaluateAndApplyPeDecision } from './save/pe-orchestration';
import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge';
import { runPostInsertEnrichment } from './save/post-insert';
import { buildIndexResult, buildSaveResponse } from './save/response-builder';

// Extracted sub-modules
import { withSpecFolderLock } from './save/spec-folder-mutex';
import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder';
import {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
} from './save/validation-responses';

import { markMemorySuperseded } from './pe-gating';
import { resolveMemoryReference } from './causal-links-processor';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Prediction-error save arbitration


// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

interface PreparedParsedMemory {
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
  qualityLoopResult: QualityLoopResult;
  sufficiencyResult: MemorySufficiencyResult;
  templateContract: MemoryTemplateContractResult;
  specDocHealth: SpecDocHealthResult | null;
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
): PreparedParsedMemory {
  const validation = memoryParser.validateParsedMemory(parsed);
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
    validation.warnings.forEach((warning: string) => console.warn(`[memory]   - ${warning}`));
  }

  // O2-5/O2-12: Run V-rule validation (previously only in workflow path)
  const vRuleResult = validateMemoryQualityContent(parsed.content);
  if (vRuleResult && !vRuleResult.valid) {
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
      };
    }
    if (vRuleDisposition && vRuleDisposition.disposition === 'write_skip_index') {
      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      validation.warnings.push(`V-rule index block: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      // F07-002: Flag to skip indexing for write_skip_index disposition
      (parsed as unknown as Record<string, unknown>)._skipIndex = true;
      (parsed as unknown as Record<string, unknown>)._vRuleIndexBlockIds = vRuleDisposition.indexBlockingRuleIds;
    }
  }

  const qualityLoopResult = runQualityLoop(parsed.content, buildQualityLoopMetadata(parsed, database));
  parsed.qualityScore = qualityLoopResult.score.total;
  parsed.qualityFlags = qualityLoopResult.score.issues;
  if (qualityLoopResult.fixedTriggerPhrases) {
    parsed.triggerPhrases = qualityLoopResult.fixedTriggerPhrases;
  }
  if (qualityLoopResult.fixedContent && qualityLoopResult.passed) {
    parsed.content = qualityLoopResult.fixedContent;
    parsed.contentHash = memoryParser.computeContentHash(parsed.content);
  }

  const sufficiencyResult = evaluateMemorySufficiency(
    buildParsedMemoryEvidenceSnapshot(parsed),
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
    } catch {
      // Health check failure must not block memory save
    }
  }

  return {
    parsed,
    validation,
    qualityLoopResult,
    sufficiencyResult,
    templateContract,
    specDocHealth,
  };
}

async function processPreparedMemory(
  prepared: PreparedParsedMemory,
  filePath: string,
  options: {
    force?: boolean;
    asyncEmbedding?: boolean;
    persistQualityLoopContent?: boolean;
    scope?: MemoryScopeMatch;
  } = {},
): Promise<IndexResult> {
  const {
    force = false,
    asyncEmbedding = false,
    persistQualityLoopContent = true,
    scope = {},
  } = options;
  const { parsed, validation, qualityLoopResult, sufficiencyResult, templateContract } = prepared;

  if (!qualityLoopResult.passed && qualityLoopResult.rejected) {
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

  if (!sufficiencyResult.pass) {
    return buildInsufficiencyRejectionResult(parsed, validation, sufficiencyResult);
  }

  if (!templateContract.valid) {
    return buildTemplateContractRejectionResult(parsed, validation, templateContract);
  }

  return withSpecFolderLock(parsed.specFolder, async () => {
    const database = requireDb();
    const canonicalFilePath = getCanonicalPathKey(filePath);

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

    // CHUNKING BRANCH: Large files get split into parent + child records
    // Must be inside withSpecFolderLock to serialize chunked saves too.
    // Existing-row dedup above must run first so duplicate content exits before chunking.
    if (needsChunking(parsed.content)) {
      console.error(`[memory-save] File exceeds chunking threshold (${parsed.content.length} chars), using chunked indexing`);
      const chunkedResult = await indexChunkedMemoryFile(filePath, parsed, { force, applyPostInsertMetadata });

      if (
        persistQualityLoopContent &&
        qualityLoopResult.passed &&
        qualityLoopResult.fixedContent &&
        (chunkedResult.status === 'indexed' || chunkedResult.status === 'updated')
      ) {
        await fs.promises.writeFile(filePath, parsed.content, 'utf-8');
      }

      return chunkedResult;
    }

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
          embedding: embedding,
          findSimilar: embedding ? (emb, gateOptions) => {
            return findSimilarMemories(emb as Float32Array, {
              limit: gateOptions.limit,
              specFolder: gateOptions.specFolder,
            }).map(m => ({
              id: m.id,
              file_path: m.file_path,
              similarity: m.similarity,
            }));
          } : null,
        });

        if (!qualityGateResult.pass && !qualityGateResult.warnOnly) {
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
      database, parsed, embedding, force, validation.warnings, embeddingStatus, filePath,
    );
    if (peResult.earlyReturn) return peResult.earlyReturn;

    // -- the rollout: TM-06 Reconsolidation-on-Save --
    const reconResult = await runReconsolidationIfEnabled(database, parsed, filePath, force, embedding);
    if (reconResult.earlyReturn) return reconResult.earlyReturn;

    // A4 FIX: Wrap dedup-check + insert in BEGIN IMMEDIATE transaction for
    // DB-level atomicity. withSpecFolderLock handles in-process serialization;
    // this transaction provides defense-in-depth against multi-process races.
    // F01-004 NOTE: PE and reconsolidation run before this transaction. Their
    // similarity decisions may become stale if another save completes between
    // evaluation and BEGIN IMMEDIATE. The content-hash dedup inside the
    // transaction (C5-1) catches the most common race. For PE/recon staleness,
    // scope filtering (F01-001/F01-002) limits cross-tenant races.
    let id: number;
    let existing: { id: number; content_hash: string } | undefined;

    const useTx = typeof database.exec === 'function';
    if (useTx) database.exec('BEGIN IMMEDIATE');
    try {
      // C5-1: Content-hash dedup moved inside transaction to prevent TOCTOU race
      const dupResult = checkContentHashDedup(database, parsed, force, validation.warnings, {
        canonicalFilePath,
        filePath,
      }, scope);
      if (dupResult) {
        if (useTx) database.exec('ROLLBACK');
        return dupResult;
      }

      // CREATE NEW MEMORY
      existing = findSamePathExistingMemory(
        database,
        parsed.specFolder,
        canonicalFilePath,
        filePath,
        scope,
      ) as { id: number; content_hash: string } | undefined;

      id = existing && existing.content_hash !== parsed.contentHash
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
        memoryId: id,
        predecessorMemoryId: existing && existing.content_hash !== parsed.contentHash
          ? existing.id
          : null,
        actor: 'mcp:memory_save',
        transitionEvent: existing && existing.content_hash !== parsed.contentHash
          ? 'SUPERSEDE'
          : 'CREATE',
      });

      // F01-005: Write auto-fixed content BEFORE commit so failure triggers rollback
      if (persistQualityLoopContent && qualityLoopResult.passed && qualityLoopResult.fixedContent) {
        try {
          await fs.promises.writeFile(filePath, parsed.content, 'utf-8');
        } catch (writeErr: unknown) {
          console.error('[memory-save] Auto-fix file write failed, rolling back:', writeErr instanceof Error ? writeErr.message : String(writeErr));
          if (useTx) database.exec('ROLLBACK');
          throw writeErr;
        }
      }

      if (useTx) database.exec('COMMIT');
    } catch (txErr: unknown) {
      if (useTx) try { database.exec('ROLLBACK'); } catch (rbErr: unknown) { console.warn('[memory-save] ROLLBACK failed after transaction error:', rbErr instanceof Error ? rbErr.message : String(rbErr)); }
      throw txErr;
    }

    // POST-INSERT ENRICHMENT: causal links, entities, summaries, entity linking
    const { causalLinksResult, enrichmentStatus } = await runPostInsertEnrichment(database, id, parsed);

    // BUILD RESULT
    return buildIndexResult({
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
    });
  });
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
    scope,
  });
}

/* --- 9. MEMORY SAVE HANDLER --- */

/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
async function handleMemorySave(args: SaveArgs): Promise<MCPResponse> {
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  await checkDatabaseUpdated();

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

  if (!file_path || typeof file_path !== 'string') {
    throw new Error('filePath is required and must be a string');
  }

  const validatedPath: string = validateFilePathLocal(file_path);
  const database = requireDb();

  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  if (dryRun && skipPreflight) {
    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database);
    const { createMCPSuccessResponse } = await import('../lib/response/envelope');
    const dryRunSummary = buildDryRunSummary(
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
          && preparedDryRun.templateContract.valid
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
      hints: preparedDryRun.templateContract.valid && preparedDryRun.sufficiencyResult.pass
        ? [
            'Dry-run complete - no changes made',
            'Pre-flight checks were skipped because skipPreflight=true',
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

  ensureGovernanceRuntime(database);

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

  if (!memoryParser.isMemoryFile(validatedPath)) {
    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
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
      const preparedDryRun = prepareParsedMemoryForIndexing(parsedForPreflight, database);
      const { createMCPSuccessResponse } = await import('../lib/response/envelope');
      const dryRunSummary = !preflightResult.dry_run_would_pass
        ? `Pre-flight validation failed: ${preflightResult.errors.length} error(s)`
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
            && preparedDryRun.templateContract.valid
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
          : preparedDryRun.templateContract.valid && preparedDryRun.sufficiencyResult.pass
            ? ['Dry-run complete - no changes made']
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

  const result = await indexMemoryFile(validatedPath, {
    force,
    parsedOverride: parsedForPreflight,
    asyncEmbedding,
    scope: saveScope,
  });

  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
    // B13: Wrap governance metadata UPDATE + audit + conflict in a transaction
    // so the memory row is never left without its governance fields.
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
    applyGovernanceTx();
  }

  return buildSaveResponse({ result, filePath: file_path, asyncEmbedding, requestId });
}

/* --- 10. ATOMIC MEMORY SAVE --- */

/**
 * Save memory content to disk with retry + rollback guarded indexing.
 *
 * The file write uses atomic rename (write-to-temp + rename), while DB
 * indexing runs asynchronously afterward because
 * `indexMemoryFile` requires async embedding generation while
 * `executeAtomicSave` expects a synchronous `dbOperation` callback.
 *
 * Atomicity guard: if indexing fails after the write, retry once; if retry
 * also fails, rollback the written file to avoid write/index mismatch.
 */
async function atomicSaveMemory(params: AtomicSaveParams, options: AtomicSaveOptions = {}): Promise<AtomicSaveResult> {
  const { file_path, content } = params;
  const { force = false } = options;
  const database = requireDb();
  // Use unique suffix to prevent concurrent pending-file race (F01-003)
  const basePendingPath = transactionManager.getPendingPath(file_path);
  const pendingPath = `${basePendingPath}.${randomUUID().slice(0, 8)}`;

  let indexResult: IndexResult | null = null;
  let indexError: Error | null = null;
  let validationError: ReturnType<typeof memoryParser.validateParsedMemory> | null = null;
  const maxIndexAttempts = 2;
  for (let attempt = 1; attempt <= maxIndexAttempts; attempt++) {
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

      fs.mkdirSync(path.dirname(pendingPath), { recursive: true });
      fs.writeFileSync(pendingPath, persistedContent, 'utf-8');

      indexResult = await processPreparedMemory(prepared, file_path, {
        force,
        asyncEmbedding: true,
        persistQualityLoopContent: false,
      });
      if (indexResult.status === 'error') {
        throw new Error(indexResult.message ?? indexResult.error ?? 'indexMemoryFile returned status=error');
      }
      indexError = null;
      break;
    } catch (err: unknown) {
      transactionManager.deleteFileIfExists(pendingPath);
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

  if (indexResult?.status === 'rejected') {
    const rollbackSucceeded = transactionManager.deleteFileIfExists(pendingPath);
    return {
      success: false,
      filePath: file_path,
      status: 'rejected',
      id: indexResult.id,
      specFolder: indexResult.specFolder,
      title: indexResult.title,
      summary: rollbackSucceeded
        ? 'Atomic save rejected before pending file promotion'
        : 'Atomic save rejected and pending cleanup failed',
      message: indexResult.message ?? indexResult.rejectionReason ?? 'Memory save rejected',
      embeddingStatus: indexResult.embeddingStatus,
      hints: [
        rollbackSucceeded
          ? 'Pending file was removed because the save was rejected before final rename'
          : 'Pending file cleanup failed after rejection; manual cleanup may be required',
      ],
      ...(rollbackSucceeded ? {} : { error: 'Pending-file cleanup failed after rejected save' }),
    };
  }

  if (indexError || !indexResult) {
    const rollbackSucceeded = transactionManager.deleteFileIfExists(pendingPath);
    const rollbackError = rollbackSucceeded ? '' : ' (rollback failed)';

    return {
      success: false,
      filePath: file_path,
      status: 'error',
      summary: rollbackSucceeded
        ? 'Atomic save rolled back before pending file promotion'
        : 'Atomic save indexing failed and pending cleanup failed',
      message: rollbackSucceeded
        ? 'Indexing failed and pending file was removed before final rename'
        : 'Indexing failed and pending file could not be removed',
      hints: [
        rollbackSucceeded
          ? 'Original file was left untouched because indexing failed before the final rename'
          : 'Pending file cleanup failed after indexing error; manual cleanup may be required',
        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
      ],
      error: `Indexing failed after retry${rollbackError}: ${indexError?.message ?? 'unknown'}`,
    };
  }

  try {
    fs.renameSync(pendingPath, file_path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      filePath: file_path,
      status: 'error',
      id: indexResult.id,
      specFolder: indexResult.specFolder,
      title: indexResult.title,
      summary: 'Atomic save indexed but pending file promotion failed',
      message: 'Memory was indexed, but the pending file could not be promoted to the final path',
      embeddingStatus: indexResult.embeddingStatus,
      hints: [
        `Pending file kept for recovery: ${pendingPath}`,
        'Run pending-file recovery or retry the save after fixing filesystem issues',
      ],
      error: `Rename failed after DB commit: ${message}`,
      dbCommitted: true,
    };
  }

  if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
    applyPostInsertMetadata(database, indexResult.id, {});
  }

  const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
  if (shouldEmitPostMutationFeedback) {
    let postMutationHooks: import('./mutation-hooks').MutationHookResult;
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
