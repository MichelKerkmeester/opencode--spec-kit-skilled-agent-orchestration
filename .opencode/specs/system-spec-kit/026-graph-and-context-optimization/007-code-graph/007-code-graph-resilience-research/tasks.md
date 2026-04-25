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
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created tasks.md"
    next_safe_action: "Create remaining packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0260000000007007000000000000000000000000000000000000000000000002"
      session_id: "007-code-graph-resilience-research"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
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

- [ ] T001 Run `/spec_kit:deep-research:auto` against this packet with --max-iterations=7 --convergence=0.10 --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high (or equivalent cli-copilot config)
- [ ] T002 Verify research/ scaffolding created (config.json, strategy.md, state.jsonl, prompts/, iterations/, deltas/)
- [ ] T003 Confirm iteration plan from plan.md is encoded in research/deep-review-strategy.md
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T010 Iteration 1: failure-mode survey from existing iteration logs (research questions Q3)
- [ ] T011 Iteration 2: staleness signals + threshold candidates (Q1, Q2)
- [ ] T012 Iteration 3: SQLite corruption recovery procedures (Q4)
- [ ] T013 Iteration 4: verification battery seeds + canonical-symbol queries (Q5)
- [ ] T014 Iteration 5: exclude-rule confidence tier definitions (Q6)
- [ ] T015 Iteration 6: edge weight drift + symbol resolution failures (Q7, Q8)
- [ ] T016 Iteration 7: synthesis + confidence-floor + self-healing boundaries (Q9, Q10)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Synthesize research/research.md (output) from all iteration findings (≥10 file:line citations)
- [ ] T021 Synthesize decision-record.md (output) with threshold + tier choices + rationale
- [ ] T022 Materialize assets/code-graph-gold-queries.json (output) (≥20 queries with expected shapes)
- [ ] T023 Materialize assets/staleness-model.md (output) (3+ thresholds: fresh / soft-stale / hard-stale)
- [ ] T024 Materialize assets/recovery-playbook.md (output) (3+ procedures: corruption / partial-scan / bad-apply)
- [ ] T025 Materialize assets/exclude-rule-confidence.json (output) (high/medium/low tiers, ≥5 patterns each)
- [ ] T026 Synthetic regression test: drop a canonical symbol via exclude rule, run gold-queries.json, confirm at least one query reports mismatch
- [ ] T027 Validate all JSON outputs parse cleanly via `python3 -c "import json; json.load(...)"`
- [ ] T028 Run strict spec validation (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict`)
- [ ] T029 Update parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/context-index.md` to record research outputs available
- [ ] T030 Cross-reference handoff: update sibling 006 packet to mark Phase B unblocked
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Deep-research loop converged (newFindingsRatio < 0.10) OR ran 7 iterations
- [ ] All 4 asset files exist and meet acceptance criteria from spec REQ-001..REQ-004
- [ ] research.md aggregates findings with ≥10 file:line citations
- [ ] decision-record.md captures all threshold + tier decisions with rationale
- [ ] Synthetic regression test passes (battery catches dropped canonical symbol)
- [ ] Strict spec validation passes 0/0
- [ ] Handoff to 006 doctor packet documented (Phase B unblocked)
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
