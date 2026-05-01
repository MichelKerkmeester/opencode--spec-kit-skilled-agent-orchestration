---
title: "Feature [system-spec-kit/z_future/agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/spec]"
description: "Read-only three-wave, 30-iteration deep research on the bundled Agent Lightning repository to extract RL-specific tracing, UX, command, agent, skill, and workflow patterns that could improve system-spec-kit without duplicating its core governance or memory capabilities."
trigger_phrases:
  - "001-agent-lightning-main research spec"
  - "agent lightning phase spec"
  - "agentic systems rl tracing research"
  - "system-spec-kit agent lightning study"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: 001-agent-lightning-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase `001-agent-lightning-main` is a read-only research packet that studies the bundled Agent Lightning repository as a source of RL-specific and operator-surface patterns for `system-spec-kit`. Across three ten-iteration waves, the research covers tracing, span lifecycle management, reward attachment, adapter pipelines, trainer and algorithm boundaries, command UX, template UX, agent topology, skill packaging, automation surfaces, and end-to-end workflow friction, then maps each finding to a concrete `system-spec-kit` file, module, or concept.

**Key Decisions**: Keep all writes inside this phase folder; treat `external/` as read-only; prefer static source analysis over runtime reproduction; require exact file:line citations in every iteration artifact.

**Critical Dependencies**: Phase brief at `phase-research-prompt.md`; Level 3 phase docs; strict validation via `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`; bundled Agent Lightning checkout under `external/`; comparison targets under `.opencode/skill/system-spec-kit/`, `.opencode/command/`, and `.opencode/agent/`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-04-09 |
| **Branch** | `main` |
| **Phase Folder** | `.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`Code_Environment/Public` already has mature orchestration and recovery surfaces in `.opencode/agent/`, Spec Kit Memory, validation gates, and command workflows, but it does not yet have an evidence-backed answer for whether RL-oriented tracing and reward patterns would strengthen `system-spec-kit` or merely duplicate existing prompt and workflow orchestration. Agent Lightning specifically claims zero-code-change observability plus pluggable optimization loops; without a function-level audit of how its tracer, store, adapter, trainer, and algorithm modules actually interact, any attempt to import those ideas into `system-spec-kit` would be speculative and likely mis-scoped.

### Purpose

Produce a three-wave, 30-iteration evidence-backed research report that classifies Agent Lightning patterns as `adopt now`, `prototype later`, or `reject`, and ties every recommendation to a concrete `system-spec-kit` target file, module, or concept.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The bundled Agent Lightning repository under `external/`, especially:
  - `README.md`
  - `agentlightning/tracer/`
  - `agentlightning/store/`
  - `agentlightning/adapter/`
  - `agentlightning/trainer/`
  - `agentlightning/algorithm/`
  - representative `examples/` and `docs/`
- Comparison against existing Public surfaces:
  - `.opencode/skill/system-spec-kit/SKILL.md`
  - `.opencode/skill/system-spec-kit/scripts/`
  - `.opencode/skill/system-spec-kit/mcp_server/`
  - `.opencode/skill/system-spec-kit/constitutional/`
  - `.opencode/command/spec_kit/`
  - `.opencode/command/memory/`
  - `.opencode/agent/`
- Thirty dated research iteration artifacts under `research/iterations/`
- State tracking in `research/deep-research-state.jsonl`
- Canonical synthesis in `research/research.md`
- Dashboard summary in `research/deep-research-dashboard.md`
- Packet closeout documentation in `implementation-summary.md`

### Out of Scope

- Editing anything under `external/`
- Editing `system-spec-kit` source, commands, agents, or tests
- GPU setup, live training runs, or reproduction of Agent Lightning benchmarks
- Dashboard styling, example polish, or peripheral repo maintenance not tied to RL-specific value
- Cross-phase work for sibling phases `002-009` beyond noting overlap risk and differentiation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/Modify | Research packet contract and acceptance criteria |
| `plan.md` | Create/Modify | Execution plan, AI protocol, dependency chain |
| `tasks.md` | Create/Modify | Task tracking across validation, research, and closeout |
| `checklist.md` | Create/Modify | Verification checklist with evidence-backed completion |
| `decision-record.md` | Create/Modify | Research-scope ADRs and adoption framing decisions |
| `implementation-summary.md` | Create/Modify | Final closeout summary after research completes |
| `research/iterations/iteration-*.md` | Create | Iteration outputs with citations |
| `research/deep-research-state.jsonl` | Create/Append | Structured per-iteration state log |
| `research/research.md` | Create/Modify | Canonical synthesis report |
| `research/deep-research-dashboard.md` | Create/Modify | Iteration dashboard and totals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read `phase-research-prompt.md` and use it as the governing phase brief | Plan and iteration scope explicitly reflect the phase brief's target questions and constraints |
| REQ-002 | Validate Level 3 phase docs before deep research begins | `validate.sh <phase-path> --strict` passes before iteration 001 |
| REQ-003 | Execute at least 5 meaningful iterations per wave and target 10 unless convergence or insufficient evidence stops earlier | `research/iterations/` contains 30 dated iteration files across the three completed waves and `research/deep-research-state.jsonl` records each run |
| REQ-004 | Each iteration investigates one narrow, falsifiable question tied to a concrete `system-spec-kit` target | Every iteration file includes a precise question, conclusion, adoption recommendation, and target path |
| REQ-005 | Every finding is backed by real file:line citations from both Agent Lightning and Public when relevant | Iteration and synthesis files use `[SOURCE: file:line-line]` citations only for real lines |
| REQ-006 | The synthesis must distinguish RL-specific value from generic orchestration overlap | `research/research.md` explicitly marks adopt, prototype, and reject recommendations with rationale |
| REQ-007 | Cross-phase overlap with phase 005 is explicitly bounded | Final report states how RL-specific insights differ from generic agent-loop work |
| REQ-008 | All writes remain inside this phase folder | Final verification confirms no edits outside the phase folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Map at least three end-to-end Agent Lightning flows | Research covers span creation, span-to-training-data transformation, and trainer or store coordination |
| REQ-010 | Cover tracer, store, adapter, trainer, algorithm, examples, and docs at least once across the loop | State log and report show subsystem coverage rather than repeating one narrow module |
| REQ-011 | Produce a dashboard-style summary of iterations and finding totals | `research/deep-research-dashboard.md` exists and reflects the executed iterations |
| REQ-012 | Produce a closeout summary plus an auditable memory-save record after research completes | `implementation-summary.md` exists and the earlier successful `generate-context.js` save remains documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 30 evidence-backed iterations across three waves complete unless a valid stop rule ends a wave after at least 5 iterations.
- **SC-002**: At least 20 actionable findings appear in `research/research.md`, each mapped to a concrete `system-spec-kit` file, module, or concept.
- **SC-003**: Every finding carries exact source citations and an explicit recommendation tier.
- **SC-004**: The report clearly identifies which Agent Lightning patterns are RL-specific enough to matter for Public and which are redundant.
- **SC-005**: `validate.sh --strict` passes before closing the phase.
- **SC-006**: No file outside this phase folder is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `phase-research-prompt.md` fidelity | Wrong framing would skew all iterations | Read the brief first and mirror its target questions in the plan |
| Dependency | Agent Lightning source layout under `external/` | Missing or moved files could weaken evidence quality | Use repo mapping plus CocoIndex and direct reads before each iteration |
| Risk | RL concepts overlap with generic orchestration work already covered elsewhere | Could produce redundant recommendations | Tie every finding to a specific Public target and cross-phase overlap note |
| Risk | Static analysis misses runtime-only behavior | Could overstate portability | Mark runtime claims as low confidence unless confirmed by source or docs |
| Risk | Citations drift while reading many files | Could invalidate evidence | Use numbered line reads (`nl -ba`) for every cited file before writing conclusions |
| Risk | Research converges early | Could underuse the packet | Enforce a minimum of 5 iterations and only stop early when signal clearly plateaus |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Research workflow should remain tool-efficient; each iteration should stay focused enough to be supportable with bounded file reads instead of whole-repo scans.

### Security
- **NFR-S01**: The external repo is read-only. No commands may mutate `external/`.

### Reliability
- **NFR-R01**: Iteration state must be durable in `research/deep-research-state.jsonl` so the run can be audited or resumed.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or malformed `external/`: stop immediately and emit the required error.
- Missing required source file from the phase brief: note the absence in the iteration and adjust scope only if alternative source files provide equivalent evidence.

### Error Scenarios
- Strict validation fails before research: patch only phase docs and rerun validation before iteration 001.
- CocoIndex coverage is incomplete for Python or docs: fall back to exact grep plus direct file reads and record the fallback in the report.
- Fewer than 5 meaningful questions survive contact with the source: stop at iteration 5 and synthesize with `insufficient_evidence`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Three research waves, 30 iterations, multiple external subsystems, and multiple Public comparison seams |
| Risk | 14/25 | Recommendation quality matters; direct code edits are out of scope |
| Research | 18/20 | Static source analysis across tracer, store, adapter, trainer, algorithm, examples, and docs |
| Multi-Agent | 0/15 | User explicitly disallowed sub-agents |
| Coordination | 10/15 | Phase validation, iteration state, synthesis, memory save, and closeout must stay synchronized |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Validation churn from thin phase docs | M | M | Use real Level 3 content and validate before research |
| R-002 | Recommendations duplicate phase 005 generic agent-loop work | H | M | Require explicit RL-specific differentiation in every major finding |
| R-003 | Static-only analysis overstates integration feasibility | H | M | Separate `adopt now` from `prototype later` and cite uncertainty honestly |
| R-004 | Convergence detection stops too late or too early | M | M | Track `newSignalThisIter` in JSONL and review subsystem coverage every iteration |

---

## 11. USER STORIES

### US-001: Researcher needs RL-specific adoption guidance (Priority: P0)

**As a** maintainer improving `system-spec-kit`, **I want** an evidence-backed map of Agent Lightning's tracer, reward, adapter, and trainer patterns, **so that** I can plan real follow-on work instead of copying a research repo blindly.

**Acceptance Criteria**:
1. Given the external repo and current Public surfaces, when the final report is complete, then each actionable finding names a concrete Public target and recommendation tier.

---

### US-002: Researcher needs auditable iteration artifacts (Priority: P0)

**As a** future reviewer, **I want** each research pass written as its own iteration file with citations and conclusions, **so that** I can trace how the synthesis was formed and challenge weak claims.

**Acceptance Criteria**:
1. Given an iteration file, when it is opened, then it contains question, method, evidence, analysis, conclusion, recommendation, counter-evidence, and follow-up questions.

---

### US-003: Researcher needs overlap control with sibling phases (Priority: P1)

**As a** maintainer working across phases `001-009`, **I want** this phase to focus on RL-specific leverage rather than generic agent loops, **so that** later packet planning does not duplicate work already better handled by other phases.

**Acceptance Criteria**:
1. Given the final synthesis, when the cross-phase section is reviewed, then phase 005 overlap is explicitly addressed and bounded.

---

### Acceptance Scenarios

**Scenario 1 (REQ-002 - strict validation before research)**
- **Given** the phase docs are newly created
- **When** `validate.sh --strict` runs
- **Then** the phase reaches a passing validation state before iteration 001 begins

**Scenario 2 (REQ-004 - narrow falsifiable iteration)**
- **Given** iteration 001 is being planned
- **When** the question is chosen
- **Then** it targets a specific Agent Lightning mechanism and a specific Public comparison seam rather than a broad repo overview

**Scenario 3 (REQ-006 - RL-specific synthesis)**
- **Given** the final report includes adoption recommendations
- **When** a recommendation is marked `adopt now`
- **Then** the report explains what RL-specific leverage it adds beyond existing Public orchestration or memory features

**Scenario 4 (REQ-008 - phase-only writes)**
- **Given** research and closeout are complete
- **When** the diff is reviewed
- **Then** all modified files are contained within this phase folder

**Scenario 5 (REQ-009 - end-to-end flow coverage)**
- **Given** the iteration loop is complete
- **When** the final report is reviewed
- **Then** it documents span creation, span-to-training-data transformation, and trainer or store coordination as distinct traced flows

**Scenario 6 (REQ-012 - closeout and memory save)**
- **Given** the synthesis artifacts are complete
- **When** the phase closes
- **Then** `implementation-summary.md` exists, memory is saved with `generate-context.js`, and the final validation result is recorded

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Which Agent Lightning subsystem yields the highest-value first adoption target for `system-spec-kit`: tracing seam, reward schema, store contract, or trainer pluggability?
- Does Agent Lightning's selective multi-agent optimization model map more naturally to `.opencode/agent/orchestrate.md` or to future evaluator-style workflows?
- Which Public write path, if any, could safely host deterministic span or reward summaries without overloading existing memory-save flows?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `phase-research-prompt.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `research/research.md`
