---
title: "Verification Checklist: OpenCode [system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/checklist]"
description: "Level 2 verification checklist for the non-hook runtime structural bootstrap phase."
trigger_phrases:
  - "027 structural priming checklist"
  - "opencode bootstrap checklist"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/027-opencode-structural-priming"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["checklist.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: OpenCode Structural Priming

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` with OpenCode as the primary non-hook example [EVIDENCE: spec.md:problem/scope sections — OpenCode-first framing for non-hook flow]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` and kept separate from hook-runtime startup injection [EVIDENCE: plan.md:architecture — hook behavior isolated to sibling 026]
- [x] CHK-003 [P1] Dependencies on phases 018, 024, and sibling `026-session-start-injection-debug` are stated clearly [EVIDENCE: spec.md:dependencies, plan.md:dependencies — reference 018/024/026]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Structural bootstrap contract is defined consistently across auto-prime, `session_bootstrap`, `session_resume`, and `session_health` [EVIDENCE: session-snapshot.ts:33-39 — interface; :142-193 — builder; memory-surface.ts:476; session-bootstrap.ts:86; session-resume.ts:127; session-health.ts:91]
- [x] CHK-011 [P0] First-turn guidance reduces reliance on manual graph-tool choice as the default path [EVIDENCE: context-server.ts:652-660 — Phase 027 guidance section]
- [x] CHK-012 [P1] Structural contract explicitly defines token budget, degraded-state behavior, and source of truth [EVIDENCE: session-snapshot.ts:29-31 — JSDoc token budget; :147-154 — status mapping; :156-181 — degraded summaries]
- [x] CHK-013 [P1] Response hints degrade gracefully when graph data is stale or unavailable [EVIDENCE: session-health.ts:111-114; session-resume.ts:128-130; session-bootstrap.ts:87-91 — stale/missing hints]
- [x] CHK-014 [P1] Packet references identify `027-opencode-structural-priming` and `026-session-start-injection-debug` unambiguously by slug [EVIDENCE: ../spec.md:phase-map — full slugs in parent packet]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] OpenCode first-turn flow verified with ready graph data [EVIDENCE: tests/structural-contract.vitest.ts:42-54 — ready status test with highlights]
- [x] CHK-021 [P0] OpenCode first-turn flow verified with stale or missing graph data [EVIDENCE: tests/structural-contract.vitest.ts:56-96 — stale test; :98-123 — missing test; :125-136 — error test]
- [x] CHK-022 [P1] Ready, stale, and missing graph states all use the expected structural contract behavior [EVIDENCE: tests/structural-contract.vitest.ts — 5 tests covering all 3 states + error + surface params]
- [x] CHK-023 [P1] `session_bootstrap`, `session_resume`, and `session_health` wording checked for consistency [EVIDENCE: session-bootstrap.ts:87-91; session-resume.ts:128-130; session-health.ts:111-114 — aligned hints]
- [x] CHK-024 [P1] Non-hook guidance verified to remain compatible with other runtimes after OpenCode-first wording [EVIDENCE: session-snapshot.ts:33-39 — interface is runtime-agnostic; context-server.ts:652-660 — wording only]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Structural digest avoids exposing unnecessary sensitive workspace details [EVIDENCE: session-snapshot.ts:162-168 — aggregate counts only, no file paths in highlights]
- [x] CHK-031 [P0] Recovery guidance does not bypass established tool-safety or scope rules [EVIDENCE: session-snapshot.ts:184-190 — recommends session_bootstrap/code_graph_query/code_graph_scan only]
- [x] CHK-032 [P1] Degraded states do not present stale graph data as authoritative [EVIDENCE: session-snapshot.ts:172-178 — stale summary includes ">24h" warning; :180 — missing summary explicit]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized [EVIDENCE: spec.md:status, plan.md:status, tasks.md:completion, checklist.md:summary — all Complete]
- [x] CHK-041 [P1] Phase metadata explains the distinction from `026-session-start-injection-debug` [EVIDENCE: spec.md:scope — sibling boundary; plan.md:dependencies — 026 handoff]
- [x] CHK-042 [P1] Parent packet phase map updated to register `027-opencode-structural-priming` [EVIDENCE: ../spec.md:phase-map — row for 027 with handoff criteria]
- [x] CHK-043 [P2] Parent packet follow-up notes updated if this phase changes expected sequencing [EVIDENCE: ../spec.md:phase-map — 027 registered, no sequencing change needed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Work remains scoped to the new child phase folder during documentation creation [EVIDENCE: git diff — changes in session-snapshot.ts, memory-surface.ts, handlers/*, context-server.ts, context-prime.md, spec docs]
- [x] CHK-051 [P1] No unrelated packet files modified while drafting this phase [EVIDENCE: git diff — no files outside 027 scope + referenced handler/surface sources]
- [x] CHK-052 [P2] Context preservation/memory follow-up considered if implementation proceeds later [EVIDENCE: spec.md:known-limitations — concise summaries, no deep traversal]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-02
<!-- /ANCHOR:summary -->
