---
title: "Implementation Plan: Offline Loop Optimizer [042.004]"
description: "Deliver Phase 4a as a deterministic offline config optimizer with advisory-only outputs now, and defer Phase 4b prompt/meta optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
trigger_phrases:
  - "042.004"
  - "implementation plan"
  - "offline loop optimizer"
  - "phase 4a"
  - "phase 4b"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS optimizer scripts, JSON or JSONL replay artifacts, Markdown runtime docs, existing deep-loop config assets |
| **Framework** | Offline compile/evaluate workflow layered on top of deep-loop runtime traces |
| **Storage** | Replay corpus fixtures, audit records, candidate config snapshots, existing deep-loop config files |
| **Testing** | Vitest component suites, replay comparison tests, parity and behavioral gates, strict packet validation |

### Overview

This phase now splits into two tracks. Phase 4a is the realistic near-term work: harvest real traces, score them with a rubric, search bounded deterministic config space, replay candidates deterministically, and emit advisory candidate patches with a full audit trail. Phase 4b remains deliberately deferred until replay fixtures, behavioral suites, and multi-family corpus coverage exist for safe prompt and meta-optimization.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 001 through Phase 003 have identified the runtime artifacts and metrics worth optimizing.
- [x] Packet family `040` is identified as the required real replay corpus.
- [x] Packet family `028` is understood as an optional older holdout, not a required corpus family.
- [x] Packet family `042` is planning-only and has no implementation traces yet.
- [ ] Phase 001 replay fixtures exist for production-grade replay gating.
- [ ] Phase 003 behavioral suites exist for non-advisory promotion.
- [x] Optimizer-managed fields are treated as bounded config surfaces, not free-form mutation targets.

### Definition of Done

- [ ] Replay corpus extraction is deterministic and traceable to source runs.
- [ ] Rubric scoring exposes per-dimension outputs and clear weighting.
- [ ] Search space is bounded, auditable, and mapped to named deterministic parameter families.
- [ ] Replay runner can compare baseline and candidate configs without live execution.
- [ ] Audit output exists for accepted and rejected candidates.
- [ ] Optimizer manifest exists and clearly separates tunable fields, locked contract fields, and future prompt-pack entrypoints.
- [ ] Promotion gate emits advisory-only outputs until replay fixtures and behavioral suites exist.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Offline compile/evaluate loop with governed advisory promotion.

### Key Components

- **Replay corpus builder**: normalizes real packet-family traces into replayable datasets, with `040` required and `028` optional as a compatibility holdout.
- **Rubric engine**: scores replay outcomes across multiple quality dimensions.
- **Replay runner**: re-evaluates reducer and convergence logic under alternate candidates.
- **Random-search engine**: explores bounded deterministic numeric config candidates.
- **Optimizer manifest**: declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
- **Audit trail**: records candidates, scores, regressions, and advisory decisions.
- **Advisory promotion gate**: blocks risky candidates and emits patch-style recommendations without mutating canonical configs.
- **Phase 4b placeholder**: future prompt-pack generation and meta-learning surfaces, explicitly deferred.

### Data Flow

```text
Collect historical traces
  -> normalize replay corpus
  -> score baseline runs with rubric
  -> replay deterministic baselines
  -> generate random-search candidate configs
  -> replay candidates deterministically
  -> compare against baseline
  -> record audit trail
  -> emit advisory patch reports
  -> require replay fixtures + behavioral gates before any future production promotion
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 4a: Deterministic Config Optimizer

**Status**: Active now

**Estimated sessions**: 3-4

**Scope**: REQ-001 through REQ-009

**Why now**: The repo has enough real data for a bounded pilot on deterministic config tuning, but not enough corpus diversity or safety coverage for prompt/meta optimization.

**Dependencies**:
- Phase 1 replay fixtures for production-grade replay validation.
- Existing `040` traces as the required real corpus.

**Sub-steps**:
1. Corpus builder
2. Rubric definition
3. Replay runner
4. Random search
5. Audit trail
6. Advisory promotion

**Files to change**:
- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs`
- `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs`
- `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs`
- `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs`
- `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs`
- `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
- `.opencode/skill/sk-deep-research/assets/deep_research_config.json`
- `.opencode/skill/sk-deep-review/assets/deep_review_config.json`
- `.opencode/skill/sk-deep-research/references/convergence.md`
- `.opencode/skill/sk-deep-review/references/convergence.md`
- `.opencode/command/spec_kit/deep-research.md`
- `.opencode/command/spec_kit/deep-review.md`
- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/`

**Verification strategy**:
- Prove `040` extraction is deterministic and source-traceable.
- Prove rubric dimensions and weights produce stable, inspectable scores.
- Prove replay outcomes remain deterministic for the same corpus and candidate config.
- Prove search candidates stay within allowed deterministic parameter families.
- Prove promotion stays advisory-only while prerequisite replay fixtures and behavioral suites are still missing.

### Phase 4b: Prompt and Meta Optimizer

**Status**: Deferred

**Estimated sessions**: TBD after prerequisites

**Scope**: REQ-010 and REQ-011 only after prerequisites are met

**Why deferred**: Full prompt optimization, cross-packet meta-learning, and automatic promotion are premature today because the corpus is effectively single-family, the optimizer script tree does not exist yet, and the behavioral replay fixtures are still future work.

**Dependencies**:
- Phase 3 behavioral suites must exist.
- At least 2 compatible corpus families must exist.
- Task-shape metadata model must exist before cross-packet learning.

**Planned sub-steps**:
1. Prompt-pack generation system
2. Patch artifact evaluation and rollback flow
3. Task-shape metadata model
4. Cross-packet meta-learning experiments
5. Automatic promotion with behavioral gating

**Verification strategy**:
- Prove prompt candidates are generated as packs or patches rather than direct agent-markdown edits.
- Prove behavioral suites catch regressions before any promotion automation is enabled.
- Prove multi-family corpus and task-shape metadata are sufficient for generalization claims.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Corpus normalization, rubric scoring, search bookkeeping | Vitest |
| Replay | Deterministic candidate replay and baseline comparison | Vitest |
| Governance | Advisory promotion behavior, bounded config mutation, rollback handling | Vitest |
| Validation | Packet document structure and template compliance | `spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 stable runtime contracts | Internal | Green | Replay targets would be too unstable to compare meaningfully. |
| Phase 001 replay fixtures | Internal | Red | Phase 4a cannot graduate beyond advisory reporting without them. |
| Phase 002 graph metrics | Internal | Yellow | Optimizer would lose important semantic convergence signals. |
| Phase 003 wave artifacts | Internal | Yellow | Corpus would miss richer segment-level evidence for large-target runs. |
| Phase 003 behavioral suites | Internal | Red | Phase 4b and any non-advisory promotion remain blocked without them. |
| Required `040` corpus | Internal | Green | The deterministic optimizer would have no real replay base without it. |
| Second compatible corpus family | Internal | Red | Phase 4b meta-learning cannot generalize safely without it. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Replay fidelity is insufficient, rubric scoring is untrustworthy, prerequisite suites are missing, or candidates cannot stay within bounded config surfaces.
- **Procedure**: Keep optimizer outputs advisory only, reject production promotion, and leave canonical deep-loop configs unchanged until replay or governance gaps are fixed.
- **Safety Note**: Because this phase is offline-first, rollback should be config-preserving by default and should never require undoing live runtime behavior.
<!-- /ANCHOR:rollback -->

---

## 8. SESSION BREAKDOWN

- **Session 1**: confirm corpus intake boundaries, build the `040` extractor, and wire compatibility grading for optional `028` holdout ingestion.
- **Session 2**: implement rubric scoring and deterministic replay against stored traces.
- **Session 3**: add random search, audit output, and the optimizer manifest that marks tunable vs locked fields.
- **Session 4**: finish the advisory-only promotion gate, docs, and replay-oriented verification. If prerequisite fixtures still do not exist, stop at advisory outputs and do not widen scope into Phase 4b.
