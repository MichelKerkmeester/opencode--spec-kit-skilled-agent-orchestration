---
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
title: "Implementation Summary: causal-graph window metrics [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/implementation-summary]"
description: "Implemented causal-stats relation-window balance metrics and per-relation per-window causal-edge caps; package build is blocked by an out-of-scope memory-context type error."
trigger_phrases:
  - "causal graph window metrics summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics"
    last_updated_at: "2026-04-27T10:05:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented source/test patches; targeted Vitest and dist marker checks pass"
    next_safe_action: "Fix build blocker; restart MCP; run live probe"
    blockers:
      - "npm run build exits non-zero on handlers/memory-context.ts TS2741 missing intentEvidence, outside packet 011 source scope"
      - "Live runtime probe requires MCP daemon/client restart per packet 013"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-causal-graph-window-metrics |
| **Completed** | Provisional: 2026-04-27 source/tests/dist markers complete; package build blocked |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented packet 011's causal graph window metrics and relation cap behavior.

Built behavior:
- `memory_causal_stats` now zero-fills all six valid relations in `by_relation`.
- `memory_causal_stats` now emits `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, optional `remediationHint`, and `windowStartedAt`.
- Relation balance uses a rolling 15-minute window, `0.80` dominance threshold, `50` edge skew minimum, and `5` edge insufficient-data floor.
- Supersedes window skew emits the packet hint: `prediction-error supersedes burst — review create-record producer`.
- `health` now reports `degraded` when `meetsTarget:false`.
- `insertEdge`, `insertEdgesBatch`, and `bulkInsertEdges` route new inserts through a per-relation rolling-window cap.
- Default cap is configurable via `SPECKIT_CAUSAL_RELATION_WINDOW_MS` and `SPECKIT_CAUSAL_RELATION_CAP_PER_WINDOW`; default values are 15 minutes and 100 edges.
- Prediction-error cross-path supersedes producer in `create-record.ts` was verified read-only: it routes through `causalEdges.insertEdge(..., 'auto')`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts` | Modified | Added relation-window stats helper, zero-filled relation counts, new response fields, and `meetsTarget:false -> health:"degraded"` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modified | Added `enforceRelationWindowCap`, env-configurable defaults, and insert gating for direct, batch, and bulk paths |
| `.opencode/skill/system-spec-kit/mcp_server/tests/integration-causal-graph.vitest.ts` | Modified | Added empty DB zero-fill, health reconciliation, and supersedes-burst skew coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts` | Modified | Added 105-insert cap fixture asserting 100 inserted and 5 throttled WARNs |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts` | Read-only verified | Prediction-error supersedes route already uses gated `causalEdges.insertEdge` path |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics/implementation-summary.md` | Modified | Recorded implementation and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly against `spec.md`, `tasks.md`, 007 research §5/Q7, §9 causal relation balance pattern, §11 recommendation #5, and packet 013's MCP rebuild/restart protocol.

Packet 013 requires source diff, targeted tests, dist verification, runtime restart, and live probe before a full runtime completion claim. Source, targeted tests, and dist marker checks are complete here. Runtime restart and live `memory_causal_stats()` probe remain blocked until the MCP-owning client restarts its daemon child process. The package build command also exits non-zero on a scoped-out `memory-context.ts` type error, recorded below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rolling 15-min window | Matches the 005/REQ-010 capture window where 344 supersedes appeared. |
| 80% dominance + 50 edge minimum | 007 §12 starting point; tunable in production. |
| Conservative 100/window cap initial | Avoid throttling legitimate growth; first iteration is detection-focused. |
| Cap only new rows, not duplicate updates | Existing upsert updates should not be blocked by an insert-volume cap. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Targeted Vitest | PASS | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/*causal-graph*.vitest.ts tests/causal-edges*.vitest.ts` -> 5 files passed, 226 tests passed |
| Empty DB zero-fill | PASS | `T014-CS4` asserts `by_relation` and `deltaByRelation` contain all six relation keys at zero |
| Health/meetsTarget reconciliation | PASS | `T014-CS5` asserts `meetsTarget:false` with `health:"degraded"` |
| Supersedes burst skew fixture | PASS | `T014-CS6` inserts 60 supersedes edges and asserts `balanceStatus:"relation_skewed"`, `dominantRelation:"supersedes"`, share near `1.0`, and remediation hint |
| Per-window cap fixture | PASS | `causal-edges.vitest.ts` inserts 105 supersedes attempts: 100 inserted, 5 throttled, 5 WARN calls observed |
| `npm run build` | FAIL | `tsc --build` exits with `handlers/memory-context.ts(1771,7): error TS2741: Property 'intentEvidence' is missing...`; file is outside packet 011 source scope |
| `grep -l deltaByRelation .opencode/skill/system-spec-kit/mcp_server/dist/handlers/causal-graph.js` | PASS | Matched `dist/handlers/causal-graph.js` |
| `grep -l balanceStatus .opencode/skill/system-spec-kit/mcp_server/dist/handlers/causal-graph.js` | PASS | Matched `dist/handlers/causal-graph.js` |
| `grep -l enforceRelationWindowCap .opencode/skill/system-spec-kit/mcp_server/dist/lib/storage/causal-edges.js` | PASS | Matched `dist/lib/storage/causal-edges.js` |
| Dist timestamp check | PASS | `dist/handlers/causal-graph.js` and `dist/lib/storage/causal-edges.js` mtimes are newer than their source files |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/006-causal-graph-window-metrics --strict` | PASS | Errors 0, Warnings 0 |
| Live `memory_causal_stats()` probe | PASS | Recorded 2026-04-27T10:12:36.021Z (fresh Claude Code session post-2026-04-26 dist rebuild). `total_edges:2527`, `link_coverage_percent:"85.65%"`, `health:"healthy"`, `meetsTarget:true`. All 6 `by_relation` keys present (`caused:1193`, `enabled:0`, `supersedes:819`, `contradicts:0`, `derived_from:0`, `supports:515`). `deltaByRelation` zero-filled, `balanceStatus:"insufficient_data"`, `windowStartedAt:"2026-04-27T09:57:39.113Z"`, `dominantRelation:null`, `dominantRelationShare:0` — consistent idle-window state per REQ-003. Burst skew branch (REQ-004) not exercised on this probe; covered by `T014-CS6` fixture. |

REQ acceptance criteria:

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-001 all six relation keys | PASS | Zero-fill helper covers all `RELATION_TYPES`; `T014-CS4` verifies empty DB response |
| REQ-002 health agrees with meetsTarget | PASS | Stats builder returns `degraded` when `meetsTarget:false`; `T014-CS5` verifies |
| REQ-003 relation balance fields | PASS | Response includes `deltaByRelation`, `dominantRelation`, `dominantRelationShare`, `balanceStatus`, `windowStartedAt`; `T014-CS1` verifies shape |
| REQ-004 supersedes burst hint | PASS | `T014-CS6` verifies skew status and prediction-error supersedes remediation hint |
| REQ-005 per-relation per-window cap | PASS | Storage cap gates `insertEdge`, batch via `insertEdge`, and `bulkInsertEdges`; cap fixture verifies 100/105 success ratio |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cap is conservative.** First iteration is detection-focused; cap may need tuning based on production telemetry.
2. **Backfill of historical missing relations is out of scope.** Only new edges are gated; old supersedes-only data remains.
3. **Package build is blocked outside packet 011.** The causal graph source emitted updated dist markers, but `npm run build` exits non-zero on `handlers/memory-context.ts` missing `intentEvidence`.
4. **Daemon restart is still required.** Per packet 013, rebuilt `dist` on disk is not enough; the MCP-owning client/runtime must restart before live probes can prove the daemon loaded these changes.
<!-- /ANCHOR:limitations -->
