# Iteration 1: Caller-Restriction Enforcement Inventory

## Focus

This iteration focused on Q3, the D3 blocker: whether the internal `.opencode/agent/*.md` ecosystem has any machine-readable caller-restriction field, harness-level dispatch validator, or only prose conventions governing which agents may call or dispatch other agents.

## Actions Taken

- Inventoried every live OpenCode agent definition under `.opencode/agent/*.md` and extracted its YAML frontmatter keys.
- Read root `AGENTS.md` agent routing and Distributed Governance Rule sections for dispatch ownership language.
- Read `.opencode/agent/orchestrate.md` routing, nesting, dispatch, and agent-loading sections.
- Grepped the agent, command, skill, and `system-spec-kit` harness areas for caller-restriction and dispatch-validator terms.
- Checked special command-owned agents: `@deep-research`, `@deep-review`, `@improve-agent`, and `@improve-prompt`.

## Findings

- Frontmatter inventory shows no explicit caller-restriction key on any live agent. The keys present are `name`, `description`, `mode`, `temperature`, `permission`, and sometimes `mcpServers`; no agent has `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, or equivalent. Evidence: `.opencode/agent/context.md:2`, `.opencode/agent/context.md:4`, `.opencode/agent/context.md:6`, `.opencode/agent/context.md:20`; `.opencode/agent/orchestrate.md:2`, `.opencode/agent/orchestrate.md:4`, `.opencode/agent/orchestrate.md:6`; `.opencode/agent/ultra-think.md:2`, `.opencode/agent/ultra-think.md:4`, `.opencode/agent/ultra-think.md:20`.

| Agent | Frontmatter keys | Caller-restriction signal |
| --- | --- | --- |
| `context` | `name`, `description`, `mode`, `temperature`, `permission`, `mcpServers` | None; `mode: subagent` and `permission.task: deny` only constrain the agent's own tools. |
| `debug` | `name`, `description`, `mode`, `temperature`, `permission` | None; description says user-invoked and never auto-dispatched, but that is prose. |
| `deep-research` | `name`, `description`, `mode`, `temperature`, `permission` | None; body says command-owned single iteration. |
| `deep-review` | `name`, `description`, `mode`, `temperature`, `permission` | None; body says command-owned single iteration. |
| `improve-agent` | `name`, `description`, `mode`, `temperature`, `permission` | None; body says proposal-only and journal emission is orchestrator-only. |
| `improve-prompt` | `name`, `description`, `mode`, `temperature`, `permission` | None; body says leaf-only and read-only. |
| `orchestrate` | `name`, `description`, `mode`, `temperature`, `permission` | None; `mode: primary` is role classification, not a caller allowlist. |
| `review` | `name`, `description`, `mode`, `temperature`, `permission` | None; `permission.task: deny` makes it non-dispatching. |
| `ultra-think` | `name`, `description`, `mode`, `temperature`, `permission`, `mcpServers` | Partial convention only; `mode: all` plus `permission.task: allow` permits direct depth-0 dispatch behavior, while body detects Depth 1. |
| `write` | `name`, `description`, `mode`, `temperature`, `permission` | None; write-capable but leaf via `permission.task: deny`. |

- The root routing table assigns dispatch ownership in prose: `@deep-research` is dispatched by `/spec_kit:deep-research`, `@deep-review` by `/spec_kit:deep-review`, `@improve-agent` by `/improve:agent`, and `@improve-prompt` by `/improve:prompt`. Evidence: `AGENTS.md:334`, `AGENTS.md:335`, `AGENTS.md:337`, `AGENTS.md:338`.

- Root `AGENTS.md` also has a hard workflow rule that direct Task-tool use of `@deep-research` or `@deep-review` for iteration loops is forbidden; only the command-owned YAML workflow may dispatch them. This is an instruction-level gate, not an observed frontmatter-level validator. Evidence: `AGENTS.md:223`.

- The Distributed Governance Rule is explicit that it is "a workflow-required gate, not a runtime hook"; therefore existing authored-doc and exclusive-write governance is not a harness enforcement mechanism for caller identity. Evidence: `AGENTS.md:342`.

- `.opencode/agent/orchestrate.md` lists routes in prose and tables, not in machine-readable frontmatter. It says only the depth-0 orchestrator may dispatch LEAF agents and depth-1 agents must not dispatch; its routing table maps task types to `@context`, `@deep-research`, `@ultra-think`, `@review`, `@write`, `@general`, and `@debug`. Evidence: `.opencode/agent/orchestrate.md:42`, `.opencode/agent/orchestrate.md:95`, `.opencode/agent/orchestrate.md:101`.

- The orchestrator imposes prompt-level NDP enforcement: every non-orchestrator dispatch must include a "NESTING CONSTRAINT" telling the child it is a LEAF agent and must not use Task. That is convention plus prompt injection, not caller-restriction metadata on the callee. Evidence: `.opencode/agent/orchestrate.md:149`, `.opencode/agent/orchestrate.md:151`.

- Grep found no harness-level matcher for likely caller-restriction keys (`dispatchableBy`, `callableFrom`, `restricted_callers`, `allowed_callers`, `callerRestriction`, `isOrchestrator`, etc.) under the searched harness and agent surfaces. The only related harness "caller" hits are MCP caller/session-context security concepts, not agent dispatch allowlists. Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:62`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:930`; absence confirmed by focused grep returning no matches for the restriction terms.

- `cli-opencode` documentation contains the clearest command-only dispatch contract: generic subagents go through a primary orchestrator, while `deep-research`, `deep-review`, `improve-agent`, and `improve-prompt` are dispatched only by parent commands and never through `orchestrate`. This is documentation-level governance and should not be mistaken for runtime enforcement. Evidence: `.opencode/skill/cli-opencode/SKILL.md:296`, `.opencode/skill/cli-opencode/SKILL.md:298`, `.opencode/skill/cli-opencode/SKILL.md:300`.

- Special command-owned agents do not encode caller restrictions in frontmatter. `@deep-research` and `@deep-review` have `permission.task: deny` and body-level leaf rules; `@improve-agent` has proposal-only body rules and orchestrator-only journal emission; `@improve-prompt` is read-only and leaf-only. Evidence: `.opencode/agent/deep-research.md:18`, `.opencode/agent/deep-research.md:38`, `.opencode/agent/deep-review.md:18`, `.opencode/agent/deep-review.md:38`, `.opencode/agent/improve-agent.md:155`, `.opencode/agent/improve-prompt.md:22`.

## Questions Answered

- Q3 is answered for the current repo state: caller-restriction enforcement exists as prose, workflow ownership, tool permissions, and prompt-level NDP instructions. It does not appear as a machine-readable frontmatter field or a harness dispatch validator.

## Questions Remaining

- Q1 remains open: how current agents pick up skills beyond explicit prose and advisor routing.
- Q2 remains open: how `sk-code` performs stack-agnostic detection.
- Q4 remains partly open: this iteration found write-boundary evidence for deep-loop agents and improve-agent, but a full write-capable safety inventory still needs a focused pass.
- Q5 remains partly open: nesting/depth rules are well evidenced in `orchestrate.md`, but command-owned dispatch contracts should be mapped across command YAML and reducers.

## Sources Consulted

- `.opencode/agent/context.md:2`
- `.opencode/agent/context.md:4`
- `.opencode/agent/context.md:16`
- `.opencode/agent/debug.md:3`
- `.opencode/agent/deep-research.md:18`
- `.opencode/agent/deep-research.md:38`
- `.opencode/agent/deep-review.md:18`
- `.opencode/agent/deep-review.md:38`
- `.opencode/agent/improve-agent.md:155`
- `.opencode/agent/improve-prompt.md:22`
- `.opencode/agent/orchestrate.md:42`
- `.opencode/agent/orchestrate.md:95`
- `.opencode/agent/orchestrate.md:101`
- `.opencode/agent/orchestrate.md:149`
- `.opencode/agent/orchestrate.md:151`
- `.opencode/agent/ultra-think.md:39`
- `.opencode/agent/ultra-think.md:40`
- `.opencode/agent/README.txt:4`
- `.opencode/agent/README.txt:5`
- `.opencode/skill/cli-opencode/SKILL.md:296`
- `.opencode/skill/cli-opencode/SKILL.md:298`
- `.opencode/skill/cli-opencode/SKILL.md:300`
- `.opencode/skill/sk-deep-research/SKILL.md:48`
- `.opencode/skill/sk-deep-research/SKILL.md:54`
- `.opencode/skill/sk-deep-review/SKILL.md:51`
- `AGENTS.md:223`
- `AGENTS.md:329`
- `AGENTS.md:334`
- `AGENTS.md:335`
- `AGENTS.md:337`
- `AGENTS.md:338`
- `AGENTS.md:342`

## Reflection

- What worked and why: The frontmatter inventory plus focused grep gave a high-confidence negative result: the ecosystem has role/tool metadata but no caller allowlist metadata.
- What did not work and why: Broad grep for `caller` was noisy because the memory/session harness uses caller context for MCP security, which is unrelated to agent dispatch authority.
- What I would do differently: Next time I would start with exact restriction-token grep first, then widen to prose terms like "orchestrator" and "Task tool" only after confirming the schema gap.

## Recommended Next Focus

Focus Q4 next: inventory write-capable agents (`debug`, `deep-research`, `deep-review`, `improve-agent`, `write`) for exact write boundaries, file ownership rules, and whether those guarantees are enforced by permissions, command reducers, or prose only. For `.opencode/agent/code.md`, the immediate D3 recommendation is to avoid claiming caller-restriction enforcement unless a harness validator is added. If caller restriction is required, add explicit frontmatter such as `dispatch: { allowedCallers: [...], commandOwned: true }` and implement a loader/Task-dispatch validator; otherwise design `code.md` as convention-governed with `permission.task: deny`, LEAF body rules, and orchestrator routing prose.

## Ruled Out

- Existing explicit frontmatter keys named `caller`, `dispatchableBy`, `callableFrom`, `parent`, `restricted_callers`, `allowed_callers`, or equivalent.
- Existing harness-level validator patterns named `isOrchestrator`, `restricted_callers`, or `dispatchableBy`.
- Treating `permission.task: deny` as caller restriction. It prevents the callee from dispatching onward; it does not restrict who can invoke the callee.
