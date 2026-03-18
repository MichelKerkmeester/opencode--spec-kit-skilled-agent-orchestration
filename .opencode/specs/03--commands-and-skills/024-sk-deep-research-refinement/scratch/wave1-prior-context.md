# Wave 1C: Prior Research Context

> Extracted from spec 023-sk-deep-research-creation deep-research session (14 iterations, 2 rounds, 18 proposals v2).

---

## 18 v2 Proposals Summary Table

| ID | Proposal | Effort | Impact | Priority | v2 Change |
|----|----------|--------|--------|----------|-----------|
| P1.1 | Tiered Error Recovery | S | H | 1 | Effort M->S (prompt-only, not code) |
| P1.2 | Composite Convergence Algorithm | M | H | 1 | 4->3 signals, CUSUM dropped |
| P1.3 | Exhausted Approaches Enhancement | S | M-H | 1 | +positive selection criteria |
| P1.4 | State Recovery Fallback | S | M | 1 | Confirmed by pi-autoresearch code |
| P1.5 | JSONL Fault Tolerance | S | M | 1 | NEW (from pi-autoresearch `reconstructState()`) |
| P2.1 | Enriched Stuck Recovery Heuristics | S | M | 2 | -- |
| P2.2 | Ideas Backlog File | S | M | 2 | +auto-resume integration |
| P2.3 | Iteration Reflection Section | S | M | 1 | Priority 2->1 (community-validated via karpathy PR #282) |
| P2.4 | Segment-Based State Partitioning | S | M | 2 | -- |
| P2.5 | Scored Branching with Pruning | L | H | 2 | +breakthrough detection |
| P2.6 | Sentinel Pause File | S | M | 2 | NEW (from autoresearch-opencode + pi-autoresearch Issue #6) |
| P3.1 | Statistical newInfoRatio Validation | M | M | 3 | -- |
| P3.2 | Compact State Summary Injection | S | M | 2 | Effort M->S, Priority 3->2 |
| P3.3 | Git Commit Per Iteration | S | L | 3 | +targeted git add (not -A) |
| P4.1 | File Mutability Declarations | S | L | 4 | -- |
| P4.2 | Progress Visualization | S | L | 3 | Effort M->S, Priority 4->3 |
| P4.3 | True Context Isolation (`claude -p`) | L | M | 4 | Claude-only backend confirmed |
| P4.4 | Research Simplicity Criterion | S | L | 4 | -- |

**Totals**: 18 proposals. P1: 6 items. P2: 5 items. P3: 3 items. P4: 4 items.

### Easiest to Validate (Small effort, clear external evidence)

These have direct code evidence from analyzed repos and can be validated quickly:

1. **P1.5 JSONL Fault Tolerance** -- pi-autoresearch already implements silent skip + defaults. Copy pattern.
2. **P1.3 Exhausted Approaches Enhancement** -- AGR Tier 5 blocking pattern documented. Protocol-only change.
3. **P1.4 State Recovery Fallback** -- pi-autoresearch session-history fallback exists in code. Pattern clear.
4. **P2.2 Ideas Backlog File** -- autoresearch-opencode `autoresearch.ideas.md` is working model. Protocol-only.
5. **P2.6 Sentinel Pause File** -- autoresearch-opencode `fs.existsSync('.autoresearch-off')` is a one-liner.
6. **P2.3 Iteration Reflection Section** -- Template addition. Community-validated via karpathy PR #282.

### Needs Most Investigation (Medium/Large effort, uncertain evidence)

1. **P1.2 Composite Convergence Algorithm** -- 3-signal weighted voting. No external repo implements multi-signal convergence. Needs design validation, threshold tuning, graceful degradation testing.
2. **P2.5 Scored Branching with Pruning** -- Large, novel (no repo has this). Depends on P2.4 segment partitioning. Needs prototype testing with real research sessions.
3. **P4.3 True Context Isolation** -- Large effort, requires rethinking dispatch from Task tool to `claude -p`. Only viable for autonomous mode.
4. **P3.1 Statistical newInfoRatio Validation** -- MAD-based noise floor is mathematically well-defined but untested against real research loop data.

---

## Convergence Telemetry

### Session Structure

- **Total iterations**: 14 (runs 1-7 in Segment 1, runs 8-14 in Segment 2)
- **Two rounds**: Round 1 (architectural analysis, Q1-Q10), Round 2 (code-level + community deep dives, Q11-Q17)
- **Convergence type**: Natural convergence at end of Round 1 (run 7 hit 0.10 newInfoRatio); then deliberate restart for Round 2 via segment_start event
- **Execution modes**: Wave-parallel in Round 1, direct execution in Round 2 (after 529 API overload blocked sub-agents)

### newInfoRatio Trajectory

| Run | Segment | Focus | newInfoRatio | Pattern |
|-----|---------|-------|-------------|---------|
| 1 | 1 | AGR architecture deep dive | 0.55 | Low -- Phase 0 pre-covered AGR |
| 2 | 1 | pi-autoresearch convergence + state | 0.85 | High -- fresh repo |
| 3 | 1 | autoresearch-opencode architecture | 0.85 | High -- fresh repo |
| 4 | 1 | Convergence algorithms (external lit) | 0.80 | High -- novel external sources |
| 5 | 1 | Cross-cutting synthesis | 0.45 | Drop -- synthesis, not discovery |
| 6 | 1 | State mgmt consolidation + karpathy | 0.60 | Moderate -- karpathy original was new |
| 7 | 1 | Final synthesis + roadmap | 0.10 | Convergence -- natural stopping |
| 8 | 2 | pi-autoresearch code walkthrough | 0.80 | High -- code-level new info |
| 9 | 2 | AGR run_agr.sh code analysis | 0.75 | High -- code-level revealed simplicity |
| 10 | 2 | autoresearch-opencode code analysis | 0.70 | Moderate-high -- simpler than expected |
| 11 | 2 | Community pain points (322+ issues) | 0.75 | High -- new community data |
| 12 | 2 | Real execution data analysis | 0.65 | Moderate -- quantitative validation |
| 13 | 2 | Karpathy fork ecosystem | 0.55 | Declining -- ecosystem is thin |
| 14 | 2 | Final synthesis + proposal refinement | 0.40 | Convergence -- diminishing returns |

### Trajectory Analysis

- **Round 1**: Classic discovery-then-convergence arc. Discovery iterations (runs 1-4) averaged 0.76. Synthesis iterations (runs 5-7) dropped to 0.38. Run 7 at 0.10 = natural convergence.
- **Round 2**: Code-level analysis reignited high ratios (0.70-0.80) because it was a genuinely different investigation angle. Declined smoothly from 0.80 to 0.40 across 7 iterations. No spikes or anomalies.
- **Highest**: Runs 2 and 3 (0.85 each) -- fresh repo analyses with no prior coverage.
- **Lowest**: Run 7 (0.10) -- final Round 1 synthesis, all questions answered.
- **Key insight**: newInfoRatio is well-calibrated. Discovery consistently high, synthesis consistently lower, convergence clearly signaled. The agent's self-assessment appears reliable.

### Duration Data

- Round 1 iterations: 120-300 seconds each
- Round 2 iterations: 300-600 seconds each (longer due to direct execution without sub-agents)

---

## Strategy Insights

### What Worked

1. **WebFetch for GitHub raw content** -- 9/10 reliability across all iterations
2. **Pre-fetched reconnaissance** in Phase 0 gave agents a head start
3. **Parallel wave execution** with pre-assigned iteration numbers -- no file conflicts
4. **Strategy.md "Next Focus" guidance** effectively directed agents between waves
5. **Wave pattern: breadth -> depth -> synthesis** produced well-structured knowledge
6. **External literature survey** (iteration 004) brought in convergence algorithms from Optuna, NIST, pi-autoresearch PR
7. **GitHub Issues API exploration** discovered the MAD confidence PR in pi-autoresearch
8. **Direct execution fallback** when sub-agents failed (Round 2) -- the system adapted

### What Failed

1. **Tool call budget** (8-12) was too low -- all 6 agents exceeded it (used 16-34 calls). Realistic minimum: 15-25.
2. **JSONL ordering** -- parallel execution produced out-of-order records (runs 2,3,1 instead of 1,2,3)
3. **Phase 0 over-coverage** of AGR reduced Agent A's discovery ratio (0.55 vs 0.85 for fresh repos)
4. **529 API overload** blocked all 6 sub-agent launches in Round 2 (2 retry attempts failed)
5. **Empty GitHub API responses** for repos with no issues (AGR, autoresearch-opencode have few/no issues)

### What Was Exhausted

- README-level analysis of all 4 repos
- Convergence detection search (confirmed: none exists in any fork)
- Parallel execution search (confirmed: none implemented in any repo)
- Source code deep dives of all 3 fork repos
- Community issues/PRs analysis for all 4 repos (322+ issues)
- Real execution data (JSONL schemas, worklog patterns, results.tsv format)
- Karpathy fork ecosystem (top forks are hardware portability only, 1 generalizes)

### Remaining Questions (from strategy.md)

Strategy.md marks "DONE" -- all 17 questions (Q1-Q17) answered. However, these areas were noted as partially explored or surface-level:

1. **Long-running session behavior** -- How does convergence algorithm perform across 20+ iterations? Only tested with 7 and 14.
2. **Multi-segment interaction** -- Segment 2 was manually triggered. Automated segment triggers are undefined.
3. **Breakthrough detection** -- Iteration 012 found convergence is non-linear (incremental -> breakthrough -> plateau). Post-breakthrough refinements typically fail. The system has no breakthrough detector.
4. **darwin-derby patterns** -- The only "research on anything" fork (12 stars) was noted but not deeply analyzed.

---

## Research Gaps

### Not Covered by Spec 023

1. **Implementation validation** -- All 18 proposals are theoretical. None has been implemented and tested against real research sessions.
2. **Threshold tuning** -- Composite convergence (P1.2) proposes a 0.60 consensus threshold and signal weights (0.30/0.35/0.35) but these are untested guesses.
3. **Inter-proposal dependencies** -- P2.5 (branching) depends on P2.4 (segments), but other dependency chains are not mapped.
4. **Negative interactions** -- Could tiered error recovery (P1.1) conflict with convergence detection (P1.2)? E.g., recovery keeping a session alive past natural convergence.
5. **Question-coverage entropy** -- The most novel signal in P1.2, but no mathematical specification. How to compute "residual entropy" from strategy.md's question lists?
6. **Tool call budget increase** -- Identified as needed (15-25 vs 8-12) but not formalized as a proposal.
7. **JSONL ordering normalization** -- Identified as needed after parallel waves but not in the 18 proposals.
8. **Performance baseline** -- No quantitative baseline for current system performance to measure improvements against.
