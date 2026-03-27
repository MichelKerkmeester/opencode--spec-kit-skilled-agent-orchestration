---
title: Deep Research Quick Reference
description: One-page cheat sheet for the autonomous deep research loop.
---

# Deep Research Quick Reference

One-page cheat sheet for the autonomous deep research loop.

---

<!-- ANCHOR:commands -->
## Commands

| Command | Description |
|---------|-------------|
| `/spec_kit:deep-research:auto "topic"` | Run autonomous deep research (no approval gates) |
| `/spec_kit:deep-research:confirm "topic"` | Run with approval gates at each iteration |
| `/spec_kit:deep-research "topic"` | Ask which mode to use |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 10 | Maximum loop iterations |
| `--convergence` | 0.05 | Stop when avg newInfoRatio below this |
| `--spec-folder` | auto | Target spec folder path |
| `progressiveSynthesis` | true | Allow incremental `research.md` updates before final synthesis |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:when-to-use -->
## When to Use

| Scenario | Use |
|----------|-----|
| Deep unknown topic, multi-round needed | `/spec_kit:deep-research` |
| Simple question, 1-2 sources | Direct search with `@context` |
| Check prior work only | `memory_context()` |
| Exhaustive critical research | `/spec_kit:deep-research --max-iterations 15 --convergence 0.02` |

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:architecture -->
## Architecture

```
/spec_kit:deep-research  -->  YAML workflow  -->  @deep-research agent (LEAF)
    |                    |                      |
    |                    |                      +-- Read state
    |                    |                      +-- Research (3-5 actions)
    |                    |                      +-- Write findings
    |                    |                      +-- Update state
    |                    |
    |                    +-- Init (config, strategy, state)
    |                    +-- Loop (dispatch, evaluate, decide)
    |                    +-- Synthesize (final research.md)
    |                    +-- Save (memory context)
```

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:state-files -->
## State Files

| File | Location | Format | Purpose |
|------|----------|--------|---------|
| Config | `scratch/deep-research-config.json` | JSON | Loop parameters |
| State | `scratch/deep-research-state.jsonl` | JSONL | Iteration log (append-only) |
| Strategy | `scratch/deep-research-strategy.md` | Markdown | What worked/failed, next focus |
| Iterations | `scratch/iteration-NNN.md` | Markdown | Per-iteration findings |
| Output | `research.md` | Markdown | Workflow-owned progressive synthesis output |

---

## Reference-Only Notes

- `:restart`, segment partitioning, wave pruning, checkpoint commits, and alternate `claude -p` dispatch are documented for reference, not assumed available at runtime.
- `progressiveSynthesis` defaults to `true`, so `research.md` is updated during the loop and finalized at synthesis.

---

<!-- /ANCHOR:state-files -->
<!-- ANCHOR:iteration-status-legend -->
## Iteration Status Legend

| Status | Meaning |
|--------|---------|
| `complete` | Normal iteration with findings |
| `timeout` | Exceeded time/tool budget |
| `error` | Failed to produce outputs |
| `stuck` | No new information found |
| `insight` | Low ratio but conceptual breakthrough |
| `thought` | Analytical-only, no evidence |

---

<!-- /ANCHOR:iteration-status-legend -->
<!-- ANCHOR:convergence-decision-tree -->
## Convergence Decision Tree

```
Max iterations reached?
  Yes --> STOP

All questions answered?
  Yes --> STOP

stuckThreshold consecutive no-progress?
  Yes --> STUCK_RECOVERY
    Recovery works? --> CONTINUE
    Recovery fails? --> STOP (with gaps)

Composite convergence (3-signal weighted > 0.60)?
  Yes --> STOP (converged)

Otherwise --> CONTINUE
```

Quality guards (source diversity, focus alignment, no single-weak-source) must pass before STOP.

---

<!-- /ANCHOR:convergence-decision-tree -->
<!-- ANCHOR:agent-iteration-checklist -->
## Agent Iteration Checklist

Each @deep-research iteration:
1. Read `deep-research-state.jsonl` and `deep-research-strategy.md`
2. Determine focus from strategy "Next Focus"
3. Execute 3-5 research actions (WebFetch, Grep, Read, memory_search)
4. Write `scratch/iteration-NNN.md` with findings
5. Update `deep-research-strategy.md` (Worked/Failed/Questions/Next Focus)
6. Append iteration record to `deep-research-state.jsonl`
7. Optionally update `research.md` with new findings

---

<!-- /ANCHOR:agent-iteration-checklist -->
<!-- ANCHOR:tuning-guide -->
## Tuning Guide

| Goal | Adjustment |
|------|------------|
| Deeper research | Lower convergence (0.02), raise max iterations (15) |
| Faster completion | Raise convergence (0.10), lower max iterations (5) |
| Broader coverage | Start with broad topic, let iterations narrow |
| Specific answer | Start with specific question, lower max iterations (5) |

---

<!-- /ANCHOR:tuning-guide -->
<!-- ANCHOR:troubleshooting -->
## Troubleshooting

| Problem | Fix |
|---------|-----|
| Stops too early | Lower `--convergence` from 0.05 to 0.02 |
| Repeats same research | Check strategy.md "Exhausted Approaches" is being read |
| Agent ignores state | Verify file paths in dispatch prompt |
| State file corrupt | Validate JSONL: `cat scratch/deep-research-state.jsonl \| jq .` |
| Loop runs too long | Set lower `--max-iterations` or higher `--convergence` |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:progress-visualization -->
## Progress Visualization

After each iteration, the orchestrator can display a text-based convergence summary:

### Format

| Element | Format | Example |
|---------|--------|---------|
| newInfoRatio trend | ASCII sparkline | `[0.9 0.7 0.5 0.3 0.1]` |
| Question coverage | Progress bar | `[=======>...] 7/10 (70%)` |
| Composite score | Threshold bar | `[####----] 0.42 / 0.60` |
| Noise floor | Comparison | `ratio: 0.12 > floor: 0.08` |

### Example Output

```
ITERATION 5 PROGRESS
─────────────────────
newInfoRatio: 0.9 → 0.7 → 0.5 → 0.3 → 0.1  ↓ trending down
Questions:   [========>..] 8/10 answered (80%)
Composite:   [######--] 0.48 / 0.60 threshold
Noise floor: 0.08 (ratio 0.10 ABOVE floor)
Stuck count: 0 | Segment: 1 | Recovery: none
Signals: RollingAvg=STOP MAD=CONTINUE Entropy=CONTINUE
```

### When to Display

- After each iteration evaluation (Step 4)
- In the convergence report (synthesis phase)
- In confirm mode approval gates

---

<!-- /ANCHOR:progress-visualization -->
<!-- ANCHOR:related -->
## Related

| Resource | Purpose |
|----------|---------|
| `@context` | Single-pass codebase search (not iterative) |
| `@orchestrate` | Multi-agent coordination |
| `memory_context()` | Prior work retrieval |
| `generate-context.js` | Supported memory save script |

<!-- /ANCHOR:related -->

---

<!-- ANCHOR:review-mode -->
## Review Mode

### Review Commands

| Command | Description |
|---------|-------------|
| `/spec_kit:deep-research:review "target"` | Run autonomous review (defaults to auto mode) |
| `/spec_kit:deep-research:review:auto "target"` | Run autonomous review (no approval gates) |
| `/spec_kit:deep-research:review:confirm "target"` | Run review with approval gates at each iteration |

Review mode stores its packet under `{spec_folder}/review/`:

- Config: `{spec_folder}/review/deep-research-config.json`
- State log: `{spec_folder}/review/deep-research-state.jsonl`
- Strategy: `{spec_folder}/review/deep-review-strategy.md`
- Dashboard: `{spec_folder}/review/deep-review-dashboard.md`
- Iterations: `{spec_folder}/review/iteration-NNN.md`
- Pause sentinel: `{spec_folder}/review/.deep-research-pause`
- Report: `{spec_folder}/review/review-report.md`

### Review Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 7 | Maximum review iterations |
| `--convergence` | 0.10 | Base sensitivity for review convergence; STOP still uses the contract thresholds below |
| `--spec-folder` | auto | Target spec folder path |
| `--severity-threshold` | P2 | Minimum severity to report |

### Review Dimensions

| ID | Dimension | Description |
|----|-----------|-------------|
| D1 | Correctness | Logic errors, off-by-one, wrong return types, broken invariants |
| D2 | Security | Injection, auth bypass, secrets exposure, unsafe deserialization |
| D3 | Traceability | Spec/code alignment, checklist evidence, cross-reference integrity |
| D4 | Maintainability | Patterns, clarity, documentation quality, ease of safe follow-on changes |

### Review Verdicts

| Verdict | Condition | Meaning | Next Command |
|---------|-----------|---------|--------------|
| FAIL | Active P0 findings remain OR any binary gate fails | Review target does not meet quality standards | `/spec_kit:plan` for remediation |
| CONDITIONAL | No P0, but active P1 findings remain | Meets threshold but has required fixes | `/spec_kit:plan` for fixes |
| PASS | No active P0/P1 findings | Review target is shippable; set `hasAdvisories=true` when P2 findings remain | `/create:changelog` |

### Review Quality Guards

| Gate | Rule |
|------|------|
| Evidence | Every active finding has file:line evidence and is not inference-only |
| Scope | Findings and reviewed files stay within declared review scope |
| Coverage | Configured dimensions plus required traceability protocols are covered before STOP |

### Review Convergence

| Signal | Weight | Description |
|--------|--------|-------------|
| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `0.08` |
| MAD Noise Floor | 0.25 | Latest ratio within noise floor |
| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with `minStabilizationPasses >= 1` |

**Key defaults:** `maxIterations=7`, `convergenceThreshold=0.10`, `rollingStopThreshold=0.08`, `noProgressThreshold=0.05`, `stuckThreshold=2`, `minStabilizationPasses=1`

### review-report.md Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` |
| 2 | Planning Trigger | Why the verdict routes to planning or changelog follow-up |
| 3 | Active Finding Registry | Deduped active findings with evidence and final severity |
| 4 | Remediation Workstreams | Grouped action lanes derived from active findings |
| 5 | Spec Seed | Minimal spec delta derived from review results |
| 6 | Plan Seed | Action-ready plan starter for remediation |
| 7 | Traceability Status | Core vs overlay protocol status and unresolved gaps |
| 8 | Deferred Items | P2 advisories, blocked checks, and follow-up items |
| 9 | Audit Appendix | Coverage, replay validation, and convergence evidence |

<!-- /ANCHOR:review-mode -->
