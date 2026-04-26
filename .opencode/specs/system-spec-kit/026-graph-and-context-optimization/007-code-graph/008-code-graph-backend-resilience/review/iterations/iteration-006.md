# Iteration 006

**Run Date:** 2026-04-26
**Dimension:** correctness
**Focus:** T13 self-heal observability + detect_changes hard block
**Verdict Snapshot:** CONDITIONAL

## Summary

- The read-only hard block is still wired correctly at the handler boundary: `detect_changes` calls `ensureCodeGraphReady()` with `{ allowInlineIndex:false, allowInlineFullScan:false }`, and the new tests do assert that exact argument shape via a spy.
- On the selective-reindex path, the new observability fields are consistently populated. `selfHealResult` resolves to `skipped` when inline indexing is disabled, `ok` when the post-heal probe comes back `fresh/none`, and `failed` when the selective reindex still leaves the graph non-fresh or throws. `lastSelfHealAt` is emitted in ISO-8601 form via `toISOString()`.
- Two correctness issues remain. The `verificationGate` signal does not survive the already-fresh `action:"none"` path, so `detect_changes` misses the documented “failed verification => blocked” contract in steady state; and `lastSelfHealAt` currently timestamps skipped/failed attempts rather than the last completed heal.

## Findings

### P0

- None.

### P1

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:346-359` with `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:104-105,253-266` and `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:85-110` — the new verification hard block is not actually preserved for the steady-state “graph is fresh, last gold verification failed” case required by [spec.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:106) and repeated in [implementation-summary.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/implementation-summary.md:66). `ensureCodeGraphReady()` only computes `verificationGate` when `state.action === 'selective_reindex'`; the `state.action === 'none'` return drops it entirely. That means a fresh graph with a persisted failed verification reaches `detect_changes` as plain `{ freshness:'fresh', action:'none' }`, so `readinessRequiresBlock()` returns false and the handler answers `status:"ok"` instead of blocking. The added test passes only because it mocks an unreachable production shape (`action:'none'` plus `verificationGate:'fail'` and `selfHealAttempted:false`) rather than exercising the real helper contract. Fix: compute/preserve `verificationGate` independently of `state.action`, then add a test that covers the real “fresh graph + failed verification” path instead of a mock-only state.

### P2

- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:349-350,362-373,428-443` — `lastSelfHealAt` currently means “when this selective-reindex branch was evaluated,” not “when a self-heal last happened.” It is stamped before any branch decision and returned even when `allowInlineIndex:false` causes `selfHealResult:'skipped'`, and again when the reindex throws and returns `selfHealResult:'failed'`. That makes the observability field misleading for operators: a read-only `detect_changes` request can appear to have performed a recent heal when no healing occurred. Fix: only populate `lastSelfHealAt` after a successful inline reindex, or rename/split the field into attempt-vs-success timestamps.

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/spec.md:103-108`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/implementation-summary.md:66-68`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:30-39,110-141,344-445`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts:104-105,245-266`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:56-183`

## Convergence Signals

- `selfHealResult` is internally consistent on the reviewed path: `skipped` is the read-only selective branch, `ok` means the post-heal probe returned `fresh/none`, and `failed` means either the reindex still left stale work or the auto-index threw.
- The hard-block call contract itself is intact. `detect_changes` still passes `{ allowInlineIndex:false, allowInlineFullScan:false }`, and the test file asserts that exact spy shape at lines `79-82`, `107-110`, and `160-163`.
- `verificationGate:'fail'` does not bubble into a non-fresh `freshness` state. The handler compensates locally by formatting `fresh-with-failed-verification` in the blocked reason, but that logic only runs when the gate field is present on the `ReadyResult`.
