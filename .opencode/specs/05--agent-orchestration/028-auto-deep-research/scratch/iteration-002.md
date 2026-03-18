# Iteration 002: pi-autoresearch Deep Dive

## Focus
Deep investigation of davebcn87/pi-autoresearch's convergence detection, state management, experiment execution loop, and quality gate patterns. The goal is to identify concrete patterns we can adopt and gaps in our current deep-research implementation compared to a production experiment-loop framework.

## Findings

### Finding 1: pi-autoresearch has NO convergence detection -- by deliberate design choice
[SOURCE: https://raw.githubusercontent.com/davebcn87/pi-autoresearch/main/extensions/pi-autoresearch/index.ts]
[SOURCE: https://raw.githubusercontent.com/davebcn87/pi-autoresearch/main/skills/autoresearch-create/SKILL.md]

The skill file explicitly mandates: "LOOP FOREVER. Never ask 'should I continue?'" The ONLY stopping mechanisms are:
1. Hard `maxIterations` cap (checked via `readMaxExperiments()` from config)
2. Manual `/autoresearch off` command
3. Auto-resume turn ceiling (20 consecutive turns)
4. 5-minute auto-resume cooldown (rate limiting, not convergence)

There is zero algorithmic convergence detection: no plateau detection, no diminishing returns analysis, no rolling averages, no statistical tests. This is a **philosophical design choice** -- the system trusts the human to decide when optimization is "done enough." Our system is significantly more sophisticated here with the `shouldContinue()` algorithm that evaluates diminishing returns via rolling 3-iteration `newInfoRatio` averages.

**Relevance to Q2:** Answered. No novel convergence algorithms exist in pi-autoresearch. Their approach is "infinite loop + human override."

### Finding 2: Segment-based state partitioning -- a novel pattern we lack
[SOURCE: index.ts -- ExperimentState interface and reconstructState function]

pi-autoresearch uses a "segment" model for state management. Each call to `init_experiment` increments a segment counter and starts a fresh baseline within the same JSONL file. Key types:

```typescript
interface ExperimentResult {
  commit: string;
  metric: number;
  metrics: Record<string, number>;  // secondary metrics
  status: "keep" | "discard" | "crash" | "checks_failed";
  description: string;
  timestamp: number;
  segment: number;  // partition key
}
```

The segment model allows **re-initialization without losing history**. A config line in JSONL acts as a segment boundary marker. Functions like `currentResults()` filter by segment for "current session" views while the full JSONL retains all history. `findBaselineMetric()` always returns the first result of the current segment.

Our system has no segment equivalent. Our JSONL tracks iterations linearly. If we wanted to "restart research on the same topic with a different angle," we would need a new spec folder or manual reset. The segment model is more flexible.

### Finding 3: Three-tier state recovery with graceful degradation
[SOURCE: index.ts -- reconstructState function, session history fallback]

pi-autoresearch has three recovery layers:
1. **Primary**: Parse JSONL file line-by-line, reconstruct full state
2. **Fallback**: Scan pi session history for `log_experiment` tool results that contain state snapshots
3. **Default**: Clean initial state if neither source exists

The session history fallback is notable -- it means state can be recovered even if the JSONL file is deleted or corrupted, because each `log_experiment` call stores a complete state snapshot in the tool result's `details` field.

Our system has only one recovery path (read JSONL + strategy.md). We could benefit from a secondary recovery mechanism, such as storing state snapshots in iteration files or keeping a compact state summary in strategy.md that could be parsed programmatically.

### Finding 4: Quality gates via external shell scripts -- a composable pattern
[SOURCE: index.ts -- autoresearch.checks.sh handling in run_experiment]

pi-autoresearch runs `autoresearch.checks.sh` as a post-experiment quality gate with a configurable timeout (default 300s). The gate enforces a hard rule: experiments cannot be "kept" if checks fail (`"Cannot keep -- autoresearch.checks.sh failed"`). Additional quality gates:
- `autoresearch.sh` must be used if it exists (enforced command routing)
- Secondary metric consistency validation (missing or new metrics rejected unless `force: true`)
- Working directory validation before each experiment

This external-script-as-quality-gate pattern is interesting for our system. We could support user-defined validation scripts that run after each research iteration (e.g., checking that cited URLs still resolve, or that code snippets are valid).

**Relevance to Q7:** Partially answered. Experiment execution uses direct shell spawning with timeout, output truncation (10 lines / 4KB for LLM context), and temp file streaming for large outputs. Rate limiting is minimal (5-minute auto-resume cooldown). Quality gates are shell-script-based.

### Finding 5: The "keep/discard" binary as a simplification of quality scoring
[SOURCE: index.ts -- log_experiment, isBetter function]

pi-autoresearch reduces experiment quality to a binary: `keep` or `discard` (plus `crash` and `checks_failed`). The decision is driven by a single comparison: `isBetter(current, best, direction)` where direction is "lower" or "higher." There is no weighted scoring, no multi-criteria evaluation, no confidence intervals.

Our `newInfoRatio` (0.0-1.0) is a richer signal, but it is also more subjective since it is self-assessed by the research agent. The MAD-based statistical confidence layer (PR #22, not yet merged) would add noise-floor detection, but even that remains advisory-only.

**Key insight**: The simplicity of binary keep/discard is deliberate. The SKILL.md says: "Improved -> keep. Worse/equal -> discard." This prevents over-analysis and keeps the loop fast. For research (vs. optimization), our continuous newInfoRatio is more appropriate because research findings are not strictly orderable.

### Finding 6: MAD-based statistical confidence scoring (PR #22) -- a novel approach
[SOURCE: https://api.github.com/repos/davebcn87/pi-autoresearch/issues/22]

PR #22 (open, not merged) proposes using Median Absolute Deviation (MAD) to score confidence in metric improvements:

```
noise_floor = MAD(all metric values in segment)
confidence = |best_improvement| / noise_floor
```

Key design decisions:
- Uses ALL data points (keeps + discards) for unbiased noise estimation
- Minimum 3 data points required for earliest signal
- Remains advisory-only (never affects keep/discard)
- Visual feedback: green >= 2.0x noise floor, yellow 1.0-2.0x, red < 1.0x
- Known tradeoff: after large improvements, MAD inflates temporarily (self-corrects over ~5-10 runs)

**Relevance to Q8:** This is a concrete convergence-adjacent algorithm we could adapt. Instead of our binary newInfoRatio self-assessment, we could track a rolling noise floor and flag when the "information gain per iteration" drops below the noise floor. This would give convergence detection a statistical basis rather than relying on the agent's subjective assessment.

### Finding 7: Auto-resume with turn-based backpressure
[SOURCE: index.ts -- agent_end handler, MAX_AUTORESUME_TURNS]

The auto-resume pattern is simple but effective:
- On `agent_end`, if `autoresearchMode` is active and experiments ran this session, send a resume message
- Rate limited: 5-minute minimum between auto-resumes
- Hard cap: 20 consecutive auto-resume turns (prevents runaway loops)
- Session counter resets on each `agent_start`

Our system dispatches fresh agent contexts per iteration, which is architecturally different. We do not have an equivalent of "auto-resume" because our orchestrator explicitly manages the loop. However, the turn-based backpressure (max 20 auto-resumes) is a useful safety net we could adopt as a secondary hard cap alongside `maxIterations`.

### Finding 8: JSONL is the consensus state format across experiment-loop systems
[SOURCE: index.ts, our state-format.md]

Both systems use append-only JSONL as primary state. pi-autoresearch's JSONL contains two record types (`config` and experiment results). Our system has three (`config`, `iteration`, `event`). Both systems reconstruct state by parsing the full JSONL on startup.

pi-autoresearch's JSONL is simpler (no event records, no structured lifecycle tracking). Our event records (`stuck_recovery`, `synthesis_complete`, `missing_newInfoRatio`) provide richer lifecycle visibility.

**Relevance to Q4:** Answered. JSONL is not "worse" or "better" -- both systems converge on it. pi-autoresearch adds the segment model for partitioning, which is a useful extension. Their session-history fallback recovery is a novel addition beyond pure JSONL. A structured database (SQLite) would offer better querying but lose the human-readability and append-only simplicity that makes JSONL debuggable.

### Finding 9: Living document pattern (autoresearch.md) parallels our strategy.md
[SOURCE: SKILL.md, README.md]

pi-autoresearch maintains `autoresearch.md` as a "living document" containing objectives, strategies, dead-ends, and successes. The skill instructs the agent to read it on resume and update it after insights. The `autoresearch.ideas.md` file acts as a parking lot for promising-but-not-pursued ideas.

Our `strategy.md` serves the same purpose with more structured sections (Key Questions, Answered Questions, What Worked, What Failed, Exhausted Approaches, Next Focus). Our approach is more structured; theirs is more freeform. The `ideas.md` parking lot pattern is something we could adopt -- currently, ideas discovered but not pursued in our system are simply lost or buried in iteration files.

### Finding 10: No parallel execution support in pi-autoresearch
[SOURCE: Full codebase analysis, Issue #12]

pi-autoresearch is strictly sequential: init -> run -> log -> repeat. Issue #12 proposes "multiple research loops using subdirectories" but this is about different research topics, not parallel iterations on the same topic. There is no support for concurrent experiment execution.

Our manual-orchestrated parallel execution (multiple @deep-research agents dispatched simultaneously for different questions) is already more advanced than pi-autoresearch's model.

## Sources Consulted
- https://raw.githubusercontent.com/davebcn87/pi-autoresearch/main/extensions/pi-autoresearch/index.ts (88KB, full extension)
- https://raw.githubusercontent.com/davebcn87/pi-autoresearch/main/package.json
- https://raw.githubusercontent.com/davebcn87/pi-autoresearch/main/skills/autoresearch-create/SKILL.md
- https://api.github.com/repos/davebcn87/pi-autoresearch/contents/skills/autoresearch-create
- https://api.github.com/repos/davebcn87/pi-autoresearch/issues?state=all (30 issues)
- https://api.github.com/repos/davebcn87/pi-autoresearch/issues/22 (MAD confidence PR)
- https://api.github.com/repos/davebcn87/pi-autoresearch/issues/12 (parallel loops proposal)
- .opencode/skill/sk-deep-research/references/convergence.md (our convergence algorithm)
- .opencode/skill/sk-deep-research/references/state-format.md (our state format spec)

## Assessment
- New information ratio: 0.85
- Questions addressed: Q2, Q4, Q7, Q8
- Questions answered: Q2 (fully -- no convergence detection, deliberate design), Q4 (fully -- JSONL is consensus, segment model is novel extension), Q7 (partially -- execution patterns documented, but "experiment" differs from "research iteration"), Q8 (partially -- MAD confidence is a novel algorithm, but it's advisory convergence-adjacent, not a true convergence detector)

## Key Gaps Identified in Our System

| Gap | pi-autoresearch Pattern | Our Current State | Priority |
|-----|------------------------|-------------------|----------|
| Segment-based partitioning | Segment counter in JSONL, re-init without losing history | Linear iterations, new spec folder for restart | Medium |
| State recovery fallback | Session history scanning as backup | Single JSONL source only | Medium |
| Ideas parking lot | `autoresearch.ideas.md` for deferred ideas | Ideas lost in iteration files | Low |
| External quality gates | `autoresearch.checks.sh` with timeout | No user-defined validation hooks | Low |
| Statistical noise floor | MAD-based confidence scoring (PR #22) | Subjective newInfoRatio self-assessment | High |
| Output truncation for LLM | 10 lines / 4KB tail for context fitting | No truncation strategy for large research outputs | Low |

## Recommended Next Focus
1. **AGR (Artificial General Research)** -- Investigate their loop architecture (Q1), which is reported to have more sophisticated convergence and branching. This would give us a third data point for the convergence question (Q8).
2. **autoresearch-opencode** -- Investigate how it adapted pi-autoresearch for OpenCode (Q3), which is directly relevant to our system since it targets the same platform family.
3. **Academic/industry convergence algorithms** (Q8) -- The pi-autoresearch analysis confirms that existing implementations lack sophisticated convergence. Look for convergence algorithms from optimization literature (Bayesian optimization stopping rules, information-theoretic measures) that could be adapted for research loops.
