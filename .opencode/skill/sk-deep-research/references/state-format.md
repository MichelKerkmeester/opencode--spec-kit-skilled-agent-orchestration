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
| fileProtection | object | No | -- | Mutability declarations for state files (see below) |

### File Protection Map

The config file may include a `fileProtection` map declaring mutability constraints for state files:

```json
{
  "topic": "...",
  "maxIterations": 10,
  "fileProtection": {
    "deep-research-config.json": "immutable",
    "deep-research-state.jsonl": "append-only",
    "deep-research-strategy.md": "mutable",
    "iteration-*.md": "write-once",
    "research.md": "mutable"
  }
}
```

| Protection Level | Meaning | Enforcement |
|-----------------|---------|-------------|
| immutable | Cannot be modified after creation | Orchestrator rejects any write |
| append-only | New content added at end only | Orchestrator rejects overwrite/edit |
| mutable | Can be read, edited, overwritten | No restrictions |
| write-once | Created once, never modified | Orchestrator rejects edits to existing |

The orchestrator validates agent outputs against these declarations before writing. If no `fileProtection` map is present, the default protections from the table above apply implicitly.

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
| segment | number | No | Segment number (default: 1). Groups iterations into logical phases |
| convergenceSignals | object | No | Composite convergence signal values (see below) |

### Convergence Signal Fields

When the composite convergence algorithm runs (see convergence.md), signal values are recorded in the iteration record:

```json
{"type":"iteration","run":5,...,"convergenceSignals":{"rollingAvg":0.12,"madScore":0.08,"entropyCoverage":0.71,"compositeStop":0.42}}
```

| Field | Type | Description |
|-------|------|-------------|
| rollingAvg | number | Rolling average of last 3 newInfoRatio values |
| madScore | number | MAD-based noise floor value |
| entropyCoverage | number | Question coverage ratio (0.0-1.0) |
| compositeStop | number | Weighted stop score (stop if > 0.60) |

All fields are optional. Omitted when fewer than 3 iterations exist (insufficient data for composite). Backward compatible: old records without this field parse normally.

### Event Records

Events are written by the YAML workflow (not the agent) for lifecycle tracking:

```json
{"type":"event","event":"resumed","fromIteration":5,"timestamp":"2026-03-18T10:30:00Z"}
{"type":"event","event":"synthesis_complete","totalIterations":7,"answeredRatio":0.85,"stopReason":"converged","timestamp":"2026-03-18T11:00:00Z"}
{"type":"event","event":"stuck_recovery","fromIteration":6,"outcome":"recovered","timestamp":"2026-03-18T10:45:00Z"}
{"type":"event","event":"missing_newInfoRatio","iteration":4,"timestamp":"2026-03-18T10:20:00Z"}
{"type":"event","event":"segment_start","segment":2,"reason":"User requested new research angle","timestamp":"2026-03-18T12:00:00Z"}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | "event" | Yes | Record type discriminator |
| event | string | Yes | Event name (resumed, synthesis_complete, stuck_recovery, missing_newInfoRatio, segment_start) |
| fromIteration | number | Some events | Iteration that triggered the event |
| outcome | string | stuck_recovery | recovered or failed |
| totalIterations | number | synthesis_complete | Total completed iterations |
| answeredRatio | number | synthesis_complete | Fraction of questions answered (0.0-1.0) |
| stopReason | string | synthesis_complete | converged, max_iterations, all_questions_answered, stuck_unrecoverable |
| segment | number | segment_start | Segment number being started |
| reason | string | segment_start | Why the new segment was created |
| timestamp | ISO 8601 | Yes | Event timestamp |

### Validation Rules

- Each line must be valid JSON
- `type` field is required on every line
- `run` values must be sequential (1, 2, 3...)
- `newInfoRatio` must be between 0.0 and 1.0
- Count lines where `type === "iteration"` to get current iteration number
- `segment` values must be >= 1
- `segment_start` events must have sequential segment numbers

### Fault Tolerance

When parsing `deep-research-state.jsonl`, apply defensive reading:

1. **Per-line try/catch**: Wrap each line's `JSON.parse()` in error handling
2. **Skip malformed lines**: On parse failure, skip the line and increment `skippedCount`
3. **Apply defaults** for missing fields on successfully parsed lines:
   - `status ?? "complete"`
   - `newInfoRatio ?? 0`
   - `findingsCount ?? 0`
   - `focus ?? "unknown"`
   - `keyQuestions ?? []`
   - `answeredQuestions ?? []`
4. **Log warning** after processing: if `skippedCount > 0`:
   `"Warning: {skippedCount} of {totalLines} JSONL lines were malformed and skipped."`
5. **Minimum viable state**: At least 1 valid config record + 0 or more iteration records. If config record is missing, attempt State Recovery (see below).

This ensures the research loop continues even after partial state corruption. The convergence algorithm operates on valid entries only.

### State Recovery from Iteration Files

When the JSONL is missing or entirely unparseable, reconstruct state from iteration files:

1. **Scan** `scratch/iteration-*.md` files, sorted by filename
2. **Parse** each file's `## Assessment` section to extract:
   - `newInfoRatio` from "New information ratio: X.XX"
   - `keyQuestions` from "Questions addressed: [list]"
   - `answeredQuestions` from "Questions answered: [list]"
3. **Extract** run number from filename: `iteration-003.md` -> `run: 3`
4. **Extract** focus from the `## Focus` section or the `# Iteration N: [Focus]` heading
5. **Reconstruct** JSONL records:
   ```json
   {"type":"iteration","run":3,"status":"reconstructed","focus":"extracted focus","findingsCount":0,"newInfoRatio":0.XX,"keyQuestions":[],"answeredQuestions":[],"timestamp":"unknown"}
   ```
6. **Write** reconstructed JSONL file
7. **Log** event: `{"type":"event","event":"state_reconstructed","iterationsRecovered":N}`

**Limitations**: Reconstructed state lacks `durationMs`, exact `timestamp`, and `findingsCount`. The `status: "reconstructed"` flag distinguishes recovered records from originals. The convergence algorithm treats reconstructed records identically to complete records for signal computation.

### Segment Model

Segments partition a research session into logical phases without losing history.

- **Default**: All iterations belong to segment 1
- **New segment**: Triggered by `:restart` mode or explicit user request. Creates a `segment_start` event
- **Convergence filtering**: The convergence algorithm filters by current segment when computing signals
- **Cross-segment**: Full JSONL read (no segment filter) provides complete history for synthesis
- **Validation**: `segment` values must be >= 1 and sequential within a session

Example multi-segment session:
```json
{"type":"config","topic":"API optimization",...}
{"type":"iteration","run":1,"segment":1,"status":"complete",...}
{"type":"iteration","run":2,"segment":1,"status":"complete",...}
{"type":"event","event":"segment_start","segment":2,"reason":"Pivoting to caching strategies"}
{"type":"iteration","run":3,"segment":2,"status":"complete",...}
{"type":"iteration","run":4,"segment":2,"status":"complete",...}
```

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

## Reflection
- What worked and why: [approach that yielded results + causal explanation]
- What did not work and why: [approach that failed + root cause]
- What I would do differently: [specific adjustment for next iteration]

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
