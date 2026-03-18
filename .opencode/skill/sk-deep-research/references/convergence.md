# Convergence Detection Reference

Algorithms and protocols for determining when the deep research loop should stop.

---

## 1. OVERVIEW

Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision.

---

## 2. THE shouldContinue() ALGORITHM

> **Segment Awareness**: When segments are active (see Section 3.5), `state.iterations` is pre-filtered to the current segment. Hard stops (max iterations) apply globally; convergence signals apply per-segment.

### 2.1 Hard Stops (checked first, always apply)

```
function shouldContinue(state, config):
  iterations = state.iterations  // filtered by current segment (see Section 3.5)

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
  // Composite convergence: 3-signal weighted vote
  signals = []
  totalWeight = 0

  // Signal 1: Rolling average of last N newInfoRatios
  if len(iterations) >= 3:
    recent = iterations[-3:]
    avgNewInfo = mean(i.newInfoRatio for i in recent)
    rollingStop = avgNewInfo < config.convergenceThreshold
    signals.push({ name: "rollingAvg", value: avgNewInfo, stop: rollingStop, weight: 0.30 })
    totalWeight += 0.30

  // Signal 2: MAD noise floor (needs 4+ data points)
  if len(iterations) >= 4:
    allRatios = [i.newInfoRatio for i in iterations]
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
5. **Default continue** (none of the above triggered)

---

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
    if i.newInfoRatio < 0.05 or i.status == "stuck":
      count += 1
    else:
      break
  return count
```

A stuck iteration is one where:
- `newInfoRatio < 0.05` (less than 5% new information)
- OR `status == "stuck"` (agent self-reported as stuck)

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

### Reading JSONL State (Fault-Tolerant)

When reading `deep-research-state.jsonl`, parse defensively:

1. Read file line by line
2. Wrap each line parse in try/catch
3. On parse failure: skip the line, increment `skippedCount`
4. For successfully parsed lines, apply defaults for missing fields:
   - `status ?? "complete"`
   - `newInfoRatio ?? 0`
   - `findingsCount ?? 0`
   - `focus ?? "unknown"`
   - `keyQuestions ?? []`
5. After all lines: if `skippedCount > 0`, log warning:
   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
6. Proceed with valid entries only

This ensures convergence checks continue even after partial state corruption. See state-format.md Section 3 for the full fault tolerance specification.

### Segment Model

Segments partition a research session into logical phases without losing history.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| segment (on iteration records) | number | 1 | Segment this iteration belongs to |
| segment_start (event type) | event | -- | Marks the start of a new segment |

When computing convergence signals:
- Filter iterations by `segment === currentSegment`
- Hard stops (max iterations) count ALL iterations regardless of segment
- Cross-segment analysis: read full JSONL without segment filtering

Segment transitions are triggered by:
- `:restart` mode in the command
- Explicit user request for a new research angle
- Orchestrator judgment when research direction fundamentally shifts

See state-format.md Section 3 for JSONL schema details.

---

## 4. STUCK RECOVERY PROTOCOL

When `stuckCount >= stuckThreshold` (default 3):

### Step 1: Analyze Why
Read strategy.md to understand:
- What approaches have been exhausted?
- What questions remain unanswered?
- What has NOT been tried?

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
**Trigger**: Mid-range plateau (newInfoRatio 0.05-0.20 for 3+ iterations, not fully stuck).
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
function selectRecoveryStrategy(stuckIterations, allIterations):
  lastFocuses = [i.focus for i in stuckIterations[-3:]]

  // Same focus repeated? Try opposites
  if len(set(lastFocuses)) <= 1:
    return "try_opposites"

  // Mid-range plateau? Combine
  recentRatios = [i.newInfoRatio for i in stuckIterations[-3:]]
  if all(0.05 <= r <= 0.20 for r in recentRatios):
    return "combine_prior_findings"

  // General plateau
  return "audit_low_value"
```

### Step 3: Evaluate Recovery
After the recovery iteration:
- If `newInfoRatio > 0.05`: Recovery successful. Reset stuck count. Continue.
- If `newInfoRatio <= 0.05`: Recovery failed. Exit to synthesis with gaps documented.

### Step 4: Document
Add to JSONL: `{"type":"event","event":"stuck_recovery","fromIteration":N,"outcome":"recovered|failed"}`

---

## 4.5 TIERED ERROR RECOVERY PROTOCOL

Five escalating tiers for handling errors during the research loop. Each tier has a max-attempt count before escalating to the next.

| Tier | Trigger | Action | Max Attempts |
|------|---------|--------|-------------|
| 1 | Tool/source failure | Retry with alternative source | 2 per source |
| 2 | Focus exhaustion (2+ low-value iterations on same focus) | Pivot to different focus area | 2 pivots |
| 3 | State corruption | Reconstruct JSONL from iteration files | 1 attempt |
| 4 | Repeated systemic failure | Escalate to user with diagnostic | 1 attempt |
| 5 | Agent dispatch failure (e.g., 529 API overload) | Direct mode fallback | 1 attempt |

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
- See state-format.md "State Recovery from Iteration Files" for details

### Tier 4: User Escalation

When recovery tiers 1-3 have failed:
- Present diagnostic summary to user:
  - What was attempted and why it failed
  - Current state of research (iterations completed, questions answered)
  - Recommended action (restart, adjust parameters, manual intervention)
- Wait for user guidance before continuing

### Tier 5: Direct Mode Fallback

When agent dispatch itself fails (API overload, Task tool error, timeout):
- Orchestrator absorbs the iteration work directly
- Read state files, perform research actions, write iteration file
- Log: `{"type":"event","event":"direct_mode","iteration":N,"reason":"dispatch_failure"}`
- Continue loop normally after direct-mode iteration completes

---

## 4a STATISTICAL VALIDATION

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

## 5. CONVERGENCE THRESHOLD TUNING

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

## 6. EDGE CASES

### Early Convergence (< 3 iterations)
If fewer than 3 iterations have completed, the convergence threshold check is skipped (not enough data). Only max iterations and stuck detection apply.

### All Questions Answered on Iteration 1
Possible for very narrow topics. The loop stops cleanly after 1 iteration. This is correct behavior, not an error.

### newInfoRatio Reporting Error
If the agent fails to report `newInfoRatio` in its JSONL entry:
- Default to 0.5 (assume moderate new information)
- Log a warning in the JSONL: `{"type":"event","event":"missing_newInfoRatio","iteration":N}`

### Conflicting Signals
If stuck detection triggers but questions remain unanswered:
- Stuck recovery takes precedence (try different approach)
- If recovery also fails, exit to synthesis and document unanswered questions

---

## 7. CONVERGENCE REPORTING

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
