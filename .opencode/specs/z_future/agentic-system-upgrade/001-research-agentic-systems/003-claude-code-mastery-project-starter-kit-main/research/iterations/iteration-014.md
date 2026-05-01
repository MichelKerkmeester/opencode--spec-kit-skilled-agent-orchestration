# Iteration 014 — Gate System Versus Hook-Enforced Policy

## Research question
Is the current Gate 1/2/3 + post-execution rule stack over-engineered for what users need, and does the external repo suggest `system-spec-kit` should move more deterministic policy out of prose and into executable hook/config surfaces?

## Hypothesis
The external repo will show that executable hooks carry more day-to-day safety weight than prose rules, while the local repo's gate stack will show excellent governance coverage but too much operator-facing ceremony.

## Method
Compared the external repo's global denies and hook wiring to the local root rulebook and Claude hook configuration.

## Evidence
- The external repo puts deterministic policy directly into configuration: global `permissions.deny` blocks sensitive reads, and `.claude/settings.json` wires `PreToolUse`, `PostToolUse`, and `Stop` hooks for secrets, branch checks, ports, lint, RuleCatch, and env sync. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/settings.json:1-38] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/.claude/settings.json:1-49]
- The local root `CLAUDE.md` encodes a wide gate stack in prose: Gate 1 context surfacing, Gate 2 skill routing, Gate 3 spec-folder questioning, memory-save rules, completion verification, and violation recovery. [SOURCE: CLAUDE.md:107-175]
- The local Claude hook config is currently focused on recovery and continuity (`PreCompact`, `SessionStart`, `Stop`), not on deterministic edit-time or pre-stop enforcement. [SOURCE: .claude/settings.local.json:7-42]
- The local Claude-specific supplement is intentionally tiny and defers back to the root rulebook rather than carrying an executable enforcement model of its own. [SOURCE: .claude/CLAUDE.md:5-14]

## Analysis
`system-spec-kit` currently relies on a lot of operator-visible prose to enforce behavior that, in some cases, is deterministic enough to be machine-enforced instead. The external repo's hook system is not a complete model for local governance, but it is a good reminder that "ask the model to remember the rule" is often the weakest part of the stack. The more rules that can become config or hooks, the smaller and calmer the human-facing gate system can become.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** Governance is expressed primarily in a large repo rulebook, while Claude hooks are used for recovery/context transport.
- **External repo's approach:** Keep the prose shorter and let hooks/config perform more of the safety work directly.
- **Why the external approach might be better:** Deterministic policies become less fragile, and the operator experiences fewer repeated meta-procedural steps.
- **Why system-spec-kit's approach might still be correct:** Multi-runtime repo governance still needs a human-readable constitutional source of truth, especially for non-Claude runtimes and nuanced scope decisions.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** Keep a smaller constitutional rulebook, but migrate deterministic safety and pre-flight behaviors into executable policy layers wherever runtime support exists, starting with Claude hooks and config-driven denies.
- **Blast radius of the change:** large
- **Migration path:** Inventory which prose rules are deterministic, implement the low-risk ones as hooks or permissions first, then trim the rulebook to governance that truly requires model judgment.

## Conclusion
confidence: high

finding: The external repo suggests `system-spec-kit` is carrying too much enforceable policy in prose. A slimmer gate system backed by more executable hooks would likely improve UX without sacrificing safety.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `CLAUDE.md`, `.claude/settings.local.json`, hook packages under `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/`
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** classify which rules are deterministic, Claude-specific, or inherently human-judgment-based
- **Priority:** should-have

## Counter-evidence sought
I looked for evidence that the external repo solves multi-runtime governance, spec-folder discipline, or memory-save routing at the same depth as the local repo. It does not, so a full replacement would be wrong. [SOURCE: CLAUDE.md:15-18] [SOURCE: CLAUDE.md:147-165]

## Follow-up questions for next iteration
If deterministic policy moves into hooks, does the deep-research loop still need so many reducer-owned surfaces to preserve discipline?
How much of the current validation burden is really compensating for too much prose instead of enough executable checking?
