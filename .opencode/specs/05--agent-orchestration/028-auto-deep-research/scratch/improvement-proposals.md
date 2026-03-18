# Deep Research System: Improvement Proposals

> **Status**: v2 -- refined with code-level analysis and community validation (14 iterations, 2 rounds)
> **Date**: 2026-03-18 (v2 updated same day)
> **Scope**: Improvements to the `/spec_kit:deep-research` command, `@deep-research` agent, and `sk-deep-research` skill
> **Source repos analyzed**: karpathy/autoresearch (original, 41K stars), JoaquinMulet/Artificial-General-Research (AGR), davebcn87/pi-autoresearch, dabiggm0e/autoresearch-opencode
> **v2 changes**: 3 effort reductions, 3 priority elevations, 2 new proposals, CUSUM dropped from composite convergence

---

## Executive Summary

This document presents 18 prioritized improvement proposals for our deep-research system, derived from a 14-iteration, 2-round investigation that examined 4 external autoresearch implementations at both architectural AND code level, surveyed convergence algorithms, analyzed GitHub community pain points (322+ issues/PRs), and studied real execution data from completed sessions.

**v2 refinements from Round 2 (iterations 008-014)**: Code-level analysis revealed that architectural descriptions overstate implementation complexity by 30-50%. AGR's "5-tier error handling" is prompt text only. autoresearch-opencode's "rich context injection" is a static string. This enabled effort reductions for 3 proposals. Community validation from karpathy's 300+ issues independently confirmed 3 of our proposals (reflection, checkpointing, ideas backlog), increasing implementation confidence. Real execution data showed research loops are 10-50x shorter than optimization loops, making CUSUM impractical -- dropped from the composite convergence algorithm. Two new proposals added based on code patterns and community demand.

---

## Priority 1: Adopt Now

These address known robustness and quality gaps using patterns proven across 2+ external repos.

### P1.1: Tiered Error Recovery

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (5-tier model), autoresearch-opencode (3-tier backup/git/manual) |
| **Evidence** | AGR's 5-tier system handles guard failures, build failures, timeouts, stuck detection, and exhausted categories. autoresearch-opencode has backup restoration, git history, and manual rebuild. Our system has single-tier: 3+ failures halt the loop. |
| **Effort** | **Small (S)** ~~Medium (M)~~ [v2: code-level analysis revealed AGR's 5-tier handling is prompt-only, not code] |
| **Impact** | High (H) |

**Implementation sketch**: Define 4 research-adapted tiers in `convergence.md` and the agent protocol: (1) Tool/source failure -- retry with alternative tool or source, max 2 retries; (2) Focus exhaustion -- widen search scope or reverse approach direction, triggered after 2 low-value iterations on same focus; (3) State corruption -- reconstruct JSONL from iteration-NNN.md Assessment sections; (4) Repeated systemic failure -- escalate to user with diagnostic summary. Each tier has a max-attempt count before escalating to the next tier. The orchestrator dispatch prompt includes the current tier level so agents can adapt their strategy.

**v2 update**: This is a protocol/documentation change only -- no code implementation needed. AGR implements all 5 tiers via prompt instructions alone (iteration 009 confirmed). Add a 5th tier for agent dispatch failure (discovered in Round 2 when 529 API overload blocked all sub-agents): orchestrator absorbs the work in "direct mode".

### P1.2: Composite Convergence Algorithm

| Attribute | Value |
|-----------|-------|
| **Source** | Optuna Terminator (regret bounds), NIST CUSUM (regime detection), pi-autoresearch PR #22 (MAD confidence), iteration 004 Algorithm D synthesis |
| **Evidence** | 4 concrete algorithms proposed with pseudocode in iteration 004. Our current approach (rolling 3-iteration average of self-assessed newInfoRatio below 0.05) is a single-signal stagnation window. Every production optimization framework uses more sophisticated stopping. The composite approach combines 4 signals: rolling average (existing), MAD-based noise detection (from pi-autoresearch), question-coverage entropy (novel), and stagnation window (relaxed from existing). |
| **Effort** | Medium (M) |
| **Impact** | High (H) |

**Implementation sketch**: Replace the current `shouldContinue()` function in `convergence.md` with a weighted-vote composite. ~~Four~~ **Three** signals each cast a stop/continue vote with weights: rolling-average (0.30), signal-vs-noise via MAD (0.35), question-coverage residual entropy (0.35). Stop when the weighted stop-score exceeds a consensus threshold (default 0.60). The MAD computation requires 4+ iterations of data. The question-coverage signal reads from strategy.md's answered/unanswered question counts. This degrades gracefully -- if fewer than 4 iterations exist, the MAD signal is omitted and weights are redistributed. Expose the individual signal values in the JSONL event record for diagnostics.

**v2 update**: CUSUM permanently dropped (iteration 012 confirmed research loops are 10-50x shorter than optimization loops -- insufficient data points for regime detection). Stagnation count subsumed into rolling average. Question-coverage entropy weight increased (0.25 → 0.35) as our unique competitive advantage. 3-signal composite is simpler and better suited to small-N research loops.

### P1.3: Exhausted Approaches Registry Enhancement

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (Tier 5: category-level blocking with "do not retry") |
| **Evidence** | AGR categorizes entire families of failed approaches and blocks them. Our system tracks "What Failed" and "Exhausted Approaches" in strategy.md but does not enforce category-level blocking. Agents can (and do) re-attempt depleted directions if the block is only advisory text. |
| **Effort** | Small (S) |
| **Impact** | Medium-High (M-H) |

**Implementation sketch**: Formalize the "Exhausted Approaches" section in strategy.md with structured entries: `### [Category Name] -- BLOCKED (iteration NNN, N attempts)`. Add a protocol rule in the agent definition requiring agents to CHECK exhausted approaches BEFORE choosing an iteration focus. If the chosen focus falls within a blocked category, the agent must select an alternative. The orchestrator validates this by scanning the iteration focus against the exhausted list before dispatch.

### P1.4: State Recovery Fallback Path

| Attribute | Value |
|-----------|-------|
| **Source** | pi-autoresearch (session-history fallback), autoresearch-opencode (3-tier recovery) |
| **Evidence** | pi-autoresearch can reconstruct state from session history even if JSONL is deleted. autoresearch-opencode has backup + git + manual rebuild. Our system has only one recovery path (read JSONL). If the JSONL is corrupted or truncated, there is no secondary recovery mechanism. |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Add a recovery function that scans `scratch/iteration-*.md` files when JSONL is missing or unparseable. Parse each iteration file's `## Assessment` section to extract: run number, newInfoRatio, questions addressed, questions answered. Reconstruct JSONL iteration records from this data. This provides a degraded but functional state that allows the research loop to continue. Document the recovery path in the loop protocol alongside the primary JSONL read path.

---

## Priority 2: Adopt Next

These enrich existing capabilities with moderate effort. Each has clear value but is not blocking.

### P2.1: Enriched Stuck Recovery Heuristics

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (stuck detection protocol: try opposites, combine successes, audit discards) |
| **Evidence** | AGR triggers structured recovery after 5+ consecutive discards with explicit heuristics. Our stuck recovery exists (3 consecutive low-newInfoRatio iterations trigger recovery mode) but the recovery strategy is generic ("broaden scope"). AGR's specific heuristics provide actionable diversity. |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Add three explicit recovery strategies to the stuck recovery section of `convergence.md`: (1) "Try Opposites" -- if N iterations searched for X, search for NOT-X or the converse; (2) "Combine Prior Findings" -- explicitly synthesize the two highest-newInfoRatio iterations into a new question; (3) "Audit Low-Value Iterations" -- re-read iterations with newInfoRatio below 0.20 and extract any buried insights. The orchestrator selects the strategy based on the nature of the stuck condition (same-focus exhaustion vs. general plateau).

### P2.2: Ideas Backlog File

| Attribute | Value |
|-----------|-------|
| **Source** | autoresearch-opencode (autoresearch.ideas.md), pi-autoresearch (similar concept) |
| **Evidence** | autoresearch-opencode maintains a persistent ideas file consulted during resume. Our system loses deferred ideas because they are buried in iteration files and not surfaced during strategy initialization or stuck recovery. |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Add a convention for `scratch/research-ideas.md` as a persistent parking lot for promising-but-not-pursued directions. The orchestrator checks this file during strategy initialization (add to the "read state files" step) and during stuck recovery (check ideas before defaulting to generic recovery). Users can edit this file between sessions to steer future iterations. No code changes -- protocol update only in the command and agent definitions.

### P2.3: Iteration Reflection Section

| Attribute | Value |
|-----------|-------|
| **Source** | autoresearch-opencode (worklog with per-experiment "why" analysis) |
| **Evidence** | autoresearch-opencode's worklog.md includes detailed observations explaining WHY each result occurred. Our iteration files capture findings and assessments but lack explicit causal analysis ("Why was this source informative?", "Why did this approach fail to yield new information?"). |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Add a `## Reflection` section to the iteration-NNN.md template, placed between `## Assessment` and `## Recommended Next Focus`. This section requires the agent to explain: (1) What approach worked and why; (2) What did not work and why; (3) What would I do differently next iteration. This improves cross-iteration learning and provides richer input for synthesis iterations. Update the agent definition to include this section in the iteration output format.

### P2.4: Segment-Based State Partitioning

| Attribute | Value |
|-----------|-------|
| **Source** | pi-autoresearch (segment model with per-segment filtering) |
| **Evidence** | pi-autoresearch uses a segment counter in JSONL that enables re-initialization without losing history. Our system requires a new spec folder to restart research on the same topic with a different angle. This creates unnecessary spec folder proliferation for iterative refinement of the same topic. |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Add a `"segment"` field to JSONL iteration records (default: 1). Add a `{"type":"event","event":"segment_start","segment":N,"reason":"..."}` record type. The convergence algorithm filters by current segment when computing rolling averages and stagnation counts. Cross-segment analysis remains available by reading the full JSONL without segment filtering. Segment transitions are triggered by the orchestrator via a `:restart` mode or when the user explicitly requests a new research angle.

### P2.5: Scored Branching with Pruning

| Attribute | Value |
|-----------|-------|
| **Source** | Novel synthesis (no external repo implements this; combines our parallel wave capability with AGR stuck detection heuristics) |
| **Evidence** | No external repo has branching, backtracking, or tree search. All are strictly sequential. Our parallel wave execution is already a form of branching, but without scoring or pruning. The opportunity is to score which parallel branches yielded the most information and allocate follow-up iterations accordingly. |
| **Effort** | Large (L) |
| **Impact** | High (H) |

**Implementation sketch**: Extend the wave orchestration protocol: (1) Wave 1 dispatches N agents on independent questions; (2) After Wave 1 completes, rank all questions by their iteration's newInfoRatio; (3) Wave 2 dispatches follow-up agents for the top-K questions (K = ceil(N/2)), pruning low-value branches; (4) Repeat until convergence. This requires the orchestrator to implement a scoring+dispatch loop rather than pre-assigning all iteration focuses. The pruning threshold should be configurable (default: prune questions with newInfoRatio below the median of Wave 1 results).

---

## Priority 3: Consider Later

Measurable benefit but requires non-trivial adaptation or addresses less critical gaps.

### P3.1: Statistical newInfoRatio Validation

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (variance analysis with 2-sigma threshold), pi-autoresearch PR #22 (MAD-based confidence scoring) |
| **Evidence** | Our newInfoRatio is a subjective self-assessment by the research agent. AGR and pi-autoresearch both identified that subjective quality signals need objective validation layers. The MAD-based approach provides a noise floor that can detect when a reported ratio is within historical noise. |
| **Effort** | Medium (M) |
| **Impact** | Medium (M) |

**Implementation sketch**: After each iteration, compute the MAD of all historical newInfoRatio values. Compare the latest ratio against the noise floor (MAD * 1.4826). If the ratio is within 1.0x the noise floor, log an advisory event `{"type":"event","event":"ratio_within_noise"}` in the JSONL. This does not override the convergence algorithm but provides a diagnostic signal. Display noise-floor status in the iteration summary so the orchestrator can make informed decisions.

### P3.2: Compact State Summary Injection

| Attribute | Value |
|-----------|-------|
| **Source** | autoresearch-opencode (plugin-based auto context injection) |
| **Evidence** | autoresearch-opencode uses a TypeScript plugin to auto-inject research context into every prompt. Our system relies on the orchestrator dispatch prompt, which is fragile to context loss on compaction. A compact state summary injected into every dispatch would reduce this risk. |
| **Effort** | Medium (M) |
| **Impact** | Medium (M) |

**Implementation sketch**: Generate a 200-token state summary from the JSONL and strategy.md at dispatch time. Include: current segment, iterations completed, questions answered/remaining, last 2 iteration focuses and their newInfoRatio, any active stuck recovery state, and the current "Next Focus" from strategy.md. Inject this summary as a preamble to every agent dispatch prompt. This ensures the agent has baseline context even if detailed strategy.md reading fails.

### P3.3: Git Commit Per Iteration

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (commit before benchmark, reset on discard), autoresearch-opencode (commit per keep) |
| **Evidence** | Both repos use git as implicit recovery checkpoints. Our system does not commit state files per iteration, meaning corruption has no rollback points beyond the append-only JSONL property. |
| **Effort** | Small (S) |
| **Impact** | Low (L) |

**Implementation sketch**: After each iteration completes (JSONL appended, iteration file written, strategy.md updated), auto-commit the scratch/ directory with message `chore(deep-research): iteration NNN complete`. This provides free rollback points. If state corruption occurs, `git log -- scratch/` shows the last good state. Low priority because our append-only JSONL already provides some corruption resistance.

---

## Priority 4: Track

Ideas to monitor but not implement now. Low immediate value or dependent on external factors.

### P4.1: Formal File Mutability Declarations

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (immutable file architecture), karpathy original (prepare.py as immovable anchor) |
| **Evidence** | AGR learned the hard way when an agent edited the loop script. Our protocol informally marks config JSON as read-only but does not have machine-enforceable declarations. |
| **Effort** | Small (S) |
| **Impact** | Low (L) |

**Implementation sketch**: Add a `"fileProtection"` map to the config JSON: `{"config.json":"immutable","state.jsonl":"append-only","strategy.md":"mutable","iteration-*.md":"write-once"}`. The orchestrator validates agent outputs against these declarations before writing. Low priority because we have not experienced the failure mode this prevents.

### P4.2: Progress Visualization

| Attribute | Value |
|-----------|-------|
| **Source** | AGR (auto-generated progress.png via analysis.py after each iteration) |
| **Evidence** | AGR generates a convergence chart showing metric improvement over iterations. Our system has no visual progress tracking for long research sessions. |
| **Effort** | Medium (M) |
| **Impact** | Low (L) |

**Implementation sketch**: After each iteration, generate a text-based or markdown convergence summary: newInfoRatio trend line (ASCII sparkline), questions answered vs remaining (progress bar), and total findings count. This could be appended to strategy.md or emitted as a separate `scratch/progress.md` file. A graphical PNG is possible via a Python script but adds a dependency.

### P4.3: True Context Isolation via `claude -p`

| Attribute | Value |
|-----------|-------|
| **Source** | AGR ("Ralph Loop" -- fresh `claude -p` process per iteration) |
| **Evidence** | AGR achieves constant reasoning quality by launching a new OS process per iteration. Our sub-agent dispatch shares the parent session's token budget and may inherit compressed context. AGR's approach guarantees fresh context but costs more tokens and loses cached context benefits. |
| **Effort** | Large (L) |
| **Impact** | Medium (M) |

**Implementation sketch**: For autonomous/unattended mode, replace Task tool dispatch with shell-level `claude -p` invocation per iteration. The orchestrator generates a self-contained prompt from strategy.md + config.json + last N iteration summaries, writes it to a temp file, and executes `claude -p "$(cat temp_prompt.md)" --max-turns 50`. The agent writes its iteration file directly. This requires rethinking the dispatch mechanism but guarantees no context degradation across iterations. Track this for when we want fully autonomous overnight research sessions.

### P4.4: Research Simplicity Criterion

| Attribute | Value |
|-----------|-------|
| **Source** | karpathy original (code simplification counts as a win even without metric improvement) |
| **Evidence** | Karpathy's philosophy: "Removing code with equal/better results? DEFINITELY keep." No fork inherited this for research. A research analog would value simpler explanations, fewer but higher-quality sources, and concise findings. |
| **Effort** | Small (S) |
| **Impact** | Low (L) |

**Implementation sketch**: Add a soft quality criterion to the iteration assessment: if an iteration consolidates or simplifies prior findings (reduces the number of open questions, resolves contradictions, provides a cleaner model), it receives a newInfoRatio bonus even if no new external information was gathered. This incentivizes synthesis iterations alongside discovery iterations. Protocol-only change in the agent definition.

---

## v2 New Proposals (from Round 2)

### P1.5: JSONL Fault Tolerance

| Attribute | Value |
|-----------|-------|
| **Source** | pi-autoresearch `reconstructState()` function (iteration 008) |
| **Evidence** | pi-autoresearch silently skips malformed JSONL lines and uses default values (`?? ""`, `?? 0`, `?? "keep"`) for missing fields. Our JSONL parser would fail on any corruption. Community experience (pi-autoresearch Issue #7 state leak, Issue #8 fix) shows state corruption is a real-world occurrence. |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Wrap each JSONL line parse in try/catch. On parse failure, skip the line and increment a counter. After all lines processed, if any were skipped, log: "Warning: N of M JSONL lines were malformed and skipped." For successfully parsed lines, apply defaults for missing fields: `status ?? "complete"`, `newInfoRatio ?? 0`, `findingsCount ?? 0`, `focus ?? "unknown"`, `keyQuestions ?? []`. This ensures the research loop can continue even after partial state corruption.

### P2.6: Sentinel Pause File

| Attribute | Value |
|-----------|-------|
| **Source** | autoresearch-opencode `.autoresearch-off` sentinel (iteration 010), pi-autoresearch Issue #6 stop request (iteration 011) |
| **Evidence** | autoresearch-opencode implements `fs.existsSync('.autoresearch-off')` to pause the loop. pi-autoresearch community requested a "dedicated stop button" (Issue #6, 3 comments). Simple file existence check enables clean pause/resume without process management. |
| **Effort** | Small (S) |
| **Impact** | Medium (M) |

**Implementation sketch**: Before dispatching each iteration, check for `scratch/.deep-research-pause`. If present, log an event `{"type":"event","event":"paused","reason":"sentinel file detected"}` and halt with message: "Research paused. Delete scratch/.deep-research-pause to resume." On resume, log `{"type":"event","event":"resumed"}`. For autonomous mode (future P4.3), this provides the only user intervention mechanism short of killing the process.

---

## Convergence Algorithm Placement

The 4 convergence algorithms proposed in iteration 004 map to the priority tiers as follows:

| Algorithm | Description | Priority Placement | Rationale |
|-----------|-------------|-------------------|-----------|
| **D: Composite Weighted Voting** | Combines rolling average + MAD + entropy + stagnation | **P1 (P1.2)** | This is the recommended implementation. It subsumes Algorithms A and C as component signals. Proven principle (Optuna uses multi-signal termination). Addresses our biggest quality gap (single-signal convergence). |
| **A: Improvement-vs-Error (MAD)** | Stop when improvement potential falls below noise floor | **Subsumed by P1.2** | Becomes Signal 2 within the composite algorithm. Not a standalone proposal. |
| **C: Entropy-Based Question Coverage** | Stop when residual entropy of unanswered questions approaches zero | **Subsumed by P1.2** | Becomes Signal 3 within the composite algorithm. |
| **B: CUSUM Regime Detection** | Cumulative sum detects shift from productive to converged regime | **P4 (Track)** | Three tuning parameters make it harder to configure than MAD. The composite approach achieves similar sensitivity without CUSUM's complexity. Monitor for potential inclusion if the composite algorithm shows blind spots in regime-shift detection. |

---

## What Makes Our System Unique

Based on comprehensive analysis of 4 external autoresearch implementations, our deep-research system has several competitive advantages that no other system offers:

### 1. Question-Driven Exploration
Our system is the only one guided by a structured question graph. All 4 external repos optimize a single numeric metric. Our strategy.md maintains Key Questions, Answered Questions, and dynamically evolving sub-questions. This enables directed exploration rather than gradient-following. No external repo has an equivalent.

### 2. Convergence Detection
All 4 external repos run until a human stops them or a hard iteration cap is hit. None implements algorithmic convergence detection. Our system's `shouldContinue()` algorithm -- even in its current single-signal form -- is unique across the sample. The proposed composite algorithm (P1.2) would make it the most sophisticated convergence detector in any autoresearch system.

### 3. Parallel Wave Execution
No external repo supports concurrent iteration execution. AGR mentions worktree-based parallelism but has not implemented it. pi-autoresearch Issue #12 proposes parallel topics but not parallel iterations. Our manual-orchestrated parallel waves (multiple agents investigating different questions simultaneously) are genuinely novel. The proposed scored branching with pruning (P2.5) would extend this into a structured exploration strategy.

### 4. Progressive Synthesis
Our `research.md` output grows across iterations as a cumulative knowledge artifact. External repos accumulate metric logs and code changes, but none produces a progressive synthesis document. This is a research-native pattern with no optimization equivalent.

### 5. Domain Adaptation
Our system is purpose-built for knowledge research, not adapted from code optimization. The append-only-everything model (no discard, no revert), source tracking with citations, multi-tool investigation (WebFetch + Grep + Glob + Read), and qualitative assessment framework are all research-specific design choices that external repos lack.

### 6. Research-Optimized Strategy Document
Our strategy.md with structured sections (Key Questions, Answered, What Worked, What Failed, Exhausted Approaches, Next Focus) is more sophisticated than any external strategy document. Karpathy Issue #314 proposes making program.md mutable -- we already do this. Our system is ahead of even the original Karpathy design on meta-level strategy evolution.

---

## Implementation Sequencing (v2)

Recommended order within each priority tier:

**P1 (adopt now -- 6 items, all Small or Medium effort)**:
1. P1.5 JSONL Fault Tolerance (trivial, immediate robustness improvement)
2. P1.3 Exhausted Approaches Enhancement (small, establishes "check before acting" + positive selection)
3. P1.4 State Recovery Fallback (small, addresses real failure mode, code pattern from pi-autoresearch)
4. P2.3 Iteration Reflection Section (elevated to P1, template change, community-validated)
5. P1.1 Tiered Error Recovery (small -- prompt-only, builds on P1.3's blocking pattern)
6. P1.2 Composite Convergence Algorithm (medium, the most impactful single change, 3-signal composite)

**P2 (adopt next -- 5 items)**:
1. P2.2 Ideas Backlog File (protocol-only, instant value, +auto-resume integration)
2. P2.6 Sentinel Pause File (trivial, high user-control value)
3. P3.2 Compact State Summary (elevated to P2, simpler than expected -- template approach)
4. P2.1 Enriched Stuck Recovery (builds on P1.1 tiers)
5. P2.4 Segment Partitioning (schema change, requires testing)
6. P2.5 Scored Branching (largest, depends on P2.4, +breakthrough detection)

**P3 (consider later -- 3 items)**:
1. P3.1 Statistical newInfoRatio Validation
2. P4.2 Progress Visualization (elevated to P3, template available from AGR analysis.py)
3. P3.3 Git Commit Per Iteration (+targeted git add, not -A)

**P4 (track -- 4 items)**: P4.1, P4.3, P4.4 unchanged.

---

## Summary Table (v2)

| ID | Proposal | Effort | Impact | Priority | v2 Change |
|----|----------|--------|--------|----------|-----------|
| P1.1 | Tiered Error Recovery | **S** | H | 1 | Effort M→S (prompt-only) |
| P1.2 | Composite Convergence Algorithm | M | H | 1 | 4→3 signals, CUSUM dropped |
| P1.3 | Exhausted Approaches Enhancement | S | M-H | 1 | +positive selection criteria |
| P1.4 | State Recovery Fallback | S | M | 1 | Confirmed by pi-autoresearch code |
| **P1.5** | **JSONL Fault Tolerance** | **S** | **M** | **1** | **NEW** |
| P2.1 | Enriched Stuck Recovery Heuristics | S | M | 2 | — |
| P2.2 | Ideas Backlog File | S | M | 2 | +auto-resume integration |
| **P2.3** | **Iteration Reflection Section** | **S** | **M** | **1** | **Priority 2→1** (community-validated) |
| P2.4 | Segment-Based State Partitioning | S | M | 2 | — |
| P2.5 | Scored Branching with Pruning | L | H | 2 | +breakthrough detection |
| **P2.6** | **Sentinel Pause File** | **S** | **M** | **2** | **NEW** |
| P3.1 | Statistical newInfoRatio Validation | M | M | 3 | — |
| **P3.2** | **Compact State Summary Injection** | **S** | **M** | **2** | **Effort M→S, Priority 3→2** |
| P3.3 | Git Commit Per Iteration | S | L | 3 | +targeted git add (not -A) |
| P4.1 | File Mutability Declarations | S | L | 4 | — |
| **P4.2** | **Progress Visualization** | **S** | **L** | **3** | **Effort M→S, Priority 4→3** |
| P4.3 | True Context Isolation | L | M | 4 | Claude-only backend confirmed |
| P4.4 | Research Simplicity Criterion | S | L | 4 | — |

**v2 totals**: 18 proposals (16 original + 2 new). P1: 6 items (was 4). P2: 5 items (was 5). P3: 3 items (was 3). P4: 4 items (was 4).
