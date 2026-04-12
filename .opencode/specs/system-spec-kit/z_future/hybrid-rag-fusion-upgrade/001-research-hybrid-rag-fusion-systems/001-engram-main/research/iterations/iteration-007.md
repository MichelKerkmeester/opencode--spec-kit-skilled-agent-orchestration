### Finding 3: Engram’s soft delete is a real tombstone model with undelete-by-upsert, but its garbage collection is intentionally shallow
- **Source**: [store.go:450](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L450), [store.go:1313](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1313), [store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1462), [store.go:2913](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2913), [store.go:2520](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2520), [memory-crud-delete.ts:91](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts#L91), [vector-index-mutations.ts:516](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts#L516), [archival-manager.ts:558](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L558)
- **What it does**: Engram writes `deleted_at`, excludes those rows from search/context/recent lists, emits delete sync payloads, and can effectively undelete the row later because sync upsert forces `deleted_at = NULL`. But there is no automatic purge of soft-deleted observations; `PruneProject()` only deletes prompts and sessions once live observation count is zero. Public’s deletion model is the inverse: `memory_delete` is physical row deletion, while reversible lifecycle management lives in `is_archived` plus explicit archive/unarchive flows.
- **Why it matters for us**: Engram’s tombstone semantics are attractive for future shared-memory restore/conflict flows, but not as a general garbage-collection strategy. Public is already stronger on actual cleanup and reversible archival separation.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Engram’s `topic_key` is semantic identity; Public’s logical key is storage identity
- **Source**: [store.go:3198](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3198), [mcp.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L53), [mcp.go:302](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L302), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L207), [lineage-state.ts:232](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L232), [lineage-state.ts:251](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L251)
- **What it does**: Engram derives a stable semantic family like `architecture/*`, `bug/*`, `decision/*`, then normalizes title/content into a reusable segment for cross-session upserts. Public’s logical identity is built from scope hash plus canonical path plus anchor, with hashed fallback only to preserve structural uniqueness.
- **Why it matters for us**: Public is excellent at “which stored artifact/version is active?” but weaker at “this is the same evolving decision thread even if it moved files or changed document boundaries.” Engram’s semantic key is a useful complement, not a replacement.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Public already exceeds Engram on revision auditability and lifecycle cleanup, so Engram should only influence metadata ergonomics
- **Source**: [store.go:980](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L980), [store.go:1277](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1277), [create-record.ts:253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L253), [lineage-state.ts:666](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L666), [lineage-state.ts:1257](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L1257), [history.ts:306](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts#L306), [session-manager.ts:771](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L771), [archival-manager.ts:371](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts#L371)
- **What it does**: Engram tracks revision with scalar counters on a mutable current row. Public records transition edges, preserves history events, marks predecessors deprecated, archives separately, and cleans stale session-state/working-memory artifacts on a timer.
- **Why it matters for us**: The right synthesis is narrow. Borrow Engram’s semantic thread-key idea and maybe a recurrence counter, but do not collapse Public’s append-first lineage and cleanup model into single-row revision integers.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [sk-deep-research/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [handlers/save/dedup.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts)
- [handlers/memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [handlers/save/create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)
- [handlers/memory-crud-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts)
- [lib/storage/history.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts)
- [lib/storage/lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [lib/session/session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [lib/cognitive/archival-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts)
- [lib/search/vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
- [lib/search/vector-index-mutations.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts)
- [lib/search/sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)

## Assessment
- New information ratio: 0.78
- Questions addressed: Q3, Q4, Q8, Q9, Q10
- Questions answered: Q3, Q4, Q9, Q10
- Questions partially answered: Q8

## Reflection
- What worked: starting at `AddObservation()`, then following delete/import/sync paths, exposed the real hygiene model quickly. The most valuable step was tracing `syncObservationPayload` into `applyObservationUpsertTx()`, which showed that Engram’s counters are not fully sync-authoritative even though export/import preserves them.
- What did not work: CocoIndex MCP and Spec Kit Memory MCP both failed in this session, so this pass relied on `rg` plus direct file reads. I also kept this iteration read-only and did not run the spec validator or save memory.

## Recommended Next Focus
Trace project merge and sync collision behavior next: `mem_merge_projects`, `NormalizeProject()`, sync chunk import, and any project-name consolidation paths that can reshape `topic_key` neighborhoods. The key question is whether Engram’s semantic threading stays stable when project identities drift or merge across machines.

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
# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

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
I’m treating this as a read-only deep-research pass for the pre-approved Engram phase folder. I’ll load the governing context first, validate the phase folder, then trace Engram’s MCP and store code paths against our current Spec Kit Memory surfaces and report only net-new agent-integration findings.
exec
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|agent integration|passive capture|topic_key|ProfileAgent|ProfileAdmin" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
| **Progressive synthesis** | `progressiveSynthesis` defaults to `true`; the agent may update `research/research.md` incrementally, and the orchestrator always performs the final consolidation pass |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS

1. **Read state first** -- Agent must read JSONL and strategy.md before any research action
2. **One focus per iteration** -- Pick ONE research sub-topic from strategy.md "Next Focus"
3. **Externalize findings** -- Write to iteration-NNN.md, not held in agent context
4. **Update strategy** -- Append to "What Worked"/"What Failed", update "Next Focus"
5. **Report newInfoRatio** -- Every iteration JSONL record must include newInfoRatio
6. **Respect exhausted approaches** -- Never retry approaches in the "Exhausted" list
7. **Cite sources** -- Every finding must cite `[SOURCE: url]` or `[SOURCE: file:line]`
8. **Use generate-context.js for memory saves** -- Never manually create memory files
9. **Treat research/research.md as workflow-owned** -- Iteration findings feed synthesis; the workflow owns the canonical `research/research.md`
10. **Document ruled-out directions per iteration** -- Every iteration must include what was tried and failed
11. **Report newInfoRatio + 1-sentence novelty justification** -- Every JSONL iteration record must include both
12. **Quality guards must pass before convergence** -- Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger
13. **Respect reducer ownership** -- The workflow reducer, not the agent, is the source of truth for strategy machine-owned sections, dashboard metrics, and findings registry updates
14. **Use canonical packet names only** -- Write `deep-research-*` artifacts and `research/.deep-research-pause`; legacy names are read-only migration aliases

### NEVER

1. **Dispatch sub-agents** -- @deep-research is LEAF-only (NDP compliance)
2. **Hold findings in context** -- Write everything to files
3. **Exceed TCB** -- Target 8-11 tool calls per iteration (max 12)
4. **Ask the user** -- Autonomous execution; make best-judgment decisions
5. **Skip convergence checks** -- Every iteration must be evaluated
6. **Modify config after init** -- Config is read-only after initialization
7. **Overwrite prior findings** -- Append to research/research.md, never replace

### Iteration Status Enum

`complete | timeout | error | stuck | insight | thought`

- `insight`: Low newInfoRatio but important conceptual breakthrough

exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

**Flow:** Parse request → Read files first → Analyze → Design simplest solution → Validate → Execute

| Principle         | Rule                                               | Anti-Pattern                            |
| ----------------- | -------------------------------------------------- | --------------------------------------- |
| **Simplicity**    | Reuse patterns; earn every abstraction             | Utilities for <3 uses, single-impl intf |
| **Evidence**      | Cite `[SOURCE: file:lines]` or `[CITATION: NONE]`  | Claims without verification             |
| **Scope Match**   | Solution size = problem size                       | Refactoring during bug fix              |
| **Right Problem** | Root cause, not symptom; measure before optimizing | Premature optimization, wrong framing   |

**CLARITY Triggers** (justify before proceeding):
- Utility for <3 uses | Config for single value | Abstraction without clear boundary
- Pattern where simple code suffices | Interface for single impl
- On bias → don't argue, redirect to root cause

**Pre-Change Checklist:**
- [ ] Read first? | Simplest solution? | Scope discipline?
- [ ] Confidence ≥80%? | Sources cited? | Spec folder? | Approval?

**Five Checks (>100 LOC):** Necessary now? | Alternatives (≥2)? | Simplest sufficient? | On critical path? | No tech debt?

**STOP CONDITIONS:** Any check unchecked | no spec folder | no approval → STOP and address

---

## 6. 🤖 AGENT ROUTING

When using the orchestrate agent or Task tool for complex multi-step workflows, route to specialized agents:

### Runtime Agent Directory Resolution

Use the agent directory that matches the active runtime/provider profile:

| Runtime / Profile                      | Agent Directory            | Usage Rule                                                  |
| -------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| **Copilot (default OpenCode profile)** | `.opencode/agent/`         | Load base agent definitions from this directory             |
| **Claude profile**                     | `.claude/agents/`          | Load Claude-specific agent definitions from this directory  |
| **Codex CLI**                          | `.codex/agents/`           | Load Codex-specific agent definitions from this directory   |
| **Gemini CLI**                         | `.gemini/agents/`          | Load Gemini-specific agent definitions from this directory  |

**Resolution rule:** pick one directory by runtime and stay consistent for that workflow phase.

codex
I’ve loaded the research-loop guidance and the external repo instructions. Next I’m checking the phase-folder state with the exact validator, then I’ll trace Engram’s MCP registration and store paths with CocoIndex plus targeted reads so this pass stays source-backed rather than README-led.
exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1408ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
The validator is still running. While it finishes, I’m lining up the code-path reads around `internal/mcp/mcp.go`, `store.go`, and the Public memory/session files so we can compare actual agent-surface and project-scoping behavior end to end.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
codex
The first validation attempt yielded awkwardly, so I’m re-running it in a simpler way and then continuing with focused code reads. I’ll also switch to smaller CocoIndex queries so we can still get semantic hints without losing time to broad indexing.
exec
/bin/zsh -lc 'ls -1 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
external
memory
phase-research-prompt.md
research

exec
/bin/zsh -lc 'cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1313ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
Validation passed, but there’s an important constraint signal: the phase folder currently only has `external/`, `memory/`, `phase-research-prompt.md`, and `research/`, so the Level 3 spec docs the brief calls for are not present here. Because the workspace is read-only in this session, I can’t correct that structure or save memory artifacts, so I’m proceeding with the research pass and will call out those blocked deliverables explicitly in the result.
exec
/bin/zsh -lc 'rg -n "ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|mem_search|mem_save|mem_context|mem_session_summary|mem_session_start|mem_session_end|mem_suggest_topic_key|mem_capture_passive|mem_merge_projects|NormalizeProject|merge" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:11://	engram mcp --tools=admin      → 4 tools for TUI/CLI (delete, stats, timeline, merge)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:13://	engram mcp --tools=mem_save,mem_search → individual tool names
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:42://   mem_session_start, mem_session_end, mem_get_observation,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:46://   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:50:// ProfileAgent contains the tool names that AI agents need.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:53:var ProfileAgent = map[string]bool{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:54:	"mem_save":              true, // proactive save — referenced 17 times across protocols
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:55:	"mem_search":            true, // search past memories — referenced 6 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:58:	"mem_session_start":     true, // register session start
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:59:	"mem_session_end":       true, // mark session completed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:63:	"mem_save_prompt":       true, // save user prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:69:var ProfileAdmin = map[string]bool{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:73:	"mem_merge_projects": true, // destructive curation tool — not for agent use
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:78:	"agent": ProfileAgent,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:79:	"admin": ProfileAdmin,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:82:// ResolveTools takes a comma-separated string of profile names and/or
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:85:func ResolveTools(input string) map[string]bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:127:  mem_save — save decisions, bugs, discoveries, conventions PROACTIVELY (do not wait to be asked)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:128:  mem_search — find past work, decisions, or context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:129:  mem_context — get recent session history (call at session start or after compaction)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:132:  mem_save_prompt — save user prompt for context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:138:PROACTIVE SAVE RULE: Call mem_save immediately after ANY decision, bug fix, discovery, or convention — not just when asked.`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:160:// shouldRegister returns true if the tool should be registered given the
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:162:func shouldRegister(name string, allowlist map[string]bool) bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:170:	// ─── mem_search (profile: agent, core — always in context) ─────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:171:	if shouldRegister("mem_search", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:173:			mcp.NewTool("mem_search",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:201:	// ─── mem_save (profile: agent, core — always in context) ───────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:202:	if shouldRegister("mem_save", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:204:			mcp.NewTool("mem_save",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:265:	if shouldRegister("mem_update", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:305:			mcp.NewTool("mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:328:	if shouldRegister("mem_delete", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:351:	if shouldRegister("mem_save_prompt", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:353:			mcp.NewTool("mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:375:	// ─── mem_context (profile: agent, core — always in context) ────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:376:	if shouldRegister("mem_context", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:378:			mcp.NewTool("mem_context",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:400:	if shouldRegister("mem_stats", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:416:	if shouldRegister("mem_timeline", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:442:	if shouldRegister("mem_get_observation", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:461:	if shouldRegister("mem_session_summary", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:463:			mcp.NewTool("mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:516:	if shouldRegister("mem_session_start", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:518:			mcp.NewTool("mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:543:	if shouldRegister("mem_session_end", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:545:			mcp.NewTool("mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:566:	if shouldRegister("mem_capture_passive", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:568:			mcp.NewTool("mem_capture_passive",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:598:	// ─── mem_merge_projects (profile: admin, deferred) ──────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:599:	if shouldRegister("mem_merge_projects", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:601:			mcp.NewTool("mem_merge_projects",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:611:					mcp.Description("Comma-separated list of project names to merge FROM (e.g. 'Engram,engram-memory,ENGRAM')"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:615:					mcp.Description("The canonical project name to merge INTO (e.g. 'engram')"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:638:		project, _ = store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:695:		normalized, normWarning := store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:861:		project, _ = store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:892:		project, _ = store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1040:		project, _ = store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1074:		project, _ = store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1108:		project, _ = store.NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:756:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:820:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:950:	p.Project, _ = NormalizeProject(p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1078:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1111:	p.Project, _ = NormalizeProject(p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1147:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1268:			project, _ = NormalizeProject(*p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1464:	opts.Project, _ = NormalizeProject(opts.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2449:	SourcesMerged       []string `json:"sources_merged"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2460:	canonical, _ = NormalizeProject(canonical)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2469:			src, _ = NormalizeProject(src)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2476:				return fmt.Errorf("merge observations %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2483:				return fmt.Errorf("merge sessions %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2490:				return fmt.Errorf("merge prompts %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2497:		// Enqueue sync mutations so cloud sync picks up the merged records.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3174:// NormalizeProject applies canonical project name normalization:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3179:func NormalizeProject(project string) (normalized string, warning string) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3485:	p.Project, _ = NormalizeProject(p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:907:func TestResolveToolsEmpty(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:908:	result := ResolveTools("")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:914:func TestResolveToolsAll(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:915:	result := ResolveTools("all")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:921:func TestResolveToolsAgentProfile(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:922:	result := ResolveTools("agent")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:928:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:929:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:930:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:952:func TestResolveToolsAdminProfile(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:953:	result := ResolveTools("admin")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:958:	expectedTools := []string{"mem_delete", "mem_stats", "mem_timeline", "mem_merge_projects"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:970:func TestResolveToolsCombinedProfiles(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:971:	result := ResolveTools("agent,admin")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:978:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:979:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:980:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:981:		"mem_update", "mem_delete", "mem_stats", "mem_timeline", "mem_merge_projects",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:990:func TestResolveToolsIndividualNames(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:991:	result := ResolveTools("mem_save,mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:996:	if !result["mem_save"] || !result["mem_search"] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:997:		t.Fatalf("expected mem_save and mem_search, got %v", result)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1005:func TestResolveToolsMixedProfileAndNames(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1006:	result := ResolveTools("admin,mem_save")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1011:	// Should have admin tools + mem_save
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1012:	if !result["mem_save"] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1013:		t.Error("missing mem_save")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1023:func TestResolveToolsAllInMixed(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1024:	result := ResolveTools("agent,all")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1030:func TestResolveToolsWhitespace(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1031:	result := ResolveTools("  agent  ")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1035:	if !result["mem_save"] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1036:		t.Error("agent profile should include mem_save")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1040:func TestResolveToolsCommaWhitespace(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1041:	result := ResolveTools("mem_save , mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1045:	if !result["mem_save"] || !result["mem_search"] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1050:func TestResolveToolsEmptyTokenBetweenCommas(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1051:	result := ResolveTools("mem_save,,mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1055:	if !result["mem_save"] || !result["mem_search"] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1056:		t.Fatalf("expected mem_save and mem_search in result, got %v", result)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1060:func TestResolveToolsAllAfterRealTool(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1061:	result := ResolveTools("mem_save,all")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1067:func TestResolveToolsOnlyCommas(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1068:	result := ResolveTools(",,,")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1075:	if !shouldRegister("anything", nil) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1081:	allowlist := map[string]bool{"mem_save": true, "mem_search": true}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1083:	if !shouldRegister("mem_save", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1084:		t.Error("mem_save should be allowed")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1086:	if shouldRegister("mem_delete", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1093:	allowlist := ResolveTools("agent")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1104:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1105:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1106:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1126:	allowlist := ResolveTools("admin")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1136:	adminTools := []string{"mem_delete", "mem_stats", "mem_timeline", "mem_merge_projects"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1144:	agentOnlyTools := []string{"mem_save", "mem_search", "mem_context", "mem_update"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1163:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1164:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1165:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1166:		"mem_update", "mem_delete", "mem_stats", "mem_timeline", "mem_merge_projects",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1182:	allowlist := ResolveTools("mem_save,mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1187:	if tools["mem_save"] == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1188:		t.Error("expected mem_save to be registered")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1190:	if tools["mem_search"] == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1191:		t.Error("expected mem_search to be registered")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1214:	for tool := range ProfileAgent {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1217:	for tool := range ProfileAdmin {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1226:	for tool := range ProfileAgent {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1227:		if ProfileAdmin[tool] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1240:	for _, keyword := range []string{"mem_save", "mem_search", "mem_context", "mem_session_summary"} {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1255:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1256:		"mem_get_observation", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1276:		"mem_update", "mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1277:		"mem_session_start", "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1279:		"mem_capture_passive", "mem_merge_projects",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1319:		"mem_search", "mem_context", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1320:		"mem_suggest_topic_key", "mem_stats", "mem_timeline",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1713:		t.Fatalf("expected merge result mentioning canonical project, got %q", text)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1726:		t.Fatalf("expected at least 2 observations after merge, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1771:	allowlist := ResolveTools("admin")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1775:	if tools["mem_merge_projects"] == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1776:		t.Fatal("mem_merge_projects should be in admin profile")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1780:	tool := tools["mem_merge_projects"]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1783:		t.Error("mem_merge_projects should be marked destructive")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1792:	tool := tools["mem_merge_projects"]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1794:		t.Fatal("mem_merge_projects should be registered")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1797:		t.Error("mem_merge_projects should have DeferLoading=true")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:876:	// First: agent saves actively via mem_save
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4011:// ─── Phase 2: project-name-drift — NormalizeProject, ListProjectNames,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4014:func TestNormalizeProjectFunction(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4033:			got, warning := NormalizeProject(tc.input)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4035:				t.Errorf("NormalizeProject(%q) name = %q, want %q", tc.input, got, tc.wantName)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4038:				t.Errorf("NormalizeProject(%q) expected a warning, got empty string", tc.input)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4041:				t.Errorf("NormalizeProject(%q) expected no warning, got %q", tc.input, warning)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4319:	// "engram-memory" is different → merged
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4322:	for _, merged := range result.SourcesMerged {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4323:		if merged == "engram" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4334:		t.Errorf("expected ≥4 observations under 'engram' after merge, got %d", len(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:4343:		t.Errorf("expected 0 observations under 'engram-memory' after merge, got %d", len(obsMerged))

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/research.md: No such file or directory

exec
/bin/zsh -lc "rg -n \"memory_context|memory_search|memory_match_triggers|generate-context|generate-context\\.js|session_bootstrap|shared_memory|shared_space|session_resume|session_health|lineage|history|archiv|passive|project scope|tenantId|sharedSpaceId|agentId|userId\" .opencode/skill/system-spec-kit/mcp_server" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:45:import { recordHistory } from './lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:46:import * as historyStore from './lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:79:import { runLineageBackfill } from './lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:107:// T059: Archival manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:108:import * as archivalManager from './lib/cognitive/archival-manager.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1024:        const { runPassiveEnrichment } = await import('./lib/enrichment/passive-enrichment.js');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1363:  runCleanupStep('archivalManager', () => archivalManager.cleanup());
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1439:        // Record DELETE history only after confirmed deletion.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1572:      historyStore,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1576:      archivalManager,
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1728:    // T059: Archival Manager for automatic archival of ARCHIVED state memories
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1730:      archivalManager.init(database);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1731:      // Start background archival job (scans every hour by default)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1732:      archivalManager.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1733:      if (archivalManager.isBackgroundJobRunning()) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1738:    } catch (archivalErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1739:      const message = archivalErr instanceof Error ? archivalErr.message : String(archivalErr);
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:223:| `SPECKIT_ARCHIVAL` | `true` | boolean | Archival manager for aging out stale memories (90-day max age). Graduated ON. | `lib/cognitive/archival-manager.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:265:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`, `shared-rollout`. | `lib/config/capability-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:32:type SharedAdminTool = SharedSpaceAdminTool | 'shared_memory_enable';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:108:        details: { reason: 'shared_memory_admin_unconfigured' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:123:        details: { reason: 'shared_memory_admin_ambiguous' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:214:  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:221:        reason: 'shared_space_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:239:        reason: 'shared_memory_trusted_binding_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:262:  tenantId: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:263:  sharedSpaceId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:266:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:267:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:268:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:271:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:272:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:273:    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:274:    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:282:    tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:291:    action: 'shared_space_admin',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:294:    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:310:    case 'shared_space_not_found':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:312:    case 'shared_space_create_admin_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:314:    case 'shared_space_tenant_mismatch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:316:    case 'shared_space_owner_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:320:    case 'shared_space_editor_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:322:    case 'shared_space_membership_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:324:    case 'shared_space_kill_switch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:326:    case 'shared_space_rollout_disabled':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:328:    case 'shared_space_tenant_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:336:  return reason === 'shared_space_membership_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:337:    ? 'shared_space_owner_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:349:    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:352:      hint: reason === 'shared_space_not_found'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:        : reason === 'shared_space_create_admin_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:363:    tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:385:    details: { reason: 'shared_memory_internal_error' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:408:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:416:    ? tenantId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:421:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:464:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:472:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:485:            buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:493:              tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:511:        const reason = 'shared_space_create_admin_required';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:514:          tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:533:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:566:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:573:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:606:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:655:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:660:        buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:669:            tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:704:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:724:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:773:        userId: actor.subjectType === 'user' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:774:        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:805:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:811:        'shared_memory_enable_admin_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:823:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:834:        tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:850:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:866:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:76:type CrudMutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:15:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:24:// Feature catalog: Per-memory history log
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:213:        // Record DELETE history after confirmed delete (no FK, history rows survive).
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:114:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:      agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:308:          shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:318:          if (userId && row.user_id !== userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:319:          if (agentId && row.agent_id !== agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:16:import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:19:import { recordHistory } from '../../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:27:// Feature catalog: Per-memory history log
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102:  const tenantId = normalizeScopeMatchValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:103:  const userId = normalizeScopeMatchValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:104:  const agentId = normalizeScopeMatchValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:118:      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:125:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:126:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:127:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:128:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:129:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:130:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:139: * Creates a memory row with metadata, optional BM25 entry, and save history.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:176:    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:177:    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:178:    const transitionEvent = lineageRouting.transitionEvent;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:261:      lineageRouting.causalSupersedesMemoryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:132:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:133:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:165:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:178:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:179:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:23:import { recordHistory } from '../../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:211:                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:212:                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:237:              // P1-01 fix — wrap all DB writes (index, metadata, BM25, history) in a
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:396:          // Auto-merge: archive the older memory record (shadow operation —
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:397:          // we mark is_archived so it is excluded from future search results
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:402:              SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:410:              `[reconsolidation-bridge] assistive auto-merge: archived older=${topId} ` +
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:415:            console.warn(`[reconsolidation-bridge] assistive auto-merge archive failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:  ['tenant_id', 'tenantId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:20:  ['user_id', 'userId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:  ['agent_id', 'agentId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:57:    tenantId: normalizeScopeMatchValue(scope.tenantId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:58:    userId: normalizeScopeMatchValue(scope.userId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:59:    agentId: normalizeScopeMatchValue(scope.agentId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:46:      userId: scope?.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:47:      agentId: scope?.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:36:import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1108:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1137:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1138:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1139:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1141:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1154:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1155:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1164:  if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1167:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1168:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1170:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1171:    }, sharedSpaceId, 'editor');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1176:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1177:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1178:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1180:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1181:        reason: access.reason ?? 'shared_space_denied',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1183:      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1267:    userId: governanceDecision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1268:    agentId: governanceDecision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1285:        tenantId: saveScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1286:        userId: saveScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1287:        agentId: saveScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1288:        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1466:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1467:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1469:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1474:      if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1478:          WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1486:            spaceId: sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:17:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:29:// Feature catalog: Per-memory history log
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:100:        // Record DELETE history after confirmed delete (no FK, history rows survive).
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:195:          // Record DELETE history after confirmed delete (no FK, history rows survive).
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:22:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:33:// Feature catalog: Per-memory history log
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:189:      // T-05: Record UPDATE history after successful mutation
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:7:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:8:import { recordLineageTransition } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:98:        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:99:        if (!matchesScopedValue(userId, r.user_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:100:        if (!matchesScopedValue(agentId, r.agent_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:300:export const handle_get_learning_history = lazyFunction(getSessionLearningModule, 'handle_get_learning_history');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:203:  includeArchived?: boolean; // REQ-206: include archived memories in search (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:520:    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:42:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:43:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:44:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:45:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:51:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:52:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:53:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:54:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:60:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:61:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:62:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:63:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:70:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:71:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:72:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:77:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:78:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:79:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:80:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:204:  const userId = validateValue(args.userId, 'userId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:205:  const agentId = validateValue(args.agentId, 'agentId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:206:  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:208:    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:212:    && tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:213:    && tenantId.trim().length === 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:215:    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:219:    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:220:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:221:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:222:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:230:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:237:    scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:238:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:250:    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:251:    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:268:    matchesScopeField('tenantId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:269:    matchesScopeField('userId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:270:    matchesScopeField('agentId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:271:    matchesScopeField('sharedSpaceId')
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:280:  if (scope.userId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:281:    details.userId = scope.userId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:  if (scope.agentId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:284:    details.agentId = scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:297:    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:4:// T018: MCP tool handler for session_health — reports session
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65:/** Handle session_health tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:160:      producer: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:161:      sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:170:    sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:20:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:264:          // Record DELETE history only after confirmed deletion.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:37:- `session-learning.ts` - Task preflight, postflight, and learning history handlers.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:56:- `pe-gating.ts` - Prediction-error save arbitration helpers, document weighting, and lineage-aware update paths.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:69:- `pe-gating.ts` now leans on `lib/storage/document-helpers.ts` for document-aware weights and keeps content-hash-aware update paths aligned with lineage and incremental-index state.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:22:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:203:            // Record DELETE history only after confirmed deletion.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:413:              // Record DELETE history only after confirmed deletion.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:428:              // Record DELETE history only after confirmed deletion.
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:535:        const archivePlaceholders = oldChildIds.map(() => '?').join(', ');
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:540:          WHERE id IN (${archivePlaceholders})
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:70:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:71:      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:72:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:73:      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:173:        description: 'Include archived memories in search results. Default: false (archived excluded).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:201:      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:202:      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:203:      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:204:      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220:  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:233:  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:335:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:336:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:337:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:338:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:353:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:354:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:355:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:356:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:370:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:371:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:372:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:373:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:388:      tenantId: { type: 'string', minLength: 1, description: 'Tenant boundary for governed checkpoint scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:389:      userId: { type: 'string', minLength: 1, description: 'Scope to this user (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:390:      agentId: { type: 'string', minLength: 1, description: 'Scope to this agent (optional, defense-in-depth)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:391:      sharedSpaceId: { type: 'string', minLength: 1, description: 'Scope to this shared space (requires tenantId).' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:403:  name: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:410:      tenantId: { type: 'string', description: 'Owning tenant for the shared space.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:420:    required: ['spaceId', 'tenantId', 'name'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:425:  name: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:432:      tenantId: { type: 'string', description: 'Tenant boundary for the membership mutation.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:439:    required: ['spaceId', 'tenantId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:450:      tenantId: { type: 'string', description: 'Optional tenant filter applied to the authenticated caller scope.' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:459:  name: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:469:// L6: Analysis - Deep inspection and lineage (Token Budget: 1200)
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:485:  description: '[L6:Analysis] Trace causal chain for a memory to answer "why was this decision made?" Traverses causal edges up to maxDepth hops, grouping results by relationship type (caused, enabled, supersedes, contradicts, derived_from, supports). Use to understand decision lineage and memory relationships. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:487:  inputSchema: { type: 'object', additionalProperties: false, properties: { memoryId: { type: 'string', description: 'Memory ID to trace causal lineage for (number or string, required)' }, maxDepth: { type: 'number', default: 3, minimum: 1, maximum: 10, description: 'Maximum traversal depth (default: 3, max: 10)' }, direction: { type: 'string', description: 'Traversal direction: outgoing, incoming, or both (default: both)' }, relations: { type: 'array', items: { type: 'string' }, description: 'Filter to specific relationship types: caused, enabled, supersedes, contradicts, derived_from, supports' }, includeMemoryDetails: { type: 'boolean', default: true, description: 'Include full memory details in results' } }, required: ['memoryId'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:492:  description: '[L6:Analysis] Create a causal relationship between two memories. Links represent decision lineage (caused, enabled), versioning (supersedes), contradictions, derivation, or support. Token Budget: 1200.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:568:  name: 'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:569:  description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:570:  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733:  name: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:16:// Feature catalog: Learning history (memory_get_learning_history)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:659:/** Handle memory_get_learning_history tool - retrieves learning records with optional summary stats */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:831:      ? `Learning history: ${learningHistory.length} records (${completedCount} complete)`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:832:      : `Learning history: ${learningHistory.length} preflight records`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:843:      tool: 'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:855:    console.error('[session-learning] Failed to get learning history:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:856:    throw new MemoryError(ErrorCodes.DATABASE_ERROR, 'Failed to retrieve learning history', { originalError: message });
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:874:const handle_get_learning_history = handleGetLearningHistory;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:880:  handle_get_learning_history,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:24:const SPEC_DOC_EXCLUDE_DIRS = new Set(['scratch', 'memory', 'node_modules', 'iterations', 'z_archive']);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:78:│  Causal lineage      Adaptive fusion    Extended telemetry      │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:90:│ Docs         │ │ (memory lineage) │ │ code-graph.sqlite          │
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:436:- `session_health` (session readiness check)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:586:- Causal traversal augments memory retrieval for lineage/"why" queries
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:93:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:94:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:102:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:103:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:104:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:159:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:160:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:331:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:332:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:333:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:351:    tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:352:    userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:353:    agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:358:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361:  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:362:  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:363:    return 'tenantId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:366:  const requestedUserId = normalizeIdentityValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:367:  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:368:    return 'userId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:371:  const requestedAgentId = normalizeIdentityValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:372:  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:373:    return 'agentId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:380:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:381:): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:382:  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1030:    const tenantId = normalizeIdentityValue(state.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1031:    const userId = normalizeIdentityValue(state.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1032:    const agentId = normalizeIdentityValue(state.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1064:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1065:      userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1066:      agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1150:      tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1151:      userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1152:      agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1167:      tenantId: storedIdentity.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1168:      userId: storedIdentity.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1169:      agentId: storedIdentity.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1209:        tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1210:        userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1211:        agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:104:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:105:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:106:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:107:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:123:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:124:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:125:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:126:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:160:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:161:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:162:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:163:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:169:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:170:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:171:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:172:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:187:  tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:188:  userId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:189:  agentId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:191:  sharedSpaceId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:268:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:269:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:270:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:271:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:277:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:278:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:280:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:286:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:287:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:288:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:289:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:295:  tenantId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:296:  userId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:297:  agentId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:298:  sharedSpaceId: z.string().min(1).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:422:  memory_get_learning_history: memoryGetLearningHistorySchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:426:  shared_space_upsert: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:428:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:436:  shared_space_membership_set: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:438:    tenantId: z.string(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:446:    tenantId: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:450:  shared_memory_enable: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:454:  session_health: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:464:  memory_quick_search: ['query', 'limit', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:474:  checkpoint_create: ['name', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'metadata'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:475:  checkpoint_list: ['specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:476:  checkpoint_restore: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'clearExisting'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:477:  checkpoint_delete: ['name', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'confirmName'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:487:  memory_get_learning_history: ['specFolder', 'sessionId', 'limit', 'onlyComplete', 'includeSummary'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:491:  shared_space_upsert: ['spaceId', 'tenantId', 'name', 'actorUserId', 'actorAgentId', 'rolloutEnabled', 'rolloutCohort', 'killSwitch'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:492:  shared_space_membership_set: ['spaceId', 'tenantId', 'actorUserId', 'actorAgentId', 'subjectType', 'subjectId', 'role'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:494:  shared_memory_enable: [],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:496:  session_health: [],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:47:Spec Kit Memory is a Model Context Protocol (MCP) server that gives AI assistants persistent memory. It stores decisions, code context and project history in a local SQLite database, then finds exactly what is relevant when you need it. Think of it like a personal librarian that keeps notes on every conversation, files them by topic and hands you the right ones when you start a new task.
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:573:| `tenantId` | string | Tenant boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:574:| `userId` | string | User boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:575:| `agentId` | string | Agent boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:576:| `sharedSpaceId` | string | Shared-space boundary for governed retrieval |
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:631:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:632:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:633:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:634:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:666:| `tenantId` | string | Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:667:| `userId` | string | User boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:668:| `agentId` | string | Agent boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:669:| `sharedSpaceId` | string | Shared-memory boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:713:| `tenantId` | string | Governance: tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:714:| `userId` | string | Governance: user attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:715:| `agentId` | string | Governance: agent attribution |
.opencode/skill/system-spec-kit/mcp_server/README.md:716:| `sharedSpaceId` | string | Governance: shared-space target |
.opencode/skill/system-spec-kit/mcp_server/README.md:777:##### `session_health`
.opencode/skill/system-spec-kit/mcp_server/README.md:891:##### `shared_space_upsert`
.opencode/skill/system-spec-kit/mcp_server/README.md:893:Create or update a shared-memory space. Shared spaces start locked: nobody can read or write until you add members with `shared_space_membership_set`. The person or agent who creates the space automatically becomes its owner.
.opencode/skill/system-spec-kit/mcp_server/README.md:898:| `tenantId` | string | **Required.** Tenant scope |
.opencode/skill/system-spec-kit/mcp_server/README.md:908:##### `shared_space_membership_set`
.opencode/skill/system-spec-kit/mcp_server/README.md:915:| `tenantId` | string | **Required.** Tenant boundary |
.opencode/skill/system-spec-kit/mcp_server/README.md:924:##### `shared_memory_status`
.opencode/skill/system-spec-kit/mcp_server/README.md:930:| `tenantId` | string | Filter by tenant |
.opencode/skill/system-spec-kit/mcp_server/README.md:931:| `userId` | string | Filter by user |
.opencode/skill/system-spec-kit/mcp_server/README.md:932:| `agentId` | string | Filter by agent |
.opencode/skill/system-spec-kit/mcp_server/README.md:936:##### `shared_memory_enable`
.opencode/skill/system-spec-kit/mcp_server/README.md:998:Connect two memories with a causal relationship. Use this to build decision lineage ("this refactor was caused by that bug report").
.opencode/skill/system-spec-kit/mcp_server/README.md:1107:##### `memory_get_learning_history`
.opencode/skill/system-spec-kit/mcp_server/README.md:1264:| L7 | Maintenance | 10 | 1,000 | Re-index files, review history, run bulk imports |
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1496:{ "tool": "shared_memory_enable", "arguments": {} }
.opencode/skill/system-spec-kit/mcp_server/README.md:1501:  "tool": "shared_space_upsert",
.opencode/skill/system-spec-kit/mcp_server/README.md:1504:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1515:  "tool": "shared_space_membership_set",
.opencode/skill/system-spec-kit/mcp_server/README.md:1518:    "tenantId": "acme",
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1646:| Shared memory not working | Call `shared_memory_enable` first, then create a space with an actor identity |
.opencode/skill/system-spec-kit/mcp_server/README.md:1705:Yes, through shared memory. Call `shared_memory_enable`, create a space with `shared_space_upsert` and grant access with `shared_space_membership_set`. Spaces are deny-by-default and the first creator becomes owner. See [SHARED_MEMORY_DATABASE.md](../SHARED_MEMORY_DATABASE.md) for the full guide.
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:33:- `shared_memory_enable` bootstraps the shared-memory subsystem and generates this README if it is missing.
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:41:| `shared_memory_enable` | First-run bootstrap and idempotent enablement |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:42:| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:43:| `shared_space_upsert` | Create or update a shared space; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:44:| `shared_space_membership_set` | Set deny-by-default membership for a user or agent; requires caller auth and tenant scope |
.opencode/skill/system-spec-kit/mcp_server/shared-spaces/README.md:50:`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:110:// T018: Session-level tracking for prime package and session_health
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:680:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:465:    // Filters: is_archived exclusion and spec_folder matching handled by fts5Bm25Search
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1808:    // H13 FIX: Exclude archived rows unless explicitly requested
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1810:      `(importance_tier IS NULL OR importance_tier NOT IN ('deprecated', 'archived'))`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1811:      `(is_archived IS NULL OR is_archived = 0)`
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:674:        lineageState: t.architecture.capabilities.lineageState,
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:12:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:36:/** Persistence table for negative-validation history. */
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:86:        tenantId: validated.tenantId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:87:        userId: validated.userId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:88:        agentId: validated.agentId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:89:        sharedSpaceId: validated.sharedSpaceId as string | undefined,
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:29:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:30:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:31:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:32:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:49:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:50:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:51:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:52:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:156:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:157:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:158:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:160:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:179:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:190:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:199:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:219:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:220:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:221:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:222:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:229:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:230:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:231:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:232:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:239:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:240:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:241:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:242:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:249:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:250:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:251:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:252:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:279:/** Arguments for learning history requests. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:139:    const archived = row.is_archived ?? row.isArchived;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:140:    if (archived == null) return true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:141:    if (typeof archived === 'number') return archived === 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:142:    if (typeof archived === 'boolean') return archived === false;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:484:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:485:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:486:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:487:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:980:    tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:981:    || userId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:982:    || agentId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:983:    || sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:987:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:988:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:989:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:990:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1259:            const archiveFilteredSummaryHits = applyArchiveFilter(newSummaryHits, includeArchived);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1260:            const folderFilteredSummaryHits = applyFolderFilter(archiveFilteredSummaryHits, specFolder);
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:5:// Postflight, learning_history (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:50:  'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:56:  'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:57:  'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:59:  'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:60:  'session_health',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:71:    case 'memory_get_learning_history': return handleGetLearningHistory(parseArgs<LearningHistoryArgs>(validateToolArgs('memory_get_learning_history', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:77:    case 'shared_space_upsert':        return handleSharedSpaceUpsert(parseArgs<SharedSpaceUpsertArgs>(validateToolArgs('shared_space_upsert', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:78:    case 'shared_space_membership_set': return handleSharedSpaceMembershipSet(parseArgs<SharedSpaceMembershipArgs>(validateToolArgs('shared_space_membership_set', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:80:    case 'shared_memory_enable':       return handleSharedMemoryEnable(parseArgs<Record<string, unknown>>(validateToolArgs('shared_memory_enable', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:81:    case 'session_health':             return handleSessionHealth();
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/cli.ts:27:type HistoryModule = Awaited<typeof import('./lib/storage/history.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:38:let _history: HistoryModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:74:  return _history ??= await import('./lib/storage/history.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:281:  const [vectorIndex, checkpointsLib, mutationLedger, triggerMatcher, causalEdges, history] = await Promise.all([
.opencode/skill/system-spec-kit/mcp_server/cli.ts:390:        // Record DELETE history only after confirmed deletion.
.opencode/skill/system-spec-kit/mcp_server/cli.ts:392:          history.recordHistory(memory.id, 'DELETE', null, null, 'mcp:cli_bulk_delete', memory.spec_folder ?? null);
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:30:- `checkpoint-tools.ts` - dispatch for checkpoints and learning-history style lifecycle helpers.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:236:  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:271:| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:128:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:129:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:130:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:131:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:166:    CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:452:        shared_space_id: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:463:        shared_space_id: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:474:        shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:479:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:480:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:481:      sharedSpaceId: 'space-a',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:53:    hasArchivedColumn: columnSet.has('is_archived'),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:62:    predicates.push(`COALESCE(${alias}.is_archived, 0) = 0`);
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:145: * Run the passive enrichment pipeline on a tool response.
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:196:      console.warn(`[passive-enrichment] Exceeded deadline: ${latencyMs}ms > ${deadlineMs}ms`);
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:202:    console.warn(`[passive-enrichment] Pipeline error (non-fatal): ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:62:vi.mock('../lib/storage/history', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:114:  it('returns the merged survivor id instead of the archived predecessor id', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:152:  it('removes archived assistive auto-merge documents from the BM25 singleton', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:153:    const archiveRun = vi.fn();
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:155:      prepare: vi.fn(() => ({ run: archiveRun })),
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:192:    expect(archiveRun).toHaveBeenCalledWith(55);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:159:  db.prepare(`DELETE FROM memory_lineage WHERE memory_id IN (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:163:  // Delete history rows before memory_index to satisfy FK constraint
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:164:  db.prepare(`DELETE FROM memory_history WHERE memory_id IN (
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:8:import * as mod from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:9:import type { HistoryEntry } from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:30:    dbPath = path.join(os.tmpdir(), `history-test-${Date.now()}.sqlite`);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:48:    // Create memory_history table with legacy constraints to test migration
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:50:      CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:71:      INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, actor)
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:111:      const row = activeDb.prepare('SELECT prev_value, new_value, actor, spec_folder FROM memory_history WHERE id = ?').get(id) as {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:124:    it('T508-01c: undefined history payloads normalize to null values', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:127:      const row = activeDb.prepare('SELECT prev_value, new_value, actor FROM memory_history WHERE id = ?').get(id) as {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:146:      const history = mod.getHistory(1);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:147:      expect(Array.isArray(history)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:148:      expect(history.length).toBeGreaterThanOrEqual(3);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:152:      const history = mod.getHistory(1);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:153:      expect(history.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:155:      const entry = history[0];
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:183:      const history = mod.getHistory(1);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:184:      expect(history.length).toBeGreaterThanOrEqual(2);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:186:      for (let i = 0; i < history.length - 1; i++) {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:187:        expect(history[i].timestamp >= history[i + 1].timestamp).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:233:      const row = activeDb.prepare('SELECT spec_folder FROM memory_history WHERE id = ?').get(id) as {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:248:        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, actor)
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:265:    it('T508-05f: getHistoryStats counts legacy null-folder rows after memory deletion when earlier history captured the folder', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:275:        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, actor)
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:300:        "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:311:      const history = mod.getHistory(1);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:312:      const entry = history.find((h: HistoryEntry) => h.id === id);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:321:      const history = mod.getHistory(3);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:322:      const entry = history.find((h: HistoryEntry) => h.id === id);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:327:    it('T508-06d: migration preserves existing history rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:331:        FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:369:      const history = mod.getHistory(2);
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:370:      const entry = history.find((h: HistoryEntry) => h.id === id);
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:69:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:70:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:71:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:72:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:103:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:104:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:105:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:106:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:124:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:125:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:126:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:127:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:200:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:201:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:202:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:203:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:211:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:425:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:426:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:427:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:428:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:453:    tenantId: normalizeScopeValue(tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:454:    userId: normalizeScopeValue(userId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:455:    agentId: normalizeScopeValue(agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:456:    sharedSpaceId: normalizeScopeValue(sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:460:    ['tenant_id', requestedScope.tenantId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:461:    ['user_id', requestedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:462:    ['agent_id', requestedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:463:    ['shared_space_id', requestedScope.sharedSpaceId],
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:471:      shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:477:      tenantId: duplicate.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:478:      userId: duplicate.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:479:      agentId: duplicate.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:480:      sharedSpaceId: duplicate.shared_space_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:483:      existingScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:484:      existingScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:485:      existingScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:486:      existingScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:529:        SELECT id, file_path, content_text, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:541:        shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:572:        tenantId: requestedScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:573:        userId: requestedScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:574:        agentId: requestedScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:575:        sharedSpaceId: requestedScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:586:          shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:759:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:760:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:761:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:762:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:853:      { content, spec_folder, database, find_similar, embedding, tenantId, userId, agentId, sharedSpaceId },
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:537:        caveat = 'Forecast is low-confidence because queue history is still sparse or noisy.';
.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts:540:      caveat = 'Forecast unavailable because throughput could not be derived from queue history.';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:22:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:23:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:24:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:26:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:45:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:46:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:47:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:49:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:77: * Filters used to review governance audit history.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:160:    tenantId: normalizeId(input.tenantId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:161:    userId: normalizeId(input.userId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:162:    agentId: normalizeId(input.agentId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:164:    sharedSpaceId: normalizeId(input.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:173: * is configured with tenantId/userId/agentId/sharedSpaceId in queries.
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:235:        tenantId: scope.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:236:        userId: scope.userId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:237:        agentId: scope.agentId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:239:        sharedSpaceId: scope.sharedSpaceId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:250:  if (!scope.tenantId) issues.push('tenantId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:252:  if (!scope.userId && !scope.agentId) issues.push('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:269:      tenantId: scope.tenantId ?? '',
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:270:      userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:271:      agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:273:      sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:291:    tenant_id: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:292:    user_id: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:293:    agent_id: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:295:    shared_space_id: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:302:      tenantId: decision.normalized.tenantId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:303:      userId: decision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:304:      agentId: decision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:306:      sharedSpaceId: decision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:338:      shared_space_id, reason, metadata
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:345:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:346:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:347:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:349:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:368:    scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:369:    || scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:370:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:371:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:409:  if (normalized.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:411:    params.push(normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:413:  if (normalized.userId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:415:    params.push(normalized.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:417:  if (normalized.agentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:419:    params.push(normalized.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:425:  if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:426:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:427:    params.push(normalized.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:441:    || normalized.tenantId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:442:    || normalized.userId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:443:    || normalized.agentId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:445:    || normalized.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:470:    const rowSharedSpaceId = normalizeId(row.shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:472:      if (normalized.sharedSpaceId && rowSharedSpaceId !== normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:478:    } else if (normalized.sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:486:      return matchesExactScope(row.tenant_id, normalized.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:489:    return matchesExactScope(row.tenant_id, normalized.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:490:      && matchesExactScope(row.user_id, normalized.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:491:      && matchesExactScope(row.agent_id, normalized.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:539:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:557:    shared_space_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:606:      tenantId: row.tenant_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:607:      userId: row.user_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:608:      agentId: row.agent_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:610:      sharedSpaceId: row.shared_space_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts:22:    CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:38:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:71:    INSERT INTO memory_index (title, trigger_phrases, spec_folder, parent_id, importance_tier, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:238:  it('ignores archived and deprecated siblings that are no longer retrievable', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:246:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:364:  it('skips archived and deprecated rows during batch scoring', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:377:      title: 'authentication login session token validation handler middleware security user access archived',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:13:import { recordHistory } from '../storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:227:    where_clauses.push('(m.is_archived IS NULL OR m.is_archived = 0)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:360:  const archival_filter = !includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : '';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:383:        ${archival_filter}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:643:    where_clause += ' AND (is_archived IS NULL OR is_archived = 0)';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1396:        // (lineage, projections, graph residue) instead of raw DELETE.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts:1403:            logger.warn('Failed to record integrity-check delete history', {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:118:vi.mock('../lib/storage/history', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator.vitest.ts:121:      CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:35:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:61:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:147:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:182: * Tier 2: Database config persistence — `shared_memory_enabled` key in `config` table.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:200:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:204:      console.warn(`[shared-spaces] Failed to resolve shared_memory_enabled config: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:219:    .run('shared_memory_enabled', 'true');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:235: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:238:export function getSharedRolloutMetrics(database: Database.Database, tenantId?: string): SharedRolloutMetrics {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:240:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:252:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:264:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:265:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:271:    FROM shared_space_conflicts c
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:272:    JOIN shared_spaces s ON s.space_id = c.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:277:    tenantId: normalizedTenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:292: * @param tenantId - Optional tenant to constrain the summary.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:297:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:300:  const normalizedTenantId = normalizeScopeContext({ tenantId }).tenantId ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:303:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:315:    FROM shared_spaces s
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:316:    LEFT JOIN shared_space_members m ON m.space_id = s.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:378:    FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:397:  if (!definition.spaceId?.trim() || !definition.tenantId?.trim()) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:398:    throw new Error('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:430:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:436:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:457:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:469:    definition.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:492:    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:514:  if (!normalizedScope.tenantId) return new Set();
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:518:    ['user', normalizedScope.userId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:519:    ['agent', normalizedScope.agentId],
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:526:      FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:527:      JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:536:      normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:569:        action: 'shared_space_access',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:572:        tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:573:        userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:574:        agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:576:        sharedSpaceId: spaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:584:      console.error(`[shared-spaces] Failed to record shared_space_access audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:597:    return deny('shared_space_id_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:603:    return deny('shared_memory_disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:608:    FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:613:    return deny('shared_space_not_found');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:615:  if (normalizedScope.tenantId && space.tenant_id !== normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:616:    return deny('shared_space_tenant_mismatch', {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:620:  if (isGovernanceGuardrailsEnabled() && !normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:621:    return deny('shared_space_tenant_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:626:    return deny('shared_space_kill_switch');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:629:    return deny('shared_space_rollout_disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:634:    return deny('shared_space_membership_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:643:    FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:656:  `).get(spaceId, normalizedScope.userId ?? '', normalizedScope.agentId ?? '') as { role?: SharedRole } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:660:    return deny('shared_space_membership_required');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:663:    return deny('shared_space_owner_required', { resolvedRole: role });
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:666:    return deny('shared_space_editor_required', { resolvedRole: role });
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:695:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:713:      sharedSpaceId: args.spaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:183:  const archivalFilter = !includeArchived
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:184:    ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)'
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:202:      ${archivalFilter}
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:124:    /decision\s+(?:record|log|history)/i,
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:240:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:243:describe('memory_search limit contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:246:      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:252:      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:258:      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:264:      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:270:      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:276:      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:282:      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:288:      validateToolArgs('memory_search', { concepts: ['solo'] });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:292:  it('public schema rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:294:      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:300:      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:304:  it('runtime rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:306:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:312:      validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:315:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:316:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:317:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:339:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:340:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:341:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:342:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:367:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:368:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:369:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:382:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:383:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:384:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:385:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:409:  it('runtime accepts exactly one actor identity for shared_space_upsert', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:411:      validateToolArgs('shared_space_upsert', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:413:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:420:  it('handler auth rejects shared_space_upsert when actor identity is omitted', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:425:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:430:  it('handler auth rejects shared_space_membership_set when both actor identities are provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:435:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:457:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:6:import { getHistory, init as initHistory } from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:84:      AND (m.is_archived IS NULL OR m.is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:123:        is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:154:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:166:      CREATE TABLE IF NOT EXISTS memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:207:    testDb.exec('DELETE FROM memory_lineage');
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:421:      // F04-001: Append-only merge — old row (id=100) is archived, new row holds merged content.
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:422:      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 100').get() as {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:423:        is_archived: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:425:      expect(oldRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:460:      const oldRow = testDb.prepare('SELECT is_archived FROM memory_index WHERE id = 101').get() as {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:461:        is_archived: number;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:463:      expect(oldRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:496:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:497:        'SELECT is_archived FROM memory_index WHERE id = 102'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:498:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:499:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:514:    it('MP4: Keeps merged survivor reachable through active projection and hides archived predecessor', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:571:      const archivedRow = testDb.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:572:        SELECT is_archived
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:575:      `).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:576:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:580:        FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:701:        SELECT id, is_archived, content_text
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:704:      `).all() as Array<{ id: number; is_archived: number; content_text: string | null }>;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:706:        { id: 105, is_archived: 0, content_text: 'Concurrent writer content' },
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:744:      const archivedRow = testDb.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:745:        SELECT is_archived
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:748:      `).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:749:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:929:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:930:        'SELECT is_archived FROM memory_index WHERE id = 400'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:931:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:932:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1049:      const archivedRow = testDb.prepare(
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1050:        'SELECT is_archived FROM memory_index WHERE id = 450'
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1051:      ).get() as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:1052:      expect(archivedRow.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:91:    description: 'Deep inspection and causal analysis. Use to understand relationships and lineage.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:94:    useCase: 'Trace decision history, understand memory relationships, measure learning.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:114:    useCase: 'Re-index memories, view learning history, perform bulk operations.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:115:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:103:      const history = getSelectionHistory();
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:104:      expect(history).toHaveLength(3);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:112:      const history = getSelectionHistory('q1');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:113:      expect(history).toHaveLength(2);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:114:      expect(history.every(s => s.queryId === 'q1')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:121:      const history = getSelectionHistory('q1');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:123:      expect(history[0].id).toBeGreaterThan(history[1].id);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:131:      const history = getSelectionHistory(undefined, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:132:      expect(history).toHaveLength(5);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:145:      const history = getSelectionHistory('q1');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:146:      expect(history).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:148:      const sel = history[0];
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:160:      const history = getSelectionHistory('nonexistent');
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth-feedback.vitest.ts:161:      expect(history).toHaveLength(0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:130:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:274:        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:275:        '/archive/specs/002-feature/memory/implementation-notes.md.bak',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:383:           AND COALESCE(is_archived, 0) = 0`
.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:431:         WHERE COALESCE(is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:73:    { id: 905, content: 'Memory archival operations and retention policies for old sessions. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:606: * @param includeArchived - Whether archived memories should be included.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:614:  // Scope cache entries to the active DB path as well as the archived filter.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:637:        ${!includeArchived ? 'AND (m.is_archived IS NULL OR m.is_archived = 0)' : ''}
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:679:    const scoped_suffix_archived = `::${spec_folder}:arch`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:682:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:687:      if (key.endsWith(scoped_suffix_archived) || key.endsWith(scoped_suffix_live)) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:715:         AND COALESCE(m.is_archived, 0) = 0
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:39:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:45:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:46:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:58:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:59:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:63:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:64:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:74:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:85:    expect(getAllowedSharedSpaceIds(db, { userId: 'user-1' })).toEqual(new Set());
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:94:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:106:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:117:      tenantId: 'tenant-A',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:129:      tenantId: 'tenant-B',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:130:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:139:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:140:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:143:      reason: 'shared_space_id_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:152:      action: 'shared_space_access',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:154:      reason: 'shared_space_id_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:164:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:182:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:183:      userId: 'user-editor',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:186:      reason: 'shared_space_owner_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:190:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:191:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:203:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:222:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:223:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:228:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:229:      userId: 'user-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:230:      agentId: 'agent-mixed',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:253:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:256:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:260:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:261:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:267:      SELECT decision, reason, tenant_id, user_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:269:      WHERE action = 'shared_space_access'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:274:        reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:277:        shared_space_id: 'space-audit',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:284:        shared_space_id: 'space-audit',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:294:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:301:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:307:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:322:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:343:      userId: 'user-owner',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:349:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:350:      userId: 'user-viewer',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:353:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:357:    expect(consoleErrorSpy.mock.calls[0]?.[0]).toContain('Failed to record shared_space_access audit');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:378:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:379:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:385:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:392:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:393:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:397:      reason: 'shared_space_kill_switch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:399:    expect(Array.from(getAllowedSharedSpaceIds(db, { userId: 'user-2' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:408:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:421:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:422:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:425:      reason: 'shared_space_rollout_disabled',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:427:    expect(Array.from(getAllowedSharedSpaceIds(db, { agentId: 'agent-1' }))).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:435:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:437:    })).toThrow('E_VALIDATION: spaceId and tenantId must be non-empty strings');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:453:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:459:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:477:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:478:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:482:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:483:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:486:      reason: 'shared_space_tenant_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:496:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:512:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:524:      SELECT action, decision, memory_id, logical_key, shared_space_id, reason
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:533:      shared_space_id: 'space-4',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:544:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:574:      FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:608:      WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:644:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:651:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:658:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:665:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:720:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:753:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:766:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:779:      INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:835:      .get('shared_memory_enabled') as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:72:  'is_archived',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:148:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:169:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:170:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:171:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:179:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:180:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:181:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:182:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:189:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:190:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:191:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:192:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:195:            tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:196:            userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:197:            agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:198:            sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:209:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:216:    it('T521-C9: whitespace-only tenantId is rejected when actor scope is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:219:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:220:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:221:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:277:          metadata: { userId: 'user-1', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:286:          metadata: { userId: 'user-2', sharedSpaceId: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:291:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:292:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:293:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:300:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:301:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:302:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:310:      const response = await handler.handleCheckpointList({ userId: 'user-1' });
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:411:        metadata: JSON.stringify({ userId: 'user-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:417:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:418:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:433:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:520:        metadata: JSON.stringify({ sharedSpaceId: 'space-2' }),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:527:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:528:          sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:544:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-metadata.vitest.ts:310:    expect(typeOf('session-history')).toBe('session-history');
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:29:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:75:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:76:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:106:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:107:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:110:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:111:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:300:            shared_space_id: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:308:            shared_space_id: 'shared-2',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:318:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:319:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:320:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:321:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:16:    shared_space_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:28:    shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:68:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:96:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:116:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:123:    expect(envelope.data.details?.reason).toBe('shared_memory_admin_unconfigured');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:131:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:140:    expect(envelope.data.details?.reason).toBe('shared_memory_trusted_binding_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:146:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:158:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:170:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:180:        && sql.includes('FROM shared_spaces')
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:191:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:203:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:209:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:221:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:229:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:244:      if (sql.includes('INSERT INTO shared_space_members')) {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:252:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:263:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:271:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:277:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:286:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:293:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:299:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:305:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:314:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:326:      FROM shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:336:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:342:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:351:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:360:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:366:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:386:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:401:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:415:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:423:    expect(envelope.data.details?.reason).toBe('shared_space_create_admin_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:430:    const actor = resolveAdminActor('shared_space_upsert');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:444:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:452:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:461:      FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:471:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:478:      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:480:      WHERE action = 'shared_space_admin'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:489:      shared_space_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:493:    expect(auditRow.action).toBe('shared_space_admin');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:498:    expect(auditRow.shared_space_id).toBe('space-audit-success');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:511:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:518:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:526:      UPDATE shared_space_members
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:531:      INSERT INTO shared_space_members (space_id, subject_type, subject_id, role)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:537:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:546:    expect(envelope.data.details?.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:549:      SELECT action, decision, reason, tenant_id, user_id, shared_space_id, metadata
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:551:      WHERE action = 'shared_space_admin'
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:560:      shared_space_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:564:    expect(auditRow.action).toBe('shared_space_admin');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:566:    expect(auditRow.reason).toBe('shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:569:    expect(auditRow.shared_space_id).toBe('space-owner-only');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:584:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:590:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:599:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:608:    expect(envelope.data.details?.reason).toBe('shared_space_tenant_mismatch');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:618:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:637:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:650:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:657:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:664:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:672:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:679:    expect(envelope.data.userId).toBe('user-other');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:680:    expect(envelope.data.agentId).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:711:    expect(envelope.data.details?.reason).toBe('shared_memory_enable_admin_required');
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:39:| **Traceable** | Full correction history with undo capability |
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:63:| `corrections.ts` | Correction types, stability adjustments, history tracking |
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:95:| `get_corrections_for_memory(id)` | Get correction history for a memory |
.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md:181:const history = get_corrections_for_memory(5, { include_undone: false });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:335: * All weight changes are logged to weight_history via updateEdge().
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:173:              tenantId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:174:              userId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:175:              agentId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:203:              tenant_id: tenantId ?? existing?.tenant_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:204:              user_id: userId ?? existing?.user_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:205:              agent_id: agentId ?? existing?.agent_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:414:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:415:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:416:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:607:        tenantId: 'tenant-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:608:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:609:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:694:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:695:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:696:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:712:        tenantId: 'tenant-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:713:        userId: 'user-z',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:714:        agentId: 'agent-z',
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:199:| `fix_bug`        | Debugging issues             | Error history, root cause, patches  |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:450:| v2      | Add `idx_history_timestamp` index on `memory_history`                        |
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:926:- `../storage/README.md`: Storage layer (checkpoints, history, access tracking)
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:29:  { tool: 'memory_get_learning_history', handler: 'handleGetLearningHistory', layer: 'L7' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:48:  { camel: 'handleGetLearningHistory', snake: 'handle_get_learning_history' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:19:import { init as initHistory } from '../storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:24:// Feature catalog: Per-memory history log
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:47:const MEMORY_LINEAGE_TABLE = 'memory_lineage';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:49:const LEGACY_MEMORY_LINEAGE_TABLE = 'hydra_memory_lineage';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:130:    shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:419:// V18: the rollout — weight_history table + causal_edges provenance + encoding_intent column
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:423:// V22: Step 2 memory lineage tables + active projection support
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:445:      // V1 -> v2: Add idx_history_timestamp index
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:447:        database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:448:        logger.info('Migration v2: Created idx_history_timestamp index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:918:          CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:928:        database.exec('CREATE INDEX IF NOT EXISTS idx_weight_history_edge ON weight_history(edge_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:929:        database.exec('CREATE INDEX IF NOT EXISTS idx_weight_history_time ON weight_history(changed_at DESC)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:930:        logger.info('Migration v18: Created weight_history table (T001d)');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:933:          console.warn('[VectorIndex] Migration v18 warning (weight_history):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1083:      logger.info('Migration v22: Created memory lineage tables and indexes');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1086:        console.warn('[VectorIndex] Migration v22 warning (memory lineage):', get_error_message(e));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1293:    CREATE TABLE IF NOT EXISTS memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1310:  const lineageTableInfo = database.prepare(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1311:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_lineage'"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1313:  if (lineageTableInfo?.sql && (!lineageTableInfo.sql.includes("'UPDATE'") || lineageTableInfo.sql.includes('FOREIGN KEY'))) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1315:      ALTER TABLE memory_lineage RENAME TO memory_lineage_old;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1316:      CREATE TABLE memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1331:      INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1338:      FROM memory_lineage_old;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1339:      DROP TABLE memory_lineage_old;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1345:      INSERT OR IGNORE INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1352:      FROM hydra_memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1393:    CREATE INDEX IF NOT EXISTS idx_memory_lineage_logical_key
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1394:      ON memory_lineage(logical_key, version_number DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1395:    CREATE INDEX IF NOT EXISTS idx_memory_lineage_predecessor
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1396:      ON memory_lineage(predecessor_memory_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1397:    CREATE INDEX IF NOT EXISTS idx_memory_lineage_root
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1398:      ON memory_lineage(root_memory_id, version_number ASC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1399:    CREATE INDEX IF NOT EXISTS idx_memory_lineage_valid_from
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1400:      ON memory_lineage(logical_key, valid_from DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1417:    { name: 'shared_space_id', sql: 'ALTER TABLE memory_index ADD COLUMN shared_space_id TEXT' },
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1450:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1461:      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1467:        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1478:    CREATE TABLE IF NOT EXISTS shared_spaces (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1492:    CREATE TABLE IF NOT EXISTS shared_space_members (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1504:    CREATE TABLE IF NOT EXISTS shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1518:    CREATE INDEX IF NOT EXISTS idx_shared_spaces_tenant
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1519:      ON shared_spaces(tenant_id, rollout_enabled, kill_switch);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1520:    CREATE INDEX IF NOT EXISTS idx_shared_space_members_subject
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1521:      ON shared_space_members(subject_type, subject_id, role);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1522:    CREATE INDEX IF NOT EXISTS idx_shared_space_conflicts_space
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1523:      ON shared_space_conflicts(space_id, created_at DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1571:    if (!hasTable(database, 'memory_history')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1572:      warnings.push('memory_history table missing; historical replay functionality may be degraded.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1633:    if (!hasTable(database, 'memory_history')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1634:      warnings.push('memory_history table missing; lineage bridge metadata will be incomplete.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2097:  // H5 FIX: Add idx_history_timestamp index for memory_history table
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2099:    database.exec(`CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2100:    logger.info('Created idx_history_timestamp index');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2103:      console.warn('[vector-index] Failed to create idx_history_timestamp:', get_error_message(err));
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2113:    CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2127:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2131:      ALTER TABLE memory_history RENAME TO memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2132:      CREATE TABLE memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2142:      INSERT INTO memory_history SELECT * FROM memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2143:      DROP TABLE memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2164:    CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2165:    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2218:  if (!hasTable(database, 'memory_history')) return;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2219:  if (!getTableColumns(database, 'memory_history').includes('spec_folder')) return;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2231:    'UPDATE memory_history SET spec_folder = ? WHERE rowid = ? AND spec_folder = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2233:  const historyRows = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2234:    SELECT rowid AS history_rowid, spec_folder
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2235:    FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2238:  `).all() as Array<{ history_rowid: number; spec_folder: string }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2241:  for (const row of historyRows) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2245:      updateStmt.run(canonical, row.history_rowid, row.spec_folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2248:      logger.warn(`Migration v23: Ambiguous memory_history mapping for "${row.spec_folder}". Skipping.`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2253:    logger.info(`Migration v23: Updated spec_folder for ${updatedRows} memory_history rows`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2326:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2345:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2436:    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2462:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:40:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:61:  'shared_space_id', 'provenance_source', 'provenance_actor',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:73:    it('T211: 89 days + low R => NOT archived', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:171:    it('T226: Constitutional => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:175:    it('T227: Critical => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:179:    it('T228: Pinned => never archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:183:    it('T229: Old low-stability normal => should archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:187:    it('T230: Recent high-stability => should NOT archive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:32:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:33:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:34:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:35:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:115:  tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:116:  userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:117:  agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:118:  sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:144:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:145:    userId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:146:    agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-utils.ts:147:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:23:          : 'session_health',
.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md:75:| **autobiographical** | 365 days | Never | Project history: milestones, major decisions |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:28:import { runLineageBackfill } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:72:    'weight_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:73:    'memory_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:82:    'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:83:    'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:90:    'memory_lineage',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:114:  'weight_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:115:  'memory_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:124:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:125:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:312:  'memory_conflicts', 'memory_corrections', 'memory_lineage', 'memory_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:317:  'weight_history', 'adaptive_signal_events', 'negative_feedback_events',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:396:    const rawId = memory?.shared_space_id;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:432:    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:433:    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:434:    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:444:    || columns.has('shared_space_id')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:525:  if (normalizedScope.userId && columns.has('user_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:    params.push(normalizedScope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:529:  if (normalizedScope.agentId && columns.has('agent_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:531:    params.push(normalizedScope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:534:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:535:    params.push(normalizedScope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:648:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:699:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:700:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:703:        'SELECT * FROM shared_spaces WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:704:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:709:        'SELECT * FROM shared_spaces WHERE tenant_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:712:    return hasScope ? [] : database.prepare('SELECT * FROM shared_spaces').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:715:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:716:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:719:        'SELECT * FROM shared_space_members WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:720:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:723:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_members').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:747:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:751:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:810:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:908:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:917:    sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:957:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:958:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:962:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:963:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:968:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:969:      deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:987:  if (tableName === 'weight_history') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:997:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:998:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1012:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1013:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1070:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1199:      deps: ['lineage-backfill'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1204:      deps: ['lineage-backfill'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1219:      deps: ['lineage-backfill', 'auto-entities'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1230:      name: 'lineage-backfill',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1344:    'is_archived',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1428:      const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1442:          sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1488:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1489:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1490:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1521:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1522:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1523:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1646:    const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1728:                sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1860:              sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:790:      hint: 'Cannot trace lineage: memory not found.',
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:6:import { recordLineageVersion } from '../lib/storage/lineage-state';
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:46:describe('Create-record lineage regressions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:78:  it('T070-2 keeps same-path PE supersedes inside the lineage chain only', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:94:  it('T070-3 rejects mismatched logical identities at the lineage layer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:97:      specFolder: 'specs/t070-lineage',
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:98:      filePath: '/tmp/specs/t070-lineage/memory/original.md',
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:111:      specFolder: 'specs/t070-lineage',
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:112:      filePath: '/tmp/specs/t070-lineage/memory/different.md',
.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts:88:    const history = Array.from({ length: 20 }, (_, i) => `ctx-${String(i + 1).padStart(2, '0')}.md`);
.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts:89:    savePerFolderDescription(buildDescription({ memoryNameHistory: history }), tmpDir);
.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts:99:    const history = Array.from({ length: 5 }, (_, i) => `ctx-${i + 1}.md`);
.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts:100:    savePerFolderDescription(buildDescription({ memoryNameHistory: history }), tmpDir);
.opencode/skill/system-spec-kit/mcp_server/tests/workflow-memory-tracking.vitest.ts:105:    expect(updated.memoryNameHistory).toEqual([...history, 'ctx-6.md']);
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:278:    it('Rejects spec.md in /z_archive/ directory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:279:      expect(isMemoryFile('/p/.opencode/specs/003/100/z_archive/spec.md')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:102:    description: 'Project history: milestones, major decisions, historical context',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:184:  // Autobiographical patterns (history)
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:251:  'history': 'autobiographical',
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:254:  'project history': 'autobiographical',
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:2:// Converted from: t206-search-archival.test.ts (custom runner)
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:69:describe('T206 - Source code contains is_archived filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:70:  it('T206-SRC1: vector-index-queries.ts has is_archived filters (>= 3)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:71:    const vsFilterCount = (VECTOR_INDEX_QUERIES_SOURCE.match(/is_archived IS NULL OR.*is_archived\s*=\s*0/g) || []).length;
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:75:  it('T206-SRC2: multi_concept_search uses archival_filter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:76:    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('archival_filter');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:77:    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('${archival_filter}');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:80:  it('T206-SRC3: hybrid-search has is_archived filter in ftsSearch', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:94:    expect(hsSource).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/search-archival.vitest.ts:116:    expect(VECTOR_INDEX_QUERIES_SOURCE).toContain('is_archived IS NULL OR is_archived = 0');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:3:description: "Persistence helpers for checkpoints, lineage, reconsolidation, audit history, and post-insert metadata."
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:6:  - "lineage state"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:31:- Append-first lineage tracking and mutation audit history.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:38:- Storage helpers assume document-aware columns such as `document_type`, `spec_level`, governance scope columns, and lineage metadata are available.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:51:| `history.ts` | Append-only history events and lineage anchor lookup helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:54:| `lineage-state.ts` | Append-first lineage transitions, active projection reads, backfill, and as-of resolution |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:68:- `lineage-state.ts` owns append-first version transitions, active projections, integrity validation, and backfill helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:69:- `mutation-ledger.ts` and `history.ts` provide complementary audit trails: the former is low-level mutation provenance, the latter is higher-level history/event reporting.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:70:- `reconsolidation.ts` and `consolidation.ts` remain feature-gated maintenance systems, but both are wired against the current lineage and interference-refresh behavior.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:10:import { recordHistory } from '../storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:65:    'DELETE FROM memory_lineage WHERE memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:66:    'DELETE FROM shared_space_conflicts WHERE existing_memory_id = ? OR incoming_memory_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:520:    // Memory_history rows are intentionally preserved after deletion
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:593:      // Self-record DELETE history only after the delete succeeded.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:658:          // Memory_history rows are intentionally preserved after deletion
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:20:import * as archivalManager from '../lib/cognitive/archival-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:46:  archivalManager.__setEmbeddingsModuleForTests(null);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:79:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:80:      archived_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:139:      expect(() => archivalManager.init(requireDb())).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:142:    it('T059-002: is_archived column exists', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:145:      expect(columns.map(column => column.name)).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:149:      expect(archivalManager.ARCHIVAL_CONFIG).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:150:      expect(typeof archivalManager.ARCHIVAL_CONFIG.scanIntervalMs).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:154:      const config = archivalManager.ARCHIVAL_CONFIG;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:166:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:193:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:212:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:230:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:248:      const candidates = archivalManager.getArchivalCandidates(100);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:261:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:268:    it('T059-010: archiveMemory returns true on success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:279:      const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:280:      expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:283:    it('T059-011: is_archived flag set to 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:294:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:295:      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:296:      expect(row.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:299:    it('T059-012: unarchiveMemory succeeds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:310:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:311:      const unarchiveResult = archivalManager.unarchiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:312:      expect(unarchiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:314:      const row = requireDb().prepare('SELECT is_archived FROM memory_index WHERE id = ?').get(memory_id) as { is_archived: number };
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:315:      expect(row.is_archived).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:318:    it('T059-012c: archive and unarchive invalidate graph caches on success', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:329:      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:330:      expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:336:    it('T059-013: Batch archive succeeds', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:350:      const batchResult = archivalManager.archiveBatch(idsToArchive);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:351:      expect(batchResult.archived).toBe(3);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:355:    it('T059-014: archiveMemory on already-archived returns false', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:366:      archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:367:      const alreadyArchived = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:371:    it('T059-011b: archiveMemory removes vec_memories row but preserves memory_index archive state', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:392:      const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:393:      expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:395:      const archivedRow = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:396:        .prepare('SELECT is_archived FROM memory_index WHERE id = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:397:        .get(memory_id) as { is_archived: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:398:      expect(archivedRow).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:399:      expect(archivedRow?.is_archived).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:407:    it('T059-012b: unarchiveMemory defers vector re-embedding to next index scan', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:413:        content_text: 'Rebuild vector content on unarchive',
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:425:      archivalManager.__setEmbeddingsModuleForTests({
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:432:      expect(archivalManager.archiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:434:      const archivedVector = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:437:      expect(archivedVector).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:439:      // Capture deferred-rebuild log emitted by syncVectorOnUnarchive
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:442:        expect(archivalManager.unarchiveMemory(memory_id)).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:445:        const vectorAfterUnarchive = requireDb()
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:448:        expect(vectorAfterUnarchive).toBeUndefined();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:464:    it('T059-011c: archiveMemory suppresses vec_memories no-such-table cleanup errors', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:477:        const archiveResult = archivalManager.archiveMemory(memory_id);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:478:        expect(archiveResult).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:482:          return text.includes('Vector archive sync failed')
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:499:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:500:      archivalManager.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:507:    it('T059-015: Archival scan archives candidates', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:540:      const scanResult = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:541:      expect(scanResult.archived).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:557:      const scanResult = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:574:      const scanResult = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:575:      const scan2Result = archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:576:      expect(scan2Result.archived).toBeLessThanOrEqual(scanResult.archived);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:586:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:590:      archivalManager.stopBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:595:      expect(() => archivalManager.startBackgroundJob(60000)).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:599:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:600:      expect(archivalManager.isBackgroundJobRunning()).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:604:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:605:      expect(() => archivalManager.stopBackgroundJob()).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:609:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:610:      archivalManager.stopBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:611:      expect(archivalManager.isBackgroundJobRunning()).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:621:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:622:      archivalManager.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:645:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:646:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:666:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:667:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:684:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:685:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:690:      archivalManager.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:691:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:702:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:717:      const recentStatus = archivalManager.checkMemoryArchivalStatus(recentId);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:730:      const recentStatus = archivalManager.checkMemoryArchivalStatus(recentId);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:735:      const missingStatus = archivalManager.checkMemoryArchivalStatus(99999);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:751:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:752:      archivalManager.startBackgroundJob(60000);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:753:      archivalManager.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:754:      expect(archivalManager.isBackgroundJobRunning()).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:759:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:760:      archivalManager.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:761:      const stats = archivalManager.getStats();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:769:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:770:      archivalManager.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:771:      const candidates = archivalManager.getArchivalCandidates();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:776:    it('T059-032: archiveMemory returns false without db', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:778:      archivalManager.init(requireDb());
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:779:      archivalManager.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/archival-manager.vitest.ts:780:      const result = archivalManager.archiveMemory(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:28:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:33:    expect(decision.issues).toContain('userId or agentId is required for governed ingest');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:55:      { tenant_id: 'a', user_id: 'u1', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:56:      { tenant_id: 'b', user_id: 'u2', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:90:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:91:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:112:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:113:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:130:  it('reviews governance audit history with summary counts and parsed metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:145:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:146:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:154:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:155:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:162:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:163:      userId: 'user-9',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:169:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:184:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:209:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:210:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:232:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:233:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:234:      { id: 3, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:235:      { id: 4, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:240:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:241:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:247:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:248:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:253:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:254:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1082:    it('EXT-H13: handleCheckpointList rejects whitespace tenantId when sharedSpaceId is provided', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1084:        tenantId: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1085:        sharedSpaceId: 'space-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:1086:      })).rejects.toThrow(/tenantId must be a non-empty string/i);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:43:| Cognitive Features | 10+ | FSRS scheduler, attention decay, PE gating, working memory, tier classification, co-activation, temporal contiguity, archival manager, causal graph, corrections |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:179:│   ├── archival-manager.ts     # 5-state archival model
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:187:│   ├── history.ts              # History management
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:329:| `cognitive/archival-manager.ts` | 5-state archival model |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:334:| `storage/history.ts` | History management |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:394:// ARCHIVED (R < 0.02)  - Effectively forgotten, time-based archival
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:724:| [Storage Modules](./storage/) | Access tracking, checkpoints, history |
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:262: * Retrieve user selection history.
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:28:  '/z_archive/',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:39:    // T001d: weight_history
.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:41:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:51:      shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:74:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:75:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:76:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:78:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:94:      shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:104:    scope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:105:    scope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:106:    scope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:108:    scope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:246:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:255:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:271:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:280:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:371:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:400:        { tenantId: 'tenant-a', sharedSpaceId: 'shared-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:404:      expect(capturedSql).toContain('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:616:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:643:        { tenantId: 'tenant-b' },
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:650:        { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:4:// Provides append-first lineage transitions, active projection reads,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:20:import { getHistoryEventsForLineage, init as initHistory, recordHistory, type HistoryLineageEvent } from './history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:38:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:82:  history: HistoryLineageEvent[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:91:  historyEvents?: HistoryLineageEvent[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:136:  lineageRowCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:213:    ['shared_space', normalizeScopeValue(row.shared_space_id)],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:262:      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:281:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:299:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:319:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:339:    && message.includes('memory_lineage.logical_key')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:340:    && message.includes('memory_lineage.version_number')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:347:  historyEvents: HistoryLineageEvent[] = [],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:349:  // D1: All fields are serialized for archival — only `.snapshot` is read back
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:350:  // during lineage inspection, but the full metadata provides forensic context
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:359:    history: historyEvents,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:375:    logger.warn(`Invalid lineage metadata shape for memory ${row.memory_id}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:378:    logger.warn(`Failed to parse lineage metadata for memory ${row.memory_id}: ${error instanceof Error ? error.message : String(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:547:// R1: Shared early-return helper for lineage functions.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:592: * Seed lineage state from an existing memory row when no lineage entry exists yet.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:594: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:595: * @param memoryId - Memory version to seed into lineage tables.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:597: * @returns Seeded lineage state for the requested memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:613:  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:615:    ?? historyEvents[0]?.timestamp
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:620:      INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:640:      buildMetadata(row, actor, historyEvents),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:659: * Seed or append a lineage transition for a memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:661: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:664: * @returns Recorded lineage state for the requested memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:678:    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:684:      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:741:          UPDATE memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:750:        INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:772:        buildMetadata(row, actor, historyEvents),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:796:        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:802:  throw new Error(`E_LINEAGE: exhausted retries while recording lineage for memory ${memoryId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:806: * Create a new append-only memory row and wire it into lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:808: * @param params - Parsed memory payload and append-only lineage metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:838: * Return the full ordered lineage chain for the logical key behind a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:840: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:842: * @returns Ordered lineage snapshots from oldest to newest version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:847:  const lineage = loadLineageRowsForMemory(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:848:  if (!lineage) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:852:  return lineage.rows.map((row) => resolveSnapshotFromLineageRow(database, row));
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:856: * Build a compact operator-facing summary for the lineage behind a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:858: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:860: * @returns Aggregated lineage summary when one exists.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:868:  const lineage = loadLineageRowsForMemory(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:869:  if (!lineage) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:872:  const { logicalKey, projection, rows } = lineage;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:933: * Resolve the currently active lineage snapshot for a memory logical key.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:935: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:937: * @returns Active lineage snapshot when one exists.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:944:  const lineage = loadLineageRowsForMemory(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:945:  if (!lineage) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:948:  const { projection, rows } = lineage;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:960: * Resolve the lineage snapshot visible at a specific point in time.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:962: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:973:  const lineage = loadLineageRowsForMemory(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:974:  if (!lineage) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:979:  const row = [...lineage.rows].reverse().find((candidate) => (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:988: * Validate lineage chains and active projections for structural drift.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:990: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1002:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1004:      AND predecessor_memory_id NOT IN (SELECT memory_id FROM memory_lineage)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1016:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1030:    LEFT JOIN memory_lineage l
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1044:  const lineageRowCount = (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1045:    database.prepare('SELECT COUNT(*) AS total FROM memory_lineage').get() as { total: number }
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1052:    lineageRowCount,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1060: * Backfill lineage state from existing memory rows in append-only order.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1062: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1073:  const actor = options.actor ?? 'memory-lineage:backfill';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1103:      const historyEventsForDryRun = getSafeHistoryEvents(database, row.id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1104:      const expectedValidFrom = historyEventsForDryRun[0]?.timestamp
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1144:        const historyEvents = getSafeHistoryEvents(database, row.id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1145:        const validFrom = historyEvents[0]?.timestamp
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1152:          INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1186:          buildMetadata(row, actor, historyEvents),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1218: * Resolve the active projection row for the lineage that owns a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1220: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1228:  const lineage = loadLineageRowsForMemory(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1229:  if (!lineage) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1232:  return lineage.projection;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1236: * Resolve the latest lineage row for the logical key behind a memory.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1238: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1240: * @returns Latest lineage row when one exists.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1243:  const lineage = loadLineageRowsForMemory(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1244:  if (!lineage || lineage.rows.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1247:  return lineage.rows[lineage.rows.length - 1] ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1251: * Compatibility wrapper used by roadmap tests and save flows for lineage writes.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1253: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1255: * @returns Recorded lineage transition for the requested memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1291: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1293: * @returns Active lineage snapshot when one exists.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1305: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1317: * Compatibility wrapper that executes the lineage backfill workflow.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1319: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1331: * Benchmark append-first lineage writes across an ordered chain of memory ids.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1333: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1359:  const actor = options.actor ?? 'memory-lineage:benchmark';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1393: * Public lineage result types exposed to tests and compatibility helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:11:const SUPPORTED_PHASES_ARRAY = ['baseline', 'lineage', 'graph', 'adaptive', 'scope-governance', 'shared-rollout'] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:18:  lineageState: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:56:  lineageState: 'SPECKIT_MEMORY_LINEAGE_STATE',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:65:  lineageState: 'SPECKIT_HYDRA_LINEAGE_STATE',
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:136:    lineageState: isMemoryRoadmapCapabilityEnabled(
.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:137:      [CAPABILITY_ENV.lineageState, LEGACY_CAPABILITY_ENV.lineageState],
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:147: * Persist a captured baseline snapshot into eval metric history.
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:146:    scope.tenantId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:147:    || scope.userId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:148:    || scope.agentId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:150:    || scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:158:    const tenantMatches = !scope.tenantId || row.tenant_id === scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:159:    const userMatches = !scope.userId || row.user_id === scope.userId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:160:    const agentMatches = !scope.agentId || row.agent_id === scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:162:    const sharedMatches = !scope.sharedSpaceId || (
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:163:      row.shared_space_id === scope.sharedSpaceId
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:164:      && (!allowedSharedSpaceIds || allowedSharedSpaceIds.has(String(row.shared_space_id)))
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:357:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:391:      is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:428:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:439:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:477:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:480:          shared_space_id: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:491:          is_archived: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:494:          shared_space_id: 'shared-blocked',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:504:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:505:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:526:        shared_space_id: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:535:        shared_space_id: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:542:        shared_space_id: 'blocked-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:550:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:551:        sharedSpaceId: 'allowed-space',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:581:        { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:584:        { id: 1, title: 'baseline duplicate', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:587:        { id: 2, title: 'reform blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:590:        { id: 1, title: 'reform duplicate', score: 0.77, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:591:        { id: 3, title: 'reform allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:597:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:598:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:619:      { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:622:      { id: 1, title: 'hyde duplicate', score: 0.94, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:623:      { id: 2, title: 'hyde allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:624:      { id: 3, title: 'hyde blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:630:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:631:        sharedSpaceId: 'shared-allowed',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:17:import { recordHistory } from './history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:24:import { recordLineageTransition } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:289:      // Mark existing memory as archived (superseded)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:292:        SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:382:      } catch (_historyErr: unknown) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:383:        // Best-effort history tracking during reconsolidation merge
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:676:            // instead of raw DELETE to clean lineage, projections, and graph residue.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:834:  const value = row.is_archived;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:923:    shared_space_id: existingRow.shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:41:      "notes": "Graph-relationship query tracing decision lineage. Tests causal traversal in the decision graph."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:80:      "expectedResultDescription": "Should surface memories about SPECKIT_WORKING_MEMORY, SPECKIT_EVENT_DECAY, working-memory.ts, and archival-manager.ts. The relationship is that event decay reduces attention scores over time.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:101:      "notes": "Graph-relationship query about architectural lineage. Tests find_decision intent routing with high graph weight (0.50 per adaptive-fusion profile)."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:325:      "query": "relationship between causal edges and memory decision lineage",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:331:      "notes": "From T007b Pattern 8: concept AND search for 'causal edges' AND 'decision lineage'."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:630:      "expectedResultDescription": "Should surface importance-tiers.ts, tier-classifier.ts, archival-manager.ts, and any spec memories about the 5-tier state machine.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:705:      "query": "I want to understand how the memory system decides when to archive a memory",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:710:      "expectedResultDescription": "Should surface archival-manager.ts, tier-classifier.ts, and any spec about the archival lifecycle conditions.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:90:- Purpose: Owns the memory-science side of the system: decay, retrievability, working memory, co-activation, pressure monitoring, archival movement, and adaptive ranking inputs. It is the main "how memory behaves over time" module family.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:96:  - `archival-manager.ts` — lifecycle transitions between active and archived memory states.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:227:- Purpose: Owns correction history and stability adjustments that let the system learn from supersedes, merges, deprecations, and refinements. It is the primary home for correction-driven reliability updates.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:345:  - `lib/storage/lineage-state.ts`
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:349:- Purpose: Owns persistence behavior outside the search algorithm itself: checkpoints, history, access tracking, lineage state, transactions, consolidation, reconsolidation, and index refresh flows. This is the long-lived state management layer for the memory system.
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:661:- `storage/lineage-state.ts -> handlers/*`
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:3:// Detection, edge bounds, cluster surfacing, weight_history.
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:69:  // Weight_history
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:71:    CREATE TABLE weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:213:/* -- T001d: Weight history -- */
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:215:describe('T001d: Weight history audit tracking', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:216:  it('T-WH-01: updateEdge logs weight change to weight_history', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:225:    const history = getWeightHistory(edgeId!);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:226:    expect(history).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:227:    expect(history[0].old_strength).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:228:    expect(history[0].new_strength).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:229:    expect(history[0].changed_by).toBe('test');
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:230:    expect(history[0].reason).toBe('manual update');
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:233:  it('T-WH-02: multiple updates accumulate in weight_history', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:242:    const history = getWeightHistory(edgeId!);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:243:    expect(history).toHaveLength(3);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:253:    const history = getWeightHistory(edgeId!);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:254:    expect(history).toHaveLength(0);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:286:    const history = getWeightHistory(edgeId1!);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:287:    expect(history).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:288:    expect(history[0].old_strength).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:289:    expect(history[0].new_strength).toBe(0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:366:    const history = getWeightHistory(edgeId!);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:367:    expect(history.length).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:368:    expect(history[0].changed_by).toBe('hebbian');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:77:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:89:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:90:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:93:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:94:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:105:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:117:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:118:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:121:      reason: 'shared_space_membership_required',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:124:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:125:      userId: 'user-2',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:134:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:151:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:152:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:415:    vi.mocked(folderScoringSourceMod.isArchived).mockImplementation((folder: string) => folder.includes('z_archive'));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1088:        { spec_folder: 'specs/z_archive/old', count: 3 },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts:1093:    const hasArchived = parsed?.data?.topFolders?.some((f: any) => (f.folder || '').includes('z_archive'));
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:5:// Causal relationship graph for memory lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:213:      // Check if edge exists (for weight_history logging on conflict update).
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:215:      // To write a weight_history row after the upsert. The subsequent INSERT
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:539:      // T001d: Capture old strength for weight_history logging
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:556:      // T001d: Log weight change to weight_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:747:    INSERT INTO weight_history (edge_id, old_strength, new_strength, changed_by, reason)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:756:      SELECT * FROM weight_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:783:        SELECT old_strength FROM weight_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:788:      // Find the earliest history entry strictly after the target timestamp.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:790:      // Timestamps that do not exactly match a stored history row.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:793:        SELECT old_strength FROM weight_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:802:          SELECT old_strength FROM weight_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:906:  // T001d: Weight history & audit
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:614:    const history = Array.from({ length: 25 }, (_, i) => `file-${i}.md`);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:624:      memoryNameHistory: history.slice(-20),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:8:import { runLineageBackfill, summarizeLineageInspection } from '../lib/storage/lineage-state';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:50:describe('Memory lineage backfill', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:55:    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-lineage-backfill-'));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:98:      name: 'pre-lineage-backfill',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:112:      FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:142:      FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:163:      FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:164:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:204:    const content = 'This memory contains background context and history.';
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:374:            is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:395:          CREATE TABLE weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:405:          CREATE TABLE memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:35:  'get learning history',
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:221:      // "get learning history" has 3 terms and is a trigger phrase
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:222:      const result = classifyQueryComplexity('get learning history', TRIGGER_PHRASES);
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:501:      // "get learning history" is a trigger phrase with exactly 3 terms
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:502:      const result = classifyQueryComplexity('get learning history', TRIGGER_PHRASES);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:97:      is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:109:  it('T007a-S4: includeArchived=true can surface archived folders in count mode', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:112:      `specs/z_archive/${runId}-archived`,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-stats-edge.vitest.ts:118:    expect(parsed.data.topFolders.some((folder: { folder: string }) => folder.folder.includes(`${runId}-archived`))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:175:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:176:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:178:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:188:      'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:199:      'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:296:      'task_preflight', 'task_postflight', 'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:320:    it('T16d: only session_health is excluded from tool-call tracking', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:321:      expect(sourceCode).toMatch(/if \(name !== 'session_health'\) \{/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:404:      '../lib/cognitive/archival-manager',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:424:      '../lib/storage/history',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:707:      vi.doMock('../lib/cognitive/archival-manager', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:762:      vi.doMock('../lib/storage/history', () => ({ recordHistory: vi.fn(), getHistory: vi.fn(() => []) }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:927:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:944:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1054:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1103:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1113:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1131:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1164:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1177:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1563:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1581:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1614:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1619:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1622:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1627:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1963:    // T44: Shutdown stops archival manager
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1964:    it('T44: Shutdown stops archival manager', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1965:      expect(sourceCode).toMatch(/archivalManager\.cleanup\(\)/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2107:      'memory_get_learning_history': '[L7:Maintenance]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2257:      { module: './lib/cognitive/archival-manager.js', name: 'Archival manager' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:146:    it('T-FS-11: archive folder scoring works', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-folder-scoring-types.vitest.ts:148:      const score = computeSingleFolderScore('z_archive/old-stuff', memories);
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:30:        is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:49:      INSERT INTO memory_index (id, title, trigger_phrases, content_text, file_path, spec_folder, is_archived)
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:54:        (4, 'Archived Memory', 'old data', 'This memory is archived', '/specs/old.md', 'old-spec', 1);
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:114:  it('T6: archived memories excluded by default', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:115:    const results = fts5Bm25Search(db, 'archived');
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:120:  it('T6b: archived memories included when requested', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:121:    const results = fts5Bm25Search(db, 'archived', { includeArchived: true });
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:194:        is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:394:      const searchKey = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:395:      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:396:      set(searchKey, 'search_result', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:397:      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:423:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:427:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:436:      expect(invalidateByTool('memory_search')).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:439:      const second = withCache('memory_search', args, async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:589:      const key = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:593:        'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:603:      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:15:type MutationType = 'create' | 'update' | 'delete' | 'merge' | 'archive' | 'restore' | 'reindex';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:93:    mutation_type TEXT NOT NULL CHECK(mutation_type IN ('create','update','delete','merge','archive','restore','reindex')),
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-matcher.vitest.ts:348:        trigger_phrases: JSON.stringify([`background${index + 1} archive${index + 1}`]),
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:287:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:296:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:302:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:310:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:311:    expect(resp.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:318:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:328:  it('F7: Tool-specific hints included for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:330:    const resp = buildErrorResponse('memory_search', err);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:353:    const err = createErrorWithHint('E040', 'fail', {}, 'memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:469:  it('K2: Has memory_search, checkpoint_restore, memory_save', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:470:    expect('memory_search' in TOOL_SPECIFIC_HINTS).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:27:    testDb.exec('DELETE FROM weight_history');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:32:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:85:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:774:    it('should trace incoming edges for decision lineage', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:778:      const lineage = causalEdges.getCausalChain('3', 10, 'backward');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:779:      expect(collectNodes(lineage)).toEqual(['3', '2', '1']);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:792:    it('should include evidence in lineage', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:914:    it('T002: rollback restores old_strength from weight_history', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:918:      // Verify weight_history was created
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:919:      const history = causalEdges.getWeightHistory(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:920:      expect(history.length).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:921:      expect(history[0].old_strength).toBe(0.3);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:922:      expect(history[0].new_strength).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:925:      const rollbackResult = causalEdges.rollbackWeights(edgeId, history[0].changed_at);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:937:      const history = causalEdges.getWeightHistory(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:938:      expect(history.length).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:940:      expect(history[0].old_strength).toBe(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:941:      expect(history[0].new_strength).toBe(0.9);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:942:      expect(history[1].old_strength).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:943:      expect(history[1].new_strength).toBe(0.7);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:965:    it('T002: rollback uses deterministic same-second history ordering', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:970:      testDb.prepare("UPDATE weight_history SET changed_at = '2026-03-11 10:00:00' WHERE edge_id = ?").run(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:972:      const history = causalEdges.getWeightHistory(edgeId);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:973:      expect(history).toHaveLength(2);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:974:      expect(history[0].old_strength).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:975:      expect(history[0].new_strength).toBe(0.8);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:976:      expect(history[1].old_strength).toBe(0.3);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:977:      expect(history[1].new_strength).toBe(0.5);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:979:      const rollbackResult = causalEdges.rollbackWeights(edgeId, history[0].changed_at);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:986:    it('T002: updateEdge rolls back when weight_history insert fails', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:989:        testDb.exec('DROP TABLE weight_history');
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:1001:    it('T002: insertEdge upsert rolls back when weight_history insert fails', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts:1004:        testDb.exec('DROP TABLE weight_history');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-density.vitest.ts:37:    CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:399:  describe('Composite scoring + archival integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:457:    it('Archival paths are deprioritized by archive multipliers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:461:          { id: 201, spec_folder: 'specs/z_archive/legacy', updated_at: nowIso, created_at: nowIso, importance_tier: 'critical' },
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:467:      const archivedFolder = folderScores.find(folder => folder.folder === 'specs/z_archive/legacy');
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:470:      expect(archivedFolder).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:472:      expect(archivedFolder?.score ?? 1).toBeLessThan(activeFolder?.score ?? 0);
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:63:    CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:35:- Eval, shared-memory, governance, lineage, and public-API surfaces.
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:138:        memory_get_learning_history: 'L7',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:194:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:195:        { tool: 'memory_search', expected: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:221:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:242:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:253:        { tool: 'memory_search', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:280:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:291:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:292:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:301:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:117:      const archiveTests = [
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:118:        { path: 'specs/z_archive/old-project', expected: true },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:127:      for (const { path: p, expected } of archiveTests) {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:133:      const archiveMultiplier = mod.getArchiveMultiplier('specs/z_archive/old');
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:136:      expect(archiveMultiplier).toBeLessThan(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:142:        createMemory({ specFolder: 'z_archive/old', spec_folder: 'z_archive/old' }),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:19: * @returns Importance weight used during indexing and lineage writes.
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:6:import * as history from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:826:      const events = history.getHistory(pathDeleteId);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:886:    it('records DELETE history only for confirmed batch deletions', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:901:      const firstHistory = history.getHistory(firstId);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:902:      const secondHistory = history.getHistory(secondId);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:264:  const archivedOrCold = results.filter(
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:267:  if (archivedOrCold.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:268:    blockers.push(`${archivedOrCold.length} result(s) are cold/archived — may be stale`);
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:90:vi.mock('../lib/storage/history', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:108:import * as history from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:159:      is_archived INTEGER DEFAULT 0
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:391:    const deleteHistoryCalls = vi.mocked(history.recordHistory).mock.calls
.opencode/skill/system-spec-kit/mcp_server/tests/chunking-orchestrator-swap.vitest.ts:437:    const rollbackHistoryCalls = vi.mocked(history.recordHistory).mock.calls
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:4:// Tracks change history for memory entries (ADD, UPDATE, DELETE)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:8:// Feature catalog: Per-memory history log
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:41: * Normalized history event shape for lineage backfill/replay helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:82:    CREATE TABLE IF NOT EXISTS memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:97:  // FOREIGN KEY that prevented DELETE history from surviving parent deletion.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:99:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_history'"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:104:      ALTER TABLE memory_history RENAME TO memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:105:      CREATE TABLE memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:120:        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, timestamp, is_deleted, actor)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:122:        FROM memory_history_old h
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:124:        DROP TABLE memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:128:        INSERT INTO memory_history (id, memory_id, spec_folder, prev_value, new_value, event, timestamp, is_deleted, actor)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:130:        FROM memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:131:        DROP TABLE memory_history_old;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:136:  if (!hasColumn(database, 'memory_history', 'spec_folder')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:137:    database.exec('ALTER TABLE memory_history ADD COLUMN spec_folder TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:142:      UPDATE memory_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:144:        SELECT m.spec_folder FROM memory_index m WHERE m.id = memory_history.memory_id
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:147:        AND EXISTS (SELECT 1 FROM memory_index m WHERE m.id = memory_history.memory_id)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:151:  database.exec('CREATE INDEX IF NOT EXISTS idx_history_memory ON memory_history(memory_id, timestamp)');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:152:  database.exec('CREATE INDEX IF NOT EXISTS idx_history_timestamp ON memory_history(timestamp DESC)');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:153:  database.exec('CREATE INDEX IF NOT EXISTS idx_history_spec_folder ON memory_history(spec_folder, event, timestamp DESC)');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:157:    INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor, spec_folder)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:165:    FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:262:  const historyRow = resolveHistorySpecFolderStatement.get(memoryId) as { spec_folder?: string | null } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:263:  const resolved = normalizeSpecFolder(historyRow?.spec_folder ?? null);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:269:  if (!db) throw new Error('[history] Database not initialized. Call init(db) first.');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:323:      INSERT INTO memory_history (id, memory_id, event, prev_value, new_value, actor, spec_folder)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:348:    ? 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC LIMIT ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:349:    : 'SELECT * FROM memory_history WHERE memory_id = ? ORDER BY timestamp DESC, rowid DESC';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:357: * Returns chronological history events for lineage backfill/replay helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:366:    FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:391: * Returns the lightweight history facts used to bridge legacy history into
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:416:      FROM memory_history h
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:429:             SELECT 1 FROM memory_history hx
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:450:    FROM memory_history
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:43:  'mcp_server/test/lineage/*.test.ts',
.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:51:  path.join(SKILL_ROOT, 'feature_catalog', '14--pipeline-architecture', '22-lineage-state-active-projection-and-asof-resolution.md'),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:270:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:271:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:272:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:273:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:281:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:282:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:283:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:284:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:293:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:294:          userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:295:          agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:296:          sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:303:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:304:        userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:305:        agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:306:        sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:157:      shared_space_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:188:    CREATE TABLE IF NOT EXISTS shared_spaces (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:608:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:613:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:618:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:642:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:643:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space B Live', 'space-b');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:665:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:668:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-b')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:696:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:700:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:721:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:730:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:753:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:756:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-extra')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:784:          id, spec_folder, file_path, title, created_at, updated_at, importance_tier, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:788:        INSERT INTO shared_spaces (space_id, tenant_id, name, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:798:      database.prepare('UPDATE shared_spaces SET name = ? WHERE space_id = ?').run('Space A Live', 'space-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:800:        const table = snapshot.tables?.shared_spaces;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:814:      expect(result.rolledBackTables).toContain('shared_spaces');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:815:      expect(result.errors.some((error) => error.includes('shared_spaces: merge restore rolled back'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:817:        database.prepare('SELECT name FROM shared_spaces WHERE space_id = ?').get('space-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:820:        (database.prepare('SELECT COUNT(*) as cnt FROM shared_spaces WHERE space_id = ?').get('space-a') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:833:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:840:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:904:        scope: { tenantId: 'tenant-a' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:911:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:41:          shared_space_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:67:            shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:75:        CREATE TABLE memory_history (
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:12://   weak    — search_shown, same_topic_requery (passive exposure)
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:127:    expect(t.architecture.capabilities.lineageState).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:703:      const history = getShadowScoringHistory(db, { queryId: 'q1' });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:704:      expect(history).toHaveLength(3);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:706:      const improved = history.find(r => r.direction === 'improved');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:778:      const historyA = getShadowScoringHistory(db, { cycleId: 'cycle-A' });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:779:      expect(historyA).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:780:      expect(historyA[0].cycle_id).toBe('cycle-A');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:782:      const historyB = getShadowScoringHistory(db, { cycleId: 'cycle-B' });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:783:      expect(historyB).toHaveLength(1);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:784:      expect(historyB[0].cycle_id).toBe('cycle-B');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:808:      const history = getShadowScoringHistory(db);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:809:      expect(history).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1216:    const history = getShadowScoringHistory(db, { cycleId: 'log-test' });
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1217:    expect(history.length).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:158:    | 'session_health'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts:105:  it('includes deep-mode and archival/quality/state-limit controls in cache args', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts:674:  it('T312: syncChangedRows removes archived or missing documents incrementally', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-fallback-tiered.vitest.ts:59:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:4:// Tracks query history per session to detect reformulations and
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:177:  // Add current query to history
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:261: * Clear query history for a session (e.g., on session cleanup).
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:6:import * as archival from '../lib/cognitive/archival-manager';
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:22:/** Create in-memory DB with memory_index schema for archival-manager */
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:38:      is_archived INTEGER DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:39:      archived_at TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:278:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:279:    archival.ensureArchivedColumn();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:280:    archival.ensureArchivedColumn();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:282:    expect(columns).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:283:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:287:  it('E-02: adds is_archived column when missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:296:    expect(colsBefore).not.toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:298:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:300:    expect(colsAfter).toContain('is_archived');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:301:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:306:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:307:    expect(() => archival.ensureArchivedColumn()).not.toThrow();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:318:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:319:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:320:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:323:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:329:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:330:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:331:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:333:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:339:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:340:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:341:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:343:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:349:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:350:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:351:    const errors = archival.getRecentErrors(5);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:353:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:359:    archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:360:    archival.resetStats();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:361:    const errors = archival.getRecentErrors();
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:363:    archival.cleanup();
.opencode/skill/system-spec-kit/mcp_server/tests/integration-learning-history.vitest.ts:38:    it('T530-3: Missing specFolder for history rejected', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:159:  it('passive signals are weak', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:283:  db.prepare(`DELETE FROM memory_history WHERE memory_id IN (
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:301:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:315:    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:356:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:362:    const searchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:365:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:669:  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:672:      a.includes('memory_match_triggers()')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:51:  archivedDaysThreshold: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:64:  archivedDaysThreshold: parseLimit('ARCHIVED_DAYS_THRESHOLD', ARCHIVED_DAYS_THRESHOLD),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:277:  // (days > 90 AND r < 0.02). Using || here would incorrectly archive
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:279:  if (days > TIER_CONFIG.archivedDaysThreshold && r < STATE_THRESHOLDS.DORMANT) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:494: * Determine if a memory should be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:499:  // Never archive constitutional or critical
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:504:  // Pinned memories are never archived
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:4:// Feature catalog: Automatic archival subsystem
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:5:// Background archival job for dormant/archived memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:32:      console.warn(`[archival-manager] tier-classifier module unavailable: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:91:          `[archival-manager] bm25-index module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:147:          `[archival-manager] embeddings module unavailable. primary="${primaryError}" fallback="${fallbackMessage}"`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:222:  totalUnarchived: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:234:const archivalStats: ArchivalStats = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:237:  totalUnarchived: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:258:    const hasArchived = columns.some(c => c.name === 'is_archived');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:261:      db.exec('ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:262:      db.exec('CREATE INDEX IF NOT EXISTS idx_archived ON memory_index(is_archived)');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:263:      console.error('[archival-manager] Added is_archived column');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:268:      console.warn(`[archival-manager] ensureArchivedColumn error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:274: * Ensure the archival_stats metadata table exists for persisting stats across restarts (P5-06).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:281:      CREATE TABLE IF NOT EXISTS archival_stats (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:289:    console.warn(`[archival-manager] ensureArchivalStatsTable error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:294: * Load archival stats from the database on startup (P5-06).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:301:      'SELECT key, value FROM archival_stats'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:307:          archivalStats.totalScanned = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:310:          archivalStats.totalArchived = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:312:        case 'totalUnarchived':
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:313:          archivalStats.totalUnarchived = parseInt(row.value, 10) || 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:316:          archivalStats.lastScanTime = row.value === '' ? null : row.value || null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:322:    console.warn(`[archival-manager] loadArchivalStats error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:327: * Persist archival stats to the database (P5-06).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:334:      INSERT INTO archival_stats (key, value, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:340:      upsert.run('totalScanned', String(archivalStats.totalScanned));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:341:      upsert.run('totalArchived', String(archivalStats.totalArchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:342:      upsert.run('totalUnarchived', String(archivalStats.totalUnarchived));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:343:      upsert.run('lastScanTime', archivalStats.lastScanTime ?? '');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:349:    console.warn(`[archival-manager] saveArchivalStats error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:358: * Get archival candidates using SQL as a pre-filter, then FSRS tier classifier
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361: * Strategy: SQL query fetches broad candidates (unarchived, not protected, not pinned).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:362: * The FSRS-based tier classifier then determines which should actually be archived.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:363: * This unifies the dual archival paths (P5-05) — FSRS is primary, SQL is pre-filter.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:371:    // Broad SQL pre-filter: get unarchived, non-protected, non-pinned memories
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:375:      WHERE (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:385:    // Use FSRS-based tier classifier as authoritative archival decision
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:428:    console.warn(`[archival-manager] getArchivalCandidates error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:460:    const isArchived = (memory.is_archived as number) === 1;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:472:    console.warn(`[archival-manager] checkMemoryArchivalStatus error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:485:    console.warn(`[archival-manager] getMemoryIndexColumns failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:498:    console.warn(`[archival-manager] BM25 archive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:503:// Touching memory_index or ancillary tables. This preserves the archived row
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:504:// (is_archived=1) so unarchive can still find and restore it.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:514:      console.warn(`[archival-manager] Vector archive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:519:function syncBm25OnUnarchive(memoryId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:530:    const query = `SELECT ${availableColumns.join(', ')} FROM memory_index WHERE id = ? AND is_archived = 0`;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:539:    console.warn(`[archival-manager] BM25 unarchive sync failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:546: * The playbook contract (scenario 124) requires that unarchive does NOT recreate the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:549: * the unarchive call on an async embedding generation round-trip and keeps the
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:550: * archive/unarchive path lightweight.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:552:function syncVectorOnUnarchive(memoryId: number): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:554:    `[archival-manager] Deferred vector re-embedding for memory ${memoryId} until next index scan`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:558:function archiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:564:      SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:567:        AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:572:      archivalStats.totalArchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:583:    archivalStats.errors.push(msg);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:584:    if (archivalStats.errors.length > MAX_ERROR_LOG) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:585:      archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:587:    console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:592:function archiveBatch(memoryIds: number[]): { archived: number; failed: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:593:  if (!db) return { archived: 0, failed: memoryIds.length };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:595:  let archived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:601:        // Db is guaranteed non-null because archiveBatch returns early when the module database is missing
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:604:          SET is_archived = 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:607:            AND (is_archived IS NULL OR is_archived = 0)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:612:          archivalStats.totalArchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:615:          archived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:622:        archivalStats.errors.push(msg);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:623:        if (archivalStats.errors.length > MAX_ERROR_LOG) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:624:          archivalStats.errors = archivalStats.errors.slice(-MAX_ERROR_LOG);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:626:        console.warn(`[archival-manager] archiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:635:  return { archived, failed };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:638:function unarchiveMemory(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:644:      SET is_archived = 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:646:      WHERE id = ? AND is_archived = 1
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:651:      archivalStats.totalUnarchived++;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:652:      syncBm25OnUnarchive(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:653:      syncVectorOnUnarchive(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:661:    console.warn(`[archival-manager] unarchiveMemory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:670:function runArchivalScan(): { scanned: number; archived: number } {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:672:  archivalStats.totalScanned += candidates.length;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:673:  archivalStats.lastScanTime = new Date().toISOString();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:675:  const result = archiveBatch(candidates.map(c => c.id));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:681:    `[archival-manager] Scan complete: ${candidates.length} candidates, ${result.archived} archived`
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:684:  return { scanned: candidates.length, archived: result.archived };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:701:      console.warn(`[archival-manager] Background job error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:709:  console.error(`[archival-manager] Background job started (interval: ${intervalMs / 1000}s)`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:716:    console.error('[archival-manager] Background job stopped');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:729:  return { ...archivalStats };
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:733:  return archivalStats.errors.slice(-limit);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:737:  archivalStats.totalScanned = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:738:  archivalStats.totalArchived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:739:  archivalStats.totalUnarchived = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:740:  archivalStats.lastScanTime = null;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:741:  archivalStats.errors = [];
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:764:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:765:  archiveBatch,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:766:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:168:    tool: 'memory_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:93:  it('clears folder-scoped constitutional cache entries for archived and non-archived keys', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts:128:      db.prepare('UPDATE memory_index SET is_archived = 1 WHERE id = ?').run(4001);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:56:    // T001d: weight_history for audit tracking
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:58:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:31: * @param identity - Unique identity string (e.g., flagName, userId)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:5:import { recordHistory } from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:18:} from '../lib/storage/lineage-state';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:29:    tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:30:    userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:31:    agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:33:    sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:55:      shared_space_id
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:66:    params.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:67:    params.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:68:    params.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:70:    params.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:74:describe('Memory lineage state', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:91:    const filePath = '/tmp/specs/015-memory-state/memory/lineage.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:156:  it('validates lineage schema support for phase 2 tables', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:171:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:179:      tenantId: 'tenant-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:213:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:214:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:222:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:223:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:261:  it('builds an operator-facing lineage summary for append-first chains', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:287:      actor: 'ops:lineage-summary',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:292:      actor: 'ops:lineage-summary',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:299:      actor: 'ops:lineage-summary',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:316:      actors: ['ops:lineage-summary'],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:328:  it('resolves lineage reads from any chain member even when the active projection row is missing', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:396:  it('benchmarks ordered lineage writes with final projection details', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:422:      actor: 'ops:lineage-benchmark',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:455:      INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:510:      actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:517:      actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:525:      actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:530:    const lineageCount = database.prepare('SELECT COUNT(*) AS count FROM memory_lineage').get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:531:    expect(lineageCount.count).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:560:      actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:567:      actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:575:      actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:582:      UPDATE memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:592:        actor: 'ops:lineage-validation',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:606:      FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:639:      actor: 'ops:lineage-retry',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:645:      actor: 'ops:lineage-retry',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:655:        actor: 'ops:lineage-retry',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:664:        warnSpy.mock.calls.some((call) => String(call[0]).includes('Retrying lineage insert for memory 93')),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:672:      FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:149:  it('clearSession removes in-memory session history', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:317:      const lineageStateModule = await import('../lib/storage/lineage-state');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:318:      const createAppendOnlyMemoryRecordSpy = vi.spyOn(lineageStateModule, 'createAppendOnlyMemoryRecord').mockReturnValue(702);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:319:      const recordLineageVersionSpy = vi.spyOn(lineageStateModule, 'recordLineageVersion').mockImplementation(() => {});
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:551:      vi.doMock('../lib/storage/lineage-state', async (importOriginal) => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:552:        const actual = await importOriginal<typeof import('../lib/storage/lineage-state')>();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:663:    it('T518-6c: same-path supersedes route through append-only lineage helpers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1245:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1246:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1247:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1249:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1258:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1259:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1260:          agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1262:          sharedSpaceId: 'shared-a',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1314:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1315:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1316:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1318:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1331:          tenantId: 'tenant-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1332:          userId: 'user-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1333:          agentId: 'agent-p',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1335:          sharedSpaceId: 'shared-p',
.opencode/skill/system-spec-kit/mcp_server/tests/anchor-prefix-matching.vitest.ts:271:        'session-history',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:275:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:300:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:301:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:304:      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:307:      expect(result.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:314:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:318:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:319:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:323:      expect(result.error).toContain('different userId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:400:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:401:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:402:        agentId: 'agent-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:493:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:509:        expect(state.tenantId).toBe('tenant-a');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:529:        tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:530:        userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:533:      const r = sm.recoverState('recover-bound', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:536:      expect(r.error).toContain('different tenantId');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:576:      const r = sm.getInterruptedSessions({ tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:57:  it('canonicalizes session and history spec folders during the v23 upgrade', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:91:      INSERT INTO memory_history (
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:94:    `).run('history-null-folder', 101, null, null, 'seed', 'ADD', 'system');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:96:      INSERT INTO memory_history (
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:99:    `).run('history-stale-folder', 101, staleSpecFolder, 'before', 'after', 'UPDATE', 'system');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:108:    const historyRows = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:109:      SELECT id, spec_folder FROM memory_history WHERE memory_id = ? ORDER BY id
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:114:    expect(historyRows).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:115:      { id: 'history-null-folder', spec_folder: canonicalSpecFolder },
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:116:      { id: 'history-stale-folder', spec_folder: canonicalSpecFolder },
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:305:    expect(indexes[1]?.sql).toContain('shared_space_id');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:44:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:45:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:46:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:47:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:53:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:54:      userId: 'user-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:55:      agentId: 'agent-1',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:56:      sharedSpaceId: 'shared-1',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:420: * Clear adaptive signal history and shadow-run snapshots for rollback drills.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-roadmap-flags.vitest.ts:60:      lineageState: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:183:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:184:      userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:192:      tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:193:      userId: 'user-b',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:27:  'weight_history',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:28:  'memory_history',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:37:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:38:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:39:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:46:  'memory_lineage',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:216:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:264:      shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:312:    INSERT INTO weight_history (id, edge_id, old_strength, new_strength, changed_by, changed_at, reason)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:317:    INSERT INTO memory_history (id, memory_id, prev_value, new_value, event, timestamp, is_deleted, actor, spec_folder)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:363:      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:368:    INSERT INTO shared_spaces (space_id, tenant_id, name, rollout_enabled, rollout_cohort, kill_switch, metadata, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:373:    INSERT INTO shared_space_members (space_id, subject_type, subject_id, role, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:378:    INSERT INTO shared_space_conflicts (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:515:    const lineageCount = restoreDb.prepare('SELECT COUNT(*) AS count FROM memory_lineage').get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:523:    expect(lineageCount.count).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:39:The cognitive subsystem is the "brain" of the memory system. It determines which memories stay active, which fade, and which get archived. Unlike simple time-based caching, it uses FSRS v4 power-law decay validated on 100M+ real human memory data.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:253:├── archival-manager.ts         # 90-day archival lifecycle (395 lines)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:270:| `archival-manager.ts`      | Lifecycle management      | `runArchivalScan`, `archiveMemory`, `startBackgroundJob`                    |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:640:  archiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:641:  unarchiveMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:647:} from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:658:// scanResult = { scanned: 15, archived: 12 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:664:// Archive/unarchive
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:665:archiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:666:unarchiveMemory(memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:668:// Get archival candidates
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:674:// stats = { totalScanned, totalArchived, totalUnarchived, lastScanTime, errors }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:687:# maxAgeDays: 90                               # Days before eligible for archival
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:750:import * as archival from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:759:archival.init(db);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:763:// Start background archival
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:764:archival.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:885:**Cause**: Not archiving old memories, or archival job not running
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:889:import * as archival from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:891:// Check archival stats
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:892:const stats = archival.getStats();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:893:console.log('Background job:', archival.isBackgroundJobRunning());
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:896:if (!archival.isBackgroundJobRunning()) {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:897:  archival.startBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:901:const scanResult = archival.runArchivalScan();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:902:console.log(`Archived ${scanResult.archived} old memories`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:954:| Memory leak          | Enable archival: `archival.startBackgroundJob()`             |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:999:**Q: Can I disable automatic archival?**
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1003:import * as archival from './archival-manager';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1004:archival.stopBackgroundJob();
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1049:| `ARCHIVED_DAYS_THRESHOLD` | 90      | Days inactive before archival           |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1051:| `SPECKIT_ARCHIVAL`        | true    | Enable background archival job          |
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:508:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:515:        { content: testContent, database: mockDatabase, tenantId: 'tenant-a', userId: 'user-a' } as unknown as DuplicateParams,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:575:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:584:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:612:              shared_space_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:623:          tenantId: 'tenant-a',
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:624:          userId: 'user-a',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:212:    it('returns 0 when no edges and no history exist', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts:3:vi.mock('../lib/storage/history', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts:13:import { recordHistory } from '../lib/storage/history';
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-cleanup-ordering.vitest.ts:28:  it('skips DELETE history when orphan cleanup does not delete a row', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:123:    const contract = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:126:    expect(contract.sourceSurface).toBe('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/phase2-integration.vitest.ts:44:      CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:225:    // T-TC-15: Constitutional with extra fields still never archives
.opencode/skill/system-spec-kit/mcp_server/tests/unit-tier-classifier-types.vitest.ts:226:    it('T-TC-15: Constitutional never archives (with extras)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts:43:    CREATE TABLE IF NOT EXISTS weight_history (
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:28:describe('Session learning history normalization', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:43:  it('normalizes sessionId before filtering learning history queries', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:45:      specFolder: 'specs/session-history-normalization',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:46:      taskId: 'history-task',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:53:      specFolder: 'specs/session-history-normalization',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:54:      taskId: 'history-task',
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning.vitest.ts:62:      specFolder: 'specs/session-history-normalization',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:48:        'handle_get_learning_history',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);

codex
The broad grep confirmed the right seams: Engram’s agent/admin profile split, passive capture, session tools, project normalization, and merge flow are all real code paths, not just docs. I’m now pulling the exact slices so the final findings can stay concrete and avoid rehashing the earlier `topic_key` and delete-model work.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   161	// allowlist. If allowlist is nil, everything is allowed.
   162	func shouldRegister(name string, allowlist map[string]bool) bool {
   163		if allowlist == nil {
   164			return true
   165		}
   166		return allowlist[name]
   167	}
   168	
   169	func registerTools(srv *server.MCPServer, s *store.Store, cfg MCPConfig, allowlist map[string]bool) {
   170		// ─── mem_search (profile: agent, core — always in context) ─────────
   171		if shouldRegister("mem_search", allowlist) {
   172			srv.AddTool(
   173				mcp.NewTool("mem_search",
   174					mcp.WithDescription("Search your persistent memory across all sessions. Use this to find past decisions, bugs fixed, patterns used, files changed, or any context from previous coding sessions."),
   175					mcp.WithTitleAnnotation("Search Memory"),
   176					mcp.WithReadOnlyHintAnnotation(true),
   177					mcp.WithDestructiveHintAnnotation(false),
   178					mcp.WithIdempotentHintAnnotation(true),
   179					mcp.WithOpenWorldHintAnnotation(false),
   180					mcp.WithString("query",
   181						mcp.Required(),
   182						mcp.Description("Search query — natural language or keywords"),
   183					),
   184					mcp.WithString("type",
   185						mcp.Description("Filter by type: tool_use, file_change, command, file_read, search, manual, decision, architecture, bugfix, pattern"),
   186					),
   187					mcp.WithString("project",
   188						mcp.Description("Filter by project name"),
   189					),
   190					mcp.WithString("scope",
   191						mcp.Description("Filter by scope: project (default) or personal"),
   192					),
   193					mcp.WithNumber("limit",
   194						mcp.Description("Max results (default: 10, max: 20)"),
   195					),
   196				),
   197				handleSearch(s, cfg),
   198			)
   199		}
   200	
   201		// ─── mem_save (profile: agent, core — always in context) ───────────
   202		if shouldRegister("mem_save", allowlist) {
   203			srv.AddTool(
   204				mcp.NewTool("mem_save",
   205					mcp.WithTitleAnnotation("Save Memory"),
   206					mcp.WithReadOnlyHintAnnotation(false),
   207					mcp.WithDestructiveHintAnnotation(false),
   208					mcp.WithIdempotentHintAnnotation(false),
   209					mcp.WithOpenWorldHintAnnotation(false),
   210					mcp.WithDescription(`Save an important observation to persistent memory. Call this PROACTIVELY after completing significant work — don't wait to be asked.
   211	
   212	WHEN to save (call this after each of these):
   213	- Architectural decisions or tradeoffs
   214	- Bug fixes (what was wrong, why, how you fixed it)
   215	- New patterns or conventions established
   216	- Configuration changes or environment setup
   217	- Important discoveries or gotchas
   218	- File structure changes
   219	
   220	FORMAT for content — use this structured format:

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '450,640p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   450					mcp.WithOpenWorldHintAnnotation(false),
   451					mcp.WithNumber("id",
   452						mcp.Required(),
   453						mcp.Description("The observation ID to retrieve"),
   454					),
   455				),
   456				handleGetObservation(s),
   457			)
   458		}
   459	
   460		// ─── mem_session_summary (profile: agent, core — always in context) ─
   461		if shouldRegister("mem_session_summary", allowlist) {
   462			srv.AddTool(
   463				mcp.NewTool("mem_session_summary",
   464					mcp.WithTitleAnnotation("Save Session Summary"),
   465					mcp.WithReadOnlyHintAnnotation(false),
   466					mcp.WithDestructiveHintAnnotation(false),
   467					mcp.WithIdempotentHintAnnotation(false),
   468					mcp.WithOpenWorldHintAnnotation(false),
   469					mcp.WithDescription(`Save a comprehensive end-of-session summary. Call this when a session is ending or when significant work is complete. This creates a structured summary that future sessions will use to understand what happened.
   470	
   471	FORMAT — use this exact structure in the content field:
   472	
   473	## Goal
   474	[One sentence: what were we building/working on in this session]
   475	
   476	## Instructions
   477	[User preferences, constraints, or context discovered during this session. Things a future agent needs to know about HOW the user wants things done. Skip if nothing notable.]
   478	
   479	## Discoveries
   480	- [Technical finding, gotcha, or learning 1]
   481	- [Technical finding 2]
   482	- [Important API behavior, config quirk, etc.]
   483	
   484	## Accomplished
   485	- ✅ [Completed task 1 — with key implementation details]
   486	- ✅ [Completed task 2 — mention files changed]
   487	- 🔲 [Identified but not yet done — for next session]
   488	
   489	## Relevant Files
   490	- path/to/file.ts — [what it does or what changed]
   491	- path/to/other.go — [role in the architecture]
   492	
   493	GUIDELINES:
   494	- Be CONCISE but don't lose important details (file paths, error messages, decisions)
   495	- Focus on WHAT and WHY, not HOW (the code itself is in the repo)
   496	- Include things that would save a future agent time
   497	- The Discoveries section is the most valuable — capture gotchas and non-obvious learnings
   498	- Relevant Files should only include files that were significantly changed or are important for context`),
   499					mcp.WithString("content",
   500						mcp.Required(),
   501						mcp.Description("Full session summary using the Goal/Instructions/Discoveries/Accomplished/Files format"),
   502					),
   503					mcp.WithString("session_id",
   504						mcp.Description("Session ID (default: manual-save-{project})"),
   505					),
   506					mcp.WithString("project",
   507						mcp.Required(),
   508						mcp.Description("Project name"),
   509					),
   510				),
   511				handleSessionSummary(s, cfg),
   512			)
   513		}
   514	
   515		// ─── mem_session_start (profile: agent, deferred) ───────────────────
   516		if shouldRegister("mem_session_start", allowlist) {
   517			srv.AddTool(
   518				mcp.NewTool("mem_session_start",
   519					mcp.WithDescription("Register the start of a new coding session. Call this at the beginning of a session to track activity."),
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '720,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '2440,3235p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
  2440			name,
  2441		).Scan(&count)
  2442		return count, err
  2443	}
  2444	
  2445	// MergeResult summarizes the result of merging multiple project name variants
  2446	// into a single canonical project name.
  2447	type MergeResult struct {
  2448		Canonical           string   `json:"canonical"`
  2449		SourcesMerged       []string `json:"sources_merged"`
  2450		ObservationsUpdated int64    `json:"observations_updated"`
  2451		SessionsUpdated     int64    `json:"sessions_updated"`
  2452		PromptsUpdated      int64    `json:"prompts_updated"`
  2453	}
  2454	
  2455	// MergeProjects migrates all records from each source project name into the
  2456	// canonical name. Sources that equal the canonical (after normalization) or
  2457	// have no records are silently skipped — the operation is idempotent.
  2458	// All updates are performed inside a single transaction for atomicity.
  2459	func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
  2460		canonical, _ = NormalizeProject(canonical)
  2461		if canonical == "" {
  2462			return nil, fmt.Errorf("canonical project name must not be empty")
  2463		}
  2464	
  2465		result := &MergeResult{Canonical: canonical}
  2466	
  2467		err := s.withTx(func(tx *sql.Tx) error {
  2468			for _, src := range sources {
  2469				src, _ = NormalizeProject(src)
  2470				if src == "" || src == canonical {
  2471					continue
  2472				}
  2473	
  2474				res, err := s.execHook(tx, `UPDATE observations SET project = ? WHERE project = ?`, canonical, src)
  2475				if err != nil {
  2476					return fmt.Errorf("merge observations %q → %q: %w", src, canonical, err)
  2477				}
  2478				n, _ := res.RowsAffected()
  2479				result.ObservationsUpdated += n
  2480	
  2481				res, err = s.execHook(tx, `UPDATE sessions SET project = ? WHERE project = ?`, canonical, src)
  2482				if err != nil {
  2483					return fmt.Errorf("merge sessions %q → %q: %w", src, canonical, err)
  2484				}
  2485				n, _ = res.RowsAffected()
  2486				result.SessionsUpdated += n
  2487	
  2488				res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, canonical, src)
  2489				if err != nil {
  2490					return fmt.Errorf("merge prompts %q → %q: %w", src, canonical, err)
  2491				}
  2492				n, _ = res.RowsAffected()
  2493				result.PromptsUpdated += n
  2494	
  2495				result.SourcesMerged = append(result.SourcesMerged, src)
  2496			}
  2497			// Enqueue sync mutations so cloud sync picks up the merged records.
  2498			// Same pattern used by EnrollProject.
  2499			return s.backfillProjectSyncMutationsTx(tx, canonical)
  2500		})
  2501		if err != nil {
  2502			return nil, err
  2503		}
  2504	
  2505		return result, nil
  2506	}
  2507	
  2508	// ─── Project Pruning ─────────────────────────────────────────────────────────
  2509	
  2510	// PruneResult holds the outcome of pruning a single project.
  2511	type PruneResult struct {
  2512		Project         string `json:"project"`
  2513		SessionsDeleted int64  `json:"sessions_deleted"`
  2514		PromptsDeleted  int64  `json:"prompts_deleted"`
  2515	}
  2516	
  2517	// PruneProject removes all sessions and prompts for a project that has zero
  2518	// (non-deleted) observations. Returns an error if the project still has
  2519	// observations — the caller must verify first.
  2520	func (s *Store) PruneProject(project string) (*PruneResult, error) {
  2521		if project == "" {
  2522			return nil, fmt.Errorf("project name must not be empty")
  2523		}
  2524	
  2525		// Safety check: refuse to prune if observations exist.
  2526		count, err := s.CountObservationsForProject(project)
  2527		if err != nil {
  2528			return nil, fmt.Errorf("count observations: %w", err)
  2529		}
  2530		if count > 0 {
  2531			return nil, fmt.Errorf("project %q still has %d observations — cannot prune", project, count)
  2532		}
  2533	
  2534		result := &PruneResult{Project: project}
  2535	
  2536		err = s.withTx(func(tx *sql.Tx) error {
  2537			res, err := s.execHook(tx, `DELETE FROM user_prompts WHERE project = ?`, project)
  2538			if err != nil {
  2539				return fmt.Errorf("prune prompts: %w", err)
  2540			}
  2541			result.PromptsDeleted, _ = res.RowsAffected()
  2542	
  2543			res, err = s.execHook(tx, `DELETE FROM sessions WHERE project = ?`, project)
  2544			if err != nil {
  2545				return fmt.Errorf("prune sessions: %w", err)
  2546			}
  2547			result.SessionsDeleted, _ = res.RowsAffected()
  2548	
  2549			return nil
  2550		})
  2551		if err != nil {
  2552			return nil, err
  2553		}
  2554	
  2555		return result, nil
  2556	}
  2557	
  2558	// ─── Helpers ─────────────────────────────────────────────────────────────────
  2559	
  2560	func (s *Store) withTx(fn func(tx *sql.Tx) error) error {
  2561		tx, err := s.beginTxHook()
  2562		if err != nil {
  2563			return err
  2564		}
  2565		defer tx.Rollback()
  2566		if err := fn(tx); err != nil {
  2567			return err
  2568		}
  2569		return s.commitHook(tx)
  2570	}
  2571	
  2572	func (s *Store) createSessionTx(tx *sql.Tx, id, project, directory string) error {
  2573		_, err := s.execHook(tx,
  2574			`INSERT INTO sessions (id, project, directory) VALUES (?, ?, ?)
  2575			 ON CONFLICT(id) DO UPDATE SET
  2576			   project   = CASE WHEN sessions.project = '' THEN excluded.project ELSE sessions.project END,
  2577			   directory = CASE WHEN sessions.directory = '' THEN excluded.directory ELSE sessions.directory END`,
  2578			id, project, directory,
  2579		)
  2580		return err
  2581	}
  2582	
  2583	func (s *Store) ensureSyncState(targetKey string) error {
  2584		_, err := s.execHook(s.db,
  2585			`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
  2586			targetKey, SyncLifecycleIdle,
  2587		)
  2588		return err
  2589	}
  2590	
  2591	func (s *Store) getSyncState(targetKey string) (*SyncState, error) {
  2592		row := s.db.QueryRow(`
  2593			SELECT target_key, lifecycle, last_enqueued_seq, last_acked_seq, last_pulled_seq,
  2594			       consecutive_failures, backoff_until, lease_owner, lease_until, last_error, updated_at
  2595			FROM sync_state WHERE target_key = ?`, targetKey)
  2596		var state SyncState
  2597		if err := row.Scan(&state.TargetKey, &state.Lifecycle, &state.LastEnqueuedSeq, &state.LastAckedSeq, &state.LastPulledSeq, &state.ConsecutiveFailures, &state.BackoffUntil, &state.LeaseOwner, &state.LeaseUntil, &state.LastError, &state.UpdatedAt); err != nil {
  2598			return nil, err
  2599		}
  2600		return &state, nil
  2601	}
  2602	
  2603	func (s *Store) getSyncStateTx(tx *sql.Tx, targetKey string) (*SyncState, error) {
  2604		if _, err := s.execHook(tx,
  2605			`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
  2606			targetKey, SyncLifecycleIdle,
  2607		); err != nil {
  2608			return nil, err
  2609		}
  2610		row := tx.QueryRow(`
  2611			SELECT target_key, lifecycle, last_enqueued_seq, last_acked_seq, last_pulled_seq,
  2612			       consecutive_failures, backoff_until, lease_owner, lease_until, last_error, updated_at
  2613			FROM sync_state WHERE target_key = ?`, targetKey)
  2614		var state SyncState
  2615		if err := row.Scan(&state.TargetKey, &state.Lifecycle, &state.LastEnqueuedSeq, &state.LastAckedSeq, &state.LastPulledSeq, &state.ConsecutiveFailures, &state.BackoffUntil, &state.LeaseOwner, &state.LeaseUntil, &state.LastError, &state.UpdatedAt); err != nil {
  2616			return nil, err
  2617		}
  2618		return &state, nil
  2619	}
  2620	
  2621	func (s *Store) backfillProjectSyncMutationsTx(tx *sql.Tx, project string) error {
  2622		if err := s.backfillSessionSyncMutationsTx(tx, project); err != nil {
  2623			return err
  2624		}
  2625		if err := s.backfillObservationSyncMutationsTx(tx, project); err != nil {
  2626			return err
  2627		}
  2628		return s.backfillPromptSyncMutationsTx(tx, project)
  2629	}
  2630	
  2631	func (s *Store) repairEnrolledProjectSyncMutations() error {
  2632		return s.withTx(func(tx *sql.Tx) error {
  2633			rows, err := s.queryItHook(tx,
  2634				`SELECT project FROM sync_enrolled_projects ORDER BY project ASC`,
  2635			)
  2636			if err != nil {
  2637				return err
  2638			}
  2639			defer rows.Close()
  2640	
  2641			var projects []string
  2642			for rows.Next() {
  2643				var project string
  2644				if err := rows.Scan(&project); err != nil {
  2645					return err
  2646				}
  2647				projects = append(projects, project)
  2648			}
  2649			if err := rows.Err(); err != nil {
  2650				return err
  2651			}
  2652	
  2653			for _, project := range projects {
  2654				if err := s.backfillProjectSyncMutationsTx(tx, project); err != nil {
  2655					return err
  2656				}
  2657			}
  2658			return nil
  2659		})
  2660	}
  2661	
  2662	func (s *Store) backfillSessionSyncMutationsTx(tx *sql.Tx, project string) error {
  2663		rows, err := s.queryItHook(tx, `
  2664			SELECT id, project, directory, ended_at, summary
  2665			FROM sessions
  2666			WHERE project = ?
  2667			  AND NOT EXISTS (
  2668				SELECT 1
  2669				FROM sync_mutations sm
  2670				WHERE sm.target_key = ?
  2671				  AND sm.entity = ?
  2672				  AND sm.entity_key = sessions.id
  2673				  AND sm.source = ?
  2674			  )
  2675			ORDER BY started_at ASC, id ASC`,
  2676			project, DefaultSyncTargetKey, SyncEntitySession, SyncSourceLocal,
  2677		)
  2678		if err != nil {
  2679			return err
  2680		}
  2681		defer rows.Close()
  2682	
  2683		for rows.Next() {
  2684			var payload syncSessionPayload
  2685			if err := rows.Scan(&payload.ID, &payload.Project, &payload.Directory, &payload.EndedAt, &payload.Summary); err != nil {
  2686				return err
  2687			}
  2688			if err := s.enqueueSyncMutationTx(tx, SyncEntitySession, payload.ID, SyncOpUpsert, payload); err != nil {
  2689				return err
  2690			}
  2691		}
  2692		return rows.Err()
  2693	}
  2694	
  2695	func (s *Store) backfillObservationSyncMutationsTx(tx *sql.Tx, project string) error {
  2696		rows, err := s.queryItHook(tx, `
  2697			SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
  2698			FROM observations
  2699			WHERE ifnull(project, '') = ?
  2700			  AND deleted_at IS NULL
  2701			  AND NOT EXISTS (
  2702				SELECT 1
  2703				FROM sync_mutations sm
  2704				WHERE sm.target_key = ?
  2705				  AND sm.entity = ?
  2706				  AND sm.entity_key = observations.sync_id
  2707				  AND sm.source = ?
  2708			  )
  2709			ORDER BY id ASC`,
  2710			project, DefaultSyncTargetKey, SyncEntityObservation, SyncSourceLocal,
  2711		)
  2712		if err != nil {
  2713			return err
  2714		}
  2715		defer rows.Close()
  2716	
  2717		for rows.Next() {
  2718			var payload syncObservationPayload
  2719			if err := rows.Scan(&payload.SyncID, &payload.SessionID, &payload.Type, &payload.Title, &payload.Content, &payload.ToolName, &payload.Project, &payload.Scope, &payload.TopicKey); err != nil {
  2720				return err
  2721			}
  2722			if err := s.enqueueSyncMutationTx(tx, SyncEntityObservation, payload.SyncID, SyncOpUpsert, payload); err != nil {
  2723				return err
  2724			}
  2725		}
  2726		return rows.Err()
  2727	}
  2728	
  2729	func (s *Store) backfillPromptSyncMutationsTx(tx *sql.Tx, project string) error {
  2730		rows, err := s.queryItHook(tx, `
  2731			SELECT sync_id, session_id, content, project
  2732			FROM user_prompts
  2733			WHERE ifnull(project, '') = ?
  2734			  AND NOT EXISTS (
  2735				SELECT 1
  2736				FROM sync_mutations sm
  2737				WHERE sm.target_key = ?
  2738				  AND sm.entity = ?
  2739				  AND sm.entity_key = user_prompts.sync_id
  2740				  AND sm.source = ?
  2741			  )
  2742			ORDER BY id ASC`,
  2743			project, DefaultSyncTargetKey, SyncEntityPrompt, SyncSourceLocal,
  2744		)
  2745		if err != nil {
  2746			return err
  2747		}
  2748		defer rows.Close()
  2749	
  2750		for rows.Next() {
  2751			var payload syncPromptPayload
  2752			if err := rows.Scan(&payload.SyncID, &payload.SessionID, &payload.Content, &payload.Project); err != nil {
  2753				return err
  2754			}
  2755			if err := s.enqueueSyncMutationTx(tx, SyncEntityPrompt, payload.SyncID, SyncOpUpsert, payload); err != nil {
  2756				return err
  2757			}
  2758		}
  2759		return rows.Err()
  2760	}
  2761	
  2762	func (s *Store) enqueueSyncMutationTx(tx *sql.Tx, entity, entityKey, op string, payload any) error {
  2763		encoded, err := json.Marshal(payload)
  2764		if err != nil {
  2765			return err
  2766		}
  2767		project := extractProjectFromPayload(payload)
  2768		if _, err := s.execHook(tx,
  2769			`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
  2770			DefaultSyncTargetKey, SyncLifecycleIdle,
  2771		); err != nil {
  2772			return err
  2773		}
  2774		res, err := s.execHook(tx,
  2775			`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
  2776			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
  2777			DefaultSyncTargetKey, entity, entityKey, op, string(encoded), SyncSourceLocal, project,
  2778		)
  2779		if err != nil {
  2780			return err
  2781		}
  2782		seq, err := res.LastInsertId()
  2783		if err != nil {
  2784			return err
  2785		}
  2786		_, err = s.execHook(tx,
  2787			`UPDATE sync_state
  2788			 SET lifecycle = ?, last_enqueued_seq = ?, updated_at = datetime('now')
  2789			 WHERE target_key = ?`,
  2790			SyncLifecyclePending, seq, DefaultSyncTargetKey,
  2791		)
  2792		return err
  2793	}
  2794	
  2795	// extractProjectFromPayload returns the project string from a sync payload struct.
  2796	// It handles both string and *string Project fields across all entity payload types.
  2797	// Returns empty string if the payload has no project or project is nil.
  2798	func extractProjectFromPayload(payload any) string {
  2799		switch p := payload.(type) {
  2800		case syncSessionPayload:
  2801			return p.Project
  2802		case syncObservationPayload:
  2803			if p.Project != nil {
  2804				return *p.Project
  2805			}
  2806			return ""
  2807		case syncPromptPayload:
  2808			if p.Project != nil {
  2809				return *p.Project
  2810			}
  2811			return ""
  2812		default:
  2813			// Fallback: marshal to JSON and extract $.project via json.Unmarshal.
  2814			data, err := json.Marshal(payload)
  2815			if err != nil {
  2816				return ""
  2817			}
  2818			var generic struct {
  2819				Project *string `json:"project"`
  2820			}
  2821			if err := json.Unmarshal(data, &generic); err != nil || generic.Project == nil {
  2822				return ""
  2823			}
  2824			return *generic.Project
  2825		}
  2826	}
  2827	
  2828	func decodeSyncPayload(payload []byte, dest any) error {
  2829		trimmed := strings.TrimSpace(string(payload))
  2830		if trimmed == "" {
  2831			return fmt.Errorf("empty payload")
  2832		}
  2833		if trimmed[0] != '"' {
  2834			return json.Unmarshal([]byte(trimmed), dest)
  2835		}
  2836		var encoded string
  2837		if err := json.Unmarshal([]byte(trimmed), &encoded); err != nil {
  2838			return err
  2839		}
  2840		return json.Unmarshal([]byte(encoded), dest)
  2841	}
  2842	
  2843	func (s *Store) getObservationTx(tx *sql.Tx, id int64) (*Observation, error) {
  2844		row := tx.QueryRow(
  2845			`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
  2846			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  2847			 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
  2848		)
  2849		var o Observation
  2850		if err := row.Scan(&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content, &o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt, &o.CreatedAt, &o.UpdatedAt, &o.DeletedAt); err != nil {
  2851			return nil, err
  2852		}
  2853		return &o, nil
  2854	}
  2855	
  2856	func (s *Store) getObservationBySyncIDTx(tx *sql.Tx, syncID string, includeDeleted bool) (*Observation, error) {
  2857		query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
  2858			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  2859			 FROM observations WHERE sync_id = ?`
  2860		if !includeDeleted {
  2861			query += ` AND deleted_at IS NULL`
  2862		}
  2863		query += ` ORDER BY id DESC LIMIT 1`
  2864		row := tx.QueryRow(query, syncID)
  2865		var o Observation
  2866		if err := row.Scan(&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content, &o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt, &o.CreatedAt, &o.UpdatedAt, &o.DeletedAt); err != nil {
  2867			return nil, err
  2868		}
  2869		return &o, nil
  2870	}
  2871	
  2872	func observationPayloadFromObservation(obs *Observation) syncObservationPayload {
  2873		return syncObservationPayload{
  2874			SyncID:    obs.SyncID,
  2875			SessionID: obs.SessionID,
  2876			Type:      obs.Type,
  2877			Title:     obs.Title,
  2878			Content:   obs.Content,
  2879			ToolName:  obs.ToolName,
  2880			Project:   obs.Project,
  2881			Scope:     obs.Scope,
  2882			TopicKey:  obs.TopicKey,
  2883		}
  2884	}
  2885	
  2886	func (s *Store) applySessionPayloadTx(tx *sql.Tx, payload syncSessionPayload) error {
  2887		_, err := s.execHook(tx,
  2888			`INSERT INTO sessions (id, project, directory, ended_at, summary)
  2889			 VALUES (?, ?, ?, ?, ?)
  2890			 ON CONFLICT(id) DO UPDATE SET
  2891			   project = excluded.project,
  2892			   directory = excluded.directory,
  2893			   ended_at = COALESCE(excluded.ended_at, sessions.ended_at),
  2894			   summary = COALESCE(excluded.summary, sessions.summary)`,
  2895			payload.ID, payload.Project, payload.Directory, payload.EndedAt, payload.Summary,
  2896		)
  2897		return err
  2898	}
  2899	
  2900	func (s *Store) applyObservationUpsertTx(tx *sql.Tx, payload syncObservationPayload) error {
  2901		existing, err := s.getObservationBySyncIDTx(tx, payload.SyncID, true)
  2902		if err == sql.ErrNoRows {
  2903			_, err = s.execHook(tx,
  2904				`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
  2905				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), NULL)`,
  2906				payload.SyncID, payload.SessionID, payload.Type, payload.Title, payload.Content, payload.ToolName, payload.Project, normalizeScope(payload.Scope), payload.TopicKey, hashNormalized(payload.Content),
  2907			)
  2908			return err
  2909		}
  2910		if err != nil {
  2911			return err
  2912		}
  2913		_, err = s.execHook(tx,
  2914			`UPDATE observations
  2915			 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
  2916			 WHERE id = ?`,
  2917			payload.SessionID, payload.Type, payload.Title, payload.Content, payload.ToolName, payload.Project, normalizeScope(payload.Scope), payload.TopicKey, hashNormalized(payload.Content), existing.ID,
  2918		)
  2919		return err
  2920	}
  2921	
  2922	func (s *Store) applyObservationDeleteTx(tx *sql.Tx, payload syncObservationPayload) error {
  2923		existing, err := s.getObservationBySyncIDTx(tx, payload.SyncID, true)
  2924		if err == sql.ErrNoRows {
  2925			return nil
  2926		}
  2927		if err != nil {
  2928			return err
  2929		}
  2930		if payload.HardDelete {
  2931			_, err = s.execHook(tx, `DELETE FROM observations WHERE id = ?`, existing.ID)
  2932			return err
  2933		}
  2934		deletedAt := payload.DeletedAt
  2935		if deletedAt == nil {
  2936			now := Now()
  2937			deletedAt = &now
  2938		}
  2939		_, err = s.execHook(tx,
  2940			`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
  2941			deletedAt, existing.ID,
  2942		)
  2943		return err
  2944	}
  2945	
  2946	func (s *Store) applyPromptUpsertTx(tx *sql.Tx, payload syncPromptPayload) error {
  2947		var existingID int64
  2948		err := tx.QueryRow(`SELECT id FROM user_prompts WHERE sync_id = ? ORDER BY id DESC LIMIT 1`, payload.SyncID).Scan(&existingID)
  2949		if err == sql.ErrNoRows {
  2950			_, err = s.execHook(tx,
  2951				`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
  2952				payload.SyncID, payload.SessionID, payload.Content, payload.Project,
  2953			)
  2954			return err
  2955		}
  2956		if err != nil {
  2957			return err
  2958		}
  2959		_, err = s.execHook(tx,
  2960			`UPDATE user_prompts SET session_id = ?, content = ?, project = ? WHERE id = ?`,
  2961			payload.SessionID, payload.Content, payload.Project, existingID,
  2962		)
  2963		return err
  2964	}
  2965	
  2966	func (s *Store) queryObservations(query string, args ...any) ([]Observation, error) {
  2967		rows, err := s.queryItHook(s.db, query, args...)
  2968		if err != nil {
  2969			return nil, err
  2970		}
  2971		defer rows.Close()
  2972	
  2973		var results []Observation
  2974		for rows.Next() {
  2975			var o Observation
  2976			if err := rows.Scan(
  2977				&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content,
  2978				&o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt,
  2979				&o.CreatedAt, &o.UpdatedAt, &o.DeletedAt,
  2980			); err != nil {
  2981				return nil, err
  2982			}
  2983			results = append(results, o)
  2984		}
  2985		return results, rows.Err()
  2986	}
  2987	
  2988	func (s *Store) addColumnIfNotExists(tableName, columnName, definition string) error {
  2989		rows, err := s.queryItHook(s.db, fmt.Sprintf("PRAGMA table_info(%s)", tableName))
  2990		if err != nil {
  2991			return err
  2992		}
  2993		defer rows.Close()
  2994	
  2995		for rows.Next() {
  2996			var cid int
  2997			var name, typ string
  2998			var notNull int
  2999			var defaultValue any
  3000			var pk int
  3001			if err := rows.Scan(&cid, &name, &typ, &notNull, &defaultValue, &pk); err != nil {
  3002				return err
  3003			}
  3004			if name == columnName {
  3005				return nil
  3006			}
  3007		}
  3008		if err := rows.Err(); err != nil {
  3009			return err
  3010		}
  3011	
  3012		_, err = s.db.Exec(fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s %s", tableName, columnName, definition))
  3013		return err
  3014	}
  3015	
  3016	func (s *Store) migrateLegacyObservationsTable() error {
  3017		rows, err := s.queryItHook(s.db, "PRAGMA table_info(observations)")
  3018		if err != nil {
  3019			return err
  3020		}
  3021		defer rows.Close()
  3022	
  3023		var hasID bool
  3024		var idIsPrimaryKey bool
  3025		for rows.Next() {
  3026			var cid int
  3027			var name, typ string
  3028			var notNull int
  3029			var defaultValue any
  3030			var pk int
  3031			if err := rows.Scan(&cid, &name, &typ, &notNull, &defaultValue, &pk); err != nil {
  3032				return err
  3033			}
  3034			if name == "id" {
  3035				hasID = true
  3036				idIsPrimaryKey = pk == 1
  3037				break
  3038			}
  3039		}
  3040		if err := rows.Err(); err != nil {
  3041			return err
  3042		}
  3043	
  3044		if !hasID || idIsPrimaryKey {
  3045			return nil
  3046		}
  3047	
  3048		tx, err := s.beginTxHook()
  3049		if err != nil {
  3050			return fmt.Errorf("migrate legacy observations: begin tx: %w", err)
  3051		}
  3052		defer tx.Rollback()
  3053	
  3054		if _, err := s.execHook(tx, `
  3055			CREATE TABLE observations_migrated (
  3056				id         INTEGER PRIMARY KEY AUTOINCREMENT,
  3057				sync_id    TEXT,
  3058				session_id TEXT    NOT NULL,
  3059				type       TEXT    NOT NULL,
  3060				title      TEXT    NOT NULL,
  3061				content    TEXT    NOT NULL,
  3062				tool_name  TEXT,
  3063				project    TEXT,
  3064				scope      TEXT    NOT NULL DEFAULT 'project',
  3065				topic_key  TEXT,
  3066				normalized_hash TEXT,
  3067				revision_count INTEGER NOT NULL DEFAULT 1,
  3068				duplicate_count INTEGER NOT NULL DEFAULT 1,
  3069				last_seen_at TEXT,
  3070				created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  3071				updated_at TEXT    NOT NULL DEFAULT (datetime('now')),
  3072				deleted_at TEXT,
  3073				FOREIGN KEY (session_id) REFERENCES sessions(id)
  3074			);
  3075		`); err != nil {
  3076			return fmt.Errorf("migrate legacy observations: create table: %w", err)
  3077		}
  3078	
  3079		if _, err := s.execHook(tx, `
  3080			INSERT INTO observations_migrated (
  3081				id, sync_id, session_id, type, title, content, tool_name, project,
  3082				scope, topic_key, normalized_hash, revision_count, duplicate_count,
  3083				last_seen_at, created_at, updated_at, deleted_at
  3084			)
  3085			SELECT
  3086				CASE
  3087					WHEN id IS NULL THEN NULL
  3088					WHEN ROW_NUMBER() OVER (PARTITION BY id ORDER BY rowid) = 1 THEN CAST(id AS INTEGER)
  3089					ELSE NULL
  3090				END,
  3091				'obs-' || lower(hex(randomblob(16))),
  3092				session_id,
  3093				COALESCE(NULLIF(type, ''), 'manual'),
  3094				COALESCE(NULLIF(title, ''), 'Untitled observation'),
  3095				COALESCE(content, ''),
  3096				tool_name,
  3097				project,
  3098				CASE WHEN scope IS NULL OR scope = '' THEN 'project' ELSE scope END,
  3099				NULLIF(topic_key, ''),
  3100				normalized_hash,
  3101				CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
  3102				CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
  3103				last_seen_at,
  3104				COALESCE(NULLIF(created_at, ''), datetime('now')),
  3105				COALESCE(NULLIF(updated_at, ''), NULLIF(created_at, ''), datetime('now')),
  3106				deleted_at
  3107			FROM observations
  3108			ORDER BY rowid;
  3109		`); err != nil {
  3110			return fmt.Errorf("migrate legacy observations: copy rows: %w", err)
  3111		}
  3112	
  3113		if _, err := s.execHook(tx, "DROP TABLE observations"); err != nil {
  3114			return fmt.Errorf("migrate legacy observations: drop old table: %w", err)
  3115		}
  3116	
  3117		if _, err := s.execHook(tx, "ALTER TABLE observations_migrated RENAME TO observations"); err != nil {
  3118			return fmt.Errorf("migrate legacy observations: rename table: %w", err)
  3119		}
  3120	
  3121		if _, err := s.execHook(tx, `
  3122			DROP TRIGGER IF EXISTS obs_fts_insert;
  3123			DROP TRIGGER IF EXISTS obs_fts_update;
  3124			DROP TRIGGER IF EXISTS obs_fts_delete;
  3125			DROP TABLE IF EXISTS observations_fts;
  3126			CREATE VIRTUAL TABLE observations_fts USING fts5(
  3127				title,
  3128				content,
  3129				tool_name,
  3130				type,
  3131				project,
  3132				topic_key,
  3133				content='observations',
  3134				content_rowid='id'
  3135			);
  3136			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
  3137			SELECT id, title, content, tool_name, type, project, topic_key
  3138			FROM observations
  3139			WHERE deleted_at IS NULL;
  3140		`); err != nil {
  3141			return fmt.Errorf("migrate legacy observations: rebuild fts: %w", err)
  3142		}
  3143	
  3144		if err := s.commitHook(tx); err != nil {
  3145			return fmt.Errorf("migrate legacy observations: commit: %w", err)
  3146		}
  3147	
  3148		return nil
  3149	}
  3150	
  3151	func nullableString(s string) *string {
  3152		if s == "" {
  3153			return nil
  3154		}
  3155		return &s
  3156	}
  3157	
  3158	func truncate(s string, max int) string {
  3159		runes := []rune(s)
  3160		if len(runes) <= max {
  3161			return s
  3162		}
  3163		return string(runes[:max]) + "..."
  3164	}
  3165	
  3166	func normalizeScope(scope string) string {
  3167		v := strings.TrimSpace(strings.ToLower(scope))
  3168		if v == "personal" {
  3169			return "personal"
  3170		}
  3171		return "project"
  3172	}
  3173	
  3174	// NormalizeProject applies canonical project name normalization:
  3175	// lowercase + trim whitespace + collapse consecutive hyphens/underscores.
  3176	// Returns the normalized name and a warning message if the name was changed
  3177	// (empty string if no change was needed).
  3178	// Exported so MCP and CLI handlers can surface the warning to users.
  3179	func NormalizeProject(project string) (normalized string, warning string) {
  3180		if project == "" {
  3181			return "", ""
  3182		}
  3183		n := strings.TrimSpace(strings.ToLower(project))
  3184		// Collapse multiple consecutive hyphens
  3185		for strings.Contains(n, "--") {
  3186			n = strings.ReplaceAll(n, "--", "-")
  3187		}
  3188		// Collapse multiple consecutive underscores
  3189		for strings.Contains(n, "__") {
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

exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) Search|func \\(s \\*Store\\) FormatContext|func \\(s \\*Store\\) SavePrompt|direct topic_key match|sanitizeFTS|MATCH|duplicate_count|last_seen_at|RecentPrompts|session summary\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
50:	DuplicateCount int     `json:"duplicate_count"`
51:	LastSeenAt     *string `json:"last_seen_at,omitempty"`
89:	DuplicateCount int     `json:"duplicate_count"`
90:	LastSeenAt     *string `json:"last_seen_at,omitempty"`
463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
464:			last_seen_at TEXT,
553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
554:		{name: "last_seen_at", definition: "TEXT"},
616:	if _, err := s.execHook(s.db, `UPDATE observations SET duplicate_count = 1 WHERE duplicate_count IS NULL OR duplicate_count < 1`); err != nil {
908:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
937:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
988:					     last_seen_at = datetime('now'),
1031:				 SET duplicate_count = duplicate_count + 1,
1032:				     last_seen_at = datetime('now'),
1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
1086:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
1145:func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
1181:func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
1186:	ftsQuery := sanitizeFTS(query)
1192:		WHERE prompts_fts MATCH ?
1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1384:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1418:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1478:			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1519:	ftsQuery := sanitizeFTS(query)
1523:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
1624:	prompts, err := s.RecentPrompts(project, 10)
1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
3069:			last_seen_at TEXT,
3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
3083:			last_seen_at, created_at, updated_at, deleted_at
3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
3103:			last_seen_at,
3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:func sanitizeFTS(query string) string {

exec
/bin/zsh -lc 'rg -n "resolveTrustedSession|tenantId|sharedSpaceId|agentId|userId|memory_context|session_bootstrap|runPassiveEnrichment|shared_space|createAppendOnlyMemoryRecord|recordHistory|recordLineageTransition" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/session .opencode/skill/system-spec-kit/mcp_server/lib/storage .opencode/skill/system-spec-kit/mcp_server/context-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:45:import { recordHistory } from './lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1024:        const { runPassiveEnrichment } = await import('./lib/enrichment/passive-enrichment.js');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1025:        const enrichment = await runPassiveEnrichment(result.content[0].text);
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1441:          recordHistory(row.id, 'DELETE', filePath ?? null, null, 'mcp:file_watcher', row.spec_folder ?? null);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:92:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:93:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:94:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:102:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:103:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:104:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:159:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:160:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:161:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:331:  tenantId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:332:  userId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:333:  agentId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:351:    tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:352:    userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:353:    agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:358:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:361:  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:362:  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:363:    return 'tenantId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:366:  const requestedUserId = normalizeIdentityValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:367:  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:368:    return 'userId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:371:  const requestedAgentId = normalizeIdentityValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:372:  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:373:    return 'agentId';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:380:  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null } | null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:381:): storedIdentity is { tenantId: string | null; userId: string | null; agentId: string | null } {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:382:  return Boolean(storedIdentity && (storedIdentity.tenantId || storedIdentity.userId || storedIdentity.agentId));
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385:function resolveTrustedSession(
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1030:    const tenantId = normalizeIdentityValue(state.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1031:    const userId = normalizeIdentityValue(state.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1032:    const agentId = normalizeIdentityValue(state.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1064:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1065:      userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1066:      agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1150:      tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1151:      userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1152:      agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1167:      tenantId: storedIdentity.tenantId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1168:      userId: storedIdentity.userId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1169:      agentId: storedIdentity.agentId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1209:        tenantId: normalizeIdentityValue(row.tenant_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1210:        userId: normalizeIdentityValue(row.user_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1211:        agentId: normalizeIdentityValue(row.agent_id),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1413:  resolveTrustedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:31:type SharedSpaceAdminTool = 'shared_space_upsert' | 'shared_space_membership_set';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:147:  const userIdProvided = typeof args.actorUserId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:148:  const agentIdProvided = typeof args.actorAgentId === 'string';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:151:  const hasBlankUser = userIdProvided && normalizedUserId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:152:  const hasBlankAgent = agentIdProvided && normalizedAgentId.length === 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:210:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:212:  const normalizedTenantId = typeof tenantId === 'string' ? tenantId.trim() : '';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:221:        reason: 'shared_space_tenant_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:222:        hint: 'Provide the tenantId for the target shared-space mutation.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:262:  tenantId: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:263:  sharedSpaceId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:265:  tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:266:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:267:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:268:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:271:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:272:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:273:    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:274:    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:282:    tenantId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:291:    action: 'shared_space_admin',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:294:    ...buildActorScope(args.actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:310:    case 'shared_space_not_found':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:312:    case 'shared_space_create_admin_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:314:    case 'shared_space_tenant_mismatch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:316:    case 'shared_space_owner_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:317:      return tool === 'shared_space_membership_set'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:320:    case 'shared_space_editor_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:322:    case 'shared_space_membership_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:324:    case 'shared_space_kill_switch':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:326:    case 'shared_space_rollout_disabled':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:328:    case 'shared_space_tenant_required':
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:336:  return reason === 'shared_space_membership_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:337:    ? 'shared_space_owner_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:349:    code: reason === 'shared_space_not_found' ? 'E_NOT_FOUND' : 'E_AUTHORIZATION',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:352:      hint: reason === 'shared_space_not_found'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:353:        ? 'Create the space first with shared_space_upsert.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:354:        : reason === 'shared_space_create_admin_required'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:408:  tenantId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:415:  const normalizedTenantId = typeof tenantId === 'string' && tenantId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:416:    ? tenantId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:421:    FROM shared_space_members m
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:422:    JOIN shared_spaces s ON s.space_id = m.space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:454:        tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:461:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:464:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:472:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:485:            buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:490:            const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:493:              tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:505:              msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:511:        const reason = 'shared_space_create_admin_required';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:514:          tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:526:          msg: getSharedSpaceAccessErrorMessage('shared_space_upsert', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:533:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:566:        FROM shared_spaces
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:573:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:598:      return createSharedSpaceAuthError('shared_space_upsert', result.error, result.msg);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:602:      tool: 'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:606:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:621:      'shared_space_upsert',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:645:        tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:652:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:655:    }, args.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:660:        buildActorScope(actor, args.tenantId, args.spaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:665:        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:669:            tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:687:          'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:689:          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:704:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:720:      tool: 'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:724:        tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:738:      'shared_space_membership_set',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:762:      ? getAllowedSharedSpaceIdsForCaller(db, actor, args.tenantId)
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:772:        tenantId: args.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:773:        userId: actor.subjectType === 'user' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:774:        agentId: actor.subjectType === 'agent' ? actor.subjectId : null,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:911:| \`/memory:manage shared create <spaceId> <tenantId> <name>\` | Create or update a shared space; first creator becomes owner |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:40:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:61:  'shared_space_id', 'provenance_source', 'provenance_actor',
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:15:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:215:          recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:82:    'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:83:    'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:84:    'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:124:  'shared_spaces',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:125:  'shared_space_members',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:126:  'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:322:  'governance_audit', 'shared_spaces', 'shared_space_members', 'shared_space_conflicts',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:396:    const rawId = memory?.shared_space_id;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:431:    (normalizedScope.tenantId === undefined || metadata.tenantId === normalizedScope.tenantId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:432:    && (normalizedScope.userId === undefined || metadata.userId === normalizedScope.userId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:433:    && (normalizedScope.agentId === undefined || metadata.agentId === normalizedScope.agentId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:434:    && (normalizedScope.sharedSpaceId === undefined || metadata.sharedSpaceId === normalizedScope.sharedSpaceId)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:444:    || columns.has('shared_space_id')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:521:  if (normalizedScope.tenantId && columns.has('tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:523:    params.push(normalizedScope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:525:  if (normalizedScope.userId && columns.has('user_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:527:    params.push(normalizedScope.userId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:529:  if (normalizedScope.agentId && columns.has('agent_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:531:    params.push(normalizedScope.agentId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:533:  if (normalizedScope.sharedSpaceId && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:534:    clauses.push('shared_space_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:535:    params.push(normalizedScope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:648:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:653:  const { specFolder, memoryIds, sharedSpaceIds, scope = {}, allowedSharedSpaceIds } = options;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:699:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:700:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:703:        'SELECT * FROM shared_spaces WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:704:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:707:    if (normalizedScope.tenantId) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:709:        'SELECT * FROM shared_spaces WHERE tenant_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:710:      ).all(normalizedScope.tenantId) as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:712:    return hasScope ? [] : database.prepare('SELECT * FROM shared_spaces').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:715:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:716:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:719:        'SELECT * FROM shared_space_members WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:720:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:723:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_members').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:726:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:732:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:740:            SELECT * FROM shared_space_conflicts
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:747:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:750:        'SELECT * FROM shared_space_conflicts WHERE space_id IN (__PLACEHOLDERS__)',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:751:        sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:754:    return hasScope ? [] : database.prepare('SELECT * FROM shared_space_conflicts').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:810:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:908:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:917:    sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:957:  if (tableName === 'shared_spaces') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:958:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:962:  if (tableName === 'shared_space_members') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:963:    deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:967:  if (tableName === 'shared_space_conflicts') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:968:    if (sharedSpaceIds.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:969:      deleteRowsByStringIds(database, tableName, 'space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:997:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:998:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1012:  if (sharedSpaceIds.length > 0 && columns.has('shared_space_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1013:    deleteRowsByStringIds(database, tableName, 'shared_space_id', sharedSpaceIds);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1070:    sharedSpaceIds: string[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1428:      const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1442:          sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1487:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1488:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1489:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1490:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1520:          ...(normalizedScope.tenantId ? { tenantId: normalizedScope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1521:          ...(normalizedScope.userId ? { userId: normalizedScope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1522:          ...(normalizedScope.agentId ? { agentId: normalizedScope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1523:          ...(normalizedScope.sharedSpaceId ? { sharedSpaceId: normalizedScope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1646:    const sharedSpaceIds = Array.from(new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1728:                sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1860:              sharedSpaceIds,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:112:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:113:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:114:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:115:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212:    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:213:      tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:214:      userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:215:      agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:292:  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:293:  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:300:          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:308:          shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:317:          if (tenantId && row.tenant_id !== tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:318:          if (userId && row.user_id !== userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:319:          if (agentId && row.agent_id !== agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:320:          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:20:import { getHistoryEventsForLineage, init as initHistory, recordHistory, type HistoryLineageEvent } from './history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:38:  shared_space_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:213:    ['shared_space', normalizeScopeValue(row.shared_space_id)],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:666:export function recordLineageTransition(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:811:export function createAppendOnlyMemoryRecord(params: CreateAppendOnlyMemoryRecordParams): number {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:815:    recordLineageTransition(params.database, memoryId, {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1280:  return recordLineageTransition(database, params.memoryId, {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1369:    lastRecorded = recordLineageTransition(database, memoryId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:181:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:182:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:183:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:184:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:498:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:499:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:500:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:501:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:535:    tenantId: normalizedScope.tenantId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:536:    userId: normalizedScope.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:537:    agentId: normalizedScope.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:539:    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:724:    tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:725:    userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:726:    agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:727:    sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:781:      tenantId: normalizedScope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:782:      userId: normalizedScope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:783:      agentId: normalizedScope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:784:      sharedSpaceId: normalizedScope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:17:import { recordHistory } from './history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:24:import { recordLineageTransition } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:352:      recordLineageTransition(db, newId, {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:374:        recordHistory(newId, 'ADD', null, mergedTitle || existingMemory.file_path, 'mcp:reconsolidation');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:375:        recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:681:                  recordHistory(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:923:    shared_space_id: existingRow.shared_space_id,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:16:import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:19:import { recordHistory } from '../../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:102:  const tenantId = normalizeScopeMatchValue(scope.tenantId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:103:  const userId = normalizeScopeMatchValue(scope.userId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:104:  const agentId = normalizeScopeMatchValue(scope.agentId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:106:  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:118:      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:125:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:126:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:127:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:128:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:129:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:130:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:133:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:134:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:253:    recordLineageTransition(database, memory_id, {
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:286:        recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:131:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:132:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:133:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:135:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:165:  shared_space_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:177:  tenantId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:178:  userId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:179:  agentId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:181:  sharedSpaceId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:304: * Provides the recordHistory helper.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:306:export function recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:22:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:205:              recordHistory(existingChunk.id, 'DELETE', filePath ?? null, null, 'mcp:chunking_reindex', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:211:            recordHistory(existing.id, 'DELETE', filePath ?? null, null, 'mcp:chunking_reindex', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:415:                recordHistory(chunkRow.id, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:421:              recordHistory(parentId, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:430:                recordHistory(childId, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:550:            recordHistory(oldChildId, 'DELETE', filePath ?? null, null, 'mcp:chunking_reindex', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:567:                recordHistory(cid, 'DELETE', null, null, 'mcp:chunking_rollback', parsed.specFolder);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:20:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:266:            recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:7:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:8:import { recordLineageTransition } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:98:        if (!matchesScopedValue(tenantId, r.tenant_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:99:        if (!matchesScopedValue(userId, r.user_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:100:        if (!matchesScopedValue(agentId, r.agent_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:103:        if (!matchesScopedValue(sharedSpaceId, r.shared_space_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:296:    recordLineageTransition(database, nextMemoryId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:23:import { recordHistory } from '../../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:210:                if (scope?.tenantId && r.tenant_id && r.tenant_id !== scope.tenantId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:211:                if (scope?.userId && r.user_id && r.user_id !== scope.userId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:212:                if (scope?.agentId && r.agent_id && r.agent_id !== scope.agentId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:213:                if (scope?.sharedSpaceId && r.shared_space_id && r.shared_space_id !== scope.sharedSpaceId) return false;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:42:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:43:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:44:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:45:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:51:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:52:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:53:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:54:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:60:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:61:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:62:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:63:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:70:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:71:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:72:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:77:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:78:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:79:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:80:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:203:  const tenantId = validateValue(args.tenantId, 'tenantId', { trim: true });
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:204:  const userId = validateValue(args.userId, 'userId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:205:  const agentId = validateValue(args.agentId, 'agentId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:206:  const sharedSpaceId = validateValue(args.sharedSpaceId, 'sharedSpaceId');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:208:    userId !== undefined || agentId !== undefined || sharedSpaceId !== undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:212:    && tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:213:    && tenantId.trim().length === 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:215:    throw new Error('tenantId must be a non-empty string when userId, agentId, or sharedSpaceId is provided');
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:219:    tenantId: tenantId && tenantId.length > 0 ? tenantId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:220:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:221:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:222:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:228:    scope.tenantId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:229:    || scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:230:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:231:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:236:  return scope.tenantId === undefined && (
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:237:    scope.userId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:238:    || scope.agentId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:239:    || scope.sharedSpaceId !== undefined
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:249:    ...(scope.tenantId !== undefined ? { tenantId: scope.tenantId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:250:    ...(scope.userId !== undefined ? { userId: scope.userId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:251:    ...(scope.agentId !== undefined ? { agentId: scope.agentId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:252:    ...(scope.sharedSpaceId !== undefined ? { sharedSpaceId: scope.sharedSpaceId } : {}),
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:268:    matchesScopeField('tenantId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:269:    matchesScopeField('userId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:270:    matchesScopeField('agentId') &&
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:271:    matchesScopeField('sharedSpaceId')
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:277:  if (scope.tenantId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:278:    details.tenantId = scope.tenantId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:280:  if (scope.userId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:281:    details.userId = scope.userId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:283:  if (scope.agentId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:284:    details.agentId = scope.agentId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:286:  if (scope.sharedSpaceId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:287:    details.sharedSpaceId = scope.sharedSpaceId;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:297:    error: 'tenantId is required when userId, agentId, or sharedSpaceId is provided.',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:303:      hint: 'Retry with tenantId included for governed checkpoint access.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:79:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:80:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:81:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:82:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:116:  tenantId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:117:  userId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:118:  agentId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:119:  sharedSpaceId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:704:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:705:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:706:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:707:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:725:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:726:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:727:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:728:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:756:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:757:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:758:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:759:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:790:    tenantId: options.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:791:    userId: options.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:792:    agentId: options.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:793:    sharedSpaceId: options.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:829:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:830:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:831:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1281:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1282:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1283:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1284:    sharedSpaceId: args.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1354:    tenantId: args.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1355:    userId: args.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1356:    agentId: args.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:45:      tenantId: scope?.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:46:      userId: scope?.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:47:      agentId: scope?.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:49:      sharedSpaceId: scope?.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:36:import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:751:              tenantId: scope.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:752:              userId: scope.userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:753:              agentId: scope.agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:755:              sharedSpaceId: scope.sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:938:        ? createAppendOnlyMemoryRecord({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1106:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1107:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1108:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1110:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1137:    tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1138:    userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1139:    agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1141:    sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1154:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1155:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1157:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1164:  if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1166:      tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1167:      userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1168:      agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1170:      sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1171:    }, sharedSpaceId, 'editor');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1176:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1177:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1178:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1180:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1181:        reason: access.reason ?? 'shared_space_denied',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1183:      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1266:    tenantId: governanceDecision.normalized.tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1267:    userId: governanceDecision.normalized.userId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1268:    agentId: governanceDecision.normalized.agentId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1270:    sharedSpaceId: governanceDecision.normalized.sharedSpaceId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1285:        tenantId: saveScope.tenantId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1286:        userId: saveScope.userId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1287:        agentId: saveScope.agentId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1288:        sharedSpaceId: saveScope.sharedSpaceId ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1465:        tenantId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1466:        userId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1467:        agentId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1469:        sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1470:        reason: sharedSpaceId ? 'shared_space_save' : 'governed_ingest',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1474:      if (sharedSpaceId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1478:          WHERE shared_space_id = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1483:        `).get(sharedSpaceId, validatedPath, result.id) as { id?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1486:            spaceId: sharedSpaceId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:19:  ['tenant_id', 'tenantId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:20:  ['user_id', 'userId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:21:  ['agent_id', 'agentId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:23:  ['shared_space_id', 'sharedSpaceId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:57:    tenantId: normalizeScopeMatchValue(scope.tenantId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:58:    userId: normalizeScopeMatchValue(scope.userId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:59:    agentId: normalizeScopeMatchValue(scope.agentId),
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:61:    sharedSpaceId: normalizeScopeMatchValue(scope.sharedSpaceId),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:22:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:191:        recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:17:import { recordHistory } from '../lib/storage/history.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:103:          recordHistory(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:198:            recordHistory(

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1460,1715p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"handleCapturePassive|handleSessionSummary|handleSessionStart|handleSessionEnd|normalize project|warning|save prompt|FormatContext|Search\\(|sanitizeFTS\\(\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1186:	ftsQuery := sanitizeFTS(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1519:	ftsQuery := sanitizeFTS(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613:func (s *Store) FormatContext(project, scope string) (string, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2435:// warning instead of the heavier ListProjectsWithStats.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3176:// Returns the normalized name and a warning message if the name was changed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3178:// Exported so MCP and CLI handlers can surface the warning to users.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3179:func NormalizeProject(project string) (normalized string, warning string) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3384:func sanitizeFTS(query string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:197:			handleSearch(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:235:  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:511:			handleSessionSummary(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:538:			handleSessionStart(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:561:			handleSessionEnd(s),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:594:			handleCapturePassive(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625:func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:640:		results, err := s.Search(query, store.SearchOptions{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:694:		// Normalize project name and capture warning
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:876:			return mcp.NewToolResultError("Failed to save prompt: " + err.Error()), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:894:		context, err := s.FormatContext(project, scope)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1030:func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1064:func handleSessionStart(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1084:func handleSessionEnd(s *store.Store) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1097:func handleCapturePassive(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '640,1125p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1125,1165p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '350,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"type PassiveCapture|func \\(s \\*Store\\) PassiveCapture|Key Learnings|Aprendizajes Clave|Extracted|Duplicates\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
3397:type PassiveCaptureParams struct {
3405:type PassiveCaptureResult struct {
3406:	Extracted  int `json:"extracted"`  // Total learnings found in text
3408:	Duplicates int `json:"duplicates"` // Skipped because already existed
3422:// It looks for sections like "## Key Learnings:" or "## Aprendizajes Clave:"
3483:func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
3490:	result.Extracted = len(learnings)
3511:			result.Duplicates++

 succeeded in 0ms:
   350	  return {
   351	    tenantId: normalizeIdentityValue(row.tenant_id),
   352	    userId: normalizeIdentityValue(row.user_id),
   353	    agentId: normalizeIdentityValue(row.agent_id),
   354	  };
   355	}
   356	
   357	function getIdentityMismatch(
   358	  storedIdentity: { tenantId: string | null; userId: string | null; agentId: string | null },
   359	  scope: SessionIdentityScope = {},
   360	): string | null {
   361	  const requestedTenantId = normalizeIdentityValue(scope.tenantId);
   362	  if (requestedTenantId && storedIdentity.tenantId !== requestedTenantId) {
   363	    return 'tenantId';
   364	  }
   365	
   366	  const requestedUserId = normalizeIdentityValue(scope.userId);
   367	  if (requestedUserId && storedIdentity.userId !== requestedUserId) {
   368	    return 'userId';
   369	  }
   370	
   371	  const requestedAgentId = normalizeIdentityValue(scope.agentId);
   372	  if (requestedAgentId && storedIdentity.agentId !== requestedAgentId) {
   373	    return 'agentId';
   374	  }
   375	
   376	  return null;
   377	}
   378	
   379	function hasCorroboratedIdentity(
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
   461	  try {
   462	    db.exec(SCHEMA_SQL);
   463	    for (const indexSql of INDEX_SQL) {
   464	      db.exec(indexSql);
   465	    }
   466	    return { success: true };
   467	  } catch (error: unknown) {
   468	    const message = error instanceof Error ? error.message : String(error);
   469	    console.error(`[session-manager] Schema creation failed: ${message}`);
   470	    return { success: false, error: message };

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '1016,1038p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1016	        }
  1017	      }
  1018	    }
  1019	
  1020	    // F057: Passive context enrichment pipeline — adds code graph symbols
  1021	    // near mentioned file paths and session continuity warnings.
  1022	    if (result && !result.isError && result.content?.[0]?.text) {
  1023	      try {
  1024	        const { runPassiveEnrichment } = await import('./lib/enrichment/passive-enrichment.js');
  1025	        const enrichment = await runPassiveEnrichment(result.content[0].text);
  1026	        if (!enrichment.skipped && enrichment.hints.length > 0) {
  1027	          try {
  1028	            const envelope = JSON.parse(result.content[0].text) as Record<string, unknown>;
  1029	            if (envelope && typeof envelope === 'object' && !Array.isArray(envelope)) {
  1030	              const existingHints = Array.isArray(envelope.hints) ? envelope.hints as string[] : [];
  1031	              envelope.hints = [...existingHints, ...enrichment.hints];
  1032	              result.content[0].text = JSON.stringify(envelope, null, 2);
  1033	            }
  1034	          } catch {
  1035	            // Response is not JSON envelope — skip enrichment injection
  1036	          }
  1037	        }
  1038	      } catch (enrichErr: unknown) {

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3390,3535p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  3390		}
  3391		return strings.Join(words, " ")
  3392	}
  3393	
  3394	// ─── Passive Capture ─────────────────────────────────────────────────────────
  3395	
  3396	// PassiveCaptureParams holds the input for passive memory capture.
  3397	type PassiveCaptureParams struct {
  3398		SessionID string `json:"session_id"`
  3399		Content   string `json:"content"`
  3400		Project   string `json:"project,omitempty"`
  3401		Source    string `json:"source,omitempty"` // e.g. "subagent-stop", "session-end"
  3402	}
  3403	
  3404	// PassiveCaptureResult holds the output of passive memory capture.
  3405	type PassiveCaptureResult struct {
  3406		Extracted  int `json:"extracted"`  // Total learnings found in text
  3407		Saved      int `json:"saved"`      // New observations created
  3408		Duplicates int `json:"duplicates"` // Skipped because already existed
  3409	}
  3410	
  3411	// learningHeaderPattern matches section headers for learnings in both English and Spanish.
  3412	var learningHeaderPattern = regexp.MustCompile(
  3413		`(?im)^#{2,3}\s+(?:Aprendizajes(?:\s+Clave)?|Key\s+Learnings?|Learnings?):?\s*$`,
  3414	)
  3415	
  3416	const (
  3417		minLearningLength = 20
  3418		minLearningWords  = 4
  3419	)
  3420	
  3421	// ExtractLearnings parses structured learning items from text.
  3422	// It looks for sections like "## Key Learnings:" or "## Aprendizajes Clave:"
  3423	// and extracts numbered (1. text) or bullet (- text) items.
  3424	// Returns learnings from the LAST matching section (most recent output).
  3425	func ExtractLearnings(text string) []string {
  3426		matches := learningHeaderPattern.FindAllStringIndex(text, -1)
  3427		if len(matches) == 0 {
  3428			return nil
  3429		}
  3430	
  3431		// Process sections in reverse — use first valid one (most recent)
  3432		for i := len(matches) - 1; i >= 0; i-- {
  3433			sectionStart := matches[i][1]
  3434			sectionText := text[sectionStart:]
  3435	
  3436			// Cut off at next major section header
  3437			if nextHeader := regexp.MustCompile(`\n#{1,3} `).FindStringIndex(sectionText); nextHeader != nil {
  3438				sectionText = sectionText[:nextHeader[0]]
  3439			}
  3440	
  3441			var learnings []string
  3442	
  3443			// Try numbered items: "1. text" or "1) text"
  3444			numbered := regexp.MustCompile(`(?m)^\s*\d+[.)]\s+(.+)`).FindAllStringSubmatch(sectionText, -1)
  3445			if len(numbered) > 0 {
  3446				for _, m := range numbered {
  3447					cleaned := cleanMarkdown(m[1])
  3448					if len(cleaned) >= minLearningLength && len(strings.Fields(cleaned)) >= minLearningWords {
  3449						learnings = append(learnings, cleaned)
  3450					}
  3451				}
  3452			}
  3453	
  3454			// Fall back to bullet items: "- text" or "* text"
  3455			if len(learnings) == 0 {
  3456				bullets := regexp.MustCompile(`(?m)^\s*[-*]\s+(.+)`).FindAllStringSubmatch(sectionText, -1)
  3457				for _, m := range bullets {
  3458					cleaned := cleanMarkdown(m[1])
  3459					if len(cleaned) >= minLearningLength && len(strings.Fields(cleaned)) >= minLearningWords {
  3460						learnings = append(learnings, cleaned)
  3461					}
  3462				}
  3463			}
  3464	
  3465			if len(learnings) > 0 {
  3466				return learnings
  3467			}
  3468		}
  3469	
  3470		return nil
  3471	}
  3472	
  3473	// cleanMarkdown strips basic markdown formatting and collapses whitespace.
  3474	func cleanMarkdown(text string) string {
  3475		text = regexp.MustCompile(`\*\*([^*]+)\*\*`).ReplaceAllString(text, "$1") // bold
  3476		text = regexp.MustCompile("`([^`]+)`").ReplaceAllString(text, "$1")       // inline code
  3477		text = regexp.MustCompile(`\*([^*]+)\*`).ReplaceAllString(text, "$1")     // italic
  3478		return strings.TrimSpace(strings.Join(strings.Fields(text), " "))
  3479	}
  3480	
  3481	// PassiveCapture extracts learnings from text and saves them as observations.
  3482	// It deduplicates against existing observations using content hash matching.
  3483	func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
  3484		// Normalize project name before storing
  3485		p.Project, _ = NormalizeProject(p.Project)
  3486	
  3487		result := &PassiveCaptureResult{}
  3488	
  3489		learnings := ExtractLearnings(p.Content)
  3490		result.Extracted = len(learnings)
  3491	
  3492		if len(learnings) == 0 {
  3493			return result, nil
  3494		}
  3495	
  3496		for _, learning := range learnings {
  3497			// Check if this learning already exists (by content hash) within this project
  3498			normHash := hashNormalized(learning)
  3499			var existingID int64
  3500			err := s.db.QueryRow(
  3501				`SELECT id FROM observations
  3502				 WHERE normalized_hash = ?
  3503				   AND ifnull(project, '') = ifnull(?, '')
  3504				   AND deleted_at IS NULL
  3505				 LIMIT 1`,
  3506				normHash, nullableString(p.Project),
  3507			).Scan(&existingID)
  3508	
  3509			if err == nil {
  3510				// Already exists — skip
  3511				result.Duplicates++
  3512				continue
  3513			}
  3514	
  3515			// Truncate for title: first 60 chars
  3516			title := learning
  3517			if len(title) > 60 {
  3518				title = title[:60] + "..."
  3519			}
  3520	
  3521			_, err = s.AddObservation(AddObservationParams{
  3522				SessionID: p.SessionID,
  3523				Type:      "passive",
  3524				Title:     title,
  3525				Content:   learning,
  3526				Project:   p.Project,
  3527				Scope:     "project",
  3528				ToolName:  p.Source,
  3529			})
  3530			if err != nil {
  3531				return result, fmt.Errorf("passive capture save: %w", err)
  3532			}
  3533			result.Saved++
  3534		}
  3535	

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1100,1195p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts | sed -n '90,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1100	  const {
  1101	    filePath: file_path,
  1102	    force = false,
  1103	    dryRun = false,
  1104	    skipPreflight = false,
  1105	    asyncEmbedding = false,
  1106	    tenantId,
  1107	    userId,
  1108	    agentId,
  1109	    sessionId,
  1110	    sharedSpaceId,
  1111	    provenanceSource,
  1112	    provenanceActor,
  1113	    governedAt,
  1114	    retentionPolicy,
  1115	    deleteAfter,
  1116	  } = args;
  1117	
  1118	  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
  1119	  if (!file_path || typeof file_path !== 'string') {
  1120	    throw new Error('filePath is required and must be a string');
  1121	  }
  1122	
  1123	  await checkDatabaseUpdated();
  1124	
  1125	  const validatedPath: string = validateFilePathLocal(file_path);
  1126	  const database = requireDb();
  1127	
  1128	  if (!memoryParser.isMemoryFile(validatedPath)) {
  1129	    throw new Error('File must be a .md or .txt file in: specs/**/memory/, specs/**/ (spec docs), or .opencode/skill/*/constitutional/');
  1130	  }
  1131	
  1132	  if (typeof database.exec === 'function') {
  1133	    ensureGovernanceRuntime(database);
  1134	  }
  1135	
  1136	  const governanceDecision = validateGovernedIngest({
  1137	    tenantId,
  1138	    userId,
  1139	    agentId,
  1140	    sessionId,
  1141	    sharedSpaceId,
  1142	    provenanceSource,
  1143	    provenanceActor,
  1144	    governedAt,
  1145	    retentionPolicy,
  1146	    deleteAfter,
  1147	  });
  1148	
  1149	  if (!governanceDecision.allowed) {
  1150	    recordGovernanceAudit(database, {
  1151	      action: 'memory_save',
  1152	      decision: 'deny',
  1153	      tenantId,
  1154	      userId,
  1155	      agentId,
  1156	      sessionId,
  1157	      sharedSpaceId,
  1158	      reason: governanceDecision.reason ?? 'governance_rejected',
  1159	      metadata: { issues: governanceDecision.issues },
  1160	    });
  1161	    throw new Error(`Governed ingest rejected: ${governanceDecision.issues.join('; ')}`);
  1162	  }
  1163	
  1164	  if (sharedSpaceId) {
  1165	    const access = assertSharedSpaceAccess(database, {
  1166	      tenantId,
  1167	      userId,
  1168	      agentId,
  1169	      sessionId,
  1170	      sharedSpaceId,
  1171	    }, sharedSpaceId, 'editor');
  1172	    if (!access.allowed) {
  1173	      recordGovernanceAudit(database, {
  1174	        action: 'memory_save_shared_space',
  1175	        decision: 'deny',
  1176	        tenantId,
  1177	        userId,
  1178	        agentId,
  1179	        sessionId,
  1180	        sharedSpaceId,
  1181	        reason: access.reason ?? 'shared_space_denied',
  1182	      });
  1183	      throw new Error(`Shared-memory save denied: ${access.reason ?? 'shared_space_denied'}`);
  1184	    }
  1185	  }
  1186	
  1187	  // DryRun must remain non-mutating even when preflight is explicitly skipped.
  1188	  if (dryRun && skipPreflight) {
  1189	    const parsedForDryRun = memoryParser.parseMemoryFile(validatedPath);
  1190	    const preparedDryRun = prepareParsedMemoryForIndexing(parsedForDryRun, database, {
  1191	      emitEvalMetrics: false,
  1192	    });
  1193	    const templateContractPass = preparedDryRun.templateContract.valid
  1194	      || shouldBypassTemplateContract(
  1195	        preparedDryRun.sourceClassification,

 succeeded in 0ms:
    90	    true,
    91	    'auto',
    92	  );
    93	}
    94	
    95	export function findSamePathExistingMemory(
    96	  database: BetterSqlite3.Database,
    97	  specFolder: string,
    98	  canonicalFilePath: string,
    99	  filePath: string,
   100	  scope: MemoryScopeMatch = {},
   101	): { id: number; title: string | null; content_hash?: string | null } | undefined {
   102	  const tenantId = normalizeScopeMatchValue(scope.tenantId);
   103	  const userId = normalizeScopeMatchValue(scope.userId);
   104	  const agentId = normalizeScopeMatchValue(scope.agentId);
   105	  const sessionId = normalizeScopeMatchValue(scope.sessionId);
   106	  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);
   107	
   108	  return database.prepare(`
   109	    SELECT id, title, content_hash
   110	    FROM memory_index
   111	    WHERE spec_folder = ?
   112	      AND parent_id IS NULL
   113	      AND (canonical_file_path = ? OR file_path = ?)
   114	      AND ((? IS NULL AND tenant_id IS NULL) OR tenant_id = ?)
   115	      AND ((? IS NULL AND user_id IS NULL) OR user_id = ?)
   116	      AND ((? IS NULL AND agent_id IS NULL) OR agent_id = ?)
   117	      AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
   118	      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
   119	    ORDER BY id DESC
   120	    LIMIT 1
   121	  `).get(
   122	    specFolder,
   123	    canonicalFilePath,
   124	    filePath,
   125	    tenantId,
   126	    tenantId,
   127	    userId,
   128	    userId,
   129	    agentId,
   130	    agentId,
   131	    sessionId,
   132	    sessionId,
   133	    sharedSpaceId,
   134	    sharedSpaceId,
   135	  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
   136	}
   137	
   138	/**
   139	 * Creates a memory row with metadata, optional BM25 entry, and save history.
   140	 * Returns the persisted memory id for downstream save handlers.
   141	 */
   142	export function createMemoryRecord(
   143	  database: BetterSqlite3.Database,
   144	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
   145	  filePath: string,
   146	  embedding: Float32Array | null,
   147	  embeddingFailureReason: string | null,
   148	  peDecision: PeDecision,
   149	  scope: MemoryScopeMatch = {},
   150	): number {
   151	  if (!embedding) {
   152	    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
   153	  }
   154	
   155	  // Detect spec level for spec documents.
   156	  const specLevel = isSpecDocumentType(parsed.documentType)
   157	    ? detectSpecLevelFromParsed(filePath)
   158	    : null;
   159	  const encodingIntent = isEncodingIntentEnabled()
   160	    ? classifyEncodingIntent(parsed.content)
   161	    : undefined;
   162	  const canonicalFilePath = getCanonicalPathKey(filePath);
   163	  // Security: raw provider errors sanitized before persistence/response
   164	  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);
   165	
   166	  const indexWithMetadata = database.transaction(() => {
   167	    // Determine importance weight based on document type.
   168	    const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
   169	    const samePathExisting = findSamePathExistingMemory(
   170	      database,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '640,720p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   640	    ensureSharedCollabRuntime(db);
   641	
   642	    const enabled = isSharedMemoryEnabled(db);
   643	    if (!enabled) {
   644	      return createMCPErrorResponse({
   645	        tool: 'shared_space_membership_set',
   646	        error: 'Shared memory is not enabled. Run /memory:manage shared enable first.',
   647	        code: 'SHARED_MEMORY_DISABLED',
   648	      });
   649	    }
   650	
   651	    const { actor, isAdmin } = validateCallerAuth({
   652	      tool: 'shared_space_membership_set',
   653	      actorUserId: args.actorUserId,
   654	      actorAgentId: args.actorAgentId,
   655	    }, args.tenantId);
   656	
   657	    if (!isAdmin) {
   658	      const access = assertSharedSpaceAccess(
   659	        db,
   660	        buildActorScope(actor, args.tenantId, args.spaceId),
   661	        args.spaceId,
   662	        'owner',
   663	      );
   664	      if (!access.allowed) {
   665	        const reason = normalizeOwnerAdminDenyReason(access.reason ?? 'shared_space_owner_required');
   666	        try {
   667	          recordSharedSpaceAdminAudit(db, {
   668	            actor,
   669	            tenantId: args.tenantId,
   670	            spaceId: args.spaceId,
   671	            decision: 'deny',
   672	            operation: 'membership_set',
   673	            reason,
   674	            metadata: {
   675	              operationType: 'membership_update',
   676	              actorAuthRole: 'owner',
   677	              subjectType: args.subjectType,
   678	              subjectId: args.subjectId,
   679	              role: args.role,
   680	            },
   681	          });
   682	        } catch (error: unknown) {
   683	          const message = error instanceof Error ? error.message : String(error);
   684	          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
   685	        }
   686	        return createSharedSpaceAuthError(
   687	          'shared_space_membership_set',
   688	          reason,
   689	          getSharedSpaceAccessErrorMessage('shared_space_membership_set', args.spaceId, reason),
   690	        );
   691	      }
   692	    }
   693	
   694	    db.transaction(() => {
   695	      upsertSharedMembership(db, {
   696	        spaceId: args.spaceId,
   697	        subjectType: args.subjectType,
   698	        subjectId: args.subjectId,
   699	        role: args.role,
   700	      });
   701	
   702	      recordSharedSpaceAdminAudit(db, {
   703	        actor,
   704	        tenantId: args.tenantId,
   705	        spaceId: args.spaceId,
   706	        decision: 'allow',
   707	        operation: 'membership_set',
   708	        reason: 'membership_updated',
   709	        metadata: {
   710	          operationType: 'membership_update',
   711	          actorAuthRole: isAdmin ? 'admin' : 'owner',
   712	          subjectType: args.subjectType,
   713	          subjectId: args.subjectId,
   714	          role: args.role,
   715	        },
   716	      });
   717	    })();
   718	
   719	    return createMCPSuccessResponse({
   720	      tool: 'shared_space_membership_set',

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '292,326p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   292	  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
   293	  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
   294	    try {
   295	      const database = initialize_db();
   296	      const memoryIds = results.map(r => r.memoryId);
   297	      if (memoryIds.length > 0) {
   298	        const placeholders = memoryIds.map(() => '?').join(',');
   299	        const scopeRows = database.prepare(`
   300	          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
   301	          FROM memory_index WHERE id IN (${placeholders})
   302	        `).all(...memoryIds) as Array<{
   303	          id: number;
   304	          spec_folder?: string;
   305	          tenant_id?: string;
   306	          user_id?: string;
   307	          agent_id?: string;
   308	          shared_space_id?: string;
   309	        }>;
   310	        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
   311	        results = results.filter(match => {
   312	          const row = scopeMap.get(match.memoryId);
   313	          if (!row) return false;
   314	          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
   315	          // when the caller specifies a scope, not silently passed through.
   316	          if (specFolder && row.spec_folder !== specFolder) return false;
   317	          if (tenantId && row.tenant_id !== tenantId) return false;
   318	          if (userId && row.user_id !== userId) return false;
   319	          if (agentId && row.agent_id !== agentId) return false;
   320	          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
   321	          return true;
   322	        });
   323	      }
   324	    } catch (scopeErr: unknown) {
   325	      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
   326	      results = [];

codex
I’ve got the exact code slices now. I’m doing one smaller CocoIndex pass as requested to confirm the conceptual entry points semantically; if it’s still weak on this Go tree, I’ll note that and keep the final report anchored to the direct `rg` and file reads we already verified.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "MCP|stdio|project|session summary|prompt|passive|agent|admin|merge" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
6:  <strong>Persistent memory for AI coding agents</strong><br>
23:Your AI coding agent forgets everything when the session ends. Engram gives it a brain.
25:A **Go binary** with SQLite + FTS5 full-text search, exposed via CLI, HTTP API, MCP server, and an interactive TUI. Works with **any agent** that supports MCP — Claude Code, OpenCode, Gemini CLI, Codex, VS Code (Copilot), Antigravity, Cursor, Windsurf, or anything else.
29:    ↓ MCP stdio
54:| Cursor / Windsurf / Any MCP | See [docs/AGENT-SETUP.md](docs/AGENT-SETUP.md) |
56:Full per-agent config, Memory Protocol, and compaction survival → [docs/AGENT-SETUP.md](docs/AGENT-SETUP.md)
66:4. Next session: agent searches memory, gets relevant context
71:## MCP Tools
84:| `mem_save_prompt` | Save user prompt |
88:| `mem_capture_passive` | Extract learnings from text output |
89:| `mem_merge_projects` | Merge project name variants (admin) |
110:Share memories across machines. Uses compressed chunks — no merge conflicts, no huge files.
125:| `engram setup [agent]` | Install agent integration |
127:| `engram mcp` | Start MCP server (stdio). Accepts `--project` or `ENGRAM_PROJECT` |
132:| `engram context [project]` | Recent session context |
137:| `engram projects list` | Show all projects with observation/session/prompt counts |
138:| `engram projects consolidate` | Interactive merge of similar project names (`--all`, `--dry-run`) |
139:| `engram projects prune` | Remove projects with 0 observations (`--dry-run`) |
147:| [Agent Setup](docs/AGENT-SETUP.md) | Per-agent configuration + Memory Protocol |
148:| [Architecture](docs/ARCHITECTURE.md) | How it works + MCP tools + project structure |
160:**Inspired by [claude-mem](https://github.com/thedotmack/claude-mem)** — but agent-agnostic, simpler, and built different.

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
/bin/zsh -lc 'find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-005.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-006.md

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-006.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
### Finding 4: Engram treats user prompts as a separately searchable corpus instead of mixing them into main memory ranking
- **Source**: [external/internal/store/store.go#L501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L501), [external/internal/store/store.go#L1181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1181), [external/internal/store/store.go#L1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613), [external/internal/server/server.go#L121](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L121), [external/internal/server/server.go#L411](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L411)
- **What it does**: Engram creates a dedicated `prompts_fts` table, exposes prompt search on the HTTP side, and includes recent prompts in `FormatContext()`. But `mem_search` itself still delegates only to observation search, so prompt recall is a side channel rather than a contaminant in the main relevance lane.
- **Why it matters for us**: That separation is cleaner than stuffing prompts into the same ranked pool as decisions, observations, and summaries. Public could benefit from a queryable prompt ledger later, but it should stay distinct from `memory_search` unless explicitly requested.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Engram’s MCP search surface is intentionally thin; the useful lesson is ergonomic profiling, not ranking design
- **Source**: [external/internal/mcp/mcp.go#L53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L53), [external/internal/mcp/mcp.go#L69](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L69), [external/internal/mcp/mcp.go#L169](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L169), [external/internal/mcp/mcp.go#L625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L625), [hybrid-search.ts#L1008](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1008), [hybrid-search.ts#L1226](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1226), [hybrid-search.ts#L1253](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1253), [stage3-rerank.ts#L146](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L146)
- **What it does**: Engram’s `ProfileAgent`/`ProfileAdmin` split keeps search-facing tools narrow, and `handleSearch()` is basically a typed pass-through to `Store.Search()`. Public, by contrast, routes channels by query complexity, fuses weighted result lists with RRF/adaptive weights, and then reranks with cross-encoder or local GGUF plus MMR.
- **Why it matters for us**: The win worth borrowing is product ergonomics: a smaller agent-safe retrieval profile or “fast search” persona. The ranking stack itself is already stronger on the Public side, so Engram is a UI-surface reference here, not a retrieval-algorithm upgrade.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Public already exceeds Engram on query expansion and post-fusion ranking, so Engram should influence fallback lanes and hygiene only
- **Source**: [stage1-candidate-gen.ts#L13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L13), [stage1-candidate-gen.ts#L1088](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L1088), [stage1-candidate-gen.ts#L1176](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L1176), [stage1-candidate-gen.ts#L1214](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L1214), [hybrid-search.ts#L1094](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1094), [hybrid-search.ts#L1104](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L1104), [stage3-rerank.ts#L166](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts#L166), [memory-search.ts#L1234](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1234)
- **What it does**: Public already supports deep-mode multi-query reformulation, HyDE, summary-embedding retrieval, weighted lexical lanes, RRF fusion, and post-fusion reranking/MMR. Engram has none of that in its main retrieval path; it relies on exact shortcuts and a curated corpus instead.
- **Why it matters for us**: The practical conclusion is narrow: keep our hybrid ranking architecture, and treat Engram as evidence for adding exact thread-key shortcuts, prompt-side channels, and maybe thinner tool profiles. It is not evidence that we should simplify `memory_search` down to plain FTS5 ordering.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
- [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
- [stage3-rerank.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)

## Assessment
- New information ratio: 0.66
- Questions addressed: Q1, Q3, Q4, Q5, Q9
- Questions answered: Q3, Q4, Q5, Q9
- Questions partially answered: Q1

## Reflection
- What worked: tracing `Store.Search()` and `sanitizeFTS()` first, then moving backward into `AddObservation()` and forward into MCP registration, made it clear that Engram’s retrieval quality depends more on exact shortcut lanes and corpus consolidation than on sophisticated ranking. Comparing that directly against Public’s lexical lane, fusion stage, and rerank stage kept the recommendations concrete.
- What did not work: CocoIndex was not usable in this session, so I fell back to `rg` plus direct file reads. I also did not run validators or write phase artifacts in this read-only iteration.

## Recommended Next Focus
Trace the sync/import path next, especially `applySessionPayloadTx()` and the observation sync payload handling in Engram, to see whether `topic_key`, `revision_count`, `duplicate_count`, prompts, and summaries retain their search value after cross-machine import and project merge. That will tell us whether Engram’s search shortcuts are durable storage semantics or just local-session conveniences.

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
# Iteration 006: MEMORY HYGIENE

## Focus
MEMORY HYGIENE: Deduplication, upserts, revision tracking, garbage collection, soft deletes, topic key stability.

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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '752,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1310,1365p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1310	  );
  1311	  const {
  1312	    detectedIntent,
  1313	    intentConfidence,
  1314	    resumeHeuristicApplied,
  1315	    source: intentSource,
  1316	  } = intentClassification;
  1317	
  1318	  // Phase C: Intent-to-profile auto-routing for memory_context.
  1319	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  1320	  // Skip for 'quick' mode: quick routes through handleMemoryMatchTriggers which does not
  1321	  // support profile formatting — setting a profile there would be a no-op.
  1322	  if (!options.profile && detectedIntent && effectiveMode !== 'quick' && isIntentAutoProfileEnabled()) {
  1323	    try {
  1324	      const autoProfile = intentClassifier.getProfileForIntent(
  1325	        detectedIntent as import('../lib/search/intent-classifier.js').IntentType
  1326	      );
  1327	      if (autoProfile) {
  1328	        options.profile = autoProfile;
  1329	        console.error(`[memory-context] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
  1330	      }
  1331	    } catch (_autoProfileErr: unknown) {
  1332	      // Auto-profile is best-effort — never breaks context retrieval
  1333	    }
  1334	  }
  1335	
  1336	  const sessionTransition = buildSessionTransitionTrace({
  1337	    previousState,
  1338	    resumedSession,
  1339	    effectiveMode,
  1340	    requestedMode: requested_mode,
  1341	    detectedIntent: detectedIntent ?? null,
  1342	    pressureOverrideApplied,
  1343	    queryHeuristicApplied: resumeHeuristicApplied,
  1344	  });
  1345	  options.sessionTransition = options.includeTrace === true ? sessionTransition : undefined;
  1346	
  1347	  const discoveredFolder = maybeDiscoverSpecFolder(options, { ...args, input: normalizedInput });
  1348	  // FIX P0: Folder discovery sets options.folderBoost for scoring only.
  1349	  // Do NOT propagate as options.specFolder — that becomes an exact-match filter
  1350	  // in vector-index-queries.ts (m.spec_folder = ?) which silently drops all
  1351	  // results when the discovered path has no indexed memories.
  1352	  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
  1353	    specFolder: options.specFolder ?? discoveredFolder ?? spec_folder,
  1354	    tenantId: args.tenantId,
  1355	    userId: args.userId,
  1356	    agentId: args.agentId,
  1357	    currentTask: normalizedInput.slice(0, 500),
  1358	  });
  1359	  if (!sessionStateResult.success) {
  1360	    console.warn(
  1361	      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
  1362	    );
  1363	  }
  1364	
  1365	  let result: ContextResult;

 succeeded in 0ms:
   752	    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
   753	    : '';
   754	
   755	  const lines = [
   756	    `Spec Kit Memory MCP has ${stats.totalMemories} indexed memories across ${stats.specFolderCount} spec folders.`,
   757	    `Active memories: ${stats.activeCount}. Stale memories: ${stats.staleCount}.`,
   758	    `Search channels: ${channels.join(', ')}.`,
   759	    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
   760	    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
   761	    staleWarning.trim(),
   762	  ];
   763	
   764	  // Phase 024 / Item 4: Session recovery digest from session-snapshot
   765	  try {
   766	    const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
   767	    const snap = getSessionSnapshot();
   768	    const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
   769	    if (hasData) {
   770	      const recommended = !snap.primed ? 'call session_bootstrap()' :
   771	        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
   772	        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
   773	      lines.push('');
   774	      lines.push('## Session Recovery');
   775	      lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
   776	      lines.push(`- Code graph: ${snap.graphFreshness}`);
   777	      lines.push(`- Session quality: ${snap.sessionQuality}`);
   778	      lines.push(`- Recommended: ${recommended}`);
   779	    }
   780	  } catch { /* session-snapshot not available — skip digest */ }
   781	
   782	  // Phase 027: Structural bootstrap guidance for non-hook runtimes
   783	  lines.push('');
   784	  lines.push('## Structural Bootstrap (Phase 027)');
   785	  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
   786	  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
   787	  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
   788	  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
   789	
   790	  // Phase 024: Tool routing decision tree

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '450,485p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

## Findings
### Finding 1: Engram’s real agent-integration win is a server-embedded policy contract, not just a tool split
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L50), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L121), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L160), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1318)
- **What it does**: Engram combines `ProfileAgent`/`ProfileAdmin`, `ResolveTools()`, `shouldRegister()`, global server instructions, and per-tool `DeferLoading` so the MCP server itself tells any client which memory tools are core, which are deferred, and what behavior is expected.
- **Why it matters for us**: Public already has tool layering and intent-to-profile routing, but that policy mostly lives in runtime guidance and handler logic, not as a dedicated memory-surface contract that travels with the MCP server across agents.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram’s session lifecycle is intentionally portable because it separates session rows from summary memories
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1030), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821)
- **What it does**: `mem_session_start` and `mem_session_end` only maintain session metadata, while `mem_session_summary` writes a first-class observation; `FormatContext()` then composes recent sessions, prompts, and observations into startup context.
- **Why it matters for us**: Public is stronger on trusted session binding and recovery safety, but it still lacks this lightweight, cross-agent “start/end/summary” trio that can work even when richer resume state is unavailable.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Engram’s passive capture is safe because it is explicit, section-bounded, and deduped by project
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L565), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1097), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3411), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3483), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1020)
- **What it does**: Engram only persists passive learnings when the caller explicitly invokes `mem_capture_passive`, and even then it extracts from the last `Key Learnings` section, filters weak bullets, and skips duplicates by normalized hash within project scope.
- **Why it matters for us**: Public already has passive enrichment, but that augments responses rather than storing agent-authored learnings as atomic memories. Engram shows a low-risk way to add passive capture without turning tool output into silent telemetry.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Engram’s project scoping reduces namespace drift, but it is not a real multi-agent isolation model
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2455), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3174), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L694), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1136), [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L108), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L292), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L651)
- **What it does**: Engram normalizes project strings, warns on similar existing names, and offers an admin-only destructive merge to collapse aliases, but all of that still operates on a shared project-name namespace rather than authenticated tenant/user/agent/shared-space identities.
- **Why it matters for us**: This is useful for ergonomics, not safety. Public’s governed ingest, exact scope matching, trusted session binding, and shared-space authorization are already a much stronger multi-agent boundary and should not be weakened into string-based project ownership.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Engram treats token discipline as an MCP interaction pattern through progressive disclosure
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L654), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L939), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L991), [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md#L74)
- **What it does**: `mem_search` returns previews plus IDs, `mem_timeline` adds nearby chronological context, and `mem_get_observation` retrieves the full record only when needed. The architecture docs explicitly frame this as a 3-layer progressive-disclosure pattern.
- **Why it matters for us**: Public’s retrieval stack is stronger, but its agent UX is less opinionated here. A thin “preview → full record → local timeline” lane could improve cross-agent token discipline without changing the underlying hybrid ranking pipeline.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [research/iterations/iteration-006.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-006.md)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q1, Q2, Q6, Q7, Q8, Q9, Q10
- Questions answered: Q1, Q2, Q6, Q8, Q9, Q10
- Questions partially answered: Q7

## Reflection
- What worked: tracing `mcp.go` registration and handler wiring first, then following `CreateSession()`, `EndSession()`, `FormatContext()`, `PassiveCapture()`, `NormalizeProject()`, and `MergeProjects()` exposed the actual agent-facing contract quickly.
- What did not work: CocoIndex was not usable in this session, so this pass fell back to `rg` plus direct file reads. The phase folder also does not currently contain the Level 3 spec docs requested by the brief, and the read-only sandbox blocked fixing that or saving memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s sync and import paths next, especially how project normalization, session payload replay, and observation upserts behave after cross-machine sync, to test whether these agent-facing patterns stay stable once multiple installations start exporting, importing, and consolidating the same project namespace.
hook: Stop
hook: Stop Completed
tokens used
191,537
# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

## Findings
### Finding 1: Engram’s real agent-integration win is a server-embedded policy contract, not just a tool split
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L50), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L121), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L160), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L755), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L1318)
- **What it does**: Engram combines `ProfileAgent`/`ProfileAdmin`, `ResolveTools()`, `shouldRegister()`, global server instructions, and per-tool `DeferLoading` so the MCP server itself tells any client which memory tools are core, which are deferred, and what behavior is expected.
- **Why it matters for us**: Public already has tool layering and intent-to-profile routing, but that policy mostly lives in runtime guidance and handler logic, not as a dedicated memory-surface contract that travels with the MCP server across agents.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram’s session lifecycle is intentionally portable because it separates session rows from summary memories
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1030), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821)
- **What it does**: `mem_session_start` and `mem_session_end` only maintain session metadata, while `mem_session_summary` writes a first-class observation; `FormatContext()` then composes recent sessions, prompts, and observations into startup context.
- **Why it matters for us**: Public is stronger on trusted session binding and recovery safety, but it still lacks this lightweight, cross-agent “start/end/summary” trio that can work even when richer resume state is unavailable.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Engram’s passive capture is safe because it is explicit, section-bounded, and deduped by project
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L565), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1097), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3411), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3483), [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L1020)
- **What it does**: Engram only persists passive learnings when the caller explicitly invokes `mem_capture_passive`, and even then it extracts from the last `Key Learnings` section, filters weak bullets, and skips duplicates by normalized hash within project scope.
- **Why it matters for us**: Public already has passive enrichment, but that augments responses rather than storing agent-authored learnings as atomic memories. Engram shows a low-risk way to add passive capture without turning tool output into silent telemetry.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Engram’s project scoping reduces namespace drift, but it is not a real multi-agent isolation model
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2455), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3174), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L694), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L1136), [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts#L108), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L292), [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L385), [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L651)
- **What it does**: Engram normalizes project strings, warns on similar existing names, and offers an admin-only destructive merge to collapse aliases, but all of that still operates on a shared project-name namespace rather than authenticated tenant/user/agent/shared-space identities.
- **Why it matters for us**: This is useful for ergonomics, not safety. Public’s governed ingest, exact scope matching, trusted session binding, and shared-space authorization are already a much stronger multi-agent boundary and should not be weakened into string-based project ownership.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Engram treats token discipline as an MCP interaction pattern through progressive disclosure
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L654), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L939), [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L991), [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md#L74)
- **What it does**: `mem_search` returns previews plus IDs, `mem_timeline` adds nearby chronological context, and `mem_get_observation` retrieves the full record only when needed. The architecture docs explicitly frame this as a 3-layer progressive-disclosure pattern.
- **Why it matters for us**: Public’s retrieval stack is stronger, but its agent UX is less opinionated here. A thin “preview → full record → local timeline” lane could improve cross-agent token discipline without changing the underlying hybrid ranking pipeline.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [research/iterations/iteration-006.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-006.md)
- [context-server.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q1, Q2, Q6, Q7, Q8, Q9, Q10
- Questions answered: Q1, Q2, Q6, Q8, Q9, Q10
- Questions partially answered: Q7

## Reflection
- What worked: tracing `mcp.go` registration and handler wiring first, then following `CreateSession()`, `EndSession()`, `FormatContext()`, `PassiveCapture()`, `NormalizeProject()`, and `MergeProjects()` exposed the actual agent-facing contract quickly.
- What did not work: CocoIndex was not usable in this session, so this pass fell back to `rg` plus direct file reads. The phase folder also does not currently contain the Level 3 spec docs requested by the brief, and the read-only sandbox blocked fixing that or saving memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s sync and import paths next, especially how project normalization, session payload replay, and observation upserts behave after cross-machine sync, to test whether these agent-facing patterns stay stable once multiple installations start exporting, importing, and consolidating the same project namespace.
