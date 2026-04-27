---
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Code Graph Degraded Stress Cell"
description: "P0/P1/P2 verification items for the code_graph_query fallbackDecision integration sweep, with evidence-bound completion."
trigger_phrases:
  - "013-graph-degraded-stress-cell checklist"
  - "code_graph degraded sweep checklist"
  - "fallbackDecision test verification"
  - "graph degraded stress checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/013-graph-degraded-stress-cell"
    last_updated_at: "2026-04-27T19:58:00Z"
    last_updated_by: "implementation"
    recent_action: "All P0/P1 items verified with evidence"
    next_safe_action: "Promote checklist to commit gate"
    blockers: []
    key_files:
      - "mcp_server/tests/code-graph-degraded-sweep.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "013-graph-degraded-stress-cell"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code Graph Degraded Stress Cell

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..005, REQ-010..012)
- [x] CHK-002 [P0] Technical approach defined in plan.md (3-bucket sweep + `initDb` isolation + live-DB hash guard)
- [x] CHK-003 [P1] Dependencies identified and available (existing `initDb` seam, vitest 4.x, better-sqlite3)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Test file passes TypeScript type-check (`npx tsc --noEmit -p tsconfig.json` → no errors in degraded-sweep file)
- [x] CHK-011 [P0] No console errors or warnings during test run
- [x] CHK-012 [P1] Error handling: `try`/`catch` not needed in test logic itself; spy-restore handled in `afterEach`
- [x] CHK-013 [P1] Code follows existing pattern (mirrors `code-graph-db.vitest.ts` and `deep-loop-graph-query.vitest.ts` isolation idiom)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001..005 mapped to assertions in the new vitest)
- [x] CHK-021 [P0] Manual run: `npx vitest run mcp_server/tests/code-graph-degraded-sweep.vitest.ts` -> 5 tests pass, zero skips; exit 0
- [x] CHK-022 [P0] Regression run: `npx vitest run mcp_server/tests/code-graph-*.vitest.ts` → 34 tests pass, zero regressions; exit 0
- [x] CHK-023 [P1] Edge case: broad-stale bucket exercises `SELECTIVE_REINDEX_THRESHOLD = 50` boundary at `ensure-ready.ts:201-213`
- [x] CHK-024 [P1] Live-DB byte-equality guard fires in `afterAll`; the suite would fail loudly if any test mutated production bytes
- [x] CHK-025 [P0] Test does NOT trigger `code_graph_scan` from inside the suite — verified by absence of `code_graph_scan` MCP invocations in the test source
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the test file
- [x] CHK-031 [P0] Input validation: all test inputs are tmpdir-scoped; no user data crosses test boundaries
- [x] CHK-032 [P1] No filesystem operations outside the per-test tmpdir (and the live-DB hash, which is read-only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec / plan / tasks synchronized — all reference the same REQ IDs and bucket structure
- [x] CHK-041 [P1] Code comments adequate — each bucket section in the test explains the strategy and the production-code reference lines it exercises
- [x] CHK-042 [P2] README updated — N/A (no README in this packet; not a public-facing surface)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files written only to `os.tmpdir()` via `mkdtempSync` — no `scratch/` usage needed for this packet
- [x] CHK-051 [P1] Per-test cleanup runs in `afterEach`; suite-level cleanup runs in `afterAll`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 (N/A documented) |

**Verification Date**: 2026-04-27
<!-- /ANCHOR:summary -->

---

<!--
Level 1 packet but with checklist.md added because the packet is verification-heavy
(P0 items map directly to test assertions in code-graph-degraded-sweep.vitest.ts).
Adding checklist.md does not promote the level: SPECKIT_LEVEL HTML comment in spec.md
is authoritative (validate.sh §6 detect_level Pattern 0).
-->
