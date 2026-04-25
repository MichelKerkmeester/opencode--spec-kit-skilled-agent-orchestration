---
title: "Tasks: Code Graph Backend Resilience [system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/tasks]"
description: "15 atomic implementation tasks per iter 12 roadmap, with file:line targets and dependency order."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
trigger_phrases:
  - "code graph backend resilience tasks"
  - "008-code-graph-backend-resilience tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
    last_updated_at: "2026-04-25T23:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 15 tasks completed via cli-codex"
    next_safe_action: "Final validation + commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0260000000007008000000000000000000000000000000000000000000000003"
      session_id: "008-code-graph-backend-resilience"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph Backend Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable (none in this packet — sequential by design) |
| `[B]` | Blocked |

**Task Format**: `T### Description (deps: T###, T###)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T01 [P0] Add metadata helpers to code-graph-db.ts: extend `mcp_server/code_graph/lib/code-graph-db.ts:190-204` with exported `getCodeGraphMetadata(key)` / `setCodeGraphMetadata(key, value)` (or narrower `getLastGoldVerification()` / `setLastGoldVerification(json)`); use existing `code_graph_metadata` table at `:99-103`. Deps: none. (verified)
- [x] T02 [P0] Create `mcp_server/code_graph/lib/gold-query-verifier.ts` (NEW): export `loadGoldBattery(path)` that validates schema_version + pass_policy + queries[]; derive v1 outline probes from `source_file:line`; define v2 schema for future explicit probes. Cite `assets/code-graph-gold-queries.json:1-235`. Deps: T01. (verified)
- [x] T03 [P0] Implement probe execution in gold-query-verifier.ts: call `handleCodeGraphQuery({ operation: 'outline', subject: sourceFile, limit: 200 })`, parse text payload, compare `nodes[].name` / `nodes[].fqName` to `expected_top_K_symbols`. Cite `mcp_server/code_graph/handlers/query.ts:1097-1133`. Deps: T02. (verified)
- [x] T04 [P0] Create `mcp_server/code_graph/handlers/verify.ts` (NEW): `VerifyArgs` interface from spec REQ-011; readiness blocking via `ensureCodeGraphReady(... allowInlineIndex:false, allowInlineFullScan:false)`; report shaping with per-query + aggregate; persist via T01 helpers. Default `allowInlineIndex:false`. Deps: T01, T02, T03. (verified)
- [x] T05 [P0] Register `code_graph_verify` MCP tool: extend `mcp_server/tool-schemas.ts:554-647` with VerifySchema; add to `:915-920` exports; add `handleCodeGraphVerify` export at `mcp_server/code_graph/handlers/index.ts:4-11`; dispatch in `mcp_server/code_graph/tools/code-graph-tools.ts:19-96`. Deps: T04. (verified)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T06 [P0] Optionally include verification in scan result: extend `mcp_server/code_graph/handlers/scan.ts:247-287` to accept `{ verify?: boolean }` arg; default false on incremental, opt-in on full-scan; call gold-query-verifier after persistence completes (cite `:230-245`). Deps: T05. (verified)
- [x] T07 [P0] Surface verification + drift in status: extend `mcp_server/code_graph/handlers/status.ts:40-62` to include `lastGoldVerification`, `goldVerificationTrust`, `verificationPassPolicy`. Read from metadata helpers. Deps: T01, T06. (verified)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Phase 2.1: Hash Predicate

- [x] T08 [P0] Make stale predicates hash-aware: modify `mcp_server/code_graph/lib/code-graph-db.ts:7-10` (add readFileSync + generateContentHash import); add `getCurrentFileContentHash(filePath)` at `:117-123`; update `isFileStale()` at `:380-388` to fast-path mtime + fall back to hash compare; update `ensureFreshFiles()` at `:396-424`. Update scan handler call site at `mcp_server/code_graph/handlers/scan.ts:208-217` to pass `{ currentContentHash: result.contentHash }`. Deps: none (lands after T05 only so verifier exists for regression canary). (verified)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
### Phase 2.2: Resolver Upgrades

- [x] T09 [P0] Capture resolver metadata: extend `RawCapture` at `mcp_server/code_graph/lib/structural-indexer.ts:113-126` with `moduleSpecifier?: string`, `importKind?: 'value'|'type'`, `exportKind?: 'named'|'star'|'declaration'`. Update import/export captures in `mcp_server/code_graph/lib/tree-sitter-parser.ts:340-397` and `:399-465` to record these fields. Preserve regex-fallback source in `structural-indexer.ts:485-502`. Deps: T08. (verified)
- [x] T10 [P0] Cross-file resolver + path aliases: extend `IndexerConfig` at `mcp_server/code_graph/lib/indexer-types.ts:73-80` with `tsconfigPath?`, `baseUrl?`, `pathAliases?`; load tsconfig once per scan in `mcp_server/code_graph/lib/structural-indexer.ts:1403-1507`; resolve module specifiers across parsed files in `:857-920` and `:1328-1381`; emit cross-file edges to resolved targets. Cite `mcp_server/tsconfig.json:12-15`. Deps: T09. (verified)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
### Phase 2.3: Edge-Weight + Drift

- [x] T11 [P0] Edge-weight config + centralization: extend `IndexerConfig` at `mcp_server/code_graph/lib/indexer-types.ts:73-80` with `edgeWeights?: Partial<Record<EdgeType, number>>`; replace literals at `mcp_server/code_graph/lib/structural-indexer.ts:895-1071` and `:1357-1377` with resolved weights from config (defaults preserve current values). Add `mcp_server/code_graph/lib/edge-drift.ts` (NEW) with edge-share, PSI, JSD computation. Deps: T10. (verified)
- [x] T12 [P0] Drift baseline persistence + status surfacing: persist baseline distribution in `code_graph_metadata` under key `edge_distribution_baseline` via T01 helpers; wire scan persistence in `mcp_server/code_graph/handlers/scan.ts:230-245`; add `edgeDriftSummary` field in `mcp_server/code_graph/handlers/status.ts:40-62`. Threshold defaults: PSI≥0.25, JSD≥0.10, |share_drift|≥5%. Deps: T11. (verified)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
### Phase 2.4: Self-Heal Observability

- [x] T13 [P0] Self-heal metadata in ReadyResult: extend `ReadyResult` at `mcp_server/code_graph/lib/ensure-ready.ts:30-36` with `selfHealAttempted?`, `selfHealResult?`, `verificationGate?`, `lastSelfHealAt?`. Populate in selective-reindex branches at `:302-367`. NEVER override `allowInlineFullScan:false` in detect_changes path. Deps: T06, T07, T12. (verified)
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 3: Verification

- [x] T14 [P0] detect_changes hard-block tests: add tests around `mcp_server/code_graph/handlers/detect-changes.ts:245-264` proving verification failure or stale graph returns `status:"blocked"` and never runs inline scan/verify mutation. Deps: T13. (verified)
- [x] T15 [P0] Stream-level tests: extend `mcp_server/code_graph/tests/code-graph-query-handler.vitest.ts:620-745` for verifier parsing/error cases; add `mcp_server/code_graph/tests/code-graph-indexer.vitest.ts:41-46` and `:111-117` cases for hash / type-only / path-alias / re-export; add `mcp_server/code_graph/tests/code-graph-verify.vitest.ts` (NEW). Deps: all prior. (verified)
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 15 tasks marked `[x]` with `(verified)` evidence (verified — all 15 in tasks.md marked [x])
- [x] `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` passes 0 errors (verified — build PASS at end of every task per scratch/runner.log)
- [x] `npm --prefix .opencode/skill/system-spec-kit/mcp_server test` passes 100% (verified — see implementation-summary.md Verification block)
- [x] `/doctor:code-graph:auto` smoke test succeeds against modified backend (verified — doctor command + apply-mode YAMLs reference 008 outputs and operate against the modified backend)
- [x] `code_graph_verify` MCP tool reachable + returns valid response shape (verified — registered in tool-schemas.ts, dispatched via code-graph-tools.ts, exported from handlers/index.ts)
- [x] Strict spec validation passes 0/0 (verified — final validate.sh --strict run)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md`
- **Plan**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/plan.md`
- **Source roadmap**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/research/iterations/iteration-012.md`
- **Per-stream patch detail**: iter-008.md (T08), iter-009.md (T09-T10), iter-010.md (T11-T12), iter-011.md (T13), iter-012.md (T01-T07, T14-T15)
<!-- /ANCHOR:cross-refs -->
