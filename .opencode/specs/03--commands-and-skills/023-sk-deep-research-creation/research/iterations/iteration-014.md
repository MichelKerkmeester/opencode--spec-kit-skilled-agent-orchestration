# Iteration 014: Final Synthesis -- Proposal Refinement Based on Code-Level and Community Findings

## Focus
Cross-reference iterations 001-013 to refine the 16 improvement proposals with code-level implementation details, adjusted effort estimates, and community-validated priorities

## Key Findings

### Finding 1: P1.1 (Tiered Error Recovery) -- Effort Reduced from M to S
[SOURCE: Iterations 008, 009, 010]

Code-level analysis reveals that all 3 repos handle errors more simply than the architectural descriptions suggested:
- **AGR**: 5-tier error handling exists ONLY as prompt instructions, not code. The shell loop uses `|| true` to suppress all errors.
- **pi-autoresearch**: Error handling is per-function try/catch with empty catch blocks for fault tolerance. No tiered escalation.
- **autoresearch-opencode**: `set -euo pipefail` in benchmark script, but no research-loop-level error recovery.

**Refinement**: Our tiered recovery only needs to be in the agent protocol (prompt/convergence.md), not in code. The orchestrator already continues on agent failure (Task tool handles this). Reduce effort from Medium to Small -- it's a protocol documentation change, not a code change.

### Finding 2: P1.2 (Composite Convergence) -- CUSUM Signal Should Be Dropped
[SOURCE: Iteration 012]

Real execution data shows research loops are 10-50x shorter than optimization loops (7-14 iterations vs 100-400). CUSUM requires sufficient data points for regime detection -- impractical with N=7-14.

**Refinement**: Drop CUSUM (originally in P4 track) permanently. The composite algorithm should use only 3 signals:
1. Rolling average of newInfoRatio (existing, weight 0.30)
2. MAD-based noise detection (weight 0.35) -- validated by pi-autoresearch PR #22 and community demand
3. Question-coverage entropy (weight 0.35) -- unique to our system

Reduce from 4 signals to 3. Increase weight on question-coverage (our unique advantage).

### Finding 3: P1.3 (Exhausted Approaches) -- Add Positive Selection from AGR
[SOURCE: Iteration 009, Finding 4]

AGR's decision logic includes positive criteria (per-benchmark >5% improvement with no >5% regression = KEEP). Our P1.3 only blocks negative patterns.

**Refinement**: Add a "Proven Approaches" section alongside "Exhausted Approaches" in strategy.md. When an approach category yields high newInfoRatio (>0.70), mark it as "PRODUCTIVE" and prioritize follow-up in that category. This is the research equivalent of AGR's Pareto improvement check.

### Finding 4: P1.4 (State Recovery) -- Already Implemented in pi-autoresearch
[SOURCE: Iteration 008, Finding 3-4]

pi-autoresearch implements exactly what we proposed: JSONL primary → session history fallback. Their code:
- Read JSONL line-by-line with silent skip of malformed lines
- Default values for missing fields (`?? ""`, `?? 0`, `?? "keep"`)
- Fallback to session branch iteration if JSONL fails

**Refinement**: Copy the fault-tolerance pattern (silent skip + defaults) directly. Our iteration files contain `## Assessment` sections with all needed state data. Recovery function: scan `research/iterations/iteration-*.md`, parse Assessment sections, reconstruct JSONL. Effort confirmed as Small.

### Finding 5: P2.2 (Ideas Backlog) -- Validated by Karpathy Community
[SOURCE: Iteration 013, Finding 8]

karpathy PR #193 adds `next_proposal.json` for human intervention between iterations. pi-autoresearch's auto-resume checks `autoresearch.ideas.md`. Both confirm the ideas backlog pattern.

**Refinement**: Our `research/research-ideas.md` should be checked at TWO points: (1) during strategy initialization (already proposed), (2) during stuck recovery (already proposed), AND (3) in the auto-resume message (new -- if ideas exist, mention them to the next agent).

### Finding 6: P2.3 (Iteration Reflection) -- Independently Validated
[SOURCE: Iteration 013, Finding 5]

karpathy PR #282 proposes the exact same "reflection/musings" step we proposed. Community independently arrived at the same improvement.

**Refinement**: No change needed. Community validation increases confidence that this is high-value. Consider elevating from P2 to P1.

### Finding 7: P2.5 (Scored Branching) -- Informed by Real Convergence Patterns
[SOURCE: Iteration 012, Finding 1]

Real convergence is non-linear: incremental → breakthrough → plateau. Post-breakthrough, refinement attempts FAIL. This means branching should:
- Score branches after Wave 1
- Prune low-scoring branches (existing proposal)
- NEW: After a breakthrough iteration (newInfoRatio spike), DON'T prune that branch's refinements -- instead, explore ADJACENT branches (new questions suggested by the breakthrough)

**Refinement**: Add "breakthrough detection" to the scoring: if any branch's newInfoRatio is >2x the wave average, flag it as a breakthrough and shift follow-up iterations to explore questions RAISED by the breakthrough, not refinements of it.

### Finding 8: P3.2 (Compact State Summary) -- Simpler Than Expected
[SOURCE: Iteration 010, Finding 1]

autoresearch-opencode's "rich context injection" is actually just a static string. There's no dynamic state assembly. This means we'd be the FIRST implementation with actual dynamic state summaries.

**Refinement**: Start simple -- generate a 200-token summary from JSONL (iterations completed, questions answered, current focus, recent newInfoRatios). No need for complex NLP summarization -- structured template is sufficient.

### Finding 9: P4.3 (True Context Isolation) -- Validated but Backend-Dependent
[SOURCE: Iteration 011, Finding 5]

karpathy Issue #57 (28 comments) confirms that `claude -p` with fresh context per iteration is the reliable pattern. Codex and other LLMs fail at sustained autonomous loops.

**Refinement**: If implemented, `claude -p` dispatch MUST use Claude (not Codex/Gemini). The `--max-turns 50` flag from AGR is the right safety limit. Add `--effort high` for deep reasoning.

### Finding 10: NEW Proposal -- Sentinel File for Pause/Resume
[SOURCE: Iteration 010 Finding 7, Iteration 011 Finding 11]

autoresearch-opencode implements `.autoresearch-off` sentinel. pi-autoresearch Issue #6 (3 comments) requests this feature. Simple file existence check enables clean pause/resume.

**New proposal**: Add `research/.deep-research-pause` sentinel check to the orchestrator dispatch. If file exists, pause the loop with a message. Delete file to resume. Trivial to implement (1 line: `fs.existsSync()`), high user-control value.

### Finding 11: NEW Proposal -- JSONL Fault Tolerance
[SOURCE: Iteration 008, Finding 3]

pi-autoresearch silently skips malformed JSONL lines and uses default values for missing fields. Our JSONL parser should do the same instead of failing on corruption.

**New proposal**: Wrap each JSONL line parse in try/catch with silent skip. Add default values for all fields. Log a warning count at the end (e.g., "3 of 15 JSONL lines were malformed and skipped").

### Finding 12: Proposal Priority Adjustments Based on Code-Level Evidence

| Proposal | Original Priority | New Priority | Reason |
|----------|------------------|-------------|--------|
| P1.1 Tiered Error Recovery | P1 (M effort) | P1 (S effort) | Prompt-only, not code |
| P1.2 Composite Convergence | P1 (M effort) | P1 (M effort) | Drop CUSUM, 3 signals |
| P1.3 Exhausted Approaches | P1 (S effort) | P1 (S effort) | Add positive selection |
| P1.4 State Recovery | P1 (S effort) | P1 (S effort) | Confirmed by pi-autoresearch code |
| P2.3 Iteration Reflection | P2 (S effort) | P1 (S effort) | Community-validated by karpathy |
| P2.5 Scored Branching | P2 (L effort) | P2 (L effort) | Add breakthrough detection |
| P3.2 Compact State Summary | P3 (M effort) | P2 (S effort) | Simpler than expected |
| P4.2 Progress Visualization | P4 (M effort) | P3 (S effort) | Template exists from AGR analysis.py |
| NEW: Sentinel Pause | — | P2 (S effort) | Community-validated |
| NEW: JSONL Fault Tolerance | — | P1 (S effort) | Code pattern from pi-autoresearch |

## Proposal Refinement Summary

### Effort Adjustments
- P1.1: M → S (prompt-only change)
- P3.2: M → S (template approach, not NLP)
- P4.2: M → S (format exists, just implement)

### Priority Elevations
- P2.3 → P1 (community validation)
- P3.2 → P2 (simpler than thought)
- P4.2 → P3 (template available)

### New Proposals
- Sentinel Pause File (P2, S effort)
- JSONL Fault Tolerance (P1, S effort)

### Dropped/Modified
- CUSUM signal: permanently dropped from P1.2 composite
- Composite convergence: 4 signals → 3 signals

## Assessment
- Questions addressed: Q17
- Questions answered: Q17 (fully -- all 16 proposals refined, 2 new proposals added, effort/priority adjusted)
- newInfoRatio: 0.40
- Key insight: Code-level analysis revealed that most architectural descriptions overstate implementation complexity. AGR's "5-tier error handling" is prompt text. autoresearch-opencode's "rich context injection" is a static string. This reduces effort estimates for several proposals and increases confidence in feasibility.

## Recommended Next Focus
Implementation. Round 2 research is converged -- further iterations would yield diminishing returns.
