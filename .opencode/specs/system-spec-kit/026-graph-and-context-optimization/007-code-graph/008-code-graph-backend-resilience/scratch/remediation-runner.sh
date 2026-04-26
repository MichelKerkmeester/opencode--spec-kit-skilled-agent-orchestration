#!/usr/bin/env bash
# Sequential cli-codex remediation runner for 008 deep-review findings.
# 5 P0 + 12 P1 + 7 P2 → 8 batched fix tasks + 1 final test pass.
# Per task: dispatch cli-codex with focused fix prompt; gate on build PASS.

set -uo pipefail

REPO_ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
PKT="$REPO_ROOT/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
LOGS="$PKT/scratch/remediation-logs"
RUNNER_LOG="$PKT/scratch/remediation-runner.log"
MCP="$REPO_ROOT/.opencode/skill/system-spec-kit/mcp_server"
CODEX="/Users/michelkerkmeester/.superset/bin/codex"
MODEL="gpt-5.4"

mkdir -p "$LOGS"
cd "$REPO_ROOT" || { echo "ERROR: cannot cd to repo root"; exit 1; }

echo "[remediation-008] start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"
echo "[remediation-008] codex: $($CODEX --version 2>&1 | head -1)" | tee -a "$RUNNER_LOG"

GATE_PREAMBLE='GATE 3 PRE-ANSWERED: A (existing spec folder)
Spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/
Skill routing: sk-code-opencode is preselected; do not re-evaluate.
You may write to: .opencode/skill/system-spec-kit/mcp_server/ and the spec folder above. Do NOT modify other files. Do NOT ask questions.

Source of truth for the changes you are landing: the deep-review findings at
review/review-report.md (sections 5 P0 + 12 P1 + 7 P2). Read the relevant
review section before applying patches.

After applying patches, run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` and confirm 0 TS errors. If errors appear, fix them and rebuild until clean. Do NOT mark tasks complete in tasks.md (the runner does that). Do NOT commit. Output a short summary of files modified + final build line.

==========

'

run_fix() {
  local FID="$1" TITLE="$2" BODY="$3"
  local LOG="$LOGS/$FID.log"

  echo "[remediation-008] $FID start $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"

  local PROMPT="${GATE_PREAMBLE}

# Fix Task $FID — $TITLE

$BODY
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

  echo "[remediation-008] $FID done rc=$RC $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"

  if (cd "$MCP" && npm run build > "$LOGS/$FID.build.log" 2>&1); then
    echo "[remediation-008] $FID build PASS" | tee -a "$RUNNER_LOG"
  else
    echo "[remediation-008] $FID build FAIL — halting runner" | tee -a "$RUNNER_LOG"
    tail -30 "$LOGS/$FID.build.log" | tee -a "$RUNNER_LOG"
    return 1
  fi
}

# ============================================================
# F01: Security — verify handler workspace containment + batteryPath restriction
# Closes P1-9 (verify.ts:72-78 trusts rootDir) + P1-10 (verify.ts:88-96 batteryPath unrestricted).
# ============================================================
run_fix "F01" "Verify handler workspace containment + batteryPath allowlist" "
Edit \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts\` around lines 72-100:

1. Add canonical workspace containment for \`args.rootDir\`. Mirror the pattern used in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:135-168\` and \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts\`. Resolve via realpathSync; reject paths outside the workspace root with a structured error.

2. Restrict \`args.batteryPath\` to an approved asset directory. Allowed roots: \`<workspace>/.opencode/specs/**/assets/code-graph-gold-queries.json\` AND \`<workspace>/.opencode/skill/system-spec-kit/mcp_server/**/assets/code-graph-gold-queries.json\`. Anything else returns a structured error before any file read. Default battery path stays inside the 007 packet.

3. Update / add tests in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-verify.vitest.ts\` covering: (a) rootDir outside workspace returns error without inline-index, (b) batteryPath outside allowed roots returns error before fs read, (c) default battery path resolves correctly.

Build must pass after the patch.
"

# ============================================================
# F02: Security — resolver tsconfig + alias path fencing
# Closes P1-11 (structural-indexer.ts:1458-1474,1500-1506,1628-1638 paths outside root).
# ============================================================
run_fix "F02" "Resolver tsconfig + alias path fencing" "
Edit \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts\` resolver code (around lines 1458-1474, 1500-1506, 1628-1638):

1. Canonicalize every resolved candidate via \`realpathSync\` BEFORE any \`readFileSync()\`, \`statSync()\`, or \`existsSync()\` call.
2. Reject any candidate whose canonical path falls outside the workspace root. The resolver should silently fall back to leaving the import unresolved (return undefined) rather than crash.
3. Apply the same canonical+root-check to the tsconfig \`extends\` chain — if the extended file canonicalizes outside the root, abort the extends walk and use the partial parse.

Add a unit test or integration assertion in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts\` proving an out-of-workspace alias target does not produce a cross-file edge.

Build must pass.
"

# ============================================================
# F03: Correctness — verificationGate preservation + signed share_drift + malformed baseline
# Closes P1-4 (status.ts:40-67 malformed baseline = 0 drift)
#       + P1-5 (status.ts:56-64 share_drift loses sign)
#       + P1-8 (ensure-ready.ts:346-359 verificationGate dropped on action:'none').
# ============================================================
run_fix "F03" "verificationGate preservation, signed share_drift, malformed baseline handling" "
Three coupled correctness fixes:

1. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:346-359\` — when state.action is 'none' AND verificationGate would otherwise fire, preserve verificationGate on the ReadyResult. The current code drops it because the early-return on action:'none' bypasses the gate-evaluation block. Restructure so verificationGate is computed independently of state.action and always attached. Add a regression test in \`.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts\` that proves: action:'none' + failed last verification → ReadyResult has verificationGate:'fail'.

2. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:56-64\` — \`share_drift\` per edge type currently uses Math.abs() before surfacing. Keep the SIGNED delta in the surfaced summary (an edge type that lost share should report negative). Use absolute value ONLY for the threshold check. Update the type signature if needed.

3. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts:40-67\` + \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:281-288\` — when the persisted baseline JSON parse fails, currently the drift summary defaults to all-zeros AND the auto-reseed path is also blocked. Fix: treat parse failure as 'baseline unavailable' (don't surface zero drift), AND allow the next full scan to overwrite the malformed metadata even when a baseline 'exists'.

Add focused tests for all three behaviors. Build must pass.
"

# ============================================================
# F04: Correctness — case-sensitive verifier matching + persisted probe metadata
# Closes P1-6 (gold-query-verifier.ts:226-227 case-insensitive)
#       + P1-7 (gold-query-verifier.ts:36-49,298-325 + verify.ts:98-104 missing metadata).
# ============================================================
run_fix "F04" "Case-sensitive verifier matching + complete persisted probe metadata" "
1. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:226-227\` — symbol comparison currently lowercases both sides. Make it case-sensitive by default (drop the .toLowerCase() calls). Identifiers in TypeScript are case-sensitive; matching must reflect that.

2. Same file (\`gold-query-verifier.ts:36-49,298-325\`) and \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:98-104\` — when a probe fails or partially matches, the persisted ProbeResult currently omits the original query text and source_file:line. Add fields: \`query: string, sourceFile: string, sourceLine?: number, expectedTopK: string[]\` to the persisted shape. Update \`setLastGoldVerification\` write site so failures preserve enough context for an operator to investigate without re-loading the battery.

Add tests covering: case-sensitive mismatch flagged, persisted failure includes original query metadata. Build must pass.
"

# ============================================================
# F05: Correctness — type-only per-specifier + nested tsconfig extends + regex fallback metadata
# Closes P1-1 (nested tsconfig extends single-level + cycles)
#       + P1-2 (inline type-only stamped as value)
#       + P1-3 (regex fallback drops resolver metadata).
# ============================================================
run_fix "F05" "Type-only per-specifier detection + nested tsconfig extends + regex fallback metadata" "
Three resolver-correctness fixes:

1. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:364-380,388-392\` — inline 'import { type Foo, Bar }' currently stamps importKind:'value' for the whole statement. Detect the 'type' modifier per-specifier (named-import items can have an inline 'type' qualifier). Each specifier should carry its own importKind: 'type' or 'value'.

2. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1500-1528\` — tsconfig 'extends' resolution is single-level. Walk the full chain with a \`Set<string>\` of canonical paths visited; on cycle detection, abort the extends walk and fall back to the partial parse (don't crash). Cap depth at 16 levels for safety.

3. \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:531-559\` — regex fallback parse currently drops moduleSpecifier, importKind, exportKind from emitted RawCapture. Emit those fields from the regex path too so the resolver and edge classifier behave the same way regardless of whether tree-sitter or the regex fallback produced the capture.

Add tests covering each behavior in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts\`. Build must pass.
"

# ============================================================
# F06: P0 Tests batch 1 — REQ-002 + REQ-003 + REQ-004 + REQ-006
# Closes P0-1 (currentContentHash propagation) + P0-2 (parser captures + alias scan + export* tests).
# ============================================================
run_fix "F06" "Direct tests for REQ-002, REQ-003, REQ-004, REQ-006" "
Add direct executable tests that exercise the production code paths (no over-mocking):

1. REQ-002 in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts\` — assert that the scan handler calls \`isFileStale(filePath, { currentContentHash: result.contentHash })\` with the exact contentHash from ParseResult. Use a spy/mock on isFileStale to assert call shape, not just outcome.

2. REQ-003 in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts\` — write a real fixture file with 'import type { X }', 'export *', and 'import { Foo as Bar }', run the parser, and assert the captured RawCapture entries have the expected moduleSpecifier, importKind, exportKind values. No mocking the tree-sitter output.

3. REQ-004 — extend the same test file with a fixture that has a tsconfig.json defining 'paths: { \"@app/*\": [\"./src/*\"] }' and source files that import via that alias. Run a full indexer pass. Assert the resulting code_edges contain a cross-file IMPORTS edge from the importer to the resolved target file (NOT just the same-file edge).

4. REQ-006 — write a fixture with 'foo.ts' that has 'export * from \"./bar\";' and 'bar.ts' that exports a symbol \`canonical\`. Run an outline query against \`foo.ts\` and assert \`canonical\` appears in the resolved nodes (chase the re-export chain). Or, if outline doesn't traverse re-exports yet, assert the captured edge metadata contains the chain target.

Build must pass; new tests must pass.
"

# ============================================================
# F07: P0 Tests batch 2 — REQ-005 + REQ-007 + REQ-008 + REQ-009
# Closes P0-3 (TYPE_ONLY edge type) + P0-4 (edge weights + baseline + drift).
# ============================================================
run_fix "F07" "Direct tests for REQ-005 (TYPE_ONLY edges), REQ-007/008/009 (edge weights + drift)" "
1. REQ-005 — DECISION: implement as a metadata flag on existing IMPORTS edges (not a new edge type) AND amend \`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md\` REQ-005 to reflect the metadata-tagging contract instead of a distinct TYPE_ONLY edge class. Then add tests in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts\` proving: a 'import type' results in an emitted edge whose metadata has importKind:'type' AND the effective weight is reduced (≤ 0.5) per the decision in 007 iter-009.

2. REQ-007 — add edge-weight unit tests. In \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts\` (or a new file): pass IndexerConfig.edgeWeights overriding CALLS to 0.99, run a small indexer pass, assert the emitted CALLS edges carry weight 0.99 and untouched edge types still use DEFAULT_EDGE_WEIGHTS.

3. REQ-008 + REQ-009 — add a unit test file \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/edge-drift.vitest.ts\` (NEW) that imports computeEdgeShare, computePSI, computeJSD from edge-drift.ts. Test cases: identical distributions → PSI=0 + JSD=0; one-edge-type drift of 30% share → PSI > 0.25 (flagged); zero-handling for missing edge types; negative case where neither threshold trips → flagged:false.

Plus an integration test in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts\`: full scan persists \`edge_distribution_baseline\` in code_graph_metadata; subsequent status call surfaces edgeDriftSummary with computed values.

Build must pass; new tests must pass.
"

# ============================================================
# F08: P0 Tests batch 3 — REQ-012 + REQ-015 + maintainability cleanup
# Closes P0-5 (self-heal + verificationGate tests) + P1-12 (typed query adapter) + P2 cleanup.
# ============================================================
run_fix "F08" "Direct tests for REQ-012/REQ-015 + extract typed query adapter" "
1. REQ-012 — add tests in \`.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts\` exercising the real selective-reindex branches at \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:302-367\`. Cover all four observable outcomes: selfHealAttempted:true with selfHealResult:'ok', :'failed', :'skipped', and the no-op path. Each test must assert lastSelfHealAt is populated with a valid ISO string (and only on real attempts per F03 spec, not on skipped).

2. REQ-015 — add tests in \`.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts\` proving the production-shape detect_changes contract. Mock ensureCodeGraphReady to return a ReadyResult with verificationGate:'fail' and freshness:'fresh', and assert detect_changes returns status:'blocked' (not ok) and never inline-runs scan/verify. Add a sibling test where verificationGate is undefined and freshness:'stale' — must also block.

3. Extract typed query transport adapter to close P1-12. Currently \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/gold-query-verifier.ts:234-330,344-361\` duplicates the parsing logic from \`.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1111-1131\` via \`any\`-typed parsing. Extract a shared module \`.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-result-adapter.ts\` exporting typed parse functions for outline/relationship payloads, and have BOTH the verifier and the query handler import from it. Remove the \`any\` casts.

Build must pass; all new tests must pass.
"

# ============================================================
# Final test pass
# ============================================================
echo "[remediation-008] final test pass $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"
if (cd "$MCP" && npm test > "$LOGS/final-test.log" 2>&1); then
  echo "[remediation-008] final test PASS" | tee -a "$RUNNER_LOG"
else
  echo "[remediation-008] final test FAIL — see $LOGS/final-test.log" | tee -a "$RUNNER_LOG"
  grep -E "Test Files|Tests  " "$LOGS/final-test.log" | tail -10 | tee -a "$RUNNER_LOG"
fi

echo "[remediation-008] DONE $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$RUNNER_LOG"
