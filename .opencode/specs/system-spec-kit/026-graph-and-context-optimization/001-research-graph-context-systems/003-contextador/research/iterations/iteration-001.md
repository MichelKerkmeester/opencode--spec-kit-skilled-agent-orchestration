# Iteration 1 -- 003-contextador

## Metadata
- Run: 1 of 10
- Focus: external/src/mcp.ts and the MCP tool surface
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: 2026-04-06T10:40:06Z
- Finished: 2026-04-06T10:40:24Z
- Tool calls used: 7

## Reading order followed
1. external/src/mcp.ts (bootstrap, helpers, tool registrations, startup) `1-687`
2. external/src/lib/core/types.ts (declared response and request types) `14-97`
3. external/src/lib/core/projectconfig.ts (project bootstrap defaults and load path) `19-65`

## Findings

### F1.1 -- Bootstrap is root-scoped, config-driven, and mainframe-optional
- Source evidence: `external/src/mcp.ts:34-91`, `external/src/lib/core/projectconfig.ts:19-65`
- Evidence type: source-proven
- What it shows: `ROOT` comes from `CONTEXTADOR_ROOT` or `process.cwd()`, and `validateScope()` rejects paths that escape that root. `bootstrap()` loads global config first, then `.contextador/config.json` via `loadConfig(ROOT)`, configures the AI provider only when global config exists, and conditionally creates a `MainframeBridge` when either global or project mainframe settings are enabled.
- Why it matters for Code_Environment/Public: This is a practical template for a repo-local MCP server that can run in a self-contained mode first and only layer in provider or shared-cache concerns when configured. The split between global provider config and project mainframe config is especially relevant if `Code_Environment/Public` wants local-default behavior with optional cross-agent coordination.
- Affected subsystem: MCP bootstrap and provider wiring
- Open questions resolved: partial Q1
- Risk / ambiguity: `loadConfig()` only shallow-merges `DEFAULTS` and parsed JSON, so nested objects such as `mainframe` or `webhook` may be partially overwritten instead of deeply merged if a partial config file exists; that behavior is inferred from the spread merge in `projectconfig.ts`.

### F1.2 -- The MCP surface is a single `McpServer` with ten explicit tool registrations
- Source evidence: `external/src/mcp.ts:180-183`, `external/src/mcp.ts:186-671`, `external/src/mcp.ts:677-686`
- Evidence type: source-proven
- What it shows: `mcp.ts` constructs one `McpServer` named `contextador`, registers ten tools in-file, then calls `bootstrap()` before `server.connect()` on stdio transport. There is no dynamic tool discovery in this entrypoint; the tool surface is statically declared in registration order inside `mcp.ts`.
- Why it matters for Code_Environment/Public: This makes the external repo's MCP surface easy to audit and map into a feature catalog or parity doc because the authoritative registration point is centralized. It also means any compatibility layer or wrapper can trace startup and tool exposure from a single file instead of chasing plugin manifests.
- Affected subsystem: MCP server construction and tool surfacing
- Open questions resolved: Q1
- Risk / ambiguity: None at the registration layer; deeper behavior still depends on imported core modules not traced in this iteration.

### F1.3 -- `context` returns serialized text, not the structured `ContextResponse` declared in `types.ts`
- Source evidence: `external/src/mcp.ts:97-99`, `external/src/mcp.ts:185-284`, `external/src/lib/core/types.ts:49-62`, `external/src/lib/core/types.ts:91-97`
- Evidence type: source-proven
- What it shows: The `context` tool accepts only `{ query: string }` in `mcp.ts`, hashes query keywords, optionally serves a mainframe cache hit, routes locally with `routeQuery(ROOT, query)`, reads matched `CONTEXT.md` files, serializes pointers, and always returns `text(...)` content. The separate `ContextResponse` and `contextRequestSchema` definitions in `types.ts` describe a richer structured payload with `intent`, `knownPaths`, `context.files`, `types`, and `tests`, but those types are not used by the `server.tool("context", ...)` registration shown here.
- Why it matters for Code_Environment/Public: If we compare this repo to our own context-delivery interfaces, the key takeaway is that the actual MCP contract here is text-first and pointer-oriented, not a typed JSON response. Any adaptation or evaluation should treat the rich `ContextResponse` shape as library intent or future direction unless a downstream caller proves it is used elsewhere.
- Affected subsystem: MCP query interface
- Open questions resolved: Q2, partial Q1
- Risk / ambiguity: It remains possible that `routeQuery()` or other internal modules internally conform to `ContextResponse`-like semantics, but `mcp.ts` itself does not surface that structure over MCP.

### F1.4 -- Missing-context repair is wired through both query-time queueing and explicit feedback
- Source evidence: `external/src/mcp.ts:101-115`, `external/src/mcp.ts:117-174`, `external/src/mcp.ts:221-256`, `external/src/mcp.ts:286-341`
- Evidence type: source-proven
- What it shows: The `context` tool queues missing `CONTEXT.md` scopes into `.contextador/repair-queue.json` and triggers a non-blocking background sweep that runs `processRepairQueue(ROOT)` plus `freshnessSweep(ROOT)`. Separately, `context_feedback` validates scope, calls `processFeedback(ROOT, ...)`, records a feedback event, may synchronously run `processRepairQueue(ROOT)`, enriches the scope's `CONTEXT.md` via `enrichFromFeedback()`, and notifies mainframe with a `postRequest()`.
- Why it matters for Code_Environment/Public: This is the clearest source-backed evidence for the repo's self-repair or self-improving claims: the server does not just expose context, it also captures misses and feeds them into repair/enrichment paths. For our research packet, this is the main entry point for understanding how agent corrections become future context quality improvements.
- Affected subsystem: Feedback and repair loop
- Open questions resolved: partial Q4, partial Q5
- Risk / ambiguity: Source proves repair and enrichment hooks exist, but this iteration did not inspect `feedback.ts` or `janitor.ts`, so long-term persistence quality and repair semantics are still only partially traced.

### F1.5 -- Operational context tools split into status, sweep, stats, initialization, and generation
- Source evidence: `external/src/mcp.ts:344-472`, `external/src/mcp.ts:475-586`
- Evidence type: source-proven
- What it shows: `context_status` reports freshness for one scope or an overview plus mainframe state; `context_sweep` runs `runJanitor(ROOT)` under an optional mainframe janitor lock; `context_stats` formats accumulated usage stats; `context_init` scaffolds `.contextador/config.json`, creates a root `CONTEXT.md` if missing, and lists scopes needing generation; `context_generate` summarizes directory contents by extension for authoring `CONTEXT.md`.
- Why it matters for Code_Environment/Public: The tool surface is broader than retrieval alone and effectively spans lifecycle management for a context index. That makes this external repo relevant not only as a query-interface reference, but also as a candidate pattern for maintenance tooling around generated context artifacts.
- Affected subsystem: Context maintenance and project bootstrapping
- Open questions resolved: Q1
- Risk / ambiguity: `context_generate` summarizes a directory rather than writing context directly, so any "automatic generation" claim needs to distinguish between authoring assistance and full file creation.

### F1.6 -- Mainframe tools are thin control-plane wrappers around an optional shared coordination bridge
- Source evidence: `external/src/mcp.ts:66-90`, `external/src/mcp.ts:589-671`
- Evidence type: source-proven
- What it shows: When mainframe is configured, `bootstrap()` creates a `MainframeBridge` with operator URL, room naming, budget limits, and project root. The remaining mainframe-facing tools are lightweight wrappers: `mainframe_pause` kills communications locally, `mainframe_resume` restores them, `mainframe_tasks` polls pending requests, and `mainframe_request` posts a task to another agent.
- Why it matters for Code_Environment/Public: This isolates shared-agent coordination behind a narrow optional layer instead of coupling it directly into the core context tools. That separation is useful if we want to evaluate "shared agent cache" or "agent coordination bus" ideas without making local-only usage dependent on external infrastructure.
- Affected subsystem: Mainframe coordination interface
- Open questions resolved: Q1
- Risk / ambiguity: This iteration only traced the MCP-facing bridge calls, not the transport semantics or cache model inside `MainframeBridge`.

## MCP tool surface table
| Tool name | server.tool location | Purpose | Inputs | Outputs |
|-----------|----------------------|---------|--------|---------|
| context | `mcp.ts:186` | Route a codebase question, read matched `CONTEXT.md` files, serialize pointers, and optionally use mainframe cache first | `query: string` | `content[{type:"text",text:string}]` containing cached output or serialized pointer text, optionally prefixed with `[mainframe cache hit]` or `[fan-out: N scopes]` |
| context_feedback | `mcp.ts:287` | Record inaccurate or missing context and feed repair/enrichment flows | `scope: string`, `type: "missing_context" | "build_failure" | "wrong_location"`, optional `detail`, optional `missingFiles: string[]` | text confirmation string describing recorded feedback and enrichment/sweep follow-up |
| context_status | `mcp.ts:345` | Report freshness for one scope or all context files plus mainframe status | optional `scope: string` | text status report |
| context_sweep | `mcp.ts:416` | Run janitor stages with an optional mainframe lock | none | text janitor report including last run, changed flag, per-stage processed counts, and action lines |
| context_stats | `mcp.ts:464` | Show usage statistics for contextador | none | formatted text statistics report |
| context_init | `mcp.ts:476` | Initialize `.contextador`, save default config, create root `CONTEXT.md`, and detect scopes needing generation | optional `root: string` | text initialization summary with next-step guidance |
| context_generate | `mcp.ts:551` | Summarize one directory to help author or update `CONTEXT.md` | `scope: string` | text summary grouped by file extension |
| mainframe_pause | `mcp.ts:590` | Pause mainframe communication | none | text acknowledgement or "not configured" |
| mainframe_resume | `mcp.ts:605` | Resume mainframe communication after pause | none | text acknowledgement or "not configured" |
| mainframe_tasks | `mcp.ts:620` | Check pending task requests from other agents | none | text list of pending tasks, paused/not-configured message, or connection-failure message |
| mainframe_request | `mcp.ts:651` | Post a task request to another agent | `to: string`, `task: string`, optional `priority: "normal" | "high"` | text acknowledgement or connection-failure message |

## Newly answered key questions
- Q1: `mcp.ts` registers ten tools, in order: `context`, `context_feedback`, `context_status`, `context_sweep`, `context_stats`, `context_init`, `context_generate`, `mainframe_pause`, `mainframe_resume`, `mainframe_tasks`, and `mainframe_request`; startup is `bootstrap()` followed by stdio `server.connect()` (`external/src/mcp.ts:48-91`, `external/src/mcp.ts:180-183`, `external/src/mcp.ts:186-671`, `external/src/mcp.ts:677-686`).
- Q2: The live MCP `context` tool returns text payloads built from serialized pointers and route metadata, not the richer `ContextResponse` object declared in `types.ts`; the richer shape is present as a library type but is not wired into the tool registration here (`external/src/mcp.ts:97-99`, `external/src/mcp.ts:185-284`, `external/src/lib/core/types.ts:49-62`).
- partial Q4: `context_feedback` is the explicit ingress point for corrective feedback in `mcp.ts`; it forwards feedback to `processFeedback()`, records stats, may run repair synchronously, enriches `CONTEXT.md`, and can notify mainframe (`external/src/mcp.ts:286-341`).
- partial Q5: Source evidence supports a limited "self-improving/self-repairing context" claim through repair queueing, background sweep triggers, feedback ingestion, and enrichment hooks, but this iteration did not inspect README language or internal repair implementations, so broader claims remain unverified (`external/src/mcp.ts:101-115`, `external/src/mcp.ts:221-256`, `external/src/mcp.ts:286-341`).

## Open questions still pending
- Q3, Q4 (deeper trace needed into `feedback.ts` and `janitor.ts`), Q5 (README claim comparison still needed), Q6, Q7, Q8, Q9, Q10, Q11, Q12

## Recommended next focus (iteration 2)
Iteration 2 should trace the local query path behind `context`: start with `routeQuery()` in `external/src/lib/core/headmaster.ts`, then follow the file-selection and hierarchy evidence into `pointers.ts` and `hierarchy.ts`. That should answer how targets are chosen, what pointer structure is extracted before serialization, and whether the unused `ContextResponse` type reflects an abandoned design or an internal intermediate that never reaches the MCP boundary.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.82
- status: insight
- findingsCount: 6
