---
title: "Implementation Plan: Agent-Improver Deep-Loop Alignment [005]"
description: "Delivered four-phase plan for the improve-agent runtime-truth alignment, normalized to current Level 3 plan structure."
trigger_phrases:
  - "005"
  - "agent improver plan"
  - "sk-improve-agent plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Agent-Improver Deep-Loop Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CJS helpers, TypeScript Vitest tests, Markdown skill and command docs |
| **Primary Surface** | `.opencode/skill/sk-improve-agent/` |
| **Runtime Mirrors** | `.opencode/agent/improve-agent.md` and improve command docs |
| **Evidence Sources** | Commit `080cf549e`, release `v1.1.0.0`, post-release note `v1.2.1.0`, playbook scenarios, strict packet validation |
| **Delivery Shape** | Four delivered implementation phases followed by later rename and lifecycle cleanup in subsequent releases |

### Overview

The delivered plan moved in four implementation phases:

1. runtime truth foundations
2. improvement intelligence
3. optional parallel candidates
4. advisory optimizer and stability scoring

Those phases landed the five helper scripts, five dedicated tests, asset and skill updates, and runtime command wiring recorded in Phase 005’s implementation commit and release note.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Prior 042 runtime-truth patterns from research/review were available to adapt. `[EVIDENCE: ../001-runtime-truth-foundation/spec.md; ../002-semantic-coverage-graph/spec.md]`
- [x] The improve-agent skill already had a bounded evaluator loop that could accept additive runtime-truth helpers. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.0.0.0.md]`
- [x] The phase packet identified the helper, asset, command, and mirror surfaces that needed alignment. `[EVIDENCE: commit 080cf549e summary]`

### Definition of Done

- [x] Five runtime-truth helper scripts landed. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; mutation-coverage.cjs; trade-off-detector.cjs; candidate-lineage.cjs; benchmark-stability.cjs]`
- [x] Five dedicated Vitest suites landed alongside the helpers. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts; mutation-coverage.vitest.ts; trade-off-detector.vitest.ts; candidate-lineage.vitest.ts; benchmark-stability.vitest.ts]`
- [x] Skill, asset, command, and runtime-mirror docs were updated to publish the runtime-truth contract. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
- [x] Later closeout wording was narrowed so unsupported lifecycle promises were not left as live truth. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`
- [x] This packet now validates under the current Level 3 contract. `[EVIDENCE: validate.sh --strict on this phase]`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Orchestrator-owned runtime truth with additive helper modules. The proposal-generating improve-agent remains non-owning for state mutation, while helper scripts record journal, coverage, lineage, trade-off, and stability outputs around the visible `/improve:agent` workflow.

### Key Components

- `improvement-journal.cjs`: append-only event capture for improvement sessions.
- `mutation-coverage.cjs`: tracks explored and exhausted improvement dimensions.
- `trade-off-detector.cjs`: detects cross-dimension regression hidden by aggregate scoring.
- `candidate-lineage.cjs`: records optional branch lineage when multiple candidate strategies run.
- `benchmark-stability.cjs`: measures replay stability and provides optimizer-facing evidence.
- `.opencode/skill/sk-improve-agent/SKILL.md` plus improve-agent assets: explain how the helper outputs shape the loop contract.
- `.opencode/command/improve/agent.md` and runtime mirror docs: expose the contract on the visible operator path.

### Data Flow

Improve command launches session -> orchestrator records journal events -> candidate scoring and coverage updates run through helper scripts -> lineage and stability outputs are written when applicable -> reducer and dashboards consume the outputs -> later documentation cleanup narrows any unsupported lifecycle claims.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime Truth Foundations

The first delivery pass introduced the journal, stop-state contract publication, and orchestrator-owned runtime truth surfaces.

- [x] Journal helper created and wired into the improve-agent workflow. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs; .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
- [x] Runtime mirror and command docs were updated to publish the new contract. `[EVIDENCE: .opencode/agent/improve-agent.md; .opencode/command/improve/agent.md; commit 080cf549e]`
- [x] Audit-trail and legal-stop obligations landed in skill assets. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_charter.md; .opencode/skill/sk-improve-agent/SKILL.md]`

### Phase 2: Improvement Intelligence

The second delivery pass added the explainability helpers that make the improve loop observable instead of opaque.

- [x] Mutation coverage graph landed for improvement sessions. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs]`
- [x] Trade-off detector landed with dedicated test coverage. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs; .opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts]`
- [x] Strategy and config assets were expanded to cover convergence, exhaustion, and thresholds. `[EVIDENCE: .opencode/skill/sk-improve-agent/assets/improvement_strategy.md; .opencode/skill/sk-improve-agent/assets/improvement_config.json]`

### Phase 3: Parallel Candidate Support

The third delivery pass added optional branch-tracking for multi-candidate experimentation.

- [x] Candidate-lineage helper landed. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs]`
- [x] Operator playbooks for coverage, trade-off, and lineage were added. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-mutation-coverage-graph-tracking.md; 023-trade-off-detection.md; 024-candidate-lineage.md]`

### Phase 4: Stability and Advisory Optimization

The fourth delivery pass added replay stability scoring and the advisory optimizer surface.

- [x] Benchmark stability helper and tests landed. `[EVIDENCE: .opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs; .opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts]`
- [x] Runtime-truth playbook scenarios were added for stop taxonomy, journal emission, resume wording, legal-stop gates, stability, trajectory, and optional parallel candidates. `[EVIDENCE: .opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/025-stop-reason-taxonomy.md through 031-parallel-candidates-opt-in.md]`
- [x] Release evidence captured the delivered runtime-truth contract. `[EVIDENCE: .opencode/changelog/15--sk-improve-agent/v1.1.0.0.md]`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Unit | Helper validation for journal, coverage, trade-off, lineage, and stability modules | `.opencode/skill/sk-improve-agent/scripts/tests/*.vitest.ts` |
| Manual | Runtime-truth scenarios for stop reasons, journal emission, legal-stop gates, stability, and parallel candidates | `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/*.md` |
| Manual | End-to-end coverage, trade-off, and lineage workflows | `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/022-024` |
| Release | Shipped verification summary | `.opencode/changelog/15--sk-improve-agent/v1.1.0.0.md` |
| Post-release documentation correction | Lifecycle wording narrowed to current reality | `.opencode/changelog/15--sk-improve-agent/v1.2.1.0.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Earlier 042 runtime-truth patterns | Internal | Complete | Phase 005 reused the runtime-truth shape established in earlier 042 phases. |
| Improve-agent base skill | Internal | Complete | The helper scripts extend the existing evaluator-first loop rather than replacing it. |
| Release packaging | Internal | Complete | `v1.1.0.0` published the delivered runtime-truth surfaces. |
| Rename cleanup | Internal | Complete | Phase 007 renamed live skill surfaces without changing the Phase 005 outcome. |
| Lifecycle wording correction | Internal | Complete | `v1.2.1.0` removed unsupported multi-session claims from the live contract. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: runtime-truth helpers regress the visible improve-agent workflow or violate the proposal-only contract.
- **Procedure**: revert commit `080cf549e`, restore pre-phase asset and command docs, remove the five helper scripts and their dedicated tests, and fall back to the simpler pre-alignment runtime.
- **Documentation note**: the later `v1.2.1.0` patch proves the packet family already used documentation-only releases to retract unsupported claims without reopening all Phase 005 runtime work.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 Runtime Truth
        |
        v
Phase 2 Improvement Intelligence
        |
        +--------> Phase 3 Parallel Candidates
        |
        v
Phase 4 Stability and Advisory Optimization
```

| Phase | Depends On | Enables |
|-------|------------|---------|
| Phase 1 | Earlier 042 runtime-truth patterns | Coverage, lineage, stability surfaces |
| Phase 2 | Phase 1 | Better stop logic and dashboard explanations |
| Phase 3 | Phase 1 | Optional multi-candidate experimentation |
| Phase 4 | Phases 1-2 | Stable replay evidence and advisory optimizer behavior |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Relative Complexity | Delivered Outcome |
|-------|---------------------|-------------------|
| Phase 1 | High | Journal and runtime-truth contract shipped |
| Phase 2 | High | Coverage and trade-off helpers shipped |
| Phase 3 | Medium | Candidate-lineage support shipped |
| Phase 4 | Medium | Stability helper and optimizer-facing outputs shipped |
| **Overall** | **High** | **Commit `080cf549e` plus `v1.1.0.0` release note** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Rollback Checklist

- [x] Identify the landing commit for the phase. `[EVIDENCE: 080cf549e]`
- [x] Confirm the later rename and lifecycle patch releases are documented separately. `[EVIDENCE: Phase 007 docs; .opencode/changelog/15--sk-improve-agent/v1.2.1.0.md]`

### Rollback Notes

1. Remove the helper scripts and their dedicated tests.
2. Restore skill assets, `.opencode/skill/sk-improve-agent/SKILL.md`, command docs, and runtime mirror docs to their pre-phase versions.
3. Re-run the improve-agent workflow against the pre-alignment contract.

### Data Reversal

- **Has data migrations?** No persistent schema migration beyond additive helper outputs.
- **Reversal procedure**: delete the additive runtime-truth helper outputs and restore the earlier documentation contract.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
improvement-journal.cjs
        |
        +--> mutation-coverage.cjs
        |         |
        |         +--> trade-off-detector.cjs
        |
        +--> candidate-lineage.cjs
        |
        +--> benchmark-stability.cjs
                 |
                 +--> .opencode/skill/sk-improve-agent/SKILL.md / improve command / playbooks
```

### Dependency Matrix

| Component | Reads | Writes | Consumer |
|-----------|-------|--------|----------|
| `improvement-journal.cjs` | Session payloads | Journal rows | Orchestrator and reducers |
| `mutation-coverage.cjs` | Candidate decisions | Coverage graph | Strategy and reducers |
| `trade-off-detector.cjs` | Trajectory data | Trade-off verdicts | Reducer and operator reasoning |
| `candidate-lineage.cjs` | Parallel candidate metadata | Lineage graph | Reducer and playbook verification |
| `benchmark-stability.cjs` | Replay results | Stability metrics | Reducer, playbooks, advisory optimizer |
<!-- /ANCHOR:dependency-graph -->
