---
title: "Feature Specification: Agent Improvement Loop [skilled-agent-orchestration/041-sk-agent-improver-loop/001-sk-agent-improver-mvp/spec]"
description: "The repo has reusable loop scaffolding, but no evaluator-first system for safely iterating on agent behavior. We need a bounded experiment loop that improves one canonical agent surface without pretending prompt churn is validated progress."
trigger_phrases:
  - "agent improvement loop"
  - "sk-agent-improver"
  - "automatic agent iteration"
  - "evaluator-first"
  - "proposal-only loop"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: Agent Improvement Loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Create a repo-native `sk-agent-improver` system that borrows the good parts of `autoagent-main` without copying its trust boundary. The MVP is evaluator-first and proposal-only: it runs bounded experiments against one canonical source surface, scores candidates independently, records every attempt in an append-only ledger, and blocks canonical file mutation until the scorer and promotion contract are proven.

**Key Decisions**: start with `.opencode/agent/handover.md` as the first target surface, keep runtime mirrors out of the mutation target set for phase 1, and package the loop as skill + command + leaf agent + reducer-backed state bundle rather than a skill-only shortcut.

**Critical Dependencies**: existing handover command/template validation surfaces, `sk-deep-research` state architecture patterns, skill routing and catalog registration, and repo safety rules that require separation between mutation and evaluation.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-03 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Successor** | `002-sk-agent-improver-full-skill/` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo now has enough orchestration, state, and packaging infrastructure to attempt automatic agent iteration, but it does not yet have the one thing that makes such a loop trustworthy: a bounded evaluator contract tied to a single canonical mutation surface. Without that contract, an "agent improvement" skill would mostly automate prompt edits and create false confidence instead of measurable improvement.

### Purpose
Define a safe, phased plan for `sk-agent-improver` that starts with one canonical `.opencode/agent` target, one deterministic evaluator, one append-only experiment ledger, and one promotion gate before any auto-editing of canonical files is allowed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `sk-agent-improver` as a new skill with protocol, references, assets, and operator guidance
- `/improve:agent-improver` as the command entrypoint with `:auto` and `:confirm` workflows
- `@agent-improver` as a LEAF execution surface for bounded candidate generation
- A repo-native control bundle: improvement charter, `target-manifest.jsonc`, `improvement-config.json`, and `improvement-state.jsonl`
- Reducer-managed experiment outputs: iteration artifacts, dashboard/scoreboard, and accepted-candidate state
- A proposal-only MVP that evaluates candidates against the handover surface anchored in `.opencode/agent/handover.md` and `/spec_kit:handover`
- Explicit separation between the mutator and the scorer/reviewer

### Out of Scope
- Broad mutation of `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` as first-wave experiment targets
- Using `@deep-research` or other open-ended synthesis agents as the first benchmark target
- Self-grading mutation where the same agent proposes and approves its own changes
- Overnight autonomous rewrites of the whole `.opencode/agent/` tree
- Promotion to canonical file edits without a proven evaluator and explicit approval gate

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/agent-improver` | Create | Canonical OpenCode loop agent definition |
| `.claude/agents/agent-improver` | Create | Claude runtime definition for the loop agent |
| `.codex/agents/agent-improver.toml` | Create | Codex runtime definition for the loop agent |
| `.gemini/agents/agent-improver` | Create | Gemini runtime definition for the loop agent |
| `.opencode/command/spec_kit/agent-improver` | Create | Command spec for setup, routing, and loop execution |
| `.opencode/command/spec_kit/assets/improve_agent-improver_auto.yaml` | Create | Autonomous workflow for proposal-only execution |
| `.opencode/command/spec_kit/assets/improve_agent-improver_confirm.yaml` | Create | Interactive workflow with approval checkpoints |
| `.opencode/skill/sk-agent-improver/SKILL` | Create | Skill protocol and routing guidance |
| `.opencode/skill/sk-agent-improver/README` | Create | Skill overview and usage examples |
| `.opencode/skill/sk-agent-improver/references/loop_protocol` | Create | Iteration lifecycle and state transitions |
| `.opencode/skill/sk-agent-improver/references/evaluator_contract` | Create | Deterministic scoring contract for MVP targets |
| `.opencode/skill/sk-agent-improver/references/promotion_rules` | Create | Promotion, rollback, and drift rules |
| `.opencode/skill/sk-agent-improver/references/quick_reference` | Create | One-page operator cheat sheet |
| `.opencode/skill/sk-agent-improver/assets/improvement_charter` | Create | Human-authored policy template for each experiment packet |
| `.opencode/skill/sk-agent-improver/assets/target_manifest.jsonc` | Create | Machine-readable target classification and mutability map |
| `.opencode/skill/sk-agent-improver/assets/improvement_config.json` | Create | Execution mode, budgets, and acceptance thresholds |
| `.opencode/skill/sk-agent-improver/assets/improvement_strategy` | Create | Mutable strategy/state summary for fresh-context iterations |
| `.opencode/skill/sk-agent-improver/scripts/reduce-state.cjs` | Create | Reducer for dashboard, accepted state, and score summaries |
| `.opencode/skill/sk-agent-improver/scripts/score-candidate.cjs` | Create | Deterministic evaluator harness for the first target |
| `.opencode/skill/README` | Modify | Register the new skill in the catalog |
| `.opencode/skill/scripts/skill_advisor.py` | Modify | Route agent-improvement queries to the new skill |
| `.opencode/specs/descriptions.json` | Modify | Add packet/feature description entry |
| `.opencode/README` | Modify | Document the new loop as an available capability |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The MVP runs in proposal-only mode | A full loop can produce and score candidate outputs without editing canonical target files |
| REQ-002 | The mutator and scorer are independent | Candidate generation and acceptance decisions are executed by separate roles, scripts, or phases |
| REQ-003 | The first experiment target is one canonical `.opencode/agent` surface | The target manifest names `.opencode/agent/handover.md` as canonical and classifies runtime mirrors as derived or fixed |
| REQ-004 | Every iteration is written to an append-only experiment ledger | `improvement-state.jsonl` records baseline, candidate, score, status, and acceptance outcome for every run |
| REQ-005 | The loop has a promotion gate before canonical mutation | No accepted candidate can patch a canonical file until the evaluator threshold and approval rule are both satisfied |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The control bundle exists for each experiment packet | Charter, manifest, config, and state files are initialized from skill assets |
| REQ-007 | The first evaluator is deterministic and artifact-focused | The scorer checks handover output structure and required sections rather than prompt prose quality alone |
| REQ-008 | Reducer-owned summaries exist | Dashboard/scoreboard and accepted-candidate state are generated from JSONL rather than manually edited |
| REQ-009 | The command supports `:auto` and `:confirm` execution modes | Both workflows share setup logic but differ in approval gating |
| REQ-010 | Runtime parity is treated as a later expansion problem, not an MVP target | The plan explicitly defers runtime-mirror mutation until a drift and promotion contract exists |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Initializing `/improve:agent-improver` in a spec folder creates the control bundle plus an empty append-only state ledger.
- **SC-002**: A dry run against the handover target produces at least one candidate artifact, one score record, one reducer-generated dashboard update, and zero canonical file edits.
- **SC-003**: The target manifest clearly distinguishes canonical, derived, fixed, and forbidden surfaces for the first experiment.
- **SC-004**: The scorer can reject bad candidates for structural reasons and preserve those failures in the ledger.
- **SC-005**: Human reviewers can identify the current best candidate and why it won from reducer outputs alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.opencode/agent/handover.md` plus `/spec_kit:handover` validation surfaces | Defines the first target and its measurable output contract | Keep MVP scoped to handover until the evaluator is proven |
| Dependency | `sk-deep-research` state/reducer pattern | Supplies reusable loop scaffolding | Reuse the packet skeleton but replace convergence semantics with score governance |
| Risk | Scorer still ends up too subjective | High | Start with structural artifact checks and section-level validation only |
| Risk | Runtime mirror drift becomes entangled with the MVP | High | Mark mirrors as derived or fixed in the first target manifest and exclude them from mutation |
| Risk | Proposal-only mode feels slow or underpowered | Medium | Accept the slower first phase to prove trust before enabling auto-edit promotion |
| Risk | Loop infrastructure is packaged but not reviewable | Medium | Require reducer outputs, human-readable ledgers, and explicit promotion rules |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A single proposal-only iteration completes in under 3 minutes on local workflow infrastructure.
- **NFR-P02**: Reducer generation for a 20-iteration experiment completes in under 10 seconds.

### Reliability
- **NFR-R01**: Proposal-only mode is crash-tolerant because the ledger is append-only and reducer outputs are reproducible from state.
- **NFR-R02**: Evaluator failures are recorded distinctly from candidate-quality failures.

### Maintainability
- **NFR-M01**: Target mutability is described in one machine-readable manifest, not implicit prose scattered across prompts.
- **NFR-M02**: Promotion rules are explicit enough that a future packet can add bounded auto-editing without rewriting the whole architecture.

---

## 8. EDGE CASES

### Data Boundaries
- Empty charter goals: command setup blocks execution until the operator defines a target outcome and evaluator.
- Over-broad manifest: initialization fails if the target set spans multiple canonical directories in phase 1.

### Error Scenarios
- Evaluator infra failure: record the run as infrastructure-failed and do not treat it as a model regression.
- Candidate ties baseline score: prefer the simpler change or keep the baseline if simplicity is not demonstrable.
- No acceptable candidate after N iterations: stop the loop, preserve evidence, and surface the blocker in the dashboard.
- Runtime mirror ambiguity: if a candidate touches a derived mirror in phase 1, reject it as out-of-scope drift.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | New skill, new command, new agent, reducer scripts, packet state model |
| Risk | 17/25 | Automation affecting agent behavior, false-confidence risk, promotion safety |
| Research | 18/20 | Research packet complete with 13 iterations and clear recommendations |
| Multi-Agent | 6/15 | Mutator and scorer separation, but MVP keeps execution bounded |
| Coordination | 9/15 | Requires alignment across command, skill, agent, and reducer surfaces |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The evaluator is not strict enough to separate better candidates from prettier prose | H | M | Keep phase 1 tied to handover artifact structure and deterministic checks |
| R-002 | The loop accidentally mutates canonical files before the promotion gate is proven | H | L | Enforce proposal-only mode and forbid canonical writes in phase 1 |
| R-003 | Runtime mirror drift pressures the MVP into a multi-surface target too early | H | M | Keep mirrors classified as derived/fixed and out of the initial target set |
| R-004 | The state model reuses deep-research semantics too literally | M | M | Replace convergence-by-novelty with score, plateau, and acceptance governance |
| R-005 | The loop becomes a packaging exercise without evaluation substance | H | M | Treat evaluator contract as the first implementation phase and block rollout without it |

---

## 11. USER STORIES

### US-001: Safe Experiment Owner (Priority: P0)

**As a** framework maintainer, **I want** to run bounded agent-improvement experiments against one canonical source surface, **so that** I can learn whether a candidate is better before touching production prompt files.

**Acceptance Criteria**:
1. **Given** a configured experiment packet, **When** I run the loop in proposal-only mode, **Then** it generates candidate outputs and scores them without editing canonical targets.
2. **Given** a failed candidate, **When** the evaluator rejects it, **Then** the rejection is preserved in the ledger and visible in the dashboard.

---

### US-002: Independent Reviewer (Priority: P0)

**As a** reviewer, **I want** the scorer and promotion gate to be independent from the mutator, **so that** accepted candidates represent measured improvement rather than self-approval.

**Acceptance Criteria**:
1. **Given** a candidate and a baseline, **When** scoring runs, **Then** the evaluator produces comparable results for both.
2. **Given** a winning candidate, **When** promotion is considered, **Then** the workflow can show why it won and what files it is allowed to affect.

---

### US-003: Future Expander (Priority: P1)

**As a** future maintainer, **I want** the loop to distinguish canonical, derived, and fixed surfaces, **so that** later phases can add bounded auto-editing and runtime parity without redesigning the protocol.

**Acceptance Criteria**:
1. **Given** the first target manifest, **When** I inspect it, **Then** I can see which surfaces are mutable now and which are deferred.
2. **Given** a later phase request, **When** I expand the target set, **Then** I can do so by updating the manifest and promotion rules rather than rewriting the whole loop.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the first evaluator threshold be purely structural, or should it combine structural pass/fail with a simple DQI-style tie-break for borderline candidates?
- Does the loop itself need full runtime-parity agent definitions in phase 1, or can the MVP ship first on the canonical OpenCode path and add mirror compatibility in phase 2?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Report**: See `../research/research.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
