---
title: Convergence Detection Reference
description: Algorithms and protocols for determining when the deep research loop should stop.
---

# Convergence Detection Reference

Algorithms and protocols for determining when the deep research loop should stop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision, while the reducer publishes the resulting `convergenceScore` and `coverageBySources` into the dashboard and findings registry after every iteration.

For operator-facing docs, this reference and the deep-research YAML workflow are the authoritative 3-signal contract. Quick references and command-adjacent summaries should mirror the weights and signal names published here.

When the loop stops and enters synthesis, the workflow emits `{artifact_dir}/resource-map.md` from converged research deltas before finalizing `research.md`. Operators can disable that write with `--no-resource-map`.

### Shared Stop Contract

Both deep-loop products normalize their terminal and blocked-stop outcomes through the same completion-gate contract before any stop decision is persisted to JSONL, dashboards, or synthesis output.

#### `stopReason` enum

| Value | When It Is Used |
|-------|-----------------|
| `converged` | The legal-stop bundle passed and the loop may exit normally |
| `maxIterationsReached` | The loop hit its configured iteration cap before legal convergence |
| `userPaused` | A user-facing pause sentinel or equivalent user pause request halted execution |
| `blockedStop` | Convergence or coverage wanted to stop, but one or more legal-stop gates failed |
| `stuckRecovery` | Stuck detection triggered recovery, or recovery became the terminal outcome |
| `error` | An unrecoverable runtime or iteration error terminated the loop |
| `manualStop` | An operator explicitly halted the loop outside automatic convergence |

#### `legalStop` record

```ts
type GateResult = {
  pass: boolean;
  detail: string;
  checks?: Record<string, GateResult>;
  recoveryHint?: string;
};

type LegalStop = {
  blockedBy: string[];
  gateResults: {
    convergenceGate: GateResult;
    coverageGate: GateResult;
    qualityGate: GateResult;
  };
  replayInputs: {
    iterationCount: number;
    answeredCount: number;
    totalQuestions: number;
    weightedStopScore?: number;
    activeSignals?: Array<{ name: string; value: number; stop: boolean; weight: number }>;
    stuckCount?: number;
    source:
      | "question_coverage"
      | "composite_convergence"
      | "iteration_cap"
      | "pause_sentinel"
      | "recovery"
      | "error"
      | "manual_override";
  };
}
```

- `blockedBy` lists the gate names that prevented a legal STOP. Use an empty array when STOP is legal.
- `gateResults` is the replayable legal-stop bundle. Canonical research gates are `convergenceGate`, `coverageGate`, and `qualityGate`; the `qualityGate.checks` map carries the subordinate `sourceDiversity`, `focusAlignment`, and `singleWeakSourceDominance` results.
- `replayInputs` snapshots the exact stop-decision inputs so the reducer and dashboards can replay the outcome from packet-local artifacts only.

#### Legacy Stop-Reason Mapping

Normalize older labels into the shared contract instead of persisting them directly:

| Legacy label or phrase | New `stopReason` | Normalization note |
|------------------------|------------------|--------------------|
| `composite_converged` | `converged` | Weighted convergence vote passed and legal-stop gates passed |
| `novelty below threshold` | `converged` | Legacy prose alias for the rolling-average or composite stop path |
| `all_questions_answered` | `converged` | Coverage-driven stop becomes `blockedStop` instead if legal-stop gates fail |
| `max_iterations` | `maxIterationsReached` | Older shorthand label |
| `max_iterations_reached` | `maxIterationsReached` | Current legacy machine label |
| `paused` | `userPaused` | Pause sentinel or equivalent user-driven halt |
| `sentinel file detected` | `userPaused` | Human-readable pause explanation |
| `guard_override` | `blockedStop` | STOP candidate was vetoed by legal-stop gates |
| `guard_violation` | `blockedStop` | Guard failure record that blocks legal STOP |
| `stuck_detected` | `stuckRecovery` | Recovery path was activated |
| `stuck_unrecoverable` | `stuckRecovery` | Recovery became the final outcome |
| `manual_stop` | `manualStop` | Operator halted the loop |
| `unrecoverable_error` | `error` | Runtime terminated due to unrecoverable failure |

Deep review uses the same `stopReason` enum and `legalStop` record, even though its convergence signals differ.

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
    return {
      action: "STOP",
      stopReason: "maxIterationsReached",
      legacyStopLabel: "max_iterations_reached"
    }

  // Hard stop: all questions answered
  unanswered = countUnanswered(state.strategy.keyQuestions)
  if unanswered == 0:
    return {
      action: "STOP",
      stopReason: "converged",
      legacyStopLabel: "all_questions_answered"
    }
```

### 2.2 Stuck Detection

```
  // Stuck detection: consecutive no-progress
  stuckCount = countConsecutiveStuck(iterations)
  if stuckCount >= config.stuckThreshold:
    return {
      action: "STUCK_RECOVERY",
      stopReason: "stuckRecovery",
      legacyStopLabel: "stuck_detected",
      stuckCount
    }
```

### 2.3 Composite Convergence (3-Signal Weighted Vote)

Three independent signals each cast a stop/continue vote. Stop when weighted stop-score exceeds the consensus threshold.

| Signal | Weight | Min Iterations | Measures |
|--------|--------|---------------|----------|
| Rolling Average | 0.30 | 3 | Recent information yield |
| MAD Noise Floor | 0.35 | 4 | Signal vs noise in newInfoRatio |
| Question Entropy | 0.35 | 1 | Coverage of research questions |

Reducer-owned metrics derived from these signals:

- `convergenceScore`: normalized stop-score surfaced in `findings-registry.json` and `deep-research-dashboard.md`
- `coverageBySources`: per-question source coverage summary used by the quality guards

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
      return {
        action: "STOP",
        stopReason: "converged",
        legacyStopLabel: "composite_converged",
        stopScore,
        signals
      }

  // Default: continue
  return { action: "CONTINUE", unansweredCount: unanswered, signals }
```

### 2.4 Legal-Stop Gate Bundle

After composite convergence or full-question coverage nominates STOP, the loop MUST evaluate the full legal-stop bundle before STOP becomes final. STOP is never legal on novelty math alone. The replayable `legalStop.gateResults` bundle for deep research is:

| Gate | Rule | Fail Action |
|------|------|-------------|
| Convergence Gate | The novelty score stays below `convergenceThreshold` for N consecutive evidence iterations | Block STOP, persist `blocked_stop`, continue |
| Coverage Gate | Every key question has at least one evidence-backed answer | Block STOP, persist `blocked_stop`, continue |
| Quality Gate | Source diversity, focus alignment, and no single weak-source dominance all pass | Block STOP, persist `blocked_stop`, continue |

`N` comes from the reducer-or-workflow legal-stop policy (default 2 consecutive evidence iterations unless a packet config raises it). The bundle is evaluated together; no single gate can authorize STOP by itself.

```
function evaluateLegalStop(state, strategy, config, stopCandidate):
  requiredConsecutive = config.requiredConsecutiveLowNovelty ?? 2
  evidenceIterations = [i for i in state.iterations if i.status != "thought"]
  recentEvidence = evidenceIterations[-requiredConsecutive:]
  missingQuestions = getQuestionsWithoutEvidence(strategy)

  convergenceGate = {
    pass: len(recentEvidence) == requiredConsecutive &&
      all(i.newInfoRatio < config.convergenceThreshold for i in recentEvidence),
    detail: f"{countPassing(recentEvidence)}/{requiredConsecutive} recent evidence iterations remained below threshold",
    recoveryHint: "Run another evidence iteration if novelty has not stayed low long enough"
  }

  coverageGate = {
    pass: len(missingQuestions) == 0,
    detail: len(missingQuestions) == 0 ?
      "Every key question has an evidence-backed answer" :
      f"Missing evidence-backed answers for: {join(missingQuestions, ', ')}",
    recoveryHint: "Target unanswered or weakly answered key questions next"
  }

  sourceDiversity = checkSourceDiversity(state, strategy)
  focusAlignment = checkFocusAlignment(strategy)
  singleWeakSourceDominance = checkWeakSourceDominance(state, strategy)

  qualityGate = {
    pass: sourceDiversity.pass && focusAlignment.pass && singleWeakSourceDominance.pass,
    detail: sourceDiversity.pass && focusAlignment.pass && singleWeakSourceDominance.pass ?
      "All quality sub-gates passed" :
      "One or more quality sub-gates failed",
    checks: {
      sourceDiversity,
      focusAlignment,
      singleWeakSourceDominance,
    },
    recoveryHint: chooseQualityRecovery(sourceDiversity, focusAlignment, singleWeakSourceDominance)
  }

  blockedBy = []
  for gateName, gateResult in {
    convergenceGate,
    coverageGate,
    qualityGate,
  }.items():
    if not gateResult.pass:
      blockedBy.push(gateName)

  legalStop = {
    blockedBy,
    gateResults: { convergenceGate, coverageGate, qualityGate },
    replayInputs: buildReplayInputs(state, stopCandidate)
  }

  if len(blockedBy) == 0:
    return {
      decision: "STOP",
      stopReason: "converged",
      candidateStopReason: stopCandidate.stopReason,
      legalStop
    }

  return {
    decision: "CONTINUE",
    stopReason: "blockedStop",
    candidateStopReason: stopCandidate.stopReason,
    legalStop,
    recoveryStrategy: chooseBlockedStopRecovery(legalStop, strategy)
  }
```

**Checks:**

- **Convergence Gate**: Re-read the most recent N evidence iterations only. Every one of them must remain below the configured novelty threshold.
- **Coverage Gate**: Every initialized key question must have at least one answer backed by evidence from the iteration artifacts.
- **Source Diversity**: For each answered question, count distinct independent sources. Require the configured minimum (default 2).
- **Focus Alignment**: Compare current key questions against `config.originalKeyQuestions` (the snapshot of initial key questions populated at session init). Flag any answer outside the declared scope, or any significant drift where the current question set no longer resembles the original set. When `originalKeyQuestions` is absent (legacy packets), fall back to comparing against strategy.md's initialized question list.
- **No Single-Weak-Source**: No answered question may depend entirely on a single tentative or otherwise weak source. The guard checks the `sourceStrength` field on iteration records (values: `"strong"`, `"moderate"`, `"weak"`) rather than performing implicit JSONL analysis.

`qualityGate.checks` is the replayable quality bundle. Reducers and dashboards must be able to explain a quality pass or failure from packet-local artifacts only.

When any gate fails:

1. Append a `stop_decision` snapshot with the attempted stop bundle.
2. Append a first-class `blocked_stop` event with `stopReason: "blockedStop"`, `legalStop.blockedBy`, the full `legalStop.gateResults`, and a concrete `recoveryStrategy`.
3. Continue the loop using that `recoveryStrategy` as the next focus directive.
4. Replay reducers and dashboards from packet-local artifacts only; no hidden runtime memory is required.

Recommended blocked-stop recovery mapping:

| Failed Gate | Preferred Recovery |
|-------------|--------------------|
| `convergenceGate` | `widenFocus` to gather another evidence iteration before retrying STOP |
| `coverageGate` | `answerMissingQuestions` for unanswered or tentative-only questions |
| `qualityGate` with weak-source failure | `seekMoreSources` to replace weak or single-source evidence |
| `qualityGate` with focus drift | `repairAlignment` to bring answers back inside initialized scope |

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

### Semantic Convergence Signals

Three additional signals provide deeper semantic analysis of iteration quality. These signals are ADDITIONAL to the 3-signal composite vote above and participate in the legal-stop gate evaluation rather than the composite stop-score.

#### semanticNovelty (0.0-1.0)

Measures how much genuinely new information each iteration contributes beyond surface-level keyword overlap. Unlike `newInfoRatio` (which the agent self-assesses), `semanticNovelty` is computed by comparing the semantic content of the current iteration's findings against the cumulative knowledge base from all prior iterations.

| Value | Meaning |
|-------|---------|
| 0.8-1.0 | Iteration introduced substantially new concepts, frameworks, or evidence |
| 0.4-0.7 | Mix of new angles and restatements of prior knowledge |
| 0.1-0.3 | Mostly rephrasing or minor extensions of existing findings |
| 0.0 | No semantically novel content detected |

Computation:
```
function computeSemanticNovelty(currentFindings, priorCumulativeFindings):
  newConcepts = extractConcepts(currentFindings) - extractConcepts(priorCumulativeFindings)
  totalConcepts = extractConcepts(currentFindings)
  if len(totalConcepts) == 0: return 0.0
  return len(newConcepts) / len(totalConcepts)
```

When `semanticNovelty` drops below 0.15 for 2+ consecutive evidence iterations, it provides strong supporting evidence for a legal STOP decision. This signal catches cases where `newInfoRatio` remains moderate (due to different phrasing) but the underlying knowledge has plateaued.

#### contradictionDensity (0.0-1.0)

Ratio of contradicted claims to total claims across the cumulative finding set. Tracks how the research evidence graph resolves internal conflicts over time.

| Value | Meaning |
|-------|---------|
| 0.0 | No contradictions in the finding set |
| 0.01-0.10 | Normal level of resolved contradictions |
| 0.11-0.25 | Elevated contradictions; may need targeted reconciliation |
| 0.26+ | High contradiction density; research may be stuck on conflicting sources |

Computation:
```
function computeContradictionDensity(cumulativeFindings):
  contradicted = count(f for f in cumulativeFindings if f.contradictedBy != null)
  total = len(cumulativeFindings)
  if total == 0: return 0.0
  return contradicted / total
```

Convergence behavior:
- `contradictionDensity <= 0.10` supports STOP: the finding set is internally consistent.
- `contradictionDensity > 0.25` blocks STOP: unresolved contradictions suggest the research space is not yet stable. The legal-stop gate records this as a `qualityGate` sub-check failure.
- The stuck recovery protocol (Section 4, Step 1.5) should use "Contradictory evidence" failure mode when `contradictionDensity > 0.25`.

#### citationOverlap (0.0-1.0)

Measures how much the current iteration's citations overlap with the existing citation graph. A high overlap means the iteration consulted mostly the same sources; a low overlap means new sources were discovered.

| Value | Meaning |
|-------|---------|
| 0.0 | Entirely new sources not seen in prior iterations |
| 0.1-0.4 | Mostly new sources with some reuse |
| 0.5-0.7 | Balanced mix of new and previously cited sources |
| 0.8-1.0 | Almost entirely citing previously consulted sources |

Computation:
```
function computeCitationOverlap(currentSources, priorSourceGraph):
  if len(currentSources) == 0: return 1.0  // no new sources = full overlap
  overlap = currentSources & priorSourceGraph
  return len(overlap) / len(currentSources)
```

Convergence behavior:
- `citationOverlap >= 0.85` for 2+ consecutive iterations supports STOP: the source space is exhausted.
- `citationOverlap < 0.30` prevents STOP: the iteration discovered substantially new sources that may yield fresh findings.

#### Integration with Legal-Stop Gate Bundle

The three semantic signals combine with the existing legal-stop gates as follows:

1. **Convergence Gate** (existing): Novelty score below threshold for N consecutive iterations. Semantic signals provide corroborating evidence.
2. **Coverage Gate** (existing): Key questions answered with evidence.
3. **Quality Gate** (existing): Source diversity, focus alignment, single-weak-source. The semantic signals add three sub-checks:
   - `semanticNoveltyPlateau`: `semanticNovelty < 0.15` for 2+ consecutive evidence iterations
   - `contradictionResolution`: `contradictionDensity <= 0.10`
   - `sourceExhaustion`: `citationOverlap >= 0.85` for 2+ consecutive iterations OR `citationOverlap < 0.30` does not block

The quality gate passes only when ALL sub-checks pass (existing + semantic). When a semantic sub-check fails, the `legalStop.gateResults.qualityGate.checks` map includes the failing semantic sub-check with its detail and recovery hint.

#### Stop-Decision Trace

The stop-decision event (`stop_decision` and `blocked_stop` JSONL records) includes which semantic signals supported or prevented STOP:

```json
{
  "type": "event",
  "event": "stop_decision",
  "semanticSignals": {
    "semanticNovelty": { "value": 0.08, "consecutiveLow": 3, "supportsStop": true },
    "contradictionDensity": { "value": 0.04, "supportsStop": true },
    "citationOverlap": { "value": 0.91, "consecutiveHigh": 2, "supportsStop": true }
  },
  "semanticVerdict": "all_support_stop",
  ...
}
```

| `semanticVerdict` | Meaning |
|-------------------|---------|
| `all_support_stop` | All 3 semantic signals support stopping |
| `mixed` | Some signals support stop, others do not |
| `all_prevent_stop` | All 3 semantic signals indicate more work is needed |
| `insufficient_data` | Not enough iterations to compute semantic signals |

### Graceful Degradation

| Iterations Completed | Active Signals | Behavior |
|--------------------|----------------|----------|
| 1-2 | Entropy only (weight 1.0) | Very unlikely to stop (need 85%+ coverage) |
| 3 | Rolling avg + entropy | Two-signal vote, reweighted |
| 4+ | All three signals | Full composite, most reliable |

Semantic convergence signals (`semanticNovelty`, `contradictionDensity`, `citationOverlap`) require at least 2 evidence iterations to produce meaningful values. They are omitted from legal-stop evaluation when insufficient data exists.

### Decision Priority

Checks are evaluated in this order (first match wins):

1. **Max iterations** (hard cap, always checked first)
2. **All questions answered** (coverage-driven stop candidate)
3. **Stuck detection** (3+ consecutive no-progress)
4. **Composite convergence** (3-signal weighted vote, threshold 0.60)
4.5. **Legal-stop gate bundle** (`convergenceGate` + `coverageGate` + `qualityGate` must all pass together)
4.6. **Blocked-stop persistence** (if any legal-stop gate fails, persist `blocked_stop` with recovery strategy and continue)
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
- Scan `{spec_folder}/review/iterations/iteration-*.md` files
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
Stop reason: [converged | maxIterationsReached | userPaused | blockedStop | stuckRecovery | error | manualStop]
Legacy label: [optional replay-only alias such as composite_converged]
Total iterations: N (segment: S)
Questions answered: X / Y (Z%)
Legal stop blockers: [none | comma-separated gate names]
Recovery strategy (if blocked): [widen focus | seek more sources | repair focus alignment | answer missing questions]

Composite Convergence Score: 0.XX / 0.60 threshold
  Signal 1 - Rolling Avg (w=0.30): 0.XX [STOP|CONTINUE]
  Signal 2 - MAD Noise (w=0.35):   0.XX [STOP|CONTINUE] (floor: 0.XX)
  Signal 3 - Entropy (w=0.35):     0.XX [STOP|CONTINUE] (coverage: X/Y)

Noise Floor: 0.XX (last ratio: 0.XX [ABOVE|WITHIN])

Semantic Convergence Signals:
  semanticNovelty:        0.XX (consecutive low: N) [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  contradictionDensity:   0.XX [SUPPORTS_STOP|PREVENTS_STOP]
  citationOverlap:        0.XX (consecutive high: N) [SUPPORTS_STOP|PREVENTS_STOP|INSUFFICIENT_DATA]
  semanticVerdict:        [all_support_stop|mixed|all_prevent_stop|insufficient_data]

Stuck recovery attempts: N (recovered: N, failed: N)
Error recovery tiers used: [list or "none"]
```

This report is included in the final JSONL entry and displayed to the user.

<!-- /ANCHOR:convergence-reporting -->

---

<!-- ANCHOR:review-mode-convergence -->
## 10. REVIEW MODE CONVERGENCE

Review mode uses a severity-weighted variant of the convergence algorithm. Instead of measuring "new information" against research questions, it measures "new findings" against the simplified four-dimension review model and machine-verifiable traceability coverage.

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

### 10.2 Review Taxonomy and Thresholds

The simplified review model uses four dimensions and three binary quality gates.

| Dimension | Role in Convergence | Notes |
|-----------|----------------------|-------|
| Correctness | Required coverage | Logic, invariants, state transitions, observable behavior |
| Security | Required coverage | Trust boundaries, authz/authn, input handling, exploit paths |
| Traceability | Coverage signal + traceability protocols | Spec alignment, checklist evidence, cross-reference integrity |
| Maintainability | Coverage signal | Patterns, clarity, documentation quality, safe follow-on change cost |

| Setting | Value | Purpose |
|---------|-------|---------|
| `rollingStopThreshold` | `0.08` | STOP vote threshold for the rolling-average signal |
| `noProgressThreshold` | `0.05` | Stuck/no-progress threshold for recovery classification |
| `dimensionCoverage.weight` | `0.45` | Highest-weight convergence signal |
| `coverageAge.minStabilizationPasses` | `1` | Coverage can vote STOP only after at least one stabilization pass |
| `compositeStopScore` | `0.60` | Weighted stop-score needed before guard evaluation |

### 10.3 shouldContinue_review() Pseudocode

```
function shouldContinue_review(state, config):
  iterations = state.iterations
  evidenceIterations = [i for i in iterations if i.status != "thought"]

  if len(iterations) >= config.maxIterations:
    return {
      action: "STOP",
      stopReason: "maxIterationsReached",
      legacyStopLabel: "max_iterations_reached"
    }

  activeP0 = countActiveFindings(state, ["P0"])
  activeP1 = countActiveFindings(state, ["P1"])
  coverage = computeReviewCoverage(state, config)
  stabilizationPasses = countCoverageStabilizationPasses(evidenceIterations, coverage)

  if coverage.dimensionCoverage == 1.0 and activeP0 == 0 and activeP1 == 0:
    if stabilizationPasses >= config.coverageAge.minStabilizationPasses:
      gateResult = checkReviewQualityGates(state, config, coverage)
      if gateResult.passed:
        return {
          action: "STOP",
          stopReason: "converged",
          legacyStopLabel: "all_dimensions_clean",
          coverage,
          stabilizationPasses
        }

  stuckCount = countConsecutiveStuck_review(evidenceIterations, config.thresholds.noProgressThreshold)
  if stuckCount >= config.stuckThreshold:
    return {
      action: "STUCK_RECOVERY",
      stopReason: "stuckRecovery",
      legacyStopLabel: "stuck_detected",
      stuckCount
    }

  signals = []
  totalWeight = 0

  if len(evidenceIterations) >= 2:
    recent = evidenceIterations[-2:]
    avgRatio = mean(i.newFindingsRatio for i in recent)
    rollingStop = avgRatio < config.thresholds.rollingStopThreshold
    signals.push({ name: "rollingAvg", value: avgRatio, stop: rollingStop, weight: 0.30 })
    totalWeight += 0.30

  if len(evidenceIterations) >= 3:
    allRatios = [i.newFindingsRatio for i in evidenceIterations]
    med = median(allRatios)
    mad = median([abs(r - med) for r in allRatios])
    noiseFloor = mad * 1.4826
    latestRatio = evidenceIterations[-1].newFindingsRatio
    madStop = latestRatio <= noiseFloor
    signals.push({ name: "madScore", value: noiseFloor, stop: madStop, weight: 0.25 })
    totalWeight += 0.25

  coverageStop = (
    coverage.dimensionCoverage == 1.0 and
    coverage.requiredProtocolsCovered and
    stabilizationPasses >= config.coverageAge.minStabilizationPasses
  )
  signals.push({
    name: "dimensionCoverage",
    value: coverage.dimensionCoverage,
    stop: coverageStop,
    weight: 0.45,
    metadata: {
      requiredProtocolsCovered: coverage.requiredProtocolsCovered,
      stabilizationPasses: stabilizationPasses,
    },
  })
  totalWeight += 0.45

  if totalWeight > 0:
    stopScore = sum(s.weight * (1 if s.stop else 0) for s in signals) / totalWeight
    if stopScore >= config.thresholds.compositeStopScore:
      gateResult = checkReviewQualityGates(state, config, coverage)
      if gateResult.passed:
        return {
          action: "STOP",
          stopReason: "converged",
          legacyStopLabel: "composite_converged",
          stopScore,
          signals
        }
      for violation in gateResult.violations:
        appendToJSONL({ type: "event", event: "guard_violation", ...violation })
      return {
        action: "CONTINUE",
        stopReason: "blockedStop",
        legacyStopLabel: "guard_override",
        violations: gateResult.violations,
        signals
      }

  return { action: "CONTINUE", coverage, stabilizationPasses, signals }
```

### 10.4 Review Quality Gates

Three binary gates must pass before a STOP decision is finalized. If any gate fails, the STOP is overridden to CONTINUE.

| Gate | Rule | Fail Action |
|------|------|-------------|
| Evidence | Every active finding has concrete `file:line` evidence and is not inference-only | Block STOP, log `guard_violation` |
| Scope | Findings and reviewed files stay within the declared review scope | Block STOP, log `guard_violation` |
| Coverage | Configured dimensions and required traceability protocols must be covered before STOP is allowed | Block STOP, log `guard_violation` |

```
function checkReviewQualityGates(state, config, coverage):
  violations = []

  for f in state.findings where f.status == "active":
    if not f.hasFileLineCitation or f.evidenceType == "inference-only":
      violations.push({ gate: "evidence", findingId: f.id,
                        detail: "Active finding lacks concrete evidence or relies only on inference" })

  reviewScope = resolveReviewScope(config.reviewTarget, config.reviewTargetType)
  for f in state.findings where f.status == "active":
    if f.filePath not in reviewScope:
      violations.push({ gate: "scope", findingId: f.id,
                        detail: "Finding outside declared review scope" })

  if coverage.dimensionCoverage < 1.0:
    violations.push({ gate: "coverage", detail: "Not all configured review dimensions are covered" })
  if not coverage.requiredProtocolsCovered:
    violations.push({ gate: "coverage", detail: "Required traceability protocols are incomplete" })

  if len(violations) > 0:
    return { passed: false, violations }
  return { passed: true }
```

### 10.5 Replay Validation

Replay validation verifies that convergence decisions are reproducible from disk state alone.

1. Read `deep-research-state.jsonl` and select review-mode iteration records in run order.
2. Recompute `newFindingsRatio`, rolling-average votes, MAD votes, and coverage votes from the stored JSONL fields only.
3. Recompute `traceabilityChecks.summary` and confirm required protocol statuses match the recorded coverage vote.
4. Re-run the evidence, scope, and coverage gates against the stored findings and scope data.
5. Compare the replayed decision and stop reason to the recorded synthesis event.

Replay passes only when the recomputed decision, thresholds, and gate outcomes agree with the persisted result.

### 10.6 Review Stuck Recovery

**Threshold:** 2 consecutive no-progress iterations. Review mode uses `noProgressThreshold = 0.05`, not the rolling stop threshold.

#### Failure Modes and Recovery Strategies

| Failure Mode | Detection | Recovery Strategy |
|-------------|-----------|-------------------|
| Same dimension stuck | Last 2 iterations reviewed the same dimension and both ratios are `< 0.05` | **Change granularity:** if reviewing at file level, zoom into functions; if reviewing functions, zoom out to module level |
| Traceability plateau | Required protocols remain partial while ratios stay `< 0.05` | **Protocol-first replay:** re-run the unresolved traceability protocol directly against the conflicting artifacts |
| Low-value advisory churn | Last 2 iterations found only P2 work | **Escalate severity review:** explicitly search for P0/P1 patterns or downgrade unsupported severity claims |

#### Selection Logic

```
function selectReviewRecoveryStrategy(stuckIterations, state, config):
  lastFocuses = [i.focus for i in stuckIterations[-2:]]

  // Same dimension stuck? Change granularity
  if len(set(lastFocuses)) <= 1:
    return { strategy: "change_granularity", dimension: lastFocuses[0] }

  if hasRequiredProtocolPlateau(state.traceabilityChecks):
    return { strategy: "protocol_first_replay" }

  // Default: escalate severity
  return { strategy: "escalate_severity_review" }
```

#### Recovery Evaluation
- If recovery iteration finds any new P0/P1 or materially advances required traceability coverage: recovery successful. Reset stuck count. Continue.
- If recovery iteration finds only P2 or nothing: recovery failed. If all dimensions are already covered, exit to synthesis. Otherwise, move to the next unreviewed dimension.

### 10.7 Review Edge Cases

#### Clean Codebase
When the review target has no significant issues:
- Continue until all 4 dimensions have been reviewed
- Require `minStabilizationPasses >= 1` before the coverage signal can vote STOP
- Require evidence, scope, and coverage gates to pass

#### Huge Scope
When the review target contains many files:
- Use `maxFilesPerIteration` to limit files reviewed per iteration (default: 10)
- Batch dimensions: review 1-2 dimensions per iteration rather than all 4
- Prioritize security and correctness dimensions first

#### Late P0 Discovery
When a P0 is found in a late iteration:
- The P0 override rule is unchanged: `newFindingsRatio = max(calculated, 0.50)`
- All dimensions that could be affected by the P0 root cause must be re-checked
- Convergence cannot occur with active P0 findings

#### False Convergence
When convergence signals fire but review is incomplete:
- Coverage cannot vote STOP until `minStabilizationPasses >= 1`
- Replay validation must reproduce the same stop reason from JSONL state
- Binary gates prevent STOP when evidence, scope, or required traceability coverage is incomplete

---

<!-- /ANCHOR:review-mode-convergence -->

<!-- ANCHOR:graph-aware-convergence -->
## 11. GRAPH-AWARE CONVERGENCE MODEL

Coverage graph signals provide structural convergence evidence that complements the existing statistical signals. When `graphEvents` are present in iteration records, the reducer builds an in-memory coverage graph and derives additional signals for the legal-stop gate evaluation.

### Graph Convergence Signals

| Signal | Type | Description | Stop Support |
|--------|------|-------------|-------------|
| `graphComponentCount` | number | Number of connected components in the coverage graph | Decreasing count supports stop (graph is consolidating) |
| `graphIsolatedNodes` | number | Nodes with no edges | Increasing count prevents stop (unconnected findings) |
| `graphEdgeDensity` | number (0.0-1.0) | Ratio of actual edges to possible edges | Above 0.3 supports stop |
| `graphAnswerCoverage` | number (0.0-1.0) | Fraction of question nodes with at least one ANSWERS edge | Above 0.85 supports stop |

### Integration with Legal-Stop Gates

Graph signals participate in the existing quality gate as additional sub-checks:

```
qualityGate.checks.graphCoverage = {
  pass: graphAnswerCoverage >= 0.85 AND graphIsolatedNodes <= 2,
  detail: "Graph coverage shows N/M questions answered with K isolated nodes"
}
```

When `graphEvents` are absent (no graph data), the `graphCoverage` sub-check is omitted from the quality gate evaluation. The gate passes or fails based on existing sub-checks alone.

### Weight Calibration Guidance

The relation weights in `coverage-graph-core.cjs` are inherited from the memory graph and carry CALIBRATION-TODO markers. Calibration recommendations:

| Relation | Current Weight | Calibration Notes |
|----------|---------------|-------------------|
| ANSWERS | 1.3 | Appropriate for research; answers are the primary convergence driver |
| CONTRADICTS | 0.8 | Consider lowering to 0.6 if contradiction edges produce false convergence signals |
| CITES | 1.0 | Neutral weight is correct for citation links |
| EXTENDS | 1.1 | Appropriate; extensions add incremental value |
| SUPERSEDES | 1.2 | Appropriate; supersession indicates convergence toward a canonical finding |
| COVERS | 1.3 | Review-specific; appropriate for dimension coverage tracking |
| EVIDENCES | 1.0 | Review-specific; neutral weight for evidence links |
| REMEDIATES | 1.1 | Review-specific; remediation indicates progress toward resolution |
| DEPENDS_ON | 0.9 | Review-specific; slight dampening for dependency chains |

**Tuning protocol**: After 5+ real research sessions with graph events enabled, compare graph-based convergence decisions against statistical-only convergence decisions. If graph signals cause premature or delayed stops relative to the statistical baseline, adjust weights in 0.1 increments and re-evaluate.

### Graceful Degradation

| Condition | Behavior |
|-----------|----------|
| No `graphEvents` in any iteration | Graph signals omitted from legal-stop evaluation |
| MCP unavailable | Reducer rebuilds graph from JSONL; convergence unaffected |
| Fewer than 2 iterations with `graphEvents` | Graph signals marked `insufficient_data` |
| Graph has zero edges | `graphEdgeDensity` = 0.0, `graphCoverage` sub-check skipped |

---

<!-- /ANCHOR:graph-aware-convergence -->

<!-- ANCHOR:optimizer-tunable-fields -->
## OPTIMIZER-TUNABLE THRESHOLDS

The following convergence thresholds are managed by the offline loop optimizer (042.004). Changes to these fields are proposed through the optimizer's advisory-only promotion gate and reviewed by humans before adoption.

### Tunable Fields (Optimizer-Managed)

| Field | Default | Range | Description |
|-------|---------|-------|-------------|
| `convergenceThreshold` | 0.05 | 0.01-0.20 | General convergence sensitivity |
| `stuckThreshold` | 3 | 1-5 | Consecutive no-progress iterations before recovery |
| `maxIterations` | 10 | 3-20 | Hard iteration ceiling |

### Locked Fields (Not Optimizer-Tunable)

The following fields are runtime contracts and MUST NOT be modified by the optimizer:

- `stopReason` enum values and semantics
- `legalStop` record structure
- Lineage fields (`sessionId`, `lineageMode`, `generation`)
- Reducer configuration and file protection policies

### Canonical Manifest

The authoritative registry of tunable vs locked fields is maintained at:
`.opencode/skill/system-spec-kit/scripts/optimizer/optimizer-manifest.json`
<!-- /ANCHOR:optimizer-tunable-fields -->
