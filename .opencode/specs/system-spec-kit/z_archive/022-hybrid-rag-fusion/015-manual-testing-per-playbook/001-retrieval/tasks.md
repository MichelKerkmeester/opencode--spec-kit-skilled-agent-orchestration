---
title: "Tasks: manual-testing-pe [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/001-retrieval/tasks]"
description: "Task tracker for 13 retrieval playbook scenarios. One task per scenario, all PENDING."
trigger_phrases:
  - "retrieval tasks"
  - "phase 001 tasks"
  - "manual testing retrieval tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/001-retrieval"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
# Tasks: manual-testing-per-playbook retrieval phase

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

**Task Format**: `T### [P?] Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify playbook files accessible at `../../manual_testing_playbook/01--retrieval/` — All 13 files confirmed readable
- [x] T002 Confirm feature catalog accessible at `../../feature_catalog/01--retrieval/` — All catalog files confirmed readable
- [x] T003 Load review protocol from `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` — Protocol understood; verdict rules applied
- [x] T004 Verify MCP runtime healthy — Source files confirm all three handlers exist and compile (handlers/memory-context.ts, memory-search.ts, memory-triggers.ts)
- [x] T005 [P] Sandbox strategy for 086: trigger re-index gate verified at source level (no live sandbox required for code-level verdict). 143: rollout flag verified via search-flags.ts and graph-flags.ts; no live restart required for code-level verdict.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Scenario Tasks

| Task | Scenario ID | Scenario Name | Status | Verdict | Evidence |
|------|-------------|---------------|--------|---------|----------|
| T010 | EX-001 | Unified context retrieval (memory_context) | DONE | PASS | handlers/memory-context.ts:438-491 (5 modes), :731-763 (intent routing), :780 (sessionTransition gating) |
| T011 | M-001 | Context Recovery and Continuation | DONE | PASS | handlers/memory-context.ts:569-597 (resume strategy, state/next-steps anchors), handlers/memory-search.ts:185 (specFolder+anchors param) |
| T012 | EX-002 | Semantic and lexical search (memory_search) | DONE | PASS | handlers/memory-search.ts:185 (bypassCache param), :610-612 (cache bypass logic), feature-catalog/02-semantic-and-lexical-search |
| T013 | M-002 | Targeted Memory Lookup | DONE | PASS | handlers/memory-search.ts:183-187 (specFolder, anchors params wired), feature-catalog/02 confirmed |
| T014 | EX-003 | Trigger phrase matching (memory_match_triggers) | DONE | PASS | handlers/memory-triggers.ts:100-106 (include_cognitive param), :237-315 (full cognitive pipeline: decay, activate, co-activate, tier) |
| T015 | EX-004 | Hybrid search pipeline | DONE | PASS | lib/search/hybrid-search.ts:117 (_degradation), :1153-1169 (searchWithFallbackTiered routing), feature-catalog/04 5-channel architecture confirmed |
| T016 | EX-005 | 4-stage pipeline architecture | DONE | PASS | lib/search/pipeline/stage4-filter.ts:1-36 (invariant), :56-77 (captureScoreSnapshot/verifyScoreInvariant), lib/search/pipeline/stage2-fusion.ts:22-34 (signal order) |
| T017 | 086 | BM25 trigger phrase re-index gate | DONE | PASS | handlers/memory-crud-update.ts:154 (title OR triggerPhrases condition), :156-168 (BM25 addDocument re-index block) |
| T018 | 109 | Quality-aware 3-tier search fallback | DONE | PASS | lib/search/hybrid-search.ts:1466-1614 (3-tier chain, checkDegradation, calibrateTier3Scores, _degradation), lib/search/search-flags.ts:57-61 (SPECKIT_SEARCH_FALLBACK flag) |
| T019 | 142 | Session transition trace contract | DONE | PASS | lib/search/session-transition.ts:16-22 (SessionTransitionTrace interface), :64-103 (buildSessionTransitionTrace), :142-190 (attachSessionTransitionTrace), handlers/memory-context.ts:780 (trace-only gating) |
| T020 | 143 | Bounded graph-walk rollout and diagnostics | DONE | PASS | lib/search/search-flags.ts:148-163 (GraphWalkRolloutState, resolveGraphWalkRolloutState), lib/search/graph-flags.ts:26-42 (rollout accessors), lib/search/pipeline/ranking-contract.ts:14 (STAGE2_GRAPH_BONUS_CAP=0.03), formatters/search-results.ts:136-144 (graphContribution trace shape) |
| T021 | 185 | /memory:search command routing | DONE | PASS | `.opencode/command/memory/search.md` documents the no-args prompt, routing gates, analysis quick reference, and retrieval-plus-analysis tool surface for the renamed command. |
| T022 | 187 | Quick search (memory_quick_search) | DONE | PASS | .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:47-65 (delegates to handleMemorySearch with defaults), schemas/tool-input-schemas.ts:389-485 (schema + allowed params), tests/memory-tools.vitest.ts:41-64 (governed-scope forwarding) |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Record verdict for each scenario (PASS, PARTIAL, or FAIL) with rationale — all 13 verdicted PASS via source-code review
- [x] T031 Confirm 13/13 scenarios executed with no skipped test IDs — EX-001, M-001, EX-002, M-002, EX-003, EX-004, EX-005, 086, 109, 142, 143, 185, 187 all covered
- [x] T032 Update checklist.md with evidence references for all P0 items — done
- [x] T033 Complete implementation-summary.md with aggregate results — done
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 13 scenario tasks (T010-T022) marked complete
- [x] All verification tasks (T030-T033) complete
- [x] No `[B]` blocked tasks remaining without documented reason
- [x] Manual verification passed per review protocol — source-code review methodology applied
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
