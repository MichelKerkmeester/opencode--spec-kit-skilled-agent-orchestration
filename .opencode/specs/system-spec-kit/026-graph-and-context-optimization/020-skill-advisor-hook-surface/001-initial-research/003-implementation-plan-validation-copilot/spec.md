---
title: "Feature Specification: 020 Wave-3 Implementation Plan Validation (cli-copilot)"
description: "Third research wave (20 iterations, cli-copilot gpt-5.4 high) validating the scaffolded 8-child implementation plan (002-009) against wave-1 + wave-2 synthesis. Challenges and validates the current scope, ordering, and per-child contracts. Does NOT re-open architecture."
trigger_phrases:
  - "020 wave 3 validation"
  - "implementation plan validation research"
  - "8 child scaffold validation"
  - "020 pre-implementation cross-check"
importance_tier: "critical"
contextType: "research"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/001-initial-research/003-implementation-plan-validation-copilot"
    last_updated_at: "2026-04-19T10:00:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Wave-3 validation packet scaffolded post-8-child-scaffold"
    next_safe_action: "Dispatch iteration 1 via cli-copilot gpt-5.4 high"
    blockers: []

---
# Feature Specification: 020 Wave-3 Implementation Plan Validation (cli-copilot)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md (020/001-initial-research) |
| **Prior waves** | wave-1 (cli-codex, converged) + wave-2 (cli-copilot extended, converged) |
| **Dispatch** | `copilot -p ... --model gpt-5.4 --allow-all-tools --no-ask-user` |
| **Budget** | 20 iterations |
| **Executor** | cli-copilot gpt-5.4 high |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (validation before implementation; not architecture-blocking) |
| **Status** | Dispatch Pending |
| **Effort Estimate** | 20 × ~5-10 min = 1.5-3.5 hours wall clock |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 8 implementation children (002-009) were scaffolded directly from wave-1 + wave-2 convergence. Before any child enters `/spec_kit:implement :auto`, the scaffold itself should be cross-checked: does it faithfully encode prior research? Are there gaps between what research recommended and what the spec/plan/tasks/checklist per child actually say? Are there hidden risks the linear 002→009 chain masks? Wave-3's job is to surface those issues at the cheapest possible stage — before code is written.

This wave does NOT re-open architecture (wave-1 settled that) or contract semantics (wave-2 settled that). It validates the SCAFFOLD against the research that produced it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope — 10 validation angles (V1-V10)

1. **V1 — Gap analysis**: read each child's spec.md + plan.md + tasks.md; flag gaps vs wave-1/wave-2 findings
2. **V2 — Risk hotspots per child**: which of 002-009 is under-scoped, over-scoped, or mis-ordered?
3. **V3 — Hidden dependency cycles**: beyond the linear 002→009 chain, are there latent coupling points (shared types, helper modules, cache keys) that create bidirectional dependencies?
4. **V4 — Corpus adequacy for 005 hard gate**: is 019/004's 200-prompt corpus sufficient for 100% parity + timing thresholds? Does it cover the prompt classes wave-2 V6 (adversarial) introduced?
5. **V5 — Runtime-specific edge cases**: for 006/007/008, surface real-world edge cases not captured (wrapper version skew, SDK API variance, hook-schema drift, Copilot SDK availability matrix)
6. **V6 — Observability contract completeness**: does 005 cover all emission paths (metric names, JSONL schema, alert thresholds, session_health section)? Any gaps in wave-2 §X6?
7. **V7 — Fail-open correctness**: walk every failure mode in research.md §Failure Modes + wave-2 §X5 and confirm the scaffolded 004 producer + 006/007/008 adapters cover it
8. **V8 — Migration compatibility**: when the hook lands in existing sessions with pre-cache state, what breaks? Does wave-2 §X7 migration design make it into 003/004?
9. **V9 — Privacy audit scope**: does 005's privacy suite cover every channel (envelope sources, metrics labels, stderr JSONL, session_health output, cache keys, generation counter file, hook-state)?
10. **V10 — Hard-gate realism**: is 005's 100% top-1 parity + p95 ≤ 50 ms + cache hit rate ≥ 60% achievable with the current producer/cache design in 004? Timing budget math must balance

### 3.2 Synthesis deliverable

- `research-validation.md` consolidating wave-3 findings with a per-child delta table (002-009) showing: `scaffold correctly encodes research | minor gap flagged | major gap requires spec edit | out of current 020 scope`

### 3.3 Out of Scope

- Re-opening wave-1 architecture decisions (8-child critical path, renderer-first, shared envelope)
- Re-opening wave-2 contracts (trust-state vocabulary, fail-open semantics, token caps, corpus choice)
- Modifying scaffolded spec.md/plan.md/tasks.md/checklist.md files — this wave PROPOSES edits; 020 parent decides whether to adopt
- Implementation of any child
- Changes to `skill_advisor.py`
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **R1**: 20 iterations complete OR convergence < 0.05 rolling average for 3 consecutive
- **R2**: `research-validation.md` synthesis with per-child delta table
- **R3**: Each of 10 validation angles (V1-V10) gets at least one iteration of investigation
- **R4**: Findings must be grounded — every claim cites a child spec/plan file OR prior research artifact
- **R5**: Where wave-3 findings diverge from wave-1/wave-2, flag explicitly with severity (P0 spec edit needed / P1 minor gap / P2 deferred)

### 4.2 P1 - Required

- **R10**: Wave-3 must NOT produce a 4th wave recommendation; if validation surfaces new architectural questions, flag them for a future phase (post-020)
- **R11**: Cross-iteration diversity — convergence must reflect diverse source files + angles, not redundant re-reads
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] 20 iterations executed OR early convergence
- [ ] `research-validation.md` written with per-child delta table
- [ ] All 10 validation angles (V1-V10) have answered or explicitly deferred findings
- [ ] Severity-tagged action list: P0 (blocks implementation) / P1 (should patch before impl) / P2 (defer/accept)

### Acceptance Scenario 1: Gap surfaced in child spec
**Given** the 8 scaffolded children, **when** wave-3 reads each child's scope, **then** any scope element missing from the scaffold vs prior research is surfaced with a severity tag and proposed patch.

### Acceptance Scenario 2: Hidden dependency exposed
**Given** the linear 002→009 chain, **when** wave-3 examines type/module/cache-key coupling, **then** hidden bidirectional dependencies (if any) are listed with the files involved.

### Acceptance Scenario 3: Corpus adequacy verdict
**Given** the 019/004 corpus and 005's harness requirements, **when** wave-3 cross-checks coverage, **then** the synthesis states whether the corpus meets 100% parity + adversarial-class coverage or flags missing prompt classes.

### Acceptance Scenario 4: Fail-open path walk
**Given** research.md §Failure Modes (11 error modes), **when** wave-3 walks each against 004's scaffolded error-mapping and 006/007/008's adapter fail-open paths, **then** every error mode has a confirmed coverage statement.

### Acceptance Scenario 5: Privacy audit gap check
**Given** 005's privacy suite plan, **when** wave-3 enumerates every channel where prompt content could leak, **then** any channel not covered by 005 is added to its scope.

### Acceptance Scenario 6: Hard-gate realism verdict
**Given** 004's producer design + 005's harness requirements, **when** wave-3 checks p95 ≤ 50 ms + cache hit ≥ 60% budget math, **then** the synthesis either confirms feasibility with evidence or flags a required design change.

### Acceptance Scenario 7: Synthesis completeness
**Given** 20 iterations budget, **when** convergence occurs, **then** `research-validation.md` exists with executive summary + per-child delta + severity-tagged findings + explicit "no 4th wave needed" statement (or flag for post-020 phase if needed).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Wave-3 duplicates wave-1/wave-2 findings | Per-iter prompts explicitly reference prior research.md + research-extended.md and require additive validation work |
| Convergence stalls on low-signal validation | Quality guards (source diversity + focus alignment) block premature stop; manual check at iter 15 if still diverging |
| Validation reopens architecture accidentally | R10 explicitly forbids; iter prompts scope-gate to "validation, not re-design" |
| Copilot 3-concurrent cap slows throughput | Sequential iteration (matches wave-2 pattern) |
| Findings propose breaking scaffold changes mid-session | Findings are proposals only; adoption decision lives with 020 parent packet |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Inherited from wave-2 §Final Open Questions + new validation-only questions. Wave-3 targets each:
- Runtime capability matrix accuracy (wave-2 deferred to 006-008)
- Copilot SDK availability in shipped runtime (wave-2 X3 validation item)
- 019/004 corpus prompt-class coverage vs adversarial class (wave-2 X5 introduced)
- Observability alert thresholds tuning (wave-2 X6 ranges)
<!-- /ANCHOR:questions -->
