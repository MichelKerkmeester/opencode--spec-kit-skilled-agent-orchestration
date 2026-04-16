---
title: "Remediation Plan: 120-Iteration Deep Review — 243 Findings Across 009/010/012/014"
description: "Remediation of 243 deduplicated findings (1 P0, 114 P1, 133 P2) from the merged 120-iteration deep review of 920 files across packets 009, 010, 012, and 014."
trigger_phrases:
  - "remediation"
  - "deep review remediation"
  - "015 remediation"
  - "243 findings"
  - "P0 reconsolidation"
  - "review findings fix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-implementation-deep-review"
    last_updated_at: "2026-04-16T12:00:00Z"
    last_updated_by: "claude-opus-4.6"
    recent_action: "Created remediation plan, tasks, and checklist from 243-finding review report"
    next_safe_action: "Begin Workstream 0 — P0 reconsolidation scope-boundary fix"
    blockers:
      - "P0 reconsolidation-bridge scope crossing must be resolved before release"
    key_files:
      - "review/review-report.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:remediation-plan-v1-2026-04-16"
      session_id: "remediation-planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All 243 findings mapped to 11 workstreams with task-level granularity"
---
# Remediation Plan: 120-Iteration Deep Review Findings

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (contains 1 release blocker) |
| **Status** | In Progress |
| **Created** | 2026-04-16 |
| **Branch** | `main` |
| **Source** | `review/review-report.md` (1535 lines, 120 iterations) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

A merged 120-iteration deep review (50 doc-layer + 70 code+ops-layer) of 920 files across four packets (009-playbook-and-remediation, 010-continuity-research, 012-canonical-intake-and-middleware-cleanup, 014-memory-save-planner-first-default) produced **243 deduplicated findings**:

| Severity | Count | Action Required |
|----------|-------|-----------------|
| **P0 (Blocker)** | **1** | Must fix before any release |
| **P1 (Required)** | **114** | Must fix or triage before release |
| **P2 (Suggestion)** | **133** | Fix when practical, defer with reason |

**Verdict: CONDITIONAL** -- the 1 P0 blocker and 114 P1 findings must be triaged before the 026 optimization wave can be considered release-ready.

### The P0 Blocker

Governed save-time reconsolidation in `reconsolidation-bridge.ts:208-250` can cross scope boundaries (`tenant_id`, `user_id`, `agent_id`, `session_id`) and persist the merged survivor without governance metadata. This is a **data-integrity and security issue** that affects production save operations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope: 11 Workstreams

| # | Workstream | Findings | Effort | Report Section |
|---|-----------|----------|--------|----------------|
| **0** | P0 Reconsolidation scope-boundary fix | 1 | Medium | S2, S3.2#1 |
| **0b** | Path-boundary hardening | 5 | Medium | S3.15, S3.2#6, S3.5#1 |
| **0c** | Public-contract verification | 8 | Medium | S3.14, S3.2#8 |
| **1** | Status drift cleanup | 28 | Low | S3.3 |
| **2** | Packet 014 identity fix | 5 | Low | S3.4 |
| **3** | Command & workflow integrity | 16 | Medium | S3.1 |
| **4** | Error handling & security hardening | 12 | Medium | S3.8, S3.9 |
| **5** | Traceability & evidence gaps | 25 | Medium | S3.5 |
| **6** | Stale refs & placeholders (incl. 12 P1s) | 26 | Medium | S3.7, S3.10 |
| **7** | Agent & skill doc refresh | 37 | Medium-High | S3.2, S3.11 |
| **8** | Test quality improvements | 47 | High | S3.6 |
| | **Total** | **210** | | |

Note: 33 findings appear in the "Other" category (S3.13) and are distributed across workstreams 0-8 based on their nature. The total of 243 unique findings is fully covered.

### 3.2 Out of Scope

- New feature development
- Architectural redesign of existing systems
- Changes to packets outside 009, 010, 012, 014
- Review methodology improvements (separate effort)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| FR-01 | Reconsolidation-bridge must validate scope-boundary match before merge | P0 finding |
| FR-02 | All folder-scoped validators must reject absolute/escaped paths | S3.15 |
| FR-03 | All published MCP tool schemas must match runtime handler responses | S3.14 |
| FR-04 | All spec/plan frontmatter status must match graph-metadata status | S3.3 |
| FR-05 | Packet 014 docs must use consistent `014` identity (no `016` refs) | S3.4 |
| FR-06 | Command YAML workflows must reference only live commands/steps | S3.1 |
| FR-07 | Agent definitions must be consistent across all 4 runtimes | S3.2 |
| FR-08 | Checklist evidence must trace to first-order proof surfaces | S3.5 |
| FR-09 | Error handlers must propagate failures, not swallow them silently | S3.8 |
| FR-10 | Test suites must exercise production code, not shadow copies | S3.6 |

### 4.2 Non-Functional Requirements

| ID | Requirement | Source |
|----|-------------|--------|
| NFR-01 | No new test regressions introduced during remediation | All workstreams |
| NFR-02 | `validate.sh --strict` must pass after each workstream | All workstreams |
| NFR-03 | All path-escape regression tests must be added before boundary fixes | WS 0, 0b |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Metric | Verification |
|-----------|--------|--------------|
| P0 resolved | 1/1 P0 findings fixed with regression test | `reconsolidation-bridge.vitest.ts` cross-scope test passes |
| P1 triaged | 114/114 P1 findings either fixed or explicitly deferred with reason | Task list marks all P1 tasks [x] or [D] |
| P2 addressed | P2 findings fixed where practical | At minimum, all P2s within P0/P1 workstreams resolved |
| Tests green | All vitest suites pass | `npx vitest run` exit 0 |
| Validation clean | `validate.sh --strict` passes for all 4 packets | Exit 0 on 009, 010, 012, 014 |
| Status aligned | No spec/plan vs graph-metadata contradictions | Automated status-drift scan returns 0 findings |
| Identity clean | Zero `016` references in packet 014 | `grep -r "016" 014-*` returns empty |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:review-source -->
## 6. REVIEW SOURCE REFERENCE

| Attribute | Value |
|-----------|-------|
| Review report | `review/review-report.md` |
| Total iterations | 120 (50 doc-layer + 70 code+ops-layer) |
| Files in scope | 920 (200 spec + 326 code + 394 ops) |
| Dispatcher | cli-copilot gpt-5.4 high, concurrency 3 |
| Convergence threshold | 0.10 |
| Raw findings | 260 |
| After dedup | 242 (report says 242; mapped as 243 including the Opus audit additions) |
| Finding sections | S3.1-S3.15 (15 themed groups) |
| Workstreams | S4 (11 workstreams, 0 through 8 including 0b, 0c) |
| Priority matrix | S5 |
<!-- /ANCHOR:review-source -->
