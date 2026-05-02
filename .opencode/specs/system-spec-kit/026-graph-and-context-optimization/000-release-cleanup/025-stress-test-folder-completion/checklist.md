---
title: "Verification Checklist: Stress Test Folder Completion"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
description: "Verification Date: 2026-04-29"
trigger_phrases:
  - "025-stress-test-folder-completion"
  - "stress test full migration"
  - "search-quality harness move"
  - "content-based stress migration"
  - "stress folder reorganization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/025-stress-test-folder-completion"
    last_updated_at: "2026-04-29T18:45:00Z"
    last_updated_by: "codex"
    recent_action: "Verification recorded."
    next_safe_action: "Hand off for commit."
    blockers: []
    key_files:
      - "migration-plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Stress Test Folder Completion

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Content-based discovery run. [EVIDENCE: `migration-plan.md` records discovered candidates and classifications.]
- [x] CHK-002 [P0] Requirements documented in `spec.md`. [EVIDENCE: `spec.md` REQ-001 through REQ-007.]
- [x] CHK-003 [P1] Technical approach defined in `plan.md`. [EVIDENCE: `plan.md` phases and testing strategy.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Search-quality harness moved. [EVIDENCE: `mcp_server/stress_test/search-quality/harness.ts:4`.]
- [x] CHK-011 [P0] W3-W13 cells moved with harness. [EVIDENCE: `mcp_server/stress_test/search-quality/measurement-fixtures.ts:36`.]
- [x] CHK-012 [P0] Memory stress suites moved. [EVIDENCE: `mcp_server/stress_test/memory/gate-d-benchmark-memory-search.vitest.ts:168`.]
- [x] CHK-013 [P0] Skill Advisor stress suite moved. [EVIDENCE: `mcp_server/stress_test/skill-advisor/skill-graph-rebuild-concurrency.vitest.ts:13`.]
- [x] CHK-014 [P0] Code graph stress suites moved. [EVIDENCE: `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:1`.]
- [x] CHK-015 [P0] Session stress suites moved. [EVIDENCE: `mcp_server/stress_test/session/session-manager-stress.vitest.ts:44`.]
- [x] CHK-016 [P0] Default config excludes stress. [EVIDENCE: `mcp_server/vitest.config.ts:25`.]
- [x] CHK-017 [P0] Stress config includes only stress folder. [EVIDENCE: `mcp_server/vitest.stress.config.ts:13`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Strict validator exits 0. [EVIDENCE: `validate.sh --strict` passed with 0 errors and 0 warnings.]
- [x] CHK-021 [P0] Build exits 0. [EVIDENCE: `npm run build` passed.]
- [x] CHK-022 [P0] Stress suite reaches full surface. [EVIDENCE: `npm run stress` passed 25 files and 63 tests.]
- [x] CHK-023 [P1] Default tests pass or any hang/failure is documented. [EVIDENCE: `npm test` reported unrelated existing failures, then hung after no output; stress suite passed separately.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credential files introduced. [EVIDENCE: Changes are test relocation, config, scripts, and docs.]
- [x] CHK-031 [P0] Production behavior unchanged. [EVIDENCE: Modified runtime paths are Vitest configs and test files.]
- [x] CHK-032 [P1] Scope remains limited to stress-test folder migration. [EVIDENCE: `migration-plan.md` documents ambiguous files left in place.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. [EVIDENCE: This packet's Level 2 docs describe the same migration boundary.]
- [x] CHK-041 [P1] Ambiguous candidates documented and left in default tests. [EVIDENCE: `migration-plan.md` ambiguous table.]
- [x] CHK-042 [P1] Direct old-path references refreshed. [EVIDENCE: Stale-path grep returned no live refs.]
- [x] CHK-043 [P2] Optional harness-only script added. [EVIDENCE: `mcp_server/package.json:28`.]
- [x] CHK-044 [P2] Optional matrix-only script added. [EVIDENCE: `mcp_server/package.json:29`.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Stress files organized by subsystem folders. [EVIDENCE: `mcp_server/stress_test/` contains search-quality, memory, skill-advisor, code-graph, session, and matrix.]
- [x] CHK-051 [P1] `git mv` blocker documented honestly. [EVIDENCE: `migration-plan.md` blocker note.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 7 | 7/7 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-29
<!-- /ANCHOR:summary -->
