# Codex CLI Prompt — Batch deep-review of 026 phases 002-014 (5 iterations per phase + consolidated report)

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). Self-contained prompt. Execute a batch deep-review across 13 phase folders under 026-graph-and-context-optimization, 5 iterations per phase, with all output organized under `026/review/<phase-slug>/`. Write a final consolidated report that aggregates findings across all 13 phases.

## SCOPE

Run `spec_kit:deep-review`-style iterative code audit against 13 phase folders:

| # | Phase slug |
|---|---|
| 1 | `002-implement-cache-warning-hooks` |
| 2 | `003-memory-quality-issues` (parent level only; its 9 sub-phases 003/001–003/009 are internal organization, review the whole 003 tree as one unit at the parent level) |
| 3 | `004-agent-execution-guardrails` |
| 4 | `005-provisional-measurement-contract` |
| 5 | `006-structural-trust-axis-contract` |
| 6 | `007-detector-provenance-and-regression-floor` |
| 7 | `008-graph-first-routing-nudge` |
| 8 | `009-auditable-savings-publication-contract` |
| 9 | `010-fts-capability-cascade-floor` |
| 10 | `011-graph-payload-validator-and-trust-preservation` |
| 11 | `012-cached-sessionstart-consumer-gated` |
| 12 | `013-warm-start-bundle-conditional-validation` |
| 13 | `014-code-graph-upgrades` |

Each phase gets its own review packet under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/<phase-slug>/` with 5 iteration files, state files, strategy, dashboard, and per-phase review-report. After all 13 phases complete, write a consolidated report at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-consolidated.md`.

## PRE-APPROVALS (do not ask)

- Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (PRE-APPROVED, skip Gate 3)
- Review target for each phase is READ-ONLY — you may read any source file but you must NOT modify reviewed code or docs
- The only files you may WRITE are: `026/review/<phase-slug>/*` (new per-phase review packet) and `026/review/batch-phase-review-consolidated.md` (final report) and an updated `026/review/batch-phase-review-state.json` (batch progress tracker)
- Do NOT touch the existing `026/review/review-report.md`, `026/review/deep-review-*.{json,jsonl,md}`, or `026/review/iterations/` — those belong to the earlier 15-iter parent review and must stay intact

## MANDATORY READS (read once at start)

1. The skill protocol you're executing (informational context):
   - `.opencode/skill/sk-deep-review/SKILL.md` (sections §1 Purpose, §2 Contract, §3 Phases)
   - `.opencode/skill/sk-deep-review/assets/deep_review_config.json` (config schema)
   - `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` (strategy template)

2. A reference example of a completed iteration file (to match format):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/iterations/iteration-001.md` (from the earlier 15-iter parent review)

3. A reference example of a completed synthesis report (to match the per-phase review-report.md style):
   - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md` (9-section synthesis; mimic structure, scale down per-phase)

## BATCH CONFIGURATION

### Output folder layout (what you create under `026/review/`)

```
026/review/
├── deep-review-config.json           (EXISTING — do not touch)
├── deep-review-state.jsonl           (EXISTING — do not touch)
├── deep-review-findings-registry.json (EXISTING — do not touch)
├── deep-review-strategy.md           (EXISTING — do not touch)
├── deep-review-dashboard.md          (EXISTING — do not touch)
├── iterations/                       (EXISTING — do not touch)
│   └── iteration-001.md ... iteration-016.md
├── review-report.md                  (EXISTING — the 15-iter parent review report, do not touch)
├── batch-phase-review-state.json     (NEW — batch progress tracker, you update after each phase)
├── batch-phase-review-consolidated.md (NEW — final report, written once at the end)
├── 002-implement-cache-warning-hooks/
│   ├── deep-review-config.json
│   ├── deep-review-state.jsonl
│   ├── deep-review-findings-registry.json
│   ├── deep-review-strategy.md
│   ├── deep-review-dashboard.md
│   ├── iterations/
│   │   ├── iteration-001.md
│   │   ├── iteration-002.md
│   │   ├── iteration-003.md
│   │   ├── iteration-004.md
│   │   └── iteration-005.md
│   └── review-report.md              (per-phase synthesis, ~4-5 sections, scaled down from parent 9-section)
├── 003-memory-quality-issues/
│   └── ... (same structure)
...
└── 014-code-graph-upgrades/
    └── ... (same structure)
```

### Per-phase iteration budget

- **Target**: 5 iterations per phase (= 65 iterations total across the batch)
- **Hard max**: 5 iterations per phase, never exceed
- **Early stop per phase**: if 2 consecutive iterations return `status: "thought"` with 0 new findings, OR rolling avg newFindingsRatio ≤ 0.05 over the last 2 iterations, stop early and move to the next phase. Record `stop_reason: "converged"` in the phase's state.jsonl.
- **Dimensions**: cover all 4 (D1 Correctness, D2 Security, D3 Traceability, D4 Maintainability) across the 5 iterations. Suggested rotation:
  - Iter 1: inventory pass + D1 Correctness on the packet's primary shipped runtime surface (read spec.md Files to Change, open 2-3 of the named files)
  - Iter 2: D2 Security on trust boundaries, fail-closed semantics, auth/session handling (if applicable; skip if not relevant to the phase)
  - Iter 3: D3 Traceability — spec↔code alignment, checklist evidence verification, research citation integrity
  - Iter 4: D4 Maintainability — patterns, clarity, doc honesty (HVR), scope discipline
  - Iter 5: adversarial self-check on P0/P1 findings + consolidation + write per-phase review-report.md
- **Tool-call budget per iteration**: target 8, soft max 12, hard max 15

### Batch progress tracker — `batch-phase-review-state.json`

Initialize at start:
```json
{
  "batchId": "<ISO 8601 start time>",
  "totalPhases": 13,
  "phasesCompleted": 0,
  "phasesRemaining": ["002-implement-cache-warning-hooks", "003-memory-quality-issues", ...],
  "currentPhase": null,
  "phaseResults": [],
  "aggregateFindings": {"P0": 0, "P1": 0, "P2": 0},
  "status": "in-progress",
  "startedAt": "<ISO>",
  "lastUpdated": "<ISO>"
}
```

After each phase completes, append an entry to `phaseResults`:
```json
{
  "phaseSlug": "002-implement-cache-warning-hooks",
  "iterationsCompleted": 5,
  "stopReason": "max_iterations | converged | error",
  "findings": {"P0": 0, "P1": 2, "P2": 3},
  "verdict": "PASS | CONDITIONAL | FAIL",
  "keyFindings": ["short summary of top 3 findings with file:line"],
  "completedAt": "<ISO>"
}
```

Update the batch state file after **every** phase completion so the run is resume-capable. If codex is interrupted mid-batch, the next run can read this file and skip phases already marked complete.

## PER-PHASE EXECUTION PROTOCOL

For each phase in order (002 → 014):

### Step 1 — Scope discovery
1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/<phase-slug>/spec.md` for the Files to Change table + acceptance criteria
2. Read `.../<phase-slug>/implementation-summary.md` to see what shipped vs claimed
3. Read `.../<phase-slug>/checklist.md` to see what's already verified with evidence
4. Identify 3-8 primary source files to audit (from spec.md Files to Change)

### Step 2 — Initialize per-phase review packet
Create `026/review/<phase-slug>/` directory. Write these files:

**`deep-review-config.json`** (copy structure from `sk-deep-review/assets/deep_review_config.json`, populate with phase-specific values):
```json
{
  "topic": "Batch phase review: <phase-slug>",
  "sessionId": "<ISO batch time>-<phase-slug>",
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

**`deep-review-findings-registry.json`** — initialize empty:
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

Create `026/review/<phase-slug>/iterations/` subdirectory.

### Step 3 — Iterate (5 times, or early-stop)

For each iteration (1 → 5):
1. Read the phase's state.jsonl and strategy.md §12 NEXT FOCUS
2. Pick the dimension for this iteration (per the rotation in Batch Configuration above)
3. Read 2-5 target files relevant to the dimension
4. Apply the dimension lens (correctness/security/traceability/maintainability)
5. Write `026/review/<phase-slug>/iterations/iteration-{NNN}.md` with frontmatter + Focus/Files Reviewed/Findings (P0/P1/P2 with typed claim-adjudication packets for P0/P1)/Cross-References/Next Focus/Metrics
6. Append one JSONL record to `026/review/<phase-slug>/deep-review-state.jsonl`:
   ```json
   {"type":"iteration","run":{NNN},"mode":"review","status":"insight|thought|error","focus":"<slug>","dimensions":["<dim>"],"filesReviewed":[...],"findingsCount":{new},"findingsSummary":{"P0":{cum},"P1":{cum},"P2":{cum}},"findingsNew":{"P0":{new},"P1":{new},"P2":{new}},"newFindingsRatio":{ratio},"timestamp":"<ISO>"}
   ```
7. Update `026/review/<phase-slug>/deep-review-strategy.md` — mark dimension covered, update running findings, set next focus
8. Update `026/review/<phase-slug>/deep-review-findings-registry.json` — cumulative counts
9. Check early-stop condition (2 consecutive thought iterations or rolling avg ≤ 0.05). If met, break the loop and mark `stopReason: "converged"`.

### Step 4 — Per-phase review-report.md

After iterations complete (reaching 5 OR early-stop), write `026/review/<phase-slug>/review-report.md` as a scaled-down synthesis (~4-5 sections instead of the 9 in the parent review-report.md):

```markdown
---
title: "Phase Review Report: <phase-slug>"
description: "5-iteration deep review of <phase-slug>. Verdict <PASS|CONDITIONAL|FAIL> with <N> P0 / <N> P1 / <N> P2 findings."
importance_tier: "important"
contextType: "review-report"
---

# Phase Review Report: <phase-slug>

## 1. Overview
- Review target, iterations completed, stop reason, dimensions covered
- Verdict: PASS / CONDITIONAL / FAIL + rationale
- Finding counts by severity

## 2. Findings
List all active P0/P1/P2 findings. For each P0/P1 include a claim-adjudication block with file:line evidence.

## 3. Traceability (if D3 was covered)
Spec↔code alignment check results, checklist evidence verification results, research citation integrity.

## 4. Recommended Remediation
If verdict is CONDITIONAL or FAIL, list specific remediation lanes with file:line targets. If PASS, note "no remediation required".

## 5. Cross-References
Any observations about overlap with other phases (e.g., "011 validator consumed by 014", "003/006 wrapper contract referenced by 012") — flag for the consolidated report.
```

### Step 5 — Update batch state file

Append a `phaseResults` entry to `026/review/batch-phase-review-state.json`. Update `phasesCompleted`, `phasesRemaining`, `aggregateFindings`. Save.

### Step 6 — Move to next phase

Continue to the next phase in the list. Do NOT stop between phases unless you hit the budget/error condition below.

## EARLY-STOP CONDITIONS (batch level)

Stop the entire batch run if:
- **Budget exhausted**: you've used more than ~80% of your internal tool-call budget. Write partial state to `026/review/batch-phase-review-state.json` with `status: "paused"` and `phasesRemaining` listing unreviewed phases. Print a `=== BATCH_PAUSED ===` block in your output naming the exact phases that still need coverage.
- **3+ consecutive phase errors**: if 3 phases in a row fail to complete (e.g., file read errors, template write failures), stop and report.
- **All 13 phases done**: proceed to Step 7 consolidated report.

If paused, the user can dispatch a follow-up prompt that reads `batch-phase-review-state.json` and resumes from `phasesRemaining`.

## STEP 7 — Write the consolidated report

After all 13 phases complete (or on best-effort if paused with 5+ phases done), write `026/review/batch-phase-review-consolidated.md`:

```markdown
---
title: "Batch Phase Review Consolidated Report — 026 Phases 002-014"
description: "Consolidated verdict across all 13 child phases of 026-graph-and-context-optimization. <N> phases reviewed with 5-iteration deep review each. Aggregate findings: <N> P0 / <N> P1 / <N> P2. Overall program verdict: <verdict>."
importance_tier: "important"
contextType: "review-report"
---

# Batch Phase Review Consolidated Report

## 1. Executive Summary
- Scope: 13 phases, 5 iterations per phase, single batch run
- Total iterations executed: <N>
- Phases that early-stopped on convergence: <list>
- Aggregate findings by severity
- Overall 026 program verdict: PASS / CONDITIONAL / FAIL

## 2. Per-Phase Verdict Table
| Phase | Iterations | Verdict | P0 | P1 | P2 | Key Finding |
|-------|-----------|---------|----|----|----|-------------|
| 002-implement-cache-warning-hooks | 5 | PASS/CONDITIONAL/FAIL | N | N | N | short summary |
| 003-memory-quality-issues | 5 | ... | | | | |
| ... (all 13 rows) |

## 3. Aggregate Findings by Severity
- P0 (Blockers): N
- P1 (Required): N
- P2 (Suggestions): N

List all active P0 and P1 findings across all phases, grouped by phase, with claim-adjudication blocks.

## 4. Cross-Phase Patterns
Identify recurring themes:
- Packets that overclaim runtime vs what shipped
- Packets with helper-only implementations missing consumers
- Packets with test harnesses that bypass real code paths
- Packets with fail-closed contract violations
- Cross-phase dependency gaps (e.g., "011 validator used by 014 but 014 tests mock it")

## 5. Comparison with the Earlier 15-iter Parent Review
The existing `026/review/review-report.md` (session 2026-04-09T03:59:45Z) reviewed the 026 parent with 15 iterations and found 6 P1 findings. Compare that verdict with this batch review:
- Findings that were present before and still are
- Findings that were resolved (via the 009 remediation cycle or other fixes)
- Findings that are NEW and weren't caught in the parent review
- Findings that existed but were missed by both reviews

## 6. Remediation Priority Queue
Rank remediation by (severity × cross-phase impact):
1. Top priority remediation with affected phase(s) and file:line
2. ...

## 7. Verdict Trajectory for the 026 Train
- Prior verdicts on 026 (pre-009, post-009, post-014)
- Current verdict from this batch review
- Recommended next step (ship to main, open PR, hold for remediation, etc.)

## 8. Next Steps
Per-phase or per-finding actions the operator should take.
```

## VERIFICATION (run once at the very end)

```bash
for slug in 002-implement-cache-warning-hooks 003-memory-quality-issues 004-agent-execution-guardrails \
            005-provisional-measurement-contract 006-structural-trust-axis-contract \
            007-detector-provenance-and-regression-floor 008-graph-first-routing-nudge \
            009-auditable-savings-publication-contract 010-fts-capability-cascade-floor \
            011-graph-payload-validator-and-trust-preservation 012-cached-sessionstart-consumer-gated \
            013-warm-start-bundle-conditional-validation 014-code-graph-upgrades; do
  test -f ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/$slug/review-report.md" \
    && echo "$slug: OK" \
    || echo "$slug: MISSING review-report.md"
done

test -f .opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/batch-phase-review-consolidated.md \
  && echo "consolidated report: OK" \
  || echo "consolidated report: MISSING"
```

Both checks should print `OK` for all 13 phases plus the consolidated report.

## CONSTRAINTS (absolute)

- **READ ONLY for the review target**: do NOT modify any source file, test file, packet doc, or memory file in any of the 13 phases. Reviews are observation-only.
- **WRITE ONLY to `026/review/<phase-slug>/*` and `026/review/batch-phase-review-*`**: do NOT touch the existing `026/review/review-report.md`, `026/review/deep-review-*.{json,jsonl,md}`, or `026/review/iterations/*.md` (those are the earlier 15-iter parent review).
- **NO fix work**: this is review-only. If you find a bug, document it in the per-phase findings and the consolidated report. Do NOT attempt to fix it.
- **NO new tests**: don't add test files as part of this review. Existing tests may be READ as part of evidence gathering.
- **NO commits**: leave everything uncommitted for operator review.
- **Tool-call budget**: aim for 8 calls per iteration, soft max 12, hard max 15. If a single iteration exceeds 15 calls, wrap it up even if findings are incomplete — record the truncation in the iteration's Metrics section.
- **Phase-level budget**: target 5 iterations per phase but early-stop on convergence.
- **Batch-level budget**: if you're approaching the internal tool-call budget limit, pause per the EARLY-STOP CONDITIONS section and write the batch state file with `status: "paused"` so the operator can resume.
- **Honesty**: if you cannot find meaningful findings for a phase (e.g., it's a pure planning packet with no runtime), mark it as such — `verdict: PASS` with 0 findings and a note in the review-report that the phase had no runtime surface to audit. Do NOT invent findings to justify the review.
- **Scope discipline per phase**: each phase's review should stay focused on ITS OWN spec.md Files to Change list. Cross-phase observations (e.g., "011 is consumed by 014") go in the Cross-References section of the per-phase report AND the Cross-Phase Patterns section of the consolidated report, but the primary audit per phase stays bounded to the phase's own surface.

## RESUME INSTRUCTIONS (for paused or interrupted batch runs)

If you find an existing `026/review/batch-phase-review-state.json` at the start of your run with `status: "paused"` or `status: "in-progress"`:
1. Read it
2. Skip every phase listed in `phaseResults` (those are already done)
3. Start from the first phase in `phasesRemaining`
4. Preserve the existing `aggregateFindings` counts and add to them as new phases complete

If the file does not exist, assume this is a fresh batch run and create it.

## OUTPUT FORMAT (print at the very end — whether complete or paused)

```
=== BATCH_DEEP_REVIEW_026_002_014_RESULT ===
BATCH_STATUS: complete | paused | failed

PHASES_COMPLETED: <n> of 13
PHASES_PAUSED_OR_REMAINING: <list of phase slugs or "none">

PER_PHASE_SUMMARY:
  002-implement-cache-warning-hooks:            iters=<n> verdict=<PASS|CONDITIONAL|FAIL> P0=<n> P1=<n> P2=<n>
  003-memory-quality-issues:                    iters=<n> verdict=<...>
  004-agent-execution-guardrails:               iters=<n> verdict=<...>
  005-provisional-measurement-contract:         iters=<n> verdict=<...>
  006-structural-trust-axis-contract:           iters=<n> verdict=<...>
  007-detector-provenance-and-regression-floor: iters=<n> verdict=<...>
  008-graph-first-routing-nudge:                iters=<n> verdict=<...>
  009-auditable-savings-publication-contract:   iters=<n> verdict=<...>
  010-fts-capability-cascade-floor:             iters=<n> verdict=<...>
  011-graph-payload-validator-and-trust-preservation: iters=<n> verdict=<...>
  012-cached-sessionstart-consumer-gated:       iters=<n> verdict=<...>
  013-warm-start-bundle-conditional-validation: iters=<n> verdict=<...>
  014-code-graph-upgrades:                      iters=<n> verdict=<...>

AGGREGATE_FINDINGS:
  P0: <n>
  P1: <n>
  P2: <n>

OVERALL_026_VERDICT: PASS | CONDITIONAL | FAIL

FILES_CREATED:
  13 x review-report.md under 026/review/<phase-slug>/
  13 x (deep-review-config.json + state.jsonl + findings-registry.json + strategy.md + dashboard.md)
  65 x iteration-NNN.md total (5 per phase, fewer if early-stopped)
  1 x batch-phase-review-consolidated.md
  1 x batch-phase-review-state.json (progress tracker)

EXISTING_REVIEW_ARTIFACTS_PRESERVED: yes | no
  (the 15-iter parent review at 026/review/review-report.md + iterations/*.md + deep-review-*.{json,jsonl,md} must remain untouched)

BLOCKERS: <list or "none">

NEXT_STEP_RECOMMENDATION:
  - If complete + CONDITIONAL/FAIL verdict: review the consolidated report and decide which phases need remediation
  - If paused: dispatch a resume prompt that reads batch-phase-review-state.json and continues from phasesRemaining
  - If complete + PASS verdict: 026 is release-ready, safe to open a PR to main
=== END_BATCH_DEEP_REVIEW_026_002_014_RESULT ===
```

Parent spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (pre-approved, skip Gate 3)
