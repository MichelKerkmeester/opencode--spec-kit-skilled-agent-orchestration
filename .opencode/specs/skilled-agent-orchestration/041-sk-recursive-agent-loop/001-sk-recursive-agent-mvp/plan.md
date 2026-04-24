---
title: "Implementation Plan: Agent [skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp/plan]"
description: "Phased plan for building sk-improve-agent as an evaluator-first experiment system with a proposal-only MVP on the handover target."
trigger_phrases:
  - "agent improvement plan"
  - "sk-improve-agent plan"
  - "proposal-only mvp"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/001-sk-recursive-agent-mvp"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Agent Improvement Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML workflows, JSON/JSONC state, Node.js reducer/scoring scripts |
| **Primary Runtime Surface** | `.opencode/agent/`, `.opencode/command/spec_kit/`, `.opencode/skill/` |
| **Initial Target Under Test** | `.opencode/agent/handover.md` evaluated through `/spec_kit:handover` artifact expectations |
| **State Model** | `improvement-state.jsonl` plus strategy, charter, manifest, config, and reducer-owned dashboard outputs |
| **Verification Basis** | Spec validation, deterministic artifact scoring, proposal-only dry runs, reducer outputs |

### Overview

Build `sk-improve-agent` as a sibling to `sk-deep-research`, but change the meaning of success. Instead of question convergence, the loop optimizes for score governance: propose bounded candidate changes or outputs, score them independently, retain evidence from every attempt, and promote only when the evaluator and policy both allow it.

The MVP stays intentionally narrow. It targets the handover surface because handover behavior already has a structured output contract, a canonical source file, and a command workflow that is much easier to score than open-ended synthesis agents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Level 3 packet docs are populated and synchronized.
- The first target, evaluator contract, and promotion boundary are defined before implementation starts.
- Research conclusions in `../research/research.md` are reflected in scope, tasks, and ADRs.

### Definition of Done
- Proposal-only MVP can initialize an experiment packet, run bounded candidate scoring, and generate reducer outputs without canonical file edits.
- Required skill, command, agent, and registration artifacts exist and validate.
- The handover target manifest, scorer, and promotion rules are explicit enough to support a follow-on bounded auto-edit phase without redesign.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A five-surface experiment architecture: command orchestration, mutator execution, evaluator scoring, reducer/state management, and skill-backed protocol documentation.

### Key Components
- **Command layer**: `/improve:agent-improver` owns setup, packet initialization, iteration control, and promotion checkpoints.
- **Mutator layer**: `@agent-improver` generates bounded candidates against one canonical target surface.
- **Evaluator layer**: deterministic scoring scripts and/or fixed validation commands score candidates separately from the mutator.
- **State layer**: charter, manifest, config, strategy, JSONL ledger, iteration artifacts, and reducer-owned dashboard/accepted-state views.
- **Skill layer**: `sk-improve-agent` documents the loop protocol, evaluator contract, promotion rules, and operator guidance.

### Data Flow
The command initializes an experiment packet from skill assets, dispatches the loop agent to generate candidates, passes those candidates through an independent scorer, appends all results to `improvement-state.jsonl`, and runs the reducer to update dashboard and best-state views. Phase 1 stops there. Later phases may convert accepted candidates into bounded auto-edits after the promotion contract is proven.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Packet and ADR Foundation
Complete the Level 3 packet before implementation work starts.
- spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- Sync the planning docs to the research packet

### Phase 2: Evaluator Contract and First Target
Lock the MVP around one measurable surface before building the loop.
- Define the first target as `.opencode/agent/handover.md`
- Specify the corresponding artifact contract through `/spec_kit:handover`
- Write the evaluator contract, improvement charter, and target manifest
- Decide acceptance threshold, baseline handling, and simplicity tie-break

### Phase 3: Skill and State Skeleton
Build the reusable packet/state model that future experiments will use.
- Create the skill entrypoint and README surfaces for `sk-improve-agent`
- Add loop protocol, promotion rules, and quick reference docs
- Add config and strategy assets
- Create the reducer and scoring script entrypoints

### Phase 4: Loop Agent and Scorer
Implement the two key execution roles.
- Create `@agent-improver` as a LEAF-only mutator
- Implement the deterministic scorer script for the handover target
- Ensure baseline, rejected candidates, infra failures, and best-state records are all represented in the ledger

### Phase 5: Command and Workflow Integration
Expose the loop through the standard command system.
- Create `/improve:agent-improver`
- Add `:auto` and `:confirm` YAML workflows
- Define setup prompts, approval checkpoints, and output paths

### Phase 6: Registration and Runtime Packaging
Make the capability discoverable without broadening the mutation target.
- Add skill catalog and skill_advisor registration
- Add descriptions.json and README references
- Package runtime definitions needed for the loop itself

### Phase 7: MVP Verification
Prove the phase-1 thesis before expanding scope.
- Run proposal-only dry runs on the handover target
- Verify zero canonical file edits during scoring
- Confirm reducer outputs make winner selection understandable
- Reject the MVP if the scorer cannot distinguish clearly good and bad candidates

### Phase 8: Bounded Auto-Edit Extension
Only begin after the MVP scorer is trusted.
- Allow accepted candidates to patch one canonical file under strict promotion rules
- Add rollback handling and post-edit verification
- Keep runtime mirrors excluded unless parity rules are ready

### Phase 9: Runtime Parity and Additional Targets
Expand only after the first target has proven stable.
- Add explicit drift-management rules for derived runtime copies
- Evaluate whether a second structured artifact target belongs in scope
- Consider broader agent families only after a second evaluator contract exists
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence Source |
|-----------|-------|-----------------|
| Spec validation | Packet structure, anchors, placeholders, and required files | `validate.sh` on this spec folder |
| Scorer contract tests | Baseline vs intentionally bad handover candidates | `score-candidate.cjs` fixtures and dry-run outputs |
| Workflow validation | Setup flow, packet initialization, and reducer invocation | command dry runs in `:confirm` and `:auto` |
| Proposal-only safety | No canonical file edits during MVP loop | git diff scope plus ledger/reducer outputs |
| Registration validation | Skill advisor routing and catalog visibility | `skill_advisor.py` query plus catalog file checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

```
Phase 1 (Packet Docs)
    |
Phase 2 (Evaluator + First Target)
    |
Phase 3 (Skill + State Skeleton)
    |
Phase 4 (Loop Agent + Scorer)
    |
Phase 5 (Command + YAML Workflows)
    |
Phase 6 (Registration + Runtime Packaging)
    |
Phase 7 (Proposal-Only MVP Verification)
    |
Phase 8 (Bounded Auto-Edit Extension)
    |
Phase 9 (Runtime Parity + Additional Targets)
```

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/agent/handover.md` and `/spec_kit:handover` | Internal target/evaluator dependency | Green | MVP target contract becomes ambiguous |
| `sk-deep-research` loop/state pattern | Internal architecture reference | Green | More design work required for packet state model |
| Skill routing/catalog surfaces | Internal registration dependency | Green | New skill is not discoverable |
| Independent scoring harness | Core blocker | Yellow | The feature should not ship without it |
| Runtime packaging decision for the loop itself | Coordination dependency | Yellow | Affects how broadly phase 1 can be invoked across runtimes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The evaluator cannot reliably separate good and bad candidates, the proposal-only boundary leaks into canonical edits, or runtime packaging complexity starts redefining the MVP.
- **Procedure**: Revert the loop artifacts added for this packet, keep the research packet and planning docs, and preserve any experiment ledgers in the packet for future analysis.
- **Scope**: Documentation, command, skill, and loop-infrastructure files only. No application data migration is involved.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Evaluator Contract ──► Skill + State ──► Agent + Scorer ──► Command + Workflows
         │                                                        │
         └──────────────► MVP Verification ◄──────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet Docs | Research packet only | All implementation work |
| Evaluator + First Target | Packet Docs | Skill, agent, scorer, command |
| Skill + State Skeleton | Evaluator + First Target | Agent + scorer, command |
| Agent + Scorer | Skill + State Skeleton | Command, MVP verification |
| Command + Workflows | Agent + Scorer | MVP verification |
| MVP Verification | All previous | Auto-edit extension |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet Docs | Low | 1-2 hours |
| Evaluator + First Target | Medium | 4-6 hours |
| Skill + State Skeleton | Medium | 4-6 hours |
| Agent + Scorer | High | 6-10 hours |
| Command + Workflows | High | 6-10 hours |
| MVP Verification | Medium | 2-4 hours |
| **Total MVP** | | **23-38 hours** |

---

## L3: DEPENDENCY GRAPH

```
┌────────────────────┐
│  Packet + Research │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ Evaluator Contract │
└──────┬───────┬─────┘
       │       │
       ▼       ▼
┌────────────┐ ┌───────────────┐
│ Skill/State│ │ First Target  │
│ Skeleton   │ │ Manifest      │
└──────┬─────┘ └──────┬────────┘
       └──────┬───────┘
              ▼
      ┌────────────────┐
      │ Agent + Scorer │
      └──────┬─────────┘
             ▼
      ┌────────────────┐
      │ Command + YAML │
      └──────┬─────────┘
             ▼
      ┌────────────────┐
      │ MVP Verification│
      └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Evaluator contract | Research packet | Scoring rules, thresholds | Skill/state, agent/scorer |
| Target manifest | Evaluator contract | Mutable/fixed/derived map | Agent/scorer, MVP verification |
| Skill/state skeleton | Evaluator contract | Assets, docs, reducer shape | Agent/scorer, command |
| Agent/scorer | Skill/state + manifest | Candidate loop + scores | Command, MVP verification |
| Command/workflows | Agent/scorer | Executable loop surface | MVP verification |

---

## L3: CRITICAL PATH

1. **Evaluator contract + first target lock** - 4-6 hours - CRITICAL
2. **Skill/state skeleton** - 4-6 hours - CRITICAL
3. **Loop agent + deterministic scorer** - 6-10 hours - CRITICAL
4. **Command + workflow integration** - 6-10 hours - CRITICAL
5. **Proposal-only MVP verification** - 2-4 hours - CRITICAL

**Total Critical Path**: 22-36 hours

**Parallel Opportunities**:
- Skill docs/assets and reducer scaffolding can begin once the evaluator contract is stable.
- Runtime packaging for the loop itself can trail the canonical OpenCode implementation if phase 1 invocation scope is intentionally narrow.

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Target and evaluator locked | Handover target, manifest class map, and scoring contract approved | Phase 2 |
| M2 | Loop surfaces implemented | Skill, agent, scorer, reducer, and command artifacts exist | Phase 6 |
| M3 | Proposal-only MVP proven | Dry run produces candidates and scores with zero canonical edits | Phase 7 |
| M4 | Auto-edit gate decision | We can say yes or no to bounded canonical mutation with evidence | Phase 8 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Proposal-Only Before Auto-Edit

**Status**: Proposed

**Context**: The research packet showed that packaging a skill is easy but proving a trustworthy evaluator is hard.

**Decision**: The MVP stops at candidate generation plus scoring. Canonical file edits are deferred until the scorer and promotion rules are trusted.

**Consequences**:
- Safer initial rollout with lower false-confidence risk
- Slower path to visible automatic editing, but much better evidence quality

**Alternatives Rejected**:
- Mutation-first MVP: rejected because it would make evaluator quality impossible to trust

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the active packet phase before editing runtime or workflow files.
- Re-read `../research/research.md` and `decision-record.md` before changing target scope or evaluator behavior.
- Validate the current packet after each structural documentation batch and after each future implementation phase.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| 1 | Keep the MVP evaluator-first and proposal-only until checklist gates explicitly allow promotion work. |
| 2 | Treat `.opencode/agent/handover.md` as the only phase-1 mutation target unless the packet is intentionally amended. |
| 3 | Keep runtime mirrors out of the target set until drift and promotion rules are documented. |
| 4 | Preserve rejected-candidate evidence in the ledger; do not discard failed runs just because they lost. |

### Status Reporting Format

- Report which packet phase was updated.
- Report the current validation outcome and whether any warnings remain.
- Mark any future-facing work as planned, not shipped.

### Blocked Task Protocol

1. Stop at the first validator, scorer, or target-scope failure.
2. Repair the current packet or implementation surface before broadening scope.
3. If the blocker changes MVP assumptions, update the ADRs or pause and escalate instead of improvising a wider solution.
