---
title: "Tasks: Routing Accuracy Hardening"
description: "Tasks for Wave A + B + optional C."
trigger_phrases: ["routing accuracy tasks"]
importance_tier: "critical"
contextType: "tasks"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/004-routing-accuracy-hardening"
    last_updated_at: "2026-04-18T23:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Begin T001"
---
# Tasks: Routing Accuracy Hardening

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

**Task Format**: `T### [P?] [P0/P1/P2] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read research: 019/001/005 research.md Ranked Proposals [Evidence: research.md read; implementation followed Wave A/B/C staged ranking]
- [x] T002 [P0] Copy labeled corpus to regression fixture path [Evidence: `tests/routing-accuracy/labeled-prompts.jsonl` copied from 200-row research corpus]
- [x] T003 [P0] Baseline run: Gate 3 + advisor on corpus, capture baseline metrics [Evidence: `routing-accuracy-wave-a.json` captured pre-Wave-B Gate 3 baseline F1 68.6% and advisor 60.0% after Wave A]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Wave A - Advisor Normalization

- [x] T004 [P0] Add command-bridge to owning-skill mapping table in `skill_advisor.py` [Evidence: `COMMAND_BRIDGE_OWNER_NORMALIZATION` maps memory-save/resume/deep-research/deep-review bridges to owning skills]
- [x] T005 [P0] Add explicit-invocation guard: detect quoted command strings, implementation-target phrases [Evidence: `_should_guard_command_bridge_normalization()` with quoted/reference carve-outs and invocation allowance]
- [x] T006 [P0] Wire normalization into final ranking step, after confidence scoring [Evidence: `normalize_command_bridge_recommendations()` runs after final sort and before metadata stripping]
- [x] T007 [P0] Add unit tests for normalization path + guard carve-outs [Evidence: `python3 .opencode/skill/skill-advisor/tests/test_skill_advisor.py` PASS 44/44, including T243-SA-017/T243-SA-018]
- [x] T008 [P0] Run labeled corpus, verify advisor accuracy >= 60% [Evidence: `routing-accuracy-wave-a.json` advisor accuracy 0.600, overall_pass true]
- [x] T009 [P0] Commit+push Wave A [Evidence: intentionally skipped per dispatch constraint: "DO NOT git commit or git push"]

### Wave B - Gate 3 Deep-Loop Markers

- [x] T010 [P0] Extend `classifyPrompt()` positive trigger list: add deep-loop markers (`deep research`, `deep review`, `:auto`, `convergence`, etc.) [Evidence: `RESUME_TRIGGERS` includes spec_kit deep commands, deep-research/deep-review, loop, sweep/cycle/run/wave, autoresearch, convergence]
- [x] T011 [P0] Add corresponding test cases to `gate-3-classifier.vitest.ts` [Evidence: targeted deep-loop, :auto pairing, resume/context, mixed-tail, and false-positive tests added]
- [x] T012 [P0] Run labeled corpus, verify Gate 3 F1 >= 83% [Evidence: `routing-accuracy-wave-b.json` Gate 3 F1 0.849; final `routing-accuracy-final.json` Gate 3 F1 0.9766]
- [x] T013 [P0] Verify no regression on `analyze`/`decompose`/`phase` historical false-positives [Evidence: final corpus `historical_false_positive_regressions: []`; Vitest historical-token cases pass]
- [x] T014 [P0] Commit+push Wave B [Evidence: intentionally skipped per dispatch constraint: "DO NOT git commit or git push"]

### Wave C - Conditional Follow-Ons

- [x] T015 [P0] Compute joint matrix after Wave A+B [Evidence: Wave B matrix TT 105 / TF 58 / FT 15 / FF 22]
- [x] T016 [P1] Compare to research projection; document residual FF clusters [Evidence: Wave B FF 22 exceeded conditional threshold >20, mostly mixed-tail/read-only override residue]
- [x] T017 [P1] Decide Wave C: ship or defer [Evidence: Wave C shipped because FF 22 remained above conditional threshold]
- [x] T018 [P2] If Wave C: add resume/context markers [Evidence: `resume the packet`, `resume the phase folder`, `reconstruct continuity` markers added]
- [x] T019 [P2] If Wave C: add mixed-tail write exception [Evidence: `hasMixedWriteTail()` plus negation/prompt-only/deep-loop read-only guards; final matrix TT 115 / FT 5 / FF 1]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 [P0] Full regression suite green [Evidence: advisor tests PASS 44/44; gate-3 Vitest PASS 47/47; shared build PASS; corpus final overall_pass true]
- [x] T021 [P0] Update checklist.md [Evidence: checklist.md completed with final Wave A/B/C metrics]
- [x] T022 [P0] Update implementation-summary.md [Evidence: implementation-summary.md populated with changes, decisions, verification, and limitations]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [Evidence: T001-T022 complete]
- [x] No `[B]` blocked tasks remaining [Evidence: no blocked tasks remain]
- [x] Manual verification passed [Evidence: final corpus overall_pass true]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`
- **Source Research**: `../../research/019-system-hardening-pt-03/research.md`
- **Source Corpus**: `../../research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- **Regression Fixture**: `tests/routing-accuracy/labeled-prompts.jsonl`
<!-- /ANCHOR:cross-refs -->
