---
title: "Tasks: Pre-Existing Test Failure Remediation"
description: "Sequential tasks: 4 test fixes + 2 product-code rename completions + 1 metadata cleanup, then full verification."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "test fix tasks"
  - "remediation sequence"
  - "advisor health restore"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/047-pre-existing-test-failure-remediation"
    last_updated_at: "2026-05-01T04:14:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Tasks defined"
    next_safe_action: "Execute T001 onward"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "047-test-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pre-Existing Test Failure Remediation

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

- [x] T001 Reproduce all 5 failures on clean main
- [x] T002 Diagnose each failure with git history evidence
- [x] T003 Scaffold packet 047 at level 2
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 [P] Update `manual-testing-playbook.vitest.ts` (42→4 scenarios, 9→3 groups, regex `[A-Z]{2}-` → `[A-Z]{2,4}-`)
- [x] T011 [P] Update `advisor-corpus-parity.vitest.ts` (`toHaveLength(200)` → `toHaveLength(197)`; rename describe label)
- [x] T012 [P] Update `plugin-bridge.vitest.ts` (assert via `compat-contract.json` import + values instead of inline string literal match)
- [x] T013 [P] Update `advisor-graph-health.vitest.ts` (`['skill-advisor']` → `['skill_advisor']`)
- [x] T020 Fix `skill_graph_compiler.py` lines 200 + 337 — both `"skill-advisor"` → `"skill_advisor"` (hardcoded injection AND fallback path lookup)
- [x] T021 Fix `skill_advisor.py` line 211 `GRAPH_ONLY_SKILL_IDS = {"skill-advisor"}` → `{"skill_advisor"}`
- [x] T030 Clean `sk-code/graph-metadata.json` (`v1.3.0.0.md` → `v3.0.0.0.md` in source_docs + key_files; remove 2 directory entries)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run all 5 listed tests individually — 9/9 across 4 files green (`npx vitest run <each>` exits 0)
- [ ] T041 Run full vitest unit suite — in progress
- [x] T042 Run `npm run stress` — 56/56 / 163/163 / exit 0 PASS
- [x] T043 Run `python3 skill_graph_compiler.py --validate-only` — VALIDATION PASSED
- [x] T044 Run `validate.sh --strict` for packet 047 — exit 0 PASS
- [x] T045 Generate metadata via `generate-context.js` — graph-metadata.json + description.json published
- [ ] T046 Stage only modified paths, commit with co-author, push to origin main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 5 listed tests green individually
- Full unit suite has no NEW regressions
- Stress suite still 56/56 / 159/159
- `validate.sh --strict` exits 0 for packet 047
- Single commit pushed to `origin main`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md: REQ-001..REQ-005 acceptance criteria
- plan.md: 5-step fix sequence
- implementation-summary.md: per-failure root-cause table + P0 escalations
- checklist.md: verification gates
<!-- /ANCHOR:cross-refs -->
