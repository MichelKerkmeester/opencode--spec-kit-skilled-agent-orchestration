### Quick Reference: Common Workflows

- **Recommendation**: reject
- **Impact**: high

### Finding 2: Engram’s memory hygiene is row-level and overwrite-first; Public’s is lineage-first and append-first
- **Source**: [store.go#L948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L948); [store.go#L3201](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3201); [memory-save.ts#L937](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L937); [lineage-state.ts#L806](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L806)
- **What it does**: In Engram, `AddObservation()` checks `topic_key` first and updates the same row in place with `revision_count++`; only if that misses does it do normalized-hash duplicate suppression via `duplicate_count++`. Public instead creates a new append-only row when content changes and wires it into lineage/projection state.
- **Why it matters for us**: The useful part is the stable thread identity, not the overwrite semantics. Engram optimizes for compactness inside one row; Public optimizes for provenance and recoverable version history.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Engram makes session and prompt history first-class durable data, which gives it a simpler continuity story than our split recovery path
- **Source**: [store.go#L441](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L441); [store.go#L754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754); [store.go#L1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613); [mcp.go#L1030](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1030); [session-resume.ts#L4](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L4); [generate-context.ts#L71](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L71)
- **What it does**: Engram stores `sessions.summary`, saves `session_summary` as a searchable observation, stores prompts in `user_prompts`, and builds startup context directly from recent sessions, prompts, and observations. Public recovery is more composite: `session_resume` merges memory context, code-graph state, CocoIndex status, cached hook summaries, and file-backed memories generated through `generate-context`.
- **Why it matters for us**: Public is stronger overall, but continuity is split across more layers. A small durable session/prompt ledger could reduce resume fragility after compaction or hook loss without replacing the current file-first save model.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Passive capture in Engram is intentionally lightweight and storage-native
- **Source**: [store.go#L3394](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3394); [mcp.go#L565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L565); [mcp.go#L1097](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L1097); [generate-context.ts#L85](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L85)
- **What it does**: Engram looks only for the last `## Key Learnings`-style section, normalizes each item, dedupes by normalized hash, and saves each surviving learning as a `passive` observation. It does not run a separate review pipeline or build a special passive-memory schema.
- **Why it matters for us**: This is a good example of a low-complexity adjunct rather than a new subsystem. Public could add a narrow passive-ingest helper for subagent outputs or closeout text, but it should feed into the existing `generate-context` and quality-governed save path instead of bypassing it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Engram bakes replication intent directly into the storage layer through `sync_id` and mutation queues
- **Source**: [store.go#L450](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L450); [store.go#L508](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L508); [store.go#L585](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L585); [main.go#L140](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L140)
- **What it does**: Sessions, observations, and prompts all get stable `sync_id` values; `sync_state`, `sync_mutations`, `sync_chunks`, and `sync_enrolled_projects` track outbound/inbound replication state as part of the same SQLite database. That makes export/import/sync a storage concern, not just a CLI concern.
- **Why it matters for us**: Public has governance, checkpoints, and mutation/history helpers, but not this kind of explicit cross-machine mutation queue in the primary memory DB. If we ever want durable local-first sync, Engram’s queue tables are a concrete starting shape.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/cmd/engram/main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/lib/search/vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts)
- [mcp_server/lib/storage/lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [mcp_server/lib/session/session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [mcp_server/lib/storage/checkpoints.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
- [mcp_server/handlers/memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)

## Assessment
- New information ratio: 0.86
- Questions addressed: Q2, Q3, Q4, Q6, Q8, Q9, Q10
- Questions answered: Q2, Q4, Q6, Q9, Q10; Q3 and Q8 partially

## Reflection
- What worked: reading `store.go` and `vector-index-schema.ts` as the primary sources made the architecture difference obvious quickly; the decisive comparison was Engram’s row-update hygiene versus Public’s append-only lineage path.
- What did not work: CocoIndex did not give me a usable pass over this external Go slice in this session, so I fell back to `rg` plus direct reads. The exact strict validator command returned `RESULT: PASSED`, but also emitted `cannot create temp file for here document: Operation not permitted`, so validation in this read-only sandbox is not fully clean.

## Recommended Next Focus
Trace Engram’s project normalization, merge, export/import, and sync pipeline end to end in `internal/project/`, `internal/sync/`, and the MCP/CLI entrypoints, then compare that against Public’s governance/shared-space boundaries to decide whether any of Engram’s multi-project isolation or replication patterns are worth adopting.

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
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

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
I’m treating this as a read-only deep-research pass focused on Engram’s tool and API surface, and I’ll ground it in the actual source rather than the README. First I’m loading the relevant guidance files and the phase context, then I’ll trace MCP registration, CLI/API entrypoints, and compare those surfaces directly against Spec Kit Memory.
exec
/bin/zsh -lc "pwd && printf '\\n---\\n' && sed -n '1,220p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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


 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

### Safety Constraints

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail.

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** — use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §4 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

---

### Request Analysis & Execution

**Flow:** Parse request → Read files first → Analyze → Design simplest solution → Validate → Execute

#### Execution Behavior

- **Plan before acting** on multi-step work. Decide which files to read first, which tools to use, and how the result will be verified before making changes.
- **Use a research-first approach.** Read the actual code, docs, and local instructions first. Never use an edit-first approach, and prefer surgical edits over broad rewrites.
- **Apply project-specific conventions from `CLAUDE.md` files** before acting.
- **Take responsibility for issues encountered during execution.** Do not dodge ownership with phrases like `not caused by my changes` or `pre-existing issue`; work toward the fix.
- **Do not stop early when the requested solution is still incomplete.** Do not frame partial progress as a `good stopping point`, `natural checkpoint`, or `future work` when a safe path forward exists.
- **Do not ask for permission to continue when the next safe step is already clear and in scope.** Avoid `should I continue?` or `want me to keep going?` when you can proceed safely under the existing rules.
- **Use frequent self-checks and reasoning loops** to catch and fix your own mistakes before asking for help.
- **Reason from actual data, not assumptions.** Verify against the real files, outputs, and behavior in front of you.

---

### Tools & Search

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** — research tasks, context recovery, finding prior work. Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` — NEVER manually create memory files.
  - AI composes structured JSON → `generate-context.js --json '{"specFolder":"...","sessionSummary":"..."}' [spec-folder]` or writes to `/tmp/save-context-data.json` and passes as first arg.
- **CocoIndex Code MCP** — semantic code search. MUST use when exploring unfamiliar code, finding implementations by concept/intent, or when Grep/Glob exact matching is insufficient. Skill: `.opencode/skill/mcp-coco-index/`
- **Git (sk-git)** — worktree setup, conventional commits, PR creation. Full details: `.opencode/skill/sk-git/`. Trigger keywords: worktree, branch, commit, merge, pr, pull request, git workflow, finish work, integrate changes

**CODE SEARCH DECISION TREE:**

```text
Need to find code?
  |
  +-- Know the exact text/token/symbol?
  |     YES --> Grep (exact match)
  |
  +-- Know the file name or path?
  |     YES --> Glob (pattern match)
  |
  +-- Searching by concept, intent, or "how does X work"?
  |     YES --> CocoIndex search (semantic)
  |             +-- Verify hits with Read
  |             +-- Confirm with Grep if needed
  |
  +-- Exploring unfamiliar code?
        YES --> CocoIndex search FIRST, then Grep/Glob to fill gaps
```

CocoIndex triggers: "find code that does X", "how is X implemented", "where is the logic for X", "similar code", "find patterns", exploring unfamiliar modules, any intent-based query where exact tokens are unknown.

| Approach | Command | When |
| --- | --- | --- |
| **MCP tool** | `search(query, languages, paths, num_results, refresh_index)` | AI agent integration |
| **CLI** | `ccc search "query" --lang X --path Y --limit N` | Direct terminal use |

Set `refresh_index=false` after the first search in a session unless the codebase changed.

---

### Session Start & Recovery

**Hook-capable runtimes** auto-inject startup context — no manual action needed. 
**Fallback** — when hooks fail or are unavailable in any runtime:

1. Call `session_bootstrap()` — one composite call that runs `session_resume` + `session_health` and returns structural context
2. If structural context shows `stale` or `missing`, run `code_graph_scan` to rebuild
3. If the graph remains unavailable, fall back to CocoIndex + direct file reads
4. Re-anchor on the recovered spec folder, current task, blockers, and next steps before making changes

---

### Quality & Anti-Patterns

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** — correct user misconceptions with evidence; do not agree for conversational flow

**ANTI-PATTERNS (Detect Silently):**

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

**ANALYSIS LENSES:**

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

---

### Quick Reference: Common Workflows

| Task                      | Flow                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**     | Gate 3 (ask spec folder) → Gate 1 → Gate 2 → Load memory context → Execute                                                         |
| **Research/exploration**  | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**           | CocoIndex for semantic/intent → Grep for exact text → Glob for file paths → Read for contents                                       |
| **Resume prior work**     | `/spec_kit:resume` OR `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` → Review → Continue    |
| **Save context**          | `/memory:save` OR compose JSON → `generate-context.js --json '<data>' [spec-folder]` → Auto-indexed                                 |
| **Claim completion**      | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **End session**           | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**       | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**    | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**         | sk-doc skill → Classify → Load template → Fill → Validate → DQI score → Verify                                                     |
| **Web code**              | sk-code-web skill → Webflow/CDN standards, minification, browser testing                                                           |
| **OpenCode system code**  | sk-code-opencode skill → JS/TS/Python/Shell standards, language detection, quality checklists                                       |
| **Git workflow**          | sk-git skill → Worktree setup / Commit / Finish (PR)                                                                                |
| **Phase workflow**        | `/spec_kit:plan :with-phases` or `/spec_kit:complete :with-phases` → Decompose → Populate → Plan first child                        |
| **Database maintenance**  | `/memory:manage` → stats, health, cleanup, checkpoint, ingest operations                                                           |
| **Deep research**         | `/spec_kit:deep-research` → Init → Loop iterations → Convergence → Synthesize → Memory save                                        |
| **Deep review**           | `/spec_kit:deep-review` → Scope → Loop iterations → Convergence → review-report.md → Memory save                                   |
| **Analysis/evaluation**   | `/memory:search` → preflight, postflight, causal graph, ablation, dashboard, history                                               |
| **Constitutional memory** | `/memory:learn` → create, list, edit, remove, budget                                                                                |
| **Shared memory**         | `/memory:manage shared` → create spaces, manage memberships, inspect rollout                                                        |

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
- **Session persistence:** Once the user answers Gate 3 in a conversation, that answer applies for the ENTIRE session. Do NOT re-ask on subsequent messages unless the user explicitly starts a completely different task/feature. Follow-up messages, implementation steps, and phase transitions within the same task reuse the original answer.
- **Re-ask ONLY when:** the user says "new task" / "different feature" / explicitly names a different spec folder, OR the user asks you to re-ask.

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

mcp: spec_kit_memory/memory_quick_search started
mcp: spec_kit_memory/memory_quick_search (failed)
user cancelled MCP tool call
codex
I’ve got the governing repo and external instructions loaded. Next I’m pulling just the relevant skill guidance and then tracing the actual Engram surfaces in `internal/mcp`, `cmd`, and the project/server packages so the findings stay code-backed and tool-surface focused.
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
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/mcp-coco-index/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: mcp-coco-index
description: "Semantic code search via vector embeddings. CocoIndex Code enables natural-language discovery of relevant code, patterns, and implementations. CLI for direct use; MCP exposes a single `search` tool for AI agent integration."
allowed-tools: [Bash, Read, Grep, Glob]
version: 1.0.0
---

<!-- Keywords: cocoindex-code, semantic-search, vector-embeddings, code-search, mcp-server, ccc, codebase-indexing, voyage-code-3, all-MiniLM-L6-v2 -->

# CocoIndex Code - Semantic Code Search via Vector Embeddings

Natural language code search through two complementary approaches: CLI (ccc) for speed and one-off queries, MCP server (1 tool: `search`) for AI agent integration via stdio transport.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User asks to "find code that does X" or "search for implementations of Y"
- User needs to discover code by concept or intent rather than exact text
- User wants to find similar code patterns across the codebase
- Grep/Glob exact matching is insufficient and fuzzy or semantic matching is needed
- User mentions "semantic search", "code search", "find similar code"
- User needs to locate logic handling a specific concern (e.g., "where is the retry logic")
- User wants to understand how a concept is implemented across multiple files
- User asks "how is X implemented" or "what handles Y"
- User wants to understand architecture or module relationships
- Starting work on an unfamiliar part of the codebase (onboarding queries)
- @context agent is exploring code structure and needs concept-based discovery
- Any exploration task where the exact function/class name is unknown

**Automatic Triggers**:
- "semantic search", "find code that", "search for implementations"
- "similar code", "code that handles", "where is the logic for"
- "cocoindex", "ccc", "vector search"
- "find similar", "code search", "search codebase"
- "how is", "what handles", "where does", "understand the"
- "explore", "architecture", "module relationships"
- "onboarding", "unfamiliar code", "new to this"

### When NOT to Use

**Do not use for**:
- Exact text or regex search (use Grep instead)
- File name or path search (use Glob instead)
- Reading known files (use Read instead)
- The codebase has not been indexed yet (run `ccc index` first)
- Simple string matching where the exact token is known
- Non-code files (semantic search is optimized for source code)

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                                   |
| ----------- | ------------------------ | ------------------------------------------- |
| ALWAYS      | Every skill invocation   | references/tool_reference.md                |
| CONDITIONAL | If intent signals match  | references/search_patterns.md, references/cross_cli_playbook.md |
| ON_DEMAND   | Only on explicit request | Full troubleshooting and configuration docs |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool_reference.md"

INTENT_SIGNALS = {
    "SEARCH": {"weight": 4, "keywords": ["search", "find", "where", "similar", "semantic", "code that"]},
    "INDEX": {"weight": 4, "keywords": ["index", "reindex", "update index", "build index", "refresh"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "configure", "ccc not found"]},
    "STATUS": {"weight": 3, "keywords": ["status", "stats", "how many files", "indexed"]},
    "TROUBLESHOOT": {"weight": 3, "keywords": ["error", "failed", "not working", "empty results"]},
    "CROSS_CLI": {"weight": 3, "keywords": ["copilot", "gemini", "claude", "codex", "cross cli", "multi query"]},
    "CONCURRENCY": {"weight": 3, "keywords": ["refresh_index", "concurrency", "concurrent", "follow-up query"]},
}

RESOURCE_MAP = {
    "SEARCH": ["references/search_patterns.md", "references/cross_cli_playbook.md", "references/tool_reference.md"],
    "INDEX": ["references/tool_reference.md"],
    "INSTALL": ["references/tool_reference.md"],
    "STATUS": ["references/tool_reference.md"],
    "TROUBLESHOOT": ["references/tool_reference.md", "references/cross_cli_playbook.md", "references/search_patterns.md"],
    "CROSS_CLI": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
    "CONCURRENCY": ["references/cross_cli_playbook.md", "references/tool_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full troubleshooting", "all commands", "configuration guide", "cross cli playbook"],
    "ON_DEMAND": ["references/tool_reference.md", "references/search_patterns.md", "references/cross_cli_playbook.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "has_error", False):
        scores["TROUBLESHOOT"] += 4
    if getattr(task, "index_missing", False):
        scores["INDEX"] += 5
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["SEARCH"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_cocoindex_code_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Two Approaches

CocoIndex Code provides two access patterns for semantic code search:

1. **CLI (ccc)** - Direct terminal usage, fastest for one-off searches
2. **MCP server** - AI agent integration via `ccc mcp` (stdio mode)

### CLI Approach (Primary) - CocoIndex Code CLI

#### Semantic Search

```bash
# Basic semantic search
ccc search "error handling middleware" --limit 5

# Filter by language
ccc search "database connection" --lang typescript

# Filter by path
ccc search "authentication" --path "src/**"

# Combine filters
ccc search "retry logic" --lang python --path "lib/**" --limit 10
```

#### Index Management

```bash
# Check index status
ccc status

# Build or update the index
ccc index

# Reset project databases (destructive)
ccc reset

exec
/bin/zsh -lc 'rg --files .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CODEOWNERS
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/agent-save.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-dashboard.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-detail.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-recent.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/assets/tui-search.png
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/gentle-creation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_extra_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/COMPARISON.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/INSTALLATION.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/beta/obsidian-brain.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/intended-usage.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.mod
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.sum
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/exporter_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/graph.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/graph.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/graph_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/hub_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/markdown_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/slug.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/slug_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/state.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/state_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/testhelpers_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/watcher.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/obsidian/watcher_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_e2e_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/generate.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/plugins/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/model_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/styles.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/update_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/view_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/tui/wrap_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/version/check.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/version/check_test.go
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/archive-report.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/design.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/proposal.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/tasks.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/archive-report.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/design.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/proposal.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/tasks.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/hooks/hooks.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/_helpers.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/post-compaction.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-start.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/session-stop.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/subagent-stop.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/scripts/user-prompt-submit.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/claude-code/skills/memory/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/esbuild.config.mjs
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/manifest.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/main.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/settings.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/src/sync.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/obsidian/tsconfig.json
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/architecture-guardrails/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/backlog-triage/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/branch-pr/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/business-rules/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/catalog.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/commit-hygiene/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/cultural-norms/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/dashboard-htmx/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/docs-alignment/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/gentleman-bubbletea/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/issue-creation/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/memory-protocol/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/plugin-thin/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/pr-review-deep/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/project-structure/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/sdd-flow/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/server-api/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/testing-coverage/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/tui-quality/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/ui-elements/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/skills/visual-language/SKILL.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-001.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-002.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-003.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-004.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-005.md

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1483ms:

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
The phase folder is present and I’ve confirmed the relevant research artifacts and external code layout. I’m now drilling into the registration paths themselves so we can separate what’s really a storage/API design choice from what’s just packaging or plugin setup.
2026-04-10T20:39:13.476804Z ERROR codex_core::tools::router: error=failed to parse function arguments: missing field `cell_id` at line 1 column 67
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|mem_search|mem_save|mem_context|mem_session_start|mem_session_end|mem_session_summary|mem_suggest_topic_key|mem_capture_passive|RegisterTool|registerTool|tools :=|profile" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/**/*.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:76:	"mcp__plugin_engram_engram__mem_capture_passive",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:77:	"mcp__plugin_engram_engram__mem_context",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:79:	"mcp__plugin_engram_engram__mem_save",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:80:	"mcp__plugin_engram_engram__mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:81:	"mcp__plugin_engram_engram__mem_search",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:82:	"mcp__plugin_engram_engram__mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:83:	"mcp__plugin_engram_engram__mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:84:	"mcp__plugin_engram_engram__mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:85:	"mcp__plugin_engram_engram__mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:110:Call mem_save IMMEDIATELY after any of these:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:118:Format for mem_save:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:133:- If unsure about the key, call mem_suggest_topic_key first and then reuse it
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:140:1. First call mem_context — checks recent session history (fast, cheap)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:141:2. If not found, call mem_search with relevant keywords (FTS5 full-text search)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:151:1. Call mem_session_summary with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:184:You can also call mem_capture_passive(content) directly with any text that contains a learning section.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:185:This is a safety net — it captures knowledge even if you forget to call mem_save explicitly.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:190:1. IMMEDIATELY call mem_session_summary with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:191:2. Then call mem_context to recover any additional context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:201:FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary before doing anything else, then call mem_context.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go:372:	// Add engram MCP entry (agent profile — only tools agents need).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go:64:	resolveMCPTools        = mcp.ResolveTools
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:27:  "mem_search",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:28:  "mem_save",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:31:  "mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:32:  "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:33:  "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:34:  "mem_context",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:38:  "mem_session_start",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:39:  "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:43:// These get injected into the agent's context so it knows to call mem_save.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:51:Call \`mem_save\` IMMEDIATELY after any of these:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:59:Format for \`mem_save\`:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:73:- If unsure about the key, call \`mem_suggest_topic_key\` first and then reuse it
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:80:1. First call \`mem_context\` — checks recent session history (fast, cheap)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:81:2. If not found, call \`mem_search\` with relevant keywords (FTS5 full-text search)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:87:- The user's FIRST message references the project, a feature, or a problem — call \`mem_search\` with keywords from their message to check for prior work before responding
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:92:1. Call \`mem_session_summary\` with this structure:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:117:1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:118:2. Then call \`mem_context\` to recover any additional context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts:443:        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:7:// Tool profiles allow agents to load only the tools they need:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:12://	engram mcp --tools=agent,admin → combine profiles
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:13://	engram mcp --tools=mem_save,mem_search → individual tool names
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:42://   mem_session_start, mem_session_end, mem_get_observation,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:76:// Profiles maps profile names to their tool sets.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:78:	"agent": ProfileAgent,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:79:	"admin": ProfileAdmin,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:82:// ResolveTools takes a comma-separated string of profile names and/or
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:85:func ResolveTools(input string) map[string]bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:100:		if profile, ok := Profiles[token]; ok {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:101:			for tool := range profile {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:127:  mem_save — save decisions, bugs, discoveries, conventions PROACTIVELY (do not wait to be asked)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:128:  mem_search — find past work, decisions, or context from previous sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:129:  mem_context — get recent session history (call at session start or after compaction)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:132:  mem_save_prompt — save user prompt for context
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:138:PROACTIVE SAVE RULE: Call mem_save immediately after ANY decision, bug fix, discovery, or convention — not just when asked.`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:156:	registerTools(srv, s, cfg, allowlist)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:160:// shouldRegister returns true if the tool should be registered given the
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:162:func shouldRegister(name string, allowlist map[string]bool) bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:169:func registerTools(srv *server.MCPServer, s *store.Store, cfg MCPConfig, allowlist map[string]bool) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:170:	// ─── mem_search (profile: agent, core — always in context) ─────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:171:	if shouldRegister("mem_search", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:173:			mcp.NewTool("mem_search",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:201:	// ─── mem_save (profile: agent, core — always in context) ───────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:202:	if shouldRegister("mem_save", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:204:			mcp.NewTool("mem_save",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:264:	// ─── mem_update (profile: agent, deferred) ──────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:265:	if shouldRegister("mem_update", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:305:			mcp.NewTool("mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:327:	// ─── mem_delete (profile: admin, deferred) ──────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:328:	if shouldRegister("mem_delete", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:351:	if shouldRegister("mem_save_prompt", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:353:			mcp.NewTool("mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:375:	// ─── mem_context (profile: agent, core — always in context) ────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:376:	if shouldRegister("mem_context", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:378:			mcp.NewTool("mem_context",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:399:	// ─── mem_stats (profile: admin, deferred) ───────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:400:	if shouldRegister("mem_stats", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:415:	// ─── mem_timeline (profile: admin, deferred) ────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:416:	if shouldRegister("mem_timeline", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:441:	// ─── mem_get_observation (profile: agent, eager) ────────────────────
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:193:		"[profile]",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:229:		if !strings.Contains(text, "[profile]") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:230:			t.Fatalf("expected existing profile section to be preserved")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:254:		firstSection := strings.Index(text, "[profile]")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup_test.go:256:			t.Fatalf("expected [profile] section in config")

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package mcp implements the Model Context Protocol server for Engram.
//
// This exposes memory tools via MCP stdio transport so ANY agent
// (OpenCode, Claude Code, Cursor, Windsurf, etc.) can use Engram's
// persistent memory just by adding it as an MCP server.
//
// Tool profiles allow agents to load only the tools they need:
//
//	engram mcp                    → all 15 tools (default)
//	engram mcp --tools=agent      → 11 tools agents actually use (per skill files)
//	engram mcp --tools=admin      → 4 tools for TUI/CLI (delete, stats, timeline, merge)
//	engram mcp --tools=agent,admin → combine profiles
//	engram mcp --tools=mem_save,mem_search → individual tool names
package mcp

import (
	"context"
	"fmt"
	"strings"

	projectpkg "github.com/Gentleman-Programming/engram/internal/project"
	"github.com/Gentleman-Programming/engram/internal/store"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// MCPConfig holds configuration for the MCP server.
type MCPConfig struct {
	DefaultProject string // Auto-detected project name, used when LLM sends empty project
}

var suggestTopicKey = store.SuggestTopicKey

var loadMCPStats = func(s *store.Store) (*store.Stats, error) {
	return s.Stats()
}

// ─── Tool Profiles ───────────────────────────────────────────────────────────
//
// "agent" — tools AI agents use during coding sessions:
//   mem_save, mem_search, mem_context, mem_session_summary,
//   mem_session_start, mem_session_end, mem_get_observation,
//   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
//
// "admin" — tools for manual curation, TUI, and dashboards:
//   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
//
// "all" (default) — every tool registered.

// ProfileAgent contains the tool names that AI agents need.
// Sourced from actual skill files and memory protocol instructions
// across all 4 supported agents (Claude Code, OpenCode, Gemini CLI, Codex).
var ProfileAgent = map[string]bool{
	"mem_save":              true, // proactive save — referenced 17 times across protocols
	"mem_search":            true, // search past memories — referenced 6 times
	"mem_context":           true, // recent context from previous sessions — referenced 10 times
	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
	"mem_session_start":     true, // register session start
	"mem_session_end":       true, // mark session completed
	"mem_get_observation":   true, // full observation content after search — referenced 4 times
	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
	"mem_save_prompt":       true, // save user prompts
	"mem_update":            true, // update observation by ID — skills say "use mem_update when you have an exact ID to correct"
}

// ProfileAdmin contains tools for TUI, dashboards, and manual curation
// that are NOT referenced in any agent skill or memory protocol.
var ProfileAdmin = map[string]bool{
	"mem_delete":         true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
	"mem_stats":          true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
	"mem_timeline":       true, // only in OpenCode's ENGRAM_TOOLS filter, not in any agent instructions
	"mem_merge_projects": true, // destructive curation tool — not for agent use
}

// Profiles maps profile names to their tool sets.
var Profiles = map[string]map[string]bool{
	"agent": ProfileAgent,
	"admin": ProfileAdmin,
}

// ResolveTools takes a comma-separated string of profile names and/or
// individual tool names and returns the set of tool names to register.
// An empty input means "all" — every tool is registered.
func ResolveTools(input string) map[string]bool {
	input = strings.TrimSpace(input)
	if input == "" || input == "all" {
		return nil // nil means register everything
	}

	result := make(map[string]bool)
	for _, token := range strings.Split(input, ",") {
		token = strings.TrimSpace(token)
		if token == "" {
			continue
		}
		if token == "all" {
			return nil
		}
		if profile, ok := Profiles[token]; ok {
			for tool := range profile {
				result[tool] = true
			}
		} else {
			// Treat as individual tool name
			result[token] = true
		}
	}

	if len(result) == 0 {
		return nil
	}
	return result
}

// NewServer creates an MCP server with ALL tools registered (backwards compatible).
func NewServer(s *store.Store) *server.MCPServer {
	return NewServerWithConfig(s, MCPConfig{}, nil)
}

// serverInstructions tells MCP clients when to use Engram's tools.
// 6 core tools are eager (always in context). The rest are deferred
// and require ToolSearch to load.
const serverInstructions = `Engram provides persistent memory that survives across sessions and compactions.

CORE TOOLS (always available — use without ToolSearch):
  mem_save — save decisions, bugs, discoveries, conventions PROACTIVELY (do not wait to be asked)
  mem_search — find past work, decisions, or context from previous sessions
  mem_context — get recent session history (call at session start or after compaction)
  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
  mem_get_observation — get full untruncated content of a search result by ID
  mem_save_prompt — save user prompt for context

DEFERRED TOOLS (use ToolSearch when needed):
  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects

PROACTIVE SAVE RULE: Call mem_save immediately after ANY decision, bug fix, discovery, or convention — not just when asked.`

// NewServerWithTools creates an MCP server registering only the tools in
// the allowlist. If allowlist is nil, all tools are registered.
func NewServerWithTools(s *store.Store, allowlist map[string]bool) *server.MCPServer {
	return NewServerWithConfig(s, MCPConfig{}, allowlist)
}

// NewServerWithConfig creates an MCP server with full configuration including
// default project detection and optional tool allowlist.
func NewServerWithConfig(s *store.Store, cfg MCPConfig, allowlist map[string]bool) *server.MCPServer {
	srv := server.NewMCPServer(
		"engram",
		"0.1.0",
		server.WithToolCapabilities(true),
		server.WithInstructions(serverInstructions),
	)

	registerTools(srv, s, cfg, allowlist)
	return srv
}

// shouldRegister returns true if the tool should be registered given the
// allowlist. If allowlist is nil, everything is allowed.
func shouldRegister(name string, allowlist map[string]bool) bool {
	if allowlist == nil {
		return true
	}
	return allowlist[name]
}

func registerTools(srv *server.MCPServer, s *store.Store, cfg MCPConfig, allowlist map[string]bool) {
	// ─── mem_search (profile: agent, core — always in context) ─────────
	if shouldRegister("mem_search", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_search",
				mcp.WithDescription("Search your persistent memory across all sessions. Use this to find past decisions, bugs fixed, patterns used, files changed, or any context from previous coding sessions."),
				mcp.WithTitleAnnotation("Search Memory"),
				mcp.WithReadOnlyHintAnnotation(true),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("query",
					mcp.Required(),
					mcp.Description("Search query — natural language or keywords"),
				),
				mcp.WithString("type",
					mcp.Description("Filter by type: tool_use, file_change, command, file_read, search, manual, decision, architecture, bugfix, pattern"),
				),
				mcp.WithString("project",
					mcp.Description("Filter by project name"),
				),
				mcp.WithString("scope",
					mcp.Description("Filter by scope: project (default) or personal"),
				),
				mcp.WithNumber("limit",
					mcp.Description("Max results (default: 10, max: 20)"),
				),
			),
			handleSearch(s, cfg),
		)
	}

	// ─── mem_save (profile: agent, core — always in context) ───────────
	if shouldRegister("mem_save", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_save",
				mcp.WithTitleAnnotation("Save Memory"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(false),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithDescription(`Save an important observation to persistent memory. Call this PROACTIVELY after completing significant work — don't wait to be asked.

WHEN to save (call this after each of these):
- Architectural decisions or tradeoffs
- Bug fixes (what was wrong, why, how you fixed it)
- New patterns or conventions established
- Configuration changes or environment setup
- Important discoveries or gotchas
- File structure changes

FORMAT for content — use this structured format:
  **What**: [concise description of what was done]
  **Why**: [the reasoning, user request, or problem that drove it]
  **Where**: [files/paths affected, e.g. src/auth/middleware.ts, internal/store/store.go]
  **Learned**: [any gotchas, edge cases, or decisions made — omit if none]

TITLE should be short and searchable, like: "JWT auth middleware", "FTS5 query sanitization", "Fixed N+1 in user list"

Examples:
  title: "Switched from sessions to JWT"
  type: "decision"
  content: "**What**: Replaced express-session with jsonwebtoken for auth\n**Why**: Session storage doesn't scale across multiple instances\n**Where**: src/middleware/auth.ts, src/routes/login.ts\n**Learned**: Must set httpOnly and secure flags on the cookie, refresh tokens need separate rotation logic"

  title: "Fixed FTS5 syntax error on special chars"
  type: "bugfix"
  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
				mcp.WithString("title",
					mcp.Required(),
					mcp.Description("Short, searchable title (e.g. 'JWT auth middleware', 'Fixed N+1 query')"),
				),
				mcp.WithString("content",
					mcp.Required(),
					mcp.Description("Structured content using **What**, **Why**, **Where**, **Learned** format"),
				),
				mcp.WithString("type",
					mcp.Description("Category: decision, architecture, bugfix, pattern, config, discovery, learning (default: manual)"),
				),
				mcp.WithString("session_id",
					mcp.Description("Session ID to associate with (default: manual-save-{project})"),
				),
				mcp.WithString("project",
					mcp.Description("Project name"),
				),
				mcp.WithString("scope",
					mcp.Description("Scope for this observation: project (default) or personal"),
				),
				mcp.WithString("topic_key",
					mcp.Description("Optional topic identifier for upserts (e.g. architecture/auth-model). Reuses and updates the latest observation in same project+scope."),
				),
			),
			handleSave(s, cfg),

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Engram — Persistent memory for AI coding agents.
//
// Usage:
//
//	engram serve          Start HTTP + MCP server
//	engram mcp            Start MCP server only (stdio transport)
//	engram search <query> Search memories from CLI
//	engram save           Save a memory from CLI
//	engram context        Show recent context
//	engram stats          Show memory stats
package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"runtime/debug"
	"sort"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/Gentleman-Programming/engram/internal/mcp"
	"github.com/Gentleman-Programming/engram/internal/obsidian"
	"github.com/Gentleman-Programming/engram/internal/project"
	"github.com/Gentleman-Programming/engram/internal/server"
	"github.com/Gentleman-Programming/engram/internal/setup"
	"github.com/Gentleman-Programming/engram/internal/store"
	engramsync "github.com/Gentleman-Programming/engram/internal/sync"
	"github.com/Gentleman-Programming/engram/internal/tui"
	versioncheck "github.com/Gentleman-Programming/engram/internal/version"

	tea "github.com/charmbracelet/bubbletea"
	mcpserver "github.com/mark3labs/mcp-go/server"
)

// version is set via ldflags at build time by goreleaser.
// Falls back to "dev" for local builds; init() tries Go module info first.
var version = "dev"

func init() {
	if version != "dev" {
		return
	}
	if info, ok := debug.ReadBuildInfo(); ok && info.Main.Version != "" && info.Main.Version != "(devel)" {
		version = strings.TrimPrefix(info.Main.Version, "v")
	}
}

var (
	storeNew      = store.New
	newHTTPServer = server.New
	startHTTP     = (*server.Server).Start

	newMCPServer           = mcp.NewServer
	newMCPServerWithTools  = mcp.NewServerWithTools
	newMCPServerWithConfig = mcp.NewServerWithConfig
	resolveMCPTools        = mcp.ResolveTools
	serveMCP               = mcpserver.ServeStdio

	// detectProject is injectable for testing; wraps project.DetectProject.
	detectProject = project.DetectProject

	newTUIModel   = func(s *store.Store) tui.Model { return tui.New(s, version) }
	newTeaProgram = tea.NewProgram
	runTeaProgram = (*tea.Program).Run

	checkForUpdates = versioncheck.CheckLatest

	setupSupportedAgents        = setup.SupportedAgents
	setupInstallAgent           = setup.Install
	setupAddClaudeCodeAllowlist = setup.AddClaudeCodeAllowlist
	scanInputLine               = fmt.Scanln

	storeSearch = func(s *store.Store, query string, opts store.SearchOptions) ([]store.SearchResult, error) {
		return s.Search(query, opts)
	}
	storeAddObservation = func(s *store.Store, p store.AddObservationParams) (int64, error) { return s.AddObservation(p) }
	storeTimeline       = func(s *store.Store, observationID int64, before, after int) (*store.TimelineResult, error) {
		return s.Timeline(observationID, before, after)
	}
	storeFormatContext = func(s *store.Store, project, scope string) (string, error) { return s.FormatContext(project, scope) }
	storeStats         = func(s *store.Store) (*store.Stats, error) { return s.Stats() }
	storeExport        = func(s *store.Store) (*store.ExportData, error) { return s.Export() }
	jsonMarshalIndent  = json.MarshalIndent

	syncStatus = func(sy *engramsync.Syncer) (localChunks int, remoteChunks int, pendingImport int, err error) {
		return sy.Status()
	}
	syncImport = func(sy *engramsync.Syncer) (*engramsync.ImportResult, error) { return sy.Import() }
	syncExport = func(sy *engramsync.Syncer, createdBy, project string) (*engramsync.SyncResult, error) {
		return sy.Export(createdBy, project)
	}

	exitFunc = os.Exit

	stdinScanner = func() *bufio.Scanner { return bufio.NewScanner(os.Stdin) }
	userHomeDir  = os.UserHomeDir

	// newObsidianExporter is injectable for testing.
	newObsidianExporter = obsidian.NewExporter

	// newObsidianWatcher is injectable for testing.
	newObsidianWatcher = obsidian.NewWatcher
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		exitFunc(1)
	}

	// Check for updates on every invocation.
	if result := checkForUpdates(version); result.Status != versioncheck.StatusUpToDate && result.Message != "" {
		fmt.Fprintln(os.Stderr, result.Message)
		fmt.Fprintln(os.Stderr)
	}

	cfg, cfgErr := store.DefaultConfig()
	if cfgErr != nil {
		// Fallback: try to resolve home directory from environment variables
		// that os.UserHomeDir() might have missed (e.g. MCP subprocesses on
		// Windows where %USERPROFILE% is not propagated).
		if home := resolveHomeFallback(); home != "" {
			log.Printf("[engram] UserHomeDir failed, using fallback: %s", home)
			cfg = store.FallbackConfig(filepath.Join(home, ".engram"))
		} else {
			fatal(cfgErr)
		}
	}

	// Allow overriding data dir via env
	if dir := os.Getenv("ENGRAM_DATA_DIR"); dir != "" {
		cfg.DataDir = dir
	}

	// Migrate orphaned databases that ended up in wrong locations
	// (e.g. drive root on Windows due to previous bug).
	migrateOrphanedDB(cfg.DataDir)

	switch os.Args[1] {
	case "serve":
		cmdServe(cfg)
	case "mcp":
		cmdMCP(cfg)
	case "tui":
		cmdTUI(cfg)
	case "search":
		cmdSearch(cfg)
	case "save":
		cmdSave(cfg)
	case "timeline":
		cmdTimeline(cfg)
	case "context":
		cmdContext(cfg)
	case "stats":
		cmdStats(cfg)
	case "export":
		cmdExport(cfg)
	case "import":
		cmdImport(cfg)
	case "sync":
		cmdSync(cfg)
	case "obsidian-export":
		cmdObsidianExport(cfg)
	case "projects":
		cmdProjects(cfg)
	case "setup":
		cmdSetup()
	case "version", "--version", "-v":
		fmt.Printf("engram %s\n", version)
	case "help", "--help", "-h":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "unknown command: %s\n\n", os.Args[1])
		printUsage()
		exitFunc(1)
	}
}

// ─── Commands ────────────────────────────────────────────────────────────────

func cmdServe(cfg store.Config) {
	port := 7437 // "ENGR" on phone keypad vibes
	if p := os.Getenv("ENGRAM_PORT"); p != "" {
		if n, err := strconv.Atoi(p); err == nil {
			port = n
		}
	}
	// Allow: engram serve 8080
	if len(os.Args) > 2 {
		if n, err := strconv.Atoi(os.Args[2]); err == nil {
			port = n
		}
	}

	s, err := storeNew(cfg)
	if err != nil {
		fatal(err)
	}
	defer s.Close()

	srv := newHTTPServer(s, port)

	// Graceful shutdown on SIGINT/SIGTERM.
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigCh
		log.Println("[engram] shutting down...")
		exitFunc(0)
	}()

	if err := startHTTP(srv); err != nil {
		fatal(err)
	}
}

func cmdMCP(cfg store.Config) {
	// Parse --tools and --project flags
	toolsFilter := ""
	projectOverride := ""
	for i := 2; i < len(os.Args); i++ {
		if strings.HasPrefix(os.Args[i], "--tools=") {
			toolsFilter = strings.TrimPrefix(os.Args[i], "--tools=")
		} else if os.Args[i] == "--tools" && i+1 < len(os.Args) {
			toolsFilter = os.Args[i+1]
			i++
		} else if strings.HasPrefix(os.Args[i], "--project=") {
			projectOverride = strings.TrimPrefix(os.Args[i], "--project=")
		} else if os.Args[i] == "--project" && i+1 < len(os.Args) {
			projectOverride = os.Args[i+1]
			i++
		}
	}

	// Project detection chain: --project flag → ENGRAM_PROJECT env → git detection
	detectedProject := projectOverride
	if detectedProject == "" {
		detectedProject = os.Getenv("ENGRAM_PROJECT")
	}
	if detectedProject == "" {
		if cwd, err := os.Getwd(); err == nil {
			detectedProject = detectProject(cwd)
		}
	}
	// Always normalize (lowercase + trim)
	detectedProject, _ = store.NormalizeProject(detectedProject)

	s, err := storeNew(cfg)
	if err != nil {
		fatal(err)
	}
	defer s.Close()

exec
/bin/zsh -lc "sed -n '260,720p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
			handleSave(s, cfg),
		)
	}

	// ─── mem_update (profile: agent, deferred) ──────────────────────────
	if shouldRegister("mem_update", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_update",
				mcp.WithDescription("Update an existing observation by ID. Only provided fields are changed."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Update Memory"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(false),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithNumber("id",
					mcp.Required(),
					mcp.Description("Observation ID to update"),
				),
				mcp.WithString("title",
					mcp.Description("New title"),
				),
				mcp.WithString("content",
					mcp.Description("New content"),
				),
				mcp.WithString("type",
					mcp.Description("New type/category"),
				),
				mcp.WithString("project",
					mcp.Description("New project value"),
				),
				mcp.WithString("scope",
					mcp.Description("New scope: project or personal"),
				),
				mcp.WithString("topic_key",
					mcp.Description("New topic key (normalized internally)"),
				),
			),
			handleUpdate(s),
		)
	}

	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
	if shouldRegister("mem_suggest_topic_key", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_suggest_topic_key",
				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Suggest Topic Key"),
				mcp.WithReadOnlyHintAnnotation(true),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("type",
					mcp.Description("Observation type/category, e.g. architecture, decision, bugfix"),
				),
				mcp.WithString("title",
					mcp.Description("Observation title (preferred input for stable keys)"),
				),
				mcp.WithString("content",
					mcp.Description("Observation content used as fallback if title is empty"),
				),
			),
			handleSuggestTopicKey(),
		)
	}

	// ─── mem_delete (profile: admin, deferred) ──────────────────────────
	if shouldRegister("mem_delete", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_delete",
				mcp.WithDescription("Delete an observation by ID. Soft-delete by default; set hard_delete=true for permanent deletion."),
				mcp.WithDeferLoading(true),
				mcp.WithTitleAnnotation("Delete Memory"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(true),
				mcp.WithIdempotentHintAnnotation(false),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithNumber("id",
					mcp.Required(),
					mcp.Description("Observation ID to delete"),
				),
				mcp.WithBoolean("hard_delete",
					mcp.Description("If true, permanently deletes the observation"),
				),
			),
			handleDelete(s),
		)
	}

	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
	if shouldRegister("mem_save_prompt", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_save_prompt",
				mcp.WithDescription("Save a user prompt to persistent memory. Use this to record what the user asked — their intent, questions, and requests — so future sessions have context about the user's goals."),
				mcp.WithTitleAnnotation("Save User Prompt"),
				mcp.WithReadOnlyHintAnnotation(false),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(false),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("content",
					mcp.Required(),
					mcp.Description("The user's prompt text"),
				),
				mcp.WithString("session_id",
					mcp.Description("Session ID to associate with (default: manual-save-{project})"),
				),
				mcp.WithString("project",
					mcp.Description("Project name"),
				),
			),
			handleSavePrompt(s, cfg),
		)
	}

	// ─── mem_context (profile: agent, core — always in context) ────────
	if shouldRegister("mem_context", allowlist) {
		srv.AddTool(
			mcp.NewTool("mem_context",
				mcp.WithDescription("Get recent memory context from previous sessions. Shows recent sessions and observations to understand what was done before."),
				mcp.WithTitleAnnotation("Get Memory Context"),
				mcp.WithReadOnlyHintAnnotation(true),
				mcp.WithDestructiveHintAnnotation(false),
				mcp.WithIdempotentHintAnnotation(true),
				mcp.WithOpenWorldHintAnnotation(false),
				mcp.WithString("project",
					mcp.Description("Filter by project (omit for all projects)"),
				),
				mcp.WithString("scope",
					mcp.Description("Filter observations by scope: project (default) or personal"),
				),
				mcp.WithNumber("limit",
					mcp.Description("Number of observations to retrieve (default: 20)"),
				),
			),
			handleContext(s, cfg),
		)
	}

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
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		query, _ := req.GetArguments()["query"].(string)
		typ, _ := req.GetArguments()["type"].(string)
		project, _ := req.GetArguments()["project"].(string)
		scope, _ := req.GetArguments()["scope"].(string)
		limit := intArg(req, "limit", 10)

		// Apply default project when LLM sends empty
		if project == "" {
			project = cfg.DefaultProject
		}
		// Normalize project name
		project, _ = store.NormalizeProject(project)

		results, err := s.Search(query, store.SearchOptions{
			Type:    typ,
			Project: project,
			Scope:   scope,
			Limit:   limit,
		})
		if err != nil {
			return mcp.NewToolResultError(fmt.Sprintf("Search error: %s. Try simpler keywords.", err)), nil
		}

		if len(results) == 0 {
			return mcp.NewToolResultText(fmt.Sprintf("No memories found for: %q", query)), nil
		}

		var b strings.Builder
		fmt.Fprintf(&b, "Found %d memories:\n\n", len(results))
		anyTruncated := false
		for i, r := range results {
			projectDisplay := ""
			if r.Project != nil {
				projectDisplay = fmt.Sprintf(" | project: %s", *r.Project)
			}
			preview := truncate(r.Content, 300)
			if len(r.Content) > 300 {
				anyTruncated = true
				preview += " [preview]"
			}
			fmt.Fprintf(&b, "[%d] #%d (%s) — %s\n    %s\n    %s%s | scope: %s\n\n",
				i+1, r.ID, r.Type, r.Title,
				preview,
				r.CreatedAt, projectDisplay, r.Scope)
		}
		if anyTruncated {
			fmt.Fprintf(&b, "---\nResults above are previews (300 chars). To read the full content of a specific memory, call mem_get_observation(id: <ID>).\n")
		}

		return mcp.NewToolResultText(b.String()), nil
	}
}

func handleSave(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		title, _ := req.GetArguments()["title"].(string)
		content, _ := req.GetArguments()["content"].(string)
		typ, _ := req.GetArguments()["type"].(string)
		sessionID, _ := req.GetArguments()["session_id"].(string)
		project, _ := req.GetArguments()["project"].(string)
		scope, _ := req.GetArguments()["scope"].(string)
		topicKey, _ := req.GetArguments()["topic_key"].(string)

		// Apply default project when LLM sends empty
		if project == "" {
			project = cfg.DefaultProject
		}
		// Normalize project name and capture warning
		normalized, normWarning := store.NormalizeProject(project)
		project = normalized

		if typ == "" {
			typ = "manual"
		}
		if sessionID == "" {
			sessionID = defaultSessionID(project)
		}
		suggestedTopicKey := suggestTopicKey(typ, title, content)

		// Check for similar existing projects (only when this project has no existing observations)
		var similarWarning string
		if project != "" {
			existingNames, _ := s.ListProjectNames()
			isNew := true
			for _, e := range existingNames {
				if e == project {
					isNew = false
					break
				}
			}
			if isNew && len(existingNames) > 0 {
				matches := projectpkg.FindSimilar(project, existingNames, 3)
				if len(matches) > 0 {
					bestMatch := matches[0].Name

exec
/bin/zsh -lc "sed -n '260,520p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
	defer s.Close()

	mcpCfg := mcp.MCPConfig{
		DefaultProject: detectedProject,
	}

	allowlist := resolveMCPTools(toolsFilter)
	mcpSrv := newMCPServerWithConfig(s, mcpCfg, allowlist)

	if err := serveMCP(mcpSrv); err != nil {
		fatal(err)
	}
}

func cmdTUI(cfg store.Config) {
	s, err := storeNew(cfg)
	if err != nil {
		fatal(err)
	}
	defer s.Close()

	model := newTUIModel(s)
	p := newTeaProgram(model)
	if _, err := runTeaProgram(p); err != nil {
		fatal(err)
	}
}

func cmdSearch(cfg store.Config) {
	if len(os.Args) < 3 {
		fmt.Fprintln(os.Stderr, "usage: engram search <query> [--type TYPE] [--project PROJECT] [--scope SCOPE] [--limit N]")
		exitFunc(1)
	}

	// Collect the query (everything that's not a flag)
	var queryParts []string
	opts := store.SearchOptions{Limit: 10}

	for i := 2; i < len(os.Args); i++ {
		switch os.Args[i] {
		case "--type":
			if i+1 < len(os.Args) {
				opts.Type = os.Args[i+1]
				i++
			}
		case "--project":
			if i+1 < len(os.Args) {
				opts.Project = os.Args[i+1]
				i++
			}
		case "--limit":
			if i+1 < len(os.Args) {
				if n, err := strconv.Atoi(os.Args[i+1]); err == nil {
					opts.Limit = n
				}
				i++
			}
		case "--scope":
			if i+1 < len(os.Args) {
				opts.Scope = os.Args[i+1]
				i++
			}
		default:
			queryParts = append(queryParts, os.Args[i])
		}
	}

	query := strings.Join(queryParts, " ")
	if query == "" {
		fmt.Fprintln(os.Stderr, "error: search query is required")
		exitFunc(1)
	}

	s, err := storeNew(cfg)
	if err != nil {
		fatal(err)
		return
	}
	defer s.Close()

	results, err := storeSearch(s, query, opts)
	if err != nil {
		fatal(err)
		return
	}

	if len(results) == 0 {
		fmt.Printf("No memories found for: %q\n", query)
		return
	}

	fmt.Printf("Found %d memories:\n\n", len(results))
	for i, r := range results {
		project := ""
		if r.Project != nil {
			project = fmt.Sprintf(" | project: %s", *r.Project)
		}
		fmt.Printf("[%d] #%d (%s) — %s\n    %s\n    %s%s | scope: %s\n\n",
			i+1, r.ID, r.Type, r.Title,
			truncate(r.Content, 300),
			r.CreatedAt, project, r.Scope)
	}
}

func cmdSave(cfg store.Config) {
	if len(os.Args) < 4 {
		fmt.Fprintln(os.Stderr, "usage: engram save <title> <content> [--type TYPE] [--project PROJECT] [--scope SCOPE] [--topic TOPIC_KEY]")
		exitFunc(1)
	}

	title := os.Args[2]
	content := os.Args[3]
	typ := "manual"
	project := ""
	scope := "project"
	topicKey := ""

	for i := 4; i < len(os.Args); i++ {
		switch os.Args[i] {
		case "--type":
			if i+1 < len(os.Args) {
				typ = os.Args[i+1]
				i++
			}
		case "--project":
			if i+1 < len(os.Args) {
				project = os.Args[i+1]
				i++
			}
		case "--scope":
			if i+1 < len(os.Args) {
				scope = os.Args[i+1]
				i++
			}
		case "--topic":
			if i+1 < len(os.Args) {
				topicKey = os.Args[i+1]
				i++
			}
		}
	}

	s, err := storeNew(cfg)
	if err != nil {
		fatal(err)
	}
	defer s.Close()

	sessionID := "manual-save"
	if project != "" {
		sessionID = "manual-save-" + project
	}
	s.CreateSession(sessionID, project, "")
	id, err := storeAddObservation(s, store.AddObservationParams{
		SessionID: sessionID,
		Type:      typ,
		Title:     title,
		Content:   content,
		Project:   project,
		Scope:     scope,
		TopicKey:  topicKey,
	})
	if err != nil {
		fatal(err)
	}

	fmt.Printf("Memory saved: #%d %q (%s)\n", id, title, typ)
}

func cmdTimeline(cfg store.Config) {
	if len(os.Args) < 3 {
		fmt.Fprintln(os.Stderr, "usage: engram timeline <observation_id> [--before N] [--after N]")
		exitFunc(1)
	}

	obsID, err := strconv.ParseInt(os.Args[2], 10, 64)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: invalid observation id %q\n", os.Args[2])
		exitFunc(1)
	}

	before, after := 5, 5
	for i := 3; i < len(os.Args); i++ {
		switch os.Args[i] {
		case "--before":
			if i+1 < len(os.Args) {
				if n, err := strconv.Atoi(os.Args[i+1]); err == nil {
					before = n
				}
				i++
			}
		case "--after":
			if i+1 < len(os.Args) {
				if n, err := strconv.Atoi(os.Args[i+1]); err == nil {
					after = n
				}
				i++
			}
		}
	}

	s, err := storeNew(cfg)
	if err != nil {
		fatal(err)
	}
	defer s.Close()

	result, err := storeTimeline(s, obsID, before, after)
	if err != nil {
		fatal(err)
	}

	// Session header
	if result.SessionInfo != nil {
		summary := ""
		if result.SessionInfo.Summary != nil {
			summary = fmt.Sprintf(" — %s", truncate(*result.SessionInfo.Summary, 100))
		}
		fmt.Printf("Session: %s (%s)%s\n", result.SessionInfo.Project, result.SessionInfo.StartedAt, summary)
		fmt.Printf("Total observations in session: %d\n\n", result.TotalInRange)
	}

	// Before
	if len(result.Before) > 0 {
		fmt.Println("─── Before ───")
		for _, e := range result.Before {
			fmt.Printf("  #%d [%s] %s — %s\n", e.ID, e.Type, e.Title, truncate(e.Content, 150))
		}
		fmt.Println()
	}

	// Focus
	fmt.Printf(">>> #%d [%s] %s <<<\n", result.Focus.ID, result.Focus.Type, result.Focus.Title)
	fmt.Printf("    %s\n", truncate(result.Focus.Content, 500))
	fmt.Printf("    %s\n\n", result.Focus.CreatedAt)

	// After
	if len(result.After) > 0 {
		fmt.Println("─── After ───")
		for _, e := range result.After {
			fmt.Printf("  #%d [%s] %s — %s\n", e.ID, e.Type, e.Title, truncate(e.Content, 150))
		}
	}
}

func cmdContext(cfg store.Config) {
	project := ""
	scope := ""

	for i := 2; i < len(os.Args); i++ {
		switch os.Args[i] {
		case "--scope":
			if i+1 < len(os.Args) {
				scope = os.Args[i+1]
				i++
			}
		default:
			if project == "" {
				project = os.Args[i]
			}
		}

exec
/bin/zsh -lc "sed -n '1,280p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package server provides the HTTP API for Engram.
//
// This is how external clients (OpenCode plugin, Claude Code hooks,
// any agent) communicate with the memory engine. Simple JSON REST API.
package server

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"strconv"
	"time"

	"github.com/Gentleman-Programming/engram/internal/store"
)

var loadServerStats = func(s *store.Store) (*store.Stats, error) {
	return s.Stats()
}

// SyncStatusProvider returns the current sync status. This is implemented
// by autosync.Manager and injected from cmd/engram/main.go.
type SyncStatusProvider interface {
	Status() SyncStatus
}

// SyncStatus mirrors autosync.Status to avoid a direct import cycle.
type SyncStatus struct {
	Phase               string     `json:"phase"`
	LastError           string     `json:"last_error,omitempty"`
	ConsecutiveFailures int        `json:"consecutive_failures"`
	BackoffUntil        *time.Time `json:"backoff_until,omitempty"`
	LastSyncAt          *time.Time `json:"last_sync_at,omitempty"`
}

type Server struct {
	store      *store.Store
	mux        *http.ServeMux
	port       int
	listen     func(network, address string) (net.Listener, error)
	serve      func(net.Listener, http.Handler) error
	onWrite    func() // called after successful local writes (for autosync notification)
	syncStatus SyncStatusProvider
}

func New(s *store.Store, port int) *Server {
	srv := &Server{store: s, port: port, listen: net.Listen, serve: http.Serve}
	srv.mux = http.NewServeMux()
	srv.routes()
	return srv
}

// SetOnWrite configures a callback invoked after every successful local write.
// This is used to notify autosync.Manager via NotifyDirty().
func (s *Server) SetOnWrite(fn func()) {
	s.onWrite = fn
}

// SetSyncStatus configures the sync status provider for the /sync/status endpoint.
func (s *Server) SetSyncStatus(provider SyncStatusProvider) {
	s.syncStatus = provider
}

// notifyWrite calls the onWrite callback if configured (best-effort, non-blocking).
func (s *Server) notifyWrite() {
	if s.onWrite != nil {
		s.onWrite()
	}
}

func (s *Server) Start() error {
	addr := fmt.Sprintf("127.0.0.1:%d", s.port)
	listenFn := s.listen
	if listenFn == nil {
		listenFn = net.Listen
	}
	serveFn := s.serve
	if serveFn == nil {
		serveFn = http.Serve
	}

	ln, err := listenFn("tcp", addr)
	if err != nil {
		return fmt.Errorf("engram server: listen %s: %w", addr, err)
	}
	log.Printf("[engram] HTTP server listening on %s", addr)
	return serveFn(ln, s.mux)
}

func (s *Server) Handler() http.Handler {
	return s.mux
}

func (s *Server) routes() {
	s.mux.HandleFunc("GET /health", s.handleHealth)

	// Sessions
	s.mux.HandleFunc("POST /sessions", s.handleCreateSession)
	s.mux.HandleFunc("POST /sessions/{id}/end", s.handleEndSession)
	s.mux.HandleFunc("GET /sessions/recent", s.handleRecentSessions)

	// Observations
	s.mux.HandleFunc("POST /observations", s.handleAddObservation)
	s.mux.HandleFunc("POST /observations/passive", s.handlePassiveCapture)
	s.mux.HandleFunc("GET /observations/recent", s.handleRecentObservations)
	s.mux.HandleFunc("PATCH /observations/{id}", s.handleUpdateObservation)
	s.mux.HandleFunc("DELETE /observations/{id}", s.handleDeleteObservation)

	// Search
	s.mux.HandleFunc("GET /search", s.handleSearch)

	// Timeline
	s.mux.HandleFunc("GET /timeline", s.handleTimeline)
	s.mux.HandleFunc("GET /observations/{id}", s.handleGetObservation)

	// Prompts
	s.mux.HandleFunc("POST /prompts", s.handleAddPrompt)
	s.mux.HandleFunc("GET /prompts/recent", s.handleRecentPrompts)
	s.mux.HandleFunc("GET /prompts/search", s.handleSearchPrompts)

	// Context
	s.mux.HandleFunc("GET /context", s.handleContext)

	// Export / Import
	s.mux.HandleFunc("GET /export", s.handleExport)
	s.mux.HandleFunc("POST /import", s.handleImport)

	// Stats
	s.mux.HandleFunc("GET /stats", s.handleStats)

	// Project migration
	s.mux.HandleFunc("POST /projects/migrate", s.handleMigrateProject)

	// Sync status (degraded-state visibility for autosync)
	s.mux.HandleFunc("GET /sync/status", s.handleSyncStatus)
}

// ─── Handlers ────────────────────────────────────────────────────────────────

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	jsonResponse(w, http.StatusOK, map[string]any{
		"status":  "ok",
		"service": "engram",
		"version": "0.1.0",
	})
}

func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
	var body struct {
		ID        string `json:"id"`
		Project   string `json:"project"`
		Directory string `json:"directory"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
		return
	}
	if body.ID == "" || body.Project == "" {
		jsonError(w, http.StatusBadRequest, "id and project are required")
		return
	}

	if err := s.store.CreateSession(body.ID, body.Project, body.Directory); err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.notifyWrite()
	jsonResponse(w, http.StatusCreated, map[string]string{"id": body.ID, "status": "created"})
}

func (s *Server) handleEndSession(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var body struct {
		Summary string `json:"summary"`
	}
	json.NewDecoder(r.Body).Decode(&body)

	if err := s.store.EndSession(id, body.Summary); err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.notifyWrite()
	jsonResponse(w, http.StatusOK, map[string]string{"id": id, "status": "completed"})
}

func (s *Server) handleRecentSessions(w http.ResponseWriter, r *http.Request) {
	project := r.URL.Query().Get("project")
	limit := queryInt(r, "limit", 5)

	sessions, err := s.store.RecentSessions(project, limit)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, sessions)
}

func (s *Server) handleAddObservation(w http.ResponseWriter, r *http.Request) {
	var body store.AddObservationParams
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
		return
	}
	if body.SessionID == "" || body.Title == "" || body.Content == "" {
		jsonError(w, http.StatusBadRequest, "session_id, title, and content are required")
		return
	}

	id, err := s.store.AddObservation(body)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.notifyWrite()
	jsonResponse(w, http.StatusCreated, map[string]any{"id": id, "status": "saved"})
}

func (s *Server) handlePassiveCapture(w http.ResponseWriter, r *http.Request) {
	var body store.PassiveCaptureParams
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
		return
	}
	if body.SessionID == "" {
		jsonError(w, http.StatusBadRequest, "session_id is required")
		return
	}

	result, err := s.store.PassiveCapture(body)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	s.notifyWrite()
	jsonResponse(w, http.StatusOK, result)
}

func (s *Server) handleRecentObservations(w http.ResponseWriter, r *http.Request) {
	project := r.URL.Query().Get("project")
	scope := r.URL.Query().Get("scope")
	limit := queryInt(r, "limit", 20)

	obs, err := s.store.RecentObservations(project, scope, limit)
	if err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, obs)
}

func (s *Server) handleSearch(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		jsonError(w, http.StatusBadRequest, "q parameter is required")
		return
	}

	results, err := s.store.Search(query, store.SearchOptions{
		Type:    r.URL.Query().Get("type"),
		Project: r.URL.Query().Get("project"),
		Scope:   r.URL.Query().Get("scope"),
		Limit:   queryInt(r, "limit", 10),
	})
	if err != nil {
		jsonError(w, http.StatusInternalServerError, err.Error())
		return
	}

	jsonResponse(w, http.StatusOK, results)
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package setup handles agent plugin installation.
//
//   - OpenCode: copies embedded plugin file to ~/.config/opencode/plugins/
//     (patching ENGRAM_BIN to bake in the absolute binary path as a final
//     fallback) and injects MCP registration in opencode.json using the
//     resolved absolute binary path so child processes never require PATH
//     resolution in headless/systemd environments.
//   - Claude Code: runs `claude plugin marketplace add` + `claude plugin install`,
//     then writes a durable MCP config to ~/.claude/mcp/engram.json using the
//     absolute binary path so the subprocess never needs PATH resolution.
//   - Gemini CLI: injects MCP registration in ~/.gemini/settings.json
//   - Codex: injects MCP registration in ~/.codex/config.toml
package setup

import (
	"embed"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

var (
	runtimeGOOS  = runtime.GOOS
	userHomeDir  = os.UserHomeDir
	lookPathFn   = exec.LookPath
	osExecutable = os.Executable
	runCommand   = func(name string, args ...string) ([]byte, error) {
		return exec.Command(name, args...).CombinedOutput()
	}
	openCodeReadFile = func(path string) ([]byte, error) {
		return openCodeFS.ReadFile(path)
	}
	statFn                             = os.Stat
	openCodeWriteFileFn                = os.WriteFile
	readFileFn                         = os.ReadFile
	writeFileFn                        = os.WriteFile
	jsonMarshalFn                      = json.Marshal
	jsonMarshalIndentFn                = json.MarshalIndent
	injectOpenCodeMCPFn                = injectOpenCodeMCP
	injectGeminiMCPFn                  = injectGeminiMCP
	writeGeminiSystemPromptFn          = writeGeminiSystemPrompt
	writeCodexMemoryInstructionFilesFn = writeCodexMemoryInstructionFiles
	injectCodexMCPFn                   = injectCodexMCP
	injectCodexMemoryConfigFn          = injectCodexMemoryConfig
	addClaudeCodeAllowlistFn           = AddClaudeCodeAllowlist
	writeClaudeCodeUserMCPFn           = writeClaudeCodeUserMCP
)

//go:embed plugins/opencode/*
var openCodeFS embed.FS

// Agent represents a supported AI coding agent.
type Agent struct {
	Name        string
	Description string
	InstallDir  string // resolved at runtime (display only for claude-code)
}

// Result holds the outcome of an installation.
type Result struct {
	Agent       string
	Destination string
	Files       int
}

const claudeCodeMarketplace = "Gentleman-Programming/engram"

// claudeCodeMCPTools are the MCP tool names registered by the engram plugin
// in Claude Code. Adding these to ~/.claude/settings.json permissions.allow
// prevents Claude Code from prompting for confirmation on every tool call.
var claudeCodeMCPTools = []string{
	"mcp__plugin_engram_engram__mem_capture_passive",
	"mcp__plugin_engram_engram__mem_context",
	"mcp__plugin_engram_engram__mem_get_observation",
	"mcp__plugin_engram_engram__mem_save",
	"mcp__plugin_engram_engram__mem_save_prompt",
	"mcp__plugin_engram_engram__mem_search",
	"mcp__plugin_engram_engram__mem_session_end",
	"mcp__plugin_engram_engram__mem_session_start",
	"mcp__plugin_engram_engram__mem_session_summary",
	"mcp__plugin_engram_engram__mem_suggest_topic_key",
	"mcp__plugin_engram_engram__mem_update",
}

// codexEngramBlock is the canonical Codex TOML MCP block.
// Command is always the bare "engram" name in this constant because
// upsertCodexEngramBlock generates the actual content via codexEngramBlockStr()
// which uses resolveEngramCommand() at runtime. This constant is kept for tests
// that verify idempotency against the already-written string when os.Executable
// returns "engram" (fallback path).
const codexEngramBlock = "[mcp_servers.engram]\ncommand = \"engram\"\nargs = [\"mcp\", \"--tools=agent\"]"

// codexEngramBlockStr returns the Codex TOML block for the engram MCP server,
// using the resolved absolute binary path from os.Executable().
func codexEngramBlockStr() string {
	cmd := resolveEngramCommand()
	return "[mcp_servers.engram]\ncommand = " + fmt.Sprintf("%q", cmd) + "\nargs = [\"mcp\", \"--tools=agent\"]"
}

const memoryProtocolMarkdown = `## Engram Persistent Memory — Protocol

You have access to Engram, a persistent memory system that survives across sessions and compactions.

### WHEN TO SAVE (mandatory — not optional)

Call mem_save IMMEDIATELY after any of these:
- Bug fix completed
- Architecture or design decision made
- Non-obvious discovery about the codebase
- Configuration change or environment setup
- Pattern established (naming, structure, convention)
- User preference or constraint learned

Format for mem_save:
- **title**: Verb + what — short, searchable (e.g. "Fixed N+1 query in UserList", "Chose Zustand over Redux")
- **type**: bugfix | decision | architecture | discovery | pattern | config | preference
- **scope**: project (default) | personal
- **topic_key** (optional, recommended for evolving decisions): stable key like architecture/auth-model
- **content**:
  **What**: One sentence — what was done
  **Why**: What motivated it (user request, bug, performance, etc.)
  **Where**: Files or paths affected
  **Learned**: Gotchas, edge cases, things that surprised you (omit if none)

### Topic update rules (mandatory)

- Different topics must not overwrite each other (e.g. architecture vs bugfix)
- Reuse the same topic_key to update an evolving topic instead of creating new observations
- If unsure about the key, call mem_suggest_topic_key first and then reuse it
- Use mem_update when you have an exact observation ID to correct

### WHEN TO SEARCH MEMORY

When the user asks to recall something — any variation of "remember", "recall", "what did we do",
"how did we solve", "recordar", "acordate", "qué hicimos", or references to past work:
1. First call mem_context — checks recent session history (fast, cheap)
2. If not found, call mem_search with relevant keywords (FTS5 full-text search)
3. If you find a match, use mem_get_observation for full untruncated content

Also search memory PROACTIVELY when:
- Starting work on something that might have been done before
- The user mentions a topic you have no context on — check if past sessions covered it

### SESSION CLOSE PROTOCOL (mandatory)

Before ending a session or saying "done" / "listo" / "that's it", you MUST:
1. Call mem_session_summary with this structure:

## Goal
[What we were working on this session]

## Instructions
[User preferences or constraints discovered — skip if none]

## Discoveries
- [Technical findings, gotchas, non-obvious learnings]

## Accomplished
- [Completed items with key details]

## Next Steps
- [What remains to be done — for the next session]

## Relevant Files
- path/to/file — [what it does or what changed]

This is NOT optional. If you skip this, the next session starts blind.

### PASSIVE CAPTURE — automatic learning extraction

When completing a task or subtask, include a "## Key Learnings:" section at the end of your response
with numbered items. Engram will automatically extract and save these as observations.

Example:
## Key Learnings:

1. bcrypt cost=12 is the right balance for our server performance
2. JWT refresh tokens need atomic rotation to prevent race conditions

You can also call mem_capture_passive(content) directly with any text that contains a learning section.
This is a safety net — it captures knowledge even if you forget to call mem_save explicitly.

### AFTER COMPACTION

If you see a message about compaction or context reset, or if you see "FIRST ACTION REQUIRED" in your context:
1. IMMEDIATELY call mem_session_summary with the compacted summary content — this persists what was done before compaction
2. Then call mem_context to recover any additional context from previous sessions
3. Only THEN continue working

Do not skip step 1. Without it, everything done before compaction is lost from memory.
`

const codexCompactPromptMarkdown = `You are compacting a coding session that uses Engram persistent memory.

You MUST prepend this exact sentence at the top of the compacted summary:

FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary before doing anything else, then call mem_context.

After that sentence, summarize:
- Goal
- Key technical discoveries and decisions
- Completed work
- Remaining next steps
- Relevant files changed

Keep it concise and high-signal.`

// SupportedAgents returns the list of agents that have plugins available.
func SupportedAgents() []Agent {
	return []Agent{
		{
			Name:        "opencode",
			Description: "OpenCode — TypeScript plugin with session tracking, compaction recovery, and Memory Protocol",
			InstallDir:  openCodePluginDir(),
		},
		{
			Name:        "claude-code",
			Description: "Claude Code — Native plugin via marketplace (hooks, skills, MCP, compaction recovery)",
			InstallDir:  "managed by claude plugin system",
		},
		{
			Name:        "gemini-cli",
			Description: "Gemini CLI — MCP registration plus system prompt compaction recovery",
			InstallDir:  geminiConfigPath(),
		},
		{
			Name:        "codex",
			Description: "Codex — MCP registration plus model/compaction instruction files",
			InstallDir:  codexConfigPath(),
		},
	}
}

// Install installs the plugin for the given agent.
func Install(agentName string) (*Result, error) {
	switch agentName {
	case "opencode":
		return installOpenCode()
	case "claude-code":
		return installClaudeCode()
	case "gemini-cli":
		return installGeminiCLI()
	case "codex":
		return installCodex()
	default:
		return nil, fmt.Errorf("unknown agent: %q (supported: opencode, claude-code, gemini-cli, codex)", agentName)
	}
}

// ─── OpenCode ────────────────────────────────────────────────────────────────

// patchEngramBINLine rewrites the ENGRAM_BIN constant declaration in the
// plugin source so the installed copy contains an absolute fallback path.
//
// Original line in source:
//

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/**
 * Engram — OpenCode plugin adapter
 *
 * Thin layer that connects OpenCode's event system to the Engram Go binary.
 * The Go binary runs as a local HTTP server and handles all persistence.
 *
 * Flow:
 *   OpenCode events → this plugin → HTTP calls → engram serve → SQLite
 *
 * Session resilience:
 *   Uses `ensureSession()` before any DB write. This means sessions are
 *   created on-demand — even if the plugin was loaded after the session
 *   started (restart, reconnect, etc.). The session ID comes from OpenCode's
 *   hooks (input.sessionID) rather than relying on a session.created event.
 */

import type { Plugin } from "@opencode-ai/plugin"

// ─── Configuration ───────────────────────────────────────────────────────────

const ENGRAM_PORT = parseInt(process.env.ENGRAM_PORT ?? "7437")
const ENGRAM_URL = `http://127.0.0.1:${ENGRAM_PORT}`
const ENGRAM_BIN = process.env.ENGRAM_BIN ?? "engram"

// Engram's own MCP tools — don't count these as "tool calls" for session stats
const ENGRAM_TOOLS = new Set([
  "mem_search",
  "mem_save",
  "mem_update",
  "mem_delete",
  "mem_suggest_topic_key",
  "mem_save_prompt",
  "mem_session_summary",
  "mem_context",
  "mem_stats",
  "mem_timeline",
  "mem_get_observation",
  "mem_session_start",
  "mem_session_end",
])

// ─── Memory Instructions ─────────────────────────────────────────────────────
// These get injected into the agent's context so it knows to call mem_save.

const MEMORY_INSTRUCTIONS = `## Engram Persistent Memory — Protocol

You have access to Engram, a persistent memory system that survives across sessions and compactions.

### WHEN TO SAVE (mandatory — not optional)

Call \`mem_save\` IMMEDIATELY after any of these:
- Bug fix completed
- Architecture or design decision made
- Non-obvious discovery about the codebase
- Configuration change or environment setup
- Pattern established (naming, structure, convention)
- User preference or constraint learned

Format for \`mem_save\`:
- **title**: Verb + what — short, searchable (e.g. "Fixed N+1 query in UserList", "Chose Zustand over Redux")
- **type**: bugfix | decision | architecture | discovery | pattern | config | preference
- **scope**: \`project\` (default) | \`personal\`
- **topic_key** (optional, recommended for evolving decisions): stable key like \`architecture/auth-model\`
- **content**:
  **What**: One sentence — what was done
  **Why**: What motivated it (user request, bug, performance, etc.)
  **Where**: Files or paths affected
  **Learned**: Gotchas, edge cases, things that surprised you (omit if none)

Topic rules:
- Different topics must not overwrite each other (e.g. architecture vs bugfix)
- Reuse the same \`topic_key\` to update an evolving topic instead of creating new observations
- If unsure about the key, call \`mem_suggest_topic_key\` first and then reuse it
- Use \`mem_update\` when you have an exact observation ID to correct

### WHEN TO SEARCH MEMORY

When the user asks to recall something — any variation of "remember", "recall", "what did we do",
"how did we solve", "recordar", "acordate", "qué hicimos", or references to past work:
1. First call \`mem_context\` — checks recent session history (fast, cheap)
2. If not found, call \`mem_search\` with relevant keywords (FTS5 full-text search)
3. If you find a match, use \`mem_get_observation\` for full untruncated content

Also search memory PROACTIVELY when:
- Starting work on something that might have been done before
- The user mentions a topic you have no context on — check if past sessions covered it
- The user's FIRST message references the project, a feature, or a problem — call \`mem_search\` with keywords from their message to check for prior work before responding

### SESSION CLOSE PROTOCOL (mandatory)

Before ending a session or saying "done" / "listo" / "that's it", you MUST:
1. Call \`mem_session_summary\` with this structure:

## Goal
[What we were working on this session]

## Instructions
[User preferences or constraints discovered — skip if none]

## Discoveries
- [Technical findings, gotchas, non-obvious learnings]

## Accomplished
- [Completed items with key details]

## Next Steps
- [What remains to be done — for the next session]

## Relevant Files
- path/to/file — [what it does or what changed]

This is NOT optional. If you skip this, the next session starts blind.

### AFTER COMPACTION

If you see a message about compaction or context reset, or if you see "FIRST ACTION REQUIRED" in your context:
1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
2. Then call \`mem_context\` to recover any additional context from previous sessions
3. Only THEN continue working

Do not skip step 1. Without it, everything done before compaction is lost from memory.
`

// ─── HTTP Client ─────────────────────────────────────────────────────────────

async function engramFetch(
  path: string,
  opts: { method?: string; body?: any } = {}
): Promise<any> {
  try {
    const res = await fetch(`${ENGRAM_URL}${path}`, {
      method: opts.method ?? "GET",
      headers: opts.body ? { "Content-Type": "application/json" } : undefined,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    })
    return await res.json()
  } catch {
    // Engram server not running — silently fail
    return null
  }
}

async function isEngramRunning(): Promise<boolean> {
  try {
    const res = await fetch(`${ENGRAM_URL}/health`, {
      signal: AbortSignal.timeout(500),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractProjectName(directory: string): string {
  // Try git remote origin URL
  try {
    const result = Bun.spawnSync(["git", "-C", directory, "remote", "get-url", "origin"])
    if (result.exitCode === 0) {
      const url = result.stdout?.toString().trim()
      if (url) {
        const name = url.replace(/\.git$/, "").split(/[/:]/).pop()
        if (name) return name
      }
    }
  } catch {}

  // Fallback: git root directory name (works in worktrees)
  try {
    const result = Bun.spawnSync(["git", "-C", directory, "rev-parse", "--show-toplevel"])
    if (result.exitCode === 0) {
      const root = result.stdout?.toString().trim()
      if (root) return root.split("/").pop() ?? "unknown"
    }
  } catch {}

  // Final fallback: cwd basename
  return directory.split("/").pop() ?? "unknown"
}

function truncate(str: string, max: number): string {
  if (!str) return ""
  return str.length > max ? str.slice(0, max) + "..." : str
}

/**
 * Strip <private>...</private> tags before sending to engram.
 * Double safety: the Go binary also strips, but we strip here too
 * so sensitive data never even hits the wire.
 */
function stripPrivateTags(str: string): string {
  if (!str) return ""
  return str.replace(/<private>[\s\S]*?<\/private>/gi, "[REDACTED]").trim()
}

// ─── Plugin Export ───────────────────────────────────────────────────────────

export const Engram: Plugin = async (ctx) => {
  const oldProject = ctx.directory.split("/").pop() ?? "unknown"
  const project = extractProjectName(ctx.directory)

  // Track tool counts per session (in-memory only, not critical)
  const toolCounts = new Map<string, number>()

  // Track which sessions we've already ensured exist in engram
  const knownSessions = new Set<string>()

  // Track sub-agent session IDs so we can suppress their tool-hook registrations.
  // Sub-agents (Task() calls) have a parentID or a title ending in " subagent)".
  // We must not register them as top-level Engram sessions — they cause session
  // inflation (e.g. 170 sessions for 1 real conversation, issue #116).
  const subAgentSessions = new Set<string>()

  /**
   * Ensure a session exists in engram. Idempotent — calls POST /sessions
   * which uses INSERT OR IGNORE. Safe to call multiple times.
   *
   * Silently skips sub-agent sessions (tracked in `subAgentSessions`).
   */

codex
I’m at the comparison stage now: Engram’s code makes the profile split, deferred loading, and transport surfaces pretty explicit. I’m pulling the matching Public MCP schema and session-save surfaces next so the recommendations stay concrete instead of turning into generic “could be nice” ideas.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Tool Schemas
// ───────────────────────────────────────────────────────────────
// All MCP tool definitions (names, descriptions, input schemas).
// Extracted from context-server.ts for maintainability (T303).
import {
  MAX_INGEST_PATHS,
  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
} from './schemas/tool-input-schemas.js';

/**
 * Re-export schema validation helpers used by the MCP tool entry points.
 */
export {
  ToolSchemaValidationError,
  formatZodError,
  getToolSchema,
  validateToolArgs,
  getSchema,
} from './schemas/tool-input-schemas.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Normalized definition for a single MCP tool and its JSON schema.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

// ───────────────────────────────────────────────────────────────
// 2. TOOL DEFINITIONS

// ───────────────────────────────────────────────────────────────
// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
const memoryContext: ToolDefinition = {
  name: 'memory_context',
  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
};

// L2: Core - Primary operations (Token Budget: 3500)
const memorySearch: ToolDefinition = {
  name: 'memory_search',
  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    properties: {
      cursor: {
        type: 'string',
        minLength: 1,
        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
      },
      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
      concepts: {
        type: 'array',
        items: { type: 'string', minLength: 1 },
        minItems: 2,
        maxItems: 5,
        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
      },
      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
      sessionId: {
        type: 'string',
        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
      },
      enableDedup: {
        type: 'boolean',
        default: true,
        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
      },
      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
      includeConstitutional: {
        type: 'boolean',
        default: true,
        description: 'Include constitutional tier memories at top of results (default: true)'
      },
      enableSessionBoost: {
        type: 'boolean',
        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
      },
      enableCausalBoost: {
        type: 'boolean',
        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
      },
      includeContent: {
        type: 'boolean',
        default: false,
        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
      },
      anchors: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
      },
      profile: {
        type: 'string',
        enum: ['quick', 'research', 'resume', 'debug'],
        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
      },
      min_quality_score: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
      },
      minQualityScore: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
      },
      bypassCache: {
        type: 'boolean',
        default: false,
        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
      },
      rerank: {
        type: 'boolean',
        default: true,
        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
      },
      applyLengthPenalty: {
        type: 'boolean',
        default: true,
        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
      },
      applyStateLimits: {
        type: 'boolean',
        default: false,
        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
      },
      minState: {
        type: 'string',
        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
        default: 'WARM',
        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
      },
      intent: {
        type: 'string',
        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
      },
      autoDetectIntent: {
        type: 'boolean',
        default: true,
        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
      },
      // Fix #13 : Expose previously hidden handler parameters
      trackAccess: {
        type: 'boolean',
        default: false,
        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
      },
      includeArchived: {
        type: 'boolean',
        default: false,
        description: 'Include archived memories in search results. Default: false (archived excluded).'
      },
      mode: {
        type: 'string',
        enum: ['auto', 'deep'],
        default: 'auto',
        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
      },
      includeTrace: {
        type: 'boolean',
        default: false,
        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
      }
    }
  },
};

// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
const memoryQuickSearch: ToolDefinition = {
  name: 'memory_quick_search',
  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
      specFolder: { type: 'string', description: 'Restrict to spec folder' },
      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
    },
    required: ['query'],
  },
};

const memoryMatchTriggers: ToolDefinition = {
  name: 'memory_match_triggers',
  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
};

// T306: Added asyncEmbedding parameter for non-blocking embedding generation
const memorySave: ToolDefinition = {
  name: 'memory_save',
  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },
};

// L3: Discovery - Browse and explore (Token Budget: 800)
const memoryList: ToolDefinition = {
  name: 'memory_list',
  description: '[L3:Discovery] Browse stored memories with pagination. Use to discover what is remembered and find IDs for delete/update. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { limit: { type: 'number', default: 20, minimum: 1, maximum: 100, description: 'Maximum results to return (max 100)' }, offset: { type: 'number', default: 0, minimum: 0, description: 'Number of results to skip (for pagination)' }, specFolder: { type: 'string', description: 'Filter by spec folder' }, sortBy: { type: 'string', enum: ['created_at', 'updated_at', 'importance_weight'], description: 'Sort order (default: created_at DESC)' }, includeChunks: { type: 'boolean', default: false, description: 'Include chunk child rows. Default false returns parent memories only for cleaner browsing.' } } },
};

const memoryStats: ToolDefinition = {
  name: 'memory_stats',
  description: '[L3:Discovery] Get statistics about the memory system. Shows counts, dates, status breakdown, and top folders. Supports multiple ranking modes including composite scoring. Token Budget: 800.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { folderRanking: { type: 'string', enum: ['count', 'recency', 'importance', 'composite'], description: 'How to rank folders: count (default, by memory count), recency (most recent first), importance (by tier), composite (weighted multi-factor score)', default: 'count' }, excludePatterns: { type: 'array', items: { type: 'string' }, description: 'Regex patterns to exclude folders (e.g., ["z_archive", "scratch"])' }, includeScores: { type: 'boolean', description: 'Include score breakdown for each folder', default: false }, includeArchived: { type: 'boolean', description: 'Include archived/test/scratch folders in results', default: false }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum number of folders to return', default: 10 } } },
};

const memoryHealth: ToolDefinition = {
  name: 'memory_health',
  description: '[L3:Discovery] Check health status of the memory system. Token Budget: 800.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      reportMode: {
        type: 'string',
        enum: ['full', 'divergent_aliases'],
        default: 'full',
        description: 'Report mode. full returns system diagnostics; divergent_aliases returns compact divergent alias triage output.'
      },
      limit: {
        type: 'number',
        default: 20,
        minimum: 1,
        maximum: 200,
        description: 'Maximum divergent alias groups to return when reportMode=divergent_aliases (max 200).'
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder filter for divergent alias triage mode.'
      },
      autoRepair: {

exec
/bin/zsh -lc "rg -n \"export const|toolSchemas|schema|session_bootstrap|session_resume|memory_context|memory_search|memory_match_triggers|memory_save|memory_index_scan|shared_memory|code_graph|session_\" .opencode/skill/system-spec-kit/mcp_server -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:4:// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:29:// T303: Tool schemas and dispatch
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:30:import { TOOL_DEFINITIONS } from './tool-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:125:import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:213:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:214:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:215:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:216:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:254:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:255:  secondaryTool: 'code_graph_context';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:320:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:321:    secondaryTool: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:322:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:365:    : typeof args.session_id === 'string'
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:366:      ? args.session_id
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:752:    ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:771:        snap.graphFreshness === 'empty' ? 'run code_graph_scan' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:786:  lines.push('- If structural context shows "ready": code_graph_query is available for structural lookups');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:799:      routingRules.push('Structural queries (callers, imports, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:848:   4. TOOL DEFINITIONS (T303: from tool-schemas.ts)
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:874:    // T018: Track last tool call timestamp for all tools except session_health.
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:875:    if (name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:885:    if (name.startsWith('code_graph_')) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:886:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:985:            existingHints.push('Tip: For code search queries, consider using mcp__cocoindex_code__search for semantic code search or code_graph_query for structural lookups.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1243:      console.error('[context-server] Run memory_index_scan manually after model loads');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1349:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:32:type SharedAdminTool = SharedSpaceAdminTool | 'shared_memory_enable';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:33:type SharedIdentityTool = SharedAdminTool | 'shared_memory_status';
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:108:        details: { reason: 'shared_memory_admin_unconfigured' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:123:        details: { reason: 'shared_memory_admin_ambiguous' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:214:  if (args.tool !== 'shared_memory_enable' && normalizedTenantId.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:239:        reason: 'shared_memory_trusted_binding_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:363:    tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:374:  tool: 'shared_space_upsert' | 'shared_space_membership_set' | 'shared_memory_status' | 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:385:    details: { reason: 'shared_memory_internal_error' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:756:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:765:      tool: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:785:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:805:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:811:        'shared_memory_enable_admin_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:823:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:834:        tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:850:      tool: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:866:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:11:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:14:import { MAX_INGEST_PATHS } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:30:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:16:import { MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:108:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:109:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:291:  hints.push(`Run memory_index_scan({ force: true }) to re-index if needed`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:108:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:189:    session_id: rawSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:221:export const handleMemorySearch = lazyFunction(getMemorySearchModule, 'handleMemorySearch');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:225:export const handleMemoryMatchTriggers = lazyFunction(getMemoryTriggersModule, 'handleMemoryMatchTriggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:229:export const handleMemorySave = lazyFunction(getMemorySaveModule, 'handleMemorySave');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:230:export const indexMemoryFile = lazyFunction(getMemorySaveModule, 'indexMemoryFile');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:231:export const atomicSaveMemory = lazyFunction(getMemorySaveModule, 'atomicSaveMemory');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:232:export const getAtomicityMetrics = lazyFunction(getMemorySaveModule, 'getAtomicityMetrics');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:233:export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:234:export const index_memory_file = lazyFunction(getMemorySaveModule, 'index_memory_file');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:235:export const atomic_save_memory = lazyFunction(getMemorySaveModule, 'atomic_save_memory');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:236:export const get_atomicity_metrics = lazyFunction(getMemorySaveModule, 'get_atomicity_metrics');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:239:export const calculateDocumentWeight = lazyFunction(getPeGatingModule, 'calculateDocumentWeight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:240:export const isSpecDocumentType = lazyFunction(getPeGatingModule, 'isSpecDocumentType');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:241:export const findSimilarMemories = lazyFunction(getPeGatingModule, 'findSimilarMemories');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:242:export const reinforceExistingMemory = lazyFunction(getPeGatingModule, 'reinforceExistingMemory');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:243:export const markMemorySuperseded = lazyFunction(getPeGatingModule, 'markMemorySuperseded');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:244:export const updateExistingMemory = lazyFunction(getPeGatingModule, 'updateExistingMemory');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:245:export const logPeDecision = lazyFunction(getPeGatingModule, 'logPeDecision');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:248:export const handleMemoryIngestStart = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestStart');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:249:export const handleMemoryIngestStatus = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestStatus');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:250:export const handleMemoryIngestCancel = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestCancel');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:251:export const handle_memory_ingest_start = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_start');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:252:export const handle_memory_ingest_status = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_status');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:253:export const handle_memory_ingest_cancel = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_cancel');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:256:export const handleMemoryDelete = lazyFunction(getMemoryCrudModule, 'handleMemoryDelete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:257:export const handleMemoryUpdate = lazyFunction(getMemoryCrudModule, 'handleMemoryUpdate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:258:export const handleMemoryList = lazyFunction(getMemoryCrudModule, 'handleMemoryList');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:259:export const handleMemoryStats = lazyFunction(getMemoryCrudModule, 'handleMemoryStats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:260:export const handleMemoryHealth = lazyFunction(getMemoryCrudModule, 'handleMemoryHealth');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:261:export const setEmbeddingModelReady = lazyFunction(getMemoryCrudModule, 'setEmbeddingModelReady');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:262:export const isEmbeddingModelReady = lazyFunction(getMemoryCrudModule, 'isEmbeddingModelReady');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:263:export const handle_memory_delete = lazyFunction(getMemoryCrudModule, 'handle_memory_delete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:264:export const handle_memory_update = lazyFunction(getMemoryCrudModule, 'handle_memory_update');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:265:export const handle_memory_list = lazyFunction(getMemoryCrudModule, 'handle_memory_list');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:266:export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:267:export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:268:export const set_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'set_embedding_model_ready');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:269:export const is_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'is_embedding_model_ready');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:272:export const handleMemoryIndexScan = lazyFunction(getMemoryIndexModule, 'handleMemoryIndexScan');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:273:export const indexSingleFile = lazyFunction(getMemoryIndexModule, 'indexSingleFile');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:274:export const findConstitutionalFiles = lazyFunction(getMemoryIndexModule, 'findConstitutionalFiles');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:275:export const handle_memory_index_scan = lazyFunction(getMemoryIndexModule, 'handle_memory_index_scan');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:276:export const index_single_file = lazyFunction(getMemoryIndexModule, 'index_single_file');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:277:export const find_constitutional_files = lazyFunction(getMemoryIndexModule, 'find_constitutional_files');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:280:export const handleMemoryBulkDelete = lazyFunction(getMemoryBulkDeleteModule, 'handleMemoryBulkDelete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:283:export const handleCheckpointCreate = lazyFunction(getCheckpointsModule, 'handleCheckpointCreate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:284:export const handleCheckpointList = lazyFunction(getCheckpointsModule, 'handleCheckpointList');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:285:export const handleCheckpointRestore = lazyFunction(getCheckpointsModule, 'handleCheckpointRestore');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:286:export const handleCheckpointDelete = lazyFunction(getCheckpointsModule, 'handleCheckpointDelete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:287:export const handleMemoryValidate = lazyFunction(getCheckpointsModule, 'handleMemoryValidate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:288:export const handle_checkpoint_create = lazyFunction(getCheckpointsModule, 'handle_checkpoint_create');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:289:export const handle_checkpoint_list = lazyFunction(getCheckpointsModule, 'handle_checkpoint_list');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:290:export const handle_checkpoint_restore = lazyFunction(getCheckpointsModule, 'handle_checkpoint_restore');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:291:export const handle_checkpoint_delete = lazyFunction(getCheckpointsModule, 'handle_checkpoint_delete');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:292:export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:295:export const handleTaskPreflight = lazyFunction(getSessionLearningModule, 'handleTaskPreflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:296:export const handleTaskPostflight = lazyFunction(getSessionLearningModule, 'handleTaskPostflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:297:export const handleGetLearningHistory = lazyFunction(getSessionLearningModule, 'handleGetLearningHistory');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:298:export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:299:export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:300:export const handle_get_learning_history = lazyFunction(getSessionLearningModule, 'handle_get_learning_history');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:303:export const handleEvalRunAblation = lazyFunction(getEvalReportingModule, 'handleEvalRunAblation');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:304:export const handleEvalReportingDashboard = lazyFunction(getEvalReportingModule, 'handleEvalReportingDashboard');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:305:export const handle_eval_run_ablation = lazyFunction(getEvalReportingModule, 'handle_eval_run_ablation');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:306:export const handle_eval_reporting_dashboard = lazyFunction(getEvalReportingModule, 'handle_eval_reporting_dashboard');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:309:export const handleMemoryDriftWhy = lazyFunction(getCausalGraphModule, 'handleMemoryDriftWhy');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:310:export const handleMemoryCausalLink = lazyFunction(getCausalGraphModule, 'handleMemoryCausalLink');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:311:export const handleMemoryCausalStats = lazyFunction(getCausalGraphModule, 'handleMemoryCausalStats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:312:export const handleMemoryCausalUnlink = lazyFunction(getCausalGraphModule, 'handleMemoryCausalUnlink');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:313:export const handle_memory_drift_why = lazyFunction(getCausalGraphModule, 'handle_memory_drift_why');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:315:export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:316:export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:319:export const handleMemoryContext = lazyFunction(getMemoryContextModule, 'handleMemoryContext');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:323:export const handleSharedMemoryEnable = lazyFunction(getSharedMemoryModule, 'handleSharedMemoryEnable');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:324:export const handleSharedMemoryStatus = lazyFunction(getSharedMemoryModule, 'handleSharedMemoryStatus');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:325:export const handleSharedSpaceMembershipSet = lazyFunction(getSharedMemoryModule, 'handleSharedSpaceMembershipSet');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:326:export const handleSharedSpaceUpsert = lazyFunction(getSharedMemoryModule, 'handleSharedSpaceUpsert');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:329:export const handleSessionHealth = lazyFunction(getSessionHealthModule, 'handleSessionHealth');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:332:export const handleSessionResume = lazyFunction(getSessionResumeModule, 'handleSessionResume');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:335:export const handleSessionBootstrap = lazyFunction(getSessionBootstrapModule, 'handleSessionBootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:338:export const memorySave = lazyModule(getMemorySaveModule);
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:339:export const memoryIndex = lazyModule(getMemoryIndexModule);
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:340:export const memoryBulkDelete = lazyModule(getMemoryBulkDeleteModule);
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:341:export const checkpoints = lazyModule(getCheckpointsModule);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:5:// + session_health in one call, merging results with hints.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:53:    preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:106:    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:153:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:154:    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:24:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:6:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:8:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:10:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:60:      hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:61:      actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts:18:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:144:      ? 'memory_save: updated indexed memory entry'
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:145:      : 'memory_save: created new indexed memory entry',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:150:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:160:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:251:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:269:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:285:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:462:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:17:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:7:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:26:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:117:      AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:254:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:284:      recordHistory(memory_id, 'ADD', null, parsed.title ?? filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:291:          'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:236:        hint: 'Restart the MCP server or run memory_index_scan() to reinitialize the database',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:237:        actions: ['Restart the MCP server', 'Call memory_index_scan()'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:263:    hints.push('Run memory_index_scan() to regenerate embeddings');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:36:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:47:export const ASSISTIVE_AUTO_MERGE_THRESHOLD = 0.96;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:54:export const ASSISTIVE_REVIEW_THRESHOLD = 0.88;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:124: * Result payload from reconsolidation pre-checks during memory_save.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:301:                recordHistory(id, 'ADD', null, memory.title ?? memory.filePath ?? null, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:322:            reason: `memory_save: reconsolidation ${reconResult.action}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:329:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:335:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:18:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:88:            reason: 'memory_save: reinforced existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:93:              tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:99:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:140:          reason: 'memory_save: updated existing memory via prediction-error gate',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:145:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:151:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:201:  preferredTool: 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:323:    preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:324:    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:741:    // minState omitted — memoryState column not yet in schema
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:772:    // minState omitted — memoryState column not yet in schema
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:806:    // minState omitted — memoryState column not yet in schema
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:70:            schemaVersion: stats.schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:41:export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:42:export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:45:  schemaVersion: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:54:  schemaVersion: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:73:    | 'schema_version_mismatch'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:182:    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:203:  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:206:      'schema_version_mismatch',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:207:      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:333:      schemaVersion: candidate.schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:459:    hints.push('Code graph unavailable. Run `code_graph_scan` to initialize.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:10:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts:11:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:4:// Centralized strict Zod validation schemas for MCP tool inputs.
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:13:// Feature catalog: Strict Zod schema validation
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:26:export const getSchema = <T extends z.ZodRawShape>(shape: T): z.ZodObject<T> => {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:55:  let schema = z.string();
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:57:    schema = schema.min(minLength);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:59:  return schema.refine(isSafePath, { message: PATH_TRAVERSAL_MESSAGE });
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:63:/** Shared max paths constant — used by both schema and handler. */
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:64:export const MAX_INGEST_PATHS = 50;
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:65:export const MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS = 1;
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:155:// E3: Simplified search schema — 3 params only
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:174:  session_id: z.string().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:185:  // Governance args — accepted by tool-schemas.ts tool definition and
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:231:export const memoryBulkDeleteSchema = getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:396:export const TOOL_SCHEMAS: Record<string, ToolInputSchema> = {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:401:  memory_save: memorySaveSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:421:  memory_index_scan: memoryIndexScanSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:445:  shared_memory_status: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:450:  shared_memory_enable: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:454:  session_health: getSchema({}) as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:466:  memory_save: ['filePath', 'force', 'dryRun', 'skipPreflight', 'asyncEmbedding', 'tenantId', 'userId', 'agentId', 'sessionId', 'sharedSpaceId', 'provenanceSource', 'provenanceActor', 'governedAt', 'retentionPolicy', 'deleteAfter'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:486:  memory_index_scan: ['specFolder', 'force', 'includeConstitutional', 'includeSpecDocs', 'incremental'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493:  shared_memory_status: ['tenantId', 'actorUserId', 'actorAgentId'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:494:  shared_memory_enable: [],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:496:  session_health: [],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:567:  const schema = getToolSchema(toolName);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:568:  if (!schema) {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:569:    throw new ToolSchemaValidationError(toolName, `Unknown tool: "${toolName}". No schema registered.`, {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:578:    return schema.parse(rawInput);
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:583:      console.error(`[schema-validation] ${toolName}: ${formatted.message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts:99:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:113:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:130:  CREATE TABLE IF NOT EXISTS session_learning (
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:135:    session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:161:  CREATE INDEX IF NOT EXISTS idx_session_learning_spec_folder
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:162:  ON session_learning(spec_folder)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:166:  CREATE INDEX IF NOT EXISTS idx_session_learning_task_lookup
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:167:  ON session_learning(spec_folder, task_id, session_id, phase, updated_at, id)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:175:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:194:// M2 FIX: Track schema init per database instance, not as a process-global boolean.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:196:const schemaInitializedDbs = new WeakSet<Database>();
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:210:    WHERE type = 'table' AND name = 'session_learning'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:217:  const tempTableName = 'session_learning_legacy_migration';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:221:    database.exec(`ALTER TABLE session_learning RENAME TO ${tempTableName}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:224:      INSERT INTO session_learning (${SESSION_LEARNING_COLUMNS})
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:240:      'Failed to migrate session_learning schema',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:246:/** Initialize the session_learning table schema if not already created */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:248:  if (schemaInitializedDbs.has(database)) return;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:257:    schemaInitializedDbs.add(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:264:      'Failed to initialize session_learning schema',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:334:  const normalizedSessionId = normalizeSessionId(session_id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:340:     FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:344:       AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:351:      UPDATE session_learning
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:352:      SET session_id = ?, pre_knowledge_score = ?, pre_uncertainty_score = ?, pre_context_score = ?, knowledge_gaps = ?, updated_at = ?
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:398:    INSERT INTO session_learning
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:399:    (spec_folder, task_id, phase, session_id, pre_knowledge_score, pre_uncertainty_score, pre_context_score, knowledge_gaps, created_at, updated_at)
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:491:  const normalizedSessionId = normalizeSessionId(session_id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:495:    FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:501:    query += ' AND session_id = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:538:        : `No preflight record found for spec_folder="${spec_folder}", task_id="${taskId}", session_id="${normalizedSessionId}". Call task_preflight first.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:568:      UPDATE session_learning SET
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:686:    const normalizedSessionId = normalizeSessionId(session_id);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:688:      SELECT * FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:694:      sql += ' AND session_id = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:772:        FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:778:        summarySql += ' AND session_id = ?';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:875:const ensure_schema = ensureSchema;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:881:  ensure_schema,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:18:import { validateToolArgs } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:61:export const TOOL_NAMES = new Set([
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:65:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:100:    case 'memory_save':           return handleMemorySave(parseArgs<SaveArgs>(validateToolArgs('memory_save', args)));
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:33:export const SERVER_DIR: string = path.join(import.meta.dirname, '..');
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:34:export const NODE_MODULES: string = path.join(SERVER_DIR, 'node_modules');
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:35:export const LIB_DIR: string = path.join(import.meta.dirname, '..', 'lib');
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:36:export const SHARED_DIR: string = path.join(SERVER_DIR, '..', 'shared');
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:81:export const DATABASE_DIR: string = resolvedDatabasePaths.databaseDir;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:82:export const DATABASE_PATH: string = resolvedDatabasePaths.databasePath;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:83:export const DB_UPDATED_FILE: string = resolvedDatabasePaths.dbUpdatedFile;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:91:export const BATCH_SIZE: number = Number.isFinite(parsedBatchSize) && parsedBatchSize > 0 ? parsedBatchSize : 5;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:93:export const BATCH_DELAY_MS: number = Number.isFinite(parsedBatchDelayMs) && parsedBatchDelayMs > 0 ? parsedBatchDelayMs : 100;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:100:export const INDEX_SCAN_COOLDOWN: number = 60000;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:107:export const MAX_QUERY_LENGTH: number = 10000;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:109:export const INPUT_LIMITS: Readonly<InputLimitsConfig> = {
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:124:export const DEFAULT_BASE_PATH: string = process.env.MEMORY_BASE_PATH || process.cwd();
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:126:export const ALLOWED_BASE_PATHS: string[] = [
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:139:export const CONSTITUTIONAL_CACHE_TTL: number = 60000;
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:176:export const COGNITIVE_CONFIG: CognitiveConfig = COGNITIVE_CONFIG_LAZY;
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:6:import { validateToolArgs } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:4:// T018: MCP tool handler for session_health — reports session
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65:/** Handle session_health tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:160:      producer: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:161:      sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:170:    sourceSurface: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:377:    'schemaVersion',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:408:      schemaVersion: result.schemaVersion as string | null | undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:515:    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:542:  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1360:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:18:export const TOOL_NAMES = new Set([
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:19:  'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:20:  'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:21:  'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:22:  'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:58:    case 'code_graph_scan':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:60:    case 'code_graph_query': {
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:67:    case 'code_graph_status':
.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:69:    case 'code_graph_context':
.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts:90:          session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts:36:export const estimateTokens = estimateTokenCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:48:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:148:/** Handle memory_index_scan tool - scans and indexes memory files with incremental support */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:153:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:157:        hint: 'Retry memory_index_scan after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:176:      console.error(`[memory_index_scan] Using embedding provider: ${profile.provider}, model: ${profile.model}, dimension: ${profile.dim}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:180:    console.warn('[memory_index_scan] Could not verify embedding dimension:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:195:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:271:              'mcp:memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:312:      tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:631:    tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:671:const handle_memory_index_scan = handleMemoryIndexScan;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:680:  handle_memory_index_scan,
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:5:// Create a point-in-time SQLite checkpoint before schema migrations.
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:25:  schemaVersion: number | null;
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:141: * Read the current schema version from a SQLite database.
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:151:    const row = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:187:  const schemaVersion = getSchemaVersion(args.dbPath);
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:194:    schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:208:    schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:230:  console.log(`Schema version: ${result.schemaVersion ?? 'unknown'}`);
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:24:import { validateToolArgs } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:46:export const TOOL_NAMES = new Set([
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:47:  'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:58:  'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:59:  'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:60:  'session_health',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:68:    case 'memory_index_scan':          return handleMemoryIndexScan(parseArgs<ScanArgs>(validateToolArgs('memory_index_scan', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:79:    case 'shared_memory_status':       return handleSharedMemoryStatus(parseArgs<SharedMemoryStatusArgs>(validateToolArgs('shared_memory_status', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:80:    case 'shared_memory_enable':       return handleSharedMemoryEnable(parseArgs<Record<string, unknown>>(validateToolArgs('shared_memory_enable', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:81:    case 'session_health':             return handleSessionHealth();
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:334:        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:462:          `Run memory_index_scan with force:true to rebuild FTS5 index.`
.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:17:export const ALL_DISPATCHERS = [
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:4:import type { ToolDefinition } from '../tool-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:79:function validateProperty(field: string, value: unknown, schema: JsonSchemaProperty): void {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:80:  if (schema.const !== undefined && value !== schema.const) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:81:    throw new Error(`Invalid value for '${field}': expected constant ${String(schema.const)}`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:84:  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:85:    throw new Error(`Invalid value for '${field}': must be one of ${schema.enum.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:88:  if (schema.type) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:89:    validateType(field, value, schema.type);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:92:  if (schema.type === 'array' && schema.items && Array.isArray(value)) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:94:      validateProperty(field, item, schema.items);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:98:  if (schema.type === 'string' && typeof value === 'string') {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:99:    if (schema.minLength !== undefined && value.length < schema.minLength) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:100:      throw new Error(`Invalid value for '${field}': length must be >= ${schema.minLength}`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:102:    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:103:      throw new Error(`Invalid value for '${field}': length must be <= ${schema.maxLength}`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:107:  if (schema.type === 'array' && Array.isArray(value)) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:108:    if (schema.minItems !== undefined && value.length < schema.minItems) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:109:      throw new Error(`Invalid value for '${field}': must contain at least ${schema.minItems} item(s)`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:111:    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:112:      throw new Error(`Invalid value for '${field}': must contain at most ${schema.maxItems} item(s)`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:117:    schema.type === 'number' &&
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:119:    (schema.minimum !== undefined || schema.maximum !== undefined)
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:122:    if (schema.minimum !== undefined && numericValue < schema.minimum) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:123:      throw new Error(`Invalid value for '${field}': must be >= ${schema.minimum}`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:125:    if (schema.maximum !== undefined && numericValue > schema.maximum) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:126:      throw new Error(`Invalid value for '${field}': must be <= ${schema.maximum}`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:174: * Validate tool arguments against the declared MCP input schema.
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:181: * Unknown tools or missing schemas are skipped to preserve legacy behavior.
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:193:  const schema = toolDefinition.inputSchema as InputSchema;
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:194:  if (schema.type === 'object' && (args === null || typeof args !== 'object' || Array.isArray(args))) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:198:  const required = schema.required ?? [];
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:204:  if (Array.isArray(schema['x-requiredAnyOf']) && schema['x-requiredAnyOf'].length > 0) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:205:    const branchMatched = schema['x-requiredAnyOf'].some((fields) =>
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:209:      throw new Error(`Arguments for '${toolName}' do not satisfy required schema constraints`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:213:  if (!schema.properties) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:214:    if (!matchesSchemaConstraint(args, schema)) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:215:      throw new Error(`Arguments for '${toolName}' do not satisfy required schema constraints`);
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:221:    if (schema.additionalProperties === false && !Object.prototype.hasOwnProperty.call(schema.properties, field)) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:227:    const propertySchema = schema.properties[field];
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:234:  if (!matchesSchemaConstraint(args, schema)) {
.opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts:235:    throw new Error(`Arguments for '${toolName}' do not satisfy required schema constraints`);
.opencode/skill/system-spec-kit/mcp_server/handlers/handler-utils.ts:19:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:52:      error: 'Database not initialized. Run memory_index_scan() to trigger schema creation, or restart the MCP server.',
.opencode/skill/system-spec-kit/mcp_server/cli.ts:13://   Node .opencode/skill/system-spec-kit/mcp_server/dist/cli.js schema-downgrade --to 15 --confirm
.opencode/skill/system-spec-kit/mcp_server/cli.ts:28:type SchemaDowngradeModule = Awaited<typeof import('./lib/storage/schema-downgrade.js')>;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:39:let _schema_downgrade: SchemaDowngradeModule | null = null;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:78:  return _schema_downgrade ??= await import('./lib/storage/schema-downgrade.js');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:118:  schema-downgrade --to 15 --confirm
.opencode/skill/system-spec-kit/mcp_server/cli.ts:119:                                 Downgrade schema from v16 to v15 (targeted, destructive)
.opencode/skill/system-spec-kit/mcp_server/cli.ts:133:  spec-kit-cli schema-downgrade --to 15 --confirm
.opencode/skill/system-spec-kit/mcp_server/cli.ts:205:    const versionRow = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:212:      const legacyVersion = db.prepare("SELECT value FROM config WHERE key = 'schema_version'").get() as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/cli.ts:217:      // No schema version metadata available
.opencode/skill/system-spec-kit/mcp_server/cli.ts:520:    console.error('ERROR: --confirm is required for schema-downgrade.');
.opencode/skill/system-spec-kit/mcp_server/cli.ts:577:    case 'schema-downgrade':
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:12:import { validateToolArgs } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:24:export const TOOL_NAMES = new Set([
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:84:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:243: * Map tool schema direction values to getCausalChain direction values.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:244: * Tool schema: 'outgoing' | 'incoming' | 'both'
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:69:  const schemaResult = envSchema.safeParse(env);
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:70:  if (!schemaResult.success) {
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:71:    const errors: CognitiveConfigParseError[] = schemaResult.error.issues.map((issue) => {
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:80:  const source = schemaResult.data.SPECKIT_COGNITIVE_COACTIVATION_PATTERN;
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:81:  const flags = schemaResult.data.SPECKIT_COGNITIVE_COACTIVATION_FLAGS;
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts:114:export const COGNITIVE_CONFIG: CognitiveConfig = loadCognitiveConfigFromEnv(process.env);
.opencode/skill/system-spec-kit/mcp_server/utils/index.ts:59:} from './tool-input-schema.js';
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:12:import { validateToolArgs } from '../schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:24:export const TOOL_NAMES = new Set([
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:28:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:613:    reason: `memory_save: chunked indexing (${chunkResult.strategy}, ${chunkResult.chunks.length} chunks)`,
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:618:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:628:    actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index.vitest.ts:39:        'handle_memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:4:// MCP tool handler for code_graph_query — queries structural relationships.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:317:/** Handle code_graph_query tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:361:          }, readiness, 'code_graph_query outline payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:400:          }, readiness, 'code_graph_query blast_radius payload'),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:433:          }, readiness, `code_graph_query ${operation} payload`),
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:559:          }, readiness, `code_graph_query ${operation} payload`, result.edges[0]
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:15:    session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/pe-gating.vitest.ts:27:    session_id: null,
.opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts:40:export const MAX_BATCH_SIZE = 100;
.opencode/skill/system-spec-kit/mcp_server/utils/batch-processor.ts:43:export const DEFAULT_RETRY_OPTIONS: Readonly<RetryDefaults> = {
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:123:/** Handle code_graph_scan tool call */
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:14:import { TOOL_DEFINITIONS, getSchema, validateToolArgs } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:15:import { validateToolInputSchema } from '../utils/tool-input-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:47:  it('public tool schemas do not publish top-level combinators', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:49:      const schema = tool.inputSchema as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:50:      expect(schema).not.toHaveProperty('oneOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:51:      expect(schema).not.toHaveProperty('not');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:52:      expect(schema).not.toHaveProperty('allOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:53:      expect(schema).not.toHaveProperty('anyOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:57:  it('all tool schemas have type: object at top level', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:59:      const schema = tool.inputSchema as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:60:      expect(schema.type).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:95:    const schema = getSchema({
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:99:    const parsed = schema.safeParse({ query: 'valid query', unexpected: true });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:109:    const schema = getSchema({
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:113:    const parsed = schema.parse({ query: 'valid query', unexpected: true });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:129:  it('logs schema validation failures to stderr for auditability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:133:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:137:    expect(errorSpy.mock.calls.some((call) => String(call[0]).includes('[schema-validation] memory_search:'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:163:describe('memory_delete schema (oneOf removed, handler-validated)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:191:    }).toThrow(/required schema constraints/);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:213:describe('memory_bulk_delete schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:220:  it('rejects confirm=false at schema level', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:240:   4. memory_search LIMIT CONTRACT (schema + runtime alignment)
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:243:describe('memory_search limit contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:244:  it('public schema accepts cursor-only continuation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:246:      validateToolInputSchema('memory_search', { cursor: 'opaque-cursor-token' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:250:  it('runtime schema accepts cursor-only continuation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:252:      validateToolArgs('memory_search', { cursor: 'opaque-cursor-token' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:256:  it('public schema accepts concepts-only search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:258:      validateToolInputSchema('memory_search', { concepts: ['alpha', 'beta'] }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:262:  it('public schema rejects requests without query or concepts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:264:      validateToolInputSchema('memory_search', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:265:    }).toThrow(/required schema constraints/);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:270:      validateToolArgs('memory_search', { query: 'ab', limit: 100 });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:276:      validateToolArgs('memory_search', { query: 'ab', limit: 101 });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:280:  it('public schema rejects limit above 100', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:282:      validateToolInputSchema('memory_search', { query: 'ab', limit: 101 }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:288:      validateToolArgs('memory_search', { concepts: ['solo'] });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:292:  it('public schema rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:294:      validateToolInputSchema('memory_search', { query: 'valid query', unexpected: true }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:298:  it('public schema enforces query minimum length', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:300:      validateToolInputSchema('memory_search', { query: 'a' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:304:  it('runtime rejects unknown memory_search parameters', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:306:      validateToolArgs('memory_search', { query: 'valid query', unexpected: true } as Record<string, unknown>);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:310:  it('runtime accepts governed scope fields for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:312:      validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:335:describe('governed retrieval schema propagation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:363:  it('public and runtime schemas accept governed scope fields for memory_quick_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:395:describe('shared-memory admin actor schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:396:  it('public schemas expose actor identity fields without top-level exclusivity combinators', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:397:    for (const toolName of ['shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status']) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:399:      const schema = tool?.inputSchema as { properties?: Record<string, unknown> } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:400:      expect(schema?.properties).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:404:      expect(schema).not.toHaveProperty('oneOf');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:405:      expect(schema).not.toHaveProperty('not');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:442:  it('handler requires caller identity for shared_memory_status', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:454:  it('runtime accepts shared_memory_status with one actor identity', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:456:      validateToolArgs('shared_memory_status', {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:463:  it('public causal tool schemas expose string memory identifiers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:479:describe('memory_health schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:480:  it('public schema rejects divergent_aliases limit above 200', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:486:  it('public schema accepts autoRepair confirmation payloads', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:492:  it('runtime schema preserves confirmed for handler execution', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:498:describe('checkpoint_delete schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:499:  it('public checkpoint_list schema rejects limit above 100', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:505:  it('requires confirmName at schema level', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:519:describe('schema validation performance (CHK-024)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:525:      const schema = tool.inputSchema as { properties?: Record<string, unknown>; required?: string[] };
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:526:      for (const key of schema.required ?? []) {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:527:        const prop = (schema.properties ?? {})[key] as { type?: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:41:export const INPUT_LIMITS: Readonly<InputLimits> = {
.opencode/skill/system-spec-kit/mcp_server/utils/validators.ts:52:export const MAX_QUERY_LENGTH: number = 10000;
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:106:    // Create memory_index table matching production schema
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:16:      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:23:      'SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:30:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:82:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:118:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:143:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(deleteSessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:148:        WHERE session_id = ? AND attention_score < ?
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:159:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/decay-delete-race.vitest.ts:198:      testDb.prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:103:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:105:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:945:            actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:972:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1078:/** Handle memory_save tool - validates, indexes, and persists a memory file to the database */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1086:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1093:        hint: 'Retry memory_save after checkpoint_restore maintenance completes.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1151:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1174:        action: 'memory_save_shared_space',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1213:      tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1310:            tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1316:              actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1345:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1441:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1447:          actions: ['Run npm run build --workspace=@spec-kit/scripts', 'Retry memory_save'],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1462:        action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1490:            actor: provenanceActor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1703:        'Retry memory_save({ filePath, force: true }) once dependencies are healthy',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1789:const handle_memory_save = handleMemorySave;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1796:  handle_memory_save,
.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:12:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:49:      schemaVersion: number;
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:91:  'memory_save',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:92:  'memory_index_scan'
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:110:// T018: Session-level tracking for prime package and session_health
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:232:        schemaVersion: stats.schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:457:    recommendedCalls.push('code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:471:    toolRoutingRules.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:497:    ?? (typeof toolArgs.session_id === 'string' ? toolArgs.session_id : null);
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:680:  // T018: Session tracking for session_health tool
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:16: * Create an in-memory SQLite DB with the memory_index schema
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:17: * matching the production schema from vector-index-impl.js.
.opencode/skill/system-spec-kit/mcp_server/tests/incremental-index-v2.vitest.ts:49:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:15:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:47:description: "Durable regression fixture for memory_save UX contract coverage."
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:68:Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:85:| \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:132:session_id: "${titleSlug}-fixture"
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:248:  it('memory_save success response exposes postMutationHooks contract fields and types', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:220:            schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:226:            schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:233:            schemaVersion: '',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:240:            schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:247:            schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:254:            schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:276:    expect(byId.get(303)).toMatchObject({ publishable: false, exclusionReason: 'missing_schema_version' });
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:4:// MCP tool handler for code_graph_context — LLM-oriented graph neighborhoods.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:87:/** Handle code_graph_context tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:204:          error: 'code_graph_context failed',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:10:import { memoryBulkDeleteSchema } from '../schemas/tool-input-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:307:      const id = mod.recordHistory(1, 'ADD', null, 'reconsolidation test', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:314:      expect(entry!.actor).toBe('mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:353:      'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:359:      'mcp:memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:405:    it('T508-08f: confirm=false fails schema validation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:67:    // Create memory_index table (matches production schema)
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:113:  input: Pick<HookInput, 'session_id'> & { specFolder?: string } = {},
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:115:  const sessionId = typeof input.session_id === 'string' ? input.session_id : undefined;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:143:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:155:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:169:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:216:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:4:// MCP tool handler for code_graph_status — reports graph health.
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9:/** Handle code_graph_status tool call */
.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:28:            schemaVersion: stats.schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:28:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:56:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:60:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:64:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:69:      SELECT id, tenant_id, user_id, session_id
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:91:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, user_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:95:      INSERT INTO memory_index (id, spec_folder, file_path, tenant_id, agent_id, session_id)
.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts:100:      SELECT id, tenant_id, user_id, agent_id, session_id
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:10:// Feature catalog: Workspace scanning and indexing (memory_index_scan)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts:69:export const EMPTY_ALIAS_CONFLICT_SUMMARY: AliasConflictSummary = {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:51:    'understand the database schema',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:35:    query: 'schema validation for tool inputs',
.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:78:    { id: 202, content: 'Tool schemas define optional fields, defaults, and shared validation helpers. '.repeat(2) },
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:116:    const b = 'database migration schema upgrade';
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:166:      title: 'database migration schema upgrade version',
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:352:      title: 'database migration schema upgrade version',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:6:export const HOOK_TIMEOUT_MS = 1800;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:8:export const COMPACTION_TOKEN_BUDGET = 4000;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:10:export const SESSION_PRIME_TOKEN_BUDGET = 2000;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:14:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:17:// Feature catalog: Memory indexing (memory_save)
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:297:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:303:      recordHistory(nextMemoryId, 'ADD', null, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:304:      recordHistory(memoryId, 'UPDATE', previous.title, parsed.title ?? parsed.filePath, 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:32:    session_id: 'sess-abc123',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:9:// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:63:    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:128:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:123:    expect(envelope.data.details?.reason).toBe('shared_memory_admin_unconfigured');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:140:    expect(envelope.data.details?.reason).toBe('shared_memory_trusted_binding_required');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:711:    expect(envelope.data.details?.reason).toBe('shared_memory_enable_admin_required');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:240:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:569:      metadata: { conflictKind: 'schema_mismatch' },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:597:          conflictKind: 'schema_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:599:          strategyReason: 'high_risk:schema_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:630:          conflictKind: 'schema_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:632:          strategyReason: 'high_risk:schema_mismatch',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts:835:      .get('shared_memory_enabled') as { count: number };
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:9://   { session_id, transcript_path, cwd, hook_event_name, timestamp, source }
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:109:        '- `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:121:      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:135:      content: 'Code graph freshness is stale. The first structural read may refresh inline when safe; run `code_graph_scan` for broader stale states.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:176:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:48:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:84:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:118:      if (normalizedSql.includes('CREATE TABLE IF NOT EXISTS session_sent_memories')) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:119:        tables.add('session_sent_memories');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:122:      if (normalizedSql.includes('CREATE TABLE IF NOT EXISTS session_state')) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:123:        tables.add('session_state');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:129:      if (normalizedSql.includes('ALTER TABLE session_state ADD COLUMN tenant_id')) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:132:      if (normalizedSql.includes('ALTER TABLE session_state ADD COLUMN user_id')) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:135:      if (normalizedSql.includes('ALTER TABLE session_state ADD COLUMN agent_id')) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:148:          if (normalizedSql === 'DELETE FROM session_sent_memories WHERE sent_at < ?') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:152:          if (normalizedSql === "DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:164:          if (normalizedSql.startsWith('INSERT INTO session_state (')) {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:195:              session_id: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:213:          if (normalizedSql === "UPDATE session_state SET status = 'completed', updated_at = ? WHERE session_id = ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:224:          if (normalizedSql === "UPDATE session_state SET status = 'interrupted', updated_at = ? WHERE status = 'active'") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:237:          if (normalizedSql === "UPDATE session_state SET status = 'active', updated_at = ? WHERE session_id = ?") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:256:          if (normalizedSql === 'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:261:          if (normalizedSql === 'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:265:          if (normalizedSql === 'SELECT session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, tenant_id, user_id, agent_id, created_at, updated_at FROM session_state WHERE session_id = ?') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:270:          if (normalizedSql === 'SELECT tenant_id, user_id, agent_id FROM session_state WHERE session_id = ? LIMIT 1') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:286:          if (normalizedSql === 'PRAGMA table_info(session_state)') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:290:          if (normalizedSql === 'SELECT session_id, spec_folder, current_task, last_action, context_summary, pending_work, updated_at, tenant_id, user_id, agent_id FROM session_state WHERE status = \'interrupted\' ORDER BY updated_at DESC') {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:295:                session_id: row.session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:308:          if (normalizedSql === "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='session_state'") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:310:              .filter((statement) => statement.includes('CREATE INDEX IF NOT EXISTS idx_session_state_'))
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:317:          if (normalizedSql === "SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'") {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:318:            return tables.has('session_state') ? [{ name: 'session_state' }] : [];
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:397:    it('should create session_state table and indexes', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:401:      expect(database.execStatements.some((sql) => sql.includes('CREATE TABLE IF NOT EXISTS session_state'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:402:      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_status'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:403:      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_updated'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:404:      expect(database.execStatements.some((sql) => sql.includes('idx_session_state_identity_scope'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:424:        session_id: 'session-state-save',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:569:    it('should create session_state table with correct columns', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:580:        'session_id',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:593:      const createTableSql = database.execStatements.find((sql) => sql.includes('CREATE TABLE IF NOT EXISTS session_state'));
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:892:    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:897:  it('schema versioning detection', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:901:    expect(stats.schemaVersion).toBe(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:909:    fs.writeFileSync(trackedFile, 'export const value = 1;\n');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:64:    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:378:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:75:    it('T209-5: setAttentionScore called with (session_id, match.memoryId, score)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:78:      const strictPattern = /workingMemory\.setAttentionScore\(\s*(?:session_id|sessionId)\s*(as\s+string)?\s*,\s*match\.memoryId\s*,\s*[\d.]+\s*\)/;
.opencode/skill/system-spec-kit/mcp_server/tests/trigger-setAttentionScore.vitest.ts:79:      const relaxedPattern = /workingMemory\.setAttentionScore\([^)]*(?:session_id|sessionId)/;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:136:  it('initializes schema with v16 chunk columns and parent indexes', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:138:    const tempDir = makeTempDir('spec-kit-schema-v16-');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:153:    const versionRow = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:405:  it('downgrades schema from v16 to v15 and removes chunk columns', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:406:    const tempDir = makeTempDir('spec-kit-schema-downgrade-');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:412:    const downgrade = await import('../lib/storage/schema-downgrade');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:419:    const beforeVersion = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:422:    // Set schema to v16 for the v16→v15 downgrade test (v17+ migrations are independent of chunk columns)
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:423:    db.prepare('UPDATE schema_version SET version = 16 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:430:    const afterVersion = db.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:517:    expect(cliSource).toContain('schema-downgrade');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:518:    expect(cliSource).toContain('--confirm is required for schema-downgrade');
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:11:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:35:  const row = db.prepare('SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?')
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:93:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:98:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:104:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:112:        SELECT session_id
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:114:        ORDER BY session_id ASC
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:115:      `).all() as Array<{ session_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-stress.vitest.ts:116:      const remainingSessionIds = remainingRows.map(row => row.session_id);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:61:    recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:97:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:120:    expect(parsed.data.hints.some((hint: string) => hint.includes('Run code_graph_scan'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:185:  it('schema-downgrade fails safely when current schema is newer than v16', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:186:    const sandbox = createSandbox('spec-kit-cli-schema-downgrade-');
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:193:    const downgradeResult = runCli(['schema-downgrade', '--to', '15', '--confirm'], {
.opencode/skill/system-spec-kit/mcp_server/tests/cli.vitest.ts:219:    const missingConfirm = runCli(['schema-downgrade', '--to', '15'], {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:386:        errors: ['session_state: merge restore rolled back after pre-clear because reinsertion failed'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:389:        rolledBackTables: ['session_state'],
.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:396:        expect(parsed.data?.details?.rolledBackTables).toEqual(['session_state']);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:11:// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:93:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:209:  const schemaResult = ensureSchema();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:210:  if (!schemaResult.success) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:211:    return schemaResult;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:278:  if (!db || !hasTable('session_state')) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:282:      'SELECT 1 FROM session_state WHERE session_id = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:293:  if (!db || !hasTable('session_sent_memories')) return false;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:297:      'SELECT 1 FROM session_sent_memories WHERE session_id = ? LIMIT 1'
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:335:  if (!db || !hasTable('session_state')) {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:341:    FROM session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:342:    WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:442:  CREATE TABLE IF NOT EXISTS session_sent_memories (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:443:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:447:    PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:452:  'CREATE INDEX IF NOT EXISTS idx_session_sent_session ON session_sent_memories(session_id);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:453:  'CREATE INDEX IF NOT EXISTS idx_session_sent_time ON session_sent_memories(sent_at);',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:522:      SELECT 1 FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:523:      WHERE session_id = ? AND memory_hash = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:565:      SELECT memory_hash FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:568:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:647:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:678:      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:713:      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:722:      DELETE FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:723:      WHERE session_id = ? AND rowid IN (
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:724:        SELECT rowid FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:725:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:745:      DELETE FROM session_sent_memories WHERE sent_at < ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:762: *   - session_sent_memories: entries with sent_at older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:763: *   - session_state: completed/interrupted sessions older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:766: *   - session_learning records (permanent, never cleaned)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:767: *   - Active sessions (session_state with status='active')
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:795:  // 2. Clean stale session_sent_memories entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:797:    const smStmt = db.prepare('DELETE FROM session_sent_memories WHERE sent_at < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:803:      errors.push(`session_sent_memories cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:807:  // 3. Clean completed/interrupted session_state entries (NEVER clean active sessions)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:810:      `DELETE FROM session_state WHERE status IN ('completed', 'interrupted') AND updated_at < ?`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:817:      errors.push(`session_state cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:825:      `${sentMemoriesDeleted} sent_memories, ${sessionStateDeleted} session_state entries ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:848:      DELETE FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:877:      FROM session_sent_memories
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:878:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:889:    console.warn(`[session-manager] get_session_stats failed: ${message}`);
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
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1074:    console.error(`[session-manager] save_session_state failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1084:      UPDATE session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1086:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1112:      UPDATE session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1136:      SELECT session_id, status, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1140:      FROM session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1141:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1160:      sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1178:        UPDATE session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1180:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1199:      SELECT session_id, spec_folder, current_task, last_action,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1202:      FROM session_state
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1219:        sessionId: row.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1349:    console.error(`[session-manager] write_continue_session_md failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest-edge.vitest.ts:30:import { MAX_INGEST_PATHS } from '../schemas/tool-input-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:23:          : 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/budget-allocator.ts:32:export const DEFAULT_FLOORS = {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:9:// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:34:  const sessionId = input.session_id ?? 'unknown';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:11:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:17:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:49:      INSERT INTO working_memory (session_id, memory_id, attention_score)
.opencode/skill/system-spec-kit/mcp_server/tests/session-boost.vitest.ts:74:      INSERT INTO working_memory (session_id, memory_id, attention_score)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:188:    routingParts.push('structural queries (callers, deps) → code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:243:      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:253:    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:255:    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:269:      producer: 'session_snapshot',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:269:      session_id: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/learning-stats-filters.vitest.ts:429:        FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:4:// All MCP tool definitions (names, descriptions, input schemas).
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:9:} from './schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:12: * Re-export schema validation helpers used by the MCP tool entry points.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:20:} from './schemas/tool-input-schemas.js';
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:27: * Normalized definition for a single MCP tool and its JSON schema.
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:212:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:213:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:218:  name: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:444:  name: 'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:459:  name: 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:562:  name: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:624:  name: 'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:639:  name: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:657:  name: 'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:658:  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:663:  name: 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733:  name: 'session_health',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:769:      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:845:  description: '[L9:CoverageGraph] Report deep-loop coverage graph health: node/edge counts grouped by kind and relation, current convergence signal values, momentum (signal deltas between snapshots), last iteration, schema version, and DB file size. Suitable for dashboards and synthesis surfaces.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:878:export const TOOL_DEFINITIONS: ToolDefinition[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:42:  | 'code_graph_query'
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:104:    case 'code_graph_query':
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:17:    schemaVersion: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:34:      text: 'Aligned structural bootstrap contract across auto-prime and session_* handlers.',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:90:      schemaVersion: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:97:    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:181:  it('T022: memory_search has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:182:    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:183:    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:191:  it('T024: memory_save has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:192:    expect(TOOL_SPECIFIC_HINTS.memory_save).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:193:    expect(typeof TOOL_SPECIFIC_HINTS.memory_save).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:196:  it('T025: memory_index_scan has tool-specific hints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:197:    expect(TOOL_SPECIFIC_HINTS.memory_index_scan).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:198:    expect(typeof TOOL_SPECIFIC_HINTS.memory_index_scan).toBe('object');
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:221:  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:224:      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:229:  it('T030: memory_save FILE_NOT_FOUND has contextual guidance', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:231:      TOOL_SPECIFIC_HINTS.memory_save?.[ERROR_CODES.FILE_NOT_FOUND];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:244:    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:246:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:292:    const fullHint = getRecoveryHint('memory_save', ERROR_CODES.VALIDATION_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:299:    const saveEmbedHint = getRecoveryHint('memory_save', ERROR_CODES.EMBEDDING_FAILED);
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
.opencode/skill/system-spec-kit/mcp_server/tests/create-record-lineage-regressions.vitest.ts:5:import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:9:  { tool: 'memory_save', handler: 'handleMemorySave', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:28:  { tool: 'memory_index_scan', handler: 'handleMemoryIndexScan', layer: 'L7' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:35:  { camel: 'handleMemorySave', snake: 'handle_memory_save' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:55:  { camel: 'handleMemoryIndexScan', snake: 'handle_memory_index_scan' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:62:      testDb.exec('DELETE FROM session_sent_memories');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:235:        SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:265:        SELECT session_id FROM session_sent_memories ORDER BY session_id
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:266:      `).all() as Array<{ session_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager.vitest.ts:268:      const sessions: Set<string> = new Set(entries.map((e) => e.session_id));
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:82:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:83:      const key2 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:88:      const key1 = generateCacheKey('memory_search', { query: 'auth' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:89:      const key2 = generateCacheKey('memory_search', { query: 'login' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:95:      const key1 = generateCacheKey('memory_search', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:96:      const key2 = generateCacheKey('memory_save', args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:352:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:353:      const key2 = generateCacheKey('memory_search', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:354:      const key3 = generateCacheKey('memory_save', { query: 'test3' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:355:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:356:      set(key2, 'value2', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:357:      set(key3, 'value3', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:358:      const invalidated = invalidateByTool('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:366:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:367:      const key2 = generateCacheKey('memory_save', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:369:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:370:      set(key2, 'value2', { toolName: 'memory_save' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:380:      const key1 = generateCacheKey('memory_search', { query: 'test1' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:381:      const key2 = generateCacheKey('memory_save', { query: 'test2' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:383:      set(key1, 'value1', { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/tests/tool-cache.vitest.ts:384:      set(key2, 'value2', { toolName: 'memory_save' });
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
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:20:    dbFileSize: 2048, schemaVersion: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:82:      lastScanTimestamp: null, dbFileSize: 0, schemaVersion: 1,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:4:// Feature catalog: Database and schema safety
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:60:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:94:    .prepare('SELECT version FROM schema_version WHERE id = 1')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:136:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:175:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:247:    throw new Error(`Downgrade supports only v${TARGET_FROM_VERSION} -> v${TARGET_TO_VERSION}. Current schema is v${currentVersion}.`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:252:  const checkpointName = options.checkpointName || `pre-schema-downgrade-v16-to-v15-${nowTimestampForName()}`;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:257:      reason: 'schema downgrade v16->v15',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/schema-downgrade.ts:296:        INSERT OR REPLACE INTO schema_version (id, version, updated_at)
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:25:        preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:140:        nextActions: ['Use code_graph_query'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:151:      preferredTool: 'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:154:    expect(parsed.data.structuralRoutingNudge.message).toContain('Prefer `code_graph_query`');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:280:        recommendedAction: 'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:295:      'Structural context available. Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/deferred-features-integration.vitest.ts:144:    .run(5, 'specs/003-data', 'data/schema.md', 'Database Schema');
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:16:export const SESSION_ANALYTICS_DB_FILENAME = 'speckit-session-analytics.db';
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:92:    claude_session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:93:    speckit_session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:117:    claude_session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:136:    UNIQUE(claude_session_id, transcript_path, byte_start)
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:160:    ON analytics_turns (claude_session_id, transcript_path, line_no);
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:167:  claude_session_id: string;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:168:  speckit_session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:192:  claude_session_id: string;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:393:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:422:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:453:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:480:      claude_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:481:      speckit_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:502:    ON CONFLICT(claude_session_id) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:503:      speckit_session_id = excluded.speckit_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:533:      claude_session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:614:    ORDER BY claude_session_id ASC
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:625:    WHERE claude_session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:15: * Phases 1 (schema) and 3 (discovery) require live DB/filesystem and are
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:871:        session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:914:        session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:1000:   Phase 1 schema migration and Phase 3 discovery (findSpecDocuments,
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:161:    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:57:      WHERE session_id = 's1'
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:76:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:81:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:88:    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s2', 3) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:100:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:104:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:108:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:118:      WHERE session_id = 's5'
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:135:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:139:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:145:    const deleted = db.prepare('SELECT COUNT(*) AS count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 5) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:150:    const floored = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s3', 6) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:161:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:167:    const wrapped = db.prepare('SELECT event_counter, mention_count FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 7) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:175:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:181:    const decayed = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s4', 8) as {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:193:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:207:      INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory-event-decay.vitest.ts:214:    const row = db.prepare('SELECT attention_score FROM working_memory WHERE session_id = ? AND memory_id = ?').get('s-disabled', 13) as {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:40:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:41:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:42:      { id: 3, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:55:      { tenant_id: 'a', user_id: 'u1', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:56:      { tenant_id: 'b', user_id: 'u2', agent_id: null, session_id: null, shared_space_id: null },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:66:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:67:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:82:        session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:88:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:103:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:110:  it('persists session_id as a queryable governance post-insert column', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:125:      session_id: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:127:    expect(ALLOWED_POST_INSERT_COLUMNS.has('session_id')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:137:        session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:143:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:152:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:170:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:176:    expect(review.summary.byAction).toEqual({ memory_save: 2 });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:181:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:189:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:202:        session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:207:      action: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:232:      { id: 1, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:233:      { id: 2, tenant_id: 'tenant-a', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-2' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:234:      { id: 3, tenant_id: 'tenant-a', user_id: 'user-2', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts:235:      { id: 4, tenant_id: 'tenant-b', user_id: 'user-1', session_id: 'session-1', shared_space_id: 'space-1' },
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:531:    it('EXT-S14: restore preserves extended memory_index columns when schema supports them', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts:532:      // Add modern schema columns to this fixture DB if missing.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:5:// Provides the code_graph_context MCP tool implementation.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:125:    textBrief: 'No anchors resolved. Try `code_graph_scan` first, or provide a `subject` or `seeds[]`.',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:127:    nextActions: ['Run `code_graph_scan` to index the workspace', 'Provide `subject` parameter with a symbol name'],
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:153:    actions.push('Run `code_graph_scan` to improve resolution (file anchors found)');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:859:   8. EXPORTS (re-export constants for testing)
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:39:        'handle_memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:183:          'session_id: "atomic-save-fi"',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:680:        actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:687:          actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:522:describe('T009 PerFolderDescription schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts:778:  it('returns null for schema violation (memorySequence as string)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:27: * Create a minimal in-memory DB with the memory_index schema
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:50:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:93:      session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:39:      session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:113:          session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:39:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:54:export const ALLOWED_POST_INSERT_COLUMNS = new Set<string>([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/post-insert-metadata.ts:60:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:116:    codeGraphLine = 'empty -- run `code_graph_scan`';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:157:      lines.push('Freshness: stale — first structural read may trigger bounded inline refresh or recommend code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:234:        sourceSurface: 'session_start',
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:8:// Feature catalog: Dry-run preflight for memory_save
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:221:export const PreflightErrorCodes: Readonly<PreflightErrorCodes> = {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:237:export const PREFLIGHT_CONFIG: PreflightConfig = {
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:52:      FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:53:      WHERE spec_folder = ? AND task_id = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:58:      FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:59:      WHERE spec_folder = ? AND task_id = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:142:      FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/tests/session-learning-regressions.vitest.ts:143:      WHERE spec_folder = ? AND task_id = ? AND session_id = ? AND phase = 'complete'
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:14:} from '../lib/telemetry/trace-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:220:  // 7. Telemetry trace schema validation
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:221:  it('telemetry schema exports expected canonical retrieval stages', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:457:    expect(row.session_count).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:26:} from '../lib/storage/learned-triggers-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:101:  // Create the FTS5 table matching the real schema (NO learned_triggers!)
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:34:  // Minimal memory_index schema
.opencode/skill/system-spec-kit/mcp_server/tests/n3lite-consolidation.vitest.ts:49:  // Causal_edges schema
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:73:    ? 'Use code_graph_query for structural lookups and keep transport shells thin.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:17:    schemaVersion: 3,
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:62:    expect(contract.recommendedAction).toContain('code_graph_query');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:64:    expect(contract.provenance?.producer).toBe('session_snapshot');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:123:    const contract = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:126:    expect(contract.sourceSurface).toBe('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:407:  it('clears adaptive shadow state during rollback drills without reversing schema', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:516:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:51:export const SCHEMA_VERSION = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:53:/** SQL schema for code graph tables */
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:95:  CREATE TABLE IF NOT EXISTS schema_version (
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:99:  CREATE TABLE IF NOT EXISTS code_graph_metadata (
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:136:    CREATE TABLE IF NOT EXISTS code_graph_metadata (
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:157:    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:159:      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:161:      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:191:  const row = d.prepare('SELECT value FROM code_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:199:    INSERT INTO code_graph_metadata (key, value, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:623:  schemaVersion: number;
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:655:    lastScanTimestamp, lastGitHead, dbFileSize, schemaVersion: SCHEMA_VERSION,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-backfill.vitest.ts:7:import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:164:    expect(api.LAYER_DEFINITIONS.L5.tools).toContain('shared_memory_status');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:165:    expect(api.TOOL_LAYER_MAP.shared_memory_status).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:166:    expect(api.getLayerForTool('shared_memory_status')).toBe('L5');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:167:    expect(api.getLayerTokenBudget('shared_memory_status')).toBe(1000);
.opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts:38:    // Create causal_edges table matching production schema (+created_by, +last_accessed)
.opencode/skill/system-spec-kit/mcp_server/tests/edge-density.vitest.ts:414:      // But unique: A→B, B→A → if schema allows, 2 edges, 2 nodes → 1.0
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:15:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:21:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:78:        session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:84:        UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:120:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:125:        INSERT INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:148:      expect(entry.session_id).toBe('session-alpha');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:176:      expect(entry1.session_id).toBe('session-alpha');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:186:        INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:195:        "SELECT * FROM working_memory WHERE session_id = 'session-beta'"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:80:    'session_learning',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:85:    'session_state',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:86:    'session_sent_memories',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:102:    'schema_version',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:122:  'session_learning',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:127:  'session_state',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:128:  'session_sent_memories',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:315:  'working_memory', 'session_state', 'session_sent_memories', 'session_learning',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:443:    || columns.has('session_id')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1109:        session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1121:        UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1147:    // Best-effort schema preparation only.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1332:    'session_id',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1654:    // Reject the entire restore on schema violations to prevent
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1696:    // Ensure working_memory table schema is ready BEFORE the transaction.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:56:    toolPattern: /^(bash|memory_save|memory_update)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-edges.vitest.ts:27:    // Create causal_edges table matching production schema
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:142:            session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:148:            UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:186:            session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:192:            UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:203:          INSERT INTO working_memory (session_id, memory_id, attention_score)
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:213:          WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:331:    session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:389:        session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:397:      WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:409:        'idx_wm_session_focus_lru',
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:410:        'idx_wm_session_attention_focus',
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:460:        if (sql.includes('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ? AND memory_id = ?')) {
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:491:        WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:533:        WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:5:// operations. Validates tool input/output schemas, error handling,
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:15: * implemented in Phase 3; these tests verify schema expectations
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:19:// --- Tool schema validation ---
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:46:  describe('graph_upsert tool schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:87:  describe('graph_query tool schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-tools.vitest.ts:121:  describe('graph_signals output schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:20:    it('CREATE TABLE schema includes learned_triggers column', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:25:      const schemaFilePath = path.resolve(
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:27:        '../lib/search/vector-index-schema.ts'
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:29:      const source = fs.readFileSync(schemaFilePath, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:35:    it('CREATE TABLE schema includes interference_score column', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:36:      // P1-10 found interference_score only in migration, not base schema.
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:40:      const schemaFilePath = path.resolve(
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:42:        '../lib/search/vector-index-schema.ts'
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:44:      const source = fs.readFileSync(schemaFilePath, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:51:      // (e.g., when running against a fresh schema that already has it).
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:54:      const schemaFilePath = path.resolve(
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:56:        '../lib/search/vector-index-schema.ts'
.opencode/skill/system-spec-kit/mcp_server/tests/regression-suite.vitest.ts:58:      const source = fs.readFileSync(schemaFilePath, 'utf8');
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:6:// pairs against a configurable schema. Prevents out-of-vocabulary
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:35: * Default ontology schema — matches the causal_edges CHECK constraint
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:50: * Load ontology schema from environment or default.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:52: * Returns null if no schema configured and no default is appropriate.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:53: * Returns the default schema when no env override is set.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:55:export function loadOntologySchema(schemaPath?: string): OntologySchema | null {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:61:    if (schemaPath && schemaPath.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:62:      const resolvedPath = path.resolve(schemaPath);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:87:    console.warn('[ontology-hooks] Invalid ontology schema — falling back to default');
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:117: * Validate that an entity/relation pair is allowed by the schema.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:119: * Returns true if both the entity type and relation type are in the schema.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:124:  schema: OntologySchema,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:133:  const entityAllowed = schema.entityTypes.some(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:136:  const relationAllowed = schema.relationTypes.some(
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:144:  if (!Array.isArray(schema.extractionRules) || schema.extractionRules.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:148:  return schema.extractionRules.some((rule) =>
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:12:import { ensureLineageTables } from '../search/vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:37:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:212:    ['session', normalizeScopeValue(row.session_id)],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:538:    recordHistory(memoryId, 'ADD', null, parsed.title ?? filePath, params.actor ?? 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:816:      actor: params.actor ?? 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:49:        'ensure_schema',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:149:        CREATE TABLE IF NOT EXISTS session_learning (
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:154:          session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:175:        "INSERT INTO session_learning (spec_folder, task_id, phase, pre_knowledge_score, pre_uncertainty_score, pre_context_score) VALUES (?, ?, 'complete', 50, 30, 40)"
.opencode/skill/system-spec-kit/mcp_server/tests/handler-session-learning.vitest.ts:195:          FROM session_learning
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:51:export const ENTITY_DENYLIST: Set<string> = new Set<string>([
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2453:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:13:      CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:17:      INSERT INTO schema_version (id, version) VALUES (1, 21);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:22:        session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:28:      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:32:      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:36:      INSERT INTO memory_index (id, spec_folder, session_id, context_type)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:74:    expect(snapshot.metrics['isolation.missing_session_scope_rows']).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:76:    expect(snapshot.metrics['schema.version']).toBe(21);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-state-baseline.vitest.ts:103:    expect(snapshot.metrics['schema.version']).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:20:        memory_save: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:35:        memory_index_scan: 1000,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:922:    session_id: existingRow.session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:62:  it('T030/T031: rule schema is valid and first match wins', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:88:      SELECT session_id, memory_id, attention_score, source_tool, source_call_id, extraction_rule_id, redaction_applied
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:135:    expect(matchRule('memory_save', 'git commit -m "x"')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:40:    session_id: 'sess-001',
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:70:    expect(names).toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:82:    expect(entry.session_id).toBe('sess-001');
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:180:      session_id: 'sess-merge-1',
.opencode/skill/system-spec-kit/mcp_server/tests/mutation-ledger.vitest.ts:190:    expect(entry.session_id).toBe('sess-merge-1');
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:14:    schemaVersion: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:60:    it('increments codeGraphQueries on code_graph_query event', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-metrics.vitest.ts:62:      recordMetricEvent({ kind: 'code_graph_query' });
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:20:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:46:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:51:      expect(envelope.meta.tool).toBe('memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:58:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:97:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:108:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:135:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:143:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:152:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:176:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:186:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:196:        tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:206:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:254:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:312:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:352:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:363:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:373:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:384:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/envelope.vitest.ts:409:        tool: 'memory_search'
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:41:export const PROMOTE_TO_IMPORTANT_THRESHOLD = 5;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:44:export const PROMOTE_TO_CRITICAL_THRESHOLD = 10;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:47:export const PROMOTION_PATHS: Readonly<Record<string, { target: string; threshold: number }>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:53:export const PROMOTION_WINDOW_HOURS = 8;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:56:export const MAX_PROMOTIONS_PER_WINDOW = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:59:export const PROMOTION_WINDOW_MS = PROMOTION_WINDOW_HOURS * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts:62:export const NON_PROMOTABLE_TIERS: ReadonlySet<string> = new Set([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:11:// H5 — additionalProperties: false on all schemas
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:12:// M5 — ingest schema minItems/minLength constraints
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:17:} from '../schemas/tool-input-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:19:import { TOOL_DEFINITIONS } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:101:describe('H5: all tool schemas have additionalProperties: false', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:105:      const schema = tool.inputSchema as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:106:      if (schema.additionalProperties !== false) {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:114:    // Ensures no schema was accidentally dropped during bulk edit
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:119:describe('M5: ingest schema has minItems and minLength constraints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:120:  it('memory_ingest_start schema has path constraints', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:126:    const schema = ingestTool!.inputSchema as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:127:    const properties = schema.properties as Record<string, Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:16:const TOOL_SCHEMAS_FILE = path.join(SERVER_DIR, 'tool-schemas.ts')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:22:let toolSchemasCode = ''
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:68:    toolSchemasCode = fs.readFileSync(TOOL_SCHEMAS_FILE, 'utf8')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:163:      'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:177:      'shared_memory_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:178:      'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:187:      'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:192:      'code_graph_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:193:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:194:      'code_graph_status',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:195:      'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:199:      'session_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:210:      expect(toolSchemasCode).toMatch(/export\s+const\s+TOOL_DEFINITIONS/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:218:      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:228:        const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:238:      const sectionToolNames = (toolSchemasCode.match(/name:\s*'(\w+)'/g) || []).map((m: string) => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:250:        expect(toolDefRegex.test(toolSchemasCode)).toBe(true)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:257:        const schemaRegex = new RegExp(`name:\\s*'${tool}'[\\s\\S]*?inputSchema:\\s*\\{`)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:258:        expect(schemaRegex.test(toolSchemasCode)).toBe(true)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:295:      'memory_validate', 'memory_save', 'memory_index_scan', 'memory_health',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:300:      'shared_space_upsert', 'shared_space_membership_set', 'shared_memory_status', 'shared_memory_enable',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:301:      'code_graph_scan', 'code_graph_query', 'code_graph_status', 'code_graph_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:320:    it('T16d: only session_health is excluded from tool-call tracking', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:321:      expect(sourceCode).toMatch(/if \(name !== 'session_health'\) \{/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:381:      '../tool-schemas',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:411:      '../lib/storage/learned-triggers-schema',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:578:          setRequestHandler(schema: unknown, handler: (request: unknown, extra: unknown) => Promise<unknown>): void {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:579:            handlers.set(schema, handler)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:617:      vi.doMock('../tool-schemas', () => ({ TOOL_DEFINITIONS: options?.toolDefinitions ?? [] }))
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:699:      vi.doMock('../lib/storage/learned-triggers-schema', () => ({
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
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1376:      expect(instructions).toContain('Warning: 12 stale memories detected. Consider running memory_index_scan.')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1461:      { name: 'ToolDefinition', requiredFields: ['name', 'description', 'inputSchema'], source: 'toolSchemas' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1494:          toolSchemas: toolSchemasCode,
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1563:      const response = errorsModule!.buildErrorResponse!('memory_search', testError, { query: 'test' })
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1581:      const hint = errorsModule!.getRecoveryHint!('memory_search', 'UNKNOWN_TOOL')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1614:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1619:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1622:    it('T28b: L2 budget = 3500 (memory_search)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1627:      expect(layerDefs!.getTokenBudget!('memory_search')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1670:    it('T28h: L7 budget = 1000 (memory_index_scan)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1675:      expect(layerDefs!.getTokenBudget!('memory_index_scan')).toBe(1000)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1812:      // Context-server validates only length pre-dispatch; schema checks occur in tool dispatch modules.
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2087:      'memory_save': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2106:      'memory_index_scan': '[L7:Maintenance]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2117:        const match = toolSchemasCode.match(descRegex)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2126:      const budgetMatches = toolSchemasCode.match(budgetPattern)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2133:      expect(toolSchemasCode).toMatch(/tokenUsage:[\s\S]*?minimum:\s*0\.0/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2134:      expect(toolSchemasCode).toMatch(/tokenUsage:[\s\S]*?maximum:\s*1\.0/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2142:    it('T103: checkpoint_delete requires confirmName in schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2143:      expect(toolSchemasCode).toMatch(/checkpoint_delete[\s\S]*?required.*confirmName/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2239:      { module: './tool-schemas.js', name: 'Tool schemas (T303)' },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2308:        ? ` Warning: ${stats.staleCount} stale memories detected. Consider running memory_index_scan.`
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2343:      expect(result).toContain('memory_save')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2365:      expect(atBoundary).not.toContain('Consider running memory_index_scan')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2375:      expect(aboveBoundary).toContain('Consider running memory_index_scan')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2448:      // Warning text must suggest memory_index_scan
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2449:      expect(fnBody).toMatch(/memory_index_scan/)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:24:      INSERT OR REPLACE INTO working_memory (session_id, memory_id, attention_score, added_at, last_focused, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:31:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:77:    // Init session manager (creates session_sent_memories, session_state, sets up intervals)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:115:      // Save session state first (completeSession updates session_state)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:127:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:128:      getTestDb().prepare('DELETE FROM session_state WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:145:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:159:        'SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:164:      getTestDb().prepare('DELETE FROM working_memory WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:165:      getTestDb().prepare('DELETE FROM session_sent_memories WHERE session_id = ?').run(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:189:  describe('T002: Working memory schema migration compatibility', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:205:          session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:211:          UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:215:        INSERT INTO working_memory (session_id, memory_id, attention_score, focus_count)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:229:        WHERE session_id = 'legacy-session' AND memory_id = 1
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:116:            'code_graph_query outline payload rejects collapsed scalar fields: trust.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:189:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:40:export const LEARNED_TRIGGERS_COLUMN = 'learned_triggers';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:43:export const LEARNED_TRIGGERS_DEFAULT = '[]';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:76:    console.warn('[learned-triggers-schema] Migration complete: learned_triggers column added');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:84:    console.error(`[learned-triggers-schema] Migration failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:137:    console.error(`[learned-triggers-schema] FTS5 isolation check failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:164:    console.warn('[learned-triggers-schema] Rollback complete: learned_triggers column removed');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/learned-triggers-schema.ts:168:    console.error(`[learned-triggers-schema] Rollback failed: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:31:} from '../storage/learned-triggers-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:72:export const FEATURE_FLAG = 'SPECKIT_LEARN_FROM_SELECTION';
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:75:export const LEARNED_TRIGGER_WEIGHT = 0.7;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:78:export const MAX_TERMS_PER_SELECTION = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:81:export const MAX_TERMS_PER_MEMORY = 8;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:84:export const LEARNED_TERM_TTL_MS = 30 * 24 * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:87:export const LEARNED_TERM_TTL_SECONDS = 30 * 24 * 60 * 60;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:90:export const MIN_MEMORY_AGE_MS = 72 * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:93:export const TOP_N_EXCLUSION = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:96:export const MIN_TERM_LENGTH = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:118:export const CONFIG: TriggerMatcherConfig = {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:500:export const CORRECTION_KEYWORDS: string[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:511:export const PREFERENCE_KEYWORDS: string[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:522:export const REINFORCEMENT_KEYWORDS: string[] = [
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
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:472:    expect('memory_save' in TOOL_SPECIFIC_HINTS).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:476:    const searchHints = TOOL_SPECIFIC_HINTS['memory_search'];
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:492:  it('L1: Returns tool-specific hint for memory_search + E001', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:493:    const hint = getRecoveryHint('memory_search', 'E001');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:512:    const hint = getRecoveryHint('memory_search', 'E040');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:524:  it('M1: Returns true for known tool+code (memory_search, E001)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:525:    expect(hasSpecificHint('memory_search', 'E001')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:543:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/errors-comprehensive.vitest.ts:550:    const hints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:3:import { TOOL_DEFINITIONS } from '../tool-schemas';
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:119:        memory_save: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:137:        memory_index_scan: 'L7',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:161:    it('shared_memory_status appears in exactly one layer and is mapped to that layer', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:162:      const matchingLayers = Object.values(LD).filter((layer) => layer.tools.includes('shared_memory_status'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:166:      expect(mod.TOOL_LAYER_MAP['shared_memory_status']).toBe(matchingLayers[0].id);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:194:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:195:        { tool: 'memory_search', expected: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:200:        { tool: 'memory_index_scan', expected: '[L7:Maintenance]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:221:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:227:        { tool: 'memory_search', desc: 'Search memories', prefix: '[L2:Core]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:242:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:253:        { tool: 'memory_search', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:258:        { tool: 'memory_index_scan', expected: 1000 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:280:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:291:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:292:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:301:      const info = expectLayerInfo(mod.getLayerInfo('memory_search'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:432:                           'memory_index_scan'];
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:27:  session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:38:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:44:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:74:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:100:    session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:108:  CREATE INDEX IF NOT EXISTS idx_ledger_session ON mutation_ledger(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:150:    INSERT INTO mutation_ledger (mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:162:    entry.session_id ?? null
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:187:  if (opts.session_id) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:188:    conditions.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:189:    params.push(opts.session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:395:        session_id: input.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:431:      session_id: input.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts:8:// Pure scoring addition — NO schema changes, NO new tables.
.opencode/skill/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:71:      lastScanTimestamp: null, dbFileSize: null, schemaVersion: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:8:import { createSchema, ensureSchemaVersion } from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:35:  'session_learning',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:40:  'session_state',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:41:  'session_sent_memories',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:57:  'schema_version',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:89:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:101:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:114:      session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:144:    CREATE TABLE IF NOT EXISTS session_learning (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:146:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:152:    CREATE TABLE IF NOT EXISTS session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:153:      session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:165:    CREATE TABLE IF NOT EXISTS session_sent_memories (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:166:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:170:      PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:215:      session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:263:      session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:301:      id, session_id, memory_id, attention_score, added_at, last_focused, focus_count,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:323:      id, timestamp, mutation_type, reason, prior_hash, new_hash, linked_memory_ids, decision_meta, actor, session_id
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:357:    INSERT INTO session_learning (id, session_id, memory_id, insight, created_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:363:      id, action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id, shared_space_id, reason, metadata, created_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:384:    INSERT INTO session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:385:      session_id, status, spec_folder, current_task, last_action, context_summary, pending_work, state_data, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:390:    INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:10:  schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:41:      schemaVersion: '',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:44:    })).toThrow('schemaVersion');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:52:        schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:88:        schemaVersion: 1,
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:117:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:218:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:102:export const MEMORY_FILE_PATTERN: RegExp = /specs\/([^/]+)(?:\/[^/]+)*\/memory\/[^/]+\.(?:md|txt)$/i;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:107:export const MAX_CONTENT_LENGTH: number = Number.isFinite(_parsedMaxLen) && _parsedMaxLen > 0 ? _parsedMaxLen : 250000;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:112:export const CONTEXT_TYPE_MAP: Record<string, ContextType> = {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts:226:session_id: "pipeline-enforcement-fixture"
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:175:        recommendedAction: 'Use code_graph_query for structural lookups.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:446:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:147:  it('returns null for memory_save', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:148:    const result = await autoSurfaceAtToolDispatch('memory_save', { filePath: '/some/path.md' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:152:  it('returns null for memory_index_scan', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:153:    const result = await autoSurfaceAtToolDispatch('memory_index_scan', { specFolder: 'specs/001' });
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 780,           // actual: 755 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools + Phase 024 session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:101:    'tool-schemas.js',
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:151:    { label: 'tool schemas', pattern: /import\s*\{[\s\S]*?\}\s*from\s*['"]\.\/tool-schemas\.js['"]/ },
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:8:  schemaVersion: 'measurement-contract/v1',
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:27:  it('excludes rows missing schema version', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:30:      schemaVersion: '   ',
.opencode/skill/system-spec-kit/mcp_server/tests/publication-gate.vitest.ts:33:      exclusionReason: 'missing_schema_version',
.opencode/skill/system-spec-kit/mcp_server/tests/temporal-contiguity.vitest.ts:29:    // Create memory_index table matching the expected schema
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:4:// SCHEMA_VERSION is now canonical in vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:6:export const MAX_TRIGGERS_PER_MEMORY = 10;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts:12:export const VectorIndexErrorCode = {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:156:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:173:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:185:      UNIQUE(session_id, memory_id)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:200:    CREATE TABLE IF NOT EXISTS session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:201:      session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:216:    CREATE TABLE IF NOT EXISTS session_sent_memories (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:217:      session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:221:      PRIMARY KEY (session_id, memory_hash)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:270:      session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:277:    INSERT INTO session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:278:      session_id, status, spec_folder, current_task, tenant_id, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:291:  database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task-a', 'session-a');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:292:  database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task-b', 'session-b');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:623:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:627:        INSERT INTO session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:628:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:632:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:647:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:651:      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task', 'session-test');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:652:      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('other-live-task', 'session-other');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:653:      database.prepare('DELETE FROM session_sent_memories WHERE memory_id = ?').run(1);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:655:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:658:      database.prepare('UPDATE session_sent_memories SET sent_at = ? WHERE memory_id = ?').run('other-live-sent', 2);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:671:        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(1)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:672:      ).toEqual({ session_id: 'session-test', attention_score: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:674:        database.prepare('SELECT session_id, attention_score FROM working_memory WHERE memory_id = ?').get(2)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:675:      ).toEqual({ session_id: 'session-other', attention_score: 8 });
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:677:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-test')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:680:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-other')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:683:        database.prepare('SELECT memory_hash FROM session_sent_memories WHERE memory_id = ?').get(1)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:686:        database.prepare('SELECT memory_hash, sent_at FROM session_sent_memories WHERE memory_id = ?').get(2)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:705:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:709:        INSERT INTO session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:710:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:714:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:723:      database.prepare('UPDATE session_state SET current_task = ? WHERE session_id = ?').run('live-task', 'session-test');
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:724:      database.prepare('DELETE FROM session_sent_memories WHERE memory_id = ?').run(1);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:726:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:735:          session_id, memory_id, attention_score, added_at, last_focused, focus_count
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:739:        INSERT INTO session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:740:          session_id, status, spec_folder, current_task, created_at, updated_at
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:744:        INSERT INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:762:        (database.prepare('SELECT COUNT(*) as cnt FROM working_memory WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:765:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-test')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:768:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-extra')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:771:        database.prepare('SELECT memory_hash FROM session_sent_memories WHERE memory_id = ?').get(1)
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:774:        (database.prepare('SELECT COUNT(*) as cnt FROM session_sent_memories WHERE session_id = ?').get('session-extra') as { cnt: number }).cnt
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:888:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-a')
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-storage.vitest.ts:891:        database.prepare('SELECT current_task FROM session_state WHERE session_id = ?').get('session-b')
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:519:    const signals = detectSignals('Show me the database schema');
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:3:import { SCHEMA_VERSION, validateBackwardCompatibility } from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:5:describe('Vector index schema compatibility validator', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:11:      expect(report.missingTables).toEqual(['memory_index', 'schema_version']);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:18:  it('accepts a minimally compatible schema footprint', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:22:        CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:27:        INSERT INTO schema_version (id, version, updated_at) VALUES (1, ${SCHEMA_VERSION}, datetime('now'));
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:35:          session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:66:            session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-compatibility.vitest.ts:109:      expect(report.schemaVersion).toBe(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:33:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:50:       session_id, timestamp, latency_ms, spec_folder_filter, metadata)
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:59:    event.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:103:    expect(columnNames).toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:121:  it('T001-D: creates indexes on event_type, session_id, timestamp', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:129:    expect(indexNames).toContain('idx_consumption_log_session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:157:      session_id: 'session-abc',
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:169:    expect(row.session_id).toBe('session-abc');
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:182:      session_id: 'session-xyz',
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:200:      session_id: 'session-triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:217:      session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:225:    expect(row.session_id).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:318:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-A', result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:319:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-A', result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:320:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-B', result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:423:      forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'heavy-session-001', query_text: `q${i}`, result_count: 1 });
.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:425:    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'light-session', query_text: 'only one', result_count: 3 });
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:123:      claude_session_id: 'analytics-session',
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:124:      speckit_session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:52:        (2, 'Database Schema', 'schema db', 'Database migration and schema design', '/specs/db.md', 'db-spec', 0),
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:4:import { createSchema, ensureSchemaVersion, validateLineageSchemaSupport } from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:54:      session_id,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:99:    recordHistory(1, 'ADD', null, 'Version 1', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:103:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:113:    recordHistory(2, 'ADD', null, 'Version 2', 'mcp:memory_save');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:118:      actor: 'mcp:memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-lineage-state.vitest.ts:156:  it('validates lineage schema support for phase 2 tables', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:78:export const DENYLIST: Set<string> = new Set<string>([
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:55:  session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:126:    session_id TEXT
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:136:  CREATE INDEX IF NOT EXISTS idx_feedback_session    ON feedback_events(session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:143:/** Track which DB handles have had the schema initialized. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:183:      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:258:      conditions.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:342:   8. EXPORTS (schema constants for testing)
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:108:  it('adds schema-aligned synthetic text parts and avoids duplicates', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:199:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:205:    expect(status).toContain('messages_transform_mode=schema_aligned');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:227:    const status = await hooks.tool?.spec_kit_compact_code_graph_status.execute({});
.opencode/skill/system-spec-kit/mcp_server/tests/corrections.vitest.ts:420:  describe('T142: memory_corrections table schema (v9 migration)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:40:const VECTOR_INDEX_SCHEMA_SOURCE = fs.readFileSync(path.join(SERVER_ROOT, 'lib', 'search', 'vector-index-schema.ts'), 'utf-8');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:261:    it('T641: review_count column exists in schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:10:} from '../lib/search/vector-index-schema';
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:22:describe('vector-index schema migration refinements', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:32:  it('keeps schema_version unchanged when a required migration index build fails', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:37:    database.prepare('UPDATE schema_version SET version = 14 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:49:    const versionRow = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number };
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:67:      CREATE TABLE IF NOT EXISTS session_state (
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:68:        session_id TEXT PRIMARY KEY,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:100:    database.prepare('INSERT INTO session_state (session_id, spec_folder) VALUES (?, ?)').run('session-1', staleSpecFolder);
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:102:    database.prepare('UPDATE schema_version SET version = 22 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:107:    const sessionRow = database.prepare('SELECT spec_folder FROM session_state WHERE session_id = ?').get('session-1') as { spec_folder: string };
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:126:    database.prepare('UPDATE schema_version SET version = 23 WHERE id = 1').run();
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:139:  it('fails fast on legacy memory_index schemas that cannot store constitutional tier values', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:150:        session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:159:  it('preserves legacy memory_conflicts audit rows when upgrading to the unified v12 schema', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:98:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:59:    it('T531-3: session_id parameter accepted by triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:64:            session_id: 'dedup-session-003',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-session-dedup.vitest.ts:71:        expect(getErrorMessage(error)).not.toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/schema-migration.vitest.ts:11:    it('T701: Database initialized with full schema', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:389:    it('schema created with memory_index table', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:398:    it('schema version is >= 12', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:400:      const versionRow = db!.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:52:  // Also ensure session_state table exists for state management tests
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:65:  try { testDb.exec('DELETE FROM session_sent_memories'); } catch (_: unknown) {}
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:66:  try { testDb.exec('DELETE FROM session_state'); } catch (_: unknown) {}
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:82:    `INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at) VALUES (?, ?, ?, ?)`
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:199:        const remaining = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories').get() as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:228:        const remaining = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get('other-session') as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:373:    it('creates session_state table', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:376:          "SELECT name FROM sqlite_master WHERE type='table' AND name='session_state'"
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:407:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('save-1') as SessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:425:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('save-2') as SessionStateRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:445:        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('complete-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:469:        const row1 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:471:        const row2 = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('reset-2') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:514:        const row = testDb!.prepare('SELECT status FROM session_state WHERE session_id = ?').get('recover-1') as Pick<SessionStateRow, 'status'>;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:702:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('cp-1') as SessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:725:        const row = testDb!.prepare('SELECT * FROM session_state WHERE session_id = ?').get('cp-2') as SessionStateRow | undefined;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:754:          const count = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get(sid) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:771:          const count = testDb!.prepare('SELECT COUNT(*) as c FROM session_sent_memories WHERE session_id = ?').get(sid) as CountRow;
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:797:          'SELECT memory_hash FROM session_sent_memories WHERE session_id = ? ORDER BY sent_at ASC'
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:71:export const EVIDENCE_GAP_DETECTOR_PROVENANCE = {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:57:  memory_save: ERROR_CODES.MEMORY_SAVE_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:75:export const ErrorCodes = {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization-roundtrip.vitest.ts:38:        session_id: null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-summaries.vitest.ts:59: * Creates an in-memory SQLite database with the required schema.
.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:65:      // Should not throw an input validation error about session_id/turnNumber.
.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:70:          session_id: 'sess-test-001',
.opencode/skill/system-spec-kit/mcp_server/tests/integration-trigger-pipeline.vitest.ts:76:        expect(message).not.toMatch(/session_id/);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:13:      CREATE TABLE schema_version (
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:17:      INSERT INTO schema_version (id, version) VALUES (1, 21);
.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:64:    expect(result.schemaVersion).toBe(21);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:45:export const ERROR_CODES = {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:142:export const RECOVERY_HINTS: RecoveryHintMap = {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:157:      'Run memory_index_scan with force=true to rebuild index',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:162:    toolTip: 'memory_index_scan({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:264:    hint: 'Database schema migration failed.',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:268:      'Contact support with schema version info from memory_health()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:278:      'If no checkpoint available, rebuild index: memory_index_scan({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:298:      'Check parameter type matches expected schema',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:307:      'Check the tool schema for required parameters',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:509:      'Use memory_save({ dryRun: true }) to validate first',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:513:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:528:      'Check parameter types match schema',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:542:    toolTip: 'memory_save({ force: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:549:      'Run memory_save({ dryRun: true }) for detailed validation report',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:554:    toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:674:export const DEFAULT_HINT: RecoveryHint = {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:692:export const TOOL_SPECIFIC_HINTS: ToolSpecificHintMap = {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:709:        'Run memory_index_scan() to rebuild if needed',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:713:      toolTip: 'memory_index_scan()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:742:  memory_save: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:747:        'Create the memory file before calling memory_save',
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:770:      toolTip: 'memory_save({ dryRun: true })'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:775:  memory_index_scan: {
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:104:    expect(events.every((event) => event.session_id === 'sess-e')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:14:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:22:/** Create in-memory DB with memory_index schema for archival-manager */
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:51:/** Create in-memory DB with working_memory + memory_index schema */
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:389:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('old-session', 1, 0.5, '${oldTime}')`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:390:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused) VALUES ('fresh-session', 2, 0.8, '${new Date().toISOString()}')`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:395:    const remaining = db.prepare('SELECT session_id, memory_id FROM working_memory').all() as WorkingMemoryRow[];
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:397:    expect(remaining[0].session_id).toBe('fresh-session');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:418:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', 1, 0.9)`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:437:      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, ${score})`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:457:        INSERT INTO working_memory (session_id, memory_id, attention_score, last_focused)
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:464:    const remaining = db.prepare('SELECT memory_id FROM working_memory WHERE session_id = ? ORDER BY memory_id').all('s1') as Array<Pick<WorkingMemoryRow, 'memory_id'>>;
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:487:      db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s1', ${i}, 0.5)`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:489:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 1}, 0.5)`);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:490:    db.exec(`INSERT INTO working_memory (session_id, memory_id, attention_score) VALUES ('s2', ${maxCap + 2}, 0.5)`);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:91:    expect(getDefaultErrorCodeForTool('memory_save')).toBe('E081');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:29:export const DEFAULT_HOLDOUT_PERCENT = 0.20;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:32:export const PROMOTION_THRESHOLD_WEEKS = 2;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:35:export const EVALUATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:186:/** Track which DB handles have had the shadow-scoring schema initialized. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:707:   12. EXPORTS (schema constants for testing)
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:27:export const GRAPH_WEIGHT_CAP = parseFloat(process.env.SPECKIT_GRAPH_WEIGHT_CAP || '') || 0.15;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:30:export const COMMUNITY_SCORE_CAP = 0.03;
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:147:export const DEFAULT_PROFILE: CalibrationProfile = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:156:export const AGGRESSIVE_PROFILE: CalibrationProfile = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-calibration.ts:171:export const isGraphCalibrationEnabled = isGraphCalibrationProfileEnabled;
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:90:    expect(names).toContain('session_id');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:227:    expect(row.session_id).toBe('session-XYZ');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:230:  it('allows null session_id', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:234:    expect(events[0].session_id).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:334:    expect(forSess1[0].session_id).toBe('sess-1');
.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:457:    // Verify the schema does not touch ranking columns
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:49:    tool: 'memory_save',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:162:    tool: 'memory_index_scan',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:178:  { tool: 'memory_save', handler: 'handleMemorySave' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:129:    session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:205: * Reset the schema-ensured flag (for testing only).
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:238:         total_results_shown, session_id, notes)
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:281:             selected_rank, total_results_shown, session_id, notes,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:295:      session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:309:        sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:34:export const MIN_SUPPORT_SESSIONS = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:41:export const MAX_BOOST_DELTA = 0.10;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:44:export const BATCH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:47:export const CONFIDENCE_WEIGHTS: Record<FeedbackConfidence, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:82:  session_count: number;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:141:    session_count   INTEGER NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:155:/** Track which DB handles have had the batch-learning schema initialized. */
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:212:      // Count distinct sessions (null session_id treated as each own distinct pseudo-session)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:213:      const sessionKey = ev.session_id ?? `__null_${ev.id}`;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:366:        (memory_id, batch_run_at, session_count, weighted_score, computed_boost, shadow_rank_delta, promoted)
.opencode/skill/system-spec-kit/mcp_server/tests/eval-db.vitest.ts:145:     Table column schemas
.opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts:27:  ensure_schema,
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:502:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:48:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:60:    UNIQUE(session_id, memory_id),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:66:  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:67:  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:69:  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:70:  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:77:  session_id: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:128:let schemaEnsured = false;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:135:  schemaEnsured = false;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:140:  if (!db || schemaEnsured) return;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:168:    schemaEnsured = true;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:193:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:208:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:242:      'DELETE FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:262:    ) as Database.Statement).all(nowIso, timeoutSeconds) as Array<{ session_id: string }>;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:267:      sessionModeRegistry.delete(row.session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:286:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:306:      WHERE wm.session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:341:      WHERE wm.session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:395:      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:406:        WHERE session_id = ? AND memory_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:413:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:451:        session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:461:      ON CONFLICT(session_id, memory_id) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:488:      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:524:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:534:        WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:573:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:644:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:691:      WHERE session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:57:export const MEMORY_TYPES = {
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:118:export const HALF_LIVES_DAYS: Readonly<Record<string, number | null>> = Object.fromEntries(
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:141:export const PATH_TYPE_PATTERNS: readonly PathTypePattern[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:201:export const KEYWORD_TYPE_MAP: Readonly<Record<string, MemoryTypeName>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts:390:export const SPEC_DOCUMENT_CONFIGS: readonly SpecDocumentConfig[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:160:export const CORRECTION_TYPES: CorrectionTypes = Object.freeze({
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:177:export const CORRECTION_STABILITY_PENALTY: number = 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:181:export const REPLACEMENT_STABILITY_BOOST: number = 1.2;
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:227:  return ensure_schema();
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:293: * Provides the ensure_schema helper.
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:295:export function ensure_schema(): SchemaResult {
.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:962:  ensure_schema as ensureSchema,
.opencode/skill/system-spec-kit/mcp_server/tests/protect-learning.vitest.ts:50:    expect(preflightCode).toContain('FROM session_learning');
.opencode/skill/system-spec-kit/mcp_server/tests/protect-learning.vitest.ts:70:    expect(preflightCode).toMatch(/INSERT\s+INTO\s+session_learning/);
.opencode/skill/system-spec-kit/mcp_server/tests/protect-learning.vitest.ts:71:    expect(preflightCode).not.toMatch(/INSERT\s+OR\s+REPLACE\s+INTO\s+session_learning/);
.opencode/skill/system-spec-kit/mcp_server/tests/protect-learning.vitest.ts:80:    expect(preflightCode).toContain('UPDATE session_learning');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:705:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:649:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:16:  | 'missing_schema_version'
.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:27:  schemaVersion?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:66:  if (!isNonEmptyString(row.schemaVersion)) {
.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:69:      exclusionReason: 'missing_schema_version',
.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts:82:    schemaVersion: row.schemaVersion.trim(),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:548: * `memory_index_scan` picks up the gap and re-embeds the memory. This avoids blocking
.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:148:export const DEFAULT_HINTS: DefaultHints = {
.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:5:export const SPEC_DOCUMENT_FILENAMES = new Set([
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:389:  // T11: Trace payload schema + serialization redaction
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:634:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:22:export const SHARED_PAYLOAD_CERTAINTY_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:31:export const DETECTOR_PROVENANCE_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:40:export const PARSER_PROVENANCE_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:49:export const EVIDENCE_STATUS_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:58:export const FRESHNESS_AUTHORITY_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:67:export const MEASUREMENT_AUTHORITY_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:76:export const PUBLICATION_METHODOLOGY_STATUSES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:83:export const MULTIPLIER_REQUIRED_FIELDS = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:93:  schemaVersion: string;
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:117:export const EDGE_EVIDENCE_CLASS_VALUES = [
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:156:    | 'session_snapshot'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:158:    | 'session_health'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:313:  if (!isNonEmptyString(metadata.schemaVersion)) {
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:314:    throw new Error('Publication methodology metadata requires a non-empty schemaVersion.');
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:336:    schemaVersion: metadata.schemaVersion.trim(),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:16:export const DEFAULT_WINDOW = 3600;   // 1 hour in seconds
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:17:export const MAX_WINDOW = 86400;      // 24 hours in seconds
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:8:export const WARM_START_BUNDLE_TOGGLE = 'SPECKIT_WARM_START_BUNDLE';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:17:export const WARM_START_VARIANTS: readonly WarmStartVariant[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:141:      return 'code_graph_query';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:158:    if (resolution === 'code_graph_query') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:254:        sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-query.ts:283:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts:238:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:6:// Follows code-graph-db.ts patterns for schema versioning and transaction safety.
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:105:export const SCHEMA_VERSION = 1;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:114:export const RESEARCH_WEIGHTS: Record<ResearchRelation, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:125:export const REVIEW_WEIGHTS: Record<ReviewRelation, number> = {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:137:export const VALID_KINDS: Record<LoopType, readonly string[]> = {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:143:export const VALID_RELATIONS: Record<LoopType, readonly string[]> = {
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:157:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:171:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:185:    session_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:191:    UNIQUE(spec_folder, loop_type, session_id, iteration)
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:194:  CREATE TABLE IF NOT EXISTS schema_version (
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:200:  CREATE INDEX IF NOT EXISTS idx_coverage_session ON coverage_nodes(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:206:  CREATE INDEX IF NOT EXISTS idx_coverage_edge_session ON coverage_edges(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:207:  CREATE INDEX IF NOT EXISTS idx_coverage_snapshot_session ON coverage_snapshots(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:228:    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:230:      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:232:      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:266:    parts.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:308:      id, spec_folder, loop_type, session_id, kind, name,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:382:      id, spec_folder, loop_type, session_id, source_id, target_id,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:454:      spec_folder, loop_type, session_id, iteration, metrics, node_count, edge_count
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:457:    ON CONFLICT(spec_folder, loop_type, session_id, iteration) DO UPDATE SET
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:474:      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:493:      WHERE spec_folder = ? AND loop_type = ? AND session_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:517:  schemaVersion: number;
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:558:    schemaVersion: SCHEMA_VERSION,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:605:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:621:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts:636:    sessionId: r.session_id as string,
.opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts:244:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:7:// - vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:535:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:14:export const STAGE2_GRAPH_BONUS_CAP = 0.03;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts:362:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1386:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts:61:export const CHUNKING_THRESHOLD = 50000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:40:export const DEFAULT_TTL_MS = 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-cache.ts:209:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:22:export const MAX_FACETS = 3;
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-decomposer.ts:290:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:715:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts:382:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1240:                `SELECT id, title, spec_folder, file_path, importance_tier, importance_weight, quality_score, created_at, is_archived, context_type, tenant_id, user_id, agent_id, session_id, shared_space_id FROM memory_index WHERE id IN (${placeholders})`
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1417:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:35:  | 'session_boosted'
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:127:    signals.push('session_boosted');
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:207:    if (signal === 'session_boosted') return 'session attention';
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:359:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts:4:// Feature catalog: Evaluation database and schema
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:142: *   - Structured JSON output schema minimises parsing failures
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:319:export const llm = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:435:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:4:// Split from vector-index-store.ts — contains ALL schema creation,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:22:// Feature catalog: Database and schema safety
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:31:  schemaVersion: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:41:  schemaVersion: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:51:const REQUIRED_TABLES: readonly string[] = ['memory_index', 'schema_version'];
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:74:  'session_id',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:129:    session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:424:// V23: One-time spec_folder re-canonicalization + session_state migration
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:426:/** Current schema version for vector-index migrations. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:427:export const SCHEMA_VERSION = 25;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:429:// Run schema migrations from one version to another
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:433: * Runs schema migrations between two schema versions.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:435: * @param from_version - The current schema version.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:436: * @param to_version - The target schema version.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:442:      // V0 -> v1: Initial schema (already exists via create_schema)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:487:      // Use the canonical helper so later schema refinements only update one DDL definition.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1126:    // P1-3 fix: Migrate session_state.spec_folder using old→new mapping
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1243:// Ensure schema version table exists and run any pending migrations
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1245: * Ensures the schema version table is current.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1247: * @returns The previous schema version.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1249:export function ensure_schema_version(database: Database.Database): number {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1251:    CREATE TABLE IF NOT EXISTS schema_version (
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1258:  const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1263:    logger.info(`Migrating schema from v${current_version} to v${SCHEMA_VERSION}`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1272:      INSERT OR REPLACE INTO schema_version (id, version, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1281:      'Backward-compatibility validation detected schema gaps',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1449:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1461:      ON governance_audit(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1467:        ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1528: * Validates backward compatibility expectations for the current schema.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1581:    const schemaVersion = safe_get_schema_version(database);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1589:      schemaVersion,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1599:      schemaVersion: null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1639:      schemaVersion: safe_get_schema_version(database),
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1651:      schemaVersion: null,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1661:function safe_get_schema_version(database: Database.Database): number | null {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1663:    if (!hasTable(database, 'schema_version')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1666:    const row = database.prepare('SELECT version FROM schema_version WHERE id = 1').get() as { version?: number } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1765:  if (!column_names.includes('session_id')) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1767:      database.exec(`ALTER TABLE memory_index ADD COLUMN session_id TEXT`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1768:      console.warn('[vector-index] Migration: Added session_id column');
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1773:      logDuplicateColumnMigrationSkip('session_id', error);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2172: * Migrate session_state.spec_folder values using the old→new mapping
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2179:  if (!hasTable(database, 'session_state')) return;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2190:    'UPDATE session_state SET spec_folder = ? WHERE session_id = ? AND spec_folder = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2194:    `SELECT session_id, spec_folder FROM session_state WHERE spec_folder IS NOT NULL`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2195:  ).all() as Array<{ session_id: string; spec_folder: string }>;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2202:      updateStmt.run(canonical, row.session_id, row.spec_folder);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2205:      logger.warn(`Migration v23: Ambiguous session_state mapping for "${row.spec_folder}". Skipping.`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2210:    logger.info(`Migration v23: Updated spec_folder for ${updated} session_state rows`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2257:// Create database schema
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2259: * Creates or upgrades the vector-index schema.
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2264:export function create_schema(
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2287:        'Existing schema is not fully backward-compatible after bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2325:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2435:    CREATE INDEX IF NOT EXISTS idx_memories_scope ON memory_index(spec_folder, session_id, context_type);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2436:    CREATE INDEX IF NOT EXISTS idx_memories_governed_scope ON memory_index(tenant_id, user_id, agent_id, session_id, shared_space_id);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2461:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2483:export { ensure_schema_version as ensureSchemaVersion };
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2485:export { create_schema as createSchema };
.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts:16:export const QUALITY_FLOOR = 0.005;
.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:24:export const EXPLICIT_ONLY_EVIDENCE = 'explicit_only';
.opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts:52:export const DETERMINISTIC_EXTRACTOR_PROVENANCE = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:37:  create_schema,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:38:  ensure_schema_version,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:39:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:83:export const search_weights: SearchWeightsConfig = {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:121:export const EMBEDDING_DIM = 768;
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:167:  const schema_row = database.prepare(`
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:171:  if (!schema_row) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:176:      reason: 'No existing schema',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:222:    reason: 'No stored vector dimension found for existing schema',
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:247:      const source_label = existing.source === 'vec_metadata' ? 'vec_metadata' : 'vec_memories schema';
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:281:export const DEFAULT_DB_PATH = process.env.MEMORY_DB_PATH
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:819:  create_schema(new_db, { sqlite_vec_available: vec_available, get_embedding_dim });
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:820:  ensure_schema_version(new_db);
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:24:  ensure_schema_version,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:30:  create_schema,
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:38:} from './vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:6:export const SESSION_TRANSITION_SIGNAL_ORDER = [
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:23:export const DOMAIN_VOCABULARY_MAP: Record<string, string[]> = {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:169:  // No-op: schema creation is now idempotently attempted on every access.
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts:211:   5. EXPORTS (re-export constants for test convenience)
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:270:    // entity_catalog may not have an alias column — check schema first
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:279:      // Fall back to entity_text as both alias and canonical when schema differs
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts:1146:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:112:    metrics['isolation.missing_session_scope_rows'] = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:114:    metrics['schema.version'] = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:130:  metrics['isolation.missing_session_scope_rows'] = safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:132:    "SELECT COUNT(*) AS value FROM memory_index WHERE session_id IS NULL OR TRIM(session_id) = ''",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:138:  metrics['schema.version'] = safeScalarMetric(
.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:140:    'SELECT version AS value FROM schema_version WHERE id = 1',
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:20:export const CONFIDENCE_MULTIPLIER_BASE = 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:23:export const CONFIDENCE_MULTIPLIER_FLOOR = 0.3;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:26:export const NEGATIVE_PENALTY_PER_VALIDATION = 0.1;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:34:export const RECOVERY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:573:export const __testables = {
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:11:} from '../search/vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:94:  'schema_mismatch',
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:182: * Tier 2: Database config persistence — `shared_memory_enabled` key in `config` table.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:200:        .get('shared_memory_enabled') as { value: string } | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:204:      console.warn(`[shared-spaces] Failed to resolve shared_memory_enabled config: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:219:    .run('shared_memory_enabled', 'true');
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:223: * Ensure shared-space schema is available before collab operations run.
.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:603:    return deny('shared_memory_disabled');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:10:} from './trace-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:13:} from './trace-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:83:export const CONFIDENCE_BASE: number = 0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:84:export const CONFIDENCE_POSITIVE_INCREMENT: number = 0.1;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:85:export const CONFIDENCE_NEGATIVE_DECREMENT: number = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:86:export const CONFIDENCE_MAX: number = 1.0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:87:export const CONFIDENCE_MIN: number = 0.0;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:89:export const PROMOTION_CONFIDENCE_THRESHOLD: number = 0.9;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:90:export const PROMOTION_VALIDATION_THRESHOLD: number = 5;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:51:export const GROUND_TRUTH_QUERIES: GroundTruthQuery[] = queries;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:52:export const GROUND_TRUTH_RELEVANCES: GroundTruthRelevance[] = relevances;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-data.ts:65:export const QUERY_DISTRIBUTION = {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:42:export const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition> = {
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:68:    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:86:    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:104:      'code_graph_query',
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:105:      'code_graph_context'
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:115:    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:128:export const TOOL_LAYER_MAP: Record<string, LayerId> = {} as Record<string, LayerId>;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts:60:export const MPAB_BONUS_COEFFICIENT = 0.3;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-logger.ts:4:// Feature catalog: Evaluation database and schema
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:55:export const ALL_CHANNELS: AblationChannel[] = [
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:161:export const FIVE_FACTOR_WEIGHTS: FiveFactorWeights = {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:170:export const DEFAULT_WEIGHTS: LegacyWeights = {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:180:export const RECENCY_SCALE_DAYS: number = 1 / DECAY_RATE;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:184:export const FSRS_FACTOR: number = 19 / 81;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:185:export const FSRS_DECAY: number = -0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:226:export const IMPORTANCE_MULTIPLIERS: Readonly<Record<string, number>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:236:export const CITATION_DECAY_RATE: number = 0.1;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:237:export const CITATION_MAX_DAYS: number = 90;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:242:export const DOCUMENT_TYPE_MULTIPLIERS: Readonly<Record<string, number>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:256:export const PATTERN_ALIGNMENT_BONUSES: PatternAlignmentBonuses = {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:362:export const calculateTemporalScore = calculateRetrievabilityScore;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:32:export const IMPORTANCE_TIERS: Readonly<Record<ImportanceTier, TierConfig>> = {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:80:export const VALID_TIERS: readonly ImportanceTier[] = Object.keys(IMPORTANCE_TIERS) as ImportanceTier[];
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts:81:export const DEFAULT_TIER: ImportanceTier = 'normal';
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:24:export const INTERFERENCE_SIMILARITY_THRESHOLD = 0.75;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:31:export const INTERFERENCE_PENALTY_COEFFICIENT = -0.08;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:8:import { ensureGovernanceTables, ensureSharedSpaceTables } from '../search/vector-index-schema.js';
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:294:    session_id: decision.normalized.sessionId || null,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:337:      action, decision, memory_id, logical_key, tenant_id, user_id, agent_id, session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:422:    clauses.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:492:      && matchesExactScope(row.session_id, normalized.sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:538:      session_id,
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:556:    session_id: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:609:      sessionId: row.session_id ?? undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:33:  session_id?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:44:  session_id?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:106:      session_id TEXT,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:116:    CREATE INDEX IF NOT EXISTS idx_consumption_log_session_id
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:117:      ON consumption_log (session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:148:         session_id, timestamp, latency_ms, spec_folder_filter, metadata)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:157:      event.session_id ?? null,
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:197:    if (options.session_id) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:198:      conditions.push('session_id = ?');
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:199:      params.push(options.session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:239:    // Unique sessions (add session_id IS NOT NULL to existing conditions)
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:240:    const sessionConditions = [...conditions, 'session_id IS NOT NULL'];
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:243:      SELECT COUNT(DISTINCT session_id) as cnt
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:407:        SELECT session_id, COUNT(*) as query_count
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:409:        WHERE session_id IS NOT NULL
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:410:        GROUP BY session_id
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:414:      `).all(exampleLimit) as Array<{ session_id: string; query_count: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:421:          const sid = r.session_id.length > 36 ? r.session_id.substring(0, 36) + '...' : r.session_id;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:20:export const SAMPLING_RATE = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts:80:    // Only set _db after successful schema creation
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:5:// Canonical schema + runtime validation for retrieval trace payloads
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/ops/file-watcher.ts:472:export const __testables = {

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Resume Handler
// ───────────────────────────────────────────────────────────────
// Phase 020: Composite MCP tool that merges memory resume context,
// code graph status, and CocoIndex availability into a single call.

import { createHash } from 'node:crypto';
import { statSync } from 'node:fs';
import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
import { handleMemoryContext } from './memory-context.js';
import * as graphDb from '../lib/code-graph/code-graph-db.js';
import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;

export interface CachedSessionSummaryCandidate {
  schemaVersion: number;
  lastSpecFolder: string | null;
  summaryText: string | null;
  extractedAt: string | null;
  stateUpdatedAt: string | null;
  producerMetadata: HookProducerMetadata | null;
}

export interface CachedSessionSummary {
  schemaVersion: number;
  lastSpecFolder: string;
  summaryText: string;
  extractedAt: string;
  lastClaudeTurnAt: string;
  transcriptPath: string;
  transcriptFingerprint: string;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  continuityText: string;
  startupHint: string;
}

export interface CachedSessionSummaryDecision {
  status: 'accepted' | 'rejected';
  category: 'accepted' | 'fidelity' | 'freshness';
  reason:
    | 'accepted'
    | 'missing_state'
    | 'schema_version_mismatch'
    | 'missing_summary'
    | 'missing_producer_metadata'
    | 'missing_required_fields'
    | 'transcript_unreadable'
    | 'transcript_identity_mismatch'
    | 'stale_summary'
    | 'summary_precedes_producer_turn'
    | 'scope_mismatch'
    | 'unknown_scope';
  detail: string;
  cachedSummary: CachedSessionSummary | null;
}

interface SessionResumeArgs {
  specFolder?: string;
  sessionId?: string;
  minimal?: boolean;
}

interface CodeGraphStatus {
  status: 'fresh' | 'stale' | 'empty' | 'error';
  lastScan: string | null;
  nodeCount: number;
  edgeCount: number;
  fileCount: number;
}

interface CocoIndexStatus {
  available: boolean;
  binaryPath: string;
}

interface SessionResumeResult {
  memory: Record<string, unknown>;
  codeGraph: CodeGraphStatus;
  cocoIndex: CocoIndexStatus;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract;
  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
  if (typeof specFolder !== 'string') {
    return null;
  }

  const trimmed = specFolder.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.replace(/^\.opencode\//, '');
}

function parseIsoMs(value: string | null | undefined): number | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function isFiniteNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function buildTranscriptFingerprint(
  transcriptPath: string,
  sizeBytes: number,
  modifiedAtMs: number,
): string {
  return createHash('sha256')
    .update(`${transcriptPath}:${sizeBytes}:${modifiedAtMs}`)
    .digest('hex')
    .slice(0, 16);
}

function rejectCachedSummary(
  category: 'fidelity' | 'freshness',
  reason: CachedSessionSummaryDecision['reason'],
  detail: string,
): CachedSessionSummaryDecision {
  return {
    status: 'rejected',
    category,
    reason,
    detail,
    cachedSummary: null,
  };
}

export function buildCachedSessionSummaryCandidate(
  state: HookState | null,
): CachedSessionSummaryCandidate | null {
  if (!state) {
    return null;
  }

  return {
    schemaVersion: CACHED_SESSION_SUMMARY_SCHEMA_VERSION,
    lastSpecFolder: state.lastSpecFolder,
    summaryText: state.sessionSummary?.text ?? null,
    extractedAt: state.sessionSummary?.extractedAt ?? null,
    stateUpdatedAt: state.updatedAt,
    producerMetadata: state.producerMetadata,
  };
}

export function evaluateCachedSessionSummaryCandidate(
  candidate: CachedSessionSummaryCandidate | null,
  options: {
    specFolder?: string;
    nowMs?: number;
    maxAgeMs?: number;
  } = {},
): CachedSessionSummaryDecision {
  if (!candidate) {
    return rejectCachedSummary('fidelity', 'missing_state', 'No recent hook state was available for cached continuity reuse.');
  }

  if (candidate.schemaVersion !== CACHED_SESSION_SUMMARY_SCHEMA_VERSION) {
    return rejectCachedSummary(
      'fidelity',
      'schema_version_mismatch',
      `Expected schema version ${CACHED_SESSION_SUMMARY_SCHEMA_VERSION} but received ${String(candidate.schemaVersion)}.`,
    );
  }

  const summaryText = candidate.summaryText?.trim() ?? '';
  if (summaryText.length === 0 || parseIsoMs(candidate.extractedAt) === null) {
    return rejectCachedSummary(
      'fidelity',
      'missing_summary',
      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
    );
  }

  const producerMetadata = candidate.producerMetadata;

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Save Handler
// ───────────────────────────────────────────────────────────────
/* --- 1. DEPENDENCIES --- */

// Node built-ins
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import path from 'path';

// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  evaluateMemorySufficiency,
  MEMORY_SUFFICIENCY_REJECTION_CODE,
  type MemorySufficiencyResult,
} from '@spec-kit/shared/parsing/memory-sufficiency';
import {
  validateMemoryTemplateContract,
  type MemoryTemplateContractResult,
} from '@spec-kit/shared/parsing/memory-template-contract';
import {
  evaluateSpecDocHealth,
  type SpecDocHealthResult,
} from '@spec-kit/shared/parsing/spec-doc-health';

// Internal modules
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { createFilePathValidator } from '../utils/validators.js';
import * as memoryParser from '../lib/parsing/memory-parser.js';
import * as transactionManager from '../lib/storage/transaction-manager.js';
import * as checkpoints from '../lib/storage/checkpoints.js';
import * as preflight from '../lib/validation/preflight.js';
import { requireDb } from '../utils/index.js';
import type { MCPResponse } from './types.js';
import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
import * as causalEdges from '../lib/storage/causal-edges.js';

import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
import { isSaveQualityGateEnabled } from '../lib/search/search-flags.js';

import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
import { findSimilarMemories } from './pe-gating.js';
import { runPostMutationHooks } from './mutation-hooks.js';
import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator.js';
import { applyPostInsertMetadata } from './save/db-helpers.js';
import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
import {
  buildGovernancePostInsertFields,
  ensureGovernanceRuntime,
  recordGovernanceAudit,
  validateGovernedIngest,
} from '../lib/governance/scope-governance.js';
import {
  assertSharedSpaceAccess,
  recordSharedConflict,
} from '../lib/collab/shared-spaces.js';
import { delete_memory_from_database } from '../lib/search/vector-index-mutations.js';
import {
  runQualityLoop,
} from './quality-loop.js';
import type {
  QualityLoopResult,
} from './quality-loop.js';

// O2-5/O2-12: V-rule validation (previously only in workflow path)
import {
  validateMemoryQualityContent,
  determineValidationDisposition,
} from './v-rule-bridge.js';

// Save pipeline modules (CR-P2-4 decomposition)
import type {
  IndexResult,
  SaveArgs,
  AtomicSaveParams,
  AtomicSaveOptions,
  AtomicSaveResult,
} from './save/index.js';
import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
import { runPostInsertEnrichment } from './save/post-insert.js';
import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
import { createMCPErrorResponse } from '../lib/response/envelope.js';

// Extracted sub-modules
import { withSpecFolderLock } from './save/spec-folder-mutex.js';
import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
import {
  applyInsufficiencyMetadata,
  buildInsufficiencyRejectionResult,
  buildTemplateContractRejectionResult,
  buildDryRunSummary,
} from './save/validation-responses.js';

import { markMemorySuperseded } from './pe-gating.js';
import { resolveMemoryReference } from './causal-links-processor.js';
import { refreshAutoEntitiesForMemory } from '../lib/extraction/entity-extractor.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Dry-run preflight for memory_save
// Feature catalog: Prediction-error save arbitration


// Create local path validator
const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
const MANUAL_FALLBACK_SOURCE_CLASSIFICATION = 'manual-fallback' as const;

interface PreparedParsedMemory {
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
  qualityLoopResult: QualityLoopResult;
  sufficiencyResult: MemorySufficiencyResult;
  templateContract: MemoryTemplateContractResult;
  specDocHealth: SpecDocHealthResult | null;
  finalizedFileContent: string | null;
  sourceClassification: 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
}

type ParsedMemoryWithIndexHints = ReturnType<typeof memoryParser.parseMemoryFile> & {
  _skipIndex?: boolean;
  _vRuleIndexBlockIds?: string[];
};

const STANDARD_MEMORY_TEMPLATE_MARKERS = [
  '## continue session',
  '## recovery hints',
  '<!-- memory metadata -->',
];

class VRuleUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VRuleUnavailableError';
  }
}

function isVRuleUnavailableResult(value: unknown): value is {
  passed: false;
  status: 'error' | 'warning';
  message: string;
  _unavailable: true;
} {
  return typeof value === 'object'
    && value !== null
    && 'passed' in value
    && (value as { passed?: unknown }).passed === false
    && 'status' in value
    && typeof (value as { status?: unknown }).status === 'string'
    && 'message' in value
    && typeof (value as { message?: unknown }).message === 'string';
}

function classifyMemorySaveSource(
  content: string,
): 'template-generated' | typeof MANUAL_FALLBACK_SOURCE_CLASSIFICATION {
  const normalizedContent = content.toLowerCase();
  const hasAnyStandardMarker = STANDARD_MEMORY_TEMPLATE_MARKERS.some((marker) => normalizedContent.includes(marker));
  return hasAnyStandardMarker ? 'template-generated' : MANUAL_FALLBACK_SOURCE_CLASSIFICATION;
}

function shouldBypassTemplateContract(
  sourceClassification: PreparedParsedMemory['sourceClassification'],
  sufficiencyResult: MemorySufficiencyResult,
  templateContract: MemoryTemplateContractResult,
): boolean {
  return sourceClassification === MANUAL_FALLBACK_SOURCE_CLASSIFICATION
    && sufficiencyResult.pass
    && sufficiencyResult.evidenceCounts.primary === 0
    && sufficiencyResult.evidenceCounts.support >= 3
    && sufficiencyResult.evidenceCounts.anchors >= 1
    && !templateContract.valid;
}

function buildQualityLoopMetadata(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  database: ReturnType<typeof requireDb>,
): Record<string, unknown> {
  return {
    title: parsed.title ?? '',
    triggerPhrases: parsed.triggerPhrases,
    specFolder: parsed.specFolder,
    contextType: parsed.contextType,
    importanceTier: parsed.importanceTier,
    causalLinks: parsed.causalLinks,
    filePath: parsed.filePath,
    lastModified: parsed.lastModified,
    resolveReference: (reference: string) => resolveMemoryReference(database, reference) !== null,
  };
}

function prepareParsedMemoryForIndexing(
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  database: ReturnType<typeof requireDb>,
  options: {
    emitEvalMetrics?: boolean;
  } = {},
): PreparedParsedMemory {
  const validation = memoryParser.validateParsedMemory(parsed);
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn(`[memory] Warning for ${path.basename(parsed.filePath)}:`);
    validation.warnings.forEach((warning: string) => console.warn(`[memory]   - ${warning}`));
  }

  // O2-5/O2-12: Run V-rule validation (previously only in workflow path)
  const vRuleResult = validateMemoryQualityContent(parsed.content, { filePath: parsed.filePath });
  if (isVRuleUnavailableResult(vRuleResult) && vRuleResult.status === 'error') {
    throw new VRuleUnavailableError(vRuleResult.message);
  }
  if (vRuleResult && '_unavailable' in vRuleResult) {
    validation.warnings.push('V-rule validator module unavailable — quality gate bypassed. Save proceeds without V-rule enforcement.');
  }
  if (vRuleResult && !isVRuleUnavailableResult(vRuleResult) && !vRuleResult.valid) {
    const vRuleDisposition = determineValidationDisposition(
      vRuleResult.failedRules,
      parsed.memoryTypeSource || null,
    );
    if (vRuleDisposition && vRuleDisposition.disposition === 'abort_write') {
      const failedRuleIds = vRuleDisposition.blockingRuleIds;
      console.error(`[memory-save] V-rule hard block for ${path.basename(parsed.filePath)}: ${failedRuleIds.join(', ')}`);
      // Return early with a rejected quality loop result so callers see the block
      const rejectScore = { total: 0, breakdown: { triggers: 0, anchors: 0, budget: 0, coherence: 0 }, issues: [`V-rule hard block: ${failedRuleIds.join(', ')}`] };
      return {
        parsed,
        validation,
        qualityLoopResult: {
          passed: false,
          score: rejectScore,
          attempts: 0,
          fixes: [],
          rejected: true,
          rejectionReason: `V-rule hard block: ${failedRuleIds.join(', ')}`,
        },
        sufficiencyResult: {
          pass: false,
          rejectionCode: MEMORY_SUFFICIENCY_REJECTION_CODE,
          score: 0,
          reasons: [`V-rule hard block: ${failedRuleIds.join(', ')}`],
          evidenceCounts: { primary: 0, support: 0, total: 0, semanticChars: 0, uniqueWords: 0, anchors: 0, triggerPhrases: 0 },
        },
        templateContract: { valid: false, violations: [], missingAnchors: [], unexpectedTemplateArtifacts: [] } as MemoryTemplateContractResult,
        specDocHealth: null,
        finalizedFileContent: null,
        sourceClassification: 'template-generated',
      };
    }
    if (vRuleDisposition && vRuleDisposition.disposition === 'write_skip_index') {
      console.warn(`[memory-save] V-rule index block for ${path.basename(parsed.filePath)}: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      validation.warnings.push(`V-rule index block: ${vRuleDisposition.indexBlockingRuleIds.join(', ')}`);
      // F07-002: Flag to skip indexing for write_skip_index disposition
      const parsedWithIndexHints = parsed as ParsedMemoryWithIndexHints;
      parsedWithIndexHints._skipIndex = true;
      parsedWithIndexHints._vRuleIndexBlockIds = vRuleDisposition.indexBlockingRuleIds;
    }
  }


 succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Generate Context
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. GENERATE CONTEXT
// ───────────────────────────────────────────────────────────────
// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow

// Node stdlib
import * as path from 'path';
import * as fsSync from 'fs';

// Internal modules
import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import {
  CONFIG,
  findActiveSpecsDir,
  getSpecsDirectories,
  SPEC_FOLDER_PATTERN,
  SPEC_FOLDER_BASIC_PATTERN,
  CATEGORY_FOLDER_PATTERN,
  findChildFolderSync,
} from '../core';
import { runWorkflow, releaseFilesystemLock } from '../core/workflow';
import { loadCollectedData } from '../loaders';
import { collectSessionData } from '../extractors/collect-session-data';

type StructuredCollectedData = Record<string, unknown> & { _source: 'file' };

interface ParsedCliArguments {
  dataFile: string | null;
  specFolderArg: string | null;
  collectedData: StructuredCollectedData | null;
  sessionId: string | null;
}

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES
// ───────────────────────────────────────────────────────────────
/** Result of validating a requested spec folder reference. */
export interface SpecFolderValidation {
  valid: boolean;
  reason?: string;
  warning?: string;
}

// ───────────────────────────────────────────────────────────────
// 3. HELP TEXT
// ───────────────────────────────────────────────────────────────
const HELP_TEXT = `
Usage: node generate-context.js [options] <input>

Arguments:
  <input>           A JSON data file path
                    - JSON file mode: node generate-context.js data.json [spec-folder]

Options:
  --help, -h        Show this help message
  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata

Examples:
  node generate-context.js /tmp/context-data.json
  node generate-context.js /tmp/context-data.json specs/001-feature/
  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'

Output:
  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
  for indexing by the Spec Kit Memory system.

Preferred save path (JSON-PRIMARY):
  - ALWAYS use --stdin, --json, or a JSON temp file.
  - The AI has strictly better information about its own session than any DB query can reconstruct.
  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.

Direct CLI target rule:
  - When a spec folder is passed on the CLI, that explicit target is authoritative.
  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    but they must not reroute the save to another folder.

JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
  {
    "user_prompts": [...],
    "observations": [...],
    "recent_context": [...],
    "toolCalls": [
      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    ],
    "exchanges": [
      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    ],
    "preflight": {
      "knowledgeScore": 40,
      "uncertaintyScore": 60,
      "contextScore": 50,
      "timestamp": "ISO-8601",
      "gaps": ["gap1", "gap2"],
      "confidence": 45,
      "readiness": "Needs research"
    },
    "postflight": {
      "knowledgeScore": 75,
      "uncertaintyScore": 25,
      "contextScore": 80,
      "gapsClosed": ["gap1"],
      "newGaps": ["new-gap"]
    }
  }

  Tool/Exchange enrichment fields (all optional — JSON-mode only):
  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
  - exchanges[]: Key user-assistant exchanges with timestamps
  - These provide richer context than DB extraction since the AI filters noise at source

  Learning Delta Calculation:
  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
  - Context Delta = postflight.contextScore - preflight.contextScore
  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
`;

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(HELP_TEXT);
  process.exit(0);
}

// 2.1 SIGNAL HANDLERS
let signalHandlersInstalled = false;
let shuttingDown = false;

// Robustness: signal handler releases locks before reporting
function handleSignalShutdown(signal: string): void {
  if (shuttingDown) return; // prevent re-entrant handling
  shuttingDown = true;

  let lockReleaseFailed = false;
  try {
    releaseFilesystemLock();
  } catch (_err: unknown) {
    lockReleaseFailed = true;
  }

  console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
  process.exit(lockReleaseFailed ? 1 : 0);
}

function installSignalHandlers(): void {
  if (signalHandlersInstalled) {
    return;
  }

  process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
  process.on('SIGINT', () => handleSignalShutdown('SIGINT'));

  signalHandlersInstalled = true;
}

// ───────────────────────────────────────────────────────────────
// 4. SPEC FOLDER VALIDATION
// ───────────────────────────────────────────────────────────────
function isUnderApprovedSpecsRoot(normalizedInput: string): boolean {
  return validateFilePath(path.resolve(CONFIG.PROJECT_ROOT, normalizedInput), getSpecsDirectories()) !== null;
}

function isValidSpecFolder(folderPath: string): SpecFolderValidation {
  const folderName = path.basename(folderPath);

  // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
  const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
  // Extract the trailing portion that might be "parent/child"
  const trailingSegments = normalizedInput.split('/');
  // Check if the last two segments both match the spec folder pattern
  if (trailingSegments.length >= 2) {
    const lastTwo = trailingSegments.slice(-2);
    if (SPEC_FOLDER_PATTERN.test(lastTwo[0]) && SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
      // Both segments are valid spec folder names — valid nested spec folder
      const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

      if (!hasSpecsParent) {
        // Fallback: check if the path resolves to an existing directory under any specs root
        for (const specsDir of getSpecsDirectories()) {
          const candidate = path.join(specsDir, normalizedInput);
          if (
            !path.isAbsolute(normalizedInput) &&
            fsSync.existsSync(candidate) &&
            validateFilePath(candidate, getSpecsDirectories()) !== null
          ) {
            return { valid: true };
          }
        }
        return {
          valid: false,
          reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
        };
      }
      return { valid: true };
    }
  }

  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
    if (/^\d{3}-/.test(folderName)) {
      if (/[A-Z]/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should be lowercase' };
      }
      if (/_/.test(folderName)) {
        return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
      }
      if (!/^[a-z]/.test(folderName.slice(4))) {
        return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
      }
    }
    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
  }

  const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package project provides utilities for detecting and normalizing project names.
//
// It replicates the detection logic from the Claude Code shell helpers and
// OpenCode TypeScript plugin in pure Go, so CLI and MCP server can share
// a single canonical implementation.
package project

import (
	"context"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// DetectProject detects the project name for a given directory.
// Priority: git remote origin repo name → git root basename → dir basename.
// The returned name is always non-empty and already normalized (lowercase, trimmed).
func DetectProject(dir string) string {
	// Guard empty dir — nothing useful to detect.
	if dir == "" {
		return "unknown"
	}
	// Guard against arg injection: a dir starting with "-" would be
	// interpreted as a git flag when passed to `git -C <dir>`.
	if strings.HasPrefix(dir, "-") {
		dir = "./" + dir
	}

	if name := detectFromGitRemote(dir); name != "" {
		return normalize(name)
	}
	if name := detectFromGitRoot(dir); name != "" {
		return normalize(name)
	}
	base := filepath.Base(dir)
	if base == "" || base == "." {
		return "unknown"
	}
	return normalize(base)
}

// normalize applies canonical project name rules: lowercase + trim whitespace.
// It mirrors the normalization applied by the store layer so that DetectProject
// always returns a value that is consistent with stored project names.
func normalize(name string) string {
	n := strings.TrimSpace(strings.ToLower(name))
	if n == "" {
		return "unknown"
	}
	return n
}

// detectFromGitRemote attempts to determine the project name from the git
// remote "origin" URL. Returns empty string if git is unavailable, the
// directory is not a repo, or there is no origin remote.
func detectFromGitRemote(dir string) string {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "git", "-C", dir, "remote", "get-url", "origin")
	out, err := cmd.Output()
	if err != nil {
		return ""
	}
	url := strings.TrimSpace(string(out))
	return extractRepoName(url)
}

// detectFromGitRoot returns the basename of the git repository root.
// Falls back to empty string when git is unavailable or the directory is not
// inside a git repository.
func detectFromGitRoot(dir string) string {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	cmd := exec.CommandContext(ctx, "git", "-C", dir, "rev-parse", "--show-toplevel")
	out, err := cmd.Output()
	if err != nil {
		return ""
	}
	root := strings.TrimSpace(string(out))
	if root == "" {
		return ""
	}
	return filepath.Base(root)
}

// extractRepoName parses a git remote URL and returns just the repository name.
//
// Supported URL formats:
//   - SSH:   git@github.com:user/repo.git
//   - HTTPS: https://github.com/user/repo.git
//   - Either with or without the trailing .git suffix
func extractRepoName(url string) string {
	// Strip trailing .git suffix
	url = strings.TrimSuffix(url, ".git")

	// Split on both "/" and ":" to handle SSH and HTTPS uniformly
	parts := strings.FieldsFunc(url, func(r rune) bool {
		return r == '/' || r == ':'
	})
	if len(parts) == 0 {
		return ""
	}
	name := parts[len(parts)-1]
	return strings.TrimSpace(name)
}

exec
/bin/zsh -lc 'rg -n "NormalizeProject|ListProjectNames|MigrateProject|merge|project drift|similar|FindSimilar|DetectProject|/projects/migrate|sync|enrolled|chunk|mutation" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/*.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/*.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:24:// SyncStatusProvider returns the current sync status. This is implemented
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:25:// by autosync.Manager and injected from cmd/engram/main.go.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:30:// SyncStatus mirrors autosync.Status to avoid a direct import cycle.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:36:	LastSyncAt          *time.Time `json:"last_sync_at,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:45:	onWrite    func() // called after successful local writes (for autosync notification)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:46:	syncStatus SyncStatusProvider
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:57:// This is used to notify autosync.Manager via NotifyDirty().
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:62:// SetSyncStatus configures the sync status provider for the /sync/status endpoint.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:64:	s.syncStatus = provider
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:135:	s.mux.HandleFunc("POST /projects/migrate", s.handleMigrateProject)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:137:	// Sync status (degraded-state visibility for autosync)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:138:	s.mux.HandleFunc("GET /sync/status", s.handleSyncStatus)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:499:	if s.syncStatus == nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:502:			"message": "background sync is not configured",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:507:	status := s.syncStatus.Status()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:514:		"last_sync_at":         status.LastSyncAt,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:520:func (s *Server) handleMigrateProject(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:539:	result, err := s.store.MigrateProject(body.OldProject, body.NewProject)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:1:package sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:10:// Transport defines how chunks are read and written during sync.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:14:	// ReadManifest returns the manifest (chunk index).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:21:	// WriteChunk writes a compressed chunk to the transport.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:22:	// chunkID is the content-addressed ID (8 hex chars).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:24:	// entry contains metadata about the chunk.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:25:	WriteChunk(chunkID string, data []byte, entry ChunkEntry) error
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:27:	// ReadChunk reads a compressed chunk from the transport.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:29:	ReadChunk(chunkID string) ([]byte, error)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:34:// FileTransport reads/writes chunks to the local filesystem.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:38:	syncDir string // Path to .engram/ directory
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:41:// NewFileTransport creates a FileTransport rooted at the given sync directory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:42:func NewFileTransport(syncDir string) *FileTransport {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:43:	return &FileTransport{syncDir: syncDir}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:46:// ReadManifest reads the manifest.json from the sync directory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:49:	path := filepath.Join(ft.syncDir, "manifest.json")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:65:// WriteManifest writes the manifest to manifest.json in the sync directory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:67:	path := filepath.Join(ft.syncDir, "manifest.json")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:75:// WriteChunk writes gzipped chunk data to the chunks/ subdirectory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:76:func (ft *FileTransport) WriteChunk(chunkID string, data []byte, _ ChunkEntry) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:77:	chunksDir := filepath.Join(ft.syncDir, "chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:78:	if err := os.MkdirAll(chunksDir, 0755); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:79:		return fmt.Errorf("create chunks dir: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:82:	chunkPath := filepath.Join(chunksDir, chunkID+".jsonl.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:83:	return writeGzip(chunkPath, data)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:86:// ReadChunk reads gzipped chunk data from the chunks/ subdirectory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:87:func (ft *FileTransport) ReadChunk(chunkID string) ([]byte, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:88:	chunksDir := filepath.Join(ft.syncDir, "chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:89:	chunkPath := filepath.Join(chunksDir, chunkID+".jsonl.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport.go:90:	return readGzip(chunkPath)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:71:// ─── DetectProject integration tests ─────────────────────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:89:func TestDetectProject_GitRemote(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:100:	got := DetectProject(dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:102:		t.Errorf("DetectProject with remote = %q; want %q", got, "my-cool-repo")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:106:func TestDetectProject_GitRemote_HTTPS(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:116:	got := DetectProject(dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:118:		t.Errorf("DetectProject HTTPS remote = %q; want %q", got, "engram")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:122:func TestDetectProject_GitRootNoRemote(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:127:	got := DetectProject(dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:129:	// Normalize to lowercase to match DetectProject output
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:132:		t.Errorf("DetectProject no-remote = %q; want %q", got, wantLower)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:136:func TestDetectProject_NonGitDir(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:140:	got := DetectProject(dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:143:		t.Errorf("DetectProject non-git = %q; want %q", got, want)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:147:func TestDetectProject_EmptyDir_NoPanic(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:151:			t.Errorf("DetectProject panicked: %v", r)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:154:	got := DetectProject("")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:157:		t.Error("DetectProject(\"\") returned empty string")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:161:func TestDetectProject_NormalizedLowercase(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:162:	// DetectProject must always return lowercase names.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:170:	got := DetectProject(upper)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:172:		t.Errorf("DetectProject uppercase dir = %q; want %q", got, "myproject")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:176:func TestDetectProject_GitRemoteCasing(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:187:	got := DetectProject(dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect_test.go:189:		t.Errorf("DetectProject uppercase remote name = %q; want %q", got, "myrepo")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:1:package sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:41:		t.Fatalf("expected 1 chunk, got %d", len(got.Chunks))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:44:		t.Fatalf("chunk ID mismatch: got %q", got.Chunks[0].ID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:65:	// syncDir is a regular file, not a directory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:74:		t.Fatal("expected error when syncDir is a file")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:86:		t.Fatalf("write chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:90:	chunkPath := filepath.Join(dir, "chunks", "aabbccdd.jsonl.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:91:	if _, err := os.Stat(chunkPath); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:92:		t.Fatalf("chunk file not created: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:97:		t.Fatalf("read chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:100:		t.Fatalf("chunk data mismatch: got %q want %q", got, payload)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:108:		t.Fatal("expected error for missing chunk")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:121:		t.Fatal("expected error writing chunk to non-directory syncDir")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:189:	if ft.syncDir != dir {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:190:		t.Fatalf("syncDir mismatch: got %q want %q", ft.syncDir, dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:199:		t.Fatal("expected non-nil syncer")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:211:		t.Fatal("expected non-nil syncer")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:213:	if sy.syncDir != dir {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/transport_test.go:214:		t.Fatalf("syncDir mismatch: got %q want %q", sy.syncDir, dir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:16:// DetectProject detects the project name for a given directory.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:19:func DetectProject(dir string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:44:// It mirrors the normalization applied by the store layer so that DetectProject
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:52:// ─── FindSimilar unit tests ──────────────────────────────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:54:func TestFindSimilar_CaseInsensitiveAndSubstring(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:56:	matches := FindSimilar("engram", existing, 3)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:73:func TestFindSimilar_TiandaGroup(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:75:	matches := FindSimilar("tianda", existing, 3)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:115:func TestFindSimilar_ExcludesExactMatch(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:117:	matches := FindSimilar("engram", existing, 3)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:124:func TestFindSimilar_NothingSimilar(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:126:	matches := FindSimilar("abc", existing, 1)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:133:func TestFindSimilar_LevenshteinHit(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:135:	matches := FindSimilar("engram", existing, 2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:151:func TestFindSimilar_LevenshteinBeyondMaxDistance(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:154:	matches := FindSimilar("engram", existing, 2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:161:func TestFindSimilar_OrderingCaseFirst(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:168:	matches := FindSimilar("engram", existing, 2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:185:func TestFindSimilar_EmptyExisting(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:186:	matches := FindSimilar("engram", []string{}, 3)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:192:func TestFindSimilar_ZeroMaxDistance(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar_test.go:197:	matches := FindSimilar("engram", existing, 0)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:8:// ProjectMatch represents a project name that is similar to a query string.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:15:// FindSimilar finds projects similar to the given name from a list of existing
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:26:func FindSimilar(name string, existing []string, maxDistance int) []ProjectMatch {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:1:// Package sync implements git-friendly memory synchronization for Engram.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:4:// JSONL chunks with a manifest index. This design:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:6://   - Avoids git merge conflicts (each sync creates a NEW chunk, never modifies old ones)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:7://   - Keeps files small (each chunk is gzipped JSONL)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:8://   - Tracks what's been imported via chunk IDs (no duplicates)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:9://   - Works for teams (multiple devs create independent chunks)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:14://	├── manifest.json          ← index of all chunks (small, mergeable)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:15://	├── chunks/
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:16://	│   ├── a3f8c1d2.jsonl.gz ← chunk 1 (compressed)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:17://	│   ├── b7d2e4f1.jsonl.gz ← chunk 2
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:20:package sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:46:	storeRecordSynced   = func(s *store.Store, chunkID string) error { return s.RecordSyncedChunk(chunkID) }
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:56:// Manifest is the index file that lists all chunks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:57:// This is the only file git needs to diff/merge — it's small and append-only.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:60:	Chunks  []ChunkEntry `json:"chunks"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:63:// ChunkEntry describes a single chunk in the manifest.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:68:	Sessions  int    `json:"sessions"`   // Number of sessions in chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:69:	Memories  int    `json:"memories"`   // Number of observations in chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:70:	Prompts   int    `json:"prompts"`    // Number of prompts in chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:73:// ChunkData is the content of a single chunk file (JSONL entries).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:80:// SyncResult is returned after a sync operation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:82:	ChunkID              string `json:"chunk_id,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:86:	IsEmpty              bool   `json:"is_empty"` // true if nothing new to sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:89:// ImportResult is returned after importing chunks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:91:	ChunksImported       int `json:"chunks_imported"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:92:	ChunksSkipped        int `json:"chunks_skipped"` // Already imported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:100:// Syncer handles exporting and importing memory chunks.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:103:	syncDir   string    // Path to .engram/ in the project repo (kept for backward compat)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:107:// New creates a Syncer with a FileTransport rooted at syncDir.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:109:func New(s *store.Store, syncDir string) *Syncer {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:112:		syncDir:   syncDir,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:113:		transport: NewFileTransport(syncDir),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:119:func NewLocal(s *store.Store, syncDir string) *Syncer {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:120:	return New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:124:// This is used for remote (cloud) sync where chunks travel over HTTP.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:132:// ─── Export (DB → chunks) ────────────────────────────────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:134:// Export creates a new chunk with memories not yet in any chunk.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:136:// a new chunk with only the new data.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:138:	// Pre-flight: ensure the sync directory structure exists for filesystem transports.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:139:	// This preserves the original error ordering where "create chunks dir" was the
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:141:	if sy.syncDir != "" {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:142:		chunksDir := filepath.Join(sy.syncDir, "chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:143:		if err := os.MkdirAll(chunksDir, 0755); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:144:			return nil, fmt.Errorf("create chunks dir: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:154:	// Get known chunk IDs from the store's sync tracking
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:157:		return nil, fmt.Errorf("get synced chunks: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:160:	// Also consider chunks in the manifest as known
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:176:	// Get the timestamp of the last chunk to filter "new" data
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:179:	// Filter to only new data (created after last chunk)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:180:	chunk := sy.filterNewData(data, lastChunkTime)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:183:	if len(chunk.Sessions) == 0 && len(chunk.Observations) == 0 && len(chunk.Prompts) == 0 {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:187:	// Serialize and compress the chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:188:	chunkJSON, err := jsonMarshalChunk(chunk)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:190:		return nil, fmt.Errorf("marshal chunk: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:193:	// Generate chunk ID from content hash
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:194:	hash := sha256.Sum256(chunkJSON)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:195:	chunkID := hex.EncodeToString(hash[:])[:8]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:197:	// Check if this exact chunk already exists
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:198:	if _, exists := knownChunks[chunkID]; exists {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:204:		ID:        chunkID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:207:		Sessions:  len(chunk.Sessions),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:208:		Memories:  len(chunk.Observations),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:209:		Prompts:   len(chunk.Prompts),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:212:	// Write chunk via transport
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:213:	if err := sy.transport.WriteChunk(chunkID, chunkJSON, entry); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:214:		return nil, fmt.Errorf("write chunk: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:224:	// Record this chunk as synced in the local DB
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:225:	if err := storeRecordSynced(sy.store, chunkID); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:226:		return nil, fmt.Errorf("record synced chunk: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:230:		ChunkID:              chunkID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:231:		SessionsExported:     len(chunk.Sessions),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:232:		ObservationsExported: len(chunk.Observations),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:233:		PromptsExported:      len(chunk.Prompts),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:237:// ─── Import (chunks → DB) ────────────────────────────────────────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:239:// Import reads the manifest and imports any chunks not yet in the local DB.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:250:	// Get chunks we've already imported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:253:		return nil, fmt.Errorf("get synced chunks: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:259:		// Skip already-imported chunks
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:265:		// Read the chunk via transport
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:266:		chunkJSON, err := sy.transport.ReadChunk(entry.ID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:273:		var chunk ChunkData
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:274:		if err := json.Unmarshal(chunkJSON, &chunk); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:275:			return nil, fmt.Errorf("parse chunk %s: %w", entry.ID, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:282:			Sessions:     chunk.Sessions,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:283:			Observations: chunk.Observations,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:284:			Prompts:      chunk.Prompts,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:289:			return nil, fmt.Errorf("import chunk %s: %w", entry.ID, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:292:		// Record this chunk as imported
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:294:			return nil, fmt.Errorf("record chunk %s: %w", entry.ID, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:306:// Status returns information about what would be synced.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:344:	// Find the most recent chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:357:// If lastChunkTime is empty, returns everything (first sync).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:359:	chunk := &ChunkData{}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:362:		// First sync — everything is new
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:363:		chunk.Sessions = data.Sessions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:364:		chunk.Observations = data.Observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:365:		chunk.Prompts = data.Prompts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:366:		return chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:369:	// Parse the last chunk time for comparison.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:376:			chunk.Sessions = append(chunk.Sessions, s)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:382:			chunk.Observations = append(chunk.Observations, o)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:388:			chunk.Prompts = append(chunk.Prompts, p)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:392:	return chunk
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:499:// GetUsername returns the current username for chunk attribution.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:517:		return "No chunks synced yet."
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:539:		authorStrs = append(authorStrs, fmt.Sprintf("%s (%d chunks)", a, authors[a]))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:543:		"%d chunks, %d memories, %d sessions — contributors: %s",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:1:package sync
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:83:		t.Fatalf("mkdir sync dir: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:133:	syncDir := filepath.Join(t.TempDir(), ".engram")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:134:	sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:137:		t.Fatal("expected non-nil syncer")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:142:	if sy.syncDir != syncDir {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:143:		t.Fatalf("sync dir mismatch: got %q want %q", sy.syncDir, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:151:	syncDir := filepath.Join(t.TempDir(), ".engram")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:152:	exporter := New(srcStore, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:165:	chunkPath := filepath.Join(syncDir, "chunks", exportResult.ChunkID+".jsonl.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:166:	if _, err := os.Stat(chunkPath); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:167:		t.Fatalf("chunk file missing: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:187:	importer := New(dstStore, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:194:		t.Fatalf("unexpected chunk import counts: %+v", importResult)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:218:	t.Run("create chunks dir", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:226:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "create chunks dir") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:227:			t.Fatalf("expected create chunks dir error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:233:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:234:		if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("not-json"), 0o644); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:238:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:244:	t.Run("get synced chunks", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:246:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:251:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:252:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "get synced chunks") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:253:			t.Fatalf("expected get synced chunks error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:257:	t.Run("already known chunk id", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:266:		chunk := sy.filterNewData(data, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:267:		chunkJSON, err := json.Marshal(chunk)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:269:			t.Fatalf("marshal chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:271:		hash := sha256.Sum256(chunkJSON)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:272:		chunkID := hex.EncodeToString(hash[:])[:8]
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:274:		writeManifestFile(t, sy.syncDir, &Manifest{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:277:				ID:        chunkID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:288:			t.Fatalf("expected empty export for known chunk hash, got %+v", res)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:306:	t.Run("marshal chunk error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:316:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "marshal chunk") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:317:			t.Fatalf("expected marshal chunk error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:321:	t.Run("write chunk error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:331:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "write chunk") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:332:			t.Fatalf("expected write chunk error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:340:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:348:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:354:	t.Run("record synced chunk error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:364:		if _, err := sy.Export("alice", ""); err == nil || !strings.Contains(err.Error(), "record synced chunk") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:365:			t.Fatalf("expected record synced chunk error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:373:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:374:		if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("{bad"), 0o644); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:378:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:397:	t.Run("missing chunk file is skipped", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:399:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:400:		writeManifestFile(t, syncDir, &Manifest{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:405:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:411:			t.Fatalf("expected one skipped chunk, got %+v", res)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:415:	t.Run("invalid chunk json", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:417:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:419:		writeManifestFile(t, syncDir, &Manifest{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:424:		chunksDir := filepath.Join(syncDir, "chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:425:		if err := os.MkdirAll(chunksDir, 0o755); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:426:			t.Fatalf("mkdir chunks: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:428:		if err := writeGzip(filepath.Join(chunksDir, id+".jsonl.gz"), []byte("{not-valid-json")); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:429:			t.Fatalf("write bad gzip chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:432:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:433:		if _, err := sy.Import(); err == nil || !strings.Contains(err.Error(), "parse chunk") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:434:			t.Fatalf("expected parse chunk error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:440:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:442:		writeManifestFile(t, syncDir, &Manifest{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:447:		chunk := ChunkData{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:459:		payload, err := json.Marshal(chunk)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:461:			t.Fatalf("marshal chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:464:		chunksDir := filepath.Join(syncDir, "chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:465:		if err := os.MkdirAll(chunksDir, 0o755); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:466:			t.Fatalf("mkdir chunks: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:468:		if err := writeGzip(filepath.Join(chunksDir, id+".jsonl.gz"), payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:469:			t.Fatalf("write gzip chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:472:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:473:		if _, err := sy.Import(); err == nil || !strings.Contains(err.Error(), "import chunk") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:474:			t.Fatalf("expected import chunk error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:478:	t.Run("get synced chunks", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:480:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:481:		writeManifestFile(t, syncDir, &Manifest{Version: 1, Chunks: []ChunkEntry{{ID: "c1", CreatedAt: time.Now().UTC().Format(time.RFC3339)}}})
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:486:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:487:		if _, err := sy.Import(); err == nil || !strings.Contains(err.Error(), "get synced chunks") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:488:			t.Fatalf("expected get synced chunks error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:492:	t.Run("record chunk error", func(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:495:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:496:		id := "okchunk"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:497:		writeManifestFile(t, syncDir, &Manifest{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:502:		chunk := ChunkData{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:505:		payload, err := json.Marshal(chunk)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:507:			t.Fatalf("marshal chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:509:		chunksDir := filepath.Join(syncDir, "chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:510:		if err := os.MkdirAll(chunksDir, 0o755); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:511:			t.Fatalf("mkdir chunks: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:513:		if err := writeGzip(filepath.Join(chunksDir, id+".jsonl.gz"), payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:514:			t.Fatalf("write gzip chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:521:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:522:		if _, err := sy.Import(); err == nil || !strings.Contains(err.Error(), "record chunk") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:523:			t.Fatalf("expected record chunk error, got %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:529:	syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:530:	sy := New(nil, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:556:	if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("{"), 0o644); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:565:		t.Fatalf("write non-dir sync path: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:572:		t.Fatal("expected write manifest error for non-directory sync path")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:594:		syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:595:		if err := os.WriteFile(filepath.Join(syncDir, "manifest.json"), []byte("not-json"), 0o644); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:599:		sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:606:	syncDir := t.TempDir()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:607:	sy := New(s, syncDir)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:616:		t.Fatalf("record synced chunk: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:667:		t.Fatalf("expected first sync to include all data, got %+v", all)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:690:		t.Fatalf("unexpected last chunk time: %q", got)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:779:		path := filepath.Join(t.TempDir(), "chunk.jsonl.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:796:		path := filepath.Join(t.TempDir(), "missing", "chunk.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:815:		path := filepath.Join(t.TempDir(), "chunk.gz")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:864:		if empty != "No chunks synced yet." {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:874:		if !strings.Contains(summary, "3 chunks") || !strings.Contains(summary, "6 memories") || !strings.Contains(summary, "4 sessions") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync_test.go:877:		if !strings.Contains(summary, "alice (2 chunks), bob (1 chunks)") {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:40:	SyncID         string  `json:"sync_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:134:	SyncID    string `json:"sync_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:194:// EnrolledProject represents a project enrolled for cloud sync.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:197:	EnrolledAt string `json:"enrolled_at"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:200:type syncSessionPayload struct {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:208:type syncObservationPayload struct {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:209:	SyncID     string  `json:"sync_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:223:type syncPromptPayload struct {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:224:	SyncID    string  `json:"sync_id"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:413:		"PRAGMA synchronous = NORMAL",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:427:		return nil, fmt.Errorf("engram: repair enrolled sync journal: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:452:				sync_id    TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:489:				sync_id    TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:508:			CREATE TABLE IF NOT EXISTS sync_chunks (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:509:				chunk_id    TEXT PRIMARY KEY,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:513:			CREATE TABLE IF NOT EXISTS sync_state (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:527:			CREATE TABLE IF NOT EXISTS sync_mutations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:537:				FOREIGN KEY (target_key) REFERENCES sync_state(target_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:548:		{name: "sync_id", definition: "TEXT"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:568:	if err := s.addColumnIfNotExists("user_prompts", "sync_id", "TEXT"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:574:		CREATE INDEX IF NOT EXISTS idx_obs_sync_id ON observations(sync_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:578:		CREATE INDEX IF NOT EXISTS idx_prompts_sync_id ON user_prompts(sync_id);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:579:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_target_seq ON sync_mutations(target_key, seq);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:580:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_pending ON sync_mutations(target_key, acked_at, seq);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:585:	// Project-scoped sync: add project column to sync_mutations and enrollment table.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:586:	if err := s.addColumnIfNotExists("sync_mutations", "project", "TEXT NOT NULL DEFAULT ''"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:590:		CREATE TABLE IF NOT EXISTS sync_enrolled_projects (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:592:			enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:594:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_project ON sync_mutations(project);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:600:		UPDATE sync_mutations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:622:	if _, err := s.execHook(s.db, `UPDATE observations SET sync_id = 'obs-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:629:	if _, err := s.execHook(s.db, `UPDATE user_prompts SET sync_id = 'prompt-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:632:	if _, err := s.execHook(s.db, `INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES ('cloud', 'idle', datetime('now'))`); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:636:	// Create triggers to keep FTS in sync (idempotent check)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:756:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:762:		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:797:		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:820:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:907:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:936:		SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:950:	p.Project, _ = NormalizeProject(p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1050:		syncID := newSyncID("obs")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1054:			syncID, p.SessionID, p.Type, title, content,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1078:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1085:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1111:	p.Project, _ = NormalizeProject(p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1120:		syncID := newSyncID("prompt")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1122:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1123:			syncID, p.SessionID, content, nullableString(p.Project),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1132:		return s.enqueueSyncMutationTx(tx, SyncEntityPrompt, syncID, SyncOpUpsert, syncPromptPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1133:			SyncID:    syncID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1147:	project, _ = NormalizeProject(project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1153:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1189:		SELECT p.id, ifnull(p.sync_id, '') as sync_id, p.session_id, p.content, ifnull(p.project, '') as project, p.created_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1225:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1268:			project, _ = NormalizeProject(*p.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1343:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpDelete, syncObservationPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1464:	opts.Project, _ = NormalizeProject(opts.Project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1477:			SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1522:		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1698:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1723:		"SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts ORDER BY id",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1797:			`INSERT INTO user_prompts (sync_id, session_id, content, project, created_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1822:// GetSyncedChunks returns a set of chunk IDs that have been imported/exported.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1824:	rows, err := s.queryItHook(s.db, "SELECT chunk_id FROM sync_chunks")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1826:		return nil, fmt.Errorf("get synced chunks: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1830:	chunks := make(map[string]bool)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1836:		chunks[id] = true
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1838:	return chunks, rows.Err()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1841:// RecordSyncedChunk marks a chunk as imported/exported so it won't be processed again.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1842:func (s *Store) RecordSyncedChunk(chunkID string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1844:		"INSERT OR IGNORE INTO sync_chunks (chunk_id) VALUES (?)",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1845:		chunkID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1865:	// Only return mutations for enrolled projects or empty-project (global) mutations.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1866:	// Empty-project mutations always sync regardless of enrollment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1869:		FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1870:		LEFT JOIN sync_enrolled_projects sep ON sm.project = sep.project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1880:	var mutations []SyncMutation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1882:		var mutation SyncMutation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1883:		if err := rows.Scan(&mutation.Seq, &mutation.TargetKey, &mutation.Entity, &mutation.EntityKey, &mutation.Op, &mutation.Payload, &mutation.Source, &mutation.Project, &mutation.OccurredAt, &mutation.AckedAt); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1886:		mutations = append(mutations, mutation)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1888:	return mutations, rows.Err()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1891:// SkipAckNonEnrolledMutations acks (marks as skipped) all pending mutations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1892:// that belong to non-enrolled projects, preventing journal bloat. Empty-project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1893:// mutations are never skipped — they always sync regardless of enrollment.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1897:		UPDATE sync_mutations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1902:		  AND project NOT IN (SELECT project FROM sync_enrolled_projects)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1922:			`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq <= ? AND acked_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1936:			`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1945:// AckSyncMutationSeqs acknowledges specific mutation sequence numbers without
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1963:				`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq = ? AND acked_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1973:		if err := tx.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE target_key = ? AND acked_at IS NULL`, targetKey).Scan(&remaining); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1981:			`UPDATE sync_state SET last_acked_seq = ?, lifecycle = ?, updated_at = datetime('now') WHERE target_key = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2012:			`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2028:		`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2045:			`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2057:		`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2065:func (s *Store) ApplyPulledMutation(targetKey string, mutation SyncMutation) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2072:		if mutation.Seq <= state.LastPulledSeq {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2076:		switch mutation.Entity {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2078:			var payload syncSessionPayload
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2079:			if err := decodeSyncPayload([]byte(mutation.Payload), &payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2086:			var payload syncObservationPayload
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2087:			if err := decodeSyncPayload([]byte(mutation.Payload), &payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2090:			if mutation.Op == SyncOpDelete {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2100:			var payload syncPromptPayload
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2101:			if err := decodeSyncPayload([]byte(mutation.Payload), &payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2108:			return fmt.Errorf("unknown sync entity %q", mutation.Entity)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2112:			`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2115:			mutation.Seq, SyncLifecycleHealthy, targetKey,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2121:func (s *Store) GetObservationBySyncID(syncID string) (*Observation, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2123:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2126:		syncID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2137:// EnrollProject registers a project for cloud sync. Idempotent — re-enrolling
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2138:// an already-enrolled project is a no-op.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2145:			`INSERT OR IGNORE INTO sync_enrolled_projects (project) VALUES (?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2162:// UnenrollProject removes a project from cloud sync enrollment. Idempotent —
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2163:// unenrolling a non-enrolled project is a no-op.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2169:		`DELETE FROM sync_enrolled_projects WHERE project = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2175:// ListEnrolledProjects returns all projects currently enrolled for cloud sync,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2179:		`SELECT project, enrolled_at FROM sync_enrolled_projects ORDER BY project ASC`)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2196:// IsProjectEnrolled returns true if the given project is enrolled for cloud sync.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2200:		`SELECT 1 FROM sync_enrolled_projects WHERE project = ? LIMIT 1`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2221:func (s *Store) MigrateProject(oldName, newName string) (*MigrateResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2266:		// Enqueue sync mutations so cloud sync picks up the migrated records.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2285:// ListProjectNames returns all distinct project names from observations,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2287:func (s *Store) ListProjectNames() ([]string, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2434:// for the given project name. Used by handleSave for the similar-project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2449:	SourcesMerged       []string `json:"sources_merged"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2460:	canonical, _ = NormalizeProject(canonical)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2469:			src, _ = NormalizeProject(src)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2476:				return fmt.Errorf("merge observations %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2483:				return fmt.Errorf("merge sessions %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2490:				return fmt.Errorf("merge prompts %q → %q: %w", src, canonical, err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2497:		// Enqueue sync mutations so cloud sync picks up the merged records.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2585:		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2595:		FROM sync_state WHERE target_key = ?`, targetKey)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2605:		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2613:		FROM sync_state WHERE target_key = ?`, targetKey)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2634:			`SELECT project FROM sync_enrolled_projects ORDER BY project ASC`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2669:			FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2684:		var payload syncSessionPayload
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2703:			FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2706:			  AND sm.entity_key = observations.sync_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2718:		var payload syncObservationPayload
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2731:		SELECT sync_id, session_id, content, project
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2736:			FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2739:			  AND sm.entity_key = user_prompts.sync_id
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2751:		var payload syncPromptPayload
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2769:		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2775:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2787:		`UPDATE sync_state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2795:// extractProjectFromPayload returns the project string from a sync payload struct.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2800:	case syncSessionPayload:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2802:	case syncObservationPayload:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2807:	case syncPromptPayload:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2845:		`SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2856:func (s *Store) getObservationBySyncIDTx(tx *sql.Tx, syncID string, includeDeleted bool) (*Observation, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2857:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2859:		 FROM observations WHERE sync_id = ?`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2864:	row := tx.QueryRow(query, syncID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2872:func observationPayloadFromObservation(obs *Observation) syncObservationPayload {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2873:	return syncObservationPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2886:func (s *Store) applySessionPayloadTx(tx *sql.Tx, payload syncSessionPayload) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2900:func (s *Store) applyObservationUpsertTx(tx *sql.Tx, payload syncObservationPayload) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2922:func (s *Store) applyObservationDeleteTx(tx *sql.Tx, payload syncObservationPayload) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2946:func (s *Store) applyPromptUpsertTx(tx *sql.Tx, payload syncPromptPayload) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2948:	err := tx.QueryRow(`SELECT id FROM user_prompts WHERE sync_id = ? ORDER BY id DESC LIMIT 1`, payload.SyncID).Scan(&existingID)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2951:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3057:			sync_id    TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3081:			id, sync_id, session_id, type, title, content, tool_name, project,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3174:// NormalizeProject applies canonical project name normalization:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3179:func NormalizeProject(project string) (normalized string, warning string) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3485:	p.Project, _ = NormalizeProject(p.Project)

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package project

import (
	"sort"
	"strings"
)

// ProjectMatch represents a project name that is similar to a query string.
type ProjectMatch struct {
	Name      string // The existing project name
	MatchType string // "case-insensitive", "substring", or "levenshtein"
	Distance  int    // Levenshtein distance (0 for case-insensitive and substring matches)
}

// FindSimilar finds projects similar to the given name from a list of existing
// project names. Similarity is determined by three criteria:
//
//  1. Case-insensitive exact match (different case, same letters)
//  2. Substring containment (query is a substring of candidate or vice-versa)
//  3. Levenshtein distance ≤ maxDistance
//
// Exact matches (identical strings) are always excluded.
//
// Results are ordered: case-insensitive matches first, then substring matches,
// then levenshtein matches sorted by distance ascending.
func FindSimilar(name string, existing []string, maxDistance int) []ProjectMatch {
	if maxDistance < 0 {
		maxDistance = 0
	}

	nameLower := strings.ToLower(strings.TrimSpace(name))

	// Scale maxDistance for short names to avoid noisy matches.
	// A 2-char name with maxDistance 3 would match almost everything.
	effectiveMax := maxDistance
	if len(nameLower) > 0 {
		halfLen := len(nameLower) / 2
		if halfLen < 1 {
			halfLen = 1
		}
		if effectiveMax > halfLen {
			effectiveMax = halfLen
		}
	}

	var caseMatches []ProjectMatch
	var subMatches []ProjectMatch
	var levMatches []ProjectMatch

	seen := make(map[string]bool)

	for _, candidate := range existing {
		// Skip exact match (same string, no drift)
		if candidate == name {
			continue
		}

		candidateLower := strings.ToLower(strings.TrimSpace(candidate))

		// Skip after case-fold too — that would be a normalized duplicate
		if candidateLower == nameLower {
			// Only add if the strings differ (different casing is still drift)
			if candidate != name {
				if !seen[candidate] {
					seen[candidate] = true
					caseMatches = append(caseMatches, ProjectMatch{
						Name:      candidate,
						MatchType: "case-insensitive",
						Distance:  0,
					})
				}
			}
			continue
		}

		// Substring match — skip for very short names (< 3 chars)
		// to avoid noisy matches like "go" matching "golang-tools"
		if len(nameLower) >= 3 {
			if strings.Contains(candidateLower, nameLower) || strings.Contains(nameLower, candidateLower) {
				if !seen[candidate] {
					seen[candidate] = true
					subMatches = append(subMatches, ProjectMatch{
						Name:      candidate,
						MatchType: "substring",
						Distance:  0,
					})
				}
				continue
			}
		}

		// Levenshtein distance (using scaled effectiveMax)
		dist := levenshtein(nameLower, candidateLower)
		if dist <= effectiveMax {
			if !seen[candidate] {
				seen[candidate] = true
				levMatches = append(levMatches, ProjectMatch{
					Name:      candidate,
					MatchType: "levenshtein",
					Distance:  dist,
				})
			}
		}
	}

	// Sort levenshtein results by distance ascending
	sort.Slice(levMatches, func(i, j int) bool {
		return levMatches[i].Distance < levMatches[j].Distance
	})

	result := make([]ProjectMatch, 0, len(caseMatches)+len(subMatches)+len(levMatches))
	result = append(result, caseMatches...)
	result = append(result, subMatches...)
	result = append(result, levMatches...)
	return result
}

// levenshtein computes the Levenshtein (edit) distance between strings a and b.
// Uses the standard dynamic-programming approach with O(min(|a|,|b|)) space
// by only keeping two rows of the DP table at a time.
func levenshtein(a, b string) int {
	ra := []rune(a)
	rb := []rune(b)
	la, lb := len(ra), len(rb)

	if la == 0 {
		return lb
	}
	if lb == 0 {
		return la
	}

	// Ensure a is the shorter string for space optimisation
	if la > lb {
		ra, rb = rb, ra
		la, lb = lb, la
	}

	prev := make([]int, la+1)
	curr := make([]int, la+1)

	for i := 0; i <= la; i++ {
		prev[i] = i
	}

	for j := 1; j <= lb; j++ {
		curr[0] = j
		for i := 1; i <= la; i++ {
			cost := 1
			if ra[i-1] == rb[j-1] {
				cost = 0
			}
			del := prev[i] + 1
			ins := curr[i-1] + 1
			sub := prev[i-1] + cost
			curr[i] = minOf3(del, ins, sub)
		}
		prev, curr = curr, prev
	}

	return prev[la]
}

// minOf3 returns the smallest of three integers.
func minOf3(a, b, c int) int {
	if b < a {
		a = b
	}
	if c < a {
		a = c
	}
	return a
}

exec
/bin/zsh -lc "sed -n '1,280p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package sync implements git-friendly memory synchronization for Engram.
//
// Instead of a single large JSON file, memories are stored as compressed
// JSONL chunks with a manifest index. This design:
//
//   - Avoids git merge conflicts (each sync creates a NEW chunk, never modifies old ones)
//   - Keeps files small (each chunk is gzipped JSONL)
//   - Tracks what's been imported via chunk IDs (no duplicates)
//   - Works for teams (multiple devs create independent chunks)
//
// Directory structure:
//
//	.engram/
//	├── manifest.json          ← index of all chunks (small, mergeable)
//	├── chunks/
//	│   ├── a3f8c1d2.jsonl.gz ← chunk 1 (compressed)
//	│   ├── b7d2e4f1.jsonl.gz ← chunk 2
//	│   └── ...
//	└── engram.db              ← local working DB (gitignored)
package sync

import (
	"compress/gzip"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/Gentleman-Programming/engram/internal/store"
)

var (
	jsonMarshalChunk    = json.Marshal
	jsonMarshalManifest = json.MarshalIndent
	osCreateFile        = os.Create
	gzipWriterFactory   = func(f *os.File) gzipWriter { return gzip.NewWriter(f) }
	osHostname          = os.Hostname
	storeGetSynced      = func(s *store.Store) (map[string]bool, error) { return s.GetSyncedChunks() }
	storeExportData     = func(s *store.Store) (*store.ExportData, error) { return s.Export() }
	storeImportData     = func(s *store.Store, d *store.ExportData) (*store.ImportResult, error) { return s.Import(d) }
	storeRecordSynced   = func(s *store.Store, chunkID string) error { return s.RecordSyncedChunk(chunkID) }
)

type gzipWriter interface {
	Write(p []byte) (n int, err error)
	Close() error
}

// ─── Manifest ────────────────────────────────────────────────────────────────

// Manifest is the index file that lists all chunks.
// This is the only file git needs to diff/merge — it's small and append-only.
type Manifest struct {
	Version int          `json:"version"`
	Chunks  []ChunkEntry `json:"chunks"`
}

// ChunkEntry describes a single chunk in the manifest.
type ChunkEntry struct {
	ID        string `json:"id"`         // SHA-256 hash prefix (8 chars) of content
	CreatedBy string `json:"created_by"` // Username or machine identifier
	CreatedAt string `json:"created_at"` // ISO timestamp
	Sessions  int    `json:"sessions"`   // Number of sessions in chunk
	Memories  int    `json:"memories"`   // Number of observations in chunk
	Prompts   int    `json:"prompts"`    // Number of prompts in chunk
}

// ChunkData is the content of a single chunk file (JSONL entries).
type ChunkData struct {
	Sessions     []store.Session     `json:"sessions"`
	Observations []store.Observation `json:"observations"`
	Prompts      []store.Prompt      `json:"prompts"`
}

// SyncResult is returned after a sync operation.
type SyncResult struct {
	ChunkID              string `json:"chunk_id,omitempty"`
	SessionsExported     int    `json:"sessions_exported"`
	ObservationsExported int    `json:"observations_exported"`
	PromptsExported      int    `json:"prompts_exported"`
	IsEmpty              bool   `json:"is_empty"` // true if nothing new to sync
}

// ImportResult is returned after importing chunks.
type ImportResult struct {
	ChunksImported       int `json:"chunks_imported"`
	ChunksSkipped        int `json:"chunks_skipped"` // Already imported
	SessionsImported     int `json:"sessions_imported"`
	ObservationsImported int `json:"observations_imported"`
	PromptsImported      int `json:"prompts_imported"`
}

// ─── Syncer ──────────────────────────────────────────────────────────────────

// Syncer handles exporting and importing memory chunks.
type Syncer struct {
	store     *store.Store
	syncDir   string    // Path to .engram/ in the project repo (kept for backward compat)
	transport Transport // Pluggable I/O backend (filesystem, remote, etc.)
}

// New creates a Syncer with a FileTransport rooted at syncDir.
// This preserves the original constructor signature for backward compatibility.
func New(s *store.Store, syncDir string) *Syncer {
	return &Syncer{
		store:     s,
		syncDir:   syncDir,
		transport: NewFileTransport(syncDir),
	}
}

// NewLocal is an alias for New — creates a Syncer backed by the local filesystem.
// Preferred in call sites where the name makes the intent clearer.
func NewLocal(s *store.Store, syncDir string) *Syncer {
	return New(s, syncDir)
}

// NewWithTransport creates a Syncer with a custom Transport implementation.
// This is used for remote (cloud) sync where chunks travel over HTTP.
func NewWithTransport(s *store.Store, transport Transport) *Syncer {
	return &Syncer{
		store:     s,
		transport: transport,
	}
}

// ─── Export (DB → chunks) ────────────────────────────────────────────────────

// Export creates a new chunk with memories not yet in any chunk.
// It reads the manifest to know what's already exported, then creates
// a new chunk with only the new data.
func (sy *Syncer) Export(createdBy string, project string) (*SyncResult, error) {
	// Pre-flight: ensure the sync directory structure exists for filesystem transports.
	// This preserves the original error ordering where "create chunks dir" was the
	// first check in Export, before manifest reading.
	if sy.syncDir != "" {
		chunksDir := filepath.Join(sy.syncDir, "chunks")
		if err := os.MkdirAll(chunksDir, 0755); err != nil {
			return nil, fmt.Errorf("create chunks dir: %w", err)
		}
	}

	// Read current manifest (or create empty one)
	manifest, err := sy.readManifest()
	if err != nil {
		return nil, err
	}

	// Get known chunk IDs from the store's sync tracking
	knownChunks, err := storeGetSynced(sy.store)
	if err != nil {
		return nil, fmt.Errorf("get synced chunks: %w", err)
	}

	// Also consider chunks in the manifest as known
	for _, c := range manifest.Chunks {
		knownChunks[c.ID] = true
	}

	// Export all data from DB
	data, err := storeExportData(sy.store)
	if err != nil {
		return nil, fmt.Errorf("export data: %w", err)
	}

	// Filter by project if specified
	if project != "" {
		data = filterByProject(data, project)
	}

	// Get the timestamp of the last chunk to filter "new" data
	lastChunkTime := sy.lastChunkTime(manifest)

	// Filter to only new data (created after last chunk)
	chunk := sy.filterNewData(data, lastChunkTime)

	// Nothing new to export
	if len(chunk.Sessions) == 0 && len(chunk.Observations) == 0 && len(chunk.Prompts) == 0 {
		return &SyncResult{IsEmpty: true}, nil
	}

	// Serialize and compress the chunk
	chunkJSON, err := jsonMarshalChunk(chunk)
	if err != nil {
		return nil, fmt.Errorf("marshal chunk: %w", err)
	}

	// Generate chunk ID from content hash
	hash := sha256.Sum256(chunkJSON)
	chunkID := hex.EncodeToString(hash[:])[:8]

	// Check if this exact chunk already exists
	if _, exists := knownChunks[chunkID]; exists {
		return &SyncResult{IsEmpty: true}, nil
	}

	// Build manifest entry
	entry := ChunkEntry{
		ID:        chunkID,
		CreatedBy: createdBy,
		CreatedAt: time.Now().UTC().Format(time.RFC3339),
		Sessions:  len(chunk.Sessions),
		Memories:  len(chunk.Observations),
		Prompts:   len(chunk.Prompts),
	}

	// Write chunk via transport
	if err := sy.transport.WriteChunk(chunkID, chunkJSON, entry); err != nil {
		return nil, fmt.Errorf("write chunk: %w", err)
	}

	// Update manifest
	manifest.Chunks = append(manifest.Chunks, entry)

	if err := sy.writeManifest(manifest); err != nil {
		return nil, fmt.Errorf("write manifest: %w", err)
	}

	// Record this chunk as synced in the local DB
	if err := storeRecordSynced(sy.store, chunkID); err != nil {
		return nil, fmt.Errorf("record synced chunk: %w", err)
	}

	return &SyncResult{
		ChunkID:              chunkID,
		SessionsExported:     len(chunk.Sessions),
		ObservationsExported: len(chunk.Observations),
		PromptsExported:      len(chunk.Prompts),
	}, nil
}

// ─── Import (chunks → DB) ────────────────────────────────────────────────────

// Import reads the manifest and imports any chunks not yet in the local DB.
func (sy *Syncer) Import() (*ImportResult, error) {
	manifest, err := sy.readManifest()
	if err != nil {
		return nil, err
	}

	if len(manifest.Chunks) == 0 {
		return &ImportResult{}, nil
	}

	// Get chunks we've already imported
	knownChunks, err := storeGetSynced(sy.store)
	if err != nil {
		return nil, fmt.Errorf("get synced chunks: %w", err)
	}

	result := &ImportResult{}

	for _, entry := range manifest.Chunks {
		// Skip already-imported chunks
		if knownChunks[entry.ID] {
			result.ChunksSkipped++
			continue
		}

		// Read the chunk via transport
		chunkJSON, err := sy.transport.ReadChunk(entry.ID)
		if err != nil {
			// Chunk file missing — skip (maybe deleted or not yet pulled)
			result.ChunksSkipped++
			continue
		}

		var chunk ChunkData
		if err := json.Unmarshal(chunkJSON, &chunk); err != nil {
			return nil, fmt.Errorf("parse chunk %s: %w", entry.ID, err)
		}

		// Import into DB
		exportData := &store.ExportData{
			Version:      "0.1.0",

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"name: 'session_bootstrap'|name: 'session_resume'|name: 'session_health'|name: 'code_graph_query'|name: 'shared_memory_enable'|TOOL_DEFINITIONS\" .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
459:  name: 'shared_memory_enable',
639:  name: 'code_graph_query',
733:  name: 'session_health',
740:  name: 'session_resume',
755:  name: 'session_bootstrap',
878:export const TOOL_DEFINITIONS: ToolDefinition[] = [

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Layer Definitions
// ───────────────────────────────────────────────────────────────
// Feature catalog: 7-layer tool architecture metadata
// LIB: LAYER DEFINITIONS
// 7-Layer MCP Architecture with Token Budgets
// ───────────────────────────────────────────────────────────────
// 1. LAYER TYPES

// ───────────────────────────────────────────────────────────────
/** Individual layer definition in the 7-layer architecture */
export interface LayerDefinition {
  id: string;
  name: string;
  description: string;
  tokenBudget: number;
  priority: number;
  useCase: string;
  tools: string[];
}

/** Layer ID string literal union */
export type LayerId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

/** Task type for layer recommendations */
export type TaskType = 'search' | 'browse' | 'modify' | 'checkpoint' | 'analyze' | 'maintenance' | 'default';

/* ───────────────────────────────────────────────────────────────
   2. LAYER CONSTANTS

   REQ-020: Layered Tool Organization (L1-L7 structure)

   Design Principles:
   - Progressive disclosure: Start with high-level, drill down as needed
   - Token efficiency: Higher layers = fewer tokens, more targeted
   - Cognitive load: Reduce choices at each decision point
   ──────────────────────────────────────────────────────────────── */

/**
 * Defines the LAYER_DEFINITIONS constant.
 */
export const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition> = {
  L1: {
    id: 'L1',
    name: 'Orchestration',
    description: 'Unified entry points with intent-aware routing. Start here for most tasks.',
    tokenBudget: 3500,
    priority: 1,
    useCase: 'Default entry point for context retrieval. Automatically routes based on intent.',
    tools: ['memory_context', 'session_resume', 'session_bootstrap']
  },
  L2: {
    id: 'L2',
    name: 'Core',
    description: 'Primary memory operations. Use when you need specific search or save functionality.',
    tokenBudget: 3500,
    priority: 2,
    useCase: 'Direct access to search, save, and trigger matching when L1 routing is not needed.',
    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
  },
  L3: {
    id: 'L3',
    name: 'Discovery',
    description: 'Browse and explore the memory system. Use to understand what exists.',
    tokenBudget: 1000,
    priority: 3,
    useCase: 'Explore available memories, check system health, view statistics.',
    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
  },
  L4: {
    id: 'L4',
    name: 'Mutation',
    description: 'Modify existing memories. Use to update, delete, or validate memories.',
    tokenBudget: 1000,
    priority: 4,
    useCase: 'Make changes to existing memories when corrections or updates are needed.',
    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
  },
  L5: {
    id: 'L5',
    name: 'Lifecycle',
    description: 'Checkpoint and version management. Use for state preservation and recovery.',
    tokenBudget: 1000,
    priority: 5,
    useCase: 'Create checkpoints before major changes, restore previous states.',
    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
  },
  L6: {
    id: 'L6',
    name: 'Analysis',
    description: 'Deep inspection and causal analysis. Use to understand relationships and lineage.',
    tokenBudget: 1500,
    priority: 6,
    useCase: 'Trace decision history, understand memory relationships, measure learning.',
    tools: [
      'memory_drift_why',
      'memory_causal_link',
      'memory_causal_stats',
      'memory_causal_unlink',
      'task_preflight',
      'task_postflight',
      'eval_run_ablation',
      'eval_reporting_dashboard',
      'code_graph_query',
      'code_graph_context'
    ]
  },
  L7: {
    id: 'L7',
    name: 'Maintenance',
    description: 'System maintenance and bulk operations. Use for indexing and diagnostics.',
    tokenBudget: 1000,
    priority: 7,
    useCase: 'Re-index memories, view learning history, perform bulk operations.',
    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
  }
} as const;

/* ───────────────────────────────────────────────────────────────
   3. TOOL-TO-LAYER MAPPING

   Maps each tool to its layer for quick lookup.
   ──────────────────────────────────────────────────────────────── */

/**
 * Defines the TOOL_LAYER_MAP constant.
 */
export const TOOL_LAYER_MAP: Record<string, LayerId> = {} as Record<string, LayerId>;
for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
  for (const tool of layer.tools) {
    (TOOL_LAYER_MAP as Record<string, string>)[tool] = layerId;
  }
}

/* ───────────────────────────────────────────────────────────────
   4. LAYER PREFIX GENERATOR

   Generates description prefixes for tool descriptions.
   Format: "[L#:Name] Original description..."
   ──────────────────────────────────────────────────────────────── */

/**
 * Get the layer ID for a tool.
 */
export function getLayerForTool(toolName: string): LayerId | null {
  return TOOL_LAYER_MAP[toolName] ?? null;
}

/**
 * Get the layer prefix for a tool's description.
 * CHK-073: Tool descriptions include layer prefix.
 */
export function getLayerPrefix(toolName: string): string {
  const layerId = getLayerForTool(toolName);
  if (!layerId) return '';

  const layer = LAYER_DEFINITIONS[layerId];
  return `[${layerId}:${layer.name}]`;
}

/**
 * Enhance a tool description with layer information.
 * CHK-073: Adds layer prefix to description.
 */
export function enhanceDescription(toolName: string, description: string): string {
  const prefix = getLayerPrefix(toolName);
  if (!prefix) return description;

  return `${prefix} ${description}`;
}

/* ───────────────────────────────────────────────────────────────
   5. TOKEN BUDGET HELPERS

   CHK-072: Token budgets assigned per layer.
   ──────────────────────────────────────────────────────────────── */

/**
 * Get the token budget for a tool.
 */
export function getLayerTokenBudget(toolName: string): number {
  const layerId = getLayerForTool(toolName);
  if (!layerId) return 1000; // Default budget

  return LAYER_DEFINITIONS[layerId].tokenBudget;
}

/**
 * Get the token budget for a tool.
 */
export function getTokenBudget(toolName: string): number {
  return getLayerTokenBudget(toolName);
}

/**
 * Get layer information for a tool.
 */
export function getLayerInfo(toolName: string): LayerDefinition | null {
  const layerId = getLayerForTool(toolName);
  if (!layerId) return null;

  return { ...LAYER_DEFINITIONS[layerId] };
}

/**
 * Get all layers in priority order.
 */
export function getLayersByPriority(): LayerDefinition[] {
  return Object.values(LAYER_DEFINITIONS).sort((a, b) => a.priority - b.priority);
}

/**
 * Get layer usage guidance based on task.
 * CHK-074: Progressive disclosure from Orchestration to Analysis layers.
 */
export function getRecommendedLayers(taskType: TaskType): LayerId[] {
  const recommendations: Record<TaskType, LayerId[]> = {
    search: ['L1', 'L2'],
    browse: ['L3', 'L2'],
    modify: ['L4', 'L3'],

exec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
      channels: {
        type: 'array',
        items: { type: 'string', enum: ['vector', 'bm25', 'fts5', 'graph', 'trigger'] },
        description: 'Channels to ablate (default: all channels).'
      },
      queries: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional custom query set for k_sensitivity mode.'
      },
      groundTruthQueryIds: {
        type: 'array',
        items: { type: 'number', minimum: 1 },
        description: 'Optional subset of ground truth query IDs to evaluate.'
      },
      recallK: { type: 'number', minimum: 1, maximum: 100, description: 'Recall cutoff K (default: 20).' },
      storeResults: { type: 'boolean', default: true, description: 'Persist ablation metrics to eval_metric_snapshots (default: true).' },
      includeFormattedReport: { type: 'boolean', default: true, description: 'Include human-readable markdown report in response (default: true).' },
    },
    required: [],
  },
};

const evalReportingDashboard: ToolDefinition = {
  name: 'eval_reporting_dashboard',
  description: '[L6:Analysis] Generate R13-S3 reporting dashboard output with sprint/channel trend aggregation from eval DB metrics. Token Budget: 1200.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      sprintFilter: { type: 'array', items: { type: 'string' }, description: 'Optional sprint label filters.' },
      channelFilter: { type: 'array', items: { type: 'string' }, description: 'Optional channel filters.' },
      metricFilter: { type: 'array', items: { type: 'string' }, description: 'Optional metric-name filters.' },
      limit: { type: 'number', minimum: 1, maximum: 200, description: 'Maximum sprint groups to return (most recent).' },
      format: { type: 'string', enum: ['text', 'json'], default: 'text', description: 'Formatted report payload type.' },
    },
    required: [],
  },
};

// L7: Maintenance - Indexing and system operations (Token Budget: 1000)
const memoryIndexScan: ToolDefinition = {
  name: 'memory_index_scan',
  description: '[L7:Maintenance] Scan workspace for new/changed memory files and index them. Useful for bulk indexing after creating multiple memory files. Token Budget: 1000.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', description: 'Limit scan to specific spec folder (e.g., "005-memory")' }, force: { type: 'boolean', default: false, description: 'Force re-index all files (ignore content hash)' }, includeConstitutional: { type: 'boolean', default: true, description: 'Whether to scan .opencode/skill/*/constitutional/ directories' }, includeSpecDocs: { type: 'boolean', default: true, description: 'Whether to scan .opencode/specs/ directories for spec folder documents (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, handover.md). Iteration artifacts under research/iterations/ and review/iterations/ are excluded from spec-doc indexing. Set SPECKIT_INDEX_SPEC_DOCS=false env var to disable globally.' }, incremental: { type: 'boolean', default: true, description: 'Enable incremental indexing. When true (default), skips files whose mtime and content hash are unchanged since last index. Set to false to re-evaluate all files regardless of change detection.' } }, required: [] },
};

const memoryGetLearningHistory: ToolDefinition = {
  name: 'memory_get_learning_history',
  description: '[L7:Maintenance] Get learning history (PREFLIGHT/POSTFLIGHT records) for a spec folder. Shows knowledge improvement deltas and Learning Index trends. Use to analyze learning patterns across tasks within a spec. Token Budget: 1000.',
  inputSchema: { type: 'object', additionalProperties: false, properties: { specFolder: { type: 'string', minLength: 1, description: 'Spec folder path to get learning history for (required)' }, sessionId: { type: 'string', description: 'Filter by session ID (optional)' }, limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum records to return (default: 10, max: 100)' }, onlyComplete: { type: 'boolean', default: false, description: 'Only return records with both PREFLIGHT and POSTFLIGHT (complete learning cycles)' }, includeSummary: { type: 'boolean', default: true, description: 'Include summary statistics (averages, trends) in response' } }, required: ['specFolder'] },
};

const memoryIngestStart: ToolDefinition = {
  name: 'memory_ingest_start',
  description: '[L7:Maintenance] Start an async ingestion job for multiple markdown files. Returns immediately with a jobId, while files are processed sequentially in the background.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      paths: {
        type: 'array',
        items: { type: 'string', minLength: 1 },
        minItems: 1,
        maxItems: MAX_INGEST_PATHS,
        description: `Absolute file paths to ingest (required, at least one, max ${MAX_INGEST_PATHS}).`,
      },
      specFolder: {
        type: 'string',
        description: 'Optional spec folder label attached to the ingest job.',
      },
    },
    required: ['paths'],
  },
};

const memoryIngestStatus: ToolDefinition = {
  name: 'memory_ingest_status',
  description: '[L7:Maintenance] Get current state and progress for an async ingestion job.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      jobId: { type: 'string', minLength: 1, description: 'Ingestion job identifier (required).' },
    },
    required: ['jobId'],
  },
};

const memoryIngestCancel: ToolDefinition = {
  name: 'memory_ingest_cancel',
  description: '[L7:Maintenance] Cancel a running async ingestion job. Cancellation is checked between files.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      jobId: { type: 'string', minLength: 1, description: 'Ingestion job identifier (required).' },
    },
    required: ['jobId'],
  },
};

// Code Graph - Structural code analysis tools
const codeGraphScan: ToolDefinition = {
  name: 'code_graph_scan',
  description: '[L7:Maintenance] Scan workspace files and build structural code graph index (functions, classes, imports, calls). Supports incremental re-indexing via content hash. Token Budget: 1000.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      rootDir: { type: 'string', description: 'Root directory to scan (default: workspace root)' },
      includeGlobs: { type: 'array', items: { type: 'string' }, description: 'Glob patterns for files to include' },
      excludeGlobs: { type: 'array', items: { type: 'string' }, description: 'Additional glob patterns to exclude' },
      incremental: { type: 'boolean', default: true, description: 'Skip unchanged files (default: true)' },
    },
    required: [],
  },
};

const codeGraphQuery: ToolDefinition = {
  name: 'code_graph_query',
  description: '[L6:Analysis] Query structural relationships: outline (file symbols), calls_from/calls_to (call graph), imports_from/imports_to (dependency graph), and blast_radius (reverse import impact). Use INSTEAD of Grep for structural queries (callers, imports, dependencies). Supports includeTransitive for multi-hop BFS traversal. Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      operation: { type: 'string', enum: ['outline', 'calls_from', 'calls_to', 'imports_from', 'imports_to', 'blast_radius'], description: 'Query operation (required)' },
      subject: { type: 'string', minLength: 1, description: 'File path, symbol name, or symbolId to query (required)' },
      subjects: { type: 'array', items: { type: 'string' }, description: 'Optional additional file paths or symbols for blast-radius union mode' },
      edgeType: { type: 'string', description: 'Filter by edge type (optional)' },
      limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Max results' },
      includeTransitive: { type: 'boolean', default: false, description: 'Enable multi-hop BFS traversal (follows edges transitively)' },
      maxDepth: { type: 'number', minimum: 1, maximum: 10, default: 3, description: 'Max traversal depth when includeTransitive is true' },
    },
    required: ['operation', 'subject'],
  },
};

const codeGraphStatus: ToolDefinition = {
  name: 'code_graph_status',
  description: '[L7:Maintenance] Report code graph index health: file count, node/edge counts by type, parse health summary, last scan timestamp, DB file size, schema version. Token Budget: 500.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

const codeGraphContext: ToolDefinition = {
  name: 'code_graph_context',
  description: '[L6:Analysis] Get LLM-oriented compact graph neighborhoods. Accepts CocoIndex search results as seeds — use CocoIndex (mcp__cocoindex_code__search) for semantic search first, then pass results here for structural expansion. Supports manual seeds (provider: manual) and graph seeds (provider: graph). Modes: neighborhood (1-hop calls+imports), outline (file symbols), impact (reverse callers). Token Budget: 1200.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      input: { type: 'string', description: 'Natural language context query' },
      queryMode: { type: 'string', enum: ['neighborhood', 'outline', 'impact'], default: 'neighborhood', description: 'Graph expansion mode' },
      subject: { type: 'string', description: 'Symbol name, fqName, or symbolId' },
      seeds: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filePath: { type: 'string' },
            startLine: { type: 'number' },
            endLine: { type: 'number' },
            query: { type: 'string' },
            provider: { type: 'string', enum: ['cocoindex', 'manual', 'graph'], description: 'Seed provider type' },
            file: { type: 'string', description: 'CocoIndex file path (provider: cocoindex)' },
            range: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: 'CocoIndex line range' },
            score: { type: 'number', description: 'CocoIndex relevance score' },
            symbolName: { type: 'string', description: 'Manual seed symbol name' },
            symbolId: { type: 'string', description: 'Graph seed symbol ID' },
          },
        },
        description: 'Seeds from CocoIndex, manual input, or graph lookups',
      },
      budgetTokens: { type: 'number', minimum: 100, maximum: 4000, default: 1200, description: 'Token budget for response' },
      profile: { type: 'string', enum: ['quick', 'research', 'debug'], description: 'Output density profile' },
      includeTrace: { type: 'boolean', description: 'Include trace metadata in response for debugging' },
    },
    required: [],
  },
};

const cccStatus: ToolDefinition = {
  name: 'ccc_status',
  description: '[L7:Maintenance] Check CocoIndex availability, binary path, and index status.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

const cccReindex: ToolDefinition = {
  name: 'ccc_reindex',
  description: '[L7:Maintenance] Trigger CocoIndex incremental (or full) re-indexing of the workspace.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      full: { type: 'boolean', default: false, description: 'Full re-index (slower) vs incremental' },
    },
    required: [],
  },
};

const cccFeedback: ToolDefinition = {
  name: 'ccc_feedback',
  description: '[L7:Maintenance] Submit quality feedback on CocoIndex search results to improve future searches.',
  inputSchema: {
    type: 'object', additionalProperties: false,
    properties: {
      query: { type: 'string', description: 'The search query that was executed' },
      resultFile: { type: 'string', description: 'File path from the result being rated' },
      rating: { type: 'string', enum: ['helpful', 'not_helpful', 'partial'], description: 'Quality rating' },
      comment: { type: 'string', description: 'Optional free-form feedback' },
    },
    required: ['query', 'rating'],
  },
};

// T018: Session health diagnostic tool
const sessionHealth: ToolDefinition = {
  name: 'session_health',
  description: '[L3:Discovery] Check session readiness: priming status, code graph freshness, time since last tool call. Call periodically during long sessions to check for context drift. Returns ok/warning/stale with actionable hints. No arguments required.',
  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
};

// Phase 020: Composite session resume tool
const sessionResume: ToolDefinition = {
  name: 'session_resume',
  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
    },
    required: [],
  },
};

// Phase 024 / Item 7: Composite session bootstrap tool
const sessionBootstrap: ToolDefinition = {
  name: 'session_bootstrap',
  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/context-server.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Context Server
// ───────────────────────────────────────────────────────────────
// T303: Decomposed — tool schemas in tool-schemas.ts, dispatch
// Logic in tools/*.ts. This file retains server init, startup,
// Shutdown, and main orchestration only.
import fs from 'fs';
import path from 'path';

/* ───────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

// MCP SDK
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Core modules
import {
  DEFAULT_BASE_PATH,
  ALLOWED_BASE_PATHS,
  DATABASE_PATH,
  checkDatabaseUpdated,
  setEmbeddingModelReady, waitForEmbeddingModel,
  init as initDbState
} from './core/index.js';

// T303: Tool schemas and dispatch
import { TOOL_DEFINITIONS } from './tool-schemas.js';
import { dispatchTool } from './tools/index.js';

// Handler modules (only indexSingleFile needed directly for startup scan)
import {
  indexSingleFile,
  handleMemoryStats,
} from './handlers/index.js';
import * as memoryIndexDiscovery from './handlers/memory-index-discovery.js';
import { runPostMutationHooks } from './handlers/mutation-hooks.js';

// Utils
import { validateInputLengths } from './utils/index.js';

// History (audit trail for file-watcher deletes)
import { recordHistory } from './lib/storage/history.js';
import * as historyStore from './lib/storage/history.js';

// Hooks
import {
  MEMORY_AWARE_TOOLS,
  extractContextHint,
  autoSurfaceMemories,
  autoSurfaceAtToolDispatch,
  autoSurfaceAtCompaction,
  appendAutoSurfaceHints,
  syncEnvelopeTokenCount,
  serializeEnvelopeWithTokenCount,
  recordToolCall,
} from './hooks/index.js';
import { primeSessionIfNeeded } from './hooks/memory-surface.js';

// Architecture
import { getTokenBudget } from './lib/architecture/layer-definitions.js';
import { createMCPErrorResponse, wrapForMCP } from './lib/response/envelope.js';

// T303: Startup checks (extracted from this file)
import { detectNodeVersionMismatch, checkSqliteVersion } from './startup-checks.js';
import {
  getStartupEmbeddingDimension,
  resolveStartupEmbeddingConfig,
  validateConfiguredEmbeddingsProvider,
} from '@spec-kit/shared/embeddings/factory';

// Lib modules (for initialization only)
import * as vectorIndex from './lib/search/vector-index.js';
import * as _embeddings from './lib/providers/embeddings.js';
import * as checkpointsLib from './lib/storage/checkpoints.js';
import * as accessTracker from './lib/storage/access-tracker.js';
import { runLineageBackfill } from './lib/storage/lineage-state.js';
import * as hybridSearch from './lib/search/hybrid-search.js';
import { createUnifiedGraphSearchFn } from './lib/search/graph-search-fn.js';
import { isGraphUnifiedEnabled } from './lib/search/graph-flags.js';
import * as graphDb from './lib/code-graph/code-graph-db.js';
import { detectRuntime, type RuntimeInfo } from './lib/code-graph/runtime-detection.js';
import * as sessionBoost from './lib/search/session-boost.js';
import * as causalBoost from './lib/search/causal-boost.js';
import * as bm25Index from './lib/search/bm25-index.js';
import * as memoryParser from './lib/parsing/memory-parser.js';
import { getSpecsBasePaths } from './lib/search/folder-discovery.js';
import {
  registerGlobalRefreshFn,
  getDirtyNodes,
  clearDirtyNodes,
  recomputeLocal,
} from './lib/search/graph-lifecycle.js';
import {
  isDegreeBoostEnabled,
  isDynamicInitEnabled,
  isFileWatcherEnabled,
} from './lib/search/search-flags.js';
import { runCleanupStep, runAsyncCleanupStep } from './lib/utils/cleanup-helpers.js';
import { disposeLocalReranker } from './lib/search/local-reranker.js';
import * as workingMemory from './lib/cognitive/working-memory.js';
import * as attentionDecay from './lib/cognitive/attention-decay.js';
import * as coActivation from './lib/cognitive/co-activation.js';
import { initScoringObservability } from './lib/telemetry/scoring-observability.js';
// T059: Archival manager for automatic archival of ARCHIVED state memories
import * as archivalManager from './lib/cognitive/archival-manager.js';
// T099: Retry manager for background embedding retry job (REQ-031, CHK-179)
import * as retryManager from './lib/providers/retry-manager.js';
import { buildErrorResponse, getDefaultErrorCodeForTool, getRecoveryHint } from './lib/errors.js';
// T001-T004: Session deduplication
import * as sessionManager from './lib/session/session-manager.js';
import * as shadowEvaluationRuntime from './lib/feedback/shadow-evaluation-runtime.js';
// Phase 023: Context metrics — lightweight session quality tracking
import { recordMetricEvent } from './lib/session/context-metrics.js';

// P4-12/P4-19: Incremental index (passed to db-state for stale handle refresh)
import * as incrementalIndex from './lib/storage/incremental-index.js';
// T107: Transaction manager for pending file recovery on startup (REQ-033)
import * as transactionManager from './lib/storage/transaction-manager.js';
// KL-4: Tool cache cleanup on shutdown
import * as toolCache from './lib/cache/tool-cache.js';
import { initExtractionAdapter } from './lib/extraction/extraction-adapter.js';
import { migrateLearnedTriggers, verifyFts5Isolation } from './lib/storage/learned-triggers-schema.js';
import { isLearnedFeedbackEnabled } from './lib/search/learned-feedback.js';
import { initIngestJobQueue } from './lib/ops/job-queue.js';
import { startFileWatcher, type FSWatcher } from './lib/ops/file-watcher.js';
import { getCanonicalPathKey } from './lib/utils/canonical-path.js';
import { runBatchLearning } from './lib/feedback/batch-learning.js';
import { getSessionSnapshot } from './lib/session/session-snapshot.js';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface IndexResult {
  status: string;
  error?: string;
  [key: string]: unknown;
}

interface PendingRecoveryResult {
  found: number;
  processed: number;
  recovered: number;
  failed: number;
  results: unknown[];
}

interface ApiKeyValidation {
  valid: boolean;
  provider?: string;
  error?: string;
  errorCode?: string;
  warning?: string;
  actions?: string[];
  networkError?: boolean;
}

interface AutoSurfaceResult {
  constitutional: unknown[];
  triggered: unknown[];
  codeGraphStatus?: {
    status: 'ok' | 'error';
    data?: Record<string, unknown>;
    error?: string;
  };
  sessionPrimed?: boolean;
  primedTool?: string;
  /** T018: Structured Prime Package for non-hook CLI auto-priming */
  primePackage?: {
    specFolder: string | null;
    currentTask: string | null;
    codeGraphStatus: 'fresh' | 'stale' | 'empty';
    cocoIndexAvailable: boolean;
    recommendedCalls: string[];
  };
  surfaced_at?: string;
  latencyMs?: number;
}

interface ToolCallResponse {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
  structuredContent?: unknown;
  [key: string]: unknown;
}

interface DynamicMemoryStats {
  totalMemories: number;
  specFolderCount: number;
  activeCount: number;
  staleCount: number;
}

type AfterToolCallback = (tool: string, callId: string, result: unknown) => Promise<void>;

const afterToolCallbacks: Array<AfterToolCallback> = [];

/** Timeout (ms) for waiting on embedding model readiness during startup scan. */
const EMBEDDING_MODEL_TIMEOUT_MS = 30_000;

/** Timeout (ms) for API key validation during startup. */
const API_KEY_VALIDATION_TIMEOUT_MS = 5_000;

const GRAPH_ENRICHMENT_TIMEOUT_MS = 250;
const GRAPH_ENRICHMENT_OUTLINE_LIMIT = 6;
const GRAPH_ENRICHMENT_NEIGHBOR_LIMIT = 6;
const GRAPH_ENRICHMENT_SYMBOL_LIMIT = 4;
const GRAPH_CONTEXT_EXCLUDED_TOOLS = new Set<string>([
  ...MEMORY_AWARE_TOOLS,
  'code_graph_query',
  'code_graph_context',
  'code_graph_scan',
  'code_graph_status',
]);

interface GraphContextNeighborSummary {
  filePath: string;
  relationTypes: string[];
  symbols: Array<{
    name: string;
    kind: string;
    line: number;
    direction: 'incoming' | 'outgoing';
    relation: string;
  }>;
}

interface GraphContextFileSummary {
  filePath: string;
  outline: Array<{
    name: string;
    kind: string;
    line: number;
  }>;
  neighbors: GraphContextNeighborSummary[];
}

interface DispatchGraphContextMeta {
  status: 'ok' | 'timeout' | 'unavailable';
  source: 'tool-dispatch';
  fileCount: number;
  filePaths: string[];
  latencyMs: number;
  files?: GraphContextFileSummary[];
  error?: string;
}

export interface StructuralRoutingNudge {
  advisory: true;
  readiness: 'ready';
  preferredTool: 'code_graph_query';
  secondaryTool: 'code_graph_context';
  message: string;
  preservesAuthority: 'session_bootstrap';
  surface: 'response-hints' | 'session-bootstrap' | 'memory-context';
}


codex
The interesting pattern emerging is that Engram’s “surface area design” lives in three places at once: MCP registration, transport adapters, and per-agent setup text. I’m pinning exact line references now so the final pass can distinguish durable API patterns from duplication we probably should not copy.
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '220,640p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	FORMAT for content — use this structured format:
   221	  **What**: [concise description of what was done]
   222	  **Why**: [the reasoning, user request, or problem that drove it]
   223	  **Where**: [files/paths affected, e.g. src/auth/middleware.ts, internal/store/store.go]
   224	  **Learned**: [any gotchas, edge cases, or decisions made — omit if none]
   225	
   226	TITLE should be short and searchable, like: "JWT auth middleware", "FTS5 query sanitization", "Fixed N+1 in user list"
   227	
   228	Examples:
   229	  title: "Switched from sessions to JWT"
   230	  type: "decision"
   231	  content: "**What**: Replaced express-session with jsonwebtoken for auth\n**Why**: Session storage doesn't scale across multiple instances\n**Where**: src/middleware/auth.ts, src/routes/login.ts\n**Learned**: Must set httpOnly and secure flags on the cookie, refresh tokens need separate rotation logic"
   232	
   233	  title: "Fixed FTS5 syntax error on special chars"
   234	  type: "bugfix"
   235	  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
   236					mcp.WithString("title",
   237						mcp.Required(),
   238						mcp.Description("Short, searchable title (e.g. 'JWT auth middleware', 'Fixed N+1 query')"),
   239					),
   240					mcp.WithString("content",
   241						mcp.Required(),
   242						mcp.Description("Structured content using **What**, **Why**, **Where**, **Learned** format"),
   243					),
   244					mcp.WithString("type",
   245						mcp.Description("Category: decision, architecture, bugfix, pattern, config, discovery, learning (default: manual)"),
   246					),
   247					mcp.WithString("session_id",
   248						mcp.Description("Session ID to associate with (default: manual-save-{project})"),
   249					),
   250					mcp.WithString("project",
   251						mcp.Description("Project name"),
   252					),
   253					mcp.WithString("scope",
   254						mcp.Description("Scope for this observation: project (default) or personal"),
   255					),
   256					mcp.WithString("topic_key",
   257						mcp.Description("Optional topic identifier for upserts (e.g. architecture/auth-model). Reuses and updates the latest observation in same project+scope."),
   258					),
   259				),
   260				handleSave(s, cfg),
   261			)
   262		}
   263	
   264		// ─── mem_update (profile: agent, deferred) ──────────────────────────
   265		if shouldRegister("mem_update", allowlist) {
   266			srv.AddTool(
   267				mcp.NewTool("mem_update",
   268					mcp.WithDescription("Update an existing observation by ID. Only provided fields are changed."),
   269					mcp.WithDeferLoading(true),
   270					mcp.WithTitleAnnotation("Update Memory"),
   271					mcp.WithReadOnlyHintAnnotation(false),
   272					mcp.WithDestructiveHintAnnotation(false),
   273					mcp.WithIdempotentHintAnnotation(false),
   274					mcp.WithOpenWorldHintAnnotation(false),
   275					mcp.WithNumber("id",
   276						mcp.Required(),
   277						mcp.Description("Observation ID to update"),
   278					),
   279					mcp.WithString("title",
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
   421					mcp.WithTitleAnnotation("Memory Timeline"),
   422					mcp.WithReadOnlyHintAnnotation(true),
   423					mcp.WithDestructiveHintAnnotation(false),
   424					mcp.WithIdempotentHintAnnotation(true),
   425					mcp.WithOpenWorldHintAnnotation(false),
   426					mcp.WithNumber("observation_id",
   427						mcp.Required(),
   428						mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
   429					),
   430					mcp.WithNumber("before",
   431						mcp.Description("Number of observations to show before the focus (default: 5)"),
   432					),
   433					mcp.WithNumber("after",
   434						mcp.Description("Number of observations to show after the focus (default: 5)"),
   435					),
   436				),
   437				handleTimeline(s),
   438			)
   439		}
   440	
   441		// ─── mem_get_observation (profile: agent, eager) ────────────────────
   442		if shouldRegister("mem_get_observation", allowlist) {
   443			srv.AddTool(
   444				mcp.NewTool("mem_get_observation",
   445					mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
   446					mcp.WithTitleAnnotation("Get Observation"),
   447					mcp.WithReadOnlyHintAnnotation(true),
   448					mcp.WithDestructiveHintAnnotation(false),
   449					mcp.WithIdempotentHintAnnotation(true),
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go | sed -n '1,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Engram — Persistent memory for AI coding agents.
     2	//
     3	// Usage:
     4	//
     5	//	engram serve          Start HTTP + MCP server
     6	//	engram mcp            Start MCP server only (stdio transport)
     7	//	engram search <query> Search memories from CLI
     8	//	engram save           Save a memory from CLI
     9	//	engram context        Show recent context
    10	//	engram stats          Show memory stats
    11	package main
    12	
    13	import (
    14		"bufio"
    15		"context"
    16		"encoding/json"
    17		"fmt"
    18		"log"
    19		"os"
    20		"os/signal"
    21		"path/filepath"
    22		"runtime/debug"
    23		"sort"
    24		"strconv"
    25		"strings"
    26		"syscall"
    27		"time"
    28	
    29		"github.com/Gentleman-Programming/engram/internal/mcp"
    30		"github.com/Gentleman-Programming/engram/internal/obsidian"
    31		"github.com/Gentleman-Programming/engram/internal/project"
    32		"github.com/Gentleman-Programming/engram/internal/server"
    33		"github.com/Gentleman-Programming/engram/internal/setup"
    34		"github.com/Gentleman-Programming/engram/internal/store"
    35		engramsync "github.com/Gentleman-Programming/engram/internal/sync"
    36		"github.com/Gentleman-Programming/engram/internal/tui"
    37		versioncheck "github.com/Gentleman-Programming/engram/internal/version"
    38	
    39		tea "github.com/charmbracelet/bubbletea"
    40		mcpserver "github.com/mark3labs/mcp-go/server"
    41	)
    42	
    43	// version is set via ldflags at build time by goreleaser.
    44	// Falls back to "dev" for local builds; init() tries Go module info first.
    45	var version = "dev"
    46	
    47	func init() {
    48		if version != "dev" {
    49			return
    50		}
    51		if info, ok := debug.ReadBuildInfo(); ok && info.Main.Version != "" && info.Main.Version != "(devel)" {
    52			version = strings.TrimPrefix(info.Main.Version, "v")
    53		}
    54	}
    55	
    56	var (
    57		storeNew      = store.New
    58		newHTTPServer = server.New
    59		startHTTP     = (*server.Server).Start
    60	
    61		newMCPServer           = mcp.NewServer
    62		newMCPServerWithTools  = mcp.NewServerWithTools
    63		newMCPServerWithConfig = mcp.NewServerWithConfig
    64		resolveMCPTools        = mcp.ResolveTools
    65		serveMCP               = mcpserver.ServeStdio
    66	
    67		// detectProject is injectable for testing; wraps project.DetectProject.
    68		detectProject = project.DetectProject
    69	
    70		newTUIModel   = func(s *store.Store) tui.Model { return tui.New(s, version) }
    71		newTeaProgram = tea.NewProgram
    72		runTeaProgram = (*tea.Program).Run
    73	
    74		checkForUpdates = versioncheck.CheckLatest
    75	
    76		setupSupportedAgents        = setup.SupportedAgents
    77		setupInstallAgent           = setup.Install
    78		setupAddClaudeCodeAllowlist = setup.AddClaudeCodeAllowlist
    79		scanInputLine               = fmt.Scanln
    80	
    81		storeSearch = func(s *store.Store, query string, opts store.SearchOptions) ([]store.SearchResult, error) {
    82			return s.Search(query, opts)
    83		}
    84		storeAddObservation = func(s *store.Store, p store.AddObservationParams) (int64, error) { return s.AddObservation(p) }
    85		storeTimeline       = func(s *store.Store, observationID int64, before, after int) (*store.TimelineResult, error) {
    86			return s.Timeline(observationID, before, after)
    87		}
    88		storeFormatContext = func(s *store.Store, project, scope string) (string, error) { return s.FormatContext(project, scope) }
    89		storeStats         = func(s *store.Store) (*store.Stats, error) { return s.Stats() }
    90		storeExport        = func(s *store.Store) (*store.ExportData, error) { return s.Export() }
    91		jsonMarshalIndent  = json.MarshalIndent
    92	
    93		syncStatus = func(sy *engramsync.Syncer) (localChunks int, remoteChunks int, pendingImport int, err error) {
    94			return sy.Status()
    95		}
    96		syncImport = func(sy *engramsync.Syncer) (*engramsync.ImportResult, error) { return sy.Import() }
    97		syncExport = func(sy *engramsync.Syncer, createdBy, project string) (*engramsync.SyncResult, error) {
    98			return sy.Export(createdBy, project)
    99		}
   100	
   101		exitFunc = os.Exit
   102	
   103		stdinScanner = func() *bufio.Scanner { return bufio.NewScanner(os.Stdin) }
   104		userHomeDir  = os.UserHomeDir
   105	
   106		// newObsidianExporter is injectable for testing.
   107		newObsidianExporter = obsidian.NewExporter
   108	
   109		// newObsidianWatcher is injectable for testing.
   110		newObsidianWatcher = obsidian.NewWatcher
   111	)
   112	
   113	func main() {
   114		if len(os.Args) < 2 {
   115			printUsage()
   116			exitFunc(1)
   117		}
   118	
   119		// Check for updates on every invocation.
   120		if result := checkForUpdates(version); result.Status != versioncheck.StatusUpToDate && result.Message != "" {
   121			fmt.Fprintln(os.Stderr, result.Message)
   122			fmt.Fprintln(os.Stderr)
   123		}
   124	
   125		cfg, cfgErr := store.DefaultConfig()
   126		if cfgErr != nil {
   127			// Fallback: try to resolve home directory from environment variables
   128			// that os.UserHomeDir() might have missed (e.g. MCP subprocesses on
   129			// Windows where %USERPROFILE% is not propagated).
   130			if home := resolveHomeFallback(); home != "" {
   131				log.Printf("[engram] UserHomeDir failed, using fallback: %s", home)
   132				cfg = store.FallbackConfig(filepath.Join(home, ".engram"))
   133			} else {
   134				fatal(cfgErr)
   135			}
   136		}
   137	
   138		// Allow overriding data dir via env
   139		if dir := os.Getenv("ENGRAM_DATA_DIR"); dir != "" {
   140			cfg.DataDir = dir
   141		}
   142	
   143		// Migrate orphaned databases that ended up in wrong locations
   144		// (e.g. drive root on Windows due to previous bug).
   145		migrateOrphanedDB(cfg.DataDir)
   146	
   147		switch os.Args[1] {
   148		case "serve":
   149			cmdServe(cfg)
   150		case "mcp":
   151			cmdMCP(cfg)
   152		case "tui":
   153			cmdTUI(cfg)
   154		case "search":
   155			cmdSearch(cfg)
   156		case "save":
   157			cmdSave(cfg)
   158		case "timeline":
   159			cmdTimeline(cfg)
   160		case "context":
   161			cmdContext(cfg)
   162		case "stats":
   163			cmdStats(cfg)
   164		case "export":
   165			cmdExport(cfg)
   166		case "import":
   167			cmdImport(cfg)
   168		case "sync":
   169			cmdSync(cfg)
   170		case "obsidian-export":
   171			cmdObsidianExport(cfg)
   172		case "projects":
   173			cmdProjects(cfg)
   174		case "setup":
   175			cmdSetup()
   176		case "version", "--version", "-v":
   177			fmt.Printf("engram %s\n", version)
   178		case "help", "--help", "-h":
   179			printUsage()
   180		default:
   181			fmt.Fprintf(os.Stderr, "unknown command: %s\n\n", os.Args[1])
   182			printUsage()
   183			exitFunc(1)
   184		}
   185	}
   186	
   187	// ─── Commands ────────────────────────────────────────────────────────────────
   188	
   189	func cmdServe(cfg store.Config) {
   190		port := 7437 // "ENGR" on phone keypad vibes
   191		if p := os.Getenv("ENGRAM_PORT"); p != "" {
   192			if n, err := strconv.Atoi(p); err == nil {
   193				port = n
   194			}
   195		}
   196		// Allow: engram serve 8080
   197		if len(os.Args) > 2 {
   198			if n, err := strconv.Atoi(os.Args[2]); err == nil {
   199				port = n
   200			}
   201		}
   202	
   203		s, err := storeNew(cfg)
   204		if err != nil {
   205			fatal(err)
   206		}
   207		defer s.Close()
   208	
   209		srv := newHTTPServer(s, port)
   210	
   211		// Graceful shutdown on SIGINT/SIGTERM.
   212		sigCh := make(chan os.Signal, 1)
   213		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
   214		go func() {
   215			<-sigCh
   216			log.Println("[engram] shutting down...")
   217			exitFunc(0)
   218		}()
   219	
   220		if err := startHTTP(srv); err != nil {
   221			fatal(err)
   222		}
   223	}
   224	
   225	func cmdMCP(cfg store.Config) {
   226		// Parse --tools and --project flags
   227		toolsFilter := ""
   228		projectOverride := ""
   229		for i := 2; i < len(os.Args); i++ {
   230			if strings.HasPrefix(os.Args[i], "--tools=") {
   231				toolsFilter = strings.TrimPrefix(os.Args[i], "--tools=")
   232			} else if os.Args[i] == "--tools" && i+1 < len(os.Args) {
   233				toolsFilter = os.Args[i+1]
   234				i++
   235			} else if strings.HasPrefix(os.Args[i], "--project=") {
   236				projectOverride = strings.TrimPrefix(os.Args[i], "--project=")
   237			} else if os.Args[i] == "--project" && i+1 < len(os.Args) {
   238				projectOverride = os.Args[i+1]
   239				i++
   240			}
   241		}
   242	
   243		// Project detection chain: --project flag → ENGRAM_PROJECT env → git detection
   244		detectedProject := projectOverride
   245		if detectedProject == "" {
   246			detectedProject = os.Getenv("ENGRAM_PROJECT")
   247		}
   248		if detectedProject == "" {
   249			if cwd, err := os.Getwd(); err == nil {
   250				detectedProject = detectProject(cwd)
   251			}
   252		}
   253		// Always normalize (lowercase + trim)
   254		detectedProject, _ = store.NormalizeProject(detectedProject)
   255	
   256		s, err := storeNew(cfg)
   257		if err != nil {
   258			fatal(err)
   259		}
   260		defer s.Close()
   261	
   262		mcpCfg := mcp.MCPConfig{
   263			DefaultProject: detectedProject,
   264		}
   265	
   266		allowlist := resolveMCPTools(toolsFilter)
   267		mcpSrv := newMCPServerWithConfig(s, mcpCfg, allowlist)
   268	
   269		if err := serveMCP(mcpSrv); err != nil {
   270			fatal(err)
   271		}
   272	}
   273	
   274	func cmdTUI(cfg store.Config) {
   275		s, err := storeNew(cfg)
   276		if err != nil {
   277			fatal(err)
   278		}
   279		defer s.Close()
   280	
   281		model := newTUIModel(s)
   282		p := newTeaProgram(model)
   283		if _, err := runTeaProgram(p); err != nil {
   284			fatal(err)
   285		}
   286	}
   287	
   288	func cmdSearch(cfg store.Config) {
   289		if len(os.Args) < 3 {
   290			fmt.Fprintln(os.Stderr, "usage: engram search <query> [--type TYPE] [--project PROJECT] [--scope SCOPE] [--limit N]")
   291			exitFunc(1)
   292		}
   293	
   294		// Collect the query (everything that's not a flag)
   295		var queryParts []string
   296		opts := store.SearchOptions{Limit: 10}
   297	
   298		for i := 2; i < len(os.Args); i++ {
   299			switch os.Args[i] {
   300			case "--type":
   301				if i+1 < len(os.Args) {
   302					opts.Type = os.Args[i+1]
   303					i++
   304				}
   305			case "--project":
   306				if i+1 < len(os.Args) {
   307					opts.Project = os.Args[i+1]
   308					i++
   309				}
   310			case "--limit":
   311				if i+1 < len(os.Args) {
   312					if n, err := strconv.Atoi(os.Args[i+1]); err == nil {
   313						opts.Limit = n
   314					}
   315					i++
   316				}
   317			case "--scope":
   318				if i+1 < len(os.Args) {
   319					opts.Scope = os.Args[i+1]
   320					i++
   321				}
   322			default:
   323				queryParts = append(queryParts, os.Args[i])
   324			}
   325		}
   326	
   327		query := strings.Join(queryParts, " ")
   328		if query == "" {
   329			fmt.Fprintln(os.Stderr, "error: search query is required")
   330			exitFunc(1)
   331		}
   332	
   333		s, err := storeNew(cfg)
   334		if err != nil {
   335			fatal(err)
   336			return
   337		}
   338		defer s.Close()
   339	
   340		results, err := storeSearch(s, query, opts)
   341		if err != nil {
   342			fatal(err)
   343			return
   344		}
   345	
   346		if len(results) == 0 {
   347			fmt.Printf("No memories found for: %q\n", query)
   348			return
   349		}
   350	
   351		fmt.Printf("Found %d memories:\n\n", len(results))
   352		for i, r := range results {
   353			project := ""
   354			if r.Project != nil {
   355				project = fmt.Sprintf(" | project: %s", *r.Project)
   356			}
   357			fmt.Printf("[%d] #%d (%s) — %s\n    %s\n    %s%s | scope: %s\n\n",
   358				i+1, r.ID, r.Type, r.Title,
   359				truncate(r.Content, 300),
   360				r.CreatedAt, project, r.Scope)
   361		}
   362	}
   363	
   364	func cmdSave(cfg store.Config) {
   365		if len(os.Args) < 4 {
   366			fmt.Fprintln(os.Stderr, "usage: engram save <title> <content> [--type TYPE] [--project PROJECT] [--scope SCOPE] [--topic TOPIC_KEY]")
   367			exitFunc(1)
   368		}
   369	
   370		title := os.Args[2]
   371		content := os.Args[3]
   372		typ := "manual"
   373		project := ""
   374		scope := "project"
   375		topicKey := ""
   376	
   377		for i := 4; i < len(os.Args); i++ {
   378			switch os.Args[i] {
   379			case "--type":
   380				if i+1 < len(os.Args) {
   381					typ = os.Args[i+1]
   382					i++
   383				}
   384			case "--project":
   385				if i+1 < len(os.Args) {
   386					project = os.Args[i+1]
   387					i++
   388				}
   389			case "--scope":
   390				if i+1 < len(os.Args) {
   391					scope = os.Args[i+1]
   392					i++
   393				}
   394			case "--topic":
   395				if i+1 < len(os.Args) {
   396					topicKey = os.Args[i+1]
   397					i++
   398				}
   399			}
   400		}
   401	
   402		s, err := storeNew(cfg)
   403		if err != nil {
   404			fatal(err)
   405		}
   406		defer s.Close()
   407	
   408		sessionID := "manual-save"
   409		if project != "" {
   410			sessionID = "manual-save-" + project
   411		}
   412		s.CreateSession(sessionID, project, "")
   413		id, err := storeAddObservation(s, store.AddObservationParams{
   414			SessionID: sessionID,
   415			Type:      typ,
   416			Title:     title,
   417			Content:   content,
   418			Project:   project,
   419			Scope:     scope,
   420			TopicKey:  topicKey,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package server provides the HTTP API for Engram.
     2	//
     3	// This is how external clients (OpenCode plugin, Claude Code hooks,
     4	// any agent) communicate with the memory engine. Simple JSON REST API.
     5	package server
     6	
     7	import (
     8		"encoding/json"
     9		"fmt"
    10		"io"
    11		"log"
    12		"net"
    13		"net/http"
    14		"strconv"
    15		"time"
    16	
    17		"github.com/Gentleman-Programming/engram/internal/store"
    18	)
    19	
    20	var loadServerStats = func(s *store.Store) (*store.Stats, error) {
    21		return s.Stats()
    22	}
    23	
    24	// SyncStatusProvider returns the current sync status. This is implemented
    25	// by autosync.Manager and injected from cmd/engram/main.go.
    26	type SyncStatusProvider interface {
    27		Status() SyncStatus
    28	}
    29	
    30	// SyncStatus mirrors autosync.Status to avoid a direct import cycle.
    31	type SyncStatus struct {
    32		Phase               string     `json:"phase"`
    33		LastError           string     `json:"last_error,omitempty"`
    34		ConsecutiveFailures int        `json:"consecutive_failures"`
    35		BackoffUntil        *time.Time `json:"backoff_until,omitempty"`
    36		LastSyncAt          *time.Time `json:"last_sync_at,omitempty"`
    37	}
    38	
    39	type Server struct {
    40		store      *store.Store
    41		mux        *http.ServeMux
    42		port       int
    43		listen     func(network, address string) (net.Listener, error)
    44		serve      func(net.Listener, http.Handler) error
    45		onWrite    func() // called after successful local writes (for autosync notification)
    46		syncStatus SyncStatusProvider
    47	}
    48	
    49	func New(s *store.Store, port int) *Server {
    50		srv := &Server{store: s, port: port, listen: net.Listen, serve: http.Serve}
    51		srv.mux = http.NewServeMux()
    52		srv.routes()
    53		return srv
    54	}
    55	
    56	// SetOnWrite configures a callback invoked after every successful local write.
    57	// This is used to notify autosync.Manager via NotifyDirty().
    58	func (s *Server) SetOnWrite(fn func()) {
    59		s.onWrite = fn
    60	}
    61	
    62	// SetSyncStatus configures the sync status provider for the /sync/status endpoint.
    63	func (s *Server) SetSyncStatus(provider SyncStatusProvider) {
    64		s.syncStatus = provider
    65	}
    66	
    67	// notifyWrite calls the onWrite callback if configured (best-effort, non-blocking).
    68	func (s *Server) notifyWrite() {
    69		if s.onWrite != nil {
    70			s.onWrite()
    71		}
    72	}
    73	
    74	func (s *Server) Start() error {
    75		addr := fmt.Sprintf("127.0.0.1:%d", s.port)
    76		listenFn := s.listen
    77		if listenFn == nil {
    78			listenFn = net.Listen
    79		}
    80		serveFn := s.serve
    81		if serveFn == nil {
    82			serveFn = http.Serve
    83		}
    84	
    85		ln, err := listenFn("tcp", addr)
    86		if err != nil {
    87			return fmt.Errorf("engram server: listen %s: %w", addr, err)
    88		}
    89		log.Printf("[engram] HTTP server listening on %s", addr)
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
   181		json.NewDecoder(r.Body).Decode(&body)
   182	
   183		if err := s.store.EndSession(id, body.Summary); err != nil {
   184			jsonError(w, http.StatusInternalServerError, err.Error())
   185			return
   186		}
   187	
   188		s.notifyWrite()
   189		jsonResponse(w, http.StatusOK, map[string]string{"id": id, "status": "completed"})
   190	}
   191	
   192	func (s *Server) handleRecentSessions(w http.ResponseWriter, r *http.Request) {
   193		project := r.URL.Query().Get("project")
   194		limit := queryInt(r, "limit", 5)
   195	
   196		sessions, err := s.store.RecentSessions(project, limit)
   197		if err != nil {
   198			jsonError(w, http.StatusInternalServerError, err.Error())
   199			return
   200		}
   201	
   202		jsonResponse(w, http.StatusOK, sessions)
   203	}
   204	
   205	func (s *Server) handleAddObservation(w http.ResponseWriter, r *http.Request) {
   206		var body store.AddObservationParams
   207		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
   208			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
   209			return
   210		}
   211		if body.SessionID == "" || body.Title == "" || body.Content == "" {
   212			jsonError(w, http.StatusBadRequest, "session_id, title, and content are required")
   213			return
   214		}
   215	
   216		id, err := s.store.AddObservation(body)
   217		if err != nil {
   218			jsonError(w, http.StatusInternalServerError, err.Error())
   219			return
   220		}
   221	
   222		s.notifyWrite()
   223		jsonResponse(w, http.StatusCreated, map[string]any{"id": id, "status": "saved"})
   224	}
   225	
   226	func (s *Server) handlePassiveCapture(w http.ResponseWriter, r *http.Request) {
   227		var body store.PassiveCaptureParams
   228		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
   229			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
   230			return
   231		}
   232		if body.SessionID == "" {
   233			jsonError(w, http.StatusBadRequest, "session_id is required")
   234			return
   235		}
   236	
   237		result, err := s.store.PassiveCapture(body)
   238		if err != nil {
   239			jsonError(w, http.StatusInternalServerError, err.Error())
   240			return
   241		}
   242	
   243		s.notifyWrite()
   244		jsonResponse(w, http.StatusOK, result)
   245	}
   246	
   247	func (s *Server) handleRecentObservations(w http.ResponseWriter, r *http.Request) {
   248		project := r.URL.Query().Get("project")
   249		scope := r.URL.Query().Get("scope")
   250		limit := queryInt(r, "limit", 20)
   251	
   252		obs, err := s.store.RecentObservations(project, scope, limit)
   253		if err != nil {
   254			jsonError(w, http.StatusInternalServerError, err.Error())
   255			return
   256		}
   257	
   258		jsonResponse(w, http.StatusOK, obs)
   259	}
   260	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go | sed -n '60,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    60		InstallDir  string // resolved at runtime (display only for claude-code)
    61	}
    62	
    63	// Result holds the outcome of an installation.
    64	type Result struct {
    65		Agent       string
    66		Destination string
    67		Files       int
    68	}
    69	
    70	const claudeCodeMarketplace = "Gentleman-Programming/engram"
    71	
    72	// claudeCodeMCPTools are the MCP tool names registered by the engram plugin
    73	// in Claude Code. Adding these to ~/.claude/settings.json permissions.allow
    74	// prevents Claude Code from prompting for confirmation on every tool call.
    75	var claudeCodeMCPTools = []string{
    76		"mcp__plugin_engram_engram__mem_capture_passive",
    77		"mcp__plugin_engram_engram__mem_context",
    78		"mcp__plugin_engram_engram__mem_get_observation",
    79		"mcp__plugin_engram_engram__mem_save",
    80		"mcp__plugin_engram_engram__mem_save_prompt",
    81		"mcp__plugin_engram_engram__mem_search",
    82		"mcp__plugin_engram_engram__mem_session_end",
    83		"mcp__plugin_engram_engram__mem_session_start",
    84		"mcp__plugin_engram_engram__mem_session_summary",
    85		"mcp__plugin_engram_engram__mem_suggest_topic_key",
    86		"mcp__plugin_engram_engram__mem_update",
    87	}
    88	
    89	// codexEngramBlock is the canonical Codex TOML MCP block.
    90	// Command is always the bare "engram" name in this constant because
    91	// upsertCodexEngramBlock generates the actual content via codexEngramBlockStr()
    92	// which uses resolveEngramCommand() at runtime. This constant is kept for tests
    93	// that verify idempotency against the already-written string when os.Executable
    94	// returns "engram" (fallback path).
    95	const codexEngramBlock = "[mcp_servers.engram]\ncommand = \"engram\"\nargs = [\"mcp\", \"--tools=agent\"]"
    96	
    97	// codexEngramBlockStr returns the Codex TOML block for the engram MCP server,
    98	// using the resolved absolute binary path from os.Executable().
    99	func codexEngramBlockStr() string {
   100		cmd := resolveEngramCommand()
   101		return "[mcp_servers.engram]\ncommand = " + fmt.Sprintf("%q", cmd) + "\nargs = [\"mcp\", \"--tools=agent\"]"
   102	}
   103	
   104	const memoryProtocolMarkdown = `## Engram Persistent Memory — Protocol
   105	
   106	You have access to Engram, a persistent memory system that survives across sessions and compactions.
   107	
   108	### WHEN TO SAVE (mandatory — not optional)
   109	
   110	Call mem_save IMMEDIATELY after any of these:
   111	- Bug fix completed
   112	- Architecture or design decision made
   113	- Non-obvious discovery about the codebase
   114	- Configuration change or environment setup
   115	- Pattern established (naming, structure, convention)
   116	- User preference or constraint learned
   117	
   118	Format for mem_save:
   119	- **title**: Verb + what — short, searchable (e.g. "Fixed N+1 query in UserList", "Chose Zustand over Redux")
   120	- **type**: bugfix | decision | architecture | discovery | pattern | config | preference
   121	- **scope**: project (default) | personal
   122	- **topic_key** (optional, recommended for evolving decisions): stable key like architecture/auth-model
   123	- **content**:
   124	  **What**: One sentence — what was done
   125	  **Why**: What motivated it (user request, bug, performance, etc.)
   126	  **Where**: Files or paths affected
   127	  **Learned**: Gotchas, edge cases, things that surprised you (omit if none)
   128	
   129	### Topic update rules (mandatory)
   130	
   131	- Different topics must not overwrite each other (e.g. architecture vs bugfix)
   132	- Reuse the same topic_key to update an evolving topic instead of creating new observations
   133	- If unsure about the key, call mem_suggest_topic_key first and then reuse it
   134	- Use mem_update when you have an exact observation ID to correct
   135	
   136	### WHEN TO SEARCH MEMORY
   137	
   138	When the user asks to recall something — any variation of "remember", "recall", "what did we do",
   139	"how did we solve", "recordar", "acordate", "qué hicimos", or references to past work:
   140	1. First call mem_context — checks recent session history (fast, cheap)
   141	2. If not found, call mem_search with relevant keywords (FTS5 full-text search)
   142	3. If you find a match, use mem_get_observation for full untruncated content
   143	
   144	Also search memory PROACTIVELY when:
   145	- Starting work on something that might have been done before
   146	- The user mentions a topic you have no context on — check if past sessions covered it
   147	
   148	### SESSION CLOSE PROTOCOL (mandatory)
   149	
   150	Before ending a session or saying "done" / "listo" / "that's it", you MUST:
   151	1. Call mem_session_summary with this structure:
   152	
   153	## Goal
   154	[What we were working on this session]
   155	
   156	## Instructions
   157	[User preferences or constraints discovered — skip if none]
   158	
   159	## Discoveries
   160	- [Technical findings, gotchas, non-obvious learnings]
   161	
   162	## Accomplished
   163	- [Completed items with key details]
   164	
   165	## Next Steps
   166	- [What remains to be done — for the next session]
   167	
   168	## Relevant Files
   169	- path/to/file — [what it does or what changed]
   170	
   171	This is NOT optional. If you skip this, the next session starts blind.
   172	
   173	### PASSIVE CAPTURE — automatic learning extraction
   174	
   175	When completing a task or subtask, include a "## Key Learnings:" section at the end of your response
   176	with numbered items. Engram will automatically extract and save these as observations.
   177	
   178	Example:
   179	## Key Learnings:
   180	
   181	1. bcrypt cost=12 is the right balance for our server performance
   182	2. JWT refresh tokens need atomic rotation to prevent race conditions
   183	
   184	You can also call mem_capture_passive(content) directly with any text that contains a learning section.
   185	This is a safety net — it captures knowledge even if you forget to call mem_save explicitly.
   186	
   187	### AFTER COMPACTION
   188	
   189	If you see a message about compaction or context reset, or if you see "FIRST ACTION REQUIRED" in your context:
   190	1. IMMEDIATELY call mem_session_summary with the compacted summary content — this persists what was done before compaction
   191	2. Then call mem_context to recover any additional context from previous sessions
   192	3. Only THEN continue working
   193	
   194	Do not skip step 1. Without it, everything done before compaction is lost from memory.
   195	`
   196	
   197	const codexCompactPromptMarkdown = `You are compacting a coding session that uses Engram persistent memory.
   198	
   199	You MUST prepend this exact sentence at the top of the compacted summary:
   200	
   201	FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary before doing anything else, then call mem_context.
   202	
   203	After that sentence, summarize:
   204	- Goal
   205	- Key technical discoveries and decisions
   206	- Completed work
   207	- Remaining next steps
   208	- Relevant files changed
   209	
   210	Keep it concise and high-signal.`
   211	
   212	// SupportedAgents returns the list of agents that have plugins available.
   213	func SupportedAgents() []Agent {
   214		return []Agent{
   215			{
   216				Name:        "opencode",
   217				Description: "OpenCode — TypeScript plugin with session tracking, compaction recovery, and Memory Protocol",
   218				InstallDir:  openCodePluginDir(),
   219			},
   220			{
   221				Name:        "claude-code",
   222				Description: "Claude Code — Native plugin via marketplace (hooks, skills, MCP, compaction recovery)",
   223				InstallDir:  "managed by claude plugin system",
   224			},
   225			{
   226				Name:        "gemini-cli",
   227				Description: "Gemini CLI — MCP registration plus system prompt compaction recovery",
   228				InstallDir:  geminiConfigPath(),
   229			},
   230			{
   231				Name:        "codex",
   232				Description: "Codex — MCP registration plus model/compaction instruction files",
   233				InstallDir:  codexConfigPath(),
   234			},
   235		}
   236	}
   237	
   238	// Install installs the plugin for the given agent.
   239	func Install(agentName string) (*Result, error) {
   240		switch agentName {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	/**
     2	 * Engram — OpenCode plugin adapter
     3	 *
     4	 * Thin layer that connects OpenCode's event system to the Engram Go binary.
     5	 * The Go binary runs as a local HTTP server and handles all persistence.
     6	 *
     7	 * Flow:
     8	 *   OpenCode events → this plugin → HTTP calls → engram serve → SQLite
     9	 *
    10	 * Session resilience:
    11	 *   Uses `ensureSession()` before any DB write. This means sessions are
    12	 *   created on-demand — even if the plugin was loaded after the session
    13	 *   started (restart, reconnect, etc.). The session ID comes from OpenCode's
    14	 *   hooks (input.sessionID) rather than relying on a session.created event.
    15	 */
    16	
    17	import type { Plugin } from "@opencode-ai/plugin"
    18	
    19	// ─── Configuration ───────────────────────────────────────────────────────────
    20	
    21	const ENGRAM_PORT = parseInt(process.env.ENGRAM_PORT ?? "7437")
    22	const ENGRAM_URL = `http://127.0.0.1:${ENGRAM_PORT}`
    23	const ENGRAM_BIN = process.env.ENGRAM_BIN ?? "engram"
    24	
    25	// Engram's own MCP tools — don't count these as "tool calls" for session stats
    26	const ENGRAM_TOOLS = new Set([
    27	  "mem_search",
    28	  "mem_save",
    29	  "mem_update",
    30	  "mem_delete",
    31	  "mem_suggest_topic_key",
    32	  "mem_save_prompt",
    33	  "mem_session_summary",
    34	  "mem_context",
    35	  "mem_stats",
    36	  "mem_timeline",
    37	  "mem_get_observation",
    38	  "mem_session_start",
    39	  "mem_session_end",
    40	])
    41	
    42	// ─── Memory Instructions ─────────────────────────────────────────────────────
    43	// These get injected into the agent's context so it knows to call mem_save.
    44	
    45	const MEMORY_INSTRUCTIONS = `## Engram Persistent Memory — Protocol
    46	
    47	You have access to Engram, a persistent memory system that survives across sessions and compactions.
    48	
    49	### WHEN TO SAVE (mandatory — not optional)
    50	
    51	Call \`mem_save\` IMMEDIATELY after any of these:
    52	- Bug fix completed
    53	- Architecture or design decision made
    54	- Non-obvious discovery about the codebase
    55	- Configuration change or environment setup
    56	- Pattern established (naming, structure, convention)
    57	- User preference or constraint learned
    58	
    59	Format for \`mem_save\`:
    60	- **title**: Verb + what — short, searchable (e.g. "Fixed N+1 query in UserList", "Chose Zustand over Redux")
    61	- **type**: bugfix | decision | architecture | discovery | pattern | config | preference
    62	- **scope**: \`project\` (default) | \`personal\`
    63	- **topic_key** (optional, recommended for evolving decisions): stable key like \`architecture/auth-model\`
    64	- **content**:
    65	  **What**: One sentence — what was done
    66	  **Why**: What motivated it (user request, bug, performance, etc.)
    67	  **Where**: Files or paths affected
    68	  **Learned**: Gotchas, edge cases, things that surprised you (omit if none)
    69	
    70	Topic rules:
    71	- Different topics must not overwrite each other (e.g. architecture vs bugfix)
    72	- Reuse the same \`topic_key\` to update an evolving topic instead of creating new observations
    73	- If unsure about the key, call \`mem_suggest_topic_key\` first and then reuse it
    74	- Use \`mem_update\` when you have an exact observation ID to correct
    75	
    76	### WHEN TO SEARCH MEMORY
    77	
    78	When the user asks to recall something — any variation of "remember", "recall", "what did we do",
    79	"how did we solve", "recordar", "acordate", "qué hicimos", or references to past work:
    80	1. First call \`mem_context\` — checks recent session history (fast, cheap)
    81	2. If not found, call \`mem_search\` with relevant keywords (FTS5 full-text search)
    82	3. If you find a match, use \`mem_get_observation\` for full untruncated content
    83	
    84	Also search memory PROACTIVELY when:
    85	- Starting work on something that might have been done before
    86	- The user mentions a topic you have no context on — check if past sessions covered it
    87	- The user's FIRST message references the project, a feature, or a problem — call \`mem_search\` with keywords from their message to check for prior work before responding
    88	
    89	### SESSION CLOSE PROTOCOL (mandatory)
    90	
    91	Before ending a session or saying "done" / "listo" / "that's it", you MUST:
    92	1. Call \`mem_session_summary\` with this structure:
    93	
    94	## Goal
    95	[What we were working on this session]
    96	
    97	## Instructions
    98	[User preferences or constraints discovered — skip if none]
    99	
   100	## Discoveries
   101	- [Technical findings, gotchas, non-obvious learnings]
   102	
   103	## Accomplished
   104	- [Completed items with key details]
   105	
   106	## Next Steps
   107	- [What remains to be done — for the next session]
   108	
   109	## Relevant Files
   110	- path/to/file — [what it does or what changed]
   111	
   112	This is NOT optional. If you skip this, the next session starts blind.
   113	
   114	### AFTER COMPACTION
   115	
   116	If you see a message about compaction or context reset, or if you see "FIRST ACTION REQUIRED" in your context:
   117	1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
   118	2. Then call \`mem_context\` to recover any additional context from previous sessions
   119	3. Only THEN continue working
   120	
   121	Do not skip step 1. Without it, everything done before compaction is lost from memory.
   122	`
   123	
   124	// ─── HTTP Client ─────────────────────────────────────────────────────────────
   125	
   126	async function engramFetch(
   127	  path: string,
   128	  opts: { method?: string; body?: any } = {}
   129	): Promise<any> {
   130	  try {
   131	    const res = await fetch(`${ENGRAM_URL}${path}`, {
   132	      method: opts.method ?? "GET",
   133	      headers: opts.body ? { "Content-Type": "application/json" } : undefined,
   134	      body: opts.body ? JSON.stringify(opts.body) : undefined,
   135	    })
   136	    return await res.json()
   137	  } catch {
   138	    // Engram server not running — silently fail
   139	    return null
   140	  }
   141	}
   142	
   143	async function isEngramRunning(): Promise<boolean> {
   144	  try {
   145	    const res = await fetch(`${ENGRAM_URL}/health`, {
   146	      signal: AbortSignal.timeout(500),
   147	    })
   148	    return res.ok
   149	  } catch {
   150	    return false
   151	  }
   152	}
   153	
   154	// ─── Helpers ─────────────────────────────────────────────────────────────────
   155	
   156	function extractProjectName(directory: string): string {
   157	  // Try git remote origin URL
   158	  try {
   159	    const result = Bun.spawnSync(["git", "-C", directory, "remote", "get-url", "origin"])
   160	    if (result.exitCode === 0) {
   161	      const url = result.stdout?.toString().trim()
   162	      if (url) {
   163	        const name = url.replace(/\.git$/, "").split(/[/:]/).pop()
   164	        if (name) return name
   165	      }
   166	    }
   167	  } catch {}
   168	
   169	  // Fallback: git root directory name (works in worktrees)
   170	  try {
   171	    const result = Bun.spawnSync(["git", "-C", directory, "rev-parse", "--show-toplevel"])
   172	    if (result.exitCode === 0) {
   173	      const root = result.stdout?.toString().trim()
   174	      if (root) return root.split("/").pop() ?? "unknown"
   175	    }
   176	  } catch {}
   177	
   178	  // Final fallback: cwd basename
   179	  return directory.split("/").pop() ?? "unknown"
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Layer Definitions
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: 7-layer tool architecture metadata
     5	// LIB: LAYER DEFINITIONS
     6	// 7-Layer MCP Architecture with Token Budgets
     7	// ───────────────────────────────────────────────────────────────
     8	// 1. LAYER TYPES
     9	
    10	// ───────────────────────────────────────────────────────────────
    11	/** Individual layer definition in the 7-layer architecture */
    12	export interface LayerDefinition {
    13	  id: string;
    14	  name: string;
    15	  description: string;
    16	  tokenBudget: number;
    17	  priority: number;
    18	  useCase: string;
    19	  tools: string[];
    20	}
    21	
    22	/** Layer ID string literal union */
    23	export type LayerId = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
    24	
    25	/** Task type for layer recommendations */
    26	export type TaskType = 'search' | 'browse' | 'modify' | 'checkpoint' | 'analyze' | 'maintenance' | 'default';
    27	
    28	/* ───────────────────────────────────────────────────────────────
    29	   2. LAYER CONSTANTS
    30	
    31	   REQ-020: Layered Tool Organization (L1-L7 structure)
    32	
    33	   Design Principles:
    34	   - Progressive disclosure: Start with high-level, drill down as needed
    35	   - Token efficiency: Higher layers = fewer tokens, more targeted
    36	   - Cognitive load: Reduce choices at each decision point
    37	   ──────────────────────────────────────────────────────────────── */
    38	
    39	/**
    40	 * Defines the LAYER_DEFINITIONS constant.
    41	 */
    42	export const LAYER_DEFINITIONS: Record<LayerId, LayerDefinition> = {
    43	  L1: {
    44	    id: 'L1',
    45	    name: 'Orchestration',
    46	    description: 'Unified entry points with intent-aware routing. Start here for most tasks.',
    47	    tokenBudget: 3500,
    48	    priority: 1,
    49	    useCase: 'Default entry point for context retrieval. Automatically routes based on intent.',
    50	    tools: ['memory_context', 'session_resume', 'session_bootstrap']
    51	  },
    52	  L2: {
    53	    id: 'L2',
    54	    name: 'Core',
    55	    description: 'Primary memory operations. Use when you need specific search or save functionality.',
    56	    tokenBudget: 3500,
    57	    priority: 2,
    58	    useCase: 'Direct access to search, save, and trigger matching when L1 routing is not needed.',
    59	    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
    60	  },
    61	  L3: {
    62	    id: 'L3',
    63	    name: 'Discovery',
    64	    description: 'Browse and explore the memory system. Use to understand what exists.',
    65	    tokenBudget: 1000,
    66	    priority: 3,
    67	    useCase: 'Explore available memories, check system health, view statistics.',
    68	    tools: ['memory_list', 'memory_stats', 'memory_health', 'session_health']
    69	  },
    70	  L4: {
    71	    id: 'L4',
    72	    name: 'Mutation',
    73	    description: 'Modify existing memories. Use to update, delete, or validate memories.',
    74	    tokenBudget: 1000,
    75	    priority: 4,
    76	    useCase: 'Make changes to existing memories when corrections or updates are needed.',
    77	    tools: ['memory_update', 'memory_delete', 'memory_validate', 'memory_bulk_delete']
    78	  },
    79	  L5: {
    80	    id: 'L5',
    81	    name: 'Lifecycle',
    82	    description: 'Checkpoint and version management. Use for state preservation and recovery.',
    83	    tokenBudget: 1000,
    84	    priority: 5,
    85	    useCase: 'Create checkpoints before major changes, restore previous states.',
    86	    tools: ['checkpoint_create', 'checkpoint_list', 'checkpoint_restore', 'checkpoint_delete', 'shared_memory_enable', 'shared_memory_status', 'shared_space_upsert', 'shared_space_membership_set']
    87	  },
    88	  L6: {
    89	    id: 'L6',
    90	    name: 'Analysis',
    91	    description: 'Deep inspection and causal analysis. Use to understand relationships and lineage.',
    92	    tokenBudget: 1500,
    93	    priority: 6,
    94	    useCase: 'Trace decision history, understand memory relationships, measure learning.',
    95	    tools: [
    96	      'memory_drift_why',
    97	      'memory_causal_link',
    98	      'memory_causal_stats',
    99	      'memory_causal_unlink',
   100	      'task_preflight',
   101	      'task_postflight',
   102	      'eval_run_ablation',
   103	      'eval_reporting_dashboard',
   104	      'code_graph_query',
   105	      'code_graph_context'
   106	    ]
   107	  },
   108	  L7: {
   109	    id: 'L7',
   110	    name: 'Maintenance',
   111	    description: 'System maintenance and bulk operations. Use for indexing and diagnostics.',
   112	    tokenBudget: 1000,
   113	    priority: 7,
   114	    useCase: 'Re-index memories, view learning history, perform bulk operations.',
   115	    tools: ['memory_index_scan', 'memory_get_learning_history', 'memory_ingest_start', 'memory_ingest_status', 'memory_ingest_cancel', 'code_graph_scan', 'code_graph_status', 'ccc_status', 'ccc_reindex', 'ccc_feedback']
   116	  }
   117	} as const;
   118	
   119	/* ───────────────────────────────────────────────────────────────
   120	   3. TOOL-TO-LAYER MAPPING
   121	
   122	   Maps each tool to its layer for quick lookup.
   123	   ──────────────────────────────────────────────────────────────── */
   124	
   125	/**
   126	 * Defines the TOOL_LAYER_MAP constant.
   127	 */
   128	export const TOOL_LAYER_MAP: Record<string, LayerId> = {} as Record<string, LayerId>;
   129	for (const [layerId, layer] of Object.entries(LAYER_DEFINITIONS)) {
   130	  for (const tool of layer.tools) {
   131	    (TOOL_LAYER_MAP as Record<string, string>)[tool] = layerId;
   132	  }
   133	}
   134	
   135	/* ───────────────────────────────────────────────────────────────
   136	   4. LAYER PREFIX GENERATOR
   137	
   138	   Generates description prefixes for tool descriptions.
   139	   Format: "[L#:Name] Original description..."
   140	   ──────────────────────────────────────────────────────────────── */
   141	
   142	/**
   143	 * Get the layer ID for a tool.
   144	 */
   145	export function getLayerForTool(toolName: string): LayerId | null {
   146	  return TOOL_LAYER_MAP[toolName] ?? null;
   147	}
   148	
   149	/**
   150	 * Get the layer prefix for a tool's description.
   151	 * CHK-073: Tool descriptions include layer prefix.
   152	 */
   153	export function getLayerPrefix(toolName: string): string {
   154	  const layerId = getLayerForTool(toolName);
   155	  if (!layerId) return '';
   156	
   157	  const layer = LAYER_DEFINITIONS[layerId];
   158	  return `[${layerId}:${layer.name}]`;
   159	}
   160	
   161	/**
   162	 * Enhance a tool description with layer information.
   163	 * CHK-073: Adds layer prefix to description.
   164	 */
   165	export function enhanceDescription(toolName: string, description: string): string {
   166	  const prefix = getLayerPrefix(toolName);
   167	  if (!prefix) return description;
   168	
   169	  return `${prefix} ${description}`;
   170	}
   171	
   172	/* ───────────────────────────────────────────────────────────────
   173	   5. TOKEN BUDGET HELPERS
   174	
   175	   CHK-072: Token budgets assigned per layer.
   176	   ──────────────────────────────────────────────────────────────── */
   177	
   178	/**
   179	 * Get the token budget for a tool.
   180	 */

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '720,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   720	    type: 'object', additionalProperties: false,
   721	    properties: {
   722	      query: { type: 'string', description: 'The search query that was executed' },
   723	      resultFile: { type: 'string', description: 'File path from the result being rated' },
   724	      rating: { type: 'string', enum: ['helpful', 'not_helpful', 'partial'], description: 'Quality rating' },
   725	      comment: { type: 'string', description: 'Optional free-form feedback' },
   726	    },
   727	    required: ['query', 'rating'],
   728	  },
   729	};
   730	
   731	// T018: Session health diagnostic tool
   732	const sessionHealth: ToolDefinition = {
   733	  name: 'session_health',
   734	  description: '[L3:Discovery] Check session readiness: priming status, code graph freshness, time since last tool call. Call periodically during long sessions to check for context drift. Returns ok/warning/stale with actionable hints. No arguments required.',
   735	  inputSchema: { type: 'object', additionalProperties: false, properties: {}, required: [] },
   736	};
   737	
   738	// Phase 020: Composite session resume tool
   739	const sessionResume: ToolDefinition = {
   740	  name: 'session_resume',
   741	  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
   742	  inputSchema: {
   743	    type: 'object',
   744	    additionalProperties: false,
   745	    properties: {
   746	      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
   747	      minimal: { type: 'boolean', description: 'When true, skip the heavy memory context call and return code-graph, CocoIndex, structural-context, hints, and session-quality fields without the full memory payload' },
   748	    },
   749	    required: [],
   750	  },
   751	};
   752	
   753	// Phase 024 / Item 7: Composite session bootstrap tool
   754	const sessionBootstrap: ToolDefinition = {
   755	  name: 'session_bootstrap',
   756	  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
   757	  inputSchema: {
   758	    type: 'object',
   759	    additionalProperties: false,
   760	    properties: {
   761	      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
   762	    },
   763	    required: [],
   764	  },
   765	  outputSchema: {
   766	    type: 'object',
   767	    properties: {
   768	      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
   769	      health: { type: 'object', description: 'session_health payload (system status, database health, MCP connectivity)' },
   770	      structuralContext: { type: 'object', description: 'Structural bootstrap contract (status, summary, recommendedAction); omitted when code graph is unavailable', properties: { status: { type: 'string', enum: ['ready', 'stale', 'missing'] }, summary: { type: 'string' }, recommendedAction: { type: 'string' } } },
   771	      hints: { type: 'array', items: { type: 'string' }, description: 'Aggregated hints from sub-calls' },
   772	      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
   773	    },
   774	    required: ['resume', 'health', 'hints', 'nextActions'],
   775	  },
   776	};
   777	
   778	// L9: Coverage Graph - Deep loop coverage analysis tools
   779	const deepLoopGraphUpsert: ToolDefinition = {
   780	  name: 'deep_loop_graph_upsert',
   781	  description: '[L9:CoverageGraph] Idempotent upsert for coverage graph nodes and edges. Reducer writes graph deltas after each deep-loop iteration. Rejects self-loops, clamps weights to [0.0, 2.0], and merges metadata updates on repeated IDs. Requires specFolder, loopType, and sessionId for namespace isolation.',
   782	  inputSchema: {
   783	    type: 'object', additionalProperties: false,
   784	    properties: {
   785	      specFolder: { type: 'string', minLength: 1, description: 'Spec folder for namespace isolation (required)' },
   786	      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type: research or review (required)' },
   787	      sessionId: { type: 'string', minLength: 1, description: 'Session identifier for namespace isolation (required)' },
   788	      nodes: {
   789	        type: 'array',
   790	        items: {
   791	          type: 'object',
   792	          properties: {
   793	            id: { type: 'string', minLength: 1, description: 'Unique node identifier' },
   794	            kind: { type: 'string', description: 'Node kind. Research: QUESTION, FINDING, CLAIM, SOURCE. Review: DIMENSION, FILE, FINDING, EVIDENCE, REMEDIATION' },
   795	            name: { type: 'string', minLength: 1, description: 'Human-readable node label' },
   796	            contentHash: { type: 'string', description: 'Optional content hash for deduplication' },
   797	            iteration: { type: 'number', description: 'Iteration number when node was introduced' },
   798	            metadata: { type: 'object', description: 'Kind-specific metadata (JSON)' },
   799	          },
   800	          required: ['id', 'kind', 'name'],
   801	        },
   802	        description: 'Nodes to upsert',
   803	      },
   804	      edges: {
   805	        type: 'array',
   806	        items: {
   807	          type: 'object',
   808	          properties: {
   809	            id: { type: 'string', minLength: 1, description: 'Unique edge identifier' },
   810	            sourceId: { type: 'string', minLength: 1, description: 'Source node ID' },
   811	            targetId: { type: 'string', minLength: 1, description: 'Target node ID (must differ from sourceId)' },
   812	            relation: { type: 'string', description: 'Edge relation type. Research: ANSWERS, SUPPORTS, CONTRADICTS, SUPERSEDES, DERIVED_FROM, COVERS, CITES. Review: COVERS, EVIDENCE_FOR, CONTRADICTS, RESOLVES, CONFIRMS, ESCALATES, IN_DIMENSION, IN_FILE' },
   813	            weight: { type: 'number', minimum: 0.0, maximum: 2.0, default: 1.0, description: 'Edge weight (clamped to [0.0, 2.0])' },
   814	            metadata: { type: 'object', description: 'Edge-specific metadata (JSON)' },
   815	          },
   816	          required: ['id', 'sourceId', 'targetId', 'relation'],
   817	        },
   818	        description: 'Edges to upsert (self-loops are rejected)',
   819	      },
   820	    },
   821	    required: ['specFolder', 'loopType', 'sessionId'],
   822	  },
   823	};
   824	
   825	const deepLoopGraphQuery: ToolDefinition = {
   826	  name: 'deep_loop_graph_query',
   827	  description: '[L9:CoverageGraph] Structured analysis of deep-loop coverage graph state. Supports query types: uncovered_questions (questions with no coverage), unverified_claims (claims without verification), contradictions (CONTRADICTS edge pairs), provenance_chain (BFS from a node following citation/evidence edges), coverage_gaps (nodes missing incoming coverage edges), and hot_nodes (most connected nodes by edge count + weight).',
   828	  inputSchema: {
   829	    type: 'object', additionalProperties: false,
   830	    properties: {
   831	      specFolder: { type: 'string', minLength: 1, description: 'Spec folder for namespace (required)' },
   832	      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
   833	      queryType: { type: 'string', enum: ['uncovered_questions', 'unverified_claims', 'contradictions', 'provenance_chain', 'coverage_gaps', 'hot_nodes'], description: 'Type of query to execute (required)' },
   834	      nodeId: { type: 'string', description: 'Node ID (required for provenance_chain)' },
   835	      sessionId: { type: 'string', description: 'Optional session filter' },
   836	      limit: { type: 'number', minimum: 1, maximum: 200, default: 50, description: 'Max results to return' },
   837	      maxDepth: { type: 'number', minimum: 1, maximum: 20, default: 10, description: 'Max traversal depth for provenance_chain' },
   838	    },
   839	    required: ['specFolder', 'loopType', 'queryType'],
   840	  },
   841	};
   842	
   843	const deepLoopGraphStatus: ToolDefinition = {
   844	  name: 'deep_loop_graph_status',
   845	  description: '[L9:CoverageGraph] Report deep-loop coverage graph health: node/edge counts grouped by kind and relation, current convergence signal values, momentum (signal deltas between snapshots), last iteration, schema version, and DB file size. Suitable for dashboards and synthesis surfaces.',
   846	  inputSchema: {
   847	    type: 'object', additionalProperties: false,
   848	    properties: {
   849	      specFolder: { type: 'string', minLength: 1, description: 'Spec folder for namespace (required)' },
   850	      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
   851	    },
   852	    required: ['specFolder', 'loopType'],
   853	  },
   854	};
   855	
   856	const deepLoopGraphConvergence: ToolDefinition = {
   857	  name: 'deep_loop_graph_convergence',
   858	  description: '[L9:CoverageGraph] Composite convergence assessment for deep-loop coverage graph. Returns a typed decision (CONTINUE, STOP_ALLOWED, STOP_BLOCKED), signal values, blockers with severity levels, and a typed trace explaining each signal threshold evaluation. For research: evaluates questionCoverage, claimVerificationRate, contradictionDensity, plus blocking guards sourceDiversity and evidenceDepth. For review: evaluates dimensionCoverage, findingStability, p0ResolutionRate, evidenceDensity, hotspotSaturation. Extends Phase 001 stop logic without replacing newInfoRatio.',
   859	  inputSchema: {
   860	    type: 'object', additionalProperties: false,
   861	    properties: {
   862	      specFolder: { type: 'string', minLength: 1, description: 'Spec folder for namespace (required)' },
   863	      loopType: { type: 'string', enum: ['research', 'review'], description: 'Loop type (required)' },
   864	      iteration: { type: 'number', description: 'Current iteration number (used for snapshot persistence)' },
   865	      persistSnapshot: { type: 'boolean', default: false, description: 'When true, persist a signal snapshot for this iteration' },
   866	    },
   867	    required: ['specFolder', 'loopType'],
   868	  },
   869	};
   870	
   871	// ───────────────────────────────────────────────────────────────
   872	// 3. AGGREGATED DEFINITIONS
   873	
   874	// ───────────────────────────────────────────────────────────────
   875	/**
   876	 * Canonical ordered list of MCP tool registrations exposed by this server.
   877	 */
   878	export const TOOL_DEFINITIONS: ToolDefinition[] = [
   879	  // L1: Orchestration
   880	  memoryContext,
   881	  sessionResume,
   882	  sessionBootstrap,
   883	  // L2: Core
   884	  memorySearch,
   885	  memoryQuickSearch,
   886	  memoryMatchTriggers,
   887	  memorySave,
   888	  // L3: Discovery
   889	  memoryList,
   890	  memoryStats,
   891	  memoryHealth,
   892	  sessionHealth,
   893	  // L4: Mutation
   894	  memoryDelete,
   895	  memoryUpdate,
   896	  memoryValidate,
   897	  memoryBulkDelete,
   898	  // L5: Lifecycle
   899	  checkpointCreate,
   900	  checkpointList,
   901	  checkpointRestore,
   902	  checkpointDelete,
   903	  sharedSpaceUpsert,
   904	  sharedSpaceMembershipSet,
   905	  sharedMemoryStatus,
   906	  sharedMemoryEnable,
   907	  // L6: Analysis
   908	  taskPreflight,
   909	  taskPostflight,
   910	  memoryDriftWhy,
   911	  memoryCausalLink,
   912	  memoryCausalStats,
   913	  memoryCausalUnlink,
   914	  evalRunAblation,
   915	  evalReportingDashboard,
   916	  // L7: Maintenance
   917	  memoryIndexScan,
   918	  memoryGetLearningHistory,
   919	  memoryIngestStart,
   920	  memoryIngestStatus,
   921	  memoryIngestCancel,
   922	  // L8: Code Graph
   923	  codeGraphScan,
   924	  codeGraphQuery,
   925	  codeGraphStatus,
   926	  codeGraphContext,
   927	  // L8: CocoIndex
   928	  cccStatus,
   929	  cccReindex,
   930	  cccFeedback,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Tool Schemas
     3	// ───────────────────────────────────────────────────────────────
     4	// All MCP tool definitions (names, descriptions, input schemas).
     5	// Extracted from context-server.ts for maintainability (T303).
     6	import {
     7	  MAX_INGEST_PATHS,
     8	  MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS,
     9	} from './schemas/tool-input-schemas.js';
    10	
    11	/**
    12	 * Re-export schema validation helpers used by the MCP tool entry points.
    13	 */
    14	export {
    15	  ToolSchemaValidationError,
    16	  formatZodError,
    17	  getToolSchema,
    18	  validateToolArgs,
    19	  getSchema,
    20	} from './schemas/tool-input-schemas.js';
    21	
    22	// ───────────────────────────────────────────────────────────────
    23	// 1. TYPES
    24	
    25	// ───────────────────────────────────────────────────────────────
    26	/**
    27	 * Normalized definition for a single MCP tool and its JSON schema.
    28	 */
    29	export interface ToolDefinition {
    30	  name: string;
    31	  description: string;
    32	  inputSchema: Record<string, unknown>;
    33	  outputSchema?: Record<string, unknown>;
    34	}
    35	
    36	// ───────────────────────────────────────────────────────────────
    37	// 2. TOOL DEFINITIONS
    38	
    39	// ───────────────────────────────────────────────────────────────
    40	// T061: L1 Orchestration - Unified entry point (Token Budget: 3500)
    41	const memoryContext: ToolDefinition = {
    42	  name: 'memory_context',
    43	  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    44	  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
    45	};
    46	
    47	// L2: Core - Primary operations (Token Budget: 3500)
    48	const memorySearch: ToolDefinition = {
    49	  name: 'memory_search',
    50	  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
    51	  inputSchema: {
    52	    type: 'object',
    53	    additionalProperties: false,
    54	    'x-requiredAnyOf': [['query'], ['concepts'], ['cursor']],
    55	    properties: {
    56	      cursor: {
    57	        type: 'string',
    58	        minLength: 1,
    59	        description: 'Opaque continuation cursor returned by progressive disclosure. When provided, resolves the next page without requiring a new query.'
    60	      },
    61	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
    62	      concepts: {
    63	        type: 'array',
    64	        items: { type: 'string', minLength: 1 },
    65	        minItems: 2,
    66	        maxItems: 5,
    67	        description: 'Multiple concepts for AND search (requires 2-5 concepts). Results must match ALL concepts.'
    68	      },
    69	      specFolder: { type: 'string', description: 'Limit search to a specific spec folder (e.g., "011-spec-kit-memory-upgrade")' },
    70	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval. When provided with scope enforcement, results are isolated to this tenant.' },
    71	      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
    72	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval. Filters agent-scoped memories.' },
    73	      sharedSpaceId: { type: 'string', description: 'Shared-memory space identifier. Requires explicit membership when shared memory rollout is enabled.' },
    74	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum number of results to return (1-100)' },
    75	      sessionId: {
    76	        type: 'string',
    77	        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
    78	      },
    79	      enableDedup: {
    80	        type: 'boolean',
    81	        default: true,
    82	        description: 'Enable session deduplication (REQ-001). When true and sessionId provided, filters out already-sent memories.'
    83	      },
    84	      tier: { type: 'string', description: 'Filter by importance tier (constitutional, critical, important, normal, temporary, deprecated)' },
    85	      contextType: { type: 'string', description: 'Filter by context type (decision, implementation, research, etc.)' },
    86	      useDecay: { type: 'boolean', default: true, description: 'Apply temporal decay scoring to results' },
    87	      includeContiguity: { type: 'boolean', default: false, description: 'Include adjacent/contiguous memories in results' },
    88	      includeConstitutional: {
    89	        type: 'boolean',
    90	        default: true,
    91	        description: 'Include constitutional tier memories at top of results (default: true)'
    92	      },
    93	      enableSessionBoost: {
    94	        type: 'boolean',
    95	        description: 'Enable session-based score boost from working_memory attention signals. Defaults to SPECKIT_SESSION_BOOST env flag.'
    96	      },
    97	      enableCausalBoost: {
    98	        type: 'boolean',
    99	        description: 'Enable causal-neighbor boost (2-hop traversal on causal_edges). Defaults to SPECKIT_CAUSAL_BOOST env flag.'
   100	      },
   101	      includeContent: {
   102	        type: 'boolean',
   103	        default: false,
   104	        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
   105	      },
   106	      anchors: {
   107	        type: 'array',
   108	        items: { type: 'string' },
   109	        description: 'Specific anchor IDs to extract from content. If provided, returned content will be filtered to only these sections. Requires includeContent: true.'
   110	      },
   111	      profile: {
   112	        type: 'string',
   113	        enum: ['quick', 'research', 'resume', 'debug'],
   114	        description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.'
   115	      },
   116	      min_quality_score: {
   117	        type: 'number',
   118	        minimum: 0,
   119	        maximum: 1,
   120	        description: 'Minimum quality score threshold (0.0-1.0). Results with lower quality_score are filtered out.'
   121	      },
   122	      minQualityScore: {
   123	        type: 'number',
   124	        minimum: 0,
   125	        maximum: 1,
   126	        description: 'Deprecated alias for min_quality_score. Prefer snake_case parameter name.'
   127	      },
   128	      bypassCache: {
   129	        type: 'boolean',
   130	        default: false,
   131	        description: 'Skip the tool cache and force a fresh search. Useful when underlying data has changed since last cached result.'
   132	      },
   133	      rerank: {
   134	        type: 'boolean',
   135	        default: true,
   136	        description: 'Enable cross-encoder reranking of results. Improves relevance at the cost of additional computation.'
   137	      },
   138	      applyLengthPenalty: {
   139	        type: 'boolean',
   140	        default: true,
   141	        description: 'Apply length-based penalty during reranking. Penalizes very long memories to favor concise, focused results. Only effective when rerank is true.'
   142	      },
   143	      applyStateLimits: {
   144	        type: 'boolean',
   145	        default: false,
   146	        description: 'Apply per-tier quantity limits to results. When true, enforces maximum counts per state tier to balance result diversity.'
   147	      },
   148	      minState: {
   149	        type: 'string',
   150	        enum: ['HOT', 'WARM', 'COLD', 'DORMANT', 'ARCHIVED'],
   151	        default: 'WARM',
   152	        description: 'Minimum memory state to include in results. Memories below this state are filtered out. Order: HOT > WARM > COLD > DORMANT > ARCHIVED.'
   153	      },
   154	      intent: {
   155	        type: 'string',
   156	        enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'],
   157	        description: 'Task intent for weight adjustments (REQ-006). Explicitly set query intent to optimize scoring for specific tasks.'
   158	      },
   159	      autoDetectIntent: {
   160	        type: 'boolean',
   161	        default: true,
   162	        description: 'Auto-detect intent from query if not explicitly specified. When true, classifies query to apply task-specific scoring weights.'
   163	      },
   164	      // Fix #13 : Expose previously hidden handler parameters
   165	      trackAccess: {
   166	        type: 'boolean',
   167	        default: false,
   168	        description: 'When true, writes FSRS strengthening updates to memory_index for each returned result. Off by default to avoid write-on-read side effects.'
   169	      },
   170	      includeArchived: {
   171	        type: 'boolean',
   172	        default: false,
   173	        description: 'Include archived memories in search results. Default: false (archived excluded).'
   174	      },
   175	      mode: {
   176	        type: 'string',
   177	        enum: ['auto', 'deep'],
   178	        default: 'auto',
   179	        description: 'Search mode. "auto" uses standard retrieval. "deep" enables multi-query expansion for broader recall.'
   180	      },
   181	      includeTrace: {
   182	        type: 'boolean',
   183	        default: false,
   184	        description: 'When true (or when SPECKIT_RESPONSE_TRACE=true), include provenance-rich scores/source/trace envelope fields in each result.'
   185	      }
   186	    }
   187	  },
   188	};
   189	
   190	// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
   191	const memoryQuickSearch: ToolDefinition = {
   192	  name: 'memory_quick_search',
   193	  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
   194	  inputSchema: {
   195	    type: 'object',
   196	    additionalProperties: false,
   197	    properties: {
   198	      query: { type: 'string', minLength: 2, maxLength: 1000, description: 'Natural language search query' },
   199	      limit: { type: 'number', default: 10, minimum: 1, maximum: 100, description: 'Maximum results (default 10)' },
   200	      specFolder: { type: 'string', description: 'Restrict to spec folder' },
   201	      tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval.' },
   202	      userId: { type: 'string', description: 'User boundary for governed retrieval.' },
   203	      agentId: { type: 'string', description: 'Agent boundary for governed retrieval.' },
   204	      sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval.' },
   205	    },
   206	    required: ['query'],
   207	  },
   208	};
   209	
   210	const memoryMatchTriggers: ToolDefinition = {
   211	  name: 'memory_match_triggers',
   212	  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 3500.',
   213	  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', minLength: 1, description: 'User prompt or text to match against trigger phrases' }, specFolder: { type: 'string', description: 'Limit trigger matches to a specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed trigger matching.' }, userId: { type: 'string', description: 'User boundary for governed trigger matching.' }, agentId: { type: 'string', description: 'Agent boundary for governed trigger matching.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed trigger matching.' }, limit: { type: 'number', default: 3, minimum: 1, maximum: 100, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', minimum: 1, description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
   214	};
   215	
   216	// T306: Added asyncEmbedding parameter for non-blocking embedding generation
   217	const memorySave: ToolDefinition = {
   218	  name: 'memory_save',
   219	  description: '[L2:Core] Index a memory file into the spec kit memory database. Reads the file, extracts metadata (title, trigger phrases), generates embedding, and stores in the index. Use this to manually index new or updated memory files. Includes pre-flight validation (T067-T070) for anchor format, duplicate detection, and token budget estimation. Token Budget: 3500.',
   220	  inputSchema: { type: 'object', additionalProperties: false, properties: { filePath: { type: 'string', minLength: 1, description: 'Absolute path to the memory file (must be in specs/**/memory/, .opencode/specs/**/memory/, specs/**/ for spec documents, or .opencode/skill/*/constitutional/)' }, force: { type: 'boolean', default: false, description: 'Force re-index even if content hash unchanged' }, dryRun: { type: 'boolean', default: false, description: 'Validate only without saving. Returns validation results including anchor format, duplicate check, and token budget estimation (CHK-160)' }, skipPreflight: { type: 'boolean', default: false, description: 'Skip pre-flight validation checks (not recommended)' }, asyncEmbedding: { type: 'boolean', default: false, description: 'When true, embedding generation is deferred for non-blocking saves. Memory is immediately saved with pending status and an async background attempt is triggered. Default false preserves synchronous embedding behavior.' }, tenantId: { type: 'string', description: 'Tenant boundary for governed ingest.' }, userId: { type: 'string', description: 'User boundary for governed ingest.' }, agentId: { type: 'string', description: 'Agent boundary for governed ingest.' }, sessionId: { type: 'string', description: 'Session boundary for governed ingest.' }, sharedSpaceId: { type: 'string', description: 'Optional shared-memory space for collaboration saves.' }, provenanceSource: { type: 'string', description: 'Required provenance source when governance guardrails are enabled.' }, provenanceActor: { type: 'string', description: 'Required provenance actor when governance guardrails are enabled.' }, governedAt: { type: 'string', description: 'ISO timestamp for governed ingest. Defaults to now when omitted.' }, retentionPolicy: { type: 'string', enum: ['keep', 'ephemeral', 'shared'], description: 'Retention class applied to the saved memory.' }, deleteAfter: { type: 'string', description: 'Optional ISO timestamp after which retention sweep may delete the memory.' } }, required: ['filePath'] },

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Session Resume Handler
     3	// ───────────────────────────────────────────────────────────────
     4	// Phase 020: Composite MCP tool that merges memory resume context,
     5	// code graph status, and CocoIndex availability into a single call.
     6	
     7	import { createHash } from 'node:crypto';
     8	import { statSync } from 'node:fs';
     9	import { isCocoIndexAvailable } from '../lib/utils/cocoindex-path.js';
    10	import { handleMemoryContext } from './memory-context.js';
    11	import * as graphDb from '../lib/code-graph/code-graph-db.js';
    12	import { getGraphFreshness, type GraphFreshness } from '../lib/code-graph/ensure-ready.js';
    13	import { computeQualityScore, recordMetricEvent, recordBootstrapEvent } from '../lib/session/context-metrics.js';
    14	import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    15	import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
    16	import {
    17	  buildStructuralContextTrust,
    18	  createSharedPayloadEnvelope,
    19	  summarizeUnknown,
    20	  summarizeCertaintyContract,
    21	  trustStateFromStructuralStatus,
    22	  type SharedPayloadCertainty,
    23	  type SharedPayloadEnvelope,
    24	  type SharedPayloadSection,
    25	} from '../lib/context/shared-payload.js';
    26	import {
    27	  buildOpenCodeTransportPlan,
    28	  type OpenCodeTransportPlan,
    29	} from '../lib/context/opencode-transport.js';
    30	import {
    31	  buildCodeGraphOpsContract,
    32	  type CodeGraphOpsContract,
    33	} from '../lib/code-graph/ops-hardening.js';
    34	import { loadMostRecentState, type HookProducerMetadata, type HookState } from '../hooks/claude/hook-state.js';
    35	import type { MCPResponse } from '@spec-kit/shared/types';
    36	
    37	/* ───────────────────────────────────────────────────────────────
    38	   1. TYPES
    39	──────────────────────────────────────────────────────────────── */
    40	
    41	export const CACHED_SESSION_SUMMARY_SCHEMA_VERSION = 1;
    42	export const CACHED_SESSION_SUMMARY_MAX_AGE_MS = 30 * 60 * 1000;
    43	
    44	export interface CachedSessionSummaryCandidate {
    45	  schemaVersion: number;
    46	  lastSpecFolder: string | null;
    47	  summaryText: string | null;
    48	  extractedAt: string | null;
    49	  stateUpdatedAt: string | null;
    50	  producerMetadata: HookProducerMetadata | null;
    51	}
    52	
    53	export interface CachedSessionSummary {
    54	  schemaVersion: number;
    55	  lastSpecFolder: string;
    56	  summaryText: string;
    57	  extractedAt: string;
    58	  lastClaudeTurnAt: string;
    59	  transcriptPath: string;
    60	  transcriptFingerprint: string;
    61	  cacheCreationInputTokens: number;
    62	  cacheReadInputTokens: number;
    63	  continuityText: string;
    64	  startupHint: string;
    65	}
    66	
    67	export interface CachedSessionSummaryDecision {
    68	  status: 'accepted' | 'rejected';
    69	  category: 'accepted' | 'fidelity' | 'freshness';
    70	  reason:
    71	    | 'accepted'
    72	    | 'missing_state'
    73	    | 'schema_version_mismatch'
    74	    | 'missing_summary'
    75	    | 'missing_producer_metadata'
    76	    | 'missing_required_fields'
    77	    | 'transcript_unreadable'
    78	    | 'transcript_identity_mismatch'
    79	    | 'stale_summary'
    80	    | 'summary_precedes_producer_turn'
    81	    | 'scope_mismatch'
    82	    | 'unknown_scope';
    83	  detail: string;
    84	  cachedSummary: CachedSessionSummary | null;
    85	}
    86	
    87	interface SessionResumeArgs {
    88	  specFolder?: string;
    89	  sessionId?: string;
    90	  minimal?: boolean;
    91	}
    92	
    93	interface CodeGraphStatus {
    94	  status: 'fresh' | 'stale' | 'empty' | 'error';
    95	  lastScan: string | null;
    96	  nodeCount: number;
    97	  edgeCount: number;
    98	  fileCount: number;
    99	}
   100	
   101	interface CocoIndexStatus {
   102	  available: boolean;
   103	  binaryPath: string;
   104	}
   105	
   106	interface SessionResumeResult {
   107	  memory: Record<string, unknown>;
   108	  codeGraph: CodeGraphStatus;
   109	  cocoIndex: CocoIndexStatus;
   110	  cachedSummary?: CachedSessionSummaryDecision;
   111	  structuralContext?: StructuralBootstrapContract;
   112	  sessionQuality?: 'healthy' | 'degraded' | 'critical' | 'unknown';
   113	  payloadContract?: SharedPayloadEnvelope;
   114	  opencodeTransport?: OpenCodeTransportPlan;
   115	  graphOps?: CodeGraphOpsContract;
   116	  hints: string[];
   117	}
   118	
   119	/* ───────────────────────────────────────────────────────────────
   120	   2. HELPERS
   121	──────────────────────────────────────────────────────────────── */
   122	
   123	function normalizeSpecFolder(specFolder: string | null | undefined): string | null {
   124	  if (typeof specFolder !== 'string') {
   125	    return null;
   126	  }
   127	
   128	  const trimmed = specFolder.trim();
   129	  if (trimmed.length === 0) {
   130	    return null;
   131	  }
   132	
   133	  return trimmed.replace(/^\.opencode\//, '');
   134	}
   135	
   136	function parseIsoMs(value: string | null | undefined): number | null {
   137	  if (typeof value !== 'string' || value.trim().length === 0) {
   138	    return null;
   139	  }
   140	
   141	  const parsed = Date.parse(value);
   142	  return Number.isNaN(parsed) ? null : parsed;
   143	}
   144	
   145	function isFiniteNonNegativeNumber(value: unknown): value is number {
   146	  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
   147	}
   148	
   149	function buildTranscriptFingerprint(
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts | sed -n '215,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "ensureSession|/sessions|/observations|/context|/search|mem_session_summary|FIRST ACTION REQUIRED|tool call|sub-agent" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
11: *   Uses `ensureSession()` before any DB write. This means sessions are
25:// Engram's own MCP tools — don't count these as "tool calls" for session stats
33:  "mem_session_summary",
92:1. Call \`mem_session_summary\` with this structure:
116:If you see a message about compaction or context reset, or if you see "FIRST ACTION REQUIRED" in your context:
117:1. IMMEDIATELY call \`mem_session_summary\` with the compacted summary content — this persists what was done before compaction
209:  // Track sub-agent session IDs so we can suppress their tool-hook registrations.
216:   * Ensure a session exists in engram. Idempotent — calls POST /sessions
219:   * Silently skips sub-agent sessions (tracked in `subAgentSessions`).
221:  async function ensureSession(sessionId: string): Promise<void> {
223:    // Do not register sub-agent sessions in Engram (issue #116).
226:    await engramFetch("/sessions", {
297:        //   - parentID is set on all Task() sub-agent sessions
302:          await ensureSession(sessionId)
304:          // Remember this as a sub-agent session so tool-hook calls
305:          // to ensureSession() are also suppressed for it.
331:      // Skip sub-agent sessions — they inflate session counts (issue #116)
352:        await ensureSession(sessionId)
365:    // Count tool calls per session (for session end stats).
376:        await ensureSession(sessionId)
384:          await engramFetch("/observations/passive", {
425:        await ensureSession(input.sessionID)
430:        `/context?project=${encodeURIComponent(project)}`
443:        `"FIRST ACTION REQUIRED: Call mem_session_summary with the content of this compacted summary. ` +

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3170,3215p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '2221,2515p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2221	func (s *Store) MigrateProject(oldName, newName string) (*MigrateResult, error) {
  2222		if oldName == "" || newName == "" || oldName == newName {
  2223			return &MigrateResult{}, nil
  2224		}
  2225	
  2226		// Check if old project has any records (short-circuit on first match)
  2227		var exists bool
  2228		err := s.db.QueryRow(
  2229			`SELECT EXISTS(
  2230				SELECT 1 FROM observations WHERE project = ?
  2231				UNION ALL
  2232				SELECT 1 FROM sessions WHERE project = ?
  2233				UNION ALL
  2234				SELECT 1 FROM user_prompts WHERE project = ?
  2235			)`, oldName, oldName, oldName,
  2236		).Scan(&exists)
  2237		if err != nil {
  2238			return nil, fmt.Errorf("check old project: %w", err)
  2239		}
  2240		if !exists {
  2241			return &MigrateResult{}, nil
  2242		}
  2243	
  2244		result := &MigrateResult{Migrated: true}
  2245	
  2246		err = s.withTx(func(tx *sql.Tx) error {
  2247			// FTS triggers handle index updates automatically on UPDATE
  2248			res, err := s.execHook(tx, `UPDATE observations SET project = ? WHERE project = ?`, newName, oldName)
  2249			if err != nil {
  2250				return fmt.Errorf("migrate observations: %w", err)
  2251			}
  2252			result.ObservationsUpdated, _ = res.RowsAffected()
  2253	
  2254			res, err = s.execHook(tx, `UPDATE sessions SET project = ? WHERE project = ?`, newName, oldName)
  2255			if err != nil {
  2256				return fmt.Errorf("migrate sessions: %w", err)
  2257			}
  2258			result.SessionsUpdated, _ = res.RowsAffected()
  2259	
  2260			res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, newName, oldName)
  2261			if err != nil {
  2262				return fmt.Errorf("migrate prompts: %w", err)
  2263			}
  2264			result.PromptsUpdated, _ = res.RowsAffected()
  2265	
  2266			// Enqueue sync mutations so cloud sync picks up the migrated records.
  2267			// Same pattern used by EnrollProject and MergeProjects.
  2268			return s.backfillProjectSyncMutationsTx(tx, newName)
  2269		})
  2270		if err != nil {
  2271			return nil, err
  2272		}
  2273	
  2274		return result, nil
  2275	}
  2276	
  2277	// ─── Project Queries ──────────────────────────────────────────────────────────
  2278	
  2279	// ProjectNameCount holds a project name and how many observations it has.
  2280	type ProjectNameCount struct {
  2281		Name  string `json:"name"`
  2282		Count int    `json:"count"`
  2283	}
  2284	
  2285	// ListProjectNames returns all distinct project names from observations,
  2286	// ordered alphabetically. Used for fuzzy matching and consolidation.
  2287	func (s *Store) ListProjectNames() ([]string, error) {
  2288		rows, err := s.queryItHook(s.db,
  2289			`SELECT DISTINCT project FROM observations
  2290			 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
  2291			 ORDER BY project`,
  2292		)
  2293		if err != nil {
  2294			return nil, err
  2295		}
  2296		defer rows.Close()
  2297	
  2298		var results []string
  2299		for rows.Next() {
  2300			var name string
  2301			if err := rows.Scan(&name); err != nil {
  2302				return nil, err
  2303			}
  2304			results = append(results, name)
  2305		}
  2306		return results, rows.Err()
  2307	}
  2308	
  2309	// ProjectStats holds aggregate statistics for a single project.
  2310	type ProjectStats struct {
  2311		Name             string   `json:"name"`
  2312		ObservationCount int      `json:"observation_count"`
  2313		SessionCount     int      `json:"session_count"`
  2314		PromptCount      int      `json:"prompt_count"`
  2315		Directories      []string `json:"directories"` // unique directories from sessions
  2316	}
  2317	
  2318	// ListProjectsWithStats returns all projects with aggregated counts.
  2319	// Ordered by observation count descending.
  2320	func (s *Store) ListProjectsWithStats() ([]ProjectStats, error) {
  2321		// Observation counts per project
  2322		obsRows, err := s.queryItHook(s.db,
  2323			`SELECT project, COUNT(*) as cnt
  2324			 FROM observations
  2325			 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
  2326			 GROUP BY project`,
  2327		)
  2328		if err != nil {
  2329			return nil, fmt.Errorf("list projects obs: %w", err)
  2330		}
  2331		defer obsRows.Close()
  2332	
  2333		statsMap := make(map[string]*ProjectStats)
  2334		for obsRows.Next() {
  2335			var name string
  2336			var cnt int
  2337			if err := obsRows.Scan(&name, &cnt); err != nil {
  2338				return nil, err
  2339			}
  2340			statsMap[name] = &ProjectStats{Name: name, ObservationCount: cnt}
  2341		}
  2342		if err := obsRows.Err(); err != nil {
  2343			return nil, err
  2344		}
  2345	
  2346		// Session counts + directories per project
  2347		sessRows, err := s.queryItHook(s.db,
  2348			`SELECT project, COUNT(*) as cnt, directory
  2349			 FROM sessions
  2350			 WHERE project IS NOT NULL AND project != ''
  2351			 GROUP BY project, directory`,
  2352		)
  2353		if err != nil {
  2354			return nil, fmt.Errorf("list projects sessions: %w", err)
  2355		}
  2356		defer sessRows.Close()
  2357	
  2358		type projDir struct {
  2359			count int
  2360			dirs  map[string]bool
  2361		}
  2362		sessData := make(map[string]*projDir)
  2363		for sessRows.Next() {
  2364			var name, dir string
  2365			var cnt int
  2366			if err := sessRows.Scan(&name, &cnt, &dir); err != nil {
  2367				return nil, err
  2368			}
  2369			if sessData[name] == nil {
  2370				sessData[name] = &projDir{dirs: make(map[string]bool)}
  2371			}
  2372			sessData[name].count += cnt
  2373			if dir != "" {
  2374				sessData[name].dirs[dir] = true
  2375			}
  2376		}
  2377		if err := sessRows.Err(); err != nil {
  2378			return nil, err
  2379		}
  2380	
  2381		for name, sd := range sessData {
  2382			if statsMap[name] == nil {
  2383				statsMap[name] = &ProjectStats{Name: name}
  2384			}
  2385			statsMap[name].SessionCount = sd.count
  2386			for d := range sd.dirs {
  2387				statsMap[name].Directories = append(statsMap[name].Directories, d)
  2388			}
  2389		}
  2390	
  2391		// Prompt counts per project
  2392		promptRows, err := s.queryItHook(s.db,
  2393			`SELECT project, COUNT(*) as cnt
  2394			 FROM user_prompts
  2395			 WHERE project IS NOT NULL AND project != ''
  2396			 GROUP BY project`,
  2397		)
  2398		if err != nil {
  2399			return nil, fmt.Errorf("list projects prompts: %w", err)
  2400		}
  2401		defer promptRows.Close()
  2402	
  2403		for promptRows.Next() {
  2404			var name string
  2405			var cnt int
  2406			if err := promptRows.Scan(&name, &cnt); err != nil {
  2407				return nil, err
  2408			}
  2409			if statsMap[name] == nil {
  2410				statsMap[name] = &ProjectStats{Name: name}
  2411			}
  2412			statsMap[name].PromptCount = cnt
  2413		}
  2414		if err := promptRows.Err(); err != nil {
  2415			return nil, err
  2416		}
  2417	
  2418		// Convert to slice, sorted by observation count descending
  2419		results := make([]ProjectStats, 0, len(statsMap))
  2420		for _, ps := range statsMap {
  2421			results = append(results, *ps)
  2422		}
  2423		// Simple insertion sort — project lists are small
  2424		for i := 1; i < len(results); i++ {
  2425			for j := i; j > 0 && results[j].ObservationCount > results[j-1].ObservationCount; j-- {
  2426				results[j], results[j-1] = results[j-1], results[j]
  2427			}
  2428		}
  2429	
  2430		return results, nil
  2431	}
  2432	
  2433	// CountObservationsForProject returns the number of non-deleted observations
  2434	// for the given project name. Used by handleSave for the similar-project
  2435	// warning instead of the heavier ListProjectsWithStats.
  2436	func (s *Store) CountObservationsForProject(name string) (int, error) {
  2437		var count int
  2438		err := s.db.QueryRow(
  2439			`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3390,3465p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
I’ve got the exact registration and adapter lines pinned down. I’m doing one lightweight memory refresh against prior Engram work now so I can avoid repeating already-settled points and keep this pass centered on genuinely new tool-surface observations.
mcp: spec_kit_memory/memory_context started
mcp: spec_kit_memory/memory_context (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ---------------------------------------------------------------
     2	// MODULE: Generate Context
     3	// ---------------------------------------------------------------
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. GENERATE CONTEXT
     7	// ───────────────────────────────────────────────────────────────
     8	// CLI entry point -- parses arguments, validates spec folder, and runs the memory workflow
     9	
    10	// Node stdlib
    11	import * as path from 'path';
    12	import * as fsSync from 'fs';
    13	
    14	// Internal modules
    15	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    16	import {
    17	  CONFIG,
    18	  findActiveSpecsDir,
    19	  getSpecsDirectories,
    20	  SPEC_FOLDER_PATTERN,
    21	  SPEC_FOLDER_BASIC_PATTERN,
    22	  CATEGORY_FOLDER_PATTERN,
    23	  findChildFolderSync,
    24	} from '../core';
    25	import { runWorkflow, releaseFilesystemLock } from '../core/workflow';
    26	import { loadCollectedData } from '../loaders';
    27	import { collectSessionData } from '../extractors/collect-session-data';
    28	
    29	type StructuredCollectedData = Record<string, unknown> & { _source: 'file' };
    30	
    31	interface ParsedCliArguments {
    32	  dataFile: string | null;
    33	  specFolderArg: string | null;
    34	  collectedData: StructuredCollectedData | null;
    35	  sessionId: string | null;
    36	}
    37	
    38	// ───────────────────────────────────────────────────────────────
    39	// 2. INTERFACES
    40	// ───────────────────────────────────────────────────────────────
    41	/** Result of validating a requested spec folder reference. */
    42	export interface SpecFolderValidation {
    43	  valid: boolean;
    44	  reason?: string;
    45	  warning?: string;
    46	}
    47	
    48	// ───────────────────────────────────────────────────────────────
    49	// 3. HELP TEXT
    50	// ───────────────────────────────────────────────────────────────
    51	const HELP_TEXT = `
    52	Usage: node generate-context.js [options] <input>
    53	
    54	Arguments:
    55	  <input>           A JSON data file path
    56	                    - JSON file mode: node generate-context.js data.json [spec-folder]
    57	
    58	Options:
    59	  --help, -h        Show this help message
    60	  --stdin           Read structured JSON from stdin (preferred when a caller already has curated session data)
    61	  --json <string>   Read structured JSON from an inline string (preferred when structured data is available)
    62	  --session-id <uuid>  Explicit session ID to attach to the saved memory metadata
    63	
    64	Examples:
    65	  node generate-context.js /tmp/context-data.json
    66	  node generate-context.js /tmp/context-data.json specs/001-feature/
    67	  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
    68	  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
    69	  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
    70	
    71	Output:
    72	  Creates a memory file in <spec-folder>/memory/ with ANCHOR format
    73	  for indexing by the Spec Kit Memory system.
    74	
    75	Preferred save path (JSON-PRIMARY):
    76	  - ALWAYS use --stdin, --json, or a JSON temp file.
    77	  - The AI has strictly better information about its own session than any DB query can reconstruct.
    78	  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
    79	
    80	Direct CLI target rule:
    81	  - When a spec folder is passed on the CLI, that explicit target is authoritative.
    82	  - Session learning, JSON SPEC_FOLDER fields, and auto-detect may inform logging,
    83	    but they must not reroute the save to another folder.
    84	
    85	JSON Data Format (with preflight/postflight, session/git, and tool/exchange enrichment):
    86	  {
    87	    "user_prompts": [...],
    88	    "observations": [...],
    89	    "recent_context": [...],
    90	    "toolCalls": [
    91	      { "tool": "Read", "inputSummary": "Read data-loader.ts", "outputSummary": "585 lines", "status": "success", "durationEstimate": "fast" },
    92	      { "tool": "Edit", "inputSummary": "Added deprecation warning", "outputSummary": "Inserted 10 lines", "status": "success" }
    93	    ],
    94	    "exchanges": [
    95	      { "userInput": "Implement the JSON-primary plan", "assistantResponse": "Updated 8 files...", "timestamp": "ISO-8601" }
    96	    ],
    97	    "preflight": {
    98	      "knowledgeScore": 40,
    99	      "uncertaintyScore": 60,
   100	      "contextScore": 50,
   101	      "timestamp": "ISO-8601",
   102	      "gaps": ["gap1", "gap2"],
   103	      "confidence": 45,
   104	      "readiness": "Needs research"
   105	    },
   106	    "postflight": {
   107	      "knowledgeScore": 75,
   108	      "uncertaintyScore": 25,
   109	      "contextScore": 80,
   110	      "gapsClosed": ["gap1"],
   111	      "newGaps": ["new-gap"]
   112	    }
   113	  }
   114	
   115	  Tool/Exchange enrichment fields (all optional — JSON-mode only):
   116	  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
   117	  - exchanges[]: Key user-assistant exchanges with timestamps
   118	  - These provide richer context than DB extraction since the AI filters noise at source
   119	
   120	  Learning Delta Calculation:

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Memory Save Handler
     3	// ───────────────────────────────────────────────────────────────
     4	/* --- 1. DEPENDENCIES --- */
     5	
     6	// Node built-ins
     7	import { randomUUID } from 'node:crypto';
     8	import * as fs from 'node:fs';
     9	import path from 'path';
    10	
    11	// Shared packages
    12	import { validateFilePath } from '@spec-kit/shared/utils/path-security';
    13	import {
    14	  evaluateMemorySufficiency,
    15	  MEMORY_SUFFICIENCY_REJECTION_CODE,
    16	  type MemorySufficiencyResult,
    17	} from '@spec-kit/shared/parsing/memory-sufficiency';
    18	import {
    19	  validateMemoryTemplateContract,
    20	  type MemoryTemplateContractResult,
    21	} from '@spec-kit/shared/parsing/memory-template-contract';
    22	import {
    23	  evaluateSpecDocHealth,
    24	  type SpecDocHealthResult,
    25	} from '@spec-kit/shared/parsing/spec-doc-health';
    26	
    27	// Internal modules
    28	import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
    29	import { createFilePathValidator } from '../utils/validators.js';
    30	import * as memoryParser from '../lib/parsing/memory-parser.js';
    31	import * as transactionManager from '../lib/storage/transaction-manager.js';
    32	import * as checkpoints from '../lib/storage/checkpoints.js';
    33	import * as preflight from '../lib/validation/preflight.js';
    34	import { requireDb } from '../utils/index.js';
    35	import type { MCPResponse } from './types.js';
    36	import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
    37	import * as causalEdges from '../lib/storage/causal-edges.js';
    38	
    39	import { runQualityGate, isQualityGateEnabled } from '../lib/validation/save-quality-gate.js';
    40	import { isSaveQualityGateEnabled } from '../lib/search/search-flags.js';
    41	
    42	import { getCanonicalPathKey } from '../lib/utils/canonical-path.js';
    43	import { findSimilarMemories } from './pe-gating.js';
    44	import { runPostMutationHooks } from './mutation-hooks.js';
    45	import { buildMutationHookFeedback } from '../hooks/mutation-feedback.js';
    46	import { needsChunking, indexChunkedMemoryFile } from './chunking-orchestrator.js';
    47	import { applyPostInsertMetadata } from './save/db-helpers.js';
    48	import { createMemoryRecord, findSamePathExistingMemory, type MemoryScopeMatch } from './save/create-record.js';
    49	import {
    50	  buildGovernancePostInsertFields,
    51	  ensureGovernanceRuntime,
    52	  recordGovernanceAudit,
    53	  validateGovernedIngest,
    54	} from '../lib/governance/scope-governance.js';
    55	import {
    56	  assertSharedSpaceAccess,
    57	  recordSharedConflict,
    58	} from '../lib/collab/shared-spaces.js';
    59	import { delete_memory_from_database } from '../lib/search/vector-index-mutations.js';
    60	import {
    61	  runQualityLoop,
    62	} from './quality-loop.js';
    63	import type {
    64	  QualityLoopResult,
    65	} from './quality-loop.js';
    66	
    67	// O2-5/O2-12: V-rule validation (previously only in workflow path)
    68	import {
    69	  validateMemoryQualityContent,
    70	  determineValidationDisposition,
    71	} from './v-rule-bridge.js';
    72	
    73	// Save pipeline modules (CR-P2-4 decomposition)
    74	import type {
    75	  IndexResult,
    76	  SaveArgs,
    77	  AtomicSaveParams,
    78	  AtomicSaveOptions,
    79	  AtomicSaveResult,
    80	} from './save/index.js';
    81	import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
    82	import { generateOrCacheEmbedding, persistPendingEmbeddingCacheWrite } from './save/embedding-pipeline.js';
    83	import { evaluateAndApplyPeDecision } from './save/pe-orchestration.js';
    84	import { runReconsolidationIfEnabled } from './save/reconsolidation-bridge.js';
    85	import { runPostInsertEnrichment } from './save/post-insert.js';
    86	import { buildIndexResult, buildSaveResponse } from './save/response-builder.js';
    87	import { createMCPErrorResponse } from '../lib/response/envelope.js';
    88	
    89	// Extracted sub-modules
    90	import { withSpecFolderLock } from './save/spec-folder-mutex.js';
    91	import { buildParsedMemoryEvidenceSnapshot } from './save/markdown-evidence-builder.js';
    92	import {
    93	  applyInsufficiencyMetadata,
    94	  buildInsufficiencyRejectionResult,
    95	  buildTemplateContractRejectionResult,
    96	  buildDryRunSummary,
    97	} from './save/validation-responses.js';
    98	
    99	import { markMemorySuperseded } from './pe-gating.js';
   100	import { resolveMemoryReference } from './causal-links-processor.js';
   101	import { refreshAutoEntitiesForMemory } from '../lib/extraction/entity-extractor.js';
   102	
   103	// Feature catalog: Memory indexing (memory_save)
   104	// Feature catalog: Verify-fix-verify memory quality loop
   105	// Feature catalog: Dry-run preflight for memory_save
   106	// Feature catalog: Prediction-error save arbitration
   107	
   108	
   109	// Create local path validator
   110	const validateFilePathLocal = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);
   111	const MANUAL_FALLBACK_SOURCE_CLASSIFICATION = 'manual-fallback' as const;
   112	
   113	interface PreparedParsedMemory {
   114	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>;
   115	  validation: ReturnType<typeof memoryParser.validateParsedMemory>;
   116	  qualityLoopResult: QualityLoopResult;
   117	  sufficiencyResult: MemorySufficiencyResult;
   118	  templateContract: MemoryTemplateContractResult;
   119	  specDocHealth: SpecDocHealthResult | null;
   120	  finalizedFileContent: string | null;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '780,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	        rootMemoryId,
   781	        activeMemoryId: memoryId,
   782	        predecessorMemoryId,
   783	        transitionEvent,
   784	      } as RecordedLineageTransition;
   785	    });
   786	
   787	    try {
   788	      return recordTransitionTx();
   789	    } catch (error: unknown) {
   790	      const shouldRetry = isLogicalVersionConflict(error) && attempt < MAX_LINEAGE_VERSION_RETRIES;
   791	      if (!shouldRetry) {
   792	        throw error;
   793	      }
   794	
   795	      logger.warn(
   796	        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
   797	        `(attempt ${attempt + 1}/${MAX_LINEAGE_VERSION_RETRIES})`,
   798	      );
   799	    }
   800	  }
   801	
   802	  throw new Error(`E_LINEAGE: exhausted retries while recording lineage for memory ${memoryId}`);
   803	}
   804	
   805	/**
   806	 * Create a new append-only memory row and wire it into lineage state.
   807	 *
   808	 * @param params - Parsed memory payload and append-only lineage metadata.
   809	 * @returns Identifier of the newly inserted memory row.
   810	 */
   811	export function createAppendOnlyMemoryRecord(params: CreateAppendOnlyMemoryRecordParams): number {
   812	  bindHistory(params.database);
   813	  const appendTx = params.database.transaction(() => {
   814	    const memoryId = insertAppendOnlyMemoryIndexRow(params);
   815	    recordLineageTransition(params.database, memoryId, {
   816	      actor: params.actor ?? 'mcp:memory_save',
   817	      predecessorMemoryId: params.predecessorMemoryId,
   818	      transitionEvent: 'SUPERSEDE',
   819	    });
   820	    return memoryId;
   821	  });
   822	
   823	  return appendTx();
   824	}
   825	
   826	function resolveLogicalKey(database: Database.Database, memoryId: number): string | null {
   827	  const row = getLineageRow(database, memoryId);
   828	  if (row) {
   829	    return row.logical_key;
   830	  }
   831	
   832	  const memoryRow = getMemoryRow(database, memoryId);
   833	  const projection = getActiveProjection(database, buildLogicalKey(memoryRow));
   834	  return projection?.logical_key ?? buildLogicalKey(memoryRow);
   835	}
   836	
   837	/**
   838	 * Return the full ordered lineage chain for the logical key behind a memory.
   839	 *
   840	 * @param database - Database connection that stores lineage state.
   841	 * @param memoryId - Memory identifier used to resolve the logical key.
   842	 * @returns Ordered lineage snapshots from oldest to newest version.
   843	 */
   844	export function inspectLineageChain(database: Database.Database, memoryId: number): ResolvedLineageSnapshot[] {
   845	  bindHistory(database);
   846	  ensureLineageTables(database);
   847	  const lineage = loadLineageRowsForMemory(database, memoryId);
   848	  if (!lineage) {
   849	    return [];
   850	  }
   851	
   852	  return lineage.rows.map((row) => resolveSnapshotFromLineageRow(database, row));
   853	}
   854	
   855	/**
   856	 * Build a compact operator-facing summary for the lineage behind a memory.
   857	 *
   858	 * @param database - Database connection that stores lineage state.
   859	 * @param memoryId - Memory identifier used to resolve the logical key.
   860	 * @returns Aggregated lineage summary when one exists.

exec
/bin/zsh -lc 'rg -n "createAppendOnlyMemoryRecord|recordLineageVersion|append-only|lineage" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:36:import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:938:        ? createAppendOnlyMemoryRecord({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:967:      recordLineageVersion(database, {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:4:// Provides append-first lineage transitions, active projection reads,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:136:  lineageRowCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:262:      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:281:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:299:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:319:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:339:    && message.includes('memory_lineage.logical_key')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:340:    && message.includes('memory_lineage.version_number')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:350:  // during lineage inspection, but the full metadata provides forensic context
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:375:    logger.warn(`Invalid lineage metadata shape for memory ${row.memory_id}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:378:    logger.warn(`Failed to parse lineage metadata for memory ${row.memory_id}: ${error instanceof Error ? error.message : String(error)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:547:// R1: Shared early-return helper for lineage functions.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:592: * Seed lineage state from an existing memory row when no lineage entry exists yet.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:594: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:595: * @param memoryId - Memory version to seed into lineage tables.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:597: * @returns Seeded lineage state for the requested memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:620:      INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:659: * Seed or append a lineage transition for a memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:661: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:664: * @returns Recorded lineage state for the requested memory version.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:678:    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:741:          UPDATE memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:750:        INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:796:        `Retrying lineage insert for memory ${memoryId} after logical_key/version_number conflict ` +
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:802:  throw new Error(`E_LINEAGE: exhausted retries while recording lineage for memory ${memoryId}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:806: * Create a new append-only memory row and wire it into lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:808: * @param params - Parsed memory payload and append-only lineage metadata.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:811:export function createAppendOnlyMemoryRecord(params: CreateAppendOnlyMemoryRecordParams): number {
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
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1152:          INSERT INTO memory_lineage (
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
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1257:export function recordLineageVersion(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1291: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1293: * @returns Active lineage snapshot when one exists.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1305: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1317: * Compatibility wrapper that executes the lineage backfill workflow.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1319: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1331: * Benchmark append-first lineage writes across an ordered chain of memory ids.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1333: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1359:  const actor = options.actor ?? 'memory-lineage:benchmark';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1393: * Public lineage result types exposed to tests and compatibility helpers.

codex
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings
### Finding 1: Engram’s profile split is enforced at registration time, while Public’s split is descriptive rather than executable
- **Source**: [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L7), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L50), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L121), [layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts#L42), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L878)
- **What it does**: Engram resolves `agent` and `admin` profiles into an allowlist with `ResolveTools()`, then only registers matching tools with `shouldRegister()`. Within that set, it further marks non-core tools with `WithDeferLoading(true)`, so “profile” and “load timing” are both runtime behavior, not just docs. Public already has strong L1-L7 metadata and ordered tool definitions, but it still exposes one canonical server surface.
- **Why it matters for us**: This is the clearest tool-surface gap. Public has the semantics needed for safe subsets, but not the runtime filtering. We could derive install-time or launch-time profiles from existing layer metadata instead of hand-maintaining separate lists.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram is not MCP-only in practice; its OpenCode integration is HTTP-first and sidecar-driven
- **Source**: [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L147), [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L225), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L97), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L4), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L221)
- **What it does**: One binary exposes CLI, MCP stdio, HTTP REST, and TUI. But the OpenCode plugin does not consume MCP; it calls localhost HTTP, auto-starts `engram serve`, posts sessions/prompts/passive captures, and hits `/context` during compaction.
- **Why it matters for us**: This is operationally flexible, but it creates a second integration contract beside MCP. Public’s memory system is already MCP-centric plus file-backed `generate-context`; copying Engram’s sidecar HTTP path would split authority and expand drift risk.
- **Recommendation**: reject
- **Impact**: medium

### Finding 3: Engram’s continuity contract lives partly in APIs, but heavily in duplicated setup-time prompt text
- **Source**: [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L95), [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L104), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L45), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L397), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L4), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L71)
- **What it does**: Engram writes large memory-protocol and compaction instructions into runtime-specific setup outputs, then the OpenCode plugin appends those instructions to system prompts and compaction context. The APIs exist, but host-specific instruction injection is doing a lot of the real continuity work. Public instead centralizes recovery in `session_resume` and `session_bootstrap`, and preserves save authority in JSON-primary `generate-context`.
- **Why it matters for us**: Engram’s approach is portable, but brittle: the behavior depends on duplicated prose across setup layers. Public’s recovery surface is already stronger than this. The only useful borrowing here is small host-specific nudges that point back to canonical recovery tools.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Engram treats project identity as a first-class API boundary, with normalization, drift detection, migration, and merge tooling
- **Source**: [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L243), [detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go#L16), [similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go#L12), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2221), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2455), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3174)
- **What it does**: Engram auto-detects project from git/cwd, normalizes project names, warns on similar names, exposes `POST /projects/migrate`, and offers `mem_merge_projects` for canonicalization. Project naming is the main isolation and cleanup surface above the store.
- **Why it matters for us**: Public already goes further with `tenantId`, `userId`, `agentId`, `sharedSpaceId`, and session-scoped retrieval. So Engram’s project model is weaker as a security or governance boundary. Still, its normalization and “similar project” detection are useful ergonomic patterns for local-only workflows.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Engram’s explicit session lifecycle APIs are good mutation primitives, but not a full recovery contract
- **Source**: [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L100), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L215), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L740), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L755)
- **What it does**: Engram has narrow session mutation surfaces: start, end, summary, plus idempotent `ensureSession()` in the plugin. That is clean. But startup recovery is still basically `mem_context` plus prompt injection, rather than one authoritative “resume everything” tool. Public already has that composite recovery contract in `session_resume` and `session_bootstrap`.
- **Why it matters for us**: The part worth borrowing is the durable session mutation layer, not the overall recovery model. A lightweight session ledger or explicit checkpoint write could harden Public’s continuity without replacing `session_bootstrap`.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Engram proves install-time agent-safe profiles are operationally valuable, and Public can implement them from metadata it already has
- **Source**: [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L72), [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L212), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L50), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L40), [layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts#L42)
- **What it does**: Engram setup consistently installs `engram mcp --tools=agent` into Codex and other runtimes, and even preloads Claude permissions for just that narrowed toolset. Public already has richer categorization than Engram, but it does not yet turn that metadata into installation-time or startup-time profiles.
- **Why it matters for us**: This is the strongest concrete adoption candidate from the tool-surface pass. Public can expose derived profiles such as `agent-core`, `analysis`, `maintenance`, and `admin` using existing layer metadata, instead of cloning Engram’s exact two-profile maps.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/cmd/engram/main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/setup/setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go)
- [external/plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts)
- [external/internal/project/detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go)
- [external/internal/project/similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/lib/architecture/layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q1, Q2, Q7, Q8, Q9, Q10
- Questions answered: Q1, Q7, Q8, Q9; Q2 and Q10 partially

## Reflection
- What worked: tracing `internal/mcp/mcp.go`, `internal/setup/setup.go`, and `plugin/opencode/engram.ts` together made the real tool surface obvious; the decisive comparison was Engram’s executable profile filtering versus Public’s metadata-only layering.
- What did not work: CocoIndex MCP calls were not usable in this session, so I fell back to `rg` plus direct file reads; the strict validation command passed, but also emitted `cannot create temp file for here document: Operation not permitted`, so validation was only partially clean in this read-only sandbox.

## Recommended Next Focus
Trace Engram’s sync and project-consolidation surface end to end through `internal/sync/`, the `sync_*` tables in `internal/store/store.go`, `projects consolidate`, and the plugin/setup entrypoints, then compare that against Public’s governed scopes and shared-memory boundaries to decide whether any replication or local-first isolation patterns are worth adopting.
hook: Stop
hook: Stop Completed
tokens used
182,233
# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings
### Finding 1: Engram’s profile split is enforced at registration time, while Public’s split is descriptive rather than executable
- **Source**: [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L7), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L50), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L121), [layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts#L42), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L878)
- **What it does**: Engram resolves `agent` and `admin` profiles into an allowlist with `ResolveTools()`, then only registers matching tools with `shouldRegister()`. Within that set, it further marks non-core tools with `WithDeferLoading(true)`, so “profile” and “load timing” are both runtime behavior, not just docs. Public already has strong L1-L7 metadata and ordered tool definitions, but it still exposes one canonical server surface.
- **Why it matters for us**: This is the clearest tool-surface gap. Public has the semantics needed for safe subsets, but not the runtime filtering. We could derive install-time or launch-time profiles from existing layer metadata instead of hand-maintaining separate lists.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: Engram is not MCP-only in practice; its OpenCode integration is HTTP-first and sidecar-driven
- **Source**: [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L147), [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L225), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L97), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L4), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L221)
- **What it does**: One binary exposes CLI, MCP stdio, HTTP REST, and TUI. But the OpenCode plugin does not consume MCP; it calls localhost HTTP, auto-starts `engram serve`, posts sessions/prompts/passive captures, and hits `/context` during compaction.
- **Why it matters for us**: This is operationally flexible, but it creates a second integration contract beside MCP. Public’s memory system is already MCP-centric plus file-backed `generate-context`; copying Engram’s sidecar HTTP path would split authority and expand drift risk.
- **Recommendation**: reject
- **Impact**: medium

### Finding 3: Engram’s continuity contract lives partly in APIs, but heavily in duplicated setup-time prompt text
- **Source**: [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L95), [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L104), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L45), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L397), [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts#L4), [generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts#L71)
- **What it does**: Engram writes large memory-protocol and compaction instructions into runtime-specific setup outputs, then the OpenCode plugin appends those instructions to system prompts and compaction context. The APIs exist, but host-specific instruction injection is doing a lot of the real continuity work. Public instead centralizes recovery in `session_resume` and `session_bootstrap`, and preserves save authority in JSON-primary `generate-context`.
- **Why it matters for us**: Engram’s approach is portable, but brittle: the behavior depends on duplicated prose across setup layers. Public’s recovery surface is already stronger than this. The only useful borrowing here is small host-specific nudges that point back to canonical recovery tools.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Engram treats project identity as a first-class API boundary, with normalization, drift detection, migration, and merge tooling
- **Source**: [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go#L243), [detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go#L16), [similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go#L12), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2221), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L2455), [store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3174)
- **What it does**: Engram auto-detects project from git/cwd, normalizes project names, warns on similar names, exposes `POST /projects/migrate`, and offers `mem_merge_projects` for canonicalization. Project naming is the main isolation and cleanup surface above the store.
- **Why it matters for us**: Public already goes further with `tenantId`, `userId`, `agentId`, `sharedSpaceId`, and session-scoped retrieval. So Engram’s project model is weaker as a security or governance boundary. Still, its normalization and “similar project” detection are useful ergonomic patterns for local-only workflows.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Engram’s explicit session lifecycle APIs are good mutation primitives, but not a full recovery contract
- **Source**: [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L460), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go#L100), [engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts#L215), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L740), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L755)
- **What it does**: Engram has narrow session mutation surfaces: start, end, summary, plus idempotent `ensureSession()` in the plugin. That is clean. But startup recovery is still basically `mem_context` plus prompt injection, rather than one authoritative “resume everything” tool. Public already has that composite recovery contract in `session_resume` and `session_bootstrap`.
- **Why it matters for us**: The part worth borrowing is the durable session mutation layer, not the overall recovery model. A lightweight session ledger or explicit checkpoint write could harden Public’s continuity without replacing `session_bootstrap`.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Engram proves install-time agent-safe profiles are operationally valuable, and Public can implement them from metadata it already has
- **Source**: [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L72), [setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go#L212), [mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L50), [tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L40), [layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts#L42)
- **What it does**: Engram setup consistently installs `engram mcp --tools=agent` into Codex and other runtimes, and even preloads Claude permissions for just that narrowed toolset. Public already has richer categorization than Engram, but it does not yet turn that metadata into installation-time or startup-time profiles.
- **Why it matters for us**: This is the strongest concrete adoption candidate from the tool-surface pass. Public can expose derived profiles such as `agent-core`, `analysis`, `maintenance`, and `admin` using existing layer metadata, instead of cloning Engram’s exact two-profile maps.
- **Recommendation**: adopt now
- **Impact**: high

## Sources Consulted
- [AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/AGENTS.md)
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/cmd/engram/main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/cmd/engram/main.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/setup/setup.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/setup/setup.go)
- [external/plugin/opencode/engram.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/plugin/opencode/engram.ts)
- [external/internal/project/detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go)
- [external/internal/project/similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/tool-schemas.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
- [mcp_server/lib/architecture/layer-definitions.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts)
- [mcp_server/handlers/session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [scripts/memory/generate-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)

## Assessment
- New information ratio: 0.74
- Questions addressed: Q1, Q2, Q7, Q8, Q9, Q10
- Questions answered: Q1, Q7, Q8, Q9; Q2 and Q10 partially

## Reflection
- What worked: tracing `internal/mcp/mcp.go`, `internal/setup/setup.go`, and `plugin/opencode/engram.ts` together made the real tool surface obvious; the decisive comparison was Engram’s executable profile filtering versus Public’s metadata-only layering.
- What did not work: CocoIndex MCP calls were not usable in this session, so I fell back to `rg` plus direct file reads; the strict validation command passed, but also emitted `cannot create temp file for here document: Operation not permitted`, so validation was only partially clean in this read-only sandbox.

## Recommended Next Focus
Trace Engram’s sync and project-consolidation surface end to end through `internal/sync/`, the `sync_*` tables in `internal/store/store.go`, `projects consolidate`, and the plugin/setup entrypoints, then compare that against Public’s governed scopes and shared-memory boundaries to decide whether any replication or local-first isolation patterns are worth adopting.
