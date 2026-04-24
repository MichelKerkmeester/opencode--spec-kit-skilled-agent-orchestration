---
title: "Implementation Plan: Feedback [system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline/plan]"
description: "Evidence-based plan status for the shipped feedback signal pipeline. Records completed implementation work and the remaining verification gaps."
trigger_phrases:
  - "feedback pipeline plan"
  - "feedback implementation"
  - "query flow tracker"
  - "sticky session fallback"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Feedback Signal Pipeline

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite feedback ledger (`feedback_events`) |
| **Testing** | Vitest + `npx tsc --noEmit` |

### Overview
The implementation is already present in the repo. `memory-search.ts` emits `result_cited` and query-flow events, `query-flow-tracker.ts` manages bounded per-session history and `follow_on_tool_use` correlation helpers, and `context-server.ts` provides the sticky `lastKnownSessionId` fallback needed for sessionless follow-on tools. The newly landed evidence closes the remaining verification gaps: typecheck passes, the combined TMPDIR Vitest rerun passes at 3 files / 451 tests, and the benchmark harness shows sub-5ms overhead for the tracked signal path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and current-code drift are documented in `spec.md`
- [x] Actual implementation surfaces are identified (`memory-search.ts`, `query-flow-tracker.ts`, `context-server.ts`)
- [x] Available repo evidence is identified before making completion claims

### Definition of Done
- [x] Core feedback wiring is present in the current repo
- [x] Typecheck and the passing handler/ledger Vitest suites are rerun successfully
- [x] `tests/query-flow-tracker.vitest.ts` passes cleanly
- [x] The `<5ms` async-overhead claim is backed by recorded evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow-only event instrumentation layered onto existing search and tool-dispatch flows.

### Key Components
- **Feedback Ledger**: `feedback-ledger.ts` remains the single event storage path and confidence mapper.
- **Query Flow Tracker**: `query-flow-tracker.ts` maintains bounded per-session query history, Jaccard similarity detection, and helper emitters.
- **Search Hook**: `memory-search.ts` captures `shownIds`, calls `trackQueryAndDetect()`, and emits `result_cited` for `includeContent` runs.
- **Dispatch Hook**: `context-server.ts` remembers `lastKnownSessionId` and emits `follow_on_tool_use` for sessionless non-search tool calls.

### Data Flow
```text
memory_search
  ├─► parse results -> shownIds
  ├─► trackQueryAndDetect(db, sessionId, queryId, shownIds)
  │     ├─► query_reformulated when 0.3 <= similarity < 0.8
  │     └─► same_topic_requery when similarity >= 0.8
  └─► logResultCited(db, sessionId, queryId, shownIds) when includeContent=true

non-search tool dispatch
  ├─► resolveSessionTrackingId(args, extra)
  ├─► fall back to lastKnownSessionId when missing
  └─► logFollowOnToolUse(db, followOnSessionId)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core Tracker and Ledger Wiring
- [x] Create `query-flow-tracker.ts` with bounded session cache and similarity detection
- [x] Keep all event writes on `logFeedbackEvent()` in `feedback-ledger.ts`
- [x] Verify five event types and confidence tiers remain enumerated centrally

### Phase 2: Search and Dispatch Hooks
- [x] Wire `trackQueryAndDetect()` and `logResultCited()` into `memory-search.ts`
- [x] Wire `follow_on_tool_use` into `context-server.ts` with sticky `lastKnownSessionId`
- [x] Preserve fail-safe `try/catch` boundaries so feedback logging never breaks the main path

### Phase 3: Verification and Packet Closeout
- [x] Re-run `npx tsc --noEmit`
- [x] Re-run `npx vitest run tests/context-server.vitest.ts`
- [x] Re-run `npx vitest run tests/feedback-ledger.vitest.ts tests/context-server.vitest.ts`
- [x] Re-run `tests/query-flow-tracker.vitest.ts` cleanly as part of the combined TMPDIR Vitest command
- [x] Record benchmark evidence for the `<5ms` claim
- [x] Truth-sync `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Current Evidence |
|-----------|-------|------------------|
| Static | TypeScript compile safety | `npx tsc --noEmit` rerun 2026-04-03 — PASS |
| Handler regression | Sticky-session follow-on behavior | Covered by `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/query-flow-tracker.vitest.ts tests/context-server.vitest.ts tests/feedback-ledger.vitest.ts` — PASS (451 tests total) |
| Combined regression | Ledger + dispatcher behavior together | Same combined TMPDIR Vitest rerun — PASS, 3 files / 451 tests |
| Dedicated tracker/unit suite | Query-flow tracker thresholds, TTL, result_cited, follow-on window, and packet DB flow | Same combined TMPDIR Vitest rerun — PASS |
| Benchmark | Async signal-path overhead | `node --input-type=module` benchmark in `.opencode/skill/system-spec-kit/mcp_server` — `averageMs: 0.030233255999999983`, `p95Ms: 0.06591600000000142`, `maxMs: 0.43650000000000233` |
| Live MCP runtime | Five-event emission after restart | Historical packet evidence remains valid and is retained as prior runtime evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feedback-ledger.ts` | Internal | Green | Core event storage and confidence mapping |
| `memory-search.ts` | Internal | Green | Required for `result_cited` and query-flow emission |
| `context-server.ts` | Internal | Green | Required for sticky follow-on correlation |
| `tests/query-flow-tracker.vitest.ts` | Internal | Green | Confirms tracker thresholds, TTL, result_cited, follow-on window, and the new DB-level packet flow |
| Benchmark evidence for async overhead | Verification | Green | Supports packet closeout for the `<5ms` claim |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Feedback instrumentation causes correctness or latency regression.
- **Procedure**: Disable implicit feedback logging with `SPECKIT_IMPLICIT_FEEDBACK_LOG=false`.
- **Packet implication**: If rollback becomes necessary, reopen this packet and reclassify all completion claims as historical only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (tracker + ledger)
  └─► Phase 2 (search + dispatch hooks)
        └─► Phase 3 (verification + closeout)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Existing feedback ledger | Phase 2, Phase 3 |
| Phase 2 | Phase 1 tracker/ledger contract | Phase 3 |
| Phase 3 | Phase 2 implementation | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Current State |
|-------|------------|---------------|
| Phase 1: Tracker + ledger | Medium | Complete |
| Phase 2: Search + dispatch hooks | Medium | Complete |
| Phase 3: Verification + closeout | Medium | Complete |
| **Total** | | **Implementation and verification complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Feedback logging remains shadow-only by default
- [x] Search and dispatch hooks are wrapped in `try/catch`
- [x] Packet now distinguishes rerun verification from prior live evidence

### Rollback Procedure
1. Set `SPECKIT_IMPLICIT_FEEDBACK_LOG=false`.
2. Re-run the passing handler/ledger suites to confirm the disabled state is stable.
3. Record any rollback evidence in this packet before changing its status again.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Existing ledger rows can be retained for audit, or explicitly deleted with a targeted SQL cleanup if required by a follow-up packet.
<!-- /ANCHOR:enhanced-rollback -->
