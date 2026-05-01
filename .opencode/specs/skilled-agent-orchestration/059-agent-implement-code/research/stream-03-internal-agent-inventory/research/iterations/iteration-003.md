# Iteration 3: LEAF and Task Dispatch Enforcement

## Focus

This iteration focused on Q5: how sub-agent dispatch contracts, LEAF rules, and depth/nesting restrictions are represented and enforced in the internal `.opencode/agent/*.md` ecosystem. The specific question was whether `permission.task: deny` is runtime-enforced, whether `agent_config.leaf_only` has a loader, and how much of LEAF is prose convention.

## Actions Taken

- Read iteration 1 and iteration 2 first to avoid repeating the caller-restriction and write-safety inventories.
- Inventoried every `permission.task` declaration in `.opencode/agent/*.md`.
- Read `@orchestrate` depth/nesting contract and dispatch protocol sections.
- Read representative LEAF agents: `@context`, `@deep-research`, and `@ultra-think`.
- Inspected `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` for `agent_config.leaf_only`, native dispatch, executor dispatch, and post-dispatch validation.
- Searched `.opencode/skill/system-spec-kit/`, `.opencode/skill/sk-code/`, `.opencode/skill/sk-deep-research/`, command YAML, and test surfaces for `permission.task`, `agent.permission`, `denyTask`, `leaf_only`, `leafOnly`, and LEAF enforcement terms.
- Checked the local `opencode` command presence and version; the installed binary is available as `opencode 1.3.17`, but its implementation source is not present in this repository.

## Findings

1. The prompt expectation that `.opencode/agent/orchestrate.md` "must be `task: allow`" does not match the current file. `@orchestrate` frontmatter has `permission:` entries for read/list/glob/grep/write/edit/bash/patch/webfetch, but no `task` key. Its body says it primarily orchestrates via the `task` tool, so dispatch authority is expressed in role/body instructions rather than a `permission.task: allow` frontmatter field. Evidence: `.opencode/agent/orchestrate.md:6`, `.opencode/agent/orchestrate.md:15`, `.opencode/agent/orchestrate.md:34`.

2. Current `permission.task` inventory:

| Agent | `permission.task` | Notes |
| --- | --- | --- |
| `context` | `deny` | LEAF retrieval agent. Evidence: `.opencode/agent/context.md:16`, `.opencode/agent/context.md:39`. |
| `debug` | `deny` | User-invoked debug specialist, never auto-dispatched. Evidence: `.opencode/agent/debug.md:16`, `.opencode/agent/debug.md:36`. |
| `deep-research` | `deny` | Single-iteration LEAF worker. Evidence: `.opencode/agent/deep-research.md:18`, `.opencode/agent/deep-research.md:40`. |
| `deep-review` | `deny` | Single-iteration LEAF review worker. Evidence: `.opencode/agent/deep-review.md:18`, `.opencode/agent/deep-review.md:39`. |
| `improve-agent` | `deny` | Leaf mutator; body says bounded candidate generation. Evidence: `.opencode/agent/improve-agent.md:16`, `.opencode/agent/improve-agent.md:42`. |
| `improve-prompt` | `deny` | Read-only, leaf-only prompt package builder. Evidence: `.opencode/agent/improve-prompt.md:16`, `.opencode/agent/improve-prompt.md:26`. |
| `orchestrate` | no task field | Body grants orchestration role; no frontmatter task key. Evidence: `.opencode/agent/orchestrate.md:6`, `.opencode/agent/orchestrate.md:15`, `.opencode/agent/orchestrate.md:34`. |
| `review` | `deny` | LEAF review specialist. Evidence: `.opencode/agent/review.md:16`, `.opencode/agent/review.md:37`. |
| `ultra-think` | `allow` | Only live agent with explicit `task: allow`; allowed at Depth 0, but body switches to inline `sequential_thinking` at Depth 1. Evidence: `.opencode/agent/ultra-think.md:16`, `.opencode/agent/ultra-think.md:39`, `.opencode/agent/ultra-think.md:40`. |
| `write` | `deny` | LEAF documentation specialist. Evidence: `.opencode/agent/write.md:16`, `.opencode/agent/write.md:36`. |

3. LEAF has three layers in current repo evidence. First, frontmatter denies the Task tool for most subagents (`task: deny`). Second, agent bodies say LEAF agents must not dispatch or use Task. Third, the orchestrator injects a "NESTING CONSTRAINT" into every non-orchestrator dispatch. Evidence: `.opencode/agent/deep-research.md:18`, `.opencode/agent/deep-research.md:40`, `.opencode/agent/deep-research.md:42`, `.opencode/agent/orchestrate.md:147`, `.opencode/agent/orchestrate.md:151`.

4. The concrete depth contract is in `@orchestrate` body prose, not a discovered repository-side validator. It defines single-hop delegation, maximum depth 2 with counters 0 and 1, depth-0 orchestrator dispatch authority, depth-1 no-dispatch, and forbidden depth 2+ chains. Evidence: `.opencode/agent/orchestrate.md:40`, `.opencode/agent/orchestrate.md:43`, `.opencode/agent/orchestrate.md:105`, `.opencode/agent/orchestrate.md:116`, `.opencode/agent/orchestrate.md:120`, `.opencode/agent/orchestrate.md:122`, `.opencode/agent/orchestrate.md:126`, `.opencode/agent/orchestrate.md:129`.

5. The orchestrator's dispatch contract is explicit and operationally detailed: read the target agent definition before dispatch, include it or a focused summary in the Task prompt, set `subagent_type: "general"`, include `Depth: N`, estimate tool calls, and apply context/tool-call budget ceilings. Evidence: `.opencode/agent/orchestrate.md:155`, `.opencode/agent/orchestrate.md:158`, `.opencode/agent/orchestrate.md:201`, `.opencode/agent/orchestrate.md:208`, `.opencode/agent/orchestrate.md:267`, `.opencode/agent/orchestrate.md:493`, `.opencode/agent/orchestrate.md:513`, `.opencode/agent/orchestrate.md:739`, `.opencode/agent/orchestrate.md:745`, `.opencode/agent/orchestrate.md:748`.

6. `@ultra-think` is the special case proving LEAF is depth-sensitive, not just a static label. It has `task: allow` in frontmatter and dispatches strategies at Depth 0, but when dispatched by orchestrator or another agent at Depth 1, it must use `sequential_thinking` inline without sub-dispatch. Evidence: `.opencode/agent/ultra-think.md:16`, `.opencode/agent/ultra-think.md:37`, `.opencode/agent/ultra-think.md:40`, `.opencode/agent/ultra-think.md:42`, `.opencode/agent/ultra-think.md:55`, `.opencode/agent/ultra-think.md:77`, `.opencode/agent/ultra-think.md:89`.

7. Deep-research YAML declares `agent_config.leaf_only: true`, but the executable dispatch step does not appear to read that field as a guard. The YAML's dispatch step resolves the executor from `config.executor`, renders a prompt pack, then either dispatches native `agent: deep-research` or shells out to CLI executors. `agent_config.leaf_only` appears in the static config block, while `step_dispatch_iteration.resolve_executor` points to `executor-config.ts#parseExecutorConfig`, whose schema covers executor kind/model/reasoning/service/sandbox/timeout, not `leaf_only`. Evidence: `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:86`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:523`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:527`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:536`, `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:563`, `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`.

8. The deep-research prompt pack carries the live LEAF instruction into both native and CLI executor contexts. It says the prompt is for the `@deep-research` LEAF agent or CLI executor, then states "You are a LEAF agent. Do NOT dispatch sub-agents." This is a prompt contract, not a code-level validator. Evidence: `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:3`, `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:28`.

9. The YAML-owned post-dispatch validator enforces artifact/schema completion, not LEAF behavior. It checks state-log growth, iteration markdown existence and non-empty status, canonical `"type":"iteration"`, required JSONL fields, executor provenance for non-native runs, and delta-file existence/type. It does not check sub-agent dispatch, depth, `leaf_only`, or Task-tool use. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:23`, `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:37`, `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:103`, `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:136`, `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:146`, `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:164`.

10. Focused searches found no local repository implementation of `permission.task` interpretation under `system-spec-kit`, `sk-code`, `sk-deep-research/scripts`, command YAML, or plugin paths. The only local executable-ish matches are executor/prompt-pack/post-dispatch validation code, and those do not parse agent frontmatter permissions. The installed `opencode` binary exists and reports version `1.3.17`; because its source is not present here, this iteration can only infer that the binary/runtime consumes agent permission frontmatter. It cannot cite a local source line for that enforcement path.

11. Test coverage for LEAF enforcement appears manual/documentary rather than automated. Searches in `system-spec-kit` test directories and `sk-deep-research` found manual testing playbook scenarios for LEAF-only behavior and reference-only features, but no Vitest/unit test that simulates a LEAF agent attempting Task dispatch or asserts `permission.task: deny` blocks it. Evidence: `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:3`, `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:29`, `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:55`.

## Questions Answered

- Q5 is answered for the checked-in repo state. LEAF is enforced in three different senses:
  - The ability of an agent to call the Task tool is represented by `permission.task` and likely enforced by the external OpenCode runtime/binary, but the implementation is not present in this repo.
  - The single-hop depth protocol is enforced by orchestrator body rules and mandatory dispatch prompt text, not by a discovered local runtime depth validator.
  - Deep-research command-owned iteration LEAF behavior is carried through YAML `agent_config.leaf_only`, prompt-pack constraints, and post-dispatch artifact validation; only the artifacts are code-validated.

## Questions Remaining

- Q1 remains open: skill auto-loading patterns.
- Q2 remains open: stack-agnostic detection in `sk-code`.
- A follow-up implementation decision remains: whether the new `@code` agent should claim "runtime-enforced LEAF" only for Task-tool availability, while labeling caller restriction and depth discipline as convention/prompt-governed.

## Sources Consulted

- `.opencode/agent/context.md:16`
- `.opencode/agent/context.md:39`
- `.opencode/agent/debug.md:16`
- `.opencode/agent/debug.md:36`
- `.opencode/agent/deep-research.md:18`
- `.opencode/agent/deep-research.md:40`
- `.opencode/agent/deep-research.md:42`
- `.opencode/agent/deep-review.md:18`
- `.opencode/agent/deep-review.md:39`
- `.opencode/agent/improve-agent.md:16`
- `.opencode/agent/improve-agent.md:42`
- `.opencode/agent/improve-prompt.md:16`
- `.opencode/agent/improve-prompt.md:26`
- `.opencode/agent/orchestrate.md:6`
- `.opencode/agent/orchestrate.md:15`
- `.opencode/agent/orchestrate.md:34`
- `.opencode/agent/orchestrate.md:40`
- `.opencode/agent/orchestrate.md:43`
- `.opencode/agent/orchestrate.md:105`
- `.opencode/agent/orchestrate.md:116`
- `.opencode/agent/orchestrate.md:120`
- `.opencode/agent/orchestrate.md:122`
- `.opencode/agent/orchestrate.md:126`
- `.opencode/agent/orchestrate.md:129`
- `.opencode/agent/orchestrate.md:147`
- `.opencode/agent/orchestrate.md:151`
- `.opencode/agent/orchestrate.md:155`
- `.opencode/agent/orchestrate.md:158`
- `.opencode/agent/orchestrate.md:201`
- `.opencode/agent/orchestrate.md:208`
- `.opencode/agent/orchestrate.md:267`
- `.opencode/agent/orchestrate.md:493`
- `.opencode/agent/orchestrate.md:513`
- `.opencode/agent/orchestrate.md:739`
- `.opencode/agent/orchestrate.md:745`
- `.opencode/agent/orchestrate.md:748`
- `.opencode/agent/review.md:16`
- `.opencode/agent/review.md:37`
- `.opencode/agent/ultra-think.md:16`
- `.opencode/agent/ultra-think.md:37`
- `.opencode/agent/ultra-think.md:40`
- `.opencode/agent/ultra-think.md:42`
- `.opencode/agent/ultra-think.md:55`
- `.opencode/agent/ultra-think.md:77`
- `.opencode/agent/ultra-think.md:89`
- `.opencode/agent/write.md:16`
- `.opencode/agent/write.md:36`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:81`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:86`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:523`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:527`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:536`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:563`
- `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:3`
- `.opencode/skill/sk-deep-research/assets/prompt_pack_iteration.md.tmpl:28`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:23`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:37`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:103`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:136`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:146`
- `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:164`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:3`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:29`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/06--synthesis-save-and-guardrails/019-final-synthesis-memory-save-and-guardrail-behavior.md:55`

## Reflection

What worked: Separating "Task tool availability" from "depth/caller policy" made the evidence stop contradicting itself. `task: deny` is meaningful for the callee's tools; it is not a caller allowlist and it is not a depth counter.

What did not work: Searching repository code for `permission.task` enforcement found no local implementation. That is useful negative evidence, but it cannot prove how the external OpenCode binary gates tools internally.

What I would do differently: For future runtime-enforcement claims, I would require one of two evidence types: checked-in runtime source that parses frontmatter permissions, or a minimal live behavioral test where a `task: deny` agent attempts Task dispatch and the runtime blocks it.

## Recommended Next Focus

Focus Q1 next: skill auto-loading patterns. For the eventual `@code` design, phrase D2 narrowly: `permission.task: deny` blocks the agent from using Task in runtimes that honor OpenCode permission frontmatter; caller restriction and single-hop depth remain orchestrator/prompt/workflow conventions unless a harness validator is added.

## Ruled Out

- `@orchestrate` having an explicit `permission.task: allow` frontmatter field in the current file.
- A local `agent_config.leaf_only` loader that enforces no Task dispatch.
- Post-dispatch validation as LEAF validation; it validates iteration artifacts and JSONL schema only.
- Tests that automatically assert `permission.task: deny` blocks Task-tool calls from a LEAF agent.
