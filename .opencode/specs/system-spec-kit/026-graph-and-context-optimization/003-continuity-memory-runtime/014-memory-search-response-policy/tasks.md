---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: memory_search response policy [system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/014-memory-search-response-policy/tasks]"
description: "Per-REQ work units for adding hard refusal-contract fields to memory_search responses."
trigger_phrases:
  - "memory search response policy tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/014-memory-search-response-policy"
    last_updated_at: "2026-04-27T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: memory_search response policy

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
- [x] T003 [P] Author tasks.md
- [ ] T004 [P] Author implementation-summary.md placeholder
- [ ] T005 [P] Generate description.json + graph-metadata.json
- [ ] T006 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Source patches
- [ ] T101 Read mcp_server/lib/search/recovery-payload.ts (focus :28-37, :152-164)
- [ ] T102 Extend RecoveryAction type union with 3 new values: `ask_disambiguation`, `refuse_without_evidence`, `broaden_or_ask`
- [ ] T103 Read mcp_server/formatters/search-results.ts (focus :951-1035)
- [ ] T104 Implement `deriveResponsePolicy(requestQuality, recovery)` helper per 007 §9 example, returning `null` for good quality OR an object with `requiredAction / noCanonicalPathClaims / citationRequiredForPaths / safeResponse`
- [ ] T105 Implement `deriveCitationPolicy(requestQuality)` returning `"cite_results"` (good) or `"do_not_cite_results"` (weak/partial/no_results)
- [ ] T106 In response data assembly site (~line 1025), conditionally spread responsePolicy + always include citationPolicy
- [ ] T107 Guarantee non-empty suggestedQueries: in recovery-payload.ts when `recommendedAction:"ask_user"` AND `suggestedQueries.length===0`, EITHER synthesize 2 safe broadening suggestions (e.g., based on extracted query keywords) OR ensure responsePolicy.requiredAction:"ask_disambiguation" fires

### Test updates
- [ ] T201 [P] Add test cases to mcp_server/tests/d5-recovery-payload.vitest.ts for the 3 new RecoveryAction values
- [ ] T202 [P] Add test cases to mcp_server/tests/empty-result-recovery.vitest.ts:
  - weak-quality fixture → assert `responsePolicy.noCanonicalPathClaims === true` and `safeResponse` is non-empty string
  - good-quality fixture → assert `citationPolicy === "cite_results"` and no responsePolicy
  - ask_user + empty suggestedQueries fixture → assert non-empty queries OR responsePolicy.requiredAction:"ask_disambiguation"
- [ ] T203 [P] Verify no other test suite breaks from RecoveryAction extension
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T301 Run `cd mcp_server && npm test -- --run tests/d5-recovery-payload.vitest.ts tests/empty-result-recovery.vitest.ts` → green
- [ ] T302 Run full vitest sweep `cd mcp_server && npm test` → no regressions
- [ ] T303 Run `cd mcp_server && npm run build` → clean
- [ ] T304 grep dist/formatters/search-results.js for `responsePolicy`, `citationPolicy`, `noCanonicalPathClaims` markers
- [ ] T305 grep dist/lib/search/recovery-payload.js for `ask_disambiguation` marker
- [ ] T306 Update implementation-summary.md with files changed + verification status
- [ ] T307 Document MCP daemon restart requirement
- [ ] T308 After daemon restart: run live `memory_search({query:"find the spec for the cache warning hooks packet"})` (low-signal) and record responsePolicy + citationPolicy fields
- [ ] T309 Mark all REQ-001..004 acceptance criteria as PASSED
- [ ] T310 Run `validate.sh --strict` green
- [ ] T311 Commit + push: `fix(mcp/memory-search): add responsePolicy/citationPolicy refusal contract per 007/Q4`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] All REQs (REQ-001..004) PASSED
- [ ] Live probe verification recorded
- [ ] `validate.sh --strict` green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Source packets**: ../006-search-intelligence-stress-test (I2 hallucination evidence), ../007-mcp-runtime-improvement-research (Q4 contract)
- **Companion**: ../013-mcp-daemon-rebuild-protocol
<!-- /ANCHOR:cross-refs -->
