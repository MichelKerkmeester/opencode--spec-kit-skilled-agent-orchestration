# State Format Reference

Canonical specification for all state files used by the deep research loop.

---

## 1. OVERVIEW

The deep research loop uses 5 state files to maintain continuity across fresh-context iterations:

| File | Format | Purpose | Mutability |
|------|--------|---------|------------|
| `deep-research-config.json` | JSON | Loop parameters | Set at init, read-only after |
| `deep-research-state.jsonl` | JSON Lines | Structured iteration log | Append-only |
| `deep-research-strategy.md` | Markdown | Agent context ("persistent brain") | Updated each iteration |
| `scratch/iteration-NNN.md` | Markdown | Detailed findings per iteration | Write-once |
| `research.md` | Markdown | Progressive synthesis | Updated each iteration |

All state files live in `{spec_folder}/scratch/` except `research.md` which lives at `{spec_folder}/research.md`.

---

## 2. CONFIG FILE (deep-research-config.json)

Created during initialization. Not modified after creation.

```json
{
  "topic": "Research topic string",
  "maxIterations": 10,
  "convergenceThreshold": 0.05,
  "stuckThreshold": 3,
  "maxDurationMinutes": 120,
  "specFolder": "05--agent-orchestration/028-auto-deep-research",
  "createdAt": "2026-03-18T10:00:00Z",
  "status": "initialized",
  "executionMode": "auto"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| topic | string | Yes | -- | Research topic or question |
| maxIterations | number | No | 10 | Hard cap on loop iterations |
| convergenceThreshold | number | No | 0.05 | Stop when avg newInfoRatio below this |
| stuckThreshold | number | No | 3 | Consecutive no-progress iterations before recovery |
| maxDurationMinutes | number | No | 120 | Hard timeout for entire loop |
| specFolder | string | Yes | -- | Spec folder path (relative to specs/) |
| createdAt | ISO 8601 | Yes | -- | Session start timestamp |
| status | string | Yes | "initialized" | initialized, running, converged, stuck, complete, error |
| executionMode | string | No | "auto" | auto or confirm |

---

## 3. STATE LOG (deep-research-state.jsonl)

Append-only JSON Lines file. One JSON object per line.

### Line 1: Config Record

```json
{"type":"config","topic":"API response time optimization","maxIterations":10,"convergenceThreshold":0.05,"createdAt":"2026-03-18T10:00:00Z","specFolder":"028-auto-deep-research"}
```

### Iteration Records

```json
{"type":"iteration","run":1,"status":"complete","focus":"Initial broad survey","findingsCount":5,"newInfoRatio":1.0,"keyQuestions":["What causes latency?","Where are bottlenecks?"],"answeredQuestions":["What causes latency?"],"timestamp":"2026-03-18T10:05:00Z","durationMs":45000}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | "config", "iteration", or "event" | Yes | Record type discriminator |
| run | number | iteration only | 1-indexed iteration number |
| status | string | iteration only | complete, timeout, error, stuck |
| focus | string | iteration only | What this iteration investigated |
| findingsCount | number | iteration only | Number of distinct findings |
| newInfoRatio | number | iteration only | Fraction of new vs redundant info (0.0-1.0) |
| keyQuestions | string[] | iteration only | Questions addressed this iteration |
| answeredQuestions | string[] | iteration only | Questions fully answered this iteration |
| timestamp | ISO 8601 | Yes | Record creation time |
| durationMs | number | iteration only | Iteration execution time in milliseconds |

### Event Records

Events are written by the YAML workflow (not the agent) for lifecycle tracking:

```json
{"type":"event","event":"resumed","fromIteration":5,"timestamp":"2026-03-18T10:30:00Z"}
{"type":"event","event":"synthesis_complete","totalIterations":7,"answeredRatio":0.85,"stopReason":"converged","timestamp":"2026-03-18T11:00:00Z"}
{"type":"event","event":"stuck_recovery","fromIteration":6,"outcome":"recovered","timestamp":"2026-03-18T10:45:00Z"}
{"type":"event","event":"missing_newInfoRatio","iteration":4,"timestamp":"2026-03-18T10:20:00Z"}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | "event" | Yes | Record type discriminator |
| event | string | Yes | Event name (resumed, synthesis_complete, stuck_recovery, missing_newInfoRatio) |
| fromIteration | number | Some events | Iteration that triggered the event |
| outcome | string | stuck_recovery | recovered or failed |
| totalIterations | number | synthesis_complete | Total completed iterations |
| answeredRatio | number | synthesis_complete | Fraction of questions answered (0.0-1.0) |
| stopReason | string | synthesis_complete | converged, max_iterations, all_questions_answered, stuck_unrecoverable |
| timestamp | ISO 8601 | Yes | Event timestamp |

### Validation Rules

- Each line must be valid JSON
- `type` field is required on every line
- `run` values must be sequential (1, 2, 3...)
- `newInfoRatio` must be between 0.0 and 1.0
- Count lines where `type === "iteration"` to get current iteration number

---

## 4. STRATEGY FILE (deep-research-strategy.md)

Updated at the end of each iteration. Template at `templates/deep-research-strategy.md`.

### Required Sections

| Section | Updated By | Purpose |
|---------|-----------|---------|
| Topic | Init only | Research topic from config |
| Key Questions (remaining) | Each iteration | Unchecked questions drive next focus |
| Answered Questions | Each iteration | Checked questions with answer summary |
| What Worked | Each iteration | Successful approaches for reuse |
| What Failed | Each iteration | Failed approaches to avoid |
| Exhausted Approaches | When approach fully tried | "Do not retry" registry |
| Next Focus | Each iteration | Recommended direction for next iteration |
| Known Context | Init only | Prior work from memory_context() |
| Research Boundaries | Init only | Max iterations, threshold from config |

### Update Protocol

1. Read current strategy.md
2. Move newly answered questions from "remaining" to "answered" with `[x]` and summary
3. Add entries to "What Worked" or "What Failed" with iteration number
4. If an approach is fully exhausted, move to "Exhausted Approaches"
5. Set "Next Focus" based on remaining questions and successful approaches

---

## 5. ITERATION FILES (scratch/iteration-NNN.md)

Write-once files. One per iteration, named with zero-padded 3-digit number.

### Naming Convention

```
scratch/iteration-001.md
scratch/iteration-002.md
scratch/iteration-003.md
```

### Structure

```markdown
# Iteration [N]: [Focus Area]

## Focus
[What this iteration investigated]

## Findings
1. [Finding with source citation]
2. [Finding with source citation]

## Sources Consulted
- [URL or file:line reference]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Recommended Next Focus
[What to investigate next, based on gaps discovered]
```

---

## 6. RESEARCH OUTPUT (research.md)

Progressive synthesis updated after each iteration. Follows the standard 17-section research template. Lives at `{spec_folder}/research.md` (not in scratch/).

### Progressive Update Rules

- After iteration 1: Create with initial findings in relevant sections
- After each subsequent iteration: Append new findings to existing sections
- After convergence: Final synthesis pass to consolidate and remove redundancy
- Never overwrite prior findings; add to them

---

## 7. FILE LOCATION SUMMARY

```
{spec_folder}/
  research.md                          # Progressive synthesis (top-level)
  scratch/
    deep-research-config.json           # Loop configuration
    deep-research-state.jsonl           # Structured iteration log
    deep-research-strategy.md           # Agent context / persistent brain
    iteration-001.md                   # Iteration 1 findings
    iteration-002.md                   # Iteration 2 findings
    ...
```
