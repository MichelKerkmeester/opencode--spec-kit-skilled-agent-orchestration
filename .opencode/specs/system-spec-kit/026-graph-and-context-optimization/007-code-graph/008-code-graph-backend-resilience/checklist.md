---
title: "Verification Checklist: Code Graph Backend Resilience [system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience/checklist]"
description: "Verification Date: pending"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "code graph backend resilience checklist"
  - "008-code-graph-backend-resilience checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/008-code-graph-backend-resilience"
    last_updated_at: "2026-04-25T23:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 29 checklist items verified"
    next_safe_action: "Final commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0260000000007008000000000000000000000000000000000000000000000004"
      session_id: "008-code-graph-backend-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code Graph Backend Resilience

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Spec, plan, tasks all present and synchronized with iter 12 roadmap (verified)
- [x] CHK-002 [P0] All 15 tasks have explicit file:line targets (verified)
- [x] CHK-003 [P1] cli-codex implementation runner script ready under scratch/codex-runner.sh (verified)
- [x] CHK-004 [P1] mcp_server build state baseline captured (pre-implementation) (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 15 tasks marked [x] in tasks.md with (verified) evidence (verified)
- [x] CHK-011 [P0] `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` passes 0 TS errors after every task (verified)
- [x] CHK-012 [P0] No new ESLint errors introduced (verified)
- [x] CHK-013 [P1] Inline comments only where 007 patch design noted non-obvious invariants (verified)
- [x] CHK-014 [P1] No backwards-incompat changes to `IndexerConfig` (new fields are optional with defaults) (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `npm test` for mcp_server passes 100% after final task (verified)
- [x] CHK-021 [P0] Hash-predicate tests exist: same-mtime/different-hash, missing-hash fallback, unchanged-content freshness (verified)
- [x] CHK-022 [P0] Resolver tests exist: type-only, path-alias, re-export (verified)
- [x] CHK-023 [P0] Edge-weight tests exist: override resolution + drift threshold (verified)
- [x] CHK-024 [P0] Verifier tests exist: parsing, blocking on stale, missing-symbol detection (verified)
- [x] CHK-025 [P0] detect_changes hard-block test exists: proves stale graph or verify failure returns blocked status (verified)
- [x] CHK-026 [P1] `/doctor:code-graph:auto` smoke test succeeds against modified backend (verified)
- [x] CHK-027 [P1] `code_graph_verify` MCP tool reachable + returns valid response shape (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No new file reads outside workspace (resolver respects baseUrl + workspace rootDir) (verified)
- [x] CHK-031 [P0] No new network calls (verified)
- [x] CHK-032 [P1] tsconfig.json parsing handles malformed input gracefully (catches + falls back) (verified)
- [x] CHK-033 [P1] Hash compute uses existing crypto primitives (no new deps) (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Implementation summary documents all 15 tasks with rc + verification evidence (verified)
- [x] CHK-041 [P1] Decision record updated with backend choice rationale (verified)
- [x] CHK-042 [P1] Cross-references to 007 iter 8-12 markdowns present in spec + plan (verified)
- [x] CHK-043 [P2] Updated 006 implementation-summary to reflect 008 backend changes (Phase B harness now exists) (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] New files under correct paths: `mcp_server/code_graph/lib/gold-query-verifier.ts`, `mcp_server/code_graph/lib/edge-drift.ts`, `mcp_server/code_graph/handlers/verify.ts`, `mcp_server/code_graph/tests/code-graph-verify.vitest.ts` (verified)
- [x] CHK-051 [P0] Modified files match plan.md patch surface (no scope creep) (verified)
- [x] CHK-052 [P1] Strict spec validation passes 0/0 on this packet (verified)
- [x] CHK-053 [P1] cli-codex per-task logs preserved under scratch/codex-logs/ (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | [ ]/19 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-04-25
<!-- /ANCHOR:summary -->
