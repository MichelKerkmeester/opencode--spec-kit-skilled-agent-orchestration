OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a49-21be-7833-85ea-a3f0d1250bad
--------
user
# Role: Code Auditor (A1) — Iteration 008

## Mission
Final gap-fill: trace how source-capabilities.ts concretely affects contamination scoring, quality thresholds, and mode selection end-to-end.

## Research Question
**Q9 (final).** Complete the source-capabilities interaction map. Show the concrete effect of each capability on pipeline behavior.

## Files to Examine
- `.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts` — Full read
- `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` — How capabilities affect severity
- `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` — How capabilities affect rule applicability
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` — How capabilities affect mode decisions

## Deliverable
1. For each capability field (inputMode, toolTitleWithPathExpected, prefersStructuredSave): trace every consumer and document the concrete behavioral effect
2. Identify: Are any capabilities defined but never consumed?
3. Identify: Are any capability consumers checking raw source names instead of capabilities?
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: cocoindex_code starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m going to map each capability field end-to-end across the four target files, then verify whether any capability is unused or bypassed by raw source-name checks. I’ll start by reading the files fully and indexing all references to `source-capabilities` and each field name.
exec
/bin/zsh -lc 'rg -n "source-capabilities|inputMode|toolTitleWithPathExpected|prefersStructuredSave|source name|sourceName" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:8:  inputMode: SourceInputMode;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:9:  toolTitleWithPathExpected: boolean;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:10:  prefersStructuredSave: boolean;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:16:    inputMode: 'structured',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:17:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:18:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:22:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:23:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:24:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:28:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:29:    toolTitleWithPathExpected: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:30:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:34:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:35:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:36:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:40:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:41:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:42:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:46:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:47:    toolTitleWithPathExpected: false,
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
AGENTS.md
.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
codex
I’ve located all direct references; next I’m reading the four requested files in full and then I’ll cross-check for any raw `source`/`sourceName` conditionals that should have used capabilities instead.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import type { DataSource } from './input-normalizer';

export type SourceInputMode = 'structured' | 'stateless';
export type KnownDataSource = DataSource;

export interface SourceCapabilities {
  source: DataSource;
  inputMode: SourceInputMode;
  toolTitleWithPathExpected: boolean;
  prefersStructuredSave: boolean;
}

const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
  file: {
    source: 'file',
    inputMode: 'structured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'opencode-capture': {
exec
/bin/zsh -lc "sed -n '2100,2360p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Contamination Filter
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CONTAMINATION FILTER
// ───────────────────────────────────────────────────────────────
// Removes orchestration chatter before semantic extraction

import type { DataSource } from '../utils/input-normalizer';
import { getSourceCapabilities, type SourceCapabilities } from '../utils/source-capabilities';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/

type ContaminationSeverity = 'low' | 'medium' | 'high';

interface DenylistEntry {
  label: string;
 succeeded in 0ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. VALIDATE MEMORY QUALITY
// ───────────────────────────────────────────────────────────────
// Post-render quality gate for generated memory files

import fs from 'fs';
import path from 'path';
import { structuredLog } from '../utils/logger';
import type { ContaminationAuditRecord } from '../lib/content-filter';
import type { DataSource } from '../utils/input-normalizer';
import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';

type ValidationRuleSeverity = 'low' | 'medium' | 'high';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';
exec
/bin/zsh -lc 'rg -n "getSourceCapabilities|appliesToSources|captureSource|inputMode|prefersStructuredSave|toolTitleWithPathExpected|determineValidationDisposition|VALIDATION_RULE_METADATA" .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
15:import { getSourceCapabilities, type KnownDataSource } from '../utils/source-capabilities';
27:  appliesToSources: 'all' | readonly KnownDataSource[];
38:const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata> = {
44:    appliesToSources: 'all',
52:    appliesToSources: 'all',
60:    appliesToSources: 'all',
68:    appliesToSources: 'all',
76:    appliesToSources: 'all',
84:    appliesToSources: 'all',
92:    appliesToSources: 'all',
100:    appliesToSources: 'all',
108:    appliesToSources: 'all',
116:    appliesToSources: 'all',
124:    appliesToSources: 'all',
132:    appliesToSources: 'all',
137:const HARD_BLOCK_RULES: readonly QualityRuleId[] = Object.values(VALIDATION_RULE_METADATA)
394:  if (metadata.appliesToSources === 'all') {
398:  const capabilities = getSourceCapabilities(source);
399:  return metadata.appliesToSources.includes(capabilities.source);
403:  return VALIDATION_RULE_METADATA[ruleId];
codex
I found where quality-rule applicability and disposition are computed; I’m now reading the remaining section around those functions so we can tie capabilities to exact write/index behavior.
exec
/bin/zsh -lc "sed -n '320,780p' .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    return null;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasSignificantFileCountDivergence(
  filesystemFileCount: number | null,
  capturedFileCount: number | null,
): boolean {
  if (filesystemFileCount === null || capturedFileCount === null) {
    return false;
  }

  const maxCount = Math.max(filesystemFileCount, capturedFileCount);
  const minCount = Math.min(filesystemFileCount, capturedFileCount);
  if (maxCount <= 2) {
    return false;
  }
exec
/bin/zsh -lc 'rg -n "getSourceCapabilities|captureCapabilities|captureSource|stateless|structured|prefersStructuredSave|toolTitleWithPathExpected|determineValidationDisposition|source ===|source !==|opencode-capture|claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|simulation" .opencode/skill/system-spec-kit/scripts/core/workflow.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
45:  determineValidationDisposition,
80:import * as simFactory from '../lib/simulation-factory';
83:import { structuredLog } from '../utils/logger';
86:import { getSourceCapabilities } from '../utils/source-capabilities';
137:    /** Whether the data originated from a simulation rather than a live session. */
1240:  if (collectedData._source === 'file') {
1404:      log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
1425:        const alignMsg = `ALIGNMENT_WARNING: Captured stateless content matched the workspace but not the target spec folder "${activeSpecFolderArg}". ` +
1507:    const captureSource = typeof collectedData?._source === 'string' ? collectedData._source : undefined;
1508:    const captureCapabilities = getSourceCapabilities(captureSource);
1514:        captureSource ? { captureSource: captureCapabilities.source, sourceCapabilities: captureCapabilities } : undefined,
1578:      structuredLog('info', 'contamination_audit', extractorAudit);
1587:    // Step 3.5: Enrich stateless data with spec folder and git context
1589:      log('Step 3.5: Enriching stateless data...');
1651:        structuredLog('info', 'contamination_audit', fileDescAudit);
1761:  // Patch TOOL_COUNT for enriched stateless saves so V7 does not flag
1855:    const dataSource = typeof collectedData?._source === 'string' ? collectedData._source : null;
1980:      // Which overwrites the patched value from stateless enrichment.
1981:      // Non-stateless flows should keep conversations.TOOL_COUNT as-is.
2155:  // Banners prepended after this point (low-quality, simulation, medium-quality)
codex
I’ve pinpointed the key `workflow.ts` callsites and am now reading the surrounding control flow to map exactly where capabilities change enrichment, warnings, and disposition behavior.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1180,1700p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
 succeeded in 0ms:
      const gitPayload = (collectedData as Record<string, unknown>).git as Record<string, unknown> | undefined;
      enriched.headRef = (gitPayload?.headRef as string | undefined) ?? gitContext.headRef;
      enriched.commitRef = (gitPayload?.commitRef as string | undefined) ?? gitContext.commitRef;
      enriched.repositoryState = (gitPayload?.repositoryState as string | undefined) ?? gitContext.repositoryState;
      enriched.isDetachedHead = (gitPayload?.isDetachedHead as boolean | undefined) ?? gitContext.isDetachedHead;
      // Explicitly SKIP gitContext.observations and gitContext.FILES — V8 safety
    }

    // Spec-folder trigger phrases and decisions (safe — no observations injected)
    if (specContext) {
      if (specContext.triggerPhrases.length > 0) {
        enriched._manualTriggerPhrases = [
          ...(enriched._manualTriggerPhrases || []),
          ...specContext.triggerPhrases,
        ];
      }
      if (specContext.decisions.length > 0) {
        enriched._manualDecisions = [
          ...(enriched._manualDecisions || []),
          ...specContext.decisions,
exec
/bin/zsh -lc "sed -n '1720,2025p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
exec
/bin/zsh -lc "rg -n \"captureCapabilities|getSourceCapabilities\\(|sourceCapabilities\" .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
1508:    const captureCapabilities = getSourceCapabilities(captureSource);
1514:        captureSource ? { captureSource: captureCapabilities.source, sourceCapabilities: captureCapabilities } : undefined,
2244:    } else if (captureCapabilities.inputMode === 'stateless') {
exec
/bin/zsh -lc 'rg -n "contaminationSeverity|hadContamination|QUALITY_ABORT_THRESHOLD|contamination" .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:15:import type { ContaminationSeverity } from './contamination-filter';
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:31:  hadContamination?: boolean;
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:32:  contaminationSeverity?: ContaminationSeverity | null;
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:70:    hadContamination = false,
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:71:    contaminationSeverity = null,
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:85:    if (hadContamination) {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:86:      emptyContentFlags.push('has_contamination');
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:96:      hadContamination,
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:140:  if (hadContamination) {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:141:    qualityFlags.add('has_contamination');
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:142:    const severity = contaminationSeverity || 'medium';
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:144:      warnings.push('Low-severity contamination detected (preamble only) — penalty applied post-bonus');
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:147:      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:150:      warnings.push('High-severity contamination detected (AI self-reference/tool leaks) — capped at 0.60');
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:158:    // Preserve any existing cap (e.g. contamination 0.6) as a ceiling
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:187:  // Apply contamination penalty AFTER bonuses so bonuses cannot offset it
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:188:  if (hadContamination) {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:189:    const severity = contaminationSeverity || 'medium';
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:212:    hadContamination,
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:23:import type { ContaminationSeverity } from '../extractors/contamination-filter';
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,320p' .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. QUALITY SCORER
// ───────────────────────────────────────────────────────────────
// Scores the quality of generated memory files based on multiple criteria

import {
  isContaminatedMemoryName,
  isGenericContentTask,
  normalizeMemoryNameCandidate,
  pickBestContentName,
} from '../utils/slug-utils';
import {
  getDescriptionTierRank,
  type DescriptionTier,
  validateDescription,
} from '../utils/file-helpers';
 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. QUALITY SCORER
// ───────────────────────────────────────────────────────────────
// Computes deterministic quality score and flags for rendered memories

import type {
  QualityDimensionScore,
  QualityFlag,
  QualityScoreResult,
} from '../core/quality-scorer';
import type { ContaminationSeverity } from './contamination-filter';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/

exec
/bin/zsh -lc "sed -n '260,420p' .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  } else if (realLeakedTags <= 2) {
    qualityFlags.add('leaked_html');
    breakdown.noLeakedTags = 10;
    warnings.push(`${realLeakedTags} HTML tag(s) leaked into content`);
  } else {
    qualityFlags.add('leaked_html');
    breakdown.noLeakedTags = 5;
    warnings.push(`${realLeakedTags} HTML tags leaked into content — content may have raw HTML`);
  }

  // 6. Observation deduplication quality (0-15 points)
  // Repeated titles usually indicate low-information duplication.
  if (observations.length === 0) {
    qualityFlags.add('duplicate_observations');
    breakdown.observationDedup = 5;
    warnings.push('No observations captured — memory lacks concrete session evidence');
  } else {
    const titles = observations
      .map((observation) => normalizeMemoryNameCandidate(observation.TITLE || ''))
      .filter((title) => title.length > 0);
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
import { describe, expect, it } from 'vitest';

import {
  determineValidationDisposition,
  getRuleMetadata,
  shouldBlockIndex,
  shouldBlockWrite,
} from '../memory/validate-memory-quality';
import { getSourceCapabilities } from '../utils/source-capabilities';

describe('validation rule metadata', () => {
  it('marks V10 as a soft rule that still allows write and index', () => {
    const metadata = getRuleMetadata('V10');

    expect(metadata.severity).toBe('low');
    expect(metadata.blockOnWrite).toBe(false);
    expect(metadata.blockOnIndex).toBe(false);
    expect(shouldBlockWrite('V10', 'opencode-capture')).toBe(false);
    expect(shouldBlockIndex('V10', 'opencode-capture')).toBe(false);
    expect(determineValidationDisposition(['V10'], 'opencode-capture')).toMatchObject({
 succeeded in 0ms:
// TEST: Contamination Filter — severity tracking and SEVERITY_RANK export
import { describe, expect, it } from 'vitest';

import { filterContamination, SEVERITY_RANK } from '../extractors/contamination-filter';
import { getSourceCapabilities } from '../utils/source-capabilities';

describe('filterContamination severity tracking', () => {
  it('reports low severity for preamble-only input', () => {
    const result = filterContamination('Let me check the logs. Let me read the config.');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('low');
  });

  it('escalates to high when low and high patterns co-occur', () => {
    const result = filterContamination('Let me check this. As an AI, I can help.');

    expect(result.hadContamination).toBe(true);
    expect(result.maxSeverity).toBe('high');
  });
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Input Normalizer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. INPUT NORMALIZER
// ───────────────────────────────────────────────────────────────
// Validates, normalizes, and transforms raw input data into structured session format
import { structuredLog } from './logger';
import {
  buildSpecAffinityTargets,
  evaluateSpecAffinityText,
  matchesSpecAffinityFilePath,
  matchesSpecAffinityText,
  normalizeText,
} from './spec-affinity';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
codex
I’m now checking for raw source-name conditionals in the same execution path (especially mode and fallback logic) to answer whether anything bypasses `getSourceCapabilities`.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Task Enrichment
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TASK ENRICHMENT
// ───────────────────────────────────────────────────────────────
// Shared helpers for memory task title enrichment decisions

import { isContaminatedMemoryName, isGenericContentTask, normalizeMemoryNameCandidate, pickBestContentName } from './slug-utils';

function hasJsonDataFile(dataFilePath: string | null | undefined): boolean {
  return typeof dataFilePath === 'string' && dataFilePath.trim().length > 0;
}

/** Normalizes a spec title for reuse in memory task enrichment. */
export function normalizeSpecTitleForMemory(title: string): string {
  return normalizeMemoryNameCandidate(title);
}

exec
/bin/zsh -lc "rg -n \"_source\\s*===|_source\\s*"'!==|source'"\\s*===\\s*'|source\\s*"'!=='"\\s*'|dataSource\\s*===|dataSource\\s*"'!==|opencode-capture|claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|simulation|file" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:27:  if (source === 'file' || hasJsonDataFile(dataFilePath)) {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:14:  file: {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:15:    source: 'file',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:20:  'opencode-capture': {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:21:    source: 'opencode-capture',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:26:  'claude-code-capture': {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:27:    source: 'claude-code-capture',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:32:  'codex-cli-capture': {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:33:    source: 'codex-cli-capture',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:38:  'copilot-cli-capture': {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:39:    source: 'copilot-cli-capture',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:44:  'gemini-cli-capture': {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:45:    source: 'gemini-cli-capture',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:50:  simulation: {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:51:    source: 'simulation',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:64:    return SOURCE_CAPABILITIES.file;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:67:  if (typeof source === 'string' && isKnownDataSource(source)) {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:71:  if (typeof source === 'string') {
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:72:    return SOURCE_CAPABILITIES.file;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:8:// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
codex
I’ve identified one adjacent path (`task-enrichment.ts`) that still does raw source-name branching; next I’ll confirm with semantic search and then produce a field-by-field interaction map with concrete score/disposition effects.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code review baseline skill with findings-first severity analysis, mandatory security/correctness minimums, and adaptive overlay compatibility with sk-code-opencode, sk-code-web, and sk-code-full-stack standards."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.2.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-overlay -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal `sk-code` review baseline for any codebase, implemented by `sk-code-review` and paired with one `sk-code-*` overlay skill for stack-specific rules.

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
tool cocoindex_code.search({"query":"Where is getSourceCapabilities used in system-spec-kit scripts and what behaviors depend on inputMode toolTitleWithPathExpected prefersStructuredSave?","paths":".opencode/skill/system-spec-kit/scripts/*","limit":20,"refresh_index":false})
cocoindex_code.search({"query":"Where is getSourceCapabilities used in system-spec-kit scripts and what behaviors depend on inputMode toolTitleWithPathExpected prefersStructuredSave?","paths":".opencode/skill/system-spec-kit/scripts/*","limit":20,"refresh_index":false}) failed in 2ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\npaths\n  Input should be a valid list [type=list_type, input_value='.opencode/skill/system-spec-kit/scripts/*', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"getSourceCapabilities usage inputMode toolTitleWithPathExpected prefersStructuredSave in system-spec-kit scripts","paths":[".opencode/skill/system-spec-kit/scripts/**/*"],"limit":20,"refresh_index":false})
cocoindex_code.search({"query":"getSourceCapabilities usage inputMode toolTitleWithPathExpected prefersStructuredSave in system-spec-kit scripts","paths":[".opencode/skill/system-spec-kit/scripts/**/*"],"limit":20,"refresh_index":false}) success in 398ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
tool cocoindex_code.search({"query":"getSourceCapabilities inputMode toolTitleWithPathExpected prefersStructuredSave","limit":20,"refresh_index":false})
cocoindex_code.search({"query":"getSourceCapabilities inputMode toolTitleWithPathExpected prefersStructuredSave","limit":20,"refresh_index":false}) success in 77ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/input-normalizer.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"  function isToolRelevant(tool: CaptureToolCall): boolean {\\n    if (!specFolderHint) {\\n      return true;\\n    }\\n\\n    const toolTextParts = flattenToolContextStrings({\\n      title: tool.title || '',\\n      output: tool.output || '',\\n      input: tool.input || {},\\n    });\\n\\n    if ((tool.input?.filePath && matchesSpecAffinityFilePath(tool.input.filePath, specAffinityTargets))\\n      || (tool.input?.file_path && matchesSpecAffinityFilePath(tool.input.file_path, specAffinityTargets))\\n      || (tool.input?.path && matchesSpecAffinityFilePath(tool.input.path, specAffinityTargets))\\n    ) {\\n      return true;\\n    }\\n\\n    if (toolTextParts.some((part) => matchesSpecAffinityText(part, specAffinityTargets))) {\\n      return true;\\n    }\\n\\n    const safeToolContext = toolTextParts.some((part) => isSafeSpecFallback(currentSpecId, part));\\n    return safeToolContext && alignedExchangeTexts.length > 0;\\n  }\",\n      \"start_line\": 799,\n      \"end_line\": 823,\n      \"score\": 0.512651506292114\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/input-normalizer.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// 7. TOOL OBSERVATION TITLE BUILDER\\n/**\\n * Build a descriptive observation title from a tool call.\\n * Uses the tool's file path, pattern, or command to create a meaningful title\\n * instead of a generic \\\"Tool: grep\\\" label.\\n */\\nfunction buildToolObservationTitle(tool: CaptureToolCall): string {\\n  const toolName = tool.tool || 'unknown';\\n  const input = tool.input || {};\\n\\n  // Prefer the tool's own title if it's descriptive (not just a tool name)\\n  if (tool.title && tool.title.length > 10 && !/^Tool:\\\\s/i.test(tool.title)) {\\n    return tool.title.substring(0, 80);\\n  }\\n\\n  const filePath = input.filePath || input.file_path || input.path || '';\\n  const shortPath = filePath ? filePath.split('/').slice(-2).join('/') : '';\\n  const outputSummary = typeof tool.output === 'string'\\n    ? tool.output.replace(/\\\\s+/g, ' ').trim().slice(0, 60)\\n    : '';\\n\\n  switch (toolName.toLowerCase()) {\\n    case 'view':  // Copilot CLI equivalent of 'read'\",\n      \"start_line\": 614,\n      \"end_line\": 636,\n      \"score\": 0.4977084428137388\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/source-capabilities.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"import type { DataSource } from './input-normalizer';\\n\\nexport type SourceInputMode = 'structured' | 'stateless';\\nexport type KnownDataSource = DataSource;\\n\\nexport interface SourceCapabilities {\\n  source: DataSource;\\n  inputMode: SourceInputMode;\\n  toolTitleWithPathExpected: boolean;\\n  prefersStructuredSave: boolean;\\n}\\n\\nconst SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {\\n  file: {\\n    source: 'file',\\n    inputMode: 'structured',\\n    toolTitleWithPathExpected: false,\\n    prefersStructuredSave: true,\\n  }\",\n      \"start_line\": 1,\n      \"end_line\": 19,\n      \"score\": 0.47203977085603555\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"describe('source capabilities', () => {\\n  it('treats structured file input as the preferred structured save path', () => {\\n    expect(getSourceCapabilities('file')).toMatchObject({\\n      inputMode: 'structured',\\n      prefersStructuredSave: true,\\n      toolTitleWithPathExpected: false,\\n    });\\n  });\\n\\n  it('limits transcript-style tool-title downgrades to the capable source set', () => {\\n    expect(getSourceCapabilities('claude-code-capture').toolTitleWithPathExpected).toBe(true);\\n    expect(getSourceCapabilities('opencode-capture').toolTitleWithPathExpected).toBe(false);\\n    expect(getSourceCapabilities('codex-cli-capture').toolTitleWithPathExpected).toBe(false);\\n    expect(getSourceCapabilities('copilot-cli-capture').toolTitleWithPathExpected).toBe(false);\\n    expect(getSourceCapabilities('gemini-cli-capture').toolTitleWithPathExpected).toBe(false);\\n  });\\n});\",\n      \"start_line\": 57,\n      \"end_line\": 73,\n      \"score\": 0.4693908874421311\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/R02-opencode-capture-analysis.md\",\n      \"language\": \"markdown\",\n      \"content\": \"Source: `input-normalizer.ts:115-124,353-482`.\\n\\nMain behavior:\\n1. Reads `exchanges`, `toolCalls`, `metadata`, and `sessionTitle` from the capture.\\n2. Builds a relevance-keyword list from `specFolderHint` path segments.\\n3. Filters tool calls by file path/title substring matching when a spec folder hint is present.\\n4. Converts **all exchanges** into `userPrompts`.\\n5. Converts non-placeholder assistant responses into `feature` observations.\\n6. Converts filtered tool calls into `implementation` or generic `observation` observations.\\n7. Builds a single `recentContext` item from the first user request and last assistant response.\\n8. Builds `FILES` only from filtered `edit`/`write` tool calls.\\n\\nSource: `input-normalizer.ts:353-482`.\",\n      \"start_line\": 113,\n      \"end_line\": 125,\n      \"score\": 0.4306208847646005\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C15.md\",\n      \"language\": \"markdown\",\n      \"content\": \"/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:27:import { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';\\n/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:342:function extractSpecTitle(specFolderPath: string): string {\\n/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:350:    return normalizeSpecTitleForMemory(titleMatch[1]);\\n/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:624:    const specTitle = extractSpecTitle(specFolder);\\n/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:625:    const allowSpecTitleFallback = shouldEnrichTaskFromSpecTitle(\",\n      \"start_line\": 534,\n      \"end_line\": 538,\n      \"score\": 0.41850009167634994\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/* ───────────────────────────────────────────────────────────────\\n   CONTENT EXTRACTION HELPERS\\n----------------------------------------------------------------*/\\n\\n/**\\n * Extracts a display title from indexed content.\\n * @param content - The content to inspect.\\n * @param filename - The optional source filename.\\n * @returns The extracted title.\\n */\",\n      \"start_line\": 414,\n      \"end_line\": 423,\n      \"score\": 0.4180927478559795\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/analysis/analysis-X01.md\",\n      \"language\": \"markdown\",\n      \"content\": \"   368\\t    // Also include the full path for direct substring matching\\n   369\\t    relevanceKeywords.push(specFolderHint);\\n   370\\t  }\\n   371\\t\\n   372\\t  function isToolRelevant(tool: CaptureToolCall): boolean {\\n   373\\t    if (relevanceKeywords.length === 0) return true; // no filter\\n   374\\t    const filePath = tool.input?.filePath || tool.input?.file_path || tool.input?.path || '';\\n   375\\t    const title = tool.title || '';\\n   376\\t    const combined = `${filePath} ${title}`.toLowerCase();\\n   377\\t    return relevanceKeywords.some(kw => combined.includes(kw.toLowerCase()));\\n   378\\t  }\",\n      \"start_line\": 232,\n      \"end_line\": 242,\n      \"score\": 0.41596911726617236\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-deep-research-scratch.md\",\n      \"language\": \"markdown\",\n      \"content\": \"citing `input-normalizer.ts:430–451`.\\n\\nThe **current code** at `input-normalizer.ts:358–393` contains `buildToolObservationTitle()`:\\n```ts\\nfunction buildToolObservationTitle(tool: CaptureToolCall): string {\\n  ...\\n  switch (toolName.toLowerCase()) {\\n    case 'read':  return shortPath ? `Read ${shortPath}` : 'Read file';\\n    case 'edit':  return shortPath ? `Edit ${shortPath}` : 'Edit file';\\n    case 'grep':  return pattern  ? `Grep: ${pattern}`  : 'Grep search';\\n    // ... etc.\\n  }\\n}\\n```\\nAnd at `input-normalizer.ts:477`: `const toolTitle = buildToolObservationTitle(tool);` is used instead of the raw `Tool: ${tool.tool}` template.\\n\\n**The plan.md itself acknowledges this staleness** at line 175:\",\n      \"start_line\": 47,\n      \"end_line\": 63,\n      \"score\": 0.4124826055315154\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C05.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### FINDING-06: Tool relevance check misses many relevant tool calls\\n- **File:** [input-normalizer.ts:374](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:374)\\n- **Severity:** MEDIUM\\n- **Category:** BUG\\n- **Current Behavior:** Only `input.filePath/file_path/path` and `title` are considered.\\n- **Expected Behavior:** Relevance should inspect other tool input fields (e.g., query, glob pattern, args) when path fields are absent.\\n- **Root Cause:** Narrow field selection in `isToolRelevant`.\\n- **Suggested Fix:** Serialize/select additional safe input fields for relevance matching.\\n- **Effort:** SMALL (<30 min)\",\n      \"start_line\": 157,\n      \"end_line\": 165,\n      \"score\": 0.4099748432459407\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C05.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### FINDING-06: Tool relevance check misses many relevant tool calls\\n- **File:** [input-normalizer.ts:374](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:374)\\n- **Severity:** MEDIUM\\n- **Category:** BUG\\n- **Current Behavior:** Only `input.filePath/file_path/path` and `title` are considered.\\n- **Expected Behavior:** Relevance should inspect other tool input fields (e.g., query, glob pattern, args) when path fields are absent.\\n- **Root Cause:** Narrow field selection in `isToolRelevant`.\\n- **Suggested Fix:** Serialize/select additional safe input fields for relevance matching.\\n- **Effort:** SMALL (<30 min)\",\n      \"start_line\": 306,\n      \"end_line\": 314,\n      \"score\": 0.4099748432459407\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/core/workflow.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"import { detectSpecFolder, setupContextDirectory } from '../spec-folder';\\nimport { populateTemplate } from '../renderers';\\nimport { scoreMemoryQuality } from './quality-scorer';\\nimport { extractKeyTopics } from './topic-extractor';\\nimport type { DecisionForTopics } from './topic-extractor';\\nimport { writeFilesAtomically } from './file-writer';\\nimport { generateContentSlug, pickBestContentName, ensureUniqueMemoryFilename } from '../utils/slug-utils';\\nimport { normalizeSpecTitleForMemory, pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';\\nimport {\\n  buildSpecAffinityTargets,\\n  evaluateCollectedDataSpecAffinity,\\n} from '../utils/spec-affinity';\\nimport { deriveMemoryDescription } from '../utils/memory-frontmatter';\\nimport { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';\\nimport type { CollectedDataFull } from '../extractors/collect-session-data';\",\n      \"start_line\": 23,\n      \"end_line\": 37,\n      \"score\": 0.4051126073157931\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-deep-research-scratch.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 2. Staleness Detection\\n\\n### 2.1 R02: Generic `Tool: read` Titles — **CONFIRMED STALE**\\n\\n**Claim:** `title: \\\\`Tool: ${tool.tool}\\\\`` in tool-call observations.\\n\\n**Current code:**\\n```ts\\n// input-normalizer.ts:358–393\\nfunction buildToolObservationTitle(tool: CaptureToolCall): string {\\n  const toolName = tool.tool || 'unknown';\\n  const input = tool.input || {};\\n  if (tool.title && tool.title.length > 10 && !/^Tool:\\\\s/i.test(tool.title)) {\\n    return tool.title.substring(0, 80);\\n  }\\n  switch (toolName.toLowerCase()) {\\n    case 'read': return shortPath ? `Read ${shortPath}` : 'Read file';\\n    case 'edit': return shortPath ? `Edit ${shortPath}` : 'Edit file';\\n    // ...\\n  }\\n}\\n// input-normalizer.ts:477\\nconst toolTitle = buildToolObservationTitle(tool);\\n```\",\n      \"start_line\": 194,\n      \"end_line\": 217,\n      \"score\": 0.39634291907506736\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/core/quality-scorer.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"function extractHeadingTitle(content: string): string {\\n  const headingMatch = content.match(/^#\\\\s+(.+)$/m);\\n  return headingMatch?.[1]?.trim() || '';\\n}\\n\\nfunction hasSpecificPrimaryTitle(content: string): boolean {\\n  const titleCandidate = pickBestContentName([\\n    extractFrontmatterTitle(content),\\n    extractHeadingTitle(content),\\n  ]);\\n\\n  return titleCandidate.length >= 8;\\n}\\n\\nfunction hasMeaningfulObservationTitle(title?: string): boolean {\\n  if (!title) {\\n    return false;\\n  }\\n\\n  const normalized = normalizeMemoryNameCandidate(title);\\n  if (normalized.length < 10) {\\n    return false;\\n  }\\n\\n  return !isGenericContentTask(normalized) && !isContaminatedMemoryName(normalized);\\n}\\n\\n/**\\n * Score the quality of a generated memory file.\\n * Runs after template rendering, before file writing.\\n * Returns canonical score01 plus a score100 compatibility alias and a per-criterion breakdown.\\n */\",\n      \"start_line\": 130,\n      \"end_line\": 161,\n      \"score\": 0.3962355069231478\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-stateless-quality-gates/decision-record.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Decision\\n\\n**We chose**: Add an optional `captureSource?: string` parameter to `filterContamination()`; when source is `'claude-code-capture'`, return `'low'` for the tool-title-with-path pattern instead of `'high'`.\\n\\n**How it works**: The `captureSource` parameter is optional and defaults to undefined. In the severity lookup for tool-title-with-path, a conditional check on `captureSource === 'claude-code-capture'` returns `'low'`. All other patterns are unaffected. The `captureSource` value is threaded from `collectedData.captureSource` (or the stateless mode detection flag) in `workflow.ts` (~line 1356).\\n<!-- /ANCHOR:adr-003-decision -->\\n\\n---\\n\\n<!-- ANCHOR:adr-003-alternatives -->\",\n      \"start_line\": 250,\n      \"end_line\": 259,\n      \"score\": 0.3929975346664989\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-deep-research-scratch.md\",\n      \"language\": \"markdown\",\n      \"content\": \"**Verdict:** R02's tool-title section is stale. The `buildToolObservationTitle()` function did not exist when R02 was written. The function is called at `input-normalizer.ts:477` and replaces the raw `` `Tool: ${tool.tool}` `` template. The plan.md self-flags this at line 175.\\n\\n**Remaining R02 concerns that are still valid:**\\n- snake_case/camelCase mismatch for session metadata fields (plan.md Phase 0, task still unchecked)\\n- Single `recentContext` entry (plan.md Phase 0/1 concern)\\n- `FILES` limited to edit/write only\\n\\n---\",\n      \"start_line\": 219,\n      \"end_line\": 226,\n      \"score\": 0.39054780976106684\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/task-enrichment.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"import { isContaminatedMemoryName, isGenericContentTask, normalizeMemoryNameCandidate, pickBestContentName } from './slug-utils';\\n\\nfunction hasJsonDataFile(dataFilePath: string | null | undefined): boolean {\\n  return typeof dataFilePath === 'string' && dataFilePath.trim().length > 0;\\n}\\n\\n/** Normalizes a spec title for reuse in memory task enrichment. */\\nexport function normalizeSpecTitleForMemory(title: string): string {\\n  return normalizeMemoryNameCandidate(title);\\n}\\n\\n/** Returns whether the spec title should enrich the stored memory task. */\",\n      \"start_line\": 10,\n      \"end_line\": 21,\n      \"score\": 0.3905080623412047\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/z_archive/016-index-workflows-code/spec.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### US-003: Document Type Attribution (Priority: P1)\\n\\n**As a** search result consumer, **I want** skill files tagged with their source skill name, **so that** I can trace context back to the originating skill.\\n\\n**Acceptance Criteria**:\\n1. Given file `.opencode/skill/workflows-code--validation/references/guide.md`, When indexed, Then `spec_folder` field = `skill:workflows-code--validation`\\n2. Given search results, When I inspect metadata, Then skill-sourced files clearly distinguished from spec folder files\\n\\n---\",\n      \"start_line\": 288,\n      \"end_line\": 296,\n      \"score\": 0.3901720000778539\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/tests/context-server.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"    // T14: Each tool has a description\\n    for (const tool of EXPECTED_TOOLS) {\\n      it(`T14: Tool ${tool} has description`, () => {\\n        const toolDefRegex = new RegExp(`name:\\\\\\\\s*'${tool}'\\\\\\\\s*,\\\\\\\\s*description:\\\\\\\\s*'`)\\n        expect(toolDefRegex.test(toolSchemasCode)).toBe(true)\\n      })\\n    }\\n\\n    // T15: Each tool has an inputSchema\\n    for (const tool of EXPECTED_TOOLS) {\\n      it(`T15: Tool ${tool} has inputSchema`, () => {\\n        const schemaRegex = new RegExp(`name:\\\\\\\\s*'${tool}'[\\\\\\\\s\\\\\\\\S]*?inputSchema:\\\\\\\\s*\\\\\\\\{`)\\n        expect(schemaRegex.test(toolSchemasCode)).toBe(true)\\n      })\\n    }\\n\\n    it('T15b: context-server imports scoring observability init', () => {\\n      expect(sourceCode).toMatch(/initScoringObservability\\\\s*}\\\\s*from\\\\s*'\\\\.\\\\/lib\\\\/telemetry\\\\/scoring-observability'/)\\n    })\\n\\n    it('T15c: context-server initializes scoring observability at startup', () => {\\n      expect(sourceCode).toMatch(/initScoringObservability\\\\(database\\\\)/)\\n    })\\n  })\",\n      \"start_line\": 231,\n      \"end_line\": 254,\n      \"score\": 0.38614444446091056\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/source-capabilities.ts\",\n      \"language\": \"typescript\",\n      \"content\": \": {\\n    source: 'gemini-cli-capture',\\n    inputMode: 'stateless',\\n    toolTitleWithPathExpected: false,\\n    prefersStructuredSave: true,\\n  },\\n  simulation: {\\n    source: 'simulation',\\n    inputMode: 'structured',\\n    toolTitleWithPathExpected: false,\\n    prefersStructuredSave: false,\\n  },\\n};\\n\\nfunction isKnownDataSource(source: string): source is KnownDataSource {\\n  return source in SOURCE_CAPABILITIES;\\n}\\n\\nfunction getSourceCapabilities(source: DataSource | string | null | undefined): SourceCapabilities {\\n  if (!source) {\\n    return SOURCE_CAPABILITIES.file;\\n  }\\n\\n  if (typeof source === 'string' && isKnownDataSource(source)) {\\n    return SOURCE_CAPABILITIES[source];\\n  }\\n\\n  if (typeof source === 'string') {\\n    return SOURCE_CAPABILITIES.file;\\n  }\\n\\n  return SOURCE_CAPABILITIES[source];\\n}\\n\\nexport {\\n  SOURCE_CAPABILITIES,\\n  getSourceCapabilities,\\n  isKnownDataSource,\\n};\",\n      \"start_line\": 44,\n      \"end_line\": 82,\n      \"score\": 0.38458986090719804\n    }\n  ],\n  \"total_returned\": 20,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/input-normalizer.ts",
        "language": "typescript",
        "content": "  function isToolRelevant(tool: CaptureToolCall): boolean {\n    if (!specFolderHint) {\n      return true;\n    }\n\n    const toolTextParts = flattenToolContextStrings({\n      title: tool.title || '',\n      output: tool.output || '',\n      input: tool.input || {},\n    });\n\n    if ((tool.input?.filePath && matchesSpecAffinityFilePath(tool.input.filePath, specAffinityTargets))\n      || (tool.input?.file_path && matchesSpecAffinityFilePath(tool.input.file_path, specAffinityTargets))\n      || (tool.input?.path && matchesSpecAffinityFilePath(tool.input.path, specAffinityTargets))\n    ) {\n      return true;\n    }\n\n    if (toolTextParts.some((part) => matchesSpecAffinityText(part, specAffinityTargets))) {\n      return true;\n    }\n\n    const safeToolContext = toolTextParts.some((part) => isSafeSpecFallback(currentSpecId, part));\n    return safeToolContext && alignedExchangeTexts.length > 0;\n  }",
        "start_line": 799,
        "end_line": 823,
        "score": 0.512651506292114
      },
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/input-normalizer.ts",
exec
/bin/zsh -lc "rg -n \"prefersStructuredSave|toolTitleWithPathExpected|inputMode\" .opencode/skill/system-spec-kit/scripts --glob '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:8:  inputMode: SourceInputMode;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:9:  toolTitleWithPathExpected: boolean;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:10:  prefersStructuredSave: boolean;
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:16:    inputMode: 'structured',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:17:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:18:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:22:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:23:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:24:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:28:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:29:    toolTitleWithPathExpected: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:30:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:34:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:35:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:36:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:40:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:41:    toolTitleWithPathExpected: false,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:42:    prefersStructuredSave: true,
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:46:    inputMode: 'stateless',
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:47:    toolTitleWithPathExpected: false,
exec
/bin/zsh -lc "rg -n \"getSourceCapabilities\\(\" .opencode/skill/system-spec-kit/scripts --glob '"'!**/tests/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:110:  const sourceCapabilities = options?.sourceCapabilities ?? getSourceCapabilities(options?.captureSource);
.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:62:function getSourceCapabilities(source: DataSource | string | null | undefined): SourceCapabilities {
.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:398:  const capabilities = getSourceCapabilities(source);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1508:    const captureCapabilities = getSourceCapabilities(captureSource);
exec
/bin/zsh -lc 'rg -n "QUALITY_ABORT_THRESHOLD" .opencode/skill/system-spec-kit/scripts/core/config.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/**/*.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/core/config.ts:64:  QUALITY_ABORT_THRESHOLD: number;
.opencode/skill/system-spec-kit/scripts/core/config.ts:303:  QUALITY_ABORT_THRESHOLD: userConfig.qualityAbortThreshold,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2213:  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2214:  if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2216:      `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2252:  if (qualityResult.score01 < 0.6 && qualityResult.score01 >= QUALITY_ABORT_THRESHOLD) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2379:        qualityAbortThreshold: QUALITY_ABORT_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/core/config.ts:64:  QUALITY_ABORT_THRESHOLD: number;
.opencode/skill/system-spec-kit/scripts/core/config.ts:303:  QUALITY_ABORT_THRESHOLD: userConfig.qualityAbortThreshold,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2213:  const QUALITY_ABORT_THRESHOLD = CONFIG.QUALITY_ABORT_THRESHOLD;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2214:  if (qualityResult.score01 < QUALITY_ABORT_THRESHOLD) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2216:      `is below minimum threshold (${QUALITY_ABORT_THRESHOLD.toFixed(2)}). ` +
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2252:  if (qualityResult.score01 < 0.6 && qualityResult.score01 >= QUALITY_ABORT_THRESHOLD) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2379:        qualityAbortThreshold: QUALITY_ABORT_THRESHOLD,
.opencode/skill/system-spec-kit/scripts/dist/core/config.d.ts:47:    QUALITY_ABORT_THRESHOLD: number;
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1284:    const previousThreshold = CONFIG.QUALITY_ABORT_THRESHOLD;
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1285:    CONFIG.QUALITY_ABORT_THRESHOLD = 0.5;
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:1307:      CONFIG.QUALITY_ABORT_THRESHOLD = previousThreshold;
exec
/bin/zsh -lc "sed -n '250,340p' .opencode/skill/system-spec-kit/scripts/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    if (fsSync.existsSync(configPath)) {
      const configContent: string = fsSync.readFileSync(configPath, 'utf-8');

      // F-09: Strip JSONC comments and parse directly — no brace-depth extraction needed
      const stripped: string = stripJsoncComments(configContent).trim();

      if (!stripped) {
        structuredLog('warn', 'Config file is empty or contains only comments. Using defaults.');
        return defaultConfig;
      }

      const userConfig = JSON.parse(stripped) as Partial<WorkflowConfig>;
      const merged = { ...defaultConfig, ...userConfig };
      merged.learningWeights = {
        ...defaultConfig.learningWeights,
        ...(userConfig.learningWeights || {}),
      };
      return validateConfig(merged, defaultConfig);
    }
  } catch (error: unknown) {
exec
/bin/zsh -lc 'rg -n "qualityAbortThreshold" .opencode/skill/system-spec-kit/scripts/core/config.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
34:  qualityAbortThreshold: number;
104:    log('warn', 'qualityAbortThreshold invalid or out of range 0.0-1.0 (or legacy 1-100), using default', {
112:    log('warn', 'qualityAbortThreshold uses legacy 1-100 scale and was auto-converted to canonical 0.0-1.0', {
151:  validated.qualityAbortThreshold = normalizeQualityAbortThreshold(
152:    validated.qualityAbortThreshold,
153:    defaults.qualityAbortThreshold,
239:    qualityAbortThreshold: 0.15,
303:  QUALITY_ABORT_THRESHOLD: userConfig.qualityAbortThreshold,
exec
/bin/zsh -lc "sed -n '220,250p' .opencode/skill/system-spec-kit/scripts/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   4. CONFIG LOADER
------------------------------------------------------------------*/

function loadConfig(): WorkflowConfig {
  const defaultConfig: WorkflowConfig = {
    maxResultPreview: 500,
    maxConversationMessages: 100,
    maxToolOutputLines: 100,
    messageTimeWindow: 300000,
    contextPreviewHeadLines: 50,
    contextPreviewTailLines: 20,
    timezoneOffsetHours: 0,
    maxFilesInMemory: 10,
    maxObservations: 15, // Raised from 3 to 15 to prevent 96% data loss (009-perfect-session-capturing)
    minPromptLength: 60,
    maxContentPreview: 500,
    toolPreviewLines: 10,
    toolOutputMaxLength: 500,
    timestampMatchToleranceMs: 5000,
    qualityAbortThreshold: 0.15,
codex
I now have the behavior map; I’m pulling exact line-number snippets so the final report can cite each capability field to each downstream effect precisely.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts | sed -n '130,215p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts | sed -n '292,355p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts | sed -n '90,150p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '380,460p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   292	    }
   293	  }
   294	
   295	  let score01 = clamp01(Object.values(breakdown).reduce((sum, v) => sum + v, 0) / 100);
   296	  let scoreCap: number | null = null;
   297	  const effectiveSeverity: ContaminationSeverity = contaminationSeverity || 'medium';
   298	
   299	  if (hadContamination) {
   300	    qualityFlags.add('has_contamination');
   301	    const severity = effectiveSeverity;
   302	    if (severity === 'low') {
   303	      score01 -= 0.05;
   304	      warnings.push('Low-severity contamination detected (preamble only) — minor penalty applied');
   305	    } else if (severity === 'medium') {
   306	      score01 -= 0.10;
   307	      scoreCap = Math.min(scoreCap ?? 1, 0.85);
   308	      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
   309	    } else {
   310	      score01 -= 0.25;
   311	      scoreCap = Math.min(scoreCap ?? 1, 0.6);
 succeeded in 0ms:
   130	      qualityFlags.add('has_contaminated_title');
   131	    }
   132	    if (failed.ruleId === 'V10') {
   133	      qualityFlags.add('has_session_source_mismatch');
   134	    }
   135	    if (failed.ruleId === 'V11') {
   136	      qualityFlags.add('has_error_content');
   137	    }
   138	  }
   139	
   140	  if (hadContamination) {
   141	    qualityFlags.add('has_contamination');
   142	    const severity = contaminationSeverity || 'medium';
   143	    if (severity === 'low') {
   144	      warnings.push('Low-severity contamination detected (preamble only) — penalty applied post-bonus');
   145	    } else if (severity === 'medium') {
   146	      sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.85);
   147	      warnings.push('Medium-severity contamination detected (orchestration chatter) — capped at 0.85');
   148	    } else {
   149	      sufficiencyCap = Math.min(sufficiencyCap ?? 1, 0.6);
 succeeded in 0ms:
    90	   3. FILTER LOGIC
    91	------------------------------------------------------------------*/
    92	
    93	function clonePattern(pattern: RegExp): RegExp {
    94	  return new RegExp(pattern.source, pattern.flags);
    95	}
    96	
    97	function getDenylistLabel(entry: DenylistPattern): string {
    98	  return entry instanceof RegExp ? entry.toString() : entry.label;
    99	}
   100	
   101	function getDenylistPattern(entry: DenylistPattern): RegExp {
   102	  return entry instanceof RegExp ? entry : entry.pattern;
   103	}
   104	
   105	function getDenylistSeverity(entry: DenylistPattern, options?: FilterOptions): ContaminationSeverity {
   106	  if (entry instanceof RegExp) {
   107	    return 'high';
   108	  }
   109	
 succeeded in 0ms:
   380	function extractAllowedSpecIds(specFolder: string): Set<string> {
   381	  const matches = specFolder.match(SPEC_ID_REGEX) ?? [];
   382	  return new Set(matches);
   383	}
   384	
   385	function extractFirstHeading(content: string): string {
   386	  const headingMatch = content.match(/^#\s+(.+)$/m);
   387	  return headingMatch ? headingMatch[1].trim() : '';
   388	}
   389	
   390	function ruleAppliesToSource(
   391	  metadata: ValidationRuleMetadata,
   392	  source?: DataSource | string | null,
   393	): boolean {
   394	  if (metadata.appliesToSources === 'all') {
   395	    return true;
   396	  }
   397	
   398	  const capabilities = getSourceCapabilities(source);
   399	  return metadata.appliesToSources.includes(capabilities.source);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1406,1465p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1406	
  1407	    if (!collectedData) {
  1408	      throw new Error('No data available - provide dataFile, collectedData, or loadDataFn');
  1409	    }
  1410	
  1411	    // Step 1.5: Stateless mode alignment check
  1412	    // When no JSON data file was provided, data comes from the active OpenCode session.
  1413	    // Verify the captured content relates to the target spec folder to prevent
  1414	    // Cross-spec contamination (e.g., session working on spec A saved to spec B).
  1415	    const isStatelessMode = !activeDataFile && !preloadedData;
  1416	    if (isStatelessMode && activeSpecFolderArg && (collectedData.observations || collectedData.FILES)) {
  1417	      const alignmentTargets = await resolveAlignmentTargets(activeSpecFolderArg);
  1418	      const specAffinityTargets = buildSpecAffinityTargets(activeSpecFolderArg);
  1419	      const specAffinity = evaluateCollectedDataSpecAffinity(collectedData, specAffinityTargets);
  1420	
  1421	      if (!specAffinity.hasAnchor) {
  1422	        // Q1: Downgrade Block A from hard abort to warning when spec folder was explicitly
  1423	        // provided via CLI argument. The user's explicit intent overrides the anchor check.
  1424	        // Blocks B and C (file-path overlap) remain as hard blocks for safety.
  1425	        const alignMsg = `ALIGNMENT_WARNING: Captured stateless content matched the workspace but not the target spec folder "${activeSpecFolderArg}". ` +
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1490,1535p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2218,2255p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1228,1260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts | sed -n '20,60p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	import type { DataSource } from './input-normalizer';
     2	
     3	export type SourceInputMode = 'structured' | 'stateless';
     4	export type KnownDataSource = DataSource;
     5	
     6	export interface SourceCapabilities {
     7	  source: DataSource;
     8	  inputMode: SourceInputMode;
     9	  toolTitleWithPathExpected: boolean;
    10	  prefersStructuredSave: boolean;
    11	}
    12	
    13	const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
    14	  file: {
    15	    source: 'file',
    16	    inputMode: 'structured',
    17	    toolTitleWithPathExpected: false,
    18	    prefersStructuredSave: true,
    19	  },
    20	  'opencode-capture': {
 succeeded in 0ms:
  1490	        : path.basename(normalizedSpecFolder);
  1491	    }
  1492	    log(`   Using: ${specFolder}\n`);
  1493	
  1494	    // Step 3: Setup context directory
  1495	    log('Step 3: Setting up context directory...');
  1496	    const contextDir: string = await setupContextDirectory(specFolder);
  1497	    log(`   Created: ${contextDir}\n`);
  1498	
  1499	    // F-23: Define contamination cleaning functions before enrichment
  1500	    let hadContamination = false;
  1501	    let contaminationMaxSeverity: ContaminationSeverity | null = null;
  1502	    const contaminationAuditTrail: ContaminationAuditRecord[] = [];
  1503	    const extractorPatternCounts = new Map<string, number>();
  1504	    let extractorProcessedFieldCount = 0;
  1505	    let extractorCleanedFieldCount = 0;
  1506	    let extractorRemovedPhraseCount = 0;
  1507	    const captureSource = typeof collectedData?._source === 'string' ? collectedData._source : undefined;
  1508	    const captureCapabilities = getSourceCapabilities(captureSource);
  1509	    const cleanContaminationText = (input: string): string => {
 succeeded in 0ms:
  1228	  }
  1229	
  1230	  return enriched;
  1231	}
  1232	
  1233	async function enrichStatelessData(
  1234	  collectedData: CollectedDataFull,
  1235	  specFolder: string,
  1236	  projectRoot: string
  1237	): Promise<CollectedDataFull> {
  1238	  // File-backed JSON gets selective enrichment (git provenance, trigger phrases)
  1239	  // but NOT full observation/FILES injection — preserves V8 safety
  1240	  if (collectedData._source === 'file') {
  1241	    return enrichFileSourceData(collectedData, specFolder, projectRoot);
  1242	  }
  1243	
  1244	  const enriched: CollectedDataFull = { ...collectedData };
  1245	
  1246	  try {
  1247	    // Run spec-folder and git extraction in parallel
 succeeded in 0ms:
  2218	      `To force save, pass data via JSON file instead of stateless mode.`;
  2219	    warn(abortMsg);
  2220	    throw new Error(abortMsg);
  2221	  }
  2222	
  2223	  const validationDisposition = determineValidationDisposition(qualityValidation.failedRules, captureSource);
  2224	  if (validationDisposition.disposition === 'abort_write') {
  2225	    const failedContaminationRules = validationDisposition.blockingRuleIds.filter((ruleId) => ruleId === 'V8' || ruleId === 'V9');
  2226	    if (failedContaminationRules.length > 0) {
  2227	      const contaminationAbortMsg = `CONTAMINATION_GATE_ABORT: Critical contamination rules failed: [${failedContaminationRules.join(', ')}]. ` +
  2228	        `Content contains cross-spec contamination that would corrupt the memory index. Aborting write.`;
  2229	      warn(contaminationAbortMsg);
  2230	      throw new Error(contaminationAbortMsg);
  2231	    }
  2232	
  2233	    const validationAbortMsg = `QUALITY_GATE_ABORT: Save blocked due to failed validation rules: ${validationDisposition.blockingRuleIds.join(', ')}`;
  2234	    warn(validationAbortMsg);
  2235	    throw new Error(validationAbortMsg);
  2236	  }
  2237	
 succeeded in 0ms:
    20	
    21	/** Returns whether the spec title should enrich the stored memory task. */
    22	export function shouldEnrichTaskFromSpecTitle(
    23	  task: string,
    24	  source: unknown,
    25	  dataFilePath: string | null | undefined
    26	): boolean {
    27	  if (source === 'file' || hasJsonDataFile(dataFilePath)) {
    28	    return false;
    29	  }
    30	
    31	  const normalizedTask = normalizeMemoryNameCandidate(task);
    32	  return isGenericContentTask(normalizedTask) || isContaminatedMemoryName(normalizedTask);
    33	}
    34	
    35	/** Picks the preferred task label for memory storage. */
    36	export function pickPreferredMemoryTask(
    37	  task: string,
    38	  specTitle: string,
    39	  folderBase: string,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2100,2145p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2100	    log('   No HTML cleaning needed');
  2101	  }
  2102	
  2103	  // Step 8.6: Quality validation + scoring
  2104	  log('Step 8.6: Quality scoring...');
  2105	  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
  2106	  contaminationAuditTrail.push(qualityValidation.contaminationAudit);
  2107	  const metadataJson = JSON.parse(files['metadata.json']) as Record<string, unknown>;
  2108	  metadataJson.contaminationAudit = contaminationAuditTrail;
  2109	  files['metadata.json'] = JSON.stringify(metadataJson, null, 2);
  2110	  const qualitySignals: ValidationSignal[] = qualityValidation.ruleResults.map((rule) => ({
  2111	    ruleId: rule.ruleId,
  2112	    passed: rule.passed,
  2113	  }));
  2114	  const sufficiencySnapshot = buildWorkflowMemoryEvidenceSnapshot({
  2115	    title: memoryTitle,
  2116	    content: files[ctxFilename],
  2117	    triggerPhrases: preExtractedTriggers,
  2118	    files: effectiveFiles,
  2119	    observations: sessionData.OBSERVATIONS || [],
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2178,2230p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2178	  }
  2179	
  2180	  if (!qualityValidation.valid) {
  2181	    warn(`QUALITY_GATE_FAIL: ${qualityValidation.failedRules.join(', ')}`);
  2182	  }
  2183	  const qualityResult = scoreMemoryQuality(
  2184	    files[ctxFilename],
  2185	    preExtractedTriggers,
  2186	    keyTopics,
  2187	    effectiveFiles,
  2188	    sessionData.OBSERVATIONS || [],
  2189	    sufficiencyResult,
  2190	    hadContamination,
  2191	    contaminationMaxSeverity,
  2192	  );
  2193	  log(
  2194	    `   Memory quality score: ${qualityResult.score100}/100 (${qualityResult.score01.toFixed(2)}) ` +
  2195	    `canonical, ${qualityV2.score100}/100 (${qualityV2.score01.toFixed(2)}) (v2)`
  2196	  );
  2197	  if (qualityResult.warnings.length > 0) {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '34,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    34	  indexBlockingRuleIds: QualityRuleId[];
    35	  softRuleIds: QualityRuleId[];
    36	}
    37	
    38	const VALIDATION_RULE_METADATA: Record<QualityRuleId, ValidationRuleMetadata> = {
    39	  V1: {
    40	    ruleId: 'V1',
    41	    severity: 'high',
    42	    blockOnWrite: true,
    43	    blockOnIndex: true,
    44	    appliesToSources: 'all',
    45	    reason: 'Placeholder leakage in required durable-memory fields corrupts the saved output contract.',
    46	  },
    47	  V2: {
    48	    ruleId: 'V2',
    49	    severity: 'medium',
    50	    blockOnWrite: false,
    51	    blockOnIndex: true,
    52	    appliesToSources: 'all',
    53	    reason: 'Structured content can be saved for inspection, but placeholder leakage with real tool evidence should not reach the semantic index.',
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1848,1875p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1848	  // Step 8: Populate templates
  1849	  log('Step 8: Populating template...');
  1850	
  1851	  const specFolderBasename: string = path.basename(sessionData.SPEC_FOLDER || specFolderName);
  1852	  const folderBase: string = specFolderBasename.replace(/^\d+-/, '');
  1853	
  1854	    let enrichedTask = implSummary.task;
  1855	    const dataSource = typeof collectedData?._source === 'string' ? collectedData._source : null;
  1856	    const specTitle = extractSpecTitle(specFolder);
  1857	    const allowSpecTitleFallback = shouldEnrichTaskFromSpecTitle(
  1858	      enrichedTask,
  1859	      dataSource,
  1860	      activeDataFile
  1861	    );
  1862	
  1863	    if (allowSpecTitleFallback) {
  1864	      if (specTitle.length >= 8) {
  1865	        enrichedTask = specTitle;
  1866	        log(`   Enriched task from spec.md: "${enrichedTask}"`);
  1867	      }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts | sed -n '68,88p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    68	  // F-10: Tool titles with path arguments (Read/Edit/Write/Grep/Glob/Bash) — high severity
    69	  { label: 'tool title with path', pattern: /\b(?:Read|Edit|Write|Grep|Glob|Bash)\s+(?:tool\s+)?(?:on\s+)?[\/\.][^\s]+/gi, severity: 'high' },
    70	  // API/service error leakage — high severity
    71	  { label: 'api error prefix', pattern: /\bAPI\s+Error:\s*\d{3}\b/gi, severity: 'high' },
    72	  { label: 'json error payload', pattern: /\{"\s*(?:type|error)"\s*:\s*"\s*(?:error|api_error|overloaded_error|rate_limit_error|server_error|invalid_request_error)\b/gi, severity: 'high' },
    73	  { label: 'request id leak', pattern: /"request_id"\s*:\s*"req_[a-zA-Z0-9]+"/gi, severity: 'high' },
    74	] as const;
    75	
    76	interface FilterResult {
    77	  cleanedText: string;
    78	  removedPhrases: string[];
    79	  hadContamination: boolean;
    80	  matchedPatterns: string[];
    81	  maxSeverity: ContaminationSeverity | null;
    82	}
    83	
    84	interface FilterOptions {
    85	  captureSource?: DataSource;
    86	  sourceCapabilities?: SourceCapabilities;
    87	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '2358,2425p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2358	      ...(reason ? { reason } : {}),
  2359	      ...(errorMessage ? { errorMessage } : {}),
  2360	    };
  2361	    await updateMetadataEmbeddingStatus(contextDir, indexingStatus);
  2362	  };
  2363	
  2364	  // RC-6 fix: Only index if the context file was actually written (not a duplicate skip)
  2365	  if (!ctxFileWritten) {
  2366	    log('   Skipping indexing — context file was a duplicate');
  2367	    await persistIndexingStatus(
  2368	      'skipped_duplicate',
  2369	      'Context file content matched an existing memory file, so semantic indexing was skipped.'
  2370	    );
  2371	  } else {
  2372	    try {
  2373	      const indexDecision = shouldIndexMemory({
  2374	        ctxFileWritten,
  2375	        validationDisposition,
  2376	        templateContractValid: templateContractEarly.valid,
  2377	        sufficiencyPass: sufficiencyResult.pass,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '150,210p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   150	function shouldIndexMemory(options: {
   151	  ctxFileWritten: boolean;
   152	  validationDisposition: ValidationDispositionResult;
   153	  templateContractValid: boolean;
   154	  sufficiencyPass: boolean;
   155	  qualityScore01: number;
   156	  qualityAbortThreshold: number;
   157	}): { shouldIndex: boolean; reason?: string } {
   158	  if (!options.ctxFileWritten) {
   159	    return {
   160	      shouldIndex: false,
   161	      reason: 'Context file content matched an existing memory file, so semantic indexing was skipped.',
   162	    };
   163	  }
   164	
   165	  if (!options.templateContractValid) {
   166	    return {
   167	      shouldIndex: false,
   168	      reason: 'Rendered memory failed the template contract, so semantic indexing was skipped.',
   169	    };
codex
1. **Capability field interaction map**

- **`toolTitleWithPathExpected`**
  - Consumer: [`contamination-filter.ts:111`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:111).
  - Concrete effect: for denylist label `tool title with path` (base severity is `high` at [`contamination-filter.ts:69`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:69)), severity is downgraded to `low` when capability is `true`.
  - End-to-end propagation:
    - Capabilities are loaded in workflow and passed into contamination filtering at [`workflow.ts:1508`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1508), [`workflow.ts:1514`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1514).
    - Resulting `contaminationMaxSeverity` is accumulated at [`workflow.ts:1521`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1521).
    - That severity feeds both scorers at [`workflow.ts:2131`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2131) and [`workflow.ts:2191`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2191).
    - Scoring impact:
      - v2 scorer: low = `-0.10`, medium = `-0.20` + cap `0.85`, high = `-0.30` + cap `0.60` ([`extractors/quality-scorer.ts:190`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:190), [`extractors/quality-scorer.ts:193`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:193), [`extractors/quality-scorer.ts:195`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:195)).
      - canonical scorer: low = `-0.05`, medium = `-0.10` + cap `0.85`, high = `-0.25` + cap `0.60` ([`core/quality-scorer.ts:303`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:303), [`core/quality-scorer.ts:307`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:307), [`core/quality-scorer.ts:311`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:311)).
    - Threshold/index consequences: lower contamination severity reduces chance of abort at quality threshold [`workflow.ts:2214`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2214), and reduces skip risk in index policy check [`workflow.ts:2373`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2373).

- **`inputMode`**
  - Consumer: [`workflow.ts:2244`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2244).
  - Concrete effect: only changes warning text (`"Stateless save..."` vs `"Structured save..."`) when there are soft validation failures.
  - Important non-effect: it does **not** drive real mode branching. Actual stateless-mode behavior is selected by `!activeDataFile && !preloadedData` at [`workflow.ts:1415`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1415), not by `captureCapabilities.inputMode`.

- **`prefersStructuredSave`**
  - Defined in capabilities schema and per-source map ([`source-capabilities.ts:10`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:10), [`source-capabilities.ts:13`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:13)).
  - Runtime consumers found: **none** in `scripts/` (outside tests).
  - Concrete effect today: **no effect** on contamination scoring, validation disposition, thresholding, or mode selection.

- **Quality-rule applicability (`validate-memory-quality.ts`)**
  - Source capabilities are consulted in `ruleAppliesToSource` at [`validate-memory-quality.ts:398`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:398).
  - Current concrete effect: effectively none, because all rules are `appliesToSources: 'all'` ([`validate-memory-quality.ts:44`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:44), same for V1–V12 through [`validate-memory-quality.ts:132`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:132)).

2. **Capabilities defined but never consumed**

- `prefersStructuredSave` is defined but not used by runtime pipeline logic.
- Secondary note: `inputMode` is consumed, but only for warning phrasing, not behavioral mode control.

3. **Consumers using raw source names instead of capabilities**

- Yes.
  - Raw `_source === 'file'` enrichment branch: [`workflow.ts:1240`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1240).
  - Stateless mode decision based on input presence (not capabilities): [`workflow.ts:1415`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1415).
  - Task fallback routing uses raw `source === 'file'`: [`workflow.ts:1855`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1855), [`task-enrichment.ts:27`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:27).
- In contrast, contamination severity and validation disposition logic use capabilities abstraction properly (via `getSourceCapabilities`).
tokens used
82,163
1. **Capability field interaction map**

- **`toolTitleWithPathExpected`**
  - Consumer: [`contamination-filter.ts:111`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:111).
  - Concrete effect: for denylist label `tool title with path` (base severity is `high` at [`contamination-filter.ts:69`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts:69)), severity is downgraded to `low` when capability is `true`.
  - End-to-end propagation:
    - Capabilities are loaded in workflow and passed into contamination filtering at [`workflow.ts:1508`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1508), [`workflow.ts:1514`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1514).
    - Resulting `contaminationMaxSeverity` is accumulated at [`workflow.ts:1521`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1521).
    - That severity feeds both scorers at [`workflow.ts:2131`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2131) and [`workflow.ts:2191`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2191).
    - Scoring impact:
      - v2 scorer: low = `-0.10`, medium = `-0.20` + cap `0.85`, high = `-0.30` + cap `0.60` ([`extractors/quality-scorer.ts:190`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:190), [`extractors/quality-scorer.ts:193`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:193), [`extractors/quality-scorer.ts:195`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:195)).
      - canonical scorer: low = `-0.05`, medium = `-0.10` + cap `0.85`, high = `-0.25` + cap `0.60` ([`core/quality-scorer.ts:303`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:303), [`core/quality-scorer.ts:307`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:307), [`core/quality-scorer.ts:311`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:311)).
    - Threshold/index consequences: lower contamination severity reduces chance of abort at quality threshold [`workflow.ts:2214`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2214), and reduces skip risk in index policy check [`workflow.ts:2373`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2373).

- **`inputMode`**
  - Consumer: [`workflow.ts:2244`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2244).
  - Concrete effect: only changes warning text (`"Stateless save..."` vs `"Structured save..."`) when there are soft validation failures.
  - Important non-effect: it does **not** drive real mode branching. Actual stateless-mode behavior is selected by `!activeDataFile && !preloadedData` at [`workflow.ts:1415`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1415), not by `captureCapabilities.inputMode`.

- **`prefersStructuredSave`**
  - Defined in capabilities schema and per-source map ([`source-capabilities.ts:10`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:10), [`source-capabilities.ts:13`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts:13)).
  - Runtime consumers found: **none** in `scripts/` (outside tests).
  - Concrete effect today: **no effect** on contamination scoring, validation disposition, thresholding, or mode selection.

- **Quality-rule applicability (`validate-memory-quality.ts`)**
  - Source capabilities are consulted in `ruleAppliesToSource` at [`validate-memory-quality.ts:398`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:398).
  - Current concrete effect: effectively none, because all rules are `appliesToSources: 'all'` ([`validate-memory-quality.ts:44`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:44), same for V1–V12 through [`validate-memory-quality.ts:132`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:132)).

2. **Capabilities defined but never consumed**

- `prefersStructuredSave` is defined but not used by runtime pipeline logic.
- Secondary note: `inputMode` is consumed, but only for warning phrasing, not behavioral mode control.

3. **Consumers using raw source names instead of capabilities**

- Yes.
  - Raw `_source === 'file'` enrichment branch: [`workflow.ts:1240`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1240).
  - Stateless mode decision based on input presence (not capabilities): [`workflow.ts:1415`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1415).
  - Task fallback routing uses raw `source === 'file'`: [`workflow.ts:1855`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1855), [`task-enrichment.ts:27`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts:27).
- In contrast, contamination severity and validation disposition logic use capabilities abstraction properly (via `getSourceCapabilities`).
