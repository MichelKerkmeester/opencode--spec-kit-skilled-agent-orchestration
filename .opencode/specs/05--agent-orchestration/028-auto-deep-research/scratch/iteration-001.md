# Iteration 001: AGR Architecture Deep Dive

## Focus
Deep investigation of JoaquinMulet/Artificial-General-Research (AGR) -- its loop/iteration architecture, parallel execution capabilities, error handling/recovery patterns, and novel research strategies. The goal is to identify concrete differences from our JSONL+strategy.md deep-research system and extract improvement ideas.

## Findings

### F1: Loop Architecture -- "Ralph Loop" Pattern (addresses Q1)

AGR uses a **disposable-session linear loop** orchestrated by a bash script (`run_agr.sh`). Each iteration:

1. Launches a FRESH Claude Code instance via `claude -p "$(cat program.md)" --dangerously-skip-permissions --max-turns 200 --effort high`
2. Agent reads ALL state from files (results.tsv + STRATEGY.md)
3. Agent picks ONE optimization, implements it, benchmarks it
4. Agent logs result to results.tsv (append-only, even failures)
5. Agent updates STRATEGY.md (the persistent brain)
6. Agent exits -- context destroyed
7. analysis.py regenerates progress.png
8. Loop restarts from step 1

**Key design principle**: "All State Is Externalized." The AI context window is disposable. Every piece of information lives in files. This means reasoning quality is constant at iteration 100 as at iteration 1 (no context degradation).

**Named influence**: The "Ralph Loop" pattern, credited to the Ralph Loop Claude plugin, explicitly solves context degradation that occurs in single long-running sessions.

[SOURCE: guide.md Section 5 "The Ralph Loop Pattern"; README.md loop architecture diagram]

### F2: Comparison with Our JSONL+Strategy Approach (addresses Q1)

| Dimension | AGR | Our Deep-Research System |
|---|---|---|
| **State format** | results.tsv (append-only TSV) + STRATEGY.md | deep-research-state.jsonl (append-only JSONL) + deep-research-strategy.md |
| **Orchestration** | Bash shell script (`run_agr.sh`) with `while` loop | Manual-orchestrated or command-driven (`/spec_kit:deep-research`) |
| **Agent invocation** | `claude -p` headless mode (fresh CLI instance per iteration) | Sub-agent dispatch within active session (Task tool) |
| **Context isolation** | Complete -- new OS process per iteration | Partial -- sub-agent has own context but shares session |
| **State files** | 6 files: results.tsv, STRATEGY.md, baseline_checksums.json, benchmark.py, program.md, analysis.py | 3 files: state JSONL, strategy.md, config JSON |
| **Domain** | Code optimization (measurable metrics) | Knowledge research (web sources, codebase analysis) |
| **Convergence** | None -- runs until max iterations or human stop | Diminishing-returns detection with convergence threshold |
| **Immutable files** | Explicit list (benchmark.py, baseline, program.md, analysis.py, run script) | Config JSON is effectively immutable; strategy.md is mutable |
| **Visualization** | Auto-generated progress.png after each iteration | None built-in |

**Critical difference**: AGR achieves true context isolation through OS-level process separation (`claude -p` launches a new process). Our system uses sub-agent dispatch which shares the parent session's token budget and may inherit compressed context. AGR's approach guarantees constant reasoning quality but costs more tokens per iteration (no cached context).

**Critical difference**: AGR has NO convergence detection. It runs forever. Our system has a convergence threshold (0.10) and new-information-ratio tracking. This is an area where our system is strictly more sophisticated.

**Shared pattern**: Both use append-only state logs (TSV vs JSONL) and a mutable strategy document as the "persistent brain." The conceptual architecture is nearly identical -- the differences are in execution mechanics, not design philosophy.

[SOURCE: Comparative analysis of guide.md architecture section vs deep-research-config.json and deep-research-strategy.md]

### F3: No Parallel Iteration Execution (addresses Q5)

AGR does NOT implement parallel iteration execution. The loop is strictly sequential.

However, the documentation mentions `--worktree` flag support as an advanced/planned feature:

> "-w / --worktree: Git worktree isolation. Advanced: run parallel experiments on separate branches"

The guide.md provides a brief example:
```bash
# Agent 1: optimize adaptive_esi
claude -p "$(cat program_adaptive.md)" -w "opt-adaptive" --dangerously-skip-permissions

# Agent 2: optimize esi_ess (parallel, different worktree)
claude -p "$(cat program_ess.md)" -w "opt-ess" --dangerously-skip-permissions
```

But there is NO coordination mechanism, merge strategy, or conflict resolution documented. The worktree support appears to be a theoretical capability leveraging Claude Code's `-w` flag, not an implemented workflow. There is no evidence of:
- Parallel loop orchestration scripts
- Result merging from parallel branches
- Conflict detection between parallel agents
- Shared state coordination (results.tsv would conflict)

**Assessment**: Worktree-based parallelism is mentioned but unimplemented in AGR. This is an area where our system's parallel execution mode (if implemented) would be genuinely novel.

[SOURCE: guide.md Section 4 "Advanced: Using --worktree for Parallel Experiments"; README.md worktree mention]

### F4: Error Handling and Recovery Patterns (addresses Q6)

AGR has a sophisticated multi-tier error handling system:

**Tier 1 -- Guard (Correctness) Failures:**
- Every experiment runs `benchmark.py --verify` which checks output checksums against baseline
- Guard FAIL + metric improved = REWORK (fix implementation, keep approach), max 2 attempts
- Guard FAIL + no improvement = DISCARD immediately
- After 2 rework attempts = forced DISCARD
- Rationale: "correctness is non-negotiable"

**Tier 2 -- Build Failures:**
- Build crash = attempt fix (3 attempts max for trivial issues like typos, missing includes)
- Fundamental build failure = log as CRASH, revert via `git reset`, move on
- Lesson learned: build systems have hidden dependency issues (e.g., pybind11 header tracking)

**Tier 3 -- Benchmark Timeouts:**
- Benchmark takes >2x expected time = log as CRASH, revert, move on
- No retry -- timeout indicates fundamental performance regression

**Tier 4 -- Stuck Detection Protocol:**
- Trigger: >5 consecutive discards detected in results.tsv
- Recovery actions (executed within a single iteration):
  1. Re-read ALL source files (expand search scope)
  2. Review entire results log for patterns
  3. Try combining 2-3 previous successful optimizations
  4. Try the OPPOSITE approach of recent failures
  5. Try a radical architectural change
- Does NOT stop the loop -- triggers recovery strategy within next iteration

**Tier 5 -- Exhausted Approaches Registry:**
- When an entire CATEGORY of experiments fails repeatedly, it is blocked
- Added to "Exhausted Approaches" in STRATEGY.md with explicit "do not retry" instructions
- Example: "Compiler flags: 4 experiments failed. MSVC optimization is maxed."
- Categorization is heuristic (agent reasoning), not automatic

**Comparison with our system**: Our deep-research system lacks:
- Tiered error handling (we have no guard/rework pattern)
- Stuck detection with automatic recovery strategies
- Exhausted approaches registry (we track "What Failed" but don't block categories)
- Git-based rollback (our research doesn't modify code, so less relevant)

Our system's error handling is limited to: iteration timeout, JSONL state persistence for crash recovery, and manual strategy adjustment. AGR's multi-tier approach is significantly more robust.

[SOURCE: guide.md Section 7 "Decision Logic"; README.md stuck detection protocol; README.md decision rules]

### F5: No Novel Branching, Backtracking, or Tree Search (addresses Q9)

AGR is **strictly linear sequential optimization**. There is no:
- Tree search / branching exploration
- Backtracking to earlier states
- A/B testing of parallel hypotheses
- Multi-path search strategies
- Exploration vs exploitation balancing

The model is: try one thing, keep or discard, move on. Git provides rollback capability (commit before benchmark, reset on discard), but this is simple undo, not tree exploration.

**However**, AGR has two patterns that approximate branching behavior:

1. **Stuck detection "try opposites"**: When stuck, the protocol explicitly says to "try the opposite approach of recent failures." This is a rudimentary direction-reversal heuristic, not true backtracking, but serves a similar purpose.

2. **Combine previous successes**: The stuck protocol also suggests "combining 2-3 previous successful optimizations in a new way." This is a simple recombination strategy that could be formalized into a more structured exploration pattern.

3. **Supervisor audit of discards**: A human or parent agent reviews discarded experiments for "hidden improvements." This is a manual form of re-evaluation that a tree search would automate.

**Assessment**: AGR deliberately chose simplicity over sophisticated search. The "one metric, one file, one loop" philosophy from Karpathy prioritizes simplicity. Tree search would add complexity. For code optimization (measurable metrics), linear search with stuck detection may be sufficient. For knowledge research (our domain), tree search or branching might be more valuable since research questions can fork into sub-questions.

[SOURCE: guide.md Section 11 "Lessons Learned"; README.md "9 Technical Innovations"]

### F6: Variance Analysis System (novel, not in our questions)

AGR introduced a variance-aware acceptance criterion that is genuinely novel:

- Run benchmark N times (N=5) WITHOUT code changes to establish noise baseline
- Per-benchmark acceptance: improvement must exceed >5% OR >2 sigma of measured variance
- Artifact detection: if ALL experiments (including discards) show same "improvement," the baseline measurement was the outlier, not real improvement

This addresses a fundamental measurement problem: how do you distinguish signal from noise in iterative optimization? The per-benchmark analysis prevents noise in a dominant benchmark from masking real improvements in smaller benchmarks.

**Relevance to our system**: Our deep-research system tracks "new information ratio" (0.0-1.0) as a convergence signal. This is analogous to AGR's variance analysis -- both try to distinguish real progress from noise. However, our metric is subjective (agent self-assessment) while AGR's is objective (statistical measurement). We could potentially use more rigorous metrics for research convergence.

[SOURCE: guide.md Section 6 "Variance Analysis System"]

### F7: Immutable File Architecture (design pattern worth noting)

AGR explicitly categorizes files as MUTABLE vs IMMUTABLE:

**Immutable (agent CANNOT modify):**
- benchmark.py (measurement + verification)
- baseline_checksums.json (ground truth)
- program.md (agent instructions)
- analysis.py (visualization)
- run_autoresearch.sh (loop script)

**Mutable (agent updates each iteration):**
- Source code being optimized
- results.tsv (append-only)
- STRATEGY.md (persistent brain)
- progress.png (auto-regenerated)

This explicit protection list prevents a failure mode they encountered: "We learned this the hard way when the agent edited run_autoresearch.sh and broke the loop."

**Relevance to our system**: Our strategy.md is explicitly marked "orchestrator handles strategy merges" but we don't have a formal immutable/mutable classification. The config JSON is effectively immutable but not enforced. Adding explicit file protection declarations could prevent similar failure modes.

[SOURCE: guide.md Section 8 "File-by-File Reference"; guide.md Section 12 troubleshooting]

### F8: The "Karpathy Simplicity Criterion"

AGR inherits and emphasizes Karpathy's simplicity criterion:

> "A 0.001 val_bpb improvement that adds 20 lines of hacky code? Probably not worth it. Removing code with equal/better results? DEFINITELY keep."

This means code simplification counts as a WIN even without metric improvement. The decision logic includes: "Guard PASS + code is simpler (fewer lines, removed complexity, cleaner design) = KEEP."

And conversely: "Small improvement (<2%) with significant added complexity = DISCARD (complexity cost > marginal improvement)."

**Relevance to our system**: We don't have an equivalent "simplicity criterion" for research. A research analog might be: prefer simpler explanations over complex ones, prefer fewer but higher-quality sources over many weak ones, prefer concise findings over verbose ones.

[SOURCE: guide.md Section 7 "Karpathy's Simplicity Criterion"]

## Sources Consulted

- `https://raw.githubusercontent.com/JoaquinMulet/Artificial-General-Research/main/skills/agr/references/guide.md` (28,594 bytes -- comprehensive technical guide with 13 sections)
- `https://raw.githubusercontent.com/JoaquinMulet/Artificial-General-Research/main/skills/agr/references/templates.md` (14,460 bytes -- file templates for benchmark, program, strategy, analysis, loop scripts)
- `https://raw.githubusercontent.com/JoaquinMulet/Artificial-General-Research/main/skills/agr/SKILL.md` (8KB -- skill definition)
- `https://raw.githubusercontent.com/JoaquinMulet/Artificial-General-Research/main/README.md` (25KB -- project overview with case study)
- `https://api.github.com/repos/JoaquinMulet/Artificial-General-Research/contents/skills/agr/references` (directory listing)
- Phase 0 reconnaissance data (provided in dispatch context)

## Assessment

- **New information ratio**: 0.55 -- The guide.md and templates.md provided significant depth beyond the reconnaissance README/SKILL.md data. Key new information: Ralph Loop origin and trade-off analysis, detailed variance analysis methodology, explicit immutable file architecture, Karpathy simplicity criterion application, comprehensive troubleshooting patterns, and the full 13-step decision tree. The core architecture was already well-covered in reconnaissance.
- **Questions addressed**: Q1, Q5, Q6, Q9
- **Questions answered**: Q1 (fully -- loop architecture mapped and compared), Q5 (fully -- no parallel implementation, worktree mentioned but unimplemented), Q6 (fully -- 5-tier error handling documented), Q9 (partially -- no novel strategies found, but stuck detection heuristics documented as approximations)
- **Confidence**: High for Q1, Q5, Q6 (primary sources, Grade A). Medium for Q9 (absence of evidence is not evidence of absence, but all source files examined).

## Concrete Improvement Ideas for Our System

1. **Stuck Detection Protocol**: Implement a trigger after N consecutive low-value iterations (e.g., 3 iterations with newInfoRatio < 0.15). Recovery: broaden search scope, try opposite approaches, combine previous findings.

2. **Exhausted Approaches Registry**: Add a section to strategy.md that formally blocks depleted research directions. Currently we track "What Failed" but don't enforce blocking.

3. **Immutable File Declarations**: Explicitly classify our state files as immutable (config JSON) vs mutable (JSONL, strategy.md) and enforce this in the protocol.

4. **Visualization**: Auto-generate a progress chart showing newInfoRatio per iteration, convergence trend, and questions-answered timeline.

5. **Tiered Error Recovery**: Instead of single-mode failure handling, implement tiered recovery: (1) retry with broader scope, (2) try opposite direction, (3) combine previous findings, (4) escalate to human.

6. **True Context Isolation**: Consider `claude -p` headless mode for iterations instead of sub-agent dispatch, to achieve AGR's constant-quality reasoning. Trade-off: higher token cost, slower startup, but guaranteed fresh context.

## Recommended Next Focus

- **Iteration 002**: Investigate pi-autoresearch (Q2: convergence detection, Q8: convergence algorithms) -- this is the most likely source of novel convergence ideas since AGR has NO convergence detection at all.
- **Iteration 003**: Investigate autoresearch-opencode (Q3: relationship to our system, Q4: state management patterns) -- closest to our codebase.
