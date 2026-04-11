---
title: Recursive Agent Charter
description: Fixed policy charter for a improve-agent run.
---

# Recursive Agent Charter

Fixed policy template for a improve-agent run. Use it as the non-negotiable control layer that tells the mutator, scorer, reducer, and operator what kind of improvement workflow is allowed.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Defines the fixed policy boundary for a improve-agent run.

### Usage

Copy this file into the packet-local runtime area and treat it as the stable policy layer for that run. Do not let the mutator rewrite the charter during proposal generation.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:mission -->
## 2. MISSION

Build a trustworthy improvement loop for agent surfaces by proving evaluation discipline before allowing self-editing. Evaluate agents holistically across their full integration surface — not just the prompt file, but the complete system of mirrors, commands, YAML workflows, skills, and gate routing that together define agent behavior.

---

<!-- /ANCHOR:mission -->
<!-- ANCHOR:targets -->
## 3. TARGETS

### Dynamic Targets

- targets are bounded agent files selected at initialization time (any `.opencode/agent/*.md`)
- no canonical pre-selected target; every run picks its target explicitly and evaluates it through dynamic mode

---

<!-- /ANCHOR:targets -->
<!-- ANCHOR:policy -->
## 4. POLICY

- proposal-only mode is mandatory
- the mutator and scorer are separate roles
- benchmark evidence is required for target profiles that declare fixtures
- all attempts are logged append-only
- runtime mirrors are downstream packaging surfaces, not benchmark truth
- human approval is required before any canonical promotion
- promotion is a per-target decision under dynamic mode; no static profile is automatically promotion-eligible
- evaluation uses 5 deterministic dimensions (structural integrity, rule coherence, integration consistency, output quality, system fitness) — each scored independently, weighted, and tracked per iteration

---

<!-- /ANCHOR:policy -->
<!-- ANCHOR:keep-discard -->
## 5. KEEP OR DISCARD RULE

- keep the baseline when the candidate is weaker, noisier, or broader
- keep the candidate only when it scores higher without violating policy
- prefer the simpler option on ties

---

<!-- /ANCHOR:keep-discard -->
<!-- ANCHOR:audit-trail -->
## 6. AUDIT TRAIL OBLIGATIONS

### Journal Emission Protocol (ADR-001)

The orchestrator MUST emit journal events at each lifecycle boundary. The proposal-only agent MUST NOT write to the journal.

| Lifecycle Boundary | Journal Event Type | Required Fields |
| --- | --- | --- |
| Session initialization | `session_initialized` | sessionId, target, profile, config snapshot |
| Integration scan | `integration_scanned` | integrationReportHash, surface counts |
| Candidate generation | `candidate_generated` | candidateId, iteration, mutationType |
| Candidate scoring | `candidate_scored` | candidateId, dimensions[], weightedScore |
| Benchmark completion | `benchmark_completed` | candidateId, aggregateScore, fixtureResults |
| Legal-stop evaluation | `legal_stop_evaluated` | gateResults (contractGate, behaviorGate, integrationGate, evidenceGate, improvementGate) |
| Blocked stop | `blocked_stop` | failedGates[], reason |
| Trade-off detected | `trade_off_detected` | improving, regressing, deltas |
| Session end | `session_ended` | stopReason, sessionOutcome, finalIteration |

### Stop-Reason Contract

- **stopReason** (WHY session ended): `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, `stuckRecovery`
- **sessionOutcome** (WHAT happened): `keptBaseline`, `promoted`, `rolledBack`, `advisoryOnly`

### Legal-Stop Gate Bundles

A session may NOT claim `converged` unless ALL gate bundles pass:

- **contractGate**: structural >= 90 AND systemFitness >= 90
- **behaviorGate**: ruleCoherence >= 85 AND outputQuality >= 85
- **integrationGate**: integration >= 90 AND no drift ambiguity
- **evidenceGate**: benchmark pass AND repeatability pass
- **improvementGate**: weighted delta >= configured threshold

Failed gates persist `blockedStop` with full gate results.

---

<!-- /ANCHOR:audit-trail -->
<!-- ANCHOR:out-of-scope -->
## 7. OUT OF SCOPE

- multi-canonical promotion
- runtime-mirror mutation as experiment evidence
- open-ended multi-target rollout
- self-grading mutators

---

<!-- /ANCHOR:out-of-scope -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

- `../references/promotion_rules.md`
- `../references/no_go_conditions.md`
- `target_manifest.jsonc`

<!-- /ANCHOR:related-resources -->
