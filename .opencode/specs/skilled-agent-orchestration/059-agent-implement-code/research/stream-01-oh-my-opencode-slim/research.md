# Stream-01 Research Synthesis — oh-my-opencode-slim Patterns for `@code` LEAF

## 1. Title
Stream-01: Reusable patterns from oh-my-opencode-slim for the new `@code` LEAF agent

## 2. Summary
Across four cli-codex iterations the loop converged with all five priority questions resolved (stop reason: `all_questions_answered`; coverage 1.0; ratios `[0.95, 0.86, 0.78, 0.63]`). Headline: oh-my-opencode-slim does not implement a single bespoke "callable only by orchestrator" guard. It composes caller-restriction from four cooperating mechanisms: (1) OpenCode SDK `mode` classification on the agent registry, (2) deny-by-default permission maps generated per agent, (3) plugin-owned runtime guards inside specific tools (`council_session` checks `toolContext.agent`), and (4) a delegate-task-retry hook that reacts to OpenCode core's "Agent X is not allowed" error with corrective guidance. There is no env-var, schema field, or frontmatter property that says "orchestrator-only" — the closest analog (`SUBAGENT_DELEGATION_RULES`) is declared but never read.

The plugin is also strictly stack-agnostic: the only `package.json` reads in the CLI are for resolving the plugin's own install location, never project markers like `go.mod` or `Cargo.toml`. The reusable agentic pattern for unfamiliar repositories is the `codemap` skill — it asks the agent to infer include/exclude globs and persists a hash-based folder map. Skill auto-loading is install-time recommendation (presets) plus runtime visibility filtering via `filter-available-skills` and `getSkillPermissionsForAgent`. Write safety is centered on the `apply-patch` hook (root/worktree path guard, conservative verification, EOL preservation), per-agent MCP allowlists, and a prompt nudge hook. Sub-agent dispatch has two paths: OpenCode's `task` tool with payload `{description, prompt, subagent_type, task_id?}` and direct `client.session.create` for council->councillor. SubagentDepthTracker default max is 3, NOT depth-1 LEAF.

## 3. Topic
Identify reusable patterns from oh-my-opencode-slim that inform the design of a new `@code` LEAF agent for our `.opencode/agent/` inventory, focusing on (1) skill auto-loading, (2) stack-agnostic detection, (3) caller-restriction enforcement (highest priority), (4) write-capable safety, (5) sub-agent dispatch contracts.

External source folder: `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` (all citations relative to that folder unless prefixed with `.opencode/...`).

## 4. Key Questions

### Resolved (5/5)
- **Q1 — Skill auto-loading patterns** (resolved iter-3). Slim does install-time recommendation via presets and runtime visibility filtering via the `filter-available-skills` chat-message transform. There is no semantic auto-load triggered by stack, file type, or prompt keyword. The `<load_skills>` argument is a task-call contract surfaced through retry guidance, not a plugin-side loader.
- **Q2 — Stack-agnostic detection** (resolved iter-2). Plugin does not detect a stack. CLI `package.json` reads are about plugin install location only. The reusable agent-side pattern is the `codemap` skill: glob/hash/diff plumbing that asks the agent to inspect repo structure and infer include/exclude globs.
- **Q3 — Caller-restriction enforcement** (resolved iter-1, highest priority). Layered, no single bespoke mechanism. Composed of: OpenCode `mode` classification on the registry; deny-by-default permission maps; plugin-owned runtime guards inside specific tools (`council_session.toolContext.agent === 'council'`); and a retry-hook reaction to the runtime denial string `Agent X is not allowed. Allowed agents:`.
- **Q4 — Write-capable safety guarantees** (resolved iter-2, tests confirmed iter-4). `apply-patch` hook with `guardPatchTargets()` (refuses paths outside root/worktree), conservative verification (missing update/delete fails; add/move refuses existing targets), EOL preservation; per-agent MCP allowlist via `agent-mcps.ts`; prompt nudges via `post-file-tool-nudge`; prompt-led safety contract for `fixer`. Default `bash`/`edit`/`write` permissions inherit from OpenCode/user defaults.
- **Q5 — Sub-agent dispatch contracts** (resolved iter-3, tests confirmed iter-4). Two paths: (1) OpenCode `task` tool, payload `{description, prompt, subagent_type, task_id?}`, validated only when `sessionAgentMap.get(sessionID) === 'orchestrator'`; (2) direct `client.session.create` + `client.session.prompt` for council->councillor with `parentID`, `agent`, `model`, `prompt`, and `tools.task = false`. Depth limit is `DEFAULT_MAX_SUBAGENT_DEPTH = 3` (NOT strict depth-1).

### Open
None. All five questions resolved.

## 5. Key Findings (with file:line citations)

### Q3 caller-restriction (highest priority — most evidence)
- **F-Q3-01.** `getAgentConfigs()` classifies agents by mode: orchestrator=`primary`, council=`all`, councillor=`subagent` + `hidden: true`, built-in specialists=`subagent`, custom agents=`subagent`. This is the registry-level mechanism that prevents specialist agents from being primary callers and hides the internal councillor from autocomplete.
  Citation: `src/agents/index.ts:428-442`.
- **F-Q3-02.** Schema explicitly forbids caller/dispatcher/restricted-to fields. Agent override schema lists `model`, `temperature`, `variant`, `skills`, `mcps`, `prompt`, `orchestratorPrompt`, `options`, `displayName` and is `additionalProperties: false`.
  Citation: `oh-my-opencode-slim.schema.json:295-376`.
- **F-Q3-03.** `applyDefaultPermissions()` grants `council_session` only when `agent.name` is in `COUNCIL_TOOL_ALLOWED_AGENTS = ['council']`; every other agent receives `council_session: 'deny'`.
  Citation: `src/agents/index.ts:39-40, src/agents/index.ts:172-181`.
- **F-Q3-04.** Plugin-owned runtime caller guard inside the tool itself. The `council_session` tool reads `toolContext.agent` and throws if the caller is not `council`. This is the only concrete, plugin-implemented runtime caller check found.
  Citation: `src/tools/council.ts:52-69`.
- **F-Q3-05.** `delegate-task-retry` does NOT enforce caller restriction — it reacts to OpenCode core's `"Agent 'x' is not allowed. Allowed agents: [...]"` error with corrective guidance. The denial originates in OpenCode core, not in this plugin.
  Citation: `src/hooks/delegate-task-retry/patterns.ts:47-51`, `src/hooks/delegate-task-retry/hook.ts:7-20`.
- **F-Q3-06.** `SUBAGENT_DELEGATION_RULES` is a declared-but-unused constant. The intent is "orchestrator can spawn ORCHESTRATABLE_AGENTS, others spawn nothing", but repo-wide search found no caller. Runtime classification via `mode` does the actual work.
  Citation: `src/config/constants.ts:25-66`.

### Q1 skill auto-loading
- **F-Q1-01.** `filter-available-skills` runs as `experimental.chat.messages.transform`. It infers the current agent from `message.info.agent` (defaulting to `orchestrator`), fetches per-agent permission rules, and rewrites the `<available_skills>` block to only include allowed entries before the model call.
  Citation: `src/hooks/filter-available-skills/index.ts:37-45, 127-151`.
- **F-Q1-02.** `getSkillPermissionsForAgent()` policy: `'*': 'allow'` for orchestrator, `'*': 'deny'` for everyone else; recommended/custom/permission-only skills granted to specific `allowedAgents` lists.
  Citation: `src/cli/skills.ts:116-170`.
- **F-Q1-03.** Bundled skill availability is per-agent permission, not stack auto-load. `simplify` is allowed only for `oracle`; `codemap` only for `orchestrator`. No file-type, language, or content-keyword trigger.
  Citation: `src/cli/custom-skills.ts:30-40`.
- **F-Q1-04.** `simplify` skill itself is behavior/readability triggered (working code, review feedback, nesting, naming, duplication) and tells the agent to follow project conventions by reading `AGENTS.md` — not stack-detection.
  Citation: `src/skills/simplify/SKILL.md:12-18, 41-48`.

### Q2 stack-agnostic detection
- **F-Q2-01.** CLI's `package.json` reads (`config-io.ts:42, 56, 82, 91`) are about locating the `oh-my-opencode-slim` install path and plugin entries — never about probing the host project for stack markers.
  Citation: `src/cli/config-io.ts:42, 56, 82, 91`.
- **F-Q2-02.** Runtime config detection checks installed plugin/provider/preset state, not workspace markers like `go.mod` or `Cargo.toml`.
  Citation: `src/cli/config-io.ts:354, 371, 377, 386, 396`.
- **F-Q2-03.** Preset generation (`generateLiteConfig()`) maps agents to model presets and per-agent skills/MCPs without probing project stack.
  Citation: `src/cli/providers.ts:9, 48, 63, 82, 101`.
- **F-Q2-04.** `codemap` skill is the documented stack-agnostic agentic pattern: tells the agent to "analyze repository structure" and "infer core include/exclude globs" before persisting a hash-based folder map.
  Citation: `src/skills/codemap/SKILL.md:2, 10, 32, 33, 35, 39`.
- **F-Q2-05.** `codemap` implementation is generic glob-and-hash plumbing: walks files recursively, applies caller-supplied include/exclude/gitignore matchers, detects added/removed/modified files via hash comparison.
  Citation: `src/skills/codemap/scripts/codemap.mjs:70-100, 246-350`.

### Q4 write-capable safety
- **F-Q4-01.** `apply-patch` hook ONLY intercepts `apply_patch` tool calls (exits early for everything else). Resolves root/worktree from OpenCode context, then calls `rewritePatch()` before native execution.
  Citation: `src/hooks/apply-patch/index.ts:45, 50, 54, 55, 60-67`.
- **F-Q4-02.** `guardPatchTargets()` is the path guard: resolves real paths, allows targets inside root or worktree, throws `apply_patch blocked` for outside-workspace paths.
  Citation: `src/hooks/apply-patch/execution-context.ts:131, 136, 140, 147, 151`.
- **F-Q4-03.** Patch verification is conservative: missing update/delete targets become verification errors; add/move refuses existing targets. Rewrite failures are normalized and rethrown with `failOpen: false` except an explicit outside-workspace preflight pass-through.
  Citation: `src/hooks/apply-patch/execution-context.ts:303-360`, `src/hooks/apply-patch/index.ts:87-122`.
- **F-Q4-04.** EOL/final-newline preservation: `resolution.ts` tracks original EOL state and applies hits with the original metadata. Files keep their LF/CRLF/final-newline shape.
  Citation: `src/hooks/apply-patch/resolution.ts:28, 31, 37, 391-398`.
- **F-Q4-05.** `post-file-tool-nudge` is prompt-level only. It watches `Read`/`Write` (and lowercase variants), appends an `<internal_reminder>` to string outputs, can be scoped by `shouldInject(sessionID)`. It does NOT enforce permissions.
  Citation: `src/hooks/post-file-tool-nudge/index.ts:20, 24, 38-42, 56`.
- **F-Q4-06.** Per-agent MCP allowlist with wildcard/exclusion semantics. Defaults: orchestrator gets all MCPs except `context7`; librarian gets selected docs/search MCPs; most write/review agents get none. Runtime config expands wildcards and writes `<mcp>_*` permission rules per agent.
  Citation: `src/config/agent-mcps.ts:10-41`, `src/index.ts:656, 674, 681-691`.
- **F-Q4-07.** `fixer` write-capability safety is prompt-led: read before edit, no research, no delegation, run validation when applicable. No central write-scope guard. Reinforced by `agent-mcps.ts:16` (no default MCPs for fixer).
  Citation: `src/agents/fixer.ts:3-23, 32`.

### Q5 sub-agent dispatch contracts
- **F-Q5-01.** `task-session-manager` expects OpenCode task args shaped as `{description, prompt, subagent_type, task_id?}`. Before the call it only manages orchestrator sessions (`shouldManageSession` checks `sessionAgentMap.get(sessionID) === 'orchestrator'`), validates `subagent_type`, derives a label, stores by `callID`.
  Citation: `src/hooks/task-session-manager/index.ts:12-16, 220-241`.
- **F-Q5-02.** `task_id` is a resumable-session selector, not a parent/child security primitive. Unrecognized → strip `args.task_id` and let OpenCode create fresh; recognized → rewrite to concrete task ID and mark used.
  Citation: `src/hooks/task-session-manager/index.ts:250, 261-273`.
- **F-Q5-03.** `parentID` semantics are event-derived. After task execution, the hook parses the new task ID from output and remembers it with `parentSessionId`, `agentType`, label. `session.created` events with `info.parentID` register child depth or pending managed tasks.
  Citation: `src/hooks/task-session-manager/index.ts:298-329, 383-390`, `src/index.ts:725-729`.
- **F-Q5-04.** Council child sessions do NOT use the task tool. `CouncilManager` uses `client.session.create` directly with `parentID`, then `client.session.prompt` with `agent: options.agent` and `tools: { task: false }`. `runCouncillorWithRetry()` passes `agent: 'councillor'`.
  Citation: `src/council/council-manager.ts:243-275, 426-436`.
- **F-Q5-05.** `SubagentDepthTracker` allows children until `DEFAULT_MAX_SUBAGENT_DEPTH = 3`, then blocks. NOT a strict depth-1 LEAF model. Council also checks parent depth before starting councillors.
  Citation: `src/utils/subagent-depth.ts:4-13, 35-60`, `src/config/constants.ts:92-94`, `src/council/council-manager.ts:82-97`.
- **F-Q5-06.** `delegate-task-retry` documents the canonical task call shape via guidance: `task(description, prompt, category, run_in_background, load_skills)`. It also recognizes "missing run_in_background", "missing load_skills", "category/subagent_type mutual exclusion", "unknown agent/category/skills", "background-agent allowed-list" errors.
  Citation: `src/hooks/delegate-task-retry/patterns.ts:7-47`, `src/hooks/delegate-task-retry/guidance.ts:35-37`.

### Cross-cutting
- **F-X-01.** Plugin startup composes enforcement through `src/index.ts`: registers `agent`, `tool`, `mcp`, `config`, `event`, `tool.execute.before`, `command.execute.before`, `chat.headers`, `chat.message`, `experimental.chat.system.transform`, `experimental.chat.messages.transform`, `tool.execute.after`. Hook ordering matters: message-transform first rewrites display-name mentions, then image attachments, todo continuation, task session reminders, phase reminders, available-skill filtering.
  Citation: `src/index.ts:373-388, 932-967`.
- **F-X-02.** Orchestrator prompt explicitly documents delegation = child-session-blocking, parallel = independent branches; LEAF prompts should NOT have these affordances.
  Citation: `src/agents/orchestrator.ts:176, 251`.
- **F-X-03.** Tests pin the dispatch invariants: councillor child sessions are direct `client.session.create` with `agent: 'councillor'`, variant pass-through, raw-prompt compat, and child-session abort cleanup.
  Citation: `src/agents/council.test.ts` and `src/agents/councillor.test.ts` (read iter-4).
- **F-X-04.** `docs/council.md` confirms the mental model: agent layer, tool layer, session layer, skill layer; council reserved for high-stakes/ambiguous decisions; avoid recursive council chains.
  Citation: `docs/council.md:21, 54, 129, 310, 338, 435`.

## 6. Ruled-Out Directions
- **R-01.** Schema-level caller restrictions. The agent override schema is `additionalProperties: false`; no `caller`, `restricted_to`, or `dispatcher` field exists.
  Evidence: `oh-my-opencode-slim.schema.json:295-376`.
- **R-02.** Workspace marker file stack detection. CLI reads `package.json` only to locate the plugin's own install path; no `go.mod`, `Cargo.toml`, `tsconfig.json`, etc. probes anywhere.
  Evidence: `src/cli/config-io.ts:42-396`.
- **R-03.** `SUBAGENT_DELEGATION_RULES` as the runtime enforcement source. Constant is declared and exported but has no caller in the repo; runtime enforcement is `mode` + permission + caller guard instead.
  Evidence: `src/config/constants.ts:25-66`.
- **R-04.** Env-var caller markers. No environment variable mechanism for caller restriction surfaced. Evidence centered on SDK mode, permission maps, `toolContext.agent` for council_session, and task-tool errors.
  Evidence: `src/agents/index.ts:428-442` (negative result).

## 7. Negative Knowledge (what we now know is NOT there)
- No "callable only by orchestrator" frontmatter property in agent files.
- No env-var like `OPENCODE_ALLOWED_AGENTS` controlling caller.
- No schema field for restricted agents.
- No central write-scope guard for `edit`/`write` tools (only `apply_patch` is hardened).
- No semantic skill auto-loader (stack/file-type/keyword-triggered).
- No strict depth-1 enforcement; `DEFAULT_MAX_SUBAGENT_DEPTH = 3`.
- `SUBAGENT_DELEGATION_RULES` constant is dead code today (declared, never read).

## 8. Recommendations

### 8a. Diff-level guidance for `decision-record.md` D3 (caller-restriction)

D3 in our `decision-record.md` should record the caller-restriction enforcement decision for the new `@code` LEAF agent. oh-my-opencode-slim's pattern translates as follows:

**Decision (proposed wording for D3):** caller restriction for `@code` SHOULD be enforced through three layered mechanisms, with NO reliance on env-vars, schema fields, or frontmatter properties (none of which are runtime-enforced in the OpenCode plugin substrate today):

1. **Registry / mode classification (PRIMARY).** Register `@code` with `mode: 'subagent'` plus `hidden: false` (the `@code` agent should be discoverable by `@orchestrate` for delegation). This makes it non-primary at the SDK level and aligns with how oh-my-opencode-slim handles built-in specialists (`src/agents/index.ts:428-442`). An `@code` LEAF should NOT be `mode: 'primary'`; only the orchestrator-style agent owns that.
2. **Permission map deny-by-default for restricted tools (REINFORCING).** Whatever tools we want to restrict to a specific caller (e.g. an internal `code_dispatch` MCP, if we invent one) MUST be `deny`-by-default for non-`@code` agents, modeled on `applyDefaultPermissions()` for `council_session` (`src/agents/index.ts:39-40, 172-181`). This lives in the permission generator, not in agent frontmatter.
3. **Tool-internal `toolContext.agent` runtime guard (DEFENSE-IN-DEPTH).** If `@code` exposes any plugin-owned tool that should only be invoked by a specific caller, the tool MUST check `toolContext.agent` and throw on unauthorized callers, modeled on `src/tools/council.ts:52-69`. This is the strongest in-plugin caller check available.

**Anti-patterns (DO NOT do):**
- DO NOT add a `restricted_to: orchestrator` frontmatter line. The schema rejects unknown properties (`oh-my-opencode-slim.schema.json:295-376`) and there is no runtime reader for it.
- DO NOT rely on `SUBAGENT_DELEGATION_RULES`-style declarations alone. They are documentation, not enforcement (`src/config/constants.ts:25-66` is dead-code in slim).
- DO NOT assume depth-1 LEAF enforcement is automatic. Slim allows depth=3 by default. If `@code` MUST be strict LEAF, the design needs to either (a) wire `tools: { task: false }` at dispatch time (modeled on `CouncilManager` at `src/council/council-manager.ts:243-275`), or (b) document the policy and rely on the prompt + `delegate-task-retry`-style reaction layer.

**Recommended diff-shape for D3:**
```
+ ### D3 — Caller restriction for @code
+
+ Decision: layered enforcement via (1) `mode: 'subagent'` registry classification,
+ (2) deny-by-default permission map for any restricted tools, (3) optional
+ tool-internal `toolContext.agent` runtime guard for plugin-owned tools.
+
+ Anti-pattern: do not invent frontmatter fields — schema rejects them and the
+ runtime does not read them.
+
+ Strict-LEAF (depth-1) requires explicit `tools: { task: false }` at dispatch
+ time, not registry metadata; default depth limit is 3 (slim baseline).
+
+ Citations: src/agents/index.ts:428-442, src/agents/index.ts:172-181,
+ src/tools/council.ts:52-69, src/council/council-manager.ts:243-275,
+ src/config/constants.ts:92-94 (depth default).
```

Cross-stream note: stream-02 (opencode-swarm-main) and stream-03 (internal agent inventory) may surface complementary or contradicting evidence. The parent-level synthesis (`059-agent-implement-code/research/research.md` if produced, or `decision-record.md` D3 directly) should reconcile.

### 8b. Draft `.opencode/agent/code.md` skeleton

This skeleton uses the OpenCode agent file shape we already use elsewhere in our repo and incorporates oh-my-opencode-slim patterns. **The skeleton is a starting point for stream-level synthesis, NOT a final design** — cross-stream agreement is required.

```markdown
---
description: |
  Stack-agnostic LEAF agent for application code work.
  Receives a scoped, pre-planned task from the orchestrator and writes
  bounded code changes inside the workspace. Does NOT plan, research,
  delegate to other agents, or modify files outside the orchestrator's
  declared scope.
mode: subagent
model: opus
tools:
  read: true
  grep: true
  glob: true
  edit: true
  write: true
  bash: true
  task: false  # strict LEAF: cannot dispatch sub-agents (modeled on
               # CouncilManager's tools.task=false at src/council/council-manager.ts:243-275)
permissions:
  # Deny-by-default for any plugin-owned tools restricted to orchestrator.
  # This pattern mirrors applyDefaultPermissions() for council_session
  # (src/agents/index.ts:39-40, 172-181).
  council_session: deny
mcp:
  # Per-agent MCP allowlist, modeled on src/config/agent-mcps.ts:10-41.
  # @code gets only the MCPs it needs for code work; orchestrator-only
  # MCPs (e.g. spec_kit_memory continuity writes) are left off.
  spec_kit_memory: allow
  cocoindex_code: allow
---

# @code — LEAF Code Implementation Agent

## Purpose

Execute a scoped, pre-planned code-change task delivered by `@orchestrate`. You are a LEAF agent: you do not plan, research, or delegate. You read the existing code, make bounded edits, and report back.

## Hard Rules (the four-laws shape from AGENTS.md)

1. **READ FIRST.** Never edit a file without reading it. Cite line numbers in your report.
2. **SCOPE LOCK.** Only modify files explicitly named in the orchestrator's task payload (`prompt` / `description` fields per the task contract: src/hooks/task-session-manager/index.ts:12-16). NO adjacent "cleanup".
3. **VERIFY.** Run the project's stack-appropriate verification (lint/typecheck/test) before claiming completion. Cite the command and exit code in your report.
4. **HALT.** If line numbers shift, syntax checks fail, or scope is unclear, stop and report — do NOT improvise.

## Stack-Agnostic Approach

This agent does NOT detect a stack from marker files. Instead, on each task:

1. Use the `codemap` pattern (modeled on src/skills/codemap/SKILL.md:32-39): inspect repo structure first, infer relevant include/exclude globs from the orchestrator's task payload, then read.
2. Follow project conventions by reading `AGENTS.md` and neighboring code (modeled on src/skills/simplify/SKILL.md:41-48).
3. Stack-specific overlays are loaded via skill permissions if/when present (e.g. `sk-code` umbrella skill detects stack and loads stack-specific resources).

## Write Safety

When the harness exposes `apply_patch`, prefer it over `edit` / `write` — it is the only file-write tool with the root/worktree path guard, conservative verification, and EOL preservation (modeled on src/hooks/apply-patch/index.ts and src/hooks/apply-patch/execution-context.ts:131-360).

When `apply_patch` is unavailable, follow the prompt-led contract:
- READ before EDIT (always).
- Match the file's existing EOL convention (LF / CRLF) and final-newline state.
- Run `grep`/`glob` to confirm the unique anchor BEFORE editing.

## Caller Contract

You are dispatched by `@orchestrate` via the OpenCode task tool. Expected payload (modeled on src/hooks/task-session-manager/index.ts:12-16):

```
{
  "description": "<short label>",
  "prompt": "<scoped task instructions, including the file:line ranges in scope>",
  "subagent_type": "code"
}
```

You receive a fresh session per dispatch (no `task_id` reuse for `@code`). You do not have access to `task` (your `tools.task = false`), so you cannot fan out to other agents. If you need help that requires another agent, return control to the orchestrator with a clear "needs-X" note.

## Output Contract

Your final message MUST contain:

1. A list of files modified (absolute paths).
2. The verification command(s) run and their exit codes.
3. Any deferred items the orchestrator should track separately ("scope creep flagged: X").
4. Confidence score (≥80% / 40-79% / <40%) per the AGENTS.md framework.

## Anti-Patterns (DO NOT)

- Do NOT use the `task` tool — it is denied by frontmatter, but if a future runtime exposes it, refuse anyway.
- Do NOT modify files outside the orchestrator's declared scope, even to "fix nearby bugs".
- Do NOT skip verification before claiming completion.
- Do NOT invent caller-restriction frontmatter (e.g. `restricted_to: orchestrator`). Caller restriction is enforced at the registry/permission/tool layer, not in agent metadata.
```

### 8c. Specific patterns to import vs. avoid

**IMPORT (high-value):**
- `apply-patch` hook architecture (path guard + verification + EOL preservation). Strongest write-safety pattern in slim.
- Per-agent MCP allowlist (`agent-mcps.ts` shape).
- `tools: { task: false }` at dispatch time for strict LEAF (NOT only via frontmatter).
- `toolContext.agent` runtime guard for plugin-owned tools.
- `delegate-task-retry`-style guidance hooks for retry-on-denial UX (defense-in-depth, not enforcement).
- `codemap` skill as the stack-agnostic agentic pattern.
- `filter-available-skills` chat-message transform for runtime skill visibility.

**AVOID / DO NOT COPY:**
- `SUBAGENT_DELEGATION_RULES`-style declarations (dead code in slim).
- Schema-level caller fields (none exist in slim's schema).
- Frontmatter caller-restriction properties (no runtime reader).
- Strict depth-1 assumed by default (slim default is 3; explicit `tools.task=false` is required for hard LEAF).
- Stack-marker file probes (slim doesn't do this; codemap is the alternative).

## 9. References

All paths relative to `.opencode/specs/z_future/improved-agent-orchestration/external/oh-my-opencode-slim/` unless noted.

### Code (most cited)
- `src/agents/index.ts` (registry, permissions, mode classification) — F-Q3-01, F-Q3-03.
- `src/tools/council.ts` (toolContext.agent guard) — F-Q3-04.
- `src/hooks/apply-patch/index.ts`, `src/hooks/apply-patch/execution-context.ts`, `src/hooks/apply-patch/resolution.ts` — F-Q4-01..04.
- `src/hooks/filter-available-skills/index.ts` — F-Q1-01.
- `src/hooks/delegate-task-retry/patterns.ts`, `.../hook.ts`, `.../guidance.ts` — F-Q3-05, F-Q5-06.
- `src/hooks/task-session-manager/index.ts` — F-Q5-01..03.
- `src/hooks/post-file-tool-nudge/index.ts` — F-Q4-05.
- `src/council/council-manager.ts` — F-Q5-04.
- `src/utils/subagent-depth.ts` — F-Q5-05.
- `src/cli/skills.ts`, `src/cli/custom-skills.ts`, `src/cli/providers.ts`, `src/cli/config-io.ts` — F-Q1-02..03, F-Q2-01..03.
- `src/skills/codemap/SKILL.md`, `src/skills/codemap/scripts/codemap.mjs` — F-Q2-04, F-Q2-05.
- `src/skills/simplify/SKILL.md` — F-Q1-04.
- `src/agents/fixer.ts` — F-Q4-07.
- `src/agents/orchestrator.ts` — F-X-02.
- `src/config/constants.ts` — F-Q3-06.
- `src/config/agent-mcps.ts` — F-Q4-06.
- `src/index.ts` — F-X-01.
- `oh-my-opencode-slim.schema.json` — F-Q3-02.

### Tests
- `src/agents/council.test.ts`, `src/agents/councillor.test.ts` — F-X-03 (dispatch invariants).
- `src/agents/index.test.ts` — registry classification invariants.

### Docs
- `AGENTS.md` — repo workflow policy.
- `docs/council.md` — F-X-04.
- `docs/skills.md` — skill assignment policy.
- `docs/quick-reference.md` — runtime overview.

## 10. Iteration Log

| Iter | Status  | Focus                                                  | newInfoRatio | Notes                                                                  |
|------|---------|--------------------------------------------------------|--------------|------------------------------------------------------------------------|
| 1    | insight | Q3 caller-restriction (highest priority)               | 0.95         | Discovered layered mechanism; SUBAGENT_DELEGATION_RULES dead code      |
| 2    | insight | Q2 stack + Q4 write-safety + Q3 close-out              | 0.86         | apply-patch hook = strongest write guard; no stack detector            |
| 3    | insight | Q1 skill auto-load + Q5 council child + Q4 default     | 0.78         | filter-available-skills + getSkillPermissionsForAgent; CouncilManager  |
| 4    | insight | tests/docs/startup contracts for synthesis             | 0.63         | Tests pin dispatch invariants; closure pass for all questions          |

Total iterations: 4 of 8 max. Stop reason: `all_questions_answered` (5/5 resolved). Coverage 1.0.

## 11. Convergence Report

- **Stop reason:** `all_questions_answered`.
- **Iterations completed:** 4 of max 8.
- **Coverage:** 5/5 questions resolved with at least 4-6 cited findings each.
- **newInfoRatio trajectory:** 0.95 → 0.86 → 0.78 → 0.63 (declining steadily — natural saturation).
- **Rolling avg (last 3):** 0.76. Above the 0.05 stop threshold, but coverage and answered-count drove the stop.
- **MAD * 1.4826:** 0.126. Latest 0.63 NOT below MAD floor (would NOT have triggered MAD-based stop yet).
- **Quality guard:** PASS. Each of 5 questions has at least 4 cited findings with file:line citations.

The loop converged on the strong stop signal (all questions answered + coverage = 1.0) rather than on the soft signals (rolling-avg + MAD), which is the cleanest convergence shape per the YAML algorithm.

## 12. Next Steps

For the parent (`059-agent-implement-code`) workflow:

1. **Cross-stream reconciliation.** Compare this stream-01 synthesis against stream-02 (opencode-swarm-main) and stream-03 (internal agent inventory) findings. Specific questions to reconcile:
   - Does any other source surface a stronger or contradictory caller-restriction mechanism?
   - Are there stack-detection patterns elsewhere we should adopt (Webflow / sk-code already does this; how does our internal practice compare)?
   - Are there write-safety patterns stronger than `apply-patch`?
2. **Update `decision-record.md` D3** using the diff-shape in §8a (caller restriction). Include cross-stream citations.
3. **Author `.opencode/agent/code.md`** using the skeleton in §8b as a starting point. Validate the skeleton against:
   - Existing OpenCode agent file shape conventions in our repo (`.opencode/agent/*.md`).
   - The dispatch payload shape that our orchestrator actually uses today.
   - The stack-detection logic we already have in `sk-code` (the new agent should COMPLEMENT, not duplicate, sk-code's stack routing).
4. **Add tests pinning the agent contract** (modeled on slim's `src/agents/*.test.ts`):
   - Registry mode classification.
   - Permission map deny-by-default.
   - Strict LEAF dispatch (`tools.task = false`).
   - Output-contract format.

Stream-01 deliverable is complete. Hand off to parent synthesis.
