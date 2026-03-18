# Iteration 012: Real Execution Data and Convergence Behavior

## Focus
Analysis of actual execution data from autoresearch-opencode (JSONL + worklog) and AGR (results.tsv format + analysis patterns)

## Key Findings

### Finding 1: Real Convergence is Non-Linear with Breakthrough Events
[SOURCE: autoresearch-opencode/worklog.md -- 8 experiments]

The actual execution trajectory:

```
Exp 1: sorted() comparison      → 16.524s  → KEEP   (+6% via C optimization)
Exp 2: itertools.pairwise()     → 17.654s  → DISCARD (7% slower)
Exp 3: zip-based comparison     → 12.823s  → KEEP   (22% faster -- best linear)
Exp 4: Direct index loop        → 19.342s  → DISCARD (51% slower!)
Exp 5: Hybrid early heuristics  → 14.715s  → DISCARD (15% slower)
Exp 6: Bisect binary search     → 0.002s   → KEEP   (99.94% improvement!)
Exp 7: Bisect with early exit   → 19.561s  → DISCARD (broken logic)
Exp 8: Simple all() generator   → 15.797s  → DISCARD (7,900x slower than #6)
```

**Convergence pattern**: Linear improvements (6%, 22%) followed by a paradigm shift (99.94%). Post-breakthrough attempts to refine the winning approach ALL failed. The "plateau after breakthrough" pattern suggests diminishing returns are non-monotonic -- they spike down, then jump back up.

**Impact on our research system**: Our newInfoRatio should detect this pattern. After a high-value iteration (breakthrough), the next iterations will likely have low ratios (failed refinements). Our composite convergence algorithm (P1.2) should NOT interpret post-breakthrough low ratios as convergence -- they're normal exploration of the new optimum's neighborhood.

### Finding 2: Keep/Discard Ratio is ~37% in Practice
[SOURCE: autoresearch-opencode execution data]

3 kept / 8 total = 37.5% success rate. For research, the equivalent would be: of 8 iterations, ~3 produce genuinely new information (high newInfoRatio) and ~5 re-tread known ground.

Looking at our Round 1 data:
- Iterations with newInfoRatio >= 0.55: 6 of 7 (86%) -- higher than optimization because research covers more ground per iteration
- The synthesis iteration (007, ratio 0.10) is the "discard" equivalent

**Impact**: Research iterations have a higher "keep" rate than optimization iterations because research questions are broader and sources are more diverse. Our convergence threshold should reflect this -- a research loop converging at 0.10 newInfoRatio is more significant than an optimization loop converging at 37% keep rate.

### Finding 3: JSONL Schema Comparison Reveals Our Advantages
[SOURCE: autoresearch-opencode/autoresearch.jsonl vs our deep-research-state.jsonl]

| Field | autoresearch-opencode | Our system |
|-------|----------------------|------------|
| Record type | `type: "config"` + implicit experiment | `type: "config"`, `type: "iteration"`, `type: "event"` |
| Segment tracking | `segment: 0` (single segment) | Segment via event markers |
| Status values | "keep", "discard" | "complete" (no keep/discard concept) |
| Metrics | `metric: float`, `metrics: {nested}` | `newInfoRatio: float`, `findingsCount: int` |
| Questions | N/A | `keyQuestions`, `answeredQuestions`, `partiallyAnswered` |
| Focus | `description: string` | `focus: string` |
| Commit tracking | `commit: string` | N/A (no code changes) |
| Timing | `timestamp: epoch_int` | `timestamp: ISO8601`, `durationMs: int` |

**Key advantages of our system**:
1. Typed records (`type` field) enable future extensibility
2. Question tracking enables convergence via coverage entropy
3. ISO8601 timestamps are human-readable
4. Duration tracking enables performance analysis
5. Focus field is more descriptive than description

**Missing from our system**:
1. Segment field on each record (proposed in P2.4)
2. Granular status (we only have "complete")
3. Nested metrics (we could add signal-specific convergence metrics)

### Finding 4: Dashboard Metric from autoresearch-opencode
[SOURCE: autoresearch-opencode/autoresearch-dashboard.md]

Real dashboard output:
```
Runs: 9 | Kept: 4 | Discarded: 5 | Crashed: 0
Baseline: 15.605s (run #1)
Best: 0.002s (run #7, 99.99% improvement)
```

The dashboard tracks: total runs, kept/discarded/crashed counts, baseline value, best value, improvement percentage. Each experiment row shows: run number, commit, metric value, delta from baseline, status, description.

**Mapping to research**: Our equivalent would be:
```
Iterations: 7 | High-value (>0.5): 6 | Synthesis (<0.2): 1
Questions: 10 total | Answered: 9 | Remaining: 1
Best iteration: #002 (newInfoRatio: 0.85)
```

This validates P4.2 (Progress Visualization) with a concrete format.

### Finding 5: results.tsv Format from AGR
[SOURCE: skills/agr/references/guide.md:Results Format]

AGR's results.tsv uses tab-separated values:
```
commit  total_time_s  bench1  bench2  correctness  status  description
baseline  53.54  33.39  14.59  PASS  keep  initial measurement
abc1234  44.74  30.36  9.93  PASS  keep  pow to arithmetic
def5678  32.23  26.34  2.12  PASS  discard  fuse two-pass
```

Rules: append-only, even discarded/crashed experiments logged, parseable by analysis.py.

**Key insight**: Logging everything (including failures) serves TWO purposes: (1) prevents retry of failed approaches, (2) enables statistical analysis of failure patterns. Our JSONL already logs all iterations -- this confirms the pattern.

### Finding 6: Visualization Patterns from AGR analysis.py
[SOURCE: skills/agr/references/templates.md:analysis.py]

The matplotlib visualization computes:
- `cummin()` for running best (lower-is-better)
- Percentage improvement: `(1 - best/first) * 100`
- Three visual categories with distinct colors and markers
- Per-benchmark breakdown in lower pane

The most useful statistical pattern: **running best as a step function**. In research terms, this would be: "best cumulative understanding" -- as questions get answered, the step function rises. When it plateaus, research is converging.

### Finding 7: Typical Session Duration and Iteration Count
[SOURCE: autoresearch-opencode worklog (8 experiments), karpathy Issue #307 (400+ attempts)]

Real-world session sizes:
- autoresearch-opencode: 8 experiments, 1 session, ~30 minutes
- karpathy (Issue #307): 400+ experiments overnight, zero kept
- AGR (from guide): MAX_ITERATIONS=100 default, analysis.py shows ~20-50 experiments typical

For research (our system):
- Round 1: 7 iterations across 3 waves, ~2 hours
- Expected Round 2: 7 more iterations, total ~14

**Impact**: Research loops are 10-50x shorter than optimization loops (7-14 iterations vs 100-400). Our convergence detection needs to work with small N (5-10 iterations), not large N (100+). This means statistical methods requiring large samples (like CUSUM from P1.2) may be impractical. The simpler signals (rolling average, question coverage entropy) are more appropriate.

### Finding 8: Failure Categories in Real Execution
[SOURCE: autoresearch-opencode worklog analysis]

Categorizing the 5 discarded experiments:
1. **Performance regression** (Exp 2, 4, 5): Approach was slower than baseline
2. **Broken logic** (Exp 7): Implementation had fundamental errors
3. **Dominated by breakthrough** (Exp 8): Approach was valid but 7,900x worse than best

For research, the equivalent failure categories:
1. **Redundant information** (re-treading known ground) -- our low newInfoRatio
2. **Source quality failure** (fetched content not relevant) -- our "What Failed"
3. **Dominated by synthesis** (new info already captured in earlier synthesis) -- natural in later iterations

### Finding 9: Experiment Commit Tracking Enables Rollback
[SOURCE: autoresearch-opencode/autoresearch.jsonl commit field]

Real commit data shows a mix of actual git hashes (`dcb54c9`, `c7fd4b6`, `7060af0`, `45ec1ff`) and approach labels (`approach2`, `approach5`, `approach7`, `approach8`). The inconsistency suggests the agent sometimes forgot to commit before logging.

**Impact**: For research, we don't need commit tracking (no code changes), but the PATTERN of linking iteration records to specific file states is valuable. Our iteration files serve this purpose -- each iteration-NNN.md is the "commit" equivalent.

## Convergence Data Summary

| Metric | Optimization (autoresearch-opencode) | Research (our Round 1) |
|--------|--------------------------------------|----------------------|
| Total iterations | 8 | 7 |
| "Kept" rate | 37.5% (3/8) | 86% (6/7 with ratio > 0.5) |
| Breakthrough event | Yes (Exp 6, 99.94%) | Partial (Exp 4, convergence algorithms) |
| Post-breakthrough decline | Yes (Exp 7-8 all worse) | Yes (Exp 7, ratio 0.10) |
| Convergence signal | No automated detection | newInfoRatio trend (0.85→0.10) |
| Session duration | ~30 min | ~2 hours |
| Questions answered | N/A | 9/10 (90%) |

## Assessment
- Questions addressed: Q13
- Questions answered: Q13 (fully -- real execution data analyzed, convergence patterns characterized)
- newInfoRatio: 0.65
- Key insight: Research loops are 10-50x shorter than optimization loops, meaning convergence algorithms must work with small N (5-10). The non-linear convergence pattern (incremental → breakthrough → plateau) is consistent across both optimization and research domains.

## Recommended Next Focus
Karpathy ecosystem analysis (forks, adaptations) for community extensions.
