---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: memory_context truncation contract + token telemetry [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/003-memory-context-truncation-contract/plan]"
description: "Add preEnforcementTokens / returnedTokens / droppedAllResultsReason to meta.tokenBudgetEnforcement and assert payload/count invariant. Backward-compatible additive change to memory_context wrapper."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "memory context truncation plan"
  - "token telemetry implementation"
  - "preEnforcementTokens implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/003-memory-context-truncation-contract"
    last_updated_at: "2026-04-27T09:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan with Phase 1-3 work units"
    next_safe_action: "Dispatch cli-codex on tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: memory_context truncation contract + token telemetry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 18+) |
| **Framework** | MCP server (custom) |
| **Storage** | None (telemetry layer only) |
| **Testing** | vitest |

### Overview
Additive contract changes to `mcp_server/handlers/memory-context.ts` that distinguish pre-enforcement and returned token counts, name empty-fallback outcomes explicitly, and assert payload/count invariant in tests. No behavior change to the budget enforcement algorithm itself; only telemetry shape and test rigor.

### Root Cause (per 007 research §5 Q5 + §9)
The `enforceTokenBudget()` function reports `actualTokens` from the FINAL fallback envelope. When the fallback chain hits the legacy zero-fill envelope (`fallbackToStructuredBudget` at `memory-context.ts:551-580` and `:607-614`), `actualTokens` becomes the post-fallback size — typically a tiny stub. The 005 fix added a sanity-guard early return for `<50% utilization`, but the metadata still misrepresents the situation when truncation actually triggers. Without a `preEnforcementTokens` field, callers cannot tell whether they hit a real overflow or a fallback collapse.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear (005 Probe B + 007 §5 Q5)
- [x] Success criteria measurable (REQ-001..005)
- [x] Dependencies identified (rebuild protocol from packet 013)

### Definition of Done
- [ ] All REQ-001..005 acceptance criteria met (vitest green)
- [ ] `npm run build` clean
- [ ] dist marker grep confirms new fields compiled
- [ ] 005 Probe B re-run after MCP daemon restart shows `count > 0`
- [ ] Validation passes via `validate.sh --strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive telemetry layer — no algorithmic change.

### Key Components
- **enforceTokenBudget()** in `mcp_server/handlers/memory-context.ts`: token budget gate. Add `preEnforcementTokens` capture before the first compaction pass.
- **fallbackToStructuredBudget()** helpers: chain of envelopes. Last envelope MUST emit `droppedAllResultsReason`.
- **Final assembly site**: where `meta.tokenBudgetEnforcement` is built. Add `returnedTokens` measurement of the final emitted payload.

### Data Flow
```
input -> compute pre-enforcement tokens -> if under budget: emit unmodified
       -> else: structural compaction -> measure
       -> else: fallback envelope chain -> measure
       -> if final results.length===0: droppedAllResultsReason set
       -> emit response with meta.tokenBudgetEnforcement carrying all 3 token fields
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Changes
- [ ] Read `mcp_server/handlers/memory-context.ts` end-to-end (focus on `:447-840`).
- [ ] Add `preEnforcementTokens` capture at `:447` boundary.
- [ ] Thread `preEnforcementTokens` through fallback path so it reaches the final meta builder.
- [ ] Add `returnedTokens` measurement at the final emit site.
- [ ] Add `droppedAllResultsReason` setter when fallback envelope produces empty results.
- [ ] Keep `actualTokens` as alias = `returnedTokens` (backward compat).

### Phase 2: Test Updates
- [ ] Author shared test helper `expectReturnedCountMatchesPayload()` (per 007 §9 example).
- [ ] Update `mcp_server/tests/token-budget-enforcement.vitest.ts` to assert invariant.
- [ ] Add new test: under-budget payload — `preEnforcementTokens === actualTokens`, no truncation.
- [ ] Add new test: over-budget but resolvable — `preEnforcementTokens > budgetTokens`, `returnedTokens <= budgetTokens`, count matches payload.
- [ ] Add new test: impossible-budget fallback — `droppedAllResultsReason === "impossible_budget"`.
- [ ] Update `mcp_server/tests/memory-context.vitest.ts` lines 890-916 / 956-969 to use the helper.

### Phase 3: Build + Verification
- [ ] `cd mcp_server && npm test -- --run tests/token-budget-enforcement.vitest.ts tests/memory-context.vitest.ts` → green.
- [ ] `cd mcp_server && npm run build` → clean.
- [ ] grep dist for new field marker (e.g., `grep -l preEnforcementTokens dist/handlers/memory-context.js`).
- [ ] Document MCP daemon restart command in implementation-summary.md.
- [ ] After user restarts daemon: re-run 005 Probe B (Semantic Search); record live result.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | enforceTokenBudget telemetry shape | vitest |
| Unit | Payload/count invariant | vitest helper + parse |
| Live probe | 005 Probe B re-run | MCP daemon (after restart) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007 research findings | Internal | Green | Defines contract shape |
| Packet 013 rebuild protocol | Internal | Green (concurrent) | Documents daemon restart |
| `mcp_server/handlers/memory-context.ts` | Internal | Green | Target file |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New fields cause downstream parser failures or test regressions.
- **Procedure**: Revert the patch commit; rebuild dist; restart daemon. Fields are additive so rollback is safe.
<!-- /ANCHOR:rollback -->
