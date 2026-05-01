# Iteration 003 - Q5 Sub-Agent Dispatch Contracts

## Focus

Q5: identify the actual dispatch contract for opencode-swarm-main sub-agents: payload schema, invocation mechanism, depth bounds, response shape, and concurrency controls.

## Actions Taken

1. Read `src/types/delegation.ts` and related event/state types for envelope and response schemas.
2. Read `src/hooks/delegation-gate.ts` around envelope parsing, validation, Task tool interception, and completion-state advancement.
3. Read `src/agents/architect.ts`, `src/agents/coder.ts`, and `src/agents/index.ts` for prompt-level dispatch rules and SDK permission wiring.
4. Read `src/parallel/` dispatcher, dependency graph, and review-router files for worker fan-out and bounded concurrency mechanics.
5. Checked config/schema and update-task-status call sites to distinguish active runtime paths from dark-foundation code.

## Findings

### F1 - `DelegationEnvelope` is small, and only `commandType` / `errorStrategy` are typed unions

The full envelope schema is `taskId`, `targetAgent`, `action`, `commandType`, `files`, `acceptanceCriteria`, `technicalContext`, optional `errorStrategy`, and optional `platformNotes`. `commandType` is exactly `'task' | 'slash_command'`; `errorStrategy` is exactly `'FAIL_FAST' | 'BEST_EFFORT'`; `action` is only `string`, not an enum. Citations: `src/types/delegation.ts:6`, `src/types/delegation.ts:7`, `src/types/delegation.ts:8`, `src/types/delegation.ts:9`, `src/types/delegation.ts:10`, `src/types/delegation.ts:11`, `src/types/delegation.ts:12`, `src/types/delegation.ts:13`, `src/types/delegation.ts:14`, `src/types/delegation.ts:15`.

The only sibling type in `delegation.ts` is `EnvelopeValidationResult`, a success/failure validation union, not a worker-result envelope. Citations: `src/types/delegation.ts:21`, `src/types/delegation.ts:22`, `src/types/delegation.ts:23`.

### F2 - The parser accepts JSON blocks and key-value text, then normalizes envelope field names

`parseDelegationEnvelope` first tries direct JSON, then a JSON object embedded in text, then a `KEY: value` text format. The text parser normalizes aliases such as `task_id`, `target_agent`, `command_type`, `acceptance_criteria`, `technical_context`, `error_strategy`, and `platform_notes` into camelCase fields. Citations: `src/hooks/delegation-gate.ts:104`, `src/hooks/delegation-gate.ts:111`, `src/hooks/delegation-gate.ts:123`, `src/hooks/delegation-gate.ts:137`, `src/hooks/delegation-gate.ts:138`, `src/hooks/delegation-gate.ts:140`, `src/hooks/delegation-gate.ts:142`, `src/hooks/delegation-gate.ts:144`, `src/hooks/delegation-gate.ts:146`, `src/hooks/delegation-gate.ts:148`, `src/hooks/delegation-gate.ts:150`.

For key-value fallback, required fields are `taskId`, `targetAgent`, `action`, `commandType`, `files`, and `acceptanceCriteria`; `technicalContext` defaults to `''` if missing in the normalized map despite being present in the TypeScript interface. Citations: `src/hooks/delegation-gate.ts:167`, `src/hooks/delegation-gate.ts:168`, `src/hooks/delegation-gate.ts:175`, `src/hooks/delegation-gate.ts:192`, `src/hooks/delegation-gate.ts:199`.

### F3 - Validation blocks slash commands and checks task/agent/acceptance basics, but does not enumerate `action`

`validateDelegationEnvelope` requires the six same core fields, blocks `commandType === 'slash_command'`, rejects task IDs not present in the current plan when plan tasks are known, and validates `targetAgent` after swarm-prefix stripping. Citations: `src/hooks/delegation-gate.ts:227`, `src/hooks/delegation-gate.ts:238`, `src/hooks/delegation-gate.ts:255`, `src/hooks/delegation-gate.ts:260`, `src/hooks/delegation-gate.ts:265`, `src/hooks/delegation-gate.ts:268`.

The only action-specific validation is that `implement` and `review` require a non-empty `files` array. `acceptanceCriteria` must also be a non-empty array. There is no allowlist for `action` values beyond that special-case behavior. Citations: `src/hooks/delegation-gate.ts:272`, `src/hooks/delegation-gate.ts:276`, `src/hooks/delegation-gate.ts:279`, `src/hooks/delegation-gate.ts:282`, `src/hooks/delegation-gate.ts:285`.

### F4 - Actual dispatch is the OpenCode `Task` tool with prompt text, not a queue or direct SDK worker call in this repo

The architect prompt is explicit: delegations are performed only by calling the `Task` tool, and the delegation text is passed as Task-tool content. Writing the same text into chat is declared ineffective. Citations: `src/agents/architect.ts:395`, `src/agents/architect.ts:397`.

The canonical prompt payload is text, not the TypeScript `DelegationEnvelope` object: it begins with the agent name and then `TASK`, `FILE`, `INPUT`, `OUTPUT`, and `CONSTRAINT` lines. Citations: `src/agents/architect.ts:399`, `src/agents/architect.ts:402`, `src/agents/architect.ts:403`, `src/agents/architect.ts:404`, `src/agents/architect.ts:405`, `src/agents/architect.ts:406`, `src/agents/architect.ts:407`.

Runtime hooks observe the Task surface by normalizing tool names to `Task` / `task`, reading `args.subagent_type`, and then applying gate logic. Citations: `src/hooks/delegation-gate.ts:499`, `src/hooks/delegation-gate.ts:500`, `src/hooks/delegation-gate.ts:502`, `src/hooks/delegation-gate.ts:505`, `src/hooks/delegation-gate.ts:508`, `src/hooks/delegation-gate.ts:697`, `src/hooks/delegation-gate.ts:704`, `src/hooks/delegation-gate.ts:713`.

### F5 - Depth control is permission/prompt based; there is no depth or generation field in the envelope

The SDK config makes agents named `architect` or ending in `_architect` primary and grants `permission.task = 'allow'`; all other agents become `subagent` and are not given that task permission in this block. Citations: `src/agents/index.ts:649`, `src/agents/index.ts:651`, `src/agents/index.ts:652`, `src/agents/index.ts:653`, `src/agents/index.ts:654`, `src/agents/index.ts:655`, `src/agents/index.ts:656`.

The coder prompt separately forbids delegation: the coder implements directly, must not use the Task tool, and must ignore references to other agents in its instructions. Citations: `src/agents/coder.ts:3`, `src/agents/coder.ts:4`, `src/agents/coder.ts:5`, `src/agents/coder.ts:6`.

No `depth`, `generation`, `parentTaskId`, or similar recursion counter appears in `DelegationEnvelope`; the runtime state tracks workflow and invocation fields, but not envelope-level delegation depth. Citations: `src/types/delegation.ts:6`, `src/types/delegation.ts:15`, `src/state.ts:107`, `src/state.ts:121`, `src/state.ts:123`, `src/state.ts:160`, `src/state.ts:168`.

### F6 - Ordinary worker completion is text-shaped; structured result handling exists for coder prompt output and council tooling, not a general Task result envelope

Coder completion is prompt-constrained text: completed tasks begin with `DONE`, list `CHANGED`, exports/deps fields, and include `REUSE_SCAN`; blocked tasks begin with `BLOCKED` and `NEED`. Citations: `src/agents/coder.ts:129`, `src/agents/coder.ts:130`, `src/agents/coder.ts:134`, `src/agents/coder.ts:135`, `src/agents/coder.ts:136`, `src/agents/coder.ts:137`, `src/agents/coder.ts:138`, `src/agents/coder.ts:139`, `src/agents/coder.ts:140`, `src/agents/coder.ts:141`, `src/agents/coder.ts:142`.

The architect does not receive a typed `TaskResult` envelope in the explored types. Task completion side effects are inferred by hooks from the Task tool call metadata, especially `subagent_type`, and then mapped into `taskWorkflowStates`. Citations: `src/hooks/delegation-gate.ts:697`, `src/hooks/delegation-gate.ts:700`, `src/hooks/delegation-gate.ts:704`, `src/hooks/delegation-gate.ts:713`, `src/hooks/delegation-gate.ts:719`, `src/state.ts:91`, `src/state.ts:94`, `src/state.ts:100`.

Structured response handling does exist for the separate `submit_council_verdicts` tool, whose output is parsed for `success`, `overallVerdict`, `allCriteriaMet`, `requiredFixesCount`, `roundNumber`, and `quorumSize`. That is a council synthesis tool contract, not the ordinary Task-tool worker return schema. Citations: `src/hooks/delegation-gate.ts:619`, `src/hooks/delegation-gate.ts:621`, `src/hooks/delegation-gate.ts:624`, `src/hooks/delegation-gate.ts:625`, `src/hooks/delegation-gate.ts:626`, `src/hooks/delegation-gate.ts:627`, `src/hooks/delegation-gate.ts:628`, `src/hooks/delegation-gate.ts:629`, `src/hooks/delegation-gate.ts:633`.

### F7 - Completion-state progression is hook-mediated and mostly target-agent based

When the Task hook sees reviewer/test_engineer delegations, it advances the per-task workflow state. In the default sequential path, reviewer advances `coder_delegated` / `pre_check_passed` to `reviewer_run`, and test_engineer advances `reviewer_run` to `tests_run`. Citations: `src/hooks/delegation-gate.ts:830`, `src/hooks/delegation-gate.ts:833`, `src/hooks/delegation-gate.ts:836`, `src/hooks/delegation-gate.ts:840`, `src/hooks/delegation-gate.ts:853`, `src/hooks/delegation-gate.ts:854`, `src/hooks/delegation-gate.ts:856`, `src/hooks/delegation-gate.ts:858`.

The hook also propagates reviewer/test_engineer state across sessions using a seed task ID from `currentTaskId` or `lastCoderDelegationTaskId`, which means task completion tracking is stateful and hook-driven rather than encoded in a returned worker envelope. Citations: `src/hooks/delegation-gate.ts:347`, `src/hooks/delegation-gate.ts:349`, `src/hooks/delegation-gate.ts:350`, `src/hooks/delegation-gate.ts:870`, `src/hooks/delegation-gate.ts:879`, `src/hooks/delegation-gate.ts:898`, `src/hooks/delegation-gate.ts:911`, `src/hooks/delegation-gate.ts:927`.

### F8 - Concurrency has a dark-foundation dispatcher, but no production call site was found for task fan-out

The dispatcher types define `DispatcherConfig` with `enabled`, `maxConcurrentTasks`, and `evidenceLockTimeoutMs`; dispatch decisions are `dispatch`, `defer`, or `reject`, with `RunSlot` / `TaskExecutionHandle` carrying `taskId` and `runId`. Citations: `src/parallel/dispatcher/types.ts:7`, `src/parallel/dispatcher/types.ts:9`, `src/parallel/dispatcher/types.ts:10`, `src/parallel/dispatcher/types.ts:13`, `src/parallel/dispatcher/types.ts:20`, `src/parallel/dispatcher/types.ts:25`.

`createDispatcher` returns the no-op dispatcher unless `enabled` is true and `maxConcurrentTasks > 1`; the no-op dispatcher rejects every dispatch as `parallelization_disabled`. Citations: `src/parallel/dispatcher/index.ts:27`, `src/parallel/dispatcher/index.ts:31`, `src/parallel/dispatcher/index.ts:34`, `src/parallel/dispatcher/noop-dispatcher.ts:1`, `src/parallel/dispatcher/noop-dispatcher.ts:29`, `src/parallel/dispatcher/noop-dispatcher.ts:31`, `src/parallel/dispatcher/noop-dispatcher.ts:32`.

The enabled dispatcher uses `p-limit`, checks `activeSlots.size >= maxConcurrentTasks`, returns `defer` at capacity, and uses `releaseSlot` / `shutdown` for cleanup. The source comment says no production code imports the implementation directly. Citations: `src/parallel/dispatcher/parallel-dispatcher.ts:2`, `src/parallel/dispatcher/parallel-dispatcher.ts:4`, `src/parallel/dispatcher/parallel-dispatcher.ts:8`, `src/parallel/dispatcher/parallel-dispatcher.ts:30`, `src/parallel/dispatcher/parallel-dispatcher.ts:47`, `src/parallel/dispatcher/parallel-dispatcher.ts:48`, `src/parallel/dispatcher/parallel-dispatcher.ts:84`, `src/parallel/dispatcher/parallel-dispatcher.ts:88`.

### F9 - Active parallel behavior is narrower: Stage B barriering, review-routing advice, and council prompt-level parallel calls

Stage B parallelization is checked via `config.parallelization?.stageB?.parallel?.enabled === true`; when enabled, reviewer/test_engineer completions are recorded independently and the task advances to `tests_run` only after both are present. Citations: `src/hooks/delegation-gate.ts:727`, `src/hooks/delegation-gate.ts:728`, `src/hooks/delegation-gate.ts:730`, `src/hooks/delegation-gate.ts:731`, `src/hooks/delegation-gate.ts:732`, `src/hooks/delegation-gate.ts:733`, `src/hooks/delegation-gate.ts:752`, `src/hooks/delegation-gate.ts:757`, `src/hooks/delegation-gate.ts:765`, `src/hooks/delegation-gate.ts:767`.

The config defaults keep parallelization off and `maxConcurrentTasks` at 1; schema bounds allow max 64 overall tasks, plus separate default caps for coders and reviewers. Citations: `src/config/schema.ts:1099`, `src/config/schema.ts:1103`, `src/config/schema.ts:1104`, `src/config/schema.ts:1105`, `src/config/schema.ts:1106`, `src/config/schema.ts:1109`, `src/config/schema.ts:1110`, `src/config/schema.ts:1111`, `src/config/schema.ts:1112`.

The architect prompt also contains council-specific parallel dispatch instructions: dispatch distinct council members as parallel Agent tasks in a single message, wait for all verdict objects, then call `submit_council_verdicts`. Citations: `src/agents/architect.ts:1522`, `src/agents/architect.ts:1523`, `src/agents/architect.ts:1525`, `src/agents/architect.ts:1535`, `src/agents/architect.ts:1537`, `src/agents/architect.ts:1546`, `src/agents/architect.ts:1548`.

## Implications for a new `@code` LEAF agent

The reusable pattern is not "pass a typed envelope into a worker queue." It is "give the primary orchestrator explicit Task permission, deny subagents Task permission, describe a strict text payload, and use hooks to observe/validate/advance workflow state." For `@code`, the LEAF guarantee should probably live in all three places: no Task permission in the agent config, prompt-level "do not delegate" language, and runtime hook checks if the hosting system exposes Task calls.

The envelope pattern is still useful as an audit/input contract, but it should be tightened if reused: `action` should be enumerated if downstream behavior depends on it, and response shape should be explicit if the orchestrator needs machine-readable completion rather than prompt-parsed text.

## Remaining Questions

- Q1: skill auto-loading patterns.
- Q2: stack-agnostic detection.

## Iteration Status

Status: insight.
New information ratio: 0.74.
Questions resolved this iteration: Q5.
