---
title: "Implementation Plan: sk-deep-research Manual [skilled-agent-orchestration/028-sk-deep-research-testing-playbook/plan]"
description: "Plan the approved 19-scenario manual_testing_playbook package for sk-deep-research using the live skill and command docs plus the current sk-doc testing-playbook contract."
trigger_phrases:
  - "deep research playbook plan"
  - "manual testing playbook plan"
  - "sk-deep-research playbook"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/028-sk-deep-research-testing-playbook"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: sk-deep-research Manual Testing Playbook

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation package |
| **Framework** | `sk-doc` manual testing playbook contract + `sk-deep-research` source docs |
| **Storage** | Git working tree under the future `manual_testing_playbook/` package |
| **Testing** | `validate_document.py`, path and link sweeps, feature-count parity checks, manual prompt-sync review, spec validator |

### Overview
Implementation will create a new `manual_testing_playbook/` package for `.opencode/skill/sk-deep-research/` with one root playbook and 19 per-feature files grouped into the 6 approved category folders. The package is greenfield create work, no feature catalog exists yet, and every scenario must be sourced from the live deep-research command, skill, README, references, assets, and `.codex/agents/deep-research.toml`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement is documented in `spec.md`
- [x] Level 3 scope and the approved 19-scenario file map are frozen in `spec.md`
- [x] Live source inputs are identified: `sk-deep-research` docs, command, assets, and Codex agent definition
- [x] `sk-doc` testing-playbook contract and validator limitation are identified
- [x] Repository state confirms there is no existing `manual_testing_playbook/` or `feature_catalog/` for `sk-deep-research`

### Definition of Done
- [ ] The root playbook file exists and follows the integrated contract
- [ ] Six numbered category directories and all 19 per-feature files exist
- [ ] Every scenario is source-anchored, prompt-synchronized, and evidence-driven
- [ ] Root validation and manual cross-file sweeps pass
- [ ] Root docs explicitly explain the missing feature catalog and non-recursive validator limitation
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference-driven documentation package with integrated root guidance and one-file-per-feature execution truth.

### Key Components
- **Source truth set**:
  - `.opencode/command/spec_kit/deep-research.md`
  - `.opencode/skill/sk-deep-research/SKILL.md`
  - `.opencode/skill/sk-deep-research/README.md`
  - `.opencode/skill/sk-deep-research/references/*.md`
  - `.opencode/skill/sk-deep-research/assets/*`
  - `.codex/agents/deep-research.toml`
- **Contract inputs**:
  - `.opencode/skill/sk-doc/references/specific/manual_testing_playbook_creation.md`
  - `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_template.md`
  - `.opencode/skill/sk-doc/assets/documentation/testing_playbook/manual_testing_playbook_snippet_template.md`
- **Output package**:
  - root playbook file under `manual_testing_playbook/`
  - `01--entry-points-and-modes/`
  - `02--initialization-and-state-setup/`
  - `03--iteration-execution-and-state-discipline/`
  - `04--convergence-and-recovery/`
  - `05--pause-resume-and-fault-tolerance/`
  - `06--synthesis-save-and-guardrails/`

### Data Flow
Live deep-research docs are audited for shipped behavior and guardrails -> stable IDs `DR-001` through `DR-019` are assigned to the approved categories -> the root playbook is authored with global policy, evidence rules, review protocol, and category summaries -> per-feature files capture the realistic operator prompt and 9-column execution truth -> root validation and manual sweeps verify the finished package.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract lock and source extraction
- [x] Confirm the package is greenfield and that no `manual_testing_playbook/` or `feature_catalog/` exists for `sk-deep-research`
- [x] Confirm the authoritative input set is the live deep-research docs plus the current `sk-doc` playbook contract
- [x] Freeze the approved 19-scenario directory map and feature-file inventory in `spec.md`
- [ ] Build a source matrix mapping each approved scenario to the current command, skill, README, reference, asset, or agent anchor that justifies it

### Phase 2: Package scaffolding
- [ ] Create the `manual_testing_playbook/` package root
- [ ] Create the 6 approved numbered category directories at the playbook root
- [ ] Copy the root-playbook contract shape from the shipped `sk-doc` template bundle
- [ ] Create 19 per-feature files that follow the shipped snippet-template contract

### Phase 3: Root playbook authoring
- [ ] Write the root overview, realistic test model, and coverage note
- [ ] Author global preconditions, evidence requirements, and deterministic command notation
- [ ] Author integrated review protocol and release-readiness rules
- [ ] Author orchestration and wave-planning guidance with explicit live-vs-reference-only notes
- [ ] Add 6 category summaries plus a feature-catalog section that explicitly states no catalog exists yet

### Phase 4: Per-feature scenario authoring
- [ ] Author the 4 entry-point and mode scenarios (`DR-001` through `DR-004`)
- [ ] Author the 3 initialization and state-setup scenarios (`DR-005` through `DR-007`)
- [ ] Author the 3 iteration-execution and state-discipline scenarios (`DR-008` through `DR-010`)
- [ ] Author the 3 convergence-and-recovery scenarios (`DR-011` through `DR-013`)
- [ ] Author the 3 pause-resume and fault-tolerance scenarios (`DR-014` through `DR-016`)
- [ ] Author the 3 synthesis-save and guardrail scenarios (`DR-017` through `DR-019`)
- [ ] Ensure every feature file includes the realistic user request, exact prompt, exact command sequence, expected signals, evidence, pass or fail rules, and failure triage

### Phase 5: Validation and closure
- [ ] Validate the root playbook with `python3 .opencode/skill/sk-doc/scripts/validate_document.py`
- [ ] Run link, path, and feature-count parity sweeps across the package
- [ ] Manually verify prompt sync between root summaries and per-feature files
- [ ] Record the validator limitation honestly in the finished package and release notes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Root-doc validation | root playbook document | `python3 .opencode/skill/sk-doc/scripts/validate_document.py` |
| Link and path integrity | Root doc plus all category files | `rg`, local path sweeps, manual link review |
| Feature-count parity | Root index vs per-feature files | `find`, `wc`, manual ID audit |
| Prompt synchronization | Root summaries and per-feature execution tables | Manual spot check |
| Source-anchor review | Scenario-to-source mapping | Manual review against live deep-research docs |
| Spec packet validation | This Level 3 packet | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../028-sk-deep-research-testing-playbook` |

### Planned Scenario Checks

- **PC-001 Entry points and modes**: validate `DR-001` through `DR-004` for setup, spec-folder choice, `:auto`, and `:confirm`.
- **PC-002 Initialization and state setup**: validate `DR-005` through `DR-007` for artifact creation, config defaults, and strategy seeding.
- **PC-003 Iteration execution and state discipline**: validate `DR-008` through `DR-010` for state-first reads, iteration artifacts, and append-only updates.
- **PC-004 Convergence and recovery**: validate `DR-011` through `DR-013` for stop logic, stuck recovery, and state reconstruction.
- **PC-005 Pause, resume, and fault tolerance**: validate `DR-014` through `DR-016` for pause handling, resume flow, and malformed-line recovery.
- **PC-006 Synthesis, save, and guardrails**: validate `DR-017` through `DR-019` for progressive synthesis, memory save, and guardrail behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/command/spec_kit/deep-research.md` | Internal | Available | Missing command truth would block entry-point scenarios |
| `.opencode/skill/sk-deep-research/` docs and assets | Internal | Available | Missing source anchors would block most scenarios |
| `.codex/agents/deep-research.toml` | Internal | Available | Canonical runtime-agent reference would be incomplete |
| `sk-doc` playbook creation guide and template bundle | Internal | Available | Package could drift from the shipped contract |
| Future `feature_catalog/` package | Internal | Not present by design | No block; implementation must document its absence explicitly instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The authored playbook drifts from the shipped `sk-doc` contract, copies stale source references, or produces broken category-file links that cannot be reconciled quickly.
- **Procedure**:
  1. Remove the in-progress `manual_testing_playbook/` package as a single unit.
  2. Re-run the source-inventory phase against the live docs only.
  3. Rebuild the root doc before rebuilding per-feature files.
  4. Re-run root validation and manual sweeps before republishing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```text
Contract Lock -> Package Scaffolding -> Root Playbook Authoring -> Per-Feature Authoring -> Validation and Closure
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract Lock | None | Package Scaffolding |
| Package Scaffolding | Contract Lock | Root Playbook Authoring |
| Root Playbook Authoring | Package Scaffolding | Per-Feature Authoring |
| Per-Feature Authoring | Root Playbook Authoring | Validation and Closure |
| Validation and Closure | All prior phases | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Contract Lock | Low | 30-45 minutes |
| Package Scaffolding | Medium | 60-90 minutes |
| Root Playbook Authoring | Medium | 90-150 minutes |
| Per-Feature Authoring | High | 4.5-6 hours |
| Validation and Closure | Medium | 60-90 minutes |
| **Total** | | **6.5-9.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Root contract source and snippet-template source are identified
- [x] The package is confirmed to be greenfield create work
- [x] The missing feature catalog is treated as an explicit non-dependency

### Rollback Procedure
1. Remove the root playbook and category folders together.
2. Rebuild the root file from the `sk-doc` template before restoring any per-feature files.
3. Re-run validation and path sweeps before reintroducing the package.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File-level removal only
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
sk-deep-research command + skill + references + assets + Codex agent
                               |
                               v
                sk-doc playbook guide + templates
                               |
                               v
                  approved DR-001..DR-019 inventory
                               |
                               v
                    root playbook authoring pass
                               |
                               v
                   per-feature scenario authoring
                               |
                               v
               validation, path sweeps, and parity review
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source matrix | Live deep-research docs | Scenario-to-source mapping | Root and feature authoring |
| Root playbook | Source matrix, `sk-doc` root template | Package policy and category directory page | Per-feature files |
| Entry-points-and-modes files | Root playbook, command doc | `DR-001` through `DR-004` | Validation |
| Initialization-and-state-setup files | Root playbook, state docs and assets | `DR-005` through `DR-007` | Validation |
| Iteration-execution-and-state-discipline files | Root playbook, skill rules and state docs | `DR-008` through `DR-010` | Validation |
| Convergence-and-recovery files | Root playbook, convergence and loop docs | `DR-011` through `DR-013` | Validation |
| Pause-resume-and-fault-tolerance files | Root playbook, loop protocol and state format | `DR-014` through `DR-016` | Validation |
| Synthesis-save-and-guardrails files | Root playbook, README, command, and skill guardrails | `DR-017` through `DR-019` | Validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Build the scenario-to-source matrix from live docs** - 30-45 minutes - CRITICAL
2. **Author the root playbook with integrated guidance and no-catalog disclosure** - 90-150 minutes - CRITICAL
3. **Author all 19 per-feature files with synchronized prompts and evidence rules** - 4.5-6 hours - CRITICAL
4. **Run root validation and cross-file sweeps** - 45-75 minutes - CRITICAL

**Total Critical Path**: 6.1-8.6 hours

**Parallel Opportunities**:
- The first three categories can be authored in parallel after the root playbook is stable.
- Categories 04 through 06 can be drafted in parallel once the source matrix and scenario ordering are complete.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract locked | Scenario inventory, category map, and no-catalog rules are frozen | Planning complete |
| M2 | Package drafted | Root playbook and all 19 per-feature files exist | Authoring complete |
| M3 | Review ready | Root validation and manual sweeps pass, and source anchors are verified | Release candidate |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:architecture -->
## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Build the playbook first and document the missing feature catalog explicitly

**Status**: Accepted

**Context**: `sk-deep-research` has no `feature_catalog/` package, but the testing-playbook contract still expects traceability and cross-reference guidance.

**Decision**: The playbook will ship first with stable IDs `DR-001` through `DR-019` and explicit "no feature catalog yet" notes in the root doc and per-feature metadata.

**Consequences**:
- The playbook can be created now without blocking on a second documentation package.
- Future catalog work will need a clear linking strategy to the existing playbook IDs.

**Alternatives Rejected**:
- Create a feature catalog first: rejected because it expands scope and delays the first operator-facing validation surface.

---

### AI Execution Protocol

### Pre-Task Checklist
- [x] Confirm the packet reflects the approved 19-scenario and 6-category plan before implementation begins.
- [x] Confirm the playbook remains greenfield create work and that no feature catalog exists yet.
- [x] Confirm all source anchors come from live `sk-deep-research` and `sk-doc` materials.
- [x] Confirm validation commands are prepared before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Author the root playbook before finalizing per-feature files so category summaries and prompt text stay synchronized |
| TASK-SCOPE | Limit implementation writes to the `manual_testing_playbook/` package and approved evidence locations |
| TASK-ID | Preserve the approved `DR-001` through `DR-019` ordering exactly |
| TASK-TRUTH | Keep the missing feature catalog and the root-only validator limitation explicit in the finished package |

### Status Reporting Format
Use `DONE`, `IN_PROGRESS`, or `BLOCKED`, always paired with the category or scenario family touched and the latest validation evidence.

### Blocked Task Protocol
1. Stop on missing source inputs, scenario-count drift, category-map drift, or validator regressions.
2. Record the blocked surface and the failing check.
3. Resolve the inconsistency before continuing with downstream scenario files.

---

<!--
LEVEL 3 PLAN
- Aligned to the approved 19-scenario implementation plan
- Greenfield playbook implementation is in scope
-->
<!-- /ANCHOR:architecture -->
