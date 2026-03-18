# Iteration 005: Cross-Cutting Synthesis

## Focus
Compare unique patterns across all 3 external repos (AGR, pi-autoresearch, autoresearch-opencode) to identify "battle-tested" patterns (appearing in 2+ repos) and "innovative" patterns (unique to one repo but high-value). Assess which patterns transfer from the optimization domain to research, answer Q9 (novel strategies), and begin ranking concrete improvement proposals for Q10.

## Cross-Repo Patterns (appearing in 2+ repos)

### P1: Append-Only State Log as Primary History (all 3 repos)
**Repos**: AGR (results.tsv), pi-autoresearch (JSONL), autoresearch-opencode (JSONL)
**Our system**: deep-research-state.jsonl

All three repos use an append-only log as the single source of truth for iteration history. The format differs (AGR uses TSV, the other two use JSONL) but the principle is universal: never overwrite, only append. Failures, successes, and metadata are all logged. This is the most validated pattern in the sample.

**Verdict**: PROVEN. Our system already implements this. No change needed.

[SOURCE: iteration-001.md F1 (results.tsv), iteration-002.md Finding 8 (JSONL consensus), iteration-003.md F3 (JSONL format)]

### P2: Mutable Strategy/Session Document as "Persistent Brain" (all 3 repos)
**Repos**: AGR (STRATEGY.md), pi-autoresearch (autoresearch.md), autoresearch-opencode (autoresearch.md)
**Our system**: deep-research-strategy.md

Every repo maintains a single mutable document that acts as the AI agent's working memory across sessions. This document is the bridge between stateless iterations. Each iteration reads it, reasons from it, and updates it. The document evolves over the research session's lifetime.

**Key variation**: AGR and autoresearch-opencode use a prescriptive format (objectives, constraints, what has been tried). Our system uses an adaptive format (remaining questions, answered questions, what worked/failed, next focus). Our format is better suited to open-ended research.

**Verdict**: PROVEN. Our system already implements this with a research-optimized variant. No change needed.

[SOURCE: iteration-001.md F2 (STRATEGY.md comparison), iteration-002.md Finding 9 (autoresearch.md), iteration-003.md F8 (autoresearch.md prescriptive)]

### P3: Git-Based Rollback/Recovery (2 of 3 repos)
**Repos**: AGR (git reset on discard), autoresearch-opencode (git commit per keep + git revert on discard)
**Our system**: No git integration per iteration

Both AGR and autoresearch-opencode use git as a structured recovery mechanism. Every "keep" decision creates a commit (providing an audit trail and rollback point), and every "discard" reverts to the last good state.

**Research-domain adaptation**: Our deep-research iterations do not modify code, so git rollback of code changes is irrelevant. However, git commits per iteration could serve as recovery checkpoints for STATE files (strategy.md, JSONL). If a state file becomes corrupted, we could reconstruct from the last git commit.

**Verdict**: PARTIALLY APPLICABLE. The pattern is proven for optimization, but the value for research is lower. A lightweight adaptation (git commit after each iteration's state file updates) would provide free recovery points at minimal cost.

[SOURCE: iteration-001.md F4 (git reset on discard), iteration-003.md F5 (3-tier git-based recovery)]

### P4: Exhausted/Dead-End Tracking (2 of 3 repos)
**Repos**: AGR (Exhausted Approaches in STRATEGY.md with "do not retry"), autoresearch-opencode (dead-ends in autoresearch.md)
**Our system**: "Exhausted Approaches" section in strategy.md + agent instruction to not retry

Both AGR and autoresearch-opencode explicitly track approaches that have been tried and failed, with instructions not to retry them. AGR goes further by categorizing entire families of approaches (e.g., "Compiler flags: 4 experiments failed. MSVC optimization is maxed.").

**Verdict**: PROVEN. Our system already implements this. However, our enforcement is instruction-based (agent told to "Respect Exhausted Approaches"), not programmatic. AGR's category-level blocking is more rigorous than our per-item approach.

**Improvement opportunity**: Add category-level blocking to exhausted approaches (e.g., "WebFetch-based research on topic X: 3 iterations returned noise. BLOCKED.") so agents can reason at a higher level about what NOT to try.

[SOURCE: iteration-001.md F4 Tier 5 (AGR exhausted approaches), iteration-003.md F8 (dead-ends in autoresearch.md)]

### P5: Multi-Tier Error Recovery (2 of 3 repos)
**Repos**: AGR (5-tier: guard/rework, build failures, timeouts, stuck detection, exhausted approaches), autoresearch-opencode (3-tier: backup, git, manual)
**Our system**: Single-tier (reconstruct from iteration files if JSONL missing, 3+ consecutive failures halt loop)

Both AGR and autoresearch-opencode have structured, multi-tier error handling with escalation paths. Our system has comparatively sparse error handling -- primarily limited to state file reconstruction and a hard stop after 3 failures.

**Research-domain adaptation**: Several optimization-specific tiers (build failures, benchmark timeouts) do not apply. But the general principle of tiered escalation DOES apply. For research:
- Tier 1: Tool failure -- retry with alternative tool or source
- Tier 2: Focus exhaustion -- widen scope or change approach (our stuck recovery)
- Tier 3: State corruption -- reconstruct from iteration files + git history
- Tier 4: Repeated failure -- escalate to user with diagnostic context

**Verdict**: PROVEN. We should adopt tiered error recovery adapted for the research domain.

[SOURCE: iteration-001.md F4 (5-tier AGR), iteration-003.md F5 (3-tier autoresearch-opencode)]

### P6: Strict Sequential Loop (all 3 repos)
**Repos**: All three are strictly sequential -- one iteration at a time, no concurrency.
**Our system**: Sequential by default, with manual-orchestrated parallel waves as an extension

This is a universal pattern but not necessarily because it is optimal -- it is because it is simple and sufficient. All three repos chose sequential execution for pragmatic reasons: shared mutable state (strategy file, state log) creates coordination problems if multiple agents write simultaneously.

**Verdict**: PROVEN (that sequential is the safe default). Our system's parallel wave capability is genuinely novel across this sample, and the fact that no other system has attempted it confirms that it is non-trivial.

[SOURCE: iteration-001.md F3 (AGR sequential), iteration-002.md Finding 10 (pi sequential), iteration-003.md assessment table]

## Innovative Patterns (unique to one repo, high-value)

### I1: Variance-Aware Acceptance Criterion (AGR only)
AGR runs the benchmark N times WITHOUT code changes to establish a noise baseline, then requires improvements to exceed >5% OR >2 sigma of measured variance. This prevents accepting noise as signal.

**Research-domain adaptation**: Our `newInfoRatio` is a subjective self-assessment by the agent. A statistical approach would require defining an objective "information gain" metric, which is fundamentally harder for knowledge research than for benchmark metrics. However, we COULD track the rolling standard deviation of `newInfoRatio` across iterations and flag when a reported ratio falls within the historical noise band. This would catch inflated or deflated self-assessments.

**Verdict**: HIGH VALUE but requires non-trivial adaptation. The principle (distinguish signal from noise statistically) is universally applicable; the implementation must change from benchmark variance to information-ratio variance.

[SOURCE: iteration-001.md F6 (variance analysis system)]

### I2: MAD-Based Statistical Confidence (pi-autoresearch only, PR #22)
Uses Median Absolute Deviation across all data points (keeps + discards) to compute a noise floor, then expresses improvement as a multiple of the noise floor. Visual feedback: green >= 2.0x, yellow 1.0-2.0x, red < 1.0x.

**Research-domain adaptation**: Could be applied to our `newInfoRatio` time series. Calculate MAD across all iterations, then flag when the latest ratio is < 1.0x the MAD (indicating the "gain" is within noise). This is complementary to I1 -- AGR's variance approach uses standard deviation on a single metric, while MAD is more robust to outliers.

**Verdict**: MEDIUM VALUE. Useful as a convergence confidence signal, but advisory-only (the underlying newInfoRatio is still subjective). Most valuable as a "sanity check" layer.

[SOURCE: iteration-002.md Finding 6 (MAD confidence scoring)]

### I3: Segment-Based State Partitioning (pi-autoresearch only)
Each call to `init_experiment` increments a segment counter in the JSONL. Functions filter by segment for "current session" views while retaining full history. Enables re-initialization without losing prior work.

**Research-domain adaptation**: Directly applicable. If a research topic needs re-investigation with a different angle, a segment boundary in our JSONL would allow a "soft restart" without creating a new spec folder or losing prior iteration data. The convergence algorithm could operate per-segment while cross-segment analysis remains possible.

**Verdict**: HIGH VALUE, low effort. Adding a `segment` field to our JSONL config records and filtering convergence detection by segment is a straightforward schema extension.

[SOURCE: iteration-002.md Finding 2 (segment model)]

### I4: Plugin-Based Auto Context Injection (autoresearch-opencode only)
A TypeScript plugin hooks into OpenCode's `tui.prompt.append` event to automatically inject research context into every agent prompt when research mode is active. No explicit context passing required.

**Research-domain adaptation**: Directly applicable but environment-dependent. If Claude Code supports a similar hook mechanism (it currently does not have a plugin system like OpenCode), this would eliminate context loss on compaction -- the most fragile part of our current system. In the absence of a plugin system, a similar effect could be achieved by the orchestrator injecting a compact state summary into every dispatch prompt.

**Verdict**: HIGH VALUE but environment-blocked. The principle is excellent; implementation depends on runtime capabilities we may not have. A workaround (compact state summary injection) is feasible now.

[SOURCE: iteration-003.md F2 (plugin architecture)]

### I5: Ideas Backlog File (autoresearch-opencode only, with partial presence in pi-autoresearch)
A persistent `autoresearch.ideas.md` file where users can steer future experiments between sessions. The system consults this file during resume to find new directions.

**Research-domain adaptation**: Directly applicable. A `research-ideas.md` in scratch/ would let users add research directions, sub-questions, or hypotheses that persist across sessions and inform the strategy. Currently, user steering requires modifying the dispatch prompt or using `:confirm` mode.

**Verdict**: MEDIUM VALUE, very low effort. A simple convention (check for `scratch/research-ideas.md` in strategy initialization) with no code changes needed -- only a protocol update.

[SOURCE: iteration-003.md F11 (ideas backlog)]

### I6: Stuck Detection with Recovery Heuristics (AGR only)
After >5 consecutive discards, AGR triggers a structured recovery: re-read ALL sources, review entire results log, combine previous successes, try OPPOSITE approaches, try radical architectural changes.

**Research-domain adaptation**: Our system already has stuck detection (3 consecutive low-newInfoRatio iterations) with recovery mode dispatch. AGR's specific heuristics ("try opposites," "combine previous successes") are directly applicable to research: try the opposite angle on a question, or combine findings from separate iterations into a novel synthesis.

**Verdict**: MEDIUM VALUE. Our stuck recovery already exists but could be enriched with AGR's heuristic menu. Low effort to add these as explicit recovery strategies in the stuck recovery protocol.

[SOURCE: iteration-001.md F4 Tier 4 (stuck detection protocol)]

### I7: Rich Worklog Narrative with "Why" Analysis (autoresearch-opencode only)
Each experiment entry includes detailed observations explaining WHY the result occurred. Failed experiments receive equally detailed treatment. This creates a learning record, not just a results log.

**Research-domain adaptation**: Our iteration files capture findings and assessments but lack explicit "Why did this succeed/fail?" analysis. Adding a "Reflection" section to iteration files (WHY were these sources informative? WHY did this approach not yield new information?) would improve cross-iteration learning.

**Verdict**: MEDIUM VALUE, low effort. Protocol update to the iteration-NNN.md template -- add a "Reflection" section.

[SOURCE: iteration-003.md F9 (worklog narrative)]

### I8: Immutable File Architecture with Explicit Protection (AGR only)
Files are explicitly classified as MUTABLE or IMMUTABLE. The immutable list prevents agents from accidentally modifying infrastructure files (learned from an incident where an agent edited the loop script and broke it).

**Research-domain adaptation**: We already mark config JSON as read-only in the agent protocol, but do not have a formal file classification system. For research, the classification would be: IMMUTABLE = config.json, MUTABLE = strategy.md (edit sections), APPEND-ONLY = state.jsonl, WRITE-NEW = iteration-NNN.md.

**Verdict**: LOW-MEDIUM VALUE. Our protocol already covers this informally. Formalizing it as an explicit declaration in the config file would make it machine-enforceable.

[SOURCE: iteration-001.md F7 (immutable file architecture)]

## Research-Domain Adaptation Assessment

Not all optimization patterns transfer to research. Here is the transfer assessment:

| Pattern | Optimization Origin | Research Transfer | Rationale |
|---------|-------------------|-------------------|-----------|
| Append-only state log | Metric tracking | Direct transfer | Works for any structured history |
| Mutable strategy doc | Optimization planning | Direct transfer | Works for any persistent reasoning |
| Keep/discard binary | Metric comparison | Does NOT transfer | Research findings are additive, not competing |
| Git rollback per iteration | Code revert on failure | Partial transfer | State file recovery, not code revert |
| Benchmark variance analysis | Statistical metric validation | Requires adaptation | newInfoRatio is subjective, not measurable |
| Exhausted approaches | Optimization categories | Direct transfer | Works for research direction blocking |
| Stuck detection heuristics | Optimization plateaus | Direct transfer | Research plateaus exist too |
| Multi-tier error recovery | Build/benchmark failures | Requires adaptation | Research-specific failure modes differ |
| Segment partitioning | Re-baseline optimization | Direct transfer | "Restart with new angle" is research-native |
| Ideas backlog | User-guided optimization | Direct transfer | User-guided research is natural |
| Context auto-injection | Session continuity | Direct transfer | Environment-dependent, but principle is universal |

**Key insight**: Patterns that operate at the PROCESS level (state management, error recovery, user interaction) transfer cleanly. Patterns that operate at the MEASUREMENT level (variance analysis, keep/discard, metric comparison) require significant adaptation because research "quality" is harder to quantify than benchmark metrics.

## Novel Strategy Assessment (Q9)

### Q9: Are there novel research strategies (branching, backtracking, tree search) across the repos?

**Answer: No repo implements true branching, backtracking, or tree search. All are strictly linear sequential loops.** However, three patterns approximate non-linear exploration:

### 9.1 AGR's "Try Opposites" Heuristic
When stuck, AGR's protocol explicitly instructs: "Try the OPPOSITE approach of recent failures." This is a direction-reversal heuristic that approximates backtracking without maintaining a search tree. It does not return to a prior state; instead, it inverts the current direction.

**Research analog**: If 3 iterations of "search for convergence algorithms in optimization literature" yielded nothing, try "search for DIVERGENCE indicators" or "search for when NOT to stop." The opposite is a simple heuristic, but it introduces exploration diversity.

[SOURCE: iteration-001.md F5 point 1]

### 9.2 AGR's "Combine Previous Successes" Recombination
The stuck protocol suggests "combining 2-3 previous successful optimizations in a new way." This is a recombination strategy that draws from the history of what worked, not from a search tree.

**Research analog**: After iterations produce separate findings on "state management patterns" and "error recovery patterns," a synthesis iteration could explicitly combine them: "How do state management choices affect error recovery design?" This is recombination of prior knowledge into novel questions.

[SOURCE: iteration-001.md F5 point 2]

### 9.3 AGR's "Supervisor Audit of Discards"
A human or parent agent reviews discarded experiments for hidden value. This is a manual re-evaluation pass that catches false negatives in the keep/discard decision.

**Research analog**: Review low-newInfoRatio iterations for buried insights. An iteration marked as "mostly redundant" (newInfoRatio 0.15) might contain one genuinely novel finding that was overshadowed by redundant findings. A periodic "audit of low-value iterations" could surface missed insights.

[SOURCE: iteration-001.md F5 point 3]

### 9.4 Assessment: Why No Repo Has Branching
The absence of branching/tree search across all three repos is likely because:
1. **Shared mutable state**: The strategy document creates serialization dependencies that prevent branching
2. **Context cost**: Each branch would require a full agent context, making branching expensive
3. **Sufficient sequential performance**: For optimization (measurable metrics), linear search with stuck recovery works well enough
4. **Complexity vs. value**: Tree search adds implementation complexity that may not pay off for single-metric optimization

**For research, the calculus is different.** Research questions naturally fork into sub-questions. A question like "What convergence algorithms exist?" spawns sub-questions about statistical methods, information theory, and Bayesian approaches. Our parallel wave execution is already a form of branching (multiple agents investigating different questions simultaneously), though without the tree-search property of choosing which branch to explore further based on results.

**Improvement opportunity**: Our parallel wave capability could be extended into a simple breadth-first branching strategy:
1. Wave 1: Investigate N independent questions in parallel
2. Scoring: Rank questions by newInfoRatio (which yielded most new info?)
3. Wave 2: Spawn follow-up iterations for the top-K questions (pruning low-value branches)
4. Repeat until convergence

This is not full tree search, but it is a "scored branching with pruning" strategy that no existing repo implements. Effort: medium (requires scoring and dispatch logic in the orchestrator).

## Preliminary Improvement Proposals (Q10)

Ranked by impact-to-effort ratio, based on findings from all three repos and our system's current capabilities.

| # | Proposal | Source Repo(s) | Effort | Impact | Priority | Rationale |
|---|----------|---------------|--------|--------|----------|-----------|
| 1 | **Segment-based state partitioning** -- Add segment field to JSONL config records, filter convergence per-segment, enable "soft restart" within same spec folder | pi-autoresearch | Low | High | P1 | Schema extension only. Unlocks re-investigation without new spec folders. Proven pattern. |
| 2 | **Tiered error recovery** -- Implement 4-tier research-adapted error escalation (tool retry, scope widening, state reconstruction, user escalation) | AGR + autoresearch-opencode | Medium | High | P1 | Our single-tier handling is the biggest robustness gap. Both optimization repos have multi-tier as a proven pattern. |
| 3 | **Enriched stuck recovery heuristics** -- Add "try opposites," "combine prior findings," and "audit low-value iterations" to stuck recovery protocol | AGR | Low | Medium | P2 | Low effort to add as explicit strategies in convergence.md. Provides diversity in recovery approaches. |
| 4 | **Ideas backlog file** -- Add `scratch/research-ideas.md` convention. Check during strategy init and stuck recovery. | autoresearch-opencode | Low | Medium | P2 | Protocol-only change (no code). Enables user steering across sessions. |
| 5 | **Iteration reflection section** -- Add "Reflection: Why" section to iteration-NNN.md template requiring explicit causal analysis of results | autoresearch-opencode | Low | Medium | P2 | Improves learning quality across iterations. Template change only. |
| 6 | **Category-level exhausted approaches** -- Upgrade exhausted approaches from per-item to per-category blocking with explicit "BLOCKED" labels | AGR | Low | Medium | P2 | More effective at preventing wasted iterations on depleted research directions. |
| 7 | **Scored branching with pruning** -- Extend parallel wave execution: score questions by newInfoRatio, prune low-value branches, spawn follow-ups for top-K | None (novel synthesis) | High | High | P2 | No external repo has this. Leverages our existing parallel wave advantage. High effort but unique capability. |
| 8 | **Statistical newInfoRatio validation** -- Track rolling MAD/variance of newInfoRatio, flag ratios within noise band, provide convergence confidence score | AGR + pi-autoresearch | Medium | Medium | P3 | Adds objective validation layer to subjective self-assessment. Improves convergence signal quality. |
| 9 | **Git commit per iteration** -- Auto-commit state files after each iteration completes for recovery checkpoints | AGR + autoresearch-opencode | Low | Low | P3 | Free recovery points. Low value because our append-only JSONL already provides some corruption resistance. |
| 10 | **Compact state summary injection** -- Include a 200-token state summary in every agent dispatch prompt (approximating auto-context injection) | autoresearch-opencode | Medium | Medium | P3 | Reduces context loss risk. Workaround for missing plugin system. |
| 11 | **Formal file mutability declarations** -- Add `fileProtection` map to config.json classifying each file as immutable/mutable/append-only/write-new | AGR | Low | Low | P4 | Marginal improvement over current informal classification. Useful for machine enforcement. |
| 12 | **Progress visualization** -- Auto-generate convergence chart showing newInfoRatio trend, questions-answered timeline, and branch coverage | AGR | Medium | Low | P4 | Nice-to-have for monitoring long research sessions. Not critical for correctness. |

### Priority Legend
- **P1**: Should adopt -- high impact, proven pattern, addresses known gap
- **P2**: Should consider -- medium impact, enriches existing capabilities
- **P3**: Could adopt -- measurable but modest benefit, or requires non-trivial adaptation
- **P4**: Nice-to-have -- low priority, polish-level improvements

## Sources Consulted
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research/scratch/iteration-001.md` (AGR deep dive)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research/scratch/iteration-002.md` (pi-autoresearch deep dive)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research/scratch/iteration-003.md` (autoresearch-opencode deep dive)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/04--agent-orchestration/028-auto-deep-research/scratch/deep-research-strategy.md` (current strategy state)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/convergence.md` (our convergence algorithm)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/sk-deep-research/references/loop-protocol.md` (our loop protocol)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.claude/agents/deep-research.md` (our agent definition)
- `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/command/spec_kit/deep-research.md` (our command definition)

## Assessment
- New information ratio: 0.45
- Questions addressed: Q9, Q10
- Questions answered: Q9 (fully -- no true branching/tree search in any repo; three approximation heuristics documented; novel "scored branching with pruning" proposed from synthesis), Q10 (substantially -- 12 ranked proposals with effort/impact assessment; final ranking may shift after iteration 006 consolidation)
- Confidence: High for Q9 (all repos thoroughly analyzed, absence of branching is confirmed). Medium-High for Q10 (proposals are evidence-based but priority ranking is subjective).

The newInfoRatio of 0.45 reflects that this iteration synthesizes existing findings rather than discovering entirely new patterns. The new information consists of: (a) cross-repo pattern validation (which patterns are proven vs. innovative), (b) research-domain transfer assessment (which is original analysis), (c) the "scored branching with pruning" proposal (novel, synthesized from parallel wave + AGR stuck heuristics), and (d) the ranked improvement proposal table (new artifact).

## Recommended Next Focus
- **Iteration 006**: Consolidate Q4 (state management recommendations), Q7 (research execution strategies), and Q8 (convergence algorithms beyond diminishing returns). These three partially-answered questions need final synthesis. Also finalize the Q10 improvement proposals into a prioritized implementation roadmap.
- **If iteration budget allows**: Search optimization/information-theory literature for statistical convergence methods that could replace or augment the subjective newInfoRatio. This was identified in iteration 002 as a gap that external repos do not fill.
