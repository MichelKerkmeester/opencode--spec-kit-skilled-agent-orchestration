---
title: "Implementation Summary: Broader Default Excludes and Granular Skills"
description: "Code-graph default scope now excludes five .opencode folders while maintainers can opt in selected folders or selected sk-* skills."
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection"
  - "fingerprint v2"
  - "doc-language opt-in"
  - "candidate manifest drift fix"
  - "stored scope precedence"
  - "FIX-009-v3 readiness"
  - "code-graph readiness remediation"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "026/007/011"
    last_updated_at: "2026-05-03T07:53:43Z"
    last_updated_by: "codex"
    recent_action: "FIX-011-FOLLOWUP-2 implemented."
    next_safe_action: "Review gate results, then hand off without committing."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts"
      - ".mcp.json"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:6666666666666666666666666666666666666666666666666666666666666666"
      session_id: "026-007-011-readiness-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Edge-count drift between scan response and status response (~1k edge diff) — separate accounting concern, not blocking"
      - "calls_to/calls_from returns 0 for some symbols in opted-in code (e.g. getDefaultConfig) despite outline showing the function — separate edge-extraction issue"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-broader-scope-excludes-and-granular-skills |
| **Completed** | 2026-05-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Code-graph scans now keep five internal-heavy `.opencode` folders out of the default index: skill, agent, command, specs and plugins. Maintainers can opt those folders back in per folder, and skills can be included as all skills or a selected `sk-*` list.

### Scope Policy

The resolver now parses five env vars, per-call folder booleans, `includeSkills: boolean | string[]`, csv skill env values, and deterministic v2 fingerprints. V1 fingerprints intentionally parse as null so readiness requires a full scan before graph reads trust older stored scope.

### Scan Consumers

`getDefaultConfig()` builds exclude globs from the resolved policy, while `shouldIndexForCodeGraph()` remains the final guard. Skill lists are enforced in the walker so selected skill folders can be included without opening every skill folder.

### Schemas and Status

The scan handler accepts the new args, status reports expanded active scope fields, and both public and runtime schema validators now handle selected skill arrays. The public validator also understands property-level unions and string regex checks.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/code_graph/lib/index-scope-policy.ts` | Modified | Scope constants, env parsing, v2 fingerprints. |
| `mcp_server/code_graph/lib/indexer-types.ts` | Modified | Default config consumes all policy globs. |
| `mcp_server/lib/utils/index-scope.ts` | Modified | Walker enforces five folders and selected skills. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Modified | Stored scope returns expanded fields. |
| `mcp_server/code_graph/handlers/scan.ts` | Modified | New scan args. |
| `mcp_server/code_graph/handlers/status.ts` | Modified | Expanded active scope payload. |
| `mcp_server/tool-schemas.ts` | Modified | Public scan schema. |
| `mcp_server/schemas/tool-input-schemas.ts` | Modified | Zod scan schema. |
| `mcp_server/utils/tool-input-schema.ts` | Modified | Public property union and regex validation. |
| `mcp_server/code_graph/tests/*.vitest.ts` | Modified | Scope matrix, v2 round-trip, v1 migration. |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Modified | Schema acceptance and rejection coverage. |
| `mcp_server/code_graph/README.md` | Modified | Operator docs. |
| `mcp_server/ENV_REFERENCE.md` | Modified | Env var docs. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

R5 fix-completeness drove the implementation: first inventory same-class `.opencode` folder producers, then audit every `IndexScopePolicy` consumer, then add matrix tests for default, env and per-call behavior. The public schema validator gap was found by focused tests and fixed as part of the same consumer audit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use v2 fingerprints and reject v1 parsing | Stored v1 scope cannot represent the broader folders or selected skills. Blocking reads until full scan is safer. |
| Filter selected skills in the walker | A blanket `.opencode/skill/**` glob would prevent traversal into selected skill folders. |
| Sort selected skill names before fingerprinting | Equivalent input order must produce the same stored scope. |
| Extend public validator | Zod alone was not enough because the public schema path accepted invalid selected skill payloads. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Gate A focused Vitest | PASS: 4 files, 174 tests. |
| Gate B full code-graph Vitest | PASS: 19 files, 244 tests. |
| Gate C workflow-invariance | PASS: 1 file, 2 tests. |
| Gate D strict validate 009 + 011 | PASS: both packets strict-validated with 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

### **P1 globs fix (post-DR-011 remediation)**

DR-011 iteration 5 found that a scan could store selected-skill and agent scope text while `code_files` omitted document-like files from the opted-in folders. The remediation extends code-graph discovery to persist `md`, `json`, `jsonc`, `yaml`, `yml`, and `toml` files as `language='doc'` rows with zero nodes and zero edges. Finding reference: `review/iterations/iteration-005.md` P1 item 1.

| File | Action |
|------|--------|
| `mcp_server/code_graph/lib/indexer-types.ts` | Added `doc` language detection, default include globs, and default language config. |
| `mcp_server/code_graph/lib/structural-indexer.ts` | Short-circuits doc parsing before tree-sitter and returns empty clean parse results. |
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | Keeps tree-sitter's exhaustive language helpers type-safe after adding the doc lane. |
| `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts` | Added doc detection, selected-skill/agent regression, 24-cell folder/file-type matrix, and default-exclude regression. |
| `mcp_server/code_graph/tests/code-graph-doc-language.test-d.ts` | Added a type-level guard that `SupportedLanguage` includes `doc`. |

LOC delta for code and test files before this summary update: +214 / -8.

R5 audit results:
- Same-class producers: `rg -n "'\\*\\*/\\*\\.(ts|py|sh)" .opencode/skill/system-spec-kit/mcp_server/` and `rg -n "includeGlobs" .opencode/skill/system-spec-kit/mcp_server/` found one production default producer, `indexer-types.ts`, patched here. Other hits are tests, stress fixtures, schema fields, or the scan handler's user-provided override.
- Cross-consumer audit: `rg -n "from code_files|FROM code_files|code_files\\b" .opencode/skill/system-spec-kit/mcp_server/ --type ts` found path/hash/count/status consumers. They tolerate `language='doc'`, `node_count=0`, and `edge_count=0` because node and edge reads join through `code_nodes`/`code_edges`, while file-level readers use paths, hashes, counts, timestamps, or parse health summaries.
- Gates A-D: A pass, B pass, C pass, D exact worktree-wide command blocked by unrelated pre-existing diffs; task-scoped path check pass.

---

<!-- ANCHOR:readiness-fixes-009-v3 -->
### **Readiness fixes (FIX-009-v3)**

After shipping the doc-language extension, an end-to-end cli-opencode scope test surfaced two readiness bugs in the auto-heal layer that pre-dated 011 but were exposed clearly by the new opted-in scope. A third nuance in the cross-session env-drift gate was also tightened.

| Bug | Root cause | Fix |
|-----|------------|-----|
| Manifest drift after explicit scan | `recordCandidateManifest()` was only called from the inline auto-heal path in `ensureCodeGraphReady`, never from the explicit `code_graph_scan` handler. Status reported `freshness:stale` with reason `candidate manifest drift: indexable file set has changed since last scan` immediately after a successful user-triggered scan. | Export `recordCandidateManifest`; call it from `scan.ts` after a successful full scan (`!effectiveIncremental && errors.length === 0`). |
| Read-time scope re-resolution | Inline auto-heal called `getDefaultConfig(rootDir)` with no policy → fell through to `resolveIndexScopePolicy()` reading env vars → mismatched the stored per-call disabled scope → blocked reads. | Recover stored policy via `parseIndexScopePolicyFromFingerprint(getStoredCodeGraphScope())` in both inline-scan call sites and pass to `getDefaultConfig(rootDir, storedPolicy)`. Falls through to env when no stored scope. |
| Env-drift gate over-fired on per-call probes | `detectState()` flipped to `stale + full_scan` whenever stored fingerprint ≠ env-resolved fingerprint, even when the stored scope came from an explicit per-call probe (`source: 'scan-argument'`) — making the read-after-scan workflow unusable for per-call args. | FIX-009-v3: gate now honors `source` — when stored scope is `'scan-argument'`, trust the user's explicit choice regardless of env drift. Gate continues to fire for `source: 'env'` or `'default'` (cross-session env-change contract intact). |

| File | Action |
|------|--------|
| `mcp_server/code_graph/lib/ensure-ready.ts` | Exported `recordCandidateManifest`; added stored-scope reuse block before inline-scan; both call sites pass `storedPolicy ?? undefined` to `getDefaultConfig`; gate at `detectState()` honors `source==='scan-argument'`. |
| `mcp_server/code_graph/handlers/scan.ts` | Imported `recordCandidateManifest` from `ensure-ready`; called after successful full scan to refresh baseline. |
| `mcp_server/code_graph/tests/code-graph-scope-readiness.vitest.ts` | Updated `requires an explicit full scan when ...` test to use env-derived stored scope (preserves env-drift contract); added FIX-009-v3 test asserting per-call stored scope is trusted across env drift. |
| `.mcp.json`, `opencode.json` | Added 5 `SPECKIT_CODE_GRAPH_INDEX_*=true` env vars in the `spec_kit_memory` MCP block (Claude Code + OpenCode runtimes pick them up at MCP server spawn). |

LOC delta: +44 / -8 across the 3 source files; +24 in the test file.

Verification:
- `tsc --noEmit` clean
- `tsc --build` clean (dist/ regenerated)
- 96/96 vitest pass across `code-graph-candidate-manifest`, `code-graph-scope-readiness`, `code-graph-indexer`, `code-graph-scan` suites
- cli-opencode end-to-end re-test in flight (BG `bayzmpyv0`); pre-fix surfaced both bugs with concrete evidence

Known follow-on concerns surfaced by the test (out of scope for this remediation):
- Edge counts diverge between `code_graph_scan` response and immediate `code_graph_status` (~1k edge difference) — accounting concern, not blocking
- `calls_to`/`calls_from` returns 0 for some symbols in opted-in code (e.g. `getDefaultConfig`) despite outline showing the function — separate edge-extraction issue, not readiness-related

<!-- /ANCHOR:readiness-fixes-009-v3 -->

---

### **FIX-011-FOLLOWUP-2: cross-file CALLS resolution**

This resolves the follow-on concern listed above: `calls_to` / `calls_from` returned 0 for opted-in symbols such as `getDefaultConfig` even when the outline showed the target and callers existed. Root cause: per-file CALLS extraction could point at an import proxy in the caller file; name resolution later selected the actual function node, which had no inbound CALLS edges.

Approach: Option A. After scan persistence, `scan.ts` now runs a DB-backed cross-file resolver before reading post-persist counts. The resolver rewrites only CALLS edges whose target is an import proxy and whose global same-name function/method/class target is unique in a different file. Ambiguous targets and already-concrete targets are left unchanged, so a second resolver run is idempotent.

| File | Action |
|------|--------|
| `mcp_server/code_graph/lib/cross-file-edge-resolver.ts` | Added the post-persist resolver and stats for resolved, unresolved, and ambiguous CALLS edges. |
| `mcp_server/code_graph/handlers/scan.ts` | Runs the resolver after edge persistence and before post-persist `getStats()`, then surfaces resolver stats in `graphEdgeEnrichmentSummary` when any CALLS edge was examined. |
| `mcp_server/code_graph/lib/code-graph-db.ts` | Extended `GraphEdgeEnrichmentSummary` with optional cross-file CALLS resolver stats. |
| `mcp_server/code_graph/tests/code-graph-scan.vitest.ts` | Updated scan-handler mocks for the new resolver import. |
| `mcp_server/code_graph/tests/code-graph-cross-file-edges.vitest.ts` | Added integration coverage for the resolver behavior. |

LOC delta before this summary update: +462 / -9 across code and tests.

R5 audit summary:
- Same-class producers: `rg -n "edgeType: 'CALLS'" .opencode/skill/system-spec-kit/mcp_server --glob '*.ts'` found one production CALLS producer, `mcp_server/code_graph/lib/structural-indexer.ts`; no second producer required a patch. Other hits are query constants, tests, stress fixtures, or benchmarks.
- Cross-consumer audit: `rg -n "queryEdgesFrom|queryEdgesTo|CALLS|calls_to|calls_from|blast_radius|queryStartupHighlights|queryFileDegrees" .opencode/skill/system-spec-kit/mcp_server/code_graph --glob '*.ts'` found relationship queries, context neighborhoods, startup highlights, file-degree reads, and blast-radius reads. They all consume `code_edges` by `source_id` / `target_id` joins; import nodes remain in `code_nodes`, and only qualifying CALLS target IDs change.
- Idempotence: covered by repeated full scan plus a direct second resolver pass.
- Negative case: same-file function-to-function CALLS edge remains unchanged.

Tests added:
- `rewrites an imported function call to the exported definition after a full scan`
- `leaves imported call targets on the import node when same-name definitions are ambiguous`
- `is idempotent across repeated full scans`
- `leaves same-file function call targets unchanged on a second resolver pass`
- `resolves getDefaultConfig calls from scan and ensure-ready fixtures`

Verification:
- Gate A: pass — `vitest --typecheck.only` reported no type errors.
- Gate B: pass — current code-graph suite reported 254/254 passing tests.
- Gate C: pass — strict packet validation reported 0 errors and 0 warnings.
- Gate D: fail for the exact command — the shared worktree contains tracked diffs outside this packet's allowed paths, so the provided grep pipeline prints `FAIL: scope creep`.

---

### **FIX-011-FOLLOWUP-1: edge-count divergence**

This resolves the first follow-on concern: scan response reported `totalEdges = N` while immediate `code_graph_status` reported `totalEdges = M ≠ N`. Root cause: `scan.ts` summed `result.edges.length` per-file *before* persistence, while `code_graph_status` reads `getStats()` which counts post-persist DB rows. Per-file `replaceEdges()` deletes-then-inserts (per-source dedup), so the in-memory sum could exceed the row count by the dedup amount.

| File | Action |
|------|--------|
| `mcp_server/code_graph/handlers/scan.ts` | Replaced in-loop `totalNodes/totalEdges` accumulators in the response with `graphDb.getStats()` POST-PERSIST counts; reused the same `persistedStats` reference for `lastPersistedAt`. |

LOC delta: +9 / -1.

Verification:
- Direct cli-opencode probe: scan response `totalEdges = 37,180` matches immediate status `totalEdges = 37,180` exactly.

---

### **FIX-011-FOLLOWUP-3: tree-sitter wasm path resolution**

Discovered while end-to-end-verifying FIX-011-FOLLOWUP-2. The MCP server runs from `dist/code_graph/lib/tree-sitter-parser.js`. The pre-fix wasm path was `resolve(__dirname, '../../node_modules/tree-sitter-wasms/out', ...)` which is correct from `code_graph/lib/` (source, runs in tests via vitest) but wrong from `dist/code_graph/lib/` (`dist/` has no `node_modules/` child). Result: `web-tree-sitter` init silently failed with `ENOENT`, the parser degraded to a regex fallback that extracted only the first ~3 callable nodes per file, leaving 60–80% of production symbols missing from `code_nodes`. This was the actual root cause of "calls_to returns 0" — the function definitions for `getDefaultConfig`, `recordCandidateManifest`, etc. were never even indexed.

| File | Action |
|------|--------|
| `mcp_server/code_graph/lib/tree-sitter-parser.ts` | Switched to `createRequire(import.meta.url)` + `require.resolve('tree-sitter-wasms/package.json')` to locate the wasm out-dir via Node module resolution. Falls back to the legacy `../../node_modules/...` relative path if the package resolution fails. |

LOC delta: +20 / -3.

Verification:
- Direct parse of `indexer-types.ts` from dist: pre-fix extracted 21 nodes (truncated at line 123); post-fix extracts 42 nodes including `getDefaultConfig` at line 142.
- Repository-wide scan: pre-fix `totalEdges = 16,549`; post-fix `totalEdges = 37,180` (+125%).
- cli-opencode probe `calls_to: getDefaultConfig` and `calls_to: recordCandidateManifest` both return real production callers (`scan.ts:handleCodeGraphScan`, `ensure-ready.ts:ensureCodeGraphReady`).

Caveat: when a function with the same name exists in BOTH a test fixture and production code, the cross-file resolver conservatively skips the rewrite (intentional safety). Real-world queries on uniquely-named symbols resolve cleanly; ambiguous duplicates require querying by `symbolId`.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Per-folder tracked-file counts are not split out.** Status preserves the existing `excludedTrackedFiles` field and expands active scope, but does not add separate counters for agent, command, specs or plugins.
<!-- /ANCHOR:limitations -->
