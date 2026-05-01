# Iteration 1 - Q3 Caller-Restriction Enforcement

## Focus

Highest-priority focus: Q3 caller-restriction enforcement. I investigated whether `oh-my-opencode-slim` has a concrete harness-level mechanism for "callable only by orchestrator", especially env/context markers, schema fields, OpenCode agent modes, hook enforcement, and dispatch payload fields.

## Actions Taken

1. Read `oh-my-opencode-slim.schema.json` for caller/dispatcher/restriction fields.
2. Read `src/agents/index.ts` and `src/agents/orchestrator.ts` to map registry classification and prompt-level delegation contracts.
3. Grepped `src/`, `docs/`, `AGENTS.md`, and schema for caller/dispatcher/restricted/mode/subagent/task/permission signals.
4. Read `src/config/constants.ts`, `src/index.ts`, `src/utils/subagent-depth.ts`, and delegate-task retry hooks for runtime delegation mechanics.
5. Read `src/hooks/filter-available-skills/index.ts` and `src/cli/skills.ts` for per-agent skill filtering.
6. Read council/councillor paths to check the internal-only caller path and nested dispatch restrictions.

## Findings

- **F-001 - Primary caller restriction is OpenCode agent `mode`, not a custom caller field.** `getAgentConfigs()` classifies `council` as `mode = "all"`, `councillor` as `mode = "subagent"` plus `hidden = true`, built-in subagents as `mode = "subagent"`, `orchestrator` as `mode = "primary"`, and custom agents as `subagent`. This is the concrete registry-level mechanism that makes ordinary specialists non-primary and keeps the internal councillor out of autocomplete. Citation: `src/agents/index.ts:428-442`.

- **F-002 - Schema does not expose caller/dispatcher/restricted fields for agents.** Agent and preset override objects allow `model`, `temperature`, `variant`, `skills`, `mcps`, `prompt`, `orchestratorPrompt`, `options`, and `displayName`, with `additionalProperties: false`. There is no user-configurable `caller`, `restricted_to`, `dispatcher`, or equivalent field in these override surfaces. Citation: `oh-my-opencode-slim.schema.json:295-376`.

- **F-003 - Plugin declares delegation rules, but they are not the observed enforcement path.** `SUBAGENT_DELEGATION_RULES` says only `orchestrator` can spawn the orchestratable agents and every other named agent maps to `[]`; comments call this "delegation validation at runtime." However, repo-wide grep found no usage of `SUBAGENT_DELEGATION_RULES` outside this constants file. The active evidence points instead to SDK `mode` plus OpenCode task-tool validation. Citation: `src/config/constants.ts:25-66`.

- **F-004 - The plugin reacts to task-tool caller violations rather than implementing the general check itself.** `delegate-task-retry` detects task output containing `is not allowed. Allowed agents:` and labels it `background_agent_not_allowed`, then appends guidance telling the agent to use an allowed agent or delegate from a parent agent that can call it. This implies the denial originates from the task/runtime layer, while this hook improves retry behavior after the denial. Citations: `src/hooks/delegate-task-retry/patterns.ts:47-51`, `src/hooks/delegate-task-retry/hook.ts:7-20`.

- **F-005 - `council_session` has a real plugin-owned caller guard.** The custom tool checks `toolContext.agent`, allows only `"council"`, and throws if another agent invokes it. This is stronger than prompt policy and is the clearest concrete caller restriction implemented directly in the plugin. Citation: `src/tools/council.ts:52-69`.

- **F-006 - `council_session` availability is also permission-gated to council only.** `applyDefaultPermissions()` grants `council_session` only when `agent.name` is in `COUNCIL_TOOL_ALLOWED_AGENTS`, which contains only `"council"`; every other agent gets `council_session: "deny"`. Citation: `src/agents/index.ts:39-40`, `src/agents/index.ts:172-181`.

- **F-007 - Internal councillors are spawned by `CouncilManager` with task disabled.** `CouncilManager` creates child sessions with `parentID`, registers depth, and prompts them with `agent: options.agent` plus `tools: { task: false }`. `runCouncillorWithRetry()` passes `agent: "councillor"`, so councillor sessions cannot dispatch further via task. Citations: `src/council/council-manager.ts:243-275`, `src/council/council-manager.ts:426-436`.

- **F-008 - Depth limiting exists, but it is not a strict depth-1 LEAF model.** `SubagentDepthTracker` allows children until `DEFAULT_MAX_SUBAGENT_DEPTH`, default `3`, then blocks registration. Council also checks parent depth before starting councillors. This prevents runaway nesting, but permits more than one subagent layer by design. Citations: `src/utils/subagent-depth.ts:4-13`, `src/utils/subagent-depth.ts:35-60`, `src/config/constants.ts:92-94`, `src/council/council-manager.ts:82-97`.

- **F-009 - Skill auto-loading is permission-filtered per current agent before model call.** The transform hook infers the current agent from the latest user message `message.info.agent`, defaults to `orchestrator`, fetches permission rules, and rewrites `<available_skills>` to only include allowed skill entries. Citations: `src/hooks/filter-available-skills/index.ts:37-45`, `src/hooks/filter-available-skills/index.ts:127-151`.

- **F-010 - Default skill policy is orchestrator-open, specialist-restricted.** `getSkillPermissionsForAgent()` sets `'*': 'allow'` only for `orchestrator`, `'*': 'deny'` for others, then grants recommended/custom/permission-only skills to specific allowed agents unless config explicitly overrides the list. Citation: `src/cli/skills.ts:116-170`.

- **F-011 - Write-capable safety is mostly prompt and permission shaping, not a central write guard.** `fixer` is write-capable but instructed to read before edits, avoid research/delegation, stay within the orchestrator's task specification, and run validation when applicable. Councillor is hard permissioned read-only with `'*': 'deny'` plus selected read tools. Citations: `src/agents/fixer.ts:3-23`, `src/agents/councillor.ts:61-80`.

- **F-012 - Session management is explicitly orchestrator-scoped but does not change manual calls.** The plugin only applies task-session management when `sessionAgentMap.get(sessionID) === "orchestrator"` and docs say it applies only to orchestrator-managed `task` delegations, not manual `@agent` calls. Citations: `src/index.ts:302-308`, `docs/session-management.md:61-69`.

## Questions Answered

- **Q3 - Caller-restriction enforcement:** Partially answered with strong evidence. Normal "orchestrator-only" specialist access is primarily OpenCode agent `mode` plus task-tool validation. The plugin does not appear to implement a general caller check with env vars/context markers. The concrete plugin-owned enforcement found is `council_session`'s `toolContext.agent` guard plus per-agent permission deny.
- **Q1 - Skill auto-loading patterns:** Opportunistically answered. Skills are filtered per current agent through the chat message transform and permission rules.
- **Q4 - Write-capable safety guarantees:** Opportunistically answered. Fixer uses prompt constraints; councillor has explicit read-only permissions. No central write-scope guard found in this pass.
- **Q5 - Sub-agent dispatch contracts:** Opportunistically answered. Task calls include required fields handled by retry guidance; councillor child sessions are spawned with `parentID`, agent/model/prompt, and `tools.task=false`; depth limit is 3, not strict depth-1.

## Questions Remaining

- **Q1:** Need a fuller pass through installer/config presets and bundled skills to confirm whether there is any file-type or stack-based skill auto-loading beyond per-agent permissions.
- **Q2:** No stack detection mechanism surfaced in this iteration. Need targeted pass for installer/runtime probes and `codemap` skill behavior.
- **Q3:** Need one follow-up to confirm whether OpenCode core `mode: "subagent"` is the sole source of task-tool allowed-agent denial, because the plugin's declared `SUBAGENT_DELEGATION_RULES` appears unused.
- **Q4:** Need inspect write-related hooks such as `apply-patch`, `post-file-tool-nudge`, and agent MCP/tool permission maps for hard write guarantees.
- **Q5:** Need inspect task-session-manager and OpenCode task parameter handling for exact payload contract and session reuse semantics.

## Next Focus

Next iteration should stay on Q3/Q5 and inspect `src/hooks/task-session-manager/`, OpenCode task call shaping, and any tests around `Agent 'x' is not allowed. Allowed agents:`. The key unknown is whether the general caller restriction is entirely delegated to OpenCode core or whether another plugin hook participates in task validation.
