# $refine TIDD-EC Prompt: 003-contextador

## 1. Header

Use the H1 above as the canonical phase prompt title for `003-contextador`.

## 2. Role

You are a research specialist in MCP-based context query interfaces, self-healing code knowledge systems, shared agent caches, and token-efficient codebase navigation. Work like a systems analyst who can separate source-proven mechanisms from README claims, trace repair loops and shared-cache behavior precisely, and translate Contextador's design into concrete improvements for `Code_Environment/Public`.

## 3. Task

Research Contextador's MCP query architecture, self-healing feedback loop, and Mainframe shared cache to identify practical, evidence-backed improvements for `Code_Environment/Public`, especially around query-based context retrieval instead of file-reading, cross-agent discovery reuse, and low-token codebase navigation. Classify each recommendation as `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

Contextador is a Bun-based TypeScript MCP server and CLI that maps a codebase into `CONTEXT.md` artifacts, then gives agents a query surface instead of forcing them to open large sets of files manually. In `src/mcp.ts`, the server exposes a `context` tool that routes a natural-language question to one or more scopes, reads only the matched `CONTEXT.md` files, serializes structured pointers, and returns those pointers to the agent. The README claims this cuts context-gathering from roughly 50K tokens to about 500 tokens by replacing broad exploration with a narrow query interface.

The self-healing story is partly real code and partly product framing. `context_feedback` in `src/mcp.ts` and `src/lib/core/feedback.ts` increments failure counters, patches `Key Files`, queues repairs, optionally enriches `CONTEXT.md` from files the agent discovered, and triggers the Janitor repair path in `src/lib/core/janitor.ts`. The system also records usage and rough token-savings estimates in `src/lib/core/stats.ts`, but the current implementation uses fixed average values rather than a rigorous benchmark harness.

Mainframe is the shared cache layer. `src/lib/mainframe/bridge.ts`, `rooms.ts`, `dedup.ts`, `summarizer.ts`, and `client.ts` show a Matrix-backed room protocol with query-hash deduplication, cached broadcasts, request messages, janitor locking, summary generation, persistent local agent IDs, and budget tracking. Provider abstraction lives in `src/lib/providers/config.ts`, while `.mcp.json` auto-detection and framework setup appear in `src/cli.ts`. Licensing is AGPL-3.0-or-later plus a separate commercial license path, not MIT.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Claude Optimization Settings (Reddit post) | Config audit + cache hooks | None | Reddit narrative |
| 002 | codesight | Zero-dep AST + framework detectors -> CLAUDE.md generation | 003 (context generation) | Focus AST detectors, static files |
| 003 | contextador | MCP server + queryable structure + Mainframe shared cache | 002, 004 | Focus self-healing, shared cache, MCP query interface |
| 004 | graphify | Knowledge graph (NetworkX + Leiden) | 002, 003 | Focus graph viz, multimodal, evidence tagging |
| 005 | claudest | Plugin marketplace + claude-memory | None | Marketplace structure |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has CocoIndex for semantic code search, Code Graph MCP for structural queries, and Spec Kit Memory for semantic memory retrieval and saved session context. What it does not currently have is a Mainframe-style shared query-result cache across machines or a self-healing code-context feedback loop that patches stale context artifacts after agent failure reports.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read the repo-root `AGENTS.md` first. If any `AGENTS.md` files exist inside `external/`, read them before deeper analysis.
3. Before deep research begins, ensure this phase folder contains Level 3 Spec Kit docs. Use `@speckit` for markdown authoring when supported. If `@speckit` is unavailable, follow existing Level 3 Spec Kit structure manually.
4. Start code reading with `external/src/mcp.ts`. Read the bootstrap, root validation, provider setup, background sweep helpers, and MCP server construction before relying on README claims.
5. Trace the MCP tool surface directly from `server.tool(...)` registrations in `external/src/mcp.ts`. Capture the exact responsibilities of `context`, `context_feedback`, `context_status`, `context_sweep`, `context_stats`, `context_init`, `context_generate`, `mainframe_pause`, `mainframe_resume`, `mainframe_tasks`, and `mainframe_request`.
6. After tool registration, trace the query path in this order: `external/src/lib/core/headmaster.ts`, hierarchy readers, pointer extraction, and stats tracking. Determine how queries are routed, when fan-out happens, how keyword fallback works, and how much of the routing is model-driven versus deterministic.
7. Then trace the self-healing path in this order: `external/src/lib/core/feedback.ts`, `external/src/lib/core/janitor.ts`, `external/src/lib/core/generator.ts`, and the `enrichFromFeedback(...)` helper inside `external/src/mcp.ts`. Follow the lifecycle from agent failure report to repair queue, regeneration, enrichment, freshness handling, and feedback counters.
8. Then trace Mainframe in this order: `external/src/lib/mainframe/bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, and `summarizer.ts`. Capture the sync model, query-hash dedup strategy, room state usage, janitor lock behavior, budget limits, summary generation, privacy assumptions, and where conflict resolution is absent or minimal.
9. Read `external/package.json`, `external/README.md`, `external/TROUBLESHOOTING.md`, and `external/LICENSE-COMMERCIAL.md` only after the core source pass. Use them to confirm runtime assumptions, Bun requirements, setup flow, provider support, `.mcp.json` generation, the 93% token-reduction claim, and the actual AGPL/commercial licensing model.
10. Compare Contextador directly against current `Code_Environment/Public` surfaces: `.opencode/skill/mcp-coco-index/README.md` for semantic search, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` plus related handlers for memory and code-graph retrieval, and the current code-graph and memory tool surfaces. Do not use a stale baseline.
11. Resolve cross-phase boundaries explicitly. Do not collapse this phase into codesight's static file generation or graphify's knowledge-graph analysis. This phase owns the MCP query surface, bounded self-healing loop, shared query cache, and cross-agent reuse model.
12. Validate the phase folder with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador" --strict
    ```
13. After validation passes, run deep research with this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/external and identify concrete improvements for Code_Environment/Public, especially around MCP-based query interfaces, self-healing context, shared agent caches (Mainframe), and token-efficient codebase navigation patterns.
    ```
14. Save canonical analysis output to `research/research.md`. Every meaningful finding must cite exact file paths, explain what Contextador actually does, why it matters for `Code_Environment/Public`, whether the evidence is source-proven or README-level, what subsystem is affected, and whether the recommendation is `adopt now`, `prototype later`, or `reject`.
15. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador"
    ```

## 6. Research Questions

1. What exact MCP tools does Contextador expose, and how does that tool surface change the agent workflow compared with direct file reading?
2. What data shape is actually returned by `context` queries, and how much of the structured-context schema comes from `CONTEXT.md` pointers versus live file reads?
3. How does `routeQuery(...)` decide between AI routing, keyword fallback, and fan-out across multiple scopes?
4. How does the self-healing loop work end to end from `context_feedback` through repair queue processing, regeneration, `Key Files` patching, and enrichment?
5. What parts of the "self-improving" claim are backed by code today, and what parts remain product language rather than measurable learning?
6. How does Mainframe synchronize broadcasts and requests across agents, what metadata is shared in Matrix room messages, and where is conflict resolution shallow or missing?
7. What privacy and operational tradeoffs come from Mainframe's design, including persistent local agent IDs, room-level message history, budget state, and optional Docker-hosted Operator setup?
8. How is the 93% token-reduction claim measured or approximated, and does the current stats implementation provide strong evidence or only coarse estimates?
9. How does the provider abstraction layer support Anthropic, OpenAI, Google, GitHub Copilot, OpenRouter, custom servers, and Claude Code, and what does that teach `Code_Environment/Public` about multi-provider retrieval tooling?
10. How does `.mcp.json` auto-detection and framework-specific setup shape adoption compared with this repo's current MCP configuration patterns?
11. What is the actual AGPL plus commercial licensing model, and how does that constrain adoption or direct reuse for `Code_Environment/Public`?
12. Compared with CocoIndex, Code Graph MCP, and Spec Kit Memory, what is genuinely new in Contextador's query model, and what would only duplicate behavior this repo already has?

## 7. Do's

- Do inspect the `server.tool(...)` registrations directly so the research captures the real MCP query surface.
- Do trace the self-healing loop from report intake to repair queue to regenerated or enriched `CONTEXT.md`.
- Do study Mainframe as implemented code, not as marketing copy, including Matrix message formats, dedup logic, janitor locking, and summary generation.
- Do verify the 93% savings story against `context_stats` and `stats.ts` rather than treating the README number as automatically proven.
- Do compare Contextador's query patterns against this repo's existing CocoIndex, Code Graph, and Spec Kit Memory surfaces.
- Do distinguish source-proven behavior from README or troubleshooting guidance every time evidence quality changes.
- Do call out where the design is intentionally lightweight and where that simplicity creates missing guarantees.

## 8. Don'ts

- Do not conflate Contextador with codesight. Contextador is a runtime MCP query server, while codesight generates static files.
- Do not repeat a MIT/commercial framing. The checked-in repo shows AGPL-3.0-or-later plus a separate commercial license path.
- Do not dismiss Mainframe as a marketing layer until the bridge, rooms, dedup, and Matrix client code are reviewed.
- Do not assume the token-savings claim is benchmarked rigorously. The current stats code may only estimate savings with fixed constants.
- Do not ignore Bun as the runtime boundary. This repo is built around Bun scripts, Bun entry points, and Bun-based setup assumptions.
- Do not recommend direct adoption of commercial or AGPL-bound code without explicitly discussing licensing and integration constraints.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Self-healing feedback-loop finding

```text
**Finding: Contextador's self-healing loop is a bounded patch-and-repair pipeline, not just a slogan**
- Source: external/src/mcp.ts; external/src/lib/core/feedback.ts; external/src/lib/core/janitor.ts
- What it does: `context_feedback` records the failure, increments frontmatter counters, adds missing files to `Key Files`, queues repair work, runs the repair queue, and may enrich `CONTEXT.md` from real file contents that the agent discovered.
- Why it matters: `Code_Environment/Public` already has strong retrieval surfaces, but it does not yet have a comparable correction path for stale code-context artifacts after an agent reports a missing or wrong pointer.
- Recommendation: prototype later
- Affected area: code-context maintenance, agent feedback loops, stale-context recovery
- Risk/cost: medium, because automatic patching needs guardrails to avoid low-quality or conflicting updates
```

## 10. Constraints

### 10.1 Error Handling

- If a file path in the brief does not exist, use the nearest real source path and state the correction plainly.
- If README claims are not backed by code, label them as documented behavior rather than verified implementation.
- If Mainframe behavior depends on Matrix semantics that are only lightly handled here, surface that limitation instead of inventing stronger guarantees.
- If a setup step depends on `contextador setup`, Bun, Docker, or provider credentials, note the prerequisite rather than pretending the path is turnkey.

### 10.2 Scope Boundaries

**IN SCOPE**

- MCP query interface
- query routing and pointer serialization
- self-healing feedback loop
- Janitor repair and freshness handling
- Mainframe shared cache and coordination model
- multi-provider abstraction
- `.mcp.json` auto-detection
- token-efficiency claims and measurement quality
- comparison with current Public retrieval surfaces

**OUT OF SCOPE**

- detailed commercial contract terms
- View AI marketing strategy
- speculative rewrites of Contextador into another language
- generic MCP primers not grounded in the repo
- unrelated repo setup commentary

### 10.3 Prioritization Framework

Rank findings in this order: impact on token reduction, fit with current Public retrieval architecture, leverage from cross-agent shared discovery, self-healing value, implementation complexity, licensing risk, and clean differentiation from phases `002-codesight` and `004-graphify`.

## 11. Deliverables

- `phase-research-prompt.md` present and tailored specifically to `003-contextador`
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison against CocoIndex, Code Graph MCP, and Spec Kit Memory
- each finding labeled `adopt now`, `prototype later`, or `reject`
- each finding states whether evidence is source-proven, README-documented, or both
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- evidence type
- what Contextador does
- why it matters for `Code_Environment/Public`
- recommendation
- affected subsystem
- risk, ambiguity, or validation requirement

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in MCP context queries, self-healing, shared caches, and token efficiency
  - **Instructions** are ordered, concrete, and path-specific
  - **Context** is domain-specific, cross-phase aware, and corrected to match the checked-in repo
  - **Constraints** clearly limit scope, licensing claims, and evidence quality
  - **Examples** show what a strong Contextador-derived finding looks like
- at least 5 findings are evidence-backed rather than speculative
- findings address both shared-cache value and self-healing limitations
- cross-phase overlap with `002` and `004` is addressed explicitly
- comparison to current Public retrieval systems is current-reality based, not stale

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with `external/src/mcp.ts`, then query routing, then feedback and janitor logic, then Mainframe, then README-level materials
- the exact validation command ran on this exact phase folder
- the exact deep-research topic string is used
- `research/research.md` contains at least 5 evidence-backed findings
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `003-contextador`
- no edits were made outside the phase folder
- overlap with `002-codesight` and `004-graphify` is explicitly resolved
