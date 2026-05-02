OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a29-5d0a-7ce2-b2cc-5842450fd7b5
--------
user
# Role: Code Auditor (A1) — Iteration 005

## Mission
Deep dive into the P1-09 (file-format detection heuristic) finding and assess whether the deferred status is justified.

## Research Question
**Q2 (extended).** P1-09: file-format detection is heuristic and ambiguous — how bad is this in practice?

## Files to Examine
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` — Full read of format detection logic
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` — How format detection feeds into data loading
- Search for "format", "detect", "heuristic" in both files

## Known Context
- P1-09 was DEFERRED with status "unclear scope"
- File-format detection determines whether input is treated as JSON, stdin, manual, etc.
- Getting format wrong could route data through the wrong pipeline path

## Deliverable
1. Document the exact format detection algorithm with code references
2. Construct scenarios where the heuristic gives wrong results
3. Assess: How often would wrong detection occur with real CLI outputs?
4. Determine: Is "deferred" the right status, or should this be fixed for production?
5. Propose: Simple disambiguation rules that would make detection reliable
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m diving into Q2 now by reading both target files end-to-end and mapping the exact detection flow from `input-normalizer.ts` into `data-loader.ts`. Next I’ll extract line-level references, then pressure-test the heuristic with concrete misclassification scenarios.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Input Normalizer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. INPUT NORMALIZER
     7	// ───────────────────────────────────────────────────────────────
     8	// Validates, normalizes, and transforms raw input data into structured session format
     9	import { structuredLog } from './logger';
    10	import {
    11	  buildSpecAffinityTargets,
    12	  evaluateSpecAffinityText,
    13	  matchesSpecAffinityFilePath,
    14	  matchesSpecAffinityText,
    15	  normalizeText,
    16	} from './spec-affinity';
    17	
    18	// ───────────────────────────────────────────────────────────────
    19	// 2. TYPES
    20	// ───────────────────────────────────────────────────────────────
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Data Loader
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. DATA LOADER
     7	// ───────────────────────────────────────────────────────────────
     8	// Loads session data from file, native CLI capture, or hard-fail
     9	
    10	// ───────────────────────────────────────────────────────────────
    11	// 2. IMPORTS
    12	// ───────────────────────────────────────────────────────────────
    13	import fs from 'node:fs/promises';
    14	import path from 'node:path';
    15	import os from 'node:os';
    16	
    17	import { CONFIG } from '../core';
    18	import { structuredLog, sanitizePath } from '../utils';
    19	
    20	import {
exec
/bin/zsh -lc "rg -n \"format|detect|heuristic\" '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:8:// Validates, normalizes, and transforms raw input data into structured session format
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:33:/** A single observation record produced by transformation */
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:71:/** Raw input data that may be in manual or MCP-compatible format */
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:109:/** Normalized data in MCP-compatible format */
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:294: * Maps a technicalContext record to the structured TECHNICAL_CONTEXT array format.
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:382: * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:384: * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:414:    // F-16: Ensure FILES uses FileEntry format
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:446:  // F-16: Convert filesModified to FileEntry format with ACTION field
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:459:        // P0-2: Parse "path - description" compound format
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:538:  console.log('   \u2713 Transformed manual format to MCP-compatible structure');
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:699:  'configuration', 'core', 'create', 'data', 'debug', 'default', 'detection',
codex
I’ve pulled both files and confirmed `data-loader.ts` itself doesn’t contain explicit format heuristics; it assumes JSON file or native capture. I’m now extracting the exact detection helpers inside `input-normalizer.ts` (the truncated section) so we can analyze misrouting risk precisely.
exec
/bin/zsh -lc "rg -n \"detect|format|stdin|manual|json|parse|source\" '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
8:// Validates, normalizes, and transforms raw input data into structured session format
21:/** Data source type indicating where loaded data came from */
33:/** A single observation record produced by transformation */
41:  _manualDecision?: {
71:/** Raw input data that may be in manual or MCP-compatible format */
109:/** Normalized data in MCP-compatible format */
116:  _manualTriggerPhrases?: string[];
117:  _manualDecisions?: Array<string | DecisionItemObject>;
160:  _source: DataSource;
164:  _sourceTranscriptPath?: string;
165:  _sourceSessionId?: string;
166:  _sourceSessionCreated?: number;
167:  _sourceSessionUpdated?: number;
245:    _manualDecision: {
294: * Maps a technicalContext record to the structured TECHNICAL_CONTEXT array format.
348:  return JSON.parse(JSON.stringify(data)) as T;
382: * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.
384: * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.
414:    // F-16: Ensure FILES uses FileEntry format
423:      cloned._manualTriggerPhrases = [...triggerPhrases];
exec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | nl -ba -v1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '520,760p' '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | nl -ba -v520" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   520	  normalized.userPrompts = [{
   521	    prompt: sessionSummary || 'Manual context save',
   522	    timestamp: new Date().toISOString()
   523	  }];
   524	
   525	  normalized.recentContext = [{
   526	    request: sessionSummary || 'Manual context save',
   527	    learning: sessionSummary || ''
   528	  }];
   529	
   530	  if (triggerPhrases.length > 0) {
   531	    normalized._manualTriggerPhrases = [...triggerPhrases];
   532	  }
   533	
   534	  if (keyDecisions.length > 0) {
   535	    normalized._manualDecisions = keyDecisions.map((decision) => cloneInputData(decision));
   536	  }
   537	
   538	  console.log('   \u2713 Transformed manual format to MCP-compatible structure');
   539	  return normalized;
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Input Normalizer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. INPUT NORMALIZER
     7	// ───────────────────────────────────────────────────────────────
     8	// Validates, normalizes, and transforms raw input data into structured session format
     9	import { structuredLog } from './logger';
    10	import {
    11	  buildSpecAffinityTargets,
    12	  evaluateSpecAffinityText,
    13	  matchesSpecAffinityFilePath,
    14	  matchesSpecAffinityText,
    15	  normalizeText,
    16	} from './spec-affinity';
    17	
    18	// ───────────────────────────────────────────────────────────────
    19	// 2. TYPES
    20	// ───────────────────────────────────────────────────────────────
codex
I found the normalization and capture routing logic, but I haven’t yet seen explicit stdin/manual/JSON “format detection” in these two files. I’m tracing where they are called to locate the actual heuristic function so we can evaluate P1-09 accurately instead of guessing.
exec
/bin/zsh -lc "sed -n '340,560p' '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | nl -ba -v340" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   340	// ───────────────────────────────────────────────────────────────
   341	// 5. INPUT NORMALIZATION
   342	// ───────────────────────────────────────────────────────────────
   343	function cloneInputData<T>(data: T): T {
   344	  if (typeof structuredClone === 'function') {
   345	    return structuredClone(data);
   346	  }
   347	
   348	  return JSON.parse(JSON.stringify(data)) as T;
   349	}
   350	
   351	function normalizeFileEntryLike(file: Record<string, unknown>): FileEntry {
   352	  const action = typeof file.ACTION === 'string'
   353	    ? file.ACTION
   354	    : (typeof file.action === 'string' ? file.action : undefined);
   355	  const provenance = file._provenance === 'git' || file._provenance === 'spec-folder' || file._provenance === 'tool'
   356	    ? file._provenance
   357	    : undefined;
   358	  const modificationMagnitude = (
   359	    file.MODIFICATION_MAGNITUDE === 'trivial'
exec
/bin/zsh -lc "rg -n \"detect.*format|format.*detect|input format|stdin|manual|json mode|json\" '.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:573:    'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/scripts/README.md:38:- `package.json`
.opencode/skill/system-spec-kit/scripts/README.md:40:- `scripts-registry.json`
.opencode/skill/system-spec-kit/scripts/README.md:41:- `tsconfig.json`
.opencode/skill/system-spec-kit/scripts/README.md:111:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
.opencode/skill/system-spec-kit/scripts/tsconfig.json:2:  "extends": "../tsconfig.json",
.opencode/skill/system-spec-kit/scripts/utils/logger.ts:34:  const jsonOutput: string = JSON.stringify(logEntry);
.opencode/skill/system-spec-kit/scripts/utils/logger.ts:37:    console.error(jsonOutput);
.opencode/skill/system-spec-kit/scripts/utils/logger.ts:39:    console.warn(jsonOutput);
.opencode/skill/system-spec-kit/scripts/utils/logger.ts:41:    console.log(jsonOutput);
.opencode/skill/system-spec-kit/scripts/utils/logger.ts:43:    console.log(jsonOutput);
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:36:  if (!process.stdout.isTTY || !process.stdin.isTTY) {
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:45:    input: process.stdin,
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:68:  if (!process.stdout.isTTY || !process.stdin.isTTY) {
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:234:  const descriptionDoc = readFileSafe(path.join(resolvedSpecFolderPath, 'description.json'));
.opencode/skill/system-spec-kit/scripts/utils/spec-affinity.ts:251:      // Ignore malformed description.json for affinity hints.
.opencode/skill/system-spec-kit/scripts/ops/README.md:113:```json
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137:function buildLexicalDecisionObservations(collectedData: CollectedDataSubset<'_manualDecisions' | 'SPEC_FOLDER' | 'userPrompts' | 'observations'>): Array<{
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:183:  collectedData: CollectedDataSubset<'_manualDecisions' | 'SPEC_FOLDER' | 'userPrompts' | 'observations'> | null
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:185:  const manualDecisions = collectedData?._manualDecisions || [];
exec
/bin/zsh -lc "rg -n \"loadCollectedData\\(|normalizeInputData\\(|validateInputData\\(|transformOpencodeCapture\\(\" '.opencode/skill/system-spec-kit/scripts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:345:          return transformOpencodeCapture(conversation, specFolderArg, 'opencode-capture') as LoadedData;
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:377:          const data = transformOpencodeCapture(conversation, specFolderArg, 'claude-code-capture');
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:406:          const data = transformOpencodeCapture(conversation, specFolderArg, 'codex-cli-capture');
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:435:          const data = transformOpencodeCapture(conversation, specFolderArg, 'copilot-cli-capture');
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:464:          const data = transformOpencodeCapture(conversation, specFolderArg, 'gemini-cli-capture');
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:481:async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:520:      validateInputData(rawData, specFolderArg);
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:523:      const data: NormalizedData | RawInputData = normalizeInputData(rawData);
.opencode/skill/system-spec-kit/scripts/utils/README.md:223:**Symptom**: `normalizeInputData()` returns unexpected structure
.opencode/skill/system-spec-kit/scripts/utils/README.md:232:const normalized = normalizeInputData({
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:386:function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551:function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:806:function transformOpencodeCapture(
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:77:    await expect(loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:96:      await expect(loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:121:      await expect(loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:144:      await expect(loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:177:      const result = await loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:217:      const result = await loadCollectedData({
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:250:    await expect(loadCollectedData({
codex
I’ve confirmed one key point already: in these two files, the only real “format choice” heuristic is object-shape based (`normalizeInputData` fast-path vs manual transform). I’m doing one quick trace into `generate-context.ts` to verify where stdin-vs-file-vs-native capture is decided, so the risk call is complete.
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | nl -ba -v1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"stdin|dataFile|JSON|manual|detect|format|loadCollectedData\\(\" '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
32:  dataFile: string | null;
55:  <input>           Either a JSON data file path OR a spec folder path
56:                    - JSON mode: node generate-context.js data.json [spec-folder]
62:  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
63:  --json <string>   Read structured JSON from an inline string (preferred over stateless capture when structured data is available)
72:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
81:  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
89:  - Explicit JSON mode remains authoritative and ignores native capture preference.
92:  - Use --stdin or --json whenever the calling CLI can provide curated structured session data.
98:  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
101:JSON Data Format (with preflight/postflight and session/git support):
123:    "sessionSummary": "Implemented JSON-mode hybrid enrichment...",
149:  - git.headRef/commitRef: overrides auto-detected git provenance
185:  // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
229:    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
324:async function readAllStdin(stdin: NodeJS.ReadStream = process.stdin): Promise<string> {
327:    stdin.setEncoding('utf8');
328:    stdin.on('data', (chunk: string) => {
331:    stdin.on('end', () => resolve(buffer));
332:    stdin.on('error', reject);
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Generate Context
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. GENERATE CONTEXT
     7	// ───────────────────────────────────────────────────────────────
     8	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
     9	
    10	// Node stdlib
    11	import * as path from 'path';
    12	import * as fsSync from 'fs';
    13	
    14	// Internal modules
    15	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    16	import {
    17	  CONFIG,
    18	  findActiveSpecsDir,
    19	  getSpecsDirectories,
    20	  SPEC_FOLDER_PATTERN,
exec
/bin/zsh -lc "sed -n '260,760p' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | nl -ba -v260" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   260	      const parentSegment = absoluteSegments.at(-2);
   261	
   262	      if (
   263	        (lastSegment && SPEC_FOLDER_PATTERN.test(lastSegment)) ||
   264	        (parentSegment && lastSegment && SPEC_FOLDER_PATTERN.test(parentSegment) && SPEC_FOLDER_PATTERN.test(lastSegment))
   265	      ) {
   266	        resolvedNestedPath = rawArg;
   267	      }
   268	    }
   269	
   270	    let cleaned = rawArg;
   271	    if (cleaned.startsWith('.opencode/specs/')) {
   272	      cleaned = cleaned.slice('.opencode/specs/'.length);
   273	    } else if (cleaned.startsWith('specs/')) {
   274	      cleaned = cleaned.slice('specs/'.length);
   275	    }
   276	    cleaned = cleaned.replace(/\/+$/, '');
   277	
   278	    if (!resolvedNestedPath && explicitProjectScopedPath && fsSync.existsSync(explicitProjectScopedPath)) {
   279	      resolvedNestedPath = explicitProjectScopedPath;
codex
I now have the main detection points and I’m validating them against the test suite to estimate real-world frequency rather than just theoretical risk. I’ll pull the relevant test cases for `parseArguments` and `normalizeInputData` next.
exec
/bin/zsh -lc "rg -n \"parseArguments|normalizeInputData|manual|MCP|stdin|--json|--stdin|data file|spec folder|P1-09|heuristic|format\" '.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' '.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts' | nl -ba -v1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
13:import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
99:      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file/);
124:      })).rejects.toThrow(/EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file/);
225:      expect(result._manualTriggerPhrases).toEqual([
524:describe('FILES field transformation', () => {
578:    const normalized = normalizeInputData({
583:        narrative: 'Testing FILES transformation',
629:    const normalized = normalizeInputData({
634:        narrative: 'Testing FILES transformation',
658:describe('manual next-steps normalization', () => {
660:    const normalized = normalizeInputData({
691:    const normalized = normalizeInputData({
728:    const normalizedAgain = normalizeInputData({
740:    const normalized = normalizeInputData({
751:    const normalized = normalizeInputData({
766:    const normalized = normalizeInputData({
782:    const normalized = normalizeInputData({
810:    const normalized = normalizeInputData({
842:    const normalized = normalizeInputData({
884:    const normalized = normalizeInputData({
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────────
     2	// MODULE: Runtime Memory Input Tests
     3	// ───────────────────────────────────────────────────────────────────
     4	// TEST: Runtime Memory Inputs
     5	// Covers explicit data-file failures and next-steps normalization
     6	import fs from 'node:fs/promises';
     7	import os from 'node:os';
     8	import path from 'node:path';
     9	import { beforeEach, describe, expect, it, vi } from 'vitest';
    10	
    11	import { normalizeQualityAbortThreshold } from '../core/config';
    12	import { collectSessionData } from '../extractors/collect-session-data';
    13	import { normalizeInputData, transformOpencodeCapture } from '../utils/input-normalizer';
    14	
    15	const captureConversation = vi.fn(async () => null);
    16	const captureClaudeConversation = vi.fn(async () => null);
    17	const captureCodexConversation = vi.fn(async () => null);
    18	const captureCopilotConversation = vi.fn(async () => null);
    19	const captureGeminiConversation = vi.fn(async () => null);
    20	
exec
/bin/zsh -lc "sed -n '220,920p' '.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts' | nl -ba -v220" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   220	      });
   221	
   222	      expect(result._source).toBe('file');
   223	      expect(result.userPrompts?.[0]?.prompt).toContain('documented snake_case JSON contract');
   224	      expect(result.recentContext?.[0]?.request).toContain('snake_case JSON input handling');
   225	      expect(result._manualTriggerPhrases).toEqual([
   226	        'perfect session capturing',
   227	        'render quality',
   228	        'trigger phrases',
   229	      ]);
   230	      expect(captureConversation).not.toHaveBeenCalled();
   231	      expect(captureClaudeConversation).not.toHaveBeenCalled();
   232	      expect(captureCodexConversation).not.toHaveBeenCalled();
   233	      expect(captureCopilotConversation).not.toHaveBeenCalled();
   234	      expect(captureGeminiConversation).not.toHaveBeenCalled();
   235	    } finally {
   236	      await fs.rm(validFile, { force: true });
   237	    }
   238	  });
   239	});
exec
/bin/zsh -lc "sed -n '1,260p' '.opencode/skill/system-spec-kit/scripts/tests/generate-context-args.vitest.ts' | nl -ba -v1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
sed: .opencode/skill/system-spec-kit/scripts/tests/generate-context-args.vitest.ts: No such file or directory
exec
/bin/zsh -lc "rg -n \"parseArguments\\(|--stdin|--json|spec folder provided directly|dataFile|resolveCliSpecFolderReference|primaryArg\" '.opencode/skill/system-spec-kit/scripts/tests'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:88:  dataFile: string;
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:139:  const dataFile = path.join(dataDir, 'phase-013.json');
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:140:  writeJson(dataFile, {
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:188:  return { root, specRelativePath, specFolderPath, contextDir, dataDir, dbDir, dataFile };
.opencode/skill/system-spec-kit/scripts/tests/auto-detection-fixes.vitest.ts:376:      dataFile: harness.dataFile,
.opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh:88:json1=$(cd "$repo1" && bash "$create1" --json --phase --skip-branch --number 1 "Default phase count")
.opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh:114:base_json=$(cd "$repo2" && bash "$create2" --json --phase --skip-branch --number 2 --phases 1 --phase-names "foundation" "Parent append base")
.opencode/skill/system-spec-kit/scripts/tests/test-phase-system.sh:118:append_json=$(cd "$repo2" && bash "$create2" --json --phase --parent "$parent_rel" --phases 2 --phase-names "implementation,integration" "Parent append run")
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:65:      dataFile: undefined,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:73:    const dataFile = '/tmp/save-context-data.json';
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:75:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      dataFile,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:99:      dataFile: undefined,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:115:    await main(['--stdin', explicitSpecFolder], async () => payload);
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:119:      dataFile: undefined,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:141:    await main(['--json', payload]);
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:145:      dataFile: undefined,
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:158:  it('keeps target resolution and collectedData shape identical between --stdin and --json for the same payload', async () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:169:    await main(['--stdin'], async () => payload);
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:174:    await main(['--json', payload]);
exec
/bin/zsh -lc "ls '.opencode/skill/system-spec-kit/scripts/tests' | rg 'generate|args|cli'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
codex-cli-capture.vitest.ts
copilot-cli-capture.vitest.ts
gemini-cli-capture.vitest.ts
generate-context-cli-authority.vitest.ts
exec
/bin/zsh -lc "sed -n '1,320p' '.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts' | nl -ba -v1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"--stdin|--json|specFolder|dataFile|parseArguments|explicit|authoritative|target\" '.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 0ms:
rg: unrecognized flag --stdin|--json|specFolder|dataFile|parseArguments|explicit|authoritative|target
 succeeded in 0ms:
     1	// TEST: Generate Context CLI Authority
     2	// Ensures main() preserves explicit CLI targets into runWorkflow
     3	import path from 'node:path';
     4	import { fileURLToPath } from 'node:url';
     5	import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
     6	
     7	const harness = vi.hoisted(() => ({
     8	  runWorkflow: vi.fn(async () => undefined),
     9	  loadCollectedData: vi.fn(async () => ({ _source: 'file' })),
    10	  collectSessionData: vi.fn(async () => undefined),
    11	}));
    12	
    13	vi.mock('../core/workflow', () => ({
    14	  runWorkflow: harness.runWorkflow,
    15	}));
    16	
    17	vi.mock('../loaders', () => ({
    18	  loadCollectedData: harness.loadCollectedData,
    19	}));
    20	
exec
/bin/zsh -lc "rg -n \"heuristic\" '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:145:  - session.status: "IN_PROGRESS" | "COMPLETED" | "BLOCKED" (overrides heuristic)
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:146:  - session.completionPercent: 0-100 (overrides heuristic estimate)
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:148:  - session.messageCount/toolCount: overrides heuristic counts
exec
/bin/zsh -lc "rg -n \"P1-09|file-format detection|format detection|deferred|unclear scope\" '.opencode/specs' '.opencode/skill/system-spec-kit'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:155:  return status === 'indexed' || status === 'updated' || status === 'reinforced' || status === 'deferred';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:588:// P1-09 FIX: Hoist transport to module scope so shutdown handlers can close it
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:638:    // P1-09 FIX: Close MCP transport on shutdown
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1020:                    indexed: result.status === 'indexed' || result.status === 'deferred' ? 1 : 0,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1052:  // P1-09: Assign to module-level transport (not const) so shutdown handlers can close it
.opencode/skill/system-spec-kit/references/validation/validation_rules.md:340:- [ ] [P2] This can be deferred
.opencode/specs/system-spec-kit/z_archive/019-readme-and-summary-with-hvr/decision-record.md:161:**Details**: Each template gets an HVR annotation block placed immediately after the SPECKIT_TEMPLATE_SOURCE line. The block uses HTML comment syntax (`<!-- ... -->`), which is visible in source but does not render in Markdown previews. It contains: a reference to the canonical `hvr_rules.md`, the top 10 hard-blocker words to avoid, the 4 most common AI structural patterns to eliminate, and one template-specific guidance note. Maximum 30 lines per block. Automated enforcement deferred to a future spec.
.opencode/specs/system-spec-kit/z_archive/019-readme-and-summary-with-hvr/decision-record.md:235:The following decisions are deferred and will need their own ADRs when addressed:
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/124-automatic-archival-lifecycle-coverage.md:19:- Prompt: `Validate automatic archival subsystem vector/BM25 parity and protected tier behavior. Capture the evidence needed to prove Archived memory keeps metadata row with is_archived=1, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived. Return a concise user-facing pass/fail verdict with the main reason.`
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/124-automatic-archival-lifecycle-coverage.md:20:- Expected signals: Archived memory keeps metadata row with `is_archived=1`, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/124-automatic-archival-lifecycle-coverage.md:21:- Pass/fail: PASS if archive/unarchive parity holds for metadata/BM25, vector deletion occurs on archive, deferred vector rebuild behavior is explicit on unarchive, and protected-tier safeguards hold
.opencode/skill/system-spec-kit/manual_testing_playbook/05--lifecycle/124-automatic-archival-lifecycle-coverage.md:29:| NEW-124 | Automatic archival lifecycle coverage | Verify archive/unarchive keeps metadata rows while syncing BM25 and vec_memories behavior | `Validate automatic archival subsystem vector/BM25 parity and protected tier behavior. Capture the evidence needed to prove Archived memory keeps metadata row with is_archived=1, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Seed a normal-tier dormant memory and run archival scan 2) Verify `is_archived=1`, BM25 document removed, and vector row removed from `vec_memories` while `memory_index` row remains 3) Unarchive and verify BM25 is restored while vector re-embedding is deferred (no immediate vec row recreation) 4) Seed constitutional/critical memory and confirm archival scan skips protected tiers | Archived memory keeps metadata row with `is_archived=1`, BM25 artifacts are synchronized on archive/unarchive, vector rows are deleted on archive, and unarchive logs deferred vector re-embedding until next index scan; protected tiers are not auto-archived | Archival scan output + DB row checks (`memory_index`, `vec_memories`) + BM25 behavior evidence + unarchive deferred re-embedding log | PASS if archive/unarchive parity holds for metadata/BM25, vector deletion occurs on archive, deferred vector rebuild behavior is explicit on unarchive, and protected-tier safeguards hold | Inspect `archival-manager.ts` sync functions and protected-tier filtering logic |
.opencode/specs/03--commands-and-skills/020-cmd-create-readme-install-merger/checklist.md:26:| **P1** | Required | Must pass or be deferred with explicit approval |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:108:    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:224:          : `[memory-save] BM25 indexing failed (deferred path): ${message}`);
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:282:- [ ] Rate limiting (deferred to next sprint)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:111:  asyncEmbedding?: boolean; // When true, embedding generation is deferred (non-blocking)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:40:| `embedding-pipeline.ts`     | Embedding generation with persistent cache. Cache keys hash normalized content, matching the main and chunked embedding paths. Checks the embedding cache first, falls back to the provider, and stores new embeddings for future re-index. Async/deferred mode is opt-in. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:43:| `create-record.ts`          | Core record creation. Inserts into vector index (or deferred index), applies post-insert metadata, links related memories and indexes into BM25 when enabled. |
.opencode/skill/system-spec-kit/references/workflows/quick_reference.md:608:5. DOCUMENT any deferred P2 items with reason
codex
I’m now pulling the original P1-09 audit record from the spec artifacts so we can judge “deferred” against the documented rationale, not just the code.
exec
/bin/zsh -lc "rg -n \"P1-09|format detection|heuristic\" '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 2 in 0ms:
rg: .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog: IO error for operation on .opencode/specs/system-spec-kit/022-hybrid-rag-fusion/012-code-audit-per-feature-catalog: No such file or directory (os error 2)
exec
/bin/zsh -lc "rg -n \"P1-09|file-format|format detection|heuristic|deferred|unclear scope\" '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/009-embedding-optimization/spec.md:129:| Dependency | R-08 (unified signal extractor) | Provides aligned script-side topic conventions | Reuse the existing implementation-summary and heading heuristics instead of adding a new classifier |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/009-embedding-optimization/spec.md:140:- **OQ-002**: Broader document-embedding parity is deferred; this rollout covers the scripts indexer and `memory_save` only.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/009-embedding-optimization/plan.md:121:| R-08 (unified signal extractor) | Internal | Green | Existing summary and signal-extraction heuristics were sufficient for this phase |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/checklist.md:31:- [x] CHK-003 [P1] Dependencies identified and available (R-04 type consolidation remains intentionally deferred, not blocking) [Evidence: spec.md Section 6 lists R-04 dependency; implementation-summary.md Section 3 confirms FileChange/ObservationDetailed/ToolCounts/SpecFileEntry were canonicalized in session-types.ts (commit 37a75c17) while remaining 004 scope is deferred.]
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/spec.md:47:**Scope Boundary**: The deferred R-12 work still relied on draft assumptions that do not match the current repo.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/spec.md:54:The deferred R-12 work still relied on draft assumptions that do not match the current repo: there are no checked-in `.fingerprint` sidecars, the validator only partially enforced template structure, and runtime speckit prompts mostly pointed at template paths instead of carrying inline structure for the exact document being written. That gap let structurally invalid spec docs drift through normal validation and made post-write strict validation unreliable for agent workflows.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/spec.md:139:| Risk | Strict post-write validation blocks runtime workflows if legacy warning rules misfire on compliant docs | Medium | Align fixture content and stale section heuristics so a compliant fixture passes `--strict` |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/implementation-summary.md:46:1. While `004-type-consolidation` was nominally deferred, this phase's commit (`37a75c17`) did canonicalize `FileChange`, `ObservationDetailed`, `ToolCounts`, and `SpecFileEntry` into `session-types.ts` with re-exports in the original extractor files. The remaining 004 scope (CollectedDataFor* consolidation, index signature removal) is still deferred.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/implementation-summary.md:59:| Type canonicalization completed as side effect | The commit moved `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` to `session-types.ts` with re-exports. Remaining 004 scope (CollectedDataFor* consolidation, index signature removal) is deferred. |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/implementation-summary.md:82:1. Type canonicalization (REQ-001 of 004) was completed in this phase's commit. The remaining 004 scope, `CollectedDataFor*` consolidation (REQ-004) and index signature removal (REQ-005), is still deferred.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/research-pipeline-improvements.md:150:**Problem**: Single `CONFIDENCE` field mixes two questions: "how sure about the chosen option?" and "how sure about the captured rationale?" Current algorithm: normalize to 0-1, then heuristic ladder (70 if alternatives, 65 if rationale, else 50).
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/research-pipeline-improvements.md:154:- Observation decisions: parse explicit `confidence:` regex, else same heuristic
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/research-pipeline-improvements.md:446:R-01 (quality), R-05 (confidence), R-07 (phase), and R-09 (embedding) all propose moving from binary/heuristic scoring to multi-dimensional scored models. These should share infrastructure where possible — e.g., the unified topic extractor (R-08) feeds both phase labeling (R-07) and embedding weighting (R-09).
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/021-json-mode-hybrid-enrichment/spec.md:40:2. **Add explicit `session` and `git` JSON blocks** — the calling AI can provide authoritative metadata (`session.status`, `session.completionPercent`, `git.headRef`, etc.) that overrides heuristic calculations in the pipeline.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/tasks.md:39:- [ ] 3.8 File-format detection heuristic improvement (P1-09) [MEDIUM] — DEFERRED: unclear scope, dual-format support works
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/memory/16-03-26_22-23__template-compliance.md:5:description: "Let me identify all remaining deferred/outstanding items and fix them all. Outstanding items: 1. Level 1 + Level 3 compliant fixtures (P2 #10 — deferred as "future work") 2...."
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/memory/16-03-26_22-23__template-compliance.md:30:  - "let identify remaining deferred/outstanding"
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/memory/16-03-26_22-23__template-compliance.md:31:  - "identify remaining deferred/outstanding items"
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/memory/16-03-26_22-23__template-compliance.md:32:  - "remaining deferred/outstanding items fix"
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/012-template-compliance/memory/16-03-26_22-23__template-compliance.md:113:**Recent:** Let me first resolve the runtime agent path and understand the spec folder struc, Let me identify all remaining deferred/outstanding items and fix them all. Outs, Read agents/orchestrate.md
exec
/bin/zsh -lc "rg -n \"P1-09|format detection|heuristic\" '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion' | head -n 200" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:197:Four sub-components handle ongoing memory graph maintenance as a weekly batch cycle. Contradiction scanning finds memory pairs above 0.85 cosine similarity with keyword negation conflicts using a dual strategy: vector-based (cosine on sqlite-vec embeddings) plus heuristic fallback (word overlap). Both use a `hasNegationConflict()` keyword asymmetry check against approximately 20 negation terms (not, never, deprecated, replaced, and others). The system surfaces full contradiction clusters rather than isolated pairs via 1-hop causal edge neighbor expansion.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/decision-record.md:148:Audit found duplicated concerns in **token estimation** (`estimateTokenCount` / `estimateTokens` — `Math.ceil(text.length/4)` heuristic in tree-thinning.ts and token-metrics.ts) and **quality extraction** (`extractQualityScore` / `extractQualityFlags` in memory-indexer.ts and memory-parser.ts) logic across scripts and runtime modules. Duplicate implementations increase drift and inconsistent behavior risk.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C08.md:895:.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:80:| `ground-truth-feedback.ts` | Collects implicit feedback from user selections; deterministic heuristic judge for relevance labeling |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C08.md:898:.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:118:Expands ground truth datasets via two mechanisms: (1) implicit feedback from user memory selections persisted to the eval DB, and (2) a deterministic heuristic judge that scores query-memory relevance using lexical overlap with 4-band classification. Designed for replacement with a model-backed judge without changing persistence or agreement APIs. Added in Sprint 4.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C08.md:1200://   scores query-memory relevance using lexical overlap heuristics.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X04.md:300:.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:262:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X04.md:893:.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md:262:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C10.md:1367:// env var gating, batch computation, text similarity heuristic,
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/006-shared-memory-rollout/spec.md:90:- Unreviewed conflict heuristics that cannot be explained or reversed.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C06.md:257:.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:88:  // AI-WHY: Fallback: path-based heuristic (backward compatibility)
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md:207:| 7b | `007-sprint-6-indexing-and-graph/` | N2, R10 (37-53h heuristic; **ESTIMATION WARNING**: production quality 80-150h — see child spec for N2c 40-80h and R10 30-50h warnings) | Sprint 6a gate + feasibility spike | Pending (GATED) |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md:357:| PI-B3 | **Description-Based Spec Folder Discovery** — generate and cache a 1-sentence description per spec folder for search-time folder routing | At index time, generate `folder_description` = LLM summary of spec folder purpose; cache in spec folder index; use for pre-search folder routing. **LLM Fallback:** Spec-folder classification is async and fully decoupled from the save path. If LLM is unavailable (timeout >5s or error), fall back to folder-name-based heuristic classification. Classification results are cached per spec-folder with 24h TTL. | S3 | 4-8h | Low |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X07.md:367:.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/04-hybrid-search-pipeline.md:11:Five operational stages run between fusion and delivery. Stage A (query complexity routing, `SPECKIT_COMPLEXITY_ROUTER`) restricts active channels for simple queries to just vector and FTS, moderate queries add BM25, and complex queries get all five. Stage B (RSF shadow fusion, `SPECKIT_RSF_FUSION`) is historical and no longer active in runtime ranking; RSF artifacts are retained for compatibility/testing references only. Stage C (channel enforcement, `SPECKIT_CHANNEL_MIN_REP`) ensures every contributing channel has at least one result in top-k with a 0.005 quality floor. Stage D (confidence truncation, `SPECKIT_CONFIDENCE_TRUNCATION`) trims the irrelevant tail using a 2x-median gap elbow heuristic. Stage E (dynamic token budget, `SPECKIT_DYNAMIC_TOKEN_BUDGET`) computes tier-aware token limits (simple 1,500, moderate 2,500, complex 4,000).
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C14.md:88:An `encoding_intent` field classifies content type at index time as `document`, `code` or `structured_data` using heuristic scoring. The code path scores fenced code blocks, import/export/function keyword density and programming punctuation density. The structured data path scores YAML frontmatter, pipe tables and key-value patterns. The classification threshold is 0.4; anything below defaults to `document`.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/plan.md:558:| Sprint 6b: Graph Deepening (Sophistication, GATED) | Very High | 37-53h (heuristic) / 80-150h (production) |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/plan.md:561:| **Total (S0-S6a+S6b heuristic)** | | **348-523h** |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/plan.md:562:| **Total (S0-S7, S6b heuristic)** | | **393-585h** |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/plan.md:564:| **Grand Total with PageIndex (S0-S7, S6b heuristic)** | | **463-689h** |
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C05.md:162:An O(1) SHA-256 hash lookup in the `memory_index` table now catches exact duplicates within the same spec folder before the embedding step. When you re-save the same file, the system skips embedding generation entirely. Change one character, and embedding proceeds as normal. No false positives on distinct content because the check is cryptographic, not heuristic.
.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X06.md:469:    13	//   scores query-memory relevance using lexical overlap heuristics.
exec
/bin/zsh -lc "sed -n '30,80p' '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/tasks.md' | nl -ba -v30" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,90p' '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/implementation-summary.md' | nl -ba -v1" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    30	## Agent 3: Data Flow & Types (10 items) — 9 DONE, 1 DEFERRED
    31	
    32	- [x] 3.1 Decision dedup — suppress observation-type decisions when _manualDecisions exists (R-13 A0.7) [TRIVIAL]
    33	- [x] 3.2 Preserve file metadata through normalization (R-03 A2) [LOW]
    34	- [x] 3.3 Canonicalize type ownership into session-types.ts (R-04 A1) [LOW]
    35	- [x] 3.4 Blocker extraction content validation (R-13 B9) [LOW]
    36	- [x] 3.5 userPrompts/recentContext spec-folder relevance filtering (P0-05) [SMALL]
    37	- [x] 3.6 Relevance keywords over-broad fix (P1-07) [MEDIUM] — THIS SESSION: Added RELEVANCE_KEYWORD_STOPWORDS
    38	- [x] 3.7 Invalid timestamp RangeError guard (P1-08) [SMALL]
    39	- [ ] 3.8 File-format detection heuristic improvement (P1-09) [MEDIUM] — DEFERRED: unclear scope, dual-format support works
    40	- [x] 3.9 Long-path elision dedup key collision fix (P1-15) [MEDIUM] — F-20 full canonical path
    41	- [x] 3.10 HAS_POSTFLIGHT_DELTA sync with delta fields (P1-17) [SMALL]
    42	
    43	## Agent 4: Signal Extraction (6 items) — ALL DONE (prior sessions)
    44	
    45	- [x] 4.1 Trigger input sanitization — stop feeding raw file paths (R-11 A0.5) [SMALL]
    46	- [x] 4.2 Weighted embedding input — title + decisions×3 + outcomes×2 + general×1 (R-09 B3) [MEDIUM]
    47	- [x] 4.3 Route embedding through generateDocumentEmbedding() (R-09 B3) [SMALL]
    48	- [x] 4.4 Merge stopword lists — unify session-extractor and trigger-extractor sets (R-08 prep) [MEDIUM]
    49	- [x] 4.5 Add observation types: test, documentation, performance (R-07 C3) [LOW]
 succeeded in 0ms:
     1	<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/implementation-summary.md -->
     2	<!-- anchor:implementation-summary:start -->
     3	
     4	# Implementation Summary: Research Remediation — Wave 1
     5	
     6	<!-- anchor:overview:start -->
     7	## 1. OVERVIEW
     8	
     9	**Date**: 2026-03-19
    10	**Status**: Complete (40/41 items, 1 deferred)
    11	
    12	The research remediation Wave 1 plan called for 41 items across 5 sequential Codex agents. Upon systematic review, **37 items were already implemented** in prior sessions. This session completed the remaining 3 items and fixed 2 pre-existing test failures.
    13	<!-- anchor:overview:end -->
    14	
    15	<!-- anchor:changes:start -->
    16	## 2. CHANGES MADE (This Session)
    17	
    18	### P1-07: Relevance Keywords Over-Broad Fix
    19	**File**: `scripts/utils/input-normalizer.ts`
    20	- Added `RELEVANCE_KEYWORD_STOPWORDS` set (~130 generic terms like "session", "memory", "system", "file")
exec
/bin/zsh -lc "sed -n '40,115p' '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/remediation-manifest.md' | nl -ba -v40" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    40	**Remaining P1 items (from audit):**
    41	
    42	| ID | Finding | File(s) | Status | Effort |
    43	|----|---------|---------|--------|--------|
    44	| P1-01 | Prompt history is global, not session-scoped | opencode-capture.ts | DONE | MEDIUM |
    45	| P1-02 | Same prompt reused across multiple exchanges | opencode-capture.ts | DONE | SMALL |
    46	| P1-03 | Assistant pairing chooses first child response, not best/final | opencode-capture.ts | REMAINING | MEDIUM |
    47	| P1-04 | Multi-part assistant text not reassembled | opencode-capture.ts | REMAINING | MEDIUM |
    48	| P1-05 | One malformed session JSON aborts entire project scan | opencode-capture.ts | DONE | SMALL |
    49	| P1-07 | Relevance keywords are over-broad (false positives on generic segments) | input-normalizer.ts | DONE | MEDIUM |
    50	| P1-08 | Invalid timestamps throw `RangeError` and abort normalization | input-normalizer.ts | DONE | SMALL |
    51	| P1-09 | File-format detection is heuristic and ambiguous | input-normalizer.ts | DEFERRED | MEDIUM |
    52	| P1-10 | Custom renderer is not Mustache-compliant | template-renderer.ts | DONE | MEDIUM |
    53	| P1-11 | No escaping for `{{...}}` variable values -- template injection risk | template-renderer.ts | DONE | SMALL |
    54	| P1-12 | Tree-thinning merged content not carried forward to rendered output | workflow.ts | DONE | MEDIUM |
    55	| P1-15 | Long-path elision can merge distinct files into one dedup key | file-extractor.ts | DONE | MEDIUM |
    56	| P1-17 | `HAS_POSTFLIGHT_DELTA` can be false while delta fields are populated | collect-session-data.ts | DONE | SMALL |
    57	
    58	---
    59	
exec
/bin/zsh -lc "sed -n '300,380p' '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C04.md' | nl -ba -v300" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '390,455p' '.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/audits/audit-C04.md' | nl -ba -v390" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   300	- **Effort:** SMALL (<30 min)
   301	
   302	### FINDING-04: Valid OpenCode data can be dropped when `exchanges` is empty
   303	- **File:** [data-loader.ts#L158](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts#L158)
   304	- **Severity:** MEDIUM
   305	- **Category:** BUG
   306	- **Current Behavior:** Capture is accepted only if `conversation.exchanges.length > 0`; captures with useful `toolCalls` but no exchanges are treated as empty and fallback continues.
   307	- **Expected Behavior:** Accept capture when either exchanges or tool/toolcall-derived data exists.
   308	- **Root Cause:** Gate condition checks only `exchanges`.
   309	- **Suggested Fix:** Change condition to allow `(exchanges.length > 0 || toolCalls.length > 0)`.
   310	- **Effort:** TRIVIAL (<5 min)
   311	
   312	### FINDING-05: File-format detection is heuristic and ambiguous
   313	- **File:** [input-normalizer.ts#L223](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L223)
   314	- **Severity:** HIGH
   315	- **Category:** DESIGN
   316	- **Current Behavior:** Presence of any one of `userPrompts`/`observations`/`recentContext` causes data to be treated as already normalized.
   317	- **Expected Behavior:** Use explicit schema/version marker or strict structural checks before bypassing normalization.
   318	- **Root Cause:** Format detection relies on weak presence checks, not schema validation.
   319	- **Suggested Fix:** Require all expected arrays with `Array.isArray` (or a `formatVersion`) before short-circuiting normalization.
 succeeded in 0ms:
   390	- **Severity:** MEDIUM
   391	- **Category:** BUG
   392	- **Current Behavior:** Capture is accepted only if `conversation.exchanges.length > 0`; captures with useful `toolCalls` but no exchanges are treated as empty and fallback continues.
   393	- **Expected Behavior:** Accept capture when either exchanges or tool/toolcall-derived data exists.
   394	- **Root Cause:** Gate condition checks only `exchanges`.
   395	- **Suggested Fix:** Change condition to allow `(exchanges.length > 0 || toolCalls.length > 0)`.
   396	- **Effort:** TRIVIAL (<5 min)
   397	
   398	### FINDING-05: File-format detection is heuristic and ambiguous
   399	- **File:** [input-normalizer.ts#L223](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L223)
   400	- **Severity:** HIGH
   401	- **Category:** DESIGN
   402	- **Current Behavior:** Presence of any one of `userPrompts`/`observations`/`recentContext` causes data to be treated as already normalized.
   403	- **Expected Behavior:** Use explicit schema/version marker or strict structural checks before bypassing normalization.
   404	- **Root Cause:** Format detection relies on weak presence checks, not schema validation.
   405	- **Suggested Fix:** Require all expected arrays with `Array.isArray` (or a `formatVersion`) before short-circuiting normalization.
   406	- **Effort:** MEDIUM (<2 hr)
   407	
   408	### FINDING-06: Validation gap allows malformed “already-normalized” payloads
   409	- **File:** [input-normalizer.ts#L291](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts#L291)
tool cocoindex_code.search({"query":"Where does the code decide whether input payload is already normalized vs manual format? Look for userPrompts observations recentContext checks.","paths":".opencode/skill/system-spec-kit/scripts/*","limit":5})
cocoindex_code.search({"query":"Where does the code decide whether input payload is already normalized vs manual format? Look for userPrompts observations recentContext checks.","paths":".opencode/skill/system-spec-kit/scripts/*","limit":5}) failed in 7ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\npaths\n  Input should be a valid list [type=list_type, input_value='.opencode/skill/system-spec-kit/scripts/*', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"Where does code determine if input is already normalized versus manual format using userPrompts, observations, recentContext?","limit":5})
cocoindex_code.search({"query":"Where does code determine if input is already normalized versus manual format using userPrompts, observations, recentContext?","limit":5}) success in 298ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/input-normalizer.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/**\\n * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.\\n * @param data - The raw input data with camelCase or snake_case fields.\\n * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.\\n */\",\n      \"start_line\": 366,\n      \"end_line\": 370,\n      \"score\": 0.5937559710183802\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/018-generate-context-fix/scratch/legacy-memory-quarantine/17-12-25_07-34__generate-context-fix.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Decision 2: The normalizeInputData() function handles both manual simplified format and MCP format, so using the simplified format is preferred for readability.\\n\\n**Context**: Decision 2: The normalizeInputData() function handles both manual simplified format and MCP format, so using the simplified format is preferred for readability.\\n\\n**Timestamp**: 2025-12-17T07:34:35Z\\n\\n**Importance**: medium\",\n      \"start_line\": 207,\n      \"end_line\": 213,\n      \"score\": 0.5526745162187581\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/R02-opencode-capture-analysis.md\",\n      \"language\": \"markdown\",\n      \"content\": \"Source: `input-normalizer.ts:115-124,353-482`.\\n\\nMain behavior:\\n1. Reads `exchanges`, `toolCalls`, `metadata`, and `sessionTitle` from the capture.\\n2. Builds a relevance-keyword list from `specFolderHint` path segments.\\n3. Filters tool calls by file path/title substring matching when a spec folder hint is present.\\n4. Converts **all exchanges** into `userPrompts`.\\n5. Converts non-placeholder assistant responses into `feature` observations.\\n6. Converts filtered tool calls into `implementation` or generic `observation` observations.\\n7. Builds a single `recentContext` item from the first user request and last assistant response.\\n8. Builds `FILES` only from filtered `edit`/`write` tool calls.\\n\\nSource: `input-normalizer.ts:353-482`.\",\n      \"start_line\": 113,\n      \"end_line\": 125,\n      \"score\": 0.5252419600245659\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-multi-cli-parity/research.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### 4.4 Shared Normalization\\n\\nAll five capture modules return the same `OpencodeCapture` interface, which is then processed through `transformOpencodeCapture()` in `input-normalizer.ts`. This function:\\n\\n- Normalizes exchanges into `UserPrompt[]` and `Observation[]`\\n- Extracts file references from tool calls with `_provenance: 'tool'`\\n- Normalizes tool names (e.g., Copilot `view` -> observation title `Read ...`)\\n- Builds session metadata consistently regardless of source CLI\\n\\n[SOURCE: scripts/utils/input-normalizer.ts:733-736]\\n\\n---\",\n      \"start_line\": 94,\n      \"end_line\": 105,\n      \"score\": 0.4983454390466022\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/058-generate-context-modularization/research.md\",\n      \"language\": \"markdown\",\n      \"content\": \"#### Section 10: IMPLEMENTATION GUIDE EXTRACTION (8 functions)\\n- `extractImplementationGuide(collectedData, specFolder)`\\n- `extractFeatures(observations)`\\n- `extractKeyFiles(observations)`\\n- `extractExtensionPoints(observations)`\\n- `extractCommonPatterns(observations)`\\n- `formatImplementationGuide(features, keyFiles, extensionPoints, patterns)`\\n- `generateFeatureSection(feature)`\\n- `truncateText(text, maxLength)`\\n\\n#### Section 14: INPUT NORMALIZATION HELPERS (12 functions)\\n- `normalizeOpenCodeData(rawData)`\\n- `normalizeManualInput(manualInput)`\\n- `normalizeMessages(messages)`\\n- `normalizeMessage(msg)`\\n- `normalizeToolCall(tool)`\\n- `extractObservations(messages)`\\n- `extractUserPrompts(messages)`\\n- `buildFilesFromObservations(observations)`\\n- `inferContextType(messages, observations)`\\n- `generateSessionId()`\\n- `formatTimestamp(date)`\\n- `buildSpecFolderInfo(specFolderPath)`\",\n      \"start_line\": 92,\n      \"end_line\": 114,\n      \"score\": 0.4838032916359154\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/utils/input-normalizer.ts",
        "language": "typescript",
        "content": "/**\n * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.\n * @param data - The raw input data with camelCase or snake_case fields.\n * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.\n */",
        "start_line": 366,
        "end_line": 370,
        "score": 0.5937559710183802
      },
      {
        "file_path": "specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/018-generate-context-fix/scratch/legacy-memory-quarantine/17-12-25_07-34__generate-context-fix.md",
tool cocoindex_code.search({"query":"How does generate-context parse CLI args to choose between --stdin, --json, spec folder direct mode, and data file mode?","limit":5})
cocoindex_code.search({"query":"How does generate-context parse CLI args to choose between --stdin, --json, spec folder direct mode, and data file mode?","limit":5}) success in 271ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-stateless-quality-gates/tasks.md\",\n      \"language\": \"markdown\",\n      \"content\": \"**Phase 2b — `--stdin` / `--json` Support** (`generate-context.ts`):\\n\\n- [ ] T020 [P] Add `--stdin` flag to CLI argument parsing in `generate-context.ts` (~line 202)\\n- [ ] T021 [P] Add `--json <string>` flag to CLI argument parsing in `generate-context.ts` (~line 202)\\n- [ ] T022 Implement stdin reader: read all of `process.stdin`, parse as JSON, set `parsed._source = 'file'`, pass as `options.collectedData`\\n- [ ] T023 Implement inline JSON path: parse `--json` string value, set `_source = 'file'`, pass as `options.collectedData`\\n- [ ] T024 Add JSON schema validation: require minimum `specFolder` or sufficient content fields; emit descriptive error and exit non-zero on failure\\n- [ ] T025 Handle edge cases: empty stdin (error + non-zero exit), broken pipe (graceful error), non-JSON input (parse error to stderr)\\n- [ ] T026 [P] Add unit test: piped valid JSON via `--stdin` produces memory file (same output path as file mode)\",\n      \"start_line\": 58,\n      \"end_line\": 66,\n      \"score\": 0.6494508778328321\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-stateless-quality-gates/decision-record.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Decision\\n\\n**We chose**: Add `--stdin` and `--json <string>` flags to `generate-context.ts` that read JSON, set `_source = 'file'` on the parsed object, and pass it as `options.collectedData`.\\n\\n**How it works**: When `--stdin` is present, the CLI reads all of `process.stdin`, parses as JSON, validates the schema, sets `parsed._source = 'file'`, and passes to `runWorkflow(options)`. The `--json <string>` flag does the same with an inline string value. No temp files are created.\\n<!-- /ANCHOR:adr-002-decision -->\\n\\n---\\n\\n<!-- ANCHOR:adr-002-alternatives -->\",\n      \"start_line\": 150,\n      \"end_line\": 159,\n      \"score\": 0.6402931732927684\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/launch-session-audit.sh\",\n      \"language\": \"bash\",\n      \"content\": \"  # C20: generate-context.ts + spec folder detection\\n  launch_codex \\\"C20\\\" \\\"gpt-5.3-codex\\\" \\\"$SCRATCH_DIR/audit-C20.md\\\" \\\\\\n    \\\"You are a code auditor. Read EVERY LINE of these files:\\n1. $SCRIPTS_DIR/memory/generate-context.ts (502 lines) — CLI entry point\\n2. Look for a folder-detector.ts or spec-folder detection logic in $SCRIPTS_DIR/core/ or $SCRIPTS_DIR/utils/ or $SCRIPTS_DIR/loaders/\\n\\nAudit specifically:\\n1. CLI PARSING: How are CLI arguments parsed? Validation? Error messages?\\n2. SPEC FOLDER RESOLUTION: How is the spec folder path resolved? Relative/absolute handling?\\n3. JSON INPUT MODE: How does Mode 1 (JSON from /tmp) work? Security implications of reading from /tmp?\\n4. DIRECT MODE: How does Mode 2 (direct path) work? Path validation?\\n5. SUB-FOLDER SEARCH: How does bare subfolder ID auto-search work? Ambiguity handling?\\n6. ALIGNMENT VALIDATION: How is alignment between spec folder and session validated?\\n7. EXIT CODES: What exit codes are used? Are they documented and consistent?\",\n      \"start_line\": 590,\n      \"end_line\": 603,\n      \"score\": 0.6389654213808011\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/R01-code-path-trace.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| `FILES` | Preserved from JSON `FILES` or normalized from `filesModified` (`scripts/utils/input-normalizer.ts:237-242`) | Derived only from relevant edit/write tool calls (`scripts/utils/input-normalizer.ts:458-472`) | Empty |\\n| `preflight` / `postflight` | Available if JSON includes them (`generate-context.ts` help format `scripts/memory/generate-context.ts:73-101`) | Not populated | Not populated |\\n| `_manualDecisions` | Populated from JSON `keyDecisions` (`scripts/utils/input-normalizer.ts:279-280`) | Empty | Empty |\\n| `_manualTriggerPhrases` | Populated from JSON `triggerPhrases` (`scripts/utils/input-normalizer.ts:275-277`) | Empty | Empty |\\n| Spec-folder detection | Can use CLI arg or `collectedData.SPEC_FOLDER` | Mostly depends on CLI arg because collected data lacks `SPEC_FOLDER` | Depends on CLI arg, then later fallbacks |\",\n      \"start_line\": 180,\n      \"end_line\": 184,\n      \"score\": 0.6296480705905179\n    },\n    {\n      \"file_path\": \"specs/system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/references/memory/save_workflow.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Required JSON Fields\\n\\n| Field            | Type   | Required | Description               |\\n| ---------------- | ------ | -------- | ------------------------- |\\n| `SPEC_FOLDER`    | string | Yes      | Target spec folder name   |\\n| `recent_context` | array  | Yes      | Array of context objects  |\\n| `observations`   | array  | No       | Discoveries and learnings |\\n| `user_prompts`   | array  | No       | Original user requests    |\\n\\nIf both the JSON payload and the CLI provide a spec folder, the explicit CLI argument wins.\\n\\nIf that explicit CLI argument resolves to a phase folder, the command keeps that explicit target and saves into the selected phase folder's own `memory/` directory.\",\n      \"start_line\": 219,\n      \"end_line\": 230,\n      \"score\": 0.6287217641888656\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-stateless-quality-gates/tasks.md",
        "language": "markdown",
        "content": "**Phase 2b — `--stdin` / `--json` Support** (`generate-context.ts`):\n\n- [ ] T020 [P] Add `--stdin` flag to CLI argument parsing in `generate-context.ts` (~line 202)\n- [ ] T021 [P] Add `--json <string>` flag to CLI argument parsing in `generate-context.ts` (~line 202)\n- [ ] T022 Implement stdin reader: read all of `process.stdin`, parse as JSON, set `parsed._source = 'file'`, pass as `options.collectedData`\n- [ ] T023 Implement inline JSON path: parse `--json` string value, set `_source = 'file'`, pass as `options.collectedData`\n- [ ] T024 Add JSON schema validation: require minimum `specFolder` or sufficient content fields; emit descriptive error and exit non-zero on failure\n- [ ] T025 Handle edge cases: empty stdin (error + non-zero exit), broken pipe (graceful error), non-JSON input (parse error to stderr)\n- [ ] T026 [P] Add unit test: piped valid JSON via `--stdin` produces memory file (same output path as file mode)",
        "start_line": 58,
        "end_line": 66,
        "score": 0.6494508778328321
      },
      {
        "file_path": "specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-stateless-quality-gates/decision-record.md",
exec
/bin/zsh -lc "sed -n '1340,1525p' '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | nl -ba -v1340" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1340	    }
  1341	
  1342	    const narrativeObservations = (enriched.observations || []).filter(
  1343	      (observation) => observation?._synthetic !== true
  1344	    );
  1345	    // Synthetic observations provide file coverage but do not influence session narrative
  1346	    enriched._narrativeObservations = narrativeObservations;
  1347	
  1348	  } catch (err: unknown) {
  1349	    // Enrichment failure is non-fatal — proceed with whatever data we have
  1350	    console.warn(`   Warning: Stateless enrichment failed: ${err instanceof Error ? err.message : String(err)}`);
  1351	  }
  1352	
  1353	  return enriched;
  1354	}
  1355	
  1356	// ───────────────────────────────────────────────────────────────
  1357	// 2. MAIN WORKFLOW
  1358	// ───────────────────────────────────────────────────────────────
  1359	
exec
/bin/zsh -lc "rg -n \"collectedData|validateInputData|normalizeInputData|loadDataFn|loadCollectedData\" '.opencode/skill/system-spec-kit/scripts/core/workflow.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
81:import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';
99:  collectedData?: CollectedDataFull;
101:  loadDataFn?: () => Promise<CollectedDataFull>;
104:    collectedData: CollectedDataFull | null,
824:  collectedData: CollectedDataFull,
827:  const rawClassification = readNamedObject(collectedData, 'memory_classification', 'memoryClassification');
832:    readString(collectedData, fallbackType, 'memory_type', 'memoryType'),
874:  collectedData: CollectedDataFull,
878:  const rawDedup = readNamedObject(collectedData, 'session_dedup', 'sessionDedup');
929:function buildCausalLinksContext(collectedData: CollectedDataFull): CausalLinksContext {
930:  const rawCausalLinks = readNamedObject(collectedData, 'causal_links', 'causalLinks');
1157:  collectedData: CollectedDataFull,
1161:  const enriched: CollectedDataFull = { ...collectedData };
1180:      const gitPayload = (collectedData as Record<string, unknown>).git as Record<string, unknown> | undefined;
1202:      // Use spec summary if collectedData summary is missing or generic
1234:  collectedData: CollectedDataFull,
1240:  if (collectedData._source === 'file') {
1241:    return enrichFileSourceData(collectedData, specFolder, projectRoot);
1244:  const enriched: CollectedDataFull = { ...collectedData };
1295:      // Use spec summary if collectedData summary is missing or generic
exec
/bin/zsh -lc "sed -n '1525,1705p' '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | nl -ba -v1525" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  1525	        for (const label of filtered.matchedPatterns) {
  1526	          extractorPatternCounts.set(label, (extractorPatternCounts.get(label) ?? 0) + 1);
  1527	        }
  1528	      }
  1529	      return escapeLiteralAnchorExamples(filtered.cleanedText);
  1530	    };
  1531	    const cleanObservations = (
  1532	      observations: CollectedDataFull['observations'] | undefined
  1533	    ): CollectedDataFull['observations'] | undefined => {
  1534	      if (!observations) {
  1535	        return observations;
  1536	      }
  1537	      // F-23: Clean ALL observations, not just provenanced ones
  1538	      return observations.map((observation) => {
  1539	        if (!observation) {
  1540	          return observation;
  1541	        }
  1542	        return {
  1543	          ...observation,
  1544	          title: observation.title ? cleanContaminationText(observation.title) : observation.title,
codex
I’ve isolated the likely failure surface: the shape-based short-circuit in `normalizeInputData` plus validation gaps. I’m extracting a final set of tight line references now so the recommendation and status call are evidence-backed.
exec
/bin/zsh -lc "sed -n '380,438p' '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | nl -ba -v380" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '442,540p' '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | nl -ba -v442" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   380	
   381	/**
   382	 * Normalizes raw input data from manual or mixed formats into the MCP-compatible NormalizedData structure.
   383	 * @param data - The raw input data with camelCase or snake_case fields.
   384	 * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.
   385	 */
   386	function normalizeInputData(data: RawInputData): NormalizedData | RawInputData {
   387	  const nextSteps = Array.isArray(data.nextSteps)
   388	    ? data.nextSteps
   389	    : Array.isArray(data.next_steps)
   390	      ? data.next_steps
   391	      : [];
   392	  const userPrompts = Array.isArray(data.userPrompts)
   393	    ? data.userPrompts
   394	    : Array.isArray(data.user_prompts)
   395	      ? data.user_prompts
   396	      : [];
   397	  const recentContext = Array.isArray(data.recentContext)
   398	    ? data.recentContext
   399	    : Array.isArray(data.recent_context)
 succeeded in 0ms:
   442	  if (data.specFolder || data.spec_folder || data.SPEC_FOLDER) {
   443	    normalized.SPEC_FOLDER = (data.specFolder || data.spec_folder || data.SPEC_FOLDER) as string;
   444	  }
   445	
   446	  // F-16: Convert filesModified to FileEntry format with ACTION field
   447	  const filesModified = Array.isArray(data.filesModified)
   448	    ? data.filesModified
   449	    : Array.isArray(data.files_modified)
   450	      ? data.files_modified
   451	      : [];
   452	  if (Array.isArray(data.FILES) && data.FILES.length > 0) {
   453	    normalized.FILES = data.FILES.map((entry) => normalizeFileEntryLike(entry as unknown as Record<string, unknown>));
   454	  } else if (filesModified.length > 0) {
   455	    normalized.FILES = filesModified.map((entry: string | { path?: string; changes_summary?: string }) => {
   456	      let filePath: string;
   457	      let changesSummary: string;
   458	      if (typeof entry === 'string') {
   459	        // P0-2: Parse "path - description" compound format
   460	        const sepIdx = entry.indexOf(' - ');
   461	        if (sepIdx > 0 && (entry.substring(0, sepIdx).includes('.') || entry.substring(0, sepIdx).includes('/'))) {
exec
/bin/zsh -lc "sed -n '551,640p' '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | nl -ba -v551" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   551	function validateInputData(data: RawInputData, specFolderArg: string | null = null): void {
   552	  const errors: string[] = [];
   553	
   554	  if (typeof data !== 'object' || data === null) {
   555	    throw new Error('Input validation failed: data must be a non-null object');
   556	  }
   557	
   558	  if (specFolderArg === null && !data.specFolder && !data.spec_folder && !data.SPEC_FOLDER) {
   559	    if (!data.userPrompts && !data.user_prompts && !data.observations && !data.recentContext && !data.recent_context) {
   560	      errors.push('Missing required field: specFolder (or use CLI argument)');
   561	    }
   562	  }
   563	
   564	  if (data.triggerPhrases !== undefined && !Array.isArray(data.triggerPhrases)) {
   565	    errors.push('triggerPhrases must be an array');
   566	  }
   567	  if (data.trigger_phrases !== undefined && !Array.isArray(data.trigger_phrases)) {
   568	    errors.push('trigger_phrases must be an array');
   569	  }
   570	
exec
/bin/zsh -lc "sed -n '283,321p' '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts' | nl -ba -v283" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   283	function inferPreferredCaptureSourceFromEnv(env: NodeJS.ProcessEnv = process.env): CaptureDataSource | null {
   284	  const explicit = normalizePreferredCaptureSource(env.SYSTEM_SPEC_KIT_CAPTURE_SOURCE);
   285	  if (explicit) {
   286	    return explicit;
   287	  }
   288	
   289	  if (hasTruthyEnvKey(env, ['CODEX_SHELL', 'CODEX_CI', 'CODEX_INTERNAL_ORIGINATOR_OVERRIDE'])) {
   290	    return 'codex-cli-capture';
   291	  }
   292	
   293	  if (hasTruthyEnvKey(env, ['COPILOT_SESSION'])) {
   294	    return 'copilot-cli-capture';
   295	  }
   296	
   297	  if (hasTruthyEnvKey(env, ['CLAUDECODE', 'CLAUDE_CODE', 'CLAUDE_CODE_SESSION', 'CLAUDE_CODE_ENTRYPOINT'])) {
   298	    return 'claude-code-capture';
   299	  }
   300	
   301	  if (hasTruthyEnvKey(env, ['GEMINI_CLI', 'GEMINI_SESSION_ID'])) {
   302	    return 'gemini-cli-capture';
exec
/bin/zsh -lc "sed -n '481,575p' '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts' | nl -ba -v481" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '394,441p' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | nl -ba -v394" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   481	async function loadCollectedData(options?: LoadOptions): Promise<LoadedData> {
   482	  const dataFile = options?.dataFile !== undefined ? options.dataFile : CONFIG.DATA_FILE;
   483	  const specFolderArg = options?.specFolderArg !== undefined ? options.specFolderArg : CONFIG.SPEC_FOLDER_ARG;
   484	  const preferredCaptureSource = options?.preferredCaptureSource !== undefined
   485	    ? options.preferredCaptureSource
   486	    : inferPreferredCaptureSourceFromEnv();
   487	  const sessionId = options?.sessionId ?? null;
   488	
   489	  // Priority 1: Data file provided via command line
   490	  if (dataFile) {
   491	    try {
   492	      // SEC-001: Path traversal mitigation (CWE-22)
   493	      // Use os.tmpdir() for cross-platform temp directory support
   494	      // Also include /tmp for macOS where /tmp symlinks to /private/tmp
   495	      const tmpDir: string = os.tmpdir();
   496	      const dataFileAllowedBases: string[] = [
   497	        tmpDir,
   498	        '/tmp',           // macOS: symlink to /private/tmp
   499	        '/private/tmp',   // macOS: actual tmp location
   500	        process.cwd(),
 succeeded in 0ms:
   394	async function parseArguments(
   395	  argv: string[] = process.argv.slice(2),
   396	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
   397	): Promise<ParsedCliArguments> {
   398	  // Extract --session-id <uuid> from argv before positional parsing
   399	  let sessionId: string | null = null;
   400	  const filteredArgv: string[] = [];
   401	  for (let i = 0; i < argv.length; i++) {
   402	    if (argv[i] === '--session-id' && i + 1 < argv.length) {
   403	      sessionId = argv[i + 1].trim() || null;
   404	      i++; // skip the value
   405	    } else {
   406	      filteredArgv.push(argv[i]);
   407	    }
   408	  }
   409	
   410	  const [primaryArg, secondaryArg] = filteredArgv;
   411	  if (!primaryArg) {
   412	    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
   413	  }
exec
/bin/zsh -lc "sed -n '246,311p' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | nl -ba -v246" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   246	function resolveCliSpecFolderReference(rawArg: string): string | null {
   247	  const folderName = path.basename(rawArg);
   248	  const explicitProjectScopedPath = !rawArg.endsWith('.json') && (
   249	    rawArg.startsWith('specs/') ||
   250	    rawArg.startsWith('.opencode/specs/')
   251	  )
   252	    ? path.join(CONFIG.PROJECT_ROOT, rawArg)
   253	    : null;
   254	
   255	  let resolvedNestedPath: string | null = null;
   256	  if (!rawArg.endsWith('.json')) {
   257	    if (path.isAbsolute(rawArg)) {
   258	      const absoluteSegments = rawArg.replace(/\/+$/, '').split(/[\\/]/).filter(Boolean);
   259	      const lastSegment = absoluteSegments.at(-1);
   260	      const parentSegment = absoluteSegments.at(-2);
   261	
   262	      if (
   263	        (lastSegment && SPEC_FOLDER_PATTERN.test(lastSegment)) ||
   264	        (parentSegment && lastSegment && SPEC_FOLDER_PATTERN.test(parentSegment) && SPEC_FOLDER_PATTERN.test(lastSegment))
   265	      ) {
exec
/bin/zsh -lc "sed -n '336,389p' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | nl -ba -v336" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   336	function parseStructuredJson(rawJson: string, sourceLabel: '--stdin' | '--json'): Record<string, unknown> {
   337	  if (rawJson.trim().length === 0) {
   338	    throw new Error(`${sourceLabel} requires a non-empty JSON object`);
   339	  }
   340	
   341	  let parsed: unknown;
   342	  try {
   343	    parsed = JSON.parse(rawJson);
   344	  } catch (error: unknown) {
   345	    const errMsg = error instanceof Error ? error.message : String(error);
   346	    throw new Error(`Invalid JSON provided via ${sourceLabel}: ${errMsg}`);
   347	  }
   348	
   349	  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
   350	    throw new Error(`${sourceLabel} requires a JSON object payload`);
   351	  }
   352	
   353	  return parsed as Record<string, unknown>;
   354	}
   355	
exec
/bin/zsh -lc "rg -n \"userPrompts.*not|recentContext.*not|Input validation failed|user_prompts must be an array|recent_context must be an array|normalizeInputData\\(\\{["'^'"\\n]*userPrompts\" '.opencode/skill/system-spec-kit/scripts/tests'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc "rg -n \"userPrompts:\\s*'|userPrompts:\\s*\\{|recentContext:\\s*'|recentContext:\\s*\\{\" '.opencode/skill/system-spec-kit/scripts/tests'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"user_prompts must be an array|recent_context must be an array|triggerPhrases must be an array|keyDecisions must be an array|Input validation failed\" '.opencode/skill/system-spec-kit/scripts/tests'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

 exited 1 in 0ms:

exec
/bin/zsh -lc "rg -n \"normalizeInputData\\(\\{[\\s\\S]*?sessionSummary[\\s\\S]*?userPrompts\" '.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:

exec
/bin/zsh -lc "rg -n \"sessionSummary|session_summary|userPrompts|recentContext|user_prompts|recent_context|keyDecisions|key_decisions|filesModified\" '.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
171:      sessionSummary: 'Completed runtime hardening.',
199:      session_summary: 'Verified generated memory render quality in snake_case JSON mode.',
201:      user_prompts: [
207:      recent_context: [
210:          learning: 'The documented user_prompts and recent_context fields must survive normalization.',
223:      expect(result.userPrompts?.[0]?.prompt).toContain('documented snake_case JSON contract');
224:      expect(result.recentContext?.[0]?.request).toContain('snake_case JSON input handling');
305:    expect(result.userPrompts?.[0]?.prompt).toContain('009-perfect-session-capturing');
337:    expect(result.userPrompts?.[0]?.prompt).toContain('009-perfect-session-capturing');
586:      userPrompts: [{
590:      recentContext: [{
637:      userPrompts: [{
641:      recentContext: [{
662:      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
670:      recentContext: [{
699:      userPrompts: [{
703:      recentContext: [{
742:      sessionSummary: 'Session with no next steps.',
753:      sessionSummary: 'Both fields present.',
768:      sessionSummary: 'Edge case: empty first step.',
codex
**Assessment**
P1-09 should not stay deferred for production. The ambiguity is real, it can silently drop important fields, and the fix is small.

1. **Exact detection algorithm (with refs)**
- CLI mode routing is decided before loader/normalizer:
  - `--stdin` / `--json` => parse JSON object explicitly, require target spec folder, pass preloaded data (`_source: 'file'`): [generate-context.ts:336](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:336), [generate-context.ts:356](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:356), [generate-context.ts:415](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:415)
  - positional arg that looks like spec folder => stateless mode: [generate-context.ts:246](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:246), [generate-context.ts:420](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:420)
  - else => treat as `dataFile`: [generate-context.ts:435](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:435)
- In loader, `dataFile` path does `read -> JSON.parse -> validateInputData -> normalizeInputData`: [data-loader.ts:489](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:489), [data-loader.ts:520](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:520), [data-loader.ts:523](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:523)
- The core heuristic is here:
  - If **any one** of `userPrompts/user_prompts/observations/recentContext/recent_context` exists, treat as already structured (fast path): [input-normalizer.ts:409](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:409)
  - Otherwise run manual transformation (`sessionSummary`, `keyDecisions`, `filesModified`, etc.): [input-normalizer.ts:446](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:446), [input-normalizer.ts:486](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:486), [input-normalizer.ts:494](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:494)

2. **Wrong-result scenarios**
- Mixed payload (one structured key + manual fields) gets fast-pathed, so manual transforms can be skipped (notably `sessionSummary`, `keyDecisions`, `filesModified` conversion path): [input-normalizer.ts:409](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:409), [input-normalizer.ts:446](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:446)
- `userPrompts` / `recentContext` camelCase are not validated in `validateInputData`, so malformed-but-truthy values can still influence routing: [input-normalizer.ts:551](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551), [input-normalizer.ts:629](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:629)
- Positional arg ambiguity: spec-folder-vs-data-file classification depends partly on `.endsWith('.json')`, so odd filenames can route wrong mode: [generate-context.ts:248](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:248), [generate-context.ts:304](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:304)

3. **How often in real CLI outputs**
- Low for first-party “happy paths”:
  - explicit `--stdin` / `--json` is deterministic and bypasses loader normalization path.
  - native capture path does not rely on this manual/structured heuristic.
- Medium for ad-hoc JSON-file integrations (AI-generated payloads), because partial/mixed shapes are common and current routing is permissive.
- Current tests mainly cover pure manual or pure structured shapes, not ambiguous mixed-shape misroutes: [runtime-memory-inputs.vitest.ts:167](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:167), [runtime-memory-inputs.vitest.ts:195](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:195)

4. **Deferred vs fix now**
- Historical defer rationale exists (“unclear scope, dual-format support works”): [tasks.md:39](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/tasks.md:39), [implementation-summary.md:47](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/implementation-summary.md:47)
- Given silent misrouting risk + low implementation effort, this should be moved from deferred to active P1 for production.

5. **Simple disambiguation rules**
- Add explicit discriminator: `inputFormat: 'structured-v1' | 'manual-v1' | 'capture-v1'` (or `formatVersion`).
- If discriminator absent:
  - structured only if required arrays are actually arrays (`observations`, `userPrompts|user_prompts`, `recentContext|recent_context`)
  - manual if manual-only fields present (`sessionSummary`, `keyDecisions`, `filesModified`, etc.)
  - mixed/ambiguous => hard error with actionable message
- Extend validation to camelCase `userPrompts` and `recentContext` types, not just snake_case.
- Keep a telemetry/log warning whenever fallback heuristic is used.


tokens used
181,303
**Assessment**
P1-09 should not stay deferred for production. The ambiguity is real, it can silently drop important fields, and the fix is small.

1. **Exact detection algorithm (with refs)**
- CLI mode routing is decided before loader/normalizer:
  - `--stdin` / `--json` => parse JSON object explicitly, require target spec folder, pass preloaded data (`_source: 'file'`): [generate-context.ts:336](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:336), [generate-context.ts:356](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:356), [generate-context.ts:415](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:415)
  - positional arg that looks like spec folder => stateless mode: [generate-context.ts:246](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:246), [generate-context.ts:420](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:420)
  - else => treat as `dataFile`: [generate-context.ts:435](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:435)
- In loader, `dataFile` path does `read -> JSON.parse -> validateInputData -> normalizeInputData`: [data-loader.ts:489](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:489), [data-loader.ts:520](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:520), [data-loader.ts:523](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:523)
- The core heuristic is here:
  - If **any one** of `userPrompts/user_prompts/observations/recentContext/recent_context` exists, treat as already structured (fast path): [input-normalizer.ts:409](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:409)
  - Otherwise run manual transformation (`sessionSummary`, `keyDecisions`, `filesModified`, etc.): [input-normalizer.ts:446](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:446), [input-normalizer.ts:486](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:486), [input-normalizer.ts:494](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:494)

2. **Wrong-result scenarios**
- Mixed payload (one structured key + manual fields) gets fast-pathed, so manual transforms can be skipped (notably `sessionSummary`, `keyDecisions`, `filesModified` conversion path): [input-normalizer.ts:409](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:409), [input-normalizer.ts:446](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:446)
- `userPrompts` / `recentContext` camelCase are not validated in `validateInputData`, so malformed-but-truthy values can still influence routing: [input-normalizer.ts:551](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:551), [input-normalizer.ts:629](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:629)
- Positional arg ambiguity: spec-folder-vs-data-file classification depends partly on `.endsWith('.json')`, so odd filenames can route wrong mode: [generate-context.ts:248](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:248), [generate-context.ts:304](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:304)

3. **How often in real CLI outputs**
- Low for first-party “happy paths”:
  - explicit `--stdin` / `--json` is deterministic and bypasses loader normalization path.
  - native capture path does not rely on this manual/structured heuristic.
- Medium for ad-hoc JSON-file integrations (AI-generated payloads), because partial/mixed shapes are common and current routing is permissive.
- Current tests mainly cover pure manual or pure structured shapes, not ambiguous mixed-shape misroutes: [runtime-memory-inputs.vitest.ts:167](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:167), [runtime-memory-inputs.vitest.ts:195](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:195)

4. **Deferred vs fix now**
- Historical defer rationale exists (“unclear scope, dual-format support works”): [tasks.md:39](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/tasks.md:39), [implementation-summary.md:47](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/022-research-remediation/implementation-summary.md:47)
- Given silent misrouting risk + low implementation effort, this should be moved from deferred to active P1 for production.

5. **Simple disambiguation rules**
- Add explicit discriminator: `inputFormat: 'structured-v1' | 'manual-v1' | 'capture-v1'` (or `formatVersion`).
- If discriminator absent:
  - structured only if required arrays are actually arrays (`observations`, `userPrompts|user_prompts`, `recentContext|recent_context`)
  - manual if manual-only fields present (`sessionSummary`, `keyDecisions`, `filesModified`, etc.)
  - mixed/ambiguous => hard error with actionable message
- Extend validation to camelCase `userPrompts` and `recentContext` types, not just snake_case.
- Keep a telemetry/log warning whenever fallback heuristic is used.

