---
title: Deep Review Quick Reference
description: One-page cheat sheet for the autonomous deep review loop.
---

# Deep Review Quick Reference

One-page cheat sheet for the autonomous deep review loop.

---

<!-- ANCHOR:commands -->
## 1. COMMANDS

| Command | Description |
|---------|-------------|
| `/spec_kit:deep-review:auto "target"` | Run autonomous review (no approval gates) |
| `/spec_kit:deep-review:confirm "target"` | Run review with approval gates at each iteration |
| `/spec_kit:deep-review "target"` | Ask which mode to use |

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--max-iterations` | 7 | Maximum review iterations |
| `--convergence` | 0.10 | Base sensitivity for review convergence |
| `--spec-folder` | auto | Target spec folder path |
| `--severity-threshold` | P2 | Minimum severity to report |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:when-to-use -->
## 2. WHEN TO USE

| Scenario | Use |
|----------|-----|
| Multi-pass code quality audit | `/spec_kit:deep-review` |
| Simple single-pass code review | `sk-code-review` |
| Pre-release readiness check | `/spec_kit:deep-review:auto "spec folder"` |
| Spec/implementation alignment check | `/spec_kit:deep-review:auto "skill sk-name"` |
| Deep technical investigation | `/spec_kit:deep-research` (different skill) |

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
/spec_kit:deep-review  -->  YAML workflow  -->  @deep-review agent (LEAF)
    |                    |                      |
    |                    |                      +-- Read state
    |                    |                      +-- Review (3-5 actions)
    |                    |                      +-- Write findings (P0/P1/P2)
    |                    |                      +-- Update state
    |                    |
    |                    +-- Init (config, strategy, state)
    |                    +-- Loop (dispatch, evaluate, decide)
    |                    +-- Synthesize (review-report.md)
    |                    +-- Save (memory context)
```

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:state-files -->
## 4. STATE FILES

Review mode stores its packet under the resolved local review path rooted at `{spec_folder}/review/`:

| File | Location | Format | Purpose |
|------|----------|--------|---------|
| Config | `review/deep-review-config.json` | JSON | Review parameters (immutable) |
| State | `review/deep-review-state.jsonl` | JSONL | Iteration log (append-only) |
| Registry | `review/deep-review-findings-registry.json` | JSON | Reducer-owned finding registry |
| Strategy | `review/deep-review-strategy.md` | Markdown | Dimensions, findings, next focus |
| Dashboard | `review/deep-review-dashboard.md` | Markdown | Auto-generated review dashboard |
| Iterations | `review/iterations/iteration-NNN.md` | Markdown | Per-iteration findings (write-once) |
| Report | `review/review-report.md` | Markdown | Final 9-section review report |
| Pause | `review/.deep-review-pause` | Sentinel | Pause between iterations |

### Lifecycle Modes

| Mode | Effect |
|------|--------|
| `resume` | Continue the current review lineage without resetting generation |
| `restart` | Archive current review state and start a new generation |
| `fork` (deferred) | Reserved. Start a sibling lineage branch with explicit parent linkage. Not runtime-wired. |
| `completed-continue` (deferred) | Reserved. Snapshot the completed review and reopen it for amendment-only review deltas. Not runtime-wired. |

---

<!-- /ANCHOR:state-files -->
<!-- ANCHOR:review-dimensions -->
## 5. REVIEW DIMENSIONS

| ID | Dimension | Priority | Description |
|----|-----------|----------|-------------|
| D1 | Correctness | 1 | Logic errors, off-by-one, wrong return types, broken invariants |
| D2 | Security | 2 | Injection, auth bypass, secrets exposure, unsafe deserialization |
| D3 | Traceability | 3 | Spec/code alignment, checklist evidence, cross-reference integrity |
| D4 | Maintainability | 4 | Patterns, clarity, documentation quality, ease of safe follow-on changes |

---

<!-- /ANCHOR:review-dimensions -->
<!-- ANCHOR:verdicts -->
## 6. REVIEW VERDICTS

| Verdict | Condition | Meaning | Next Command |
|---------|-----------|---------|--------------|
| FAIL | Active P0 findings remain OR any binary gate fails | Does not meet quality standards | `/spec_kit:plan` for remediation |
| CONDITIONAL | No P0, but active P1 findings remain | Meets threshold but has required fixes | `/spec_kit:plan` for fixes |
| PASS | No active P0/P1 findings | Shippable; set `hasAdvisories=true` when P2 findings remain | `/create:changelog` |

### Release Readiness

`releaseReadinessState` is the canonical config/report field for review readiness tracking.

| State | Meaning |
|-------|---------|
| `in-progress` | Review still running or required coverage incomplete |
| `converged` | All 4 dimensions covered and the stabilization pass found no new P0/P1 findings |
| `release-blocking` | At least one unresolved P0 remains active |

---

<!-- /ANCHOR:verdicts -->
<!-- ANCHOR:quality-guards -->
## 7. REVIEW QUALITY GUARDS

| Gate | Rule |
|------|------|
| Evidence | Every active finding has file:line evidence and is not inference-only |
| Scope | Findings and reviewed files stay within declared review scope |
| Coverage | Configured dimensions plus required traceability protocols are covered before STOP |

---

<!-- /ANCHOR:quality-guards -->
<!-- ANCHOR:convergence -->
## 8. REVIEW CONVERGENCE

| Signal | Weight | Description |
|--------|--------|-------------|
| Rolling Average | 0.30 | Last 2 severity-weighted `newFindingsRatio` values average below `0.08` |
| MAD Noise Floor | 0.25 | Latest ratio within noise floor |
| Dimension Coverage | 0.45 | All 4 dimensions plus required traceability protocols covered, with `minStabilizationPasses >= 1` |

**Key defaults:** `maxIterations=7`, `convergenceThreshold=0.10`, `rollingStopThreshold=0.08`, `noProgressThreshold=0.05`, `stuckThreshold=2`, `minStabilizationPasses=1`

**P0 override:** Any new P0 finding sets `newFindingsRatio >= 0.50`, blocking convergence.

---

<!-- /ANCHOR:convergence -->
<!-- ANCHOR:agent-iteration-checklist -->
## 9. AGENT ITERATION CHECKLIST

Each @deep-review iteration:
1. Read `deep-review-state.jsonl`, `deep-review-findings-registry.json`, and `deep-review-strategy.md`
2. Determine focus dimension from strategy "Next Focus"
3. Execute 3-5 review actions (Read, Grep, Glob, mcp__cocoindex_code__search)
4. Write `review/iterations/iteration-NNN.md` with P0/P1/P2 findings
5. Run adversarial self-check on any P0 findings (Hunter/Skeptic/Referee)
6. Update `deep-review-strategy.md` (findings, coverage, next focus)
7. Append iteration record to `deep-review-state.jsonl`

---

<!-- /ANCHOR:agent-iteration-checklist -->
<!-- ANCHOR:review-report-sections -->
## 10. REVIEW REPORT SECTIONS

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

---

<!-- /ANCHOR:review-report-sections -->
<!-- ANCHOR:tuning-guide -->
## 11. TUNING GUIDE

| Goal | Adjustment |
|------|------------|
| Deeper review | Lower convergence (0.05), raise max iterations (10) |
| Faster completion | Raise convergence (0.15), lower max iterations (5) |
| Focus on security | Specify `--dimensions security,correctness` |
| Broad coverage | Use all 4 default dimensions and allow the stabilization pass to run |

---

<!-- /ANCHOR:tuning-guide -->
<!-- ANCHOR:troubleshooting -->
## 12. TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Stops too early | Lower `--convergence` from 0.10 to 0.05 |
| Stuck on one dimension | Check strategy.md "Next Focus" rotation |
| P0 findings blocking convergence | Expected behavior: P0 override prevents premature stop |
| Review-report missing sections | Verify synthesis phase completed (check state.jsonl for synthesis event) |
| Agent ignores state | Verify file paths in dispatch prompt |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:related -->
## 13. RELATED

| Resource | Purpose |
|----------|---------|
| `sk-deep-research` | Investigation/research (not review) |
| `sk-code-review` | Single-pass code review |
| `@deep-review` | Single review iteration agent (LEAF) |
| `@context` | Single-pass codebase search |
| `generate-context.js` | Memory save script |

For review-specific protocol documentation, see local `references/`:
- `loop_protocol.md` — Review loop lifecycle (4 phases)
- `state_format.md` — Review state file schemas
- `convergence.md` — Review convergence algorithms

<!-- /ANCHOR:related -->
