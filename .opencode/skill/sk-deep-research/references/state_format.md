---
title: State Format Reference
description: Canonical specification for all state files used by the deep research loop.
---

# State Format Reference

Canonical specification for all state files used by the deep research loop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep research loop uses 6 state files to maintain continuity across fresh-context iterations:

| File | Format | Purpose | Mutability |
|------|--------|---------|------------|
| `deep-research-config.json` | JSON | Loop parameters | Set at init, read-only after |
| `deep-research-state.jsonl` | JSON Lines | Structured iteration log | Append-only |
| `deep-research-strategy.md` | Markdown | Agent context ("persistent brain") | Updated each iteration |
| `deep-research-dashboard.md` | Markdown | Auto-generated session summary | Auto-generated (read-only) |
| `scratch/iteration-NNN.md` | Markdown | Detailed findings per iteration | Write-once |
| `research.md` | Markdown | Workflow-owned canonical synthesis output | Updated incrementally only when `progressiveSynthesis` is enabled |

All state files live in `{spec_folder}/scratch/` except `research.md` which lives at `{spec_folder}/research.md`. `research.md` is workflow-owned canonical synthesis output.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:config-file -->
## 2. CONFIG FILE (deep-research-config.json)

Created during initialization. Not modified after creation.

```json
{
  "topic": "Research topic string",
  "maxIterations": 10,
  "convergenceThreshold": 0.05,
  "stuckThreshold": 3,
  "maxDurationMinutes": 120,
  "progressiveSynthesis": true,
  "specFolder": "04--agent-orchestration/028-auto-deep-research",
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
| progressiveSynthesis | boolean | No | true | Update research.md after each iteration; synthesis still performs a cleanup pass |
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
| auto-generated | System-managed, overwritten each refresh | Orchestrator rejects agent writes |

The orchestrator validates agent outputs against these declarations before writing. If no `fileProtection` map is present, the default protections from the table above apply implicitly.

---

<!-- /ANCHOR:config-file -->
<!-- ANCHOR:state-log -->
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
| status | string | iteration only | complete, timeout, error, stuck, insight, thought |
| focus | string | iteration only | What this iteration investigated |
| findingsCount | number | iteration only | Number of distinct findings |
| newInfoRatio | number | iteration only | Fraction of new vs redundant info (0.0-1.0) |
| keyQuestions | string[] | iteration only | Questions addressed this iteration |
| answeredQuestions | string[] | iteration only | Questions fully answered this iteration |
| timestamp | ISO 8601 | Yes | Record creation time |
| durationMs | number | iteration only | Iteration execution time in milliseconds |
| segment | number | No | Segment number (default: 1). Groups iterations into logical phases |
| convergenceSignals | object | No | Composite convergence signal values (see below) |
| ruledOut | array | No | Approaches eliminated this iteration (see Negative Knowledge below) |
| noveltyJustification | string | No | Human-readable explanation of what newInfoRatio represents (see below) |
| focusTrack | string | No | Post-hoc grouping label, e.g. `"browser-support"`. Not used for orchestration |

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

### Negative Knowledge (ruledOut)

Iteration records may include a `ruledOut` array documenting approaches that were investigated and eliminated:

```json
{"type":"iteration","run":3,"status":"complete","focus":"Connection pooling","findingsCount":3,"newInfoRatio":0.4,"ruledOut":[{"approach":"HTTP/3 multiplexing","reason":"No server-side support in target environment","evidence":"docs.example.com/protocols#supported"}],"keyQuestions":["What causes latency?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":52000}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| approach | string | Yes | The approach or hypothesis that was eliminated |
| reason | string | Yes | Why it was ruled out |
| evidence | string | No | Source reference supporting the elimination |

Iteration files (`scratch/iteration-NNN.md`) MUST include `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured. These sections feed strategy updates and prevent future iterations from re-exploring eliminated paths.

### Novelty Justification

The optional `noveltyJustification` field provides a human-readable breakdown of what the `newInfoRatio` represents:

```json
{"type":"iteration","run":3,"status":"complete","focus":"Reconnection strategies","findingsCount":4,"newInfoRatio":0.7,"noveltyJustification":"2 new findings on reconnection backoff, 1 refinement of prior keepalive finding","keyQuestions":["How to handle reconnection?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
```

This field aids post-hoc analysis and helps subsequent iterations calibrate expectations. It is not used in convergence computation.

### Focus Track Labels

The optional `focusTrack` field assigns a grouping label to an iteration for post-hoc analysis:

```json
{"type":"iteration","run":4,...,"focusTrack":"browser-support",...}
```

Track labels are free-form strings used for filtering and grouping in dashboards and analysis. They are not used for orchestration or convergence decisions. Multiple iterations may share the same track label.

### Source Strength

Iteration files may annotate individual findings with a `sourceStrength` classification:

| Strength | Meaning | Convergence Impact |
|----------|---------|-------------------|
| `primary` | Authoritative, verified by multiple sources | Counts toward question coverage |
| `secondary` | Corroborating evidence, supports a primary finding | Counts toward question coverage |
| `tentative` | Single source, unverified | Does NOT count toward question coverage |

In iteration file findings sections, annotate inline: `[Finding text] (sourceStrength: primary)`. In JSONL records, source strength is tracked implicitly through the `newInfoRatio` -- tentative findings contribute less to the ratio. The convergence algorithm excludes tentative-only findings when computing `entropyCoverage`.

### Extended Status Values

The iteration `status` field supports the following values:

| Status | When to Use |
|--------|-------------|
| `complete` | Normal iteration that gathered evidence and produced findings |
| `timeout` | Iteration exceeded its time budget before completing |
| `error` | Iteration failed due to tool error, parse failure, or unexpected exception |
| `stuck` | Iteration found no new information and no clear next direction |
| `insight` | Low `newInfoRatio` but contains an important conceptual breakthrough worth preserving |
| `thought` | Analytical-only iteration with reasoning or synthesis but no evidence gathering |

The `insight` status prevents premature convergence when a conceptually significant iteration would otherwise trigger the stuck counter. The `thought` status marks planning or meta-reasoning iterations that should not affect convergence signals.

### Event Records

Events are written by the YAML workflow or diagnostics layer for lifecycle tracking. Canonical coverage includes:

| Event | Emitted By | Status | Purpose | Key Fields |
|-------|------------|--------|---------|------------|
| resumed | workflow | active | Resume after a prior session | fromIteration, timestamp |
| paused | workflow | active | Pause sentinel detected | reason, timestamp |
| direct_mode | workflow | reference-only | Orchestrator absorbed iteration work | iteration, reason, timestamp |
| state_reconstructed | recovery | active | JSONL rebuilt from iteration files | iterationsRecovered, timestamp |
| wave_complete | wave coordinator | reference-only | Parallel wave finished | wave, iterations, medianRatio, timestamp |
| wave_pruned | wave coordinator | reference-only | Low-value wave branch deprioritized | wave, prunedIterations, medianRatio, timestamp |
| breakthrough | wave coordinator | reference-only | Wave branch exceeded 2x average | wave, iteration, ratio, timestamp |
| stuck_recovery | workflow | active | Stuck recovery outcome | fromIteration, outcome, timestamp |
| missing_newInfoRatio | parser | active | Missing ratio defaulted to 0.0 | iteration, timestamp |
| ratio_within_noise | diagnostics | active | Latest ratio fell within MAD floor | iteration, ratio, noiseFloor, timestamp |
| segment_start | workflow | reference-only | Start of a new segment | segment, reason, timestamp |
| synthesis_complete | workflow | active | Final synthesis finished | totalIterations, answeredCount, totalQuestions, stopReason, timestamp |
| guard_violation | guard system | active | Research guard constraint violated | guard, question, detail, timestamp |

Guard violation events are emitted when a research guard detects a quality constraint breach. The `guard` field identifies which guard fired:

```json
{"type":"event","event":"guard_violation","guard":"source_diversity","question":"Q1","detail":"Only 1 source for Q1","timestamp":"2026-03-18T10:20:00Z"}
```

Supported guard values: `source_diversity`, `focus_alignment`, `single_weak_source`. These events are informational and do not halt the loop, but the orchestrator may use them to adjust subsequent iteration focus.

Additional event-specific fields may appear on the JSON line, but the table above is the canonical coverage for emitted events.

### Validation Rules

- Each line must be valid JSON
- `type` field is required on every line
- `run` values must be sequential (1, 2, 3...)
- `newInfoRatio` must be between 0.0 and 1.0
- Count lines where `type === "iteration"` to get current iteration number
- `segment` values must be >= 1
- `segment_start` events must have sequential segment numbers when segmenting is explicitly enabled

### Fault Tolerance

When parsing `deep-research-state.jsonl`, apply defensive reading:

1. **Per-line try/catch**: Wrap each line's `JSON.parse()` in error handling
2. **Skip malformed lines**: On parse failure, skip the line and increment `skippedCount`
3. **Apply defaults** for missing fields on successfully parsed lines:
   - `status ?? "complete"`
   - `newInfoRatio ?? 0.0`
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

### Segment Model (REFERENCE-ONLY)

Segments partition a research session into logical phases without losing history when the runtime supports them.

- **Default**: All iterations belong to segment 1
- **New segment**: Triggered only when an implementation explicitly enables segmenting. Current live workflow keeps a single segment.
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

<!-- /ANCHOR:state-log -->
<!-- ANCHOR:strategy-file -->
## 4. STRATEGY FILE (deep-research-strategy.md)

Updated at the end of each iteration. Template at `assets/deep_research_strategy.md`.

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

<!-- /ANCHOR:strategy-file -->
<!-- ANCHOR:iteration-files -->
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

<!-- /ANCHOR:iteration-files -->
<!-- ANCHOR:research-output -->
## 6. RESEARCH OUTPUT (research.md)

Progressive synthesis updated after each iteration when `progressiveSynthesis` is enabled. Follows the standard 17-section research template. Lives at `{spec_folder}/research.md` (not in scratch/). `research.md` is workflow-owned canonical synthesis output.

### Progressive Update Rules

- After iteration 1: Create with initial findings in relevant sections
- After each subsequent iteration: Append new findings to existing sections
- After convergence: Final synthesis pass to consolidate and remove redundancy
- Never overwrite prior findings; add to them

---

<!-- /ANCHOR:research-output -->
<!-- ANCHOR:dashboard -->
## 7. DASHBOARD (scratch/deep-research-dashboard.md)

Auto-generated summary view of the research session. Never manually edited.

### Location and Lifecycle

- **Path**: `{spec_folder}/scratch/deep-research-dashboard.md`
- **Generated from**: JSONL state log + strategy data only
- **Refresh**: Regenerated after every iteration evaluation
- **Protection**: `"deep-research-dashboard.md": "auto-generated"` in `fileProtection`

### Content Sections

| Section | Source | Description |
|---------|--------|-------------|
| Iteration Table | JSONL iteration records | Run, status, focus, newInfoRatio, findings count, duration |
| Question Status | Strategy + JSONL | Each key question with answered/open status and coverage % |
| Convergence Trend | JSONL convergenceSignals | Rolling average, composite stop score, trajectory |
| Dead Ends | JSONL ruledOut + strategy | Accumulated ruled-out approaches with reasons |
| Next Focus | Strategy file | Current recommended direction for next iteration |
| Source Diversity | JSONL + iteration files | Source count per question, tentative vs primary breakdown |

### Generation Rules

1. Read `deep-research-state.jsonl` and `deep-research-strategy.md` as sole inputs
2. Compute all derived values (coverage %, trend direction) from raw data
3. Overwrite the entire file on each refresh (not append)
4. If JSONL is missing or empty, write a minimal dashboard noting "No iteration data available"
5. The dashboard is read-only for all agents -- modifications are discarded on next refresh

### File Protection

Add to the config `fileProtection` map:

```json
{
  "fileProtection": {
    "deep-research-dashboard.md": "auto-generated"
  }
}
```

The `auto-generated` protection level means the file is system-managed and overwritten by the orchestrator. Agent writes are rejected.

---

<!-- /ANCHOR:dashboard -->
<!-- ANCHOR:file-location-summary -->
## 8. FILE LOCATION SUMMARY

```
{spec_folder}/
  research.md                          # Workflow-owned progressive synthesis (top-level)
  scratch/
    deep-research-config.json           # Loop configuration
    deep-research-state.jsonl           # Structured iteration log
    deep-research-strategy.md           # Agent context / persistent brain
    deep-research-dashboard.md          # Auto-generated session summary (read-only)
    iteration-001.md                   # Iteration 1 findings
    iteration-002.md                   # Iteration 2 findings
    ...
```

<!-- /ANCHOR:file-location-summary -->

---

<!-- ANCHOR:review-mode-state -->
## 8. REVIEW MODE STATE

When `config.mode == "review"`, the state system adapts to track findings, dimensions, and severity instead of research questions and newInfoRatio.

### Review-Specific JSONL Iteration Record

```json
{
  "type": "iteration",
  "run": 3,
  "mode": "review",
  "status": "complete",
  "focus": "D2 Security — auth module",
  "dimensions": ["security"],
  "filesReviewed": ["src/auth/login.ts", "src/auth/session.ts"],
  "findingsCount": 4,
  "newFindingsRatio": 0.75,
  "findingsSummary": { "P0": 1, "P1": 2, "P2": 1 },
  "findingsNew": { "P0": 1, "P1": 1, "P2": 0 },
  "findingsRefined": { "P0": 0, "P1": 1, "P2": 1 },
  "scoreEstimate": 45,
  "timestamp": "2026-03-24T14:30:00Z",
  "durationMs": 52000,
  "noveltyJustification": "1 new P0 auth bypass, 1 new P1 input validation, 1 refined P1 session handling"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| mode | `"review"` | Yes | Discriminator for review-mode records |
| dimensions | string[] | Yes | Review dimensions addressed this iteration |
| filesReviewed | string[] | Yes | Files examined in this iteration |
| findingsSummary | object | Yes | Total active findings by severity: `{ P0, P1, P2 }` |
| findingsNew | object | Yes | Net-new findings this iteration by severity |
| findingsRefined | object | Yes | Refined/upgraded findings this iteration by severity |
| newFindingsRatio | number | Yes | Severity-weighted new findings ratio (0.0-1.0) |
| scoreEstimate | number | No | Provisional quality score (0-100) |
| noveltyJustification | string | No | Human-readable breakdown of what was found |

### Review Config Fields

When `mode == "review"`, additional config fields are present:

```json
{
  "mode": "review",
  "reviewTarget": "specs/030-sk-deep-research-review-mode",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": [
    "correctness", "security", "spec-alignment", "completeness",
    "cross-ref-integrity", "patterns", "documentation-quality"
  ],
  "severityThreshold": "P2",
  "crossReference": {
    "spec": true,
    "checklist": true,
    "agentConsistency": true
  },
  "qualityGateThreshold": 70
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | `"research"` or `"review"` | `"research"` | Session mode discriminator |
| reviewTarget | string or null | null | Path or identifier of the review target |
| reviewTargetType | string | `"spec-folder"` | Type: `spec-folder`, `skill`, `agent`, `track`, `files` |
| reviewDimensions | string[] | all 7 | Dimensions to evaluate |
| severityThreshold | string | `"P2"` | Minimum severity to report (`P0`, `P1`, `P2`) |
| crossReference | object | `{ spec: true, checklist: true, agentConsistency: true }` | Which cross-reference checks to perform |
| qualityGateThreshold | number | 70 | Minimum score (0-100) for PASS verdict |

### Review Strategy Sections Mapping

The review strategy file (`deep-review-strategy.md`) uses adapted sections:

| Strategy Section | Research Equivalent | Purpose |
|-----------------|--------------------:|---------|
| Review Dimensions (remaining) | Key Questions (remaining) | Unchecked dimensions drive next focus |
| Completed Dimensions | Answered Questions | Checked dimensions with score summary |
| Running Findings | (none) | P0/P1/P2 active counts + deltas |
| Cross-Reference Status | (none) | Alignment checks completed |
| Files Under Review | (none) | Per-file coverage state table |
| Review Boundaries | Research Boundaries | Max iterations, thresholds, config |

Sections carried forward unchanged: Topic, Non-Goals, Stop Conditions, What Worked, What Failed, Exhausted Approaches, Ruled Out Directions, Next Focus, Known Context.

### review-report.md Section List

The review synthesis output (`{spec_folder}/review-report.md`) contains 11 sections:

| # | Section | Description |
|---|---------|-------------|
| 1 | Executive Summary | Verdict (PASS/CONDITIONAL/PASS WITH NOTES/FAIL), score, P0/P1/P2 counts, review scope summary |
| 2 | Score Breakdown | Per-dimension weight, score, band, and primary driver table |
| 3 | P0 Findings (Blockers) | Detailed P0 writeups with ID, file:line, evidence, impact, fix recommendation, dimension(s) |
| 4 | P1 Findings (Required) | Same structure as P0 |
| 5 | P2 Findings (Suggestions) | Compact cards with ID, title, file:line, suggestion, dimension |
| 6 | Cross-Reference Results | Results from the 6 cross-reference protocols with check, source, target, result, evidence, status |
| 7 | Coverage Map | Per-file/artifact dimensions reviewed and gaps identified |
| 8 | Positive Observations | Well-implemented patterns, good practices, strong areas |
| 9 | Convergence Report | Stop reason, total iterations, dimension coverage, newFindingsRatio trend, quality guard results |
| 10 | Remediation Priority | Ordered action items: P0 first, then P1, grouped by effort/impact |
| 11 | Release Readiness Verdict | Final verdict (FAIL/CONDITIONAL/PASS WITH NOTES/PASS) with rationale |

### Finding Registry

Each finding across all iterations is tracked in a registry with a unique identifier:

```json
{
  "findingId": "F003",
  "severity": "P1",
  "status": "active",
  "dimension": "security",
  "title": "Missing input validation on user endpoint",
  "file": "src/api/users.ts",
  "line": 42,
  "firstSeen": 2,
  "lastSeen": 4,
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery" },
    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed exploitable via boundary test" }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| findingId | string | Unique identifier (F001, F002, ...) assigned sequentially |
| severity | `"P0"` / `"P1"` / `"P2"` | Current severity level |
| status | `"active"` / `"resolved"` / `"disproved"` | Current finding status |
| dimension | string | Primary review dimension |
| title | string | Short description |
| file | string | File path where the finding applies |
| line | number | Line number (approximate) |
| firstSeen | number | Iteration where first discovered |
| lastSeen | number | Iteration where last referenced |
| transitions | array | Severity and status change history |

Finding deduplication: when an iteration reports a finding with the same file, line range, and root cause as an existing finding, it is treated as a refinement (not a new finding) and the existing findingId is updated rather than creating a duplicate.

<!-- /ANCHOR:review-mode-state -->
