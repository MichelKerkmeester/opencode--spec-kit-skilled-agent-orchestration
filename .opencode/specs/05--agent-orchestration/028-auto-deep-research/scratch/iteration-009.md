# Iteration 009: AGR Source Code Deep Dive

## Focus
Code-level analysis of AGR's run_autoresearch.sh orchestration, benchmark.py harness, analysis.py visualization, and decision logic

## Key Findings

### Finding 1: Loop Script is Minimal Shell Wrapper
[SOURCE: skills/agr/references/templates.md:run_autoresearch.sh]

The actual loop script is remarkably simple:

```bash
#!/bin/bash
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"
MAX_ITERATIONS=100

for ((i=1; i<=MAX_ITERATIONS; i++)); do
    echo "=== ITERATION $i / $MAX_ITERATIONS [$(date '+%Y-%m-%d %H:%M:%S')] ==="
    claude -p "$(cat program.md)" \
        --dangerously-skip-permissions \
        --max-turns 50 \
        --effort high \
        2>&1 || true
    echo "--- Iteration $i done ---"
    {{RUNTIME_PATH}} analysis.py 2>/dev/null || true
    echo ""; cat results.tsv; echo ""
    sleep 2
done
```

Key observations:
- `|| true` after claude invocation -- ALL errors are suppressed. The loop NEVER stops on failure.
- `cat program.md` reads the full prompt from disk each iteration -- fresh context guaranteed.
- `analysis.py` is called after every iteration to regenerate progress.png.
- `sleep 2` is the only inter-iteration delay.
- No git operations in the loop script itself -- those are delegated to the agent via program.md instructions.
- No output capture or parsing -- the agent writes directly to results.tsv and source files.

**Reusability**: The simplicity is the lesson. Our system's dispatch mechanism is more complex but achieves the same goal. The `|| true` pattern ensures the loop survives agent crashes -- our Tiered Error Recovery (P1.1) should include a similar "always continue" baseline.

### Finding 2: benchmark.py Measurement Architecture
[SOURCE: skills/agr/references/templates.md:benchmark.py]

```python
def run_all(n_runs=N_RUNS, verify=False, save_baseline=False):
    timing_results = {}
    correctness_results = {}
    for name, func in ALL_BENCHMARKS:
        times = []
        for run_i in range(n_runs):
            try:
                t0 = time.perf_counter()
                check = func(data)
                t = time.perf_counter() - t0
                times.append(t)
            except Exception as e:
                times.append(float("inf"))
        median_t = statistics.median(times)
        timing_results[name] = median_t
```

Architecture:
- `time.perf_counter()` for high-resolution timing
- N runs per benchmark, report MEDIAN (not mean) -- reduces noise
- Failed runs recorded as `float("inf")` -- counted but don't crash the suite
- Correctness verification via MD5 checksums against baseline
- Output format: `total_metric: X.XXXX` + per-benchmark lines (grep-friendly)

**Reusability**: The median-of-N-runs pattern is a concrete implementation of noise reduction. Our newInfoRatio has no equivalent -- it's a single self-assessed value. For research quality, we could adopt a "report confidence interval" approach inspired by this.

### Finding 3: analysis.py Visualization with Status Categories
[SOURCE: skills/agr/references/templates.md:analysis.py]

The visualization uses matplotlib with 3 visual categories:
- **Kept**: Green circles connected by green line, with running best step function (dashed)
- **Discarded**: Light gray dots (visible but de-emphasized)
- **Crashed**: Red X markers at 105% of max metric (above the chart data)

Key statistical features:
- `cummin()` tracks running best (lower-is-better assumed)
- Baseline shown as horizontal dotted line with label
- Per-experiment annotations (first 40 chars of description, rotated 30 degrees)
- Bottom panel: per-benchmark breakdown for kept experiments only

Summary stats printed: total experiments, kept/discarded/crashed counts, improvement percentage from first kept to best kept.

**Reusability**: This visualization pattern maps to our Progress Visualization proposal (P4.2). The specific approach of plotting kept vs discarded with running best is directly implementable for research iteration tracking (replacing metric values with newInfoRatio).

### Finding 4: Decision Logic Tree (7 Conditions)
[SOURCE: skills/agr/references/guide.md:Decision Logic]

The keep/discard decision is a cascading conditional:

```
1. correctness == FAIL           → DISCARD immediately
2. Build crashed AND fixable     → Fix and retry
3. Build crashed AND fundamental → Log CRASH, git revert
4. Benchmark timeout (>2x)       → Log CRASH, git revert
5. total_metric improved          → KEEP
6. Per-benchmark >5% improvement
   AND no regression >5%          → KEEP
7. Code simpler (fewer lines)     → KEEP
8. Marginal (<2%) with complexity → DISCARD
```

**Key insight**: Condition 6 (per-benchmark improvement with regression guard) is a nuanced keep criteria. An experiment can improve one benchmark significantly while keeping others stable. This is a "Pareto improvement" check -- no dimension gets worse.

**Reusability**: For research, the analog would be: "answered a new question without contradicting previous findings" -- a Pareto check on the knowledge graph. This refines our P1.3 (Exhausted Approaches) with positive selection criteria, not just negative blocking.

### Finding 5: File Mutability Architecture (Enforced by Convention)
[SOURCE: skills/agr/references/guide.md:State Files]

Explicit classification:

| Mutable (Agent writes) | Immutable (Agent reads only) |
|------------------------|------------------------------|
| STRATEGY.md | benchmark.py |
| results.tsv | baseline_checksums.json |
| Source code files | program.md |
| | analysis.py |
| | run_autoresearch.sh |

`run_autoresearch.sh` is immutable because "agents learned the hard way" -- an agent once edited the loop script and broke the system. This is enforced only by instructions in program.md, not by file permissions.

**Reusability**: Validates our P4.1 (File Mutability Declarations). The lesson from AGR is that instruction-only enforcement is fragile -- agents ignore it under pressure. Machine-enforceable declarations would prevent this.

### Finding 6: results.tsv as Append-Only Experiment Log
[SOURCE: skills/agr/references/guide.md:Results Format]

Format: tab-separated with columns `commit | total_metric | bench1 | bench2 | correctness | status | description`

Rules:
- Even discarded/crashed experiments are logged (prevents retry of failed approaches)
- Append-only (never modify previous rows)
- Parseable by analysis.py for visualization
- Agent reads this file each iteration to understand history

**Reusability**: The "log everything, even failures" pattern is identical to our JSONL append-only model. The TSV format is simpler than JSONL but less flexible (no nested objects, no type field). Our JSONL approach is superior for research data.

### Finding 7: STRATEGY.md as Mutable Strategy Document
[SOURCE: skills/agr/references/guide.md:STRATEGY.md]

STRATEGY.md serves as the agent's working memory -- completely rewritten each iteration. Contains:
- Ideas to try next
- Insights from past experiments
- Patterns observed in the data
- Approach categories to explore

This is the AGR equivalent of our strategy.md, with a key difference: the agent COMPLETELY REWRITES it each iteration (destructive update), while our system only edits specific sections (targeted update). AGR's approach risks losing useful observations from earlier iterations.

### Finding 8: Worktree Parallelism Mentioned but Unimplemented
[SOURCE: skills/agr/references/guide.md:Parallel Mode]

```bash
claude -p "$(cat program_adaptive.md)" -w "opt-adaptive" \
    --dangerously-skip-permissions
```

The `-w` flag creates a git worktree for isolated experimentation. Two agents can run on separate branches simultaneously. However, this is shown only as an "optional" pattern -- the default loop is single-threaded. No merge logic, conflict resolution, or result aggregation is implemented.

**Reusability**: Confirms our finding from Round 1 that no repo has actual parallel execution. Our parallel wave pattern remains genuinely novel.

### Finding 9: No Shell-Level Error Handling
[SOURCE: skills/agr/references/templates.md:run_autoresearch.sh]

The loop script has zero error handling:
- No `set -e` or `set -euo pipefail`
- `|| true` suppresses all errors from claude invocation
- `2>/dev/null || true` suppresses all errors from analysis.py
- No trap handlers for SIGINT/SIGTERM
- No cleanup on exit
- No log rotation or disk space checks

The 5-tier error handling described in the architecture (Round 1) is entirely within the agent's PROMPT (program.md), not in shell code. The shell loop is intentionally dumb -- it just keeps iterating.

**Reusability**: This is a deliberate design choice: push all intelligence into the agent, keep the orchestrator minimal. Our system does the same (agent handles complexity, orchestrator manages dispatch). The risk is that agent-level error handling can be ignored or forgotten across context boundaries.

### Finding 10: Variance Analysis for Stuck Detection
[SOURCE: skills/agr/references/guide.md:Variance Analysis]

Baseline establishment: run benchmark 5 times, compute variance. Per-benchmark acceptance: improvement must exceed 5% of best-ever AND no regression exceeding 5% in any other benchmark.

Artifact detection: if ALL experiments show the same "improvement," the baseline was an outlier (noisy measurement), not genuine improvement.

This is a manual/instructional pattern (told to the agent via program.md), not automated code. No actual statistical computation exists in shell or Python -- the agent is trusted to perform the analysis.

## Shell Orchestration Patterns

| Pattern | Implementation | Notes |
|---------|---------------|-------|
| Main loop | `for ((i=1; i<=MAX; i++))` | Simple counter, no convergence check |
| Agent dispatch | `claude -p "$(cat program.md)"` | Fresh context per iteration |
| Error suppression | `|| true` on all commands | Loop never stops |
| Result capture | Agent writes directly to files | No shell-level output parsing |
| Inter-iteration | `sleep 2` | Minimal delay |
| Visualization | `analysis.py` called after each iteration | Regenerates progress.png |
| Parallelism | `-w "worktree-name"` flag (conceptual only) | Not implemented in loop |

## Error Handling Implementation

| Tier (from Round 1 architecture) | Actual Code Implementation |
|-----------------------------------|---------------------------|
| Tier 1: Guard failure | In program.md instructions only -- no shell code |
| Tier 2: Build failure | In program.md instructions only -- no shell code |
| Tier 3: Timeout | `--max-turns 50` flag on claude (hard limit) |
| Tier 4: Stuck detection | In program.md instructions only -- no shell code |
| Tier 5: Exhausted categories | In program.md instructions only -- no shell code |

**Critical finding**: The "5-tier error handling" described in Round 1's architectural analysis exists entirely as natural language instructions in program.md. There is NO programmatic enforcement. The only automated safeguard is `--max-turns 50` which limits agent tool calls per iteration.

## Assessment
- Questions addressed: Q14, Q15
- Questions answered: Q14 (fully -- run_agr.sh is a minimal for-loop), Q15 (partially -- AGR error handling is instruction-only, not code)
- newInfoRatio: 0.75
- Key insight: AGR's "5-tier error handling" is entirely prompt-based, not code-based. The shell loop is intentionally minimal (10 lines). All intelligence is in the agent's prompt. This is both a strength (simplicity) and a weakness (no enforcement).

## Recommended Next Focus
Community pain points to validate whether prompt-only error handling causes real-world failures.
