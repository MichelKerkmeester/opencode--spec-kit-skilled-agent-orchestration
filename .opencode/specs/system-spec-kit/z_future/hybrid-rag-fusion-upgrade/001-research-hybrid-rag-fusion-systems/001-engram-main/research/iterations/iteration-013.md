### Finding 4: Public needs a semantic thread-key layer above internal lineage keys
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L963), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1474), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3198), [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md#L98), [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L207), [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L251), [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts#L833)
- **What it does**: Engram’s `topic_key` is human-meaningful, queryable, and updateable: it drives upserts, revision tracking, and direct lookup. Public’s lineage keys are strong for internal identity and active projections, but they are hashed or path-anchor derived and are not a human semantic thread surface.
- **Why it matters for us**: This is a different layer than the earlier durable external ID finding. Public should keep lineage/logical keys for integrity, but add a separate semantic `thread_key` or `topic_key` for evolving decisions, research trains, and long-lived architecture threads that people and tools can intentionally reuse.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 5: We should reject any refactor that simplifies Public’s retrieval core down to Engram-style FTS-only search
- **Source**: [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1518), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L1613), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3382), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L533), [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts#L398)
- **What it does**: Engram has a clean lexical stack: direct topic-key shortcut, sanitized quoted FTS query, `fts.rank`, and a narrow startup formatter. Public already runs hybrid retrieval with scoped ranking, reranking, and working-memory attention.
- **Why it matters for us**: Engram’s deterministic lexical shortcuts are worth borrowing, but its core retrieval model would be a downgrade if treated as a replacement. The right move is to add exact thread/topic fast paths and bounded startup summaries above our current hybrid engine, not to simplify the engine itself.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Public should prototype bounded passive capture, but only as a sidecar to explicit save flows
- **Source**: [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go#L565), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3421), [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go#L3481), [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md#L92), [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js#L338)
- **What it does**: Engram’s passive capture is intentionally narrow: it only extracts structured “Key Learnings” style sections, dedupes by normalized content hash, and saves each learning as a separate observation.
- **Why it matters for us**: Public’s explicit `generate-context.js` flow is still the right authority for spec-folder saves. But a small passive-learning sidecar for post-task summaries, handovers, or agent-stop hooks could reduce friction without replacing governed saves or session bootstrap.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/project/detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go)
- [external/internal/project/similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go)
- [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [mcp_server/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md)
- [memory-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts)
- [lifecycle-tools.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
- [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [memory-index-alias.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-alias.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [research/iterations/iteration-009.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/iterations/iteration-009.md)

## Assessment
- New information ratio: 0.76
- Questions addressed: Q1, Q2, Q3, Q5, Q6, Q8, Q9, Q10
- Questions answered: Q1, Q2, Q3, Q5, Q6, Q8, Q9, Q10

## Reflection
- What worked: tracing `internal/mcp/mcp.go` and `internal/store/store.go` first exposed the real architecture boundaries quickly, and comparing those against Public’s actual tool registry, session bootstrap/resume flow, lineage keys, and shared-memory auth notes made the refactor calls concrete instead of speculative.
- What did not work: CocoIndex was not usable for this Go code pass, so I fell back to `rg` plus direct file reads; the phase folder also does not currently contain the Level 3 files named in the brief, and strict validation still reported `PASSED` only after inferring Level 1 while also emitting an `Operation not permitted` temp-file warning; the workspace is read-only, so I did not patch the phase folder or save memory with `generate-context.js`.

## Recommended Next Focus
Trace Engram’s plugin hooks and setup surfaces next, then compare them against Public’s save/handover/session-stop workflow to decide whether passive capture and first-class session lifecycle should be hook-driven, MCP-driven, or both.

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
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

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
I’m treating this as a read-only deep research pass over the Engram source and Public’s memory stack, with the goal of extracting paradigm-shift implications rather than repeating prior findings. I’m starting by reading the governing local instructions and then tracing the concrete implementation paths in `internal/mcp/`, `internal/store/`, and the matching Public handlers before I synthesize new findings.
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
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|001-engram-main|paradigm|topic_key|session lifecycle" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1493ms:

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
I’ve finished the instruction pass and confirmed the external repo’s own guidance is workflow-oriented rather than architectural, so I’m keeping it as contributor-context evidence only. Next I’m tracing the real Engram mechanics in MCP and store code, then I’ll map only the non-overlapping paradigm shifts onto Public’s memory architecture.
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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// Package store implements the persistent memory engine for Engram.
//
// It uses SQLite with FTS5 full-text search to store and retrieve
// observations from AI coding sessions. This is the core of Engram —
// everything else (HTTP server, MCP server, CLI, plugins) talks to this.
package store

import (
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"time"

	_ "modernc.org/sqlite"
)

var openDB = sql.Open

// ─── Types ───────────────────────────────────────────────────────────────────

type Session struct {
	ID        string  `json:"id"`
	Project   string  `json:"project"`
	Directory string  `json:"directory"`
	StartedAt string  `json:"started_at"`
	EndedAt   *string `json:"ended_at,omitempty"`
	Summary   *string `json:"summary,omitempty"`
}

type Observation struct {
	ID             int64   `json:"id"`
	SyncID         string  `json:"sync_id"`
	SessionID      string  `json:"session_id"`
	Type           string  `json:"type"`
	Title          string  `json:"title"`
	Content        string  `json:"content"`
	ToolName       *string `json:"tool_name,omitempty"`
	Project        *string `json:"project,omitempty"`
	Scope          string  `json:"scope"`
	TopicKey       *string `json:"topic_key,omitempty"`
	RevisionCount  int     `json:"revision_count"`
	DuplicateCount int     `json:"duplicate_count"`
	LastSeenAt     *string `json:"last_seen_at,omitempty"`
	CreatedAt      string  `json:"created_at"`
	UpdatedAt      string  `json:"updated_at"`
	DeletedAt      *string `json:"deleted_at,omitempty"`
}

type SearchResult struct {
	Observation
	Rank float64 `json:"rank"`
}

type SessionSummary struct {
	ID               string  `json:"id"`
	Project          string  `json:"project"`
	StartedAt        string  `json:"started_at"`
	EndedAt          *string `json:"ended_at,omitempty"`
	Summary          *string `json:"summary,omitempty"`
	ObservationCount int     `json:"observation_count"`
}

type Stats struct {
	TotalSessions     int      `json:"total_sessions"`
	TotalObservations int      `json:"total_observations"`
	TotalPrompts      int      `json:"total_prompts"`
	Projects          []string `json:"projects"`
}

type TimelineEntry struct {
	ID             int64   `json:"id"`
	SessionID      string  `json:"session_id"`
	Type           string  `json:"type"`
	Title          string  `json:"title"`
	Content        string  `json:"content"`
	ToolName       *string `json:"tool_name,omitempty"`
	Project        *string `json:"project,omitempty"`
	Scope          string  `json:"scope"`
	TopicKey       *string `json:"topic_key,omitempty"`
	RevisionCount  int     `json:"revision_count"`
	DuplicateCount int     `json:"duplicate_count"`
	LastSeenAt     *string `json:"last_seen_at,omitempty"`
	CreatedAt      string  `json:"created_at"`
	UpdatedAt      string  `json:"updated_at"`
	DeletedAt      *string `json:"deleted_at,omitempty"`
	IsFocus        bool    `json:"is_focus"` // true for the anchor observation
}

type TimelineResult struct {
	Focus        Observation     `json:"focus"`        // The anchor observation
	Before       []TimelineEntry `json:"before"`       // Observations before the focus (chronological)
	After        []TimelineEntry `json:"after"`        // Observations after the focus (chronological)
	SessionInfo  *Session        `json:"session_info"` // Session that contains the focus observation
	TotalInRange int             `json:"total_in_range"`
}

type SearchOptions struct {
	Type    string `json:"type,omitempty"`
	Project string `json:"project,omitempty"`
	Scope   string `json:"scope,omitempty"`
	Limit   int    `json:"limit,omitempty"`
}

type AddObservationParams struct {
	SessionID string `json:"session_id"`
	Type      string `json:"type"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	ToolName  string `json:"tool_name,omitempty"`
	Project   string `json:"project,omitempty"`
	Scope     string `json:"scope,omitempty"`
	TopicKey  string `json:"topic_key,omitempty"`
}

type UpdateObservationParams struct {
	Type     *string `json:"type,omitempty"`
	Title    *string `json:"title,omitempty"`
	Content  *string `json:"content,omitempty"`
	Project  *string `json:"project,omitempty"`
	Scope    *string `json:"scope,omitempty"`
	TopicKey *string `json:"topic_key,omitempty"`
}

type Prompt struct {
	ID        int64  `json:"id"`
	SyncID    string `json:"sync_id"`
	SessionID string `json:"session_id"`
	Content   string `json:"content"`
	Project   string `json:"project,omitempty"`
	CreatedAt string `json:"created_at"`
}

type AddPromptParams struct {
	SessionID string `json:"session_id"`
	Content   string `json:"content"`
	Project   string `json:"project,omitempty"`
}

const (
	DefaultSyncTargetKey = "cloud"

	SyncLifecycleIdle     = "idle"
	SyncLifecyclePending  = "pending"
	SyncLifecycleRunning  = "running"
	SyncLifecycleHealthy  = "healthy"
	SyncLifecycleDegraded = "degraded"

	SyncEntitySession     = "session"
	SyncEntityObservation = "observation"
	SyncEntityPrompt      = "prompt"

	SyncOpUpsert = "upsert"
	SyncOpDelete = "delete"

	SyncSourceLocal  = "local"
	SyncSourceRemote = "remote"
)

type SyncState struct {
	TargetKey           string  `json:"target_key"`
	Lifecycle           string  `json:"lifecycle"`
	LastEnqueuedSeq     int64   `json:"last_enqueued_seq"`
	LastAckedSeq        int64   `json:"last_acked_seq"`
	LastPulledSeq       int64   `json:"last_pulled_seq"`
	ConsecutiveFailures int     `json:"consecutive_failures"`
	BackoffUntil        *string `json:"backoff_until,omitempty"`
	LeaseOwner          *string `json:"lease_owner,omitempty"`
	LeaseUntil          *string `json:"lease_until,omitempty"`
	LastError           *string `json:"last_error,omitempty"`
	UpdatedAt           string  `json:"updated_at"`
}

type SyncMutation struct {
	Seq        int64   `json:"seq"`
	TargetKey  string  `json:"target_key"`
	Entity     string  `json:"entity"`
	EntityKey  string  `json:"entity_key"`
	Op         string  `json:"op"`
	Payload    string  `json:"payload"`
	Source     string  `json:"source"`
	Project    string  `json:"project"`
	OccurredAt string  `json:"occurred_at"`
	AckedAt    *string `json:"acked_at,omitempty"`
}

// EnrolledProject represents a project enrolled for cloud sync.
type EnrolledProject struct {
	Project    string `json:"project"`
	EnrolledAt string `json:"enrolled_at"`
}

type syncSessionPayload struct {
	ID        string  `json:"id"`
	Project   string  `json:"project"`
	Directory string  `json:"directory"`
	EndedAt   *string `json:"ended_at,omitempty"`
	Summary   *string `json:"summary,omitempty"`
}

type syncObservationPayload struct {
	SyncID     string  `json:"sync_id"`
	SessionID  string  `json:"session_id"`
	Type       string  `json:"type"`
	Title      string  `json:"title"`
	Content    string  `json:"content"`
	ToolName   *string `json:"tool_name,omitempty"`
	Project    *string `json:"project,omitempty"`
	Scope      string  `json:"scope"`
	TopicKey   *string `json:"topic_key,omitempty"`
	Deleted    bool    `json:"deleted,omitempty"`
	DeletedAt  *string `json:"deleted_at,omitempty"`
	HardDelete bool    `json:"hard_delete,omitempty"`
}

type syncPromptPayload struct {
	SyncID    string  `json:"sync_id"`
	SessionID string  `json:"session_id"`
	Content   string  `json:"content"`
	Project   *string `json:"project,omitempty"`
}

// ExportData is the full serializable dump of the engram database.
type ExportData struct {
	Version      string        `json:"version"`
	ExportedAt   string        `json:"exported_at"`
	Sessions     []Session     `json:"sessions"`
	Observations []Observation `json:"observations"`
	Prompts      []Prompt      `json:"prompts"`
}

// ─── Config ──────────────────────────────────────────────────────────────────

type Config struct {
	DataDir              string
	MaxObservationLength int
	MaxContextResults    int
	MaxSearchResults     int
	DedupeWindow         time.Duration
}

func DefaultConfig() (Config, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return Config{}, fmt.Errorf("engram: determine home directory: %w", err)
	}
	return Config{
		DataDir:              filepath.Join(home, ".engram"),
		MaxObservationLength: 50000,
		MaxContextResults:    20,
		MaxSearchResults:     20,
		DedupeWindow:         15 * time.Minute,
	}, nil

web search: 
web search: 
codex
I’ve reached the code paths that actually matter: Engram’s MCP layer makes sessioning, prompt capture, and topic-key reasoning explicit tool contracts, while Public keeps more of that behavior behind higher-level recovery and save flows. I’m now drilling into the exact store functions and the matching Public handlers so the next step is a precise paradigm-gap map rather than a generic architecture summary.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'rg -n "memory_context|memory_search|memory_match_triggers|generate-context|session_bootstrap|session_resume|thread|topic|lineage|causal|working memory|dedup|rerank|trackAccess|sessionId|result_cited|save-context" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib/storage .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "func (CreateSession|EndSession|AddObservation|Search|FormatContext|SuggestTopicKey|sanitizeFTS)|CREATE VIRTUAL TABLE|observations_fts|prompts_fts|duplicate_count|revision_count|deleted_at|topic_key|session_summary|capture_passive" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:61:	"mem_suggest_topic_key": true, // stable topic key for upserts — referenced 3 times
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:256:				mcp.WithString("topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:294:				mcp.WithString("topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:302:	// ─── mem_suggest_topic_key (profile: agent, deferred) ───────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:303:	if shouldRegister("mem_suggest_topic_key", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:305:			mcp.NewTool("mem_suggest_topic_key",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:306:				mcp.WithDescription("Suggest a stable topic_key for memory upserts. Use this before mem_save when you want evolving topics (like architecture decisions) to update a single observation over time."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:461:	if shouldRegister("mem_session_summary", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:463:			mcp.NewTool("mem_session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:566:	if shouldRegister("mem_capture_passive", allowlist) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:568:			mcp.NewTool("mem_capture_passive",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:688:		topicKey, _ := req.GetArguments()["topic_key"].(string)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:748:			msg += fmt.Sprintf("\nSuggested topic_key: %s", suggestedTopicKey)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:770:			return mcp.NewToolResultError("provide title or content to suggest a topic_key"), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:775:			return mcp.NewToolResultError("could not suggest topic_key from input"), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:778:		return mcp.NewToolResultText(fmt.Sprintf("Suggested topic_key: %s", topicKey)), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:805:		if v, ok := req.GetArguments()["topic_key"].(string); ok {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1051:			Type:      "session_summary",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:48:	TopicKey       *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:49:	RevisionCount  int     `json:"revision_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:50:	DuplicateCount int     `json:"duplicate_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:54:	DeletedAt      *string `json:"deleted_at,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:87:	TopicKey       *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:88:	RevisionCount  int     `json:"revision_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:89:	DuplicateCount int     `json:"duplicate_count"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:93:	DeletedAt      *string `json:"deleted_at,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:120:	TopicKey  string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:129:	TopicKey *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:217:	TopicKey   *string `json:"topic_key,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:219:	DeletedAt  *string `json:"deleted_at,omitempty"`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:460:			topic_key  TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:462:			revision_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:467:			deleted_at TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:476:		CREATE VIRTUAL TABLE IF NOT EXISTS observations_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:482:			topic_key,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501:		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:550:		{name: "topic_key", definition: "TEXT"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:552:		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:556:		{name: "deleted_at", definition: "TEXT"},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:575:		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:576:		CREATE INDEX IF NOT EXISTS idx_obs_deleted ON observations(deleted_at);
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
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:679:				INSERT INTO prompts_fts(rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:684:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:689:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:691:				INSERT INTO prompts_fts(rowid, content, project)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:705:	err := s.db.QueryRow("SELECT COUNT(*) FROM pragma_table_xinfo('observations_fts') WHERE name = 'topic_key'").Scan(&colCount)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:714:		DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:715:		CREATE VIRTUAL TABLE observations_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:721:			topic_key,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:725:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:726:		SELECT id, title, content, tool_name, type, project, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:728:		WHERE deleted_at IS NULL;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:731:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:732:			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:736:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:737:			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:741:			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:742:			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:743:			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:744:			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:747:		return fmt.Errorf("migrate fts topic_key: %w", err)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:830:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:870:		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:908:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:910:		WHERE o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:937:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:939:		WHERE session_id = ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:970:				 WHERE topic_key = ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:973:				   AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:985:					     topic_key = ?,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:987:					     revision_count = revision_count + 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1022:			   AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1031:				 SET duplicate_count = duplicate_count + 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1086:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1088:		WHERE o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1190:		FROM prompts_fts fts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1192:		WHERE prompts_fts MATCH ?
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1227:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1284:			     topic_key = ?,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1286:			     revision_count = revision_count + 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1288:			 WHERE id = ? AND deleted_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1331:				 SET deleted_at = datetime('now'),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1333:				 WHERE id = ? AND deleted_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1338:			if err := tx.QueryRow(`SELECT deleted_at FROM observations WHERE id = ?`, id).Scan(&deletedAt); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1384:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1386:		WHERE session_id = ? AND id < ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1418:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1420:		WHERE session_id = ? AND id > ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1448:		"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1478:			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1480:			WHERE topic_key = ? AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1523:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1525:		FROM observations_fts fts
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2290:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2325:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2439:		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2700:		  AND deleted_at IS NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2847:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2861:		query += ` AND deleted_at IS NULL`
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2940:		`UPDATE observations SET deleted_at = ?, updated_at = datetime('now') WHERE id = ?`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3065:			topic_key  TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3067:			revision_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3072:			deleted_at TEXT,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3083:			last_seen_at, created_at, updated_at, deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3099:			NULLIF(topic_key, ''),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3101:			CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3106:			deleted_at
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3125:		DROP TABLE IF EXISTS observations_fts;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3126:		CREATE VIRTUAL TABLE observations_fts USING fts5(
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3132:			topic_key,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3137:		SELECT id, title, content, tool_name, type, project, topic_key
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3139:		WHERE deleted_at IS NULL;
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3201:func SuggestTopicKey(typ, title, content string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3246:	case "session_summary":
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3384:func sanitizeFTS(query string) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3504:			   AND deleted_at IS NULL

 succeeded in 0ms:
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:62:Usage: node generate-context.js [options] <input>
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:66:                    - JSON file mode: node generate-context.js data.json [spec-folder]
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:75:  node generate-context.js /tmp/context-data.json
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:76:  node generate-context.js /tmp/context-data.json specs/001-feature/
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:77:  node generate-context.js /tmp/context-data.json .opencode/specs/001-feature/
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:78:  echo '{"specFolder":"specs/001-feature/"}' | node generate-context.js --stdin
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:79:  node generate-context.js --json '{"specFolder":"specs/001-feature/"}'
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:349:        sessionId: null,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:357:    let sessionId = null;
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:365:            sessionId = candidate.trim();
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:373:        return { dataFile: null, specFolderArg: null, collectedData: null, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:377:        return { ...structured, sessionId };
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:388:        sessionId,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:490:            console.error('[generate-context] Failed to list spec folders:', errMsg);
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:493:    console.error('\nUsage: node generate-context.js [--stdin [spec-folder-name] | --json <json> [spec-folder-name] | <data-file> [spec-folder-name]]\n');
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:514:            sessionId: parsed.sessionId ?? undefined,
.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:546://# sourceMappingURL=generate-context.js.map
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:86:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:328:  trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:19:} from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:20:import type { CausalEdge } from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:286: * (via causal edges) to surface the full context for resolution.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:297:    // Expand cluster via causal edges (1-hop neighbors)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:301:          SELECT CAST(target_id AS INTEGER) as neighbor_id FROM causal_edges WHERE source_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:303:          SELECT CAST(source_id AS INTEGER) as neighbor_id FROM causal_edges WHERE target_id = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:346:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:370:        SELECT id, strength, last_accessed, created_by FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:454:        SELECT source_id AS node_id FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/consolidation.ts:456:        SELECT target_id AS node_id FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:87:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:27:import { deleteEdgesForMemory } from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:28:import { runLineageBackfill } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:41:function dedupeRowsById<T extends Record<string, unknown>>(rows: T[]): T[] {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:71:    'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:90:    'memory_lineage',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:113:  'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:206:  causalEdges?: Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:311:  'memory_index', 'memory_fts', 'vec_memories', 'vec_metadata', 'causal_edges',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:312:  'memory_conflicts', 'memory_corrections', 'memory_lineage', 'memory_history',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:596:  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:602:    return dedupeRowsById([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:606:          SELECT * FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:614:          SELECT * FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:626:  if (memoryIds.length === 0 || !tableExists(database, 'causal_edges')) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:690:  if (tableName === 'causal_edges') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:694:    return hasScope ? [] : database.prepare('SELECT * FROM causal_edges').all() as Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:728:      return dedupeRowsById([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:772:    return dedupeRowsById([
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:863:  if (Array.isArray(snapshot.causalEdges)) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:864:    tableSnapshots.causal_edges = {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:865:      columns: Object.keys(snapshot.causalEdges[0] ?? {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:866:      rows: snapshot.causalEdges,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:952:  if (tableName === 'causal_edges') {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1199:      deps: ['lineage-backfill'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1204:      deps: ['lineage-backfill'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1219:      deps: ['lineage-backfill', 'auto-entities'],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1230:      name: 'lineage-backfill',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1454:      const causalEdgesSnapshot = tables.causal_edges?.rows ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1466:        causalEdges: causalEdgesSnapshot,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1651:    const edgeIds = getEdgeIds(tableSnapshots.causal_edges?.rows ?? []);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1908:    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:230:  const deduplicatedPaths: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:241:    deduplicatedPaths.push(normalizedPath);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:244:  paths = deduplicatedPaths;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:271:        ? ['Duplicate input paths were deduplicated before queueing']
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:3:description: "Persistence helpers for checkpoints, lineage, reconsolidation, audit history, and post-insert metadata."
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:6:  - "lineage state"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:31:- Append-first lineage tracking and mutation audit history.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:33:- Reconsolidation, consolidation, and causal-edge persistence helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:38:- Storage helpers assume document-aware columns such as `document_type`, `spec_level`, governance scope columns, and lineage metadata are available.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:47:| `causal-edges.ts` | Insert, query, and manage causal edge records |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:51:| `history.ts` | Append-only history events and lineage anchor lookup helpers |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:54:| `lineage-state.ts` | Append-first lineage transitions, active projection reads, backfill, and as-of resolution |
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:68:- `lineage-state.ts` owns append-first version transitions, active projections, integrity validation, and backfill helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md:70:- `reconsolidation.ts` and `consolidation.ts` remain feature-gated maintenance systems, but both are wired against the current lineage and interference-refresh behavior.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183:  // Fetch IDs for deletion (needed for causal edge cleanup and ledger)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:208:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:229:        // Clean up causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:231:        // Previously errors were caught and logged, leaving orphan causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:233:        causalEdges.deleteEdgesForMemory(String(memory.id));
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
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1291: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1293: * @returns Active lineage snapshot when one exists.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1305: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1317: * Compatibility wrapper that executes the lineage backfill workflow.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1319: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1331: * Benchmark append-first lineage writes across an ordered chain of memory ids.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1333: * @param database - Database connection that stores lineage state.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1359:  const actor = options.actor ?? 'memory-lineage:benchmark';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1393: * Public lineage result types exposed to tests and compatibility helpers.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:7:// Feature catalog: Trigger phrase matching (memory_match_triggers)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:95:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:150:    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:197:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:207:  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:208:  // manager to prevent IDOR. Callers cannot read/write working memory for
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:210:  let sessionId: string | undefined = rawSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:218:      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:220:        tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:225:          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:229:    sessionId = trustedSession.effectiveSessionId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:274:    sessionId &&
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:284:      console.warn('[memory_match_triggers] Decay failed:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:325:      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:336:      tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:343:          sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:374:        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:390:          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:469:      sessionId: sessionId!,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:491:    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:499:  if (!useCognitive && sessionId) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:511:    tool: 'memory_match_triggers',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:540:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:562:const handle_memory_match_triggers = handleMemoryMatchTriggers;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:565:  handle_memory_match_triggers,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:9:// - similarity in [0.75, 0.88): CONFLICT (supersede prior memory via causal 'supersedes' edge)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:18:import * as causalEdges from './causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:24:import { recordLineageTransition } from './lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:93:  causalEdgeId: number | null;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:346:      // Create supersedes causal edge
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:348:        INSERT OR IGNORE INTO causal_edges (source_id, target_id, relation, strength, extracted_at)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:465: * - Create a 'supersedes' causal edge from new -> existing
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:482:    // Add causal 'supersedes' edge only when caller provides a distinct new ID.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:508:        edgeId = causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:547:      causalEdgeId: edgeId,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:676:            // instead of raw DELETE to clean lineage, projections, and graph residue.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:4:// Feature catalog: Causal edge creation (memory_causal_link)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:5:// Causal relationship graph for memory lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:35:  caused:       1.3,  // Strong causal link
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:36:  enabled:      1.1,  // Weak causal link
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:103:  edgeId?: number;          // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:146:    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:147:    database.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:168:    console.warn('[causal-edges] Database not initialized. Server may still be starting up.');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:184:  // Implementing FK validation would require seeding memory_index in 20+ causal edge tests.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:190:      console.warn(`[causal-edges] Edge bounds: node ${sourceId} has ${edgeCount} edges (max ${MAX_EDGES_PER_NODE}), rejecting auto edge`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:198:      console.warn('[causal-edges] insertEdge rejected non-finite strength');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:218:        SELECT id, strength FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:223:        INSERT INTO causal_edges (source_id, target_id, relation, strength, evidence, created_by)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:227:          evidence = COALESCE(excluded.evidence, causal_edges.evidence)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:231:        SELECT id FROM causal_edges WHERE source_id = ? AND target_id = ? AND relation = ?
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:250:    console.warn(`[causal-edges] insertEdge error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:296:    console.warn(`[causal-edges] insertEdgesBatch error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:310:    const edgeColumns = (database.prepare('PRAGMA table_info(causal_edges)').all() as Array<{ name: string }>)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:319:      INSERT OR IGNORE INTO causal_edges (${edgeColumns.join(', ')})
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:351:    console.warn(`[causal-edges] bulkInsertEdges error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:373:      SELECT * FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:382:        console.warn(`[causal-edges] touchEdgeAccess failed for edge ${edge.id}: ${e instanceof Error ? e.message : String(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:388:    console.warn(`[causal-edges] getEdgesFrom error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:398:      SELECT * FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:407:        console.warn(`[causal-edges] touchEdgeAccess failed for edge ${edge.id}: ${e instanceof Error ? e.message : String(e)}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:413:    console.warn(`[causal-edges] getEdgesTo error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:423:      SELECT * FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:432:    console.warn(`[causal-edges] getAllEdges error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:521:        console.warn('[causal-edges] updateEdge rejected non-finite strength');
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:543:          'SELECT strength FROM causal_edges WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:551:        `UPDATE causal_edges SET ${parts.join(', ')} WHERE id = ?`
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:573:    console.warn(`[causal-edges] updateEdge error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:583:      'DELETE FROM causal_edges WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:591:    console.warn(`[causal-edges] deleteEdge error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:603:    DELETE FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:622:    const total = (db.prepare('SELECT COUNT(*) as count FROM causal_edges') as Database.Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:623:    const byRelation = (db.prepare('SELECT relation, COUNT(*) as count FROM causal_edges GROUP BY relation') as Database.Statement).all() as Array<{ relation: string; count: number }>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:624:    const avgStrength = (db.prepare('SELECT AVG(strength) as avg FROM causal_edges') as Database.Statement).get() as { avg: number | null };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:625:    const sources = (db.prepare('SELECT COUNT(DISTINCT source_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:626:    const targets = (db.prepare('SELECT COUNT(DISTINCT target_id) as count FROM causal_edges') as Database.Statement).get() as { count: number };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:642:    console.warn(`[causal-edges] getGraphStats error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:652:      SELECT ce.* FROM causal_edges ce
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:658:    console.warn(`[causal-edges] findOrphanedEdges error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:678:    console.warn(`[causal-edges] cleanupOrphanedEdges error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:688: * Create causal relationship chain between spec folder documents.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:763:    console.warn(`[causal-edges] getWeightHistory error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:776:        'SELECT strength FROM causal_edges WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:811:        'UPDATE causal_edges SET strength = ? WHERE id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:827:    console.warn(`[causal-edges] rollbackWeights error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:840:      SELECT COUNT(*) as count FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:846:    console.warn(`[causal-edges] countEdgesForNode error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:854:    "UPDATE causal_edges SET last_accessed = datetime('now') WHERE id = ?"
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:862:      SELECT * FROM causal_edges
.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:869:    console.warn(`[causal-edges] getStaleEdges error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/document-helpers.ts:19: * @returns Importance weight used during indexing and lineage writes.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:35:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:48:      sessionId: scope?.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:10:// Feature catalog: SHA-256 content-hash deduplication
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:11:// Feature catalog: Canonical ID dedup hardening
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:22:  ['session_id', 'sessionId'],
.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:60:    sessionId: normalizeScopeMatchValue(scope.sessionId),
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:21:  causalLinks?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:90: * reliable retrieval via the `memory_match_triggers` tool. The scoring
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:262: *   - Unresolved/self causal references       → up to -0.25
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:326:  const causalLinks = metadata.causalLinks && typeof metadata.causalLinks === 'object'
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:327:    ? metadata.causalLinks
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:338:  if (causalLinks) {
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:339:    const flattenedReferences = Object.values(causalLinks)
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:356:        issues.push(`Self-referential causal links found: ${selfReferences.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:359:        issues.push(`Unresolved causal link references: ${unresolvedReferences.join(', ')}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:30:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:41:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:46:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:68:  sessionId: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:309:    sessionId: session_id = null
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:378:            sessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:428:          sessionId: normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:441:          ? `Call task_postflight with taskId: "${taskId}", sessionId: "${normalizedSessionId}" after completing the task`
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:467:    sessionId: session_id = null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:518:      `Multiple open preflight records found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to disambiguate postflight.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:526:      `Multiple completed learning cycles found for spec_folder="${spec_folder}" and task_id="${taskId}". Provide sessionId to update the intended record.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:539:      { specFolder: spec_folder, taskId: taskId, sessionId: normalizedSessionId }
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:615:          sessionId: (preflightRecord.session_id as string | null) ?? normalizedSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:663:    sessionId: session_id,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-learning.ts:719:        sessionId: (row.session_id as string | null) ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:13:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:94:    // T2-5 transaction wrapper — wraps single-delete path (memory delete, causal edge
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:115:        causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:116:        causalEdges.deleteEdgesForMemory(String(numericId));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:191:    causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:211:          causalEdges.deleteEdgesForMemory(String(memory.id));
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
.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:193:  return { causalLinksResult, enrichmentStatus };
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:41: * Normalized history event shape for lineage backfill/replay helpers.
.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts:357: * Returns chronological history events for lineage backfill/replay helpers.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:89:  deduplicateResults as deduplicateWithSessionState,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:145:  dedupStats: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:200:  rerank?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:466:    dedupStats: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:467:      ...dedupStats,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517:    rerank = true, // Enable reranking by default for better result quality
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:742:    rerank,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:795:      rerank,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:952:    if (pipelineResult.metadata.stage3.rerankApplied) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:953:      extraData.rerankMetadata = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:954:        reranking_enabled: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:955:        reranking_requested: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:956:        reranking_applied: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1063:      data.results = deduped.results as SessionAwareResult[];
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1064:      data.count = deduped.results.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1079:        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1086:    // P1-018 — Validate response shape before dedup. If the cached response
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1087:    // Doesn't have the expected data.results array, log a warning and skip dedup
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1088:    // Rather than silently falling through to the un-deduped response.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1095:      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1097:      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1101:      const { results: dedupedResults } = applySessionDedup(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1108:      const dedupedCount = dedupedResults.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1109:      const filteredCount = originalCount - dedupedCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1116:      data.results = dedupedResults;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1117:      data.count = dedupedCount;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1119:      const dedupStats = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1123:        returnedCount: dedupedCount,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1129:      resultsData.dedupStats = dedupStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1132:        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1283:  // REQ-014: Query flow tracking + result_cited for includeContent searches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1284:  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1312:        // Track query flow — detects reformulations and same-topic re-queries
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1317:        // Log result_cited for includeContent searches (content was embedded = cited)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:87:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:124:  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:203:  preservesAuthority: 'session_bootstrap';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:325:    preservesAuthority: 'session_bootstrap',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:386:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:397:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:109:  dedup: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:242:  const dedupDuplicatesSkipped = mergedFiles.length - files.length;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:243:  if (dedupDuplicatesSkipped > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:244:    console.error(`[memory-index-scan] Canonical dedup skipped ${dedupDuplicatesSkipped} alias path(s) (${mergedFiles.length} -> ${files.length})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:355:    dedup: {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:358:      duplicatesSkipped: dedupDuplicatesSkipped,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:506:  // Create causal chains between spec folder documents.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:534:        const { createSpecDocumentChain, init: initCausalEdges } = await import('../lib/storage/causal-edges.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:567:          console.error(`[memory-index-scan] Spec 126: Created ${chainsCreated} causal chain edges across ${foldersProcessed} spec folders`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:603:  if (results.dedup.duplicatesSkipped > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:604:    hints.push(`Canonical dedup skipped ${results.dedup.duplicatesSkipped} alias path(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:645:              dedupSkipped: dedupDuplicatesSkipped,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:74:  causalLinks?: Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:134:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:180:  sessionId?: string | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:56:  causalLinksResult: CausalLinksResult | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:124:  causalLinksResult,
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
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:11:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:12:import type { CausalChainNode, CausalEdge } from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:25:// Feature catalog: Causal graph statistics (memory_causal_stats)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:35:  id: number;               // T202: causal_edges.id for unlink workflow
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:103:  tool: 'memory_drift_why' | 'memory_causal_link' | 'memory_causal_stats' | 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338:/** Handle memory_drift_why tool - traces causal relationships for a given memory */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:378:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:381:      const validRelations: string[] = Object.values(causalEdges.RELATION_TYPES) as string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:408:        const forwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:409:        const backwardTree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:413:        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'forward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:416:        const tree = causalEdges.getCausalChain(String(memoryId), maxDepth, 'backward');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:484:        summary: `No causal relationships found for memory ${memoryId}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:490:          'Use memory_causal_link to create relationships',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:504:      ? `Found ${combinedChain.total_edges} causal relationships (${relationSummary.join('; ')})`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:505:      : `Found ${combinedChain.total_edges} causal relationships`;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:513:        `Traversal truncated after ${combinedChain.truncation_limit ?? causalEdges.MAX_EDGES_LIMIT} edges per node - results may be incomplete`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557:/** Handle memory_causal_link tool - creates a causal edge between two memories */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:576:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:581:        validRelations: Object.values(causalEdges.RELATION_TYPES) as string[]
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:584:        hint: 'Provide all required parameters to create a causal link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:588:          `relation: One of ${Object.values(causalEdges.RELATION_TYPES).join(', ')}`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:603:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:607:        recovery: getRecoveryHint('memory_causal_link', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:611:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:613:    const validRelations = Object.values(causalEdges.RELATION_TYPES) as string[];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:616:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:620:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_INVALID_RELATION),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:624:    const safeRelation = relation as causalEdges.RelationType;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:625:    const edge = causalEdges.insertEdge(String(sourceId), String(targetId), safeRelation, strength ?? 1.0, evidence ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:629:        tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:633:        recovery: getRecoveryHint('memory_causal_link', ErrorCodes.CAUSAL_GRAPH_ERROR),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:639:      tool: 'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:640:      summary: `Created causal link: ${sourceId} --[${relation}]--> ${targetId}`,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:647:        'Use memory_causal_stats() to check overall graph coverage'
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:653:      'memory_causal_link',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:667:/** Handle memory_causal_stats tool - returns graph coverage and health metrics */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:678:        tool: 'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:682:        recovery: getRecoveryHint('memory_causal_stats', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:686:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:688:    const stats = causalEdges.getGraphStats();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:689:    const orphanedEdges: CausalEdge[] = causalEdges.findOrphanedEdges();
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:698:        'SELECT DISTINCT source_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = source_id) UNION SELECT DISTINCT target_id FROM causal_edges WHERE EXISTS (SELECT 1 FROM memory_index WHERE CAST(id AS TEXT) = target_id)'
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:705:      if (message.includes('no such table') && message.includes('causal_edges')) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:706:        // New/partially initialized DB where causal edges table is absent.
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:725:      hints.push(`Coverage ${coveragePercent}% below 60% target - add more causal links`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:731:      hints.push('No causal links exist yet - use memory_causal_link to create relationships');
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:735:      tool: 'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:755:      'memory_causal_stats',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:769:/** Handle memory_causal_unlink tool - deletes a causal edge by ID */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:776:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:784:          'Use memory_causal_stats() to see graph overview'
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:799:        tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:803:        recovery: getRecoveryHint('memory_causal_unlink', 'E020'),
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:807:    causalEdges.init(db);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:809:    const result: { deleted: boolean } = { deleted: causalEdges.deleteEdge(edgeId) };
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:812:      ? `Deleted causal edge ${edgeId}`
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:821:      tool: 'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:829:      'memory_causal_unlink',
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:853:const handle_memory_causal_link = handleMemoryCausalLink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:854:const handle_memory_causal_stats = handleMemoryCausalStats;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:855:const handle_memory_causal_unlink = handleMemoryCausalUnlink;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:859:  handle_memory_causal_link,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:860:  handle_memory_causal_stats,
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:861:  handle_memory_causal_unlink,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:123:    hints.push('Structural context is stale. Call session_bootstrap to refresh, or run code_graph_scan for a full rescan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:125:    hints.push('No structural context available. Call session_bootstrap first, then run code_graph_scan.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:128:    hints.push('No tool calls in >60 min. Consider calling `memory_context` to refresh session state.');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:5:// from concrete sub-modules (./dedup, ./embedding-pipeline, etc.).
.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:30:export { checkExistingRow, checkContentHashDedup } from './dedup.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:22:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:502:  // Never invoked at runtime. Wire it into autoRepair so orphaned causal edges
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:506:      // Fix F8 — ensure causal-edges DB init before orphan cleanup.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:507:      causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:508:      const orphanResult = causalEdges.cleanupOrphanedEdges();
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:512:        hints.push(`Auto-repair: removed ${orphanResult.deleted} orphaned causal edge(s)`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:400:/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:402:  // F052: Record memory recovery metric for session_resume
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:472:  const structuralContext = buildStructuralBootstrapContract('session_resume');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:474:    hints.push(`Structural context is ${structuralContext.status}. Call session_bootstrap to refresh.`);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:487:    logCachedSummaryDecision('session_resume', cachedSummaryDecision);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:570:      producer: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:571:      sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:580:    sourceSurface: 'session_resume',
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:3:description: "Decomposed pipeline modules for the memory_save MCP tool handler, covering dedup, embedding, PE gating, record creation, reconsolidation and response assembly."
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:27:`handlers/save/` contains the decomposed pipeline for the `memory_save` MCP tool. Each file owns a single stage of the save flow, from deduplication through embedding generation, save quality gating, prediction-error gating, reconsolidation, record creation, post-insert enrichment, and final response assembly.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:39:| `dedup.ts`                  | Pre-save deduplication. `checkExistingRow` matches by file path but returns `unchanged` only for healthy rows (`success`, `pending`, `partial`); `checkContentHashDedup` matches by content hash and accepts chunked parents only when their status is valid `partial`. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:45:| `post-insert.ts`            | Post-insert enrichment pipeline. Runs causal links processing, R10 entity extraction, R8 summary generation and S5 cross-document entity linking. Each step is feature-flag gated and independently error-guarded. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:46:| `response-builder.ts`       | Final response assembly. `buildIndexResult` constructs the `IndexResult` with PE actions, causal links and warnings. `buildSaveResponse` wraps it in a standard MCP success envelope with hints, triggers post-mutation hooks and runs N3-lite consolidation. |
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:53:1. dedup          -- Skip if unchanged or duplicate content hash
.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:60:8. post-insert    -- Enrich with entities, summaries, causal links
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:36:import { createAppendOnlyMemoryRecord, recordLineageVersion } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:37:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:81:import { checkExistingRow, checkContentHashDedup } from './save/dedup.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:100:import { resolveMemoryReference } from './causal-links-processor.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:189:    causalLinks: parsed.causalLinks,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:280:    const warning = 'Manual fallback save mode detected; standard generate-context template markers are missing.';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:417:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:421:  causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:424:    causalEdges.RELATION_TYPES.SUPERSEDES,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:725:    // NOTE: Content-hash dedup (C5-1) moved inside BEGIN IMMEDIATE transaction
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:754:              sessionId: scope.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:908:    // A4 FIX: Wrap dedup-check + insert in a single transaction for DB-level
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:916:    // C5-1: Content-hash dedup check BEFORE the write transaction — reads are
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1013:    // POST-INSERT ENRICHMENT: causal links, entities, summaries, entity linking
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1014:    const { causalLinksResult, enrichmentStatus } = await runPostInsertEnrichment(database, id, parsed);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1028:      causalLinksResult,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1043:/** Parse, validate, and index a memory file with PE gating, FSRS scheduling, and causal links */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1109:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1140:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1156:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1169:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1179:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1269:    sessionId: governanceDecision.normalized.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1468:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1500:      // (vec_memories, BM25 index, causal edges, projections, etc.)
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:12:import * as causalEdges from '../../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:16:import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:38:  causalSupersedesMemoryId: number | null;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:49:      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:59:      causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:66:    causalSupersedesMemoryId: null,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:80:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:84:  causalEdges.insertEdge(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:87:    causalEdges.RELATION_TYPES.SUPERSEDES,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:105:  const sessionId = normalizeScopeMatchValue(scope.sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:131:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:132:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:176:    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:177:    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:178:    const transitionEvent = lineageRouting.transitionEvent;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:261:      lineageRouting.causalSupersedesMemoryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:33:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:58:      sessionId: args.sessionId,
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
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:28:  sessionId: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:79:    if (!args.sessionId || typeof args.sessionId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:80:      return errorResponse('sessionId is required and must be a string');
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:112:        sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts:172:              sessionId: args.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:8:import { recordLineageTransition } from '../lib/storage/lineage-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:63:/** Find memories with similar embeddings for PE gating deduplication */
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:64:function findSimilarMemories(embedding: Float32Array | null, options: { limit?: number; specFolder?: string | null; tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null } = {}): SimilarMemory[] {
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:65:  const { limit = 5, specFolder = null, tenantId = null, userId = null, agentId = null, sessionId = null, sharedSpaceId = null } = options;
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:101:        // H9 FIX: Filter by sessionId to prevent false duplicate/supersede decisions across sessions
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:102:        if (!matchesScopedValue(sessionId, r.session_id)) continue;
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:12:import * as causalEdges from '../lib/storage/causal-edges.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:17:// Feature catalog: Causal edge creation (memory_causal_link)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:18:// Feature catalog: Causal edge deletion (memory_causal_unlink)
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:26:  relation: typeof causalEdges.RELATION_TYPES[keyof typeof causalEdges.RELATION_TYPES];
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:67:  caused_by: { relation: causalEdges.RELATION_TYPES.CAUSED, reverse: true },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:68:  supersedes: { relation: causalEdges.RELATION_TYPES.SUPERSEDES, reverse: false },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:69:  derived_from: { relation: causalEdges.RELATION_TYPES.DERIVED_FROM, reverse: false },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:70:  blocks: { relation: causalEdges.RELATION_TYPES.ENABLED, reverse: true },
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:71:  related_to: { relation: causalEdges.RELATION_TYPES.SUPPORTS, reverse: false }
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:340:/** Process causal link declarations from a memory file and insert edges into the graph */
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:341:function processCausalLinks(database: BetterSqlite3.Database, memoryId: number, causalLinks: CausalLinks): CausalLinksResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:350:  if (!causalLinks || typeof causalLinks !== 'object') {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:354:  // Initialize causal-edges module with database connection
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:355:  causalEdges.init(database);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:359:  for (const references of Object.values(causalLinks)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:366:  for (const [link_type, references] of Object.entries(causalLinks)) {
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:373:      console.warn(`[causal-links] Unknown link type: ${link_type}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:387:        console.warn(`[causal-links] Failed to resolve reference "${reference}": ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:402:        causalEdges.insertEdge(edgeSourceId, edgeTargetId, mapping.relation, 1.0, `Auto-extracted from ${link_type} in memory file`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:404:        console.error(`[causal-links] Inserted edge: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:408:          console.error(`[causal-links] Edge already exists: ${edgeSourceId} -[${mapping.relation}]-> ${edgeTargetId}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:411:          console.warn(`[causal-links] Failed to insert edge: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:92:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:661:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:688:      actor: sessionId ?? 'memory_validate',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:741:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:38:- `causal-graph.ts` - Causal link, unlink, stats, and drift-why handlers.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:56:- `pe-gating.ts` - Prediction-error save arbitration helpers, document weighting, and lineage-aware update paths.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:59:- `causal-links-processor.ts`, `chunking-orchestrator.ts` - Save/index support helpers.
.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:69:- `pe-gating.ts` now leans on `lib/storage/document-helpers.ts` for document-aware weights and keeps content-hash-aware update paths aligned with lineage and incremental-index state.
.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:171:  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:76:type CausalGraphModule = typeof import('./causal-graph.js');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:94:let causalGraphModule: Promise<CausalGraphModule> | null = null;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:179:  if (!causalGraphModule) {
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:180:    causalGraphModule = loadHandlerModule<CausalGraphModule>('causal-graph');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:182:  return causalGraphModule;
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:315:export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:316:export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts:62:      session_id: input.sessionId ?? null,

codex
Validation succeeded, but it confirms the same operational reality as the previous pass: the phase validates as Level 1 here and the sandbox blocks the temp-file creation path that the script tries to use. I’m treating that as an environment artifact, not a research blocker, and I’m now reading the exact function bodies around session creation, context formatting, prompt capture, search, and project scoping to isolate real paradigm shifts.
exec
/bin/zsh -lc "sed -n '920,1115p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
		args = append(args, normalizeScope(scope))
	}

	query += " ORDER BY o.created_at DESC LIMIT ?"
	args = append(args, limit)

	return s.queryObservations(query, args...)
}

// SessionObservations returns all observations for a specific session.
func (s *Store) SessionObservations(sessionID string, limit int) ([]Observation, error) {
	if limit <= 0 {
		limit = 200
	}

	query := `
		SELECT id, ifnull(sync_id, '') as sync_id, session_id, type, title, content, tool_name, project,
		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
		FROM observations
		WHERE session_id = ? AND deleted_at IS NULL
		ORDER BY created_at ASC
		LIMIT ?
	`
	return s.queryObservations(query, sessionID, limit)
}

// ─── Observations ────────────────────────────────────────────────────────────

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

func (s *Store) RecentObservations(project, scope string, limit int) ([]Observation, error) {
	// Normalize project filter for case-insensitive matching
	project, _ = NormalizeProject(project)

	if limit <= 0 {
		limit = s.cfg.MaxContextResults
	}

	query := `
		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
		FROM observations o
		WHERE o.deleted_at IS NULL
	`
	args := []any{}

	if project != "" {
		query += " AND o.project = ?"
		args = append(args, project)
	}
	if scope != "" {
		query += " AND o.scope = ?"
		args = append(args, normalizeScope(scope))
	}

	query += " ORDER BY o.created_at DESC LIMIT ?"
	args = append(args, limit)

	return s.queryObservations(query, args...)
}

// ─── User Prompts ────────────────────────────────────────────────────────────

func (s *Store) AddPrompt(p AddPromptParams) (int64, error) {
	// Normalize project name before storing
	p.Project, _ = NormalizeProject(p.Project)

	content := stripPrivateTags(p.Content)
	if len(content) > s.cfg.MaxObservationLength {
		content = content[:s.cfg.MaxObservationLength] + "... [truncated]"

exec
/bin/zsh -lc "sed -n '1470,1655p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
			&sr.ToolName, &sr.Project, &sr.Scope, &sr.TopicKey, &sr.RevisionCount, &sr.DuplicateCount,
			&sr.LastSeenAt, &sr.CreatedAt, &sr.UpdatedAt, &sr.DeletedAt,
			&sr.Rank,
		); err != nil {
			return nil, err
		}
		if !seen[sr.ID] {
			results = append(results, sr)
		}
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(results) > limit {
		results = results[:limit]
	}
	return results, nil
}

// ─── Stats ───────────────────────────────────────────────────────────────────

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

exec
/bin/zsh -lc "sed -n '3201,3515p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
	}
	if hasAny(text, "decision", "tradeoff", "chose", "choose", "decide") {
		return "decision"
	}
	if hasAny(text, "pattern", "convention", "naming", "guideline") {
		return "pattern"
	}
	if hasAny(text, "config", "setup", "environment", "env", "docker", "pipeline") {
		return "config"
	}
	if hasAny(text, "discovery", "investigate", "investigation", "found", "root cause") {
		return "discovery"
	}
	if hasAny(text, "learned", "learning") {
		return "learning"
	}

	if t != "" && t != "manual" {
		return normalizeTopicSegment(t)
	}

	return "topic"
}

func hasAny(text string, words ...string) bool {
	for _, w := range words {
		if strings.Contains(text, w) {
			return true
		}
	}
	return false
}

func normalizeTopicSegment(s string) string {
	v := strings.ToLower(strings.TrimSpace(s))
	if v == "" {
		return ""
	}
	re := regexp.MustCompile(`[^a-z0-9]+`)
	v = re.ReplaceAllString(v, " ")
	v = strings.Join(strings.Fields(v), "-")
	if len(v) > 100 {
		v = v[:100]
	}
	return v
}

func normalizeTopicKey(topic string) string {
	v := strings.TrimSpace(strings.ToLower(topic))
	if v == "" {
		return ""
	}
	v = strings.Join(strings.Fields(v), "-")
	if len(v) > 120 {
		v = v[:120]
	}
	return v
}

func derefString(v *string) string {
	if v == nil {
		return ""
	}
	return *v
}

func hashNormalized(content string) string {
	normalized := strings.ToLower(strings.Join(strings.Fields(content), " "))
	h := sha256.Sum256([]byte(normalized))
	return hex.EncodeToString(h[:])
}

func dedupeWindowExpression(window time.Duration) string {
	if window <= 0 {
		window = 15 * time.Minute
	}
	minutes := int(window.Minutes())
	if minutes < 1 {
		minutes = 1
	}
	return "-" + strconv.Itoa(minutes) + " minutes"
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func normalizeSyncTargetKey(targetKey string) string {
	if strings.TrimSpace(targetKey) == "" {
		return DefaultSyncTargetKey
	}
	return strings.TrimSpace(strings.ToLower(targetKey))
}

func newSyncID(prefix string) string {
	b := make([]byte, 8)
	if _, err := rand.Read(b); err != nil {
		return fmt.Sprintf("%s-%d", prefix, time.Now().UTC().UnixNano())
	}
	return prefix + "-" + hex.EncodeToString(b)
}

func normalizeExistingSyncID(existing, prefix string) string {
	if strings.TrimSpace(existing) != "" {
		return existing
	}
	return newSyncID(prefix)
}

// privateTagRegex matches <private>...</private> tags and their contents.
// Supports multiline and nested content. Case-insensitive.
var privateTagRegex = regexp.MustCompile(`(?is)<private>.*?</private>`)

// stripPrivateTags removes all <private>...</private> content from a string.
// This ensures sensitive information (API keys, passwords, personal data)
// is never persisted to the memory database.
func stripPrivateTags(s string) string {
	result := privateTagRegex.ReplaceAllString(s, "[REDACTED]")
	// Clean up multiple consecutive [REDACTED] and excessive whitespace
	result = strings.TrimSpace(result)
	return result
}

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

exec
/bin/zsh -lc "sed -n '250,620p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "sed -n '760,920p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
		WHERE 1=1
	`
	args := []any{}

	if project != "" {
		query += " AND s.project = ?"
		args = append(args, project)
	}

	query += " GROUP BY s.id ORDER BY MAX(COALESCE(o.created_at, s.started_at)) DESC LIMIT ?"
	args = append(args, limit)

	rows, err := s.queryItHook(s.db, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []SessionSummary
	for rows.Next() {
		var ss SessionSummary
		if err := rows.Scan(&ss.ID, &ss.Project, &ss.StartedAt, &ss.EndedAt, &ss.Summary, &ss.ObservationCount); err != nil {
			return nil, err
		}
		results = append(results, ss)
	}
	return results, rows.Err()
}

// AllSessions returns recent sessions ordered by most recent first (for TUI browsing).
func (s *Store) AllSessions(project string, limit int) ([]SessionSummary, error) {
	if limit <= 0 {
		limit = 50
	}

	query := `
		SELECT s.id, s.project, s.started_at, s.ended_at, s.summary,
		       COUNT(o.id) as observation_count
		FROM sessions s
		LEFT JOIN observations o ON o.session_id = s.id AND o.deleted_at IS NULL
		WHERE 1=1
	`
	args := []any{}

	if project != "" {
		query += " AND s.project = ?"
		args = append(args, project)
	}

	query += " GROUP BY s.id ORDER BY MAX(COALESCE(o.created_at, s.started_at)) DESC LIMIT ?"
	args = append(args, limit)

	rows, err := s.queryItHook(s.db, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []SessionSummary
	for rows.Next() {
		var ss SessionSummary
		if err := rows.Scan(&ss.ID, &ss.Project, &ss.StartedAt, &ss.EndedAt, &ss.Summary, &ss.ObservationCount); err != nil {
			return nil, err
		}
		results = append(results, ss)
	}
	return results, rows.Err()
}

// AllObservations returns recent observations ordered by most recent first (for TUI browsing).
func (s *Store) AllObservations(project, scope string, limit int) ([]Observation, error) {
	if limit <= 0 {
		limit = s.cfg.MaxContextResults
	}

	query := `
		SELECT o.id, ifnull(o.sync_id, '') as sync_id, o.session_id, o.type, o.title, o.content, o.tool_name, o.project,
		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
		FROM observations o
		WHERE o.deleted_at IS NULL
	`
	args := []any{}

	if project != "" {
		query += " AND o.project = ?"
		args = append(args, project)
	}
	if scope != "" {
		query += " AND o.scope = ?"
		args = append(args, normalizeScope(scope))

exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) (CreateSession|EndSession|RecentSessions|RecentPrompts|FormatContext|PassiveCapture|MergeProjects|NormalizeProject)|handleSession(Start|End|Summary)|handleCapturePassive|handleContext|handleSavePrompt|handleSearch|handleSave\\(\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/*.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:197:			handleSearch(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:260:			handleSave(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:371:			handleSavePrompt(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:395:			handleContext(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:511:			handleSessionSummary(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:538:			handleSessionStart(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:561:			handleSessionEnd(s),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:594:			handleCapturePassive(s, cfg),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625:func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:680:func handleSave(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:851:func handleSavePrompt(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:883:func handleContext(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1030:func handleSessionSummary(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1064:func handleSessionStart(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1084:func handleSessionEnd(s *store.Store) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1097:func handleCapturePassive(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754:func (s *Store) CreateSession(id, project, directory string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:770:func (s *Store) EndSession(id string, summary string) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:818:func (s *Store) RecentSessions(project string, limit int) ([]SessionSummary, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1145:func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613:func (s *Store) FormatContext(project, scope string) (string, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459:func (s *Store) MergeProjects(sources []string, canonical string) (*MergeResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3483:func (s *Store) PassiveCapture(p PassiveCaptureParams) (*PassiveCaptureResult, error) {

exec
/bin/zsh -lc "sed -n '1655,1755p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
	}
	if err := obsRows.Err(); err != nil {
		return nil, err
	}

	// Prompts
	promptRows, err := s.queryItHook(s.db,
		"SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts ORDER BY id",
	)
	if err != nil {
		return nil, fmt.Errorf("export prompts: %w", err)
	}
	defer promptRows.Close()
	for promptRows.Next() {
		var p Prompt
		if err := promptRows.Scan(&p.ID, &p.SyncID, &p.SessionID, &p.Content, &p.Project, &p.CreatedAt); err != nil {
			return nil, err
		}
		data.Prompts = append(data.Prompts, p)
	}
	if err := promptRows.Err(); err != nil {
		return nil, err
	}

	return data, nil
}

func (s *Store) Import(data *ExportData) (*ImportResult, error) {
	tx, err := s.beginTxHook()
	if err != nil {
		return nil, fmt.Errorf("import: begin tx: %w", err)
	}
	defer tx.Rollback()

	result := &ImportResult{}

	// Import sessions (skip duplicates)
	for _, sess := range data.Sessions {
		res, err := s.execHook(tx,
			`INSERT OR IGNORE INTO sessions (id, project, directory, started_at, ended_at, summary)

exec
/bin/zsh -lc "sed -n '620,1115p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
					// Cheap count query instead of full ListProjectsWithStats
					obsCount, _ := s.CountObservationsForProject(bestMatch)
					similarWarning = fmt.Sprintf("⚠️ Project %q has no memories. Similar project found: %q (%d memories). Consider using that name instead.", project, bestMatch, obsCount)
				}
			}
		}

		// Ensure the session exists
		s.CreateSession(sessionID, project, "")

		truncated := len(content) > s.MaxObservationLength()

		_, err := s.AddObservation(store.AddObservationParams{
			SessionID: sessionID,
			Type:      typ,
			Title:     title,
			Content:   content,
			Project:   project,
			Scope:     scope,
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
		}
		return mcp.NewToolResultText(msg), nil
	}
}

func handleDelete(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		id := int64(intArg(req, "id", 0))
		if id == 0 {
			return mcp.NewToolResultError("id is required"), nil
		}

		hardDelete := boolArg(req, "hard_delete", false)
		if err := s.DeleteObservation(id, hardDelete); err != nil {
			return mcp.NewToolResultError("Failed to delete memory: " + err.Error()), nil
		}

		mode := "soft-deleted"
		if hardDelete {
			mode = "permanently deleted"
		}
		return mcp.NewToolResultText(fmt.Sprintf("Memory #%d %s", id, mode)), nil
	}
}

func handleSavePrompt(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
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

		_, err := s.AddPrompt(store.AddPromptParams{
			SessionID: sessionID,
			Content:   content,
			Project:   project,
		})
		if err != nil {
			return mcp.NewToolResultError("Failed to save prompt: " + err.Error()), nil
		}

		return mcp.NewToolResultText(fmt.Sprintf("Prompt saved: %q", truncate(content, 80))), nil
	}
}

func handleContext(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		project, _ := req.GetArguments()["project"].(string)
		scope, _ := req.GetArguments()["scope"].(string)

		// Apply default project when LLM sends empty
		if project == "" {
			project = cfg.DefaultProject
		}
		project, _ = store.NormalizeProject(project)

		context, err := s.FormatContext(project, scope)
		if err != nil {
			return mcp.NewToolResultError("Failed to get context: " + err.Error()), nil
		}

		if context == "" {
			return mcp.NewToolResultText("No previous session memories found."), nil
		}

		stats, _ := s.Stats()
		var projects string
		if len(stats.Projects) > 0 {
			projects = strings.Join(stats.Projects, ", ")
		} else {
			projects = "none"
		}

		result := fmt.Sprintf("%s\n---\nMemory stats: %d sessions, %d observations across projects: %s",
			context, stats.TotalSessions, stats.TotalObservations, projects)

		return mcp.NewToolResultText(result), nil
	}
}

func handleStats(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		stats, err := loadMCPStats(s)
		if err != nil {
			return mcp.NewToolResultError("Failed to get stats: " + err.Error()), nil
		}

		var projects string
		if len(stats.Projects) > 0 {
			projects = strings.Join(stats.Projects, ", ")
		} else {
			projects = "none yet"
		}

		result := fmt.Sprintf("Memory System Stats:\n- Sessions: %d\n- Observations: %d\n- Prompts: %d\n- Projects: %s",
			stats.TotalSessions, stats.TotalObservations, stats.TotalPrompts, projects)

		return mcp.NewToolResultText(result), nil
	}
}

func handleTimeline(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		observationID := int64(intArg(req, "observation_id", 0))
		if observationID == 0 {
			return mcp.NewToolResultError("observation_id is required"), nil
		}
		before := intArg(req, "before", 5)
		after := intArg(req, "after", 5)

		result, err := s.Timeline(observationID, before, after)
		if err != nil {
			return mcp.NewToolResultError(fmt.Sprintf("Timeline error: %s", err)), nil
		}

		var b strings.Builder

		// Session header
		if result.SessionInfo != nil {
			summary := ""
			if result.SessionInfo.Summary != nil {
				summary = fmt.Sprintf(" — %s", truncate(*result.SessionInfo.Summary, 100))
			}
			fmt.Fprintf(&b, "Session: %s (%s)%s\n", result.SessionInfo.Project, result.SessionInfo.StartedAt, summary)
			fmt.Fprintf(&b, "Total observations in session: %d\n\n", result.TotalInRange)
		}

		// Before entries
		if len(result.Before) > 0 {
			b.WriteString("─── Before ───\n")
			for _, e := range result.Before {
				fmt.Fprintf(&b, "  #%d [%s] %s — %s\n", e.ID, e.Type, e.Title, truncate(e.Content, 150))
			}
			b.WriteString("\n")
		}

		// Focus observation (highlighted)
		fmt.Fprintf(&b, ">>> #%d [%s] %s <<<\n", result.Focus.ID, result.Focus.Type, result.Focus.Title)
		fmt.Fprintf(&b, "    %s\n", truncate(result.Focus.Content, 500))
		fmt.Fprintf(&b, "    %s\n\n", result.Focus.CreatedAt)

		// After entries
		if len(result.After) > 0 {
			b.WriteString("─── After ───\n")
			for _, e := range result.After {
				fmt.Fprintf(&b, "  #%d [%s] %s — %s\n", e.ID, e.Type, e.Title, truncate(e.Content, 150))
			}
		}

		return mcp.NewToolResultText(b.String()), nil
	}
}

func handleGetObservation(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		id := int64(intArg(req, "id", 0))
		if id == 0 {
			return mcp.NewToolResultError("id is required"), nil
		}

		obs, err := s.GetObservation(id)
		if err != nil {
			return mcp.NewToolResultError(fmt.Sprintf("Observation #%d not found", id)), nil
		}

		project := ""
		if obs.Project != nil {
			project = fmt.Sprintf("\nProject: %s", *obs.Project)
		}
		scope := fmt.Sprintf("\nScope: %s", obs.Scope)
		topic := ""
		if obs.TopicKey != nil {
			topic = fmt.Sprintf("\nTopic: %s", *obs.TopicKey)
		}
		toolName := ""
		if obs.ToolName != nil {
			toolName = fmt.Sprintf("\nTool: %s", *obs.ToolName)
		}
		duplicateMeta := fmt.Sprintf("\nDuplicates: %d", obs.DuplicateCount)
		revisionMeta := fmt.Sprintf("\nRevisions: %d", obs.RevisionCount)

		result := fmt.Sprintf("#%d [%s] %s\n%s\nSession: %s%s%s\nCreated: %s",
			obs.ID, obs.Type, obs.Title,
			obs.Content,
			obs.SessionID, project+scope+topic, toolName+duplicateMeta+revisionMeta,
			obs.CreatedAt,
		)

		return mcp.NewToolResultText(result), nil
	}
}

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

exec
/bin/zsh -lc "sed -n '1115,1185p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

func handleMergeProjects(s *store.Store) server.ToolHandlerFunc {
	return func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
		fromStr, _ := req.GetArguments()["from"].(string)
		to, _ := req.GetArguments()["to"].(string)

		if fromStr == "" || to == "" {
			return mcp.NewToolResultError("both 'from' and 'to' are required"), nil
		}

		var sources []string
		for _, src := range strings.Split(fromStr, ",") {
			src = strings.TrimSpace(src)
			if src != "" {
				sources = append(sources, src)
			}
		}

		if len(sources) == 0 {
			return mcp.NewToolResultError("at least one source project name is required in 'from'"), nil
		}

		result, err := s.MergeProjects(sources, to)
		if err != nil {
			return mcp.NewToolResultError("Merge failed: " + err.Error()), nil
		}

		msg := fmt.Sprintf("Merged %d source(s) into %q:\n", len(result.SourcesMerged), result.Canonical)
		msg += fmt.Sprintf("  Observations moved: %d\n", result.ObservationsUpdated)
		msg += fmt.Sprintf("  Sessions moved:     %d\n", result.SessionsUpdated)
		msg += fmt.Sprintf("  Prompts moved:      %d\n", result.PromptsUpdated)

		return mcp.NewToolResultText(msg), nil
	}
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// defaultSessionID returns a project-scoped default session ID.
// If project is non-empty: "manual-save-{project}"
// If project is empty: "manual-save"
func defaultSessionID(project string) string {
	if project == "" {
		return "manual-save"
	}
	return "manual-save-" + project
}

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Bootstrap Handler
// ───────────────────────────────────────────────────────────────
// Phase 024 / Item 7: Composite tool that runs session_resume
// + session_health in one call, merging results with hints.

import { handleSessionResume } from './session-resume.js';
import type { CachedSessionSummaryDecision } from './session-resume.js';
import { handleSessionHealth } from './session-health.js';
import { recordBootstrapEvent } from '../lib/session/context-metrics.js';
import { buildStructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import type { StructuralBootstrapContract } from '../lib/session/session-snapshot.js';
import {
  attachStructuralTrustFields,
  buildStructuralContextTrust,
  createSharedPayloadEnvelope,
  summarizeUnknown,
  summarizeCertaintyContract,
  trustStateFromStructuralStatus,
  type SharedPayloadCertainty,
  type SharedPayloadEnvelope,
  type SharedPayloadSection,
  StructuralTrustPayloadError,
  type StructuralTrust,
} from '../lib/context/shared-payload.js';
import {
  buildOpenCodeTransportPlan,
  coerceSharedPayloadEnvelope,
  type OpenCodeTransportPlan,
} from '../lib/context/opencode-transport.js';
import {
  buildCodeGraphOpsContract,
  type CodeGraphOpsContract,
} from '../lib/code-graph/ops-hardening.js';
import type { MCPResponse } from '@spec-kit/shared/types';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionBootstrapArgs {
  specFolder?: string;
}

interface SessionBootstrapResult {
  resume: Record<string, unknown>;
  health: Record<string, unknown>;
  cachedSummary?: CachedSessionSummaryDecision;
  structuralContext?: StructuralBootstrapContract & StructuralTrust;
  structuralRoutingNudge?: {
    advisory: true;
    readiness: 'ready';
    preferredTool: 'code_graph_query';
    message: string;
    preservesAuthority: 'session_bootstrap';
  };
  payloadContract?: SharedPayloadEnvelope;
  opencodeTransport?: OpenCodeTransportPlan;
  graphOps?: CodeGraphOpsContract;
  hints: string[];
  nextActions: string[];
}

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

function extractData(response: MCPResponse): Record<string, unknown> {
  try {
    const text = response?.content?.[0]?.text;
    if (typeof text === 'string') {
      const parsed = JSON.parse(text);
      return parsed?.data ?? parsed ?? {};
    }
  } catch { /* parse failed */ }
  return {};
}

function extractHints(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.hints)) return data.hints as string[];
  return [];
}

function extractCachedSummary(
  data: Record<string, unknown>,
): CachedSessionSummaryDecision | null {
  const candidate = data.cachedSummary;
  if (candidate && typeof candidate === 'object') {
    return candidate as CachedSessionSummaryDecision;
  }
  return null;
}

function buildNextActions(
  resumeData: Record<string, unknown>,
  healthData: Record<string, unknown>,
  structuralContext: StructuralBootstrapContract,
): string[] {
  const nextActions = new Set<string>();

  if (resumeData.error) {
    nextActions.add('Call `session_resume({ specFolder })` directly to inspect the detailed resume failure.');
  }

  if (healthData.error) {
    nextActions.add('Call `session_health()` directly to inspect the current health-check failure.');
  }

  if (structuralContext.recommendedAction) {
    nextActions.add(structuralContext.recommendedAction);
  }

  if (structuralContext.status === 'ready') {
    nextActions.add('Use `session_resume({ specFolder })` when you need the fuller merged recovery payload.');
  } else if (structuralContext.status === 'stale') {
    nextActions.add('Run `code_graph_scan` if you need fresh structural context, then call `session_bootstrap()` again.');
  } else {
    nextActions.add('If structural context matters for this task, run `code_graph_scan` and then re-run `session_bootstrap()`.');
  }

  const healthStatus = typeof healthData.status === 'string' ? healthData.status : null;
  if (healthStatus === 'warning' || healthStatus === 'stale') {
    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
  }

  return [...nextActions].slice(0, 3);
}

function extractStructuralTrustFromPayload(
  payload: SharedPayloadEnvelope | null,
): StructuralTrust | null {
  if (!payload) {
    return null;
  }

  const structuralSection = payload.sections.find((section) =>
    section.key === 'structural-context' && section.structuralTrust,
  );

  return structuralSection?.structuralTrust ?? null;
}

function buildStructuralRoutingNudge(
  structuralContext: StructuralBootstrapContract,
): SessionBootstrapResult['structuralRoutingNudge'] | null {
  if (structuralContext.status !== 'ready') {
    return null;
  }

  return {
    advisory: true,
    readiness: 'ready',
    preferredTool: 'code_graph_query',
    message: 'Advisory only: when the next question is about callers, imports, dependencies, or outline, prefer `code_graph_query` before Grep or Glob.',
    preservesAuthority: 'session_bootstrap',
  };
}

/* ───────────────────────────────────────────────────────────────
   3. HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle session_bootstrap tool call — one-call session setup */
export async function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse> {
  const startMs = Date.now();
  const allHints: string[] = [];

  // Sub-call 1: session_resume with full resume payload
  let resumeData: Record<string, unknown> = {};
  try {
    const resumeResponse = await handleSessionResume({
      specFolder: args.specFolder,
    });
    resumeData = extractData(resumeResponse);
    allHints.push(...extractHints(resumeData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    resumeData = { error: message };
    allHints.push('session_resume failed. Try calling it manually.');
  }

  // Sub-call 2: session_health
  let healthData: Record<string, unknown> = {};
  try {
    const healthResponse = await handleSessionHealth();
    healthData = extractData(healthResponse);
    allHints.push(...extractHints(healthData));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    healthData = { error: message };
    allHints.push('session_health failed. Try calling it manually.');
  }

  // Phase 027: Structural bootstrap contract
  const structuralContext = buildStructuralBootstrapContract('session_bootstrap');
  if (structuralContext.status === 'stale' || structuralContext.status === 'missing') {
    allHints.push(
      `Structural context is ${structuralContext.status}. Run code_graph_scan if needed, then re-run session_bootstrap.`
    );
  }

  const cachedSummary = extractCachedSummary(resumeData);
  if (cachedSummary?.status === 'accepted') {
    allHints.push('Cached continuity summary accepted as additive bootstrap context.');
  }
  const structuralRoutingNudge = buildStructuralRoutingNudge(structuralContext);
  if (structuralRoutingNudge) {
    allHints.push(structuralRoutingNudge.message);
  }

  // Deduplicate hints
  const uniqueHints = [...new Set(allHints)];

  // Record bootstrap telemetry once for the composite call.
  const durationMs = Date.now() - startMs;
  const completeness = resumeData.error || healthData.error ? 'partial' : 'full';
  recordBootstrapEvent('tool', durationMs, completeness);

  const resumeCertainty: SharedPayloadCertainty = resumeData.error ? 'unknown' : 'estimated';
  const healthCertainty: SharedPayloadCertainty = healthData.error ? 'unknown' : 'estimated';
  const cachedCertainty: SharedPayloadCertainty = cachedSummary?.status === 'accepted' ? 'estimated' : 'defaulted';
  const structuralCertainty: SharedPayloadCertainty = 'exact';
  const nextActionsCertainty: SharedPayloadCertainty = 'defaulted';
  const resumePayload = coerceSharedPayloadEnvelope(resumeData.payloadContract);
  const healthPayload = coerceSharedPayloadEnvelope(healthData.payloadContract);
  const structuralSnapshotTrust = buildStructuralContextTrust(structuralContext);
  const resumeStructuralTrust = extractStructuralTrustFromPayload(resumePayload);
  if (!resumeData.error && !resumeStructuralTrust) {
    throw new StructuralTrustPayloadError(
      'session_bootstrap expected session_resume to emit structural-context.structuralTrust.',
    );
  }
  const structuralContextWithTrust = attachStructuralTrustFields(
    structuralContext,
    structuralSnapshotTrust,
    { label: 'session_bootstrap structural context payload' },
  );
  const resumeWithTrust = resumeData.error
    ? resumeData
    : attachStructuralTrustFields(
      resumeData,
      resumeStructuralTrust,
      { label: 'session_bootstrap resume payload' },
    );

  const payloadSections: SharedPayloadSection[] = [
    {
      key: 'resume-surface',
      title: 'Resume Surface',
      content: summarizeUnknown(resumeData),
      source: 'memory',
      certainty: resumeCertainty,
    },
  ];
  if (cachedSummary?.status === 'accepted' && cachedSummary.cachedSummary) {
    payloadSections.push({
      key: 'cached-continuity',
      title: 'Cached Continuity',
      content: [
        cachedSummary.cachedSummary.continuityText,

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
  if (!producerMetadata) {
    return rejectCachedSummary(
      'fidelity',
      'missing_producer_metadata',
      'Producer metadata from packet 002 was missing, so cached continuity cannot be trusted.',
    );
  }

  const transcript = producerMetadata.transcript;
  const cacheTokens = producerMetadata.cacheTokens;
  const producerTurnMs = parseIsoMs(producerMetadata.lastClaudeTurnAt);
  if (
    producerTurnMs === null
    || !transcript
    || typeof transcript.path !== 'string'
    || transcript.path.trim().length === 0
    || typeof transcript.fingerprint !== 'string'
    || transcript.fingerprint.trim().length === 0
    || !isFiniteNonNegativeNumber(transcript.sizeBytes)
    || parseIsoMs(transcript.modifiedAt) === null
    || !cacheTokens
    || !isFiniteNonNegativeNumber(cacheTokens.cacheCreationInputTokens)
    || !isFiniteNonNegativeNumber(cacheTokens.cacheReadInputTokens)
  ) {
    return rejectCachedSummary(
      'fidelity',
      'missing_required_fields',
      'Producer metadata was missing required transcript identity or cache token fields.',
    );
  }

  let transcriptStat: ReturnType<typeof statSync>;
  try {
    transcriptStat = statSync(transcript.path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return rejectCachedSummary(
      'fidelity',
      'transcript_unreadable',
      `Transcript identity could not be confirmed because the transcript was unreadable: ${message}`,

exec
/bin/zsh -lc "sed -n '430,760p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '340,470p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  let cognitiveStats: CognitiveStats | null = null;

  if (useCognitive) {
    // Step 3: ACTIVATE (T209)
    const activatedMemories: number[] = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(match.memoryId);
        // T209: Persist max attention boost for matched memories.
        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
        activatedMemories.push(match.memoryId);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
      }
    }

    // Step 4: CO-ACTIVATE
    const coActivatedMemories: CoActivatedMemory[] = [];
    if (coActivation.isEnabled()) {
      for (const memoryId of activatedMemories) {
        try {
          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
            .map(r => ({ memoryId: r.id }));
          if (boosted && Array.isArray(boosted)) {
            coActivatedMemories.push(...boosted);
          }
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
        }
      }
    }

    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
    const fullRecords = fetchMemoryRecords(matchedIds);

    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));

    const turnDecayFactor = turnNumber > 1
      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
      : 1.0;

    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
      const fullRecord = fullRecords.get(match.memoryId);
      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);

      let attentionScore: number;
      let tier: string;

      if (fullRecord) {
        const classification = tierClassifier.classifyTier(fullRecord);
        let effectiveRetrievability = classification.retrievability;

        if (wmEntry) {
          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
        } else {
          effectiveRetrievability *= turnDecayFactor;
        }

        attentionScore = effectiveRetrievability;
        tier = tierClassifier.classifyState(effectiveRetrievability);
      } else {
        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
        tier = tierClassifier.classifyState(attentionScore);
      }

      // Clamp to [0,1] — retrievability * decay or wmEntry scores
      // Can drift outside the valid range due to floating-point arithmetic.
      attentionScore = Math.max(0, Math.min(1, attentionScore));

      return {
        ...match,
        attentionScore: attentionScore,
        tier,
        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);

    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
      const content: string = await getTieredContent({
        filePath: r.filePath,
        title: r.title,
        triggerPhrases: r.matchedPhrases
      }, r.tier);

      return {
        memoryId: r.memoryId,
        specFolder: r.specFolder,
        filePath: r.filePath,
        title: r.title,
        matchedPhrases: r.matchedPhrases,
        importanceWeight: r.importanceWeight,
        tier: r.tier,
        attentionScore: r.attentionScore,
        content: content,
        coActivated: r.coActivated || false
      };
    }));

    cognitiveStats = {
      enabled: true,
      sessionId: sessionId!,
      turnNumber: turnNumber,

 succeeded in 0ms:

// filterByMinQualityScore, resolveQualityThreshold, buildCacheArgs,
// resolveArtifactRoutingQuery, applyArtifactRouting — now imported from lib/search/search-utils.ts
// CacheArgsInput — now imported from lib/search/search-utils.ts
// parseNullableInt, collapseAndReassembleChunkResults — now imported from lib/search/chunk-reassembly.ts

/* ───────────────────────────────────────────────────────────────
   3. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Sections 3–5 (STATE_PRIORITY, MAX_DEEP_QUERY_VARIANTS, buildDeepQueryVariants,
// StrengthenOnAccess, applyTestingEffect, filterByMemoryState) removed in
// These were only used by the legacy V1 pipeline.
// The V2 4-stage pipeline handles state filtering (Stage 4), testing effect, and
// Query expansion through its own stages.

/* ───────────────────────────────────────────────────────────────
   6. SESSION DEDUPLICATION UTILITIES
──────────────────────────────────────────────────────────────── */

function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
    return {
      results,
      dedupStats: { enabled: false, sessionId: null }
    };
  }

  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);

  if (filtered.length > 0) {
    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
  }

  return {
    results: filtered as MemorySearchRow[],
    dedupStats: {
      ...dedupStats,
      sessionId
    }
  };
}

// Sections 7–9 (applyCrossEncoderReranking, applyIntentWeightsToResults,
// ShouldApplyPostSearchIntentWeighting, postSearchPipeline) removed in
// These were only used by the legacy V1 pipeline
// Path. The V2 4-stage pipeline handles all equivalent functionality.

/* ───────────────────────────────────────────────────────────────
   10. MAIN HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
 * @returns MCP response with ranked search results
 */
async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
  const _searchStartTime = Date.now();
  resetLastLexicalCapabilitySnapshot();
  // BUG-001: Check for external database updates before processing
  await checkDatabaseUpdated();

  const {
    cursor,
    query,
    concepts,
    specFolder,
    folderBoost,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
    applyStateLimits: applyStateLimits = false,
    rerank = true, // Enable reranking by default for better result quality
    applyLengthPenalty: applyLengthPenalty = true,
    trackAccess: trackAccess = false, // opt-in, off by default
    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
    minQualityScore,
    min_quality_score,
    mode,
    includeTrace: includeTraceArg = false,
    sessionTransition,
    profile,
    retrievalLevel: retrievalLevel = 'auto',
  } = args;
  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
  const includeTrace = includeTraceByFlag || includeTraceArg === true;
  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
  const progressiveScopeKey = JSON.stringify({
    tenantId: normalizedScope.tenantId ?? null,
    userId: normalizedScope.userId ?? null,
    agentId: normalizedScope.agentId ?? null,
    sessionId: normalizedScope.sessionId ?? null,
    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
  });

  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
  const hasQuery = typeof query === 'string' && query.trim().length > 0;
  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
  if (!hasCursor && !hasQuery && !hasConcepts) {
    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
  }

  if (hasCursor) {
    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
    if (!resolved) {
      return createMCPErrorResponse({
        tool: 'memory_search',
        error: 'Cursor is invalid, expired, or out of scope',
        code: 'E_VALIDATION',
        details: { parameter: 'cursor' },
        recovery: {
          hint: 'Retry the original search to generate a fresh continuation cursor',
        },
      });
    }

    const snippetResults = extractSnippets(resolved.results);
    return createMCPSuccessResponse({
      tool: 'memory_search',
      summary: `Returned ${snippetResults.length} continuation results`,
      data: {
        count: snippetResults.length,
        results: snippetResults,
        continuation: resolved.continuation,
      },
      startTime: _searchStartTime,
      cacheHit: false,
    });
  }

  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);

  // Validate numeric limit parameter
  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 100)
    : 10;

  // BUG-007: Validate query first with proper error handling
  let normalizedQuery: string | null = null;
  if (query !== undefined) {
    try {
      normalizedQuery = validateQuery(query);
    } catch (validationError: unknown) {
      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
        const message = toErrorMessage(validationError);
        return createMCPErrorResponse({
          tool: 'memory_search',
          error: message,
          code: 'E_VALIDATION',
          details: { parameter: 'query' },
          recovery: {
            hint: 'Provide a valid query string or use concepts array instead'
          }
        });
      }
      normalizedQuery = null;
    }
  }

  const hasValidQuery = normalizedQuery !== null;
  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');

  if (!hasValidQuery && !hasValidConcepts) {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
      code: 'E_VALIDATION',
      details: { parameter: 'query' },
      recovery: {
        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
      }
    });
  }

  if (specFolder !== undefined && typeof specFolder !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_search',
      error: 'specFolder must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'specFolder' },
      recovery: {
        hint: 'Provide specFolder as a string path'
      }
    });
  }

  // Eval logger — capture query at pipeline entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: effectiveQuery,
      intent: explicitIntent ?? null,
      specFolder: specFolder ?? null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break search */ }

  const artifactRoutingQuery = resolveArtifactRoutingQuery(
    normalizedQuery,
    hasValidConcepts ? concepts : undefined
  );
  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);

  // Intent-aware retrieval
  let detectedIntent: string | null = null;
  let intentConfidence = 0;
  let intentWeights: IntentWeights | null = null;

  if (explicitIntent) {
    if (intentClassifier.isValidIntent(explicitIntent)) {
      detectedIntent = explicitIntent;
      intentConfidence = 1.0;
      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
    } else {
      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
    }
  }

  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
    detectedIntent = classification.intent;
    intentConfidence = classification.confidence;
    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);

    if (classification.fallback) {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
    } else {
      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
    }
  }

  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
    detectedIntent = 'understand';
    intentConfidence = 1.0;
    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
  }

  // Phase C: Intent-to-profile auto-routing.
  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
  let effectiveProfile: string | undefined = profile;
  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
    try {
      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
      if (autoProfile) {
        effectiveProfile = autoProfile;
        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
      }
    } catch (_autoProfileErr: unknown) {
      // Auto-profile is best-effort — never breaks search
    }
  }

  // Re-run artifact routing with detected intent for fallback coverage
  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
  }

  // Create retrieval trace at pipeline entry
  const trace = createTrace(
    effectiveQuery,
    sessionId,
    detectedIntent || undefined
  );

  // Build cache key args
  const cacheArgs = buildCacheArgs({
    normalizedQuery,
    hasValidConcepts,
    concepts,
    specFolder,
    tenantId: normalizedScope.tenantId,
    userId: normalizedScope.userId,
    agentId: normalizedScope.agentId,
    sharedSpaceId: normalizedScope.sharedSpaceId,
    limit,
    mode,
    tier,
    contextType,
    useDecay,
    includeArchived,
    qualityThreshold,
    applyStateLimits,
    includeContiguity,
    includeConstitutional,
    includeContent,
    anchors,
    detectedIntent,
    minState: minState ?? '',
    rerank,
    applyLengthPenalty,
    sessionId,
    enableSessionBoost,
    enableCausalBoost,
    includeTrace,
  });

  let _evalChannelPayloads: EvalChannelPayload[] = [];
  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
  const cachedPayload = cacheEnabled
    ? toolCache.get<SearchCachePayload>(cacheKey)
    : null;

  let responseToReturn: MCPResponse;
  let goalRefinementPayload: Record<string, unknown> | null = null;

  if (cachedPayload) {

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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '2430,2535p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
	return results, nil
}

// CountObservationsForProject returns the number of non-deleted observations
// for the given project name. Used by handleSave for the similar-project
// warning instead of the heavier ListProjectsWithStats.
func (s *Store) CountObservationsForProject(name string) (int, error) {
	var count int
	err := s.db.QueryRow(
		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
		name,
	).Scan(&count)
	return count, err
}

// MergeResult summarizes the result of merging multiple project name variants
// into a single canonical project name.
type MergeResult struct {
	Canonical           string   `json:"canonical"`
	SourcesMerged       []string `json:"sources_merged"`
	ObservationsUpdated int64    `json:"observations_updated"`
	SessionsUpdated     int64    `json:"sessions_updated"`
	PromptsUpdated      int64    `json:"prompts_updated"`
}

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


exec
/bin/zsh -lc "sed -n '180,360p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  return row;
}

function normalizeTimestamp(value?: string | null): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  return new Date().toISOString();
}

function getSafeHistoryEvents(database: Database.Database, memoryId: number): HistoryLineageEvent[] {
  try {
    return getHistoryEventsForLineage(memoryId, database);
  } catch (error: unknown) {
    logger.warn(`History events retrieval failed for memory ${memoryId}: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

function normalizeScopeValue(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildScopePrefix(row: MemoryIndexRow): string | null {
  const scopeTuple = [
    ['tenant', normalizeScopeValue(row.tenant_id)],
    ['user', normalizeScopeValue(row.user_id)],
    ['agent', normalizeScopeValue(row.agent_id)],
    ['session', normalizeScopeValue(row.session_id)],
    ['shared_space', normalizeScopeValue(row.shared_space_id)],
  ].filter((entry): entry is [string, string] => entry[1] != null);

  if (scopeTuple.length === 0) {
    return null;
  }

  const scopeHash = createHash('sha256')
    .update(JSON.stringify(scopeTuple), 'utf8')
    .digest('hex')
    .slice(0, 24);

  return `scope-sha256:${scopeHash}`;
}

function hasLogicalKeySeparatorCollision(...components: string[]): boolean {
  return components.some((component) => component.includes('::'));
}

function buildHashedLogicalKey(parts: {
  specFolder: string;
  scopePrefix: string | null;
  canonicalPath: string;
  anchorId: string;
}): string {
  const payload = JSON.stringify({
    version: 2,
    specFolder: parts.specFolder,
    scopePrefix: parts.scopePrefix,
    canonicalPath: parts.canonicalPath,
    anchorId: parts.anchorId,
  });
  const digest = createHash('sha256')
    .update(payload, 'utf8')
    .digest('hex');
  return `logical-sha256:${digest}`;
}

function buildLogicalKey(row: MemoryIndexRow): string {
  const canonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.trim().length > 0
    ? row.canonical_file_path.trim()
    : getCanonicalPathKey(row.file_path);
  const anchorId = typeof row.anchor_id === 'string' && row.anchor_id.trim().length > 0
    ? row.anchor_id.trim()
    : '_';
  const scopePrefix = buildScopePrefix(row);

  if (hasLogicalKeySeparatorCollision(row.spec_folder, canonicalPath, anchorId)) {
    logger.warn(
      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
    );
    return buildHashedLogicalKey({
      specFolder: row.spec_folder,
      scopePrefix,
      canonicalPath,
      anchorId,
    });
  }

  if (!scopePrefix) {
    return `${row.spec_folder}::${canonicalPath}::${anchorId}`;
  }
  return `${row.spec_folder}::${scopePrefix}::${canonicalPath}::${anchorId}`;
}

function getLineageRow(database: Database.Database, memoryId: number): MemoryLineageRow | null {
  const row = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE memory_id = ?
  `).get(memoryId) as MemoryLineageRow | undefined;
  return row ?? null;
}

function getActiveProjection(database: Database.Database, logicalKey: string): ActiveProjectionRow | null {
  const row = database.prepare(`
    SELECT *
    FROM active_memory_projection
    WHERE logical_key = ?
  `).get(logicalKey) as ActiveProjectionRow | undefined;
  return row ?? null;
}

function getLatestLineageRowForLogicalKey(database: Database.Database, logicalKey: string): MemoryLineageRow | null {
  const row = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
    ORDER BY version_number DESC, created_at DESC
    LIMIT 1
  `).get(logicalKey) as MemoryLineageRow | undefined;
  return row ?? null;
}

function loadLineageRowsForMemory(
  database: Database.Database,
  memoryId: number,
): LoadedLineageRows | null {
  const logicalKey = resolveLogicalKey(database, memoryId);
  if (!logicalKey) {
    return null;
  }

  const projection = getActiveProjection(database, logicalKey);
  const rows = database.prepare(`
    SELECT *
    FROM memory_lineage
    WHERE logical_key = ?
    ORDER BY version_number ASC, created_at ASC
  `).all(logicalKey) as MemoryLineageRow[];

  return { logicalKey, projection, rows };
}

function isLogicalVersionConflict(error: unknown): boolean {
  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error !== null && typeof Reflect.get(error, 'message') === 'string'
      ? String(Reflect.get(error, 'message'))
      : String(error);
  const code = typeof error === 'object' && error !== null && typeof Reflect.get(error, 'code') === 'string'
    ? String(Reflect.get(error, 'code'))
    : '';

  return (
    (code.includes('SQLITE_CONSTRAINT') || message.includes('SQLITE_CONSTRAINT') || message.includes('UNIQUE constraint failed'))
    && message.includes('memory_lineage.logical_key')
    && message.includes('memory_lineage.version_number')
  );
}

function buildMetadata(
  row: MemoryIndexRow,
  actor: string,
  historyEvents: HistoryLineageEvent[] = [],
): string {
  // D1: All fields are serialized for archival — only `.snapshot` is read back
  // during lineage inspection, but the full metadata provides forensic context
  // for post-mortem analysis and backfill validation.
  const metadata: LineageMetadata = {
    contentHash: typeof row.content_hash === 'string' ? row.content_hash : null,
    filePath: row.file_path,
    canonicalFilePath: typeof row.canonical_file_path === 'string' ? row.canonical_file_path : null,
    anchorId: typeof row.anchor_id === 'string' ? row.anchor_id : null,
    specFolder: row.spec_folder,
    snapshot: row,
    history: historyEvents,
    actor,

codex
A clearer shape is emerging: Engram is not just “memory search plus save”; it treats prompt intake, session boundaries, project identity, and post-hoc consolidation as part of the memory substrate itself. I’m checking one more layer of code around prompt persistence and Public’s lineage/shared-memory boundaries so I can separate true architectural shifts from simple product ergonomics.
exec
/bin/zsh -lc "sed -n '1115,1178p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
		content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
	}

	var promptID int64
	err := s.withTx(func(tx *sql.Tx) error {
		syncID := newSyncID("prompt")
		res, err := s.execHook(tx,
			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
			syncID, p.SessionID, content, nullableString(p.Project),
		)
		if err != nil {
			return err
		}
		promptID, err = res.LastInsertId()
		if err != nil {
			return err
		}
		return s.enqueueSyncMutationTx(tx, SyncEntityPrompt, syncID, SyncOpUpsert, syncPromptPayload{
			SyncID:    syncID,
			SessionID: p.SessionID,
			Content:   content,
			Project:   nullableString(p.Project),
		})
	})
	if err != nil {
		return 0, err
	}
	return promptID, nil
}

func (s *Store) RecentPrompts(project string, limit int) ([]Prompt, error) {
	// Normalize project filter for case-insensitive matching
	project, _ = NormalizeProject(project)

	if limit <= 0 {
		limit = 20
	}

	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts`
	args := []any{}

	if project != "" {
		query += " WHERE project = ?"
		args = append(args, project)
	}

	query += " ORDER BY created_at DESC LIMIT ?"
	args = append(args, limit)

	rows, err := s.queryItHook(s.db, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []Prompt
	for rows.Next() {
		var p Prompt
		if err := rows.Scan(&p.ID, &p.SyncID, &p.SessionID, &p.Content, &p.Project, &p.CreatedAt); err != nil {
			return nil, err
		}
		results = append(results, p)
	}
	return results, rows.Err()

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "prompt|user prompt|session summary|sessionId|shared-memory|memory_context|memory_match_triggers" .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:89:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:216:      'Cached continuity requires a non-empty session summary with a valid extractedAt timestamp.',
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:433:      hints.push('Memory resume failed. Try memory_context manually.');
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:482:    claudeSessionId: typeof args.sessionId === 'string' ? args.sessionId : undefined,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:123:    nextActions.add('Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` if you need a deeper state refresh.');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:87: * Resolve the shared-memory admin identity from server-owned configuration.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:184:      'Caller authentication is required for shared-memory operations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:187:        error: 'Caller authentication is required for shared-memory operations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:216:      'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:219:        error: 'Tenant scope is required for shared-memory admin mutations.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:248:  // Shared-memory tools do not currently receive a server-minted sessionId or
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:250:  // memory_context/memory_match_triggers cannot be wired here yet.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:313:      return `Only the configured shared-memory admin can create shared space "${spaceId}".`;
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:355:          ? 'Authenticate as the configured shared-memory admin before creating a new shared space.'
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:368:      hint: 'Authenticate as the configured shared-memory admin before enabling shared memory.',
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:380:  console.error(`[shared-memory] ${tool} failed: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:402:  console.warn('[shared-memory] Admin operation using caller-supplied identity — assumes trusted transport');
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:684:          console.error(`[shared-memory] Failed to record shared_space_admin audit: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:794: * Enable the shared-memory subsystem via first-run setup.
.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:812:        'Only the configured shared-memory admin can enable shared memory.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60:// Feature catalog: Unified context retrieval (memory_context)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:84:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:121:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:702:    prompt: input,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:709:    session_id: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:734:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:765:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:799:    sessionId: options.sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:828:  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1078:/** Handle memory_context tool — L1 orchestration layer that routes to optimal retrieval strategy.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1092:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1117:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1122:        hint: 'Provide a query, prompt, or context description'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1231:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1234:      details: { requestId, layer: 'L1:Orchestration', requestedSessionId: args.sessionId ?? null },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1236:        hint: 'Retry without sessionId to let the server mint a trusted session, then reuse the returned effectiveSessionId.',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1250:  const layerInfo: LayerInfo | null = layerDefs.getLayerInfo('memory_context');
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1286:    sessionId: effectiveSessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1318:  // Phase C: Intent-to-profile auto-routing for memory_context.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1375:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1393:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1471:    tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1478:      `For more granular control, use L2 tools: memory_search, memory_match_triggers`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1583:      tool: 'memory_context',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1584:      error: 'memory_context failed due to an internal error',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1606:const handle_memory_context = handleMemoryContext;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1609:  handle_memory_context,

 succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions.js';
import { checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier.js';

// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
import { buildContext } from '../lib/code-graph/code-graph-context.js';

// Core handlers for routing
import { handleMemorySearch } from './memory-search.js';
import { handleMemoryMatchTriggers } from './memory-triggers.js';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';

// Token estimation
import { estimateTokens } from '../formatters/token-metrics.js';
import {
  getPressureLevel,
  type RuntimeContextStats,
} from '../lib/cognitive/pressure-monitor.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as sessionManager from '../lib/session/session-manager.js';

// Telemetry
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
import {
  attachSessionTransitionTrace,
  buildSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
import * as vectorIndex from '../lib/search/vector-index.js';

// Shared handler types
import type { MCPResponse, IntentClassification } from './types.js';

// PI-B3: Folder discovery integration
import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
import {
  isAutoResumeEnabled,
  isFolderDiscoveryEnabled,
  isPressurePolicyEnabled,
  isIntentAutoProfileEnabled,
} from '../lib/search/search-flags.js';

// Feature catalog: Unified context retrieval (memory_context)
// Feature catalog: Dual-scope memory auto-surface
// Feature catalog: Provenance-rich response envelopes


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface ContextMode {
  readonly name: string;
  readonly description: string;
  readonly strategy: string;
  readonly tokenBudget?: number;
}

interface ContextOptions {
  specFolder?: string;
  folderBoost?: { folder: string; factor: number };
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  anchors?: string[];
  profile?: string;
  sessionTransition?: SessionTransitionTrace;
}

interface SessionLifecycleMetadata {
  sessionScope: 'caller' | 'ephemeral';
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  eventCounterStart: number;
  resumedContextCount: number;
}

interface ContextResult extends Record<string, unknown> {
  strategy: string;
  mode: string;
}

interface LayerInfo {
  tokenBudget?: number;
}

interface ContextArgs {
  input: string;
  mode?: string;
  intent?: string;
  specFolder?: string;
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
  limit?: number;
  sessionId?: string;
  enableDedup?: boolean;
  includeContent?: boolean;
  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
  tokenUsage?: number;
  anchors?: string[];
  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
  profile?: string;
}

/** T205: Token budget enforcement metadata */
interface TokenBudgetEnforcement {
  budgetTokens: number;
  actualTokens: number;
  enforced: boolean;
  truncated: boolean;
  originalResultCount?: number;
  returnedResultCount?: number;
}

type PressureOverrideTargetMode = 'quick' | 'focused' | null;

interface SessionLifecycleResolution {
  requestedSessionId: string | null;
  effectiveSessionId: string;
  resumed: boolean;
  priorMode: string | null;
  counter: number;
  error?: string;
}

interface EffectiveModeIntentClassification {
  detectedIntent?: string;
  intentConfidence: number;
  resumeHeuristicApplied: boolean;
  source: 'explicit' | 'auto-detected';
}

interface EffectiveModeResolution {
  effectiveMode: string;
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  intentClassification: EffectiveModeIntentClassification;
}

interface BuildResponseMetaParams {
  effectiveMode: string;
  requestedMode: string;
  tracedResult: ContextResult;
  pressurePolicy: {
    level: string;
    ratio: number | null;
    source: string;
    warning: string | null;
  };
  pressureOverrideApplied: boolean;
  pressureOverrideTargetMode: PressureOverrideTargetMode;
  pressureWarning: string | null;
  sessionLifecycle: SessionLifecycleMetadata;
  effectiveBudget: number;
  enforcement: TokenBudgetEnforcement;
  intentClassification: EffectiveModeIntentClassification;
  discoveredFolder?: string;
  includeTrace: boolean;
  sessionTransition: SessionTransitionTrace;
  structuralRoutingNudge: StructuralRoutingNudgeMeta | null;
}

interface StrategyErrorPayload {
  error: string;
  code: string;
  details: Record<string, unknown>;
  hints: string[];
  severity: string | null;
}

interface StructuralRoutingNudgeMeta {
  advisory: true;
  readiness: 'ready';
  preferredTool: 'code_graph_query';
  message: string;
  preservesAuthority: 'session_bootstrap';
}

const STRUCTURAL_ROUTING_PATTERNS = [
  /\b(?:who|what)\s+calls?\b/i,
  /\bcallers?\s+of\b/i,
  /\b(?:who|what)\s+imports?\b/i,
  /\bimports?\s+of\b/i,
  /\b(?:show|list)\s+(?:the\s+)?outline\b/i,
  /\boutline\s+of\b/i,
  /\bdependenc(?:y|ies)\b/i,
  /\bdependents?\b/i,
  /\bwhat\s+extends\b/i,
];

function extractResultRowsFromContextResponse(responseText: string): Array<Record<string, unknown>> {
  try {
    const parsed = JSON.parse(responseText) as Record<string, unknown>;
    const outerData = parsed?.data as Record<string, unknown> | undefined;

    const directRows = Array.isArray(outerData?.results)
      ? outerData.results as Array<Record<string, unknown>>
      : null;
    if (directRows) {
      return directRows;
    }

    const nestedContent = Array.isArray(outerData?.content)
      ? outerData.content as Array<{ type?: string; text?: string }>
      : [];
    const nestedText = nestedContent[0]?.text;
    if (typeof nestedText !== 'string' || nestedText.length === 0) {
      return [];
    }

    const nestedEnvelope = JSON.parse(nestedText) as Record<string, unknown>;
    const nestedData = nestedEnvelope?.data as Record<string, unknown> | undefined;
    return Array.isArray(nestedData?.results)
      ? nestedData.results as Array<Record<string, unknown>>
      : [];
  } catch {
    return [];
  }
}

function extractStrategyError(result: ContextResult): StrategyErrorPayload | null {
  if ((result as Record<string, unknown>).isError !== true) {
    return null;
  }

  const content = Array.isArray((result as Record<string, unknown>).content)
    ? ((result as Record<string, unknown>).content as Array<{ text?: string }>)
    : [];
  const responseText = content[0]?.text;
  if (typeof responseText !== 'string' || responseText.length === 0) {
    return {
      error: 'Context strategy failed',
      code: 'E_STRATEGY',

exec
/bin/zsh -lc "sed -n '230,285p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  }

  if (!isTrustedCallerIdentityBindingEnabled()) {
    throwSharedMemoryAuthError(
      'Shared-memory admin mutations require trusted identity binding.',
      createCallerAuthErrorResponse({
        tool: args.tool,
        error: 'Shared-memory admin mutations require trusted identity binding.',
        code: 'E_AUTHORIZATION',
        reason: 'shared_memory_trusted_binding_required',
        hint: 'Set SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY=true only for trusted local transports.',
      }),
    );
  }

  // SECURITY: Actor IDs are caller-supplied and not cryptographically bound to
  // an authenticated session. In untrusted environments, wrap this handler
  // behind authenticated transport middleware.
  // Shared-memory tools do not currently receive a server-minted sessionId or
  // transport principal, so the trusted-session validation used by
  // memory_context/memory_match_triggers cannot be wired here yet.
  const actor = validateSharedCallerIdentity(args);

  return {
    actor,
    isAdmin: actor.subjectType === adminResult.actor.subjectType
      && actor.subjectId === adminResult.actor.subjectId,
  };
}

function buildActorScope(
  actor: SharedAdminActor,
  tenantId: string,
  sharedSpaceId?: string,
): {
  tenantId: string;
  sharedSpaceId?: string;
  userId?: string;
  agentId?: string;
} {
  return {
    tenantId,
    sharedSpaceId,
    userId: actor.subjectType === 'user' ? actor.subjectId : undefined,
    agentId: actor.subjectType === 'agent' ? actor.subjectId : undefined,
  };
}

function recordSharedSpaceAdminAudit(
  database: ReturnType<typeof requireDb>,
  args: {
    actor: SharedAdminActor;
    tenantId: string;
    spaceId: string;
    decision: 'allow' | 'deny';
    operation: 'space_upsert' | 'membership_set';

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
/bin/zsh -lc "sed -n '1,260p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc 'rg -n "sync mutation|enqueueSyncMutationTx|SyncEntity|sync_mutations|active_memory_projection|memory_lineage|history|append-first|supersedes" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts .opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:4:// Provides append-first lineage transitions, active projection reads,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:20:import { getHistoryEventsForLineage, init as initHistory, recordHistory, type HistoryLineageEvent } from './history.js';
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:82:  history: HistoryLineageEvent[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:91:  historyEvents?: HistoryLineageEvent[];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:281:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:290:    FROM active_memory_projection
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:299:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:319:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:339:    && message.includes('memory_lineage.logical_key')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:340:    && message.includes('memory_lineage.version_number')
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:347:  historyEvents: HistoryLineageEvent[] = [],
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:359:    history: historyEvents,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:411:    'DELETE FROM active_memory_projection WHERE active_memory_id = ? AND logical_key != ?',
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:414:    INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:613:  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:615:    ?? historyEvents[0]?.timestamp
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:620:      INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:640:      buildMetadata(row, actor, historyEvents),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:684:      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:741:          UPDATE memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:750:        INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:772:        buildMetadata(row, actor, historyEvents),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1002:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1004:      AND predecessor_memory_id NOT IN (SELECT memory_id FROM memory_lineage)
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1016:    FROM memory_lineage
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1029:    FROM active_memory_projection p
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1030:    LEFT JOIN memory_lineage l
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1042:    database.prepare('SELECT COUNT(*) AS total FROM active_memory_projection').get() as { total: number }
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1045:    database.prepare('SELECT COUNT(*) AS total FROM memory_lineage').get() as { total: number }
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1103:      const historyEventsForDryRun = getSafeHistoryEvents(database, row.id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1104:      const expectedValidFrom = historyEventsForDryRun[0]?.timestamp
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1144:        const historyEvents = getSafeHistoryEvents(database, row.id);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1145:        const validFrom = historyEvents[0]?.timestamp
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1152:          INSERT INTO memory_lineage (
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1186:          buildMetadata(row, actor, historyEvents),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:1331: * Benchmark append-first lineage writes across an ordered chain of memory ids.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:156:	SyncEntitySession     = "session"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:157:	SyncEntityObservation = "observation"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:158:	SyncEntityPrompt      = "prompt"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:527:			CREATE TABLE IF NOT EXISTS sync_mutations (
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:579:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_target_seq ON sync_mutations(target_key, seq);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:580:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_pending ON sync_mutations(target_key, acked_at, seq);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:585:	// Project-scoped sync: add project column to sync_mutations and enrollment table.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:586:	if err := s.addColumnIfNotExists("sync_mutations", "project", "TEXT NOT NULL DEFAULT ''"); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:594:		CREATE INDEX IF NOT EXISTS idx_sync_mutations_project ON sync_mutations(project);
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:600:		UPDATE sync_mutations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:762:		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:797:		return s.enqueueSyncMutationTx(tx, SyncEntitySession, id, SyncOpUpsert, syncSessionPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1006:				return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1044:			return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1068:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpUpsert, observationPayloadFromObservation(obs))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1132:		return s.enqueueSyncMutationTx(tx, SyncEntityPrompt, syncID, SyncOpUpsert, syncPromptPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1305:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, updated.SyncID, SyncOpUpsert, observationPayloadFromObservation(updated))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1343:		return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpDelete, syncObservationPayload{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1869:		FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1897:		UPDATE sync_mutations
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1922:			`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq <= ? AND acked_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1963:				`UPDATE sync_mutations SET acked_at = datetime('now') WHERE target_key = ? AND seq = ? AND acked_at IS NULL`,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1973:		if err := tx.QueryRow(`SELECT COUNT(*) FROM sync_mutations WHERE target_key = ? AND acked_at IS NULL`, targetKey).Scan(&remaining); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2077:		case SyncEntitySession:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2085:		case SyncEntityObservation:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2099:		case SyncEntityPrompt:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2266:		// Enqueue sync mutations so cloud sync picks up the migrated records.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2497:		// Enqueue sync mutations so cloud sync picks up the merged records.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2669:			FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2676:		project, DefaultSyncTargetKey, SyncEntitySession, SyncSourceLocal,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2688:		if err := s.enqueueSyncMutationTx(tx, SyncEntitySession, payload.ID, SyncOpUpsert, payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2703:			FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2710:		project, DefaultSyncTargetKey, SyncEntityObservation, SyncSourceLocal,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2722:		if err := s.enqueueSyncMutationTx(tx, SyncEntityObservation, payload.SyncID, SyncOpUpsert, payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2736:			FROM sync_mutations sm
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2743:		project, DefaultSyncTargetKey, SyncEntityPrompt, SyncSourceLocal,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2755:		if err := s.enqueueSyncMutationTx(tx, SyncEntityPrompt, payload.SyncID, SyncOpUpsert, payload); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2762:func (s *Store) enqueueSyncMutationTx(tx *sql.Tx, entity, entityKey, op string, payload any) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2775:		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)

codex
The strongest new candidate is a deeper one than the earlier topic-key and lifecycle findings: Engram’s store is built as a syncable entity system, where sessions, prompts, and observations all emit durable mutation records, while Public’s memory stack is still mainly optimized as a retrieval/indexing system with separate lineage and governance layers. I’m validating that contrast against the actual sync schema and Public’s shared-memory/auth surfaces now, because that would be a genuine paradigm shift rather than a feature add.
exec
/bin/zsh -lc "sed -n '520,610p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '2762,2808p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
				backoff_until        TEXT,
				lease_owner          TEXT,
				lease_until          TEXT,
				last_error           TEXT,
				updated_at           TEXT NOT NULL DEFAULT (datetime('now'))
			);

			CREATE TABLE IF NOT EXISTS sync_mutations (
				seq         INTEGER PRIMARY KEY AUTOINCREMENT,
				target_key  TEXT NOT NULL,
				entity      TEXT NOT NULL,
				entity_key  TEXT NOT NULL,
				op          TEXT NOT NULL,
				payload     TEXT NOT NULL,
				source      TEXT NOT NULL DEFAULT 'local',
				occurred_at TEXT NOT NULL DEFAULT (datetime('now')),
				acked_at    TEXT,
				FOREIGN KEY (target_key) REFERENCES sync_state(target_key)
			);
		`
	if _, err := s.execHook(s.db, schema); err != nil {
		return err
	}

	observationColumns := []struct {
		name       string
		definition string
	}{
		{name: "sync_id", definition: "TEXT"},
		{name: "scope", definition: "TEXT NOT NULL DEFAULT 'project'"},
		{name: "topic_key", definition: "TEXT"},
		{name: "normalized_hash", definition: "TEXT"},
		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
		{name: "last_seen_at", definition: "TEXT"},
		{name: "updated_at", definition: "TEXT NOT NULL DEFAULT ''"},
		{name: "deleted_at", definition: "TEXT"},
	}
	for _, c := range observationColumns {
		if err := s.addColumnIfNotExists("observations", c.name, c.definition); err != nil {
			return err
		}
	}

	if err := s.migrateLegacyObservationsTable(); err != nil {
		return err
	}

	if err := s.addColumnIfNotExists("user_prompts", "sync_id", "TEXT"); err != nil {
		return err
	}

	if _, err := s.execHook(s.db, `
		CREATE INDEX IF NOT EXISTS idx_obs_scope ON observations(scope);
		CREATE INDEX IF NOT EXISTS idx_obs_sync_id ON observations(sync_id);
		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
		CREATE INDEX IF NOT EXISTS idx_obs_deleted ON observations(deleted_at);
		CREATE INDEX IF NOT EXISTS idx_obs_dedupe ON observations(normalized_hash, project, scope, type, title, created_at DESC);
		CREATE INDEX IF NOT EXISTS idx_prompts_sync_id ON user_prompts(sync_id);
		CREATE INDEX IF NOT EXISTS idx_sync_mutations_target_seq ON sync_mutations(target_key, seq);
		CREATE INDEX IF NOT EXISTS idx_sync_mutations_pending ON sync_mutations(target_key, acked_at, seq);
	`); err != nil {
		return err
	}

	// Project-scoped sync: add project column to sync_mutations and enrollment table.
	if err := s.addColumnIfNotExists("sync_mutations", "project", "TEXT NOT NULL DEFAULT ''"); err != nil {
		return err
	}
	if _, err := s.execHook(s.db, `
		CREATE TABLE IF NOT EXISTS sync_enrolled_projects (
			project     TEXT PRIMARY KEY,
			enrolled_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
		CREATE INDEX IF NOT EXISTS idx_sync_mutations_project ON sync_mutations(project);
	`); err != nil {
		return err
	}
	// Backfill: extract project from JSON payload for existing rows with empty project.
	if _, err := s.execHook(s.db, `
		UPDATE sync_mutations
		SET project = COALESCE(json_extract(payload, '$.project'), '')
		WHERE project = '' AND payload != ''
	`); err != nil {
		return err
	}

	if _, err := s.execHook(s.db, `UPDATE observations SET scope = 'project' WHERE scope IS NULL OR scope = ''`); err != nil {
		return err
	}
	if _, err := s.execHook(s.db, `UPDATE observations SET topic_key = NULL WHERE topic_key = ''`); err != nil {

 succeeded in 0ms:
func (s *Store) enqueueSyncMutationTx(tx *sql.Tx, entity, entityKey, op string, payload any) error {
	encoded, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	project := extractProjectFromPayload(payload)
	if _, err := s.execHook(tx,
		`INSERT OR IGNORE INTO sync_state (target_key, lifecycle, updated_at) VALUES (?, ?, datetime('now'))`,
		DefaultSyncTargetKey, SyncLifecycleIdle,
	); err != nil {
		return err
	}
	res, err := s.execHook(tx,
		`INSERT INTO sync_mutations (target_key, entity, entity_key, op, payload, source, project)
		 VALUES (?, ?, ?, ?, ?, ?, ?)`,
		DefaultSyncTargetKey, entity, entityKey, op, string(encoded), SyncSourceLocal, project,
	)
	if err != nil {
		return err
	}
	seq, err := res.LastInsertId()
	if err != nil {
		return err
	}
	_, err = s.execHook(tx,
		`UPDATE sync_state
		 SET lifecycle = ?, last_enqueued_seq = ?, updated_at = datetime('now')
		 WHERE target_key = ?`,
		SyncLifecyclePending, seq, DefaultSyncTargetKey,
	)
	return err
}

// extractProjectFromPayload returns the project string from a sync payload struct.
// It handles both string and *string Project fields across all entity payload types.
// Returns empty string if the payload has no project or project is nil.
func extractProjectFromPayload(payload any) string {
	switch p := payload.(type) {
	case syncSessionPayload:
		return p.Project
	case syncObservationPayload:
		if p.Project != nil {
			return *p.Project
		}
		return ""
	case syncPromptPayload:
		if p.Project != nil {

exec
/bin/zsh -lc "sed -n '780,860p' .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '560,780p' .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    if (error instanceof SharedMemoryAuthError) {
      return error.response;
    }

    return createSharedMemoryInternalError(
      'shared_memory_status',
      'Shared memory status failed',
      error,
      'Retry the operation. If the error persists, check database connectivity.',
    );
  }
}

/**
 * Enable the shared-memory subsystem via first-run setup.
 *
 * Idempotent: persists DB flag and creates README even if env-var override
 * already enables the runtime check. Subsequent calls that find both the
 * DB flag set and the README present return `alreadyEnabled: true`.
 */
export async function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse> {
  try {
    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
    warnTrustedAdminIdentityAssumption();
    const { actor, isAdmin } = validateCallerAuth({
      tool: 'shared_memory_enable',
      actorUserId: typeof args.actorUserId === 'string' ? args.actorUserId : undefined,
      actorAgentId: typeof args.actorAgentId === 'string' ? args.actorAgentId : undefined,
    });
    if (!isAdmin) {
      return createSharedMemoryEnableAuthError(
        'shared_memory_enable_admin_required',
        'Only the configured shared-memory admin can enable shared memory.',
      );
    }

    const db = requireDb();

    // Check DB-level persistence (not runtime env-var) to decide idempotency.
    // This ensures env-var-only users still get DB persistence + README on first call.
    let dbAlreadyEnabled = false;
    try {
      const row = db.prepare('SELECT value FROM config WHERE key = ?')
        .get('shared_memory_enabled') as { value: string } | undefined;
      dbAlreadyEnabled = row?.value === 'true';
    } catch (error: unknown) {
      // config table may not exist yet
      const message = error instanceof Error ? error.message : String(error);
      void message;
    }

    if (dbAlreadyEnabled) {
      await createSharedSpacesReadme();
      return createMCPSuccessResponse({
        tool: 'shared_memory_enable',
        summary: 'Shared memory is already enabled',
        data: {
          alreadyEnabled: true,
          actorSubjectType: actor.subjectType,
          actorSubjectId: actor.subjectId,
        },
      });
    }

    ensureSharedCollabRuntime(db);
    enableSharedMemory(db);

    const readmeCreated = !await createSharedSpacesReadme();

    return createMCPSuccessResponse({
      tool: 'shared_memory_enable',
      summary: 'Shared memory enabled successfully',
      data: {
        alreadyEnabled: false,
        enabled: true,
        readmeCreated,
        actorSubjectType: actor.subjectType,
        actorSubjectId: actor.subjectId,
      },
    });
  } catch (error: unknown) {

 succeeded in 0ms:
      transitionEvent: existing.transition_event,
    };
  }
  return null;
}

/**
 * Validates transition input combinations before persisting.
 * Rejects invalid event/predecessor pairings and backwards timestamps.
 */
function validateTransitionInput(
  transitionEvent: string,
  predecessorMemoryId: number | null,
  validFrom: string,
  predecessor: LineageRow | null,
): void {
  if (transitionEvent === 'CREATE' && predecessorMemoryId != null) {
    throw new Error(`E_LINEAGE: CREATE transition must not specify a predecessor (got ${predecessorMemoryId})`);
  }
  if (transitionEvent === 'SUPERSEDE' && predecessorMemoryId == null) {
    throw new Error('E_LINEAGE: SUPERSEDE transition requires a predecessor');
  }
  // M6 FIX: Compare timestamps as numeric epoch values, not raw strings,
  // to handle non-ISO strings and timezone-offset variants correctly.
  if (predecessor && new Date(validFrom).getTime() < new Date(predecessor.valid_from).getTime()) {
    throw new Error(
      `E_LINEAGE: valid_from (${validFrom}) is earlier than predecessor valid_from (${predecessor.valid_from})`,
    );
  }
}

/**
 * Seed lineage state from an existing memory row when no lineage entry exists yet.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version to seed into lineage tables.
 * @param options - Optional actor, timestamps, and transition metadata.
 * @returns Seeded lineage state for the requested memory version.
 */
export function seedLineageFromCurrentState(
  database: Database.Database,
  memoryId: number,
  options: RecordLineageTransitionOptions = {},
): RecordedLineageTransition {
  bindHistory(database);
  ensureLineageTables(database);

  const cached = getExistingLineageTransition(database, memoryId);
  if (cached) return cached;

  const row = getMemoryRow(database, memoryId);
  const logicalKey = buildLogicalKey(row);
  const actor = options.actor ?? 'system';
  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
  const validFrom = options.validFrom
    ?? historyEvents[0]?.timestamp
    ?? normalizeTimestamp(row.created_at ?? row.updated_at);

  const seedTx = database.transaction(() => {
    database.prepare(`
      INSERT INTO memory_lineage (
        memory_id,
        logical_key,
        version_number,
        root_memory_id,
        predecessor_memory_id,
        superseded_by_memory_id,
        valid_from,
        valid_to,
        transition_event,
        actor,
        metadata
      ) VALUES (?, ?, 1, ?, NULL, NULL, ?, NULL, ?, ?, ?)
    `).run(
      memoryId,
      logicalKey,
      memoryId,
      validFrom,
      options.transitionEvent ?? 'BACKFILL',
      actor,
      buildMetadata(row, actor, historyEvents),
    );

    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
  });

  seedTx();

  return {
    logicalKey,
    versionNumber: 1,
    rootMemoryId: memoryId,
    activeMemoryId: memoryId,
    predecessorMemoryId: null,
    transitionEvent: options.transitionEvent ?? 'BACKFILL',
  };
}

/**
 * Seed or append a lineage transition for a memory version.
 *
 * @param database - Database connection that stores lineage state.
 * @param memoryId - Memory version being recorded.
 * @param options - Transition details such as predecessor and actor.
 * @returns Recorded lineage state for the requested memory version.
 */
export function recordLineageTransition(
  database: Database.Database,
  memoryId: number,
  options: RecordLineageTransitionOptions = {},
): RecordedLineageTransition {
  bindHistory(database);
  ensureLineageTables(database);

  const cached = getExistingLineageTransition(database, memoryId);
  if (cached) return cached;

  for (let attempt = 0; attempt <= MAX_LINEAGE_VERSION_RETRIES; attempt += 1) {
    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
    const recordTransitionTx = database.transaction(() => {
      const row = getMemoryRow(database, memoryId);
      const rowLogicalKey = buildLogicalKey(row);
      const actor = options.actor ?? 'system';
      const transitionEvent = options.transitionEvent ?? 'CREATE';
      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
      const predecessorMemoryId = options.predecessorMemoryId ?? null;
      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);

      let logicalKey = rowLogicalKey;
      let rootMemoryId = memoryId;
      let versionNumber = 1;
      let predecessor: LineageRow | null = null;

      if (predecessorMemoryId != null) {
        predecessor = getLineageRow(database, predecessorMemoryId);
        if (predecessor) {
          if (predecessor.logical_key !== rowLogicalKey) {
            throw new Error(
              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
            );
          }
          logicalKey = predecessor.logical_key;
          rootMemoryId = predecessor.root_memory_id;
          versionNumber = predecessor.version_number + 1;
        } else {
          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
            actor,
            transitionEvent: 'BACKFILL',
          });
          if (seeded.logicalKey !== rowLogicalKey) {
            throw new Error(
              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
            );
          }
          logicalKey = seeded.logicalKey;
          rootMemoryId = seeded.rootMemoryId;
          versionNumber = seeded.versionNumber + 1;
          predecessor = getLineageRow(database, predecessorMemoryId);
        }
      }

      if (attempt > 0) {
        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
        if (latest) {
          rootMemoryId = latest.root_memory_id;
          versionNumber = latest.version_number + 1;
        }
      }

      validateTransitionInput(transitionEvent, predecessorMemoryId, validFrom, predecessor);

      if (predecessorMemoryId != null) {
        if (predecessor && predecessor.valid_to) {
          logger.warn(
            `Predecessor ${predecessorMemoryId} already superseded (valid_to: ${predecessor.valid_to}). ` +
            'COALESCE will preserve the existing valid_to.',
          );
        }
        database.prepare(`
          UPDATE memory_lineage
          SET valid_to = COALESCE(valid_to, ?),
              superseded_by_memory_id = COALESCE(superseded_by_memory_id, ?)
          WHERE memory_id = ?
        `).run(validFrom, memoryId, predecessorMemoryId);
        markHistoricalPredecessor(database, predecessorMemoryId, validFrom);
      }

      database.prepare(`
        INSERT INTO memory_lineage (
          memory_id,
          logical_key,
          version_number,
          root_memory_id,
          predecessor_memory_id,
          superseded_by_memory_id,
          valid_from,
          valid_to,
          transition_event,
          actor,
          metadata
        ) VALUES (?, ?, ?, ?, ?, NULL, ?, NULL, ?, ?, ?)
      `).run(
        memoryId,
        logicalKey,
        versionNumber,
        rootMemoryId,
        predecessorMemoryId,
        validFrom,
        transitionEvent,
        actor,
        buildMetadata(row, actor, historyEvents),
      );

      upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);

      return {
        logicalKey,
        versionNumber,
        rootMemoryId,

exec
/bin/zsh -lc "sed -n '800,860p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    sessionTransition: options.sessionTransition,
    enableDedup: false,
    profile: options.profile,
    intent: intent ?? undefined,
    autoDetectIntent: intent ? false : true,
    useDecay: false,
    // minState omitted — memoryState column not yet in schema
  });

  return {
    strategy: 'resume',
    mode: 'resume',
    resumeAnchors: resumeAnchors,
    ...result
  };
}

/* ───────────────────────────────────────────────────────────────
   6. HANDLER HELPERS
──────────────────────────────────────────────────────────────── */

function resolveSessionLifecycle(
  args: ContextArgs,
  db: ReturnType<typeof vectorIndex.getDb> | null,
): SessionLifecycleResolution {
  void db;

  // Security: session scope derived from server context, not caller input
  const trustedSession = sessionManager.resolveTrustedSession(args.sessionId ?? null, {
    tenantId: args.tenantId,
    userId: args.userId,
    agentId: args.agentId,
  });
  if (trustedSession.error) {
    return {
      requestedSessionId: trustedSession.requestedSessionId,
      effectiveSessionId: '',
      resumed: false,
      priorMode: null,
      counter: 0,
      error: trustedSession.error,
    };
  }

  const requestedSessionId = trustedSession.requestedSessionId;
  const effectiveSessionId = trustedSession.effectiveSessionId;
  const resumed = trustedSession.trusted;
  const priorMode = resumed
    ? workingMemory.getSessionInferredMode(effectiveSessionId)
    : null;
  const counter = resumed
    ? workingMemory.getSessionEventCounter(effectiveSessionId)
    : 0;

  return {
    requestedSessionId,
    effectiveSessionId,
    resumed,
    priorMode,
    counter,
  };

exec
/bin/zsh -lc "sed -n '736,772p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
		END;

		CREATE TRIGGER obs_fts_update AFTER UPDATE ON observations BEGIN
			INSERT INTO observations_fts(observations_fts, rowid, title, content, tool_name, type, project, topic_key)
			VALUES ('delete', old.id, old.title, old.content, old.tool_name, old.type, old.project, old.topic_key);
			INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
			VALUES (new.id, new.title, new.content, new.tool_name, new.type, new.project, new.topic_key);
		END;
	`); err != nil {
		return fmt.Errorf("migrate fts topic_key: %w", err)
	}
	return nil
}

// ─── Sessions ────────────────────────────────────────────────────────────────

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

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Session Manager
// ───────────────────────────────────────────────────────────────
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
// Import working-memory for immediate cleanup on session end (GAP 2).
import * as workingMemory from '../cognitive/working-memory.js';

// Feature catalog: Session-manager transaction gap fixes


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface SessionConfig {
  sessionTtlMinutes: number;
  maxEntriesPerSession: number;
  enabled: boolean;
  dbUnavailableMode: 'allow' | 'block';
}

interface InitResult {
  success: boolean;
  error?: string;
}

interface MemoryInput {
  id?: number;
  file_path?: string;
  anchorId?: string;
  anchor_id?: string;
  content_hash?: string;
  title?: string;
}

interface MarkResult {
  success: boolean;
  hash?: string;
  skipped?: boolean;
  error?: string;
}

interface MarkBatchResult {
  success: boolean;
  markedCount: number;
  skipped?: boolean;
  error?: string;
}

interface SessionStats {
  totalSent: number;
  oldestEntry: string | null;
  newestEntry: string | null;
}

interface FilterResult {
  filtered: MemoryInput[];
  dedupStats: {
    enabled: boolean;
    filtered: number;
    total: number;
    tokenSavingsEstimate?: string;
    sessionId?: string;
  };
}

interface CleanupResult {
  success: boolean;
  deletedCount: number;
}

interface StaleCleanupResult {
  success: boolean;
  workingMemoryDeleted: number;
  sentMemoriesDeleted: number;
  sessionStateDeleted: number;
  errors: string[];
}

interface SessionState {
  sessionId: string;
  status: string;
  specFolder: string | null;
  currentTask: string | null;
  lastAction: string | null;
  contextSummary: string | null;
  pendingWork: string | null;
  tenantId: string | null;
  userId: string | null;
  agentId: string | null;
  data: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  _recovered: boolean;
}

interface SessionIdentityScope {
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
}

interface SessionStateInput extends SessionIdentityScope {
  specFolder?: string | null;
  currentTask?: string | null;
  lastAction?: string | null;
  contextSummary?: string | null;
  pendingWork?: string | null;
  data?: Record<string, unknown> | null;
}

interface RecoverResult {
  success: boolean;
  state?: SessionState | null;
  _recovered?: boolean;
  error?: string;
}

interface InterruptedSession {
  sessionId: string;
  specFolder: string | null;
  currentTask: string | null;
  lastAction: string | null;
  contextSummary: string | null;
  pendingWork: string | null;
  updatedAt: string;
}

interface InterruptedSessionsResult {
  success: boolean;
  sessions: InterruptedSession[];
  error?: string;
}

interface ResetResult {
  success: boolean;
  interruptedCount: number;
  error?: string;
}

interface CheckpointResult {
  success: boolean;
  filePath?: string;
  note?: string;
  error?: string;
}

interface ContinueSessionInput {
  sessionId: string;
  specFolder?: string | null;
  currentTask?: string | null;
  lastAction?: string | null;
  contextSummary?: string | null;
  pendingWork?: string | null;
  tenantId?: string | null;
  userId?: string | null;
  agentId?: string | null;
  data?: Record<string, unknown> | null;
}

interface TrustedSessionResolution {
  requestedSessionId: string | null;
  effectiveSessionId: string;
  trusted: boolean;
  error?: string;
}

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
──────────────────────────────────────────────────────────────── */

/**
 * Session configuration with defaults from spec.md (R7 mitigation)
 * - Session TTL: 30 minutes
 * - Cap at 100 entries per session
 */
const SESSION_CONFIG: SessionConfig = {
  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
  maxEntriesPerSession: parseInt(process.env.SESSION_MAX_ENTRIES as string, 10) || 100,
  enabled: process.env.DISABLE_SESSION_DEDUP !== 'true',
  dbUnavailableMode: process.env.SESSION_DEDUP_DB_UNAVAILABLE_MODE === 'allow' ? 'allow' : 'block',
};

/* ───────────────────────────────────────────────────────────────
   3. DATABASE REFERENCE
──────────────────────────────────────────────────────────────── */

let db: Database | null = null;
// Track periodic cleanup interval for expired sessions
let cleanupInterval: ReturnType<typeof setInterval> | null = null;
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

// Track stale session cleanup interval (runs hourly)
let staleCleanupInterval: ReturnType<typeof setInterval> | null = null;
const STALE_CLEANUP_INTERVAL_MS = parseInt(process.env.STALE_CLEANUP_INTERVAL_MS as string, 10) || 60 * 60 * 1000; // 1 hour
const STALE_SESSION_THRESHOLD_MS = parseInt(process.env.STALE_SESSION_THRESHOLD_MS as string, 10) || 24 * 60 * 60 * 1000; // 24 hours

function init(database: Database): InitResult {
  if (!database) {
    console.error('[session-manager] WARNING: init() called with null database');
    return { success: false, error: 'Database reference is required' };
  }
  db = database;

  const schemaResult = ensureSchema();
  if (!schemaResult.success) {
    return schemaResult;
  }

  cleanupExpiredSessions();

  // Set up periodic cleanup instead of only running once at init (P4-18).
  // Clear any existing interval first (in case of reinitializeDatabase).
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/implicit-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "prompt|queryId|search_shown|result_cited|workingMemory|sessionSummary|continuityText|save prompt|user prompt" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/handlers | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/implicit-feedback.ts: No such file or directory

 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:10:import * as workingMemory from '../cognitive/working-memory.js';
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:78:  workingMemoryDeleted: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:317:  return workingMemory.sessionExists(normalizedSessionId)
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:773:    return { success: false, workingMemoryDeleted: 0, sentMemoriesDeleted: 0, sessionStateDeleted: 0, errors: ['Database not initialized'] };
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:777:  let workingMemoryDeleted = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:786:    workingMemoryDeleted = wmResult.changes;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:821:  const totalDeleted = workingMemoryDeleted + sentMemoriesDeleted + sessionStateDeleted;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:824:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:836:    workingMemoryDeleted,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:854:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1092:      workingMemory.clearSession(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:25:import * as workingMemory from '../lib/cognitive/working-memory.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:105:  prompt: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184:/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:187:    prompt,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:195:  if (!prompt || typeof prompt !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:198:      error: 'prompt is required and must be a string',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:200:      details: { parameter: 'prompt' },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:202:        hint: 'Provide a non-empty string for the prompt parameter'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:248:      query: prompt,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:252:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:261:          queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:275:    workingMemory.isEnabled() &&
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:281:      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:288:  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:350:        'Try a different prompt or check memory content',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:370:        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:398:    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:537:        query_text: prompt,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:27:  prompt_price_per_million_usd: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:42:    prompt_price_per_million_usd: 15,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:47:    notes: 'Mirrors existing family-level estimateCost() prompt/output rates with cache multipliers applied.',
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:55:    prompt_price_per_million_usd: 3,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:60:    notes: 'Mirrors existing family-level estimateCost() prompt/output rates with cache multipliers applied.',
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:68:    prompt_price_per_million_usd: 0.25,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:73:    notes: 'Mirrors existing family-level estimateCost() prompt/output rates with cache multipliers applied.',
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:100:    prompt_tokens INTEGER NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:105:    prompt_cost_usd REAL NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:125:    prompt_tokens INTEGER NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:130:    prompt_cost_usd REAL NOT NULL DEFAULT 0,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:145:    prompt_price_per_million_usd REAL NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:175:  prompt_tokens: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:180:  prompt_cost_usd: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:200:  prompt_tokens: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:205:  prompt_cost_usd: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:219:  prompt_price_per_million_usd: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:241:  promptCostUsd: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:265:      prompt_price_per_million_usd,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:290:        row.prompt_price_per_million_usd,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:321:  const promptCostUsd = roundUsd((turn.promptTokens / 1_000_000) * pricing.prompt_price_per_million_usd);
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:328:    promptCostUsd,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:332:    estimatedTotalCostUsd: roundUsd(promptCostUsd + completionCostUsd + cacheCreationCostUsd + cacheReadCostUsd),
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:409:      COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:414:      COALESCE(SUM(prompt_cost_usd), 0) AS prompt_cost_usd,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:424:    prompt_tokens: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:429:    prompt_cost_usd: number;
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:440:    SET prompt_tokens = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:445:        prompt_cost_usd = ?,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:455:    aggregate.prompt_tokens,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:460:    roundUsd(aggregate.prompt_cost_usd),
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:488:      prompt_tokens,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:493:      prompt_cost_usd,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:541:      prompt_tokens,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:546:      prompt_cost_usd,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:566:        turn.promptTokens,
.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts:571:        cost.promptCostUsd,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:7:import * as workingMemory from '../cognitive/working-memory.js';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:266:  const inserted = workingMemory.upsertExtractedEntry({
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:86:  queryId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:105:  queryId?: string,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:107:  if (typeof queryId !== 'string') {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:111:  const normalizedQueryId = queryId.trim();
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:475:  const hasRestoredData = result.restored > 0 || result.workingMemoryRestored > 0;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:482:  if (result.restored > 0 || result.workingMemoryRestored > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:508:        workingMemoryRestored: result.workingMemoryRestored,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:529:        workingMemoryRestored: result.workingMemoryRestored,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:655:    queryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:677:  const normalizedQueryId = typeof queryId === 'string' && queryId.trim().length > 0
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:678:    ? queryId.trim()
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:690:        queryId: normalizedQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:735:  if (wasUseful && typeof queryId === 'string' && queryId.trim().length > 0) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:736:    groundTruthSelectionId = recordUserSelection(queryId, memoryId, {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:750:      const learnResult = recordSelection(queryId, memoryId, normalizedTerms, Math.floor(resultRank), database);
.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:260:        cachedSummary.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:32:import * as workingMemory from '../lib/cognitive/working-memory.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:702:    prompt: input,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:848:    ? workingMemory.getSessionInferredMode(effectiveSessionId)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:851:    ? workingMemory.getSessionEventCounter(effectiveSessionId)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1122:        hint: 'Provide a query, prompt, or context description'
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1215:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1415:    workingMemory.setSessionInferredMode(effectiveSessionId, effectiveMode);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1555:        queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1567:        queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:63:  continuityText: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:184:    summaryText: state.sessionSummary?.text ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:185:    extractedAt: state.sessionSummary?.extractedAt ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:326:  const continuityText = `Last session worked on: ${cachedSpecFolder}\nSummary: ${summaryText}`;
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:342:      continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:343:      startupHint: continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:523:        cachedSummaryDecision.cachedSummary.continuityText,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:644:    _evalQueryId = evalEntry.queryId;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1231:        queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1241:          queryId: _evalQueryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1251:  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1268:          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1270:            type: 'search_shown',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1272:            queryId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1283:  // REQ-014: Query flow tracking + result_cited for includeContent searches
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1284:  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1310:        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1317:        // Log result_cited for includeContent searches (content was embedded = cited)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:84:  'promptTokens',
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:11:/** Signal category detected in user prompt */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:14:/** Result of signal detection for a prompt */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:52:  promptLength: number;
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:541: * Detect importance signals in a user prompt.
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:545:export function detectSignals(prompt: string): SignalDetection[] {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:546:  if (!prompt) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:550:  const normalized = normalizeUnicode(prompt, false);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:621:/** Match user prompt against trigger phrases using exact string matching */
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:630:  // Truncate very long prompts
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:631:  const prompt = userPrompt.length > CONFIG.MAX_PROMPT_LENGTH
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:635:  const promptNormalized = normalizeUnicode(prompt, false);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:644:  const candidateEntries = getTriggerCandidates(promptNormalized, cache);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:650:    if (matchPhraseWithBoundary(promptNormalized, entry.phrase, entry.regex)) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:684:    promptLength: prompt.length,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:714:      promptLength: (userPrompt || '').length,
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:736:  const promptKeys = extractTriggerIndexKeys(userPrompt);
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:737:  if (promptKeys.length === 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:742:  for (const key of promptKeys) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:179:  workingMemoryRestored: number;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:204:  workingMemory: Array<Record<string, unknown>>;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:846:  if (Array.isArray(snapshot.workingMemory)) {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:848:      columns: Object.keys(snapshot.workingMemory[0] ?? {}),
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:849:      rows: snapshot.workingMemory,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1453:      const workingMemorySnapshot = tables.working_memory?.rows ?? [];
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1464:        workingMemory: workingMemorySnapshot,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1606:    workingMemoryRestored: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1874:            result.workingMemoryRestored += restoredCount;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1889:        result.workingMemoryRestored = 0;
.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1908:    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:505:**Trigger Matcher**: Matches user prompts to memory trigger phrases
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:510:  prompt: 'How does authentication work?',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:12://   weak    — search_shown, same_topic_requery (passive exposure)
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:23: *   result_cited | follow_on_tool_use > query_reformulated > same_topic_requery > search_shown
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:26:  | 'search_shown'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:27:  | 'result_cited'
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:41:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:61:  queryId?: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:79:  result_cited:         'strong',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:83:  search_shown:         'weak',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:119:                 'search_shown','result_cited','query_reformulated',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:188:      event.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:203: * Record a batch of feedback events (e.g., all search_shown results from
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:249:    if (opts.queryId !== undefined) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:251:      params.push(opts.queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:531: * The queryIdPrefix is the only difference between the two call sites.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:535: * @param queryIdPrefix  Short label identifying the scoring model ('5f' | 'cs')
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:541:  queryIdPrefix: string,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:564:        queryId: `${queryIdPrefix}-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:751:import * as workingMemory from './working-memory';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:760:workingMemory.init(db);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:408:    queryId: 'q-abc-123',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:350:  const queryIdToText = new Map<string, string>();
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:352:    const queryId = `consumption:${row.id}`;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:353:    queryIdToText.set(queryId, row.query_text);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:354:    return queryId;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:360:  for (const queryId of holdoutQueryIds) {
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:361:    const queryText = queryIdToText.get(queryId);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:369:        replayed.set(queryId, ranks);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:373:      console.warn(`[shadow-evaluation-runtime] query replay failed for ${queryId}: ${message}`);
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:440:      (queryId) => replayed.get(queryId)?.live ?? [],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:441:      (queryId) => replayed.get(queryId)?.shadow ?? [],
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:38:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:123:      previousQueryId: previous.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:132:      previousQueryId: previous.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:153: * @param queryId - Opaque query identifier for event correlation
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:161:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:179:  entries.push({ tokens, timestamp, queryId, shownMemoryIds });
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:189:        queryId: detection.previousQueryId ?? queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:202: * Log `result_cited` events for memories whose content was loaded.
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:208:  queryId: string,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:217:      type: 'result_cited',
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:219:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:252:      queryId: latest.queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts:357:      'Use memory_match_triggers() for prompt-based matching instead'
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1623:      queryId: `hybrid-${Date.now()}`,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2209:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2339: * @param options - Optional includeContent flag and queryId for overflow logging.
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2345:  options?: { includeContent?: boolean; queryId?: string }
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2349:  const queryId = options?.queryId ?? `q-${Date.now()}`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2382:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2418:      queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:2435:    queryId,
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:47:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:59:  queryId: string;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/ground-truth-feedback.ts:79:  queryId: string;

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-session-state.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-session-state.ts: No such file or directory

exec
/bin/zsh -lc "sed -n '1428,1452p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    ? attachSessionTransitionTrace(
      result as ContextResult & { content?: Array<{ text?: string; type?: string }> },
      sessionTransition,
    ) as ContextResult
    : result;

  if (autoResumeEnabled && effectiveMode === 'resume' && resumedSession) {
    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
    if (resumeContextItems.length > 0) {
      sessionLifecycle.resumedContextCount = resumeContextItems.length;
      (tracedResult0 as Record<string, unknown>).systemPromptContext = resumeContextItems.map((item) => ({
        memoryId: item.memoryId,
        title: item.title,
        filePath: item.filePath,
        attentionScore: item.attentionScore,
      }));
      (tracedResult0 as Record<string, unknown>).systemPromptContextInjected = true;
    }
  }

  // T205: Enforce token budget AFTER all context injection
  const { result: budgetedResult, enforcement } = enforceTokenBudget(tracedResult0, effectiveBudget);
  const tracedResult = budgetedResult;

  // Phase 020: Attach graph context and query-intent routing metadata

exec
/bin/zsh -lc "sed -n '1360,1458p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
func (s *Store) Timeline(observationID int64, before, after int) (*TimelineResult, error) {
	if before <= 0 {
		before = 5
	}
	if after <= 0 {
		after = 5
	}

	// 1. Get the focus observation
	focus, err := s.GetObservation(observationID)
	if err != nil {
		return nil, fmt.Errorf("timeline: observation #%d not found: %w", observationID, err)
	}

	// 2. Get session info
	session, err := s.GetSession(focus.SessionID)
	if err != nil {
		// Session might be missing for manual-save observations — non-fatal
		session = nil
	}

	// 3. Get observations BEFORE the focus (same session, older, chronological order)
	beforeRows, err := s.queryItHook(s.db, `
		SELECT id, session_id, type, title, content, tool_name, project,
		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
		FROM observations
		WHERE session_id = ? AND id < ? AND deleted_at IS NULL
		ORDER BY id DESC
		LIMIT ?
	`, focus.SessionID, observationID, before)
	if err != nil {
		return nil, fmt.Errorf("timeline: before query: %w", err)
	}
	defer beforeRows.Close()

	var beforeEntries []TimelineEntry
	for beforeRows.Next() {
		var e TimelineEntry
		if err := beforeRows.Scan(
			&e.ID, &e.SessionID, &e.Type, &e.Title, &e.Content,
			&e.ToolName, &e.Project, &e.Scope, &e.TopicKey, &e.RevisionCount, &e.DuplicateCount, &e.LastSeenAt,
			&e.CreatedAt, &e.UpdatedAt, &e.DeletedAt,
		); err != nil {
			return nil, err
		}
		beforeEntries = append(beforeEntries, e)
	}
	if err := beforeRows.Err(); err != nil {
		return nil, err
	}
	// Reverse to get chronological order (oldest first)
	for i, j := 0, len(beforeEntries)-1; i < j; i, j = i+1, j-1 {
		beforeEntries[i], beforeEntries[j] = beforeEntries[j], beforeEntries[i]
	}

	// 4. Get observations AFTER the focus (same session, newer, chronological order)
	afterRows, err := s.queryItHook(s.db, `
		SELECT id, session_id, type, title, content, tool_name, project,
		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
		FROM observations
		WHERE session_id = ? AND id > ? AND deleted_at IS NULL
		ORDER BY id ASC
		LIMIT ?
	`, focus.SessionID, observationID, after)
	if err != nil {
		return nil, fmt.Errorf("timeline: after query: %w", err)
	}
	defer afterRows.Close()

	var afterEntries []TimelineEntry
	for afterRows.Next() {
		var e TimelineEntry
		if err := afterRows.Scan(
			&e.ID, &e.SessionID, &e.Type, &e.Title, &e.Content,
			&e.ToolName, &e.Project, &e.Scope, &e.TopicKey, &e.RevisionCount, &e.DuplicateCount, &e.LastSeenAt,
			&e.CreatedAt, &e.UpdatedAt, &e.DeletedAt,
		); err != nil {
			return nil, err
		}
		afterEntries = append(afterEntries, e)
	}
	if err := afterRows.Err(); err != nil {
		return nil, err
	}

	// 5. Count total observations in the session for context
	var totalInRange int
	s.db.QueryRow(
		"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
	).Scan(&totalInRange)

	return &TimelineResult{
		Focus:        *focus,
		Before:       beforeEntries,
		After:        afterEntries,
		SessionInfo:  session,
		TotalInRange: totalInRange,
	}, nil
}

exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) Timeline|handleTimeline|memory_timeline|timeline of events|chronological context\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go .opencode/skill/system-spec-kit/mcp_server/handlers" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1354:// Timeline provides chronological context around a specific observation.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1360:func (s *Store) Timeline(observationID int64, before, after int) (*TimelineResult, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:437:			handleTimeline(s),
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:939:func handleTimeline(s *store.Store) server.ToolHandlerFunc {

exec
/bin/zsh -lc 'rg -n "timeline" .opencode/skill/system-spec-kit/mcp_server/handlers .opencode/skill/system-spec-kit/mcp_server/lib | head -n 100' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:47:  /** Present when r10Escalation is true. Contains timeline recommendation. */
.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts:182: *   - Sprint timeline recommendation for R10 (graph enrichment)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:49:| Temporal       | 1       | ~158  | Time-based contiguity boosting and timelines |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:695:**Purpose**: Boost search results by temporal proximity and query temporal neighbors. Also builds spec-folder timelines.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:725:// Build a timeline for a spec folder
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:726:const timeline = buildTimeline('specs/005-memory', 20);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:727:// timeline = [{ id, title, created_at, ... }] ordered by created_at DESC
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:5:// Query temporal neighbors, and build spec-folder timelines.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts:193: * Build a timeline of memories ordered by `created_at DESC`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:179:    keywords: ['plan', 'planning', 'approach', 'strategy', 'phases', 'milestones', 'timeline'],

exec
/bin/zsh -lc "sed -n '3340,3488p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
	if a > b {
		return a
	}
	return b
}

func normalizeSyncTargetKey(targetKey string) string {
	if strings.TrimSpace(targetKey) == "" {
		return DefaultSyncTargetKey
	}
	return strings.TrimSpace(strings.ToLower(targetKey))
}

func newSyncID(prefix string) string {
	b := make([]byte, 8)
	if _, err := rand.Read(b); err != nil {
		return fmt.Sprintf("%s-%d", prefix, time.Now().UTC().UnixNano())
	}
	return prefix + "-" + hex.EncodeToString(b)
}

func normalizeExistingSyncID(existing, prefix string) string {
	if strings.TrimSpace(existing) != "" {
		return existing
	}
	return newSyncID(prefix)
}

// privateTagRegex matches <private>...</private> tags and their contents.
// Supports multiline and nested content. Case-insensitive.
var privateTagRegex = regexp.MustCompile(`(?is)<private>.*?</private>`)

// stripPrivateTags removes all <private>...</private> content from a string.
// This ensures sensitive information (API keys, passwords, personal data)
// is never persisted to the memory database.
func stripPrivateTags(s string) string {
	result := privateTagRegex.ReplaceAllString(s, "[REDACTED]")
	// Clean up multiple consecutive [REDACTED] and excessive whitespace
	result = strings.TrimSpace(result)
	return result
}

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


exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
<p align="center">
  <img width="1024" height="340" alt="image" src="https://github.com/user-attachments/assets/32ed8985-841d-49c3-81f7-2aabc7c7c564" />
</p>

<p align="center">
  <strong>Persistent memory for AI coding agents</strong><br>
  <em>Agent-agnostic. Single binary. Zero dependencies.</em>
</p>

<p align="center">
  <a href="docs/INSTALLATION.md">Installation</a> &bull;
  <a href="docs/AGENT-SETUP.md">Agent Setup</a> &bull;
  <a href="docs/ARCHITECTURE.md">Architecture</a> &bull;
  <a href="docs/PLUGINS.md">Plugins</a> &bull;
  <a href="CONTRIBUTING.md">Contributing</a> &bull;
  <a href="DOCS.md">Full Docs</a>
</p>

---

> **engram** `/ˈen.ɡræm/` — *neuroscience*: the physical trace of a memory in the brain.

Your AI coding agent forgets everything when the session ends. Engram gives it a brain.

A **Go binary** with SQLite + FTS5 full-text search, exposed via CLI, HTTP API, MCP server, and an interactive TUI. Works with **any agent** that supports MCP — Claude Code, OpenCode, Gemini CLI, Codex, VS Code (Copilot), Antigravity, Cursor, Windsurf, or anything else.

```
Agent (Claude Code / OpenCode / Gemini CLI / Codex / VS Code / Antigravity / ...)
    ↓ MCP stdio
Engram (single Go binary)
    ↓
SQLite + FTS5 (~/.engram/engram.db)
```

## Quick Start

### Install

```bash
brew install gentleman-programming/tap/engram
```

Windows, Linux, and other install methods → [docs/INSTALLATION.md](docs/INSTALLATION.md)

### Setup Your Agent

| Agent | One-liner |
|-------|-----------|
| Claude Code | `claude plugin marketplace add Gentleman-Programming/engram && claude plugin install engram` |
| OpenCode | `engram setup opencode` |
| Gemini CLI | `engram setup gemini-cli` |
| Codex | `engram setup codex` |
| VS Code | `code --add-mcp '{"name":"engram","command":"engram","args":["mcp"]}'` |
| Cursor / Windsurf / Any MCP | See [docs/AGENT-SETUP.md](docs/AGENT-SETUP.md) |

Full per-agent config, Memory Protocol, and compaction survival → [docs/AGENT-SETUP.md](docs/AGENT-SETUP.md)

That's it. No Node.js, no Python, no Docker. **One binary, one SQLite file.**

## How It Works

```
1. Agent completes significant work (bugfix, architecture decision, etc.)
2. Agent calls mem_save → title, type, What/Why/Where/Learned
3. Engram persists to SQLite with FTS5 indexing
4. Next session: agent searches memory, gets relevant context
```

Full details on session lifecycle, topic keys, and memory hygiene → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## MCP Tools

| Tool | Purpose |
|------|---------|
| `mem_save` | Save observation |
| `mem_update` | Update by ID |
| `mem_delete` | Soft or hard delete |
| `mem_suggest_topic_key` | Stable key for evolving topics |
| `mem_search` | Full-text search |
| `mem_session_summary` | End-of-session save |
| `mem_context` | Recent session context |
| `mem_timeline` | Chronological drill-in |
| `mem_get_observation` | Full content by ID |
| `mem_save_prompt` | Save user prompt |
| `mem_stats` | Memory statistics |
| `mem_session_start` | Register session start |
| `mem_session_end` | Mark session complete |
| `mem_capture_passive` | Extract learnings from text output |
| `mem_merge_projects` | Merge project name variants (admin) |

Full tool reference → [docs/ARCHITECTURE.md#mcp-tools](docs/ARCHITECTURE.md#mcp-tools)

## Terminal UI

```bash
engram tui
```

<p align="center">
<img src="assets/tui-dashboard.png" alt="TUI Dashboard" width="400" />
  <img width="400" alt="image" src="https://github.com/user-attachments/assets/0308991a-58bb-4ad8-9aa2-201c059f8b64" />
  <img src="assets/tui-detail.png" alt="TUI Observation Detail" width="400" />
  <img src="assets/tui-search.png" alt="TUI Search Results" width="400" />
</p>

**Navigation**: `j/k` vim keys, `Enter` to drill in, `/` to search, `Esc` back. Catppuccin Mocha theme.

## Git Sync

Share memories across machines. Uses compressed chunks — no merge conflicts, no huge files.

```bash
engram sync                    # Export new memories as compressed chunk
git add .engram/ && git commit -m "sync engram memories"
engram sync --import           # On another machine: import new chunks
engram sync --status           # Check sync status
```

Full sync documentation → [DOCS.md](DOCS.md)

## CLI Reference

| Command | Description |
|---------|-------------|
| `engram setup [agent]` | Install agent integration |
| `engram serve [port]` | Start HTTP API (default: 7437) |
| `engram mcp` | Start MCP server (stdio). Accepts `--project` or `ENGRAM_PROJECT` |
| `engram tui` | Launch terminal UI |
| `engram search <query>` | Search memories |
| `engram save <title> <msg>` | Save a memory |
| `engram timeline <obs_id>` | Chronological context |
| `engram context [project]` | Recent session context |
| `engram stats` | Memory statistics |
| `engram export [file]` | Export to JSON |
| `engram import <file>` | Import from JSON |
| `engram sync` | Git sync export |
| `engram projects list` | Show all projects with observation/session/prompt counts |
| `engram projects consolidate` | Interactive merge of similar project names (`--all`, `--dry-run`) |
| `engram projects prune` | Remove projects with 0 observations (`--dry-run`) |
| `engram version` | Show version |

## Documentation

| Doc | Description |
|-----|-------------|
| [Installation](docs/INSTALLATION.md) | All install methods + platform support |
| [Agent Setup](docs/AGENT-SETUP.md) | Per-agent configuration + Memory Protocol |
| [Architecture](docs/ARCHITECTURE.md) | How it works + MCP tools + project structure |
| [Plugins](docs/PLUGINS.md) | OpenCode & Claude Code plugin details |
| [Comparison](docs/COMPARISON.md) | Why Engram vs claude-mem |
| [Contributing](CONTRIBUTING.md) | Contribution workflow + standards |
| [Full Docs](DOCS.md) | Complete technical reference |

## License

MIT

---

**Inspired by [claude-mem](https://github.com/thedotmack/claude-mem)** — but agent-agnostic, simpler, and built different.

exec
/bin/zsh -lc 'rg -n "private|redact|sanitize|scrub|REDACTED|sensitive" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | head -n 200' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:34:function sanitizeErrorForHint(msg: string): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:45:function redactPath(absolutePath: string): string {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:203:      .map(([filePath, contentHash]) => ({ filePath: redactPath(filePath), contentHash }));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:206:      normalizedPath: redactPath(normalizedPath),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:207:      // Fix F21 — redact specFolders to prevent path disclosure.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:208:      specFolders: Array.from(bucket.specFolders).sort().map(sf => redactPath(sf)),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:334:        error: `Schema missing: ${sanitizeErrorForHint(message)}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:412:      hints.push(`Embedding profile unavailable: ${sanitizeErrorForHint(toErrorMessage(profileError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:487:            repair.errors.push(sanitizeErrorForHint(message));
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:488:            hints.push(`Auto-repair failed: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:494:      hints.push(`FTS5 consistency check failed: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:497:        repair.errors.push(`Consistency check failed before repair: ${sanitizeErrorForHint(message)}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:516:      repair.errors.push(`Orphan edge cleanup failed: ${sanitizeErrorForHint(toErrorMessage(orphanError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:553:      repair.errors.push(`Integrity cleanup failed: ${sanitizeErrorForHint(toErrorMessage(integrityError))}`);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:588:        databasePath: redactPath(vectorIndex.getDbPath() ?? ''),
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:13:  calculatePressureAdjustedBudget, sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:65:  const sanitizedPayload = sanitizeRecoveredPayload(payload);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:71:  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:14:import { sanitizeEmbeddingFailureMessage } from '../../lib/providers/retry-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:163:  // Security: raw provider errors sanitized before persistence/response
.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:164:  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:202:    // Security: raw provider errors sanitized before persistence/response
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:203:    result.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(embeddingFailureReason) ?? undefined;
.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:395:        response.embeddingFailureReason = retryManager.sanitizeEmbeddingFailureMessage(result.embeddingFailureReason);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:9:  sanitizeAndLogEmbeddingFailure,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:10:  sanitizeEmbeddingFailureMessage,
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:139:      embeddingFailureReason = sanitizeEmbeddingFailureMessage('Deferred: async_embedding requested');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:172:          embeddingFailureReason = sanitizeEmbeddingFailureMessage('Embedding generation returned null');
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:177:      // Security: raw provider errors sanitized before persistence/response
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:178:      embeddingFailureReason = sanitizeAndLogEmbeddingFailure(
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:378:  it('C138-CV13: invalid list weights are sanitized to zero contribution', () => {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:100:export function sanitizeRecoveredPayload(payload: string): string {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:114:  const sanitizedPayload = sanitizeRecoveredPayload(payload);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:121:    sanitizedPayload,
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:282:  it('is case-insensitive for denylist matching', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/entity-extractor.vitest.ts:321:  it('isEntityDenied is case-insensitive', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:237:    it('RF3: Case insensitive', () => {
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:211:  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:212:  const filePaths = extractFilePaths(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:213:  const topics = extractTopics(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:231:  const specFolder = detectSpecFolder(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:237:  const attentionSignals = extractAttentionSignals(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:245:  const meaningfulLines = sanitizedLines
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:259:      sanitizedLines.length !== transcriptLines.length
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:318:  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:319:  const filePaths = extractFilePaths(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:320:  const topics = extractTopics(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:321:  const attentionSignals = extractAttentionSignals(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:323:  const specFolder = detectSpecFolder(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:333:  const meaningfulLines = sanitizedLines.filter((line) => line.trim().length > 10 && !line.startsWith('{')).slice(-5);
.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:344:      sanitizedLines.length !== transcriptLines.length
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-truncation.vitest.ts:98:  it('T6: enabled when env var is "TRUE" (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:74:  redactedForScope?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:466:  const redactDuplicateForScope = (
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:493:    result.redactedForScope = isDifferentScope;
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:556:        redactDuplicateForScope(existing, 1.0);
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:594:          redactDuplicateForScope(bestMatch, similarity);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:92:  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:93:  const filePaths = extractFilePaths(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:94:  const topics = extractTopics(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:97:  const specFolder = detectSpecFolder(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:109:  const meaningfulLines = sanitizedLines
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:139:  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:140:  const filePaths = extractFilePaths(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:141:  const topics = extractTopics(sanitizedLines);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:148:      sanitizedLines.length !== transcriptLines.length
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-cache.ts:170:        summary: 'Fallback compaction cache assembled from sanitized transcript tail',
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:11:  redactedText: string;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:12:  redactionApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:29:  { category: 'private_key', expression: /-----BEGIN(?: RSA)? PRIVATE KEY-----[\s\S]*?-----END(?: RSA)? PRIVATE KEY-----/g },
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:55:function redactWithPattern(inputText: string, pattern: RedactionPattern, matches: RedactionMatch[]): string {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:62:    return '[REDACTED]';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:68:    return { redactedText: '', redactionApplied: false, matches: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:72:  let redactedText = inputText;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:74:    redactedText = redactWithPattern(redactedText, pattern, matches);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:78:    redactedText,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:79:    redactionApplied: matches.length > 0,
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:76: * as trigger phrases. All terms stored in lowercase for case-insensitive matching.
.opencode/skill/system-spec-kit/mcp_server/lib/search/feedback-denylist.ts:89: * Check if a term is on the denylist (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:122:  it('non-finite chunk scores are sanitized to zero before aggregation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:155:  it('returns true when env var is "TRUE" (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/core/config.ts:54:  // Use realpathSync to handle macOS /var -> /private/var symlinks.
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:115:    it('T14b: sanitizeAndLogEmbeddingFailure redacts raw provider payloads from operator logs', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:119:      const message = mod.sanitizeAndLogEmbeddingFailure(
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:130:          sanitized: {
.opencode/skill/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:135:          redacted: true,
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:60:  it('does NOT contain engagement-sensitive context types', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:147:  it('returns stability unchanged for engagement-sensitive types when flag is ON', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:171:  it('engagement-sensitive types decay normally under FSRS', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:98:  // Rule 3: Words after key phrases — keywords are case-insensitive via explicit
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:18:  sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:52:  const sanitizedPayload = sanitizeRecoveredPayload(payload);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:53:  const wrappedPayload = wrapRecoveredCompactPayload(sanitizedPayload, cachedAt);
.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/compact-inject.ts:55:  hookLog('info', 'gemini:compact-inject', `Injecting cached compact brief (${sanitizedPayload.length} chars, cached at ${cachedAt})`);
.opencode/skill/system-spec-kit/mcp_server/tests/interference.vitest.ts:121:  it('is case-insensitive', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:9:import { applyRedactionGate } from './redaction-gate.js';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:30:  redacted: number;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:68:  redacted: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:227:function redactionRatio(original: string, redacted: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:229:  const delta = Math.max(0, original.length - redacted.length);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:247:  const redactionResult = applyRedactionGate(summary);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:248:  if (redactionResult.redactionApplied) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:249:    metrics.redacted += 1;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:252:  if (redactionRatio(summary, redactionResult.redactedText) > REDACTION_SKIP_THRESHOLD) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:254:    console.error(`[extraction-adapter] Skipped insert for ${matched.rule.id}: redaction ratio above threshold`);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:273:    redactionApplied: redactionResult.redactionApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:301:  metrics.redacted = 0;
.opencode/skill/system-spec-kit/mcp_server/tests/d5-recovery-payload.vitest.ts:47:  it('returns true when set to "TRUE" (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts:202:    it('T504-09b: Normalization is case-insensitive and trims whitespace', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:7:  - "redaction gate"
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:32:The extraction module provides the post-tool extraction pipeline for automated memory creation. It handles two distinct concerns: orchestrating extraction with deterministic memory ID resolution (`extraction-adapter.ts`) and blocking PII or secret content before it reaches the memory insert path (`redaction-gate.ts`).
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:38:| Modules | 5 | `extraction-adapter.ts`, `redaction-gate.ts`, `entity-extractor.ts`, `entity-denylist.ts`, `ontology-hooks.ts` |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:63: redaction-gate.ts        # PII/secret redaction gate before memory insert
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:75:| `redaction-gate.ts` | Scans content for PII and secrets using pattern-based detection; blocks flagged content from insert | — |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:94:| **Pipeline Orchestration** | Sequences: ID resolution -> content prep -> redaction gate -> memory insert |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:97:### Redaction Gate (`redaction-gate.ts`)
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:104:| **Secret Patterns** | API keys, bearer tokens, private keys, connection strings, `.env`-style assignments |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:140:| **Matching** | Case-insensitive via `isEntityDenied(term)` |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:147:| `isEntityDenied` | `(term: string) => boolean` | Check if a term is denied (case-insensitive) |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:167:import { checkRedactionGate } from './redaction-gate';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:214:| `SPECKIT_REDACTION_GATE`  | true    | Enable the PII/secret redaction gate before memory insert. When `true`, all content passes through pattern-based PII and secret detection before reaching the memory store. Set to `false` only in trusted environments where redaction overhead is unnecessary. |
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:71:      userId: { type: 'string', description: 'User boundary for governed retrieval. Filters private or shared-space user-scoped memories.' },
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:67:  sanitizeFTS5Query: vi.fn((q: string) => q),
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:72:     NOT case-insensitive - uses exact key lookup
.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:115: *   4. Remove tokens that already appear in the original query (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:14:  private records: Map<number, { id: string; embedding: Float32Array; metadata: Record<string, unknown> }> = new Map();
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:15:  private nextId = 1;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:16:  private _available = true;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:17:  private embeddingDim: number;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:122:  private dimension: number;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:123:  private _credentialsValid = true;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:124:  private _failRate = 0;
.opencode/skill/system-spec-kit/mcp_server/tests/interfaces.vitest.ts:196:  private _hashEmbed(text: string): Float32Array {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/ontology-hooks.ts:118: * Comparison is case-insensitive.
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:545:        'check csrf protections and sanitize input',
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:292:  it('T007.6.1: all query strings are unique (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:49: * All terms stored in lowercase for case-insensitive matching.
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts:62: * Check if a term is on the entity denylist (case-insensitive).
.opencode/skill/system-spec-kit/mcp_server/README.md:434:By default, every memory is private to the user or agent that created it. Shared memory adds controlled access so multiple people or agents can read and write to a common knowledge pool.
.opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts:82:  it('S1-A-05: is case-insensitive on ANCHOR keyword', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:58:    'sanitize', 'validate', 'encrypt', 'decrypt',
.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:157:    'pentest sanitize validate and encryption checks',
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:715:  it('S4-INT-18: Flag values are case-insensitive', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:222:    segment = segment.replace(/^(?:public|private|protected|readonly)\s+/, '').trim();
.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:346:        /^\s*(?:(?:public|private|protected|static|readonly|abstract|async|override|get|set)\s+)+(?:\*\s*)?(#?\w+)\s*(?:<[^>]*>)?\s*\(([^)]*)\)\s*(?::\s*([^{]+))?\s*\{?/,
.opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts:39: * Matches <!-- SPECKIT_LEVEL: N --> (case-insensitive, optional whitespace).
.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:383: *   in its keywords or description (case-insensitive)
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:149:  it('is enabled when env var is "TRUE" (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:443:  it('is case-insensitive for stop word detection', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/query-classifier.vitest.ts:480:  it('matches exact trigger phrase (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/d5-confidence-scoring.vitest.ts:49:  it('returns true when set to "TRUE" (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:104:      spaceId: 'space-private',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:110:      spaceId: 'space-private',
.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts:119:    }, 'space-private')).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts:998:   NOTE: detectSpecLevelFromParsed() is a private function in
.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-directives.vitest.ts:448:  it('T44: content with mixed case keywords is matched case-insensitively', () => {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:318:export function sanitizeErrorField(value: string): string {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:320:    .replace(/sk-[a-zA-Z0-9_\-]{20,}/g, '[REDACTED]')
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:321:    .replace(/voy_[a-zA-Z0-9]{20,}/g, '[REDACTED]')
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:322:    .replace(/[Bb]earer\s+[a-zA-Z0-9._\-]+/g, 'Bearer [REDACTED]')
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:323:    .replace(/key[=:]\s*['"]?[a-zA-Z0-9_\-]{20,}/gi, 'key=[REDACTED]');
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:326:function sanitizeDetails(details: unknown, seen?: WeakSet<object>): unknown {
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:328:  if (typeof details === 'string') return sanitizeErrorField(details);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:333:  if (Array.isArray(details)) return details.map(item => sanitizeDetails(item, visited));
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:334:  const sanitized: Record<string, unknown> = {};
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:336:    sanitized[k] = sanitizeDetails(v, visited);
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:338:  return sanitized;
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:353:    ? sanitizeErrorField(error.message)
.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:371:      details: sanitizeDetails((error as MemoryError).details || context || null) as Record<string, unknown> | null
.opencode/skill/system-spec-kit/mcp_server/tests/ablation-framework.vitest.ts:189:    it('returns true when SPECKIT_ABLATION=TRUE (case-insensitive)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:521:      expect(result.redactedForScope).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:570:    it('redacts duplicate metadata when similar match belongs to a different scope', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:595:      expect(result.redactedForScope).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:599:    it('redacts exact-duplicate identifiers when cross-scope match is detected', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/preflight.vitest.ts:631:      expect(result.redactedForScope).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/eval-logger.vitest.ts:108:    it('T005-4: isEvalLoggingEnabled is case-insensitive ("TRUE")', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:6:  sanitizeFTS5Query,
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:45:     sanitizeFTS5Query: Basic Passthrough
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:48:  describe('sanitizeFTS5Query: Basic Passthrough', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:50:      expect(sanitizeFTS5Query('memory')).toBe('"memory"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:54:      expect(sanitizeFTS5Query('memory search retrieval')).toBe('"memory" "search" "retrieval"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:58:      expect(sanitizeFTS5Query('real-time')).toBe('"real-time"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:62:      expect(sanitizeFTS5Query('memory_index')).toBe('"memory_index"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:66:      expect(sanitizeFTS5Query('version 42')).toBe('"version" "42"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:71:     sanitizeFTS5Query: SQL Injection Attempts
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:74:  describe('sanitizeFTS5Query: SQL Injection Attempts', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:76:      const result = sanitizeFTS5Query("'; DROP TABLE memory_index; --");
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:84:      const result = sanitizeFTS5Query("1 UNION SELECT * FROM sqlite_master");
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:91:      const result = sanitizeFTS5Query("search -- comment injection");
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:97:      const result = sanitizeFTS5Query("test; DELETE FROM memory_index WHERE 1=1;");
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:103:     sanitizeFTS5Query: FTS5 Operator Removal
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:106:  describe('sanitizeFTS5Query: FTS5 Operator Removal', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:108:      expect(sanitizeFTS5Query('memory AND search')).toBe('"memory" "search"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:112:      expect(sanitizeFTS5Query('memory OR search')).toBe('"memory" "search"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:116:      expect(sanitizeFTS5Query('memory NOT deleted')).toBe('"memory" "deleted"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:120:      expect(sanitizeFTS5Query('memory NEAR search')).toBe('"memory" "search"');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:124:      const result = sanitizeFTS5Query('memory NEAR/3 search');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:131:      const result = sanitizeFTS5Query('memory And search Or retrieval Not deleted near context');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:144:      const result = sanitizeFTS5Query('memory and search or retrieval not deleted near context');
.opencode/skill/system-spec-kit/mcp_server/tests/bm25-security.vitest.ts:152:      expect(sanitizeFTS5Query('android')).toBe('"android"');

exec
/bin/zsh -lc "sed -n '560,690p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
function batchUpdateScores(sessionId: string): number {
  if (!db) return 0;
  ensureSchema();

  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
    return 0;
  }

  try {
    const currentEventCounter = getCurrentEventCounter(sessionId);
    const entries = (db.prepare(`
      SELECT id, attention_score, event_counter, mention_count
      FROM working_memory
      WHERE session_id = ?
        AND memory_id IS NOT NULL
    `) as Database.Statement).all(sessionId) as Array<{
      id: number;
      attention_score: number;
      event_counter: number;
      mention_count: number;
    }>;

    if (entries.length === 0) {
      return 0;
    }

    const updateStmt = db.prepare(`
      UPDATE working_memory
      SET attention_score = ?,
          event_counter = event_counter + 1
      WHERE id = ?
    `) as Database.Statement;

    const deleteStmt = db.prepare(`
      DELETE FROM working_memory
      WHERE id = ?
    `) as Database.Statement;

    let changedRows = 0;
    db.transaction(() => {
      for (const entry of entries) {
        const eventsElapsed = calculateEventDistance(currentEventCounter, entry.event_counter);
        const decayBase = entry.attention_score * Math.pow(EVENT_DECAY_FACTOR, eventsElapsed);
        const mentionBoost = Math.min(entry.mention_count, MAX_MENTION_COUNT) * MENTION_BOOST_FACTOR;
        const rawScore = decayBase + mentionBoost;

        if (rawScore < DELETE_THRESHOLD) {
          const deleteResult = deleteStmt.run(entry.id) as { changes: number };
          changedRows += deleteResult.changes;
          continue;
        }

        // Clamp to [DECAY_FLOOR, 1.0].
        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
        const updateResult = updateStmt.run(nextScore, entry.id) as { changes: number };
        changedRows += updateResult.changes;
      }
    })();

    return changedRows;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
    return 0;
  }
}

function getCurrentEventCounter(sessionId: string): number {
  const current = getLatestSessionEventCounter(sessionId);
  if (current === null) {
    return 0;
  }

  return current;
}

function getLatestSessionEventCounter(sessionId: string): number | null {
  if (!db) return null;

  try {
    const row = (db.prepare(`
      SELECT event_counter
      FROM working_memory
      WHERE session_id = ?
        AND memory_id IS NOT NULL
      ORDER BY last_focused DESC, id DESC
      LIMIT 1
    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };

    if (!row || typeof row.event_counter !== 'number' || Number.isNaN(row.event_counter)) {
      return null;
    }

    return row.event_counter;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.warn(`[working-memory] getLatestSessionEventCounter error: ${msg}`);
    return null;
  }
}

function calculateEventDistance(currentCounter: number, entryCounter: number): number {
  const normalizedCurrent = ((currentCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
  const normalizedEntry = ((entryCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
  return (normalizedCurrent - normalizedEntry + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
}

/* --- 8. UTILITY FUNCTIONS --- */

function isEnabled(): boolean {
  return WORKING_MEMORY_CONFIG.enabled;
}

function getConfig(): WorkingMemoryConfigType {
  return { ...WORKING_MEMORY_CONFIG };
}

function getSessionStats(sessionId: string): SessionStats | null {
  if (!db) return null;
  ensureSchema();

  try {
    const stats = (db.prepare(`
      SELECT
        COUNT(*) as totalEntries,
        AVG(attention_score) as avgAttention,
        MAX(attention_score) as maxAttention,
        MIN(attention_score) as minAttention,
        SUM(focus_count) as totalFocusEvents
      FROM working_memory

exec
/bin/zsh -lc 'rg -n "getSessionPromptContext|DECAY_FLOOR|sessionTtlMinutes|cleanupExpiredSessions|working_memory" .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.* .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:7:// The working_memory table, NOT memory_index. This is intentionally
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:35:const DECAY_FLOOR = 0.05;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:46:  CREATE TABLE IF NOT EXISTS working_memory (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:66:  CREATE INDEX IF NOT EXISTS idx_wm_session ON working_memory(session_id);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:67:  CREATE INDEX IF NOT EXISTS idx_wm_attention ON working_memory(session_id, attention_score DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:68:  CREATE INDEX IF NOT EXISTS idx_wm_added ON working_memory(added_at);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:69:  CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:70:  CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:144:    const wmColumns = (db.prepare('PRAGMA table_info(working_memory)').all() as Array<{ name: string }>)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:148:      db.exec('ALTER TABLE working_memory ADD COLUMN event_counter INTEGER NOT NULL DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:151:      db.exec('ALTER TABLE working_memory ADD COLUMN mention_count INTEGER NOT NULL DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:154:      db.exec('ALTER TABLE working_memory ADD COLUMN source_tool TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:157:      db.exec('ALTER TABLE working_memory ADD COLUMN source_call_id TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:160:      db.exec('ALTER TABLE working_memory ADD COLUMN extraction_rule_id TEXT');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:163:      db.exec('ALTER TABLE working_memory ADD COLUMN redaction_applied INTEGER NOT NULL DEFAULT 0');
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:179:    "SELECT sql FROM sqlite_master WHERE type='table' AND name='working_memory'"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:189:    ALTER TABLE working_memory RENAME TO working_memory_old;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:191:    INSERT INTO working_memory (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:220:    FROM working_memory_old;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:221:    DROP TABLE working_memory_old;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:242:      'DELETE FROM working_memory WHERE session_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:261:      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:264:      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:285:      SELECT * FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:304:      FROM working_memory wm
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:339:      FROM working_memory wm
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:349:    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:395:      'SELECT id FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:400:        UPDATE working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:413:        INSERT INTO working_memory (session_id, memory_id, attention_score, event_counter, mention_count)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:450:      INSERT INTO working_memory (
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:463:          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:464:          ELSE working_memory.attention_score
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:467:        focus_count = working_memory.focus_count + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:468:        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:488:      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:524:      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:531:      DELETE FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:533:        SELECT id FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:572:      FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:587:      UPDATE working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:594:      DELETE FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:612:        // Clamp to [DECAY_FLOOR, 1.0].
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:614:        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:643:      FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:690:      FROM working_memory
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:739:  getSessionPromptContext,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:747:  DECAY_FLOOR,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:20:  sessionTtlMinutes: number;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:182:  sessionTtlMinutes: parseInt(process.env.SESSION_TTL_MINUTES as string, 10) || 30,
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:214:  cleanupExpiredSessions();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:223:      cleanupExpiredSessions();
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:737:function cleanupExpiredSessions(): CleanupResult {
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:741:    const cutoffMs = Date.now() - SESSION_CONFIG.sessionTtlMinutes * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:761: *   - working_memory: entries with last_focused older than threshold
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:782:  // 1. Clean stale working_memory entries
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:784:    const wmStmt = db.prepare('DELETE FROM working_memory WHERE last_focused < ?');
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:791:      errors.push(`working_memory cleanup: ${msg}`);
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:824:      `[session-manager] Stale session cleanup: removed ${workingMemoryDeleted} working_memory, ` +
.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1408:  cleanupExpiredSessions,

exec
/bin/zsh -lc "sed -n '220,280p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "handle_memory_search|handle_memory_match_triggers|handle_memory_context|handle_memory_causal|handle_session_bootstrap|handle_session_resume" .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
222:export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
226:export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
314:export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
315:export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
316:export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');
320:export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');

exec
/bin/zsh -lc 'rg -n "redaction gate|applyRedactionGate|checkRedactionGate|redactionApplied|private tag|REDACTED" .opencode/skill/system-spec-kit/mcp_server/handlers/save .opencode/skill/system-spec-kit/mcp_server/lib/extraction' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:12:  redactionApplied: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:62:    return '[REDACTED]';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:66:function applyRedactionGate(inputText: string): RedactionResult {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:68:    return { redactedText: '', redactionApplied: false, matches: [] };
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:79:    redactionApplied: matches.length > 0,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts:85:  applyRedactionGate,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:9:import { applyRedactionGate } from './redaction-gate.js';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:247:  const redactionResult = applyRedactionGate(summary);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:248:  if (redactionResult.redactionApplied) {
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:273:    redactionApplied: redactionResult.redactionApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:7:  - "redaction gate"
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:63: redaction-gate.ts        # PII/secret redaction gate before memory insert
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:94:| **Pipeline Orchestration** | Sequences: ID resolution -> content prep -> redaction gate -> memory insert |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:167:import { checkRedactionGate } from './redaction-gate';
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:171:const result = checkRedactionGate(content);
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:198:| Gate before insert | `checkRedactionGate(content)` | All automated extraction paths |
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md:214:| `SPECKIT_REDACTION_GATE`  | true    | Enable the PII/secret redaction gate before memory insert. When `true`, all content passes through pattern-based PII and secret detection before reaching the memory store. Set to `false` only in trusted environments where redaction overhead is unnecessary. |

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Extraction Adapter
// ───────────────────────────────────────────────────────────────
// Feature catalog: Auto entity extraction
import type Database from 'better-sqlite3';
import path from 'path';
import * as workingMemory from '../cognitive/working-memory.js';
import { isFeatureEnabled } from '../cognitive/rollout-policy.js';
import { applyRedactionGate } from './redaction-gate.js';

type SummarizerId = 'firstLast500' | 'matchCountSummary' | 'stdoutSummary';

interface ExtractionRule {
  readonly id: string;
  readonly toolPattern: RegExp;
  readonly contentPattern: RegExp;
  readonly attention: number;
  readonly summarizer: SummarizerId;
}

interface RuleMatch {
  rule: ExtractionRule;
  sourceText: string;
}

interface ExtractionMetrics {
  matched: number;
  inserted: number;
  skipped: number;
  redacted: number;
}

type RegisterAfterToolCallback = (
  fn: (tool: string, callId: string, result: unknown) => Promise<void>
) => void;

const REDACTION_SKIP_THRESHOLD = 0.9;

const RULES: ExtractionRule[] = [
  {
    id: 'read-spec',
    toolPattern: /^(read|memory_context|memory_search|memory_list)$/i,
    contentPattern: /spec\.md/i,
    attention: 0.9,
    summarizer: 'firstLast500',
  },
  {
    id: 'grep-error',
    toolPattern: /^(grep|memory_search)$/i,
    contentPattern: /\berror\b/i,
    attention: 0.8,
    summarizer: 'matchCountSummary',
  },
  {
    id: 'bash-git-commit',
    toolPattern: /^(bash|memory_save|memory_update)$/i,
    contentPattern: /\bgit\s+commit\b/i,
    attention: 0.7,
    summarizer: 'stdoutSummary',
  },
];

let db: Database.Database | null = null;
const metrics: ExtractionMetrics = {
  matched: 0,
  inserted: 0,
  skipped: 0,
  redacted: 0,
};

function isEnabled(identity?: string): boolean {
  return isFeatureEnabled('SPECKIT_EXTRACTION', identity);
}

function normalizeAttention(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function assertSafeRegex(expression: RegExp, ruleId: string, fieldName: 'toolPattern' | 'contentPattern'): void {
  const source = expression.source;
  if (/\([^)]*[+*][^)]*\)[+*{?]/.test(source)) {
    throw new Error(`[extraction-adapter] Unsafe regex rejected (${ruleId}.${fieldName}): nested quantifier group detected`);
  }
  if (/\\[1-9]/.test(source)) {
    throw new Error(`[extraction-adapter] Unsafe regex rejected (${ruleId}.${fieldName}): backreferences are not allowed`);
  }
}

function validateExtractionRules(rules: ExtractionRule[]): void {
  for (const rule of rules) {
    assertSafeRegex(rule.toolPattern, rule.id, 'toolPattern');
    assertSafeRegex(rule.contentPattern, rule.id, 'contentPattern');
    if (rule.summarizer !== 'firstLast500' && rule.summarizer !== 'matchCountSummary' && rule.summarizer !== 'stdoutSummary') {
      throw new Error(`[extraction-adapter] Unknown summarizer for rule ${rule.id}: ${rule.summarizer}`);
    }
  }
}

function stringifyToolResult(result: unknown): string {
  if (typeof result === 'string') return result;
  if (result === null || result === undefined) return '';

  const maybeEnvelope = result as { content?: Array<{ text?: string }> };
  const envelopeText = maybeEnvelope?.content?.[0]?.text;
  if (typeof envelopeText === 'string' && envelopeText.length > 0) {
    return envelopeText;
  }

  try {
    return JSON.stringify(result, null, 2);
  } catch {
    // Intentional no-op — error deliberately discarded for fail-safe fallback
    return String(result);
  }
}

function summarizeFirstLast500(content: string): string {
  if (content.length <= 1000) return content;
  const head = content.slice(0, 500);
  const tail = content.slice(-500);
  return `${head}\n...\n${tail}`;
}

function summarizeMatchCount(content: string): string {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const sample = lines.slice(0, 5).join('\n');
  return `match_count=${lines.length}\n${sample}`;
}

function summarizeStdout(content: string): string {
  const trimmed = content.trim();
  if (trimmed.length <= 600) return trimmed;
  return `${trimmed.slice(0, 600)}...`;
}

/** Applies the configured summarizer to produce a summary from the given text content. */
function applySummarizer(summarizer: SummarizerId, content: string): string {
  if (summarizer === 'firstLast500') return summarizeFirstLast500(content);
  if (summarizer === 'matchCountSummary') return summarizeMatchCount(content);
  return summarizeStdout(content);
}

/** Tests input text against extraction rules and returns the first matching rule, or null. */
function matchRule(toolName: string, rawText: string): RuleMatch | null {
  for (const rule of RULES) {
    if (!rule.toolPattern.test(toolName)) {
      continue;
    }
    if (!rule.contentPattern.test(rawText)) {
      continue;
    }
    return { rule, sourceText: rawText };
  }
  return null;
}

function resolveSessionId(result: unknown): string {
  try {
    const maybeEnvelope = result as { content?: Array<{ text?: string }> };
    const payloadText = maybeEnvelope?.content?.[0]?.text;
    if (typeof payloadText === 'string' && payloadText.trim().length > 0) {
      const parsed = JSON.parse(payloadText) as {
        meta?: { sessionLifecycle?: { effectiveSessionId?: string }; sessionId?: string };
        data?: { sessionId?: string };
      };
      const fromLifecycle = parsed?.meta?.sessionLifecycle?.effectiveSessionId;
      if (typeof fromLifecycle === 'string' && fromLifecycle.trim().length > 0) {
        return fromLifecycle;
      }
      const fromMeta = parsed?.meta?.sessionId;
      if (typeof fromMeta === 'string' && fromMeta.trim().length > 0) {
        return fromMeta;
      }
      const fromData = parsed?.data?.sessionId;
      if (typeof fromData === 'string' && fromData.trim().length > 0) {
        return fromData;
      }
    }
  } catch {
    // Intentional no-op — error deliberately discarded for fail-safe fallback
  }

  return 'auto-extraction';
}

// E2 FIX: Returns null on resolution failure instead of falling back to most-recent memory ID
function resolveMemoryIdFromText(sourceText: string): number | null {
  if (!db) return null;

  const idMatch = sourceText.match(/"id"\s*:\s*(\d+)/);
  if (idMatch) {
    const memoryId = Number.parseInt(idMatch[1], 10);
    const exists = (db.prepare('SELECT id FROM memory_index WHERE id = ? LIMIT 1') as Database.Statement)
      .get(memoryId) as { id: number } | undefined;
    if (exists?.id) {
      return exists.id;
    }
  }

  const pathMatch = sourceText.match(/[A-Za-z0-9_./-]*spec\.md/);
  if (pathMatch && pathMatch[0].length > 0) {
    const resolvedPath = path.resolve(pathMatch[0]);
    try {
      const canonicalRow = (db.prepare('SELECT id FROM memory_index WHERE canonical_file_path = ? LIMIT 1') as Database.Statement)
        .get(resolvedPath) as { id: number } | undefined;
      if (canonicalRow?.id) {
        return canonicalRow.id;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('canonical_file_path')) {
        return null;
      }
    }

    const filePathRow = (db.prepare('SELECT id FROM memory_index WHERE file_path = ? LIMIT 1') as Database.Statement)
      .get(resolvedPath) as { id: number } | undefined;
    if (filePathRow?.id) {
      return filePathRow.id;

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Create Record
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index.js';
import * as bm25Index from '../../lib/search/bm25-index.js';
import * as predictionErrorGate from '../../lib/cognitive/prediction-error-gate.js';
import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler.js';
import * as incrementalIndex from '../../lib/storage/incremental-index.js';
import * as causalEdges from '../../lib/storage/causal-edges.js';
import type * as memoryParser from '../../lib/parsing/memory-parser.js';
import { sanitizeEmbeddingFailureMessage } from '../../lib/providers/retry-manager.js';
import { getCanonicalPathKey } from '../../lib/utils/canonical-path.js';
import { recordLineageTransition } from '../../lib/storage/lineage-state.js';
import { toErrorMessage } from '../../utils/index.js';

import { recordHistory } from '../../lib/storage/history.js';
import { calculateDocumentWeight, isSpecDocumentType } from '../pe-gating.js';
import { detectSpecLevelFromParsed } from '../handler-utils.js';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent.js';
import { isEncodingIntentEnabled } from '../../lib/search/search-flags.js';
import { applyPostInsertMetadata } from './db-helpers.js';

// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Per-memory history log
// Feature catalog: Prediction-error save arbitration


import type { PeDecision, MemoryScopeMatch } from './types.js';
import { normalizeScopeMatchValue } from './types.js';
export type { MemoryScopeMatch };

interface LineageRoutingDecision {
  predecessorMemoryId: number | null;
  transitionEvent: 'CREATE' | 'UPDATE' | 'SUPERSEDE';
  causalSupersedesMemoryId: number | null;
}

export function resolveCreateRecordLineage(
  peDecision: PeDecision,
  samePathExistingId: number | null,
): LineageRoutingDecision {
  if (peDecision.action === predictionErrorGate.ACTION.SUPERSEDE && peDecision.existingMemoryId != null) {
    return {
      predecessorMemoryId: samePathExistingId,
      transitionEvent: samePathExistingId != null ? 'SUPERSEDE' : 'CREATE',
      causalSupersedesMemoryId: samePathExistingId === peDecision.existingMemoryId
        ? null
        : peDecision.existingMemoryId,
    };
  }

  if (samePathExistingId != null) {
    return {
      predecessorMemoryId: samePathExistingId,
      transitionEvent: 'UPDATE',
      causalSupersedesMemoryId: null,
    };
  }

  return {
    predecessorMemoryId: null,
    transitionEvent: 'CREATE',
    causalSupersedesMemoryId: null,
  };
}

function recordCrossPathSupersedesEdge(
  database: BetterSqlite3.Database,
  memoryId: number,
  supersededMemoryId: number | null,
  reason: string | null | undefined,
): void {
  if (supersededMemoryId == null) {
    return;
  }

  causalEdges.init(database);
  const evidence = reason && reason.trim().length > 0
    ? reason.trim()
    : 'Prediction-error contradiction across different file paths';
  causalEdges.insertEdge(
    String(memoryId),
    String(supersededMemoryId),
    causalEdges.RELATION_TYPES.SUPERSEDES,
    1.0,
    evidence,
    true,
    'auto',
  );
}

export function findSamePathExistingMemory(
  database: BetterSqlite3.Database,
  specFolder: string,
  canonicalFilePath: string,
  filePath: string,
  scope: MemoryScopeMatch = {},
): { id: number; title: string | null; content_hash?: string | null } | undefined {
  const tenantId = normalizeScopeMatchValue(scope.tenantId);
  const userId = normalizeScopeMatchValue(scope.userId);
  const agentId = normalizeScopeMatchValue(scope.agentId);
  const sessionId = normalizeScopeMatchValue(scope.sessionId);
  const sharedSpaceId = normalizeScopeMatchValue(scope.sharedSpaceId);

  return database.prepare(`
    SELECT id, title, content_hash
    FROM memory_index
    WHERE spec_folder = ?
      AND parent_id IS NULL
      AND (canonical_file_path = ? OR file_path = ?)
      AND ((? IS NULL AND tenant_id IS NULL) OR tenant_id = ?)
      AND ((? IS NULL AND user_id IS NULL) OR user_id = ?)
      AND ((? IS NULL AND agent_id IS NULL) OR agent_id = ?)
      AND ((? IS NULL AND session_id IS NULL) OR session_id = ?)
      AND ((? IS NULL AND shared_space_id IS NULL) OR shared_space_id = ?)
    ORDER BY id DESC
    LIMIT 1
  `).get(
    specFolder,
    canonicalFilePath,
    filePath,
    tenantId,
    tenantId,
    userId,
    userId,
    agentId,
    agentId,
    sessionId,
    sessionId,
    sharedSpaceId,
    sharedSpaceId,
  ) as { id: number; title: string | null; content_hash?: string | null } | undefined;
}

/**
 * Creates a memory row with metadata, optional BM25 entry, and save history.
 * Returns the persisted memory id for downstream save handlers.
 */
export function createMemoryRecord(
  database: BetterSqlite3.Database,
  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
  filePath: string,
  embedding: Float32Array | null,
  embeddingFailureReason: string | null,
  peDecision: PeDecision,
  scope: MemoryScopeMatch = {},
): number {
  if (!embedding) {
    console.error(`[memory-save] Using deferred indexing for ${path.basename(filePath)}`);
  }

  // Detect spec level for spec documents.
  const specLevel = isSpecDocumentType(parsed.documentType)
    ? detectSpecLevelFromParsed(filePath)
    : null;
  const encodingIntent = isEncodingIntentEnabled()
    ? classifyEncodingIntent(parsed.content)
    : undefined;
  const canonicalFilePath = getCanonicalPathKey(filePath);
  // Security: raw provider errors sanitized before persistence/response
  const persistedEmbeddingFailureReason = sanitizeEmbeddingFailureMessage(embeddingFailureReason);

  const indexWithMetadata = database.transaction(() => {
    // Determine importance weight based on document type.
    const importanceWeight = calculateDocumentWeight(filePath, parsed.documentType);
    const samePathExisting = findSamePathExistingMemory(
      database,
      parsed.specFolder,
      canonicalFilePath,
      filePath,
      scope,
    );
    const lineageRouting = resolveCreateRecordLineage(peDecision, samePathExisting?.id ?? null);
    const predecessorMemoryId = lineageRouting.predecessorMemoryId;
    const transitionEvent = lineageRouting.transitionEvent;

    const memory_id: number = embedding
      ? vectorIndex.indexMemory({
          specFolder: parsed.specFolder,
          filePath,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          embedding,
          encodingIntent,
          documentType: parsed.documentType || 'memory',
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
          appendOnly: predecessorMemoryId != null,
        })
      : vectorIndex.indexMemoryDeferred({
          specFolder: parsed.specFolder,
          filePath,
          title: parsed.title,
          triggerPhrases: parsed.triggerPhrases,
          importanceWeight,
          failureReason: persistedEmbeddingFailureReason,
          encodingIntent,
          documentType: parsed.documentType || 'memory',
          specLevel,
          contentText: parsed.content,
          qualityScore: parsed.qualityScore,
          qualityFlags: parsed.qualityFlags,
          appendOnly: predecessorMemoryId != null,
        });

    const fileMetadata = incrementalIndex.getFileMetadata(filePath);
    const fileMtimeMs = fileMetadata ? fileMetadata.mtime : null;

    applyPostInsertMetadata(database, memory_id, {
      content_hash: parsed.contentHash,
      context_type: parsed.contextType,
      importance_tier: parsed.importanceTier,
      memory_type: parsed.memoryType,
      type_inference_source: parsed.memoryTypeSource,

codex
I’ve narrowed this to five non-overlapping architecture deltas that feel like real paradigm shifts rather than surface-level features. I’m pulling exact line-number evidence now so the final iteration report can stay concrete and auditable against both Engram and Public.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '520,545p;754,766p;945,1069p;1118,1175p;1360,1455p;1470,1565p;1613,1668p;2438,2505p;3201,3395p;3483,3525p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
  1360	func (s *Store) Timeline(observationID int64, before, after int) (*TimelineResult, error) {
  1361		if before <= 0 {
  1362			before = 5
  1363		}
  1364		if after <= 0 {
  1365			after = 5
  1366		}
  1367	
  1368		// 1. Get the focus observation
  1369		focus, err := s.GetObservation(observationID)
  1370		if err != nil {
  1371			return nil, fmt.Errorf("timeline: observation #%d not found: %w", observationID, err)
  1372		}
  1373	
  1374		// 2. Get session info
  1375		session, err := s.GetSession(focus.SessionID)
  1376		if err != nil {
  1377			// Session might be missing for manual-save observations — non-fatal
  1378			session = nil
  1379		}
  1380	
  1381		// 3. Get observations BEFORE the focus (same session, older, chronological order)
  1382		beforeRows, err := s.queryItHook(s.db, `
  1383			SELECT id, session_id, type, title, content, tool_name, project,
  1384			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  1385			FROM observations
  1386			WHERE session_id = ? AND id < ? AND deleted_at IS NULL
  1387			ORDER BY id DESC
  1388			LIMIT ?
  1389		`, focus.SessionID, observationID, before)
  1390		if err != nil {
  1391			return nil, fmt.Errorf("timeline: before query: %w", err)
  1392		}
  1393		defer beforeRows.Close()
  1394	
  1395		var beforeEntries []TimelineEntry
  1396		for beforeRows.Next() {
  1397			var e TimelineEntry
  1398			if err := beforeRows.Scan(
  1399				&e.ID, &e.SessionID, &e.Type, &e.Title, &e.Content,
  1400				&e.ToolName, &e.Project, &e.Scope, &e.TopicKey, &e.RevisionCount, &e.DuplicateCount, &e.LastSeenAt,
  1401				&e.CreatedAt, &e.UpdatedAt, &e.DeletedAt,
  1402			); err != nil {
  1403				return nil, err
  1404			}
  1405			beforeEntries = append(beforeEntries, e)
  1406		}
  1407		if err := beforeRows.Err(); err != nil {
  1408			return nil, err
  1409		}
  1410		// Reverse to get chronological order (oldest first)
  1411		for i, j := 0, len(beforeEntries)-1; i < j; i, j = i+1, j-1 {
  1412			beforeEntries[i], beforeEntries[j] = beforeEntries[j], beforeEntries[i]
  1413		}
  1414	
  1415		// 4. Get observations AFTER the focus (same session, newer, chronological order)
  1416		afterRows, err := s.queryItHook(s.db, `
  1417			SELECT id, session_id, type, title, content, tool_name, project,
  1418			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  1419			FROM observations
  1420			WHERE session_id = ? AND id > ? AND deleted_at IS NULL
  1421			ORDER BY id ASC
  1422			LIMIT ?
  1423		`, focus.SessionID, observationID, after)
  1424		if err != nil {
  1425			return nil, fmt.Errorf("timeline: after query: %w", err)
  1426		}
  1427		defer afterRows.Close()
  1428	
  1429		var afterEntries []TimelineEntry
  1430		for afterRows.Next() {
  1431			var e TimelineEntry
  1432			if err := afterRows.Scan(
  1433				&e.ID, &e.SessionID, &e.Type, &e.Title, &e.Content,
  1434				&e.ToolName, &e.Project, &e.Scope, &e.TopicKey, &e.RevisionCount, &e.DuplicateCount, &e.LastSeenAt,
  1435				&e.CreatedAt, &e.UpdatedAt, &e.DeletedAt,
  1436			); err != nil {
  1437				return nil, err
  1438			}
  1439			afterEntries = append(afterEntries, e)
  1440		}
  1441		if err := afterRows.Err(); err != nil {
  1442			return nil, err
  1443		}
  1444	
  1445		// 5. Count total observations in the session for context
  1446		var totalInRange int
  1447		s.db.QueryRow(
  1448			"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
  1449		).Scan(&totalInRange)
  1450	
  1451		return &TimelineResult{
  1452			Focus:        *focus,
  1453			Before:       beforeEntries,
  1454			After:        afterEntries,
  1455			SessionInfo:  session,
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '36,80p;118,140p;250,320p;340,395p;410,520p;530,595p;625,740p;851,919p;1030,1118p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go | sed -n '1,120p'; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go | sed -n '1,150p'; nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package project provides utilities for detecting and normalizing project names.
     2	//
     3	// It replicates the detection logic from the Claude Code shell helpers and
     4	// OpenCode TypeScript plugin in pure Go, so CLI and MCP server can share
     5	// a single canonical implementation.
     6	package project
     7	
     8	import (
     9		"context"
    10		"os/exec"
    11		"path/filepath"
    12		"strings"
    13		"time"
    14	)
    15	
    16	// DetectProject detects the project name for a given directory.
    17	// Priority: git remote origin repo name → git root basename → dir basename.
    18	// The returned name is always non-empty and already normalized (lowercase, trimmed).
    19	func DetectProject(dir string) string {
    20		// Guard empty dir — nothing useful to detect.
    21		if dir == "" {
    22			return "unknown"
    23		}
    24		// Guard against arg injection: a dir starting with "-" would be
    25		// interpreted as a git flag when passed to `git -C <dir>`.
    26		if strings.HasPrefix(dir, "-") {
    27			dir = "./" + dir
    28		}
    29	
    30		if name := detectFromGitRemote(dir); name != "" {
    31			return normalize(name)
    32		}
    33		if name := detectFromGitRoot(dir); name != "" {
    34			return normalize(name)
    35		}
    36		base := filepath.Base(dir)
    37		if base == "" || base == "." {
    38			return "unknown"
    39		}
    40		return normalize(base)
    41	}
    42	
    43	// normalize applies canonical project name rules: lowercase + trim whitespace.
    44	// It mirrors the normalization applied by the store layer so that DetectProject
    45	// always returns a value that is consistent with stored project names.
    46	func normalize(name string) string {
    47		n := strings.TrimSpace(strings.ToLower(name))
    48		if n == "" {
    49			return "unknown"
    50		}
    51		return n
    52	}
    53	
    54	// detectFromGitRemote attempts to determine the project name from the git
    55	// remote "origin" URL. Returns empty string if git is unavailable, the
    56	// directory is not a repo, or there is no origin remote.
    57	func detectFromGitRemote(dir string) string {
    58		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    59		defer cancel()
    60	
    61		cmd := exec.CommandContext(ctx, "git", "-C", dir, "remote", "get-url", "origin")
    62		out, err := cmd.Output()
    63		if err != nil {
    64			return ""
    65		}
    66		url := strings.TrimSpace(string(out))
    67		return extractRepoName(url)
    68	}
    69	
    70	// detectFromGitRoot returns the basename of the git repository root.
    71	// Falls back to empty string when git is unavailable or the directory is not
    72	// inside a git repository.
    73	func detectFromGitRoot(dir string) string {
    74		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
    75		defer cancel()
    76	
    77		cmd := exec.CommandContext(ctx, "git", "-C", dir, "rev-parse", "--show-toplevel")
    78		out, err := cmd.Output()
    79		if err != nil {
    80			return ""
    81		}
    82		root := strings.TrimSpace(string(out))
    83		if root == "" {
    84			return ""
    85		}
    86		return filepath.Base(root)
    87	}
    88	
    89	// extractRepoName parses a git remote URL and returns just the repository name.
    90	//
    91	// Supported URL formats:
    92	//   - SSH:   git@github.com:user/repo.git
    93	//   - HTTPS: https://github.com/user/repo.git
    94	//   - Either with or without the trailing .git suffix
    95	func extractRepoName(url string) string {
    96		// Strip trailing .git suffix
    97		url = strings.TrimSuffix(url, ".git")
    98	
    99		// Split on both "/" and ":" to handle SSH and HTTPS uniformly
   100		parts := strings.FieldsFunc(url, func(r rune) bool {
   101			return r == '/' || r == ':'
   102		})
   103		if len(parts) == 0 {
   104			return ""
   105		}
   106		name := parts[len(parts)-1]
   107		return strings.TrimSpace(name)
   108	}
     1	package project
     2	
     3	import (
     4		"sort"
     5		"strings"
     6	)
     7	
     8	// ProjectMatch represents a project name that is similar to a query string.
     9	type ProjectMatch struct {
    10		Name      string // The existing project name
    11		MatchType string // "case-insensitive", "substring", or "levenshtein"
    12		Distance  int    // Levenshtein distance (0 for case-insensitive and substring matches)
    13	}
    14	
    15	// FindSimilar finds projects similar to the given name from a list of existing
    16	// project names. Similarity is determined by three criteria:
    17	//
    18	//  1. Case-insensitive exact match (different case, same letters)
    19	//  2. Substring containment (query is a substring of candidate or vice-versa)
    20	//  3. Levenshtein distance ≤ maxDistance
    21	//
    22	// Exact matches (identical strings) are always excluded.
    23	//
    24	// Results are ordered: case-insensitive matches first, then substring matches,
    25	// then levenshtein matches sorted by distance ascending.
    26	func FindSimilar(name string, existing []string, maxDistance int) []ProjectMatch {
    27		if maxDistance < 0 {
    28			maxDistance = 0
    29		}
    30	
    31		nameLower := strings.ToLower(strings.TrimSpace(name))
    32	
    33		// Scale maxDistance for short names to avoid noisy matches.
    34		// A 2-char name with maxDistance 3 would match almost everything.
    35		effectiveMax := maxDistance
    36		if len(nameLower) > 0 {
    37			halfLen := len(nameLower) / 2
    38			if halfLen < 1 {
    39				halfLen = 1
    40			}
    41			if effectiveMax > halfLen {
    42				effectiveMax = halfLen
    43			}
    44		}
    45	
    46		var caseMatches []ProjectMatch
    47		var subMatches []ProjectMatch
    48		var levMatches []ProjectMatch
    49	
    50		seen := make(map[string]bool)
    51	
    52		for _, candidate := range existing {
    53			// Skip exact match (same string, no drift)
    54			if candidate == name {
    55				continue
    56			}
    57	
    58			candidateLower := strings.ToLower(strings.TrimSpace(candidate))
    59	
    60			// Skip after case-fold too — that would be a normalized duplicate
    61			if candidateLower == nameLower {
    62				// Only add if the strings differ (different casing is still drift)
    63				if candidate != name {
    64					if !seen[candidate] {
    65						seen[candidate] = true
    66						caseMatches = append(caseMatches, ProjectMatch{
    67							Name:      candidate,
    68							MatchType: "case-insensitive",
    69							Distance:  0,
    70						})
    71					}
    72				}
    73				continue
    74			}
    75	
    76			// Substring match — skip for very short names (< 3 chars)
    77			// to avoid noisy matches like "go" matching "golang-tools"
    78			if len(nameLower) >= 3 {
    79				if strings.Contains(candidateLower, nameLower) || strings.Contains(nameLower, candidateLower) {
    80					if !seen[candidate] {
    81						seen[candidate] = true
    82						subMatches = append(subMatches, ProjectMatch{
    83							Name:      candidate,
    84							MatchType: "substring",
    85							Distance:  0,
    86						})
    87					}
    88					continue
    89				}
    90			}
    91	
    92			// Levenshtein distance (using scaled effectiveMax)
    93			dist := levenshtein(nameLower, candidateLower)
    94			if dist <= effectiveMax {
    95				if !seen[candidate] {
    96					seen[candidate] = true
    97					levMatches = append(levMatches, ProjectMatch{
    98						Name:      candidate,
    99						MatchType: "levenshtein",
   100						Distance:  dist,
   101					})
   102				}
   103			}
   104		}
   105	
   106		// Sort levenshtein results by distance ascending
   107		sort.Slice(levMatches, func(i, j int) bool {
   108			return levMatches[i].Distance < levMatches[j].Distance
   109		})
   110	
   111		result := make([]ProjectMatch, 0, len(caseMatches)+len(subMatches)+len(levMatches))
   112		result = append(result, caseMatches...)
   113		result = append(result, subMatches...)
   114		result = append(result, levMatches...)
   115		return result
   116	}
   117	
   118	// levenshtein computes the Levenshtein (edit) distance between strings a and b.
   119	// Uses the standard dynamic-programming approach with O(min(|a|,|b|)) space
   120	// by only keeping two rows of the DP table at a time.
   121	func levenshtein(a, b string) int {
   122		ra := []rune(a)
   123		rb := []rune(b)
   124		la, lb := len(ra), len(rb)
   125	
   126		if la == 0 {
   127			return lb
   128		}
   129		if lb == 0 {
   130			return la
   131		}
   132	
   133		// Ensure a is the shorter string for space optimisation
   134		if la > lb {
   135			ra, rb = rb, ra
   136			la, lb = lb, la
   137		}
   138	
   139		prev := make([]int, la+1)
   140		curr := make([]int, la+1)
   141	
   142		for i := 0; i <= la; i++ {
   143			prev[i] = i
   144		}
   145	
   146		for j := 1; j <= lb; j++ {
   147			curr[0] = j
   148			for i := 1; i <= la; i++ {
   149				cost := 1
   150				if ra[i-1] == rb[j-1] {
     1	// Package sync implements git-friendly memory synchronization for Engram.
     2	//
     3	// Instead of a single large JSON file, memories are stored as compressed
     4	// JSONL chunks with a manifest index. This design:
     5	//
     6	//   - Avoids git merge conflicts (each sync creates a NEW chunk, never modifies old ones)
     7	//   - Keeps files small (each chunk is gzipped JSONL)
     8	//   - Tracks what's been imported via chunk IDs (no duplicates)
     9	//   - Works for teams (multiple devs create independent chunks)
    10	//
    11	// Directory structure:
    12	//
    13	//	.engram/
    14	//	├── manifest.json          ← index of all chunks (small, mergeable)
    15	//	├── chunks/
    16	//	│   ├── a3f8c1d2.jsonl.gz ← chunk 1 (compressed)
    17	//	│   ├── b7d2e4f1.jsonl.gz ← chunk 2
    18	//	│   └── ...
    19	//	└── engram.db              ← local working DB (gitignored)
    20	package sync
    21	
    22	import (
    23		"compress/gzip"
    24		"crypto/sha256"
    25		"encoding/hex"
    26		"encoding/json"
    27		"fmt"
    28		"os"
    29		"path/filepath"
    30		"sort"
    31		"strings"
    32		"time"
    33	
    34		"github.com/Gentleman-Programming/engram/internal/store"
    35	)
    36	
    37	var (
    38		jsonMarshalChunk    = json.Marshal
    39		jsonMarshalManifest = json.MarshalIndent
    40		osCreateFile        = os.Create
    41		gzipWriterFactory   = func(f *os.File) gzipWriter { return gzip.NewWriter(f) }
    42		osHostname          = os.Hostname
    43		storeGetSynced      = func(s *store.Store) (map[string]bool, error) { return s.GetSyncedChunks() }
    44		storeExportData     = func(s *store.Store) (*store.ExportData, error) { return s.Export() }
    45		storeImportData     = func(s *store.Store, d *store.ExportData) (*store.ImportResult, error) { return s.Import(d) }
    46		storeRecordSynced   = func(s *store.Store, chunkID string) error { return s.RecordSyncedChunk(chunkID) }
    47	)
    48	
    49	type gzipWriter interface {
    50		Write(p []byte) (n int, err error)
    51		Close() error
    52	}
    53	
    54	// ─── Manifest ────────────────────────────────────────────────────────────────
    55	
    56	// Manifest is the index file that lists all chunks.
    57	// This is the only file git needs to diff/merge — it's small and append-only.
    58	type Manifest struct {
    59		Version int          `json:"version"`
    60		Chunks  []ChunkEntry `json:"chunks"`
    61	}
    62	
    63	// ChunkEntry describes a single chunk in the manifest.
    64	type ChunkEntry struct {
    65		ID        string `json:"id"`         // SHA-256 hash prefix (8 chars) of content
    66		CreatedBy string `json:"created_by"` // Username or machine identifier
    67		CreatedAt string `json:"created_at"` // ISO timestamp
    68		Sessions  int    `json:"sessions"`   // Number of sessions in chunk
    69		Memories  int    `json:"memories"`   // Number of observations in chunk
    70		Prompts   int    `json:"prompts"`    // Number of prompts in chunk
    71	}
    72	
    73	// ChunkData is the content of a single chunk file (JSONL entries).
    74	type ChunkData struct {
    75		Sessions     []store.Session     `json:"sessions"`
    76		Observations []store.Observation `json:"observations"`
    77		Prompts      []store.Prompt      `json:"prompts"`
    78	}
    79	
    80	// SyncResult is returned after a sync operation.
    81	type SyncResult struct {
    82		ChunkID              string `json:"chunk_id,omitempty"`
    83		SessionsExported     int    `json:"sessions_exported"`
    84		ObservationsExported int    `json:"observations_exported"`
    85		PromptsExported      int    `json:"prompts_exported"`
    86		IsEmpty              bool   `json:"is_empty"` // true if nothing new to sync
    87	}
    88	
    89	// ImportResult is returned after importing chunks.
    90	type ImportResult struct {
    91		ChunksImported       int `json:"chunks_imported"`
    92		ChunksSkipped        int `json:"chunks_skipped"` // Already imported
    93		SessionsImported     int `json:"sessions_imported"`
    94		ObservationsImported int `json:"observations_imported"`
    95		PromptsImported      int `json:"prompts_imported"`
    96	}
    97	
    98	// ─── Syncer ──────────────────────────────────────────────────────────────────
    99	
   100	// Syncer handles exporting and importing memory chunks.
   101	type Syncer struct {
   102		store     *store.Store
   103		syncDir   string    // Path to .engram/ in the project repo (kept for backward compat)
   104		transport Transport // Pluggable I/O backend (filesystem, remote, etc.)
   105	}
   106	
   107	// New creates a Syncer with a FileTransport rooted at syncDir.
   108	// This preserves the original constructor signature for backward compatibility.
   109	func New(s *store.Store, syncDir string) *Syncer {
   110		return &Syncer{
   111			store:     s,
   112			syncDir:   syncDir,
   113			transport: NewFileTransport(syncDir),
   114		}
   115	}
   116	
   117	// NewLocal is an alias for New — creates a Syncer backed by the local filesystem.
   118	// Preferred in call sites where the name makes the intent clearer.
   119	func NewLocal(s *store.Store, syncDir string) *Syncer {
   120		return New(s, syncDir)

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,140p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,120p;320,360p;430,520p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,120p;820,855p;1430,1455p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '450,470p;1251,1320p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts | sed -n '220,280p;398,470p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts | sed -n '200,280p;560,780p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts | sed -n '240,255p;794,840p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '176,186p;737,748p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '325,350p;560,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
     1	// ────────────────────────────────────────────────────────────────
     2	// MODULE: Memory Context
     3	// ────────────────────────────────────────────────────────────────
     4	
     5	import { randomUUID } from 'crypto';
     6	
     7	// Layer definitions
     8	import * as layerDefs from '../lib/architecture/layer-definitions.js';
     9	import { checkDatabaseUpdated } from '../core/index.js';
    10	import { toErrorMessage } from '../utils/index.js';
    11	
    12	// Intent classifier
    13	import * as intentClassifier from '../lib/search/intent-classifier.js';
    14	
    15	// Query-intent routing (Phase 020: structural/semantic/hybrid classification)
    16	import { classifyQueryIntent } from '../lib/code-graph/query-intent-classifier.js';
    17	import { buildContext } from '../lib/code-graph/code-graph-context.js';
    18	
    19	// Core handlers for routing
    20	import { handleMemorySearch } from './memory-search.js';
    21	import { handleMemoryMatchTriggers } from './memory-triggers.js';
    22	
    23	// Response envelope
    24	import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope.js';
    25	
    26	// Token estimation
    27	import { estimateTokens } from '../formatters/token-metrics.js';
    28	import {
    29	  getPressureLevel,
    30	  type RuntimeContextStats,
    31	} from '../lib/cognitive/pressure-monitor.js';
    32	import * as workingMemory from '../lib/cognitive/working-memory.js';
    33	import * as sessionManager from '../lib/session/session-manager.js';
    34	
    35	// Telemetry
    36	import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
    37	import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
    38	import {
    39	  attachSessionTransitionTrace,
    40	  buildSessionTransitionTrace,
    41	  type SessionTransitionTrace,
    42	} from '../lib/search/session-transition.js';
    43	
    44	// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
    45	import { logSearchQuery, logChannelResult, logFinalResult } from '../lib/eval/eval-logger.js';
    46	import * as vectorIndex from '../lib/search/vector-index.js';
    47	
    48	// Shared handler types
    49	import type { MCPResponse, IntentClassification } from './types.js';
    50	
    51	// PI-B3: Folder discovery integration
    52	import { discoverSpecFolder, getSpecsBasePaths } from '../lib/search/folder-discovery.js';
    53	import {
    54	  isAutoResumeEnabled,
    55	  isFolderDiscoveryEnabled,
    56	  isPressurePolicyEnabled,
    57	  isIntentAutoProfileEnabled,
    58	} from '../lib/search/search-flags.js';
    59	
    60	// Feature catalog: Unified context retrieval (memory_context)
    61	// Feature catalog: Dual-scope memory auto-surface
    62	// Feature catalog: Provenance-rich response envelopes
    63	
    64	
    65	/* ───────────────────────────────────────────────────────────────
    66	   1. TYPES
    67	──────────────────────────────────────────────────────────────── */
    68	
    69	interface ContextMode {
    70	  readonly name: string;
    71	  readonly description: string;
    72	  readonly strategy: string;
    73	  readonly tokenBudget?: number;
    74	}
    75	
    76	interface ContextOptions {
    77	  specFolder?: string;
    78	  folderBoost?: { folder: string; factor: number };
    79	  tenantId?: string;
    80	  userId?: string;
    81	  agentId?: string;
    82	  sharedSpaceId?: string;
    83	  limit?: number;
    84	  sessionId?: string;
    85	  enableDedup?: boolean;
    86	  includeContent?: boolean;
    87	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
    88	  anchors?: string[];
    89	  profile?: string;
    90	  sessionTransition?: SessionTransitionTrace;
    91	}
    92	
    93	interface SessionLifecycleMetadata {
    94	  sessionScope: 'caller' | 'ephemeral';
    95	  requestedSessionId: string | null;
    96	  effectiveSessionId: string;
    97	  resumed: boolean;
    98	  eventCounterStart: number;
    99	  resumedContextCount: number;
   100	}
   101	
   102	interface ContextResult extends Record<string, unknown> {
   103	  strategy: string;
   104	  mode: string;
   105	}
   106	
   107	interface LayerInfo {
   108	  tokenBudget?: number;
   109	}
   110	
   111	interface ContextArgs {
   112	  input: string;
   113	  mode?: string;
   114	  intent?: string;
   115	  specFolder?: string;
   116	  tenantId?: string;
   117	  userId?: string;
   118	  agentId?: string;
   119	  sharedSpaceId?: string;
   120	  limit?: number;
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
   450	function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
   451	  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
   452	    return {
   453	      results,
   454	      dedupStats: { enabled: false, sessionId: null }
   455	    };
   456	  }
   457	
   458	  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
   459	
   460	  if (filtered.length > 0) {
   461	    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
   462	  }
   463	
   464	  return {
   465	    results: filtered as MemorySearchRow[],
   466	    dedupStats: {
   467	      ...dedupStats,
   468	      sessionId
   469	    }
   470	  };
  1251	  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
  1252	  // Shadow-only: no ranking side effects. Fail-safe, never throws.
  1253	  try {
  1254	    if (isImplicitFeedbackLogEnabled()) {
  1255	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1256	      if (db) {
  1257	        let shownMemoryIds: number[] = [];
  1258	        try {
  1259	          if (responseToReturn?.content?.[0]?.text) {
  1260	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1261	            const data = parsed?.data as Record<string, unknown> | undefined;
  1262	            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1263	            shownMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1264	          }
  1265	        } catch (_error: unknown) { /* ignore parse errors */ }
  1266	
  1267	        if (shownMemoryIds.length > 0) {
  1268	          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1269	          const feedbackEvents: FeedbackEvent[] = shownMemoryIds.map(memId => ({
  1270	            type: 'search_shown',
  1271	            memoryId: String(memId),
  1272	            queryId,
  1273	            confidence: 'weak',
  1274	            timestamp: _searchStartTime,
  1275	            sessionId: sessionId ?? null,
  1276	          }));
  1277	          logFeedbackEvents(db, feedbackEvents);
  1278	        }
  1279	      }
  1280	    }
  1281	  } catch (_error: unknown) { /* feedback logging must never break search */ }
  1282	
  1283	  // REQ-014: Query flow tracking + result_cited for includeContent searches
  1284	  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
  1285	  try {
  1286	    if (isImplicitFeedbackLogEnabled()) {
  1287	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1288	      if (db) {
  1289	        // Extract shown memory IDs from response (reuse parsed data if available)
  1290	        let shownIds: string[] = [];
  1291	        try {
  1292	          if (responseToReturn?.content?.[0]?.text) {
  1293	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1294	            const data = parsed?.data as Record<string, unknown> | undefined;
  1295	            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1296	            shownIds = results.flatMap((result) => {
  1297	              const candidate = result.id;
  1298	              if (typeof candidate !== 'number' && typeof candidate !== 'string') {
  1299	                return [];
  1300	              }
  1301	              const normalizedId = String(candidate).trim();
  1302	              if (!normalizedId || normalizedId === 'undefined' || normalizedId === 'null') {
  1303	                return [];
  1304	              }
  1305	              return [normalizedId];
  1306	            });
  1307	          }
  1308	        } catch (_error: unknown) { /* ignore parse errors */ }
  1309	
  1310	        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1311	
  1312	        // Track query flow — detects reformulations and same-topic re-queries
  1313	        if (normalizedQuery) {
  1314	          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
  1315	        }
  1316	
  1317	        // Log result_cited for includeContent searches (content was embedded = cited)
  1318	        if (includeContent && shownIds.length > 0) {
  1319	          logResultCited(db, sessionId ?? null, queryId, shownIds);
  1320	        }
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
   398	    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
   399	      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));
   400	
   401	    const turnDecayFactor = turnNumber > 1
   402	      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
   403	      : 1.0;
   404	
   405	    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
   406	      const fullRecord = fullRecords.get(match.memoryId);
   407	      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);
   408	
   409	      let attentionScore: number;
   410	      let tier: string;
   411	
   412	      if (fullRecord) {
   413	        const classification = tierClassifier.classifyTier(fullRecord);
   414	        let effectiveRetrievability = classification.retrievability;
   415	
   416	        if (wmEntry) {
   417	          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
   418	          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
   419	        } else {
   420	          effectiveRetrievability *= turnDecayFactor;
   421	        }
   422	
   423	        attentionScore = effectiveRetrievability;
   424	        tier = tierClassifier.classifyState(effectiveRetrievability);
   425	      } else {
   426	        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
   427	        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
   428	        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
   429	        tier = tierClassifier.classifyState(attentionScore);
   430	      }
   431	
   432	      // Clamp to [0,1] — retrievability * decay or wmEntry scores
   433	      // Can drift outside the valid range due to floating-point arithmetic.
   434	      attentionScore = Math.max(0, Math.min(1, attentionScore));
   435	
   436	      return {
   437	        ...match,
   438	        attentionScore: attentionScore,
   439	        tier,
   440	        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
   441	      };
   442	    });
   443	
   444	    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);
   445	
   446	    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
   447	      const content: string = await getTieredContent({
   448	        filePath: r.filePath,
   449	        title: r.title,
   450	        triggerPhrases: r.matchedPhrases
   451	      }, r.tier);
   452	
   453	      return {
   454	        memoryId: r.memoryId,
   455	        specFolder: r.specFolder,
   456	        filePath: r.filePath,
   457	        title: r.title,
   458	        matchedPhrases: r.matchedPhrases,
   459	        importanceWeight: r.importanceWeight,
   460	        tier: r.tier,
   461	        attentionScore: r.attentionScore,
   462	        content: content,
   463	        coActivated: r.coActivated || false
   464	      };
   465	    }));
   466	
   467	    cognitiveStats = {
   468	      enabled: true,
   469	      sessionId: sessionId!,
   470	      turnNumber: turnNumber,
   200	  if (typeof value !== 'string') {
   201	    return null;
   202	  }
   203	  const trimmed = value.trim();
   204	  return trimmed.length > 0 ? trimmed : null;
   205	}
   206	
   207	function buildScopePrefix(row: MemoryIndexRow): string | null {
   208	  const scopeTuple = [
   209	    ['tenant', normalizeScopeValue(row.tenant_id)],
   210	    ['user', normalizeScopeValue(row.user_id)],
   211	    ['agent', normalizeScopeValue(row.agent_id)],
   212	    ['session', normalizeScopeValue(row.session_id)],
   213	    ['shared_space', normalizeScopeValue(row.shared_space_id)],
   214	  ].filter((entry): entry is [string, string] => entry[1] != null);
   215	
   216	  if (scopeTuple.length === 0) {
   217	    return null;
   218	  }
   219	
   220	  const scopeHash = createHash('sha256')
   221	    .update(JSON.stringify(scopeTuple), 'utf8')
   222	    .digest('hex')
   223	    .slice(0, 24);
   224	
   225	  return `scope-sha256:${scopeHash}`;
   226	}
   227	
   228	function hasLogicalKeySeparatorCollision(...components: string[]): boolean {
   229	  return components.some((component) => component.includes('::'));
   230	}
   231	
   232	function buildHashedLogicalKey(parts: {
   233	  specFolder: string;
   234	  scopePrefix: string | null;
   235	  canonicalPath: string;
   236	  anchorId: string;
   237	}): string {
   238	  const payload = JSON.stringify({
   239	    version: 2,
   240	    specFolder: parts.specFolder,
   241	    scopePrefix: parts.scopePrefix,
   242	    canonicalPath: parts.canonicalPath,
   243	    anchorId: parts.anchorId,
   244	  });
   245	  const digest = createHash('sha256')
   246	    .update(payload, 'utf8')
   247	    .digest('hex');
   248	  return `logical-sha256:${digest}`;
   249	}
   250	
   251	function buildLogicalKey(row: MemoryIndexRow): string {
   252	  const canonicalPath = typeof row.canonical_file_path === 'string' && row.canonical_file_path.trim().length > 0
   253	    ? row.canonical_file_path.trim()
   254	    : getCanonicalPathKey(row.file_path);
   255	  const anchorId = typeof row.anchor_id === 'string' && row.anchor_id.trim().length > 0
   256	    ? row.anchor_id.trim()
   257	    : '_';
   258	  const scopePrefix = buildScopePrefix(row);
   259	
   260	  if (hasLogicalKeySeparatorCollision(row.spec_folder, canonicalPath, anchorId)) {
   261	    logger.warn(
   262	      `[lineage-state] Logical key component contains '::'; using hashed structured key for spec_folder=${row.spec_folder}, path=${canonicalPath}, anchor=${anchorId}`,
   263	    );
   264	    return buildHashedLogicalKey({
   265	      specFolder: row.spec_folder,
   266	      scopePrefix,
   267	      canonicalPath,
   268	      anchorId,
   269	    });
   270	  }
   271	
   272	  if (!scopePrefix) {
   273	    return `${row.spec_folder}::${canonicalPath}::${anchorId}`;
   274	  }
   275	  return `${row.spec_folder}::${scopePrefix}::${canonicalPath}::${anchorId}`;
   276	}
   277	
   278	function getLineageRow(database: Database.Database, memoryId: number): MemoryLineageRow | null {
   279	  const row = database.prepare(`
   280	    SELECT *
   560	      transitionEvent: existing.transition_event,
   561	    };
   562	  }
   563	  return null;
   564	}
   565	
   566	/**
   567	 * Validates transition input combinations before persisting.
   568	 * Rejects invalid event/predecessor pairings and backwards timestamps.
   569	 */
   570	function validateTransitionInput(
   571	  transitionEvent: string,
   572	  predecessorMemoryId: number | null,
   573	  validFrom: string,
   574	  predecessor: LineageRow | null,
   575	): void {
   576	  if (transitionEvent === 'CREATE' && predecessorMemoryId != null) {
   577	    throw new Error(`E_LINEAGE: CREATE transition must not specify a predecessor (got ${predecessorMemoryId})`);
   578	  }
   579	  if (transitionEvent === 'SUPERSEDE' && predecessorMemoryId == null) {
   580	    throw new Error('E_LINEAGE: SUPERSEDE transition requires a predecessor');
   581	  }
   582	  // M6 FIX: Compare timestamps as numeric epoch values, not raw strings,
   583	  // to handle non-ISO strings and timezone-offset variants correctly.
   584	  if (predecessor && new Date(validFrom).getTime() < new Date(predecessor.valid_from).getTime()) {
   585	    throw new Error(
   586	      `E_LINEAGE: valid_from (${validFrom}) is earlier than predecessor valid_from (${predecessor.valid_from})`,
   587	    );
   588	  }
   589	}
   590	
   591	/**
   592	 * Seed lineage state from an existing memory row when no lineage entry exists yet.
   593	 *
   594	 * @param database - Database connection that stores lineage state.
   595	 * @param memoryId - Memory version to seed into lineage tables.
   596	 * @param options - Optional actor, timestamps, and transition metadata.
   597	 * @returns Seeded lineage state for the requested memory version.
   598	 */
   599	export function seedLineageFromCurrentState(
   600	  database: Database.Database,
   601	  memoryId: number,
   602	  options: RecordLineageTransitionOptions = {},
   603	): RecordedLineageTransition {
   604	  bindHistory(database);
   605	  ensureLineageTables(database);
   606	
   607	  const cached = getExistingLineageTransition(database, memoryId);
   608	  if (cached) return cached;
   609	
   610	  const row = getMemoryRow(database, memoryId);
   611	  const logicalKey = buildLogicalKey(row);
   612	  const actor = options.actor ?? 'system';
   613	  const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
   614	  const validFrom = options.validFrom
   615	    ?? historyEvents[0]?.timestamp
   616	    ?? normalizeTimestamp(row.created_at ?? row.updated_at);
   617	
   618	  const seedTx = database.transaction(() => {
   619	    database.prepare(`
   620	      INSERT INTO memory_lineage (
   621	        memory_id,
   622	        logical_key,
   623	        version_number,
   624	        root_memory_id,
   625	        predecessor_memory_id,
   626	        superseded_by_memory_id,
   627	        valid_from,
   628	        valid_to,
   629	        transition_event,
   630	        actor,
   631	        metadata
   632	      ) VALUES (?, ?, 1, ?, NULL, NULL, ?, NULL, ?, ?, ?)
   633	    `).run(
   634	      memoryId,
   635	      logicalKey,
   636	      memoryId,
   637	      validFrom,
   638	      options.transitionEvent ?? 'BACKFILL',
   639	      actor,
   640	      buildMetadata(row, actor, historyEvents),
   641	    );
   642	
   643	    upsertActiveProjection(database, logicalKey, memoryId, memoryId, normalizeTimestamp(row.updated_at ?? validFrom));
   644	  });
   645	
   646	  seedTx();
   647	
   648	  return {
   649	    logicalKey,
   650	    versionNumber: 1,
   651	    rootMemoryId: memoryId,
   652	    activeMemoryId: memoryId,
   653	    predecessorMemoryId: null,
   654	    transitionEvent: options.transitionEvent ?? 'BACKFILL',
   655	  };
   656	}
   657	
   658	/**
   659	 * Seed or append a lineage transition for a memory version.
   660	 *
   661	 * @param database - Database connection that stores lineage state.
   662	 * @param memoryId - Memory version being recorded.
   663	 * @param options - Transition details such as predecessor and actor.
   664	 * @returns Recorded lineage state for the requested memory version.
   665	 */
   666	export function recordLineageTransition(
   667	  database: Database.Database,
   668	  memoryId: number,
   669	  options: RecordLineageTransitionOptions = {},
   670	): RecordedLineageTransition {
   671	  bindHistory(database);
   672	  ensureLineageTables(database);
   673	
   674	  const cached = getExistingLineageTransition(database, memoryId);
   675	  if (cached) return cached;
   676	
   677	  for (let attempt = 0; attempt <= MAX_LINEAGE_VERSION_RETRIES; attempt += 1) {
   678	    // A1/B14: Wrap predecessor UPDATE + lineage INSERT + projection UPSERT in a transaction.
   679	    const recordTransitionTx = database.transaction(() => {
   680	      const row = getMemoryRow(database, memoryId);
   681	      const rowLogicalKey = buildLogicalKey(row);
   682	      const actor = options.actor ?? 'system';
   683	      const transitionEvent = options.transitionEvent ?? 'CREATE';
   684	      const historyEvents = options.historyEvents ?? getSafeHistoryEvents(database, memoryId);
   685	      const predecessorMemoryId = options.predecessorMemoryId ?? null;
   686	      const validFrom = options.validFrom ?? normalizeTimestamp(row.updated_at ?? row.created_at);
   687	
   688	      let logicalKey = rowLogicalKey;
   689	      let rootMemoryId = memoryId;
   690	      let versionNumber = 1;
   691	      let predecessor: LineageRow | null = null;
   692	
   693	      if (predecessorMemoryId != null) {
   694	        predecessor = getLineageRow(database, predecessorMemoryId);
   695	        if (predecessor) {
   696	          if (predecessor.logical_key !== rowLogicalKey) {
   697	            throw new Error(
   698	              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${predecessor.logical_key} ` +
   699	              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
   700	            );
   701	          }
   702	          logicalKey = predecessor.logical_key;
   703	          rootMemoryId = predecessor.root_memory_id;
   704	          versionNumber = predecessor.version_number + 1;
   705	        } else {
   706	          const seeded = seedLineageFromCurrentState(database, predecessorMemoryId, {
   707	            actor,
   708	            transitionEvent: 'BACKFILL',
   709	          });
   710	          if (seeded.logicalKey !== rowLogicalKey) {
   711	            throw new Error(
   712	              `E_LINEAGE: predecessor ${predecessorMemoryId} logical identity ${seeded.logicalKey} ` +
   713	              `does not match memory ${memoryId} logical identity ${rowLogicalKey}`,
   714	            );
   715	          }
   716	          logicalKey = seeded.logicalKey;
   717	          rootMemoryId = seeded.rootMemoryId;
   718	          versionNumber = seeded.versionNumber + 1;
   719	          predecessor = getLineageRow(database, predecessorMemoryId);
   720	        }
   721	      }
   722	
   723	      if (attempt > 0) {
   724	        const latest = getLatestLineageRowForLogicalKey(database, logicalKey);
   725	        if (latest) {
   726	          rootMemoryId = latest.root_memory_id;
   727	          versionNumber = latest.version_number + 1;
   728	        }
   729	      }
   730	
   731	      validateTransitionInput(transitionEvent, predecessorMemoryId, validFrom, predecessor);
   732	
   733	      if (predecessorMemoryId != null) {
   734	        if (predecessor && predecessor.valid_to) {
   735	          logger.warn(
   736	            `Predecessor ${predecessorMemoryId} already superseded (valid_to: ${predecessor.valid_to}). ` +
   737	            'COALESCE will preserve the existing valid_to.',
   738	          );
   739	        }
   740	        database.prepare(`
   741	          UPDATE memory_lineage
   742	          SET valid_to = COALESCE(valid_to, ?),
   743	              superseded_by_memory_id = COALESCE(superseded_by_memory_id, ?)
   744	          WHERE memory_id = ?
   745	        `).run(validFrom, memoryId, predecessorMemoryId);
   746	        markHistoricalPredecessor(database, predecessorMemoryId, validFrom);
   747	      }
   748	
   749	      database.prepare(`
   750	        INSERT INTO memory_lineage (
   751	          memory_id,
   752	          logical_key,
   753	          version_number,
   754	          root_memory_id,
   755	          predecessor_memory_id,
   756	          superseded_by_memory_id,
   757	          valid_from,
   758	          valid_to,
   759	          transition_event,
   760	          actor,
   761	          metadata
   762	        ) VALUES (?, ?, ?, ?, ?, NULL, ?, NULL, ?, ?, ?)
   763	      `).run(
   764	        memoryId,
   765	        logicalKey,
   766	        versionNumber,
   767	        rootMemoryId,
   768	        predecessorMemoryId,
   769	        validFrom,
   770	        transitionEvent,
   771	        actor,
   772	        buildMetadata(row, actor, historyEvents),
   773	      );
   774	
   775	      upsertActiveProjection(database, logicalKey, rootMemoryId, memoryId, validFrom);
   776	
   777	      return {
   778	        logicalKey,
   779	        versionNumber,
   780	        rootMemoryId,
   240	        hint: 'Set SPECKIT_SHARED_MEMORY_TRUST_CALLER_IDENTITY=true only for trusted local transports.',
   241	      }),
   242	    );
   243	  }
   244	
   245	  // SECURITY: Actor IDs are caller-supplied and not cryptographically bound to
   246	  // an authenticated session. In untrusted environments, wrap this handler
   247	  // behind authenticated transport middleware.
   248	  // Shared-memory tools do not currently receive a server-minted sessionId or
   249	  // transport principal, so the trusted-session validation used by
   250	  // memory_context/memory_match_triggers cannot be wired here yet.
   251	  const actor = validateSharedCallerIdentity(args);
   252	
   253	  return {
   254	    actor,
   255	    isAdmin: actor.subjectType === adminResult.actor.subjectType
   794	 * Enable the shared-memory subsystem via first-run setup.
   795	 *
   796	 * Idempotent: persists DB flag and creates README even if env-var override
   797	 * already enables the runtime check. Subsequent calls that find both the
   798	 * DB flag set and the README present return `alreadyEnabled: true`.
   799	 */
   800	export async function handleSharedMemoryEnable(args: Record<string, unknown>): Promise<MCPResponse> {
   801	  try {
   802	    // WARNING: Admin mutations trust caller-supplied actor identity until transport-auth binding is added.
   803	    warnTrustedAdminIdentityAssumption();
   804	    const { actor, isAdmin } = validateCallerAuth({
   805	      tool: 'shared_memory_enable',
   806	      actorUserId: typeof args.actorUserId === 'string' ? args.actorUserId : undefined,
   807	      actorAgentId: typeof args.actorAgentId === 'string' ? args.actorAgentId : undefined,
   808	    });
   809	    if (!isAdmin) {
   810	      return createSharedMemoryEnableAuthError(
   811	        'shared_memory_enable_admin_required',
   812	        'Only the configured shared-memory admin can enable shared memory.',
   813	      );
   814	    }
   815	
   816	    const db = requireDb();
   817	
   818	    // Check DB-level persistence (not runtime env-var) to decide idempotency.
   819	    // This ensures env-var-only users still get DB persistence + README on first call.
   820	    let dbAlreadyEnabled = false;
   821	    try {
   822	      const row = db.prepare('SELECT value FROM config WHERE key = ?')
   823	        .get('shared_memory_enabled') as { value: string } | undefined;
   824	      dbAlreadyEnabled = row?.value === 'true';
   825	    } catch (error: unknown) {
   826	      // config table may not exist yet
   827	      const message = error instanceof Error ? error.message : String(error);
   828	      void message;
   829	    }
   830	
   831	    if (dbAlreadyEnabled) {
   832	      await createSharedSpacesReadme();
   833	      return createMCPSuccessResponse({
   834	        tool: 'shared_memory_enable',
   835	        summary: 'Shared memory is already enabled',
   836	        data: {
   837	          alreadyEnabled: true,
   838	          actorSubjectType: actor.subjectType,
   839	          actorSubjectId: actor.subjectId,
   840	        },
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
   560	function batchUpdateScores(sessionId: string): number {
   561	  if (!db) return 0;
   562	  ensureSchema();
   563	
   564	  if (!isFeatureEnabled('SPECKIT_EVENT_DECAY', sessionId)) {
   565	    return 0;
   566	  }
   567	
   568	  try {
   569	    const currentEventCounter = getCurrentEventCounter(sessionId);
   570	    const entries = (db.prepare(`
   571	      SELECT id, attention_score, event_counter, mention_count
   572	      FROM working_memory
   573	      WHERE session_id = ?
   574	        AND memory_id IS NOT NULL
   575	    `) as Database.Statement).all(sessionId) as Array<{
   576	      id: number;
   577	      attention_score: number;
   578	      event_counter: number;
   579	      mention_count: number;
   580	    }>;
   581	
   582	    if (entries.length === 0) {
   583	      return 0;
   584	    }
   585	
   586	    const updateStmt = db.prepare(`
   587	      UPDATE working_memory
   588	      SET attention_score = ?,
   589	          event_counter = event_counter + 1
   590	      WHERE id = ?
   591	    `) as Database.Statement;
   592	
   593	    const deleteStmt = db.prepare(`
   594	      DELETE FROM working_memory
   595	      WHERE id = ?
   596	    `) as Database.Statement;
   597	
   598	    let changedRows = 0;
   599	    db.transaction(() => {
   600	      for (const entry of entries) {
   601	        const eventsElapsed = calculateEventDistance(currentEventCounter, entry.event_counter);
   602	        const decayBase = entry.attention_score * Math.pow(EVENT_DECAY_FACTOR, eventsElapsed);
   603	        const mentionBoost = Math.min(entry.mention_count, MAX_MENTION_COUNT) * MENTION_BOOST_FACTOR;
   604	        const rawScore = decayBase + mentionBoost;
   605	
   606	        if (rawScore < DELETE_THRESHOLD) {
   607	          const deleteResult = deleteStmt.run(entry.id) as { changes: number };
   608	          changedRows += deleteResult.changes;
   609	          continue;
   610	        }
   611	
   612	        // Clamp to [DECAY_FLOOR, 1.0].
   613	        // Mention boost can push rawScore above 1.0 which breaks [0,1] score semantics.
   614	        const nextScore = Math.max(DECAY_FLOOR, Math.min(1.0, rawScore));
   615	        const updateResult = updateStmt.run(nextScore, entry.id) as { changes: number };
   616	        changedRows += updateResult.changes;
   617	      }
   618	    })();
   619	
   620	    return changedRows;

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '820,855p;1430,1452p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '1251,1320p;450,470p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   450	function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
   451	  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
   452	    return {
   453	      results,
   454	      dedupStats: { enabled: false, sessionId: null }
   455	    };
   456	  }
   457	
   458	  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
   459	
   460	  if (filtered.length > 0) {
   461	    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
   462	  }
   463	
   464	  return {
   465	    results: filtered as MemorySearchRow[],
   466	    dedupStats: {
   467	      ...dedupStats,
   468	      sessionId
   469	    }
   470	  };
  1251	  // REQ-D4-001: Implicit feedback — log search_shown events for returned results
  1252	  // Shadow-only: no ranking side effects. Fail-safe, never throws.
  1253	  try {
  1254	    if (isImplicitFeedbackLogEnabled()) {
  1255	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1256	      if (db) {
  1257	        let shownMemoryIds: number[] = [];
  1258	        try {
  1259	          if (responseToReturn?.content?.[0]?.text) {
  1260	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1261	            const data = parsed?.data as Record<string, unknown> | undefined;
  1262	            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1263	            shownMemoryIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1264	          }
  1265	        } catch (_error: unknown) { /* ignore parse errors */ }
  1266	
  1267	        if (shownMemoryIds.length > 0) {
  1268	          const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1269	          const feedbackEvents: FeedbackEvent[] = shownMemoryIds.map(memId => ({
  1270	            type: 'search_shown',
  1271	            memoryId: String(memId),
  1272	            queryId,
  1273	            confidence: 'weak',
  1274	            timestamp: _searchStartTime,
  1275	            sessionId: sessionId ?? null,
  1276	          }));
  1277	          logFeedbackEvents(db, feedbackEvents);
  1278	        }
  1279	      }
  1280	    }
  1281	  } catch (_error: unknown) { /* feedback logging must never break search */ }
  1282	
  1283	  // REQ-014: Query flow tracking + result_cited for includeContent searches
  1284	  // Shadow-only: emits query_reformulated, same_topic_requery, and result_cited events.
  1285	  try {
  1286	    if (isImplicitFeedbackLogEnabled()) {
  1287	      const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1288	      if (db) {
  1289	        // Extract shown memory IDs from response (reuse parsed data if available)
  1290	        let shownIds: string[] = [];
  1291	        try {
  1292	          if (responseToReturn?.content?.[0]?.text) {
  1293	            const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1294	            const data = parsed?.data as Record<string, unknown> | undefined;
  1295	            const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1296	            shownIds = results.flatMap((result) => {
  1297	              const candidate = result.id;
  1298	              if (typeof candidate !== 'number' && typeof candidate !== 'string') {
  1299	                return [];
  1300	              }
  1301	              const normalizedId = String(candidate).trim();
  1302	              if (!normalizedId || normalizedId === 'undefined' || normalizedId === 'null') {
  1303	                return [];
  1304	              }
  1305	              return [normalizedId];
  1306	            });
  1307	          }
  1308	        } catch (_error: unknown) { /* ignore parse errors */ }
  1309	
  1310	        const queryId = _evalQueryId ? String(_evalQueryId) : String(_searchStartTime);
  1311	
  1312	        // Track query flow — detects reformulations and same-topic re-queries
  1313	        if (normalizedQuery) {
  1314	          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
  1315	        }
  1316	
  1317	        // Log result_cited for includeContent searches (content was embedded = cited)
  1318	        if (includeContent && shownIds.length > 0) {
  1319	          logResultCited(db, sessionId ?? null, queryId, shownIds);
  1320	        }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/index.ts | sed -n '214,325p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   214	  if (!sessionBootstrapModule) {
   215	    sessionBootstrapModule = loadHandlerModule<SessionBootstrapModule>('session-bootstrap');
   216	  }
   217	  return sessionBootstrapModule;
   218	}
   219	
   220	// Memory search handlers
   221	export const handleMemorySearch = lazyFunction(getMemorySearchModule, 'handleMemorySearch');
   222	export const handle_memory_search = lazyFunction(getMemorySearchModule, 'handle_memory_search');
   223	
   224	// Memory triggers handlers
   225	export const handleMemoryMatchTriggers = lazyFunction(getMemoryTriggersModule, 'handleMemoryMatchTriggers');
   226	export const handle_memory_match_triggers = lazyFunction(getMemoryTriggersModule, 'handle_memory_match_triggers');
   227	
   228	// Memory save handlers
   229	export const handleMemorySave = lazyFunction(getMemorySaveModule, 'handleMemorySave');
   230	export const indexMemoryFile = lazyFunction(getMemorySaveModule, 'indexMemoryFile');
   231	export const atomicSaveMemory = lazyFunction(getMemorySaveModule, 'atomicSaveMemory');
   232	export const getAtomicityMetrics = lazyFunction(getMemorySaveModule, 'getAtomicityMetrics');
   233	export const handle_memory_save = lazyFunction(getMemorySaveModule, 'handle_memory_save');
   234	export const index_memory_file = lazyFunction(getMemorySaveModule, 'index_memory_file');
   235	export const atomic_save_memory = lazyFunction(getMemorySaveModule, 'atomic_save_memory');
   236	export const get_atomicity_metrics = lazyFunction(getMemorySaveModule, 'get_atomicity_metrics');
   237	
   238	// PE-gating handlers
   239	export const calculateDocumentWeight = lazyFunction(getPeGatingModule, 'calculateDocumentWeight');
   240	export const isSpecDocumentType = lazyFunction(getPeGatingModule, 'isSpecDocumentType');
   241	export const findSimilarMemories = lazyFunction(getPeGatingModule, 'findSimilarMemories');
   242	export const reinforceExistingMemory = lazyFunction(getPeGatingModule, 'reinforceExistingMemory');
   243	export const markMemorySuperseded = lazyFunction(getPeGatingModule, 'markMemorySuperseded');
   244	export const updateExistingMemory = lazyFunction(getPeGatingModule, 'updateExistingMemory');
   245	export const logPeDecision = lazyFunction(getPeGatingModule, 'logPeDecision');
   246	
   247	// Memory ingest handlers
   248	export const handleMemoryIngestStart = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestStart');
   249	export const handleMemoryIngestStatus = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestStatus');
   250	export const handleMemoryIngestCancel = lazyFunction(getMemoryIngestModule, 'handleMemoryIngestCancel');
   251	export const handle_memory_ingest_start = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_start');
   252	export const handle_memory_ingest_status = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_status');
   253	export const handle_memory_ingest_cancel = lazyFunction(getMemoryIngestModule, 'handle_memory_ingest_cancel');
   254	
   255	// Memory CRUD handlers
   256	export const handleMemoryDelete = lazyFunction(getMemoryCrudModule, 'handleMemoryDelete');
   257	export const handleMemoryUpdate = lazyFunction(getMemoryCrudModule, 'handleMemoryUpdate');
   258	export const handleMemoryList = lazyFunction(getMemoryCrudModule, 'handleMemoryList');
   259	export const handleMemoryStats = lazyFunction(getMemoryCrudModule, 'handleMemoryStats');
   260	export const handleMemoryHealth = lazyFunction(getMemoryCrudModule, 'handleMemoryHealth');
   261	export const setEmbeddingModelReady = lazyFunction(getMemoryCrudModule, 'setEmbeddingModelReady');
   262	export const isEmbeddingModelReady = lazyFunction(getMemoryCrudModule, 'isEmbeddingModelReady');
   263	export const handle_memory_delete = lazyFunction(getMemoryCrudModule, 'handle_memory_delete');
   264	export const handle_memory_update = lazyFunction(getMemoryCrudModule, 'handle_memory_update');
   265	export const handle_memory_list = lazyFunction(getMemoryCrudModule, 'handle_memory_list');
   266	export const handle_memory_stats = lazyFunction(getMemoryCrudModule, 'handle_memory_stats');
   267	export const handle_memory_health = lazyFunction(getMemoryCrudModule, 'handle_memory_health');
   268	export const set_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'set_embedding_model_ready');
   269	export const is_embedding_model_ready = lazyFunction(getMemoryCrudModule, 'is_embedding_model_ready');
   270	
   271	// Memory index handlers
   272	export const handleMemoryIndexScan = lazyFunction(getMemoryIndexModule, 'handleMemoryIndexScan');
   273	export const indexSingleFile = lazyFunction(getMemoryIndexModule, 'indexSingleFile');
   274	export const findConstitutionalFiles = lazyFunction(getMemoryIndexModule, 'findConstitutionalFiles');
   275	export const handle_memory_index_scan = lazyFunction(getMemoryIndexModule, 'handle_memory_index_scan');
   276	export const index_single_file = lazyFunction(getMemoryIndexModule, 'index_single_file');
   277	export const find_constitutional_files = lazyFunction(getMemoryIndexModule, 'find_constitutional_files');
   278	
   279	// Memory bulk delete handler
   280	export const handleMemoryBulkDelete = lazyFunction(getMemoryBulkDeleteModule, 'handleMemoryBulkDelete');
   281	
   282	// Checkpoint handlers
   283	export const handleCheckpointCreate = lazyFunction(getCheckpointsModule, 'handleCheckpointCreate');
   284	export const handleCheckpointList = lazyFunction(getCheckpointsModule, 'handleCheckpointList');
   285	export const handleCheckpointRestore = lazyFunction(getCheckpointsModule, 'handleCheckpointRestore');
   286	export const handleCheckpointDelete = lazyFunction(getCheckpointsModule, 'handleCheckpointDelete');
   287	export const handleMemoryValidate = lazyFunction(getCheckpointsModule, 'handleMemoryValidate');
   288	export const handle_checkpoint_create = lazyFunction(getCheckpointsModule, 'handle_checkpoint_create');
   289	export const handle_checkpoint_list = lazyFunction(getCheckpointsModule, 'handle_checkpoint_list');
   290	export const handle_checkpoint_restore = lazyFunction(getCheckpointsModule, 'handle_checkpoint_restore');
   291	export const handle_checkpoint_delete = lazyFunction(getCheckpointsModule, 'handle_checkpoint_delete');
   292	export const handle_memory_validate = lazyFunction(getCheckpointsModule, 'handle_memory_validate');
   293	
   294	// Session learning handlers
   295	export const handleTaskPreflight = lazyFunction(getSessionLearningModule, 'handleTaskPreflight');
   296	export const handleTaskPostflight = lazyFunction(getSessionLearningModule, 'handleTaskPostflight');
   297	export const handleGetLearningHistory = lazyFunction(getSessionLearningModule, 'handleGetLearningHistory');
   298	export const handle_task_preflight = lazyFunction(getSessionLearningModule, 'handle_task_preflight');
   299	export const handle_task_postflight = lazyFunction(getSessionLearningModule, 'handle_task_postflight');
   300	export const handle_get_learning_history = lazyFunction(getSessionLearningModule, 'handle_get_learning_history');
   301	
   302	// Eval reporting handlers
   303	export const handleEvalRunAblation = lazyFunction(getEvalReportingModule, 'handleEvalRunAblation');
   304	export const handleEvalReportingDashboard = lazyFunction(getEvalReportingModule, 'handleEvalReportingDashboard');
   305	export const handle_eval_run_ablation = lazyFunction(getEvalReportingModule, 'handle_eval_run_ablation');
   306	export const handle_eval_reporting_dashboard = lazyFunction(getEvalReportingModule, 'handle_eval_reporting_dashboard');
   307	
   308	// Causal graph handlers
   309	export const handleMemoryDriftWhy = lazyFunction(getCausalGraphModule, 'handleMemoryDriftWhy');
   310	export const handleMemoryCausalLink = lazyFunction(getCausalGraphModule, 'handleMemoryCausalLink');
   311	export const handleMemoryCausalStats = lazyFunction(getCausalGraphModule, 'handleMemoryCausalStats');
   312	export const handleMemoryCausalUnlink = lazyFunction(getCausalGraphModule, 'handleMemoryCausalUnlink');
   313	export const handle_memory_drift_why = lazyFunction(getCausalGraphModule, 'handle_memory_drift_why');
   314	export const handle_memory_causal_link = lazyFunction(getCausalGraphModule, 'handle_memory_causal_link');
   315	export const handle_memory_causal_stats = lazyFunction(getCausalGraphModule, 'handle_memory_causal_stats');
   316	export const handle_memory_causal_unlink = lazyFunction(getCausalGraphModule, 'handle_memory_causal_unlink');
   317	
   318	// Memory context handler
   319	export const handleMemoryContext = lazyFunction(getMemoryContextModule, 'handleMemoryContext');
   320	export const handle_memory_context = lazyFunction(getMemoryContextModule, 'handle_memory_context');
   321	
   322	// Shared memory handlers
   323	export const handleSharedMemoryEnable = lazyFunction(getSharedMemoryModule, 'handleSharedMemoryEnable');
   324	export const handleSharedMemoryStatus = lazyFunction(getSharedMemoryModule, 'handleSharedMemoryStatus');
   325	export const handleSharedSpaceMembershipSet = lazyFunction(getSharedMemoryModule, 'handleSharedSpaceMembershipSet');

codex
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Memory becomes a syncable entity log, not just a retrieval index
- **Source**: [external/internal/store/store.go:527](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:527), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754), [external/internal/store/store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:948), [external/internal/store/store.go:1118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1118), [external/internal/store/store.go:2762](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2762), [external/internal/sync/sync.go:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:1), [lineage-state.ts:599](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:599)
- **What it does**: Engram persists `session`, `observation`, and `prompt` as separate entity types, and every create/update/delete path enqueues a `sync_mutations` record. The store is therefore both a local memory DB and an outbound mutation stream. Public’s lineage/history stack is append-first, but it is centered on version integrity and active projection, not on transport-ready entity mutation.
- **Why it matters for us**: This is a deeper architectural shift than the earlier “first-class session lifecycle” finding. Public currently optimizes for retrieval, recovery, and lineage correctness; Engram suggests a second axis where memory is also a portable operational substrate for sync, replication, and cross-runtime reuse.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: User intent becomes durable memory input, not just query-time telemetry
- **Source**: [external/internal/mcp/mcp.go:350](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350), [external/internal/mcp/mcp.go:851](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:851), [external/internal/store/store.go:1118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1118), [external/internal/store/store.go:1145](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1145), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [memory-search.ts:1251](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1251), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434), [working-memory.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325), [session-manager.ts:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:181)
- **What it does**: Engram exposes `mem_save_prompt` as an eager agent tool, stores prompts in `user_prompts`, and injects recent prompts into startup context. Public records query flow and session prompt context, but those are currently shadow telemetry plus decaying working-memory/session state, not durable first-class memory records.
- **Why it matters for us**: Public is good at remembering memories; Engram suggests remembering the user’s intent stream itself. That could improve compaction survival, resumability, and “why are we doing this?” continuity without relying only on session summaries or transient prompt-context injection.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Narrative neighborhood retrieval is a missing middle layer for Public
- **Source**: [external/internal/mcp/mcp.go:415](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:415), [external/internal/store/store.go:1360](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1360), [external/internal/mcp/mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625), [external/internal/mcp/mcp.go:441](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:441), [handlers/index.ts:220](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:220), [handlers/index.ts:318](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:318)
- **What it does**: Engram’s search flow is intentionally three-stage: compact hit list, same-session timeline around one hit, then full observation read. Public has powerful semantic retrieval and graph/causal tools, but no equivalent exposed “chronological neighborhood around this specific memory result” surface showed up in the handler registry.
- **Why it matters for us**: Public is strong on semantic relevance and structural relations, but weaker on narrative reconstruction. A lightweight timeline/drill-in tool would fill the gap between `memory_search` and heavier causal/lineage investigation, especially for debugging or resume flows.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Namespace hygiene moves into the write path
- **Source**: [external/internal/project/detect.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:16), [external/internal/project/similar.go:15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:15), [external/internal/mcp/mcp.go:680](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:680), [external/internal/store/store.go:2459](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:207)
- **What it does**: Engram normalizes project names before persistence, warns when a new name looks like an existing one, and provides an explicit consolidation path with `mem_merge_projects`. Public has robust internal logical-key construction, but that rigor mostly begins after the write boundary, once spec-folder/path/anchor identity is already chosen.
- **Why it matters for us**: Engram suggests a paradigm where human-facing identity drift is handled as a first-class hygiene concern before fragmentation happens. Public should preserve its stronger lineage keys, but add lightweight alias/consolidation support for human-entered thread, space, or future topic identities.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Public should reject project-name scoping as its primary isolation model
- **Source**: [external/internal/project/detect.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:16), [external/internal/mcp/mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821), [shared-memory.ts:245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:245), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:207)
- **What it does**: Engram’s multi-agent safety story is mostly “project + scope + hygiene.” Public already goes further: trusted session resolution is derived from server context, and lineage keys include tenant/user/agent/session/shared-space scope hashes. Even Public’s shared-memory subsystem explicitly calls out that transport-bound identity is still required for trust.
- **Why it matters for us**: This is a paradigm-shift boundary to hold. Engram’s simplicity is attractive, but collapsing Public down to project names as the main isolation primitive would weaken a stronger governed model that is already baked into retrieval and lineage.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/project/detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go)
- [external/internal/project/similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go)
- [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
- [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)

## Assessment
- New information ratio: 0.69
- Questions addressed: Q2, Q4, Q7, Q8, Q9, Q10
- Questions answered: Q2, Q4, Q8, Q9, Q10

## Reflection
- What worked: tracing `internal/store/store.go` as an entity model first, then verifying the MCP layer against actual handlers, exposed deeper shifts than the README-level framing; comparing those paths directly against Public’s `session_bootstrap` / `session_resume`, trusted-session resolution, working-memory injection, handler registry, and lineage storage made the paradigm boundaries concrete.
- What did not work: the CocoIndex MCP pass on this Go-focused slice did not produce usable results in this run, so I fell back to `rg`, `nl -ba`, and direct file reads; the phase validator again returned `PASSED` while also emitting `cannot create temp file for here document: Operation not permitted`, so I treated validation as informative but did not attempt doc repair or memory save in this read-only sandbox.

## Recommended Next Focus
Trace whether Public’s existing lineage/history stack can host a separate outbound mutation bus cleanly, or whether a true `memory_mutations` sidecar is needed; in parallel, compare phase 003 and 004 on durable prompt capture and result-neighborhood retrieval so we can decide whether to add a first-class prompt-memory layer and a timeline/drill-in tool without duplicating graph/semantic systems.
hook: Stop
hook: Stop Completed
tokens used
177,640
# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings
### Finding 1: Memory becomes a syncable entity log, not just a retrieval index
- **Source**: [external/internal/store/store.go:527](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:527), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754), [external/internal/store/store.go:948](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:948), [external/internal/store/store.go:1118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1118), [external/internal/store/store.go:2762](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2762), [external/internal/sync/sync.go:1](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go:1), [lineage-state.ts:599](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:599)
- **What it does**: Engram persists `session`, `observation`, and `prompt` as separate entity types, and every create/update/delete path enqueues a `sync_mutations` record. The store is therefore both a local memory DB and an outbound mutation stream. Public’s lineage/history stack is append-first, but it is centered on version integrity and active projection, not on transport-ready entity mutation.
- **Why it matters for us**: This is a deeper architectural shift than the earlier “first-class session lifecycle” finding. Public currently optimizes for retrieval, recovery, and lineage correctness; Engram suggests a second axis where memory is also a portable operational substrate for sync, replication, and cross-runtime reuse.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: User intent becomes durable memory input, not just query-time telemetry
- **Source**: [external/internal/mcp/mcp.go:350](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350), [external/internal/mcp/mcp.go:851](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:851), [external/internal/store/store.go:1118](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1118), [external/internal/store/store.go:1145](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1145), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [memory-search.ts:1251](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1251), [memory-context.ts:1434](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1434), [working-memory.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325), [session-manager.ts:181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:181)
- **What it does**: Engram exposes `mem_save_prompt` as an eager agent tool, stores prompts in `user_prompts`, and injects recent prompts into startup context. Public records query flow and session prompt context, but those are currently shadow telemetry plus decaying working-memory/session state, not durable first-class memory records.
- **Why it matters for us**: Public is good at remembering memories; Engram suggests remembering the user’s intent stream itself. That could improve compaction survival, resumability, and “why are we doing this?” continuity without relying only on session summaries or transient prompt-context injection.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Narrative neighborhood retrieval is a missing middle layer for Public
- **Source**: [external/internal/mcp/mcp.go:415](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:415), [external/internal/store/store.go:1360](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1360), [external/internal/mcp/mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625), [external/internal/mcp/mcp.go:441](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:441), [handlers/index.ts:220](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:220), [handlers/index.ts:318](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:318)
- **What it does**: Engram’s search flow is intentionally three-stage: compact hit list, same-session timeline around one hit, then full observation read. Public has powerful semantic retrieval and graph/causal tools, but no equivalent exposed “chronological neighborhood around this specific memory result” surface showed up in the handler registry.
- **Why it matters for us**: Public is strong on semantic relevance and structural relations, but weaker on narrative reconstruction. A lightweight timeline/drill-in tool would fill the gap between `memory_search` and heavier causal/lineage investigation, especially for debugging or resume flows.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 4: Namespace hygiene moves into the write path
- **Source**: [external/internal/project/detect.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:16), [external/internal/project/similar.go:15](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go:15), [external/internal/mcp/mcp.go:680](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:680), [external/internal/store/store.go:2459](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:207)
- **What it does**: Engram normalizes project names before persistence, warns when a new name looks like an existing one, and provides an explicit consolidation path with `mem_merge_projects`. Public has robust internal logical-key construction, but that rigor mostly begins after the write boundary, once spec-folder/path/anchor identity is already chosen.
- **Why it matters for us**: Engram suggests a paradigm where human-facing identity drift is handled as a first-class hygiene concern before fragmentation happens. Public should preserve its stronger lineage keys, but add lightweight alias/consolidation support for human-entered thread, space, or future topic identities.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Public should reject project-name scoping as its primary isolation model
- **Source**: [external/internal/project/detect.go:16](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go:16), [external/internal/mcp/mcp.go:625](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821), [shared-memory.ts:245](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:245), [lineage-state.ts:207](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:207)
- **What it does**: Engram’s multi-agent safety story is mostly “project + scope + hygiene.” Public already goes further: trusted session resolution is derived from server context, and lineage keys include tenant/user/agent/session/shared-space scope hashes. Even Public’s shared-memory subsystem explicitly calls out that transport-bound identity is still required for trust.
- **Why it matters for us**: This is a paradigm-shift boundary to hold. Engram’s simplicity is attractive, but collapsing Public down to project names as the main isolation primitive would weaken a stronger governed model that is already baked into retrieval and lineage.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [external/internal/project/detect.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/detect.go)
- [external/internal/project/similar.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/project/similar.go)
- [external/internal/sync/sync.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/sync/sync.go)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [memory-triggers.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts)
- [handlers/index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts)
- [lineage-state.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts)
- [shared-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)

## Assessment
- New information ratio: 0.69
- Questions addressed: Q2, Q4, Q7, Q8, Q9, Q10
- Questions answered: Q2, Q4, Q8, Q9, Q10

## Reflection
- What worked: tracing `internal/store/store.go` as an entity model first, then verifying the MCP layer against actual handlers, exposed deeper shifts than the README-level framing; comparing those paths directly against Public’s `session_bootstrap` / `session_resume`, trusted-session resolution, working-memory injection, handler registry, and lineage storage made the paradigm boundaries concrete.
- What did not work: the CocoIndex MCP pass on this Go-focused slice did not produce usable results in this run, so I fell back to `rg`, `nl -ba`, and direct file reads; the phase validator again returned `PASSED` while also emitting `cannot create temp file for here document: Operation not permitted`, so I treated validation as informative but did not attempt doc repair or memory save in this read-only sandbox.

## Recommended Next Focus
Trace whether Public’s existing lineage/history stack can host a separate outbound mutation bus cleanly, or whether a true `memory_mutations` sidecar is needed; in parallel, compare phase 003 and 004 on durable prompt capture and result-neighborhood retrieval so we can decide whether to add a first-class prompt-memory layer and a timeline/drill-in tool without duplicating graph/semantic systems.
