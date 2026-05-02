---
title: Deep Review Convergence
description: Stop condition algorithms, quality guards, and recovery strategies for the autonomous deep review loop.
---

# Deep Review Convergence

Stop condition algorithms, quality guards, and stuck recovery for the deep review loop.

---

## 1. OVERVIEW

Convergence detection determines when the autonomous review loop should stop iterating. After every iteration the orchestrator evaluates three possible outcomes:

| Outcome | Meaning |
|---------|---------|
| **CONTINUE** | More review work is expected to yield meaningful new findings. Dispatch the next iteration. |
| **STOP** | The review has reached saturation. Proceed to synthesis and verdict. |
| **STUCK_RECOVERY** | No progress detected for consecutive iterations. Attempt a recovery strategy before deciding. |

Convergence is checked **after** each iteration completes and **before** the next iteration is dispatched. The check consumes the full JSONL state history and the current dimension coverage snapshot.

Release-readiness states are derived alongside convergence:
- `in-progress` while coverage is incomplete or new P0/P1 findings are still appearing
- `converged` once coverage and stabilization pass without new P0/P1 findings
- `release-blocking` whenever unresolved P0 findings remain active

When the loop stops and enters synthesis, the workflow emits `{artifact_dir}/resource-map.md` from converged review deltas before compiling `review-report.md`. Operators can disable that write with `--no-resource-map`.

### Key Defaults

| Setting | Value | Purpose |
|---------|-------|---------|
| `maxIterations` | 7 | Hard ceiling on loop iterations |
| `convergenceThreshold` | 0.10 | General convergence sensitivity |
| `rollingStopThreshold` | 0.08 | Rolling-average STOP vote threshold |
| `noProgressThreshold` | 0.05 | Stuck / no-progress classification threshold |
| `stuckThreshold` | 2 | Consecutive no-progress iterations before recovery |
| `minStabilizationPasses` | 1 | Coverage signal requires at least one stabilization pass |
| `compositeStopScore` | 0.60 | Weighted stop-score needed before guard evaluation |

### Security-Sensitive Fix Overrides

For review reruns after fixes involving security, path disclosure, auth/authz, sandboxing, env precedence, public schemas, persistence, or user-visible error payloads:

| Setting | General Default | Security-Sensitive Fix Default |
|---------|-----------------|--------------------------------|
| `minStabilizationPasses` | 1 | 2 |
| `requiredClosedFindingReplay` | false | true for prior P0/P1 and any prior security/path P2 |
| `requiredFixCompletenessGate` | false | true |

STOP is not legal until the review report contains a closed-gate replay table that marks each prior active or remediated P0/P1 as `PASS`, `FAIL`, or `carried forward`, with file:line or command evidence.

### Shared Stop Contract

Every terminal stop and every blocked-stop vote MUST emit the shared stop contract from REQ-001: a named `stopReason` enum plus — when STOP is vetoed — a `blocked_stop` event written to `deep-review-state.jsonl`. There is no nested `legalStop` wrapper on the persisted path; earlier drafts of this document implied one, and that drift was the source of F009 in the 042 closing audit.

#### stopReason Enum

| `stopReason` | Meaning |
|--------------|---------|
| `converged` | All convergence signals met and legal-stop gates passed. |
| `maxIterationsReached` | Iteration limit hit before convergence. |
| `userPaused` | User requested pause via sentinel. |
| `blockedStop` | Convergence math voted stop but legal-stop gates failed. |
| `stuckRecovery` | Stuck detection triggered recovery. |
| `error` | Unrecoverable error during iteration or reducer flow. |
| `manualStop` | Operator explicitly halted outside the pause sentinel path. |

#### blocked_stop Event (canonical, persisted)

`step_emit_blocked_stop` in both `spec_kit_deep-review_{auto,confirm}.yaml` appends the following record to `deep-review-state.jsonl` whenever the legal-stop decision tree vetoes STOP. The gate names and their shapes are load-bearing — the reducer reads them verbatim:

```json
{
  "type": "event",
  "event": "blocked_stop",
  "mode": "review",
  "run": 5,
  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
  "gateResults": {
    "convergenceGate": { "pass": true, "score": 0.72 },
    "dimensionCoverageGate": {
      "pass": false,
      "covered": ["correctness", "security", "traceability"],
      "missing": ["maintainability"]
    },
    "p0ResolutionGate": { "pass": false, "activeP0": 1 },
    "evidenceDensityGate": { "pass": true, "avgEvidencePerFinding": 1.6 },
    "hotspotSaturationGate": { "pass": true },
    "claimAdjudicationGate": { "pass": true, "activeP0P1": 2 },
    "fixCompletenessReplayGate": { "pass": true, "securitySensitive": false, "requiredRows": 0, "passingRows": 0 }
  },
  "graphBlockerDetail": [],
  "recoveryStrategy": "Dispatch the next iteration at the maintainability dimension and re-check after resolving the remaining P0.",
  "timestamp": "2026-03-24T15:02:00Z",
  "sessionId": "rvw-2026-03-24T10-00-00Z",
  "generation": 1
}
```

- `blockedBy`: array of gate names that failed (string[] — never structured objects). Empty when STOP is legal, in which case no `blocked_stop` event is emitted.
- `gateResults`: named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, and `fixCompletenessReplayGate`. Each sub-record has a `pass` boolean plus gate-specific fields (score, covered/missing, activeP0, avgEvidencePerFinding, activeP0P1, securitySensitive, requiredRows, passingRows). The reducer reads these verbatim and does not coerce shapes.
- `graphBlockerDetail`: array of structured graph blockers copied from the latest graph convergence decision. Empty when graph convergence did not veto STOP.
- `recoveryStrategy`: human-readable one-liner describing what the next iteration should do before another stop attempt.
- When the graph convergence verdict is `STOP_BLOCKED`, fold the graph blocker gate name into `blockedBy` and preserve the structured blocker objects under `graphBlockerDetail`.

### Decision Priority

Checks are evaluated in this order (first match wins):

1. **Max iterations** -- hard cap, always checked first.
2. **All dimensions covered + clean** -- all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed.
3. **Stuck detection** -- 2+ consecutive no-progress iterations.
4. **Composite convergence** -- 3-signal weighted vote with threshold 0.60.
5. **Legal-stop gate bundle** -- review-specific stop gates; if a stop vote fails any gate, persist `stopReason=blockedStop` and continue.
6. **Default CONTINUE** -- none of the above triggered.

---

## 2. HARD STOPS

Hard stops are evaluated first and override all other signals.

### Max Iterations Reached

```
if len(iterations) >= config.maxIterations:       // default 7
  return { action: "STOP", stopReason: "maxIterationsReached" }
```

The loop stops unconditionally. Synthesis runs with whatever findings exist.

### All Dimensions Covered with Stabilization

```
if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
    if buildReviewLegalStop(state, config, coverage).passed:
      return { action: "STOP", stopReason: "converged" }
```

Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and the 5-gate legal-stop bundle passes. If gates fail, the loop records `stopReason=blockedStop` and continues despite full coverage.

---

## 3. STUCK DETECTION

Identifies when the review loop makes no meaningful progress across consecutive iterations.

```
function countConsecutiveStuck_review(evidenceIterations, noProgressThreshold):
  count = 0
  for i in reversed(evidenceIterations):
    if i.status == "thought":   continue    // invisible to stuck counter
    if i.status == "insight":   break       // resets stuck counter (genuine progress)
    if i.newFindingsRatio < noProgressThreshold or i.status == "stuck":
      count += 1
    else:
      break
  return count
```

**Threshold:** `stuckThreshold = 2` consecutive no-progress iterations (using `noProgressThreshold = 0.05`).

**Status exclusions:**
- `insight`: Resets stuck counter -- a conceptual breakthrough counts as progress even with a low ratio.
- `thought`: Skipped entirely -- analytical iterations produce no evidence to measure.

When `stuckCount >= stuckThreshold`, the orchestrator invokes the recovery protocol (Section 8) before deciding whether to continue or stop.

The recovery entry uses `stopReason=stuckRecovery` while the loop is in recovery. If recovery later terminates the run, the terminal record keeps the same shared enum value instead of minting a review-only label.

---

## 4. COMPOSITE CONVERGENCE

Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold. The signal set below matches the authoritative 3-signal vote in `spec_kit_deep-review_{auto,confirm}.yaml` `step_check_convergence` and the quick-reference convergence table — the 3rd signal is **dimension coverage**, not a standalone novelty ratio.

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 2 | Recent severity-weighted finding yield |
| MAD Noise Floor | 0.25 | 3 | Signal vs noise in newFindingsRatio |
| Dimension Coverage | 0.45 | 1 | Configured review dimensions fully covered AND required traceability protocols covered AND `coverage_age >= minStabilizationPasses` |

### Signal 1: Rolling Average (weight 0.30)

Averages the last 2 severity-weighted `newFindingsRatio` values from evidence-bearing iterations (excludes `thought` status). Votes STOP when the average drops below `rollingStopThreshold` (0.08).

```
if len(evidenceIterations) >= 2:
  recent = evidenceIterations[-2:]
  avgRatio = mean(i.newFindingsRatio for i in recent)
  rollingStop = avgRatio < 0.08
```

### Signal 2: MAD Noise Floor (weight 0.25)

Robust statistical test using Median Absolute Deviation. Votes STOP when the latest ratio is at or below the computed noise floor.

```
if len(evidenceIterations) >= 3:
  allRatios = [i.newFindingsRatio for i in evidenceIterations]
  med = median(allRatios)
  mad = median([abs(r - med) for r in allRatios])
  noiseFloor = mad * 1.4826     // normal distribution estimator
  madStop = evidenceIterations[-1].newFindingsRatio <= noiseFloor
```

### Signal 3: Dimension Coverage (weight 0.45)

Highest-weight signal. Votes STOP once every configured review dimension AND every required traceability protocol has been covered by at least one iteration, and the coverage set has been stable for at least `minStabilizationPasses` iterations (default 1). This is the signal the YAML workflow actually evaluates — earlier drafts of this reference labelled it "Novelty Ratio", which was drift.

```
dimensionStop =
  dimensions_covered_count == configured_dimensions_count
  AND required_traceability_protocols_covered
  AND coverage_age >= config.minStabilizationPasses
```

The latest severity-weighted newFindingsRatio is still tracked (the dashboard and registry surface it as `newFindingsRatio`), but it does NOT cast an independent stop vote — it feeds the rolling average and MAD noise-floor signals only.

### Weighted Vote

```
stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
if stopScore >= 0.60:   // proceed to quality gate evaluation
```

Weights are redistributed across active signals only. If only 2 signals have enough data, their weights are normalized to sum to 1.0.

### Semantic Convergence Signals

Two additional signals provide deeper semantic analysis of review iteration quality. These signals are ADDITIONAL to the 3-signal composite vote above and participate in the legal-stop gate evaluation rather than the composite stop-score.

#### semanticNovelty (0.0-1.0)

Measures how much genuinely new review insight each iteration contributes beyond surface-level overlap with prior findings. Unlike `newFindingsRatio` (which is severity-weighted), `semanticNovelty` evaluates the conceptual novelty of findings independent of severity weighting.

| Value | Meaning |
|-------|---------|
| 0.8-1.0 | Iteration uncovered substantially new defect patterns, architectural concerns, or review angles |
| 0.4-0.7 | Mix of new review insights and restatements of prior findings |
| 0.1-0.3 | Mostly refinements or rewordings of previously identified issues |
| 0.0 | No semantically novel findings detected |

Computation:
```
function computeSemanticNovelty_review(currentFindings, priorCumulativeFindings):
  newPatterns = extractDefectPatterns(currentFindings) - extractDefectPatterns(priorCumulativeFindings)
  totalPatterns = extractDefectPatterns(currentFindings)
  if len(totalPatterns) == 0: return 0.0
  return len(newPatterns) / len(totalPatterns)
```

When `semanticNovelty` drops below 0.15 for 2+ consecutive evidence iterations, it provides strong supporting evidence for a legal STOP decision. This signal catches cases where `newFindingsRatio` stays moderate (due to severity weighting of refinements) but the review has exhausted genuinely new defect categories.

#### findingStability (0.0-1.0)

Measures how stable the cumulative finding set is across iterations. A high stability score means the finding registry is not materially changing between iterations -- findings are not being added, upgraded, downgraded, or invalidated at a significant rate.

| Value | Meaning |
|-------|---------|
| 0.9-1.0 | Finding set is highly stable; minimal churn between iterations |
| 0.6-0.8 | Moderate stability; some findings still evolving |
| 0.3-0.5 | Active churn; findings being added, merged, or reclassified frequently |
| 0.0-0.2 | Highly unstable; the review is still in early discovery |

Computation:
```
function computeFindingStability(currentRegistry, priorRegistry):
  if priorRegistry is null: return 0.0  // first iteration
  unchangedFindings = count(f for f in currentRegistry
    if f.id in priorRegistry and f.severity == priorRegistry[f.id].severity
    and f.status == priorRegistry[f.id].status)
  totalFindings = max(len(currentRegistry), len(priorRegistry))
  if totalFindings == 0: return 1.0
  return unchangedFindings / totalFindings
```

Convergence behavior:
- `findingStability >= 0.85` supports STOP: the finding set has stabilized and further iterations are unlikely to materially change the review outcome.
- `findingStability < 0.50` prevents STOP: the finding set is still in flux and the review has not reached a stable assessment.

#### Integration with Legal-Stop Gate Bundle

The two semantic signals integrate with the existing 5-gate legal-stop bundle (Section 6):

1. **findingStability gate** (existing): The existing `findingStability` gate already evaluates rolling average, MAD noise floor, and novelty ratio. The new `semanticNovelty` signal adds a sub-check:
   - `semanticNoveltyPlateau`: `semanticNovelty < 0.15` for 2+ consecutive evidence iterations
   - When this sub-check fails while the existing churn signals pass, the gate records the mismatch as a diagnostic note but does not independently block STOP.

2. **findingStability signal** (new): The `findingStability` metric (0.0-1.0) is surfaced alongside the existing convergence signals. It supports the `findingStability` gate evaluation by providing a registry-level stability measure that complements the ratio-based churn signals.

The gate passes only when both the existing churn-based checks AND the semantic stability checks agree. When a semantic check fails, the persisted `blocked_stop.gateResults.findingStability` payload includes the semantic signal values.

#### Stop-Decision Trace

The stop-decision event includes which semantic signals supported or prevented STOP:

```json
{
  "type": "event",
  "event": "stop_decision",
  "semanticSignals": {
    "semanticNovelty": { "value": 0.06, "consecutiveLow": 3, "supportsStop": true },
    "findingStability": { "value": 0.92, "supportsStop": true }
  },
  "semanticVerdict": "all_support_stop",
  ...
}
```

| `semanticVerdict` | Meaning |
|-------------------|---------|
| `all_support_stop` | Both semantic signals support stopping |
| `mixed` | One signal supports stop, the other does not |
| `all_prevent_stop` | Both semantic signals indicate more work is needed |
| `insufficient_data` | Not enough iterations to compute semantic signals |

### Graceful Degradation

| Iterations Completed | Active Signals | Behavior |
|---------------------|----------------|----------|
| 1 | Novelty ratio only (weight 1.0) | Very unlikely to stop without later confirmation from rolling churn signals |
| 2 | Rolling avg + novelty ratio | Two-signal vote, reweighted |
| 3+ | All three signals | Full composite, most reliable |

Semantic convergence signals (`semanticNovelty`, `findingStability`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.

---

## 5. SEVERITY-WEIGHTED RATIO

The review loop uses `newFindingsRatio` instead of `newInfoRatio`. It weights findings by severity so that critical discoveries count far more than minor suggestions.

### Severity Weights

| Severity | Weight | Description |
|----------|--------|-------------|
| **P0** (Blocker) | 10.0 | Correctness failures, security vulnerabilities, spec contradictions |
| **P1** (Required) | 5.0 | Degraded behavior, incomplete implementation, missing validation |
| **P2** (Suggestion) | 1.0 | Style, naming, minor improvements, documentation gaps |

### Computation

```
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
refinementMultiplier = 0.5

weightedNew       = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
weightedTotal     = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)

newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
```

- `fully_new_findings` -- findings not present in any prior iteration (new findingId).
- `refinement_findings` -- findings that refine or upgrade an existing finding (same root cause, new evidence or severity change).
- `refinementMultiplier = 0.5` -- refinements count at half weight.

### P0 Override Rule

```
if ANY new P0 found this iteration:
  newFindingsRatio = max(calculated, 0.50)

if total_findings == 0:
  newFindingsRatio = 0.0
```

A new critical finding always signals significant remaining work. The 0.50 floor prevents premature convergence when critical issues are still being discovered.

---

## 6. LEGAL-STOP GATE BUNDLE

Deep review treats STOP as legal only when the full review-specific gate bundle passes together. Convergence math may request STOP, but the workflow must still evaluate these 5 gates and persist a blocked-stop event when any gate fails.

| Gate | Rule | Fail Action |
|------|------|-------------|
| **findingStability** | Rolling average, MAD noise floor, and novelty ratio must all indicate low-yield review churn | Block STOP, persist `blockedStop` |
| **dimensionCoverage** | Every configured review dimension must have been examined at least once, with required traceability coverage stabilized | Block STOP, persist `blockedStop` |
| **p0Resolution** | No unresolved P0 findings may remain active at stop time | Block STOP, persist `blockedStop` |
| **evidenceDensity** | Evidence density across active findings must meet the configured threshold | Block STOP, persist `blockedStop` |
| **hotspotSaturation** | Review hotspots must be revisited enough times to satisfy the saturation heuristic | Block STOP, persist `blockedStop` |
| **fixCompletenessReplay** | Security-sensitive fix reruns must replay previously closed P0/P1 gates and validate producer/consumer/matrix coverage from the remediation packet | Block STOP, persist `blockedStop` |

### Gate Evaluation

```
function buildReviewLegalStop(state, config, coverage):
  gateResults = {
    findingStability: {
      pass: rollingStop and madStop and state.latestNoveltyRatio <= config.convergenceThreshold,
      detail: "Rolling average, MAD noise floor, and novelty ratio are all below stop thresholds."
    },
    dimensionCoverage: {
      pass: everyConfiguredDimensionExaminedAtLeastOnce(coverage, config.reviewDimensions) and
            coverage.requiredProtocolsCovered and
            coverage.stabilizationPasses >= 1,
      detail: "All configured review dimensions have been examined, required traceability protocols are covered, and stabilization has aged enough to stop."
    },
    p0Resolution: {
      pass: countActiveFindings(state, ["P0"]) == 0 and state.claimAdjudicationPassed != false,
      detail: "No unresolved P0 findings remain and blocker adjudication is complete."
    },
    evidenceDensity: {
      pass: computeEvidenceDensity(state.activeFindings) >= config.evidenceDensityThreshold,
      detail: "Evidence density meets the configured threshold for active findings."
    },
    hotspotSaturation: {
      pass: computeHotspotSaturation(state.hotspots) >= config.hotspotSaturationThreshold,
      detail: "Priority hotspots received enough revisits to satisfy saturation."
    },
    fixCompletenessReplay: {
      pass: not isSecuritySensitiveFixRerun(state, config) or allRequiredReplayRowsPass(state.reviewReport),
      detail: "Security-sensitive fix reruns include closed-gate replay evidence and producer/consumer/matrix coverage before STOP."
    }
  }

  blockedBy = [name for name, result in gateResults.items() if not result.pass]
  return {
    pass: len(blockedBy) == 0,
    blockedBy,
    gateResults
  }
```

When convergence math returns STOP, invoke `buildReviewLegalStop()`. If it returns `pass: false`, persist a first-class `blocked_stop` event with the failing `blockedBy` gates, the full `gateResults` bundle, a `recoveryStrategy`, and the normal run/timestamp/session lineage fields before overriding the decision to CONTINUE.

### Blocked-Stop Recovery Strategy

| Failed Gate | Recovery Strategy |
|-------------|-------------------|
| `findingStability` | Revisit the noisiest recent dimension and reduce novelty by closing obvious follow-up loops before re-checking STOP. |
| `dimensionCoverage` | Schedule the next uncovered review dimension immediately. |
| `p0Resolution` | Re-open the active blocker path and verify whether the P0 is real, downgraded, or still unresolved. |
| `evidenceDensity` | Re-read weakly supported findings and add concrete `file:line` citations before they count toward a stop decision. |
| `hotspotSaturation` | Revisit undersampled hotspots or adjacent call sites until the saturation heuristic passes. |
| `fixCompletenessReplay` | Replay prior active or remediated P0/P1 gates, then record producer, consumer, and matrix coverage evidence before re-checking STOP. |

### Legacy Stop-Reason Mapping

Use this table when replaying old packets or translating older prose/docs into the shared stop contract.

| Legacy label | New `stopReason` | Mapping note |
|--------------|------------------|--------------|
| `all_dimensions_clean` | `converged` | Legacy review-specific terminal label; now expressed by the shared enum. |
| `composite_converged` | `converged` | Legacy convergence-math wording now rolls into shared terminal success. |
| `all dimensions clean` | `converged` | Old operator-facing prose for the same successful stop. |
| `max_iterations_reached` | `maxIterationsReached` | Legacy machine label for the hard iteration cap. |
| `max iterations` | `maxIterationsReached` | Old operator-facing hard-stop wording. |
| `pause sentinel detected` | `userPaused` | Sentinel pause is now a shared user-directed stop reason. |
| `guard_override` | `blockedStop` | Legacy continue override when a stop vote failed legal gates. |
| `quality guard failed` | `blockedStop` | Older prose for the same blocked-stop outcome. |
| `P0 override blocks convergence` | `blockedStop` | Legacy review wording for a stop attempt that was not legal to finalize. |
| `stuck_detected` | `stuckRecovery` | Legacy recovery trigger label. |
| `stuck_unrecoverable` | `stuckRecovery` | Legacy terminal wording for the same recovery path family. |
| `manual halt` | `manualStop` | Operator-directed halt outside normal pause sentinel flow. |

---

## 7. PROVISIONAL VERDICT

The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.

| Verdict | Condition | Meaning |
|---------|-----------|---------|
| **FAIL** | `activeP0 > 0` OR any legal-stop gate fails at terminal stop time | Does not meet quality standards. Blocks release. |
| **CONDITIONAL** | `activeP0 == 0` AND `activeP1 > 0` | Meets threshold but has required fixes before release. |
| **PASS** | `activeP0 == 0` AND `activeP1 == 0` | Shippable. Set `hasAdvisories: true` when `activeP2 > 0`. |

### Determination

```
function determineVerdict(state, gateResult):
  activeP0 = countActiveFindings(state, ["P0"])
  activeP1 = countActiveFindings(state, ["P1"])
  activeP2 = countActiveFindings(state, ["P2"])

  if activeP0 > 0 or not gateResult.passed:
    return { verdict: "FAIL", nextCommand: "/spec_kit:plan" }
  if activeP1 > 0:
    return { verdict: "CONDITIONAL", nextCommand: "/spec_kit:plan" }

  hasAdvisories = activeP2 > 0
  return { verdict: "PASS", hasAdvisories, nextCommand: "/create:changelog" }
```

### Post-Verdict Routing

| Verdict | Next Step |
|---------|-----------|
| FAIL | `/spec_kit:plan` -- create remediation plan from findings |
| CONDITIONAL | `/spec_kit:plan` -- create fix plan for P1 findings |
| PASS | `/create:changelog` -- record the clean audit |

---

## 8. RECOVERY STRATEGIES

When stuck detection triggers (`stuckCount >= stuckThreshold`), the orchestrator selects a targeted recovery strategy before deciding whether to continue or exit to synthesis.

### Failure Modes

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity:** zoom into functions if reviewing at file level, or zoom out to module level if reviewing functions |
| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
| Low-value advisory churn | Last 2 iterations found only P2 findings | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |

### Least-Covered Dimension Pivot

Stuck recovery always pivots to the **least-covered dimension** -- the review dimension with the fewest iteration passes and lowest coverage ratio -- rather than relying solely on strategy-based selection. This ensures recovery escapes local minima by exploring under-examined areas of the review target.

The pivot target is computed as:
```
leastCovered = min(dimensions, key=lambda d: (iterationCountFor(d), coverageRatioFor(d)))
```

When the stuck recovery fires, the YAML workflow appends a `stuck_recovery` JSONL event that records the target dimension:
```json
{"type":"event","event":"stuck_recovery","fromIteration":4,"strategy":"change_granularity","targetDimension":"maintainability","outcome":"pending","timestamp":"..."}
```

### Selection Logic

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]
  leastCovered = findLeastCoveredDimension(state.dimensionCoverage, state.iterations)

  if len(set(lastFocuses)) <= 1:                           // same dimension stuck
    return { strategy: "change_granularity", dimension: leastCovered }
  if hasRequiredProtocolPlateau(state.traceabilityChecks):  // protocols incomplete
    return { strategy: "protocol_first_replay", dimension: leastCovered }
  return { strategy: "escalate_severity_review", dimension: leastCovered }  // default
```

### Recovery Dispatch Prompt

```
RECOVERY MODE: The last {stuckCount} iterations found no significant new findings.

Dimension focus that is exhausted: {dimension}
Recovery strategy: {strategy}

You MUST try a fundamentally different approach:
- change_granularity: Zoom into functions (if file-level) or zoom out to modules (if function-level).
- protocol_first_replay: Re-run the incomplete traceability protocol against conflicting artifacts.
- escalate_severity_review: Hunt for P0/P1 patterns across all dimensions.

Focus on: {leastCoveredDimension}
```

### Recovery Evaluation

- **Success:** Recovery iteration finds any new P0/P1 or materially advances required traceability coverage. Reset stuck count. Continue.
- **Failure:** Recovery iteration finds only P2 or nothing. If all dimensions are covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.

### JSONL Record

```json
{"type":"event","event":"stuck_recovery","fromIteration":4,"strategy":"change_granularity","outcome":"recovered"}
```

---

## 9. CONVERGENCE REPORT

When the loop stops, the orchestrator generates a convergence report embedded in `review-report.md` and appended to the JSONL state file.

### Report Format

```
CONVERGENCE REPORT
------------------
Stop reason: [converged | maxIterationsReached | userPaused | blockedStop | stuckRecovery | error | manualStop]
Total iterations: N
Provisional verdict: [PASS | CONDITIONAL | FAIL]
hasAdvisories: [true | false]

Active findings at convergence:
  P0: N    P1: N    P2: N

Dimension coverage: N / 4 (X%)
  Correctness:     [covered | not covered]
  Security:        [covered | not covered]
  Traceability:    [covered | not covered]
  Maintainability: [covered | not covered]

Required protocols covered: [true | false]
Stabilization passes: N

Composite Convergence Score: 0.XX / 0.60 threshold
  Signal 1 - Rolling Avg (w=0.30):        0.XX [STOP|CONTINUE]
  Signal 2 - MAD Noise (w=0.25):          0.XX [STOP|CONTINUE] (floor: 0.XX)
  Signal 3 - Novelty Ratio (w=0.45):      0.XX [STOP|CONTINUE] (threshold: 0.10)

Legal-stop gates:
  findingStability: [PASS | FAIL]
  dimensionCoverage: [PASS | FAIL]
  p0Resolution: [PASS | FAIL]
  evidenceDensity: [PASS | FAIL]
  hotspotSaturation: [PASS | FAIL]

Semantic Convergence Signals:
  semanticNovelty:    0.XX (consecutive low: N) [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  findingStability:   0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  semanticVerdict:    [all_support_stop|mixed|all_prevent_stop|insufficient_data]

blocked_stop (only when STOP was vetoed on this run):
  blockedBy: [gate names]
  gateResults: [pass/fail map with detail]
  recoveryStrategy: [what the next iteration must do before STOP can be retried]

Stuck recovery attempts: N (recovered: N, failed: N)
```

### JSONL Synthesis Event

```json
{
  "type": "event",
  "event": "synthesis",
  "stopReason": "converged",
  "totalIterations": 5,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeP0": 0,
  "activeP1": 2,
  "activeP2": 5,
  "dimensionCoverage": 1.0,
  "requiredProtocolsCovered": true,
  "stabilizationPasses": 1,
  "compositeStopScore": 0.70,
  "signals": [
    { "name": "rollingAvg", "value": 0.04, "stop": true, "weight": 0.30 },
    { "name": "madScore", "value": 0.06, "stop": true, "weight": 0.25 },
    { "name": "noveltyRatio", "value": 0.03, "stop": true, "weight": 0.45 }
  ],
  "gatesPassed": true,
  "stuckRecoveryAttempts": 0
}
```

When STOP is vetoed instead of finalized, the workflow emits the separate `blocked_stop` event from Section 6 rather than nesting a `legalStop` object inside `synthesis`.

---

## 10. GRAPH-AWARE REVIEW CONVERGENCE

When `graphEvents` are present in review iteration records, the reducer builds an in-memory coverage graph and derives structural convergence signals that complement the existing statistical signals.

### Graph Convergence Signals (Review)

| Signal | Type | Description | Stop Support |
|--------|------|-------------|-------------|
| `graphDimensionCoverage` | number (0.0-1.0) | Fraction of dimension nodes with at least one COVERS edge to a file node | Above 0.85 supports stop |
| `graphFindingConnectivity` | number (0.0-1.0) | Fraction of finding nodes with at least one EVIDENCES edge | Above 0.90 supports stop (all findings backed by evidence) |
| `graphRemediationRatio` | number (0.0-1.0) | Fraction of P0/P1 findings with at least one REMEDIATES edge | Rising ratio supports stop (findings being resolved) |
| `graphIsolatedFindings` | number | Finding nodes with no edges | Above 0 prevents stop (unconnected findings need evidence) |

### Integration with Legal-Stop Gates

Graph signals participate in the existing `findingStability` gate as additional sub-checks:

```
findingStability.checks.graphEvidence = {
  pass: graphFindingConnectivity >= 0.90 AND graphIsolatedFindings == 0,
  detail: "Graph shows N/M findings connected with K isolated"
}
```

When `graphEvents` are absent (no graph data), the `graphEvidence` sub-check is omitted from the findingStability gate evaluation. The gate passes or fails based on existing sub-checks alone.

### Convergence Report Extension

When graph signals are available, the convergence report (Section 9) includes an additional block:

```
Graph Convergence Signals:
  graphDimensionCoverage:    0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  graphFindingConnectivity:  0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  graphRemediationRatio:     0.XX [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  graphIsolatedFindings:     N    [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
```

### Graceful Degradation

| Condition | Behavior |
|-----------|----------|
| No `graphEvents` in any iteration | Graph signals omitted from legal-stop evaluation |
| Fewer than 2 iterations with `graphEvents` | Graph signals marked `insufficient_data` |
| Graph has zero edges | `graphDimensionCoverage` = 0.0, sub-check skipped |

---

## OPTIMIZER-TUNABLE THRESHOLDS

The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.

### Tunable Fields (Optimizer-Managed)

| Field | Default | Range | Description |
|-------|---------|-------|-------------|
| `convergenceThreshold` | 0.10 | 0.01-0.20 | General convergence sensitivity |
| `stuckThreshold` | 2 | 1-5 | Consecutive no-progress iterations before recovery |
| `maxIterations` | 7 | 3-20 | Hard iteration ceiling |
| `compositeStopScore` | 0.60 | 0.40-0.80 | Weighted stop score needed before guard evaluation |

### Locked Fields (Not Optimizer-Tunable)

The following fields are runtime contracts and MUST NOT be modified by the optimizer:

- `stopReason` enum values and semantics
- `blocked_stop` event structure and gate names
- Lineage fields (`sessionId`, `lineageMode`, `generation`)
- Reducer configuration and file protection policies
- Review dimensions (`reviewDimensions`) and product mode (`mode`)

### Canonical Manifest

The authoritative registry of tunable vs locked fields is maintained at:
`.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
