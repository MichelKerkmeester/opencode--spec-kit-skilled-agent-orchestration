---
title: "Implementation Plan: Warm-Start Bundle Conditional Validation [template:level_3/plan.md]"
description: "Freeze the resume-plus-follow-up corpus first, benchmark baseline and component-only variants second, then decide whether the combined warm-start bundle stays conditional or earns a later promotion path."
trigger_phrases:
  - "013-warm-start-bundle-conditional-validation"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Warm-Start Bundle Conditional Validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown packet docs |
| **Framework** | system-spec-kit MCP server, eval helpers, and packet workflow |
| **Storage** | Frozen corpus fixtures plus current eval outputs and toggle configuration |
| **Testing** | Vitest, packet validation, focused benchmark matrix checks |

### Overview
Freeze the resume-plus-follow-up corpus first, benchmark baseline and component-only variants second, then decide whether the combined warm-start bundle stays conditional or earns a later promotion path. The frozen corpus should model compact continuity wrappers rather than narrative packet clones.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] R8 research framing and dependency order are stable.
- [x] Packet scope is bounded to validation, not predecessor implementation.
- [x] The owner surfaces for tests, eval orchestration, and ENV docs are named explicitly.

### Definition of Done
- [x] Packet docs are synchronized and placeholder-free.
- [x] The frozen corpus and full variant matrix are defined.
- [x] Focused benchmark evidence exists for baseline, component-only, and combined bundle runs.
- [x] Packet validation passes cleanly.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Re-read the packet spec and confirm the bundle is still conditional rather than default.
- Confirm predecessor packet status or equivalent readiness evidence for R2, R3, and R4 before trusting the combined bundle run.
- Re-read the compact-wrapper continuity assumptions before freezing the corpus so the benchmark does not test the wrong artifact shape.
- Freeze the resume-plus-follow-up corpus before collecting any comparison output.
- Re-run strict packet validation after doc edits and before claiming completion.

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-SCOPE-001 | Keep work inside the test, eval, and ENV surfaces named in the spec | Prevents the packet from absorbing broader harness rewrites |
| AI-TRUTH-001 | Treat the bundle as non-default until the full R8 matrix proves dominance | Prevents rollout by narrative instead of evidence |
| AI-DEP-001 | Re-verify R2, R3, and R4 readiness before trusting combined benchmark results | The bundle is meaningless if prerequisites are missing or stale |
| AI-VERIFY-001 | Require focused benchmark evidence plus strict validation before closeout | Keeps packet activation and follow-on publication honest |

### Status Reporting Format

- Start state: predecessor readiness, frozen corpus status, and first owner surfaces to touch
- Work state: active benchmark variant, comparison progress, and any blocked dependency
- End state: focused benchmark result, strict validator result, and explicit bundle-gating outcome

### Blocked Task Protocol

1. Stop immediately if the frozen corpus cannot be held constant across variants.
2. Do not widen scope to fix predecessor implementation inside this packet; record the blocker and keep the packet draft.
3. Resume only after the dependency or comparison-matrix contradiction is resolved and packet docs are updated accordingly.

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Frozen-corpus validation gate

### Key Components
- Packet-local documentation and non-default rollout boundary
- Frozen resume-plus-follow-up corpus fixtures in the test surface
- Bounded eval orchestration for baseline, component-only, and combined bundle variants
- ENV reference wording that preserves the conditional gate

### Data Flow
The packet freezes the benchmark corpus first, runs baseline and component-only variants next, then runs the combined R2+R3+R4 bundle. Cost and pass-rate comparisons from that single matrix decide whether the bundle remains conditional or qualifies for a later promotion packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read R8 and confirm the dependency order remains R2 -> R3 -> R4 -> bundle validation.
- [x] Verify predecessor packet status or equivalent readiness evidence.
- [x] Define and freeze the resume-plus-follow-up evaluation corpus around compact continuity wrappers and canonical-doc ownership assumptions.

### Phase 2: Core Implementation
- [x] Add the bounded test fixtures and runner entrypoints for the frozen corpus.
- [x] Add or refine eval orchestration for baseline, R2-only, R3-only, R4-only, and combined bundle runs.
- [x] Update ENV documentation so the warm-start bundle stays explicitly conditional and non-default.

### Phase 3: Verification
- [x] Run the full benchmark matrix on the frozen corpus.
- [x] Confirm whether the combined bundle lowers cost with equal-or-better pass rate versus baseline and component-only variants.
- [x] Run `validate.sh --strict` on the packet folder and record the gating outcome.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Frozen-corpus fixture coverage | Resume-plus-follow-up packet fixtures and runner behavior | Vitest |
| Variant benchmark validation | Baseline, component-only, and combined bundle comparison matrix | Packet-local eval helpers |
| Packet validation | Spec docs and checklist alignment | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R8 recommendations in `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/research/recommendations.md` | Internal | Green | Packet scope would lose its evidence base |
| `002-implement-cache-warning-hooks` (R2) | Internal | Green | The bundle producer side cannot be trusted |
| `012-cached-sessionstart-consumer-gated` (R3) | Internal | Green | Combined validation remains blocked until the consumer exists or equivalent evidence is accepted |
| `008-graph-first-routing-nudge` (R4) | Internal | Green | The routing component would be missing from the comparison matrix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet promotes the bundle without full matrix evidence, rewrites the benchmark harness broadly, or loses corpus fairness across variants.
- **Procedure**: Revert packet-local test, eval, and ENV changes, preserve predecessor packet state, and keep the warm-start bundle conditional until the validation contract is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Core implementation -> Verification
R2 + R3 + R4 readiness -> frozen corpus -> comparison matrix -> bundle gate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | R8 plus predecessor review | Core work |
| Core work | Setup | Verification |
| Verification | Core work | Any later bundle rollout or publication work |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 0.5-1 day |
| Core Implementation | Medium | 1-2 days |
| Verification | Medium | 0.5-1 day |
| **Total** | | **2-4 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Predecessor packets or equivalent evidence verified
- [x] Frozen corpus locked before benchmark runs
- [x] Non-default bundle gate re-read from `spec.md`

### Rollback Procedure
1. Revert packet-local benchmark and documentation changes.
2. Re-run the prior baseline path to confirm the old conditional behavior is restored.
3. Update packet docs if the dependency state or gate condition changed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove packet-local fixture rows or bounded eval helpers added for this validation packet.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
R8 research -> R2 producer + R3 consumer + R4 routing nudge -> 013-warm-start-bundle-conditional-validation -> future rollout/publication packet
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Frozen corpus | R8 validation framing | Stable benchmark inputs | Variant comparisons |
| Variant orchestration | Frozen corpus plus predecessor readiness | Baseline/component-only/combined results | Gating decision |
| Gating decision | Comparison results | Conditional-or-not outcome | Later rollout/publication work |
<!-- /ANCHOR:dependency-graph -->
