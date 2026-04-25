---
title: "...em-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-advisor-phrase-booster-tailoring/tasks]"
description: "3-phase serial task list: baseline + audit, migrate + add, regress + deliver"
trigger_phrases:
  - "advisor phrase booster tasks"
  - "phrase booster migration tasks"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/003-advisor-phrase-booster-tailoring"
    last_updated_at: "2026-04-15T00:00:00Z"
    last_updated_by: "spec-kit-start"
    recent_action: "Authored Level 2 task list (17 tasks, 3 phases, serial)"
    next_safe_action: "Begin Phase 1 baseline capture (T001)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-start-013-2026-04-15"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: Advisor Phrase-Booster Tailoring

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
## Phase 1: Baseline + Audit

- [ ] T001 Run `python3 skill_advisor_regression.py --threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92` and capture JSON output (scratch/baseline-regression.json)
- [ ] T002 Record baseline confidence for 5 REQ-010 queries: "save this conversation context to memory", "deep research loop convergence", "code review merge readiness", "5-dimension agent scoring", "responsive css layout fix" (scratch/baseline-queries.md)
- [ ] T003 Grep multi-word keys in INTENT_BOOSTERS (lines ~496-788): `grep -nE '^\s*"[^"]+\s+[^"]+":\s*\(' skill_advisor.py | awk -F'[":]' '{print $2}'` (scratch/multi-word-inventory.md)
- [ ] T004 Grep multi-word keys in MULTI_SKILL_BOOSTERS (pattern similar) — treat findings same as INTENT_BOOSTERS (scratch/multi-word-inventory.md)
- [ ] T005 For each multi-word key found: grep against PHRASE_INTENT_BOOSTERS; classify disposition as `duplicate-remove`, `migrate-with-same-weight`, `migrate-with-higher-phrase-weight-kept`, or `schema-violation` (scratch/phrase-boost-delta.md — per-key table)
- [ ] T006 Draft 5+ candidate new PHRASE entries for under-covered Public identifiers (REQ-011); append rationale for each to delta report (scratch/phrase-boost-delta.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Migration + Additions

- [ ] T010 Apply all `duplicate-remove` dispositions: delete from INTENT_BOOSTERS (keep PHRASE version intact) (.opencode/skill/skill-advisor/scripts/skill_advisor.py)
- [ ] T011 Apply all `migrate` dispositions: delete from INTENT_BOOSTERS, add to PHRASE_INTENT_BOOSTERS as `"phrase": [(skill, weight)]` preserving original weight unless audit says otherwise (same file)
- [ ] T012 Add 5+ new PHRASE_INTENT_BOOSTERS entries from T006 draft (same file)
- [ ] T013 Add inline comment block near PHRASE_INTENT_BOOSTERS definition: role of each dict, anti-pattern warning not to re-add multi-word keys to INTENT_BOOSTERS (same file)
- [ ] T014 Append 5-10 P1 fixture cases for newly-routed phrases to scripts/fixtures/skill_advisor_regression_cases.jsonl using schema `{"id":"P1-PHRASE-NNN","priority":"P1","prompt":"...","confidence_only":false,"expect_result":true,"expected_top_any":[...],"expect_kind":"skill","allow_command_bridge":false}` (scripts/fixtures/skill_advisor_regression_cases.jsonl)
- [ ] T015 Python AST parse-check: `python3 -c "import ast; ast.parse(open('skill_advisor.py').read())"` (validation only)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Regression + Delta

- [ ] T020 Run `python3 skill_advisor_regression.py --threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92` — MUST exit 0 (REQ-003) (scratch/post-regression.json)
- [ ] T021 Compare post vs baseline: P0 pass rate ≥ baseline (REQ-004) (scratch/phrase-boost-delta.md — results section)
- [ ] T022 Re-measure confidence for 5 REQ-010 queries; confirm ≥0.10 uplift or NONE→valid-match transition (scratch/phrase-boost-delta.md)
- [ ] T023 [P2] Run `skill_advisor_bench.py` for latency; record p95; confirm within current+5% (scratch/phrase-boost-delta.md)
- [ ] T024 Finalize `scratch/phrase-boost-delta.md` with full per-key disposition + before/after query table + regression summary
- [ ] T025 Author implementation-summary.md using Level 2 template (implementation-summary.md)
- [ ] T026 Mark all P0 + P1 items in checklist.md with evidence references (checklist.md)
- [ ] T027 Clean transient `scratch/baseline-*.json` + `*-inventory.md` after checklist P0 gate passes (keep phrase-boost-delta.md as permanent artifact)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks `[x]` (T001-T005, T010-T012, T015, T020-T022, T024-T026)
- [ ] All P1 tasks `[x]` or deferred (T006, T013, T014, T023)
- [ ] No `[B]` blocked remaining
- [ ] spec.md SC-001 through SC-007 satisfied with evidence in checklist.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Delta Report**: `scratch/phrase-boost-delta.md` (permanent)
<!-- /ANCHOR:cross-refs -->

---

<!--
Level 2 task list (~95 lines)
- 3 serial phases with regression harness as gate
-->
