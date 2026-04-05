# Research Iteration 101: Tool-Chain Automation — Composite MCP Tools

## Focus
Investigate whether composite/macro MCP tools can chain multiple operations into a single call, reducing token overhead and improving UX for non-hook CLIs.

## Findings

### Current State

The public contract is intentionally low-level plus one smart entry point. `memory_context` is the documented L1 "start here" tool, `memory_match_triggers` is the fast per-turn helper, and `code_graph_status`, `code_graph_context`, and `ccc_status` are separate structural/semantic checks. [SOURCE: `tool-schemas.ts:40-43,210-212,655-698`; `README.md:509-517,605-616,1367-1372`]

Resume is already partially orchestrated, but only inside `memory_context`. `mode: "resume"` delegates to `handleMemorySearch` with anchors like `state`, `next-steps`, `summary`, and `blockers`, then may inject working-memory prompt context for a trusted resumed session. [SOURCE: `handlers/memory-context.ts:726-757,1291-1311`]

Hooked runtimes already hide some of the complexity. Startup/session-prime tells the client to call `memory_context(...resume...)` and separately warns about stale code graph state; the compaction hook already does a 3-source merge of session state, code-graph hints, and CocoIndex guidance. Non-hook CLIs do not get that automation. [SOURCE: `hooks/claude/session-prime.ts:84-120`; `hooks/claude/compact-inject.ts:166-249`]

Typical manual workflows today:

| Workflow | Common tool calls | Published ceiling |
|---------|-------------------|------------------|
| Resume baseline | `memory_context(resume)` + `code_graph_status` + `ccc_status` | ~4k+ tokens ceiling |
| Resume with prompt priming | Above + `memory_match_triggers` | ~7.5k+ tokens ceiling |
| Pre-task setup | `memory_match_triggers` + `memory_context` + `code_graph_context` + `task_preflight` | ~9.4k ceiling |

Those are ceiling budgets, not observed payload sizes. Real savings from composites mostly come from collapsing 2-4 extra request/response cycles and returning a tighter merged payload. For non-hook CLIs, that likely saves roughly 400-900 tokens for resume flows and 800-1,700 tokens for richer setup flows.

### Problem

Common workflows still require 3-5 sequential tool calls when the runtime does not have hook automation. That burns tokens on repeated MCP envelopes, repeated assistant steering, and repeated health/status payloads. It also weakens UX because "resume the session" is a conceptual single action but operationally a mini-playbook.

MCP itself does not block this. The protocol model is still "list tools" plus "call one tool," and this server already routes one tool name to one handler. A composite tool can simply be another normal MCP tool whose handler internally calls existing handlers and returns merged JSON. So this is a server-design choice, not a protocol limitation.

## Proposals

### Proposal A: session_resume Composite Tool

- Description: A single tool that internally runs `memory_context({ mode: "resume", profile: "resume" })`, `code_graph_status()`, and `ccc_status()`, then returns one merged "resume packet" with session state, graph health, semantic-search readiness, and next actions.
- LOC estimate: 120-220
- Files to change: `mcp_server/tool-schemas.ts`, `mcp_server/schemas/tool-input-schemas.ts`, `mcp_server/tools/context-tools.ts` or new `tools/composite-tools.ts`, `mcp_server/handlers/index.ts`, new `mcp_server/handlers/session-resume.ts`, tests, docs
- Dependencies: Existing `handleMemoryContext`, `handleCodeGraphStatus`, `handleCccStatus`, current response-envelope helpers
- Risk: LOW — it is mostly a thin wrapper over stable handlers and matches an already standardized workflow in docs/hooks

Token impact is strong here because resume is the most repeated multi-call pattern. Expect roughly 2 request/response cycles removed and ~400-900 tokens saved per manual resume in non-hook CLIs.

### Proposal B: full_context Composite Tool

- Description: A single tool that classifies the query, chooses the best retrieval path, optionally calls `memory_context`, optionally augments with `code_graph_context`, optionally checks `ccc_status`, and returns a merged context brief rather than raw parallel tool outputs.
- LOC estimate: 220-420
- Files to change: `mcp_server/tool-schemas.ts`, `mcp_server/schemas/tool-input-schemas.ts`, new `mcp_server/handlers/full-context.ts`, `mcp_server/handlers/index.ts`, `mcp_server/tools/context-tools.ts` or new composite dispatcher, tests, docs
- Dependencies: `handleMemoryContext`, code-graph context builder, intent classification, possibly reuse ideas from `hooks/claude/compact-inject.ts`
- Risk: MEDIUM — high value, but it can easily duplicate routing logic that already exists in `memory_context` and in hook-time merge code

Can save more tokens than Proposal A, but only if the response is opinionated. If it simply dumps all sub-tool payloads, the savings are mostly transport-only. If it compresses to one merged brief, it can save ~700-1,600 tokens on common "get me oriented" flows.

### Proposal C: pre_task_setup Composite Tool

- Description: A kickoff tool for implementation work that runs `memory_match_triggers(prompt)`, `memory_context(input)`, and `code_graph_context(...)` for relevant files/symbols, with optional `task_preflight(...)` when the caller supplies task/spec scoring inputs.
- LOC estimate: 180-320
- Files to change: `mcp_server/tool-schemas.ts`, `mcp_server/schemas/tool-input-schemas.ts`, new `mcp_server/handlers/pre-task-setup.ts`, `mcp_server/handlers/index.ts`, dispatch wiring, tests, docs
- Dependencies: `handleMemoryMatchTriggers`, `handleMemoryContext`, `handleCodeGraphContext`, optional `handleTaskPreflight`
- Risk: MEDIUM — useful, but `task_preflight` is instrumentation-oriented and requires explicit scores, so bundling it into an always-on macro may mix two different responsibilities

Best if positioned as "retrieval-first, preflight-optional."

### Proposal D: Tool Pipeline Configuration

- Description: A configurable macro tool or pipeline system where users define custom step chains, such as "resume = memory_context -> code_graph_status -> ccc_status," and the server executes/merges them.
- LOC estimate: 400-800
- Files to change: `mcp_server/tool-schemas.ts`, `mcp_server/schemas/tool-input-schemas.ts`, new pipeline engine under `mcp_server/lib/`, new handler, dispatcher wiring, tests, docs, and possibly config persistence
- Dependencies: Central dispatcher, allowlist enforcement, cycle detection, timeout/error policy, output normalization, provenance/trace support
- Risk: HIGH — this becomes an internal orchestration framework, increases coupling to every tool schema, and creates a second configuration language to maintain

## Recommendation

The best approach is **Proposal A first**, then **Proposal B if A proves valuable**.

`session_resume` is the cleanest win because the workflow is already standardized, already repeated across runtimes, and already partially composed in hooks. It gives immediate UX parity to non-hook CLIs without changing the mental model of the lower-level tools.

If the team wants a second step, build `full_context` as a thin orchestration layer that reuses shared helpers rather than re-implementing routing logic. Do not start with Proposal D. A configurable pipeline engine is powerful, but it is too much machinery for a problem that currently looks like 2-3 high-frequency macros.

## Cross-Runtime Impact

| Runtime | Current Resume Flow | After Implementation | Parity Change |
|---------|-------------------|---------------------|---------------|
| Claude/OpenCode with hooks | Hook priming + `memory_context(resume)`; graph/Coco checks partly surfaced separately | `session_resume` becomes optional convenience or hook target | Small to medium |
| Copilot CLI | Manual `memory_context(resume)` + `code_graph_status` + `ccc_status` + sometimes `memory_match_triggers` | One `session_resume` call | Large |
| Codex CLI | Same manual 3-4 call recovery pattern | One `session_resume` call | Large |
| Gemini CLI | Same manual 3-4 call recovery pattern | One `session_resume` call | Large |
| Any custom non-hook MCP client | Must know the server's resume playbook | Can call one opinionated macro tool | Large |

## Next Steps

1. Implement `session_resume` as a thin wrapper, not a new retrieval engine.
2. Return both a compact human-facing summary and structured subresults like `memory`, `codeGraph`, and `cocoIndex` so advanced clients keep flexibility.
3. Keep lower-level tools public and documented. Composite tools should be convenience tools, not replacements.
4. If building `full_context`, first extract shared merge/routing helpers so hook compaction and MCP composite tools do not drift.
5. Defer configurable pipelines until there is evidence that 2-3 fixed macros are insufficient.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
