OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccec9-ca3e-7b01-81cb-d5a639017ecb
--------
user
You are a code auditor. Read EVERY LINE of /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts (146 lines).

This is the v1 (legacy) quality scorer with 6-dimension scoring.

Audit specifically:
1. SIX DIMENSIONS: What are the 6 scoring dimensions? Are they meaningful and non-redundant?
2. THRESHOLD CALIBRATION: What thresholds trigger warnings/failures? Are they well-calibrated?
3. SCORING MATH: Is the scoring formula mathematically sound? Weights balanced?
4. EDGE CASES: What scores does it give for: empty session, perfect session, tool-only session?
5. WARNING TRIGGERS: What conditions trigger warnings? Are they actionable?
6. INTERACTION WITH V2: Does this scorer conflict with the v2 scorer? Are both needed?

Report every issue, no matter how small. 

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
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m going to inspect the legacy scorer line by line first, then trace where v2 is used so we can assess conflicts and whether both should exist. I’ll start by dumping the full file with line numbers and then map each audit point to concrete findings.
exec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts' && nl -ba '.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/scripts' | rg 'quality|scorer|v2'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh
.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
.opencode/skill/system-spec-kit/scripts/evals/deleted-chk210-quality-backfill-script
.opencode/skill/system-spec-kit/scripts/evals/run-quality-legacy-remediation.ts
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js
 succeeded in 51ms:
     146 .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
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
codex
I confirmed the file is exactly 146 lines and read it fully. Next I’ll inspect the v2 scorer and its call sites to compare formulas, thresholds, and whether legacy/v2 overlap or conflict.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
 succeeded in 52ms:
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
exec
/bin/zsh -lc "rg -n \"core/quality-scorer|scoreMemoryQuality\\(|qualityScore|breakdown|warnings\" '.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:48:  const warnings: string[] = [];
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:52:      warnings.push(`Unclosed anchor: ${anchor} (missing <!-- /ANCHOR:${anchor} -->)`);
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:58:      warnings.push(`Orphaned closing anchor: ${anchor} (no matching opening tag)`);
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:62:  return warnings;
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:68:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:27:  warnings: string[];
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:28:  breakdown: QualityBreakdown;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:47: * Score 0-100, with breakdown per criterion.
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:49:export function scoreMemoryQuality(
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:56:  const warnings: string[] = [];
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:57:  const breakdown: QualityBreakdown = {
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:68:    breakdown.triggerPhrases = 20;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:70:    breakdown.triggerPhrases = 15;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:72:    breakdown.triggerPhrases = 10;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:74:    warnings.push('No trigger phrases extracted — memory will not surface via trigger matching');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:79:    breakdown.keyTopics = 15;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:81:    breakdown.keyTopics = 10;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:83:    breakdown.keyTopics = 5;
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:85:    warnings.push('No key topics extracted — memory searchability reduced');
.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:92:    breakdown.fileDescriptions = 20; // No files = not applicable, full score
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '1,120p;350,430p;790,860p;900,960p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Workflow
     3	// ---------------------------------------------------------------
     4	// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
     5	// ---------------------------------------------------------------
     6	
     7	// Node stdlib
     8	import * as path from 'path';
     9	import * as fsSync from 'fs';
    10	
    11	// Internal modules
    12	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
    13	import {
    14	  extractConversations,
    15	  extractDecisions,
    16	  extractDiagrams,
    17	  extractPhasesFromData,
    18	  enhanceFilesWithSemanticDescriptions,
    19	} from '../extractors';
    20	import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts' | sed -n '1,170p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Indexer
     3	// ---------------------------------------------------------------
     4	// Handles persisting memory files to the vector index: embedding generation,
     5	// database storage, metadata updates, and DB-change notifications.
     6	
     7	import * as fs from 'fs/promises';
     8	import * as fsSync from 'fs';
     9	import * as path from 'path';
    10	
    11	import { structuredLog } from '../utils';
    12	import { generateEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
    13	import { vectorIndex } from '@spec-kit/mcp-server/api/search';
    14	import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
    15	import { extractTriggerPhrases } from '../lib/trigger-extractor';
    16	import type { CollectedDataFull } from '../extractors/collect-session-data';
    17	import { extractQualityScore, extractQualityFlags } from '@spec-kit/shared/parsing/quality-extractors';
    18	
    19	function notifyDatabaseUpdated(): void {
    20	  try {
exec
/bin/zsh -lc "rg -n \"function extractQualityScore|extractQualityScore\\(\" -S" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 89ms:
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:31:  assertEqual(extractQualityScore(content), 0, 'empty input score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:44:  assertEqual(extractQualityScore(content), 0, 'no frontmatter score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:51:  assertEqual(extractQualityScore(content), 0.85, 'valid score 0.85');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:57:  assertEqual(extractQualityScore(content), 1, 'score clamp high');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:63:  assertEqual(extractQualityScore(content), 0, 'score clamp low (negative input)');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:71:  assertEqual(extractQualityScore(nanContent), 0, 'score NaN text returns 0');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:72:  assertEqual(extractQualityScore(textContent), 0, 'score non-numeric returns 0');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:84:  assertEqual(extractQualityScore(content), 0, 'score in body only returns 0');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:136:  assertEqual(extractQualityScore(content), 0.42, 'multiline frontmatter score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:144:  assertEqual(extractQualityScore(content), 0.67, 'CRLF score');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:151:  assertEqual(extractQualityScore(content), 0.31, 'score with extra whitespace');
.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts:21:export function extractQualityScore(content: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:178:  const qualityScore = extractQualityScore(content);
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:96:  const qualityScore = extractQualityScore(content);
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C15.md:649:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:44:  assertEqual(extractQualityScore(content), 0, 'no frontmatter score');
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/011-feature-catalog/scratch/verification-C15.md:654:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:136:  assertEqual(extractQualityScore(content), 0.42, 'multiline frontmatter score');
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-perfect-session-capturing/scratch/audit-C15.md:303:/bin/zsh -lc "rg -n \"function extractQualityScore|extractQualityScore\\(|quality_score\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' | head -n 80" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-perfect-session-capturing/scratch/audit-C08.md:249:/bin/zsh -lc "rg -n \"function extractQualityScore|extractQualityFlags|quality_score\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' | head -n 40" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-perfect-session-capturing/scratch/audit-C08.md:272:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:178:  const qualityScore = extractQualityScore(content);
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/012-perfect-session-capturing/scratch/audit-C08.md:274:/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.test.ts:31:  assertEqual(extractQualityScore(content), 0, 'empty input score');
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
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
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit' | rg 'dist/.*/quality-scorer\\.js|quality-scorer\\.js"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 52ms:

exec
/bin/zsh -lc "rg -n \"stats\\.qualityScore|qualityScore:\\s*qualityResult\\.score|runWorkflow\\(|Memory quality score\" '.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:460:    await runWorkflow({
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:400:async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:495:        '  - If calling runWorkflow() directly, pass { collectSessionDataFn: yourFunction } in options\n' +
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:835:  log(`   Memory quality score: ${qualityResult.score}/100 (legacy), ${qualityV2.qualityScore.toFixed(2)} (v2)`);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:937:          qualityScore: qualityResult.score,
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:184:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:240:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:302:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:566:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:617:    const fileBackedResult = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:623:    const statelessResult = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:676:    const firstRunPromise = runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:693:    const secondRunPromise = runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:759:      const result = await runWorkflow({
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:734:    if (typeof stats.totalProcessed === 'number' && typeof stats.qualityScore === 'number') {
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:735:      pass('T-010h: get_filter_stats returns stats', `Quality: ${stats.qualityScore}`);
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts' | sed -n '160,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   160	      workflowHarness.contextDir = contextDir;
   161	      CONFIG.TEMPLATE_DIR = templatesDir;
   162	
   163	      const collectedData = {
   164	        _source: 'opencode-capture',
   165	        userPrompts: [
   166	          {
   167	            prompt: 'Development session',
   168	            timestamp: '2026-03-06T09:25:00Z',
   169	          },
   170	        ],
   171	        observations: [
   172	          {
   173	            timestamp: '2026-03-06T09:25:30Z',
   174	            narrative: 'Verified rendered memory titles stay specific after template changes.',
   175	            facts: [
   176	              'Tool: Read File: scripts/core/workflow.ts Result: inspected naming pipeline',
   177	            ],
   178	            files: ['scripts/core/workflow.ts'],
   179	          },
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | sed -n '420,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
   420	      const candidate = path.join(specsDir, ...segments);
   421	      if (fsSync.existsSync(candidate)) {
   422	        return candidate;
   423	      }
   424	    }
   425	  }
   426	
   427	  return null;
   428	}
   429	
   430	function rejectExplicitPhaseFolderTarget(): void {
   431	  if (!CONFIG.SPEC_FOLDER_ARG) {
   432	    return;
   433	  }
   434	
   435	  const resolvedPath = resolveExplicitCliSpecFolderPath(CONFIG.SPEC_FOLDER_ARG);
   436	  if (!resolvedPath) {
   437	    return;
   438	  }
   439	
codex
I now have the v2 scorer and workflow integration loaded. I’ll do a precise edge-case walkthrough (empty/perfect/tool-only) from the v1 math and then package findings in your required template with line-specific evidence.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js' | sed -n '90,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
    90	
    91	  assert(result.DECISION_COUNT >= 4, 'decision lexical cues should produce concrete decisions');
    92	
    93	  const noDecision = await decisionExtractor.extractDecisions({
    94	    SPEC_FOLDER: '02--system-spec-kit/020-mcp-working-memory-hybrid-rag',
    95	    observations: [{ narrative: 'Updated tests and cleaned output format.' }],
    96	    userPrompts: [{ prompt: 'Run validation and collect logs.' }],
    97	  });
    98	
    99	  assert(noDecision.DECISION_COUNT === 0, 'no lexical cues should keep decision count at 0');
   100	}
   101	
   102	function runQualityScorerTests() {
   103	  const allBad = qualityScorer.scoreMemoryQuality({
   104	    content: 'x',
   105	    validatorSignals: [
   106	      { ruleId: 'V1', passed: false },
   107	      { ruleId: 'V2', passed: false },
   108	      { ruleId: 'V3', passed: false },
   109	      { ruleId: 'V4', passed: false },
exec
/bin/zsh -lc "rg -n \"core/quality-scorer|scoreMemoryQuality\\(\" '.opencode/skill/system-spec-kit/scripts/tests'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:103:  const allBad = qualityScorer.scoreMemoryQuality({
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:119:  const allGood = qualityScorer.scoreMemoryQuality({
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:135:  const mixed = qualityScorer.scoreMemoryQuality({
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:151:  const empty = qualityScorer.scoreMemoryQuality({ content: '' });
.opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js:154:  const bonusClamp = qualityScorer.scoreMemoryQuality({
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:112:vi.mock('../core/quality-scorer', () => ({
exec
/bin/zsh -lc "rg -n \"\\.{2}/core/quality-scorer|from './quality-scorer'\" '.opencode/skill/system-spec-kit/scripts/tests' '.opencode/skill/system-spec-kit/scripts/core'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:22:import { scoreMemoryQuality } from './quality-scorer';
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:112:vi.mock('../core/quality-scorer', () => ({
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts' | sed -n '90,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    90	
    91	vi.mock('../loaders/data-loader', () => ({
    92	  loadCollectedData: vi.fn(async (options?: { dataFile?: string | null; specFolderArg?: string | null }) => {
    93	    workflowHarness.loaderSnapshots.push({
    94	      dataFile: options?.dataFile ?? null,
    95	      specFolderArg: options?.specFolderArg ?? null,
    96	    });
    97	
    98	    if (options?.dataFile) {
    99	      return workflowHarness.loaderDataWithFile ?? {
   100	        _source: 'file',
   101	        userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:00:00Z' }],
   102	      };
   103	    }
   104	
   105	    return workflowHarness.loaderDataWithoutFile ?? {
   106	      _source: 'opencode-capture',
   107	      userPrompts: [{ prompt: 'Development session', timestamp: '2026-03-06T09:01:00Z' }],
   108	    };
   109	  }),
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/evals/deleted-chk210-quality-backfill-script' | sed -n '1,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Run CHK-210 Quality Backfill
     3	// ---------------------------------------------------------------
     4	// SCRIPT: CHK-210 Quality Metadata Backfill
     5	
     6	const fs = require('fs');
     7	const { execFileSync } = require('child_process');
     8	const { parseMemoryFile } = require('@spec-kit/mcp-server/lib/parsing/memory-parser');
     9	const { validateMemoryQualityContent } = require('../memory/validate-memory-quality.ts');
    10	const { scoreMemoryQuality } = require('../extractors/quality-scorer.ts');
    11	
    12	type DbRow = { id: number; file_path: string };
    13	type QualityScoreResult = { qualityScore: number; qualityFlags: string[] };
    14	
    15	function parseArgs() {
    16	  const [, , specFolderPrefix, dbPath] = process.argv;
    17	  if (!specFolderPrefix || !dbPath) {
    18	    throw new Error('Usage: npx tsx scripts/evals/deleted-chk210-quality-backfill-script <spec-folder-prefix> <sqlite-db-path>');
    19	  }
    20	  return { specFolderPrefix, dbPath };
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/renderers/template-renderer.ts' | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Template Renderer
     3	// ---------------------------------------------------------------
     4	// Mustache-based template engine — renders memory files from collected session data
     5	
     6	// 1. IMPORTS
     7	
     8	import fs from 'fs/promises';
     9	import path from 'path';
    10	import { CONFIG } from '../core';
    11	import { structuredLog } from '../utils/logger';
    12	
    13	// ---------------------------------------------------------------
    14	// 2. TYPES
    15	// ---------------------------------------------------------------
    16	
    17	/** Template context data: a record of string keys to arbitrary values */
    18	export type TemplateContext = Record<string, unknown>;
    19	
    20	/** Template data item that can be an object or primitive */
codex
### FINDING-01: Empty Session Scores 50/100 (Inflated Baseline)
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:91,92,93,102,132,133,144
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** An empty session (`content=''`, all arrays empty) scores **50/100** (`fileDescriptions=20`, `noLeakedTags=15`, `observationDedup=15`) with only warnings.
- **Expected Behavior:** Empty sessions should score near 0 and/or fail quality gating.
- **Root Cause:** Non-applicable dimensions are granted full points.
- **Suggested Fix:** Add a hard guard: if semantic signal is empty (no triggers, topics, observations, meaningful content), return score 0. Or normalize by applicable dimensions only.
- **Effort:** SMALL (<30 min)

### FINDING-02: Non-Applicable Dimensions Award Full Credit
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:91,92,93,132,133
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** `files.length===0` gives 20/20 and `observations.length===0` gives 15/15.
- **Expected Behavior:** N/A metrics should be excluded from denominator or scored neutral, not max.
- **Root Cause:** N/A is treated as success.
- **Suggested Fix:** Track `applicableWeight`; compute `score = earned/applicableWeight * 100`.
- **Effort:** MEDIUM (<2 hr)

### FINDING-03: Tool-Only Sessions Are Mis-Scored (No Tool Signal in v1)
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:49,50,51,52,53,54,55
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** v1 does not ingest tool/message/decision counts; a tool-heavy but semantically sparse session can still land around ~50-55.
- **Expected Behavior:** Tool-only sessions should be evaluated with execution/context signals or penalized for missing semantic extraction.
- **Root Cause:** Input model is incomplete versus modern session characteristics.
- **Suggested Fix:** Extend inputs with `messageCount/toolCount/decisionCount` (like v2) and rebalance score.
- **Effort:** MEDIUM (<2 hr)

### FINDING-04: Trigger Phrases and Key Topics Double-Count Similar Signal
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:66,67,68,69,70,71,72,77,78,79,80,81,82,83
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Two dimensions independently score lexical extraction coverage.
- **Expected Behavior:** Dimensions should be orthogonal or explicitly weighted to avoid redundancy.
- **Root Cause:** Overlapping metrics both reward similar semantic density.
- **Suggested Fix:** Merge into one “semantic coverage” dimension or reduce one weight significantly.
- **Effort:** SMALL (<30 min)

### FINDING-05: No Fail Threshold / Status Output in Legacy Scorer
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:56,74,85,110,124,127,140,145
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Only warnings are emitted; function never returns pass/warn/fail classification.
- **Expected Behavior:** Explicit thresholds for warn/fail should be part of the scorer contract.
- **Root Cause:** Scoring and policy are not connected.
- **Suggested Fix:** Add `status: 'pass'|'warn'|'fail'` using constants (e.g., `<40 fail`, `<70 warn`) and expose in return type.
- **Effort:** SMALL (<30 min)

### FINDING-06: Content Length Metric Is Line-Count Based and Easily Gamed
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:101,102,103,105,107,110
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Score is based on raw `split('\n').length`, including blank lines.
- **Expected Behavior:** Measure meaningful content, not newline quantity.
- **Root Cause:** Simplistic heuristic.
- **Suggested Fix:** Use non-empty line count and/or token count; optionally require section presence.
- **Effort:** SMALL (<30 min)

### FINDING-07: HTML Leak Detection Misses Most Tag Types
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:114
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Only checks opening `<summary|details|div|span|p|br|hr>` tags.
- **Expected Behavior:** Detect broader leaked HTML (including closing tags and other elements).
- **Root Cause:** Narrow regex allowlist.
- **Suggested Fix:** Broaden detection (`</?[a-z][\w-]*\b[^>]*>`) then suppress known-safe contexts.
- **Effort:** SMALL (<30 min)

### FINDING-08: Code-Block Exclusion Is Incomplete
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:116,117,118,119
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Excludes tags only inside triple-backtick fences; misses `~~~` and indented code blocks.
- **Expected Behavior:** Robust markdown-aware exclusion.
- **Root Cause:** Regex-only parsing.
- **Suggested Fix:** Use markdown parser AST or expand fence handling to additional code block forms.
- **Effort:** MEDIUM (<2 hr)

### FINDING-09: Observation Dedup Gives Perfect Score When Titles Are Missing
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:135,137,138
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** If observations exist but all `TITLE` are empty, `dedupRatio` becomes 1 and score is 15/15.
- **Expected Behavior:** Missing dedup key should reduce confidence, not award full score.
- **Root Cause:** Fallback logic treats “no titles” as perfect uniqueness.
- **Suggested Fix:** If `observations.length>0 && titles.length===0`, assign low/partial score and warning; fallback to narrative hashing.
- **Effort:** SMALL (<30 min)

### FINDING-10: Dedup Comparison Lacks Normalization (Case/Whitespace)
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:135,136
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `"Fix bug"`, `"fix bug"`, `"Fix bug "` are treated as distinct titles.
- **Expected Behavior:** Trivial variants should deduplicate.
- **Root Cause:** No canonicalization before `Set`.
- **Suggested Fix:** Normalize with `trim().toLowerCase()` before uniqueness check.
- **Effort:** TRIVIAL (<5 min)

### FINDING-11: Warning Triggers Are Coarse and Weakly Actionable
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:74,85,97,110,124,127,140
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Warnings fire mostly at extreme states and lack concrete remediation targets.
- **Expected Behavior:** Warnings should tell operators exactly what to change and target thresholds.
- **Root Cause:** Minimal-message warning design.
- **Suggested Fix:** Include thresholds in messages (e.g., “need >=4 trigger phrases”), include offending items where possible.
- **Effort:** SMALL (<30 min)

### FINDING-12: V1/V2 Coexistence Creates Conflicting Quality Sources
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:22,33,822,835,937; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:64,110,113
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Workflow computes both scores; v2 (0..1) is stored in metadata, v1 (0..100) is returned in workflow stats and logged side-by-side.
- **Expected Behavior:** Single canonical score or clearly separated contracts.
- **Root Cause:** Transitional dual-scoring without strict ownership boundaries.
- **Suggested Fix:** Deprecate v1 for production scoring, keep only diagnostic breakdown if needed; return both fields with explicit names if both must remain.
- **Effort:** MEDIUM (<2 hr)

### FINDING-13: Test Mocks Show Unit Ambiguity Between Scorers
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:127,128,129
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** v2 scorer is mocked as `{ qualityScore: 100 }`, while implementation clamps to `0..1`.
- **Expected Behavior:** Tests should enforce actual unit contract to catch integration bugs.
- **Root Cause:** Unclear quality score unit semantics in test layer.
- **Suggested Fix:** Change v2 mocks to `0..1`, add contract test asserting unit range.
- **Effort:** TRIVIAL (<5 min)

### FINDING-14: Description Quality Heuristic Is Brittle and Partly Redundant
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:36,37,41
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Any description containing `description pending` is rejected; second check is redundant because first already covers it.
- **Expected Behavior:** Placeholder detection should be precise and avoid false rejects.
- **Root Cause:** Substring heuristic and duplicated condition.
- **Suggested Fix:** Replace with anchored placeholder regex list; remove redundant `includes('(description pending)')`.
- **Effort:** TRIVIAL (<5 min)

### SUMMARY
- Total findings: 14
- Critical: 0, High: 4, Medium: 5, Low: 5
- Top 3 recommendations: 
1. Replace N/A full-credit scoring with applicability-normalized scoring (fixes empty/tool-only inflation).
2. Make one canonical scorer (prefer v2), or strictly separate v1 as diagnostics with explicit units.
3. Fix observation dedup logic for missing/normalized titles and improve warning/actionability.
tokens used
46,495
### FINDING-01: Empty Session Scores 50/100 (Inflated Baseline)
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:91,92,93,102,132,133,144
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** An empty session (`content=''`, all arrays empty) scores **50/100** (`fileDescriptions=20`, `noLeakedTags=15`, `observationDedup=15`) with only warnings.
- **Expected Behavior:** Empty sessions should score near 0 and/or fail quality gating.
- **Root Cause:** Non-applicable dimensions are granted full points.
- **Suggested Fix:** Add a hard guard: if semantic signal is empty (no triggers, topics, observations, meaningful content), return score 0. Or normalize by applicable dimensions only.
- **Effort:** SMALL (<30 min)

### FINDING-02: Non-Applicable Dimensions Award Full Credit
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:91,92,93,132,133
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** `files.length===0` gives 20/20 and `observations.length===0` gives 15/15.
- **Expected Behavior:** N/A metrics should be excluded from denominator or scored neutral, not max.
- **Root Cause:** N/A is treated as success.
- **Suggested Fix:** Track `applicableWeight`; compute `score = earned/applicableWeight * 100`.
- **Effort:** MEDIUM (<2 hr)

### FINDING-03: Tool-Only Sessions Are Mis-Scored (No Tool Signal in v1)
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:49,50,51,52,53,54,55
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** v1 does not ingest tool/message/decision counts; a tool-heavy but semantically sparse session can still land around ~50-55.
- **Expected Behavior:** Tool-only sessions should be evaluated with execution/context signals or penalized for missing semantic extraction.
- **Root Cause:** Input model is incomplete versus modern session characteristics.
- **Suggested Fix:** Extend inputs with `messageCount/toolCount/decisionCount` (like v2) and rebalance score.
- **Effort:** MEDIUM (<2 hr)

### FINDING-04: Trigger Phrases and Key Topics Double-Count Similar Signal
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:66,67,68,69,70,71,72,77,78,79,80,81,82,83
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Two dimensions independently score lexical extraction coverage.
- **Expected Behavior:** Dimensions should be orthogonal or explicitly weighted to avoid redundancy.
- **Root Cause:** Overlapping metrics both reward similar semantic density.
- **Suggested Fix:** Merge into one “semantic coverage” dimension or reduce one weight significantly.
- **Effort:** SMALL (<30 min)

### FINDING-05: No Fail Threshold / Status Output in Legacy Scorer
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:56,74,85,110,124,127,140,145
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Only warnings are emitted; function never returns pass/warn/fail classification.
- **Expected Behavior:** Explicit thresholds for warn/fail should be part of the scorer contract.
- **Root Cause:** Scoring and policy are not connected.
- **Suggested Fix:** Add `status: 'pass'|'warn'|'fail'` using constants (e.g., `<40 fail`, `<70 warn`) and expose in return type.
- **Effort:** SMALL (<30 min)

### FINDING-06: Content Length Metric Is Line-Count Based and Easily Gamed
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:101,102,103,105,107,110
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Score is based on raw `split('\n').length`, including blank lines.
- **Expected Behavior:** Measure meaningful content, not newline quantity.
- **Root Cause:** Simplistic heuristic.
- **Suggested Fix:** Use non-empty line count and/or token count; optionally require section presence.
- **Effort:** SMALL (<30 min)

### FINDING-07: HTML Leak Detection Misses Most Tag Types
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:114
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Only checks opening `<summary|details|div|span|p|br|hr>` tags.
- **Expected Behavior:** Detect broader leaked HTML (including closing tags and other elements).
- **Root Cause:** Narrow regex allowlist.
- **Suggested Fix:** Broaden detection (`</?[a-z][\w-]*\b[^>]*>`) then suppress known-safe contexts.
- **Effort:** SMALL (<30 min)

### FINDING-08: Code-Block Exclusion Is Incomplete
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:116,117,118,119
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Excludes tags only inside triple-backtick fences; misses `~~~` and indented code blocks.
- **Expected Behavior:** Robust markdown-aware exclusion.
- **Root Cause:** Regex-only parsing.
- **Suggested Fix:** Use markdown parser AST or expand fence handling to additional code block forms.
- **Effort:** MEDIUM (<2 hr)

### FINDING-09: Observation Dedup Gives Perfect Score When Titles Are Missing
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:135,137,138
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** If observations exist but all `TITLE` are empty, `dedupRatio` becomes 1 and score is 15/15.
- **Expected Behavior:** Missing dedup key should reduce confidence, not award full score.
- **Root Cause:** Fallback logic treats “no titles” as perfect uniqueness.
- **Suggested Fix:** If `observations.length>0 && titles.length===0`, assign low/partial score and warning; fallback to narrative hashing.
- **Effort:** SMALL (<30 min)

### FINDING-10: Dedup Comparison Lacks Normalization (Case/Whitespace)
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:135,136
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `"Fix bug"`, `"fix bug"`, `"Fix bug "` are treated as distinct titles.
- **Expected Behavior:** Trivial variants should deduplicate.
- **Root Cause:** No canonicalization before `Set`.
- **Suggested Fix:** Normalize with `trim().toLowerCase()` before uniqueness check.
- **Effort:** TRIVIAL (<5 min)

### FINDING-11: Warning Triggers Are Coarse and Weakly Actionable
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:74,85,97,110,124,127,140
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Warnings fire mostly at extreme states and lack concrete remediation targets.
- **Expected Behavior:** Warnings should tell operators exactly what to change and target thresholds.
- **Root Cause:** Minimal-message warning design.
- **Suggested Fix:** Include thresholds in messages (e.g., “need >=4 trigger phrases”), include offending items where possible.
- **Effort:** SMALL (<30 min)

### FINDING-12: V1/V2 Coexistence Creates Conflicting Quality Sources
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:22,33,822,835,937; /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts:64,110,113
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Workflow computes both scores; v2 (0..1) is stored in metadata, v1 (0..100) is returned in workflow stats and logged side-by-side.
- **Expected Behavior:** Single canonical score or clearly separated contracts.
- **Root Cause:** Transitional dual-scoring without strict ownership boundaries.
- **Suggested Fix:** Deprecate v1 for production scoring, keep only diagnostic breakdown if needed; return both fields with explicit names if both must remain.
- **Effort:** MEDIUM (<2 hr)

### FINDING-13: Test Mocks Show Unit Ambiguity Between Scorers
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:127,128,129
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** v2 scorer is mocked as `{ qualityScore: 100 }`, while implementation clamps to `0..1`.
- **Expected Behavior:** Tests should enforce actual unit contract to catch integration bugs.
- **Root Cause:** Unclear quality score unit semantics in test layer.
- **Suggested Fix:** Change v2 mocks to `0..1`, add contract test asserting unit range.
- **Effort:** TRIVIAL (<5 min)

### FINDING-14: Description Quality Heuristic Is Brittle and Partly Redundant
- **File:** /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts:36,37,41
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Any description containing `description pending` is rejected; second check is redundant because first already covers it.
- **Expected Behavior:** Placeholder detection should be precise and avoid false rejects.
- **Root Cause:** Substring heuristic and duplicated condition.
- **Suggested Fix:** Replace with anchored placeholder regex list; remove redundant `includes('(description pending)')`.
- **Effort:** TRIVIAL (<5 min)

### SUMMARY
- Total findings: 14
- Critical: 0, High: 4, Medium: 5, Low: 5
- Top 3 recommendations: 
1. Replace N/A full-credit scoring with applicability-normalized scoring (fixes empty/tool-only inflation).
2. Make one canonical scorer (prefer v2), or strictly separate v1 as diagnostics with explicit units.
3. Fix observation dedup logic for missing/normalized titles and improve warning/actionability.
