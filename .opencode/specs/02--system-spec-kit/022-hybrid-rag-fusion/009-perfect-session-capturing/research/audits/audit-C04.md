OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ccec9-5436-7d61-944a-1681d684cf0f
--------
user
You are a code auditor. Read EVERY LINE of /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts (195 lines).

This file loads session data from various sources (OpenCode storage, file system).

Audit specifically:
1. PRIORITY CHAIN: In what order are data sources tried? Is the priority correct?
2. PATH SANITIZATION: How are file paths constructed? Any traversal risks?
3. ERROR HANDLING: What happens when a source is unavailable? Does it fall through correctly?
4. LAZY LOADING: Is data loaded eagerly or lazily? Could it load unnecessary data?
5. FILE FORMAT DETECTION: How does it determine the format of loaded data? Any ambiguity?
6. CACHING: Is loaded data cached? Could stale data be returned?

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
mcp: sequential_thinking starting
mcp: code_mode starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m auditing that file line-by-line now, focused on the six areas you listed. First I’ll load the full 195-line source with line numbers so we can ground every finding in exact locations.
exec
/bin/zsh -lc "wc -l '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts' && nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     195 /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
     1	// ---------------------------------------------------------------
     2	// MODULE: Data Loader
     3	// ---------------------------------------------------------------
     4	// Loads session data from file, OpenCode capture, or simulation fallback
     5	
     6	// 1. IMPORTS
     7	
     8	import fs from 'fs/promises';
     9	import path from 'path';
    10	import os from 'os';
    11	
    12	import { CONFIG } from '../core';
    13	import { structuredLog, sanitizePath } from '../utils';
    14	
    15	import {
    16	  validateInputData,
    17	  normalizeInputData,
    18	  transformOpencodeCapture,
    19	} from '../utils/input-normalizer';
codex
I’ve finished reading all 195 lines and next I’m checking the `sanitizePath` implementation it relies on, so the traversal-risk assessment is evidence-based rather than assumed.
exec
/bin/zsh -lc "rg -n \"type DataSource|export type DataSource|normalizeInputData|validateInputData|transformOpencodeCapture\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"function sanitizePath|const sanitizePath|export function sanitizePath|sanitizePath\\(\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
9:export type DataSource = 'file' | 'opencode-capture' | 'simulation';
222:function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
291:function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
353:function transformOpencodeCapture(capture: OpencodeCapture, specFolderHint?: string | null): TransformedCapture {
494:  normalizeInputData,
495:  validateInputData,
496:  transformOpencodeCapture,
498:  transformOpencodeCapture as transformOpenCodeCapture,
 succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:98:        validatedDataFilePath = sanitizePath(dataFile, dataFileAllowedBases);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts:19:function sanitizePath(inputPath: string, allowedBases: string[] | null = null): string {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:81:node -e "const { sanitizePath } = require('./dist/utils/path-utils'); console.log(sanitizePath('/specs/001-test'));"
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:96:node -e "const { sanitizePath } = require('./dist/utils/path-utils'); console.log(sanitizePath('./specs/<test-folder>'));"
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:111:const safePath = sanitizePath('/specs/001-feature');
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:190:**Cause**: `sanitizePath()` enforces allowed base directories (cwd, specs, .opencode)
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:195:const safePath = sanitizePath(inputPath, [
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:201:const safePath = sanitizePath('./specs/001-test');
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/README.md:280:node -e "const { sanitizePath } = require('./dist/utils/path-utils'); console.log(sanitizePath('./specs/<test-folder>'));"
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:226:    assertThrows(() => sanitizePath('/valid/path\0/injection'),
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:230:    assertThrows(() => sanitizePath(''),
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:234:    assertThrows(() => sanitizePath(null),
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:239:    assertDoesNotThrow(() => sanitizePath(cwd, [cwd]),
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:243:    assertThrows(() => sanitizePath('/etc/passwd', [cwd]),
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/spec-folder/directory-setup.ts:21:    sanitizedPath = sanitizePath(specFolder, getSpecsDirectories());
codex
I found the sanitizer and normalizer definitions; I’m reading those sections now to validate traversal handling, source tagging, and any format ambiguity in this loader path.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/path-utils.ts' | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | sed -n '1,560p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Path Utils
     3	// ---------------------------------------------------------------
     4	// Secure path sanitization and resolution with traversal protection (CWE-22)
     5	
     6	// 1. IMPORTS
     7	
     8	// Node stdlib
     9	import fs from 'fs';
    10	import path from 'path';
    11	
    12	// Internal modules
    13	import { structuredLog } from './logger';
    14	
    15	// ---------------------------------------------------------------
    16	// 2. PATH SANITIZATION
    17	// ---------------------------------------------------------------
    18	
    19	function sanitizePath(inputPath: string, allowedBases: string[] | null = null): string {
    20	  if (!inputPath || typeof inputPath !== 'string') {
 succeeded in 51ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Input Normalizer
     3	// ---------------------------------------------------------------
     4	// Validates, normalizes, and transforms raw input data into structured session format
     5	
     6	// 1. TYPES
     7	
     8	/** Data source type indicating where loaded data came from */
     9	export type DataSource = 'file' | 'opencode-capture' | 'simulation';
    10	
    11	/** A single observation record produced by transformation */
    12	export interface Observation {
    13	  type: string;
    14	  title: string;
    15	  narrative: string;
    16	  facts: string[];
    17	  timestamp?: string;
    18	  files?: string[];
    19	  _manualDecision?: {
    20	    fullText: string;
codex
I’m now mapping where `loadCollectedData` is used so we can judge whether fallback behavior and caching side effects are harmless or could propagate incorrect data silently.
exec
/bin/zsh -lc "rg -n \"loadCollectedData\\(|_source|_isSimulation|data-loader\" '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/index.ts:7:export { loadCollectedData } from './data-loader';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/index.ts:8:export type { DataSource, LoadedData } from './data-loader';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:31:  _isSimulation?: boolean;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:32:  _source?: DataSource;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:76:async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:116:      return { ...data, _source: 'file' } as LoadedData;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:186:  return { _isSimulation: true, _source: 'simulation' };
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md:33:- `data-loader.ts` - source loading, path checks, normalization, fallback handling
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md:42:`data-loader.ts` loads in this order:
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/README.md:51:- Input: normalized data from `loaders/data-loader.ts`
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:144:  _isSimulation?: boolean;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/README.md:52:- `loaders/` - 1 TypeScript loading module (`data-loader.ts`) plus barrel export
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:69:  _isSimulation?: boolean;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/lib/simulation-factory.ts:449:  if (collectedData._isSimulation) return true;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:121:  _source: DataSource;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:479:    _source: 'opencode-capture',
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:52:import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:436:      log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:623:    const dataSource = typeof collectedData?._source === 'string' ? collectedData._source : null;
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:781:  const isSimulation: boolean = !collectedData || !!collectedData._isSimulation || simFactory.requiresSimulation(collectedData);
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/README.md' | sed -n '1,160p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
     1	---
     2	title: "Data Loaders"
     3	description: "Data loader modules that normalize input from JSON, OpenCode capture, or simulation fallback."
     4	trigger_phrases:
     5	  - "data loaders"
     6	  - "load collected data"
     7	  - "context loading"
     8	---
     9	
    10	
    11	# Data Loaders
    12	
    13	<!-- ANCHOR:table-of-contents -->
    14	## TABLE OF CONTENTS
    15	
    16	- [1. OVERVIEW](#1--overview)
    17	- [2. CURRENT INVENTORY](#2--current-inventory)
    18	- [3. SOURCE PRIORITY](#3--source-priority)
    19	- [4. SECURITY AND PATH HANDLING](#4--security-and-path-handling)
    20	- [5. QUICK USAGE](#5--quick-usage)
codex
I spotted a potential contradiction between implementation and loader docs, so I’m checking tests next to confirm whether fallback on invalid paths is intentional or an accidental behavior drift.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js' | sed -n '1040,1165p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  1040	    const { getRecentSessions } = opencodeCapture;
  1041	    const sessions = await getRecentSessions('nonexistent-project-id', 10);
  1042	    assertArray(sessions, 'EXT-OC-025: Invalid project returns empty array');
  1043	    assertEqual(sessions.length, 0, 'EXT-OC-026: No sessions for invalid project');
  1044	
  1045	    // Test get_session_messages with invalid session ID
  1046	    const { getSessionMessages } = opencodeCapture;
  1047	    const messages = await getSessionMessages('nonexistent-session-id');
  1048	    assertArray(messages, 'EXT-OC-027: Invalid session returns empty array');
  1049	
  1050	    // Test get_message_parts with invalid message ID
  1051	    const { getMessageParts } = opencodeCapture;
  1052	    const parts = await getMessageParts('nonexistent-message-id');
  1053	    assertArray(parts, 'EXT-OC-028: Invalid message returns empty array');
  1054	
  1055	  } catch (error) {
  1056	    fail('EXT-OC: Module load/test', error.message);
  1057	  }
  1058	}
  1059	
codex
I confirmed tests are broad and don’t pin down strict failure semantics, so I’m now checking runtime usage in `workflow.ts` to see if silent fallback can mask user-intended file input.
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '580,700p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
   580	    (collectedData?.observations || []) as Parameters<typeof generateImplementationSummary>[1]
   581	  );
   582	
   583	  const semanticFileChanges: Map<string, SemanticFileInfo> = extractFileChanges(
   584	    allMessages,
   585	    (collectedData?.observations || []) as Parameters<typeof extractFileChanges>[1]
   586	  );
   587	  const enhancedFiles: FileChange[] = enhanceFilesWithSemanticDescriptions(
   588	    sessionData.FILES || [],
   589	    semanticFileChanges
   590	  );
   591	
   592	  const IMPL_SUMMARY_MD: string = formatSummaryAsMarkdown(implSummary);
   593	  const HAS_IMPL: boolean = implSummary.filesCreated.length > 0 ||
   594	                   implSummary.filesModified.length > 0 ||
   595	                   implSummary.decisions.length > 0;
   596	
   597	  log(`   Generated summary: ${implSummary.filesCreated.length} created, ${implSummary.filesModified.length} modified, ${implSummary.decisions.length} decisions\n`);
   598	
   599	  // Step 7.6: Tree thinning — pre-pipeline token reduction
exec
/bin/zsh -lc "nl -ba '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '380,520p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
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
   390	  const updatedYaml = `${yamlBlock}\n\n# Quality Signals\n${qualityLines}`;
   391	  return content.replace(yamlBlock, updatedYaml);
   392	}
   393	
   394	/* -----------------------------------------------------------------
   395	   2. MAIN WORKFLOW
   396	   Orchestrates the full generate-context pipeline: data loading,
   397	   extraction, template rendering, file writing, and memory indexing.
   398	------------------------------------------------------------------*/
   399	
codex
### FINDING-01: Explicit data-file failures silently fall through to other sources
- **File:** [data-loader.ts#L117](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L117)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Any error in Priority 1 (missing file, bad JSON, validation error, security error) is logged, then loader continues to OpenCode capture/simulation.
- **Expected Behavior:** If caller explicitly provided `dataFile`, loader should fail fast instead of silently switching source.
- **Root Cause:** Broad `catch` around Priority 1 swallows all errors and does not distinguish explicit user intent from optional fallback mode.
- **Suggested Fix:** Track `isExplicitDataFile = options?.dataFile !== undefined`; in `catch`, rethrow for explicit mode (or at least for parse/validation/security errors).
- **Effort:** SMALL (<30 min)

### FINDING-02: Security path-validation failures do not actually fail fast
- **File:** [data-loader.ts#L105](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L105)
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** `sanitizePath` failure is wrapped as `Security: Invalid data file path...` but then caught by outer `catch` and execution falls through.
- **Expected Behavior:** Security validation errors should terminate load path immediately.
- **Root Cause:** Security exception is generated, then swallowed by outer fallback logic.
- **Suggested Fix:** Introduce `SecurityPathError` and rethrow it in outer `catch`; do not continue to lower-priority sources.
- **Effort:** TRIVIAL (<5 min)

### FINDING-03: Allowed base path is broader than necessary (`process.cwd()`)
- **File:** [data-loader.ts#L91](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L91)
- **Severity:** MEDIUM
- **Category:** SECURITY
- **Current Behavior:** Any file under the whole project working directory is eligible for reading if path is supplied.
- **Expected Behavior:** Restrict reads to explicit known safe ingestion paths (temp save path + specific spec/context directories).
- **Root Cause:** Allowlist includes full `process.cwd()` instead of narrower subpaths.
- **Suggested Fix:** Remove `process.cwd()` from allowlist and keep only concrete required directories.
- **Effort:** SMALL (<30 min)

### FINDING-04: Valid OpenCode data can be dropped when `exchanges` is empty
- **File:** [data-loader.ts#L158](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L158)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Capture is accepted only if `conversation.exchanges.length > 0`; captures with useful `toolCalls` but no exchanges are treated as empty and fallback continues.
- **Expected Behavior:** Accept capture when either exchanges or tool/toolcall-derived data exists.
- **Root Cause:** Gate condition checks only `exchanges`.
- **Suggested Fix:** Change condition to allow `(exchanges.length > 0 || toolCalls.length > 0)`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-05: File-format detection is heuristic and ambiguous
- **File:** [input-normalizer.ts#L223](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L223)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Presence of any one of `userPrompts`/`observations`/`recentContext` causes data to be treated as already normalized.
- **Expected Behavior:** Use explicit schema/version marker or strict structural checks before bypassing normalization.
- **Root Cause:** Format detection relies on weak presence checks, not schema validation.
- **Suggested Fix:** Require all expected arrays with `Array.isArray` (or a `formatVersion`) before short-circuiting normalization.
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: Validation gap allows malformed “already-normalized” payloads
- **File:** [input-normalizer.ts#L291](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `validateInputData` checks `observations` type but does not validate `userPrompts` or `recentContext` array types, while loader may skip normalization.
- **Expected Behavior:** All normalized-shape fields should be type-validated.
- **Root Cause:** Incomplete validation rules combined with heuristic format detection.
- **Suggested Fix:** Add strict type checks for `userPrompts` and `recentContext` (and item shape checks).
- **Effort:** SMALL (<30 min)

### FINDING-07: Type assertion can hide malformed loaded payloads
- **File:** [data-loader.ts#L116](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L116)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Return value is force-cast with `as LoadedData`, even if normalized shape is incomplete.
- **Expected Behavior:** Runtime-validated `LoadedData` should be returned without unsafe cast.
- **Root Cause:** Type assertion bypasses structural guarantees.
- **Suggested Fix:** Add a runtime guard (or builder) that ensures required arrays/fields are present before return.
- **Effort:** SMALL (<30 min)

### FINDING-08: Lazy import cache can become stale after transient failure
- **File:** [data-loader.ts#L53](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L53)
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** If dynamic import fails once, `_opencodeCapture` is set to `null` and never retried in-process.
- **Expected Behavior:** Retry import on subsequent calls (or after cooldown), because availability can change.
- **Root Cause:** Negative result is cached permanently.
- **Suggested Fix:** Cache only successful import, or add retry/backoff timestamp for `null` state.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 8
- Critical: 0, High: 3, Medium: 3, Low: 2
- Top 3 recommendations: 1) Make explicit `dataFile` mode fail-fast (no fallback on parse/validation/security errors). 2) Tighten format detection + validation (`userPrompts`/`recentContext` checks). 3) Accept OpenCode captures with `toolCalls` even when `exchanges` is empty.
tokens used
40,791
### FINDING-01: Explicit data-file failures silently fall through to other sources
- **File:** [data-loader.ts#L117](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L117)
- **Severity:** HIGH
- **Category:** BUG
- **Current Behavior:** Any error in Priority 1 (missing file, bad JSON, validation error, security error) is logged, then loader continues to OpenCode capture/simulation.
- **Expected Behavior:** If caller explicitly provided `dataFile`, loader should fail fast instead of silently switching source.
- **Root Cause:** Broad `catch` around Priority 1 swallows all errors and does not distinguish explicit user intent from optional fallback mode.
- **Suggested Fix:** Track `isExplicitDataFile = options?.dataFile !== undefined`; in `catch`, rethrow for explicit mode (or at least for parse/validation/security errors).
- **Effort:** SMALL (<30 min)

### FINDING-02: Security path-validation failures do not actually fail fast
- **File:** [data-loader.ts#L105](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L105)
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** `sanitizePath` failure is wrapped as `Security: Invalid data file path...` but then caught by outer `catch` and execution falls through.
- **Expected Behavior:** Security validation errors should terminate load path immediately.
- **Root Cause:** Security exception is generated, then swallowed by outer fallback logic.
- **Suggested Fix:** Introduce `SecurityPathError` and rethrow it in outer `catch`; do not continue to lower-priority sources.
- **Effort:** TRIVIAL (<5 min)

### FINDING-03: Allowed base path is broader than necessary (`process.cwd()`)
- **File:** [data-loader.ts#L91](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L91)
- **Severity:** MEDIUM
- **Category:** SECURITY
- **Current Behavior:** Any file under the whole project working directory is eligible for reading if path is supplied.
- **Expected Behavior:** Restrict reads to explicit known safe ingestion paths (temp save path + specific spec/context directories).
- **Root Cause:** Allowlist includes full `process.cwd()` instead of narrower subpaths.
- **Suggested Fix:** Remove `process.cwd()` from allowlist and keep only concrete required directories.
- **Effort:** SMALL (<30 min)

### FINDING-04: Valid OpenCode data can be dropped when `exchanges` is empty
- **File:** [data-loader.ts#L158](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L158)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** Capture is accepted only if `conversation.exchanges.length > 0`; captures with useful `toolCalls` but no exchanges are treated as empty and fallback continues.
- **Expected Behavior:** Accept capture when either exchanges or tool/toolcall-derived data exists.
- **Root Cause:** Gate condition checks only `exchanges`.
- **Suggested Fix:** Change condition to allow `(exchanges.length > 0 || toolCalls.length > 0)`.
- **Effort:** TRIVIAL (<5 min)

### FINDING-05: File-format detection is heuristic and ambiguous
- **File:** [input-normalizer.ts#L223](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L223)
- **Severity:** HIGH
- **Category:** DESIGN
- **Current Behavior:** Presence of any one of `userPrompts`/`observations`/`recentContext` causes data to be treated as already normalized.
- **Expected Behavior:** Use explicit schema/version marker or strict structural checks before bypassing normalization.
- **Root Cause:** Format detection relies on weak presence checks, not schema validation.
- **Suggested Fix:** Require all expected arrays with `Array.isArray` (or a `formatVersion`) before short-circuiting normalization.
- **Effort:** MEDIUM (<2 hr)

### FINDING-06: Validation gap allows malformed “already-normalized” payloads
- **File:** [input-normalizer.ts#L291](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291)
- **Severity:** MEDIUM
- **Category:** BUG
- **Current Behavior:** `validateInputData` checks `observations` type but does not validate `userPrompts` or `recentContext` array types, while loader may skip normalization.
- **Expected Behavior:** All normalized-shape fields should be type-validated.
- **Root Cause:** Incomplete validation rules combined with heuristic format detection.
- **Suggested Fix:** Add strict type checks for `userPrompts` and `recentContext` (and item shape checks).
- **Effort:** SMALL (<30 min)

### FINDING-07: Type assertion can hide malformed loaded payloads
- **File:** [data-loader.ts#L116](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L116)
- **Severity:** LOW
- **Category:** QUALITY
- **Current Behavior:** Return value is force-cast with `as LoadedData`, even if normalized shape is incomplete.
- **Expected Behavior:** Runtime-validated `LoadedData` should be returned without unsafe cast.
- **Root Cause:** Type assertion bypasses structural guarantees.
- **Suggested Fix:** Add a runtime guard (or builder) that ensures required arrays/fields are present before return.
- **Effort:** SMALL (<30 min)

### FINDING-08: Lazy import cache can become stale after transient failure
- **File:** [data-loader.ts#L53](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L53)
- **Severity:** LOW
- **Category:** DESIGN
- **Current Behavior:** If dynamic import fails once, `_opencodeCapture` is set to `null` and never retried in-process.
- **Expected Behavior:** Retry import on subsequent calls (or after cooldown), because availability can change.
- **Root Cause:** Negative result is cached permanently.
- **Suggested Fix:** Cache only successful import, or add retry/backoff timestamp for `null` state.
- **Effort:** SMALL (<30 min)

### SUMMARY
- Total findings: 8
- Critical: 0, High: 3, Medium: 3, Low: 2
- Top 3 recommendations: 1) Make explicit `dataFile` mode fail-fast (no fallback on parse/validation/security errors). 2) Tighten format detection + validation (`userPrompts`/`recentContext` checks). 3) Accept OpenCode captures with `toolCalls` even when `exchanges` is empty.
<!-- /ANCHOR:table-of-contents -->
