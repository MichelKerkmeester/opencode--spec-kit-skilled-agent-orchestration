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

## Phase 1: Setup

- [ ] T001 Read research: 019/001/005 research.md §Ranked Proposals (P0)
- [ ] T002 Copy labeled corpus to regression fixture path (P0)
- [ ] T003 Baseline run: Gate 3 + advisor on corpus, capture baseline metrics (P0)

## Phase 2: Wave A — Advisor normalization

- [ ] T004 Add command-bridge→owning-skill mapping table in `skill_advisor.py` (P0)
- [ ] T005 Add explicit-invocation guard: detect quoted command strings, implementation-target phrases (P0)
- [ ] T006 Wire normalization into final ranking step, after confidence scoring (P0)
- [ ] T007 Add unit tests for normalization path + guard carve-outs (P0)
- [ ] T008 Run labeled corpus, verify advisor accuracy ≥ 60% (P0)
- [ ] T009 Commit+push Wave A (P0)

## Phase 3: Wave B — Gate 3 deep-loop markers

- [ ] T010 Extend `classifyPrompt()` positive trigger list: add deep-loop markers (`deep research`, `deep review`, `:auto`, `convergence`, etc.) (P0)
- [ ] T011 Add corresponding test cases to `gate-3-classifier.vitest.ts` (P0)
- [ ] T012 Run labeled corpus, verify Gate 3 F1 ≥ 83% (P0)
- [ ] T013 Verify no regression on `analyze`/`decompose`/`phase` historical false-positives (P0)
- [ ] T014 Commit+push Wave B (P0)

## Phase 4: Re-measurement + optional Wave C

- [ ] T015 Compute joint matrix after Wave A+B (P0)
- [ ] T016 Compare to research projection; document residual FF clusters (P1)
- [ ] T017 Decide Wave C: ship or defer (P1)
- [ ] T018 If Wave C: add resume/context markers (P2)
- [ ] T019 If Wave C: add mixed-tail write exception (P2)

## Phase 5: Verification

- [ ] T020 Full regression suite green (P0)
- [ ] T021 Update checklist.md (P0)
- [ ] T022 Update implementation-summary.md (P0)

## Cross-References

- Parent: `../spec.md`
- Source: `../001-initial-research/005-routing-accuracy/research.md`
- Corpus: `../001-initial-research/005-routing-accuracy/corpus/labeled-prompts.jsonl`
