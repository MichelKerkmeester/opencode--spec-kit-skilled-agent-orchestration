---
title: "Implementation Plan: Agent Improvement Full Skill [skilled-agent-orchestration/041-sk-improve-agent-loop/002-sk-improve-agent-full-skill/plan]"
description: "Phase 002 plan for upgrading sk-improve-agent from the phase 001 MVP into a benchmark-backed, reusable full-skill system."
trigger_phrases:
  - "agent improvement full skill plan"
  - "benchmark harness plan"
  - "phase 2 loop plan"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Agent Improvement Full Skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON/JSONC, Node.js scripts, packet-local experiment evidence |
| **Primary Runtime Surface** | `.opencode/skill/sk-improve-agent/`, `.opencode/command/spec_kit/`, `.opencode/agent/` |
| **Baseline Packet** | `041-sk-improve-agent-loop` |
| **Primary Upgrade Goal** | Add benchmark-backed evaluation and reusable multi-target runtime structure |
| **Verification Basis** | Strict spec validation, fixture runs, target-profile runs, manifest guard checks, reducer outputs |

### Overview

This phase starts from the proven MVP and expands only along the safest path. First, strengthen the evaluator by building a real handover benchmark harness. Second, generalize the runtime structure so it can support target profiles rather than one-off handover logic. Third, onboard one additional structured target. Fourth, improve reporting and packaging boundaries without weakening the canonical-first trust model that phase 001 established.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Packet `041-sk-improve-agent-loop` remains complete and verified.
- The next packet scope is limited to benchmarking, reusable runtime structure, one additional target, and operator documentation.
- The second target candidate is structured enough to support deterministic evaluation.

### Definition of Done
- Handover evaluation is benchmark-backed rather than prompt-surface-only.
- Runtime config/manifest/reporting can support more than one target profile.
- One second structured target has a bounded evaluator profile and one verified run.
- Guardrails for canonical target enforcement still pass after expansion.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A target-profiled evaluation system built on the existing loop engine: shared ledger and runtime schema, profile-specific scoring rules, benchmark fixture packs, and downstream parity handling kept separate from experiment truth.

### Key Components
- **Benchmark harness**: repeatable fixture sets and expected-outcome rules for handover
- **Target profile layer**: per-target metadata, scoring hooks, and onboarding contract
- **Expanded runtime state**: shared config, manifest, ledger, dashboard, and result summaries across target families
- **Promotion boundary**: manifest-enforced canonical mutation remains narrow and explicit
- **Packaging boundary**: mirror sync becomes a controlled downstream step, never benchmark evidence

### Data Flow
An experiment selects a target profile, loads the shared runtime config, runs the fixture or target-specific scoring path, records outcomes in the shared ledger, updates the reducer dashboard, and only then considers canonical promotion. If promotion succeeds, any mirror-sync work is recorded separately as packaging follow-up.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Follow-On Packet Foundation
- Create and sync the Level 3 planning packet
- Carry forward the verified baseline and explicit non-goals from phase `001-sk-improve-agent-mvp`

### Phase 2: Handover Benchmark Harness
- Define fixture input set for handover
- Define benchmark expectations and score rubric
- Add harness scripts and packet-local evidence flow

### Phase 3: Runtime Engine Generalization
- Refactor config, manifest, and reducer expectations around target profiles
- Add reusable profile metadata and onboarding conventions
- Keep 041 safety constraints intact during refactor

### Phase 4: Second Structured Target
- Choose one structured target
- Define evaluator profile and manifest entry
- Run one bounded verification cycle against it

### Phase 5: Reporting and No-Go Controls
- Improve dashboard outputs for regressions, ties, infra failures, and target-specific summaries
- Add explicit stop conditions for weak signals and unstable runs

### Phase 6: Packaging and Operator Docs
- Define downstream mirror-sync workflow
- Add target onboarding guide, benchmark operator guide, and extension rules
- Verify command and skill docs remain aligned with the stronger runtime model

### Phase 7: Verification and Review
- Re-run strict packet validation
- Run benchmark evidence checks
- Re-run guardrail checks for invalid targets and promotion boundaries
- Use parallel review before claiming completion
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence Source |
|-----------|-------|-----------------|
| Spec validation | Packet structure and documentation integrity | `validate.sh` on this packet |
| Benchmark runs | Handover fixtures and repeatability | harness output under packet-local runtime area |
| Target-profile verification | Second target onboarding and scoring | target-specific ledger and dashboard artifacts |
| Guardrail enforcement | Invalid target mutation attempts | refusal logs for promote/rollback paths |
| Packaging separation | Canonical promotion vs downstream parity work | separate promotion and sync evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

```
Packet 041 Verified
    |
Benchmark Harness
    |
Runtime Generalization
    |
Second Target Onboarding
    |
Reporting + No-Go Controls
    |
Packaging Docs + Final Review
```

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 041 verified baseline | Core dependency | Green | This packet loses its safety baseline |
| Handover command/template | Evaluator dependency | Green | Benchmark harness loses its first trusted target |
| Second structured target choice | Scope dependency | Green | Full-skill expansion stalls after handover |
| Reducer/reporting architecture | Internal dependency | Green | Reporting improvements become fragmented |
| Operator workflow clarity | Adoption dependency | Green | Skill may work technically but remain hard to use safely |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: benchmark harness proves too unstable, runtime refactor weakens guardrails, or second-target onboarding broadens scope beyond the documented boundary.
- **Procedure**: preserve packet planning docs, revert code changes for incomplete full-skill expansion, and keep packet-local benchmark evidence for future review.
- **Scope**: phase `002` docs, benchmark scripts/assets, and expanded runtime surfaces only.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Benchmark Harness ──► Runtime Profiles ──► Second Target
         │                    │                  │
         └──────────────► Reporting + Docs ◄────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Packet Foundation | Existing verified packet only | All implementation work |
| Benchmark Harness | Packet Foundation | Runtime generalization |
| Runtime Profiles | Benchmark Harness | Second target, reporting |
| Second Target | Runtime Profiles | Full-skill verification |
| Reporting + Docs | Runtime Profiles | Final closeout |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Packet Foundation | Low | 1-2 hours |
| Benchmark Harness | Medium | 4-8 hours |
| Runtime Profiles | Medium | 4-8 hours |
| Second Target | Medium | 3-6 hours |
| Reporting + Docs | Medium | 3-5 hours |
| Final Verification | Low | 1-2 hours |

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm packet `041-sk-improve-agent-loop` remains the verified baseline before broadening scope.
- Re-read this packet's `spec.md` and `decision-record.md` before changing evaluator architecture or target expansion rules.
- Validate this packet after each structural documentation batch and after each future implementation phase.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| 1 | Build stronger benchmark proof before adding breadth. |
| 2 | Expand to one second structured target only in this packet. |
| 3 | Keep canonical benchmark evidence separate from downstream mirror-sync packaging work. |
| 4 | Preserve guardrail evidence whenever promotion or rollback logic changes. |

### Status Reporting Format

- Report which implementation phase moved forward.
- Report whether packet validation passes cleanly.
- Mark roadmap items as planned until benchmark and target evidence actually exist.

### Blocked Task Protocol

1. Stop at the first benchmark-stability, manifest-guard, or packet-validation failure.
2. Repair the current phase before broadening target scope.
3. If the blocker weakens the trust boundary, update the ADRs or pause for re-scoping instead of improvising a wider rollout.
