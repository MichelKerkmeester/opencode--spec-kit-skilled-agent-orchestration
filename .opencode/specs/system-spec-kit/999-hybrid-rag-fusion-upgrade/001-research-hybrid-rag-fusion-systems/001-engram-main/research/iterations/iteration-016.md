### Finding 2: The separation is backed by a full parallel storage lane, not a tag on the main corpus
- **Source**: [external/internal/store/store.go:487](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:487), [external/internal/store/store.go:501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501), [external/internal/store/store.go:1109](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1109), [external/internal/store/store.go:1181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1181), [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462)
- **What it does**: Engram uses separate `user_prompts` and `prompts_fts` tables, separate insert logic with `prompt-*` sync IDs, and a separate `SearchPrompts()` query ordered by `fts.rank`. Meanwhile `Search()` stays observation-only and retains topic-key shortcuts plus observation FTS.
- **Why it matters for us**: If Public wants durable prompt memory, a real sidecar table or index is the right shape. Script-level `user_prompts` fields in saved artifacts are not equivalent to a live searchable runtime lane.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Engram exposes prompt retrieval to HTTP, but not to the agent MCP surface
- **Source**: [external/internal/server/server.go:120](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:120), [external/internal/server/server.go:122](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:122), [external/internal/server/server.go:411](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:411), [external/internal/mcp/mcp.go:53](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:53)
- **What it does**: The HTTP server has `/prompts/recent` and `/prompts/search`, but the MCP agent profile only exposes `mem_save_prompt` and `mem_context`; there is no MCP `mem_search_prompts` equivalent.
- **Why it matters for us**: Engram treats prompt memory as continuity infrastructure, not normal agent recall. That supports a Public design where prompt records enrich `session_resume`, `session_bootstrap`, or resume-mode `memory_context` first, without adding another broad search surface.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Engram’s prompt lane is useful, but its filtering semantics are weaker than Public should accept
- **Source**: [external/internal/store/store.go:1145](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1145), [external/internal/store/store.go:1181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1181), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [external/internal/server/server.go:418](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:418)
- **What it does**: `RecentPrompts()` only filters by project, `FormatContext()` feeds it only `project`, not `scope`, and the HTTP prompt-search path passes raw `project` through to `SearchPrompts()` without the normalization step that observation search gets.
- **Why it matters for us**: The separation idea is good; the isolation model is not. Public already has stronger tenant/user/agent/shared-space and trusted-session boundaries, so any durable prompt sidecar should inherit those, not downgrade to project-only continuity.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Public already implements the principle, but only as transient resume-time scaffolding
- **Source**: [memory-context.ts:784](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784), [memory-context.ts:1435](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435), [working-memory.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385), [session-manager.ts:1090](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1090), [memory-search.ts:482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482), [generate-context.js:97](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:97), [handler-memory-context.vitest.ts:565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:565)
- **What it does**: Public’s resume path runs `memory_search` with anchored content, then optionally injects `systemPromptContext` from high-attention working-memory items when the session is trusted and resumed. Tests verify that injection only in resume conditions. The save script accepts `user_prompts`, but live runtime retrieval does not yet persist or search them as first-class entities.
- **Why it matters for us**: Public has the right behavioral boundary already: prompt-like context is additive continuity, not ranking input. The missing piece is durability beyond working-memory lifetime, especially because completed sessions clear working memory immediately.
- **Recommendation**: prototype later
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [handler-memory-context.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts)

## Assessment
- New information ratio: 0.58
- Questions addressed: Q1, Q2, Q5, Q7, Q8, Q9, Q10
- Questions answered: Q2, Q5, Q7, Q8, Q9, Q10

## Reflection
- What worked: tracing handler boundaries first, then store/schema, then server exposure made the pattern much clearer than reading docs alone; the most useful comparison was Engram’s `mem_search` versus Public’s resume-only `systemPromptContext` injection.
- What did not work: CocoIndex did not yield a usable pass on this Go slice in this run, so I fell back to `rg` plus direct reads; the strict validator returned `PASSED` but also emitted `cannot create temp file for here document: Operation not permitted`, and the phase root currently lacks the Level 3 files and canonical `research/research.md` that the prompt expects, so I kept this iteration read-only.

## Recommended Next Focus
Trace phases 003 and 004 for whether they provide a better retrieval model for a durable prompt sidecar, then design a Public implementation that keeps prompt records out of `memory_search`, injects them only into resume/bootstrap surfaces, and binds them to trusted governed session scope rather than project-only filtering.

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
# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

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
I’m treating this as a read-only research pass on Engram’s failure modes and how they compare to Spec Kit Memory. First I’m loading the repo guidance and the most relevant memory/context so the analysis stays aligned with prior iterations instead of repeating them.
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


exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "pwd && printf '\\n--- MEMORY SEARCH ---\\n' && rg -n \"engram|hybrid-rag-fusion|prompt lane|prompt retrieval|FormatContext|SearchPrompts|ProfileAgent|ProfileAdmin\" /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

--- MEMORY SEARCH ---
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

codex
I’ve loaded the governing guidance and the prior prompt-lane findings, so I can avoid retreading that ground. Next I’m checking the phase folder state and then tracing the concrete failure-mode code paths in Engram’s store and MCP layers, with Public’s handlers open alongside for comparison.
exec
/bin/zsh -lc "ls -la .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main && printf '\\n--- research tree ---\\n' && find .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main -maxdepth 2 -type f | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
total 40
drwxr-xr-x   6 michelkerkmeester  staff    192 Apr 10 21:18 .
drwxr-xr-x   7 michelkerkmeester  staff    224 Apr 10 21:07 ..
drwxr-xr-x  24 michelkerkmeester  staff    768 Apr 10 21:19 external
drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 21:06 memory
-rw-r--r--   1 michelkerkmeester  staff  17198 Apr 10 21:06 phase-research-prompt.md
drwxr-xr-x   4 michelkerkmeester  staff    128 Apr 10 21:16 research

--- research tree ---
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.gitignore
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.goreleaser.yaml
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CHANGELOG.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CODEOWNERS
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CONTRIBUTING.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/LICENSE
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/SECURITY.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.mod
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.sum
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/setup.sh
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/memory/.gitkeep
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/.gitkeep

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 1162ms:

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
The phase folder is missing the Level 3 spec docs the prompt expects, and the strict validator is still running, so I’m checking whether it produces the same temp-file warning noted in the previous iteration. After that I’ll switch fully into source tracing on the failure-path functions.
exec
/bin/zsh -lc "rg -n \"ProfileAgent|ProfileAdmin|ResolveTools|shouldRegister|mem_session_start|mem_session_end|mem_session_summary|mem_capture_passive|mem_context|mem_search|defer|error|fmt\\.Errorf|project\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
13://	engram mcp --tools=mem_save,mem_search → individual tool names
21:	projectpkg "github.com/Gentleman-Programming/engram/internal/project"
29:	DefaultProject string // Auto-detected project name, used when LLM sends empty project
34:var loadMCPStats = func(s *store.Store) (*store.Stats, error) {
41://   mem_save, mem_search, mem_context, mem_session_summary,
42://   mem_session_start, mem_session_end, mem_get_observation,
43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
46://   mem_update, mem_delete, mem_stats, mem_timeline, mem_merge_projects
50:// ProfileAgent contains the tool names that AI agents need.
53:var ProfileAgent = map[string]bool{
55:	"mem_search":            true, // search past memories — referenced 6 times
56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
58:	"mem_session_start":     true, // register session start
59:	"mem_session_end":       true, // mark session completed
62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
69:var ProfileAdmin = map[string]bool{
73:	"mem_merge_projects": true, // destructive curation tool — not for agent use
78:	"agent": ProfileAgent,
79:	"admin": ProfileAdmin,
82:// ResolveTools takes a comma-separated string of profile names and/or
85:func ResolveTools(input string) map[string]bool {
122:// 6 core tools are eager (always in context). The rest are deferred
128:  mem_search — find past work, decisions, or context from previous sessions
129:  mem_context — get recent session history (call at session start or after compaction)
130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
147:// default project detection and optional tool allowlist.
160:// shouldRegister returns true if the tool should be registered given the
162:func shouldRegister(name string, allowlist map[string]bool) bool {
170:	// ─── mem_search (profile: agent, core — always in context) ─────────
171:	if shouldRegister("mem_search", allowlist) {
173:			mcp.NewTool("mem_search",
187:				mcp.WithString("project",
188:					mcp.Description("Filter by project name"),
191:					mcp.Description("Filter by scope: project (default) or personal"),
202:	if shouldRegister("mem_save", allowlist) {
233:  title: "Fixed FTS5 syntax error on special chars"
248:					mcp.Description("Session ID to associate with (default: manual-save-{project})"),
250:				mcp.WithString("project",
254:					mcp.Description("Scope for this observation: project (default) or personal"),
257:					mcp.Description("Optional topic identifier for upserts (e.g. architecture/auth-model). Reuses and updates the latest observation in same project+scope."),
264:	// ─── mem_update (profile: agent, deferred) ──────────────────────────
265:	if shouldRegister("mem_update", allowlist) {
288:				mcp.WithString("project",
289:					mcp.Description("New project value"),
292:					mcp.Description("New scope: project or personal"),
302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
327:	// ─── mem_delete (profile: admin, deferred) ──────────────────────────
328:	if shouldRegister("mem_delete", allowlist) {
351:	if shouldRegister("mem_save_prompt", allowlist) {
365:					mcp.Description("Session ID to associate with (default: manual-save-{project})"),
367:				mcp.WithString("project",
375:	// ─── mem_context (profile: agent, core — always in context) ────────
376:	if shouldRegister("mem_context", allowlist) {
378:			mcp.NewTool("mem_context",
385:				mcp.WithString("project",
386:					mcp.Description("Filter by project (omit for all projects)"),
389:					mcp.Description("Filter observations by scope: project (default) or personal"),
399:	// ─── mem_stats (profile: admin, deferred) ───────────────────────────
400:	if shouldRegister("mem_stats", allowlist) {
403:				mcp.WithDescription("Show memory system statistics — total sessions, observations, and projects tracked."),
415:	// ─── mem_timeline (profile: admin, deferred) ────────────────────────
416:	if shouldRegister("mem_timeline", allowlist) {
419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
442:	if shouldRegister("mem_get_observation", allowlist) {
445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
461:	if shouldRegister("mem_session_summary", allowlist) {
463:			mcp.NewTool("mem_session_summary",
494:- Be CONCISE but don't lose important details (file paths, error messages, decisions)
504:					mcp.Description("Session ID (default: manual-save-{project})"),
506:				mcp.WithString("project",
515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
516:	if shouldRegister("mem_session_start", allowlist) {
518:			mcp.NewTool("mem_session_start",
530:				mcp.WithString("project",
542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
543:	if shouldRegister("mem_session_end", allowlist) {
545:			mcp.NewTool("mem_session_end",
565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
566:	if shouldRegister("mem_capture_passive", allowlist) {
568:			mcp.NewTool("mem_capture_passive",
585:					mcp.Description("Session ID (default: manual-save-{project})"),
587:				mcp.WithString("project",
598:	// ─── mem_merge_projects (profile: admin, deferred) ──────────────────
599:	if shouldRegister("mem_merge_projects", allowlist) {
601:			mcp.NewTool("mem_merge_projects",
602:				mcp.WithDescription("Merge memories from multiple project name variants into one canonical name. Use when you discover project name drift (e.g. 'Engram' and 'engram' should be the same project). DESTRUCTIVE — moves all records from source names to the canonical name."),
611:					mcp.Description("Comma-separated list of project names to merge FROM (e.g. 'Engram,engram-memory,ENGRAM')"),
615:					mcp.Description("The canonical project name to merge INTO (e.g. 'engram')"),
626:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
629:		project, _ := req.GetArguments()["project"].(string)
633:		// Apply default project when LLM sends empty
634:		if project == "" {
635:			project = cfg.DefaultProject
637:		// Normalize project name
638:		project, _ = store.NormalizeProject(project)
642:			Project: project,
647:			return mcp.NewToolResultError(fmt.Sprintf("Search error: %s. Try simpler keywords.", err)), nil
658:			projectDisplay := ""
660:				projectDisplay = fmt.Sprintf(" | project: %s", *r.Project)
670:				r.CreatedAt, projectDisplay, r.Scope)
681:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
686:		project, _ := req.GetArguments()["project"].(string)
690:		// Apply default project when LLM sends empty
691:		if project == "" {
692:			project = cfg.DefaultProject
694:		// Normalize project name and capture warning
695:		normalized, normWarning := store.NormalizeProject(project)
696:		project = normalized
702:			sessionID = defaultSessionID(project)
706:		// Check for similar existing projects (only when this project has no existing observations)
708:		if project != "" {
712:				if e == project {
718:				matches := projectpkg.FindSimilar(project, existingNames, 3)
723:					similarWarning = fmt.Sprintf("⚠️ Project %q has no memories. Similar project found: %q (%d memories). Consider using that name instead.", project, bestMatch, obsCount)
729:		s.CreateSession(sessionID, project, "")
738:			Project:   project,
764:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
783:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
799:		if v, ok := req.GetArguments()["project"].(string); ok {
832:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
852:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
855:		project, _ := req.GetArguments()["project"].(string)
857:		// Apply default project when LLM sends empty
858:		if project == "" {
859:			project = cfg.DefaultProject
861:		project, _ = store.NormalizeProject(project)
864:			sessionID = defaultSessionID(project)
868:		s.CreateSession(sessionID, project, "")
873:			Project:   project,
884:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
885:		project, _ := req.GetArguments()["project"].(string)
888:		// Apply default project when LLM sends empty
889:		if project == "" {
890:			project = cfg.DefaultProject
892:		project, _ = store.NormalizeProject(project)
894:		context, err := s.FormatContext(project, scope)
904:		var projects string
906:			projects = strings.Join(stats.Projects, ", ")
908:			projects = "none"
911:		result := fmt.Sprintf("%s\n---\nMemory stats: %d sessions, %d observations across projects: %s",
912:			context, stats.TotalSessions, stats.TotalObservations, projects)
919:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
925:		var projects string
927:			projects = strings.Join(stats.Projects, ", ")
929:			projects = "none yet"
933:			stats.TotalSessions, stats.TotalObservations, stats.TotalPrompts, projects)
940:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
950:			return mcp.NewToolResultError(fmt.Sprintf("Timeline error: %s", err)), nil
992:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
1003:		project := ""
1005:			project = fmt.Sprintf("\nProject: %s", *obs.Project)
1022:			obs.SessionID, project+scope+topic, toolName+duplicateMeta+revisionMeta,
1031:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
1034:		project, _ := req.GetArguments()["project"].(string)
1036:		// Apply default project when LLM sends empty
1037:		if project == "" {
1038:			project = cfg.DefaultProject
1040:		project, _ = store.NormalizeProject(project)
1043:			sessionID = defaultSessionID(project)
1047:		s.CreateSession(sessionID, project, "")
1052:			Title:     fmt.Sprintf("Session summary: %s", project),
1054:			Project:   project,
1060:		return mcp.NewToolResultText(fmt.Sprintf("Session summary saved for project %q", project)), nil
1065:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
1067:		project, _ := req.GetArguments()["project"].(string)
1070:		// Apply default project when LLM sends empty
1071:		if project == "" {
1072:			project = cfg.DefaultProject
1074:		project, _ = store.NormalizeProject(project)
1076:		if err := s.CreateSession(id, project, directory); err != nil {
1080:		return mcp.NewToolResultText(fmt.Sprintf("Session %q started for project %q", id, project)), nil
1085:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
1098:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
1101:		project, _ := req.GetArguments()["project"].(string)
1104:		// Apply default project when LLM sends empty
1105:		if project == "" {
1106:			project = cfg.DefaultProject
1108:		project, _ = store.NormalizeProject(project)
1115:			sessionID = defaultSessionID(project)
1116:			_ = s.CreateSession(sessionID, project, "")
1126:			Project:   project,
1141:	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
1158:			return mcp.NewToolResultError("at least one source project name is required in 'from'"), nil
1177:// defaultSessionID returns a project-scoped default session ID.
1178:// If project is non-empty: "manual-save-{project}"
1179:// If project is empty: "manual-save"
1180:func defaultSessionID(project string) string {
1181:	if project == "" {
1184:	return "manual-save-" + project

exec
/bin/zsh -lc "rg -n \"func New|schema|migrat|PRAGMA|integrity|WAL|busy_timeout|Optimize|VACUUM|backup|corrupt|deleted_at|duplicate_count|revision_count|sanitizeFTS|Search\\(|SearchPrompts\\(|FormatContext\\(|CreateSession\\(|EndSession\\(|SuggestTopicKey\\(|AddObservation\\(|capture passive|Passive|topic_key|fts.rank|MATCH|version\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
232:	Version      string        `json:"version"`
395:func New(cfg Config) (*Store, error) {
411:		"PRAGMA journal_mode = WAL",
412:		"PRAGMA busy_timeout = 5000",
413:		"PRAGMA synchronous = NORMAL",
414:		"PRAGMA foreign_keys = ON",
423:	if err := s.migrate(); err != nil {
424:		return nil, fmt.Errorf("engram: migration: %w", err)
439:func (s *Store) migrate() error {
440:	schema := `
460:			topic_key  TEXT,
462:			revision_count INTEGER NOT NULL DEFAULT 1,
463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
467:			deleted_at TEXT,
482:			topic_key,
540:	if _, err := s.execHook(s.db, schema); err != nil {
550:		{name: "topic_key", definition: "TEXT"},
552:		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
556:		{name: "deleted_at", definition: "TEXT"},
564:	if err := s.migrateLegacyObservationsTable(); err != nil {
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
666:	if err := s.migrateFTSTopicKey(); err != nil {
703:func (s *Store) migrateFTSTopicKey() error {
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
1192:		WHERE prompts_fts MATCH ?
1201:	sql += " ORDER BY fts.rank LIMIT ?"
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
1524:		       fts.rank
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1546:	sqlQ += " ORDER BY fts.rank LIMIT ?"
1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
1613:func (s *Store) FormatContext(project, scope string) (string, error) {
1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
2215:	Migrated            bool  `json:"migrated"`
2250:			return fmt.Errorf("migrate observations: %w", err)
2256:			return fmt.Errorf("migrate sessions: %w", err)
2262:			return fmt.Errorf("migrate prompts: %w", err)
2266:		// Enqueue sync mutations so cloud sync picks up the migrated records.
2290:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2325:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2439:		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
2455:// MergeProjects migrates all records from each source project name into the
2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
2700:		  AND deleted_at IS NULL
2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2847:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2861:		query += ` AND deleted_at IS NULL`
2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
2940:		`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
2989:	rows, err := s.queryItHook(s.db, fmt.Sprintf("PRAGMA table_info(%s)", tableName))
3016:func (s *Store) migrateLegacyObservationsTable() error {
3017:	rows, err := s.queryItHook(s.db, "PRAGMA table_info(observations)")
3050:		return fmt.Errorf("migrate legacy observations: begin tx: %w", err)
3055:		CREATE TABLE observations_migrated (
3065:			topic_key  TEXT,
3067:			revision_count INTEGER NOT NULL DEFAULT 1,
3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
3072:			deleted_at TEXT,
3076:		return fmt.Errorf("migrate legacy observations: create table: %w", err)
3080:		INSERT INTO observations_migrated (
3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
3083:			last_seen_at, created_at, updated_at, deleted_at
3099:			NULLIF(topic_key, ''),
3101:			CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
3106:			deleted_at
3110:		return fmt.Errorf("migrate legacy observations: copy rows: %w", err)
3114:		return fmt.Errorf("migrate legacy observations: drop old table: %w", err)
3117:	if _, err := s.execHook(tx, "ALTER TABLE observations_migrated RENAME TO observations"); err != nil {
3118:		return fmt.Errorf("migrate legacy observations: rename table: %w", err)
3132:			topic_key,
3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:		SELECT id, title, content, tool_name, type, project, topic_key
3139:		WHERE deleted_at IS NULL;
3141:		return fmt.Errorf("migrate legacy observations: rebuild fts: %w", err)
3145:		return fmt.Errorf("migrate legacy observations: commit: %w", err)
3201:func SuggestTopicKey(typ, title, content string) string {
3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
3384:func sanitizeFTS(query string) string {
3394:// ─── Passive Capture ─────────────────────────────────────────────────────────
3396:// PassiveCaptureParams holds the input for passive memory capture.
3397:type PassiveCaptureParams struct {
3404:// PassiveCaptureResult holds the output of passive memory capture.
3405:type PassiveCaptureResult struct {
3481:// PassiveCapture extracts learnings from text and saves them as observations.
3483:func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {
3487:	result := &PassiveCaptureResult{}
3504:			   AND deleted_at IS NULL
3521:		_, err = s.AddObservation(AddObservationParams{

exec
/bin/zsh -lc "rg -n \"memory_context|memory_search|memory_match_triggers|generate-context|session_bootstrap|session_resume|session_start|session_end|working memory|systemPromptContext|trusted|resume\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:759:    'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:760:    'Graph retrieval: memory_search supports retrievalLevel (local/global/auto) for entity-level or community-level search. Graph provenance visible via graphEvidence in results.',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:770:      const recommended = !snap.primed ? 'call session_bootstrap()' :
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:772:        snap.sessionQuality === 'critical' ? 'call memory_context(resume)' : 'ready';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:785:  lines.push('Non-hook runtimes receive automatic structural context via session_bootstrap, session_resume, and auto-prime.');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:787:  lines.push('- If "stale" or "missing": call session_bootstrap first to refresh structural context');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:788:  lines.push('- Recovery priority: session_bootstrap → session_resume → code_graph_scan');
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882:    if (name === 'memory_context' && args.mode === 'resume') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:912:      name === 'memory_context' && args.mode === 'resume';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:964:    if (name !== 'memory_search' && name !== 'memory_context' && name !== 'memory_quick_search' && name !== 'session_health') {
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:977:    if ((name === 'memory_search' || name === 'memory_context') && result && !result.isError && result.content?.[0]?.text) {
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:229:| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:230:| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:233:| `SPECKIT_EVENT_DECAY` | `true` | boolean | Event decay processing in working memory. Graduated ON. | `lib/cognitive/working-memory.ts` (via tests) |
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:234:      'Shared-memory admin mutations require trusted identity binding.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:237:        error: 'Shared-memory admin mutations require trusted identity binding.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:239:        reason: 'shared_memory_trusted_binding_required',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:240:        hint: 'Set SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY=true only for trusted local transports.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:246:  // an authenticated session. In untrusted environments, wrap this handler
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:249:  // transport principal, so the trusted-session validation used by
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:402:  console.warn('[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43:// T73: Import session manager for trusted session validation (IDOR prevention)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:208:  // manager to prevent IDOR. Callers cannot read/write working memory for
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212:    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:217:    if (trustedSession.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:221:        error: trustedSession.error,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:4:// Phase 020: Composite MCP tool that merges memory resume context,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:225:      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409:  // ── Sub-call 1: Memory context resume (skip in minimal mode) ──
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:417:        mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:418:        profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:471:  // Phase 027: Structural bootstrap contract for resume surface
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:479:  // Keep live resume authoritative; cached continuity only appends bounded notes when every gate passes.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:485:    hints.push('Cached continuity summary accepted as additive resume context.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:511:      key: 'memory-resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:560:    kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:591:      resumePayload: payloadContract,
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:80:type SessionResumeModule = typeof import('./session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:208:    sessionResumeModule = loadHandlerModule<SessionResumeModule>('session-resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:331:// Session resume handler
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:7:import { handleSessionResume } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:8:import type { CachedSessionSummaryDecision } from './session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:46:  resume: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:95:  resumeData: Record<string, unknown>,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:101:  if (resumeData.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:169:  let resumeData: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:171:    const resumeResponse = await handleSessionResume({
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:174:    resumeData = extractData(resumeResponse);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:175:    allHints.push(...extractHints(resumeData));
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:178:    resumeData = { error: message };
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:202:  const cachedSummary = extractCachedSummary(resumeData);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:216:  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:219:  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:224:  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:227:  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:228:  if (!resumeData.error && !resumeStructuralTrust) {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:238:  const resumeWithTrust = resumeData.error
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:239:    ? resumeData
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:241:      resumeData,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:242:      resumeStructuralTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:248:      key: 'resume-surface',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:250:      content: summarizeUnknown(resumeData),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:252:      certainty: resumeCertainty,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:280:      // which remains valid even when the remote resume surface fails closed.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:289:      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:299:      { label: 'resume', certainty: resumeCertainty },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:311:      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:324:    resume: resumeWithTrust,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:332:      resumePayload,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:338:    // Keep advisory routing guidance out of nextActions so bootstrap and resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:339:    // remain the authoritative recovery owners for startup and deep resume flows.
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:340:    nextActions: buildNextActions(resumeData, healthData, structuralContext),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:97:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127:  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:146:  resumed: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:155:  resumeHeuristicApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:674:  resume: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:677:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:784:  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:787:    query: input || 'resume work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:798:    anchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:810:    strategy: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:811:    mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:812:    resumeAnchors: resumeAnchors,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:833:  if (trustedSession.error) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:835:      requestedSessionId: trustedSession.requestedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:837:      resumed: false,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:840:      error: trustedSession.error,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:844:  const requestedSessionId = trustedSession.requestedSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:845:  const effectiveSessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:846:  const resumed = trustedSession.trusted;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847:  const priorMode = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:850:  const counter = resumed
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:857:    resumed,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:883:  let resumeHeuristicApplied = false;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:898:    const hasResumeKeywords = /\b(resume|continue|pick up|where was i|what(?:'s| is) next)\b/i.test(normalizedInput);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900:      session.resumed ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:901:      session.priorMode === 'resume' ||
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:909:      effectiveMode = 'resume';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:910:      resumeHeuristicApplied = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:942:      resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:986:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1142:  if (requested_mode !== 'resume') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1224:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1244:    resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1305:      resumed: resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1314:    resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1338:    resumedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1343:    queryHeuristicApplied: resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1425:  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434:  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1436:    if (resumeContextItems.length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1444:      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1497:        resumeHeuristicApplied,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:125:- startup and resume surfaces report freshness-aware graph status (`fresh`, `stale`, `empty`, `error`)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:137:| Codex | `.codex/config.toml` | Checked-in MCP config. Bootstrap parity via `session_bootstrap` MCP tool, not a native SessionStart hook. |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:426:- `memory_context` (unified context retrieval)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:427:- `memory_search` (semantic search)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:428:- `memory_match_triggers` (fast trigger matching)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:437:- `session_bootstrap` (complete session bootstrap)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:438:- `session_resume` (combined session resume)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:465:- [ ] `memory_search()` returns results (or empty if no memories are indexed yet)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:530:### memory_context: Unified Context Retrieval
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:532:`memory_context()` is the primary entry point for context loading. It detects task intent and routes to the optimal retrieval strategy automatically.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:539:- `resume`: Session recovery (loads previous state)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:548:### memory_search: Semantic Search
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:550:`memory_search()` runs vector-based similarity search across all indexed memories.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:559:### memory_match_triggers: Fast Keyword Lookup
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:561:`memory_match_triggers()` provides sub-50ms keyword-based matching. Use it for immediate context surfacing at the start of a conversation.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:596:When enabled, this feature adjusts the balance between vector similarity and keyword relevance based on the detected task type. It supports 7 task types: `add_feature`, `fix_bug`, `refactor`, `understand`, `plan`, `debug` and `resume`. For example, `fix_bug` boosts exact-match keyword signals while `understand` emphasizes semantic similarity.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:629:- `ContextEnvelope`: Wraps all `memory_context()` responses with metadata (mode used, memories returned, intent detected)
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:681:**Behind the scenes:** The AI calls `memory_context()` with `mode: "resume"` and `anchors: ["state", "next-steps"]`, then returns the previous session state.
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:692:1. AI calls `memory_context({ input: "add user profiles", mode: "auto" })`
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:792:| Startup or resume shows graph `stale` | Freshness-aware startup detected drift before a structural read ran | Run a structural read to allow bounded inline repair, or run `code_graph_scan` for broader stale states |
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1047:MCP TOOLS: memory_context, memory_search, memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1064:| v1.7.x | 2026-02-20 | Cross-encoder reranking enabled by default. Co-activation score boost fix. Query expansion on deep mode. Evidence gap warnings. MMR reranking with intent-mapped lambda. Phase system support (recursive validation, phase detection scoring). Feature flag updates. `memory_context` tokenUsage parameter. 28-tool surface area. |
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:168:  trusted: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:397:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:405:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:415:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:425:      trusted: false,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:433:    trusted: true,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:852:    // Immediately clear working memory for cleared session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1090:    // Immediately clear working memory for completed session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1260:  const resumeCommand = specFolder
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1261:    ? `/spec_kit:resume ${specFolder}`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1263:      ? `memory_search({ sessionId: "${sessionId}" })`
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1264:      : 'memory_search({ query: "last session" })';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1304:${resumeCommand}
.opencode/skill/system-spec-kit/mcp_server/README.md:9:  - "memory_context"
.opencode/skill/system-spec-kit/mcp_server/README.md:10:  - "memory_search"
.opencode/skill/system-spec-kit/mcp_server/README.md:62:| **Retrieval modes** | 5 | auto, quick, deep, focused, resume |
.opencode/skill/system-spec-kit/mcp_server/README.md:85:The memory system exposes 47 MCP tools through 4 memory slash commands plus the borrowed recovery workflow in `/spec_kit:resume`. Think of commands as doors into the system. Each door opens access only to the tools it needs.
.opencode/skill/system-spec-kit/mcp_server/README.md:93:| `/spec_kit:resume` | Continue or recover an interrupted spec-folder session through the broader memory/session recovery stack | Broad helper surface; primary chain uses 3 shared memory tools |
.opencode/skill/system-spec-kit/mcp_server/README.md:200:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:545:**Startup/recovery surfaces:** `session_resume`, `session_bootstrap`, and the startup brief now report freshness-aware graph status instead of count-only health. Startup surfaces are intentionally non-mutating snapshots, so later structural reads may still differ if repo state changes.
.opencode/skill/system-spec-kit/mcp_server/README.md:547:**Query routing:** Structural queries (callers, imports, dependencies) go to `code_graph_query`. Semantic and concept queries go to CocoIndex (`mcp__cocoindex_code__search`). Session and memory queries go to `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:557:**Start here for most tasks**: `memory_context` (L1) automatically figures out what you need. Use the lower-level tools when you want precise control.
.opencode/skill/system-spec-kit/mcp_server/README.md:563:##### `memory_context`
.opencode/skill/system-spec-kit/mcp_server/README.md:570:| `mode` | string | `auto` (default), `quick`, `deep`, `focused`, `resume` |
.opencode/skill/system-spec-kit/mcp_server/README.md:587:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:599:##### `session_resume`
.opencode/skill/system-spec-kit/mcp_server/README.md:601:Resume session with combined memory, code graph and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. The response carries freshness-aware code-graph status (`fresh`, `stale`, `empty`, `error`) instead of count-only health. For the canonical first-call recovery path on session start or after `/clear`, prefer `session_bootstrap`.
.opencode/skill/system-spec-kit/mcp_server/README.md:605:| `specFolder` | string | Scope resume to a specific spec folder |
.opencode/skill/system-spec-kit/mcp_server/README.md:610:##### `session_bootstrap`
.opencode/skill/system-spec-kit/mcp_server/README.md:612:Complete session bootstrap in one call. This is the canonical first-call recovery step on session start or after `/clear`. It wraps the full `session_resume` payload plus `session_health` and returns context, health, structural readiness and recommended next actions. Startup/bootstrap surfaces are freshness-aware but non-mutating; use `code_graph_scan` when readiness shows an empty or broad full-scan state.
.opencode/skill/system-spec-kit/mcp_server/README.md:622:##### `memory_search`
.opencode/skill/system-spec-kit/mcp_server/README.md:646:  "tool": "memory_search",
.opencode/skill/system-spec-kit/mcp_server/README.md:674:##### `memory_match_triggers`
.opencode/skill/system-spec-kit/mcp_server/README.md:688:  "tool": "memory_match_triggers",
.opencode/skill/system-spec-kit/mcp_server/README.md:1326:  "tool": "memory_context",
.opencode/skill/system-spec-kit/mcp_server/README.md:1347:node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/005-auth
.opencode/skill/system-spec-kit/mcp_server/README.md:1535:| Resume a session from scratch | `session_bootstrap` | Use as the first recovery call on session start or after `/clear` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1536:| Inspect the detailed merged resume payload | `session_resume` | Use when you want direct resume details without the full bootstrap wrapper |
.opencode/skill/system-spec-kit/mcp_server/README.md:1538:| Find a past decision | `memory_context` | Set `intent: "find_decision"` |
.opencode/skill/system-spec-kit/mcp_server/README.md:1539:| Search for specific terms | `memory_search` | Use `concepts: ["term1", "term2"]` for AND search |
.opencode/skill/system-spec-kit/mcp_server/README.md:1540:| Check triggers on every prompt | `memory_match_triggers` | Pass the user's prompt text |
.opencode/skill/system-spec-kit/mcp_server/README.md:1556:**What you see**: Irrelevant or low-scoring results from `memory_search` or `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/README.md:1567:{ "tool": "memory_search", "arguments": { "query": "your query", "min_quality_score": 0.5 } }
.opencode/skill/system-spec-kit/mcp_server/README.md:1717:Start with `memory_context` for all retrieval tasks. It handles intent detection and routing automatically. Use `memory_search` when you want explicit control over channels. Use `memory_match_triggers` when processing a raw prompt at the start of each turn. Use L4-L7 tools only for mutation, analysis or maintenance.
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:709:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:40:  profile?: 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:204:/** Arguments for session resume requests. */
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:93:1. User queries memory_search
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:125:- Quick resume command
.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md:200:| Recover state | `recoverState(sessionId)` | On session resume |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:43:  description: '[L1:Orchestration] Unified entry point for context retrieval with intent-aware routing. START HERE for most memory operations. For session recovery, use mode: \'resume\' with profile: \'resume\'. Automatically detects task intent (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and routes to optimal retrieval strategy. Modes: auto (default), quick (trigger-based), deep (comprehensive), focused (intent-optimized), resume (session recovery). Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:49:  name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:113:        enum: ['quick', 'research', 'resume', 'debug'],
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:190:// E3: Simplified search — 3 params, sensible defaults, delegates to memory_search
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:193:  description: '[L2:Core] Simplified search — query + optional limit + optional spec folder. Delegates to memory_search with sensible defaults (intent auto-detect ON, dedup ON, content included, limit 10). Use this when you want fast search without configuring 31 parameters.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:211:  name: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:738:// Phase 020: Composite session resume tool
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:746:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:761:      specFolder: { type: 'string', description: 'Optional spec folder to scope the resume context' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:772:      nextActions: { type: 'array', items: { type: 'string' }, description: 'Up to 3 recommended next actions derived from resume, health, and structural status' },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:774:    required: ['resume', 'health', 'hints', 'nextActions'],
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:87:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:89:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:303: * Phase C: Get top-N attention-weighted memory IDs from working memory.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:308: * @returns Set of memory IDs with high attention in working memory
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:331:    // Graceful degradation — working memory boost is optional
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:338: * in the attention-weighted working memory set. Re-sorts results by
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:342: * @param attentionIds - Set of memory IDs from working memory
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:343: * @returns Re-sorted trigger matches with working memory boost applied
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:354:  // Apply 1.3x multiplier when memory is in working memory set.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:380:    // also appear in the working memory active set.
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:463:    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:482:      graphRetrieval: 'For broad topic questions, use memory_search with retrievalLevel: "global" for community-level results. For specific memories, use "local" (default). Use "auto" for automatic fallback.',
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:27:- `context-tools.ts` - dispatch for `memory_context`.
.opencode/skill/system-spec-kit/mcp_server/tools/README.md:40:- `memory-tools.ts` implements the `memory_quick_search` delegation path by building a richer `memory_search` request and relabeling the returned envelope metadata back to `memory_quick_search`.
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:101:  mode: z.enum(['auto', 'quick', 'deep', 'focused', 'resume']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:112:  includeTrace: z.boolean().optional(), // CHK-040: Forward to internal memory_search
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:115:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:152:  profile: z.enum(['quick', 'research', 'resume', 'debug']).optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:398:  memory_search: memorySearchSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:400:  memory_match_triggers: memoryMatchTriggersSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:465:  memory_match_triggers: ['prompt', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'session_id', 'turnNumber', 'include_cognitive'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/hooks/README.md:70:- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:62:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:64:  'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:78:    case 'memory_search':         return handleMemorySearch(parseArgs<SearchArgs>(validateToolArgs('memory_search', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:80:      // E3: Delegate to memory_search with sensible defaults
.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:99:    case 'memory_match_triggers': return handleMemoryMatchTriggers(parseArgs<TriggerArgs>(validateToolArgs('memory_match_triggers', args)));
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:6:// based on the session source (compact, startup, resume, clear).
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:18:import { getCachedSessionSummaryDecision, logCachedSummaryDecision } from '../../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:96:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:107:    `- Memory: ${hasCachedContinuity ? 'session continuity available' : 'startup summary only (resume on demand)'}`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:141:        '- `memory_match_triggers({ prompt })` — fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:142:        '- `memory_search({ query })` — semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:176:/** Handle source=resume: load resume context for continued session */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:232:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:10://   source: "startup" | "resume" | "clear"
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:107:        '- `memory_match_triggers({ prompt })` - fast trigger matching',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:108:        '- `memory_search({ query })` - semantic search',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:142:/** Handle source=resume: load resume context */
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:194:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:175:Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:16:  // SessionStart fields (Gemini has startup/resume/clear; no native compact source)
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:384:  it('C13: Response meta.tool is memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:388:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:10:| `session-prime.ts` | SessionStart | Injects context via stdout based on source (compact/startup/resume/clear) |
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:21:SessionStart(resume) → load prior session state
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md:31:Hooks are transport reliability, not separate business logic. They call the same retrieval primitives (`memory_match_triggers`, `memory_context`) that other runtimes call explicitly.
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:9:/** Token budget for session priming (startup/resume) */
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:17:  source?: 'startup' | 'resume' | 'clear' | 'compact';
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:59:    it('T516-2: handle_memory_search alias is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:60:      expect(typeof handler.handle_memory_search).toBe('function');
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
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:322:  it('public and runtime schemas accept response profiles for memory_search', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:329:      validateToolInputSchema('memory_search', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:331:    expect(validateToolArgs('memory_search', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:338:      input: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:353:      input: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:354:      profile: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:378:  it('public and runtime schemas accept governed scope fields for memory_match_triggers', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:380:      prompt: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:389:      validateToolInputSchema('memory_match_triggers', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:391:    expect(validateToolArgs('memory_match_triggers', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:4:// Feature catalog: Tool-result extraction to working memory
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:312:    const expected = ['auto', 'quick', 'deep', 'focused', 'resume'];
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:353:  it('resume tokenBudget is 2000', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:355:    expect(memoryContext.CONTEXT_MODES.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:671: * (quick, research, resume, debug) when no explicit profile is specified by the caller.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:191:Bootstrap and resume remain the authority surfaces for structural context. Packet `006` only adds the shared trust contract beside packet `005`'s certainty contract; it does not create a new graph-only owner surface.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:306:- Preserve the three axes distinctly through bootstrap or resume-facing payloads. Do not merge them into a single "graph trust" label during transport.
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:311:- Current owner surfaces remain authoritative: shared payload sections, session bootstrap or resume consumers, and bridge-facing graph payloads.
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:84:  it('emits the trusted-transport warning only once across admin operations', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:106:    const warningMessage = '[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport';
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:126:  it('fails closed for shared-space admin mutations when trusted caller binding is not enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts:140:    expect(envelope.data.details?.reason).toBe('shared_memory_trusted_binding_required');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:34:The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:4:// Feature catalog: Tool-result extraction to working memory
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:7:  'session-resume',
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:26:  resumedSession: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:49:    case 'session-resume':
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:50:      return `resumed session inferred ${effectiveMode} mode`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:71:  if (args.resumedSession) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:72:    activeSignals.push('session-resume');
.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:89:    if (!args.resumedSession && !args.pressureOverrideApplied && args.requestedMode === 'auto' && !args.queryHeuristicApplied) {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:482:describe('T059: autoDetectIntent Parameter (memory_search)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:4:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:3:vi.mock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:10:          memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:11:          hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:13:            kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:14:            summary: 'resume payload',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:19:                content: 'resume structural context',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:67:import { handleSessionResume } from '../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:83:    expect(parsed.data.resume.memory).toEqual({ resumed: true });
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:90:      resume: expect.any(Object),
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:95:    expect(parsed.data.hints).toEqual(expect.arrayContaining(['resume ok', 'health ok']));
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:49:    toolPattern: /^(grep|memory_search)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:76:    it('T517-2: handle_memory_match_triggers alias exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:77:      expect(typeof handler.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:256:      trusted: true,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:315:      prompt: 'resume auth work',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:480:        currentTask: 'resume crash recovery verification',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:508:        contextSummary: 'Need to resume from the saved recovery packet.',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:518:      expect(content).toContain('/spec_kit:resume specs/022-hybrid-rag-fusion');
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:214:| `SPECKIT_REDACTION_GATE`  | true    | Enable the PII/secret redaction gate before memory insert. When `true`, all content passes through pattern-based PII and secret detection before reaching the memory store. Set to `false` only in trusted environments where redaction overhead is unnecessary. |
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:151:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:7:  { tool: 'memory_search', handler: 'handleMemorySearch', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:8:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers', layer: 'L2' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:33:  { camel: 'handleMemorySearch', snake: 'handle_memory_search' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:34:  { camel: 'handleMemoryMatchTriggers', snake: 'handle_memory_match_triggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/tests/response-profile-formatters.vitest.ts:23:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:194:    keywords: ['memory', 'context', 'session', 'previous session', 'prior work', 'last time', 'continue', 'resume', 'recover', 'continuation'],
.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:90:- Purpose: Owns the memory-science side of the system: decay, retrievability, working memory, co-activation, pressure monitoring, archival movement, and adaptive ranking inputs. It is the main "how memory behaves over time" module family.
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
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:4:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md:104:| **Recency** | 0.40 | Days since last update (primary for "resume work") |
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:181:const key = generateCacheKey('memory_search', { query: 'test' });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:184:set(key, searchResults, { toolName: 'memory_search', ttlMs: 30000 });
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:196:  'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md:210:// Automatically clears memory_search, memory_match_triggers, etc.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:312:    'memory_search',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:313:    'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:21:        : kind === 'resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:36:    const resume = makePayload('resume', 'resume summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:41:      resumePayload: resume,
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:57:    const payload = makePayload('resume', 'resume summary');
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:58:    expect(coerceSharedPayloadEnvelope(payload)?.kind).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:13://   resume   — state + nextSteps + blockers
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:29:export type ResponseProfile = 'quick' | 'research' | 'resume' | 'debug';
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86:/** Output of the `resume` profile formatter. */
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:111:  | { profile: 'resume'; data: ResumeProfile }
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:352: * Format results as the `resume` profile.
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:402: * @param profile       - Profile name ('quick' | 'research' | 'resume' | 'debug')
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:423:    case 'resume':
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:424:      return { profile: 'resume', data: formatResume(safeInput) };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1908:    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:53:  memory_search: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:56:  memory_match_triggers: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:33:| `profile-formatters.ts` | Profile reducers for `quick`, `research`, `resume`, and `debug` response shapes |
.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md:41:- `profile-formatters.ts` exports `applyResponseProfile()` and `applyProfileToEnvelope()` plus the public profile types for `quick`, `research`, `resume`, and `debug`.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:39:| Tool-Specific Hints | 6 tools | memory_search, checkpoint_restore, memory_save, memory_index_scan, memory_drift_why, memory_causal_link |
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:132:  return buildErrorResponse('memory_search', error, { query });
.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md:142:const hint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:244:describe('T020: Quick resume command (DB-dependent)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:246:  it('T020-01: Generates /spec_kit:resume command when specFolder is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:250:  it('T020-02: Generates memory_search command with sessionId when specFolder is not provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:254:  it('T020-03: Generates generic memory_search when neither specFolder nor sessionId is provided', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:262:  it('T020-05: specFolder takes precedence over sessionId for resume command', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:25:/** Complete transport-only plan derived from shared startup/resume payloads. */
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:85:  resumePayload?: SharedPayloadEnvelope | null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:93:    args.resumePayload?.kind,
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:98:  const systemPayload = args.bootstrapPayload ?? args.startupPayload ?? args.resumePayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:99:  const messagePayloads = [args.resumePayload, args.healthPayload].filter(
.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts:102:  const compactionPayload = args.compactionPayload ?? args.resumePayload ?? args.bootstrapPayload ?? null;
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:59:    tools: ['memory_search', 'memory_quick_search', 'memory_save', 'memory_match_triggers']
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:133:    expect(matchRule('memory_search', 'spec.md error context')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:360:    toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:469:      'Consider using /spec_kit:resume for session recovery'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:539:      'Check memory_search() for existing similar content'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:694:  memory_search: {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:700:        'Try memory_match_triggers() for trigger-based matching'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:703:      toolTip: 'memory_match_triggers()'
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:30:      "expectedResultDescription": "Should surface memories about adaptive-fusion.ts (7 intent profiles), intent-classifier.ts, and memory_context intent routing. Cross-document because the behavior spans multiple modules.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:75:      "query": "what is the relationship between the working memory system and event decay",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:85:      "query": "memory_context returns wrong results when token pressure is high",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:231:      "notes": "From T007b Pattern 2: session resume always uses \"session state\" as the input string."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:240:      "expectedResultDescription": "Topic-scoped resume query. Should surface spec folder 001-sprint-0-measurement-foundation memories with state/next-steps anchors.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:241:      "notes": "From T007b Pattern 2: variant of session resume scoped to a specific sprint/spec folder."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:251:      "notes": "From T007b Pattern 3: feature description passed to memory_context before implementation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:415:      "query": "the memory_search tool returns stale results after index rebuild",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:425:      "query": "what is the difference between memory_context and memory_search for context retrieval",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:430:      "expectedResultDescription": "Should surface both memory_context (L1 unified entry) and memory_search (L2 core) tool schemas and any documentation comparing their use cases.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:585:      "query": "SPECKIT_SESSION_BOOST working memory attention",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:640:      "expectedResultDescription": "Should surface the generate-context.js script documentation and CLAUDE.md Memory Save Rule about using the script instead of the Write tool.",
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:641:      "notes": "Derived from \"generate-context\" trigger phrase in the memory save workflow documentation."
.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:725:      "query": "when should I use memory_search versus memory_context",
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:132:const budget = getTokenBudget('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md:139:const enhanced = enhanceDescription('memory_search', 'Search memories');
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:9:  | 'resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:8:describe('hook-state session resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:9:  const sessionId = 'test-resume-session';
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:14:  it('recovers session state for resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:32:  it('preserves compact prime across resume', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:68:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:223:  it('keeps bootstrap and resume authoritative while surfacing the nudge separately', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:224:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:231:              memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:232:              hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:234:                kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:43:| Cognitive Features | 10+ | FSRS scheduler, attention decay, PE gating, working memory, tier classification, co-activation, temporal contiguity, archival manager, causal graph, corrections |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:55:| **Cognitive Memory** | Human-like memory features including attention decay, working memory and co-activation |
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:175:│   ├── working-memory.ts       # Session working memory
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:390:// HOT (R >= 0.80)      - Active working memory, full content
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:723:| [Cognitive Modules](./cognitive/) | Attention decay, working memory, co-activation |
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
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:704:      (a: string) => a.includes('/spec_kit:resume') || a.includes('recovery')
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:713:    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:718:      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
.opencode/skill/system-spec-kit/mcp_server/tests/recovery-hints.vitest.ts:725:    const allSearchHints = getAvailableHints('memory_search');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:15:// Feature catalog: Tool-result extraction to working memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:379: * Set or update the attention score for a memory in working memory.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:514: * Enforce working memory capacity limit by LRU eviction.
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:39:import { handleSessionResume } from '../handlers/session-resume.js';
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:45:describe('session-resume handler', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:65:    expect(parsed.data.payloadContract.kind).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:108:    expect(parsed.data.hints.some((h: string) => h.includes('Memory resume failed'))).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:96:    : 'startup summary only (resume on demand)';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:234:        sourceSurface: 'session_start',
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:116:    it('T213-01: Checkpoint created with working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:135:    it('T213-02: Snapshot contains correct working memory data', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:182:  describe('clearExisting clears and restores working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:183:    it('T213-06: clearExisting removed non-checkpoint working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:217:  describe('Checkpoint with empty working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:597:// Add/update memory in working memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:600:// Get working memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1052:| `SPECKIT_WORKING_MEMORY`  | true    | Enable working memory sessions          |
.opencode/skill/system-spec-kit/mcp_server/tests/memory-tools.vitest.ts:12:    content: [{ type: 'text', text: JSON.stringify({ data: { results: [], count: 0 }, meta: { tool: 'memory_search' } }) }],
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:15:// Session/working memory   → Linear decay (working-memory.ts) — separate domain
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:111:      input: 'resume quickly',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:160:      'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162:      'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:927:        { id: 'call-1', params: { name: 'memory_search', arguments: {} } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:944:      expect(callArgs[0]).toBe('memory_search')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1054:              name: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1103:        memoryAwareTools: new Set<string>(['memory_search']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1113:        { id: 'call-5', params: { name: 'memory_search', arguments: { query: 'hook validation' } } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1131:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1136:        triggered: [{ memory_id: 11, matched_phrases: ['resume'] }],
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1150:      expect(autoSurfaceAtCompactionMock).toHaveBeenCalledWith('session resume context')
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
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2085:      'memory_search': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2086:      'memory_match_triggers': '[L2:Core]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2342:      expect(result).toContain('memory_search')
.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts:6:// session-resume.ts, and other consumers.
.opencode/skill/system-spec-kit/mcp_server/tests/tiered-injection-turnNumber.vitest.ts:183:      expect(typeof handlerExports.handle_memory_match_triggers).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:1:// TEST: memory_search per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:106:describe('T056: memory_search emits per-channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/README.md:31:- Core cognitive behavior such as attention decay, working memory, co-activation, and tier handling.
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:37:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:43:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:177:  { tool: 'memory_search', handler: 'handleMemorySearch' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:179:  { tool: 'memory_match_triggers', handler: 'handleMemoryMatchTriggers' },
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:74:    // Init working memory module first (creates working_memory table)
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:103:  describe('T302-GAP2a: completeSession() clears working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:104:    it('T302-04 to T302-06: completeSession() clears working memory entries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:107:      // Setup: seed working memory entries
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:118:      // Call completeSession — should clear working memory
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:122:      // Verify working memory entries are gone
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:132:  describe('T302-GAP2b: clearSession() clears working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:133:    it('T302-07 to T302-10: clearSession() clears both working memory and sent_memories', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:136:      // Seed working memory entries
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:149:      // Call clearSession — should clear both sent_memories AND working memory
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:153:      // Verify working memory entries are gone
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:41:    const result = validateToolArgs('memory_search', {
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:24:    it('resume', () => { expect(classifyQueryIntent('resume my last session').intent).toBe('hybrid'); });
.opencode/skill/system-spec-kit/mcp_server/tests/runtime-routing.vitest.ts:43:    it('resume my previous work', () => { expect(classifyQueryIntent('resume my previous work').intent).toBe('hybrid'); });
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:132:  it('returns null for memory_search', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:133:    const result = await autoSurfaceAtToolDispatch('memory_search', { query: 'some query' });
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:137:  it('returns null for memory_match_triggers', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:138:    const result = await autoSurfaceAtToolDispatch('memory_match_triggers', { prompt: 'some prompt' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:273:      sm.saveSessionState('trusted-session', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:278:      const result = sm.resolveTrustedSession('trusted-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:280:      expect(result.requestedSessionId).toBe('trusted-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:281:      expect(result.effectiveSessionId).toBe('trusted-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:282:      expect(result.trusted).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:288:      sm.saveSessionState('trusted-session-without-identity', { currentTask: 'tracked by server' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:290:      const result = sm.resolveTrustedSession('trusted-session-without-identity');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:292:      expect(result.trusted).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:306:      expect(result.trusted).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:322:      expect(result.trusted).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:330:      expect(result.trusted).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:339:      expect(result.trusted).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:615:      expect(md).toContain('/spec_kit:resume specs/005');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:625:      // Without specFolder, should use sessionId-based resume command
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:626:      expect(md).toContain('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:19:        memory_search: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:21:        memory_match_triggers: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:216:      expect(modes.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:226:    it('T205-D3: Budget ordering is logical (quick < resume < focused < deep)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:231:      const resumeBudget = modes.resume.tokenBudget;
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:235:      expect(resumeBudget).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:238:      if (quickBudget === undefined || resumeBudget === undefined || focusedBudget === undefined || deepBudget === undefined) {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:241:      expect(quickBudget).toBeLessThan(resumeBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:242:      expect(resumeBudget).toBeLessThan(focusedBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:304:  `).run(1, 'sess-1', 1, 0.9, now, later, 2, 1, 1, 'memory_search', 'call-1', 'rule-1', 0);
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:118:        memory_search: 'L2',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:120:        memory_match_triggers: 'L2',
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
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:59:    trackQueryAndDetect(db, 'sess-b', 'memory context resume', 'q1', ['mem-9']);
.opencode/skill/system-spec-kit/mcp_server/tests/query-flow-tracker.vitest.ts:61:    const detection = trackQueryAndDetect(db, 'sess-b', 'resume memory context', 'q2', ['mem-10']);
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:71:  it('surfaces certainty fields in the shared resume payload', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:123:    const { handleSessionResume } = await import('../handlers/session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:142:      'memory-resume': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:162:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:169:              memory: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:170:              hints: ['resume ok'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:172:                kind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:238:    expect(parsed.data.payloadContract.summary).toContain('resume=estimated');
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:243:      'resume-surface': 'estimated',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:130:      expect(['startup', 'resume', 'compact', 'clear']).toContain(source);
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:151:  it('keeps structural snapshot trust off the errored resume payload while preserving it on structural context', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:152:    vi.doMock('../handlers/session-resume.js', () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:154:        throw new Error('synthetic resume failure');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:188:    expect(parsed.data.resume.error).toContain('synthetic resume failure');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:189:    expect(parsed.data.resume).not.toHaveProperty('parserProvenance');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:190:    expect(parsed.data.resume).not.toHaveProperty('evidenceStatus');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:191:    expect(parsed.data.resume).not.toHaveProperty('freshnessAuthority');
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
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:23:          trackedPayloadKinds: ['resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:29:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:30:          dedupeKey: 'system:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:31:          content: 'Summary: resume summary',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:36:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:37:          dedupeKey: 'messages:resume:0',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:43:          payloadKind: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:44:          dedupeKey: 'compaction:resume',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:126:        specKitCompactCodeGraph: 'messages:resume:0',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:203:    expect(status).toContain('resume_mode=minimal');
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:50:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:68:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/error-sanitization.vitest.ts:83:    const response = buildErrorResponse('memory_search', error);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:85:      resumed?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:87:      resumedContextCount?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:94:    systemPromptContextInjected?: boolean;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:95:    systemPromptContext?: Array<{ memoryId: number }>;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:113:    trusted: true,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:137:    it('T524-1: Auto mode routes "resume" to resume strategy', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:140:          input: 'resume where I left off on the authentication module',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:156:      expect(mode).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:181:    it('routes auto mode to resume when a caller session already exists without resume keywords', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:182:      mockTrustedSession('session-auto-resume');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:188:          sessionId: 'session-auto-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:191:        'auto-resume-session-context'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:195:      expect(parsed.meta.mode).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:288:    it('forwards governed scope fields through resume-mode search routing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:291:          input: 'resume session',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:292:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:299:        'scope-forward-resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:319:        resume: 2000,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:515:  describe('Session lifecycle metadata and resume context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:557:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:561:    it('T027l/T027m: caller session resume reports counter and injects top-5 context', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:578:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:581:        'T027l-resume'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:588:      expect(parsed.meta.sessionLifecycle.resumed).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:590:      expect(parsed.meta.sessionLifecycle.resumedContextCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:592:      expect(parsed.data.systemPromptContextInjected).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:593:      expect(parsed.data.systemPromptContext!.length).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:594:      expect(parsed.data.systemPromptContext![0].memoryId).toBe(101);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:625:          input: 'resume prior work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:627:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:639:          currentState: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:641:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:642:          reason: 'resumed session inferred resume mode',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:647:    it('uses the last inferred mode as previousState when a traced caller session resumes', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:657:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:667:          currentState: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:668:          signalSources: expect.arrayContaining(['session-resume', 'explicit-mode']),
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:673:    it('default-on contract: auto-resume injection runs when SPECKIT_AUTO_RESUME is unset', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:682:          title: 'Auto resume memory',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:683:          filePath: '/tmp/auto-resume.md',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:690:          input: 'resume prior work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:692:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:695:        'auto-resume-default-on'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:699:      expect(parsed.data.systemPromptContextInjected).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:700:      expect(parsed.data.systemPromptContext!.length).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:701:      expect(parsed.data.systemPromptContext![0].memoryId).toBe(201);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:713:          title: 'Disabled auto-resume memory',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:714:          filePath: '/tmp/disabled-auto-resume.md',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:721:          input: 'resume prior work',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:723:          mode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:726:        'auto-resume-opt-out'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:730:      expect(parsed.data.systemPromptContextInjected).not.toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:731:      expect(parsed.data.systemPromptContext ?? []).toEqual([]);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts:86:    expect(envelope.meta.tool).toBe('memory_search');
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:49:  it('resume session continues event_counter and preserves working memory items', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:52:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:53:    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:55:    expect(workingMemory.sessionExists('resume-session')).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:56:    expect(workingMemory.getSessionEventCounter('resume-session')).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:58:    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:59:    expect(workingMemory.getSessionEventCounter('resume-session')).toBeGreaterThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:61:    const rows = workingMemory.getWorkingMemory('resume-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:62:    const resumedRow = rows.find((row) => row.memory_id === 2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:63:    expect(resumedRow?.event_counter).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:151:            data: { resumed: true },
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:195:    const { handleSessionResume } = await import('../handlers/session-resume.js');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:196:    const resumeResult = await handleSessionResume({ specFolder: 'specs/026-root' });
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:197:    const parsedResume = JSON.parse(resumeResult.content[0].text);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:198:    const resumeStructuralSection = parsedResume.data.payloadContract.sections.find(
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:202:    expect(resumeStructuralSection?.structuralTrust).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:215:    expect(parsed.data.resume).toMatchObject({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:107:    expect(modes).toContain('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:135:  it('T006: resume mode has resume strategy and 2000 token budget', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:136:    const resumeMode: ContextMode = CONTEXT_MODES.resume;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:137:    expect(resumeMode.strategy).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:138:    expect(resumeMode.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:229:  it('T020: No intent maps to quick or resume by default', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:232:      expect(mode).not.toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:304:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:323:  it('prioritizes resumed-session and explicit-mode reasons deterministically', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:324:    const resumed = buildSessionTransitionTrace({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:326:      resumedSession: true,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:327:      effectiveMode: 'resume',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:333:    expect(resumed.signalSources).toEqual([
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:334:      'session-resume',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:338:    expect(resumed.confidence).toBe(0.95);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:339:    expect(resumed.reason).toBe('resumed session inferred resume mode');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:343:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:375:      resumedSession: false,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:574:  it('T061: Resume mode strategy is resume', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:575:    expect(CONTEXT_MODES.resume.strategy).toBe('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:579:    expect(CONTEXT_MODES.resume.name).toBe('Resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:583:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:585:      desc.includes('session') || desc.includes('previous') || desc.includes('resume') || desc.includes('state')
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:590:    expect(CONTEXT_MODES.resume.tokenBudget).toBe(2000);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:594:    const resumeBudget: number = CONTEXT_MODES.resume.tokenBudget!;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:596:    expect(resumeBudget).toBeLessThan(deepBudget);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:601:    expect(mappedModes).not.toContain('resume');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:606:    const resumeCount: number = strategies.filter((s: string) => s === 'resume').length;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:607:    expect(resumeCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:611:    const desc: string = CONTEXT_MODES.resume.description.toLowerCase();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:618:    expect(CONTEXT_MODES.resume.description.length).toBeGreaterThan(10);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:622:    const resume: ContextMode = CONTEXT_MODES.resume;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:623:    expect(resume.name).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:624:    expect(resume.description).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:625:    expect(resume.strategy).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:626:    expect(resume.tokenBudget).toBeDefined();
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:671:    // And via keyword detection, can route to resume
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:731:    const resume: number = CONTEXT_MODES.resume.tokenBudget!;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:735:    expect(quick).toBeLessThan(resume);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:736:    expect(resume).toBeLessThan(focused);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:852:    expect(Object.keys(CONTEXT_MODES).sort()).toEqual(['auto', 'deep', 'focused', 'quick', 'resume']);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:902:      meta: { tool: 'memory_search' }
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:1005:      resume: 2000
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts:424:Contenu en francais: cafe, resume, naive, cliche.
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:123:describe('memory_search UX hook integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:190:    const resumed = await handleMemorySearch({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:195:    const resumedEnvelope = parseEnvelope(resumed);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:196:    const resumedData = resumedEnvelope.data as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:198:    expect(resumedEnvelope.summary).toBe('Error: Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:199:    expect(resumedData.error).toBe('Cursor is invalid, expired, or out of scope');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:102:        trusted: false,

codex
I have the symbol map now. The useful threads are shaping up around migration/bootstrap behavior, transaction boundaries, passive-capture failure handling, and whether search/context APIs fail open or fail closed compared with Public’s trusted-session and scoped retrieval paths.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '395,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '948,1225p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1046			if err != sql.ErrNoRows {
  1047				return err
  1048			}
  1049	
  1050			syncID := newSyncID("obs")
  1051			res, err := s.execHook(tx,
  1052				`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
  1053				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))`,
  1054				syncID, p.SessionID, p.Type, title, content,
  1055				nullableString(p.ToolName), nullableString(p.Project), scope, nullableString(topicKey), normHash,
  1056			)
  1057			if err != nil {
  1058				return err
  1059			}
  1060			observationID, err = res.LastInsertId()
  1061			if err != nil {
  1062				return err
  1063			}
  1064			obs, err = s.getObservationTx(tx, observationID)
  1065			if err != nil {
  1066				return err
  1067			}
  1068			return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
  1069		})
  1070		if err != nil {
  1071			return 0, err
  1072		}
  1073		return observationID, nil
  1074	}
  1075	
  1076	func (s *Store) RecentObservations(project, scope string, limit int) ([]Observation, error) {
  1077		// Normalize project filter for case-insensitive matching
  1078		project, _ = NormalizeProject(project)
  1079	
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

 succeeded in 0ms:
   395	func New(cfg Config) (*Store, error) {
   396		if !filepath.IsAbs(cfg.DataDir) {
   397			return nil, fmt.Errorf("engram: data directory must be an absolute path, got %q — set ENGRAM_DATA_DIR or ensure your home directory is resolvable", cfg.DataDir)
   398		}
   399		if err := os.MkdirAll(cfg.DataDir, 0755); err != nil {
   400			return nil, fmt.Errorf("engram: create data dir: %w", err)
   401		}
   402	
   403		dbPath := filepath.Join(cfg.DataDir, "engram.db")
   404		db, err := openDB("sqlite", dbPath)
   405		if err != nil {
   406			return nil, fmt.Errorf("engram: open database: %w", err)
   407		}
   408	
   409		// SQLite performance pragmas
   410		pragmas := []string{
   411			"PRAGMA journal_mode = WAL",
   412			"PRAGMA busy_timeout = 5000",
   413			"PRAGMA synchronous = NORMAL",
   414			"PRAGMA foreign_keys = ON",
   415		}
   416		for _, p := range pragmas {
   417			if _, err := db.Exec(p); err != nil {
   418				return nil, fmt.Errorf("engram: pragma %q: %w", p, err)
   419			}
   420		}
   421	
   422		s := &Store{db: db, cfg: cfg, hooks: defaultStoreHooks()}
   423		if err := s.migrate(); err != nil {
   424			return nil, fmt.Errorf("engram: migration: %w", err)
   425		}
   426		if err := s.repairEnrolledProjectSyncMutations(); err != nil {
   427			return nil, fmt.Errorf("engram: repair enrolled sync journal: %w", err)
   428		}
   429	
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
   621		}
   622		if _, err := s.execHook(s.db, `UPDATE observations SET sync_id = 'obs-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
   623			return err
   624		}
   625	
   626		if _, err := s.execHook(s.db, `UPDATE user_prompts SET project = '' WHERE project IS NULL`); err != nil {
   627			return err
   628		}
   629		if _, err := s.execHook(s.db, `UPDATE user_prompts SET sync_id = 'prompt-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
   630			return err
   631		}
   632		if _, err := s.execHook(s.db, `INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES ('cloud', 'idle', datetime('now'))`); err != nil {
   633			return err
   634		}
   635	
   636		// Create triggers to keep FTS in sync (idempotent check)
   637		var name string
   638		err := s.db.QueryRow(
   639			"SELECT name FROM sqlite_master WHERE type='trigger' AND name='obs_fts_insert'",
   640		).Scan(&name)
   641	
   642		if err == sql.ErrNoRows {
   643			triggers := `
   644				CREATE TRIGGER obs_fts_insert AFTER INSERT ON observations BEGIN
   645					INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
   646					VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
   647				END;
   648	
   649				CREATE TRIGGER obs_fts_delete AFTER DELETE ON observations BEGIN
   650					INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
   651					VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
   652				END;
   653	
   654				CREATE TRIGGER obs_fts_update AFTER UPDATE ON observations BEGIN
   655					INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
   656					VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
   657					INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
   658					VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
   659				END;
   660			`
   661			if _, err := s.execHook(s.db, triggers); err != nil {
   662				return err
   663			}
   664		}
   665	
   666		if err := s.migrateFTSTopicKey(); err != nil {
   667			return err
   668		}
   669	
   670		// Prompts FTS triggers (separate idempotent check)
   671		var promptTrigger string
   672		err = s.db.QueryRow(
   673			"SELECT name FROM sqlite_master WHERE type='trigger' AND name='prompt_fts_insert'",
   674		).Scan(&promptTrigger)
   675	
   676		if err == sql.ErrNoRows {
   677			promptTriggers := `
   678				CREATE TRIGGER prompt_fts_insert AFTER INSERT ON user_prompts BEGIN
   679					INSERT INTO prompts_fts(rowid, content, project)
   680					VALUES (new.id, new.content, new.project);
   681				END;
   682	
   683				CREATE TRIGGER prompt_fts_delete AFTER DELETE ON user_prompts BEGIN
   684					INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
   685					VALUES ('delete', old.id, old.content, old.project);
   686				END;
   687	
   688				CREATE TRIGGER prompt_fts_update AFTER UPDATE ON user_prompts BEGIN
   689					INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
   690					VALUES ('delete', old.id, old.content, old.project);
   691					INSERT INTO prompts_fts(rowid, content, project)
   692					VALUES (new.id, new.content, new.project);
   693				END;
   694			`
   695			if _, err := s.execHook(s.db, promptTriggers); err != nil {
   696				return err
   697			}
   698		}
   699	
   700		return nil
   701	}
   702	
   703	func (s *Store) migrateFTSTopicKey() error {
   704		var colCount int
   705		err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
   706		if err != nil || colCount > 0 {
   707			return nil
   708		}
   709	
   710		if _, err := s.execHook(s.db, `
   711			DROP TRIGGER IF EXISTS obs_fts_insert;
   712			DROP TRIGGER IF EXISTS obs_fts_update;
   713			DROP TRIGGER IF EXISTS obs_fts_delete;
   714			DROP TABLE IF EXISTS observations_fts;
   715			CREATE VIRTUAL TABLE observations_fts USING fts5(
   716				title,
   717				content,
   718				tool_name,
   719				type,
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1462,1765p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3016,3545p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  3276	
  3277		return "topic"
  3278	}
  3279	
  3280	func hasAny(text string, words ...string) bool {
  3281		for _, w := range words {
  3282			if strings.Contains(text, w) {
  3283				return true
  3284			}
  3285		}
  3286		return false
  3287	}
  3288	
  3289	func normalizeTopicSegment(s string) string {
  3290		v := strings.ToLower(strings.TrimSpace(s))
  3291		if v == "" {
  3292			return ""
  3293		}
  3294		re := regexp.MustCompile(`[^a-z0-9]+`)
  3295		v = re.ReplaceAllString(v, " ")
  3296		v = strings.Join(strings.Fields(v), "-")
  3297		if len(v) > 100 {
  3298			v = v[:100]
  3299		}
  3300		return v
  3301	}
  3302	
  3303	func normalizeTopicKey(topic string) string {
  3304		v := strings.TrimSpace(strings.ToLower(topic))
  3305		if v == "" {
  3306			return ""
  3307		}
  3308		v = strings.Join(strings.Fields(v), "-")
  3309		if len(v) > 120 {
  3310			v = v[:120]
  3311		}
  3312		return v
  3313	}
  3314	
  3315	func derefString(v *string) string {
  3316		if v == nil {
  3317			return ""
  3318		}
  3319		return *v
  3320	}
  3321	
  3322	func hashNormalized(content string) string {
  3323		normalized := strings.ToLower(strings.Join(strings.Fields(content), " "))
  3324		h := sha256.Sum256([]byte(normalized))
  3325		return hex.EncodeToString(h[:])
  3326	}
  3327	
  3328	func dedupeWindowExpression(window time.Duration) string {
  3329		if window <= 0 {
  3330			window = 15 * time.Minute
  3331		}
  3332		minutes := int(window.Minutes())
  3333		if minutes < 1 {
  3334			minutes = 1
  3335		}
  3336		return "-" + strconv.Itoa(minutes) + " minutes"
  3337	}
  3338	
  3339	func maxInt(a, b int) int {
  3340		if a > b {
  3341			return a
  3342		}
  3343		return b
  3344	}
  3345	
  3346	func normalizeSyncTargetKey(targetKey string) string {
  3347		if strings.TrimSpace(targetKey) == "" {
  3348			return DefaultSyncTargetKey
  3349		}
  3350		return strings.TrimSpace(strings.ToLower(targetKey))
  3351	}
  3352	
  3353	func newSyncID(prefix string) string {
  3354		b := make([]byte, 8)
  3355		if _, err := rand.Read(b); err != nil {
  3356			return fmt.Sprintf("%s-%d", prefix, time.Now().UTC().UnixNano())
  3357		}
  3358		return prefix + "-" + hex.EncodeToString(b)
  3359	}
  3360	
  3361	func normalizeExistingSyncID(existing, prefix string) string {
  3362		if strings.TrimSpace(existing) != "" {
  3363			return existing
  3364		}
  3365		return newSyncID(prefix)
  3366	}
  3367	
  3368	// privateTagRegex matches <private>...</private> tags and their contents.
  3369	// Supports multiline and nested content. Case-insensitive.
  3370	var privateTagRegex = regexp.MustCompile(`(?is)<private>.*?</private>`)
  3371	
  3372	// stripPrivateTags removes all <private>...</private> content from a string.
  3373	// This ensures sensitive information (API keys, passwords, personal data)
  3374	// is never persisted to the memory database.
  3375	func stripPrivateTags(s string) string {
  3376		result := privateTagRegex.ReplaceAllString(s, "[REDACTED]")
  3377		// Clean up multiple consecutive [REDACTED] and excessive whitespace
  3378		result = strings.TrimSpace(result)
  3379		return result
  3380	}
  3381	
  3382	// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
  3383	// "fix auth bug" → `"fix" "auth" "bug"`
  3384	func sanitizeFTS(query string) string {
  3385		words := strings.Fields(query)
  3386		for i, w := range words {
  3387			// Strip existing quotes to avoid double-quoting
  3388			w = strings.Trim(w, `"`)
  3389			words[i] = `"` + w + `"`
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
  3536		return result, nil
  3537	}
  3538	
  3539	// ClassifyTool returns the observation type for a given tool name.
  3540	func ClassifyTool(toolName string) string {
  3541		switch toolName {
  3542		case "write", "edit", "patch":
  3543			return "file_change"
  3544		case "bash":
  3545			return "command"

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '754,948p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '50,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '626,1135p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"func .*withTx|beginTxHook|commitHook|Rollback|enqueueSyncMutationTx|repairEnrolledProjectSyncMutations|MergeProjects|Import\\(|Export\\(|sync_mutations|sync_state|enroll\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
194:// EnrolledProject represents a project enrolled for cloud sync.
197:	EnrolledAt string `json:"enrolled_at"`
381:func (s *Store) beginTxHook() (*sql.Tx, error) {
388:func (s *Store) commitHook(tx *sql.Tx) error {
426:	if err := s.repairEnrolledProjectSyncMutations(); err != nil {
427:		return nil, fmt.Errorf("engram: repair enrolled sync journal: %w", err)
513:			CREATE TABLE IF NOT EXISTS sync_state (
527:			CREATE TABLE IF NOT EXISTS sync_mutations (
537:				FOREIGN KEY (target_key) REFERENCES sync_state(target_key)
579:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_target_seq ON sync_mutations(target_key, seq);
580:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_pending ON sync_mutations(target_key, acked_at, seq);
585:	// Project-scoped sync: add project column to sync_mutations and enrollment table.
586:	if err := s.addColumnIfNotExists("sync_mutations", "project", "TEXT NOT NULL DEFAULT ''"); err != nil {
590:		CREATE TABLE IF NOT EXISTS sync_enrolled_projects (
592:			enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
594:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_project ON sync_mutations(project);
600:		UPDATE sync_mutations
632:	if _, err := s.execHook(s.db, `INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES ('cloud', 'idle', datetime('now'))`); err != nil {
762:		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
797:		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
1006:				return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
1044:			return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
1068:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
1132:		return s.enqueueSyncMutationTx(tx, SyncEntityPrompt, syncID, SyncOpUpsert, syncPromptPayload{
1305:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, updated.SyncID, SyncOpUpsert, observationPayloadFromObservation(updated))
1343:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpDelete, syncObservationPayload{
1671:func (s *Store) Export() (*ExportData, error) {
1743:func (s *Store) Import(data *ExportData) (*ImportResult, error) {
1744:	tx, err := s.beginTxHook()
1748:	defer tx.Rollback()
1807:	if err := s.commitHook(tx); err != nil {
1865:	// Only return mutations for enrolled projects or empty-project (global) mutations.
1866:	// Empty-project mutations always sync regardless of enrollment.
1869:		FROM sync_mutations sm
1870:		LEFT JOIN sync_enrolled_projects sep ON sm.project = sep.project
1892:// that belong to non-enrolled projects, preventing journal bloat. Empty-project
1893:// mutations are never skipped — they always sync regardless of enrollment.
1897:		UPDATE sync_mutations
1902:		  AND project NOT IN (SELECT project FROM sync_enrolled_projects)`,
1922:			`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq <= ? AND acked_at IS NULL`,
1936:			`UPDATE sync_state
1963:				`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq = ? AND acked_at IS NULL`,
1973:		if err := tx.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE target_key = ? AND acked_at IS NULL`, targetKey).Scan(&remaining); err != nil {
1981:			`UPDATE sync_state SET last_acked_seq = ?, lifecycle = ?, updated_at = datetime('now') WHERE target_key = ?`,
2012:			`UPDATE sync_state
2028:		`UPDATE sync_state
2045:			`UPDATE sync_state
2057:		`UPDATE sync_state
2112:			`UPDATE sync_state
2137:// EnrollProject registers a project for cloud sync. Idempotent — re-enrolling
2138:// an already-enrolled project is a no-op.
2145:			`INSERT OR IGNORE INTO sync_enrolled_projects (project) VALUES (?)`,
2162:// UnenrollProject removes a project from cloud sync enrollment. Idempotent —
2163:// unenrolling a non-enrolled project is a no-op.
2164:func (s *Store) UnenrollProject(project string) error {
2169:		`DELETE FROM sync_enrolled_projects WHERE project = ?`,
2175:// ListEnrolledProjects returns all projects currently enrolled for cloud sync,
2179:		`SELECT project, enrolled_at FROM sync_enrolled_projects ORDER BY project ASC`)
2196:// IsProjectEnrolled returns true if the given project is enrolled for cloud sync.
2200:		`SELECT 1 FROM sync_enrolled_projects WHERE project = ? LIMIT 1`,
2267:		// Same pattern used by EnrollProject and MergeProjects.
2455:// MergeProjects migrates all records from each source project name into the
2459:func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
2560:func (s *Store) withTx(fn func(tx *sql.Tx) error) error {
2561:	tx, err := s.beginTxHook()
2565:	defer tx.Rollback()
2569:	return s.commitHook(tx)
2585:		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
2595:		FROM sync_state WHERE target_key = ?`, targetKey)
2605:		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
2613:		FROM sync_state WHERE target_key = ?`, targetKey)
2631:func (s *Store) repairEnrolledProjectSyncMutations() error {
2634:			`SELECT project FROM sync_enrolled_projects ORDER BY project ASC`,
2669:			FROM sync_mutations sm
2688:		if err := s.enqueueSyncMutationTx(tx, SyncEntitySession, payload.ID, SyncOpUpsert, payload); err != nil {
2703:			FROM sync_mutations sm
2722:		if err := s.enqueueSyncMutationTx(tx, SyncEntityObservation, payload.SyncID, SyncOpUpsert, payload); err != nil {
2736:			FROM sync_mutations sm
2755:		if err := s.enqueueSyncMutationTx(tx, SyncEntityPrompt, payload.SyncID, SyncOpUpsert, payload); err != nil {
2762:func (s *Store) enqueueSyncMutationTx(tx *sql.Tx, entity, entityKey, op string, payload any) error {
2769:		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
2775:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
2787:		`UPDATE sync_state
3048:	tx, err := s.beginTxHook()
3052:	defer tx.Rollback()
3144:	if err := s.commitHook(tx); err != nil {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1743,1815p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1776				obs.ToolName,
  1777				obs.Project,
  1778				normalizeScope(obs.Scope),
  1779				nullableString(normalizeTopicKey(derefString(obs.TopicKey))),
  1780				hashNormalized(obs.Content),
  1781				maxInt(obs.RevisionCount, 1),
  1782				maxInt(obs.DuplicateCount, 1),
  1783				obs.LastSeenAt,
  1784				obs.CreatedAt,
  1785				obs.UpdatedAt,
  1786				obs.DeletedAt,
  1787			)
  1788			if err != nil {
  1789				return nil, fmt.Errorf("import observation %d: %w", obs.ID, err)
  1790			}
  1791			result.ObservationsImported++
  1792		}
  1793	
  1794		// Import prompts
  1795		for _, p := range data.Prompts {
  1796			_, err := s.execHook(tx,
  1797				`INSERT INTO user_prompts (sync_id, session_id, content, project, created_at)
  1798				 VALUES (?, ?, ?, ?, ?)`,
  1799				normalizeExistingSyncID(p.SyncID, "prompt"), p.SessionID, p.Content, p.Project, p.CreatedAt,
  1800			)
  1801			if err != nil {
  1802				return nil, fmt.Errorf("import prompt %d: %w", p.ID, err)
  1803			}
  1804			result.PromptsImported++
  1805		}
  1806	
  1807		if err := s.commitHook(tx); err != nil {
  1808			return nil, fmt.Errorf("import: commit: %w", err)
  1809		}
  1810	
  1811		return result, nil
  1812	}
  1813	
  1814	type ImportResult struct {
  1815		SessionsImported     int `json:"sessions_imported"`

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '2455,2795p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"resolveTrustedSession|fail-closed|scope filtering failed|cursor is invalid|invalid, expired|systemPromptContext|getSessionPromptContext|clear working memory|trusted session|resume mode\" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib -g '"'!**/dist/**'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385:function resolveTrustedSession(
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:852:    // Immediately clear working memory for cleared session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1090:    // Immediately clear working memory for completed session (GAP 2).
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1413:  resolveTrustedSession,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:43:// T73: Import session manager for trusted session validation (IDOR prevention)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212:    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1438:      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1444:      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:318:Packet `009-auditable-savings-publication-contract` adds a fail-closed publication gate for row-level reporting exports. The current aggregate dashboard reader remains a read-only analytics surface, so row eligibility is enforced through `lib/context/publication-gate.ts` rather than by inventing a second reporting subsystem.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:349:    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:739:  getSessionPromptContext,
.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts:351: * @returns Object with next page of results, next cursor (if more), or null if cursor is invalid/expired.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:555:        error: 'Cursor is invalid, expired, or out of scope',

codex
I’ve got enough of the Engram side to start seeing the failure semantics. The strongest contrast so far is that Engram mostly returns raw storage failures or silently ignores session-creation errors in MCP handlers, while Public’s resume and trigger paths explicitly reject untrusted sessions and fail closed on scope problems.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '385,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '840,1110p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   861	  } catch (error: unknown) {
   862	    const message = error instanceof Error ? error.message : String(error);
   863	    console.error(`[session-manager] clear_session failed: ${message}`);
   864	    return { success: false, deletedCount: 0 };
   865	  }
   866	}
   867	
   868	function getSessionStats(sessionId: string): SessionStats {
   869	  if (!db || !sessionId) return { totalSent: 0, oldestEntry: null, newestEntry: null };
   870	
   871	  try {
   872	    const stmt = db.prepare(`
   873	      SELECT
   874	        COUNT(*) as total_sent,
   875	        MIN(sent_at) as oldest_entry,
   876	        MAX(sent_at) as newest_entry
   877	      FROM session_sent_memories
   878	      WHERE session_id = ?
   879	    `);
   880	    const row = stmt.get(sessionId) as { total_sent: number; oldest_entry: string | null; newest_entry: string | null } | undefined;
   881	
   882	    return {
   883	      totalSent: row?.total_sent || 0,
   884	      oldestEntry: row?.oldest_entry || null,
   885	      newestEntry: row?.newest_entry || null,
   886	    };
   887	  } catch (error: unknown) {
   888	    const message = error instanceof Error ? error.message : String(error);
   889	    console.warn(`[session-manager] get_session_stats failed: ${message}`);
   890	    return { totalSent: 0, oldestEntry: null, newestEntry: null };
   891	  }
   892	}
   893	
   894	/* ───────────────────────────────────────────────────────────────
   895	   8. INTEGRATION HELPERS
   896	──────────────────────────────────────────────────────────────── */
   897	
   898	function filterSearchResults(sessionId: string, results: MemoryInput[]): FilterResult {
   899	  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results)) {
   900	    return {
   901	      filtered: results || [],
   902	      dedupStats: { enabled: false, filtered: 0, total: results?.length || 0 },
   903	    };
   904	  }
   905	
   906	  // Reserve unsent hashes while filtering so concurrent searches cannot both inject.
   907	  const shouldSendMap = shouldSendMemoriesBatch(sessionId, results, true);
   908	  const seenBatchHashes = new Set<string>();
   909	  const filtered = results.filter((r) => {
   910	    if (r.id != null && shouldSendMap.get(r.id) === false) {
   911	      return false;
   912	    }
   913	    try {
   914	      const hash = generateMemoryHash(r);
   915	      if (seenBatchHashes.has(hash)) {
   916	        return false;
   917	      }
   918	      seenBatchHashes.add(hash);
   919	    } catch {
   920	      // If hash generation fails unexpectedly, preserve existing behavior.
   921	      return true;
   922	    }
   923	    return true;
   924	  });
   925	  const filteredCount = results.length - filtered.length;
   926	
   927	  return {
   928	    filtered,
   929	    dedupStats: {
   930	      enabled: true,
   931	      filtered: filteredCount,
   932	      total: results.length,
   933	      tokenSavingsEstimate: filteredCount > 0 ? `~${filteredCount * 200} tokens` : '0',
   934	    },
   935	  };
   936	}
   937	
   938	function markResultsSent(sessionId: string, results: MemoryInput[]): MarkBatchResult {
   939	  if (!SESSION_CONFIG.enabled || !sessionId || !Array.isArray(results) || results.length === 0) {
   940	    return { success: true, markedCount: 0 };
   941	  }
   942	
   943	  return markMemoriesSentBatch(sessionId, results);
   944	}
   945	
   946	function isEnabled(): boolean {
   947	  return SESSION_CONFIG.enabled;
   948	}
   949	
   950	function getConfig(): SessionConfig {
   951	  return { ...SESSION_CONFIG };
   952	}
   953	
   954	/* ───────────────────────────────────────────────────────────────
   955	   9. SESSION STATE MANAGEMENT
   956	──────────────────────────────────────────────────────────────── */
   957	
   958	const SESSION_STATE_SCHEMA_SQL = `
   959	  CREATE TABLE IF NOT EXISTS session_state (
   960	    session_id TEXT PRIMARY KEY,
   961	    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'completed', 'interrupted')),
   962	    spec_folder TEXT,
   963	    current_task TEXT,
   964	    last_action TEXT,
   965	    context_summary TEXT,
   966	    pending_work TEXT,
   967	    state_data TEXT,
   968	    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
   969	    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
   970	  );
   971	`;
   972	
   973	const SESSION_STATE_INDEX_SQL: string[] = [
   974	  'CREATE INDEX IF NOT EXISTS idx_session_state_status ON session_state(status);',
   975	  'CREATE INDEX IF NOT EXISTS idx_session_state_updated ON session_state(updated_at);',
   976	  'CREATE INDEX IF NOT EXISTS idx_session_state_identity_scope ON session_state(tenant_id, user_id, agent_id);',
   977	];
   978	
   979	const SESSION_STATE_MIGRATIONS: Array<{ column: string; sql: string }> = [
   980	  { column: 'tenant_id', sql: 'ALTER TABLE session_state ADD COLUMN tenant_id TEXT;' },
   981	  { column: 'user_id', sql: 'ALTER TABLE session_state ADD COLUMN user_id TEXT;' },
   982	  { column: 'agent_id', sql: 'ALTER TABLE session_state ADD COLUMN agent_id TEXT;' },
   983	];
   984	
   985	function getTableColumns(tableName: string): Set<string> {
   986	  if (!db) {
   987	    return new Set();
   988	  }
   989	
   990	  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name?: string }>;
   991	  return new Set(
   992	    rows
   993	      .map((row) => row.name)
   994	      .filter((name): name is string => typeof name === 'string' && name.length > 0),
   995	  );
   996	}
   997	
   998	function ensureSessionStateSchema(): InitResult {
   999	  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  1000	
  1001	  try {
  1002	    db.exec(SESSION_STATE_SCHEMA_SQL);
  1003	    const existingColumns = getTableColumns('session_state');
  1004	    for (const migration of SESSION_STATE_MIGRATIONS) {
  1005	      if (!existingColumns.has(migration.column)) {
  1006	        db.exec(migration.sql);
  1007	      }
  1008	    }
  1009	    for (const indexSql of SESSION_STATE_INDEX_SQL) {
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
  1096	    }
  1097	
  1098	    return { success: true };
  1099	  } catch (error: unknown) {
  1100	    const message = error instanceof Error ? error.message : String(error);
  1101	    console.error(`[session-manager] complete_session failed: ${message}`);
  1102	    return { success: false, error: message };
  1103	  }
  1104	}
  1105	
  1106	function resetInterruptedSessions(): ResetResult {
  1107	  if (!db) return { success: false, interruptedCount: 0, error: 'Database not initialized. Server may still be starting up.' };
  1108	
  1109	  try {
  1110	    ensureSessionStateSchema();

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,1465p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   981	      return executeQuickStrategy(normalizedInput, options);
   982	
   983	    case 'deep':
   984	      return executeDeepStrategy(normalizedInput, args.intent || null, options);
   985	
   986	    case 'resume':
   987	      return executeResumeStrategy(normalizedInput, args.intent || null, options);
   988	
   989	    case 'focused':
   990	    default:
   991	      return executeFocusedStrategy(normalizedInput, args.intent || null, options);
   992	  }
   993	}
   994	
   995	function buildResponseMeta(params: BuildResponseMetaParams): Record<string, unknown> {
   996	  const {
   997	    effectiveMode,
   998	    requestedMode,
   999	    tracedResult,
  1000	    pressurePolicy,
  1001	    pressureOverrideApplied,
  1002	    pressureOverrideTargetMode,
  1003	    pressureWarning,
  1004	    sessionLifecycle,
  1005	    effectiveBudget,
  1006	    enforcement,
  1007	    intentClassification,
  1008	    discoveredFolder,
  1009	    includeTrace,
  1010	    sessionTransition,
  1011	    structuralRoutingNudge,
  1012	  } = params;
  1013	  const { detectedIntent, intentConfidence, source } = intentClassification;
  1014	
  1015	  const telemetryMeta = retrievalTelemetry.isExtendedTelemetryEnabled()
  1016	    ? (() => {
  1017	        try {
  1018	          const t = retrievalTelemetry.createTelemetry();
  1019	          retrievalTelemetry.recordMode(
  1020	            t,
  1021	            effectiveMode,
  1022	            pressureOverrideApplied,
  1023	            pressurePolicy.level,
  1024	            pressurePolicy.ratio ?? undefined,
  1025	          );
  1026	          if (effectiveMode !== requestedMode && pressureOverrideApplied) {
  1027	            retrievalTelemetry.recordFallback(t, `pressure override: ${requestedMode} -> ${effectiveMode}`);
  1028	          }
  1029	          retrievalTelemetry.recordTransitionDiagnostics(
  1030	            t,
  1031	            includeTrace === true ? sessionTransition : undefined,
  1032	          );
  1033	          return { _telemetry: retrievalTelemetry.toJSON(t) };
  1034	        } catch (error: unknown) {
  1035	          void error;
  1036	          // Telemetry must never crash the handler
  1037	          return {};
  1038	        }
  1039	      })()
  1040	    : {};
  1041	
  1042	  return {
  1043	    layer: 'L1:Orchestration',
  1044	    mode: effectiveMode,
  1045	    requestedMode,
  1046	    strategy: tracedResult.strategy,
  1047	    tokenUsageSource: pressurePolicy.source,
  1048	    tokenUsagePressure: pressurePolicy.ratio,
  1049	    pressureLevel: pressurePolicy.level,
  1050	    pressure_level: pressurePolicy.level,
  1051	    pressurePolicy: {
  1052	      applied: pressureOverrideApplied,
  1053	      overrideMode: pressureOverrideApplied ? pressureOverrideTargetMode : null,
  1054	      warning: pressureWarning,
  1055	    },
  1056	    sessionLifecycle,
  1057	    tokenBudget: effectiveBudget,
  1058	    tokenBudgetEnforcement: enforcement,
  1059	    intent: detectedIntent ? {
  1060	      type: detectedIntent,
  1061	      confidence: intentConfidence,
  1062	      source,
  1063	    } : null,
  1064	    folderDiscovery: discoveredFolder ? {
  1065	      discovered: true,
  1066	      specFolder: discoveredFolder,
  1067	      source: 'folder-discovery',
  1068	    } : null,
  1069	    structuralRoutingNudge,
  1070	    ...telemetryMeta,
  1071	  };
  1072	}
  1073	
  1074	/* ───────────────────────────────────────────────────────────────
  1075	   7. MAIN HANDLER
  1076	──────────────────────────────────────────────────────────────── */
  1077	
  1078	/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
  1079	 * @param args - Context retrieval arguments (intent, mode, specFolder, anchors, etc.)
  1080	 * @returns MCP response with context-aware memory results
  1081	 */
  1082	async function handleMemoryContext(args: ContextArgs): Promise<MCPResponse> {
  1083	  const _contextStartTime = Date.now();
  1084	  const requestId = randomUUID();
  1085	
  1086	  try {
  1087	  try {
  1088	    await checkDatabaseUpdated();
  1089	  } catch (error: unknown) {
  1090	    const message = error instanceof Error ? error.message : String(error);
  1091	    return createMCPErrorResponse({
  1092	      tool: 'memory_context',
  1093	      error: `Database state check failed: ${message}`,
  1094	      code: 'E_INTERNAL',
  1095	      details: { requestId, layer: 'L1:Orchestration' },
  1096	      recovery: {
  1097	        hint: 'The memory database may be unavailable. Retry or check database connectivity.',
  1098	      },
  1099	    });
  1100	  }
  1101	
  1102	  const {
  1103	    input,
  1104	    mode: requested_mode = 'auto',
  1105	    intent: explicit_intent,
  1106	    specFolder: spec_folder,
  1107	    limit,
  1108	    enableDedup: enableDedup = true,
  1109	    includeContent: include_content = false,
  1110	    tokenUsage,
  1111	    anchors
  1112	  } = args;
  1113	
  1114	  // Validate input
  1115	  if (!input || typeof input !== 'string' || input.trim().length === 0) {
  1116	    return createMCPErrorResponse({
  1117	      tool: 'memory_context',
  1118	      error: 'Input is required and must be a non-empty string',
  1119	      code: 'E_VALIDATION',
  1120	      details: { requestId, layer: 'L1:Orchestration' },
  1121	      recovery: {
  1122	        hint: 'Provide a query, prompt, or context description'
  1123	      }
  1124	    });
  1125	  }
  1126	
  1127	  const normalizedInput = input.trim();
  1128	
  1129	  // ── Phase 020: Query-Intent Routing ──────────────────────────
  1130	  // Classify query intent and optionally augment response with code
  1131	  // graph context for structural/hybrid queries. Entire block is
  1132	  // wrapped in try/catch — any failure silently falls through to
  1133	  // existing semantic logic.
  1134	  let queryIntentMetadata: {
  1135	    queryIntent: string;
  1136	    routedBackend: string;
  1137	    confidence: number;
  1138	    matchedKeywords?: string[];
  1139	  } | null = null;
  1140	  let graphContextResult: Record<string, unknown> | null = null;
  1141	
  1142	  if (requested_mode !== 'resume') {
  1143	    try {
  1144	      const classification = classifyQueryIntent(normalizedInput);
  1145	      queryIntentMetadata = {
  1146	        queryIntent: classification.intent,
  1147	        routedBackend: classification.intent === 'structural' && classification.confidence > 0.65
  1148	          ? 'structural'
  1149	          : classification.intent === 'hybrid'
  1150	            ? 'hybrid'
  1151	            : 'semantic',
  1152	        confidence: classification.confidence,
  1153	        matchedKeywords: classification.matchedKeywords,
  1154	      };
  1155	
  1156	      // F050: Extract a symbol-like token from the query instead of passing
  1157	      // raw prose to buildContext({ subject }). resolveSubjectToRef() matches
  1158	      // against code_nodes.name / fq_name, so prose never resolves.
  1159	      // Heuristic: pick the first token that looks like a code identifier
  1160	      // (contains uppercase, underscore, or dot — e.g. "buildContext", "fq_name",
  1161	      // "code-graph-db.ts"). Falls back to first matched keyword, then normalizedInput.
  1162	      const codeIdentifierPattern = /[A-Z_.]|^[a-z]+[A-Z]/;
  1163	      const inputTokens = normalizedInput.split(/\s+/).filter(t => t.length >= 2);
  1164	      const extractedSubject =
  1165	        inputTokens.find(t => codeIdentifierPattern.test(t)) ??
  1166	        (classification.matchedKeywords?.[0]) ??
  1167	        normalizedInput;
  1168	
  1169	      if (classification.intent === 'structural' && classification.confidence > 0.65) {
  1170	        try {
  1171	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1172	          if (cgResult.metadata.totalNodes > 0) {
  1173	            graphContextResult = {
  1174	              graphContext: cgResult.graphContext,
  1175	              textBrief: cgResult.textBrief,
  1176	              combinedSummary: cgResult.combinedSummary,
  1177	              nextActions: cgResult.nextActions,
  1178	              metadata: cgResult.metadata,
  1179	            };
  1180	          }
  1181	        } catch {
  1182	          // Code graph unavailable — fall through to semantic
  1183	        }
  1184	      } else if (classification.intent === 'hybrid') {
  1185	        try {
  1186	          const cgResult = buildContext({ input: normalizedInput, subject: extractedSubject });
  1187	          if (cgResult.metadata.totalNodes > 0) {
  1188	            graphContextResult = {
  1189	              graphContext: cgResult.graphContext,
  1190	              textBrief: cgResult.textBrief,
  1191	              combinedSummary: cgResult.combinedSummary,
  1192	              nextActions: cgResult.nextActions,
  1193	              metadata: cgResult.metadata,
  1194	            };
  1195	          }
  1196	        } catch {
  1197	          // Code graph unavailable — hybrid degrades to semantic-only
  1198	        }
  1199	      }
  1200	      // 'semantic' or low-confidence: no graph context, fall through
  1201	    } catch {
  1202	      // Classification failed — fall through to existing logic entirely
  1203	    }
  1204	  }
  1205	
  1206	  // Eval logger — capture context query at entry (fail-safe)
  1207	  let _evalQueryId = 0;
  1208	  let _evalRunId = 0;
  1209	  try {
  1210	    const evalEntry = logSearchQuery({
  1211	      query: normalizedInput,
  1212	      intent: explicit_intent ?? null,
  1213	      specFolder: spec_folder ?? null,
  1214	    });
  1215	    _evalQueryId = evalEntry.queryId;
  1216	    _evalRunId = evalEntry.evalRunId;
  1217	  } catch {
  1218	    // Intentional no-op — error deliberately discarded
  1219	  }
  1220	
  1221	  const {
  1222	    requestedSessionId,
  1223	    effectiveSessionId,
  1224	    resumed: resumedSession,
  1225	    priorMode: previousState,
  1226	    counter: eventCounterStart,
  1227	    error: sessionScopeError,
  1228	  } = resolveSessionLifecycle(args, null);
  1229	  if (sessionScopeError) {
  1230	    return createMCPErrorResponse({
  1231	      tool: 'memory_context',
  1232	      error: sessionScopeError,
  1233	      code: 'E_SESSION_SCOPE',
  1234	      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
  1235	      recovery: {
  1236	        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
  1237	      },
  1238	    });
  1239	  }
  1240	  const sessionLifecycle: SessionLifecycleMetadata = {
  1241	    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
  1242	    requestedSessionId,
  1243	    effectiveSessionId,
  1244	    resumed: resumedSession,
  1245	    eventCounterStart,
  1246	    resumedContextCount: 0,
  1247	  };
  1248	
  1249	  // Get layer info for response metadata
  1250	  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
  1251	  const tokenBudget = layerInfo?.tokenBudget ?? 2000;
  1252	
  1253	  const runtimeContextStats: RuntimeContextStats = {
  1254	    tokenBudget,
  1255	  };
  1256	  try {
  1257	    runtimeContextStats.tokenCount = estimateTokens(normalizedInput);
  1258	  } catch {
  1259	    runtimeContextStats.tokenCount = undefined;
  1260	  }
  1261	
  1262	  // Resolve token pressure (caller -> estimator -> unavailable)
  1263	  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
  1264	  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
  1265	
  1266	  const pressurePolicy = pressurePolicyEnabled
  1267	    ? getPressureLevel(tokenUsage, runtimeContextStats)
  1268	    : {
  1269	        level: 'none' as const,
  1270	        ratio: null,
  1271	        source: 'unavailable' as const,
  1272	        warning: null,
  1273	      };
  1274	  if (pressurePolicy.warning) {
  1275	    console.warn(pressurePolicy.warning);
  1276	  }
  1277	
  1278	  // Build options object for strategy executors
  1279	  const options: ContextOptions = {
  1280	    specFolder: spec_folder,
  1281	    tenantId: args.tenantId,
  1282	    userId: args.userId,
  1283	    agentId: args.agentId,
  1284	    sharedSpaceId: args.sharedSpaceId,
  1285	    limit,
  1286	    sessionId: effectiveSessionId,
  1287	    enableDedup: enableDedup,
  1288	    includeContent: include_content,
  1289	    includeTrace: (args as unknown as Record<string, unknown>).includeTrace === true, // CHK-040
  1290	    anchors,
  1291	    profile: args.profile,
  1292	  };
  1293	
  1294	  const {
  1295	    effectiveMode,
  1296	    pressureOverrideApplied,
  1297	    pressureOverrideTargetMode,
  1298	    pressureWarning,
  1299	    intentClassification,
  1300	  } = resolveEffectiveMode(
  1301	    { ...args, input: normalizedInput },
  1302	    {
  1303	      requestedSessionId,
  1304	      effectiveSessionId,
  1305	      resumed: resumedSession,
  1306	      priorMode: previousState,
  1307	      counter: eventCounterStart,
  1308	    },
  1309	    pressurePolicy,
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
  1366	  try {
  1367	    result = await executeStrategy(effectiveMode, options, {
  1368	      ...args,
  1369	      input: normalizedInput,
  1370	      intent: detectedIntent,
  1371	    });
  1372	  } catch (error: unknown) {
  1373	    console.error(`[memory-context] Strategy execution failed [requestId=${requestId}]:`, toErrorMessage(error));
  1374	    return createMCPErrorResponse({
  1375	      tool: 'memory_context',
  1376	      error: toErrorMessage(error),
  1377	      code: 'E_STRATEGY',
  1378	      details: {
  1379	        requestId,
  1380	        layer: 'L1:Orchestration',
  1381	        mode: effectiveMode,
  1382	        alternativeLayers: layerDefs.getRecommendedLayers('search')
  1383	      },
  1384	      recovery: {
  1385	        hint: 'Try a different mode or check your input'
  1386	      }
  1387	    });
  1388	  }
  1389	
  1390	  const strategyError = extractStrategyError(result);
  1391	  if (strategyError) {
  1392	    return createMCPErrorResponse({
  1393	      tool: 'memory_context',
  1394	      error: strategyError.error,
  1395	      code: strategyError.code,
  1396	      details: {
  1397	        requestId,
  1398	        layer: 'L1:Orchestration',
  1399	        mode: effectiveMode,
  1400	        upstream: strategyError.details,
  1401	      },
  1402	      recovery: {
  1403	        hint: strategyError.hints[0] ?? 'Try a different mode or check your input',
  1404	        actions: strategyError.hints.slice(1),
  1405	        severity: strategyError.severity ?? 'error',
  1406	      },
  1407	    });
  1408	  }
  1409	
  1410	  // FIX RC1-A (superseded by P0 fix): Folder discovery no longer promotes to
  1411	  // options.specFolder, so the recovery retry is no longer needed. The folder
  1412	  // boost still applies via options.folderBoost for scoring prioritization.
  1413	
  1414	  try {
  1415	    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
  1416	  } catch (error: unknown) {
  1417	    void error;
  1418	    // Best-effort session state write — do not fail the handler
  1419	  }
  1420	
  1421	  // T205: Determine effective token budget from mode or layer definitions
  1422	  const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget;
  1423	  const effectiveBudget = modeTokenBudget || tokenBudget;
  1424	
  1425	  // M1 FIX: Inject auto-resume context BEFORE budget enforcement
  1426	  // so the final response respects the advertised token budget.
  1427	  const tracedResult0: ContextResult = effectiveMode === 'quick' && options.includeTrace === true
  1428	    ? attachSessionTransitionTrace(
  1429	      result as ContextResult & { content?: Array<{ text?: string; type?: string }> },
  1430	      sessionTransition,
  1431	    ) as ContextResult
  1432	    : result;
  1433	
  1434	  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
  1435	    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
  1436	    if (resumeContextItems.length > 0) {
  1437	      sessionLifecycle.resumedContextCount = resumeContextItems.length;
  1438	      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
  1439	        memoryId: item.memoryId,
  1440	        title: item.title,
  1441	        filePath: item.filePath,
  1442	        attentionScore: item.attentionScore,
  1443	      }));
  1444	      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
  1445	    }
  1446	  }
  1447	
  1448	  // T205: Enforce token budget AFTER all context injection
  1449	  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
  1450	  const tracedResult = budgetedResult;
  1451	
  1452	  // Phase 020: Attach graph context and query-intent routing metadata
  1453	  const responseData: ContextResult & Record<string, unknown> = { ...tracedResult };
  1454	  if (graphContextResult) {
  1455	    responseData.graphContext = graphContextResult;
  1456	  }
  1457	  if (queryIntentMetadata) {
  1458	    responseData.queryIntentRouting = queryIntentMetadata;
  1459	  }
  1460	  const structuralRoutingNudge = buildStructuralRoutingNudge(
  1461	    normalizedInput,
  1462	    queryIntentMetadata,
  1463	    graphContextResult,
  1464	  );
  1465	  if (structuralRoutingNudge) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '520,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
   521	    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
   522	    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
   523	    minQualityScore,
   524	    min_quality_score,
   525	    mode,
   526	    includeTrace: includeTraceArg = false,
   527	    sessionTransition,
   528	    profile,
   529	    retrievalLevel: retrievalLevel = 'auto',
   530	  } = args;
   531	  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
   532	  const includeTrace = includeTraceByFlag || includeTraceArg === true;
   533	  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
   534	  const progressiveScopeKey = JSON.stringify({
   535	    tenantId: normalizedScope.tenantId ?? null,
   536	    userId: normalizedScope.userId ?? null,
   537	    agentId: normalizedScope.agentId ?? null,
   538	    sessionId: normalizedScope.sessionId ?? null,
   539	    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
   540	  });
   541	
   542	  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
   543	  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
   544	  const hasQuery = typeof query === 'string' && query.trim().length > 0;
   545	  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
   546	  if (!hasCursor && !hasQuery && !hasConcepts) {
   547	    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
   548	  }
   549	
   550	  if (hasCursor) {
   551	    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
   552	    if (!resolved) {
   553	      return createMCPErrorResponse({
   554	        tool: 'memory_search',
   555	        error: 'Cursor is invalid, expired, or out of scope',
   556	        code: 'E_VALIDATION',
   557	        details: { parameter: 'cursor' },
   558	        recovery: {
   559	          hint: 'Retry the original search to generate a fresh continuation cursor',
   560	        },
   561	      });
   562	    }
   563	
   564	    const snippetResults = extractSnippets(resolved.results);
   565	    return createMCPSuccessResponse({
   566	      tool: 'memory_search',
   567	      summary: `Returned ${snippetResults.length} continuation results`,
   568	      data: {
   569	        count: snippetResults.length,
   570	        results: snippetResults,
   571	        continuation: resolved.continuation,
   572	      },
   573	      startTime: _searchStartTime,
   574	      cacheHit: false,
   575	    });
   576	  }
   577	
   578	  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
   579	
   580	  // Validate numeric limit parameter
   581	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   582	    ? Math.min(Math.floor(rawLimit), 100)
   583	    : 10;
   584	
   585	  // BUG-007: Validate query first with proper error handling
   586	  let normalizedQuery: string | null = null;
   587	  if (query !== undefined) {
   588	    try {
   589	      normalizedQuery = validateQuery(query);
   590	    } catch (validationError: unknown) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '200,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	      details: { parameter: 'prompt' },
   201	      recovery: {
   202	        hint: 'Provide a non-empty string for the prompt parameter'
   203	      }
   204	    });
   205	  }
   206	
   207	  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
   208	  // manager to prevent IDOR. Callers cannot read/write working memory for
   209	  // arbitrary sessions — only server-minted or previously tracked sessions.
   210	  let sessionId: string | undefined = rawSessionId;
   211	  if (rawSessionId) {
   212	    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
   213	      tenantId: args.tenantId,
   214	      userId: args.userId,
   215	      agentId: args.agentId,
   216	    });
   217	    if (trustedSession.error) {
   218	      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
   219	      return createMCPErrorResponse({
   220	        tool: 'memory_match_triggers',
   221	        error: trustedSession.error,
   222	        code: 'E_SESSION_SCOPE',
   223	        details: { requestedSessionId: rawSessionId },
   224	        recovery: {
   225	          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
   226	        },
   227	      });
   228	    }
   229	    sessionId = trustedSession.effectiveSessionId;
   230	  }
   231	
   232	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   233	    ? Math.min(Math.floor(rawLimit), 50)
   234	    : 3;
   235	  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
   236	    ? Math.floor(rawTurnNumber)
   237	    : 1;
   238	
   239	  await checkDatabaseUpdated();
   240	
   241	  const startTime = Date.now();
   242	
   243	  // Eval logger — capture trigger query at entry (fail-safe)
   244	  let _evalQueryId = 0;
   245	  let _evalRunId = 0;
   246	  try {
   247	    const evalEntry = logSearchQuery({
   248	      query: prompt,
   249	      intent: 'trigger_match',
   250	      specFolder: null,
   251	    });
   252	    _evalQueryId = evalEntry.queryId;
   253	    _evalRunId = evalEntry.evalRunId;
   254	  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }
   255	
   256	  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
   257	    try {
   258	      if (_evalRunId && _evalQueryId) {
   259	        logFinalResult({
   260	          evalRunId: _evalRunId,
   261	          queryId: _evalQueryId,
   262	          resultMemoryIds: memoryIds,
   263	          scores: memoryIds.map(() => 1.0), // trigger matches are binary
   264	          fusionMethod: 'trigger',
   265	          latencyMs,
   266	        });
   267	      }
   268	    } catch (_error: unknown) {
   269	      /* eval logging must never break triggers handler */
   270	    }
   271	  };
   272	
   273	  const useCognitive = includeCognitive &&
   274	    sessionId &&
   275	    workingMemory.isEnabled() &&
   276	    attentionDecay.getDb();
   277	
   278	  let decayStats: DecayStats | null = null;
   279	  if (useCognitive) {
   280	    try {
   281	      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
   282	    } catch (err: unknown) {
   283	      const message = toErrorMessage(err);
   284	      console.warn('[memory_match_triggers] Decay failed:', message);
   285	    }
   286	  }
   287	
   288	  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
   289	  let results: TriggerMatch[] = triggerMatchResult.matches;
   290	
   291	  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
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
   327	    }
   328	  }
   329	  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
   330	    ? triggerMatchResult.stats.signals
   331	    : [];
   332	  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;
   333	
   334	  if (!results || results.length === 0) {
   335	    const noMatchResponse = createMCPEmptyResponse({
   336	      tool: 'memory_match_triggers',
   337	      summary: 'No matching trigger phrases found',
   338	      data: {
   339	        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
   340	        degradedMatching: degradedTriggerMatching,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '325,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   325	function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
   326	  if (!db) return [];
   327	  ensureSchema();
   328	
   329	  const safeLimit = Math.max(1, Math.min(20, Math.floor(limit)));
   330	  const safeFloor = Math.max(0, Math.min(1, floor));
   331	
   332	  try {
   333	    return (db.prepare(`
   334	      SELECT
   335	        wm.memory_id AS memoryId,
   336	        COALESCE(m.title, '') AS title,
   337	        COALESCE(m.file_path, '') AS filePath,
   338	        wm.attention_score AS attentionScore
   339	      FROM working_memory wm
   340	      LEFT JOIN memory_index m ON wm.memory_id = m.id
   341	      WHERE wm.session_id = ?
   342	        AND wm.memory_id IS NOT NULL
   343	        AND wm.attention_score > ?
   344	      ORDER BY wm.attention_score DESC, wm.last_focused DESC
   345	      LIMIT ?
   346	    `) as Database.Statement).all(sessionId, safeFloor, safeLimit) as SessionPromptContextEntry[];
   347	  } catch (error: unknown) {
   348	    const msg = error instanceof Error ? error.message : String(error);
   349	    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
   350	    return [];
   351	  }
   352	}
   353	
   354	function getSessionInferredMode(sessionId: string): string | null {
   355	  const mode = sessionModeRegistry.get(sessionId);
   356	  return typeof mode === 'string' && mode.length > 0 ? mode : null;
   357	}
   358	
   359	function setSessionInferredMode(sessionId: string, mode: string): void {
   360	  const normalizedSessionId = sessionId.trim();

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1860,2065p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1860	func (s *Store) ListPendingSyncMutations(targetKey string, limit int) ([]SyncMutation, error) {
  1861		targetKey = normalizeSyncTargetKey(targetKey)
  1862		if limit <= 0 {
  1863			limit = 100
  1864		}
  1865		// Only return mutations for enrolled projects or empty-project (global) mutations.
  1866		// Empty-project mutations always sync regardless of enrollment.
  1867		rows, err := s.queryItHook(s.db, `
  1868			SELECT sm.seq, sm.target_key, sm.entity, sm.entity_key, sm.op, sm.payload, sm.source, sm.project, sm.occurred_at, sm.acked_at
  1869			FROM sync_mutations sm
  1870			LEFT JOIN sync_enrolled_projects sep ON sm.project = sep.project
  1871			WHERE sm.target_key = ? AND sm.acked_at IS NULL
  1872			  AND (sm.project = '' OR sep.project IS NOT NULL)
  1873			ORDER BY sm.seq ASC
  1874			LIMIT ?`, targetKey, limit)
  1875		if err != nil {
  1876			return nil, err
  1877		}
  1878		defer rows.Close()
  1879	
  1880		var mutations []SyncMutation
  1881		for rows.Next() {
  1882			var mutation SyncMutation
  1883			if err := rows.Scan(&mutation.Seq, &mutation.TargetKey, &mutation.Entity, &mutation.EntityKey, &mutation.Op, &mutation.Payload, &mutation.Source, &mutation.Project, &mutation.OccurredAt, &mutation.AckedAt); err != nil {
  1884				return nil, err
  1885			}
  1886			mutations = append(mutations, mutation)
  1887		}
  1888		return mutations, rows.Err()
  1889	}
  1890	
  1891	// SkipAckNonEnrolledMutations acks (marks as skipped) all pending mutations
  1892	// that belong to non-enrolled projects, preventing journal bloat. Empty-project
  1893	// mutations are never skipped — they always sync regardless of enrollment.
  1894	func (s *Store) SkipAckNonEnrolledMutations(targetKey string) (int64, error) {
  1895		targetKey = normalizeSyncTargetKey(targetKey)
  1896		res, err := s.execHook(s.db, `
  1897			UPDATE sync_mutations
  1898			SET acked_at = datetime('now')
  1899			WHERE target_key = ?
  1900			  AND acked_at IS NULL
  1901			  AND project != ''
  1902			  AND project NOT IN (SELECT project FROM sync_enrolled_projects)`,
  1903			targetKey,
  1904		)
  1905		if err != nil {
  1906			return 0, err
  1907		}
  1908		return res.RowsAffected()
  1909	}
  1910	
  1911	func (s *Store) AckSyncMutations(targetKey string, lastAckedSeq int64) error {
  1912		if lastAckedSeq <= 0 {
  1913			return nil
  1914		}
  1915		targetKey = normalizeSyncTargetKey(targetKey)
  1916		return s.withTx(func(tx *sql.Tx) error {
  1917			state, err := s.getSyncStateTx(tx, targetKey)
  1918			if err != nil {
  1919				return err
  1920			}
  1921			if _, err := s.execHook(tx,
  1922				`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq <= ? AND acked_at IS NULL`,
  1923				targetKey, lastAckedSeq,
  1924			); err != nil {
  1925				return err
  1926			}
  1927			acked := state.LastAckedSeq
  1928			if lastAckedSeq > acked {
  1929				acked = lastAckedSeq
  1930			}
  1931			lifecycle := SyncLifecyclePending
  1932			if acked >= state.LastEnqueuedSeq {
  1933				lifecycle = SyncLifecycleHealthy
  1934			}
  1935			_, err = s.execHook(tx,
  1936				`UPDATE sync_state
  1937				 SET last_acked_seq = ?, lifecycle = ?, updated_at = datetime('now')
  1938				 WHERE target_key = ?`,
  1939				acked, lifecycle, targetKey,
  1940			)
  1941			return err
  1942		})
  1943	}
  1944	
  1945	// AckSyncMutationSeqs acknowledges specific mutation sequence numbers without
  1946	// requiring them to be contiguous.
  1947	func (s *Store) AckSyncMutationSeqs(targetKey string, seqs []int64) error {
  1948		if len(seqs) == 0 {
  1949			return nil
  1950		}
  1951		targetKey = normalizeSyncTargetKey(targetKey)
  1952		return s.withTx(func(tx *sql.Tx) error {
  1953			state, err := s.getSyncStateTx(tx, targetKey)
  1954			if err != nil {
  1955				return err
  1956			}
  1957			maxSeq := state.LastAckedSeq
  1958			for _, seq := range seqs {
  1959				if seq <= 0 {
  1960					continue
  1961				}
  1962				if _, err := s.execHook(tx,
  1963					`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq = ? AND acked_at IS NULL`,
  1964					targetKey, seq,
  1965				); err != nil {
  1966					return err
  1967				}
  1968				if seq > maxSeq {
  1969					maxSeq = seq
  1970				}
  1971			}
  1972			var remaining int
  1973			if err := tx.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE target_key = ? AND acked_at IS NULL`, targetKey).Scan(&remaining); err != nil {
  1974				return err
  1975			}
  1976			lifecycle := SyncLifecyclePending
  1977			if remaining == 0 {
  1978				lifecycle = SyncLifecycleHealthy
  1979			}
  1980			_, err = s.execHook(tx,
  1981				`UPDATE sync_state SET last_acked_seq = ?, lifecycle = ?, updated_at = datetime('now') WHERE target_key = ?`,
  1982				maxSeq, lifecycle, targetKey,
  1983			)
  1984			return err
  1985		})
  1986	}
  1987	
  1988	func (s *Store) AcquireSyncLease(targetKey, owner string, ttl time.Duration, now time.Time) (bool, error) {
  1989		targetKey = normalizeSyncTargetKey(targetKey)
  1990		if ttl <= 0 {
  1991			ttl = time.Minute
  1992		}
  1993		if now.IsZero() {
  1994			now = time.Now().UTC()
  1995		}
  1996	
  1997		var acquired bool
  1998		err := s.withTx(func(tx *sql.Tx) error {
  1999			state, err := s.getSyncStateTx(tx, targetKey)
  2000			if err != nil {
  2001				return err
  2002			}
  2003			if state.LeaseUntil != nil {
  2004				leaseUntil, err := time.Parse(time.RFC3339, *state.LeaseUntil)
  2005				if err == nil && leaseUntil.After(now) && derefString(state.LeaseOwner) != "" && derefString(state.LeaseOwner) != owner {
  2006					acquired = false
  2007					return nil
  2008				}
  2009			}
  2010			leaseUntil := now.Add(ttl).UTC().Format(time.RFC3339)
  2011			_, err = s.execHook(tx,
  2012				`UPDATE sync_state
  2013				 SET lease_owner = ?, lease_until = ?, updated_at = datetime('now')
  2014				 WHERE target_key = ?`,
  2015				owner, leaseUntil, targetKey,
  2016			)
  2017			if err == nil {
  2018				acquired = true
  2019			}
  2020			return err
  2021		})
  2022		return acquired, err
  2023	}
  2024	
  2025	func (s *Store) ReleaseSyncLease(targetKey, owner string) error {
  2026		targetKey = normalizeSyncTargetKey(targetKey)
  2027		_, err := s.execHook(s.db,
  2028			`UPDATE sync_state
  2029			 SET lease_owner = NULL, lease_until = NULL, updated_at = datetime('now')
  2030			 WHERE target_key = ? AND (lease_owner = ? OR lease_owner IS NULL OR lease_owner = '')`,
  2031			targetKey, owner,
  2032		)
  2033		return err
  2034	}
  2035	
  2036	func (s *Store) MarkSyncFailure(targetKey, message string, backoffUntil time.Time) error {
  2037		targetKey = normalizeSyncTargetKey(targetKey)
  2038		backoff := backoffUntil.UTC().Format(time.RFC3339)
  2039		return s.withTx(func(tx *sql.Tx) error {
  2040			state, err := s.getSyncStateTx(tx, targetKey)
  2041			if err != nil {
  2042				return err
  2043			}
  2044			_, err = s.execHook(tx,
  2045				`UPDATE sync_state
  2046				 SET lifecycle = ?, consecutive_failures = ?, backoff_until = ?, last_error = ?, updated_at = datetime('now')
  2047				 WHERE target_key = ?`,
  2048				SyncLifecycleDegraded, state.ConsecutiveFailures+1, backoff, message, targetKey,
  2049			)
  2050			return err
  2051		})
  2052	}
  2053	
  2054	func (s *Store) MarkSyncHealthy(targetKey string) error {
  2055		targetKey = normalizeSyncTargetKey(targetKey)
  2056		_, err := s.execHook(s.db,
  2057			`UPDATE sync_state
  2058			 SET lifecycle = ?, consecutive_failures = 0, backoff_until = NULL, last_error = NULL, updated_at = datetime('now')
  2059			 WHERE target_key = ?`,
  2060			SyncLifecycleHealthy, targetKey,
  2061		)
  2062		return err
  2063	}
  2064	
  2065	func (s *Store) ApplyPulledMutation(targetKey string, mutation SyncMutation) error {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '380,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   380			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
   381			return
   382		}
   383		if body.SessionID == "" || body.Content == "" {
   384			jsonError(w, http.StatusBadRequest, "session_id and content are required")
   385			return
   386		}
   387	
   388		id, err := s.store.AddPrompt(body)
   389		if err != nil {
   390			jsonError(w, http.StatusInternalServerError, err.Error())
   391			return
   392		}
   393	
   394		s.notifyWrite()
   395		jsonResponse(w, http.StatusCreated, map[string]any{"id": id, "status": "saved"})
   396	}
   397	
   398	func (s *Server) handleRecentPrompts(w http.ResponseWriter, r *http.Request) {
   399		project := r.URL.Query().Get("project")
   400		limit := queryInt(r, "limit", 20)
   401	
   402		prompts, err := s.store.RecentPrompts(project, limit)
   403		if err != nil {
   404			jsonError(w, http.StatusInternalServerError, err.Error())
   405			return
   406		}
   407	
   408		jsonResponse(w, http.StatusOK, prompts)
   409	}
   410	
   411	func (s *Server) handleSearchPrompts(w http.ResponseWriter, r *http.Request) {
   412		query := r.URL.Query().Get("q")
   413		if query == "" {
   414			jsonError(w, http.StatusBadRequest, "q parameter is required")
   415			return
   416		}
   417	
   418		prompts, err := s.store.SearchPrompts(
   419			query,
   420			r.URL.Query().Get("project"),
   421			queryInt(r, "limit", 10),
   422		)
   423		if err != nil {
   424			jsonError(w, http.StatusInternalServerError, err.Error())
   425			return
   426		}
   427	
   428		jsonResponse(w, http.StatusOK, prompts)
   429	}
   430	
   431	// ─── Export / Import ─────────────────────────────────────────────────────────
   432	
   433	func (s *Server) handleExport(w http.ResponseWriter, r *http.Request) {
   434		data, err := s.store.Export()
   435		if err != nil {
   436			jsonError(w, http.StatusInternalServerError, err.Error())
   437			return
   438		}
   439	
   440		w.Header().Set("Content-Type", "application/json")
   441		w.Header().Set("Content-Disposition", "attachment; filename=engram-export.json")
   442		w.WriteHeader(http.StatusOK)
   443		json.NewEncoder(w).Encode(data)
   444	}
   445	
   446	func (s *Server) handleImport(w http.ResponseWriter, r *http.Request) {
   447		// Limit body to 50MB
   448		r.Body = http.MaxBytesReader(w, r.Body, 50<<20)
   449		body, err := io.ReadAll(r.Body)
   450		if err != nil {
   451			jsonError(w, http.StatusBadRequest, "failed to read body: "+err.Error())
   452			return
   453		}
   454	
   455		var data store.ExportData
   456		if err := json.Unmarshal(body, &data); err != nil {
   457			jsonError(w, http.StatusBadRequest, "invalid json: "+err.Error())
   458			return
   459		}
   460	
   461		result, err := s.store.Import(&data)
   462		if err != nil {
   463			jsonError(w, http.StatusInternalServerError, err.Error())
   464			return
   465		}
   466	
   467		s.notifyWrite()
   468		jsonResponse(w, http.StatusOK, result)
   469	}
   470	

exec
/bin/zsh -lc "rg -n \"Export\\(|Import\\(|MergeProjects\\(|PruneProject\\(|repairEnrolledProjectSyncMutations\\(|PassiveCapture\\(|sanitizeFTS\\(|FormatContext\\(|RecentPrompts\\(|SearchPrompts\\(|CreateSession\\(|EndSession\\(\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/cli -g '*.go'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/cli: No such file or directory (os error 2)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:151:func (s *Server) handleCreateSession(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:166:	if err := s.store.CreateSession(body.ID, body.Project, body.Directory); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:175:func (s *Server) handleEndSession(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:183:	if err := s.store.EndSession(id, body.Summary); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:226:func (s *Server) handlePassiveCapture(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:237:	result, err := s.store.PassiveCapture(body)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:398:func (s *Server) handleRecentPrompts(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:402:	prompts, err := s.store.RecentPrompts(project, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:411:func (s *Server) handleSearchPrompts(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:418:	prompts, err := s.store.SearchPrompts(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:433:func (s *Server) handleExport(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:434:	data, err := s.store.Export()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:446:func (s *Server) handleImport(w http.ResponseWriter, r *http.Request) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:461:	result, err := s.store.Import(&data)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:477:	context, err := s.store.FormatContext(project, scope)

codex
The next layer I’m checking is whether the observed behavior is intentional and tested: migrations, dedupe/topic upserts, passive capture, and import/export. That usually tells us whether a failure mode is a deliberate contract or just an implementation accident.
exec
/bin/zsh -lc "rg -n \"migrate|legacy|sanitizeFTS|topic_key|duplicate_count|revision_count|PassiveCapture|Import\\(|Export\\(|MergeProjects|PruneProject|CreateSession|EndSession|SearchPrompts|FormatContext|sync\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '1,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

 succeeded in 0ms:
     1	package store
     2	
     3	import (
     4		"database/sql"
     5		"encoding/json"
     6		"errors"
     7		"os"
     8		"path/filepath"
     9		"strings"
    10		"testing"
    11		"time"
    12	
    13		_ "modernc.org/sqlite"
    14	)
    15	
    16	func mustDefaultConfig(t *testing.T) Config {
    17		t.Helper()
    18		cfg, err := DefaultConfig()
    19		if err != nil {
    20			t.Fatalf("DefaultConfig: %v", err)
    21		}
    22		return cfg
    23	}
    24	
    25	func newTestStore(t *testing.T) *Store {
    26		t.Helper()
    27		cfg := mustDefaultConfig(t)
    28		cfg.DataDir = t.TempDir()
    29		cfg.DedupeWindow = time.Hour
    30	
    31		s, err := New(cfg)
    32		if err != nil {
    33			t.Fatalf("new store: %v", err)
    34		}
    35		t.Cleanup(func() {
    36			_ = s.Close()
    37		})
    38		return s
    39	}
    40	
    41	type fakeRows struct {
    42		next    []bool
    43		scanErr error
    44		err     error
    45	}
    46	
    47	func (f *fakeRows) Next() bool {
    48		if len(f.next) == 0 {
    49			return false
    50		}
    51		v := f.next[0]
    52		f.next = f.next[1:]
    53		return v
    54	}
    55	
    56	func (f *fakeRows) Scan(dest ...any) error {
    57		return f.scanErr
    58	}
    59	
    60	func (f *fakeRows) Err() error {
    61		return f.err
    62	}
    63	
    64	func (f *fakeRows) Close() error {
    65		return nil
    66	}
    67	
    68	func TestAddObservationDeduplicatesWithinWindow(t *testing.T) {
    69		s := newTestStore(t)
    70	
    71		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
    72			t.Fatalf("create session: %v", err)
    73		}
    74	
    75		firstID, err := s.AddObservation(AddObservationParams{
    76			SessionID: "s1",
    77			Type:      "bugfix",
    78			Title:     "Fixed tokenizer",
    79			Content:   "Normalized tokenizer panic on edge case",
    80			Project:   "engram",
    81			Scope:     "project",
    82		})
    83		if err != nil {
    84			t.Fatalf("add first observation: %v", err)
    85		}
    86	
    87		secondID, err := s.AddObservation(AddObservationParams{
    88			SessionID: "s1",
    89			Type:      "bugfix",
    90			Title:     "Fixed tokenizer",
    91			Content:   "normalized   tokenizer panic on EDGE case",
    92			Project:   "engram",
    93			Scope:     "project",
    94		})
    95		if err != nil {
    96			t.Fatalf("add duplicate observation: %v", err)
    97		}
    98	
    99		if firstID != secondID {
   100			t.Fatalf("expected duplicate to reuse same id, got %d and %d", firstID, secondID)
   101		}
   102	
   103		obs, err := s.GetObservation(firstID)
   104		if err != nil {
   105			t.Fatalf("get deduped observation: %v", err)
   106		}
   107		if obs.DuplicateCount != 2 {
   108			t.Fatalf("expected duplicate_count=2, got %d", obs.DuplicateCount)
   109		}
   110	}
   111	
   112	func TestScopeFiltersSearchAndContext(t *testing.T) {
   113		s := newTestStore(t)
   114	
   115		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   116			t.Fatalf("create session: %v", err)
   117		}
   118	
   119		_, err := s.AddObservation(AddObservationParams{
   120			SessionID: "s1",
   121			Type:      "decision",
   122			Title:     "Project auth",
   123			Content:   "Keep auth middleware in project memory",
   124			Project:   "engram",
   125			Scope:     "project",
   126		})
   127		if err != nil {
   128			t.Fatalf("add project observation: %v", err)
   129		}
   130	
   131		_, err = s.AddObservation(AddObservationParams{
   132			SessionID: "s1",
   133			Type:      "decision",
   134			Title:     "Personal note",
   135			Content:   "Use this regex trick later",
   136			Project:   "engram",
   137			Scope:     "personal",
   138		})
   139		if err != nil {
   140			t.Fatalf("add personal observation: %v", err)
   141		}
   142	
   143		projectResults, err := s.Search("regex", SearchOptions{Project: "engram", Scope: "project", Limit: 10})
   144		if err != nil {
   145			t.Fatalf("search project scope: %v", err)
   146		}
   147		if len(projectResults) != 0 {
   148			t.Fatalf("expected no project-scope regex results, got %d", len(projectResults))
   149		}
   150	
   151		personalResults, err := s.Search("regex", SearchOptions{Project: "engram", Scope: "personal", Limit: 10})
   152		if err != nil {
   153			t.Fatalf("search personal scope: %v", err)
   154		}
   155		if len(personalResults) != 1 {
   156			t.Fatalf("expected 1 personal-scope result, got %d", len(personalResults))
   157		}
   158	
   159		ctx, err := s.FormatContext("engram", "personal")
   160		if err != nil {
   161			t.Fatalf("format context personal: %v", err)
   162		}
   163		if !strings.Contains(ctx, "Personal note") {
   164			t.Fatalf("expected personal context to include personal observation")
   165		}
   166		if strings.Contains(ctx, "Project auth") {
   167			t.Fatalf("expected personal context to exclude project observation")
   168		}
   169	}
   170	
   171	func TestUpdateAndSoftDeleteExcludedFromSearchAndTimeline(t *testing.T) {
   172		s := newTestStore(t)
   173	
   174		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   175			t.Fatalf("create session: %v", err)
   176		}
   177	
   178		firstID, err := s.AddObservation(AddObservationParams{
   179			SessionID: "s1",
   180			Type:      "bugfix",
   181			Title:     "first",
   182			Content:   "first event",
   183			Project:   "engram",
   184			Scope:     "project",
   185		})
   186		if err != nil {
   187			t.Fatalf("add first: %v", err)
   188		}
   189	
   190		middleID, err := s.AddObservation(AddObservationParams{
   191			SessionID: "s1",
   192			Type:      "bugfix",
   193			Title:     "middle",
   194			Content:   "to be deleted",
   195			Project:   "engram",
   196			Scope:     "project",
   197		})
   198		if err != nil {
   199			t.Fatalf("add middle: %v", err)
   200		}
   201	
   202		lastID, err := s.AddObservation(AddObservationParams{
   203			SessionID: "s1",
   204			Type:      "bugfix",
   205			Title:     "last",
   206			Content:   "last event",
   207			Project:   "engram",
   208			Scope:     "project",
   209		})
   210		if err != nil {
   211			t.Fatalf("add last: %v", err)
   212		}
   213	
   214		newTitle := "last-updated"
   215		newContent := "updated content"
   216		newScope := "personal"
   217		updated, err := s.UpdateObservation(lastID, UpdateObservationParams{
   218			Title:   &newTitle,
   219			Content: &newContent,
   220			Scope:   &newScope,
   221		})
   222		if err != nil {
   223			t.Fatalf("update observation: %v", err)
   224		}
   225		if updated.Title != newTitle || updated.Scope != "personal" {
   226			t.Fatalf("update did not apply; got title=%q scope=%q", updated.Title, updated.Scope)
   227		}
   228	
   229		if err := s.DeleteObservation(middleID, false); err != nil {
   230			t.Fatalf("soft delete: %v", err)
   231		}
   232	
   233		if _, err := s.GetObservation(middleID); err == nil {
   234			t.Fatalf("expected deleted observation to be hidden from GetObservation")
   235		}
   236	
   237		searchResults, err := s.Search("deleted", SearchOptions{Project: "engram", Limit: 10})
   238		if err != nil {
   239			t.Fatalf("search after delete: %v", err)
   240		}
   241		if len(searchResults) != 0 {
   242			t.Fatalf("expected deleted observation excluded from search")
   243		}
   244	
   245		timeline, err := s.Timeline(firstID, 5, 5)
   246		if err != nil {
   247			t.Fatalf("timeline: %v", err)
   248		}
   249		if len(timeline.After) != 1 || timeline.After[0].ID != lastID {
   250			t.Fatalf("expected timeline to skip deleted observation")
   251		}
   252	
   253		if err := s.DeleteObservation(lastID, true); err != nil {
   254			t.Fatalf("hard delete: %v", err)
   255		}
   256		if _, err := s.GetObservation(lastID); err == nil {
   257			t.Fatalf("expected hard-deleted observation to be missing")
   258		}
   259	}
   260	
   261	func TestTopicKeyUpsertUpdatesSameTopicWithoutCreatingNewRow(t *testing.T) {
   262		s := newTestStore(t)
   263	
   264		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   265			t.Fatalf("create session: %v", err)
   266		}
   267	
   268		firstID, err := s.AddObservation(AddObservationParams{
   269			SessionID: "s1",
   270			Type:      "architecture",
   271			Title:     "Auth architecture",
   272			Content:   "Use middleware for JWT validation.",
   273			Project:   "engram",
   274			Scope:     "project",
   275			TopicKey:  "architecture auth model",
   276		})
   277		if err != nil {
   278			t.Fatalf("add first architecture: %v", err)
   279		}
   280	
   281		secondID, err := s.AddObservation(AddObservationParams{
   282			SessionID: "s1",
   283			Type:      "architecture",
   284			Title:     "Auth architecture",
   285			Content:   "Move auth to gateway + middleware chain.",
   286			Project:   "engram",
   287			Scope:     "project",
   288			TopicKey:  "ARCHITECTURE   AUTH  MODEL",
   289		})
   290		if err != nil {
   291			t.Fatalf("upsert architecture: %v", err)
   292		}
   293	
   294		if firstID != secondID {
   295			t.Fatalf("expected topic upsert to reuse id, got %d and %d", firstID, secondID)
   296		}
   297	
   298		obs, err := s.GetObservation(firstID)
   299		if err != nil {
   300			t.Fatalf("get upserted observation: %v", err)
   301		}
   302		if obs.RevisionCount != 2 {
   303			t.Fatalf("expected revision_count=2, got %d", obs.RevisionCount)
   304		}
   305		if obs.TopicKey == nil || *obs.TopicKey != "architecture-auth-model" {
   306			t.Fatalf("expected normalized topic key, got %v", obs.TopicKey)
   307		}
   308		if !strings.Contains(obs.Content, "gateway") {
   309			t.Fatalf("expected latest content after upsert, got %q", obs.Content)
   310		}
   311	}
   312	
   313	func TestDifferentTopicsDoNotReplaceEachOther(t *testing.T) {
   314		s := newTestStore(t)
   315	
   316		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   317			t.Fatalf("create session: %v", err)
   318		}
   319	
   320		archID, err := s.AddObservation(AddObservationParams{
   321			SessionID: "s1",
   322			Type:      "architecture",
   323			Title:     "Auth architecture",
   324			Content:   "Architecture decision",
   325			Project:   "engram",
   326			Scope:     "project",
   327			TopicKey:  "architecture/auth",
   328		})
   329		if err != nil {
   330			t.Fatalf("add architecture observation: %v", err)
   331		}
   332	
   333		bugID, err := s.AddObservation(AddObservationParams{
   334			SessionID: "s1",
   335			Type:      "bugfix",
   336			Title:     "Fix auth nil panic",
   337			Content:   "Bugfix details",
   338			Project:   "engram",
   339			Scope:     "project",
   340			TopicKey:  "bug/auth-nil-panic",
   341		})
   342		if err != nil {
   343			t.Fatalf("add bug observation: %v", err)
   344		}
   345	
   346		if archID == bugID {
   347			t.Fatalf("expected different topic keys to create different observations")
   348		}
   349	
   350		observations, err := s.AllObservations("engram", "project", 10)
   351		if err != nil {
   352			t.Fatalf("all observations: %v", err)
   353		}
   354		if len(observations) != 2 {
   355			t.Fatalf("expected 2 observations, got %d", len(observations))
   356		}
   357	}
   358	
   359	func TestNewMigratesLegacyObservationIDSchema(t *testing.T) {
   360		dataDir := t.TempDir()

 succeeded in 0ms:
71:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
108:		t.Fatalf("expected duplicate_count=2, got %d", obs.DuplicateCount)
115:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
159:	ctx, err := s.FormatContext("engram", "personal")
174:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
264:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
303:		t.Fatalf("expected revision_count=2, got %d", obs.RevisionCount)
316:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
365:		t.Fatalf("open legacy db: %v", err)
390:			(NULL, 's1', 'bugfix', 'legacy null', 'legacy null content', 'engram', datetime('now')),
391:			(7, 's1', 'bugfix', 'legacy fixed', 'legacy fixed content', 'engram', datetime('now')),
392:			(7, 's1', 'bugfix', 'legacy duplicate', 'legacy duplicate content', 'engram', datetime('now'));
396:		t.Fatalf("seed legacy db: %v", err)
399:		t.Fatalf("close legacy db: %v", err)
407:		t.Fatalf("new store after legacy schema: %v", err)
416:		t.Fatalf("expected 3 migrated observations, got %d", len(obs))
422:			t.Fatalf("expected migrated observation id > 0, got %d", o.ID)
425:			t.Fatalf("expected unique migrated ids, duplicate %d", o.ID)
430:	results, err := s.Search("legacy", SearchOptions{Project: "engram", Limit: 10})
460:		t.Fatalf("open legacy db: %v", err)
481:		INSERT INTO user_prompts (session_id, content, project) VALUES ('s1', 'legacy prompt', 'engram');
485:		t.Fatalf("seed legacy db: %v", err)
488:		t.Fatalf("close legacy db: %v", err)
496:		t.Fatalf("new store after legacy prompt schema: %v", err)
500:	var syncID string
501:	if err := s.db.QueryRow("SELECT sync_id FROM user_prompts WHERE content = ?", "legacy prompt").Scan(&syncID); err != nil {
502:		t.Fatalf("query migrated prompt sync_id: %v", err)
504:	if syncID == "" {
505:		t.Fatalf("expected migrated prompt sync_id to be backfilled")
522:		if name == "sync_id" {
531:		t.Fatalf("expected user_prompts.sync_id column after migration")
535:	if err := s.db.QueryRow("SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_prompts_sync_id'").Scan(&indexName); err != nil {
536:		t.Fatalf("query prompt sync index: %v", err)
538:	if indexName != "idx_prompts_sync_id" {
539:		t.Fatalf("expected idx_prompts_sync_id to exist, got %q", indexName)
570:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
621:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
625:	// Manually insert a prompt with NULL project to simulate legacy data or external changes
643:	// 2. Test SearchPrompts
644:	searchResult, err := s.SearchPrompts("null", "", 10)
646:		t.Fatalf("SearchPrompts failed with null project: %v", err)
653:	data, err := s.Export()
803:func TestPassiveCaptureStoresLearnings(t *testing.T) {
806:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
815:	result, err := s.PassiveCapture(PassiveCaptureParams{
848:func TestPassiveCaptureEmptyContent(t *testing.T) {
851:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
855:	result, err := s.PassiveCapture(PassiveCaptureParams{
869:func TestPassiveCaptureDedupesAgainstExistingObservations(t *testing.T) {
872:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
895:	result, err := s.PassiveCapture(PassiveCaptureParams{
915:func TestPassiveCaptureReturnsErrorWhenSessionDoesNotExist(t *testing.T) {
922:	_, err := s.PassiveCapture(PassiveCaptureParams{
936:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
939:	if err := s.CreateSession("s2", "engram", "/tmp/engram"); err != nil {
944:		`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, created_at, updated_at)
982:		`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, created_at, updated_at)
1016:	if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
1049:	exported, err := s.Export()
1062:	imported, err := dst.Import(exported)
1071:		t.Fatalf("record synced chunk: %v", err)
1075:		t.Fatalf("get synced chunks: %v", err)
1078:		t.Fatalf("expected chunk-1 to be marked as synced")
1090:	if err := s.CreateSession("sync-session", "engram", "/tmp/engram"); err != nil {
1095:		SessionID: "sync-session",
1120:		SessionID: "sync-session",
1128:	if err := s.EndSession("sync-session", "done"); err != nil {
1134:		t.Fatalf("get sync state: %v", err)
1148:		t.Fatalf("list pending sync mutations: %v", err)
1155:	if err := s.db.QueryRow("SELECT sync_id FROM observations WHERE id = ?", obsID).Scan(&observationSyncID); err != nil {
1156:		t.Fatalf("lookup observation sync id: %v", err)
1159:		t.Fatalf("expected observation sync id to be persisted")
1163:	if err := s.db.QueryRow("SELECT sync_id FROM user_prompts WHERE id = ?", promptID).Scan(&promptSyncID); err != nil {
1164:		t.Fatalf("lookup prompt sync id: %v", err)
1167:		t.Fatalf("expected prompt sync id to be persisted")
1170:	if mutations[0].Entity != SyncEntitySession || mutations[0].EntityKey != "sync-session" || mutations[0].Op != SyncOpUpsert {
1185:	if mutations[5].Entity != SyncEntitySession || mutations[5].EntityKey != "sync-session" || mutations[5].Op != SyncOpUpsert {
1193:	if deletedPayload["sync_id"] != observationSyncID {
1194:		t.Fatalf("expected delete payload sync id %q, got %#v", observationSyncID, deletedPayload["sync_id"])
1201:		t.Fatalf("ack sync mutations: %v", err)
1205:		t.Fatalf("list remaining sync mutations: %v", err)
1217:		t.Fatalf("get initial sync state: %v", err)
1252:		t.Fatalf("mark sync failure: %v", err)
1257:		t.Fatalf("get degraded sync state: %v", err)
1273:		t.Fatalf("mark sync healthy: %v", err)
1278:		t.Fatalf("get healthy sync state: %v", err)
1312:		Payload:   `{"sync_id":"obs-remote-1","session_id":"remote-session","type":"decision","title":"Remote","content":"Pulled from cloud","project":"engram","scope":"project"}`,
1322:	if err := s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE sync_id = ?", "obs-remote-1").Scan(&rowCount); err != nil {
1335:		Payload:   `{"sync_id":"obs-remote-1","deleted":true}`,
1358:		t.Fatalf("get sync state after pulled apply: %v", err)
1427:func TestEndSessionAndTimelineDefaults(t *testing.T) {
1430:	if err := s.CreateSession("s-end", "engram", "/tmp/engram"); err != nil {
1455:	if err := s.EndSession("s-end", "finished session"); err != nil {
1522:	if err := s.CreateSession("s-q", "engram", "/tmp/engram"); err != nil {
1577:	searchPrompts, err := s.SearchPrompts("prompt", "alpha", 0)
1593:	ctx, err := s.FormatContext("", "project")
1618:	if _, err := s.SearchPrompts("x", "", 1); err == nil {
1619:		t.Fatalf("expected SearchPrompts error when db is closed")
1624:	if _, err := s.Export(); err == nil {
1632:func TestEndSessionEdgeCases(t *testing.T) {
1635:	if err := s.CreateSession("s-edge", "engram", "/tmp/engram"); err != nil {
1639:	if err := s.EndSession("missing", "ignored"); err != nil {
1643:	if err := s.EndSession("s-edge", ""); err != nil {
1670:		`INSERT INTO observations (session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
1703:	t.Run("migrate is idempotent with existing triggers", func(t *testing.T) {
1705:		if err := s.migrate(); err != nil {
1706:			t.Fatalf("second migrate should succeed: %v", err)
1710:	t.Run("legacy migrate skips table without id column", func(t *testing.T) {
1729:		if err := s.migrateLegacyObservationsTable(); err != nil {
1730:			t.Fatalf("legacy migrate should skip tables without id: %v", err)
1758:		ctx, err := s.FormatContext("", "")
1782:		_, err := s.Export()
1801:		_, err := s.Export()
1813:		_, err := s.Import(&ExportData{})
1821:		_, err := s.Import(&ExportData{
1840:		_, err := s.Import(&ExportData{
1949:	t.Run("legacy migrate noops when id is primary key", func(t *testing.T) {
1951:		if err := s.migrateLegacyObservationsTable(); err != nil {
1956:	t.Run("legacy migrate fails if temp table already exists", func(t *testing.T) {
1972:			CREATE TABLE observations_migrated (id INTEGER PRIMARY KEY);
1974:			t.Fatalf("prepare legacy schema: %v", err)
1977:		err := s.migrateLegacyObservationsTable()
1983:	t.Run("migrate returns deterministic exec hook errors", func(t *testing.T) {
1989:				return nil, errors.New("forced migrate update failure")
1994:		err := s.migrate()
1995:		if err == nil || !strings.Contains(err.Error(), "forced migrate update failure") {
1996:			t.Fatalf("expected forced migrate failure, got %v", err)
2000:	t.Run("migrate fails when creating missing triggers", func(t *testing.T) {
2019:		err := s.migrate()
2025:	t.Run("legacy migrate surfaces begin and commit hook failures", func(t *testing.T) {
2045:					topic_key TEXT,
2047:					revision_count INTEGER,
2048:					duplicate_count INTEGER,
2055:				VALUES (1, 's1', 'bugfix', 'legacy', 'legacy row', 'engram', datetime('now'), datetime('now'));
2057:				t.Fatalf("prepare legacy table: %v", err)
2068:			err := s.migrateLegacyObservationsTable()
2077:				return errors.New("forced legacy commit failure")
2080:			err := s.migrateLegacyObservationsTable()
2081:			if err == nil || !strings.Contains(err.Error(), "forced legacy commit failure") {
2099:		if _, err := s.Export(); err == nil || !strings.Contains(err.Error(), "export sessions") {
2109:		if _, err := s.Export(); err == nil || !strings.Contains(err.Error(), "export observations") {
2119:		if _, err := s.Export(); err == nil || !strings.Contains(err.Error(), "export prompts") {
2130:		if _, err := s.Import(&ExportData{}); err == nil || !strings.Contains(err.Error(), "begin tx") {
2142:		if _, err := s.Import(&ExportData{Sessions: []Session{{ID: "s-x", Project: "p", Directory: "/tmp", StartedAt: Now()}}}); err == nil || !strings.Contains(err.Error(), "import session") {
2150:		if _, err := s.Import(&ExportData{}); err == nil || !strings.Contains(err.Error(), "import: commit") {
2202:		if err := s.CreateSession("s-p", "proj-a", "/tmp/proj-a"); err != nil {
2205:		if err := s.CreateSession("s-q", "proj-b", "/tmp/proj-b"); err != nil {
2266:		if err := s.CreateSession("s-tl", "engram", "/tmp/engram"); err != nil {
2299:			if _, err := s.FormatContext("", ""); err == nil {
2306:			if err := s.CreateSession("s-ctx", "engram", "/tmp/engram"); err != nil {
2312:			if _, err := s.FormatContext("", ""); err == nil {
2319:			if err := s.CreateSession("s-ctx2", "engram", "/tmp/engram"); err != nil {
2325:			if _, err := s.FormatContext("", ""); err == nil {
2347:	t.Run("migrate forced failures for remaining exec branches", func(t *testing.T) {
2350:			"UPDATE observations SET topic_key = NULL",
2351:			"UPDATE observations SET revision_count = 1",
2352:			"UPDATE observations SET duplicate_count = 1",
2372:						return nil, errors.New("forced migrate failure")
2376:				if err := s.migrate(); err == nil {
2377:					t.Fatalf("expected migrate error for %q", needle)
2383:	t.Run("migrate addColumn and legacy-call propagation", func(t *testing.T) {
2397:			if err := s.migrate(); err == nil {
2398:				t.Fatalf("expected migrate to propagate addColumn failure")
2402:		t.Run("propagates legacy migrate error", func(t *testing.T) {
2410:						return nil, errors.New("forced legacy call failure")
2415:			if err := s.migrate(); err == nil {
2416:				t.Fatalf("expected migrate to propagate legacy migrate failure")
2423:		if err := s.CreateSession("s-e", "engram", "/tmp/engram"); err != nil {
2447:			if strings.Contains(query, "SET duplicate_count = duplicate_count + 1") {
2472:		if err := s.CreateSession("s-u", "engram", "/tmp/engram"); err != nil {
2524:		if err := s.CreateSession("s-iter", "engram", "/tmp/engram"); err != nil {
2550:		if _, err := s.SearchPrompts("prompt", "", 10); err == nil {
2565:		if _, err := s.Export(); err == nil {
2570:		if _, err := s.Export(); err == nil {
2575:		if _, err := s.Export(); err == nil {
2580:		if _, err := s.Export(); err == nil {
2585:		if _, err := s.Export(); err == nil {
2590:		if _, err := s.Export(); err == nil {
2594:		setScanErr("FROM sync_chunks")
2596:			t.Fatalf("expected synced chunks scan error")
2613:		if err := s.migrateLegacyObservationsTable(); err == nil {
2614:			t.Fatalf("expected legacy migrate pragma rows err")
2618:		if err := s.migrateLegacyObservationsTable(); err == nil {
2619:			t.Fatalf("expected legacy migrate pragma scan error")
2627:		if err := s.CreateSession("s-t2", "engram", "/tmp/engram"); err != nil {
2712:		if err := s.CreateSession("s-c", "engram", "/tmp/engram"); err != nil {
2726:		if _, err := s.FormatContext("engram", "project"); err == nil {
2740:		if err := s.EndSession("s-c", "has summary"); err != nil {
2744:		ctx, err := s.FormatContext("engram", "project")
2753:	t.Run("helper query errors and legacy migration late-stage failures", func(t *testing.T) {
2759:			t.Fatalf("expected synced chunks query error")
2767:		if err := s.migrateLegacyObservationsTable(); err == nil {
2768:			t.Fatalf("expected legacy migrate query error")
2788:				topic_key TEXT,
2790:				revision_count INTEGER,
2791:				duplicate_count INTEGER,
2798:			VALUES (1, 's1', 'bugfix', 'legacy', 'legacy row', 'engram', datetime('now'), datetime('now'));
2800:			t.Fatalf("prepare legacy table: %v", err)
2803:		lateFail := []string{"INSERT INTO observations_migrated", "DROP TABLE observations", "RENAME TO observations", "CREATE VIRTUAL TABLE observations_fts"}
2823:						topic_key TEXT,
2825:						revision_count INTEGER,
2826:						duplicate_count INTEGER,
2833:					VALUES (1, 's1', 'bugfix', 'legacy', 'legacy row', 'engram', datetime('now'), datetime('now'));
2835:					t.Fatalf("prepare legacy schema: %v", err)
2841:						return nil, errors.New("forced legacy late failure")
2845:				if err := s3.migrateLegacyObservationsTable(); err == nil {
2846:					t.Fatalf("expected legacy migrate error for %q", needle)
2855:func TestCreateSessionUpsertsEmptyProjectAndDirectory(t *testing.T) {
2859:	if err := s.CreateSession("sess-upsert", "", ""); err != nil {
2865:	if err := s.CreateSession("sess-upsert", "projectA", "/tmp/a"); err != nil {
2881:func TestCreateSessionDoesNotOverwriteExistingProject(t *testing.T) {
2885:	if err := s.CreateSession("sess-preserve", "projectA", "/tmp/a"); err != nil {
2890:	if err := s.CreateSession("sess-preserve", "projectB", "/tmp/b"); err != nil {
2907:func TestCreateSessionPartialUpsert(t *testing.T) {
2911:		if err := s.CreateSession("sess-partial-1", "myproject", ""); err != nil {
2915:		if err := s.CreateSession("sess-partial-1", "other", "/new/dir"); err != nil {
2931:		if err := s.CreateSession("sess-partial-2", "", "/existing/dir"); err != nil {
2934:		if err := s.CreateSession("sess-partial-2", "newproject", ""); err != nil {
2950:		if err := s.CreateSession("sess-partial-3", "", ""); err != nil {
2953:		if err := s.CreateSession("sess-partial-3", "", ""); err != nil {
3055:		"legacy-session", "legacy-proj", "/tmp/legacy", "done",
3061:		`INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
3063:		"obs-legacy", "legacy-session", "decision", "Legacy obs", "Historical content", "legacy-proj", "project", hashNormalized("Historical content"),
3069:		`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
3070:		"prompt-legacy", "legacy-session", "What happened before enterprise?", "legacy-proj",
3076:	if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&before); err != nil {
3080:		t.Fatalf("expected 0 sync mutations before enroll, got %d", before)
3083:	if err := s.EnrollProject("legacy-proj"); err != nil {
3096:		SyncEntitySession:     "legacy-session",
3097:		SyncEntityObservation: "obs-legacy",
3098:		SyncEntityPrompt:      "prompt-legacy",
3108:		if mutation.Project != "legacy-proj" {
3109:			t.Fatalf("expected project legacy-proj, got %q", mutation.Project)
3114:		t.Fatalf("get sync state: %v", err)
3126:		"legacy-session", "legacy-proj", "/tmp/legacy",
3132:		`INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
3134:		"obs-legacy", "legacy-session", "decision", "Legacy obs", "Historical content", "legacy-proj", "project", hashNormalized("Historical content"),
3140:		`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
3141:		"prompt-legacy", "legacy-session", "Historical prompt", "legacy-proj",
3147:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
3149:		DefaultSyncTargetKey, SyncEntityObservation, "obs-legacy", SyncOpUpsert, `{"sync_id":"obs-legacy","session_id":"legacy-session","project":"legacy-proj"}`, SyncSourceLocal, "legacy-proj",
3154:	if err := s.EnrollProject("legacy-proj"); err != nil {
3159:	if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&afterFirst); err != nil {
3167:	if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE entity = ? AND entity_key = ?`, SyncEntityObservation, "obs-legacy").Scan(&observationMutations); err != nil {
3174:	if err := s.EnrollProject("legacy-proj"); err != nil {
3179:	if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&afterSecond); err != nil {
3193:		t.Fatalf("open legacy db: %v", err)
3208:			sync_id TEXT,
3216:			topic_key TEXT,
3218:			revision_count INTEGER NOT NULL DEFAULT 1,
3219:			duplicate_count INTEGER NOT NULL DEFAULT 1,
3228:			sync_id TEXT,
3235:		CREATE TABLE sync_state (
3248:		CREATE TABLE sync_mutations (
3259:			FOREIGN KEY (target_key) REFERENCES sync_state(target_key)
3261:		CREATE TABLE sync_enrolled_projects (
3265:		INSERT INTO sessions (id, project, directory, summary) VALUES ('legacy-session', 'legacy-proj', '/tmp/legacy', 'done');
3266:		INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
3267:		VALUES ('obs-legacy', 'legacy-session', 'decision', 'Legacy obs', 'Historical content', 'legacy-proj', 'project', ?, 1, 1, datetime('now'), datetime('now'));
3268:		INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES ('prompt-legacy', 'legacy-session', 'Historical prompt', 'legacy-proj');
3269:		INSERT INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, 'idle', datetime('now'));
3270:		INSERT INTO sync_enrolled_projects (project) VALUES ('legacy-proj');
3274:		t.Fatalf("seed legacy db: %v", err)
3277:		t.Fatalf("close legacy db: %v", err)
3285:		t.Fatalf("new store after enrolled legacy state: %v", err)
3301:		t.Fatalf("get sync state after repair: %v", err)
3319:	if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&count); err != nil {
3323:		t.Fatalf("expected repair to stay idempotent across reopen, got %d sync mutations", count)
3434:	// Verify the project column exists on sync_mutations by inserting a row.
3436:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
3441:		t.Fatalf("insert sync_mutation with project: %v", err)
3446:	if err := s.db.QueryRow(`SELECT project FROM sync_mutations WHERE entity_key = ?`, "test-key").Scan(&project); err != nil {
3462:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
3472:		UPDATE sync_mutations
3481:	if err := s.db.QueryRow(`SELECT project FROM sync_mutations WHERE entity_key = ?`, "backfill-key").Scan(&project); err != nil {
3497:	if err := s.CreateSession("proj-session", "my-project", "/tmp"); err != nil {
3539:	p := syncSessionPayload{ID: "s1", Project: "acme"}
3548:	p := syncObservationPayload{SyncID: "obs-1", Project: &proj}
3556:	p := syncObservationPayload{SyncID: "obs-1", Project: nil}
3565:	p := syncPromptPayload{SyncID: "p1", Project: &proj}
3573:	p := syncPromptPayload{SyncID: "p1", Project: nil}
3607:	if err := s.CreateSession("enq-session", "enqueued-project", "/tmp"); err != nil {
3611:	// CreateSession enqueues a sync mutation internally. Check the project column.
3614:		`SELECT project FROM sync_mutations WHERE entity = ? AND entity_key = ?`,
3627:	if err := s.CreateSession("obs-enq", "obs-proj", "/tmp"); err != nil {
3645:		`SELECT project FROM sync_mutations WHERE entity = ? ORDER BY seq DESC LIMIT 1`,
3658:	if err := s.CreateSession("prompt-enq", "prompt-proj", "/tmp"); err != nil {
3673:		`SELECT project FROM sync_mutations WHERE entity = ? ORDER BY seq DESC LIMIT 1`,
3689:	if err := s.CreateSession("s-enrolled", "enrolled-proj", "/tmp"); err != nil {
3692:	if err := s.CreateSession("s-not-enrolled", "other-proj", "/tmp"); err != nil {
3728:	if err := s.CreateSession("s-no-enroll", "some-proj", "/tmp"); err != nil {
3748:	if err := s.CreateSession("skip-session", "skip-proj", "/tmp"); err != nil {
3778:	if err := s.CreateSession("s-enrolled", "enrolled", "/tmp"); err != nil {
3781:	if err := s.CreateSession("s-not-enrolled", "not-enrolled", "/tmp"); err != nil {
3787:	s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE acked_at IS NULL`).Scan(&totalBefore)
3812:// ─── Phase 5: Empty/global project always syncs ──────────────────────────────
3818:	if err := s.CreateSession("global-session", "", "/tmp"); err != nil {
3829:		t.Fatal("expected empty-project mutations to always sync regardless of enrollment")
3844:	if err := s.CreateSession("global-session-2", "", "/tmp"); err != nil {
3882:	if err := s.CreateSession("mix-enrolled", "enrolled-mix", "/tmp"); err != nil {
3885:	if err := s.CreateSession("mix-global", "", "/tmp"); err != nil {
3888:	if err := s.CreateSession("mix-unenrolled", "unenrolled-mix", "/tmp"); err != nil {
3925:	s.CreateSession("s1", old, "/tmp/old")
3941:		t.Fatalf("expected 1 observation migrated, got %d", result.ObservationsUpdated)
3944:		t.Fatalf("expected 1 session migrated, got %d", result.SessionsUpdated)
3947:		t.Fatalf("expected 1 prompt migrated, got %d", result.PromptsUpdated)
3986:	s.CreateSession("s1", old, "/tmp")
3998:		t.Fatal("first migration should migrate")
4012://              ListProjectsWithStats, MergeProjects tests ─────────────────────
4050:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
4085:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
4119:	if err := s.CreateSession("s1", "engram", "/tmp"); err != nil {
4145:func TestCreateSessionNormalizesProject(t *testing.T) {
4148:	if err := s.CreateSession("s-norm", "MyProject", "/tmp"); err != nil {
4149:		t.Fatalf("CreateSession: %v", err)
4164:	if err := s.CreateSession("s1", "alpha", "/tmp"); err != nil {
4167:	if err := s.CreateSession("s2", "beta", "/tmp"); err != nil {
4206:	if err := s.CreateSession("s1", "proj-a", "/work/a"); err != nil {
4209:	if err := s.CreateSession("s2", "proj-b", "/work/b"); err != nil {
4281:func TestMergeProjects(t *testing.T) {
4288:	if err := s.CreateSession("s1", "engram", "/work"); err != nil {
4309:	result, err := s.MergeProjects(sources, canonical)
4311:		t.Fatalf("MergeProjects: %v", err)
4347:func TestMergeProjectsIdempotent(t *testing.T) {
4351:	result, err := s.MergeProjects([]string{"ghost-project"}, "engram")
4353:		t.Fatalf("MergeProjects with nonexistent source: %v", err)
4360:func TestMergeProjectsCanonicalInSources(t *testing.T) {
4363:	if err := s.CreateSession("s1", "engram", "/work"); err != nil {
4381:	result, err := s.MergeProjects([]string{"engram", "Engram"}, "engram")
4383:		t.Fatalf("MergeProjects: %v", err)
4398:	if err := s.CreateSession("s1", "alpha", "/work/alpha"); err != nil {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '1520,1665p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1520		s := newTestStore(t)
  1521	
  1522		if err := s.CreateSession("s-q", "engram", "/tmp/engram"); err != nil {
  1523			t.Fatalf("create session: %v", err)
  1524		}
  1525	
  1526		longContent := strings.Repeat("x", s.cfg.MaxObservationLength+100)
  1527		obsID, err := s.AddObservation(AddObservationParams{
  1528			SessionID: "s-q",
  1529			Type:      "note",
  1530			Title:     "Private <private>secret</private> title",
  1531			Content:   longContent + " <private>token</private>",
  1532			Project:   "engram",
  1533			Scope:     "project",
  1534		})
  1535		if err != nil {
  1536			t.Fatalf("add observation: %v", err)
  1537		}
  1538		obs, err := s.GetObservation(obsID)
  1539		if err != nil {
  1540			t.Fatalf("get observation: %v", err)
  1541		}
  1542		if !strings.Contains(obs.Title, "[REDACTED]") {
  1543			t.Fatalf("expected private tags redacted in title, got %q", obs.Title)
  1544		}
  1545		if !strings.Contains(obs.Content, "... [truncated]") {
  1546			t.Fatalf("expected truncated content marker, got %q", obs.Content)
  1547		}
  1548	
  1549		newProject := ""
  1550		newTopic := ""
  1551		updated, err := s.UpdateObservation(obsID, UpdateObservationParams{Project: &newProject, TopicKey: &newTopic})
  1552		if err != nil {
  1553			t.Fatalf("update observation: %v", err)
  1554		}
  1555		if updated.Project != nil {
  1556			t.Fatalf("expected nil project after empty update")
  1557		}
  1558		if updated.TopicKey != nil {
  1559			t.Fatalf("expected nil topic key after empty update")
  1560		}
  1561	
  1562		if _, err := s.AddPrompt(AddPromptParams{SessionID: "s-q", Content: "alpha prompt", Project: "alpha"}); err != nil {
  1563			t.Fatalf("add alpha prompt: %v", err)
  1564		}
  1565		if _, err := s.AddPrompt(AddPromptParams{SessionID: "s-q", Content: "beta prompt", Project: "beta"}); err != nil {
  1566			t.Fatalf("add beta prompt: %v", err)
  1567		}
  1568	
  1569		recentPrompts, err := s.RecentPrompts("beta", 1)
  1570		if err != nil {
  1571			t.Fatalf("recent prompts with project filter: %v", err)
  1572		}
  1573		if len(recentPrompts) != 1 || recentPrompts[0].Project != "beta" {
  1574			t.Fatalf("expected one beta prompt, got %+v", recentPrompts)
  1575		}
  1576	
  1577		searchPrompts, err := s.SearchPrompts("prompt", "alpha", 0)
  1578		if err != nil {
  1579			t.Fatalf("search prompts with project filter/default limit: %v", err)
  1580		}
  1581		if len(searchPrompts) != 1 || searchPrompts[0].Project != "alpha" {
  1582			t.Fatalf("expected one alpha prompt search result, got %+v", searchPrompts)
  1583		}
  1584	
  1585		searchResults, err := s.Search("title", SearchOptions{Scope: "project", Limit: 9999})
  1586		if err != nil {
  1587			t.Fatalf("search with clamped limit: %v", err)
  1588		}
  1589		if len(searchResults) == 0 {
  1590			t.Fatalf("expected search results")
  1591		}
  1592	
  1593		ctx, err := s.FormatContext("", "project")
  1594		if err != nil {
  1595			t.Fatalf("format context: %v", err)
  1596		}
  1597		if !strings.Contains(ctx, "Recent User Prompts") {
  1598			t.Fatalf("expected prompts section in context output")
  1599		}
  1600	}
  1601	
  1602	func TestStoreErrorBranchesWithClosedDatabase(t *testing.T) {
  1603		s := newTestStore(t)
  1604	
  1605		if err := s.Close(); err != nil {
  1606			t.Fatalf("close store: %v", err)
  1607		}
  1608	
  1609		if _, err := s.GetSession("missing"); err == nil {
  1610			t.Fatalf("expected GetSession error when db is closed")
  1611		}
  1612		if _, err := s.AllSessions("", 1); err == nil {
  1613			t.Fatalf("expected AllSessions error when db is closed")
  1614		}
  1615		if _, err := s.RecentSessions("", 1); err == nil {
  1616			t.Fatalf("expected RecentSessions error when db is closed")
  1617		}
  1618		if _, err := s.SearchPrompts("x", "", 1); err == nil {
  1619			t.Fatalf("expected SearchPrompts error when db is closed")
  1620		}
  1621		if _, err := s.Search("x", SearchOptions{}); err == nil {
  1622			t.Fatalf("expected Search error when db is closed")
  1623		}
  1624		if _, err := s.Export(); err == nil {
  1625			t.Fatalf("expected Export error when db is closed")
  1626		}
  1627		if _, err := s.Timeline(1, 1, 1); err == nil {
  1628			t.Fatalf("expected Timeline error when db is closed")
  1629		}
  1630	}
  1631	
  1632	func TestEndSessionEdgeCases(t *testing.T) {
  1633		s := newTestStore(t)
  1634	
  1635		if err := s.CreateSession("s-edge", "engram", "/tmp/engram"); err != nil {
  1636			t.Fatalf("create session: %v", err)
  1637		}
  1638	
  1639		if err := s.EndSession("missing", "ignored"); err != nil {
  1640			t.Fatalf("end missing session should be no-op: %v", err)
  1641		}
  1642	
  1643		if err := s.EndSession("s-edge", ""); err != nil {
  1644			t.Fatalf("end session with empty summary: %v", err)
  1645		}
  1646	
  1647		sess, err := s.GetSession("s-edge")
  1648		if err != nil {
  1649			t.Fatalf("get session: %v", err)
  1650		}
  1651		if sess.EndedAt == nil {
  1652			t.Fatalf("expected ended_at to be set")
  1653		}
  1654		if sess.Summary != nil {
  1655			t.Fatalf("expected empty summary to persist as NULL, got %q", *sess.Summary)
  1656		}
  1657	}
  1658	
  1659	func TestTimelineHandlesMissingSessionRecord(t *testing.T) {
  1660		s := newTestStore(t)
  1661	
  1662		if _, err := s.db.Exec("PRAGMA foreign_keys = OFF"); err != nil {
  1663			t.Fatalf("disable fk: %v", err)
  1664		}
  1665		defer func() {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '2290,2335p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2290			if len(tl.After) != 1 || tl.After[0].ID != lastID {
  2291				t.Fatalf("expected last in after list, got %+v", tl.After)
  2292			}
  2293		})
  2294	
  2295		t.Run("format context returns specific query stage errors", func(t *testing.T) {
  2296			t.Run("recent sessions error", func(t *testing.T) {
  2297				s := newTestStore(t)
  2298				_ = s.Close()
  2299				if _, err := s.FormatContext("", ""); err == nil {
  2300					t.Fatalf("expected format context to fail from recent sessions")
  2301				}
  2302			})
  2303	
  2304			t.Run("recent observations error", func(t *testing.T) {
  2305				s := newTestStore(t)
  2306				if err := s.CreateSession("s-ctx", "engram", "/tmp/engram"); err != nil {
  2307					t.Fatalf("create session: %v", err)
  2308				}
  2309				if _, err := s.db.Exec("DROP TABLE observations"); err != nil {
  2310					t.Fatalf("drop observations: %v", err)
  2311				}
  2312				if _, err := s.FormatContext("", ""); err == nil {
  2313					t.Fatalf("expected format context to fail from recent observations")
  2314				}
  2315			})
  2316	
  2317			t.Run("recent prompts error", func(t *testing.T) {
  2318				s := newTestStore(t)
  2319				if err := s.CreateSession("s-ctx2", "engram", "/tmp/engram"); err != nil {
  2320					t.Fatalf("create session: %v", err)
  2321				}
  2322				if _, err := s.db.Exec("DROP TABLE user_prompts"); err != nil {
  2323					t.Fatalf("drop prompts: %v", err)
  2324				}
  2325				if _, err := s.FormatContext("", ""); err == nil {
  2326					t.Fatalf("expected format context to fail from recent prompts")
  2327				}
  2328			})
  2329		})
  2330	}
  2331	
  2332	func TestStoreUncoveredBranchesPushToHundred(t *testing.T) {
  2333		t.Run("new open database hook error", func(t *testing.T) {
  2334			orig := openDB
  2335			t.Cleanup(func() { openDB = orig })

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '1632,1665p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1632	func TestEndSessionEdgeCases(t *testing.T) {
  1633		s := newTestStore(t)
  1634	
  1635		if err := s.CreateSession("s-edge", "engram", "/tmp/engram"); err != nil {
  1636			t.Fatalf("create session: %v", err)
  1637		}
  1638	
  1639		if err := s.EndSession("missing", "ignored"); err != nil {
  1640			t.Fatalf("end missing session should be no-op: %v", err)
  1641		}
  1642	
  1643		if err := s.EndSession("s-edge", ""); err != nil {
  1644			t.Fatalf("end session with empty summary: %v", err)
  1645		}
  1646	
  1647		sess, err := s.GetSession("s-edge")
  1648		if err != nil {
  1649			t.Fatalf("get session: %v", err)
  1650		}
  1651		if sess.EndedAt == nil {
  1652			t.Fatalf("expected ended_at to be set")
  1653		}
  1654		if sess.Summary != nil {
  1655			t.Fatalf("expected empty summary to persist as NULL, got %q", *sess.Summary)
  1656		}
  1657	}
  1658	
  1659	func TestTimelineHandlesMissingSessionRecord(t *testing.T) {
  1660		s := newTestStore(t)
  1661	
  1662		if _, err := s.db.Exec("PRAGMA foreign_keys = OFF"); err != nil {
  1663			t.Fatalf("disable fk: %v", err)
  1664		}
  1665		defer func() {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '803,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   803	func TestPassiveCaptureStoresLearnings(t *testing.T) {
   804		s := newTestStore(t)
   805	
   806		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   807			t.Fatalf("create session: %v", err)
   808		}
   809	
   810		text := `## Key Learnings:
   811	
   812	1. bcrypt cost=12 is the right balance for our server performance
   813	2. JWT refresh tokens need atomic rotation to prevent race conditions
   814	`
   815		result, err := s.PassiveCapture(PassiveCaptureParams{
   816			SessionID: "s1",
   817			Content:   text,
   818			Project:   "engram",
   819			Source:    "test",
   820		})
   821		if err != nil {
   822			t.Fatalf("passive capture: %v", err)
   823		}
   824		if result.Extracted != 2 {
   825			t.Fatalf("expected 2 extracted, got %d", result.Extracted)
   826		}
   827		if result.Saved != 2 {
   828			t.Fatalf("expected 2 saved, got %d", result.Saved)
   829		}
   830	
   831		obs, err := s.AllObservations("engram", "", 10)
   832		if err != nil {
   833			t.Fatalf("all observations: %v", err)
   834		}
   835		if len(obs) != 2 {
   836			t.Fatalf("expected 2 observations, got %d", len(obs))
   837		}
   838		for _, o := range obs {
   839			if o.Type != "passive" {
   840				t.Fatalf("expected type=passive, got %q", o.Type)
   841			}
   842		}
   843		if obs[0].ToolName == nil || *obs[0].ToolName != "test" {
   844			t.Fatalf("expected tool_name source to be stored as 'test', got %+v", obs[0].ToolName)
   845		}
   846	}
   847	
   848	func TestPassiveCaptureEmptyContent(t *testing.T) {
   849		s := newTestStore(t)
   850	
   851		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   852			t.Fatalf("create session: %v", err)
   853		}
   854	
   855		result, err := s.PassiveCapture(PassiveCaptureParams{
   856			SessionID: "s1",
   857			Content:   "",
   858			Project:   "engram",
   859			Source:    "test",
   860		})
   861		if err != nil {
   862			t.Fatalf("passive capture: %v", err)
   863		}
   864		if result.Extracted != 0 || result.Saved != 0 {
   865			t.Fatalf("expected 0 extracted and 0 saved, got %d/%d", result.Extracted, result.Saved)
   866		}
   867	}
   868	
   869	func TestPassiveCaptureDedupesAgainstExistingObservations(t *testing.T) {
   870		s := newTestStore(t)
   871	
   872		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   873			t.Fatalf("create session: %v", err)
   874		}
   875	
   876		// First: agent saves actively via mem_save
   877		_, err := s.AddObservation(AddObservationParams{
   878			SessionID: "s1",
   879			Type:      "decision",
   880			Title:     "bcrypt cost",
   881			Content:   "bcrypt cost=12 is the right balance for our server performance",
   882			Project:   "engram",
   883			Scope:     "project",
   884		})
   885		if err != nil {
   886			t.Fatalf("add active observation: %v", err)
   887		}
   888	
   889		// Then: passive capture fires with overlapping content
   890		text := `## Key Learnings:
   891	
   892	1. bcrypt cost=12 is the right balance for our server performance
   893	2. JWT refresh tokens need atomic rotation to prevent race conditions
   894	`
   895		result, err := s.PassiveCapture(PassiveCaptureParams{
   896			SessionID: "s1",
   897			Content:   text,
   898			Project:   "engram",
   899			Source:    "test",
   900		})
   901		if err != nil {
   902			t.Fatalf("passive capture: %v", err)
   903		}
   904		if result.Extracted != 2 {
   905			t.Fatalf("expected 2 extracted, got %d", result.Extracted)
   906		}
   907		if result.Saved != 1 {
   908			t.Fatalf("expected 1 saved (1 deduped), got %d", result.Saved)
   909		}
   910		if result.Duplicates != 1 {
   911			t.Fatalf("expected 1 duplicate, got %d", result.Duplicates)
   912		}
   913	}
   914	
   915	func TestPassiveCaptureReturnsErrorWhenSessionDoesNotExist(t *testing.T) {
   916		s := newTestStore(t)
   917	
   918		text := `## Key Learnings:
   919	
   920	1. This learning is long enough to attempt insert and fail without session
   921	`
   922		_, err := s.PassiveCapture(PassiveCaptureParams{
   923			SessionID: "missing-session",
   924			Content:   text,
   925			Project:   "engram",
   926			Source:    "test",
   927		})
   928		if err == nil {
   929			t.Fatalf("expected error when session does not exist")
   930		}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '570,720p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   570		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   571			t.Fatalf("create session: %v", err)
   572		}
   573	
   574		baseID, err := s.AddObservation(AddObservationParams{
   575			SessionID: "s1",
   576			Type:      "architecture",
   577			Title:     "Auth model",
   578			Content:   "Initial architecture",
   579			Project:   "engram",
   580			Scope:     "project",
   581			TopicKey:  "architecture/auth-model",
   582		})
   583		if err != nil {
   584			t.Fatalf("add base observation: %v", err)
   585		}
   586	
   587		personalID, err := s.AddObservation(AddObservationParams{
   588			SessionID: "s1",
   589			Type:      "architecture",
   590			Title:     "Auth model",
   591			Content:   "Personal take",
   592			Project:   "engram",
   593			Scope:     "personal",
   594			TopicKey:  "architecture/auth-model",
   595		})
   596		if err != nil {
   597			t.Fatalf("add personal scoped observation: %v", err)
   598		}
   599	
   600		otherProjectID, err := s.AddObservation(AddObservationParams{
   601			SessionID: "s1",
   602			Type:      "architecture",
   603			Title:     "Auth model",
   604			Content:   "Other project",
   605			Project:   "another-project",
   606			Scope:     "project",
   607			TopicKey:  "architecture/auth-model",
   608		})
   609		if err != nil {
   610			t.Fatalf("add other project observation: %v", err)
   611		}
   612	
   613		if baseID == personalID || baseID == otherProjectID || personalID == otherProjectID {
   614			t.Fatalf("expected topic upsert boundaries by project+scope, got ids base=%d personal=%d other=%d", baseID, personalID, otherProjectID)
   615		}
   616	}
   617	
   618	func TestPromptProjectNullScan(t *testing.T) {
   619		s := newTestStore(t)
   620	
   621		if err := s.CreateSession("s1", "engram", "/tmp/engram"); err != nil {
   622			t.Fatalf("create session: %v", err)
   623		}
   624	
   625		// Manually insert a prompt with NULL project to simulate legacy data or external changes
   626		_, err := s.db.Exec(
   627			"INSERT INTO user_prompts (session_id, content, project) VALUES (?, ?, NULL)",
   628			"s1", "prompt with null project",
   629		)
   630		if err != nil {
   631			t.Fatalf("manual insert: %v", err)
   632		}
   633	
   634		// 1. Test RecentPrompts
   635		prompts, err := s.RecentPrompts("", 10)
   636		if err != nil {
   637			t.Fatalf("RecentPrompts failed with null project: %v", err)
   638		}
   639		if len(prompts) != 1 || prompts[0].Project != "" {
   640			t.Errorf("expected empty string for null project, got %q", prompts[0].Project)
   641		}
   642	
   643		// 2. Test SearchPrompts
   644		searchResult, err := s.SearchPrompts("null", "", 10)
   645		if err != nil {
   646			t.Fatalf("SearchPrompts failed with null project: %v", err)
   647		}
   648		if len(searchResult) != 1 || searchResult[0].Project != "" {
   649			t.Errorf("expected empty string for null project in search, got %q", searchResult[0].Project)
   650		}
   651	
   652		// 3. Test Export
   653		data, err := s.Export()
   654		if err != nil {
   655			t.Fatalf("Export failed with null project: %v", err)
   656		}
   657		found := false
   658		for _, p := range data.Prompts {
   659			if p.Content == "prompt with null project" {
   660				found = true
   661				if p.Project != "" {
   662					t.Errorf("expected empty string for null project in export, got %q", p.Project)
   663				}
   664			}
   665		}
   666		if !found {
   667			t.Error("exported prompts missing the test prompt")
   668		}
   669	}
   670	
   671	// ─── Passive Capture Tests ───────────────────────────────────────────────────
   672	
   673	func TestExtractLearningsNumberedList(t *testing.T) {
   674		text := `Some preamble text here.
   675	
   676	## Key Learnings:
   677	
   678	1. bcrypt cost=12 is the right balance for our server performance
   679	2. JWT refresh tokens need atomic rotation to prevent race conditions
   680	3. Always validate the audience claim in JWT tokens before trusting them
   681	
   682	## Next Steps
   683	- something else
   684	`
   685		learnings := ExtractLearnings(text)
   686		if len(learnings) != 3 {
   687			t.Fatalf("expected 3 learnings, got %d: %v", len(learnings), learnings)
   688		}
   689		if !strings.Contains(learnings[0], "bcrypt") {
   690			t.Fatalf("expected first learning about bcrypt, got %q", learnings[0])
   691		}
   692	}
   693	
   694	func TestExtractLearningsSpanishHeader(t *testing.T) {
   695		text := `## Aprendizajes Clave:
   696	
   697	1. El costo de bcrypt=12 es el balance correcto para nuestro servidor
   698	2. Los refresh tokens de JWT necesitan rotacion atomica
   699	`
   700		learnings := ExtractLearnings(text)
   701		if len(learnings) != 2 {
   702			t.Fatalf("expected 2 learnings, got %d: %v", len(learnings), learnings)
   703		}
   704	}
   705	
   706	func TestExtractLearningsBulletList(t *testing.T) {
   707		text := `### Learnings:
   708	
   709	- bcrypt cost=12 is the right balance for our server performance
   710	- JWT refresh tokens need atomic rotation to prevent race conditions
   711	`
   712		learnings := ExtractLearnings(text)
   713		if len(learnings) != 2 {
   714			t.Fatalf("expected 2 learnings, got %d: %v", len(learnings), learnings)
   715		}
   716	}
   717	
   718	func TestExtractLearningsIgnoresShortItems(t *testing.T) {
   719		text := `## Key Learnings:
   720	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '1949,2085p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '3055,3325p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1949		t.Run("legacy migrate noops when id is primary key", func(t *testing.T) {
  1950			s := newTestStore(t)
  1951			if err := s.migrateLegacyObservationsTable(); err != nil {
  1952				t.Fatalf("expected noop for modern schema: %v", err)
  1953			}
  1954		})
  1955	
  1956		t.Run("legacy migrate fails if temp table already exists", func(t *testing.T) {
  1957			s := newTestStore(t)
  1958			if _, err := s.db.Exec(`
  1959				DROP TRIGGER IF EXISTS obs_fts_insert;
  1960				DROP TRIGGER IF EXISTS obs_fts_update;
  1961				DROP TRIGGER IF EXISTS obs_fts_delete;
  1962				DROP TABLE IF EXISTS observations_fts;
  1963				DROP TABLE observations;
  1964				CREATE TABLE observations (
  1965					id INT,
  1966					session_id TEXT,
  1967					type TEXT,
  1968					title TEXT,
  1969					content TEXT,
  1970					created_at TEXT
  1971				);
  1972				CREATE TABLE observations_migrated (id INTEGER PRIMARY KEY);
  1973			`); err != nil {
  1974				t.Fatalf("prepare legacy schema: %v", err)
  1975			}
  1976	
  1977			err := s.migrateLegacyObservationsTable()
  1978			if err == nil || !strings.Contains(err.Error(), "create table") {
  1979				t.Fatalf("expected create table error, got %v", err)
  1980			}
  1981		})
  1982	
  1983		t.Run("migrate returns deterministic exec hook errors", func(t *testing.T) {
  1984			s := newTestStore(t)
  1985	
  1986			origExec := s.hooks.exec
  1987			s.hooks.exec = func(db execer, query string, args ...any) (sql.Result, error) {
  1988				if strings.Contains(query, "UPDATE observations SET scope = 'project'") {
  1989					return nil, errors.New("forced migrate update failure")
  1990				}
  1991				return origExec(db, query, args...)
  1992			}
  1993	
  1994			err := s.migrate()
  1995			if err == nil || !strings.Contains(err.Error(), "forced migrate update failure") {
  1996				t.Fatalf("expected forced migrate failure, got %v", err)
  1997			}
  1998		})
  1999	
  2000		t.Run("migrate fails when creating missing triggers", func(t *testing.T) {
  2001			s := newTestStore(t)
  2002	
  2003			if _, err := s.db.Exec(`
  2004				DROP TRIGGER IF EXISTS obs_fts_insert;
  2005				DROP TRIGGER IF EXISTS obs_fts_update;
  2006				DROP TRIGGER IF EXISTS obs_fts_delete;
  2007			`); err != nil {
  2008				t.Fatalf("drop obs triggers: %v", err)
  2009			}
  2010	
  2011			origExec := s.hooks.exec
  2012			s.hooks.exec = func(db execer, query string, args ...any) (sql.Result, error) {
  2013				if strings.Contains(query, "CREATE TRIGGER obs_fts_insert") {
  2014					return nil, errors.New("forced obs trigger failure")
  2015				}
  2016				return origExec(db, query, args...)
  2017			}
  2018	
  2019			err := s.migrate()
  2020			if err == nil || !strings.Contains(err.Error(), "forced obs trigger failure") {
  2021				t.Fatalf("expected forced trigger failure, got %v", err)
  2022			}
  2023		})
  2024	
  2025		t.Run("legacy migrate surfaces begin and commit hook failures", func(t *testing.T) {
  2026			prepareLegacyStore := func(t *testing.T) *Store {
  2027				t.Helper()
  2028				s := newTestStore(t)
  2029				if _, err := s.db.Exec(`
  2030					DROP TRIGGER IF EXISTS obs_fts_insert;
  2031					DROP TRIGGER IF EXISTS obs_fts_update;
  2032					DROP TRIGGER IF EXISTS obs_fts_delete;
  2033					DROP TABLE IF EXISTS observations_fts;
  2034					DROP TABLE observations;
  2035					INSERT OR IGNORE INTO sessions (id, project, directory) VALUES ('s1', 'engram', '/tmp/engram');
  2036					CREATE TABLE observations (
  2037						id INT,
  2038						session_id TEXT,
  2039						type TEXT,
  2040						title TEXT,
  2041						content TEXT,
  2042						tool_name TEXT,
  2043						project TEXT,
  2044						scope TEXT,
  2045						topic_key TEXT,
  2046						normalized_hash TEXT,
  2047						revision_count INTEGER,
  2048						duplicate_count INTEGER,
  2049						last_seen_at TEXT,
  2050						created_at TEXT,
  2051						updated_at TEXT,
  2052						deleted_at TEXT
  2053					);
  2054					INSERT INTO observations (id, session_id, type, title, content, project, created_at, updated_at)
  2055					VALUES (1, 's1', 'bugfix', 'legacy', 'legacy row', 'engram', datetime('now'), datetime('now'));
  2056				`); err != nil {
  2057					t.Fatalf("prepare legacy table: %v", err)
  2058				}
  2059				return s
  2060			}
  2061	
  2062			t.Run("begin tx", func(t *testing.T) {
  2063				s := prepareLegacyStore(t)
  2064				s.hooks.beginTx = func(_ *sql.DB) (*sql.Tx, error) {
  2065					return nil, errors.New("forced begin failure")
  2066				}
  2067	
  2068				err := s.migrateLegacyObservationsTable()
  2069				if err == nil || !strings.Contains(err.Error(), "forced begin failure") {
  2070					t.Fatalf("expected begin failure, got %v", err)
  2071				}
  2072			})
  2073	
  2074			t.Run("commit", func(t *testing.T) {
  2075				s := prepareLegacyStore(t)
  2076				s.hooks.commit = func(_ *sql.Tx) error {
  2077					return errors.New("forced legacy commit failure")
  2078				}
  2079	
  2080				err := s.migrateLegacyObservationsTable()
  2081				if err == nil || !strings.Contains(err.Error(), "forced legacy commit failure") {
  2082					t.Fatalf("expected commit failure, got %v", err)
  2083				}
  2084			})
  2085		})

 succeeded in 0ms:
  3055			"legacy-session", "legacy-proj", "/tmp/legacy", "done",
  3056		); err != nil {
  3057			t.Fatalf("insert session: %v", err)
  3058		}
  3059	
  3060		if _, err := s.db.Exec(
  3061			`INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
  3062			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))`,
  3063			"obs-legacy", "legacy-session", "decision", "Legacy obs", "Historical content", "legacy-proj", "project", hashNormalized("Historical content"),
  3064		); err != nil {
  3065			t.Fatalf("insert observation: %v", err)
  3066		}
  3067	
  3068		if _, err := s.db.Exec(
  3069			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
  3070			"prompt-legacy", "legacy-session", "What happened before enterprise?", "legacy-proj",
  3071		); err != nil {
  3072			t.Fatalf("insert prompt: %v", err)
  3073		}
  3074	
  3075		var before int
  3076		if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&before); err != nil {
  3077			t.Fatalf("count mutations before enroll: %v", err)
  3078		}
  3079		if before != 0 {
  3080			t.Fatalf("expected 0 sync mutations before enroll, got %d", before)
  3081		}
  3082	
  3083		if err := s.EnrollProject("legacy-proj"); err != nil {
  3084			t.Fatalf("enroll project: %v", err)
  3085		}
  3086	
  3087		mutations, err := s.ListPendingSyncMutations(DefaultSyncTargetKey, 10)
  3088		if err != nil {
  3089			t.Fatalf("list pending: %v", err)
  3090		}
  3091		if len(mutations) != 3 {
  3092			t.Fatalf("expected 3 backfilled mutations, got %d", len(mutations))
  3093		}
  3094	
  3095		expected := map[string]string{
  3096			SyncEntitySession:     "legacy-session",
  3097			SyncEntityObservation: "obs-legacy",
  3098			SyncEntityPrompt:      "prompt-legacy",
  3099		}
  3100		for _, mutation := range mutations {
  3101			entityKey, ok := expected[mutation.Entity]
  3102			if !ok {
  3103				t.Fatalf("unexpected mutation entity %q", mutation.Entity)
  3104			}
  3105			if mutation.EntityKey != entityKey {
  3106				t.Fatalf("expected entity_key %q for %s, got %q", entityKey, mutation.Entity, mutation.EntityKey)
  3107			}
  3108			if mutation.Project != "legacy-proj" {
  3109				t.Fatalf("expected project legacy-proj, got %q", mutation.Project)
  3110			}
  3111		}
  3112		state, err := s.GetSyncState(DefaultSyncTargetKey)
  3113		if err != nil {
  3114			t.Fatalf("get sync state: %v", err)
  3115		}
  3116		if state.LastEnqueuedSeq != 3 {
  3117			t.Fatalf("expected last_enqueued_seq 3 after backfill, got %d", state.LastEnqueuedSeq)
  3118		}
  3119	}
  3120	
  3121	func TestEnrollProjectBackfillIsIdempotentAndSkipsExistingMutations(t *testing.T) {
  3122		s := newTestStore(t)
  3123	
  3124		if _, err := s.db.Exec(
  3125			`INSERT INTO sessions (id, project, directory) VALUES (?, ?, ?)`,
  3126			"legacy-session", "legacy-proj", "/tmp/legacy",
  3127		); err != nil {
  3128			t.Fatalf("insert session: %v", err)
  3129		}
  3130	
  3131		if _, err := s.db.Exec(
  3132			`INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
  3133			 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))`,
  3134			"obs-legacy", "legacy-session", "decision", "Legacy obs", "Historical content", "legacy-proj", "project", hashNormalized("Historical content"),
  3135		); err != nil {
  3136			t.Fatalf("insert observation: %v", err)
  3137		}
  3138	
  3139		if _, err := s.db.Exec(
  3140			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
  3141			"prompt-legacy", "legacy-session", "Historical prompt", "legacy-proj",
  3142		); err != nil {
  3143			t.Fatalf("insert prompt: %v", err)
  3144		}
  3145	
  3146		if _, err := s.db.Exec(
  3147			`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
  3148			 VALUES (?, ?, ?, ?, ?, ?, ?)`,
  3149			DefaultSyncTargetKey, SyncEntityObservation, "obs-legacy", SyncOpUpsert, `{"sync_id":"obs-legacy","session_id":"legacy-session","project":"legacy-proj"}`, SyncSourceLocal, "legacy-proj",
  3150		); err != nil {
  3151			t.Fatalf("insert existing mutation: %v", err)
  3152		}
  3153	
  3154		if err := s.EnrollProject("legacy-proj"); err != nil {
  3155			t.Fatalf("first enroll: %v", err)
  3156		}
  3157	
  3158		var afterFirst int
  3159		if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&afterFirst); err != nil {
  3160			t.Fatalf("count after first enroll: %v", err)
  3161		}
  3162		if afterFirst != 3 {
  3163			t.Fatalf("expected 3 total mutations after first enroll, got %d", afterFirst)
  3164		}
  3165	
  3166		var observationMutations int
  3167		if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE entity = ? AND entity_key = ?`, SyncEntityObservation, "obs-legacy").Scan(&observationMutations); err != nil {
  3168			t.Fatalf("count observation mutations: %v", err)
  3169		}
  3170		if observationMutations != 1 {
  3171			t.Fatalf("expected existing observation mutation to remain single, got %d rows", observationMutations)
  3172		}
  3173	
  3174		if err := s.EnrollProject("legacy-proj"); err != nil {
  3175			t.Fatalf("second enroll: %v", err)
  3176		}
  3177	
  3178		var afterSecond int
  3179		if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&afterSecond); err != nil {
  3180			t.Fatalf("count after second enroll: %v", err)
  3181		}
  3182		if afterSecond != afterFirst {
  3183			t.Fatalf("expected no duplicate backfill on re-enroll, got %d mutations after second enroll vs %d after first", afterSecond, afterFirst)
  3184		}
  3185	}
  3186	
  3187	func TestNewRepairsAlreadyEnrolledProjectsMissingHistoricalSyncMutations(t *testing.T) {
  3188		dataDir := t.TempDir()
  3189		dbPath := filepath.Join(dataDir, "engram.db")
  3190	
  3191		db, err := sql.Open("sqlite", dbPath)
  3192		if err != nil {
  3193			t.Fatalf("open legacy db: %v", err)
  3194		}
  3195	
  3196		obsHash := hashNormalized("Historical content")
  3197		_, err = db.Exec(`
  3198			CREATE TABLE sessions (
  3199				id TEXT PRIMARY KEY,
  3200				project TEXT NOT NULL,
  3201				directory TEXT NOT NULL,
  3202				started_at TEXT NOT NULL DEFAULT (datetime('now')),
  3203				ended_at TEXT,
  3204				summary TEXT
  3205			);
  3206			CREATE TABLE observations (
  3207				id INTEGER PRIMARY KEY AUTOINCREMENT,
  3208				sync_id TEXT,
  3209				session_id TEXT NOT NULL,
  3210				type TEXT NOT NULL,
  3211				title TEXT NOT NULL,
  3212				content TEXT NOT NULL,
  3213				tool_name TEXT,
  3214				project TEXT,
  3215				scope TEXT NOT NULL DEFAULT 'project',
  3216				topic_key TEXT,
  3217				normalized_hash TEXT,
  3218				revision_count INTEGER NOT NULL DEFAULT 1,
  3219				duplicate_count INTEGER NOT NULL DEFAULT 1,
  3220				last_seen_at TEXT,
  3221				created_at TEXT NOT NULL DEFAULT (datetime('now')),
  3222				updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  3223				deleted_at TEXT,
  3224				FOREIGN KEY (session_id) REFERENCES sessions(id)
  3225			);
  3226			CREATE TABLE user_prompts (
  3227				id INTEGER PRIMARY KEY AUTOINCREMENT,
  3228				sync_id TEXT,
  3229				session_id TEXT NOT NULL,
  3230				content TEXT NOT NULL,
  3231				project TEXT,
  3232				created_at TEXT NOT NULL DEFAULT (datetime('now')),
  3233				FOREIGN KEY (session_id) REFERENCES sessions(id)
  3234			);
  3235			CREATE TABLE sync_state (
  3236				target_key TEXT PRIMARY KEY,
  3237				lifecycle TEXT NOT NULL DEFAULT 'idle',
  3238				last_enqueued_seq INTEGER NOT NULL DEFAULT 0,
  3239				last_acked_seq INTEGER NOT NULL DEFAULT 0,
  3240				last_pulled_seq INTEGER NOT NULL DEFAULT 0,
  3241				consecutive_failures INTEGER NOT NULL DEFAULT 0,
  3242				backoff_until TEXT,
  3243				lease_owner TEXT,
  3244				lease_until TEXT,
  3245				last_error TEXT,
  3246				updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  3247			);
  3248			CREATE TABLE sync_mutations (
  3249				seq INTEGER PRIMARY KEY AUTOINCREMENT,
  3250				target_key TEXT NOT NULL,
  3251				entity TEXT NOT NULL,
  3252				entity_key TEXT NOT NULL,
  3253				op TEXT NOT NULL,
  3254				payload TEXT NOT NULL,
  3255				source TEXT NOT NULL DEFAULT 'local',
  3256				occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
  3257				acked_at TEXT,
  3258				project TEXT NOT NULL DEFAULT '',
  3259				FOREIGN KEY (target_key) REFERENCES sync_state(target_key)
  3260			);
  3261			CREATE TABLE sync_enrolled_projects (
  3262				project TEXT PRIMARY KEY,
  3263				enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
  3264			);
  3265			INSERT INTO sessions (id, project, directory, summary) VALUES ('legacy-session', 'legacy-proj', '/tmp/legacy', 'done');
  3266			INSERT INTO observations (sync_id, session_id, type, title, content, project, scope, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
  3267			VALUES ('obs-legacy', 'legacy-session', 'decision', 'Legacy obs', 'Historical content', 'legacy-proj', 'project', ?, 1, 1, datetime('now'), datetime('now'));
  3268			INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES ('prompt-legacy', 'legacy-session', 'Historical prompt', 'legacy-proj');
  3269			INSERT INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, 'idle', datetime('now'));
  3270			INSERT INTO sync_enrolled_projects (project) VALUES ('legacy-proj');
  3271		`, obsHash, DefaultSyncTargetKey)
  3272		if err != nil {
  3273			_ = db.Close()
  3274			t.Fatalf("seed legacy db: %v", err)
  3275		}
  3276		if err := db.Close(); err != nil {
  3277			t.Fatalf("close legacy db: %v", err)
  3278		}
  3279	
  3280		cfg := mustDefaultConfig(t)
  3281		cfg.DataDir = dataDir
  3282	
  3283		s, err := New(cfg)
  3284		if err != nil {
  3285			t.Fatalf("new store after enrolled legacy state: %v", err)
  3286		}
  3287	
  3288		mutations, err := s.ListPendingSyncMutations(DefaultSyncTargetKey, 10)
  3289		if err != nil {
  3290			_ = s.Close()
  3291			t.Fatalf("list pending after repair: %v", err)
  3292		}
  3293		if len(mutations) != 3 {
  3294			_ = s.Close()
  3295			t.Fatalf("expected 3 repaired mutations, got %d", len(mutations))
  3296		}
  3297	
  3298		state, err := s.GetSyncState(DefaultSyncTargetKey)
  3299		if err != nil {
  3300			_ = s.Close()
  3301			t.Fatalf("get sync state after repair: %v", err)
  3302		}
  3303		if state.LastEnqueuedSeq != 3 {
  3304			_ = s.Close()
  3305			t.Fatalf("expected last_enqueued_seq 3 after automatic repair, got %d", state.LastEnqueuedSeq)
  3306		}
  3307	
  3308		if err := s.Close(); err != nil {
  3309			t.Fatalf("close repaired store: %v", err)
  3310		}
  3311	
  3312		s, err = New(cfg)
  3313		if err != nil {
  3314			t.Fatalf("reopen repaired store: %v", err)
  3315		}
  3316		t.Cleanup(func() { _ = s.Close() })
  3317	
  3318		var count int
  3319		if err := s.db.QueryRow(`SELECT COUNT(*) FROM sync_mutations`).Scan(&count); err != nil {
  3320			t.Fatalf("count repaired mutations after reopen: %v", err)
  3321		}
  3322		if count != 3 {
  3323			t.Fatalf("expected repair to stay idempotent across reopen, got %d sync mutations", count)
  3324		}
  3325	}

codex
I’ve moved from architecture into behavior contracts. The high-signal edge cases are now: boot-time migration/repair, sync-journal self-healing, partial-write risks in passive capture, and a couple of “silent bootstrap” spots where Engram’s MCP handlers discard setup errors instead of surfacing them.
exec
/bin/zsh -lc 'rg -n "type Config|DefaultConfig|MaxObservationLength|MaxContextResults|MaxSearchResults|DedupeWindow" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
241:type Config struct {
243:	MaxObservationLength int
244:	MaxContextResults    int
245:	MaxSearchResults     int
246:	DedupeWindow         time.Duration
249:func DefaultConfig() (Config, error) {
256:		MaxObservationLength: 50000,
257:		MaxContextResults:    20,
258:		MaxSearchResults:     20,
259:		DedupeWindow:         15 * time.Minute,
264:// Use this when DefaultConfig fails and you have resolved the home directory
269:		MaxObservationLength: 50000,
270:		MaxContextResults:    20,
271:		MaxSearchResults:     20,
272:		DedupeWindow:         15 * time.Minute,
276:// MaxObservationLength returns the configured maximum content length for observations.
277:func (s *Store) MaxObservationLength() int {
278:	return s.cfg.MaxObservationLength
903:		limit = s.cfg.MaxContextResults
956:	if len(content) > s.cfg.MaxObservationLength {
957:		content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
1013:		window := dedupeWindowExpression(s.cfg.DedupeWindow)
1081:		limit = s.cfg.MaxContextResults
1114:	if len(content) > s.cfg.MaxObservationLength {
1115:		content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
1263:			if len(content) > s.cfg.MaxObservationLength {
1264:				content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
1470:	if limit > s.cfg.MaxSearchResults {
1471:		limit = s.cfg.MaxSearchResults
1619:	observations, err := s.RecentObservations(project, scope, s.cfg.MaxContextResults)

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package store implements the persistent memory engine for Engram.
     2	//
     3	// It uses SQLite with FTS5 full-text search to store and retrieve
     4	// observations from AI coding sessions. This is the core of Engram —
     5	// everything else (HTTP server, MCP server, CLI, plugins) talks to this.
     6	package store
     7	
     8	import (
     9		"crypto/rand"
    10		"crypto/sha256"
    11		"database/sql"
    12		"encoding/hex"
    13		"encoding/json"
    14		"fmt"
    15		"os"
    16		"path/filepath"
    17		"regexp"
    18		"strconv"
    19		"strings"
    20		"time"
    21	
    22		_ "modernc.org/sqlite"
    23	)
    24	
    25	var openDB = sql.Open
    26	
    27	// ─── Types ───────────────────────────────────────────────────────────────────
    28	
    29	type Session struct {
    30		ID        string  `json:"id"`
    31		Project   string  `json:"project"`
    32		Directory string  `json:"directory"`
    33		StartedAt string  `json:"started_at"`
    34		EndedAt   *string `json:"ended_at,omitempty"`
    35		Summary   *string `json:"summary,omitempty"`
    36	}
    37	
    38	type Observation struct {
    39		ID             int64   `json:"id"`
    40		SyncID         string  `json:"sync_id"`
    41		SessionID      string  `json:"session_id"`
    42		Type           string  `json:"type"`
    43		Title          string  `json:"title"`
    44		Content        string  `json:"content"`
    45		ToolName       *string `json:"tool_name,omitempty"`
    46		Project        *string `json:"project,omitempty"`
    47		Scope          string  `json:"scope"`
    48		TopicKey       *string `json:"topic_key,omitempty"`
    49		RevisionCount  int     `json:"revision_count"`
    50		DuplicateCount int     `json:"duplicate_count"`
    51		LastSeenAt     *string `json:"last_seen_at,omitempty"`
    52		CreatedAt      string  `json:"created_at"`
    53		UpdatedAt      string  `json:"updated_at"`
    54		DeletedAt      *string `json:"deleted_at,omitempty"`
    55	}
    56	
    57	type SearchResult struct {
    58		Observation
    59		Rank float64 `json:"rank"`
    60	}
    61	
    62	type SessionSummary struct {
    63		ID               string  `json:"id"`
    64		Project          string  `json:"project"`
    65		StartedAt        string  `json:"started_at"`
    66		EndedAt          *string `json:"ended_at,omitempty"`
    67		Summary          *string `json:"summary,omitempty"`
    68		ObservationCount int     `json:"observation_count"`
    69	}
    70	
    71	type Stats struct {
    72		TotalSessions     int      `json:"total_sessions"`
    73		TotalObservations int      `json:"total_observations"`
    74		TotalPrompts      int      `json:"total_prompts"`
    75		Projects          []string `json:"projects"`
    76	}
    77	
    78	type TimelineEntry struct {
    79		ID             int64   `json:"id"`
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

exec
/bin/zsh -lc 'rg -n "integrity_check|quick_check|VACUUM|optimize|wal_checkpoint|backup|recover|repair" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:426:	if err := s.repairEnrolledProjectSyncMutations(); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:427:		return nil, fmt.Errorf("engram: repair enrolled sync journal: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2631:func (s *Store) repairEnrolledProjectSyncMutations() error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:46:- **AFTER COMPACTION**: Immediately call `mem_context` to recover state
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:83:| Compaction recovery | ✗ | ✓ |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:96:│   ├── post-compaction.sh         # Injects previous context + recovery instructions
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:99:└── skills/memory/SKILL.md         # Memory Protocol (when to save, search, close, recover)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/PLUGINS.md:119:- **After compaction** — 3-step recovery: persist summary → load context → continue
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3291:		t.Fatalf("list pending after repair: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3295:		t.Fatalf("expected 3 repaired mutations, got %d", len(mutations))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3301:		t.Fatalf("get sync state after repair: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3305:		t.Fatalf("expected last_enqueued_seq 3 after automatic repair, got %d", state.LastEnqueuedSeq)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3309:		t.Fatalf("close repaired store: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3314:		t.Fatalf("reopen repaired store: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3320:		t.Fatalf("count repaired mutations after reopen: %v", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3323:		t.Fatalf("expected repair to stay idempotent across reopen, got %d sync mutations", count)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:34:1. Copies the plugin to `~/.config/opencode/plugins/engram.ts` (session tracking, Memory Protocol, compaction recovery)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:69:**Option A: Plugin via marketplace (recommended)** — full session management, auto-import, compaction recovery, and Memory Protocol skill:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:111:Recommended: one command to set up MCP + compaction recovery instructions:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:119:- Writes `~/.gemini/system.md` with the Engram Memory Protocol (includes post-compaction recovery)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:147:Recommended: one command to set up MCP + compaction recovery instructions:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:158:> `engram setup codex` automatically writes the full Memory Protocol to `~/.codex/engram-instructions.md` and a compaction recovery prompt to `~/.codex/engram-compact-prompt.md`. No additional configuration needed.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:228:- **After compaction** — recover state with `mem_context`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:320:- After any compaction or context reset, call `mem_context` to recover session state before continuing.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:325:After any compaction or context reset, call mem_context to recover session state before continuing.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:334:- After any compaction or context reset, call `mem_context` to recover session state before continuing.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:342:- After any compaction or context reset, call `mem_context` to recover session state before continuing.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:350:- After any compaction or context reset, call `mem_context` to recover session state before continuing.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:363:Save proactively after significant work. After context resets, call mem_context to recover state.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/AGENT-SETUP.md:369:Save proactively after significant work. After context resets, call mem_context to recover state.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '236,274p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   261	}
   262	
   263	// FallbackConfig returns a Config with the given DataDir and default values.
   264	// Use this when DefaultConfig fails and you have resolved the home directory
   265	// through alternative means.
   266	func FallbackConfig(dataDir string) Config {
   267		return Config{
   268			DataDir:              dataDir,
   269			MaxObservationLength: 50000,
   270			MaxContextResults:    20,
   271			MaxSearchResults:     20,
   272			DedupeWindow:         15 * time.Minute,
   273		}
   274	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go | sed -n '151,245p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’ve got the final synthesis points now. I’m doing one last evidence pass on the exact memory note I used and on the specific Engram lines behind the partial-write and startup-repair claims so the writeup stays sharply sourced.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '446,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   446	## Task 1: Rename packet `041-sk-auto-agent-improvement` to `041-sk-recursive-agent-loop`, outcome success
   447	
   448	### rollout_summary_files
   449	
   450	- rollout_summaries/2026-04-03T11-59-45-KehP-041_recursive_agent_loop_rename.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-59-45-019d5336-ad92-7812-9658-b4a1b290dbb9.jsonl, updated_at=2026-04-04T07:00:23+00:00, thread_id=019d5336-ad92-7812-9658-b4a1b290dbb9)
   451	
   452	### keywords
   453	
   454	- 041-sk-recursive-agent-loop, packet-rename, descriptions.json, validate.sh --strict, historical research memory rewrite, skip spec folder
   455	
   456	## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
   457	
   458	### rollout_summary_files
   459	
   460	- rollout_summaries/2026-04-03T10-18-09-ppdB-rename_023_hybrid_rag_fusion_refinement.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-18-09-019d52d9-a8b9-71c3-949c-f6870aee05a7.jsonl, updated_at=2026-04-03T10:43:47+00:00, thread_id=019d52d9-a8b9-71c3-949c-f6870aee05a7)
   461	
   462	### keywords
   463	
   464	- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
   465	
   466	## Task 3: Refresh references for renamed packet `040-sk-auto-deep-research-review-improvement`, outcome success
   467	
   468	### rollout_summary_files
   469	
   470	- rollout_summaries/2026-04-03T10-45-55-qAti-rename_040_spec_references.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T12-45-55-019d52f3-14c7-7010-9b34-a491a18d8448.jsonl, updated_at=2026-04-03T11:27:03+00:00, thread_id=019d52f3-14c7-7010-9b34-a491a18d8448)

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '2000,2026p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '3481,3536p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  3536		return result, nil

 succeeded in 0ms:
  2000	
  2001	- symptom: CLI audit flow stalls or fails fast; cause: unsupported `codex exec --ask-for-approval`; fix: use supported codex flags only and keep single-hop depth constraints in prompt text [Task 2]
  2002	- symptom: context retrieval path blocks audit setup; cause: `spec_kit_memory` handshake failure (`connection closed: initialize response`); fix: switch immediately to direct `rg`/`sed` context gathering instead of retry loops [Task 2]
  2003	- symptom: verification commands fail with filesystem permission errors under `/var/folders`; cause: default temp dir restrictions; fix: set `TMPDIR` to repo-owned `.tmp` before Vitest runs [Task 4]
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
  2025	## Reusable knowledge
  2026	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go | sed -n '915,930p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   915	func TestPassiveCaptureReturnsErrorWhenSessionDoesNotExist(t *testing.T) {
   916		s := newTestStore(t)
   917	
   918		text := `## Key Learnings:
   919	
   920	1. This learning is long enough to attempt insert and fail without session
   921	`
   922		_, err := s.PassiveCapture(PassiveCaptureParams{
   923			SessionID: "missing-session",
   924			Content:   text,
   925			Project:   "engram",
   926			Source:    "test",
   927		})
   928		if err == nil {
   929			t.Fatalf("expected error when session does not exist")
   930		}

codex
# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

## Findings
### Finding 1: Startup recovery is transactional and self-healing, but it is also fail-stop
- **Source**: [external/internal/store/store.go:395](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:395), [external/internal/store/store.go:423](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:423), [external/internal/store/store.go:2631](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2631), [external/internal/store/store_test.go:3187](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3187)
- **What it does**: `New()` enables WAL and `busy_timeout`, then runs `migrate()` and `repairEnrolledProjectSyncMutations()` before the store is usable. The repair pass backfills missing sync journal rows for enrolled projects, and tests verify it stays idempotent across reopen.
- **Why it matters for us**: This is a strong pattern for repairing derived state at boot, especially if Public adds more sidecar tables or journals. The downside is availability: any migration or repair failure aborts startup entirely.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram handles schema drift, not database corruption
- **Source**: [external/internal/store/store.go:410](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:410), [external/internal/store/store.go:439](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:439), [external/internal/server/server.go:433](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:433), [external/internal/server/server.go:446](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:446)
- **What it does**: Boot logic covers pragmas, schema creation, and repair of missing sync metadata. Manual export/import exists for operator recovery. I found no integrity-check, backup-before-migrate, or read-only recovery path in the inspected store/server surfaces.
- **Why it matters for us**: Public already has stronger health tooling and checkpoints. We should not regress to a model that can detect migration problems but has no first-class corruption workflow.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: MCP save handlers can hide the real failure by ignoring session bootstrap errors
- **Source**: [external/internal/mcp/mcp.go:728](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:728), [external/internal/mcp/mcp.go:867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:867), [external/internal/mcp/mcp.go:1046](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1046), [external/internal/mcp/mcp.go:1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1114), [external/internal/server/server.go:166](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:166)
- **What it does**: `mem_save`, `mem_save_prompt`, `mem_session_summary`, and `mem_capture_passive` call `CreateSession(...)` and discard the error. If session creation fails, the agent sees the later write failure instead of the root cause. The HTTP server does propagate session creation errors.
- **Why it matters for us**: Public’s governed/trusted session story is stricter. We should keep surfacing lifecycle/bootstrap failures early instead of letting them degrade into confusing downstream write errors.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Passive capture is strict on missing sessions, but non-atomic across extracted learnings
- **Source**: [external/internal/store/store.go:3483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3483), [external/internal/store/store.go:3521](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3521), [external/internal/store/store_test.go:915](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:915)
- **What it does**: `PassiveCapture()` extracts learnings, dedupes each one, then calls `AddObservation()` per learning. If an insert fails mid-loop, earlier items stay committed and the function returns partial progress plus an error. Missing-session capture hard-fails.
- **Why it matters for us**: If Public adds passive learning, this is the failure mode to avoid. Batch capture should be one transaction or explicitly resumable with structured per-item status.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Engram’s strongest recovery story is for derived sync state, not core context state
- **Source**: [external/internal/store/store.go:1860](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1860), [external/internal/store/store.go:1894](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1894), [external/internal/store/store.go:1988](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1988), [external/internal/store/store.go:2036](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2036)
- **What it does**: Sync backlog handling has explicit filters for enrolled projects, skip-ack cleanup for non-enrolled projects, lease ownership, and degraded/healthy backoff state. That subsystem anticipates drift and concurrent workers more than the context formatter does.
- **Why it matters for us**: The lesson is architectural: derived tables need their own repair and contention model. Public can reuse this idea for any future prompt sidecar, cache, or journal, without copying Engram’s simpler project-only scoping.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Scaling controls are coarse, static caps rather than adaptive maintenance
- **Source**: [external/internal/store/store.go:241](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:241), [external/internal/store/store.go:1470](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1470), [external/internal/store/store.go:1862](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1862), [external/internal/server/server.go:447](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:447), [external/internal/store/store.go:2459](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459)
- **What it does**: Search/context are capped at small fixed limits, pending-sync listing defaults to 100, import is capped at 50MB, and project consolidation/pruning runs as whole-project transactions.
- **Why it matters for us**: These are good guardrails for a small local system, but they are not a full scaling strategy. Public’s richer retrieval stack should prefer adaptive paging, health reporting, and targeted repair over mostly static caps.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Context reconstruction is brittle compared with Public’s layered resume path
- **Source**: [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [external/internal/store/store_test.go:2295](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2295), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1229), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434), [memory-triggers.ts:212](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212), [memory-triggers.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325)
- **What it does**: `FormatContext()` fails the whole request if recent sessions, observations, or prompts query fails, and tests assert those stage-specific failures. Public instead rejects untrusted sessions explicitly, wraps strategy failures in structured recovery responses, and keeps prompt injection best-effort and resume-only.
- **Why it matters for us**: For startup continuity and compaction survival, Public’s current layered model is stronger. Engram’s monolithic formatter is a useful reference for shape, not for failure semantics.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)

## Assessment
- New information ratio: 0.66
- Questions addressed: Q2, Q4, Q5, Q6, Q8, Q9, Q10
- Questions answered: Q2, Q4, Q6, Q8, Q9, Q10

## Reflection
- What worked: tracing `New()` into migration/repair, then following tests for forced failures, surfaced the real failure contract much faster than docs alone; the best comparison point was Engram’s fail-stop startup versus Public’s fail-closed but layered resume/session handling.
- What did not work: CocoIndex was not usable in this run and returned cancelled calls, so I fell back to `rg` plus direct reads; the exact strict validator command still reports `cannot create temp file for here document: Operation not permitted` even though it ends with `RESULT: PASSED`; the phase folder still lacks the Level 3 spec docs the prompt expects, so this remained read-only.

## Recommended Next Focus
Trace phase 003 and 004 for whether they offer a safer batch-ingestion or corruption-recovery model than Engram, then design a Public-side proposal that combines: startup repair for derived state, explicit bootstrap error surfacing, atomic passive capture, and a real corruption workflow layered onto `memory_health` and checkpoints.


hook: Stop
hook: Stop Completed
tokens used
200,266
# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

## Findings
### Finding 1: Startup recovery is transactional and self-healing, but it is also fail-stop
- **Source**: [external/internal/store/store.go:395](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:395), [external/internal/store/store.go:423](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:423), [external/internal/store/store.go:2631](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2631), [external/internal/store/store_test.go:3187](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:3187)
- **What it does**: `New()` enables WAL and `busy_timeout`, then runs `migrate()` and `repairEnrolledProjectSyncMutations()` before the store is usable. The repair pass backfills missing sync journal rows for enrolled projects, and tests verify it stays idempotent across reopen.
- **Why it matters for us**: This is a strong pattern for repairing derived state at boot, especially if Public adds more sidecar tables or journals. The downside is availability: any migration or repair failure aborts startup entirely.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram handles schema drift, not database corruption
- **Source**: [external/internal/store/store.go:410](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:410), [external/internal/store/store.go:439](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:439), [external/internal/server/server.go:433](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:433), [external/internal/server/server.go:446](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:446)
- **What it does**: Boot logic covers pragmas, schema creation, and repair of missing sync metadata. Manual export/import exists for operator recovery. I found no integrity-check, backup-before-migrate, or read-only recovery path in the inspected store/server surfaces.
- **Why it matters for us**: Public already has stronger health tooling and checkpoints. We should not regress to a model that can detect migration problems but has no first-class corruption workflow.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: MCP save handlers can hide the real failure by ignoring session bootstrap errors
- **Source**: [external/internal/mcp/mcp.go:728](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:728), [external/internal/mcp/mcp.go:867](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:867), [external/internal/mcp/mcp.go:1046](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1046), [external/internal/mcp/mcp.go:1114](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1114), [external/internal/server/server.go:166](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:166)
- **What it does**: `mem_save`, `mem_save_prompt`, `mem_session_summary`, and `mem_capture_passive` call `CreateSession(...)` and discard the error. If session creation fails, the agent sees the later write failure instead of the root cause. The HTTP server does propagate session creation errors.
- **Why it matters for us**: Public’s governed/trusted session story is stricter. We should keep surfacing lifecycle/bootstrap failures early instead of letting them degrade into confusing downstream write errors.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: Passive capture is strict on missing sessions, but non-atomic across extracted learnings
- **Source**: [external/internal/store/store.go:3483](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3483), [external/internal/store/store.go:3521](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3521), [external/internal/store/store_test.go:915](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:915)
- **What it does**: `PassiveCapture()` extracts learnings, dedupes each one, then calls `AddObservation()` per learning. If an insert fails mid-loop, earlier items stay committed and the function returns partial progress plus an error. Missing-session capture hard-fails.
- **Why it matters for us**: If Public adds passive learning, this is the failure mode to avoid. Batch capture should be one transaction or explicitly resumable with structured per-item status.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Engram’s strongest recovery story is for derived sync state, not core context state
- **Source**: [external/internal/store/store.go:1860](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1860), [external/internal/store/store.go:1894](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1894), [external/internal/store/store.go:1988](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1988), [external/internal/store/store.go:2036](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2036)
- **What it does**: Sync backlog handling has explicit filters for enrolled projects, skip-ack cleanup for non-enrolled projects, lease ownership, and degraded/healthy backoff state. That subsystem anticipates drift and concurrent workers more than the context formatter does.
- **Why it matters for us**: The lesson is architectural: derived tables need their own repair and contention model. Public can reuse this idea for any future prompt sidecar, cache, or journal, without copying Engram’s simpler project-only scoping.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 6: Scaling controls are coarse, static caps rather than adaptive maintenance
- **Source**: [external/internal/store/store.go:241](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:241), [external/internal/store/store.go:1470](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1470), [external/internal/store/store.go:1862](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1862), [external/internal/server/server.go:447](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go:447), [external/internal/store/store.go:2459](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459)
- **What it does**: Search/context are capped at small fixed limits, pending-sync listing defaults to 100, import is capped at 50MB, and project consolidation/pruning runs as whole-project transactions.
- **Why it matters for us**: These are good guardrails for a small local system, but they are not a full scaling strategy. Public’s richer retrieval stack should prefer adaptive paging, health reporting, and targeted repair over mostly static caps.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Context reconstruction is brittle compared with Public’s layered resume path
- **Source**: [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [external/internal/store/store_test.go:2295](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go:2295), [memory-context.ts:1229](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1229), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434), [memory-triggers.ts:212](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212), [memory-triggers.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325)
- **What it does**: `FormatContext()` fails the whole request if recent sessions, observations, or prompts query fails, and tests assert those stage-specific failures. Public instead rejects untrusted sessions explicitly, wraps strategy failures in structured recovery responses, and keeps prompt injection best-effort and resume-only.
- **Why it matters for us**: For startup continuity and compaction survival, Public’s current layered model is stronger. Engram’s monolithic formatter is a useful reference for shape, not for failure semantics.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/store/store_test.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store_test.go)
- [external/internal/server/server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/server/server.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)

## Assessment
- New information ratio: 0.66
- Questions addressed: Q2, Q4, Q5, Q6, Q8, Q9, Q10
- Questions answered: Q2, Q4, Q6, Q8, Q9, Q10

## Reflection
- What worked: tracing `New()` into migration/repair, then following tests for forced failures, surfaced the real failure contract much faster than docs alone; the best comparison point was Engram’s fail-stop startup versus Public’s fail-closed but layered resume/session handling.
- What did not work: CocoIndex was not usable in this run and returned cancelled calls, so I fell back to `rg` plus direct reads; the exact strict validator command still reports `cannot create temp file for here document: Operation not permitted` even though it ends with `RESULT: PASSED`; the phase folder still lacks the Level 3 spec docs the prompt expects, so this remained read-only.

## Recommended Next Focus
Trace phase 003 and 004 for whether they offer a safer batch-ingestion or corruption-recovery model than Engram, then design a Public-side proposal that combines: startup repair for derived state, explicit bootstrap error surfacing, atomic passive capture, and a real corruption workflow layered onto `memory_health` and checkpoints.
