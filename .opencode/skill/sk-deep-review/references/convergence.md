---
title: Deep Review Convergence
description: Stop condition algorithms, quality guards, and recovery strategies for the autonomous deep review loop.
---

# Deep Review Convergence

Stop condition algorithms, quality guards, and stuck recovery for the deep review loop.

---

<!-- ANCHOR:overview -->
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

### Decision Priority

Checks are evaluated in this order (first match wins):

1. **Max iterations** -- hard cap, always checked first.
2. **All dimensions covered + clean** -- all 4 dimensions covered, no active P0/P1, stabilization passed, gates passed.
3. **Stuck detection** -- 2+ consecutive no-progress iterations.
4. **Composite convergence** -- 3-signal weighted vote with threshold 0.60.
5. **Quality guards** -- binary checks; if composite says STOP but guards fail, override to CONTINUE.
6. **Default CONTINUE** -- none of the above triggered.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:hard-stops -->
## 2. HARD STOPS

Hard stops are evaluated first and override all other signals.

### Max Iterations Reached

```
if len(iterations) >= config.maxIterations:       // default 7
  return { action: "STOP", reason: "max_iterations_reached" }
```

The loop stops unconditionally. Synthesis runs with whatever findings exist.

### All Dimensions Covered with Stabilization

```
if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
  if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
    if checkReviewQualityGates(state, config, coverage).passed:
      return { action: "STOP", reason: "all_dimensions_clean" }
```

Triggers when all 4 dimensions (correctness, security, traceability, maintainability) are covered, no active P0/P1 remains, at least 1 stabilization pass has occurred, and all 3 quality gates pass. If gates fail, the loop continues despite full coverage.

---

<!-- /ANCHOR:hard-stops -->
<!-- ANCHOR:stuck-detection -->
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

---

<!-- /ANCHOR:stuck-detection -->
<!-- ANCHOR:composite-convergence -->
## 4. COMPOSITE CONVERGENCE

Three independent signals each cast a stop/continue vote. Stop when the weighted stop-score meets or exceeds the consensus threshold.

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 2 | Recent severity-weighted finding yield |
| MAD Noise Floor | 0.25 | 3 | Signal vs noise in newFindingsRatio |
| Dimension Coverage | 0.45 | 1 | Dimension completion + protocol coverage stability |

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

Highest-weight signal. Votes STOP only when all three conditions are true: full dimension coverage (1.0), required traceability protocols covered, and at least 1 stabilization pass.

```
coverageStop = (
  coverage.dimensionCoverage == 1.0 and
  coverage.requiredProtocolsCovered and
  stabilizationPasses >= 1
)
```

### Weighted Vote

```
stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
if stopScore >= 0.60:   // proceed to quality gate evaluation
```

Weights are redistributed across active signals only. If only 2 signals have enough data, their weights are normalized to sum to 1.0.

### Graceful Degradation

| Iterations Completed | Active Signals | Behavior |
|---------------------|----------------|----------|
| 1 | Coverage only (weight 1.0) | Very unlikely to stop (needs full coverage + stabilization) |
| 2 | Rolling avg + coverage | Two-signal vote, reweighted |
| 3+ | All three signals | Full composite, most reliable |

---

<!-- /ANCHOR:composite-convergence -->
<!-- ANCHOR:severity-weighted-ratio -->
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

<!-- /ANCHOR:severity-weighted-ratio -->
<!-- ANCHOR:quality-guards -->
## 6. QUALITY GUARDS

Three binary gates must ALL pass before a STOP decision is finalized. If any gate fails, the STOP is overridden to CONTINUE and violations are logged to JSONL.

| Gate | Rule | Fail Action |
|------|------|-------------|
| **Evidence** | Every active finding has concrete `file:line` evidence; no inference-only findings | Block STOP, log `guard_violation` |
| **Scope** | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation` |
| **Coverage** | All configured dimensions + required traceability protocols covered | Block STOP, log `guard_violation` |

### Gate Evaluation

```
function checkReviewQualityGates(state, config, coverage):
  violations = []

  // Evidence gate
  for f in state.findings where f.status == "active":
    if not f.hasFileLineCitation or f.evidenceType == "inference-only":
      violations.push({ gate: "evidence", findingId: f.id })

  // Scope gate
  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
  for f in state.findings where f.status == "active":
    if f.filePath not in reviewScope:
      violations.push({ gate: "scope", findingId: f.id })

  // Coverage gate
  if coverage.dimensionCoverage < 1.0:
    violations.push({ gate: "coverage", detail: "dimensions incomplete" })
  if not coverage.requiredProtocolsCovered:
    violations.push({ gate: "coverage", detail: "protocols incomplete" })

  if len(violations) > 0:
    return { passed: false, violations }
  return { passed: true }
```

When composite convergence returns STOP, invoke `checkReviewQualityGates()`. If it returns `passed: false`, override the action to CONTINUE and log each violation as a `guard_violation` event in JSONL. The orchestrator targets the violated areas in the next iteration.

---

<!-- /ANCHOR:quality-guards -->
<!-- ANCHOR:provisional-verdict -->
## 7. PROVISIONAL VERDICT

The provisional verdict is determined from active findings at the time the loop stops. It appears in both the convergence report and the final `review-report.md`.

| Verdict | Condition | Meaning |
|---------|-----------|---------|
| **FAIL** | `activeP0 > 0` OR any quality gate fails | Does not meet quality standards. Blocks release. |
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

<!-- /ANCHOR:provisional-verdict -->
<!-- ANCHOR:recovery-strategies -->
## 8. RECOVERY STRATEGIES

When stuck detection triggers (`stuckCount >= stuckThreshold`), the orchestrator selects a targeted recovery strategy before deciding whether to continue or exit to synthesis.

### Failure Modes

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension with ratios `< 0.05` | **Change granularity:** zoom into functions if reviewing at file level, or zoom out to module level if reviewing functions |
| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
| Low-value advisory churn | Last 2 iterations found only P2 findings | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |

### Selection Logic

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]

  if len(set(lastFocuses)) <= 1:                           // same dimension stuck
    return { strategy: "change_granularity", dimension: lastFocuses[0] }
  if hasRequiredProtocolPlateau(state.traceabilityChecks):  // protocols incomplete
    return { strategy: "protocol_first_replay" }
  return { strategy: "escalate_severity_review" }           // default
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

<!-- /ANCHOR:recovery-strategies -->
<!-- ANCHOR:convergence-report -->
## 9. CONVERGENCE REPORT

When the loop stops, the orchestrator generates a convergence report embedded in `review-report.md` and appended to the JSONL state file.

### Report Format

```
CONVERGENCE REPORT
------------------
Stop reason: [composite_converged | max_iterations | all_dimensions_clean | stuck_unrecoverable]
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
  Signal 3 - Dimension Coverage (w=0.45): 0.XX [STOP|CONTINUE] (stabilization: N)

Quality gates:
  Evidence: [PASS | FAIL (N violations)]
  Scope:    [PASS | FAIL (N violations)]
  Coverage: [PASS | FAIL (N violations)]

Stuck recovery attempts: N (recovered: N, failed: N)
```

### JSONL Synthesis Event

```json
{
  "type": "event",
  "event": "synthesis",
  "stopReason": "composite_converged",
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
    { "name": "dimensionCoverage", "value": 1.0, "stop": true, "weight": 0.45 }
  ],
  "gatesPassed": true,
  "stuckRecoveryAttempts": 0
}
```

---

<!-- /ANCHOR:convergence-report -->
