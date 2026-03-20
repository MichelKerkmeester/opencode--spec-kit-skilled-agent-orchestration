OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.3-codex
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019d0a3f-064b-71b2-9d03-60875f8dcc74
--------
user
# Role: Code Auditor (A1) — Iteration 007

## Mission
Design the automated live-proof protocol.

## Research Question
**Q6.** What would a minimum viable automated live-proof protocol look like per CLI?

## Files to Examine
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` — CLI entry point, argument parsing
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` — WorkflowResult interface (what gets returned)
- `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` — Per-CLI capture dispatch

## Deliverable
1. Document generate-context.ts CLI interface: what arguments, what modes, what output
2. For each CLI, describe the minimal test: what input creates a valid capture, what command runs the save
3. Define proof artifact schema: what fields must be captured from WorkflowResult
4. Propose a prove-cli-parity.sh script outline
5. Estimate: How many CLI invocations needed for the 8-artifact MVP (4 CLIs x 2 modes)?
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: code_mode ready
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’ll inspect the three specified files and extract the CLI contract, capture modes, and workflow return fields so we can define a concrete live-proof protocol per CLI. I’ll start by reading those files with line numbers and then synthesize an MVP script outline.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Workflow
     3	// ───────────────────────────────────────────────────────────────
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. WORKFLOW
     7	// ───────────────────────────────────────────────────────────────
     8	// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
     9	// Node stdlib
    10	import * as path from 'node:path';
    11	import * as fsSync from 'node:fs';
    12	import * as crypto from 'node:crypto';
    13	
    14	// Internal modules
    15	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
    16	import {
    17	  extractConversations,
    18	  extractDecisions,
    19	  extractDiagrams,
    20	  extractPhasesFromData,
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts' | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
codex
I’ve pulled the top sections; next I’m drilling into the argument parser and native-capture dispatch paths deeper in those files so the protocol reflects the actual runtime behavior.
exec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     611 .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
    2477 .opencode/skill/system-spec-kit/scripts/core/workflow.ts
     584 .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
    3672 total
exec
/bin/zsh -lc "rg -n \"parse|argv|--stdin|--json|session-id|runWorkflow|loadCollectedData|Direct mode|JSON mode|Output:\" '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"capture|native|source|order|preferred|loadCollectedData|switch|if \\(|return \\{|exchanges|toolCalls\" '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
8:// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
25:import { runWorkflow } from '../core/workflow';
26:import { loadCollectedData } from '../loaders';
56:                    - JSON mode: node generate-context.js data.json [spec-folder]
57:                    - Direct mode: node generate-context.js specs/001-feature/
58:                    - Direct mode: node generate-context.js .opencode/specs/001-feature/
62:  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
63:  --json <string>   Read structured JSON from an inline string (preferred over stateless capture when structured data is available)
64:  --session-id <uuid>  Explicit session ID for deterministic Claude Code transcript selection
72:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
73:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
80:Output:
89:  - Explicit JSON mode remains authoritative and ignores native capture preference.
92:  - Use --stdin or --json whenever the calling CLI can provide curated structured session data.
159:if (process.argv.includes('--help') || process.argv.includes('-h')) {
336:function parseStructuredJson(rawJson: string, sourceLabel: '--stdin' | '--json'): Record<string, unknown> {
341:  let parsed: unknown;
343:    parsed = JSON.parse(rawJson);
349:  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
353:  return parsed as Record<string, unknown>;
 succeeded in 0ms:
8:// Loads session data from file, native CLI capture, or hard-fail
46:  _source?: DataSource;
54:/** OpenCode capture module interface (lazy-loaded) */
56:  captureConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
59:/** Claude Code capture module interface (lazy-loaded) */
61:  captureClaudeConversation(
72:/** Codex CLI capture module interface (lazy-loaded) */
74:  captureCodexConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
77:/** Copilot CLI capture module interface (lazy-loaded) */
79:  captureCopilotConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
82:/** Gemini CLI capture module interface (lazy-loaded) */
84:  captureGeminiConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;
98:  if (_opencodeCapture === undefined) {
100:      _opencodeCapture = await import('../extractors/opencode-capture') as OpencodeCaptureMod;
103:      structuredLog('warn', 'opencode-capture library not available', {
113:  if (_claudeCodeCapture === undefined) {
115:      _claudeCodeCapture = await import('../extractors/claude-code-capture') as ClaudeCodeCaptureMod;
118:      structuredLog('warn', 'claude-code-capture library not available', {
128:  if (_codexCliCapture === undefined) {
130:      _codexCliCapture = await import('../extractors/codex-cli-capture') as CodexCliCaptureMod;
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | sed -n '320,611p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	
   321	  return null;
   322	}
   323	
   324	async function readAllStdin(stdin: NodeJS.ReadStream = process.stdin): Promise<string> {
   325	  return await new Promise<string>((resolve, reject) => {
   326	    let buffer = '';
   327	    stdin.setEncoding('utf8');
   328	    stdin.on('data', (chunk: string) => {
   329	      buffer += chunk;
   330	    });
   331	    stdin.on('end', () => resolve(buffer));
   332	    stdin.on('error', reject);
   333	  });
   334	}
   335	
   336	function parseStructuredJson(rawJson: string, sourceLabel: '--stdin' | '--json'): Record<string, unknown> {
   337	  if (rawJson.trim().length === 0) {
   338	    throw new Error(`${sourceLabel} requires a non-empty JSON object`);
   339	  }
exec
/bin/zsh -lc "rg -n \"async function runWorkflow|return \\{\\s*contextDir|contextFilename|writtenFiles|memoryId|indexingStatus|stats:\" '.opencode/skill/system-spec-kit/scripts/core/workflow.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
120:  contextFilename: string;
122:  writtenFiles: string[];
124:  memoryId: number | null;
126:  indexingStatus: WorkflowIndexingStatus;
128:  stats: {
561:function buildMemoryDashboardTitle(memoryTitle: string, specFolderName: string, contextFilename: string): string {
563:  const fileStem = path.basename(contextFilename, path.extname(contextFilename));
887:        const memoryId = readString(item, '', 'id', 'memory_id', 'memoryId');
888:        if (memoryId.length === 0) {
892:          MEMORY_ID: memoryId,
1367:async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
2260:  const writtenFiles: string[] = await writeFilesAtomically(contextDir, files);
2264:  const ctxFileWritten = writtenFiles.includes(ctxFilename);
2348:  let memoryId: number | null = null;
2349:  let indexingStatus: WorkflowIndexingStatus | null = null;
2355:    indexingStatus = {
2357:      memoryId,
2361:    await updateMetadataEmbeddingStatus(contextDir, indexingStatus);
2384:        memoryId = await indexMemory(
2393:        if (memoryId !== null) {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts' | sed -n '320,584p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   320	  ];
   321	}
   322	
   323	async function attemptNativeCapture(
   324	  source: CaptureDataSource,
   325	  specFolderArg: string | null | undefined,
   326	  sessionId?: string | null,
   327	): Promise<LoadedData | null> {
   328	  const projectRoot = CONFIG.PROJECT_ROOT;
   329	
   330	  switch (source) {
   331	    case 'opencode-capture': {
   332	      console.log('   🔍 Attempting OpenCode session capture...');
   333	      const opencodeCapture = await getOpencodeCapture();
   334	      if (!opencodeCapture) {
   335	        structuredLog('debug', 'OpenCode capture not available', { projectRoot });
   336	        console.log('   ⚠️  OpenCode capture not available');
   337	        return null;
   338	      }
   339	
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '1360,1465p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/core/workflow.ts' | sed -n '2328,2477p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  2328	  log('Step 9.5: State embedded in memory file (V13.0)');
  2329	
  2330	  // Step 10: Success confirmation
  2331	  log('Context saved successfully!\n');
  2332	  log(`Location: ${contextDir}\n`);
  2333	  log('Files created:');
  2334	  for (const [filename, content] of Object.entries(files)) {
  2335	    const lines = content.split('\n').length;
  2336	    log(`  - ${filename} (${lines} lines)`);
  2337	  }
  2338	  log();
  2339	  log('Summary:');
  2340	  log(`  - ${conversations.MESSAGES.length} messages captured`);
  2341	  log(`  - ${decisions.DECISIONS.length} key decisions documented`);
  2342	  log(`  - ${diagrams.DIAGRAMS.length} diagrams preserved`);
  2343	  log(`  - Session duration: ${sessionData.DURATION}\n`);
  2344	
  2345	  // Step 11: Semantic memory indexing
  2346	  log('Step 11: Indexing semantic memory...');
  2347	
 succeeded in 0ms:
  1360	/**
  1361	 * Main workflow orchestrator: coordinates data loading, extraction, rendering,
  1362	 * quality scoring, and atomic file output to produce a memory context file.
  1363	 *
  1364	 * @param options - Configuration controlling data source, spec folder, and output behavior.
  1365	 * @returns A WorkflowResult describing the output files, resolved spec folder, and stats.
  1366	 */
  1367	async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
  1368	  return withWorkflowRunLock(async () => {
  1369	    const {
  1370	      dataFile,
  1371	      specFolderArg,
  1372	      collectedData: preloadedData,
  1373	      loadDataFn,
  1374	      collectSessionDataFn,
  1375	      silent = false
  1376	    } = options;
  1377	
  1378	    const hasDirectDataContext = (
  1379	      dataFile !== undefined ||
codex
I now have the parser/dispatch blocks; I’m checking each CLI capture extractor to pin down the truly minimal “valid capture” condition per runtime, instead of guessing from the loader alone.
exec
/bin/zsh -lc "rg --files '.opencode/skill/system-spec-kit/scripts/extractors' | rg 'capture'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
exec
/bin/zsh -lc "rg -n \"export async function capture|session|transcript|history|exchange|toolCall|return null|projectRoot|maxExchanges\" '.opencode/skill/system-spec-kit/scripts/extractors'/*capture*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:8:// Captures Gemini transcript data from ~/.gemini/tmp for
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:33:const GEMINI_HISTORY = path.join(GEMINI_HOME, 'history');
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:60:  toolCalls?: GeminiToolCall[];
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:64:  sessionId?: string;
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:79:function transcriptTimestamp(value?: string): number {
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:172:function buildSessionTitle(exchanges: CaptureExchange[], sessionId: string): string {
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:173:  const firstPrompt = exchanges.find((exchange) => (exchange.userInput || '').trim().length > 0);
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:178:  return `Gemini CLI session ${sessionId.slice(0, 8)}`;
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:185:function getMatchingProjectDirs(projectRoot: string): string[] {
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:197:    const projectRootPath = path.join(GEMINI_HISTORY, entry.name, '.project_root');
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:198:    if (!fsSync.existsSync(projectRootPath)) {
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:203:      const value = fsSync.readFileSync(projectRootPath, 'utf-8').trim();
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:204:      if (isSameWorkspacePath(projectRoot, value)) {
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:215:async function resolveSession(projectRoot: string): Promise<{ sessionPath: string; session: GeminiSession } | null> {
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:216:  const matchingDirs = getMatchingProjectDirs(projectRoot);
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:218:    return null;
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:221:  let newestMatch: { sessionPath: string; session: GeminiSession; sortTimestamp: number } | null = null;
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:229:    const sessionFiles = fsSync.readdirSync(chatsDir)
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:230:      .filter((entry) => entry.startsWith('session-') && entry.endsWith('.json'))
.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:233:    for (const sessionPath of sessionFiles) {
exec
/bin/zsh -lc "wc -l '.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     860 .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
     731 .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
     471 .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
     414 .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
     394 .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
    2870 total
exec
/bin/zsh -lc "rg -n \"export async function capture|const .*HOME|const .*SESSION|return null|resolve|projectRoot|workspace|history|transcript\" '.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts' '.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:8:// Captures Codex transcript data from ~/.codex/sessions for
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:29:const CODEX_HOME = path.join(
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:33:const CODEX_SESSIONS = path.join(CODEX_HOME, 'sessions');
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:91:function transcriptTimestamp(value?: string): number {
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:111:          return null;
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:122:    return null;
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:268:async function resolveTranscript(
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:269:  projectRoot: string,
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:270:): Promise<{ transcriptPath: string; transcriptLines: unknown[] } | null> {
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:271:  const candidates = listTranscriptCandidates(CODEX_SESSIONS);
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:273:    return null;
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:286:    const transcriptLines = await readJsonl(candidatePath);
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:287:    if (transcriptLines.length === 0) {
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:291:    const sessionMeta = transcriptLines
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:295:    if (isSameWorkspacePath(projectRoot, sessionMeta?.payload?.cwd)) {
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:296:      return { transcriptPath: candidatePath, transcriptLines };
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:300:  return null;
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:307:export async function captureCodexConversation(
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:309:  projectRoot: string,
.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:311:  const resolved = await resolveTranscript(projectRoot);
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts' | sed -n '24,45p;268,320p;307,320p;432,460p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    24	
    25	/* ───────────────────────────────────────────────────────────────
    26	   1. INTERFACES
    27	------------------------------------------------------------------*/
    28	
    29	const CODEX_HOME = path.join(
    30	  process.env.HOME || process.env.USERPROFILE || '',
    31	  '.codex',
    32	);
    33	const CODEX_SESSIONS = path.join(CODEX_HOME, 'sessions');
    34	const MAX_EXCHANGES_DEFAULT = 20;
    35	
    36	type CodexSessionMetaPayload = {
    37	  id?: string;
    38	  cwd?: string;
    39	  timestamp?: string;
    40	};
    41	
    42	type CodexSessionMetaEntry = {
    43	  type?: string;
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts' | sed -n '24,80p;389,420p;525,540p;688,718p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    24	} from '../utils';
    25	import { sanitizeToolDescription, sanitizeToolInputPaths } from '../utils/tool-sanitizer';
    26	
    27	/* ───────────────────────────────────────────────────────────────
    28	   1. CONSTANTS
    29	------------------------------------------------------------------*/
    30	
    31	const CLAUDE_HOME = path.join(
    32	  process.env.HOME || process.env.USERPROFILE || '',
    33	  '.claude',
    34	);
    35	const CLAUDE_PROJECTS = path.join(CLAUDE_HOME, 'projects');
    36	const CLAUDE_HISTORY = path.join(CLAUDE_HOME, 'history.jsonl');
    37	const MAX_EXCHANGES_DEFAULT = 20;
    38	
    39	/* ───────────────────────────────────────────────────────────────
    40	   2. INTERFACES
    41	------------------------------------------------------------------*/
    42	
    43	type ClaudeHistoryEntry = {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts' | sed -n '24,45p;185,220p;262,276p;354,382p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    24	
    25	/* ───────────────────────────────────────────────────────────────
    26	   1. INTERFACES
    27	------------------------------------------------------------------*/
    28	
    29	const GEMINI_HOME = path.join(
    30	  process.env.HOME || process.env.USERPROFILE || '',
    31	  '.gemini',
    32	);
    33	const GEMINI_HISTORY = path.join(GEMINI_HOME, 'history');
    34	const GEMINI_TMP = path.join(GEMINI_HOME, 'tmp');
    35	const MAX_EXCHANGES_DEFAULT = 20;
    36	
    37	type GeminiMessageContentBlock = {
    38	  text?: string;
    39	};
    40	
    41	type GeminiToolCall = {
    42	  id?: string;
    43	  name?: string;
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts' | sed -n '24,45p;149,210p;374,404p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    24	
    25	/* ───────────────────────────────────────────────────────────────
    26	   1. INTERFACES
    27	------------------------------------------------------------------*/
    28	
    29	const COPILOT_HOME = path.join(
    30	  process.env.HOME || process.env.USERPROFILE || '',
    31	  '.copilot',
    32	);
    33	const COPILOT_SESSION_STATE = path.join(COPILOT_HOME, 'session-state');
    34	const MAX_EXCHANGES_DEFAULT = 20;
    35	
    36	type CopilotWorkspace = {
    37	  id?: string;
    38	  cwd?: string;
    39	  git_root?: string;
    40	  updated_at?: string;
    41	};
    42	
    43	type CopilotEvent = {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts' | sed -n '124,170p;394,420p;724,766p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   124	
   125	/* ───────────────────────────────────────────────────────────────
   126	   2. STORAGE PATHS
   127	------------------------------------------------------------------*/
   128	
   129	const OPENCODE_STORAGE: string = path.join(
   130	  process.env.HOME || process.env.USERPROFILE || '',
   131	  '.local/share/opencode/storage',
   132	);
   133	
   134	const PROMPT_HISTORY: string = path.join(
   135	  process.env.HOME || process.env.USERPROFILE || '',
   136	  '.local/state/opencode/prompt-history.jsonl',
   137	);
   138	
   139	const nativeSessionMessageCache = new Map<string, MessageInfo[]>();
   140	const nativeMessagePartCache = new Map<string, Record<string, unknown>[]>();
   141	
   142	/* ───────────────────────────────────────────────────────────────
   143	   3. UTILITY FUNCTIONS
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts' | sed -n '240,330p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	    };
   241	  }
   242	
   243	  return { valid: true };
   244	}
   245	
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
codex
I’m now mapping each runtime’s on-disk transcript prerequisites (workspace-match + non-empty events/messages), so the proof protocol can assert pass/fail deterministically per CLI.
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts' | sed -n '215,255p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   215	async function resolveSession(projectRoot: string): Promise<{ sessionPath: string; session: GeminiSession } | null> {
   216	  const matchingDirs = getMatchingProjectDirs(projectRoot);
   217	  if (matchingDirs.length === 0) {
   218	    return null;
   219	  }
   220	
   221	  let newestMatch: { sessionPath: string; session: GeminiSession; sortTimestamp: number } | null = null;
   222	
   223	  for (const matchingDir of matchingDirs) {
   224	    const chatsDir = path.join(GEMINI_TMP, matchingDir, 'chats');
   225	    if (!fsSync.existsSync(chatsDir)) {
   226	      continue;
   227	    }
   228	
   229	    const sessionFiles = fsSync.readdirSync(chatsDir)
   230	      .filter((entry) => entry.startsWith('session-') && entry.endsWith('.json'))
   231	      .map((entry) => path.join(chatsDir, entry));
   232	
   233	    for (const sessionPath of sessionFiles) {
   234	      try {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts' | sed -n '210,250p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   210	
   211	  const { eventsPath, workspace } = resolved;
   212	  const rawEvents = await readJsonl(eventsPath);
   213	  if (rawEvents.length === 0) {
   214	    return null;
   215	  }
   216	
   217	  const events = rawEvents
   218	    .filter((entry): entry is CopilotEvent => !!entry && typeof entry === 'object')
   219	    .map((entry) => entry as CopilotEvent);
   220	  const pendingPrompts: PendingPrompt[] = [];
   221	  const exchanges: CaptureExchange[] = [];
   222	  const toolCalls: CaptureToolCall[] = [];
   223	  const toolCallIndexById = new Map<string, number>();
   224	  let discoveredSessionId = workspace.id || path.basename(path.dirname(eventsPath));
   225	  let sessionCreatedAt = '';
   226	  let sessionUpdatedAt = '';
   227	
   228	  for (const event of events) {
   229	    if (event.type === 'session.start') {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts' | sed -n '292,388p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts' | sed -n '240,274p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	  }
   241	
   242	  const candidates: string[] = [];
   243	  const stack: string[] = [rootDir];
   244	
   245	  while (stack.length > 0) {
   246	    const currentDir = stack.pop();
   247	    if (!currentDir) {
   248	      continue;
   249	    }
   250	
   251	    const entries = fsSync.readdirSync(currentDir, { withFileTypes: true });
   252	    for (const entry of entries) {
   253	      const entryPath = path.join(currentDir, entry.name);
   254	      if (entry.isDirectory()) {
   255	        stack.push(entryPath);
   256	        continue;
   257	      }
   258	
   259	      if (entry.isFile() && entry.name.startsWith('rollout-') && entry.name.endsWith('.jsonl')) {
 succeeded in 0ms:
   292	  const transcriptPaths = (await Promise.all(
   293	    projectDirs.map(async (projectDir) =>
   294	      (await fs.readdir(projectDir))
   295	        .filter((entry) => entry.endsWith('.jsonl'))
   296	        .map((entry) => path.join(projectDir, entry))
   297	    )
   298	  )).flat();
   299	
   300	  const candidates: TranscriptCandidate[] = [];
   301	  for (const transcriptPath of transcriptPaths) {
   302	    const transcriptLines = await readJsonl(transcriptPath);
   303	    if (transcriptLines.length === 0) {
   304	      continue;
   305	    }
   306	
   307	    const bounds = collectTranscriptEventBounds(transcriptLines, transcriptPath);
   308	    candidates.push({
   309	      transcriptPath,
   310	      transcriptLines,
   311	      sessionId: bounds.sessionId,
exec
/bin/zsh -lc "ls -1 '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' '.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
codex
I’m also running a semantic cross-check with CocoIndex to make sure we didn’t miss any alternate workflow return or capture-order implementations outside these files.
tool cocoindex_code.search({"query":"WorkflowResult interface returned by runWorkflow includes contextDir specFolder contextFilename writtenFiles memoryId indexingStatus stats","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"WorkflowResult interface returned by runWorkflow includes contextDir specFolder contextFilename writtenFiles memoryId indexingStatus stats","limit":5,"refresh_index":false}) success in 241ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/core/workflow.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/** Result object returned after a successful workflow execution. */\\nexport interface WorkflowResult {\\n  /** Absolute path to the memory output directory. */\\n  contextDir: string;\\n  /** Relative path of the resolved spec folder. */\\n  specFolder: string;\\n  /** Basename of the spec folder (e.g., \\\"015-outsourced-agent-handback\\\"). */\\n  specFolderName: string;\\n  /** Filename of the primary context markdown file written. */\\n  contextFilename: string;\\n  /** List of absolute paths for all files written during this run. */\\n  writtenFiles: string[];\\n  /** Numeric memory ID from indexing, or null if indexing was skipped. */\\n  memoryId: number | null\",\n      \"start_line\": 107,\n      \"end_line\": 120,\n      \"score\": 0.7683525580593038\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/research/agent-outputs/stateless-research/R01-code-path-trace.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### 3. Workflow handoff\\n`runWorkflow()` loads collected data, then resolves the spec folder separately through `detectSpecFolder(collectedData, { specFolderArg })` (`scripts/core/workflow.ts:424-448`). Because stateless mode still passes `specFolderArg`, folder selection remains anchored to the CLI target even though the collected data usually lacks `SPEC_FOLDER`.\\n\\nThe workflow's parallel extraction stage then calls `collectSessionData(collectedData, specFolderName)` with the resolved relative spec-folder name (`scripts/core/workflow.ts:488-506`).\",\n      \"start_line\": 39,\n      \"end_line\": 42,\n      \"score\": 0.6756149049480129\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"      const contextDir = path.join(specFolderPath, 'memory');\\n      fs.mkdirSync(contextDir, { recursive: true });\\n      fs.writeFileSync(\\n        path.join(specFolderPath, 'spec.md'),\\n        [\\n          '---',\\n          'title: \\\"Spec: To promote a memory to constitutional tier (always surfaced)\\\"',\\n          '---',\\n          '# Spec',\\n        ].join('\\\\n'),\\n        'utf-8'\\n      );\\n\\n      workflowHarness.specFolderPath = specFolderPath;\\n      workflowHarness.contextDir = contextDir;\\n      CONFIG.TEMPLATE_DIR = templatesDir;\\n\\n      const { runWorkflow } = await import('../core/workflow');\",\n      \"start_line\": 266,\n      \"end_line\": 283,\n      \"score\": 0.6124085602905733\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/core/workflow.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"// ───────────────────────────────────────────────────────────────\\n// 2. MAIN WORKFLOW\\n// ───────────────────────────────────────────────────────────────\\n\\n/**\\n * Main workflow orchestrator: coordinates data loading, extraction, rendering,\\n * quality scoring, and atomic file output to produce a memory context file.\\n *\\n * @param options - Configuration controlling data source, spec folder, and output behavior.\\n * @returns A WorkflowResult describing the output files, resolved spec folder, and stats.\\n */\",\n      \"start_line\": 1213,\n      \"end_line\": 1223,\n      \"score\": 0.5993699868682096\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"      workflowHarness.specFolderPath = specFolderPath;\\n      workflowHarness.contextDir = contextDir;\\n      CONFIG.TEMPLATE_DIR = templatesDir;\\n\\n      const { runWorkflow } = await import('../core/workflow');\\n      const result = await runWorkflow({\\n        collectedData: {\\n          _source: 'codex-cli-capture',\\n          _toolCallCount: 2,\\n          userPrompts: [\\n            {\\n              prompt: 'Validate stateless tool evidence without edited files.',\\n              timestamp: '2026-03-15T13:00:00Z',\\n            },\\n          ],\\n          recentContext: [\\n            {\\n              request: 'Validate stateless tool evidence without edited files.'\",\n      \"start_line\": 585,\n      \"end_line\": 602,\n      \"score\": 0.5945041439067591\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/core/workflow.ts",
        "language": "typescript",
        "content": "/** Result object returned after a successful workflow execution. */\nexport interface WorkflowResult {\n  /** Absolute path to the memory output directory. */\n  contextDir: string;\n  /** Relative path of the resolved spec folder. */\n  specFolder: string;\n  /** Basename of the spec folder (e.g., \"015-outsourced-agent-handback\"). */\n  specFolderName: string;\n  /** Filename of the primary context markdown file written. */\n  contextFilename: string;\n  /** List of absolute paths for all files written during this run. */\n  writtenFiles: string[];\n  /** Numeric memory ID from indexing, or null if indexing was skipped. */\n  memoryId: number | null",
        "start_line": 107,
        "end_line": 120,
        "score": 0.7683525580593038
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/research/agent-outputs/stateless-research/R01-code-path-trace.md",
tool cocoindex_code.search({"query":"loadCollectedData preferred native capture order opencode claude codex copilot gemini","paths":".opencode/skill/system-spec-kit/scripts/loaders/*","languages":"typescript","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"loadCollectedData preferred native capture order opencode claude codex copilot gemini","paths":".opencode/skill/system-spec-kit/scripts/loaders/*","languages":"typescript","limit":5,"refresh_index":false}) failed in 2ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 2 validation errors for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type\npaths\n  Input should be a valid list [type=list_type, input_value='.opencode/skill/system-s...c-kit/scripts/loaders/*', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
tool cocoindex_code.search({"query":"loadCollectedData preferred native capture order opencode claude codex copilot gemini","paths":[".opencode/skill/system-spec-kit/scripts/loaders/*"],"languages":["typescript"],"limit":5,"refresh_index":false})
cocoindex_code.search({"query":"loadCollectedData preferred native capture order opencode claude codex copilot gemini","paths":[".opencode/skill/system-spec-kit/scripts/loaders/*"],"languages":["typescript"],"limit":5,"refresh_index":false}) success in 363ms:
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
tool cocoindex_code.search({"query":"DEFAULT_NATIVE_CAPTURE_ORDER opencode-capture claude-code-capture codex-cli-capture copilot-cli-capture gemini-cli-capture","limit":5,"refresh_index":false})
cocoindex_code.search({"query":"DEFAULT_NATIVE_CAPTURE_ORDER opencode-capture claude-code-capture codex-cli-capture copilot-cli-capture gemini-cli-capture","limit":5,"refresh_index":false}) success in 139ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/research.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 14. API Reference\\n\\n### Capture Functions\\n\\n| Function | Module | Signature |\\n|----------|--------|-----------|\\n| `captureConversation` | opencode-capture | `(maxMessages: number, directory: string) => Promise<ConversationCapture>` |\\n| `captureClaudeConversation` | claude-code-capture | `(maxExchanges: number, projectRoot: string, sessionHints?: ClaudeSessionHints) => Promise<OpencodeCapture \\\\| null>` |\\n| `captureCodexConversation` | codex-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \\\\| null>` |\\n| `captureCopilotConversation` | copilot-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \\\\| null>` |\\n| `captureGeminiConversation` | gemini-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \\\\| null>` |\\n\\n---\",\n      \"start_line\": 289,\n      \"end_line\": 301,\n      \"score\": 0.7193035588098393\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/loaders/data-loader.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"const DEFAULT_NATIVE_CAPTURE_ORDER: readonly CaptureDataSource[] = [\\n  'opencode-capture',\\n  'claude-code-capture',\\n  'codex-cli-capture',\\n  'copilot-cli-capture',\\n  'gemini-cli-capture',\\n];\\n\\nconst NATIVE_CAPTURE_ENV_ALIASES: Readonly<Record<string, CaptureDataSource>> = {\\n  opencode: 'opencode-capture',\\n  'opencode-capture': 'opencode-capture',\\n  claude: 'claude-code-capture',\\n  'claude-code': 'claude-code-capture',\\n  'claude-code-capture': 'claude-code-capture',\\n  codex: 'codex-cli-capture',\\n  'codex-cli': 'codex-cli-capture',\\n  'codex-cli-capture': 'codex-cli-capture',\\n  copilot: 'copilot-cli-capture',\\n  'copilot-cli': 'copilot-cli-capture',\\n  'copilot-cli-capture': 'copilot-cli-capture',\\n  gemini: 'gemini-cli-capture',\\n  'gemini-cli': 'gemini-cli-capture',\\n  'gemini-cli-capture': 'gemini-cli-capture',\\n};\",\n      \"start_line\": 224,\n      \"end_line\": 247,\n      \"score\": 0.7174811389340903\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/research.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 4. Core Architecture\\n\\n### 4.1 Capture Modules\\n\\nEach CLI has a dedicated capture module at `scripts/extractors/`:\\n\\n| CLI | Capture Module | Main Function | Session Storage |\\n|-----|---------------|---------------|-----------------|\\n| **OpenCode** | `opencode-capture.ts` | `captureConversation()` | `~/.local/share/opencode/storage/` |\\n| **Claude Code** | `claude-code-capture.ts` | `captureClaudeConversation()` | `~/.claude/projects/` |\\n| **Codex CLI** | `codex-cli-capture.ts` | `captureCodexConversation()` | `~/.codex/sessions/` |\\n| **Copilot CLI** | `copilot-cli-capture.ts` | `captureCopilotConversation()` | `~/.copilot/session-state/` |\\n| **Gemini CLI** | `gemini-cli-capture.ts` | `captureGeminiConversation()` | `~/.gemini/history/` + `~/.gemini/tmp/` |\\n\\n[SOURCE: scripts/extractors/opencode-capture.ts:129-137, claude-code-capture.ts:26-31, codex-cli-capture.ts:25-29, copilot-cli-capture.ts:25-29, gemini-cli-capture.ts:25-30]\",\n      \"start_line\": 52,\n      \"end_line\": 66,\n      \"score\": 0.6583631034992479\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/loaders/data-loader.ts\",\n      \"language\": \"typescript\",\n      \"content\": \"/** Claude Code capture module interface (lazy-loaded) */\\ninterface ClaudeCodeCaptureMod {\\n  captureClaudeConversation(\\n    maxExchanges: number,\\n    projectRoot: string,\\n    sessionHints?: {\\n      expectedSessionId?: string | null;\\n      sessionStartTs?: number | null;\\n      invocationTs?: number | null;\\n    },\\n  ): Promise<OpencodeCapture | null>;\\n}\\n\\n/** Codex CLI capture module interface (lazy-loaded) */\\ninterface CodexCliCaptureMod {\\n  captureCodexConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;\\n}\\n\\n/** Copilot CLI capture module interface (lazy-loaded) */\\ninterface CopilotCliCaptureMod {\\n  captureCopilotConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;\\n}\\n\\n/** Gemini CLI capture module interface (lazy-loaded) */\\ninterface GeminiCliCaptureMod {\\n  captureGeminiConversation(maxExchanges: number, projectRoot: string): Promise<OpencodeCapture | null>;\\n}\",\n      \"start_line\": 59,\n      \"end_line\": 85,\n      \"score\": 0.6376368979643541\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/research.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 6. Constraints & Limitations\\n\\n### 6.1 Session Selection Asymmetry\\n\\nClaude Code capture implements a four-step fallback chain for session selection:\\n1. Exact `expectedSessionId` match\\n2. Active task lock (`.claude/tasks/`)\\n3. History timestamp ranking (not mtime)\\n4. Time-window rejection for stale transcripts\\n\\nThe other four CLIs use simpler strategies: Codex and Copilot use mtime-based freshness, Gemini uses `lastUpdated` metadata, and OpenCode uses native CLI commands. None of the non-Claude captures accept session hints.\\n\\n[SOURCE: claude-code-capture.ts:292-340, codex-cli-capture.ts:296-329, copilot-cli-capture.ts:159-206, gemini-cli-capture.ts:225-266]\\n\\n### 6.2 Source Provenance Metadata\\n\\nOnly the Claude Code capture module emits the four provenance fields:\\n- `_sourceTranscriptPath`\\n- `_sourceSessionId`\\n- `_sourceSessionCreated`\\n- `_sourceSessionUpdated`\\n\\nThe other four CLIs do not populate these fields in their metadata output.\\n\\n[SOURCE: claude-code-capture.ts:649-653]\",\n      \"start_line\": 143,\n      \"end_line\": 167,\n      \"score\": 0.6304616749220884\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-multi-cli-parity/research.md",
        "language": "markdown",
        "content": "## 14. API Reference\n\n### Capture Functions\n\n| Function | Module | Signature |\n|----------|--------|-----------|\n| `captureConversation` | opencode-capture | `(maxMessages: number, directory: string) => Promise<ConversationCapture>` |\n| `captureClaudeConversation` | claude-code-capture | `(maxExchanges: number, projectRoot: string, sessionHints?: ClaudeSessionHints) => Promise<OpencodeCapture \\| null>` |\n| `captureCodexConversation` | codex-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \\| null>` |\n| `captureCopilotConversation` | copilot-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \\| null>` |\n| `captureGeminiConversation` | gemini-cli-capture | `(maxExchanges: number, projectRoot: string) => Promise<OpencodeCapture \\| null>` |\n\n---",
        "start_line": 289,
        "end_line": 301,
        "score": 0.7193035588098393
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/scripts/loaders/data-loader.ts",
exec
/bin/zsh -lc "python3 '.opencode/skill/scripts/skill_advisor.py' \"Design the automated live-proof protocol for generate-context CLI parity across claude/codex/copilot/gemini\" --threshold 0.8" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 1.33s:
python3: warning: confstr() failed with code 5: couldn't get path of DARWIN_USER_TEMP_DIR; using /tmp instead
python3: error: couldn't create cache file '/tmp/xcrun_db-vG4hYgxS' (errno=Operation not permitted)
[
  {
    "skill": "cli-gemini",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !gemini, across~, cli(name), codex~, cross-ai~"
  },
  {
    "skill": "cli-claude-code",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: claude(name), cli(name), codex, copilot, gemini"
  },
  {
codex
I’ve confirmed each extractor’s storage paths and valid-content checks; next I’m pulling the source-type enum so the artifact schema can assert the exact capture backend (`claude-code-capture`, `codex-cli-capture`, etc.).
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | sed -n '1,130p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
/bin/zsh -lc "rg -n \"type DataSource|type CaptureDataSource|opencode-capture|claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture\" '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
22:export type DataSource =
24:  | 'opencode-capture'
25:  | 'claude-code-capture'
26:  | 'codex-cli-capture'
27:  | 'copilot-cli-capture'
28:  | 'gemini-cli-capture'
31:export type CaptureDataSource = Exclude<DataSource, 'file' | 'simulation'>;
803: * @param source - The data source identifier, defaults to 'opencode-capture'.
809:  source: CaptureDataSource = 'opencode-capture',
exec
/bin/zsh -lc "rg -n \"function validateInputData|throw new Error|required|user_prompts|observations|recent_context|SPEC_FOLDER|specFolder\" '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
73:  specFolder?: string;
75:  SPEC_FOLDER?: string;
90:  observations?: Observation[];
92:  user_prompts?: UserPrompt[];
94:  recent_context?: RecentContext[];
111:  SPEC_FOLDER?: string;
113:  observations: Observation[];
157:  observations: Observation[];
324:function hasPersistedNextStepsObservation(observations: Observation[]): boolean {
325:  return observations.some((observation) => {
384: * @returns A NormalizedData object with unified observations, userPrompts, recentContext, and FILES, or the backfilled input if already in MCP format.
394:    : Array.isArray(data.user_prompts)
395:      ? data.user_prompts
399:    : Array.isArray(data.recent_context)
400:      ? data.recent_context
409:  if (data.userPrompts || data.user_prompts || data.observations || data.recentContext || data.recent_context) {
413:    if (!Array.isArray(cloned.observations)) cloned.observations = [];
419:    if (nextSteps.length > 0 && !hasPersistedNextStepsObservation(cloned.observations)) {
420:      cloned.observations.push(buildNextStepsObservation(nextSteps));
425:    if (data.specFolder || data.spec_folder || data.SPEC_FOLDER) {
exec
/bin/zsh -lc "nl -ba '.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts' | sed -n '546,640p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   546	 * Validates raw input data, throwing an error if required fields are missing or fields have incorrect types.
   547	 * @param data - The raw input data object to validate.
   548	 * @param specFolderArg - Optional spec folder path from CLI argument; when provided, the specFolder field in data is not required.
   549	 * @returns Nothing on success; throws an Error with concatenated validation messages on failure.
   550	 */
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
exec
/bin/zsh -lc "rg -n \"type IndexingStatusValue|type WorkflowIndexingStatus|export type\" '.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts' && nl -ba '.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts' | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
24:type IndexingStatusValue =
201:export type {
     1	// ---------------------------------------------------------------
     2	// MODULE: Memory Indexer
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. MEMORY INDEXER
     7	// ───────────────────────────────────────────────────────────────
     8	// Handles persisting memory files to the vector index: embedding generation,
     9	// Database storage, metadata updates, and DB-change notifications.
    10	
    11	import * as fs from 'fs/promises';
    12	import * as fsSync from 'fs';
    13	import * as path from 'path';
    14	
    15	import { structuredLog } from '../utils';
    16	import { generateDocumentEmbedding, EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
    17	import { vectorIndex } from '@spec-kit/mcp-server/api/search';
    18	import { DB_UPDATED_FILE } from '@spec-kit/shared/config';
codex
1. **`generate-context.ts` CLI interface (MVP contract)**
- Entry: `node generate-context.js [options] <input>`.
- Modes:
1. **Direct/stateless mode**: `node generate-context.js <spec-folder>`
2. **Data-file (JSON) mode**: `node generate-context.js <data.json> [spec-folder]`
3. **Structured stdin mode**: `echo '{...}' | node generate-context.js --stdin [spec-folder]`
4. **Structured inline JSON mode**: `node generate-context.js --json '{...}' [spec-folder]`
- Options:
1. `--help` / `-h`
2. `--stdin`
3. `--json <string>`
4. `--session-id <uuid>` (used for deterministic Claude transcript selection in native-capture path)
- Target resolution:
1. Explicit CLI spec folder wins over payload `specFolder`
2. Payload accepts `specFolder`, `spec_folder`, or `SPEC_FOLDER`
3. Supports nested spec refs (`parent/child`) and `specs/` / `.opencode/specs/` paths
- Output behavior:
1. Writes memory artifacts under `<spec-folder>/memory/`
2. Performs conditional semantic indexing
3. CLI itself prints logs and exits `0` on success, `1` on failure (no JSON result printed)

Sources: [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:356), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:394), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:553)

2. **Per-CLI minimal live test (4 CLIs)**
- Shared valid-capture rule from loader: capture is usable if `exchanges.length > 0` OR `toolCalls.length > 0`.
- So minimum practical seed input per CLI: one prompt in that CLI session in this repo workspace (assistant reply recommended but not strictly required).

Commands (assume `GEN=.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `SPEC=specs/NNN-cli-parity`):

1. **Claude Code**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=claude node "$GEN" --session-id "$CLAUDE_SESSION_ID" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-claude.json "$SPEC"`
- Capture prerequisites: transcript under `~/.claude/projects/.../*.jsonl` for matching workspace, non-empty content.

2. **Codex CLI**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=codex node "$GEN" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-codex.json "$SPEC"`
- Capture prerequisites: `~/.codex/sessions/**/rollout-*.jsonl` with `session_meta.payload.cwd` matching project root.

3. **Copilot CLI**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=copilot node "$GEN" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-copilot.json "$SPEC"`
- Capture prerequisites: `~/.copilot/session-state/<id>/workspace.yaml` + `events.jsonl`, workspace path match, non-empty events.

4. **Gemini CLI**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=gemini node "$GEN" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-gemini.json "$SPEC"`
- Capture prerequisites: `~/.gemini/history/<id>/.project_root` matches workspace + `~/.gemini/tmp/<id>/chats/session-*.json` with non-empty `messages`.

Sources: [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:221), [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:231), [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:323), [claude-code-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts:31), [codex-cli-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:29), [copilot-cli-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts:29), [gemini-cli-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:29)

3. **Proof artifact schema (must include `WorkflowResult` fields)**
```json
{
  "cli": "claude|codex|copilot|gemini",
  "mode": "direct|json_file",
  "command": "string",
  "exitCode": 0,
  "startedAt": "ISO-8601",
  "endedAt": "ISO-8601",
  "workflowResult": {
    "contextDir": "abs-path",
    "specFolder": "string",
    "specFolderName": "string",
    "contextFilename": "string",
    "writtenFiles": ["abs-path"],
    "memoryId": 123,
    "indexingStatus": {
      "status": "indexed|skipped_duplicate|skipped_index_policy|skipped_quality_gate|skipped_embedding_unavailable|failed_embedding",
      "memoryId": 123,
      "reason": "string?",
      "errorMessage": "string?"
    },
    "stats": {
      "messageCount": 1,
      "decisionCount": 0,
      "diagramCount": 0,
      "qualityScore": 0,
      "isSimulation": false
    }
  },
  "captureEvidence": {
    "expectedSource": "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|file",
    "observedLogLine": "Captured X exchanges from ...",
    "logPath": "abs-path"
  }
}
```

Sources: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:112), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2447), [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:24)

4. **`prove-cli-parity.sh` outline (MVP)**
```bash
#!/usr/bin/env bash
set -euo pipefail

GEN=".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js"
SPEC="${1:?spec folder required}"
OUT="${2:-/tmp/cli-parity-$(date +%Y%m%d-%H%M%S)}"
CLIS=(claude codex copilot gemini)
mkdir -p "$OUT"

run_direct() {
  local cli="$1"
  local log="$OUT/${cli}-direct.log"
  SYSTEM_SPEC_KIT_CAPTURE_SOURCE="$cli" node "$GEN" "$SPEC" >"$log" 2>&1
  grep -q "Context saved successfully!" "$log"
  grep -Eiq "Captured [0-9]+ exchanges from (Claude Code|Codex CLI|Copilot CLI|Gemini CLI)" "$log"
  # build artifact JSON (include workflowResult-equivalent fields + log evidence)
}

run_json_file() {
  local cli="$1"
  local payload="$OUT/${cli}-payload.json"
  local log="$OUT/${cli}-json.log"
  cat > "$payload" <<EOF
{"specFolder":"$SPEC","user_prompts":[{"prompt":"parity proof $cli","timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)"}],"observations":[],"recent_context":[]}
EOF
  node "$GEN" "$payload" "$SPEC" >"$log" 2>&1
  grep -q "Context saved successfully!" "$log"
  grep -q "Loaded and validated conversation data from file" "$log"
  # build artifact JSON
}

for cli in "${CLIS[@]}"; do
  run_direct "$cli"
  run_json_file "$cli"
done

echo "Artifacts in $OUT"
```

5. **Invocation estimate**
- **MVP save invocations:** **8** (`4 CLIs × 2 modes`).
- Practical total in a cold environment: **~12** if you add one seed interaction per CLI before direct-mode proof.
tokens used
98,047
1. **`generate-context.ts` CLI interface (MVP contract)**
- Entry: `node generate-context.js [options] <input>`.
- Modes:
1. **Direct/stateless mode**: `node generate-context.js <spec-folder>`
2. **Data-file (JSON) mode**: `node generate-context.js <data.json> [spec-folder]`
3. **Structured stdin mode**: `echo '{...}' | node generate-context.js --stdin [spec-folder]`
4. **Structured inline JSON mode**: `node generate-context.js --json '{...}' [spec-folder]`
- Options:
1. `--help` / `-h`
2. `--stdin`
3. `--json <string>`
4. `--session-id <uuid>` (used for deterministic Claude transcript selection in native-capture path)
- Target resolution:
1. Explicit CLI spec folder wins over payload `specFolder`
2. Payload accepts `specFolder`, `spec_folder`, or `SPEC_FOLDER`
3. Supports nested spec refs (`parent/child`) and `specs/` / `.opencode/specs/` paths
- Output behavior:
1. Writes memory artifacts under `<spec-folder>/memory/`
2. Performs conditional semantic indexing
3. CLI itself prints logs and exits `0` on success, `1` on failure (no JSON result printed)

Sources: [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:356), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:394), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:553)

2. **Per-CLI minimal live test (4 CLIs)**
- Shared valid-capture rule from loader: capture is usable if `exchanges.length > 0` OR `toolCalls.length > 0`.
- So minimum practical seed input per CLI: one prompt in that CLI session in this repo workspace (assistant reply recommended but not strictly required).

Commands (assume `GEN=.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`, `SPEC=specs/NNN-cli-parity`):

1. **Claude Code**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=claude node "$GEN" --session-id "$CLAUDE_SESSION_ID" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-claude.json "$SPEC"`
- Capture prerequisites: transcript under `~/.claude/projects/.../*.jsonl` for matching workspace, non-empty content.

2. **Codex CLI**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=codex node "$GEN" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-codex.json "$SPEC"`
- Capture prerequisites: `~/.codex/sessions/**/rollout-*.jsonl` with `session_meta.payload.cwd` matching project root.

3. **Copilot CLI**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=copilot node "$GEN" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-copilot.json "$SPEC"`
- Capture prerequisites: `~/.copilot/session-state/<id>/workspace.yaml` + `events.jsonl`, workspace path match, non-empty events.

4. **Gemini CLI**
- Native/direct proof: `SYSTEM_SPEC_KIT_CAPTURE_SOURCE=gemini node "$GEN" "$SPEC"`
- JSON/file proof: `node "$GEN" /tmp/save-context-data-gemini.json "$SPEC"`
- Capture prerequisites: `~/.gemini/history/<id>/.project_root` matches workspace + `~/.gemini/tmp/<id>/chats/session-*.json` with non-empty `messages`.

Sources: [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:221), [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:231), [data-loader.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:323), [claude-code-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts:31), [codex-cli-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts:29), [copilot-cli-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts:29), [gemini-cli-capture.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts:29)

3. **Proof artifact schema (must include `WorkflowResult` fields)**
```json
{
  "cli": "claude|codex|copilot|gemini",
  "mode": "direct|json_file",
  "command": "string",
  "exitCode": 0,
  "startedAt": "ISO-8601",
  "endedAt": "ISO-8601",
  "workflowResult": {
    "contextDir": "abs-path",
    "specFolder": "string",
    "specFolderName": "string",
    "contextFilename": "string",
    "writtenFiles": ["abs-path"],
    "memoryId": 123,
    "indexingStatus": {
      "status": "indexed|skipped_duplicate|skipped_index_policy|skipped_quality_gate|skipped_embedding_unavailable|failed_embedding",
      "memoryId": 123,
      "reason": "string?",
      "errorMessage": "string?"
    },
    "stats": {
      "messageCount": 1,
      "decisionCount": 0,
      "diagramCount": 0,
      "qualityScore": 0,
      "isSimulation": false
    }
  },
  "captureEvidence": {
    "expectedSource": "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|file",
    "observedLogLine": "Captured X exchanges from ...",
    "logPath": "abs-path"
  }
}
```

Sources: [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:112), [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2447), [memory-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:24)

4. **`prove-cli-parity.sh` outline (MVP)**
```bash
#!/usr/bin/env bash
set -euo pipefail

GEN=".opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js"
SPEC="${1:?spec folder required}"
OUT="${2:-/tmp/cli-parity-$(date +%Y%m%d-%H%M%S)}"
CLIS=(claude codex copilot gemini)
mkdir -p "$OUT"

run_direct() {
  local cli="$1"
  local log="$OUT/${cli}-direct.log"
  SYSTEM_SPEC_KIT_CAPTURE_SOURCE="$cli" node "$GEN" "$SPEC" >"$log" 2>&1
  grep -q "Context saved successfully!" "$log"
  grep -Eiq "Captured [0-9]+ exchanges from (Claude Code|Codex CLI|Copilot CLI|Gemini CLI)" "$log"
  # build artifact JSON (include workflowResult-equivalent fields + log evidence)
}

run_json_file() {
  local cli="$1"
  local payload="$OUT/${cli}-payload.json"
  local log="$OUT/${cli}-json.log"
  cat > "$payload" <<EOF
{"specFolder":"$SPEC","user_prompts":[{"prompt":"parity proof $cli","timestamp":"$(date -u +%Y-%m-%dT%H:%M:%SZ)"}],"observations":[],"recent_context":[]}
EOF
  node "$GEN" "$payload" "$SPEC" >"$log" 2>&1
  grep -q "Context saved successfully!" "$log"
  grep -q "Loaded and validated conversation data from file" "$log"
  # build artifact JSON
}

for cli in "${CLIS[@]}"; do
  run_direct "$cli"
  run_json_file "$cli"
done

echo "Artifacts in $OUT"
```

5. **Invocation estimate**
- **MVP save invocations:** **8** (`4 CLIs × 2 modes`).
- Practical total in a cold environment: **~12** if you add one seed interaction per CLI before direct-mode proof.
