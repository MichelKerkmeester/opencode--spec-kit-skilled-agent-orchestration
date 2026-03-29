---
title: Deep Review State Format
description: State file schemas for the autonomous deep review loop — config, JSONL log, strategy, iteration files, and review report.
---

# Deep Review State Format

State file schemas for the autonomous deep review loop.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The deep review loop uses 7 state files under `{spec_folder}/review/`:

| File | Format | Mutability |
|------|--------|------------|
| `deep-research-config.json` | JSON | Immutable after init |
| `deep-research-state.jsonl` | JSON Lines | Append-only |
| `deep-review-strategy.md` | Markdown | Updated each iteration |
| `deep-review-dashboard.md` | Markdown | Auto-generated (read-only) |
| `.deep-research-pause` | Sentinel | Created/deleted by user |
| `review-report.md` | Markdown | Updated at synthesis |
| `iterations/iteration-NNN.md` | Markdown | Write-once |

```
{spec_folder}/
  review/
    deep-research-config.json
    deep-research-state.jsonl
    deep-review-strategy.md
    deep-review-dashboard.md
    .deep-research-pause
    review-report.md
    iterations/
      iteration-001.md
      iteration-002.md
      ...
```

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:config-file -->
## 2. CONFIG FILE (deep-research-config.json)

Created during initialization. Not modified after creation.

```json
{
  "topic": "Review of sk-deep-research skill package",
  "mode": "review",
  "reviewTarget": "specs/030-sk-deep-research-review-mode",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": ["correctness", "security", "traceability", "maintainability"],
  "maxIterations": 7,
  "convergenceThreshold": 0.10,
  "stuckThreshold": 2,
  "severityThreshold": "P2",
  "crossReference": {
    "core": ["spec_code", "checklist_evidence"],
    "overlay": ["feature_catalog_code", "playbook_capability"]
  },
  "qualityGateThreshold": true,
  "specFolder": "030-sk-deep-research-review-mode",
  "createdAt": "2026-03-24T14:00:00Z",
  "status": "initialized",
  "executionMode": "auto",
  "fileProtection": {
    "deep-research-config.json": "immutable",
    "deep-research-state.jsonl": "append-only",
    "deep-review-strategy.md": "mutable",
    "deep-review-dashboard.md": "auto-generated",
    ".deep-research-pause": "mutable",
    "review-report.md": "mutable",
    "iteration-*.md": "write-once"
  }
}
```

### Field Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | `"review"` | -- | Session mode discriminator (required) |
| reviewTarget | string | -- | Path or identifier of the review target |
| reviewTargetType | string | `"spec-folder"` | `spec-folder`, `skill`, `agent`, `track`, `files` |
| reviewDimensions | string[] | all 4 | Dimensions to evaluate |
| maxIterations | number | 7 | Hard cap on loop iterations |
| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
| stuckThreshold | number | 2 | Consecutive no-progress iterations before recovery |
| severityThreshold | string | `"P2"` | Minimum severity to report: `P0`, `P1`, `P2` |
| crossReference | object | -- | Core (hard-gated) and overlay (advisory) protocol sets |
| qualityGateThreshold | boolean | true | Whether binary quality gates are enforced |
| specFolder | string | -- | Spec folder path (relative to specs/) |
| status | string | `"initialized"` | `initialized`, `running`, `converged`, `stuck`, `complete`, `error` |
| fileProtection | object | -- | Mutability declarations (see protection levels below) |

### File Protection Levels

| Level | Meaning |
|-------|---------|
| immutable | Cannot be modified after creation |
| append-only | New content added at end only |
| mutable | Can be read, edited, overwritten |
| write-once | Created once, never modified |
| auto-generated | System-managed, overwritten each refresh |

### Review Dimensions

| Dimension | Priority | Required for Coverage |
|-----------|----------|---------------------|
| correctness | 1 | Yes |
| security | 2 | Yes |
| traceability | 3 | No |
| maintainability | 4 | No |

### Severity Weights

| Severity | Weight | Label | Requires file:line |
|----------|--------|-------|--------------------|
| P0 | 10.0 | Blocker | Yes |
| P1 | 5.0 | Required | Yes |
| P2 | 1.0 | Suggestion | Yes |

---

<!-- /ANCHOR:config-file -->
<!-- ANCHOR:state-log -->
## 3. STATE LOG (deep-research-state.jsonl)

Append-only JSON Lines file. One JSON object per line.

### Line 1: Config Record

```json
{"type":"config","mode":"review","topic":"...","reviewTarget":"...","maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
```

### Iteration Records

```json
{
  "type": "iteration", "mode": "review", "run": 3, "status": "complete",
  "focus": "D3 Traceability - skill/runtime alignment",
  "dimensions": ["traceability", "maintainability"],
  "filesReviewed": [".opencode/skill/sk-deep-research/README.md"],
  "findingsCount": 4,
  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
  "newFindingsRatio": 0.32,
  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
}
```

**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `newFindingsRatio`, `timestamp`, `durationMs`

**Optional fields:** `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`

| Required Field | Type | Description |
|---------------|------|-------------|
| mode | `"review"` | Session mode discriminator |
| dimensions | string[] | Review dimensions addressed this iteration |
| filesReviewed | string[] | Files examined |
| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |

### Convergence Signals

| Signal | Weight | Description |
|--------|--------|-------------|
| rollingAvg | 0.30 | Rolling average of severity-weighted new findings |
| madScore | 0.25 | Noise-floor test against MAD-derived churn |
| dimensionCoverage | 0.45 | Required dimension + protocol coverage stability |
| compositeStop | -- | Weighted stop score (stop if > 0.60) |

**Severity math:** `refinementMultiplier: 0.5`, `p0OverrideMinRatio: 0.50`, `noFindingsRatio: 0.0`

### Synthesis Event

```json
{
  "type": "event", "event": "synthesis_complete", "mode": "review",
  "totalIterations": 6, "verdict": "PASS",
  "activeP0": 0, "activeP1": 0, "activeP2": 2,
  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
  "timestamp": "2026-03-24T15:02:00Z"
}
```

**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`

### Verdict Rules

| Verdict | Condition | Next Command |
|---------|-----------|--------------|
| FAIL | `activeP0 > 0` OR quality gate failure | `/spec_kit:plan` |
| CONDITIONAL | `activeP0 == 0` AND `activeP1 > 0` | `/spec_kit:plan` |
| PASS | `activeP0 == 0` AND `activeP1 == 0` | `/create:changelog` |

When `activeP2 > 0` on PASS, set `hasAdvisories: true`.

### traceabilityChecks Schema

```json
{
  "traceabilityChecks": {
    "summary": {
      "required": 2, "executed": 3, "pass": 1, "partial": 1,
      "fail": 1, "blocked": 0, "notApplicable": 0, "gatingFailures": 1
    },
    "results": [{
      "protocolId": "spec_code", "status": "fail", "gateClass": "hard",
      "applicable": true, "counts": { "pass": 0, "partial": 0, "fail": 1 },
      "evidence": ["README.md:48"], "findingRefs": ["F004"],
      "summary": "README claimed the old report contract."
    }]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| summary.required / executed / pass / partial / fail / blocked / notApplicable | number | Yes | Protocol execution counts |
| summary.gatingFailures | number | Yes | Hard-gate failures blocking STOP |
| results[].protocolId | string | Yes | Canonical protocol identifier |
| results[].status | string | Yes | `pass`, `partial`, `fail`, `blocked`, `notApplicable` |
| results[].gateClass | string | Yes | `hard` or `advisory` |
| results[].applicable | boolean | Yes | Whether the protocol applied |
| results[].counts | object | Yes | Protocol-local summary counts |
| results[].evidence | string[] | No | Supporting file:line refs |
| results[].findingRefs | string[] | No | Related finding identifiers |
| results[].summary | string | Yes | Human-readable one-line result |

### Validation Rules

- Each line must be valid JSON with a `type` field
- `mode` must be `"review"` on all iteration and synthesis records
- `run` values must be sequential; `newFindingsRatio` must be 0.0-1.0
- `findingsSummary` and `findingsNew` must each contain `P0`, `P1`, `P2` keys

---

<!-- /ANCHOR:state-log -->
<!-- ANCHOR:strategy-file -->
## 4. STRATEGY FILE (deep-review-strategy.md)

Updated at the end of each iteration. Serves as the persistent brain across fresh-context iterations.

### Required Sections

| Section | Updated By | Purpose |
|---------|-----------|---------|
| topic | Init only | Review topic from config |
| review-dimensions | Each iteration | Unchecked dimensions drive next focus |
| completed-dimensions | Each iteration | Checked dimensions with verdict summary |
| running-findings | Each iteration | P0/P1/P2 active counts + deltas |
| what-worked | Each iteration | Successful approaches for reuse |
| what-failed | Each iteration | Failed approaches to avoid |
| exhausted-approaches | When fully tried | "Do not retry" registry |
| ruled-out-directions | Each iteration | Eliminated directions with reasons |
| next-focus | Each iteration | Recommended direction for next iteration |
| known-context | Init only | Prior work from memory context |
| cross-reference-status | Each iteration | Core vs overlay protocol status |
| files-under-review | Each iteration | Per-file coverage state table |
| review-boundaries | Init only | Max iterations, thresholds, config |

### Mapping from Research Mode

| Review Section | Research Equivalent |
|---------------|-------------------|
| review-dimensions | Key Questions (remaining) |
| completed-dimensions | Answered Questions |
| running-findings | _(none — review-specific)_ |
| cross-reference-status | _(none — review-specific)_ |
| files-under-review | _(none — review-specific)_ |
| review-boundaries | Research Boundaries |

Sections unchanged from research: topic, what-worked, what-failed, exhausted-approaches, ruled-out-directions, next-focus, known-context.

### Update Protocol

1. Read current strategy file
2. Move completed dimensions from "remaining" to "completed" with `[x]` and verdict
3. Update running-findings with P0/P1/P2 counts and deltas
4. Add to what-worked / what-failed with iteration number
5. Move exhausted approaches; update cross-reference-status and files-under-review
6. Set next-focus based on remaining dimensions and open findings

---

<!-- /ANCHOR:strategy-file -->
<!-- ANCHOR:iteration-files -->
## 5. ITERATION FILES (review/iterations/iteration-NNN.md)

Write-once files. One per iteration, zero-padded 3-digit naming.

### Structure

```markdown
# Iteration [N]: [Focus Area]

## Focus
[Dimension(s), files, scope investigated]

## Scorecard
- Dimensions covered: [list]
- Files reviewed: [count]
- New findings: P0=[n] P1=[n] P2=[n]
- Refined findings: P0=[n] P1=[n] P2=[n]
- New findings ratio: [0.0-1.0]

## Findings

### P0 — Blocker
- **F[NNN]**: [Title] — `file:line` — [Description with evidence]

### P1 — Required
- **F[NNN]**: [Title] — `file:line` — [Description with evidence]

### P2 — Suggestion
- **F[NNN]**: [Title] — `file:line` — [Description with evidence]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass/partial/fail | hard | file:line | ... |

## Assessment
- New findings ratio: [0.0-1.0]
- Dimensions addressed: [list]
- Novelty justification: [breakdown]

## Ruled Out
- [Approach]: [Why] — [Evidence]

## Dead Ends
- [Direction]: [Why]

## Recommended Next Focus
[What to investigate next]
```

Every finding must include: unique ID (`F001`...), severity (`P0`/`P1`/`P2`), concrete `file:line` evidence, and dimension tag.

---

<!-- /ANCHOR:iteration-files -->
<!-- ANCHOR:review-report -->
## 6. REVIEW REPORT (review/review-report.md)

The review synthesis output contains 9 sections:

| # | Section | Description |
|---|---------|-------------|
| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` flag |
| 2 | Planning Trigger | Why result routes to planning or changelog |
| 3 | Active Finding Registry | Deduped active findings with evidence, severity, dimension |
| 4 | Remediation Workstreams | Ordered lanes grouped by dependency or area |
| 5 | Spec Seed | Minimal spec updates implied by findings |
| 6 | Plan Seed | Initial remediation tasks from findings |
| 7 | Traceability Status | Core vs overlay protocol outcomes and gaps |
| 8 | Deferred Items | Advisory findings, blocked items, follow-up checks |
| 9 | Audit Appendix | Coverage, convergence replay, audit detail |

**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.

**Planning Trigger** routes FAIL/CONDITIONAL to remediation planning, PASS to changelog creation.

**Active Finding Registry** lists each active finding with findingId, severity, dimension, title, file:line evidence, first/last seen iteration, and status.

**Remediation Workstreams** group related findings into ordered lanes with constituent finding IDs and execution order.

**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.

**Traceability Status** reports per-protocol pass/partial/fail with gating class and evidence.

**Deferred Items** captures advisory findings, blocked protocols, and future follow-up checks.

**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.

---

<!-- /ANCHOR:review-report -->
<!-- ANCHOR:dashboard -->
## 7. DASHBOARD (review/deep-review-dashboard.md)

Auto-generated summary. Never manually edited.

- **Path**: `{spec_folder}/review/deep-review-dashboard.md`
- **Generated from**: JSONL state log + strategy data only
- **Refresh**: Regenerated after every iteration
- **Protection**: `auto-generated` in fileProtection

### Sections

| Section | Source | Description |
|---------|--------|-------------|
| Findings Summary | JSONL | Active P0/P1/P2 counts, new vs refined |
| Progress Table | JSONL | Run, status, focus, dimensions, ratio, duration |
| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
| Trend | JSONL signals | Rolling average, composite stop score, trajectory |

**Rules:** Sole inputs are JSONL + strategy. Overwrite entirely on refresh. Read-only for all agents.

---

<!-- /ANCHOR:dashboard -->
<!-- ANCHOR:claim-adjudication -->
## 8. CLAIM ADJUDICATION

When a finding's severity is ambiguous, apply structured adjudication before finalizing.

### Record Format

```markdown
### Claim Adjudication: F[NNN]

**Original claim**: [What was observed]
**Severity proposed**: [Initial severity]

1. **Re-verify evidence**: [Does file:line evidence confirm the claim?]
2. **Seek counterevidence**: [Evidence that contradicts or mitigates?]
3. **Alternative explanation**: [Legitimate reason for the behavior?]
4. **Adjudicate severity**: [Final severity with rationale]

**Result**: [P0/P1/P2] — [Justification]
```

### Steps

| Step | Purpose |
|------|---------|
| Re-verify evidence | Confirm finding is real and reproducible |
| Seek counterevidence | Avoid false positives and severity inflation |
| Alternative explanation | Distinguish bugs from intentional design |
| Adjudicate severity | Produce defensible, evidence-backed classification |

### Severity Transition Rules

- **P2 to P1**: Confirmed exploitable impact or spec violation with evidence
- **P1 to P0**: Demonstrated data loss, security breach, or hard-gate failure
- **Downgrade**: Requires counterevidence or confirmed alternative explanation
- Every transition is recorded in the finding's `transitions` array

---

<!-- /ANCHOR:claim-adjudication -->
<!-- ANCHOR:finding-registry -->
## 9. FINDING REGISTRY

Each finding is tracked with a unique identifier enabling deduplication, severity transitions, and status lifecycle.

### Schema

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
    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed exploitable" }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| findingId | string | Sequential unique ID: `F001`, `F002`, ... |
| severity | `"P0"` / `"P1"` / `"P2"` | Current severity |
| status | `"active"` / `"resolved"` / `"deferred"` / `"disproved"` | Current status |
| dimension | string | Primary dimension: correctness, security, traceability, maintainability |
| title | string | Short description |
| file | string | File path |
| line | number | Line number (approximate) |
| firstSeen / lastSeen | number | Iteration where first discovered / last referenced |
| transitions | array | Severity and status change history |

### Status Lifecycle

```
[discovered] --> active --> resolved    (fixed or confirmed non-issue)
                  |
                  +--> deferred    (advisory, below threshold)
                  |
                  +--> disproved   (counterevidence invalidated)
```

| Status | Counts Toward Verdict |
|--------|----------------------|
| active | Yes |
| resolved | No |
| deferred | No (listed in Deferred Items) |
| disproved | No |

### Deduplication

Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.

### Cross-Reference Protocols

| Protocol | Level | Applies To | Gate |
|----------|-------|------------|------|
| spec_code | core | all types | hard |
| checklist_evidence | core | all types | hard |
| skill_agent | overlay | skill | advisory |
| agent_cross_runtime | overlay | agent | advisory |
| feature_catalog_code | overlay | skill, spec-folder, track, files | advisory |
| playbook_capability | overlay | skill, agent, spec-folder | advisory |

### Quality Gates

| Gate | Rule |
|------|------|
| Evidence | Every active finding backed by concrete file:line evidence |
| Scope | Reviewed files and conclusions stay inside declared scope |
| Coverage | Required dimensions and required protocols covered |

All three gates must pass before STOP. Gate failure forces `verdict: "FAIL"` regardless of finding counts.

---

<!-- /ANCHOR:finding-registry -->
