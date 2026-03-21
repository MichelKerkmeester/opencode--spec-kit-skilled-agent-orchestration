---
title: "Implementation Plan: Phase 010 Graph Signal Activation Manual Testing"
description: "Execution plan for the nine graph-signal-activation manual tests assigned to Phase 010. It organizes preconditions, test grouping, evidence capture, and verdict handling around the canonical playbook and review protocol."
trigger_phrases:
  - "phase 010 execution plan"
  - "graph signal activation manual tests"
  - "manual plus MCP verification"
  - "016 120 plan"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 010 Graph Signal Activation Manual Testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem docs plus MCP runtime artifacts |
| **Testing** | manual + MCP |

### Overview
This plan turns the playbook rows for 016 through 022, 081, and 120 into an operator-ready execution packet. It keeps the exact prompts from the playbook, groups read-mostly and stateful scenarios, and routes final verdicts through the review protocol's PASS, PARTIAL, and FAIL rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator has repository-root access and transcript capture enabled.
- [ ] The exact playbook rows for the nine assigned tests are available.
- [ ] The graph-aware MCP runtime is reachable with the required tools and flags.
- [ ] A disposable sandbox or checkpoint workflow exists for stateful scenarios.
- [ ] Reviewers agree to use the review protocol verdict rules and evidence checklist.

### Definition of Done
- [ ] All nine scenarios have been executed with the exact playbook prompt and command sequence.
- [ ] Every scenario has a complete evidence bundle with transcript, output snippets, and verdict rationale.
- [ ] Stateful tests include rollback proof or sandbox reset proof where applicable.
- [ ] Feature coverage for this phase is 9/9 scenarios documented and reviewed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution pipeline

### Key Components
- **Preconditions**: Runtime access, graph data setup, sandbox or checkpoint readiness.
- **Operator**: Executes the exact playbook prompt and command sequence for each row.
- **MCP Runtime**: Produces graph, audit, cache, and trace signals under test.
- **Evidence Bundle**: Captures transcript, key outputs, artifact references, and notes.
- **Reviewer**: Applies review protocol rules and records PASS, PARTIAL, or FAIL.

### Data Flow
`preconditions -> execute exact playbook prompt and commands -> capture evidence -> apply review protocol -> record verdict`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Confirm the working directory is the repository root and transcript capture is active.
- [ ] Prepare graph test data, edge types, community assignments, and degree snapshots needed by the assigned scenarios.
- [ ] Verify access to the MCP tools referenced by the playbook, including graph-aware search, causal tracing, and checkpoint or rollback helpers.
- [ ] Set aside a disposable sandbox or checkpoint path for mutation-heavy scenarios.

### Phase 2: Non-Destructive Tests
- [ ] Run `016`, `017`, and `018` to verify bounded typed-degree, co-activation delta, and edge-density gating behavior.
- [ ] Run `020`, `021`, and `022` to verify momentum, normalized depth, and community assignment behavior.
- [ ] Execute the exact command sequence from the playbook for each row and preserve the related evidence snapshot.

### Phase 3: Destructive Tests
- [ ] Run `019` in a disposable sandbox because it mutates edge strengths and then rolls them back through audit history.
- [ ] Run `081` in a disposable sandbox when self-loop attempts, depth clamp checks, or cache invalidation checks would alter shared graph state.
- [ ] Run `120` in an isolated runtime or sandbox session because it toggles `SPECKIT_GRAPH_UNIFIED` and compares enabled and disabled behavior across repeated queries.
- [ ] If snapshot seeding or community recomputation changes persistent data, move `020` or `022` into the same sandbox flow.

### Phase 4: Evidence Collection and Verdict
- [ ] For every scenario, capture the exact prompt used, the command transcript, the key output snippets, and any artifact or trace payload reference.
- [ ] Apply the review protocol verdict rules. PASS requires all checks true. PARTIAL allows non-critical evidence gaps. FAIL applies when expected behavior is missing or contradicted.
- [ ] Record triage notes for every non-pass result and mark the phase incomplete until all nine rows have explicit verdicts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the exact command sequence from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) for each row below.

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| `016` | Confirm bounded typed-degree boost | `Test typed-weighted degree channel (R4).` | `manual/MCP` |
| `017` | Confirm multiplier impact | `Compare co-activation strength values for A7.` | `manual/MCP` |
| `018` | Confirm edges-per-node thresholding | `Verify edge density measurement and gate behavior.` | `manual/MCP` |
| `019` | Confirm edge change logging and rollback | `Validate weight history audit tracking.` | `manual/MCP` |
| `020` | Confirm 7-day delta bonus | `Verify graph momentum scoring (N2a).` | `manual/MCP` |
| `021` | Confirm normalized depth scoring | `Test causal depth signal (N2b).` | `manual/MCP` |
| `022` | Confirm community boost injection | `Validate community detection (N2c).` | `manual/MCP` |
| `081` | Confirm graph and cognitive fix bundle | `Validate graph and cognitive memory fixes.` | `manual/MCP` |
| `120` | Confirm graph kill switch, explainability, and deterministic ordering | `Validate Phase 3 graph rollback and explainability.` | `manual/MCP` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass or fail rules are unavailable. |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdict rules and coverage expectations cannot be applied consistently. |
| `feature_catalog/10--graph-signal-activation/` | Internal | Green | Operators lose the current-reality context behind each assigned scenario. |
| Graph-aware MCP runtime | Internal | Green | The manual packet cannot be executed because search, graph, audit, and trace tools are unavailable. |
| Sandbox or checkpoint workflow | Internal | Yellow | Stateful tests risk contaminating shared graph data or leaving flags in the wrong state. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A stateful scenario changes shared graph data, leaves rollout flags altered, or produces contradictory evidence that requires a rerun.
- **Procedure**: Stop the run, restore the named checkpoint or disposable sandbox state, reset any temporary graph-related environment flags, clear caches if the playbook calls for it, and rerun only after the environment matches the pre-test baseline.
- **Documentation**: Keep the failed transcript, note the rollback action taken, and record the scenario as FAIL or PARTIAL until the rerun completes.
<!-- /ANCHOR:rollback -->

---
