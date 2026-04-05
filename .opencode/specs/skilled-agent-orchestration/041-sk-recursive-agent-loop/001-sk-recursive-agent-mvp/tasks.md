---
title: "Task Breakdown: Agent Improvement Loop [skilled-agent-orchestration/041-sk-agent-improver-loop/001-sk-agent-improver-mvp/tasks]"
description: "Ordered task list for the evaluator-first sk-agent-improver MVP and later rollout phases."
trigger_phrases:
  - "agent improvement tasks"
  - "sk-agent-improver tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Agent Improvement Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable or grouped workstream |
| `[B]` | Blocked |

**Task Format**: `T-###: Description` with scoped file references where relevant.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001: Create `spec.md` for the Level 3 packet
- [x] T-002: Create `plan.md` with phased MVP rollout
- [x] T-003: Create `tasks.md` with evaluator-first task sequencing
- [x] T-004: Create `checklist.md` with plan-stage verification and pending implementation gates
- [x] T-005: Create `decision-record.md` with the core architectural choices
- [x] T-006: Reconcile packet docs with `../research/research.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Evaluator Contract and First Target

- [x] T-010: Define the MVP target as `.opencode/agent/handover.md` and document why it is the narrowest measurable surface
- [x] T-011: Create the improvement charter asset with goal, evaluator, keep/discard rule, and simplicity tie-break
- [x] T-012: Create `assets/target_manifest.jsonc` with canonical, derived, fixed, and forbidden surface classes
- [x] T-013: Create the evaluator contract reference with baseline, scoring rubric, rejection conditions, and infra-failure handling
- [x] T-014: Decide whether phase 1 loop packaging is OpenCode-only or runtime-parity from day one

### Skill and State Skeleton

- [x] T-020: Create the `sk-agent-improver` skill entrypoint
- [x] T-021: Create the `sk-agent-improver` README surface
- [x] T-022: Create the loop protocol, promotion rules, and quick reference docs
- [x] T-023: Create `assets/improvement_config.json` and the improvement strategy asset
- [x] T-024: Create reducer and scorer script entrypoints under `.opencode/skill/sk-agent-improver/scripts/`

### Agent and Scorer

- [x] T-030: Create the canonical OpenCode loop agent definition
- [x] T-031: Implement proposal-only candidate generation rules in the loop agent
- [x] T-032: Implement `score-candidate.cjs` for deterministic handover scoring
- [x] T-033: Implement `reduce-state.cjs` for dashboard, accepted-state, and summary outputs
- [x] T-034: Ensure infra failures, rejected candidates, and winning candidates are all represented distinctly in JSONL

### Command and Workflow Integration

- [x] T-040: Create the `/improve:agent-improver` command spec
- [x] T-041: Create `improve_agent-improver_auto.yaml`
- [x] T-042: Create `improve_agent-improver_confirm.yaml`
- [x] T-043: Wire packet initialization, iteration dispatch, scoring, and reducer steps into both workflows
- [x] T-044: Add approval checkpoints so `:confirm` can halt before any promotion attempt

### Registration and Runtime Packaging

- [x] T-050: Register the skill in the skill catalog
- [x] T-051: Add skill routing keywords to `.opencode/skill/scripts/skill_advisor.py`
- [x] T-052: Add the packet/feature entry to `.opencode/specs/descriptions.json`
- [x] T-053: Update the framework README to reference the new capability
- [x] T-054: Create runtime loop-agent definitions needed for invocation outside canonical OpenCode
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### MVP Verification

- [x] T-060: Run `validate.sh` on this packet and fix structural issues
- [x] T-061: Run at least one proposal-only dry run against the handover target
- [x] T-062: Confirm the ledger preserves both baseline and rejected-candidate evidence
- [x] T-063: Confirm zero canonical target edits occurred during proposal-only mode
- [x] T-064: Confirm reducer outputs make the best candidate and rejection reasons obvious

### Bounded Auto-Edit Extension

- [x] T-070: Add a promotion workflow that can patch one canonical target only after evaluator and approval gates pass
- [x] T-071: Add rollback instructions and post-edit verification requirements
- [x] T-072: Re-evaluate whether `.opencode/agent/handover.md` remains the right target after the first promoted run

### Runtime Parity and Expansion

- [x] T-080: Define mirror-drift handling before any runtime copies become mutation targets
- [x] T-081: Evaluate a second structured artifact target only after the first scorer has proven stable
- [x] T-082: Document explicit no-go conditions if parity or evaluation remains ambiguous
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Level 3 planning docs exist and reflect the research packet.
- [x] MVP implementation tasks for the proposal-only phase are complete.
- [x] Proposal-only verification passed before any bounded auto-edit work begins.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Research**: See `../research/research.md`
<!-- /ANCHOR:cross-refs -->
