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

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our memory_context, generate-context.js, session bootstrap.

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
I’m treating this as a read-only research pass for iteration 009 and focusing specifically on lifecycle/session-state comparisons. First I’m loading the governing repo instructions plus the Engram source paths that matter most for session start/end, context formatting, and our matching `memory_context`/bootstrap surfaces.
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
exec
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|session bootstrap|generate-context|memory_context" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
151:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public; reuse_rule=reuse when patching memory render/reviewer behavior in this checkout and proving fixes through an end-to-end generate-context run
161:- 009-post-save-render-fixes, PSR-2, trigger phrase omission, input-normalizer.ts, collect-session-data.ts, post-save-review.ts extractSection, memory-metadata.ts session_id metadata block, generate-context.js wild save, OVERVIEW 655 chars
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
731:- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
786:- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
1057:- list_mcp_resources, list_mcp_resource_templates, spec_kit_memory, opencode.json, context-server.js, memory_context, memory_search
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1455:- --recovery, RECOVERY_MODE_REQUIRED, allowRecovery, generate-context.ts, loadCollectedData, workflow.ts
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1782:- phase-1 baseline, deferred Phase 2-6 follow-up, check-completion.sh, generate-context.js, /tmp/save-context-data.json, telemetry README schema alignment
1825:- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

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
I’ve confirmed the relevant guardrails and the Engram repo’s local instructions; this pass is staying read-only and source-first. Next I’m tracing the exact lifecycle functions and MCP handlers on both sides so the comparison stays anchored in code paths rather than docs.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "func (CreateSession|EndSession|FormatContext|AddObservation|SuggestTopicKey|Search|sanitizeFTS)|mem_session_start|mem_session_end|mem_session_summary|mem_context|mem_capture_passive|ResolveTools|shouldRegister|ProfileAgent|ProfileAdmin" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/{mcp,store}' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:42://   mem_session_start, mem_session_end, mem_get_observation,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:50:// ProfileAgent contains the tool names that AI agents need.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:53:var ProfileAgent = map[string]bool{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:58:	"mem_session_start":     true, // register session start
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:59:	"mem_session_end":       true, // mark session completed
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:67:// ProfileAdmin contains tools for TUI, dashboards, and manual curation
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:69:var ProfileAdmin = map[string]bool{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:78:	"agent": ProfileAgent,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:79:	"admin": ProfileAdmin,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:82:// ResolveTools takes a comma-separated string of profile names and/or
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:85:func ResolveTools(input string) map[string]bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:129:  mem_context — get recent session history (call at session start or after compaction)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:160:// shouldRegister returns true if the tool should be registered given the
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:162:func shouldRegister(name string, allowlist map[string]bool) bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:171:	if shouldRegister("mem_search", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:202:	if shouldRegister("mem_save", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:265:	if shouldRegister("mem_update", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:328:	if shouldRegister("mem_delete", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:351:	if shouldRegister("mem_save_prompt", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:375:	// ─── mem_context (profile: agent, core — always in context) ────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:376:	if shouldRegister("mem_context", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:378:			mcp.NewTool("mem_context",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:400:	if shouldRegister("mem_stats", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:416:	if shouldRegister("mem_timeline", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:442:	if shouldRegister("mem_get_observation", allowlist) {
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:599:	if shouldRegister("mem_merge_projects", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3201:func SuggestTopicKey(typ, title, content string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3384:func sanitizeFTS(query string) string {
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:970:func TestResolveToolsCombinedProfiles(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:971:	result := ResolveTools("agent,admin")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:978:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:979:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:980:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:990:func TestResolveToolsIndividualNames(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:991:	result := ResolveTools("mem_save,mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1005:func TestResolveToolsMixedProfileAndNames(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1006:	result := ResolveTools("admin,mem_save")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1023:func TestResolveToolsAllInMixed(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1024:	result := ResolveTools("agent,all")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1030:func TestResolveToolsWhitespace(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1031:	result := ResolveTools("  agent  ")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1040:func TestResolveToolsCommaWhitespace(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1041:	result := ResolveTools("mem_save , mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1050:func TestResolveToolsEmptyTokenBetweenCommas(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1051:	result := ResolveTools("mem_save,,mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1060:func TestResolveToolsAllAfterRealTool(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1061:	result := ResolveTools("mem_save,all")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1067:func TestResolveToolsOnlyCommas(t *testing.T) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1068:	result := ResolveTools(",,,")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1075:	if !shouldRegister("anything", nil) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1083:	if !shouldRegister("mem_save", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1086:	if shouldRegister("mem_delete", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1093:	allowlist := ResolveTools("agent")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1104:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1105:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1106:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1126:	allowlist := ResolveTools("admin")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1144:	agentOnlyTools := []string{"mem_save", "mem_search", "mem_context", "mem_update"}
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1163:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1164:		"mem_session_start", "mem_session_end", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1165:		"mem_suggest_topic_key", "mem_capture_passive", "mem_save_prompt",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1182:	allowlist := ResolveTools("mem_save,mem_search")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1214:	for tool := range ProfileAgent {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1217:	for tool := range ProfileAdmin {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1226:	for tool := range ProfileAgent {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1227:		if ProfileAdmin[tool] {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1240:	for _, keyword := range []string{"mem_save", "mem_search", "mem_context", "mem_session_summary"} {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1255:		"mem_save", "mem_search", "mem_context", "mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1277:		"mem_session_start", "mem_session_end",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1279:		"mem_capture_passive", "mem_merge_projects",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1319:		"mem_search", "mem_context", "mem_get_observation",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp_test.go:1771:	allowlist := ResolveTools("admin")

exec
/bin/zsh -lc "rg -n \"session_bootstrap|session_resume|memory_context|generate-context|collect-session-data|resume previous work|validateSessionId|scope key|startup context|Prime Package\" .opencode/skill/system-spec-kit/{mcp_server,scripts}/ -g '*.{ts,js,mjs}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:171:  /** T018: Structured Prime Package for non-hook CLI auto-priming */
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:257:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:323:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:688:  // T018: Include Prime Package hints for non-hook CLIs
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
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:58:  /** T018: Structured Prime Package returned on first tool call */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:86:  'memory_context',
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:419:/** T018: Build structured Prime Package for non-hook CLI auto-priming */
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:460:    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:516:    // T018: Build structured Prime Package
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:50:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:61:      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:77:      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:140:        '- `memory_context({ input, mode })` — unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:185:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:190:      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:202:      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:41:    resolve(HOOK_DIR, '../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:42:    resolve(HOOK_DIR, '../../../../scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:43:    resolve(process.cwd(), '.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:44:    resolve(process.cwd(), 'scripts/dist/memory/generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:71:    hookLog('warn', 'session-stop', 'Auto-save skipped: generate-context.js not found');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:43:  sourceSurface: 'auto-prime' | 'session_bootstrap' | 'session_resume' | 'session_health';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:257:    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:51:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:62:      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:73:      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:106:        '- `memory_context({ input, mode })` - unified context retrieval',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:149:      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:155:    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:163:    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:224:  //   recovery (0.20)      — A memory_context({ mode: "resume" }) call is the most
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:63:    'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42:  name: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:44:  inputSchema: { type: 'object', additionalProperties: false, properties: { input: { type: 'string', minLength: 1, description: 'The query, prompt, or context description (required)' }, mode: { type: 'string', enum: ['auto', 'quick', 'deep', 'focused', 'resume'], default: 'auto', description: 'Context retrieval mode: auto (detect intent), quick (fast triggers), deep (comprehensive search), focused (intent-optimized), resume (session recovery)' }, intent: { type: 'string', enum: ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'], description: 'Explicit task intent. If not provided and mode=auto, intent is auto-detected from input.' }, specFolder: { type: 'string', description: 'Limit context to specific spec folder' }, tenantId: { type: 'string', description: 'Tenant boundary for governed retrieval when memory_context routes to memory_search.' }, userId: { type: 'string', description: 'User boundary for governed retrieval when memory_context routes to memory_search.' }, agentId: { type: 'string', description: 'Agent boundary for governed retrieval when memory_context routes to memory_search.' }, sharedSpaceId: { type: 'string', description: 'Shared-space boundary for governed retrieval when memory_context routes to memory_search.' }, limit: { type: 'number', minimum: 1, maximum: 100, description: 'Maximum results (mode-specific defaults apply)' }, sessionId: { type: 'string', description: 'Optional server-issued session identifier for working-memory continuity. When provided, it must match an existing server-managed session or the call is rejected. Omit it to let the server generate a new session for this request.' }, enableDedup: { type: 'boolean', default: true, description: 'Enable session deduplication' }, includeContent: { type: 'boolean', default: false, description: 'Include full file content in results' }, includeTrace: { type: 'boolean', default: false, description: 'Include provenance-rich trace data (scores, source, trace) in results when underlying memory_search is called' }, tokenUsage: { type: 'number', minimum: 0.0, maximum: 1.0, description: "Optional caller token usage ratio (0.0-1.0)" }, anchors: { type: 'array', items: { type: 'string' }, description: 'Filter content to specific anchors (e.g., ["state", "next-steps"] for resume mode)' }, profile: { type: 'string', enum: ['quick', 'research', 'resume', 'debug'], description: 'Optional response profile formatter. Returns a reduced or mode-aware response shape when profile formatting is enabled.' } }, required: ['input'] },
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:740:  name: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:741:  description: '[L1:Orchestration] Resume session with combined memory, code graph, and CocoIndex status in a single call. Use when you want the detailed merged resume payload directly. For the canonical first-call recovery path on session start or after /clear, prefer session_bootstrap. Use minimal: true to skip the heavy memory context call and return code graph, CocoIndex, structural context, hints, and session-quality metadata without the full memory payload.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:755:  name: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:756:  description: '[L1:Orchestration] Complete session bootstrap in one call. Returns session context, system health, structural readiness, and recommended next actions. This is the canonical first recovery call on session start or after /clear; it wraps the full session_resume payload plus session_health.',
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:768:      resume: { type: 'object', description: 'Merged session_resume payload (spec folder, task status, memory context)' },
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:397:  memory_context: memoryContextSchema as unknown as ToolInputSchema,
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:451:  session_bootstrap: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:455:  session_resume: getSchema({
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:462:  memory_context: ['input', 'mode', 'intent', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'includeContent', 'includeTrace', 'tokenUsage', 'anchors', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:495:  session_bootstrap: ['specFolder'],
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:497:  session_resume: ['specFolder', 'minimal'],
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:42:    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:6:  { tool: 'memory_context', handler: 'handleMemoryContext', layer: 'L1' },
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts:56:  { camel: 'handleMemoryContext', snake: 'handle_memory_context' },
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:55:  memory_context: ERROR_CODES.SEARCH_FAILED,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:748:        'Use generate-context.js script to create memory files'
.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:50:    tools: ['memory_context', 'session_resume', 'session_bootstrap']
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:67:      'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]'
.opencode/skill/system-spec-kit/scripts/extractors/index.ts:34:export * from './collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:2:// - T124 uses collect-session-data extractor
.opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:34:  const collectSessionDataPath = path.join(__dirname, '../../scripts/dist/extractors/collect-session-data.js');
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:48:  liveBaselineResolution: 'code_graph_query' | 'memory_context' | 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:143:    return 'memory_context_then_grep';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:146:  return 'memory_context';
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:162:    if (resolution === 'memory_context_then_grep') {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
.opencode/skill/system-spec-kit/mcp_server/tests/extraction-adapter.vitest.ts:134:    expect(matchRule('memory_context', 'spec.md metadata')).not.toBeNull();
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:27:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:52:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:56:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:65:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:66:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:67:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:68:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:69:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:540:      console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:543:  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8:// Phase 020: Integrated into memory_context handler for query-intent
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:617:        component: 'collect-session-data',
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:75:      ? 'Run code_graph_scan or session_bootstrap before relying on structural context.'
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ops-hardening.ts:76:      : 'Run session_bootstrap first, then code_graph_scan if structural context is required.';
.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:314:    'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts:12:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:223:    followUps.push(`Use memory_context with specFolder "${uniqueFolders[0]}" for full context`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:416:        input: 'resume previous work continue session',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:157:    | 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:159:    | 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:4:// Phase 024 / Item 7: Composite tool that runs session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:55:    preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:102:    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:114:    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:116:    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:118:    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:155:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:163:/** Handle session_bootstrap tool call — one-call session setup */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168:  // Sub-call 1: session_resume with full resume payload
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:179:    allHints.push('session_resume failed. Try calling it manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:198:      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:230:      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:236:    { label: 'session_bootstrap structural context payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:243:      { label: 'session_bootstrap resume payload' },
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:306:      producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:307:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:320:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:52: * Token-pressure policy for memory_context.
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:60: * Automatic session resume context injection for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/scripts/tests/test-bug-fixes.js:82:      path.join(ROOT, 'scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:977:  // Including it here caused all candidates to be filtered out when memory_context
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:10:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:10:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:129:      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/passive-enrichment.ts:132:      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:9:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:20:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:480:                'Tool: read File: scripts/extractors/collect-session-data.ts Result: inspected quick summary derivation',
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts:483:              files: ['scripts/extractors/collect-session-data.ts', 'scripts/tests/memory-render-fixture.vitest.ts'],
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:37:import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:38:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1018:        '  - If using generate-context.js, ensure extractors/collect-session-data.js exports collectSessionData'
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:32:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:238:   T021-T030: handle_memory_context MAIN HANDLER TESTS
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:242:  it('T021: handle_memory_context is a function', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:289:  it('T029: handleMemoryContext is alias for handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:290:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:847:  it('T101: handle_memory_context is exported', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:868:  it('T105: handleMemoryContext is same as handle_memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts:869:    expect(handleMemoryContext).toBe(handle_memory_context);
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:76:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:107:      liveBaselineResolution: 'memory_context',
.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:138:      liveBaselineResolution: 'memory_context_then_grep',
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:83:      validateToolInputSchema('memory_context', {}, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:119:      validateToolInputSchema('memory_context', { input: 'resume', mode: 'invalid-mode' }, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:336:  it('public and runtime schemas accept governed scope fields for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:346:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:348:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:351:  it('public and runtime schemas accept response profiles for memory_context', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:358:      validateToolInputSchema('memory_context', args, TOOL_DEFINITIONS);
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:360:    expect(validateToolArgs('memory_context', args)).toEqual(args);
.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-ops-hardening.vitest.ts:19:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:13:import { collectSessionData, generateResumeContext, type CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-extractors.test.ts:93:    ACTIVE_FILE: '.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts',
.opencode/skill/system-spec-kit/scripts/utils/validation-utils.ts:80:    console.warn(`[generate-context] Anchor validation warnings in ${filename}:`);
.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts:1249:      console.error('\nUsage: node generate-context.js [spec-folder-name] OR node generate-context.js <data-file> [spec-folder]\n');
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:177:  // (AI-composed JSON data from generate-context.js input)
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:23:  console.error('  node generate-context.js /tmp/save-context-data.json <spec-folder-path>');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:26:  console.error('  node generate-context.js --json \'{"specFolder":"specs/003-memory-and-spec-kit/054-remaining-bugs-remediation"}\' specs/003-memory-and-spec-kit/054-remaining-bugs-remedation');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:40:    console.warn('[generate-context] Non-interactive mode: using default value');
.opencode/skill/system-spec-kit/scripts/utils/prompt-utils.ts:72:    console.warn(`[generate-context] Non-interactive mode: using default choice 1`);
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:3:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:4:// Dispatch for L1 Orchestration tool: memory_context (T303).
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:11:export const TOOL_NAMES = new Set(['memory_context']);
.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:16:    case 'memory_context': return handleMemoryContext(parseArgs<ContextArgs>(validateToolArgs('memory_context', args)));
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:30:              producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:31:              sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:62:    sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:86:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:98:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:107:      recommendedAction: 'Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:108:      sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:121:    expect(parsed.data.nextActions).toContain('Call session_bootstrap to refresh structural context, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/scripts/tests/nested-changelog.vitest.ts:150:| mcp_server/tool-schemas.ts | Modified | Added output schema for session_bootstrap |
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:61:  'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:62:  'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:82:    case 'session_resume':             return handleSessionResume(parseArgs<SessionResumeArgs>(validateToolArgs('session_resume', args)));
.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:83:    case 'session_bootstrap':          return handleSessionBootstrap(parseArgs<SessionBootstrapArgs>(validateToolArgs('session_bootstrap', args)));
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:144:  it('preserves separate trust axes through real session_resume and session_bootstrap outputs', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:190:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:127:  it('returns null for memory_context (prevents recursive surfacing)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:128:    const result = await autoSurfaceAtToolDispatch('memory_context', { input: 'some context' });
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:20:        ? 'session_bootstrap'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-transport.vitest.ts:22:          ? 'session_resume'
.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:145:          tool: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:86:    expect(contract.sourceSurface).toBe('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:108:    expect(contract.recommendedAction).toContain('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:109:    expect(contract.sourceSurface).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:140:    const surfaces = ['auto-prime', 'session_bootstrap', 'session_resume', 'session_health'] as const;
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:89:describe('memory_context advisory metadata', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:212:describe('session_bootstrap authority preservation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:249:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:250:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:281:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:291:      preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:296:      'Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:66:    expect(parsed.data.payloadContract.provenance.producer).toBe('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:176:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:22:  'tool-schemas.js': 880,           // actual: 862 — Expanded MCP schema set + Sprint 019: Zod schema integration, ingest tools, Phase 024 session_bootstrap, and newer graph/search tool contracts
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:576:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:655:          input: 'resume previous work on memory quality',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:47:        producer: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/structural-trust-axis.vitest.ts:48:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:1:// TEST: memory_context per-channel eval logging (T056)
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-eval-channels.vitest.ts:88:describe('T056: memory_context emits per-strategy channel eval rows', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/token-budget-enforcement.vitest.ts:18:        memory_context: 3500,
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:30:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/mcp-input-validation.vitest.ts:176:  { tool: 'memory_context', handler: 'handleMemoryContext' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:117:        memory_context: 'L1',
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:194:        { tool: 'memory_context', expected: '[L1:Orchestration]' },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:221:      const result = mod.enhanceDescription('memory_context', 'Some description text');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:242:      expect(mod.enhanceDescription('memory_context', '')).toBe('[L1:Orchestration] ');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:252:        { tool: 'memory_context', expected: 3500 },
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:270:      expect(typeof mod.getTokenBudget('memory_context')).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:280:      const info = expectLayerInfo(mod.getLayerInfo('memory_context'));
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:287:      expect(info.tools).toContain('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:291:      const info1 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:292:      const info2 = mod.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:430:      const toolSamples = ['memory_context', 'memory_search', 'memory_list',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:12:  provenance: ['session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:54:        provenance: ['session_resume', 'session_resume'],
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:60:describe('session_resume certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:118:        sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:150:describe('session_bootstrap certainty contract', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:187:                  producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:188:                  sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-certainty.vitest.ts:219:        sourceSurface: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:159:      'memory_context',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:200:      'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:201:      'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:292:      'memory_context', 'memory_search', 'memory_quick_search', 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:303:      'session_health', 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:322:      expect(sourceCode).not.toMatch(/name !== 'session_health' && name !== 'session_bootstrap'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1123:    it('T000g: memory_context resume mode invokes TM-05 compaction hook at runtime', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1131:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1144:          params: { name: 'memory_context', arguments: { input: 'session resume context', mode: 'resume' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1157:    it('T000h: memory_context non-resume mode keeps SK-004 memory-aware path', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1164:        memoryAwareTools: new Set<string>(['memory_context']),
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1177:          params: { name: 'memory_context', arguments: { input: 'focused retrieval context', mode: 'focused' } },
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1614:    it('T28: L1 budget = 3500 (memory_context)', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1619:      expect(layerDefs!.getTokenBudget!('memory_context')).toBe(3500)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1703:    const expectedAwareTools = ['memory_context', 'memory_search', 'memory_match_triggers', 'memory_list', 'memory_save', 'memory_index_scan']
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2084:      'memory_context': '[L1:Orchestration]',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2131:    it('T000e: memory_context supports optional tokenUsage (0.0-1.0)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2132:      expect(toolSchemasCode).toMatch(/name:\s*'memory_context'[\s\S]*?tokenUsage:\s*\{\s*type:\s*'number'/)
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2315:        'Key tools: memory_context, memory_search, memory_save, memory_index_scan, memory_stats.',
.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:2341:      expect(result).toContain('memory_context')
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:1:// TEST: collect-session-data — basic unit tests for session status, completion, and collection
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:7:} from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:539:      '123-generate-context-subfolder',
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:929:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:971:  const outsideRoot = fs.mkdtempSync(path.join(require('os').tmpdir(), 'generate-context-outside-'));
.opencode/skill/system-spec-kit/scripts/tests/test-subfolder-resolution.js:979:    const { isValidSpecFolder } = require(path.join(DIST_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:101:        'Implemented the shared insufficiency gate in both generate-context and memory_save, then wired the rejection payload so dry-run reports reasons and evidence counts before any write occurs.',
.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts:106:      triggerPhrases: ['memory_save', 'dry run', 'insufficient context', 'generate-context'],
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/canonical-sources-auto-discovery.vitest.ts:9:import { deriveCanonicalDocPointers } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:89:        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:90:        'scripts/extractors/collect-session-data.ts:1176 canonical docs now render as relative links.',
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:94:        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed canonical discovery and counts.' },
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:110:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:132:    expect(evidence).toContain('scripts/extractors/collect-session-data.ts:1176');
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:133:    expect((evidence.match(/scripts\/extractors\/collect-session-data\.ts:1176/g) ?? []).length).toBe(1);
.opencode/skill/system-spec-kit/scripts/tests/session-enrichment.vitest.ts:169:            command: "node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js .opencode/specs/00--anobel.com/036-hero-contact-success",
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1431:  log('\n🔬 EXTRACTORS: collect-session-data.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:1434:    const { collectSessionData, shouldAutoSave } = require(path.join(SCRIPTS_DIR, 'extractors', 'collect-session-data'));
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2841:  log('\n🔬 MEMORY: generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:2848:    } = require(path.join(SCRIPTS_DIR, 'memory', 'generate-context'));
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:6:// - collect-session-data.js (424 LOC) - P0
.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js:268:    const collectSessionData = require(path.join(EXTRACTORS_DIR, 'collect-session-data'));
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:67:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:115:      const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:8:import { collectSessionData } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/overview-boundary-safe-truncation.vitest.ts:11:const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:9:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:3:import { buildDistinctiveEvidence } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:18:        'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
.opencode/skill/system-spec-kit/scripts/tests/distinguishing-evidence-dedup.vitest.ts:24:      'scripts/extractors/collect-session-data.ts:1200 canonical docs now render from relative links.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:8:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:15:    const { collectSessionData } = await import('../extractors/collect-session-data');
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:24:        { path: 'scripts/extractors/collect-session-data.ts', description: 'Fixed packet doc discovery.' },
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:35:    const { collectSessionData } = await import('../extractors/collect-session-data');
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:326:  it('confirms generate-context.js compiled entrypoint exists', () => {
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:327:    // W1-T3 parity: compiled generate-context must be present for CLI invocation
.opencode/skill/system-spec-kit/scripts/tests/test-integration.vitest.ts:328:    const generateContextPath = path.join(SCRIPTS_DIR, 'dist', 'memory', 'generate-context.js');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:11:const COLLECT_SESSION_DATA_PATH = path.join(TEST_DIR, '..', 'extractors', 'collect-session-data.ts');
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:7:import type { CollectedDataFull } from '../extractors/collect-session-data';
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:21:vi.mock('../extractors/collect-session-data', () => ({
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:40:describe('generate-context CLI authority', () => {
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:58:    process.argv = ['node', path.join('scripts', 'dist', 'memory', 'generate-context.js'), dataFile, explicitSpecFolder];
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:60:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:82:      path.join('scripts', 'dist', 'memory', 'generate-context.js'),
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:89:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:114:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:140:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:167:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:203:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:219:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:234:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:249:    const { main } = await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:264:      await import('../memory/generate-context');
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:281:  it('exercises session_resume, session_bootstrap, and session-prime against the frozen corpus via hook state', async () => {
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:315:        sourceSurface: 'session_bootstrap',

codex
CocoIndex wasn’t usable in this session, so I’m falling back to targeted `rg` plus direct file reads and keeping that limitation explicit in the notes. I’m now reading the exact handler/function bodies where session start, end, resume, and save behavior actually happen.
exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) (CreateSession|EndSession|FormatContext|AddObservation|Search)|func (CreateSession|EndSession|FormatContext|AddObservation|Search)|type Session|SaveSessionSummary|GetRecentSessions|GetSessionPrompts|GetRecentProjectObservations\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
29:type Session struct {
62:type SessionSummary struct {
754:func (s *Store) CreateSession(id, project, directory string) error {
770:func (s *Store) EndSession(id string, summary string) error {
948:func (s *Store) AddObservation(p AddObservationParams) (int64, error) {
1181:func (s *Store) SearchPrompts(query string, project string, limit int) ([]Prompt, error) {
1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
1613:func (s *Store) FormatContext(project, scope string) (string, error) {

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
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '375,610p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1078,1535p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

 succeeded in 0ms:
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
  1466	    responseData.structuralRoutingNudge = structuralRoutingNudge;
  1467	  }
  1468	
  1469	  // Build response with layer metadata
  1470	  const _contextResponse = createMCPResponse({
  1471	    tool: 'memory_context',
  1472	    summary: enforcement.truncated
  1473	      ? `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy) [truncated${enforcement.originalResultCount !== undefined ? `: ${enforcement.originalResultCount} → ${enforcement.returnedResultCount} results` : ''} to fit ${effectiveBudget} token budget]`
  1474	      : `Context retrieved via ${effectiveMode} mode (${tracedResult.strategy} strategy)`,
  1475	    data: responseData,
  1476	    hints: [
  1477	      `Mode: ${CONTEXT_MODES[effectiveMode].description}`,
  1478	      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
  1479	      `Token budget: ${effectiveBudget} (${effectiveMode} mode)`,
  1480	      ...(structuralRoutingNudge ? [structuralRoutingNudge.message] : []),
  1481	      ...(pressureWarning ? [pressureWarning] : [])
  1482	    ],
  1483	    extraMeta: buildResponseMeta({
  1484	      effectiveMode,
  1485	      requestedMode: requested_mode,
  1486	      tracedResult,
  1487	      pressurePolicy,
  1488	      pressureOverrideApplied,
  1489	      pressureOverrideTargetMode,
  1490	      pressureWarning,
  1491	      sessionLifecycle,
  1492	      effectiveBudget,
  1493	      enforcement,
  1494	      intentClassification: {
  1495	        detectedIntent,
  1496	        intentConfidence,
  1497	        resumeHeuristicApplied,
  1498	        source: intentSource,
  1499	      },
  1500	      discoveredFolder,
  1501	      includeTrace: options.includeTrace === true,
  1502	      sessionTransition,
  1503	      structuralRoutingNudge,
  1504	    })
  1505	  });
  1506	
  1507	  // Consumption instrumentation — log context event (fail-safe, never throws)
  1508	  try {
  1509	    const db = vectorIndex.getDb();
  1510	    if (db) {
  1511	      initConsumptionLog(db);
  1512	      let resultIds: number[] = [];
  1513	      let resultCount = 0;
  1514	      try {
  1515	        if (_contextResponse?.content?.[0]?.text) {
  1516	          const innerResults = extractResultRowsFromContextResponse(_contextResponse.content[0].text);
  1517	          resultIds = innerResults.map(r => r.id as number).filter(id => typeof id === 'number');
  1518	          resultCount = innerResults.length;
  1519	        }
  1520	      } catch {
  1521	        // Intentional no-op — error deliberately discarded
  1522	      }
  1523	      logConsumptionEvent(db, {
  1524	        event_type: 'context',
  1525	        query_text: normalizedInput,
  1526	        intent: detectedIntent ?? null,
  1527	        mode: effectiveMode,
  1528	        result_count: resultCount,
  1529	        result_ids: resultIds,
  1530	        session_id: effectiveSessionId,
  1531	        latency_ms: Date.now() - _contextStartTime,
  1532	        spec_folder_filter: spec_folder ?? null,
  1533	      });
  1534	    }
  1535	  } catch {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '400,610p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '163,340p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   221	  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
   222	  const structuralCertainty: SharedPayloadCertainty = 'exact';
   223	  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
   224	  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
   225	  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
   226	  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
   227	  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
   228	  if (!resumeData.error && !resumeStructuralTrust) {
   229	    throw new StructuralTrustPayloadError(
   230	      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
   231	    );
   232	  }
   233	  const structuralContextWithTrust = attachStructuralTrustFields(
   234	    structuralContext,
   235	    structuralSnapshotTrust,
   236	    { label: 'session_bootstrap structural context payload' },
   237	  );
   238	  const resumeWithTrust = resumeData.error
   239	    ? resumeData
   240	    : attachStructuralTrustFields(
   241	      resumeData,
   242	      resumeStructuralTrust,
   243	      { label: 'session_bootstrap resume payload' },
   244	    );
   245	
   246	  const payloadSections: SharedPayloadSection[] = [
   247	    {
   248	      key: 'resume-surface',
   249	      title: 'Resume Surface',
   250	      content: summarizeUnknown(resumeData),
   251	      source: 'memory',
   252	      certainty: resumeCertainty,
   253	    },
   254	  ];
   255	  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
   256	    payloadSections.push({
   257	      key: 'cached-continuity',
   258	      title: 'Cached Continuity',
   259	      content: [
   260	        cachedSummary.cachedSummary.continuityText,
   261	        `Cache tokens: create=${cachedSummary.cachedSummary.cacheCreationInputTokens}; read=${cachedSummary.cachedSummary.cacheReadInputTokens}`,
   262	        `Transcript: ${cachedSummary.cachedSummary.transcriptFingerprint}`,
   263	      ].join(' | '),
   264	      source: 'session',
   265	      certainty: cachedCertainty,
   266	    });
   267	  }
   268	  payloadSections.push(
   269	    {
   270	      key: 'health-surface',
   271	      title: 'Health Surface',
   272	      content: summarizeUnknown(healthData),
   273	      source: 'operational',
   274	      certainty: healthCertainty,
   275	    },
   276	    {
   277	      key: 'structural-context',
   278	      title: 'Structural Context',
   279	      // This section carries trust derived from the local structural snapshot,
   280	      // which remains valid even when the remote resume surface fails closed.
   281	      content: structuralContext.summary,
   282	      source: 'code-graph',
   283	      certainty: structuralCertainty,
   284	      structuralTrust: structuralSnapshotTrust,
   285	    },
   286	    {
   287	      key: 'next-actions',
   288	      title: 'Next Actions',
   289	      content: buildNextActions(resumeData, healthData, structuralContext).join(' | '),
   290	      source: 'session',
   291	      certainty: nextActionsCertainty,
   292	    },
   293	  );
   294	
   295	  const payloadContract = createSharedPayloadEnvelope({
   296	    kind: 'bootstrap',
   297	    sections: payloadSections,
   298	    summary: `Bootstrap payload: ${summarizeCertaintyContract([
   299	      { label: 'resume', certainty: resumeCertainty },
   300	      { label: 'health', certainty: healthCertainty },
   301	      ...(cachedSummary?.status === 'accepted' ? [{ label: 'cached', certainty: cachedCertainty }] : []),
   302	      { label: 'structural', certainty: structuralCertainty },
   303	      { label: 'nextActions', certainty: nextActionsCertainty },
   304	    ])}; structuralStatus=${structuralContext.status}`,
   305	    provenance: {
   306	      producer: 'session_bootstrap',
   307	      sourceSurface: 'session_bootstrap',
   308	      trustState: trustStateFromStructuralStatus(structuralContext.status),
   309	      generatedAt: new Date().toISOString(),
   310	      lastUpdated: structuralContext.provenance?.lastUpdated ?? null,
   311	      sourceRefs: ['session-resume', 'session-health', 'session-snapshot'],
   312	    },
   313	  });
   314	  const graphOps = buildCodeGraphOpsContract({
   315	    graphFreshness: structuralContext.status === 'ready'
   316	      ? 'fresh'
   317	      : structuralContext.status === 'stale'
   318	        ? 'stale'
   319	        : 'empty',
   320	    sourceSurface: 'session_bootstrap',
   321	  });
   322	
   323	  const result: SessionBootstrapResult = {
   324	    resume: resumeWithTrust,
   325	    health: healthData,
   326	    ...(cachedSummary ? { cachedSummary } : {}),
   327	    structuralContext: structuralContextWithTrust,
   328	    ...(structuralRoutingNudge ? { structuralRoutingNudge } : {}),
   329	    payloadContract,
   330	    opencodeTransport: buildOpenCodeTransportPlan({
   331	      bootstrapPayload: payloadContract,
   332	      resumePayload,
   333	      healthPayload,
   334	      specFolder: args.specFolder ?? null,
   335	    }),
   336	    graphOps,
   337	    hints: uniqueHints,
   338	    // Keep advisory routing guidance out of nextActions so bootstrap and resume
   339	    // remain the authoritative recovery owners for startup and deep resume flows.
   340	    nextActions: buildNextActions(resumeData, healthData, structuralContext),

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '740,840p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '948,1115p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1462,1698p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"resolveSessionLifecycle|saveSessionState|getSessionPromptContext|session_bootstrap|memory_context\\({ mode: 'resume'|memory_context\\({ input: 'resume previous work'|buildStructuralBootstrapContract|cached continuity|effectiveSessionId\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts -g '*.{ts,js}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: regex parse error:
    (?:resolveSessionLifecycle|saveSessionState|getSessionPromptContext|session_bootstrap|memory_context\({ mode: 'resume'|memory_context\({ input: 'resume previous work'|buildStructuralBootstrapContract|cached continuity|effectiveSessionId)
                                                                                                            ^
error: repetition quantifier expects a valid decimal

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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   121	  - Knowledge Delta = postflight.knowledgeScore - preflight.knowledgeScore
   122	  - Uncertainty Reduction = preflight.uncertaintyScore - postflight.uncertaintyScore
   123	  - Context Delta = postflight.contextScore - preflight.contextScore
   124	  - Learning Index = (Know x 0.4) + (Uncert x 0.35) + (Context x 0.25)
   125	`;
   126	
   127	if (process.argv.includes('--help') || process.argv.includes('-h')) {
   128	  console.log(HELP_TEXT);
   129	  process.exit(0);
   130	}
   131	
   132	// 2.1 SIGNAL HANDLERS
   133	let signalHandlersInstalled = false;
   134	let shuttingDown = false;
   135	
   136	// Robustness: signal handler releases locks before reporting
   137	function handleSignalShutdown(signal: string): void {
   138	  if (shuttingDown) return; // prevent re-entrant handling
   139	  shuttingDown = true;
   140	
   141	  let lockReleaseFailed = false;
   142	  try {
   143	    releaseFilesystemLock();
   144	  } catch (_err: unknown) {
   145	    lockReleaseFailed = true;
   146	  }
   147	
   148	  console.error(`\nWarning: Received ${signal} signal, shutting down gracefully...`);
   149	  process.exit(lockReleaseFailed ? 1 : 0);
   150	}
   151	
   152	function installSignalHandlers(): void {
   153	  if (signalHandlersInstalled) {
   154	    return;
   155	  }
   156	
   157	  process.on('SIGTERM', () => handleSignalShutdown('SIGTERM'));
   158	  process.on('SIGINT', () => handleSignalShutdown('SIGINT'));
   159	
   160	  signalHandlersInstalled = true;
   161	}
   162	
   163	// ───────────────────────────────────────────────────────────────
   164	// 4. SPEC FOLDER VALIDATION
   165	// ───────────────────────────────────────────────────────────────
   166	function isUnderApprovedSpecsRoot(normalizedInput: string): boolean {
   167	  return validateFilePath(path.resolve(CONFIG.PROJECT_ROOT, normalizedInput), getSpecsDirectories()) !== null;
   168	}
   169	
   170	function isValidSpecFolder(folderPath: string): SpecFolderValidation {
   171	  const folderName = path.basename(folderPath);
   172	
   173	  // --- Subfolder support: parent/child format (e.g., "003-parent/121-child" or "02--cat/003-parent/121-child") ---
   174	  const normalizedInput = folderPath.replace(/\\/g, '/').replace(/\/+$/, '');
   175	  // Extract the trailing portion that might be "parent/child"
   176	  const trailingSegments = normalizedInput.split('/');
   177	  // Check if the last two segments both match the spec folder pattern
   178	  if (trailingSegments.length >= 2) {
   179	    const lastTwo = trailingSegments.slice(-2);
   180	    if (SPEC_FOLDER_PATTERN.test(lastTwo[0]) && SPEC_FOLDER_PATTERN.test(lastTwo[1])) {
   181	      // Both segments are valid spec folder names — valid nested spec folder
   182	      const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);
   183	
   184	      if (!hasSpecsParent) {
   185	        // Fallback: check if the path resolves to an existing directory under any specs root
   186	        for (const specsDir of getSpecsDirectories()) {
   187	          const candidate = path.join(specsDir, normalizedInput);
   188	          if (
   189	            !path.isAbsolute(normalizedInput) &&
   190	            fsSync.existsSync(candidate) &&
   191	            validateFilePath(candidate, getSpecsDirectories()) !== null
   192	          ) {
   193	            return { valid: true };
   194	          }
   195	        }
   196	        return {
   197	          valid: false,
   198	          reason: `Spec folder must be under specs/ or .opencode/specs/: ${folderPath}`
   199	        };
   200	      }
   201	      return { valid: true };
   202	    }
   203	  }
   204	
   205	  if (!SPEC_FOLDER_PATTERN.test(folderName)) {
   206	    if (/^\d{3}-/.test(folderName)) {
   207	      if (/[A-Z]/.test(folderName)) {
   208	        return { valid: false, reason: 'Spec folder name should be lowercase' };
   209	      }
   210	      if (/_/.test(folderName)) {
   211	        return { valid: false, reason: 'Spec folder name should use hyphens, not underscores' };
   212	      }
   213	      if (!/^[a-z]/.test(folderName.slice(4))) {
   214	        return { valid: false, reason: 'Spec folder name must start with a letter after the number prefix' };
   215	      }
   216	    }
   217	    return { valid: false, reason: 'Invalid spec folder format. Expected: NNN-feature-name' };
   218	  }
   219	
   220	  const hasSpecsParent = isUnderApprovedSpecsRoot(normalizedInput);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '560,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   560	    const hasSessionSummary = !!collectedData.sessionSummary;
   561	    const saveMode = resolveSaveMode(collectedData);
   562	    if (saveMode === SaveMode.Json && hasSessionSummary) {
   563	      return 95;
   564	    }
   565	  }
   566	
   567	  const totalTools = Object.values(toolCounts).reduce((a, b) => a + b, 0);
   568	  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
   569	
   570	  let basePercent = 0;
   571	  basePercent += Math.min(50, messageCount * 5);
   572	
   573	  if (totalTools > 0) {
   574	    basePercent += Math.min(30, (writeTools / totalTools) * 40);
   575	  }
   576	
   577	  basePercent += Math.min(20, observations.length * 3);
   578	
   579	  return Math.min(95, Math.round(basePercent));
   580	}
   581	
   582	function extractPendingTasks(
   583	  observations: Observation[],
   584	  recentContext: RecentContextEntry[] | undefined,
   585	  nextAction: string
   586	): PendingTask[] {
   587	  const tasks: PendingTask[] = [];
   588	  const taskPatterns: RegExp[] = [
   589	    /\b(?:todo|task|need(?:s)? to|should|must|next):\s*(.+?)(?:[.!?\n]|$)/gi,
   590	    /\[\s*\]\s*(.+?)(?:\n|$)/g,
   591	    /\b(?:remaining|pending|left to do):\s*(.+?)(?:[.!?\n]|$)/gi
   592	  ];
   593	
   594	  let taskId = 1;
   595	  const seen = new Set<string>();
   596	
   597	  for (const obs of observations) {
   598	    const text = `${obs.title || ''} ${obs.narrative || ''}`;
   599	    for (const pattern of taskPatterns) {
   600	      let match: RegExpExecArray | null;
   601	      pattern.lastIndex = 0;
   602	      while ((match = pattern.exec(text)) !== null) {
   603	        const taskDesc = match[1].trim().substring(0, 100);
   604	        if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
   605	          seen.add(taskDesc.toLowerCase());
   606	          tasks.push({
   607	            TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
   608	            TASK_DESCRIPTION: taskDesc,
   609	            TASK_PRIORITY: 'P1'
   610	          });
   611	        }
   612	      }
   613	    }
   614	
   615	    if (obs.facts) {
   616	      const factTexts = coerceFactsToText(obs.facts, {
   617	        component: 'collect-session-data',
   618	        fieldPath: 'observations[].facts',
   619	      });
   620	      for (const factText of factTexts) {
   621	        for (const pattern of taskPatterns) {
   622	          let match: RegExpExecArray | null;
   623	          pattern.lastIndex = 0;
   624	          while ((match = pattern.exec(factText)) !== null) {
   625	            const taskDesc = match[1].trim().substring(0, 100);
   626	            if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
   627	              seen.add(taskDesc.toLowerCase());
   628	              tasks.push({
   629	                TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
   630	                TASK_DESCRIPTION: taskDesc,
   631	                TASK_PRIORITY: 'P2'
   632	              });
   633	            }
   634	          }
   635	        }
   636	      }
   637	    }
   638	  }
   639	
   640	  if (nextAction &&
   641	      nextAction !== 'Continue implementation' &&
   642	      !seen.has(nextAction.toLowerCase())) {
   643	    tasks.unshift({
   644	      TASK_ID: 'T000',
   645	      TASK_DESCRIPTION: nextAction,
   646	      TASK_PRIORITY: 'P0'
   647	    });
   648	  }
   649	
   650	  return tasks.slice(0, 10);
   651	}
   652	
   653	function generateContextSummary(
   654	  summary: string,
   655	  observations: Observation[],
   656	  projectPhase: string,
   657	  decisionCount: number
   658	): string {
   659	  const parts: string[] = [];
   660	
   661	  parts.push(`**Phase:** ${projectPhase}`);
   662	
   663	  if (observations.length > 0) {
   664	    const recentTitles = observations
   665	      .slice(-3)
   666	      .map((o) => o.title)
   667	      .filter((t): t is string => !!t && t.length > 5)
   668	      .join(', ');
   669	    if (recentTitles) {
   670	      parts.push(`**Recent:** ${recentTitles}`);
   671	    }
   672	  }
   673	
   674	  if (decisionCount > 0) {
   675	    parts.push(`**Decisions:** ${decisionCount} decision${decisionCount > 1 ? 's' : ''} recorded`);
   676	  }
   677	
   678	  return parts.join('\n\n');
   679	}
   680	
   681	function normalizeProposition(text: string): string {
   682	  return text
   683	    .toLowerCase()
   684	    .replace(/[^a-z0-9\s]+/g, ' ')
   685	    .replace(/\s+/g, ' ')
   686	    .trim();
   687	}
   688	
   689	function extractDecisionTitle(value: string | Record<string, unknown>): string {
   690	  const toText = (input: unknown): string => typeof input === 'string' ? input.trim() : '';
   691	  const decisionText = typeof value === 'string'
   692	    ? value.trim()
   693	    : toText(value.decision) || toText(value.title) || '';
   694	
   695	  if (!decisionText) {
   696	    return '';
   697	  }
   698	
   699	  const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
   700	  return titleMatch?.[1]?.trim() || decisionText;
   701	}
   702	
   703	function collectDecisionPropositions(
   704	  collectedData: CollectedDataFull,
   705	  observations: Observation[],
   706	): Set<string> {
   707	  const propositions = new Set<string>();
   708	  const rawDecisions = Array.isArray(collectedData._manualDecisions)
   709	    ? collectedData._manualDecisions as Array<string | Record<string, unknown>>
   710	    : Array.isArray(collectedData.keyDecisions)
   711	      ? collectedData.keyDecisions as Array<string | Record<string, unknown>>
   712	      : [];
   713	
   714	  for (const decision of rawDecisions) {
   715	    const normalized = normalizeProposition(extractDecisionTitle(decision));
   716	    if (normalized) {
   717	      propositions.add(normalized);
   718	    }
   719	  }
   720	
   721	  for (const observation of observations) {
   722	    if (detectObservationType(observation) !== 'decision') {
   723	      continue;
   724	    }
   725	
   726	    const normalized = normalizeProposition(observation.title || observation.narrative || '');
   727	    if (normalized) {
   728	      propositions.add(normalized);
   729	    }
   730	  }
   731	
   732	  return propositions;
   733	}
   734	
   735	function generateResumeContext(
   736	  files: FileChange[],
   737	  specFiles: SpecFileEntry[],
   738	  observations: Observation[]
   739	): ContextItem[] {
   740	  const items: ContextItem[] = [];
   741	
   742	  if (files.length > 0) {
   743	    const fileList = files.slice(0, 3).map((f) => f.FILE_PATH).join(', ');
   744	    items.push({ CONTEXT_ITEM: `Files modified: ${fileList}` });
   745	  }
   746	
   747	  const priorityDocs = ['tasks.md', 'checklist.md', 'plan.md'];
   748	  const relevantDocs = specFiles.filter((sf) => priorityDocs.includes(sf.FILE_NAME));
   749	  if (relevantDocs.length > 0) {
   750	    items.push({ CONTEXT_ITEM: `Check: ${relevantDocs.map((d) => d.FILE_NAME).join(', ')}` });
   751	  }
   752	
   753	  const lastMeaningful = [...observations].reverse().find((o) => o.narrative && o.narrative.length > 50);
   754	  if (lastMeaningful) {
   755	    const lastSource = [lastMeaningful.title, lastMeaningful.narrative]
   756	      .find((value): value is string => typeof value === 'string' && value.trim().length >= 20)
   757	      || lastMeaningful.narrative
   758	      || lastMeaningful.title
   759	      || '';
   760	    const lastTruncated = truncateOnWordBoundary(lastSource.trim(), 80, {

codex
The shape is clearer now: Engram treats session lifecycle as first-class durable rows plus explicit MCP verbs, while our side layers recovery, trust, and save authority across `memory_context`, `session_resume/bootstrap`, and `generate-context`. I’m drilling one level deeper into our implicit session lifecycle helpers and the save pipeline so the comparison can distinguish “explicit lifecycle API” from “resume/save orchestration.”
exec
/bin/zsh -lc "rg -n \"resolveSessionLifecycle|saveSessionState\\(|getSessionPromptContext\\(|sessionScope|effectiveSessionId|requestedSessionId|resumedContextCount\" .opencode/skill/system-spec-kit/mcp_server -g '*.{ts,js}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:223:        details: { requestedSessionId: rawSessionId },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:94:  sessionScope: 'caller' | 'ephemeral';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:95:  requestedSessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:96:  effectiveSessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:99:  resumedContextCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:144:  requestedSessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:145:  effectiveSessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821:function resolveSessionLifecycle(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:835:      requestedSessionId: trustedSession.requestedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:836:      effectiveSessionId: '',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:844:  const requestedSessionId = trustedSession.requestedSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:845:  const effectiveSessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:855:    requestedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:856:    effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1222:    requestedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1223:    effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1227:    error: sessionScopeError,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228:  } = resolveSessionLifecycle(args, null);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1229:  if (sessionScopeError) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1232:      error: sessionScopeError,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1241:    sessionScope: requestedSessionId ? 'caller' : 'ephemeral',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1242:    requestedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1243:    effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1246:    resumedContextCount: 0,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1263:  const pressurePolicyEnabled = isPressurePolicyEnabled(effectiveSessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1264:  const autoResumeEnabled = isAutoResumeEnabled(effectiveSessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1303:      requestedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1304:      effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1361:      `[memory-context] Failed to persist session identity for ${effectiveSessionId}: ${sessionStateResult.error ?? 'unknown error'}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1437:      sessionLifecycle.resumedContextCount = resumeContextItems.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1530:        session_id: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:495:  const effectiveSessionId = sessionId
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:499:  if (!effectiveSessionId || effectiveSessionId.trim().length === 0) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:503:  if (isSessionPrimed(effectiveSessionId)) {
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:520:    markSessionPrimed(effectiveSessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:166:  requestedSessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:167:  effectiveSessionId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:386:  requestedSessionId: string | null = null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:389:  const normalizedSessionId = typeof requestedSessionId === 'string' && requestedSessionId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:390:    ? requestedSessionId.trim()
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:395:      requestedSessionId: null,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:396:      effectiveSessionId: crypto.randomUUID(),
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:403:      requestedSessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:404:      effectiveSessionId: '',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:406:      error: `sessionId "${normalizedSessionId}" does not match a server-managed session. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:413:      requestedSessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:414:      effectiveSessionId: '',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:416:      error: `sessionId "${normalizedSessionId}" is not bound to a corroborated server identity. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:423:      requestedSessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:424:      effectiveSessionId: '',
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:426:      error: `sessionId "${normalizedSessionId}" is bound to a different ${mismatch}. Omit sessionId to start a new server-generated session and reuse the effectiveSessionId returned by the server.`,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:431:    requestedSessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:432:    effectiveSessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:408:      const result = sessionManager.saveSessionState('session-state-save', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:440:      sessionManager.saveSessionState('active-a', { currentTask: 'A' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:441:      sessionManager.saveSessionState('active-b', { currentTask: 'B' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:451:      sessionManager.saveSessionState('active-only', { currentTask: 'still running' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:452:      sessionManager.saveSessionState('completed-only', { currentTask: 'already done' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:463:      sessionManager.saveSessionState('list-a', { specFolder: 'specs/A', currentTask: 'recover A' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:464:      sessionManager.saveSessionState('list-b', { specFolder: 'specs/B', currentTask: 'recover B' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:465:      sessionManager.saveSessionState('list-c', { specFolder: 'specs/C', currentTask: 'completed C' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:478:      sessionManager.saveSessionState('recover-me', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:601:      const result = sessionManager.saveSessionState('persist-all', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:627:      sessionManager.saveSessionState('json-state', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:638:      sessionManager.saveSessionState('timestamped', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:652:      sessionManager.saveSessionState('complete-transition', { currentTask: 'finish work' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:664:      sessionManager.saveSessionState('interrupt-transition', { currentTask: 'simulate crash' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:675:      sessionManager.saveSessionState('interrupt-active', { currentTask: 'active' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:676:      sessionManager.saveSessionState('interrupt-completed', { currentTask: 'completed' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:688:      sessionManager.saveSessionState('recover-fields', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:721:      sessionManager.saveSessionState('recover-nested', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:741:      sessionManager.saveSessionState('flag-interrupted', { currentTask: 'interrupted' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:751:      sessionManager.saveSessionState('flag-completed', { currentTask: 'completed' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:769:      sessionManager.saveSessionState('flag-reactivate', { currentTask: 'reactivate' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:780:      sessionManager.saveSessionState('recoverable-a', { specFolder: 'specs/A', currentTask: 'A' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:781:      sessionManager.saveSessionState('recoverable-b', { specFolder: 'specs/B', currentTask: 'B' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:782:      sessionManager.saveSessionState('recoverable-c', { specFolder: 'specs/C', currentTask: 'C' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:792:      sessionManager.saveSessionState('exclude-completed', { currentTask: 'completed' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:802:      sessionManager.saveSessionState('field-check', {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:164:        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:167:      const fromLifecycle = parsed?.meta?.sessionLifecycle?.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:254:      requestedSessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:255:      effectiveSessionId: 'session-1',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:82:      sessionScope?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:83:      requestedSessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:84:      effectiveSessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:87:      resumedContextCount?: number;
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:111:    requestedSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:112:    effectiveSessionId: sessionId,
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:526:      expect(parsed.meta.sessionLifecycle.sessionScope).toBe('ephemeral');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:527:      expect(parsed.meta.sessionLifecycle.requestedSessionId).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:528:      expect(typeof parsed.meta.sessionLifecycle.effectiveSessionId).toBe('string');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:529:      expect(parsed.meta.sessionLifecycle.effectiveSessionId.length).toBeGreaterThan(20);
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:557:        'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.'
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:585:      expect(parsed.meta.sessionLifecycle.sessionScope).toBe('caller');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:586:      expect(parsed.meta.sessionLifecycle.requestedSessionId).toBe('session-abc');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:587:      expect(parsed.meta.sessionLifecycle.effectiveSessionId).toBe('session-abc');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:590:      expect(parsed.meta.sessionLifecycle.resumedContextCount).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:100:        requestedSessionId: null,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:101:        effectiveSessionId: 'session-123',
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:273:      sm.saveSessionState('trusted-session', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:280:      expect(result.requestedSessionId).toBe('trusted-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:281:      expect(result.effectiveSessionId).toBe('trusted-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:288:      sm.saveSessionState('trusted-session-without-identity', { currentTask: 'tracked by server' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:298:      sm.saveSessionState('bound-session', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:312:      sm.saveSessionState('bound-session-missing-user', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:338:      expect(result.requestedSessionId).toBeNull();
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:340:      expect(result.effectiveSessionId).toEqual(expect.any(String));
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:341:      expect(result.effectiveSessionId.length).toBeGreaterThan(20);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:394:      const r = sm.saveSessionState('save-1', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:422:      sm.saveSessionState('save-2', { currentTask: 'task A', specFolder: 'specs/002' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:424:      sm.saveSessionState('save-2', { lastAction: 'did something' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:431:      const r = sm.saveSessionState('', {});
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:442:      sm.saveSessionState('complete-1', { currentTask: 'finishing up' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:461:      sm.saveSessionState('reset-1', { currentTask: 'task A' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:462:      sm.saveSessionState('reset-2', { currentTask: 'task B' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:490:      sm.saveSessionState('recover-1', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:527:      sm.saveSessionState('recover-bound', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:553:      sm.saveSessionState('int-3', { specFolder: 'specs/C', currentTask: 'task C' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:573:      sm.saveSessionState('int-unbound', { currentTask: 'task C' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:638:        sm.saveSessionState('write-md-1', {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '150,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"collectSessionData\\(|runWorkflow\\(|loadCollectedData\\(|specFolderArg|Explicit CLI targets still outrank payload specFolder|sessionId\" .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts .opencode/skill/system-spec-kit/scripts/core/workflow.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   150	}
   151	
   152	interface EffectiveModeIntentClassification {
   153	  detectedIntent?: string;
   154	  intentConfidence: number;
   155	  resumeHeuristicApplied: boolean;
   156	  source: 'explicit' | 'auto-detected';
   157	}
   158	
   159	interface EffectiveModeResolution {
   160	  effectiveMode: string;
   161	  pressureOverrideApplied: boolean;
   162	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   163	  pressureWarning: string | null;
   164	  intentClassification: EffectiveModeIntentClassification;
   165	}
   166	
   167	interface BuildResponseMetaParams {
   168	  effectiveMode: string;
   169	  requestedMode: string;
   170	  tracedResult: ContextResult;
   171	  pressurePolicy: {
   172	    level: string;
   173	    ratio: number | null;
   174	    source: string;
   175	    warning: string | null;
   176	  };
   177	  pressureOverrideApplied: boolean;
   178	  pressureOverrideTargetMode: PressureOverrideTargetMode;
   179	  pressureWarning: string | null;
   180	  sessionLifecycle: SessionLifecycleMetadata;
   181	  effectiveBudget: number;
   182	  enforcement: TokenBudgetEnforcement;
   183	  intentClassification: EffectiveModeIntentClassification;
   184	  discoveredFolder?: string;
   185	  includeTrace: boolean;
   186	  sessionTransition: SessionTransitionTrace;
   187	  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
   188	}
   189	
   190	interface StrategyErrorPayload {
   191	  error: string;
   192	  code: string;
   193	  details: Record<string, unknown>;
   194	  hints: string[];
   195	  severity: string | null;
   196	}
   197	
   198	interface StructuralRoutingNudgeMeta {
   199	  advisory: true;
   200	  readiness: 'ready';
   201	  preferredTool: 'code_graph_query';
   202	  message: string;
   203	  preservesAuthority: 'session_bootstrap';
   204	}
   205	
   206	const STRUCTURAL_ROUTING_PATTERNS = [
   207	  /\b(?:who|what)\s+calls?\b/i,
   208	  /\bcallers?\s+of\b/i,
   209	  /\b(?:who|what)\s+imports?\b/i,
   210	  /\bimports?\s+of\b/i,
   211	  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
   212	  /\boutline\s+of\b/i,
   213	  /\bdependenc(?:y|ies)\b/i,
   214	  /\bdependents?\b/i,
   215	  /\bwhat\s+extends\b/i,
   216	];
   217	
   218	function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
   219	  try {
   220	    const parsed = JSON.parse(responseText) as Record<string, unknown>;
   221	    const outerData = parsed?.data as Record<string, unknown> | undefined;
   222	
   223	    const directRows = Array.isArray(outerData?.results)
   224	      ? outerData.results as Array<Record<string, unknown>>
   225	      : null;
   226	    if (directRows) {
   227	      return directRows;
   228	    }
   229	
   230	    const nestedContent = Array.isArray(outerData?.content)
   231	      ? outerData.content as Array<{ type?: string; text?: string }>
   232	      : [];
   233	    const nestedText = nestedContent[0]?.text;
   234	    if (typeof nestedText !== 'string' || nestedText.length === 0) {
   235	      return [];
   236	    }
   237	
   238	    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
   239	    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
   240	    return Array.isArray(nestedData?.results)
   241	      ? nestedData.results as Array<Record<string, unknown>>
   242	      : [];
   243	  } catch {
   244	    return [];
   245	  }
   246	}
   247	
   248	function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
   249	  if ((result as Record<string, unknown>).isError !== true) {
   250	    return null;
   251	  }
   252	
   253	  const content = Array.isArray((result as Record<string, unknown>).content)
   254	    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
   255	    : [];
   256	  const responseText = content[0]?.text;
   257	  if (typeof responseText !== 'string' || responseText.length === 0) {
   258	    return {
   259	      error: 'Context strategy failed',
   260	      code: 'E_STRATEGY',

 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1188:async function collectSessionData(
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1231:  const sessionId: string = (
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1246:      sessionId,
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1296:    : typeof data._sessionId === 'string'
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1297:      ? data._sessionId
.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1574:    SESSION_ID: sessionId,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:33:  specFolderArg: string | null;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:35:  sessionId: string | null;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:78:  - Explicit CLI targets still outrank payload specFolder values in every structured-input mode.
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:373:  const specFolderArg = explicitTarget || payloadTarget;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:375:  if (!specFolderArg) {
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:381:    specFolderArg,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:386:    sessionId: null,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:398:  let sessionId: string | null = null;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:406:      sessionId = candidate.trim();
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:415:    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:420:    return { ...structured, sessionId };
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:433:    specFolderArg: secondaryArg || null,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:435:    sessionId,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:440:  const specFolderArg = CONFIG.SPEC_FOLDER_ARG;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:441:  if (!specFolderArg) return;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:443:  const validation = isValidSpecFolder(specFolderArg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:452:  const inputBaseName = path.basename(specFolderArg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:465:  console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:473:      const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && SPEC_FOLDER_PATTERN.test(n));
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:481:        const targetBase = path.basename(specFolderArg);
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:559:    CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:562:    await runWorkflow({
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:564:      specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:568:        : () => loadCollectedData({}),
.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:570:      sessionId: parsed.sessionId ?? undefined,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:306:  specFolderArg?: string;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:320:  sessionId?: string;
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:625:async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:629:      specFolderArg,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:642:    const activeSpecFolderArg = specFolderArg ?? (hasDirectDataContext ? null : CONFIG.SPEC_FOLDER_ARG);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:659:      // preserving preloadedData's non-normalized fields (e.g., _source, _sessionId).
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:687:        specFolderArg: activeSpecFolderArg,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:744:      specFolderArg: activeSpecFolderArg,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1017:        '  - If calling runWorkflow() directly, pass { collectSessionDataFn: yourFunction } in options\n' +
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1069:      const result = await sessionDataFn(narrativeCollectedData, specFolderName, options.sessionId);
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1426:      sessionId: sessionData.SESSION_ID,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1443:    sessionId: sessionData.SESSION_ID,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1614:        sessionId: sessionData.SOURCE_SESSION_ID,

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/working-memory.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skill/system-spec-kit/mcp_server/lib/session/working-memory.ts: No such file or directory

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Workflow
     3	// ───────────────────────────────────────────────────────────────
     4	
     5	// ───────────────────────────────────────────────────────────────
     6	// 1. WORKFLOW
     7	// ───────────────────────────────────────────────────────────────
     8	// Main workflow orchestrator -- coordinates data loading, extraction, rendering, and file output
     9	// Node stdlib
    10	import * as path from 'node:path';
    11	import * as fsSync from 'node:fs';
    12	// Internal modules
    13	import { CONFIG, findActiveSpecsDir, getSpecsDirectories } from './config';
    14	import {
    15	  extractConversations,
    16	  extractDecisions,
    17	  extractDiagrams,
    18	  extractPhasesFromData,
    19	  enhanceFilesWithSemanticDescriptions,
    20	} from '../extractors';
    21	import { detectSpecFolder, setupContextDirectory } from '../spec-folder';
    22	import { populateTemplate } from '../renderers';
    23	import { extractKeyTopics } from './topic-extractor';
    24	import type { DecisionForTopics } from './topic-extractor';
    25	import { writeFilesAtomically } from './file-writer';
    26	import { generateContentSlug, ensureUniqueMemoryFilename } from '../utils/slug-utils';
    27	import { pickPreferredMemoryTask, shouldEnrichTaskFromSpecTitle } from '../utils/task-enrichment';
    28	import {
    29	  buildSpecAffinityTargets,
    30	  evaluateCollectedDataSpecAffinity,
    31	} from '../utils/spec-affinity';
    32	import { deriveMemoryDescription } from '../lib/memory-frontmatter';
    33	import {
    34	  isAllowlistedShortProductName,
    35	  sanitizeTriggerPhrases,
    36	} from '../lib/trigger-phrase-sanitizer';
    37	import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data';
    38	import type { CollectedDataFull } from '../extractors/collect-session-data';
    39	import type { SemanticFileInfo } from '../extractors/file-extractor';
    40	import { filterContamination, getContaminationPatternLabels, SEVERITY_RANK, type ContaminationSeverity } from '../extractors/contamination-filter';
    41	import {
    42	  scoreMemoryQuality as scoreMemoryQualityV2,
    43	  type ValidationSignal,
    44	} from '../extractors/quality-scorer';
    45	import {
    46	  determineValidationDisposition,
    47	  validateMemoryQualityContent,
    48	} from '../lib/validate-memory-quality';
    49	import { extractSpecFolderContext } from '../extractors/spec-folder-extractor';
    50	import { extractGitContext } from '../extractors/git-context-extractor';
    51	
    52	// Static imports replacing lazy require()
    53	import * as flowchartGen from '../lib/flowchart-generator';
    54	import { createFilterPipeline } from '../lib/content-filter';
    55	import type { FilterStats, ContaminationAuditRecord } from '../lib/content-filter';
    56	import {
    57	  generateImplementationSummary,
    58	  buildWeightedEmbeddingSections,
    59	  formatSummaryAsMarkdown,
    60	  extractFileChanges,
    61	} from '../lib/semantic-summarizer';
    62	import { EMBEDDING_DIM, MODEL_NAME } from '../lib/embeddings';
    63	import {
    64	  evaluateMemorySufficiency,
    65	} from '@spec-kit/shared/parsing/memory-sufficiency';
    66	import { validateMemoryTemplateContract } from '@spec-kit/shared/parsing/memory-template-contract';
    67	import { evaluateSpecDocHealth } from '@spec-kit/shared/parsing/spec-doc-health';
    68	import { extractTriggerPhrases } from '../lib/trigger-extractor';
    69	import {
    70	  indexMemory,
    71	  updateMetadataEmbeddingStatus,
    72	  type IndexingStatusValue,
    73	  type WorkflowIndexingStatus,
    74	} from './memory-indexer';
    75	import * as simFactory from '../lib/simulation-factory';
    76	import { reviewPostSaveQuality, printPostSaveReview, computeReviewScorePenalty } from './post-save-review';
    77	import {
    78	  emitMemoryMetric,
    79	  METRIC_M9_MEMORY_SAVE_DURATION_SECONDS,
    80	} from '../lib/memory-telemetry';
    81	import { loadCollectedData as loadCollectedDataFromLoader } from '../loaders/data-loader';
    82	import { applyTreeThinning } from './tree-thinning';
    83	import { structuredLog } from '../utils/logger';
    84	import type { FileChange, SessionData } from '../types/session-types';
    85	import type { ThinFileInput, ThinningResult } from './tree-thinning';
    86	import { getSourceCapabilities } from '../utils/source-capabilities';
    87	import { normalizeInputData } from '../utils/input-normalizer';
    88	import type { RawInputData } from '../utils/input-normalizer';
    89	import { resolveSaveMode, SaveMode } from '../types/save-mode';
    90	
    91	// Extracted modules
    92	import { stripWorkflowHtmlOutsideCodeFences, escapeLiteralAnchorExamples } from './content-cleaner';
    93	import {
    94	  buildMemoryTitle,
    95	  buildMemoryDashboardTitle,
    96	  extractSpecTitle,
    97	} from './title-builder';
    98	import {
    99	  normalizeFilePath,
   100	  resolveTreeThinningContent,
   101	  buildKeyFiles,
   102	} from './workflow-path-utils';
   103	import {
   104	  buildMemoryClassificationContext,
   105	  buildSessionDedupContext,
   106	  autoPopulateCausalLinks,
   107	  buildCausalLinksContext,
   108	  readExplicitMemoryText,
   109	  resolveParentSpec,
   110	  buildWorkflowMemoryEvidenceSnapshot,
   111	} from './memory-metadata';
   112	import {
   113	  injectQualityMetadata,
   114	  injectSpecDocHealthMetadata,
   115	  renderTriggerPhrasesYaml,
   116	  ensureMinTriggerPhrases,
   117	  ensureMinSemanticTopics,
   118	} from './frontmatter-editor';
   119	import { shouldIndexMemory, formatSufficiencyAbort } from './quality-gates';
   120	import { summarizeAuditCounts } from './workflow-accessors';
   121	import {
   122	  resolveAlignmentTargets,
   123	  matchesAlignmentTarget,
   124	  applyThinningToFileChanges,
   125	} from './alignment-validator';
   126	
   127	// ───────────────────────────────────────────────────────────────
   128	// 0. HELPERS
   129	// ───────────────────────────────────────────────────────────────
   130	
   131	// Phase 004 T011: Trigger phrase filter — suppresses path fragments, short tokens, and shingle subsets
   132	const TRIGGER_ALLOW_LIST = new Set(['rag', 'bm25', 'mcp', 'adr', 'jwt', 'api', 'cli', 'llm', 'ai']);
   133	
   134	function normalizeWorkflowTriggerKey(value: string): string {
   135	  return value.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
   136	}
   137	
   138	function filterTriggerPhrases(
   139	  phrases: string[],
   140	  manualPhraseKeys: Set<string> = new Set(),
   141	): string[] {
   142	  // Stage 1: Remove entries containing path separators (forward/backslash, multi-word path segments)
   143	  let filtered = phrases.filter(p => {
   144	    const trimmed = p.trim();
   145	    const comparisonKey = normalizeWorkflowTriggerKey(trimmed);
   146	    if (trimmed.includes('/') || trimmed.includes('\\')) return false;
   147	    if (manualPhraseKeys.has(comparisonKey)) {
   148	      return true;
   149	    }
   150	    if (/^\d{1,3}\s/.test(trimmed)) {
   151	      return false;
   152	    }
   153	    return true;
   154	  });
   155	
   156	  // Stage 2: Remove entries where every word is under 3 characters (unless in allow-list)
   157	  filtered = filtered.filter(p => {
   158	    const comparisonKey = normalizeWorkflowTriggerKey(p);
   159	    if (manualPhraseKeys.has(comparisonKey)) {
   160	      return true;
   161	    }
   162	    const words = p.trim().split(/\s+/);
   163	    if (words.length === 1 && words[0].length < 3 && !TRIGGER_ALLOW_LIST.has(words[0].toLowerCase())) {
   164	      return false;
   165	    }
   166	    // Multi-word: keep if at least one word >= 3 chars or any word is in allow-list
   167	    if (words.every(w => w.length < 3) && !words.some(w => TRIGGER_ALLOW_LIST.has(w.toLowerCase()))) {
   168	      return false;
   169	    }
   170	    return true;
   171	  });
   172	
   173	  // Stage 3: Remove n-gram shingle phrases that are substrings of longer retained phrases
   174	  const lowerPhrases = filtered.map((p) => p.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim());
   175	  filtered = filtered.filter((p, idx) => {
   176	    const lower = lowerPhrases[idx];
   177	    if (manualPhraseKeys.has(lower)) {
   178	      return true;
   179	    }
   180	    if (isAllowlistedShortProductName(p)) {
   181	      return true;
   182	    }
   183	    // Check if this phrase is a substring of any other (longer) phrase
   184	    for (let j = 0; j < lowerPhrases.length; j++) {
   185	      if (j !== idx && (
   186	        (lowerPhrases[j] === lower && j < idx)
   187	        || (lowerPhrases[j].length > lower.length && lowerPhrases[j].includes(lower))
   188	      )) {
   189	        return false;
   190	      }
   191	    }
   192	    return true;
   193	  });
   194	
   195	  return filtered;
   196	}
   197	
   198	/**
   199	 * Insert content after YAML frontmatter, preserving frontmatter at byte 0.
   200	 * Frontmatter is a block delimited by `---\n` at position 0 and a closing `---\n`.
   201	 * If no frontmatter is found, prepends the content (original behavior).
   202	 */
   203	function insertAfterFrontmatter(content: string, insertion: string): string {
   204	  if (!content.startsWith('---')) {
   205	    return insertion + content;
   206	  }
   207	  // Find the closing --- (skip the opening ---)
   208	  const closingIdx = content.indexOf('\n---', 3);
   209	  if (closingIdx === -1) {
   210	    return insertion + content;
   211	  }
   212	  // Find the end of the closing --- line
   213	  const afterClosing = content.indexOf('\n', closingIdx + 4);
   214	  const insertionPoint = afterClosing === -1 ? content.length : afterClosing + 1;
   215	  return content.slice(0, insertionPoint) + insertion + content.slice(insertionPoint);
   216	}
   217	
   218	type WorkflowRetryStats = {
   219	  queue_size: number;
   220	};
   221	
   222	type WorkflowRetryBatchResult = {
   223	  processed: number;
   224	  succeeded: number;
   225	  failed: number;
   226	};
   227	
   228	interface WorkflowRetryManagerAdapter {
   229	  getRetryStats(): WorkflowRetryStats;
   230	  processRetryQueue(limit?: number): Promise<WorkflowRetryBatchResult>;
   231	}
   232	
   233	const FALLBACK_RETRY_MANAGER: WorkflowRetryManagerAdapter = {
   234	  getRetryStats: () => ({ queue_size: 0 }),
   235	  processRetryQueue: async () => ({ processed: 0, succeeded: 0, failed: 0 }),
   236	};
   237	
   238	/**
   239	 * Shared helper for dynamic MCP-server API imports with consistent degradation.
   240	 * All call sites log warnings on failure and return the provided fallback.
   241	 */
   242	async function tryImportMcpApi(specifier: string): Promise<any | null> {
   243	  try {
   244	    return await import(specifier);
   245	  } catch (err: unknown) {
   246	    console.warn(`[workflow] Failed to import ${specifier}: ${err instanceof Error ? err.message : String(err)}`);
   247	    return null;
   248	  }
   249	}
   250	
   251	let workflowRetryManagerPromise: Promise<WorkflowRetryManagerAdapter> | null = null;
   252	let workflowRetryManagerLoadError: string | null = null;
   253	
   254	function isWorkflowRetryManagerAdapter(value: unknown): value is WorkflowRetryManagerAdapter {
   255	  if (!value || typeof value !== 'object') {
   256	    return false;
   257	  }
   258	
   259	  const candidate = value as Partial<WorkflowRetryManagerAdapter>;
   260	  return (

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '380,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1000,1085p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '300,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	
   301	  try {
   302	    return (db.prepare(`
   303	      SELECT m.*, wm.attention_score, wm.focus_count, wm.last_focused
   304	      FROM working_memory wm
   305	      JOIN memory_index m ON wm.memory_id = m.id
   306	      WHERE wm.session_id = ?
   307	      ORDER BY wm.attention_score DESC
   308	    `) as Database.Statement).all(sessionId) as Array<Record<string, unknown>>;
   309	  } catch (error: unknown) {
   310	    const msg = error instanceof Error ? error.message : String(error);
   311	    console.warn(`[working-memory] getSessionMemories error: ${msg}`);
   312	    return [];
   313	  }
   314	}
   315	
   316	function sessionExists(sessionId: string): boolean {
   317	  return getLatestSessionEventCounter(sessionId) !== null;
   318	}
   319	
   320	function getSessionEventCounter(sessionId: string): number {
   321	  const current = getLatestSessionEventCounter(sessionId);
   322	  return current === null ? 0 : current;
   323	}
   324	
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts | sed -n '340,590p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   340	
   341	  return parsed as Record<string, unknown>;
   342	}
   343	
   344	async function parseStructuredModeArguments(
   345	  mode: '--stdin' | '--json',
   346	  args: string[],
   347	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string>,
   348	): Promise<ParsedCliArguments> {
   349	  if (mode === '--stdin' && process.stdin.isTTY) {
   350	    console.error('--stdin requires piped input');
   351	    process.exit(1);
   352	  }
   353	
   354	  const rawJson = mode === '--stdin'
   355	    ? await stdinReader()
   356	    : args[1];
   357	
   358	  if (mode === '--json' && rawJson === undefined) {
   359	    throw new Error('--json requires an inline JSON string argument');
   360	  }
   361	
   362	  // Validation: empty --json is a user error, not a crash
   363	  if (mode === '--json' && (rawJson === undefined || rawJson.trim().length === 0)) {
   364	    console.log(JSON.stringify({ error: 'VALIDATION_ERROR', message: 'Empty --json input' }));
   365	    process.exit(1);
   366	  }
   367	
   368	  const payload = parseStructuredJson(rawJson ?? '', mode);
   369	  const explicitSpecFolderArg = args[mode === '--stdin' ? 1 : 2];
   370	  const explicitTarget = explicitSpecFolderArg ? resolveCliSpecFolderReference(explicitSpecFolderArg) || explicitSpecFolderArg : null;
   371	  const payloadTargetRaw = extractPayloadSpecFolder(payload);
   372	  const payloadTarget = payloadTargetRaw ? (resolveCliSpecFolderReference(payloadTargetRaw) || payloadTargetRaw) : null;
   373	  const specFolderArg = explicitTarget || payloadTarget;
   374	
   375	  if (!specFolderArg) {
   376	    throw new Error(`${mode} requires a target spec folder via an explicit CLI override or payload specFolder`);
   377	  }
   378	
   379	  return {
   380	    dataFile: null,
   381	    specFolderArg,
   382	    collectedData: {
   383	      ...payload,
   384	      _source: 'file',
   385	    },
   386	    sessionId: null,
   387	  };
   388	}
   389	
   390	// ───────────────────────────────────────────────────────────────
   391	// 5. CLI ARGUMENT PARSING
   392	// ───────────────────────────────────────────────────────────────
   393	async function parseArguments(
   394	  argv: string[] = process.argv.slice(2),
   395	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
   396	): Promise<ParsedCliArguments> {
   397	  // Extract --session-id <uuid> from argv before positional parsing
   398	  let sessionId: string | null = null;
   399	  const filteredArgv: string[] = [];
   400	  for (let i = 0; i < argv.length; i++) {
   401	    if (argv[i] === '--session-id') {
   402	      const candidate = argv[i + 1];
   403	      if (!candidate || candidate.startsWith('--') || candidate.trim().length === 0) {
   404	        throw new Error('--session-id requires a non-empty value');
   405	      }
   406	      sessionId = candidate.trim();
   407	      i++; // skip the value
   408	      continue;
   409	    }
   410	    filteredArgv.push(argv[i]);
   411	  }
   412	
   413	  const [primaryArg, secondaryArg] = filteredArgv;
   414	  if (!primaryArg) {
   415	    return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
   416	  }
   417	
   418	  if (primaryArg === '--stdin' || primaryArg === '--json') {
   419	    const structured = await parseStructuredModeArguments(primaryArg, filteredArgv, stdinReader);
   420	    return { ...structured, sessionId };
   421	  }
   422	
   423	  const resolvedSpecFolder = resolveCliSpecFolderReference(primaryArg);
   424	  if (resolvedSpecFolder) {
   425	    throw new Error(
   426	      'Direct spec folder mode is no longer supported. ' +
   427	      'Use structured JSON via --json, --stdin, or a JSON temp file.'
   428	    );
   429	  }
   430	
   431	  return {
   432	    dataFile: primaryArg,
   433	    specFolderArg: secondaryArg || null,
   434	    collectedData: null,
   435	    sessionId,
   436	  };
   437	}
   438	
   439	function validateArguments(): void {
   440	  const specFolderArg = CONFIG.SPEC_FOLDER_ARG;
   441	  if (!specFolderArg) return;
   442	
   443	  const validation = isValidSpecFolder(specFolderArg);
   444	
   445	  if (validation.warning) {
   446	    console.warn(`   Warning: ${validation.warning}`);
   447	  }
   448	
   449	  if (validation.valid) return;
   450	
   451	  // --- Subfolder support: before failing, try to find the folder as a child ---
   452	  const inputBaseName = path.basename(specFolderArg);
   453	  if (SPEC_FOLDER_PATTERN.test(inputBaseName)) {
   454	    // Input looks like a valid spec folder name but wasn't found at top level.
   455	    // Try finding it as a child folder inside any parent.
   456	    const resolved = findChildFolderSync(inputBaseName);
   457	    if (resolved) {
   458	      console.error(`   Resolved child folder "${inputBaseName}" → ${resolved}`);
   459	      CONFIG.SPEC_FOLDER_ARG = resolved;
   460	      return;
   461	    }
   462	    // FindChildFolder logs its own error for ambiguous matches
   463	  }
   464	
   465	  console.error(`\nError: Invalid spec folder format: ${specFolderArg}`);
   466	  console.error(`   Reason: ${validation.reason}`);
   467	  console.error('Expected format: ###-feature-name (e.g., "122-skill-standardization")\n');
   468	
   469	  const specsDir = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
   470	  if (fsSync.existsSync(specsDir)) {
   471	    try {
   472	      const available = fsSync.readdirSync(specsDir);
   473	      const matches = available.filter((n) => n.includes(path.basename(specFolderArg)) && SPEC_FOLDER_PATTERN.test(n));
   474	
   475	      if (matches.length > 0) {
   476	        console.error('Did you mean:');
   477	        matches.forEach((m) => console.error(`  - ${m}`));
   478	      } else {
   479	        // --- Subfolder support: multi-level deep scan as fallback ---
   480	        let deepMatches: string[] = [];
   481	        const targetBase = path.basename(specFolderArg);
   482	
   483	        for (const topEntry of available) {
   484	          const isSpec = SPEC_FOLDER_PATTERN.test(topEntry);
   485	          const isCategory = CATEGORY_FOLDER_PATTERN.test(topEntry);
   486	          if (!isSpec && !isCategory) continue;
   487	          const topPath = path.join(specsDir, topEntry);
   488	          try {
   489	            if (!fsSync.statSync(topPath).isDirectory()) continue;
   490	            const topChildren = fsSync.readdirSync(topPath);
   491	            // Search direct children of spec/category folders
   492	            const childMatches = topChildren.filter(
   493	              (c) => c.includes(targetBase) && SPEC_FOLDER_PATTERN.test(c)
   494	            );
   495	            for (const child of childMatches) {
   496	              deepMatches.push(`${topEntry}/${child}`);
   497	            }
   498	            // For category folders, also search grandchildren (category/parent/child)
   499	            if (isCategory) {
   500	              for (const midEntry of topChildren) {
   501	                if (!SPEC_FOLDER_PATTERN.test(midEntry)) continue;
   502	                const midPath = path.join(topPath, midEntry);
   503	                try {
   504	                  if (!fsSync.statSync(midPath).isDirectory()) continue;
   505	                  const grandChildren = fsSync.readdirSync(midPath);
   506	                  const gcMatches = grandChildren.filter(
   507	                    (c) => c.includes(targetBase) && SPEC_FOLDER_PATTERN.test(c)
   508	                  );
   509	                  for (const gc of gcMatches) {
   510	                    deepMatches.push(`${topEntry}/${midEntry}/${gc}`);
   511	                  }
   512	                } catch (_error: unknown) {
   513	                  if (_error instanceof Error) {
   514	                    /* skip unreadable dirs */
   515	                  }
   516	                }
   517	              }
   518	            }
   519	          } catch (_error: unknown) {
   520	            if (_error instanceof Error) {
   521	              /* skip unreadable dirs */
   522	            }
   523	          }
   524	        }
   525	
   526	        if (deepMatches.length > 0) {
   527	          console.error('Did you mean (in subfolders):');
   528	          deepMatches.forEach((m) => console.error(`  - ${m}`));
   529	        } else {
   530	          const allSpecs = available.filter((n) => SPEC_FOLDER_PATTERN.test(n) && !n.match(/^z_|archive/i))
   531	                                    .sort().reverse().slice(0, 5);
   532	          if (allSpecs.length) {
   533	            console.error('Available spec folders:');
   534	            allSpecs.forEach((f) => console.error(`  - ${f}`));
   535	          }
   536	        }
   537	      }
   538	    } catch (error: unknown) {
   539	      const errMsg = error instanceof Error ? error.message : String(error);
   540	      console.error('[generate-context] Failed to list spec folders:', errMsg);
   541	    }
   542	  }
   543	  console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
   544	  process.exit(1);
   545	}
   546	
   547	// ───────────────────────────────────────────────────────────────
   548	// 6. MAIN ENTRY POINT
   549	// ───────────────────────────────────────────────────────────────
   550	async function main(
   551	  argv: string[] = process.argv.slice(2),
   552	  stdinReader: (stdin?: NodeJS.ReadStream) => Promise<string> = readAllStdin,
   553	): Promise<void> {
   554	  console.error('Starting memory skill...\n');
   555	
   556	  try {
   557	    const parsed = await parseArguments(argv, stdinReader);
   558	    CONFIG.DATA_FILE = parsed.dataFile;
   559	    CONFIG.SPEC_FOLDER_ARG = parsed.specFolderArg;
   560	    validateArguments();
   561	
   562	    await runWorkflow({
   563	      dataFile: parsed.collectedData ? undefined : CONFIG.DATA_FILE ?? undefined,
   564	      specFolderArg: CONFIG.SPEC_FOLDER_ARG ?? undefined,
   565	      collectedData: parsed.collectedData ?? undefined,
   566	      loadDataFn: parsed.collectedData
   567	        ? undefined
   568	        : () => loadCollectedData({}),
   569	      collectSessionDataFn: collectSessionData,
   570	      sessionId: parsed.sessionId ?? undefined,
   571	    });
   572	  } catch (error: unknown) {
   573	    const errMsg = error instanceof Error ? error.message : String(error);
   574	    const isExpected = /Spec folder not found|No spec folders|specs\/ directory|retry attempts|Expected|Invalid JSON provided|requires a target spec folder|requires an inline JSON string|required a non-empty JSON object|JSON object payload|no longer supported|session-id requires/.test(errMsg);
   575	
   576	    if (isExpected) {
   577	      console.error(`\nError: ${errMsg}`);
   578	    } else {
   579	      console.error('Unexpected Error:', errMsg);
   580	      if (error instanceof Error) {
   581	        console.error(error.stack);
   582	      }
   583	    }
   584	    process.exit(1);
   585	  }
   586	}
   587	
   588	// ───────────────────────────────────────────────────────────────
   589	// 7. EXPORTS
   590	// ───────────────────────────────────────────────────────────────

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '625,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   625	async function runWorkflow(options: WorkflowOptions = {}): Promise<WorkflowResult> {
   626	  return withWorkflowRunLock(async () => {
   627	    const {
   628	      dataFile,
   629	      specFolderArg,
   630	      collectedData: preloadedData,
   631	      loadDataFn,
   632	      collectSessionDataFn,
   633	      silent = false,
   634	    } = options;
   635	
   636	    const hasDirectDataContext = (
   637	      dataFile !== undefined ||
   638	      preloadedData !== undefined ||
   639	      loadDataFn !== undefined
   640	    );
   641	    const activeDataFile = dataFile ?? (hasDirectDataContext ? null : CONFIG.DATA_FILE);
   642	    const activeSpecFolderArg = specFolderArg ?? (hasDirectDataContext ? null : CONFIG.SPEC_FOLDER_ARG);
   643	
   644	
   645	    const log = silent ? (): void => {} : console.log.bind(console);
   646	    const warn = silent ? (): void => {} : console.warn.bind(console);
   647	
   648	    log('Starting memory skill workflow...\n');
   649	    // Step 1: Load collected data
   650	    log('Step 1: Loading collected data...');
   651	
   652	    let collectedData: CollectedDataFull | null;
   653	    if (preloadedData) {
   654	      // Rec 1: Normalize JSON-derived preloaded data so sessionSummary → userPrompts,
   655	      // keyDecisions → _manualDecisions, filesChanged → FILES, etc.
   656	      const normalized = normalizeInputData(preloadedData as unknown as RawInputData);
   657	      // P1-001 fix: Explicit field projection instead of unsafe spread merge.
   658	      // Only overlay normalized fields that the normalizer actually produces,
   659	      // preserving preloadedData's non-normalized fields (e.g., _source, _sessionId).
   660	      const n = normalized as Record<string, unknown>;
   661	      collectedData = Object.assign({}, preloadedData, {
   662	        userPrompts: n.userPrompts ?? preloadedData.userPrompts,
   663	        observations: n.observations ?? preloadedData.observations,
   664	        recentContext: n.recentContext ?? preloadedData.recentContext,
   665	        FILES: n.FILES ?? preloadedData.FILES,
   666	        SPEC_FOLDER: n.SPEC_FOLDER ?? preloadedData.SPEC_FOLDER,
   667	        _manualDecisions: n._manualDecisions ?? preloadedData._manualDecisions,
   668	        _manualTriggerPhrases: n._manualTriggerPhrases ?? preloadedData._manualTriggerPhrases,
   669	        TECHNICAL_CONTEXT: n.TECHNICAL_CONTEXT ?? preloadedData.TECHNICAL_CONTEXT,
   670	        title: n.title ?? preloadedData.title,
   671	        description: n.description ?? preloadedData.description,
   672	        causalLinks: n.causalLinks ?? preloadedData.causalLinks,
   673	        causal_links: n.causal_links ?? preloadedData.causal_links,
   674	        importanceTier: n.importanceTier ?? preloadedData.importanceTier,
   675	        contextType: n.contextType ?? preloadedData.contextType,
   676	        projectPhase: n.projectPhase ?? preloadedData.projectPhase,
   677	        saveMode: n.saveMode ?? preloadedData.saveMode,
   678	      }) as CollectedDataFull;
   679	      log('   Using pre-loaded data (normalized)');
   680	    } else if (loadDataFn) {
   681	      // F-22: Guard loadDataFn result with explicit null check
   682	      collectedData = (await loadDataFn()) || null;
   683	      log('   Loaded via custom function');
   684	    } else {
   685	      collectedData = await loadCollectedDataFromLoader({
   686	        dataFile: activeDataFile,
   687	        specFolderArg: activeSpecFolderArg,
   688	      });
   689	      log(`   Loaded from ${collectedData?._isSimulation ? 'simulation' : 'data source'}`);
   690	    }
   691	
   692	    if (!collectedData) {
   693	      throw new Error('No data available - provide dataFile, collectedData, or loadDataFn');
   694	    }
   695	    collectedData.saveMode = resolveSaveMode(collectedData);
   696	
   697	    // Step 1.5: Captured-session alignment check
   698	    // When no JSON data file was provided, data comes from the active OpenCode session.
   699	    // Verify the captured content relates to the target spec folder to prevent
   700	    // Cross-spec contamination (e.g., session working on spec A saved to spec B).
   701	    const isCapturedSessionMode = collectedData.saveMode === SaveMode.Capture;
   702	    if (isCapturedSessionMode && activeSpecFolderArg && (collectedData.observations || collectedData.FILES)) {
   703	      const alignmentTargets = await resolveAlignmentTargets(activeSpecFolderArg);
   704	      const specAffinityTargets = buildSpecAffinityTargets(activeSpecFolderArg);
   705	      const specAffinity = evaluateCollectedDataSpecAffinity(collectedData, specAffinityTargets);
   706	
   707	      if (!specAffinity.hasAnchor) {
   708	        // Q1: Downgrade Block A from hard abort to warning when spec folder was explicitly
   709	        // provided via CLI argument. The user's explicit intent overrides the anchor check.
   710	        // Blocks B and C (file-path overlap) remain as hard blocks for safety.
   711	        const alignMsg = `ALIGNMENT_WARNING: Captured-session content matched the workspace but not the target spec folder "${activeSpecFolderArg}". ` +
   712	          `No spec-specific anchors were found beyond workspace identity (matched files: ${specAffinity.matchedFileTargets.length}, ` +
   713	          `matched phrases: ${specAffinity.matchedPhrases.length}, matched spec id: ${specAffinity.matchedSpecId ? 'yes' : 'no'}). ` +
   714	          `Proceeding because spec folder was explicitly provided via CLI argument.`;
   715	        warn(`   ${alignMsg}`);
   716	      }
   717	
   718	      const allFilePaths = (collectedData.observations || [])
   719	        .flatMap((obs: { files?: string[] }) => obs.files || [])
   720	        .concat((collectedData.FILES || []).map((f: { FILE_PATH?: string; path?: string }) => f.FILE_PATH || f.path || ''));
   721	
   722	      const totalPaths = allFilePaths.length;
   723	      if (totalPaths > 0 && (alignmentTargets.keywordTargets.length > 0 || alignmentTargets.fileTargets.length > 0)) {
   724	        const relevantPaths = allFilePaths.filter((fp: string) => {
   725	          return matchesAlignmentTarget(fp, alignmentTargets);
   726	        });
   727	        const overlapRatio = relevantPaths.length / totalPaths;
   728	        // RC-4: Raised from 0.05 to 0.15 — 5% threshold let mostly-foreign content through
   729	        if (overlapRatio < 0.15) {
   730	          const alignMsg = `ALIGNMENT_BLOCK: Only ${(overlapRatio * 100).toFixed(0)}% of captured file paths relate to spec folder "${activeSpecFolderArg}". ` +
   731	            `The active session appears to be working on a different task (alignment keywords: [${alignmentTargets.keywordTargets.join(', ')}], ` +
   732	            `total paths: ${totalPaths}, matching: ${relevantPaths.length}). ` +
   733	            `Aborting to prevent cross-spec contamination. To force, pass data via JSON file.`;
   734	          warn(`   ${alignMsg}`);
   735	          throw new Error(alignMsg);
   736	        }
   737	      }
   738	    }
   739	    log();
   740	
   741	    // Step 2: Detect spec folder with context alignment
   742	    log('Step 2: Detecting spec folder...');
   743	    const specFolder: string = await detectSpecFolder(collectedData, {
   744	      specFolderArg: activeSpecFolderArg,
   745	    });
   746	    const specsDir: string = findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs');
   747	    const normalizedSpecFolder = path.resolve(specFolder).replace(/\\/g, '/');
   748	    const candidateSpecsDirs = Array.from(new Set([
   749	      specsDir,
   750	      ...getSpecsDirectories(),
   751	      path.join(CONFIG.PROJECT_ROOT, 'specs'),
   752	      path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
   753	    ]));
   754	
   755	    let specFolderName = '';
   756	    for (const candidateRoot of candidateSpecsDirs) {
   757	      const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
   758	      const relative = path.relative(normalizedRoot, normalizedSpecFolder).replace(/\\/g, '/');
   759	      if (
   760	        relative &&

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/core/workflow.ts | sed -n '1048,1088p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1048	      SUMMARY: filteredSummary,
  1049	      observations: filteredObservations,
  1050	      // P0-1: Force CLI-resolved spec folder into collectedData so all parallel
  1051	      // extractors (decisions, diagrams, conversations) see the authoritative value
  1052	      SPEC_FOLDER: specFolderName || collectedData.SPEC_FOLDER,
  1053	    };
  1054	    collectedDataWithNarrative._narrativeObservations = filteredNarrativeObservations;
  1055	
  1056	    const narrativeObservations = Array.isArray(
  1057	      filteredNarrativeObservations
  1058	    )
  1059	      ? filteredNarrativeObservations || []
  1060	      : (collectedData.observations || []);
  1061	    const narrativeCollectedData: CollectedDataFull = {
  1062	      ...collectedData,
  1063	      observations: narrativeObservations,
  1064	    };
  1065	
  1066	    const [sessionData, conversations, decisions, diagrams, workflowData] = await Promise.all([
  1067	    (async () => {
  1068	      log('   Collecting session data...');
  1069	      const result = await sessionDataFn(narrativeCollectedData, specFolderName, options.sessionId);
  1070	      log('   Session data collected');
  1071	      return result;
  1072	    })(),
  1073	    (async () => {
  1074	      log('   Extracting conversations...');
  1075	      const result = await extractConversations(collectedData as Parameters<typeof extractConversations>[0]);
  1076	      log(`   Found ${result.MESSAGES.length} messages`);
  1077	      return result;
  1078	    })(),
  1079	    (async () => {
  1080	      log('   Extracting decisions...');
  1081	      const result = await extractDecisions(collectedData as Parameters<typeof extractDecisions>[0]);
  1082	      log(`   Found ${result.DECISIONS.length} decisions`);
  1083	      return result;
  1084	    })(),
  1085	    (async () => {
  1086	      log('   Extracting diagrams...');
  1087	      const result = await extractDiagrams(collectedData as Parameters<typeof extractDiagrams>[0]);
  1088	      log(`   Found ${result.DIAGRAMS.length} diagrams`);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts | sed -n '1188,1325p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1188	async function collectSessionData(
  1189	  collectedData: CollectedDataFull | null,
  1190	  specFolderName: string | null = null,
  1191	  explicitSessionId?: string,
  1192	): Promise<SessionData> {
  1193	  const now = new Date();
  1194	
  1195	  // F-24: Consolidated spec-folder resolution helper
  1196	  // CODEX2-004: Preserve the winning specs root from phase 1 for use in phase 2
  1197	  let folderName: string = specFolderName || '';
  1198	  let resolvedSpecsRoot: string | null = null;
  1199	  const candidateSpecsDirs = Array.from(new Set([
  1200	    findActiveSpecsDir() || path.join(CONFIG.PROJECT_ROOT, 'specs'),
  1201	    ...getSpecsDirectories(),
  1202	    path.join(CONFIG.PROJECT_ROOT, 'specs'),
  1203	    path.join(CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
  1204	  ]));
  1205	  if (!folderName) {
  1206	    const detectedFolder = await detectSpecFolder();
  1207	    const normalizedDetected = path.resolve(detectedFolder).replace(/\\/g, '/');
  1208	
  1209	    const resolution = resolveSpecFolderRelative(normalizedDetected, candidateSpecsDirs);
  1210	    folderName = resolution.relative;
  1211	    resolvedSpecsRoot = resolution.matchedRoot;
  1212	  } else {
  1213	    const resolution = resolveProvidedSpecFolder(folderName, candidateSpecsDirs);
  1214	    folderName = resolution.relative;
  1215	    resolvedSpecsRoot = resolution.matchedRoot;
  1216	  }
  1217	  const dateOnly: string = formatTimestamp(now, 'date-dutch');
  1218	  const timeOnly: string = formatTimestamp(now, 'time-short');
  1219	
  1220	  // RECOVERY-ONLY: This fallback is unreachable in JSON-primary mode (data-loader throws before reaching here).
  1221	  if (!collectedData) {
  1222	    console.log('   Warning: Using simulation data');
  1223	    return getSimFactory().createSessionData({
  1224	      specFolder: folderName,
  1225	      channel: getChannel(),
  1226	      skillVersion: CONFIG.SKILL_VERSION
  1227	    });
  1228	  }
  1229	
  1230	  const data: CollectedDataFull = { ...collectedData };
  1231	  const sessionId: string = (
  1232	    typeof explicitSessionId === 'string' && explicitSessionId.trim().length > 0
  1233	      ? explicitSessionId.trim()
  1234	      : generateSessionId()
  1235	  );
  1236	  const channel: string = getChannel();
  1237	  const sessionInfo = data.recentContext?.[0] || {};
  1238	  let observations: Observation[] = data.observations || [];
  1239	  if (observations.length > CONFIG.MAX_OBSERVATIONS) {
  1240	    // Prioritize followup observations (nextSteps) before truncation
  1241	    const followups = observations.filter(o => o.type === 'followup');
  1242	    const others = observations.filter(o => o.type !== 'followup');
  1243	    observations = [...followups, ...others];
  1244	    structuredLog('warn', 'observation_truncation_applied', {
  1245	      specFolder: data.SPEC_FOLDER || folderName,
  1246	      sessionId,
  1247	      channel,
  1248	      originalCount: observations.length,
  1249	      retainedCount: CONFIG.MAX_OBSERVATIONS,
  1250	    });
  1251	  }
  1252	  observations = observations.slice(0, CONFIG.MAX_OBSERVATIONS);
  1253	  const userPrompts: UserPrompt[] = data.userPrompts || [];
  1254	  const messageCount: number = userPrompts.length || 0;
  1255	
  1256	  if (shouldAutoSave(messageCount)) {
  1257	    console.log(`\n   Context Budget: ${messageCount} messages reached. Auto-saving context...\n`);
  1258	  }
  1259	
  1260	  const duration: string = calculateSessionDuration(userPrompts, now);
  1261	  let FILES: FileChange[] = extractFilesFromData(data, observations);
  1262	  if (FILES.length === 0) {
  1263	    const structuredFileCandidates = extractStructuredFileCandidates(data);
  1264	    if (structuredFileCandidates.length > 0) {
  1265	      FILES = structuredFileCandidates.map((filePath) => ({
  1266	        FILE_PATH: filePath,
  1267	        DESCRIPTION: 'Modified during session',
  1268	        ACTION: 'Modified',
  1269	        MODIFICATION_MAGNITUDE: 'unknown',
  1270	      }));
  1271	    } else {
  1272	      FILES = collectGitStatusFallbackFiles();
  1273	    }
  1274	  }
  1275	  const structuredFileCount = extractStructuredFileCandidates(data).length;
  1276	  let capturedFileCount = Math.max(structuredFileCount, countDistinctFilePaths(
  1277	    FILES,
  1278	    (file) => file._provenance !== 'git' && file._provenance !== 'spec-folder',
  1279	  ));
  1280	  const filesystemDerivedCount = Math.max(structuredFileCount, countDistinctFilePaths(
  1281	    FILES,
  1282	    (file) => file._provenance === 'git' || file._provenance === 'spec-folder',
  1283	  ));
  1284	  const gitChangedFileCount = Math.max(structuredFileCount, countDistinctFilePaths(
  1285	    FILES,
  1286	    (file) => file._provenance === 'git',
  1287	  ));
  1288	  if (capturedFileCount === 0 && filesystemDerivedCount > 0) {
  1289	    capturedFileCount = filesystemDerivedCount;
  1290	  }
  1291	  const filesystemFileCount = filesystemDerivedCount > 0 ? filesystemDerivedCount : capturedFileCount;
  1292	  // Persist source-session fields as metadata only; SaveMode governs behavior elsewhere.
  1293	  const sourceTranscriptPath = typeof data._sourceTranscriptPath === 'string' ? data._sourceTranscriptPath : '';
  1294	  const sourceSessionId = typeof data._sourceSessionId === 'string'
  1295	    ? data._sourceSessionId
  1296	    : typeof data._sessionId === 'string'
  1297	      ? data._sessionId
  1298	      : '';
  1299	  const sourceSessionCreated = typeof data._sourceSessionCreated === 'number' && Number.isFinite(data._sourceSessionCreated)
  1300	    ? data._sourceSessionCreated
  1301	    : 0;
  1302	  const sourceSessionUpdated = typeof data._sourceSessionUpdated === 'number' && Number.isFinite(data._sourceSessionUpdated)
  1303	    ? data._sourceSessionUpdated
  1304	    : 0;
  1305	
  1306	  const decisionPropositions = collectDecisionPropositions(data, observations);
  1307	  const seenOutcomePropositions = new Set<string>();
  1308	  const OUTCOMES: OutcomeEntry[] = [];
  1309	  for (const observation of observations) {
  1310	    const outcomeText = (observation.title || observation.narrative?.substring(0, 300) || '').trim();
  1311	    if (!outcomeText) {
  1312	      continue;
  1313	    }
  1314	
  1315	    const normalizedOutcome = normalizeProposition(outcomeText);
  1316	    if (!normalizedOutcome || seenOutcomePropositions.has(normalizedOutcome) || decisionPropositions.has(normalizedOutcome)) {
  1317	      continue;
  1318	    }
  1319	
  1320	    seenOutcomePropositions.add(normalizedOutcome);
  1321	    OUTCOMES.push({
  1322	      OUTCOME: outcomeText,
  1323	      TYPE: detectObservationType(observation),
  1324	    });
  1325	

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/context-server.ts | sed -n '755,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc 'rg -n "mem_context|mem_session_start|mem_session_end|mem_session_summary|ProfileAgent|ProfileAdmin|tool profiles|capture passive|topic_key|FormatContext|CreateSession|EndSession" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:59:| `mem_suggest_topic_key` | Suggest a stable `topic_key` for evolving topics before saving |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:61:| `mem_session_summary` | Save end-of-session summary |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:62:| `mem_context` | Get recent context from previous sessions |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:67:| `mem_session_start` | Register a session start |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:68:| `mem_session_end` | Mark a session as completed |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:89:- `mem_save` also supports `topic_key`; with a topic key, saves become upserts (same project+scope+topic updates the existing memory)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:94:- `mem_search`, `mem_context`, recent lists, and timeline ignore soft-deleted observations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:103:1. mem_suggest_topic_key(type="architecture", title="Auth architecture")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:104:2. mem_save(..., topic_key="architecture-auth-architecture")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:105:3. Later change on same topic -> mem_save(..., same topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:111:`mem_suggest_topic_key` now applies a family heuristic for consistency across sessions:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:78:| `mem_suggest_topic_key` | Stable key for evolving topics |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:80:| `mem_session_summary` | End-of-session save |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:81:| `mem_context` | Recent session context |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:86:| `mem_session_start` | Register session start |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md:87:| `mem_session_end` | Mark session complete |

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '821,875p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"completeSession\\(|saveSessionState\\(|resolveTrustedSession\\(|buildStructuralBootstrapContract\\(|getSessionSnapshot\\(|updateState\\(|sessionSummary\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts -g '*.{ts,js}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:767:    const snap = getSessionSnapshot();
.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1001:            const snapshot = getSessionSnapshot();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:212:    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:185:    extractedAt: state.sessionSummary?.extractedAt ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:195:  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1352:  const sessionStateResult = sessionManager.saveSessionState(effectiveSessionId, {
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
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:102:  const structuralContext = buildStructuralBootstrapContract('session_health');
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
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385:function resolveTrustedSession(
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1020:function saveSessionState(sessionId: string, state: SessionStateInput = {}): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079:function completeSession(sessionId: string): InitResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1359:  const saveResult = saveSessionState(sessionId, state);
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:84:    sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:639:    const payloadSummary = (collectedData.sessionSummary || '').trim();
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:659:        message: `"${savedTitle}" — should reflect sessionSummary`,
.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:857:          fix: `Replace with sessionSummary: "${payloadSummary.substring(0, 100)}"`,
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:27:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:104:    currentSession.sessionSummary,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:136:export function getSessionSnapshot(): SessionSnapshot {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:210:export function buildStructuralBootstrapContract(
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:654:      // Rec 1: Normalize JSON-derived preloaded data so sessionSummary → userPrompts,
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:849:      // Phase 002 T010: Clean _JSON_SESSION_SUMMARY (raw sessionSummary title candidate)
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1230:      sessionData._JSON_SESSION_SUMMARY || '',  // RC1: raw JSON sessionSummary as first candidate
.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1966:          sessionSummary: collectedData.sessionSummary || jsonSessionSummary,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:14:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:48:        sessionSummary: 'Meaningful implementation session',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:93:      sessionSummary: 'Completed runtime hardening.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:326:      sessionSummary: 'Stabilized delegated memory save runtime behavior.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:406:      sessionSummary: 'Session with no next steps.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:417:      sessionSummary: 'Both fields present.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:432:      sessionSummary: 'Edge case: empty first step.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:446:      sessionSummary: 'Critical save should keep the caller-provided tier.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:462:      sessionSummary: 'Temporary save should retain the snake_case override.',
.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts:478:      sessionSummary: 'Architecture work should still auto-detect as critical.',
.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:290:      sessionSummary: 'Test session summary',
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:151:  sessionSummary?: string;
.opencode/skill/system-spec-kit/scripts/types/session-types.ts:573:  /** RC1: Raw sessionSummary from JSON payload, used as preferred title candidate */
.opencode/skill/system-spec-kit/scripts/tests/trigger-phrase-no-prose-bigrams.vitest.ts:80:          sessionSummary: 'Implemented the detector provenance taxonomy with additive edge evidence and bounded metadata cleanup.',
.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:79:      sessionSummary: 'Implemented the render-layer fixes for canonical sources, trigger phrases, evidence bullets, phase capture, and score naming.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:78:    sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:257:        sessionSummary: 'Placeholder contamination should be caught.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:278:        sessionSummary: 'Unsanitized trigger phrases should be caught.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:309:        sessionSummary: 'Continuation saves should carry supersedes lineage.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:329:        sessionSummary: 'Duplicate trigger phrases should be caught.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:381:        sessionSummary: 'This broken overview proves the reviewer catches truncation when the rendered text still ends mid token and falls back to the old ASCII ellipsis shape instead of the boundary safe contract that Phase 1 pinned down for JSON mode saves.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:403:        sessionSummary: 'Composite blocker should reject one HIGH plus two MEDIUM findings.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr9.test.ts:442:        sessionSummary: 'Healthy reviewer contract baseline for PR-9.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:22:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:112:        sessionSummary: 'Importance-tier drift should be detected after save.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr3.test.ts:149:        sessionSummary: 'Matching tiers with inline comments should still pass.',
.opencode/skill/system-spec-kit/mcp_server/tests/startup-brief.vitest.ts:33:    sessionSummary: {
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:12:    sessionSummary: 'Test session',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:166:      sessionSummary: 'Test',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:174:      sessionSummary: 'Test',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:192:      sessionSummary: 'Test',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:201:      sessionSummary: 'Slow-path metadata propagation test.',
.opencode/skill/system-spec-kit/scripts/tests/input-normalizer-unit.vitest.ts:280:      sessionSummary: 'Patched the fast-path normalizer and verified the save flow end to end.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-trigger.test.ts:36:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:111:      sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:123:        sessionSummary: 'Structured stdin payload should not override an explicit CLI target.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:137:      sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:149:        sessionSummary: 'Inline JSON should resolve its own spec folder when no override exists.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:163:      sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:182:        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:191:        sessionSummary: 'Equivalent structured payloads should resolve identically across stdin and inline JSON modes.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:231:      sessionSummary: 'Missing target should fail before workflow execution.',
.opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts:246:      sessionSummary: 'Invalid target should fail validation before workflow execution.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:92:          sessionSummary: 'Continuation verification for explicit causal links.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:113:          sessionSummary: 'Continuation verification for explicit causal links.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:186:        sessionSummary: 'Regular implementation summary with no lineage signal.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:216:          sessionSummary: 'Continuation request with two equally recent predecessors.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-d5-continuation-and-causal-links.vitest.ts:232:          sessionSummary: 'Continuation request with two equally recent predecessors.',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:125:        sessionSummary: 'Verified final output and captured the final session summary.',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:153:        sessionSummary: 'Wrapped up the current implementation pass.',
.opencode/skill/system-spec-kit/scripts/tests/collect-session-data.vitest.ts:174:        sessionSummary: 'Wrapped up the release work and recorded the final follow-through items.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:16:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:26:    const result = truncateOnWordBoundary(fixture.sessionSummary, 500);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:28:    const nextChar = fixture.sessionSummary.charAt(keptText.length);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:31:    expect(fixture.sessionSummary.length).toBeGreaterThan(600);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:34:    expect(fixture.sessionSummary.startsWith(keptText)).toBe(true);
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:36:    expect(collectSessionDataSource).toContain('truncateOnWordBoundary(data.sessionSummary, 500)');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase4-pr7.test.ts:130:          sessionSummary: 'Extended continuation run for the lineage fixture.',
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:408:      const result = sessionManager.saveSessionState('session-state-save', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:440:      sessionManager.saveSessionState('active-a', { currentTask: 'A' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:441:      sessionManager.saveSessionState('active-b', { currentTask: 'B' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:451:      sessionManager.saveSessionState('active-only', { currentTask: 'still running' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:452:      sessionManager.saveSessionState('completed-only', { currentTask: 'already done' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:453:      sessionManager.completeSession('completed-only');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:463:      sessionManager.saveSessionState('list-a', { specFolder: 'specs/A', currentTask: 'recover A' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:464:      sessionManager.saveSessionState('list-b', { specFolder: 'specs/B', currentTask: 'recover B' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:465:      sessionManager.saveSessionState('list-c', { specFolder: 'specs/C', currentTask: 'completed C' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:466:      sessionManager.completeSession('list-c');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:478:      sessionManager.saveSessionState('recover-me', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:601:      const result = sessionManager.saveSessionState('persist-all', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:627:      sessionManager.saveSessionState('json-state', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:638:      sessionManager.saveSessionState('timestamped', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:652:      sessionManager.saveSessionState('complete-transition', { currentTask: 'finish work' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:654:      const result = sessionManager.completeSession('complete-transition');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:664:      sessionManager.saveSessionState('interrupt-transition', { currentTask: 'simulate crash' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:675:      sessionManager.saveSessionState('interrupt-active', { currentTask: 'active' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:676:      sessionManager.saveSessionState('interrupt-completed', { currentTask: 'completed' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:677:      sessionManager.completeSession('interrupt-completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:688:      sessionManager.saveSessionState('recover-fields', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:721:      sessionManager.saveSessionState('recover-nested', {
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:741:      sessionManager.saveSessionState('flag-interrupted', { currentTask: 'interrupted' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:751:      sessionManager.saveSessionState('flag-completed', { currentTask: 'completed' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:752:      sessionManager.completeSession('flag-completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:769:      sessionManager.saveSessionState('flag-reactivate', { currentTask: 'reactivate' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:780:      sessionManager.saveSessionState('recoverable-a', { specFolder: 'specs/A', currentTask: 'A' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:781:      sessionManager.saveSessionState('recoverable-b', { specFolder: 'specs/B', currentTask: 'B' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:782:      sessionManager.saveSessionState('recoverable-c', { specFolder: 'specs/C', currentTask: 'C' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:783:      sessionManager.completeSession('recoverable-c');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:792:      sessionManager.saveSessionState('exclude-completed', { currentTask: 'completed' });
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:793:      sessionManager.completeSession('exclude-completed');
.opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:802:      sessionManager.saveSessionState('field-check', {
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:72:          sessionSummary: 'Patched the structured memory-save schema so explicit authored metadata wins.',
.opencode/skill/system-spec-kit/scripts/tests/memory-save-title-description-override.vitest.ts:120:          sessionSummary: 'Implemented a fallback save path for the title builder when explicit title is absent.',
.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts:102:    sessionSummary: {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:26:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:29:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:38:    updateState(sessionId, { lastSpecFolder: 'specs/test' });
.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts:39:    updateState(sessionId, {
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
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:10:      sessionSummary: 'Completed the render-layer fixes and verified the final save output.',
.opencode/skill/system-spec-kit/scripts/tests/phase-status-from-payload.vitest.ts:43:      sessionSummary: 'The packet still has working-tree edits to finish.',
.opencode/skill/system-spec-kit/scripts/tests/causal-links-auto-populate.vitest.ts:92:          sessionSummary: 'Implemented the follow-on runtime after the planning save.',
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:19:      sessionSummary: 'Verified structured file capture counts.',
.opencode/skill/system-spec-kit/scripts/tests/file-capture-structured-mode.vitest.ts:39:      sessionSummary: 'Verified fallback git capture counts.',
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:97:        sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:117:      const state = updateState('new-session', { lastSpecFolder: 'specs/new' });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:128:      updateState(testSessionId, { lastSpecFolder: 'specs/first' });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:129:      const updated = updateState(testSessionId, { pendingCompactPrime: { payload: 'test', cachedAt: new Date().toISOString() } });
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:150:          sessionSummary: { text: 'Summary', extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts:201:          sessionSummary: null,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:37:  sessionSummary: string;
.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts:32:    sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:25:      updateState(testSessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:39:      updateState(testSessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:42:      updateState(testSessionId, {
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:73:  sessionSummary: string;
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase2-pr4.test.ts:222:      expect(rendered).toContain(fixture.sessionSummary);
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:53:    const contract = buildStructuralBootstrapContract('auto-prime');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:80:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:103:    const contract = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:123:    const contract = buildStructuralBootstrapContract('session_health');
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:142:      const contract = buildStructuralBootstrapContract(surface);
.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts:164:    const contract = buildStructuralBootstrapContract('session_bootstrap');
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:412:        sessionSummary: 'Phase 6 mirror drift reviewer fixture.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:434:        sessionSummary: 'Phase 6 clean mirror reviewer fixture.',
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:466:          sessionSummary: `Trigger fixture for ${expectation.checkId}.`,
.opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase6-template.test.ts:487:        sessionSummary: 'Clean Phase 6 duplication reviewer fixture.',
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:15:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:33:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:43:    updateState(sessionId, { lastSpecFolder: 'specs/a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts:44:    updateState(sessionId, { lastSpecFolder: 'specs/b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:103:  describe('T302-GAP2a: completeSession() clears working memory', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:104:    it('T302-04 to T302-06: completeSession() clears working memory entries', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:116:      sm.saveSessionState(sessionId, { currentTask: 'testing' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:119:      const result = sm.completeSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:273:      sm.saveSessionState('trusted-session', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:278:      const result = sm.resolveTrustedSession('trusted-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:288:      sm.saveSessionState('trusted-session-without-identity', { currentTask: 'tracked by server' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:290:      const result = sm.resolveTrustedSession('trusted-session-without-identity');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:298:      sm.saveSessionState('bound-session', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:304:      const result = sm.resolveTrustedSession('bound-session', { tenantId: 'tenant-b', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:312:      sm.saveSessionState('bound-session-missing-user', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:317:      const result = sm.resolveTrustedSession('bound-session-missing-user', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:328:      const result = sm.resolveTrustedSession('invented-session');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:336:      const result = sm.resolveTrustedSession(null);
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:394:      const r = sm.saveSessionState('save-1', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:422:      sm.saveSessionState('save-2', { currentTask: 'task A', specFolder: 'specs/002' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:424:      sm.saveSessionState('save-2', { lastAction: 'did something' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:431:      const r = sm.saveSessionState('', {});
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:442:      sm.saveSessionState('complete-1', { currentTask: 'finishing up' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:443:      const r = sm.completeSession('complete-1');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:450:      const r = sm.completeSession('');
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:461:      sm.saveSessionState('reset-1', { currentTask: 'task A' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:462:      sm.saveSessionState('reset-2', { currentTask: 'task B' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:463:      sm.completeSession('reset-2'); // This one is completed, should NOT be interrupted
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:490:      sm.saveSessionState('recover-1', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:527:      sm.saveSessionState('recover-bound', {
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:551:      sm.saveSessionState('int-1', { specFolder: 'specs/A', currentTask: 'task A', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:552:      sm.saveSessionState('int-2', { specFolder: 'specs/B', currentTask: 'task B', tenantId: 'tenant-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:553:      sm.saveSessionState('int-3', { specFolder: 'specs/C', currentTask: 'task C' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:554:      sm.completeSession('int-3'); // Won't be interrupted
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:571:      sm.saveSessionState('int-scope-a', { currentTask: 'task A', tenantId: 'tenant-a', userId: 'user-a' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:572:      sm.saveSessionState('int-scope-b', { currentTask: 'task B', tenantId: 'tenant-b', userId: 'user-b' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:573:      sm.saveSessionState('int-unbound', { currentTask: 'task C' });
.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:638:        sm.saveSessionState('write-md-1', {
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:34:        sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:95:        sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:476:  const structuralContext = buildStructuralBootstrapContract('auto-prime');
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:119:    updateState('session-A', { lastSpecFolder: '/specs/a/' });
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:120:    updateState('session-B', { lastSpecFolder: '/specs/b/' });
.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:135:    updateState('session-expired', {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:393:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:416:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:34:  sessionSummary: { text: string; extractedAt: string } | null;
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:221:export function updateState(sessionId: string, patch: Partial<HookState>): HookState {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:228:    sessionSummary: null,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:63:  const summary = state?.sessionSummary?.text?.trim();
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:77:    sessionSummary: summary,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:124:  updateState(sessionId, patch);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:184:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:303:      sessionSummary: { text, extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:158:  updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:100:      updateState(sessionId, { lastSpecFolder: detectedSpec });
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:108:    updateState(sessionId, {
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-stop.ts:109:      sessionSummary: { text, extractedAt: new Date().toISOString() },
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:189:  if (state.sessionSummary?.text) {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts:190:    parts.push(`Summary: ${truncateInline(state.sessionSummary.text, SUMMARY_MAX_CHARS)}`);

codex
I have enough raw material for the main comparison, and I’m doing one last pass on the “startup continuity” pieces so I don’t miss where our system already compensates for not having explicit start/end MCP verbs. After that I’ll synthesize only genuinely new lifecycle findings, not repeat the prior topic-key/search ones.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '150,210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts | sed -n '136,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   136	export function getSessionSnapshot(): SessionSnapshot {
   137	  const now = Date.now();
   138	
   139	  // Metrics (safe — in-memory only)
   140	  let specFolder: string | null = null;
   141	  let currentTask: string | null = null;
   142	  try {
   143	    const metrics = getSessionMetrics() as ReturnType<typeof getSessionMetrics> & {
   144	      currentTask?: unknown;
   145	    };
   146	    specFolder = metrics.currentSpecFolder;
   147	    if (typeof metrics.currentTask === 'string' || metrics.currentTask === null) {
   148	      currentTask = metrics.currentTask;
   149	    }
   150	  } catch { /* metrics unavailable */ }
   151	
   152	  // Graph freshness
   153	  const graphFreshness = resolveGraphFreshness();
   154	
   155	  // CocoIndex availability
   156	  let cocoIndexAvailable = false;
   157	  try {
   158	    cocoIndexAvailable = isCocoIndexAvailable();
   159	  } catch { /* unavailable */ }
   160	
   161	  // Quality score
   162	  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
   163	  try {
   164	    const qs = computeQualityScore();
   165	    sessionQuality = qs.level;
   166	  } catch { /* unknown */ }
   167	
   168	  // Last tool call
   169	  let lastToolCallAgoMs: number | null = null;
   170	  try {
   171	    const last = getLastToolCallAt();
   172	    if (last !== null) lastToolCallAgoMs = now - last;
   173	  } catch { /* null */ }
   174	
   175	  // Priming status
   176	  let primed = false;
   177	  try {
   178	    const primingSessionId = getLastActiveSessionId();
   179	    primed = primingSessionId ? isSessionPrimed(primingSessionId) : false;
   180	  } catch { /* not primed */ }
   181	
   182	  // Build routing recommendation
   183	  const routingParts: string[] = [];
   184	  if (cocoIndexAvailable) {
   185	    routingParts.push('semantic/concept search → mcp__cocoindex_code__search');
   186	  }
   187	  if (graphFreshness === 'fresh') {
   188	    routingParts.push('structural queries (callers, deps) → code_graph_query');
   189	  }
   190	  routingParts.push('exact text/regex → Grep');
   191	  const routingRecommendation = routingParts.join(' | ');
   192	
   193	  return {
   194	    specFolder,
   195	    currentTask,
   196	    graphFreshness,
   197	    cocoIndexAvailable,
   198	    sessionQuality,
   199	    lastToolCallAgoMs,
   200	    primed,
   201	    routingRecommendation,
   202	  };
   203	}
   204	
   205	/**
   206	 * Phase 027: Build a structural bootstrap contract for a given surface.
   207	 * Reuses resolveGraphFreshness() and getGraphStats() from this module.
   208	 * Keeps output compact (targets 250-400 tokens, ceiling 500).
   209	 */
   210	export function buildStructuralBootstrapContract(
   211	  sourceSurface: StructuralBootstrapContract['sourceSurface']
   212	): StructuralBootstrapContract {
   213	  const graphFreshness = resolveGraphFreshness();
   214	
   215	  let status: StructuralBootstrapContract['status'];
   216	  if (graphFreshness === 'fresh') {
   217	    status = 'ready';
   218	  } else if (graphFreshness === 'stale') {
   219	    status = 'stale';
   220	  } else {
   221	    status = 'missing';
   222	  }
   223	
   224	  let summary: string;
   225	  let highlights: string[] | undefined;
   226	
   227	  if (status === 'ready') {
   228	    try {
   229	      const stats = getGraphStats();
   230	      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes, ${stats.totalEdges} edges (fresh)`;
   231	      const topKinds = Object.entries(stats.nodesByKind)
   232	        .sort((a, b) => b[1] - a[1])
   233	        .slice(0, 5);
   234	      if (topKinds.length > 0) {
   235	        highlights = topKinds.map(([kind, count]) => `${kind}: ${count}`);
   236	      }
   237	    } catch {
   238	      summary = 'Code graph available (structural context ready)';
   239	    }
   240	  } else if (status === 'stale') {
   241	    try {
   242	      const stats = getGraphStats();
   243	      summary = `Code graph: ${stats.totalFiles} files, ${stats.totalNodes} nodes (stale — structural reads may refresh inline or recommend code_graph_scan)`;
   244	    } catch {
   245	      summary = 'Code graph data is stale — structural context may be outdated';
   246	    }
   247	  } else {
   248	    summary = 'No structural context available — code graph is empty or unavailable';
   249	  }
   250	
   251	  let recommendedAction: string;
   252	  if (status === 'ready') {
   253	    recommendedAction = 'Structural context available. Use code_graph_query for structural lookups.';
   254	  } else if (status === 'stale') {
   255	    recommendedAction = 'Use a structural read to trigger bounded inline refresh when safe, or run code_graph_scan for broader stale states.';
   256	  } else {
   257	    recommendedAction = 'Call session_bootstrap first. Then run code_graph_scan if structural context is needed.';
   258	  }
   259	
   260	  const fittedContract = fitStructuralContractBudget(summary, highlights, recommendedAction);
   261	
   262	  return {
   263	    status,
   264	    summary: fittedContract.summary,
   265	    highlights: fittedContract.highlights,
   266	    recommendedAction: fittedContract.recommendedAction,
   267	    sourceSurface,
   268	    provenance: {
   269	      producer: 'session_snapshot',
   270	      sourceSurface,
   271	      trustState: trustStateFromStructuralStatus(status),
   272	      generatedAt: new Date().toISOString(),
   273	      lastUpdated: status === 'ready' || status === 'stale'
   274	        ? (() => {
   275	          try {
   276	            const stats = getGraphStats();
   277	            return stats.lastScanTimestamp ?? null;
   278	          } catch {
   279	            return null;
   280	          }

exec
/bin/zsh -lc 'rg -n "handleSessionStart|handleSessionEnd|handleContext|handleSessionSummary|handleCapturePassive" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '900,1095p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
395:			handleContext(s, cfg),
511:			handleSessionSummary(s, cfg),
538:			handleSessionStart(s, cfg),
561:			handleSessionEnd(s),
594:			handleCapturePassive(s, cfg),
883:func handleContext(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
1030:func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
1064:func handleSessionStart(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
1084:func handleSessionEnd(s *store.Store) server.ToolHandlerFunc {
1097:func handleCapturePassive(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {

 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '883,918p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '1079,1128p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1111	    const stmt = db.prepare(`
  1112	      UPDATE session_state
  1113	      SET status = 'interrupted', updated_at = ?
  1114	      WHERE status = 'active'
  1115	    `);
  1116	    const result = stmt.run(new Date().toISOString());
  1117	
  1118	    return { success: true, interruptedCount: result.changes };
  1119	  } catch (error: unknown) {
  1120	    const message = error instanceof Error ? error.message : String(error);
  1121	    console.error(`[session-manager] reset_interrupted_sessions failed: ${message}`);
  1122	    return { success: false, interruptedCount: 0, error: message };
  1123	  }
  1124	}
  1125	
  1126	function recoverState(sessionId: string, scope: SessionIdentityScope = {}): RecoverResult {
  1127	  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
  1128	  if (!sessionId || typeof sessionId !== 'string') {

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1097,1165p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I’m at synthesis now. I’m doing one quick memory read to pin the exact prior-session lines I reused for continuity, then I’ll deliver the iteration report with only lifecycle-focused findings and a clear next investigation target.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/.codex/memories/MEMORY.md | sed -n '724,790p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   724	
   725	### rollout_summary_files
   726	
   727	- rollout_summaries/2026-04-02T15-19-14-ItVu-doc_parity_recovery_024_023.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-19-14-019d4ec6-f1fa-75d3-9091-3f77194ae5c0.jsonl, updated_at=2026-04-02T17:06:24+00:00, thread_id=019d4ec6-f1fa-75d3-9091-3f77194ae5c0)
   728	
   729	### keywords
   730	
   731	- session_bootstrap, memory_context({mode:"resume",profile:"resume"}), mcp_server/hooks/claude, scripts/hooks/claude, workflow-session-id.vitest.ts, code-graph-query-handler.vitest.ts
   732	
   733	## Task 5: Truth-sync changelog packet `023-esm-module-compliance` (add phase 013 + adjust 010-012 claims), outcome success
   734	
   735	### rollout_summary_files
   736	
   737	- rollout_summaries/2026-04-02T15-04-40-XOMQ-changelog_023_esm_module_compliance_update.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-04-40-019d4eb9-9c7f-7e91-a395-f537a58c3d74.jsonl, updated_at=2026-04-02T15:16:00+00:00, thread_id=019d4eb9-9c7f-7e91-a395-f537a58c3d74)
   738	
   739	### keywords
   740	
   741	- changelog-root-esm-module-compliance.md, changelog-013-fts5-fix-and-search-dashboard.md, v1.1.0, 13 phases, validate.sh --recursive --strict
   742	
   743	## Task 6: Draft packet-local changelog set for `024-compact-code-graph`, outcome success
   744	
   745	### rollout_summary_files
   746	
   747	- rollout_summaries/2026-04-02T15-03-16-TyzB-changelog_024_compact_code_graph.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T17-03-16-019d4eb8-5687-7820-b943-28f8d97369cf.jsonl, updated_at=2026-04-02T15:17:25+00:00, thread_id=019d4eb8-5687-7820-b943-28f8d97369cf)
   748	
   749	### keywords
   750	
   751	- scratch/changelog-024-root.md, changelog-024-<phase>.md, use max sub agents, packet-local scratch, implementation-summary, review report
   752	
   753	## Task 7: Add dedicated README section for CocoIndex + Compact Code Graph with packet references, outcome success
   754	
   755	### rollout_summary_files
   756	
   757	- rollout_summaries/2026-04-02T14-05-56-qyWY-cocoindex_compact_code_graph_readme_section.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T16-05-56-019d4e83-d8f5-7342-833e-98b3e0f731f0.jsonl, updated_at=2026-04-02T14:08:03+00:00, thread_id=019d4e83-d8f5-7342-833e-98b3e0f731f0)
   758	
   759	### keywords
   760	
   761	- CocoIndex + Compact Code Graph, README.md, 024-compact-code-graph, 006-documentation-alignment, mcp__cocoindex_code__search, code_graph_query, prettier --check
   762	
   763	## Task 8: Refresh README/changelog language to current code-graph behavior and sync constitutional README file inventory, outcome success
   764	
   765	### rollout_summary_files
   766	
   767	- rollout_summaries/2026-04-03T11-57-51-M8RC-code_graph_documentation_and_changelog_sync.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/03/rollout-2026-04-03T13-57-51-019d5334-f0f1-7730-8c5e-9ab6db1b631c.jsonl, updated_at=2026-04-04T15:43:31+00:00, thread_id=019d5334-f0f1-7730-8c5e-9ab6db1b631c)
   768	
   769	### keywords
   770	
   771	- current reality, no longer wording removal, bounded selective_reindex, full_scan guidance, v3.3.0.0, gate-tool-routing.md, constitutional/README.md
   772	
   773	## User preferences
   774	
   775	- when the user said “Re-use /.../024-compact-code-graph/006-documentation-alignment,” continue under the specified existing spec folder instead of opening a new packet [Task 4]
   776	- when the user asked for deep review “make sure everything works as expected ... check the feature catalog and manual testing playbook, and all commands, agents and readmes,” treat it as full-spectrum audit + runtime/doc parity, not a narrow fix pass [Task 1][Task 2]
   777	- when user asked to “use max sub agents” for packet changelog synthesis, parallelize phase evidence gathering but keep output scoped to the requested packet `scratch/` folder [Task 6]
   778	- when user asked for README work, they specified “proper dedicated section ... reference 024-compact-code-graph ... re-use 006-documentation-alignment” -> preserve that wording/terminology and include those exact packet references [Task 7]
   779	- when refining README wording, the user asked for “current reality” language, plain English, and no “no longer” phrasing or internal spec-folder references in runtime-state descriptions [Task 8]
   780	- when updating changelog claims, keep wording pinned to implemented behavior evidence (bounded inline `selective_reindex` vs explicit operator `code_graph_scan`) [Task 8]
   781	
   782	## Reusable knowledge
   783	
   784	- canonical validation gates for packet readiness here were `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --recursive --strict` plus `TMPDIR=... npm run check:full` and `npm run build` evidence capture [Task 1][Task 2]
   785	- for strict validator compliance, checklist lines need explicit `[EVIDENCE: ...]` and level-template headers/section numbers must remain exact (`## 1. METADATA`, `## 2. PROBLEM & PURPOSE`, etc.) [Task 3]
   786	- `session_bootstrap()` is the primary recovery call for non-hook flows; docs should mention fallback `memory_context({mode:"resume",profile:"resume"})` only after bootstrap guidance [Task 4]
   787	- hook path truth is `mcp_server/hooks/claude/*.ts` and compiled `mcp_server/dist/hooks/claude/*.js`; avoid stale `scripts/hooks/claude/` references [Task 4]
   788	- changelog truth-sync for 023 needed root + per-phase consistency: add missing phase 013 entry and avoid overstating rerun verification for 010/011/012 while strict validation remains green [Task 5]
   789	- for packet changelog generation at this scale, first mirror prior packet changelog structure, then gather evidence from implementation summaries/checklists/review docs before drafting per-phase files [Task 6]
   790	- README formatting in this repo is partially hand-formatted; if `npx prettier --check README.md` fails but `git diff --check` is clean, keep scoped edits and avoid whole-file reflow [Task 7]

codex
# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our `memory_context`, `generate-context.js`, `session_bootstrap`.

## Findings
### Finding 1: Engram has first-class session lifecycle verbs; we currently have lifecycle state, but not a comparable public lifecycle surface
- **Source**: [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [external/internal/mcp/mcp.go:542](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L542), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go:770](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [session-manager.ts:1020](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1020), [session-manager.ts:1079](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1079)
- **What it does**: Engram exposes `mem_session_start` and `mem_session_end` directly in MCP and backs them with durable `sessions` rows via `CreateSession()` and `EndSession()`. Public already has session lifecycle machinery, but it is implicit: `memory_context` resolves a trusted/effective session, persists `session_state`, and internal `completeSession()` exists without a first-class MCP tool.
- **Why it matters for us**: We already have stronger session machinery than Engram in the backend, but agents and hooks cannot use a simple explicit lifecycle contract the way Engram can. That makes our lifecycle harder to reason about for cross-agent integrations.
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


hook: Stop
hook: Stop Completed
tokens used
124,427
# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our `memory_context`, `generate-context.js`, `session_bootstrap`.

## Findings
### Finding 1: Engram has first-class session lifecycle verbs; we currently have lifecycle state, but not a comparable public lifecycle surface
- **Source**: [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L515), [external/internal/mcp/mcp.go:542](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L542), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L754), [external/internal/store/store.go:770](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L770), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts#L821), [session-manager.ts:1020](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1020), [session-manager.ts:1079](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts#L1079)
- **What it does**: Engram exposes `mem_session_start` and `mem_session_end` directly in MCP and backs them with durable `sessions` rows via `CreateSession()` and `EndSession()`. Public already has session lifecycle machinery, but it is implicit: `memory_context` resolves a trusted/effective session, persists `session_state`, and internal `completeSession()` exists without a first-class MCP tool.
- **Why it matters for us**: We already have stronger session machinery than Engram in the backend, but agents and hooks cannot use a simple explicit lifecycle contract the way Engram can. That makes our lifecycle harder to reason about for cross-agent integrations.
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
