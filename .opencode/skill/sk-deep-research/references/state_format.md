---
title: State Format Reference
description: Canonical specification for all state files used by the deep research loop.
---

# State Format Reference

Canonical specification for all state files used by the deep research loop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep research loop uses 6 primary state files plus one reducer-generated registry to maintain continuity across fresh-context iterations:

| File | Format | Purpose | Mutability |
|------|--------|---------|------------|
| `deep-research-config.json` | JSON | Loop parameters | Set at init, read-only after |
| `deep-research-state.jsonl` | JSON Lines | Structured iteration log | Append-only |
| `deep-research-strategy.md` | Markdown | Agent context ("persistent brain") | Updated each iteration |
| `deep-research-dashboard.md` | Markdown | Auto-generated session summary | Auto-generated (read-only) |
| `findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings | Auto-generated (read-only) |
| `{artifact_dir}/iterations/iteration-NNN.md` | Markdown | Detailed findings per iteration | Write-once |
| `{artifact_dir}/research.md` | Markdown | Workflow-owned canonical synthesis output | Updated incrementally only when `progressiveSynthesis` is enabled |

Research mode stores its runtime packet under the canonical `{artifact_dir}` resolved by `resolveArtifactRoot(specFolder, 'research')` from `.opencode/skill/system-spec-kit/shared/review-research-paths.cjs`. For root packets this resolves to `{spec_folder}/research/`. For child phases and sub-phases it resolves to a local packet directory under `{spec_folder}/research/{packet}/`, and prompts, state, deltas, iteration findings, and canonical synthesis all live under that same packet directory. `{artifact_dir}/research.md` is workflow-owned canonical synthesis output.

The canonical pause sentinel is `{artifact_dir}/.deep-research-pause`. Legacy names may be consumed during the migration window, but new writes must use the canonical `deep-research-*` names.

Runtime capability matrix references for parity-sensitive surfaces:
- Human-readable matrix: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Machine-readable matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`

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
  "resource_map_present": false,
  "specFolder": "04--agent-orchestration/028-auto-deep-research",
  "createdAt": "2026-03-18T10:00:00Z",
  "status": "initialized",
  "executionMode": "auto",
  "lineage": {
    "sessionId": "dr-2026-03-18T10-00-00Z",
    "parentSessionId": null,
    "lineageMode": "new",
    "generation": 1,
    "continuedFromRun": null
  }
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| topic | string | Yes | -- | Research topic or question |
| maxIterations | number | No | 10 | Hard cap on loop iterations |
| convergenceThreshold | number | No | 0.05 | Stop when avg newInfoRatio below this |
| stuckThreshold | number | No | 3 | Consecutive no-progress iterations before recovery |
| maxDurationMinutes | number | No | 120 | Hard timeout for entire loop |
| progressiveSynthesis | boolean | No | true | Update research/research.md after each iteration; synthesis still performs a cleanup pass |
| resource_map_present | boolean | No | false | True only when `{specFolder}/resource-map.md` existed during init; drives Known Context injection, exclusion-set prompt guidance, and final References citation |
| specFolder | string | Yes | -- | Spec folder path (relative to specs/) |
| createdAt | ISO 8601 | Yes | -- | Session start timestamp |
| status | string | Yes | "initialized" | initialized, running, converged, stuck, complete, error |
| executionMode | string | No | "auto" | auto or confirm |
| lineage.sessionId | string | Yes | -- | Stable identifier for the current lineage segment |
| lineage.parentSessionId | string or null | Yes | null | Parent lineage when restarting, forking, or reopening |
| lineage.lineageMode | string | Yes | "new" | `new`, `resume`, `restart`, `fork`, or `completed-continue` |
| lineage.generation | number | Yes | 1 | Monotonic generation counter |
| lineage.continuedFromRun | number or null | No | null | Run number where a resumed or reopened segment continues |
| originalKeyQuestions | string[] | No | -- | Snapshot of the initial key questions at session init, used by the focus-alignment guard to detect drift |
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
    "research/research.md": "mutable"
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
| toolsUsed | string[] | No | iteration only | High-level tool names used during the iteration |
| sourcesQueried | string[] | No | iteration only | URLs, file paths, or memory anchors consulted during the iteration |
| segment | number | No | Segment number (default: 1). Groups iterations into logical phases |
| convergenceSignals | object | No | Composite convergence signal values (see below) |
| ruledOut | array | No | Approaches eliminated this iteration (see Negative Knowledge below) |
| noveltyJustification | string | No | Human-readable explanation of what newInfoRatio represents (see below) |
| focusTrack | string | No | Post-hoc grouping label, e.g. `"browser-support"`. Not used for orchestration |
| sourceStrength | string | No | Overall evidence quality class for this iteration: `"strong"`, `"moderate"`, or `"weak"`. Used by the weak-source guard to detect single-weak-source dependence without implicit JSONL analysis |
| graphEvents | array | No | Coverage graph mutations emitted during the iteration. See Graph Events below for the typed payload, namespace rules, and collision regression reference |

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

Iteration files (`research/iterations/iteration-NNN.md`) MUST include `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured. These sections feed reducer-owned strategy and registry refreshes and prevent future iterations from re-exploring eliminated paths.

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

### Graph Events

The optional `graphEvents` array records the coverage graph mutations an iteration emits. The MCP coverage graph handlers (`mcp_server/handlers/coverage-graph/upsert.ts`) consume these events and persist them into `deep-loop-graph.sqlite` where they become the source of truth for graph-assisted convergence.

```json
{"type":"iteration","run":4,"status":"complete","focus":"Reconnection strategies","findingsCount":3,"newInfoRatio":0.55,"graphEvents":[{"type":"question","id":"q-reconnect","label":"How should the client retry after a disconnect?"},{"type":"finding","id":"f-backoff","label":"Exponential backoff converges under jitter"},{"type":"edge","id":"e-answers-reconnect","relation":"ANSWERS","source":"f-backoff","target":"q-reconnect"}],"keyQuestions":["How should the client retry after a disconnect?"],"answeredQuestions":[],"timestamp":"2026-03-18T10:15:00Z","durationMs":48000}
```

#### Event payload shape

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | `"question"` \| `"finding"` \| `"claim"` \| `"source"` \| `"edge"` | Yes | Research-loop node kind or the literal `"edge"` for relation rows |
| id | string | Yes | Caller-chosen logical id. Must be unique **within** a single `(specFolder, loopType, sessionId)` namespace; see Namespace Rules below |
| label | string | Yes | Human-readable name/caption for dashboards and synthesis |
| relation | `"ANSWERS"` \| `"SUPPORTS"` \| `"CONTRADICTS"` \| `"SUPERSEDES"` \| `"DERIVED_FROM"` \| `"COVERS"` \| `"CITES"` | edges only | Research relation type. Required when `type == "edge"` |
| source | string | edges only | `id` of the source node inside the current namespace |
| target | string | edges only | `id` of the target node inside the current namespace. Self-loops are rejected by the upsert handler |
| metadata | object | No | Optional free-form metadata persisted alongside the row |

#### Namespace Rules (REQ-028, REQ-029)

`graphEvents` entries are scoped by the session that emits them. The coverage graph DB uses a composite primary key of `(spec_folder, loop_type, session_id, id)`, so two independent sessions in the same spec folder MAY reuse the same logical `id` without collision — each session gets an independent row.

Concrete obligations for producers:

1. **Session-local uniqueness**: within one session, an `id` must resolve to exactly one node (or edge) for its entire lifetime. Re-emitting the same `id` is an upsert against the existing row in that session only.
2. **No cross-session global uniqueness requirement**: callers MUST NOT prefix ids with the session id or random salt to "avoid collisions". The DB layer handles namespace isolation; salting ids only makes provenance harder to read.
3. **Edge source/target locality**: `source` and `target` in an edge event must name nodes already present in the same namespace. Cross-session edges are not a supported shape.
4. **Persistence gate**: the reducer refuses to roll graph events forward when a record is missing `sessionId` on the surrounding iteration record, because the DB cannot route the write.

The collision regression in `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts` ("shared-ID collisions" block) exercises this contract directly: two sessions upsert identical node and edge ids, and both rows must survive independently.

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
| resumed | workflow | active | Resume after a prior active session (same sessionId, no archive) | mode, sessionId, parentSessionId, lineageMode, continuedFromRun, generation, archivedPath (null), timestamp |
| restarted | workflow | active | Archive the prior packet and start a new generation with a fresh sessionId | mode, sessionId, parentSessionId, lineageMode, continuedFromRun, generation, archivedPath, timestamp |
| forked | workflow | deferred | Reserved for a future lineage feature; not emitted by the current runtime | — |
| completed_continue | workflow | deferred | Reserved for a future lineage feature; not emitted by the current runtime | — |
| graph_convergence | workflow + graph MCP | active | Persist the coverage-graph stop verdict for the current research run before the inline convergence vote is merged | mode, run, decision, signals, blockers, timestamp, sessionId, generation |
| blocked_stop | workflow | active | Legal-stop candidate was blocked and the loop must continue | mode, run, blockedBy, gateResults, recoveryStrategy, timestamp, sessionId, generation |
| userPaused | workflow | active | Pause sentinel detected and normalized to the frozen stop-reason enum | mode, run, stopReason, sentinelPath, timestamp, sessionId, generation |
| migration | workflow | active | Legacy artifact consumed and canonical name written | legacyPath, canonicalPath, timestamp |
| direct_mode | workflow | reference-only | Orchestrator absorbed iteration work | iteration, reason, timestamp |
| state_reconstructed | recovery | active | JSONL rebuilt from iteration files | iterationsRecovered, timestamp |
| wave_complete | wave coordinator | reference-only | Parallel wave finished | wave, iterations, medianRatio, timestamp |
| wave_pruned | wave coordinator | reference-only | Low-value wave branch deprioritized | wave, prunedIterations, medianRatio, timestamp |
| breakthrough | wave coordinator | reference-only | Wave branch exceeded 2x average | wave, iteration, ratio, timestamp |
| stuckRecovery | workflow | active | Stuck recovery outcome normalized to the frozen stop-reason enum | mode, run, stopReason, fromIteration, outcome, timestamp, sessionId, generation |
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

#### Canonical graph_convergence event

```json
{"type":"event","event":"graph_convergence","mode":"research","run":7,"decision":"STOP_BLOCKED","signals":{"questionCoverage":0.86,"claimVerificationRate":0.78,"contradictionDensity":0.04,"blendedScore":0.68},"blockers":[{"name":"sourceDiversity","severity":"high","detail":"Only 2 distinct corroborating sources cover the active claim cluster."}],"timestamp":"2026-04-11T11:55:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Always `event` |
| event | string | Yes | Always `graph_convergence` |
| mode | string | Yes | Always `research` for this loop family |
| run | number | Yes | 1-indexed loop iteration whose graph convergence vote was evaluated |
| decision | string or null | Yes | Graph verdict: `CONTINUE`, `STOP_ALLOWED`, `STOP_BLOCKED`, or null when unavailable |
| signals | object | Yes | Graph signal bundle returned by `deep_loop_graph_convergence`, including `blendedScore` when available |
| blockers | array | Yes | Blocking guards returned by the graph convergence tool; empty array when STOP is not blocked |
| timestamp | ISO 8601 | Yes | Event creation time |
| sessionId | string | Yes | Active lineage session identifier |
| generation | number | Yes | Active lineage generation |

#### Combined-stop rule

Research mode now evaluates two stop layers in order:

1. The graph MCP writes a single-line `graph_convergence` event before the inline convergence vote runs.
2. The existing inline 3-signal convergence vote still computes the inline STOP candidate.
3. The loop may STOP for `composite_converged` only when the inline vote says STOP and the latest graph decision is `STOP_ALLOWED` or absent.
4. If the inline vote says STOP but the latest graph decision is `STOP_BLOCKED`, the workflow must emit `blocked_stop` and continue with the recovery strategy instead of stopping.

#### Canonical blocked-stop event

```json
{"type":"event","event":"blocked_stop","mode":"research","run":7,"blockedBy":["keyQuestionCoverage","evidenceDensity"],"gateResults":{"convergence":{"pass":true,"score":0.72},"keyQuestionCoverage":{"pass":false,"answered":5,"total":7},"evidenceDensity":{"pass":false,"sources":2},"hotspotSaturation":{"pass":true}},"recoveryStrategy":"Collect evidence for the remaining uncovered question cluster.","timestamp":"2026-04-11T12:00:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Always `event` |
| event | string | Yes | Always `blocked_stop` |
| mode | string | Yes | Always `research` for this loop family |
| run | number | Yes | 1-indexed loop iteration whose stop candidate was blocked |
| blockedBy | string[] | Yes | Gate names that vetoed legal STOP |
| gateResults | object | Yes | Replayable gate bundle with `convergence`, `keyQuestionCoverage`, `evidenceDensity`, and `hotspotSaturation` results |
| recoveryStrategy | string | Yes | One-line recovery hint for the next loop turn |
| timestamp | ISO 8601 | Yes | Event creation time |
| sessionId | string | Yes | Active lineage session identifier |
| generation | number | Yes | Active lineage generation |

#### Canonical userPaused event

```json
{"type":"event","event":"userPaused","mode":"research","run":7,"stopReason":"userPaused","sentinelPath":"specs/042/research/.deep-research-pause","timestamp":"2026-04-11T12:05:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Always `event` |
| event | string | Yes | Always `userPaused` |
| mode | string | Yes | Always `research` for this loop family |
| run | number | Yes | Iteration index active when pause was detected |
| stopReason | string | Yes | Always `userPaused` |
| sentinelPath | string | Yes | Absolute or packet-relative pause sentinel path that triggered the halt |
| timestamp | ISO 8601 | Yes | Event creation time |
| sessionId | string | Yes | Active lineage session identifier |
| generation | number | Yes | Active lineage generation |

#### Canonical stuckRecovery event

```json
{"type":"event","event":"stuckRecovery","mode":"research","run":7,"stopReason":"stuckRecovery","fromIteration":7,"outcome":"recovered","timestamp":"2026-04-11T12:10:00Z","sessionId":"dr-2026-04-11T12-00-00Z","generation":2}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Always `event` |
| event | string | Yes | Always `stuckRecovery` |
| mode | string | Yes | Always `research` for this loop family |
| run | number | Yes | Iteration index that entered recovery |
| stopReason | string | Yes | Always `stuckRecovery` |
| fromIteration | number | Yes | Iteration that triggered the recovery branch |
| outcome | string | Yes | Recovery outcome such as `recovered` or `failed` |
| timestamp | ISO 8601 | Yes | Event creation time |
| sessionId | string | Yes | Active lineage session identifier |
| generation | number | Yes | Active lineage generation |

#### Emission-time normalization rule

Raw `paused` and `stuck_recovery` labels are legacy-only aliases. The live workflow MUST rewrite them at emission time to `userPaused` and `stuckRecovery` respectively, and MUST persist the normalized `stopReason` enum value on the JSONL line.

### Lineage Schema

Every active packet must be reconstructable from these lineage keys:

| Key | Meaning |
|-----|---------|
| `sessionId` | Stable identifier for the active lineage segment |
| `parentSessionId` | Immediate parent lineage when a new segment or branch is created |
| `lineageMode` | How the current segment began |
| `generation` | Monotonic generation number across restarts and reopenings |
| `continuedFromRun` | Last completed run reused as the continuation boundary |

The workflow may read legacy filenames during migration, but lineage metadata must always be written under canonical names.

### Reducer Contract

The reducer is the synchronization pass that runs after each successful iteration and after each lifecycle transition.

Inputs:
- `latestJSONLDelta`
- `newIterationFile`
- `priorReducedState`

Outputs:
- `findingsRegistry`
- `dashboardMetrics`
- `strategyUpdates`

### Findings Registry (findings-registry.json)

`findings-registry.json` is the reducer-owned research registry. It aggregates open/resolved questions, key findings, negative knowledge, and reducer-derived stop-state signals into a single read-only artifact.

```json
{
  "openQuestions": [],
  "resolvedQuestions": [],
  "keyFindings": [],
  "ruledOutDirections": [],
  "blockedStopHistory": [
    {
      "run": 7,
      "blockedBy": ["keyQuestionCoverage", "evidenceDensity"],
      "gateResults": {
        "convergence": { "pass": true, "score": 0.72 },
        "keyQuestionCoverage": { "pass": false, "answered": 5, "total": 7 },
        "evidenceDensity": { "pass": false, "sources": 2 },
        "hotspotSaturation": { "pass": true }
      },
      "recoveryStrategy": "Collect evidence for the remaining uncovered question cluster.",
      "timestamp": "2026-04-11T12:00:00Z"
    }
  ],
  "graphConvergenceScore": 0.68,
  "graphDecision": "STOP_BLOCKED",
  "graphBlockers": [
    {
      "name": "sourceDiversity",
      "severity": "high",
      "detail": "Only 2 distinct corroborating sources cover the active claim cluster."
    }
  ],
  "metrics": {
    "iterationsCompleted": 7,
    "openQuestions": 2,
    "resolvedQuestions": 5,
    "keyFindings": 14,
    "convergenceScore": 0.72,
    "coverageBySources": {
      "code": 4,
      "memory": 1,
      "other": 2
    }
  }
}
```

Research-specific registry fields:

| Field | Type | Description |
|-------|------|-------------|
| blockedStopHistory | array | One entry per `blocked_stop` event promoted under REQ-014. Reducer preserves append order from the JSONL and exposes `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, and `timestamp` for operator replay. |
| graphConvergenceScore | number | Latest graph convergence blended score surfaced under REQ-013. Derived from the most recent `graph_convergence` event. |
| graphDecision | string or null | Latest graph convergence verdict: `CONTINUE`, `STOP_ALLOWED`, `STOP_BLOCKED`, or null when unavailable. |
| graphBlockers | array | Latest blocking guard bundle returned by the graph convergence tool. Empty array when no blockers were reported. |

Failure modes:
- malformed delta -> skip + warning event
- missing iteration file -> no-op + error event
- schema mismatch -> reject + conflict event

Idempotency:
- identical inputs must produce byte-identical reducer outputs

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

1. **Scan** `research/iterations/iteration-*.md` files, sorted by filename
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
2. Update only the machine-owned sections
3. Move newly answered questions from "remaining" to "answered" with `[x]` and summary
4. Add entries to "What Worked" or "What Failed" with iteration number
5. If an approach is fully exhausted, move to "Exhausted Approaches"
6. Set "Next Focus" based on remaining questions and successful approaches

### Blocked-stop next-focus override

When the most recent loop event is a `blocked_stop` (its timestamp is newer than the latest iteration record), the reducer may drive the `next-focus` anchor directly from that event instead of the last iteration file. In that case the anchor must surface:

```text
BLOCKED on: <blockedBy>
Recovery: <recoveryStrategy>
Address the blocking gates before the next iteration.
```

This keeps the strategy file aligned with the latest recovery path instead of repeating stale iteration guidance.

---

<!-- /ANCHOR:strategy-file -->
<!-- ANCHOR:iteration-files -->
## 5. ITERATION FILES (research/iterations/iteration-NNN.md)

Write-once files. One per iteration, named with zero-padded 3-digit number.

Review mode writes the equivalent files to its own resolved review `{artifact_dir}/iterations/iteration-NNN.md`.

### Naming Convention

```text
research/iterations/iteration-001.md
research/iterations/iteration-002.md
research/iterations/iteration-003.md
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
## 6. RESEARCH OUTPUT (research/research.md)

Progressive synthesis updated after each iteration when `progressiveSynthesis` is enabled. Follows the standard 17-section research template. Lives at `{artifact_dir}/research.md` (not in scratch/). `research.md` is workflow-owned canonical synthesis output.

### Progressive Update Rules

- After iteration 1: Create with initial findings in relevant sections
- After each subsequent iteration: Append new findings to existing sections
- After convergence: Final synthesis pass to consolidate and remove redundancy
- Never overwrite prior findings; add to them
- Mark machine-owned sections explicitly so `completed-continue` can snapshot prior synthesis before reopening
- When `resource_map_present` is true: cite `{spec_folder}/resource-map.md` in the final References section and preserve the init-time snapshot in `Known Context`
- When `resource_map_present` is false: omit the reference and retain the `resource-map.md not present; skipping coverage gate` note in `Known Context`

---

<!-- /ANCHOR:research-output -->
<!-- ANCHOR:dashboard -->
## 7. DASHBOARD (research/deep-research-dashboard.md)

Auto-generated summary view of the research session. Never manually edited.

Review mode writes the equivalent dashboard to its own resolved review packet path.

### Location and Lifecycle

- **Path**: `{artifact_dir}/deep-research-dashboard.md`
- **Generated from**: JSONL state log + strategy data only
- **Refresh**: Regenerated after every iteration evaluation
- **Protection**: `"deep-research-dashboard.md": "auto-generated"` in `fileProtection`

### Content Sections

| Section | Source | Description |
|---------|--------|-------------|
| Iteration Table | JSONL iteration records | Run, status, focus, newInfoRatio, findings count, duration |
| Question Status | Strategy + registry | Each key question with answered/open status and coverage % |
| Convergence Trend | JSONL convergenceSignals + reducer | Rolling average, composite stop score, trajectory |
| Dead Ends | JSONL ruledOut + strategy | Accumulated ruled-out approaches with reasons |
| Next Focus | Strategy file | Current recommended direction for next iteration |
| Source Diversity | Registry metrics | Source count per question and `coverageBySources` summary |

### Blocked-stop and graph convergence surfaces

The reducer-owned dashboard adds two operator-facing sections when the supporting registry data is available:

- **Blocked Stops**: Renders `blockedStopHistory` as an ordered replay log. Each entry shows the blocked iteration, the vetoing gates, the recovery strategy, a brief gate-result summary, and the ISO-8601 event timestamp so operators can trace why STOP was denied under REQ-014.
- **Graph Convergence**: Renders `graphConvergenceScore`, `graphDecision`, and the current `graphBlockers` list from the latest `graph_convergence` event so the dashboard exposes the REQ-013 graph verdict alongside inline convergence metrics.

### Generation Rules

1. Read `deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md` as canonical inputs
2. Compute all derived values (coverage %, trend direction) from raw data
3. Overwrite the entire file on each refresh (not append)
4. If JSONL is missing or empty, write a minimal dashboard noting "No iteration data available"
5. The dashboard is read-only for all agents -- modifications are discarded on next refresh

### File Protection

Add to the config `fileProtection` map:

```json
{
  "fileProtection": {
    "deep-research-dashboard.md": "auto-generated",
    "findings-registry.json": "auto-generated"
  }
}
```

The `auto-generated` protection level means the file is system-managed and overwritten by the orchestrator. Agent writes are rejected.

---

<!-- /ANCHOR:dashboard -->
<!-- ANCHOR:file-location-summary -->
## 8. FILE LOCATION SUMMARY

```text
{artifact_dir}/
  research.md                        # Workflow-owned progressive synthesis
  deep-research-config.json          # Loop configuration
  deep-research-state.jsonl          # Structured iteration log
  deep-research-strategy.md          # Agent context / persistent brain
  deep-research-dashboard.md         # Auto-generated session summary (read-only)
  findings-registry.json             # Reducer-owned question/finding registry
  iterations/
    iteration-001.md                 # Iteration 1 findings
    iteration-002.md                 # Iteration 2 findings
    ...
```

<!-- /ANCHOR:file-location-summary -->

---

<!-- ANCHOR:review-mode-state -->
## 9. REVIEW MODE STATE

When `config.mode == "review"`, the state system adapts to track findings, dimensions, traceability coverage, and adjudicated severity instead of research questions and `newInfoRatio`.

### Review-Specific JSONL Iteration Record

```json
{
  "type": "iteration",
  "run": 3,
  "mode": "review",
  "status": "complete",
  "focus": "D3 Traceability - skill/runtime alignment",
  "dimensions": ["traceability", "maintainability"],
  "filesReviewed": [
    ".opencode/skill/sk-deep-research/README.md",
    ".opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml"
  ],
  "findingsCount": 4,
  "newFindingsRatio": 0.32,
  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
  "findingsRefined": { "P0": 0, "P1": 0, "P2": 2 },
  "traceabilityChecks": {
    "summary": {
      "required": 2,
      "executed": 3,
      "pass": 1,
      "partial": 1,
      "fail": 1,
      "blocked": 0,
      "notApplicable": 0,
      "gatingFailures": 1
    },
    "results": [
      {
        "protocolId": "spec_code",
        "status": "fail",
        "gateClass": "hard",
        "applicable": true,
        "counts": { "pass": 0, "partial": 0, "fail": 1 },
        "evidence": ["README.md:48", "spec_kit_deep-research_review_auto.yaml:511"],
        "findingRefs": ["F004"],
        "summary": "README claimed the old report contract while the workflow still emitted the legacy section set."
      }
    ]
  },
  "timestamp": "2026-03-24T14:30:00Z",
  "durationMs": 52000,
  "noveltyJustification": "1 new P1 contract drift, 1 new P2 template inconsistency, 2 advisory refinements"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| mode | `"review"` | Yes | Discriminator for review-mode records |
| dimensions | string[] | Yes | Review dimensions addressed this iteration |
| filesReviewed | string[] | Yes | Files examined in this iteration |
| findingsSummary | object | Yes | Total active findings by severity: `{ P0, P1, P2 }` |
| findingsNew | object | Yes | Net-new findings this iteration by severity |
| findingsRefined | object | No | Refined or reclassified findings this iteration by severity |
| newFindingsRatio | number | Yes | Severity-weighted new findings ratio (0.0-1.0) |
| traceabilityChecks | object | Yes | Summary counts plus per-protocol traceability results for this iteration |
| noveltyJustification | string | No | Human-readable breakdown of what was found |

### Review Synthesis Event

The final review synthesis appends a review-mode event with machine-verifiable verdict state:

```json
{
  "type": "event",
  "event": "synthesis_complete",
  "mode": "review",
  "totalIterations": 6,
  "verdict": "PASS",
  "activeP0": 0,
  "activeP1": 0,
  "activeP2": 2,
  "dimensionCoverage": 1.0,
  "stopReason": "composite_converged",
  "timestamp": "2026-03-24T15:02:00Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| activeP0 | number | Yes | Active blocker findings at synthesis time |
| activeP1 | number | Yes | Active required findings at synthesis time |
| activeP2 | number | Yes | Active advisory findings at synthesis time |
| dimensionCoverage | number | Yes | Final dimension coverage ratio (0.0-1.0) |

### traceabilityChecks Schema

`traceabilityChecks` is the machine-verifiable traceability payload stored on each review iteration.

```json
{
  "traceabilityChecks": {
    "summary": {
      "required": 2,
      "executed": 3,
      "pass": 1,
      "partial": 1,
      "fail": 1,
      "blocked": 0,
      "notApplicable": 0,
      "gatingFailures": 1
    },
    "results": [
      {
        "protocolId": "checklist_evidence",
        "status": "partial",
        "gateClass": "hard",
        "applicable": true,
        "counts": { "pass": 3, "partial": 1, "fail": 0 },
        "evidence": ["checklist.md:18", "tasks.md:42"],
        "findingRefs": ["F007"],
        "summary": "Most checklist claims were evidenced, but one checked item remained weakly linked."
      }
    ]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| summary.required | number | Yes | Required protocols for this target |
| summary.executed | number | Yes | Protocols executed in this iteration |
| summary.pass | number | Yes | Protocols that passed |
| summary.partial | number | Yes | Protocols that partially passed |
| summary.fail | number | Yes | Protocols that failed |
| summary.blocked | number | Yes | Protocols blocked by missing context or artifacts |
| summary.notApplicable | number | Yes | Protocols skipped as not applicable |
| summary.gatingFailures | number | Yes | Hard-gate failures that would block STOP |
| results[].protocolId | string | Yes | Canonical protocol identifier |
| results[].status | string | Yes | `pass`, `partial`, `fail`, `blocked`, or `notApplicable` |
| results[].gateClass | string | Yes | `hard` or `advisory` |
| results[].applicable | boolean | Yes | Whether the protocol applied to the target |
| results[].counts | object | Yes | Protocol-local summary counts |
| results[].evidence | string[] | No | Supporting file:line or artifact refs |
| results[].findingRefs | string[] | No | Related finding identifiers |
| results[].summary | string | Yes | Human-readable one-line result |

### Review Config Fields

When `mode == "review"`, additional config fields are present:

```json
{
  "mode": "review",
  "reviewTarget": "specs/030-sk-deep-research-review-mode",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": [
    "correctness",
    "security",
    "traceability",
    "maintainability"
  ],
  "severityThreshold": "P2",
  "crossReference": {
    "core": ["spec_code", "checklist_evidence"],
    "overlay": ["feature_catalog_code", "playbook_capability"]
  }
}
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | `"research"` or `"review"` | `"research"` | Session mode discriminator |
| reviewTarget | string or null | null | Path or identifier of the review target |
| reviewTargetType | string | `"spec-folder"` | Type: `spec-folder`, `skill`, `agent`, `track`, `files` |
| reviewDimensions | string[] | all 4 | Dimensions to evaluate |
| severityThreshold | string | `"P2"` | Minimum severity to report (`P0`, `P1`, `P2`) |
| crossReference.core | string[] | `["spec_code", "checklist_evidence"]` | Hard-gated traceability protocols |
| crossReference.overlay | string[] | target-dependent | Advisory protocols enabled for matching targets |

### Review Strategy Sections Mapping

The review strategy file (`deep-review-strategy.md`) uses adapted sections:

| Strategy Section | Research Equivalent | Purpose |
|-----------------|--------------------:|---------|
| Review Dimensions (remaining) | Key Questions (remaining) | Unchecked dimensions drive next focus |
| Completed Dimensions | Answered Questions | Checked dimensions with verdict summary |
| Running Findings | (none) | P0/P1/P2 active counts + deltas |
| Cross-Reference Status | (none) | Core vs overlay protocol status |
| Files Under Review | (none) | Per-file coverage state table |
| Review Boundaries | Research Boundaries | Max iterations, thresholds, config |

Sections carried forward unchanged: Topic, Non-Goals, Stop Conditions, What Worked, What Failed, Exhausted Approaches, Ruled Out Directions, Next Focus, Known Context.

### review-report.md Section List

The review synthesis output lives at the review-mode `{artifact_dir}/review-report.md` and contains 9 core sections plus a conditional `## Resource Map Coverage Gate` section when `resource_map_present` is true:

| # | Section | Description |
|---|---------|-------------|
| 1 | Executive Summary | Verdict (`PASS`, `CONDITIONAL`, `FAIL`), active P0/P1/P2 counts, scope summary, `hasAdvisories` |
| 2 | Planning Trigger | Why the result routes to planning or changelog follow-up |
| 3 | Active Finding Registry | Deduped active findings with evidence, severity, and dimension tags |
| 4 | Remediation Workstreams | Ordered remediation lanes grouped by dependency or area |
| 5 | Spec Seed | Minimal spec updates implied by the findings |
| 6 | Plan Seed | Initial remediation tasks derived from the findings |
| 7 | Traceability Status | Core vs overlay protocol outcomes and unresolved gaps |
| 8 | Resource Map Coverage Gate | Present only when `{spec_folder}/resource-map.md` existed at init; reports touched entries, untouched entries (`expected-by-scope` vs `gap`), and implementation paths absent from the map |
| 9 | Deferred Items | Advisory findings, blocked items, and follow-up checks |
| 10 | Audit Appendix | Coverage, convergence replay, and supporting audit detail |

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
