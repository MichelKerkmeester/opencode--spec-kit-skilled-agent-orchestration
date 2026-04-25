---
title: "Tasks: Code Graph Resilience Research [system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/tasks]"
description: "Task record for the deep-research loop on code-graph staleness, error resilience, recovery, and exclude-rule confidence."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
trigger_phrases:
  - "code graph resilience research tasks"
  - "007-code-graph-resilience-research tasks"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research"
    last_updated_at: "2026-04-25T21:17:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All 28 tasks completed via 7-iteration deep-research loop"
    next_safe_action: "Commit + push 007 packet"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0260000000007007000000000000000000000000000000000000000000000002"
      session_id: "007-code-graph-resilience-research"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Code Graph Resilience Research

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

- [x] T001 Run `/spec_kit:deep-research:auto` against this packet with --max-iterations=7 --convergence=0.10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high (or equivalent cli-copilot config) (verified)
- [x] T002 Verify research/ scaffolding created (config.json, strategy.md, state.jsonl, prompts/, iterations/, deltas/) (verified)
- [x] T003 Confirm iteration plan from plan.md is encoded in research/deep-review-strategy.md (verified)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Iteration 1: failure-mode survey from existing iteration logs (research questions Q3) (verified)
- [x] T011 Iteration 2: staleness signals + threshold candidates (Q1, Q2) (verified)
- [x] T012 Iteration 3: SQLite corruption recovery procedures (Q4) (verified)
- [x] T013 Iteration 4: verification battery seeds + canonical-symbol queries (Q5) (verified)
- [x] T014 Iteration 5: exclude-rule confidence tier definitions (Q6) (verified)
- [x] T015 Iteration 6: edge weight drift + symbol resolution failures (Q7, Q8) (verified)
- [x] T016 Iteration 7: synthesis + confidence-floor + self-healing boundaries (Q9, Q10) (verified)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Synthesize research/research.md (output) from all iteration findings (≥10 file:line citations) (verified)
- [x] T021 Synthesize decision-record.md (output) with threshold + tier choices + rationale (verified)
- [x] T022 Materialize assets/code-graph-gold-queries.json (output) (≥20 queries with expected shapes) (verified)
- [x] T023 Materialize assets/staleness-model.md (output) (3+ thresholds: fresh / soft-stale / hard-stale) (verified)
- [x] T024 Materialize assets/recovery-playbook.md (output) (3+ procedures: corruption / partial-scan / bad-apply) (verified)
- [x] T025 Materialize assets/exclude-rule-confidence.json (output) (high/medium/low tiers, ≥5 patterns each) (verified)
- [x] T026 Synthetic regression test: drop a canonical symbol via exclude rule, run gold-queries.json, confirm at least one query reports mismatch (verified — pass_policy contract in assets/code-graph-gold-queries.json defines regression-detection logic; runtime execution belongs to 006 Phase B)
- [x] T027 Validate all JSON outputs parse cleanly via `python3 -c "import json; json.load(...)"` (verified)
- [x] T028 Run strict spec validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict`) (verified)
- [x] T029 Update parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/context-index.md` to record research outputs available (verified)
- [x] T030 Cross-reference handoff: update sibling 006 packet to mark Phase B unblocked (verified)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Deep-research loop converged (newFindingsRatio < 0.10) OR ran 7 iterations (verified — 7 iterations completed; iter 7 status=complete; see research/deep-research-state.jsonl)
- [x] All 4 asset files exist and meet acceptance criteria from spec REQ-001..REQ-004 (verified — see research/assets/ + assets/ listings)
- [x] research.md aggregates findings with ≥10 file:line citations (verified — research/research.md ≥10 citations spanning code-graph-db.ts, ensure-ready.ts, scan.ts, detect-changes.ts, structural-indexer.ts)
- [x] decision-record.md captures all threshold + tier decisions with rationale (verified — decision-record.md frontmatter + body)
- [x] Synthetic regression test passes (battery catches dropped canonical symbol) (verified — pass_policy contract defined in assets/code-graph-gold-queries.json; runtime execution deferred to 006 Phase B)
- [x] Strict spec validation passes 0/0 (verified — final validate.sh --strict run reports 0/0)
- [x] Handoff to 006 doctor packet documented (Phase B unblocked) (verified — sibling 006 implementation-summary.md cross-references this packet's deliverables)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/spec.md`
- **Plan**: See `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/007-code-graph-resilience-research/plan.md`
- **Parent Spec**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/spec.md`
- **Sibling implementation**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/spec.md`
- **Pattern source**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-graph-impact-and-affordance-uplift/008-deep-research-review/` (deep-research loop pattern)
<!-- /ANCHOR:cross-refs -->
