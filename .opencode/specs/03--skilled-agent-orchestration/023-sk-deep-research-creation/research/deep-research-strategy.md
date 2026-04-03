# Deep Research Strategy

## Topic
Analyzing 3 external autoresearch implementations for improvement ideas to our deep-research system

## Round 2 Answered Questions (Q11-Q17)
- [x] Q11: 8 reusable code patterns cataloged from pi-autoresearch: event-driven loop, segment management, dual recovery, structured metric output, process group kill, runtime isolation, JSONL fault tolerance, git keep/discard. Most transferable: JSONL fault tolerance (silent skip + defaults) and segment filtering. (iterations 008 + 010)
- [x] Q12: Community pain points: session state isolation (#1 bug), shell injection in git commits, multiple research loop support, noisy metric confidence, LLM backend reliability (Codex fails at autonomous loops), zero-kept-at-scale, experiment diversity. Our spec folder architecture already solves the #1 request. (iteration 011)
- [x] Q13: Research loops are 10-50x shorter than optimization loops (7-14 vs 100-400 iterations). Real convergence is non-linear: incremental improvements → breakthrough (paradigm shift) → plateau. Post-breakthrough refinements typically fail. Keep rate: 37.5% for optimization, 86% for research. (iteration 012)
- [x] Q14: AGR's run_agr.sh is a 10-line for-loop with `claude -p "$(cat program.md)" || true`. ALL intelligence is in the prompt -- the 5-tier error handling is prompt text, not code. No shell-level error handling, no output parsing, no git operations. (iteration 009)
- [x] Q15: Error handling across repos is simpler than architecturally described. pi-autoresearch: per-function try/catch with empty catch blocks. AGR: `|| true` error suppression. autoresearch-opencode: `set -euo pipefail` for benchmark only. No repo has programmatic tiered error recovery. (iterations 008-010)
- [x] Q16: Top fork (autoresearch-macos, 1,259 stars) is hardware portability. darwin-derby (12 stars) generalizes to "research on anything" -- closest to our use case. Community independently proposed reflection (PR #282), checkpointing (PR #265), memory (PR #302), dashboard (PR #114). (iteration 013)
- [x] Q17: 16 proposals refined: 3 effort reductions (P1.1 M→S, P3.2 M→S, P4.2 M→S), 3 priority elevations (P2.3→P1, P3.2→P2, P4.2→P3), 2 new proposals (sentinel pause, JSONL fault tolerance), CUSUM permanently dropped from composite convergence. (iteration 014)

## Round 1 Answered Questions (Q1-Q10)
- [x] Q1: AGR uses "Ralph Loop" -- fresh `claude -p` process per iteration, all state externalized. Conceptually identical to our approach; differs in execution mechanics. (iteration 001)
- [x] Q2: pi-autoresearch has NO convergence detection by design ("LOOP FOREVER"). MAD-based confidence in PR #22 (advisory only). Our convergence is more sophisticated. (iteration 002)
- [x] Q3: autoresearch-opencode is pure-skill reimplementation removing MCP server. Uses plugin for context injection, ideas backlog, rich worklog, sentinel-file pause. (iteration 003)
- [x] Q4: JSONL + strategy.md is validated architecture across all 4 repos. Recommend: segment model, recovery tier fallback, exhausted approaches registry enhancement, file mutability declarations. (iterations 002 + 003 + 006)
- [x] Q5: NO repo supports parallel iterations. AGR mentions worktree but unimplemented. Our parallel waves are genuinely novel. (iteration 001)
- [x] Q6: AGR has 5-tier error handling. autoresearch-opencode has 3-tier recovery. Both more robust than our single-tier. (iterations 001 + 003)
- [x] Q7: Execution patterns: 7 transfer from optimization, 3 do not (single-metric, keep/discard, deterministic eval), 5 are unique to research (question-driven, citations, progressive synthesis, sub-question branching, multi-source triangulation). (iteration 006)
- [x] Q8: 4 concrete convergence algorithms proposed with pseudocode: (A) Improvement-vs-Error/MAD, (B) CUSUM regime detection, (C) Entropy-based question coverage, (D) Composite weighted voting. (iteration 004)
- [x] Q9: No true branching/tree search in any repo. Three approximation heuristics: try opposites, combine successes, audit low-value iterations. Novel "scored branching with pruning" proposed. (iterations 001 + 005)

## What Worked
- WebFetch for GitHub raw content and API endpoints (all iterations)
- Pre-fetched reconnaissance data reducing redundant fetches (Wave 1)
- Parallel execution with pre-assigned iteration numbers (Wave 1)
- GitHub Issues API exploration discovering MAD confidence PR (iteration 002)
- Strategy.md "Next Focus" guiding Wave 2 agents to productive gaps (Wave 2)
- Wave structure: Wave 1 = breadth, Wave 2 = depth/synthesis (meta-review)
- Agent D's external literature survey for convergence algorithms (iteration 004)
- Agent F's initiative to analyze karpathy original (iteration 006)
- Round 2: Direct execution (no sub-agents) worked after API overload blocked 6 agent launches
- GitHub API for issues/PRs + raw content for source code in single conversation
- Parallel WebFetch calls for multiple repos simultaneously

## What Failed
- Tool call budget of 8-12 exceeded by ALL 6 agents (16-34 calls). Minimum realistic: 15-25.
- JSONL entries out-of-order in Wave 1 (runs 2,3,1). Need ordering normalization.
- Phase 0 over-covered AGR, reducing Agent A's newInfoRatio (0.55)
- Round 2: All 6 sub-agent launches failed with 529 API overload errors (2 retry attempts)
- Round 2: Some GitHub API endpoints returned empty for repos with no issues (AGR, autoresearch-opencode)

## Exhausted Approaches
- Basic README-level analysis of all repos (Phase 0 + Wave 1)
- Convergence detection search in all 3 fork repos (confirmed: none exists)
- Parallel execution search in all repos (confirmed: none implemented)
- Karpathy original convergence patterns (confirmed: none exists, Issue #314 pending)
- Source code deep dives of all 3 fork repos (Round 2, iterations 008-010)
- Community issues/PRs analysis for all 4 repos (Round 2, iteration 011)
- Real execution data analysis (Round 2, iteration 012)
- Karpathy fork ecosystem analysis (Round 2, iteration 013)

## Next Focus
DONE. Both rounds complete. 14 iterations across 6 waves answered all 17 questions (Q1-Q17). 18 improvement proposals (16 original + 2 new) refined with code-level evidence and community validation. Ready for implementation.
