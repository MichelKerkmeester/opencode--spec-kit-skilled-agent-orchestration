# Iteration 4: Gap Analysis -- Features in Reference Repos NOT Covered by Our 18 v2 Proposals

## Focus
Systematically identify improvements, patterns, and features implemented in the 3 reference repos (AGR, pi-autoresearch, autoresearch-opencode) that are NOT covered by any of our 18 v2 proposals. This builds on iterations 1-3 which documented error recovery, convergence, and proposal validation. The goal is to produce a "missing proposals" list for v3 candidates.

## Findings

### Finding 1: 8 novel features in reference repos have NO corresponding v2 proposal (NEW)

Systematic cross-reference of all documented reference repo features against the 18 v2 proposals yields these unaddressed gaps:

| # | Feature | Repo | Description | v2 Proposal Coverage |
|---|---------|------|-------------|---------------------|
| G1 | Security hardening (prototype pollution + command guard) | pi-autoresearch | Metric name deny list (`__proto__`, `constructor`, `prototype`); command guard that rejects non-autoresearch.sh commands | NONE -- no v2 proposal addresses input sanitization or command restriction |
| G2 | Variance-aware acceptance (per-benchmark sigma threshold) | AGR | Run benchmark N=5 to establish variance sigma; require >5% (~2-sigma) improvement per question to count as real; detect measurement artifacts | NONE -- our convergence algorithm treats newInfoRatio as a single scalar without per-question variance |
| G3 | Backpressure gate (pre-iteration external checks) | pi-autoresearch | Optional `autoresearch.checks.sh` runs before each iteration with independent timeout (300s); iteration blocked on failure | NONE -- our YAML has pause sentinel but no pre-iteration quality gate |
| G4 | Progress visualization (auto-generated charts) | AGR | `analysis.py` regenerates `progress.png` after each iteration with per-benchmark and total metric trends | PARTIAL -- P4.2 proposes ASCII sparkline but AGR's approach is richer (image generation + per-benchmark breakdown) |
| G5 | Worktree parallelism (multi-agent on isolated branches) | AGR | `--worktree` flag spawns multiple agents on different git branches optimizing different components, merged later | NONE -- P2.5 (Scored Branching) proposes parallel dispatch but not git-isolated parallelism |
| G6 | Dual-file activation gate (opt-in + kill-switch) | autoresearch-opencode | Plugin requires BOTH `autoresearch.md` existence AND absence of `.autoresearch-off`; two independent gates for activation vs emergency stop | PARTIAL -- P2.6 covers the pause sentinel but not the dual-gate pattern |
| G7 | Simplicity criterion (Karpathy's rule: reject marginal gains with complexity) | AGR | Marginal improvement (<2%) with significant added complexity is automatically discarded; removed complexity with equal/better results always kept | PARTIAL -- P4.4 proposes simplicity bonus for consolidation iterations but NOT this: a hard gate that REJECTS findings that add complexity without sufficient value |
| G8 | Atomic git commits per kept iteration | AGR | Kept experiments are committed with descriptive messages; discards are reverted before next iteration | RELATED -- P3.3 proposes git commits but was deliberately excluded; AGR's pattern is specifically "commit only KEEPS, revert DISCARDS" which is more targeted |

[SOURCE: https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/references/guide.md]
[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts (iteration 1 findings)]
[SOURCE: https://github.com/dabiggm0e/autoresearch-opencode/blob/master/plugins/autoresearch-context.ts]

### Finding 2: AGR's STRATEGY.md format is structurally richer than our strategy.md (PARTIALLY NEW)

AGR's STRATEGY.md has 4 sections that serve distinct cognitive functions:

| Section | Purpose | Our Equivalent | Gap |
|---------|---------|---------------|-----|
| **Analysis** | Current bottleneck breakdown (which benchmarks consume most time) | No equivalent | We have no "where are the biggest gaps" quantitative section |
| **Ideas** | Ranked list of optimizations, high-impact first | "Key Questions (remaining)" | Our questions are unranked; AGR's ideas are priority-ordered |
| **Already Tried** | Past experiments with outcomes and lessons | "What Worked" + "What Failed" | Similar but AGR includes per-benchmark quantitative impact |
| **Insights** | Cross-cutting patterns discovered | No equivalent | We discover patterns but don't have a dedicated accumulation section |

The "Analysis" and "Insights" sections are genuinely novel. Our strategy.md focuses on question tracking and approach management but lacks:
- Quantitative gap analysis (which questions have lowest coverage?)
- Accumulated cross-cutting insights (patterns that span multiple iterations)

[SOURCE: https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/references/guide.md]
[INFERENCE: based on comparison with our scratch/deep-research-strategy.md template]

### Finding 3: pi-autoresearch's rate-limited auto-resume is a novel crash recovery pattern (NEW)

From iteration 1 findings (not fully analyzed for gap implications then): pi-autoresearch implements rate-limited auto-resume with:
- Maximum N turns before requiring human interaction
- 5-minute cooldown between auto-resumes
- Backpressure checks (`autoresearch.checks.sh`) with independent 300s timeout

This addresses a failure mode our system doesn't handle: **what happens when the research loop crashes mid-iteration and needs to resume?** Our P1.4 (State Recovery Fallback) handles reading corrupted state, but not the actual resumption protocol. The rate-limiting prevents infinite crash-resume loops.

No v2 proposal covers rate-limited auto-resume. P1.4 recovers state; P2.6 pauses; neither provides automatic resumption with backoff.

[SOURCE: https://github.com/davebcn87/pi-autoresearch/blob/main/extensions/pi-autoresearch/index.ts (iteration 1 Finding 1)]

### Finding 4: The "spec-code gap" pattern from iteration 3 should become a v3 proposal category (PARTIALLY NEW)

Iteration 3 identified 5 proposals where the algorithm is fully specified in reference docs but the YAML orchestrator is not wired to use them (P1.2, P2.1, P2.2, P3.1, P4.1). This "spec-code gap" pattern is itself a meta-finding that suggests a new v3 proposal:

**Proposed: "Orchestrator Wiring" meta-proposal** -- systematically close the gap between specified algorithms and orchestrator behavior for the 5 partially-implemented proposals. This is not a new feature but a category of implementation work that should be tracked as a v3 priority.

AGR and pi-autoresearch do NOT have this problem because:
- AGR has no orchestrator code at all (everything is prompt-driven)
- pi-autoresearch has a single TypeScript file where spec and implementation are colocated

Our system's separation of reference docs (convergence.md, state_format.md) from orchestrator (YAML workflow) creates a unique maintenance challenge where specs can drift from implementation.

[INFERENCE: based on iteration 3 Finding 6 + structural analysis of all 4 systems]

### Finding 5: autoresearch-opencode's dashboard is a static markdown report, not a live system (PARTIALLY NEW)

The `autoresearch-dashboard.md` file is a manually-maintained markdown table showing:
- Sequential run numbers
- Git commit identifiers
- Runtime measurements with percentage deltas
- Keep/discard status
- Approach descriptions

This is NOT a live dashboard or TUI -- it's a narrative summary document. The real data lives in `autoresearch.jsonl` and `worklog.md`, with the dashboard serving as human-readable synthesis.

Key insight: autoresearch-opencode's "dashboard" is essentially our `research.md` equivalent -- a progressive synthesis document. The dual-source pattern (JSONL for machine state + worklog/dashboard for human narrative) is similar to our JSONL + strategy.md pattern, confirming this is a convergent design choice across repos.

The JSONL-vs-worklog cross-check mentioned in Wave 1 recon is NOT automated -- it's an instruction to the AI to verify consistency between the two sources. No code enforces this.

[SOURCE: https://github.com/dabiggm0e/autoresearch-opencode/blob/master/autoresearch-dashboard.md]
[SOURCE: https://github.com/dabiggm0e/autoresearch-opencode/blob/master/plugins/autoresearch-context.ts]

### Finding 6: Consolidated v3 candidate list from gap analysis (NEW SYNTHESIS)

Combining all gaps into prioritized v3 candidates:

**Tier A -- High Value, Novel (no existing v2 proposal covers this):**
1. **v3-G1: Security Hardening** -- Input sanitization for research data + command restriction for tool invocations. Adapted from pi-autoresearch. Prevents prompt injection via crafted research findings.
2. **v3-G2: Per-Question Variance Tracking** -- Track per-question newInfoRatio or confidence, not just aggregate. Require >2-sigma improvement to count as real progress. Adapted from AGR's variance-aware acceptance.
3. **v3-G3: Pre-Iteration Quality Gate** -- Optional external script/check that must pass before iteration dispatch. Adapted from pi-autoresearch's backpressure gate.
4. **v3-G4: Rate-Limited Auto-Resume** -- Automatic crash recovery with backoff (max N attempts, cooldown between resumes). Addresses gap between P1.4 (state recovery) and actual resumption.

**Tier B -- Medium Value, Extends Existing Proposals:**
5. **v3-G5: Strategy Enrichment (Analysis + Insights sections)** -- Add quantitative gap analysis and accumulated cross-cutting insights to strategy.md. Adapted from AGR's 4-section STRATEGY.md.
6. **v3-G6: Complexity-Aware Rejection Gate** -- Hard gate that rejects findings adding complexity without sufficient information value. Extends P4.4's simplicity bonus from a reward into a filter.
7. **v3-G7: Orchestrator Wiring (meta-proposal)** -- Systematically close spec-code gap for 5 partially-implemented proposals. Not new functionality but critical implementation work.

**Tier C -- Lower Priority, Niche:**
8. **v3-G8: Git-Isolated Parallelism** -- Worktree-based parallel research branches. Extends P2.5 with actual git isolation. Complex to implement, narrow use case.
9. **v3-G9: Dual-Gate Activation** -- Require both activation file AND absence of kill-switch. Minor enhancement to P2.6.

[INFERENCE: based on systematic gap analysis across iterations 1-4, all 3 reference repos, and 18 v2 proposals]

## Sources Consulted
- https://github.com/JoaquinMulet/Artificial-General-Research/blob/main/skills/agr/references/guide.md (AGR guide with Metric+Guard, variance-aware acceptance, STRATEGY.md format)
- https://github.com/davebcn87/pi-autoresearch (repo root, extensions directory listing)
- https://github.com/dabiggm0e/autoresearch-opencode/blob/master/plugins/autoresearch-context.ts (context injection plugin)
- https://github.com/dabiggm0e/autoresearch-opencode/blob/master/autoresearch-dashboard.md (dashboard format)
- Iteration 001 findings (pi-autoresearch security hardening, error handling patterns)
- Iteration 003 findings (18 proposal validation, spec-code gap pattern)

## Assessment
- New information ratio: 0.75
- Questions addressed: RQ4 (primary), RQ3 (extends with gap context)
- Questions answered: RQ4 is ~80% answered -- 8 novel gaps identified and 9 v3 candidates proposed. Remaining 20% would require deeper investigation of pi-autoresearch's TUI rendering code (couldn't access the full index.ts this iteration due to 404s on direct blob URLs) and autoresearch-opencode's scripts/ directory.

## Reflection
- What worked and why: The AGR references/guide.md fetch was extremely productive -- it contained the full specification of 6+ unique patterns (variance-aware acceptance, simplicity criterion, STRATEGY.md format, worktree parallelism, atomic commits, rework protocol). Using WebFetch on the guide.md blob URL yielded comprehensive structured data because AGR concentrates its specifications in this single reference file.
- What did not work and why: Direct blob URL fetches to pi-autoresearch's index.ts returned 404 again. The root-then-drill approach from strategy worked (found the directory listing) but didn't yield the actual file content this iteration. This is likely because the repo's file paths have changed or the blob URL format needs the exact commit hash.
- What I would do differently: For pi-autoresearch, I would try fetching the extensions/pi-autoresearch/ subdirectory listing first to get the exact current file name, then construct the blob URL from that. Also, the autoresearch-opencode scripts/ directory was not investigated -- it may contain shell-level data integrity checks.

## Recommended Next Focus
RQ6: GitHub issues/PRs failure modes -- check pi-autoresearch (22 issues per Wave 1 recon) and AGR for real-world failure reports that reveal failure modes not addressed by either our proposals or the new v3 candidates. Alternatively, RQ5 completion (cross-runtime divergences) since it's at ~80% and could be fully answered with targeted agent definition comparison.
