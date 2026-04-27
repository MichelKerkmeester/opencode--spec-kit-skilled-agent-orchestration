---
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
title: "Tasks: code_graph fail-fast routing [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail/tasks]"
description: "Per-REQ work units for fallbackDecision routing on blocked code-graph reads."
trigger_phrases:
  - "code graph fast fail tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/005-code-graph-fast-fail"
    last_updated_at: "2026-04-27T09:42:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Decomposed work units"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["tasks.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Tasks: code_graph fail-fast routing

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
- [x] T001 Author spec.md / plan.md / tasks.md
- [ ] T002 [P] Author implementation-summary.md placeholder
- [ ] T003 [P] Generate description.json + graph-metadata.json
- [ ] T004 Pass `validate.sh --strict`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T101 Read code_graph/handlers/query.ts:775-796 (blocked payload site) + ensure-ready.ts:151-220
- [ ] T102 Define `FallbackDecision` type per 007 §5 Q6: `{ nextTool: "code_graph_scan" | "code_graph_query" | "rg", reason: "full_scan_required" | "selective_reindex" | "scan_failed" | "scan_declined", retryAfter?: "scan_complete" }`
- [ ] T103 Update `buildGraphQueryPayload()` (or equivalent at query.ts:779-796) to attach fallbackDecision when blocked
- [ ] T104 Implement readiness-to-FallbackDecision mapping per 007 §5 Q6 routing matrix
- [ ] T105 [P] Audit "Code Graph" vs "causal graph" naming across startup hooks + causal-stats; rename to qualified nouns ("structural code graph" vs "memory causal graph") OR add a comment noting the chosen disambiguation strategy
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T201 Add vitest cases: empty/stale+full_scan/stale+selective/fresh/unavailable states each assert correct fallbackDecision (or absence)
- [ ] T202 Add regression test confirming `allowInlineFullScan:false` preserved
- [ ] T203 Run targeted vitest sweep `cd mcp_server && npm test -- --run tests/code-graph-*.vitest.ts`
- [ ] T204 npm run build
- [ ] T205 grep dist for `fallbackDecision`, `nextTool`, `retryAfter` markers
- [ ] T206 Document daemon restart requirement
- [ ] T207 After restart: live probe `code_graph_query({operation:"callers", subject:"handleCodeGraphQuery"})` against empty/stale graph; record fallbackDecision
- [ ] T208 Mark all REQ-001..004 PASSED
- [ ] T209 `validate.sh --strict` PASS
- [ ] T210 Commit + push: `fix(mcp/code-graph): add fallbackDecision routing on blocked reads per 007/Q6 + 005/REQ-017`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 1-3 tasks `[x]`
- [ ] REQ-001..004 PASSED
- [ ] Live probe verification recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: spec.md
- **Plan**: plan.md
- **Sources**: ../005-memory-search-runtime-bugs (REQ-017), ../002-mcp-runtime-improvement-research (Q6)
- **Companion**: ../008-mcp-daemon-rebuild-protocol
<!-- /ANCHOR:cross-refs -->
