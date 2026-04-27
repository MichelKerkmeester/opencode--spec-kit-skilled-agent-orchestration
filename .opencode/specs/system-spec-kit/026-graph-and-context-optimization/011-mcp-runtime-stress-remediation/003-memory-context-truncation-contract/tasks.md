---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: memory_context truncation contract + token telemetry [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/003-memory-context-truncation-contract/tasks]"
description: "Per-REQ work units to land preEnforcementTokens / returnedTokens / droppedAllResultsReason and the payload/count invariant in tests."
trigger_phrases:
  - "memory context truncation tasks"
  - "token telemetry tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/003-memory-context-truncation-contract"
    last_updated_at: "2026-04-27T09:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed into Phase 1-3 work units"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: memory_context truncation contract + token telemetry

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Author spec.md
- [x] T002 [P] Author plan.md
- [x] T003 [P] Author tasks.md (this file)
- [ ] T004 [P] Author implementation-summary.md placeholder
- [ ] T005 [P] Generate description.json
- [ ] T006 [P] Generate graph-metadata.json
- [ ] T007 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Source patch (mcp_server/handlers/memory-context.ts)
- [ ] T101 Read enforceTokenBudget() end-to-end (lines ~447-840)
- [ ] T102 Capture `preEnforcementTokens = estimateTokens(JSON.stringify(result))` at the entry to enforcement
- [ ] T103 Pipe `preEnforcementTokens` through fallback chain via closure or named return value
- [ ] T104 Add `returnedTokens` measurement at the final emit site (final envelope size)
- [ ] T105 In `fallbackToStructuredBudget()`, when final results array is empty, set `droppedAllResultsReason: "impossible_budget"`
- [ ] T106 Document `actualTokens` as alias of `returnedTokens` in inline comment
- [ ] T107 If under-budget early-return path exists (per 005 Cluster 1), ensure it emits `preEnforcementTokens === returnedTokens` and no droppedAllResultsReason

### Test updates
- [ ] T201 [P] Add shared helper `expectReturnedCountMatchesPayload(result, returnedResultCount)` parsing `JSON.parse(result.content[0].text)` and asserting `data.results.length === returnedResultCount`
- [ ] T202 [P] Update `mcp_server/tests/token-budget-enforcement.vitest.ts` existing tests to call the helper
- [ ] T203 Add new test case: under-budget payload (5 results, budget 3500, ~65 tokens) → `enforced:false, truncated:false, preEnforcementTokens === actualTokens === returnedTokens, no droppedAllResultsReason`
- [ ] T204 Add new test case: over-budget but resolvable (5 large results, small budget) → `enforced:true, truncated:true, preEnforcementTokens > budgetTokens, returnedTokens <= budgetTokens, returnedResultCount === payload count`
- [ ] T205 Add new test case: impossible budget (1 huge result, tiny budget) → `enforced:true, truncated:true, returnedResultCount:0, droppedAllResultsReason:"impossible_budget"`
- [ ] T206 [P] Update `mcp_server/tests/memory-context.vitest.ts:890-916` to use the helper instead of metadata-only assertion
- [ ] T207 [P] Update `mcp_server/tests/memory-context.vitest.ts:956-969` similarly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T301 Run `cd mcp_server && npm test -- --run tests/token-budget-enforcement.vitest.ts tests/memory-context.vitest.ts` → all green
- [ ] T302 Run `cd mcp_server && npm run build` → clean
- [ ] T303 grep `dist/handlers/memory-context.js` for new field markers (`preEnforcementTokens`, `returnedTokens`, `droppedAllResultsReason`); confirm all 3 present
- [ ] T304 Document MCP daemon restart command in implementation-summary.md
- [ ] T305 After daemon restart: re-run live `memory_context({input:"Semantic Search", mode:"auto"})`; record meta.tokenBudgetEnforcement output and confirm `count > 0` in data.content
- [ ] T306 Mark all REQ-001..005 acceptance criteria as PASSED in implementation-summary.md
- [ ] T307 Run `validate.sh --strict` → green
- [ ] T308 Commit + push: `fix(mcp/memory-context): add preEnforcementTokens/returnedTokens/droppedAllResultsReason per 007/Q5 + 005/REQ-002`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] All REQs (REQ-001..005) acceptance criteria PASSED
- [ ] Live probe verification recorded in implementation-summary.md
- [ ] `validate.sh --strict` green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md (REQ-001..005)
- **Plan**: plan.md (Phase 1-3)
- **Source packets**: ../005-memory-search-runtime-bugs (REQ-002 origin), ../002-mcp-runtime-improvement-research (Q5 contract)
- **Companion packets**: ../008-mcp-daemon-rebuild-protocol (rebuild + restart contract)
<!-- /ANCHOR:cross-refs -->
