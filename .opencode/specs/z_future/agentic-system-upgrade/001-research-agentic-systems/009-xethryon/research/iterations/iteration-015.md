# Iteration 015 — Live Swarm Runtime Duplicates Resumable Task Sessions

Date: 2026-04-10

## Research question
Does Xethryon's swarm runtime suggest that `system-spec-kit` should pivot from its current orchestrate-and-packet model to a mailbox-driven team runtime?

## Hypothesis
No. Xethryon's swarm layer mostly adds a second coordination substrate on top of existing resumable task sessions; it is useful as artifact inspiration, not as a replacement architecture.

## Method
I compared OpenCode/Xethryon's built-in `task` session model and coordinator prompt with the newer team/swarm layer, then compared that stack to Spec Kit's orchestrate contract.

## Evidence
- The built-in `task` tool already creates or resumes subagent sessions via `task_id`, carries forward session context when desired, and returns resumable session identifiers. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/task.ts:15-25] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/task.ts:69-104] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/task.ts:148-164]
- The coordinator prompt already defines a research/synthesis/implementation/verification workflow with explicit concurrency and continue-versus-spawn guidance. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/agent/prompt/coordinator.txt:15-23] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/agent/prompt/coordinator.txt:31-52] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/agent/prompt/coordinator.txt:97-110]
- Xethryon's swarm layer then adds `team_create`, in-process teammate spawning, mailbox notifications, and a JSON task board on top of those same session primitives. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/tool/team_create.ts:25-87] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/spawn.ts:80-130] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/swarm/tasks-board.ts:36-157]
- Spec Kit's orchestrate agent intentionally enforces single-hop delegation, explicit leaf-agent boundaries, and structured task decomposition instead of a long-lived mailbox runtime. [SOURCE: .opencode/agent/orchestrate.md:36-47] [SOURCE: .opencode/agent/orchestrate.md:95-118] [SOURCE: .opencode/agent/orchestrate.md:189-212]

## Analysis
Xethryon's swarm system is not "multi-agent orchestration from scratch." It is a parallel coordination shell layered over an already capable sub-session/task mechanism. That makes it a weak candidate for an architectural pivot in Spec Kit. Spec Kit already has the cleaner separation: orchestration logic in agent contracts and durable packet artifacts on disk. Importing mailbox IPC, team state, and JSON task boards as a runtime substrate would increase moving parts without removing a real bottleneck.

## Conclusion
confidence: high

finding: Spec Kit should not pivot to a live swarm runtime. The portable lesson is narrower: packet-local coordination artifacts can be useful, but the mailbox/team/task runtime is redundant for Spec Kit's current architecture.

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** explicit top-level orchestration, leaf agents, packet-local artifacts, and no live multi-session mailbox runtime.
- **External repo's approach:** layered coordination stack where resumable task sessions coexist with a team runtime, mailbox, and JSON task board.
- **Why the external approach might be better:** it makes parallel teamwork visible inside the product and gives operators a strong "team lead" mental model.
- **Why system-spec-kit's approach might still be correct:** Spec Kit already externalizes work products into packet artifacts and avoids duplicate runtime coordination substrates.
- **Verdict:** KEEP
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** none. Reuse only artifact ideas such as packet-local boards where useful.
- **Blast radius of the change:** architectural
- **Migration path:** not recommended.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/agent/orchestrate.md`
- **Change type:** no change
- **Blast radius:** architectural
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I looked for a critical workflow that the swarm runtime enabled which the existing `task` + coordinator stack could not approximate. I did not find one; the swarm layer primarily added runtime packaging around already-available primitives.

## Follow-up questions for next iteration
- Xethryon's autonomy feature looks simpler from the operator's perspective. Is that a genuinely better UX, or just a hidden-complexity trade?
