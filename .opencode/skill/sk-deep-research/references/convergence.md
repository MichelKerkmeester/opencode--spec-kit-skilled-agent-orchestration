# Convergence Detection Reference

Algorithms and protocols for determining when the deep research loop should stop.

---

## 1. OVERVIEW

Convergence detection prevents infinite loops and stops research when additional iterations yield diminishing returns. The algorithm evaluates multiple signals to make a stop/continue/recovery decision.

---

## 2. THE shouldContinue() ALGORITHM

```
function shouldContinue(state, config):
  iterations = state.iterations  // all iteration records from JSONL

  // Hard stop: max iterations
  if len(iterations) >= config.maxIterations:
    return { action: "STOP", reason: "max_iterations_reached" }

  // Stuck detection: consecutive no-progress
  stuckCount = countConsecutiveStuck(iterations)
  if stuckCount >= config.stuckThreshold:
    return { action: "STUCK_RECOVERY", reason: "stuck_detected", stuckCount }

  // Diminishing returns: average newInfoRatio over last 3 iterations
  if len(iterations) >= 3:
    recent = iterations[-3:]
    avgNewInfo = mean(i.newInfoRatio for i in recent)
    if avgNewInfo < config.convergenceThreshold:
      return { action: "STOP", reason: "converged", avgNewInfo }

  // Completeness: all key questions answered
  unanswered = countUnanswered(state.strategy.keyQuestions)
  if unanswered == 0:
    return { action: "STOP", reason: "all_questions_answered" }

  // Default: continue
  return { action: "CONTINUE", unansweredCount: unanswered }
```

### Decision Priority

Checks are evaluated in this order (first match wins):

1. **Max iterations** (hard cap, always checked first)
2. **Stuck detection** (3+ consecutive no-progress)
3. **Diminishing returns** (convergence threshold)
4. **Completeness** (all questions answered)
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

### Step 3: Evaluate Recovery
After the recovery iteration:
- If `newInfoRatio > 0.05`: Recovery successful. Reset stuck count. Continue.
- If `newInfoRatio <= 0.05`: Recovery failed. Exit to synthesis with gaps documented.

### Step 4: Document
Add to JSONL: `{"type":"event","event":"stuck_recovery","fromIteration":N,"outcome":"recovered|failed"}`

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
Stop reason: [converged | max_iterations | all_questions_answered | stuck_unrecoverable]
Total iterations: N
Questions answered: X / Y (Z%)
Average newInfoRatio (last 3): 0.XX
Stuck recovery attempts: N (recovered: N, failed: N)
```

This report is included in the final JSONL entry and displayed to the user.
