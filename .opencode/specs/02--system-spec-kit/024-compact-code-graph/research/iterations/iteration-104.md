# Research Iteration 104: OpenCode Custom Agent Integration

## Focus
Investigate whether a specialized `@context-prime` agent can be created in OpenCode to automatically load context, check code graph status, and prime sessions on start.

## Findings

### Current State

OpenCode custom agents are defined as Markdown files under `.opencode/agent/*.md`, and the repo documents them as the canonical runtime source. They are invoked either by automatic routing rules or manually via `@agent_name` syntax. [SOURCE: .opencode/README.md:94-116] [SOURCE: .opencode/README.md:302-330]

The actual OpenCode agent schema is frontmatter-driven. In this repo, agents use fields like `name`, `description`, `mode`, `temperature`, `permission`, and optional `mcpServers`; `@context` is read-only and mounts `spec_kit_memory` plus `cocoindex_code`. [SOURCE: .opencode/agent/context.md:1-23] `@orchestrate` routes all exploration through `@context` and treats it as the exclusive retrieval leaf. [SOURCE: .opencode/agent/orchestrate.md:87-100]

`@context` already performs most of the desired priming behavior conceptually: memory-first retrieval, then `code_graph_status()` once per session before structural exploration. [SOURCE: .opencode/agent/context.md:43-53] But it is a broad exploration agent, not a startup/bootstrap specialist.

No documented OpenCode session-start hook or auto-agent invocation surface exists in `opencode.json` or `.opencode/README.md`; the config exposes permissions and MCP servers only. [SOURCE: opencode.json:1-61] By contrast, Claude has a real `SessionStart` hook (`session-prime.ts`) that injects startup guidance and checks code-graph freshness. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:84-120]

### Problem

OpenCode has strong custom-agent infrastructure, but no documented zero-touch session-priming mechanism. That means context recovery currently depends on either the user/LLM manually invoking `@context` or `/spec_kit:resume`, or on the model remembering first-turn instructions like `memory_context(...resume...)` and `code_graph_status()`. [SOURCE: .opencode/command/spec_kit/resume.md:1-17]

## Proposals

### Proposal A: @context-prime Agent with Manual Invocation

- Description: Create a new `.opencode/agent/context-prime.md` as a narrow bootstrap agent. Its job would be: `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume" })`, `code_graph_status({})`, optionally `ccc_status()`, then return a short "Prime Package" with active spec folder, current task, blockers, next steps, and retrieval-health status. This works with the existing custom-agent system because OpenCode already supports new agent files plus manual `@agent_name` invocation.
- LOC estimate: 60-140
- Files to change: `.opencode/agent/context-prime.md`, `.opencode/README.md`, optionally `.opencode/agent/orchestrate.md`
- Dependencies: `spec_kit_memory`, code-graph tools, `ccc_status` wrapper, existing agent routing
- Risk: LOW — no runtime changes required; clean separation from `@context`

### Proposal B: Enhanced @context Agent with Prime Mode

- Description: Extend `@context` so its prompt contract explicitly supports a "prime/resume mode" for first-turn use. This is attractive because `@context` already does memory-first retrieval and a per-session `code_graph_status()` check. The downside is role-blurring: `@context` is currently defined as the exclusive exploration agent returning a full Context Package, not a lightweight session bootstrapper.
- LOC estimate: 25-80
- Files to change: `.opencode/agent/context.md`, `.opencode/agent/orchestrate.md`, `.opencode/README.md`
- Dependencies: same as current `@context`
- Risk: MEDIUM — cheaper, but muddies the agent's purpose and output contract

### Proposal C: OpenCode Session-Start Workflow

- Description: Add a command/workflow such as `/session:prime` or extend `/spec_kit:resume:auto` to execute priming in a structured way on session start. This would be a command-level workflow, not a true automatic startup hook, unless OpenCode runtime itself grows a SessionStart mechanism.
- LOC estimate: 50-160
- Files to change: new `.opencode/command/.../prime.md` or extend `.opencode/command/spec_kit/resume.md`, plus `.opencode/README.md`
- Dependencies: command runner, memory/code-graph/CocoIndex tools
- Risk: MEDIUM — useful and explicit, but still manual unless runtime changes land

### Proposal D: Gate Doc Auto-Delegate to @context-prime

- Description: Update instruction docs so the first turn auto-delegates to `@context-prime` in practice. This means changing runtime guidance to say: on session start or after compaction/clear, call `@context-prime` before normal work. This mirrors existing first-turn recovery rules in `CLAUDE.md`, `GEMINI.md`, and `CODEX.md`, but channels them through a dedicated agent instead of freehand model behavior.
- LOC estimate: 20-70
- Files to change: `.opencode/README.md`, `.opencode/agent/orchestrate.md`, `CLAUDE.md`, `GEMINI.md`, `CODEX.md` (and `AGENTS.md` only if that file is an active runtime instruction entrypoint)
- Dependencies: model obedience to docs; optional new `@context-prime` agent
- Risk: MEDIUM — no runtime changes, but enforcement is prompt-level, not platform-level

## Recommendation

Best near-term approach: **Proposal A + Proposal D**.

Create a dedicated `@context-prime` agent, then update first-turn guidance and orchestrator docs to route startup recovery through it. That gives OpenCode a specialized priming path **without** changing runtime internals, preserves the clean role of `@context`, and creates a direct upgrade path to a future true startup hook.

If you want **true zero-touch startup priming**, that is a separate runtime feature request. The repo currently shows that capability only on the Claude side via `session-prime.ts`, not in OpenCode config.

## Cross-Runtime Impact

| Runtime | Current Agent Priming | After Implementation | Parity Change |
|---------|---------------------|---------------------|---------------|
| OpenCode | Manual `@context` or `/spec_kit:resume`; no documented startup hook | Manual `@context-prime` plus first-turn doc/orchestrator delegation | ~60% -> ~80% |
| Claude | Real SessionStart hook via `session-prime.ts` | Unchanged unless `@context-prime` is mirrored | ~95% -> ~95% |
| Copilot CLI | Instruction-driven first-turn recovery (`memory_context` + `code_graph_status`) | Can mirror `@context-prime` guidance, but no native startup hook | ~75% -> ~80% if mirrored |
| Gemini CLI | Same as Copilot CLI | Same as Copilot CLI | ~75% -> ~80% if mirrored |
| Codex CLI | Explicit manual recovery; no hook-based context injection | Could mirror docs, but still manual without runtime support | ~65% -> ~75% if mirrored |

## Next Steps

1. Add `.opencode/agent/context-prime.md` with a narrow "bootstrap only" contract.
2. Give it `@context`-like read/memory permissions, plus access to code-graph and `ccc_status` surfaces where available.
3. Make its output a compact "Prime Package": spec folder, current task, blockers, next steps, graph status, CocoIndex status.
4. Update `.opencode/agent/orchestrate.md` and `.opencode/README.md` to use `@context-prime` on first turn / after `/clear`.
5. Optionally add a command wrapper (`/session:prime` or `/spec_kit:resume:auto` enhancement).
6. Treat true auto-run as a later OpenCode runtime enhancement, modeled after Claude's SessionStart hook.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
