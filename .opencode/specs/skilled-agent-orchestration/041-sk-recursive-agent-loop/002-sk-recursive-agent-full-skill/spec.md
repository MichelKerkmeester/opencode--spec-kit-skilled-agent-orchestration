---
title: "Feature Specification [skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill/spec]"
description: "Phase 002 under packet 041 expands sk-improve-agent from the bounded MVP into a fuller skill with benchmark-backed evaluation, reusable runtime architecture, and safe multi-target expansion."
trigger_phrases:
  - "agent improvement full skill"
  - "sk-improve-agent phase 2"
  - "benchmark harness"
  - "multi-target agent improvement"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/041-sk-recursive-agent-loop/002-sk-recursive-agent-full-skill"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Agent Improvement Full Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet `041-sk-improve-agent-loop` shipped the evaluator-first MVP and proved that the loop can safely operate on one canonical target with explicit promotion and rollback boundaries. Phase `002-sk-improve-agent-full-skill` defines the next step: stronger benchmark-backed evaluation, reusable runtime structure, target-specific scoring profiles, controlled expansion to a second structured target, and packaging rules for mirror sync without weakening the trust boundary.

**Key Decisions**: keep `.opencode/agent/handover.md` as the benchmark seed target, build fixture-based output evaluation before expanding scope, add one second structured target before considering broader agent families, and keep mirror sync as a downstream packaging phase rather than experiment evidence.

**Critical Dependencies**: packet `041-sk-improve-agent-loop`, `/spec_kit:handover`, the current `sk-improve-agent` runtime and scoring surfaces, spec-kit validation rules, and any second target chosen for expansion.

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
| **Successor** | `003-sk-improve-agent-doc-alignment/` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current loop is real and safe, but it is still narrow. It can score prompt-surface changes and promote one canonical target, yet it does not have the richer benchmark harness, reusable target profiles, or multi-target rollout contract needed for broader autonomous agent improvement. Without that next layer, the skill remains a careful MVP rather than a trusted framework capability.

### Purpose
Define the next implementation packet that upgrades `sk-improve-agent` from a single-target evaluator-first MVP into a fuller skill with benchmark-backed evaluation, reusable target onboarding, one additional structured target, and explicit packaging rules for downstream parity work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A benchmark harness for handover evaluation using repeatable fixture inputs and scored outputs
- Reusable runtime packet structure for future targets, not just handover
- Target-specific evaluator profiles so different artifact families can use different scoring logic
- Selection and onboarding of one second structured artifact target
- Controlled mirror-sync workflow as a downstream follow-up after canonical promotion
- Stronger dashboards and run-history summaries that explain regressions, ties, infra failures, and best-known states
- Operator-facing guidance for adding new targets and running safe experiments

### Out of Scope
- Unconstrained multi-target mutation across the full `.opencode/agent/` tree
- Open-ended research/synthesis targets without a structured evaluator contract
- Self-approving mutation where the mutator defines success for itself
- Automatic rollout to runtime mirrors as experiment targets in the same phase as canonical benchmarking
- General-purpose autonomous repo rewriting

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/sk-improve-agent/SKILL.md` | Modify | Expand operator protocol for benchmarked full-skill workflows |
| `.opencode/skill/sk-improve-agent/README.md` | Modify | Document benchmark harness, target onboarding, and rollout stages |
| `.opencode/skill/sk-improve-agent/references/` | Modify | Add target-profile, benchmark, and expansion runbooks |
| `.opencode/skill/sk-improve-agent/assets/` | Modify | Add reusable profile templates and richer config fields |
| `.opencode/skill/sk-improve-agent/scripts/` | Modify | Add fixture evaluation, target-profile routing, and richer reporting |
| `.opencode/command/spec_kit/agent-improver.md` | Modify | Expand command contract for benchmark mode and second-target support |
| `.opencode/command/spec_kit/assets/improve_agent-improver_*.yaml` | Modify | Extend workflow surfaces for benchmark runs and controlled sync |
| `.opencode/agent/` | Modify | Only if a second approved target or benchmark harness needs canonical support surfaces |
| `.opencode/specs/skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/` | Create | Phase `002` docs and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Handover evaluation becomes benchmark-backed | The loop can run a repeatable fixture set and score produced handover outputs against explicit expectations |
| REQ-002 | Full-skill runtime is reusable across targets | Runtime config, manifest, ledger, and dashboard formats support more than one artifact family without redesign |
| REQ-003 | One second structured target is onboarded safely | A second target has its own evaluator profile, manifest entry, and bounded verification run |
| REQ-004 | Promotion and rollback remain manifest-enforced | Mutation scripts and workflows continue to reject out-of-scope targets after expansion |
| REQ-005 | Mirror sync remains downstream and explicit | Canonical promotion evidence stays separate from runtime parity packaging work |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Evaluator profiles are target-specific | Handover and the second target do not rely on the same flat scoring rules unless explicitly justified |
| REQ-007 | A benchmark fixture corpus exists for the first target | Fixture inputs, expected outcome rules, and result summaries are stored in a documented structure |
| REQ-008 | History and regression reporting are improved | Reducer outputs can show trendlines, repeated failure modes, and score movement over time |
| REQ-009 | Target onboarding is documented | Operators can add a future target through a documented manifest/profile workflow |
| REQ-010 | No-go automation is defined | The loop has explicit stop conditions for infra instability, weak deltas, excessive ties, or drift ambiguity |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running the full-skill handover benchmark produces stable, repeatable scores across a fixed fixture set.
- **SC-002**: A second structured target can be initialized, scored, and reported without modifying the core runtime architecture.
- **SC-003**: Mutation scripts and workflows still reject out-of-scope targets after the second target is added.
- **SC-004**: Dashboard outputs make best state, regressions, ties, infra failures, and target-specific scoring visible at a glance.
- **SC-005**: Operators can follow documentation alone to add a target profile and run a bounded experiment safely.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet `041-sk-improve-agent-loop` | Defines the working MVP and its hard safety boundary | Treat 041 as the non-negotiable baseline rather than re-opening MVP decisions |
| Dependency | `/spec_kit:handover` and handover template | Supplies the first benchmarkable artifact family | Build fixture-based evaluation from the existing output contract |
| Risk | Benchmark harness becomes brittle or too expensive | High | Start with a small, explicit fixture corpus and grow only after stability is proven |
| Risk | Second target expands scope too quickly | High | Require one structured, template-backed target only |
| Risk | Mirror packaging gets mixed into experiment evidence | Medium | Keep sync as a downstream phase with separate evidence |
| Risk | The runtime schema becomes target-specific again | Medium | Force onboarding through shared profile and manifest structures |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full benchmark run for one target completes in a practical local-development window.
- **NFR-P02**: Reducer and reporting updates remain fast enough to support iterative experimentation.

### Reliability
- **NFR-R01**: Benchmark failures and infrastructure failures remain distinguishable in the ledger.
- **NFR-R02**: Target expansion cannot silently weaken single-target guardrails.

### Maintainability
- **NFR-M01**: New targets are added through documented target profiles rather than ad hoc script edits.
- **NFR-M02**: The full-skill architecture remains understandable to operators without deep repo archaeology.

---

## 8. EDGE CASES

### Data Boundaries
- A fixture set is too narrow to separate strong and weak candidates.
- The second target has partial structure but weak validation hooks.

### Error Scenarios
- Benchmark outputs drift because underlying command behavior changes.
- A second target shares some structure with handover but needs different scoring thresholds.
- Mirror sync succeeds while canonical evaluation regresses, creating false confidence if evidence is mixed.
- Too many ties occur to justify autonomous promotion.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Upgrades evaluator, runtime engine, reporting, onboarding, and second-target support |
| Risk | 19/25 | Expansion of autonomous improvement can weaken trust if poorly staged |
| Research | 16/20 | Phase 1 is verified; phase 2 still needs target-selection and benchmark design decisions |
| Multi-Agent | 8/15 | Stronger split between mutator, evaluator, and packaging/reporting roles |
| Coordination | 10/15 | Requires alignment across skill, command, scripts, docs, and one more target family |
| **Total** | **73/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Benchmark fixtures overfit the first target | H | M | Start with a small but varied fixture set and review failure modes explicitly |
| R-002 | Second-target onboarding weakens guardrails | H | M | Require manifest-enforced boundaries and target-specific evaluator profiles |
| R-003 | Reporting becomes noisy instead of useful | M | M | Keep dashboards short and separate evidence from narrative |
| R-004 | Mirror-sync convenience leaks into evaluation truth | H | M | Preserve strict separation between experiment evidence and parity packaging |
| R-005 | Full-skill ambition outruns operator usability | M | M | Write onboarding docs and runbooks as part of implementation, not afterward |

---

## 11. USER STORIES

### US-001: Benchmark Operator (Priority: P0)

**As a** maintainer, **I want** repeatable benchmark runs for the handover target, **so that** accepted candidates represent measured behavior improvement instead of prompt churn.

**Acceptance Criteria**:
1. **Given** the benchmark harness, **When** I run the same fixture set twice, **Then** I get stable comparable scoring outputs.
2. **Given** a weak candidate, **When** it fails benchmark expectations, **Then** the failure is recorded clearly in the ledger and dashboard.

### US-002: Target Onboarder (Priority: P0)

**As a** framework maintainer, **I want** to add one more structured target through a documented profile flow, **so that** the skill grows without rewriting its engine each time.

**Acceptance Criteria**:
1. **Given** a candidate second target, **When** I onboard it, **Then** it receives its own profile, manifest entry, and evaluator contract.
2. **Given** a bounded run on that target, **When** scoring completes, **Then** the runtime structure and dashboard continue to work without special-case redesign.

### US-003: Safe Packager (Priority: P1)

**As a** runtime maintainer, **I want** canonical promotion and mirror sync to remain separate phases, **so that** evaluation truth and packaging parity never get mixed together.

**Acceptance Criteria**:
1. **Given** an accepted canonical candidate, **When** parity work begins, **Then** sync is recorded as downstream packaging rather than experiment evidence.
2. **Given** a mirror-sync issue, **When** it occurs, **Then** it does not invalidate the canonical benchmark result silently.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Future packets still need to decide when `context-prime` should become promotion-eligible, if ever.
- Additional targets beyond `context-prime` remain intentionally unselected until this fuller model proves stable over time.
- Dashboard trendlines are still intentionally concise; a future packet can decide whether historical charts are worth the added noise.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Packet**: See `../`
- **Previous Phase**: See `../001-sk-improve-agent-mvp/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
