# Research Ideas for Spec 024

> Seeded from spec 023's 14-iteration deep-research session analysis.

---

## Seeded from Spec 023 Analysis

### 1. Composite Convergence Algorithm Design Validation

Investigate whether the 3-signal composite (rolling average 0.30, MAD 0.35, question-coverage entropy 0.35) with 0.60 consensus threshold is optimal. Spec 023 proposed these weights without empirical testing. Key questions: Does MAD need 4+ iterations to be useful, or can we bootstrap earlier? Is the 0.60 threshold too aggressive (premature stopping) or too conservative (wasted iterations)? Can we replay spec 023's own JSONL data through the proposed algorithm to see if it would have stopped at the right iteration?

**Why**: P1.2 is the highest-impact proposal but has the most uncertainty. Validating it against real data de-risks implementation.

### 2. Question-Coverage Entropy Formalization

The entropy signal in P1.2 reads from strategy.md's answered/unanswered question counts, but the mathematical specification is missing. Investigate: What entropy formula? Shannon entropy of (answered/total)? Or per-question information content? How do sub-questions factor in? What about partially-answered questions (common in spec 023's data)? Is entropy the right framing, or would a simpler "coverage ratio" work equally well?

**Why**: This is our most novel competitive advantage over all external repos. Getting the math right matters.

### 3. Self-Referential Testing -- Run the System Against Itself

Use spec 024's own deep-research session as a test case for the proposed improvements. Implement P1.5 (JSONL fault tolerance) and P1.3 (exhausted approaches enforcement) first, then run the research loop with those improvements active. Compare iteration quality, stuck episodes, and convergence timing against spec 023's baseline. This is a natural meta-test.

**Why**: The deep-research system's first execution was spec 023. Spec 024 can be the second execution with improvements, creating a direct A/B comparison.

### 4. Inter-Proposal Dependency and Conflict Mapping

Map which proposals depend on, enable, or potentially conflict with each other. Known: P2.5 depends on P2.4. Unknown: Does P1.1 (error recovery keeping sessions alive) conflict with P1.2 (convergence trying to stop)? Does P2.3 (reflection section) provide data that P3.1 (statistical validation) needs? Does P2.6 (sentinel pause) interact with P2.4 (segments)?

**Why**: Spec 023 proposed 18 items with a linear sequencing but no dependency graph. Implementation order should respect dependencies and avoid negative interactions.

### 5. Tool Call Budget Formalization

Spec 023 found all 6 agents exceeded the 8-12 tool call budget (used 16-34). The meta-review recommended 15-25 but this was not formalized as a proposal. Investigate: What is the right budget for research agents vs synthesis agents? Should discovery iterations get more calls than synthesis? Is the budget per-wave or per-agent? How does the budget interact with context window limits?

**Why**: This was a concrete operational failure in spec 023 that is missing from the 18 proposals. It affects every future research session.

### 6. Breakthrough Detection Mechanism

Iteration 012 discovered that research convergence is non-linear: incremental improvements, then a breakthrough (paradigm shift), then plateau. Post-breakthrough refinements typically fail. Investigate: Can the system detect a breakthrough in real time? Would a sudden spike in newInfoRatio after a plateau indicate a breakthrough? Should the system change strategy after detecting one (e.g., switch from exploration to consolidation)?

**Why**: This finding fundamentally challenges the smooth-convergence assumption in P1.2. If convergence is non-linear, the algorithm needs to handle regime changes.

### 7. JSONL Ordering Normalization After Parallel Waves

Spec 023's JSONL has out-of-order entries (runs 2,3,1 instead of 1,2,3) from parallel Wave 1 execution. This is not in the 18 proposals. Investigate: Should JSONL be sorted by run number after each wave? Or should consumers handle unordered data? Does the convergence algorithm need ordered data? What is the simplest fix -- post-wave sort, or "don't care about order"?

**Why**: This is a real bug from spec 023 that will recur in every parallel wave execution.

---

## Community/External Leads

### From karpathy/autoresearch Issues (300+ issues)

1. **Issue #57 (28 comments)**: "Codex doesn't seem to work" -- LLM backend reliability matters. Relevant to P4.3 (context isolation) and our multi-model architecture.
2. **Issue #307**: 400+ experiments with 0 kept -- model too small for task. Relevant to research scope: can our system detect when a question is unanswerable?
3. **Issue #80**: Agents converge on incremental parameter sweeps, ignoring creative approaches. Relevant to P2.1 (stuck recovery) and P2.5 (branching).
4. **PR #282**: Community independently proposed reflection (maps to our P2.3).
5. **PR #265**: Community independently proposed checkpointing (maps to our P3.3).
6. **PR #302**: Community independently proposed memory/persistence (maps to our Spec Kit Memory integration).
7. **Issue #314**: Making program.md mutable -- our strategy.md already does this. We are ahead.

### From pi-autoresearch Issues (22 issues)

8. **Issue #7 / #8**: Session state leaks across projects -- our spec folder isolation already solves this.
9. **Issue #12**: Multiple research loops via subdirectories -- maps to our P2.4 (segments).
10. **Issue #6**: "Dedicated stop button" (3 comments) -- maps to our P2.6 (sentinel pause).
11. **PR #22**: MAD-based confidence scoring -- maps to our P1.2 composite convergence.

### darwin-derby (12 stars)

12. The only karpathy fork that generalizes beyond ML to "research on anything." Spec 023 noted it but did not deeply analyze. Could contain patterns relevant to our research-domain use case.

---

## Meta-Research Leads

### Testing the Deep-Research System Against Itself

1. **Convergence replay**: Feed spec 023's JSONL through the proposed P1.2 composite algorithm. At which iteration would it have triggered convergence? Compare to actual stopping points (run 7 in Segment 1, run 14 in Segment 2).

2. **newInfoRatio calibration audit**: Spec 023 showed the agent's self-assessed ratio correlates with discovery vs synthesis iterations. But is it actually calibrated? Cross-reference reported ratios with the number of new findings in each iteration. Is 0.85 really 85% new information?

3. **Exhausted approaches enforcement test**: Spec 023's strategy.md lists exhausted approaches. Check if any later iterations inadvertently re-explored exhausted territory. If yes, that validates P1.3.

4. **Stuck recovery replay**: Were there consecutive low-ratio iterations in spec 023 that would have triggered P2.1 heuristics? Runs 5 (0.45) and 6 (0.60) are the only adjacent "lower" runs. Would "try opposites" have produced a better run 6?

5. **Round 2 segment transition analysis**: The manual segment_start event between runs 7 and 8 reignited high ratios (0.10 -> 0.80). Can the system automatically detect when a new segment would be productive? Is there a pattern: "convergence reached + user provides new angle = segment restart"?

6. **Agent dispatch failure resilience**: Round 2's 529 API overload forced direct execution. The system adapted (strategy: "direct mode"). Can we formalize this as a protocol step rather than an ad-hoc pivot?
