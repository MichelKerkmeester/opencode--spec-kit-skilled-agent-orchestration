---
title: Convergence Detection Reference
description: Algorithms and protocols for determining when the deep research loop should stop.
---

# Convergence Detection Reference

Algorithms and protocols for determining when the deep research loop should stop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:shouldcontinue-algorithm -->
## 2. THE shouldContinue() ALGORITHM

> **Segment Awareness (REFERENCE-ONLY)**: When segments are explicitly enabled, `state.iterations` may be pre-filtered to the current segment. The live workflow uses a single segment by default.

### 2.1 Hard Stops (checked first, always apply)

```
function shouldContinue(state, config):
  iterations = state.iterations  // single live segment; optional segment filtering is reference-only

  // Hard stop: max iterations
  if len(iterations) >= config.maxIterations:
    return { action: "STOP", reason: "max_iterations_reached" }

  // Hard stop: all questions answered
  unanswered = countUnanswered(state.strategy.keyQuestions)
  if unanswered == 0:
    return { action: "STOP", reason: "all_questions_answered" }
```

### 2.2 Stuck Detection

```
  // Stuck detection: consecutive no-progress
  stuckCount = countConsecutiveStuck(iterations)
  if stuckCount >= config.stuckThreshold:
    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }
```

### 2.3 Composite Convergence (3-Signal Weighted Vote)

Three independent signals each cast a stop/continue vote. Stop when weighted stop-score exceeds the consensus threshold.

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 3 | Recent information yield |
| MAD Noise Floor | 0.35 | 4 | Signal vs noise in newInfoRatio |
| Question Entropy | 0.35 | 1 | Coverage of research questions |

```
  // Filter: exclude "thought" iterations from convergence signals
  // Thought iterations (analytical-only, no evidence) should not affect
  // rolling average, MAD noise floor, or stuck detection.
  // Insight iterations ARE included — they have low ratios but are not stuck.
  evidenceIterations = [i for i in iterations if i.status != "thought"]

  // Composite convergence: 3-signal weighted vote
  signals = []
  totalWeight = 0

  // Signal 1: Rolling average of last N newInfoRatios (excludes thought)
  if len(evidenceIterations) >= 3:
    recent = evidenceIterations[-3:]
    avgNewInfo = mean(i.newInfoRatio for i in recent)
    rollingStop = avgNewInfo < config.convergenceThreshold
    signals.push({ name: "rollingAvg", value: avgNewInfo, stop: rollingStop, weight: 0.30 })
    totalWeight += 0.30

  // Signal 2: MAD noise floor (needs 4+ data points, excludes thought)
  if len(evidenceIterations) >= 4:
    allRatios = [i.newInfoRatio for i in evidenceIterations]
    med = median(allRatios)
    mad = median([abs(r - med) for r in allRatios])
    noiseFloor = mad * 1.4826  // consistent estimator for normal distribution
    latestRatio = iterations[-1].newInfoRatio
    madStop = latestRatio <= noiseFloor
    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.35 })
    totalWeight += 0.35

  // Signal 3: Question entropy coverage
  answered = countAnswered(state.strategy.keyQuestions)
  total = countTotal(state.strategy.keyQuestions)
  if total > 0:
    coverage = answered / total
    entropyStop = coverage >= 0.85  // 85%+ questions answered signals saturation
    signals.push({ name: "entropyCoverage", value: coverage, stop: entropyStop, weight: 0.35 })
    totalWeight += 0.35

  // Compute weighted stop score
  if totalWeight > 0:
    // Redistribute weights to active signals
    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
    if stopScore > 0.60:
      return { action: "STOP", reason: "composite_converged", stopScore, signals }

  // Default: continue
  return { action: "CONTINUE", unansweredCount: unanswered, signals }
```

### 2.4 Quality Guard Protocol

After composite convergence votes STOP but before the decision is finalized, three binary guards must pass. If any guard fails, the STOP is overridden to CONTINUE and violations are logged.

| Guard | Rule | Fail Action |
|-------|------|-------------|
| Source Diversity | Every answered question must cite >= 2 independent sources | Block STOP, log `guard_violation` |
| Focus Alignment | Answered questions must map to original key questions from initialization | Block STOP, log `guard_violation` |
| No Single-Weak-Source | No answered question can rely solely on one source with `sourceStrength == "tentative"` | Block STOP, log `guard_violation` |

**Checks:**

- **Source Diversity**: For each question marked answered in strategy.md, count distinct sources from iteration JSONL records. Require >= 2.
- **Focus Alignment**: Compare answered question labels against the initial key questions stored in strategy.md at initialization. Flag any answered question not in the original set.
- **No Single-Weak-Source**: For questions answered by exactly one source, verify that source's strength is not `"tentative"`.

```
function checkQualityGuards(state, strategy):
  violations = []
  for q in strategy.answeredQuestions:
    sources = collectSources(state.iterations, q)
    if len(sources) < 2:
      violations.push({ guard: "source_diversity", question: q })
    if q not in strategy.originalKeyQuestions:
      violations.push({ guard: "focus_alignment", question: q })
    if len(sources) == 1 and sources[0].strength == "tentative":
      violations.push({ guard: "single_weak_source", question: q })

  if len(violations) > 0:
    for v in violations:
      appendToJSONL({ type: "event", event: "guard_violation", ...v })
    return { passed: false, violations }
  return { passed: true }
```

When the composite convergence returns STOP, invoke `checkQualityGuards()`. If it returns `passed: false`, override the action to CONTINUE and resume the loop. The orchestrator should target the violated questions in the next iteration's focus area.

### Dead-End Coverage Signal (REFERENCE-ONLY)

> **This section is REFERENCE-ONLY** — not part of the live algorithm. Included for future implementation consideration.

When the proportion of identified approaches that have been either validated or eliminated reaches a high threshold, this could serve as an additional convergence signal indicating the research space has been thoroughly explored.

```
deadEndCoverage = (validated + eliminated) / totalIdentifiedApproaches
```

- `validated`: approaches that produced confirmed, well-sourced findings
- `eliminated`: approaches explicitly marked as exhausted or fruitless
- `totalIdentifiedApproaches`: all approaches recorded in strategy.md

A threshold of 0.80 would mean 80% of known avenues have been resolved one way or another. This signal could complement the existing composite vote but is not currently wired into `shouldContinue()`.

### Graceful Degradation

| Iterations Completed | Active Signals | Behavior |
|--------------------|----------------|----------|
| 1-2 | Entropy only (weight 1.0) | Very unlikely to stop (need 85%+ coverage) |
| 3 | Rolling avg + entropy | Two-signal vote, reweighted |
| 4+ | All three signals | Full composite, most reliable |

### Decision Priority

Checks are evaluated in this order (first match wins):

1. **Max iterations** (hard cap, always checked first)
2. **All questions answered** (hard stop)
3. **Stuck detection** (3+ consecutive no-progress)
4. **Composite convergence** (3-signal weighted vote, threshold 0.60)
4.5. **Quality guards** (binary checks — if composite says STOP but guards fail, override to CONTINUE)
5. **Default continue** (none of the above triggered)

---

<!-- /ANCHOR:shouldcontinue-algorithm -->
<!-- ANCHOR:signal-definitions -->
## 3. SIGNAL DEFINITIONS

### newInfoRatio (0.0 to 1.0)

Assessed by the @deep-research agent at the end of each iteration.

| Value | Meaning | Example |
|-------|---------|---------|
| 1.0 | All findings are new | First iteration on a new topic |
| 0.7-0.9 | Most findings are new | Second iteration discovering new sub-topics |
| 0.3-0.6 | Mix of new and redundant | Middle iterations with partial overlap |
| 0.1-0.2 | Mostly redundant | Deep iterations finding diminishing returns |
| 0.0 | No new information | Complete overlap with prior findings |

### Assessment Guidelines for the Agent

When computing newInfoRatio, consider:
- **New finding**: Information not present in prior iteration files or strategy.md
- **Redundant finding**: Restates or confirms what a prior iteration already documented
- **Partially new**: Adds nuance to a known finding (count as 0.5 new)

Formula: `newInfoRatio = (fully_new + 0.5 * partially_new) / total_findings`

### stuckCount

Computed by the orchestrator from JSONL records.

```
function countConsecutiveStuck(iterations):
  count = 0
  for i in reversed(iterations):
    // Skip thought iterations — they don't produce evidence, so they
    // should neither increment nor reset the stuck counter
    if i.status == "thought":
      continue
    // Insight iterations have low ratios but represent genuine progress —
    // they reset the stuck counter rather than incrementing it
    if i.status == "insight":
      break
    if i.newInfoRatio < config.convergenceThreshold or i.status == "stuck":
      count += 1
    else:
      break
  return count
```

A stuck iteration is one where:
- `newInfoRatio < config.convergenceThreshold` (below the configured no-progress threshold)
- OR `status == "stuck"` (agent self-reported as stuck)

**Status exclusions:**
- `insight`: Resets stuck counter (conceptual breakthrough counts as progress even with low ratio)
- `thought`: Skipped entirely (analytical iterations don't produce evidence to measure)

### MAD Noise Score

Computed by the orchestrator from all historical newInfoRatio values.

```
function computeMAD(iterations):
  ratios = [i.newInfoRatio for i in iterations]
  med = median(ratios)
  deviations = [abs(r - med) for r in ratios]
  mad = median(deviations)
  return mad * 1.4826  // scale factor for normal distribution consistency
```

The MAD noise floor represents the minimum change needed to distinguish signal from noise. When the latest newInfoRatio falls at or below the noise floor, the MAD signal votes "stop".

- Requires 4+ iterations (insufficient data before that)
- Scale factor 1.4826 converts MAD to an estimator of standard deviation
- A ratio AT the noise floor means the iteration's contribution is indistinguishable from random variation

### Question Entropy Coverage

Computed from strategy.md's question state.

```
function computeEntropyCoverage(strategy):
  answered = count(q for q in strategy.keyQuestions if q.answered)
  total = len(strategy.keyQuestions)
  if total == 0: return 1.0  // no questions = fully covered
  return answered / total
```

| Coverage | Meaning | Stop Vote |
|----------|---------|-----------|
| 0.0-0.50 | Less than half answered | Continue |
| 0.51-0.84 | Most answered, gaps remain | Continue |
| 0.85-1.0 | Near-complete or complete | Stop |

The 0.85 threshold accounts for questions that may be unanswerable or out of scope. Research that has answered 85%+ of its questions is likely saturated.

> **Source-Hygiene Note:** Tentative findings (`sourceStrength == "tentative"`) do not count toward answered-question coverage unless confirmed by an independent source in a later iteration. When computing `answered / total`, exclude any question whose only supporting evidence has tentative strength. This prevents premature convergence based on unverified or low-confidence information.

### Reading JSONL State (Fault-Tolerant)

When reading `deep-research-state.jsonl`, parse defensively:

1. Read file line by line
2. Wrap each line parse in try/catch
3. On parse failure: skip the line, increment `skippedCount`
4. For successfully parsed lines, apply defaults for missing fields:
   - `status ?? "complete"`
   - `newInfoRatio ?? 0.0`
   - `findingsCount ?? 0`
   - `focus ?? "unknown"`
   - `keyQuestions ?? []`
5. After all lines: if `skippedCount > 0`, log warning:
   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
6. Proceed with valid entries only

This ensures convergence checks continue even after partial state corruption. See state_format.md Section 3 for the full fault tolerance specification.

### Segment Model (REFERENCE-ONLY)

Segments partition a research session into logical phases without losing history when an implementation explicitly enables them.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| segment (on iteration records) | number | 1 | Segment this iteration belongs to |
| segment_start (event type) | event | -- | Marks the start of a new segment |

When computing convergence signals:
- Filter iterations by `segment === currentSegment`
- Hard stops (max iterations) count ALL iterations regardless of segment
- Cross-segment analysis: read full JSONL without segment filtering

Segment transitions are triggered only when a runtime explicitly enables them:
- `:restart` mode in an implementation that supports it
- Explicit user request for a new research angle
- Orchestrator judgment when research direction fundamentally shifts

See state_format.md Section 3 for JSONL schema details.

---

<!-- /ANCHOR:signal-definitions -->
<!-- ANCHOR:stuck-recovery-protocol -->
## 4. STUCK RECOVERY PROTOCOL

When `stuckCount >= stuckThreshold` (default 3):

### Step 1: Analyze Why
Read strategy.md to understand:
- What approaches have been exhausted?
- What questions remain unanswered?
- What has NOT been tried?

### Step 1.5: Classify Failure Mode

Before widening focus, diagnose the specific failure pattern to select a targeted recovery prompt.

| Failure Mode | Detection | Recovery Prompt |
|-------------|-----------|----------------|
| Shallow sources | Last N iterations all have <= 1 source per finding | "Seek authoritative primary sources: official docs, academic papers, original implementations" |
| Contradictory evidence | Strategy shows conflicting findings on same question | "Isolate the contradiction. Find a tiebreaker source or document both positions with evidence quality" |
| Topic too broad | Focus area unchanged for 3+ iterations with declining ratio | "Decompose into 2-3 sub-questions. Pick the most specific one" |
| Repetitive findings | Last 2 iterations have > 70% overlap in source URLs | "Shift to a fundamentally different source domain: if using web, try code; if using docs, try forums" |
| Source exhaustion | All known source types consulted, no new sources found | "Declare ceiling. Document what is known and what remains unknowable from available sources" |

Integrate failure classification into the selection logic (Step 2a) by checking these patterns before choosing a recovery strategy. If a failure mode is detected, prepend the corresponding recovery prompt to the dispatch message.

### Step 2: Widen Focus
Modify the dispatch prompt to the agent:
```
RECOVERY MODE: The last {stuckCount} iterations found no new information.

Previous approaches that are exhausted:
{strategy.exhaustedApproaches}

You MUST try a fundamentally different approach:
- If prior iterations used web research, try codebase analysis
- If prior iterations searched for X, search for related concept Y
- If prior iterations focused narrowly, broaden the scope
- If prior iterations were broad, narrow to a specific sub-question

Focus on: {leastExploredQuestion}
```

### Step 2a: Select Recovery Strategy

Choose a targeted recovery strategy based on the nature of the stuck condition:

#### Strategy 1: Try Opposites
**Trigger**: Same focus area repeated in last 2+ stuck iterations.
**Action**: If N iterations searched for X, explicitly search for NOT-X or the converse.
- Example: If stuck on "why does X fail?", investigate "when does X succeed?"
- Example: If stuck searching official docs, try community forums or source code
- Example: If stuck on implementation details, zoom out to architecture or history

#### Strategy 2: Combine Prior Findings
**Trigger**: Mid-range plateau (`newInfoRatio` between the configured threshold and 0.20 for 3+ iterations, not fully stuck).
**Action**: Synthesize the two highest-newInfoRatio iterations into a new composite question.
- Read the top-2 iterations by newInfoRatio
- Identify intersection or tension between their findings
- Generate a new question that bridges both: "How does [finding A] relate to [finding B]?"
- This often reveals unexplored connections

#### Strategy 3: Audit Low-Value Iterations
**Trigger**: General plateau (no single focus dominates the stuck iterations).
**Action**: Re-read iterations with newInfoRatio below 0.20 and extract buried insights.
- Findings dismissed as "partially new" may contain overlooked angles
- Sources consulted but not fully explored may have deeper content
- Questions raised in findings but not promoted to key questions

#### Selection Logic

```
function selectRecoveryStrategy(stuckIterations, allIterations, strategy):
  // Step 1.5: Classify failure mode first
  failureMode = classifyFailureMode(stuckIterations, strategy)
  if failureMode != null:
    recoveryPrompt = failureMode.recoveryPrompt  // prepend to dispatch

  lastFocuses = [i.focus for i in stuckIterations[-3:]]

  // Same focus repeated? Try opposites
  if len(set(lastFocuses)) <= 1:
    return { strategy: "try_opposites", failureMode, recoveryPrompt }

  // Mid-range plateau? Combine
  recentRatios = [i.newInfoRatio for i in stuckIterations[-3:]]
  if all(config.convergenceThreshold <= r <= 0.20 for r in recentRatios):
    return { strategy: "combine_prior_findings", failureMode, recoveryPrompt }

  // General plateau
  return { strategy: "audit_low_value", failureMode, recoveryPrompt }
```

### Step 3: Evaluate Recovery
After the recovery iteration:
- If `newInfoRatio > config.convergenceThreshold`: Recovery successful. Reset stuck count. Continue.
- If `newInfoRatio <= config.convergenceThreshold`: Recovery failed. Exit to synthesis with gaps documented.

### Step 4: Document
Add to JSONL: `{"type":"event","event":"stuck_recovery","fromIteration":N,"outcome":"recovered|failed"}`

---

<!-- /ANCHOR:stuck-recovery-protocol -->
<!-- ANCHOR:tiered-error-recovery-protocol -->
## 5. TIERED ERROR RECOVERY PROTOCOL

Five escalating tiers for handling errors during the research loop. Each tier has a max-attempt count before escalating to the next, and the order never reverses.

| Tier | Trigger | Action | Max Attempts |
|------|---------|--------|-------------|
| 1 | Tool/source failure | Retry with alternative source | 2 per source |
| 2 | Focus exhaustion (2+ low-value iterations on same focus) | Pivot to different focus area | 2 pivots |
| 3 | State corruption | Reconstruct JSONL from iteration files | 1 attempt |
| 4 | Agent dispatch failure (e.g., 529 API overload) | Direct mode fallback (reference-only unless alternate dispatch is implemented) | 1 attempt |
| 5 | Repeated systemic failure after lower tiers are exhausted | Escalate to user with diagnostic | 1 attempt |

### Tier 1: Retry Source

When a specific tool call or source fails:
- Retry up to 2 times with alternative source or tool
- Example: WebFetch fails on URL A, try URL B for the same information
- Example: Grep finds nothing, try broader pattern or Glob to find relevant files
- Do NOT retry the exact same call -- vary the approach

### Tier 2: Focus Pivot

When 2 consecutive iterations on the same focus yield newInfoRatio < 0.10:
- Pivot to a different focus area from strategy.md remaining questions
- Add current focus to "Exhausted Approaches" with reason
- Maximum 2 pivots before escalating to Tier 3

### Tier 3: State Reconstruction

When JSONL is missing or corrupted beyond fault-tolerant parsing:
- Scan `scratch/iteration-*.md` files
- Parse `## Assessment` sections to reconstruct iteration records
- Write reconstructed JSONL with `status: "reconstructed"`
- See state_format.md "State Recovery from Iteration Files" for details

### Tier 4: Direct Mode Fallback

When agent dispatch itself fails (API overload, Task tool error, timeout) and the runtime explicitly supports direct-mode execution:
- Orchestrator absorbs the iteration work directly
- Read state files, perform research actions, write iteration file
- Log: `{"type":"event","event":"direct_mode","iteration":N,"reason":"dispatch_failure"}`
- Continue loop normally after direct-mode iteration completes

### Tier 5: User Escalation

When recovery tiers 1-4 have failed:
- Present diagnostic summary to user:
  - What was attempted and why it failed
  - Current state of research (iterations completed, questions answered)
  - Recommended action (restart, adjust parameters, manual intervention)
- Wait for user guidance before continuing

---

<!-- /ANCHOR:tiered-error-recovery-protocol -->
<!-- ANCHOR:statistical-validation -->
## 6. STATISTICAL VALIDATION

### MAD-Based Noise Floor Detection

After each iteration, compute the noise floor from all historical newInfoRatio values to validate the latest ratio.

```
function validateNewInfoRatio(iterations):
  if len(iterations) < 4:
    return { validated: false, reason: "insufficient_data" }

  ratios = [i.newInfoRatio for i in iterations]
  med = median(ratios)
  mad = median([abs(r - med) for r in ratios])
  noiseFloor = mad * 1.4826

  latest = iterations[-1].newInfoRatio

  withinNoise = latest <= noiseFloor
  if withinNoise:
    // Log advisory event (does not override convergence)
    appendToJSONL({ type: "event", event: "ratio_within_noise",
                    iteration: len(iterations), ratio: latest,
                    noiseFloor: noiseFloor })

  return {
    validated: true,
    noiseFloor: noiseFloor,
    withinNoise: withinNoise,
    ratio: latest,
    advisory: withinNoise ?
      "Latest ratio is within noise floor -- may not represent genuine new information" :
      "Latest ratio exceeds noise floor -- likely genuine signal"
  }
```

### Interpretation

| Condition | Meaning | Action |
|-----------|---------|--------|
| ratio > noiseFloor | Genuine new information detected | Continue research normally |
| ratio <= noiseFloor | Ratio indistinguishable from noise | Advisory only; convergence algorithm decides |
| noiseFloor very low (<0.02) | Consistent high-quality iterations | Noise floor test is less discriminating |
| noiseFloor very high (>0.30) | Highly variable iteration quality | Consider narrowing research scope |

### Noise Floor in Iteration Summary

Display in the per-iteration evaluation output:
```
Noise floor: 0.XX (MAD-based)
Latest ratio: 0.XX [ABOVE|WITHIN] noise floor
```

This provides diagnostic visibility without overriding the composite convergence algorithm.

---

<!-- /ANCHOR:statistical-validation -->
<!-- ANCHOR:convergence-threshold-tuning -->
## 7. CONVERGENCE THRESHOLD TUNING

| Threshold | Effect | Use When |
|-----------|--------|----------|
| 0.02 | Very permissive, loops longer | Exhaustive research on critical topics |
| 0.05 (default) | Balanced | General deep research |
| 0.10 | Aggressive, stops earlier | Quick surveys, time-constrained research |
| 0.20 | Very aggressive | Broad overview, not deep investigation |

### Tuning Guidance

```
Topic familiarity:
  Known domain -> higher threshold (0.10)
  Unknown domain -> lower threshold (0.02-0.05)

Research importance:
  Critical decision -> lower threshold (0.02)
  Background research -> higher threshold (0.10)

Budget constraints:
  Limited API budget -> higher threshold (0.10-0.20)
  Unlimited -> lower threshold (0.02-0.05)
```

---

<!-- /ANCHOR:convergence-threshold-tuning -->
<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Early Convergence (< 3 iterations)
If fewer than 3 iterations have completed, the convergence threshold check is skipped (not enough data). Only max iterations and stuck detection apply.

### All Questions Answered on Iteration 1
Possible for very narrow topics. The loop stops cleanly after 1 iteration. This is correct behavior, not an error.

### newInfoRatio Reporting Error
If the agent fails to report `newInfoRatio` in its JSONL entry:
- Default to 0.0 (treat the missing value as no new information)
- Log a warning in the JSONL: `{"type":"event","event":"missing_newInfoRatio","iteration":N}`

### Conflicting Signals
If stuck detection triggers but questions remain unanswered:
- Stuck recovery takes precedence (try different approach)
- If recovery also fails, exit to synthesis and document unanswered questions

---

<!-- /ANCHOR:edge-cases -->
<!-- ANCHOR:convergence-reporting -->
## 9. CONVERGENCE REPORTING

When the loop stops, the YAML workflow generates a convergence report:

```
CONVERGENCE REPORT
------------------
Stop reason: [composite_converged | max_iterations | all_questions_answered | stuck_unrecoverable]
Total iterations: N (segment: S)
Questions answered: X / Y (Z%)

Composite Convergence Score: 0.XX / 0.60 threshold
  Signal 1 - Rolling Avg (w=0.30): 0.XX [STOP|CONTINUE]
  Signal 2 - MAD Noise (w=0.35):   0.XX [STOP|CONTINUE] (floor: 0.XX)
  Signal 3 - Entropy (w=0.35):     0.XX [STOP|CONTINUE] (coverage: X/Y)

Noise Floor: 0.XX (last ratio: 0.XX [ABOVE|WITHIN])
Stuck recovery attempts: N (recovered: N, failed: N)
Error recovery tiers used: [list or "none"]
```

This report is included in the final JSONL entry and displayed to the user.

<!-- /ANCHOR:convergence-reporting -->

---

<!-- ANCHOR:review-mode-convergence -->
## 10. REVIEW MODE CONVERGENCE

Review mode uses a severity-weighted variant of the convergence algorithm. Instead of measuring "new information" against research questions, it measures "new findings" against review dimensions and applies severity weighting.

### 10.1 newFindingsRatio (Severity-Weighted)

The review-mode equivalent of `newInfoRatio`. Computed by the @deep-review agent at the end of each iteration.

```
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }

weightedNew = sum(SEVERITY_WEIGHTS[f.severity] for f in fully_new_findings)
weightedRefinement = sum(SEVERITY_WEIGHTS[f.severity] * 0.5 for f in refinement_findings)
weightedTotal = sum(SEVERITY_WEIGHTS[f.severity] for f in all_findings_this_iteration)

newFindingsRatio = (weightedNew + weightedRefinement) / weightedTotal

P0 Override: if ANY new P0 → newFindingsRatio = max(calculated, 0.50)
If total_findings == 0 → newFindingsRatio = 0.0
```

**Definitions:**
- `fully_new_findings`: Findings not present in any prior iteration (new findingId)
- `refinement_findings`: Findings that refine or upgrade an existing finding (same root cause, new evidence or severity change)
- `all_findings_this_iteration`: All findings reported in the current iteration

**P0 Override rationale:** A new critical finding always signals significant remaining work, regardless of the overall new-to-total ratio. Setting a floor of 0.50 prevents premature convergence when critical issues are still being discovered.

### 10.2 Adapted Signal Weights

Review mode uses a 3-signal composite with adapted weights that prioritize dimension coverage over rolling average.

| Signal | Weight | Window | Threshold | Min Iterations |
|--------|--------|--------|-----------|----------------|
| Rolling Average | 0.30 | 2 | 0.08 | 2 |
| MAD Noise Floor | 0.25 | all | 1.4826 | 3 |
| Dimension Coverage | 0.45 | n/a | 1.0 (100%) | 1 |

**Key differences from research mode:**
- **Rolling Average** uses a window of 2 (not 3) for faster signal response
- **Rolling Average** threshold is 0.08 (not `convergenceThreshold`) to account for severity weighting
- **MAD Noise Floor** weight reduced to 0.25 (from 0.35) — review findings are less noisy
- **Dimension Coverage** replaces Question Entropy — measures reviewed-dimensions / total-dimensions
- **Dimension Coverage** requires 1.0 (100%) — all dimensions must be reviewed before convergence
- **Dimension Coverage** weight increased to 0.45 (from 0.35) to enforce thorough coverage

### 10.3 shouldContinue_review() Pseudocode

```
function shouldContinue_review(state, config):
  iterations = state.iterations

  // --- Hard Stops (checked first, always apply) ---

  // Hard stop: max iterations
  if len(iterations) >= config.maxIterations:
    return { action: "STOP", reason: "max_iterations_reached" }

  // Hard stop: all dimensions clean (no findings above threshold in any dimension)
  allDimensionsReviewed = countReviewedDimensions(state.strategy) == len(config.reviewDimensions)
  hasActivePOorP1 = countActiveFindings(state, ["P0", "P1"]) > 0
  if allDimensionsReviewed and not hasActivePOorP1:
    cleanPasses = countConsecutiveCleanPasses(iterations)
    if cleanPasses >= 2:
      return { action: "STOP", reason: "all_dimensions_clean" }

  // --- Stuck Detection (threshold: 2, not 3) ---

  stuckCount = countConsecutiveStuck_review(iterations)
  if stuckCount >= 2:
    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }

  // --- Composite Convergence (3-Signal Weighted Vote) ---

  // Filter: exclude "thought" iterations from convergence signals
  evidenceIterations = [i for i in iterations if i.status != "thought"]

  signals = []
  totalWeight = 0

  // Signal 1: Rolling average of last 2 newFindingsRatios (severity-weighted)
  if len(evidenceIterations) >= 2:
    recent = evidenceIterations[-2:]
    avgNewFindings = mean(i.newFindingsRatio for i in recent)
    rollingStop = avgNewFindings < 0.08
    signals.push({ name: "rollingAvg", value: avgNewFindings, stop: rollingStop, weight: 0.30 })
    totalWeight += 0.30

  // Signal 2: MAD noise floor (needs 3+ data points)
  if len(evidenceIterations) >= 3:
    allRatios = [i.newFindingsRatio for i in evidenceIterations]
    med = median(allRatios)
    mad = median([abs(r - med) for r in allRatios])
    noiseFloor = mad * 1.4826
    latestRatio = iterations[-1].newFindingsRatio
    madStop = latestRatio <= noiseFloor
    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.25 })
    totalWeight += 0.25

  // Signal 3: Dimension coverage
  reviewedCount = countReviewedDimensions(state.strategy)
  totalDimensions = len(config.reviewDimensions)
  if totalDimensions > 0:
    coverage = reviewedCount / totalDimensions
    dimensionStop = coverage >= 1.0  // 100% — all dimensions must be reviewed
    signals.push({ name: "dimensionCoverage", value: coverage, stop: dimensionStop, weight: 0.45 })
    totalWeight += 0.45

  // Compute weighted stop score
  if totalWeight > 0:
    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
    if stopScore > 0.60:
      // Quality guard check before finalizing STOP
      guardResult = checkReviewQualityGuards(state, config)
      if guardResult.passed:
        return { action: "STOP", reason: "composite_converged", stopScore, signals }
      else:
        // Override STOP — guards failed
        for v in guardResult.violations:
          appendToJSONL({ type: "event", event: "guard_violation", ...v })
        return { action: "CONTINUE", reason: "guard_override", violations: guardResult.violations }

  // --- Default: Continue ---
  return { action: "CONTINUE", reviewedDimensions: reviewedCount, signals }
```

### 10.4 Review Quality Guards

Five binary guards that must pass before a STOP decision is finalized. If any guard fails, the STOP is overridden to CONTINUE.

| Guard | Rule | Fail Action |
|-------|------|-------------|
| Evidence Completeness | Every P0/P1 finding has `file:line` citation | Block STOP, log `guard_violation` |
| Scope Alignment | All findings are within the declared review scope | Block STOP, log `guard_violation` |
| No Inference-Only | No P0/P1 finding based solely on inference without code evidence | Block STOP, log `guard_violation` |
| Severity Coverage | Security + Correctness dimensions have been reviewed | Block STOP, log `guard_violation` |
| Cross-Reference (optional) | At least one multi-dimension iteration (5+ iterations only) | Block STOP, log `guard_violation` |

```
function checkReviewQualityGuards(state, config):
  violations = []

  // Guard 1: Evidence Completeness
  for f in state.findings where f.severity in ["P0", "P1"] and f.status == "active":
    if not f.hasFileLineCitation:
      violations.push({ guard: "evidence_completeness", findingId: f.id,
                        detail: "P0/P1 finding lacks file:line citation" })

  // Guard 2: Scope Alignment
  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
  for f in state.findings where f.status == "active":
    if f.filePath not in reviewScope:
      violations.push({ guard: "scope_alignment", findingId: f.id,
                        detail: "Finding outside declared review scope" })

  // Guard 3: No Inference-Only
  for f in state.findings where f.severity in ["P0", "P1"] and f.status == "active":
    if f.evidenceType == "inference-only":
      violations.push({ guard: "no_inference_only", findingId: f.id,
                        detail: "P0/P1 finding based solely on inference" })

  // Guard 4: Severity Coverage
  reviewedDims = getReviewedDimensions(state.strategy)
  if "correctness" not in reviewedDims:
    violations.push({ guard: "severity_coverage",
                      detail: "Correctness dimension not yet reviewed" })
  if "security" not in reviewedDims:
    violations.push({ guard: "severity_coverage",
                      detail: "Security dimension not yet reviewed" })

  // Guard 5: Cross-Reference (optional, 5+ iterations only)
  if len(state.iterations) >= 5:
    hasMultiDimIteration = any(len(i.dimensions) > 1 for i in state.iterations)
    if not hasMultiDimIteration:
      violations.push({ guard: "cross_reference",
                        detail: "No multi-dimension iteration performed" })

  if len(violations) > 0:
    return { passed: false, violations }
  return { passed: true }
```

### 10.5 Review Stuck Recovery

**Threshold:** 2 consecutive no-progress iterations (not 3 as in research mode). Review sessions are shorter and must detect stuck states faster.

#### Failure Modes and Recovery Strategies

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension with no new findings | **Change granularity:** if reviewing at file level, zoom into functions; if reviewing functions, zoom out to module level |
| Multiple clean dimensions | 2+ dimensions marked clean in a row with no findings | **Cross-reference analysis:** look for issues that span multiple dimensions (e.g., a correctness bug that is also a spec-alignment violation) |
| Low-value iterations | Last 2 iterations found only P2 findings | **Escalate severity review:** explicitly search for P0/P1 patterns — injection vectors, auth bypasses, broken invariants |

#### Selection Logic

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]

  // Same dimension stuck? Change granularity
  if len(set(lastFocuses)) <= 1:
    return { strategy: "change_granularity", dimension: lastFocuses[0] }

  // Multiple clean dimensions? Cross-reference
  recentDims = getCompletedDimensionsSince(state, stuckIterations[0].run)
  if len(recentDims) >= 2:
    return { strategy: "cross_reference_analysis", dimensions: recentDims }

  // Default: escalate severity
  return { strategy: "escalate_severity_review" }
```

#### Recovery Evaluation
- If recovery iteration finds any P0/P1: Recovery successful. Reset stuck count. Continue.
- If recovery iteration finds only P2 or nothing: Recovery failed. If all dimensions reviewed, exit to synthesis. Otherwise, move to next unreviewed dimension.

### 10.6 Review Edge Cases

#### Clean Codebase
When the review target has no significant issues:
- Continue until ALL dimensions have been reviewed (dimension coverage = 1.0)
- After all dimensions reviewed, require 2+ consecutive clean passes before converging
- This ensures thoroughness even when no issues are found

#### Huge Scope
When the review target contains many files:
- Use `maxFilesPerIteration` to limit files reviewed per iteration (default: 10)
- Batch dimensions: review 1-2 dimensions per iteration rather than all 7
- Prioritize security and correctness dimensions first

#### Late P0 Discovery
When a P0 is found in a late iteration:
- The P0 override rule sets `newFindingsRatio = max(calculated, 0.50)`, blocking convergence
- All dimensions that could be affected by the P0 root cause must be re-checked
- Convergence cannot occur with active P0 findings

#### False Convergence
When convergence signals fire but review is incomplete:
- The cross-reference guard (Guard 5) acts as a safety net for sessions with 5+ iterations
- The dimension coverage signal requires 100%, preventing premature stops
- The severity coverage guard ensures security and correctness are always reviewed

---

<!-- /ANCHOR:review-mode-convergence -->
