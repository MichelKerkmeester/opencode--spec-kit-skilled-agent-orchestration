---
title: "Tasks: 008 W3-W7 Runtime Wiring and Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task list for Phase G telemetry-first runtime wiring and audit remediation."
trigger_phrases:
  - "008 tasks"
  - "w3 w7 runtime wiring tasks"
  - "search decision envelope tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/008-w3-w7-runtime-wiring-and-audit"
    last_updated_at: "2026-04-29T04:45:00Z"
    last_updated_by: "codex"
    recent_action: "Defined W8-W13 implementation tasks with file:line targets"
    next_safe_action: "Start T001 W8 SearchDecisionEnvelope module"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:008-w3-w7-runtime-wiring-and-audit-tasks-20260429"
      session_id: "008-w3-w7-runtime-wiring-and-audit-20260429"
      parent_session_id: "005-review-remediation"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 008 W3-W7 Runtime Wiring and Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**W8 SearchDecisionEnvelope**

- [x] T001 Create typed envelope and pure builder/attach helpers (`mcp_server/lib/search/search-decision-envelope.ts`, new).
- [x] T002 Consume W3 trust tree through the envelope composer (`mcp_server/lib/rag/trust-tree.ts:65`).
- [x] T003 [P] Add W8 coverage for empty, full, and partial envelope composition (`mcp_server/stress_test/search-quality/w8-search-decision-envelope.vitest.ts`, new).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**W12 QueryPlan to W4 Stage 3**

- [x] T004 Add `queryPlan?: QueryPlan` and decision telemetry slots to pipeline types (`mcp_server/lib/search/pipeline/types.ts:129`, `:248`).
- [x] T005 Build actual QueryPlan in memory search from query routing/intelligence (`mcp_server/handlers/memory-search.ts:774`, `:912`).
- [x] T006 Replace Stage 3 unknown empty QueryPlan fallback with pipeline QueryPlan (`mcp_server/lib/search/pipeline/stage3-rerank.ts:327`, `:328`).
- [x] T007 Update W4 tests to assert complex-query and high-authority real-plan triggers (`mcp_server/stress_test/search-quality/w4-conditional-rerank.vitest.ts:7`).
**W9 Advisor Shadow Sink**

- [x] T008 Create append-only shadow sink with rotation (`mcp_server/skill_advisor/lib/shadow/shadow-sink.ts`, new).
- [x] T009 Record emitted `_shadow` recommendations to sink (`mcp_server/skill_advisor/handlers/advisor-recommend.ts:270`).
- [x] T010 Preserve `_shadow` in Python compatibility translation (`mcp_server/skill_advisor/scripts/skill_advisor.py:373`).
- [x] T011 [P] Add sink append, rotation, and passthrough tests (`mcp_server/skill_advisor/tests/`, create/modify).
**W11 CocoIndex Calibration Telemetry**

- [x] T012 Add production consumer for `calibrateCocoIndexOverfetch` (`mcp_server/lib/search/cocoindex-calibration.ts:36`).
- [x] T013 Emit recommended multiplier into SearchDecisionEnvelope telemetry without changing overfetch behavior.
- [x] T014 [P] Add W11 telemetry test (`mcp_server/stress_test/search-quality/`, create/modify).
**W13 Decision Audit and SLA Metrics**

- [x] T015 Create decision-audit module with JSONL sink and pure SLA metrics (`mcp_server/lib/search/decision-audit.ts`, new).
- [x] T016 Wire `recordSearchDecision` into `memory_search` response completion (`mcp_server/handlers/memory-search.ts:1506`).
- [x] T017 Wire `recordSearchDecision` into `memory_context` response completion (`mcp_server/handlers/memory-context.ts:1859`).
- [x] T018 [P] Add audit row and SLA metric tests (`mcp_server/stress_test/search-quality/`, create/modify).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**W10 Real Degraded-Readiness Integration**

- [x] T019 Add real degraded-readiness test with isolated code graph DB (`mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts`, new).
- [x] T020 Assert W7 fixture files remain fixture-only supplements (`mcp_server/stress_test/search-quality/w7-degraded-*.vitest.ts:7`).
**Cleanup, Tenant Scope, Verification**

- [x] T021 Thread `tenantId`, `userId`, and `agentId` through envelope/audit metadata only (`mcp_server/lib/search/pipeline/types.ts:129`, `mcp_server/handlers/memory-search.ts:921`).
- [x] T022 Delete empty directory candidate `mcp_server/tmp-test-fixtures/specs/` if still empty.
- [x] T023 Investigate and delete duplicate empty `measurements/` stub under `.opencode/skill/system-spec-kit/specs/.../007-search-rag-measurement-driven-implementation/` if still empty.
- [x] T024 Run focused Vitest, typecheck, build, and strict validator.
- [x] T025 Author implementation summary with findings closure matrix and file:line evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly documented as deferred with rationale.
- [x] No `[B]` blocked tasks remaining.
- [x] Verification commands recorded with exit codes in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source Research**: `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/020-w3-w7-verification-and-expansion-research/research/research-report.md`
<!-- /ANCHOR:cross-refs -->
