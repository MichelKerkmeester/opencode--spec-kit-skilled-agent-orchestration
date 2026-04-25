#!/usr/bin/env bash
# Sequential cli-codex implementation runner for 008 tasks T01-T15.
# Per-task: focused patch prompt + Gate 3 pre-answer + skill routing pre-select.
# After each task: build mcp_server, log result, halt on build failure.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PKT="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
PKT_007="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
LOGS="$PKT/scratch/codex-logs"
RUNNER_LOG="$PKT/scratch/runner.log"
MCP="$REPO_ROOT/.opencode/skill/system-spec-kit/mcp_server"
CODEX="/Users/michelkerkmeester/.superset/bin/codex"
MODEL="gpt-5.4"

mkdir -p "$LOGS"
cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[runner-008] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"
echo "[runner-008] codex: $($CODEX --version 2>&1 | head -1)" | tee -a "$RUNNER_LOG"

GATE_PREAMBLE='GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder for this run: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-code-opencode is preselected; do not re-evaluate. Proceed immediately to applying the patch described below.
Permitted writes: under .opencode/skill/system-spec-kit/mcp_server/ and the spec folder above. Do NOT modify other files. Do NOT ask the user any questions; if any ambiguity arises, choose the most defensive interpretation that satisfies the explicit file:line instructions.

After applying the patch, run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` and report whether it passed. If TS errors are present, fix them and re-build until clean.

==========

'

run_task() {
  local TID="$1" TASK_TEXT="$2" UPSTREAM_REF="$3"
  local LOG="$LOGS/$TID.log"

  echo "[runner-008] $TID start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"

  local PROMPT="${GATE_PREAMBLE}

# Task $TID

$TASK_TEXT

## Upstream design reference

Read this section first: $UPSTREAM_REF

## Implementation contract

1. Apply the patch as specified by the file:line targets above.
2. Preserve existing exports + signatures unless the task explicitly asks to extend them.
3. New helper imports (e.g. crypto, fs/promises) must be added at the top of the file.
4. After applying the patch, run \`npm --prefix .opencode/skill/system-spec-kit/mcp_server run build\` and confirm 0 TS errors. If errors appear, fix them inline and re-build.
5. Output the final list of files modified + the build PASS/FAIL line.
6. Do NOT mark the task complete in tasks.md (the runner does that). Do NOT commit.
"

  "$CODEX" exec \
    --model "$MODEL" \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox workspace-write \
    "$PROMPT" \
    > "$LOG" 2>&1
  local RC=$?

  echo "[runner-008] $TID done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"

  # Build gate
  if (cd "$MCP" && npm run build > "$LOGS/$TID.build.log" 2>&1); then
    echo "[runner-008] $TID build PASS" | tee -a "$RUNNER_LOG"
  else
    echo "[runner-008] $TID build FAIL — halting runner" | tee -a "$RUNNER_LOG"
    tail -30 "$LOGS/$TID.build.log" | tee -a "$RUNNER_LOG"
    return 1
  fi
}

# ============================================================
# TASK DEFINITIONS
# ============================================================

run_task "T01" "Add metadata helpers to .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts. Extend the metadata-table accessors near lines 190-204 with two new exported functions: getCodeGraphMetadata(key: string): string | null and setCodeGraphMetadata(key: string, value: string): void. Both go through the existing code_graph_metadata table at lines 99-103. Add narrower convenience wrappers getLastGoldVerification() and setLastGoldVerification(json: object) that JSON-encode/decode under the key 'last_gold_verification'." "$PKT_007/research/iterations/iteration-012.md (Wiring Points + Implementation Roadmap task 1)" || exit 1

run_task "T02" "Create new file .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts. Export interfaces: GoldQuery, GoldBattery, VerifyResult, ProbeResult. Export loadGoldBattery(path: string): GoldBattery — read JSON, validate schema_version === 1, validate pass_policy { overall_pass_rate, edge_focus_pass_rate }, validate queries[] each has { id, category, query, source_file, expected_top_K_symbols }. Define a v2 schema field hook (probe?: { operation, subject, expectedSymbolsPath }) for future explicit probes — ignore in v1 dispatch but log a warning when present." "$PKT_007/research/iterations/iteration-012.md (Harness Design + Execution flow steps 1-4); $PKT_007/assets/code-graph-gold-queries.json (schema reference)" || exit 1

run_task "T03" "Extend .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts with executeBattery(battery: GoldBattery, query: (args: any) => Promise<any>, opts?: { failFast?: boolean; includeDetails?: boolean }): Promise<VerifyResult>. For each gold query, derive an outline probe { operation: 'outline', subject: query.source_file, limit: 200 }, await query(probe), parse the MCP text payload (JSON inside text content), extract nodes[].name and nodes[].fqName, compare against query.expected_top_K_symbols (case-insensitive, name OR fqName match), and record per-query pass/fail. Aggregate by category. Compute overallPassRate + categoryPassRates + missingSymbols + unexpectedErrors. Return VerifyResult." "$PKT_007/research/iterations/iteration-012.md (Execution flow step 3); .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1097-1133 (current outline output)" || exit 1

run_task "T04" "Create new file .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts. Export interface VerifyArgs with optional fields: rootDir, batteryPath, category, failFast, includeDetails, persistBaseline, allowInlineIndex. Default allowInlineIndex=false. Export handleCodeGraphVerify(args: VerifyArgs): Promise<{ content: { type: 'text'; text: string }[] }>. Flow: 1) call ensureCodeGraphReady(rootDir, { allowInlineIndex: args.allowInlineIndex ?? false, allowInlineFullScan: false }); if freshness !== 'fresh', return JSON { status: 'blocked', readiness } as the text payload; 2) load gold battery from args.batteryPath ?? default path under 007 packet assets; 3) execute via executeBattery passing handleCodeGraphQuery as the query function; 4) if persistBaseline === true, call setLastGoldVerification(result); 5) shape final response as JSON with status:'ok' + result. Import handleCodeGraphQuery from ../handlers/query.js or a relative equivalent." "$PKT_007/research/iterations/iteration-012.md (Harness Design — Proposed MCP signature + Execution flow); .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:245-264 (blocking pattern)" || exit 1

run_task "T05" "Register code_graph_verify as an MCP tool. In .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts add a new schema near line 554-647 with name 'code_graph_verify', description, and JSON Schema input matching VerifyArgs (all fields optional). Add the schema to TOOL_DEFINITIONS export near line 915-920. In .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/index.ts (around line 4-11) export handleCodeGraphVerify. In .opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts add 'code_graph_verify' to TOOL_NAMES around line 5-14, add the tool definition around line 19-29, and add a dispatch arm in handleTool (or the equivalent dispatcher) around line 58-96 that calls handleCodeGraphVerify." "$PKT_007/research/iterations/iteration-012.md (Wiring Points step 1)" || exit 1

run_task "T06" "Optionally include verification in scan result. In .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts (around lines 247-287, the result-building block), accept a new optional input field 'verify' (boolean, default false). Default behavior unchanged. When verify === true AND incremental === false (i.e. full scan), after persistence completes (cite lines 230-245) call gold-query-verifier executeBattery with handleCodeGraphQuery, attach result.verification to the response, and call setLastGoldVerification(verification)." "$PKT_007/research/iterations/iteration-012.md (Wiring Points step 2); $PKT_007/research/iterations/iteration-008.md (scan flow context)" || exit 1

run_task "T07" "Surface verification + drift fields in code_graph_status. In .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts around lines 40-62 extend the response object with three optional fields: lastGoldVerification (the persisted JSON), goldVerificationTrust ('live' | 'stale' | 'absent' based on age and freshness), verificationPassPolicy ({ overall_pass_rate, edge_focus_pass_rate } from the battery if present). Read via getLastGoldVerification()." "$PKT_007/research/iterations/iteration-012.md (Wiring Points step 3)" || exit 1

run_task "T08" "Make stale predicates hash-aware. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts: at lines 7-10 add 'readFileSync' to the existing fs import and import generateContentHash from './indexer-types.js'. Around lines 117-123 add a helper getCurrentFileContentHash(filePath: string): string | null that reads the file with readFileSync(filePath, 'utf-8'), passes the content to generateContentHash, and returns null on read failure. At lines 380-388 modify isFileStale(filePath: string, options?: { currentContentHash?: string }) to: SELECT file_mtime_ms, content_hash; if no row, return true; if stored mtime !== current mtime via existing getCurrentFileMtimeMs, return true (mtime fast-path); if mtime matches and stored content_hash is present, compare options.currentContentHash ?? getCurrentFileContentHash(filePath) against stored hash and return mismatch ? true : false; if stored hash is null, return false (legacy fallback). At lines 396-424 update ensureFreshFiles() to apply the same mtime-then-hash batch predicate. Also update the call site in .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:208-217 to pass { currentContentHash: result.contentHash } when result.contentHash exists." "$PKT_007/research/iterations/iteration-008.md (Patch Surface section — all 8 patch points)" || exit 1

run_task "T09" "Capture resolver metadata. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts around lines 113-126 extend the RawCapture type/interface with three optional fields: moduleSpecifier?: string, importKind?: 'value' | 'type', exportKind?: 'named' | 'star' | 'declaration'. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts around lines 340-397 (import captures) record the source-string module specifier and the import kind ('type' if 'import type' was matched, otherwise 'value'). Around lines 399-465 (export captures) record exportKind based on whether it was an 'export *', a named re-export, or a local declaration. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:485-502 (regex fallback) preserve the previously discarded module specifier in capture group 3 onto the resulting RawCapture." "$PKT_007/research/iterations/iteration-009.md (Failure Modes A-C: Patch surface bullets)" || exit 1

run_task "T10" "Cross-file resolver + path aliases. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts around lines 73-80 extend IndexerConfig with three optional fields: tsconfigPath?: string, baseUrl?: string, pathAliases?: { prefix: string; suffixWildcard: boolean; targets: string[] }[]. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts around lines 1403-1507 add loadTsconfigResolver(rootDir: string): ModuleResolver — find nearest tsconfig.json walking up from rootDir, parse JSON-with-extends (support a single level of extends), normalize the paths map, return { resolve: (fromFile, specifier) => resolvedAbsolutePath | undefined }. Pass the resolver into the finalize step. Around lines 857-920 and 1328-1381 use the resolver to convert the captured moduleSpecifier from T09 into an absolute target file path; if resolution succeeds, emit cross-file IMPORTS edges to the resolved target instead of (or in addition to) same-file edges. Cite tsconfig.json paths configuration at .opencode/skill/system-spec-kit/mcp_server/tsconfig.json:12-15." "$PKT_007/research/iterations/iteration-009.md (Failure Mode A pseudocode + Patch surface)" || exit 1

run_task "T11" "Edge-weight config + centralization. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts around lines 73-80 extend IndexerConfig with edgeWeights?: Partial<Record<EdgeType, number>>. Add a new exported constant DEFAULT_EDGE_WEIGHTS that maps each EdgeType to its current value (CONTAINS=1.0, IMPORTS=1.0, EXPORTS=1.0, EXTENDS=0.95, IMPLEMENTS=0.95, DECORATES=0.9, OVERRIDES=0.9, TYPE_OF=0.85, CALLS=0.8, TESTED_BY=0.6). In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts replace literal weight constants at lines 895-1071 and 1357-1377 with resolved weights = { ...DEFAULT_EDGE_WEIGHTS, ...config.edgeWeights }; emit each edge with the resolved weight. Create new file .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/edge-drift.ts exporting computeEdgeShare(edges), computePSI(observed, baseline), computeJSD(observed, baseline). All three accept distributions as Record<EdgeType, number> (counts or shares); PSI and JSD return scalars; share returns a per-type fraction." "$PKT_007/research/iterations/iteration-010.md (Patch surface: indexer-types extension + structural-indexer literals + edge-drift module)" || exit 1

run_task "T12" "Drift baseline persistence + status surfacing. After each full scan persists results in .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts (around lines 230-245) call computeEdgeShare on the scan's emitted edges and store via setCodeGraphMetadata('edge_distribution_baseline', JSON.stringify(distribution)) IF either: (a) no baseline exists yet, OR (b) input args includes persistBaseline=true. On every status call (.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-62) compute the current edge-share from the live DB, compare against the persisted baseline using computePSI + computeJSD + per-type absolute share-drift, and surface edgeDriftSummary: { share_drift, psi, jsd, flagged: boolean }. Defaults flag = (psi >= 0.25) OR (jsd >= 0.10) OR (max abs share_drift >= 0.05)." "$PKT_007/research/iterations/iteration-010.md (Patch surface: drift detection + status surface); $PKT_007/research/iterations/iteration-006.md:29-58 (drift thresholds rationale)" || exit 1

run_task "T13" "Self-heal observability. In .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts around lines 30-36 extend the ReadyResult type with four optional fields: selfHealAttempted?: boolean, selfHealResult?: 'ok' | 'failed' | 'skipped', verificationGate?: 'pass' | 'fail' | 'absent', lastSelfHealAt?: string. Around lines 302-367 (selective-reindex / auto-index branches) populate these fields whenever auto-index runs. Specifically: set selfHealAttempted = true when the soft-stale branch fires, set selfHealResult based on the auto-index outcome, read lastGoldVerification (via getLastGoldVerification or null if not implemented yet) and set verificationGate = 'pass' when last verification passed pass_policy, 'fail' when it failed, 'absent' when missing, set lastSelfHealAt = ISO string. Critical invariant: do NOT change the existing detect_changes path that disables both allowInlineIndex and allowInlineFullScan; that hard block must remain intact." "$PKT_007/research/iterations/iteration-011.md (Patch surface — ReadyResult extension + selective-reindex branches)" || exit 1

run_task "T14" "detect_changes hard-block tests. Locate the existing detect_changes vitest file (likely .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-detect-changes.vitest.ts or similar). Add three test cases that exercise lines 245-264 of detect-changes.ts: (a) when freshness is 'stale' the response is { status: 'blocked' } and no inline scan was triggered (assert via spy on ensureCodeGraphReady args showing allowInlineIndex=false, allowInlineFullScan=false); (b) when last gold verification failed (verificationGate === 'fail' on ReadyResult) the response is still 'blocked' rather than triggering self-heal; (c) when freshness is 'fresh' AND no verification gate failure, normal output is returned. If the vitest file does not exist, create it with appropriate setup imports." "$PKT_007/research/iterations/iteration-012.md (Wiring Points step 5: detect_changes contract)" || exit 1

run_task "T15" "Stream-level tests. Add or extend the following vitest files: 1) .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts: at lines 41-46 add tests covering hash-aware staleness (same-mtime/different-hash, missing-hash fallback, unchanged-content freshness); at lines 111-117 add cases covering type-only imports, path-alias resolution, and re-export barrel handling. 2) Create .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts: cover loadGoldBattery validation (good schema, bad schema, bad pass_policy), executeBattery (all-pass, partial-fail, blocked-on-stale), handleCodeGraphVerify integration (returns blocked status when graph stale, returns ok with VerifyResult when fresh, persists last_gold_verification when persistBaseline=true). 3) .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts at lines 620-745 add a verifier-parsing case if the file exposes outline-payload parsing. After writing tests, run \`npm --prefix .opencode/skill/system-spec-kit/mcp_server test\` and ensure 100% pass." "$PKT_007/research/iterations/iteration-012.md (Implementation Roadmap task 15: focused tests + gold-battery fixtures); $PKT_007/research/iterations/iteration-008.md (test plan section); $PKT_007/research/iterations/iteration-009.md (resolver test cases)" || exit 1

echo "[runner-008] all 15 tasks complete $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"

# Final smoke test
echo "[runner-008] final test pass" | tee -a "$RUNNER_LOG"
if (cd "$MCP" && npm test > "$LOGS/final-test.log" 2>&1); then
  echo "[runner-008] final test PASS" | tee -a "$RUNNER_LOG"
else
  echo "[runner-008] final test FAIL — see $LOGS/final-test.log" | tee -a "$RUNNER_LOG"
  tail -30 "$LOGS/final-test.log" | tee -a "$RUNNER_LOG"
fi

echo "[runner-008] DONE $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"
