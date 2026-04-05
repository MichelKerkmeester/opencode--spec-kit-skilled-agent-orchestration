---
title: "Implementation Plan: sk-deep-research Review Folder [03--commands-and-skills/034-sk-deep-research-review-folders/plan]"
description: "Plan the review-mode path migration from scratch/ to review/, including runtime parity, legacy-state migration, and doc synchronization across command, skill, reference, and playbook surfaces."
trigger_phrases:
  - "review folder plan"
  - "deep-review path migration"
  - "review packet implementation"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: sk-deep-research Review Folder Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML, Markdown, TOML, JSON |
| **Framework** | OpenCode command workflows + runtime agent contracts + `sk-deep-research` documentation package |
| **Storage** | Git working tree and spec-folder runtime artifacts |
| **Testing** | `rg` path sweeps, manual review-mode scenario checks, spec validator, and doc or playbook validation where available |

### Overview
Implementation will move the full deep-review runtime packet from `scratch/` into `review/` for `:review` flows only. The change crosses the review auto and confirm YAML workflows, four runtime `deep-review` agent definitions, review-mode contract assets, user-facing docs, and manual testing scenarios, so the plan treats the path migration as a contract-first update with explicit legacy scratch-state handling.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The review-mode scratch misuse is documented in `spec.md` with source evidence.
- [x] The desired target layout is frozen: all durable review outputs move under `review/`.
- [x] Scope is limited to review mode; research-mode path changes are explicitly out of scope except for shared spec-root compatibility fixes required by the common deep-research entrypoint.
- [x] Runtime parity surfaces are identified: `.opencode`, `.claude`, `.codex`, and `.gemini` `deep-review` files.
- [x] Legacy-state compatibility is recognized as a first-class requirement rather than post-hoc cleanup.

### Definition of Done
- [ ] Review auto and confirm workflows create, resume, pause, synthesize, and save against `review/`.
- [ ] All runtime `deep-review` agents and review-mode assets match the same folder contract.
- [ ] Legacy scratch-based review state is migrated or safely rehomed before resume classification.
- [ ] Docs, references, and manual testing scenarios no longer describe durable review state in `scratch/`.
- [ ] Validation sweeps show no stale review-mode `scratch/` references in the intended surfaces.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first folder relocation with targeted legacy migration.

### Key Components
- **Authoritative path decision**:
  - `spec.md`
  - `decision-record.md`
  - `.opencode/skill/sk-deep-research/assets/review_mode_contract.yaml`
- **Workflow consumers**:
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml`
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_confirm.yaml`
- **Runtime consumers**:
  - `.opencode/agent/deep-review.md`
  - `.claude/agents/deep-review.md`
  - `.codex/agents/deep-review.toml`
  - `.gemini/agents/deep-review.md`
- **Documentation consumers**:
  - `.opencode/command/spec_kit/deep-research.md`
  - `.opencode/skill/sk-deep-research/SKILL.md`
  - `.opencode/skill/sk-deep-research/README.md`
  - `.opencode/skill/sk-deep-research/references/quick_reference.md`
  - `.opencode/skill/sk-deep-research/references/loop_protocol.md`
  - `.opencode/skill/sk-deep-research/references/state_format.md`
  - `.opencode/skill/sk-deep-research/references/convergence.md`
  - `.opencode/skill/sk-deep-research/manual_testing_playbook/`

### Data Flow
1. Review-mode startup inspects the target spec for canonical `review/` state and legacy scratch-based review state.
2. If legacy review state is detected, the workflow migrates only the review-specific whitelist into `review/` before classification.
3. Initialization, iteration, pause or resume, convergence, and synthesis all operate exclusively against `{spec_folder}/review/`.
4. The final report is emitted inside the review packet so the entire review session is stored together.
5. Docs and playbooks are updated in the same wave so operators, maintainers, and runtime files agree on one contract.

### Target Layout

```text
{spec_folder}/review/
├── deep-research-config.json
├── deep-research-state.jsonl
├── deep-review strategy file
├── deep-review dashboard file
├── review iteration files
├── .deep-research-pause
└── final review report
```

### Migration Rules
- Canonical post-change location is always `review/`.
- Migrate only the review-specific whitelist:
  - `research/deep-research-config.json`
  - `research/deep-research-state.jsonl`
  - the legacy deep-review strategy file in `scratch/`
  - the legacy deep-review dashboard file in `scratch/`
  - `research/iterations/iteration-*.md`
  - `research/.deep-research-pause`
  - the root-level review report when the scratch state is clearly a legacy review packet
- Leave unrelated `scratch/` artifacts untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Freeze the path contract and migration rules
- [ ] Build the current-to-target path matrix for all review-mode outputs.
- [ ] Confirm the final packet shape under `review/`, including the final report path.
- [ ] Define the legacy migration whitelist and the review-mode markers that qualify a spec folder for migration.
- [ ] Confirm out-of-scope boundaries: no research-mode path move and no basename rename in this change, while allowing shared alias-root compatibility fixes in the common command surface.

### Phase 2: Update workflows and runtime agents
- [ ] Update `spec_kit_deep-research_review_auto.yaml` to use `review/` for creation, classification, pause, iteration, synthesis, and backup behavior.
- [ ] Mirror the same changes in `spec_kit_deep-research_review_confirm.yaml`.
- [ ] Synchronize the shared deep-research auto and confirm preflight guards so both `specs/` and `.opencode/specs/` alias roots remain valid without changing research-mode storage paths.
- [ ] Update `.opencode/agent/deep-review.md` to reference `review/` instead of `scratch/`.
- [ ] Update `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, and `.gemini/agents/deep-review.md` for the same contract.
- [ ] Update `.opencode/skill/sk-deep-research/assets/review_mode_contract.yaml`, `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md`, and `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` so the asset layer matches the runtime layer.

### Phase 3: Synchronize docs and verification surfaces
- [ ] Update the review sections of `.opencode/command/spec_kit/deep-research.md`, `.opencode/skill/sk-deep-research/SKILL.md`, and `.opencode/skill/sk-deep-research/README.md`.
- [ ] Update the parallel `.agents/commands/spec_kit/deep-research.toml` wrapper metadata and any shared recovery wording that still contradicts the landed review packet contract.
- [ ] Update the review-relevant sections of `.opencode/skill/sk-deep-research/references/quick_reference.md`, `.opencode/skill/sk-deep-research/references/loop_protocol.md`, `.opencode/skill/sk-deep-research/references/state_format.md`, and `.opencode/skill/sk-deep-research/references/convergence.md`.
- [ ] Update manual testing playbook scenarios that reference review-mode paths, review packet outputs, or shared pause or resume behavior.
- [ ] Add or update validation sweeps proving that review-mode durable artifacts are described under `review/`, not `scratch/`.

### Phase 4: Validate, document compatibility, and close
- [ ] Run path sweeps for the intended review surfaces.
- [ ] Validate the spec packet and any updated doc packages.
- [ ] Confirm the legacy migration path against at least one representative scratch-based review packet.
- [ ] Record residual risks or compatibility notes, especially for any root-level review-report consumers discovered during execution.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path contract sweep | Review auto and confirm YAML, runtime agents, assets, docs, playbooks | `rg`, manual diff review |
| Fresh-session check | Review-mode initialization and first iteration artifact placement | Manual dry run or targeted fixture walkthrough |
| Legacy migration check | Scratch-based review session rehydration into `review/` | Manual fixture or representative spec-folder replay |
| Pause or resume validation | Review-mode sentinel handling and completed-session detection | Manual scenario verification plus playbook sync |
| Doc consistency review | Command, skill, references, playbook | `rg`, manual cross-read |
| Spec packet validation | This Level 3 packet | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/03--commands-and-skills/034-sk-deep-research-review-folders --strict` |

### Planned Verification Queries

- `rg -n 'scratch/deep-review|research/deep-research-state.jsonl|research/iterations/iteration-|State files in scratch'` over the planned review surfaces should return no live-contract matches after implementation.
- `rg -n 'review/'` over the same surfaces should show the new canonical paths for config, state, strategy, dashboard, iterations, pause sentinel, and report.
- Manual review-mode replay should confirm:
  - fresh initialization creates `review/`
  - legacy scratch review state migrates before resume
  - pause or resume behavior points to `review/.deep-research-pause`
  - final synthesis writes the report inside `review/`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Review auto and confirm YAML workflows | Internal | Available | Core runtime path change cannot land safely without them |
| Runtime `deep-review` agent files across four runtimes | Internal | Available | Contract drift across runtimes would persist |
| `review_mode_contract.yaml` and review templates | Internal | Available | Asset and doc layer would contradict the runtime layer |
| `sk-deep-research` docs and manual testing playbook | Internal | Available | Operators and maintainers would keep stale guidance |
| `system-spec-kit` scratch semantics | Internal | Available | This change exists specifically to align with those rules |
| Unknown downstream consumers of a root-level review report | Potential internal or external | Unknown | May require compatibility handling or explicit communication |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Resume behavior breaks, legacy migration misclassifies folders, or downstream consumers fail because they require the old root or scratch paths.
- **Procedure**:
  1. Revert the review-mode path changes in YAML, runtime agents, assets, and docs as one atomic rollback.
  2. Restore the previous scratch-based review contract for runtime behavior if the regression is release-blocking.
  3. Preserve migrated `review/` artifacts for inspection rather than deleting them blindly.
  4. Re-run the path sweep and migration analysis before attempting a second rollout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Contract Freeze -> Workflow and Agent Updates -> Docs and Playbook Sync -> Validation and Compatibility Review
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Freeze | None | Workflow and Agent Updates |
| Workflow and Agent Updates | Contract Freeze | Docs and Playbook Sync |
| Docs and Playbook Sync | Workflow and Agent Updates | Validation and Compatibility Review |
| Validation and Compatibility Review | All prior phases | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Freeze | Medium | 45-75 minutes |
| Workflow and Agent Updates | High | 2-3 hours |
| Docs and Playbook Sync | High | 2-3 hours |
| Validation and Compatibility Review | Medium | 60-90 minutes |
| **Total** | | **5.75-8.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Legacy migration whitelist reviewed
- [ ] Review-mode docs updated together with runtime files
- [ ] Any known root-level review-report consumers inventoried

### Rollback Procedure
1. Revert review-mode runtime and doc changes together.
2. Disable or remove the migration branch if it caused incorrect moves.
3. Revalidate scratch-based resume behavior before reattempting rollout.
4. Document the regression cause in the packet before the next implementation attempt.

### Data Reversal
- **Has migration behavior?** Yes
- **Reversal procedure**: Preserve migrated artifacts, compare against original legacy locations, and move only the affected review-specific files back if rollback requires restoring the old runtime contract.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
system-spec-kit scratch rules
            |
            v
review_mode_contract.yaml -----> review auto YAML ----\
            |                                         \
            +------------------> review confirm YAML ---+--> runtime deep-review agents
            |                                         /
            +------------------> review docs --------/
            |
            +------------------> review playbook scenarios
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract freeze | Existing review surfaces + scratch semantics | Target path matrix and migration rules | Workflows, agents, docs |
| Review workflows | Contract freeze | Runtime packet behavior | Agents, validation |
| Runtime agents | Review workflows + contract freeze | Cross-runtime parity | Validation |
| Docs and playbooks | Workflows + agents | Operator and maintainer guidance | Validation |
| Validation | All prior components | Ship or stop verdict | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze final packet layout and migration rules** - 45-75 minutes - CRITICAL
2. **Update review auto and confirm YAML workflows** - 60-90 minutes - CRITICAL
3. **Update all runtime deep-review agents** - 45-75 minutes - CRITICAL
4. **Update assets, docs, and playbook validations** - 2-3 hours - CRITICAL
5. **Run path sweeps, validation, and compatibility review** - 60-90 minutes - CRITICAL

**Total Critical Path**: 5.5-8 hours

**Parallel Opportunities**:
- Runtime agent updates can proceed in parallel once the final path matrix is frozen.
- Docs and playbook updates can start as soon as the YAML and agent contract wording is stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract frozen | `review/` layout, report path, and migration whitelist are documented and approved | End of Phase 1 |
| M2 | Runtime parity complete | Both review YAML files and all four runtime agents point to the same `review/` packet | End of Phase 2 |
| M3 | Documentation synchronized | Command, skill, references, and playbook surfaces reflect the new path | End of Phase 3 |
| M4 | Validation complete | Path sweeps and packet validation pass, with compatibility notes recorded | End of Phase 4 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Move the full review packet under `review/` and keep current review-mode basenames

**Status**: Accepted

See `decision-record.md` for the full rationale, alternatives, and migration implications.

---

### AI Execution Protocol

### Pre-Task Checklist
- [x] Confirm the implementation scope stays limited to review-mode storage changes plus directly related shared command-surface compatibility fixes.
- [x] Confirm the canonical target layout is `{spec_folder}/review/`.
- [x] Confirm legacy scratch-state migration is part of the main execution path.
- [x] Confirm validation sweeps are prepared before implementation starts.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Freeze the folder contract before editing workflows, agents, or docs |
| TASK-PARITY | Update all runtime `deep-review` variants in the same implementation wave |
| TASK-SCOPE | Keep research-mode storage behavior and basename renames out of scope, while allowing shared spec-root compatibility fixes in the common deep-research entrypoint |
| TASK-VERIFY | Run path sweeps and packet validation before claiming the change is complete |

### Status Reporting Format
Use `DONE`, `IN_PROGRESS`, or `BLOCKED`, always paired with the file family or validation surface touched and the latest evidence.

### Blocked Task Protocol
1. Stop on legacy-migration ambiguity, runtime parity drift, or unresolved report-path consumers.
2. Record the blocked surface and the failing validation or dependency.
3. Resolve the blocker before moving to downstream doc or playbook sync work.
<!-- /ANCHOR:architecture -->
