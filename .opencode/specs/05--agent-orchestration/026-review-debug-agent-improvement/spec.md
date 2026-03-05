# Spec: Adversarial Self-Check for Review, Debug, Ultra-Think Agents

## Problem
LLM agents are vulnerable to sycophancy bias: reviewers may find phantom issues to appear thorough or approve too readily; debuggers anchor on first hypotheses; planners converge strategies artificially. Single-pass analysis misses issues that adversarial tension would catch.

## Solution
Incorporate the Hunter/Skeptic/Referee adversarial methodology (inspired by @systematicls) as an internal multi-pass protocol into three LEAF agents: @review, @debug, and @ultra-think. This creates adversarial tension through biased scoring incentives without requiring sub-agent dispatch.

## Scope
- **@review**: Add Adversarial Self-Check Protocol (Hunter/Skeptic/Referee for P0/P1 findings)
- **@debug**: Add Adversarial Hypothesis Validation (counter-evidence search between Hypothesize and Fix phases)
- **@ultra-think**: Add Adversarial Cross-Critique (challenge strategy scores before identifying winner)

## Files Modified (15 total across 5 runtime directories)
1. `.opencode/agent/review.md` (canonical)
2. `.opencode/agent/debug.md` (canonical)
3. `.opencode/agent/ultra-think.md` (canonical)
4. `.opencode/agent/chatgpt/review.md`
5. `.opencode/agent/chatgpt/debug.md`
6. `.opencode/agent/chatgpt/ultra-think.md`
7. `.claude/agents/review.md`
8. `.claude/agents/debug.md`
9. `.claude/agents/ultra-think.md`
10. `.agents/agents/review.md`
11. `.agents/agents/debug.md`
12. `.agents/agents/ultra-think.md`
13. `.codex/agents/review.toml`
14. `.codex/agents/debug.toml`
15. `.codex/agents/ultra-think.toml`

## Out of Scope
- No changes to orchestrate, context, research, speckit, write, handover agents
- No changes to commands
- Existing scoring rubrics unchanged; adversarial protocol adds verification on top

## Level
Level 2 (100-499 LOC across 15 files, QA validation needed)
