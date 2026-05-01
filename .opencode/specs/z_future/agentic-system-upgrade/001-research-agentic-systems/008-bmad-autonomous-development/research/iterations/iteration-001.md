# Iteration 001 — Coordinator Boundary Discipline

## Research question
How strict is BAD's coordinator-subagent separation in practice, and should `system-spec-kit` adopt a similarly explicit top-level non-implementation contract?

## Hypothesis
BAD is stricter than local orchestration docs about what the coordinator must not do, but that strictness is mostly documentary rather than technically enforced.

## Method
Read BAD's primary coordinator contract first, then checked its phase flow and public README wording. Compared those findings to the local orchestrator and leaf-agent contracts that already govern single-hop delegation.

## Evidence
- BAD says the coordinator must delegate every step and must never read files, run `git`/`gh`, or write to disk; only story selection, spawning, timers, pre-continuation checks, and user-facing summaries stay coordinator-owned. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:16-25]
- BAD's loop keeps Phase 1 as pure coordinator logic with no file reads or tool calls, and limits coordinator work between story steps to pre-continuation checks. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/skills/bad/SKILL.md:177-205]
- BAD's README repeats the same "lightweight coordinator" claim and ties it to fresh-context subagents. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/008-bmad-autonomous-development/external/README.md:9-21]
- Local `@orchestrate` already forbids direct implementation and codebase exploration, and it enforces single-hop delegation, but it still permits reading agent definitions and command specs rather than banning operational reads categorically. [SOURCE: .opencode/agent/orchestrate.md:36-46]
- Local `@deep-research` is explicitly LEAF-only and prohibits nested dispatch, showing that the repo already uses stronger role-specific boundaries when a workflow needs them. [SOURCE: .opencode/agent/deep-research.md:28-42]

## Analysis
BAD's coordinator contract is materially stricter than the current local orchestrator because it draws a bright line between orchestration and execution. That is useful for long autonomous runs because it prevents the coordinator from turning into an ad hoc implementation agent. However, the BAD repo snapshot shows policy text, not a hard technical barrier. The closest local analogue is the orchestrator's single-hop and no-direct-implementation rule, which is directionally similar but still broader in what the coordinator may inspect.

## Conclusion
confidence: high

finding: BAD's best idea here is not "more agents"; it is a narrower coordinator job description. `system-spec-kit` should preserve its existing single-hop model, but future long-running automation commands would benefit from an explicit coordinator-only section that bans code edits, git operations, and packet writes unless a step is explicitly delegated.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** modified existing
- **Blast radius:** medium
- **Prerequisites:** decide which command workflows get the stricter coordinator profile first
- **Priority:** should-have

## Counter-evidence sought
I looked for a concrete BAD hook or manifest rule that technically blocks coordinator reads/writes; none appeared in the snapshot beyond prose contracts.

## Follow-up questions for next iteration
How does BAD decide readiness once the coordinator receives delegated reports?
Which parts of BAD's scheduling logic are independent of its subagent boundary?
Would a stricter coordinator contract fit best in local agent docs, command YAML, or constitutional guidance?
