---
title: Deep Research Quick Reference
description: One-page cheat sheet for the autonomous deep research loop.
---

# Deep Research Quick Reference

<!-- ANCHOR:overview -->
## 1. OVERVIEW

One-page cheat sheet for the autonomous deep research loop.

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:commands -->
## 2. COMMANDS

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
| `progressiveSynthesis` | true | Allow incremental `research/research.md` updates before final synthesis |

---

<!-- /ANCHOR:commands -->
<!-- ANCHOR:when-to-use -->
## 3. WHEN TO USE

| Scenario | Use |
|----------|-----|
| Deep unknown topic, multi-round needed | `/spec_kit:deep-research` |
| Simple question, 1-2 sources | Direct search with `@context` |
| Check prior work only | `memory_context()` |
| Exhaustive critical research | `/spec_kit:deep-research --max-iterations 15 --convergence 0.02` |

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:architecture -->
## 4. ARCHITECTURE

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
    |                    +-- Synthesize (final research/research.md)
    |                    +-- Save (memory context)
```

---

<!-- /ANCHOR:architecture -->
<!-- ANCHOR:state-files -->
## 5. STATE FILES

| File | Location | Format | Purpose |
|------|----------|--------|---------|
| Config | `research/deep-research-config.json` | JSON | Loop parameters |
| State | `research/deep-research-state.jsonl` | JSONL | Iteration log (append-only) |
| Strategy | `research/deep-research-strategy.md` | Markdown | What worked/failed, next focus |
| Registry | `research/findings-registry.json` | JSON | Reducer-owned open/resolved questions and key findings |
| Dashboard | `research/deep-research-dashboard.md` | Markdown | Reducer-owned lifecycle and convergence summary |
| Iterations | `research/iterations/iteration-NNN.md` | Markdown | Per-iteration findings |
| Output | `research/research.md` | Markdown | Workflow-owned progressive synthesis output |

> **Live lifecycle branches:** `resume`, `restart`. (`fork` and `completed-continue` are deferred and not runtime-wired.) `progressiveSynthesis` defaults to `true`, so `research/research.md` is updated during the loop and finalized at synthesis.

> **Canonical pause sentinel:** `research/.deep-research-pause`

> **Runtime capability matrix:** `.opencode/skill/sk-deep-research/references/capability_matrix.md` and `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`

---

<!-- /ANCHOR:state-files -->
<!-- ANCHOR:iteration-status-legend -->
## 6. ITERATION STATUS LEGEND

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
## 7. CONVERGENCE DECISION TREE

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

### 3-Signal Convergence Model

| Signal | Weight | Min Iterations | Votes STOP When |
|--------|--------|---------------|-----------------|
| Rolling Average | 0.45 | 3 | avg(last 3 newInfoRatios) < convergenceThreshold |
| MAD Noise Floor | 0.30 | 4 | latest ratio <= MAD * 1.4826 |
| Coverage / Age | 0.25 | 1 | answered / total questions >= 0.85 |

**Composite stop threshold:** 0.60 -- weighted stop score must exceed this before quality guards are evaluated.

Quality guards (source diversity, focus alignment, no single-weak-source) must pass before STOP.

---

<!-- /ANCHOR:convergence-decision-tree -->
<!-- ANCHOR:agent-iteration-checklist -->
## 8. AGENT ITERATION CHECKLIST

Each @deep-research iteration:
1. Read `deep-research-state.jsonl` and `deep-research-strategy.md`
2. Determine focus from reducer-owned strategy "Next Focus"
3. Execute 3-5 research actions (WebFetch, Grep, Read, memory_search)
4. Write `research/iterations/iteration-NNN.md` with findings
5. Append iteration record to `deep-research-state.jsonl`
6. Let the workflow reducer update `deep-research-strategy.md`, `findings-registry.json`, and `deep-research-dashboard.md`
7. Optionally update machine-owned sections in `research/research.md` when progressive synthesis is enabled

---

<!-- /ANCHOR:agent-iteration-checklist -->
<!-- ANCHOR:tuning-guide -->
## 9. TUNING GUIDE

| Goal | Adjustment |
|------|------------|
| Deeper research | Lower convergence (0.02), raise max iterations (15) |
| Faster completion | Raise convergence (0.10), lower max iterations (5) |
| Broader coverage | Start with broad topic, let iterations narrow |
| Specific answer | Start with specific question, lower max iterations (5) |

---

<!-- /ANCHOR:tuning-guide -->
<!-- ANCHOR:troubleshooting -->
## 10. TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Stops too early | Lower `--convergence` from 0.05 to 0.02 |
| Repeats same research | Check strategy.md "Exhausted Approaches" is being read |
| Agent ignores state | Verify file paths in dispatch prompt |
| State file corrupt | Validate JSONL: `cat research/deep-research-state.jsonl \| jq .` |
| Loop runs too long | Set lower `--max-iterations` or higher `--convergence` |

---

<!-- /ANCHOR:troubleshooting -->
<!-- ANCHOR:progress-visualization -->
## 11. PROGRESS VISUALIZATION

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
## 12. RELATED

| Resource | Purpose |
|----------|---------|
| `@context` | Single-pass codebase search (not iterative) |
| `@orchestrate` | Multi-agent coordination |
| `memory_context()` | Prior work retrieval |
| `generate-context.js` | Supported memory save script |

<!-- /ANCHOR:related -->

---

<!-- ANCHOR:review-mode -->
## 13. REVIEW MODE

Review mode has been split into a separate skill. See `sk-deep-review/references/quick_reference.md`.

<!-- /ANCHOR:review-mode -->
