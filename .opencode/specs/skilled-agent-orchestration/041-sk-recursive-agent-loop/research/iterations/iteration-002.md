# Iteration 2: Internal Mapping to `.opencode/agent` and Skills

## Focus
Compare the external benchmark-driven loop to the repo's existing research, agent, and skill architecture to see what is already reusable.

## Findings
1. The closest internal analogue is `sk-deep-research`, which already uses a three-layer contract: command entrypoint, YAML loop engine, and a LEAF runtime agent. It externalizes state to disk, uses fresh context per iteration, and delegates synthesis/memory save to the workflow. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:12] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:137] [SOURCE: .opencode/agent/deep-research.md:24]
2. Our runtime agent system is instruction-oriented, not harness-oriented. The `.opencode/agent` layer defines specialist behaviors and permissions for execution-time roles, while `@deep-research` is explicitly a single-iteration LEAF agent that writes research packet artifacts under workflow control. [SOURCE: .opencode/agent/deep-research.md:22] [SOURCE: .opencode/agent/deep-research.md:48] [SOURCE: .opencode/agent/deep-research.md:159]
3. Creating a new skill is structurally straightforward in this repo. The skills library says a new skill becomes discoverable by adding a folder with a valid `SKILL.md`, and `/create:sk-skill` is already the canonical command for full-create/full-update skill workflows. [SOURCE: .opencode/skill/README.md:42] [SOURCE: .opencode/skill/README.md:68] [SOURCE: .opencode/command/create/sk-skill.md:1] [SOURCE: .opencode/command/create/sk-skill.md:120]
4. The main mismatch is objective function. `sk-deep-research` is optimized for evidence collection, convergence, and reducer-managed synthesis, whereas `autoagent-main` is optimized for benchmark score improvement and keep/discard experiment decisions. A future `sk-agent-improver` would need an explicit evaluation surface that our current agent instructions do not provide today. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:14] [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:179] [SOURCE: .opencode/specs/skilled-agent-orchestration/041-sk-agent-improver-loop/external/autoagent-main/program.md:156] [INFERENCE: internal agent prompts and skill docs define execution behavior and research-state management, but do not define a benchmark-scored keep/discard loop for `.opencode/agent` files.]

## Ruled Out
- Treating "add a skill folder" as the hard part of this idea is misleading. Skill discovery and creation are already solved; evaluation contract, mutable target definition, and success metrics are the real blockers. [SOURCE: .opencode/skill/README.md:46] [SOURCE: .opencode/command/create/sk-skill.md:201]

## Dead Ends
- Directly equating `.opencode/agent/*.md` with `autoagent-main`'s single-file harness would erase a key architectural difference: our agent layer is only one surface inside a broader command/skill/runtime ecosystem. [SOURCE: .opencode/skill/sk-deep-research/SKILL.md:16] [SOURCE: .opencode/agent/deep-research.md:28]

## Sources Consulted
- .opencode/skill/sk-deep-research/SKILL.md:12
- .opencode/agent/deep-research.md:22
- .opencode/skill/README.md:42
- .opencode/command/create/sk-skill.md:1

## Assessment
- New information ratio: 0.9
- Questions addressed: Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure? What capabilities are missing if we want a reliable `sk-agent-improver` rather than a one-off research packet?
- Questions answered: Which parts of that loop align with our existing `.opencode/agent`, `sk-deep-research`, and skill infrastructure?

## Reflection
- What worked and why: Reading the skill, runtime agent, skills library, and create command together made the "easy vs hard" split obvious: loop scaffolding and skill registration exist, but the target metric and mutation boundaries do not.
- What did not work and why: Looking for an existing "agent improvement" skill name via broad ripgrep produced a lot of unrelated historical noise, so direct architectural files were more useful than keyword sweeps.
- What I would do differently: If implementation follows, inspect the create-skill YAML and one existing skill scaffold to define the exact packet and resource layout for the new skill.

## Recommended Next Focus
Design the feasibility recommendation: define the minimum viable evaluation loop, editable boundaries, safety rules, and MVP scope for `sk-agent-improver` without pretending the current repo already has an overnight benchmark harness for agent files.
