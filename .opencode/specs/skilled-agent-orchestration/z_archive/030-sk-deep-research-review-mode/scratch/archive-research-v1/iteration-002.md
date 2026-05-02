# Iteration 2: Convergence Algorithm Adaptation for Review Mode (Shard 2 / Q2)

## Focus

How does the 3-signal composite convergence algorithm in sk-deep-research v1.1.0 adapt from "research exhaustion" (no new information) to "review exhaustion" (no new findings) for a review mode? This covers metric mapping, signal adaptation, quality guards, edge cases, stuck recovery, and complete pseudocode.

## Findings

### Part 1: Metric Mapping — newInfoRatio to newFindingsRatio

**Finding 1: Core metric reinterpretation**

In research mode, `newInfoRatio` measures how much genuinely novel information an iteration produces relative to prior iterations. In review mode, the analogous concept is `newFindingsRatio`: how many genuinely new quality findings (bugs, security issues, pattern violations) an iteration discovers relative to all findings already catalogued.

Formula (direct analog of research formula):

```
newFindingsRatio = (fully_new_findings + 0.5 * refinement_findings) / total_findings_this_iteration
```

Where:
- `fully_new_findings`: Issues at new file:line locations not previously reported
- `refinement_findings`: Severity upgrades/downgrades or additional evidence for known issues (count as 0.5)
- `total_findings_this_iteration`: All findings produced in this iteration (including re-discoveries)

If `total_findings_this_iteration == 0`, then `newFindingsRatio = 0.0` (clean pass).

[SOURCE: .opencode/skill/sk-deep-research/references/convergence.md:190-207 — original newInfoRatio definition]

**Finding 2: Severity-weighted variant (RECOMMENDED)**

A flat ratio treats a new P2 style nit the same as a new P0 security vulnerability. This is wrong for review convergence — discovering a P0 on iteration 5 should absolutely prevent convergence, even if the raw newFindingsRatio is low.

Severity-weighted formula:

```
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0, P3: 0.5 }

weightedNew = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
weightedTotal = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)

newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal
```

If `weightedTotal == 0`, then `newFindingsRatio = 0.0`.

**P0 override rule**: If ANY finding in this iteration is a new P0, set `newFindingsRatio = max(newFindingsRatio, 0.50)` regardless of calculation. Rationale: a single new P0 means convergence MUST NOT happen — the review is not exhaustive yet.

[INFERENCE: based on severity model in quick_reference.md:90-98 and convergence.md:190-207]

**Finding 3: Numerical examples**

Example A — First iteration on a new codebase (high ratio):
```
Findings: 3 P1 (all new), 5 P2 (all new), 2 P3 (all new)
weightedNew = 3*5 + 5*1 + 2*0.5 = 21.0
weightedTotal = 21.0
newFindingsRatio = 21.0 / 21.0 = 1.0
```

Example B — Middle iteration, some overlap:
```
Findings: 1 P1 (new), 2 P1 (re-discovered), 3 P2 (1 new, 2 re-discovered), 1 P2 (refinement/upgrade)
weightedNew = 1*5 + 1*1 = 6.0
weightedRefinement = 1*1*0.5 = 0.5
weightedTotal = 3*5 + 3*1 + 1*1 = 19.0
newFindingsRatio = 6.5 / 19.0 = 0.342
```

Example C — Late iteration, almost converged, then P0 found:
```
Findings: 0 new P1, 1 re-discovered P2, 1 NEW P0
weightedNew = 1*10 = 10.0
weightedTotal = 1*1 + 1*10 = 11.0
newFindingsRatio = 10.0 / 11.0 = 0.909
(P0 override would set floor at 0.50, but calculated is already higher)
```

Example D — Clean pass (no findings at all):
```
Findings: 0
weightedTotal = 0
newFindingsRatio = 0.0
```

### Part 2: Signal Adaptation

#### Signal A: Rolling Average — Adapted for newFindingsRatio

**Finding 4: Rolling average maps directly with one threshold adjustment**

The rolling average of the last N iterations' newFindingsRatio works identically to research mode. However, the window size and threshold should differ:

- **Window size**: 2 (not 3). Review dimensions are finite (typically 5-6). With 2 consecutive low-findings iterations, we have strong evidence of exhaustion. Research is open-ended and needs 3 to be confident.
- **Threshold**: 0.08 (not 0.05). Review findings are discrete and weighted — a threshold of 0.05 is too aggressive given severity weighting can produce small non-zero values from P3 refinements.
- **Min iterations**: 2 (not 3). Each review iteration covers a distinct dimension; 2 consecutive clean passes is meaningful.

```
function signalA_rollingAverage(evidenceIterations, config):
  WINDOW = config.reviewRollingWindow ?? 2
  MIN_ITERS = config.reviewRollingMinIters ?? 2
  THRESHOLD = config.reviewConvergenceThreshold ?? 0.08

  if len(evidenceIterations) < MIN_ITERS:
    return null  // insufficient data

  recent = evidenceIterations[-WINDOW:]
  avgNewFindings = mean(i.newFindingsRatio for i in recent)
  rollingStop = avgNewFindings < THRESHOLD

  return {
    name: "rollingAvg",
    value: avgNewFindings,
    stop: rollingStop,
    weight: 0.30
  }
```

[SOURCE: convergence.md:71-77 — original rolling average signal]

#### Signal B: MAD Noise Floor — Adapted with Caution

**Finding 5: MAD noise detection is less applicable to reviews, but still useful as an outlier guard**

In research, MAD detects when newInfoRatio has settled into statistical noise. This makes sense because research information yield is a continuous distribution across topics.

In review mode, newFindingsRatio has different statistical properties:
- Reviews are structured (finite dimensions), not open-ended
- Findings tend to cluster by dimension (security pass may find 0, correctness pass may find 5)
- The distribution is typically bimodal: high-finding dimensions vs clean dimensions

However, MAD still serves a valuable purpose: detecting whether the latest iteration's findings are statistically distinguishable from the noise floor of prior iterations. This prevents convergence based on a single anomalously clean iteration.

Adaptation:
- **Keep the signal** but adjust min iterations to 3 (not 4). Review sessions are shorter.
- **Scale factor**: Keep 1.4826 (normal distribution assumption is acceptable approximation)
- **Interpretation shift**: In research, "within noise" means "stop searching." In review, "within noise" means "this dimension's finding rate is consistent with background finding rate — no new category of issues being discovered."

```
function signalB_madNoiseFloor(evidenceIterations, config):
  MIN_ITERS = config.reviewMadMinIters ?? 3

  if len(evidenceIterations) < MIN_ITERS:
    return null  // insufficient data

  allRatios = [i.newFindingsRatio for i in evidenceIterations]
  med = median(allRatios)
  mad = median([abs(r - med) for r in allRatios])
  noiseFloor = mad * 1.4826
  latestRatio = evidenceIterations[-1].newFindingsRatio
  madStop = latestRatio <= noiseFloor

  return {
    name: "madScore",
    value: noiseFloor,
    stop: madStop,
    weight: 0.30  // reduced from 0.35 — see Finding 6
  }
```

[SOURCE: convergence.md:79-88 — original MAD signal]

**Finding 6: Weight redistribution for review mode**

In research mode, MAD and Entropy each get 0.35. For review mode, Dimension Coverage (Signal C) is more important than noise floor statistics because review has a well-defined finite scope. Recommended weights:

| Signal | Research Weight | Review Weight | Rationale |
|--------|----------------|---------------|-----------|
| Rolling Avg | 0.30 | 0.30 | Same importance — recent trend matters equally |
| MAD Noise | 0.35 | 0.25 | Less reliable for bimodal review data |
| Dimension Coverage | 0.35 | 0.45 | Most important — review has finite known scope |

[INFERENCE: based on finite-scope nature of review vs open-ended nature of research]

#### Signal C: Question Entropy to Dimension Coverage

**Finding 7: Question Entropy maps cleanly to Dimension Coverage**

In research, "questions" are the finite set of things to investigate. In review, "dimensions" are the finite set of quality aspects to check. The mapping is:

| Research Concept | Review Concept |
|-----------------|----------------|
| Key question | Review dimension |
| Question answered | Dimension reviewed with 0 new P0/P1 findings |
| 85% coverage threshold | 100% dimension coverage (see below) |

**Critical difference**: The threshold should be 1.0 (100%), not 0.85. In research, some questions may be genuinely unanswerable. In review, every dimension MUST be checked — skipping security review is never acceptable. However, the signal should still vote "stop" at high coverage to contribute partial weight to the composite vote.

Review dimensions (from @review agent quality rubric):
1. Correctness (30 pts)
2. Security (25 pts)
3. Patterns/Style (20 pts)
4. Maintainability (15 pts)
5. Performance (10 pts)
6. Spec Alignment (review-mode-specific: does code match spec?)
7. Cross-Reference Integrity (review-mode-specific: do specs reference real files?)

A dimension is "covered" when at least one iteration has explicitly focused on it AND produced either (a) findings that were catalogued, or (b) an explicit clean pass with evidence.

```
function signalC_dimensionCoverage(state, strategy):
  REQUIRED_DIMENSIONS = strategy.reviewDimensions  // e.g., 7
  coveredDimensions = 0

  for dim in strategy.reviewDimensions:
    iterationsCoveringDim = [i for i in state.iterations
                            if dim in i.reviewDimensions]
    if len(iterationsCoveringDim) > 0:
      coveredDimensions += 1

  if REQUIRED_DIMENSIONS == 0:
    return { name: "dimensionCoverage", value: 1.0, stop: true, weight: 0.45 }

  coverage = coveredDimensions / REQUIRED_DIMENSIONS
  coverageStop = coverage >= 1.0  // ALL dimensions must be covered

  return {
    name: "dimensionCoverage",
    value: coverage,
    stop: coverageStop,
    weight: 0.45
  }
```

[SOURCE: review.md:109-145 — quality rubric dimensions; convergence.md:90-97 — original entropy signal]

### Part 3: Quality Guards Adaptation

**Finding 8: Four quality guards for review mode**

#### Guard 1: Evidence Completeness (replaces Source Diversity)

Research guard: every answered question must cite >= 2 independent sources.
Review guard: every finding must cite file:line evidence.

```
function guardEvidenceCompleteness(findings):
  violations = []
  for f in findings:
    if not f.filePath or not f.lineNumber:
      violations.push({ guard: "evidence_completeness", finding: f.id,
                        reason: "Missing file:line citation" })
  return violations
```

Rationale: In research, source diversity prevents convergence on single-source claims. In review, the equivalent risk is vague findings without traceable evidence. The @review agent already requires file:line for P0 (code snippet + impact) and P1 (file:line + pattern reference).

[SOURCE: review.md:326-329 — evidence requirements by severity]

#### Guard 2: Scope Alignment (replaces Focus Alignment)

Research guard: answered questions must map to original key questions.
Review guard: findings must fall within the declared review scope.

```
function guardScopeAlignment(findings, reviewScope):
  violations = []
  for f in findings:
    if f.filePath not in reviewScope.files
       and not matchesGlob(f.filePath, reviewScope.patterns):
      violations.push({ guard: "scope_alignment", finding: f.id,
                        reason: "Finding outside review scope" })
  return violations
```

Rationale: Prevents scope creep where the review starts finding issues in unrelated code. Out-of-scope findings should be noted but not block convergence.

[SOURCE: convergence.md:118 — original focus alignment guard]

#### Guard 3: No Inference-Only Findings (replaces No Single-Weak-Source)

Research guard: no answered question can rely solely on one tentative source.
Review guard: no P0/P1 finding can be based solely on inference without code evidence.

```
function guardNoInferenceOnly(findings):
  violations = []
  for f in findings:
    if f.severity in ["P0", "P1"] and f.evidenceType == "inference":
      violations.push({ guard: "no_inference_only", finding: f.id,
                        reason: "P0/P1 finding based on inference alone" })
  return violations
```

Rationale: The @review agent's Hunter/Skeptic/Referee protocol already addresses phantom findings. This guard catches any that slip through by requiring concrete code evidence for blocking/required findings.

[SOURCE: review.md:357-385 — adversarial self-check protocol]

#### Guard 4: Severity Coverage (NEW — review-mode specific)

This guard ensures the review has checked areas where P0 issues typically occur (security, correctness) before allowing convergence.

```
P0_CRITICAL_DIMENSIONS = ["security", "correctness"]

function guardSeverityCoverage(state, strategy):
  violations = []
  for dim in P0_CRITICAL_DIMENSIONS:
    covered = any(dim in i.reviewDimensions for i in state.iterations)
    if not covered:
      violations.push({ guard: "severity_coverage", dimension: dim,
                        reason: "P0-critical dimension not yet reviewed" })
  return violations
```

Rationale: A review that converges without ever checking security is a false negative. This guard is the review-mode equivalent of "you cannot ship without a security scan."

[SOURCE: quick_reference.md:88-98 — P0 means "security vulnerability, data-loss risk"; review.md:130-134 — P0 = BLOCKER]

### Part 4: Edge Cases

**Finding 9: Clean codebase (0 findings, iteration 1)**

Scenario: The very first iteration reviews a dimension and finds zero issues.

Decision: **Continue, do not converge.**

Rationale:
- `newFindingsRatio = 0.0` (no findings at all)
- Rolling average has only 1 data point — below minimum iterations
- Dimension coverage is 1/7 = 0.14 — far below 1.0
- Severity coverage guard would block (security/correctness not yet checked)

The system naturally handles this: with only 1 iteration, only Signal C is active, and 14% coverage does not vote STOP. The clean pass for dimension 1 is recorded, and the next iteration moves to dimension 2.

If ALL dimensions return clean (0 findings across 7 iterations):
- Rolling average of last 2: 0.0 < 0.08 -> STOP vote
- MAD noise floor: 0.0 (all zeros) -> STOP vote
- Dimension coverage: 7/7 = 1.0 -> STOP vote
- Composite: 1.0 > 0.60 -> STOP
- Quality guards: all pass (no findings to validate, severity dims covered)
- Result: **Converge with "clean" status** — legitimate convergence on a clean codebase

[INFERENCE: based on convergence.md:50-53 (grac163-169) graceful degradation table]

**Finding 10: Huge scope (100+ files)**

Risk: With many files, each dimension could take multiple iterations, leading to 35+ iterations (7 dims x 5 passes each).

Mitigation strategies:
1. **Scope partitioning at config level**: `maxFilesPerIteration: 20` — each iteration reviews a subset
2. **Dimension batching**: Allow one iteration to cover 2-3 related dimensions (e.g., "correctness + performance" in one pass) when file count is high
3. **Hard cap still applies**: `maxIterations` (default 10) prevents infinite loops regardless. The review converges with documented gaps rather than running forever.
4. **Incremental scoping**: If iteration 1-3 find P0s in a subset of files, narrow subsequent iterations to the problematic area rather than re-scanning clean files.

```
// In config:
{
  "reviewScope": {
    "maxFilesPerIteration": 20,
    "allowDimensionBatching": true,   // combine dimensions when scope > 50 files
    "batchThreshold": 50              // file count above which batching activates
  }
}
```

[INFERENCE: based on maxIterations hard stop in convergence.md:32-33]

**Finding 11: Mixed results (some dimensions clean, some broken)**

Scenario: Security passes clean, but correctness finds 5 P1s across 3 iterations, while patterns finds 2 P1s.

The system handles this naturally:
- Dimension coverage reaches 100% once all dimensions have been visited
- But newFindingsRatio stays elevated if correctness keeps producing new findings
- Rolling average tracks the trend — if the last 2 correctness-focused iterations still find new P1s, the average stays above threshold
- Convergence happens only when ALL signals agree: no new findings AND all dimensions covered

Key insight: "mixed" results are the normal case. The system should NOT converge until the problematic dimensions stabilize (stop producing new findings on re-pass).

[INFERENCE: based on composite vote mechanism in convergence.md:99-107]

**Finding 12: False convergence — missed issues from narrow dimension focus**

Risk: An iteration focusing on "security" might miss a security-adjacent correctness issue (e.g., a logic error that creates a data exposure path). If each dimension is reviewed in isolation, cross-cutting concerns fall through cracks.

Mitigations:
1. **Cross-reference iteration**: After all dimensions are covered, run one "cross-cutting" iteration that looks for issues spanning multiple dimensions
2. **Dimension overlap declaration**: Each finding tags ALL applicable dimensions, not just the primary focus dimension. A "correctness" finding that has security implications tags both.
3. **Quality guard extension**: Add optional "cross-dimension" guard that requires at least one iteration with `reviewDimensions.length >= 2`

```
function guardCrossReference(state):
  crossIterations = [i for i in state.iterations
                     if len(i.reviewDimensions) >= 2]
  if len(crossIterations) == 0 and len(state.iterations) >= 5:
    return [{ guard: "cross_reference", reason: "No cross-dimension review performed" }]
  return []
```

[INFERENCE: based on review-mode spec strategy.md:7 — "cross-references to find misalignments"]

### Part 5: Stuck Recovery for Review

**Finding 13: "Stuck" in review context**

In research, "stuck" means consecutive iterations produce no new information. In review, "stuck" means:

1. **Repetitive findings**: Same issues rediscovered across iterations without new findings (newFindingsRatio < threshold for N consecutive iterations)
2. **Dimension deadlock**: A dimension cannot be reviewed because required context (specs, tests) is missing
3. **Scope oscillation**: Review keeps switching between dimensions without completing any

Detection (reuses existing stuckCount logic with threshold 2, not 3):

```
function countConsecutiveStuck_review(iterations, config):
  count = 0
  THRESHOLD = config.reviewConvergenceThreshold ?? 0.08

  for i in reversed(iterations):
    if i.status == "thought":
      continue
    if i.status == "insight":
      break  // severity upgrade/downgrade counts as progress
    if i.newFindingsRatio < THRESHOLD or i.status == "stuck":
      count += 1
    else:
      break
  return count
```

Stuck threshold for review: 2 (not 3). Review dimensions are finite, so 2 consecutive unproductive iterations is a stronger signal than in open-ended research.

[SOURCE: convergence.md:214-229 — original stuckCount computation]

**Finding 14: Recovery strategies adapted for review**

| Strategy | Research Analog | Review Adaptation |
|----------|----------------|-------------------|
| Try Opposites | Search for NOT-X | Change review lens: if stuck on "correctness at function level," zoom to "correctness at integration boundary" |
| Combine Prior Findings | Synthesize top-2 iterations | Cross-reference findings from 2 dimensions: "Do the P1 correctness issues interact with the P2 pattern violations?" |
| Audit Low-Value | Re-read low-ratio iterations | Re-examine clean-pass dimensions with a different focus: "Security passed clean, but did we check auth boundaries or just input validation?" |
| Change Granularity (NEW) | N/A | If file-level review is stuck, shift to function-level or module-level |
| Escalate Severity (NEW) | N/A | Re-examine P2 findings to check if any should be P1 given surrounding context |

```
function selectRecoveryStrategy_review(stuckIterations, allIterations, strategy):
  lastDimensions = [i.reviewDimensions[0] for i in stuckIterations[-2:]]

  // Same dimension stuck? Change lens/granularity
  if len(set(lastDimensions)) <= 1:
    return { strategy: "change_granularity",
             prompt: "Review the same dimension at a different granularity level" }

  // Different dimensions, both clean? Cross-reference
  if all(i.newFindingsRatio < 0.08 for i in stuckIterations[-2:]):
    return { strategy: "cross_reference",
             prompt: "Cross-reference findings across dimensions for emergent issues" }

  // Default: escalate severity review
  return { strategy: "escalate_severity",
           prompt: "Re-examine P2/P3 findings for potential severity upgrade" }
```

[SOURCE: convergence.md:369-414 — original recovery strategy selection]

### Part 6: Complete shouldContinue() Pseudocode for Review Mode

**Finding 15: Full adapted algorithm**

```
function shouldContinue_review(state, config, strategy):
  iterations = state.iterations

  // ═══════════════════════════════════════════
  // HARD STOPS (checked first, always apply)
  // ═══════════════════════════════════════════

  // Hard stop: max iterations
  if len(iterations) >= config.maxIterations:
    return { action: "STOP", reason: "max_iterations_reached" }

  // Hard stop: all dimensions covered AND no open P0/P1
  openBlockers = [f for f in state.allFindings if f.severity in ["P0", "P1"] and not f.resolved]
  allDimsCovered = allDimensionsCovered(state, strategy)
  if allDimsCovered and len(openBlockers) == 0:
    return { action: "STOP", reason: "all_dimensions_clean" }

  // ═══════════════════════════════════════════
  // STUCK DETECTION
  // ═══════════════════════════════════════════

  stuckCount = countConsecutiveStuck_review(iterations, config)
  STUCK_THRESHOLD = config.reviewStuckThreshold ?? 2
  if stuckCount >= STUCK_THRESHOLD:
    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }

  // ═══════════════════════════════════════════
  // COMPOSITE CONVERGENCE (3-Signal Weighted Vote)
  // ═══════════════════════════════════════════

  // Filter: exclude "thought" iterations from convergence signals
  evidenceIterations = [i for i in iterations if i.status != "thought"]

  signals = []
  totalWeight = 0
  CONVERGENCE_THRESHOLD = config.reviewConvergenceThreshold ?? 0.08

  // ─── Signal A: Rolling average of last 2 newFindingsRatios ───
  ROLLING_WINDOW = config.reviewRollingWindow ?? 2
  ROLLING_MIN = config.reviewRollingMinIters ?? 2
  if len(evidenceIterations) >= ROLLING_MIN:
    recent = evidenceIterations[-ROLLING_WINDOW:]
    avgNewFindings = mean(i.newFindingsRatio for i in recent)
    rollingStop = avgNewFindings < CONVERGENCE_THRESHOLD
    signals.push({ name: "rollingAvg", value: avgNewFindings,
                   stop: rollingStop, weight: 0.30 })
    totalWeight += 0.30

  // ─── Signal B: MAD noise floor ───
  MAD_MIN = config.reviewMadMinIters ?? 3
  if len(evidenceIterations) >= MAD_MIN:
    allRatios = [i.newFindingsRatio for i in evidenceIterations]
    med = median(allRatios)
    mad = median([abs(r - med) for r in allRatios])
    noiseFloor = mad * 1.4826
    latestRatio = evidenceIterations[-1].newFindingsRatio
    madStop = latestRatio <= noiseFloor
    signals.push({ name: "madScore", value: noiseFloor,
                   stop: madStop, weight: 0.25 })
    totalWeight += 0.25

  // ─── Signal C: Dimension coverage ───
  coveredDims = countCoveredDimensions(state, strategy)
  totalDims = len(strategy.reviewDimensions)
  if totalDims > 0:
    coverage = coveredDims / totalDims
    coverageStop = coverage >= 1.0
    signals.push({ name: "dimensionCoverage", value: coverage,
                   stop: coverageStop, weight: 0.45 })
    totalWeight += 0.45

  // ─── Compute weighted stop score ───
  if totalWeight > 0:
    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight

    if stopScore > 0.60:
      // ═══════════════════════════════════════════
      // QUALITY GUARDS (must pass before STOP)
      // ═══════════════════════════════════════════
      guardResult = checkReviewQualityGuards(state, strategy)
      if not guardResult.passed:
        // Override STOP to CONTINUE
        for v in guardResult.violations:
          appendToJSONL({ type: "event", event: "guard_violation", ...v })
        return { action: "CONTINUE", reason: "guard_violation",
                 violations: guardResult.violations, stopScore, signals }

      return { action: "STOP", reason: "composite_converged",
               stopScore, signals }

  // ═══════════════════════════════════════════
  // DEFAULT: CONTINUE
  // ═══════════════════════════════════════════
  return { action: "CONTINUE", uncoveredDimensions: totalDims - coveredDims,
           signals }


// ─── Quality Guards ───
function checkReviewQualityGuards(state, strategy):
  violations = []

  // Guard 1: Evidence completeness
  for f in state.allFindings:
    if not f.filePath or not f.lineNumber:
      violations.push({ guard: "evidence_completeness", finding: f.id })

  // Guard 2: Scope alignment
  for f in state.allFindings:
    if not inScope(f.filePath, strategy.reviewScope):
      violations.push({ guard: "scope_alignment", finding: f.id })

  // Guard 3: No inference-only P0/P1
  for f in state.allFindings:
    if f.severity in ["P0", "P1"] and f.evidenceType == "inference":
      violations.push({ guard: "no_inference_only", finding: f.id })

  // Guard 4: Severity coverage (P0-critical dimensions checked)
  for dim in ["security", "correctness"]:
    if not any(dim in i.reviewDimensions for i in state.iterations):
      violations.push({ guard: "severity_coverage", dimension: dim })

  // Guard 5 (optional): Cross-reference check
  if len(state.iterations) >= 5:
    crossIters = [i for i in state.iterations if len(i.reviewDimensions) >= 2]
    if len(crossIters) == 0:
      violations.push({ guard: "cross_reference",
                         reason: "No cross-dimension review performed" })

  return { passed: len(violations) == 0, violations }


// ─── Helper: Dimension Coverage ───
function countCoveredDimensions(state, strategy):
  covered = 0
  for dim in strategy.reviewDimensions:
    dimIters = [i for i in state.iterations if dim in i.reviewDimensions]
    if len(dimIters) > 0:
      covered += 1
  return covered


// ─── Helper: All Dimensions Covered ───
function allDimensionsCovered(state, strategy):
  return countCoveredDimensions(state, strategy) == len(strategy.reviewDimensions)
```

### Part 7: Ruled Out Approaches

**Finding 16: Approaches considered and rejected**

| Approach | Reasoning for Rejection |
|----------|------------------------|
| **Drop MAD signal entirely** | Considered because review data is bimodal. Rejected because MAD still provides value as a noise/outlier guard even with non-normal distributions. Reducing weight (0.35 -> 0.25) is sufficient. |
| **Use question entropy unchanged** | Considered because it would be simpler. Rejected because research "questions" are open-ended while review "dimensions" are closed/finite. A dimension-coverage model with 100% threshold is semantically more correct than an 85% question-answer model. |
| **Flat newFindingsRatio without severity weights** | Considered for simplicity. Rejected because it creates a critical safety gap: a review could converge while missing a single P0 discovered late. The P0 override rule is essential for safety. |
| **Separate convergence algorithm (no reuse)** | Considered writing review convergence from scratch. Rejected because 80%+ of the algorithm structure (hard stops, composite vote, quality guards, stuck recovery) maps cleanly. The adaptations are parameter changes and semantic reinterpretations, not structural rewrites. |
| **100% rolling average threshold** | Considered requiring newFindingsRatio = 0.0 for convergence. Rejected because refinement findings (severity adjustments) produce small non-zero ratios that are normal review activity, not indicators of new issues. A threshold of 0.08 captures this nuance. |
| **Per-dimension convergence** | Considered running separate convergence per review dimension. Rejected because it adds excessive complexity (7 parallel convergence trackers) with minimal benefit. The single composite vote with dimension coverage as a weighted signal achieves the same outcome more simply. |
| **Removing quality guards for clean codebases** | Considered bypassing guards when all iterations find 0 issues. Rejected because guards serve a different purpose in review: they verify the review WAS thorough (severity coverage), not just that findings are well-sourced. A clean codebase still needs severity dimension coverage. |

## Sources Consulted

- `.opencode/skill/sk-deep-research/references/convergence.md` — Full convergence algorithm (618 lines)
- `.opencode/skill/sk-code-review/SKILL.md` — Review skill: severity model, phase flow, overlay contract
- `.claude/agents/review.md` — Review agent: quality rubric (5 dimensions, 100pts), P0/P1/P2 classification, adversarial self-check
- `.opencode/skill/sk-code-review/references/quick_reference.md` — Severity model (P0-P3), review flow, output checklist

## Assessment

- New information ratio: 1.0 (first iteration on this topic, all findings are new)
- Questions addressed: [Q2]
- Questions answered: [Q2 — comprehensive treatment of convergence adaptation for review mode]

## Reflection

- What worked and why: Direct structural comparison between research and review convergence, walking through each signal/guard and asking "what is the semantic equivalent in review context?" This systematic mapping prevented both over-engineering (separate algorithm) and under-engineering (unchanged reuse).
- What did not work and why: N/A (first iteration)
- What I would do differently: Could have also examined real-world examples of prior deep-research convergence runs to validate threshold choices empirically.

## Recommended Next Focus

Validate the proposed thresholds (0.08 convergence, window=2, stuck=2) against actual deep-research run data from prior specs. The thresholds in this analysis are reasoned but not empirically validated.
