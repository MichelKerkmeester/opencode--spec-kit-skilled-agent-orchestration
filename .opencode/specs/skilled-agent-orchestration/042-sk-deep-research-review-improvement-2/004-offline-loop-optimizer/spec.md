---
title: "Feature Specification: Offline Loop Optimizer [042.004]"
description: "Define an offline replay optimizer that tunes deterministic deep-loop configs against real packet traces now, while deferring prompt and meta-optimization until replay fixtures, behavioral suites, and broader corpus coverage exist."
trigger_phrases:
  - "042.004"
  - "offline loop optimizer"
  - "replay corpus"
  - "optimizer manifest"
  - "advisory promotion gate"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Offline Loop Optimizer

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 004 is now explicitly split into two sub-phases. Phase 4a is the realistic near-term deliverable: build an offline compile/evaluate loop that replays real packet traces, tunes deterministic numeric config thresholds, and emits advisory patch recommendations with a full audit trail. Phase 4b is deferred future work for prompt-pack and meta-optimization once replay fixtures, behavioral suites, and multi-family corpus coverage actually exist.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-10 |
| **Branch** | `042-sk-deep-research-review-improvement-2` |
| **Parent Packet** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 4 of 8 (`4a` active now, `4b` deferred) |
| **Predecessor** | `003-wave-executor` |
| **Successor** | `../005-agent-improver-deep-loop-alignment/spec.md` |
| **Handoff Criteria** | Phase 4a outputs are replay-verified, audit-trailed, and emitted as advisory-only candidate patches until Phase 1 replay fixtures and Phase 3 behavioral suites exist. |

<!-- ANCHOR:phase-context -->
**Phase Context**: This phase closes the moonshot chain by turning prior run traces into an offline improvement engine, but the research findings show the safe near-term scope is narrower than originally drafted. Phases 001 through 003 make deep-loop behavior explicit, graph-aware, and segment-capable; Phase 4a should use those artifacts to tune deterministic thresholds and recovery settings without experimenting live in production, while Phase 4b stays deferred until the replay and behavioral foundations are real.

**Dependencies**:
- Phase 001 runtime contracts and stable stop or recovery semantics.
- Phase 002 graph metrics as optimization signals.
- Phase 003 richer wave-run traces and segment-aware artifacts.
- Phase 001 replay fixtures must exist before any production-grade replay or promotion claim is credible.
- Phase 003 behavioral suites must exist before any non-advisory promotion is allowed.

**Deliverables**:
- **Phase 4a**: replay corpus builder with `040` required, `028` optional as an older holdout, and `042` excluded until it has implementation traces.
- **Phase 4a**: rubric and scoring framework for run quality, deterministic replay runner, random-search baseline, optimizer manifest, and audit-trailed advisory candidate reports.
- **Phase 4b (deferred)**: prompt-pack optimization, task-shape-aware meta-learning, and gated production promotion after prerequisite suites and corpus diversity exist.
<!-- /ANCHOR:phase-context -->
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop products now have richer runtime state, but tuning them is still largely manual: convergence thresholds, stuck detection, recovery escalation, and related numeric controls are adjusted by human judgment and one-off testing. That is expensive, hard to compare rigorously, and vulnerable to regressions because the system has no offline compile/evaluate loop that can replay historical traces, score outcomes, and prove that a new deterministic configuration is actually better before it is even considered for production.

### Purpose

Define an offline replay optimizer that learns from real packet traces, scores run quality against a shared rubric, searches bounded deterministic config space, and emits advisory candidate patches only. Production promotion remains out of scope until Phase 1 replay fixtures and Phase 3 behavioral suites exist, and prompt or meta-optimization remains deferred future work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Build a replay corpus with packet family `040` as the required source, packet family `028` as an optional structurally older holdout, and packet family `042` excluded until it has real implementation traces.
- Define a rubric for finding accuracy, convergence efficiency, recovery success rate, and synthesis quality.
- Add configuration-search logic for deterministic numeric settings such as convergence thresholds, stuck detection, and recovery escalation.
- Add a deterministic replay runner for reducer and convergence logic under alternate configs.
- Add a canonical optimizer manifest that declares tunable fields, locked contract fields, and future prompt-pack entrypoints.
- Add an advisory-only promotion gate that never mutates production config directly while prerequisite fixtures and suites are still missing.
- Record a full audit trail for every optimization attempt, including rejected candidates and patch-style recommendations.

### Out of Scope

- Online reinforcement or live-production auto-tuning.
- Replacing human review of candidate configs.
- Inventing new runtime artifacts outside the traces already produced by Phases 001 through 003.
- Broad model selection or vendor-routing work unrelated to deep-loop runtime tuning.
- Direct mutation of canonical agent `.md` files during optimization. Agent markdown remains behavior documentation, not an optimizer template surface.
- Full prompt optimization, cross-packet meta-learning, and automatic production promotion in the current phase scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs` | Create | Build deterministic replay datasets from historical packet artifacts. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs` | Create | Score runs across accuracy, convergence efficiency, recovery success, and synthesis quality. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs` | Create | Search bounded deterministic numeric config candidates. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs` | Create | Replay reducer and convergence logic against alternate configurations. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/promote.cjs` | Create | Compare candidate results to baseline and emit advisory-only candidate patches. |
| `.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json` | Create | Canonical manifest of tunable fields, locked contract fields, and future prompt-pack entrypoints. |
| `.opencode/skill/sk-deep-research/assets/deep_research_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Modify | Mark optimizer-managed fields and promotion-safe config boundaries. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Modify | Clarify which thresholds and recovery policies are optimizer-tunable. |
| `.opencode/command/spec_kit/deep-research.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
| `.opencode/command/spec_kit/deep-review.md` | Modify | Document offline optimization as a governed maintenance surface and future prompt-pack consumer, not a live runtime mode. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-corpus.vitest.ts` | Create | Verify corpus extraction and fixture normalization. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-rubric.vitest.ts` | Create | Verify scoring rules and metric weighting behavior. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-search.vitest.ts` | Create | Verify search-space handling and candidate bookkeeping. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-replay-runner.vitest.ts` | Create | Verify deterministic replay under alternate configs. |
| `.opencode/skill/system-spec-kit/scripts/tests/optimizer-promote.vitest.ts` | Create | Verify advisory promotion gating, rollback behavior, and audit output. |
| `.opencode/skill/system-spec-kit/scripts/tests/fixtures/deep-loop-optimizer/` | Create | Packet-family replay fixtures, optimization-result snapshots, and advisory patch artifacts. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 4a MUST build a replay corpus with packet family `040` as the required source corpus. | Corpus inputs are tied to real `040` packet artifacts, normalized into a deterministic replay format, and traceable back to their source runs and metadata. |
| REQ-002 | Packet family `028` MAY be ingested as an optional holdout corpus, but only with compatibility grading because it is older and structurally different; packet family `042` MUST NOT be treated as corpus input until it has real implementation traces. | Corpus ingestion records source-family compatibility, marks `028` as optional holdout only, and rejects `042` as a training corpus until live traces exist. |
| REQ-003 | The optimizer MUST define a rubric that scores run quality across finding accuracy, convergence efficiency, recovery success rate, and synthesis quality. | The rubric exposes explicit metric definitions, weighting, and score outputs; the phase does not rely on one opaque "goodness" number. |
| REQ-004 | Phase 4a MUST provide a deterministic replay runner that can evaluate alternate configs without running live agent iterations. | Replay consumes stored traces and config candidates, produces repeatable outputs, and isolates replay from live network or human-in-the-loop variability. |
| REQ-005 | The phase MUST define a canonical optimizer manifest that separates tunable fields, locked contract fields, and prompt-pack entrypoints. | A single manifest names each optimizer-managed field family, each locked lifecycle or schema contract field, and each future prompt-pack insertion point. |
| REQ-006 | No production promotion is allowed until the replay fixtures planned in Phase 1 and the behavioral suites planned in Phase 3 actually exist. | Until both prerequisite surfaces exist, all optimizer outputs are advisory-only candidate patches or reports and must not directly mutate canonical production configs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Phase 4a search MUST stay within deterministic numeric config families such as convergence thresholds, stuck sensitivity, and recovery escalation. | Search configuration covers the allowed deterministic tunable dimensions, excludes locked contract fields, and records which candidates touched which parameter families. |
| REQ-008 | Every optimization run MUST emit an audit trail that records what was tried, what improved, what regressed, and why a candidate was accepted or rejected. | Audit output exists for every run, including failed searches and rejected advisory promotions, and captures both candidate settings and evaluation outcomes. |
| REQ-009 | Optimizer scoring MUST incorporate graph and wave metrics when those traces are available, without inventing fake values for older runs. | The corpus and rubric can consume Phase 002 or Phase 003 signals when present, and explicitly mark them unavailable for older traces instead of fabricating them. |
| REQ-010 | If prompt optimization remains in scope for deferred Phase 4b, it MUST operate on generated prompt packs or patch artifacts rather than directly mutating agent `.md` files. | Prompt candidates are expressed as generated pack outputs or patch artifacts that can be replayed, diffed, tested, and rolled back independently of canonical agent markdown. |
| REQ-011 | If cross-packet meta-learning remains in future scope, it MUST introduce a task-shape metadata model before learning across packets is allowed. | No meta-learning work proceeds without explicit metadata for task shape, scope, and domain clustering plus at least two compatible packet families. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The optimizer corpus is built from real packet traces, with `040` as the required source family.
- **SC-002**: Rubric scores are broken down by quality dimension, not hidden behind one opaque number.
- **SC-003**: Replay is deterministic enough to compare baseline and candidate configs reliably.
- **SC-004**: Search scope is bounded to deterministic numeric config families for Phase 4a.
- **SC-005**: Promotion remains advisory-only until replay fixtures and behavioral suites exist.
- **SC-006**: Every optimization run produces a reviewable audit trail.
- **SC-007**: The optimizer manifest keeps tunable and locked fields explicit and rollback-friendly.
- **SC-008**: Any future prompt optimization route is expressed as prompt packs or patch artifacts rather than direct agent-markdown mutation.

### Acceptance Scenarios

1. **Given** packet family `040`, **when** the corpus builder runs, **then** it emits deterministic replay inputs tied back to its source runs and metadata.
2. **Given** packet family `028`, **when** the corpus builder attempts ingestion, **then** it records compatibility grading and treats `028` as an optional holdout instead of a required training corpus.
3. **Given** packet family `042`, **when** corpus intake is evaluated, **then** the optimizer refuses to treat it as replay corpus until implementation traces exist.
4. **Given** a candidate config improves convergence efficiency but harms accuracy, **when** rubric scoring runs, **then** the breakdown shows the trade-off explicitly instead of hiding it.
5. **Given** the same baseline trace and candidate config, **when** replay runs twice, **then** the resulting score and decision outputs remain stable.
6. **Given** a candidate outperforms baseline in replay but the Phase 1 replay fixtures or Phase 3 behavioral suites do not yet exist, **when** promotion runs, **then** the optimizer emits only an advisory patch or report and refuses production promotion.
7. **Given** an older packet trace lacks graph or wave metrics, **when** scoring runs, **then** the audit trail marks those dimensions unavailable rather than inventing placeholder values.
8. **Given** a candidate touches a non-tunable contract field, **when** promotion eligibility is checked, **then** the optimizer rejects the candidate as out of bounds.
9. **Given** a future prompt candidate, **when** optimization is attempted, **then** the system works through a generated prompt pack or patch artifact rather than mutating agent `.md` files directly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001-003 traces must be stable and sufficiently rich | High | Limit corpus intake to runs with trustworthy runtime artifacts and record gaps explicitly. |
| Dependency | Phase 001 replay fixtures must exist before promotion can graduate beyond advisory reports | High | Treat missing replay fixtures as a hard promotion block and keep outputs patch-only. |
| Dependency | Phase 003 behavioral suites remain the promotion gate | High | Treat those suites as mandatory pass conditions, not advisory checks. |
| Risk | Replay fidelity is too low to support fair candidate comparisons | High | Keep replay deterministic, tie it to stored traces, and reject promotion when fidelity is insufficient. |
| Risk | Optimization without behavioral tests could promote broken configs | High | Keep promotion advisory-only until the behavioral suite exists and passes. |
| Risk | Search space grows too broad and hides why a candidate improved | Medium | Start with bounded numeric parameter families and require audit logs for every search step. |
| Risk | Optimizer starts changing fields that should remain human-governed | Medium | Mark optimizer-managed fields explicitly in runtime configs and docs. |
| Risk | Single-family corpus limits generalization | High | Treat `040` as a pilot corpus, treat `028` as optional holdout only, and defer meta-learning until 2+ compatible families exist. |
| Risk | Optional holdout `028` is structurally incompatible with modern replay assumptions | Medium | Compatibility-grade it explicitly and never require it for Phase 4a success. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Offline search and replay should remain bounded enough to run in routine maintenance windows without monopolizing the developer environment.
- Corpus loading should scale with additional packet families by incremental or chunked processing rather than full rebuilds only.

### Reliability

- Replay comparisons must be deterministic for the same trace and candidate input.
- Promotion must fail closed when replay fidelity, rubric coverage, or downstream tests are insufficient.
- Advisory-only promotion must be the default behavior until the prerequisite replay fixtures and behavioral suites exist.

### Maintainability

- Optimizer-managed config fields should be documented once in the canonical optimizer manifest plus the deep-loop config files and references.
- Audit records should explain decisions in plain terms so future maintainers can understand why a candidate was accepted or rejected.
- Canonical agent markdown must remain behavior documentation; optimizer experimentation belongs in generated prompt packs or patch artifacts.

---

## 8. EDGE CASES

- A candidate improves convergence efficiency but harms finding accuracy. Promotion must reject that trade-off unless the rubric explicitly preserves overall quality.
- Historical runs are missing graph or wave artifacts because older phases were not yet implemented. Corpus ingestion must mark those gaps instead of fabricating signals.
- Two candidate configs tie on rubric score but differ in risk. The promotion gate must keep the safer or more explainable candidate, or refuse promotion.
- Replay reveals that optional holdout `028` behaves differently from required corpus `040`. Audit output must preserve that split rather than averaging it away.
- A candidate modifies an optimizer-managed threshold and a non-tunable contract field together. Promotion must reject the candidate as out of bounds.
- A candidate improves replay score before behavioral suites exist. The optimizer must emit only an advisory report or patch artifact and refuse production promotion.
- A prompt experiment tries to write directly into an agent markdown file. The optimizer must reject it and require a generated prompt pack or patch artifact instead.

---

## 9. COMPLEXITY ASSESSMENT

| Axis | Assessment |
|------|------------|
| **Corpus Engineering** | Medium-High: `040` is viable now, `028` is a compatibility holdout, and `042` has no traces yet. |
| **Evaluation Design** | High: quality metrics must be specific enough to trust but broad enough to compare different run shapes. |
| **Replay Fidelity** | High: deterministic replay is the whole safety story for Phase 4a. |
| **Governance** | High: advisory-only promotion, manifest boundaries, and rollback semantics must stay explicit. |
| **Deferred Scope** | Very High: prompt optimization and meta-learning are materially premature until behavioral suites and broader corpus coverage exist. |
| **Overall** | High but stageable: Phase 4a is realistic now; Phase 4b should remain explicitly deferred. |

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Response |
|------|------------|--------|----------|
| Replay fidelity is insufficient | Medium | High | Reject promotion and keep optimizer output advisory only. |
| Search explores out-of-bounds fields | Low | High | Enforce optimizer-managed field allowlists in search and promotion logic. |
| Single-family corpus bias skews candidate selection | High | Medium | Treat `040` as a pilot corpus, keep `028` holdout results separate, and defer meta-learning. |
| Missing behavioral tests would allow broken configs through | Medium | High | Keep promotion advisory-only until those suites exist and pass. |
| Audit trail is too weak to explain a promotion | Medium | Medium | Treat missing audit detail as a promotion failure. |

---

## 11. USER STORIES

- As a maintainer of deep research and deep review, I want to tune deterministic thresholds against real `040` traces so improvements are evidence-backed instead of anecdotal.
- As a release reviewer, I want every candidate to show baseline comparison, audit reasoning, and explicit advisory-only status until replay and behavioral gates are real.
- As a future runtime maintainer, I want optimizer-managed fields clearly separated from hard runtime contracts and future prompt-pack entrypoints so rollback stays simple.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for Phase 4a.
- Phase 4b stays intentionally deferred until the behavioral test suite exists and at least two compatible corpus families support broader learning.
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

- Parent packet specification: `../spec.md`
- Parent packet plan: `../plan.md`
- Predecessor phase: `../003-wave-executor/spec.md`
- Related runtime foundation: `../001-runtime-truth-foundation/spec.md`
- Real corpus source today: `../../040-sk-deep-research-review-improvement-1/research/research.md`
