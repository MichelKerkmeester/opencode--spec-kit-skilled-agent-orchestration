OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019ccec8-e25f-7182-b17c-9bdbda79c15c
--------
user
You are auditing the session-capturing pipeline of a Spec Kit Memory system. Your focus: QUALITY & SCORING.

The pipeline has TWO quality scoring systems that evaluate generated memory files.

TASK: Audit both quality scorers for correctness, calibration, and usefulness. Read:
1. /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts (v1 legacy scorer, 146 lines) — 6-dimension scoring
2. /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts (v2 scorer, 127 lines) — rule-based V1-V9
3. /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts (how scorers are invoked, 950 lines)
4. /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts (quality thresholds, 273 lines)

For each scorer, analyze:
- Are the scoring dimensions meaningful and non-redundant?
- Are thresholds calibrated correctly? (What score does a perfect session get? An empty session?)
- Do quality gates actually catch real problems?
- What false positives exist? (Good content flagged as bad)
- What false negatives exist? (Bad content passes)
- Is the QUALITY_GATE_FAIL threshold correct?
- Do the two scorers agree? Can they contradict?
- Are penalty/bonus calculations mathematically sound?
- Edge cases: 0 messages, 1 message, all-tool messages, very long sessions 

OUTPUT FORMAT — repeat this block for EACH finding:

### FINDING-[NN]: [Title]
- **File:** [path:lines]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW
- **Category:** BUG / QUALITY / PERFORMANCE / SECURITY / DESIGN
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Root Cause:** [why it is wrong]
- **Suggested Fix:** [concrete code change or pseudocode]
- **Effort:** TRIVIAL (<5 min) / SMALL (<30 min) / MEDIUM (<2 hr) / LARGE (>2 hr)

End with:

### SUMMARY
- Total findings: [N]
- Critical: [N], High: [N], Medium: [N], Low: [N]
- Top 3 recommendations: [...]

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents or spawn child tasks. Complete ALL work with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m auditing the two quality scorers plus the workflow/config wiring, and I’ll start by loading the relevant files and checking whether any deeper `AGENTS.md` files add local rules in that part of the repo.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files -g 'AGENTS.md' .opencode/skill/system-spec-kit .opencode/skill/scripts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------
// Scores the quality of generated memory files based on multiple criteria

interface FileWithDescription {
  DESCRIPTION?: string;
}

interface ObservationWithNarrative {
  TITLE?: string;
  NARRATIVE?: string;
}

interface QualityBreakdown {
  triggerPhrases: number;
  keyTopics: number;
  fileDescriptions: number;
  contentLength: number;
  noLeakedTags: number;
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Quality Scorer
// ---------------------------------------------------------------
// Computes deterministic quality score and flags for rendered memories

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';

type QualityFlag =
  | 'has_placeholders'
  | 'has_fallback_decision'
  | 'has_contamination'
  | 'sparse_semantic_fields'
  | 'has_tool_state_mismatch'
  | 'has_spec_relevance_mismatch'
  | 'has_contaminated_title';

interface ValidationSignal {
  ruleId: QualityRuleId;
  passed: boolean;
}
 exited 1 in 52ms:

exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Audit both Spec Kit Memory quality scorers for correctness, calibration, and usefulness; inspect workflow.ts and config.ts; produce findings with severities and suggested fixes." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.49s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-ufH3o9kG' (errno=Operation not permitted)
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !audit(multi), !intent:memory, !memory, !spec, context"
  },
  {
    "skill": "sk-code-review",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.23,
    "passes_threshold": true,
    "reason": "Matched: !audit, !audit(multi), !findings, !intent:review, correctness"
  },
  {
codex
I’ve loaded both scorer implementations. Next I’m tracing how `workflow.ts` and `config.ts` interpret those scores so we can distinguish scoring bugs from wiring or threshold bugs.
exec
/bin/zsh -lc "sed -n '1,340p' .opencode/skill/system-spec-kit/scripts/core/config.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "quality|QUALITY|scoreMemoryQuality|QUALITY_GATE_FAIL|qualityScore|qualityFlags|warnings|breakdown" .opencode/skill/system-spec-kit/scripts/core/workflow.ts .opencode/skill/system-spec-kit/scripts/core/config.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '261,620p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '621,980p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Config
// ---------------------------------------------------------------
// Central configuration loader — reads JSONC config, resolves paths, exports CONFIG object
// ---------------------------------------------------------------

import * as path from 'path';
import * as fsSync from 'fs';
import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
import { structuredLog } from '../utils/logger';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

/** Represents workflow config. */
export interface WorkflowConfig {
  maxResultPreview: number;
  maxConversationMessages: number;
  maxToolOutputLines: number;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:22:import { scoreMemoryQuality } from './quality-scorer';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:33:  scoreMemoryQuality as scoreMemoryQualityV2,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:35:} from '../extractors/quality-scorer';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:36:import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:88:    qualityScore: number;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:377:function injectQualityMetadata(content: string, qualityScore: number, qualityFlags: string[]): string {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:384:  const qualityLines = [
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:385:    `quality_score: ${qualityScore.toFixed(2)}`,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:386:    'quality_flags:',
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:387:    ...(qualityFlags.length > 0 ? qualityFlags.map((flag) => `  - "${flag}"`) : ['  []']),
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:390:  const updatedYaml = `${yamlBlock}\n\n# Quality Signals\n${qualityLines}`;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:568:  // Run content through filter pipeline for quality scoring
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:573:  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:575:    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:775:  if (filterStats.qualityScore < 20) {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:776:    const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:778:    log(`   Warning: Low quality session (${filterStats.qualityScore}/100) - warning header added`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:788:  log(`   Template populated (quality: ${filterStats.qualityScore}/100)\n`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:809:  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:810:  const qualitySignals: ValidationSignal[] = qualityValidation.ruleResults.map((rule) => ({
 succeeded in 51ms:
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
 succeeded in 51ms:
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
 succeeded in 51ms:

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
codex
The workflow wiring is clearer now: v2 controls the hard gate for indexing, while the legacy scorer is logging-only. I’m pulling the validator and a few targeted snippets with line numbers next so the findings can point to exact rule interactions and edge-case math.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "validateMemoryQualityContent|failedRules|ruleResults|V1|V2|V3|V4|V5|V6|V7|V8|V9|QUALITY_GATE_FAIL" .opencode/skill/system-spec-kit/scripts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '760,940p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality
// ---------------------------------------------------------------
// Post-render quality gate for generated memory files

import fs from 'fs';
import path from 'path';

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';

interface RuleResult {
  ruleId: QualityRuleId;
  passed: boolean;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  failedRules: QualityRuleId[];
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:33:  scoreMemoryQuality as scoreMemoryQualityV2,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:36:import { validateMemoryQualityContent } from '../memory/validate-memory-quality';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:809:  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:810:  const qualitySignals: ValidationSignal[] = qualityValidation.ruleResults.map((rule) => ({
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:814:  const qualityV2 = scoreMemoryQualityV2({
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:822:  files[ctxFilename] = injectQualityMetadata(files[ctxFilename], qualityV2.qualityScore, qualityV2.qualityFlags);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:825:    warn(`QUALITY_GATE_FAIL: ${qualityValidation.failedRules.join(', ')}`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:835:  log(`   Memory quality score: ${qualityResult.score}/100 (legacy), ${qualityV2.qualityScore.toFixed(2)} (v2)`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:869:  log('Step 9.5: State embedded in memory file (V13.0)');
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:899:      log('   QUALITY_GATE_FAIL: skipping production indexing for this file');
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:6:type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:67:  const failedRules = validatorSignals.filter((signal) => !signal.passed);
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:68:  qualityScore -= failedRules.length * PENALTY_PER_FAILED_RULE;
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:70:  for (const failed of failedRules) {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:71:    if (failed.ruleId === 'V1' || failed.ruleId === 'V2') {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:74:    if (failed.ruleId === 'V4') {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:77:    if (failed.ruleId === 'V5') {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:80:    if (failed.ruleId === 'V6') {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:83:    if (failed.ruleId === 'V7') {
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:86:    if (failed.ruleId === 'V8') {
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Quality Scorer
     3	// ---------------------------------------------------------------
     4	// Computes deterministic quality score and flags for rendered memories
     5	
     6	type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';
     7	
     8	type QualityFlag =
     9	  | 'has_placeholders'
    10	  | 'has_fallback_decision'
    11	  | 'has_contamination'
    12	  | 'sparse_semantic_fields'
    13	  | 'has_tool_state_mismatch'
    14	  | 'has_spec_relevance_mismatch'
    15	  | 'has_contaminated_title';
    16	
    17	interface ValidationSignal {
    18	  ruleId: QualityRuleId;
    19	  passed: boolean;
    20	}
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Content Filter
// ---------------------------------------------------------------

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
import { structuredLog } from '../utils/logger';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

/** Content type classification labels */
export type ContentType = 'noise' | 'empty' | 'duplicate' | 'lowQuality' | 'valid';

/** Filter pipeline configuration */
export interface FilterConfig {
  pipeline: {
 succeeded in 51ms:
   760	      semanticSummary: {
   761	        task: implSummary.task.substring(0, 100),
   762	        filesCreated: implSummary.filesCreated.length,
   763	        filesModified: implSummary.filesModified.length,
   764	        decisions: implSummary.decisions.length,
   765	        messageStats: implSummary.messageStats
   766	      },
   767	      embedding: {
   768	        status: 'pending',
   769	        model: MODEL_NAME,
   770	        dimensions: EMBEDDING_DIM
   771	      }
   772	    }, null, 2)
   773	  };
   774	
   775	  if (filterStats.qualityScore < 20) {
   776	    const warningHeader = `> **Note:** This session had limited actionable content (quality score: ${filterStats.qualityScore}/100). ${filterStats.noiseFiltered} noise entries and ${filterStats.duplicatesRemoved} duplicates were filtered.\n\n`;
   777	    files[ctxFilename] = warningHeader + files[ctxFilename];
   778	    log(`   Warning: Low quality session (${filterStats.qualityScore}/100) - warning header added`);
   779	  }
 succeeded in 50ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Quality Scorer
     3	// ---------------------------------------------------------------
     4	// Scores the quality of generated memory files based on multiple criteria
     5	
     6	interface FileWithDescription {
     7	  DESCRIPTION?: string;
     8	}
     9	
    10	interface ObservationWithNarrative {
    11	  TITLE?: string;
    12	  NARRATIVE?: string;
    13	}
    14	
    15	interface QualityBreakdown {
    16	  triggerPhrases: number;
    17	  keyTopics: number;
    18	  fileDescriptions: number;
    19	  contentLength: number;
    20	  noLeakedTags: number;
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '1,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/config.ts | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
     1	#!/usr/bin/env node
     2	// ---------------------------------------------------------------
     3	// MODULE: Validate Memory Quality
     4	// ---------------------------------------------------------------
     5	// Post-render quality gate for generated memory files
     6	
     7	import fs from 'fs';
     8	import path from 'path';
     9	
    10	type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9';
    11	
    12	interface RuleResult {
    13	  ruleId: QualityRuleId;
    14	  passed: boolean;
    15	  message: string;
    16	}
    17	
    18	interface ValidationResult {
    19	  valid: boolean;
    20	  failedRules: QualityRuleId[];
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Config
     3	// ---------------------------------------------------------------
     4	// Central configuration loader — reads JSONC config, resolves paths, exports CONFIG object
     5	// ---------------------------------------------------------------
     6	
     7	import * as path from 'path';
     8	import * as fsSync from 'fs';
     9	import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
    10	import { structuredLog } from '../utils/logger';
    11	
    12	/* -----------------------------------------------------------------
    13	   1. INTERFACES
    14	------------------------------------------------------------------*/
    15	
    16	/** Represents workflow config. */
    17	export interface WorkflowConfig {
    18	  maxResultPreview: number;
    19	  maxConversationMessages: number;
    20	  maxToolOutputLines: number;
 succeeded in 52ms:
'use strict';

const path = require('path');
const fs = require('fs');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const validator = require(path.join(DIST_DIR, 'memory', 'validate-memory-quality.js'));
const contamination = require(path.join(DIST_DIR, 'extractors', 'contamination-filter.js'));
const decisionExtractor = require(path.join(DIST_DIR, 'extractors', 'decision-extractor.js'));
const qualityScorer = require(path.join(DIST_DIR, 'extractors', 'quality-scorer.js'));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function runValidatorRuleTests() {
  const validContent = `\
\`\`\`yaml
 succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Content Filter
     3	// ---------------------------------------------------------------
     4	
     5	import crypto from 'crypto';
     6	import fs from 'fs';
     7	import path from 'path';
     8	import { stripJsoncComments } from '@spec-kit/shared/utils/jsonc-strip';
     9	import { structuredLog } from '../utils/logger';
    10	
    11	// ---------------------------------------------------------------
    12	// 1. TYPES
    13	// ---------------------------------------------------------------
    14	
    15	/** Content type classification labels */
    16	export type ContentType = 'noise' | 'empty' | 'duplicate' | 'lowQuality' | 'valid';
    17	
    18	/** Filter pipeline configuration */
    19	export interface FilterConfig {
    20	  pipeline: {
codex
I’ve got the validator and test lane in view now. I’m running a few direct score scenarios next so the audit can speak concretely about “perfect,” “empty,” and edge-session outputs instead of just inferring from source.
exec
/bin/zsh -lc 'node .opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
test-memory-quality-lane: PASS
codex
The bundled quality-lane test passes, which is useful, but it only exercises a narrow set of happy-path and placeholder cases. I’m doing a smaller one-line `node -e` sweep now to capture the actual numeric outputs for edge cases the current tests skip.
exec
/bin/zsh -lc "node -e \"const s=require('./.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js'); const cases=[['empty',{content:''}],['minimal',{content:'# x'}],['perfect',{content:'# good',validatorSignals:['V1','V2','V3','V4','V5','V6','V7','V8','V9'].map(r=>({ruleId:r,passed:true})),messageCount:10,toolCount:3,decisionCount:1}],['oneFailureAllBonuses',{content:'# x',validatorSignals:[{ruleId:'V1',passed:false}],messageCount:10,toolCount:3,decisionCount:1}],['fourFailuresAllBonuses',{content:'# x',validatorSignals:[{ruleId:'V1',passed:false},{ruleId:'V2',passed:false},{ruleId:'V3',passed:false},{ruleId:'V4',passed:false}],messageCount:10,toolCount:3,decisionCount:1}],['allToolNoDecisions',{content:'# x',validatorSignals:['V1','V2','V3','V4','V5','V6','V7','V8','V9'].map(r=>({ruleId:r,passed:true})),messageCount:12,toolCount:9,decisionCount:0}]]; for (const [name,input] of cases){console.log(name, JSON.stringify(s.scoreMemoryQuality(input)));}\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const s=require('./.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js'); const lines=n=>Array.from({length:n},(_,i)=>'line '+(i+1)).join('\\n'); const cases=[['emptyContent',['',[],[],[],[]]],['oneLineNoMetadata',['# x',[],[],[],[]]],['twentyLinesOneTriggerOneTopic',[lines(20),['a'],['topic'],[],[]]],['thresholdPerfect',[lines(100),Array.from({length:8},(_,i)=>'t'+i),Array.from({length:5},(_,i)=>'k'+i),[{DESCRIPTION:'good desc'}],[{TITLE:'one'}]]],['duplicateObservations',[lines(100),Array.from({length:8},(_,i)=>'t'+i),Array.from({length:5},(_,i)=>'k'+i),[{DESCRIPTION:'good desc'}],[{TITLE:'dup'},{TITLE:'dup'},{TITLE:'dup'}]]]]; for (const [name,args] of cases){console.log(name, JSON.stringify(s.scoreMemoryQuality(...args)));}\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
empty {"qualityScore":0,"qualityFlags":["has_placeholders","has_fallback_decision","has_contamination","sparse_semantic_fields"]}
minimal {"qualityScore":1,"qualityFlags":[]}
perfect {"qualityScore":1,"qualityFlags":[]}
oneFailureAllBonuses {"qualityScore":0.9500000000000001,"qualityFlags":["has_placeholders"]}
fourFailuresAllBonuses {"qualityScore":0.2,"qualityFlags":["has_placeholders","has_fallback_decision"]}
allToolNoDecisions {"qualityScore":1,"qualityFlags":[]}
 succeeded in 52ms:
emptyContent {"score":50,"warnings":["No trigger phrases extracted — memory will not surface via trigger matching","No key topics extracted — memory searchability reduced","Very short content (1 lines) — may lack useful context"],"breakdown":{"triggerPhrases":0,"keyTopics":0,"fileDescriptions":20,"contentLength":0,"noLeakedTags":15,"observationDedup":15}}
oneLineNoMetadata {"score":50,"warnings":["No trigger phrases extracted — memory will not surface via trigger matching","No key topics extracted — memory searchability reduced","Very short content (1 lines) — may lack useful context"],"breakdown":{"triggerPhrases":0,"keyTopics":0,"fileDescriptions":20,"contentLength":0,"noLeakedTags":15,"observationDedup":15}}
twentyLinesOneTriggerOneTopic {"score":70,"warnings":[],"breakdown":{"triggerPhrases":10,"keyTopics":5,"fileDescriptions":20,"contentLength":5,"noLeakedTags":15,"observationDedup":15}}
thresholdPerfect {"score":100,"warnings":[],"breakdown":{"triggerPhrases":20,"keyTopics":15,"fileDescriptions":20,"contentLength":15,"noLeakedTags":15,"observationDedup":15}}
duplicateObservations {"score":90,"warnings":["High observation duplication: 2 duplicate titles"],"breakdown":{"triggerPhrases":20,"keyTopics":15,"fileDescriptions":20,"contentLength":15,"noLeakedTags":15,"observationDedup":5}}
exec
/bin/zsh -lc "rg -n \"quality_score|quality_flags|qualityScore|QUALITY_GATE_FAIL|sparse_semantic_fields|has_placeholders|has_fallback_decision\" .opencode/skill/system-spec-kit -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e \"const v=require('./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js'); const s=require('./.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js'); const cases=[['shortValid', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: []\\n"'```'"\\n\\n# Useful title\\n\\nDecision: chose x.'], ['allToolButNoTriggers', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 7\\ntrigger_phrases: []\\n"'```'"\\n\\n# Useful title\\n\\nDecision: chose x.'], ['foreignSpecDominates', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"\\n\\n# Useful title\\n\\nReferences 999-foreign-a 999-foreign-a 999-foreign-a'], ['zeroToolsButFileMention', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"\\n\\n# Useful title\\n\\n### Files Modified\\n"'`app.ts`'"'], ['naButNoTools', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"\\n\\n# Useful title\\n\\nblockers: [N/A]']]; for (const [name,content] of cases){ const val=v.validateMemoryQualityContent(content); const score=s.scoreMemoryQuality({content,validatorSignals:val.ruleResults.map(r=>({ruleId:r.ruleId,passed:r.passed})),messageCount:1,toolCount:(/tool_count: (\\d+)/.exec(content)||[])[1]*1||0,decisionCount:/Decision:/.test(content)?1:0}); console.log(name, JSON.stringify({valid:val.valid,failed:val.failedRules,score})); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:39:    'quality_score: 0.95',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:40:    'quality_flags:',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:48:// 3. Valid frontmatter with quality_score: 0.85 -> 0.85
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:50:  const content = ['---', 'quality_score: 0.85', '---', 'Body text'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:54:// 4. quality_score > 1 -> clamped to 1.0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:56:  const content = ['---', 'quality_score: 1.75', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:60:// 5. quality_score < 0 -> clamped to 0.0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:62:  const content = ['---', 'quality_score: -0.25', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:66:// 6. quality_score: NaN or non-numeric -> 0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:68:  const nanContent = ['---', 'quality_score: NaN', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:69:  const textContent = ['---', 'quality_score: not-a-number', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:75:// 7. quality_score in body text but NOT in frontmatter -> must return 0
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:81:    'quality_score: 0.99',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:87:// 8. Valid quality_flags YAML list -> correct array
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:89:  const content = ['---', 'quality_flags:', '  - concise', '  - relevant', '  - grounded', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:102:    'quality_flags:',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:117:  const content = ['---', 'quality_flags: []', '---'].join('\n');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:126:    'quality_score: 0.42',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:128:    'quality_flags:',
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:142:  const content = ['---', 'quality_score: 0.67', 'quality_flags:', '- windows', '---', 'Body'].join('\r\n');
 succeeded in 68ms:
shortValid {"valid":true,"failed":[],"score":{"qualityScore":1,"qualityFlags":[]}}
allToolButNoTriggers {"valid":true,"failed":[],"score":{"qualityScore":1,"qualityFlags":[]}}
foreignSpecDominates {"valid":false,"failed":["V8"],"score":{"qualityScore":0.8,"qualityFlags":["has_spec_relevance_mismatch"]}}
zeroToolsButFileMention {"valid":false,"failed":["V7"],"score":{"qualityScore":0.8,"qualityFlags":["has_tool_state_mismatch"]}}
naButNoTools {"valid":true,"failed":[],"score":{"qualityScore":1,"qualityFlags":[]}}
codex
I found one subtle point already: the current test lane doesn’t cover the “short but syntactically valid” cases that matter most for calibration. I’m re-running those with shell globbing disabled so we can trust the validator outputs for `[]` and similar YAML edge cases.
exec
/bin/zsh -lc "noglob node -e \"const v=require('./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js'); const cases=[['onlyYaml', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"'], ['titleOnly', '# Just a title'], ['emptyListMultiline', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 7\\ntrigger_phrases:\\n  []\\n"'```'"\\n# T'], ['emptyListInline', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 7\\ntrigger_phrases: []\\n"'```'"\\n# T']]; for (const [name,content] of cases){ const val=v.validateMemoryQualityContent(content); console.log(name, JSON.stringify({valid:val.valid,failed:val.failedRules})); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "noglob node -e \"const v=require('./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js'); const s=require('./.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js'); const cases=[['shortValid', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: []\\n"'```'"\\n\\n# Useful title\\n\\nDecision: chose x.'], ['allToolButNoTriggers', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 7\\ntrigger_phrases: []\\n"'```'"\\n\\n# Useful title\\n\\nDecision: chose x.'], ['foreignSpecDominates', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"\\n\\n# Useful title\\n\\nReferences 999-foreign-a 999-foreign-a 999-foreign-a'], ['zeroToolsButFileMention', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"\\n\\n# Useful title\\n\\n### Files Modified\\n\\"'`app.ts'"\\"'`'"'], ['naButNoTools', '"'```yaml'"\\nspec_folder: \\\"001-test\\\"\\ntool_count: 0\\ntrigger_phrases: [\\\"x\\\"]\\n"'```'"\\n\\n# Useful title\\n\\nblockers: [N/A]']]; for (const [name,content] of cases){ const val=v.validateMemoryQualityContent(content); const tool=Number((/tool_count: (\\\\d+)/.exec(content)||[])[1]||0); const score=s.scoreMemoryQuality({content,validatorSignals:val.ruleResults.map(r=>({ruleId:r.ruleId,passed:r.passed})),messageCount:1,toolCount:tool,decisionCount:/Decision:/.test(content)?1:0}); console.log(name, JSON.stringify({valid:val.valid,failed:val.failedRules,score})); }\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
zsh:1: no matches found: [x]n
zsh:1: no matches found: []n
zsh:1: no matches found: []n
onlyYaml {"valid":true,"failed":[]}
titleOnly {"valid":true,"failed":[]}
emptyListMultiline {"valid":true,"failed":[]}
emptyListInline {"valid":true,"failed":[]}
 succeeded in 51ms:
zsh:1: no matches found: []n
zsh:1: no matches found: []n
zsh:1: no matches found: [x]n
zsh:1: no matches found: [x]n
zsh:1: no matches found: [x]n
shortValid {"valid":true,"failed":[],"score":{"qualityScore":1,"qualityFlags":[]}}
allToolButNoTriggers {"valid":true,"failed":[],"score":{"qualityScore":1,"qualityFlags":[]}}
foreignSpecDominates {"valid":false,"failed":["V8"],"score":{"qualityScore":0.8,"qualityFlags":["has_spec_relevance_mismatch"]}}
zeroToolsButFileMention {"valid":false,"failed":["V7"],"score":{"qualityScore":0.8,"qualityFlags":["has_tool_state_mismatch"]}}
naButNoTools {"valid":true,"failed":[],"score":{"qualityScore":1,"qualityFlags":[]}}
exec
/bin/zsh -lc "node -e 'const s=require(\"./.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js\"); const mk=(fails=[],messageCount=1,toolCount=0,decisionCount=0)=>s.scoreMemoryQuality({content:\"# x\",validatorSignals:[\"V1\",\"V2\",\"V3\",\"V4\",\"V5\",\"V6\",\"V7\",\"V8\",\"V9\"].map(id=>({ruleId:id,passed:"'!fails.includes(id)})),messageCount,toolCount,decisionCount}); console.log("allPassNoBonuses", JSON.stringify(mk([],0,0,0))); console.log("allPassBonuses", JSON.stringify(mk([],1,1,1))); console.log("oneFailBonuses", JSON.stringify(mk(["V8"],1,1,1))); console.log("threeFailsBonuses", JSON.stringify(mk(["V1","V8","V9"],1,1,1))); console.log("fourFailsBonuses", JSON.stringify(mk(["V1","V2","V8","V9"],1,1,1)));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e 'const v=require(\"./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js\"); const samples={emptyListInline:String.raw"'````yaml
spec_folder: "001-test"
tool_count: 7
trigger_phrases: []
```
# T`, emptyListMultiline:String.raw````yaml
spec_folder: "001-test"
tool_count: 7
trigger_phrases:
  []
```
# T`, titleOnly:String.raw`# Just a title`, shortValid:String.raw````yaml
spec_folder: "001-test"
tool_count: 0
trigger_phrases: []
```

# Useful title

Decision: chose x.`}; for (const [name,content] of Object.entries(samples)) { const r=v.validateMemoryQualityContent(content); console.log(name, JSON.stringify({valid:r.valid, failed:r.failedRules})); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
allPassNoBonuses {"qualityScore":1,"qualityFlags":[]}
allPassBonuses {"qualityScore":1,"qualityFlags":[]}
oneFailBonuses {"qualityScore":0.9500000000000001,"qualityFlags":["has_spec_relevance_mismatch"]}
threeFailsBonuses {"qualityScore":0.44999999999999996,"qualityFlags":["has_placeholders","has_spec_relevance_mismatch","has_contaminated_title"]}
fourFailsBonuses {"qualityScore":0.2,"qualityFlags":["has_placeholders","has_spec_relevance_mismatch","has_contaminated_title"]}
 exited 1 in 51ms:
[eval]:1
const v=require("./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js"); const samples={emptyListInline:String.raw````yaml
                                                                                                                                                  ^^^^
Expected ',', got 'ident'

SyntaxError: Unexpected identifier 'yaml'
    at makeContextifyScript (node:internal/vm:194:14)
    at compileScript (node:internal/process/execution:388:10)
    at evalTypeScript (node:internal/process/execution:260:22)
    at node:internal/main/eval_string:71:3

Node.js v25.6.1
codex
The v2 score math is confirmed now: it saturates at `1.0` for any fully rule-passing content, with or without bonuses, and even a single failed rule can still report `0.95`. I’m doing one last clean validator probe for empty-list YAML and title-only content, because those are the cases most likely to create false negatives in production.
exec
/bin/zsh -lc "node -e 'const v=require(\"./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js\"); const make=(lines)=>lines.join(\"\\n\"); const samples={emptyListInline:make([\""'```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 7\",\"trigger_phrases: []\",\""'```","# T"]), emptyListMultiline:make(["```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 7\",\"trigger_phrases:\",\"  []\",\""'```","# T"]), titleOnly:"# Just a title", shortValid:make(["```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 0\",\"trigger_phrases: []\",\""'```","","# Useful title","","Decision: chose x."])}; for (const [name,content] of Object.entries(samples)) { const r=v.validateMemoryQualityContent(content); console.log(name, JSON.stringify({valid:r.valid, failed:r.failedRules})); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e 'const v=require(\"./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js\"); const make=(lines)=>lines.join(\"\\n\"); const content=make([\""'```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 7\",\"trigger_phrases:\",\"  - \\\"x\\\"\",\""'```","# T","### Files Modified","`app.ts`"]); const r=v.validateMemoryQualityContent(content); console.log(JSON.stringify({valid:r.valid, failed:r.failedRules}));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
emptyListInline {"valid":false,"failed":["V5"]}
emptyListMultiline {"valid":false,"failed":["V5"]}
titleOnly {"valid":true,"failed":[]}
shortValid {"valid":true,"failed":[]}
 succeeded in 52ms:
{"valid":true,"failed":[]}
exec
/bin/zsh -lc "node -e 'const v=require(\"./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js\"); const make=(lines)=>lines.join(\"\\n\"); const samples={zeroToolsWithFilesHeading:make([\""'```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 0\",\"trigger_phrases:\",\"  - \\\"x\\\"\",\""'```","# T","### Files Modified","`app.ts`"]), zeroToolsWithKeyFilesBold:make(["```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 0\",\"trigger_phrases:\",\"  - \\\"x\\\"\",\""'```","# T","**Key Files:**","- `app.ts`"]), zeroToolsPlainFilename:make(["```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 0\",\"trigger_phrases:\",\"  - \\\"x\\\"\",\""'```","# T","Updated `app.ts` in design review."])}; for (const [name,content] of Object.entries(samples)) { const r=v.validateMemoryQualityContent(content); console.log(name, JSON.stringify({valid:r.valid, failed:r.failedRules})); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
zeroToolsWithFilesHeading {"valid":false,"failed":["V7"]}
zeroToolsWithKeyFilesBold {"valid":false,"failed":["V7"]}
zeroToolsPlainFilename {"valid":false,"failed":["V7"]}
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Memory Indexer
// ---------------------------------------------------------------
// Handles persisting memory files to the vector index: embedding generation,
// database storage, metadata updates, and DB-change notifications.

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';

import { structuredLog } from '../utils';
import { generateEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
import { vectorIndex } from '@spec-kit/mcp-server/api/search';
import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
import { extractTriggerPhrases } from '../lib/trigger-extractor';
import type { CollectedDataFull } from '../extractors/collect-session-data';
import { extractQualityScore, extractQualityFlags } from '@spec-kit/shared/parsing/quality-extractors';

function notifyDatabaseUpdated(): void {
  try {
exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Quality Extractors
// ---------------------------------------------------------------

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/**
 * Extract the YAML frontmatter block (between --- delimiters).
 * Returns empty string when no frontmatter is found — body text must never
 * be parsed as metadata (T040 acceptance criteria).
 */
function extractFrontmatter(content: string): string {
  const match = content.match(FRONTMATTER_RE);
  return match ? match[1] : '';
}

/**
 * Extract quality score from frontmatter content.
 * Canonical shared implementation — replaces duplicates in memory-indexer.ts and memory-parser.ts.
 */
codex
I found a wiring detail that touches the usefulness question directly: the workflow injects `quality_score` into a fenced YAML block, while the downstream shared parser only reads true frontmatter. I’m checking the template shape now so I can tell whether these computed scores are actually making it into indexed metadata or just into the markdown body.
exec
/bin/zsh -lc 'rg -n "```yaml|spec_folder:|quality_score:|quality_flags:" .opencode/skill/system-spec-kit/templates .opencode/skill/system-spec-kit/scripts/renderers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/templates/context.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"extractQualityScore\\(|extractQualityFlags\\(|FRONTMATTER_RE\" .opencode/skill/system-spec-kit/shared/parsing .opencode/skill/system-spec-kit/scripts/core .opencode/skill/system-spec-kit/mcp_server/lib/parsing" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 50ms:
sed: .opencode/skill/system-spec-kit/templates/context.md: No such file or directory
 exited 1 in 52ms:
zsh:1: unmatched "
 succeeded in 51ms:
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:31:  assertEqual(extractQualityScore(content), 0, 'empty input score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:32:  assertArrayEqual(extractQualityFlags(content), [], 'empty input flags');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:44:  assertEqual(extractQualityScore(content), 0, 'no frontmatter score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:45:  assertArrayEqual(extractQualityFlags(content), [], 'no frontmatter flags');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:51:  assertEqual(extractQualityScore(content), 0.85, 'valid score 0.85');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:57:  assertEqual(extractQualityScore(content), 1, 'score clamp high');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:63:  assertEqual(extractQualityScore(content), 0, 'score clamp low (negative input)');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:71:  assertEqual(extractQualityScore(nanContent), 0, 'score NaN text returns 0');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:72:  assertEqual(extractQualityScore(textContent), 0, 'score non-numeric returns 0');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:84:  assertEqual(extractQualityScore(content), 0, 'score in body only returns 0');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:92:    extractQualityFlags(content),
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:109:    extractQualityFlags(content),
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:118:  assertArrayEqual(extractQualityFlags(content), [], 'empty flags list');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:136:  assertEqual(extractQualityScore(content), 0.42, 'multiline frontmatter score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:137:  assertArrayEqual(extractQualityFlags(content), ['one', 'two'], 'multiline frontmatter flags');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:144:  assertEqual(extractQualityScore(content), 0.67, 'CRLF score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:145:  assertArrayEqual(extractQualityFlags(content), ['windows'], 'CRLF flags');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:151:  assertEqual(extractQualityScore(content), 0.31, 'score with extra whitespace');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:5:const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:13:  const match = content.match(FRONTMATTER_RE);
exec
/bin/zsh -lc "rg --files .opencode/skill/system-spec-kit | rg '/context\\.(md|mdx|mustache|hbs|tmpl|template)"'$|/context/'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/test-fixtures/048-with-memory-placeholders/memory/context.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/011-anchors-duplicate-ids/memory/context.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/007-valid-anchors/memory/context.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/008-invalid-anchors/memory/context.md
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"populateTemplate\\(|context template|templates\" .opencode/skill/system-spec-kit/scripts/renderers .opencode/skill/system-spec-kit/scripts/core" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Template Renderer
// ---------------------------------------------------------------
// Mustache-based template engine — renders memory files from collected session data

// 1. IMPORTS

import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../core';
import { structuredLog } from '../utils/logger';

// ---------------------------------------------------------------
// 2. TYPES
// ---------------------------------------------------------------

/** Template context data: a record of string keys to arbitrary values */
export type TemplateContext = Record<string, unknown>;

/** Template data item that can be an object or primitive */
 succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:159:async function populateTemplate(templateName: string, data: TemplateContext): Promise<string> {
.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts:173:      `Available templates should be in: ${templateDir}`
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:184: * context template rendering.
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:616:  // Step 8: Populate templates
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:705:    [ctxFilename]: await populateTemplate('context', {
.opencode/skill/system-spec-kit/scripts/core/config.ts:228:  TEMPLATE_DIR: path.join(SCRIPTS_DIR, '..', 'templates'),
exec
/bin/zsh -lc "find .opencode/skill/system-spec-kit -path '*templates*' -maxdepth 5 -type f | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/references/templates/level_selection_guide.md
.opencode/skill/system-spec-kit/references/templates/level_specifications.md
.opencode/skill/system-spec-kit/references/templates/template_guide.md
.opencode/skill/system-spec-kit/references/templates/template_style_guide.md
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.js
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.d.ts
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.js.map
.opencode/skill/system-spec-kit/scripts/dist/wrap-all-templates.d.ts.map
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts
.opencode/skill/system-spec-kit/scripts/test-fixtures/051-with-templates/implementation-summary.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/051-with-templates/tasks.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/051-with-templates/plan.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/051-with-templates/templates/template.md
.opencode/skill/system-spec-kit/scripts/test-fixtures/051-with-templates/spec.md
.opencode/skill/system-spec-kit/scripts/templates/README.md
.opencode/skill/system-spec-kit/scripts/templates/compose.sh
.opencode/skill/system-spec-kit/scripts/wrap-all-templates.sh
.opencode/skill/system-spec-kit/templates/sharded/02-requirements.md
.opencode/skill/system-spec-kit/templates/sharded/03-architecture.md
.opencode/skill/system-spec-kit/templates/sharded/04-testing.md
exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/templates/context_template.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
---
title: "{{MEMORY_DASHBOARD_TITLE}}"
description: "Session context memory template for Spec Kit indexing."
trigger_phrases:
  - "memory dashboard"
  - "session summary"
  - "context template"
importance_tier: "{{IMPORTANCE_TIER}}"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Template Configuration Comments (stripped during generation) -->

<!-- Context Type Detection:
  - "research": >50% Read/Grep/Glob tools, minimal Write/Edit
  - "implementation": >30% Write/Edit tools
  - "decision": User choice recorded OR explicit decision recording
  - "discovery": WebSearch/WebFetch used significantly
  - "general": fallback when no clear pattern

exec
/bin/zsh -lc 'rg -n "```yaml|quality_score|quality_flags" .opencode/skill/system-spec-kit/templates/context_template.md' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:
zsh:1: unmatched "
exec
/bin/zsh -lc "rg -n 'quality_score|quality_flags|yaml' .opencode/skill/system-spec-kit/templates/context_template.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
723:```yaml
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/templates/context_template.md | sed -n '710,760p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   710	<!-- /ANCHOR:postflight -->
   711	{{/HAS_POSTFLIGHT_DELTA}}
   712	
   713	---
   714	
   715	<a id="memory-metadata"></a>
   716	
   717	## MEMORY METADATA
   718	
   719	<!-- ANCHOR:metadata -->
   720	
   721	> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.
   722	
   723	```yaml
   724	# Core Identifiers
   725	session_id: "{{SESSION_ID}}"
   726	spec_folder: "{{SPEC_FOLDER}}"
   727	channel: "{{CHANNEL}}"
   728	
   729	# Classification
codex
This is an important distinction: the validator reads the machine-readable YAML block, but the shared quality parser used for indexing reads only top frontmatter. I’m verifying that mismatch with one direct round-trip so the finding can be concrete rather than speculative.
exec
/bin/zsh -lc "node -e 'const {scoreMemoryQuality}=require(\"./.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js\"); const lines=n=>Array.from({length:n},(_,i)=>\"line \"+(i+1)).join(\"\\n\"); const withTags=[\"<summary>\",\"<details>\",\"<div>\",\"<span>\",\"<p>\",\"<br>\",\"<hr>\"].join(\"\\n\"); const inCode=[\""'```html",withTags,"```"].join("'"\\n\"); console.log(\"allKnownTagsOutside\", JSON.stringify(scoreMemoryQuality(withTags,[],[],[],[]))); console.log(\"unknownHtmlOutside\", JSON.stringify(scoreMemoryQuality(\"<section>hi</section>\",[],[],[],[]))); console.log(\"knownTagsInCode\", JSON.stringify(scoreMemoryQuality(inCode,[],[],[],[]))); console.log(\"longNoMetadata\", JSON.stringify(scoreMemoryQuality(lines(100),[],[],[],[])));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e 'const {extractQualityScore,extractQualityFlags}=require(\"./.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts\"); const content=[\"---\",\"title: \\\"x\\\"\",\"---\",\"\",\"# T\",\"\",\""'```yaml","spec_folder: '"\\\"001-test\\\"\",\"quality_score: 0.95\",\"quality_flags:\",\"  - \\\"has_placeholders\\\"\",\""'```"].join("'"\\n\"); console.log(JSON.stringify({score:extractQualityScore(content), flags:extractQualityFlags(content)}));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
allKnownTagsOutside {"score":40,"warnings":["No trigger phrases extracted — memory will not surface via trigger matching","No key topics extracted — memory searchability reduced","Very short content (7 lines) — may lack useful context","7 HTML tags leaked into content — content may have raw HTML"],"breakdown":{"triggerPhrases":0,"keyTopics":0,"fileDescriptions":20,"contentLength":0,"noLeakedTags":5,"observationDedup":15}}
unknownHtmlOutside {"score":50,"warnings":["No trigger phrases extracted — memory will not surface via trigger matching","No key topics extracted — memory searchability reduced","Very short content (1 lines) — may lack useful context"],"breakdown":{"triggerPhrases":0,"keyTopics":0,"fileDescriptions":20,"contentLength":0,"noLeakedTags":15,"observationDedup":15}}
knownTagsInCode {"score":50,"warnings":["No trigger phrases extracted — memory will not surface via trigger matching","No key topics extracted — memory searchability reduced","Very short content (9 lines) — may lack useful context"],"breakdown":{"triggerPhrases":0,"keyTopics":0,"fileDescriptions":20,"contentLength":0,"noLeakedTags":15,"observationDedup":15}}
longNoMetadata {"score":65,"warnings":["No trigger phrases extracted — memory will not surface via trigger matching","No key topics extracted — memory searchability reduced"],"breakdown":{"triggerPhrases":0,"keyTopics":0,"fileDescriptions":20,"contentLength":15,"noLeakedTags":15,"observationDedup":15}}
 succeeded in 51ms:
{"score":0,"flags":[]}
codex
I’ve got enough to see the main pattern: one scorer is over-generous, the other is over-binary, and the workflow wires them inconsistently. I’m pulling a couple more line-numbered snippets around tree-thinning and metadata injection so the final findings can land on exact code paths rather than broad descriptions.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '560,840p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/templates/context_template.md | sed -n '1,40p;717,752p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   560	    }
   561	    return {
   562	      prompt: filtered.cleanedText,
   563	      content: filtered.cleanedText,
   564	      timestamp: m.timestamp
   565	    };
   566	  });
   567	
   568	  // Run content through filter pipeline for quality scoring
   569	  const filterPipeline = createFilterPipeline();
   570	  filterPipeline.filter(allMessages);
   571	  const filterStats: FilterStats = filterPipeline.getStats();
   572	
   573	  log(`   Content quality: ${filterStats.qualityScore}/100 (${filterStats.noiseFiltered} noise, ${filterStats.duplicatesRemoved} duplicates filtered from ${filterStats.totalProcessed} items)`);
   574	  if (filterPipeline.isLowQuality()) {
   575	    warn(`   Warning: Low quality content detected (score: ${filterStats.qualityScore}/100, threshold: ${filterPipeline.config.quality?.warnThreshold || 20})`);
   576	  }
   577	
   578	  const implSummary = generateImplementationSummary(
   579	    allMessages,
 succeeded in 53ms:
     1	---
     2	title: "{{MEMORY_DASHBOARD_TITLE}}"
     3	description: "Session context memory template for Spec Kit indexing."
     4	trigger_phrases:
     5	  - "memory dashboard"
     6	  - "session summary"
     7	  - "context template"
     8	importance_tier: "{{IMPORTANCE_TIER}}"
     9	contextType: "general"
    10	---
    11	<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
    12	<!-- Template Configuration Comments (stripped during generation) -->
    13	
    14	<!-- Context Type Detection:
    15	  - "research": >50% Read/Grep/Glob tools, minimal Write/Edit
    16	  - "implementation": >30% Write/Edit tools
    17	  - "decision": User choice recorded OR explicit decision recording
    18	  - "discovery": WebSearch/WebFetch used significantly
    19	  - "general": fallback when no clear pattern
    20	
 succeeded in 53ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Quality Extractors
     3	// ---------------------------------------------------------------
     4	
     5	const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
     6	
     7	/**
     8	 * Extract the YAML frontmatter block (between --- delimiters).
     9	 * Returns empty string when no frontmatter is found — body text must never
    10	 * be parsed as metadata (T040 acceptance criteria).
    11	 */
    12	function extractFrontmatter(content: string): string {
    13	  const match = content.match(FRONTMATTER_RE);
    14	  return match ? match[1] : '';
    15	}
    16	
    17	/**
    18	 * Extract quality score from frontmatter content.
    19	 * Canonical shared implementation — replaces duplicates in memory-indexer.ts and memory-parser.ts.
    20	 */
exec
/bin/zsh -lc "node -e 'const v=require(\"./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js\"); const make=(lines)=>lines.join(\"\\n\"); const cases={crossSpecValidMaybe:make([\""'```yaml","spec_folder: '"\\\"001-parent/003-child\\\"\",\"tool_count: 2\",\"trigger_phrases:\",\"  - \\\"memory\\\"\",\""'```","# T","Compared 004-other-spec 004-other-spec 004-other-spec while updating 003-child."]), noSpecFolder:make(["```yaml","tool_count: 2","trigger_phrases:","  - '"\\\"memory\\\"\",\""'```","# T"]), discussionOnlyFilename:make(["```yaml","spec_folder: '"\\\"001-test\\\"\",\"tool_count: 0\",\"trigger_phrases:\",\"  - \\\"memory\\\"\",\""'```","# T","Discussed whether `app.ts` should change later."])}; for (const [name,content] of Object.entries(cases)){const r=v.validateMemoryQualityContent(content); console.log(name, JSON.stringify({valid:r.valid, failed:r.failedRules})); }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
crossSpecValidMaybe {"valid":true,"failed":[]}
noSpecFolder {"valid":true,"failed":[]}
discussionOnlyFilename {"valid":false,"failed":["V7"]}
exec
/bin/zsh -lc "node -e 'const v=require(\"./.opencode/skill/system-spec-kit/scripts/dist/memory/validate-memory-quality.js\"); const make=(lines)=>lines.join(\"\\n\"); const content=make([\""'```yaml","spec_folder: '"\\\"001-parent/003-child\\\"\",\"tool_count: 2\",\"trigger_phrases:\",\"  - \\\"memory\\\"\",\""'```","# T","Compared 004-other-spec 004-other-spec 004-other-spec in detail."]); const r=v.validateMemoryQualityContent(content); console.log(JSON.stringify({valid:r.valid, failed:r.failedRules}));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
{"valid":false,"failed":["V8"]}
codex
A couple of sharper issues are surfacing now: v2 doesn’t penalize contamination at all, and one of its validator rules can block perfectly good “discussion-only” memories just for mentioning a filename. I’m running one last tiny probe on the contamination case so the final severity call is grounded.
exec
/bin/zsh -lc "node -e 'const s=require(\"./.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js\"); const base={content:\"# x\",validatorSignals:[\"V1\",\"V2\",\"V3\",\"V4\",\"V5\",\"V6\",\"V7\",\"V8\",\"V9\"].map(id=>({ruleId:id,passed:true})),messageCount:5,toolCount:2,decisionCount:1}; console.log(\"clean\", JSON.stringify(s.scoreMemoryQuality({...base,hadContamination:false}))); console.log(\"contaminated\", JSON.stringify(s.scoreMemoryQuality({...base,hadContamination:true})));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "node -e 'const s=require(\"./.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js\"); const r=s.scoreMemoryQuality(\"# x\", [\"memory\"], [\"quality\"], [{DESCRIPTION:\"ok\"}], [{NARRATIVE:\"same\"},{NARRATIVE:\"same\"}]); console.log(JSON.stringify(r));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
{"score":45,"warnings":["1/1 files missing descriptions","Very short content (1 lines) — may lack useful context"],"breakdown":{"triggerPhrases":10,"keyTopics":5,"fileDescriptions":0,"contentLength":0,"noLeakedTags":15,"observationDedup":15}}
 succeeded in 51ms:
clean {"qualityScore":1,"qualityFlags":[]}
contaminated {"qualityScore":1,"qualityFlags":["has_contamination"]}
exec
/bin/zsh -lc "node -e 'const s=require(\"./.opencode/skill/system-spec-kit/scripts/dist/core/quality-scorer.js\"); const r=s.scoreMemoryQuality(\"# x\", [\"memory\"], [\"quality\"], [{DESCRIPTION:\"meaningful description\"}], [{NARRATIVE:\"same\"},{NARRATIVE:\"same\"}]); console.log(JSON.stringify(r));'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
{"score":65,"warnings":["Very short content (1 lines) — may lack useful context"],"breakdown":{"triggerPhrases":10,"keyTopics":5,"fileDescriptions":20,"contentLength":0,"noLeakedTags":15,"observationDedup":15}}
exec
/bin/zsh -lc "node -e 'const s=require(\"./.opencode/skill/system-spec-kit/scripts/dist/extractors/quality-scorer.js\"); const r=s.scoreMemoryQuality({content:\"# x\",validatorSignals:[\"V1\",\"V2\",\"V3\",\"V4\",\"V5\",\"V6\",\"V7\",\"V8\",\"V9\"].map(id=>({ruleId:id,passed:id"'!=="V3"})),messageCount:1,toolCount:1,decisionCount:1}); console.log(JSON.stringify(r));'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
{"qualityScore":0.9500000000000001,"qualityFlags":[]}
exec
/bin/zsh -lc "rg -n \"stats\\.qualityScore|qualityScore: qualityResult.score|WorkflowResult\" .opencode/skill/system-spec-kit -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:77:export interface WorkflowResult {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:400:async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:944:          qualityScore: qualityResult.score,
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:734:    if (typeof stats.totalProcessed === 'number' && typeof stats.qualityScore === 'number') {
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:735:      pass('T-010h: get_filter_stats returns stats', `Quality: ${stats.qualityScore}`);
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts | sed -n '64,116p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '370,392p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts | sed -n '188,290p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '930,950p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   370	  try {
   371	    return await operation();
   372	  } finally {
   373	    releaseCurrentRun();
   374	  }
   375	}
   376	
   377	function injectQualityMetadata(content: string, qualityScore: number, qualityFlags: string[]): string {
   378	  const yamlBlockMatch = content.match(/```yaml\n([\s\S]*?)\n```/);
   379	  if (!yamlBlockMatch) {
   380	    return content;
   381	  }
   382	
   383	  const yamlBlock = yamlBlockMatch[1];
   384	  const qualityLines = [
   385	    `quality_score: ${qualityScore.toFixed(2)}`,
   386	    'quality_flags:',
   387	    ...(qualityFlags.length > 0 ? qualityFlags.map((flag) => `  - "${flag}"`) : ['  []']),
   388	  ].join('\n');
   389	
 succeeded in 52ms:
    64	  let qualityScore = 1.0;
    65	  const qualityFlags = new Set<QualityFlag>();
    66	
    67	  const failedRules = validatorSignals.filter((signal) => !signal.passed);
    68	  qualityScore -= failedRules.length * PENALTY_PER_FAILED_RULE;
    69	
    70	  for (const failed of failedRules) {
    71	    if (failed.ruleId === 'V1' || failed.ruleId === 'V2') {
    72	      qualityFlags.add('has_placeholders');
    73	    }
    74	    if (failed.ruleId === 'V4') {
    75	      qualityFlags.add('has_fallback_decision');
    76	    }
    77	    if (failed.ruleId === 'V5') {
    78	      qualityFlags.add('sparse_semantic_fields');
    79	    }
    80	    if (failed.ruleId === 'V6') {
    81	      qualityFlags.add('has_placeholders');
    82	    }
    83	    if (failed.ruleId === 'V7') {
 succeeded in 52ms:
   930	
   931	  log();
   932	
   933	      return {
   934	        contextDir,
   935	        specFolder,
   936	        specFolderName,
   937	        contextFilename: ctxFilename,
   938	        writtenFiles,
   939	        memoryId,
   940	        stats: {
   941	          messageCount: conversations.MESSAGES.length,
   942	          decisionCount: decisions.DECISIONS.length,
   943	          diagramCount: diagrams.DIAGRAMS.length,
   944	          qualityScore: qualityResult.score,
   945	          isSimulation
   946	        }
   947	      };
   948	  });
   949	}
 succeeded in 52ms:
   188	function hasExecutionSignals(content: string): boolean {
   189	  return EXECUTION_SIGNAL_PATTERNS.some((pattern) => pattern.test(content));
   190	}
   191	
   192	function validateMemoryQualityContent(content: string): ValidationResult {
   193	  const frontMatter = extractFrontMatter(content);
   194	  const toolCount = parseToolCount(content);
   195	  const specFolder = extractYamlValueFromContent(content, 'spec_folder') || '';
   196	
   197	  const ruleResults: RuleResult[] = [];
   198	
   199	  const v1FailedField = NON_OPTIONAL_FIELDS.find((field) => {
   200	    const pattern = new RegExp(`^${field}:.*\\[TBD\\]`, 'im');
   201	    return pattern.test(content);
   202	  });
   203	  ruleResults.push({
   204	    ruleId: 'V1',
   205	    passed: !v1FailedField,
   206	    message: v1FailedField
   207	      ? `placeholder leakage: field=${v1FailedField}`
codex
### FINDING-01: Legacy scorer gives empty memories a 50/100 baseline
- **File:** [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L91), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L132), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L144)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `scoreMemoryQuality('', [], [], [], [])` returns `50`, because “no files,” “no observations,” and “no leaked tags” all get full credit.
- **Expected Behavior:** Empty or near-empty memories should score near `0`, not start at half credit.
- **Root Cause:** Non-applicable dimensions are awarded full points instead of being removed from the denominator.
- **Suggested Fix:** Add an early return for empty/near-empty content, or normalize only across applicable dimensions instead of giving automatic full credit.
- **Effort:** SMALL (<30 min)

### FINDING-02: Legacy scorer misses common bad content and duplicate observations
- **File:** [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L114), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L135), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L137)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Unknown tags like `<section>` are ignored, and duplicate observations with empty titles get full `15/15` dedup credit.
- **Expected Behavior:** HTML leakage should catch generic markup, and dedup should still work when `TITLE` is missing.
- **Root Cause:** HTML detection only checks a short allowlist of opening tags; dedup uses `TITLE` only and defaults to perfect when all titles are blank.
- **Suggested Fix:** Detect generic HTML tags outside code fences and dedupe on normalized `TITLE || NARRATIVE`.
- **Effort:** SMALL (<30 min)

### FINDING-03: Legacy score is computed from pre-thinned files, not the rendered memory
- **File:** [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L608), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L705), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L835)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** The template renders `effectiveFiles`, but the legacy scorer still evaluates `enhancedFiles`, so it can score rows that were merged away by tree-thinning.
- **Expected Behavior:** Quality should reflect the final rendered artifact.
- **Root Cause:** Workflow data and scoring data diverge after thinning.
- **Suggested Fix:** Pass `effectiveFiles` into the legacy scorer, or better, score only the final rendered markdown.
- **Effort:** SMALL (<30 min)

### FINDING-04: V2 score saturates at 1.0 and double-counts overlapping placeholder failures
- **File:** [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L64), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L68), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L94), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L98)
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Any non-empty memory with all rules passing scores `1.0`; a one-rule failure can still be `0.95`; V1, V2, and V6 all hit the same `has_placeholders` class but each subtracts `0.25`.
- **Expected Behavior:** The score should separate “barely valid” from “excellent,” and overlapping placeholder defects should not be triple-counted.
- **Root Cause:** The model starts at `1.0`, uses flat penalties, tiny bonuses, and clamps at `1.0`, so it loses almost all ranking resolution.
- **Suggested Fix:** Use weighted per-rule severities, cap placeholder-family penalties, and add real positive quality signals instead of presence bonuses.
- **Effort:** MEDIUM (<2 hr)

### FINDING-05: QUALITY_GATE_FAIL ignores the numeric score and is not configurable from core config
- **File:** [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L816), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L831), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L891), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L289), [config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts#L17), [config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts#L193)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Indexing is skipped whenever any validator rule fails, even if v2 still reports `0.95` or `0.80`; `core/config.ts` has no quality gate fields at all.
- **Expected Behavior:** Gate policy should be explicit, severity-aware, and centrally configurable.
- **Root Cause:** The workflow gates on boolean validity, not on a calibrated score or blocked-rule list.
- **Suggested Fix:** Add config for `minScore`, `blockedRules`, and `warnScore`, then gate on rule severity plus score instead of `failedRules.length === 0`.
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: V7 falsely blocks discussion-only memories that mention filenames
- **File:** [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L42), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L188), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L251)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** With `tool_count: 0`, content like `Discussed whether \`app.ts\` should change later.` fails V7.
- **Expected Behavior:** Plain file discussion should not be treated as evidence of tool execution.
- **Root Cause:** `EXECUTION_SIGNAL_PATTERNS` treats any backticked file path as an execution artifact.
- **Suggested Fix:** Require stronger combinations such as tool transcript markers, execution tables, or action headings before failing V7.
- **Effort:** SMALL (<30 min)

### FINDING-07: V3 under-validates missing spec metadata and hides its own failures
- **File:** [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L195), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L220), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L70)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** A memory with no `spec_folder` passes V3, and a V3-only failure reduces score to `0.95` while emitting no `qualityFlags`.
- **Expected Behavior:** Missing or malformed `spec_folder` should be explicit and diagnosable.
- **Root Cause:** V3 only looks for markdown contamination in the extracted value, and the v2 scorer has no dedicated flag mapping for V3.
- **Suggested Fix:** Fail V3 on missing/empty `spec_folder` and add a flag such as `has_invalid_spec_folder`.
- **Effort:** SMALL (<30 min)

### FINDING-08: V8 can reject legitimate cross-spec work
- **File:** [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L258), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L269)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** A memory for `003-child` fails V8 if another spec is mentioned 3 times and the current spec is not repeated enough, even when the current `spec_folder` is correct.
- **Expected Behavior:** Cross-spec comparisons, parent/child work, and migrations should not hard-fail solely on mention counts.
- **Root Cause:** V8 uses raw spec-id frequency as a proxy for relevance, with no notion of related specs or comparison sections.
- **Suggested Fix:** Downgrade V8 to a warning unless title/task/file-change signals also point away from the current spec, or exempt known related-spec patterns.
- **Effort:** MEDIUM (<2 hr)

### FINDING-09: Computed quality metadata is written where the indexer never reads it
- **File:** [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L377), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L829), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L944), [context_template.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md#L1), [context_template.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md#L723), [quality-extractors.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts#L21), [quality-extractors.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts#L34)
- **Severity:** CRITICAL
- **Category:** BUG
- **Current Behavior:** Workflow injects `quality_score` and `quality_flags` into the machine-readable fenced YAML block, but the shared parser used by indexing reads only top frontmatter, so the indexed quality metadata resolves to `0` / `[]`. The workflow also returns the legacy `0-100` score in `stats.qualityScore`, so the two scorers can contradict on the same memory.
- **Expected Behavior:** One consistent quality signal should be embedded, indexed, and returned on one documented scale.
- **Root Cause:** Writer and reader disagree about where quality metadata lives, and workflow exposes the other scorer’s units.
- **Suggested Fix:** Either move injected quality metadata into frontmatter or teach the shared parser to read the machine-readable YAML block first; then return the same normalized score from workflow stats.
- **Effort:** MEDIUM (<2 hr)

### SUMMARY
- Total findings: 9
- Critical: 1, High: 4, Medium: 4, Low: 0
- Top 3 recommendations: Fix the metadata wiring so indexed memories actually carry the computed quality score; replace the v2 all-or-nothing gate with configurable severity/score policy; recalibrate the legacy scorer so empty/minimal memories cannot start at 50/100.
tokens used
212,590
### FINDING-01: Legacy scorer gives empty memories a 50/100 baseline
- **File:** [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L91), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L132), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L144)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `scoreMemoryQuality('', [], [], [], [])` returns `50`, because “no files,” “no observations,” and “no leaked tags” all get full credit.
- **Expected Behavior:** Empty or near-empty memories should score near `0`, not start at half credit.
- **Root Cause:** Non-applicable dimensions are awarded full points instead of being removed from the denominator.
- **Suggested Fix:** Add an early return for empty/near-empty content, or normalize only across applicable dimensions instead of giving automatic full credit.
- **Effort:** SMALL (<30 min)

### FINDING-02: Legacy scorer misses common bad content and duplicate observations
- **File:** [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L114), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L135), [core/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts#L137)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Unknown tags like `<section>` are ignored, and duplicate observations with empty titles get full `15/15` dedup credit.
- **Expected Behavior:** HTML leakage should catch generic markup, and dedup should still work when `TITLE` is missing.
- **Root Cause:** HTML detection only checks a short allowlist of opening tags; dedup uses `TITLE` only and defaults to perfect when all titles are blank.
- **Suggested Fix:** Detect generic HTML tags outside code fences and dedupe on normalized `TITLE || NARRATIVE`.
- **Effort:** SMALL (<30 min)

### FINDING-03: Legacy score is computed from pre-thinned files, not the rendered memory
- **File:** [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L608), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L705), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L835)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** The template renders `effectiveFiles`, but the legacy scorer still evaluates `enhancedFiles`, so it can score rows that were merged away by tree-thinning.
- **Expected Behavior:** Quality should reflect the final rendered artifact.
- **Root Cause:** Workflow data and scoring data diverge after thinning.
- **Suggested Fix:** Pass `effectiveFiles` into the legacy scorer, or better, score only the final rendered markdown.
- **Effort:** SMALL (<30 min)

### FINDING-04: V2 score saturates at 1.0 and double-counts overlapping placeholder failures
- **File:** [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L64), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L68), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L94), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L98)
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Any non-empty memory with all rules passing scores `1.0`; a one-rule failure can still be `0.95`; V1, V2, and V6 all hit the same `has_placeholders` class but each subtracts `0.25`.
- **Expected Behavior:** The score should separate “barely valid” from “excellent,” and overlapping placeholder defects should not be triple-counted.
- **Root Cause:** The model starts at `1.0`, uses flat penalties, tiny bonuses, and clamps at `1.0`, so it loses almost all ranking resolution.
- **Suggested Fix:** Use weighted per-rule severities, cap placeholder-family penalties, and add real positive quality signals instead of presence bonuses.
- **Effort:** MEDIUM (<2 hr)

### FINDING-05: QUALITY_GATE_FAIL ignores the numeric score and is not configurable from core config
- **File:** [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L816), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L831), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L891), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L289), [config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts#L17), [config.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/config.ts#L193)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Indexing is skipped whenever any validator rule fails, even if v2 still reports `0.95` or `0.80`; `core/config.ts` has no quality gate fields at all.
- **Expected Behavior:** Gate policy should be explicit, severity-aware, and centrally configurable.
- **Root Cause:** The workflow gates on boolean validity, not on a calibrated score or blocked-rule list.
- **Suggested Fix:** Add config for `minScore`, `blockedRules`, and `warnScore`, then gate on rule severity plus score instead of `failedRules.length === 0`.
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: V7 falsely blocks discussion-only memories that mention filenames
- **File:** [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L42), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L188), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L251)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** With `tool_count: 0`, content like `Discussed whether \`app.ts\` should change later.` fails V7.
- **Expected Behavior:** Plain file discussion should not be treated as evidence of tool execution.
- **Root Cause:** `EXECUTION_SIGNAL_PATTERNS` treats any backticked file path as an execution artifact.
- **Suggested Fix:** Require stronger combinations such as tool transcript markers, execution tables, or action headings before failing V7.
- **Effort:** SMALL (<30 min)

### FINDING-07: V3 under-validates missing spec metadata and hides its own failures
- **File:** [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L195), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L220), [extractors/quality-scorer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts#L70)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** A memory with no `spec_folder` passes V3, and a V3-only failure reduces score to `0.95` while emitting no `qualityFlags`.
- **Expected Behavior:** Missing or malformed `spec_folder` should be explicit and diagnosable.
- **Root Cause:** V3 only looks for markdown contamination in the extracted value, and the v2 scorer has no dedicated flag mapping for V3.
- **Suggested Fix:** Fail V3 on missing/empty `spec_folder` and add a flag such as `has_invalid_spec_folder`.
- **Effort:** SMALL (<30 min)

### FINDING-08: V8 can reject legitimate cross-spec work
- **File:** [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L258), [validate-memory-quality.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts#L269)
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** A memory for `003-child` fails V8 if another spec is mentioned 3 times and the current spec is not repeated enough, even when the current `spec_folder` is correct.
- **Expected Behavior:** Cross-spec comparisons, parent/child work, and migrations should not hard-fail solely on mention counts.
- **Root Cause:** V8 uses raw spec-id frequency as a proxy for relevance, with no notion of related specs or comparison sections.
- **Suggested Fix:** Downgrade V8 to a warning unless title/task/file-change signals also point away from the current spec, or exempt known related-spec patterns.
- **Effort:** MEDIUM (<2 hr)

### FINDING-09: Computed quality metadata is written where the indexer never reads it
- **File:** [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L377), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L829), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L944), [context_template.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md#L1), [context_template.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/templates/context_template.md#L723), [quality-extractors.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts#L21), [quality-extractors.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts#L34)
- **Severity:** CRITICAL
- **Category:** BUG
- **Current Behavior:** Workflow injects `quality_score` and `quality_flags` into the machine-readable fenced YAML block, but the shared parser used by indexing reads only top frontmatter, so the indexed quality metadata resolves to `0` / `[]`. The workflow also returns the legacy `0-100` score in `stats.qualityScore`, so the two scorers can contradict on the same memory.
- **Expected Behavior:** One consistent quality signal should be embedded, indexed, and returned on one documented scale.
- **Root Cause:** Writer and reader disagree about where quality metadata lives, and workflow exposes the other scorer’s units.
- **Suggested Fix:** Either move injected quality metadata into frontmatter or teach the shared parser to read the machine-readable YAML block first; then return the same normalized score from workflow stats.
- **Effort:** MEDIUM (<2 hr)

### SUMMARY
- Total findings: 9
- Critical: 1, High: 4, Medium: 4, Low: 0
- Top 3 recommendations: Fix the metadata wiring so indexed memories actually carry the computed quality score; replace the v2 all-or-nothing gate with configurable severity/score policy; recalibrate the legacy scorer so empty/minimal memories cannot start at 50/100.
<!-- /ANCHOR:metadata -->
