# Iteration 017 — Keep Specialist Leaves Outside The Retry Kernel

Date: 2026-04-10

## Research question
Should `system-spec-kit` collapse its broader agent system into the same three-role model Get It Right uses for its retry loop?

## Hypothesis
No. The external three-role model is right for a narrow retry workflow, but it is not a good global replacement for `system-spec-kit`'s broader product surface.

## Method
I compared the external repo's published agent roster with `system-spec-kit`'s broader orchestrator inventory and the explicit deep-research role contract.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-158] Get It Right exposes only three roles because its scope is limited to one retry loop.
- [SOURCE: .opencode/agent/orchestrate.md:171-181] `system-spec-kit` supports a broader runtime inventory including retrieval, research, documentation, debugging, handover, and planning specialists.
- [SOURCE: .opencode/agent/deep-research.md:24-32] At least one internal specialist exists because it owns a different workflow family: iterative research rather than implementation retry.
- [SOURCE: .opencode/agent/orchestrate.md:177-181] Documentation and handover remain explicit specialists rather than generic loop actors.

## Analysis
This is the main place where the external repo's minimalism should not be overgeneralized. Get It Right is a focused workflow product. `system-spec-kit` is a broader operating system for planning, implementing, documenting, researching, reviewing, and preserving context across sessions. Collapsing the entire system into implementer/reviewer/refactorer would make retry-mode cleaner, but it would also blur distinctions that exist for good reasons elsewhere. The right move is local simplification around execution loops, not a global deletion of specialist leaves.

## Conclusion
confidence: medium
finding: The external three-role model should inform retry-kernel design, but it should not replace `system-spec-kit`'s broader specialist roster across research, documentation, and handover workflows.

## Adoption recommendation for system-spec-kit
- **Target file or module:** overall agent architecture
- **Change type:** rejected
- **Blast radius:** large
- **Prerequisites:** none
- **Priority:** rejected

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** different workflow families use distinct specialists with explicit ownership boundaries.
- **External repo's approach:** one retry workflow is expressed through only implementer, reviewer, and refactorer.
- **Why the external approach might be better:** it keeps a single loop easy to reason about.
- **Why system-spec-kit's approach might still be correct:** documentation, deep research, handover, and debug all have different output contracts and quality rules that do not fit a three-role loop cleanly.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** none at the global level; constrain simplification to retry-kernel design only.
- **Blast radius of the change:** large if over-applied
- **Migration path:** preserve current specialist leaves while introducing a smaller core role set only for execution-loop internals.

## Counter-evidence sought
I looked for evidence that the current specialists are redundant aliases. The docs instead describe distinct ownership and output contracts for multiple workflow families.

## Follow-up questions for next iteration
- Which specialist roles are non-negotiable outside retry-mode?
- Can loop-internal roles be simplified without changing user-facing agent names?
- Where should the boundary between global specialists and loop-local roles be documented?
