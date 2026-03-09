OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccec9-3c9d-70c2-a0f1-487caa566ffb
--------
user
You are a code auditor. Read lines 1-400 of /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts (836 total lines).

This file collects and structures session data from AI conversations.

Audit the first 400 lines specifically:
1. CONFIG/TYPES: Are type definitions complete? Any 'any' types that should be specific?
2. LEARNING INDEX FORMULA: How is the learning index calculated? Are weights reasonable? Is the formula documented? Edge cases (division by zero, negative values)?
3. PREFLIGHT/POSTFLIGHT: How are preflight and postflight data extracted? Can they be confused with regular messages?
4. IMPORTS: Are all imports used? Any circular dependencies?
5. CONSTANTS: Are magic numbers documented? Could they be in config?
6. TYPE SAFETY: Any type assertions (as any, as unknown) that bypass safety?

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
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
Reviewing the first 400 lines now with a strict audit lens on types, formula math, pre/postflight extraction, imports, constants, and type-safety bypasses. I’ll pull the file content first, then enumerate every concrete finding with line references.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts' | sed -n '1,400p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Collect Session Data
     3	// ---------------------------------------------------------------
     4	// Orchestrates session data collection — gathers observations, files, decisions, and context
     5	
     6	// Node stdlib
     7	import * as path from 'path';
     8	
     9	// Internal modules
    10	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from '../core';
    11	import { formatTimestamp } from '../utils/message-utils';
    12	import { pickBestContentName } from '../utils/slug-utils';
    13	import { detectSpecFolder } from '../spec-folder';
    14	
    15	import {
    16	  generateSessionId,
    17	  getChannel,
    18	  detectSessionCharacteristics,
    19	  buildProjectStateSnapshot,
    20	  calculateSessionDuration,
codex
I’ve captured lines 1-400 and next I’m cross-checking symbol usage and formula behavior so findings are accurate (especially around imports and type-safety edge cases).
exec
/bin/zsh -lc "FILE='/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts'; for sym in CONFIG findActiveSpecsDir getSpecsDirectories formatTimestamp pickBestContentName detectSpecFolder generateSessionId getChannel detectSessionCharacteristics buildProjectStateSnapshot calculateSessionDuration calculateExpiryEpoch detectRelatedDocs extractBlockers ToolCounts Observation UserPrompt FileEntry SpecFileEntry RecentContextEntry detectObservationType extractFilesFromData buildObservationsWithAnchors FileChange ObservationDetailed buildImplementationGuideData ImplementationGuideData SessionData OutcomeEntry; do c="'$(rg -n "'"\\b"'${sym}'"\\b\" \""'$FILE" | wc -l | tr -d '"' '); echo \""'$sym $c"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 74ms:
ObservationDetailed 2
buildImplementationGuideData 2
ImplementationGuideData 2
SessionData 3
OutcomeEntry 3
exec
/bin/zsh -lc "rg -n \"\\bextractBlockers\\b\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
23:  extractBlockers,
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts' | sed -n '1,400p' | rg -n \"\\bany\\b|as any|as unknown|unknown\\[|\\[key: string\\]: unknown|\\bunknown\\b| as \"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
7:     7	import * as path from 'path';
142:   142	  _manualDecisions?: unknown[];
147:   147	  [key: string]: unknown;
codex
I found at least one definitely unused import and I’m now validating smaller quality edge cases (weights, thresholds, and potential data-shape ambiguity) with exact line anchors before I format the report.
exec
/bin/zsh -lc "rg -n \"\\bpath\\b\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
7:import * as path from 'path';
140:  FILES?: Array<{ FILE_PATH?: string; path?: string; DESCRIPTION?: string; description?: string }>;
141:  filesModified?: Array<{ path: string; changes_summary?: string }>;
623:    const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
624:    const normalizedDetected = path.resolve(detectedFolder).replace(/\\/g, '/');
629:      path.join(CONFIG.PROJECT_ROOT, 'specs'),
630:      path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
635:      const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
636:      const relative = path.relative(normalizedRoot, normalizedDetected).replace(/\\/g, '/');
642:        !path.isAbsolute(relative)
654:        : path.basename(normalizedDetected);
724:  const activeSpecsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
726:    ? path.join(activeSpecsDir, collectedData.SPEC_FOLDER)
exec
/bin/zsh -lc "rg -n \"collect-session-data\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/index.ts:34:export * from './collect-session-data';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/README.md:33:- `collect-session-data.ts`
codex
I’m now checking whether the import graph introduces cycles and whether pre/postflight extraction can produce contradictory flags versus computed deltas.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts' | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Session Extractor
     3	// ---------------------------------------------------------------
     4	// Extracts session metadata — ID, title, duration, key topics, and learning delta
     5	
     6	// Node stdlib
     7	import * as crypto from 'crypto';
     8	import { execSync } from 'child_process';
     9	import * as fs from 'fs/promises';
    10	import * as path from 'path';
    11	
    12	// Internal modules
    13	import { CONFIG } from '../core';
    14	import {
    15	  createValidShortTerms,
    16	  shouldIncludeTopicWord,
    17	  tokenizeTopicWords,
    18	} from '../lib/topic-keywords';
    19	
    20	/* -----------------------------------------------------------------
codex
I confirmed there’s no obvious direct circular import involving this module. I’m now validating whether the pre/postflight interfaces match how these fields are consumed elsewhere, to flag any missing or inconsistent type definitions.
exec
/bin/zsh -lc "rg -n \"\\bpreflight\\b|\\bpostflight\\b|knowledgeScore|uncertaintyRaw|readiness|gapsClosed|newGaps\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:987:  // Priority 2.5: Session learning DB lookup (most recent preflight spec folder)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:73:JSON Data Format (with preflight/postflight support):
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:78:    "preflight": {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:79:      "knowledgeScore": 40,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:85:      "readiness": "Needs research"
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:87:    "postflight": {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:88:      "knowledgeScore": 75,
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:91:      "gapsClosed": ["gap1"],
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:92:      "newGaps": ["new-gap"]
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:97:  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:98:  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:99:  - Context Delta = postflight.contextScore - preflight.contextScore
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:25:const NON_OPTIONAL_FIELDS = ['decisions', 'next_actions', 'blockers', 'readiness'];
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:29:  { pattern: /\|\s*(Knowledge|Uncertainty|Context) Score\s*\|\s*\/100\s*\|/i, label: 'empty preflight score' },
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:30:  { pattern: /\|\s*Timestamp\s*\|\s*\|\s*Session start\s*\|/i, label: 'empty preflight timestamp' },
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts:31:  { pattern: /-\s*Readiness:\s*$/im, label: 'empty readiness value' },
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:55:  knowledgeScore?: number;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:61:  uncertaintyRaw?: number;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:62:  readiness?: string;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:67:  knowledgeScore?: number;
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | sed -n '60,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    60	  node generate-context.js 003-parent/121-child
    61	  node generate-context.js 121-child          (auto-searches all parents)
    62	  node generate-context.js specs/003-parent/121-child
    63	
    64	Output:
    65	  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
    66	  for indexing by the Spec Kit Memory system.
    67	
    68	Direct CLI target rule:
    69	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    70	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    71	    but they must not reroute the save to another folder.
    72	
    73	JSON Data Format (with preflight/postflight support):
    74	  {
    75	    "user_prompts": [...],
    76	    "observations": [...],
    77	    "recent_context": [...],
    78	    "preflight": {
    79	      "knowledgeScore": 40,
codex
I’ve completed the pass and compiled concrete findings with line-level references. I’m formatting them now in your exact template, including severity, root cause, and specific fixes.
codex
### FINDING-01: Unused `extractBlockers` Import
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:23](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:23)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `extractBlockers` is imported but never referenced.
- **Expected Behavior:** All imports should be used or removed.
- **Root Cause:** Stale import after refactor.
- **Suggested Fix:** Remove `extractBlockers` from the import list.
- **Effort:** TRIVIAL (<5 min)

### FINDING-02: Learning Index Weights Are Hard-Coded and Not Explained In-Function
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:186](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:186)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `0.4 / 0.35 / 0.25` are embedded directly in calculation.
- **Expected Behavior:** Weights should be named constants/config with rationale.
- **Root Cause:** Formula constants are inlined and undocumented at point of use.
- **Suggested Fix:** Extract to constants, e.g. `LEARNING_WEIGHTS = { knowledge: 0.4, uncertainty: 0.35, context: 0.25 }`, and add brief comment.
- **Effort:** SMALL (<30 min)

### FINDING-03: Learning Index Assumes Valid Score Ranges but Does Not Validate Inputs
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:191](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:191)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Any numeric delta is accepted; invalid/out-of-range upstream values are only clamped at final index.
- **Expected Behavior:** Inputs should be validated or normalized before index computation.
- **Root Cause:** No guardrails on metric range (expected appears to be roughly 0-100).
- **Suggested Fix:** Validate pre/post scores (or deltas) and reject/ignore non-finite/out-of-range values.
- **Effort:** SMALL (<30 min)

### FINDING-04: Missing Postflight Metrics Are Treated as `0`, Producing False Deltas
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:270](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:270)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `deltaUncert` and `deltaContext` default missing values to `0`, which can fabricate large improvements/regressions.
- **Expected Behavior:** If one side is missing, delta should be `null` (or not computed), not implied from `0`.
- **Root Cause:** Nullish coalescing used as data imputation in analytical math.
- **Suggested Fix:** Compute each delta only when both corresponding pre/post values are numbers; otherwise set delta fields to `null` and adjust summary/index logic.
- **Effort:** MEDIUM (<2 hr)

### FINDING-05: `HAS_POSTFLIGHT_DELTA` Can Be `false` While Delta Fields Are Still Populated
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:213](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:213)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `HAS_POSTFLIGHT_DELTA` requires all 3 metric pairs, but delta computation starts when only knowledge scores exist.
- **Expected Behavior:** Availability flag and computation criteria should be identical.
- **Root Cause:** Two different readiness predicates.
- **Suggested Fix:** Use a single `canComputeLearningDelta` boolean for both `HAS_POSTFLIGHT_DELTA` and delta/index generation.
- **Effort:** SMALL (<30 min)

### FINDING-06: Preflight/Postflight Extraction Trusts Caller Shape Without Provenance Validation
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:198](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:198)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Any object passed as `collectedData.preflight/postflight` is treated as authoritative metrics.
- **Expected Behavior:** Metrics should be validated against a strict schema/source marker before being used.
- **Root Cause:** No runtime schema validation at extraction boundary.
- **Suggested Fix:** Add guard function (or schema validator) to validate pre/postflight payload origin and value types/ranges before processing.
- **Effort:** MEDIUM (<2 hr)

### FINDING-07: `CollectedDataFull` Is Overly Permissive and Weakens Type Guarantees
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:135](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:135)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `[key: string]: unknown` plus `unknown[]` and dual-shape `FILES` allows broad unvalidated data.
- **Expected Behavior:** Prefer tighter interfaces/unions for known payload variants.
- **Root Cause:** Catch-all typing used instead of discriminated/narrowed structures.
- **Suggested Fix:** Replace catch-all with explicit optional fields and typed unions; narrow `_manualDecisions` to concrete decision type.
- **Effort:** MEDIUM (<2 hr)

### FINDING-08: `metric` Parameter Uses Broad `string` Instead of Literal Union
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:154](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:154)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Any arbitrary string is accepted by `getScoreAssessment`.
- **Expected Behavior:** Accept only known metric keys.
- **Root Cause:** Missing literal type (e.g. `'knowledge' | 'uncertainty' | 'context'`).
- **Suggested Fix:** Tighten signature to a union type and enforce exhaustive handling.
- **Effort:** TRIVIAL (<5 min)

### FINDING-09: Multiple Threshold Magic Numbers Are Scattered and Undocumented
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:159](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:159)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Thresholds like `20/40/60/80`, `>20/>10/>5`, and completion heuristics (`<3`, `*5`, `90`) are hard-coded.
- **Expected Behavior:** Thresholds should be named constants/config with intent comments.
- **Root Cause:** Business rules embedded directly in control flow.
- **Suggested Fix:** Centralize thresholds in `const` objects (or config) and reference them by name.
- **Effort:** SMALL (<30 min)

### FINDING-10: Redundant Branch in `determineSessionStatus`
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:382](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:382)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `if (messageCount < 3) return 'IN_PROGRESS';` then unconditional `return 'IN_PROGRESS';`.
- **Expected Behavior:** Remove dead branch or make branch meaningfully distinct.
- **Root Cause:** Leftover conditional from prior logic.
- **Suggested Fix:** Delete the conditional or reintroduce differentiated status logic.
- **Effort:** TRIVIAL (<5 min)

### FINDING-11: `isNaN` (Global) Used Instead of `Number.isNaN`
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:155](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:155)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Uses coercive `isNaN(...)`.
- **Expected Behavior:** Use `Number.isNaN(...)` for strict numeric NaN checks.
- **Root Cause:** Legacy NaN check style.
- **Suggested Fix:** Replace both `isNaN(score)` and `isNaN(delta)` with `Number.isNaN(...)`.
- **Effort:** TRIVIAL (<5 min)

### SUMMARY
- Total findings: 11
- Critical: 0, High: 1, Medium: 5, Low: 5
- Top 3 recommendations:  
1. Unify delta-availability logic and stop computing deltas/index when metrics are missing (fix Findings 04-05).  
2. Tighten data contracts (`CollectedDataFull`, metric literals, runtime validation) to prevent malformed analytical inputs (fix Findings 06-08).  
3. Centralize/document formula and thresholds as named constants/config to make scoring behavior auditable and maintainable (fix Findings 02, 09).  

No `as any` / `as unknown` type assertions were found in lines 1-400.
tokens used
36,563
### FINDING-01: Unused `extractBlockers` Import
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:23](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:23)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `extractBlockers` is imported but never referenced.
- **Expected Behavior:** All imports should be used or removed.
- **Root Cause:** Stale import after refactor.
- **Suggested Fix:** Remove `extractBlockers` from the import list.
- **Effort:** TRIVIAL (<5 min)

### FINDING-02: Learning Index Weights Are Hard-Coded and Not Explained In-Function
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:186](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:186)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `0.4 / 0.35 / 0.25` are embedded directly in calculation.
- **Expected Behavior:** Weights should be named constants/config with rationale.
- **Root Cause:** Formula constants are inlined and undocumented at point of use.
- **Suggested Fix:** Extract to constants, e.g. `LEARNING_WEIGHTS = { knowledge: 0.4, uncertainty: 0.35, context: 0.25 }`, and add brief comment.
- **Effort:** SMALL (<30 min)

### FINDING-03: Learning Index Assumes Valid Score Ranges but Does Not Validate Inputs
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:191](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:191)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Any numeric delta is accepted; invalid/out-of-range upstream values are only clamped at final index.
- **Expected Behavior:** Inputs should be validated or normalized before index computation.
- **Root Cause:** No guardrails on metric range (expected appears to be roughly 0-100).
- **Suggested Fix:** Validate pre/post scores (or deltas) and reject/ignore non-finite/out-of-range values.
- **Effort:** SMALL (<30 min)

### FINDING-04: Missing Postflight Metrics Are Treated as `0`, Producing False Deltas
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:270](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:270)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** `deltaUncert` and `deltaContext` default missing values to `0`, which can fabricate large improvements/regressions.
- **Expected Behavior:** If one side is missing, delta should be `null` (or not computed), not implied from `0`.
- **Root Cause:** Nullish coalescing used as data imputation in analytical math.
- **Suggested Fix:** Compute each delta only when both corresponding pre/post values are numbers; otherwise set delta fields to `null` and adjust summary/index logic.
- **Effort:** MEDIUM (<2 hr)

### FINDING-05: `HAS_POSTFLIGHT_DELTA` Can Be `false` While Delta Fields Are Still Populated
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:213](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:213)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `HAS_POSTFLIGHT_DELTA` requires all 3 metric pairs, but delta computation starts when only knowledge scores exist.
- **Expected Behavior:** Availability flag and computation criteria should be identical.
- **Root Cause:** Two different readiness predicates.
- **Suggested Fix:** Use a single `canComputeLearningDelta` boolean for both `HAS_POSTFLIGHT_DELTA` and delta/index generation.
- **Effort:** SMALL (<30 min)

### FINDING-06: Preflight/Postflight Extraction Trusts Caller Shape Without Provenance Validation
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:198](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:198)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** Any object passed as `collectedData.preflight/postflight` is treated as authoritative metrics.
- **Expected Behavior:** Metrics should be validated against a strict schema/source marker before being used.
- **Root Cause:** No runtime schema validation at extraction boundary.
- **Suggested Fix:** Add guard function (or schema validator) to validate pre/postflight payload origin and value types/ranges before processing.
- **Effort:** MEDIUM (<2 hr)

### FINDING-07: `CollectedDataFull` Is Overly Permissive and Weakens Type Guarantees
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:135](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:135)
- **Severity:** MEDIUM
- **Category:** DESIGN
- **Current Behavior:** `[key: string]: unknown` plus `unknown[]` and dual-shape `FILES` allows broad unvalidated data.
- **Expected Behavior:** Prefer tighter interfaces/unions for known payload variants.
- **Root Cause:** Catch-all typing used instead of discriminated/narrowed structures.
- **Suggested Fix:** Replace catch-all with explicit optional fields and typed unions; narrow `_manualDecisions` to concrete decision type.
- **Effort:** MEDIUM (<2 hr)

### FINDING-08: `metric` Parameter Uses Broad `string` Instead of Literal Union
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:154](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:154)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Any arbitrary string is accepted by `getScoreAssessment`.
- **Expected Behavior:** Accept only known metric keys.
- **Root Cause:** Missing literal type (e.g. `'knowledge' | 'uncertainty' | 'context'`).
- **Suggested Fix:** Tighten signature to a union type and enforce exhaustive handling.
- **Effort:** TRIVIAL (<5 min)

### FINDING-09: Multiple Threshold Magic Numbers Are Scattered and Undocumented
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:159](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:159)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Thresholds like `20/40/60/80`, `>20/>10/>5`, and completion heuristics (`<3`, `*5`, `90`) are hard-coded.
- **Expected Behavior:** Thresholds should be named constants/config with intent comments.
- **Root Cause:** Business rules embedded directly in control flow.
- **Suggested Fix:** Centralize thresholds in `const` objects (or config) and reference them by name.
- **Effort:** SMALL (<30 min)

### FINDING-10: Redundant Branch in `determineSessionStatus`
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:382](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:382)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** `if (messageCount < 3) return 'IN_PROGRESS';` then unconditional `return 'IN_PROGRESS';`.
- **Expected Behavior:** Remove dead branch or make branch meaningfully distinct.
- **Root Cause:** Leftover conditional from prior logic.
- **Suggested Fix:** Delete the conditional or reintroduce differentiated status logic.
- **Effort:** TRIVIAL (<5 min)

### FINDING-11: `isNaN` (Global) Used Instead of `Number.isNaN`
- **File:** [/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:155](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:155)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Uses coercive `isNaN(...)`.
- **Expected Behavior:** Use `Number.isNaN(...)` for strict numeric NaN checks.
- **Root Cause:** Legacy NaN check style.
- **Suggested Fix:** Replace both `isNaN(score)` and `isNaN(delta)` with `Number.isNaN(...)`.
- **Effort:** TRIVIAL (<5 min)

### SUMMARY
- Total findings: 11
- Critical: 0, High: 1, Medium: 5, Low: 5
- Top 3 recommendations:  
1. Unify delta-availability logic and stop computing deltas/index when metrics are missing (fix Findings 04-05).  
2. Tighten data contracts (`CollectedDataFull`, metric literals, runtime validation) to prevent malformed analytical inputs (fix Findings 06-08).  
3. Centralize/document formula and thresholds as named constants/config to make scoring behavior auditable and maintainable (fix Findings 02, 09).  

No `as any` / `as unknown` type assertions were found in lines 1-400.
