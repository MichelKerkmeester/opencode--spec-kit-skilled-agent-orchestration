---
title: "Implementation Plan: Code Graph Readiness Release-Readiness Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Plan for a read-only release-readiness audit of code graph readiness behavior, documentation contracts, and degraded-path coverage."
trigger_phrases:
  - "045-004-code-graph-readiness"
  - "code graph readiness audit"
  - "read-path contract review"
  - "ensure-ready behavior"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/004-code-graph-readiness"
    last_updated_at: "2026-04-29T22:00:00+02:00"
    last_updated_by: "codex"
    recent_action: "Completed release-readiness code graph readiness audit plan"
    next_safe_action: "Use review-report.md for remediation planning"
    blockers:
      - "P0-001 readiness debounce can mask stale edits after a recent fresh check"
    key_files:
      - "plan.md"
      - "review-report.md"
    session_dedup:
      fingerprint: "sha256:045-004-code-graph-readiness"
      session_id: "045-004-code-graph-readiness"
      parent_session_id: "032-release-readiness-deep-review-program"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Readiness Release-Readiness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, JSON |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite code graph database, read-only audit |
| **Testing** | Static review, targeted regex, existing vitest evidence, strict spec validation |

### Overview

This packet audits the post-032 code graph readiness contract without changing runtime code. The plan reads the actual handlers and readiness helpers, checks current docs for watcher overclaims, verifies status and detect_changes read-only behavior, inspects verify and stress-test coverage, then writes the 9-section `review-report.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md`.
- [x] Success criteria measurable. Evidence: `spec.md` section 5.
- [x] Dependencies identified. Evidence: `spec.md` section 6.

### Definition of Done
- [x] All acceptance criteria met. Evidence: `review-report.md`.
- [x] Packet docs updated. Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- [x] Strict validator passes. Evidence: `implementation-summary.md` verification table.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only release-readiness review.

### Key Components
- **Readiness helper**: `lib/ensure-ready.ts` determines freshness, selective repair, full-scan blocking, and status snapshots.
- **Read handlers**: `handlers/query.ts`, `handlers/context.ts`, `handlers/detect-changes.ts`, `handlers/verify.ts`, and `handlers/status.ts` expose readiness behavior.
- **Docs and coverage**: `feature_catalog/`, `manual_testing_playbook/`, and `stress_test/code-graph/` express operator contracts and degraded-path validation.

### Data Flow

The audit follows runtime flow from handler entry point to readiness helper, then to database stale checks, selective indexer paths, response payloads, and tests/docs that claim coverage.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm packet folder from user request.
- [x] Load `sk-deep-review` and `system-spec-kit` workflow guidance.
- [x] Inspect existing packet and sibling packet format.

### Phase 2: Audit Execution
- [x] Read readiness helper and code graph handlers.
- [x] Run watcher/real-time regex over current code_graph docs.
- [x] Inspect status, verify, detect_changes, path containment, and selective-indexer logic.
- [x] Inspect degraded stress test coverage.

### Phase 3: Verification
- [x] Write packet docs and `review-report.md`.
- [x] Run strict validator.
- [x] Record validation evidence in `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Runtime contract and side effects | `nl`, `rg`, direct file reads |
| Coverage Review | Existing vitest and stress test coverage | `rg`, direct file reads |
| Documentation | Watcher claim sweep and contract drift | `rg`, direct file reads |
| Spec Validation | Packet structure and metadata | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 045 phase parent | Internal | Green | Packet still validates as child of release-readiness program. |
| 013 adversarial verdict | Internal | Green | Establishes original watcher overclaim evidence. |
| 032 watcher retraction | Internal | Green | Defines current no-watcher/read-path/manual repair contract. |
| 035 F5/F6 coverage | Internal | Green | Provides prior matrix coverage status for query and verify. |
| 039 catalog/playbook | Internal | Green | Provides current operator-facing code_graph docs. |
| CocoIndex daemon | Tooling | Yellow | Semantic search failed under sandbox; fallback was direct reads plus `rg`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet docs fail strict validation or report cites unsupported findings.
- **Procedure**: Patch only packet-local docs until validation passes and every finding has evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Audit Execution) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | User packet path | Audit Execution |
| Audit Execution | Setup | Verification |
| Verification | Audit Execution | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Complete |
| Audit Execution | Medium | Complete |
| Verification | Low | Complete |
| **Total** | | **Complete** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime deployment performed.
- [x] Audited source left unchanged.
- [x] Packet-local docs validated.

### Rollback Procedure
1. Remove or patch packet-local docs if validation or evidence quality fails.
2. Re-run strict validation.
3. Keep audited runtime files untouched.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
