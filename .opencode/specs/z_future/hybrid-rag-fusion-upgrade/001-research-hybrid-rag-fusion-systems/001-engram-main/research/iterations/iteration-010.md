### Quick Reference: Common Workflows

- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram’s `mem_context` is a deterministic recent-history formatter; Public’s recovery stack is richer, but heavier and less lifecycle-specific
- **Source**: [external/internal/mcp/mcp.go:375](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L375), [external/internal/mcp/mcp.go:883](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L883), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613), [session-resume.ts:400](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L400), [session-bootstrap.ts:163](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts#L163), [session-snapshot.ts:210](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts#L210)
- **What it does**: Engram’s context path is simple: fetch recent sessions, prompts, and observations, then format them into one readable startup block. Public’s recovery path is composite: `session_resume` calls `memory_context(mode="resume")`, adds graph/CocoIndex status and cached continuity, and `session_bootstrap` adds health plus next actions.
- **Why it matters for us**: Engram is weaker overall, but its lifecycle lane is easier to invoke and predict. Public could benefit from a cheap deterministic “recent session digest” inside bootstrap/resume without sacrificing the richer structural and trust-aware recovery layers.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Engram’s end-of-session model is fragmented; we should not copy it as-is
- **Source**: [external/internal/mcp/mcp.go:460](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [external/internal/mcp/mcp.go:1030](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1030), [external/internal/mcp/mcp.go:1084](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1084), [external/internal/mcp/mcp.go:1097](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1097), [session-stop.ts:60](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts#L60), [generate-context.ts:562](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L562)
- **What it does**: In Engram, `mem_session_summary` writes a summary observation and quietly creates the session if needed, while `mem_session_end` separately marks `ended_at`; `mem_capture_passive` can also auto-create/default a session and append learnings. The lifecycle close path is therefore split across multiple independent tools. Public’s close path is different: hooks collect session summary state, then `generate-context.js` runs one authoritative save workflow for the target spec folder.
- **Why it matters for us**: Engram’s model is flexible, but it can leave lifecycle status and saved narrative out of sync. If we add explicit lifecycle tools, they should be atomic over our own state model rather than copying Engram’s separate “summary”, “end”, and “passive capture” verbs.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Public’s session identity model is much safer than Engram’s lifecycle identity model
- **Source**: [external/internal/mcp/mcp.go:518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L518), [external/internal/mcp/mcp.go:545](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L545), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [memory-context.ts:827](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L827)
- **What it does**: Engram accepts caller-supplied session IDs and project names directly for start/end operations. Public rejects invented session IDs unless they match a server-managed session and corroborated identity scope, and it binds reuse to tenant/user/agent identity before allowing resume semantics.
- **Why it matters for us**: This is the main lifecycle safety gap between the two systems. Engram’s explicit lifecycle API is appealing, but its identity model is too trusting for our multi-scope/session-dedup environment.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Our continuity authority is spec-folder-first; Engram’s is session-row-first
- **Source**: [generate-context.ts:75](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L75), [generate-context.ts:368](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L368), [generate-context.ts:423](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L423), [workflow.ts:697](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts#L697), [collect-session-data.ts:1231](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts#L1231), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613)
- **What it does**: Public’s `generate-context.js` explicitly prefers structured JSON input, requires a target spec folder, treats an explicit CLI spec folder as authoritative over payload values, and blocks cross-spec contamination in workflow alignment checks. Engram’s continuity model centers the session row plus project/directory strings, and `FormatContext()` reconstructs startup context from recent sessions/prompts/observations under that project lens.
- **Why it matters for us**: For Public, the durable continuity anchor is the spec folder and its memory artifact, not just a session row. Engram’s model is a better fit for a generic personal memory server than for our spec-scoped continuity contract.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [session-snapshot.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
- [workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
- [collect-session-data.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
- [session-stop.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts)

## Assessment
- New information ratio: 0.63
- Questions addressed: Q1, Q2, Q6, Q8, Q10
- Questions answered: Q1, Q2, Q6, Q8, Q10

## Reflection
- What worked: tracing Engram’s MCP handlers into `CreateSession()`, `EndSession()`, and `FormatContext()` first made the lifecycle contract concrete, then reading our `memory_context` session-trust path plus `session_resume/bootstrap` and `generate-context` clarified exactly where we already exceed Engram.
- What did not work: CocoIndex was not usable in this session, so I had to fall back to `rg` plus direct file reads; the workspace is also read-only, so I did not update the phase folder or save memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s export/import and project merge path against our cached continuity, shared-memory boundaries, and session-state recovery so we can answer whether cross-install/session replay should live in session rows, memory artifacts, or a separate sync lineage layer.

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
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

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
I’m treating this as a read-only deep research pass over Engram and our memory stack, focused specifically on hygiene comparisons against causal links, health tooling, and triggers. I’m starting by loading the governing local instructions and the most relevant source files, then I’ll trace the implementation paths and synthesize only net-new findings beyond the prior iteration.
exec
/bin/zsh -lc "sed -n '1,220p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'pwd && rg -n "engram|hybrid-rag-fusion|topic_key|trigger|causal|health tooling|memory hygiene" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
25:- packet 013 benchmark evidence should cite `38/40` combined benchmark in checklist/report surfaces; stale `pass 28` wording is a known traceability finding trigger [Task 1]
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
165:- when a medium reviewer note remained, the user asked: “fix the remaining trigger-phrase omission before commit if you want the wild save to finish with a completely clean post-save review” -> do not close this workflow with unresolved `PSR-2` warnings [Task 1]
173:- trigger phrase filtering should block short folder-like numeric shorthands while preserving longer numeric authored phrases like `014 code graph upgrades runtime` [Task 1]
174:- `memory-metadata.ts` should read `session_id`/`context_type` from both frontmatter and `## MEMORY METADATA` YAML block so derived causal links (`derived_from`, `supersedes`) still populate on older saves [Task 1]
180:- symptom: valid manual trigger phrase with numeric prefix disappears and causes `PSR-2`; cause: broad `^\\d{1,3}\\s` rejection rule; fix: apply numeric-prefix rejection only when phrase remains short (`<=3` words) [Task 1]
181:- symptom: causal auto-link misses prior session; cause: parser read `session_id` from frontmatter only; fix: parse metadata YAML block too [Task 1]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
701:- /spec_kit/deep-review, 024-compact-code-graph, validate.sh --recursive, check:full, QUALITY_GATE_PASS, trigger_phrases, review-report PASS
798:- symptom: memory save quality gate rejects closeout payload; cause: weak primary evidence + noisy trigger phrases; fix: include explicit files/observations/toolCalls/decisions and clean trigger phrases before rerunning quality validation [Task 1]
847:- `code_graph_query` read paths call readiness checks with `allowInlineFullScan: false`; small stale deltas trigger bounded inline `selective_reindex`, while broader stale/empty conditions should route to explicit `code_graph_scan` [Task 3]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1203:- /spec_kit:deep-research --review, 20 iterations, evidenceGap, handler-memory-triggers.vitest.ts, FEATURE_CATALOG.md
1457:## Task 2: Restore/verify Phase 016 runtime/docs (dedup, projectPhase, trigger filter, retry health, contextType)
1503:- Phase 016 regression checks should include trigger filter export coverage, retry-health snapshot behavior, contextType passthrough, and pre-save dedup docs/tests [Task 2]
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1638:- clampStrength, isFiniteNumber, NaN/infinite rejection, memory_causal_link, causal edges
1653:- Use shared `clampStrength` + finite-number checks for causal-edge strength writes instead of ad-hoc `Math.max/Math.min` clamps [Task 6]
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1859:- requireDbOrThrow, learning-stats-filters.vitest.ts, integration-causal-graph, memory_health autoRepair, verifyIntegrity autoClean, tmp orphan cleanup
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

 succeeded in 0ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work.  **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`** — NEVER manually create memory files.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **Code Search Decision Tree** (MANDATORY):
  - Semantic/concept search → `mcp__cocoindex_code__search` (CocoIndex). Skill: `.opencode/skill/mcp-coco-index/`
  - Structural queries (callers, imports, deps) → `code_graph_query` (Code Graph)
  - Exact text/regex → `Grep`

**GIT WORKFLOW:** 
Full details: `.opencode/skill/sk-git/`
- Worktree setup, conventional commits, PR creation, branch management
- Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | Semantic/concept → `CocoIndex search` · Structural (callers/imports/deps) → `code_graph_query` · Exact text → `Grep` · File paths → `Glob` · Read contents → `Read` |
| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume", specFolder })` → Review checklist → Continue |
| **Save context**          | `/memory:save` OR compose JSON → `generate-context.js --json '<data>' [spec-folder]` → Auto-indexed |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify                            |
| **Web code**              | sk-code-web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → `create.sh --phase` → Populate → Plan first child  |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init state → Loop (@deep-research iterations) → Convergence → Synthesize → Memory save                            |
| **Deep review**           | `/spec_kit:deep-review` → Init state → Loop (@deep-review iterations) → Convergence → Synthesize → Memory save                                |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                            |
| **Constitutional memory** | `/memory:learn` → Constitutional memory manager: create, list, edit, remove, budget                                               |
| **Shared memory**         | `/memory:manage shared` → Shared-memory lifecycle: create spaces, manage memberships, inspect rollout                                    |

## Context Recovery

These recovery steps are universal across Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI.

### After Context Compaction Or `/clear`

1. **FIRST ACTION** — call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`
2. Review the recovered state: current task, spec folder, blockers, and next steps
3. Re-read the active runtime-specific instructions if they exist (`CODEX.md`, `GEMINI.md`, `.claude/CLAUDE.md`, runtime agent docs)
4. Present a concise recovered summary and WAIT for confirmation before proceeding

### Coding Analysis Lenses 

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

#### GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT] BLOCK
Trigger: EACH new user message (re-evaluate even in ongoing conversations)
1. Call `memory_match_triggers(prompt)` → Surface relevant context
2. Classify intent: Research or Implementation
3. Parse request → Check confidence AND uncertainty (see §4)
4. **Dual-threshold:** confidence ≥ 0.70 AND uncertainty ≤ 0.35 → PROCEED. Either fails → INVESTIGATE (max 3 iterations) → ESCALATE. Simple: <40% ASK | 40-69% CAUTION | ≥70% PASS

> Gate 1 is SOFT — if file modification detected, Gate 3 (HARD) takes precedence. Ask spec folder question BEFORE analysis.

####  GATE 2: SKILL ROUTING [REQUIRED for non-trivial tasks]
1. A) Run: `python3 .opencode/skill/scripts/skill_advisor.py "[request]" --threshold 0.8`
2. B) Cite user's explicit direction: "User specified: [exact quote]"
- Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach | User names skill → cite and proceed
- Output: `SKILL ROUTING: [result]` or `SKILL ROUTING: User directed → [name]`
- Skip: trivial queries only (greetings, single-line questions)

#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK — PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Triggers:** rename, move, delete, create, add, remove, update, change, modify, edit, fix, refactor, implement, build, write, generate, configure, analyze, decompose, phase — or any task resulting in file changes
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **DO NOT** use Read/Edit/Write/Bash (except Gate Actions) before asking. ASK FIRST, wait for response, THEN proceed
- **Phase boundary:** Gate 3 answers apply ONLY within current workflow phase. Plan→implement transition MUST re-evaluate. Exception: carry-over IS valid for Memory Save Rule

#### CONSOLIDATED QUESTION PROTOCOL
When multiple inputs are needed, consolidate into a SINGLE prompt — never split across messages. Include only applicable questions; omit when pre-determined.
- **Round-trip optimization** — Only 1 user interaction needed for setup
- **First Message Protocol** — ALL questions asked BEFORE any analysis or tool calls
- **Violation:** Multiple separate prompts → STOP, apologize, re-present as single prompt
- **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading; Level 1 tasks skip completion verification

---

### 🔒 POST-EXECUTION RULES

#### MEMORY SAVE RULE [HARD] BLOCK
Trigger: "save context", "save memory", `/memory:save`, memory file creation
- If spec folder established at Gate 3 → USE IT (don't re-ask). Carry-over applies ONLY to memory saves
- If NO folder and Gate 3 never answered → HARD BLOCK → Ask user
- **Script:** `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
  - AI composes structured JSON with session context, writes to `/tmp/save-context-data.json`, passes as first arg. Alternatively use `--json '<inline-json>'` or `--stdin`. The AI has strictly better information about its own session than any DB extraction.
  - Subfolder: `003-parent/121-child` or bare `121-child` (auto-searches parents)
- **Indexing:** For immediate MCP visibility after save: `memory_index_scan({ specFolder })` or `memory_save()`
- **Violation:** Write tool on `memory/` path → DELETE and re-run via script
- **Post-Save Review:** After `generate-context.js` completes, check the POST-SAVE QUALITY REVIEW output.
  - **HIGH** issues: MUST manually patch via Edit tool (fix title, trigger_phrases, importance_tier)
  - **MEDIUM** issues: patch when practical
  - **PASSED/SKIPPED**: no action needed

#### COMPLETION VERIFICATION RULE [HARD] BLOCK
Trigger: Claiming "done", "complete", "finished", "works"
1. Validation runs automatically on spec folder (if exists)
2. Load `checklist.md` → Verify ALL items → Mark `[x]` with evidence
- Skip: Level 1 tasks (no checklist.md required) | Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix)

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT

#### Self-Check (before ANY tool-using response):
- [ ] File modification? Asked spec folder question?
- [ ] Skill routing verified?
- [ ] Saving memory? Using `generate-context.js` (not Write tool)?
- [ ] Aligned with ORIGINAL request? No scope drift?
- [ ] Claiming completion? `checklist.md` verified?

---

## 3. 📝 CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details:** system-spec-kit SKILL.md (§1 When to Use, §3 How it Works, §4 Rules)

### Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500           | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

> **Note:** `implementation-summary.md` is REQUIRED for all levels but created **after implementation completes**, not at spec folder creation time. See SKILL.md §4 Rule 13.

**Rules:** When in doubt → higher level. LOC is soft guidance (risk/complexity can override). Single typo/whitespace fixes (<5 characters in one file) are exempt.

**Spec folder path:** `specs/[###-short-name]/` | **Templates:** `.opencode/skill/system-spec-kit/templates/`

**For details on:** folder structure, `scratch/` vs `memory/` usage, sub-folder versioning, checklist verification (P0/P1/P2), and completion workflow — see system-spec-kit SKILL.md §3.

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

**Core Principle:** If confidence < 80%, pause and ask for clarification with multiple-choice options.

| Confidence   | Action                                       |
| ------------ | -------------------------------------------- |
| **≥80%**     | Proceed with citable source                  |
| **40-79%**   | Proceed with caveats                         |
| **<40%**     | Ask for clarification or mark "UNKNOWN"      |
| **Override** | Blockers/conflicts → ask regardless of score |

**Logic-Sync Protocol:** On contradiction (Spec vs Code, conflicting requirements) → HALT → Report "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]" → Ask "Which truth prevails?"

**Escalation:** Confidence stays <80% after two failed attempts → ask with 2-3 options. Blockers beyond control → escalate with evidence and proposed next step.

---

## 5. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK


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
/bin/zsh -lc "rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/agent-save.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-detail.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-search.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-recent.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-dashboard.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/commit-hygiene/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/ui-elements/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/cultural-norms/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/pr-review-deep/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/backlog-triage/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/branch-pr/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/catalog.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/testing-coverage/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/sdd-flow/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/visual-language/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/memory-protocol/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/project-structure/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/dashboard-htmx/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/architecture-guardrails/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/docs-alignment/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.mod
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CODEOWNERS
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/gentleman-bubbletea/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.sum
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/intended-usage.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/INSTALLATION.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/COMPARISON.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/plugin-thin/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/server-api/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/gentle-creation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/business-rules/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/tui-quality/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/wrap_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/styles.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-005.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-006.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-007.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-008.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/hooks/hooks.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/version/check.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/version/check_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/manifest.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/esbuild.config.mjs
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/_helpers.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/subagent-stop.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/sync.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/settings.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/main.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/generate.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts

codex
I’ve loaded the repo-level and Engram-local instructions and confirmed the phase already has prior iteration files, so I’m now tracing the hygiene-specific code paths directly. Next I’m pulling the exact Engram handlers and store routines around topic keys, duplicate suppression, search ranking, and project merge, then I’ll map them against our trigger, causal, and health surfaces to isolate genuinely new deltas.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### Finding 2: Engram’s progressive disclosure is better at “show me the surrounding session” than Public’s current pagination
- **Source**: [external/internal/mcp/mcp.go#L415](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L415), [external/internal/mcp/mcp.go#L441](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L441), [external/docs/ARCHITECTURE.md#L74](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md#L74), [progressive-disclosure.ts#L346](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts#L346), [progressive-disclosure.ts#L432](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts#L432), [memory-search.ts#L1023](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1023)
- **What it does**: Engram’s retrieval path is `mem_search` preview -> `mem_timeline` around one observation -> `mem_get_observation` full body. Public already has summary/snippet/cursor progressive disclosure, but its follow-up step is pagination, not chronology around a chosen hit.
- **Why it matters for us**: Public is more token-efficient at scale, but it still lacks a dedicated “local timeline around result X” retrieval affordance. That would pair well with session continuity and make hit-followup more precise than generic continuation pages.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Engram’s core search is a useful lexical safety baseline, but it is not strong enough to replace Public’s hybrid retrieval stack
- **Source**: [external/internal/store/store.go#L1518](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [external/internal/store/store.go#L3382](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3382), [pipeline/README.md#L34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md#L34), [hybrid-search.ts#L450](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L450), [hybrid-search.ts#L972](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L972)
- **What it does**: Engram sanitizes user input into quoted FTS5 terms and orders results by `fts.rank`, with the `topic_key` shortcut as the only strong override. Public’s `memory_search` runs a staged pipeline with hybrid candidate generation, signal fusion, reranking, evidence-gap annotation, and weighted FTS/BM25 alongside vector and graph channels.
- **Why it matters for us**: Engram’s search is easier to reason about, but it would be a downgrade for Public’s memory retrieval quality. The right import is its deterministic key shortcut and input-hardening mindset, not its ranking model.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Public’s retrieval architecture is intentionally split across memory, semantic code search, and structural graph search; Engram should not collapse that separation
- **Source**: [external/internal/mcp/mcp.go#L124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L124), [context-server.ts#L755](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [context-server.ts#L790](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L790), [memory-context.ts#L1452](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1452), [code-graph/query.ts#L326](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts#L326)
- **What it does**: Engram presents one memory-oriented MCP surface. Public explicitly routes semantic code questions toward CocoIndex, structural dependency/caller questions toward `code_graph_query`, and session/memory recall toward `memory_search` and `memory_context`.
- **Why it matters for us**: This split is one of Public’s biggest retrieval advantages. Engram’s model is good for persistent memory, but it has no equivalent to our semantic code lane or graph lane, so its single-surface simplicity should not become a design target for code retrieval.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Public’s retrieval safety boundaries are materially stronger than Engram’s project-scoped filtering
- **Source**: [external/internal/mcp/mcp.go#L625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L625), [external/internal/store/store.go#L1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [memory-search.ts#L531](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L531), [progressive-disclosure.ts#L367](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts#L367), [memory-triggers.ts#L207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L207), [memory-triggers.ts#L291](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L291)
- **What it does**: Engram narrows retrieval with normalized `project` and optional `scope`. Public binds search continuation to a serialized scope key, validates caller-supplied session IDs against server-trusted sessions, and fail-closes trigger matches when scope filtering cannot be enforced.
- **Why it matters for us**: Once retrieval includes cursors, dedup, and multi-agent continuity, string-level project scoping is not enough. Engram’s ergonomics are fine, but its retrieval boundary model is weaker than Public’s tenant/user/agent/shared-space discipline.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [code-graph/query.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts)
- [progressive-disclosure.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)
- [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [pipeline/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md)

## Assessment
- New information ratio: 0.68
- Questions addressed: Q3, Q5, Q8, Q9, Q10
- Questions answered: Q3, Q5, Q8, Q9, Q10

## Reflection
- What worked: tracing `Search()` and MCP registration first exposed Engram’s real retrieval contract quickly, and reading Public’s `memory_search` pipeline plus routing/graph handlers made the comparison concrete instead of architectural hand-waving.
- What did not work: CocoIndex was not usable in this session, so I fell back to `rg` plus direct file reads; the filesystem is also read-only here, so I did not update the phase folder or save memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s export/import and sync replay next, then compare that against Public’s session bootstrap/resume and shared-scope retrieval to see whether stable topic keys survive cross-install merges without weakening Public’s stronger scope and provenance model.

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
# Iteration 009: COMPARISON - LIFECYCLE


exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) (AddObservation|Search|FormatContext|SuggestTopicKey|CreateSession|EndSession|MergeProjects)|duplicate_count|revision_count|deleted_at|sanitizeFTS|topic_key|MergeProjects|GetProjectStats|ListSessions\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
48:	TopicKey       *string `json:"topic_key,omitempty"`
49:	RevisionCount  int     `json:"revision_count"`
50:	DuplicateCount int     `json:"duplicate_count"`
54:	DeletedAt      *string `json:"deleted_at,omitempty"`
87:	TopicKey       *string `json:"topic_key,omitempty"`
88:	RevisionCount  int     `json:"revision_count"`
89:	DuplicateCount int     `json:"duplicate_count"`
93:	DeletedAt      *string `json:"deleted_at,omitempty"`
120:	TopicKey  string `json:"topic_key,omitempty"`
129:	TopicKey *string `json:"topic_key,omitempty"`
217:	TopicKey   *string `json:"topic_key,omitempty"`
219:	DeletedAt  *string `json:"deleted_at,omitempty"`
460:			topic_key  TEXT,
462:			revision_count INTEGER NOT NULL DEFAULT 1,
463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
467:			deleted_at TEXT,
482:			topic_key,
550:		{name: "topic_key", definition: "TEXT"},
552:		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
556:		{name: "deleted_at", definition: "TEXT"},
575:		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
576:		CREATE INDEX IF NOT EXISTS idx_obs_deleted ON observations(deleted_at);
610:	if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {
613:	if _, err := s.execHook(s.db, `UPDATE observations SET revision_count = 1 WHERE revision_count IS NULL OR revision_count < 1`); err != nil {
616:	if _, err := s.execHook(s.db, `UPDATE observations SET duplicate_count = 1 WHERE duplicate_count IS NULL OR duplicate_count < 1`); err != nil {
645:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
646:				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
650:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
651:				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
655:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
656:				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
657:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
658:				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
705:	err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
721:			topic_key,
725:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
726:		SELECT id, title, content, tool_name, type, project, topic_key
728:		WHERE deleted_at IS NULL;
731:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
732:			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
736:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
737:			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
741:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
742:			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
743:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
744:			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
747:		return fmt.Errorf("migrate fts topic_key: %w", err)
754:func (s *Store) CreateSession(id, project, directory string) error {
770:func (s *Store) EndSession(id string, summary string) error {
830:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
870:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
908:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
910:		WHERE o.deleted_at IS NULL
937:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
939:		WHERE session_id = ? AND deleted_at IS NULL
948:func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
970:				 WHERE topic_key = ?
973:				   AND deleted_at IS NULL
985:					     topic_key = ?,
987:					     revision_count = revision_count + 1,
1022:			   AND deleted_at IS NULL
1031:				 SET duplicate_count = duplicate_count + 1,
1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
1086:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
1088:		WHERE o.deleted_at IS NULL
1181:func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
1186:	ftsQuery := sanitizeFTS(query)
1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1227:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
1284:			     topic_key = ?,
1286:			     revision_count = revision_count + 1,
1288:			 WHERE id = ? AND deleted_at IS NULL`,
1331:				 SET deleted_at = datetime('now'),
1333:				 WHERE id = ? AND deleted_at IS NULL`,
1338:			if err := tx.QueryRow(`SELECT deleted_at FROM observations WHERE id = ?`, id).Scan(&deletedAt); err != nil {
1384:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1386:		WHERE session_id = ? AND id < ? AND deleted_at IS NULL
1418:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1420:		WHERE session_id = ? AND id > ? AND deleted_at IS NULL
1448:		"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1478:			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1480:			WHERE topic_key = ? AND deleted_at IS NULL
1519:	ftsQuery := sanitizeFTS(query)
1523:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
2267:		// Same pattern used by EnrollProject and MergeProjects.
2290:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2325:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2439:		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
2455:// MergeProjects migrates all records from each source project name into the
2459:func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
2700:		  AND deleted_at IS NULL
2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2847:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2861:		query += ` AND deleted_at IS NULL`
2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
2940:		`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
3065:			topic_key  TEXT,
3067:			revision_count INTEGER NOT NULL DEFAULT 1,
3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
3072:			deleted_at TEXT,
3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
3083:			last_seen_at, created_at, updated_at, deleted_at
3099:			NULLIF(topic_key, ''),
3101:			CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
3106:			deleted_at
3132:			topic_key,
3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:		SELECT id, title, content, tool_name, type, project, topic_key
3139:		WHERE deleted_at IS NULL;
3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:func sanitizeFTS(query string) string {
3504:			   AND deleted_at IS NULL

exec
/bin/zsh -lc 'rg -n "ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|mem_search|mem_save|mem_context|mem_session_summary|mem_session_start|mem_session_end|mem_suggest_topic_key|mem_capture_passive|mem_projects_merge|mem_stats|mem_timeline|mem_recent" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13://	engram mcp --tools=mem_save,mem_search → individual tool names
41://   mem_save, mem_search, mem_context, mem_session_summary,
42://   mem_session_start, mem_session_end, mem_get_observation,
43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
46://   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
50:// ProfileAgent contains the tool names that AI agents need.
53:var ProfileAgent = map[string]bool{
54:	"mem_save":              true, // proactive save — referenced 17 times across protocols
55:	"mem_search":            true, // search past memories — referenced 6 times
56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
58:	"mem_session_start":     true, // register session start
59:	"mem_session_end":       true, // mark session completed
61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
63:	"mem_save_prompt":       true, // save user prompts
67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
69:var ProfileAdmin = map[string]bool{
71:	"mem_stats":          true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
72:	"mem_timeline":       true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
78:	"agent": ProfileAgent,
79:	"admin": ProfileAdmin,
82:// ResolveTools takes a comma-separated string of profile names and/or
85:func ResolveTools(input string) map[string]bool {
127:  mem_save — save decisions, bugs, discoveries, conventions PROACTIVELY (do not wait to be asked)
128:  mem_search — find past work, decisions, or context from previous sessions
129:  mem_context — get recent session history (call at session start or after compaction)
130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
132:  mem_save_prompt — save user prompt for context
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
138:PROACTIVE SAVE RULE: Call mem_save immediately after ANY decision, bug fix, discovery, or convention — not just when asked.`
160:// shouldRegister returns true if the tool should be registered given the
162:func shouldRegister(name string, allowlist map[string]bool) bool {
170:	// ─── mem_search (profile: agent, core — always in context) ─────────
171:	if shouldRegister("mem_search", allowlist) {
173:			mcp.NewTool("mem_search",
201:	// ─── mem_save (profile: agent, core — always in context) ───────────
202:	if shouldRegister("mem_save", allowlist) {
204:			mcp.NewTool("mem_save",
265:	if shouldRegister("mem_update", allowlist) {
302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
305:			mcp.NewTool("mem_suggest_topic_key",
306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
328:	if shouldRegister("mem_delete", allowlist) {
350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
351:	if shouldRegister("mem_save_prompt", allowlist) {
353:			mcp.NewTool("mem_save_prompt",
375:	// ─── mem_context (profile: agent, core — always in context) ────────
376:	if shouldRegister("mem_context", allowlist) {
378:			mcp.NewTool("mem_context",
399:	// ─── mem_stats (profile: admin, deferred) ───────────────────────────
400:	if shouldRegister("mem_stats", allowlist) {
402:			mcp.NewTool("mem_stats",
415:	// ─── mem_timeline (profile: admin, deferred) ────────────────────────
416:	if shouldRegister("mem_timeline", allowlist) {
418:			mcp.NewTool("mem_timeline",
419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
442:	if shouldRegister("mem_get_observation", allowlist) {
445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
461:	if shouldRegister("mem_session_summary", allowlist) {
463:			mcp.NewTool("mem_session_summary",
515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
516:	if shouldRegister("mem_session_start", allowlist) {
518:			mcp.NewTool("mem_session_start",
542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
543:	if shouldRegister("mem_session_end", allowlist) {
545:			mcp.NewTool("mem_session_end",
565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
566:	if shouldRegister("mem_capture_passive", allowlist) {
568:			mcp.NewTool("mem_capture_passive",
599:	if shouldRegister("mem_merge_projects", allowlist) {

codex
The last pass showed CocoIndex isn’t cooperating again, so I’m following the explicit fallback path: targeted `rg` plus direct code reads. I’m narrowing now to the hygiene mechanics themselves, especially duplicate suppression, topic-thread updates, soft-delete/merge behavior in Engram, and our trigger, causal, and health implementations on the Public side.
exec
/bin/zsh -lc "sed -n '948,1075p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
	// Normalize project name (lowercase + trim) before any persistence
	p.Project, _ = NormalizeProject(p.Project)

	// Strip <private>...</private> tags before persisting ANYTHING
	title := stripPrivateTags(p.Title)
	content := stripPrivateTags(p.Content)

	if len(content) > s.cfg.MaxObservationLength {
		content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
	}
	scope := normalizeScope(p.Scope)
	normHash := hashNormalized(content)
	topicKey := normalizeTopicKey(p.TopicKey)

	var observationID int64
	err := s.withTx(func(tx *sql.Tx) error {
		var obs *Observation
		if topicKey != "" {
			var existingID int64
			err := tx.QueryRow(
				`SELECT id FROM observations
				 WHERE topic_key = ?
				   AND ifnull(project, '') = ifnull(?, '')
				   AND scope = ?
				   AND deleted_at IS NULL
				 ORDER BY datetime(updated_at) DESC, datetime(created_at) DESC
				 LIMIT 1`,
				topicKey, nullableString(p.Project), scope,
			).Scan(&existingID)
			if err == nil {
				if _, err := s.execHook(tx,
					`UPDATE observations
					 SET type = ?,
					     title = ?,
					     content = ?,
					     tool_name = ?,
					     topic_key = ?,
					     normalized_hash = ?,
					     revision_count = revision_count + 1,
					     last_seen_at = datetime('now'),
					     updated_at = datetime('now')
					 WHERE id = ?`,
					p.Type,
					title,
					content,
					nullableString(p.ToolName),
					nullableString(topicKey),
					normHash,
					existingID,
				); err != nil {
					return err
				}
				obs, err = s.getObservationTx(tx, existingID)
				if err != nil {
					return err
				}
				observationID = existingID
				return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
			}
			if err != sql.ErrNoRows {
				return err
			}
		}

		window := dedupeWindowExpression(s.cfg.DedupeWindow)
		var existingID int64
		err := tx.QueryRow(
			`SELECT id FROM observations
			 WHERE normalized_hash = ?
			   AND ifnull(project, '') = ifnull(?, '')
			   AND scope = ?
			   AND type = ?
			   AND title = ?
			   AND deleted_at IS NULL
			   AND datetime(created_at) >= datetime('now', ?)
			 ORDER BY created_at DESC
			 LIMIT 1`,
			normHash, nullableString(p.Project), scope, p.Type, title, window,
		).Scan(&existingID)
		if err == nil {
			if _, err := s.execHook(tx,
				`UPDATE observations
				 SET duplicate_count = duplicate_count + 1,
				     last_seen_at = datetime('now'),
				     updated_at = datetime('now')
				 WHERE id = ?`,
				existingID,
			); err != nil {
				return err
			}
			obs, err = s.getObservationTx(tx, existingID)
			if err != nil {
				return err
			}
			observationID = existingID
			return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
		}
		if err != sql.ErrNoRows {
			return err
		}

		syncID := newSyncID("obs")
		res, err := s.execHook(tx,
			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))`,
			syncID, p.SessionID, p.Type, title, content,
			nullableString(p.ToolName), nullableString(p.Project), scope, nullableString(topicKey), normHash,
		)
		if err != nil {
			return err
		}
		observationID, err = res.LastInsertId()
		if err != nil {
			return err
		}
		obs, err = s.getObservationTx(tx, observationID)
		if err != nil {
			return err
		}
		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
	})
	if err != nil {
		return 0, err
	}
	return observationID, nil
}


exec
/bin/zsh -lc "sed -n '1462,1565p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
	// Normalize project filter so "Engram" finds records stored as "engram"
	opts.Project, _ = NormalizeProject(opts.Project)

	limit := opts.Limit
	if limit <= 0 {
		limit = 10
	}
	if limit > s.cfg.MaxSearchResults {
		limit = s.cfg.MaxSearchResults
	}

	var directResults []SearchResult
	if strings.Contains(query, "/") {
		tkSQL := `
			SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
			FROM observations
			WHERE topic_key = ? AND deleted_at IS NULL
		`
		tkArgs := []any{query}

		if opts.Type != "" {
			tkSQL += " AND type = ?"
			tkArgs = append(tkArgs, opts.Type)
		}
		if opts.Project != "" {
			tkSQL += " AND project = ?"
			tkArgs = append(tkArgs, opts.Project)
		}
		if opts.Scope != "" {
			tkSQL += " AND scope = ?"
			tkArgs = append(tkArgs, normalizeScope(opts.Scope))
		}

		tkSQL += " ORDER BY updated_at DESC LIMIT ?"
		tkArgs = append(tkArgs, limit)

		tkRows, err := s.queryItHook(s.db, tkSQL, tkArgs...)
		if err == nil {
			defer tkRows.Close()
			for tkRows.Next() {
				var sr SearchResult
				if err := tkRows.Scan(
					&sr.ID, &sr.SyncID, &sr.SessionID, &sr.Type, &sr.Title, &sr.Content,
					&sr.ToolName, &sr.Project, &sr.Scope, &sr.TopicKey, &sr.RevisionCount, &sr.DuplicateCount,
					&sr.LastSeenAt, &sr.CreatedAt, &sr.UpdatedAt, &sr.DeletedAt,
				); err != nil {
					break
				}
				sr.Rank = -1000
				directResults = append(directResults, sr)
			}
		}
	}

	// Sanitize query for FTS5 — wrap each term in quotes to avoid syntax errors
	ftsQuery := sanitizeFTS(query)

	sqlQ := `
		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
		       fts.rank
		FROM observations_fts fts
		JOIN observations o ON o.id = fts.rowid
		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
	`
	args := []any{ftsQuery}

	if opts.Type != "" {
		sqlQ += " AND o.type = ?"
		args = append(args, opts.Type)
	}

	if opts.Project != "" {
		sqlQ += " AND o.project = ?"
		args = append(args, opts.Project)
	}

	if opts.Scope != "" {
		sqlQ += " AND o.scope = ?"
		args = append(args, normalizeScope(opts.Scope))
	}

	sqlQ += " ORDER BY fts.rank LIMIT ?"
	args = append(args, limit)

	rows, err := s.queryItHook(s.db, sqlQ, args...)
	if err != nil {
		return nil, fmt.Errorf("search: %w", err)
	}
	defer rows.Close()

	seen := make(map[int64]bool)
	for _, dr := range directResults {
		seen[dr.ID] = true
	}

	var results []SearchResult
	results = append(results, directResults...)
	for rows.Next() {
		var sr SearchResult
		if err := rows.Scan(
			&sr.ID, &sr.SyncID, &sr.SessionID, &sr.Type, &sr.Title, &sr.Content,

exec
/bin/zsh -lc "sed -n '1613,1715p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
func (s *Store) FormatContext(project, scope string) (string, error) {
	sessions, err := s.RecentSessions(project, 5)
	if err != nil {
		return "", err
	}

	observations, err := s.RecentObservations(project, scope, s.cfg.MaxContextResults)
	if err != nil {
		return "", err
	}

	prompts, err := s.RecentPrompts(project, 10)
	if err != nil {
		return "", err
	}

	if len(sessions) == 0 && len(observations) == 0 && len(prompts) == 0 {
		return "", nil
	}

	var b strings.Builder
	b.WriteString("## Memory from Previous Sessions\n\n")

	if len(sessions) > 0 {
		b.WriteString("### Recent Sessions\n")
		for _, sess := range sessions {
			summary := ""
			if sess.Summary != nil {
				summary = fmt.Sprintf(": %s", truncate(*sess.Summary, 200))
			}
			fmt.Fprintf(&b, "- **%s** (%s)%s [%d observations]\n",
				sess.Project, sess.StartedAt, summary, sess.ObservationCount)
		}
		b.WriteString("\n")
	}

	if len(prompts) > 0 {
		b.WriteString("### Recent User Prompts\n")
		for _, p := range prompts {
			fmt.Fprintf(&b, "- %s: %s\n", p.CreatedAt, truncate(p.Content, 200))
		}
		b.WriteString("\n")
	}

	if len(observations) > 0 {
		b.WriteString("### Recent Observations\n")
		for _, obs := range observations {
			fmt.Fprintf(&b, "- [%s] **%s**: %s\n",
				obs.Type, obs.Title, truncate(obs.Content, 300))
		}
		b.WriteString("\n")
	}

	return b.String(), nil
}

// ─── Export / Import ─────────────────────────────────────────────────────────

func (s *Store) Export() (*ExportData, error) {
	data := &ExportData{
		Version:    "0.1.0",
		ExportedAt: Now(),
	}

	// Sessions
	rows, err := s.queryItHook(s.db,
		"SELECT id, project, directory, started_at, ended_at, summary FROM sessions ORDER BY started_at",
	)
	if err != nil {
		return nil, fmt.Errorf("export sessions: %w", err)
	}
	defer rows.Close()
	for rows.Next() {
		var sess Session
		if err := rows.Scan(&sess.ID, &sess.Project, &sess.Directory, &sess.StartedAt, &sess.EndedAt, &sess.Summary); err != nil {
			return nil, err
		}
		data.Sessions = append(data.Sessions, sess)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Observations
	obsRows, err := s.queryItHook(s.db,
		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
		 FROM observations ORDER BY id`,
	)
	if err != nil {
		return nil, fmt.Errorf("export observations: %w", err)
	}
	defer obsRows.Close()
	for obsRows.Next() {
		var o Observation
		if err := obsRows.Scan(
			&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content,
			&o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt,
			&o.CreatedAt, &o.UpdatedAt, &o.DeletedAt,
		); err != nil {
			return nil, err
		}
		data.Observations = append(data.Observations, o)

exec
/bin/zsh -lc "sed -n '2455,2755p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// MergeProjects migrates all records from each source project name into the
// canonical name. Sources that equal the canonical (after normalization) or
// have no records are silently skipped — the operation is idempotent.
// All updates are performed inside a single transaction for atomicity.
func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
	canonical, _ = NormalizeProject(canonical)
	if canonical == "" {
		return nil, fmt.Errorf("canonical project name must not be empty")
	}

	result := &MergeResult{Canonical: canonical}

	err := s.withTx(func(tx *sql.Tx) error {
		for _, src := range sources {
			src, _ = NormalizeProject(src)
			if src == "" || src == canonical {
				continue
			}

			res, err := s.execHook(tx, `UPDATE observations SET project = ? WHERE project = ?`, canonical, src)
			if err != nil {
				return fmt.Errorf("merge observations %q → %q: %w", src, canonical, err)
			}
			n, _ := res.RowsAffected()
			result.ObservationsUpdated += n

			res, err = s.execHook(tx, `UPDATE sessions SET project = ? WHERE project = ?`, canonical, src)
			if err != nil {
				return fmt.Errorf("merge sessions %q → %q: %w", src, canonical, err)
			}
			n, _ = res.RowsAffected()
			result.SessionsUpdated += n

			res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, canonical, src)
			if err != nil {
				return fmt.Errorf("merge prompts %q → %q: %w", src, canonical, err)
			}
			n, _ = res.RowsAffected()
			result.PromptsUpdated += n

			result.SourcesMerged = append(result.SourcesMerged, src)
		}
		// Enqueue sync mutations so cloud sync picks up the merged records.
		// Same pattern used by EnrollProject.
		return s.backfillProjectSyncMutationsTx(tx, canonical)
	})
	if err != nil {
		return nil, err
	}

	return result, nil
}

// ─── Project Pruning ─────────────────────────────────────────────────────────

// PruneResult holds the outcome of pruning a single project.
type PruneResult struct {
	Project         string `json:"project"`
	SessionsDeleted int64  `json:"sessions_deleted"`
	PromptsDeleted  int64  `json:"prompts_deleted"`
}

// PruneProject removes all sessions and prompts for a project that has zero
// (non-deleted) observations. Returns an error if the project still has
// observations — the caller must verify first.
func (s *Store) PruneProject(project string) (*PruneResult, error) {
	if project == "" {
		return nil, fmt.Errorf("project name must not be empty")
	}

	// Safety check: refuse to prune if observations exist.
	count, err := s.CountObservationsForProject(project)
	if err != nil {
		return nil, fmt.Errorf("count observations: %w", err)
	}
	if count > 0 {
		return nil, fmt.Errorf("project %q still has %d observations — cannot prune", project, count)
	}

	result := &PruneResult{Project: project}

	err = s.withTx(func(tx *sql.Tx) error {
		res, err := s.execHook(tx, `DELETE FROM user_prompts WHERE project = ?`, project)
		if err != nil {
			return fmt.Errorf("prune prompts: %w", err)
		}
		result.PromptsDeleted, _ = res.RowsAffected()

		res, err = s.execHook(tx, `DELETE FROM sessions WHERE project = ?`, project)
		if err != nil {
			return fmt.Errorf("prune sessions: %w", err)
		}
		result.SessionsDeleted, _ = res.RowsAffected()

		return nil
	})
	if err != nil {
		return nil, err
	}

	return result, nil
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func (s *Store) withTx(fn func(tx *sql.Tx) error) error {
	tx, err := s.beginTxHook()
	if err != nil {
		return err
	}
	defer tx.Rollback()
	if err := fn(tx); err != nil {
		return err
	}
	return s.commitHook(tx)
}

func (s *Store) createSessionTx(tx *sql.Tx, id, project, directory string) error {
	_, err := s.execHook(tx,
		`INSERT INTO sessions (id, project, directory) VALUES (?, ?, ?)
		 ON CONFLICT(id) DO UPDATE SET
		   project   = CASE WHEN sessions.project = '' THEN excluded.project ELSE sessions.project END,
		   directory = CASE WHEN sessions.directory = '' THEN excluded.directory ELSE sessions.directory END`,
		id, project, directory,
	)
	return err
}

func (s *Store) ensureSyncState(targetKey string) error {
	_, err := s.execHook(s.db,
		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
		targetKey, SyncLifecycleIdle,
	)
	return err
}

func (s *Store) getSyncState(targetKey string) (*SyncState, error) {
	row := s.db.QueryRow(`
		SELECT target_key, lifecycle, last_enqueued_seq, last_acked_seq, last_pulled_seq,
		       consecutive_failures, backoff_until, lease_owner, lease_until, last_error, updated_at
		FROM sync_state WHERE target_key = ?`, targetKey)
	var state SyncState
	if err := row.Scan(&state.TargetKey, &state.Lifecycle, &state.LastEnqueuedSeq, &state.LastAckedSeq, &state.LastPulledSeq, &state.ConsecutiveFailures, &state.BackoffUntil, &state.LeaseOwner, &state.LeaseUntil, &state.LastError, &state.UpdatedAt); err != nil {
		return nil, err
	}
	return &state, nil
}

func (s *Store) getSyncStateTx(tx *sql.Tx, targetKey string) (*SyncState, error) {
	if _, err := s.execHook(tx,
		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
		targetKey, SyncLifecycleIdle,
	); err != nil {
		return nil, err
	}
	row := tx.QueryRow(`
		SELECT target_key, lifecycle, last_enqueued_seq, last_acked_seq, last_pulled_seq,
		       consecutive_failures, backoff_until, lease_owner, lease_until, last_error, updated_at
		FROM sync_state WHERE target_key = ?`, targetKey)
	var state SyncState
	if err := row.Scan(&state.TargetKey, &state.Lifecycle, &state.LastEnqueuedSeq, &state.LastAckedSeq, &state.LastPulledSeq, &state.ConsecutiveFailures, &state.BackoffUntil, &state.LeaseOwner, &state.LeaseUntil, &state.LastError, &state.UpdatedAt); err != nil {
		return nil, err
	}
	return &state, nil
}

func (s *Store) backfillProjectSyncMutationsTx(tx *sql.Tx, project string) error {
	if err := s.backfillSessionSyncMutationsTx(tx, project); err != nil {
		return err
	}
	if err := s.backfillObservationSyncMutationsTx(tx, project); err != nil {
		return err
	}
	return s.backfillPromptSyncMutationsTx(tx, project)
}

func (s *Store) repairEnrolledProjectSyncMutations() error {
	return s.withTx(func(tx *sql.Tx) error {
		rows, err := s.queryItHook(tx,
			`SELECT project FROM sync_enrolled_projects ORDER BY project ASC`,
		)
		if err != nil {
			return err
		}
		defer rows.Close()

		var projects []string
		for rows.Next() {
			var project string
			if err := rows.Scan(&project); err != nil {
				return err
			}
			projects = append(projects, project)
		}
		if err := rows.Err(); err != nil {
			return err
		}

		for _, project := range projects {
			if err := s.backfillProjectSyncMutationsTx(tx, project); err != nil {
				return err
			}
		}
		return nil
	})
}

func (s *Store) backfillSessionSyncMutationsTx(tx *sql.Tx, project string) error {
	rows, err := s.queryItHook(tx, `
		SELECT id, project, directory, ended_at, summary
		FROM sessions
		WHERE project = ?
		  AND NOT EXISTS (
			SELECT 1
			FROM sync_mutations sm
			WHERE sm.target_key = ?
			  AND sm.entity = ?
			  AND sm.entity_key = sessions.id
			  AND sm.source = ?
		  )
		ORDER BY started_at ASC, id ASC`,
		project, DefaultSyncTargetKey, SyncEntitySession, SyncSourceLocal,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var payload syncSessionPayload
		if err := rows.Scan(&payload.ID, &payload.Project, &payload.Directory, &payload.EndedAt, &payload.Summary); err != nil {
			return err
		}
		if err := s.enqueueSyncMutationTx(tx, SyncEntitySession, payload.ID, SyncOpUpsert, payload); err != nil {
			return err
		}
	}
	return rows.Err()
}

func (s *Store) backfillObservationSyncMutationsTx(tx *sql.Tx, project string) error {
	rows, err := s.queryItHook(tx, `
		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
		FROM observations
		WHERE ifnull(project, '') = ?
		  AND deleted_at IS NULL
		  AND NOT EXISTS (
			SELECT 1
			FROM sync_mutations sm
			WHERE sm.target_key = ?
			  AND sm.entity = ?
			  AND sm.entity_key = observations.sync_id
			  AND sm.source = ?
		  )
		ORDER BY id ASC`,
		project, DefaultSyncTargetKey, SyncEntityObservation, SyncSourceLocal,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var payload syncObservationPayload
		if err := rows.Scan(&payload.SyncID, &payload.SessionID, &payload.Type, &payload.Title, &payload.Content, &payload.ToolName, &payload.Project, &payload.Scope, &payload.TopicKey); err != nil {
			return err
		}
		if err := s.enqueueSyncMutationTx(tx, SyncEntityObservation, payload.SyncID, SyncOpUpsert, payload); err != nil {
			return err
		}
	}
	return rows.Err()
}

func (s *Store) backfillPromptSyncMutationsTx(tx *sql.Tx, project string) error {
	rows, err := s.queryItHook(tx, `
		SELECT sync_id, session_id, content, project
		FROM user_prompts
		WHERE ifnull(project, '') = ?
		  AND NOT EXISTS (
			SELECT 1
			FROM sync_mutations sm
			WHERE sm.target_key = ?
			  AND sm.entity = ?
			  AND sm.entity_key = user_prompts.sync_id
			  AND sm.source = ?
		  )
		ORDER BY id ASC`,
		project, DefaultSyncTargetKey, SyncEntityPrompt, SyncSourceLocal,
	)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var payload syncPromptPayload
		if err := rows.Scan(&payload.SyncID, &payload.SessionID, &payload.Content, &payload.Project); err != nil {
			return err
		}
		if err := s.enqueueSyncMutationTx(tx, SyncEntityPrompt, payload.SyncID, SyncOpUpsert, payload); err != nil {

exec
/bin/zsh -lc "sed -n '754,830p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
func (s *Store) CreateSession(id, project, directory string) error {
	// Normalize project name before storing
	project, _ = NormalizeProject(project)

	return s.withTx(func(tx *sql.Tx) error {
		if err := s.createSessionTx(tx, id, project, directory); err != nil {
			return err
		}
		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
			ID:        id,
			Project:   project,
			Directory: directory,
		})
	})
}

func (s *Store) EndSession(id string, summary string) error {
	return s.withTx(func(tx *sql.Tx) error {
		res, err := s.execHook(tx,
			`UPDATE sessions SET ended_at = datetime('now'), summary = ? WHERE id = ?`,
			nullableString(summary), id,
		)
		if err != nil {
			return err
		}
		rows, err := res.RowsAffected()
		if err != nil {
			return err
		}
		if rows == 0 {
			return nil
		}

		var endedAt string
		var project, directory string
		var storedSummary *string
		if err := tx.QueryRow(
			`SELECT project, directory, ended_at, summary FROM sessions WHERE id = ?`,
			id,
		).Scan(&project, &directory, &endedAt, &storedSummary); err != nil {
			return err
		}

		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
			ID:        id,
			Project:   project,
			Directory: directory,
			EndedAt:   &endedAt,
			Summary:   storedSummary,
		})
	})
}

func (s *Store) GetSession(id string) (*Session, error) {
	row := s.db.QueryRow(
		`SELECT id, project, directory, started_at, ended_at, summary FROM sessions WHERE id = ?`, id,
	)
	var sess Session
	if err := row.Scan(&sess.ID, &sess.Project, &sess.Directory, &sess.StartedAt, &sess.EndedAt, &sess.Summary); err != nil {
		return nil, err
	}
	return &sess, nil
}

func (s *Store) RecentSessions(project string, limit int) ([]SessionSummary, error) {
	// Normalize project filter for case-insensitive matching
	project, _ = NormalizeProject(project)

	if limit <= 0 {
		limit = 5
	}

	query := `
		SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
		       COUNT(o.id) as observation_count
		FROM sessions s
		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL

exec
/bin/zsh -lc "sed -n '3382,3415p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
// "fix auth bug" → `"fix" "auth" "bug"`
func sanitizeFTS(query string) string {
	words := strings.Fields(query)
	for i, w := range words {
		// Strip existing quotes to avoid double-quoting
		w = strings.Trim(w, `"`)
		words[i] = `"` + w + `"`
	}
	return strings.Join(words, " ")
}

// ─── Passive Capture ─────────────────────────────────────────────────────────

// PassiveCaptureParams holds the input for passive memory capture.
type PassiveCaptureParams struct {
	SessionID string `json:"session_id"`
	Content   string `json:"content"`
	Project   string `json:"project,omitempty"`
	Source    string `json:"source,omitempty"` // e.g. "subagent-stop", "session-end"
}

// PassiveCaptureResult holds the output of passive memory capture.
type PassiveCaptureResult struct {
	Extracted  int `json:"extracted"`  // Total learnings found in text
	Saved      int `json:"saved"`      // New observations created
	Duplicates int `json:"duplicates"` // Skipped because already existed
}

// learningHeaderPattern matches section headers for learnings in both English and Spanish.
var learningHeaderPattern = regexp.MustCompile(
	`(?im)^#{2,3}\s+(?:Aprendizajes(?:\s+Clave)?|Key\s+Learnings?|Learnings?):?\s*$`,
)


exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '399,610p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
[← Back to README](../README.md)

# Architecture

- [How It Works](#how-it-works)
- [Session Lifecycle](#session-lifecycle)
- [MCP Tools](#mcp-tools)
- [Progressive Disclosure](#progressive-disclosure-3-layer-pattern)
- [Memory Hygiene](#memory-hygiene)
- [Topic Key Workflow](#topic-key-workflow-recommended)
- [Project Structure](#project-structure)
- [CLI Reference](#cli-reference)

---

## How It Works

<p align="center">
  <img src="../assets/agent-save.png" alt="Agent saving a memory via mem_save" width="800" />
  <br />
  <em>The agent proactively calls <code>mem_save</code> after significant work — structured, searchable, no noise.</em>
</p>

Engram trusts the **agent** to decide what's worth remembering — not a firehose of raw tool calls.

### The Agent Saves, Engram Stores

```
1. Agent completes significant work (bugfix, architecture decision, etc.)
2. Agent calls mem_save with a structured summary:
   - title: "Fixed N+1 query in user list"
   - type: "bugfix"
   - content: What/Why/Where/Learned format
3. Engram persists to SQLite with FTS5 indexing
4. Next session: agent searches memory, gets relevant context
```

---

## Session Lifecycle

```
Session starts → Agent works → Agent saves memories proactively
                                    ↓
Session ends → Agent writes session summary (Goal/Discoveries/Accomplished/Files)
                                    ↓
Next session starts → Previous session context is injected automatically
```

---

## MCP Tools

| Tool | Purpose |
|------|---------|
| `mem_save` | Save a structured observation (decision, bugfix, pattern, etc.) |
| `mem_update` | Update an existing observation by ID |
| `mem_delete` | Delete an observation (soft-delete by default, hard-delete optional) |
| `mem_suggest_topic_key` | Suggest a stable `topic_key` for evolving topics before saving |
| `mem_search` | Full-text search across all memories |
| `mem_session_summary` | Save end-of-session summary |
| `mem_context` | Get recent context from previous sessions |
| `mem_timeline` | Chronological context around a specific observation |
| `mem_get_observation` | Get full content of a specific memory |
| `mem_save_prompt` | Save a user prompt for future context |
| `mem_stats` | Memory system statistics |
| `mem_session_start` | Register a session start |
| `mem_session_end` | Mark a session as completed |
| `mem_capture_passive` | Extract learnings from text output |
| `mem_merge_projects` | Merge project name variants into canonical name (admin) |

---

## Progressive Disclosure (3-Layer Pattern)

Token-efficient memory retrieval — don't dump everything, drill in:

```
1. mem_search "auth middleware"     → compact results with IDs (~100 tokens each)
2. mem_timeline observation_id=42  → what happened before/after in that session
3. mem_get_observation id=42       → full untruncated content
```

---

## Memory Hygiene

- `mem_save` now supports `scope` (`project` default, `personal` optional)
- `mem_save` also supports `topic_key`; with a topic key, saves become upserts (same project+scope+topic updates the existing memory)
- Exact dedupe prevents repeated inserts in a rolling window (hash + project + scope + type + title)
- Duplicates update metadata (`duplicate_count`, `last_seen_at`, `updated_at`) instead of creating new rows
- Topic upserts increment `revision_count` so evolving decisions stay in one memory
- `mem_delete` uses soft-delete by default (`deleted_at`), with optional hard delete
- `mem_search`, `mem_context`, recent lists, and timeline ignore soft-deleted observations

---

## Topic Key Workflow (Recommended)

Use this when a topic evolves over time (architecture, long-running feature decisions, etc.):

```text
1. mem_suggest_topic_key(type="architecture", title="Auth architecture")
2. mem_save(..., topic_key="architecture-auth-architecture")
3. Later change on same topic -> mem_save(..., same topic_key)
   => existing observation is updated (revision_count++)
```

Different topics should use different keys (e.g. `architecture/auth-model` vs `bug/auth-nil-panic`) so they never overwrite each other.

`mem_suggest_topic_key` now applies a family heuristic for consistency across sessions:

- `architecture/*` for architecture/design/ADR-like changes
- `bug/*` for fixes, regressions, errors, panics
- `decision/*`, `pattern/*`, `config/*`, `discovery/*`, `learning/*` when detected

---

## Project Structure

```
engram/
├── cmd/engram/main.go              # CLI entrypoint
├── internal/
│   ├── store/store.go              # Core: SQLite + FTS5 + all data ops
│   ├── server/server.go            # HTTP REST API (port 7437)
│   ├── mcp/mcp.go                  # MCP stdio server (15 tools)
│   ├── setup/setup.go              # Agent plugin installer (go:embed)
│   ├── project/                     # Project name detection + similarity matching
│   │   └── project.go              # DetectProject, FindSimilar, Levenshtein
│   ├── sync/sync.go                # Git sync: manifest + compressed chunks
│   └── tui/                        # Bubbletea terminal UI
│       ├── model.go                # Screen constants, Model, Init()
│       ├── styles.go               # Lipgloss styles (Catppuccin Mocha)
│       ├── update.go               # Input handling, per-screen handlers
│       └── view.go                 # Rendering, per-screen views
├── plugin/
│   ├── opencode/engram.ts          # OpenCode adapter plugin
│   └── claude-code/                # Claude Code plugin (hooks + skill)
│       ├── .claude-plugin/plugin.json
│       ├── .mcp.json
│       ├── hooks/hooks.json
│       ├── scripts/                # session-start, post-compaction, subagent-stop, session-stop
│       └── skills/memory/SKILL.md
├── skills/                         # Contributor AI skills (repo-wide standards + Engram-specific guardrails)
├── setup.sh                        # Links repo skills into .claude/.codex/.gemini (project-local)
├── assets/                         # Screenshots and media
├── DOCS.md                         # Full technical documentation
├── CONTRIBUTING.md                 # Contribution workflow and standards
├── go.mod
└── go.sum
```

---

## CLI Reference

```
engram setup [agent]      Install/setup agent integration (opencode, claude-code, gemini-cli, codex)
engram serve [port]       Start HTTP API server (default: 7437)
engram mcp                Start MCP server (stdio transport)
engram tui                Launch interactive terminal UI
engram search <query>     Search memories
engram save <title> <msg> Save a memory
engram timeline <obs_id>  Chronological context around an observation
engram context [project]  Recent context from previous sessions
engram stats              Memory statistics
engram export [file]      Export all memories to JSON
engram import <file>      Import memories from JSON
engram sync               Export new memories as compressed chunk to .engram/
engram sync --all         Export ALL projects (ignore directory-based filter)
engram projects list      Show all projects with obs/session/prompt counts
engram projects consolidate  Interactive merge of similar project names [--all] [--dry-run]
engram projects prune     Remove projects with 0 observations [--dry-run]
engram version            Show version
```

 succeeded in 0ms:
	// ─── mem_stats (profile: admin, deferred) ───────────────────────────
	if shouldRegister("mem_stats", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_stats",
				mcp.WithDescription("Show memory system statistics — total sessions, observations, and projects tracked."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Memory Stats"),
				mcp.WithReadOnlyHintAnnotation(true),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
			),
			handleStats(s),
		)
	}

	// ─── mem_timeline (profile: admin, deferred) ────────────────────────
	if shouldRegister("mem_timeline", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_timeline",
				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Memory Timeline"),
				mcp.WithReadOnlyHintAnnotation(true),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithNumber("observation_id",
					mcp.Required(),
					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
				),
				mcp.WithNumber("before",
					mcp.Description("Number of observations to show before the focus (default: 5)"),
				),
				mcp.WithNumber("after",
					mcp.Description("Number of observations to show after the focus (default: 5)"),
				),
			),
			handleTimeline(s),
		)
	}

	// ─── mem_get_observation (profile: agent, eager) ────────────────────
	if shouldRegister("mem_get_observation", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_get_observation",
				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
				mcp.WithTitleAnnotation("Get Observation"),
				mcp.WithReadOnlyHintAnnotation(true),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithNumber("id",
					mcp.Required(),
					mcp.Description("The observation ID to retrieve"),
				),
			),
			handleGetObservation(s),
		)
	}

	// ─── mem_session_summary (profile: agent, core — always in context) ─
	if shouldRegister("mem_session_summary", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_session_summary",
				mcp.WithTitleAnnotation("Save Session Summary"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(false),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithDescription(`Save a comprehensive end-of-session summary. Call this when a session is ending or when significant work is complete. This creates a structured summary that future sessions will use to understand what happened.

FORMAT — use this exact structure in the content field:

## Goal
[One sentence: what were we building/working on in this session]

## Instructions
[User preferences, constraints, or context discovered during this session. Things a future agent needs to know about HOW the user wants things done. Skip if nothing notable.]

## Discoveries
- [Technical finding, gotcha, or learning 1]
- [Technical finding 2]
- [Important API behavior, config quirk, etc.]

## Accomplished
- ✅ [Completed task 1 — with key implementation details]
- ✅ [Completed task 2 — mention files changed]
- 🔲 [Identified but not yet done — for next session]

## Relevant Files
- path/to/file.ts — [what it does or what changed]
- path/to/other.go — [role in the architecture]

GUIDELINES:
- Be CONCISE but don't lose important details (file paths, error messages, decisions)
- Focus on WHAT and WHY, not HOW (the code itself is in the repo)
- Include things that would save a future agent time
- The Discoveries section is the most valuable — capture gotchas and non-obvious learnings
- Relevant Files should only include files that were significantly changed or are important for context`),
				mcp.WithString("content",
					mcp.Required(),
					mcp.Description("Full session summary using the Goal/Instructions/Discoveries/Accomplished/Files format"),
				),
				mcp.WithString("session_id",
					mcp.Description("Session ID (default: manual-save-{project})"),
				),
				mcp.WithString("project",
					mcp.Required(),
					mcp.Description("Project name"),
				),
			),
			handleSessionSummary(s, cfg),
		)
	}

	// ─── mem_session_start (profile: agent, deferred) ───────────────────
	if shouldRegister("mem_session_start", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_session_start",
				mcp.WithDescription("Register the start of a new coding session. Call this at the beginning of a session to track activity."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Start Session"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("id",
					mcp.Required(),
					mcp.Description("Unique session identifier"),
				),
				mcp.WithString("project",
					mcp.Required(),
					mcp.Description("Project name"),
				),
				mcp.WithString("directory",
					mcp.Description("Working directory"),
				),
			),
			handleSessionStart(s, cfg),
		)
	}

	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
	if shouldRegister("mem_session_end", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_session_end",
				mcp.WithDescription("Mark a coding session as completed with an optional summary."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("End Session"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("id",
					mcp.Required(),
					mcp.Description("Session identifier to close"),
				),
				mcp.WithString("summary",
					mcp.Description("Summary of what was accomplished"),
				),
			),
			handleSessionEnd(s),
		)
	}

	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
	if shouldRegister("mem_capture_passive", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_capture_passive",
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Capture Learnings"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithDescription(`Extract and save structured learnings from text output. Use this at the end of a task to capture knowledge automatically.

The tool looks for sections like "## Key Learnings:" or "## Aprendizajes Clave:" and extracts numbered or bulleted items. Each item is saved as a separate observation.

Duplicates are automatically detected and skipped — safe to call multiple times with the same content.`),
				mcp.WithString("content",
					mcp.Required(),
					mcp.Description("The text output containing a '## Key Learnings:' section with numbered or bulleted items"),
				),
				mcp.WithString("session_id",
					mcp.Description("Session ID (default: manual-save-{project})"),
				),
				mcp.WithString("project",
					mcp.Description("Project name"),
				),
				mcp.WithString("source",
					mcp.Description("Source identifier (e.g. 'subagent-stop', 'session-end')"),
				),
			),
			handleCapturePassive(s, cfg),
		)
	}

	// ─── mem_merge_projects (profile: admin, deferred) ──────────────────
	if shouldRegister("mem_merge_projects", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_merge_projects",
				mcp.WithDescription("Merge memories from multiple project name variants into one canonical name. Use when you discover project name drift (e.g. 'Engram' and 'engram' should be the same project). DESTRUCTIVE — moves all records from source names to the canonical name."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Merge Projects"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(true),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("from",
					mcp.Required(),

exec
/bin/zsh -lc 'rg -n "trigger|co-activation|trigger phrases|fail-close|scope filter|attention|tiered" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts .opencode/skill/system-spec-kit/scripts/memory/post-save-review.ts .opencode/skill/system-spec-kit/scripts/memory/memory-metadata.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/skill/system-spec-kit/scripts/memory/post-save-review.ts: No such file or directory (os error 2)
rg: .opencode/skill/system-spec-kit/scripts/memory/memory-metadata.ts: No such file or directory (os error 2)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:4:// Session-based attention management
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:9:// Domain (ephemeral session attention vs persistent memory scoring).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:50:    attention_score REAL DEFAULT 1.0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:67:  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:70:  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:79:  attention_score: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:94:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:122:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:195:      attention_score,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:210:      attention_score,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:288:      ORDER BY attention_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:303:      SELECT m.*, wm.attention_score, wm.focus_count, wm.last_focused
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:307:      ORDER BY wm.attention_score DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:338:        wm.attention_score AS attentionScore
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:343:        AND wm.attention_score > ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:344:      ORDER BY wm.attention_score DESC, wm.last_focused DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:369: * Calculate attention tier for an entry.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:371:function calculateTier(attentionScore: number): string {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:372:  if (attentionScore >= 0.8) return 'focused';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:373:  if (attentionScore >= 0.5) return 'active';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:374:  if (attentionScore >= 0.2) return 'peripheral';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:379: * Set or update the attention score for a memory in working memory.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:401:        SET attention_score = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:413:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:433:    attentionScore,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:444:  const clampedScore = Math.max(0, Math.min(1, attentionScore));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:453:        attention_score,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:462:        attention_score = CASE
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:463:          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:464:          ELSE working_memory.attention_score
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:550: * Batch update attention scores with decay.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:571:      SELECT id, attention_score, event_counter, mention_count
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:577:      attention_score: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:588:      SET attention_score = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:602:        const decayBase = entry.attention_score * Math.pow(EVENT_DECAY_FACTOR, eventsElapsed);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:686:        AVG(attention_score) as avgAttention,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:687:        MAX(attention_score) as maxAttention,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:688:        MIN(attention_score) as minAttention,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:8:// Feature catalog: BM25 trigger phrase re-index gate
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:24:import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:26:import * as attentionDecay from '../lib/cognitive/attention-decay.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:29:import * as coActivation from '../lib/cognitive/co-activation.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:41:// C2 FIX: Import DB access for scope filtering
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:61:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:74:  attentionScore?: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:90:  attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:111:  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:122:/** Per-turn decay rate for attention scoring. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:135:  const db = attentionDecay.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:156:/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:158:  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:171:    console.warn('[memory-triggers] getTieredContent failed', {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:243:  // Eval logger — capture trigger query at entry (fail-safe)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:249:      intent: 'trigger_match',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:254:  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:263:          scores: memoryIds.map(() => 1.0), // trigger matches are binary
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:264:          fusionMethod: 'trigger',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:269:      /* eval logging must never break triggers handler */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:276:    attentionDecay.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:288:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:289:  let results: TriggerMatch[] = triggerMatchResult.matches;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:291:  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:329:  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:330:    ? triggerMatchResult.stats.signals
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:332:  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:337:      summary: 'No matching trigger phrases found',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:339:        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:349:        'Ensure memories have trigger phrases defined',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:351:        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:368:        attentionDecay.activateMemory(match.memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:369:        // T209: Persist max attention boost for matched memories.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:399:      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:409:      let attentionScore: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:418:          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:423:        attentionScore = effectiveRetrievability;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:427:        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:428:        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:429:        tier = tierClassifier.classifyState(attentionScore);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:434:      attentionScore = Math.max(0, Math.min(1, attentionScore));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:438:        attentionScore: attentionScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:444:    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:446:    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:450:        triggerPhrases: r.matchedPhrases
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:461:        attentionScore: r.attentionScore,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:496:    : `Matched ${formattedResults.length} memories via trigger phrases`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:510:  const _triggersResponse = createMCPSuccessResponse({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:514:      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:524:      triggerSignals: detectedSignals,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:529:  // Consumption instrumentation — log triggers event (fail-safe, never throws)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:531:    const db = attentionDecay.getDb();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:536:        event_type: 'triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:544:  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:546:  // Eval logger — capture final trigger results at exit (fail-safe)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:547:  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:548:  logFinalTriggerEval(triggerMemoryIds, latencyMs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:550:  return _triggersResponse;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,

exec
/bin/zsh -lc "rg -n \"causal|derived_from|supports|supersedes|contradicts|memory_causal|causal edges|clampStrength|edge\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:75:/** Valid mutation types for the CRUD ledger. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:78:/** Input parameters for recording a mutation in the ledger. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:79:interface MutationLedgerInput {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:114:  MutationLedgerInput,
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:177:  lastAction: 'Implemented causal edges',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:230:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:10:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:17:import { appendMutationLedgerSafe } from './memory-crud-utils.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183:  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:208:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:229:        // Clean up causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:230:        // F-27 — Propagate edge-cleanup errors to fail the transaction.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:231:        // Previously errors were caught and logged, leaving orphan causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:232:        // When memory rows were successfully deleted but edge cleanup failed.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:233:        causalEdges.deleteEdgesForMemory(String(memory.id));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:240:  // Record in mutation ledger (single entry for bulk operation)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:241:  const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:245:    newHash: mutationLedger.computeHash(`bulk-delete-tier:${tier}:${deletedCount}:${Date.now()}`),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:246:    linkedMemoryIds: deletedIds.slice(0, 50), // Cap at 50 to avoid bloating ledger
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:288:  if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:289:    hints.push('Mutation ledger append failed; audit trail may be incomplete.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:307:  if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:308:    data.warning = 'Mutation ledger append failed; audit trail may be incomplete.';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:12:import * as causalEdges from '../../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:38:  causalSupersedesMemoryId: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:49:      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:59:      causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:66:    causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:80:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:84:  causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:87:    causalEdges.RELATION_TYPES.SUPERSEDES,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:261:      lineageRouting.causalSupersedesMemoryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:74:  causalLinks?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:4:// Feature catalog: Guards and edge cases
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:41:| `pe-orchestration.ts`       | Prediction-error (PE) gate orchestration. Finds similar memories, evaluates via `predictionErrorGate`, and applies REINFORCE, SUPERSEDE, UPDATE or CREATE_LINKED actions with mutation ledger logging. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:45:| `post-insert.ts`            | Post-insert enrichment pipeline. Runs causal links processing, R10 entity extraction, R8 summary generation and S5 cross-document entity linking. Each step is feature-flag gated and independently error-guarded. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:60:8. post-insert    -- Enrich with entities, summaries, causal links
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:71:- **Mutation Ledger** -- Every create/update action appends to the mutation ledger for audit trail.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:77:- `../memory-crud-utils.ts` -- mutation ledger helpers used by PE orchestration and reconsolidation
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:24:import { appendMutationLedgerSafe } from '../memory-crud-utils.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:238:              // Single transaction for atomicity. better-sqlite3 supports nested transactions
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:320:          const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:340:            ...(!ledgerRecorded ? ['Mutation ledger append failed; audit trail may be incomplete.'] : []),
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:119:| **Edge Density Check** | `computeEdgeDensity()` returns the ratio of causal edges to total memories |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:129:| `computeEdgeDensity` | `(db) => number` | Calculate edge-to-memory ratio |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:239:| `lib/graph/` | Graph signals (N2) and community detection, consume entity and causal edge data |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:7:// entities from polluting the causal graph.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:35: * Default ontology schema — matches the causal_edges CHECK constraint
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:44:    'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:8:import { processCausalLinks } from '../causal-links-processor.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:38:  causalLinks: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:46:  causalLinksResult: CausalLinksResult | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:53: * Sequentially executes: causal links processing, entity extraction (R10),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:61: * @returns PostInsertEnrichmentResult with causal links outcome.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:70:    causalLinks: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:78:  let causalLinksResult: CausalLinksResult | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:79:  if (parsed.hasCausalLinks && parsed.causalLinks) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:81:      causalLinksResult = processCausalLinks(database, id, parsed.causalLinks);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:82:      enrichmentStatus.causalLinks = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:83:      if (causalLinksResult.inserted > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:84:        console.error(`[causal-links] Processed ${causalLinksResult.inserted} causal edges for memory #${id}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:86:      if (causalLinksResult.unresolved.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:87:        console.warn(`[causal-links] ${causalLinksResult.unresolved.length} references could not be resolved`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:89:    } catch (causal_err: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:90:      const message = toErrorMessage(causal_err);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:94:    // No causal links to process — not a failure
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:95:    enrichmentStatus.causalLinks = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:148:        const density = typeof linkResult.edgeDensity === 'number'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:149:          ? linkResult.edgeDensity.toFixed(3)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:176:        if (indexResult.edgesCreated > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:177:          console.error(`[graph-lifecycle] Created ${indexResult.edgesCreated} typed edges for memory #${id}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:193:  return { causalLinksResult, enrichmentStatus };
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:13:import { appendMutationLedgerSafe } from '../memory-crud-utils.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:56:  causalLinksResult: CausalLinksResult | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:124:  causalLinksResult,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:141:  const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:178:  if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:180:    result.warnings.push('Mutation ledger append failed; audit trail may be incomplete.');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:224:  if (causalLinksResult) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:225:    result.causalLinks = {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:226:      processed: causalLinksResult.processed,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:227:      inserted: causalLinksResult.inserted,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:228:      resolved: causalLinksResult.resolved,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:229:      unresolved_count: causalLinksResult.unresolved.length,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:231:    if (causalLinksResult.errors.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:232:      (result.causalLinks as Record<string, unknown>).errors = causalLinksResult.errors;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:423:  if (result.causalLinks) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:424:    response.causalLinks = result.causalLinks;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:425:    if ((result.causalLinks as Record<string, unknown>).inserted as number > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:426:      hints.push(`Created ${(result.causalLinks as Record<string, unknown>).inserted} causal graph edge(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:428:    if ((result.causalLinks as Record<string, unknown>).unresolved_count as number > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:429:      hints.push(`${(result.causalLinks as Record<string, unknown>).unresolved_count} causal link reference(s) could not be resolved`);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:82: * the stored knowledge.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:9:// This intentionally supports ONLY v16 -> v15.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:247:    throw new Error(`Downgrade supports only v${TARGET_FROM_VERSION} -> v${TARGET_TO_VERSION}. Current schema is v${currentVersion}.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:8:import { getMemoryHashSnapshot, appendMutationLedgerSafe } from '../memory-crud-utils.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:86:          const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:101:          if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:104:              'Mutation ledger append failed; audit trail may be incomplete.',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:138:        const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:153:        if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:156:            'Mutation ledger append failed; audit trail may be incomplete.',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md:37:| `memory-parser.ts` | Parses titles, trigger phrases, tiers, document type, causal links, anchors, and content hashes from markdown files |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:12:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:13:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:18:import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:83:  let mutationLedgerWarning: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:94:    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:95:    // Cleanup, ledger append) in a transaction for atomicity on error.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:115:        causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:116:        causalEdges.deleteEdgesForMemory(String(numericId));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:120:        const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:124:          newHash: mutationLedger.computeHash(`delete:${numericId}:${Date.now()}`),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:135:        if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:136:          mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:157:        // Non-fatal — bulk delete proceeds without per-memory hash snapshots; ledger entries will lack prior hashes.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:191:    causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:211:          causalEdges.deleteEdgesForMemory(String(memory.id));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:215:      // Mutation ledger entries written inside bulk transaction for atomicity with deletes.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:218:        const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:222:          newHash: mutationLedger.computeHash(`bulk-delete:${deletedId}:${Date.now()}`),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:234:        if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:235:          mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:273:  if (mutationLedgerWarning) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:274:    hints.push(mutationLedgerWarning);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:285:  if (mutationLedgerWarning) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:286:    data.warning = mutationLedgerWarning;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:5:// Strengthening, staleness detection, edge bounds enforcement.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:19:} from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:20:import type { CausalEdge } from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:56:  edgeBounds: { rejected: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:286: * (via causal edges) to surface the full context for resolution.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:297:    // Expand cluster via causal edges (1-hop neighbors)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:301:          SELECT CAST(target_id AS INTEGER) as neighbor_id FROM causal_edges WHERE source_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:303:          SELECT CAST(source_id AS INTEGER) as neighbor_id FROM causal_edges WHERE target_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:331: * Hebbian strengthening: increase edge strength for recently co-accessed edges.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:333: * 30-day decay: edges not accessed in 30 days lose 0.1 strength.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:344:      // Strengthen: edges accessed in the last cycle period (7 days)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:346:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:352:      for (const edge of recentEdges) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:353:        const increase = Math.min(MAX_STRENGTH_INCREASE_PER_CYCLE, 1.0 - edge.strength);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:355:          const newStrength = Math.min(1.0, edge.strength + increase);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:356:          // Auto edges cannot exceed MAX_AUTO_STRENGTH
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:357:          const cappedStrength = edge.created_by === 'auto'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:361:          if (cappedStrength > edge.strength) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:362:            updateEdge(edge.id, { strength: cappedStrength }, 'hebbian', 'hebbian-strengthening');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:368:      // Decay: edges not accessed in DECAY_PERIOD_DAYS
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:370:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:375:      for (const edge of staleDecayEdges) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:376:        const newStrength = Math.max(0, edge.strength - DECAY_STRENGTH_AMOUNT);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:377:        if (newStrength < edge.strength) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:378:          updateEdge(edge.id, { strength: newStrength }, 'hebbian', 'decay-30-day');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:396: * Detect stale edges (not accessed in 90+ days).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:408: * Enforce edge bounds for a node:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:410: * - Auto edges capped at strength = 0.5
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:412: * Returns count of edges that would be rejected.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:454:        SELECT source_id AS node_id FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:456:        SELECT target_id AS node_id FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:472:    edgeBounds: { rejected: rejectedCount },
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:33:  supersedes: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:34:  derived_from: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:61:  causalLinks: CausalLinks;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:240: * This supports atomic-save flows that need to index content before promoting the
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:269:  // Extract causal_links for relationship tracking (CHK-231)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:270:  const causalLinks = extractCausalLinks(content);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:288:    causalLinks: causalLinks,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:289:    hasCausalLinks: hasCausalLinks(causalLinks),
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:675: * Extract causal_links from memory content YAML metadata block (T126)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:678:  const causalLinks: CausalLinks = {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:680:    supersedes: [],
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:681:    derived_from: [],
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:686:  // Find the causal_links block in YAML metadata
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:687:  const causalBlockMatch = content.match(/(?:^|\n)\s*causalLinks:\s*\n((?:\s+[a-z_]+:[\s\S]*?)*)(?=\n[a-z_]+:|\n```|\n---|\n\n|\n#|$)/i);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:689:  if (!causalBlockMatch) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:690:    return causalLinks;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:693:  const block = causalBlockMatch[1];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:700:    const keyMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*$/);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:707:    const inlineMatch = line.match(/^\s{2,}(caused_by|supersedes|derived_from|blocks|related_to):\s*\[(.*)\]\s*$/);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:716:            if (cleaned && currentKey && !causalLinks[currentKey].includes(cleaned)) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:717:              causalLinks[currentKey].push(cleaned);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:731:        if (value && value !== '[]' && !causalLinks[currentKey].includes(value)) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:732:          causalLinks[currentKey].push(value);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:740:  return causalLinks;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:744: * Check if causalLinks has any non-empty arrays
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:746:export function hasCausalLinks(causalLinks: CausalLinks | null | undefined): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:747:  if (!causalLinks) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:748:  return Object.values(causalLinks).some((arr: string[]) => Array.isArray(arr) && arr.length > 0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:17:import * as mutationLedger from '../lib/storage/mutation-ledger.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:23:import { appendMutationLedgerSafe, getMemoryHashSnapshot } from './memory-crud-utils.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:92:  let mutationLedgerWarning: string | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:139:  // Cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:201:      const ledgerRecorded = appendMutationLedgerSafe(database, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:205:        newHash: mutationLedger.computeHash(JSON.stringify({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:222:      if (!ledgerRecorded) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:223:        mutationLedgerWarning = 'Mutation ledger append failed; audit trail may be incomplete.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:268:  if (mutationLedgerWarning) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:269:    hints.push(mutationLedgerWarning);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:284:  if (mutationLedgerWarning) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:285:    data.mutationLedgerWarning = mutationLedgerWarning;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:9:// - similarity in [0.75, 0.88): CONFLICT (supersede prior memory via causal 'supersedes' edge)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:18:import * as causalEdges from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:93:  causalEdgeId: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:346:      // Create supersedes causal edge
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:348:        INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, extracted_at)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:349:        VALUES (?, ?, 'supersedes', 1.0, datetime('now'))
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:465: * - Create a 'supersedes' causal edge from new -> existing
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:469: * - Skip edge creation (avoids self-referential edges)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:482:    // Add causal 'supersedes' edge only when caller provides a distinct new ID.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:483:    // Prevent self-referential supersedes edges (source == target).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:484:    let edgeId: number | null = null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:491:      // Atomic transaction: deprecate + edge must succeed or fail together.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:502:          console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:508:        edgeId = causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:511:          'supersedes',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:515:        if (edgeId == null) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:517:            `Failed to insert supersedes edge (${sourceId} -> ${targetId}) — aborting reconsolidation`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:547:      causalEdgeId: edgeId,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:654:        // TM-06 live-save path: materialize memory + supersede edge together
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:673:          // Memory so we don't leave dangling rows with no supersedes edge.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:148: * Requires SQLite 3.35.0+ which supports ALTER TABLE DROP COLUMN.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:97:  edgeCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:442:    edgeCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:452:      edgeCount: stats.totalEdges,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:458:    codeGraph = { status: 'error', lastScan: null, nodeCount: 0, edgeCount: 0, fileCount: 0 };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:535:      content: `status=${codeGraph.status}; files=${codeGraph.fileCount}; nodes=${codeGraph.nodeCount}; edges=${codeGraph.edgeCount}; lastScan=${codeGraph.lastScan ?? 'unknown'}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:27:import { deleteEdgesForMemory } from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:71:    'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:74:    'mutation_ledger',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:113:  'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:116:  'mutation_ledger',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:135:  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:136:  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:137:  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:138:  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:206:  causalEdges?: Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:311:  'memory_index', 'memory_fts', 'vec_memories', 'vec_metadata', 'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:313:  'memory_summaries', 'mutation_ledger',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:541:function getEdgeIds(edges: Array<Record<string, unknown>>): number[] {

exec
/bin/zsh -lc "rg -n \"memory_health|health|verifyIntegrity|divergent_aliases|orphan|autoRepair|repair|quality review|validation\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/scripts/memory .opencode/skill/system-spec-kit/mcp_server/lib | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:8:// Database maintenance — removes orphaned vector embeddings and history entries
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:36:cleanup-orphaned-vectors — Remove orphaned vector embeddings and history entries
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:38:Usage: node cleanup-orphaned-vectors.js [options]
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:45:  node cleanup-orphaned-vectors.js                # Run cleanup
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:46:  node cleanup-orphaned-vectors.js --dry-run      # Preview only
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:71:    // STEP 1: Discover orphaned entries across all tables
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:72:    console.log('\n[Step 1] Finding orphaned memory_history entries...');
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:73:    let orphanedHistoryCount = 0;
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:76:      const orphanedHistory = database.prepare(`
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:83:      orphanedHistoryCount = orphanedHistory.count;
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:85:      if (orphanedHistoryCount > 0) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:86:        console.log(`Found ${orphanedHistoryCount} orphaned history entries`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:88:        console.log('No orphaned history entries found');
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:99:    console.log('\n[Step 2] Finding orphaned vector entries...');
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:100:    const orphanedVectors = database.prepare(`
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:107:    const orphanedVectorCount = orphanedVectors.count;
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:108:    console.log(`Found ${orphanedVectorCount} orphaned vectors`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:110:    // STEP 2: Delete all orphans in a single atomic transaction
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:114:      if (orphanedHistoryCount > 0) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:115:        console.log(`[DRY-RUN] Would delete ${orphanedHistoryCount} orphaned history entries`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:116:        totalCleaned += orphanedHistoryCount;
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:118:      if (orphanedVectorCount > 0) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:119:        console.log(`[DRY-RUN] Would delete ${orphanedVectorCount} orphaned vectors`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:120:        totalCleaned += orphanedVectorCount;
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:122:    } else if (orphanedHistoryCount > 0 || orphanedVectorCount > 0) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:123:      console.log('\n[Step 3] Deleting all orphans in a single atomic transaction...');
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:128:        // Delete orphaned history entries
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:129:        if (hasHistoryTable && orphanedHistoryCount > 0) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:134:          console.log(`Deleted ${historyDeleteResult.changes} orphaned history entries`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:138:        // Delete orphaned vector entries
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:139:        if (orphanedVectorCount > 0) {
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:144:          console.log(`Deleted ${vectorDeleteResult.changes} orphaned vectors`);
.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:178:    console.error('[cleanup-orphaned-vectors] Error:', errMsg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:229:    throwSharedMemoryAuthError('Shared-memory admin validation failed.', adminResult.response);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:249:  // transport principal, so the trusted-session validation used by
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:443:  const validation = isValidSpecFolder(specFolderArg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:445:  if (validation.warning) {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:446:    console.warn(`   Warning: ${validation.warning}`);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:449:  if (validation.valid) return;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:466:  console.error(`   Reason: ${validation.reason}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:50:/** Arguments for the memory_health handler. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:52:  reportMode?: 'full' | 'divergent_aliases';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:55:  autoRepair?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:64:  healthy?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:90:/** Result returned by post-mutation hooks (cache invalidation, etc.). */
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:27:  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:197:      // Fall back to resolvedPath during pre-validation when target does not yet exist.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:26:export type QualityLevel = 'healthy' | 'degraded' | 'critical';
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:200: * session-health.ts should use this instead of the memory-surface duplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:241:  if (score > 0.7) level = 'healthy';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:231:        // Previously errors were caught and logged, leaving orphan causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43:// T73: Import session manager for trusted session validation (IDOR prevention)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:194:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skill/system-spec-kit/scripts/memory/README.md:8:  - "cleanup orphaned vectors"
.opencode/skill/system-spec-kit/scripts/memory/README.md:40:- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories
.opencode/skill/system-spec-kit/scripts/memory/README.md:78:node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
.opencode/skill/system-spec-kit/scripts/memory/README.md:92:- Produces ANCHOR-structured markdown expected by downstream validation and indexing.
.opencode/skill/system-spec-kit/scripts/memory/README.md:97:- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:9:import { handleMemoryHealth } from './memory-crud-health.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:14:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:36:const handle_memory_health = handleMemoryHealth;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud.ts:45:  handle_memory_health,
.opencode/skill/system-spec-kit/scripts/memory/fix-memory-h1.mjs:2:// One-shot repair script: Fix H1 headings in all memory files.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:3:description: "Pre-flight quality gates for memory operations: anchor validation, duplicate detection and token budget verification."
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:5:  - "validation"
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:12:> Pre-flight quality gates for memory operations: anchor validation, duplicate detection, token budget verification and content size checks.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:30:The validation subsystem provides pre-flight checks that run before expensive operations like embedding generation or database writes. It prevents invalid data from entering the system and provides actionable feedback for resolution.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:50:| **Save Quality Gate** | 3-layer pre-storage validation (structural, content quality scoring, semantic dedup). Behind `SPECKIT_SAVE_QUALITY_GATE` flag |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:58:validation/
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:59: preflight.ts         # Pre-flight validation before expensive operations
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:68:| `preflight.ts` | All validation logic: anchors, duplicates, tokens, content size, unified preflight |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:69:| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:173:| `validateStructural(params)` | Layer 1: structural validation |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:246:// result.dry_run_would_pass shows actual validation result
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:274:| Full validation | `runPreflight()` | Before memory_save |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:279:| Structural check | `validateStructural()` | Quick pre-save structural validation |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:281:| Recursive phase validation | `validate.sh --recursive` | Validate phase-based spec hierarchies (spec 139) |
.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md:293:| [../../context-server.ts](../../context-server.ts) | MCP server using validation |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:28:// Feature catalog: Health diagnostics (memory_health)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:30:// Feature catalog: Memory health autoRepair metadata
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86:const DIVERGENT_ALIAS_REPORT_MODE = 'divergent_aliases';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222:/** Handle memory_health tool -- returns system health status and diagnostics. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:231:    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:233:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:245:    autoRepair = false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:251:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:260:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:267:  if (typeof autoRepair !== 'boolean') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:269:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:270:      error: 'autoRepair must be a boolean',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:278:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:287:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:331:      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:333:        tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:340:    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:348:    if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:349:      hints.push('autoRepair is only applied in reportMode="full"');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:359:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:363:        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:380:  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:384:  const repair = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:385:    requested: autoRepair,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:387:    repaired: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:397:    repair.attempted = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:407:      // Resolve the lazy profile so health reflects the active runtime provider
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:419:  const repairActions = [
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:422:    'orphan_edges_cleanup',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:423:    'orphan_vector_cleanup',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426:  if (autoRepair && !confirmed) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:428:      tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:429:      summary: 'Confirmation required before auto-repair actions are executed',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:433:        autoRepairRequested: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:435:        actions: repairActions,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:439:        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:465:        if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:468:            repair.actions.push('fts_rebuild');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:471:            repair.actions.push('trigger_cache_refresh');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:473:            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:474:            if (memoryCountRow.count === repairedFtsCountRow.count) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:476:              repair.actions.push('fts_consistency_verified');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:477:              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:480:              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:481:              repair.warnings.push(warning);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:482:              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:484:          } catch (repairError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:485:            const message = toErrorMessage(repairError);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:487:            repair.errors.push(sanitizeErrorForHint(message));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:488:            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:495:      if (autoRepair) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:497:        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:502:  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:503:  // (referencing deleted memories) are cleaned up during health checks.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:504:  if (autoRepair && database) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:506:      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:508:      const orphanResult = causalEdges.cleanupOrphanedEdges();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:509:      if (orphanResult.deleted > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:511:        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:512:        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:514:    } catch (orphanError: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:516:      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:520:  if (autoRepair && database) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:522:      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:528:        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:529:        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:534:        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:535:        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:538:      const postRepairReport = vectorIndex.verifyIntegrity({ autoClean: false });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:540:        postRepairReport.orphanedVectors > 0 ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:542:        postRepairReport.orphanedFiles.length > 0 ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:543:        postRepairReport.orphanedChunks > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:545:        repair.warnings.push(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:546:          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:547:          `missingVectors=${postRepairReport.missingVectors}, orphanedFiles=${postRepairReport.orphanedFiles.length}, ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:548:          `orphanedChunks=${postRepairReport.orphanedChunks}`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:553:      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:557:  if (repair.attempted) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:558:    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:559:    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:570:    tool: 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:582:      repair,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:587:        healthy: providerMetadata.healthy !== false,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:68:} from './validation-responses.js';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:6:// 3-layer validation before storing memories:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:7:// - Layer 1: Structural validation (existing checks, formalized)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:29:/** Result from Layer 1: Structural validation */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:106:/** Minimum content length for structural validation */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:143:/** Spec folder path validation pattern */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:797:  // Layer 1: Structural validation
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:38:  anchor_validation_strict: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:52:/** Result of anchor format validation */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:87:/** Result of content size validation */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:251:  // Anchor validation
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:252:  anchor_validation_strict: process.env.MCP_ANCHOR_STRICT === 'true',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:301:  const { strict = PREFLIGHT_CONFIG.anchor_validation_strict } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:311:    result.warnings.push('No content provided for anchor validation');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:386:  // In strict mode, throw on any validation errors
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:390:      `Anchor validation failed: ${result.errors.length} error(s)`,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:798:  // 1. Content size validation (fast, do first)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:812:  // 2. Anchor format validation
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/README.md:11:| `status.ts` | `code_graph_status` | Report graph health and statistics |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:134:function repairBm25Document(args: {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:154:  } catch (repairErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:155:    const repairMessage = toErrorMessage(repairErr);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:156:    console.warn(`[memory-save] Immediate BM25 repair failed (${args.contextLabel}): ${repairMessage}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:157:    return `BM25 repair failed after ${args.contextLabel} for memory ${args.memoryId}: ${repairMessage}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:287:                    const bm25Warning = repairBm25Document({
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:51:| **Ontology Hooks** | Schema-guided extraction validation: loads OntologySchema (entity types + relation types) and validates entity/relation pairs against allowed lists. Gated by `SPECKIT_ONTOLOGY_HOOKS` |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:66: ontology-hooks.ts        # Schema-guided extraction validation (SPECKIT_ONTOLOGY_HOOKS)
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:51:  validation: ValidationResult;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:119:  validation,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:174:    warnings: [...validation.warnings, ...reconWarnings],
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:98:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648:/** Handle memory_validate tool - records user validation feedback to adjust confidence */
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:768:    ? `Positive validation recorded (confidence: ${result.confidence.toFixed(2)})`
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:769:    : `Negative validation recorded (confidence: ${result.confidence.toFixed(2)})`;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:775:  if (!wasUseful && result.validationCount > 3) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:786:      validationCount: result.validationCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:312:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:320:  // T304: Consolidated score validation
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:470:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:478:  // T304: Consolidated score validation
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:669:  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:40:- `shared-memory.ts` - Shared-memory lifecycle handlers plus caller/admin auth validation.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:46:- `code-graph/status.ts` - `code_graph_status`: report graph health and statistics.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:51:- `memory-crud-delete.ts`, `memory-crud-update.ts`, `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts` - Focused CRUD implementations behind `memory-crud.ts`.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:55:- `mutation-hooks.ts` - Post-mutation cache invalidation and feedback wiring.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:58:- `v-rule-bridge.ts` - Runtime bridge to validation scripts for memory quality checks.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:71:- `memory-crud-health.ts` surfaces embedding retry stats and FTS/index sync diagnostics as part of the health response.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:80:- Post-mutation invalidation clears `clearDegreeCache()` alongside trigger and constitutional caches so graph-derived retrieval signals cannot serve stale data after mutations.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:5:// from validation outcomes. No side effects or DB access.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:34:  validation: ParsedMemoryValidation,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:47:    warnings: validation.warnings,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:57:  validation: ParsedMemoryValidation,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:71:    warnings: validation.warnings,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:72:    rejectionReason: `Template contract validation failed: ${violationSummary}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:94:  return 'Dry-run validation passed';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:9:import { handleSessionHealth } from './session-health.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:47:  health: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:96:  healthData: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:105:  if (healthData.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:121:  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:122:  if (healthStatus === 'warning' || healthStatus === 'stale') {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:182:  // Sub-call 2: session_health
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:183:  let healthData: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:185:    const healthResponse = await handleSessionHealth();
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:186:    healthData = extractData(healthResponse);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:187:    allHints.push(...extractHints(healthData));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:190:    healthData = { error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:191:    allHints.push('session_health failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:220:  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:225:  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:270:      key: 'health-surface',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:272:      content: summarizeUnknown(healthData),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:274:      certainty: healthCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:300:      { label: 'health', certainty: healthCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:325:    health: healthData,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:333:      healthPayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:139:  // Cache invalidation, BM25 re-index, ledger append) in a single transaction for atomicity.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:7:// Multiplier: starts at 1.0, decreases with each negative validation
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:25:/** Per-negative-validation penalty applied to the multiplier. */
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:30: * After 30 days since the last negative validation, the penalty
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:36:/** Persistence table for negative-validation history. */
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:56: * Compute the confidence multiplier based on negative validation count
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:57: * and time since last negative validation.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:60: * for each negative validation, but never drops below CONFIDENCE_MULTIPLIER_FLOOR (0.3).
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:63: * the last negative validation. This means:
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:69: * @param negativeCount - Number of negative (wasUseful=false) validations
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:70: * @param lastNegativeAt - Timestamp (ms epoch) of the most recent negative validation.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:110: * @param negativeCount - Number of negative validations on the memory
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:111: * @param lastNegativeAt - Timestamp (ms epoch) of the most recent negative validation
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:129:/** Record one negative validation event for a memory. */

exec
/bin/zsh -lc "rg -n \"topic_key|revision_count|duplicate_count|deleted_at|soft-delete|upsert|dedupe|duplicate\" .opencode/skill/system-spec-kit -g '*.ts' -g '*.js' | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:16:  upsertSharedMembership,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:17:  upsertSharedSpace,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:285:    operation: 'space_upsert' | 'membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:496:              operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:517:          operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:544:        upsertSharedSpace(db, definition);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:551:          upsertSharedSpace(db, definition);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:556:        upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:576:        operation: 'space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:622:      'Shared space upsert failed',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:695:      upsertSharedMembership(db, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:  const deduplicatedPaths: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:232:  let duplicatePathCount = 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:236:      duplicatePathCount++;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:241:    deduplicatedPaths.push(normalizedPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  paths = deduplicatedPaths;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:264:      ...(duplicatePathCount > 0 ? { duplicatePathCount } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:270:      ...(duplicatePathCount > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:271:        ? ['Duplicate input paths were deduplicated before queueing']
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:272: * Extracted from duplicate blocks in handleTaskPreflight and handleTaskPostflight.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:593:        // Check + mark + cap enforcement stay in one transaction to avoid duplicate injection races.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:211:  // Deduplicate hints
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1063:      data.results = deduped.results as SessionAwareResult[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1064:      data.count = deduped.results.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1088:    // Rather than silently falling through to the un-deduped response.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101:      const { results: dedupedResults } = applySessionDedup(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1108:      const dedupedCount = dedupedResults.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1109:      const filteredCount = originalCount - dedupedCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1116:      data.results = dedupedResults;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1117:      data.count = dedupedCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1123:        returnedCount: dedupedCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1136:        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:797:    const duplicatePrecheck = checkContentHashDedup(database, parsed, force, validation.warnings, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:801:    if (duplicatePrecheck) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:802:      return duplicatePrecheck;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1293:        check_duplicates: !force,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1455:  if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1710:  if (indexResult.status !== 'unchanged' && indexResult.status !== 'duplicate' && indexResult.id > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1714:  const shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate' && indexResult.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1737:    indexResult.status === 'duplicate'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1738:      ? 'Memory skipped (duplicate content)'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1751:  } else if (indexResult.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:112:    duplicatesSkipped: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:358:      duplicatesSkipped: dedupDuplicatesSkipped,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:429:          result.status === 'duplicate' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:447:        } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:603:  if (results.dedup.duplicatesSkipped > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:604:    hints.push(`Canonical dedup skipped ${results.dedup.duplicatesSkipped} alias path(s)`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:426:function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:485:    // If focus_count is still 1 after the upsert, this row was newly inserted.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:497:    console.warn(`[working-memory] upsertExtractedEntry error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:744:  upsertExtractedEntry,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:201: * Deduplicates edges by direction+from+to+relation key.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:573:      : ['Restore merged with existing data - duplicates may exist', 'Search indexes rebuilt'],
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:267:    if (!msg.includes('duplicate column')) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:333:    const upsert = db.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:340:      upsert.run('totalScanned', String(archivalStats.totalScanned));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:341:      upsert.run('totalArchived', String(archivalStats.totalArchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:342:      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:343:      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:487: * @returns Deduplicated array of merged results sorted by score descending.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:497:  // CanonicalResultId() prevents duplicate rows when one channel emits
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:615:  const deduped = new Map<string, HybridSearchResult>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:645:      deduped.set(key, mergeRawCandidate(deduped.get(key), candidate));
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:650:    Array.from(deduped.values()).sort((a, b) => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:953:  // Deduplicate by ID (keep highest normalized score)
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:958:  const deduped = new Map<string, HybridSearchResult>();
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:961:    const existing = deduped.get(canonicalId);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:963:      deduped.set(canonicalId, r);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:967:  return Array.from(deduped.values())
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:44: * Similarity threshold above which two memories are considered near-duplicates
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:69: *   similarity >= 0.96  → auto-merge (near-duplicate)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:142:/** Reinforce an existing memory's stability via FSRS scheduling instead of creating a duplicate */
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:4:// MCP tool handler for deep_loop_graph_upsert — idempotent
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:5:// node/edge upsert with self-loop rejection and weight clamping.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:8:  upsertNode,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:9:  upsertEdge,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:67:/** Handle deep_loop_graph_upsert tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:155:    // Execute batch upsert
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:200: * session-health.ts should use this instead of the memory-surface duplicate.
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:214:  it('does not duplicate nodes or children', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts:225:    // Root should have exactly one child, not duplicated
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:211:      const fileId = graphDb.upsertFile(
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:226:  // Deduplicate
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:389:      // Prevent duplicate insertions from repeated terms in a single call.
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/index.ts:4:export { handleCoverageGraphUpsert } from './upsert.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:12:// Feature catalog: Generation-time duplicate and empty content prevention
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:226:  // P1-4 FIX: Check content hash even during force reindex to prevent duplicate
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:228:  // not change either, so re-indexing provides no value and creates duplicates.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:262:    const duplicateParams: Array<string> = [
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:271:      duplicateParams.push(samePathExclusion.filePath);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:273:      duplicateParams.push(samePathExclusion.canonicalFilePath);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:276:    const duplicateByHash = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:282:    `).get(...duplicateParams) as DuplicateLookupRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:284:    if (duplicateByHash) {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:286:        duplicateByHash.content_text,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:287:        duplicateByHash.file_path,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:291:        console.warn(`[memory-save] Hash match for memory #${duplicateByHash.id} failed secondary content verification; continuing save`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:294:      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:296:        status: 'duplicate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:297:        id: duplicateByHash.id,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:299:        title: parsed.title ?? duplicateByHash.title ?? '',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:304:        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:18:  async upsert(_id: string, _embedding: unknown, _metadata: Record<string, unknown>): Promise<number> {
.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/vector-store.ts:19:    throw new Error('Method upsert() must be implemented by subclass');
.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts:5:// Previously declared duplicates locally — now imports from the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:415:    // Deduplicate by ID, keeping the higher similarity score
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:312:  const shouldEmitPostMutationFeedback = result.status !== 'duplicate' && result.status !== 'unchanged';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:340:    message: result.message ?? (result.status === 'duplicate' ? 'Memory skipped (duplicate content)' : `Memory ${result.status} successfully`),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:406:    hints.push('Existing memory was reinforced instead of creating duplicate');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:435:  } else if (result.status === 'duplicate') {
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:397:    throw new Error(`[session-analytics-db] Session row missing after upsert for ${claudeSessionId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:472:function upsertSessionRow(
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:595:  upsertSessionRow(db, state);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:143:  it('G1: deduplicates when source_id equals target_id (same numeric value)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:154:    expect(uniqueIds.size).toBe(ids.length); // no duplicate entries
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:262:  it('deduplicates FTS results using the highest composite score', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:330:  it('T002-3: duplicate sibling chunks (same parent_id) are collapsed to one row', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:366:  it('T012-1: duplicate chunk dedup is identical for includeContent=false and includeContent=true', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:103:/** Semantic dedup similarity threshold: above this, reject as near-duplicate */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:686: * Layer 3: Check for semantic near-duplicates using vector similarity.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:690: * memory, the new memory is rejected as a near-duplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:729:        ? `Near-duplicate detected: memory #${bestMatch.id} (similarity: ${(bestMatch.similarity * 100).toFixed(1)}% >= ${SEMANTIC_DEDUP_THRESHOLD * 100}%)`
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:230:  it('T005b-Q9: enqueueIngestJob ignores duplicate enqueues for the same job ID', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:237:    const filePath = createTempFile('duplicate-enqueue');
.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts:239:      id: 'job_duplicate_enqueue',
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:113: *   2. Lowercase and deduplicate.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:36:  exact_duplicate_enabled: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:37:  similar_duplicate_threshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:60:/** Result of duplicate detection */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:63:  duplicate_type: 'exact' | 'similar' | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:95:/** Parameters for duplicate checking */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:109:/** Options for duplicate checking */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:134:  check_duplicates?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:248:  exact_duplicate_enabled: true,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:249:  similar_duplicate_threshold: parseFloat(process.env.MCP_DUPLICATE_THRESHOLD || '0.95'),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:327:  // Track seen anchor IDs for duplicate detection
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:333:    // Check for duplicate anchor IDs
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:340:        suggestion: `Rename one of the duplicate anchors to a unique ID`,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:432:    check_exact = PREFLIGHT_CONFIG.exact_duplicate_enabled,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:434:    similarity_threshold = PREFLIGHT_CONFIG.similar_duplicate_threshold,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:439:    duplicate_type: null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:467:    duplicate: {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:478:      userId: duplicate.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:479:      agentId: duplicate.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:504:    if (typeof duplicate.file_path === 'string') {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:505:      result.existing_path = duplicate.file_path;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:513:  // Check 1: Exact duplicate via content hash (fast)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:554:        result.duplicate_type = 'exact';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:562:      console.warn('[preflight] Exact duplicate check failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:566:  // Check 2: Similar duplicate via vector similarity (requires embedding)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:592:          result.duplicate_type = 'similar';
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:601:      console.warn('[preflight] Similar duplicate check failed:', message);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:768:    check_duplicates = true,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:851:  if (check_duplicates && content) {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:856:    addCheck('duplicate_check', dupResult);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:859:      // Exact duplicates block save
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:860:      if (dupResult.duplicate_type === 'exact') {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:864:          message: `Exact duplicate found: memory #${dupResult.existingId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:870:      // Similar duplicates are warnings (PE-gating handles them)
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:871:      else if (dupResult.duplicate_type === 'similar') {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:145:  it('deduplicates by normalized text', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:150:    // Should be deduplicated to a single entry
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:155:  it('sums frequencies for duplicate entities', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:444:    expect(result.upserted).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:507:  it('returns upserted count matching entity count', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:514:    expect(result.upserted).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:725:// 9. __testables.deduplicateEntities (internal helper)
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:728:describe('__testables.deduplicateEntities', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:735:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:744:    const result = __testables.deduplicateEntities([]);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:754:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:759:  it('treats differently-cased text as duplicates via normalization', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:764:    const result = __testables.deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:431:    it('deduplicates user selections by query_id:memory_id', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:77: * Results are deduplicated by normalized text with summed frequencies.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:80: * @returns Array of extracted entities, deduplicated and frequency-counted.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:120:  // Deduplicate by normalized text (lowercase, trimmed), summing frequencies
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:121:  return deduplicateEntities(raw);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:258: * @returns Count of entities upserted.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:263:): { upserted: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:265:    let upserted = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:310:        upserted++;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:315:    return { upserted };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:319:    return { upserted: 0 };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:491: * Deduplicate raw extraction results by normalized text.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:495:function deduplicateEntities(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:517:  deduplicateEntities,
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:95: * @returns Deduplicated array of extracted aliases.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:275: * @returns Array of 2-5 deduplicated surrogate questions.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:266:  const inserted = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:204: *   3. Return the deduplicated list.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:210: * @returns Merged, deduplicated, coverage-ranked result array.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:958:   * const id = await store.upsert('ignored', embedding, { spec_folder: 'specs/001-demo', file_path: 'spec.md' });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:961:  async upsert(_id: string, embedding: EmbeddingInput, metadata: JsonObject): Promise<number> {
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:62:function dedupeFallbackRationale(title: string, rationaleCandidate: string, authoredRationale: string): string {
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:337:        const rationale: string = dedupeFallbackRationale(title, rationaleCandidate, rationaleFromInput);
.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:508:    const RATIONALE: string = dedupeFallbackRationale(obs.title || narrative, rationaleCandidate, '');
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:965:      // BUG-027 FIX: Skip symbolic links to prevent loops and duplicate scanning
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:549:  it('T005-01: computePrecision deduplicates repeated relevant IDs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/eval-metrics.vitest.ts:555:  it('T005-02: computeF1 matches harmonic mean of deduped precision and recall', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:76:- \`decision-record.md\` — UX contract and duplicate detection strategy
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:86:| \`mcp_server/handlers/save/response-builder.ts\` | Shapes successful save payloads, duplicate no-op hints, and deferred embedding response details. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:94:This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:102:- Validated duplicate no-op response shape
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:110:- Decided to keep duplicate no-op saves visible in the UX contract so callers can distinguish unchanged content from validation failures.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:116:- Verified duplicate no-op saves omit post-mutation hooks and leave caches unchanged.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:222:  it('does not emit postMutationHooks for duplicate-content no-op saves', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:224:    const duplicatePath = path.join(FIXTURE_ROOT, 'memory', 'duplicate.md');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:225:    const sharedContent = buildMemoryContent('Duplicate Seed', 'Shared duplicate body for regression coverage.');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:228:    fs.writeFileSync(duplicatePath, sharedContent, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:236:      filePath: duplicatePath,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:242:    expect(parsed.data.status).toBe('duplicate');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:305:  it('atomicSaveMemory duplicate no-op omits postMutationHooks and reports no-op status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:306:    const indexedPath = path.join(FIXTURE_ROOT, 'memory', 'atomic-duplicate-seed.md');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:307:    const duplicatePath = path.join(FIXTURE_ROOT, 'memory', 'atomic-duplicate-copy.md');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:308:    const sharedContent = buildMemoryContent('Atomic Duplicate Seed', 'Atomic duplicate behavior regression fixture.');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:318:        file_path: duplicatePath,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:325:    expect(['duplicate', 'unchanged', 'no_change']).toContain(result.status);
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:168: * @returns Array of candidate noun phrase tokens (lowercase, deduplicated).
.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:187:  // fields via {{#HAS_DECISION_TREE}}. AUTO_DECISION_TREES would duplicate them.
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:170:function dedupe<T>(items: T[]): T[] {
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:182:  const triggerPhrases = dedupe([
.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts:387:    triggerPhrases: dedupe([
.opencode/skill/system-spec-kit/scripts/extractors/implementation-guide-extractor.ts:13:// O3-2: Use canonical types from session-types (no local duplicates)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:6:// ClearExisting=true, duplicate file_path skip, edge cases.
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:292:  // 4.4 restoreCheckpoint duplicate file_path skip
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:320:    it('EXT-S9: duplicate checkpoint name handled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:626:      checkpointStorage.createCheckpoint({ name: 'anchor-aware-duplicate-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:631:      const result = checkpointStorage.restoreCheckpoint('anchor-aware-duplicate-test', false);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:647:      checkpointStorage.deleteCheckpoint('anchor-aware-duplicate-test');
.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:386: * Deduplicate and validate a list of numeric IDs, truncating to integers
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:561: * REQ-D4-005: Assistive reconsolidation for near-duplicate detection.
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:409:  it('runtime accepts exactly one actor identity for shared_space_upsert', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:411:      validateToolArgs('shared_space_upsert', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:420:  it('handler auth rejects shared_space_upsert when actor identity is omitted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:425:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:382:  // Deduplicate observations: merge repeated tool calls on the same file
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:383:  const deduped = deduplicateObservations(observations || []);
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:385:  return deduped
.opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts:426: * Deduplicate observations that represent repeated tool calls on the same file.

exec
/bin/zsh -lc "sed -n '184,360p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  const {
    prompt,
    limit: rawLimit = 3,
    session_id: rawSessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  if (!prompt || typeof prompt !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_match_triggers',
      error: 'prompt is required and must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'prompt' },
      recovery: {
        hint: 'Provide a non-empty string for the prompt parameter'
      }
    });
  }

  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
  // manager to prevent IDOR. Callers cannot read/write working memory for
  // arbitrary sessions — only server-minted or previously tracked sessions.
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId: args.tenantId,
      userId: args.userId,
      agentId: args.agentId,
    });
    if (trustedSession.error) {
      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
      return createMCPErrorResponse({
        tool: 'memory_match_triggers',
        error: trustedSession.error,
        code: 'E_SESSION_SCOPE',
        details: { requestedSessionId: rawSessionId },
        recovery: {
          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
        },
      });
    }
    sessionId = trustedSession.effectiveSessionId;
  }

  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  await checkDatabaseUpdated();

  const startTime = Date.now();

  // Eval logger — capture trigger query at entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: prompt,
      intent: 'trigger_match',
      specFolder: null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }

  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
    try {
      if (_evalRunId && _evalQueryId) {
        logFinalResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          resultMemoryIds: memoryIds,
          scores: memoryIds.map(() => 1.0), // trigger matches are binary
          fusionMethod: 'trigger',
          latencyMs,
        });
      }
    } catch (_error: unknown) {
      /* eval logging must never break triggers handler */
    }
  };

  const useCognitive = includeCognitive &&
    sessionId &&
    workingMemory.isEnabled() &&
    attentionDecay.getDb();

  let decayStats: DecayStats | null = null;
  if (useCognitive) {
    try {
      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory_match_triggers] Decay failed:', message);
    }
  }

  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
  let results: TriggerMatch[] = triggerMatchResult.matches;

  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
    try {
      const database = initialize_db();
      const memoryIds = results.map(r => r.memoryId);
      if (memoryIds.length > 0) {
        const placeholders = memoryIds.map(() => '?').join(',');
        const scopeRows = database.prepare(`
          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
          FROM memory_index WHERE id IN (${placeholders})
        `).all(...memoryIds) as Array<{
          id: number;
          spec_folder?: string;
          tenant_id?: string;
          user_id?: string;
          agent_id?: string;
          shared_space_id?: string;
        }>;
        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
        results = results.filter(match => {
          const row = scopeMap.get(match.memoryId);
          if (!row) return false;
          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
          // when the caller specifies a scope, not silently passed through.
          if (specFolder && row.spec_folder !== specFolder) return false;
          if (tenantId && row.tenant_id !== tenantId) return false;
          if (userId && row.user_id !== userId) return false;
          if (agentId && row.agent_id !== agentId) return false;
          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
          return true;
        });
      }
    } catch (scopeErr: unknown) {
      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
      results = [];
    }
  }
  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
    ? triggerMatchResult.stats.signals
    : [];
  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;

  if (!results || results.length === 0) {
    const noMatchResponse = createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
        degradedMatching: degradedTriggerMatching,
        cognitive: useCognitive ? {
          enabled: true,
          sessionId,
          turnNumber: turnNumber,
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content',
        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
      ],
      startTime: startTime
    });

    logFinalTriggerEval([], Date.now() - startTime);
    return noMatchResponse;
  }

  let formattedResults: FormattedResult[];

exec
/bin/zsh -lc "sed -n '222,430p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/** Handle memory_health tool -- returns system health status and diagnostics. */
async function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  // A7-P2-1: Generate requestId for incident correlation in error responses
  const requestId = randomUUID();
  try {
    await checkDatabaseUpdated();
  } catch (dbStateErr: unknown) {
    const message = toErrorMessage(dbStateErr);
    console.error(`[memory-health] Database refresh failed [requestId=${requestId}]: ${message}`);
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'Database refresh failed before diagnostics completed. Retry the request or restart the MCP server.',
      code: 'E021',
      details: { requestId },
      startTime,
    });
  }

  const {
    reportMode = 'full',
    limit: rawLimit = DEFAULT_DIVERGENT_ALIAS_LIMIT,
    specFolder,
    autoRepair = false,
    confirmed = false,
  } = args ?? {};

  if (reportMode !== 'full' && reportMode !== DIVERGENT_ALIAS_REPORT_MODE) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: `Invalid reportMode: ${String(reportMode)}. Expected "full" or "${DIVERGENT_ALIAS_REPORT_MODE}"`,
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'specFolder must be a string',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof autoRepair !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'autoRepair must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (typeof confirmed !== 'boolean') {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'confirmed must be a boolean',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  if (rawLimit !== undefined && (!Number.isFinite(rawLimit) || rawLimit <= 0)) {
    return createMCPErrorResponse({
      tool: 'memory_health',
      error: 'limit must be a positive number',
      code: 'E_INVALID_INPUT',
      details: { requestId },
      startTime,
    });
  }
  const safeLimit = Math.max(1, Math.min(Math.floor(rawLimit || DEFAULT_DIVERGENT_ALIAS_LIMIT), MAX_DIVERGENT_ALIAS_LIMIT));

  const database = vectorIndex.getDb();
  let memoryCount = 0;
  let aliasConflicts: ReturnType<typeof summarizeAliasConflicts> = summarizeAliasConflicts([]);
  let aliasRows: AliasConflictDbRow[] = [];
  let divergentAliasGroups: DivergentAliasGroup[] = [];
  const embeddingRetry = getEmbeddingRetryStats();
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number> | undefined;
      memoryCount = countResult?.count ?? 0;

      const whereParts: string[] = [
        'parent_id IS NULL',
      ];
      const params: unknown[] = [];
      if (specFolder) {
        whereParts.push('spec_folder = ?');
        params.push(specFolder);
      }

      const aliasSql = `
        SELECT file_path, content_hash, spec_folder
        FROM memory_index
        WHERE ${whereParts.join(' AND ')}
      `;

      aliasRows = (database.prepare(aliasSql).all(...params) as AliasConflictDbRow[])
        .filter((row) => typeof row?.file_path === 'string' && isSpecsAliasPath(row.file_path));
      aliasConflicts = summarizeAliasConflicts(aliasRows);
      divergentAliasGroups = getDivergentAliasGroups(aliasRows, safeLimit);
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      console.error(`[memory-health] Schema missing [requestId=${requestId}]:`, message);
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        details: { requestId },
        startTime,
      });
    }
    console.warn(`[memory-health] Failed to get memory count [requestId=${requestId}]:`, message);
  }

  if (reportMode === DIVERGENT_ALIAS_REPORT_MODE) {
    const hints: string[] = [];
    if (!database) {
      hints.push('Database not connected - restart MCP server');
    }
    if (autoRepair) {
      hints.push('autoRepair is only applied in reportMode="full"');
    }
    if (aliasConflicts.divergentHashGroups === 0) {
      hints.push('No divergent alias groups detected');
    }
    if (aliasConflicts.divergentHashGroups > divergentAliasGroups.length) {
      hints.push(`More divergent alias groups available: increase limit above ${safeLimit}`);
    }

    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: `Divergent alias report: ${divergentAliasGroups.length} of ${aliasConflicts.divergentHashGroups} group(s)`,
      data: {
        reportMode,
        status: isEmbeddingModelReady() && database ? 'healthy' : 'degraded',
        databaseConnected: !!database,
        embeddingRetry,
        specFolder: specFolder ?? null,
        limit: safeLimit,
        totalRowsScanned: aliasRows.length,
        totalDivergentGroups: aliasConflicts.divergentHashGroups,
        returnedGroups: divergentAliasGroups.length,
        groups: divergentAliasGroups,
      },
      hints,
      startTime,
    });
  }

  let providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
  let profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  const repair = {
    requested: autoRepair,
    attempted: false,
    repaired: false,
    partialSuccess: false,
    actions: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  let successfulRepairCount = 0;
  let failedRepairCount = 0;

  const trackRepairOutcome = (succeeded: boolean): void => {
    repair.attempted = true;
    if (succeeded) {
      successfulRepairCount += 1;
      return;
    }
    failedRepairCount += 1;
  };

  if (!profile) {
    try {
      // Resolve the lazy profile so health reflects the active runtime provider
      // Rather than the legacy sync fallback defaults.
      profile = await embeddings.getEmbeddingProfileAsync() as EmbeddingProfile | null;
      providerMetadata = embeddings.getProviderMetadata() as PartialProviderMetadata;
    } catch (profileError: unknown) {
      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
    }
  }

  const providerName = profile?.provider ?? providerMetadata.provider;
  const providerModel = profile?.model ?? providerMetadata.model ?? embeddings.getModelName();
  const providerDimension = profile?.dim ?? providerMetadata.dim ?? embeddings.getEmbeddingDimension();
  const repairActions = [
    'fts_rebuild',
    'trigger_cache_refresh',
    'orphan_edges_cleanup',
    'orphan_vector_cleanup',
  ];

  if (autoRepair && !confirmed) {
    return createMCPSuccessResponse({
      tool: 'memory_health',
      summary: 'Confirmation required before auto-repair actions are executed',
      data: {

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '797,910p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  // Layer 1: Structural validation
  // REQ-D4-003: Pass contextType so validateStructural can apply the short-critical exception
  const structural = validateStructural({
    title: params.title,
    content: params.content,
    specFolder: params.specFolder,
    contextType: params.contextType,
    anchor: params.anchors?.[0] ?? null,
  });
  allReasons.push(...structural.reasons);

  // Layer 2: Content quality scoring
  const contentQuality = scoreContentQuality({
    title: params.title,
    content: params.content,
    triggerPhrases: params.triggerPhrases,
    anchors: params.anchors,
  });
  allReasons.push(...contentQuality.reasons);

  // Layer 3: Semantic dedup (only if embedding and findSimilar are available)
  let semanticDedup: SemanticDedupResult | null = null;
  if (params.embedding && params.findSimilar) {
    semanticDedup = checkSemanticDedup(
      params.embedding,
      params.specFolder,
      params.findSimilar
    );
    if (semanticDedup.reason) {
      allReasons.push(semanticDedup.reason);
    }
  }

  // Determine pass/fail
  const wouldReject = !structural.pass
    || !contentQuality.pass
    || (semanticDedup !== null && !semanticDedup.pass);

  // In warn-only mode, log but allow through
  if (warnOnly && wouldReject) {
    console.warn(
      `[QUALITY-GATE] warn-only | score: ${contentQuality.signalDensity.toFixed(2)} | would-reject: true | reasons: [${allReasons.join(', ')}]`
    );
  }

  const pass = warnOnly ? true : !wouldReject;

  return {
    pass,
    gateEnabled: true,
    warnOnly,
    wouldReject,
    layers: {
      structural,
      contentQuality,
      semanticDedup,
    },
    reasons: allReasons,
  };
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS (re-export constants for testing)
   ──────────────────────────────────────────────────────────────── */

export {
  SIGNAL_DENSITY_THRESHOLD,
  SEMANTIC_DEDUP_THRESHOLD,
  MIN_CONTENT_LENGTH,
  WARN_ONLY_PERIOD_MS,
  SHORT_CRITICAL_MIN_STRUCTURAL_SIGNALS,
  SHORT_DECISION_EXCEPTION_LOG_PREFIX,
};

/**
 * Re-exports related public types.
 */
export type { FindSimilarFn };

 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Causal Edges
// ───────────────────────────────────────────────────────────────
// Feature catalog: Causal edge creation (memory_causal_link)
// Causal relationship graph for memory lineage
import type Database from 'better-sqlite3';
import { clearDegreeCacheForDb } from '../search/graph-search-fn.js';
import { clearGraphSignalsCache } from '../graph/graph-signals.js';
import { detectContradictions } from '../graph/contradiction-detection.js';
import { ensureTemporalColumns } from '../graph/temporal-edges.js';
import { isTemporalEdgesEnabled } from '../search/search-flags.js';
import { runInTransaction } from './transaction-manager.js';

/* ───────────────────────────────────────────────────────────────
   1. CONSTANTS
----------------------------------------------------------------*/

const RELATION_TYPES = Object.freeze({
  CAUSED: 'caused',
  ENABLED: 'enabled',
  SUPERSEDES: 'supersedes',
  CONTRADICTS: 'contradicts',
  DERIVED_FROM: 'derived_from',
  SUPPORTS: 'supports',
} as const);

type RelationType = typeof RELATION_TYPES[keyof typeof RELATION_TYPES];

/**
 * C138: Relation weight multipliers applied during traversal scoring.
 * Higher values amplify the propagated strength; values < 1.0 dampen it.
 */
const RELATION_WEIGHTS: Record<string, number> = {
  supersedes:   1.5,  // Strongest signal — new info replaces old
  caused:       1.3,  // Strong causal link
  enabled:      1.1,  // Weak causal link
  supports:     1.0,  // Neutral / default
  derived_from: 1.0,  // Neutral / default
  contradicts:  0.8,  // Dampened — conflicting signals lower confidence
};

const DEFAULT_MAX_DEPTH = 3;
const MAX_EDGES_LIMIT = 100;

// Edge bounds for the lightweight runtime path (NFR-R01, SC-005)
const MAX_EDGES_PER_NODE = 20;
const MAX_AUTO_STRENGTH = 0.5;
const MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05;
const STALENESS_THRESHOLD_DAYS = 90;
const DECAY_STRENGTH_AMOUNT = 0.1;
const DECAY_PERIOD_DAYS = 30;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function clampStrength(strength: number): number | null {
  if (!Number.isFinite(strength)) return null;
  return Math.max(0, Math.min(1, strength));
}

/* ───────────────────────────────────────────────────────────────
   2. INTERFACES
----------------------------------------------------------------*/

interface CausalEdge {
  id: number;
  source_id: string;
  target_id: string;
  relation: RelationType;
  strength: number;
  evidence: string | null;
  extracted_at: string;
  created_by: string;
  last_accessed: string | null;
}

type EdgeQueryResult = CausalEdge[] & {
  truncated: boolean;
  limit: number;
};

interface WeightHistoryEntry {
  id: number;
  edge_id: number;
  old_strength: number;
  new_strength: number;
  changed_by: string;
  changed_at: string;
  reason: string | null;
}

interface GraphStats {
  totalEdges: number;
  byRelation: Record<string, number>;
  avgStrength: number;
  uniqueSources: number;
  uniqueTargets: number;
}

interface CausalChainNode {
  id: string;
  edgeId?: number;          // T202: causal_edges.id for unlink workflow
  depth: number;
  relation: RelationType;
  strength: number;
  children: CausalChainNode[];
  truncated?: boolean;
  truncationLimit?: number | null;
}

/* ───────────────────────────────────────────────────────────────
   3. MODULE STATE
----------------------------------------------------------------*/

let db: Database.Database | null = null;

function invalidateDegreeCache(): void {
  try {
    // H1 FIX: Use db-specific cache invalidation instead of the no-op global version
    if (db) {
      clearDegreeCacheForDb(db);
    }
  } catch (_error: unknown) {
    // Cache invalidation is best-effort; never block edge mutations
  }
  try {
    clearGraphSignalsCache();
  } catch (_error: unknown) {
    // Graph signals cache invalidation is best-effort
  }
}

/* ───────────────────────────────────────────────────────────────
   4. INITIALIZATION
----------------------------------------------------------------*/

function init(database: Database.Database): void {
  db = database;

  // Defensive traversal indexes — the canonical creation lives in
  // Vector-index-impl.ts migration v8 (CHK-062).  These IF NOT EXISTS guards
  // Ensure the indexes are present even when the module is initialised outside
  // The normal migration path (e.g. tests, standalone scripts).
  try {
    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
    ensureTemporalColumns(database);
  } catch (_e: unknown) {
    // Best-effort: table may not exist yet during early startup sequencing
  }
}

/* ───────────────────────────────────────────────────────────────
   5. EDGE OPERATIONS
----------------------------------------------------------------*/

function insertEdge(
  sourceId: string,
  targetId: string,
  relation: RelationType,
  strength: number = 1.0,
  evidence: string | null = null,
  shouldInvalidateCache: boolean = true,
  createdBy: string = 'manual',
): number | null {
  if (!db) {
    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
    return null;
  }
  const database = db;

  // NFR-R01: Auto edges capped at MAX_AUTO_STRENGTH
  const effectiveStrength = createdBy === 'auto'
    ? Math.min(strength, MAX_AUTO_STRENGTH)
    : strength;

  // Prevent self-loops
  if (sourceId === targetId) {
    return null;
  }

  // Fix #26 (FK check) deferred — test environments use synthetic IDs not in memory_index.
  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.

  // NFR-R01: Edge bounds — reject if node already has MAX_EDGES_PER_NODE auto edges
  if (createdBy === 'auto') {
    const edgeCount = countEdgesForNode(sourceId);
    if (edgeCount >= MAX_EDGES_PER_NODE) {
      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
      return null;
    }
  }

  try {
    const clampedStrength = clampStrength(effectiveStrength);
    if (clampedStrength === null) {
      console.warn('[causal-edges] insertEdge rejected non-finite strength');
      return null;
    }

    // Wrap SELECT + UPSERT + logWeightChange in a transaction for atomicity
    const rowId = database.transaction(() => {
      if (isTemporalEdgesEnabled()) {
        detectContradictions(
          database,
          Number.parseInt(sourceId, 10),
          Number.parseInt(targetId, 10),
          relation,
        );
      }

      // Check if edge exists (for weight_history logging on conflict update).
      // This SELECT is intentional: we need the old strength to decide whether
      // To write a weight_history row after the upsert. The subsequent INSERT
      // Uses last_insert_rowid() to avoid a second post-upsert SELECT.
      const existing = (database.prepare(`
        SELECT id, strength FROM causal_edges
        WHERE source_id = ? AND target_id = ? AND relation = ?
      `) as Database.Statement).get(sourceId, targetId, relation) as { id: number; strength: number } | undefined;

codex
I’ve got the key Engram hygiene primitives in hand now. I’m pulling one more comparison layer from our side: the save-quality gate, memory health auto-repair surface, and causal-edge invariants, because those are where the strongest “don’t copy this literally” and “here’s the actually useful import” conclusions will come from.
exec
/bin/zsh -lc "sed -n '430,610p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '226,330p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      data: {
        status,
        reportMode,
        autoRepairRequested: true,
        needsConfirmation: true,
        actions: repairActions,
        embeddingRetry,
      },
      hints: [
        'Re-run memory_health with autoRepair:true and confirmed:true to execute repair actions.',
      ],
      startTime,
    });
  }

  if (!isEmbeddingModelReady()) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }
  // FTS5 consistency check
  if (database) {
    try {
      const memoryCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_index').get() as { count: number };
      const ftsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
      if (memoryCountRow.count !== ftsCountRow.count) {
        hints.push(
          `FTS5 index out of sync: memory_index has ${memoryCountRow.count} rows, memory_fts has ${ftsCountRow.count} rows. ` +
          `Run memory_index_scan with force:true to rebuild FTS5 index.`
        );

        if (autoRepair) {
          try {
            database.exec("INSERT INTO memory_fts(memory_fts) VALUES('rebuild')");
            repair.actions.push('fts_rebuild');

            triggerMatcher.refreshTriggerCache();
            repair.actions.push('trigger_cache_refresh');

            const repairedFtsCountRow = database.prepare('SELECT COUNT(*) as count FROM memory_fts').get() as { count: number };
            if (memoryCountRow.count === repairedFtsCountRow.count) {
              trackRepairOutcome(true);
              repair.actions.push('fts_consistency_verified');
              hints.push('Auto-repair completed: FTS5 index rebuilt and trigger cache refreshed.');
            } else {
              trackRepairOutcome(false);
              const warning = `Post-repair mismatch persists: memory_index=${memoryCountRow.count}, memory_fts=${repairedFtsCountRow.count}`;
              repair.warnings.push(warning);
              hints.push(`Auto-repair attempted, but mismatch remains (${warning}).`);
            }
          } catch (repairError: unknown) {
            const message = toErrorMessage(repairError);
            trackRepairOutcome(false);
            repair.errors.push(sanitizeErrorForHint(message));
            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
          }
        }
      }
    } catch (e: unknown) {
      const message = toErrorMessage(e);
      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
      if (autoRepair) {
        trackRepairOutcome(false);
        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
      }
    }
  }
  // cleanupOrphanedEdges was exported but
  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
  // (referencing deleted memories) are cleaned up during health checks.
  if (autoRepair && database) {
    try {
      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
      causalEdges.init(database);
      const orphanResult = causalEdges.cleanupOrphanedEdges();
      if (orphanResult.deleted > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_edges_cleaned:${orphanResult.deleted}`);
        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
      }
    } catch (orphanError: unknown) {
      trackRepairOutcome(false);
      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
    }
  }

  if (autoRepair && database) {
    try {
      const integrityReport = vectorIndex.verifyIntegrity({ autoClean: true });
      const cleanedVectors = integrityReport.cleaned?.vectors ?? 0;
      const cleanedChunks = integrityReport.cleaned?.chunks ?? 0;

      if (cleanedVectors > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_vectors_cleaned:${cleanedVectors}`);
        hints.push(`Auto-repair: removed ${cleanedVectors} orphaned vector(s)`);
      }

      if (cleanedChunks > 0) {
        trackRepairOutcome(true);
        repair.actions.push(`orphan_chunks_cleaned:${cleanedChunks}`);
        hints.push(`Auto-repair: removed ${cleanedChunks} orphaned chunk(s)`);
      }

      const postRepairReport = vectorIndex.verifyIntegrity({ autoClean: false });
      if (
        postRepairReport.orphanedVectors > 0 ||
        postRepairReport.missingVectors > 0 ||
        postRepairReport.orphanedFiles.length > 0 ||
        postRepairReport.orphanedChunks > 0
      ) {
        repair.warnings.push(
          `Post-repair integrity still degraded: orphanedVectors=${postRepairReport.orphanedVectors}, ` +
          `missingVectors=${postRepairReport.missingVectors}, orphanedFiles=${postRepairReport.orphanedFiles.length}, ` +
          `orphanedChunks=${postRepairReport.orphanedChunks}`
        );
      }
    } catch (integrityError: unknown) {
      trackRepairOutcome(false);
      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
    }
  }

  if (repair.attempted) {
    repair.repaired = failedRepairCount === 0 && successfulRepairCount > 0;
    repair.partialSuccess = failedRepairCount > 0 && successfulRepairCount > 0;
  }

  if (aliasConflicts.groups > 0) {
    hints.push(`Detected ${aliasConflicts.groups} specs/.opencode alias group(s)`);
  }
  if (aliasConflicts.divergentHashGroups > 0) {
    hints.push(`${aliasConflicts.divergentHashGroups} alias group(s) have divergent content hashes`);
  }

  return createMCPSuccessResponse({
    tool: 'memory_health',
    summary,
    data: {
      status,
      embeddingModelReady: isEmbeddingModelReady(),
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      memoryCount,
      uptime: process.uptime(),
      version: SERVER_VERSION,
      reportMode: 'full',
      aliasConflicts,
      repair,
      embeddingProvider: {
        provider: providerName,
        model: providerModel,
        dimension: providerDimension,
        healthy: providerMetadata.healthy !== false,
        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
      },
      embeddingRetry,
    },
    hints,
    startTime,
  });
}

/* ───────────────────────────────────────────────────────────────
   EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryHealth };

 succeeded in 0ms:
        deletedCount++;
        deletedIds.push(memory.id);

        // Clean up causal edges
        // F-27 — Propagate edge-cleanup errors to fail the transaction.
        // Previously errors were caught and logged, leaving orphan causal edges
        // When memory rows were successfully deleted but edge cleanup failed.
        causalEdges.deleteEdgesForMemory(String(memory.id));
      }
    }
  });

  bulkDeleteTx();

  // Record in mutation ledger (single entry for bulk operation)
  const ledgerRecorded = appendMutationLedgerSafe(database, {
    mutationType: 'delete',
    reason: `memory_bulk_delete: deleted ${deletedCount} memories with tier="${tier}"`,
    priorHash: null,
    newHash: mutationLedger.computeHash(`bulk-delete-tier:${tier}:${deletedCount}:${Date.now()}`),
    linkedMemoryIds: deletedIds.slice(0, 50), // Cap at 50 to avoid bloating ledger
    decisionMeta: {
      tool: 'memory_bulk_delete',
      tier,
      specFolder: specFolder || null,
      olderThanDays: olderThanDays || null,
      totalDeleted: deletedCount,
      checkpoint: checkpointName,
      skipCheckpoint,
    },
    actor: 'mcp:memory_bulk_delete',
  });

  // Invalidate caches
  let postMutationFeedback: ReturnType<typeof buildMutationHookFeedback> | null = null;
  if (deletedCount > 0) {
    let postMutationHooks: import('./mutation-hooks.js').MutationHookResult;
    try {
      postMutationHooks = runPostMutationHooks('bulk-delete', { specFolder, tier, deletedCount });
    } catch (hookError: unknown) {
      const msg = hookError instanceof Error ? hookError.message : String(hookError);
      postMutationHooks = {
        latencyMs: 0, triggerCacheCleared: false,
        constitutionalCacheCleared: false, toolCacheInvalidated: 0,
        graphSignalsCacheCleared: false, coactivationCacheCleared: false,
        errors: [msg],
      };
    }
    postMutationFeedback = buildMutationHookFeedback('bulk-delete', postMutationHooks);
  }

  const summary = `Deleted ${deletedCount} "${tier}" memory(s)${specFolder ? ` from "${specFolder}"` : ''}${olderThanDays ? ` older than ${olderThanDays} days` : ''}`;

  const hints: string[] = [];
  if (checkpointName) {
    hints.push(`Restore with: checkpoint_restore({ name: "${checkpointName}" })`);
  } else if (skipCheckpoint) {
    hints.push('Checkpoint skipped: restore is not available for this operation');
  }
  if (postMutationFeedback) {
    hints.push(...postMutationFeedback.hints);
  }
  if (!ledgerRecorded) {
    hints.push('Mutation ledger append failed; audit trail may be incomplete.');
  }
  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);

  const data: Record<string, unknown> = {
    deleted: deletedCount,
    tier,
    specFolder: specFolder || null,
    olderThanDays: olderThanDays || null,
    skipCheckpoint,
  };
  if (checkpointName) {
    data.checkpoint = checkpointName;
    data.restoreCommand = `checkpoint_restore({ name: "${checkpointName}" })`;
  }
  if (postMutationFeedback) {
    data.postMutationHooks = postMutationFeedback.data;
  }
  if (!ledgerRecorded) {
    data.warning = 'Mutation ledger append failed; audit trail may be incomplete.';
  }

  return createMCPSuccessResponse({
    tool: 'memory_bulk_delete',
    summary,
    data,
    hints,
  });
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
──────────────────────────────────────────────────────────────── */

export { handleMemoryBulkDelete };

exec
/bin/zsh -lc "sed -n '36,120p' .opencode/skill/system-spec-kit/mcp_server/scripts/memory/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/scripts/memory/README.md: No such file or directory

exec
/bin/zsh -lc "sed -n '540,680p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

/** Extract trigger phrases from ## Trigger Phrases section OR YAML frontmatter */
export function extractTriggerPhrases(content: string): string[] {
  const triggers: string[] = [];
  const frontmatter = extractFrontmatterBlock(content) ?? '';

  // Method 1a: Check YAML frontmatter inline format
  const inlineMatch = frontmatter.match(/(?:triggerPhrases|trigger_phrases):\s*\[([^\]]+)\]/i);
  if (inlineMatch) {
    const arrayContent = inlineMatch[1];
    const phrases = arrayContent.match(/["']([^"']+)["']/g);
    if (phrases) {
      phrases.forEach((p: string) => {
        const cleaned = p.replace(/^["']|["']$/g, '').trim();
        if (cleaned.length > 0 && cleaned.length < 100) {
          triggers.push(cleaned);
        }
      });
    }
  }

  // Method 1b: Check YAML frontmatter multi-line format
  if (triggers.length === 0) {
    const lines = frontmatter.split('\n');
    let inTriggerBlock = false;

    for (const line of lines) {
      if (/^\s*(?:triggerPhrases|trigger_phrases):\s*$/i.test(line)) {
        inTriggerBlock = true;
        continue;
      }

      if (inTriggerBlock) {
        if (/^---\s*$/.test(line)) {
          break;
        }
        const itemMatch = line.match(/^\s*-\s*["']?([^"'\n#]+?)["']?\s*(?:#.*)?$/);
        if (itemMatch) {
          const phrase = itemMatch[1].trim();
          if (phrase.length > 0 && phrase.length < 100 && !/^-+$/.test(phrase) && !triggers.includes(phrase)) {
            triggers.push(phrase);
          }
        } else if (!/^\s*$/.test(line) && !/^\s*#/.test(line) && !/^\s+-/.test(line)) {
          break;
        }
      }
    }
  }

  // Method 2: Find ## Trigger Phrases section (fallback/additional)
  const sectionMatch = content.match(/##\s*Trigger\s*Phrases?\s*\n([\s\S]*?)(?=\n##|\n---|\n\n\n|$)/i);

  if (sectionMatch) {
    const sectionContent = sectionMatch[1];
    const bullets = sectionContent.match(/^[\s]*[-*]\s+(.+)$/gm);

    if (bullets) {
      bullets.forEach((line: string) => {
        const phrase = line.replace(/^[\s]*[-*]\s+/, '').trim();
        if (phrase.length > 0 && phrase.length < 100 && !triggers.includes(phrase)) {
          triggers.push(phrase);
        }
      });
    }
  }

  return triggers;
}

/** Extract context type from metadata block */
export function extractContextType(content: string): ContextType {
  // Look for > Session type: or > Context type:
  const match = content.match(/>\s*(?:Session|Context)\s*type:\s*(\w+)/i);

  if (match) {
    const type = match[1].toLowerCase();
    return CONTEXT_TYPE_MAP[type] || 'general';
  }

  // Check YAML metadata block
  const frontmatter = extractFrontmatterBlock(content);
  const yamlMatch = frontmatter?.match(/(?:contextType|context_type):\s*["']?(\w+)["']?/i);
  if (yamlMatch) {
    return CONTEXT_TYPE_MAP[yamlMatch[1].toLowerCase()] || 'general';
  }

  return 'general';
}

/** Extract importance tier from content or metadata */
export function extractImportanceTier(content: string, options: ExtractImportanceTierOptions = {}): string {
  const { documentType = null, fallbackTier = null } = options;

  // Strip HTML comments to avoid matching instructional examples
  // (e.g., template comments containing "importanceTier: 'constitutional'" as documentation)
  const contentWithoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
  const frontmatter = extractFrontmatterBlock(contentWithoutComments);

  // Check YAML metadata block (only in non-comment content)
  const yamlMatch = frontmatter?.match(/(?:importance_tier|importanceTier):\s*["']?(\w+)["']?/i);
  if (yamlMatch) {
    const tier = yamlMatch[1].toLowerCase();
    if (isValidTier(tier)) {
      return normalizeTier(tier);
    }
  }

  // Check for tier markers in content (only in non-comment content)
  if (contentWithoutComments.includes('[CONSTITUTIONAL]') || contentWithoutComments.includes('importance: constitutional')) {
    return 'constitutional';
  }
  if (contentWithoutComments.includes('[CRITICAL]') || contentWithoutComments.includes('importance: critical')) {
    return 'critical';
  }
  if (contentWithoutComments.includes('[IMPORTANT]') || contentWithoutComments.includes('importance: important')) {
    return 'important';
  }

  if (fallbackTier && isValidTier(fallbackTier)) {
    return normalizeTier(fallbackTier);
  }

  if (documentType) {
    return getDefaultTierForDocumentType(documentType);
  }

  return 'normal';
}

/** Compute SHA-256 hash of content for change detection */
export function computeContentHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Extract causal_links from memory content YAML metadata block (T126)
 */
export function extractCausalLinks(content: string): CausalLinks {
  const causalLinks: CausalLinks = {
    caused_by: [],
    supersedes: [],

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/extractors/input-normalizer.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/scripts/extractors/input-normalizer.ts: No such file or directory

exec
/bin/zsh -lc "rg -n \"sanitize trigger|trigger sanit|PSR-2|over-broad|short folder-like|numeric prefix|filterTriggerPhrases|trigger phrase omission\" .opencode/skill/system-spec-kit -g '*.ts' -g '*.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:311:  it('S1-H-05: strips numeric prefix without section numbering', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:315:  it('S1-H-06: handles heading without numeric prefix', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:396:  it('S1-E-09: strips heading hashes and numeric prefixes', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts:165: * The numeric prefix (e.g. "3.") is also stripped because section
.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:607:          // Also allow the display name without numeric prefix (e.g., "memory-save-quality-pipeline")
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:1000:  it('strips numeric prefix and slugifies', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:1004:  it('handles no numeric prefix', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:1055:    // Create a folder without numeric prefix
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:1075:    // F-36 upgrade-on-read: empty specId should stay empty (no numeric prefix on folder name)
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:612: * Slugify a spec folder name: strip numeric prefix, replace non-alphanumeric
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:662:  // Extract numeric prefix (e.g. "010" from "009-spec-descriptions")
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:37:  | 'PSR-2'
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:671:          checkId: 'PSR-2',
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:685:          checkId: 'PSR-2',
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:138:function filterTriggerPhrases(
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1344:    preExtractedTriggers = filterTriggerPhrases(mergedTriggers, manualTriggerKeys);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:2182:  filterTriggerPhrases,
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:103:      { input: 'abc-def', reason: 'non-numeric prefix' },
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:218:      { input: 'abc-def', reason: 'non-numeric prefix' },
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:2:// TEST: filterTriggerPhrases — 3-stage trigger phrase filter pipeline
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:7:import { filterTriggerPhrases } from '../core/workflow';
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:13:describe('filterTriggerPhrases', () => {
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:18:      const result = filterTriggerPhrases(['system/spec-kit', 'memory pipeline']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:23:      const result = filterTriggerPhrases(['system\\spec-kit', 'memory pipeline']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:27:    it('removes phrases with leading numeric prefix', () => {
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:28:      const result = filterTriggerPhrases(['022 hybrid rag fusion', 'memory pipeline']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:34:      const result = filterTriggerPhrases(
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:43:      const result = filterTriggerPhrases(
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:52:      const result = filterTriggerPhrases(input);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:64:      const result = filterTriggerPhrases(['a', 'memory pipeline']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:69:      const result = filterTriggerPhrases(['of', 'to', 'memory pipeline']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:75:      const result = filterTriggerPhrases(allowListed);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:81:      const result = filterTriggerPhrases(input);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:86:      const result = filterTriggerPhrases(['of to by']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:98:      const result = filterTriggerPhrases(['memory', 'memory pipeline architecture']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:104:      const result = filterTriggerPhrases(input);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:109:      const result = filterTriggerPhrases(['Memory', 'memory pipeline']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:122:      const result = filterTriggerPhrases(input);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:131:      const result = filterTriggerPhrases(['a/b', 'of']);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:136:      const result = filterTriggerPhrases([]);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:142:      const first = filterTriggerPhrases(input);
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-filter.vitest.ts:143:      const second = filterTriggerPhrases(first);

exec
/bin/zsh -lc 'rg -n "cleanupOrphanedEdges|deleteEdgesForMemory|orphan" .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
599:function deleteEdgesForMemory(memoryId: string): number {
663:// Automated orphan edge cleanup
664:function cleanupOrphanedEdges(): { deleted: number } {
667:    const orphaned = findOrphanedEdges();
670:      for (const edge of orphaned) {
678:    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
900:  deleteEdgesForMemory,
903:  cleanupOrphanedEdges,

exec
/bin/zsh -lc 'rg -n "duplicate_count|revision_count|last_seen_at|topic_key" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:256:				mcp.WithString("topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:294:				mcp.WithString("topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:305:			mcp.NewTool("mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:688:		topicKey, _ := req.GetArguments()["topic_key"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:748:			msg += fmt.Sprintf("\nSuggested topic_key: %s", suggestedTopicKey)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:770:			return mcp.NewToolResultError("provide title or content to suggest a topic_key"), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:775:			return mcp.NewToolResultError("could not suggest topic_key from input"), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:778:		return mcp.NewToolResultText(fmt.Sprintf("Suggested topic_key: %s", topicKey)), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:805:		if v, ok := req.GetArguments()["topic_key"].(string); ok {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:48:	TopicKey       *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:49:	RevisionCount  int     `json:"revision_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:50:	DuplicateCount int     `json:"duplicate_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:51:	LastSeenAt     *string `json:"last_seen_at,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:87:	TopicKey       *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:88:	RevisionCount  int     `json:"revision_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:89:	DuplicateCount int     `json:"duplicate_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:90:	LastSeenAt     *string `json:"last_seen_at,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:120:	TopicKey  string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:129:	TopicKey *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:217:	TopicKey   *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:460:			topic_key  TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:462:			revision_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:464:			last_seen_at TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:482:			topic_key,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:550:		{name: "topic_key", definition: "TEXT"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:552:		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:554:		{name: "last_seen_at", definition: "TEXT"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:575:		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:610:	if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:613:	if _, err := s.execHook(s.db, `UPDATE observations SET revision_count = 1 WHERE revision_count IS NULL OR revision_count < 1`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:616:	if _, err := s.execHook(s.db, `UPDATE observations SET duplicate_count = 1 WHERE duplicate_count IS NULL OR duplicate_count < 1`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:645:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:646:				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:650:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:651:				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:655:				INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:656:				VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:657:				INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:658:				VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:705:	err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:721:			topic_key,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:725:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:726:		SELECT id, title, content, tool_name, type, project, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:731:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:732:			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:736:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:737:			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:741:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:742:			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:743:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:744:			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:747:		return fmt.Errorf("migrate fts topic_key: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:908:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:937:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:970:				 WHERE topic_key = ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:985:					     topic_key = ?,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:987:					     revision_count = revision_count + 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:988:					     last_seen_at = datetime('now'),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1031:				 SET duplicate_count = duplicate_count + 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1032:				     last_seen_at = datetime('now'),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1086:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1284:			     topic_key = ?,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1286:			     revision_count = revision_count + 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1384:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1418:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1478:			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1480:			WHERE topic_key = ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1523:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3065:			topic_key  TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3067:			revision_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3069:			last_seen_at TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3083:			last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3099:			NULLIF(topic_key, ''),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3101:			CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3103:			last_seen_at,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3132:			topic_key,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3137:		SELECT id, title, content, tool_name, type, project, topic_key

exec
/bin/zsh -lc "sed -n '138,240p' .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '640,710p' .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
function filterTriggerPhrases(
  phrases: string[],
  manualPhraseKeys: Set<string> = new Set(),
): string[] {
  // Stage 1: Remove entries containing path separators (forward/backslash, multi-word path segments)
  let filtered = phrases.filter(p => {
    const trimmed = p.trim();
    const comparisonKey = normalizeWorkflowTriggerKey(trimmed);
    if (trimmed.includes('/') || trimmed.includes('\\')) return false;
    if (manualPhraseKeys.has(comparisonKey)) {
      return true;
    }
    if (/^\d{1,3}\s/.test(trimmed)) {
      return false;
    }
    return true;
  });

  // Stage 2: Remove entries where every word is under 3 characters (unless in allow-list)
  filtered = filtered.filter(p => {
    const comparisonKey = normalizeWorkflowTriggerKey(p);
    if (manualPhraseKeys.has(comparisonKey)) {
      return true;
    }
    const words = p.trim().split(/\s+/);
    if (words.length === 1 && words[0].length < 3 && !TRIGGER_ALLOW_LIST.has(words[0].toLowerCase())) {
      return false;
    }
    // Multi-word: keep if at least one word >= 3 chars or any word is in allow-list
    if (words.every(w => w.length < 3) && !words.some(w => TRIGGER_ALLOW_LIST.has(w.toLowerCase()))) {
      return false;
    }
    return true;
  });

  // Stage 3: Remove n-gram shingle phrases that are substrings of longer retained phrases
  const lowerPhrases = filtered.map((p) => p.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim());
  filtered = filtered.filter((p, idx) => {
    const lower = lowerPhrases[idx];
    if (manualPhraseKeys.has(lower)) {
      return true;
    }
    if (isAllowlistedShortProductName(p)) {
      return true;
    }
    // Check if this phrase is a substring of any other (longer) phrase
    for (let j = 0; j < lowerPhrases.length; j++) {
      if (j !== idx && (
        (lowerPhrases[j] === lower && j < idx)
        || (lowerPhrases[j].length > lower.length && lowerPhrases[j].includes(lower))
      )) {
        return false;
      }
    }
    return true;
  });

  return filtered;
}

/**
 * Insert content after YAML frontmatter, preserving frontmatter at byte 0.
 * Frontmatter is a block delimited by `---\n` at position 0 and a closing `---\n`.
 * If no frontmatter is found, prepends the content (original behavior).
 */
function insertAfterFrontmatter(content: string, insertion: string): string {
  if (!content.startsWith('---')) {
    return insertion + content;
  }
  // Find the closing --- (skip the opening ---)
  const closingIdx = content.indexOf('\n---', 3);
  if (closingIdx === -1) {
    return insertion + content;
  }
  // Find the end of the closing --- line
  const afterClosing = content.indexOf('\n', closingIdx + 4);
  const insertionPoint = afterClosing === -1 ? content.length : afterClosing + 1;
  return content.slice(0, insertionPoint) + insertion + content.slice(insertionPoint);
}

type WorkflowRetryStats = {
  queue_size: number;
};

type WorkflowRetryBatchResult = {
  processed: number;
  succeeded: number;
  failed: number;
};

interface WorkflowRetryManagerAdapter {
  getRetryStats(): WorkflowRetryStats;
  processRetryQueue(limit?: number): Promise<WorkflowRetryBatchResult>;
}

const FALLBACK_RETRY_MANAGER: WorkflowRetryManagerAdapter = {
  getRetryStats: () => ({ queue_size: 0 }),
  processRetryQueue: async () => ({ processed: 0, succeeded: 0, failed: 0 }),
};

/**
 * Shared helper for dynamic MCP-server API imports with consistent degradation.
 * All call sites log warnings on failure and return the provided fallback.

 succeeded in 0ms:
    const payloadDecisions = Array.isArray(collectedData.keyDecisions) && collectedData.keyDecisions.length > 0
      ? collectedData.keyDecisions
      : Array.isArray(collectedData._manualDecisions)
        ? collectedData._manualDecisions
        : [];
    const explicitTier = normalizeScalarValue(collectedData.importanceTier || collectedData.importance_tier);
    const explicitContextType = normalizeScalarValue(collectedData.contextType || collectedData.context_type);
    const savedDescription = normalizeScalarValue(frontmatter.description);
    const continuationPattern = detectContinuationPattern(savedTitle) || detectContinuationPattern(savedDescription);
    const manualTriggerKeys = buildManualTriggerKeySet(collectedData._manualTriggerPhrases);
    const d3Counts = buildD3CountsWithSource(savedTriggers, manualTriggerKeys);
    const provenanceExpected = collectedData.provenanceExpected === true;

    // Baseline checks.
    if (payloadSummary.length > 15 && isGenericTitle(savedTitle)) {
      issues.push({
        checkId: 'PSR-1',
        severity: 'HIGH',
        field: 'title',
        message: `"${savedTitle}" — should reflect sessionSummary`,
        fix: `Edit frontmatter title to: "${payloadSummary.substring(0, 80)}"`,
      });
    }

    if (Array.isArray(collectedData._manualTriggerPhrases) && collectedData._manualTriggerPhrases.length > 0) {
      const pathFragments = savedTriggers.filter((phrase) => (
        !manualTriggerKeys.has(phrase.trim().toLowerCase())
        && sanitizeTriggerPhrase(phrase).reason === 'path_fragment'
      ));
      if (pathFragments.length > 0) {
        issues.push({
          checkId: 'PSR-2',
          severity: 'HIGH',
          field: 'trigger_phrases',
          message: `contains path fragments ${JSON.stringify(pathFragments)}`,
          fix: `Replace with: ${JSON.stringify(collectedData._manualTriggerPhrases.slice(0, 5))}`,
        });
      }

      const savedLower = new Set(savedTriggers.map((entry) => entry.toLowerCase()));
      const missingPhrases = collectedData._manualTriggerPhrases.filter(
        (phrase) => !savedLower.has(phrase.toLowerCase()),
      );
      if (missingPhrases.length > 0 && pathFragments.length === 0) {
        issues.push({
          checkId: 'PSR-2',
          severity: 'MEDIUM',
          field: 'trigger_phrases',
          message: `missing manual phrases: ${JSON.stringify(missingPhrases.slice(0, 3))}`,
          fix: `Add to trigger_phrases: ${JSON.stringify(missingPhrases.slice(0, 5))}`,
        });
      }
    }

    if (explicitTier && savedTier && savedTier !== explicitTier) {
      issues.push({
        checkId: 'PSR-3',
        severity: 'MEDIUM',
        field: 'importance_tier',
        message: `"${savedTier}" — payload specified "${explicitTier}"`,
        fix: `Change to "${explicitTier}" in frontmatter`,
      });
    }

    if (payloadDecisions.length > 0) {
      const savedDecisionCount = parseInt(
        frontmatter.decision_count || memoryMetadata.decision_count || '0',
        10,
      );
      if (savedDecisionCount === 0) {
        issues.push({

exec
/bin/zsh -lc "sed -n '599,690p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
function deleteEdgesForMemory(memoryId: string): number {
  if (!db) return 0;

  const result = (db.prepare(`
    DELETE FROM causal_edges
    WHERE source_id = ? OR target_id = ?
  `) as Database.Statement).run(memoryId, memoryId);
  if ((result as { changes: number }).changes > 0) {
    invalidateDegreeCache();
  }
  return (result as { changes: number }).changes;
}

/* ───────────────────────────────────────────────────────────────
   8. STATS & QUERIES
----------------------------------------------------------------*/

function getGraphStats(): GraphStats {
  if (!db) {
    return { totalEdges: 0, byRelation: {}, avgStrength: 0, uniqueSources: 0, uniqueTargets: 0 };
  }

  try {
    const total = (db.prepare('SELECT COUNT(*) as count FROM causal_edges') as Database.Statement).get() as { count: number };
    const byRelation = (db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation') as Database.Statement).all() as Array<{ relation: string; count: number }>;
    const avgStrength = (db.prepare('SELECT AVG(strength) as avg FROM causal_edges') as Database.Statement).get() as { avg: number | null };
    const sources = (db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
    const targets = (db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };

    const relationMap: Record<string, number> = {};
    for (const row of byRelation) {
      relationMap[row.relation] = row.count;
    }

    return {
      totalEdges: total.count,
      byRelation: relationMap,
      avgStrength: Math.round((avgStrength.avg || 0) * 100) / 100,
      uniqueSources: sources.count,
      uniqueTargets: targets.count,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] getGraphStats error: ${msg}`);
    return { totalEdges: 0, byRelation: {}, avgStrength: 0, uniqueSources: 0, uniqueTargets: 0 };
  }
}

function findOrphanedEdges(): CausalEdge[] {
  if (!db) return [];

  try {
    return (db.prepare(`
      SELECT ce.* FROM causal_edges ce
      WHERE NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.source_id)
        OR NOT EXISTS (SELECT 1 FROM memory_index m WHERE CAST(m.id AS TEXT) = ce.target_id)
    `) as Database.Statement).all() as CausalEdge[];
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] findOrphanedEdges error: ${msg}`);
    return [];
  }
}

// Automated orphan edge cleanup
function cleanupOrphanedEdges(): { deleted: number } {
  if (!db) return { deleted: 0 };
  try {
    const orphaned = findOrphanedEdges();
    const deleted = runInTransaction(db, () => {
      let count = 0;
      for (const edge of orphaned) {
        if (deleteEdge(edge.id)) count++;
      }
      return count;
    });
    return { deleted };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
    return { deleted: 0 };
  }
}

/* ───────────────────────────────────────────────────────────────
   9. SPEC DOCUMENT CHAINS (Spec 126)
----------------------------------------------------------------*/

/**
 * Create causal relationship chain between spec folder documents.
 * Links: spec -> plan (CAUSED), plan -> tasks (CAUSED), tasks -> impl-summary (CAUSED)
 * Also: checklist SUPPORTS spec, decision-record SUPPORTS plan, research SUPPORTS spec

exec
/bin/zsh -lc "sed -n '664,705p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
function cleanupOrphanedEdges(): { deleted: number } {
  if (!db) return { deleted: 0 };
  try {
    const orphaned = findOrphanedEdges();
    const deleted = runInTransaction(db, () => {
      let count = 0;
      for (const edge of orphaned) {
        if (deleteEdge(edge.id)) count++;
      }
      return count;
    });
    return { deleted };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
    return { deleted: 0 };
  }
}

/* ───────────────────────────────────────────────────────────────
   9. SPEC DOCUMENT CHAINS (Spec 126)
----------------------------------------------------------------*/

/**
 * Create causal relationship chain between spec folder documents.
 * Links: spec -> plan (CAUSED), plan -> tasks (CAUSED), tasks -> impl-summary (CAUSED)
 * Also: checklist SUPPORTS spec, decision-record SUPPORTS plan, research SUPPORTS spec
 *
 * @param documentIds Map of document_type -> memory_index.id for documents in the same spec folder
 */
function createSpecDocumentChain(documentIds: Record<string, number>): { inserted: number; failed: number } {
  if (!db) return { inserted: 0, failed: 0 };

  const edges: Array<{
    sourceId: string;
    targetId: string;
    relation: RelationType;
    strength?: number;
    evidence?: string | null;
  }> = [];

  const ids = documentIds;

exec
/bin/zsh -lc "sed -n '240,340p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  }

  return null;
}

export function checkContentHashDedup(
  database: Database.Database,
  parsed: ParsedMemory,
  force: boolean,
  warnings: string[] | undefined,
  samePathExclusion?: SamePathDedupExclusion,
  scope: MemoryScopeMatch = {},
): IndexResult | null {
  if (!force) {
    const { clauses: scopeClauses, params: scopeParams } = buildScopedWhereClauses(scope);
    const whereClauses = [
      'spec_folder = ?',
      'content_hash = ?',
      'parent_id IS NULL',
      'embedding_status IN (?, ?)',
      ...scopeClauses,
    ];
    const duplicateParams: Array<string> = [
      parsed.specFolder,
      parsed.contentHash,
      ...DEDUP_ELIGIBLE_EMBEDDING_STATUSES,
      ...scopeParams,
    ];

    if (samePathExclusion) {
      whereClauses.push('file_path != ?');
      duplicateParams.push(samePathExclusion.filePath);
      whereClauses.push('(canonical_file_path IS NULL OR canonical_file_path != ?)');
      duplicateParams.push(samePathExclusion.canonicalFilePath);
    }

    const duplicateByHash = database.prepare(`
      SELECT id, file_path, title, content_text
      FROM memory_index
      WHERE ${whereClauses.join('\n        AND ')}
      ORDER BY id DESC
      LIMIT 1
    `).get(...duplicateParams) as DuplicateLookupRow | undefined;

    if (duplicateByHash) {
      const verifiedMatch = verifyStoredContentMatch(
        duplicateByHash.content_text,
        duplicateByHash.file_path,
        parsed.content,
      );
      if (verifiedMatch === false) {
        console.warn(`[memory-save] Hash match for memory #${duplicateByHash.id} failed secondary content verification; continuing save`);
        return null;
      }
      console.error(`[memory-save] T054: Duplicate content detected (hash match id=${duplicateByHash.id}), skipping embedding`);
      return {
        status: 'duplicate',
        id: duplicateByHash.id,
        specFolder: parsed.specFolder,
        title: parsed.title ?? duplicateByHash.title ?? '',
        triggerPhrases: parsed.triggerPhrases,
        contextType: parsed.contextType,
        importanceTier: parsed.importanceTier,
        warnings,
        message: `Duplicate content detected: identical to existing memory #${duplicateByHash.id} (${duplicateByHash.file_path}). Skipping embedding generation.`,
      };
    }
  }

  return null;
}

exec
/bin/zsh -lc "sed -n '450,540p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    return existing;
  }

  return existing + '\n\n<!-- Merged content -->\n' + newLines.join('\n');
}

// ───────────────────────────────────────────────────────────────
// 7. CONFLICT OPERATION

// ───────────────────────────────────────────────────────────────
/**
 * Resolve a conflict between highly similar memories (similarity 0.75-0.88).
 *
 * Preferred path (when caller provides a distinct new memory ID):
 * - Mark existing memory as deprecated (superseded)
 * - Create a 'supersedes' causal edge from new -> existing
 *
 * Legacy fallback (when no new ID is available):
 * - Update existing memory content/title in-place
 * - Skip edge creation (avoids self-referential edges)
 *
 * @param existingMemory - The existing memory being superseded
 * @param newMemory - The new memory replacing it
 * @param db - The database instance
 * @returns ConflictResult with supersede details
 */
export function executeConflict(
  existingMemory: SimilarMemory,
  newMemory: NewMemoryData,
  db: Database.Database
): ConflictResult {
  try {
    // Add causal 'supersedes' edge only when caller provides a distinct new ID.
    // Prevent self-referential supersedes edges (source == target).
    let edgeId: number | null = null;
    const hasDistinctNewId =
      typeof newMemory.id === 'number' &&
      Number.isFinite(newMemory.id) &&
      newMemory.id !== existingMemory.id;

    if (hasDistinctNewId) {
      // Atomic transaction: deprecate + edge must succeed or fail together.
      // Without this, a failed insertEdge leaves an orphaned deprecation.
      db.transaction(() => {
        const updateResult = db.prepare(`
          UPDATE memory_index
          SET importance_tier = 'deprecated',
              updated_at = datetime('now')
          WHERE id = ?
        `).run(existingMemory.id) as { changes: number };

        if (updateResult.changes === 0) {
          console.warn('[reconsolidation] Deprecate target not found, skipping edge insert');
          return;
        }

        const sourceId = String(newMemory.id);
        const targetId = String(existingMemory.id);
        edgeId = causalEdges.insertEdge(
          sourceId,
          targetId,
          'supersedes',
          1.0,
          `TM-06 reconsolidation conflict: similarity ${(existingMemory.similarity * 100).toFixed(1)}%`
        );
        if (edgeId == null) {
          throw new Error(
            `Failed to insert supersedes edge (${sourceId} -> ${targetId}) — aborting reconsolidation`
          );
        }
      })();
    } else {
      // Atomic transaction: content + embedding + hash update together.
      const updatedHash = createHash('sha256').update(newMemory.content, 'utf-8').digest('hex');
      db.transaction(() => {
        db.prepare(`
          UPDATE memory_index
          SET content_text = ?,
              title = ?,
              content_hash = ?,
              updated_at = datetime('now')
          WHERE id = ?
        `).run(newMemory.content, newMemory.title, updatedHash, existingMemory.id);

        if (newMemory.embedding) {
          const buffer = embeddingToBuffer(newMemory.embedding);
          db.prepare(
            'UPDATE vec_memories SET embedding = ? WHERE rowid = ?'
          ).run(buffer, existingMemory.id);
        }
      })();

exec
/bin/zsh -lc "sed -n '648,705p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '340,430p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

    case 'conflict':
      {
        let conflictMemory = newMemory;

        // F04-002: Wrap store + conflict in single transaction for atomicity
        // TM-06 live-save path: materialize memory + supersede edge together
        try {
          const conflictTx = db.transaction(() => {
            if (conflictMemory.id === undefined) {
              const storedId = storeMemory(newMemory);
              if (
                typeof storedId === 'number' &&
                Number.isFinite(storedId) &&
                storedId > 0 &&
                storedId !== topMatch.id
              ) {
                conflictMemory = { ...newMemory, id: storedId };
              }
            }
            return executeConflict(topMatch, conflictMemory, db);
          });
          return conflictTx();
        } catch (conflictErr: unknown) {
          // If storeMemory succeeded but executeConflict failed, clean up the orphan
          // Memory so we don't leave dangling rows with no supersedes edge.
          if (conflictMemory.id !== undefined && conflictMemory.id !== newMemory.id) {
            // Graph cleanup: Use delete_memory_from_database (includes deleteAncillaryMemoryRows)
            // instead of raw DELETE to clean lineage, projections, and graph residue.
            try {
              const deleted = delete_memory_from_database(db, conflictMemory.id);
              if (deleted) {
                try {
                  recordHistory(
                    conflictMemory.id!,
                    'DELETE',
                    null,
                    null,
                    'mcp:reconsolidation_cleanup',
                    conflictMemory.specFolder ?? null,
                  );
                } catch (_histErr: unknown) { /* best-effort */ }
              }
            } catch (_error: unknown) {
              // Best-effort cleanup
            }
            console.warn('[reconsolidation] cleaned up orphan memory', conflictMemory.id, 'after executeConflict failure');
          }
          throw conflictErr;
        }
      }

    case 'complement':
      // Complement is a routing decision only; caller persists once.
      return {
        action: 'complement',
        newMemoryId: newMemory.id ?? 0,
        similarity: topMatch.similarity,

 succeeded in 0ms:
        suggestion: `Rename one of the duplicate anchors to a unique ID`,
      });
      result.valid = false;
      continue;
    }
    seenIds.add(anchorId);

    // Validate anchor ID format
    if (!VALID_ANCHOR_ID_PATTERN.test(anchorId)) {
      const errorMsg = `Invalid anchor ID "${anchorId}" - must start with alphanumeric and contain only alphanumeric, hyphens, or slashes`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_ID_INVALID,
        message: errorMsg,
        anchorId,
        suggestion: `Use format like "summary", "decisions-001", or "spec-folder/section"`,
      });
      result.valid = false;
      continue;
    }

    // Check for corresponding closing tag
    const escapeRegex = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const closingPattern = new RegExp(
      `<!--\\s*/(?:ANCHOR|anchor):\\s*${escapeRegex(anchorId)}\\s*-->`,
      'i'
    );

    // Search for closing tag AFTER the opening tag
    const contentAfterOpen = content.slice(position + tag.full_match.length);
    const hasClosing = closingPattern.test(contentAfterOpen);

    if (!hasClosing) {
      const errorMsg = `Anchor "${anchorId}" is missing closing tag <!-- /ANCHOR:${anchorId} -->`;
      result.errors.push({
        code: PreflightErrorCodes.ANCHOR_UNCLOSED,
        message: errorMsg,
        anchorId,
        suggestion: `Add closing tag: <!-- /ANCHOR:${anchorId} --> after the anchor content`,
      });
      result.valid = false;
    } else {
      // Valid anchor
      result.anchors.push(anchorId);
    }
  }

  // In strict mode, throw on any validation errors
  if (strict && !result.valid) {
    const error = new PreflightError(
      PreflightErrorCodes.ANCHOR_FORMAT_INVALID,
      `Anchor validation failed: ${result.errors.length} error(s)`,
      {
        errors: result.errors,
        recoverable: true,
        suggestion: 'Fix anchor format issues and retry',
      }
    );
    throw error;
  }

  return result;
}

// ───────────────────────────────────────────────────────────────
// 5. DUPLICATE DETECTION

// ───────────────────────────────────────────────────────────────
/**
 * Provides the computeContentHash helper.
 */
export function computeContentHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Provides the checkDuplicate helper.
 */
export function checkDuplicate(params: DuplicateCheckParams, options: DuplicateCheckOptions = {}): DuplicateCheckResult {
  const {
    content,
    content_hash: provided_hash,
    spec_folder,
    database,
    find_similar,
    embedding,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
  } = params;


exec
/bin/zsh -lc "sed -n '1030,1088p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1588,1612p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		content, _ := req.GetArguments()["content"].(string)
		sessionID, _ := req.GetArguments()["session_id"].(string)
		project, _ := req.GetArguments()["project"].(string)

		// Apply default project when LLM sends empty
		if project == "" {
			project = cfg.DefaultProject
		}
		project, _ = store.NormalizeProject(project)

		if sessionID == "" {
			sessionID = defaultSessionID(project)
		}

		// Ensure the session exists
		s.CreateSession(sessionID, project, "")

		_, err := s.AddObservation(store.AddObservationParams{
			SessionID: sessionID,
			Type:      "session_summary",
			Title:     fmt.Sprintf("Session summary: %s", project),
			Content:   content,
			Project:   project,
		})
		if err != nil {
			return mcp.NewToolResultError("Failed to save session summary: " + err.Error()), nil
		}

		return mcp.NewToolResultText(fmt.Sprintf("Session summary saved for project %q", project)), nil
	}
}

func handleSessionStart(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		id, _ := req.GetArguments()["id"].(string)
		project, _ := req.GetArguments()["project"].(string)
		directory, _ := req.GetArguments()["directory"].(string)

		// Apply default project when LLM sends empty
		if project == "" {
			project = cfg.DefaultProject
		}
		project, _ = store.NormalizeProject(project)

		if err := s.CreateSession(id, project, directory); err != nil {
			return mcp.NewToolResultError("Failed to start session: " + err.Error()), nil
		}

		return mcp.NewToolResultText(fmt.Sprintf("Session %q started for project %q", id, project)), nil
	}
}

func handleSessionEnd(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		id, _ := req.GetArguments()["id"].(string)
		summary, _ := req.GetArguments()["summary"].(string)


 succeeded in 0ms:
func (s *Store) Stats() (*Stats, error) {
	stats := &Stats{}

	s.db.QueryRow("SELECT COUNT(*) FROM sessions").Scan(&stats.TotalSessions)
	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
	s.db.QueryRow("SELECT COUNT(*) FROM user_prompts").Scan(&stats.TotalPrompts)

	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
	if err != nil {
		return stats, nil
	}
	defer rows.Close()

	for rows.Next() {
		var p string
		if err := rows.Scan(&p); err == nil {
			stats.Projects = append(stats.Projects, p)
		}
	}

	return stats, nil
}

// ─── Context Formatting ─────────────────────────────────────────────────────


exec
/bin/zsh -lc "sed -n '565,625p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
	if shouldRegister("mem_capture_passive", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_capture_passive",
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Capture Learnings"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithDescription(`Extract and save structured learnings from text output. Use this at the end of a task to capture knowledge automatically.

The tool looks for sections like "## Key Learnings:" or "## Aprendizajes Clave:" and extracts numbered or bulleted items. Each item is saved as a separate observation.

Duplicates are automatically detected and skipped — safe to call multiple times with the same content.`),
				mcp.WithString("content",
					mcp.Required(),
					mcp.Description("The text output containing a '## Key Learnings:' section with numbered or bulleted items"),
				),
				mcp.WithString("session_id",
					mcp.Description("Session ID (default: manual-save-{project})"),
				),
				mcp.WithString("project",
					mcp.Description("Project name"),
				),
				mcp.WithString("source",
					mcp.Description("Source identifier (e.g. 'subagent-stop', 'session-end')"),
				),
			),
			handleCapturePassive(s, cfg),
		)
	}

	// ─── mem_merge_projects (profile: admin, deferred) ──────────────────
	if shouldRegister("mem_merge_projects", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_merge_projects",
				mcp.WithDescription("Merge memories from multiple project name variants into one canonical name. Use when you discover project name drift (e.g. 'Engram' and 'engram' should be the same project). DESTRUCTIVE — moves all records from source names to the canonical name."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Merge Projects"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(true),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("from",
					mcp.Required(),
					mcp.Description("Comma-separated list of project names to merge FROM (e.g. 'Engram,engram-memory,ENGRAM')"),
				),
				mcp.WithString("to",
					mcp.Required(),
					mcp.Description("The canonical project name to merge INTO (e.g. 'engram')"),
				),
			),
			handleMergeProjects(s),
		)
	}
}

// ─── Tool Handlers ───────────────────────────────────────────────────────────

func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {

exec
/bin/zsh -lc "sed -n '740,825p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
			TopicKey:  topicKey,
		})
		if err != nil {
			return mcp.NewToolResultError("Failed to save: " + err.Error()), nil
		}

		msg := fmt.Sprintf("Memory saved: %q (%s)", title, typ)
		if topicKey == "" && suggestedTopicKey != "" {
			msg += fmt.Sprintf("\nSuggested topic_key: %s", suggestedTopicKey)
		}
		if truncated {
			msg += fmt.Sprintf("\n⚠ WARNING: Content was truncated from %d to %d chars. Consider splitting into smaller observations.", len(content), s.MaxObservationLength())
		}
		if normWarning != "" {
			msg += "\n" + normWarning
		}
		if similarWarning != "" {
			msg += "\n" + similarWarning
		}
		return mcp.NewToolResultText(msg), nil
	}
}

func handleSuggestTopicKey() server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		typ, _ := req.GetArguments()["type"].(string)
		title, _ := req.GetArguments()["title"].(string)
		content, _ := req.GetArguments()["content"].(string)

		if strings.TrimSpace(title) == "" && strings.TrimSpace(content) == "" {
			return mcp.NewToolResultError("provide title or content to suggest a topic_key"), nil
		}

		topicKey := suggestTopicKey(typ, title, content)
		if topicKey == "" {
			return mcp.NewToolResultError("could not suggest topic_key from input"), nil
		}

		return mcp.NewToolResultText(fmt.Sprintf("Suggested topic_key: %s", topicKey)), nil
	}
}

func handleUpdate(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		id := int64(intArg(req, "id", 0))
		if id == 0 {
			return mcp.NewToolResultError("id is required"), nil
		}

		update := store.UpdateObservationParams{}
		if v, ok := req.GetArguments()["title"].(string); ok {
			update.Title = &v
		}
		if v, ok := req.GetArguments()["content"].(string); ok {
			update.Content = &v
		}
		if v, ok := req.GetArguments()["type"].(string); ok {
			update.Type = &v
		}
		if v, ok := req.GetArguments()["project"].(string); ok {
			update.Project = &v
		}
		if v, ok := req.GetArguments()["scope"].(string); ok {
			update.Scope = &v
		}
		if v, ok := req.GetArguments()["topic_key"].(string); ok {
			update.TopicKey = &v
		}

		if update.Title == nil && update.Content == nil && update.Type == nil && update.Project == nil && update.Scope == nil && update.TopicKey == nil {
			return mcp.NewToolResultError("provide at least one field to update"), nil
		}

		var contentLen int
		if update.Content != nil {
			contentLen = len(*update.Content)
		}

		obs, err := s.UpdateObservation(id, update)
		if err != nil {
			return mcp.NewToolResultError("Failed to update memory: " + err.Error()), nil
		}

		msg := fmt.Sprintf("Memory updated: #%d %q (%s, scope=%s)", obs.ID, obs.Title, obs.Type, obs.Scope)
		if contentLen > s.MaxObservationLength() {
			msg += fmt.Sprintf("\n⚠ WARNING: Content was truncated from %d to %d chars. Consider splitting into smaller observations.", contentLen, s.MaxObservationLength())

exec
/bin/zsh -lc "sed -n '118,170p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
function toNormalizedPath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function toSpecAliasKey(filePath: string): string {
  const normalizedPath = toNormalizedPath(filePath);
  return normalizedPath
    .replace(/\/\.opencode\/specs\//g, '/specs/')
    .replace(/^\.opencode\/specs\//, 'specs/');
}

function isSpecsAliasPath(filePath: string): boolean {
  const normalizedPath = toNormalizedPath(filePath);
  return (
    normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) ||
    normalizedPath.includes(SPECS_SEGMENT) ||
    normalizedPath.startsWith('.opencode/specs/') ||
    normalizedPath.startsWith('specs/')
  );
}

function isDotOpencodeVariantPath(normalizedPath: string): boolean {
  return normalizedPath.includes(DOT_OPENCODE_SPECS_SEGMENT) || normalizedPath.startsWith('.opencode/specs/');
}

function isSpecsVariantPath(normalizedPath: string): boolean {
  if (isDotOpencodeVariantPath(normalizedPath)) {
    return false;
  }
  return normalizedPath.includes(SPECS_SEGMENT) || normalizedPath.startsWith('specs/');
}

function getDivergentAliasGroups(rows: AliasConflictDbRow[], limit: number): DivergentAliasGroup[] {
  if (!rows.length) {
    return [];
  }

  const buckets = new Map<string, DivergentAliasBucket>();

  for (const row of rows) {
    if (!row || typeof row.file_path !== 'string' || row.file_path.length === 0) {
      continue;
    }

    const normalizedPath = toNormalizedPath(row.file_path);
    const aliasKey = toSpecAliasKey(normalizedPath);
    let bucket = buckets.get(aliasKey);
    if (!bucket) {
      bucket = {
        hasDotOpencodeVariant: false,
        hasSpecsVariant: false,
        variants: new Map<string, string | null>(),
        hashes: new Set<string>(),

exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) SuggestTopicKey|suggestTopicKey\\(|architecture/|bug/|decision/|pattern/|config/|discovery/|learning/|session/\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3199:// It infers a topic family (e.g. architecture/*, bug/*) and then appends
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:257:					mcp.Description("Optional topic identifier for upserts (e.g. architecture/auth-model). Reuses and updates the latest observation in same project+scope."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:704:		suggestedTopicKey := suggestTopicKey(typ, title, content)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:773:		topicKey := suggestTopicKey(typ, title, content)

exec
/bin/zsh -lc "sed -n '1,140p' .opencode/skill/system-spec-kit/scripts/memory/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '360,470p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Memory Scripts"
description: "TypeScript CLIs for memory context generation, enrichment, ranking, quality checks, and index maintenance."
trigger_phrases:
  - "memory scripts"
  - "generate context"
  - "rank memories"
  - "cleanup orphaned vectors"
---


# Memory Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT INVENTORY](#2--current-inventory)
- [3. MEMORY SAVE RULE COMMANDS](#3--memory-save-rule-commands)
- [4. MAINTENANCE COMMANDS](#4--maintenance-commands)
- [5. WORKFLOW ALIGNMENT](#5--workflow-alignment)
- [6. FRONTMATTER NORMALIZATION + REINDEX](#6--frontmatter-normalization--reindex)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

The `memory/` directory contains the CLI entrypoints for the Spec Kit memory pipeline.

This is the **canonical location** for reindex and memory operations documentation.
Other locations point here: `mcp_server/scripts/README.md`, `mcp_server/database/README.md`

<!-- /ANCHOR:overview -->
<!-- ANCHOR:current-inventory -->
## 2. CURRENT INVENTORY


- `generate-context.ts` - generate memory output from spec folder or JSON input with content-aware candidate selection
- `rank-memories.ts` - rank memory candidates by scoring rules
- `cleanup-orphaned-vectors.ts` - remove stale vector rows not linked to active memories
- `validate-memory-quality.ts` - validates post-render memory quality against scoring thresholds before indexing/reporting; includes post-save quality gates (structure, semantic sufficiency, duplicate detection), heuristic calibration, and trigger sanitization
- `reindex-embeddings.ts` - force full embedding reindex across memory/spec documents
- `ast-parser.ts` - parse markdown into heading/code/table-aware sections
- `backfill-frontmatter.ts` - bulk frontmatter normalization for templates, spec docs, and memory files
- `rebuild-auto-entities.ts` - rebuild auto-entity metadata from indexed content
- `fix-memory-h1.mjs` - One-shot migration script — fixes H1 heading format in legacy memory files

Runtime files are compiled into `../dist/memory/`.


<!-- /ANCHOR:current-inventory -->
<!-- ANCHOR:memory-save-rule-commands -->
## 3. MEMORY SAVE RULE COMMANDS


Routine JSON mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/<###-spec-name>
```

Explicit CLI targets are authoritative, including policy-defined phase folders. Direct positional saves now reject and must be replaced with structured JSON input.

JSON input mode:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json '{"sessionSummary":"...","specFolder":"..."}' specs/NNN-name
```


<!-- /ANCHOR:memory-save-rule-commands -->
<!-- ANCHOR:maintenance-commands -->
## 4. MAINTENANCE COMMANDS


```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json
node .opencode/skill/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js
node .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --apply --include-archive --report /tmp/frontmatter-apply.json
```


<!-- /ANCHOR:maintenance-commands -->
<!-- ANCHOR:workflow-alignment -->
## 5. WORKFLOW ALIGNMENT


- Uses the modular core/extractors/loaders/renderers/lib pipeline.
- Supports subfolder-aware spec path handling through core utilities.
- Produces ANCHOR-structured markdown expected by downstream validation and indexing.
- Enforces the shared rendered-memory contract before successful write/index so malformed anchors, ids, frontmatter, or cleanup artifacts do not persist as active memories.
- Uses content-aware candidate selection so task/session evidence beats generic folder fallback when valid.
- Derives `MEMORY_TITLE` from the content slug via `slugToTitle(contentSlug)` and writes it into the H1 heading. A blank line separates the frontmatter close `---` from the `# H1`.
- Writes `MEMORY_DASHBOARD_TITLE` into context template frontmatter so dashboard titles stay disambiguated.
- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.
- Retroactive title refresh for existing memories: run `memory_index_scan({ force: true })` after parser/template updates.
<!-- /ANCHOR:workflow-alignment -->

<!-- ANCHOR:frontmatter-normalization-reindex -->
## 6. FRONTMATTER NORMALIZATION + REINDEX

Use the backfill CLI to normalize indexed markdown metadata across templates, spec docs, and memory files.

Managed keys:
- `title`
- `description`
- `trigger_phrases`
- `importance_tier`
- `contextType` (parser also accepts `context_type` alias)

Typical migration workflow:

```bash
# Dry-run first (strict mode by default: malformed frontmatter fails)
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --include-archive --report /tmp/frontmatter-dry-run.json

# Apply once dry-run output is clean
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --apply --include-archive --report /tmp/frontmatter-apply.json

# Reindex embeddings so dashboard/search reflects updated metadata
node .opencode/skill/system-spec-kit/scripts/dist/memory/reindex-embeddings.js

To target specific roots, pass `--roots`:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js \
  --dry-run --roots ./.opencode/specs,./specs --report /tmp/frontmatter-targeted.json
```

If you need compatibility mode during staged cleanup, use `--allow-malformed` to keep processing without non-zero exit on malformed frontmatter files.
<!-- /ANCHOR:frontmatter-normalization-reindex -->

 succeeded in 0ms:
  const normalizedSessionId = sessionId.trim();
  const normalizedMode = mode.trim();
  if (normalizedSessionId.length === 0 || normalizedMode.length === 0) {
    return;
  }
  sessionModeRegistry.set(normalizedSessionId, normalizedMode);
}

/**
 * Calculate attention tier for an entry.
 */
function calculateTier(attentionScore: number): string {
  if (attentionScore >= 0.8) return 'focused';
  if (attentionScore >= 0.5) return 'active';
  if (attentionScore >= 0.2) return 'peripheral';
  return 'fading';
}

/**
 * Set or update the attention score for a memory in working memory.
 */
function setAttentionScore(
  sessionId: string,
  memoryId: number,
  score: number
): boolean {
  if (!db) return false;
  ensureSchema();

  const clampedScore = Math.max(0, Math.min(1, score));

  try {
    const currentEventCounter = nextEventCounter(sessionId);

    const existing = (db.prepare(
      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
    ) as Database.Statement).get(sessionId, memoryId) as { id: number } | undefined;

    if (existing) {
      (db.prepare(`
        UPDATE working_memory
        SET attention_score = ?,
            last_focused = CURRENT_TIMESTAMP,
            focus_count = focus_count + 1,
            mention_count = MIN(mention_count + 1, ${MAX_MENTION_COUNT}),
            event_counter = ?
        WHERE session_id = ? AND memory_id = ?
      `) as Database.Statement).run(clampedScore, currentEventCounter, sessionId, memoryId);
    } else {
      // Check capacity
      enforceMemoryLimit(sessionId);

      (db.prepare(`
        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
        VALUES (?, ?, ?, ?, 0)
      `) as Database.Statement).run(sessionId, memoryId, clampedScore, currentEventCounter);
    }

    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] setAttentionScore error: ${msg}`);
    return false;
  }
}

function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
  if (!db) return false;
  ensureSchema();

  const {
    sessionId,
    memoryId,
    attentionScore,
    sourceTool,
    sourceCallId,
    extractionRuleId,
    redactionApplied,
  } = input;

  if (!sessionId || !sourceTool || !sourceCallId || !extractionRuleId) {
    return false;
  }

  const clampedScore = Math.max(0, Math.min(1, attentionScore));

  try {
    const currentEventCounter = nextEventCounter(sessionId);

    (db.prepare(`
      INSERT INTO working_memory (
        session_id,
        memory_id,
        attention_score,
        event_counter,
        mention_count,
        source_tool,
        source_call_id,
        extraction_rule_id,
        redaction_applied
      ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)
      ON CONFLICT(session_id, memory_id) DO UPDATE SET
        attention_score = CASE
          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
          ELSE working_memory.attention_score
        END,
        last_focused = CURRENT_TIMESTAMP,
        focus_count = working_memory.focus_count + 1,
        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
        event_counter = excluded.event_counter,
        source_tool = excluded.source_tool,

exec
/bin/zsh -lc "sed -n '3415,3535p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

const (
	minLearningLength = 20
	minLearningWords  = 4
)

// ExtractLearnings parses structured learning items from text.
// It looks for sections like "## Key Learnings:" or "## Aprendizajes Clave:"
// and extracts numbered (1. text) or bullet (- text) items.
// Returns learnings from the LAST matching section (most recent output).
func ExtractLearnings(text string) []string {
	matches := learningHeaderPattern.FindAllStringIndex(text, -1)
	if len(matches) == 0 {
		return nil
	}

	// Process sections in reverse — use first valid one (most recent)
	for i := len(matches) - 1; i >= 0; i-- {
		sectionStart := matches[i][1]
		sectionText := text[sectionStart:]

		// Cut off at next major section header
		if nextHeader := regexp.MustCompile(`\n#{1,3} `).FindStringIndex(sectionText); nextHeader != nil {
			sectionText = sectionText[:nextHeader[0]]
		}

		var learnings []string

		// Try numbered items: "1. text" or "1) text"
		numbered := regexp.MustCompile(`(?m)^\s*\d+[.)]\s+(.+)`).FindAllStringSubmatch(sectionText, -1)
		if len(numbered) > 0 {
			for _, m := range numbered {
				cleaned := cleanMarkdown(m[1])
				if len(cleaned) >= minLearningLength && len(strings.Fields(cleaned)) >= minLearningWords {
					learnings = append(learnings, cleaned)
				}
			}
		}

		// Fall back to bullet items: "- text" or "* text"
		if len(learnings) == 0 {
			bullets := regexp.MustCompile(`(?m)^\s*[-*]\s+(.+)`).FindAllStringSubmatch(sectionText, -1)
			for _, m := range bullets {
				cleaned := cleanMarkdown(m[1])
				if len(cleaned) >= minLearningLength && len(strings.Fields(cleaned)) >= minLearningWords {
					learnings = append(learnings, cleaned)
				}
			}
		}

		if len(learnings) > 0 {
			return learnings
		}
	}

	return nil
}

// cleanMarkdown strips basic markdown formatting and collapses whitespace.
func cleanMarkdown(text string) string {
	text = regexp.MustCompile(`\*\*([^*]+)\*\*`).ReplaceAllString(text, "$1") // bold
	text = regexp.MustCompile("`([^`]+)`").ReplaceAllString(text, "$1")       // inline code
	text = regexp.MustCompile(`\*([^*]+)\*`).ReplaceAllString(text, "$1")     // italic
	return strings.TrimSpace(strings.Join(strings.Fields(text), " "))
}

// PassiveCapture extracts learnings from text and saves them as observations.
// It deduplicates against existing observations using content hash matching.
func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
	// Normalize project name before storing
	p.Project, _ = NormalizeProject(p.Project)

	result := &PassiveCaptureResult{}

	learnings := ExtractLearnings(p.Content)
	result.Extracted = len(learnings)

	if len(learnings) == 0 {
		return result, nil
	}

	for _, learning := range learnings {
		// Check if this learning already exists (by content hash) within this project
		normHash := hashNormalized(learning)
		var existingID int64
		err := s.db.QueryRow(
			`SELECT id FROM observations
			 WHERE normalized_hash = ?
			   AND ifnull(project, '') = ifnull(?, '')
			   AND deleted_at IS NULL
			 LIMIT 1`,
			normHash, nullableString(p.Project),
		).Scan(&existingID)

		if err == nil {
			// Already exists — skip
			result.Duplicates++
			continue
		}

		// Truncate for title: first 60 chars
		title := learning
		if len(title) > 60 {
			title = title[:60] + "..."
		}

		_, err = s.AddObservation(AddObservationParams{
			SessionID: p.SessionID,
			Type:      "passive",
			Title:     title,
			Content:   learning,
			Project:   p.Project,
			Scope:     "project",
			ToolName:  p.Source,
		})
		if err != nil {
			return result, fmt.Errorf("passive capture save: %w", err)
		}
		result.Saved++
	}


exec
/bin/zsh -lc 'rg -n "PassiveCapture|Extracted|learningHeaderPattern|ExtractLearnings|source" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
188:	Source     string  `json:"source"`
534:				source      TEXT NOT NULL DEFAULT 'local',
1868:		SELECT sm.seq, sm.target_key, sm.entity, sm.entity_key, sm.op, sm.payload, sm.source, sm.project, sm.occurred_at, sm.acked_at
2449:	SourcesMerged       []string `json:"sources_merged"`
2455:// MergeProjects migrates all records from each source project name into the
2459:func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
2468:		for _, src := range sources {
2673:			  AND sm.source = ?
2707:			  AND sm.source = ?
2740:			  AND sm.source = ?
2775:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
3396:// PassiveCaptureParams holds the input for passive memory capture.
3397:type PassiveCaptureParams struct {
3401:	Source    string `json:"source,omitempty"` // e.g. "subagent-stop", "session-end"
3404:// PassiveCaptureResult holds the output of passive memory capture.
3405:type PassiveCaptureResult struct {
3406:	Extracted  int `json:"extracted"`  // Total learnings found in text
3411:// learningHeaderPattern matches section headers for learnings in both English and Spanish.
3412:var learningHeaderPattern = regexp.MustCompile(
3421:// ExtractLearnings parses structured learning items from text.
3425:func ExtractLearnings(text string) []string {
3426:	matches := learningHeaderPattern.FindAllStringIndex(text, -1)
3481:// PassiveCapture extracts learnings from text and saves them as observations.
3483:func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
3487:	result := &PassiveCaptureResult{}
3489:	learnings := ExtractLearnings(p.Content)
3490:	result.Extracted = len(learnings)

exec
/bin/zsh -lc "sed -n '560,640p' .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    validateArguments();

    await runWorkflow({
      dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE ?? undefined,
      specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
      collectedData: parsed.collectedData ?? undefined,
      loadDataFn: parsed.collectedData
        ? undefined
        : () => loadCollectedData({}),
      collectSessionDataFn: collectSessionData,
      sessionId: parsed.sessionId ?? undefined,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);

    if (isExpected) {
      console.error(`\nError: ${errMsg}`);
    } else {
      console.error('Unexpected Error:', errMsg);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────────
// 7. EXPORTS
// ───────────────────────────────────────────────────────────────
if (require.main === module) {
  installSignalHandlers();
  main().catch((error: unknown) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`Fatal error: ${errMsg}`);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  });
}

export {
  main,
  readAllStdin,
  parseArguments,
  validateArguments,
  isValidSpecFolder,
  extractPayloadSpecFolder,
};

exec
/bin/zsh -lc "sed -n '1088,1138p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:

		if err := s.EndSession(id, summary); err != nil {
			return mcp.NewToolResultError("Failed to end session: " + err.Error()), nil
		}

		return mcp.NewToolResultText(fmt.Sprintf("Session %q completed", id)), nil
	}
}

func handleCapturePassive(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		content, _ := req.GetArguments()["content"].(string)
		sessionID, _ := req.GetArguments()["session_id"].(string)
		project, _ := req.GetArguments()["project"].(string)
		source, _ := req.GetArguments()["source"].(string)

		// Apply default project when LLM sends empty
		if project == "" {
			project = cfg.DefaultProject
		}
		project, _ = store.NormalizeProject(project)

		if content == "" {
			return mcp.NewToolResultError("content is required — include text with a '## Key Learnings:' section"), nil
		}

		if sessionID == "" {
			sessionID = defaultSessionID(project)
			_ = s.CreateSession(sessionID, project, "")
		}

		if source == "" {
			source = "mcp-passive"
		}

		result, err := s.PassiveCapture(store.PassiveCaptureParams{
			SessionID: sessionID,
			Content:   content,
			Project:   project,
			Source:    source,
		})
		if err != nil {
			return mcp.NewToolResultError("Passive capture failed: " + err.Error()), nil
		}

		return mcp.NewToolResultText(fmt.Sprintf(
			"Passive capture complete: extracted=%d saved=%d duplicates=%d",
			result.Extracted, result.Saved, result.Duplicates,
		)), nil
	}
}

exec
/bin/zsh -lc "sed -n '130,140p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
] as const;

const CHECKPOINT_CLEAR_ORDER = [...CHECKPOINT_RESTORE_ORDER].reverse();

const MUTATION_LEDGER_TRIGGER_SQL = `
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_update BEFORE UPDATE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
  CREATE TRIGGER IF NOT EXISTS prevent_ledger_delete BEFORE DELETE ON mutation_ledger
  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
`;


exec
/bin/zsh -lc "sed -n '130,210p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    resultStatus = 'updated';
  } else if (embeddingStatus !== 'success') {
    resultStatus = 'deferred';
  } else {
    resultStatus = 'indexed';
  }

  const linkedMemoryIds = [
    id,
    ...(peDecision.existingMemoryId != null ? [peDecision.existingMemoryId] : []),
  ];
  const ledgerRecorded = appendMutationLedgerSafe(database, {
    mutationType: existing ? 'update' : 'create',
    reason: existing
      ? 'memory_save: updated indexed memory entry'
      : 'memory_save: created new indexed memory entry',
    priorHash: existing?.content_hash ?? null,
    newHash: parsed.contentHash,
    linkedMemoryIds,
    decisionMeta: {
      tool: 'memory_save',
      status: resultStatus,
      action: peDecision.action,
      similarity: peDecision.similarity,
      specFolder: parsed.specFolder,
      filePath,
      embeddingStatus,
      qualityScore: parsed.qualityScore ?? 0,
      documentType: parsed.documentType || 'memory',
    },
    actor: 'mcp:memory_save',
  });

  const result: IndexResult = {
    status: resultStatus,
    id,
    specFolder: parsed.specFolder,
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    memoryType: parsed.memoryType,
    memoryTypeSource: parsed.memoryTypeSource,
    embeddingStatus,
    warnings: [...validation.warnings, ...reconWarnings],
    qualityScore: parsed.qualityScore,
    qualityFlags: parsed.qualityFlags,
  };
  if (!ledgerRecorded) {
    result.warnings = result.warnings || [];
    result.warnings.push('Mutation ledger append failed; audit trail may be incomplete.');
  }

  const assistiveRecommendation = finalizeAssistiveRecommendation(reconWarnings, id);
  if (assistiveRecommendation) {
    result.assistiveRecommendation = assistiveRecommendation;
  }

  if (peDecision.action !== predictionErrorGate.ACTION.CREATE) {
    result.pe_action = peDecision.action;
    result.pe_reason = peDecision.reason;
  }

  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    result.superseded_id = peDecision.existingMemoryId;
  }

  if (peDecision.action === predictionErrorGate.ACTION.CREATE_LINKED && peDecision.existingMemoryId != null) {
    result.related_ids = [peDecision.existingMemoryId];
  }

  if (embeddingStatus === 'pending' && embeddingFailureReason) {
    // Security: raw provider errors sanitized before persistence/response
    result.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(embeddingFailureReason) ?? undefined;
    result.message = 'Memory saved with deferred indexing - searchable via BM25/FTS5';
  }

  if (asyncEmbedding && embeddingStatus === 'pending') {
    const memoryId = id;
    const memoryContent = parsed.content;
    setImmediate(() => {

exec
/bin/zsh -lc "sed -n '820,880p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '3199,3255p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
        result.pass = false;
        result.errors.push(...anchorResult.errors);
      } else {
        result.warnings.push(...anchorResult.errors);
      }
    }
    if (anchorResult.warnings.length > 0) {
      result.warnings.push(...anchorResult.warnings);
    }
  }

  // 3. Token budget estimation
  if (check_tokens && content) {
    const tokenResult = checkTokenBudget(content);
    addCheck('token_budget', tokenResult);

    if (!tokenResult.within_budget) {
      if (isChunkEligible) {
        // Large files will be chunked — convert to warning
        result.warnings.push(...tokenResult.errors);
      } else {
        result.pass = false;
        result.errors.push(...tokenResult.errors);
      }
    }
    if (tokenResult.warnings.length > 0) {
      result.warnings.push(...tokenResult.warnings);
    }
  }

  // 4. Duplicate detection
  if (check_duplicates && content) {
    const dupResult = checkDuplicate(
      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
      { check_exact: true, check_similar }
    );
    addCheck('duplicate_check', dupResult);

    if (dupResult.isDuplicate) {
      // Exact duplicates block save
      if (dupResult.duplicate_type === 'exact') {
        result.pass = false;
        result.errors.push({
          code: PreflightErrorCodes.DUPLICATE_EXACT,
          message: `Exact duplicate found: memory #${dupResult.existingId}`,
          existingId: dupResult.existingId ?? undefined,
          existing_path: dupResult.existing_path ?? undefined,
          suggestion: 'Use force=true to re-index, or delete the existing memory first',
        });
      }
      // Similar duplicates are warnings (PE-gating handles them)
      else if (dupResult.duplicate_type === 'similar') {
        result.warnings.push({
          code: PreflightErrorCodes.DUPLICATE_SIMILAR,
          message: `Similar memory found: #${dupResult.existingId} (${Math.round((dupResult.similarity ?? 0) * 100)}% similar)`,
          existingId: dupResult.existingId ?? undefined,
          similarity: dupResult.similarity ?? undefined,
          suggestion: 'Memory may be reinforced or updated instead of created (PE-gating)',
        });
      }
    }

 succeeded in 0ms:
// It infers a topic family (e.g. architecture/*, bug/*) and then appends
// a normalized segment from title/content for stable cross-session keys.
func SuggestTopicKey(typ, title, content string) string {
	family := inferTopicFamily(typ, title, content)
	cleanTitle := stripPrivateTags(title)
	segment := normalizeTopicSegment(cleanTitle)

	if segment == "" {
		cleanContent := stripPrivateTags(content)
		words := strings.Fields(strings.ToLower(cleanContent))
		if len(words) > 8 {
			words = words[:8]
		}
		segment = normalizeTopicSegment(strings.Join(words, " "))
	}

	if segment == "" {
		segment = "general"
	}

	if strings.HasPrefix(segment, family+"-") {
		segment = strings.TrimPrefix(segment, family+"-")
	}
	if segment == "" || segment == family {
		segment = "general"
	}

	return family + "/" + segment
}

func inferTopicFamily(typ, title, content string) string {
	t := strings.TrimSpace(strings.ToLower(typ))
	switch t {
	case "architecture", "design", "adr", "refactor":
		return "architecture"
	case "bug", "bugfix", "fix", "incident", "hotfix":
		return "bug"
	case "decision":
		return "decision"
	case "pattern", "convention", "guideline":
		return "pattern"
	case "config", "setup", "infra", "infrastructure", "ci":
		return "config"
	case "discovery", "investigation", "root_cause", "root-cause":
		return "discovery"
	case "learning", "learn":
		return "learning"
	case "session_summary":
		return "session"
	}

	text := strings.ToLower(title + " " + content)
	if hasAny(text, "bug", "fix", "panic", "error", "crash", "regression", "incident", "hotfix") {
		return "bug"
	}
	if hasAny(text, "architecture", "design", "adr", "boundary", "hexagonal", "refactor") {
		return "architecture"

codex
I’m at synthesis now, and I’m sanity-checking one last thing before I write: whether any Public retrieval surface already exposes the kind of revision/duplicate counters Engram puts directly into search results. If not, that becomes a clean hygiene finding instead of a vague one.
exec
/bin/zsh -lc "rg -n \"revision_count|duplicate_count|last_seen_at|topic_key\" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/lib/search -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
exec
/bin/zsh -lc 'rg -n "mutation ledger|append-only|audit trail|decisionMeta|memory_save" .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:136:  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:138:  BEGIN SELECT RAISE(ABORT, 'mutation_ledger is append-only'); END
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:149:    decisionMeta: {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:180:    result.warnings.push('Mutation ledger append failed; audit trail may be incomplete.');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',

exec
/bin/zsh -lc 'rg -n "session_summary|passive|quality gate|trigger sanitization|post-save" .opencode/skill/system-spec-kit/scripts/memory/README.md .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:63:/** Combined result from all quality gate layers */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:77:/** Parameters for running the quality gate */
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:113:// REQ-D4-003: Short-critical quality gate exception
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:225: * Check if the quality gate feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:235: * Check if the quality gate is in warn-only mode.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:262: * Called when the quality gate is first enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:305: * REQ-D4-003: Check whether the save quality gate exceptions feature is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:752: * Run the full 3-layer quality gate for a memory save operation.
.opencode/skill/system-spec-kit/scripts/memory/README.md:41:- `validate-memory-quality.ts` - validates post-render memory quality against scoring thresholds before indexing/reporting; includes post-save quality gates (structure, semantic sufficiency, duplicate detection), heuristic calibration, and trigger sanitization
.opencode/skill/system-spec-kit/scripts/memory/README.md:97:- Runs post-render memory quality validation so contaminated headings or fallback-decision leaks are caught after template population. The post-save quality pipeline includes 3-layer gates (structure, semantic sufficiency, duplicate detection), heuristic calibration for scoring thresholds, and trigger sanitization to prevent noisy or over-broad trigger phrases from persisting in the index.

exec
/bin/zsh -lc "rg -n \"mem_stats|mem_merge_projects|MergeProjects|Stats\\(|PassiveCapture|mem_capture_passive\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:35:	return s.Stats()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:46://   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:71:	"mem_stats":          true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:73:	"mem_merge_projects": true, // destructive curation tool — not for agent use
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:399:	// ─── mem_stats (profile: admin, deferred) ───────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:400:	if shouldRegister("mem_stats", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:402:			mcp.NewTool("mem_stats",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:411:			handleStats(s),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:566:	if shouldRegister("mem_capture_passive", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:568:			mcp.NewTool("mem_capture_passive",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:598:	// ─── mem_merge_projects (profile: admin, deferred) ──────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:599:	if shouldRegister("mem_merge_projects", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:601:			mcp.NewTool("mem_merge_projects",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:618:			handleMergeProjects(s),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:903:		stats, _ := s.Stats()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:918:func handleStats(s *store.Store) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:920:		stats, err := loadMCPStats(s)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1123:		result, err := s.PassiveCapture(store.PassiveCaptureParams{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1140:func handleMergeProjects(s *store.Store) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1161:		result, err := s.MergeProjects(sources, to)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1588:func (s *Store) Stats() (*Stats, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2267:		// Same pattern used by EnrollProject and MergeProjects.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2320:func (s *Store) ListProjectsWithStats() ([]ProjectStats, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2455:// MergeProjects migrates all records from each source project name into the
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459:func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3396:// PassiveCaptureParams holds the input for passive memory capture.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3397:type PassiveCaptureParams struct {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3404:// PassiveCaptureResult holds the output of passive memory capture.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3405:type PassiveCaptureResult struct {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3481:// PassiveCapture extracts learnings from text and saves them as observations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3483:func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3487:	result := &PassiveCaptureResult{}

codex
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Engram’s `topic_key` upsert is a strong anti-spam primitive, but it is flatter than our causal-link hygiene model
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [mcp_server/lib/storage/causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts), [mcp_server/lib/storage/reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
- **What it does**: Engram’s `AddObservation()` first tries a same-`project`+`scope`+`topic_key` upsert, increments `revision_count`, and refreshes `last_seen_at`; only after that does it run exact duplicate suppression. Public instead preserves separate rows, then expresses replacement/conflict through `supersedes` edges and reconsolidation transactions, with self-loop rejection and bounded edge strength.
- **Why it matters for us**: Engram is better at keeping one evolving thread compact; Public is better at preserving lineage and explainability. The useful import is an optional thread-key compaction hint layered on top of causal links, not a replacement for them.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Engram exposes hygiene telemetry directly in retrieval; Public’s hygiene signals are stronger, but mostly operational rather than conversational
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/save/dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts), [mcp_server/lib/validation/preflight.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts), [mcp_server/handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- **What it does**: Engram’s `Search()` returns `topic_key`, `revision_count`, `duplicate_count`, and `last_seen_at` with both direct key hits and FTS hits. Public has stronger hygiene decisions before and during save, including exact-duplicate blocking and similar-duplicate warning/routing, but those coarse hygiene counters are not surfaced in current retrieval handlers.
- **Why it matters for us**: Operators can see immediately whether an Engram hit is a stable thread, a repeatedly duplicated memory, or a recently refreshed record. Public already has the deeper logic; it just does not summarize that state as cheaply at retrieval time.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Public’s trigger system is a materially stronger hygiene layer than anything Engram currently has
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts), [mcp_server/lib/parsing/memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts), [mcp_server/lib/cognitive/working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- **What it does**: Engram’s hygiene is lexical: `sanitizeFTS()`, direct `topic_key` lookup, and duplicate suppression. Public adds a separate trigger plane with authored phrase extraction, path/numeric/shingle filtering, trusted-session enforcement, fail-closed scope filtering, and attention-tier working memory with decay/co-activation.
- **Why it matters for us**: For compaction survival and fast recovery, explicit trigger hygiene is a real advantage. Engram’s topic families are useful, but they do not replace a controlled trigger surface.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Engram’s admin hygiene surface is observability-light; Public’s health tooling is the stronger operational model
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [mcp_server/lib/storage/causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts), [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md)
- **What it does**: Engram’s `mem_stats` is basically totals plus project list. Public’s `memory_health` checks DB/provider readiness, FTS parity, alias divergence, vector integrity, and can repair FTS, refresh trigger cache, and clean orphan causal edges/vectors/chunks with explicit confirmation.
- **Why it matters for us**: Once memory hygiene includes vectors, triggers, and causal edges, simple counts are not enough. Engram has curation tools; Public has an actual repair plane.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Engram’s project-merge cleanup is useful for drift repair, but too coarse for our provenance and audit expectations
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/save/response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts), [mcp_server/lib/storage/checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts), [mcp_server/handlers/memory-bulk-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
- **What it does**: Engram’s `MergeProjects()` rewrites `project` across observations, sessions, and prompts in one transaction, then backfills sync mutations. Public destructive or mutating paths keep an append-only mutation ledger, checkpoint guardrails, and transactional cleanup of graph residue.
- **Why it matters for us**: Engram’s merge is practical for local naming drift, but it rewrites scope history in place. In Public, that would weaken auditability and make causal/shared-scope provenance harder to trust unless we added much stricter lineage recording.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Engram’s session-summary and passive-capture writes are convenient, but they bypass the intake hygiene standards Public already enforces
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/lib/validation/save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts), [scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md)
- **What it does**: `mem_session_summary` auto-creates a session if needed and saves a `session_summary` observation; `PassiveCapture()` extracts the last “Key Learnings” section and writes each item unless an exact content hash already exists. Public’s authority path is much stricter: 3-layer quality gate, duplicate checks, post-save review, and trigger sanitization before durable indexing.
- **Why it matters for us**: Engram makes low-friction capture easy, but it also makes noisy or weak observations easier to admit. If we add passive capture, it should feed our existing quality-gated pipeline as a low-trust draft lane, not stand beside `generate-context.js` as an equal source of truth.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [research/iterations/iteration-009.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [mcp_server/lib/cognitive/working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [mcp_server/handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [mcp_server/lib/storage/causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [mcp_server/lib/storage/reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
- [mcp_server/handlers/save/dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
- [mcp_server/lib/validation/preflight.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts)
- [mcp_server/lib/validation/save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts)
- [mcp_server/handlers/save/response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts)
- [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
- [scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q3, Q4, Q6, Q8, Q9, Q10
- Questions answered: Q3, Q4, Q6, Q8, Q9, Q10

## Reflection
- What worked: tracing Engram’s hygiene from `AddObservation()` and `Search()` outward, then comparing it directly to Public’s save, trigger, causal-edge, and health handlers made the differences concrete instead of conceptual.
- What did not work: CocoIndex was not usable again, so I had to stay on `rg` plus direct file reads; the workspace is also read-only, so I did not update the phase folder or save memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s export/import and sync replay paths against Public’s mutation ledger, checkpoints, and shared-memory boundaries to answer whether cross-install replay should preserve thread identity, causal lineage, and hygiene metadata separately instead of collapsing them into project-level merges.


hook: Stop
hook: Stop Completed
tokens used
178,769
# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Engram’s `topic_key` upsert is a strong anti-spam primitive, but it is flatter than our causal-link hygiene model
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [mcp_server/lib/storage/causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts), [mcp_server/lib/storage/reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
- **What it does**: Engram’s `AddObservation()` first tries a same-`project`+`scope`+`topic_key` upsert, increments `revision_count`, and refreshes `last_seen_at`; only after that does it run exact duplicate suppression. Public instead preserves separate rows, then expresses replacement/conflict through `supersedes` edges and reconsolidation transactions, with self-loop rejection and bounded edge strength.
- **Why it matters for us**: Engram is better at keeping one evolving thread compact; Public is better at preserving lineage and explainability. The useful import is an optional thread-key compaction hint layered on top of causal links, not a replacement for them.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 2: Engram exposes hygiene telemetry directly in retrieval; Public’s hygiene signals are stronger, but mostly operational rather than conversational
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/save/dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts), [mcp_server/lib/validation/preflight.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts), [mcp_server/handlers/memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- **What it does**: Engram’s `Search()` returns `topic_key`, `revision_count`, `duplicate_count`, and `last_seen_at` with both direct key hits and FTS hits. Public has stronger hygiene decisions before and during save, including exact-duplicate blocking and similar-duplicate warning/routing, but those coarse hygiene counters are not surfaced in current retrieval handlers.
- **Why it matters for us**: Operators can see immediately whether an Engram hit is a stable thread, a repeatedly duplicated memory, or a recently refreshed record. Public already has the deeper logic; it just does not summarize that state as cheaply at retrieval time.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Public’s trigger system is a materially stronger hygiene layer than anything Engram currently has
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts), [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts), [mcp_server/lib/parsing/memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts), [mcp_server/lib/cognitive/working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- **What it does**: Engram’s hygiene is lexical: `sanitizeFTS()`, direct `topic_key` lookup, and duplicate suppression. Public adds a separate trigger plane with authored phrase extraction, path/numeric/shingle filtering, trusted-session enforcement, fail-closed scope filtering, and attention-tier working memory with decay/co-activation.
- **Why it matters for us**: For compaction survival and fast recovery, explicit trigger hygiene is a real advantage. Engram’s topic families are useful, but they do not replace a controlled trigger surface.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Engram’s admin hygiene surface is observability-light; Public’s health tooling is the stronger operational model
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts), [mcp_server/lib/storage/causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts), [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md)
- **What it does**: Engram’s `mem_stats` is basically totals plus project list. Public’s `memory_health` checks DB/provider readiness, FTS parity, alias divergence, vector integrity, and can repair FTS, refresh trigger cache, and clean orphan causal edges/vectors/chunks with explicit confirmation.
- **Why it matters for us**: Once memory hygiene includes vectors, triggers, and causal edges, simple counts are not enough. Engram has curation tools; Public has an actual repair plane.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Engram’s project-merge cleanup is useful for drift repair, but too coarse for our provenance and audit expectations
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/handlers/save/response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts), [mcp_server/lib/storage/checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts), [mcp_server/handlers/memory-bulk-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts)
- **What it does**: Engram’s `MergeProjects()` rewrites `project` across observations, sessions, and prompts in one transaction, then backfills sync mutations. Public destructive or mutating paths keep an append-only mutation ledger, checkpoint guardrails, and transactional cleanup of graph residue.
- **Why it matters for us**: Engram’s merge is practical for local naming drift, but it rewrites scope history in place. In Public, that would weaken auditability and make causal/shared-scope provenance harder to trust unless we added much stricter lineage recording.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Engram’s session-summary and passive-capture writes are convenient, but they bypass the intake hygiene standards Public already enforces
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go), [mcp_server/lib/validation/save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts), [scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts), [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md)
- **What it does**: `mem_session_summary` auto-creates a session if needed and saves a `session_summary` observation; `PassiveCapture()` extracts the last “Key Learnings” section and writes each item unless an exact content hash already exists. Public’s authority path is much stricter: 3-layer quality gate, duplicate checks, post-save review, and trigger sanitization before durable indexing.
- **Why it matters for us**: Engram makes low-friction capture easy, but it also makes noisy or weak observations easier to admit. If we add passive capture, it should feed our existing quality-gated pipeline as a low-trust draft lane, not stand beside `generate-context.js` as an equal source of truth.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [research/iterations/iteration-009.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/handlers/memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [mcp_server/lib/cognitive/working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [mcp_server/handlers/memory-crud-health.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts)
- [mcp_server/lib/storage/causal-edges.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts)
- [mcp_server/lib/storage/reconsolidation.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts)
- [mcp_server/handlers/save/dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
- [mcp_server/lib/validation/preflight.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts)
- [mcp_server/lib/validation/save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts)
- [mcp_server/handlers/save/response-builder.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts)
- [scripts/core/workflow.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
- [scripts/core/post-save-review.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts)
- [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q3, Q4, Q6, Q8, Q9, Q10
- Questions answered: Q3, Q4, Q6, Q8, Q9, Q10

## Reflection
- What worked: tracing Engram’s hygiene from `AddObservation()` and `Search()` outward, then comparing it directly to Public’s save, trigger, causal-edge, and health handlers made the differences concrete instead of conceptual.
- What did not work: CocoIndex was not usable again, so I had to stay on `rg` plus direct file reads; the workspace is also read-only, so I did not update the phase folder or save memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s export/import and sync replay paths against Public’s mutation ledger, checkpoints, and shared-memory boundaries to answer whether cross-install replay should preserve thread identity, causal lineage, and hygiene metadata separately instead of collapsing them into project-level merges.
