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
# Iteration 014: DEEP DIVE - STRONGEST PATTERN

## Focus
DEEP DIVE - STRONGEST PATTERN: Go deep on the single most impactful pattern from this system. Trace it end-to-end.

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
I’m tracing the strongest Engram pattern end-to-end against Spec Kit Memory, starting with the governing instructions and the actual Go implementation paths rather than the docs layer. After that I’ll map the concrete behavior to Public’s current session and memory surfaces so the iteration lands on one deep, non-redundant conclusion.
exec
/bin/zsh -lc 'rg -n "engram|hybrid-rag-fusion|persistent memory|session lifecycle|topic_key|prompt" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
282:scope: phase-root prompt authoring and deep-research extension closeout for `026-graph-and-context-optimization/001-research-graph-context-systems`
283:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems; reuse_rule=reuse for follow-up work inside this packet family when user requests prompt parity or extra deep-research iterations on an existing phase lineage
285:## Task 1: Add MemPalace phase-root prompt with Level-3 gating and evidence-bound research instructions, outcome success
289:- rollout_summaries/2026-04-08T06-49-08-WFmZ-mem_palace_phase_prompt.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-49-08-019d6bda-1819-7e43-99e3-158cdec78925.jsonl, updated_at=2026-04-08T06:56:04+00:00, thread_id=019d6bda-1819-7e43-99e3-158cdec78925)
293:- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG
367:- when the user asked to "create a similar prompt for ...005-mempalace ... dont ask for a spec folder," place `phase-research-prompt.md` in the phase root and skip new spec-folder scaffolding [Task 1]
379:- prompt authoring pattern for this packet family: keep the 13-section TIDD-EC structure, include ordered evidence reading, and force evidence tags (`source-confirmed`, `README-documented`, `benchmark-documented`) per finding [Task 1]
397:- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
404:scope: per-phase prompt artifacts that enforce Level 3 Spec Kit documentation before `spec_kit:deep-research` against each phase `external/` tree
405:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems; reuse_rule=reuse for this phase-family prompt workflow in this checkout, keeping prompt artifacts as `phase-research-prompt.md` in each phase root and research outputs in packet docs
407:## Task 1: Add `phase-research-prompt.md` in phases 001-007 with Level 3-before-research gates, outcome success
411:- rollout_summaries/2026-04-04T15-43-31-Svpz-research_agentic_system_phase_prompts.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/04/rollout-2026-04-04T17-43-31-019d5929-e78c-73c1-bd08-74488a2b61bd.jsonl, updated_at=2026-04-04T15:53:59+00:00, thread_id=019d5929-e78c-73c1-bd08-74488a2b61bd)
415:- 999-feature-roadmap, 001-research-agentic-systems, phase-research-prompt.md, Level 3 Spec Kit docs, spec_kit:deep-research, external/
417:## Task 2: Replicate `phase-research-prompt.md` for phases 008/009 in phase roots and keep skip-spec-folder scope, outcome success
421:- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)
425:- 008-bmad-autonomous-development, 009-xethryon, phase-research-prompt.md, skip spec folder, 001-research-agentic-systems, Level 3 docs before deep research
429:- when the user asked to “Add a prompt in each phase folder ... create level 3 speckit documentation ... utilize spec_kit:deep-research BUT need to create proper spec documentation in the folder first,” prompts should enforce: use the existing phase folder, author Level 3 docs first, then research that phase `external/` tree with evidence-backed outcomes and checklist/implementation-summary/memory updates [Task 1]
430:- when the user asked to “create a similar prompt ... in their root folders | skip spec folder,” place `phase-research-prompt.md` in each phase root and avoid spinning up new spec-folder scaffolding [Task 2]
434:- in this repo `specs/` is a symlink to `.opencode/specs`; phase prompt/spec work should be applied under `.opencode/specs/...` paths [Task 1]
435:- prompt artifact placement for this phase family is phase-root `phase-research-prompt.md` (not `scratch/`) and should reference that phase’s own `external/` tree [Task 1][Task 2]
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
490:- rollout_summaries/2026-04-05T11-36-07-phNv-spec_prompt_and_git_push.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/05/rollout-2026-04-05T13-36-07-019d5d6d-c162-7af1-bee7-941955ca7389.jsonl, updated_at=2026-04-05T11:47:10+00:00, thread_id=019d5d6d-c162-7af1-bee7-941955ca7389)
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
557:scope: expanded changelog style updates, nested per-packet/per-phase changelog generator integration, and runtime prompt mirror sync
935:scope: restoring `/spec_kit:*`, `/memory:*`, and `/create:*` command discovery when prompt links drift between workspace and global Codex prompt directories
938:## Task 1: Restore `spec_kit` slash-command prompt discovery by fixing `~/.codex/prompts` target and flat compatibility links, outcome success
942:- rollout_summaries/2026-04-02T06-05-38-knzx-fix_spec_kit_prompts_symlink.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/02/rollout-2026-04-02T08-05-38-019d4ccc-1e9c-7e23-b71a-a8a3f35f8e97.jsonl, updated_at=2026-04-02T06:15:27+00:00, thread_id=019d4ccc-1e9c-7e23-b71a-a8a3f35f8e97)
946:- ~/.codex/prompts, readlink ~/.codex/prompts, .codex/prompts, spec_kit-plan.md, memory-save.md, create-component.md, agent_router.md, .opencode/command
950:- when the user asked “update symlink to /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex,” they expected prompt discovery to work without extra manual steps -> first align `~/.codex/prompts` to the active workspace `.codex/prompts` before deeper troubleshooting [Task 1]
954:- Codex command prompts are discovered via `~/.codex/prompts`; for this checkout the symlink must resolve to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.codex/prompts` (not the `.codex` root) [Task 1]
955:- Some builds/autocomplete paths still expect flat files like `spec_kit-plan.md` and `memory-save.md`; keep compatibility symlinks from `.codex/prompts/<group>-<command>.md` to `.opencode/command/<group>/<command>.md` [Task 1]
956:- If slash commands vanish, verify both `readlink ~/.codex/prompts` and presence of `spec_kit-*.md`/`memory-*.md` compatibility files before restarting Codex [Task 1]
960:- symptom: typing `/spec_kit` shows blank command list; cause: `~/.codex/prompts` linked to `/Users/.../.codex` instead of `/Users/.../.codex/prompts`; fix: repoint global symlink to the actual prompts subfolder and re-list prompt files [Task 1]
1106:- symptom: CLI audit flow stalls or fails fast; cause: unsupported `codex exec --ask-for-approval`; fix: use supported codex flags only and keep single-hop depth constraints in prompt text [Task 6]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
1825:- `generate-context.js` succeeds in manual/headless runs when passed JSON-mode session data (`SPEC_FOLDER`, `recent_context`, `observations`, `user_prompts`) plus absolute spec path [Task 2]
2001:- symptom: CLI audit flow stalls or fails fast; cause: unsupported `codex exec --ask-for-approval`; fix: use supported codex flags only and keep single-hop depth constraints in prompt text [Task 2]
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc "pwd && printf '\\n---\\n' && rg --files -g 'CLAUDE.md' -g 'AGENTS.md' . .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external /Users/michelkerkmeester/.codex/memories | sed 's#"'^#/#'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---
/./CLAUDE.md
/./AGENTS.md
/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/external/opencode-lcm-master/AGENTS.md
/./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/CLAUDE.md
/./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/002-mex-main/external/templates/AGENTS.md
/./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/005-mempalace/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/CLAUDE.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/006-ralph-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/CLAUDE.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/003-claude-code-mastery-project-starter-kit-main/external/global-claude-md/CLAUDE.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/CLAUDE.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/007-relay-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop/AGENTS.md
/./.opencode/specs/system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
/./.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/external/CLAUDE.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/desktop-electron/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/test/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/e2e/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/app/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-github/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/e2e-artifacts/session-create-internal/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-omp/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/001-agent-lightning-main/external/AGENTS.md
/./.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/plugins/babysitter-pi/AGENTS.md

codex
I’ve confirmed there’s prior memory about this exact research-prompt packet family and about the strict-validation/read-only temp-file quirk. Next I’m grounding the run in the repo’s active instructions plus Engram’s MCP/store code so the final finding stays end-to-end and evidence-led.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "sed -n '282,305p;397,405p' /Users/michelkerkmeester/.codex/memories/MEMORY.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
scope: phase-root prompt authoring and deep-research extension closeout for `026-graph-and-context-optimization/001-research-graph-context-systems`
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems; reuse_rule=reuse for follow-up work inside this packet family when user requests prompt parity or extra deep-research iterations on an existing phase lineage

## Task 1: Add MemPalace phase-root prompt with Level-3 gating and evidence-bound research instructions, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-08T06-49-08-WFmZ-mem_palace_phase_prompt.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-49-08-019d6bda-1819-7e43-99e3-158cdec78925.jsonl, updated_at=2026-04-08T06:56:04+00:00, thread_id=019d6bda-1819-7e43-99e3-158cdec78925)

### keywords

- 005-mempalace, phase-research-prompt.md, dont ask for a spec folder, 13-section TIDD-EC, source-confirmed README-documented benchmark-documented, raw-verbatim hooks taxonomy temporal KG

## Task 2: Extend Contextador deep-research from 13 to 20 iterations and fold into v2 synthesis without changing verdict, outcome success

### rollout_summary_files

- rollout_summaries/2026-04-08T06-55-41-FaWO-contextador_deep_research_extension.md (cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/04/08/rollout-2026-04-08T08-55-41-019d6be0-1720-7040-8abd-586be20dce1e.jsonl, updated_at=2026-04-08T07:50:02+00:00, thread_id=019d6be0-1720-7040-8abd-586be20dce1e)

### keywords

- 003-contextador, spec_kit:deep-research, maxIterations 20, deep-research-config.json, reduce-state.cjs, research-v2.md, recommendations-v2.md, findings-registry-v2.json, F-CROSS-089..F-CROSS-093

## Task 3: Absorb Claudest continuation into master v2 execution-ready lane, outcome success
- symptom: strict validation step in prompt cannot run; cause: phase lacks Level 3 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`); fix: create/verify those docs before running `validate.sh --strict` or deep research loops [Task 1]
- symptom: strict validation shows `ANCHORS_VALID` warnings in `decision-record.md`; cause: extra non-template `adr-*` anchor comment lines; fix: remove only the extra comment anchors (not the ADR sections), then rerun recursive `validate.sh --strict` to confirm 0 errors/0 warnings [Task 5]
- symptom: large multi-file memory patch fails to apply cleanly; cause: generated memory snapshots drift from expected formatting; fix: use smaller per-file patches on the latest packet snapshots and revalidate after each batch [Task 5]
- symptom: closeout validation passes but memory index reports lineage mismatch/stale packet rows; cause: old memory_index entries persisted through packet updates; fix: delete stale row IDs, wait out cooldown, then force `memory_index_scan` and confirm zero failed entries before marking complete [Task 7]
- symptom: new phase packets fail strict checks with `AI_PROTOCOL`, `SECTION_COUNTS`, or `SPEC_DOC_INTEGRITY`; cause: scaffold docs left template-thin (missing AI Execution Protocol blocks, acceptance scenarios, anchors) or README placeholders were kept; fix: fill Level 3 templates immediately and delete scaffold READMEs before rerunning strict validation [Task 8]

# Task Group: Research-Agentic-Systems Phase Prompt Gating (Level 3 Before Deep Research)
scope: per-phase prompt artifacts that enforce Level 3 Spec Kit documentation before `spec_kit:deep-research` against each phase `external/` tree
applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems; reuse_rule=reuse for this phase-family prompt workflow in this checkout, keeping prompt artifacts as `phase-research-prompt.md` in each phase root and research outputs in packet docs

codex
The local instructions confirm this is a source-analysis pass, and the memory hit lines up with the same phase-family workflow plus the read-only validator caveat. I’m checking the phase docs and strict validator next, then I’ll stay inside the Engram MCP/store path and trace the most impactful pattern through Public’s equivalent code.
exec
/bin/zsh -lc "rg --files /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main | rg '/(spec|plan|tasks|checklist|decision-record|implementation-summary)\\.md"'$|/research/research'"\\.md"'$|/phase-research-prompt'"\\.md"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/tasks.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-export/spec.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-plugin/specs/obsidian-plugin/spec.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/tasks.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/changes/archive/2026-04-06-obsidian-auto-sync/specs/obsidian-export/spec.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-export/spec.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/openspec/specs/obsidian-plugin/spec.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1437ms:

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
The strict validator returned `PASSED`, but it also reproduced the same read-only temp-file error the memory notes warned about. I’m treating that as an environment artifact, and I’ve confirmed this phase root currently only exposes `phase-research-prompt.md` from the top-level spec-doc set in the sandbox snapshot, so this pass stays read-only and evidence-focused.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/.goreleaser.yaml
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CHANGELOG.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CODEOWNERS
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/CONTRIBUTING.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/DOCS.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/SECURITY.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.mod
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/go.sum
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/setup.sh
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/memory/.gitkeep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/phase-research-prompt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/research/.gitkeep

codex
CocoIndex didn’t give me a usable pass on this Go slice in this run, so I’m explicitly falling back to targeted `rg` plus line-anchored reads, which matches the brief’s fallback rule. I’m now tracing the prompt-capture path from MCP registration into storage, FTS, and startup formatting, then I’ll line it up against Public’s session and working-memory path.
exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '1,260p;300,520p;620,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"mem_save_prompt|AddUserPrompt|user_prompts|prompts_fts|FormatContext|CreateSession|EndSession|mem_session_start|mem_session_end|mem_session_summary|mem_context|mem_search|mem_capture_passive|SuggestTopicKey|sanitizeFTS|Search\\(\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:97:    "user_prompts": [...],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:227:function getOrCreateSession(sessionId: string | null = null): string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:730:  getOrCreateSession,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:486:async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:721:  const result = await handleMemorySearch({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:752:  const result = await handleMemorySearch({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:786:  const result = await handleMemorySearch({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:60:| `mem_search` | Full-text search across all memories |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:61:| `mem_session_summary` | Save end-of-session summary |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:62:| `mem_context` | Get recent context from previous sessions |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:65:| `mem_save_prompt` | Save a user prompt for future context |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:67:| `mem_session_start` | Register a session start |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:68:| `mem_session_end` | Mark a session as completed |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:69:| `mem_capture_passive` | Extract learnings from text output |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:79:1. mem_search "auth middleware"     → compact results with IDs (~100 tokens each)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:94:- `mem_search`, `mem_context`, recent lists, and timeline ignore soft-deleted observations
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:13://	engram mcp --tools=mem_save,mem_search → individual tool names
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:32:var suggestTopicKey = store.SuggestTopicKey
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:41://   mem_save, mem_search, mem_context, mem_session_summary,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:42://   mem_session_start, mem_session_end, mem_get_observation,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:43://   mem_suggest_topic_key, mem_capture_passive, mem_save_prompt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:55:	"mem_search":            true, // search past memories — referenced 6 times
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:56:	"mem_context":           true, // recent context from previous sessions — referenced 10 times
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:57:	"mem_session_summary":   true, // end-of-session summary — referenced 16 times
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:58:	"mem_session_start":     true, // register session start
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:59:	"mem_session_end":       true, // mark session completed
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:62:	"mem_capture_passive":   true, // extract learnings from text — referenced in Gemini/Codex protocol
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:63:	"mem_save_prompt":       true, // save user prompts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:128:  mem_search — find past work, decisions, or context from previous sessions
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:129:  mem_context — get recent session history (call at session start or after compaction)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:130:  mem_session_summary — save end-of-session summary (MANDATORY before saying "done")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:132:  mem_save_prompt — save user prompt for context
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:135:  mem_update, mem_suggest_topic_key, mem_session_start, mem_session_end,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:136:  mem_stats, mem_delete, mem_timeline, mem_capture_passive, mem_merge_projects
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:170:	// ─── mem_search (profile: agent, core — always in context) ─────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:171:	if shouldRegister("mem_search", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:173:			mcp.NewTool("mem_search",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:197:			handleSearch(s, cfg),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:235:  content: "**What**: Wrapped each search term in quotes before passing to FTS5 MATCH\n**Why**: Users typing queries like 'fix auth bug' would crash because FTS5 interprets special chars as operators\n**Where**: internal/store/store.go — sanitizeFTS() function\n**Learned**: FTS5 MATCH syntax is NOT the same as LIKE — always sanitize user input"`),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:323:			handleSuggestTopicKey(),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350:	// ─── mem_save_prompt (profile: agent, eager) ────────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:351:	if shouldRegister("mem_save_prompt", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:353:			mcp.NewTool("mem_save_prompt",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:375:	// ─── mem_context (profile: agent, core — always in context) ────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:376:	if shouldRegister("mem_context", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:378:			mcp.NewTool("mem_context",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:419:				mcp.WithDescription("Show chronological context around a specific observation. Use after mem_search to drill into the timeline of events surrounding a search result. This is the progressive disclosure pattern: search first, then timeline to understand context."),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:428:					mcp.Description("The observation ID to center the timeline on (from mem_search results)"),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:445:				mcp.WithDescription("Get the full content of a specific observation by ID. Use when you need the complete, untruncated content of an observation found via mem_search or mem_timeline."),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:460:	// ─── mem_session_summary (profile: agent, core — always in context) ─
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:461:	if shouldRegister("mem_session_summary", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:463:			mcp.NewTool("mem_session_summary",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515:	// ─── mem_session_start (profile: agent, deferred) ───────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:516:	if shouldRegister("mem_session_start", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:518:			mcp.NewTool("mem_session_start",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:542:	// ─── mem_session_end (profile: agent, deferred) ─────────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:543:	if shouldRegister("mem_session_end", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:545:			mcp.NewTool("mem_session_end",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:565:	// ─── mem_capture_passive (profile: agent, deferred) ─────────────────
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:566:	if shouldRegister("mem_capture_passive", allowlist) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:568:			mcp.NewTool("mem_capture_passive",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:625:func handleSearch(s *store.Store, cfg MCPConfig) server.ToolHandlerFunc {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:640:		results, err := s.Search(query, store.SearchOptions{
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:729:		s.CreateSession(sessionID, project, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:763:func handleSuggestTopicKey() server.ToolHandlerFunc {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:868:		s.CreateSession(sessionID, project, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:894:		context, err := s.FormatContext(project, scope)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1047:		s.CreateSession(sessionID, project, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1076:		if err := s.CreateSession(id, project, directory); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1089:		if err := s.EndSession(id, summary); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:1116:			_ = s.CreateSession(sessionID, project, "")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:487:			CREATE TABLE IF NOT EXISTS user_prompts (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:497:		CREATE INDEX IF NOT EXISTS idx_prompts_session ON user_prompts(session_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:498:		CREATE INDEX IF NOT EXISTS idx_prompts_project ON user_prompts(project);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:499:		CREATE INDEX IF NOT EXISTS idx_prompts_created ON user_prompts(created_at DESC);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501:		CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:504:			content='user_prompts',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:568:	if err := s.addColumnIfNotExists("user_prompts", "sync_id", "TEXT"); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:578:		CREATE INDEX IF NOT EXISTS idx_prompts_sync_id ON user_prompts(sync_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:626:	if _, err := s.execHook(s.db, `UPDATE user_prompts SET project = '' WHERE project IS NULL`); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:629:	if _, err := s.execHook(s.db, `UPDATE user_prompts SET sync_id = 'prompt-' || lower(hex(randomblob(16))) WHERE sync_id IS NULL OR sync_id = ''`); err != nil {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:678:			CREATE TRIGGER prompt_fts_insert AFTER INSERT ON user_prompts BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:679:				INSERT INTO prompts_fts(rowid, content, project)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:683:			CREATE TRIGGER prompt_fts_delete AFTER DELETE ON user_prompts BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:684:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:688:			CREATE TRIGGER prompt_fts_update AFTER UPDATE ON user_prompts BEGIN
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:689:				INSERT INTO prompts_fts(prompts_fts, rowid, content, project)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:691:				INSERT INTO prompts_fts(rowid, content, project)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754:func (s *Store) CreateSession(id, project, directory string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:770:func (s *Store) EndSession(id string, summary string) error {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1122:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1153:	query := `SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1186:	ftsQuery := sanitizeFTS(query)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1190:		FROM prompts_fts fts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1191:		JOIN user_prompts p ON p.id = fts.rowid
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1192:		WHERE prompts_fts MATCH ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462:func (s *Store) Search(query string, opts SearchOptions) ([]SearchResult, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1519:	ftsQuery := sanitizeFTS(query)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1593:	s.db.QueryRow("SELECT COUNT(*) FROM user_prompts").Scan(&stats.TotalPrompts)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613:func (s *Store) FormatContext(project, scope string) (string, error) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1723:		"SELECT id, ifnull(sync_id, '') as sync_id, session_id, content, ifnull(project, '') as project, created_at FROM user_prompts ORDER BY id",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1797:			`INSERT INTO user_prompts (sync_id, session_id, content, project, created_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2234:			SELECT 1 FROM user_prompts WHERE project = ?
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2260:		res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, newName, oldName)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2394:		 FROM user_prompts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2488:			res, err = s.execHook(tx, `UPDATE user_prompts SET project = ? WHERE project = ?`, canonical, src)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2537:		res, err := s.execHook(tx, `DELETE FROM user_prompts WHERE project = ?`, project)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2732:		FROM user_prompts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2739:			  AND sm.entity_key = user_prompts.sync_id
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2948:	err := tx.QueryRow(`SELECT id FROM user_prompts WHERE sync_id = ? ORDER BY id DESC LIMIT 1`, payload.SyncID).Scan(&existingID)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2951:			`INSERT INTO user_prompts (sync_id, session_id, content, project) VALUES (?, ?, ?, ?)`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2960:		`UPDATE user_prompts SET session_id = ?, content = ?, project = ? WHERE id = ?`,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3198:// SuggestTopicKey generates a stable topic key suggestion from type/title/content.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3201:func SuggestTopicKey(typ, title, content string) string {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3382:// sanitizeFTS wraps each word in quotes so FTS5 doesn't choke on special chars.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:3384:func sanitizeFTS(query string) string {

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '1,260p;260,520p;520,760p;1000,1180p;1180,1450p;1540,1705p;1770,1895p;2380,2495p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   275	
   276	// MaxObservationLength returns the configured maximum content length for observations.
   277	func (s *Store) MaxObservationLength() int {
   278		return s.cfg.MaxObservationLength
   279	}
   280	
   281	// ─── Store ───────────────────────────────────────────────────────────────────
   282	
   283	type Store struct {
   284		db    *sql.DB
   285		cfg   Config
   286		hooks storeHooks
   287	}
   288	
   289	type execer interface {
   290		Exec(query string, args ...any) (sql.Result, error)
   291	}
   292	
   293	type queryer interface {
   294		Query(query string, args ...any) (*sql.Rows, error)
   295	}
   296	
   297	type rowScanner interface {
   298		Next() bool
   299		Scan(dest ...any) error
   300		Err() error
   301		Close() error
   302	}
   303	
   304	type sqlRowScanner struct {
   305		rows *sql.Rows
   306	}
   307	
   308	func (r sqlRowScanner) Next() bool {
   309		return r.rows.Next()
   310	}
   311	
   312	func (r sqlRowScanner) Scan(dest ...any) error {
   313		return r.rows.Scan(dest...)
   314	}
   315	
   316	func (r sqlRowScanner) Err() error {
   317		return r.rows.Err()
   318	}
   319	
   320	func (r sqlRowScanner) Close() error {
   321		return r.rows.Close()
   322	}
   323	
   324	type storeHooks struct {
   325		exec    func(db execer, query string, args ...any) (sql.Result, error)
   326		query   func(db queryer, query string, args ...any) (*sql.Rows, error)
   327		queryIt func(db queryer, query string, args ...any) (rowScanner, error)
   328		beginTx func(db *sql.DB) (*sql.Tx, error)
   329		commit  func(tx *sql.Tx) error
   330	}
   331	
   332	func defaultStoreHooks() storeHooks {
   333		return storeHooks{
   334			exec: func(db execer, query string, args ...any) (sql.Result, error) {
   335				return db.Exec(query, args...)
   336			},
   337			query: func(db queryer, query string, args ...any) (*sql.Rows, error) {
   338				return db.Query(query, args...)
   339			},
   340			queryIt: func(db queryer, query string, args ...any) (rowScanner, error) {
   341				rows, err := db.Query(query, args...)
   342				if err != nil {
   343					return nil, err
   344				}
   345				return sqlRowScanner{rows: rows}, nil
   346			},
   347			beginTx: func(db *sql.DB) (*sql.Tx, error) {
   348				return db.Begin()
   349			},
   350			commit: func(tx *sql.Tx) error {
   351				return tx.Commit()
   352			},
   353		}
   354	}
   355	
   356	func (s *Store) execHook(db execer, query string, args ...any) (sql.Result, error) {
   357		if s.hooks.exec != nil {
   358			return s.hooks.exec(db, query, args...)
   359		}
   360		return db.Exec(query, args...)
   361	}
   362	
   363	func (s *Store) queryHook(db queryer, query string, args ...any) (*sql.Rows, error) {
   364		if s.hooks.query != nil {
   365			return s.hooks.query(db, query, args...)
   366		}
   367		return db.Query(query, args...)
   368	}
   369	
   370	func (s *Store) queryItHook(db queryer, query string, args ...any) (rowScanner, error) {
   371		if s.hooks.queryIt != nil {
   372			return s.hooks.queryIt(db, query, args...)
   373		}
   374		rows, err := s.queryHook(db, query, args...)
   375		if err != nil {
   376			return nil, err
   377		}
   378		return sqlRowScanner{rows: rows}, nil
   379	}
   380	
   381	func (s *Store) beginTxHook() (*sql.Tx, error) {
   382		if s.hooks.beginTx != nil {
   383			return s.hooks.beginTx(s.db)
   384		}
   385		return s.db.Begin()
   386	}
   387	
   388	func (s *Store) commitHook(tx *sql.Tx) error {
   389		if s.hooks.commit != nil {
   390			return s.hooks.commit(tx)
   391		}
   392		return tx.Commit()
   393	}
   394	
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
  1226			        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
  1227			 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
  1228		)
  1229		var o Observation
  1230		if err := row.Scan(
  1231			&o.ID, &o.SyncID, &o.SessionID, &o.Type, &o.Title, &o.Content,
  1232			&o.ToolName, &o.Project, &o.Scope, &o.TopicKey, &o.RevisionCount, &o.DuplicateCount, &o.LastSeenAt,
  1233			&o.CreatedAt, &o.UpdatedAt, &o.DeletedAt,
  1234		); err != nil {
  1235			return nil, err
  1236		}
  1237		return &o, nil
  1238	}
  1239	
  1240	func (s *Store) UpdateObservation(id int64, p UpdateObservationParams) (*Observation, error) {
  1241		var updated *Observation
  1242		err := s.withTx(func(tx *sql.Tx) error {
  1243			obs, err := s.getObservationTx(tx, id)
  1244			if err != nil {
  1245				return err
  1246			}
  1247	
  1248			typ := obs.Type
  1249			title := obs.Title
  1250			content := obs.Content
  1251			project := derefString(obs.Project)
  1252			scope := obs.Scope
  1253			topicKey := derefString(obs.TopicKey)
  1254	
  1255			if p.Type != nil {
  1256				typ = *p.Type
  1257			}
  1258			if p.Title != nil {
  1259				title = stripPrivateTags(*p.Title)
  1260			}
  1261			if p.Content != nil {
  1262				content = stripPrivateTags(*p.Content)
  1263				if len(content) > s.cfg.MaxObservationLength {
  1264					content = content[:s.cfg.MaxObservationLength] + "... [truncated]"
  1265				}
  1266			}
  1267			if p.Project != nil {
  1268				project, _ = NormalizeProject(*p.Project)
  1269			}
  1270			if p.Scope != nil {
  1271				scope = normalizeScope(*p.Scope)
  1272			}
  1273			if p.TopicKey != nil {
  1274				topicKey = normalizeTopicKey(*p.TopicKey)
  1275			}
  1276	
  1277			if _, err := s.execHook(tx,
  1278				`UPDATE observations
  1279				 SET type = ?,
  1280				     title = ?,
  1281				     content = ?,
  1282				     project = ?,
  1283				     scope = ?,
  1284				     topic_key = ?,
  1285				     normalized_hash = ?,
  1286				     revision_count = revision_count + 1,
  1287				     updated_at = datetime('now')
  1288				 WHERE id = ? AND deleted_at IS NULL`,
  1289				typ,
  1290				title,
  1291				content,
  1292				nullableString(project),
  1293				scope,
  1294				nullableString(topicKey),
  1295				hashNormalized(content),
  1296				id,
  1297			); err != nil {
  1298				return err
  1299			}
  1300	
  1301			updated, err = s.getObservationTx(tx, id)
  1302			if err != nil {
  1303				return err
  1304			}
  1305			return s.enqueueSyncMutationTx(tx, SyncEntityObservation, updated.SyncID, SyncOpUpsert, observationPayloadFromObservation(updated))
  1306		})
  1307		if err != nil {
  1308			return nil, err
  1309		}
  1310		return updated, nil
  1311	}
  1312	
  1313	func (s *Store) DeleteObservation(id int64, hardDelete bool) error {
  1314		return s.withTx(func(tx *sql.Tx) error {
  1315			obs, err := s.getObservationTx(tx, id)
  1316			if err == sql.ErrNoRows {
  1317				return nil
  1318			}
  1319			if err != nil {
  1320				return err
  1321			}
  1322	
  1323			deletedAt := Now()
  1324			if hardDelete {
  1325				if _, err := s.execHook(tx, `DELETE FROM observations WHERE id = ?`, id); err != nil {
  1326					return err
  1327				}
  1328			} else {
  1329				if _, err := s.execHook(tx,
  1330					`UPDATE observations
  1331					 SET deleted_at = datetime('now'),
  1332					     updated_at = datetime('now')
  1333					 WHERE id = ? AND deleted_at IS NULL`,
  1334					id,
  1335				); err != nil {
  1336					return err
  1337				}
  1338				if err := tx.QueryRow(`SELECT deleted_at FROM observations WHERE id = ?`, id).Scan(&deletedAt); err != nil {
  1339					return err
  1340				}
  1341			}
  1342	
  1343			return s.enqueueSyncMutationTx(tx, SyncEntityObservation, obs.SyncID, SyncOpDelete, syncObservationPayload{
  1344				SyncID:     obs.SyncID,
  1345				Deleted:    true,
  1346				DeletedAt:  &deletedAt,
  1347				HardDelete: hardDelete,
  1348			})
  1349		})
  1350	}
  1351	
  1352	// ─── Timeline ────────────────────────────────────────────────────────────────
  1353	//
  1354	// Timeline provides chronological context around a specific observation.
  1355	// Given an observation ID, it returns N observations before and M after,
  1356	// all within the same session. This is the "progressive disclosure" pattern
  1357	// from claude-mem — agents first search, then use timeline to drill into
  1358	// the chronological neighborhood of a result.
  1359	
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
  1816		ObservationsImported int `json:"observations_imported"`
  1817		PromptsImported      int `json:"prompts_imported"`
  1818	}
  1819	
  1820	// ─── Sync Chunk Tracking ─────────────────────────────────────────────────────
  1821	
  1822	// GetSyncedChunks returns a set of chunk IDs that have been imported/exported.
  1823	func (s *Store) GetSyncedChunks() (map[string]bool, error) {
  1824		rows, err := s.queryItHook(s.db, "SELECT chunk_id FROM sync_chunks")
  1825		if err != nil {
  1826			return nil, fmt.Errorf("get synced chunks: %w", err)
  1827		}
  1828		defer rows.Close()
  1829	
  1830		chunks := make(map[string]bool)
  1831		for rows.Next() {
  1832			var id string
  1833			if err := rows.Scan(&id); err != nil {
  1834				return nil, err
  1835			}
  1836			chunks[id] = true
  1837		}
  1838		return chunks, rows.Err()
  1839	}
  1840	
  1841	// RecordSyncedChunk marks a chunk as imported/exported so it won't be processed again.
  1842	func (s *Store) RecordSyncedChunk(chunkID string) error {
  1843		_, err := s.execHook(s.db,
  1844			"INSERT OR IGNORE INTO sync_chunks (chunk_id) VALUES (?)",
  1845			chunkID,
  1846		)
  1847		return err
  1848	}
  1849	
  1850	// ─── Local Sync State & Mutation Journal ─────────────────────────────────────
  1851	
  1852	func (s *Store) GetSyncState(targetKey string) (*SyncState, error) {
  1853		targetKey = normalizeSyncTargetKey(targetKey)
  1854		if err := s.ensureSyncState(targetKey); err != nil {
  1855			return nil, err
  1856		}
  1857		return s.getSyncState(targetKey)
  1858	}
  1859	
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '740,840p;1088,1215p;1462,1545p;3188,3415p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go | sed -n '515,625p;760,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts | sed -n '200,380p;460,620p;620,760p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '140,240p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js | sed -n '80,170p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   200	      mention_count,
   201	      source_tool,
   202	      source_call_id,
   203	      extraction_rule_id,
   204	      redaction_applied
   205	    )
   206	    SELECT
   207	      id,
   208	      session_id,
   209	      memory_id,
   210	      attention_score,
   211	      added_at,
   212	      last_focused,
   213	      focus_count,
   214	      COALESCE(event_counter, 0),
   215	      COALESCE(mention_count, 0),
   216	      source_tool,
   217	      source_call_id,
   218	      extraction_rule_id,
   219	      COALESCE(redaction_applied, 0)
   220	    FROM working_memory_old;
   221	    DROP TABLE working_memory_old;
   222	  `);
   223	}
   224	
   225	/* --- 6. SESSION MANAGEMENT --- */
   226	
   227	function getOrCreateSession(sessionId: string | null = null): string {
   228	  if (sessionId) return sessionId;
   229	
   230	  // Generate a new session ID
   231	  const timestamp = Date.now().toString(36);
   232	  const random = Math.random().toString(36).substring(2, 8);
   233	  return `wm-${timestamp}-${random}`;
   234	}
   235	
   236	function clearSession(sessionId: string): number {
   237	  if (!db) return 0;
   238	  ensureSchema();
   239	
   240	  try {
   241	    const result = (db.prepare(
   242	      'DELETE FROM working_memory WHERE session_id = ?'
   243	    ) as Database.Statement).run(sessionId);
   244	    sessionModeRegistry.delete(sessionId);
   245	    return (result as { changes: number }).changes;
   246	  } catch (error: unknown) {
   247	    const msg = error instanceof Error ? error.message : String(error);
   248	    console.warn(`[working-memory] clearSession error: ${msg}`);
   249	    return 0;
   250	  }
   251	}
   252	
   253	function cleanupOldSessions(): number {
   254	  if (!db) return 0;
   255	  ensureSchema();
   256	
   257	  try {
   258	    const timeoutSeconds = Math.floor(WORKING_MEMORY_CONFIG.sessionTimeoutMs / 1000);
   259	    const nowIso = new Date(Date.now()).toISOString();
   260	    const staleSessionIds = (db.prepare(
   261	      "SELECT DISTINCT session_id FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   262	    ) as Database.Statement).all(nowIso, timeoutSeconds) as Array<{ session_id: string }>;
   263	    const result = (db.prepare(
   264	      "DELETE FROM working_memory WHERE datetime(last_focused) < datetime(?, '-' || ? || ' seconds')"
   265	    ) as Database.Statement).run(nowIso, timeoutSeconds);
   266	    for (const row of staleSessionIds) {
   267	      sessionModeRegistry.delete(row.session_id);
   268	    }
   269	    return (result as { changes: number }).changes;
   270	  } catch (error: unknown) {
   271	    const msg = error instanceof Error ? error.message : String(error);
   272	    console.warn(`[working-memory] cleanupOldSessions error: ${msg}`);
   273	    return 0;
   274	  }
   275	}
   276	
   277	/* --- 7. WORKING MEMORY OPERATIONS --- */
   278	
   279	function getWorkingMemory(sessionId: string): WorkingMemoryEntry[] {
   280	  if (!db) return [];
   281	  ensureSchema();
   282	
   283	  try {
   284	    return (db.prepare(`
   285	      SELECT * FROM working_memory
   286	      WHERE session_id = ?
   287	        AND memory_id IS NOT NULL
   288	      ORDER BY attention_score DESC
   289	    `) as Database.Statement).all(sessionId) as WorkingMemoryEntry[];
   290	  } catch (error: unknown) {
   291	    const msg = error instanceof Error ? error.message : String(error);
   292	    console.warn(`[working-memory] getWorkingMemory error: ${msg}`);
   293	    return [];
   294	  }
   295	}
   296	
   297	function getSessionMemories(sessionId: string): Array<Record<string, unknown>> {
   298	  if (!db) return [];
   299	  ensureSchema();
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
   361	  const normalizedMode = mode.trim();
   362	  if (normalizedSessionId.length === 0 || normalizedMode.length === 0) {
   363	    return;
   364	  }
   365	  sessionModeRegistry.set(normalizedSessionId, normalizedMode);
   366	}
   367	
   368	/**
   369	 * Calculate attention tier for an entry.
   370	 */
   371	function calculateTier(attentionScore: number): string {
   372	  if (attentionScore >= 0.8) return 'focused';
   373	  if (attentionScore >= 0.5) return 'active';
   374	  if (attentionScore >= 0.2) return 'peripheral';
   375	  return 'fading';
   376	}
   377	
   378	/**
   379	 * Set or update the attention score for a memory in working memory.
   380	 */
   460	      ) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?)
   461	      ON CONFLICT(session_id, memory_id) DO UPDATE SET
   462	        attention_score = CASE
   463	          WHEN excluded.attention_score > working_memory.attention_score THEN excluded.attention_score
   464	          ELSE working_memory.attention_score
   465	        END,
   466	        last_focused = CURRENT_TIMESTAMP,
   467	        focus_count = working_memory.focus_count + 1,
   468	        mention_count = MIN(working_memory.mention_count + 1, ${MAX_MENTION_COUNT}),
   469	        event_counter = excluded.event_counter,
   470	        source_tool = excluded.source_tool,
   471	        source_call_id = excluded.source_call_id,
   472	        extraction_rule_id = excluded.extraction_rule_id,
   473	        redaction_applied = excluded.redaction_applied
   474	    `) as Database.Statement).run(
   475	      sessionId,
   476	      memoryId,
   477	      clampedScore,
   478	      currentEventCounter,
   479	      sourceTool,
   480	      sourceCallId,
   481	      extractionRuleId,
   482	      redactionApplied ? 1 : 0
   483	    );
   484	
   485	    // If focus_count is still 1 after the upsert, this row was newly inserted.
   486	    // Capacity checks should run only for new rows to avoid evicting on updates.
   487	    const currentRow = (db.prepare(
   488	      'SELECT focus_count FROM working_memory WHERE session_id = ? AND memory_id = ?'
   489	    ) as Database.Statement).get(sessionId, memoryId) as { focus_count?: number } | undefined;
   490	    if ((currentRow?.focus_count ?? 0) === 1) {
   491	      enforceMemoryLimit(sessionId);
   492	    }
   493	
   494	    return true;
   495	  } catch (error: unknown) {
   496	    const msg = error instanceof Error ? error.message : String(error);
   497	    console.warn(`[working-memory] upsertExtractedEntry error: ${msg}`);
   498	    return false;
   499	  }
   500	}
   501	
   502	function nextEventCounter(sessionId: string): number {
   503	  if (!db) return 0;
   504	
   505	  const current = getLatestSessionEventCounter(sessionId);
   506	  if (current === null) {
   507	    return 0;
   508	  }
   509	
   510	  return (current + 1) % EVENT_COUNTER_MODULUS;
   511	}
   512	
   513	/**
   514	 * Enforce working memory capacity limit by LRU eviction.
   515	 *
   516	 * LRU is defined as the least-recently focused entries first (`last_focused ASC`).
   517	 * `id ASC` is used as a deterministic tie-breaker when timestamps are equal.
   518	 */
   519	function enforceMemoryLimit(sessionId: string): number {
   520	  if (!db) return 0;
   521	
   522	  try {
   523	    const count = (db.prepare(
   524	      'SELECT COUNT(*) as count FROM working_memory WHERE session_id = ? AND memory_id IS NOT NULL'
   525	    ) as Database.Statement).get(sessionId) as { count: number };
   526	
   527	    if (count.count < WORKING_MEMORY_CONFIG.maxCapacity) return 0;
   528	
   529	    const excess = count.count - WORKING_MEMORY_CONFIG.maxCapacity + 1;
   530	    const result = (db.prepare(`
   531	      DELETE FROM working_memory
   532	      WHERE id IN (
   533	        SELECT id FROM working_memory
   534	        WHERE session_id = ?
   535	          AND memory_id IS NOT NULL
   536	        ORDER BY last_focused ASC, id ASC
   537	        LIMIT ?
   538	      )
   539	    `) as Database.Statement).run(sessionId, excess);
   540	
   541	    return (result as { changes: number }).changes;
   542	  } catch (error: unknown) {
   543	    const msg = error instanceof Error ? error.message : String(error);
   544	    console.warn(`[working-memory] enforceMemoryLimit error: ${msg}`);
   545	    return 0;
   546	  }
   547	}
   548	
   549	/**
   550	 * Batch update attention scores with decay.
   551	 *
   552	 * Separates the decay floor from the delete threshold to prevent the
   553	 * decay/delete race condition:
   554	 *   - decayFloor (0.05): scores are clamped here, never decay below this
   555	 *   - deleteThreshold (0.01): only entries below this are pruned
   556	 * This gives floored memories a stable resting state instead of immediate
   557	 * deletion. Entries can only reach below deleteThreshold through explicit
   558	 * score-setting or extended inactivity cleanup.
   559	 */
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
   620	    return changedRows;
   621	  } catch (error: unknown) {
   622	    const msg = error instanceof Error ? error.message : String(error);
   623	    console.warn(`[working-memory] batchUpdateScores error: ${msg}`);
   624	    return 0;
   625	  }
   626	}
   627	
   628	function getCurrentEventCounter(sessionId: string): number {
   629	  const current = getLatestSessionEventCounter(sessionId);
   630	  if (current === null) {
   631	    return 0;
   632	  }
   633	
   634	  return current;
   635	}
   636	
   637	function getLatestSessionEventCounter(sessionId: string): number | null {
   638	  if (!db) return null;
   639	
   640	  try {
   641	    const row = (db.prepare(`
   642	      SELECT event_counter
   643	      FROM working_memory
   644	      WHERE session_id = ?
   645	        AND memory_id IS NOT NULL
   646	      ORDER BY last_focused DESC, id DESC
   647	      LIMIT 1
   648	    `) as Database.Statement).get(sessionId) as { event_counter?: number | null };
   649	
   650	    if (!row || typeof row.event_counter !== 'number' || Number.isNaN(row.event_counter)) {
   651	      return null;
   652	    }
   653	
   654	    return row.event_counter;
   655	  } catch (error: unknown) {
   656	    const msg = error instanceof Error ? error.message : String(error);
   657	    console.warn(`[working-memory] getLatestSessionEventCounter error: ${msg}`);
   658	    return null;
   659	  }
   660	}
   661	
   662	function calculateEventDistance(currentCounter: number, entryCounter: number): number {
   663	  const normalizedCurrent = ((currentCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
   664	  const normalizedEntry = ((entryCounter % EVENT_COUNTER_MODULUS) + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
   665	  return (normalizedCurrent - normalizedEntry + EVENT_COUNTER_MODULUS) % EVENT_COUNTER_MODULUS;
   666	}
   667	
   668	/* --- 8. UTILITY FUNCTIONS --- */
   669	
   670	function isEnabled(): boolean {
   671	  return WORKING_MEMORY_CONFIG.enabled;
   672	}
   673	
   674	function getConfig(): WorkingMemoryConfigType {
   675	  return { ...WORKING_MEMORY_CONFIG };
   676	}
   677	
   678	function getSessionStats(sessionId: string): SessionStats | null {
   679	  if (!db) return null;
   680	  ensureSchema();
   681	
   682	  try {
   683	    const stats = (db.prepare(`
   684	      SELECT
   685	        COUNT(*) as totalEntries,
   686	        AVG(attention_score) as avgAttention,
   687	        MAX(attention_score) as maxAttention,
   688	        MIN(attention_score) as minAttention,
   689	        SUM(focus_count) as totalFocusEvents
   690	      FROM working_memory
   691	      WHERE session_id = ?
   692	        AND memory_id IS NOT NULL
   693	    `) as Database.Statement).get(sessionId) as {
   694	      totalEntries: number;
   695	      avgAttention: number;
   696	      maxAttention: number;
   697	      minAttention: number;
   698	      totalFocusEvents: number;
   699	    } | undefined;
   700	
   701	    if (!stats || stats.totalEntries === 0) return null;
   702	
   703	    return {
   704	      sessionId,
   705	      totalEntries: stats.totalEntries,
   706	      avgAttention: Math.round((stats.avgAttention || 0) * 100) / 100,
   707	      maxAttention: stats.maxAttention || 0,
   708	      minAttention: stats.minAttention || 0,
   709	      totalFocusEvents: stats.totalFocusEvents || 0,
   710	    };
   711	  } catch (error: unknown) {
   712	    const msg = error instanceof Error ? error.message : String(error);
   713	    console.warn(`[working-memory] getSessionStats error: ${msg}`);
   714	    return null;
   715	  }
   716	}
   717	
   718	/* --- 9. EXPORTS --- */
   719	
   720	export {
   721	  WORKING_MEMORY_CONFIG,
   722	  SCHEMA_SQL,
   723	  INDEX_SQL,
   724	
   725	  // Initialization
   726	  init,
   727	  ensureSchema,
   728	
   729	  // Session management
   730	  getOrCreateSession,
   731	  clearSession,
   732	  cleanupOldSessions,
   733	
   734	  // Working memory operations
   735	  getWorkingMemory,
   736	  getSessionMemories,
   737	  sessionExists,
   738	  getSessionEventCounter,
   739	  getSessionPromptContext,
   740	  getSessionInferredMode,
   741	  setSessionInferredMode,
   742	  calculateTier,
   743	  setAttentionScore,
   744	  upsertExtractedEntry,
   745	  enforceMemoryLimit,
   746	  batchUpdateScores,
   747	  DECAY_FLOOR,
   748	  DELETE_THRESHOLD,
   749	  EVENT_DECAY_FACTOR,
   750	  MENTION_BOOST_FACTOR,
   751	  EVENT_COUNTER_MODULUS,
   752	  MAX_MENTION_COUNT,
   753	
   754	  // Utilities
   755	  isEnabled,
   756	  getConfig,
   757	  getSessionStats,
   758	};
   759	
   760	export type {

---
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

---
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '700,900p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '486,760p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts | sed -n '1,240p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   700	async function executeQuickStrategy(input: string, options: ContextOptions): Promise<ContextResult> {
   701	  const result = await handleMemoryMatchTriggers({
   702	    prompt: input,
   703	    specFolder: options.specFolder,
   704	    tenantId: options.tenantId,
   705	    userId: options.userId,
   706	    agentId: options.agentId,
   707	    sharedSpaceId: options.sharedSpaceId,
   708	    limit: options.limit || 5,
   709	    session_id: options.sessionId,
   710	    include_cognitive: true
   711	  });
   712	
   713	  return {
   714	    strategy: 'quick',
   715	    mode: 'quick',
   716	    ...result
   717	  };
   718	}
   719	
   720	async function executeDeepStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   721	  const result = await handleMemorySearch({
   722	    query: input,
   723	    specFolder: options.specFolder,
   724	    folderBoost: options.folderBoost,
   725	    tenantId: options.tenantId,
   726	    userId: options.userId,
   727	    agentId: options.agentId,
   728	    sharedSpaceId: options.sharedSpaceId,
   729	    limit: options.limit || 10,
   730	    includeConstitutional: true,
   731	    includeContent: options.includeContent || false,
   732	    includeTrace: options.includeTrace || false, // CHK-040
   733	    anchors: options.anchors,
   734	    sessionId: options.sessionId,
   735	    sessionTransition: options.sessionTransition,
   736	    enableDedup: options.enableDedup !== false,
   737	    profile: options.profile,
   738	    intent: intent ?? undefined,
   739	    autoDetectIntent: intent ? false : true,
   740	    useDecay: true,
   741	    // minState omitted — memoryState column not yet in schema
   742	  });
   743	
   744	  return {
   745	    strategy: 'deep',
   746	    mode: 'deep',
   747	    ...result
   748	  };
   749	}
   750	
   751	async function executeFocusedStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   752	  const result = await handleMemorySearch({
   753	    query: input,
   754	    specFolder: options.specFolder,
   755	    folderBoost: options.folderBoost,
   756	    tenantId: options.tenantId,
   757	    userId: options.userId,
   758	    agentId: options.agentId,
   759	    sharedSpaceId: options.sharedSpaceId,
   760	    limit: options.limit || 8,
   761	    includeConstitutional: true,
   762	    includeContent: options.includeContent || false,
   763	    includeTrace: options.includeTrace || false, // CHK-040
   764	    anchors: options.anchors,
   765	    sessionId: options.sessionId,
   766	    sessionTransition: options.sessionTransition,
   767	    enableDedup: options.enableDedup !== false,
   768	    profile: options.profile,
   769	    intent: intent ?? undefined,
   770	    autoDetectIntent: intent ? false : true,
   771	    useDecay: true,
   772	    // minState omitted — memoryState column not yet in schema
   773	  });
   774	
   775	  return {
   776	    strategy: 'focused',
   777	    mode: 'focused',
   778	    intent: intent,
   779	    ...result
   780	  };
   781	}
   782	
   783	async function executeResumeStrategy(input: string, intent: string | null, options: ContextOptions): Promise<ContextResult> {
   784	  const resumeAnchors = options.anchors || ['state', 'next-steps', 'summary', 'blockers'];
   785	
   786	  const result = await handleMemorySearch({
   787	    query: input || 'resume work continue session',
   788	    specFolder: options.specFolder,
   789	    folderBoost: options.folderBoost,
   790	    tenantId: options.tenantId,
   791	    userId: options.userId,
   792	    agentId: options.agentId,
   793	    sharedSpaceId: options.sharedSpaceId,
   794	    limit: options.limit || 5,
   795	    includeConstitutional: false,
   796	    includeContent: true,
   797	    includeTrace: options.includeTrace || false, // CHK-040
   798	    anchors: resumeAnchors,
   799	    sessionId: options.sessionId,
   800	    sessionTransition: options.sessionTransition,
   801	    enableDedup: false,
   802	    profile: options.profile,
   803	    intent: intent ?? undefined,
   804	    autoDetectIntent: intent ? false : true,
   805	    useDecay: false,
   806	    // minState omitted — memoryState column not yet in schema
   807	  });
   808	
   809	  return {
   810	    strategy: 'resume',
   811	    mode: 'resume',
   812	    resumeAnchors: resumeAnchors,
   813	    ...result
   814	  };
   815	}
   816	
   817	/* ───────────────────────────────────────────────────────────────
   818	   6. HANDLER HELPERS
   819	──────────────────────────────────────────────────────────────── */
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

---
   486	async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
   487	  const _searchStartTime = Date.now();
   488	  resetLastLexicalCapabilitySnapshot();
   489	  // BUG-001: Check for external database updates before processing
   490	  await checkDatabaseUpdated();
   491	
   492	  const {
   493	    cursor,
   494	    query,
   495	    concepts,
   496	    specFolder,
   497	    folderBoost,
   498	    tenantId,
   499	    userId,
   500	    agentId,
   501	    sharedSpaceId,
   502	    limit: rawLimit = 10,
   503	    tier,
   504	    contextType,
   505	    useDecay: useDecay = true,
   506	    includeContiguity: includeContiguity = false,
   507	    includeConstitutional: includeConstitutional = true,
   508	    includeContent: includeContent = false,
   509	    anchors,
   510	    bypassCache: bypassCache = false,
   511	    sessionId,
   512	    enableDedup: enableDedup = true,
   513	    intent: explicitIntent,
   514	    autoDetectIntent: autoDetectIntent = true,
   515	    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
   516	    applyStateLimits: applyStateLimits = false,
   517	    rerank = true, // Enable reranking by default for better result quality
   518	    applyLengthPenalty: applyLengthPenalty = true,
   519	    trackAccess: trackAccess = false, // opt-in, off by default
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
   591	      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
   592	        const message = toErrorMessage(validationError);
   593	        return createMCPErrorResponse({
   594	          tool: 'memory_search',
   595	          error: message,
   596	          code: 'E_VALIDATION',
   597	          details: { parameter: 'query' },
   598	          recovery: {
   599	            hint: 'Provide a valid query string or use concepts array instead'
   600	          }
   601	        });
   602	      }
   603	      normalizedQuery = null;
   604	    }
   605	  }
   606	
   607	  const hasValidQuery = normalizedQuery !== null;
   608	  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
   609	  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
   610	
   611	  if (!hasValidQuery && !hasValidConcepts) {
   612	    return createMCPErrorResponse({
   613	      tool: 'memory_search',
   614	      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
   615	      code: 'E_VALIDATION',
   616	      details: { parameter: 'query' },
   617	      recovery: {
   618	        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
   619	      }
   620	    });
   621	  }
   622	
   623	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   624	    return createMCPErrorResponse({
   625	      tool: 'memory_search',
   626	      error: 'specFolder must be a string',
   627	      code: 'E_VALIDATION',
   628	      details: { parameter: 'specFolder' },
   629	      recovery: {
   630	        hint: 'Provide specFolder as a string path'
   631	      }
   632	    });
   633	  }
   634	
   635	  // Eval logger — capture query at pipeline entry (fail-safe)
   636	  let _evalQueryId = 0;
   637	  let _evalRunId = 0;
   638	  try {
   639	    const evalEntry = logSearchQuery({
   640	      query: effectiveQuery,
   641	      intent: explicitIntent ?? null,
   642	      specFolder: specFolder ?? null,
   643	    });
   644	    _evalQueryId = evalEntry.queryId;
   645	    _evalRunId = evalEntry.evalRunId;
   646	  } catch (_error: unknown) { /* eval logging must never break search */ }
   647	
   648	  const artifactRoutingQuery = resolveArtifactRoutingQuery(
   649	    normalizedQuery,
   650	    hasValidConcepts ? concepts : undefined
   651	  );
   652	  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
   653	
   654	  // Intent-aware retrieval
   655	  let detectedIntent: string | null = null;
   656	  let intentConfidence = 0;
   657	  let intentWeights: IntentWeights | null = null;
   658	
   659	  if (explicitIntent) {
   660	    if (intentClassifier.isValidIntent(explicitIntent)) {
   661	      detectedIntent = explicitIntent;
   662	      intentConfidence = 1.0;
   663	      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
   664	    } else {
   665	      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
   666	    }
   667	  }
   668	
   669	  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
   670	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
   671	    detectedIntent = classification.intent;
   672	    intentConfidence = classification.confidence;
   673	    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);
   674	
   675	    if (classification.fallback) {
   676	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
   677	    } else {
   678	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
   679	    }
   680	  }
   681	
   682	  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
   683	  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
   684	  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
   685	    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
   686	    detectedIntent = 'understand';
   687	    intentConfidence = 1.0;
   688	    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
   689	  }
   690	
   691	  // Phase C: Intent-to-profile auto-routing.
   692	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
   693	  let effectiveProfile: string | undefined = profile;
   694	  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
   695	    try {
   696	      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
   697	      if (autoProfile) {
   698	        effectiveProfile = autoProfile;
   699	        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
   700	      }
   701	    } catch (_autoProfileErr: unknown) {
   702	      // Auto-profile is best-effort — never breaks search
   703	    }
   704	  }
   705	
   706	  // Re-run artifact routing with detected intent for fallback coverage
   707	  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
   708	    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
   709	  }
   710	
   711	  // Create retrieval trace at pipeline entry
   712	  const trace = createTrace(
   713	    effectiveQuery,
   714	    sessionId,
   715	    detectedIntent || undefined
   716	  );
   717	
   718	  // Build cache key args
   719	  const cacheArgs = buildCacheArgs({
   720	    normalizedQuery,
   721	    hasValidConcepts,
   722	    concepts,
   723	    specFolder,
   724	    tenantId: normalizedScope.tenantId,
   725	    userId: normalizedScope.userId,
   726	    agentId: normalizedScope.agentId,
   727	    sharedSpaceId: normalizedScope.sharedSpaceId,
   728	    limit,
   729	    mode,
   730	    tier,
   731	    contextType,
   732	    useDecay,
   733	    includeArchived,
   734	    qualityThreshold,
   735	    applyStateLimits,
   736	    includeContiguity,
   737	    includeConstitutional,
   738	    includeContent,
   739	    anchors,
   740	    detectedIntent,
   741	    minState: minState ?? '',
   742	    rerank,
   743	    applyLengthPenalty,
   744	    sessionId,
   745	    enableSessionBoost,
   746	    enableCausalBoost,
   747	    includeTrace,
   748	  });
   749	
   750	  let _evalChannelPayloads: EvalChannelPayload[] = [];
   751	  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
   752	  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
   753	  const cachedPayload = cacheEnabled
   754	    ? toolCache.get<SearchCachePayload>(cacheKey)
   755	    : null;
   756	
   757	  let responseToReturn: MCPResponse;
   758	  let goalRefinementPayload: Record<string, unknown> | null = null;
   759	
   760	  if (cachedPayload) {

---
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

---
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

codex
The prompt-memory path is real and stronger than a README claim: Engram exposes it as an eager agent tool, persists it in its own table and FTS index, syncs it as a first-class entity, and feeds it back into `mem_context`. I’m filling in the remaining end-to-end pieces now: observation/topic hygiene and the exact Public contrast points around search, resume, and transient prompt-context handling.
exec
/bin/zsh -lc "rg -n \"func \\(s \\*Store\\) AddObservation|topic_key|duplicate_count|revision_count|normalized_hash|DedupeWindow|deleted_at IS NULL|directResults|strings.Contains\\(query, \\\"/\\\"\\)\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
48:	TopicKey       *string `json:"topic_key,omitempty"`
49:	RevisionCount  int     `json:"revision_count"`
50:	DuplicateCount int     `json:"duplicate_count"`
87:	TopicKey       *string `json:"topic_key,omitempty"`
88:	RevisionCount  int     `json:"revision_count"`
89:	DuplicateCount int     `json:"duplicate_count"`
120:	TopicKey  string `json:"topic_key,omitempty"`
129:	TopicKey *string `json:"topic_key,omitempty"`
217:	TopicKey   *string `json:"topic_key,omitempty"`
246:	DedupeWindow         time.Duration
259:		DedupeWindow:         15 * time.Minute,
272:		DedupeWindow:         15 * time.Minute,
460:			topic_key  TEXT,
461:			normalized_hash TEXT,
462:			revision_count INTEGER NOT NULL DEFAULT 1,
463:			duplicate_count INTEGER NOT NULL DEFAULT 1,
482:			topic_key,
550:		{name: "topic_key", definition: "TEXT"},
551:		{name: "normalized_hash", definition: "TEXT"},
552:		{name: "revision_count", definition: "INTEGER NOT NULL DEFAULT 1"},
553:		{name: "duplicate_count", definition: "INTEGER NOT NULL DEFAULT 1"},
575:		CREATE INDEX IF NOT EXISTS idx_obs_topic ON observations(topic_key, project, scope, updated_at DESC);
577:		CREATE INDEX IF NOT EXISTS idx_obs_dedupe ON observations(normalized_hash, project, scope, type, title, created_at DESC);
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
986:					     normalized_hash = ?,
987:					     revision_count = revision_count + 1,
1013:		window := dedupeWindowExpression(s.cfg.DedupeWindow)
1017:			 WHERE normalized_hash = ?
1022:			   AND deleted_at IS NULL
1031:				 SET duplicate_count = duplicate_count + 1,
1052:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, updated_at)
1086:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at
1088:		WHERE o.deleted_at IS NULL
1226:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1227:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
1284:			     topic_key = ?,
1285:			     normalized_hash = ?,
1286:			     revision_count = revision_count + 1,
1288:			 WHERE id = ? AND deleted_at IS NULL`,
1333:				 WHERE id = ? AND deleted_at IS NULL`,
1384:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1386:		WHERE session_id = ? AND id < ? AND deleted_at IS NULL
1418:		       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1420:		WHERE session_id = ? AND id > ? AND deleted_at IS NULL
1448:		"SELECT COUNT(*) FROM observations WHERE session_id = ? AND deleted_at IS NULL", focus.SessionID,
1474:	var directResults []SearchResult
1475:	if strings.Contains(query, "/") {
1478:			       scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1480:			WHERE topic_key = ? AND deleted_at IS NULL
1513:				directResults = append(directResults, sr)
1523:		       o.scope, o.topic_key, o.revision_count, o.duplicate_count, o.last_seen_at, o.created_at, o.updated_at, o.deleted_at,
1527:		WHERE observations_fts MATCH ? AND o.deleted_at IS NULL
1556:	for _, dr := range directResults {
1561:	results = append(results, directResults...)
1592:	s.db.QueryRow("SELECT COUNT(*) FROM observations WHERE deleted_at IS NULL").Scan(&stats.TotalObservations)
1595:	rows, err := s.queryItHook(s.db, "SELECT project FROM observations WHERE project IS NOT NULL AND deleted_at IS NULL GROUP BY project ORDER BY MAX(created_at) DESC")
1699:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
1769:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at)
2124:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2125:		 FROM observations WHERE sync_id = ? AND deleted_at IS NULL ORDER BY id DESC LIMIT 1`,
2290:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2325:		 WHERE project IS NOT NULL AND project != '' AND deleted_at IS NULL
2439:		`SELECT COUNT(*) FROM observations WHERE project = ? AND deleted_at IS NULL`,
2697:		SELECT sync_id, session_id, type, title, content, tool_name, project, scope, topic_key
2700:		  AND deleted_at IS NULL
2846:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2847:		 FROM observations WHERE id = ? AND deleted_at IS NULL`, id,
2858:		        scope, topic_key, revision_count, duplicate_count, last_seen_at, created_at, updated_at, deleted_at
2861:		query += ` AND deleted_at IS NULL`
2904:			`INSERT INTO observations (sync_id, session_id, type, title, content, tool_name, project, scope, topic_key, normalized_hash, revision_count, duplicate_count, updated_at, deleted_at)
2915:		 SET session_id = ?, type = ?, title = ?, content = ?, tool_name = ?, project = ?, scope = ?, topic_key = ?, normalized_hash = ?, revision_count = revision_count + 1, updated_at = datetime('now'), deleted_at = NULL
3065:			topic_key  TEXT,
3066:			normalized_hash TEXT,
3067:			revision_count INTEGER NOT NULL DEFAULT 1,
3068:			duplicate_count INTEGER NOT NULL DEFAULT 1,
3082:			scope, topic_key, normalized_hash, revision_count, duplicate_count,
3099:			NULLIF(topic_key, ''),
3100:			normalized_hash,
3101:			CASE WHEN revision_count IS NULL OR revision_count < 1 THEN 1 ELSE revision_count END,
3102:			CASE WHEN duplicate_count IS NULL OR duplicate_count < 1 THEN 1 ELSE duplicate_count END,
3132:			topic_key,
3136:		INSERT INTO observations_fts(rowid, title, content, tool_name, type, project, topic_key)
3137:		SELECT id, title, content, tool_name, type, project, topic_key
3139:		WHERE deleted_at IS NULL;
3502:			 WHERE normalized_hash = ?
3504:			   AND deleted_at IS NULL

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go | sed -n '900,1088p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc 'rg -n "getSessionPromptContext|upsertExtractedEntry|working memory|prompt context|shadow|telemetry|user_prompts|recent_context|exchanges|toolCalls" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:106:import { initScoringObservability } from './lib/telemetry/scoring-observability.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:114:import * as shadowEvaluationRuntime from './lib/feedback/shadow-evaluation-runtime.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1365:  runCleanupStep('shadowEvaluationRuntime', () => shadowEvaluationRuntime.stopShadowEvaluationScheduler());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1761:    // Replays recent production queries through a shadow-only path once the
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1764:      const shadowSchedulerStarted = shadowEvaluationRuntime.startShadowEvaluationScheduler(database);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1765:      if (shadowSchedulerStarted) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1770:    } catch (shadowEvalErr: unknown) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1771:      const message = shadowEvalErr instanceof Error ? shadowEvalErr.message : String(shadowEvalErr);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1775:    // REQ-D4-004: Batch feedback learning — runs one cycle at startup (shadow-only, no live ranking mutations).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1780:        console.error(`[context-server] Batch learning: ${batchResult.shadowApplied} shadow-applied, ${batchResult.skippedMinSupport} skipped (min-support), window=${Math.round((batchResult.runAt - batchResult.windowStart) / 86_400_000)}d`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:45:| `SPECKIT_EXTENDED_TELEMETRY` | Adds more detailed telemetry for later analysis, but does not change certainty or authority requirements. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:74:12. [Evaluation and Telemetry](#12-evaluation-and-telemetry)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:231:| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | string | Adaptive ranking mode: `shadow` (compute but do not apply) or `promoted` (apply to ranking). | `lib/cognitive/adaptive-ranking.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:233:| `SPECKIT_EVENT_DECAY` | `true` | boolean | Event decay processing in working memory. Graduated ON. | `lib/cognitive/working-memory.ts` (via tests) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:244:| `SPECKIT_SHADOW_FEEDBACK` | `true` | boolean | Shadow scoring with holdout evaluation: compares would-have-changed vs live rankings (REQ-D4-006). Graduated ON. | `lib/feedback/shadow-scoring.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:246:| `SPECKIT_LEARNED_STAGE2_COMBINER` | `true` | boolean | Learned Stage 2 weight combiner in shadow mode (REQ-D1-006). Graduated ON. | `lib/search/search-flags.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:250:| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | Agent consumption event logging for analysis (G-NEW-2). Graduated ON. | `lib/telemetry/consumption-logger.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:296:<!-- ANCHOR:eval-telemetry -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:304:| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | Detailed retrieval metrics collection (latency breakdown, quality scores). Opt-in: set `true` to enable. | `lib/telemetry/retrieval-telemetry.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:313:<!-- /ANCHOR:eval-telemetry -->
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:415:# Enable extended telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/README.md:525:**Learned Stage 2 weight combiner** -- learns the best combination of scoring signals from actual usage data. Runs in shadow mode only, without affecting live results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:97:    "user_prompts": [...],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:99:    "recent_context": [...],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:100:    "toolCalls": [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:104:    "exchanges": [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:126:  - toolCalls[]: AI-summarized tool calls with tool name, input/output summaries, status, duration
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:127:  - exchanges[]: Key user-assistant exchanges with timestamps
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:25:import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:93:  let telemetryPayload: Record<string, unknown> | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:95:    const telemetry = retrievalTelemetry.createTelemetry();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:96:    retrievalTelemetry.recordLifecycleForecastDiagnostics(telemetry, forecast, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:102:    telemetryPayload = retrievalTelemetry.toJSON(telemetry);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:120:    ...(telemetryPayload ? { _telemetry: telemetryPayload } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:34:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:208:  // manager to prevent IDOR. Callers cannot read/write working memory for
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:852:    // Immediately clear working memory for cleared session (GAP 2).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1090:    // Immediately clear working memory for completed session (GAP 2).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/context-metrics.ts:121:/** Phase 024 / Item 9: Record a bootstrap telemetry event. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/feedback-ledger.ts:6:// into a shadow-only SQLite table. No ranking side effects.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:18:import { initConsumptionLog } from '../telemetry/consumption-logger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:28:} from './shadow-scoring.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:41:  shadow: RankedItem[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:52:  shadowRank?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:53:  shadowScore?: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:56:/** Scheduler configuration for production shadow-feedback holdout runs. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:194: * Load a recent pool of distinct production queries from consumption telemetry.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:221: * used for scheduled shadow replay.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:247: * Extract live results plus the adaptive shadow proposal from a replayed query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:252:  shadowRows: ShadowProposalRow[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:255:  if (liveRows.length === 0 || shadowRows.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:263:    ...shadowRows
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:292:  const shadow: RankedItem[] = [...shadowRows]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:293:    .filter((row): row is Required<Pick<ShadowProposalRow, 'memoryId' | 'shadowRank' | 'shadowScore'>> => (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:295:      && typeof row.shadowRank === 'number'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:296:      && typeof row.shadowScore === 'number'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:298:    .sort((a, b) => a.shadowRank - b.shadowRank)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:301:      rank: row.shadowRank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:310:  if (live.length === 0 || shadow.length === 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:314:  return { live, shadow };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:327:  const shadowProposal = buildAdaptiveShadowProposal(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:333:  if (!shadowProposal) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:337:  return buildReplayRanks(db, liveRows, shadowProposal.rows as ShadowProposalRow[], queryText);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:373:      console.warn(`[shadow-evaluation-runtime] query replay failed for ${queryId}: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:385: * Run one fail-safe production shadow evaluation cycle when a weekly run is due.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:417:        console.warn('[shadow-evaluation-runtime] skipped cycle: embedding model not ready');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:424:      console.warn('[shadow-evaluation-runtime] skipped cycle: no recent search queries available');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:430:      console.warn('[shadow-evaluation-runtime] skipped cycle: no holdout queries produced shadow proposals');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:436:    const cycleId = `shadow-eval-${evaluatedAt}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:441:      (queryId) => replayed.get(queryId)?.shadow ?? [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:452:        `[shadow-evaluation-runtime] cycle ${report.cycleId}: ${report.cycleResult.queryCount} holdout queries, `
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:461:          console.warn('[shadow-evaluation-runtime] threshold tuning skipped/failed:', err);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:469:    console.warn('[shadow-evaluation-runtime] scheduled cycle failed:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:477: * Start the production shadow evaluation scheduler.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:507: * Stop the production shadow evaluation scheduler.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:520: * Check whether the shadow evaluation scheduler is currently running.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:4:// IR metric computation functions extracted from shadow-scoring.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:17:/** Per-result rank delta between live and shadow ranking. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:23:  /** Position in the shadow (learned-signals) ranking (1-based). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:24:  shadowRank: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:25:  /** Signed delta: liveRank - shadowRank (positive = shadow improved). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:35:  /** NDCG delta: shadow NDCG@k minus live NDCG@k. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:37:  /** MRR delta: shadow MRR minus live MRR. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:79: * "improved" means the result ranked higher in shadow (lower rank number).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:80: * delta = liveRank - shadowRank: positive means improvement.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:99: * @param shadowRanks - Map from resultId to shadow rank
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:104:  shadowRanks: Map<string, number>
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:109:    if (shadowRanks.has(id)) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:125:      const shadowDiff = shadowRanks.get(a)! - shadowRanks.get(b)!;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:127:      if (liveDiff * shadowDiff > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:129:      } else if (liveDiff * shadowDiff < 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:213: * Compare live and shadow ranked lists for a single query.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:220: * @param shadowRanked - Results as ranked by shadow (learned-signals) system
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:226:  shadowRanked: RankedItem[]
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:234:  const shadowRankMap = new Map<string, number>();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:235:  for (const item of shadowRanked) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:236:    shadowRankMap.set(item.resultId, item.rank);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:246:    const shadowRank = shadowRankMap.get(item.resultId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:247:    if (shadowRank !== undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:248:      const delta = item.rank - shadowRank; // positive = improved in shadow
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:253:        shadowRank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:264:  const kendallTau = computeKendallTau(liveRankMap, shadowRankMap);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:269:  const shadowJudged = condenseJudgedRanking(shadowRanked);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:273:  const shadowNdcg = computeNDCG(shadowJudged);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:274:  const ndcgDelta = shadowNdcg - liveNdcg;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:278:  const shadowMrr = computeMRR(shadowJudged);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/rank-metrics.ts:279:  const mrrDelta = shadowMrr - liveMrr;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:107: * Log a borderline recommendation to the console (shadow-only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:369:  // shadow-only (auto-merge at >= 0.96 only archives old record).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:396:          // Auto-merge: archive the older memory record (shadow operation —
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:15://   - All results logged to shadow_scoring_log for auditability
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:41:/** Row shape stored in shadow_scoring_log table. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:47:  shadow_rank: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:73:/** Row shape stored in shadow_cycle_results table. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:114:/** Comprehensive report from a shadow evaluation run. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:129: * Check whether shadow feedback evaluation is enabled.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:142:  CREATE TABLE IF NOT EXISTS shadow_scoring_log (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:147:    shadow_rank  INTEGER NOT NULL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:156:  CREATE INDEX IF NOT EXISTS idx_shadow_log_query_id     ON shadow_scoring_log(query_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:157:  CREATE INDEX IF NOT EXISTS idx_shadow_log_cycle_id     ON shadow_scoring_log(cycle_id);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:158:  CREATE INDEX IF NOT EXISTS idx_shadow_log_evaluated_at ON shadow_scoring_log(evaluated_at);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:159:  CREATE INDEX IF NOT EXISTS idx_shadow_log_direction    ON shadow_scoring_log(direction)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:163:  CREATE TABLE IF NOT EXISTS shadow_cycle_results (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:179:  CREATE INDEX IF NOT EXISTS idx_shadow_cycle_evaluated_at ON shadow_cycle_results(evaluated_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:186:/** Track which DB handles have had the shadow-scoring schema initialized. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:190: * Ensure the shadow_scoring_log and shadow_cycle_results tables exist.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:225: * Select a holdout subset of query IDs for shadow evaluation.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:321: * Log rank deltas from a comparison to the shadow_scoring_log table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:344:      INSERT INTO shadow_scoring_log
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:345:        (query_id, result_id, live_rank, shadow_rank, delta, direction, evaluated_at, cycle_id)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:355:        d.shadowRank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:367:    console.warn('[shadow-scoring] logRankDelta error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:373: * Query past shadow scoring evaluations from the log.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:401:    const sql = `SELECT * FROM shadow_scoring_log ${where} ORDER BY evaluated_at DESC ${limit}`;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:405:    console.warn('[shadow-scoring] getShadowScoringHistory error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:415: * Record an aggregated cycle result into the shadow_cycle_results table.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:431:      INSERT OR REPLACE INTO shadow_cycle_results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:451:    console.warn('[shadow-scoring] recordCycleResult error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:468:      SELECT is_improvement FROM shadow_cycle_results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:505:      SELECT * FROM shadow_cycle_results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:534: * evaluations where shadow NDCG@10 >= live NDCG@10 (no regression).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:548:      SELECT is_improvement FROM shadow_cycle_results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:573: * Run an end-to-end shadow evaluation pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:578: *   3. For each holdout query, compute live and shadow ranks via callbacks
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:580: *   5. Log deltas to shadow_scoring_log
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:589: * @param computeShadowRanks - Callback to compute shadow ranking for a query
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:644:      const shadowRanked = computeShadowRanks(qid);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:645:      const comparison = compareRanks(qid, liveRanked, shadowRanked);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:701:    console.warn('[shadow-scoring] runShadowEvaluation error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:8:// records the would-have-been shadow rank alongside the live rank.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:77:/** Record written to batch_learning_log after a shadow-apply cycle. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:85:  shadow_rank_delta: number | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:113:  /** Memories promoted to shadow-apply (met min-support). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:114:  shadowApplied: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:144:    shadow_rank_delta REAL,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:307: * Compute the shadow rank delta for a memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:309: * The shadow delta represents what the importance_weight *would* change to
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:353:export function shadowApply(
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:362:    const shadowDelta = computeShadowRankDelta(db, signal.memoryId, boost);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:366:        (memory_id, batch_run_at, session_count, weighted_score, computed_boost, shadow_rank_delta, promoted)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:374:      shadowDelta
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:380:    console.warn('[batch-learning] shadowApply error:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:423:      shadowApplied:        0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:441:    // Steps 4 + 5: Cap + shadow-apply each eligible signal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:442:    let shadowApplied = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:447:      const logId = shadowApply(db, cappedSignal, runAt);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:448:      if (logId !== null) shadowApplied++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:456:      shadowApplied,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:468:      shadowApplied:        0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:18:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:19:import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:39:} from '../lib/telemetry/eval-channel-tracking.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:40:import type { EvalChannelPayload } from '../lib/telemetry/eval-channel-tracking.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:173:// EvalChannelPayload — now imported from lib/telemetry/eval-channel-tracking.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:218:// resolveEvalScore, collectEvalChannelsFromRow — now imported from lib/telemetry/eval-channel-tracking.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:222:  telemetryPayload: Record<string, unknown>,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:236:      _telemetry: telemetryPayload,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:245:    console.warn('[memory-search] Failed to attach telemetry payload:', message);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:429:// summarizeGraphWalkDiagnostics, buildEvalChannelPayloads — now imported from lib/telemetry/eval-channel-tracking.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:976:        extraData.adaptive_shadow = adaptiveShadow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1177:    const telemetry = retrievalTelemetry.createTelemetry();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1178:    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1180:      telemetry,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1183:    responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/README.md:29:- `memory-search.ts` - L2 hybrid search handler with telemetry and profile support.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts:77:  it('uses the full session_resume payload and records full bootstrap telemetry', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:102:    expect(() => validateFilePathLocal('/home/user/../../../etc/shadow')).toThrow();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:15:// Feature catalog: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325:function getSessionPromptContext(sessionId: string, floor: number = DECAY_FLOOR, limit: number = 5): SessionPromptContextEntry[] {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:349:    console.warn(`[working-memory] getSessionPromptContext error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:379: * Set or update the attention score for a memory in working memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:426:function upsertExtractedEntry(input: ExtractedEntryInput): boolean {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:497:    console.warn(`[working-memory] upsertExtractedEntry error: ${msg}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:514: * Enforce working memory capacity limit by LRU eviction.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:739:  getSessionPromptContext,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:744:  upsertExtractedEntry,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:266:  const inserted = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:353:// In-memory retry telemetry (never persisted to DB — read by getEmbeddingRetryStats)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:214:  // Record bootstrap telemetry once for the composite call.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:303: * Phase C: Get top-N attention-weighted memory IDs from working memory.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:308: * @returns Set of memory IDs with high attention in working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:331:    // Graceful degradation — working memory boost is optional
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:338: * in the attention-weighted working memory set. Re-sorts results by
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:342: * @param attentionIds - Set of memory IDs from working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:343: * @returns Re-sorted trigger matches with working memory boost applied
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:354:  // Apply 1.3x multiplier when memory is in working memory set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:380:    // also appear in the working memory active set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:522:    // Phase 024 / Item 9: Record bootstrap telemetry for MCP auto-priming
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:405:  // Phase 024: Record bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:599:  // Phase 024 / Item 9: Record bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:518:    it('T031-HYB-S4-01: shadow scoring does NOT attach metadata (REMOVED flag)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:528:        const shadowMeta = (results as unknown as Record<string, unknown>)._s4shadow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:529:        expect(shadowMeta).toBeUndefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:36:import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:37:import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1015:  const telemetryMeta = retrievalTelemetry.isExtendedTelemetryEnabled()
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1033:          return { _telemetry: retrievalTelemetry.toJSON(t) };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1070:    ...telemetryMeta,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:261:| [lib/telemetry/README.md](../telemetry/README.md) | Retrieval telemetry (observability, governance) |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:271:| `lib/telemetry/trace-schema.ts` | Trace schema definitions |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md:332:| `missing_provenance` | The row omits normalized reader or telemetry provenance. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:50:  description: '[L2:Core] Search conversation memories semantically using vector similarity. Returns ranked results with similarity scores. Constitutional tier memories are ALWAYS included at the top of results (~2000 tokens max), regardless of query. Requires query (string), concepts (array of 2-5 strings), or cursor (string) for continuation pagination. Supports intent-aware retrieval (REQ-006) with task-specific weight adjustments. When implicit feedback logging is enabled, searches also emit shadow-only feedback signals such as search_shown and, for includeContent runs, result_cited. Token Budget: 3500. For code search by concept/intent, prefer mcp__cocoindex_code__search (CocoIndex). For structural code queries (callers, imports), prefer code_graph_query.',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:77:        description: 'Session identifier for working memory and session deduplication (REQ-001). When provided with enableDedup=true, prevents duplicate memories from being returned in the same session (~50% token savings on follow-up queries).'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:104:        description: 'Include full file content in results. When true, each result includes a "content" field with the memory file contents. This embeds load logic directly in search, eliminating the need for separate load calls. When implicit feedback logging is enabled, includeContent searches also emit shadow-only result_cited events for returned memories.'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:312:      sessionId: { type: 'string', description: 'Optional session identifier for selection telemetry' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:79:    recent_context: [summary],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:80:    user_prompts: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:81:    exchanges: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:82:    toolCalls: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:78:│  Causal lineage      Adaptive fusion    Extended telemetry      │
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:353:| `SPECKIT_EXTENDED_TELEMETRY` | `false` | Controls 4-dimension per-retrieval telemetry. Set to `true` to enable metrics collection. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:354:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | Records the current memory roadmap phase in telemetry, eval baselines, and migration checkpoint metadata. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:588:- Retrieval metrics are emitted when extended telemetry is enabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1065:| v1.x | 2025 | Adaptive fusion, extended telemetry, artifact-class routing, append-only mutation ledger, typed retrieval contracts. Semantic search, trigger matching, intent-aware context, session deduplication. |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:4:// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:10: * Adaptive feedback channels that influence shadow ranking proposals.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:27: * Ranking deltas for one memory under production and shadow scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:32:  shadowScore: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:34:  shadowRank: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:39: * Bounded shadow-ranking proposal derived from accumulated adaptive signals.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:42:  mode: 'shadow' | 'promoted';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:63:  shadowRunCount: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:64:  latestShadowMode: 'shadow' | 'promoted' | null;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:329: * Resolve whether adaptive ranking is disabled, shadow-only, or promoted.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:333:export function getAdaptiveMode(): 'shadow' | 'promoted' | 'disabled' {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:336:  return mode === 'promoted' ? 'promoted' : 'shadow';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:340: * Ensure the adaptive signal and shadow-run tables exist before use.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:377:    CREATE TABLE IF NOT EXISTS adaptive_shadow_runs (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:420: * Clear adaptive signal history and shadow-run snapshots for rollback drills.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:423: * @returns Counts for deleted signal and shadow-run rows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:432:    const clearedRuns = database.prepare('DELETE FROM adaptive_shadow_runs').run().changes;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:516: * @returns Aggregate signal counts, totals, and shadow-run coverage.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:563:  const shadowRunCountRow = database.prepare(`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:565:    FROM adaptive_shadow_runs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:569:    FROM adaptive_shadow_runs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:578:    shadowRunCount: typeof shadowRunCountRow?.count === 'number' ? shadowRunCountRow.count : 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:579:    latestShadowMode: latestShadowRun?.mode === 'shadow' || latestShadowRun?.mode === 'promoted'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:589: * Tune adaptive thresholds after reviewing the current shadow signal set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:715: * Build a bounded shadow-ranking proposal for a production result set.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:719: * @param results - Ranked production rows to evaluate in shadow mode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:743:  const shadow = production.map((row) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:747:      shadowScore: Math.max(0, Math.min(1, row.score + delta)),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:751:    { ...a, score: a.shadowScore } as Record<string, unknown> & { id: number },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:752:    { ...b, score: b.shadowScore } as Record<string, unknown> & { id: number },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:763:  const rows: AdaptiveShadowProposalRow[] = shadow.map((row, index) => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:766:    shadowScore: row.shadowScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:768:    shadowRank: index + 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:774:      (row) => row.shadowRank < row.productionRank
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:780:      (row) => row.shadowRank > row.productionRank
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:796:  // B19: Retain only the last 50 shadow runs.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:800:      INSERT INTO adaptive_shadow_runs (query, mode, bounded, max_delta_applied, proposal_json)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:804:    // B19: Retention — keep only the last 50 shadow run rows.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:806:      DELETE FROM adaptive_shadow_runs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts:808:        SELECT id FROM adaptive_shadow_runs ORDER BY id DESC LIMIT 50
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:333:    mockGetAdaptiveMode.mockReturnValue('shadow');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:5:// proposal generation, shadow evaluation, threshold tuning, and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:22:} from '../lib/feedback/shadow-scoring.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:23:import { runScheduledShadowEvaluationCycle } from '../lib/feedback/shadow-evaluation-runtime.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:25:import { initConsumptionLog } from '../lib/telemetry/consumption-logger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:74:    shadowRank: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:75:    shadowScore: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:79:    .sort((left, right) => left.shadowRank - right.shadowRank)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:82:      rank: row.shadowRank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:83:      relevanceScore: row.shadowScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:148:    expect(proposal?.mode).toBe('shadow');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:175:    expect(db.prepare('SELECT COUNT(*) AS count FROM shadow_scoring_log').get()).toEqual({ count: 3 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:176:    expect(db.prepare('SELECT COUNT(*) AS count FROM shadow_cycle_results').get()).toEqual({ count: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:214:    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:239:    expect(row1?.shadowScore).toBeGreaterThan(row1?.productionScore ?? 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:241:    expect(row2?.shadowScore).toBeLessThan(row2?.productionScore ?? 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:277:  it('replays shadow evaluation with real proposal deltas and feedback-driven promotion tuning', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:597:// Add/update memory in working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:600:// Get working memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:1052:| `SPECKIT_WORKING_MEMORY`  | true    | Enable working memory sessions          |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:273:        'specs/099-shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-save-extended.vitest.ts:278:        'hash-shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:15:// Session/working memory   → Linear decay (working-memory.ts) — separate domain
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-checkpoints.vitest.ts:11:import { initConsumptionLog } from '../lib/telemetry/consumption-logger';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:140:  shadowScore: vi.fn(() => null),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:26:/** Rollout defaults snapshot for telemetry and migration checkpoints. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:167:/** Returns defaults consumed by telemetry/checkpoint paths for phase tracking. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:90:- Purpose: Owns the memory-science side of the system: decay, retrievability, working memory, co-activation, pressure monitoring, archival movement, and adaptive ranking inputs. It is the main "how memory behaves over time" module family.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:126:  - `lib/telemetry/*`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:135:  - `../../shared/contracts/retrieval-trace.ts` — canonical shared contract implementation referenced by retrieval and telemetry code.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:153:- Purpose: Owns evaluation, baselines, shadow measurements, quality proxies, and reporting artifacts for retrieval quality. It is the measurement and experimentation layer for search behavior.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:157:  - `shadow-scoring.ts` — side-by-side scoring comparison support.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:181:- Purpose: Owns implicit-feedback capture, shadow-feedback evaluation, ranking-comparison metrics, and batch-learning helpers used to measure learned-signal quality without mutating live rankings.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:183:  - `feedback-ledger.ts` — shadow-only feedback event ledger and query helpers.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:184:  - `shadow-scoring.ts` — holdout evaluation and promotion-gate logic for learned feedback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:185:  - `batch-learning.ts` — weekly aggregation and shadow-apply cycle for learned feedback.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:364:### `telemetry/`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:366:- Purpose: Owns structured observability for retrieval and scoring behavior: trace sanitization, retrieval telemetry, scoring observability, and consumption logging. It is intended to observe domain modules rather than drive domain decisions.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:368:  - `retrieval-telemetry.ts` — retrieval-run telemetry factory and quality-proxy metrics.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:372:  - `README.md` — telemetry scope and flag overview.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:464:| `telemetry` | `09--evaluation-and-measurement`, `11--scoring-and-calibration`, `17--governance`, `18--ux-hooks` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:480:| `09--evaluation-and-measurement` | `eval`, `telemetry` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:482:| `11--scoring-and-calibration` | `cognitive`, `config`, `feedback`, `learning`, `manage`, `scoring`, `search`, `telemetry` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:488:| `17--governance` | `collab`, `config`, `extraction`, `governance`, `storage`, `telemetry` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:489:| `18--ux-hooks` | `errors`, `response`, `telemetry`, `utils` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:543:- `telemetry`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:554:- `telemetry` should accept trace/metric payloads from `search`, `scoring`, or handlers, but not import retrieval logic from them.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:614:  - Must not import: `search`, `storage`, `telemetry`, handlers
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:626:  - May import: core, `search`, `scoring`, `telemetry`, `storage`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:647:- `scoring -> telemetry`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:649:- `telemetry -> search`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/MODULE_MAP.md:657:- `telemetry/retrieval-telemetry.ts -> search/session-transition.ts`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-triggers.vitest.ts:12:import * as consumptionLogger from '../lib/telemetry/consumption-logger';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:3:description: "Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline."
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:5:  - "retrieval telemetry"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:15:> Retrieval telemetry, scoring observability, trace schema validation, and consumption logging for the MCP server pipeline.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:35:The telemetry module provides structured observability for the retrieval pipeline and scoring subsystem. It records per-stage latency, search mode selection, fallback triggers, composite quality scores, scoring observation samples, trace payload validation, and agent consumption events. Telemetry data flows to governance tooling and is used by retrieval handlers to surface pipeline health metrics.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:41:| Modules | 4 | `retrieval-telemetry.ts`, `scoring-observability.ts`, `trace-schema.ts`, `consumption-logger.ts` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:66:telemetry/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:67:├── retrieval-telemetry.ts    # Telemetry interfaces, types, and collection utilities
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:78:| `retrieval-telemetry.ts` | Defines `RetrievalTelemetry`, `LatencyMetrics`, `ModeMetrics`, `FallbackMetrics`, `QualityMetrics`, `ArchitectureMetrics`, `GraphHealthMetrics`, `AdaptiveMetrics`, `GraphWalkDiagnostics`, `LifecycleForecastDiagnostics`, and transition diagnostics support; exposes collection helpers |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:95:| `SPECKIT_MEMORY_ROADMAP_PHASE` | `shared-rollout` | Record the active memory-roadmap phase in telemetry/checkpoint metadata. Unsupported values fall back to `shared-rollout` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:96:| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:97:| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata; distinct from live `SPECKIT_GRAPH_UNIFIED` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:98:| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | Default-off roadmap capability flag surfaced in telemetry metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:99:| `SPECKIT_MEMORY_SCOPE_ENFORCEMENT` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:100:| `SPECKIT_MEMORY_GOVERNANCE_GUARDRAILS` | `true` | Default-on roadmap capability flag surfaced in telemetry metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:101:| `SPECKIT_MEMORY_SHARED_MEMORY` | `false` | Default-off roadmap capability flag surfaced in telemetry metadata |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:116:| `enabled` | `boolean` | Whether extended telemetry collection is enabled |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:124:| `adaptive` | `AdaptiveMetrics` | Adaptive shadow/promoted evaluation summary for the run |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:127:| `lifecycleForecastDiagnostics` | `LifecycleForecastDiagnostics \| undefined` | Optional ingest forecast diagnostics captured when lifecycle telemetry instrumentation is enabled |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:187:**Purpose**: Capture memory-roadmap phase and capability state for architectural telemetry.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:214:| `mode` | `'shadow' \| 'promoted' \| 'disabled'` | Adaptive evaluation mode for the run |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:236:**Purpose**: Persist the spec-shaped session transition trace contract into retrieval telemetry when trace-enabled search paths emit transition metadata.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:248:**Purpose**: Capture optional ingest lifecycle forecast telemetry without making forecast generation a blocking path.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:344:} from './retrieval-telemetry';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:375:const telemetry: RetrievalTelemetry = {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:392:  telemetry.latency = collectLatencyMetrics(stages);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:393:  telemetry.quality = computeQualityScore(results, requestedLimit, telemetry.latency.totalLatencyMs);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:395:  // Minimal telemetry only
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:396:  telemetry.enabled = false;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:471:| `handlers/memory-search.ts` | Primary integration point for telemetry collection |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:472:| `handlers/memory-context.ts` | Secondary integration point for telemetry collection |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:60:      "expectedResultDescription": "Should surface sprint-0 baseline measurement (T000a) which records graphHitRate=0, and any related spec memories about graph channel initialization or telemetry gaps.",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:75:      "query": "what is the relationship between the working memory system and event decay",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:585:      "query": "SPECKIT_SESSION_BOOST working memory attention",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:855:      "query": "I want to add telemetry tracking to the hybrid search pipeline",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:860:      "expectedResultDescription": "Should surface retrieval-telemetry.ts, trace-schema.ts, and any spec about the eval logging framework (T005).",
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:7:// walk diagnostics for telemetry.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:132: * Summarize graph walk diagnostics from result rows for telemetry.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:30: * Extended telemetry controlled by env var (default: disabled for performance).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:61:/** Mode selection telemetry */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:69:/** Fallback telemetry */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:76:/** Quality proxy telemetry */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:86:/** Architecture rollout telemetry for phased memory-roadmap capabilities. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:103:  mode: 'shadow' | 'promoted' | 'disabled';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:156:/** Full retrieval telemetry record */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:477: * Compute a 0-1 quality proxy score from the telemetry record.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:480: * so eval metrics and live telemetry use the same formula. Telemetry-specific
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:280: * Stage 2 integration hook: handlers can surface this snapshot in telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:61:  toolCalls: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:198:  let toolCalls = 1; // session_bootstrap
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:215:    toolCalls += 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:222:      toolCalls += 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:226:      toolCalls += 2;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:231:    toolCalls += 1;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:266:      toolCalls,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:269:      total: toolCalls + steps + fieldsResolved,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/trace-schema.ts:6:// Used by telemetry serialization. Unknown or sensitive fields are
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:11:import { shouldSample, logScoringObservation } from '../telemetry/scoring-observability.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:528: * observability telemetry to an already-computed weighted composite score.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:534: * @param row        Scoring input row (used for doc type, interference, telemetry)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:548:  // Capture pre-penalty composite for telemetry (before interference + clamp)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:45:} from '../lib/eval/shadow-scoring';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:562:        'shadow test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:565:          algorithmName: 'shadow-v2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:566:          shadowScoringFn: () => [{ memoryId: 1, score: 0.95, rank: 1 }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:580:        query: 'shadow test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:581:        algorithmName: 'shadow-v2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:585:          shadowCount: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:591:          shadowOnlyIds: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:656:      query: 'shadow test',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:657:      algorithmName: 'shadow-v2',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:661:        shadowCount: 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:667:        shadowOnlyIds: [],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:689:    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:698:    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:703:  it('S4-INT-17: All graduated flags enabled simultaneously (shadow scoring REMOVED)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:710:    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts:759:    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:33:- Reporting dashboard and read-only shadow comparison analysis.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:54:| `shadow-scoring.ts` | Read-only shadow comparison helpers and holdout analysis |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md:64:- `shadow-scoring.ts` retains comparison and analysis helpers, but the legacy write path is retired; the module is now effectively read-only analysis support.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:12:} from '../lib/feedback/shadow-scoring.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:13:import { initConsumptionLog } from '../lib/telemetry/consumption-logger.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:19:} from '../lib/feedback/shadow-evaluation-runtime.js';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:107:describe('shadow-evaluation-runtime', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:109:  let shadowFlag: string | undefined;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:112:    shadowFlag = process.env.SPECKIT_SHADOW_FEEDBACK;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:131:    if (shadowFlag === undefined) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:134:      process.env.SPECKIT_SHADOW_FEEDBACK = shadowFlag;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:155:          mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:162:            { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.4, shadowScore: 0.9, scoreDelta: 0.5 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:163:            { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.6, shadowScore: 0.5, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:169:        mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:176:          { memoryId: 22, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.95, scoreDelta: 0.45 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:177:          { memoryId: 21, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:232:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:239:        { memoryId: 32, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:240:        { memoryId: 31, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:281:    vi.mocked(getAdaptiveMode).mockReturnValue('shadow');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:288:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:295:        { memoryId: 42, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:296:        { memoryId: 41, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:316:    vi.mocked(getAdaptiveMode).mockReturnValue('shadow');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:323:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:330:        { memoryId: 52, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:331:        { memoryId: 51, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:360:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:367:        { memoryId: 52, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:368:        { memoryId: 51, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:409:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:416:        { memoryId: 62, productionRank: 2, shadowRank: 1, productionScore: 0.5, shadowScore: 0.9, scoreDelta: 0.4 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:417:        { memoryId: 61, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.6, scoreDelta: -0.1 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:435:        '[shadow-evaluation-runtime] threshold tuning skipped/failed:',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:457:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:464:        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:465:        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:492:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:499:        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:500:        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:526:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:533:        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:534:        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:535:        { memoryId: 13, productionRank: 3, shadowRank: 3, productionScore: 0.4, shadowScore: 0.2, scoreDelta: 0 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:570:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:577:        { memoryId: 12, productionRank: 2, shadowRank: 1, productionScore: 0.6, shadowScore: 0.9, scoreDelta: 0.3 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:578:        { memoryId: 11, productionRank: 1, shadowRank: 2, productionScore: 0.7, shadowScore: 0.5, scoreDelta: -0.2 },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:121:  it('records bootstrap telemetry for full resume requests', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-resume.vitest.ts:126:  it('skips bootstrap telemetry and includes sessionQuality in minimal mode', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:417:    // Pre-populate audit table with an old entry to bypass the 7-day shadow period (Safeguard #6)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:426:        shadow_mode INTEGER NOT NULL DEFAULT 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:430:      'INSERT INTO learned_feedback_audit (memory_id, action, terms, timestamp, source, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:478:  it('R11-CO04: recordSelection is log-only during shadow period (no learned trigger persistence)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:479:    // Force shadow mode by replacing the bootstrap entry with a recent timestamp.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:482:      'INSERT INTO learned_feedback_audit (memory_id, action, terms, timestamp, source, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:485:    const result = recordSelection('q-shadow-core', 1, ['authentication'], 5, testDb);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:487:    expect(result.reason).toBe('shadow_period');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:495:    // Audit still records the event and marks it as shadow mode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:497:    const shadowEntry = audit.find((a) => a.source === 'q-shadow-core');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:498:    expect(shadowEntry).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:499:    expect(shadowEntry!.shadowMode).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:553:  it('R11-CO09: shadow period enforced — queryLearnedTriggers returns empty during first 7 days', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:554:    // Replace the old audit entry with a very recent one to trigger shadow period
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:557:      'INSERT INTO learned_feedback_audit (memory_id, action, terms, timestamp, source, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:562:    // Safeguard #6 — shadow period enforced for first 7 days
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:695:  it('R11-AL04: audit entries set shadow mode true during shadow period', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:696:    recordSelection('q-shadow', 1, ['authentication'], 5, testDb);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:699:    const entry = audit.find((a) => a.source === 'q-shadow');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts:701:    expect(entry!.shadowMode).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:10:  shadowApply,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:42:  // Minimal memory_index table for shadow delta tests
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:432:describe('Batch Learning — shadowApply', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:440:    const id = shadowApply(db, signal, BASE_TS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:451:    shadowApply(db, signal, BASE_TS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:468:    shadowApply(db, signal, BASE_TS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:473:  it('does NOT modify memory_index importance_weight (shadow-only)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:482:    shadowApply(db, signal, BASE_TS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:521:    expect(result.shadowApplied).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:526:  it('processes events and shadow-applies when flag is ON and min-support met', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:543:    expect(result.shadowApplied).toBeGreaterThanOrEqual(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:564:    expect(result.shadowApplied).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:605:    expect(result.shadowApplied).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:660:    shadowApply(db, signal, BASE_TS + 1000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:661:    shadowApply(db, signal, BASE_TS + 2000);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:662:    shadowApply(db, signal, BASE_TS + 500);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:687:    shadowApply(db, signal, BASE_TS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:688:    shadowApply(db, { ...signal, memoryId: 'y' }, BASE_TS);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/batch-learning.vitest.ts:704:  it('runBatchLearning result has shadow-only fields (no live mutation fields)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:14:} from '../lib/telemetry/trace-schema';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:221:  it('telemetry schema exports expected canonical retrieval stages', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:119:describe('Phase 4 adaptive ranking shadow proposals', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:386:  it('records bounded shadow proposals without mutating production order', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:401:    expect(proposal?.mode).toBe('shadow');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:404:    expect(proposal?.rows.some((row) => row.memoryId === 2 && row.shadowRank === 1)).toBe(true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:407:  it('clears adaptive shadow state during rollback drills without reversing schema', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:425:    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 1 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:438:    expect(db.prepare('SELECT COUNT(*) AS count FROM adaptive_shadow_runs').get()).toEqual({ count: 0 });
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:472:      shadowRunCount: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:725:      shadowRank: 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:5:// Production output. Logs both production and shadow scores for A/B comparison.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:8:// - Run alternative scoring algorithms in shadow mode
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:9:// - Compare shadow vs production results
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:11:// - Comparison summaries for production vs shadow output
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:24:/** A single scored result from either production or shadow path. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:35: * Configuration for shadow scoring.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:36: * The shadowScoringFn receives the query and production results and
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:40:  /** Human-readable name for this shadow algorithm (e.g. "rrf-v2", "weighted-bm25"). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:43:   * The alternative scoring function to run in shadow mode.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:47:  shadowScoringFn: (query: string, productionResults: ScoredResult[]) => ScoredResult[] | Promise<ScoredResult[]>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:52:/** Per-result comparison between production and shadow scores. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:57:  shadowScore: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:58:  shadowRank: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:59:  /** shadow score - production score */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:61:  /** shadow rank - production rank (negative = promoted in shadow) */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:65:/** Comparison metrics between production and shadow scoring. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:71:  /** Name of the shadow algorithm. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:81:/** Summary statistics for a shadow comparison. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:85:  /** Number of results in shadow. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:86:  shadowCount: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:95:  /** IDs only in production (not in shadow). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:97:  /** IDs only in shadow (not in production). */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:98:  shadowOnlyIds: number[];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:101:/** Aggregated shadow scoring statistics over a time range. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:103:  /** Total number of shadow comparisons logged. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:120:  CREATE TABLE IF NOT EXISTS eval_shadow_comparisons (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:126:    shadow_count INTEGER NOT NULL DEFAULT 0,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:153: * Ensure the shadow comparisons table exists.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:194:  shadow: ScoredResult[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:196:  const shadowMap = buildResultMap(shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:201:    const s = shadowMap.get(p.memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:235: * Run an alternative scoring algorithm in shadow mode alongside production results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:238: * for compatibility only, so this returns null without running the shadow function.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:244: * @param shadowConfig - Configuration including the shadow scoring function.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:251:  shadowConfig: ShadowConfig,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:255:  void shadowConfig;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:260: * Compute comparison metrics between production and shadow results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:267: * @param shadow - Shadow scored results.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:268: * @param algorithmName - Name of the shadow algorithm.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:275:  shadow: ScoredResult[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:280:    return _compareShadowResultsImpl(query, production, shadow, algorithmName, metadata);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:282:    console.warn('[shadow-scoring] compareShadowResults failed (non-fatal):', err instanceof Error ? err.message : String(err));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:288:      summary: { productionCount: production.length, shadowCount: shadow.length, overlapCount: 0, meanAbsScoreDelta: 0, meanAbsRankDelta: 0, rankCorrelation: 0, productionOnlyIds: [], shadowOnlyIds: [] },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:297:  shadow: ScoredResult[],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:302:  const shadowMap = buildResultMap(shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:307:  const shadowIds = new Set(shadow.map(r => r.memoryId));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:312:    const s = shadowMap.get(memoryId);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:322:        shadowScore: sScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:323:        shadowRank: sRank,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:331:  const productionOnlyIds = [...prodIds].filter(id => !shadowIds.has(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:332:  const shadowOnlyIds = [...shadowIds].filter(id => !prodIds.has(id));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:343:  const rankCorrelation = computeRankCorrelation(production, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:347:    shadowCount: shadow.length,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:353:    shadowOnlyIds,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:367: * Persist a shadow comparison to the eval database.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:382: * Retrieve aggregated shadow scoring statistics over an optional time range.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:423:      FROM eval_shadow_comparisons
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:448:      FROM eval_shadow_comparisons
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:466:    console.warn('[shadow-scoring] getShadowStats failed (non-fatal):', msg);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:16:} from '../lib/telemetry/retrieval-telemetry';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:37:  it('serializes graph-health and adaptive telemetry contracts', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:39:    const telemetry = createTelemetry();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:41:    recordGraphHealth(telemetry, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:49:    recordAdaptiveEvaluation(telemetry, {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:50:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:57:    const payload = toJSON(telemetry);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:67:      mode: 'shadow',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/graph-roadmap-finalization.vitest.ts:75:  it('summarizes graph-health dashboard metrics across telemetry payloads', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:417:  it('upsertExtractedEntry stores provenance fields', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:426:      const ok = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:449:  it('upsertExtractedEntry avoids legacy COUNT existence probes and relies on conflict handling', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:466:      const first = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:475:      const second = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:499:  it('upsertExtractedEntry conflict-update overwrites on same key', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:508:      const first = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:519:      const second = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/working-memory.vitest.ts:559:      const inserted = workingMemory.upsertExtractedEntry({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:116:    it('T213-01: Checkpoint created with working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:135:    it('T213-02: Snapshot contains correct working memory data', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:182:  describe('clearExisting clears and restores working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:183:    it('T213-06: clearExisting removed non-checkpoint working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-working-memory.vitest.ts:217:  describe('Checkpoint with empty working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts:66:  '06-6-debug-and-telemetry.md',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:242:  it('status emits optional lifecycle telemetry when extended telemetry is enabled', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:266:    const telemetry = data._telemetry as Record<string, unknown>;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:268:    expect(telemetry).toBeDefined();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts:269:    expect((telemetry.lifecycleForecastDiagnostics as Record<string, unknown>)).toEqual({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:17:} from '../lib/eval/shadow-scoring';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:37:      const shadow: ScoredResult[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:46:        shadow,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:55:      expect(comparison.summary.shadowOnlyIds).toHaveLength(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:58:    it('identifies production-only and shadow-only results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:60:      const shadow: ScoredResult[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:68:        shadow,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:75:      expect(comparison.summary.shadowOnlyIds).toContain(4);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:80:      const shadow = makeResults([1, 2, 3, 4, 5]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:85:        shadow,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:94:      const shadow: ScoredResult[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:103:        shadow,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:120:      expect(comparison.summary.shadowOnlyIds).toHaveLength(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:123:    it('handles empty shadow results', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:131:      expect(comparison.summary.shadowCount).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:141:      const shadow: ScoredResult[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:149:        shadow,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:181:    it('returns null when shadow scoring is disabled', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:186:        shadowScoringFn: () => makeResults([1, 2, 3]),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:198:        shadowScoringFn: (_query, results) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:211:    it('does NOT call shadow scoring function (REMOVED flag)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:219:        shadowScoringFn: (_query, results) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:235:    it('returns null for async shadow scoring functions (REMOVED flag)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:240:        shadowScoringFn: async (_query, results) => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:250:    it('returns null on shadow scoring function error (REMOVED flag — always null)', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:255:        shadowScoringFn: () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring.vitest.ts:271:      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shadow-test-'));
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:31:  'hooks/memory-surface.js': 520,   // actual: 503 — Memory surface hooks with constitutional cache, auto-surface, attention-enriched hints, priming, session snapshots, and Phase 024 bootstrap telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dead-code-regression.vitest.ts:7:import * as shadowScoring from '../lib/eval/shadow-scoring';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/dead-code-regression.vitest.ts:26:  ['../lib/eval/shadow-scoring', shadowScoring as Record<string, unknown>],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:31:- Core cognitive behavior such as attention decay, working memory, co-activation, and tier handling.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/README.md:86:| Eval and reporting | `ablation-framework.vitest.ts`, `bm25-baseline.vitest.ts`, `reporting-dashboard.vitest.ts`, `eval-logger.vitest.ts`, `memory-state-baseline.vitest.ts` | Baselines, ablations, dashboard, and telemetry |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:42:| Module Categories | 29 | architecture, cache, chunking, code-graph, cognitive, collab, config, contracts, errors, eval, extraction, feedback, governance, graph, interfaces, learning, manage, ops, parsing, providers, response, scoring, search, session, spec, storage, telemetry, utils, validation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:43:| Cognitive Features | 10+ | FSRS scheduler, attention decay, PE gating, working memory, tier classification, co-activation, temporal contiguity, archival manager, causal graph, corrections |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:55:| **Cognitive Memory** | Human-like memory features including attention decay, working memory and co-activation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:175:│   ├── working-memory.ts       # Session working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:268:├── telemetry/                  # Retrieval telemetry metrics (4 modules)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:269:│   ├── consumption-logger.ts   # Selection and usage telemetry
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:270:│   ├── retrieval-telemetry.ts  # Latency, mode, fallback and quality metrics
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:289:│   └── shadow-scoring.ts       # Shadow evaluation and promotion gating
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:390:// HOT (R >= 0.80)      - Active working memory, full content
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/README.md:723:| [Cognitive Modules](./cognitive/) | Attention decay, working memory, co-activation |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:122:    expect(playbookContent).toContain('### 121 | Adaptive shadow proposal and rollback (Phase 4)');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/feedback-ledger.vitest.ts:455:describe('Feedback Event Ledger — shadow-only guarantee', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:264:        /initScoringObservability\s*}\s*from\s*['"]\.\/lib\/telemetry\/scoring-observability\.js['"]/
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:408:      '../lib/feedback/shadow-evaluation-runtime',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:419:      '../lib/telemetry/scoring-observability',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:698:      vi.doMock('../lib/telemetry/scoring-observability', () => ({ initScoringObservability: vi.fn() }))
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:732:      vi.doMock('../lib/feedback/shadow-evaluation-runtime', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:1278:    it('T000ja: malformed JSON in appendAutoSurfaceHints logs warning telemetry', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:17:} from '../lib/telemetry/retrieval-telemetry';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:82:/** Create a telemetry object with enabled=true for testing recording mechanics. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:89:describe('C136-12: retrieval-telemetry', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:105:  // T01: Default telemetry object structure
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:414:    const tracePayload = expectPresent(json.tracePayload, 'Expected trace payload in telemetry JSON');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:425:  it('T11b: toJSON excludes non-canonical telemetry fields', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:452:    const tracePayload = expectPresent(json.tracePayload, 'Expected trace payload in telemetry JSON');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:527:  it('T12c: lifecycle forecast diagnostics clamp and serialize ingest telemetry', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:131:/** Non-enumerable shadow metadata attached to result arrays via Object.defineProperty. */
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:133:  _s4shadow?: unknown;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1379:  const shadowMeta = initialResults as HybridSearchResult[] & ShadowMetaArray;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1380:  const s4shadowMeta = shadowMeta._s4shadow;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1381:  const s4attributionMeta = shadowMeta._s4attribution;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1382:  const degradationMeta = shadowMeta._degradation;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1561:  // Non-enumerable array shadow properties.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1573:          ...(s4shadowMeta !== undefined ? { stage4: s4shadowMeta } : {}),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1648:  if (s4shadowMeta !== undefined && reranked.length > 0) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1649:    Object.defineProperty(reranked, '_s4shadow', {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1650:      value: s4shadowMeta,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:11:import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:565:      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:679:      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:710:      vi.spyOn(workingMemory, 'getSessionPromptContext').mockReturnValue([
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:794:    it('keeps successful retrievals when telemetry assembly throws', async () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:797:        throw new Error('telemetry exploded');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:803:        'telemetry-failsafe'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:809:      expect(parsed.meta).not.toHaveProperty('_telemetry');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:2:// Ridge regression, LOOCV, SHAP, model persistence, shadow scoring,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:15:  shadowScore,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:622:  describe('shadowScore', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:627:      const result = shadowScore(model, features, 0.7, false);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:634:      const result = shadowScore(null, features, 0.7, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:643:      const result = shadowScore(model, features, manualScore, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:657:      const result = shadowScore(model, features, 0.3, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:692:    it('shadowScore returns null when flag OFF (no overhead)', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:698:      const result = shadowScore(model, features, 0.7, enabled);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:706:    it('full pipeline: train, predict, LOOCV, SHAP, persist, shadow', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:740:      const shadow = shadowScore(loaded!, testFeatures, 0.5, true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:741:      expect(shadow).not.toBeNull();
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/learned-combiner.vitest.ts:742:      expect(shadow!.learnedScore).toBe(pred);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:59:  'adaptive_shadow_runs',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:141:      shadow_mode INTEGER NOT NULL DEFAULT 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:183:    CREATE TABLE IF NOT EXISTS adaptive_shadow_runs (
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:352:    INSERT INTO learned_feedback_audit (id, memory_id, action, terms, source, timestamp, shadow_mode)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:406:    INSERT INTO adaptive_shadow_runs (id, query, mode, bounded, max_delta_applied, proposal_json, created_at)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts:408:  `).run(1, 'checkpoint completeness', 'shadow', 1, 0.25, '{"proposal":"seed"}', later);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:51:} from '../lib/feedback/shadow-scoring';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:62:    `shadow-scoring-test-${Date.now()}-${Math.random().toString(36).slice(2)}.sqlite`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:299:    const shadow = new Map([['a', 1], ['b', 2], ['c', 3]]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:300:    expect(computeKendallTau(live, shadow)).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:305:    const shadow = new Map([['a', 3], ['b', 2], ['c', 1]]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:306:    expect(computeKendallTau(live, shadow)).toBe(-1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:311:    const shadow = new Map([['a', 1]]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:312:    expect(computeKendallTau(live, shadow)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:317:    const shadow = new Map([['c', 1], ['d', 2]]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:318:    expect(computeKendallTau(live, shadow)).toBe(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:325:    const shadow = new Map([['a', 1], ['c', 2], ['b', 3], ['d', 4]]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:327:    const tau = computeKendallTau(live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:335:    const shadow = new Map([['a', 1], ['b', 2], ['c', 3]]);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:338:    const tau = computeKendallTau(live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:481:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:487:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:492:    // 'a': live=1, shadow=2 → delta=-1 → degraded
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:495:    expect(deltaA.shadowRank).toBe(2);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:499:    // 'b': live=2, shadow=1 → delta=1 → improved
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:504:    // 'c': live=3, shadow=3 → delta=0 → unchanged
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:512:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:519:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:528:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:534:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:544:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:549:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:559:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:564:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:565:    // liveMRR = 0.5, shadowMRR = 1.0, delta = 0.5
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:575:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:581:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:605:    const shadow = makeRankedItems(['a', 'b']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:606:    const result = compareRanks('q1', [], shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:614:  it('handles empty shadow list', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:624:    const shadow: RankedItem[] = [{ resultId: 'a', rank: 1, relevanceScore: 1 }];
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:626:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:634:    const shadow: RankedItem[] = [
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:639:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:674:        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('shadow_scoring_log', 'shadow_cycle_results') ORDER BY name"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:677:      expect(tables.map(t => t.name)).toEqual(['shadow_cycle_results', 'shadow_scoring_log']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:686:          { resultId: 'r1', liveRank: 1, shadowRank: 2, delta: -1, direction: 'degraded' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:687:          { resultId: 'r2', liveRank: 2, shadowRank: 1, delta: 1, direction: 'improved' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:688:          { resultId: 'r3', liveRank: 3, shadowRank: 3, delta: 0, direction: 'unchanged' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:710:      expect(improved!.shadow_rank).toBe(1);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:721:          { resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:763:          { resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:770:          { resultId: 'r2', liveRank: 1, shadowRank: 2, delta: -1, direction: 'degraded' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:793:          { resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:794:          { resultId: 'r2', liveRank: 2, shadowRank: 2, delta: 0, direction: 'unchanged' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:795:          { resultId: 'r3', liveRank: 3, shadowRank: 3, delta: 0, direction: 'unchanged' },
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1297:    let shadowCallCount = 0;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1304:      shadowCallCount++;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1316:    expect(shadowCallCount).toBe(3);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1325:    expect(tableNames).toContain('shadow_scoring_log');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1326:    expect(tableNames).toContain('shadow_cycle_results');
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1354:  it('compareRanks handles disjoint live and shadow sets', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1356:    const shadow = makeRankedItems(['d', 'e', 'f']);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1358:    const result = compareRanks('q1', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1395:      deltas: [{ resultId: 'r1', liveRank: 1, shadowRank: 1, delta: 0, direction: 'unchanged' }],
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1450:    // Reverse the shadow order
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1451:    const shadow = makeRankedItems([...ids].reverse());
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shadow-scoring-holdout.vitest.ts:1453:    const result = compareRanks('q-large', live, shadow);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:16:// 6. 1-week shadow period -- log but don't apply for first week
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:56:  shadowMode: boolean;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:111:    shadow_mode INTEGER NOT NULL DEFAULT 0
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:247: * 5. Applies or logs depending on shadow period (Safeguard #6)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:314:    const shadowMode = isInShadowPeriod(db);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:321:      'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:322:    ).run(memoryId, 'add', JSON.stringify(terms), queryId, now, shadowMode ? 1 : 0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:325:    if (shadowMode) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:326:      return { terms, applied: false, reason: 'shadow_period' };
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:415: * Check if the system is still within the 1-week shadow period (Safeguard #6).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:420: * @returns true if still in shadow period (boosts should NOT be applied)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:430:      // No audit entries yet — system is brand new, treat as shadow period
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:437:    // On error, be conservative: assume shadow period to avoid premature boosting
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:461:    // Safeguard #6 — 1-week shadow period. Compute earliest audit timestamp;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:543:          'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:591:          'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:655:      shadow_mode: number;
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts:664:      shadowMode: row.shadow_mode === 1,
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:49:  it('resume session continues event_counter and preserves working memory items', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:14:// set by default.  Set SPECKIT_HYDE_ACTIVE=false to revert to shadow
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:108: * HyDE active mode (graduate from shadow to full merge).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:356: * In shadow mode (SPECKIT_HYDE_ACTIVE=false): results are logged but
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:364: * @returns Array of PipelineRow candidates (empty in shadow mode).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:379: * Execute HyDE in shadow mode: run the full HyDE retrieval pipeline
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:392: * @returns PipelineRow[] to merge (empty array in shadow mode or on failure).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts:418:        `[hyde] shadow results: ${candidates.length} candidates for query "${query}" ` +
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:4:// Tests for lib/telemetry/consumption-logger.ts
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:20:} from '../lib/telemetry/consumption-logger';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:74:    // Init working memory module first (creates working_memory table)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:103:  describe('T302-GAP2a: completeSession() clears working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:104:    it('T302-04 to T302-06: completeSession() clears working memory entries', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:107:      // Setup: seed working memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:118:      // Call completeSession — should clear working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:122:      // Verify working memory entries are gone
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:132:  describe('T302-GAP2b: clearSession() clears working memory', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:133:    it('T302-07 to T302-10: clearSession() clears both working memory and sent_memories', () => {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:136:      // Seed working memory entries
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:149:      // Call clearSession — should clear both sent_memories AND working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-cleanup.vitest.ts:153:      // Verify working memory entries are gone
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:463: * REQ-D1-006: Learned Stage 2 weight combiner (shadow mode).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:465: * Scores are computed but NOT used for ranking (shadow-only).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:95:      getSessionPromptContext: vi.fn(() => []),
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:106:    vi.doMock('../lib/telemetry/retrieval-telemetry', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-context-session-state.vitest.ts:109:    vi.doMock('../lib/telemetry/consumption-logger', () => ({
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/scoring-observability.vitest.ts:25:} from '../lib/telemetry/scoring-observability';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:4:// Feature catalog: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/session-transition.ts:4:// Feature catalog: Tool-result extraction to working memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:79:import { shadowScore, extractFeatureVector, loadModel } from '@spec-kit/shared/ranking/learned-combiner';
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:192:        console.warn(`[stage2-fusion] learned stage2 model at ${modelPath} is invalid; shadow scoring will use manual-only fallback`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:930: *   1.  Session boost      (hybrid only — working memory attention)
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1257:  // -- 6a. Learned Stage 2 shadow scoring --
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1284:        const shadow = shadowScore(learnedShadowModel, features, resolveBaseScore(row), true);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1285:        if (shadow) {
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1287:            `[stage2-fusion] shadow-learned id=${row.id} manual=${shadow.manualScore.toFixed(4)} learned=${shadow.learnedScore.toFixed(4)} delta=${shadow.delta.toFixed(4)}`
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1293:      console.warn(`[stage2-fusion] learned stage2 shadow scoring failed: ${message}`);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:757:Selection tracking writes to a separate `learned_triggers` column (NOT FTS5 index). 10 safeguards: separate column, 30-day TTL, 100+ stop words denylist, rate cap (3 terms/selection, 8 terms/memory), top-3 exclusion, 1-week shadow period, <72h memory exclusion, sprint gate review, rollback mechanism, provenance audit log. Query weight: **0.7x** of organic triggers. Gated via `SPECKIT_LEARN_FROM_SELECTION` (default ON; set to `false` to disable).
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:104:    'adaptive_shadow_runs',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:325:  'eval_shadow_comparisons',
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1908:    console.error(`[checkpoints] Restored ${result.restored} memories, ${result.workingMemoryRestored} working memory entries from "${checkpoint.name}"`);

codex
I’ve got the Engram write path and context path pinned down now. The last comparison pass is around Public’s session prompt context and recovery stack, because that’s the key distinction: Public already has strong retrieval and trusted session handling, but its “prompt context” is still derived from transient working-memory state rather than a durable first-class prompt store.
exec
/bin/zsh -lc "rg -n \"getSessionPromptContext\\(|sessionPromptContext|promptContext|prompt context|Recent User Prompts|user prompt\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435:    const resumeContextItems = workingMemory.getSessionPromptContext(effectiveSessionId, workingMemory.DECAY_FLOOR, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:65:    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:66:    expect(promptContext.length).toBeGreaterThan(0);
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:67:    expect(promptContext[0].attentionScore).toBeGreaterThan(0.05);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1,220p;220,420p;420,620p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
   121	  sessionId?: string;
   122	  enableDedup?: boolean;
   123	  includeContent?: boolean;
   124	  includeTrace?: boolean; // CHK-040: Forward to internal memory_search calls
   125	  tokenUsage?: number;
   126	  anchors?: string[];
   127	  /** REQ-D5-003: Presentation profile ('quick'|'research'|'resume'|'debug'). Default: full response. */
   128	  profile?: string;
   129	}
   130	
   131	/** T205: Token budget enforcement metadata */
   132	interface TokenBudgetEnforcement {
   133	  budgetTokens: number;
   134	  actualTokens: number;
   135	  enforced: boolean;
   136	  truncated: boolean;
   137	  originalResultCount?: number;
   138	  returnedResultCount?: number;
   139	}
   140	
   141	type PressureOverrideTargetMode = 'quick' | 'focused' | null;
   142	
   143	interface SessionLifecycleResolution {
   144	  requestedSessionId: string | null;
   145	  effectiveSessionId: string;
   146	  resumed: boolean;
   147	  priorMode: string | null;
   148	  counter: number;
   149	  error?: string;
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
   261	      details: {},
   262	      hints: [],
   263	      severity: null,
   264	    };
   265	  }
   266	
   267	  try {
   268	    const parsed = JSON.parse(responseText) as {
   269	      data?: {
   270	        error?: string;
   271	        code?: string;
   272	        details?: Record<string, unknown>;
   273	      };
   274	      hints?: string[];
   275	      meta?: {
   276	        severity?: string;
   277	      };
   278	    };
   279	
   280	    return {
   281	      error: parsed.data?.error ?? 'Context strategy failed',
   282	      code: parsed.data?.code ?? 'E_STRATEGY',
   283	      details: parsed.data?.details ?? {},
   284	      hints: Array.isArray(parsed.hints) ? parsed.hints : [],
   285	      severity: parsed.meta?.severity ?? null,
   286	    };
   287	  } catch {
   288	    return {
   289	      error: 'Context strategy failed',
   290	      code: 'E_STRATEGY',
   291	      details: {},
   292	      hints: [],
   293	      severity: null,
   294	    };
   295	  }
   296	}
   297	
   298	function buildStructuralRoutingNudge(
   299	  input: string,
   300	  queryIntentMetadata: {
   301	    queryIntent: string;
   302	    confidence: number;
   303	  } | null,
   304	  graphContextResult: Record<string, unknown> | null,
   305	): StructuralRoutingNudgeMeta | null {
   306	  if (!queryIntentMetadata || queryIntentMetadata.queryIntent !== 'structural' || queryIntentMetadata.confidence <= 0.65) {
   307	    return null;
   308	  }
   309	
   310	  if (!STRUCTURAL_ROUTING_PATTERNS.some((pattern) => pattern.test(input))) {
   311	    return null;
   312	  }
   313	
   314	  const metadata = graphContextResult?.metadata as Record<string, unknown> | undefined;
   315	  const totalNodes = typeof metadata?.totalNodes === 'number' ? metadata.totalNodes : 0;
   316	  if (totalNodes <= 0) {
   317	    return null;
   318	  }
   319	
   320	  return {
   321	    advisory: true,
   322	    readiness: 'ready',
   323	    preferredTool: 'code_graph_query',
   324	    message: 'Advisory only: this looks like a structural question. Prefer `code_graph_query` before Grep or Glob for callers, imports, outline, and dependency lookups.',
   325	    preservesAuthority: 'session_bootstrap',
   326	  };
   327	}
   328	
   329	/* ───────────────────────────────────────────────────────────────
   330	   2. TOKEN BUDGET ENFORCEMENT (T205)
   331	   
   332	   Enforces per-layer/per-mode token budgets by estimating the
   333	   token count of strategy results and truncating when exceeded.
   334	   Uses character-based estimation: 1 token ≈ 4 chars.
   335	──────────────────────────────────────────────────────────────── */
   336	
   337	/**
   338	 * T205: Enforce token budget on strategy results.
   339	 * 
   340	 * Estimates the token count of the serialized result. If over budget,
   341	 * parses embedded result arrays and removes lowest-priority items
   342	 * until within budget. Higher-scored results are preserved.
   343	 */
   344	function enforceTokenBudget(result: ContextResult, budgetTokens: number): { result: ContextResult; enforcement: TokenBudgetEnforcement } {
   345	  const serialized = JSON.stringify(result);
   346	  const actualTokens = estimateTokens(serialized);
   347	
   348	  // Under budget — no enforcement needed
   349	  if (actualTokens <= budgetTokens) {
   350	    return {
   351	      result,
   352	      enforcement: {
   353	        budgetTokens,
   354	        actualTokens,
   355	        enforced: false,
   356	        truncated: false,
   357	      }
   358	    };
   359	  }
   360	
   361	  // Over budget — attempt to truncate embedded results
   362	  // Strategy results contain an embedded MCPResponse with content[0].text as JSON
   363	  // That JSON has a .data.results array we can truncate
   364	  const truncatedResult = { ...result };
   365	  let parseFailed = false;
   366	  let originalResultCount: number | undefined;
   367	  let returnedResultCount: number | undefined;
   368	
   369	  const fallbackToStructuredBudget = (
   370	    baseResult: ContextResult,
   371	    parseFailedInnerText?: string,
   372	  ): ContextResult => {
   373	    const fallbackResult = { ...baseResult } as ContextResult;
   374	    const fallbackContent = Array.isArray((fallbackResult as Record<string, unknown>).content)
   375	      ? ((fallbackResult as Record<string, unknown>).content as Array<Record<string, unknown>>)
   376	      : [];
   377	    const contentClone = fallbackContent.map((entry) => ({ ...entry }));
   378	    const candidateInnerStates: Array<Record<string, unknown>> = [
   379	      {
   380	        summary: 'Context truncated to fit token budget',
   381	        data: {
   382	          count: 0,
   383	          results: [],
   384	        },
   385	        meta: {
   386	          tool: 'memory_search',
   387	          truncated: true,
   388	          parseFailed: Boolean(parseFailedInnerText),
   389	        },
   390	      },
   391	      {
   392	        data: {
   393	          count: 0,
   394	          results: [],
   395	        },
   396	        meta: {
   397	          tool: 'memory_search',
   398	          truncated: true,
   399	        },
   400	      },
   401	      {
   402	        data: {
   403	          count: 0,
   404	          results: [],
   405	        },
   406	      },
   407	    ];
   408	
   409	    if (parseFailedInnerText) {
   410	      const meta = candidateInnerStates[0].meta as Record<string, unknown>;
   411	      meta.parseFailedPreview = parseFailedInnerText.slice(0, 120);
   412	    }
   413	
   414	    for (const innerEnvelope of candidateInnerStates) {
   415	      if (contentClone.length > 0) {
   416	        contentClone[0] = { ...contentClone[0], text: JSON.stringify(innerEnvelope) };
   417	        (fallbackResult as Record<string, unknown>).content = contentClone;
   418	      } else {
   419	        (fallbackResult as Record<string, unknown>).content = [
   420	          { type: 'text', text: JSON.stringify(innerEnvelope) },
   420	          { type: 'text', text: JSON.stringify(innerEnvelope) },
   421	        ];
   422	      }
   423	
   424	      if (estimateTokens(JSON.stringify(fallbackResult)) <= budgetTokens) {
   425	        return fallbackResult;
   426	      }
   427	    }
   428	
   429	    return {
   430	      strategy: baseResult.strategy,
   431	      mode: baseResult.mode,
   432	      content: [{
   433	        type: 'text',
   434	        text: JSON.stringify({ data: { count: 0, results: [] } }),
   435	      }],
   436	    };
   437	  };
   438	
   439	  const compactStructuredResult = (
   440	    innerEnvelope: Record<string, unknown>,
   441	    currentResults: Array<Record<string, unknown>>,
   442	    contentEntries: Array<{ type: string; text: string }>,
   443	  ): { result: ContextResult; actualTokens: number } | null => {
   444	    const truncateKeys = ['content', 'snippet', 'summary', 'text'] as const;
   445	    const lastIndex = currentResults.length - 1;
   446	
   447	    if (lastIndex < 0) {
   448	      return null;
   449	    }
   450	
   451	    const lastResult = currentResults[lastIndex];
   452	    if (!lastResult || typeof lastResult !== 'object') {
   453	      return null;
   454	    }
   455	
   456	    for (const key of truncateKeys) {
   457	      const originalValue = lastResult[key];
   458	      if (typeof originalValue !== 'string' || originalValue.length === 0) {
   459	        continue;
   460	      }
   461	
   462	      let bestResult: ContextResult | null = null;
   463	      let bestTokens = Number.POSITIVE_INFINITY;
   464	      let low = 0;
   465	      let high = originalValue.length;
   466	
   467	      while (low <= high) {
   468	        const mid = Math.floor((low + high) / 2);
   469	        const candidateResults = [...currentResults];
   470	        candidateResults[lastIndex] = {
   471	          ...lastResult,
   472	          [key]: originalValue.slice(0, mid),
   473	        };
   474	
   475	        innerEnvelope.data = {
   476	          ...((innerEnvelope.data as Record<string, unknown>) ?? {}),
   477	          results: candidateResults,
   478	          count: candidateResults.length,
   479	        };
   480	
   481	        const candidateContent = contentEntries.map((entry, index) => (
   482	          index === 0 ? { type: entry.type, text: JSON.stringify(innerEnvelope) } : { ...entry }
   483	        ));
   484	        const candidateResult = {
   485	          ...truncatedResult,
   486	          content: candidateContent,
   487	        } as ContextResult;
   488	        const candidateTokens = estimateTokens(JSON.stringify(candidateResult));
   489	
   490	        if (candidateTokens <= budgetTokens) {
   491	          bestResult = candidateResult;
   492	          bestTokens = candidateTokens;
   493	          low = mid + 1;
   494	        } else {
   495	          high = mid - 1;
   496	        }
   497	      }
   498	
   499	      if (bestResult) {
   500	        return {
   501	          result: bestResult,
   502	          actualTokens: bestTokens,
   503	        };
   504	      }
   505	    }
   506	
   507	    return null;
   508	  };
   509	
   510	  // Try to find and truncate the inner results array
   511	  const contentArr = (truncatedResult as Record<string, unknown>).content as Array<{ type: string; text: string }> | undefined;
   512	  let parseFailedInnerText: string | undefined;
   513	  if (contentArr && Array.isArray(contentArr) && contentArr.length > 0 && contentArr[0]?.text) {
   514	    try {
   515	      const innerEnvelope = JSON.parse(contentArr[0].text);
   516	      const innerResults = innerEnvelope?.data?.results;
   517	
   518	      if (Array.isArray(innerResults) && innerResults.length > 0) {
   519	        originalResultCount = innerResults.length;
   520	
   521	        // Results should already be sorted by score (highest first)
   522	        // Remove items from the end until we fit within budget
   523	        const currentResults = [...innerResults];
   524	        let currentTokens = actualTokens;
   525	
   526	        // Phase 1: Adaptive content truncation — truncate content fields before dropping results
   527	        const MAX_CONTENT_CHARS = 500;
   528	        for (const r of currentResults) {
   529	          if (r.content && typeof r.content === 'string' && r.content.length > MAX_CONTENT_CHARS) {
   530	            r.content = r.content.substring(0, MAX_CONTENT_CHARS) + '...';
   531	            r.contentTruncated = true;
   532	          }
   533	        }
   534	        // Re-estimate after content truncation
   535	        innerEnvelope.data.results = currentResults;
   536	        innerEnvelope.data.count = currentResults.length;
   537	        currentTokens = estimateTokens(JSON.stringify(innerEnvelope));
   538	
   539	        // Phase 2: Drop lowest-scored results if still over budget
   540	        while (currentResults.length > 1 && currentTokens > budgetTokens) {
   541	          // Remove the last (lowest-scored) result
   542	          const removed = currentResults.pop();
   543	          const removedTokens = estimateTokens(JSON.stringify(removed));
   544	          currentTokens -= removedTokens;
   545	        }
   546	
   547	        // Phase 3: Two-tier response — append metadata-only entries for dropped results
   548	        const droppedResults = innerResults.slice(currentResults.length);
   549	        if (droppedResults.length > 0) {
   550	          const metadataOnly = droppedResults.map((r: Record<string, unknown>) => ({
   551	            id: r.id,
   552	            title: r.title,
   553	            similarity: r.similarity,
   554	            specFolder: r.specFolder,
   555	            confidence: r.confidence,
   556	            importanceTier: r.importanceTier,
   557	            isConstitutional: r.isConstitutional,
   558	            metadataOnly: true,
   559	          }));
   560	          const metadataTokens = estimateTokens(JSON.stringify(metadataOnly));
   561	          if (currentTokens + metadataTokens <= budgetTokens) {
   562	            currentResults.push(...metadataOnly);
   563	            currentTokens += metadataTokens;
   564	          }
   565	        }
   566	
   567	        // Update the inner envelope
   568	        innerEnvelope.data.results = currentResults;
   569	        innerEnvelope.data.count = currentResults.length;
   570	        returnedResultCount = currentResults.length;
   571	
   572	        // Re-serialize
   573	        contentArr[0] = { type: 'text', text: JSON.stringify(innerEnvelope) };
   574	        (truncatedResult as Record<string, unknown>).content = contentArr;
   575	
   576	        // Recalculate actual tokens after truncation
   577	        const newSerializedTokens = estimateTokens(JSON.stringify(truncatedResult));
   578	
   579	        if (newSerializedTokens <= budgetTokens) {
   580	          return {
   581	            result: truncatedResult,
   582	            enforcement: {
   583	              budgetTokens,
   584	              actualTokens: newSerializedTokens,
   585	              enforced: true,
   586	              truncated: true,
   587	              originalResultCount,
   588	              returnedResultCount,
   589	            }
   590	          };
   591	        }
   592	
   593	        const compacted = compactStructuredResult(innerEnvelope, currentResults, contentArr);
   594	        if (compacted) {
   595	          return {
   596	            result: compacted.result,
   597	            enforcement: {
   598	              budgetTokens,
   599	              actualTokens: compacted.actualTokens,
   600	              enforced: true,
   601	              truncated: true,
   602	              originalResultCount,
   603	              returnedResultCount,
   604	            }
   605	          };
   606	        }
   607	      }
   608	    } catch {
   609	      parseFailed = true;
   610	      parseFailedInnerText = contentArr[0].text;
   611	      // JSON parse failed — fall through to structural truncation
   612	    }
   613	  }
   614	
   615	  // Fallback when parsing fails or a structured response still exceeds budget.
   616	  // Always emit valid nested JSON rather than raw character slices.
   617	  const fallbackResult = fallbackToStructuredBudget(
   618	    parseFailed ? result : truncatedResult,
   619	    parseFailedInnerText,
   620	  );

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md | sed -n '1,160p' && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

---
     1	<p align="center">
     2	  <img width="1024" height="340" alt="image" src="https://github.com/user-attachments/assets/32ed8985-841d-49c3-81f7-2aabc7c7c564" />
     3	</p>
     4	
     5	<p align="center">
     6	  <strong>Persistent memory for AI coding agents</strong><br>
     7	  <em>Agent-agnostic. Single binary. Zero dependencies.</em>
     8	</p>
     9	
    10	<p align="center">
    11	  <a href="docs/INSTALLATION.md">Installation</a> &bull;
    12	  <a href="docs/AGENT-SETUP.md">Agent Setup</a> &bull;
    13	  <a href="docs/ARCHITECTURE.md">Architecture</a> &bull;
    14	  <a href="docs/PLUGINS.md">Plugins</a> &bull;
    15	  <a href="CONTRIBUTING.md">Contributing</a> &bull;
    16	  <a href="DOCS.md">Full Docs</a>
    17	</p>
    18	
    19	---
    20	
    21	> **engram** `/ˈen.ɡræm/` — *neuroscience*: the physical trace of a memory in the brain.
    22	
    23	Your AI coding agent forgets everything when the session ends. Engram gives it a brain.
    24	
    25	A **Go binary** with SQLite + FTS5 full-text search, exposed via CLI, HTTP API, MCP server, and an interactive TUI. Works with **any agent** that supports MCP — Claude Code, OpenCode, Gemini CLI, Codex, VS Code (Copilot), Antigravity, Cursor, Windsurf, or anything else.
    26	
    27	```
    28	Agent (Claude Code / OpenCode / Gemini CLI / Codex / VS Code / Antigravity / ...)
    29	    ↓ MCP stdio
    30	Engram (single Go binary)
    31	    ↓
    32	SQLite + FTS5 (~/.engram/engram.db)
    33	```
    34	
    35	## Quick Start
    36	
    37	### Install
    38	
    39	```bash
    40	brew install gentleman-programming/tap/engram
    41	```
    42	
    43	Windows, Linux, and other install methods → [docs/INSTALLATION.md](docs/INSTALLATION.md)
    44	
    45	### Setup Your Agent
    46	
    47	| Agent | One-liner |
    48	|-------|-----------|
    49	| Claude Code | `claude plugin marketplace add Gentleman-Programming/engram && claude plugin install engram` |
    50	| OpenCode | `engram setup opencode` |
    51	| Gemini CLI | `engram setup gemini-cli` |
    52	| Codex | `engram setup codex` |
    53	| VS Code | `code --add-mcp '{"name":"engram","command":"engram","args":["mcp"]}'` |
    54	| Cursor / Windsurf / Any MCP | See [docs/AGENT-SETUP.md](docs/AGENT-SETUP.md) |
    55	
    56	Full per-agent config, Memory Protocol, and compaction survival → [docs/AGENT-SETUP.md](docs/AGENT-SETUP.md)
    57	
    58	That's it. No Node.js, no Python, no Docker. **One binary, one SQLite file.**
    59	
    60	## How It Works
    61	
    62	```
    63	1. Agent completes significant work (bugfix, architecture decision, etc.)
    64	2. Agent calls mem_save → title, type, What/Why/Where/Learned
    65	3. Engram persists to SQLite with FTS5 indexing
    66	4. Next session: agent searches memory, gets relevant context
    67	```
    68	
    69	Full details on session lifecycle, topic keys, and memory hygiene → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
    70	
    71	## MCP Tools
    72	
    73	| Tool | Purpose |
    74	|------|---------|
    75	| `mem_save` | Save observation |
    76	| `mem_update` | Update by ID |
    77	| `mem_delete` | Soft or hard delete |
    78	| `mem_suggest_topic_key` | Stable key for evolving topics |
    79	| `mem_search` | Full-text search |
    80	| `mem_session_summary` | End-of-session save |
    81	| `mem_context` | Recent session context |
    82	| `mem_timeline` | Chronological drill-in |
    83	| `mem_get_observation` | Full content by ID |
    84	| `mem_save_prompt` | Save user prompt |
    85	| `mem_stats` | Memory statistics |
    86	| `mem_session_start` | Register session start |
    87	| `mem_session_end` | Mark session complete |
    88	| `mem_capture_passive` | Extract learnings from text output |
    89	| `mem_merge_projects` | Merge project name variants (admin) |
    90	
    91	Full tool reference → [docs/ARCHITECTURE.md#mcp-tools](docs/ARCHITECTURE.md#mcp-tools)
    92	
    93	## Terminal UI
    94	
    95	```bash
    96	engram tui
    97	```
    98	
    99	<p align="center">
   100	<img src="assets/tui-dashboard.png" alt="TUI Dashboard" width="400" />
   101	  <img width="400" alt="image" src="https://github.com/user-attachments/assets/0308991a-58bb-4ad8-9aa2-201c059f8b64" />
   102	  <img src="assets/tui-detail.png" alt="TUI Observation Detail" width="400" />
   103	  <img src="assets/tui-search.png" alt="TUI Search Results" width="400" />
   104	</p>
   105	
   106	**Navigation**: `j/k` vim keys, `Enter` to drill in, `/` to search, `Esc` back. Catppuccin Mocha theme.
   107	
   108	## Git Sync
   109	
   110	Share memories across machines. Uses compressed chunks — no merge conflicts, no huge files.
   111	
   112	```bash
   113	engram sync                    # Export new memories as compressed chunk
   114	git add .engram/ && git commit -m "sync engram memories"
   115	engram sync --import           # On another machine: import new chunks
   116	engram sync --status           # Check sync status
   117	```
   118	
   119	Full sync documentation → [DOCS.md](DOCS.md)
   120	
   121	## CLI Reference
   122	
   123	| Command | Description |
   124	|---------|-------------|
   125	| `engram setup [agent]` | Install agent integration |
   126	| `engram serve [port]` | Start HTTP API (default: 7437) |
   127	| `engram mcp` | Start MCP server (stdio). Accepts `--project` or `ENGRAM_PROJECT` |
   128	| `engram tui` | Launch terminal UI |
   129	| `engram search <query>` | Search memories |
   130	| `engram save <title> <msg>` | Save a memory |
   131	| `engram timeline <obs_id>` | Chronological context |
   132	| `engram context [project]` | Recent session context |
   133	| `engram stats` | Memory statistics |
   134	| `engram export [file]` | Export to JSON |
   135	| `engram import <file>` | Import from JSON |
   136	| `engram sync` | Git sync export |
   137	| `engram projects list` | Show all projects with observation/session/prompt counts |
   138	| `engram projects consolidate` | Interactive merge of similar project names (`--all`, `--dry-run`) |
   139	| `engram projects prune` | Remove projects with 0 observations (`--dry-run`) |
   140	| `engram version` | Show version |
   141	
   142	## Documentation
   143	
   144	| Doc | Description |
   145	|-----|-------------|
   146	| [Installation](docs/INSTALLATION.md) | All install methods + platform support |
   147	| [Agent Setup](docs/AGENT-SETUP.md) | Per-agent configuration + Memory Protocol |
   148	| [Architecture](docs/ARCHITECTURE.md) | How it works + MCP tools + project structure |
   149	| [Plugins](docs/PLUGINS.md) | OpenCode & Claude Code plugin details |
   150	| [Comparison](docs/COMPARISON.md) | Why Engram vs claude-mem |
   151	| [Contributing](CONTRIBUTING.md) | Contribution workflow + standards |
   152	| [Full Docs](DOCS.md) | Complete technical reference |
   153	
   154	## License
   155	
   156	MIT
   157	
   158	---
   159	
   160	**Inspired by [claude-mem](https://github.com/thedotmack/claude-mem)** — but agent-agnostic, simpler, and built different.

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '1400,1475p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "rg -n \"resolveTrustedSession|completeSession|clearSession\\(|trusted session|transport-bound|session scope derived\" /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts && printf '\\n---\\n' && nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '620,760p;820,920p;1060,1125p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
385:function resolveTrustedSession(
843:function clearSession(sessionId: string): CleanupResult {
854:      workingMemory.clearSession(sessionId);
1079:function completeSession(sessionId: string): InitResult {
1092:      workingMemory.clearSession(sessionId);
1413:  resolveTrustedSession,
1422:  completeSession,

---
   620	    return result;
   621	  } catch (error: unknown) {
   622	    const message = error instanceof Error ? error.message : String(error);
   623	    console.warn(`[session-manager] shouldSendMemoriesBatch failed: ${message}`);
   624	    const allow = SESSION_CONFIG.dbUnavailableMode === 'allow';
   625	    memories.forEach((m) => {
   626	      if (m.id != null) {
   627	        result.set(m.id, allow);
   628	      }
   629	    });
   630	    return result;
   631	  }
   632	}
   633	
   634	function markMemorySent(sessionId: string, memory: MemoryInput | number): MarkResult {
   635	  if (!SESSION_CONFIG.enabled) return { success: true, skipped: true };
   636	  if (!db) return { success: false, error: 'Database not initialized. Server may still be starting up.' };
   637	  if (!sessionId || typeof sessionId !== 'string') {
   638	    return { success: false, error: 'Valid sessionId is required' };
   639	  }
   640	
   641	  try {
   642	    const memoryObj: MemoryInput = typeof memory === 'number' ? { id: memory } : memory;
   643	    const hash = generateMemoryHash(memoryObj);
   644	    const memoryId = memoryObj.id || null;
   645	
   646	    const stmt = db.prepare(`
   647	      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
   648	      VALUES (?, ?, ?, ?)
   649	    `);
   650	
   651	    // Transaction ensures atomic insert + limit enforcement, preventing concurrent race past entry limit.
   652	    db.transaction(() => {
   653	      stmt.run(sessionId, hash, memoryId, new Date().toISOString());
   654	      // EnforceEntryLimit inside tx — atomic with insert to prevent row count races.
   655	      enforceEntryLimit(sessionId);
   656	    })();
   657	
   658	    return { success: true, hash };
   659	  } catch (error: unknown) {
   660	    const message = error instanceof Error ? error.message : String(error);
   661	    console.error(`[session-manager] markMemorySent failed: ${message}`);
   662	    return { success: false, error: message };
   663	  }
   664	}
   665	
   666	function markMemoriesSentBatch(sessionId: string, memories: MemoryInput[]): MarkBatchResult {
   667	  if (!SESSION_CONFIG.enabled) return { success: true, markedCount: 0, skipped: true };
   668	  if (!db) return { success: false, markedCount: 0, error: 'Database not initialized. Server may still be starting up.' };
   669	  if (!sessionId || !Array.isArray(memories) || memories.length === 0) {
   670	    return { success: false, markedCount: 0, error: 'Valid sessionId and memories array required' };
   671	  }
   672	
   673	  try {
   674	    const now = new Date().toISOString();
   675	    let markedCount = 0;
   676	
   677	    const insertStmt = db.prepare(`
   678	      INSERT OR IGNORE INTO session_sent_memories (session_id, memory_hash, memory_id, sent_at)
   679	      VALUES (?, ?, ?, ?)
   680	    `);
   681	
   682	    const runBatch = db.transaction(() => {
   683	      for (const memory of memories) {
   684	        const hash = generateMemoryHash(memory);
   685	        const result = insertStmt.run(sessionId, hash, memory.id || null, now);
   686	        if (result.changes > 0) {
   687	          markedCount++;
   688	        }
   689	      }
   690	      // EnforceEntryLimit inside tx — atomic with inserts to prevent row count races.
   691	      enforceEntryLimit(sessionId);
   692	    });
   693	
   694	    runBatch();
   695	
   696	    return { success: true, markedCount };
   697	  } catch (error: unknown) {
   698	    const message = error instanceof Error ? error.message : String(error);
   699	    console.error(`[session-manager] markMemoriesSentBatch failed: ${message}`);
   700	    return { success: false, markedCount: 0, error: message };
   701	  }
   702	}
   703	
   704	/* ───────────────────────────────────────────────────────────────
   705	   7. SESSION PERSISTENCE
   706	──────────────────────────────────────────────────────────────── */
   707	
   708	function enforceEntryLimit(sessionId: string): void {
   709	  if (!db || !sessionId) return;
   710	
   711	  try {
   712	    const countStmt = db.prepare(`
   713	      SELECT COUNT(*) as count FROM session_sent_memories WHERE session_id = ?
   714	    `);
   715	    const row = countStmt.get(sessionId) as { count: number } | undefined;
   716	    const count = row?.count ?? 0;
   717	
   718	    if (count <= SESSION_CONFIG.maxEntriesPerSession) return;
   719	
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts | sed -n '360,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// TEST: SESSION LIFECYCLE CONTRACT (T027n)
     2	import { afterEach, describe, expect, it } from 'vitest';
     3	import Database from 'better-sqlite3';
     4	import * as workingMemory from '../lib/cognitive/working-memory';
     5	
     6	function createDb() {
     7	  const db = new Database(':memory:');
     8	  db.exec(`
     9	    CREATE TABLE memory_index (
    10	      id INTEGER PRIMARY KEY,
    11	      spec_folder TEXT NOT NULL DEFAULT 'test',
    12	      file_path TEXT NOT NULL DEFAULT '/tmp/test.md',
    13	      title TEXT
    14	    );
    15	  `);
    16	
    17	  for (let i = 1; i <= 20; i += 1) {
    18	    db.prepare('INSERT INTO memory_index (id, file_path, title) VALUES (?, ?, ?)').run(
    19	      i,
    20	      `/tmp/memory-${i}.md`,
    21	      `Memory ${i}`
    22	    );
    23	  }
    24	
    25	  workingMemory.init(db);
    26	  return db;
    27	}
    28	
    29	describe('Session lifecycle contract (T027k-T027n)', () => {
    30	  let db: Database.Database | null = null;
    31	
    32	  afterEach(() => {
    33	    if (db) {
    34	      db.close();
    35	      db = null;
    36	    }
    37	  });
    38	
    39	  it('new session starts event_counter at 0', () => {
    40	    db = createDb();
    41	    expect(workingMemory.getSessionEventCounter('new-session')).toBe(0);
    42	    expect(workingMemory.setAttentionScore('new-session', 1, 0.8)).toBe(true);
    43	
    44	    const rows = workingMemory.getWorkingMemory('new-session');
    45	    expect(rows.length).toBe(1);
    46	    expect(rows[0].event_counter).toBe(0);
    47	  });
    48	
    49	  it('resume session continues event_counter and preserves working memory items', () => {
    50	    db = createDb();
    51	
    52	    expect(workingMemory.setAttentionScore('resume-session', 2, 0.7)).toBe(true); // 0
    53	    expect(workingMemory.setAttentionScore('resume-session', 3, 0.6)).toBe(true); // 1
    54	
    55	    expect(workingMemory.sessionExists('resume-session')).toBe(true);
    56	    expect(workingMemory.getSessionEventCounter('resume-session')).toBe(1);
    57	
    58	    expect(workingMemory.setAttentionScore('resume-session', 2, 0.9)).toBe(true); // 2
    59	    expect(workingMemory.getSessionEventCounter('resume-session')).toBeGreaterThanOrEqual(1);
    60	
    61	    const rows = workingMemory.getWorkingMemory('resume-session');
    62	    const resumedRow = rows.find((row) => row.memory_id === 2);
    63	    expect(resumedRow?.event_counter).toBe(2);
    64	
    65	    const promptContext = workingMemory.getSessionPromptContext('resume-session', 0.05, 5);
    66	    expect(promptContext.length).toBeGreaterThan(0);
    67	    expect(promptContext[0].attentionScore).toBeGreaterThan(0.05);
    68	  });
    69	});

codex
# Iteration 014: DEEP DIVE - STRONGEST PATTERN

## Focus
DEEP DIVE - STRONGEST PATTERN: Go deep on the single most impactful pattern from this system. Trace it end-to-end.

## Findings
### Finding 1: Engram treats user intent as a first-class, durable memory lane
- **Source**: [external/internal/mcp/mcp.go:350](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350), [external/internal/mcp/mcp.go:851](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:851), [external/internal/store/store.go:487](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:487), [external/internal/store/store.go:501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501), [external/internal/store/store.go:1109](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1109), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [external/docs/ARCHITECTURE.md:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:65)
- **What it does**: `mem_save_prompt` is not a cosmetic helper. It is an eager agent-facing MCP tool, its handler auto-binds the prompt to a session and normalized project, and the store persists it in a dedicated `user_prompts` table with its own FTS5 index and sync entity. `FormatContext()` then rebuilds startup context in a fixed order: recent sessions, recent user prompts, then recent observations. The pattern is end-to-end: MCP surface -> session binding -> durable storage -> sync/export/import -> startup reinjection.
- **Why it matters for us**: This is the clearest gap in Public’s stack. Public has excellent durable memory records and resume/search orchestration, but its nearest equivalent is transient `systemPromptContext` derived from working-memory memory IDs during resume, plus optional `user_prompts` fields accepted by `generate-context.js`. That means “what the user asked for” is not yet a first-class durable MCP-readable entity in the live system.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram deliberately keeps prompt memory separate from its main retrieval lane
- **Source**: [external/internal/mcp/mcp.go:170](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:170), [external/internal/mcp/mcp.go:375](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:375), [external/internal/store/store.go:1181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1181), [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462), [external/internal/store/store.go:1624](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1624), [memory-context.ts:1435](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435), [working-memory.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325)
- **What it does**: Engram stores prompt records in searchable form (`SearchPrompts()` exists) but does not mix them into `mem_search`, which only hits observation records. Prompts instead feed `mem_context` as continuity scaffolding. So prompt memory is a parallel substrate for intent reconstruction, not a blind merge into the main relevance-ranked memory corpus.
- **Why it matters for us**: If Public adopts prompt memory, it should not dump prompts into `memory_search` and destabilize hybrid ranking. The better fit is additive continuity: use prompt records to enrich `session_resume`, `session_bootstrap`, or resume-mode `memory_context`, while keeping `memory_search` focused on curated memory artifacts. That preserves Public’s stronger semantic, causal, and graph-aware retrieval stack.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: The pattern is worth borrowing, but Engram’s project-scoped trust model is not
- **Source**: [external/internal/mcp/mcp.go:857](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:857), [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754), [external/internal/store/store.go:2459](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821), [session-manager.ts:1079](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079)
- **What it does**: Engram’s prompt/session flow relies on normalized project names, explicit session start/end tools, and project consolidation when names drift. That is operationally clean, but trust is still mostly “session id + project name + normalization hygiene.” Public’s equivalent path is stricter: `resolveTrustedSession()` rejects caller-supplied sessions that are not server-managed and identity-correlated, and completed sessions clear working memory immediately.
- **Why it matters for us**: The prompt-memory idea ports well; the trust model does not. If Public adds a first-class prompt lane, it should bind prompts to trusted server sessions and governed tenant/user/agent/shared-space scope, not to project names as the primary isolation primitive. Otherwise we would weaken a system that is already stronger than Engram on multi-actor safety.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [session-lifecycle.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts)

## Assessment
- New information ratio: 0.62
- Questions addressed: Q1, Q2, Q5, Q7, Q8, Q9, Q10
- Questions answered: Q2, Q5, Q8, Q9, Q10

## Reflection
- What worked: tracing the pattern from `mem_save_prompt` registration into `handleSavePrompt()`, then through `user_prompts`/`prompts_fts`/sync/export/import and finally `FormatContext()` exposed that this is a full architectural lane, not a single tool; comparing that directly to Public’s `memory_context` resume injection and trusted-session lifecycle made the fit boundary very clear.
- What did not work: CocoIndex did not produce a usable pass on this Go-focused slice in this run, so I fell back to `rg` plus line-anchored reads; the strict validator again returned `PASSED` while also emitting `cannot create temp file for here document: Operation not permitted`, and this sandbox snapshot lacks the expected Level 3 phase docs at the phase root, so I kept the iteration read-only instead of attempting packet repair.

## Recommended Next Focus
Trace phase 003 and 004 specifically for whether they offer a better retrieval or ranking model for durable prompt/intent records, then design a Public-side prompt-memory sidecar that is resume-only by default, governed by trusted session scope, and explicitly separate from live `memory_search` ranking.


hook: Stop
hook: Stop Completed
tokens used
124,647
# Iteration 014: DEEP DIVE - STRONGEST PATTERN

## Focus
DEEP DIVE - STRONGEST PATTERN: Go deep on the single most impactful pattern from this system. Trace it end-to-end.

## Findings
### Finding 1: Engram treats user intent as a first-class, durable memory lane
- **Source**: [external/internal/mcp/mcp.go:350](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:350), [external/internal/mcp/mcp.go:851](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:851), [external/internal/store/store.go:487](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:487), [external/internal/store/store.go:501](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:501), [external/internal/store/store.go:1109](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1109), [external/internal/store/store.go:1613](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1613), [external/docs/ARCHITECTURE.md:65](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md:65)
- **What it does**: `mem_save_prompt` is not a cosmetic helper. It is an eager agent-facing MCP tool, its handler auto-binds the prompt to a session and normalized project, and the store persists it in a dedicated `user_prompts` table with its own FTS5 index and sync entity. `FormatContext()` then rebuilds startup context in a fixed order: recent sessions, recent user prompts, then recent observations. The pattern is end-to-end: MCP surface -> session binding -> durable storage -> sync/export/import -> startup reinjection.
- **Why it matters for us**: This is the clearest gap in Public’s stack. Public has excellent durable memory records and resume/search orchestration, but its nearest equivalent is transient `systemPromptContext` derived from working-memory memory IDs during resume, plus optional `user_prompts` fields accepted by `generate-context.js`. That means “what the user asked for” is not yet a first-class durable MCP-readable entity in the live system.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: Engram deliberately keeps prompt memory separate from its main retrieval lane
- **Source**: [external/internal/mcp/mcp.go:170](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:170), [external/internal/mcp/mcp.go:375](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:375), [external/internal/store/store.go:1181](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1181), [external/internal/store/store.go:1462](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1462), [external/internal/store/store.go:1624](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:1624), [memory-context.ts:1435](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1435), [working-memory.ts:325](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325)
- **What it does**: Engram stores prompt records in searchable form (`SearchPrompts()` exists) but does not mix them into `mem_search`, which only hits observation records. Prompts instead feed `mem_context` as continuity scaffolding. So prompt memory is a parallel substrate for intent reconstruction, not a blind merge into the main relevance-ranked memory corpus.
- **Why it matters for us**: If Public adopts prompt memory, it should not dump prompts into `memory_search` and destabilize hybrid ranking. The better fit is additive continuity: use prompt records to enrich `session_resume`, `session_bootstrap`, or resume-mode `memory_context`, while keeping `memory_search` focused on curated memory artifacts. That preserves Public’s stronger semantic, causal, and graph-aware retrieval stack.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 3: The pattern is worth borrowing, but Engram’s project-scoped trust model is not
- **Source**: [external/internal/mcp/mcp.go:857](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:857), [external/internal/mcp/mcp.go:515](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go:515), [external/internal/store/store.go:754](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:754), [external/internal/store/store.go:2459](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go:2459), [session-manager.ts:385](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385), [memory-context.ts:821](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821), [session-manager.ts:1079](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:1079)
- **What it does**: Engram’s prompt/session flow relies on normalized project names, explicit session start/end tools, and project consolidation when names drift. That is operationally clean, but trust is still mostly “session id + project name + normalization hygiene.” Public’s equivalent path is stricter: `resolveTrustedSession()` rejects caller-supplied sessions that are not server-managed and identity-correlated, and completed sessions clear working memory immediately.
- **Why it matters for us**: The prompt-memory idea ports well; the trust model does not. If Public adds a first-class prompt lane, it should bind prompts to trusted server sessions and governed tenant/user/agent/shared-space scope, not to project names as the primary isolation primitive. Otherwise we would weaken a system that is already stronger than Engram on multi-actor safety.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [CLAUDE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md)
- [external/AGENTS.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/AGENTS.md)
- [external/docs/ARCHITECTURE.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/docs/ARCHITECTURE.md)
- [external/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/README.md)
- [external/internal/mcp/mcp.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/mcp/mcp.go)
- [external/internal/store/store.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/001-engram-main/external/internal/store/store.go)
- [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [session-resume.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts)
- [session-bootstrap.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts)
- [session-manager.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
- [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts)
- [generate-context.js](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js)
- [session-lifecycle.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts)

## Assessment
- New information ratio: 0.62
- Questions addressed: Q1, Q2, Q5, Q7, Q8, Q9, Q10
- Questions answered: Q2, Q5, Q8, Q9, Q10

## Reflection
- What worked: tracing the pattern from `mem_save_prompt` registration into `handleSavePrompt()`, then through `user_prompts`/`prompts_fts`/sync/export/import and finally `FormatContext()` exposed that this is a full architectural lane, not a single tool; comparing that directly to Public’s `memory_context` resume injection and trusted-session lifecycle made the fit boundary very clear.
- What did not work: CocoIndex did not produce a usable pass on this Go-focused slice in this run, so I fell back to `rg` plus line-anchored reads; the strict validator again returned `PASSED` while also emitting `cannot create temp file for here document: Operation not permitted`, and this sandbox snapshot lacks the expected Level 3 phase docs at the phase root, so I kept the iteration read-only instead of attempting packet repair.

## Recommended Next Focus
Trace phase 003 and 004 specifically for whether they offer a better retrieval or ranking model for durable prompt/intent records, then design a Public-side prompt-memory sidecar that is resume-only by default, governed by trusted session scope, and explicitly separate from live `memory_search` ranking.
