# Iteration 025 - Keep LEAF Research And Review Loops

## Research question
Does the external repo's much smaller agent roster imply that `system-spec-kit` should collapse the LEAF deep-research and deep-review iteration architecture, or are those loops solving a genuinely different problem?

## Hypothesis
The external repo will confirm that smaller role rosters feel simpler, but the local LEAF loop pattern will still earn its cost because it is built for iterative convergence, fresh-context passes, and durable state over long runs.

## Method
Compared the local deep-research and deep-review agent contracts and skills to the external repo's narrower agent set.

## Evidence
- The local deep-research agent is explicitly designed for repeated iterations with fresh context, externalized state, convergence tracking, and synthesized findings. [SOURCE: .opencode/agent/deep-research.md:99-119] [SOURCE: .opencode/agent/deep-research.md:121-171]
- The local deep-review agent follows a similar pattern with severity-weighted findings, iterative state, and convergence behavior across review dimensions. [SOURCE: .opencode/agent/deep-review.md:95-122] [SOURCE: .opencode/agent/deep-review.md:144-180]
- The matching skills codify reducer-owned artifacts, JSONL state, iteration isolation, and synthesis rules. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137-221] [SOURCE: .opencode/skill/sk-deep-review/SKILL.md:157-260]
- The external repo's named agents are much lighter and do not appear to provide an equivalent deep-loop orchestration model. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/code-reviewer.md:1-39] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/agents/test-writer.md:1-60]

## Analysis
This is where the local complexity still looks justified. The external repo's small role surface is easier to scan, but it is not evidence that a convergence-oriented research or review system can safely shrink to the same model. `system-spec-kit` uses LEAF loops because it repeatedly operates on long-running, high-context investigations where fresh context, structured iteration state, and synthesis quality matter. That is a different operating environment than the starter kit. The better move is to simplify surrounding UX, not to throw away the loop architecture itself.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Dedicated LEAF loops with externalized state and synthesis for deep research and deep review.
- **External repo's approach:** Smaller named roles with no equivalent long-run iterative convergence protocol.
- **Why the external approach might be better:** It is easier to understand at a glance and cheaper to maintain.
- **Why system-spec-kit's approach might still be correct:** The local repo genuinely needs stronger iteration contracts for deep autonomous work.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY - concrete proposal:** None at the loop-architecture level. Improve surrounding entry and reporting UX instead.
- **Blast radius of the change:** small
- **Migration path:** N/A

## UX / System Design Analysis

- **Current system-spec-kit surface:** Deep research and review are powered by explicit iteration loops, persistent state, and synthesis artifacts.
- **External repo's equivalent surface:** The external repo offers lighter specialized roles but no comparable convergence engine.
- **Friction comparison:** The local loops are heavier, but they also solve a harder problem. In this case the extra machinery appears earned.
- **What system-spec-kit could DELETE to improve UX:** Nothing at the LEAF loop core; only surrounding documentation or routing friction should be trimmed.
- **What system-spec-kit should ADD for better UX:** Better front-door explanations and lighter progress summaries so users see why the loop exists.
- **Net recommendation:** KEEP

## Conclusion
confidence: high

finding: rejected

rejection: `system-spec-kit` should not collapse its LEAF deep-research and deep-review iteration model just because the external starter kit uses a much smaller visible agent roster.

## Adoption recommendation for system-spec-kit
- **Target file or module:** none
- **Change type:** rejected
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for an external role or command that matched the local convergence-loop behavior closely enough to justify replacement, but the starter kit does not provide that depth. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/commands/progress.md:11-60]

## Follow-up questions for next iteration
If the loop architecture stays, where is the real simplification opportunity in the skill system surrounding it?
