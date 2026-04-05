# Changelog: 041/009-self-test

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 009-self-test — 2026-04-04

Ran the first self-referential test of the sk-agent-improver skill: the `/improve:agent` loop targeting `agent-improver.md` itself. The test proved the 5-dimension framework works against the skill's own agent file, discovered a real bug (invalid resource reference), and confirmed the proposal-only boundary holds when the mutator reads its own definition.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/041-sk-recursive-agent-loop/009-sk-agent-improver-self-test/`

---

## New Features (1)

### Self-referential improvement test

**Problem:** The skill had been tested against handover and context-prime targets but never against its own agent file, leaving a gap in confidence about self-referential edge cases.

**Fix:** Ran `/improve:agent` in `:confirm` mode for 3 iterations targeting `.opencode/agent/agent-improver.md`. The integration scanner discovered 9 surfaces, the dynamic profiler extracted 11 rules and 7 output checks, and the loop generated 3 candidates with full ledger, dashboard, and registry artifacts.

---

## Bug Fixes (1)

### Invalid resource reference discovered

**Problem:** The agent's RELATED RESOURCES section listed `/improve:agent-improver` as the command slug, but the actual file is `.opencode/command/improve/agent.md` (slug: `/improve:agent`). This caused systemFitness to score 93 instead of 100.

**Fix:** The scorer's `resource-refs-valid` check correctly flagged the reference as invalid (3/4 valid). The subagent identified and fixed it in iteration 2, bringing all 5 dimensions to 100.

---

## Observations (4)

### Convergence speed for well-maintained agents

**Problem:** Unknown how quickly the loop converges on a recently-maintained agent file.

**Fix:** Baseline 99, iteration 2 reached 100, iteration 3 confirmed plateau. Well-maintained agents converge in 2 iterations.

### Plateau detector behavior

**Problem:** The dimension plateau stop rule requires all dimensions to have 3+ consecutive identical scores. A dimension that improves mid-run resets its counter.

**Fix:** The loop correctly exited via max-iterations (3), not plateau. System Fitness had scores [93, 100, 100] — only 2 consecutive identical values at the plateau score, confirming the plateau logic works as designed.

### Tautological rule coherence

**Problem:** When the scorer checks rule coherence against rules extracted from the same file being scored, first-iteration ruleCoherence will always be 100.

**Fix:** Documented as expected behavior. The value comes from detecting rule drift after mutations, not from the initial extraction.

### Proposal-only boundary under self-reference

**Problem:** The mutator reading its own definition could create a circular write path.

**Fix:** Confirmed the proposal-only boundary works correctly. Candidates are written to `improvement/candidates/`, never touching the canonical target, even when the target is the mutator's own definition.

---

<details>
<summary>Files Changed (0)</summary>

No code changes. This phase generated runtime artifacts:
- 3 candidates in `improvement/candidates/`
- Ledger, dashboard, and registry in `improvement/`
- Integration report and dynamic profile in `improvement/`

</details>

---

## Upgrade

No migration required.
