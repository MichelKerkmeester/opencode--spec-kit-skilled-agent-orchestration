# Iteration 015 — Refactor Agent Taxonomy Around Reusable Control Roles

Date: 2026-04-10

## Research question
Does Get It Right's small three-role loop imply that `system-spec-kit`'s current agent architecture is over-factored for execution workflows?

## Hypothesis
Partially yes. `system-spec-kit` likely needs fewer runtime role categories for execution loops, even if it still keeps specialist leaves for other workflow families.

## Method
I compared the external repo's agent split with `system-spec-kit`'s orchestrator-visible agent inventory and the role contracts for deep-research and review.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/README.md:152-158] The external repo exposes only three loop roles: implementer, reviewer, and refactorer.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:147-159] The repo explicitly frames value as separated concerns: implementation, analytical review, and surgical cleanup.
- [SOURCE: .opencode/agent/orchestrate.md:171-181] `system-spec-kit`'s orchestrator advertises a broader runtime roster: `@context-prime`, `@context`, `@deep-research`, `@ultra-think`, `@speckit`, `@review`, `@write`, `@debug`, and `@handover`.
- [SOURCE: .opencode/agent/orchestrate.md:191-211] Delegation requires a large structured task envelope that includes agent type, definition file, skills, boundaries, and outputs.
- [SOURCE: .opencode/agent/deep-research.md:24-32] At least some internal roles are workflow-specific execution leaves rather than generic capability roles.
- [SOURCE: .opencode/agent/review.md:239-243] The review agent is already integrated as a gate protocol output rather than only as prose analysis.

## Analysis
The external repo shows the advantage of a tight control-role vocabulary: the loop is easy to reason about because each role exists only to move one state transition forward. `system-spec-kit` has accumulated a broader taxonomy that mixes capability roles (`@review`, `@debug`) with workflow-specific roles (`@deep-research`, `@handover`, `@speckit`). That is appropriate for the whole product surface, but it makes execution-loop design more complex than it needs to be. A smaller reusable runtime taxonomy for loop controllers would reduce duplicated role contracts and make new workflows cheaper to author.

## Conclusion
confidence: medium
finding: `system-spec-kit` should refactor execution-loop roles toward a smaller reusable core, while keeping higher-level specialist names as user-facing wrappers or aliases.

## Adoption recommendation for system-spec-kit
- **Target file or module:** agent architecture and orchestrator routing contracts
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define the minimal reusable role set and how existing agent names map to it
- **Priority:** should-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** workflows route across many named specialists, some capability-based and some workflow-specific.
- **External repo's approach:** loop execution is expressed through three compact roles with obvious state-transition boundaries.
- **Why the external approach might be better:** a smaller runtime role set reduces prompt duplication, lowers orchestration overhead, and makes loop design easier to audit.
- **Why system-spec-kit's approach might still be correct:** the repo has workflow families beyond retry execution, including documentation, handover, and research, that benefit from specialist instructions.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** define an internal core role set such as `executor`, `critic`, `researcher`, `documenter`, and `debugger`, then map existing workflow-specific agents onto that core rather than designing each workflow from scratch.
- **Blast radius of the change:** large
- **Migration path:** start with metadata and routing aliases, not prompt rewrites; preserve current agent names while standardizing shared runtime contracts underneath them.

## Counter-evidence sought
I looked for evidence that the current agent count is mostly cosmetic. The orchestrator contract and agent docs show real workflow-specific responsibilities, not just naming differences.

## Follow-up questions for next iteration
- Which existing agents are true core capabilities versus workflow wrappers?
- Could role metadata replace some command-specific prompt duplication?
- How much of the current orchestrator task envelope exists only because the role taxonomy is broad?
