# Codex CLI Prompt — Batch B: deep-review phases 006-010 (5 phases × 5 iterations)

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). Self-contained prompt. This is **Batch B of 3** in a split batch deep-review of 026 phases 002-014. You review 5 phases here; Batches A and C review the remaining 8. All 3 batches share a single state file and whichever batch finishes last writes the consolidated report.

## SCOPE — BATCH B

Run a 5-iteration deep-review on each of these 5 phase folders:

| # | Phase slug |
|---|---|
| 1 | `006-structural-trust-axis-contract` |
| 2 | `007-detector-provenance-and-regression-floor` |
| 3 | `008-graph-first-routing-nudge` |
| 4 | `009-auditable-savings-publication-contract` |
| 5 | `010-fts-capability-cascade-floor` |

Each phase gets its own review packet under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase-slug>/`.

**After this batch completes**: update `026/review/batch-phase-review-state.json` with the 5 phases you reviewed. If (and only if) the state file shows all 13 phases across Batches A+B+C are complete, also write the consolidated report at `026/review/batch-phase-review-consolidated.md`.

## PRE-APPROVALS (do not ask)

- Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (PRE-APPROVED, skip Gate 3)
- Review target for each phase is **READ-ONLY** — you may read any source file but must NOT modify reviewed code or docs
- You may WRITE only to:
  - `026/review/<phase-slug>/*` (new per-phase review packets for the 5 phases in this batch)
  - `026/review/batch-phase-review-state.json` (batch progress tracker, shared across A+B+C)
  - `026/review/batch-phase-review-consolidated.md` (final report — ONLY if all 13 phases are complete after this batch)
- Do NOT touch the existing `026/review/review-report.md`, `026/review/deep-review-*.{json,jsonl,md}`, or `026/review/iterations/` — those belong to the earlier 15-iter parent review and must stay intact

## MANDATORY READS (read once at start)

1. `.opencode/skill/sk-deep-review/SKILL.md` (sections §1 Purpose, §2 Contract, §3 Phases)
2. `.opencode/skill/sk-deep-review/assets/deep_review_config.json` (config schema)
3. `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` (strategy template)
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/iterations/iteration-001.md` (reference iteration file format from the earlier parent review)
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md` (reference 9-section synthesis; scale down to ~4-5 sections for per-phase reports)
6. **If `026/review/batch-phase-review-state.json` exists**, read it first. It means Batch A or C ran before this one. Do NOT re-review phases already listed in `phaseResults`. Start from the first Batch B phase that is NOT yet in `phaseResults`.

## BATCH STATE FILE — `026/review/batch-phase-review-state.json`

### If the file does NOT exist, create it:

```json
{
  "batchId": "<ISO 8601 now>",
  "totalPhases": 13,
  "phasesCompleted": 0,
  "phasesRemaining": [
    "002-implement-cache-warning-hooks",
    "003-memory-quality-issues",
    "004-agent-execution-guardrails",
    "005-provisional-measurement-contract",
    "006-structural-trust-axis-contract",
    "007-detector-provenance-and-regression-floor",
    "008-graph-first-routing-nudge",
    "009-auditable-savings-publication-contract",
    "010-fts-capability-cascade-floor",
    "011-graph-payload-validator-and-trust-preservation",
    "012-cached-sessionstart-consumer-gated",
    "013-warm-start-bundle-conditional-validation",
    "005-code-graph-upgrades"
  ],
  "currentPhase": null,
  "phaseResults": [],
  "aggregateFindings": {"P0": 0, "P1": 0, "P2": 0},
  "status": "in-progress",
  "startedAt": "<ISO now>",
  "lastUpdated": "<ISO now>"
}
```

### If the file already exists, read it and:
1. Skip any Batch B phase that already appears in `phaseResults`
2. Start from the first unreviewed Batch B phase
3. Preserve the existing `phasesCompleted`, `phaseResults`, `aggregateFindings`, `startedAt`

## PER-PHASE EXECUTION PROTOCOL (repeat for each Batch B phase)

### Step 1 — Scope discovery
1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/<phase-slug>/spec.md` for the Files to Change table + acceptance criteria
2. Read `.../<phase-slug>/implementation-summary.md` to see what shipped vs claimed
3. Read `.../<phase-slug>/checklist.md` to see what's already verified with evidence
4. Identify 3-8 primary source files to audit (from spec.md Files to Change)

### Step 2 — Initialize per-phase review packet
Create `026/review/<phase-slug>/` directory + `026/review/<phase-slug>/iterations/` subdirectory. Write these files:

**`deep-review-config.json`** (match the schema at `sk-deep-review/assets/deep_review_config.json`, populate with phase-specific values):
```json
{
  "topic": "Batch phase review: <phase-slug>",
  "sessionId": "<ISO now>-<phase-slug>",
  "mode": "review",
  "reviewTarget": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/<phase-slug>/",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": ["correctness", "security", "traceability", "maintainability"],
  "maxIterations": 5,
  "convergenceThreshold": 0.10,
  "stuckThreshold": 2,
  "specFolder": ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/<phase-slug>/",
  "status": "initialized",
  "executionMode": "auto",
  "reviewerBackend": {"type": "cli-codex", "model": "gpt-5.4", "reasoning_effort": "high", "service_tier": "fast"}
}
```

**`deep-review-state.jsonl`** — initialize with one `type: "config"` record

**`deep-review-findings-registry.json`** — empty registry:
```json
{
  "sessionId": "<phase session id>",
  "openFindings": [],
  "resolvedFindings": [],
  "dimensionCoverage": {"correctness": false, "security": false, "traceability": false, "maintainability": false},
  "findingsBySeverity": {"P0": 0, "P1": 0, "P2": 0},
  "convergenceScore": 0.0
}
```

**`deep-review-strategy.md`** — populate from `sk-deep-review/assets/deep_review_strategy.md` template with:
- Topic: "Batch review of <phase-slug>"
- Review dimensions checklist (4 unchecked items)
- Known context from the phase's implementation-summary.md
- Next focus for iteration 1: inventory + D1 Correctness on primary runtime file

**`deep-review-dashboard.md`** — initial state, ITERATING, 0 findings

### Step 3 — Iterate (5 times max, or early-stop)

Dimension rotation across the 5 iterations:
- **Iter 1**: inventory pass + D1 Correctness on primary runtime surface (read spec.md Files to Change, open 2-3 named files)
- **Iter 2**: D2 Security on trust boundaries, fail-closed semantics, auth/session handling (skip if phase has no security-relevant surface; mark dimension notApplicable)
- **Iter 3**: D3 Traceability — spec↔code alignment, checklist evidence verification, research citation integrity
- **Iter 4**: D4 Maintainability — patterns, clarity, doc honesty, scope discipline
- **Iter 5**: adversarial self-check on P0/P1 findings + consolidation + write per-phase review-report.md

**Early stop**: if 2 consecutive iterations return `status: "thought"` with 0 new findings, OR rolling avg newFindingsRatio ≤ 0.05 over the last 2 iterations, stop early and move to the next phase. Record `stop_reason: "converged"`.

**Per iteration**:
1. Read the phase's state.jsonl and strategy.md §12 NEXT FOCUS
2. Read 2-5 target files for the dimension
3. Apply the dimension lens
4. Write `026/review/<phase-slug>/iterations/iteration-{NNN}.md` with frontmatter + Focus / Files Reviewed / Findings (P0/P1/P2 with typed claim-adjudication packets for P0/P1) / Cross-References / Next Focus / Metrics
5. Append one JSONL record to `026/review/<phase-slug>/deep-review-state.jsonl`:
   ```json
   {"type":"iteration","run":{NNN},"mode":"review","status":"insight|thought|error","focus":"<slug>","dimensions":["<dim>"],"filesReviewed":[...],"findingsCount":{new},"findingsSummary":{"P0":{cum},"P1":{cum},"P2":{cum}},"findingsNew":{"P0":{new},"P1":{new},"P2":{new}},"newFindingsRatio":{ratio},"timestamp":"<ISO>"}
   ```
6. Update `026/review/<phase-slug>/deep-review-strategy.md` — dimension coverage, running findings, next focus
7. Update `026/review/<phase-slug>/deep-review-findings-registry.json` — cumulative counts
8. Check early-stop condition

**Tool-call budget per iteration**: target 8, soft max 12, hard max 15.

### Step 4 — Per-phase review-report.md

After iterations complete (reaching 5 OR early-stop), write `026/review/<phase-slug>/review-report.md`:

```markdown
---
title: "Phase Review Report: <phase-slug>"
description: "5-iteration deep review of <phase-slug>. Verdict <PASS|CONDITIONAL|FAIL> with <N> P0 / <N> P1 / <N> P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: <phase-slug>

## 1. Overview
Review target, iterations completed, stop reason, dimensions covered. Verdict: PASS / CONDITIONAL / FAIL + rationale. Finding counts by severity.

## 2. Findings
List all active P0/P1/P2 findings. For each P0/P1 include a claim-adjudication block with file:line evidence.

## 3. Traceability
Spec↔code alignment results, checklist evidence verification, research citation integrity. If D3 was marked notApplicable, say so.

## 4. Recommended Remediation
If verdict is CONDITIONAL or FAIL, list specific remediation lanes with file:line targets. If PASS, note "no remediation required".

## 5. Cross-References
Observations about overlap with other phases (e.g., "011 validator consumed by 014") — these feed the consolidated report's Cross-Phase Patterns section.
```

### Step 5 — Update batch state file

After each phase completes (not after each iteration), append a `phaseResults` entry to `026/review/batch-phase-review-state.json`:

```json
{
  "phaseSlug": "<slug>",
  "iterationsCompleted": <n>,
  "stopReason": "max_iterations | converged | error",
  "findings": {"P0": <n>, "P1": <n>, "P2": <n>},
  "verdict": "PASS | CONDITIONAL | FAIL",
  "keyFindings": ["short summary of top 3 findings with file:line"],
  "completedAt": "<ISO>"
}
```

Update `phasesCompleted`, remove the slug from `phasesRemaining`, accumulate into `aggregateFindings`, update `lastUpdated`. Save atomically.

### Step 6 — Move to next phase

Continue to the next Batch B phase in the list. Do NOT stop between phases unless you hit the batch-level budget.

## BATCH-LEVEL EARLY-STOP

Stop the batch run if:
- **Budget exhausted**: you've used more than ~80% of your internal tool-call budget. Write partial state with `status: "paused"` and leave remaining Batch B phases in `phasesRemaining`. The operator can dispatch a resume prompt.
- **3+ consecutive phase errors**: stop and report.
- **All 5 Batch B phases done**: proceed to Step 7.

## STEP 7 — Write consolidated report (ONLY if all 13 phases complete)

After updating the batch state file, CHECK: is `phasesCompleted == 13` (all 13 phases across A+B+C)?

- **If YES**: write `026/review/batch-phase-review-consolidated.md` with this structure:

  ```markdown
  ---
  title: "Batch Phase Review Consolidated Report — 026 Phases 002-014"
  description: "Consolidated verdict across all 13 child phases of 026-graph-and-context-optimization. Aggregate findings: <N> P0 / <N> P1 / <N> P2. Overall program verdict: <verdict>."
  importance_tier: "important"
  contextType: "review-report"
  ---

  # Batch Phase Review Consolidated Report

  ## 1. Executive Summary
  Scope, total iterations, phases that early-stopped, aggregate findings, overall 026 program verdict.

  ## 2. Per-Phase Verdict Table
  | Phase | Iterations | Verdict | P0 | P1 | P2 | Key Finding |
  |-------|-----------|---------|----|----|----|-------------|
  | (13 rows from phaseResults) |

  ## 3. Aggregate Findings by Severity
  All active P0 and P1 findings across all phases, grouped by phase, with claim-adjudication blocks.

  ## 4. Cross-Phase Patterns
  Recurring themes: overclaim vs ship, helper-only implementations, test harnesses bypassing real code, fail-closed violations, cross-phase dependency gaps.

  ## 5. Comparison with the Earlier 15-iter Parent Review
  The existing `026/review/review-report.md` (session 2026-04-09T03:59:45Z) found 6 P1 findings. Compare:
  - Findings present before and still present
  - Findings resolved since (via 009 remediation or other fixes)
  - Findings NEW in this batch that weren't in the parent review
  - Findings both reviews missed

  ## 6. Remediation Priority Queue
  Rank remediation by (severity × cross-phase impact).

  ## 7. Verdict Trajectory
  Prior verdicts on 026, current verdict, recommended next step.

  ## 8. Next Steps
  Per-phase or per-finding actions for the operator.
  ```

- **If NO** (other batches still pending): do NOT write the consolidated report. Just print in your output that phases X/13 are complete and the other batches still need to run.

## CONSTRAINTS (absolute)

- **READ ONLY for the review target**: do NOT modify any source file, test file, packet doc, or memory file
- **WRITE ONLY to allowed paths**: `026/review/<phase-slug>/*` for the 5 Batch B phases, `batch-phase-review-state.json`, and (conditionally) `batch-phase-review-consolidated.md`
- **NO fix work**: review-only
- **NO new tests**: existing tests may be READ as evidence, not modified
- **NO commits**: leave everything uncommitted for operator review
- **Tool-call budget**: 8 target / 12 soft max / 15 hard max per iteration
- **Honesty**: if a phase has no meaningful findings (e.g., pure planning packet with no runtime), mark it PASS with 0 findings and document that in the per-phase review-report.md. Do NOT invent findings.
- **Scope discipline**: each phase review stays bounded to its own spec.md Files to Change. Cross-phase observations go in the Cross-References section of the per-phase report.
- **Existing 15-iter parent review artifacts**: `026/review/review-report.md`, `026/review/iterations/*.md`, `026/review/deep-review-*.{json,jsonl,md}` are read-only references. Do NOT overwrite.

## OUTPUT FORMAT (print at the very end)

```
=== BATCH_B_DEEP_REVIEW_RESULT ===
BATCH_STATUS: complete | paused | failed
PHASES_IN_THIS_BATCH: 006-structural-trust-axis-contract, 007-detector-provenance-and-regression-floor, 008-graph-first-routing-nudge, 009-auditable-savings-publication-contract, 010-fts-capability-cascade-floor

PER_PHASE_SUMMARY:
  006-structural-trust-axis-contract:           iters=<n> verdict=<PASS|CONDITIONAL|FAIL> P0=<n> P1=<n> P2=<n> stopReason=<reason>
  007-detector-provenance-and-regression-floor: iters=<n> verdict=<...>
  008-graph-first-routing-nudge:                iters=<n> verdict=<...>
  009-auditable-savings-publication-contract:   iters=<n> verdict=<...>
  010-fts-capability-cascade-floor:             iters=<n> verdict=<...>

BATCH_B_AGGREGATE_FINDINGS:
  P0: <n>
  P1: <n>
  P2: <n>

BATCH_STATE_FILE:
  path: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-state.json
  phasesCompleted: <n> / 13
  phasesRemaining: <list>
  status: in-progress | paused | complete

CONSOLIDATED_REPORT_WRITTEN: yes | no (no if phasesCompleted < 13; Batches A and/or C still need to run)
CONSOLIDATED_REPORT_PATH: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-consolidated.md (only if written)

FILES_CREATED:
  5 x 026/review/<phase-slug>/ directories
  5 x review-report.md
  25 x iteration-NNN.md max (fewer if early-stopped)
  5 x (deep-review-config.json + state.jsonl + findings-registry.json + strategy.md + dashboard.md)
  1 x batch-phase-review-state.json (or updated if existed)

EXISTING_REVIEW_ARTIFACTS_PRESERVED: yes | no

BLOCKERS: <list or "none">

NEXT_STEP_RECOMMENDATION:
  - If phasesCompleted < 13: dispatch the remaining batch (A or C) next
  - If Batch B paused mid-phase: dispatch resume prompt to finish remaining Batch B phases first
  - If consolidated report written: review it and decide next actions
=== END_BATCH_B_DEEP_REVIEW_RESULT ===
```

Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (pre-approved, skip Gate 3)
