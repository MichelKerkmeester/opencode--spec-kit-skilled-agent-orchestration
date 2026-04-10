### Finding 4: Engram treats user prompts as a first-class retrieval lane, not just raw context input
- **Source**: [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L350), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L119), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L487), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1109), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts#L330), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L95)
- **What it does**: Engram has `mem_save_prompt`, `/prompts`, `prompts_fts`, and `FormatContext()` explicitly renders recent prompts before observations. The OpenCode plugin captures each `chat.message` into that lane. Public’s save pipeline can ingest `user_prompts` during `generate-context.js`, but live MCP retrieval is not organized around a dedicated prompt tool/search surface.
- **Why it matters for us**: This is the cleanest surface-level improvement for session narrative continuity that does not duplicate Public’s hybrid retrieval stack.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Engram’s thin runtime adapters do real safety work: sub-agent suppression, passive capture, and compaction instructions
- **Source**: [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts#L199), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts#L282), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts#L370), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts#L423), [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L510), [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L94)
- **What it does**: The adapter avoids registering Task sub-agents as top-level sessions, captures Task output into `/observations/passive`, injects compaction instructions that force `mem_session_summary`, and installs per-client MCP configs and allowlists. Public centralizes that intelligence in `session_bootstrap` and session trust logic instead of runtime-specific adapters.
- **Why it matters for us**: Public’s core is stronger, but Engram’s adapter layer is better at meeting each host where it is. That matters if we want Spec Kit Memory to feel native in runtimes outside our own hooks.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Topic keys are surfaced as an agent workflow, not just a storage field
- **Source**: [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L302), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L704), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L763), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L948), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1474), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3201)
- **What it does**: Engram gives agents a dedicated `mem_suggest_topic_key` tool, auto-suggests a key on `mem_save`, upserts by `topic_key`, and short-circuits search to exact topic-key hits before FTS when the query looks like a key.
- **Why it matters for us**: Earlier findings showed topic keys are not a replacement for Public lineage. This pass adds the missing tool-surface insight: Engram teaches agents how to keep an evolving thread stable. Public has the storage sophistication, but not this lightweight agent-facing thread-key affordance.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [cmd/engram/main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go)
- [internal/setup/setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go)
- [internal/setup/plugins/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts)
- [docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [mcp_server/context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
- [mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [mcp_server/handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [mcp_server/lib/session/session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [scripts/dist/memory/generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.77
- Questions addressed: [1, 2, 3, 6, 7, 8, 9, 10]
- Questions answered: [1, 2, 3, 6, 7, 8, 9, 10 at tool/API surface depth]

## Reflection
- What worked: tracing `internal/mcp/mcp.go` into `cmd/engram/main.go`, `internal/server/server.go`, `internal/setup/`, and the OpenCode plugin made the profile split and lifecycle surface concrete; comparing that directly against `context-server.ts`, `tool-schemas.ts`, `session-manager.ts`, and `generate-context.js` exposed where Public is richer internally but flatter externally.
- What did not work: CocoIndex search on this Go subtree was not usable in this session, so I used targeted `rg`, `nl`, and direct source inspection instead. The sandbox is read-only, so I did not update packet artifacts or save this iteration into the phase folder.

## Recommended Next Focus
Trace the PROMPT/NARRATIVE continuity path end to end: Engram’s `mem_save_prompt` + `user_prompts` + plugin `chat.message` capture + compaction hook versus Public’s `generate-context.js` `user_prompts`, `memory_context` session lifecycle, cached continuity in `session_resume`, and whether Public should add a first-class prompt/session-narrative MCP surface without weakening its existing hybrid retrieval stack.

RESEARCH BRIEF:
# $refine TIDD-EC Prompt: 001-engram-main

## 2. Role

You are a research specialist in persistent memory architectures for AI agents, MCP server design, SQLite/FTS5 search systems, and agent-agnostic tool surfaces. Work like a systems analyst who can trace Go implementation details, separate durable patterns from packaging noise, and turn Engram's design into concrete improvements for `Code_Environment/Public`. Keep the analysis grounded in actual repository evidence, especially around tool profiles, session lifecycle, topic-key stability, passive capture, and search behavior.

## 3. Task

Research Engram's persistent memory architecture, MCP tool design, and session lifecycle patterns to identify practical improvements for `Code_Environment/Public`, especially for Spec Kit Memory. Focus on how Engram separates agent tools from admin tools, persists session history, stabilizes evolving topics with `topic_key`, and ranks or shortcuts search using SQLite + FTS5. Compare Engram's choices against current Public capabilities and classify each recommendation as `adopt now`, `prototype later`, or `reject`. Prioritize improvements that strengthen session continuity, memory hygiene, search usefulness, and agent-agnostic integration without duplicating systems Public already has.

## 4. Context

### System Description

Engram is a single Go binary that exposes one persistent memory backend through four surfaces: CLI, HTTP API, MCP stdio, and an interactive TUI. The storage layer lives in SQLite with FTS5 virtual tables for observations and prompts, while the MCP layer in `internal/mcp/mcp.go` registers tools with explicit profile separation and usage guidance. The value proposition is operational simplicity: one binary, one local database, zero external runtime dependency, and compatibility across Claude Code, OpenCode, Gemini CLI, Codex, VS Code Copilot, Cursor, Windsurf, and other MCP-capable agents.

The core memory model is project-scoped and session-aware. `internal/store/store.go` persists sessions, observations, and user prompts separately; `CreateSession()` and `EndSession()` maintain session boundaries, while `FormatContext()` composes recent sessions, prompts, and observations into startup context. Session summaries are treated as first-class memory artifacts rather than free-form chat residue, and passive capture exists as a distinct pathway for extracting learnings from output text.

Engram also has a strong opinion on memory hygiene. `AddObservation()` supports `topic_key` upserts so evolving topics revise a stable record instead of generating fragment spam, while exact-duplicate detection increments `duplicate_count` inside a rolling window. `SuggestTopicKey()` assigns family prefixes such as `architecture/`, `bug/`, `decision/`, and `session/`, and `Search()` first checks direct topic-key matches before FTS5 `MATCH`, then orders full-text results by `fts.rank` after `sanitizeFTS()` quotes individual terms. This phase should treat those behaviors as the domain center of gravity, not the TUI.

### Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|-------------|-------------|-----------------|
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 003 (MCP memory), 004 (hybrid search) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 001 (memory persistence) | Focus drift detection, scaffold structure, no-DB approach |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5 search), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 001 (FTS5), 003 (local memory) | Focus vector search, OpenCode plugin architecture, scoping |

### What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with semantic retrieval via `memory_search`, session continuity via `memory_context`, trigger-based recall via `memory_match_triggers`, causal links, health/status tooling, and context save flows through `generate-context.js`. It also has CocoIndex for semantic code search and code-graph tooling for structural queries. What it does **not** currently have is a first-class session lifecycle API comparable to `mem_session_start` / `mem_session_end`, nor a lightweight MCP tool-profile split equivalent to Engram's `ProfileAgent` versus `ProfileAdmin`.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Read the governing `AGENTS.md` files first: the Public repo root `AGENTS.md` and `external/engram-main/AGENTS.md`. If the external repo references project-local skills, note them as evidence about contributor workflow rather than as primary architecture.
3. Before deep research begins, ensure this phase folder contains Level 3 Spec Kit docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
4. Use `@speckit` for markdown authoring when the runtime supports agent routing. If routing is unavailable, preserve existing Spec Kit Level 3 structure manually without creating side-channel docs outside the phase folder.
5. Validate the phase folder with this exact command before the main research pass:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict
   ```
6. If validation fails, fix the docs in this same phase folder first. If blocked, record the blocker explicitly in `tasks.md` and `checklist.md` before continuing.
7. Run `spec_kit:deep-research` with this exact topic:
   ```text
   Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/engram-main and identify concrete improvements for Code_Environment/Public, especially around persistent memory architecture, MCP tool design, session lifecycle, search ranking, and agent-agnostic integration patterns.
   ```
8. Follow this reading order for domain evidence: `internal/mcp/` first, especially `internal/mcp/mcp.go`; then `internal/store/`, especially `store.go`; then `docs/ARCHITECTURE.md`; then `README.md`; then CLI/TUI or plugin docs only as supporting context.
9. Trace MCP tool registration end to end in `internal/mcp/mcp.go`: profile maps, `ResolveTools()`, `shouldRegister()`, eager versus deferred tools, tool descriptions, and handler wiring for `mem_search`, `mem_save`, `mem_context`, `mem_session_summary`, `mem_session_start`, `mem_session_end`, `mem_suggest_topic_key`, and `mem_capture_passive`.
10. Trace store behavior in `internal/store/store.go`: schema creation, FTS5 tables, `CreateSession()`, `EndSession()`, `AddObservation()`, `Search()`, `FormatContext()`, `SuggestTopicKey()`, and `sanitizeFTS()`. Pay attention to `revision_count`, `duplicate_count`, `deleted_at`, direct topic-key lookup, and soft-delete behavior.
11. Use CocoIndex plus grep to trace implementations and references. If CocoIndex is weak on Go files or times out, fall back to targeted grep plus direct file reads and state that fallback explicitly in the research notes.
12. Compare Engram directly against Public's current memory stack: Spec Kit Memory, `memory_context`, `memory_search`, `memory_match_triggers`, `generate-context.js`, CocoIndex, and any relevant code-graph/session-recovery surfaces. Keep the comparison concrete rather than generic.
13. Save all research outputs inside `research/`, with `research/research.md` as the canonical report. Every meaningful finding must cite exact Engram file paths and map the insight to a concrete Public gap, subsystem, or design question.
14. When research is complete, update `checklist.md`, create `implementation-summary.md`, and make sure the report explicitly distinguishes `adopt now`, `prototype later`, and `reject`.
15. Save memory for this phase folder with:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main"
   ```

## 6. Research Questions

1. How effective is Engram's `ProfileAgent` versus `ProfileAdmin` split, and would a similar separation reduce tool clutter or accidental misuse in Public's memory surfaces?
2. What does Engram gain from explicit session lifecycle tools such as `mem_session_start`, `mem_session_end`, and `mem_session_summary`, and where would that improve Public beyond today's session continuity model?
3. How does `SuggestTopicKey()` create stable topic families, and could Public benefit from comparable topic-key or thread-key conventions for evolving decisions and repeated refinements?
4. How does `AddObservation()` balance topic upserts, duplicate suppression, and revision tracking, and what memory-hygiene lessons apply to Spec Kit Memory?
5. What are the practical consequences of Engram's FTS5 ranking approach, including direct topic-key shortcuts, `sanitizeFTS()`, and `fts.rank`, compared with Public's broader hybrid retrieval stack?
6. How does passive capture work conceptually and structurally, and could Public adopt a lightweight passive-learning path without duplicating manual memory-save flows?
7. How does MCP stdio transport plus a single binary distribution shape agent-agnostic adoption, plugin setup, and operational simplicity?
8. How does Engram handle multi-agent use safely through project scoping, normalized project names, and merge/consolidation tools, and what isolation lessons matter for Public?
9. Which Engram features are foundational memory-system ideas versus packaging or UX conveniences that Public should not over-copy?
10. Which patterns best improve compaction survival and startup continuity for future Public sessions, especially around summaries, prompts, and recent-context formatting?

## 7. Do's

- Do trace MCP tool registration end to end in `internal/mcp/mcp.go`, not just the README tool list.
- Do examine the SQLite schema and FTS5 tables in `internal/store/store.go`, including `observations_fts` and `prompts_fts`.
- Do study the `ProfileAgent` and `ProfileAdmin` separation as a product decision, not just a code convenience.
- Do inspect how sessions are opened, ended, summarized, and reformatted into startup context.
- Do analyze topic-key suggestion and upsert behavior for long-lived architectural or decision threads.
- Do verify where direct topic-key lookup outranks or bypasses normal FTS5 ranking.
- Do map every strong finding to a specific improvement area inside Spec Kit Memory or adjacent Public tooling.

## 8. Don'ts

- Do not spend most of the analysis on the TUI; it is a delivery surface, not the core memory pattern.
- Do not conflate Engram's MCP tools with Spec Kit Memory's MCP tools; they address overlapping goals through different architectures.
- Do not ignore plugin marketplace or agent setup integration; it matters as evidence of agent-agnostic distribution strategy.
- Do not try to run the Go binary in this phase; static analysis of source and docs is sufficient.
- Do not reduce Engram to "just FTS5"; the interesting part is how FTS5 is wrapped with session state, topic keys, and tool ergonomics.
- Do not over-recommend Engram features that Public already covers better via hybrid search, graph context, or semantic retrieval.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: Tool-profile finding

```text
**Finding: Agent-safe MCP profile separation**
- Source: external/engram-main/internal/mcp/mcp.go
- What it does: `ProfileAgent` keeps proactive save/search/context/session tools available to agents, while `ProfileAdmin` isolates deletion, stats, timeline, and project-merge operations for curation workflows.
- Why it matters: Public currently exposes many memory capabilities without a comparable profile layer, so a narrower agent-safe surface could reduce prompt noise and misuse risk.
- Recommended action: prototype later
- Affected area: Spec Kit Memory tool surfacing, startup guidance, future profile-aware wrappers
- Risk/cost: Medium; requires deciding whether profile logic belongs in MCP schema, runtime config, or command wrappers
```

### Example B: Session and topic-key finding

```text
**Finding: Stable topic threads plus explicit session closure**
- Source: external/engram-main/internal/store/store.go; external/engram-main/internal/mcp/mcp.go; external/engram-main/docs/ARCHITECTURE.md
- What it does: `AddObservation()` upserts by `topic_key` within project+scope, increments `revision_count`, and pairs that with `mem_session_summary` / `mem_session_end` so evolving work stays threadable across sessions.
- Why it matters: Public has strong retrieval, but it does not yet expose a similarly lightweight thread-key plus explicit lifecycle model for durable session narratives.
- Recommended action: adopt now or prototype later, depending on implementation scope
- Affected area: session continuity design, save workflows, memory hygiene
- Risk/cost: Medium; thread-key collisions and scope semantics must be designed carefully
```

## 10. Constraints

### Error Handling

- If CocoIndex does not index the Go repo well enough, use grep plus direct file reads and state the fallback explicitly.
- If a README or architecture claim is not confirmed in `internal/mcp/` or `internal/store/`, mark it as unverified rather than proven.
- If file paths differ from the prompt assumptions, document the actual path and continue with source-backed analysis.
- If a design appears ambiguous, prefer citing the exact code path over prose documentation.

### Scope

**IN SCOPE**

- persistent memory architecture
- MCP tool design and registration
- session lifecycle management
- topic-key suggestion and upsert stability
- SQLite + FTS5 search behavior
- passive capture
- project scoping and agent-agnostic integration

**OUT OF SCOPE**

- TUI UX details beyond what they reveal about memory semantics
- HTTP API details unless they clarify the same core memory pattern
- Homebrew packaging or release automation
- generic Go style commentary
- speculative feature ideas unsupported by Engram evidence

### Prioritization Framework

Rank findings in this order: session-lifecycle leverage, memory-hygiene impact, topic-key stability value, tool-surface clarity, fit with existing Spec Kit Memory capabilities, search-quality implications, and ease of integrating the idea without duplicating Public's stronger semantic or graph-aware systems.

## 11. Deliverables

- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` present and valid before deep research starts
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- each finding includes source path, what Engram does, why it matters for Public, recommendation, affected area, and risk/cost
- explicit comparison against current Public memory capabilities, especially Spec Kit Memory and CocoIndex
- `implementation-summary.md` created at the end
- memory saved from this exact phase folder using `generate-context.js`

## 12. Evaluation Criteria

- At least 5 findings are evidence-backed rather than speculative.
- Every nontrivial finding cites an exact Engram file path.
- Findings clearly distinguish Engram's strengths in tool profiles, session lifecycle, topic keys, or search behavior.
- Recommendations explicitly say `adopt now`, `prototype later`, or `reject`.
- Cross-phase overlap with 003 and 004 is acknowledged so the analysis does not duplicate BM25/FSRS or hybrid-vector ownership.
- The prompt remains RICCE-complete: role, instructions, context, constraints, and examples are all materially useful.
- The finished prompt is CLEAR-aligned and strong enough to target `>= 40/50`.

## 13. Completion Bar

- `phase-research-prompt.md` exists in this phase folder and is specific to Engram rather than generic memory-system research.
- The prompt includes all 13 required sections and stays domain-specific.
- Instructions contain the exact deep-research topic string and exact validation command.
- The prompt clearly directs research toward tool profiles, session lifecycle, topic keys, passive capture, and FTS5 behavior.
- Deliverables require at least 5 evidence-backed findings with exact citations.
- The final content is RICCE compliant and intended to score CLEAR `>= 40/50`.
- No edits are made outside this phase folder.

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
For EACH finding:
### Finding N: [Title]
- **Source**: exact file path(s)
- **What it does**: technical description with code evidence
- **Why it matters for us**: concrete relevance
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Sources Consulted
- [file paths examined]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Reflection
- What worked: [approach that yielded results]
- What did not work: [approach that failed]

## Recommended Next Focus
[What to investigate next]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a read-only deep research pass focused on Engram’s session lifecycle against our Spec Kit Memory surfaces. I’ll first do a lightweight memory pass for prior context, then trace the Engram source path from MCP registration into store/session code and compare it directly with our session and save pipeline.
exec
/bin/zsh -lc 'rg -n "engram|hybrid-rag|session lifecycle|topic_key|mem_session" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "pwd && rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/archive-report.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/tasks.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/proposal.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/design.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/archive-report.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/tasks.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.mod
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CODEOWNERS
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.sum
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/agent-save.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-detail.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-search.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-recent.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-dashboard.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/intended-usage.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/INSTALLATION.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/COMPARISON.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/gentle-creation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/commit-hygiene/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/memory-protocol/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/ui-elements/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/cultural-norms/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/project-structure/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/watcher.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/testhelpers_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/slug.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/state.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/graph.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/graph_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/state_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/slug_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/graph.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/watcher_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/dashboard-htmx/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/sync.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/settings.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/main.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/esbuild.config.mjs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/manifest.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/architecture-guardrails/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/pr-review-deep/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/version/check.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/version/check_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/backlog-triage/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/generate.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/branch-pr/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/catalog.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/testing-coverage/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/business-rules/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/docs-alignment/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/wrap_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/styles.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/sdd-flow/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/server-api/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/visual-language/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/gentleman-bubbletea/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/plugin-thin/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/hooks/hooks.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/tui-quality/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/_helpers.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/subagent-stop.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh

codex
I’ve got the Engram source tree and a small memory breadcrumb that mostly points to the broader hybrid-RAG train, not this specific Engram pass. Next I’m reading the external repo instructions plus the session-related code paths in `internal/mcp`, `internal/store`, and our own session/save handlers so we can separate new lifecycle findings from the earlier tool-surface findings.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Engram — Agent Skills Index

When working on this project, load the relevant skill(s) BEFORE writing any code.

## How to Use

1. Check the trigger column to find skills that match your current task
2. Load the skill by reading the SKILL.md file at the listed path
3. Follow ALL patterns and rules from the loaded skill
4. Multiple skills can apply simultaneously

## Skills

| Skill | Trigger | Path |
|-------|---------|------|
| `engram-architecture-guardrails` | Any change that affects system boundaries, ownership, state flow, or cross-package responsibilities. | [`skills/architecture-guardrails/SKILL.md`](skills/architecture-guardrails/SKILL.md) |
| `engram-branch-pr` | When creating a pull request, opening a PR, or preparing changes for review. | [`skills/branch-pr/SKILL.md`](skills/branch-pr/SKILL.md) |
| `engram-business-rules` | Any change that affects sync behavior, project controls, permissions, or memory semantics. | [`skills/business-rules/SKILL.md`](skills/business-rules/SKILL.md) |
| `engram-commit-hygiene` | Any commit creation, review, or branch cleanup. | [`skills/commit-hygiene/SKILL.md`](skills/commit-hygiene/SKILL.md) |
| `engram-cultural-norms` | Starting substantial work, reviewing changes, or defining team conventions. | [`skills/cultural-norms/SKILL.md`](skills/cultural-norms/SKILL.md) |
| `engram-dashboard-htmx` | Any change to htmx attributes, partial updates, forms, or server-rendered browser UI. | [`skills/dashboard-htmx/SKILL.md`](skills/dashboard-htmx/SKILL.md) |
| `engram-docs-alignment` | Any code or workflow change that affects user or contributor behavior. | [`skills/docs-alignment/SKILL.md`](skills/docs-alignment/SKILL.md) |
| `engram-issue-creation` | When creating a GitHub issue, reporting a bug, or requesting a feature. | [`skills/issue-creation/SKILL.md`](skills/issue-creation/SKILL.md) |
| `engram-memory-protocol` | Decisions, bugfixes, discoveries, preferences, or session closure. | [`skills/memory-protocol/SKILL.md`](skills/memory-protocol/SKILL.md) |
| `engram-plugin-thin` | Changes in plugin scripts/hooks for Claude, OpenCode, Gemini, or Codex. | [`skills/plugin-thin/SKILL.md`](skills/plugin-thin/SKILL.md) |
| `engram-pr-review-deep` | Reviewing any external or internal contribution before merge. | [`skills/pr-review-deep/SKILL.md`](skills/pr-review-deep/SKILL.md) |
| `engram-project-structure` | Creating files, packages, handlers, templates, styles, or tests in this repo. | [`skills/project-structure/SKILL.md`](skills/project-structure/SKILL.md) |
| `engram-sdd-flow` | When user requests SDD or multi-phase implementation planning. | [`skills/sdd-flow/SKILL.md`](skills/sdd-flow/SKILL.md) |
| `engram-server-api` | Any route, handler, payload, or status code modification. | [`skills/server-api/SKILL.md`](skills/server-api/SKILL.md) |
| `engram-testing-coverage` | When implementing behavior changes in any package. | [`skills/testing-coverage/SKILL.md`](skills/testing-coverage/SKILL.md) |
| `engram-tui-quality` | Changes in model, update, view, navigation, or rendering. | [`skills/tui-quality/SKILL.md`](skills/tui-quality/SKILL.md) |
| `engram-ui-elements` | Adding or changing dashboard UI components or connected browsing flows. | [`skills/ui-elements/SKILL.md`](skills/ui-elements/SKILL.md) |
| `engram-visual-language` | Any dashboard styling, typography, spacing, or visual identity change. | [`skills/visual-language/SKILL.md`](skills/visual-language/SKILL.md) |
| `engram-backlog-triage` | Auditing open issues or PRs, triaging the backlog, or reviewing contributor submissions as a maintainer. | [`skills/backlog-triage/SKILL.md`](skills/backlog-triage/SKILL.md) |
| `gentleman-bubbletea` | When editing Go files in installer/internal/tui/, working on TUI screens, or adding new UI features. | [`skills/gentleman-bubbletea/SKILL.md`](skills/gentleman-bubbletea/SKILL.md) |

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.4.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Deep investigation requiring multiple rounds of discovery
- Topic spans 3+ technical domains or sources
- Initial findings need progressive refinement
- Overnight or unattended research sessions
- Research where prior findings inform subsequent queries

### When NOT to Use

- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

Live lifecycle branches:
- `resume` — continue the active lineage
- `restart` — start a new generation with explicit parent linkage
- `fork` — branch from the current packet state
- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
| ON_DEMAND | Only on explicit request | Templates, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research"]},
    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle"]},
    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
}

NOISY_SYNONYMS = {
    "LOOP_SETUP": {"run research": 2.0, "investigate deeply": 1.8, "overnight research": 1.5},
    "ITERATION": {"another pass": 1.5, "keep searching": 1.4, "dig deeper": 1.6},
    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
}

RESOURCE_MAP = {
    "LOOP_SETUP": ["references/loop_protocol.md", "references/state_format.md", "assets/deep_research_config.json"],
    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
    "CONVERGENCE": ["references/convergence.md"],
    "STATE": ["references/state_format.md", "assets/deep_research_strategy.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active

def discover_markdown_resources(base_path: Path) -> list[str]:
    """Discover all .md files in the assets directory."""
    return sorted(str(p.relative_to(base_path)) for p in (base_path / "references").glob("*.md"))
```

### Phase Detection

Detect the current research phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists | Loop protocol, state format |
| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Quick reference |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-research "topic"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-research command│  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (final output)     │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-research (LEAF agent)  │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE research cycle  │
    │  - Writes: findings + state      │
    │  - Tools: WebFetch, Grep, etc.  │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-research-config.json       │  Persists across iterations
    │  deep-research-state.jsonl      │
    │  deep-research-strategy.md      │
    │  findings-registry.json          │
    │  research/iterations/iteration-NNN.md │
    │  research/research.md (workflow-owned │
    │  progressive synthesis)         │
    └─────────────────────────────────┘
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.

Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-research
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Determine focus
  |                                         3. Research (3-5 actions)
  |                                         4. Write iteration-NNN.md
  |                                         5. Update strategy.md
  |                                         6. Append state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile final research/research.md
  |
Save --> generate-context.js --> verify memory artifact
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
| **JSONL log** | Append-only structured log for lineage and iteration data |
| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |

exec
/bin/zsh -lc 'rg -n "mem_session_start|mem_session_end|mem_session_summary|CreateSession|EndSession|FormatContext|AddPrompt|prompts_fts|session_summary|session" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:13:import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:14:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:15:import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:112:  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:185:    extractedAt: state.sessionSummary?.extractedAt ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:490:  let sessionQuality: SessionResumeResult['sessionQuality'];
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:493:      sessionQuality = computeQualityScore().level;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:495:      sessionQuality = 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:527:      source: 'session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:575:      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:595:    ...(sessionQuality ? { sessionQuality } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:33:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:42:} from '../lib/search/session-transition.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:90:  sessionTransition?: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  sessionScope: 'caller' | 'ephemeral';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:180:  sessionLifecycle: SessionLifecycleMetadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:186:  sessionTransition: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:735:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:766:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:800:    sessionTransition: options.sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:827:  // Security: session scope derived from server context, not caller input
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:865:  session: SessionLifecycleResolution,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1004:    sessionLifecycle,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1010:    sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1031:            includeTrace === true ? sessionTransition : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1056:    sessionLifecycle,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1227:    error: sessionScopeError,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1229:  if (sessionScopeError) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1232:      error: sessionScopeError,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1240:  const sessionLifecycle: SessionLifecycleMetadata = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1336:  const sessionTransition = buildSessionTransitionTrace({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1345:  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1359:  if (!sessionStateResult.success) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1418:    // Best-effort session state write — do not fail the handler
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1430:      sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1491:      sessionLifecycle,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1502:      sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:9:// Import working-memory for immediate cleanup on session end (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:20:  sessionTtlMinutes: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:67:    sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:80:  sessionStateDeleted: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:85:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:124:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:135:  sessions: InterruptedSession[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:153:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:179: * - Cap at 100 entries per session
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:182:  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:193:// Track periodic cleanup interval for expired sessions
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:197:// Track stale session cleanup interval (runs hourly)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:204:    console.error('[session-manager] WARNING: init() called with null database');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:226:      console.warn(`[session-manager] Periodic cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:234:  // Run stale session cleanup on startup and set up hourly interval
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:239:    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:250:      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:277:function hasSessionStateRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:278:  if (!db || !hasTable('session_state')) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:282:      'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:283:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:287:    console.warn(`[session-manager] hasSessionStateRecord failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:292:function hasSentMemoryRecord(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:293:  if (!db || !hasTable('session_sent_memories')) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:297:      'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:298:    ).get(sessionId) as { 1?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:302:    console.warn(`[session-manager] hasSentMemoryRecord failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:307:function isTrackedSession(sessionId: string): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:308:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:312:  const normalizedSessionId = sessionId.trim();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:317:  return workingMemory.sessionExists(normalizedSessionId)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:330:function getSessionIdentityRecord(sessionId: string): {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:335:  if (!db || !hasTable('session_state')) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:341:    FROM session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:342:    WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:344:  `).get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:442:  CREATE TABLE IF NOT EXISTS session_sent_memories (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:443:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:447:    PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:452:  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:453:  'CREATE INDEX IF NOT EXISTS idx_session_sent_time ON session_sent_memories(sent_at);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:469:    console.error(`[session-manager] Schema creation failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:508:function shouldSendMemory(sessionId: string, memory: MemoryInput | number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:512:    console.warn(`[session-manager] Database not initialized. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} memory.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:515:  if (!sessionId || typeof sessionId !== 'string') return true;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:522:      SELECT 1 FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:523:      WHERE session_id = ? AND memory_hash = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:526:    const exists = stmt.get(sessionId, hash);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:530:    console.warn(`[session-manager] shouldSendMemory check failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:536:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:542:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(memories)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:553:    console.warn(`[session-manager] Database not initialized for batch dedup. dbUnavailableMode=${SESSION_CONFIG.dbUnavailableMode}. ${allow ? 'Allowing' : 'Blocking'} batch.`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:565:      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:568:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:573:      const existingRows = existingStmt.all(sessionId) as { memory_hash: string }[];
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:580:          const insertResult = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:594:        enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:623:    console.warn(`[session-manager] shouldSendMemoriesBatch failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:634:function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:637:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:638:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:647:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:653:      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:655:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:661:    console.error(`[session-manager] markMemorySent failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:666:function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:669:  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:670:    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:678:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:685:        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:691:      enforceEntryLimit(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:699:    console.error(`[session-manager] markMemoriesSentBatch failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:708:function enforceEntryLimit(sessionId: string): void {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:709:  if (!db || !sessionId) return;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:713:      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:715:    const row = countStmt.get(sessionId) as { count: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:722:      DELETE FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:723:      WHERE session_id = ? AND rowid IN (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:724:        SELECT rowid FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:725:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:730:    deleteStmt.run(sessionId, sessionId, excess);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:733:    console.warn(`[session-manager] enforce_entry_limit failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:741:    const cutoffMs = Date.now() - SESSION_CONFIG.sessionTtlMinutes * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:745:      DELETE FROM session_sent_memories WHERE sent_at < ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:752:    console.error(`[session-manager] cleanup_expired_sessions failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:758: * T302: Clean up stale sessions across all session-related tables.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:762: *   - session_sent_memories: entries with sent_at older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:763: *   - session_state: completed/interrupted sessions older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:766: *   - session_learning records (permanent, never cleaned)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:767: *   - Active sessions (session_state with status='active')
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:773:    return { success: false, workingMemoryDeleted: 0, sentMemoriesDeleted: 0, sessionStateDeleted: 0, errors: ['Database not initialized'] };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:779:  let sessionStateDeleted = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:795:  // 2. Clean stale session_sent_memories entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:797:    const smStmt = db.prepare('DELETE FROM session_sent_memories WHERE sent_at < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:803:      errors.push(`session_sent_memories cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:807:  // 3. Clean completed/interrupted session_state entries (NEVER clean active sessions)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:810:      `DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:813:    sessionStateDeleted = ssResult.changes;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:817:      errors.push(`session_state cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:821:  const totalDeleted = workingMemoryDeleted + sentMemoriesDeleted + sessionStateDeleted;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:824:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:825:      `${sentMemoriesDeleted} sent_memories, ${sessionStateDeleted} session_state entries ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:831:    console.warn(`[session-manager] Stale cleanup had ${errors.length} error(s): ${errors.join('; ')}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:838:    sessionStateDeleted,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:843:function clearSession(sessionId: string): CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:844:  if (!db || !sessionId) return { success: false, deletedCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:848:      DELETE FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:850:    const result = stmt.run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:852:    // Immediately clear working memory for cleared session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:857:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:863:    console.error(`[session-manager] clear_session failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:868:function getSessionStats(sessionId: string): SessionStats {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:869:  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:877:      FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:878:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:880:    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:889:    console.warn(`[session-manager] get_session_stats failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:898:function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:899:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:907:  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:938:function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:939:  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:943:  return markMemoriesSentBatch(sessionId, results);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:959:  CREATE TABLE IF NOT EXISTS session_state (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:960:    session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:974:  'CREATE INDEX IF NOT EXISTS idx_session_state_status ON session_state(status);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:975:  'CREATE INDEX IF NOT EXISTS idx_session_state_updated ON session_state(updated_at);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:976:  'CREATE INDEX IF NOT EXISTS idx_session_state_identity_scope ON session_state(tenant_id, user_id, agent_id);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:980:  { column: 'tenant_id', sql: 'ALTER TABLE session_state ADD COLUMN tenant_id TEXT;' },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:981:  { column: 'user_id', sql: 'ALTER TABLE session_state ADD COLUMN user_id TEXT;' },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:982:  { column: 'agent_id', sql: 'ALTER TABLE session_state ADD COLUMN agent_id TEXT;' },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1003:    const existingColumns = getTableColumns('session_state');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1015:    console.error(`[session-manager] Session state schema creation failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1022:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1023:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1035:      INSERT INTO session_state (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1036:        session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1042:      ON CONFLICT(session_id) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1044:        spec_folder = COALESCE(excluded.spec_folder, session_state.spec_folder),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1045:        current_task = COALESCE(excluded.current_task, session_state.current_task),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1046:        last_action = COALESCE(excluded.last_action, session_state.last_action),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1047:        context_summary = COALESCE(excluded.context_summary, session_state.context_summary),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1048:        pending_work = COALESCE(excluded.pending_work, session_state.pending_work),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1049:        state_data = COALESCE(excluded.state_data, session_state.state_data),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1050:        tenant_id = COALESCE(excluded.tenant_id, session_state.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1051:        user_id = COALESCE(excluded.user_id, session_state.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1052:        agent_id = COALESCE(excluded.agent_id, session_state.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1057:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1074:    console.error(`[session-manager] save_session_state failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1080:  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1084:      UPDATE session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1086:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1088:    stmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1090:    // Immediately clear working memory for completed session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1095:      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1101:    console.error(`[session-manager] complete_session failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1112:      UPDATE session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1121:    console.error(`[session-manager] reset_interrupted_sessions failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1126:function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1128:  if (!sessionId || typeof sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1129:    return { success: false, error: 'Valid sessionId is required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1136:      SELECT session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1140:      FROM session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1141:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1143:    const row = stmt.get(sessionId) as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1156:      return { success: false, error: `sessionId "${sessionId}" is bound to a different ${mismatch}` };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1178:        UPDATE session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1180:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1182:      updateStmt.run(new Date().toISOString(), sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1188:    console.error(`[session-manager] recover_state failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1194:  if (!db) return { success: false, sessions: [], error: 'Database not initialized. Server may still be starting up.' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1199:      SELECT session_id, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1202:      FROM session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1218:      sessions: filteredRows.map((row) => ({
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1230:    console.error(`[session-manager] get_interrupted_sessions failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1231:    return { success: false, sessions: [], error: message };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1239:function generateContinueSessionMd(sessionState: ContinueSessionInput): string {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1241:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1248:  } = sessionState;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1262:    : sessionId
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1269:> **Purpose:** Enable seamless session recovery after context compaction, crashes, or breaks.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1278:| **Session ID** | \`${sessionId || 'N/A'}\` |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1301:To continue this session, use:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1318:*This file is auto-generated on session checkpoint. It provides a human-readable recovery mechanism alongside SQLite persistence.*
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1324:function writeContinueSessionMd(sessionId: string, specFolderPath: string): CheckpointResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1325:  if (!sessionId || !specFolderPath) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1326:    return { success: false, error: 'sessionId and specFolderPath are required' };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1330:    const recoverResult = recoverState(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1333:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1349:    console.error(`[session-manager] write_continue_session_md failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1355:  sessionId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1366:    return writeContinueSessionMd(sessionId, folderPath);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:57:const collect_session_data_1 = require("../extractors/collect-session-data");
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:70:  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:72:  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:87:  - The AI has strictly better information about its own session than any DB query can reconstruct.
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:95:JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:349:        sessionId: null,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:356:    // Extract --session-id <uuid> from argv before positional parsing
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:357:    let sessionId = null;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:360:        if (argv[i] === '--session-id') {
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:363:                throw new Error('--session-id requires a non-empty value');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:365:            sessionId = candidate.trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:373:        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:377:        return { ...structured, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:388:        sessionId,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:513:            collectSessionDataFn: collect_session_data_1.collectSessionData,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:514:            sessionId: parsed.sessionId ?? undefined,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:519:        const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:9:import { handleSessionHealth } from './session-health.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:10:import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:11:import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:12:import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:182:  // Sub-call 2: session_health
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191:    allHints.push('session_health failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:264:      source: 'session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:290:      source: 'session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:11: *   Uses `ensureSession()` before any DB write. This means sessions are
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:12: *   created on-demand — even if the plugin was loaded after the session
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:13: *   started (restart, reconnect, etc.). The session ID comes from OpenCode's
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:14: *   hooks (input.sessionID) rather than relying on a session.created event.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:25:// Engram's own MCP tools — don't count these as "tool calls" for session stats
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:33:  "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:38:  "mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:39:  "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:47:You have access to Engram, a persistent memory system that survives across sessions and compactions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:80:1. First call \`mem_context\` — checks recent session history (fast, cheap)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:86:- The user mentions a topic you have no context on — check if past sessions covered it
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:91:Before ending a session or saying "done" / "listo" / "that's it", you MUST:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:92:1. Call \`mem_session_summary\` with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:95:[What we were working on this session]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:107:- [What remains to be done — for the next session]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:112:This is NOT optional. If you skip this, the next session starts blind.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:117:1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:118:2. Then call \`mem_context\` to recover any additional context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:203:  // Track tool counts per session (in-memory only, not critical)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:206:  // Track which sessions we've already ensured exist in engram
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:209:  // Track sub-agent session IDs so we can suppress their tool-hook registrations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:211:  // We must not register them as top-level Engram sessions — they cause session
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:212:  // inflation (e.g. 170 sessions for 1 real conversation, issue #116).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:216:   * Ensure a session exists in engram. Idempotent — calls POST /sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:219:   * Silently skips sub-agent sessions (tracked in `subAgentSessions`).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:221:  async function ensureSession(sessionId: string): Promise<void> {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:222:    if (!sessionId || knownSessions.has(sessionId)) return
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:223:    // Do not register sub-agent sessions in Engram (issue #116).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:224:    if (subAgentSessions.has(sessionId)) return
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:225:    knownSessions.add(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:226:    await engramFetch("/sessions", {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:229:        id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:284:      if (event.type === "session.created") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:285:        // Bug fix (#116): session data is nested under event.properties.info,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:288:        const sessionId = info?.id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:292:        // Sub-agent sessions (created via Task()) must NOT be registered as
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:293:        // top-level Engram sessions. They cause massive session inflation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:294:        // (e.g. 170 sessions for 1 real conversation).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:297:        //   - parentID is set on all Task() sub-agent sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:301:        if (sessionId && !isSubAgent) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:302:          await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:303:        } else if (sessionId && isSubAgent) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:304:          // Remember this as a sub-agent session so tool-hook calls
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:306:          subAgentSessions.add(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:311:      if (event.type === "session.deleted") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:312:        // Same properties.info path as session.created.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:314:        const sessionId = info?.id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:315:        if (sessionId) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:316:          toolCounts.delete(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:317:          knownSessions.delete(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:318:          subAgentSessions.delete(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:326:    // input.sessionID is always reliable here (no knownSessions workaround).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:331:      // Skip sub-agent sessions — they inflate session counts (issue #116)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:332:      if (subAgentSessions.has(input.sessionID)) return
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:334:      const sessionId = input.sessionID
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:352:        await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:356:            session_id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:365:    // Count tool calls per session (for session end stats).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:366:    // Also ensures the session exists — handles plugin reload / reconnect.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:373:      // input.sessionID comes from OpenCode — always available
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:374:      const sessionId = input.sessionID
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:375:      if (sessionId) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:376:        await ensureSession(sessionId)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:377:        toolCounts.set(sessionId, (toolCounts.get(sessionId) ?? 0) + 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:381:      if (input.tool === "Task" && output && sessionId) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:387:              session_id: sessionId,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:419:    // 1. Auto-save a session checkpoint (the agent can't do this itself)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:420:    // 2. Inject context from previous sessions into the compaction prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:423:    "experimental.session.compacting": async (input, output) => {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:424:      if (input.sessionID) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:425:        await ensureSession(input.sessionID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:428:      // Inject context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:438:      // summary and this instruction, then saves it as a session summary.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts:443:        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:101:	s.mux.HandleFunc("POST /sessions", s.handleCreateSession)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:102:	s.mux.HandleFunc("POST /sessions/{id}/end", s.handleEndSession)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:103:	s.mux.HandleFunc("GET /sessions/recent", s.handleRecentSessions)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:120:	s.mux.HandleFunc("POST /prompts", s.handleAddPrompt)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:151:func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:166:	if err := s.store.CreateSession(body.ID, body.Project, body.Directory); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:175:func (s *Server) handleEndSession(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:183:	if err := s.store.EndSession(id, body.Summary); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:196:	sessions, err := s.store.RecentSessions(project, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:202:	jsonResponse(w, http.StatusOK, sessions)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:212:		jsonError(w, http.StatusBadRequest, "session_id, title, and content are required")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:233:		jsonError(w, http.StatusBadRequest, "session_id is required")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:377:func (s *Server) handleAddPrompt(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:378:	var body store.AddPromptParams
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:384:		jsonError(w, http.StatusBadRequest, "session_id and content are required")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:388:	id, err := s.store.AddPrompt(body)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:477:	context, err := s.store.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:551:	log.Printf("[engram] migrated project %q → %q (obs: %d, sessions: %d, prompts: %d)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:560:		"sessions":     result.SessionsUpdated,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:40:// "agent" — tools AI agents use during coding sessions:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:42://   mem_session_start, mem_session_end, mem_get_observation,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:58:	"mem_session_start":     true, // register session start
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:59:	"mem_session_end":       true, // mark session completed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:124:const serverInstructions = `Engram provides persistent memory that survives across sessions and compactions.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:128:  mem_search — find past work, decisions, or context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:129:  mem_context — get recent session history (call at session start or after compaction)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:174:				mcp.WithDescription("Search your persistent memory across all sessions. Use this to find past decisions, bugs fixed, patterns used, files changed, or any context from previous coding sessions."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:229:  title: "Switched from sessions to JWT"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:231:  content: "**What**: Replaced express-session with jsonwebtoken for auth\n**Why**: Session storage doesn't scale across multiple instances\n**Where**: src/middleware/auth.ts, src/routes/login.ts\n**Learned**: Must set httpOnly and secure flags on the cookie, refresh tokens need separate rotation logic"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:247:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:354:				mcp.WithDescription("Save a user prompt to persistent memory. Use this to record what the user asked — their intent, questions, and requests — so future sessions have context about the user's goals."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:364:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:379:				mcp.WithDescription("Get recent memory context from previous sessions. Shows recent sessions and observations to understand what was done before."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:403:				mcp.WithDescription("Show memory system statistics — total sessions, observations, and projects tracked."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:461:	if shouldRegister("mem_session_summary", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:463:			mcp.NewTool("mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:469:				mcp.WithDescription(`Save a comprehensive end-of-session summary. Call this when a session is ending or when significant work is complete. This creates a structured summary that future sessions will use to understand what happened.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:474:[One sentence: what were we building/working on in this session]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:477:[User preferences, constraints, or context discovered during this session. Things a future agent needs to know about HOW the user wants things done. Skip if nothing notable.]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:487:- 🔲 [Identified but not yet done — for next session]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:501:					mcp.Description("Full session summary using the Goal/Instructions/Discoveries/Accomplished/Files format"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:503:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:516:	if shouldRegister("mem_session_start", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:518:			mcp.NewTool("mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:519:				mcp.WithDescription("Register the start of a new coding session. Call this at the beginning of a session to track activity."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:528:					mcp.Description("Unique session identifier"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:543:	if shouldRegister("mem_session_end", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:545:			mcp.NewTool("mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:546:				mcp.WithDescription("Mark a coding session as completed with an optional summary."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:584:				mcp.WithString("session_id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:591:					mcp.Description("Source identifier (e.g. 'subagent-stop', 'session-end')"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:685:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:701:		if sessionID == "" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:702:			sessionID = defaultSessionID(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:728:		// Ensure the session exists
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:729:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:734:			SessionID: sessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:854:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:863:		if sessionID == "" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:864:			sessionID = defaultSessionID(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:867:		// Ensure the session exists
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:868:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:870:		_, err := s.AddPrompt(store.AddPromptParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:871:			SessionID: sessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:894:		context, err := s.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:900:			return mcp.NewToolResultText("No previous session memories found."), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:911:		result := fmt.Sprintf("%s\n---\nMemory stats: %d sessions, %d observations across projects: %s",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:962:			fmt.Fprintf(&b, "Total observations in session: %d\n\n", result.TotalInRange)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1033:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1042:		if sessionID == "" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1043:			sessionID = defaultSessionID(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1046:		// Ensure the session exists
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1047:		s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1050:			SessionID: sessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1051:			Type:      "session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1057:			return mcp.NewToolResultError("Failed to save session summary: " + err.Error()), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1076:		if err := s.CreateSession(id, project, directory); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1077:			return mcp.NewToolResultError("Failed to start session: " + err.Error()), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1089:		if err := s.EndSession(id, summary); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1090:			return mcp.NewToolResultError("Failed to end session: " + err.Error()), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1100:		sessionID, _ := req.GetArguments()["session_id"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1114:		if sessionID == "" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1115:			sessionID = defaultSessionID(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1116:			_ = s.CreateSession(sessionID, project, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1124:			SessionID: sessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1177:// defaultSessionID returns a project-scoped default session ID.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:4:// observations from AI coding sessions. This is the core of Engram —
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:41:	SessionID      string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:72:	TotalSessions     int      `json:"total_sessions"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:80:	SessionID      string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:101:	SessionInfo  *Session        `json:"session_info"` // Session that contains the focus observation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:113:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:135:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:141:type AddPromptParams struct {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:142:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:156:	SyncEntitySession     = "session"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:210:	SessionID  string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:225:	SessionID string  `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:234:	Sessions     []Session     `json:"sessions"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:441:			CREATE TABLE IF NOT EXISTS sessions (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:453:				session_id TEXT    NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:468:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:471:		CREATE INDEX IF NOT EXISTS idx_obs_session  ON observations(session_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:490:				session_id TEXT    NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:494:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:497:		CREATE INDEX IF NOT EXISTS idx_prompts_session ON user_prompts(session_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501:		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:679:				INSERT INTO prompts_fts(rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:684:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:689:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:691:				INSERT INTO prompts_fts(rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754:func (s *Store) CreateSession(id, project, directory string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:770:func (s *Store) EndSession(id string, summary string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:773:			`UPDATE sessions SET ended_at = datetime('now'), summary = ? WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:791:			`SELECT project, directory, ended_at, summary FROM sessions WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:809:		`SELECT id, project, directory, started_at, ended_at, summary FROM sessions WHERE id = ?`, id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:829:		FROM sessions s
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:830:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:860:// AllSessions returns recent sessions ordered by most recent first (for TUI browsing).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:869:		FROM sessions s
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:870:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:907:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:929:// SessionObservations returns all observations for a specific session.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:930:func (s *Store) SessionObservations(sessionID string, limit int) ([]Observation, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:936:		SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:939:		WHERE session_id = ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:943:	return s.queryObservations(query, sessionID, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1085:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1109:func (s *Store) AddPrompt(p AddPromptParams) (int64, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1122:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1153:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1189:		SELECT p.id, ifnull(p.sync_id, '') as sync_id, p.session_id, p.content, ifnull(p.project, '') as project, p.created_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1190:		FROM prompts_fts fts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1192:		WHERE prompts_fts MATCH ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1225:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1356:// all within the same session. This is the "progressive disclosure" pattern
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1374:	// 2. Get session info
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1375:	session, err := s.GetSession(focus.SessionID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1378:		session = nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1381:	// 3. Get observations BEFORE the focus (same session, older, chronological order)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1383:		SELECT id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1386:		WHERE session_id = ? AND id < ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1415:	// 4. Get observations AFTER the focus (same session, newer, chronological order)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1417:		SELECT id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1420:		WHERE session_id = ? AND id > ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1445:	// 5. Count total observations in the session for context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1448:		"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1455:		SessionInfo:  session,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1477:			SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1522:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1591:	s.db.QueryRow("SELECT COUNT(*) FROM sessions").Scan(&stats.TotalSessions)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613:func (s *Store) FormatContext(project, scope string) (string, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1614:	sessions, err := s.RecentSessions(project, 5)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1629:	if len(sessions) == 0 && len(observations) == 0 && len(prompts) == 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1636:	if len(sessions) > 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1638:		for _, sess := range sessions {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1679:		"SELECT id, project, directory, started_at, ended_at, summary FROM sessions ORDER BY started_at",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1682:		return nil, fmt.Errorf("export sessions: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1698:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1723:		"SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts ORDER BY id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1752:	// Import sessions (skip duplicates)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1755:			`INSERT OR IGNORE INTO sessions (id, project, directory, started_at, ended_at, summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1760:			return nil, fmt.Errorf("import session %s: %w", sess.ID, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1797:			`INSERT INTO user_prompts (sync_id, session_id, content, project, created_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1815:	SessionsImported     int `json:"sessions_imported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2123:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2217:	SessionsUpdated     int64 `json:"sessions_updated"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2232:			SELECT 1 FROM sessions WHERE project = ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2254:		res, err = s.execHook(tx, `UPDATE sessions SET project = ? WHERE project = ?`, newName, oldName)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2256:			return fmt.Errorf("migrate sessions: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2313:	SessionCount     int      `json:"session_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2315:	Directories      []string `json:"directories"` // unique directories from sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2349:		 FROM sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2354:		return nil, fmt.Errorf("list projects sessions: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2451:	SessionsUpdated     int64    `json:"sessions_updated"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2481:			res, err = s.execHook(tx, `UPDATE sessions SET project = ? WHERE project = ?`, canonical, src)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2483:				return fmt.Errorf("merge sessions %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2513:	SessionsDeleted int64  `json:"sessions_deleted"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2517:// PruneProject removes all sessions and prompts for a project that has zero
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2543:		res, err = s.execHook(tx, `DELETE FROM sessions WHERE project = ?`, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2545:			return fmt.Errorf("prune sessions: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2574:		`INSERT INTO sessions (id, project, directory) VALUES (?, ?, ?)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2576:		   project   = CASE WHEN sessions.project = '' THEN excluded.project ELSE sessions.project END,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2577:		   directory = CASE WHEN sessions.directory = '' THEN excluded.directory ELSE sessions.directory END`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2665:		FROM sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2672:			  AND sm.entity_key = sessions.id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2731:		SELECT sync_id, session_id, content, project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2845:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2857:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2888:		`INSERT INTO sessions (id, project, directory, ended_at, summary)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2893:		   ended_at = COALESCE(excluded.ended_at, sessions.ended_at),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2894:		   summary = COALESCE(excluded.summary, sessions.summary)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2951:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2960:		`UPDATE user_prompts SET session_id = ?, content = ?, project = ? WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3058:			session_id TEXT    NOT NULL,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3073:			FOREIGN KEY (session_id) REFERENCES sessions(id)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3081:			id, sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3092:			session_id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3200:// a normalized segment from title/content for stable cross-session keys.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3246:	case "session_summary":
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3247:		return "session"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3398:	SessionID string `json:"session_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3401:	Source    string `json:"source,omitempty"` // e.g. "subagent-stop", "session-end"

web search: 
web search: 
codex
I’ve confirmed the external repo’s own instructions are about loading skills before writing code, which doesn’t materially affect this read-only pass. I’m now pulling exact line ranges for Engram’s session start/end/summary wiring and our `session_resume` / `memory_context` path so the next step is evidence, not prose.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '280,420p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '620,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280						mcp.Description("New title"),
   281					),
   282					mcp.WithString("content",
   283						mcp.Description("New content"),
   284					),
   285					mcp.WithString("type",
   286						mcp.Description("New type/category"),
   287					),
   288					mcp.WithString("project",
   289						mcp.Description("New project value"),
   290					),
   291					mcp.WithString("scope",
   292						mcp.Description("New scope: project or personal"),
   293					),
   294					mcp.WithString("topic_key",
   295						mcp.Description("New topic key (normalized internally)"),
   296					),
   297				),
   298				handleUpdate(s),
   299			)
   300		}
   301	
   302		// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
   303		if shouldRegister("mem_suggest_topic_key", allowlist) {
   304			srv.AddTool(
   305				mcp.NewTool("mem_suggest_topic_key",
   306					mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
   307					mcp.WithDeferLoading(true),
   308					mcp.WithTitleAnnotation("Suggest Topic Key"),
   309					mcp.WithReadOnlyHintAnnotation(true),
   310					mcp.WithDestructiveHintAnnotation(false),
   311					mcp.WithIdempotentHintAnnotation(true),
   312					mcp.WithOpenWorldHintAnnotation(false),
   313					mcp.WithString("type",
   314						mcp.Description("Observation type/category, e.g. architecture, decision, bugfix"),
   315					),
   316					mcp.WithString("title",
   317						mcp.Description("Observation title (preferred input for stable keys)"),
   318					),
   319					mcp.WithString("content",
   320						mcp.Description("Observation content used as fallback if title is empty"),
   321					),
   322				),
   323				handleSuggestTopicKey(),
   324			)
   325		}
   326	
   327		// ─── mem_delete (profile: admin, deferred) ──────────────────────────
   328		if shouldRegister("mem_delete", allowlist) {
   329			srv.AddTool(
   330				mcp.NewTool("mem_delete",
   331					mcp.WithDescription("Delete an observation by ID. Soft-delete by default; set hard_delete=true for permanent deletion."),
   332					mcp.WithDeferLoading(true),
   333					mcp.WithTitleAnnotation("Delete Memory"),
   334					mcp.WithReadOnlyHintAnnotation(false),
   335					mcp.WithDestructiveHintAnnotation(true),
   336					mcp.WithIdempotentHintAnnotation(false),
   337					mcp.WithOpenWorldHintAnnotation(false),
   338					mcp.WithNumber("id",
   339						mcp.Required(),
   340						mcp.Description("Observation ID to delete"),
   341					),
   342					mcp.WithBoolean("hard_delete",
   343						mcp.Description("If true, permanently deletes the observation"),
   344					),
   345				),
   346				handleDelete(s),
   347			)
   348		}
   349	
   350		// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
   351		if shouldRegister("mem_save_prompt", allowlist) {
   352			srv.AddTool(
   353				mcp.NewTool("mem_save_prompt",
   354					mcp.WithDescription("Save a user prompt to persistent memory. Use this to record what the user asked — their intent, questions, and requests — so future sessions have context about the user's goals."),
   355					mcp.WithTitleAnnotation("Save User Prompt"),
   356					mcp.WithReadOnlyHintAnnotation(false),
   357					mcp.WithDestructiveHintAnnotation(false),
   358					mcp.WithIdempotentHintAnnotation(false),
   359					mcp.WithOpenWorldHintAnnotation(false),
   360					mcp.WithString("content",
   361						mcp.Required(),
   362						mcp.Description("The user's prompt text"),
   363					),
   364					mcp.WithString("session_id",
   365						mcp.Description("Session ID to associate with (default: manual-save-{project})"),
   366					),
   367					mcp.WithString("project",
   368						mcp.Description("Project name"),
   369					),
   370				),
   371				handleSavePrompt(s, cfg),
   372			)
   373		}
   374	
   375		// ─── mem_context (profile: agent, core — always in context) ────────
   376		if shouldRegister("mem_context", allowlist) {
   377			srv.AddTool(
   378				mcp.NewTool("mem_context",
   379					mcp.WithDescription("Get recent memory context from previous sessions. Shows recent sessions and observations to understand what was done before."),
   380					mcp.WithTitleAnnotation("Get Memory Context"),
   381					mcp.WithReadOnlyHintAnnotation(true),
   382					mcp.WithDestructiveHintAnnotation(false),
   383					mcp.WithIdempotentHintAnnotation(true),
   384					mcp.WithOpenWorldHintAnnotation(false),
   385					mcp.WithString("project",
   386						mcp.Description("Filter by project (omit for all projects)"),
   387					),
   388					mcp.WithString("scope",
   389						mcp.Description("Filter observations by scope: project (default) or personal"),
   390					),
   391					mcp.WithNumber("limit",
   392						mcp.Description("Number of observations to retrieve (default: 20)"),
   393					),
   394				),
   395				handleContext(s, cfg),
   396			)
   397		}
   398	
   399		// ─── mem_stats (profile: admin, deferred) ───────────────────────────
   400		if shouldRegister("mem_stats", allowlist) {
   401			srv.AddTool(
   402				mcp.NewTool("mem_stats",
   403					mcp.WithDescription("Show memory system statistics — total sessions, observations, and projects tracked."),
   404					mcp.WithDeferLoading(true),
   405					mcp.WithTitleAnnotation("Memory Stats"),
   406					mcp.WithReadOnlyHintAnnotation(true),
   407					mcp.WithDestructiveHintAnnotation(false),
   408					mcp.WithIdempotentHintAnnotation(true),
   409					mcp.WithOpenWorldHintAnnotation(false),
   410				),
   411				handleStats(s),
   412			)
   413		}
   414	
   415		// ─── mem_timeline (profile: admin, deferred) ────────────────────────
   416		if shouldRegister("mem_timeline", allowlist) {
   417			srv.AddTool(
   418				mcp.NewTool("mem_timeline",
   419					mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
   420					mcp.WithDeferLoading(true),
   620		}
   621	}
   622	
   623	// ─── Tool Handlers ───────────────────────────────────────────────────────────
   624	
   625	func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   626		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   627			query, _ := req.GetArguments()["query"].(string)
   628			typ, _ := req.GetArguments()["type"].(string)
   629			project, _ := req.GetArguments()["project"].(string)
   630			scope, _ := req.GetArguments()["scope"].(string)
   631			limit := intArg(req, "limit", 10)
   632	
   633			// Apply default project when LLM sends empty
   634			if project == "" {
   635				project = cfg.DefaultProject
   636			}
   637			// Normalize project name
   638			project, _ = store.NormalizeProject(project)
   639	
   640			results, err := s.Search(query, store.SearchOptions{
   641				Type:    typ,
   642				Project: project,
   643				Scope:   scope,
   644				Limit:   limit,
   645			})
   646			if err != nil {
   647				return mcp.NewToolResultError(fmt.Sprintf("Search error: %s. Try simpler keywords.", err)), nil
   648			}
   649	
   650			if len(results) == 0 {
   651				return mcp.NewToolResultText(fmt.Sprintf("No memories found for: %q", query)), nil
   652			}
   653	
   654			var b strings.Builder
   655			fmt.Fprintf(&b, "Found %d memories:\n\n", len(results))
   656			anyTruncated := false
   657			for i, r := range results {
   658				projectDisplay := ""
   659				if r.Project != nil {
   660					projectDisplay = fmt.Sprintf(" | project: %s", *r.Project)
   661				}
   662				preview := truncate(r.Content, 300)
   663				if len(r.Content) > 300 {
   664					anyTruncated = true
   665					preview += " [preview]"
   666				}
   667				fmt.Fprintf(&b, "[%d] #%d (%s) — %s\n    %s\n    %s%s | scope: %s\n\n",
   668					i+1, r.ID, r.Type, r.Title,
   669					preview,
   670					r.CreatedAt, projectDisplay, r.Scope)
   671			}
   672			if anyTruncated {
   673				fmt.Fprintf(&b, "---\nResults above are previews (300 chars). To read the full content of a specific memory, call mem_get_observation(id: <ID>).\n")
   674			}
   675	
   676			return mcp.NewToolResultText(b.String()), nil
   677		}
   678	}
   679	
   680	func handleSave(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   681		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   682			title, _ := req.GetArguments()["title"].(string)
   683			content, _ := req.GetArguments()["content"].(string)
   684			typ, _ := req.GetArguments()["type"].(string)
   685			sessionID, _ := req.GetArguments()["session_id"].(string)
   686			project, _ := req.GetArguments()["project"].(string)
   687			scope, _ := req.GetArguments()["scope"].(string)
   688			topicKey, _ := req.GetArguments()["topic_key"].(string)
   689	
   690			// Apply default project when LLM sends empty
   691			if project == "" {
   692				project = cfg.DefaultProject
   693			}
   694			// Normalize project name and capture warning
   695			normalized, normWarning := store.NormalizeProject(project)
   696			project = normalized
   697	
   698			if typ == "" {
   699				typ = "manual"
   700			}
   701			if sessionID == "" {
   702				sessionID = defaultSessionID(project)
   703			}
   704			suggestedTopicKey := suggestTopicKey(typ, title, content)
   705	
   706			// Check for similar existing projects (only when this project has no existing observations)
   707			var similarWarning string
   708			if project != "" {
   709				existingNames, _ := s.ListProjectNames()
   710				isNew := true
   711				for _, e := range existingNames {
   712					if e == project {
   713						isNew = false
   714						break
   715					}
   716				}
   717				if isNew && len(existingNames) > 0 {
   718					matches := projectpkg.FindSimilar(project, existingNames, 3)
   719					if len(matches) > 0 {
   720						bestMatch := matches[0].Name
   721						// Cheap count query instead of full ListProjectsWithStats
   722						obsCount, _ := s.CountObservationsForProject(bestMatch)
   723						similarWarning = fmt.Sprintf("⚠️ Project %q has no memories. Similar project found: %q (%d memories). Consider using that name instead.", project, bestMatch, obsCount)
   724					}
   725				}
   726			}
   727	
   728			// Ensure the session exists
   729			s.CreateSession(sessionID, project, "")
   730	
   731			truncated := len(content) > s.MaxObservationLength()
   732	
   733			_, err := s.AddObservation(store.AddObservationParams{
   734				SessionID: sessionID,
   735				Type:      typ,
   736				Title:     title,
   737				Content:   content,
   738				Project:   project,
   739				Scope:     scope,
   740				TopicKey:  topicKey,
   741			})
   742			if err != nil {
   743				return mcp.NewToolResultError("Failed to save: " + err.Error()), nil
   744			}
   745	
   746			msg := fmt.Sprintf("Memory saved: %q (%s)", title, typ)
   747			if topicKey == "" && suggestedTopicKey != "" {
   748				msg += fmt.Sprintf("\nSuggested topic_key: %s", suggestedTopicKey)
   749			}
   750			if truncated {
   751				msg += fmt.Sprintf("\n⚠ WARNING: Content was truncated from %d to %d chars. Consider splitting into smaller observations.", len(content), s.MaxObservationLength())
   752			}
   753			if normWarning != "" {
   754				msg += "\n" + normWarning
   755			}
   756			if similarWarning != "" {
   757				msg += "\n" + similarWarning
   758			}
   759			return mcp.NewToolResultText(msg), nil
   760		}
   761	}
   762	
   763	func handleSuggestTopicKey() server.ToolHandlerFunc {
   764		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   765			typ, _ := req.GetArguments()["type"].(string)
   766			title, _ := req.GetArguments()["title"].(string)
   767			content, _ := req.GetArguments()["content"].(string)
   768	
   769			if strings.TrimSpace(title) == "" && strings.TrimSpace(content) == "" {
   770				return mcp.NewToolResultError("provide title or content to suggest a topic_key"), nil
   771			}
   772	
   773			topicKey := suggestTopicKey(typ, title, content)
   774			if topicKey == "" {
   775				return mcp.NewToolResultError("could not suggest topic_key from input"), nil
   776			}
   777	
   778			return mcp.NewToolResultText(fmt.Sprintf("Suggested topic_key: %s", topicKey)), nil
   779		}
   780	}
   781	
   782	func handleUpdate(s *store.Store) server.ToolHandlerFunc {
   783		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   784			id := int64(intArg(req, "id", 0))
   785			if id == 0 {
   786				return mcp.NewToolResultError("id is required"), nil
   787			}
   788	
   789			update := store.UpdateObservationParams{}
   790			if v, ok := req.GetArguments()["title"].(string); ok {
   791				update.Title = &v
   792			}
   793			if v, ok := req.GetArguments()["content"].(string); ok {
   794				update.Content = &v
   795			}
   796			if v, ok := req.GetArguments()["type"].(string); ok {
   797				update.Type = &v
   798			}
   799			if v, ok := req.GetArguments()["project"].(string); ok {
   800				update.Project = &v
   801			}
   802			if v, ok := req.GetArguments()["scope"].(string); ok {
   803				update.Scope = &v
   804			}
   805			if v, ok := req.GetArguments()["topic_key"].(string); ok {
   806				update.TopicKey = &v
   807			}
   808	
   809			if update.Title == nil && update.Content == nil && update.Type == nil && update.Project == nil && update.Scope == nil && update.TopicKey == nil {
   810				return mcp.NewToolResultError("provide at least one field to update"), nil
   811			}
   812	
   813			var contentLen int
   814			if update.Content != nil {
   815				contentLen = len(*update.Content)
   816			}
   817	
   818			obs, err := s.UpdateObservation(id, update)
   819			if err != nil {
   820				return mcp.NewToolResultError("Failed to update memory: " + err.Error()), nil
   821			}
   822	
   823			msg := fmt.Sprintf("Memory updated: #%d %q (%s, scope=%s)", obs.ID, obs.Title, obs.Type, obs.Scope)
   824			if contentLen > s.MaxObservationLength() {
   825				msg += fmt.Sprintf("\n⚠ WARNING: Content was truncated from %d to %d chars. Consider splitting into smaller observations.", contentLen, s.MaxObservationLength())
   826			}
   827			return mcp.NewToolResultText(msg), nil
   828		}
   829	}
   830	
   831	func handleDelete(s *store.Store) server.ToolHandlerFunc {
   832		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   833			id := int64(intArg(req, "id", 0))
   834			if id == 0 {
   835				return mcp.NewToolResultError("id is required"), nil
   836			}
   837	
   838			hardDelete := boolArg(req, "hard_delete", false)
   839			if err := s.DeleteObservation(id, hardDelete); err != nil {
   840				return mcp.NewToolResultError("Failed to delete memory: " + err.Error()), nil
   841			}
   842	
   843			mode := "soft-deleted"
   844			if hardDelete {
   845				mode = "permanently deleted"
   846			}
   847			return mcp.NewToolResultText(fmt.Sprintf("Memory #%d %s", id, mode)), nil
   848		}
   849	}
   850	
   851	func handleSavePrompt(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   852		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   853			content, _ := req.GetArguments()["content"].(string)
   854			sessionID, _ := req.GetArguments()["session_id"].(string)
   855			project, _ := req.GetArguments()["project"].(string)
   856	
   857			// Apply default project when LLM sends empty
   858			if project == "" {
   859				project = cfg.DefaultProject
   860			}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '80,260p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '430,620p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1080,1225p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    80		SessionID      string  `json:"session_id"`
    81		Type           string  `json:"type"`
    82		Title          string  `json:"title"`
    83		Content        string  `json:"content"`
    84		ToolName       *string `json:"tool_name,omitempty"`
    85		Project        *string `json:"project,omitempty"`
    86		Scope          string  `json:"scope"`
    87		TopicKey       *string `json:"topic_key,omitempty"`
    88		RevisionCount  int     `json:"revision_count"`
    89		DuplicateCount int     `json:"duplicate_count"`
    90		LastSeenAt     *string `json:"last_seen_at,omitempty"`
    91		CreatedAt      string  `json:"created_at"`
    92		UpdatedAt      string  `json:"updated_at"`
    93		DeletedAt      *string `json:"deleted_at,omitempty"`
    94		IsFocus        bool    `json:"is_focus"` // true for the anchor observation
    95	}
    96	
    97	type TimelineResult struct {
    98		Focus        Observation     `json:"focus"`        // The anchor observation
    99		Before       []TimelineEntry `json:"before"`       // Observations before the focus (chronological)
   100		After        []TimelineEntry `json:"after"`        // Observations after the focus (chronological)
   101		SessionInfo  *Session        `json:"session_info"` // Session that contains the focus observation
   102		TotalInRange int             `json:"total_in_range"`
   103	}
   104	
   105	type SearchOptions struct {
   106		Type    string `json:"type,omitempty"`
   107		Project string `json:"project,omitempty"`
   108		Scope   string `json:"scope,omitempty"`
   109		Limit   int    `json:"limit,omitempty"`
   110	}
   111	
   112	type AddObservationParams struct {
   113		SessionID string `json:"session_id"`
   114		Type      string `json:"type"`
   115		Title     string `json:"title"`
   116		Content   string `json:"content"`
   117		ToolName  string `json:"tool_name,omitempty"`
   118		Project   string `json:"project,omitempty"`
   119		Scope     string `json:"scope,omitempty"`
   120		TopicKey  string `json:"topic_key,omitempty"`
   121	}
   122	
   123	type UpdateObservationParams struct {
   124		Type     *string `json:"type,omitempty"`
   125		Title    *string `json:"title,omitempty"`
   126		Content  *string `json:"content,omitempty"`
   127		Project  *string `json:"project,omitempty"`
   128		Scope    *string `json:"scope,omitempty"`
   129		TopicKey *string `json:"topic_key,omitempty"`
   130	}
   131	
   132	type Prompt struct {
   133		ID        int64  `json:"id"`
   134		SyncID    string `json:"sync_id"`
   135		SessionID string `json:"session_id"`
   136		Content   string `json:"content"`
   137		Project   string `json:"project,omitempty"`
   138		CreatedAt string `json:"created_at"`
   139	}
   140	
   141	type AddPromptParams struct {
   142		SessionID string `json:"session_id"`
   143		Content   string `json:"content"`
   144		Project   string `json:"project,omitempty"`
   145	}
   146	
   147	const (
   148		DefaultSyncTargetKey = "cloud"
   149	
   150		SyncLifecycleIdle     = "idle"
   151		SyncLifecyclePending  = "pending"
   152		SyncLifecycleRunning  = "running"
   153		SyncLifecycleHealthy  = "healthy"
   154		SyncLifecycleDegraded = "degraded"
   155	
   156		SyncEntitySession     = "session"
   157		SyncEntityObservation = "observation"
   158		SyncEntityPrompt      = "prompt"
   159	
   160		SyncOpUpsert = "upsert"
   161		SyncOpDelete = "delete"
   162	
   163		SyncSourceLocal  = "local"
   164		SyncSourceRemote = "remote"
   165	)
   166	
   167	type SyncState struct {
   168		TargetKey           string  `json:"target_key"`
   169		Lifecycle           string  `json:"lifecycle"`
   170		LastEnqueuedSeq     int64   `json:"last_enqueued_seq"`
   171		LastAckedSeq        int64   `json:"last_acked_seq"`
   172		LastPulledSeq       int64   `json:"last_pulled_seq"`
   173		ConsecutiveFailures int     `json:"consecutive_failures"`
   174		BackoffUntil        *string `json:"backoff_until,omitempty"`
   175		LeaseOwner          *string `json:"lease_owner,omitempty"`
   176		LeaseUntil          *string `json:"lease_until,omitempty"`
   177		LastError           *string `json:"last_error,omitempty"`
   178		UpdatedAt           string  `json:"updated_at"`
   179	}
   180	
   181	type SyncMutation struct {
   182		Seq        int64   `json:"seq"`
   183		TargetKey  string  `json:"target_key"`
   184		Entity     string  `json:"entity"`
   185		EntityKey  string  `json:"entity_key"`
   186		Op         string  `json:"op"`
   187		Payload    string  `json:"payload"`
   188		Source     string  `json:"source"`
   189		Project    string  `json:"project"`
   190		OccurredAt string  `json:"occurred_at"`
   191		AckedAt    *string `json:"acked_at,omitempty"`
   192	}
   193	
   194	// EnrolledProject represents a project enrolled for cloud sync.
   195	type EnrolledProject struct {
   196		Project    string `json:"project"`
   197		EnrolledAt string `json:"enrolled_at"`
   198	}
   199	
   200	type syncSessionPayload struct {
   201		ID        string  `json:"id"`
   202		Project   string  `json:"project"`
   203		Directory string  `json:"directory"`
   204		EndedAt   *string `json:"ended_at,omitempty"`
   205		Summary   *string `json:"summary,omitempty"`
   206	}
   207	
   208	type syncObservationPayload struct {
   209		SyncID     string  `json:"sync_id"`
   210		SessionID  string  `json:"session_id"`
   211		Type       string  `json:"type"`
   212		Title      string  `json:"title"`
   213		Content    string  `json:"content"`
   214		ToolName   *string `json:"tool_name,omitempty"`
   215		Project    *string `json:"project,omitempty"`
   216		Scope      string  `json:"scope"`
   217		TopicKey   *string `json:"topic_key,omitempty"`
   218		Deleted    bool    `json:"deleted,omitempty"`
   219		DeletedAt  *string `json:"deleted_at,omitempty"`
   220		HardDelete bool    `json:"hard_delete,omitempty"`
   221	}
   222	
   223	type syncPromptPayload struct {
   224		SyncID    string  `json:"sync_id"`
   225		SessionID string  `json:"session_id"`
   226		Content   string  `json:"content"`
   227		Project   *string `json:"project,omitempty"`
   228	}
   229	
   230	// ExportData is the full serializable dump of the engram database.
   231	type ExportData struct {
   232		Version      string        `json:"version"`
   233		ExportedAt   string        `json:"exported_at"`
   234		Sessions     []Session     `json:"sessions"`
   235		Observations []Observation `json:"observations"`
   236		Prompts      []Prompt      `json:"prompts"`
   237	}
   238	
   239	// ─── Config ──────────────────────────────────────────────────────────────────
   240	
   241	type Config struct {
   242		DataDir              string
   243		MaxObservationLength int
   244		MaxContextResults    int
   245		MaxSearchResults     int
   246		DedupeWindow         time.Duration
   247	}
   248	
   249	func DefaultConfig() (Config, error) {
   250		home, err := os.UserHomeDir()
   251		if err != nil {
   252			return Config{}, fmt.Errorf("engram: determine home directory: %w", err)
   253		}
   254		return Config{
   255			DataDir:              filepath.Join(home, ".engram"),
   256			MaxObservationLength: 50000,
   257			MaxContextResults:    20,
   258			MaxSearchResults:     20,
   259			DedupeWindow:         15 * time.Minute,
   260		}, nil
   430		return s, nil
   431	}
   432	
   433	func (s *Store) Close() error {
   434		return s.db.Close()
   435	}
   436	
   437	// ─── Migrations ──────────────────────────────────────────────────────────────
   438	
   439	func (s *Store) migrate() error {
   440		schema := `
   441				CREATE TABLE IF NOT EXISTS sessions (
   442					id         TEXT PRIMARY KEY,
   443				project    TEXT NOT NULL,
   444				directory  TEXT NOT NULL,
   445				started_at TEXT NOT NULL DEFAULT (datetime('now')),
   446				ended_at   TEXT,
   447				summary    TEXT
   448			);
   449	
   450				CREATE TABLE IF NOT EXISTS observations (
   451					id         INTEGER PRIMARY KEY AUTOINCREMENT,
   452					sync_id    TEXT,
   453					session_id TEXT    NOT NULL,
   454				type       TEXT    NOT NULL,
   455				title      TEXT    NOT NULL,
   456				content    TEXT    NOT NULL,
   457				tool_name  TEXT,
   458				project    TEXT,
   459				scope      TEXT    NOT NULL DEFAULT 'project',
   460				topic_key  TEXT,
   461				normalized_hash TEXT,
   462				revision_count INTEGER NOT NULL DEFAULT 1,
   463				duplicate_count INTEGER NOT NULL DEFAULT 1,
   464				last_seen_at TEXT,
   465				created_at TEXT    NOT NULL DEFAULT (datetime('now')),
   466				updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
   467				deleted_at TEXT,
   468				FOREIGN KEY (session_id) REFERENCES sessions(id)
   469			);
   470	
   471			CREATE INDEX IF NOT EXISTS idx_obs_session  ON observations(session_id);
   472			CREATE INDEX IF NOT EXISTS idx_obs_type     ON observations(type);
   473			CREATE INDEX IF NOT EXISTS idx_obs_project  ON observations(project);
   474			CREATE INDEX IF NOT EXISTS idx_obs_created  ON observations(created_at DESC);
   475	
   476			CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
   477				title,
   478				content,
   479				tool_name,
   480				type,
   481				project,
   482				topic_key,
   483				content='observations',
   484				content_rowid='id'
   485			);
   486	
   487				CREATE TABLE IF NOT EXISTS user_prompts (
   488					id         INTEGER PRIMARY KEY AUTOINCREMENT,
   489					sync_id    TEXT,
   490					session_id TEXT    NOT NULL,
   491				content    TEXT    NOT NULL,
   492				project    TEXT,
   493				created_at TEXT    NOT NULL DEFAULT (datetime('now')),
   494				FOREIGN KEY (session_id) REFERENCES sessions(id)
   495			);
   496	
   497			CREATE INDEX IF NOT EXISTS idx_prompts_session ON user_prompts(session_id);
   498			CREATE INDEX IF NOT EXISTS idx_prompts_project ON user_prompts(project);
   499			CREATE INDEX IF NOT EXISTS idx_prompts_created ON user_prompts(created_at DESC);
   500	
   501			CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
   502				content,
   503				project,
   504				content='user_prompts',
   505				content_rowid='id'
   506			);
   507	
   508				CREATE TABLE IF NOT EXISTS sync_chunks (
   509					chunk_id    TEXT PRIMARY KEY,
   510					imported_at TEXT NOT NULL DEFAULT (datetime('now'))
   511				);
   512	
   513				CREATE TABLE IF NOT EXISTS sync_state (
   514					target_key           TEXT PRIMARY KEY,
   515					lifecycle            TEXT NOT NULL DEFAULT 'idle',
   516					last_enqueued_seq    INTEGER NOT NULL DEFAULT 0,
   517					last_acked_seq       INTEGER NOT NULL DEFAULT 0,
   518					last_pulled_seq      INTEGER NOT NULL DEFAULT 0,
   519					consecutive_failures INTEGER NOT NULL DEFAULT 0,
   520					backoff_until        TEXT,
   521					lease_owner          TEXT,
   522					lease_until          TEXT,
   523					last_error           TEXT,
   524					updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
   525				);
   526	
   527				CREATE TABLE IF NOT EXISTS sync_mutations (
   528					seq         INTEGER PRIMARY KEY AUTOINCREMENT,
   529					target_key  TEXT NOT NULL,
   530					entity      TEXT NOT NULL,
   531					entity_key  TEXT NOT NULL,
   532					op          TEXT NOT NULL,
   533					payload     TEXT NOT NULL,
   534					source      TEXT NOT NULL DEFAULT 'local',
   535					occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
   536					acked_at    TEXT,
   537					FOREIGN KEY (target_key) REFERENCES sync_state(target_key)
   538				);
   539			`
   540		if _, err := s.execHook(s.db, schema); err != nil {
   541			return err
   542		}
   543	
   544		observationColumns := []struct {
   545			name       string
   546			definition string
   547		}{
   548			{name: "sync_id", definition: "TEXT"},
   549			{name: "scope", definition: "TEXT NOT NULL DEFAULT 'project'"},
   550			{name: "topic_key", definition: "TEXT"},
   551			{name: "normalized_hash", definition: "TEXT"},
   552			{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
   553			{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
   554			{name: "last_seen_at", definition: "TEXT"},
   555			{name: "updated_at", definition: "TEXT NOT NULL DEFAULT ''"},
   556			{name: "deleted_at", definition: "TEXT"},
   557		}
   558		for _, c := range observationColumns {
   559			if err := s.addColumnIfNotExists("observations", c.name, c.definition); err != nil {
   560				return err
   561			}
   562		}
   563	
   564		if err := s.migrateLegacyObservationsTable(); err != nil {
   565			return err
   566		}
   567	
   568		if err := s.addColumnIfNotExists("user_prompts", "sync_id", "TEXT"); err != nil {
   569			return err
   570		}
   571	
   572		if _, err := s.execHook(s.db, `
   573			CREATE INDEX IF NOT EXISTS idx_obs_scope ON observations(scope);
   574			CREATE INDEX IF NOT EXISTS idx_obs_sync_id ON observations(sync_id);
   575			CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
   576			CREATE INDEX IF NOT EXISTS idx_obs_deleted ON observations(deleted_at);
   577			CREATE INDEX IF NOT EXISTS idx_obs_dedupe ON observations(normalized_hash, project, scope, type, title, created_at DESC);
   578			CREATE INDEX IF NOT EXISTS idx_prompts_sync_id ON user_prompts(sync_id);
   579			CREATE INDEX IF NOT EXISTS idx_sync_mutations_target_seq ON sync_mutations(target_key, seq);
   580			CREATE INDEX IF NOT EXISTS idx_sync_mutations_pending ON sync_mutations(target_key, acked_at, seq);
   581		`); err != nil {
   582			return err
   583		}
   584	
   585		// Project-scoped sync: add project column to sync_mutations and enrollment table.
   586		if err := s.addColumnIfNotExists("sync_mutations", "project", "TEXT NOT NULL DEFAULT ''"); err != nil {
   587			return err
   588		}
   589		if _, err := s.execHook(s.db, `
   590			CREATE TABLE IF NOT EXISTS sync_enrolled_projects (
   591				project     TEXT PRIMARY KEY,
   592				enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
   593			);
   594			CREATE INDEX IF NOT EXISTS idx_sync_mutations_project ON sync_mutations(project);
   595		`); err != nil {
   596			return err
   597		}
   598		// Backfill: extract project from JSON payload for existing rows with empty project.
   599		if _, err := s.execHook(s.db, `
   600			UPDATE sync_mutations
   601			SET project = COALESCE(json_extract(payload, '$.project'), '')
   602			WHERE project = '' AND payload != ''
   603		`); err != nil {
   604			return err
   605		}
   606	
   607		if _, err := s.execHook(s.db, `UPDATE observations SET scope = 'project' WHERE scope IS NULL OR scope = ''`); err != nil {
   608			return err
   609		}
   610		if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {
   611			return err
   612		}
   613		if _, err := s.execHook(s.db, `UPDATE observations SET revision_count = 1 WHERE revision_count IS NULL OR revision_count < 1`); err != nil {
   614			return err
   615		}
   616		if _, err := s.execHook(s.db, `UPDATE observations SET duplicate_count = 1 WHERE duplicate_count IS NULL OR duplicate_count < 1`); err != nil {
   617			return err
   618		}
   619		if _, err := s.execHook(s.db, `UPDATE observations SET updated_at = created_at WHERE updated_at IS NULL OR updated_at = ''`); err != nil {
   620			return err
  1080		if limit <= 0 {
  1081			limit = s.cfg.MaxContextResults
  1082		}
  1083	
  1084		query := `
  1085			SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
  1086			       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
  1087			FROM observations o
  1088			WHERE o.deleted_at IS NULL
  1089		`
  1090		args := []any{}
  1091	
  1092		if project != "" {
  1093			query += " AND o.project = ?"
  1094			args = append(args, project)
  1095		}
  1096		if scope != "" {
  1097			query += " AND o.scope = ?"
  1098			args = append(args, normalizeScope(scope))
  1099		}
  1100	
  1101		query += " ORDER BY o.created_at DESC LIMIT ?"
  1102		args = append(args, limit)
  1103	
  1104		return s.queryObservations(query, args...)
  1105	}
  1106	
  1107	// ─── User Prompts ────────────────────────────────────────────────────────────
  1108	
  1109	func (s *Store) AddPrompt(p AddPromptParams) (int64, error) {
  1110		// Normalize project name before storing
  1111		p.Project, _ = NormalizeProject(p.Project)
  1112	
  1113		content := stripPrivateTags(p.Content)
  1114		if len(content) > s.cfg.MaxObservationLength {
  1115			content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
  1116		}
  1117	
  1118		var promptID int64
  1119		err := s.withTx(func(tx *sql.Tx) error {
  1120			syncID := newSyncID("prompt")
  1121			res, err := s.execHook(tx,
  1122				`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
  1123				syncID, p.SessionID, content, nullableString(p.Project),
  1124			)
  1125			if err != nil {
  1126				return err
  1127			}
  1128			promptID, err = res.LastInsertId()
  1129			if err != nil {
  1130				return err
  1131			}
  1132			return s.enqueueSyncMutationTx(tx, SyncEntityPrompt, syncID, SyncOpUpsert, syncPromptPayload{
  1133				SyncID:    syncID,
  1134				SessionID: p.SessionID,
  1135				Content:   content,
  1136				Project:   nullableString(p.Project),
  1137			})
  1138		})
  1139		if err != nil {
  1140			return 0, err
  1141		}
  1142		return promptID, nil
  1143	}
  1144	
  1145	func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
  1146		// Normalize project filter for case-insensitive matching
  1147		project, _ = NormalizeProject(project)
  1148	
  1149		if limit <= 0 {
  1150			limit = 20
  1151		}
  1152	
  1153		query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts`
  1154		args := []any{}
  1155	
  1156		if project != "" {
  1157			query += " WHERE project = ?"
  1158			args = append(args, project)
  1159		}
  1160	
  1161		query += " ORDER BY created_at DESC LIMIT ?"
  1162		args = append(args, limit)
  1163	
  1164		rows, err := s.queryItHook(s.db, query, args...)
  1165		if err != nil {
  1166			return nil, err
  1167		}
  1168		defer rows.Close()
  1169	
  1170		var results []Prompt
  1171		for rows.Next() {
  1172			var p Prompt
  1173			if err := rows.Scan(&p.ID, &p.SyncID, &p.SessionID, &p.Content, &p.Project, &p.CreatedAt); err != nil {
  1174				return nil, err
  1175			}
  1176			results = append(results, p)
  1177		}
  1178		return results, rows.Err()
  1179	}
  1180	
  1181	func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
  1182		if limit <= 0 {
  1183			limit = 10
  1184		}
  1185	
  1186		ftsQuery := sanitizeFTS(query)
  1187	
  1188		sql := `
  1189			SELECT p.id, ifnull(p.sync_id, '') as sync_id, p.session_id, p.content, ifnull(p.project, '') as project, p.created_at
  1190			FROM prompts_fts fts
  1191			JOIN user_prompts p ON p.id = fts.rowid
  1192			WHERE prompts_fts MATCH ?
  1193		`
  1194		args := []any{ftsQuery}
  1195	
  1196		if project != "" {
  1197			sql += " AND p.project = ?"
  1198			args = append(args, project)
  1199		}
  1200	
  1201		sql += " ORDER BY fts.rank LIMIT ?"
  1202		args = append(args, limit)
  1203	
  1204		rows, err := s.queryItHook(s.db, sql, args...)
  1205		if err != nil {
  1206			return nil, fmt.Errorf("search prompts: %w", err)
  1207		}
  1208		defer rows.Close()
  1209	
  1210		var results []Prompt
  1211		for rows.Next() {
  1212			var p Prompt
  1213			if err := rows.Scan(&p.ID, &p.SyncID, &p.SessionID, &p.Content, &p.Project, &p.CreatedAt); err != nil {
  1214				return nil, err
  1215			}
  1216			results = append(results, p)
  1217		}
  1218		return results, rows.Err()
  1219	}
  1220	
  1221	// ─── Get Single Observation ──────────────────────────────────────────────────
  1222	
  1223	func (s *Store) GetObservation(id int64) (*Observation, error) {
  1224		row := s.db.QueryRow(
  1225			`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '930,1045p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1450,1705p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3190,3275p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   930	func (s *Store) SessionObservations(sessionID string, limit int) ([]Observation, error) {
   931		if limit <= 0 {
   932			limit = 200
   933		}
   934	
   935		query := `
   936			SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
   937			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
   938			FROM observations
   939			WHERE session_id = ? AND deleted_at IS NULL
   940			ORDER BY created_at ASC
   941			LIMIT ?
   942		`
   943		return s.queryObservations(query, sessionID, limit)
   944	}
   945	
   946	// ─── Observations ────────────────────────────────────────────────────────────
   947	
   948	func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
   949		// Normalize project name (lowercase + trim) before any persistence
   950		p.Project, _ = NormalizeProject(p.Project)
   951	
   952		// Strip <private>...</private> tags before persisting ANYTHING
   953		title := stripPrivateTags(p.Title)
   954		content := stripPrivateTags(p.Content)
   955	
   956		if len(content) > s.cfg.MaxObservationLength {
   957			content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
   958		}
   959		scope := normalizeScope(p.Scope)
   960		normHash := hashNormalized(content)
   961		topicKey := normalizeTopicKey(p.TopicKey)
   962	
   963		var observationID int64
   964		err := s.withTx(func(tx *sql.Tx) error {
   965			var obs *Observation
   966			if topicKey != "" {
   967				var existingID int64
   968				err := tx.QueryRow(
   969					`SELECT id FROM observations
   970					 WHERE topic_key = ?
   971					   AND ifnull(project, '') = ifnull(?, '')
   972					   AND scope = ?
   973					   AND deleted_at IS NULL
   974					 ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC
   975					 LIMIT 1`,
   976					topicKey, nullableString(p.Project), scope,
   977				).Scan(&existingID)
   978				if err == nil {
   979					if _, err := s.execHook(tx,
   980						`UPDATE observations
   981						 SET type = ?,
   982						     title = ?,
   983						     content = ?,
   984						     tool_name = ?,
   985						     topic_key = ?,
   986						     normalized_hash = ?,
   987						     revision_count = revision_count + 1,
   988						     last_seen_at = datetime('now'),
   989						     updated_at = datetime('now')
   990						 WHERE id = ?`,
   991						p.Type,
   992						title,
   993						content,
   994						nullableString(p.ToolName),
   995						nullableString(topicKey),
   996						normHash,
   997						existingID,
   998					); err != nil {
   999						return err
  1000					}
  1001					obs, err = s.getObservationTx(tx, existingID)
  1002					if err != nil {
  1003						return err
  1004					}
  1005					observationID = existingID
  1006					return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
  1007				}
  1008				if err != sql.ErrNoRows {
  1009					return err
  1010				}
  1011			}
  1012	
  1013			window := dedupeWindowExpression(s.cfg.DedupeWindow)
  1014			var existingID int64
  1015			err := tx.QueryRow(
  1016				`SELECT id FROM observations
  1017				 WHERE normalized_hash = ?
  1018				   AND ifnull(project, '') = ifnull(?, '')
  1019				   AND scope = ?
  1020				   AND type = ?
  1021				   AND title = ?
  1022				   AND deleted_at IS NULL
  1023				   AND datetime(created_at) >= datetime('now', ?)
  1024				 ORDER BY created_at DESC
  1025				 LIMIT 1`,
  1026				normHash, nullableString(p.Project), scope, p.Type, title, window,
  1027			).Scan(&existingID)
  1028			if err == nil {
  1029				if _, err := s.execHook(tx,
  1030					`UPDATE observations
  1031					 SET duplicate_count = duplicate_count + 1,
  1032					     last_seen_at = datetime('now'),
  1033					     updated_at = datetime('now')
  1034					 WHERE id = ?`,
  1035					existingID,
  1036				); err != nil {
  1037					return err
  1038				}
  1039				obs, err = s.getObservationTx(tx, existingID)
  1040				if err != nil {
  1041					return err
  1042				}
  1043				observationID = existingID
  1044				return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
  1045			}
  1450	
  1451		return &TimelineResult{
  1452			Focus:        *focus,
  1453			Before:       beforeEntries,
  1454			After:        afterEntries,
  1455			SessionInfo:  session,
  1456			TotalInRange: totalInRange,
  1457		}, nil
  1458	}
  1459	
  1460	// ─── Search (FTS5) ───────────────────────────────────────────────────────────
  1461	
  1462	func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
  1463		// Normalize project filter so "Engram" finds records stored as "engram"
  1464		opts.Project, _ = NormalizeProject(opts.Project)
  1465	
  1466		limit := opts.Limit
  1467		if limit <= 0 {
  1468			limit = 10
  1469		}
  1470		if limit > s.cfg.MaxSearchResults {
  1471			limit = s.cfg.MaxSearchResults
  1472		}
  1473	
  1474		var directResults []SearchResult
  1475		if strings.Contains(query, "/") {
  1476			tkSQL := `
  1477				SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
  1478				       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  1479				FROM observations
  1480				WHERE topic_key = ? AND deleted_at IS NULL
  1481			`
  1482			tkArgs := []any{query}
  1483	
  1484			if opts.Type != "" {
  1485				tkSQL += " AND type = ?"
  1486				tkArgs = append(tkArgs, opts.Type)
  1487			}
  1488			if opts.Project != "" {
  1489				tkSQL += " AND project = ?"
  1490				tkArgs = append(tkArgs, opts.Project)
  1491			}
  1492			if opts.Scope != "" {
  1493				tkSQL += " AND scope = ?"
  1494				tkArgs = append(tkArgs, normalizeScope(opts.Scope))
  1495			}
  1496	
  1497			tkSQL += " ORDER BY updated_at DESC LIMIT ?"
  1498			tkArgs = append(tkArgs, limit)
  1499	
  1500			tkRows, err := s.queryItHook(s.db, tkSQL, tkArgs...)
  1501			if err == nil {
  1502				defer tkRows.Close()
  1503				for tkRows.Next() {
  1504					var sr SearchResult
  1505					if err := tkRows.Scan(
  1506						&sr.ID, &sr.SyncID, &sr.SessionID, &sr.Type, &sr.Title, &sr.Content,
  1507						&sr.ToolName, &sr.Project, &sr.Scope, &sr.TopicKey, &sr.RevisionCount, &sr.DuplicateCount,
  1508						&sr.LastSeenAt, &sr.CreatedAt, &sr.UpdatedAt, &sr.DeletedAt,
  1509					); err != nil {
  1510						break
  1511					}
  1512					sr.Rank = -1000
  1513					directResults = append(directResults, sr)
  1514				}
  1515			}
  1516		}
  1517	
  1518		// Sanitize query for FTS5 — wrap each term in quotes to avoid syntax errors
  1519		ftsQuery := sanitizeFTS(query)
  1520	
  1521		sqlQ := `
  1522			SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
  1523			       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
  1524			       fts.rank
  1525			FROM observations_fts fts
  1526			JOIN observations o ON o.id = fts.rowid
  1527			WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
  1528		`
  1529		args := []any{ftsQuery}
  1530	
  1531		if opts.Type != "" {
  1532			sqlQ += " AND o.type = ?"
  1533			args = append(args, opts.Type)
  1534		}
  1535	
  1536		if opts.Project != "" {
  1537			sqlQ += " AND o.project = ?"
  1538			args = append(args, opts.Project)
  1539		}
  1540	
  1541		if opts.Scope != "" {
  1542			sqlQ += " AND o.scope = ?"
  1543			args = append(args, normalizeScope(opts.Scope))
  1544		}
  1545	
  1546		sqlQ += " ORDER BY fts.rank LIMIT ?"
  1547		args = append(args, limit)
  1548	
  1549		rows, err := s.queryItHook(s.db, sqlQ, args...)
  1550		if err != nil {
  1551			return nil, fmt.Errorf("search: %w", err)
  1552		}
  1553		defer rows.Close()
  1554	
  1555		seen := make(map[int64]bool)
  1556		for _, dr := range directResults {
  1557			seen[dr.ID] = true
  1558		}
  1559	
  1560		var results []SearchResult
  1561		results = append(results, directResults...)
  1562		for rows.Next() {
  1563			var sr SearchResult
  1564			if err := rows.Scan(
  1565				&sr.ID, &sr.SyncID, &sr.SessionID, &sr.Type, &sr.Title, &sr.Content,
  1566				&sr.ToolName, &sr.Project, &sr.Scope, &sr.TopicKey, &sr.RevisionCount, &sr.DuplicateCount,
  1567				&sr.LastSeenAt, &sr.CreatedAt, &sr.UpdatedAt, &sr.DeletedAt,
  1568				&sr.Rank,
  1569			); err != nil {
  1570				return nil, err
  1571			}
  1572			if !seen[sr.ID] {
  1573				results = append(results, sr)
  1574			}
  1575		}
  1576		if err := rows.Err(); err != nil {
  1577			return nil, err
  1578		}
  1579	
  1580		if len(results) > limit {
  1581			results = results[:limit]
  1582		}
  1583		return results, nil
  1584	}
  1585	
  1586	// ─── Stats ───────────────────────────────────────────────────────────────────
  1587	
  1588	func (s *Store) Stats() (*Stats, error) {
  1589		stats := &Stats{}
  1590	
  1591		s.db.QueryRow("SELECT COUNT(*) FROM sessions").Scan(&stats.TotalSessions)
  1592		s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
  1593		s.db.QueryRow("SELECT COUNT(*) FROM user_prompts").Scan(&stats.TotalPrompts)
  1594	
  1595		rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
  1596		if err != nil {
  1597			return stats, nil
  1598		}
  1599		defer rows.Close()
  1600	
  1601		for rows.Next() {
  1602			var p string
  1603			if err := rows.Scan(&p); err == nil {
  1604				stats.Projects = append(stats.Projects, p)
  1605			}
  1606		}
  1607	
  1608		return stats, nil
  1609	}
  1610	
  1611	// ─── Context Formatting ─────────────────────────────────────────────────────
  1612	
  1613	func (s *Store) FormatContext(project, scope string) (string, error) {
  1614		sessions, err := s.RecentSessions(project, 5)
  1615		if err != nil {
  1616			return "", err
  1617		}
  1618	
  1619		observations, err := s.RecentObservations(project, scope, s.cfg.MaxContextResults)
  1620		if err != nil {
  1621			return "", err
  1622		}
  1623	
  1624		prompts, err := s.RecentPrompts(project, 10)
  1625		if err != nil {
  1626			return "", err
  1627		}
  1628	
  1629		if len(sessions) == 0 && len(observations) == 0 && len(prompts) == 0 {
  1630			return "", nil
  1631		}
  1632	
  1633		var b strings.Builder
  1634		b.WriteString("## Memory from Previous Sessions\n\n")
  1635	
  1636		if len(sessions) > 0 {
  1637			b.WriteString("### Recent Sessions\n")
  1638			for _, sess := range sessions {
  1639				summary := ""
  1640				if sess.Summary != nil {
  1641					summary = fmt.Sprintf(": %s", truncate(*sess.Summary, 200))
  1642				}
  1643				fmt.Fprintf(&b, "- **%s** (%s)%s [%d observations]\n",
  1644					sess.Project, sess.StartedAt, summary, sess.ObservationCount)
  1645			}
  1646			b.WriteString("\n")
  1647		}
  1648	
  1649		if len(prompts) > 0 {
  1650			b.WriteString("### Recent User Prompts\n")
  1651			for _, p := range prompts {
  1652				fmt.Fprintf(&b, "- %s: %s\n", p.CreatedAt, truncate(p.Content, 200))
  1653			}
  1654			b.WriteString("\n")
  1655		}
  1656	
  1657		if len(observations) > 0 {
  1658			b.WriteString("### Recent Observations\n")
  1659			for _, obs := range observations {
  1660				fmt.Fprintf(&b, "- [%s] **%s**: %s\n",
  1661					obs.Type, obs.Title, truncate(obs.Content, 300))
  1662			}
  1663			b.WriteString("\n")
  1664		}
  1665	
  1666		return b.String(), nil
  1667	}
  1668	
  1669	// ─── Export / Import ─────────────────────────────────────────────────────────
  1670	
  1671	func (s *Store) Export() (*ExportData, error) {
  1672		data := &ExportData{
  1673			Version:    "0.1.0",
  1674			ExportedAt: Now(),
  1675		}
  1676	
  1677		// Sessions
  1678		rows, err := s.queryItHook(s.db,
  1679			"SELECT id, project, directory, started_at, ended_at, summary FROM sessions ORDER BY started_at",
  1680		)
  1681		if err != nil {
  1682			return nil, fmt.Errorf("export sessions: %w", err)
  1683		}
  1684		defer rows.Close()
  1685		for rows.Next() {
  1686			var sess Session
  1687			if err := rows.Scan(&sess.ID, &sess.Project, &sess.Directory, &sess.StartedAt, &sess.EndedAt, &sess.Summary); err != nil {
  1688				return nil, err
  1689			}
  1690			data.Sessions = append(data.Sessions, sess)
  1691		}
  1692		if err := rows.Err(); err != nil {
  1693			return nil, err
  1694		}
  1695	
  1696		// Observations
  1697		obsRows, err := s.queryItHook(s.db,
  1698			`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
  1699			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  1700			 FROM observations ORDER BY id`,
  1701		)
  1702		if err != nil {
  1703			return nil, fmt.Errorf("export observations: %w", err)
  1704		}
  1705		defer obsRows.Close()
  3190			n = strings.ReplaceAll(n, "__", "_")
  3191		}
  3192		if n == project {
  3193			return n, ""
  3194		}
  3195		return n, fmt.Sprintf("⚠️ Project name normalized: %q → %q", project, n)
  3196	}
  3197	
  3198	// SuggestTopicKey generates a stable topic key suggestion from type/title/content.
  3199	// It infers a topic family (e.g. architecture/*, bug/*) and then appends
  3200	// a normalized segment from title/content for stable cross-session keys.
  3201	func SuggestTopicKey(typ, title, content string) string {
  3202		family := inferTopicFamily(typ, title, content)
  3203		cleanTitle := stripPrivateTags(title)
  3204		segment := normalizeTopicSegment(cleanTitle)
  3205	
  3206		if segment == "" {
  3207			cleanContent := stripPrivateTags(content)
  3208			words := strings.Fields(strings.ToLower(cleanContent))
  3209			if len(words) > 8 {
  3210				words = words[:8]
  3211			}
  3212			segment = normalizeTopicSegment(strings.Join(words, " "))
  3213		}
  3214	
  3215		if segment == "" {
  3216			segment = "general"
  3217		}
  3218	
  3219		if strings.HasPrefix(segment, family+"-") {
  3220			segment = strings.TrimPrefix(segment, family+"-")
  3221		}
  3222		if segment == "" || segment == family {
  3223			segment = "general"
  3224		}
  3225	
  3226		return family + "/" + segment
  3227	}
  3228	
  3229	func inferTopicFamily(typ, title, content string) string {
  3230		t := strings.TrimSpace(strings.ToLower(typ))
  3231		switch t {
  3232		case "architecture", "design", "adr", "refactor":
  3233			return "architecture"
  3234		case "bug", "bugfix", "fix", "incident", "hotfix":
  3235			return "bug"
  3236		case "decision":
  3237			return "decision"
  3238		case "pattern", "convention", "guideline":
  3239			return "pattern"
  3240		case "config", "setup", "infra", "infrastructure", "ci":
  3241			return "config"
  3242		case "discovery", "investigation", "root_cause", "root-cause":
  3243			return "discovery"
  3244		case "learning", "learn":
  3245			return "learning"
  3246		case "session_summary":
  3247			return "session"
  3248		}
  3249	
  3250		text := strings.ToLower(title + " " + content)
  3251		if hasAny(text, "bug", "fix", "panic", "error", "crash", "regression", "incident", "hotfix") {
  3252			return "bug"
  3253		}
  3254		if hasAny(text, "architecture", "design", "adr", "boundary", "hexagonal", "refactor") {
  3255			return "architecture"
  3256		}
  3257		if hasAny(text, "decision", "tradeoff", "chose", "choose", "decide") {
  3258			return "decision"
  3259		}
  3260		if hasAny(text, "pattern", "convention", "naming", "guideline") {
  3261			return "pattern"
  3262		}
  3263		if hasAny(text, "config", "setup", "environment", "env", "docker", "pipeline") {
  3264			return "config"
  3265		}
  3266		if hasAny(text, "discovery", "investigate", "investigation", "found", "root cause") {
  3267			return "discovery"
  3268		}
  3269		if hasAny(text, "learned", "learning") {
  3270			return "learning"
  3271		}
  3272	
  3273		if t != "" && t != "manual" {
  3274			return normalizeTopicSegment(t)
  3275		}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1,160p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '520,740p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '850,1045p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package mcp implements the Model Context Protocol server for Engram.
     2	//
     3	// This exposes memory tools via MCP stdio transport so ANY agent
     4	// (OpenCode, Claude Code, Cursor, Windsurf, etc.) can use Engram's
     5	// persistent memory just by adding it as an MCP server.
     6	//
     7	// Tool profiles allow agents to load only the tools they need:
     8	//
     9	//	engram mcp                    → all 15 tools (default)
    10	//	engram mcp --tools=agent      → 11 tools agents actually use (per skill files)
    11	//	engram mcp --tools=admin      → 4 tools for TUI/CLI (delete, stats, timeline, merge)
    12	//	engram mcp --tools=agent,admin → combine profiles
    13	//	engram mcp --tools=mem_save,mem_search → individual tool names
    14	package mcp
    15	
    16	import (
    17		"context"
    18		"fmt"
    19		"strings"
    20	
    21		projectpkg "github.com/Gentleman-Programming/engram/internal/project"
    22		"github.com/Gentleman-Programming/engram/internal/store"
    23		"github.com/mark3labs/mcp-go/mcp"
    24		"github.com/mark3labs/mcp-go/server"
    25	)
    26	
    27	// MCPConfig holds configuration for the MCP server.
    28	type MCPConfig struct {
    29		DefaultProject string // Auto-detected project name, used when LLM sends empty project
    30	}
    31	
    32	var suggestTopicKey = store.SuggestTopicKey
    33	
    34	var loadMCPStats = func(s *store.Store) (*store.Stats, error) {
    35		return s.Stats()
    36	}
    37	
    38	// ─── Tool Profiles ───────────────────────────────────────────────────────────
    39	//
    40	// "agent" — tools AI agents use during coding sessions:
    41	//   mem_save, mem_search, mem_context, mem_session_summary,
    42	//   mem_session_start, mem_session_end, mem_get_observation,
    43	//   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
    44	//
    45	// "admin" — tools for manual curation, TUI, and dashboards:
    46	//   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
    47	//
    48	// "all" (default) — every tool registered.
    49	
    50	// ProfileAgent contains the tool names that AI agents need.
    51	// Sourced from actual skill files and memory protocol instructions
    52	// across all 4 supported agents (Claude Code, OpenCode, Gemini CLI, Codex).
    53	var ProfileAgent = map[string]bool{
    54		"mem_save":              true, // proactive save — referenced 17 times across protocols
    55		"mem_search":            true, // search past memories — referenced 6 times
    56		"mem_context":           true, // recent context from previous sessions — referenced 10 times
    57		"mem_session_summary":   true, // end-of-session summary — referenced 16 times
    58		"mem_session_start":     true, // register session start
    59		"mem_session_end":       true, // mark session completed
    60		"mem_get_observation":   true, // full observation content after search — referenced 4 times
    61		"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
    62		"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
    63		"mem_save_prompt":       true, // save user prompts
    64		"mem_update":            true, // update observation by ID — skills say "use mem_update when you have an exact ID to correct"
    65	}
    66	
    67	// ProfileAdmin contains tools for TUI, dashboards, and manual curation
    68	// that are NOT referenced in any agent skill or memory protocol.
    69	var ProfileAdmin = map[string]bool{
    70		"mem_delete":         true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
    71		"mem_stats":          true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
    72		"mem_timeline":       true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
    73		"mem_merge_projects": true, // destructive curation tool — not for agent use
    74	}
    75	
    76	// Profiles maps profile names to their tool sets.
    77	var Profiles = map[string]map[string]bool{
    78		"agent": ProfileAgent,
    79		"admin": ProfileAdmin,
    80	}
    81	
    82	// ResolveTools takes a comma-separated string of profile names and/or
    83	// individual tool names and returns the set of tool names to register.
    84	// An empty input means "all" — every tool is registered.
    85	func ResolveTools(input string) map[string]bool {
    86		input = strings.TrimSpace(input)
    87		if input == "" || input == "all" {
    88			return nil // nil means register everything
    89		}
    90	
    91		result := make(map[string]bool)
    92		for _, token := range strings.Split(input, ",") {
    93			token = strings.TrimSpace(token)
    94			if token == "" {
    95				continue
    96			}
    97			if token == "all" {
    98				return nil
    99			}
   100			if profile, ok := Profiles[token]; ok {
   101				for tool := range profile {
   102					result[tool] = true
   103				}
   104			} else {
   105				// Treat as individual tool name
   106				result[token] = true
   107			}
   108		}
   109	
   110		if len(result) == 0 {
   111			return nil
   112		}
   113		return result
   114	}
   115	
   116	// NewServer creates an MCP server with ALL tools registered (backwards compatible).
   117	func NewServer(s *store.Store) *server.MCPServer {
   118		return NewServerWithConfig(s, MCPConfig{}, nil)
   119	}
   120	
   121	// serverInstructions tells MCP clients when to use Engram's tools.
   122	// 6 core tools are eager (always in context). The rest are deferred
   123	// and require ToolSearch to load.
   124	const serverInstructions = `Engram provides persistent memory that survives across sessions and compactions.
   125	
   126	CORE TOOLS (always available — use without ToolSearch):
   127	  mem_save — save decisions, bugs, discoveries, conventions PROACTIVELY (do not wait to be asked)
   128	  mem_search — find past work, decisions, or context from previous sessions
   129	  mem_context — get recent session history (call at session start or after compaction)
   130	  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
   131	  mem_get_observation — get full untruncated content of a search result by ID
   132	  mem_save_prompt — save user prompt for context
   133	
   134	DEFERRED TOOLS (use ToolSearch when needed):
   135	  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
   136	  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
   137	
   138	PROACTIVE SAVE RULE: Call mem_save immediately after ANY decision, bug fix, discovery, or convention — not just when asked.`
   139	
   140	// NewServerWithTools creates an MCP server registering only the tools in
   141	// the allowlist. If allowlist is nil, all tools are registered.
   142	func NewServerWithTools(s *store.Store, allowlist map[string]bool) *server.MCPServer {
   143		return NewServerWithConfig(s, MCPConfig{}, allowlist)
   144	}
   145	
   146	// NewServerWithConfig creates an MCP server with full configuration including
   147	// default project detection and optional tool allowlist.
   148	func NewServerWithConfig(s *store.Store, cfg MCPConfig, allowlist map[string]bool) *server.MCPServer {
   149		srv := server.NewMCPServer(
   150			"engram",
   151			"0.1.0",
   152			server.WithToolCapabilities(true),
   153			server.WithInstructions(serverInstructions),
   154		)
   155	
   156		registerTools(srv, s, cfg, allowlist)
   157		return srv
   158	}
   159	
   160	// shouldRegister returns true if the tool should be registered given the
   520					mcp.WithDeferLoading(true),
   521					mcp.WithTitleAnnotation("Start Session"),
   522					mcp.WithReadOnlyHintAnnotation(false),
   523					mcp.WithDestructiveHintAnnotation(false),
   524					mcp.WithIdempotentHintAnnotation(true),
   525					mcp.WithOpenWorldHintAnnotation(false),
   526					mcp.WithString("id",
   527						mcp.Required(),
   528						mcp.Description("Unique session identifier"),
   529					),
   530					mcp.WithString("project",
   531						mcp.Required(),
   532						mcp.Description("Project name"),
   533					),
   534					mcp.WithString("directory",
   535						mcp.Description("Working directory"),
   536					),
   537				),
   538				handleSessionStart(s, cfg),
   539			)
   540		}
   541	
   542		// ─── mem_session_end (profile: agent, deferred) ─────────────────────
   543		if shouldRegister("mem_session_end", allowlist) {
   544			srv.AddTool(
   545				mcp.NewTool("mem_session_end",
   546					mcp.WithDescription("Mark a coding session as completed with an optional summary."),
   547					mcp.WithDeferLoading(true),
   548					mcp.WithTitleAnnotation("End Session"),
   549					mcp.WithReadOnlyHintAnnotation(false),
   550					mcp.WithDestructiveHintAnnotation(false),
   551					mcp.WithIdempotentHintAnnotation(true),
   552					mcp.WithOpenWorldHintAnnotation(false),
   553					mcp.WithString("id",
   554						mcp.Required(),
   555						mcp.Description("Session identifier to close"),
   556					),
   557					mcp.WithString("summary",
   558						mcp.Description("Summary of what was accomplished"),
   559					),
   560				),
   561				handleSessionEnd(s),
   562			)
   563		}
   564	
   565		// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
   566		if shouldRegister("mem_capture_passive", allowlist) {
   567			srv.AddTool(
   568				mcp.NewTool("mem_capture_passive",
   569					mcp.WithDeferLoading(true),
   570					mcp.WithTitleAnnotation("Capture Learnings"),
   571					mcp.WithReadOnlyHintAnnotation(false),
   572					mcp.WithDestructiveHintAnnotation(false),
   573					mcp.WithIdempotentHintAnnotation(true),
   574					mcp.WithOpenWorldHintAnnotation(false),
   575					mcp.WithDescription(`Extract and save structured learnings from text output. Use this at the end of a task to capture knowledge automatically.
   576	
   577	The tool looks for sections like "## Key Learnings:" or "## Aprendizajes Clave:" and extracts numbered or bulleted items. Each item is saved as a separate observation.
   578	
   579	Duplicates are automatically detected and skipped — safe to call multiple times with the same content.`),
   580					mcp.WithString("content",
   581						mcp.Required(),
   582						mcp.Description("The text output containing a '## Key Learnings:' section with numbered or bulleted items"),
   583					),
   584					mcp.WithString("session_id",
   585						mcp.Description("Session ID (default: manual-save-{project})"),
   586					),
   587					mcp.WithString("project",
   588						mcp.Description("Project name"),
   589					),
   590					mcp.WithString("source",
   591						mcp.Description("Source identifier (e.g. 'subagent-stop', 'session-end')"),
   592					),
   593				),
   594				handleCapturePassive(s, cfg),
   595			)
   596		}
   597	
   598		// ─── mem_merge_projects (profile: admin, deferred) ──────────────────
   599		if shouldRegister("mem_merge_projects", allowlist) {
   600			srv.AddTool(
   601				mcp.NewTool("mem_merge_projects",
   602					mcp.WithDescription("Merge memories from multiple project name variants into one canonical name. Use when you discover project name drift (e.g. 'Engram' and 'engram' should be the same project). DESTRUCTIVE — moves all records from source names to the canonical name."),
   603					mcp.WithDeferLoading(true),
   604					mcp.WithTitleAnnotation("Merge Projects"),
   605					mcp.WithReadOnlyHintAnnotation(false),
   606					mcp.WithDestructiveHintAnnotation(true),
   607					mcp.WithIdempotentHintAnnotation(true),
   608					mcp.WithOpenWorldHintAnnotation(false),
   609					mcp.WithString("from",
   610						mcp.Required(),
   611						mcp.Description("Comma-separated list of project names to merge FROM (e.g. 'Engram,engram-memory,ENGRAM')"),
   612					),
   613					mcp.WithString("to",
   614						mcp.Required(),
   615						mcp.Description("The canonical project name to merge INTO (e.g. 'engram')"),
   616					),
   617				),
   618				handleMergeProjects(s),
   619			)
   620		}
   621	}
   622	
   623	// ─── Tool Handlers ───────────────────────────────────────────────────────────
   624	
   625	func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   626		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   627			query, _ := req.GetArguments()["query"].(string)
   628			typ, _ := req.GetArguments()["type"].(string)
   629			project, _ := req.GetArguments()["project"].(string)
   630			scope, _ := req.GetArguments()["scope"].(string)
   631			limit := intArg(req, "limit", 10)
   632	
   633			// Apply default project when LLM sends empty
   634			if project == "" {
   635				project = cfg.DefaultProject
   636			}
   637			// Normalize project name
   638			project, _ = store.NormalizeProject(project)
   639	
   640			results, err := s.Search(query, store.SearchOptions{
   641				Type:    typ,
   642				Project: project,
   643				Scope:   scope,
   644				Limit:   limit,
   645			})
   646			if err != nil {
   647				return mcp.NewToolResultError(fmt.Sprintf("Search error: %s. Try simpler keywords.", err)), nil
   648			}
   649	
   650			if len(results) == 0 {
   651				return mcp.NewToolResultText(fmt.Sprintf("No memories found for: %q", query)), nil
   652			}
   653	
   654			var b strings.Builder
   655			fmt.Fprintf(&b, "Found %d memories:\n\n", len(results))
   656			anyTruncated := false
   657			for i, r := range results {
   658				projectDisplay := ""
   659				if r.Project != nil {
   660					projectDisplay = fmt.Sprintf(" | project: %s", *r.Project)
   661				}
   662				preview := truncate(r.Content, 300)
   663				if len(r.Content) > 300 {
   664					anyTruncated = true
   665					preview += " [preview]"
   666				}
   667				fmt.Fprintf(&b, "[%d] #%d (%s) — %s\n    %s\n    %s%s | scope: %s\n\n",
   668					i+1, r.ID, r.Type, r.Title,
   669					preview,
   670					r.CreatedAt, projectDisplay, r.Scope)
   671			}
   672			if anyTruncated {
   673				fmt.Fprintf(&b, "---\nResults above are previews (300 chars). To read the full content of a specific memory, call mem_get_observation(id: <ID>).\n")
   674			}
   675	
   676			return mcp.NewToolResultText(b.String()), nil
   677		}
   678	}
   679	
   680	func handleSave(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   681		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   682			title, _ := req.GetArguments()["title"].(string)
   683			content, _ := req.GetArguments()["content"].(string)
   684			typ, _ := req.GetArguments()["type"].(string)
   685			sessionID, _ := req.GetArguments()["session_id"].(string)
   686			project, _ := req.GetArguments()["project"].(string)
   687			scope, _ := req.GetArguments()["scope"].(string)
   688			topicKey, _ := req.GetArguments()["topic_key"].(string)
   689	
   690			// Apply default project when LLM sends empty
   691			if project == "" {
   692				project = cfg.DefaultProject
   693			}
   694			// Normalize project name and capture warning
   695			normalized, normWarning := store.NormalizeProject(project)
   696			project = normalized
   697	
   698			if typ == "" {
   699				typ = "manual"
   700			}
   701			if sessionID == "" {
   702				sessionID = defaultSessionID(project)
   703			}
   704			suggestedTopicKey := suggestTopicKey(typ, title, content)
   705	
   706			// Check for similar existing projects (only when this project has no existing observations)
   707			var similarWarning string
   708			if project != "" {
   709				existingNames, _ := s.ListProjectNames()
   710				isNew := true
   711				for _, e := range existingNames {
   712					if e == project {
   713						isNew = false
   714						break
   715					}
   716				}
   717				if isNew && len(existingNames) > 0 {
   718					matches := projectpkg.FindSimilar(project, existingNames, 3)
   719					if len(matches) > 0 {
   720						bestMatch := matches[0].Name
   721						// Cheap count query instead of full ListProjectsWithStats
   722						obsCount, _ := s.CountObservationsForProject(bestMatch)
   723						similarWarning = fmt.Sprintf("⚠️ Project %q has no memories. Similar project found: %q (%d memories). Consider using that name instead.", project, bestMatch, obsCount)
   724					}
   725				}
   726			}
   727	
   728			// Ensure the session exists
   729			s.CreateSession(sessionID, project, "")
   730	
   731			truncated := len(content) > s.MaxObservationLength()
   732	
   733			_, err := s.AddObservation(store.AddObservationParams{
   734				SessionID: sessionID,
   735				Type:      typ,
   736				Title:     title,
   737				Content:   content,
   738				Project:   project,
   739				Scope:     scope,
   740				TopicKey:  topicKey,
   850	
   851	func handleSavePrompt(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   852		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   853			content, _ := req.GetArguments()["content"].(string)
   854			sessionID, _ := req.GetArguments()["session_id"].(string)
   855			project, _ := req.GetArguments()["project"].(string)
   856	
   857			// Apply default project when LLM sends empty
   858			if project == "" {
   859				project = cfg.DefaultProject
   860			}
   861			project, _ = store.NormalizeProject(project)
   862	
   863			if sessionID == "" {
   864				sessionID = defaultSessionID(project)
   865			}
   866	
   867			// Ensure the session exists
   868			s.CreateSession(sessionID, project, "")
   869	
   870			_, err := s.AddPrompt(store.AddPromptParams{
   871				SessionID: sessionID,
   872				Content:   content,
   873				Project:   project,
   874			})
   875			if err != nil {
   876				return mcp.NewToolResultError("Failed to save prompt: " + err.Error()), nil
   877			}
   878	
   879			return mcp.NewToolResultText(fmt.Sprintf("Prompt saved: %q", truncate(content, 80))), nil
   880		}
   881	}
   882	
   883	func handleContext(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
   884		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   885			project, _ := req.GetArguments()["project"].(string)
   886			scope, _ := req.GetArguments()["scope"].(string)
   887	
   888			// Apply default project when LLM sends empty
   889			if project == "" {
   890				project = cfg.DefaultProject
   891			}
   892			project, _ = store.NormalizeProject(project)
   893	
   894			context, err := s.FormatContext(project, scope)
   895			if err != nil {
   896				return mcp.NewToolResultError("Failed to get context: " + err.Error()), nil
   897			}
   898	
   899			if context == "" {
   900				return mcp.NewToolResultText("No previous session memories found."), nil
   901			}
   902	
   903			stats, _ := s.Stats()
   904			var projects string
   905			if len(stats.Projects) > 0 {
   906				projects = strings.Join(stats.Projects, ", ")
   907			} else {
   908				projects = "none"
   909			}
   910	
   911			result := fmt.Sprintf("%s\n---\nMemory stats: %d sessions, %d observations across projects: %s",
   912				context, stats.TotalSessions, stats.TotalObservations, projects)
   913	
   914			return mcp.NewToolResultText(result), nil
   915		}
   916	}
   917	
   918	func handleStats(s *store.Store) server.ToolHandlerFunc {
   919		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   920			stats, err := loadMCPStats(s)
   921			if err != nil {
   922				return mcp.NewToolResultError("Failed to get stats: " + err.Error()), nil
   923			}
   924	
   925			var projects string
   926			if len(stats.Projects) > 0 {
   927				projects = strings.Join(stats.Projects, ", ")
   928			} else {
   929				projects = "none yet"
   930			}
   931	
   932			result := fmt.Sprintf("Memory System Stats:\n- Sessions: %d\n- Observations: %d\n- Prompts: %d\n- Projects: %s",
   933				stats.TotalSessions, stats.TotalObservations, stats.TotalPrompts, projects)
   934	
   935			return mcp.NewToolResultText(result), nil
   936		}
   937	}
   938	
   939	func handleTimeline(s *store.Store) server.ToolHandlerFunc {
   940		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   941			observationID := int64(intArg(req, "observation_id", 0))
   942			if observationID == 0 {
   943				return mcp.NewToolResultError("observation_id is required"), nil
   944			}
   945			before := intArg(req, "before", 5)
   946			after := intArg(req, "after", 5)
   947	
   948			result, err := s.Timeline(observationID, before, after)
   949			if err != nil {
   950				return mcp.NewToolResultError(fmt.Sprintf("Timeline error: %s", err)), nil
   951			}
   952	
   953			var b strings.Builder
   954	
   955			// Session header
   956			if result.SessionInfo != nil {
   957				summary := ""
   958				if result.SessionInfo.Summary != nil {
   959					summary = fmt.Sprintf(" — %s", truncate(*result.SessionInfo.Summary, 100))
   960				}
   961				fmt.Fprintf(&b, "Session: %s (%s)%s\n", result.SessionInfo.Project, result.SessionInfo.StartedAt, summary)
   962				fmt.Fprintf(&b, "Total observations in session: %d\n\n", result.TotalInRange)
   963			}
   964	
   965			// Before entries
   966			if len(result.Before) > 0 {
   967				b.WriteString("─── Before ───\n")
   968				for _, e := range result.Before {
   969					fmt.Fprintf(&b, "  #%d [%s] %s — %s\n", e.ID, e.Type, e.Title, truncate(e.Content, 150))
   970				}
   971				b.WriteString("\n")
   972			}
   973	
   974			// Focus observation (highlighted)
   975			fmt.Fprintf(&b, ">>> #%d [%s] %s <<<\n", result.Focus.ID, result.Focus.Type, result.Focus.Title)
   976			fmt.Fprintf(&b, "    %s\n", truncate(result.Focus.Content, 500))
   977			fmt.Fprintf(&b, "    %s\n\n", result.Focus.CreatedAt)
   978	
   979			// After entries
   980			if len(result.After) > 0 {
   981				b.WriteString("─── After ───\n")
   982				for _, e := range result.After {
   983					fmt.Fprintf(&b, "  #%d [%s] %s — %s\n", e.ID, e.Type, e.Title, truncate(e.Content, 150))
   984				}
   985			}
   986	
   987			return mcp.NewToolResultText(b.String()), nil
   988		}
   989	}
   990	
   991	func handleGetObservation(s *store.Store) server.ToolHandlerFunc {
   992		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
   993			id := int64(intArg(req, "id", 0))
   994			if id == 0 {
   995				return mcp.NewToolResultError("id is required"), nil
   996			}
   997	
   998			obs, err := s.GetObservation(id)
   999			if err != nil {
  1000				return mcp.NewToolResultError(fmt.Sprintf("Observation #%d not found", id)), nil
  1001			}
  1002	
  1003			project := ""
  1004			if obs.Project != nil {
  1005				project = fmt.Sprintf("\nProject: %s", *obs.Project)
  1006			}
  1007			scope := fmt.Sprintf("\nScope: %s", obs.Scope)
  1008			topic := ""
  1009			if obs.TopicKey != nil {
  1010				topic = fmt.Sprintf("\nTopic: %s", *obs.TopicKey)
  1011			}
  1012			toolName := ""
  1013			if obs.ToolName != nil {
  1014				toolName = fmt.Sprintf("\nTool: %s", *obs.ToolName)
  1015			}
  1016			duplicateMeta := fmt.Sprintf("\nDuplicates: %d", obs.DuplicateCount)
  1017			revisionMeta := fmt.Sprintf("\nRevisions: %d", obs.RevisionCount)
  1018	
  1019			result := fmt.Sprintf("#%d [%s] %s\n%s\nSession: %s%s%s\nCreated: %s",
  1020				obs.ID, obs.Type, obs.Title,
  1021				obs.Content,
  1022				obs.SessionID, project+scope+topic, toolName+duplicateMeta+revisionMeta,
  1023				obs.CreatedAt,
  1024			)
  1025	
  1026			return mcp.NewToolResultText(result), nil
  1027		}
  1028	}
  1029	
  1030	func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
  1031		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
  1032			content, _ := req.GetArguments()["content"].(string)
  1033			sessionID, _ := req.GetArguments()["session_id"].(string)
  1034			project, _ := req.GetArguments()["project"].(string)
  1035	
  1036			// Apply default project when LLM sends empty
  1037			if project == "" {
  1038				project = cfg.DefaultProject
  1039			}
  1040			project, _ = store.NormalizeProject(project)
  1041	
  1042			if sessionID == "" {
  1043				sessionID = defaultSessionID(project)
  1044			}
  1045	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts | sed -n '180,460p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '90,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   180	}
   181	
   182	function truncate(str: string, max: number): string {
   183	  if (!str) return ""
   184	  return str.length > max ? str.slice(0, max) + "..." : str
   185	}
   186	
   187	/**
   188	 * Strip <private>...</private> tags before sending to engram.
   189	 * Double safety: the Go binary also strips, but we strip here too
   190	 * so sensitive data never even hits the wire.
   191	 */
   192	function stripPrivateTags(str: string): string {
   193	  if (!str) return ""
   194	  return str.replace(/<private>[\s\S]*?<\/private>/gi, "[REDACTED]").trim()
   195	}
   196	
   197	// ─── Plugin Export ───────────────────────────────────────────────────────────
   198	
   199	export const Engram: Plugin = async (ctx) => {
   200	  const oldProject = ctx.directory.split("/").pop() ?? "unknown"
   201	  const project = extractProjectName(ctx.directory)
   202	
   203	  // Track tool counts per session (in-memory only, not critical)
   204	  const toolCounts = new Map<string, number>()
   205	
   206	  // Track which sessions we've already ensured exist in engram
   207	  const knownSessions = new Set<string>()
   208	
   209	  // Track sub-agent session IDs so we can suppress their tool-hook registrations.
   210	  // Sub-agents (Task() calls) have a parentID or a title ending in " subagent)".
   211	  // We must not register them as top-level Engram sessions — they cause session
   212	  // inflation (e.g. 170 sessions for 1 real conversation, issue #116).
   213	  const subAgentSessions = new Set<string>()
   214	
   215	  /**
   216	   * Ensure a session exists in engram. Idempotent — calls POST /sessions
   217	   * which uses INSERT OR IGNORE. Safe to call multiple times.
   218	   *
   219	   * Silently skips sub-agent sessions (tracked in `subAgentSessions`).
   220	   */
   221	  async function ensureSession(sessionId: string): Promise<void> {
   222	    if (!sessionId || knownSessions.has(sessionId)) return
   223	    // Do not register sub-agent sessions in Engram (issue #116).
   224	    if (subAgentSessions.has(sessionId)) return
   225	    knownSessions.add(sessionId)
   226	    await engramFetch("/sessions", {
   227	      method: "POST",
   228	      body: {
   229	        id: sessionId,
   230	        project,
   231	        directory: ctx.directory,
   232	      },
   233	    })
   234	  }
   235	
   236	  // Try to start engram server if not running
   237	  const running = await isEngramRunning()
   238	  if (!running) {
   239	    try {
   240	      Bun.spawn([ENGRAM_BIN, "serve"], {
   241	        stdout: "ignore",
   242	        stderr: "ignore",
   243	        stdin: "ignore",
   244	      })
   245	      await new Promise((r) => setTimeout(r, 500))
   246	    } catch {
   247	      // Binary not found or can't start — plugin will silently no-op
   248	    }
   249	  }
   250	
   251	  // Migrate project name if it changed (one-time, idempotent)
   252	  // Must run AFTER server startup to ensure the endpoint is available
   253	  if (oldProject !== project) {
   254	    await engramFetch("/projects/migrate", {
   255	      method: "POST",
   256	      body: { old_project: oldProject, new_project: project },
   257	    })
   258	  }
   259	
   260	  // Auto-import: if .engram/manifest.json exists in the project repo,
   261	  // run `engram sync --import` to load any new chunks into the local DB.
   262	  // This is how git-synced memories get loaded when cloning a repo or
   263	  // pulling changes. Each chunk is imported only once (tracked by ID).
   264	  try {
   265	    const manifestFile = `${ctx.directory}/.engram/manifest.json`
   266	    const file = Bun.file(manifestFile)
   267	    if (await file.exists()) {
   268	      Bun.spawn([ENGRAM_BIN, "sync", "--import"], {
   269	        cwd: ctx.directory,
   270	        stdout: "ignore",
   271	        stderr: "ignore",
   272	        stdin: "ignore",
   273	      })
   274	    }
   275	  } catch {
   276	    // Manifest doesn't exist or binary not found — silently skip
   277	  }
   278	
   279	  return {
   280	    // ─── Event Listeners ───────────────────────────────────────────
   281	
   282	    event: async ({ event }) => {
   283	      // --- Session Created ---
   284	      if (event.type === "session.created") {
   285	        // Bug fix (#116): session data is nested under event.properties.info,
   286	        // not event.properties directly.
   287	        const info = (event.properties as any)?.info
   288	        const sessionId = info?.id
   289	        const parentID = info?.parentID
   290	        const title: string = info?.title ?? ""
   291	
   292	        // Sub-agent sessions (created via Task()) must NOT be registered as
   293	        // top-level Engram sessions. They cause massive session inflation
   294	        // (e.g. 170 sessions for 1 real conversation).
   295	        //
   296	        // Detection heuristics:
   297	        //   - parentID is set on all Task() sub-agent sessions
   298	        //   - title ends with " subagent)" as a secondary signal
   299	        const isSubAgent = !!parentID || title.endsWith(" subagent)")
   300	
   301	        if (sessionId && !isSubAgent) {
   302	          await ensureSession(sessionId)
   303	        } else if (sessionId && isSubAgent) {
   304	          // Remember this as a sub-agent session so tool-hook calls
   305	          // to ensureSession() are also suppressed for it.
   306	          subAgentSessions.add(sessionId)
   307	        }
   308	      }
   309	
   310	      // --- Session Deleted ---
   311	      if (event.type === "session.deleted") {
   312	        // Same properties.info path as session.created.
   313	        const info = (event.properties as any)?.info
   314	        const sessionId = info?.id
   315	        if (sessionId) {
   316	          toolCounts.delete(sessionId)
   317	          knownSessions.delete(sessionId)
   318	          subAgentSessions.delete(sessionId)
   319	        }
   320	      }
   321	
   322	    },
   323	
   324	    // ─── User Prompt Capture ──────────────────────────────────────
   325	    // chat.message is called once per user message, before the LLM sees it.
   326	    // input.sessionID is always reliable here (no knownSessions workaround).
   327	    // output.message is typed as UserMessage (role:"user" already guaranteed).
   328	    // output.parts contains TextPart[] with the actual message text.
   329	
   330	    "chat.message": async (input, output) => {
   331	      // Skip sub-agent sessions — they inflate session counts (issue #116)
   332	      if (subAgentSessions.has(input.sessionID)) return
   333	
   334	      const sessionId = input.sessionID
   335	
   336	      // Extract text from parts (type:"text")
   337	      const content = output.parts
   338	        .filter((p) => p.type === "text")
   339	        .map((p) => (p as any).text ?? "")
   340	        .join("\n")
   341	        .trim()
   342	
   343	      // Also fallback to summary if parts yield nothing
   344	      const fallback = !content && output.message.summary
   345	        ? `${output.message.summary.title ?? ""}\n${output.message.summary.body ?? ""}`.trim()
   346	        : ""
   347	
   348	      const finalContent = content || fallback
   349	
   350	      // Only capture non-trivial prompts (>10 chars)
   351	      if (finalContent.length > 10) {
   352	        await ensureSession(sessionId)
   353	        await engramFetch("/prompts", {
   354	          method: "POST",
   355	          body: {
   356	            session_id: sessionId,
   357	            content: stripPrivateTags(truncate(finalContent, 2000)),
   358	            project,
   359	          },
   360	        })
   361	      }
   362	    },
   363	
   364	    // ─── Tool Execution Hook ─────────────────────────────────────
   365	    // Count tool calls per session (for session end stats).
   366	    // Also ensures the session exists — handles plugin reload / reconnect.
   367	    // Passive capture: when a Task tool completes, POST its output to
   368	    // the passive capture endpoint so the server extracts learnings.
   369	
   370	    "tool.execute.after": async (input, output) => {
   371	      if (ENGRAM_TOOLS.has(input.tool.toLowerCase())) return
   372	
   373	      // input.sessionID comes from OpenCode — always available
   374	      const sessionId = input.sessionID
   375	      if (sessionId) {
   376	        await ensureSession(sessionId)
   377	        toolCounts.set(sessionId, (toolCounts.get(sessionId) ?? 0) + 1)
   378	      }
   379	
   380	      // Passive capture: extract learnings from Task tool output
   381	      if (input.tool === "Task" && output && sessionId) {
   382	        const text = typeof output === "string" ? output : JSON.stringify(output)
   383	        if (text.length > 50) {
   384	          await engramFetch("/observations/passive", {
   385	            method: "POST",
   386	            body: {
   387	              session_id: sessionId,
   388	              content: stripPrivateTags(text),
   389	              project,
   390	              source: "task-complete",
   391	            },
   392	          })
   393	        }
   394	      }
   395	    },
   396	
   397	    // ─── System Prompt: Always-on memory instructions ──────────
   398	    // Injects MEMORY_INSTRUCTIONS into the system prompt of every message.
   399	    // This ensures the agent ALWAYS knows about Engram, even after compaction.
   400	    //
   401	    // We append to the last existing system entry instead of pushing a new one.
   402	    // Some models (Qwen3.5, Mistral/Ministral via llama.cpp) reject multiple
   403	    // system messages — their Jinja chat templates only allow a single system
   404	    // block at the beginning. By concatenating, we avoid adding extra system
   405	    // messages that would break these models. See: GitHub issue #23.
   406	
   407	    "experimental.chat.system.transform": async (_input, output) => {
   408	      if (output.system.length > 0) {
   409	        output.system[output.system.length - 1] += "\n\n" + MEMORY_INSTRUCTIONS
   410	      } else {
   411	        output.system.push(MEMORY_INSTRUCTIONS)
   412	      }
   413	    },
   414	
   415	    // ─── Compaction Hook: Persist memory + inject context ──────────
   416	    // Compaction is triggered by the system (not the agent) when context
   417	    // gets too long. The old agent "dies" and a new one starts with the
   418	    // compacted summary. This is our chance to:
   419	    // 1. Auto-save a session checkpoint (the agent can't do this itself)
   420	    // 2. Inject context from previous sessions into the compaction prompt
   421	    // 3. Tell the compressor to remind the new agent to save memories
   422	
   423	    "experimental.session.compacting": async (input, output) => {
   424	      if (input.sessionID) {
   425	        await ensureSession(input.sessionID)
   426	      }
   427	
   428	      // Inject context from previous sessions
   429	      const data = await engramFetch(
   430	        `/context?project=${encodeURIComponent(project)}`
   431	      )
   432	      if (data?.context) {
   433	        output.context.push(data.context)
   434	      }
   435	
   436	      // Tell the compressor to instruct the new agent to persist the
   437	      // compacted summary to Engram. The new agent reads the compacted
   438	      // summary and this instruction, then saves it as a session summary.
   439	      output.context.push(
   440	        `CRITICAL INSTRUCTION FOR COMPACTED SUMMARY:\n` +
   441	        `The agent has access to Engram persistent memory via MCP tools.\n` +
   442	        `You MUST include the following instruction at the TOP of the compacted summary:\n\n` +
   443	        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +
   444	        `Use project: '${project}'. This preserves what was accomplished before compaction. Do this BEFORE any other work."\n\n` +
   445	        `This is NOT optional. Without this, everything done before compaction is lost from memory.`
   446	      )
   447	    },
   448	  }
   449	}
    90		return serveFn(ln, s.mux)
    91	}
    92	
    93	func (s *Server) Handler() http.Handler {
    94		return s.mux
    95	}
    96	
    97	func (s *Server) routes() {
    98		s.mux.HandleFunc("GET /health", s.handleHealth)
    99	
   100		// Sessions
   101		s.mux.HandleFunc("POST /sessions", s.handleCreateSession)
   102		s.mux.HandleFunc("POST /sessions/{id}/end", s.handleEndSession)
   103		s.mux.HandleFunc("GET /sessions/recent", s.handleRecentSessions)
   104	
   105		// Observations
   106		s.mux.HandleFunc("POST /observations", s.handleAddObservation)
   107		s.mux.HandleFunc("POST /observations/passive", s.handlePassiveCapture)
   108		s.mux.HandleFunc("GET /observations/recent", s.handleRecentObservations)
   109		s.mux.HandleFunc("PATCH /observations/{id}", s.handleUpdateObservation)
   110		s.mux.HandleFunc("DELETE /observations/{id}", s.handleDeleteObservation)
   111	
   112		// Search
   113		s.mux.HandleFunc("GET /search", s.handleSearch)
   114	
   115		// Timeline
   116		s.mux.HandleFunc("GET /timeline", s.handleTimeline)
   117		s.mux.HandleFunc("GET /observations/{id}", s.handleGetObservation)
   118	
   119		// Prompts
   120		s.mux.HandleFunc("POST /prompts", s.handleAddPrompt)
   121		s.mux.HandleFunc("GET /prompts/recent", s.handleRecentPrompts)
   122		s.mux.HandleFunc("GET /prompts/search", s.handleSearchPrompts)
   123	
   124		// Context
   125		s.mux.HandleFunc("GET /context", s.handleContext)
   126	
   127		// Export / Import
   128		s.mux.HandleFunc("GET /export", s.handleExport)
   129		s.mux.HandleFunc("POST /import", s.handleImport)
   130	
   131		// Stats
   132		s.mux.HandleFunc("GET /stats", s.handleStats)
   133	
   134		// Project migration
   135		s.mux.HandleFunc("POST /projects/migrate", s.handleMigrateProject)
   136	
   137		// Sync status (degraded-state visibility for autosync)
   138		s.mux.HandleFunc("GET /sync/status", s.handleSyncStatus)
   139	}
   140	
   141	// ─── Handlers ────────────────────────────────────────────────────────────────
   142	
   143	func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
   144		jsonResponse(w, http.StatusOK, map[string]any{
   145			"status":  "ok",
   146			"service": "engram",
   147			"version": "0.1.0",
   148		})
   149	}
   150	
   151	func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
   152		var body struct {
   153			ID        string `json:"id"`
   154			Project   string `json:"project"`
   155			Directory string `json:"directory"`
   156		}
   157		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
   158			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
   159			return
   160		}
   161		if body.ID == "" || body.Project == "" {
   162			jsonError(w, http.StatusBadRequest, "id and project are required")
   163			return
   164		}
   165	
   166		if err := s.store.CreateSession(body.ID, body.Project, body.Directory); err != nil {
   167			jsonError(w, http.StatusInternalServerError, err.Error())
   168			return
   169		}
   170	
   171		s.notifyWrite()
   172		jsonResponse(w, http.StatusCreated, map[string]string{"id": body.ID, "status": "created"})
   173	}
   174	
   175	func (s *Server) handleEndSession(w http.ResponseWriter, r *http.Request) {
   176		id := r.PathValue("id")
   177	
   178		var body struct {
   179			Summary string `json:"summary"`
   180		}

codex
The main pattern emerging is that Engram has three distinct lifecycle lanes: durable session rows, prompt rows, and observation rows, all stitched together in `FormatContext()`. I’m drilling one level deeper now into `CreateSession` / `EndSession` / `mem_session_summary` and then mapping that against our trust-scoped `memory_context` + cached-summary path, because that’s where the adopt-now versus prototype-later call will actually land.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '720,930p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1705,1775p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   720				project,
   721				topic_key,
   722				content='observations',
   723				content_rowid='id'
   724			);
   725			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
   726			SELECT id, title, content, tool_name, type, project, topic_key
   727			FROM observations
   728			WHERE deleted_at IS NULL;
   729	
   730			CREATE TRIGGER obs_fts_insert AFTER INSERT ON observations BEGIN
   731				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
   732				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
   733			END;
   734	
   735			CREATE TRIGGER obs_fts_delete AFTER DELETE ON observations BEGIN
   736				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
   737				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
   738			END;
   739	
   740			CREATE TRIGGER obs_fts_update AFTER UPDATE ON observations BEGIN
   741				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
   742				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
   743				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
   744				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
   745			END;
   746		`); err != nil {
   747			return fmt.Errorf("migrate fts topic_key: %w", err)
   748		}
   749		return nil
   750	}
   751	
   752	// ─── Sessions ────────────────────────────────────────────────────────────────
   753	
   754	func (s *Store) CreateSession(id, project, directory string) error {
   755		// Normalize project name before storing
   756		project, _ = NormalizeProject(project)
   757	
   758		return s.withTx(func(tx *sql.Tx) error {
   759			if err := s.createSessionTx(tx, id, project, directory); err != nil {
   760				return err
   761			}
   762			return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
   763				ID:        id,
   764				Project:   project,
   765				Directory: directory,
   766			})
   767		})
   768	}
   769	
   770	func (s *Store) EndSession(id string, summary string) error {
   771		return s.withTx(func(tx *sql.Tx) error {
   772			res, err := s.execHook(tx,
   773				`UPDATE sessions SET ended_at = datetime('now'), summary = ? WHERE id = ?`,
   774				nullableString(summary), id,
   775			)
   776			if err != nil {
   777				return err
   778			}
   779			rows, err := res.RowsAffected()
   780			if err != nil {
   781				return err
   782			}
   783			if rows == 0 {
   784				return nil
   785			}
   786	
   787			var endedAt string
   788			var project, directory string
   789			var storedSummary *string
   790			if err := tx.QueryRow(
   791				`SELECT project, directory, ended_at, summary FROM sessions WHERE id = ?`,
   792				id,
   793			).Scan(&project, &directory, &endedAt, &storedSummary); err != nil {
   794				return err
   795			}
   796	
   797			return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
   798				ID:        id,
   799				Project:   project,
   800				Directory: directory,
   801				EndedAt:   &endedAt,
   802				Summary:   storedSummary,
   803			})
   804		})
   805	}
   806	
   807	func (s *Store) GetSession(id string) (*Session, error) {
   808		row := s.db.QueryRow(
   809			`SELECT id, project, directory, started_at, ended_at, summary FROM sessions WHERE id = ?`, id,
   810		)
   811		var sess Session
   812		if err := row.Scan(&sess.ID, &sess.Project, &sess.Directory, &sess.StartedAt, &sess.EndedAt, &sess.Summary); err != nil {
   813			return nil, err
   814		}
   815		return &sess, nil
   816	}
   817	
   818	func (s *Store) RecentSessions(project string, limit int) ([]SessionSummary, error) {
   819		// Normalize project filter for case-insensitive matching
   820		project, _ = NormalizeProject(project)
   821	
   822		if limit <= 0 {
   823			limit = 5
   824		}
   825	
   826		query := `
   827			SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
   828			       COUNT(o.id) as observation_count
   829			FROM sessions s
   830			LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
   831			WHERE 1=1
   832		`
   833		args := []any{}
   834	
   835		if project != "" {
   836			query += " AND s.project = ?"
   837			args = append(args, project)
   838		}
   839	
   840		query += " GROUP BY s.id ORDER BY MAX(COALESCE(o.created_at, s.started_at)) DESC LIMIT ?"
   841		args = append(args, limit)
   842	
   843		rows, err := s.queryItHook(s.db, query, args...)
   844		if err != nil {
   845			return nil, err
   846		}
   847		defer rows.Close()
   848	
   849		var results []SessionSummary
   850		for rows.Next() {
   851			var ss SessionSummary
   852			if err := rows.Scan(&ss.ID, &ss.Project, &ss.StartedAt, &ss.EndedAt, &ss.Summary, &ss.ObservationCount); err != nil {
   853				return nil, err
   854			}
   855			results = append(results, ss)
   856		}
   857		return results, rows.Err()
   858	}
   859	
   860	// AllSessions returns recent sessions ordered by most recent first (for TUI browsing).
   861	func (s *Store) AllSessions(project string, limit int) ([]SessionSummary, error) {
   862		if limit <= 0 {
   863			limit = 50
   864		}
   865	
   866		query := `
   867			SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
   868			       COUNT(o.id) as observation_count
   869			FROM sessions s
   870			LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
   871			WHERE 1=1
   872		`
   873		args := []any{}
   874	
   875		if project != "" {
   876			query += " AND s.project = ?"
   877			args = append(args, project)
   878		}
   879	
   880		query += " GROUP BY s.id ORDER BY MAX(COALESCE(o.created_at, s.started_at)) DESC LIMIT ?"
   881		args = append(args, limit)
   882	
   883		rows, err := s.queryItHook(s.db, query, args...)
   884		if err != nil {
   885			return nil, err
   886		}
   887		defer rows.Close()
   888	
   889		var results []SessionSummary
   890		for rows.Next() {
   891			var ss SessionSummary
   892			if err := rows.Scan(&ss.ID, &ss.Project, &ss.StartedAt, &ss.EndedAt, &ss.Summary, &ss.ObservationCount); err != nil {
   893				return nil, err
   894			}
   895			results = append(results, ss)
   896		}
   897		return results, rows.Err()
   898	}
   899	
   900	// AllObservations returns recent observations ordered by most recent first (for TUI browsing).
   901	func (s *Store) AllObservations(project, scope string, limit int) ([]Observation, error) {
   902		if limit <= 0 {
   903			limit = s.cfg.MaxContextResults
   904		}
   905	
   906		query := `
   907			SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
   908			       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
   909			FROM observations o
   910			WHERE o.deleted_at IS NULL
   911		`
   912		args := []any{}
   913	
   914		if project != "" {
   915			query += " AND o.project = ?"
   916			args = append(args, project)
   917		}
   918		if scope != "" {
   919			query += " AND o.scope = ?"
   920			args = append(args, normalizeScope(scope))
   921		}
   922	
   923		query += " ORDER BY o.created_at DESC LIMIT ?"
   924		args = append(args, limit)
   925	
   926		return s.queryObservations(query, args...)
   927	}
   928	
   929	// SessionObservations returns all observations for a specific session.
   930	func (s *Store) SessionObservations(sessionID string, limit int) ([]Observation, error) {
  1705		defer obsRows.Close()
  1706		for obsRows.Next() {
  1707			var o Observation
  1708			if err := obsRows.Scan(
  1709				&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content,
  1710				&o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt,
  1711				&o.CreatedAt, &o.UpdatedAt, &o.DeletedAt,
  1712			); err != nil {
  1713				return nil, err
  1714			}
  1715			data.Observations = append(data.Observations, o)
  1716		}
  1717		if err := obsRows.Err(); err != nil {
  1718			return nil, err
  1719		}
  1720	
  1721		// Prompts
  1722		promptRows, err := s.queryItHook(s.db,
  1723			"SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts ORDER BY id",
  1724		)
  1725		if err != nil {
  1726			return nil, fmt.Errorf("export prompts: %w", err)
  1727		}
  1728		defer promptRows.Close()
  1729		for promptRows.Next() {
  1730			var p Prompt
  1731			if err := promptRows.Scan(&p.ID, &p.SyncID, &p.SessionID, &p.Content, &p.Project, &p.CreatedAt); err != nil {
  1732				return nil, err
  1733			}
  1734			data.Prompts = append(data.Prompts, p)
  1735		}
  1736		if err := promptRows.Err(); err != nil {
  1737			return nil, err
  1738		}
  1739	
  1740		return data, nil
  1741	}
  1742	
  1743	func (s *Store) Import(data *ExportData) (*ImportResult, error) {
  1744		tx, err := s.beginTxHook()
  1745		if err != nil {
  1746			return nil, fmt.Errorf("import: begin tx: %w", err)
  1747		}
  1748		defer tx.Rollback()
  1749	
  1750		result := &ImportResult{}
  1751	
  1752		// Import sessions (skip duplicates)
  1753		for _, sess := range data.Sessions {
  1754			res, err := s.execHook(tx,
  1755				`INSERT OR IGNORE INTO sessions (id, project, directory, started_at, ended_at, summary)
  1756				 VALUES (?, ?, ?, ?, ?, ?)`,
  1757				sess.ID, sess.Project, sess.Directory, sess.StartedAt, sess.EndedAt, sess.Summary,
  1758			)
  1759			if err != nil {
  1760				return nil, fmt.Errorf("import session %s: %w", sess.ID, err)
  1761			}
  1762			n, _ := res.RowsAffected()
  1763			result.SessionsImported += int(n)
  1764		}
  1765	
  1766		// Import observations (use new IDs — AUTOINCREMENT)
  1767		for _, obs := range data.Observations {
  1768			_, err := s.execHook(tx,
  1769				`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
  1770				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  1771				normalizeExistingSyncID(obs.SyncID, "obs"),
  1772				obs.SessionID,
  1773				obs.Type,
  1774				obs.Title,
  1775				obs.Content,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1030,1175p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1175,1275p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1030	func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
  1031		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
  1032			content, _ := req.GetArguments()["content"].(string)
  1033			sessionID, _ := req.GetArguments()["session_id"].(string)
  1034			project, _ := req.GetArguments()["project"].(string)
  1035	
  1036			// Apply default project when LLM sends empty
  1037			if project == "" {
  1038				project = cfg.DefaultProject
  1039			}
  1040			project, _ = store.NormalizeProject(project)
  1041	
  1042			if sessionID == "" {
  1043				sessionID = defaultSessionID(project)
  1044			}
  1045	
  1046			// Ensure the session exists
  1047			s.CreateSession(sessionID, project, "")
  1048	
  1049			_, err := s.AddObservation(store.AddObservationParams{
  1050				SessionID: sessionID,
  1051				Type:      "session_summary",
  1052				Title:     fmt.Sprintf("Session summary: %s", project),
  1053				Content:   content,
  1054				Project:   project,
  1055			})
  1056			if err != nil {
  1057				return mcp.NewToolResultError("Failed to save session summary: " + err.Error()), nil
  1058			}
  1059	
  1060			return mcp.NewToolResultText(fmt.Sprintf("Session summary saved for project %q", project)), nil
  1061		}
  1062	}
  1063	
  1064	func handleSessionStart(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
  1065		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
  1066			id, _ := req.GetArguments()["id"].(string)
  1067			project, _ := req.GetArguments()["project"].(string)
  1068			directory, _ := req.GetArguments()["directory"].(string)
  1069	
  1070			// Apply default project when LLM sends empty
  1071			if project == "" {
  1072				project = cfg.DefaultProject
  1073			}
  1074			project, _ = store.NormalizeProject(project)
  1075	
  1076			if err := s.CreateSession(id, project, directory); err != nil {
  1077				return mcp.NewToolResultError("Failed to start session: " + err.Error()), nil
  1078			}
  1079	
  1080			return mcp.NewToolResultText(fmt.Sprintf("Session %q started for project %q", id, project)), nil
  1081		}
  1082	}
  1083	
  1084	func handleSessionEnd(s *store.Store) server.ToolHandlerFunc {
  1085		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
  1086			id, _ := req.GetArguments()["id"].(string)
  1087			summary, _ := req.GetArguments()["summary"].(string)
  1088	
  1089			if err := s.EndSession(id, summary); err != nil {
  1090				return mcp.NewToolResultError("Failed to end session: " + err.Error()), nil
  1091			}
  1092	
  1093			return mcp.NewToolResultText(fmt.Sprintf("Session %q completed", id)), nil
  1094		}
  1095	}
  1096	
  1097	func handleCapturePassive(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
  1098		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
  1099			content, _ := req.GetArguments()["content"].(string)
  1100			sessionID, _ := req.GetArguments()["session_id"].(string)
  1101			project, _ := req.GetArguments()["project"].(string)
  1102			source, _ := req.GetArguments()["source"].(string)
  1103	
  1104			// Apply default project when LLM sends empty
  1105			if project == "" {
  1106				project = cfg.DefaultProject
  1107			}
  1108			project, _ = store.NormalizeProject(project)
  1109	
  1110			if content == "" {
  1111				return mcp.NewToolResultError("content is required — include text with a '## Key Learnings:' section"), nil
  1112			}
  1113	
  1114			if sessionID == "" {
  1115				sessionID = defaultSessionID(project)
  1116				_ = s.CreateSession(sessionID, project, "")
  1117			}
  1118	
  1119			if source == "" {
  1120				source = "mcp-passive"
  1121			}
  1122	
  1123			result, err := s.PassiveCapture(store.PassiveCaptureParams{
  1124				SessionID: sessionID,
  1125				Content:   content,
  1126				Project:   project,
  1127				Source:    source,
  1128			})
  1129			if err != nil {
  1130				return mcp.NewToolResultError("Passive capture failed: " + err.Error()), nil
  1131			}
  1132	
  1133			return mcp.NewToolResultText(fmt.Sprintf(
  1134				"Passive capture complete: extracted=%d saved=%d duplicates=%d",
  1135				result.Extracted, result.Saved, result.Duplicates,
  1136			)), nil
  1137		}
  1138	}
  1139	
  1140	func handleMergeProjects(s *store.Store) server.ToolHandlerFunc {
  1141		return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
  1142			fromStr, _ := req.GetArguments()["from"].(string)
  1143			to, _ := req.GetArguments()["to"].(string)
  1144	
  1145			if fromStr == "" || to == "" {
  1146				return mcp.NewToolResultError("both 'from' and 'to' are required"), nil
  1147			}
  1148	
  1149			var sources []string
  1150			for _, src := range strings.Split(fromStr, ",") {
  1151				src = strings.TrimSpace(src)
  1152				if src != "" {
  1153					sources = append(sources, src)
  1154				}
  1155			}
  1156	
  1157			if len(sources) == 0 {
  1158				return mcp.NewToolResultError("at least one source project name is required in 'from'"), nil
  1159			}
  1160	
  1161			result, err := s.MergeProjects(sources, to)
  1162			if err != nil {
  1163				return mcp.NewToolResultError("Merge failed: " + err.Error()), nil
  1164			}
  1165	
  1166			msg := fmt.Sprintf("Merged %d source(s) into %q:\n", len(result.SourcesMerged), result.Canonical)
  1167			msg += fmt.Sprintf("  Observations moved: %d\n", result.ObservationsUpdated)
  1168			msg += fmt.Sprintf("  Sessions moved:     %d\n", result.SessionsUpdated)
  1169			msg += fmt.Sprintf("  Prompts moved:      %d\n", result.PromptsUpdated)
  1170	
  1171			return mcp.NewToolResultText(msg), nil
  1172		}
  1173	}
  1174	
  1175	// ─── Helpers ─────────────────────────────────────────────────────────────────
  1175	// ─── Helpers ─────────────────────────────────────────────────────────────────
  1176	
  1177	// defaultSessionID returns a project-scoped default session ID.
  1178	// If project is non-empty: "manual-save-{project}"
  1179	// If project is empty: "manual-save"
  1180	func defaultSessionID(project string) string {
  1181		if project == "" {
  1182			return "manual-save"
  1183		}
  1184		return "manual-save-" + project
  1185	}
  1186	
  1187	func intArg(req mcp.CallToolRequest, key string, defaultVal int) int {
  1188		v, ok := req.GetArguments()[key].(float64)
  1189		if !ok {
  1190			return defaultVal
  1191		}
  1192		return int(v)
  1193	}
  1194	
  1195	func boolArg(req mcp.CallToolRequest, key string, defaultVal bool) bool {
  1196		v, ok := req.GetArguments()[key].(bool)
  1197		if !ok {
  1198			return defaultVal
  1199		}
  1200		return v
  1201	}
  1202	
  1203	func truncate(s string, max int) string {
  1204		runes := []rune(s)
  1205		if len(runes) <= max {
  1206			return s
  1207		}
  1208		return string(runes[:max]) + "..."
  1209	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '150,360p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,980p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1,260p'
nl -ba .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	  transcriptPath: string,
   151	  sizeBytes: number,
   152	  modifiedAtMs: number,
   153	): string {
   154	  return createHash('sha256')
   155	    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
   156	    .digest('hex')
   157	    .slice(0, 16);
   158	}
   159	
   160	function rejectCachedSummary(
   161	  category: 'fidelity' | 'freshness',
   162	  reason: CachedSessionSummaryDecision['reason'],
   163	  detail: string,
   164	): CachedSessionSummaryDecision {
   165	  return {
   166	    status: 'rejected',
   167	    category,
   168	    reason,
   169	    detail,
   170	    cachedSummary: null,
   171	  };
   172	}
   173	
   174	export function buildCachedSessionSummaryCandidate(
   175	  state: HookState | null,
   176	): CachedSessionSummaryCandidate | null {
   177	  if (!state) {
   178	    return null;
   179	  }
   180	
   181	  return {
   182	    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
   183	    lastSpecFolder: state.lastSpecFolder,
   184	    summaryText: state.sessionSummary?.text ?? null,
   185	    extractedAt: state.sessionSummary?.extractedAt ?? null,
   186	    stateUpdatedAt: state.updatedAt,
   187	    producerMetadata: state.producerMetadata,
   188	  };
   189	}
   190	
   191	export function evaluateCachedSessionSummaryCandidate(
   192	  candidate: CachedSessionSummaryCandidate | null,
   193	  options: {
   194	    specFolder?: string;
   195	    nowMs?: number;
   196	    maxAgeMs?: number;
   197	  } = {},
   198	): CachedSessionSummaryDecision {
   199	  if (!candidate) {
   200	    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
   201	  }
   202	
   203	  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
   204	    return rejectCachedSummary(
   205	      'fidelity',
   206	      'schema_version_mismatch',
   207	      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
   208	    );
   209	  }
   210	
   211	  const summaryText = candidate.summaryText?.trim() ?? '';
   212	  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
   213	    return rejectCachedSummary(
   214	      'fidelity',
   215	      'missing_summary',
   216	      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
   217	    );
   218	  }
   219	
   220	  const producerMetadata = candidate.producerMetadata;
   221	  if (!producerMetadata) {
   222	    return rejectCachedSummary(
   223	      'fidelity',
   224	      'missing_producer_metadata',
   225	      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
   226	    );
   227	  }
   228	
   229	  const transcript = producerMetadata.transcript;
   230	  const cacheTokens = producerMetadata.cacheTokens;
   231	  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
   232	  if (
   233	    producerTurnMs === null
   234	    || !transcript
   235	    || typeof transcript.path !== 'string'
   236	    || transcript.path.trim().length === 0
   237	    || typeof transcript.fingerprint !== 'string'
   238	    || transcript.fingerprint.trim().length === 0
   239	    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
   240	    || parseIsoMs(transcript.modifiedAt) === null
   241	    || !cacheTokens
   242	    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
   243	    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
   244	  ) {
   245	    return rejectCachedSummary(
   246	      'fidelity',
   247	      'missing_required_fields',
   248	      'Producer metadata was missing required transcript identity or cache token fields.',
   249	    );
   250	  }
   251	
   252	  let transcriptStat: ReturnType<typeof statSync>;
   253	  try {
   254	    transcriptStat = statSync(transcript.path);
   255	  } catch (error: unknown) {
   256	    const message = error instanceof Error ? error.message : String(error);
   257	    return rejectCachedSummary(
   258	      'fidelity',
   259	      'transcript_unreadable',
   260	      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,
   261	    );
   262	  }
   263	
   264	  const expectedFingerprint = buildTranscriptFingerprint(
   265	    transcript.path,
   266	    transcriptStat.size,
   267	    transcriptStat.mtimeMs,
   268	  );
   269	  if (
   270	    transcript.sizeBytes !== transcriptStat.size
   271	    || transcript.modifiedAt !== transcriptStat.mtime.toISOString()
   272	    || transcript.fingerprint !== expectedFingerprint
   273	  ) {
   274	    return rejectCachedSummary(
   275	      'fidelity',
   276	      'transcript_identity_mismatch',
   277	      'Transcript path, fingerprint, or file stats no longer match the persisted producer identity.',
   278	    );
   279	  }
   280	
   281	  const extractedAtMs = parseIsoMs(candidate.extractedAt);
   282	  const nowMs = options.nowMs ?? Date.now();
   283	  const maxAgeMs = options.maxAgeMs ?? CACHED_SESSION_SUMMARY_MAX_AGE_MS;
   284	  if (extractedAtMs === null || nowMs - extractedAtMs > maxAgeMs) {
   285	    return rejectCachedSummary(
   286	      'freshness',
   287	      'stale_summary',
   288	      `Cached summary age exceeded the freshness window of ${maxAgeMs}ms.`,
   289	    );
   290	  }
   291	
   292	  if (extractedAtMs < producerTurnMs) {
   293	    return rejectCachedSummary(
   294	      'freshness',
   295	      'summary_precedes_producer_turn',
   296	      'Cached summary predates the latest producer turn metadata and is therefore invalidated.',
   297	    );
   298	  }
   299	
   300	  const expectedSpecFolder = normalizeSpecFolder(options.specFolder);
   301	  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
   302	  if (expectedSpecFolder) {
   303	    if (!cachedSpecFolder) {
   304	      return rejectCachedSummary(
   305	        'freshness',
   306	        'unknown_scope',
   307	        'A target spec folder was requested, but the cached summary did not carry a scope anchor.',
   308	      );
   309	    }
   310	
   311	    if (cachedSpecFolder !== expectedSpecFolder) {
   312	      return rejectCachedSummary(
   313	        'freshness',
   314	        'scope_mismatch',
   315	        `Cached summary scope ${cachedSpecFolder} did not match requested scope ${expectedSpecFolder}.`,
   316	      );
   317	    }
   318	  } else if (!cachedSpecFolder) {
   319	    return rejectCachedSummary(
   320	      'freshness',
   321	      'unknown_scope',
   322	      'Cached summary scope was unknown, so the consumer failed closed instead of guessing.',
   323	    );
   324	  }
   325	
   326	  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
   327	  return {
   328	    status: 'accepted',
   329	    category: 'accepted',
   330	    reason: 'accepted',
   331	    detail: 'Cached summary passed fidelity and freshness gates and may be used additively.',
   332	    cachedSummary: {
   333	      schemaVersion: candidate.schemaVersion,
   334	      lastSpecFolder: cachedSpecFolder,
   335	      summaryText,
   336	      extractedAt: candidate.extractedAt!,
   337	      lastClaudeTurnAt: producerMetadata.lastClaudeTurnAt!,
   338	      transcriptPath: transcript.path,
   339	      transcriptFingerprint: transcript.fingerprint,
   340	      cacheCreationInputTokens: cacheTokens.cacheCreationInputTokens,
   341	      cacheReadInputTokens: cacheTokens.cacheReadInputTokens,
   342	      continuityText,
   343	      startupHint: continuityText,
   344	    },
   345	  };
   346	}
   347	
   348	export function getCachedSessionSummaryDecision(
   349	  options: {
   350	    specFolder?: string;
   351	    claudeSessionId?: string;
   352	    nowMs?: number;
   353	    maxAgeMs?: number;
   354	    state?: HookState | null;
   355	  } = {},
   356	): CachedSessionSummaryDecision {
   357	  const candidate = buildCachedSessionSummaryCandidate(
   358	    options.state ?? loadMostRecentState({
   359	      maxAgeMs: options.maxAgeMs,
   360	      scope: {
   820	
   821	function resolveSessionLifecycle(
   822	  args: ContextArgs,
   823	  db: ReturnType<typeof vectorIndex.getDb> | null,
   824	): SessionLifecycleResolution {
   825	  void db;
   826	
   827	  // Security: session scope derived from server context, not caller input
   828	  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
   829	    tenantId: args.tenantId,
   830	    userId: args.userId,
   831	    agentId: args.agentId,
   832	  });
   833	  if (trustedSession.error) {
   834	    return {
   835	      requestedSessionId: trustedSession.requestedSessionId,
   836	      effectiveSessionId: '',
   837	      resumed: false,
   838	      priorMode: null,
   839	      counter: 0,
   840	      error: trustedSession.error,
   841	    };
   842	  }
   843	
   844	  const requestedSessionId = trustedSession.requestedSessionId;
   845	  const effectiveSessionId = trustedSession.effectiveSessionId;
   846	  const resumed = trustedSession.trusted;
   847	  const priorMode = resumed
   848	    ? workingMemory.getSessionInferredMode(effectiveSessionId)
   849	    : null;
   850	  const counter = resumed
   851	    ? workingMemory.getSessionEventCounter(effectiveSessionId)
   852	    : 0;
   853	
   854	  return {
   855	    requestedSessionId,
   856	    effectiveSessionId,
   857	    resumed,
   858	    priorMode,
   859	    counter,
   860	  };
   861	}
   862	
   863	function resolveEffectiveMode(
   864	  args: ContextArgs,
   865	  session: SessionLifecycleResolution,
   866	  pressurePolicy: {
   867	    level: string;
   868	    ratio: number | null;
   869	    source: string;
   870	    warning: string | null;
   871	  },
   872	): EffectiveModeResolution {
   873	  const requestedMode = args.mode ?? 'auto';
   874	  const explicitIntent = args.intent;
   875	  const normalizedInput = args.input.trim();
   876	
   877	  let effectiveMode = requestedMode;
   878	  let detectedIntent = explicitIntent;
   879	  let intentConfidence = explicitIntent ? 1.0 : 0;
   880	  let pressureOverrideTargetMode: PressureOverrideTargetMode = null;
   881	  let pressureOverrideApplied = false;
   882	  let pressureWarning: string | null = null;
   883	  let resumeHeuristicApplied = false;
   884	
   885	  if (!detectedIntent && requestedMode !== 'quick') {
   886	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedInput);
   887	    detectedIntent = classification.intent;
   888	    intentConfidence = classification.confidence;
   889	  }
   890	
   891	  if (requestedMode === 'auto') {
   892	    effectiveMode = INTENT_TO_MODE[detectedIntent!] || 'focused';
   893	
   894	    if (normalizedInput.length < 50 || /^(what|how|where|when|why)\s/i.test(normalizedInput)) {
   895	      effectiveMode = 'focused';
   896	    }
   897	
   898	    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
   899	    const hasResumeContext =
   900	      session.resumed ||
   901	      session.priorMode === 'resume' ||
   902	      (
   903	        Boolean(args.specFolder) &&
   904	        normalizedInput.length <= 120 &&
   905	        /\b(next(?:\s+steps?)?|status|state|blockers|where\b|left off|what changed)\b/i.test(normalizedInput)
   906	      );
   907	
   908	    if (hasResumeKeywords || hasResumeContext) {
   909	      effectiveMode = 'resume';
   910	      resumeHeuristicApplied = true;
   911	    }
   912	
   913	    const prePressureMode = effectiveMode;
   914	    if (pressurePolicy.level === 'quick') {
   915	      pressureOverrideTargetMode = 'quick';
   916	    } else if (pressurePolicy.level === 'focused') {
   917	      pressureOverrideTargetMode = 'focused';
   918	    }
   919	
   920	    if (pressureOverrideTargetMode) {
   921	      effectiveMode = pressureOverrideTargetMode;
   922	      pressureOverrideApplied = prePressureMode !== pressureOverrideTargetMode;
   923	
   924	      if (pressureOverrideApplied) {
   925	        pressureWarning = `Pressure policy override applied: ${pressurePolicy.level} pressure (${pressurePolicy.ratio}) forced mode ${pressureOverrideTargetMode} from ${prePressureMode}.`;
   926	      }
   927	    }
   928	  }
   929	
   930	  if (!CONTEXT_MODES[effectiveMode]) {
   931	    effectiveMode = 'focused';
   932	  }
   933	
   934	  return {
   935	    effectiveMode,
   936	    pressureOverrideApplied,
   937	    pressureOverrideTargetMode,
   938	    pressureWarning,
   939	    intentClassification: {
   940	      detectedIntent,
   941	      intentConfidence,
   942	      resumeHeuristicApplied,
   943	      source: explicitIntent ? 'explicit' : 'auto-detected',
   944	    },
   945	  };
   946	}
   947	
   948	function maybeDiscoverSpecFolder(options: ContextOptions, args: ContextArgs): string | undefined {
   949	  if (args.specFolder || !isFolderDiscoveryEnabled()) {
   950	    return undefined;
   951	  }
   952	
   953	  try {
   954	    const basePaths = getSpecsBasePaths();
   955	    const discoveredFolder = discoverSpecFolder(args.input.trim(), basePaths) || undefined;
   956	    if (discoveredFolder) {
   957	      (options as Record<string, unknown>).folderBoost = {
   958	        folder: discoveredFolder,
   959	        factor: parseFloat(process.env.SPECKIT_FOLDER_BOOST_FACTOR || '1.3'),
   960	      };
   961	    }
   962	    return discoveredFolder;
   963	  } catch (error: unknown) {
   964	    console.error(
   965	      '[memory-context] folder discovery failed (non-critical):',
   966	      error instanceof Error ? error.message : String(error),
   967	    );
   968	    return undefined;
   969	  }
   970	}
   971	
   972	async function executeStrategy(
   973	  effectiveMode: string,
   974	  options: ContextOptions,
   975	  args: ContextArgs,
   976	): Promise<ContextResult> {
   977	  const normalizedInput = args.input.trim();
   978	
   979	  switch (effectiveMode) {
   980	    case 'quick':
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Manager
     3	// ───────────────────────────────────────────────────────────────
     4	import crypto from 'crypto';
     5	import fs from 'fs';
     6	import path from 'path';
     7	
     8	import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
     9	// Import working-memory for immediate cleanup on session end (GAP 2).
    10	import * as workingMemory from '../cognitive/working-memory.js';
    11	
    12	// Feature catalog: Session-manager transaction gap fixes
    13	
    14	
    15	/* ───────────────────────────────────────────────────────────────
    16	   1. TYPES
    17	──────────────────────────────────────────────────────────────── */
    18	
    19	interface SessionConfig {
    20	  sessionTtlMinutes: number;
    21	  maxEntriesPerSession: number;
    22	  enabled: boolean;
    23	  dbUnavailableMode: 'allow' | 'block';
    24	}
    25	
    26	interface InitResult {
    27	  success: boolean;
    28	  error?: string;
    29	}
    30	
    31	interface MemoryInput {
    32	  id?: number;
    33	  file_path?: string;
    34	  anchorId?: string;
    35	  anchor_id?: string;
    36	  content_hash?: string;
    37	  title?: string;
    38	}
    39	
    40	interface MarkResult {
    41	  success: boolean;
    42	  hash?: string;
    43	  skipped?: boolean;
    44	  error?: string;
    45	}
    46	
    47	interface MarkBatchResult {
    48	  success: boolean;
    49	  markedCount: number;
    50	  skipped?: boolean;
    51	  error?: string;
    52	}
    53	
    54	interface SessionStats {
    55	  totalSent: number;
    56	  oldestEntry: string | null;
    57	  newestEntry: string | null;
    58	}
    59	
    60	interface FilterResult {
    61	  filtered: MemoryInput[];
    62	  dedupStats: {
    63	    enabled: boolean;
    64	    filtered: number;
    65	    total: number;
    66	    tokenSavingsEstimate?: string;
    67	    sessionId?: string;
    68	  };
    69	}
    70	
    71	interface CleanupResult {
    72	  success: boolean;
    73	  deletedCount: number;
    74	}
    75	
    76	interface StaleCleanupResult {
    77	  success: boolean;
    78	  workingMemoryDeleted: number;
    79	  sentMemoriesDeleted: number;
    80	  sessionStateDeleted: number;
    81	  errors: string[];
    82	}
    83	
    84	interface SessionState {
    85	  sessionId: string;
    86	  status: string;
    87	  specFolder: string | null;
    88	  currentTask: string | null;
    89	  lastAction: string | null;
    90	  contextSummary: string | null;
    91	  pendingWork: string | null;
    92	  tenantId: string | null;
    93	  userId: string | null;
    94	  agentId: string | null;
    95	  data: Record<string, unknown> | null;
    96	  createdAt: string;
    97	  updatedAt: string;
    98	  _recovered: boolean;
    99	}
   100	
   101	interface SessionIdentityScope {
   102	  tenantId?: string | null;
   103	  userId?: string | null;
   104	  agentId?: string | null;
   105	}
   106	
   107	interface SessionStateInput extends SessionIdentityScope {
   108	  specFolder?: string | null;
   109	  currentTask?: string | null;
   110	  lastAction?: string | null;
   111	  contextSummary?: string | null;
   112	  pendingWork?: string | null;
   113	  data?: Record<string, unknown> | null;
   114	}
   115	
   116	interface RecoverResult {
   117	  success: boolean;
   118	  state?: SessionState | null;
   119	  _recovered?: boolean;
   120	  error?: string;
   121	}
   122	
   123	interface InterruptedSession {
   124	  sessionId: string;
   125	  specFolder: string | null;
   126	  currentTask: string | null;
   127	  lastAction: string | null;
   128	  contextSummary: string | null;
   129	  pendingWork: string | null;
   130	  updatedAt: string;
   131	}
   132	
   133	interface InterruptedSessionsResult {
   134	  success: boolean;
   135	  sessions: InterruptedSession[];
   136	  error?: string;
   137	}
   138	
   139	interface ResetResult {
   140	  success: boolean;
   141	  interruptedCount: number;
   142	  error?: string;
   143	}
   144	
   145	interface CheckpointResult {
   146	  success: boolean;
   147	  filePath?: string;
   148	  note?: string;
   149	  error?: string;
   150	}
   151	
   152	interface ContinueSessionInput {
   153	  sessionId: string;
   154	  specFolder?: string | null;
   155	  currentTask?: string | null;
   156	  lastAction?: string | null;
   157	  contextSummary?: string | null;
   158	  pendingWork?: string | null;
   159	  tenantId?: string | null;
   160	  userId?: string | null;
   161	  agentId?: string | null;
   162	  data?: Record<string, unknown> | null;
   163	}
   164	
   165	interface TrustedSessionResolution {
   166	  requestedSessionId: string | null;
   167	  effectiveSessionId: string;
   168	  trusted: boolean;
   169	  error?: string;
   170	}
   171	
   172	/* ───────────────────────────────────────────────────────────────
   173	   2. CONFIGURATION
   174	──────────────────────────────────────────────────────────────── */
   175	
   176	/**
   177	 * Session configuration with defaults from spec.md (R7 mitigation)
   178	 * - Session TTL: 30 minutes
   179	 * - Cap at 100 entries per session
   180	 */
   181	const SESSION_CONFIG: SessionConfig = {
   182	  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
   183	  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
   184	  enabled: process.env.DISABLE_SESSION_DEDUP !== 'true',
   185	  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
   186	};
   187	
   188	/* ───────────────────────────────────────────────────────────────
   189	   3. DATABASE REFERENCE
   190	──────────────────────────────────────────────────────────────── */
   191	
   192	let db: Database | null = null;
   193	// Track periodic cleanup interval for expired sessions
   194	let cleanupInterval: ReturnType<typeof setInterval> | null = null;
   195	const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
   196	
   197	// Track stale session cleanup interval (runs hourly)
   198	let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
   199	const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
   200	const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours
   201	
   202	function init(database: Database): InitResult {
   203	  if (!database) {
   204	    console.error('[session-manager] WARNING: init() called with null database');
   205	    return { success: false, error: 'Database reference is required' };
   206	  }
   207	  db = database;
   208	
   209	  const schemaResult = ensureSchema();
   210	  if (!schemaResult.success) {
   211	    return schemaResult;
   212	  }
   213	
   214	  cleanupExpiredSessions();
   215	
   216	  // Set up periodic cleanup instead of only running once at init (P4-18).
   217	  // Clear any existing interval first (in case of reinitializeDatabase).
   218	  if (cleanupInterval) {
   219	    clearInterval(cleanupInterval);
   220	  }
   221	  cleanupInterval = setInterval(() => {
   222	    try {
   223	      cleanupExpiredSessions();
   224	    } catch (err: unknown) {
   225	      const message = err instanceof Error ? err.message : String(err);
   226	      console.warn(`[session-manager] Periodic cleanup failed: ${message}`);
   227	    }
   228	  }, CLEANUP_INTERVAL_MS);
   229	  // Ensure interval doesn't prevent process exit (unref allows GC on idle)
   230	  if (cleanupInterval && typeof cleanupInterval === 'object' && 'unref' in cleanupInterval) {
   231	    cleanupInterval.unref();
   232	  }
   233	
   234	  // Run stale session cleanup on startup and set up hourly interval
   235	  try {
   236	    cleanupStaleSessions();
   237	  } catch (err: unknown) {
   238	    const message = err instanceof Error ? err.message : String(err);
   239	    console.warn(`[session-manager] Initial stale session cleanup failed: ${message}`);
   240	  }
   241	
   242	  if (staleCleanupInterval) {
   243	    clearInterval(staleCleanupInterval);
   244	  }
   245	  staleCleanupInterval = setInterval(() => {
   246	    try {
   247	      cleanupStaleSessions();
   248	    } catch (err: unknown) {
   249	      const message = err instanceof Error ? err.message : String(err);
   250	      console.warn(`[session-manager] Periodic stale session cleanup failed: ${message}`);
   251	    }
   252	  }, STALE_CLEANUP_INTERVAL_MS);
   253	  if (staleCleanupInterval && typeof staleCleanupInterval === 'object' && 'unref' in staleCleanupInterval) {
   254	    staleCleanupInterval.unref();
   255	  }
   256	
   257	  return { success: true };
   258	}
   259	
   260	function getDb(): Database | null {
     1	"use strict";
     2	// ---------------------------------------------------------------
     3	// MODULE: Generate Context
     4	// ---------------------------------------------------------------
     5	var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
     6	    if (k2 === undefined) k2 = k;
     7	    var desc = Object.getOwnPropertyDescriptor(m, k);
     8	    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
     9	      desc = { enumerable: true, get: function() { return m[k]; } };
    10	    }
    11	    Object.defineProperty(o, k2, desc);
    12	}) : (function(o, m, k, k2) {
    13	    if (k2 === undefined) k2 = k;
    14	    o[k2] = m[k];
    15	}));
    16	var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    17	    Object.defineProperty(o, "default", { enumerable: true, value: v });
    18	}) : function(o, v) {
    19	    o["default"] = v;
    20	});
    21	var __importStar = (this && this.__importStar) || (function () {
    22	    var ownKeys = function(o) {
    23	        ownKeys = Object.getOwnPropertyNames || function (o) {
    24	            var ar = [];
    25	            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    26	            return ar;
    27	        };
    28	        return ownKeys(o);
    29	    };
    30	    return function (mod) {
    31	        if (mod && mod.__esModule) return mod;
    32	        var result = {};
    33	        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
    34	        __setModuleDefault(result, mod);
    35	        return result;
    36	    };
    37	})();
    38	Object.defineProperty(exports, "__esModule", { value: true });
    39	exports.main = main;
    40	exports.readAllStdin = readAllStdin;
    41	exports.parseArguments = parseArguments;
    42	exports.validateArguments = validateArguments;
    43	exports.isValidSpecFolder = isValidSpecFolder;
    44	exports.extractPayloadSpecFolder = extractPayloadSpecFolder;
    45	// ───────────────────────────────────────────────────────────────
    46	// 1. GENERATE CONTEXT
    47	// ───────────────────────────────────────────────────────────────
    48	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
    49	// Node stdlib
    50	const path = __importStar(require("path"));
    51	const fsSync = __importStar(require("fs"));
    52	// Internal modules
    53	const path_security_1 = require("@spec-kit/shared/utils/path-security");
    54	const core_1 = require("../core");
    55	const workflow_1 = require("../core/workflow");
    56	const loaders_1 = require("../loaders");
    57	const collect_session_data_1 = require("../extractors/collect-session-data");
    58	// ───────────────────────────────────────────────────────────────
    59	// 3. HELP TEXT
    60	// ───────────────────────────────────────────────────────────────
    61	const HELP_TEXT = `
    62	Usage: node generate-context.js [options] <input>
    63	
    64	Arguments:
    65	  <input>           A JSON data file path
    66	                    - JSON file mode: node generate-context.js data.json [spec-folder]
    67	
    68	Options:
    69	  --help, -h        Show this help message
    70	  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
    71	  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
    72	  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
    73	
    74	Examples:
    75	  node generate-context.js /tmp/context-data.json
    76	  node generate-context.js /tmp/context-data.json specs/001-feature/
    77	  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
    78	  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
    79	  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
    80	
    81	Output:
    82	  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
    83	  for indexing by the Spec Kit Memory system.
    84	
    85	Preferred save path (JSON-PRIMARY):
    86	  - ALWAYS use --stdin, --json, or a JSON temp file.
    87	  - The AI has strictly better information about its own session than any DB query can reconstruct.
    88	  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
    89	
    90	Direct CLI target rule:
    91	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    92	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    93	    but they must not reroute the save to another folder.
    94	
    95	JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
    96	  {
    97	    "user_prompts": [...],
    98	    "observations": [...],
    99	    "recent_context": [...],
   100	    "toolCalls": [
   101	      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
   102	      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
   103	    ],
   104	    "exchanges": [
   105	      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
   106	    ],
   107	    "preflight": {
   108	      "knowledgeScore": 40,
   109	      "uncertaintyScore": 60,
   110	      "contextScore": 50,
   111	      "timestamp": "ISO-8601",
   112	      "gaps": ["gap1", "gap2"],
   113	      "confidence": 45,
   114	      "readiness": "Needs research"
   115	    },
   116	    "postflight": {
   117	      "knowledgeScore": 75,
   118	      "uncertaintyScore": 25,
   119	      "contextScore": 80,
   120	      "gapsClosed": ["gap1"],
   121	      "newGaps": ["new-gap"]
   122	    }
   123	  }
   124	
   125	  Tool/Exchange enrichment fields (all optional — JSON-mode only):
   126	  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
   127	  - exchanges[]: Key user-assistant exchanges with timestamps
   128	  - These provide richer context than DB extraction since the AI filters noise at source
   129	
   130	  Learning Delta Calculation:
   131	  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
   132	  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
   133	  - Context Delta = postflight.contextScore - preflight.contextScore
   134	  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
   135	`;
   136	if (process.argv.includes('--help') || process.argv.includes('-h')) {
   137	    console.log(HELP_TEXT);
   138	    process.exit(0);
   139	}
   140	// 2.1 SIGNAL HANDLERS
   141	let signalHandlersInstalled = false;
   142	let shuttingDown = false;
   143	// Robustness: signal handler releases locks before reporting
   144	function handleSignalShutdown(signal) {
   145	    if (shuttingDown)
   146	        return; // prevent re-entrant handling
   147	    shuttingDown = true;
   148	    let lockReleaseFailed = false;
   149	    try {
   150	        (0, workflow_1.releaseFilesystemLock)();
   151	    }
   152	    catch (_err) {
   153	        lockReleaseFailed = true;
   154	    }
   155	    console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
   156	    process.exit(lockReleaseFailed ? 1 : 0);
   157	}
   158	function installSignalHandlers() {
   159	    if (signalHandlersInstalled) {
   160	        return;
   161	    }
   162	    process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
   163	    process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
   164	    signalHandlersInstalled = true;
   165	}
   166	// ───────────────────────────────────────────────────────────────
   167	// 4. SPEC FOLDER VALIDATION
   168	// ───────────────────────────────────────────────────────────────
   169	function isUnderApprovedSpecsRoot(normalizedInput) {
   170	    return (0, path_security_1.validateFilePath)(path.resolve(core_1.CONFIG.PROJECT_ROOT, normalizedInput), (0, core_1.getSpecsDirectories)()) !== null;
   171	}
   172	function isValidSpecFolder(folderPath) {
   173	    const folderName = path.basename(folderPath);
   174	    // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
   175	    const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
   176	    // Extract the trailing portion that might be "parent/child"
   177	    const trailingSegments = normalizedInput.split('/');
   178	    // Check if the last two segments both match the spec folder pattern
   179	    if (trailingSegments.length >= 2) {
   180	        const lastTwo = trailingSegments.slice(-2);
   181	        if (core_1.SPEC_FOLDER_PATTERN.test(lastTwo[0]) && core_1.SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
   182	            // Both segments are valid spec folder names — valid nested spec folder
   183	            const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   184	            if (!hasSpecsParent) {
   185	                // Fallback: check if the path resolves to an existing directory under any specs root
   186	                for (const specsDir of (0, core_1.getSpecsDirectories)()) {
   187	                    const candidate = path.join(specsDir, normalizedInput);
   188	                    if (!path.isAbsolute(normalizedInput) &&
   189	                        fsSync.existsSync(candidate) &&
   190	                        (0, path_security_1.validateFilePath)(candidate, (0, core_1.getSpecsDirectories)()) !== null) {
   191	                        return { valid: true };
   192	                    }
   193	                }
   194	                return {
   195	                    valid: false,
   196	                    reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   197	                };
   198	            }
   199	            return { valid: true };
   200	        }
   201	    }
   202	    if (!core_1.SPEC_FOLDER_PATTERN.test(folderName)) {
   203	        if (/^\d{3}-/.test(folderName)) {
   204	            if (/[A-Z]/.test(folderName)) {
   205	                return { valid: false, reason: 'Spec folder name should be lowercase' };
   206	            }
   207	            if (/_/.test(folderName)) {
   208	                return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
   209	            }
   210	            if (!/^[a-z]/.test(folderName.slice(4))) {
   211	                return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
   212	            }
   213	        }
   214	        return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
   215	    }
   216	    const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   217	    if (!hasSpecsParent) {
   218	        // Fallback: check if bare name can be resolved via recursive child search
   219	        // (findChildFolderSync in validateArguments handles this, so just report the error here)
   220	        return {

exec
/bin/zsh -lc 'rg -n "resolveTrustedSession|saveSessionState|cleanupExpiredSessions|cleanupStaleSessions|getInterruptedSessions|continueSession|checkpointSession|effectiveSessionId|mint" .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
167:  effectiveSessionId: string;
214:  cleanupExpiredSessions();
223:      cleanupExpiredSessions();
236:    cleanupStaleSessions();
247:      cleanupStaleSessions();
385:function resolveTrustedSession(
396:      effectiveSessionId: crypto.randomUUID(),
404:      effectiveSessionId: '',
406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
414:      effectiveSessionId: '',
416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
424:      effectiveSessionId: '',
426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
432:    effectiveSessionId: normalizedSessionId,
737:function cleanupExpiredSessions(): CleanupResult {
771:function cleanupStaleSessions(thresholdMs: number = STALE_SESSION_THRESHOLD_MS): StaleCleanupResult {
1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
1193:function getInterruptedSessions(scope: SessionIdentityScope = {}): InterruptedSessionsResult {
1354:function checkpointSession(
1359:  const saveResult = saveSessionState(sessionId, state);
1408:  cleanupExpiredSessions,
1409:  cleanupStaleSessions,
1413:  resolveTrustedSession,
1421:  saveSessionState,
1427:  getInterruptedSessions,
1432:  checkpointSession,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,220p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '396,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Bootstrap Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 024 / Item 7: Composite tool that runs session_resume
     5	// + session_health in one call, merging results with hints.
     6	
     7	import { handleSessionResume } from './session-resume.js';
     8	import type { CachedSessionSummaryDecision } from './session-resume.js';
     9	import { handleSessionHealth } from './session-health.js';
    10	import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
    11	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    12	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    13	import {
    14	  attachStructuralTrustFields,
    15	  buildStructuralContextTrust,
    16	  createSharedPayloadEnvelope,
    17	  summarizeUnknown,
    18	  summarizeCertaintyContract,
    19	  trustStateFromStructuralStatus,
    20	  type SharedPayloadCertainty,
    21	  type SharedPayloadEnvelope,
    22	  type SharedPayloadSection,
    23	  StructuralTrustPayloadError,
    24	  type StructuralTrust,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  coerceSharedPayloadEnvelope,
    29	  type OpenCodeTransportPlan,
    30	} from '../lib/context/opencode-transport.js';
    31	import {
    32	  buildCodeGraphOpsContract,
    33	  type CodeGraphOpsContract,
    34	} from '../lib/code-graph/ops-hardening.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	interface SessionBootstrapArgs {
    42	  specFolder?: string;
    43	}
    44	
    45	interface SessionBootstrapResult {
    46	  resume: Record<string, unknown>;
    47	  health: Record<string, unknown>;
    48	  cachedSummary?: CachedSessionSummaryDecision;
    49	  structuralContext?: StructuralBootstrapContract & StructuralTrust;
    50	  structuralRoutingNudge?: {
    51	    advisory: true;
    52	    readiness: 'ready';
    53	    preferredTool: 'code_graph_query';
    54	    message: string;
    55	    preservesAuthority: 'session_bootstrap';
    56	  };
    57	  payloadContract?: SharedPayloadEnvelope;
    58	  opencodeTransport?: OpenCodeTransportPlan;
    59	  graphOps?: CodeGraphOpsContract;
    60	  hints: string[];
    61	  nextActions: string[];
    62	}
    63	
    64	/* ───────────────────────────────────────────────────────────────
    65	   2. HELPERS
    66	──────────────────────────────────────────────────────────────── */
    67	
    68	function extractData(response: MCPResponse): Record<string, unknown> {
    69	  try {
    70	    const text = response?.content?.[0]?.text;
    71	    if (typeof text === 'string') {
    72	      const parsed = JSON.parse(text);
    73	      return parsed?.data ?? parsed ?? {};
    74	    }
    75	  } catch { /* parse failed */ }
    76	  return {};
    77	}
    78	
    79	function extractHints(data: Record<string, unknown>): string[] {
    80	  if (Array.isArray(data.hints)) return data.hints as string[];
    81	  return [];
    82	}
    83	
    84	function extractCachedSummary(
    85	  data: Record<string, unknown>,
    86	): CachedSessionSummaryDecision | null {
    87	  const candidate = data.cachedSummary;
    88	  if (candidate && typeof candidate === 'object') {
    89	    return candidate as CachedSessionSummaryDecision;
    90	  }
    91	  return null;
    92	}
    93	
    94	function buildNextActions(
    95	  resumeData: Record<string, unknown>,
    96	  healthData: Record<string, unknown>,
    97	  structuralContext: StructuralBootstrapContract,
    98	): string[] {
    99	  const nextActions = new Set<string>();
   100	
   101	  if (resumeData.error) {
   102	    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
   103	  }
   104	
   105	  if (healthData.error) {
   106	    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
   107	  }
   108	
   109	  if (structuralContext.recommendedAction) {
   110	    nextActions.add(structuralContext.recommendedAction);
   111	  }
   112	
   113	  if (structuralContext.status === 'ready') {
   114	    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
   115	  } else if (structuralContext.status === 'stale') {
   116	    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
   117	  } else {
   118	    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
   119	  }
   120	
   121	  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
   122	  if (healthStatus === 'warning' || healthStatus === 'stale') {
   123	    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
   124	  }
   125	
   126	  return [...nextActions].slice(0, 3);
   127	}
   128	
   129	function extractStructuralTrustFromPayload(
   130	  payload: SharedPayloadEnvelope | null,
   131	): StructuralTrust | null {
   132	  if (!payload) {
   133	    return null;
   134	  }
   135	
   136	  const structuralSection = payload.sections.find((section) =>
   137	    section.key === 'structural-context' && section.structuralTrust,
   138	  );
   139	
   140	  return structuralSection?.structuralTrust ?? null;
   141	}
   142	
   143	function buildStructuralRoutingNudge(
   144	  structuralContext: StructuralBootstrapContract,
   145	): SessionBootstrapResult['structuralRoutingNudge'] | null {
   146	  if (structuralContext.status !== 'ready') {
   147	    return null;
   148	  }
   149	
   150	  return {
   151	    advisory: true,
   152	    readiness: 'ready',
   153	    preferredTool: 'code_graph_query',
   154	    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
   155	    preservesAuthority: 'session_bootstrap',
   156	  };
   157	}
   158	
   159	/* ───────────────────────────────────────────────────────────────
   160	   3. HANDLER
   161	──────────────────────────────────────────────────────────────── */
   162	
   163	/** Handle session_bootstrap tool call — one-call session setup */
   164	export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
   165	  const startMs = Date.now();
   166	  const allHints: string[] = [];
   167	
   168	  // Sub-call 1: session_resume with full resume payload
   169	  let resumeData: Record<string, unknown> = {};
   170	  try {
   171	    const resumeResponse = await handleSessionResume({
   172	      specFolder: args.specFolder,
   173	    });
   174	    resumeData = extractData(resumeResponse);
   175	    allHints.push(...extractHints(resumeData));
   176	  } catch (error: unknown) {
   177	    const message = error instanceof Error ? error.message : String(error);
   178	    resumeData = { error: message };
   179	    allHints.push('session_resume failed. Try calling it manually.');
   180	  }
   181	
   182	  // Sub-call 2: session_health
   183	  let healthData: Record<string, unknown> = {};
   184	  try {
   185	    const healthResponse = await handleSessionHealth();
   186	    healthData = extractData(healthResponse);
   187	    allHints.push(...extractHints(healthData));
   188	  } catch (error: unknown) {
   189	    const message = error instanceof Error ? error.message : String(error);
   190	    healthData = { error: message };
   191	    allHints.push('session_health failed. Try calling it manually.');
   192	  }
   193	
   194	  // Phase 027: Structural bootstrap contract
   195	  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
   196	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   197	    allHints.push(
   198	      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
   199	    );
   200	  }
   201	
   202	  const cachedSummary = extractCachedSummary(resumeData);
   203	  if (cachedSummary?.status === 'accepted') {
   204	    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
   205	  }
   206	  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
   207	  if (structuralRoutingNudge) {
   208	    allHints.push(structuralRoutingNudge.message);
   209	  }
   210	
   211	  // Deduplicate hints
   212	  const uniqueHints = [...new Set(allHints)];
   213	
   214	  // Record bootstrap telemetry once for the composite call.
   215	  const durationMs = Date.now() - startMs;
   216	  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
   217	  recordBootstrapEvent('tool', durationMs, completeness);
   218	
   219	  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
   220	  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
   396	/* ───────────────────────────────────────────────────────────────
   397	   3. HANDLER
   398	──────────────────────────────────────────────────────────────── */
   399	
   400	/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
   401	export async function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse> {
   402	  // F052: Record memory recovery metric for session_resume
   403	  recordMetricEvent({ kind: 'memory_recovery' });
   404	
   405	  // Phase 024: Record bootstrap telemetry
   406	  const startMs = Date.now();
   407	  const hints: string[] = [];
   408	
   409	  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
   410	  let memoryResult: Record<string, unknown> = {};
   411	  if (args.minimal) {
   412	    memoryResult = { skipped: true, reason: 'minimal mode' };
   413	  } else {
   414	    try {
   415	      const mcpResponse = await handleMemoryContext({
   416	        input: 'resume previous work continue session',
   417	        mode: 'resume',
   418	        profile: 'resume',
   419	        specFolder: args.specFolder,
   420	      });
   421	      // Extract data from MCP envelope
   422	      if (mcpResponse?.content?.[0]?.text) {
   423	        try {
   424	          const parsed = JSON.parse(mcpResponse.content[0].text);
   425	          memoryResult = parsed?.data ?? parsed ?? {};
   426	        } catch {
   427	          memoryResult = { raw: mcpResponse.content[0].text };
   428	        }
   429	      }
   430	    } catch (error: unknown) {
   431	      const message = error instanceof Error ? error.message : String(error);
   432	      memoryResult = { error: message };
   433	      hints.push('Memory resume failed. Try memory_context manually.');
   434	    }
   435	  }
   436	
   437	  // ── Sub-call 2: Code graph status ───────────────────────────
   438	  let codeGraph: CodeGraphStatus = {
   439	    status: 'error',
   440	    lastScan: null,
   441	    nodeCount: 0,
   442	    edgeCount: 0,
   443	    fileCount: 0,
   444	  };
   445	  try {
   446	    const stats = graphDb.getStats();
   447	    const freshness = getGraphFreshness(process.cwd());
   448	    codeGraph = {
   449	      status: freshness,
   450	      lastScan: stats.lastScanTimestamp,
   451	      nodeCount: stats.totalNodes,
   452	      edgeCount: stats.totalEdges,
   453	      fileCount: stats.totalFiles,
   454	    };
   455	    // Graph status hints deferred to structural contract (Phase 027)
   456	    // — structural context hints at lines 128-130 provide preferred recovery path
   457	  } catch {
   458	    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
   459	    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
   460	  }
   461	
   462	  // ── Sub-call 3: CocoIndex availability (F046/F051: shared helper) ──
   463	  const cocoIndex: CocoIndexStatus = {
   464	    available: isCocoIndexAvailable(),
   465	    binaryPath: '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc',
   466	  };
   467	  if (!cocoIndex.available) {
   468	    hints.push('CocoIndex not installed. Install: `bash .opencode/skill/mcp-coco-index/scripts/install.sh`');
   469	  }
   470	
   471	  // Phase 027: Structural bootstrap contract for resume surface
   472	  const structuralContext = buildStructuralBootstrapContract('session_resume');
   473	  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
   474	    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
   475	  }
   476	
   477	  const structuralTrust = buildStructuralContextTrust(structuralContext);
   478	
   479	  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
   480	  const cachedSummaryDecision = getCachedSessionSummaryDecision({
   481	    specFolder: args.specFolder,
   482	    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
   483	  });
   484	  if (cachedSummaryDecision.status === 'accepted') {
   485	    hints.push('Cached continuity summary accepted as additive resume context.');
   486	  } else {
   487	    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
   488	  }
   489	
   490	  let sessionQuality: SessionResumeResult['sessionQuality'];
   491	  if (args.minimal) {
   492	    try {
   493	      sessionQuality = computeQualityScore().level;
   494	    } catch {
   495	      sessionQuality = 'unknown';
   496	    }
   497	  }
   498	
   499	  const memoryCertainty: SharedPayloadCertainty = args.minimal
   500	    ? 'defaulted'
   501	    : memoryResult.error
   502	      ? 'unknown'
   503	      : 'estimated';
   504	  const cachedCertainty: SharedPayloadCertainty = cachedSummaryDecision.status === 'accepted' ? 'estimated' : 'defaulted';
   505	  const codeGraphCertainty: SharedPayloadCertainty = codeGraph.status === 'error' ? 'unknown' : 'exact';
   506	  const cocoIndexCertainty: SharedPayloadCertainty = 'exact';
   507	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   508	
   509	  const payloadSections: SharedPayloadSection[] = [
   510	    {
   511	      key: 'memory-resume',
   512	      title: 'Memory Resume',
   513	      content: summarizeUnknown(memoryResult),
   514	      source: 'memory',
   515	      certainty: memoryCertainty,
   516	    },
   517	  ];
   518	  if (cachedSummaryDecision.status === 'accepted' && cachedSummaryDecision.cachedSummary) {
   519	    payloadSections.push({
   520	      key: 'cached-continuity',
   521	      title: 'Cached Continuity',
   522	      content: [
   523	        cachedSummaryDecision.cachedSummary.continuityText,
   524	        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
   525	        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
   526	      ].join('\n'),
   527	      source: 'session',
   528	      certainty: cachedCertainty,
   529	    });
   530	  }
   531	  payloadSections.push(
   532	    {
   533	      key: 'code-graph-status',
   534	      title: 'Code Graph Status',
   535	      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
   536	      source: 'code-graph',
   537	      certainty: codeGraphCertainty,
   538	    },
   539	    {
   540	      key: 'cocoindex-status',
   541	      title: 'CocoIndex Status',
   542	      content: cocoIndex.available
   543	        ? `available at ${cocoIndex.binaryPath}`
   544	        : `unavailable; expected at ${cocoIndex.binaryPath}`,
   545	      source: 'semantic',
   546	      certainty: cocoIndexCertainty,
   547	    },
   548	    {
   549	      key: 'structural-context',
   550	      title: 'Structural Context',
   551	      content: structuralContext.summary,
   552	      source: 'code-graph',
   553	      certainty: structuralCertainty,
   554	      structuralTrust,
   555	    },
   556	  );
   557	
   558	  // ── Build composite result ──────────────────────────────────
   559	  const payloadContract = createSharedPayloadEnvelope({
   560	    kind: 'resume',
   561	    sections: payloadSections,
   562	    summary: `Resume payload: ${summarizeCertaintyContract([
   563	      { label: 'memory', certainty: memoryCertainty },
   564	      ...(cachedSummaryDecision.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   565	      { label: 'graph', certainty: codeGraphCertainty },
   566	      { label: 'cocoindex', certainty: cocoIndexCertainty },
   567	      { label: 'structural', certainty: structuralCertainty },
   568	    ])}; graph=${codeGraph.status}; graphStatus=${codeGraph.status}`,
   569	    provenance: {
   570	      producer: 'session_resume',
   571	      sourceSurface: 'session_resume',
   572	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   573	      generatedAt: new Date().toISOString(),
   574	      lastUpdated: structuralContext.provenance?.lastUpdated ?? codeGraph.lastScan,
   575	      sourceRefs: ['memory-context', 'code-graph-db', 'cocoindex-path', 'session-snapshot'],
   576	    },
   577	  });
   578	  const graphOps = buildCodeGraphOpsContract({
   579	    graphFreshness: codeGraph.status as GraphFreshness,
   580	    sourceSurface: 'session_resume',
   581	  });
   582	
   583	  const result: SessionResumeResult = {
   584	    memory: memoryResult,
   585	    codeGraph,
   586	    cocoIndex,
   587	    cachedSummary: cachedSummaryDecision,
   588	    structuralContext,
   589	    payloadContract,
   590	    opencodeTransport: buildOpenCodeTransportPlan({
   591	      resumePayload: payloadContract,
   592	      specFolder: args.specFolder ?? null,
   593	    }),
   594	    graphOps,
   595	    ...(sessionQuality ? { sessionQuality } : {}),
   596	    hints,
   597	  };
   598	
   599	  // Phase 024 / Item 9: Record bootstrap telemetry
   600	  if (!args.minimal) {
   601	    recordBootstrapEvent(
   602	      'tool',
   603	      Date.now() - startMs,
   604	      'full',
   605	    );
   606	  }
   607	
   608	  return {
   609	    content: [{
   610	      type: 'text',
   611	      text: JSON.stringify({ status: 'ok', data: result }, null, 2),
   612	    }],
   613	  };
   614	}

exec
/bin/zsh -lc 'rg -n "user_prompts|recent_context|sessionSummary|summaryText|specFolder|toolCalls|exchanges" .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
88:  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
97:    "user_prompts": [...],
99:    "recent_context": [...],
100:    "toolCalls": [
104:    "exchanges": [
126:  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
127:  - exchanges[]: Key user-assistant exchanges with timestamps
281:    for (const key of ['specFolder', 'spec_folder', 'SPEC_FOLDER']) {
338:    const specFolderArg = explicitTarget || payloadTarget;
339:    if (!specFolderArg) {
340:        throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
344:        specFolderArg,
373:        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
386:        specFolderArg: secondaryArg || null,
392:    const specFolderArg = core_1.CONFIG.SPEC_FOLDER_ARG;
393:    if (!specFolderArg)
395:    const validation = isValidSpecFolder(specFolderArg);
402:    const inputBaseName = path.basename(specFolderArg);
414:    console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
421:            const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && core_1.SPEC_FOLDER_PATTERN.test(n));
429:                const targetBase = path.basename(specFolderArg);
504:        core_1.CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
508:            specFolderArg: core_1.CONFIG.SPEC_FOLDER_ARG ?? undefined,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '380,460p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '720,860p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1010,1095p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1185,1265p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1348,1395p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   380	  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
   381	): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
   382	  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
   383	}
   384	
   385	function resolveTrustedSession(
   386	  requestedSessionId: string | null = null,
   387	  scope: SessionIdentityScope = {},
   388	): TrustedSessionResolution {
   389	  const normalizedSessionId = typeof requestedSessionId === 'string' && requestedSessionId.trim().length > 0
   390	    ? requestedSessionId.trim()
   391	    : null;
   392	
   393	  if (!normalizedSessionId) {
   394	    return {
   395	      requestedSessionId: null,
   396	      effectiveSessionId: crypto.randomUUID(),
   397	      trusted: false,
   398	    };
   399	  }
   400	
   401	  if (!isTrackedSession(normalizedSessionId)) {
   402	    return {
   403	      requestedSessionId: normalizedSessionId,
   404	      effectiveSessionId: '',
   405	      trusted: false,
   406	      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   407	    };
   408	  }
   409	
   410	  const storedIdentity = getSessionIdentityRecord(normalizedSessionId);
   411	  if (!hasCorroboratedIdentity(storedIdentity)) {
   412	    return {
   413	      requestedSessionId: normalizedSessionId,
   414	      effectiveSessionId: '',
   415	      trusted: false,
   416	      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   417	    };
   418	  }
   419	
   420	  const mismatch = getIdentityMismatch(storedIdentity, scope);
   421	  if (mismatch) {
   422	    return {
   423	      requestedSessionId: normalizedSessionId,
   424	      effectiveSessionId: '',
   425	      trusted: false,
   426	      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
   427	    };
   428	  }
   429	
   430	  return {
   431	    requestedSessionId: normalizedSessionId,
   432	    effectiveSessionId: normalizedSessionId,
   433	    trusted: true,
   434	  };
   435	}
   436	
   437	/* ───────────────────────────────────────────────────────────────
   438	   4. SCHEMA MANAGEMENT
   439	──────────────────────────────────────────────────────────────── */
   440	
   441	const SCHEMA_SQL = `
   442	  CREATE TABLE IF NOT EXISTS session_sent_memories (
   443	    session_id TEXT NOT NULL,
   444	    memory_hash TEXT NOT NULL,
   445	    memory_id INTEGER,
   446	    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
   447	    PRIMARY KEY (session_id, memory_hash)
   448	  );
   449	`;
   450	
   451	const INDEX_SQL: string[] = [
   452	  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
   453	  'CREATE INDEX IF NOT EXISTS idx_session_sent_time ON session_sent_memories(sent_at);',
   454	];
   455	
   456	function ensureSchema(): InitResult {
   457	  if (!db) {
   458	    return { success: false, error: 'Database not initialized. Server may still be starting up.' };
   459	  }
   460	
   720	    const excess = count - SESSION_CONFIG.maxEntriesPerSession;
   721	    const deleteStmt = db.prepare(`
   722	      DELETE FROM session_sent_memories
   723	      WHERE session_id = ? AND rowid IN (
   724	        SELECT rowid FROM session_sent_memories
   725	        WHERE session_id = ?
   726	        ORDER BY sent_at ASC
   727	        LIMIT ?
   728	      )
   729	    `);
   730	    deleteStmt.run(sessionId, sessionId, excess);
   731	  } catch (error: unknown) {
   732	    const message = error instanceof Error ? error.message : String(error);
   733	    console.warn(`[session-manager] enforce_entry_limit failed: ${message}`);
   734	  }
   735	}
   736	
   737	function cleanupExpiredSessions(): CleanupResult {
   738	  if (!db) return { success: false, deletedCount: 0 };
   739	
   740	  try {
   741	    const cutoffMs = Date.now() - SESSION_CONFIG.sessionTtlMinutes * 60 * 1000;
   742	    const cutoffIso = new Date(cutoffMs).toISOString();
   743	
   744	    const stmt = db.prepare(`
   745	      DELETE FROM session_sent_memories WHERE sent_at < ?
   746	    `);
   747	    const result = stmt.run(cutoffIso);
   748	
   749	    return { success: true, deletedCount: result.changes };
   750	  } catch (error: unknown) {
   751	    const message = error instanceof Error ? error.message : String(error);
   752	    console.error(`[session-manager] cleanup_expired_sessions failed: ${message}`);
   753	    return { success: false, deletedCount: 0 };
   754	  }
   755	}
   756	
   757	/**
   758	 * T302: Clean up stale sessions across all session-related tables.
   759	 * 
   760	 * Targets:
   761	 *   - working_memory: entries with last_focused older than threshold
   762	 *   - session_sent_memories: entries with sent_at older than threshold
   763	 *   - session_state: completed/interrupted sessions older than threshold
   764	 * 
   765	 * Preserves:
   766	 *   - session_learning records (permanent, never cleaned)
   767	 *   - Active sessions (session_state with status='active')
   768	 * 
   769	 * @param thresholdMs - Inactivity threshold in milliseconds (default: STALE_SESSION_THRESHOLD_MS / 24h)
   770	 */
   771	function cleanupStaleSessions(thresholdMs: number = STALE_SESSION_THRESHOLD_MS): StaleCleanupResult {
   772	  if (!db) {
   773	    return { success: false, workingMemoryDeleted: 0, sentMemoriesDeleted: 0, sessionStateDeleted: 0, errors: ['Database not initialized'] };
   774	  }
   775	
   776	  const errors: string[] = [];
   777	  let workingMemoryDeleted = 0;
   778	  let sentMemoriesDeleted = 0;
   779	  let sessionStateDeleted = 0;
   780	  const cutoffIso = new Date(Date.now() - thresholdMs).toISOString();
   781	
   782	  // 1. Clean stale working_memory entries
   783	  try {
   784	    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
   785	    const wmResult = wmStmt.run(cutoffIso);
   786	    workingMemoryDeleted = wmResult.changes;
   787	  } catch (err: unknown) {
   788	    const msg = err instanceof Error ? err.message : String(err);
   789	    // Table may not exist if working-memory module was never initialized
   790	    if (!msg.includes('no such table')) {
   791	      errors.push(`working_memory cleanup: ${msg}`);
   792	    }
   793	  }
   794	
   795	  // 2. Clean stale session_sent_memories entries
   796	  try {
   797	    const smStmt = db.prepare('DELETE FROM session_sent_memories WHERE sent_at < ?');
   798	    const smResult = smStmt.run(cutoffIso);
   799	    sentMemoriesDeleted = smResult.changes;
   800	  } catch (err: unknown) {
   801	    const msg = err instanceof Error ? err.message : String(err);
   802	    if (!msg.includes('no such table')) {
   803	      errors.push(`session_sent_memories cleanup: ${msg}`);
   804	    }
   805	  }
   806	
   807	  // 3. Clean completed/interrupted session_state entries (NEVER clean active sessions)
   808	  try {
   809	    const ssStmt = db.prepare(
   810	      `DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?`
   811	    );
   812	    const ssResult = ssStmt.run(cutoffIso);
   813	    sessionStateDeleted = ssResult.changes;
   814	  } catch (err: unknown) {
   815	    const msg = err instanceof Error ? err.message : String(err);
   816	    if (!msg.includes('no such table')) {
   817	      errors.push(`session_state cleanup: ${msg}`);
   818	    }
   819	  }
   820	
   821	  const totalDeleted = workingMemoryDeleted + sentMemoriesDeleted + sessionStateDeleted;
   822	  if (totalDeleted > 0) {
   823	    console.error(
   824	      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
   825	      `${sentMemoriesDeleted} sent_memories, ${sessionStateDeleted} session_state entries ` +
   826	      `(threshold: ${Math.round(thresholdMs / 3600000)}h)`
   827	    );
   828	  }
   829	
   830	  if (errors.length > 0) {
   831	    console.warn(`[session-manager] Stale cleanup had ${errors.length} error(s): ${errors.join('; ')}`);
   832	  }
   833	
   834	  return {
   835	    success: errors.length === 0,
   836	    workingMemoryDeleted,
   837	    sentMemoriesDeleted,
   838	    sessionStateDeleted,
   839	    errors,
   840	  };
   841	}
   842	
   843	function clearSession(sessionId: string): CleanupResult {
   844	  if (!db || !sessionId) return { success: false, deletedCount: 0 };
   845	
   846	  try {
   847	    const stmt = db.prepare(`
   848	      DELETE FROM session_sent_memories WHERE session_id = ?
   849	    `);
   850	    const result = stmt.run(sessionId);
   851	
   852	    // Immediately clear working memory for cleared session (GAP 2).
   853	    try {
   854	      workingMemory.clearSession(sessionId);
   855	    } catch (wmErr: unknown) {
   856	      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
   857	      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
   858	    }
   859	
   860	    return { success: true, deletedCount: result.changes };
  1010	      db.exec(indexSql);
  1011	    }
  1012	    return { success: true };
  1013	  } catch (error: unknown) {
  1014	    const message = error instanceof Error ? error.message : String(error);
  1015	    console.error(`[session-manager] Session state schema creation failed: ${message}`);
  1016	    return { success: false, error: message };
  1017	  }
  1018	}
  1019	
  1020	function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
  1021	  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  1022	  if (!sessionId || typeof sessionId !== 'string') {
  1023	    return { success: false, error: 'Valid sessionId is required' };
  1024	  }
  1025	
  1026	  try {
  1027	    ensureSessionStateSchema();
  1028	    const now = new Date().toISOString();
  1029	    const stateData = state.data ? JSON.stringify(state.data) : null;
  1030	    const tenantId = normalizeIdentityValue(state.tenantId);
  1031	    const userId = normalizeIdentityValue(state.userId);
  1032	    const agentId = normalizeIdentityValue(state.agentId);
  1033	
  1034	    const stmt = db.prepare(`
  1035	      INSERT INTO session_state (
  1036	        session_id, status, spec_folder, current_task, last_action,
  1037	        context_summary, pending_work, state_data,
  1038	        tenant_id, user_id, agent_id,
  1039	        created_at, updated_at
  1040	      )
  1041	      VALUES (?, 'active', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  1042	      ON CONFLICT(session_id) DO UPDATE SET
  1043	        status = 'active',
  1044	        spec_folder = COALESCE(excluded.spec_folder, session_state.spec_folder),
  1045	        current_task = COALESCE(excluded.current_task, session_state.current_task),
  1046	        last_action = COALESCE(excluded.last_action, session_state.last_action),
  1047	        context_summary = COALESCE(excluded.context_summary, session_state.context_summary),
  1048	        pending_work = COALESCE(excluded.pending_work, session_state.pending_work),
  1049	        state_data = COALESCE(excluded.state_data, session_state.state_data),
  1050	        tenant_id = COALESCE(excluded.tenant_id, session_state.tenant_id),
  1051	        user_id = COALESCE(excluded.user_id, session_state.user_id),
  1052	        agent_id = COALESCE(excluded.agent_id, session_state.agent_id),
  1053	        updated_at = excluded.updated_at
  1054	    `);
  1055	
  1056	    stmt.run(
  1057	      sessionId,
  1058	      state.specFolder || null,
  1059	      state.currentTask || null,
  1060	      state.lastAction || null,
  1061	      state.contextSummary || null,
  1062	      state.pendingWork || null,
  1063	      stateData,
  1064	      tenantId,
  1065	      userId,
  1066	      agentId,
  1067	      now,
  1068	      now
  1069	    );
  1070	
  1071	    return { success: true };
  1072	  } catch (error: unknown) {
  1073	    const message = error instanceof Error ? error.message : String(error);
  1074	    console.error(`[session-manager] save_session_state failed: ${message}`);
  1075	    return { success: false, error: message };
  1076	  }
  1077	}
  1078	
  1079	function completeSession(sessionId: string): InitResult {
  1080	  if (!db || !sessionId) return { success: false, error: 'Database or sessionId not available' };
  1081	
  1082	  try {
  1083	    const stmt = db.prepare(`
  1084	      UPDATE session_state
  1085	      SET status = 'completed', updated_at = ?
  1086	      WHERE session_id = ?
  1087	    `);
  1088	    stmt.run(new Date().toISOString(), sessionId);
  1089	
  1090	    // Immediately clear working memory for completed session (GAP 2).
  1091	    try {
  1092	      workingMemory.clearSession(sessionId);
  1093	    } catch (wmErr: unknown) {
  1094	      const wmMsg = wmErr instanceof Error ? wmErr.message : String(wmErr);
  1095	      console.warn(`[session-manager] Working memory cleanup for ${sessionId} failed: ${wmMsg}`);
  1185	    return { success: true, state, _recovered: state._recovered };
  1186	  } catch (error: unknown) {
  1187	    const message = error instanceof Error ? error.message : String(error);
  1188	    console.error(`[session-manager] recover_state failed: ${message}`);
  1189	    return { success: false, error: message };
  1190	  }
  1191	}
  1192	
  1193	function getInterruptedSessions(scope: SessionIdentityScope = {}): InterruptedSessionsResult {
  1194	  if (!db) return { success: false, sessions: [], error: 'Database not initialized. Server may still be starting up.' };
  1195	
  1196	  try {
  1197	    ensureSessionStateSchema();
  1198	    const stmt = db.prepare(`
  1199	      SELECT session_id, spec_folder, current_task, last_action,
  1200	             context_summary, pending_work, updated_at,
  1201	             tenant_id, user_id, agent_id
  1202	      FROM session_state
  1203	      WHERE status = 'interrupted'
  1204	      ORDER BY updated_at DESC
  1205	    `);
  1206	    const rows = stmt.all() as Record<string, unknown>[];
  1207	    const filteredRows = rows.filter((row) => {
  1208	      const storedIdentity = {
  1209	        tenantId: normalizeIdentityValue(row.tenant_id),
  1210	        userId: normalizeIdentityValue(row.user_id),
  1211	        agentId: normalizeIdentityValue(row.agent_id),
  1212	      };
  1213	      return getIdentityMismatch(storedIdentity, scope) === null;
  1214	    });
  1215	
  1216	    return {
  1217	      success: true,
  1218	      sessions: filteredRows.map((row) => ({
  1219	        sessionId: row.session_id as string,
  1220	        specFolder: (row.spec_folder as string) || null,
  1221	        currentTask: (row.current_task as string) || null,
  1222	        lastAction: (row.last_action as string) || null,
  1223	        contextSummary: (row.context_summary as string) || null,
  1224	        pendingWork: (row.pending_work as string) || null,
  1225	        updatedAt: row.updated_at as string,
  1226	      })),
  1227	    };
  1228	  } catch (error: unknown) {
  1229	    const message = error instanceof Error ? error.message : String(error);
  1230	    console.error(`[session-manager] get_interrupted_sessions failed: ${message}`);
  1231	    return { success: false, sessions: [], error: message };
  1232	  }
  1233	}
  1234	
  1235	/* ───────────────────────────────────────────────────────────────
  1236	   10. CONTINUE SESSION GENERATION
  1237	──────────────────────────────────────────────────────────────── */
  1238	
  1239	function generateContinueSessionMd(sessionState: ContinueSessionInput): string {
  1240	  const {
  1241	    sessionId,
  1242	    specFolder,
  1243	    currentTask,
  1244	    lastAction,
  1245	    contextSummary,
  1246	    pendingWork,
  1247	    data,
  1248	  } = sessionState;
  1249	
  1250	  const timestamp = new Date().toISOString();
  1251	  const dateStr = new Date().toLocaleDateString('en-US', {
  1252	    weekday: 'long',
  1253	    year: 'numeric',
  1254	    month: 'long',
  1255	    day: 'numeric',
  1256	    hour: '2-digit',
  1257	    minute: '2-digit',
  1258	  });
  1259	
  1260	  const resumeCommand = specFolder
  1261	    ? `/spec_kit:resume ${specFolder}`
  1262	    : sessionId
  1263	      ? `memory_search({ sessionId: "${sessionId}" })`
  1264	      : 'memory_search({ query: "last session" })';
  1265	
  1348	    const message = error instanceof Error ? error.message : String(error);
  1349	    console.error(`[session-manager] write_continue_session_md failed: ${message}`);
  1350	    return { success: false, error: message };
  1351	  }
  1352	}
  1353	
  1354	function checkpointSession(
  1355	  sessionId: string,
  1356	  state: SessionStateInput,
  1357	  specFolderPath: string | null = null
  1358	): CheckpointResult {
  1359	  const saveResult = saveSessionState(sessionId, state);
  1360	  if (!saveResult.success) {
  1361	    return { success: false, error: saveResult.error };
  1362	  }
  1363	
  1364	  const folderPath = specFolderPath || state.specFolder;
  1365	  if (folderPath && fs.existsSync(folderPath)) {
  1366	    return writeContinueSessionMd(sessionId, folderPath);
  1367	  }
  1368	
  1369	  return { success: true, note: 'State saved to SQLite, no spec folder for CONTINUE_SESSION.md' };
  1370	}
  1371	
  1372	/* ───────────────────────────────────────────────────────────────
  1373	   11. SHUTDOWN
  1374	──────────────────────────────────────────────────────────────── */
  1375	
  1376	// Clear all background intervals on shutdown (GAP 1).
  1377	function shutdown(): void {
  1378	  if (cleanupInterval) {
  1379	    clearInterval(cleanupInterval);
  1380	    cleanupInterval = null;
  1381	  }
  1382	  if (staleCleanupInterval) {
  1383	    clearInterval(staleCleanupInterval);
  1384	    staleCleanupInterval = null;
  1385	  }
  1386	}
  1387	
  1388	/* ───────────────────────────────────────────────────────────────
  1389	   12. EXPORTS
  1390	──────────────────────────────────────────────────────────────── */
  1391	
  1392	export {
  1393	  // Initialization
  1394	  init,
  1395	  ensureSchema,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	[← Back to README](../README.md)
     2	
     3	# Architecture
     4	
     5	- [How It Works](#how-it-works)
     6	- [Session Lifecycle](#session-lifecycle)
     7	- [MCP Tools](#mcp-tools)
     8	- [Progressive Disclosure](#progressive-disclosure-3-layer-pattern)
     9	- [Memory Hygiene](#memory-hygiene)
    10	- [Topic Key Workflow](#topic-key-workflow-recommended)
    11	- [Project Structure](#project-structure)
    12	- [CLI Reference](#cli-reference)
    13	
    14	---
    15	
    16	## How It Works
    17	
    18	<p align="center">
    19	  <img src="../assets/agent-save.png" alt="Agent saving a memory via mem_save" width="800" />
    20	  <br />
    21	  <em>The agent proactively calls <code>mem_save</code> after significant work — structured, searchable, no noise.</em>
    22	</p>
    23	
    24	Engram trusts the **agent** to decide what's worth remembering — not a firehose of raw tool calls.
    25	
    26	### The Agent Saves, Engram Stores
    27	
    28	```
    29	1. Agent completes significant work (bugfix, architecture decision, etc.)
    30	2. Agent calls mem_save with a structured summary:
    31	   - title: "Fixed N+1 query in user list"
    32	   - type: "bugfix"
    33	   - content: What/Why/Where/Learned format
    34	3. Engram persists to SQLite with FTS5 indexing
    35	4. Next session: agent searches memory, gets relevant context
    36	```
    37	
    38	---
    39	
    40	## Session Lifecycle
    41	
    42	```
    43	Session starts → Agent works → Agent saves memories proactively
    44	                                    ↓
    45	Session ends → Agent writes session summary (Goal/Discoveries/Accomplished/Files)
    46	                                    ↓
    47	Next session starts → Previous session context is injected automatically
    48	```
    49	
    50	---
    51	
    52	## MCP Tools
    53	
    54	| Tool | Purpose |
    55	|------|---------|
    56	| `mem_save` | Save a structured observation (decision, bugfix, pattern, etc.) |
    57	| `mem_update` | Update an existing observation by ID |
    58	| `mem_delete` | Delete an observation (soft-delete by default, hard-delete optional) |
    59	| `mem_suggest_topic_key` | Suggest a stable `topic_key` for evolving topics before saving |
    60	| `mem_search` | Full-text search across all memories |
    61	| `mem_session_summary` | Save end-of-session summary |
    62	| `mem_context` | Get recent context from previous sessions |
    63	| `mem_timeline` | Chronological context around a specific observation |
    64	| `mem_get_observation` | Get full content of a specific memory |
    65	| `mem_save_prompt` | Save a user prompt for future context |
    66	| `mem_stats` | Memory system statistics |
    67	| `mem_session_start` | Register a session start |
    68	| `mem_session_end` | Mark a session as completed |
    69	| `mem_capture_passive` | Extract learnings from text output |
    70	| `mem_merge_projects` | Merge project name variants into canonical name (admin) |
    71	
    72	---
    73	
    74	## Progressive Disclosure (3-Layer Pattern)
    75	
    76	Token-efficient memory retrieval — don't dump everything, drill in:
    77	
    78	```
    79	1. mem_search "auth middleware"     → compact results with IDs (~100 tokens each)
    80	2. mem_timeline observation_id=42  → what happened before/after in that session
    81	3. mem_get_observation id=42       → full untruncated content
    82	```
    83	
    84	---
    85	
    86	## Memory Hygiene
    87	
    88	- `mem_save` now supports `scope` (`project` default, `personal` optional)
    89	- `mem_save` also supports `topic_key`; with a topic key, saves become upserts (same project+scope+topic updates the existing memory)
    90	- Exact dedupe prevents repeated inserts in a rolling window (hash + project + scope + type + title)
    91	- Duplicates update metadata (`duplicate_count`, `last_seen_at`, `updated_at`) instead of creating new rows
    92	- Topic upserts increment `revision_count` so evolving decisions stay in one memory
    93	- `mem_delete` uses soft-delete by default (`deleted_at`), with optional hard delete
    94	- `mem_search`, `mem_context`, recent lists, and timeline ignore soft-deleted observations
    95	
    96	---
    97	
    98	## Topic Key Workflow (Recommended)
    99	
   100	Use this when a topic evolves over time (architecture, long-running feature decisions, etc.):
   101	
   102	```text
   103	1. mem_suggest_topic_key(type="architecture", title="Auth architecture")
   104	2. mem_save(..., topic_key="architecture-auth-architecture")
   105	3. Later change on same topic -> mem_save(..., same topic_key)
   106	   => existing observation is updated (revision_count++)
   107	```
   108	
   109	Different topics should use different keys (e.g. `architecture/auth-model` vs `bug/auth-nil-panic`) so they never overwrite each other.
   110	
   111	`mem_suggest_topic_key` now applies a family heuristic for consistency across sessions:
   112	
   113	- `architecture/*` for architecture/design/ADR-like changes
   114	- `bug/*` for fixes, regressions, errors, panics
   115	- `decision/*`, `pattern/*`, `config/*`, `discovery/*`, `learning/*` when detected
   116	
   117	---
   118	
   119	## Project Structure
   120	
   121	```
   122	engram/
   123	├── cmd/engram/main.go              # CLI entrypoint
   124	├── internal/
   125	│   ├── store/store.go              # Core: SQLite + FTS5 + all data ops
   126	│   ├── server/server.go            # HTTP REST API (port 7437)
   127	│   ├── mcp/mcp.go                  # MCP stdio server (15 tools)
   128	│   ├── setup/setup.go              # Agent plugin installer (go:embed)
   129	│   ├── project/                     # Project name detection + similarity matching
   130	│   │   └── project.go              # DetectProject, FindSimilar, Levenshtein
   131	│   ├── sync/sync.go                # Git sync: manifest + compressed chunks
   132	│   └── tui/                        # Bubbletea terminal UI
   133	│       ├── model.go                # Screen constants, Model, Init()
   134	│       ├── styles.go               # Lipgloss styles (Catppuccin Mocha)
   135	│       ├── update.go               # Input handling, per-screen handlers
   136	│       └── view.go                 # Rendering, per-screen views
   137	├── plugin/
   138	│   ├── opencode/engram.ts          # OpenCode adapter plugin
   139	│   └── claude-code/                # Claude Code plugin (hooks + skill)
   140	│       ├── .claude-plugin/plugin.json
   141	│       ├── .mcp.json
   142	│       ├── hooks/hooks.json
   143	│       ├── scripts/                # session-start, post-compaction, subagent-stop, session-stop
   144	│       └── skills/memory/SKILL.md
   145	├── skills/                         # Contributor AI skills (repo-wide standards + Engram-specific guardrails)
   146	├── setup.sh                        # Links repo skills into .claude/.codex/.gemini (project-local)
   147	├── assets/                         # Screenshots and media
   148	├── DOCS.md                         # Full technical documentation
   149	├── CONTRIBUTING.md                 # Contribution workflow and standards
   150	├── go.mod
   151	└── go.sum
   152	```
   153	
   154	---
   155	
   156	## CLI Reference
   157	
   158	```
   159	engram setup [agent]      Install/setup agent integration (opencode, claude-code, gemini-cli, codex)
   160	engram serve [port]       Start HTTP API server (default: 7437)
   161	engram mcp                Start MCP server (stdio transport)
   162	engram tui                Launch interactive terminal UI
   163	engram search <query>     Search memories
   164	engram save <title> <msg> Save a memory
   165	engram timeline <obs_id>  Chronological context around an observation
   166	engram context [project]  Recent context from previous sessions
   167	engram stats              Memory statistics
   168	engram export [file]      Export all memories to JSON
   169	engram import <file>      Import memories from JSON
   170	engram sync               Export new memories as compressed chunk to .engram/
   171	engram sync --all         Export ALL projects (ignore directory-based filter)
   172	engram projects list      Show all projects with obs/session/prompt counts
   173	engram projects consolidate  Interactive merge of similar project names [--all] [--dry-run]
   174	engram projects prune     Remove projects with 0 observations [--dry-run]
   175	engram version            Show version
   176	```

exec
/bin/zsh -lc "rg -n \"sessionSummary|producerMetadata|lastSpecFolder|transcriptFingerprint|cacheCreationInputTokens|cacheReadInputTokens\" .opencode/skill/system-spec-kit -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:261:        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:262:        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:46:  lastSpecFolder: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:50:  producerMetadata: HookProducerMetadata | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:55:  lastSpecFolder: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:60:  transcriptFingerprint: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:61:  cacheCreationInputTokens: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:62:  cacheReadInputTokens: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:183:    lastSpecFolder: state.lastSpecFolder,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:185:    extractedAt: state.sessionSummary?.extractedAt ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:187:    producerMetadata: state.producerMetadata,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:220:  const producerMetadata = candidate.producerMetadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:221:  if (!producerMetadata) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:229:  const transcript = producerMetadata.transcript;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:230:  const cacheTokens = producerMetadata.cacheTokens;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:231:  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:242:    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:243:    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:301:  const cachedSpecFolder = normalizeSpecFolder(candidate.lastSpecFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:334:      lastSpecFolder: cachedSpecFolder,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:337:      lastClaudeTurnAt: producerMetadata.lastClaudeTurnAt!,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:339:      transcriptFingerprint: transcript.fingerprint,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:340:      cacheCreationInputTokens: cacheTokens.cacheCreationInputTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:341:      cacheReadInputTokens: cacheTokens.cacheReadInputTokens,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:524:        `Cache tokens: create=${cachedSummaryDecision.cachedSummary.cacheCreationInputTokens}; read=${cachedSummaryDecision.cachedSummary.cacheReadInputTokens}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:525:        `Transcript: ${cachedSummaryDecision.cachedSummary.transcriptFingerprint}`,
.opencode/skill/system-spec-kit/assets/template_mapping.md:322:**Generation:** Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/` to auto-generate properly formatted memory files.
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:58:      'cacheCreationInputTokens',
.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:66:      'cacheReadInputTokens',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:21:    expect(run.process.producerMetadataWritten).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:25:    expect(run.state!.producerMetadata).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:26:    expect(run.state!.producerMetadata!.lastClaudeTurnAt).toBeTruthy();
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:27:    expect(run.state!.producerMetadata!.transcript).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:32:    expect(run.state!.producerMetadata!.transcript!.fingerprint).toHaveLength(16);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:33:    expect(run.state!.producerMetadata!.cacheTokens).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:34:      cacheCreationInputTokens: 40,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:35:      cacheReadInputTokens: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:37:    expect(run.state!.lastSpecFolder).toBe(
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:53:    expect(secondRun.state!.producerMetadata).toEqual(firstRun.state!.producerMetadata);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:82:  if (state?.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:85:      content: `Last active: ${state.lastSpecFolder}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:182:  if (state?.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:25:    cacheCreationInputTokens: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:26:    cacheReadInputTokens: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:33:  lastSpecFolder: string | null;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:34:  sessionSummary: { text: string; extractedAt: string } | null;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:40:  producerMetadata: HookProducerMetadata | null;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:93:  if (scope.specFolder && state.lastSpecFolder !== scope.specFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:227:    lastSpecFolder: null,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:228:    sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:230:    producerMetadata: null,
.opencode/skill/system-spec-kit/SKILL.md:518:  - `sessionSummary` — Free-text session narrative (used for conversation synthesis when conversation prompts are sparse)
.opencode/skill/system-spec-kit/SKILL.md:530:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit/121-script-audit","sessionSummary":"..."}' system-spec-kit/121-script-audit
.opencode/skill/system-spec-kit/SKILL.md:533:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"121-script-audit","sessionSummary":"..."}' 121-script-audit
.opencode/skill/system-spec-kit/SKILL.md:536:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"specs/system-spec-kit/121-script-audit","sessionSummary":"..."}' specs/system-spec-kit/121-script-audit
.opencode/skill/system-spec-kit/SKILL.md:539:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"system-spec-kit","sessionSummary":"..."}' system-spec-kit
.opencode/skill/system-spec-kit/SKILL.md:646:- **JSON-mode conversation synthesis** — When conversation prompts are sparse (e.g., JSON-mode captures with minimal exchange data), conversation content is synthesized from `sessionSummary` field
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:476:  const transcript = state.producerMetadata?.transcript ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:518:    state.producerMetadata?.lastClaudeTurnAt ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:520:    state.lastSpecFolder,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:589:  const transcriptPath = state.producerMetadata?.transcript?.path;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:591:    throw new Error('[session-analytics-db] Cannot ingest session analytics without producerMetadata.transcript.path');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:62:  const specFolder = state?.lastSpecFolder?.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:63:  const summary = state?.sessionSummary?.text?.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:77:    sessionSummary: summary,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:116:  producerMetadataWritten: boolean;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:214:      cacheCreationInputTokens: usage.cacheCreationTokens,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:215:      cacheReadInputTokens: usage.cacheReadTokens,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:227:  let producerMetadataWritten = false;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:236:      producerMetadataWritten,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:267:          producerMetadata: buildProducerMetadata(input.transcript_path as string, usage),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:269:        producerMetadataWritten = true;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:281:    const detectedSpec = detectSpecFolder(input.transcript_path as string, stateBeforeStop?.lastSpecFolder ?? null);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:282:    if (!stateBeforeStop?.lastSpecFolder && detectedSpec) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:283:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:285:    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec === stateBeforeStop.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:287:    } else if (stateBeforeStop?.lastSpecFolder && detectedSpec && detectedSpec !== stateBeforeStop.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:288:      recordStateUpdate(sessionId, { lastSpecFolder: detectedSpec }, touchedPaths);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:292:        `Retargeted autosave spec folder from ${stateBeforeStop.lastSpecFolder} to ${detectedSpec}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:303:      sessionSummary: { text, extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:317:    producerMetadataWritten,
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:32:    lastSpecFolder: 'system-spec-kit/024-compact-code-graph/027-opencode-structural-priming',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:33:    sessionSummary: {
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:360:function renderOverviewSummary(sessionSummary: string, boundarySafeSummary: string): string {
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:361:  const trimmedSummary = sessionSummary.trim();
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:432:    const hasSessionSummary = !!collectedData.sessionSummary;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:502:  const summaryText = collectedData?.sessionSummary || '';
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:557:  // CG-03: JSON-mode explicit data with sessionSummary → high completion
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:560:    const hasSessionSummary = !!collectedData.sessionSummary;
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1350:  // Rec 3: Prefer explicit sessionSummary from JSON over transcript-derived learning
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1351:  const SUMMARY: string = (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 20)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1352:    ? renderOverviewSummary(data.sessionSummary, truncateOnWordBoundary(data.sessionSummary, 500))
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1535:    // Rec 3: Derive title from sessionSummary when available (up to 80 chars, sentence boundary)
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1537:      const summary = typeof data.sessionSummary === 'string' ? data.sessionSummary : '';
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1561:    // RC1: Pass through raw sessionSummary from JSON payload for title candidate
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1562:    _JSON_SESSION_SUMMARY: typeof data.sessionSummary === 'string' ? data.sessionSummary : null,
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:53: * userPrompts are available. Creates User+Assistant exchange pairs from sessionSummary,
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:59:  collectedData: CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'>
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:63:  const sessionSummary = String(collectedData.sessionSummary || '');
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:69:    : sessionSummary.split(/[.!?\n]/)[0]?.trim() || 'Session context save';
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:77:  // Assistant message from full sessionSummary
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:78:  if (sessionSummary.length > 0) {
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:82:      CONTENT: sessionSummary,
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:131:  collectedData: CollectedDataSubset<'userPrompts' | 'observations' | 'sessionSummary' | 'keyDecisions' | 'nextSteps'> | null
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:168:  // Rec 2: When userPrompts are empty but JSON has sessionSummary, build messages from structured data
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:170:  if (userPrompts.length === 0 && collectedData.sessionSummary) {
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:328:  if (!jsonModeHandled && userPrompts.length <= 1 && collectedData.sessionSummary) {
.opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:333:      CONTENT: String(collectedData.sessionSummary),
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:43:    expect(state!.lastSpecFolder).toBe('specs/test');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:96:        lastSpecFolder: 'specs/test',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:97:        sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:99:        producerMetadata: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:109:      expect(loaded!.lastSpecFolder).toBe('specs/test');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:117:      const state = updateState('new-session', { lastSpecFolder: 'specs/new' });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:118:      expect(state.lastSpecFolder).toBe('specs/new');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:121:      expect(state.producerMetadata).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:128:      updateState(testSessionId, { lastSpecFolder: 'specs/first' });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:130:      expect(updated.lastSpecFolder).toBe('specs/first');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:149:          lastSpecFolder: 'specs/matching',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:150:          sessionSummary: { text: 'Summary', extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:152:          producerMetadata: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:162:          lastSpecFolder: 'specs/mismatched',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:174:        expect(state?.lastSpecFolder).toBe('specs/matching');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:200:          lastSpecFolder: 'specs/stale',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:201:          sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:203:          producerMetadata: null,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:77:  if (state?.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:80:      content: `Last active: ${state.lastSpecFolder}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:146:  if (state?.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:100:      updateState(sessionId, { lastSpecFolder: detectedSpec });
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:109:      sessionSummary: { text, extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:66:  if (state?.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:67:    sections.push('', `## Active Spec Folder`, `Last active: ${state.lastSpecFolder}`);
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:39:  transcriptFingerprint: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:40:  cacheCreationInputTokens: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:41:  cacheReadInputTokens: number;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:56:  producerMetadata: WarmStartProducerMetadata | null;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:128:      && scenario.producerMetadata
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:129:      && scenario.producerMetadata.freshness === 'fresh'
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:130:      && scenario.producerMetadata.scope === 'match',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:31:    lastSpecFolder: 'specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:32:    sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:34:    producerMetadata: {
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:43:        cacheCreationInputTokens: 40,
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:44:        cacheReadInputTokens: 20,
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:16:      lastSpecFolder: 'specs/024-compact-code-graph',
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:21:    expect(state!.lastSpecFolder).toBe('specs/024-compact-code-graph');
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:24:    expect(state!.producerMetadata).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:35:      lastSpecFolder: 'specs/test',
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:39:    expect(state!.lastSpecFolder).toBe('specs/test');
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:47:    expect(state!.lastSpecFolder).toBe('specs/b');
.opencode/skill/system-spec-kit/scripts/memory/README.md:67:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:27:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:104:    currentSession.sessionSummary,
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:119:    updateState('session-A', { lastSpecFolder: '/specs/a/' });
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:120:    updateState('session-B', { lastSpecFolder: '/specs/b/' });
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:125:    expect(stateA?.lastSpecFolder).toBe('/specs/a/');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:126:    expect(stateB?.lastSpecFolder).toBe('/specs/b/');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:33:        lastSpecFolder: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:34:        sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:39:        producerMetadata: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:94:        lastSpecFolder: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:95:        sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:97:        producerMetadata: null,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:84:    sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:639:    const payloadSummary = (collectedData.sessionSummary || '').trim();
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:659:        message: `"${savedTitle}" — should reflect sessionSummary`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:857:          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:654:      // Rec 1: Normalize JSON-derived preloaded data so sessionSummary → userPrompts,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:849:      // Phase 002 T010: Clean _JSON_SESSION_SUMMARY (raw sessionSummary title candidate)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1230:      sessionData._JSON_SESSION_SUMMARY || '',  // RC1: raw JSON sessionSummary as first candidate
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1966:          sessionSummary: collectedData.sessionSummary || jsonSessionSummary,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:186:  if (state.lastSpecFolder) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:187:    parts.push(`Last session worked on: ${state.lastSpecFolder}`);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:189:  if (state.sessionSummary?.text) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:190:    parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:151:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:573:  /** RC1: Raw sessionSummary from JSON payload, used as preferred title candidate */
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:126:- [ ] Save context if significant progress: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/validation/phase_checklists.md:159:- [ ] Memory context saved: `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/03-session-start-priming.md:18:The SessionStart hook routes by `source` field from stdin JSON. For `compact`: reads cached payload from hook state, injects, clears cache. For `startup`: outputs Spec Kit Memory tool overview. For `resume`: loads lastSpecFolder from hook state. For `clear`: minimal output. Token budget: 2000 for startup/resume, 4000 for compact.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:29:1. `generate-context.js --json '<data>'` and `generate-context.js --stdin` accept structured JSON with fields like `toolCalls`, `exchanges`, `sessionSummary`, and the documented snake_case contract (`user_prompts`, `recent_context`, `trigger_phrases`).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:37:9. JSON payload fields `sessionSummary`, `triggerPhrases`, `keyDecisions`, and `contextType` now properly flow through to rendered frontmatter via RC1–RC5 fixes (see §3.4).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:64:- **RC1 — sessionSummary title extraction**: When the caller passes `sessionSummary` in the JSON payload, the title is extracted from `_JSON_SESSION_SUMMARY` rather than falling back to a generic or path-derived string.
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/16-json-mode-hybrid-enrichment.md:97:- String length limits: `sessionSummary` (50KB), `triggerPhrases` entries (200 chars), observation narratives (5000 chars).
.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md:140:- Structured JSON runs can synthesize richer assistant conversation content from `sessionSummary`, key decisions, and next steps when prompt arrays are sparse.
.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/19-post-save-quality-review.md:22:1. **Generic title** — The saved `title` frontmatter field matches a known generic pattern (e.g., derived from a file path fragment or is a placeholder) rather than reflecting the caller's `sessionSummary`.
.opencode/skill/system-spec-kit/references/templates/template_guide.md:602:**Creation (JSON mode — preferred):** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"###-name","sessionSummary":"..."}' specs/###-name/`
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:48:        sessionSummary: 'Meaningful implementation session',
.opencode/skill/system-spec-kit/references/templates/level_specifications.md:769:- Use `/memory:save` or `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' specs/###-folder/`
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:87:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/workflows/execution_methods.md:90:echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:21:- **Prompt**: `Validate 249 SessionStart priming (compact) behavior. Run the vitest suite for hook-session-start and confirm: (1) source=compact routes to handleCompact(), (2) cached payload from pendingCompactPrime is read from hook state, (3) stdout contains "Recovered Context (Post-Compaction)" section with the payload, (4) "Recovery Instructions" section mentions 3-source merge, (5) pendingCompactPrime is cleared after injection, (6) lastSpecFolder appears if set in state, (7) output stays within COMPACTION_TOKEN_BUDGET.`
.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/249-session-start-compact.md:28:  - When `state.lastSpecFolder` is set, stdout includes `## Active Spec Folder` with the path
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:84:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:539:function buildPromotedExchangePrompts(exchanges: unknown[], sessionSummary: string): NormalizedUserPrompt[] {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:540:  const sessionSummaryLower = sessionSummary.toLowerCase();
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:548:    if (inputStr.length > 10 && !sessionSummaryLower.includes(inputStr.toLowerCase().slice(0, 50))) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:670:    const sessionSummary = typeof data.sessionSummary === 'string'
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:671:      ? data.sessionSummary
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:732:    if (sessionSummary) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:733:      cloned.observations.push(buildSessionSummaryObservation(sessionSummary, triggerPhrases));
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:819:      const promotedPrompts = buildPromotedExchangePrompts(data.exchanges, sessionSummary);
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:922:  const sessionSummary = typeof data.sessionSummary === 'string'
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:923:    ? data.sessionSummary
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:926:  if (sessionSummary) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:927:    observations.push(buildSessionSummaryObservation(sessionSummary, triggerPhrases));
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:959:    ? buildPromotedExchangePrompts(data.exchanges, sessionSummary || '')
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:967:  // T09b: Use promoted exchange prompts alongside sessionSummary fallback
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:969:    ? [...promotedPrompts, { prompt: sessionSummary || 'Manual context save', timestamp: new Date().toISOString() }]
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:970:    : [{ prompt: sessionSummary || 'Manual context save', timestamp: new Date().toISOString() }];
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:973:    request: sessionSummary || 'Manual context save',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:974:    learning: sessionSummary || ''
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1050:  'sessionSummary', 'session_summary',
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1110:  if (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 50000) {
.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:1111:    errors.push(`sessionSummary exceeds maximum length of 50000 characters (got ${data.sessionSummary.length})`);
.opencode/skill/system-spec-kit/references/config/environment_variables.md:133:node scripts/dist/memory/generate-context.js --json '{"specFolder":"001-feature","sessionSummary":"..."}' specs/001-feature/
.opencode/skill/system-spec-kit/references/config/environment_variables.md:136:DEBUG=1 echo '{"specFolder":"001-feature","sessionSummary":"..."}' | node scripts/dist/memory/generate-context.js --stdin
.opencode/skill/system-spec-kit/references/config/hook_system.md:35:Fields: `claudeSessionId`, `speckitSessionId`, `lastSpecFolder`, `pendingCompactPrime`, `metrics` (prompt/completion tokens, transcript offset).
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:10:      sessionSummary: 'Completed the render-layer fixes and verified the final save output.',
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:43:      sessionSummary: 'The packet still has working-tree edits to finish.',
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:38:| 153-A | JSON mode structured summary hardening | Post-save quality review output verification | `Run generate-context.js --json with a fully-populated payload. Confirm the CLI prints a POST-SAVE QUALITY REVIEW block and that the block reports PASSED with 0 issues. Return a pass/fail verdict.` | 1) Compose a complete JSON payload with `sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType` 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture full stdout 4) Locate the `POST-SAVE QUALITY REVIEW` block 5) Verify it reads `PASSED` with 0 issues | `POST-SAVE QUALITY REVIEW -- PASSED` header visible in stdout, `issues: 0` or equivalent no-issue indicator | CLI stdout log showing REVIEW block | PASS if REVIEW block is present and reports 0 issues; FAIL if block is absent or reports any issues | Check `scripts/core/post-save-review.ts`, `scripts/core/workflow.ts`, and CLI response rendering in `scripts/memory/generate-context.ts` |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:39:| 153-B | JSON mode structured summary hardening | sessionSummary propagates to frontmatter title | `Run generate-context.js --json with sessionSummary set to a meaningful task title (not "Next Steps"). Confirm the rendered memory file's frontmatter title matches the sessionSummary and is not a generic fallback such as "Next Steps".` | 1) Set `sessionSummary` to a descriptive, non-generic string (e.g., "Refactor auth pipeline for token refresh") 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Read the rendered .md frontmatter 4) Assert `title` field matches provided sessionSummary | Frontmatter `title` equals the sessionSummary value; no occurrence of "Next Steps" as the title | Rendered .md frontmatter | PASS if title matches sessionSummary; FAIL if title is "Next Steps" or any other fallback | Inspect input-normalizer title derivation and frontmatter assembly in workflow.ts |
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/153-json-mode-hybrid-enrichment.md:44:| 153-G | JSON mode structured summary hardening | Contamination filter cleans hedging in sessionSummary | `Run generate-context.js --json with sessionSummary containing "I think this might be important" and recentContext containing "As an AI, I should note". Confirm the saved memory does not contain these hedging/meta-commentary phrases.` | 1) Compose payload with hedging text in sessionSummary and meta-commentary in recentContext 2) Run generate-context.js --json 3) Read saved memory file 4) grep for "I think" and "As an AI" 5) Assert neither phrase appears | Saved memory free of hedging and meta-commentary phrases | grep output showing zero matches | PASS if hedging phrases absent from saved memory; FAIL if any contamination survives | Check contamination-filter.ts pattern list and workflow.ts cleaning call sites |
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:218:  --json '{"specFolder":"049-anchor-context-retrieval","sessionSummary":"Implemented anchor retrieval..."}' \
.opencode/skill/system-spec-kit/references/memory/save_workflow.md:222:echo '{"specFolder":"049-anchor-context-retrieval","sessionSummary":"..."}' | \
.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/154-json-primary-deprecation-posture.md:37:| 154 | JSON-primary deprecation posture | Verify JSON-only save contract | `Test the two generate-context.js save paths: (1) --json with valid structured payload should succeed, (2) direct positional without --json/--stdin should reject with migration guidance. Return a pass/fail verdict for each path.` | 1) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"specFolder":"test","sessionSummary":"test"}' <spec-folder>` → expect exit 0 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js <spec-folder>` → expect non-zero exit with migration message | Path 1: exit 0, Path 2: non-zero with guidance | CLI exit codes and stdout/stderr output | PASS if both paths match documented behavior | Check generate-context.ts argument parsing and migration guidance text |
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:93:      sessionSummary: 'Completed runtime hardening.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:326:      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:406:      sessionSummary: 'Session with no next steps.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:417:      sessionSummary: 'Both fields present.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:432:      sessionSummary: 'Edge case: empty first step.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:446:      sessionSummary: 'Critical save should keep the caller-provided tier.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:462:      sessionSummary: 'Temporary save should retain the snake_case override.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:478:      sessionSummary: 'Architecture work should still auto-detect as critical.',
.opencode/skill/system-spec-kit/README.md:158:  --json '{"specFolder":"042-my-feature","sessionSummary":"Implemented login form validation"}' \
.opencode/skill/system-spec-kit/README.md:783:  --json '{"specFolder":"043-user-profile-update","sessionSummary":"Implemented data model and API endpoints. Frontend pending."}' \
.opencode/skill/system-spec-kit/README.md:890:  --json '{"specFolder":"NNN-feature","sessionSummary":"Brief summary of what happened"}'
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:22:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:112:        sessionSummary: 'Importance-tier drift should be detected after save.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:149:        sessionSummary: 'Matching tiers with inline comments should still pass.',
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:29:| 155 | Post-save quality review | JSON mode save with all fields populated correctly | `Run generate-context.js --json with a complete payload containing a meaningful sessionSummary, explicit triggerPhrases, at least 2 keyDecisions, importanceTier="important", and contextType="implementation". Confirm the POST-SAVE QUALITY REVIEW block reports PASSED with 0 issues.` | 1) Compose full JSON payload: `sessionSummary` = descriptive title, `triggerPhrases` = keyword array, `keyDecisions` = 2+ items, `importanceTier` = "important", `contextType` = "implementation" 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert status = PASSED and issues = 0 | `POST-SAVE QUALITY REVIEW -- PASSED` with 0 issues | CLI stdout REVIEW block | PASS if REVIEW shows PASSED and 0 issues; FAIL if any issue is reported for a fully valid payload | Check `scripts/core/post-save-review.ts` for false-positive conditions |
.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md:30:| 155 | Post-save quality review | JSON mode save with generic title | `Run generate-context.js --json where the pipeline produces a generic title instead of a meaningful one. Confirm the POST-SAVE QUALITY REVIEW block reports a [HIGH] title issue with a fix instruction referencing the sessionSummary field.` | 1) Compose payload that would yield a generic title 2) `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>` 3) Capture stdout 4) Locate `POST-SAVE QUALITY REVIEW` block 5) Assert a `[HIGH]` issue is reported for the title field 6) Assert a fix instruction is present | `[HIGH]` severity issue for title; fix instruction references `sessionSummary` | CLI stdout REVIEW block | PASS if HIGH title issue reported with fix; FAIL if no issue or wrong severity | Inspect title-quality check in `scripts/core/post-save-review.ts` and the generic-title detection list |
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:78:    sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:257:        sessionSummary: 'Placeholder contamination should be caught.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:278:        sessionSummary: 'Unsanitized trigger phrases should be caught.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:309:        sessionSummary: 'Continuation saves should carry supersedes lineage.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:329:        sessionSummary: 'Duplicate trigger phrases should be caught.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:381:        sessionSummary: 'This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:403:        sessionSummary: 'Composite blocker should reject one HIGH plus two MEDIUM findings.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:442:        sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:34:    producerMetadata: {
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:37:      transcriptFingerprint: 'aa11bb22cc33dd44',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:38:      cacheCreationInputTokens: 120,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:39:      cacheReadInputTokens: 60,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:65:    producerMetadata: {
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:68:      transcriptFingerprint: 'bb22cc33dd44ee55',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:69:      cacheCreationInputTokens: 90,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:70:      cacheReadInputTokens: 30,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:96:    producerMetadata: {
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:99:      transcriptFingerprint: 'cc33dd44ee55ff66',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:100:      cacheCreationInputTokens: 80,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:101:      cacheReadInputTokens: 25,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:127:    producerMetadata: {
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:130:      transcriptFingerprint: 'dd44ee55ff66aa77',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:131:      cacheCreationInputTokens: 110,
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:132:      cacheReadInputTokens: 55,
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:80:          sessionSummary: 'Implemented the detector provenance taxonomy with additive edge evidence and bounded metadata cleanup.',
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:77:      sessionSummary: 'Implemented the render-layer fixes for canonical sources, trigger phrases, evidence bullets, phase capture, and score naming.',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:101:    lastSpecFolder: scenario.specFolder ?? VALID_SPEC_FOLDER,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:102:    sessionSummary: {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:107:    producerMetadata: {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:116:        cacheCreationInputTokens: 120,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:117:        cacheReadInputTokens: 60,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:189:      lastSpecFolder: options.specFolder ?? VALID_SPEC_FOLDER,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:193:      producerMetadata: {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:202:          cacheCreationInputTokens: 120,
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:203:          cacheReadInputTokens: 60,
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:125:        sessionSummary: 'Verified final output and captured the final session summary.',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:153:        sessionSummary: 'Wrapped up the current implementation pass.',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:174:        sessionSummary: 'Wrapped up the release work and recorded the final follow-through items.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:66:        sessionSummary: 'Patched the structured memory-save schema so explicit authored metadata wins.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:105:        sessionSummary: 'Implemented a fallback save path for the title builder when explicit title is absent.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:36:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:16:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:26:    const result = truncateOnWordBoundary(fixture.sessionSummary, 500);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:28:    const nextChar = fixture.sessionSummary.charAt(keptText.length);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:31:    expect(fixture.sessionSummary.length).toBeGreaterThan(600);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:34:    expect(fixture.sessionSummary.startsWith(keptText)).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:36:    expect(collectSessionDataSource).toContain('truncateOnWordBoundary(data.sessionSummary, 500)');
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:12:    sessionSummary: 'Test session',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:166:      sessionSummary: 'Test',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:174:      sessionSummary: 'Test',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:192:      sessionSummary: 'Test',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:201:      sessionSummary: 'Slow-path metadata propagation test.',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:280:      sessionSummary: 'Patched the fast-path normalizer and verified the save flow end to end.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:92:          sessionSummary: 'Continuation verification for explicit causal links.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:113:          sessionSummary: 'Continuation verification for explicit causal links.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:186:        sessionSummary: 'Regular implementation summary with no lineage signal.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:216:          sessionSummary: 'Continuation request with two equally recent predecessors.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:232:          sessionSummary: 'Continuation request with two equally recent predecessors.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:111:      sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:123:        sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:137:      sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:149:        sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:163:      sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:182:        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:191:        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:231:      sessionSummary: 'Missing target should fail before workflow execution.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:246:      sessionSummary: 'Invalid target should fail validation before workflow execution.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:14:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:15:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:18:      sessionSummary,
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:22:    expect(sessionSummary.length).toBeGreaterThan(500);
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:23:    expect(sessionSummary.length).toBeLessThan(800);
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:24:    expect(sessionData.SUMMARY).toBe(sessionSummary);
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:33:      sessionSummary: longSummary,
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:42:    expect(source).toContain('renderOverviewSummary(data.sessionSummary, truncateOnWordBoundary(data.sessionSummary, 500))');
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:51:    const sessionSummary = 'Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing the StructuralTrust envelope, and locks the provenance plus depth expectations behind a scripts-side frozen fixture floor. Strict packet validation passes.';
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:59:${sessionSummary}
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:74:        sessionSummary,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:37:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:92:          sessionSummary: 'Implemented the follow-on runtime after the planning save.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:412:        sessionSummary: 'Phase 6 mirror drift reviewer fixture.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:434:        sessionSummary: 'Phase 6 clean mirror reviewer fixture.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:466:          sessionSummary: `Trigger fixture for ${expectation.checkId}.`,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:487:        sessionSummary: 'Clean Phase 6 duplication reviewer fixture.',
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:290:      sessionSummary: 'Test session summary',
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:19:      sessionSummary: 'Verified structured file capture counts.',
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:39:      sessionSummary: 'Verified fallback git capture counts.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:130:          sessionSummary: 'Extended continuation run for the lineage fixture.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:73:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:222:      expect(rendered).toContain(fixture.sessionSummary);
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC7-anchor.json:3:  "sessionSummary": "Phase 1 foundation work aligned the OVERVIEW anchor names across the template.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC8-clean.json:5:    "sessionSummary": "This healthy overview proves the reviewer stays quiet when the saved artifact remains internally consistent and the telemetry contract is satisfied end to end.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-path-fragment.json:3:  "sessionSummary": "Phase 3 replay verifies that reusable trigger sanitization strips folder leaks before persistence while preserving the intended memory pipeline phrasing for retrieval.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC6-provenance.json:3:  "sessionSummary": "Phase 2 PR-4 adds JSON-mode git provenance without changing the authored memory narrative.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC4-importance-tier.json:3:  "sessionSummary": "Phase 2 PR-3 validation keeps the importance-tier resolver authoritative while the managed-frontmatter rewrite re-emits both serialized tier locations from the same resolved value. This fixture models the historical drift case where an explicit important-tier save could later be normalized back to a default-looking frontmatter tier if migration treated the serializer as a second authority.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-synthetic-bigrams.json:3:  "sessionSummary": "We reject across 4 prioritization tiers and the full Level 3 spec set while the spec kit validator stays green for adjacent topic extraction.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC2-degraded-fallback.json:3:  "sessionSummary": "Degraded payload with no authored decisions but decision-like prose that should still produce lexical placeholders.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D4.json:5:    "sessionSummary": "This healthy overview proves the reviewer catches tier drift without introducing unrelated findings.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-standalone-stopwords.json:3:  "sessionSummary": "Phase 3 replay proves standalone trigger junk no longer survives the save path when the packet context includes graph and issues language next to a valid mcp surface.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D8.json:5:    "sessionSummary": "This healthy overview proves the reviewer catches anchor drift without introducing unrelated findings.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-003-canonical-trigger.json:3:  "sessionSummary": "Codex-cli-compact audit for tree-sitter and implementation-summary coverage across api cli mcp entry points.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D1.json:5:    "sessionSummary": "This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-suspicious-prefix.json:3:  "sessionSummary": "Phase 3 replay keeps meaningful indexing terms while removing numbered and identifier-shaped junk that previously polluted saved trigger phrases.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC1-truncation.json:3:  "sessionSummary": "Phase 1 foundation work focused on two narrow repairs that improve memory quality without widening the remediation packet into unrelated metadata or reviewer behavior. The first repair aligned the OVERVIEW anchor identity so the table of contents, the HTML anchor, and the internal comment marker all point to the same destination. The second repair extracted a shared truncation helper so long session summaries stop at a clean word boundary and carry the canonical Unicode ellipsis instead of drifting between punctuation styles. The fixture describes a realistic verification pass where the helper was reused by the observation summary path, the OVERVIEW owner adopted the same contract, the compiled CLI replay was exercised with explicit JSON input, and the temporary replay artifacts were removed immediately after the check so the packet memory store stayed clean for the real documentation workflow.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC3-happy-path.json:3:  "sessionSummary": "Phase 3 replay preserves spec kit retrieval language, semantic search adjacency, and the mcp integration topic without introducing junk trigger phrases.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-AC2-authored-decisions.json:3:  "sessionSummary": "Short neutral session summary for decision precedence testing.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-broken-D7.json:5:    "sessionSummary": "This healthy overview proves the reviewer catches missing provenance without introducing unrelated findings.",
.opencode/skill/system-spec-kit/scripts/tests/fixtures/memory-quality/F-DUP-001-trigger-cluster.json:3:  "sessionSummary": "Investigated sibling-memory trigger duplication while keeping the claude optimization settings continuation discoverable for Phase 6.",

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh | sed -n '1,220p'
nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | sed -n '1,220p'
nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/bin/bash
     2	# Engram — SessionStart hook for Claude Code
     3	#
     4	# 1. Ensures the engram server is running
     5	# 2. Creates a session in engram
     6	# 3. Auto-imports git-synced chunks if .engram/manifest.json exists
     7	# 4. Injects Memory Protocol instructions + memory context
     8	
     9	ENGRAM_PORT="${ENGRAM_PORT:-7437}"
    10	ENGRAM_URL="http://127.0.0.1:${ENGRAM_PORT}"
    11	
    12	# Load shared helpers
    13	SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    14	source "${SCRIPT_DIR}/_helpers.sh"
    15	
    16	# Read hook input from stdin
    17	INPUT=$(cat)
    18	SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
    19	CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
    20	OLD_PROJECT=$(basename "$CWD")
    21	PROJECT=$(detect_project "$CWD")
    22	
    23	# Ensure engram server is running
    24	if ! curl -sf "${ENGRAM_URL}/health" --max-time 1 > /dev/null 2>&1; then
    25	  engram serve &>/dev/null &
    26	  sleep 0.5
    27	fi
    28	
    29	# Migrate project name if it changed (one-time, idempotent)
    30	if [ "$OLD_PROJECT" != "$PROJECT" ] && [ -n "$OLD_PROJECT" ] && [ -n "$PROJECT" ]; then
    31	  curl -sf "${ENGRAM_URL}/projects/migrate" \
    32	    -X POST \
    33	    -H "Content-Type: application/json" \
    34	    -d "$(jq -n --arg old "$OLD_PROJECT" --arg new "$PROJECT" \
    35	      '{old_project: $old, new_project: $new}')" \
    36	    > /dev/null 2>&1
    37	fi
    38	
    39	# Create session
    40	if [ -n "$SESSION_ID" ] && [ -n "$PROJECT" ]; then
    41	  curl -sf "${ENGRAM_URL}/sessions" \
    42	    -X POST \
    43	    -H "Content-Type: application/json" \
    44	    -d "$(jq -n --arg id "$SESSION_ID" --arg project "$PROJECT" --arg dir "$CWD" \
    45	      '{id: $id, project: $project, directory: $dir}')" \
    46	    > /dev/null 2>&1
    47	fi
    48	
    49	# Auto-import git-synced chunks
    50	if [ -f "${CWD}/.engram/manifest.json" ]; then
    51	  engram sync --import 2>/dev/null
    52	fi
    53	
    54	# Fetch memory context
    55	ENCODED_PROJECT=$(printf '%s' "$PROJECT" | jq -sRr @uri)
    56	CONTEXT=$(curl -sf "${ENGRAM_URL}/context?project=${ENCODED_PROJECT}" --max-time 3 2>/dev/null | jq -r '.context // empty')
    57	
    58	# Inject Memory Protocol + context — stdout goes to Claude as additionalContext
    59	cat <<'PROTOCOL'
    60	## Engram Persistent Memory — ACTIVE PROTOCOL
    61	
    62	You have engram memory tools. This protocol is MANDATORY and ALWAYS ACTIVE.
    63	
    64	### CORE TOOLS — always available, no ToolSearch needed
    65	mem_save, mem_search, mem_context, mem_session_summary, mem_get_observation, mem_save_prompt
    66	
    67	Use ToolSearch for other tools: mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end, mem_stats, mem_delete, mem_timeline, mem_capture_passive
    68	
    69	### PROACTIVE SAVE — do NOT wait for user to ask
    70	Call `mem_save` IMMEDIATELY after ANY of these:
    71	- Decision made (architecture, convention, workflow, tool choice)
    72	- Bug fixed (include root cause)
    73	- Convention or workflow documented/updated
    74	- Notion/Jira/GitHub artifact created or updated with significant content
    75	- Non-obvious discovery, gotcha, or edge case found
    76	- Pattern established (naming, structure, approach)
    77	- User preference or constraint learned
    78	- Feature implemented with non-obvious approach
    79	- User confirms your recommendation ("dale", "go with that", "sounds good", "sí, esa")
    80	- User rejects an approach or expresses a preference ("no, better X", "I prefer X", "siempre hacé X")
    81	- Discussion concludes with a clear direction chosen
    82	
    83	**Self-check after EVERY task**: "Did I or the user just make a decision, confirm a recommendation, express a preference, fix a bug, learn something, or establish a convention? If yes → mem_save NOW."
    84	
    85	### SEARCH MEMORY when:
    86	- User asks to recall anything ("remember", "what did we do", "acordate", "qué hicimos")
    87	- Starting work on something that might have been done before
    88	- User mentions a topic you have no context on
    89	- User's FIRST message references the project, a feature, or a problem — call `mem_search` with keywords from their message to check for prior work before responding
    90	
    91	### SESSION CLOSE — before saying "done"/"listo":
    92	Call `mem_session_summary` with: Goal, Discoveries, Accomplished, Next Steps, Relevant Files.
    93	PROTOCOL
    94	
    95	# Inject memory context if available
    96	if [ -n "$CONTEXT" ]; then
    97	  printf "\n%s\n" "$CONTEXT"
    98	fi
    99	
   100	exit 0
     1	#!/bin/bash
     2	# Engram — Stop hook for Claude Code (async)
     3	#
     4	# Marks the session as ended via the HTTP API.
     5	# Runs async so it doesn't block Claude's response.
     6	
     7	ENGRAM_PORT="${ENGRAM_PORT:-7437}"
     8	ENGRAM_URL="http://127.0.0.1:${ENGRAM_PORT}"
     9	
    10	INPUT=$(cat)
    11	SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
    12	
    13	if [ -z "$SESSION_ID" ]; then
    14	  exit 0
    15	fi
    16	
    17	curl -sf "${ENGRAM_URL}/sessions/${SESSION_ID}/end" \
    18	  -X POST \
    19	  -H "Content-Type: application/json" \
    20	  -d '{}' \
    21	  > /dev/null 2>&1
    22	
    23	exit 0

 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: Stop Hook — Session Stop
     4	// ───────────────────────────────────────────────────────────────
     5	// Runs on Claude Code Stop event (async). Parses transcript for
     6	// token usage, stores a snapshot, and updates lightweight session state.
     7	
     8	import { spawnSync } from 'node:child_process';
     9	import { createHash } from 'node:crypto';
    10	import { openSync, fstatSync, readSync, closeSync, statSync } from 'node:fs';
    11	import { dirname, resolve } from 'node:path';
    12	import { fileURLToPath } from 'node:url';
    13	import {
    14	  parseHookStdin, hookLog, withTimeout, HOOK_TIMEOUT_MS,
    15	  type HookInput,
    16	} from './shared.js';
    17	import {
    18	  ensureStateDir, loadState, updateState, cleanStaleStates, getStatePath,
    19	  type HookState, type HookProducerMetadata,
    20	} from './hook-state.js';
    21	import { parseTranscript, estimateCost, type TranscriptUsage } from './claude-transcript.js';
    22	
    23	/** Default max age (ms) for stale state cleanup in --finalize mode */
    24	const FINALIZE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
    25	
    26	/** Limit spec-folder detection to the transcript tail where recent messages live. */
    27	const SPEC_FOLDER_TAIL_BYTES = 50 * 1024;
    28	const SPEC_FOLDER_PATH_RE = /(?:\.opencode\/)?specs\/[^\s"'`]+/g;
    29	const SPEC_FOLDER_PREFIXES = ['.opencode/specs/', 'specs/'] as const;
    30	const SPEC_FOLDER_CANONICAL_PREFIX = 'specs/';
    31	const SPEC_FOLDER_SEGMENT_RE = /^\d{2,3}(?:--|-)[\w-]+$/;
    32	const SPEC_FOLDER_NAMESPACE_SEGMENT_RE = /^[a-z][\w-]+$/i;
    33	const HOOK_DIR = dirname(fileURLToPath(import.meta.url));
    34	const AUTOSAVE_TIMEOUT_MS = 4000;
    35	const IS_CLI_ENTRY = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
    36	
    37	function resolveGenerateContextScriptPath(): string | null {
    38	  const explicitPath = process.env.SPECKIT_GENERATE_CONTEXT_SCRIPT;
    39	  const candidates = [
    40	    explicitPath?.trim(),
    41	    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
    42	    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
    43	    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
    44	    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
    45	  ].filter((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0);
    46	
    47	  for (const candidate of candidates) {
    48	    try {
    49	      const fileHandle = openSync(candidate, 'r');
    50	      closeSync(fileHandle);
    51	      return candidate;
    52	    } catch {
    53	      // Candidate missing or unreadable — continue.
    54	    }
    55	  }
    56	
    57	  return null;
    58	}
    59	
    60	function runContextAutosave(sessionId: string): void {
    61	  const state = loadState(sessionId);
    62	  const specFolder = state?.lastSpecFolder?.trim();
    63	  const summary = state?.sessionSummary?.text?.trim();
    64	
    65	  if (!specFolder || !summary) {
    66	    return;
    67	  }
    68	
    69	  const scriptPath = resolveGenerateContextScriptPath();
    70	  if (!scriptPath) {
    71	    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
    72	    return;
    73	  }
    74	
    75	  const payload = {
    76	    specFolder,
    77	    sessionSummary: summary,
    78	    observations: [`Auto-saved from Claude Stop hook for session ${sessionId}.`],
    79	    recent_context: [summary],
    80	    user_prompts: [],
    81	    exchanges: [],
    82	    toolCalls: [],
    83	  };
    84	
    85	  const result = spawnSync(
    86	    process.execPath,
    87	    [scriptPath, '--json', JSON.stringify(payload)],
    88	    {
    89	      cwd: process.cwd(),
    90	      encoding: 'utf-8',
    91	      timeout: AUTOSAVE_TIMEOUT_MS,
    92	      stdio: ['ignore', 'pipe', 'pipe'],
    93	      maxBuffer: 1024 * 1024,
    94	    },
    95	  );
    96	
    97	  if (typeof result.status === 'number' && result.status === 0) {
    98	    hookLog('info', 'session-stop', `Context auto-save completed for ${specFolder}`);
    99	    return;
   100	  }
   101	
   102	  const stderr = (result.stderr ?? '').trim();
   103	  const stdout = (result.stdout ?? '').trim();
   104	  const errorText = stderr || stdout || result.error?.message || `exit=${String(result.status)}`;
   105	  hookLog('warn', 'session-stop', `Context auto-save failed: ${errorText}`);
   106	}
   107	
   108	export interface SessionStopProcessOptions {
   109	  autosaveMode?: 'enabled' | 'disabled';
   110	}
   111	
   112	export interface SessionStopProcessResult {
   113	  touchedPaths: string[];
   114	  parsedMessageCount: number;
   115	  autosaveMode: 'enabled' | 'disabled';
   116	  producerMetadataWritten: boolean;
   117	}
   118	
   119	function recordStateUpdate(
   120	  sessionId: string,
   121	  patch: Partial<HookState>,
   122	  touchedPaths: Set<string>,
   123	): void {
   124	  updateState(sessionId, patch);
   125	  touchedPaths.add(getStatePath(sessionId));
   126	}
   127	
   128	function selectDetectedSpecFolder(
   129	  normalizedMatches: string[],
   130	  currentSpecFolder: string | null,
   131	): string | null {
   132	  const uniqueMatches = [...new Set(normalizedMatches)];
   133	  if (uniqueMatches.length === 0) {
   134	    return null;
   135	  }
   136	
   137	  if (currentSpecFolder && uniqueMatches.includes(currentSpecFolder)) {
   138	    return currentSpecFolder;
   139	  }
   140	
   141	  if (uniqueMatches.length === 1) {
   142	    return uniqueMatches[0];
   143	  }
   144	
   145	  return null;
   146	}
   147	
   148	/**
   149	 * Extract a brief summary from the last assistant message.
   150	 * Truncates to ~200 chars at the nearest sentence boundary.
   151	 */
   152	function extractSessionSummary(message: string): string {
   153	  const trimmed = message.trim();
   154	  if (trimmed.length <= 200) return trimmed;
   155	
   156	  // Find the last sentence-ending punctuation within 200 chars
   157	  const slice = trimmed.slice(0, 200);
   158	  const lastSentenceEnd = Math.max(
   159	    slice.lastIndexOf('. '),
   160	    slice.lastIndexOf('.\n'),
   161	    slice.lastIndexOf('! '),
   162	    slice.lastIndexOf('?\n'),
   163	    slice.lastIndexOf('? '),
   164	  );
   165	
   166	  if (lastSentenceEnd > 80) {
   167	    // Found a reasonable sentence boundary (at least 80 chars in)
   168	    return slice.slice(0, lastSentenceEnd + 1);
   169	  }
   170	
   171	  // No good sentence boundary — hard truncate at 200
   172	  return slice + '...';
   173	}
   174	
   175	/** Store a token snapshot in the hook state (lightweight alternative to SQLite) */
   176	function storeTokenSnapshot(
   177	  sessionId: string,
   178	  usage: { promptTokens: number; completionTokens: number; totalTokens: number; model: string | null },
   179	  cost: number,
   180	): void {
   181	  const state = loadState(sessionId);
   182	  if (!state) return;
   183	
   184	  updateState(sessionId, {
   185	    metrics: {
   186	      estimatedPromptTokens: usage.promptTokens,
   187	      estimatedCompletionTokens: usage.completionTokens,
   188	      lastTranscriptOffset: 0,
   189	    },
   190	  });
   191	
   192	  hookLog('info', 'session-stop', `Token snapshot: ${usage.totalTokens} total (${usage.model ?? 'unknown'}), est. $${cost}`);
   193	}
   194	
   195	function buildProducerMetadata(
   196	  transcriptPath: string,
   197	  usage: TranscriptUsage,
   198	): HookProducerMetadata {
   199	  const transcriptStat = statSync(transcriptPath);
   200	  const fingerprint = createHash('sha256')
   201	    .update(`${transcriptPath}:${transcriptStat.size}:${transcriptStat.mtimeMs}`)
   202	    .digest('hex')
   203	    .slice(0, 16);
   204	
   205	  return {
   206	    lastClaudeTurnAt: transcriptStat.mtime.toISOString(),
   207	    transcript: {
   208	      path: transcriptPath,
   209	      fingerprint,
   210	      sizeBytes: transcriptStat.size,
   211	      modifiedAt: transcriptStat.mtime.toISOString(),
   212	    },
   213	    cacheTokens: {
   214	      cacheCreationInputTokens: usage.cacheCreationTokens,
   215	      cacheReadInputTokens: usage.cacheReadTokens,
   216	    },
   217	  };
   218	}
   219	
   220	export async function processStopHook(
     1	#!/usr/bin/env node
     2	// ───────────────────────────────────────────────────────────────
     3	// MODULE: SessionStart Hook — Session Prime
     4	// ───────────────────────────────────────────────────────────────
     5	// Runs on Claude Code SessionStart event. Injects context via stdout
     6	// based on the session source (compact, startup, resume, clear).
     7	
     8	import { resolve } from 'node:path';
     9	import { fileURLToPath } from 'node:url';
    10	import {
    11	  parseHookStdin, hookLog, formatHookOutput, truncateToTokenBudget,
    12	  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, SESSION_PRIME_TOKEN_BUDGET,
    13	  calculatePressureAdjustedBudget, sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
    14	  type HookInput,
    15	  type OutputSection,
    16	} from './shared.js';
    17	import { ensureStateDir, loadState, readCompactPrime, clearCompactPrime } from './hook-state.js';
    18	import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';
    19	
    20	const CACHE_TTL_MS = 30 * 60 * 1000;
    21	const IS_CLI_ENTRY = process.argv[1]
    22	  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
    23	  : false;
    24	type StartupBrief = {
    25	  graphOutline: string | null;
    26	  sessionContinuity: string | null;
    27	  graphSummary: { files: number; nodes: number; edges: number; lastScan: string | null } | null;
    28	  graphState: 'ready' | 'stale' | 'empty' | 'missing';
    29	  cocoIndexAvailable: boolean;
    30	  startupSurface: string;
    31	};
    32	
    33	// Dynamic import for startup brief builder — may not be available
    34	let buildStartupBrief: (() => StartupBrief) | null = null;
    35	try {
    36	  const mod = await import('../../lib/code-graph/startup-brief.js');
    37	  buildStartupBrief = mod.buildStartupBrief;
    38	} catch {
    39	  // Startup brief module not available — keep static startup output
    40	}
    41	
    42	/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
    43	function handleCompact(sessionId: string): OutputSection[] {
    44	  const state = loadState(sessionId);
    45	  const pendingCompactPrime = readCompactPrime(sessionId);
    46	  if (!pendingCompactPrime) {
    47	    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
    48	    return [{
    49	      title: 'Context Recovery',
    50	      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    51	    }];
    52	  }
    53	
    54	  const { payload, cachedAt } = pendingCompactPrime;
    55	  const cachedAtMs = new Date(cachedAt).getTime();
    56	  const cacheAgeMs = Date.now() - cachedAtMs;
    57	  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    58	    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
    59	    return [{
    60	      title: 'Context Recovery',
    61	      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    62	    }];
    63	  }
    64	
    65	  const sanitizedPayload = sanitizeRecoveredPayload(payload);
    66	  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt, {
    67	    producer: pendingCompactPrime.payloadContract?.provenance.producer,
    68	    trustState: pendingCompactPrime.payloadContract?.provenance.trustState,
    69	    sourceSurface: pendingCompactPrime.payloadContract?.provenance.sourceSurface,
    70	  });
    71	  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);
    72	
    73	  const sections: OutputSection[] = [
    74	    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
    75	    {
    76	      title: 'Recovery Instructions',
    77	      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    78	    },
    79	  ];
    80	
    81	  // Add last spec folder if known
    82	  if (state?.lastSpecFolder) {
    83	    sections.push({
    84	      title: 'Active Spec Folder',
    85	      content: `Last active: ${state.lastSpecFolder}`,
    86	    });
    87	  }
    88	
    89	  return sections;
    90	}
    91	
    92	function buildFallbackStartupSurface(hasCachedContinuity: boolean): string {
    93	  return [
    94	    'Session context received. Current state:',
    95	    '',
    96	    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
    97	    '- Code Graph: unavailable',
    98	    '- CocoIndex: unknown',
    99	    '',
   100	    'What would you like to work on?',
   101	  ].join('\n');
   102	}
   103	
   104	function rewriteStartupMemoryLine(startupSurface: string, hasCachedContinuity: boolean): string {
   105	  return startupSurface.replace(
   106	    /^- Memory: .*$/m,
   107	    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
   108	  );
   109	}
   110	
   111	/** Handle source=startup: prime new session with constitutional memories + overview */
   112	export function handleStartup(
   113	  input: Pick<HookInput, 'session_id'> & { specFolder?: string } = {},
   114	): OutputSection[] {
   115	  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
   116	  const requestedSpecFolder = typeof input.specFolder === 'string' ? input.specFolder : undefined;
   117	  const startupBrief = buildStartupBrief ? buildStartupBrief() : null;
   118	  const cachedSummaryDecision = getCachedSessionSummaryDecision({
   119	    specFolder: requestedSpecFolder,
   120	    claudeSessionId: sessionId,
   121	  });
   122	  if (cachedSummaryDecision.status !== 'accepted') {
   123	    logCachedSummaryDecision('session-prime', cachedSummaryDecision);
   124	  }
   125	
   126	  const sessionContinuity = cachedSummaryDecision.status === 'accepted'
   127	    ? cachedSummaryDecision.cachedSummary?.startupHint ?? null
   128	    : null;
   129	  const startupSurface = startupBrief?.startupSurface
   130	    ? rewriteStartupMemoryLine(startupBrief.startupSurface, Boolean(sessionContinuity))
   131	    : buildFallbackStartupSurface(Boolean(sessionContinuity));
   132	  const sections: OutputSection[] = [
   133	    {
   134	      title: 'Session Context',
   135	      content: startupSurface,
   136	    },
   137	    {
   138	      title: 'Recovery Tools',
   139	      content: [
   140	        '- `memory_context({ input, mode })` — unified context retrieval',
   141	        '- `memory_match_triggers({ prompt })` — fast trigger matching',
   142	        '- `memory_search({ query })` — semantic search',
   143	        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
   144	      ].join('\n'),
   145	    },
   146	  ];
   147	  if (startupBrief?.graphOutline) {
   148	    sections.push({
   149	      title: 'Structural Context',
   150	      content: startupBrief.graphOutline,
   151	    });
   152	  } else if (startupBrief?.graphState === 'empty') {
   153	    sections.push({
   154	      title: 'Structural Context',
   155	      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
   156	    });
   157	  }
   158	
   159	  if (sessionContinuity) {
   160	    sections.push({
   161	      title: 'Session Continuity',
   162	      content: sessionContinuity,
   163	    });
   164	  }
   165	
   166	  if (startupBrief?.graphState === 'stale') {
   167	    sections.push({
   168	      title: 'Stale Code Graph Warning',
   169	      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
   170	    });
   171	  }
   172	
   173	  return sections;
   174	}
   175	
   176	/** Handle source=resume: load resume context for continued session */
   177	function handleResume(sessionId: string): OutputSection[] {
   178	  const state = loadState(sessionId);
   179	  const startupBrief = buildStartupBrief ? buildStartupBrief() : null;
   180	  const sections: OutputSection[] = [];
   181	
   182	  if (state?.lastSpecFolder) {
   183	    sections.push({
   184	      title: 'Session Continuity',
   185	      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
   186	    });
   187	  } else {
   188	    sections.push({
   189	      title: 'Session Resume',
   190	      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
   191	    });
   192	  }
   193	
   194	  return sections;
   195	}
   196	
   197	/** Handle source=clear: minimal output after /clear */
   198	function handleClear(): OutputSection[] {
   199	  return [
   200	    {
   201	      title: 'Fresh Context',
   202	      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
   203	    },
   204	  ];
   205	}
   206	
   207	async function main(): Promise<void> {
   208	  ensureStateDir();
   209	
   210	  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
   211	  if (!input) {
   212	    hookLog('warn', 'session-prime', 'No stdin input received');
   213	    return;
   214	  }
   215	
   216	  const sessionId = input.session_id ?? 'unknown';
   217	  const source = input.source ?? 'startup';
   218	  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);
   219	
   220	  let sections: OutputSection[];

codex
I’ve got enough source coverage to synthesize. I’m doing one last quick check on the memory registry line range I actually used, then I’ll package the output in the exact iteration format with recommendations tied to Engram’s code and our current session stack.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '2004,2024p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2004	- symptom: commit fails with `.git/index.lock`; cause: stale lock or concurrent git process; fix: confirm no active git process, remove stale lock, then retry commit [Task 4]
  2005	- symptom: docs report stale test/playbook counts after fixes; cause: checklist/plan/summary not updated with latest command outputs; fix: update packet docs and evidence logs in the same pass as code/test changes [Task 2][Task 4]
  2006	
  2007	# Task Group: 023 Hybrid-RAG Refinement Forensic Review
  2008	scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
  2009	applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
  2010	
  2011	## Task 1: Run three-agent ultra-think review for 023 documentation drift and severity-ranked findings
  2012	
  2013	### rollout_summary_files
  2014	
  2015	- rollout_summaries/2026-03-04T10-42-27-LKfV-hybrid_rag_fusion_refinement_review.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/04/rollout-2026-03-04T11-42-27-019cb871-1f3b-70b3-89f4-407b0a5dcacb.jsonl, updated_at=2026-03-04T10:51:24+00:00, thread_id=019cb871-1f3b-70b3-89f4-407b0a5dcacb)
  2016	
  2017	### keywords
  2018	
  2019	- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
  2020	
  2021	## User preferences
  2022	
  2023	- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]
  2024	

codex
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
### Finding 1: Engram makes session creation opportunistic at every durable ingress, not just at explicit start
- **Source**: [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts), [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- **What it does**: `handleSave`, `handleSavePrompt`, and `handleSessionSummary` all call `CreateSession()` when `session_id` is missing or not yet registered; the OpenCode plugin also calls `ensureSession()` on `session.created`, before prompt capture, before tool-counting, and before compaction. That means session rows are repaired lazily whenever durable data enters the system instead of assuming `mem_session_start` already ran.
- **Why it matters for us**: Public has stronger trust rules around server-minted sessions via `resolveTrustedSession()`, but it does not expose an equally simple agent-facing “ensure current durable session exists” contract for non-hook clients. Engram’s pattern reduces lifecycle drift when adapters are thin or unreliable.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram splits session closure into two persistence lanes: lightweight session metadata and searchable narrative memory
- **Source**: [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- **What it does**: `EndSession()` writes `ended_at` plus optional `summary` onto the `sessions` row, while `mem_session_summary` separately saves a `session_summary` observation through `AddObservation()`. Those are different survival channels: one powers session lists and lifecycle state, the other remains FTS-searchable and can participate in topic-key logic. Public currently auto-saves a narrative summary through `generate-context.js` from the Claude stop hook, but it does not have a comparable first-class end-of-session API that writes both a lightweight close marker and a searchable narrative in one lifecycle surface.
- **Why it matters for us**: This is the cleanest missing lifecycle primitive in Public. We already preserve rich narrative context better than Engram, but we are flatter at the explicit “session is now closed and summarized” layer.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Engram’s recovery path is simple and deterministic because `FormatContext()` assembles a bounded session package
- **Source**: [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- **What it does**: `FormatContext()` always renders the same structure: recent sessions first, then recent prompts, then recent observations, with fixed windows. The OpenCode compaction hook injects `/context` output and explicitly tells the next agent to call `mem_session_summary`. Public instead recovers through `session_resume` and `session-prime`, where cached continuity is accepted only if transcript fingerprint, producer metadata, freshness window, and spec-folder scope all validate.
- **Why it matters for us**: Engram’s model is easier to port across runtimes because the lifecycle contract is obvious and lightweight. Public’s recovery is more trustworthy, but it is also more runtime-aware and less universal.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Engram treats session rows, prompts, and summaries as sync/export entities, so cross-session continuity is portable rather than purely local
- **Source**: [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go), [docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- **What it does**: `CreateSession()`, `EndSession()`, and `AddPrompt()` all enqueue sync mutations; `Export()` and `Import()` include `sessions`, `observations`, and `prompts`; the HTTP surface exposes `/sessions`, `/prompts`, and `/context` as first-class lifecycle resources. Public’s strongest continuity artifacts today are local hook state, session-state SQLite rows, and memory files produced by `generate-context.js`, which are powerful but less obviously portable as a live session model.
- **Why it matters for us**: This is a real architectural difference, not just packaging. Engram’s session continuity is designed to move across machines and clients as data. Public’s continuity is stronger on trust and richer synthesis, but more local in shape.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Public is stronger on trustworthy recovery, while Engram is stronger on explicit, agent-agnostic session lifecycle APIs
- **Source**: [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [plugin/claude-code/scripts/session-start.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh), [plugin/claude-code/scripts/session-stop.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- **What it does**: Engram gives agents obvious lifecycle verbs: `mem_session_start`, `mem_session_end`, `mem_session_summary`, `mem_context`. Public instead centers on trusted sessions, `memory_context` mode resolution, `session_resume`, `session_bootstrap`, interrupted-session recovery, and cached-summary validation. In practice, Engram is easier to explain to any MCP client; Public is harder to misuse and better at rejecting stale or untrusted continuity.
- **Why it matters for us**: The right move is not to replace Public’s lifecycle core. The gap is the missing thin API layer that makes our stronger internals feel as explicit as Engram’s lifecycle surface.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/setup/plugins/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts)
- [external/plugin/claude-code/scripts/session-start.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh)
- [external/plugin/claude-code/scripts/session-stop.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [mcp_server/lib/session/session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [mcp_server/hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [mcp_server/hooks/claude/session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)
- [scripts/dist/memory/generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.78
- Questions addressed: [2, 7, 8, 9, 10]
- Questions answered: [2, 7, 9, 10 fully; 8 partially through lifecycle-safe adapter evidence]

## Reflection
- What worked: tracing `mem_session_*`, `CreateSession()`, `EndSession()`, `FormatContext()`, prompt persistence, and plugin hooks together exposed Engram’s real lifecycle model much more clearly than the README alone; comparing that directly against `session_resume`, `session_bootstrap`, `session-manager`, and the Claude hooks made the tradeoff between explicit API simplicity and trust-scoped recovery concrete.
- What did not work: CocoIndex was not usable for this Go subtree in this pass, so I fell back to targeted `rg`, `nl`, and direct source inspection. This was a read-only pass, so I did not update phase artifacts.

## Recommended Next Focus
Trace session narrative continuity end to end as a dedicated comparison: Engram’s `mem_save_prompt` plus `/prompts`, `FormatContext()` ordering, `mem_session_summary`, and exported session rows versus Public’s `sessionSummary` hook state, `generate-context.js` JSON-primary save path, cached continuity acceptance gates, and whether we should add a thin explicit MCP session lifecycle surface over the existing trusted recovery core.


hook: Stop
hook: Stop Completed
tokens used
106,491
# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings
### Finding 1: Engram makes session creation opportunistic at every durable ingress, not just at explicit start
- **Source**: [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts), [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- **What it does**: `handleSave`, `handleSavePrompt`, and `handleSessionSummary` all call `CreateSession()` when `session_id` is missing or not yet registered; the OpenCode plugin also calls `ensureSession()` on `session.created`, before prompt capture, before tool-counting, and before compaction. That means session rows are repaired lazily whenever durable data enters the system instead of assuming `mem_session_start` already ran.
- **Why it matters for us**: Public has stronger trust rules around server-minted sessions via `resolveTrustedSession()`, but it does not expose an equally simple agent-facing “ensure current durable session exists” contract for non-hook clients. Engram’s pattern reduces lifecycle drift when adapters are thin or unreliable.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram splits session closure into two persistence lanes: lightweight session metadata and searchable narrative memory
- **Source**: [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- **What it does**: `EndSession()` writes `ended_at` plus optional `summary` onto the `sessions` row, while `mem_session_summary` separately saves a `session_summary` observation through `AddObservation()`. Those are different survival channels: one powers session lists and lifecycle state, the other remains FTS-searchable and can participate in topic-key logic. Public currently auto-saves a narrative summary through `generate-context.js` from the Claude stop hook, but it does not have a comparable first-class end-of-session API that writes both a lightweight close marker and a searchable narrative in one lifecycle surface.
- **Why it matters for us**: This is the cleanest missing lifecycle primitive in Public. We already preserve rich narrative context better than Engram, but we are flatter at the explicit “session is now closed and summarized” layer.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: Engram’s recovery path is simple and deterministic because `FormatContext()` assembles a bounded session package
- **Source**: [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- **What it does**: `FormatContext()` always renders the same structure: recent sessions first, then recent prompts, then recent observations, with fixed windows. The OpenCode compaction hook injects `/context` output and explicitly tells the next agent to call `mem_session_summary`. Public instead recovers through `session_resume` and `session-prime`, where cached continuity is accepted only if transcript fingerprint, producer metadata, freshness window, and spec-folder scope all validate.
- **Why it matters for us**: Engram’s model is easier to port across runtimes because the lifecycle contract is obvious and lightweight. Public’s recovery is more trustworthy, but it is also more runtime-aware and less universal.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Engram treats session rows, prompts, and summaries as sync/export entities, so cross-session continuity is portable rather than purely local
- **Source**: [internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go), [docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- **What it does**: `CreateSession()`, `EndSession()`, and `AddPrompt()` all enqueue sync mutations; `Export()` and `Import()` include `sessions`, `observations`, and `prompts`; the HTTP surface exposes `/sessions`, `/prompts`, and `/context` as first-class lifecycle resources. Public’s strongest continuity artifacts today are local hook state, session-state SQLite rows, and memory files produced by `generate-context.js`, which are powerful but less obviously portable as a live session model.
- **Why it matters for us**: This is a real architectural difference, not just packaging. Engram’s session continuity is designed to move across machines and clients as data. Public’s continuity is stronger on trust and richer synthesis, but more local in shape.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Public is stronger on trustworthy recovery, while Engram is stronger on explicit, agent-agnostic session lifecycle APIs
- **Source**: [internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [plugin/claude-code/scripts/session-start.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh), [plugin/claude-code/scripts/session-stop.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- **What it does**: Engram gives agents obvious lifecycle verbs: `mem_session_start`, `mem_session_end`, `mem_session_summary`, `mem_context`. Public instead centers on trusted sessions, `memory_context` mode resolution, `session_resume`, `session_bootstrap`, interrupted-session recovery, and cached-summary validation. In practice, Engram is easier to explain to any MCP client; Public is harder to misuse and better at rejecting stale or untrusted continuity.
- **Why it matters for us**: The right move is not to replace Public’s lifecycle core. The gap is the missing thin API layer that makes our stronger internals feel as explicit as Engram’s lifecycle surface.
- **Recommendation**: NEW FEATURE
- **Impact**: high

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/setup/plugins/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts)
- [external/plugin/claude-code/scripts/session-start.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh)
- [external/plugin/claude-code/scripts/session-stop.sh](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/handlers/memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [mcp_server/handlers/session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [mcp_server/lib/session/session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [mcp_server/hooks/claude/session-prime.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts)
- [mcp_server/hooks/claude/session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)
- [scripts/dist/memory/generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)

## Assessment
- New information ratio: 0.78
- Questions addressed: [2, 7, 8, 9, 10]
- Questions answered: [2, 7, 9, 10 fully; 8 partially through lifecycle-safe adapter evidence]

## Reflection
- What worked: tracing `mem_session_*`, `CreateSession()`, `EndSession()`, `FormatContext()`, prompt persistence, and plugin hooks together exposed Engram’s real lifecycle model much more clearly than the README alone; comparing that directly against `session_resume`, `session_bootstrap`, `session-manager`, and the Claude hooks made the tradeoff between explicit API simplicity and trust-scoped recovery concrete.
- What did not work: CocoIndex was not usable for this Go subtree in this pass, so I fell back to targeted `rg`, `nl`, and direct source inspection. This was a read-only pass, so I did not update phase artifacts.

## Recommended Next Focus
Trace session narrative continuity end to end as a dedicated comparison: Engram’s `mem_save_prompt` plus `/prompts`, `FormatContext()` ordering, `mem_session_summary`, and exported session rows versus Public’s `sessionSummary` hook state, `generate-context.js` JSON-primary save path, cached continuity acceptance gates, and whether we should add a thin explicit MCP session lifecycle surface over the existing trusted recovery core.
